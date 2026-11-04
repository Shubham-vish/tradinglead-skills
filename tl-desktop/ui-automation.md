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
  description says "without approval dialogs or a time limit". `ui-enable`
  starts control without a human dialog; `expiresAt:null` means no timeout.
  An active account is required, but no separate cloud-write checkbox.
  The matching frontend enables authenticated workspace writes automatically.
- **Installed 0.1.9/0.1.10:** both existing write grants and initial human
  approval are still required; approval lasts ten minutes. Do not claim a
  skill update removed those native dialogs or approve them programmatically.

Closing the visible AI control window stops control. The person can also use
**Help > Stop AI control and recording** or **Ctrl/Cmd+Shift+Escape**.
Tab/account/navigation changes and pausing access invalidate control. Inspect the
new context before starting again; never undo an explicit user pause or Stop.

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
tradinglead desktop ui-scroll --tab TAB_ID --params '{"selector":"ACTUAL_SCROLL_CONTAINER","deltaY":400}' --key scroll-1
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
- Scroll: `deltaY` and optional `deltaX`, each -2000..2000; positive down/right.
- Type: nonempty Unicode `text`, maximum 16000 characters; `replace` defaults
  false. Use enabled text inputs, textareas or contenteditable editors.
- Key: `Enter`, `Escape`, `Tab`, `Backspace`, `Delete`, `ArrowLeft`, `ArrowRight`,
  `ArrowUp`, `ArrowDown`, `Home`, `End`, `PageUp`, `PageDown`; optional `shift`.
  No system shortcuts, clipboard commands, file-picker input or arbitrary keys.
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

## Record only the selected tab

```bash
tradinglead desktop record-start --tab TAB_ID --params '{"durationMs":30000,"fps":5}' --key record-1
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

- Duration: 1000..600000ms; default 60000ms. FPS: 1..10; default 5.
- Video-only VP8 WebM; no microphone, system audio or whole-desktop capture.
- At most 1920x1080, aspect ratio preserved; one recording at a time.
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
