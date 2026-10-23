---
name: tl-backtesting
description: Use TradingLead to run and inspect Python or TLScript-Pine strategy backtests, applied strategy state, saved runs, presets, comparisons and exports. Owns single-run execution and evidence, not simulator implementation, parameter research, manual paper orders or HTML reports.
---

# Backtesting, saved setups and result evidence

Start with [tl-desktop](../tl-desktop/SKILL.md). Read `backtesting.capabilities` and
[commands.md](commands.md). Prefer `backtesting.*`; `simulation.*` names are
compatibility aliases, not a second engine.

**Owns:** Running, inspecting and preserving a strategy result through existing
commands. Use [tl-python](../tl-python/SKILL.md) only when authoring or debugging
Python source/SDK usage; a Pine run does not require that skill or Python
runtime readiness. Pine strategy source must follow the discovered backtest
contract, not indicator-only validation.

**Does not own:** Parameter experiments
([tl-strategy-research](../tl-strategy-research/SKILL.md)), paper orders
([tl-paper-trading](../tl-paper-trading/SKILL.md)), HTML reports
([tl-research](../tl-research/SKILL.md)), or changes to TradingLead's engine.

## Run deliberately

1. Confirm the chart's feed/symbol/interval and loaded history. Source IDs,
   run IDs and preset IDs are different.
2. Discover supported strategy output and configuration. State initial
   capital, quantity, instrument model, commission, slippage, warmup, stops and
   targets explicitly where relevant; do not label user assumptions
   exchange-verified.
3. Use `backtesting.run` with source **OR** saved source `id`, setting
   `language:"pine"` for a Pine `strategy()` (Python is the default).
   Python supports `strategyMode:"vectorized"|"sequential"` and parameters;
   Pine is vectorized only and does not accept Python parameters. Pine
   strategies run in Backtesting, not `indicators.apply` or provider scans.
   Pine runs do not require Python execution readiness. Pass a retry key.
   Pine accepts typed `inputs` by declared variable ID and optional explicit
   `pineSettings`: initial capital, quantity type/value, commission type/value,
   integer slippage ticks, pyramiding and long/short margin. Omit overrides to
   preserve declaration defaults. Generic Python config is rejected for Pine.
   Do not invent a Pine parameter-grid API or assume TradingView equivalence.
4. The returned run can be `preparing`. Poll `backtesting.get` until a terminal
   result or explicit error. Never report that a merely accepted run completed.
5. Read metrics, trades, events and equity with bounded pages. `cancel`
   requests cancellation; inspect the resulting state afterward.

Python sequential mode sees only completed-prefix candles and post-fill account state.
Its maximum/default is 250 candles; vectorized mode supports at most 5,000
with a default of 1,000. The newest candle is excluded. No real broker execution
occurs. Source with hard-coded future information is not automatically certified.

Omitted `range` uses the chart's selection; `range:null` uses trailing loaded
bars. An explicit `{from,to}` uses inclusive epoch milliseconds and requires
actual coverage. Do not silently shrink the request or invent candles.

Python signals are decided at candle close and fill on a later eligible candle. Read
capabilities for ambiguous-bar, stop/target, gap, trailing and accounting rules.
An exit leg is not necessarily a distinct independent position.

New Pine runs preserve the emulator's actual fills, quantities, allocated fees,
FIFO open lots and candle-close equity, not re-simulated directional signals.
Slippage is in fill prices. Main-report drawdown is candle-close sampled; the
separate emulator report may include intrabar extremes. Older runs labeled
`pine-direction-resimulation-legacy` retain their original evidence and cannot
be compared with `pine-authoritative-v1` runs. `process_orders_on_close` permits
closing-tick fills; `close`/`close_all(immediately=true)` close on that tick independently.
Stop-limit orders activate before their limit leg can fill; limit verification
uses `backtest_fill_limits_assumption` ticks. Slippage applies to market/stop
fills, not limits. Tick/fill recalculation, bar magnifier and standard-OHLC
override flags remain rejected; these historical fills are not real-tick parity.
Primary and authorized secondary history are frozen at the closed-candle
cutoff; source lookahead is still the author's responsibility.

## Read evidence without changing the run

- `backtesting.get`: page `trades`, `events`, `equity` or `research`; inspect
  totals, offsets and analytics truncation. `risk` permits explicit regular
  sampling assumptions for annualized statistics; omission does not annualize.
- `backtesting.export`: stopped runs only. Fix `expectedRevision` across all
  chunks, follow returned offsets, concatenate JSON text and parse only when
  complete. Offsets count UTF-16 code units, not bytes.
- Preserve recorded order/position links and replay cutoffs when explaining
  trades. Do not infer missing entry rationale or confuse queued protection
  with a filled event.
- Report unknown freshness, gaps, adjustments and calendar assumptions
  honestly. Run creation time is not a candle/source timestamp.

## Three separate local stores

| Store | Workflow |
| --- | --- |
| Active runs | `list/get/delete`; up to three active local runs, including an applied strategy's run. A fourth `run` fails with `SIMULATION_HISTORY_FULL` |
| Larger saved snapshots | `libraryList/librarySave/libraryRestore/libraryDelete/libraryMigrate/libraryUpdate`; IndexedDB, bounded to 100 runs / 100 MB per account |
| Reusable complete setups | `presetList/presetGet/presetSave/presetDelete`; source, parameters, mode, config, bars, range and session assumptions |

Read current revisions before mutations. `librarySave` needs the active
`expectedRevision` and `expectedLibraryRevision` (0 only for a new saved copy).
Restore requires a free active slot and does not start execution. Never delete
user runs automatically to make space.
`libraryList` can filter `scope:"all"|"backtest"|"paper"` (paper includes
replay and forward). `libraryUpdate` requires the saved revision and changes
only display name, notes and tags; immutable run evidence is untouched.

Reusable presets currently contain **Python** source only, even though regular
backtests accept both languages. Preset `snapshot` requires `title`, `source`, `parameters`, `config`,
`strategyMode`, `bars`, **explicit** `range` and **explicit** `sessionSchedule`
(null where appropriate). Updating a preset requires its `id` and
`expectedRevision`; no source or strategy runs on save/get. Loading a preset
into the editor is a UI operation, not an invented `presetLoad` command.
The active chart still determines symbol/feed/interval.

`libraryExport` reads a saved snapshot; `libraryImport` imports its validated
run/summary and optional name/notes/tags into saved storage. It does not execute
the source or restore an active run. Inspect the live contract and size limits;
do not treat arbitrary JSON as a valid saved run or overwrite user evidence.

`compare` compares 2-4 same-sample saved snapshots. Follow pagination and
disclose differing assumptions instead of ranking incompatible runs. All runs
must share feed, symbol, interval, primary candle fingerprint, first/last
candle, mode, lifecycle state and processed horizon. Python
(`shared-simulation`) and Pine (`pine-authoritative-v1`) runs on the same
candles can be compared: the response sets `mixedEngines:true`, lists
`executionModels` and appends an engine caveat. Report that caveat; fill timing,
sizing and fees differ, so do not attribute the gap to strategy logic alone.
Legacy `pine-direction-resimulation-legacy` runs must be rerun first.

## Chart presentation, not execution

- `show` can restore a run's feed/symbol/interval and optionally focus a
  `tradeId`; this is an intentional chart navigation.
- `getChartOptions` / `setChartOptions` control marker/label/connection/risk
  visibility, styles and future-run date selection without rerunning Python.
- `showSettings` opens the real native chart dialog.
- `removeFromChart` detaches overlays but retains results and does not stop
  a paper clock. `delete` is a separate destructive active-run operation.
- `applyStrategy` attaches one Python or Pine strategy to the chart; read
  `appliedStrategy` for its run/status. Another strategy is refused until
  `removeStrategy`; removal retains the last run/history. With automatic
  rerun enabled the applied strategy recomputes on chart symbol/interval
  change. `setStrategyAutoRerun` explicitly toggles that behavior. Confirm
  chart readiness and the resulting run before treating a rerun as complete;
  applied setup retains inputs, execution settings, bars/range and session
  defaults. `indicators.openDraft` can open its unsaved source in Studio with
  Pine `inputs` and `pineSettings`; a result's source must come from its frozen
  export, never the latest library revision.
- Pine Apply renders supported plots/drawings from the same frozen execution
  with actual fill markers, not another indicator calculation. Visibility and
  native child removal act on the whole owned group and retain the run.
  Projection metadata discloses bounded omitted open-lot levels.
- Backtests reuse paper trading's arrows, multiline entry/exit labels and native
  open-position price/quantity/P&L rays. `labels:"selected"` shows the selected
  exit candle or latest visible exit; `"all"` includes entry labels. Shared
  text-field and drawing settings apply to both. Same-candle exit legs are
  grouped on-chart without dropping ledger rows. Backtest levels are read-only;
  paper close/protection actions are never offered on a completed backtest.

These describe current source contracts, not proof that an older packaged app
has them. Rediscover the addressed tab's capabilities before sending new fields.

For Python or Pine sweep/holdout/walk-forward use
[tl-strategy-research](../tl-strategy-research/SKILL.md); for replay and forward
paper use [tl-paper-trading](../tl-paper-trading/SKILL.md). Publish a saved HTML
explanation through [tl-research](../tl-research/SKILL.md), not a new backtest.

## Verified end-to-end sequence

Exercised against a running Desktop tab (INFY 1D, default feed). Run from
`TradingLead-Desktop` with `--tab` and a fresh `--key` for every mutation:

1. `chart.open` → poll `chart.getState` until `ready:true` with the requested interval.
2. `backtesting.capabilities` (and `pythonIndicators.capabilities` for the
   `strategy-ema-sdk` Python example).
3. Pine: `backtesting.run` with `--source-file strategy.pine` and
   `{"language":"pine","bars":500,"inputs":{...},"versionSuffix":"v1"}`.
   Python: same command with `{"language":"python","parameters":{...}}`.
4. Poll `backtesting.get` until `completed`; read `metrics`, `analytics`, then
   page `trades`/`events`/`equity`. Add `risk` only with explicit sampling assumptions.
5. `backtesting.research` `mode:"sweep"` on the completed run (Pine `grid` uses
   declared input IDs); read `get` `section:"research"`.
6. `librarySave` each run, then `compare` same-language, same-sample runs.
7. Chart: `studies.apply` (built-in), `indicators.apply` (Pine indicator),
   `pythonIndicators.apply`, `backtesting.applyStrategy`; verify with `chart.snapshot`.
8. Clean up only what you created: `removeStrategy`, `indicators.remove`,
   `pythonIndicators.remove`, `studies.remove`, `delete`, `libraryDelete`.
