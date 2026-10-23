# tl-strategy-research command reference

Generated from a command-catalog snapshot. Recheck the addressed tab before use.
Use explicit tab targeting and inspect the final JSON status. Do not guess IDs or grant permissions.

Do not infer grant permissions from `mutates`: Desktop discovery can omit structured grant metadata. Read [tl-desktop](../tl-desktop/SKILL.md) for the verified local-change versus cloud-watchlist access rules.

## `backtesting.research`

Run bounded Python or Pine sweep/holdout/rolling walk-forward on a completed run's frozen source/candles. Pine uses actual fills, unchanged execution settings and captured request history only; no Python runtime or new fetches. Poll get section research; cancel with cancel. Every segment starts flat; selection uses training net P&L only. Source lookahead remains unverified.

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

Compatibility alias: `simulation.research`. Same runtime and retry identity; prefer the canonical name.
