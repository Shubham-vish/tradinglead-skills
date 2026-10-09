# TradingLead skills

Canonical skill folders live here, not in the ContentLead skill repository.
Every skill uses the `tl-` prefix. This collection documents the **actual
TradingLead Desktop command surface**, not arbitrary UI automation.

| Skill | Responsibility |
| --- | --- |
| [tl-desktop](tl-desktop/SKILL.md) | Start here: connection, explicit tab targeting, permissions, retries, workspace panels and routing |
| [tl-charts](tl-charts/SKILL.md) | Chart/feed discovery, navigation, snapshots, native studies and saved alert rules |
| [tl-tlscript](tl-tlscript/SKILL.md) | TLScript-Pine indicator authoring, isolated validation, current saved revisions and named chart settings |
| [tl-python](tl-python/SKILL.md) | Isolated Python authoring, syntax validation, source history and named chart settings |
| [tl-backtesting](tl-backtesting/SKILL.md) | Python/Pine strategy backtests, applied strategies, saved runs, presets and chart overlays |
| [tl-strategy-research](tl-strategy-research/SKILL.md) | Parameter sweeps, holdout and walk-forward experiments |
| [tl-paper-trading](tl-paper-trading/SKILL.md) | Direct replay-to-trade practice, backtest-derived replay, forward paper and simulated orders |
| [tl-screening](tl-screening/SKILL.md) | Unified Scanner, original strategies/SQL, grid analysis and refinement, Scanned History, saved rules, provider scans and cloud watchlists |
| [tl-research](tl-research/SKILL.md) | Saved HTML research pages in the right sidebar |

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

The checked frontend source defines **178 commands: 139 canonical and 39
`simulation.*` compatibility aliases**, plus four native Desktop controls.
The previously addressed running tab advertised **167 commands** before these
new surfaces were built; it does not prove that the source-only additions are
available there. Updated Desktop source accepts up to 256 commands and 128 KiB
of catalog JSON; older packaged bridges accept at most 180 / 56 KiB. Ship
the Desktop bridge update before a frontend catalog that exceeds the older
limit, or the older bridge may reject the entire catalog. The command transport
remains capped at 2 MiB, with smaller domain budgets and pagination.

Coverage was checked against frontend catalog/validation and read-only
capability discovery on a ready Desktop tab **before** the source additions.
This refresh did
**not** exercise state-changing commands, user charts, broker feeds or the
deployed website. Source, an installed Desktop tab and cloud availability can
differ; `status:"ok"` for catalog discovery is not chart/data readiness.

### Real boundaries

| Surface | Current agent support |
| --- | --- |
| TLScript-Pine/Python source libraries and applied studies | Pine current revision only; Python retained source history; isolated syntax/compile validation and named appearance read/write |
| Typed calculation inputs | Open the dialog with `showInputs`; user Apply is explicit. Programmatic parameter changes use apply/update. |
| Indicator named appearance | `indicators.getSettings/setSettings` and `pythonIndicators.getSettings/setSettings` use primary entity IDs and an unchanged expected snapshot. No generic setter for arbitrary TradingView studies. |
| Pine `strategy()` | `backtesting.run` with `language:"pine"`; vectorized only, rejected on indicator/scanner surfaces, no live orders |
| Applied strategy | `backtesting.applyStrategy/appliedStrategy/removeStrategy/setStrategyAutoRerun`; one chart strategy at a time |
| Chart replay paper practice | `backtesting.practice` starts directly at a paused chart replay cursor without a completed strategy backtest |
| Native manual Bar Replay | Source-only `chart.replayControl` requests selection/play/pause/step/speed/end. Select still requires the user to pick a candle; paper replay is separate. |
| Built-in studies and user drawings | Source-only `studies.applied/setVisibility/remove` target exact unmanaged native studies. `drawingTemplates.state/list/apply` operate on one selected editable drawing; template library writes remain UI-only. |
| Market Intelligence, Futures and Heatmap | Source-only `intelligence.catalog/getReport`, `futures.getReport` and `heatmap.getState` read bounded, authorized mounted-panel data. Not bulk quotes, live positions or licensed export. |
| Saved chart alerts | `alerts.*` manages saved price rules; trendline drawing is UI-only and quote monitoring depends on Alerts Activity being open |
| Backtest overlays, styles and date selection | `backtesting.getChartOptions` / `backtesting.setChartOptions`; display changes do not rerun strategies |
| Presets and larger saved result history | Separate preset and saved-library commands, with their own revisions |
| Sweep/holdout/walk-forward | `backtesting.research`, distinct from HTML reports |
| HTML research pages | Full `research.*` create/list/get/update/delete/show workflow |
| Unified Scanner and results analysis | `screening.*` supports original strategies, presets/custom/SQL, real-grid filters/sort/selection/expansion, exact-stock refinement and independent scan history |
| Shared authoring Docs, local backup import/export, Studio docking | UI features; no dedicated registered command for every control |
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
```

Refresh only from the intended trusted tab. The generator calls authenticated,
read-only CLI discovery and never records credentials, account IDs, saved
reports, source libraries or run data. Unknown commands fail ownership mapping
instead of being silently omitted. Review changed contracts and update the
workflow prose and examples when refreshing.
