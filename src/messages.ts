import type { LumiStateAggregateSnapshotV1 } from "./protocol";

export interface LumiStateFrontendState {
  snapshot: LumiStateAggregateSnapshotV1;
  refreshedAt: number;
  pollingIntervalMs: number;
  chatsPermission: boolean;
}

export type FrontendToBackend =
  | { type: "ready"; chatId?: string | null }
  | { type: "refresh"; chatId?: string | null };

export type BackendToFrontend =
  | { type: "state"; state: LumiStateFrontendState }
  | { type: "error"; message: string };
