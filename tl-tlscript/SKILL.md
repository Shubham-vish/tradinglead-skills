---
name: tl-tlscript
description: Author and manage TradingLead TLScript-Pine indicators and strategy source. Use for Pine v5/v6 compatibility discovery, isolated validation, saved source/current revisions, chart instances, named appearance settings and input controls. Pine strategies execute through Backtesting, not indicator Apply/scanning; no full TradingView parity.
---

# TLScript-Pine authoring

Start with [tl-desktop](../tl-desktop/SKILL.md), then read
`indicators.listCapabilities`. [commands.md](commands.md) is the command reference.

Guided synthetic Practice Labs are intentionally for humans, without AI lesson
commands. Normal-account indicator commands do not address their isolated
training library or complete lesson tasks.

**Owns:** Writing/revising Pine indicators or strategies and using existing validation,
library and chart-instance commands. It does not implement Pine compiler or
renderer features. Pine strategy execution belongs to
[tl-backtesting](../tl-backtesting/SKILL.md); current `indicators.validate`
compiles both and returns `kind`. Do not load every strategy workflow for a
chart-indicator task.

For parameter sweeps, holdout and walk-forward, use the inline **Optimize** tab
and [tl-strategy-optimization](../tl-strategy-optimization/SKILL.md).
Its `backtesting.optimize*` commands reuse the authoritative frozen Pine engine
without requiring Python readiness; discover their installed availability first.

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
execution and scanner surfaces, not Studio compile/save. For strategy execution use
[tl-backtesting](../tl-backtesting/SKILL.md) with `language:"pine"`; Pine
backtesting is vectorized only and is never a live broker order.

## Validate -> save -> apply

1. Send source to `indicators.validate`. `status:"ok"` can contain
   **`valid:false`**; inspect all diagnostics and input metadata. Validation is
   compile-only, not calculation correctness. Optional `profile:true` returns
   bounded compile timings. Confirm chart history readiness separately.
2. Saving is optional. `indicators.save` compiles and saves source/input values;
   updates require `id` and its current `expectedRevision`. `replace:true`
   explicitly replaces a same-title saved item. Resolve conflicts by rereading
   instead of blindly retrying.
3. Inspect `indicators.applied` and the chart's feed, symbol and loaded candles.
4. Apply **source OR saved id**, optional current source revision and declared
   `inputs` using a retry key. `indicators.update` targets an existing stable
   `instanceId` OR current primary `entityId`, rather than creating a second study.
5. Read `indicators.applied` and `chart.snapshot` for the final state and data
   provenance; no fallback feed or stale candles are implied by success.

For strategy source, steps 3-5 instead use **Backtest / Apply strategy** and
`backtesting.*`; do not send it to `indicators.apply`. Pass exact draft inputs
and explicit per-run settings, preserving declaration defaults when omitted.
Pine execution does not require Python readiness. Supported strategy plots and
drawings come from the same frozen backtest as its fills, not a second
indicator run. The current authoring prompt discloses broker limitations rather
than rejecting all strategy requests. Older installed tabs must be rediscovered.

Source IDs, stable `instanceId`s and native chart `entityId`s are different. Saving never replaces a
chart instance; applying does not imply saving. None is a backtest `runId`.
Pine save derives its title from the declaration; it has no `title` parameter.
For an existing instance,
prefer its stable `instanceId`: native IDs can change after recalculation.
Replacement remains limited to that instance after the new result is ready.
Preserve other studies/drawings and use returned IDs.

External save/apply/update show their result in Studio by default. Pass
`showInStudio:false` only for deliberate headless work. Inspect `data.studio`:
`status:"error",operationCompleted:true` means the source/chart mutation
completed but presentation failed, for example because a user draft is dirty.
Keep the returned IDs; resolve the blocker and retry only `indicators.openEditor`,
never repeat the completed mutation with a fresh key. Clean editors refresh
source and inputs; dirty drafts are preserved.

## Inputs, appearance and history

- `indicators.showInputs` opens the calculation draft dialog. It does not
  recalculate until the user applies. Programmatic recalculation uses
  `indicators.update` with `inputs`. Omit both source and saved id to retain
  the applied source/private compiled artifact. Merge edits into `applied.inputs`
  to preserve other values; omitted inputs retain current values on this path.
  Explicit replacement source uses its defaults, or saved inputs with a saved id.
  A missing/restoring target fails instead of creating a duplicate.
- `indicators.setVisibility` toggles visibility without deleting source.
  `indicators.showSettings` opens named Style controls. For programmatic named
  appearance, read `indicators.getSettings` with stable `instanceId` OR primary `entityId`, retain
  the unmodified snapshot as `expected`, clone/edit its supported appearance
  fields as `settings`, and call `indicators.setSettings` with a retry key.
  Preserve plot IDs/order/metadata; re-read after a conflict. Neither style
  command executes the script or changes saved source. Read `getSettings` again
  with `defaults:true` for source-derived defaults. To reset style, copy default
  style fields into `settings`, preserve current visibility fields, and send
  `reset:["style"]`; visibility resets use `reset:["visibility"]`. Both pages
  can be reset together with the full defaults snapshot. `expected` must always
  be the unmodified **current** snapshot, never the defaults snapshot.
- `indicators.remove` removes an applied instance. `indicators.delete`
  deletes a saved source at its current revision. Neither substitutes for the
  other.
- `indicators.retryRestores` requests another attempt for pending chart
  restores, using an indicator grant and retry key. `retryRequested:true` is
  an acknowledgement, not completion: poll `indicators.applied` for readiness,
  instance status and restore errors. This reuses the Studio recovery queue;
  it does not restore old saved source revisions or resolve layout conflicts.
- `indicators.get` reads the **current** Pine source/revision only. Pine does
  not expose `indicators.history` or `indicators.restore`; those commands
  belong to the separate Python source library.
- `indicators.openEditor` opens Studio and waits for its editor to mount.
  Supply exactly one saved `id`, applied stable `instanceId` (preferred), or
  native `entityId`, for either Pine or Python. It loads the exact source,
  parameters and update target without executing, and refuses dirty drafts,
  unavailable targets or private source. `indicators.openDraft` opens unsaved
  Python/Pine source without applying it. Inspect `indicators.editorState.visible`;
  an embedded editor's `open:true` alone is not actual visibility.
  To start the toolbar's guided **New** draft through the same command, send
  `{"source":"","language":"pine"}` (or `"python"`), with a retry key. Omit inputs
  and execution settings. It clears saved/update identity and compilation,
  focuses the editor and leaves chart instances unchanged. The draft contains
  only shared language-specific guidance comments: Pine `//@version=6` and
  declaration/input/calculation guidance, or Python `calculate(bars, params)`
  guidance. No actual starter calculation, plot or trade is inserted.
  Dirty/busy drafts are refused; this never discards user edits or compiles.
  `DRAFT_DIRTY` requires local save/discard; `BUSY` requires waiting or cancelling
  the current action. There is no external discard override. Cancellation is
  not write rollback: inspect state before retrying an uncertain mutation with
  the same key and identical parameters.
  Manually emptied text is never repopulated. Pine's explicit empty draft
  survives local draft recovery; Python's draft is only
  retained while its editor stays mounted.

Studio's **Problems** list combines source diagnostics and operation/storage
feedback. Only real source locations navigate code or enter fix prompts;
an operation failure is not a fabricated source diagnostic. Validation results
and the current `editorState.compiled` flag remain separate: opening source,
including a saved strategy, does not imply it was compiled.

Opening source exits native chart fullscreen before showing Studio; a
`STUDIO_NOT_VISIBLE` error requires resolving visibility, not another Apply.
Read `editorState.dock` for the actual host mode. `workspace.setPanel` can
request the bottom indicators panel, but there is no command to choose Studio's
right/window docking mode.

### Candle-relative annotation appearance

Rediscover the addressed tab: only use these controls when its
`indicators.getSettings` returns `annotations` (the source catalog snapshot is
not proof that an older packaged tab has them).

Colored Pine labels use compact owned SVG badges. With adaptive shrinking
enabled, short bodies target **1.5 center-to-center candle spacings** at the
default width. Below the 9-CSS-pixel reference, their
width, height, text, padding and directional pointers shrink together.
Native plain/transparent labels and plotshape/plotchar/arrow glyphs shrink too
when adaptive is enabled. **Adaptive shrinking is off by default**; explicit
saved true/false choices are preserved.
Pine `size` and formatting remain the baseline/max size; long/multiline text is
preserved and may require a wider badge. A one-pixel font floor prevents exact
proportions at extreme zoom; no universal readability/no-overlap guarantee.

The existing Style page and `indicators.getSettings`/`setSettings` expose:

| `settings.annotations` field | Default | Allowed / meaning |
| --- | --- | --- |
| `widthCandles` | 1.5 | 0.5–12; target full colored badge width in candle spacings |
| `heightScale` | 1 | 0.25–4; colored badge text, height, padding and pointer multiplier |
| `adaptive` | false | Boolean; true enables shrinking with zoom, false keeps reference sizing |

Read current settings, keep that snapshot untouched as `expected`, clone it,
edit `annotations`, preserve all plot IDs/order/metadata, then call
`indicators.setSettings` with a retry key. For example the edited field can be
`{"widthCandles":3,"heightScale":0.5,"adaptive":true}`. Re-read after a conflict.
Style Defaults clears these overrides; calculation/source is not changed.
They persist with applied-instance appearance, not saved source. Local
persistence is not account-cloud confirmation; matching server acceptance is
required. There are **no arbitrary Pine label width/height arguments**.

Directional pointers keep exact script candle/price anchors; other colored
silhouettes are rectangular approximations. **Native chart image exports omit
the compact colored SVG badges.** Native text/glyphs remain exportable.
Unsupported pane/price mapping hides badges with a warning; the non-iframe
native fallback has an intrinsic padding floor. Box/line/polyline data
coordinates, box-auto fitting, screen-fixed tables/legends and user drawings
are unchanged. These are disclosed rendering approximations, not TradingView
visual parity or a promise to rescale arbitrary future primitives.

## Execution evidence and persistence

`profile:true` on apply/update exposes runtime stage timings without generated
code or JavaScript stacks. On errors, inspect bounded `data.diagnostics`,
line/column and operation/stage context where available; old packaged bridges
may omit them. Successful compilation or a fast profile is not plot correctness.

Ordinary calculations use fresh isolated workers. `realtime:true` is an explicit,
experimental chart-session-only mode: sampled/coalesced updates, not every
provider tick; `varip` counts processed executions. Minute intervals and observed
live closure are required; replay and secondary requests are unsupported in
this mode. Inputs, history/context changes and reload reset its state. It is
not persisted. Omitted realtime on update retains the current mode; do not
enable it automatically to improve speed.

Pine and Python source libraries now use an account cloud library with a
device cache. Inspect returned storage/cloud-confirmation and conflict state:
`persisted:true` alone proves only the local write. Offline/unconfirmed writes
retain local source; do not claim cross-device success without confirmation.
Pine current local revision checks are distinct from cloud concurrency.
Deleting source neither removes applied studies nor revokes published shares.

Purchased/published indicators are separate from editable library source.
Discover `purchased`, `sales`, `applyPurchased` and `publishPaid` before using
them. Apply-only access does not authorize source export; changing inputs
retains private backing and license checks. Publishing changes a commercial
surface and requires explicit user intent, not a routine authoring check.

Studio also has manual-only free sharing/access/revocation, public-library
browsing, shared-update installation, workspace/cloud-conflict resolution,
backup import/export, telemetry controls and clipboard/AI-fix previews.
The current command surface does not expose those operations; paid publishing
is not a substitute. Neither source access nor an apply-only license grants
permission to export private code. Runtime-only manifest capabilities and
hosted TradingView features are not implicit command support.
