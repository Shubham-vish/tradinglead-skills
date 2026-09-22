---
name: tl-backtesting
description: Run and inspect TradingLead Python backtests, saved run history, complete strategy presets and native chart overlays. Use for stop-loss/target strategy evaluation, trades/events/equity, data-quality evidence, comparison, export, saved results, visibility and line/label styling. Paper execution and parameter research have separate companion skills.
---

# Backtesting, saved setups and result evidence

Start with [tl-desktop](../tl-desktop/SKILL.md) and
[tl-python](../tl-python/SKILL.md). Read `backtesting.capabilities` and
[commands.md](commands.md). Prefer `backtesting.*`; `simulation.*` names are
compatibility aliases, not a second engine.

## Run deliberately

1. Confirm the chart's feed/symbol/interval and loaded history. Source IDs,
   run IDs and preset IDs are different.
2. Discover supported strategy output and configuration. State initial
   capital, quantity, instrument model, commission, slippage, warmup, stops and
   targets explicitly where relevant; do not label user assumptions
   exchange-verified.
3. Use `backtesting.run` with Python source **OR** saved source `id`.
   `strategyMode` is `vectorized` or `sequential`; pass a retry key.
4. The returned run can be `preparing`. Poll `backtesting.get` until a terminal
   result or explicit error. Never report that a merely accepted run completed.
5. Read metrics, trades, events and equity with bounded pages. `cancel`
   requests cancellation; inspect the resulting state afterward.

Sequential mode sees only completed-prefix candles and post-fill account state.
Its maximum/default is 250 candles; vectorized mode supports at most 5,000
with a default of 1,000. The newest candle is excluded. No real broker execution
occurs. Source with hard-coded future information is not automatically certified.

Omitted `range` uses the chart's selection; `range:null` uses trailing loaded
bars. An explicit `{from,to}` uses inclusive epoch milliseconds and requires
actual coverage. Do not silently shrink the request or invent candles.

Signals are decided at candle close and fill on a later eligible candle. Read
capabilities for ambiguous-bar, stop/target, gap, trailing and accounting rules.
An exit leg is not necessarily a distinct independent position.

## Read evidence without changing the run

- `backtesting.get`: page `trades`, `events`, `equity` or `research`; inspect
  totals, offsets and analytics truncation.
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
| Active runs | `list/get/delete`; up to three active local runs |
| Larger saved snapshots | `libraryList/librarySave/libraryRestore/libraryDelete/libraryMigrate`; IndexedDB, bounded to 100 runs / 100 MB per account |
| Reusable complete setups | `presetList/presetGet/presetSave/presetDelete`; source, parameters, mode, config, bars, range and session assumptions |

Read current revisions before mutations. `librarySave` needs the active
`expectedRevision` and `expectedLibraryRevision` (0 only for a new saved copy).
Restore requires a free active slot and does not start execution. Never delete
user runs automatically to make space.

Preset `snapshot` requires `title`, `source`, `parameters`, `config`,
`strategyMode`, `bars`, **explicit** `range` and **explicit** `sessionSchedule`
(null where appropriate). Updating a preset requires its `id` and
`expectedRevision`; no source or strategy runs on save/get. Loading a preset
into the editor is a UI operation, not an invented `presetLoad` command.
The active chart still determines symbol/feed/interval.

`compare` compares 2-4 same-sample saved snapshots. Follow pagination and
disclose differing assumptions instead of ranking incompatible runs.

## Chart presentation, not execution

- `show` can restore a run's feed/symbol/interval and optionally focus a
  `tradeId`; this is an intentional chart navigation.
- `getChartOptions` / `setChartOptions` control marker/label/connection/risk
  visibility, styles and future-run date selection without rerunning Python.
- `showSettings` opens the real native chart dialog.
- `removeFromChart` detaches overlays but retains results and does not stop
  a paper clock. `delete` is a separate destructive active-run operation.

For sweep/holdout/walk-forward use
[tl-strategy-research](../tl-strategy-research/SKILL.md); for replay and forward
paper use [tl-paper-trading](../tl-paper-trading/SKILL.md). Publish a saved HTML
explanation through [tl-research](../tl-research/SKILL.md), not a new backtest.
