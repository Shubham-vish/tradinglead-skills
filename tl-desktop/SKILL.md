---
name: tl-desktop
description: Start here for any TradingLead automation. Connect to TradingLead Desktop, target the right tab, discover commands, handle grants, retry keys and errors, drive the workspace shell (bottom panels, right sidebar panels, light/dark theme, activity) and map every visible workspace UI area to the owning tl-* skill. Not ContentLead and not live broker execution.
---

# TradingLead Desktop - connection and workflow router

Load this before using any TradingLead product command. Read
[commands.md](commands.md) for this skill's exact command fields and native
Desktop controls. Use the installed app's live capabilities as authoritative.

## Connect without exposing credentials

The normal terminal entry point is `TradingLead-Desktop/cli.cjs`. In the standard
Codes layout it is `../../TradingLead-Desktop/cli.cjs` relative to this skill.
Resolve the actual checkout; do not assume the terminal's working directory.
The examples below run **from the TradingLead-Desktop repository**.

```bash
node cli.cjs health
node cli.cjs tabs
node cli.cjs desktop status --tab ACTUAL_TAB_ID
node cli.cjs capabilities --tab ACTUAL_TAB_ID
node cli.cjs exec workspace.getState --tab ACTUAL_TAB_ID
node cli.cjs exec chart.getState --tab ACTUAL_TAB_ID
```

1. Check health and tabs. If Desktop is not running, launch the installed app,
   or use the existing repo's documented `npm run dev`. Discover an installed
   bundle from native app metadata, not a guessed path. Do not start a duplicate
   instance, restart an existing app, change its origin or reload user charts.
2. Select the intended native tab. Even with one tab, pass `--tab` explicitly.
   Never choose another tab just because the requested one is unavailable.
3. Check account, chart symbol/feed/interval and permissions before changing
   anything. Readiness does not certify fresh market data.
4. Read that tab's current catalog and the domain capability command before
   authoring code or executing a strategy. Do not invent functions or fields.
5. If not ready, `desktop status` works before workspace registration.
   `desktop reconnect` retries existing access; it cannot grant access.
   `desktop open-access` opens the user control, not an approval bypass.
   Do not reload the page merely to reconnect: unsaved work may exist.

The CLI reads private local discovery itself. Never print the discovery token,
put it in command-line arguments, paste raw diagnostic state, or reuse discovery
across app restarts. Browser-only tabs do not provide this external transport.

Desktop is a hybrid shell: the installed package supplies native IPC, isolation
and transport, while its active origin supplies the frontend catalog and
handlers. A local frontend checkout, the installed shell, the loaded website
and this skill collection can all be different versions. Installing skills
deploys none of them. A ready catalog proves advertised commands, not that every
handler, market feed or saved write succeeds.

If `node install.cjs --check` passes in the canonical skill collection but a
workflow such as `tl-paper-trading` is missing from this agent's available list,
refresh skill discovery or start a new session. Do not create a duplicate skill
or replace a correct link merely to change a cached listing.

## Command and retry protocol

```bash
node cli.cjs exec research.list --tab ACTUAL_TAB_ID
node cli.cjs exec research.create --tab ACTUAL_TAB_ID \
  --params-file report-params.json --key UNIQUE_OPERATION_KEY
node cli.cjs exec pythonIndicators.apply --tab ACTUAL_TAB_ID \
  --source-file indicator.py --params-file input-params.json --key UNIQUE_OPERATION_KEY
```

`--params-file` is a JSON **parameter object**, not a `{type,params}` envelope.
`--source-file` populates `source`; for research HTML use `html` in a params file.
Do not combine `--params` with `--params-file`.

- All descriptors marked `mutates:true` require a unique retry key. Reuse that
  key and identical parameters only when reconciling the same operation. CLI
  keys are 1-80 letters, numbers, underscores or hyphens.
- `mutates:false` does not mean side-effect-free: commands can open panels,
  navigate a chart, modify tab-local drafts, start jobs or consume query quota.
  Read the exact descriptor before using a read-only audit as execution consent.
- Require the **final** JSON `status:"ok"`. HTTP acceptance, request ID or
  process startup is not completion. Inspect domain states such as `preparing`,
  `running`, `paused`, `completed`, and `valid:false` separately.
- In the current source, `feeds.list` can return final `status:"ok"` with only
  the default feed and `data.discovery.status:"error"` /
  `code:"FEED_DISCOVERY_FAILED"`. No broker was verified. Explicit default
  chart/history commands remain independent of broker discovery; a requested
  broker still fails rather than falling back to default.
- The CLI emits an accepted request ID to stderr. A timeout or cancelled
  transport may leave a persisted write. Inspect before retrying; never issue
  a fresh key automatically after an uncertain write.
- `node cli.cjs cancel --tab TAB --request REQUEST_ID` cancels a transport
  request. A scan/backtest job has its own domain cancellation command.
- The source bridge deduplicates canonical Backtesting/Optimize and legacy
  simulation/research aliases using the same parameters, ignoring object-key
  ordering but preserving array ordering. Older installed shells may report
  `CONFLICT` when switching spellings; retain the original command, key and
  parameters when reconciling an uncertain operation. These retries are bounded
  caches, not a durable transaction log or a promise of rollback.
- Current source transport caps JSON at 2 MiB; older packaged bridges can have
  stricter limits. Domain limits still apply: scanner rows/columns and exports
  remain separately bounded and paginated. Do not concatenate maximum-sized
  source and parameter payloads and assume they fit.
- Identity comes from the active app session, not a `userId` command parameter.
  Stop and rediscover on account changes.
- Current catalogs retain `permission:"indicators"` for local indicator and
  backtesting changes. Older bridges may omit it: absence is not an access
  grant. Pine errors can include bounded diagnostic locations, runtime stage
  context and optional profiles; generic errors do not expose arbitrary
  native fields. Python apply retains its bounded diagnostic text.
- External Pine save/apply/update and Python save/apply default to visible
  Studio presentation; `showInStudio:false` opts out. Check `data.studio`:
  a presentation error with `operationCompleted:true` does not undo the
  mutation. Preserve its IDs and retry only `indicators.openEditor` after
  resolving the blocker; never recreate an applied instance to reopen its UI.
  Dirty drafts are preserved. Read `indicators.editorState.visible` rather
  than assuming a mounted/embedded editor is visible.

## Read error codes, not messages

Current Desktop bridges forward short, single-line domain messages (for
example which parameter is invalid). Messages that could carry URLs, file
paths, credentials or Python runtime text are replaced with `"Command failed."`;
older packaged bridges always replace them. Act on `code` first and use the
message as detail:

| Code | Meaning and next step |
| --- | --- |
| `INVALID_PARAMS` | Parameters are strict: an unknown key, wrong type or out-of-range value. Reread that exact command's descriptor and send only its listed keys (e.g. `backtesting.run` takes `versionSuffix`, `backtesting.applyStrategy` takes `version`). |
| `CHART_NOT_READY` / `CHART_CHANGED` / `SIMULATION_CONTEXT_CHANGED` | Poll `chart.getState` until `ready:true` on the intended context, then retry with a **new** key. |
| `REVISION_CONFLICT` / `REVISION_REQUIRED` | Reread the item and pass its current revision. |
| `SIMULATION_HISTORY_FULL` | Active-run slots are full. Save to the library or ask before deleting; never delete user runs automatically. |
| `BACKTEST_COMPARISON_INCOMPATIBLE` | The runs differ in sample, mode/state or horizon, or include a legacy Pine re-simulation; see [tl-backtesting](../tl-backtesting/SKILL.md). |
| `STRATEGY_ALREADY_APPLIED` | Older catalogs may refuse replacement: inspect the addressed contract before explicitly removing. Current Apply replaces in place and retains auto-rerun intent. |
| `UNSUPPORTED_FEED` / `UNSUPPORTED_SYMBOL` / `DESKTOP_REQUIRED` | Pick a feed/interval from `feeds.list`; no fallback is chosen for you. |
| `SIGN_IN_REQUIRED` / `AGENT_DISABLED` / `APPROVAL_REQUIRED` | Only the user can resolve these; report and stop. |

`workspace.getActivity` lists recent codes. If the code alone is ambiguous,
ask the user to read the message shown in the app rather than guessing.

Desktop local access is automatic for the active account unless paused.
Mutations marked `permission:"indicators"` (including `studyTemplates.manage`)
use `allowAgentIndicators`; other
mutations use the separate `allowAgentWrites` grant. That includes cloud
watchlists/saved screeners and also saved alerts, chart view/compare/actions,
drawings, layouts, Chart Grid, market panels, drawing-template application and
native `chart.replayControl`; the grant is not limited to cloud writes.
Mutations require an active account; cloud writes require real sign-in.
Agents cannot grant permissions, unpause access, or bypass Python isolation.

## Guided Practice Labs

These synthetic-price lessons are separate from `backtesting.practice` paper
accounts. Practice Labs are intentionally human-operated, with no AI lesson
navigation, coach, completion or reset commands. Do not invent a `practice.*`
namespace or target guessed training scopes. Ordinary product commands operate
the normal account workspace, not the lesson's isolated synthetic runtime.

## Route the task

Choose the outcome owner below, not every skill containing the same language
or command prefix. Connection guidance is shared; companion workflows are
needed only when the request crosses their boundary. A Pine backtest does not
require the Python guide, and direct paper practice does not require a backtest.

| Group | Task | Read/load |
| --- | --- | --- |
| Start | Connection, tabs, grants, retries, bottom/right panels, theme, activity | this skill |
| Charting | Chart context, feeds, history, snapshots, replay, view/scale/range, Compare, toolbar actions/screenshot, built-in studies, drawings, drawing templates, split layouts/pane targeting, saved chart layouts, Chart Grid | [tl-charts](../tl-charts/SKILL.md) |
| Markets | Watchlists (Watch grid, lists, rows, view, membership), symbol details, peers, Multi Watchlists, indices, heatmap, Market Intelligence, Futures, universes, raw candles | [tl-markets](../tl-markets/SKILL.md) |
| Alerts | Saved price alerts: list/create/edit/enable/delete, trigger activity | [tl-alerts](../tl-alerts/SKILL.md) |
| Analysis | Unified Scanner, original strategies/SQL, grid analysis/refinement, Scanned History, saved rules | [tl-screening](../tl-screening/SKILL.md) |
| Analysis | Historical Patterns: one ticker across weekdays/IST windows, filters, statistics and dated chart navigation | [tl-patterns](../tl-patterns/SKILL.md) |
| Analysis | Write/read/edit saved HTML analysis | [tl-research](../tl-research/SKILL.md) |
| Authoring | TLScript-Pine custom indicators (not Pine strategy chart apply) | [tl-tlscript](../tl-tlscript/SKILL.md) |
| Authoring | Python indicators / strategy authoring | [tl-python](../tl-python/SKILL.md) |
| Strategy | Run/review Python or Pine backtests, applied strategies, presets, saved results, overlays | [tl-backtesting](../tl-backtesting/SKILL.md) |
| Strategy | Sweeps / holdout / walk-forward | [tl-strategy-optimization](../tl-strategy-optimization/SKILL.md) |
| Strategy | Replay-to-trade direct practice / backtest-derived replay / forward paper / simulated orders | [tl-paper-trading](../tl-paper-trading/SKILL.md) |

## Workspace shell

```json
{"type":"workspace.getState","params":{}}
```

`workspace.getState` reports account/grant flags, bottom `panels`, right
`sidebar {available, panel, expanded}` and the addressed tab.

**Bottom panels** — `workspace.setPanel` with `peers`, `watchlists` (Multi
Watchlists), `futures`, `backtesting`, `paper-trading`, `intelligence` or
`indicators` (Indicator Studio); `simulation` is a legacy alias. Send
`expanded` explicitly. Verify `workspace.getState.panels`.

**Right sidebar** — `workspace.openSidebar`:

```json
{"type":"workspace.openSidebar","params":{"panel":"alerts","expanded":true}}
```

Panels: `watchlists` (Watch), `indices`, `heatmap`, `scanner` (Scan), `grid`,
`patterns`, `alerts`, `research`, `dataWindow` (Data), and from **More**
`paperTrading` and `contests`. `expanded` defaults to `true`; `false` collapses
the sidebar. It is `mutates:false` (layout only, no retry key) but changes
visible state. It returns `requested:true,confirmed:false`: poll
`workspace.getState.sidebar` until it shows the panel. `WORKSPACE_UNAVAILABLE`
means `/charts` is not mounted for the signed-in account in that tab. Many
domain commands (heatmap, indices, Watch grid, Grid, Patterns) only
work while their panel is mounted, so open it first.

**Theme** — `workspace.setTheme {"theme":"light"|"dark"}` changes the
browser-local app theme (Settings > Theme). It returns `unchanged:true` when
already applied, is `mutates:false`, and does not change the Chart Grid's own
per-user chart theme.

`workspace.getActivity` lists bounded recent status/error history.

## UI map

Every visible workspace area, its owning skill and commands. "UI-only" areas
have no agent command; ask the person to operate them.

| UI area | Owner | Commands |
| --- | --- | --- |
| Top bar: symbol / feed / interval | tl-charts | `chart.open`, `feeds.list`, `chart.getState` |
| Top bar: refresh, live toggle | tl-charts | `chart.reload`, `chart.setLive` |
| Top bar: layout picker (split panes, Link symbol/interval) | tl-charts ([layouts-grid](../tl-charts/layouts-grid.md)) | `layout.getState`, `layout.set` (incl. `sync`), `layout.saved` |
| Top bar: Compare (A+B) | tl-charts | `chart.compare`, `chart.action compareDialog` |
| Top bar: indicator templates | tl-charts | `studyTemplates.manage` |
| Top bar: Replay | tl-charts (native) / tl-paper-trading (paper) | `chart.replayControl` / `backtesting.*` replay |
| Top bar: watchlist button | tl-desktop | `workspace.openSidebar {"panel":"watchlists"}` |
| Chart toolbar: chart type, settings, undo/redo, screenshot, fullscreen, object tree, go to date | tl-charts | `chart.viewState`, `chart.setView` (incl. `goToDate`), `chart.action`, `chart.navigateHistory` |
| Chart legend: OHLC values | tl-charts | `chart.setView {"legend":{"ohlcVisible":...}}` |
| Chart studies / drawing templates | tl-charts | `studies.*`, `drawingTemplates.*` |
| Left drawing toolbar, favorite drawings bar order, remove all | tl-charts ([drawings](../tl-charts/drawings.md)) | `drawings.list/create/update/setMode` |
| Bottom range bar: presets, log/%/auto scale, timezone | tl-charts | `chart.setView`, `chart.action resetScale` |
| Bottom tab: Peers (incl. Refresh/Retry) | tl-markets | `workspace.setPanel peers`, `peers.get`, `peers.configure` |
| Bottom tab: Multi Watchlists | tl-markets | `workspace.setPanel watchlists`, `watchlists.multiView` |
| Bottom tab: Market Intelligence / Futures | tl-markets | `intelligence.catalog/getReport`, `futures.getReport` |
| Bottom tab: Indicator Studio | tl-tlscript / tl-python | `indicators.*`, `pythonIndicators.*` |
| Bottom tab: Backtesting | tl-backtesting / tl-strategy-optimization | `backtesting.*` |
| Bottom tab: Paper | tl-paper-trading | `backtesting.practice`, `backtesting.replay`, `backtesting.order` and related |
| Sidebar: Watch (rows, CSV text, order, flags, favorite stars) | tl-markets | `watchlists.*`, `symbol.details` |
| Sidebar: Indices | tl-markets | `indices.getState` |
| Sidebar: Heatmap | tl-markets | `heatmap.getState/configure` |
| Sidebar: Scan | tl-screening | `screening.*`, `screener.*`, `providerScreener.*` |
| Sidebar: Grid (incl. theme, width, expand, chart indicators, open page) | tl-charts ([layouts-grid](../tl-charts/layouts-grid.md)) | `grid.open/getState/configure` |
| Sidebar: Patterns | tl-patterns | `patterns.*` |
| Sidebar: Alerts (incl. message/expiry) | tl-alerts | `alerts.*` |
| Sidebar: Research | tl-research | `research.*` |
| Sidebar: Data (Data Window) | tl-desktop | `workspace.openSidebar dataWindow`; values via `chart.snapshot` |
| Sidebar: More > Paper / Contests | tl-paper-trading / UI-only | `workspace.openSidebar` `paperTrading` / `contests` |
| Settings > Theme | tl-desktop | `workspace.setTheme` |
| Account, login, membership, purchases/checkout | **Human-only** | none |
| Broker connect, setup, token renewal | **Human-only** | none (`feeds.list` only discovers) |
| Feedback send, product Tour, Practice Labs | **Human-only** | none |
| AI access grants, admin, data repair | **Human-only** | none |

Remaining limits inside covered areas:

- Crosshair sync between split panes is impossible (no chart-library setter);
  only symbol/interval linking exists.
- OHLC legend *collapse* and favorite drawing-tool *membership* have no public
  API (OHLC visibility and favorite order are scriptable).
- Heatmap historical periods are unsupported (current quotes only).
- Alert expiry is enforced only while the signed-in Alerts panel is mounted;
  alert `message`/`expiresAt` are rejected by production until the Alerts API
  update is deployed.
- UI-only: Heatmap error Retry, drawing-template library writes, saved-layout
  rename/delete, the Grid card enlarge dialog, file/clipboard exports and the
  secondary Multi/Indices/Peers grids' own sort/filter state.

`workspace.setPanel` opens supported **bottom** panels; it does not select the
right Research sidebar. Use `research.show` for that. `workspace.getActivity`
contains bounded status/error history, not source or credentials.
Availability of a command in this repository or the source checkout is not
proof of its availability on another tab, browser, packaged release or cloud
deployment. Use `capabilities --tab` for the intended running tab and read
its domain readiness; read-only discovery cannot guarantee fresh candles.

The references retain their **isolated-source** generation provenance. On
October 29, 2026, read-only discovery briefly confirmed the then-advertised 211
descriptors on a ready production-origin tab in installed Desktop 0.1.6.
This did not execute domain mutations or certify native implementation parity.
Later discovery returned `ready:false` and no trusted tabs; no restart, reload
or origin switch was requested. Rediscover the intended ready tab before use.
Transport fixes in the local source are not installed merely by editing it.
The later descriptor, panel, feed-discovery and Scanner validation corrections,
and the workspace-UI commands that bring the source catalog to 241
descriptors (192 canonical, 49 aliases), are source/test verified only, not
certified by that earlier installed observation.

Never execute real broker orders, private diagnostic JavaScript, or arbitrary
host Python through these skills. Do not fetch, publish or sync user content
to another service unless explicitly requested and supported.
