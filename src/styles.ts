export const LUMI_STATE_CSS = `
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
