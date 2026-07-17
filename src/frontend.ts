import type { SpindleFrontendContext } from "lumiverse-spindle-types";
import type { BackendToFrontend, FrontendToBackend, LumiStateFrontendState } from "./messages";
import type {
  LumiStateCastClaimV1,
  LumiStateConditionClaimV1,
  LumiStateLocationClaimV1,
  LumiStateObjectClaimV1,
  LumiStateProvenanceV1,
  LumiStateSourceStatus,
  LumiStateSourceSummaryV1,
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
  if (!value) return "No active conversation";
  return value.length <= 18 ? value : `${value.slice(0, 8)}…${value.slice(-6)}`;
}

function sourceName(extensionId: string): string {
  if (extensionId === "lumi_weather") return "LumiWeather";
  if (extensionId === "agent_world") return "LumiWorld";
  if (extensionId === "lumi_mind") return "LumiMind";
  return extensionId;
}

function sourceCode(extensionId: string): string {
  if (extensionId === "lumi_weather") return "WE";
  if (extensionId === "agent_world") return "WO";
  if (extensionId === "lumi_mind") return "MI";
  return extensionId.slice(0, 2).toLocaleUpperCase();
}

function sourceClass(extensionId: string): string {
  if (extensionId === "lumi_weather") return "weather";
  if (extensionId === "agent_world") return "world";
  if (extensionId === "lumi_mind") return "mind";
  return "other";
}

function statusTone(status: LumiStateSourceStatus): "good" | "warn" | "bad" {
  if (status === "connected") return "good";
  if (status === "stale" || status === "unavailable" || status === "chat_mismatch") return "warn";
  return "bad";
}

function statusLabel(status: LumiStateSourceStatus): string {
  return status.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toLocaleUpperCase());
}

function freshnessTone(freshness: string): "good" | "warn" | "bad" {
  return freshness === "fresh" ? "good" : freshness === "stale" ? "warn" : "bad";
}

function freshnessLabel(freshness: string): string {
  if (freshness === "fresh") return "Scene current";
  if (freshness === "stale") return "Scene aging";
  return "Scene offline";
}

function relativeTime(timestamp: number | null): string {
  if (!timestamp) return "No update yet";
  const seconds = Math.max(0, Math.floor((Date.now() - timestamp) / 1000));
  if (seconds < 10) return "Just now";
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function initials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (!words.length) return "?";
  if (words.length === 1) return words[0]?.slice(0, 2).toLocaleUpperCase() ?? "?";
  return `${words[0]?.[0] ?? ""}${words.at(-1)?.[0] ?? ""}`.toLocaleUpperCase();
}

function pill(text: string, tone = ""): HTMLSpanElement {
  return element("span", `ls-pill ${tone}`.trim(), text);
}

function actionButton(label: string, onClick: () => void, className = ""): HTMLButtonElement {
  const button = element("button", `ls-button ${className}`.trim(), label);
  button.type = "button";
  button.addEventListener("click", onClick);
  return button;
}

function provenanceFooter(provenance: LumiStateProvenanceV1): HTMLDivElement {
  const footer = element("div", "ls-provenance");
  footer.append(
    element("span", `ls-source-dot ${sourceClass(provenance.extensionId)}`),
    element("span", "ls-provenance-name", sourceName(provenance.extensionId)),
    element("span", "ls-provenance-time", `Observed ${relativeTime(provenance.observedAt)}`),
  );
  return footer;
}

function sectionHeading(kicker: string, title: string, count: number, description?: string): HTMLDivElement {
  const heading = element("div", "ls-section-heading");
  const copy = element("div", "ls-section-copy");
  copy.append(element("div", "ls-kicker", kicker), element("h2", "ls-section-title", title));
  if (description) copy.appendChild(element("p", "ls-section-description", description));
  heading.append(copy, element("span", "ls-count", String(count)));
  return heading;
}

function formatTimeClaim(claim: LumiStateTimeClaimV1): { title: string; detail: string; tags: string[] } {
  if (claim.clock === "calendar") {
    return {
      title: [claim.date, claim.time].filter(Boolean).join(" · ") || "Calendar time unavailable",
      detail: claim.timezone ? `Visible story time · ${claim.timezone}` : "Visible story date and time",
      tags: ["Calendar"],
    };
  }
  const day = claim.day == null ? "Day unknown" : `Day ${claim.day}`;
  const hour = claim.hour == null ? "Hour unknown" : `${String(claim.hour).padStart(2, "0")}:00`;
  return {
    title: `${day} · ${hour}`,
    detail: "LumiWorld simulation clock",
    tags: [claim.running ? "Running" : "Paused"],
  };
}

function subjectLabel(claim: LumiStateLocationClaimV1 | LumiStateTimeClaimV1 | LumiStateConditionClaimV1): string {
  return claim.subject.kind === "scene" ? "Scene-wide" : `${claim.subject.actor.kind} scoped`;
}

function humanize(value: string): string {
  return value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toLocaleUpperCase());
}

function formatAttribute(value: string | number | boolean | null): string {
  if (value === null) return "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return String(value);
}

function locationCard(claim: LumiStateLocationClaimV1): HTMLElement {
  const node = element("article", "ls-observation location");
  const top = element("div", "ls-observation-top");
  top.append(element("span", "ls-observation-symbol", "LOC"), pill(subjectLabel(claim)));
  node.append(top, element("h3", "ls-observation-title", claim.label));
  node.appendChild(element("p", "ls-observation-copy", claim.subject.kind === "scene" ? "The visible setting shared by scene publishers." : "A location attached to one actor."));
  node.appendChild(provenanceFooter(claim.provenance));
  return node;
}

function timeCard(claim: LumiStateTimeClaimV1): HTMLElement {
  const formatted = formatTimeClaim(claim);
  const node = element("article", "ls-observation time");
  const top = element("div", "ls-observation-top");
  top.append(element("span", "ls-observation-symbol", "TIME"), pill(subjectLabel(claim)));
  node.append(top, element("h3", "ls-observation-title", formatted.title), element("p", "ls-observation-copy", formatted.detail));
  const tags = element("div", "ls-tags");
  for (const tag of formatted.tags) tags.appendChild(element("span", "ls-tag", tag));
  node.append(tags, provenanceFooter(claim.provenance));
  return node;
}

function conditionCard(claim: LumiStateConditionClaimV1): HTMLElement {
  const node = element("article", "ls-observation condition");
  const top = element("div", "ls-observation-top");
  top.append(element("span", "ls-observation-symbol", "ENV"), pill(humanize(claim.kind)));
  node.append(top, element("h3", "ls-observation-title", claim.label));
  const summary = typeof claim.attributes.summary === "string" ? claim.attributes.summary : "Shared environmental condition";
  node.appendChild(element("p", "ls-observation-copy", summary));
  const attributes = Object.entries(claim.attributes).filter(([key]) => key !== "summary").slice(0, 5);
  if (attributes.length) {
    const list = element("dl", "ls-attributes");
    for (const [key, value] of attributes) {
      const item = element("div", "ls-attribute");
      item.append(element("dt", "", humanize(key)), element("dd", "", formatAttribute(value)));
      list.appendChild(item);
    }
    node.appendChild(list);
  }
  node.appendChild(provenanceFooter(claim.provenance));
  return node;
}

function castCard(claim: LumiStateCastClaimV1): HTMLElement {
  const node = element("article", `ls-cast-card${claim.present ? " present" : ""}`);
  const identity = element("div", "ls-cast-identity");
  const avatar = element("div", "ls-avatar", initials(claim.name));
  if (claim.present) avatar.appendChild(element("span", "ls-presence-dot"));
  const copy = element("div", "ls-cast-copy");
  copy.append(element("h3", "ls-cast-name", claim.name), element("div", "ls-cast-kind", humanize(claim.actor.kind)));
  identity.append(avatar, copy);
  const state = element("div", "ls-cast-state");
  state.append(pill(claim.present ? "Present" : "Off scene", claim.present ? "good" : ""));
  if (!claim.confirmed) state.appendChild(pill("Unconfirmed", "warn"));
  node.append(identity, state);
  if (claim.publicStance) node.appendChild(element("p", "ls-stance", claim.publicStance));
  if (claim.aliases.length) node.appendChild(element("p", "ls-aliases", `Also known as ${claim.aliases.join(", ")}`));
  node.appendChild(provenanceFooter(claim.provenance));
  return node;
}

function objectCard(claim: LumiStateObjectClaimV1): HTMLElement {
  const node = element("article", "ls-inventory-card");
  const marker = element("span", "ls-inventory-marker", initials(claim.name));
  const copy = element("div", "ls-inventory-copy");
  copy.append(element("h3", "ls-inventory-title", claim.name));
  if (claim.state) copy.appendChild(element("p", "ls-inventory-description", claim.state));
  const type = pill(humanize(claim.object.kind));
  node.append(marker, copy, type, provenanceFooter(claim.provenance));
  return node;
}

function threadCard(claim: LumiStateThreadClaimV1): HTMLElement {
  const node = element("article", `ls-thread-card ${claim.status}`);
  const top = element("div", "ls-thread-top");
  top.append(element("h3", "ls-thread-title", claim.label), pill(humanize(claim.status), claim.status === "active" ? "good" : claim.status === "abandoned" ? "bad" : ""));
  node.appendChild(top);
  if (claim.summary) node.appendChild(element("p", "ls-thread-summary", claim.summary));
  node.appendChild(provenanceFooter(claim.provenance));
  return node;
}

function sourceCard(source: LumiStateSourceSummaryV1): HTMLDetailsElement {
  const tone = statusTone(source.status);
  const node = element("details", `ls-source ${tone} ${sourceClass(source.extensionId)}`);
  const summary = element("summary", "ls-source-summary");
  const mark = element("span", "ls-source-mark", sourceCode(source.extensionId));
  const copy = element("span", "ls-source-copy");
  copy.append(element("strong", "ls-source-name", source.label), element("span", "ls-source-age", relativeTime(source.updatedAt)));
  summary.append(mark, copy, pill(statusLabel(source.status), tone), element("span", "ls-source-chevron", "+"));
  const details = element("div", "ls-source-details");
  const revision = source.revision == null ? "No revision received" : `Revision ${source.revision}`;
  details.append(
    element("div", "ls-source-endpoint", source.endpoint),
    element("div", "ls-source-meta", `${revision} · ${source.freshness ? humanize(source.freshness) : "No freshness signal"}`),
  );
  if (source.error) details.appendChild(element("div", "ls-source-error", source.error));
  node.append(summary, details);
  return node;
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

  function renderHeader(): HTMLElement {
    const header = element("header", "ls-header");
    const mark = element("div", "ls-brand-mark");
    mark.innerHTML = STATE_ICON;
    const identity = element("div", "ls-brand-copy");
    identity.append(element("div", "ls-eyebrow", "LumiState"), element("div", "ls-brand-title", "Scene Inspector"));
    identity.appendChild(element("div", "ls-brand-subtitle", "Live context, reconciled"));
    const actions = element("div", "ls-header-actions");
    const freshness = current?.snapshot.freshness ?? "unavailable";
    const hasChat = Boolean(current?.snapshot.chatId);
    actions.appendChild(pill(hasChat ? freshnessLabel(freshness) : current ? "Awaiting chat" : "Connecting", hasChat ? freshnessTone(freshness) : ""));
    actions.appendChild(actionButton("Refresh", syncContext, "ls-button-quiet"));
    const copy = actionButton("Diagnostics", () => {
      if (!current) return;
      copy.disabled = true;
      void copyText(JSON.stringify(diagnostics(current, ctx), null, 2)).then(() => {
        copy.textContent = "Copied";
      }).catch(() => {
        copy.textContent = "Copy failed";
      }).finally(() => {
        window.setTimeout(() => {
          copy.textContent = "Diagnostics";
          copy.disabled = false;
        }, 1800);
      });
    }, "ls-button-quiet");
    copy.setAttribute("aria-label", "Copy privacy-safe diagnostics");
    copy.title = "Copy privacy-safe diagnostics";
    copy.disabled = !current;
    actions.appendChild(copy);
    header.append(mark, identity, actions);
    return header;
  }

  function renderNotice(title: string, body: string, tone: "warning" | "danger"): HTMLElement {
    const notice = element("div", `ls-notice ${tone}`);
    notice.setAttribute("role", "status");
    notice.append(element("span", "ls-notice-marker", tone === "danger" ? "!" : "≠"));
    const copy = element("div", "ls-notice-copy");
    copy.append(element("strong", "ls-notice-title", title), element("p", "ls-notice-body", body));
    notice.appendChild(copy);
    return notice;
  }

  function renderSceneStage(state: LumiStateFrontendState): HTMLElement {
    const snapshot = state.snapshot;
    const location = snapshot.state.locations.find((claim) => claim.subject.kind === "scene") ?? snapshot.state.locations[0];
    const time = snapshot.state.times.find((claim) => claim.subject.kind === "scene") ?? snapshot.state.times[0];
    const condition = snapshot.state.conditions.find((claim) => claim.subject.kind === "scene") ?? snapshot.state.conditions[0];
    const timeReading = time ? formatTimeClaim(time) : null;
    const connected = snapshot.sources.filter((source) => source.status === "connected" || source.status === "stale").length;
    const present = snapshot.state.cast.filter((claim) => claim.present).length;
    const stage = element("section", `ls-stage ${freshnessTone(snapshot.freshness)}`);
    const ambient = element("div", "ls-stage-ambient");
    ambient.setAttribute("aria-hidden", "true");
    const content = element("div", "ls-stage-content");
    content.appendChild(element("div", "ls-kicker", "Current scene"));
    content.appendChild(element("h1", "ls-stage-title", location?.label ?? "Scene signals are assembling"));
    const reading = [timeReading?.title, condition?.label].filter(Boolean).join("  ·  ");
    content.appendChild(element("p", "ls-stage-reading", reading || "Publishers are connected, but no shared claims have arrived yet."));
    const sourceRow = element("div", "ls-stage-sources");
    const extensionIds = new Set<string>();
    for (const claim of [location, time, condition]) {
      if (!claim || extensionIds.has(claim.provenance.extensionId)) continue;
      extensionIds.add(claim.provenance.extensionId);
      const source = element("span", "ls-stage-source");
      source.append(element("span", `ls-source-dot ${sourceClass(claim.provenance.extensionId)}`), element("span", "", sourceName(claim.provenance.extensionId)));
      sourceRow.appendChild(source);
    }
    if (sourceRow.childElementCount) content.appendChild(sourceRow);
    const metrics = element("div", "ls-stage-metrics");
    for (const [value, label] of [
      [String(connected), "Signals"],
      [String(present), "Present"],
      [String(snapshot.conflicts.length), "Conflicts"],
    ]) {
      const metric = element("div", "ls-stage-metric");
      metric.append(element("strong", "", value), element("span", "", label));
      metrics.appendChild(metric);
    }
    const footer = element("div", "ls-stage-footer");
    footer.append(
      element("span", "ls-chat-label", "Active conversation"),
      element("code", "ls-chat-id", compactId(snapshot.chatId)),
      element("span", "ls-stage-updated", `Updated ${relativeTime(snapshot.updatedAt)} · revision ${snapshot.revision}`),
    );
    stage.append(ambient, content, metrics, footer);
    return stage;
  }

  function renderSignalPath(state: LumiStateFrontendState): HTMLElement {
    const snapshot = state.snapshot;
    const section = element("section", "ls-section");
    const active = snapshot.sources.filter((source) => source.status === "connected" || source.status === "stale").length;
    section.appendChild(sectionHeading("Source health", "Signal path", active, "Each publisher remains authoritative for its own scene data."));
    const grid = element("div", "ls-source-grid");
    for (const source of snapshot.sources) grid.appendChild(sourceCard(source));
    section.appendChild(grid);
    return section;
  }

  function renderNoChat(state: LumiStateFrontendState): HTMLElement {
    const empty = element("section", "ls-empty-state");
    const visual = element("div", "ls-empty-visual");
    visual.append(element("span"), element("span"), element("span"));
    empty.append(visual, element("div", "ls-kicker", "Waiting at the threshold"), element("h1", "ls-empty-title", "Open a conversation"));
    empty.appendChild(element("p", "ls-empty-copy", "Scene Inspector follows the active chat and never substitutes context from the conversation you viewed last."));
    const note = element("div", "ls-empty-note");
    note.append(element("span", "ls-source-dot weather"), element("span", "", "Your source connections remain visible below."));
    empty.appendChild(note);
    const wrapper = element("div", "ls-no-chat");
    wrapper.append(empty, renderSignalPath(state));
    return wrapper;
  }

  function renderClaims(state: LumiStateFrontendState, shell: HTMLElement): void {
    const snapshot = state.snapshot;
    if (snapshot.state.cast.length) {
      const section = element("section", "ls-section");
      const present = snapshot.state.cast.filter((claim) => claim.present).length;
      section.appendChild(sectionHeading("Shared identities", "Cast in view", snapshot.state.cast.length, `${present} currently marked present.`));
      const grid = element("div", "ls-cast-grid");
      for (const claim of snapshot.state.cast) grid.appendChild(castCard(claim));
      section.appendChild(grid);
      shell.appendChild(section);
    }

    const readingCount = snapshot.state.locations.length + snapshot.state.times.length + snapshot.state.conditions.length;
    if (readingCount) {
      const section = element("section", "ls-section");
      section.appendChild(sectionHeading("Published claims", "Scene readings", readingCount, "Source-aware observations, shown without silently resolving disagreement."));
      const grid = element("div", "ls-observation-grid");
      for (const claim of snapshot.state.locations) grid.appendChild(locationCard(claim));
      for (const claim of snapshot.state.times) grid.appendChild(timeCard(claim));
      for (const claim of snapshot.state.conditions) grid.appendChild(conditionCard(claim));
      section.appendChild(grid);
      shell.appendChild(section);
    }

    if (snapshot.state.threads.length) {
      const section = element("section", "ls-section");
      section.appendChild(sectionHeading("Narrative continuity", "Active threads", snapshot.state.threads.length));
      const grid = element("div", "ls-thread-grid");
      for (const claim of snapshot.state.threads) grid.appendChild(threadCard(claim));
      section.appendChild(grid);
      shell.appendChild(section);
    }

    if (snapshot.state.objects.length) {
      const section = element("section", "ls-section");
      section.appendChild(sectionHeading("World state", "Objects in context", snapshot.state.objects.length));
      const grid = element("div", "ls-inventory-grid");
      for (const claim of snapshot.state.objects) grid.appendChild(objectCard(claim));
      section.appendChild(grid);
      shell.appendChild(section);
    }
  }

  function render(): void {
    const shell = element("div", "ls-shell");
    shell.appendChild(renderHeader());

    if (errorMessage) shell.appendChild(renderNotice("Refresh interrupted", errorMessage, "danger"));

    if (!current) {
      const loading = element("div", "ls-loading");
      loading.setAttribute("aria-busy", "true");
      loading.append(element("div", "ls-loading-orbit"), element("strong", "", "Reading scene publishers"), element("span", "", "Validating public, spoiler-safe snapshots…"));
      shell.appendChild(loading);
      drawer.root.replaceChildren(shell);
      return;
    }

    const snapshot = current.snapshot;
    if (!current.chatsPermission) {
      shell.appendChild(renderNotice("Chats permission unavailable", "LumiState can show cached signal health, but it cannot reliably follow the active conversation.", "danger"));
    }

    if (!snapshot.chatId) {
      shell.appendChild(renderNoChat(current));
      drawer.root.replaceChildren(shell);
      drawer.setBadge(null);
      return;
    }

    shell.append(renderSceneStage(current), renderSignalPath(current));

    if (snapshot.conflicts.length) {
      const conflict = element("section", "ls-conflict-panel");
      const intro = element("div", "ls-conflict-intro");
      intro.append(element("span", "ls-conflict-mark", "≠"));
      const introCopy = element("div", "ls-conflict-copy");
      introCopy.append(
        element("div", "ls-kicker", "Reconciliation needed"),
        element("h2", "ls-conflict-title", `${snapshot.conflicts.length} source ${snapshot.conflicts.length === 1 ? "conflict" : "conflicts"}`),
        element("p", "ls-conflict-description", "LumiState preserved every claim so you can see where publishers disagree."),
      );
      intro.appendChild(introCopy);
      const list = element("div", "ls-conflict-list");
      for (const item of snapshot.conflicts) {
        const row = element("div", "ls-conflict-row");
        const copy = element("div", "ls-conflict-row-copy");
        copy.append(element("strong", "", `${humanize(item.kind)} mismatch`), element("span", "", item.message));
        const sources = element("div", "ls-conflict-sources");
        for (const source of item.sourceExtensions) sources.appendChild(pill(sourceName(source), "warn"));
        row.append(copy, sources);
        list.appendChild(row);
      }
      conflict.append(intro, list);
      shell.appendChild(conflict);
    }

    renderClaims(current, shell);

    const claimCount = snapshot.state.locations.length
      + snapshot.state.times.length
      + snapshot.state.conditions.length
      + snapshot.state.cast.length
      + snapshot.state.objects.length
      + snapshot.state.threads.length;
    if (!claimCount) {
      const empty = element("section", "ls-inline-empty");
      empty.append(element("strong", "", "The scene is connected and quiet"), element("p", "", "No source has published shared claims for this conversation yet. Scene Inspector will refresh automatically."));
      shell.appendChild(empty);
    }

    drawer.root.replaceChildren(shell);
    drawer.setBadge(snapshot.conflicts.length ? "!" : snapshot.freshness === "stale" ? "Stale" : null);
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
    cleanups.push(ctx.events.on(event, () => window.setTimeout(syncContext, 0)));
  }
  cleanups.push(ctx.events.on("PERMISSION_CHANGED", syncContext));

  render();
  ctx.ready();
  send({ type: "ready", chatId: safeActiveChat(ctx) });

  return () => {
    while (cleanups.length) {
      try {
        cleanups.pop()?.();
      } catch {
        // Best-effort cleanup.
      }
    }
    ctx.dom.cleanup();
  };
}
