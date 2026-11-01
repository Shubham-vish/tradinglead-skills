# tl-strategy-optimization command reference

Source-only snapshot from an isolated frontend registry; installed Desktop execution is not certified. Rediscover live availability before use.
Use explicit tab targeting and inspect the final JSON status. Do not guess IDs or grant permissions.

Do not infer grant permissions from `mutates`: Desktop discovery can omit structured grant metadata. Read [tl-desktop](../tl-desktop/SKILL.md) for the verified local-change versus cloud-watchlist access rules.

## `backtesting.optimizeReport`

Explicitly reconstruct every recorded optimization evaluation from frozen inputs using the installed engine, without modifying baseline, selection or saved runs. Includes all recorded trades/events/equity in a styled offline HTML report. Reports mismatched original metrics; never tests unselected holdout candidates. One session-only report per account; export to retain. Poll optimizeReportGet; cancel with cancel.

Retry key: **required**. External local-assistant access is still required.
Effects: **code, write**. These are possible consequences, not grants; optional write variants still require approval and a retry key.
Local indicator/backtesting grant required.

| Parameter | Contract |
| --- | --- |
| `runId` | Completed active optimization run. |
| `expectedRevision` | Current run revision. |
| `confirmed` | Must be true: this executes frozen strategy segments again. Requires indicator execution grant. |

Compatibility alias: `simulation.optimizeReport`. Same validation, grants, cancellation, runtime and retry identity; prefer the canonical name.

## `backtesting.optimizeReportGet`

Read detailed report progress or download complete HTML in revision/report-pinned UTF-16 chunks. Does not execute source. 8 Mi-character evidence / 24 Mi-character HTML limits; over-limit generation fails without truncation. No cloud write.

Retry key: **not required**. External local-assistant access is still required.
Effects: **none**. These are possible consequences, not grants; optional write variants still require approval and a retry key.

| Parameter | Contract |
| --- | --- |
| `runId` | Owned active run. |
| `expectedRevision` | Current frozen run revision. |
| `reportId` | Required when reading HTML chunks; ID from generation/status. |
| `offset` | Optional HTML offset; omit for status. Begin at 0, follow nextOffset until null. |
| `chunkSize` | 1-16000 UTF-16 code units; default 16000. |

Compatibility alias: `simulation.optimizeReportGet`. Same validation, grants, cancellation, runtime and retry identity; prefer the canonical name.

## `backtesting.optimizeChecks`

Explicit bounded neighboring-parameter/cost checks of one exact selected candidate on its pinned training window only. Actual frozen Pine/Python executions, independent accounts, per-trial failures/drawdown/count/fees sensitivity; no confidence or test peeks.

Retry key: **required**. External local-assistant access is still required.
Effects: **write**. These are possible consequences, not grants; optional write variants still require approval and a retry key.
Local indicator/backtesting grant required.

Requires Desktop protocol 2 with `catalog.aliases` negotiation. Older shells omit this command; verify live availability and do not substitute private execution.

| Parameter | Contract |
| --- | --- |
| `runId` | Completed baseline. |
| `expectedRevision` | Current revision. |
| `attemptId` | Retained completed attempt ID. |
| `manifestSha256` | Exact attempt SHA-256. |
| `fold` | Selected fold1-5. |
| `candidate` | Selected candidate1-12. |
| `neighbors` | 0-11 single-key typed overrides around selected values. |
| `costScenarios` | Explicit cost override objects; Python commissionBps/commissionFixed/slippageBps; Pine commission_type/commission_value/slippage. |
| `budget` | Explicit1-12 covering (neighbors+1) times scenarios; 1000 prefix cap. |
| `confirmed` | Must be true. |

Compatibility alias: `simulation.optimizeChecks`. Same validation, grants, cancellation, runtime and retry identity; prefer the canonical name.

## `backtesting.optimizeValidateSymbols`

Explicit independent validation of a finite reviewed watchlist-symbol list on exact feed/interval/session/training dates. Read-only history capture with full coverage; frozen per-symbol manifests/accounts. Unsupported source or secondary universe fails honestly, never original-symbol replacement. No pooled capital/portfolio returns.

Retry key: **required**. External local-assistant access is still required.
Effects: **write**. These are possible consequences, not grants; optional write variants still require approval and a retry key.
Local indicator/backtesting grant required.

Requires Desktop protocol 2 with `catalog.aliases` negotiation. Older shells omit this command; verify live availability and do not substitute private execution.

| Parameter | Contract |
| --- | --- |
| `runId` | Completed baseline. |
| `expectedRevision` | Current revision. |
| `attemptId` | Retained completed attempt. |
| `manifestSha256` | Exact attempt SHA-256. |
| `fold` | Selected fold1-5. |
| `candidate` | Selected candidate1-12. |
| `symbols` | Explicit1-12 unique exact symbols whose source metadata is available. |
| `budget` | Exact symbols.length;1000 prefix cap. |
| `confirmed` | Must be true. |

Compatibility alias: `simulation.optimizeValidateSymbols`. Same validation, grants, cancellation, runtime and retry identity; prefer the canonical name.

## `backtesting.optimizeResume`

Explicitly resume the latest interrupted/cancelled/failed sampled attempt. Exact manifest/source/runtime/data/search must match; completed and failed trial IDs are never reexecuted. No setup edits accepted.

Retry key: **required**. External local-assistant access is still required.
Effects: **write**. These are possible consequences, not grants; optional write variants still require approval and a retry key.
Local indicator/backtesting grant required.

Requires Desktop protocol 2 with `catalog.aliases` negotiation. Older shells omit this command; verify live availability and do not substitute private execution.

| Parameter | Contract |
| --- | --- |
| `runId` | Owned completed baseline. |
| `expectedRevision` | Current revision. |
| `attemptId` | Latest sampled attempt ID. |
| `manifestSha256` | Exact original strong manifest digest. |
| `confirmed` | Must be true. |

Compatibility alias: `simulation.optimizeResume`. Same validation, grants, cancellation, runtime and retry identity; prefer the canonical name.

## `backtesting.optimize`

Run bounded Python or Pine sweep/holdout/rolling walk-forward on a completed run's frozen source/candles. Pine uses actual fills, unchanged execution settings and captured request history only; no Python runtime or new fetches. Poll get section optimization; cancel with cancel. Every segment starts flat; selection uses the chosen training-only objective and constraints. Source lookahead remains unverified.

Retry key: **required**. External local-assistant access is still required.
Effects: **code, write**. These are possible consequences, not grants; optional write variants still require approval and a retry key.
Local indicator/backtesting grant required.

| Parameter | Contract |
| --- | --- |
| `runId` | Completed active backtest. Legacy Pine runs without authoritative fills/input metadata/frozen request history must be rerun first. |
| `expectedRevision` | Current revision. |
| `mode` | sweep\|holdout\|walkForward. |
| `grid` | Up to 4 Python parameter keys or declared Pine input variable IDs with value arrays; Cartesian max12. Pine values must satisfy declared types, bounds and options; not strategy execution-setting overrides. |
| `trainBars` | Required for holdout/walkForward >=2. |
| `testBars` | Required for holdout/walkForward >=2. |
| `folds` | Walk-forward 1-5. Maximum 65 evaluations: 12 training candidates plus one selected test per fold; 1000 sequential prefix callbacks. |
| `warmupMode` | Optional coldStart (legacy default) or pastOnly. Past-only uses preceding unscored indicator candles and a flat scored account. |
| `warmupBars` | Optional 0-5000 preceding candles with pastOnly. Python recalculates each scored prefix (1000 callbacks maximum); Pine secondary warmup is unsupported. |
| `objective` | Optional netPnl (highest, default) or maxDrawdown (lowest); training-only; ties grid order. P&L includes open mark-to-market. |
| `minCompletedPositions` | Optional integer >=0 default0. Fully completed positions (Pine entry lots), not exit legs; checked on training only. |
| `maxDrawdown` | Optional nonnegative maximum training drawdown in account currency/units, NOT percent. |
| `search` | Optional {method:sampled,version:floyd-mulberry32-v1,seed:1-80 character string,budget:1-12}. Up to 1000 unique scalar values per key; finite deterministic sampling, never materializes the Cartesian product. Seed/budget pin at first trial; edits require a new attempt. |

Compatibility aliases: `backtesting.research`, `simulation.research`. Same validation, grants, cancellation, runtime and retry identity; prefer the canonical name.

## `backtesting.optimizePreview`

Read exact frozen candle dates, offsets, workload and validated candidate overrides without strategy execution or baseline changes; evidence-enabled runs may record exposure metadata.

Retry key: **not required**. External local-assistant access is still required.
Effects: **none**. These are possible consequences, not grants; optional write variants still require approval and a retry key.

| Parameter | Contract |
| --- | --- |
| `runId` | Completed active backtest. Legacy Pine runs without authoritative fills/input metadata/frozen request history must be rerun first. |
| `expectedRevision` | Current revision. |
| `mode` | sweep\|holdout\|walkForward. |
| `grid` | Up to 4 Python parameter keys or declared Pine input variable IDs with value arrays; Cartesian max12. Pine values must satisfy declared types, bounds and options; not strategy execution-setting overrides. |
| `trainBars` | Required for holdout/walkForward >=2. |
| `testBars` | Required for holdout/walkForward >=2. |
| `folds` | Walk-forward 1-5. Maximum 65 evaluations: 12 training candidates plus one selected test per fold; 1000 sequential prefix callbacks. |
| `warmupMode` | Optional coldStart (legacy default) or pastOnly. Past-only uses preceding unscored indicator candles and a flat scored account. |
| `warmupBars` | Optional 0-5000 preceding candles with pastOnly. Python recalculates each scored prefix (1000 callbacks maximum); Pine secondary warmup is unsupported. |
| `objective` | Optional netPnl (highest, default) or maxDrawdown (lowest); training-only; ties grid order. P&L includes open mark-to-market. |
| `minCompletedPositions` | Optional integer >=0 default0. Fully completed positions (Pine entry lots), not exit legs; checked on training only. |
| `maxDrawdown` | Optional nonnegative maximum training drawdown in account currency/units, NOT percent. |
| `search` | Optional {method:sampled,version:floyd-mulberry32-v1,seed:1-80 character string,budget:1-12}. Up to 1000 unique scalar values per key; finite deterministic sampling, never materializes the Cartesian product. Seed/budget pin at first trial; edits require a new attempt. |

Compatibility aliases: `backtesting.researchPreview`, `simulation.researchPreview`. Same validation, grants, cancellation, runtime and retry identity; prefer the canonical name.

## `backtesting.optimizeMeasure`

Explicit cancellable calibration: evaluate exactly the first grid candidate on the complete first training window through the actual frozen Python/Pine engine. No accounting/source/chart writes. Poll get.researchMeasurement; cancel with cancel. Low-confidence wall-time interval, not a guaranteed bound. Revision/grid/window changes invalidate it.

Retry key: **required**. External local-assistant access is still required.
Effects: **code, write**. These are possible consequences, not grants; optional write variants still require approval and a retry key.
Local indicator/backtesting grant required.

| Parameter | Contract |
| --- | --- |
| `runId` | Completed active backtest. Legacy Pine runs without authoritative fills/input metadata/frozen request history must be rerun first. |
| `expectedRevision` | Current revision. |
| `mode` | sweep\|holdout\|walkForward. |
| `grid` | Up to 4 Python parameter keys or declared Pine input variable IDs with value arrays; Cartesian max12. Pine values must satisfy declared types, bounds and options; not strategy execution-setting overrides. |
| `trainBars` | Required for holdout/walkForward >=2. |
| `testBars` | Required for holdout/walkForward >=2. |
| `folds` | Walk-forward 1-5. Maximum 65 evaluations: 12 training candidates plus one selected test per fold; 1000 sequential prefix callbacks. |
| `warmupMode` | Optional coldStart (legacy default) or pastOnly. Past-only uses preceding unscored indicator candles and a flat scored account. |
| `warmupBars` | Optional 0-5000 preceding candles with pastOnly. Python recalculates each scored prefix (1000 callbacks maximum); Pine secondary warmup is unsupported. |
| `objective` | Optional netPnl (highest, default) or maxDrawdown (lowest); training-only; ties grid order. P&L includes open mark-to-market. |
| `minCompletedPositions` | Optional integer >=0 default0. Fully completed positions (Pine entry lots), not exit legs; checked on training only. |
| `maxDrawdown` | Optional nonnegative maximum training drawdown in account currency/units, NOT percent. |
| `search` | Optional {method:sampled,version:floyd-mulberry32-v1,seed:1-80 character string,budget:1-12}. Up to 1000 unique scalar values per key; finite deterministic sampling, never materializes the Cartesian product. Seed/budget pin at first trial; edits require a new attempt. |

Compatibility aliases: `backtesting.researchMeasure`, `simulation.researchMeasure`. Same validation, grants, cancellation, runtime and retry identity; prefer the canonical name.

## `backtesting.optimizeRerun`

After explicit confirmation, separately backtest an eligible selected candidate on the original FULL frozen sample, source, history and costs. Reuses test candles: NOT new out-of-sample evidence. Never changes the baseline, applied strategy, source, chart or library; requires a free active slot. Poll get; cancel with cancel.

Retry key: **required**. External local-assistant access is still required.
Effects: **code, write**. These are possible consequences, not grants; optional write variants still require approval and a retry key.
Local indicator/backtesting grant required.

| Parameter | Contract |
| --- | --- |
| `runId` | Original completed run ID. |
| `expectedRevision` | Current revision. |
| `researchId` | Current completed research.id (response key retained); legacy reports without id must rerun optimization. |
| `fold` | Selected fold 1-5. |
| `candidate` | Selected eligible candidate 1-12. |
| `confirmed` | Must be true after user confirms same-sample separate rerun. |

Compatibility aliases: `backtesting.researchRerun`, `simulation.researchRerun`. Same validation, grants, cancellation, runtime and retry identity; prefer the canonical name.
