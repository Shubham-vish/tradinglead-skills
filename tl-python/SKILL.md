---
name: tl-python
description: Author and manage isolated TradingLead Python indicators and strategy source. Use for syntax-only validation, calculate(bars, params), typed inputs, plots/drawings, saved source history, apply/update and named appearance settings. Desktop Strategy SDK requirements differ from browser-compatible Python; no live broker orders.
---

# TradingLead Python authoring and indicators

Start with [tl-desktop](../tl-desktop/SKILL.md). Read
`pythonIndicators.capabilities` before execution; exact commands are in
[commands.md](commands.md).

**Owns:** Writing/revising Python source and using the existing source-library
and indicator commands. Strategy execution and result evidence belong to
[tl-backtesting](../tl-backtesting/SKILL.md); parameter experiments belong to
[tl-strategy-research](../tl-strategy-research/SKILL.md). This is not the
implementation guide for changing TradingLead's Python runtime or simulator.

## Runtime and data contract

Check the addressed tab's runtime readiness before executing. Browser-compatible
standard-library/NumPy/pandas indicators may run in a disposable browser
sandbox; the bundled `tradinglead` Strategy SDK, native/OS packages and hard
process isolation require Desktop. Neither case permits unrestricted host
Python, filesystem/network access or a silent runtime substitution. Saving
source is possible without executing it; **save is not syntax validation**.
`pythonIndicators.validate` checks syntax with the isolated AST checker
without running imports or calculations. Inspect `valid` and `diagnostics`;
`validation:"syntax-only"` does not certify strategy correctness. An
unavailable checker is an error.

The entry point is `calculate(bars, params)`. Bars are chronological OHLCV
dictionaries; `time` is milliseconds, `volume` can be `None`. Output values
must align to the input candles and be finite numbers or `None`.

```python
# @input {"id":"enabled","type":"bool","default":true,"group":"Display"}
def calculate(bars, params):
    return {
        "title": "Close reference",
        "overlay": True,
        "plots": [{
            "id": "close",
            "title": "Close",
            "color": "#22c55e",
            "values": [bar["close"] if params.get("enabled", True) else None for bar in bars]
        }]
    }
```

Keep plot IDs stable so appearance survives replacement/restoration. Drawings
are bounded and use returned input-bar timestamps; discover supported shapes.
Discover current runtime limits for candles, plots and drawings. There is no
fixed source-character cap; storage, the 2 MiB command/transport budgets and
runtime limits still apply. Leave room for the complete request envelope.

Typed `# @input` JSON comments support `int`, `float`, `bool`, `string`, `enum`,
plus title/group/description/min/max/step/options. Keep domain validation in
Python too. Read the runtime's current parameter limits before use. Validated finite JSON
parameters may include nested objects and arrays; `_simulation` is reserved.
The sweep grid in [tl-strategy-research](../tl-strategy-research/SKILL.md)
still requires flat parameter keys and bounded candidates.

## Account source and chart lifecycle

1. Read capabilities/examples, inspect the chart and optionally run
   `pythonIndicators.validate`; syntax-only success is not an execution test.
2. Optionally call `pythonIndicators.save` with title, source and parameters.
   Updates need the current `expectedRevision`; `replace:true` explicitly
   replaces a same-title saved item. Reread after a conflict.
   Source is cached locally and synchronized to the account library when
   configured/authorized. Inspect cloud confirmation: `persisted:true` alone
   is not proof of cross-device storage. Offline/conflicting writes retain
   the local source and report their state.
3. `pythonIndicators.apply` executes source **OR** a saved `id`; use a retry
   key. Supplying `instanceId` updates that applied instance; `entityId` is
   the alternative target, not an additional simultaneous target.
   Optional `strategyMode` selects vectorized/sequential for this chart
   instance; omission uses the saved mode. Saving can also retain the mode.
4. Inspect `pythonIndicators.applied` for status, error, plot metadata and
   provenance. Inspect plotted values through `chart.snapshot`.
5. Treat failures and missing-runtime diagnostics explicitly; do not fabricate
   a successful result or silently substitute a different data source.

`list/get/history/restore/delete` manage saved source. Restoration creates a
new source revision. `remove` detaches an applied instance and owned drawings,
not its saved source. Stable instance IDs, native entity IDs and library IDs
are distinct.

External save/apply show their result in Studio by default; use
`showInStudio:false` for deliberate headless work. Inspect `data.studio`:
`status:"error",operationCompleted:true` means the mutation succeeded but
Studio could not show it. Preserve returned IDs and dirty drafts; resolve the
blocker and retry only `indicators.openEditor`, not the completed save/apply.

The shared `indicators.openEditor` command opens Studio, waits for mounting and
selects Python automatically. Supply exactly one saved `id`, stable applied
`instanceId` (preferred), or current native `entityId`. Applied snapshots reopen
their exact source, parameters, execution mode and update target without running
Python. Clean editors refresh; dirty drafts, restoring targets and noneditable
source are protected. `indicators.editorState.visible` reports actual host
visibility, separately from the embedded editor's `open` state.

`showInputs` opens typed calculation controls; user Apply is explicit.
Programmatic recalculation uses `apply` with new parameters and the existing
target. `setVisibility` and `showSettings` do not run Python. Named appearance
is also programmable: use a stable `instanceId` OR primary applied `entityId` with
`pythonIndicators.getSettings`, preserve the full returned snapshot as
`expected`, clone/edit supported style fields as `settings`, then call
`pythonIndicators.setSettings` with a retry key. Preserve plot IDs/order and
metadata; reread on conflict. It does not recalculate or save source.
For defaults, separately read `getSettings` with `defaults:true`. Copy desired
default style/visibility fields into `settings` and pass `reset:["style"]`,
`["visibility"]` or both to clear those retained overrides. Keep the unmodified
**current**, not default, snapshot as `expected`. Stable targets tolerate native
entity replacement but never silently select a different logical study.

## Strategies are separate from indicator plotting

Capabilities include current source examples such as `strategy-ema-sdk` and
`sequential`; discover them rather than guessing imports or SDK methods.
`from tradinglead import Strategy, ta` is the bundled strategy/TA surface.
The shared Studio Docs browser describes the actual supported functions.

Running/applying an indicator draws visuals. It does **not** evaluate a
backtest just because the source also returns strategy decisions. Use
[tl-backtesting](../tl-backtesting/SKILL.md) for execution and analytics.
Sequential mode supplies prefix-only candles and post-fill account state;
vectorized mode has a different causality guarantee. Neither certifies
hard-coded future information. No live broker orders are supported.
