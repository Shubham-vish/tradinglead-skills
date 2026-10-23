---
name: tl-strategy-research
description: Use TradingLead's Python or Pine parameter sweeps, train/test holdouts and walk-forward experiments on a completed backtest's frozen data. Owns experiment setup and interpretation, not single-run execution, research-engine development or HTML reports.
---

# Bounded strategy experiments

Start with [tl-desktop](../tl-desktop/SKILL.md). Read current
`backtesting.capabilities` and [commands.md](commands.md).
This skill owns `backtesting.research`, **not** the `research.*` HTML library.
Use [tl-backtesting](../tl-backtesting/SKILL.md) when creating/restoring the
prerequisite run or reading its shared result contract; it is not a second
owner of experiment selection. Improving a strategy through experiments is
different from implementing new research features in the application.

## Workflow

1. Select an existing **completed active backtest** and read its current
   revision, parameters, frozen candle coverage, warmup, execution mode and
   configuration. Both **Python** and **Pine** source runs are supported. Pine
   candidates execute in the Pine engine with actual fills and frozen execution
   settings, without Python readiness. Legacy Pine runs without authoritative
   fills, input metadata or frozen request history must be rerun first.
   Restore a saved snapshot to an available active slot first if necessary;
   never delete another run automatically.
2. Choose `sweep`, `holdout` or `walkForward` deliberately. Use only parameter
   keys meaningful to the saved source. Pine keys are declared input variable
   IDs, not display titles or `strategy()` setting names.
3. Build a bounded Cartesian grid: at most 4 flat keys, at most 12 candidate
   combinations. Pine values must satisfy declared types, bounds and options;
   invalid candidates are rejected before starting research.
4. For holdout/walk-forward, provide `trainBars` and `testBars`, each at least
   2 and actually compatible with the sample/warmup. Walk-forward allows 1-5
   folds. Total budgets are 72 evaluations and 1,000 sequential prefix calls.
5. Call `backtesting.research` with `runId`, `expectedRevision`, the chosen
   mode/grid and a retry key.
6. Poll `backtesting.get` with `section:"research"`, following `nextOffset`
   until null. Cancel through `backtesting.cancel` if requested; read the final
   state. A pending/cancelled experiment is not a completed comparison.

Illustrative parameter shape (replace the run and choose a meaningful grid):

```json
{
  "type": "backtesting.research",
  "idempotencyKey": "unique-experiment-key",
  "params": {
    "runId": "sim-example",
    "expectedRevision": 1,
    "mode": "sweep",
    "grid": {"length": [10, 20]}
  }
}
```

## Interpret correctly

- Source/candles are frozen from the original run; no fresh-data claim.
- Selection uses **training net P&L**, not a new objective invented by the
  assistant. Report training and test results separately.
- Each segment starts flat; walk-forward does not carry a live portfolio
  continuously through all segments.
- Pine segments use only their primary candles and compatible captured
  secondary history, excluding earlier cold-start history. Uncaptured
  timeframes or request coverage fail explicitly; research never fetches a
  substitute dataset. Original source-run accounting remains unchanged.
- Sequential source receives prefix data, but that does not prove the source
  lacks hard-coded future information. Vectorized causality remains unverified.
- Distinguish evaluated candidates, failures, incomplete work and parameter
  selection. Do not promote a best in-sample result as robust.
- A proposed experiment is not evidence it has been run.

Use [tl-research](../tl-research/SKILL.md) to store a readable HTML report from
the actual returned metrics, provenance and caveats.
