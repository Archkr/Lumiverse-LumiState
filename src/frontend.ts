import type { SpindleFrontendContext } from "lumiverse-spindle-types";
import type { BackendToFrontend, FrontendToBackend, LumiStateFrontendState } from "./messages";
import type {
  LumiStateCastClaimV1,
  LumiStateConditionClaimV1,
  LumiStateLocationClaimV1,
  LumiStateObjectClaimV1,
  LumiStateSourceStatus,
  LumiStateThreadClaimV1,
  LumiStateTimeClaimV1,
} from "./protocol";
import { LUMI_STATE_CSS } from "./styles";

const STATE_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="2.2"/><path d="M12 2.8v3.1M12 18.1v3.1M2.8 12h3.1M18.1 12h3.1"/><path d="M5.5 5.5l2.2 2.2M16.3 16.3l2.2 2.2M18.5 5.5l-2.2 2.2M7.7 16.3l-2.2 2.2"/><circle cx="12" cy="12" r="6.1"/></svg>`;

function element<K extends keyof HTMLElementTagNameMap>(tag: K, className?: string, text?: string): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function safeActiveChat(ctx: SpindleFrontendContext): string | null {
  try {
    return ctx.getActiveChat().chatId ?? null;
  } catch {
    return null;
  }
}

function compactId(value: string | null): string {
  if (!value) return "No active chat";
  return value.length <= 18 ? value : `${value.slice(0, 8)}…${value.slice(-6)}`;
}

function sourceName(extensionId: string): string {
  if (extensionId === "lumi_weather") return "LumiWeather";
  if (extensionId === "agent_world") return "LumiWorld";
  if (extensionId === "lumi_mind") return "LumiMind";
  return extensionId;
}

function statusTone(status: LumiStateSourceStatus): string {
  if (status === "connected") return "good";
  if (status === "stale" || status === "unavailable" || status === "chat_mismatch") return "warn";
  return "bad";
}

function statusLabel(status: LumiStateSourceStatus): string {
  return status.replace("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function freshnessTone(freshness: string): string {
  return freshness === "fresh" ? "good" : freshness === "stale" ? "warn" : "bad";
}

function relativeTime(timestamp: number | null): string {
  if (!timestamp) return "No update";
  const seconds = Math.max(0, Math.floor((Date.now() - timestamp) / 1000));
  if (seconds < 10) return "Just now";
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ago`;
}

function pill(text: string, tone = ""): HTMLSpanElement {
  return element("span", `ls-pill ${tone}`.trim(), text);
}

function card(source: string, title: string, body?: string, tags: string[] = []): HTMLDivElement {
  const node = element("div", "ls-card");
  node.appendChild(element("div", "ls-card-source", source));
  node.appendChild(element("div", "ls-card-title", title));
  if (body) node.appendChild(element("div", "ls-card-body", body));
  if (tags.length) {
    const row = element("div", "ls-card-tags");
    for (const tag of tags) row.appendChild(element("span", "ls-tag", tag));
    node.appendChild(row);
  }
  return node;
}

function section(title: string, count: number): { root: HTMLElement; grid: HTMLElement } {
  const root = element("section", "ls-section");
  const head = element("div", "ls-section-head");
  head.append(element("h2", "ls-section-title", title), element("span", "ls-section-count", String(count)));
  const grid = element("div", "ls-grid");
  root.append(head, grid);
  return { root, grid };
}

function formatTimeClaim(claim: LumiStateTimeClaimV1): { title: string; body: string; tags: string[] } {
  if (claim.clock === "calendar") {
    return {
      title: [claim.date, claim.time].filter(Boolean).join(" · ") || "Calendar time unavailable",
      body: "Visible story date and time",
      tags: ["Calendar clock"],
    };
  }
  const day = claim.day == null ? "Day unknown" : `Day ${claim.day}`;
  const hour = claim.hour == null ? "Hour unknown" : `${String(claim.hour).padStart(2, "0")}:00`;
  return { title: `${day} · ${hour}`, body: "LumiWorld simulation clock", tags: [claim.running ? "Running" : "Paused"] };
}

function locationCard(claim: LumiStateLocationClaimV1): HTMLElement {
  return card(sourceName(claim.provenance.extensionId), claim.label, claim.subject.kind === "scene" ? "Visible scene location" : "Actor-scoped location");
}

function timeCard(claim: LumiStateTimeClaimV1): HTMLElement {
  const formatted = formatTimeClaim(claim);
  return card(sourceName(claim.provenance.extensionId), formatted.title, formatted.body, formatted.tags);
}

function conditionCard(claim: LumiStateConditionClaimV1): HTMLElement {
  const summary = typeof claim.attributes.summary === "string" ? claim.attributes.summary : "";
  const tags = [claim.kind];
  if (claim.attributes.temperature != null) tags.push(String(claim.attributes.temperature));
  if (claim.attributes.wind != null) tags.push(String(claim.attributes.wind));
  return card(sourceName(claim.provenance.extensionId), claim.label, summary, tags);
}

function castCard(claim: LumiStateCastClaimV1): HTMLElement {
  const body = [claim.publicStance, claim.aliases.length ? `Also known as ${claim.aliases.join(", ")}` : ""].filter(Boolean).join(" · ");
  return card(sourceName(claim.provenance.extensionId), claim.name, body, [claim.actor.kind, claim.present ? "Present" : "Not present", claim.confirmed ? "Confirmed" : "Unconfirmed"]);
}

function objectCard(claim: LumiStateObjectClaimV1): HTMLElement {
  return card(sourceName(claim.provenance.extensionId), claim.name, claim.state, [claim.object.kind]);
}

function threadCard(claim: LumiStateThreadClaimV1): HTMLElement {
  return card(sourceName(claim.provenance.extensionId), claim.label, claim.summary, [claim.status]);
}

function diagnostics(state: LumiStateFrontendState, ctx: SpindleFrontendContext): Record<string, unknown> {
  const snapshot = state.snapshot;
  return {
    reportFormat: "lumi_state.diagnostics.v1",
    generatedAt: new Date().toISOString(),
    privacy: {
      sanitized: true,
      excluded: ["claim values", "actor names", "aliases", "public stance text", "full entity IDs", "full chat IDs"],
    },
    extension: {
      identifier: ctx.manifest.identifier,
      name: ctx.manifest.name,
      version: ctx.manifest.version,
      minimumLumiverseVersion: ctx.manifest.minimum_lumiverse_version ?? null,
    },
    browser: {
      userAgent: navigator.userAgent,
      language: navigator.language,
      online: navigator.onLine,
    },
    aggregate: {
      chatReference: compactId(snapshot.chatId),
      revision: snapshot.revision,
      freshness: snapshot.freshness,
      updatedAt: snapshot.updatedAt,
      conflicts: snapshot.conflicts.map((conflict) => ({ kind: conflict.kind, sourceExtensions: conflict.sourceExtensions })),
      counts: {
        locations: snapshot.state.locations.length,
        times: snapshot.state.times.length,
        cast: snapshot.state.cast.length,
        objects: snapshot.state.objects.length,
        conditions: snapshot.state.conditions.length,
        threads: snapshot.state.threads.length,
      },
    },
    sources: snapshot.sources.map((source) => ({
      extensionId: source.extensionId,
      endpoint: source.endpoint,
      status: source.status,
      chatMatchesAggregate: source.chatId === snapshot.chatId,
      revision: source.revision,
      freshness: source.freshness,
      updatedAt: source.updatedAt,
      error: source.error,
    })),
    permissions: { chats: state.chatsPermission },
  };
}

async function copyText(value: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }
  const area = element("textarea");
  area.value = value;
  area.style.position = "fixed";
  area.style.opacity = "0";
  document.body.appendChild(area);
  area.select();
  document.execCommand("copy");
  area.remove();
}

export function setup(ctx: SpindleFrontendContext): () => void {
  ctx.deferReady();
  const cleanups: Array<() => void> = [ctx.dom.addStyle(LUMI_STATE_CSS)];
  const drawer = ctx.ui.registerDrawerTab({
    id: "scene-inspector",
    title: "LumiState — Scene Inspector",
    shortName: "State",
    headerTitle: "Scene Inspector",
    description: "Inspect the shared scene published by LumiWeather, LumiWorld, and LumiMind",
    keywords: ["state", "scene", "weather", "world", "mind", "interop", "diagnostics"],
    iconSvg: STATE_ICON,
  });

  let current: LumiStateFrontendState | null = null;
  let errorMessage: string | null = null;

  function send(message: FrontendToBackend): void {
    try {
      ctx.sendToBackend(message);
    } catch {
      errorMessage = "LumiState could not reach its backend.";
      render();
    }
  }

  function syncContext(): void {
    send({ type: "refresh", chatId: safeActiveChat(ctx) });
  }

  function render(): void {
    const shell = element("div", "ls-shell");
    const head = element("div", "ls-head");
    const heading = element("div");
    heading.append(
      element("div", "ls-kicker", "Shared scene bridge"),
      element("h1", "ls-title", "LumiState"),
      element("div", "ls-subtitle", "One validated, source-aware view of your active scene."),
    );
    const actions = element("div", "ls-actions");
    const refresh = element("button", "ls-button", "Refresh");
    refresh.type = "button";
    refresh.addEventListener("click", syncContext);
    const copy = element("button", "ls-button", "Copy diagnostics");
    copy.type = "button";
    copy.disabled = !current;
    copy.addEventListener("click", () => {
      if (!current) return;
      void copyText(JSON.stringify(diagnostics(current, ctx), null, 2)).then(() => {
        copy.textContent = "Copied";
        setTimeout(() => { copy.textContent = "Copy diagnostics"; }, 1800);
      }).catch(() => {
        copy.textContent = "Copy failed";
        setTimeout(() => { copy.textContent = "Copy diagnostics"; }, 1800);
      });
    });
    actions.append(refresh, copy);
    head.append(heading, actions);
    shell.appendChild(head);

    if (errorMessage) {
      const alert = element("div", "ls-alert error");
      alert.append(element("div", "ls-alert-title", "Refresh problem"), element("div", "ls-alert-body", errorMessage));
      shell.appendChild(alert);
    }

    if (!current) {
      shell.appendChild(element("div", "ls-loading", "Reading LumiState publishers…"));
      drawer.root.replaceChildren(shell);
      return;
    }

    const snapshot = current.snapshot;
    const overview = element("div", "ls-overview");
    const overviewMain = element("div", "ls-overview-main");
    overviewMain.append(element("div", "ls-overview-label", "Active chat"), element("div", "ls-overview-value", compactId(snapshot.chatId)));
    const pills = element("div", "ls-pills");
    pills.append(
      pill(snapshot.freshness, freshnessTone(snapshot.freshness)),
      pill(`Revision ${snapshot.revision}`),
      pill(`${snapshot.sources.filter((source) => source.status === "connected" || source.status === "stale").length}/${snapshot.sources.length} sources`),
    );
    overview.append(overviewMain, pills);
    shell.appendChild(overview);

    if (!current.chatsPermission) {
      const alert = element("div", "ls-alert error");
      alert.append(element("div", "ls-alert-title", "Chats permission unavailable"), element("div", "ls-alert-body", "LumiState can display cached source status, but it cannot reliably resolve the active chat."));
      shell.appendChild(alert);
    }

    const sources = section("Publishers", snapshot.sources.length);
    sources.grid.className = "ls-source-grid";
    for (const source of snapshot.sources) {
      const node = element("div", "ls-source");
      const top = element("div", "ls-source-top");
      top.append(element("div", "ls-source-name", source.label), pill(statusLabel(source.status), statusTone(source.status)));
      node.append(top, element("div", "ls-source-endpoint", source.endpoint));
      const meta = source.revision == null ? relativeTime(source.updatedAt) : `Revision ${source.revision} · ${relativeTime(source.updatedAt)}`;
      node.appendChild(element("div", "ls-source-meta", source.error ? `${meta} · ${source.error}` : meta));
      sources.grid.appendChild(node);
    }
    shell.appendChild(sources.root);

    if (!snapshot.chatId) {
      const empty = element("div", "ls-empty");
      empty.append(element("div", "ls-empty-title", "Open a chat to assemble its scene"), element("div", "ls-empty-body", "LumiState remains idle on the home screen and never substitutes state from the last open chat."));
      shell.appendChild(empty);
      drawer.root.replaceChildren(shell);
      drawer.setBadge("");
      return;
    }

    if (snapshot.conflicts.length) {
      const alert = element("div", "ls-alert");
      alert.append(
        element("div", "ls-alert-title", `${snapshot.conflicts.length} source conflict${snapshot.conflicts.length === 1 ? "" : "s"}`),
        element("div", "ls-alert-body", snapshot.conflicts.map((conflict) => conflict.message).join(" ")),
      );
      shell.appendChild(alert);
    }

    const renderClaims = <T,>(title: string, claims: T[], factory: (claim: T) => HTMLElement): void => {
      if (!claims.length) return;
      const group = section(title, claims.length);
      for (const claim of claims) group.grid.appendChild(factory(claim));
      shell.appendChild(group.root);
    };
    renderClaims("Locations", snapshot.state.locations, locationCard);
    renderClaims("Time", snapshot.state.times, timeCard);
    renderClaims("Conditions", snapshot.state.conditions, conditionCard);
    renderClaims("Cast", snapshot.state.cast, castCard);
    renderClaims("Objects", snapshot.state.objects, objectCard);
    renderClaims("Threads", snapshot.state.threads, threadCard);

    const claimCount = snapshot.state.locations.length + snapshot.state.times.length + snapshot.state.conditions.length + snapshot.state.cast.length + snapshot.state.objects.length + snapshot.state.threads.length;
    if (!claimCount) {
      const empty = element("div", "ls-empty");
      empty.append(element("div", "ls-empty-title", "No shared scene claims yet"), element("div", "ls-empty-body", "The connected publishers have not produced state for this chat yet. LumiState will refresh automatically."));
      shell.appendChild(empty);
    }

    drawer.root.replaceChildren(shell);
    drawer.setBadge(snapshot.conflicts.length ? "!" : snapshot.freshness === "stale" ? "Stale" : "");
  }

  cleanups.push(ctx.onBackendMessage((payload) => {
    const message = payload as BackendToFrontend;
    if (message.type === "state") {
      current = message.state;
      errorMessage = null;
      render();
    } else if (message.type === "error") {
      errorMessage = message.message;
      render();
    }
  }));
  cleanups.push(drawer.onActivate(syncContext));
  for (const event of ["CHAT_SWITCHED", "CHAT_CHANGED"] as const) {
    cleanups.push(ctx.events.on(event, () => setTimeout(syncContext, 0)));
  }
  cleanups.push(ctx.events.on("PERMISSION_CHANGED", syncContext));

  render();
  ctx.ready();
  send({ type: "ready", chatId: safeActiveChat(ctx) });

  return () => {
    while (cleanups.length) {
      try { cleanups.pop()?.(); } catch { /* Best-effort cleanup. */ }
    }
    ctx.dom.cleanup();
  };
}
