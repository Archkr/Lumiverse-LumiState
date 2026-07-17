// @bun
// src/protocol.ts
var LUMI_STATE_PROTOCOL = "lumi_state.v1";
var LUMI_STATE_SCHEMA_VERSION = 1;
var LUMI_STATE_SCENE_ENDPOINT = "lumi_state.scene.current";
var SOURCE_DEFINITIONS = [
  { extensionId: "lumi_weather", label: "LumiWeather", endpoint: "lumi_weather.state.current" },
  { extensionId: "agent_world", label: "LumiWorld", endpoint: "agent_world.state.current" },
  { extensionId: "lumi_mind", label: "LumiMind", endpoint: "lumi_mind.state.current" }
];
var ENTITY_KINDS = new Set(["character", "persona", "npc", "object", "thread"]);
var FRESHNESS_VALUES = new Set(["fresh", "stale", "unavailable"]);
var THREAD_STATUSES = new Set(["active", "resolved", "abandoned", "unknown"]);
var MAX_CLAIMS_PER_KIND = 250;
function isRecord(value) {
  return !!value && typeof value === "object" && !Array.isArray(value);
}
function cleanString(value, maxLength = 512) {
  if (typeof value !== "string")
    return null;
  const cleaned = value.trim().replace(/\s+/g, " ");
  return cleaned ? cleaned.slice(0, maxLength) : null;
}
function finiteNumber(value) {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}
function nonNegativeInteger(value) {
  const number = finiteNumber(value);
  return number == null || number < 0 ? null : Math.round(number);
}
function nullableString(value, maxLength = 512) {
  return value == null ? null : cleanString(value, maxLength);
}
function parseEntityRef(value) {
  if (!isRecord(value))
    return null;
  const namespace = cleanString(value.namespace, 96);
  const id = cleanString(value.id, 256);
  const kind = cleanString(value.kind, 32);
  if (!namespace || !id || !kind || !ENTITY_KINDS.has(kind))
    return null;
  return { namespace, id, kind };
}
function parseSubject(value) {
  if (!isRecord(value))
    return null;
  if (value.kind === "scene")
    return { kind: "scene" };
  if (value.kind !== "actor")
    return null;
  const actor = parseEntityRef(value.actor);
  return actor ? { kind: "actor", actor } : null;
}
function parseProvenance(value) {
  if (!isRecord(value))
    return null;
  const extensionId = cleanString(value.extensionId, 96);
  const method = cleanString(value.method, 64);
  const observedAt = finiteNumber(value.observedAt);
  if (!extensionId || !method || observedAt == null || observedAt < 0)
    return null;
  const confidenceValue = finiteNumber(value.confidence);
  const confidence = confidenceValue == null ? undefined : Math.max(0, Math.min(1, confidenceValue));
  const derivedFrom = Array.isArray(value.derivedFrom) ? value.derivedFrom.slice(0, 16).map((item) => {
    if (!isRecord(item))
      return null;
    const endpoint = cleanString(item.endpoint, 160);
    const chatId = cleanString(item.chatId, 256);
    const revision = nonNegativeInteger(item.revision);
    return endpoint && chatId && revision != null ? { endpoint, chatId, revision } : null;
  }).filter((item) => !!item) : undefined;
  return {
    extensionId,
    method,
    observedAt,
    ...confidence !== undefined ? { confidence } : {},
    ...derivedFrom?.length ? { derivedFrom } : {}
  };
}
function requireAll(items) {
  return items.some((item) => item == null) ? null : items;
}
function parseLocations(value) {
  if (!Array.isArray(value))
    return null;
  return requireAll(value.slice(0, MAX_CLAIMS_PER_KIND).map((item) => {
    if (!isRecord(item))
      return null;
    const id = cleanString(item.id, 256);
    const subject = parseSubject(item.subject);
    const label = cleanString(item.label, 512);
    const provenance = parseProvenance(item.provenance);
    return id && subject && label && provenance ? { id, subject, label, provenance } : null;
  }));
}
function parseTimes(value) {
  if (!Array.isArray(value))
    return null;
  return requireAll(value.slice(0, MAX_CLAIMS_PER_KIND).map((item) => {
    if (!isRecord(item))
      return null;
    const id = cleanString(item.id, 256);
    const subject = parseSubject(item.subject);
    const clock = cleanString(item.clock, 64);
    const provenance = parseProvenance(item.provenance);
    const day = item.day == null ? null : nonNegativeInteger(item.day);
    const hourValue = item.hour == null ? null : finiteNumber(item.hour);
    const hour = hourValue == null ? null : Math.max(0, Math.min(23, Math.round(hourValue)));
    const running = item.running == null ? null : typeof item.running === "boolean" ? item.running : null;
    if (!id || !subject || !clock || !provenance)
      return null;
    return {
      id,
      subject,
      clock,
      date: nullableString(item.date, 32),
      time: nullableString(item.time, 32),
      day,
      hour,
      running,
      timezone: nullableString(item.timezone, 64),
      provenance
    };
  }));
}
function parseCast(value) {
  if (!Array.isArray(value))
    return null;
  return requireAll(value.slice(0, MAX_CLAIMS_PER_KIND).map((item) => {
    if (!isRecord(item))
      return null;
    const id = cleanString(item.id, 256);
    const actor = parseEntityRef(item.actor);
    const links = Array.isArray(item.links) ? item.links.slice(0, 16).map(parseEntityRef).filter((link) => !!link) : [];
    const name = cleanString(item.name, 256);
    const aliases = Array.isArray(item.aliases) ? item.aliases.map((alias) => cleanString(alias, 256)).filter((alias) => !!alias).slice(0, 32) : [];
    const provenance = parseProvenance(item.provenance);
    if (!id || !actor || !name || !provenance || typeof item.present !== "boolean" || typeof item.confirmed !== "boolean")
      return null;
    return {
      id,
      actor,
      links,
      name,
      aliases,
      present: item.present,
      confirmed: item.confirmed,
      publicStance: cleanString(item.publicStance, 512) ?? "",
      provenance
    };
  }));
}
function parseObjects(value) {
  if (!Array.isArray(value))
    return null;
  return requireAll(value.slice(0, MAX_CLAIMS_PER_KIND).map((item) => {
    if (!isRecord(item))
      return null;
    const id = cleanString(item.id, 256);
    const object = parseEntityRef(item.object);
    const name = cleanString(item.name, 256);
    const provenance = parseProvenance(item.provenance);
    return id && object && name && provenance ? { id, object, name, state: cleanString(item.state, 512) ?? "", provenance } : null;
  }));
}
function parseAttributes(value) {
  if (!isRecord(value))
    return {};
  const entries = Object.entries(value).slice(0, 64).filter((entry) => {
    const item = entry[1];
    return item == null || typeof item === "string" || typeof item === "number" || typeof item === "boolean";
  }).map(([key, item]) => [key.slice(0, 96), typeof item === "string" ? item.slice(0, 1024) : item]);
  return Object.fromEntries(entries);
}
function parseConditions(value) {
  if (!Array.isArray(value))
    return null;
  return requireAll(value.slice(0, MAX_CLAIMS_PER_KIND).map((item) => {
    if (!isRecord(item))
      return null;
    const id = cleanString(item.id, 256);
    const subject = parseSubject(item.subject);
    const kind = cleanString(item.kind, 96);
    const label = cleanString(item.label, 512);
    const provenance = parseProvenance(item.provenance);
    return id && subject && kind && label && provenance ? { id, subject, kind, label, attributes: parseAttributes(item.attributes), provenance } : null;
  }));
}
function parseThreads(value) {
  if (!Array.isArray(value))
    return null;
  return requireAll(value.slice(0, MAX_CLAIMS_PER_KIND).map((item) => {
    if (!isRecord(item))
      return null;
    const id = cleanString(item.id, 256);
    const thread = parseEntityRef(item.thread);
    const label = cleanString(item.label, 512);
    const status = cleanString(item.status, 32);
    const provenance = parseProvenance(item.provenance);
    return id && thread && label && status && THREAD_STATUSES.has(status) && provenance ? { id, thread, label, status, summary: cleanString(item.summary, 1024) ?? "", provenance } : null;
  }));
}
function parseLumiStateSnapshot(value, expectedEndpoint, expectedExtensionId) {
  if (!isRecord(value))
    return { ok: false, snapshot: null, error: "Snapshot is not an object." };
  if (value.protocol !== LUMI_STATE_PROTOCOL || value.schemaVersion !== LUMI_STATE_SCHEMA_VERSION) {
    return { ok: false, snapshot: null, error: "Unsupported LumiState protocol or schema version." };
  }
  if (!isRecord(value.source) || !isRecord(value.state))
    return { ok: false, snapshot: null, error: "Snapshot source or state is missing." };
  const extensionId = cleanString(value.source.extensionId, 96);
  const extensionVersion = cleanString(value.source.extensionVersion, 64);
  const endpoint = cleanString(value.source.endpoint, 160);
  if (!extensionId || !extensionVersion || !endpoint)
    return { ok: false, snapshot: null, error: "Snapshot source metadata is invalid." };
  if (expectedEndpoint && endpoint !== expectedEndpoint)
    return { ok: false, snapshot: null, error: "Snapshot endpoint does not match its registered source." };
  if (expectedExtensionId && extensionId !== expectedExtensionId)
    return { ok: false, snapshot: null, error: "Snapshot extension identity does not match its registered source." };
  const chatId = value.chatId == null ? null : cleanString(value.chatId, 256);
  const revision = nonNegativeInteger(value.revision);
  const freshness = cleanString(value.freshness, 32);
  const generatedAt = finiteNumber(value.generatedAt);
  const updatedAt = value.updatedAt == null ? null : finiteNumber(value.updatedAt);
  const visibility = cleanString(value.visibility, 16);
  if (value.chatId != null && !chatId)
    return { ok: false, snapshot: null, error: "Snapshot chat ID is invalid." };
  if (revision == null || !freshness || !FRESHNESS_VALUES.has(freshness) || generatedAt == null || generatedAt < 0) {
    return { ok: false, snapshot: null, error: "Snapshot revision or freshness metadata is invalid." };
  }
  if (updatedAt != null && updatedAt < 0)
    return { ok: false, snapshot: null, error: "Snapshot update timestamp is invalid." };
  if (visibility !== "public" && visibility !== "private")
    return { ok: false, snapshot: null, error: "Snapshot visibility is invalid." };
  const locations = parseLocations(value.state.locations);
  const times = parseTimes(value.state.times);
  const cast = parseCast(value.state.cast);
  const objects = parseObjects(value.state.objects);
  const conditions = parseConditions(value.state.conditions);
  const threads = parseThreads(value.state.threads);
  if (!locations || !times || !cast || !objects || !conditions || !threads) {
    return { ok: false, snapshot: null, error: "Snapshot claim collections are invalid." };
  }
  return {
    ok: true,
    error: null,
    snapshot: {
      protocol: LUMI_STATE_PROTOCOL,
      schemaVersion: LUMI_STATE_SCHEMA_VERSION,
      source: { extensionId, extensionVersion, endpoint },
      chatId,
      revision,
      freshness,
      generatedAt,
      updatedAt,
      visibility,
      state: { locations, times, cast, objects, conditions, threads }
    }
  };
}
function emptyLumiStateScene() {
  return { locations: [], times: [], cast: [], objects: [], conditions: [], threads: [] };
}
function selectMonotonicSnapshot(previous, incoming) {
  if (!previous || previous.chatId !== incoming.chatId || previous.source.endpoint !== incoming.source.endpoint) {
    return { accepted: true, reason: null, snapshot: incoming };
  }
  if (incoming.revision < previous.revision) {
    return { accepted: false, reason: "regressed", snapshot: previous };
  }
  if (incoming.revision === previous.revision && JSON.stringify(incoming.state) !== JSON.stringify(previous.state)) {
    return { accepted: false, reason: "changed_without_revision", snapshot: previous };
  }
  return { accepted: true, reason: null, snapshot: incoming };
}
function subjectKey(subject) {
  return subject.kind === "scene" ? "scene" : `actor:${subject.actor.namespace}:${subject.actor.id}`;
}
function hashText(value) {
  let hash = 2166136261;
  for (let index = 0;index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}
function conflictGroups(kind, claims, keyOf, signatureOf, idOf, sourceOf) {
  const groups = new Map;
  for (const claim of claims)
    groups.set(keyOf(claim), [...groups.get(keyOf(claim)) ?? [], claim]);
  const conflicts = [];
  for (const [subject, group] of groups) {
    const signatures = new Set(group.map(signatureOf));
    const sources = [...new Set(group.map(sourceOf))].sort();
    if (signatures.size < 2 || sources.length < 2)
      continue;
    const claimIds = group.map(idOf).sort();
    conflicts.push({
      id: `${kind}:${hashText(`${subject}|${claimIds.join("|")}`)}`,
      kind,
      subject,
      sourceExtensions: sources,
      claimIds,
      message: `Multiple ${kind} claims disagree for ${subject}.`
    });
  }
  return conflicts;
}
function castIdentityKey(claim) {
  const hostLink = claim.links.find((link) => link.namespace.startsWith("host."));
  const identity = hostLink ?? claim.actor;
  return `${identity.namespace}:${identity.id}`;
}
function detectLumiStateConflicts(scene) {
  return [
    ...conflictGroups("location", scene.locations, (claim) => subjectKey(claim.subject), (claim) => claim.label.trim().toLocaleLowerCase(), (claim) => claim.id, (claim) => claim.provenance.extensionId),
    ...conflictGroups("time", scene.times, (claim) => `${subjectKey(claim.subject)}:${claim.clock}`, (claim) => JSON.stringify([claim.date, claim.time, claim.day, claim.hour, claim.running, claim.timezone]), (claim) => claim.id, (claim) => claim.provenance.extensionId),
    ...conflictGroups("condition", scene.conditions, (claim) => `${subjectKey(claim.subject)}:${claim.kind}`, (claim) => JSON.stringify([claim.label.trim().toLocaleLowerCase(), claim.attributes]), (claim) => claim.id, (claim) => claim.provenance.extensionId),
    ...conflictGroups("cast", scene.cast, castIdentityKey, (claim) => JSON.stringify([claim.name.trim().toLocaleLowerCase(), claim.present, claim.publicStance]), (claim) => claim.id, (claim) => claim.provenance.extensionId)
  ].sort((left, right) => left.id.localeCompare(right.id));
}
function aggregateInputSignature(chatId, observations) {
  return JSON.stringify({
    chatId,
    sources: observations.map((source) => ({
      endpoint: source.endpoint,
      status: source.status,
      chatId: source.snapshot?.chatId ?? null,
      revision: source.snapshot?.revision ?? null,
      freshness: source.snapshot?.freshness ?? null
    })).sort((left, right) => left.endpoint.localeCompare(right.endpoint))
  });
}
function mergeLumiStateSnapshots(chatId, observations, aggregateRevision, extensionVersion, generatedAt = Date.now()) {
  const included = observations.filter((source) => !!source.snapshot && source.snapshot.chatId === chatId && (source.status === "connected" || source.status === "stale"));
  const scene = emptyLumiStateScene();
  for (const source of included) {
    const state = source.snapshot.state;
    scene.locations.push(...state.locations);
    scene.times.push(...state.times);
    scene.cast.push(...state.cast);
    scene.objects.push(...state.objects);
    scene.conditions.push(...state.conditions);
    scene.threads.push(...state.threads);
  }
  const updatedValues = included.map((source) => source.snapshot?.updatedAt ?? null).filter((value) => value != null);
  const freshness = !chatId || included.length === 0 ? "unavailable" : included.some((source) => source.status === "stale") ? "stale" : "fresh";
  const sources = observations.map((source) => ({
    extensionId: source.extensionId,
    label: source.label,
    endpoint: source.endpoint,
    status: source.status,
    error: source.error,
    chatId: source.snapshot?.chatId ?? null,
    revision: source.snapshot?.revision ?? null,
    freshness: source.snapshot?.freshness ?? null,
    updatedAt: source.snapshot?.updatedAt ?? null
  }));
  return {
    protocol: LUMI_STATE_PROTOCOL,
    schemaVersion: LUMI_STATE_SCHEMA_VERSION,
    source: { extensionId: "lumi_state", extensionVersion, endpoint: LUMI_STATE_SCENE_ENDPOINT },
    chatId,
    revision: chatId ? Math.max(0, Math.round(aggregateRevision)) : 0,
    freshness,
    generatedAt,
    updatedAt: updatedValues.length ? Math.max(...updatedValues) : null,
    visibility: "public",
    state: scene,
    sources,
    conflicts: detectLumiStateConflicts(scene)
  };
}

// src/backend.ts
var EXTENSION_VERSION = "0.1.0";
var POLLING_INTERVAL_MS = 5000;
var META_DIR = "aggregate-meta";
var sessions = new Map;
var refreshQueues = new Map;
var refreshTimers = new Map;
var lastSnapshots = new Map;
var acceptedSourceSnapshots = new Map;
var lastFrontendUserId = null;
function hasChatsPermission() {
  try {
    return spindle.permissions.has("chats");
  } catch {
    return false;
  }
}
function send(userId, payload) {
  spindle.sendToFrontend(payload, userId);
}
function extractChatId(value) {
  if (!value || typeof value !== "object" || Array.isArray(value))
    return null;
  const record = value;
  const nested = record.chat && typeof record.chat === "object" && !Array.isArray(record.chat) ? record.chat : null;
  const candidate = [record.chatId, record.chat_id, nested?.id].find((item) => typeof item === "string" && item.trim());
  return typeof candidate === "string" ? candidate.trim() : null;
}
function safeChatKey(chatId) {
  let hash = 2166136261;
  for (let index = 0;index < chatId.length; index += 1) {
    hash ^= chatId.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  const prefix = chatId.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 120) || "chat";
  return `${prefix}-${(hash >>> 0).toString(16).padStart(8, "0")}`;
}
function metaPath(chatId) {
  return `${META_DIR}/${safeChatKey(chatId)}.json`;
}
async function loadAggregateMeta(userId, chatId) {
  try {
    const value = await spindle.userStorage.getJson(metaPath(chatId), { fallback: null, userId });
    if (!value || value.schemaVersion !== 1 || !Number.isFinite(value.revision) || typeof value.signature !== "string")
      return null;
    return { schemaVersion: 1, revision: Math.max(0, Math.round(value.revision)), signature: value.signature };
  } catch {
    return null;
  }
}
async function resolveAggregateRevision(userId, chatId, observations) {
  if (!chatId)
    return 0;
  const signature = aggregateInputSignature(chatId, observations);
  const stored = await loadAggregateMeta(userId, chatId);
  if (stored?.signature === signature)
    return stored.revision;
  const revision = Math.max(1, (stored?.revision ?? 0) + 1);
  await spindle.userStorage.setJson(metaPath(chatId), { schemaVersion: 1, revision, signature }, { indent: 2, userId });
  return revision;
}
function missingError(error) {
  const message = error instanceof Error ? error.message : String(error);
  return /not registered/i.test(message) ? "Endpoint is not registered." : "Endpoint could not be read.";
}
async function readSource(source, activeChatId, userId) {
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
        error: decision.reason === "regressed" ? "Source revision moved backward; the last accepted snapshot was retained." : "Source changed without a revision increase; the last accepted snapshot was retained.",
        snapshot: decision.snapshot
      };
    }
    acceptedSourceSnapshots.set(acceptedKey, decision.snapshot);
    return {
      ...source,
      status: parsed.snapshot.freshness === "stale" ? "stale" : "connected",
      error: null,
      snapshot: decision.snapshot
    };
  } catch (error) {
    return { ...source, status: "missing", error: missingError(error), snapshot: null };
  }
}
async function resolveActiveChatId(userId, explicit, explicitProvided) {
  if (explicitProvided) {
    const chatId = typeof explicit === "string" && explicit.trim() ? explicit.trim() : null;
    sessions.set(userId, { chatId });
    return chatId;
  }
  const remembered = sessions.get(userId)?.chatId;
  if (remembered !== undefined)
    return remembered;
  if (!hasChatsPermission())
    return null;
  try {
    const active = await spindle.chats.getActive(userId);
    const chatId = typeof active?.id === "string" && active.id.trim() ? active.id.trim() : null;
    sessions.set(userId, { chatId });
    return chatId;
  } catch {
    return null;
  }
}
async function performRefresh(userId, explicitChatId, explicitProvided = false, forceFrontend = false) {
  const chatId = await resolveActiveChatId(userId, explicitChatId, explicitProvided);
  const observations = await Promise.all(SOURCE_DEFINITIONS.map((source) => readSource(source, chatId, userId)));
  const revision = await resolveAggregateRevision(userId, chatId, observations);
  const snapshot = mergeLumiStateSnapshots(chatId, observations, revision, EXTENSION_VERSION);
  spindle.rpcPool.sync("scene.current", snapshot, { requires: [] });
  const previous = lastSnapshots.get(userId);
  lastSnapshots.set(userId, snapshot);
  const changed = !previous || previous.chatId !== snapshot.chatId || previous.revision !== snapshot.revision || previous.freshness !== snapshot.freshness;
  if (forceFrontend || changed) {
    const state = {
      snapshot,
      refreshedAt: Date.now(),
      pollingIntervalMs: POLLING_INTERVAL_MS,
      chatsPermission: hasChatsPermission()
    };
    send(userId, { type: "state", state });
  }
  return snapshot;
}
function queueRefresh(userId, explicitChatId, explicitProvided = false, forceFrontend = false) {
  const previous = refreshQueues.get(userId) ?? Promise.resolve(lastSnapshots.get(userId) ?? initialSnapshot);
  const next = previous.catch(() => initialSnapshot).then(() => performRefresh(userId, explicitChatId, explicitProvided, forceFrontend));
  refreshQueues.set(userId, next);
  const cleanup = () => {
    if (refreshQueues.get(userId) === next)
      refreshQueues.delete(userId);
  };
  next.then(cleanup, cleanup);
  return next;
}
function runBackgroundRefresh(promise) {
  promise.catch((error) => {
    spindle.log.warn(`LumiState background refresh failed: ${error instanceof Error ? error.message : String(error)}`);
  });
}
function scheduleRefresh(userId, delayMs = 250) {
  const existing = refreshTimers.get(userId);
  if (existing)
    clearTimeout(existing);
  refreshTimers.set(userId, setTimeout(() => {
    refreshTimers.delete(userId);
    runBackgroundRefresh(queueRefresh(userId));
  }, delayMs));
}
function refreshAll() {
  for (const userId of sessions.keys())
    scheduleRefresh(userId, 0);
}
var unavailableObservations = SOURCE_DEFINITIONS.map((source) => ({
  ...source,
  status: "unavailable",
  error: null,
  snapshot: null
}));
var initialSnapshot = mergeLumiStateSnapshots(null, unavailableObservations, 0, EXTENSION_VERSION);
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
    mode: "sync"
  }]
}, { requires: [] });
spindle.rpcPool.sync("scene.current", initialSnapshot, { requires: [] });
spindle.onFrontendMessage(async (raw, userId) => {
  lastFrontendUserId = userId;
  const message = raw;
  if (message.type !== "ready" && message.type !== "refresh")
    return;
  try {
    await queueRefresh(userId, message.chatId, "chatId" in message, true);
  } catch (error) {
    spindle.log.warn(`LumiState refresh failed: ${error instanceof Error ? error.message : String(error)}`);
    send(userId, { type: "error", message: "LumiState could not refresh its shared scene." });
  }
});
var eventApi = spindle;
eventApi.on?.("CHAT_SWITCHED", (payload, eventUserId) => {
  const userId = eventUserId || lastFrontendUserId;
  if (!userId)
    return;
  const chatId = extractChatId(payload);
  sessions.set(userId, { chatId });
  runBackgroundRefresh(queueRefresh(userId, chatId, true, true));
});
for (const event of ["MESSAGE_SENT", "MESSAGE_EDITED", "MESSAGE_DELETED", "MESSAGE_SWIPED", "SWIPE_EDITED", "GENERATION_ENDED"]) {
  eventApi.on?.(event, (payload, eventUserId) => {
    const userId = eventUserId || lastFrontendUserId;
    if (!userId)
      return;
    const chatId = extractChatId(payload) ?? extractChatId(payload?.message);
    if (chatId && sessions.get(userId)?.chatId !== chatId)
      return;
    scheduleRefresh(userId, event === "GENERATION_ENDED" ? 900 : 300);
  });
}
for (const event of ["SPINDLE_EXTENSION_LOADED", "SPINDLE_EXTENSION_UNLOADED"]) {
  eventApi.on?.(event, refreshAll);
}
setInterval(refreshAll, POLLING_INTERVAL_MS);
spindle.permissions.onChanged(() => refreshAll());
spindle.log.info("LumiState v0.1.0 loaded \u2014 shared scene bridge ready.");
