# tl-strategy-research command reference

Generated from a command-catalog snapshot. Recheck the addressed tab before use.
Use explicit tab targeting and inspect the final JSON status. Do not guess IDs or grant permissions.

Do not infer grant permissions from `mutates`: Desktop discovery can omit structured grant metadata. Read [tl-desktop](../tl-desktop/SKILL.md) for the verified local-change versus cloud-watchlist access rules.

## `backtesting.research`

Run bounded sweep/holdout/rolling walk-forward on one completed run's frozen source/candles. Poll get section research; cancel with cancel. Starts each segment flat; selects on training net P&L only. Vectorized causality remains unverified.

Retry key: **required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `runId` | Completed active backtest. |
| `expectedRevision` | Current revision. |
| `mode` | sweep\|holdout\|walkForward. |
| `grid` | Up to 4 flat Python parameter keys with value arrays; Cartesian max12. |
| `trainBars` | Required for holdout/walkForward >=2. |
| `testBars` | Required for holdout/walkForward >=2. |
| `folds` | Walk-forward 1-5. Total max72 evaluations /1000 sequential prefix callbacks. |

Compatibility alias: `simulation.research`. Same runtime and retry identity; prefer the canonical name.
