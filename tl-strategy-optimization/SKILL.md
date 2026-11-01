---
name: tl-strategy-optimization
description: Use TradingLead's Strategy Optimizer in the Optimize tab for Python or Pine parameter sweeps, train/test holdouts, walk-forward, measured search estimates, confirmed selected-parameter reruns and detailed optimization HTML reports from frozen data. Owns optimization reporting, not general single-run execution, engine development or the research HTML library.
---

# Strategy Optimizer

Start with [tl-desktop](../tl-desktop/SKILL.md). Read current
`backtesting.capabilities` and [commands.md](commands.md).
This skill owns `backtesting.optimize`, `optimizePreview`, `optimizeMeasure`,
`optimizeRerun`, `optimizeReport` and `optimizeReportGet` in the inline
**Optimize** tab, **not** the `research.*` HTML library.
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
   - `walkForward`: 1-5 independently initialized rolling folds; later training can contain
     earlier revealed tests. This is not a continuously carried portfolio.
   There is no separate train-only mode.
3. Read `parameterMetadata` from ordinary run summaries: variable `id`,
   title, current value, type, bounds, step and options where available.
   Pine keys are declared input variable IDs, not titles or `strategy()`
   execution-setting names. For Python, use declared/read keys that the frozen
   source actually consumes. Inventing a key does not alter a hard-coded
   strategy; metadata or a successful command does not prove behavioral effect.
   Legacy Python summaries can include `inferred:true` suggestions from simple
   literal `params.get("key", default)` calls in the frozen source. Their value
   is a detected fallback, not a recorded runtime value or declared constraint.
   Saved values and declarations take precedence. Discovery does not execute
   source or alter the frozen run; dynamic/conflicting defaults are not guessed.
   Build a bounded Cartesian grid: at most 4 parameter keys, at most 12 candidate
   combinations. Pine values must satisfy declared types, bounds and options;
   invalid candidates are rejected before starting optimization.
4. For holdout/walk-forward, provide `trainBars` and `testBars`, each at least
   2 and actually compatible with the sample/warmup. Walk-forward allows 1-5
   folds (command default1). Maximum workload is 65 evaluations (12 training
   candidates plus one selected test per fold, across five folds) and 1,000
   sequential prefix calls. Each segment starts flat with original capital.
   Omitted `warmupMode` means `coldStart`, using the original-config warmup
   inside each segment. Explicit `warmupMode:"pastOnly"` and `warmupBars:0-5000`
   use preceding captured, unscored indicator candles with a fresh scored
   account. Python recalculates each scored prefix within the 1000-call cap;
   Pine secondary-history warmup is unsupported. Neither carries orders,
   positions or equity between segments.
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
Starting another optimization appends a retained experiment; `research` remains
the latest-attempt compatibility view. Read earlier attempts with
`get {section:"optimization",attemptIndex:N}` using their zero-based index in
`experiments`. Failed/cancelled trials remain recorded, and storage limits fail
explicitly rather than pruning earlier evidence. Save a stopped library
snapshot to preserve the run outside active history.

Newer runs can record exposure bookkeeping when results, previews or exports
are read. That metadata is separate from execution, baseline accounting and
optimization revision; a read is not proof of untouched validation data.

## Sampled search and newer Desktop commands

The UI's **Sample combinations** uses explicit Advanced JSON and
`search:{method:"sampled",version:"floyd-mulberry32-v1",seed,budget}`.
Use 1-4 keys, at most 1000 unique scalar values per key, a 1-80 character seed
and budget 1-12. The finite sample is repeatable, not an adaptive search or
guarantee of finding the best combination. Preview the exact selection before
execution. Seed, budget and manifest pin at the first trial; edited settings
create a new attempt rather than modifying retained trials.

The following commands require Desktop protocol 2 with `catalog.aliases`.
Older shells omit them even when the local UI works. Check the addressed live
catalog first; never bypass the missing command using private execution:

- `backtesting.optimizeResume`: explicit confirmed resume of the latest
  interrupted/failed/cancelled sampled attempt, pinned by run revision,
  attempt ID and original manifest SHA-256. Completed and failed trial IDs are
  not reexecuted; it accepts no setup changes.
- `backtesting.optimizeChecks`: confirmed bounded neighbor/cost checks on the
  selected candidate's original training window. Pin run/revision, attempt,
  manifest, fold and candidate. Budget covers the baseline plus neighbors
  times cost scenarios; the limit is 12 evaluations and 1000 prefix calls.
- `backtesting.optimizeValidateSymbols`: confirmed independent evaluations of
  1-12 explicitly reviewed symbols on the pinned feed/interval/training dates.
  Budget equals symbol count; unsupported metadata or incomplete history
  fails, never substitutes the original symbol or claims pooled returns.

Read exact fields in [commands.md](commands.md), poll domain completion, and
read retained compact check reports through `get {section:"candidateChecks"}`.
Frozen full plans/accounts remain in stopped exports. Independent-symbol
checks fetch history and are not part of a read-only audit.

## Detailed optimization reports

In **Backtesting > Optimize > Optimization results**, choose **Generate detailed
report**, then **View report** or **Export HTML**. The expanded reader supports
light/dark themes and fullscreen. The self-contained download includes every
recorded evaluation, original-versus-reconstructed metrics, equity/drawdown
charts, complete exit legs, open positions, recorded order/fill events, frozen
settings, provenance and source. Native disclosures work offline; no scripts,
remote assets or live data. Expand sections before printing.

For Desktop commands, discover both new commands in the addressed tab first:

1. Read the completed active run and current revision.
2. Explicitly call `backtesting.optimizeReport` with `runId`,
   `expectedRevision`, `confirmed:true` and a fresh retry key. This executes
   the recorded candidate segments again using the frozen source/data and
   installed engine. It does not rerank, add a new active run, modify the
   baseline, change the optimization revision or evaluate unselected holdouts.
3. Poll `backtesting.optimizeReportGet` with the same run/revision until
   `completed`, `failed` or `cancelled`. The report has its own `id`, `status`,
   `completed`, `total` and `mismatchedEvaluations`. Cancel through
   `backtesting.cancel`, then inspect **report** status, not baseline status.
4. On completion, fix `reportId` to that `id`. Read
   `optimizeReportGet` with `offset:0`, `chunkSize:16000` and the same
   `runId`, `expectedRevision`, `reportId`; follow `nextOffset` until null.
   Concatenate `text` as HTML (not JSON). Offsets count UTF-16 code units.
   Confirm the complete length equals `totalChars` before writing a file.

Only one report is cached per account in the current page session. Reload or
generating another report can remove that cache. **Export HTML to retain it**;
`librarySave` saves the optimization summary and frozen run, not this generated
HTML. No reports are silently inserted into the separate `research.*` library
(its smaller size budget is unsuitable for full ledgers).

Older summary-only optimizations can reconstruct if their frozen inputs and
windows are sufficient. Original trade-by-trade identity cannot be proven:
the original optimizer did not retain candidate ledgers. Matching metrics do
not prove identical trades. Changed metrics are prominently flagged, never
silently substituted for recorded results. Reasons are only recorded comments
and execution facts, not invented source-level rationale.

Generation is cancellable and revision/account guarded, requires the local
indicator/backtesting grant, and uses no fresh data or free active slot.
Evidence is bounded to 8 Mi characters and HTML to 24 Mi characters; an oversized
report fails explicitly, never silently truncates. The download contains private
strategy source and trading records; keep it local unless sharing is authorized.

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
- Each scored segment starts flat; walk-forward does not carry a live portfolio
  continuously through all segments.
- Cold-start Pine segments use only their primary candles and compatible
  captured secondary history. Past-only primary warmup is explicit; secondary
  warmup remains unsupported. Uncaptured
  timeframes or request coverage fail explicitly; optimization never fetches a
  substitute dataset. Original source-run accounting remains unchanged.
- Sequential source receives prefix data, but that does not prove the source
  lacks hard-coded future information. Vectorized causality remains unverified.
- Distinguish evaluated candidates, failures, incomplete work and parameter
  selection. Do not promote a best in-sample result as robust.
- A proposed experiment is not evidence it has been run.

Use the detailed-report workflow above for complete candidate ledgers and HTML
exports. Use [tl-research](../tl-research/SKILL.md) only for a separate, smaller
authored summary built from actual metrics, provenance and caveats.
