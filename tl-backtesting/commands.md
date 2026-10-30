# tl-backtesting command reference

Source-only snapshot from an isolated frontend registry; installed Desktop was not ready. Rediscover live availability before use.
Use explicit tab targeting and inspect the final JSON status. Do not guess IDs or grant permissions.

Do not infer grant permissions from `mutates`: Desktop discovery can omit structured grant metadata. Read [tl-desktop](../tl-desktop/SKILL.md) for the verified local-change versus cloud-watchlist access rules.

## `backtesting.presetList`

List account-local reusable strategy setups, not result history. No source or execution.

Retry key: **not required**. External local-assistant access is still required.
Local indicator/backtesting grant required.

| Parameter | Contract |
| --- | --- |
| `offset` | 0-50, default 0. |
| `limit` | 1-50, default 20. |

Compatibility alias: `simulation.presetList`. Same validation, grants, cancellation, runtime and retry identity; prefer the canonical name.

## `backtesting.presetGet`

Read an owned complete setup including local Python source. Does not load a draft or run code.

Retry key: **not required**. External local-assistant access is still required.
Local indicator/backtesting grant required.

| Parameter | Contract |
| --- | --- |
| `id` | Saved strategy preset ID. |

Compatibility alias: `simulation.presetGet`. Same validation, grants, cancellation, runtime and retry identity; prefer the canonical name.

## `backtesting.presetSave`

Save a complete account-local setup. No strategy execution, chart changes or result-history writes. Requires a top-level retry ID.

Retry key: **required**. External local-assistant access is still required.
Local indicator/backtesting grant required.

| Parameter | Contract |
| --- | --- |
| `name` | Preset name, 1-100 characters. |
| `snapshot` | {title,source,parameters,config,strategyMode,bars,range,sessionSchedule}. config is normalized to full simulationConfig including instrument/fees/sizing/risk. range: explicit null (trailing) or inclusive {from,to} epoch ms; sessionSchedule: explicit null (continuous) or user-assumption schema. Active chart context is not pinned. |
| `id` | Omit for a new copy; existing ID to replace. |
| `expectedRevision` | Required current revision when replacing. |

Compatibility alias: `simulation.presetSave`. Same validation, grants, cancellation, runtime and retry identity; prefer the canonical name.

## `backtesting.presetDelete`

Delete an owned reusable setup only. Current drafts, source libraries and existing runs are untouched. Requires a top-level retry ID.

Retry key: **required**. External local-assistant access is still required.
Local indicator/backtesting grant required.

| Parameter | Contract |
| --- | --- |
| `id` | Saved strategy preset ID. |
| `expectedRevision` | Required current revision. |

Compatibility alias: `simulation.presetDelete`. Same validation, grants, cancellation, runtime and retry identity; prefer the canonical name.

## `backtesting.capabilities`

Discover simulation-only order, accounting, Python signal and causality limits. No broker execution.

Retry key: **not required**. External local-assistant access is still required.

Parameters: `{}`.

Compatibility alias: `simulation.capabilities`. Same validation, grants, cancellation, runtime and retry identity; prefer the canonical name.

## `backtesting.list`

Search/page the three active local backtest/paper runs. Larger saved history is available through libraryList.

Retry key: **not required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `search` | Optional title/symbol text, max 100 chars. |
| `offset` | 0-100. |
| `limit` | 1-100; follow nextOffset until null. |

Compatibility alias: `simulation.list`. Same validation, grants, cancellation, runtime and retry identity; prefer the canonical name.

## `backtesting.libraryList`

Search/page IndexedDB saved snapshots: max 100 runs / 100 MB per account. No source/candles. Active local workspace stays synchronous and limited to three runs.

Retry key: **not required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `search` | Optional text, max 100 chars. |
| `scope` | Optional all\|backtest\|paper. Paper includes replay and forward; filters before pagination. Storage usage remains account-wide. |
| `offset` | 0-100. |
| `limit` | 1-100; follow nextOffset until null. |

Compatibility alias: `simulation.libraryList`. Same validation, grants, cancellation, runtime and retry identity; prefer the canonical name.

## `backtesting.librarySave`

Save a stopped active run into larger local IndexedDB history. No silent eviction or cloud writes.

Retry key: **required**. External local-assistant access is still required.
Local indicator/backtesting grant required.

| Parameter | Contract |
| --- | --- |
| `runId` | Active run ID. |
| `expectedRevision` | Active run revision. |
| `expectedLibraryRevision` | 0 for new copy; current saved revision for replacement. |

Compatibility alias: `simulation.librarySave`. Same validation, grants, cancellation, runtime and retry identity; prefer the canonical name.

## `backtesting.libraryMigrate`

Copy stopped legacy active runs safely into IndexedDB without deleting originals or overwriting existing saved snapshots.

Retry key: **required**. External local-assistant access is still required.
Local indicator/backtesting grant required.

Parameters: `{}`.

Compatibility alias: `simulation.libraryMigrate`. Same validation, grants, cancellation, runtime and retry identity; prefer the canonical name.

## `backtesting.libraryRestore`

Restore one saved snapshot to a free active slot. Never overwrites active work or starts execution; running sessions restore paused.

Retry key: **required**. External local-assistant access is still required.
Local indicator/backtesting grant required.

| Parameter | Contract |
| --- | --- |
| `runId` | Saved ID. |
| `expectedLibraryRevision` | Current saved revision. |

Compatibility alias: `simulation.libraryRestore`. Same validation, grants, cancellation, runtime and retry identity; prefer the canonical name.

## `backtesting.libraryDelete`

Explicitly remove a saved snapshot only; active run and cloud layout are untouched.

Retry key: **required**. External local-assistant access is still required.
Local indicator/backtesting grant required.

| Parameter | Contract |
| --- | --- |
| `runId` | Saved ID. |
| `expectedLibraryRevision` | Current saved revision. |

Compatibility alias: `simulation.libraryDelete`. Same validation, grants, cancellation, runtime and retry identity; prefer the canonical name.

## `backtesting.libraryUpdate`

Edit a saved snapshot's display name, notes and tags only. Immutable run evidence, active work and cloud layout are unchanged.

Retry key: **required**. External local-assistant access is still required.
Local indicator/backtesting grant required.

| Parameter | Contract |
| --- | --- |
| `runId` | Saved ID. |
| `expectedLibraryRevision` | Current saved revision. |
| `metadata` | {name?:max100,notes?:max2000,tags?:up to10 strings max30}. |

Compatibility alias: `simulation.libraryUpdate`. Same validation, grants, cancellation, runtime and retry identity; prefer the canonical name.

## `backtesting.libraryExport`

Read one locally saved snapshot's full payload, summary and display metadata so it can be backed up to the cloud or exported to a file. Active work, chart and cloud layout are unchanged.

Retry key: **not required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `runId` | Saved ID. |

Compatibility alias: `simulation.libraryExport`. Same validation, grants, cancellation, runtime and retry identity; prefer the canonical name.

## `backtesting.libraryImport`

Import a run payload from a cloud backup or exported file as a NEW local saved snapshot, so saved history survives a browser change. Never overwrites active work; a run already saved on this device is rejected. Requires the local indicator grant and retry key.

Retry key: **required**. External local-assistant access is still required.
Local indicator/backtesting grant required.

| Parameter | Contract |
| --- | --- |
| `run` | Full saved run payload (as returned by libraryExport). |
| `summary` | Saved run summary projection from libraryExport. |
| `detail` | Optional display metadata {name?:max100,notes?:max2000,tags?:up to10 strings max30}. |

Compatibility alias: `simulation.libraryImport`. Same validation, grants, cancellation, runtime and retry identity; prefer the canonical name.

## `backtesting.compare`

Compare 2-4 same-sample saved snapshots. Metrics/assumptions are byte-bounded; follow nextOffset until null.

Retry key: **not required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `runIds` | 2-4 distinct saved run IDs. |
| `offset` | 0-3, default0. |
| `limit` | 1-4, default4; response byte budget may return fewer. |

Compatibility alias: `simulation.compare`. Same validation, grants, cancellation, runtime and retry identity; prefer the canonical name.

## `backtesting.getChartOptions`

Read saved options, effective preview options, preview owner/ID/validity, active date selection and range handle IDs. Never executes a strategy.

Retry key: **not required**. External local-assistant access is still required.

Parameters: `{}`.

Compatibility alias: `simulation.getChartOptions`. Same validation, grants, cancellation, runtime and retry identity; prefer the canonical name.

## `backtesting.setChartOptions`

Save account-local chart appearance/date selection, or preview/apply/cancel appearance edits without strategy execution. Preview does not persist; competing settings owners are refused. Runtime disposal clears agent previews; cancellation after a save is not rollback.

Retry key: **required**. External local-assistant access is still required.
Local indicator/backtesting grant required.

| Parameter | Contract |
| --- | --- |
| `options` | Partial {visible,scope:all\|selected,markers,labels:none\|selected\|all,connections,riskLevels,openPosition,replayCutoff,paperClosedTrades,paperActivePosition,textClosedSide\|Price\|Pnl\|Reason,textActiveSide\|Price\|Pnl (which label lines show),styles,drawing,scriptPlots,scriptDrawings}. scriptPlots maps keys from get.chartProjection.pineVisuals.plots to boolean visibility (512 saved keys maximum; each key at most 512 characters). scriptDrawings toggles Pine drawings, effects and tables; trade labels remain independent. Toggles boolean; replayCutoff defaults false and controls the line and timestamp together. Styles maps profit\|loss\|selected\|stop\|target\|entry\|cutoff to partial {color,width:1-4,style:0(solid)\|1(dotted)\|2(dashed),visible}. Drawing defaults are in capabilities.chartOptions.drawing: arrowMode compact\|adjustable; arrowHeight8-300, arrowMargin0-100, labelGap0-200 (% candle range); arrowWidth/fillMarkWidth1-6px; fontSize/positionFontSize/pathFontSize8-24px; leaderWidth1-4px, leaderStyle0-2, leaderColor/pathTextColor auto or native color, pathBold/pathItalic boolean; fillMarkBars1-10 candles; fillMarkStyle0-2; fillMarks/bold/italic boolean; cutoffTransparency integer0-100 (0 opaque,100 line hidden; timestamp unaffected); buy/sell arrow/text/fill colors, profit/loss text colors, position/quantity backgrounds, quantityTextColor, cutoffLabelTextColor and cutoffLabelBackground accept auto or hex/rgb/rgba. Cutoff line color is styles.cutoff.color; timestamp colors are independent. Nested patches merge; appearance never changes execution or ledger data. |
| `range` | Optional {from,to} epoch ms inclusive, visible to seed loaded visible closed candles, or null to clear. |
| `action` | Optional save (default)\|preview\|apply\|cancel. Preview replaces this owner's staged appearance patch. Apply persists that patch; cancel restores saved appearance. Date ranges are save-only. |
| `previewId` | Required for preview/apply/cancel: 1-80 letters, numbers, underscores or hyphens. Reuse within one preview session, with a fresh retry key for each action. Omit for save. |

Compatibility alias: `simulation.setChartOptions`. Same validation, grants, cancellation, runtime and retry identity; prefer the canonical name.

## `backtesting.run`

Start a Python or Pine strategy() backtest on captured closed candles. Returns preparing; poll get. Pine preserves its own fills, fees, quantity and equity without re-simulation; Python uses the shared signal engine. Requires local indicator/backtesting grant/retry key.

Retry key: **required**. External local-assistant access is still required.
Local indicator/backtesting grant required.

| Parameter | Contract |
| --- | --- |
| `language` | python (default) or pine. |
| `source` | Python calculate source, or Pine strategy() source when language is pine, OR use a saved id. |
| `id` | Saved Python (py_) or Pine (pine_) source id instead of source. |
| `expectedRevision` | Optional saved source revision. |
| `parameters` | Python only: validated JSON parameters, including bounded nested objects/arrays; _simulation is reserved. Optimization sweep candidates remain scalar. |
| `strategyMode` | Python: vectorized (default) or sequential. Pine: vectorized only. |
| `config` | Python only: optional capabilities.config fields. Pine uses its declaration and pineSettings. |
| `bars` | 2-20000, default20000; Python sequential max/default250. |
| `range` | Optional inclusive {from,to} epoch ms, null fetches latest closed source candles up to bars or source exhaustion, omitted uses chart selection. Apply pins this choice for reruns, including symbol/timeframe changes. Zoom never changes the tested period. |
| `sessionSchedule` | Optional user-assumption schedule for subsequent paper branches; does not synthesize backtest candles. |
| `versionSuffix` | Optional short version label appended to the run title (e.g. "aggressive" → "Name - aggressive") so different parameter variants stay distinguishable on the chart legend and in history. |
| `inputs` | Pine only: typed input values keyed by declared variable ID. Defaults come from the source or saved source inputs. |
| `pineSettings` | Pine only: explicit overrides {initial_capital,default_qty_type:fixed\|cash\|percent_of_equity,default_qty_value,commission_type:percent\|cash_per_contract\|cash_per_order,commission_value,slippage:integer ticks,pyramiding:0-100,margin_long:0-100,margin_short:0-100}. Omit to preserve strategy() defaults; no generic brackets or costs are added. |

Compatibility alias: `simulation.run`. Same validation, grants, cancellation, runtime and retry identity; prefer the canonical name.

## `backtesting.get`

Read status, accounting, pending orders, prefix-safe position analytics and paged ledger/equity/optimization. Analytics details: first 25 rows each with totals/truncation. Optional explicit regular-sampling assumptions enable annualized risk statistics. No source or raw candles.

Retry key: **not required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `runId` | Owned run ID. |
| `section` | trades\|events\|equity\|optimization, default trades. Legacy research is accepted; both return section:research and the existing research summary, with top-level paged rows. |
| `offset` | Nonnegative page offset. |
| `limit` | 1-100, default 50; optimization pages use nextOffset until null. |
| `risk` | Optional explicit {samplesPerYear,expectedIntervalMs,riskFreeRateAnnual}; omitted means no annualization. |

Compatibility alias: `simulation.get`. Same validation, grants, cancellation, runtime and retry identity; prefer the canonical name.

## `backtesting.export`

Read a full owned local export in bounded JSON-text chunks, including pinned source/candles. Run must be stopped; keep expectedRevision fixed and concatenate text by offset.

Retry key: **not required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `runId` | Owned stopped run ID. |
| `expectedRevision` | Current revision, fixed across all chunks. |
| `offset` | UTF-16 code-unit offset, default 0. |
| `chunkSize` | 1-16000 code units, default 16000. |

Compatibility alias: `simulation.export`. Same validation, grants, cancellation, runtime and retry identity; prefer the canonical name.

## `backtesting.cancel`

Request cancellation of an active backtest. Poll get for terminal status; partial results are not a completed run.

Retry key: **not required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `runId` | Owned running ID. |

Compatibility alias: `simulation.cancel`. Same validation, grants, cancellation, runtime and retry identity; prefer the canonical name.

## `backtesting.show`

Restore the run's feed/symbol/interval, wait for native history, then focus its fills. Restores replay cutoff for replay runs; clears cutoff for batch. No provider fallback or removal of user drawings.

Retry key: **required**. External local-assistant access is still required.
Local indicator/backtesting grant required.

| Parameter | Contract |
| --- | --- |
| `runId` | Owned run ID. |
| `tradeId` | Optional closed trade to focus. |
| `symbol` | Optional captured paper-session instrument; defaults to the displayed instrument (pending orders infer their instrument). |

Compatibility alias: `simulation.show`. Same validation, grants, cancellation, runtime and retry identity; prefer the canonical name.

## `backtesting.removeFromChart`

Detach this run's chart overlays only. Retains the run, trades, source and saved history; use show to add it again. Does not stop paper execution or alter replay time.

Retry key: **required**. External local-assistant access is still required.
Local indicator/backtesting grant required.

| Parameter | Contract |
| --- | --- |
| `runId` | Currently displayed owned run ID. |

Compatibility alias: `simulation.removeFromChart`. Same validation, grants, cancellation, runtime and retry identity; prefer the canonical name.

## `backtesting.showSettings`

Open the displayed run's native in-chart settings dialog. Visibility, arrows, lines, labels and risk-level controls do not rerun or delete optimization.

Retry key: **required**. External local-assistant access is still required.
Local indicator/backtesting grant required.

| Parameter | Contract |
| --- | --- |
| `runId` | Currently displayed owned run ID. |

Compatibility alias: `simulation.showSettings`. Same validation, grants, cancellation, runtime and retry identity; prefer the canonical name.

## `backtesting.delete`

Explicitly delete one local, non-running simulation; cloud layouts and Python sources remain unchanged.

Retry key: **required**. External local-assistant access is still required.
Local indicator/backtesting grant required.

| Parameter | Contract |
| --- | --- |
| `runId` | Owned run ID. |
| `expectedRevision` | Current run revision. |

Compatibility alias: `simulation.delete`. Same validation, grants, cancellation, runtime and retry identity; prefer the canonical name.

## `backtesting.applyStrategy`

Apply a Python or TLScript-Pine strategy to the chart like an indicator and immediately run it. Only one strategy applies at a time: every apply (edited source, new inputs/parameters or a different script) replaces the applied one in place, cancels any in-flight run of the old version and reruns, keeping the auto-rerun choice. It reruns on chart symbol/timeframe change (newest run wins). The Backtesting panel shows the latest live run; the previous result stays dimmed until the rerun settles.

Retry key: **required**. External local-assistant access is still required.
Local indicator/backtesting grant required.

| Parameter | Contract |
| --- | --- |
| `language` | python (default) or pine. |
| `source` | Strategy source to apply (required). |
| `sourceId` | Optional saved source id, for opening it in Studio. |
| `revision` | Optional saved source revision. |
| `parameters` | Optional Python JSON parameters. |
| `title` | Optional display title (defaults to the strategy's own name). |
| `version` | Optional short version label shown after the name (e.g. "aggressive") so different parameter variants stay distinguishable on the chart legend. |
| `inputs` | Pine only: typed input values keyed by declared variable ID. Defaults come from the source or saved source inputs. |
| `pineSettings` | Pine only: explicit overrides {initial_capital,default_qty_type:fixed\|cash\|percent_of_equity,default_qty_value,commission_type:percent\|cash_per_contract\|cash_per_order,commission_value,slippage:integer ticks,pyramiding:0-100,margin_long:0-100,margin_short:0-100}. Omit to preserve strategy() defaults; no generic brackets or costs are added. |
| `config` | Python only: optional capabilities.config fields. Pine uses its declaration and pineSettings. |
| `bars` | 2-20000, default20000; Python sequential max/default250. |
| `range` | Optional inclusive {from,to} epoch ms, null fetches latest closed source candles up to bars or source exhaustion, omitted uses chart selection. Apply pins this choice for reruns, including symbol/timeframe changes. Zoom never changes the tested period. |
| `strategyMode` | Python: vectorized (default) or sequential. Pine: vectorized only. |
| `sessionSchedule` | Optional user-assumption schedule for subsequent paper branches; does not synthesize backtest candles. |

Compatibility alias: `simulation.applyStrategy`. Same validation, grants, cancellation, runtime and retry identity; prefer the canonical name.

## `backtesting.removeStrategy`

Remove the strategy currently applied to the chart. Its last backtest run and saved history are retained.

Retry key: **required**. External local-assistant access is still required.
Local indicator/backtesting grant required.

Parameters: `{}`.

Compatibility alias: `simulation.removeStrategy`. Same validation, grants, cancellation, runtime and retry identity; prefer the canonical name.

## `backtesting.appliedStrategy`

Read the strategy currently applied to the chart, if any, including liveRunId (newest run, null until a rerun is accepted), previousRunId (last completed result kept while rerunning), runContext ({symbol,resolution} being computed), status (applied/running/error), error and autoRerun.

Retry key: **not required**. External local-assistant access is still required.

Parameters: `{}`.

Compatibility alias: `simulation.appliedStrategy`. Same validation, grants, cancellation, runtime and retry identity; prefer the canonical name.

## `backtesting.setStrategyAutoRerun`

Enable or disable automatic recomputation of the applied strategy when the chart symbol/timeframe changes.

Retry key: **required**. External local-assistant access is still required.
Local indicator/backtesting grant required.

| Parameter | Contract |
| --- | --- |
| `enabled` | Boolean; false disables auto-rerun. |

Compatibility alias: `simulation.setStrategyAutoRerun`. Same validation, grants, cancellation, runtime and retry identity; prefer the canonical name.
