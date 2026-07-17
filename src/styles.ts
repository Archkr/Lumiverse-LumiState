export const LUMI_STATE_CSS = `
.ls-shell {
  --ls-accent: #7dd3fc;
  --ls-good: #73d8a0;
  --ls-warn: #f4c66d;
  --ls-bad: #f28b82;
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 14px;
  color: var(--lumiverse-text, #eef2f7);
  font-family: var(--lumiverse-font-family, system-ui, sans-serif);
}
.ls-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; }
.ls-kicker { color: var(--ls-accent); font-size: 10px; font-weight: 800; letter-spacing: .14em; text-transform: uppercase; }
.ls-title { margin: 3px 0 2px; font-size: 20px; line-height: 1.15; }
.ls-subtitle { color: var(--lumiverse-text-muted, #9ca8b7); font-size: 12px; line-height: 1.45; }
.ls-actions { display: flex; gap: 7px; flex-wrap: wrap; justify-content: flex-end; }
.ls-button {
  appearance: none; border: 1px solid var(--lumiverse-border, rgba(255,255,255,.14));
  border-radius: 9px; padding: 7px 10px; background: var(--lumiverse-fill, rgba(255,255,255,.07));
  color: inherit; font: inherit; font-size: 11px; font-weight: 700; cursor: pointer;
}
.ls-button:hover { border-color: color-mix(in srgb, var(--ls-accent) 55%, transparent); background: var(--lumiverse-fill-hover, rgba(255,255,255,.11)); }
.ls-overview, .ls-card, .ls-source, .ls-empty, .ls-alert {
  border: 1px solid var(--lumiverse-border, rgba(255,255,255,.12));
  border-radius: 12px; background: var(--lumiverse-fill-subtle, rgba(255,255,255,.045));
}
.ls-overview { display: grid; grid-template-columns: minmax(0,1fr) auto; gap: 12px; padding: 12px; align-items: center; }
.ls-overview-main { min-width: 0; }
.ls-overview-label { font-size: 11px; color: var(--lumiverse-text-muted, #9ca8b7); }
.ls-overview-value { margin-top: 3px; font-family: var(--lumiverse-font-mono, ui-monospace, monospace); font-size: 12px; overflow: hidden; text-overflow: ellipsis; }
.ls-pills { display: flex; gap: 6px; flex-wrap: wrap; justify-content: flex-end; }
.ls-pill { border-radius: 999px; padding: 4px 8px; font-size: 10px; font-weight: 800; background: rgba(125,211,252,.12); color: var(--ls-accent); }
.ls-pill.good { background: rgba(115,216,160,.13); color: var(--ls-good); }
.ls-pill.warn { background: rgba(244,198,109,.14); color: var(--ls-warn); }
.ls-pill.bad { background: rgba(242,139,130,.14); color: var(--ls-bad); }
.ls-section { display: flex; flex-direction: column; gap: 8px; }
.ls-section-head { display: flex; align-items: baseline; justify-content: space-between; gap: 8px; }
.ls-section-title { margin: 0; font-size: 12px; letter-spacing: .04em; text-transform: uppercase; }
.ls-section-count { color: var(--lumiverse-text-muted, #9ca8b7); font-size: 10px; }
.ls-source-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 8px; }
.ls-source { padding: 10px; min-width: 0; }
.ls-source-top { display: flex; justify-content: space-between; gap: 8px; align-items: center; }
.ls-source-name { font-size: 12px; font-weight: 800; }
.ls-source-endpoint { margin-top: 7px; color: var(--lumiverse-text-muted, #9ca8b7); font: 9px/1.35 var(--lumiverse-font-mono, ui-monospace, monospace); overflow-wrap: anywhere; }
.ls-source-meta { margin-top: 5px; font-size: 10px; color: var(--lumiverse-text-muted, #9ca8b7); }
.ls-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 8px; }
.ls-card { padding: 11px; min-width: 0; }
.ls-card-source { color: var(--ls-accent); font-size: 9px; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; }
.ls-card-title { margin-top: 5px; font-size: 13px; font-weight: 800; overflow-wrap: anywhere; }
.ls-card-body { margin-top: 5px; color: var(--lumiverse-text-muted, #aab4c2); font-size: 11px; line-height: 1.45; overflow-wrap: anywhere; }
.ls-card-tags { display: flex; gap: 5px; flex-wrap: wrap; margin-top: 8px; }
.ls-tag { padding: 3px 6px; border-radius: 6px; background: rgba(255,255,255,.065); color: var(--lumiverse-text-muted, #b2bdca); font-size: 9px; }
.ls-alert { padding: 10px 11px; border-color: color-mix(in srgb, var(--ls-warn) 35%, transparent); }
.ls-alert.error { border-color: color-mix(in srgb, var(--ls-bad) 45%, transparent); }
.ls-alert-title { color: var(--ls-warn); font-size: 11px; font-weight: 800; }
.ls-alert.error .ls-alert-title { color: var(--ls-bad); }
.ls-alert-body { margin-top: 3px; color: var(--lumiverse-text-muted, #aab4c2); font-size: 10px; line-height: 1.45; }
.ls-empty { padding: 22px 14px; text-align: center; }
.ls-empty-title { font-size: 13px; font-weight: 800; }
.ls-empty-body { max-width: 360px; margin: 5px auto 0; color: var(--lumiverse-text-muted, #9ca8b7); font-size: 11px; line-height: 1.5; }
.ls-loading { padding: 30px 14px; color: var(--lumiverse-text-muted, #9ca8b7); text-align: center; font-size: 12px; }
@media (max-width: 520px) {
  .ls-head { flex-direction: column; }
  .ls-actions { justify-content: flex-start; }
  .ls-overview { grid-template-columns: 1fr; }
  .ls-pills { justify-content: flex-start; }
}
`;
