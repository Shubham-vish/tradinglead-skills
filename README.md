# TradingLead skills

Canonical skill folders live here, not in the ContentLead skill repository.
Every skill uses the `tl-` prefix. This collection documents the **actual
TradingLead Desktop command surface**, not arbitrary UI automation.

| Group | Skill | Responsibility |
| --- | --- | --- |
| Start | [tl-desktop](tl-desktop/SKILL.md) | Start here: connection, explicit tab targeting, permissions, retries, workspace shell (bottom panels, right sidebar, theme, activity) and the full UI map |
| Charting | [tl-charts](tl-charts/SKILL.md) | Chart/feed navigation, history, snapshots, native replay, view/scale/range/timezone/legend, Compare, toolbar actions and screenshots, native studies and indicator templates, drawings, drawing templates, split layouts, pane targeting and linking, saved chart layouts, Chart Grid |
| Markets | [tl-markets](tl-markets/SKILL.md) | Watchlists (Watch grid, select/sort/filter/columns, CSV text, order, flags, favorites, create/add/remove/rename/delete), Multi Watchlists, symbol details, peers and refresh, indices, heatmap, Market Intelligence, Futures, universes, raw candles |
| Alerts | [tl-alerts](tl-alerts/SKILL.md) | Saved price alerts: list, create, edit (incl. message/expiry), pause/resume, delete, trigger activity and monitoring semantics |
| Analysis | [tl-screening](tl-screening/SKILL.md) | Unified Scanner, original strategies/SQL, grid analysis and refinement, Scanned History, saved rules, provider scans, Grid/watchlist handoff |
| Analysis | [tl-patterns](tl-patterns/SKILL.md) | Historical weekday/IST-window studies, coverage, filtered statistics and dated occurrence navigation |
| Analysis | [tl-research](tl-research/SKILL.md) | Saved HTML research pages in the right sidebar |
| Authoring | [tl-tlscript](tl-tlscript/SKILL.md) | TLScript-Pine indicator authoring, isolated validation, current saved revisions and named chart settings |
| Authoring | [tl-python](tl-python/SKILL.md) | Isolated Python authoring, syntax validation, source history and named chart settings |
| Strategy | [tl-backtesting](tl-backtesting/SKILL.md) | Python/Pine strategy backtests, applied strategies, saved runs, presets and chart overlays |
| Strategy | [tl-strategy-optimization](tl-strategy-optimization/SKILL.md) | Strategy Optimizer: Optimize tab, parameter sweeps, holdout and walk-forward |
| Strategy | [tl-paper-trading](tl-paper-trading/SKILL.md) | Direct replay-to-trade practice, backtest-derived replay, forward paper and simulated orders |
| Strategy | [tl-strategy-research](tl-strategy-research/SKILL.md) | Deprecated compatibility router to tl-strategy-optimization (no procedure ownership) |

## Choose one workflow owner

These are product-use guides, not separate execution engines. Start with
`tl-desktop` for connection and access, then select the skill for the requested
outcome. Load a companion only when that part of the task is needed.

| Outcome | Primary skill | Add only when needed |
| --- | --- | --- |
| Open/switch a panel, theme, or find which skill owns a UI area | `tl-desktop` | The owner from its UI map |
| Open a symbol, change interval/feed, browse history, replay candles | `tl-charts` | `tl-markets` to pick a symbol from a watchlist |
| Change chart type, scale, range, timezone; compare symbols; screenshot | `tl-charts` | — |
| Draw, hide, lock or remove chart drawings; reorder favorite drawing tools | `tl-charts` ([drawings](tl-charts/drawings.md)) | — |
| Save/apply native indicator templates | `tl-charts` | — |
| Split the chart, link panes, work on another pane, save/load chart layouts | `tl-charts` ([layouts-grid](tl-charts/layouts-grid.md)) | — |
| Show many tickers as chart cards (Chart Grid) | `tl-charts` ([layouts-grid](tl-charts/layouts-grid.md)) | `tl-screening` for a scan run or selected rows |
| Read/sort/filter/export a watchlist, reorder/flag/star, manage membership | `tl-markets` | `tl-screening` to source symbols from a scan |
| Company details, peers, indices, heatmap, Intelligence, Futures, raw candles | `tl-markets` | `tl-charts` to open the symbol first |
| Create, edit, pause or review saved price alerts | `tl-alerts` | `tl-charts` for trendline alerts drawn by a person |
| Screen many stocks | `tl-screening` | `tl-research` to report existing results without rerunning |
| Review one ticker's historical weekday/time windows | `tl-patterns` | `tl-charts` for requested feed/chart changes; `tl-research` to report existing results |
| Write or revise a chart indicator | `tl-tlscript` or `tl-python` | `tl-charts` for chart/feed work |
| Run or explain a Python/Pine strategy backtest | `tl-backtesting` | `tl-python` for Python source/SDK authoring; `tl-tlscript` for Pine language-support discovery, not strategy execution |
| Sweep parameters or evaluate holdout/walk-forward | `tl-strategy-optimization` | `tl-backtesting` to create/restore the prerequisite completed run |
| Trade a replay cursor or manage forward paper | `tl-paper-trading` | `tl-backtesting` for a backtest-derived branch or saved-run management; direct practice needs no strategy run |
| Publish an HTML explanation of existing results | `tl-research` | The result's workflow owner for evidence; reporting does not rerun or optimize a strategy |

Authoring source, running a backtest, evaluating robustness and trading paper
are separate outcomes. A valid indicator is not a tested strategy; a completed
backtest is not out-of-sample evidence or real-broker execution. Python and Pine
do not have identical feature coverage: discover the requested workflow and
language before promising support. Repository maintenance is not required to
use an already-supported command.

## Install and discover

Clone the public collection, then install with Node.js 18+:

```bash
git clone https://github.com/Shubham-vish/tradinglead-skills.git
cd tradinglead-skills
node install.cjs
node install.cjs --check
node validate.cjs
```

Installing the skills does not install TradingLead Desktop. Running the documented
app commands requires Desktop and access to its CLI; refreshing references expects
the sibling checkout described below.

The installer creates one link per skill in `~/.copilot/skills/` pointing here.
It uses directory junctions on Windows and directory symlinks on macOS/Linux.
It refuses to overwrite a conflicting folder or link; no existing ContentLead
or personal skills are moved. The source of truth remains this folder.

In Copilot CLI, run **`/skills reload`** or start a new session, then
`/skills info tl-desktop`. Filesystem verification is not a claim that an
already-running agent has refreshed its in-memory skill list.

Official discovery documentation:
https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-skills

## Command coverage

See [COMMANDS.md](COMMANDS.md) for every advertised command and its owning skill.
Each skill's `commands.md` contains exact descriptions, parameter names and
retry requirements generated from the checked frontend source catalog. `command-catalog.json`
is a documentation snapshot, **not** a substitute for fresh app capabilities.

The current snapshot has **241 frontend descriptors** (192 canonical commands
plus 49 compatibility aliases) and 4 native Desktop controls, about 104 KiB of
catalog JSON. Owned descriptors per skill, including aliases: tl-desktop 5,
tl-charts 32, tl-markets 20, tl-alerts 6, tl-screening 27, tl-patterns 11,
tl-research 7, tl-tlscript 23, tl-python 16, tl-backtesting 58,
tl-strategy-optimization 12, tl-paper-trading 24, tl-strategy-research 0
(the backtesting, optimization and paper totals include `simulation.*` and
legacy optimization aliases). Exact ownership is generated in
[COMMANDS.md](COMMANDS.md).
This is a snapshot of a development frontend, not evidence that another tab or
the released app has the same contracts. Updated Desktop source accepts up to 256 commands and 128 KiB
of catalog JSON; older packaged bridges accept at most 180 / 56 KiB. Ship
the Desktop bridge update before a frontend catalog that exceeds the older
limit, or the older bridge may reject the entire catalog. The command transport
remains capped at 2 MiB, with smaller domain budgets and pagination.

Coverage uses frontend catalog/validation, isolated command/native-chart
fixtures and read-only capability discovery. The snapshot retains its
**isolated-source** generation provenance. On October 29, 2026 a ready
production-origin tab in installed Desktop 0.1.6 advertised the same 211
descriptors as the then-current snapshot. This was read-only discovery, not
execution of all handlers. Later discovery returned no trusted tabs; the audit
did not restart, reload or switch the running app.
Subsequent local descriptor/runtime corrections, native retry fixes and the 28
workspace-UI commands (chart view/compare/actions, drawings, layouts, Chart
Grid, Watch/market panels, alert edit/activity, sidebar and theme) are
source/test verified only; the current snapshot was regenerated from the
isolated frontend source registry because no Desktop tab was ready.
It does **not** certify user charts, broker credentials, cloud-library writes or the
deployed website. Source, an installed Desktop tab and cloud availability can
differ; `status:"ok"` for catalog discovery is not chart/data readiness.

`node validate.cjs` checks every skill's generated contract and all supporting
Markdown guides, including nested guides: example command ownership, parameter
names, retry keys, local links and reachability from this index. It does not
execute examples or validate runtime-specific parameter values. Run
`node sync-commands.cjs --tab ACTUAL_TAB_ID --check` separately for live parity.

### Real boundaries

| Surface | Current agent support |
| --- | --- |
| TLScript-Pine/Python source libraries and applied studies | Pine current revision only; Python retained source history; isolated syntax/compile validation and named appearance read/write |
| Typed calculation inputs | Open the dialog with `showInputs`; user Apply is explicit. Programmatic parameter changes use apply/update. |
| Indicator named appearance | Both namespaces support stable instance IDs or primary entity IDs, current/default snapshots and stale-protected style/visibility resets. No generic setter for arbitrary TradingView studies. |
| Pine `strategy()` | `backtesting.run` with `language:"pine"`; vectorized only, rejected on indicator/scanner surfaces, no live orders |
| Applied strategy | `backtesting.applyStrategy/appliedStrategy/removeStrategy/setStrategyAutoRerun`; one chart strategy at a time |
| Chart replay paper practice | `backtesting.practice` starts directly at a paused chart replay cursor without a completed strategy backtest |
| Native manual Bar Replay | `chart.replayControl` requests selection/play/pause/step/speed/end. Select still requires the user to pick a candle; paper replay is separate. |
| Built-in studies and user drawings | `studies.applied/setVisibility/remove` target exact unmanaged native studies. `drawings.*` lists/creates/hides/locks/removes user drawings, sets toolbar modes, reorders favorite drawing tools and confirms remove-all; `drawingTemplates.*` restyle one selected drawing (library writes UI-only). `studyTemplates.manage` lists/saves/applies/deletes native indicator templates. |
| Chart view, Compare and toolbar | `chart.viewState/setView/compare/action`: type, scale, range, go-to-date, timezone, OHLC legend values, Compare/Overlay, undo/redo, dialogs, fullscreen and a bounded screenshot thumbnail. Dialogs still need a person to finish them; legend collapse and favorite-tool membership have no public API. |
| Split layouts and Chart Grid | `layout.*` selects the active pane every chart command targets and saves/loads chart layouts; and links symbol/interval from the active pane; `grid.*` opens (explicit symbols or all/filtered/selected scan rows) and configures the cloud-backed Chart Grid incl. theme, width, expand, chart indicators and open page. Crosshair sync is impossible; saved-layout rename/delete and the card enlarge dialog remain UI-only. |
| Watchlists and market panels | `watchlists.*` (incl. CSV text, manual order, flags, favorite stars), `symbol.details`, `peers.get/configure`, `indices.getState`, `heatmap.*`, `intelligence.*`, `futures.getReport` read/drive mounted panels. Not bulk quotes, live positions, live fundamentals or file/clipboard export; heatmap has no historical periods. |
| Saved price alerts | `alerts.*` lists/creates/edits/pauses/deletes rules and pages persisted trigger events; optional `message`/`expiresAt` need an Alerts API update that is not yet deployed (production rejects them until then); trendline geometry is UI-only; monitoring and expiry require the signed-in Alerts panel to remain mounted |
| Backtest overlays, styles and date selection | `backtesting.getChartOptions` / `backtesting.setChartOptions`; display changes do not rerun strategies |
| Presets and larger saved result history | Python-only reusable presets; separate saved-run library/import/export commands, with their own revisions |
| Strategy Optimizer: Optimize tab | Python and authoritative Pine frozen-data sweeps/holdout/walk-forward through `backtesting.optimize*`, distinct from HTML reports. Pine needs no Python runtime; rediscover installed availability first. |
| HTML research pages | Full `research.*` create/list/get/update/delete/show workflow |
| Unified Scanner and results analysis | `screening.*` supports original strategies, presets/custom/SQL, real-grid filters/sort/selection/expansion, exact-stock refinement and independent scan history |
| Shared authoring Docs, local backup import/export, Studio docking | UI features; no dedicated registered command for every control |
| Guided Practice Labs, account sign-in, membership/purchases, broker connect, Feedback send, product Tour, permission approval, administration and data-repair operations | Intentionally human/admin/operational surfaces, not missing public command namespaces |
| Broker credentials, arbitrary JavaScript, real broker orders | Not exposed by these product commands |

Do not use the private diagnostic `/js` bridge as a substitute for missing
product commands. Explain unsupported automation honestly.

Local source implementation, the currently loaded frontend, and a released
cloud/packaged app are different states. Check the addressed tab's catalog
before relying on a feature; this collection does not deploy either app.

## Refresh the references

Keep `TradingLead-Desktop` alongside this folder, or supply its CLI path:

```bash
node ../TradingLead-Desktop/cli.cjs tabs
node sync-commands.cjs --tab ACTUAL_TAB_ID
# Alternate checkout:
node sync-commands.cjs --tab ACTUAL_TAB_ID --cli /path/to/TradingLead-Desktop/cli.cjs
node validate.cjs
# Read-only live parity check; fails on descriptor/parameter/reference drift:
node sync-commands.cjs --tab ACTUAL_TAB_ID --check
# No ready tab: regenerate/check from a JSON array of descriptors exported from
# the frontend source registry (recorded as source:"isolated-source", not live):
node sync-commands.cjs --catalog exported-commands.json
node sync-commands.cjs --catalog exported-commands.json --check
```

Refresh only from the intended trusted tab. The generator calls authenticated,
read-only CLI discovery and never records credentials, account IDs, saved
reports, source libraries or run data. Unknown commands fail ownership mapping
instead of being silently omitted. Review changed contracts and update the
workflow prose and examples when refreshing.
`validate.cjs` checks snapshot consistency only and labels its result accordingly;
it cannot detect new app commands by itself. Use the separate live `--check`
before claiming the collection matches an addressed tab. Neither check grants
access, executes source, or proves chart/data readiness.

Live parity compares the command contract, not snapshot provenance or JSON
object-key ordering; it still rejects changed descriptions, parameters, grants
and mutation flags, and checks generated references against the saved snapshot.
For local tooling regression checks, run `node --test tools.test.cjs`.
