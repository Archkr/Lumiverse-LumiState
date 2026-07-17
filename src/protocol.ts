export const LUMI_STATE_PROTOCOL = "lumi_state.v1" as const;
export const LUMI_STATE_SCHEMA_VERSION = 1 as const;
export const LUMI_STATE_SCENE_ENDPOINT = "lumi_state.scene.current";

export type LumiStateFreshness = "fresh" | "stale" | "unavailable";
export type LumiStateVisibility = "public" | "private";
export type LumiStatePrimitive = string | number | boolean | null;
export type LumiStateEntityKind = "character" | "persona" | "npc" | "object" | "thread";

export interface LumiStateSourceV1 {
  extensionId: string;
  extensionVersion: string;
  endpoint: string;
}

export interface LumiStateDependencyV1 {
  endpoint: string;
  chatId: string;
  revision: number;
}

export interface LumiStateProvenanceV1 {
  extensionId: string;
  method: string;
  observedAt: number;
  confidence?: number;
  derivedFrom?: LumiStateDependencyV1[];
}

export interface LumiStateEntityRefV1 {
  namespace: string;
  id: string;
  kind: LumiStateEntityKind;
}

export type LumiStateSubjectV1 =
  | { kind: "scene" }
  | { kind: "actor"; actor: LumiStateEntityRefV1 };

export interface LumiStateLocationClaimV1 {
  id: string;
  subject: LumiStateSubjectV1;
  label: string;
  provenance: LumiStateProvenanceV1;
}

export interface LumiStateTimeClaimV1 {
  id: string;
  subject: LumiStateSubjectV1;
  clock: string;
  date: string | null;
  time: string | null;
  day: number | null;
  hour: number | null;
  running: boolean | null;
  timezone: string | null;
  provenance: LumiStateProvenanceV1;
}

export interface LumiStateCastClaimV1 {
  id: string;
  actor: LumiStateEntityRefV1;
  links: LumiStateEntityRefV1[];
  name: string;
  aliases: string[];
  present: boolean;
  confirmed: boolean;
  publicStance: string;
  provenance: LumiStateProvenanceV1;
}

export interface LumiStateObjectClaimV1 {
  id: string;
  object: LumiStateEntityRefV1;
  name: string;
  state: string;
  provenance: LumiStateProvenanceV1;
}

export interface LumiStateConditionClaimV1 {
  id: string;
  subject: LumiStateSubjectV1;
  kind: string;
  label: string;
  attributes: Record<string, LumiStatePrimitive>;
  provenance: LumiStateProvenanceV1;
}

export interface LumiStateThreadClaimV1 {
  id: string;
  thread: LumiStateEntityRefV1;
  label: string;
  status: "active" | "resolved" | "abandoned" | "unknown";
  summary: string;
  provenance: LumiStateProvenanceV1;
}

export interface LumiStateSceneV1 {
  locations: LumiStateLocationClaimV1[];
  times: LumiStateTimeClaimV1[];
  cast: LumiStateCastClaimV1[];
  objects: LumiStateObjectClaimV1[];
  conditions: LumiStateConditionClaimV1[];
  threads: LumiStateThreadClaimV1[];
}

export interface LumiStateSnapshotV1 {
  protocol: typeof LUMI_STATE_PROTOCOL;
  schemaVersion: typeof LUMI_STATE_SCHEMA_VERSION;
  source: LumiStateSourceV1;
  chatId: string | null;
  revision: number;
  freshness: LumiStateFreshness;
  generatedAt: number;
  updatedAt: number | null;
  visibility: LumiStateVisibility;
  state: LumiStateSceneV1;
}

export const SOURCE_DEFINITIONS = [
  { extensionId: "lumi_weather", label: "LumiWeather", endpoint: "lumi_weather.state.current" },
  { extensionId: "agent_world", label: "LumiWorld", endpoint: "agent_world.state.current" },
  { extensionId: "lumi_mind", label: "LumiMind", endpoint: "lumi_mind.state.current" },
] as const;

export type LumiStateSourceStatus = "connected" | "stale" | "unavailable" | "missing" | "invalid" | "chat_mismatch";

export interface LumiStateSourceObservationV1 {
  extensionId: string;
  label: string;
  endpoint: string;
  status: LumiStateSourceStatus;
  error: string | null;
  snapshot: LumiStateSnapshotV1 | null;
}

export interface LumiStateSourceSummaryV1 {
  extensionId: string;
  label: string;
  endpoint: string;
  status: LumiStateSourceStatus;
  error: string | null;
  chatId: string | null;
  revision: number | null;
  freshness: LumiStateFreshness | null;
  updatedAt: number | null;
}

export interface LumiStateConflictV1 {
  id: string;
  kind: "location" | "time" | "condition" | "cast";
  subject: string;
  sourceExtensions: string[];
  claimIds: string[];
  message: string;
}

export interface LumiStateAggregateSnapshotV1 extends LumiStateSnapshotV1 {
  source: {
    extensionId: "lumi_state";
    extensionVersion: string;
    endpoint: typeof LUMI_STATE_SCENE_ENDPOINT;
  };
  visibility: "public";
  sources: LumiStateSourceSummaryV1[];
  conflicts: LumiStateConflictV1[];
}

export interface LumiStateParseResult {
  ok: boolean;
  snapshot: LumiStateSnapshotV1 | null;
  error: string | null;
}

export interface LumiStateRevisionDecision {
  accepted: boolean;
  reason: "regressed" | "changed_without_revision" | null;
  snapshot: LumiStateSnapshotV1;
}

const ENTITY_KINDS = new Set<LumiStateEntityKind>(["character", "persona", "npc", "object", "thread"]);
const FRESHNESS_VALUES = new Set<LumiStateFreshness>(["fresh", "stale", "unavailable"]);
const THREAD_STATUSES = new Set<LumiStateThreadClaimV1["status"]>(["active", "resolved", "abandoned", "unknown"]);
const MAX_CLAIMS_PER_KIND = 250;

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function cleanString(value: unknown, maxLength = 512): string | null {
  if (typeof value !== "string") return null;
  const cleaned = value.trim().replace(/\s+/g, " ");
  return cleaned ? cleaned.slice(0, maxLength) : null;
}

function finiteNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function nonNegativeInteger(value: unknown): number | null {
  const number = finiteNumber(value);
  return number == null || number < 0 ? null : Math.round(number);
}

function nullableString(value: unknown, maxLength = 512): string | null {
  return value == null ? null : cleanString(value, maxLength);
}

function parseEntityRef(value: unknown): LumiStateEntityRefV1 | null {
  if (!isRecord(value)) return null;
  const namespace = cleanString(value.namespace, 96);
  const id = cleanString(value.id, 256);
  const kind = cleanString(value.kind, 32) as LumiStateEntityKind | null;
  if (!namespace || !id || !kind || !ENTITY_KINDS.has(kind)) return null;
  return { namespace, id, kind };
}

function parseSubject(value: unknown): LumiStateSubjectV1 | null {
  if (!isRecord(value)) return null;
  if (value.kind === "scene") return { kind: "scene" };
  if (value.kind !== "actor") return null;
  const actor = parseEntityRef(value.actor);
  return actor ? { kind: "actor", actor } : null;
}

function parseProvenance(value: unknown): LumiStateProvenanceV1 | null {
  if (!isRecord(value)) return null;
  const extensionId = cleanString(value.extensionId, 96);
  const method = cleanString(value.method, 64);
  const observedAt = finiteNumber(value.observedAt);
  if (!extensionId || !method || observedAt == null || observedAt < 0) return null;
  const confidenceValue = finiteNumber(value.confidence);
  const confidence = confidenceValue == null ? undefined : Math.max(0, Math.min(1, confidenceValue));
  const derivedFrom = Array.isArray(value.derivedFrom)
    ? value.derivedFrom.slice(0, 16).map((item): LumiStateDependencyV1 | null => {
        if (!isRecord(item)) return null;
        const endpoint = cleanString(item.endpoint, 160);
        const chatId = cleanString(item.chatId, 256);
        const revision = nonNegativeInteger(item.revision);
        return endpoint && chatId && revision != null ? { endpoint, chatId, revision } : null;
      }).filter((item): item is LumiStateDependencyV1 => !!item)
    : undefined;
  return {
    extensionId,
    method,
    observedAt,
    ...(confidence !== undefined ? { confidence } : {}),
    ...(derivedFrom?.length ? { derivedFrom } : {}),
  };
}

function requireAll<T>(items: Array<T | null>): T[] | null {
  return items.some((item) => item == null) ? null : items as T[];
}

function parseLocations(value: unknown): LumiStateLocationClaimV1[] | null {
  if (!Array.isArray(value)) return null;
  return requireAll(value.slice(0, MAX_CLAIMS_PER_KIND).map((item): LumiStateLocationClaimV1 | null => {
    if (!isRecord(item)) return null;
    const id = cleanString(item.id, 256);
    const subject = parseSubject(item.subject);
    const label = cleanString(item.label, 512);
    const provenance = parseProvenance(item.provenance);
    return id && subject && label && provenance ? { id, subject, label, provenance } : null;
  }));
}

function parseTimes(value: unknown): LumiStateTimeClaimV1[] | null {
  if (!Array.isArray(value)) return null;
  return requireAll(value.slice(0, MAX_CLAIMS_PER_KIND).map((item): LumiStateTimeClaimV1 | null => {
    if (!isRecord(item)) return null;
    const id = cleanString(item.id, 256);
    const subject = parseSubject(item.subject);
    const clock = cleanString(item.clock, 64);
    const provenance = parseProvenance(item.provenance);
    const day = item.day == null ? null : nonNegativeInteger(item.day);
    const hourValue = item.hour == null ? null : finiteNumber(item.hour);
    const hour = hourValue == null ? null : Math.max(0, Math.min(23, Math.round(hourValue)));
    const running = item.running == null ? null : typeof item.running === "boolean" ? item.running : null;
    if (!id || !subject || !clock || !provenance) return null;
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
      provenance,
    };
  }));
}

function parseCast(value: unknown): LumiStateCastClaimV1[] | null {
  if (!Array.isArray(value)) return null;
  return requireAll(value.slice(0, MAX_CLAIMS_PER_KIND).map((item): LumiStateCastClaimV1 | null => {
    if (!isRecord(item)) return null;
    const id = cleanString(item.id, 256);
    const actor = parseEntityRef(item.actor);
    const links = Array.isArray(item.links)
      ? item.links.slice(0, 16).map(parseEntityRef).filter((link): link is LumiStateEntityRefV1 => !!link)
      : [];
    const name = cleanString(item.name, 256);
    const aliases = Array.isArray(item.aliases)
      ? item.aliases.map((alias) => cleanString(alias, 256)).filter((alias): alias is string => !!alias).slice(0, 32)
      : [];
    const provenance = parseProvenance(item.provenance);
    if (!id || !actor || !name || !provenance || typeof item.present !== "boolean" || typeof item.confirmed !== "boolean") return null;
    return {
      id,
      actor,
      links,
      name,
      aliases,
      present: item.present,
      confirmed: item.confirmed,
      publicStance: cleanString(item.publicStance, 512) ?? "",
      provenance,
    };
  }));
}

function parseObjects(value: unknown): LumiStateObjectClaimV1[] | null {
  if (!Array.isArray(value)) return null;
  return requireAll(value.slice(0, MAX_CLAIMS_PER_KIND).map((item): LumiStateObjectClaimV1 | null => {
    if (!isRecord(item)) return null;
    const id = cleanString(item.id, 256);
    const object = parseEntityRef(item.object);
    const name = cleanString(item.name, 256);
    const provenance = parseProvenance(item.provenance);
    return id && object && name && provenance
      ? { id, object, name, state: cleanString(item.state, 512) ?? "", provenance }
      : null;
  }));
}

function parseAttributes(value: unknown): Record<string, LumiStatePrimitive> {
  if (!isRecord(value)) return {};
  const entries = Object.entries(value).slice(0, 64).filter((entry): entry is [string, LumiStatePrimitive] => {
    const item = entry[1];
    return item == null || typeof item === "string" || typeof item === "number" || typeof item === "boolean";
  }).map(([key, item]) => [key.slice(0, 96), typeof item === "string" ? item.slice(0, 1024) : item] as const);
  return Object.fromEntries(entries);
}

function parseConditions(value: unknown): LumiStateConditionClaimV1[] | null {
  if (!Array.isArray(value)) return null;
  return requireAll(value.slice(0, MAX_CLAIMS_PER_KIND).map((item): LumiStateConditionClaimV1 | null => {
    if (!isRecord(item)) return null;
    const id = cleanString(item.id, 256);
    const subject = parseSubject(item.subject);
    const kind = cleanString(item.kind, 96);
    const label = cleanString(item.label, 512);
    const provenance = parseProvenance(item.provenance);
    return id && subject && kind && label && provenance
      ? { id, subject, kind, label, attributes: parseAttributes(item.attributes), provenance }
      : null;
  }));
}

function parseThreads(value: unknown): LumiStateThreadClaimV1[] | null {
  if (!Array.isArray(value)) return null;
  return requireAll(value.slice(0, MAX_CLAIMS_PER_KIND).map((item): LumiStateThreadClaimV1 | null => {
    if (!isRecord(item)) return null;
    const id = cleanString(item.id, 256);
    const thread = parseEntityRef(item.thread);
    const label = cleanString(item.label, 512);
    const status = cleanString(item.status, 32) as LumiStateThreadClaimV1["status"] | null;
    const provenance = parseProvenance(item.provenance);
    return id && thread && label && status && THREAD_STATUSES.has(status) && provenance
      ? { id, thread, label, status, summary: cleanString(item.summary, 1024) ?? "", provenance }
      : null;
  }));
}

export function parseLumiStateSnapshot(value: unknown, expectedEndpoint?: string, expectedExtensionId?: string): LumiStateParseResult {
  if (!isRecord(value)) return { ok: false, snapshot: null, error: "Snapshot is not an object." };
  if (value.protocol !== LUMI_STATE_PROTOCOL || value.schemaVersion !== LUMI_STATE_SCHEMA_VERSION) {
    return { ok: false, snapshot: null, error: "Unsupported LumiState protocol or schema version." };
  }
  if (!isRecord(value.source) || !isRecord(value.state)) return { ok: false, snapshot: null, error: "Snapshot source or state is missing." };
  const extensionId = cleanString(value.source.extensionId, 96);
  const extensionVersion = cleanString(value.source.extensionVersion, 64);
  const endpoint = cleanString(value.source.endpoint, 160);
  if (!extensionId || !extensionVersion || !endpoint) return { ok: false, snapshot: null, error: "Snapshot source metadata is invalid." };
  if (expectedEndpoint && endpoint !== expectedEndpoint) return { ok: false, snapshot: null, error: "Snapshot endpoint does not match its registered source." };
  if (expectedExtensionId && extensionId !== expectedExtensionId) return { ok: false, snapshot: null, error: "Snapshot extension identity does not match its registered source." };
  const chatId = value.chatId == null ? null : cleanString(value.chatId, 256);
  const revision = nonNegativeInteger(value.revision);
  const freshness = cleanString(value.freshness, 32) as LumiStateFreshness | null;
  const generatedAt = finiteNumber(value.generatedAt);
  const updatedAt = value.updatedAt == null ? null : finiteNumber(value.updatedAt);
  const visibility = cleanString(value.visibility, 16) as LumiStateVisibility | null;
  if (value.chatId != null && !chatId) return { ok: false, snapshot: null, error: "Snapshot chat ID is invalid." };
  if (revision == null || !freshness || !FRESHNESS_VALUES.has(freshness) || generatedAt == null || generatedAt < 0) {
    return { ok: false, snapshot: null, error: "Snapshot revision or freshness metadata is invalid." };
  }
  if (updatedAt != null && updatedAt < 0) return { ok: false, snapshot: null, error: "Snapshot update timestamp is invalid." };
  if (visibility !== "public" && visibility !== "private") return { ok: false, snapshot: null, error: "Snapshot visibility is invalid." };

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
      state: { locations, times, cast, objects, conditions, threads },
    },
  };
}

export function emptyLumiStateScene(): LumiStateSceneV1 {
  return { locations: [], times: [], cast: [], objects: [], conditions: [], threads: [] };
}

export function selectMonotonicSnapshot(
  previous: LumiStateSnapshotV1 | null | undefined,
  incoming: LumiStateSnapshotV1,
): LumiStateRevisionDecision {
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

function subjectKey(subject: LumiStateSubjectV1): string {
  return subject.kind === "scene" ? "scene" : `actor:${subject.actor.namespace}:${subject.actor.id}`;
}

function hashText(value: string): string {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

function conflictGroups<T>(
  kind: LumiStateConflictV1["kind"],
  claims: T[],
  keyOf: (claim: T) => string,
  signatureOf: (claim: T) => string,
  idOf: (claim: T) => string,
  sourceOf: (claim: T) => string,
): LumiStateConflictV1[] {
  const groups = new Map<string, T[]>();
  for (const claim of claims) groups.set(keyOf(claim), [...(groups.get(keyOf(claim)) ?? []), claim]);
  const conflicts: LumiStateConflictV1[] = [];
  for (const [subject, group] of groups) {
    const signatures = new Set(group.map(signatureOf));
    const sources = [...new Set(group.map(sourceOf))].sort();
    if (signatures.size < 2 || sources.length < 2) continue;
    const claimIds = group.map(idOf).sort();
    conflicts.push({
      id: `${kind}:${hashText(`${subject}|${claimIds.join("|")}`)}`,
      kind,
      subject,
      sourceExtensions: sources,
      claimIds,
      message: `Multiple ${kind} claims disagree for ${subject}.`,
    });
  }
  return conflicts;
}

function castIdentityKey(claim: LumiStateCastClaimV1): string {
  const hostLink = claim.links.find((link) => link.namespace.startsWith("host."));
  const identity = hostLink ?? claim.actor;
  return `${identity.namespace}:${identity.id}`;
}

export function detectLumiStateConflicts(scene: LumiStateSceneV1): LumiStateConflictV1[] {
  return [
    ...conflictGroups(
      "location",
      scene.locations,
      (claim) => subjectKey(claim.subject),
      (claim) => claim.label.trim().toLocaleLowerCase(),
      (claim) => claim.id,
      (claim) => claim.provenance.extensionId,
    ),
    ...conflictGroups(
      "time",
      scene.times,
      (claim) => `${subjectKey(claim.subject)}:${claim.clock}`,
      (claim) => JSON.stringify([claim.date, claim.time, claim.day, claim.hour, claim.running, claim.timezone]),
      (claim) => claim.id,
      (claim) => claim.provenance.extensionId,
    ),
    ...conflictGroups(
      "condition",
      scene.conditions,
      (claim) => `${subjectKey(claim.subject)}:${claim.kind}`,
      (claim) => JSON.stringify([claim.label.trim().toLocaleLowerCase(), claim.attributes]),
      (claim) => claim.id,
      (claim) => claim.provenance.extensionId,
    ),
    ...conflictGroups(
      "cast",
      scene.cast,
      castIdentityKey,
      (claim) => JSON.stringify([claim.name.trim().toLocaleLowerCase(), claim.present, claim.publicStance]),
      (claim) => claim.id,
      (claim) => claim.provenance.extensionId,
    ),
  ].sort((left, right) => left.id.localeCompare(right.id));
}

export function aggregateInputSignature(chatId: string | null, observations: LumiStateSourceObservationV1[]): string {
  return JSON.stringify({
    chatId,
    sources: observations.map((source) => ({
      endpoint: source.endpoint,
      status: source.status,
      chatId: source.snapshot?.chatId ?? null,
      revision: source.snapshot?.revision ?? null,
      freshness: source.snapshot?.freshness ?? null,
    })).sort((left, right) => left.endpoint.localeCompare(right.endpoint)),
  });
}

export function mergeLumiStateSnapshots(
  chatId: string | null,
  observations: LumiStateSourceObservationV1[],
  aggregateRevision: number,
  extensionVersion: string,
  generatedAt = Date.now(),
): LumiStateAggregateSnapshotV1 {
  const included = observations.filter((source) =>
    !!source.snapshot &&
    source.snapshot.chatId === chatId &&
    (source.status === "connected" || source.status === "stale"),
  );
  const scene = emptyLumiStateScene();
  for (const source of included) {
    const state = source.snapshot!.state;
    scene.locations.push(...state.locations);
    scene.times.push(...state.times);
    scene.cast.push(...state.cast);
    scene.objects.push(...state.objects);
    scene.conditions.push(...state.conditions);
    scene.threads.push(...state.threads);
  }
  const updatedValues = included.map((source) => source.snapshot?.updatedAt ?? null).filter((value): value is number => value != null);
  const freshness: LumiStateFreshness = !chatId || included.length === 0
    ? "unavailable"
    : included.some((source) => source.status === "stale") ? "stale" : "fresh";
  const sources: LumiStateSourceSummaryV1[] = observations.map((source) => ({
    extensionId: source.extensionId,
    label: source.label,
    endpoint: source.endpoint,
    status: source.status,
    error: source.error,
    chatId: source.snapshot?.chatId ?? null,
    revision: source.snapshot?.revision ?? null,
    freshness: source.snapshot?.freshness ?? null,
    updatedAt: source.snapshot?.updatedAt ?? null,
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
    conflicts: detectLumiStateConflicts(scene),
  };
}
