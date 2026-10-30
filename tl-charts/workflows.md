# Chart command recipes and boundaries

Source-reviewed October 29, 2026. Discover each command on the intended Desktop
tab before using it. These recipes are not live-account or deployment proof.
Run CLI examples from `TradingLead-Desktop`, always with the explicit discovered
tab. JSON below is an executor envelope; CLI `--params`/`--params-file` takes
only its `params` object. Never send account, pane, grant or credential fields.
Unknown envelope/parameter keys are rejected.

## Context and permissions

1. Follow `tl-desktop` discovery; read `workspace.getState`, `chart.getState`
   and `feeds.list`. `available:true` on a feed describes its usable interface,
   not a verified authenticated provider session or fresh candles.
2. Verify the intended account and active pane, exact symbol/feed/interval,
   `ready:true`, settled discovery/source switching and history not loading/error.
   No chart command accepts `paneId`; select the target with `layout.set`
   `activePane` first (see [layouts-grid.md](layouts-grid.md)).
3. Use explicit `chart.open` parameters to change chart context, then poll state.
   It navigates the tab; it does not select Grid settings or a watchlist row.
4. Require the final `status:"ok"` and inspect domain state afterward.
   `requested:true,confirmed:false` is only acceptance.

All external commands require AI access. The catalog marks chart navigation,
reload/live and panel controls `mutates:false` despite their visible effects and
possible provider quota use. They do not require a retry key. Native study writes
require sign-in, indicator access and a retry key. Replay, view/compare/action,
drawings, layouts, Grid and drawing-template apply require sign-in, general local
write access and a retry key.
For an uncertain write, reconcile the same key and identical parameters; a timeout
is not rollback. Keys contain 1–80 letters/numbers/underscores/hyphens.

`feeds.list` discovers interfaces/capabilities, not provider login status,
entitlements, credentials or automatic fallback. Current source returns only the
default feed with `data.discovery.status:"error"` and code
`FEED_DISCOVERY_FAILED` when broker discovery fails, even though final command
`status` is `"ok"`. Inspect this nested status: no broker feed was verified, and
cached broker entries are not returned. Successful discovery reports
`data.discovery.status:"ok"`.

Current source lets explicit `feed:"default"` calls to `chart.open` and
`marketData.getBars` proceed independently of broker discovery; requested provider
feeds still require successful discovery. This does not bypass default history
errors or select a fallback. These October 29 source corrections are not proof
that an installed tab has them: older handlers may still block default dispatch
or omit `discovery`. Report that distinction, not a successful broker discovery.

## Panels and bounded snapshot

```bash
node cli.cjs exec workspace.setPanel --tab ACTUAL_TAB_ID \
  --params '{"panel":"intelligence","expanded":true}'
```

```json
{"type":"chart.snapshot","params":{"bars":5}}
```

Send `expanded` explicitly for compatibility. Current source's shared command
adapter defaults omission to `true` and preserves explicit `false`; older
handlers may reject omission. This source correction is not installed-app proof.
Supported panel keys are
`peers`, `watchlists`, `futures`, `backtesting`, `paper-trading`, `intelligence`,
`indicators` (`simulation` is a legacy alias). Verify `workspace.getState.panels`.
This is not right-sidebar selection: use `workspace.openSidebar` (owned by
[tl-desktop](../tl-desktop/SKILL.md)) for Watch, Indices, Heatmap, Scan, Grid,
Patterns, Alerts, Research, Data Window, Paper and Contests. There is no generic
popup command.

Snapshot defaults to five trailing loaded rows, maximum 25, with bounded columns
and bytes. It does not fetch earlier history. Inspect schema, timestamps, missing
cells, truncation and calculation observations; study presence or a post-subscribe
data event is not proof of numerical correctness or an earlier error-free run.

Market Intelligence, Futures, Heatmap and other market-panel reads belong to
[tl-markets](../tl-markets/SKILL.md).

## Native studies and drawing templates

```json
{"type":"studies.list","params":{"offset":0,"limit":50}}
```

Use the returned exact name in `studies.inputs`, then apply only declared input
IDs/types/options/bounds with `studies.apply` and a unique key. Discovery pages
allow offset 0–10000 and limit 1–100. Inputs accept up to 64 declared primitive
values; strings are at most 200 characters. Do not guess a study name or input ID.

```json
{"type":"studies.applied","params":{"offset":0,"limit":50}}
```

For visibility/removal, copy the exact `entityId`, `name` and current boolean
`expectedVisible` from that response; `studies.setVisibility` also requires the
desired `visible`. Re-read on stale state. This targets unmanaged native studies
only, not TLScript/Python/backtest instances or drawings. Verify applied state
and snapshot values afterward; custom source/settings belong to their own skills.

Have the user select one editable drawing, then call `drawingTemplates.state`.
Use its exact `entityId` and `type` in `drawingTemplates.list` (nonnegative safe
integer offset, limit 1–50). Apply a returned exact `name` with those selectors
and a retry key. Recheck selection first. Apply changes style only; it creates or
deletes no drawing. Save/rename/delete/pin/last-used template behavior, drawing
creation/editing, full chart layouts and chart/style templates remain distinct
UI storage contracts, not invented commands. Native indicator templates use
`studyTemplates.manage` (see [SKILL.md](SKILL.md)).

## Native replay

```json
{"type":"chart.replayControl","params":{"action":"select"},"idempotencyKey":"native-select-001"}
```

The native notice/picker still requires a person to choose a candle. Poll
`chart.getState.replay`: verify `selecting:false`, a native cutoff, `runId:null`,
no loading/error and the intended context before playing or stepping.

```json
{"type":"chart.replayControl","params":{"action":"speed","speed":2},"idempotencyKey":"native-speed-001"}
```

```json
{"type":"chart.replayControl","params":{"action":"step"},"idempotencyKey":"native-step-001"}
```

Other supported actions are `play`, `pause`, `end`. Only `speed` accepts `speed`
(finite 0.1–200 bars/second); do not attach it to other actions. End is explicit
and restores ordinary chart history; it does not delete user studies/accounts.
Inspect cursor/loading/playing/error after requests. History navigation refuses
active replay rather than ending it. `chart.setReplayTime` is an internal
simulation integration, not a public manual-player command.

UI-only Back/Shift+Left is not a `back` replayControl action. Current shortcuts:
Shift+Space toggles; Shift+Right steps paused or temporarily boosts playing;
Shift+Up/Down changes speed with hold/release restoration. Escape cancels native
selection/help, not replay. Shortcuts route through registered workspace/native
documents to the active replay owner, or the remaining replay owner; typing,
composition, dialog/menu contexts and modifiers gate them. Do not promise
application-global keys or inactive-pane isolation based on key names.

Unmodified Space advances the displayed watchlist/index catalogue via its
registered navigation owner, not playback. It respects editing/overlay guards,
readiness and replay handoff prompts; it does not wrap at the last displayed row.
Arrow Up/Down in ticker rows changes selection through the displayed row order.
There is no public next-row/select-index/constituent-navigation command.
`universe.list` plus explicit `chart.open` is the available command workflow,
not parity with those UI selections.

Native replay reveals completed candles without strategy accounting. The UI
Trade handoff and paper orders/replay belong to `tl-paper-trading`; inspect
`runId` before choosing an owner. Never apply native end-of-candle clock semantics
to a simulation cutoff or claim native commands fill orders.

## Saved alerts

Saved price alerts (`alerts.*`) moved to [tl-alerts](../tl-alerts/SKILL.md).

## Intentional manual and administrative boundaries

Chart Grid is a separate cloud-backed gallery, not split chart layouts or
Historical Patterns; its commands are in [layouts-grid.md](layouts-grid.md).
Opening a card from the UI requires a ready cloud-backed `default` active chart
and explicitly ended replay; it never silently converts a broker/local chart.
Ranking uses stored summaries while cards use loaded bars; values can differ.
Only the per-card enlarge dialog remains UI-only.

Chart/popup property editing beyond `chart.setView`, toolbar visibility, native
OHLC legend collapse, favorite drawing-tool membership, crosshair sync between
panes, drawing styles beyond templates, and saved-layout rename/delete remain
user-only. Shift+F is a guarded fullscreen UI shortcut; use
`chart.action` fullscreen or `layout.set` fullscreen instead. Do not synthesize
arbitrary JavaScript or keyboard events to fake API coverage. Account-local
layout storage and synced panel/replay preferences are different contracts;
source presence does not prove cloud-rule deployment.

Sign-in, broker OAuth/token renewal, grant approval, subscription/paywall checkout
and account administration are human-owned flows, not chart commands. Chat
configuration and historical data repair are separate owner/admin operations;
`chart.reload`/history retry does not repair stored candles. Do not invent
auth/billing/admin/repair namespaces, reset account state, or launch/reload the
app to work around an unavailable tab.
