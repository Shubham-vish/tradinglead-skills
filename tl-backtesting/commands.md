# tl-backtesting command reference

Generated from a command-catalog snapshot. Recheck the addressed tab before use.
Use explicit tab targeting and inspect the final JSON status. Do not guess IDs or grant permissions.

Do not infer grant permissions from `mutates`: Desktop discovery can omit structured grant metadata. Read [tl-desktop](../tl-desktop/SKILL.md) for the verified local-change versus cloud-watchlist access rules.

## `backtesting.presetList`

List account-local reusable strategy setups, not result history. No source or execution.

Retry key: **not required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `offset` | 0-50, default 0. |
| `limit` | 1-50, default 20. |

Compatibility alias: `simulation.presetList`. Same runtime and retry identity; prefer the canonical name.

## `backtesting.presetGet`

Read an owned complete setup including local Python source. Does not load a draft or run code.

Retry key: **not required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `id` | Saved strategy preset ID. |

Compatibility alias: `simulation.presetGet`. Same runtime and retry identity; prefer the canonical name.

## `backtesting.presetSave`

Save a complete account-local setup. No strategy execution, chart changes or result-history writes. Requires a top-level retry ID.

Retry key: **required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `name` | Preset name, 1-100 characters. |
| `snapshot` | {title,source,parameters,config,strategyMode,bars,range,sessionSchedule}. config is normalized to full simulationConfig including instrument/fees/sizing/risk. range: explicit null (trailing) or inclusive {from,to} epoch ms; sessionSchedule: explicit null (continuous) or user-assumption schema. Active chart context is not pinned. |
| `id` | Omit for a new copy; existing ID to replace. |
| `expectedRevision` | Required current revision when replacing. |

Compatibility alias: `simulation.presetSave`. Same runtime and retry identity; prefer the canonical name.

## `backtesting.presetDelete`

Delete an owned reusable setup only. Current drafts, source libraries and existing runs are untouched. Requires a top-level retry ID.

Retry key: **required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `id` | Saved strategy preset ID. |
| `expectedRevision` | Required current revision. |

Compatibility alias: `simulation.presetDelete`. Same runtime and retry identity; prefer the canonical name.

## `backtesting.capabilities`

Discover simulation-only order, accounting, Python signal and causality limits. No broker execution.

Retry key: **not required**. External local-assistant access is still required.

Parameters: `{}`.

Compatibility alias: `simulation.capabilities`. Same runtime and retry identity; prefer the canonical name.

## `backtesting.list`

Search/page the three active local backtest/paper runs. Larger saved history is available through libraryList.

Retry key: **not required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `search` | Optional title/symbol text, max 100 chars. |
| `offset` | 0-100. |
| `limit` | 1-100; follow nextOffset until null. |

Compatibility alias: `simulation.list`. Same runtime and retry identity; prefer the canonical name.

## `backtesting.libraryList`

Search/page IndexedDB saved snapshots: max 100 runs / 100 MB per account. No source/candles. Active local workspace stays synchronous and limited to three runs.

Retry key: **not required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `search` | Optional text, max 100 chars. |
| `scope` | Optional all\|backtest\|paper. Paper includes replay and forward; filters before pagination. Storage usage remains account-wide. |
| `offset` | 0-100. |
| `limit` | 1-100; follow nextOffset until null. |

Compatibility alias: `simulation.libraryList`. Same runtime and retry identity; prefer the canonical name.

## `backtesting.librarySave`

Save a stopped active run into larger local IndexedDB history. No silent eviction or cloud writes.

Retry key: **required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `runId` | Active run ID. |
| `expectedRevision` | Active run revision. |
| `expectedLibraryRevision` | 0 for new copy; current saved revision for replacement. |

Compatibility alias: `simulation.librarySave`. Same runtime and retry identity; prefer the canonical name.

## `backtesting.libraryMigrate`

Copy stopped legacy active runs safely into IndexedDB without deleting originals or overwriting existing saved snapshots.

Retry key: **required**. External local-assistant access is still required.

Parameters: `{}`.

Compatibility alias: `simulation.libraryMigrate`. Same runtime and retry identity; prefer the canonical name.

## `backtesting.libraryRestore`

Restore one saved snapshot to a free active slot. Never overwrites active work or starts execution; running sessions restore paused.

Retry key: **required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `runId` | Saved ID. |
| `expectedLibraryRevision` | Current saved revision. |

Compatibility alias: `simulation.libraryRestore`. Same runtime and retry identity; prefer the canonical name.

## `backtesting.libraryDelete`

Explicitly remove a saved snapshot only; active run and cloud layout are untouched.

Retry key: **required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `runId` | Saved ID. |
| `expectedLibraryRevision` | Current saved revision. |

Compatibility alias: `simulation.libraryDelete`. Same runtime and retry identity; prefer the canonical name.

## `backtesting.libraryUpdate`

Edit a saved snapshot's display name, notes and tags only. Immutable run evidence, active work and cloud layout are unchanged.

Retry key: **required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `runId` | Saved ID. |
| `expectedLibraryRevision` | Current saved revision. |
| `metadata` | {name?:max100,notes?:max2000,tags?:up to10 strings max30}. |

Compatibility alias: `simulation.libraryUpdate`. Same runtime and retry identity; prefer the canonical name.

## `backtesting.compare`

Compare 2-4 same-sample saved snapshots. Metrics/assumptions are byte-bounded; follow nextOffset until null.

Retry key: **not required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `runIds` | 2-4 distinct saved run IDs. |
| `offset` | 0-3, default0. |
| `limit` | 1-4, default4; response byte budget may return fewer. |

Compatibility alias: `simulation.compare`. Same runtime and retry identity; prefer the canonical name.

## `backtesting.getChartOptions`

Read local overlay visibility, active chart date selection and draggable range handle IDs. Does not change strategy or accounting.

Retry key: **not required**. External local-assistant access is still required.

Parameters: `{}`.

Compatibility alias: `simulation.getChartOptions`. Same runtime and retry identity; prefer the canonical name.

## `backtesting.setChartOptions`

Set local display preferences or draggable date boundaries without rerunning Python. Selected dates apply to future runs; never alters existing results.

Retry key: **required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `options` | Partial {visible,scope:all\|selected,markers,labels:none\|selected\|all,connections,riskLevels,openPosition,replayCutoff,styles}. Toggles boolean; styles maps profit\|loss\|selected\|stop\|target\|entry\|cutoff to partial {color,width:1-4,style:0(solid)\|1(dotted)\|2(dashed),visible}. |
| `range` | Optional {from,to} epoch ms inclusive, visible to seed loaded visible closed candles, or null to clear. |

Compatibility alias: `simulation.setChartOptions`. Same runtime and retry identity; prefer the canonical name.

## `backtesting.run`

Start an isolated Python or TLScript-Pine strategy() backtest excluding the newest candle. Returns preparing; poll get. Pine reconstructs a per-candle position series from its emulator and runs the shared engine. Sequential mode (Python only) supplies prefix-only candles and post-fill account state. Requires research grant/retry key.

Retry key: **required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `language` | python (default) or pine. |
| `source` | Python calculate source, or Pine strategy() source when language is pine, OR use a saved id. |
| `id` | Saved Python (py_) or Pine (pine_) source id instead of source. |
| `expectedRevision` | Optional saved source revision. |
| `parameters` | Python only: validated JSON parameters, including bounded nested objects/arrays; _simulation is reserved. Research sweep candidates remain scalar. |
| `strategyMode` | Python only: vectorized (default) or sequential; Pine is vectorized only. |
| `config` | Optional capabilities.config fields. |
| `bars` | 2-5000, default 1000; sequential max/default 250. |
| `range` | Optional inclusive {from,to} epoch ms. Omit to use chart selection; null uses trailing loaded bars. Missing coverage or excess candles fails explicitly. |
| `sessionSchedule` | Optional forward-branch session defaults; same user-assumption schema as forward. Does not fabricate or filter backtest candles. |
| `versionSuffix` | Optional short version label appended to the run title (e.g. "aggressive" → "Name - aggressive") so different parameter variants stay distinguishable on the chart legend and in history. |

Compatibility alias: `simulation.run`. Same runtime and retry identity; prefer the canonical name.

## `backtesting.get`

Read status, accounting, pending orders, prefix-safe position analytics and paged ledger/equity/research. Analytics details: first 25 rows each with totals/truncation. Optional explicit regular-sampling assumptions enable annualized risk statistics. No source or raw candles.

Retry key: **not required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `runId` | Owned run ID. |
| `section` | trades\|events\|equity\|research, default trades. |
| `offset` | Nonnegative page offset. |
| `limit` | 1-100, default 50; research pages use nextOffset until null. |
| `risk` | Optional explicit {samplesPerYear,expectedIntervalMs,riskFreeRateAnnual}; omitted means no annualization. |

Compatibility alias: `simulation.get`. Same runtime and retry identity; prefer the canonical name.

## `backtesting.export`

Read a full owned local export in bounded JSON-text chunks, including pinned source/candles. Run must be stopped; keep expectedRevision fixed and concatenate text by offset.

Retry key: **not required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `runId` | Owned stopped run ID. |
| `expectedRevision` | Current revision, fixed across all chunks. |
| `offset` | UTF-16 code-unit offset, default 0. |
| `chunkSize` | 1-16000 code units, default 16000. |

Compatibility alias: `simulation.export`. Same runtime and retry identity; prefer the canonical name.

## `backtesting.cancel`

Request cancellation of an active backtest. Poll get for terminal status; partial results are not a completed run.

Retry key: **not required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `runId` | Owned running ID. |

Compatibility alias: `simulation.cancel`. Same runtime and retry identity; prefer the canonical name.

## `backtesting.show`

Restore the run's feed/symbol/interval, wait for native history, then focus its fills. Restores replay cutoff for replay runs; clears cutoff for batch. No provider fallback or removal of user drawings.

Retry key: **required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `runId` | Owned run ID. |
| `tradeId` | Optional closed trade to focus. |

Compatibility alias: `simulation.show`. Same runtime and retry identity; prefer the canonical name.

## `backtesting.removeFromChart`

Detach this run's chart overlays only. Retains the run, trades, source and saved history; use show to add it again. Does not stop paper execution or alter replay time.

Retry key: **required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `runId` | Currently displayed owned run ID. |

Compatibility alias: `simulation.removeFromChart`. Same runtime and retry identity; prefer the canonical name.

## `backtesting.showSettings`

Open the displayed run's native in-chart settings dialog. Visibility, arrows, lines, labels and risk-level controls do not rerun or delete research.

Retry key: **required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `runId` | Currently displayed owned run ID. |

Compatibility alias: `simulation.showSettings`. Same runtime and retry identity; prefer the canonical name.

## `backtesting.delete`

Explicitly delete one local, non-running simulation; cloud layouts and Python sources remain unchanged.

Retry key: **required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `runId` | Owned run ID. |
| `expectedRevision` | Current run revision. |

Compatibility alias: `simulation.delete`. Same runtime and retry identity; prefer the canonical name.

## `backtesting.applyStrategy`

Apply a Python or TLScript-Pine strategy to the chart like an indicator. Only one strategy applies at a time; applying a different one fails until the current is removed. The Backtesting panel reflects the applied strategy and it recomputes when the chart symbol/timeframe changes.

Retry key: **required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `language` | python (default) or pine. |
| `source` | Strategy source to apply (required). |
| `sourceId` | Optional saved source id, for opening it in Studio. |
| `revision` | Optional saved source revision. |
| `parameters` | Optional Python JSON parameters. |
| `title` | Optional display title (defaults to the strategy's own name). |
| `version` | Optional short version label shown after the name (e.g. "aggressive") so different parameter variants stay distinguishable on the chart legend. |

Compatibility alias: `simulation.applyStrategy`. Same runtime and retry identity; prefer the canonical name.

## `backtesting.removeStrategy`

Remove the strategy currently applied to the chart. Its last backtest run and saved history are retained.

Retry key: **required**. External local-assistant access is still required.

Parameters: `{}`.

Compatibility alias: `simulation.removeStrategy`. Same runtime and retry identity; prefer the canonical name.

## `backtesting.appliedStrategy`

Read the strategy currently applied to the chart, if any, including its live run id and status.

Retry key: **not required**. External local-assistant access is still required.

Parameters: `{}`.

Compatibility alias: `simulation.appliedStrategy`. Same runtime and retry identity; prefer the canonical name.

## `backtesting.setStrategyAutoRerun`

Enable or disable automatic recomputation of the applied strategy when the chart symbol/timeframe changes.

Retry key: **required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `enabled` | Boolean; false disables auto-rerun. |

Compatibility alias: `simulation.setStrategyAutoRerun`. Same runtime and retry identity; prefer the canonical name.
