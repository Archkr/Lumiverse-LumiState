import { describe, expect, test } from "bun:test";
import {
  aggregateInputSignature,
  detectLumiStateConflicts,
  emptyLumiStateScene,
  mergeLumiStateSnapshots,
  parseLumiStateSnapshot,
  selectMonotonicSnapshot,
  type LumiStateSnapshotV1,
  type LumiStateSourceObservationV1,
} from "./protocol";

function snapshot(
  extensionId: string,
  endpoint: string,
  revision: number,
  patch: Partial<LumiStateSnapshotV1["state"]> = {},
  freshness: LumiStateSnapshotV1["freshness"] = "fresh",
): LumiStateSnapshotV1 {
  return {
    protocol: "lumi_state.v1",
    schemaVersion: 1,
    source: { extensionId, extensionVersion: "1.0.0", endpoint },
    chatId: "chat-1",
    revision,
    freshness,
    generatedAt: 1000,
    updatedAt: 900,
    visibility: "public",
    state: { ...emptyLumiStateScene(), ...patch },
  };
}

function observation(
  label: string,
  value: LumiStateSnapshotV1,
  status: LumiStateSourceObservationV1["status"] = "connected",
): LumiStateSourceObservationV1 {
  return {
    extensionId: value.source.extensionId,
    label,
    endpoint: value.source.endpoint,
    status,
    error: null,
    snapshot: value,
  };
}

describe("LumiState v1 validation", () => {
  test("accepts and normalizes a valid public snapshot", () => {
    const raw = snapshot("lumi_weather", "lumi_weather.state.current", 3, {
      locations: [{
        id: "location",
        subject: { kind: "scene" },
        label: "North Gate",
        provenance: { extensionId: "lumi_weather", method: "story", observedAt: 900, confidence: 1.4 },
      }],
    });
    const result = parseLumiStateSnapshot(raw, "lumi_weather.state.current", "lumi_weather");
    expect(result.ok).toBe(true);
    expect(result.snapshot?.state.locations[0]?.label).toBe("North Gate");
    expect(result.snapshot?.state.locations[0]?.provenance.confidence).toBe(1);
  });

  test("rejects mismatched endpoints and unsupported schemas", () => {
    const raw = snapshot("lumi_weather", "wrong.state.current", 3);
    expect(parseLumiStateSnapshot(raw, "lumi_weather.state.current", "lumi_weather").ok).toBe(false);
    expect(parseLumiStateSnapshot({ ...raw, schemaVersion: 2 }).ok).toBe(false);
  });

  test("rejects a snapshot containing malformed claims", () => {
    const raw = snapshot("lumi_weather", "lumi_weather.state.current", 3) as unknown as Record<string, any>;
    raw.state.locations = [{ id: "missing-everything-else" }];
    expect(parseLumiStateSnapshot(raw, "lumi_weather.state.current", "lumi_weather").ok).toBe(false);
  });
});

describe("LumiState aggregation", () => {
  test("merges matching source fragments without comparing source revisions", () => {
    const weather = snapshot("lumi_weather", "lumi_weather.state.current", 900, {
      conditions: [{
        id: "weather",
        subject: { kind: "scene" },
        kind: "weather",
        label: "rain",
        attributes: { intensity: 0.6 },
        provenance: { extensionId: "lumi_weather", method: "story", observedAt: 900 },
      }],
    });
    const mind = snapshot("lumi_mind", "lumi_mind.state.current", 2, {
      cast: [{
        id: "actor-1",
        actor: { namespace: "lumi_mind.actor", id: "actor-1", kind: "npc" },
        links: [],
        name: "Mira",
        aliases: [],
        present: true,
        confirmed: true,
        publicStance: "watchful",
        provenance: { extensionId: "lumi_mind", method: "derived", observedAt: 850 },
      }],
    });
    const merged = mergeLumiStateSnapshots(
      "chat-1",
      [observation("LumiWeather", weather), observation("LumiMind", mind)],
      4,
      "0.1.0",
      1100,
    );
    expect(merged.revision).toBe(4);
    expect(merged.state.conditions).toHaveLength(1);
    expect(merged.state.cast).toHaveLength(1);
    expect(merged.updatedAt).toBe(900);
    expect(merged.freshness).toBe("fresh");
  });

  test("marks the aggregate stale when an included source is stale", () => {
    const mind = snapshot("lumi_mind", "lumi_mind.state.current", 2, {}, "stale");
    const merged = mergeLumiStateSnapshots("chat-1", [observation("LumiMind", mind, "stale")], 1, "0.1.0");
    expect(merged.freshness).toBe("stale");
  });

  test("detects disagreements while preserving both sourced claims", () => {
    const scene = emptyLumiStateScene();
    scene.locations.push(
      {
        id: "weather-location",
        subject: { kind: "scene" },
        label: "North Gate",
        provenance: { extensionId: "lumi_weather", method: "story", observedAt: 1 },
      },
      {
        id: "world-location",
        subject: { kind: "scene" },
        label: "South Gate",
        provenance: { extensionId: "agent_world", method: "simulation", observedAt: 1 },
      },
    );
    const conflicts = detectLumiStateConflicts(scene);
    expect(conflicts).toHaveLength(1);
    expect(conflicts[0]).toMatchObject({ kind: "location", sourceExtensions: ["agent_world", "lumi_weather"] });
    expect(scene.locations).toHaveLength(2);
  });

  test("builds a stable source signature independent of observation order", () => {
    const weather = observation("LumiWeather", snapshot("lumi_weather", "lumi_weather.state.current", 10));
    const mind = observation("LumiMind", snapshot("lumi_mind", "lumi_mind.state.current", 3));
    expect(aggregateInputSignature("chat-1", [weather, mind])).toBe(aggregateInputSignature("chat-1", [mind, weather]));
  });

  test("retains the last accepted snapshot on revision regressions", () => {
    const previous = snapshot("lumi_mind", "lumi_mind.state.current", 9);
    const regressed = snapshot("lumi_mind", "lumi_mind.state.current", 8);
    const decision = selectMonotonicSnapshot(previous, regressed);
    expect(decision.accepted).toBe(false);
    expect(decision.reason).toBe("regressed");
    expect(decision.snapshot.revision).toBe(9);
  });
});
