declare const spindle: import("lumiverse-spindle-types").SpindleAPI;

import type { BackendToFrontend, FrontendToBackend, LumiStateFrontendState } from "./messages";
import {
  SOURCE_DEFINITIONS,
  aggregateInputSignature,
  mergeLumiStateSnapshots,
  parseLumiStateSnapshot,
  selectMonotonicSnapshot,
  type LumiStateAggregateSnapshotV1,
  type LumiStateSourceObservationV1,
} from "./protocol";

const EXTENSION_VERSION = "0.1.0";
const POLLING_INTERVAL_MS = 5_000;
const META_DIR = "aggregate-meta";

interface ActiveSession {
  chatId: string | null;
}

interface AggregateMetaV1 {
  schemaVersion: 1;
  revision: number;
  signature: string;
}

const sessions = new Map<string, ActiveSession>();
const refreshQueues = new Map<string, Promise<LumiStateAggregateSnapshotV1>>();
const refreshTimers = new Map<string, ReturnType<typeof setTimeout>>();
const lastSnapshots = new Map<string, LumiStateAggregateSnapshotV1>();
const acceptedSourceSnapshots = new Map<string, import("./protocol").LumiStateSnapshotV1>();
let lastFrontendUserId: string | null = null;

function hasChatsPermission(): boolean {
  try {
    return spindle.permissions.has("chats");
  } catch {
    return false;
  }
}

function send(userId: string, payload: BackendToFrontend): void {
  spindle.sendToFrontend(payload, userId);
}

function extractChatId(value: unknown): string | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const record = value as Record<string, unknown>;
  const nested = record.chat && typeof record.chat === "object" && !Array.isArray(record.chat)
    ? record.chat as Record<string, unknown>
    : null;
  const candidate = [record.chatId, record.chat_id, nested?.id].find((item) => typeof item === "string" && item.trim());
  return typeof candidate === "string" ? candidate.trim() : null;
}

function safeChatKey(chatId: string): string {
  let hash = 2166136261;
  for (let index = 0; index < chatId.length; index += 1) {
    hash ^= chatId.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  const prefix = chatId.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 120) || "chat";
  return `${prefix}-${(hash >>> 0).toString(16).padStart(8, "0")}`;
}

function metaPath(chatId: string): string {
  return `${META_DIR}/${safeChatKey(chatId)}.json`;
}

async function loadAggregateMeta(userId: string, chatId: string): Promise<AggregateMetaV1 | null> {
  try {
    const value = await spindle.userStorage.getJson<AggregateMetaV1 | null>(metaPath(chatId), { fallback: null, userId });
    if (!value || value.schemaVersion !== 1 || !Number.isFinite(value.revision) || typeof value.signature !== "string") return null;
    return { schemaVersion: 1, revision: Math.max(0, Math.round(value.revision)), signature: value.signature };
  } catch {
    return null;
  }
}

async function resolveAggregateRevision(
  userId: string,
  chatId: string | null,
  observations: LumiStateSourceObservationV1[],
): Promise<number> {
  if (!chatId) return 0;
  const signature = aggregateInputSignature(chatId, observations);
  const stored = await loadAggregateMeta(userId, chatId);
  if (stored?.signature === signature) return stored.revision;
  const revision = Math.max(1, (stored?.revision ?? 0) + 1);
  await spindle.userStorage.setJson(
    metaPath(chatId),
    { schemaVersion: 1, revision, signature },
    { indent: 2, userId },
  );
  return revision;
}

function missingError(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);
  return /not registered/i.test(message) ? "Endpoint is not registered." : "Endpoint could not be read.";
}

async function readSource(
  source: (typeof SOURCE_DEFINITIONS)[number],
  activeChatId: string | null,
  userId: string,
): Promise<LumiStateSourceObservationV1> {
  try {
    const raw = await spindle.rpcPool.read(source.endpoint);
    const parsed = parseLumiStateSnapshot(raw, source.endpoint, source.extensionId);
    if (!parsed.ok || !parsed.snapshot) {
      return { ...source, status: "invalid", error: parsed.error ?? "Snapshot is invalid.", snapshot: null };
    }
    if (parsed.snapshot.visibility !== "public") {
      return { ...source, status: "invalid", error: "The shared endpoint did not return a public snapshot.", snapshot: null };
    }
    if (parsed.snapshot.chatId !== activeChatId) {
      return { ...source, status: "chat_mismatch", error: "Snapshot belongs to a different active chat.", snapshot: parsed.snapshot };
    }
    if (parsed.snapshot.freshness === "unavailable") {
      return { ...source, status: "unavailable", error: null, snapshot: parsed.snapshot };
    }
    const acceptedKey = `${userId}:${activeChatId}:${source.endpoint}`;
    const previous = acceptedSourceSnapshots.get(acceptedKey);
    const decision = selectMonotonicSnapshot(previous, parsed.snapshot);
    if (!decision.accepted) {
      return {
        ...source,
        status: "stale",
        error: decision.reason === "regressed"
          ? "Source revision moved backward; the last accepted snapshot was retained."
          : "Source changed without a revision increase; the last accepted snapshot was retained.",
        snapshot: decision.snapshot,
      };
    }
    acceptedSourceSnapshots.set(acceptedKey, decision.snapshot);
    return {
      ...source,
      status: parsed.snapshot.freshness === "stale" ? "stale" : "connected",
      error: null,
      snapshot: decision.snapshot,
    };
  } catch (error) {
    return { ...source, status: "missing", error: missingError(error), snapshot: null };
  }
}

async function resolveActiveChatId(userId: string, explicit: string | null | undefined, explicitProvided: boolean): Promise<string | null> {
  if (explicitProvided) {
    const chatId = typeof explicit === "string" && explicit.trim() ? explicit.trim() : null;
    sessions.set(userId, { chatId });
    return chatId;
  }
  const remembered = sessions.get(userId)?.chatId;
  if (remembered !== undefined) return remembered;
  if (!hasChatsPermission()) return null;
  try {
    const active = await (spindle.chats as any).getActive(userId);
    const chatId = typeof active?.id === "string" && active.id.trim() ? active.id.trim() : null;
    sessions.set(userId, { chatId });
    return chatId;
  } catch {
    return null;
  }
}

async function performRefresh(
  userId: string,
  explicitChatId?: string | null,
  explicitProvided = false,
  forceFrontend = false,
): Promise<LumiStateAggregateSnapshotV1> {
  const chatId = await resolveActiveChatId(userId, explicitChatId, explicitProvided);
  const observations = await Promise.all(SOURCE_DEFINITIONS.map((source) => readSource(source, chatId, userId)));
  const revision = await resolveAggregateRevision(userId, chatId, observations);
  const snapshot = mergeLumiStateSnapshots(chatId, observations, revision, EXTENSION_VERSION);
  spindle.rpcPool.sync("scene.current", snapshot, { requires: [] });

  const previous = lastSnapshots.get(userId);
  lastSnapshots.set(userId, snapshot);
  const changed = !previous || previous.chatId !== snapshot.chatId || previous.revision !== snapshot.revision || previous.freshness !== snapshot.freshness;
  if (forceFrontend || changed) {
    const state: LumiStateFrontendState = {
      snapshot,
      refreshedAt: Date.now(),
      pollingIntervalMs: POLLING_INTERVAL_MS,
      chatsPermission: hasChatsPermission(),
    };
    send(userId, { type: "state", state });
  }
  return snapshot;
}

function queueRefresh(
  userId: string,
  explicitChatId?: string | null,
  explicitProvided = false,
  forceFrontend = false,
): Promise<LumiStateAggregateSnapshotV1> {
  const previous = refreshQueues.get(userId) ?? Promise.resolve(lastSnapshots.get(userId) ?? initialSnapshot);
  const next = previous.catch(() => initialSnapshot).then(() => performRefresh(userId, explicitChatId, explicitProvided, forceFrontend));
  refreshQueues.set(userId, next);
  const cleanup = () => {
    if (refreshQueues.get(userId) === next) refreshQueues.delete(userId);
  };
  void next.then(cleanup, cleanup);
  return next;
}

function runBackgroundRefresh(promise: Promise<LumiStateAggregateSnapshotV1>): void {
  void promise.catch((error) => {
    spindle.log.warn(`LumiState background refresh failed: ${error instanceof Error ? error.message : String(error)}`);
  });
}

function scheduleRefresh(userId: string, delayMs = 250): void {
  const existing = refreshTimers.get(userId);
  if (existing) clearTimeout(existing);
  refreshTimers.set(userId, setTimeout(() => {
    refreshTimers.delete(userId);
    runBackgroundRefresh(queueRefresh(userId));
  }, delayMs));
}

function refreshAll(): void {
  for (const userId of sessions.keys()) scheduleRefresh(userId, 0);
}

const unavailableObservations: LumiStateSourceObservationV1[] = SOURCE_DEFINITIONS.map((source) => ({
  ...source,
  status: "unavailable",
  error: null,
  snapshot: null,
}));
const initialSnapshot = mergeLumiStateSnapshots(null, unavailableObservations, 0, EXTENSION_VERSION);

spindle.rpcPool.sync("contract.v1", {
  schemaVersion: 1,
  protocol: "lumi_state.v1",
  extension: "lumi_state",
  extensionVersion: EXTENSION_VERSION,
  capabilities: ["scene_aggregation", "source_validation", "conflict_detection", "interop_diagnostics"],
  endpoints: { public: "lumi_state.scene.current" },
  sources: SOURCE_DEFINITIONS.map((source) => source.endpoint),
  channels: [{
    endpoint: "lumi_state.scene.current",
    schema: "lumi_state.aggregate.v1",
    visibility: "public",
    requires: [],
    mode: "sync",
  }],
}, { requires: [] });
spindle.rpcPool.sync("scene.current", initialSnapshot, { requires: [] });

spindle.onFrontendMessage(async (raw, userId) => {
  lastFrontendUserId = userId;
  const message = raw as FrontendToBackend;
  if (message.type !== "ready" && message.type !== "refresh") return;
  try {
    await queueRefresh(userId, message.chatId, "chatId" in message, true);
  } catch (error) {
    spindle.log.warn(`LumiState refresh failed: ${error instanceof Error ? error.message : String(error)}`);
    send(userId, { type: "error", message: "LumiState could not refresh its shared scene." });
  }
});

const eventApi = spindle as any;
eventApi.on?.("CHAT_SWITCHED", (payload: unknown, eventUserId?: string) => {
  const userId = eventUserId || lastFrontendUserId;
  if (!userId) return;
  const chatId = extractChatId(payload);
  sessions.set(userId, { chatId });
  runBackgroundRefresh(queueRefresh(userId, chatId, true, true));
});

for (const event of ["MESSAGE_SENT", "MESSAGE_EDITED", "MESSAGE_DELETED", "MESSAGE_SWIPED", "SWIPE_EDITED", "GENERATION_ENDED"] as const) {
  eventApi.on?.(event, (payload: unknown, eventUserId?: string) => {
    const userId = eventUserId || lastFrontendUserId;
    if (!userId) return;
    const chatId = extractChatId(payload) ?? extractChatId((payload as any)?.message);
    if (chatId && sessions.get(userId)?.chatId !== chatId) return;
    scheduleRefresh(userId, event === "GENERATION_ENDED" ? 900 : 300);
  });
}

for (const event of ["SPINDLE_EXTENSION_LOADED", "SPINDLE_EXTENSION_UNLOADED"] as const) {
  eventApi.on?.(event, refreshAll);
}

setInterval(refreshAll, POLLING_INTERVAL_MS);

spindle.permissions.onChanged(() => refreshAll());
spindle.log.info("LumiState v0.1.0 loaded — shared scene bridge ready.");
