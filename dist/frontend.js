// src/styles.ts
var LUMI_STATE_CSS = `
.ls-shell {
  --ls-text: var(--lumiverse-text, #edf4f4);
  --ls-muted: var(--lumiverse-text-muted, #a4b1b4);
  --ls-dim: var(--lumiverse-text-dim, #748287);
  --ls-deep: var(--lumiverse-bg-deep, #0e1518);
  --ls-panel: var(--lumiverse-bg-elevated, #152023);
  --ls-raised: var(--lumiverse-bg-hover, #1c2a2e);
  --ls-fill: var(--lumiverse-fill-subtle, rgba(255,255,255,.045));
  --ls-fill-hover: var(--lumiverse-fill-hover, rgba(255,255,255,.075));
  --ls-line: var(--lumiverse-border, rgba(210,245,240,.11));
  --ls-line-hover: var(--lumiverse-border-hover, rgba(210,245,240,.2));
  --ls-accent: #65dac8;
  --ls-accent-bright: #8ceddd;
  --ls-accent-soft: rgba(101,218,200,.13);
  --ls-good: var(--lumiverse-success, #72d5a5);
  --ls-warn: var(--lumiverse-warning, #edbd69);
  --ls-bad: var(--lumiverse-danger, #ef8087);
  --ls-weather: #69c9f4;
  --ls-world: #d8b978;
  --ls-mind: #ab91ed;
  --ls-radius-sm: var(--lumiverse-radius-sm, 7px);
  --ls-radius: var(--lumiverse-radius-md, 10px);
  --ls-radius-lg: var(--lumiverse-radius-lg, 14px);
  --ls-radius-xl: var(--lumiverse-radius-xl, 20px);
  --ls-transition: var(--lumiverse-transition-fast, 150ms ease);
  min-height: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px 15px 30px;
  color: var(--ls-text);
  background:
    radial-gradient(circle at 92% -5%, rgba(101,218,200,.09), transparent 26%),
    linear-gradient(180deg, rgba(101,218,200,.018), transparent 180px);
  font-family: var(--lumiverse-font-family, system-ui, sans-serif);
  font-size: 13px;
  line-height: 1.48;
}

.ls-shell *, .ls-shell *::before, .ls-shell *::after { box-sizing: border-box; }
.ls-shell h1, .ls-shell h2, .ls-shell h3, .ls-shell p, .ls-shell dl, .ls-shell dd { margin: 0; }
.ls-shell button { color: inherit; font: inherit; }
.ls-shell svg { display: block; width: 100%; height: 100%; }

.ls-header { display: grid; grid-template-columns: 42px minmax(0,1fr) auto; gap: 11px; align-items: center; }
.ls-brand-mark {
  width: 42px;
  height: 42px;
  padding: 9px;
  border: 1px solid color-mix(in srgb,var(--ls-accent) 36%,var(--ls-line));
  border-radius: 13px;
  color: var(--ls-accent);
  background: linear-gradient(145deg,var(--ls-accent-soft),var(--ls-fill));
  box-shadow: inset 0 1px 0 rgba(255,255,255,.07), 0 10px 28px rgba(0,0,0,.15);
}
.ls-brand-copy { min-width: 0; }
.ls-eyebrow, .ls-kicker { color: var(--ls-accent); font-size: 9px; font-weight: 800; letter-spacing: .15em; text-transform: uppercase; }
.ls-brand-title { margin-top: 1px; font-size: 15px; font-weight: 790; line-height: 1.2; letter-spacing: -.01em; }
.ls-brand-subtitle { margin-top: 2px; color: var(--ls-muted); font-size: 10px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ls-header-actions { display: flex; align-items: center; justify-content: flex-end; gap: 5px; flex-wrap: wrap; }

.ls-button {
  appearance: none;
  min-height: 30px;
  padding: 6px 10px;
  border: 1px solid var(--ls-line);
  border-radius: 8px;
  color: var(--ls-text);
  background: var(--ls-panel);
  font-size: 10px;
  font-weight: 720;
  cursor: pointer;
  transition: color var(--ls-transition),border-color var(--ls-transition),background var(--ls-transition),transform var(--ls-transition);
}
.ls-button:hover:not(:disabled) { border-color: var(--ls-line-hover); background: var(--ls-raised); transform: translateY(-1px); }
.ls-button:disabled { opacity: .45; cursor: default; }
.ls-button-quiet { min-height: 27px; padding: 4px 7px; color: var(--ls-muted); border-color: transparent; background: transparent; }
.ls-button-quiet:hover:not(:disabled) { color: var(--ls-text); border-color: var(--ls-line); background: var(--ls-fill-hover); transform: none; }
.ls-button:focus-visible, .ls-source-summary:focus-visible { outline: 2px solid var(--ls-accent); outline-offset: 2px; }

.ls-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 21px;
  padding: 3px 7px;
  border: 1px solid var(--ls-line);
  border-radius: 999px;
  color: var(--ls-muted);
  background: var(--ls-fill);
  font-size: 8px;
  font-weight: 790;
  letter-spacing: .025em;
  line-height: 1;
  white-space: nowrap;
}
.ls-pill.good { color: var(--ls-good); border-color: color-mix(in srgb,var(--ls-good) 30%,var(--ls-line)); background: color-mix(in srgb,var(--ls-good) 8%,transparent); }
.ls-pill.warn { color: var(--ls-warn); border-color: color-mix(in srgb,var(--ls-warn) 30%,var(--ls-line)); background: color-mix(in srgb,var(--ls-warn) 8%,transparent); }
.ls-pill.bad { color: var(--ls-bad); border-color: color-mix(in srgb,var(--ls-bad) 30%,var(--ls-line)); background: color-mix(in srgb,var(--ls-bad) 8%,transparent); }

.ls-stage {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  display: grid;
  grid-template-columns: minmax(0,1fr) minmax(190px,.55fr);
  gap: 18px;
  align-items: end;
  min-height: 190px;
  padding: 22px 20px 14px;
  border: 1px solid color-mix(in srgb,var(--ls-accent) 24%,var(--ls-line));
  border-radius: var(--ls-radius-xl);
  background:
    linear-gradient(135deg,color-mix(in srgb,var(--ls-accent) 8%,var(--ls-panel)),var(--ls-panel) 55%),
    var(--ls-panel);
  box-shadow: inset 0 1px 0 rgba(255,255,255,.04), 0 18px 45px rgba(0,0,0,.12);
}
.ls-stage.warn { border-color: color-mix(in srgb,var(--ls-warn) 28%,var(--ls-line)); }
.ls-stage.bad { border-color: color-mix(in srgb,var(--ls-bad) 28%,var(--ls-line)); }
.ls-stage-ambient { position: absolute; z-index: -1; width: 260px; height: 260px; right: -112px; top: -132px; border: 1px solid color-mix(in srgb,var(--ls-accent) 20%,transparent); border-radius: 50%; }
.ls-stage-ambient::before, .ls-stage-ambient::after { content: ""; position: absolute; border: 1px solid color-mix(in srgb,var(--ls-accent) 18%,transparent); border-radius: 50%; }
.ls-stage-ambient::before { inset: 37px; border-style: dashed; }
.ls-stage-ambient::after { inset: 84px; background: color-mix(in srgb,var(--ls-accent) 7%,transparent); box-shadow: 0 0 80px rgba(101,218,200,.08); }
.ls-stage-content { min-width: 0; align-self: center; }
.ls-stage-title { max-width: 620px; margin-top: 7px !important; font-size: clamp(24px,5vw,34px); line-height: 1.06; letter-spacing: -.035em; overflow-wrap: anywhere; }
.ls-stage-reading { margin-top: 9px !important; color: var(--ls-muted); font-size: 12px; line-height: 1.5; }
.ls-stage-sources { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 14px; }
.ls-stage-source { display: inline-flex; align-items: center; gap: 5px; color: var(--ls-muted); font-size: 9px; font-weight: 680; }
.ls-stage-metrics { position: relative; z-index: 1; display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 6px; }
.ls-stage-metric { min-width: 0; padding: 10px 8px; border: 1px solid var(--ls-line); border-radius: 10px; background: color-mix(in srgb,var(--ls-deep) 36%,transparent); text-align: center; backdrop-filter: blur(8px); }
.ls-stage-metric strong { display: block; font-size: 20px; line-height: 1; letter-spacing: -.04em; }
.ls-stage-metric span { display: block; margin-top: 5px; color: var(--ls-dim); font-size: 8px; font-weight: 730; text-transform: uppercase; letter-spacing: .07em; }
.ls-stage-footer { grid-column: 1/-1; display: flex; align-items: center; gap: 7px; min-width: 0; padding-top: 12px; border-top: 1px solid var(--ls-line); }
.ls-chat-label { color: var(--ls-dim); font-size: 8px; font-weight: 750; text-transform: uppercase; letter-spacing: .07em; }
.ls-chat-id { min-width: 0; overflow: hidden; text-overflow: ellipsis; color: var(--ls-muted); font: 9px/1.3 var(--lumiverse-font-mono,ui-monospace,monospace); white-space: nowrap; }
.ls-stage-updated { margin-left: auto; color: var(--ls-dim); font-size: 8px; white-space: nowrap; }

.ls-section { display: flex; flex-direction: column; gap: 9px; min-width: 0; }
.ls-section-heading { display: grid; grid-template-columns: minmax(0,1fr) auto; gap: 12px; align-items: end; padding: 1px 2px; }
.ls-section-copy { min-width: 0; }
.ls-section-title { margin-top: 2px !important; font-size: 16px; line-height: 1.25; letter-spacing: -.015em; }
.ls-section-description { margin-top: 3px !important; color: var(--ls-muted); font-size: 10px; }
.ls-count { align-self: end; min-width: 24px; padding: 2px 7px; border-radius: 999px; color: var(--ls-dim); background: var(--ls-fill); font-size: 9px; font-weight: 750; text-align: center; }

.ls-source-grid { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 7px; }
.ls-source { min-width: 0; overflow: hidden; border: 1px solid var(--ls-line); border-radius: 11px; background: var(--ls-panel); transition: border-color var(--ls-transition),background var(--ls-transition); }
.ls-source[open] { border-color: var(--ls-line-hover); background: var(--ls-raised); }
.ls-source-summary { list-style: none; display: grid; grid-template-columns: 31px minmax(0,1fr) auto 10px; gap: 7px; align-items: center; min-height: 53px; padding: 8px; cursor: pointer; user-select: none; }
.ls-source-summary::-webkit-details-marker { display: none; }
.ls-source-summary::marker { content: ""; }
.ls-source-mark { display: inline-flex; align-items: center; justify-content: center; width: 31px; height: 31px; border: 1px solid var(--ls-line); border-radius: 9px; color: var(--ls-muted); background: var(--ls-fill); font-size: 8px; font-weight: 850; letter-spacing: .06em; }
.ls-source.weather .ls-source-mark { color: var(--ls-weather); border-color: color-mix(in srgb,var(--ls-weather) 30%,var(--ls-line)); background: color-mix(in srgb,var(--ls-weather) 8%,transparent); }
.ls-source.world .ls-source-mark { color: var(--ls-world); border-color: color-mix(in srgb,var(--ls-world) 30%,var(--ls-line)); background: color-mix(in srgb,var(--ls-world) 8%,transparent); }
.ls-source.mind .ls-source-mark { color: var(--ls-mind); border-color: color-mix(in srgb,var(--ls-mind) 30%,var(--ls-line)); background: color-mix(in srgb,var(--ls-mind) 8%,transparent); }
.ls-source-copy { min-width: 0; display: flex; flex-direction: column; }
.ls-source-name { overflow: hidden; text-overflow: ellipsis; font-size: 10px; white-space: nowrap; }
.ls-source-age { margin-top: 1px; color: var(--ls-dim); font-size: 8px; }
.ls-source-chevron { color: var(--ls-dim); font-size: 13px; font-weight: 400; line-height: 1; transition: transform var(--ls-transition); }
.ls-source[open] .ls-source-chevron { transform: rotate(45deg); }
.ls-source-details { display: flex; flex-direction: column; gap: 5px; padding: 0 9px 9px 47px; border-top: 1px solid var(--ls-line); }
.ls-source-endpoint { padding-top: 7px; color: var(--ls-muted); font: 8px/1.45 var(--lumiverse-font-mono,ui-monospace,monospace); overflow-wrap: anywhere; }
.ls-source-meta, .ls-source-error { color: var(--ls-dim); font-size: 8px; }
.ls-source-error { color: var(--ls-warn); }

.ls-source-dot { width: 6px; height: 6px; flex: 0 0 auto; border-radius: 50%; background: var(--ls-dim); box-shadow: 0 0 0 3px color-mix(in srgb,var(--ls-dim) 10%,transparent); }
.ls-source-dot.weather { background: var(--ls-weather); box-shadow: 0 0 0 3px color-mix(in srgb,var(--ls-weather) 10%,transparent); }
.ls-source-dot.world { background: var(--ls-world); box-shadow: 0 0 0 3px color-mix(in srgb,var(--ls-world) 10%,transparent); }
.ls-source-dot.mind { background: var(--ls-mind); box-shadow: 0 0 0 3px color-mix(in srgb,var(--ls-mind) 10%,transparent); }

.ls-cast-grid, .ls-observation-grid, .ls-thread-grid { display: grid; grid-template-columns: repeat(auto-fit,minmax(220px,1fr)); gap: 8px; }
.ls-cast-card, .ls-observation, .ls-thread-card {
  min-width: 0;
  padding: 12px;
  border: 1px solid var(--ls-line);
  border-radius: var(--ls-radius-lg);
  background: var(--ls-panel);
}
.ls-cast-card.present { background: linear-gradient(145deg,color-mix(in srgb,var(--ls-good) 4%,var(--ls-panel)),var(--ls-panel)); }
.ls-cast-identity { display: grid; grid-template-columns: 39px minmax(0,1fr); gap: 9px; align-items: center; }
.ls-avatar { position: relative; display: inline-flex; align-items: center; justify-content: center; width: 39px; height: 39px; border: 1px solid color-mix(in srgb,var(--ls-accent) 28%,var(--ls-line)); border-radius: 12px; color: var(--ls-accent); background: linear-gradient(145deg,var(--ls-accent-soft),var(--ls-fill)); font-size: 10px; font-weight: 830; letter-spacing: .03em; }
.ls-presence-dot { position: absolute; right: -2px; bottom: -2px; width: 9px; height: 9px; border: 2px solid var(--ls-panel); border-radius: 50%; background: var(--ls-good); box-shadow: 0 0 8px color-mix(in srgb,var(--ls-good) 65%,transparent); }
.ls-cast-copy { min-width: 0; }
.ls-cast-name { overflow: hidden; text-overflow: ellipsis; font-size: 13px; line-height: 1.2; white-space: nowrap; }
.ls-cast-kind { margin-top: 2px; color: var(--ls-dim); font-size: 8px; font-weight: 720; text-transform: uppercase; letter-spacing: .06em; }
.ls-cast-state { display: flex; gap: 4px; flex-wrap: wrap; margin-top: 10px; }
.ls-stance { margin-top: 10px !important; color: var(--ls-text); font-size: 10px; line-height: 1.5; overflow-wrap: anywhere; }
.ls-aliases { margin-top: 5px !important; color: var(--ls-dim); font-size: 8px; overflow-wrap: anywhere; }

.ls-observation { position: relative; overflow: hidden; }
.ls-observation::before { content: ""; position: absolute; inset: 0 auto 0 0; width: 2px; background: var(--ls-accent); opacity: .75; }
.ls-observation.time::before { background: var(--ls-world); }
.ls-observation.condition::before { background: var(--ls-weather); }
.ls-observation-top { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.ls-observation-symbol { color: var(--ls-accent); font-size: 8px; font-weight: 850; letter-spacing: .11em; }
.ls-observation.time .ls-observation-symbol { color: var(--ls-world); }
.ls-observation.condition .ls-observation-symbol { color: var(--ls-weather); }
.ls-observation-title { margin-top: 11px !important; font-size: 14px; line-height: 1.3; overflow-wrap: anywhere; }
.ls-observation-copy { margin-top: 5px !important; color: var(--ls-muted); font-size: 9px; line-height: 1.5; overflow-wrap: anywhere; }
.ls-tags { display: flex; gap: 5px; flex-wrap: wrap; margin-top: 9px; }
.ls-tag { padding: 3px 6px; border: 1px solid var(--ls-line); border-radius: 6px; color: var(--ls-muted); background: var(--ls-fill); font-size: 8px; }
.ls-attributes { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 5px; margin-top: 10px !important; }
.ls-attribute { min-width: 0; padding: 6px 7px; border-radius: 7px; background: var(--ls-fill); }
.ls-attribute dt { color: var(--ls-dim); font-size: 7px; font-weight: 760; text-transform: uppercase; letter-spacing: .06em; }
.ls-attribute dd { margin-top: 2px; overflow: hidden; text-overflow: ellipsis; color: var(--ls-muted); font-size: 9px; white-space: nowrap; }

.ls-provenance { display: flex; align-items: center; gap: 6px; min-width: 0; margin-top: 11px; padding-top: 8px; border-top: 1px solid var(--ls-line); color: var(--ls-dim); font-size: 8px; }
.ls-provenance-name { color: var(--ls-muted); font-weight: 680; }
.ls-provenance-time { margin-left: auto; white-space: nowrap; }

.ls-thread-card { position: relative; overflow: hidden; }
.ls-thread-card::before { content: ""; position: absolute; left: 0; top: 0; bottom: 0; width: 2px; background: var(--ls-dim); }
.ls-thread-card.active::before { background: var(--ls-good); }
.ls-thread-card.abandoned::before { background: var(--ls-bad); }
.ls-thread-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; }
.ls-thread-title { font-size: 12px; line-height: 1.35; overflow-wrap: anywhere; }
.ls-thread-summary { margin-top: 7px !important; color: var(--ls-muted); font-size: 9px; line-height: 1.5; overflow-wrap: anywhere; }

.ls-inventory-grid { display: flex; flex-direction: column; gap: 6px; }
.ls-inventory-card { display: grid; grid-template-columns: 34px minmax(0,1fr) auto; gap: 9px; align-items: center; min-width: 0; padding: 9px 10px; border: 1px solid var(--ls-line); border-radius: 11px; background: var(--ls-panel); }
.ls-inventory-marker { display: inline-flex; align-items: center; justify-content: center; width: 34px; height: 34px; border: 1px solid var(--ls-line); border-radius: 9px; color: var(--ls-muted); background: var(--ls-fill); font-size: 8px; font-weight: 830; }
.ls-inventory-copy { min-width: 0; }
.ls-inventory-title { overflow: hidden; text-overflow: ellipsis; font-size: 11px; white-space: nowrap; }
.ls-inventory-description { margin-top: 2px !important; color: var(--ls-muted); font-size: 9px; line-height: 1.4; overflow-wrap: anywhere; }
.ls-inventory-card .ls-provenance { grid-column: 2/-1; margin-top: 0; padding-top: 6px; }

.ls-notice { display: grid; grid-template-columns: 23px minmax(0,1fr); gap: 9px; align-items: start; padding: 10px 11px; border: 1px solid color-mix(in srgb,var(--ls-warn) 30%,var(--ls-line)); border-radius: var(--ls-radius); background: linear-gradient(110deg,color-mix(in srgb,var(--ls-warn) 7%,var(--ls-panel)),var(--ls-panel)); }
.ls-notice.danger { border-color: color-mix(in srgb,var(--ls-bad) 32%,var(--ls-line)); background: linear-gradient(110deg,color-mix(in srgb,var(--ls-bad) 7%,var(--ls-panel)),var(--ls-panel)); }
.ls-notice-marker { display: inline-flex; align-items: center; justify-content: center; width: 21px; height: 21px; border: 1px solid color-mix(in srgb,var(--ls-warn) 36%,var(--ls-line)); border-radius: 50%; color: var(--ls-warn); background: color-mix(in srgb,var(--ls-warn) 8%,transparent); font-size: 10px; font-weight: 850; }
.ls-notice.danger .ls-notice-marker { color: var(--ls-bad); border-color: color-mix(in srgb,var(--ls-bad) 36%,var(--ls-line)); background: color-mix(in srgb,var(--ls-bad) 8%,transparent); }
.ls-notice-title { display: block; font-size: 10px; }
.ls-notice-body { margin-top: 2px !important; color: var(--ls-muted); font-size: 9px; line-height: 1.5; }

.ls-conflict-panel { overflow: hidden; border: 1px solid color-mix(in srgb,var(--ls-warn) 30%,var(--ls-line)); border-radius: var(--ls-radius-lg); background: linear-gradient(135deg,color-mix(in srgb,var(--ls-warn) 6%,var(--ls-panel)),var(--ls-panel) 38%); }
.ls-conflict-intro { display: grid; grid-template-columns: 36px minmax(0,1fr); gap: 10px; align-items: center; padding: 13px; }
.ls-conflict-mark { display: inline-flex; align-items: center; justify-content: center; width: 36px; height: 36px; border: 1px solid color-mix(in srgb,var(--ls-warn) 35%,var(--ls-line)); border-radius: 11px; color: var(--ls-warn); background: color-mix(in srgb,var(--ls-warn) 8%,transparent); font-size: 18px; }
.ls-conflict-title { margin-top: 2px !important; font-size: 15px; }
.ls-conflict-description { margin-top: 2px !important; color: var(--ls-muted); font-size: 9px; }
.ls-conflict-list { border-top: 1px solid var(--ls-line); }
.ls-conflict-row { display: grid; grid-template-columns: minmax(0,1fr) auto; gap: 10px; align-items: center; padding: 9px 12px; border-top: 1px solid var(--ls-line); }
.ls-conflict-row:first-child { border-top: 0; }
.ls-conflict-row-copy { min-width: 0; display: flex; flex-direction: column; }
.ls-conflict-row-copy strong { font-size: 10px; }
.ls-conflict-row-copy span { margin-top: 1px; color: var(--ls-dim); font-size: 8px; }
.ls-conflict-sources { display: flex; gap: 4px; flex-wrap: wrap; justify-content: flex-end; }

.ls-empty-state { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 28px 18px 25px; border: 1px solid color-mix(in srgb,var(--ls-accent) 20%,var(--ls-line)); border-radius: var(--ls-radius-xl); background: linear-gradient(145deg,color-mix(in srgb,var(--ls-accent) 6%,var(--ls-panel)),var(--ls-panel)); text-align: center; }
.ls-empty-visual { position: relative; width: 70px; height: 70px; margin-bottom: 5px; border: 1px solid color-mix(in srgb,var(--ls-accent) 28%,transparent); border-radius: 50%; }
.ls-empty-visual::before { content: ""; position: absolute; inset: 17px; border: 1px dashed color-mix(in srgb,var(--ls-accent) 42%,transparent); border-radius: 50%; }
.ls-empty-visual span { position: absolute; width: 8px; height: 8px; border-radius: 50%; background: var(--ls-accent); box-shadow: 0 0 13px color-mix(in srgb,var(--ls-accent) 70%,transparent); }
.ls-empty-visual span:nth-child(1) { top: -4px; left: 30px; }
.ls-empty-visual span:nth-child(2) { right: 4px; bottom: 8px; }
.ls-empty-visual span:nth-child(3) { left: 5px; bottom: 10px; }
.ls-empty-title { font-size: 21px; line-height: 1.15; letter-spacing: -.025em; }
.ls-empty-copy { max-width: 400px; color: var(--ls-muted); font-size: 11px; line-height: 1.55; }
.ls-empty-note { display: flex; align-items: center; gap: 7px; margin-top: 8px; padding: 6px 9px; border: 1px solid var(--ls-line); border-radius: 999px; color: var(--ls-dim); background: var(--ls-fill); font-size: 8px; }
.ls-no-chat { display: flex; flex-direction: column; gap: 18px; }
.ls-inline-empty { padding: 21px 14px; border: 1px dashed var(--ls-line); border-radius: var(--ls-radius-lg); background: var(--ls-fill); text-align: center; }
.ls-inline-empty strong { font-size: 12px; }
.ls-inline-empty p { max-width: 410px; margin: 4px auto 0 !important; color: var(--ls-muted); font-size: 10px; }

.ls-loading { display: flex; min-height: 210px; flex-direction: column; align-items: center; justify-content: center; gap: 7px; color: var(--ls-muted); text-align: center; }
.ls-loading strong { color: var(--ls-text); font-size: 12px; }
.ls-loading span { font-size: 9px; }
.ls-loading-orbit { width: 34px; height: 34px; margin-bottom: 5px; border: 2px solid var(--ls-line); border-top-color: var(--ls-accent); border-radius: 50%; animation: ls-spin .85s linear infinite; }
@keyframes ls-spin { to { transform: rotate(360deg); } }

@media (max-width: 660px) {
  .ls-header { grid-template-columns: 38px minmax(0,1fr); }
  .ls-brand-mark { width: 38px; height: 38px; }
  .ls-header-actions { grid-column: 1/-1; justify-content: flex-start; }
  .ls-stage { grid-template-columns: 1fr; min-height: 0; padding: 19px 16px 13px; }
  .ls-stage-metrics { max-width: 330px; }
  .ls-source-grid { grid-template-columns: 1fr; }
  .ls-stage-footer { flex-wrap: wrap; }
  .ls-stage-updated { width: 100%; margin-left: 0; }
}

@media (max-width: 430px) {
  .ls-shell { padding-left: 11px; padding-right: 11px; }
  .ls-stage-title { font-size: 24px; }
  .ls-cast-grid, .ls-observation-grid, .ls-thread-grid { grid-template-columns: 1fr; }
  .ls-conflict-row { grid-template-columns: 1fr; }
  .ls-conflict-sources { justify-content: flex-start; }
  .ls-provenance { flex-wrap: wrap; }
  .ls-provenance-time { width: 100%; margin-left: 12px; }
}

@media (prefers-reduced-motion: reduce) {
  .ls-shell *, .ls-shell *::before, .ls-shell *::after { animation-duration: .01ms !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important; }
}
`;

// src/frontend.ts
var STATE_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="2.2"/><path d="M12 2.8v3.1M12 18.1v3.1M2.8 12h3.1M18.1 12h3.1"/><path d="M5.5 5.5l2.2 2.2M16.3 16.3l2.2 2.2M18.5 5.5l-2.2 2.2M7.7 16.3l-2.2 2.2"/><circle cx="12" cy="12" r="6.1"/></svg>`;
function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className)
    node.className = className;
  if (text !== undefined)
    node.textContent = text;
  return node;
}
function safeActiveChat(ctx) {
  try {
    return ctx.getActiveChat().chatId ?? null;
  } catch {
    return null;
  }
}
function compactId(value) {
  if (!value)
    return "No active conversation";
  return value.length <= 18 ? value : `${value.slice(0, 8)}…${value.slice(-6)}`;
}
function sourceName(extensionId) {
  if (extensionId === "lumi_weather")
    return "LumiWeather";
  if (extensionId === "agent_world")
    return "LumiWorld";
  if (extensionId === "lumi_mind")
    return "LumiMind";
  return extensionId;
}
function sourceCode(extensionId) {
  if (extensionId === "lumi_weather")
    return "WE";
  if (extensionId === "agent_world")
    return "WO";
  if (extensionId === "lumi_mind")
    return "MI";
  return extensionId.slice(0, 2).toLocaleUpperCase();
}
function sourceClass(extensionId) {
  if (extensionId === "lumi_weather")
    return "weather";
  if (extensionId === "agent_world")
    return "world";
  if (extensionId === "lumi_mind")
    return "mind";
  return "other";
}
function statusTone(status) {
  if (status === "connected")
    return "good";
  if (status === "stale" || status === "unavailable" || status === "chat_mismatch")
    return "warn";
  return "bad";
}
function statusLabel(status) {
  return status.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toLocaleUpperCase());
}
function freshnessTone(freshness) {
  return freshness === "fresh" ? "good" : freshness === "stale" ? "warn" : "bad";
}
function freshnessLabel(freshness) {
  if (freshness === "fresh")
    return "Scene current";
  if (freshness === "stale")
    return "Scene aging";
  return "Scene offline";
}
function relativeTime(timestamp) {
  if (!timestamp)
    return "No update yet";
  const seconds = Math.max(0, Math.floor((Date.now() - timestamp) / 1000));
  if (seconds < 10)
    return "Just now";
  if (seconds < 60)
    return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60)
    return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24)
    return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}
function initials(name) {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (!words.length)
    return "?";
  if (words.length === 1)
    return words[0]?.slice(0, 2).toLocaleUpperCase() ?? "?";
  return `${words[0]?.[0] ?? ""}${words.at(-1)?.[0] ?? ""}`.toLocaleUpperCase();
}
function pill(text, tone = "") {
  return element("span", `ls-pill ${tone}`.trim(), text);
}
function actionButton(label, onClick, className = "") {
  const button = element("button", `ls-button ${className}`.trim(), label);
  button.type = "button";
  button.addEventListener("click", onClick);
  return button;
}
function provenanceFooter(provenance) {
  const footer = element("div", "ls-provenance");
  footer.append(element("span", `ls-source-dot ${sourceClass(provenance.extensionId)}`), element("span", "ls-provenance-name", sourceName(provenance.extensionId)), element("span", "ls-provenance-time", `Observed ${relativeTime(provenance.observedAt)}`));
  return footer;
}
function sectionHeading(kicker, title, count, description) {
  const heading = element("div", "ls-section-heading");
  const copy = element("div", "ls-section-copy");
  copy.append(element("div", "ls-kicker", kicker), element("h2", "ls-section-title", title));
  if (description)
    copy.appendChild(element("p", "ls-section-description", description));
  heading.append(copy, element("span", "ls-count", String(count)));
  return heading;
}
function formatTimeClaim(claim) {
  if (claim.clock === "calendar") {
    return {
      title: [claim.date, claim.time].filter(Boolean).join(" · ") || "Calendar time unavailable",
      detail: claim.timezone ? `Visible story time · ${claim.timezone}` : "Visible story date and time",
      tags: ["Calendar"]
    };
  }
  const day = claim.day == null ? "Day unknown" : `Day ${claim.day}`;
  const hour = claim.hour == null ? "Hour unknown" : `${String(claim.hour).padStart(2, "0")}:00`;
  return {
    title: `${day} · ${hour}`,
    detail: "LumiWorld simulation clock",
    tags: [claim.running ? "Running" : "Paused"]
  };
}
function subjectLabel(claim) {
  return claim.subject.kind === "scene" ? "Scene-wide" : `${claim.subject.actor.kind} scoped`;
}
function humanize(value) {
  return value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toLocaleUpperCase());
}
function formatAttribute(value) {
  if (value === null)
    return "—";
  if (typeof value === "boolean")
    return value ? "Yes" : "No";
  return String(value);
}
function locationCard(claim) {
  const node = element("article", "ls-observation location");
  const top = element("div", "ls-observation-top");
  top.append(element("span", "ls-observation-symbol", "LOC"), pill(subjectLabel(claim)));
  node.append(top, element("h3", "ls-observation-title", claim.label));
  node.appendChild(element("p", "ls-observation-copy", claim.subject.kind === "scene" ? "The visible setting shared by scene publishers." : "A location attached to one actor."));
  node.appendChild(provenanceFooter(claim.provenance));
  return node;
}
function timeCard(claim) {
  const formatted = formatTimeClaim(claim);
  const node = element("article", "ls-observation time");
  const top = element("div", "ls-observation-top");
  top.append(element("span", "ls-observation-symbol", "TIME"), pill(subjectLabel(claim)));
  node.append(top, element("h3", "ls-observation-title", formatted.title), element("p", "ls-observation-copy", formatted.detail));
  const tags = element("div", "ls-tags");
  for (const tag of formatted.tags)
    tags.appendChild(element("span", "ls-tag", tag));
  node.append(tags, provenanceFooter(claim.provenance));
  return node;
}
function conditionCard(claim) {
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
function castCard(claim) {
  const node = element("article", `ls-cast-card${claim.present ? " present" : ""}`);
  const identity = element("div", "ls-cast-identity");
  const avatar = element("div", "ls-avatar", initials(claim.name));
  if (claim.present)
    avatar.appendChild(element("span", "ls-presence-dot"));
  const copy = element("div", "ls-cast-copy");
  copy.append(element("h3", "ls-cast-name", claim.name), element("div", "ls-cast-kind", humanize(claim.actor.kind)));
  identity.append(avatar, copy);
  const state = element("div", "ls-cast-state");
  state.append(pill(claim.present ? "Present" : "Off scene", claim.present ? "good" : ""));
  if (!claim.confirmed)
    state.appendChild(pill("Unconfirmed", "warn"));
  node.append(identity, state);
  if (claim.publicStance)
    node.appendChild(element("p", "ls-stance", claim.publicStance));
  if (claim.aliases.length)
    node.appendChild(element("p", "ls-aliases", `Also known as ${claim.aliases.join(", ")}`));
  node.appendChild(provenanceFooter(claim.provenance));
  return node;
}
function objectCard(claim) {
  const node = element("article", "ls-inventory-card");
  const marker = element("span", "ls-inventory-marker", initials(claim.name));
  const copy = element("div", "ls-inventory-copy");
  copy.append(element("h3", "ls-inventory-title", claim.name));
  if (claim.state)
    copy.appendChild(element("p", "ls-inventory-description", claim.state));
  const type = pill(humanize(claim.object.kind));
  node.append(marker, copy, type, provenanceFooter(claim.provenance));
  return node;
}
function threadCard(claim) {
  const node = element("article", `ls-thread-card ${claim.status}`);
  const top = element("div", "ls-thread-top");
  top.append(element("h3", "ls-thread-title", claim.label), pill(humanize(claim.status), claim.status === "active" ? "good" : claim.status === "abandoned" ? "bad" : ""));
  node.appendChild(top);
  if (claim.summary)
    node.appendChild(element("p", "ls-thread-summary", claim.summary));
  node.appendChild(provenanceFooter(claim.provenance));
  return node;
}
function sourceCard(source) {
  const tone = statusTone(source.status);
  const node = element("details", `ls-source ${tone} ${sourceClass(source.extensionId)}`);
  const summary = element("summary", "ls-source-summary");
  const mark = element("span", "ls-source-mark", sourceCode(source.extensionId));
  const copy = element("span", "ls-source-copy");
  copy.append(element("strong", "ls-source-name", source.label), element("span", "ls-source-age", relativeTime(source.updatedAt)));
  summary.append(mark, copy, pill(statusLabel(source.status), tone), element("span", "ls-source-chevron", "+"));
  const details = element("div", "ls-source-details");
  const revision = source.revision == null ? "No revision received" : `Revision ${source.revision}`;
  details.append(element("div", "ls-source-endpoint", source.endpoint), element("div", "ls-source-meta", `${revision} · ${source.freshness ? humanize(source.freshness) : "No freshness signal"}`));
  if (source.error)
    details.appendChild(element("div", "ls-source-error", source.error));
  node.append(summary, details);
  return node;
}
function diagnostics(state, ctx) {
  const snapshot = state.snapshot;
  return {
    reportFormat: "lumi_state.diagnostics.v1",
    generatedAt: new Date().toISOString(),
    privacy: {
      sanitized: true,
      excluded: ["claim values", "actor names", "aliases", "public stance text", "full entity IDs", "full chat IDs"]
    },
    extension: {
      identifier: ctx.manifest.identifier,
      name: ctx.manifest.name,
      version: ctx.manifest.version,
      minimumLumiverseVersion: ctx.manifest.minimum_lumiverse_version ?? null
    },
    browser: {
      userAgent: navigator.userAgent,
      language: navigator.language,
      online: navigator.onLine
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
        threads: snapshot.state.threads.length
      }
    },
    sources: snapshot.sources.map((source) => ({
      extensionId: source.extensionId,
      endpoint: source.endpoint,
      status: source.status,
      chatMatchesAggregate: source.chatId === snapshot.chatId,
      revision: source.revision,
      freshness: source.freshness,
      updatedAt: source.updatedAt,
      error: source.error
    })),
    permissions: { chats: state.chatsPermission }
  };
}
async function copyText(value) {
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
function setup(ctx) {
  ctx.deferReady();
  const cleanups = [ctx.dom.addStyle(LUMI_STATE_CSS)];
  const drawer = ctx.ui.registerDrawerTab({
    id: "scene-inspector",
    title: "LumiState — Scene Inspector",
    shortName: "State",
    headerTitle: "Scene Inspector",
    description: "Inspect the shared scene published by LumiWeather, LumiWorld, and LumiMind",
    keywords: ["state", "scene", "weather", "world", "mind", "interop", "diagnostics"],
    iconSvg: STATE_ICON
  });
  let current = null;
  let errorMessage = null;
  function send(message) {
    try {
      ctx.sendToBackend(message);
    } catch {
      errorMessage = "LumiState could not reach its backend.";
      render();
    }
  }
  function syncContext() {
    send({ type: "refresh", chatId: safeActiveChat(ctx) });
  }
  function renderHeader() {
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
      if (!current)
        return;
      copy.disabled = true;
      copyText(JSON.stringify(diagnostics(current, ctx), null, 2)).then(() => {
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
  function renderNotice(title, body, tone) {
    const notice = element("div", `ls-notice ${tone}`);
    notice.setAttribute("role", "status");
    notice.append(element("span", "ls-notice-marker", tone === "danger" ? "!" : "≠"));
    const copy = element("div", "ls-notice-copy");
    copy.append(element("strong", "ls-notice-title", title), element("p", "ls-notice-body", body));
    notice.appendChild(copy);
    return notice;
  }
  function renderSceneStage(state) {
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
    const extensionIds = new Set;
    for (const claim of [location, time, condition]) {
      if (!claim || extensionIds.has(claim.provenance.extensionId))
        continue;
      extensionIds.add(claim.provenance.extensionId);
      const source = element("span", "ls-stage-source");
      source.append(element("span", `ls-source-dot ${sourceClass(claim.provenance.extensionId)}`), element("span", "", sourceName(claim.provenance.extensionId)));
      sourceRow.appendChild(source);
    }
    if (sourceRow.childElementCount)
      content.appendChild(sourceRow);
    const metrics = element("div", "ls-stage-metrics");
    for (const [value, label] of [
      [String(connected), "Signals"],
      [String(present), "Present"],
      [String(snapshot.conflicts.length), "Conflicts"]
    ]) {
      const metric = element("div", "ls-stage-metric");
      metric.append(element("strong", "", value), element("span", "", label));
      metrics.appendChild(metric);
    }
    const footer = element("div", "ls-stage-footer");
    footer.append(element("span", "ls-chat-label", "Active conversation"), element("code", "ls-chat-id", compactId(snapshot.chatId)), element("span", "ls-stage-updated", `Updated ${relativeTime(snapshot.updatedAt)} · revision ${snapshot.revision}`));
    stage.append(ambient, content, metrics, footer);
    return stage;
  }
  function renderSignalPath(state) {
    const snapshot = state.snapshot;
    const section = element("section", "ls-section");
    const active = snapshot.sources.filter((source) => source.status === "connected" || source.status === "stale").length;
    section.appendChild(sectionHeading("Source health", "Signal path", active, "Each publisher remains authoritative for its own scene data."));
    const grid = element("div", "ls-source-grid");
    for (const source of snapshot.sources)
      grid.appendChild(sourceCard(source));
    section.appendChild(grid);
    return section;
  }
  function renderNoChat(state) {
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
  function renderClaims(state, shell) {
    const snapshot = state.snapshot;
    if (snapshot.state.cast.length) {
      const section = element("section", "ls-section");
      const present = snapshot.state.cast.filter((claim) => claim.present).length;
      section.appendChild(sectionHeading("Shared identities", "Cast in view", snapshot.state.cast.length, `${present} currently marked present.`));
      const grid = element("div", "ls-cast-grid");
      for (const claim of snapshot.state.cast)
        grid.appendChild(castCard(claim));
      section.appendChild(grid);
      shell.appendChild(section);
    }
    const readingCount = snapshot.state.locations.length + snapshot.state.times.length + snapshot.state.conditions.length;
    if (readingCount) {
      const section = element("section", "ls-section");
      section.appendChild(sectionHeading("Published claims", "Scene readings", readingCount, "Source-aware observations, shown without silently resolving disagreement."));
      const grid = element("div", "ls-observation-grid");
      for (const claim of snapshot.state.locations)
        grid.appendChild(locationCard(claim));
      for (const claim of snapshot.state.times)
        grid.appendChild(timeCard(claim));
      for (const claim of snapshot.state.conditions)
        grid.appendChild(conditionCard(claim));
      section.appendChild(grid);
      shell.appendChild(section);
    }
    if (snapshot.state.threads.length) {
      const section = element("section", "ls-section");
      section.appendChild(sectionHeading("Narrative continuity", "Active threads", snapshot.state.threads.length));
      const grid = element("div", "ls-thread-grid");
      for (const claim of snapshot.state.threads)
        grid.appendChild(threadCard(claim));
      section.appendChild(grid);
      shell.appendChild(section);
    }
    if (snapshot.state.objects.length) {
      const section = element("section", "ls-section");
      section.appendChild(sectionHeading("World state", "Objects in context", snapshot.state.objects.length));
      const grid = element("div", "ls-inventory-grid");
      for (const claim of snapshot.state.objects)
        grid.appendChild(objectCard(claim));
      section.appendChild(grid);
      shell.appendChild(section);
    }
  }
  function render() {
    const shell = element("div", "ls-shell");
    shell.appendChild(renderHeader());
    if (errorMessage)
      shell.appendChild(renderNotice("Refresh interrupted", errorMessage, "danger"));
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
      introCopy.append(element("div", "ls-kicker", "Reconciliation needed"), element("h2", "ls-conflict-title", `${snapshot.conflicts.length} source ${snapshot.conflicts.length === 1 ? "conflict" : "conflicts"}`), element("p", "ls-conflict-description", "LumiState preserved every claim so you can see where publishers disagree."));
      intro.appendChild(introCopy);
      const list = element("div", "ls-conflict-list");
      for (const item of snapshot.conflicts) {
        const row = element("div", "ls-conflict-row");
        const copy = element("div", "ls-conflict-row-copy");
        copy.append(element("strong", "", `${humanize(item.kind)} mismatch`), element("span", "", item.message));
        const sources = element("div", "ls-conflict-sources");
        for (const source of item.sourceExtensions)
          sources.appendChild(pill(sourceName(source), "warn"));
        row.append(copy, sources);
        list.appendChild(row);
      }
      conflict.append(intro, list);
      shell.appendChild(conflict);
    }
    renderClaims(current, shell);
    const claimCount = snapshot.state.locations.length + snapshot.state.times.length + snapshot.state.conditions.length + snapshot.state.cast.length + snapshot.state.objects.length + snapshot.state.threads.length;
    if (!claimCount) {
      const empty = element("section", "ls-inline-empty");
      empty.append(element("strong", "", "The scene is connected and quiet"), element("p", "", "No source has published shared claims for this conversation yet. Scene Inspector will refresh automatically."));
      shell.appendChild(empty);
    }
    drawer.root.replaceChildren(shell);
    drawer.setBadge(snapshot.conflicts.length ? "!" : snapshot.freshness === "stale" ? "Stale" : null);
  }
  cleanups.push(ctx.onBackendMessage((payload) => {
    const message = payload;
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
  for (const event of ["CHAT_SWITCHED", "CHAT_CHANGED"]) {
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
      } catch {}
    }
    ctx.dom.cleanup();
  };
}
export {
  setup
};
