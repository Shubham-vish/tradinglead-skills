# tl-strategy-optimization command reference

Source-only snapshot from an isolated frontend registry; installed Desktop was not ready. Rediscover live availability before use.
Use explicit tab targeting and inspect the final JSON status. Do not guess IDs or grant permissions.

Do not infer grant permissions from `mutates`: Desktop discovery can omit structured grant metadata. Read [tl-desktop](../tl-desktop/SKILL.md) for the verified local-change versus cloud-watchlist access rules.

## `backtesting.optimize`

Run bounded Python or Pine sweep/holdout/rolling walk-forward on a completed run's frozen source/candles. Pine uses actual fills, unchanged execution settings and captured request history only; no Python runtime or new fetches. Poll get section optimization; cancel with cancel. Every segment starts flat; selection uses the chosen training-only objective and constraints. Source lookahead remains unverified.

Retry key: **required**. External local-assistant access is still required.
Local indicator/backtesting grant required.

| Parameter | Contract |
| --- | --- |
| `runId` | Completed active backtest. Legacy Pine runs without authoritative fills/input metadata/frozen request history must be rerun first. |
| `expectedRevision` | Current revision. |
| `mode` | sweep\|holdout\|walkForward. |
| `grid` | Up to 4 Python parameter keys or declared Pine input variable IDs with value arrays; Cartesian max12. Pine values must satisfy declared types, bounds and options; not strategy execution-setting overrides. |
| `trainBars` | Required for holdout/walkForward >=2. |
| `testBars` | Required for holdout/walkForward >=2. |
| `folds` | Walk-forward 1-5. Total max72 evaluations /1000 sequential prefix callbacks. |
| `objective` | Optional netPnl (highest, default) or maxDrawdown (lowest); training-only; ties grid order. P&L includes open mark-to-market. |
| `minCompletedPositions` | Optional integer >=0 default0. Fully completed positions (Pine entry lots), not exit legs; checked on training only. |
| `maxDrawdown` | Optional nonnegative maximum training drawdown in account currency/units, NOT percent. |

Compatibility aliases: `backtesting.research`, `simulation.research`. Same validation, grants, cancellation, runtime and retry identity; prefer the canonical name.

## `backtesting.optimizePreview`

Read exact frozen candle dates, offsets, workload and validated candidate overrides without executing a strategy or modifying history.

Retry key: **not required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `runId` | Completed active backtest. Legacy Pine runs without authoritative fills/input metadata/frozen request history must be rerun first. |
| `expectedRevision` | Current revision. |
| `mode` | sweep\|holdout\|walkForward. |
| `grid` | Up to 4 Python parameter keys or declared Pine input variable IDs with value arrays; Cartesian max12. Pine values must satisfy declared types, bounds and options; not strategy execution-setting overrides. |
| `trainBars` | Required for holdout/walkForward >=2. |
| `testBars` | Required for holdout/walkForward >=2. |
| `folds` | Walk-forward 1-5. Total max72 evaluations /1000 sequential prefix callbacks. |
| `objective` | Optional netPnl (highest, default) or maxDrawdown (lowest); training-only; ties grid order. P&L includes open mark-to-market. |
| `minCompletedPositions` | Optional integer >=0 default0. Fully completed positions (Pine entry lots), not exit legs; checked on training only. |
| `maxDrawdown` | Optional nonnegative maximum training drawdown in account currency/units, NOT percent. |

Compatibility aliases: `backtesting.researchPreview`, `simulation.researchPreview`. Same validation, grants, cancellation, runtime and retry identity; prefer the canonical name.

## `backtesting.optimizeMeasure`

Explicit cancellable calibration: evaluate exactly the first grid candidate on the complete first training window through the actual frozen Python/Pine engine. No accounting/source/chart writes. Poll get.researchMeasurement; cancel with cancel. Low-confidence wall-time interval, not a guaranteed bound. Revision/grid/window changes invalidate it.

Retry key: **required**. External local-assistant access is still required.
Local indicator/backtesting grant required.

| Parameter | Contract |
| --- | --- |
| `runId` | Completed active backtest. Legacy Pine runs without authoritative fills/input metadata/frozen request history must be rerun first. |
| `expectedRevision` | Current revision. |
| `mode` | sweep\|holdout\|walkForward. |
| `grid` | Up to 4 Python parameter keys or declared Pine input variable IDs with value arrays; Cartesian max12. Pine values must satisfy declared types, bounds and options; not strategy execution-setting overrides. |
| `trainBars` | Required for holdout/walkForward >=2. |
| `testBars` | Required for holdout/walkForward >=2. |
| `folds` | Walk-forward 1-5. Total max72 evaluations /1000 sequential prefix callbacks. |
| `objective` | Optional netPnl (highest, default) or maxDrawdown (lowest); training-only; ties grid order. P&L includes open mark-to-market. |
| `minCompletedPositions` | Optional integer >=0 default0. Fully completed positions (Pine entry lots), not exit legs; checked on training only. |
| `maxDrawdown` | Optional nonnegative maximum training drawdown in account currency/units, NOT percent. |

Compatibility aliases: `backtesting.researchMeasure`, `simulation.researchMeasure`. Same validation, grants, cancellation, runtime and retry identity; prefer the canonical name.

## `backtesting.optimizeRerun`

After explicit confirmation, separately backtest an eligible selected candidate on the original FULL frozen sample, source, history and costs. Reuses test candles: NOT new out-of-sample evidence. Never changes the baseline, applied strategy, source, chart or library; requires a free active slot. Poll get; cancel with cancel.

Retry key: **required**. External local-assistant access is still required.
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
