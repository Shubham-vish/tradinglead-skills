---
name: tl-tlscript
description: Author and manage TradingLead TLScript custom indicators using validation, local source versions and chart-instance commands. Use for indicator formulas, supported TA functions, typed inputs, save/apply/update, revision restore, visibility and native settings. TLScript is not general Pine Script and cannot place orders or backtest strategies.
---

# TLScript indicators

Start with [tl-desktop](../tl-desktop/SKILL.md), then read
`indicators.listCapabilities`. [commands.md](commands.md) is the command reference.

## Author only the supported language

TLScript is a bounded expression language, not Pine, Python or JavaScript.
Current limits: 12,000 source characters, 32 inputs, 6 plots, 500-bar lookback.
Read current capabilities before relying on these limits/functions.

```text
indicator("Trend average", overlay=true)
length = input.int(20, "Length", 2, 100)
enabled = input.bool(true, "Enabled")
average = ta.ema(close, length)
plot(enabled ? average : close, "EMA", "#22c55e")
```

One statement per line; declarations precede use; strings use double quotes.
Input types are `input.int`, `input.float`, `input.bool`. Optional `// @input`
JSON metadata adds groups/descriptions/options without replacing code defaults,
types or bounds. Plot colors are six-digit hex.

Do not invent `request.security`, arrays, loops, user-defined functions,
`strategy.*`, alerts, labels or drawing objects. Missing warmup values are not
valid signals. Lookback combines nested calculations and maximum input bounds.

## Validate -> save -> apply

1. Send the source to `indicators.validate`. `status:"ok"` can contain
   **`valid:false`**; inspect line/column diagnostics and fix them.
2. Saving is optional. `indicators.save` creates a local source record; updates
   require `id` and the current `expectedRevision`. Read the saved revision.
3. Inspect `indicators.applied` and the intended chart's readiness/context.
4. Use `indicators.apply` with **source OR saved id**, optional current source
   revision, and declared `inputs`. Pass a retry key.
5. Inspect `indicators.applied` and `chart.snapshot` after completion.

Source IDs and native chart `entityId`s are different. Saving never replaces a
chart instance; applying does not imply saving. For an existing instance,
`indicators.update` targets its `entityId` and replaces only that instance after
the new result is ready. Preserve other studies/drawings and use returned IDs.

## Inputs, appearance and history

- `indicators.showInputs` opens the calculation draft dialog. It does not
  recalculate until the user applies. Programmatic recalculation uses
  `indicators.update` with `inputs`.
- `indicators.setVisibility` toggles visibility without deleting source.
  `indicators.showSettings` opens native Style controls; it is not a generic
  programmatic native-style setter.
- `indicators.remove` removes an applied instance. `indicators.delete`
  deletes a saved source at its current revision. Neither substitutes for the
  other.
- `indicators.history` lists retained revisions; `indicators.get` can read a
  retained revision. `indicators.restore` creates a **new** current revision
  and does not silently update the chart.
- `indicators.editorState` / `indicators.openEditor` operate on a mounted
  Studio and refuse to discard dirty work. Open the indicators bottom panel
  through `workspace.setPanel` first.

Local library records are account/origin-specific. UI backup/cloud-sync controls
are not equivalent to registered local source commands. For executable
strategies, use [tl-python](../tl-python/SKILL.md) and
[tl-backtesting](../tl-backtesting/SKILL.md), not TLScript order syntax.
