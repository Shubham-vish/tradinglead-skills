# Native UI input and local video recording

These are **native Desktop 0.1.9+ features**, not a frontend command namespace.
Desktop 0.1.8 and earlier do not contain them. Read
`tradinglead desktop capabilities` on the intended installation first. If the
actions below are absent, a new Desktop build is required; skills cannot add them.
No MCP, browser-debugging endpoint or arbitrary JavaScript execution is used.

## Connect and check the installed access model

Select the intended tab from `tradinglead tabs`, then:

```bash
tradinglead desktop ui-enable --tab TAB_ID --key enable-session-1
tradinglead desktop ui-status --tab TAB_ID
tradinglead desktop ui-inspect --tab TAB_ID
```

UI control requires an active, visible, ready `/charts` tab and local assistant
access. **Check the native `ui-enable` description, not this skill's version:**

- **Desktop 0.1.11+ prompt-free implementation:** the
  description says "without approval dialogs". `ui-enable`
  starts control without a human dialog; `expiresAt:null` means no timeout.
  An active account is required, but no separate cloud-write checkbox.
  The matching frontend enables authenticated workspace writes automatically.
- **Installed 0.1.9/0.1.10:** both existing write grants and initial human
  approval are still required; approval lasts ten minutes. Do not claim a
  skill update removed those native dialogs or approve them programmatically.

Desktop 0.1.12 has **no floating AI control window**. On older builds, closing
that window stops control. On all supported builds the person can use
**Help > Stop AI control and recording** or **Ctrl/Cmd+Shift+Escape**.
Tab switch/close, full-page navigation, opening the access panel, pausing access and
sign-out/account changes invalidate control at once; same-origin hiccups such as `chart.open`
only pause input (`ui-status` shows `paused:true`) and end control after 5 s. Inspect the
new context before starting again; never undo an explicit user pause or Stop.
In 0.1.12, same-origin SPA/chart and catalog changes retain control; wait for
`ui-status` to report `ready:true` before input resumes.

`ui-inspect` reports `automationScope` per control. **It is informational on
Desktop 0.1.10 and prompt-free builds: false or absent is NOT a blocker.**
Paper-order tickets, sidebar buttons, bottom-panel tabs and ordinary portal
dialogs do not need a page marker or per-click confirmation. Do not ask the user
to add markers or deploy the website merely because this flag is false.
Version 0.1.10's native description says "without per-action prompts".
The installed 0.1.9 release retains the old per-action
confirmation fallback until Desktop itself is updated; never dismiss or approve
those prompts programmatically, or force markers onto the page.
Login, purchases, credentials, broker setup, permission controls
and Guided Practice Labs remain human-operated. Visible credential dialogs,
unsupported frames and protected targets fail explicitly.

## Inspect and interact

`ui-inspect` lists at most 200 visible non-sensitive controls, including CSS
selectors, labels, roles, disabled/editable state and viewport rectangles.
It does not return input values. Optional `selector` scopes the search.
Optional `frames` is an ordered array of up to four same-origin iframe selectors.
It does not auto-scroll or silently choose between duplicate selector matches.

Every input command requires a fresh `--key`. Reuse the same key and identical
parameters only to reconcile the same operation. Retries are deduplicated by a
bounded in-memory cache, not a durable transaction log.

```bash
tradinglead desktop ui-click --tab TAB_ID --params '{"selector":"ACTUAL_CSS"}' --key click-1
tradinglead desktop ui-hover --tab TAB_ID --params '{"x":400,"y":250}' --key hover-1
tradinglead desktop ui-scroll --tab TAB_ID --params '{"selector":"ACTUAL_SCROLL_CONTAINER","deltaX":0,"deltaY":400}' --key scroll-1
tradinglead desktop ui-type --tab TAB_ID --params '{"selector":"ACTUAL_INPUT","text":"new text","replace":true}' --key type-1
tradinglead desktop ui-key --tab TAB_ID --params '{"selector":"ACTUAL_INPUT","key":"Enter"}' --key key-1
tradinglead desktop ui-disable --tab TAB_ID --key disable-session-1
```

Use **either** `selector` **or** `x,y` (CSS pixels relative to the top-level tab
viewport, not desktop/screenshot physical pixels). Native zoom is handled by the
app. For iframe contents, provide `frames`; coordinates can also resolve through
visible same-origin frames. Covered, hidden, disabled, ambiguous, transformed
frame or cross-origin targets are rejected rather than guessed.

- Click: `button:"left"|"right"` and `clickCount:1|2`; defaults left/single.
- Scroll: `deltaX` and `deltaY`, each -2000..2000; positive down/right. On
  0.1.11 **send both** (use 0 for the unused axis): a missing delta fails with
  a misleading "Wheel deltas must be between -2000 and 2000". In 0.1.12,
  at least one axis is required and the omitted axis defaults to zero.
- Type: nonempty Unicode `text`, maximum 16000 characters; `replace` defaults
  false. Use enabled text inputs, textareas or contenteditable editors.
- Key: `Enter`, `Escape`, `Tab`, `Backspace`, `Delete`, `ArrowLeft`, `ArrowRight`,
  `ArrowUp`, `ArrowDown`, `Home`, `End`, `PageUp`, `PageDown`; optional `shift`.
  In 0.1.12 the target is optional: `{"key":"Escape"}` uses the currently
  focused page/frame after checking it is not protected. A non-focusable target
  also falls back to existing focus and reports `windowLevel:true`; it does not
  imply focus moved to the supplied target. Older builds need a focusable target.
  No system shortcuts, clipboard commands, file-picker input or arbitrary keys.
- Drag (0.1.12+): `from` is an inspected CSS selector or `{x,y}`; `to` is
  absolute `{x,y}` or relative `{dx,dy}`, in top-level CSS pixels. Optional
  `frames`, `button:"left"|"right"`, `steps:1..120` (default 12) and
  `holdMs:0..5000`. Example: `{"from":"ACTUAL_HANDLE","to":{"dx":120,"dy":40}}`.
  The whole path must remain visible and unprotected. The app releases the
  mouse on failure; inspect the resulting position before retrying.
- `--params-file file.json` avoids shell quoting and command-line text exposure.

Input results say `dispatched:true, verified:false`. **Do not claim a saved
change from dispatch alone.** Inspect the UI, take an authorized screenshot or
read the domain state. Prefer domain commands for deterministic saves/backtests.

### Smooth interaction recipe

Run one operation at a time; the examples use placeholders from a fresh
`ui-inspect` result, not selectors to copy verbatim:

```bash
tradinglead desktop ui-inspect --tab TAB_ID --params '{"selector":"ACTUAL_PANEL"}'
tradinglead desktop ui-hover --tab TAB_ID --params '{"selector":"ACTUAL_CONTROL"}' --key reveal-1
tradinglead desktop ui-inspect --tab TAB_ID --params '{"selector":"ACTUAL_PANEL"}'
tradinglead desktop ui-click --tab TAB_ID --params '{"selector":"ACTUAL_CONTROL","button":"right"}' --key context-menu-1
tradinglead desktop ui-inspect --tab TAB_ID
```

Inspect the opened menu before selecting its actual item. Never assume a native
OS menu or protected dialog became automatable. For a lower item, scroll the
visible container by about 250-500 CSS pixels, inspect, then click the newly
visible target. Wheel events go to the target under the pointer; scrolling the
page does not necessarily scroll a nested panel. Do not click offscreen targets.

For editing, locate the actual editable input/textarea/contenteditable, use
`ui-type` with `replace:true`, then send Enter or click the real Apply button
only when that is the intended operation. The inspector omits values by design:
verify the resulting domain state rather than treating dispatch as a value read.
Choose `--params-file` for multiline source; empty strings, passwords and file
inputs are unsupported. For canvas targets, use a fresh authorized screenshot
and convert to **CSS viewport pixels**, or prefer a domain command.

With iframes, copy the ordered `frames` path from inspection and use it
consistently. Reinspect after zoom, resizing, scrolling, navigation or opening
an overlay. Do not press Escape blindly: it can discard an unsaved dialog.

### Recover without guessing

| Condition | Safe next step |
| --- | --- |
| Missing native action | Update Desktop; do not substitute `exec` or a debugging endpoint. |
| `UI_NOT_READY` | Confirm the intended visible `/charts` tab and current readiness; do not reload unsaved work. |
| `UI_CONTROL_DISABLED` | On prompt-free builds, inspect the intended context and use `ui-enable`; never resume after an explicit user Stop without a new user request. |
| `UI_ACCOUNT_REQUIRED` | Use an active account with local access enabled; do not change accounts or unpause access automatically. |
| `UI_CONTEXT_CHANGED` | Inspect the changed tab/account before restarting control; do not replay stale targets. |
| `UI_WRITE_PERMISSION_REQUIRED`, `UI_APPROVAL_REQUIRED`, `UI_APPROVAL_DENIED` | Legacy build gates. Respect them; current skill text does not upgrade the native app. Do not retry approval in a loop. |
| Hidden, covered or ambiguous target | Inspect again, close only a known safe overlay, or scroll the correct container; never pick a random match. |
| Human-only target or unsupported frame | Ask the person to operate it; no marker injection or protection bypass. |
| Dispatched input but unchanged UI | Inspect the actual outcome and readiness. Reconcile an uncertain operation with the same key; do not duplicate a potentially saved write. |
| `UI_FOCUS_FAILED` from `ui-key` | On older builds choose a focusable target or click the known menu item. Desktop 0.1.12 supports protected-focus-checked page keys without a selector. |

### Chart notes and older-build differences

- **Older navigation revokes control.** In 0.1.11, `chart.open` and similar chart navigation
  (symbol/pane changes) end UI control. Afterwards run
  `desktop ui-status`; if `enabled:false`, rerun `desktop ui-enable` with a
  fresh key after verifying context. This needs local access, an account and
  the access panel closed; do not toggle human-controlled access settings.
  Desktop 0.1.12 preserves same-origin chart/catalog transitions.
- **Prompt-free:** unscoped clicks/typing no longer prompt, and `ui-enable`
  returns `expiresAt:null`.
- **TradingView iframe.** Chart toolbar, Symbol Search, interval and replay
  controls live in `#tradingview_xxxx`. Find it with `ui-inspect` (control with
  role `iframe`), then pass the same `frames` to inspect, click and type, e.g.
  `ui-inspect {"frames":["#tradingview_ACTUAL"]}`. The id changes on every page
  load: rediscover it rather than reusing an old one.
- **Interval dropdown items are not listed** by `ui-inspect`. After opening the
  menu, take a screenshot and click the item by CSS-pixel coordinates. To close
  an open interval menu without changing anything, click the already-selected
  item (0.1.11 has no targetless Escape).
- **Wheel over the chart canvas**: `deltaX` pans time, `deltaY` zooms. During
  replay, older frontends require wheel framing because `chart.setView` with
  `visibleRange` returns `REPLAY_ACTIVE`. Newer frontend catalogs advertise
  view-only replay framing; read the live descriptor before using it.
- **Scrolled header toolbar.** If the TradingView header is scrolled sideways
  and Symbol Search is hidden, wheel over the header with negative `deltaX`
  (and `deltaY:0`) to scroll it back.
- **Recording:** 0.1.11 has the older downscaled, at-most-10-FPS path; 0.1.12
  supports native resolution and a requested 30 FPS by default. Actual frame
  throughput depends on rendering/encoding; inspect the finished clip.

Native `ui-drag` requires 0.1.12. Replay framing, overlay layout and stable
targets require a matching hosted frontend; installing Desktop alone does not
deploy these. Check native capabilities and the tab catalog independently.

## Record only the selected tab

```bash
tradinglead desktop record-start --tab TAB_ID --params '{"durationMs":30000,"fps":30,"scale":"native"}' --key record-1
tradinglead desktop record-status --tab TAB_ID --params '{"recordingId":"RETURNED_ID"}'
tradinglead desktop record-stop --tab TAB_ID --params '{"recordingId":"RETURNED_ID"}' --key stop-record-1
```

On prompt-free builds, `record-start` advertises "no audio or approval dialog";
it starts only when requested, without another dialog. Older 0.1.9/0.1.10 builds
still request separate human consent. UI control need not be started first.
The tab must remain active, visible, trusted, ready and locally accessible;
prompt-free recording also requires an active account.
A compact, draggable recording window shows elapsed/limit timers, a duration
progress bar and a **Stop & save** button. It switches to **Saving...** while
finalizing, with the button disabled to prevent repeat clicks.
Closing that window also stops and finalizes. Automatic limits:

- Duration: 1000..600000ms; default 60000ms. On 0.1.12, FPS: 1..60,
  default 30; `scale:"native"` (default, device pixel ratio) or 0.25..4.
  Optional top-level `selector` records only its visible clipped bounds.
  Older builds accept FPS 1..10/default 5, with no scale/crop parameters.
- Video-only VP8 WebM; no microphone, system audio or whole-desktop capture.
- Native or requested pixel dimensions in 0.1.12; older builds cap at 1920x1080.
  One recording at a time. Crop/viewport/DPR changes stop and finalize the clip.
- Maximum 64MiB per clip and 20 recording attempts per app process.

Poll until `state:"completed"` and use the returned local `path`. Files are
private, stored under `~/.tradinglead-desktop/recordings`, and never uploaded.
`stopping` is not completion. A failed job returns `state:"failed"` with a code
and no completed path. Capture/encoder/disk failures discard that clip's partial
file rather than presenting it as a completed video. Quit/crash during capture
can lose the current clip; stop and wait for completion before quitting.

Tab/context changes stop capture and finalize already accepted frames with
`stoppedReason`; they never continue recording another tab. Visible chart/account
information can appear in a requested clip: arrange/redact the UI beforehand.
Cross-origin frames and visible credential/consent dialogs are not supported.

## Playwright-style automation and promo recording

Builds whose `desktop capabilities` list **`ui-query`** add a deterministic
automation layer for scripted feature videos. It uses the app's in-process
Chromium debugger (no remote-debugging port). The same `ui-enable` consent,
protected targets, `/charts` scope and retry keys apply. If `ui-query` is
absent, the installed Desktop predates this layer.

**Tab:** these actions (and ui-click/hover/drag/scroll/type) may omit `--tab`.
The default is the focused window's active trusted tab. `ui-enable`,
`ui-disable`, `ui-status`, `record-stop` and `record-status` still need an
explicit tab.

**Targets:** use `selector` (CSS; open shadow roots are pierced), `text`
(`exact?:true`), `role` with an optional `name`, or `testId`
(`[data-testid]`). Add `frames` for same-origin iframes and `nth` for
duplicates. You can also wrap these in `target:{...}`. Pointer actions wait up
to `timeoutMs` (default 5000) for the target to be attached, visible, enabled,
uncovered and stable, and they scroll it into view first. Coordinates are
top-level CSS pixels.

| Action | Params (all optional unless shown) | Read/Write |
| --- | --- | --- |
| `ui-query` | **target**, `includeHidden`, `limit` 1-200 -> `{count, elements:[{selector,rect,label,role,text,visible,inViewport,enabled}]}` | read |
| `ui-wait-for` | **target**, `state:visible\|hidden\|attached\|detached`, `timeoutMs` (UI_TIMEOUT on expiry) | read |
| `ui-wait-idle` | `idleMs` (500), `maxInflight` (2), `timeoutMs` (10000); network quiet + two animation frames | read |
| `ui-move` | **target or x,y**, `durationMs`, `steps`, `offset:{x,y}` | key |
| `ui-hover` | **target or x,y**, `moveDurationMs`, `steps`, `offset` | key |
| `ui-click` | **target or x,y**, `button:left\|right\|middle`, `clickCount` 1-3, `modifiers:[Shift,Alt,Control,Meta]`, `holdMs`, `moveDurationMs`, `steps`, `offset` | key |
| `ui-drag` | **from**, **to** (target, `{x,y}` or `{dx,dy}`), `durationMs` (≤30000), `steps` (≤240), `holdMs`, `button`, `modifiers` | key |
| `ui-scroll` | target or x,y, `deltaX`/`deltaY` (±20000; give one or both, the other defaults to 0), `durationMs`, `steps`, `scrollIntoView:true`, `modifiers:["Shift"]` | key |
| `ui-type` | **text**, `target`/`selector` (else focused element), `replace`, `delayMs` per character, `showKeys` | key |
| `ui-press` | **key** (Enter, Escape, Tab, Backspace, Delete, arrows, Home/End, PageUp/Down, Space, letters, digits, simple punctuation), `modifiers`, `repeat`, `target`, `global:true` (window-level, no focusable target needed, e.g. Escape to close a menu), `showKeys` | key |
| `ui-mouse-leave` | optional target: move just outside it; else leave the viewport. Clears chart crosshairs and hover tooltips before a clean shot | key |
| `ui-wait-stable` | target or `clip`, `stableMs` 100-10000 (500), `intervalMs` 50-1000 (100), `timeoutMs` (10000) -> `{stable, timedOut?, elapsedMs, samples}`; waits until the region's pixels stop changing (charts after load) | read |
| `ui-screenshot` | target or `clip:{x,y,width,height}`, `format:png\|jpeg`, `quality`, `scale`, `path` -> `{path,bytes,width,height,devicePixelRatio}` | read |
| `ui-set-viewport` | **width**, **height**, `deviceScaleFactor` (0 = native), or `resizeWindow:true`; emulation clears on reload/full navigation (not same-document routes) and when control ends | key |
| `ui-reset-viewport` | none | key |
| `ui-cursor` | **show**, `preset:reel\|subtle\|off`, `style:arrow\|dot\|ring`, `size`, `color`, `ripple`, `rippleColor` (#FFD43B), `rippleSize` (56), `pressScale`, `keys:true` (keystroke pill), `badge` (opt-in: `true` or `{text:"AI" (1-24 chars plain text), color:#rrggbb}`; off by default and in every preset), `frame:true` (thin glowing viewport frame; default off) | read |
| `ui-highlight` | target or `rect`, `label`, `color`, `style:box\|reel` (reel = yellow glow box + bold label; labels stay inside the viewport and flip below near the top), `spotlight:true` (dim the rest), `durationMs` (0 keeps it), or `{clear:true}` | read |
| `ui-select-text` | **text** (or `whole:true` on a target), `to`, `occurrence`, `ignoreCase`, `mode:drag\|instant`, `durationMs`, scope target, or `{clear:true}`; selection only (verified native drag, Range fallback), no overlay | key |
| `ui-highlight-text` | **text**, `to`, `occurrence`, `all`, `style:marker\|underline\|box\|reel` (marker = highlight colour only, underline = underline only), `color`, `label`, `spotlight`, `animate`, `durationMs` (0 keeps it), or `{clear:true}`. The cursor parks off the text and off links (no hover popups); badge and label settle in blank space | read |
| `record-mark` | **label**, `data` (small JSON) while a screencast records; adds a cue to the events sidecar | read |
| `ui-chart-point` | `time` (unix s/ms or ISO) and/or `price`, `paneIndex`, `chartIndex` (split-chart cell); or `x,y` for the reverse lookup | read |

Pointer movement is smooth and eased from the last pointer position. The
first move jumps; later moves default to 300ms. Input is trusted (`isTrusted`),
so canvas charts receive real mousedown/move/up and wheel events. Over the
chart, wheel `deltaY` zooms and `deltaX` pans. `ui-type` inserts text, which
fires `input` events but not `keydown`; use `ui-press` for shortcuts. Ctrl/Meta
chords are limited to z/y/a, and Ctrl/Meta+wheel is rejected. When DevTools is
open on the tab, input falls back to native events (`engine:"electron"`), and
viewport emulation and screencast return `UI_DEBUGGER_BUSY`.

**Output paths:** screenshots default to the private screenshot folder;
recordings default to `~/.tradinglead-desktop/recordings`. Absolute paths must
stay inside your home folder, with no hidden or Library/AppData folders and an
existing parent folder. Existing files are never overwritten (`UI_PATH_EXISTS`).
A bare file name goes to the default folder.

### Screencast recording (`engine:"screencast"`)

`record-start` with `engine:"screencast"` streams JPEG frames from the tab
compositor, writes them asynchronously and, on stop, encodes a
**constant-frame-rate** H.264 MP4 (yuv420p, CRF 18, `+faststart`, even size) or
WebM with ffmpeg. Frames arrive irregularly; each output frame shows the latest
source frame at its time slot, so the video duration matches real time. The
page's cursor overlay is captured; the OS cursor is not. Params:

- `path`, `format:mp4|webm|frames`, `fps` 1-60 (30; use 30 or 60)
- `durationMs` / `maxDurationMs` (safety stop, up to 600000)
- `maxWidth`/`maxHeight` (default: viewport × devicePixelRatio, i.e. native pixels), `quality` 1-100, `everyNthFrame`, `keepFrames`
- `clip:{x,y,width,height}` (CSS px) **or** a target (`target`, `selector`, `text`, ...) to crop the video to a region
- `cursor`: `true` (default) shows the reel cursor with yellow click ripples for the recording and restores the previous cursor state afterwards; `false` leaves the overlay alone; an object such as `{"preset":"reel","keys":true}` sets the style (it also accepts `badge` and `frame`)

`record-status` on completion returns `path`, `width`, `height`, `fps`,
`frameCount`, `videoDurationMs`, `sourceFrames`, `duplicatedFrames`,
`skippedFrames`, `droppedFrames`, and `eventsPath`/`events`. If ffmpeg is
missing (searched on PATH, `/opt/homebrew/bin`, `/usr/local/bin`) or encoding
fails, `video:null` and `framesDir`/`framesJson` hold the JPEGs with
timestamps. Without `engine`, `record-start` keeps the legacy WebM recorder.
While recording, the native "REC / Stop" indicator is a small pill in the
bottom-right corner of the screen; it is never part of the video.

**Cursor presets:** `reel` (arrow 28px, big yellow double ring), `subtle`
(22px, small white ring), `off` (no ripple or press scale). Double-click shows
two staggered rings, right-click a dashed square ring, drags hold a ring under
the cursor while the button is down. `keys:true` (or `showKeys:true` on
`ui-press`/`ui-type`) shows a pill such as `⌘ K` or `Esc` at the bottom centre
for ~900ms.

**AI badge and frame (opt-in):** neither is shown unless you ask for it. The
default cursor and every preset (`reel`, `subtle`, `off`) have no badge and no
frame. Pass `badge:true` for a small dark pill with a pulsing sparkle and the
text "AI" that rides just below-right of the tip, in the ripple colour, or
`badge:{"text":"Agent","color":"#00ff88"}` to change it (1-24 characters of
plain text). It flips left or up near the viewport edges and bounces briefly
on each press. `frame:true` adds a thin glowing frame around the viewport
while the cursor is shown. Both are `pointer-events:none` and disappear with
`ui-cursor {show:false}`, `ui-disable`, consent loss and navigation.

**Events sidecar (`<video>.events.json`):** every ui action during the
recording (click, dblclick, press, type, scroll, drag-start/drag-end, hover/move
end, highlight, mouse-leave) and every `record-mark` is logged with `t`
(seconds on the video timeline), `frame`, `type`, and `x`,`y` in **video
pixels** after crop and scale (`inFrame:false` when outside the crop). Each
event is mapped with the geometry of its own frame, so window resizes and page
zoom mid-recording stay accurate (`viewportChanged:true`); pinch zoom marks
`mappingStale:true`. Use it to place zoom punches, SFX and captions:

```text
{"version":1,"video":".../reel.mp4","fps":30,"width":1200,"height":800,"durationSec":1.867,"frameCount":56,
 "coordinateSpace":"video-pixels","cssToVideo":{"scaleX":2,"scaleY":2,"offsetX":0,"offsetY":0},
 "viewport":{"width":900,"height":618},"clip":{"x":0,"y":0,"width":600,"height":400},
 "events":[
  {"t":0.669,"frame":20,"type":"click","button":"left","clickCount":1,"target":{"selector":"#b1","role":"button","label":"Indicators"},"x":74,"y":22,"inFrame":true},
  {"t":0.712,"frame":21,"type":"mark","label":"hero","data":{"zoom":1.6}},
  {"t":1.014,"frame":30,"type":"dblclick","button":"left","clickCount":2,"x":240,"y":284,"inFrame":true},
  {"t":1.462,"frame":43,"type":"press","key":"Esc","repeat":1}]}
```

`video_x = css_x * scaleX + offsetX`. Drags carry `from`, highlights `rect`.
`record-mark` returns an approximate `t` immediately; the file has the exact one.

**Clean-shot checklist:** `ui-wait-idle` then `ui-wait-stable` on the chart,
`ui-mouse-leave` to clear the crosshair, `ui-press {"key":"Escape","global":true}`
to close stray menus, then `record-start`.

```bash
tradinglead desktop ui-enable --tab TAB_ID --key en-1
tradinglead desktop ui-set-viewport --params '{"width":1280,"height":720,"deviceScaleFactor":2}' --key vp-1
tradinglead desktop ui-wait-stable --params '{"selector":".chart-container","stableMs":600}'
tradinglead desktop ui-mouse-leave --key ml-1
tradinglead desktop record-start --tab TAB_ID --params '{"engine":"screencast","fps":30,"maxDurationMs":60000,"cursor":{"preset":"reel","keys":true},"path":"indicators-promo.mp4"}' --key rec-1
tradinglead desktop ui-click --params '{"text":"Indicators","moveDurationMs":600}' --key c-1
tradinglead desktop record-mark --params '{"label":"indicators-open","data":{"zoom":1.5}}'
tradinglead desktop ui-wait-for --params '{"role":"dialog","state":"visible","timeoutMs":5000}'
tradinglead desktop ui-type --params '{"role":"searchbox","text":"RSI","delayMs":80}' --key t-1
tradinglead desktop ui-chart-point --params '{"time":1730784600,"price":24350}'
tradinglead desktop ui-drag --params '{"from":{"x":620,"y":410},"to":{"dx":-240,"dy":0},"durationMs":1200}' --key d-1
tradinglead desktop ui-scroll --params '{"x":640,"y":400,"deltaY":-600,"durationMs":800}' --key s-1
tradinglead desktop record-stop --tab TAB_ID --params '{"recordingId":"RETURNED_ID"}' --key rec-stop-1
tradinglead desktop record-status --tab TAB_ID --params '{"recordingId":"RETURNED_ID"}'   # until state:"completed"
tradinglead desktop ui-reset-viewport --key vp-2
tradinglead desktop ui-disable --tab TAB_ID --key dis-1
```

Over the bridge, send `POST /api/desktop` with the local token and
`{"action":"ui-click","params":{"testId":"save"},"idempotencyKey":"k1"}`.
`tabId` is optional for the actions above.

**`ui-chart-point` limits:** when the website exposes its read-only chart hook
(`window.__tlChartCoords`), results carry `source:"hook"`: times snap to the
nearest bar (`barTime`), `chartIndex` (0-3, grid order; default the selected
chart) addresses split-chart cells, and off-screen times are extrapolated with
`estimated:true`. Otherwise it falls back to `window.tvWidget` (TradingView
charting library) for the selected chart only: time is found by searching
`coordinateToTime`, and results can be off by a fraction of a bar. Price always
comes from the pane's visible price range. Normal and log scales are supported;
percentage/indexed scales return `UI_CHART_SCALE_UNSUPPORTED`. `inView:false`
means the point is off screen, so pan first. Re-query after any zoom, pan,
resize or symbol change.

## Batches, forms, assertions and traces (`ui-run`)

Builds whose `desktop capabilities` list **`ui-run`** add these actions. All
need `ui-enable`, keep protected-control blocks, and may omit `--tab`.

| Action | Params | Read/Write |
| --- | --- | --- |
| `ui-run` | **steps** (1-300): `{action, params, waitAfterMs?, at?}`, `{pauseMs}` or `{action:"mark", params:{label}}`; `timeline:"sequential"\|"timed"`, `stopOnError` (true), `maxDurationMs` (120000, max 600000), `record:{screencast record-start params, leadInMs (300), tailMs (500)}` | key (one for the batch) |
| `ui-fill` | **target**, **value** (`""` clears), `clear:false` appends, `delayMs` per char, `showKeys` -> `{value, verified}` | key |
| `ui-select` | **target**, exactly one of `value`/`label`/`index`; native `<select>` or custom dropdowns (role option/menuitem or exact text) | key |
| `ui-check` | **target**, `checked` (true); idempotent (`changed:false` when already set) | key |
| `ui-upload` | **target** (file input or its label/wrapper), **files**: absolute paths of 1-10 existing regular files in your home folder (no hidden/Library folders, ≤50 MiB each, ≤100 MiB total) | key |
| `ui-expect` | **target** + one of `toHaveText`, `toContainText`, `toBeVisible`, `toBeHidden`, `toBeEnabled`, `toHaveValue`, `toHaveCount`, `toBeChecked`; `timeoutMs` (5000), `ignoreCase` | read |
| `ui-trace-start` | `screenshots` (true), `dom` (false), `path` (new folder) | read |
| `ui-trace-stop` | none -> `{path, indexPath, tracePath, steps, failed}` | read |

**`ui-run`** executes the steps inside the app with no bridge round trips, so a
recording has no dead air between actions. Each step is validated and checked
for consent like the standalone action. Losing control (Stop, pause, tab or
account change) aborts at once, even mid-pause, with `details.abortedAt`.
A failing step fails `UI_RUN_FAILED` with `details.steps` (per step `status`,
`startMs`, `durationMs`, `lateMs`, `data` or `code`/`message`) unless
`stopOnError:false`. Lifecycle and recording actions (`ui-enable`,
`ui-disable`, `ui-status`, `record-*`, `ui-trace-*`, nested `ui-run`) are not
steps; `record` handles the screencast and `mark` adds an events-sidecar cue.
With `timeline:"timed"`, each `at` is ms after the `ui-run:start` mark in the
events file. Pointer actions check actionability first, so the press lands
~50-100 ms after `at`; use `moveDurationMs:0` for precise cues and leave gaps
longer than each step's duration (late starts are reported as `lateMs`).

```bash
cat > batch.json <<'JSON'
{"timeline":"timed","record":{"fps":30,"cursor":{"preset":"reel"},"path":"form-promo.mp4"},
 "steps":[
  {"action":"ui-fill","params":{"selector":"#name","value":"Alice","delayMs":60},"at":0},
  {"action":"ui-select","params":{"selector":"#interval","label":"5 minutes"},"at":1200},
  {"action":"ui-check","params":{"text":"Agree"},"at":2000},
  {"action":"mark","params":{"label":"save"},"at":2800},
  {"action":"ui-click","params":{"text":"Save","moveDurationMs":0},"at":2800},
  {"action":"ui-expect","params":{"selector":"#status","toHaveText":"Saved Alice"}},
  {"pauseMs":800}]}
JSON
tradinglead desktop ui-run --params-file batch.json --key run-1
tradinglead desktop record-status --tab TAB_ID --params '{"recordingId":"RETURNED_ID"}'   # until completed
```

**`ui-expect`** retries until it passes or times out and fails
`UI_EXPECT_FAILED` with `details.actual` (normalized text, value, count or
state). It is strict: several matches fail unless `nth` is given.
**Tracing** writes `~/.tradinglead-desktop/traces/trace-*/` with `trace.json`,
`steps.jsonl`, `screenshots/NNNN-before|after.jpg` and a script-free
`index.html`; screenshots add ~50-150 ms per action, so use
`screenshots:false` while recording.

## Dialogs, downloads, popups, network and record mode

Builds whose `desktop capabilities` list **`ui-codegen-start`** add these
actions. All need `ui-enable` on the tab and may omit `--tab`. Waits arm first
and then run an optional `trigger` step (`ui-click`, `ui-press`, `ui-key`,
`ui-type`, `ui-hover`, `ui-move`, `ui-scroll` or `ui-drag`), so the event
caused by that step is never missed. A wait with a trigger needs a retry key.

| Action | Params | Read/Write |
| --- | --- | --- |
| `ui-dialog` | **policy** `accept\|dismiss\|ask\|default`, `promptText`, `askTimeoutMs` (30000) | key |
| `ui-dialog-wait` | `timeoutMs` (10000), `trigger` -> `{dialogId, type, message, defaultPrompt?, handled}` | read (key with trigger) |
| `ui-dialog-respond` | **accept**, `promptText`, `dialogId` (answers an `ask` dialog) | key |
| `ui-download-wait` | `timeoutMs` (30000, whole transfer), `trigger` -> `{path, filename, size, mime, url, state}` | key |
| `ui-popup-wait` | `timeoutMs` (10000), `trigger` -> `{opened:"tab", tabId, url, openerTabId}`, `{opened:"window"\|"external", url}` | read (key with trigger) |
| `ui-wait-request` | **urlIncludes** or **urlRegex**, `method`, `timeoutMs`, `trigger` -> `{url, method, resourceType, startedAt}` | read (key with trigger) |
| `ui-wait-response` | as above plus `status`, `body` (JSON/text ≤256 KB) -> `{url, status, mimeType, mocked, timing, body?}` | read (key with trigger) |
| `ui-route` | **urlIncludes**/**urlRegex**, `method`, **respond** `{status, headers, json\|body, contentType}`, `times`, `delayMs` -> `{routeId, active}` | key |
| `ui-unroute` | `routeId` or `all:true` | key |
| `ui-codegen-start` | `path` (.json name or new home path), `maxEvents` (2000) | key |
| `ui-codegen-stop` | `discard` -> `{path, run, steps, summary, durationMs, masked, skipped, warnings}` | key |

- **Dialogs:** with no `ui-dialog` policy, dialogs stay native. `accept` and
  `dismiss` answer alert/confirm/prompt without a native box (and leave or stay
  on a beforeunload prompt). `ask` holds the page like a real modal until you
  call `ui-dialog-respond`; read it with `ui-dialog-wait` while the click is
  still pending. `default` restores native dialogs.
- **Downloads** go to `~/.tradinglead-desktop/downloads/`. Only the next
  download from this tab is captured; others use the normal save flow.
- **Popups:** an internal `window.open` becomes a new tab that is then active,
  so control on the opener ends; call `ui-enable` on the returned `tabId`.
- **Mocks** are for clean paper demo data on XHR/fetch only, on this tab only.
  Auth/session/token, payment, and broker/order/trade URLs (and broker,
  payment or sign-in hosts) are refused (`UI_ROUTE_DENIED`) and never mocked
  or read. At most 20 routes (`UI_ROUTE_LIMIT`). They clear on `ui-unroute`,
  `ui-disable`, loss of control, tab close and cross-origin navigation.
- **Record mode** captures the person's real clicks, typing, wheel scrolls,
  drags and keys while a "Recording your actions" badge is shown; your own
  ui-* input is skipped. `ui-codegen-stop` returns a `ui-run` batch
  (`timeline:"timed"`, `at` offsets, `moveDurationMs` so presses land on time)
  plus readable `summary` lines. Targets prefer `data-demo-id`/`data-testid`,
  role+name, exact text, then CSS; chart canvas input uses x,y. Password, OTP
  and payment fields are never read, and their steps are left to the person.
  Cross-origin iframes and hover-only movement are not recorded. If control
  ends first, the recording is saved and the next `ui-codegen-stop` returns it.

```bash
tradinglead desktop ui-dialog --params '{"policy":"accept"}' --key dlg-1
tradinglead desktop ui-dialog-wait --params '{"trigger":{"action":"ui-click","params":{"text":"Delete layout"}}}' --key dlg-2
tradinglead desktop ui-route --params '{"urlIncludes":"/api/screener","respond":{"json":{"rows":[]}},"times":1}' --key mock-1
tradinglead desktop ui-wait-response --params '{"urlIncludes":"/api/screener","body":true,"trigger":{"action":"ui-click","params":{"text":"Run"}}}' --key wait-1
tradinglead desktop ui-codegen-start --key rec-1    # the person demonstrates the flow
tradinglead desktop ui-codegen-stop --key rec-2     # -> run.params is a ready ui-run batch
```


## Demo browser (any website)

Builds whose `desktop capabilities` list **`demo-browser-open`** add a separate
app window for recording polished demos of **any https website** (tabId
`demo:main`). There is no per-site prompt.

- **Isolated session:** it uses its own persistent partition `persist:tl-demo`.
  The TradingLead login, broker tokens and app cookies are never reachable from it.
- **Logins persist:** the person can sign in by hand inside the window, and that
  login survives app restarts.
- **No app APIs in the page:** there is no preload, and contextIsolation,
  sandbox and nodeIntegration-off are all on.
- **No chart tab needed:** it works without a `/charts` tab, trusted origin or
  account. Do not use it for TradingLead itself; chart tabs keep their own rules.

| Action | Params → result |
| --- | --- |
| `demo-browser-open` | `{url?, width?, height?, timeoutMs?}`. `url` defaults to `about:blank`; a bare host gets `https://`. `width` 320–3840 and `height` 240–2160 go together and set the **page viewport** in CSS px. `timeoutMs` is 0–60000 (default 15000). Creates/shows/focuses the window and loads the URL. → status fields + `{created, timedOut, loadError?}` |
| `demo-browser-navigate` | `{url, timeoutMs?}` → status + `{timedOut, loadError?}` |
| `demo-browser-history` | `{direction:"back"\|"forward"\|"reload"\|"stop"}` → status + `{dispatched, direction}` (`UI_NO_HISTORY` if there is nowhere to go) |
| `demo-browser-status` | `{}` (read, no key) → `{tabId, open, visible, focused, url, title, loading, canGoBack, canGoForward, bounds:{x,y,width,height}, contentSize:{width,height}, partition, lastBlocked?:{url, reason, at}}` |
| `demo-browser-close` | `{}` → `{tabId, closed, open:false, note}`. Ends control and recording. Logins stay. |
| `demo-browser-clear-session` | `{confirm:true}` (required) → status + `{cleared:true}`. Wipes cookies, storage and cache of the demo partition only, which logs the person out of every demo site. Only call this when asked. |

These actions only address `demo:main`. With the CLI, omit `--tab` (it
defaults to `demo:main`); any other tab gets `INVALID_REQUEST`. Mutations
need `--key`. `navigate`, `history` and `status` are allowed as `ui-run` steps.
`ui-enable`, `ui-status` and `ui-disable` still need an explicit
`--tab demo:main`.

**URL policy**: `https://` is allowed for any host. `http://` is allowed only for localhost, `*.localhost`, `127.x`,
`::1`, `10.x`, `172.16–31.x` and `192.168.x`. `about:blank` is also allowed. Everything else is refused with
`UI_URL_BLOCKED`: `file:`, `javascript:`, `data:`, `blob:`, `chrome:`, `devtools:`, `view-source:`, other `about:`
pages and URLs with embedded credentials.
- The same check runs on in-page navigations and main-frame redirects. A blocked
  one stays on the current page and shows up in `lastBlocked`.
- `window.open` and `target=_blank` load in the **same window**. No popup
  windows are created.
- A site's "Leave page?" (`beforeunload`) prompt never blocks navigate, close or
  app quit here. If a navigation is still cancelled, it returns
  `loadError:"NAVIGATION_CANCELLED"`.
- Single page: there are no demo tabs.

**Control**: `ui-enable --tab demo:main` needs no trusted origin. It gives full interaction: clicks, typing, scroll,
`ui-run`, `ui-cursor` (badge/frame/ripple), `ui-highlight`, `ui-set-viewport`, screenshots and
`record-start/mark/status`.
- Off-origin links are ordinary clicks here. Navigation is guarded by the URL
  policy above.
- Control and an active recording **survive page loads**, including cross-site
  ones, and the agent cursor is redrawn.
- Control is revoked when the page reaches a refused URL, when the window is
  closed, hidden or minimised, and on `ui-disable`, Help > Stop AI control or
  Ctrl/Cmd+Shift+Escape.
- The page guards still apply. Password, OTP, credential, card, payment,
  sign-in and broker controls are human-only (`UI_HUMAN_ONLY`), and their values
  are never read. The person signs in by hand.

**Denied by default**: every permission request (camera, mic, geolocation, notifications, clipboard-read, MIDI…),
screen/device pickers (HID/serial/USB) and **downloads**. Downloads are cancelled, so `ui-download-wait` won't see a
file here. Media does not autoplay without a gesture.

**Viewport**: prefer `demo-browser-open {width,height}`. It sizes the real window content, so it persists across page
loads. `ui-set-viewport` emulation also works, but a full navigation resets it.

**Worked example** (CLI; HTTP callers POST the same `{action, tabId, params, idempotencyKey}` to
`/api/desktop` using `~/.tradinglead-desktop/api.json` for the port and token):

```bash
tradinglead desktop demo-browser-open --params '{"url":"https://www.wikipedia.org","width":1280,"height":720}' --key d1
tradinglead desktop ui-enable --tab demo:main --key d2
tradinglead desktop ui-cursor --tab demo:main --params '{"show":true,"preset":"reel","badge":true,"frame":true}'
tradinglead desktop ui-run --tab demo:main --key d3 --params '{
  "record":{"path":"site-demo.mp4","fps":30,"leadInMs":300,"tailMs":600},
  "steps":[{"action":"ui-click","params":{"selector":"#searchInput"},"waitAfterMs":300},
           {"action":"ui-type","params":{"selector":"#searchInput","text":"Screen recording"},"waitAfterMs":300},
           {"action":"mark","params":{"label":"zoom-here"}},
           {"action":"ui-click","params":{"selector":"button[type=submit]"},"waitAfterMs":2000},
           {"action":"ui-scroll","params":{"deltaY":300},"waitAfterMs":500}]}'
# → {..., recording:{recordingId,...}}
tradinglead desktop record-status --tab demo:main --params '{"recordingId":"rec-..."}'
# poll until state:"completed" → {path:"~/.tradinglead-desktop/recordings/site-demo.mp4", eventsPath:".../site-demo.events.json", ...}
```

The events sidecar has the same format as on chart tabs (`t` seconds, `x`/`y` in
video pixels, `mark` cues).

### Scraping and network capture (Demo browser)

These five actions work on **`demo:main` only** (the CLI default for them); any
other tab gets `INVALID_REQUEST`. Each one needs `ui-enable --tab demo:main`.
- **Denylist:** every action reuses the `ui-route` denylist:
  - auth/session/token/OTP
  - payment providers (Razorpay, Stripe, Cashfree, PayU, PayPal, …)
  - identity providers and sign-in hosts
  - broker logins and APIs (Fyers, Zerodha/Kite, Upstox, Angel/SmartAPI, Dhan,
    Alpaca, …) and order/trade endpoints
  - TradingLead/ContentLead account, key and agent-access paths
- **Output:** files are private (mode 0600) and never overwritten
  (`UI_PATH_EXISTS`). A bare name goes to `~/.tradinglead-desktop/captures` or
  `~/.tradinglead-desktop/scrapes`. An absolute path must be new, inside your
  home folder, and not in a hidden or system folder.
- **Recommended flow:** capture first to find the site's JSON API. Then call that
  API with `ui-page-fetch`. Use `ui-scrape` only when the data exists only in
  the HTML. Respect the site's terms and robots rules, and keep the polite
  delays.

| Action | Params → result |
| --- | --- |
| `ui-network-capture-start` | `{urlIncludes?\|urlRegex? (≤300), resourceTypes?:["document","xhr","fetch","script","stylesheet","image","media","font","websocket","eventsource","manifest","ping","preflight","other",…], bodies?:true, maxBodyBytes?:1024..5242880 (1048576), maxEntries?:1..20000 (5000), websocket?:false, path? (.jsonl)}` → `{captureId, path, running:true}`. Not a mutation: no retry key, and it works while paused. One capture at a time (`UI_BUSY`). |
| `ui-network-capture-status` | `{captureId}` (read) → `{captureId, running, path, entries, requests, websocketFrames, denied, bodies, bytes, droppedPending, startedAt, stoppedAt?, stoppedReason?, harPath?}` |
| `ui-network-capture-stop` | `{captureId, har?:false}` → final status. `har:true` also writes `<name>.har` (HAR 1.2, same redactions) next to the JSONL and adds `harPath`. This also works after an auto-stop. |
| `ui-page-fetch` | `{url (absolute, or relative to the page), method?:"GET"\|"POST"\|"PUT"\|"PATCH"\|"DELETE"\|"HEAD"\|"OPTIONS", headers?:{…}(≤50), body?:string\|JSON (≤1 MB; not for GET/HEAD), responseType?:"json"\|"text", timeoutMs?:1000..120000 (30000), path?}` → `{url, status, statusText, ok, redirected, headers, contentType, size, body? (≤256 KB inline; parsed JSON), bodyTruncated?, jsonError?, bodyOmitted?, path?}`. `path` saves the full raw body (≤50 MB). Its extension must be one of .json/.txt/.html/.csv/.xml/.jsonl/.js/.md/.bin. |
| `ui-scrape` | `{item, fields:{name:{selector?, attr?:"text"\|"href"\|"src"\|"value"\|<attr>, all?}} (1..50), next?:{selector}\|{scroll:true, settleMs?:1500}\|{urls:[…≤100]}, maxPages?:1..100 (5), maxItems?:1..50000 (1000), waitFor?, delayMs?:300..60000 (800), timeoutMs?:1000..60000 (15000/page), format?:"jsonl"\|"csv"\|"json", path?, dedupeBy?}` → `{path, format, items, pages, stoppedReason, protectedSkipped, duplicates, urls, sample (first 5)}` |

**Capture** writes one JSONL line per finished request with these fields: `{type:"request", ts, method, url, status,
statusText, mimeType, resourceType, requestHeaders, responseHeaders, postData?, body?, bodyTruncated?, bodySize?,
bodyOmitted?, timing:{startedAt, durationMs, ttfbMs, dnsMs, connectMs, sslMs, sendMs, waitMs, receiveMs}, fromCache,
fromServiceWorker, encodedDataLength, protocol, redirectedTo?, failed?:{errorText, canceled}}`.
- **WebSocket:** `websocket:true` adds `websocket`, `websocket-frame` (text
  payload only, ≤16 KB, truncated) and `websocket-closed` lines.
- **Bodies:** stored by default for JSON/text `xhr`, `fetch` and `document`
  responses, and for any type you list in `resourceTypes`. Otherwise
  `bodyOmitted` is `"type"`, `"binary"`, `"disabled"` or `"unavailable"`.
- **Redaction:** these headers become `"REDACTED"`:
  - `Authorization`, `Cookie`, `Set-Cookie`, `Proxy-Authorization` and
    `x-csrf*`/`x-xsrf*`
  - token, api-key, session and signature headers

  So do secret-looking query values (`token`, `key`, `sig`, `code`, `session`,
  `password`…) and password/OTP/card keys inside JSON or form post data.
  **Response bodies are kept as-is**, so treat the files as private.
- **Denylisted URLs:** metadata only: `denied:true` and `bodyOmitted:"denied"`,
  with no headers and no post data.
- **Navigation:** a capture keeps running across page loads, including
  cross-site ones.
- **Auto-stop:** a capture stops by itself with a `stoppedReason`. A manual stop
  gives `stopped`. The auto-stop reasons are:
  - `control-ended` (ui-disable, or control lost)
  - `window-closed`
  - `max-entries`
  - `max-bytes` (200 MB file cap)
  - `write-failed`
  - `attach-failed`

**Page fetch** runs `fetch(url, {credentials:"include"})` in the page's main world, so the person's login cookies and
the site's CORS rules apply exactly as they do for the site's own scripts.
- **URL rules:** the URL must pass the Demo browser URL policy
  (`UI_URL_BLOCKED`) and must not be on the denylist (`UI_URL_DENIED`). A
  redirect to a denylisted URL drops the body (`bodyOmitted:"denied"`).
- **Refused headers:** `Cookie`, `Authorization`, `Proxy-Authorization` and
  `Set-Cookie`.
- **Errors:** `UI_TIMEOUT`, `UI_FETCH_FAILED` (network/CORS) and
  `UI_RESPONSE_TOO_LARGE` (over 50 MB with `path`).
- **Page scripts:** the page's own scripts could observe or patch `fetch`, so
  only use sites you trust.

**Scrape** reads each field inside every `item`. A field without `selector` reads the item itself; `all:true` returns a list.
- **Protected values:** password/OTP/card values (protected fields) are never
  read. They come back as `null` and are counted in `protectedSkipped`.
- **`next` modes:**
  - **`{selector}`:** a link loads through the URL policy and the denylist. A
    button is clicked like `ui-click`, and the scraper waits for the URL, the
    item count or the first item to change.
  - **`{scroll:true}`:** scrolls to the bottom and stops when no new items
    appear.
  - **`{urls}`:** visits exactly those pages, in order.
- **Pacing:** `delayMs` (minimum 300 ms) is applied between pages. `waitFor`
  waits for a selector on each page.
- **Output:**
  - CSV quotes fields RFC-4180 style and joins lists with `" | "`.
  - Formula-like values get a `'` prefix. These are values that start with `=`,
    `+`, `@`, or a `-` that isn't part of a number.
  - `dedupeBy` drops repeats of that field. Scroll mode always drops identical
    rows.
- **`stoppedReason`:** one of:
  - `max-items`, `max-pages`
  - `no-next`, `next-disabled`, `next-protected`, `next-denied`, `next-blocked`,
    `next-repeat`, `next-no-change`
  - `no-new-items`, `urls-done`, `wait-timeout`, `control-lost`

  A failure after some items keeps the partial file and reports `error:<code>`.
- **Steps:** `ui-page-fetch` and `ui-scrape` also work as `ui-run` steps.

```bash
tradinglead desktop demo-browser-open --params '{"url":"https://shop.example.com"}' --key s1
tradinglead desktop ui-enable --tab demo:main --key s2
tradinglead desktop ui-network-capture-start --params '{"resourceTypes":["xhr","fetch"],"path":"shop.jsonl"}'
# browse or scroll the site (ui-scroll / ui-click --tab demo:main), then:
tradinglead desktop ui-network-capture-stop --params '{"captureId":"cap-…","har":true}'
# → {path:"~/.tradinglead-desktop/captures/shop.jsonl", harPath:".../shop.har", requests, denied, bodies, …}
tradinglead desktop ui-page-fetch --params '{"url":"/api/products?page=2","responseType":"json"}' --key s3
# → {status:200, ok:true, headers:{…, "set-cookie":"REDACTED"}, body:{items:[…]}}
tradinglead desktop ui-scrape --key s4 --params '{"item":".product","fields":{"title":{"selector":"h2"},"url":{"selector":"a","attr":"href"},"price":{"selector":".price"}},"next":{"selector":"a.next"},"maxPages":10,"format":"csv","path":"products.csv","dedupeBy":"url"}'
# → {path:"~/.tradinglead-desktop/scrapes/products.csv", items:87, pages:10, stoppedReason:"max-pages", sample:[…]}
```

**Limits:**
- **Not captured:** requests from cross-origin iframes (OOPIFs) and from workers.
- **Small buffers:** `ui-wait-idle`/`ui-wait-response` while a capture runs may
  re-enable Network with small buffers. Bodies over that limit then come back as
  `bodyOmitted:"unavailable"`.
- **Scrape scope:** only the main document is scraped. There are no iframes and
  no shadow-DOM item selectors.
