---
name: tl-strategy-optimization
description: Use TradingLead's Strategy Optimizer in the Optimize tab for Python or Pine parameter sweeps, train/test holdouts, walk-forward, measured search estimates and confirmed selected-parameter reruns on frozen backtest data. Owns experiment setup and interpretation, not general single-run execution, engine development or HTML reports.
---

# Strategy Optimizer

Start with [tl-desktop](../tl-desktop/SKILL.md). Read current
`backtesting.capabilities` and [commands.md](commands.md).
This skill owns `backtesting.optimize`, `optimizePreview`, `optimizeMeasure`
and `optimizeRerun` in the inline **Optimize** tab, **not** the `research.*` HTML library.
Use [tl-backtesting](../tl-backtesting/SKILL.md) when creating/restoring the
prerequisite run or reading its shared result contract; it is not a second
owner of experiment selection. Improving a strategy through experiments is
different from implementing new optimization features in the application.

## Compatibility and response keys

The old `backtesting.research`, `backtesting.researchPreview`,
`backtesting.researchMeasure`, `backtesting.researchRerun` and corresponding
`simulation.research*` names remain validated compatibility aliases of these
same operations. Identical parameters and retry keys across aliases do not
execute twice; different payloads conflict. Prefer the Optimize names.

Use `backtesting.get` with `section:"optimization"` (legacy `"research"`
also works). Both return the existing `section:"research"`, summary `research`
and top-level paged `rows`/`nextOffset`, not an invented `optimization` object.
Ordinary get retains `researchMeasurement` and `researchSourceSignals`;
reruns retain `researchId` and `provenance.researchRerun`. Existing saved data is
not rewritten. UI view names `optimize`/`optimization` alias legacy `research`.

The optimizer additions in this documentation were synchronized from an
**offline source-catalog snapshot**, not a ready installed tab. Discover them
in the addressed running app before use; source/tests do not prove deployment.

## Workflow

1. Select an existing **completed active backtest** and read its current
   revision, parameters, frozen candle coverage, warmup, execution mode and
   configuration. Both **Python** and **Pine** source runs are supported. Pine
   candidates execute in the Pine engine with actual fills and frozen execution
   settings, without Python readiness. Legacy Pine runs without authoritative
   fills, input metadata or frozen request history must be rerun first.
   Restore a saved snapshot to an available active slot first if necessary;
   never delete another run automatically.
2. Choose deliberately:
   - `sweep` (default): evaluate ALL frozen candles; no forced test.
     Selection is in-sample and can overfit.
   - `holdout`: choose on training only, test that winner once.
   - `walkForward`: 1-5 rolling cold-start folds; later training can contain
     earlier revealed tests. This is not a continuously carried portfolio.
   There is no separate train-only mode.
3. Read `parameterMetadata` from ordinary run summaries: variable `id`,
   title, current value, type, bounds, step and options where available.
   Pine keys are declared input variable IDs, not titles or `strategy()`
   execution-setting names. For Python, use declared/read keys that the frozen
   source actually consumes. Inventing a key does not alter a hard-coded
   strategy; metadata or a successful command does not prove behavioral effect.
   Build a bounded Cartesian grid: at most 4 parameter keys, at most 12 candidate
   combinations. Pine values must satisfy declared types, bounds and options;
   invalid candidates are rejected before starting optimization.
4. For holdout/walk-forward, provide `trainBars` and `testBars`, each at least
   2 and actually compatible with the sample/warmup. Walk-forward allows 1-5
   folds (command default1). Total budgets remain 72 evaluations and 1,000
   sequential prefix calls. Each segment starts flat with original capital
   and its own original-config warmup; no pre-test warmup or carried orders.
5. Choose `objective:"netPnl"` (default, highest training net P&L including
   open mark-to-market) or `"maxDrawdown"` (lowest training drawdown).
   Optional `minCompletedPositions` is an integer 0-1000000, default0:
   fully completed positions, Pine completed entry lots, **not exit legs**.
   Optional `maxDrawdown` is a finite nonnegative amount in account
   currency/units, **not percent**. Both constraints use training only.
   Equal objective values keep grid order. No eligible candidate means no
   selected parameters and its held-out test is explicitly skipped.
6. Use `backtesting.optimizePreview` with the same request and current revision
   for validated candidate overrides, exact candle offsets/UTC dates, warmup,
   unused tail, train/test evaluations and primary/prefix workload. It does not
   execute a strategy. Secondary history is separate and can add major cost.
   For a measured estimate, follow the explicit calibration procedure below.
7. Call `backtesting.optimize` with `runId`, `expectedRevision`, the chosen
   mode/grid/objective/constraints and a retry key.
8. Poll `backtesting.get` with `section:"optimization"`, following `nextOffset`
   until null. Cancel through `backtesting.cancel` if requested; read the final
   optimization state in `research`. Rows are top-level paged `rows`, not `research.rows`;
   the summary contains selections/status. A pending/cancelled experiment
   is not a completed comparison.

Optimization updates the **same active run's revision and `research` report**,
not its frozen baseline fills/source/candles. Preview and measurement do not
increment that revision; actual optimization does. Reread ordinary `get` after
completion before `librarySave` or `optimizeRerun`; never reuse the pre-search
revision. `get.status` can remain `"completed"` for the baseline while
`get.research.status` is `"running"`, `"failed"` or `"cancelled"`. The
measurement similarly has its own `researchMeasurement.status`.
Starting another optimization replaces the previous report on that active run.
Save a stopped library snapshot first if the user wants to preserve the earlier
experiment; the command has no separate replace-confirmation parameter.

## Grid and split normalization

The UI supports explicit scalar values and numeric **From/To/Step**, including
signed decimals and descending negative steps. Include the endpoint only when
reached by a whole step; reject oversized grids, never truncate them.
Commands take canonical `grid` arrays, **not** range objects. For example,
From=-0.5, To=0.5, Step=0.25 expands to
`[-0.5,-0.25,0,0.25,0.5]`. Pine numeric step is an editing hint; authoritative
type, bounds and options still apply.
Each candidate value must be a finite number, string, boolean or null:
objects/arrays are not optimization candidates. Other frozen Python run parameters
can still contain supported nested JSON; optimization does not broaden its grid
value types to match general run parameters.

Percent splits are a UI convenience, not command parameters:
`trainBars=floor(totalBars*trainPercent/100)` and similarly for `testBars`.
Pass candle counts, not `splitUnit`/`trainPercent`/`testPercent`. Preview the
actual dates and unused tail. Empty grid `{}` evaluates unchanged inputs once;
do not invent a `parameters` field on optimization commands.

## Explicit measured estimate, not static prediction

- Before calibration, search time is **not measured yet**. Lexical
  loop/request/function matches with source locations are warnings, not a
  complexity parser, Big-O bound or seconds estimate.
- `backtesting.optimizeMeasure` takes the same request as optimization, including
  `runId` and `expectedRevision`, with the normal grant/retry key. It executes
  exactly ONE actual first-grid candidate on the COMPLETE first training
  segment, including warmup, through the frozen Python/Pine engine.
  It may itself be expensive; never run it silently.
- The immediate result is a running measurement. Poll ordinary
  `backtesting.get(...).researchMeasurement` (not the paged optimization section)
  until `completed`, `failed` or `cancelled`. Cancel via
  `backtesting.cancel` with the original `runId`; inspect the terminal state.
- Successful results expose `durationMs`, `estimateMs`, `lowMs`, `highMs`,
  `confidence:"low"` and `caveat`. The heuristic scales measured evaluator
  time by primary candle work, or cumulative prefix rows for sequential.
  Its 0.5x-3x interval is **not a bound**. Engine/worker startup and cooperative
  yields are included; UI rendering/persistence are excluded. Candidate values,
  arbitrary loops/requests, hardware load and warm caches can materially alter
  runtime. Failures or insufficient clock precision leave time unknown.
- Measurements are ephemeral/account-scoped, not saved run accounting.
  Matching is exact over original revision, source, inputs/parameters,
  execution settings/config, frozen primary/secondary data, context/provenance,
  mode and plan. Edited settings/grid/splits or replaced/revised snapshots
  invalidate reuse. Do not reuse an old estimate for a different request.
  Actual optimization independently records per-row `durationMs`, `elapsedMs`
  and a live rough `estimatedRemainingMs`; there is no extra automatic execution.

## Confirmed selected-parameter rerun

After completed optimization, explain and obtain explicit user confirmation:
this is a separate backtest of the selected inputs on the original **FULL
frozen sample**, including reused held-out candles, **not new out-of-sample
evidence**. The UI requires a native consent checkbox and confirmation dialog.
Then call `backtesting.optimizeRerun` with exactly
`{runId,expectedRevision,researchId,fold,candidate,confirmed:true}` and a retry key.
`researchId` is the current completed report ID; fold/candidate are its selected
eligible one-based values, not arbitrary grid rows.

It returns a NEW accepted run summary; poll that `runId`, or cancel that new ID.
It reuses original frozen source/candles/history/context/costs/settings through
the authoritative engine. It does not fetch fresh chart data, apply/show the
result, overwrite baseline/source/library/drafts or remove other runs.
All three occupied active slots means `SIMULATION_HISTORY_FULL`; preserve work
and ask for explicit storage cleanup rather than evicting. Stale revision or
optimization identity, wrong selection, busy work and missing confirmation fail.
Read current state after uncertain outcomes; do not double-submit with new keys.
Completed exports label `provenance.researchRerun.reusedSample:true`.

Illustrative command envelope (replace the run/revision and choose a declared
input grid). For `node cli.cjs exec backtesting.optimize --params-file plan.json`,
the file must contain **only the inner `params` object**, not this envelope;
supply `--tab` and `--key` separately.

```json
{
  "type": "backtesting.optimize",
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
- Selection uses only the chosen supported **training objective/constraints**.
  Report training, held-out and eligibility evidence separately; no eligible
  candidate is a real outcome, not a successful selected/tested strategy.
- Baseline metrics refer to the original full sample, not an equal-length
  benchmark for shorter windows. Defaults impose no minimum position count;
  low-drawdown selection alone can favor an inactive strategy.
- Each segment starts flat; walk-forward does not carry a live portfolio
  continuously through all segments.
- Pine segments use only their primary candles and compatible captured
  secondary history, excluding earlier cold-start history. Uncaptured
  timeframes or request coverage fail explicitly; optimization never fetches a
  substitute dataset. Original source-run accounting remains unchanged.
- Sequential source receives prefix data, but that does not prove the source
  lacks hard-coded future information. Vectorized causality remains unverified.
- Distinguish evaluated candidates, failures, incomplete work and parameter
  selection. Do not promote a best in-sample result as robust.
- A proposed experiment is not evidence it has been run.

Use [tl-research](../tl-research/SKILL.md) to store a readable HTML report from
the actual returned metrics, provenance and caveats.
