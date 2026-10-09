---
name: tl-tlscript
description: Author and manage TradingLead TLScript-Pine indicators. Use for Pine v5/v6 compatibility discovery, isolated validation, saved source/current revisions, chart instances, named appearance settings and input controls. Pine strategies run only in Backtesting, not the chart indicator/scanner surface; no full TradingView parity.
---

# TLScript-Pine indicators

Start with [tl-desktop](../tl-desktop/SKILL.md), then read
`indicators.listCapabilities`. [commands.md](commands.md) is the command reference.

## Discover Pine compatibility, not the retired expression language

Studio offers Python and **TLScript-Pine**, backed by an isolated Pine-compatible
worker. The former limited TLScript expression syntax and its fixed limits are
retired. Discover the addressed tab's `indicators.listCapabilities` before
authoring; Pine v5/v6 support is selective, not full TradingView parity. There
is no fixed Pine source-character cap, but transport, storage and execution
limits still apply. Unsupported constructs receive explicit diagnostics; do
not assume hosted libraries, TradingView services or external data are present.

```text
//@version=5
indicator("Trend average", overlay=true)
length = input.int(20, "Length", minval=2)
plot(ta.ema(close, length), "EMA")
```

Validate the exact source rather than guessing support for a particular Pine
function or visual. Chart-source secondary history must come from the same
authorized feed; local provider scans explicitly reject secondary-data
requests. Pine `strategy()` and `strategy.*` are rejected on the indicator
and scanner surfaces. For strategy execution use
[tl-backtesting](../tl-backtesting/SKILL.md) with `language:"pine"`; Pine
backtesting is vectorized only and is never a live broker order.

## Validate -> save -> apply

1. Send source to `indicators.validate`. `status:"ok"` can contain
   **`valid:false`**; inspect diagnostics and input metadata. Validation does
   not save or apply. Confirm chart history readiness separately.
2. Saving is optional. `indicators.save` compiles and saves source/input values;
   updates require `id` and its current `expectedRevision`. `replace:true`
   explicitly replaces a same-title saved item. Resolve conflicts by rereading
   instead of blindly retrying.
3. Inspect `indicators.applied` and the chart's feed, symbol and loaded candles.
4. Apply **source OR saved id**, optional current source revision and declared
   `inputs` using a retry key. `indicators.update` targets an existing primary
   `entityId`, rather than creating a second study.
5. Read `indicators.applied` and `chart.snapshot` for the final state and data
   provenance; no fallback feed or stale candles are implied by success.

Source IDs and native chart `entityId`s are different. Saving never replaces a
chart instance; applying does not imply saving. For an existing instance,
`indicators.update` targets its `entityId` and replaces only that instance after
the new result is ready. Preserve other studies/drawings and use returned IDs.

## Inputs, appearance and history

- `indicators.showInputs` opens the calculation draft dialog. It does not
  recalculate until the user applies. Programmatic recalculation uses
  `indicators.update` with `inputs`.
- `indicators.setVisibility` toggles visibility without deleting source.
  `indicators.showSettings` opens named Style controls. For programmatic named
  appearance, read `indicators.getSettings` with the primary `entityId`, retain
  the unmodified snapshot as `expected`, clone/edit its supported appearance
  fields as `settings`, and call `indicators.setSettings` with a retry key.
  Preserve plot IDs/order/metadata; re-read after a conflict. Neither style
  command executes the script or changes saved source.
- `indicators.remove` removes an applied instance. `indicators.delete`
  deletes a saved source at its current revision. Neither substitutes for the
  other.
- `indicators.get` reads the **current** Pine source/revision only. Pine does
  not expose `indicators.history` or `indicators.restore`; those commands
  belong to the separate Python source library.
- `indicators.editorState` / `indicators.openEditor` operate on a mounted
  Studio and refuse to discard dirty work. `indicators.openDraft` accepts
  unsaved Python/Pine source without applying it. Open the indicators bottom
  panel through `workspace.setPanel` first.

Current source command descriptions identify the Pine library as account/device
local. UI backup or sync controls are not a command to synchronize libraries;
do not claim cross-device persistence without confirming the running product.
