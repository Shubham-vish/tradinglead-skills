# tl-desktop command reference

Source-only snapshot from an isolated frontend registry; installed Desktop execution is not certified. Rediscover live availability before use.
Use explicit tab targeting and inspect the final JSON status. Do not guess IDs or grant permissions.

Do not infer grant permissions from `mutates`: Desktop discovery can omit structured grant metadata. Read [tl-desktop](../tl-desktop/SKILL.md) for the verified local-change versus cloud-watchlist access rules.

## `replay.setOverlayLayout`

Dock/hide replay overlays in this tab session only. Does not change replay, orders or chart history.

Retry key: **not required**. External local-assistant access is still required.
Effects: **panel**. These are possible consequences, not grants; optional write variants still require approval and a retry key.

| Parameter | Contract |
| --- | --- |
| `toolbar` | Optional top-left\|top-right\|bottom-left\|bottom-right\|corner\|hidden; corner restores the last/default corner. Hidden toolbar keeps the header replay controls live. |
| `widget` | Optional top-left\|top-right\|bottom-left\|bottom-right\|corner\|hidden\|collapsed |

## `ui.waitIdle`

Wait until visually settled: chart history/replay/feed discovery done, no busy spinners or finite animations, fonts loaded, 2 stable frames. Returns {idle,waitedMs,pending}; TIMEOUT lists pending.

Retry key: **not required**. External local-assistant access is still required.
Effects: **none**. These are possible consequences, not grants; optional write variants still require approval and a retry key.

| Parameter | Contract |
| --- | --- |
| `timeoutMs` | Optional 100-60000, default 8000. |
| `scope` | Optional data-demo-id subtree. |

## `ui.listTargets`

List named demo targets {id,label,role,visible,rect{x,y,w,h} CSS px,viewport}; PII boxes have redact:true.

Retry key: **not required**. External local-assistant access is still required.
Effects: **none**. These are possible consequences, not grants; optional write variants still require approval and a retry key.

| Parameter | Contract |
| --- | --- |
| `scope` | Optional data-demo-id subtree. |

## `ui.getTargetRect`

Rect of one demo target, first visible unless nth. TARGET_NOT_FOUND/TARGET_HIDDEN.

Retry key: **not required**. External local-assistant access is still required.
Effects: **none**. These are possible consequences, not grants; optional write variants still require approval and a retry key.

| Parameter | Contract |
| --- | --- |
| `id` | Target id from ui.listTargets. |
| `nth` | Optional 0-based match index. |

## `demo.prepare`

Ephemeral presentation mode: hide tours/toasts/banners, optionally freeze clock labels, redact PII, hide cursor. Nothing persisted; no write grant. Returns previous; demo.reset restores.

Retry key: **not required**. External local-assistant access is still required.
Effects: **ui**. These are possible consequences, not grants; optional write variants still require approval and a retry key.

| Parameter | Contract |
| --- | --- |
| `hideCrosshair` | Optional boolean; suppress plot hover in presentation mode. |
| `hideWarnings` | Optional boolean, default true; capacity and transient replay status only. |
| `tradeLabelScale` | Optional 1..3, default 1; temporary trade label multiplier. |
| `hideTours` | bool, default true |
| `hideToasts` | bool, default true |
| `hideCookieBanner` | bool, default true |
| `freezeClock` | ISO time for clock labels |
| `redact` | bool |
| `cursor` | bool; false hides it |

## `demo.reset`

Leave presentation mode; clears redaction and frozen clock.

Retry key: **not required**. External local-assistant access is still required.
Effects: **ui**. These are possible consequences, not grants; optional write variants still require approval and a retry key.

Parameters: `{}`.

## `demo.redact`

Blur PII (account, contact, broker ids, balances) plus optional selectors. Ephemeral.

Retry key: **not required**. External local-assistant access is still required.
Effects: **ui**. These are possible consequences, not grants; optional write variants still require approval and a retry key.

| Parameter | Contract |
| --- | --- |
| `enable` | Required bool |
| `selectors` | Optional up to 20 extra CSS selectors. |

## `workspace.getState`

Read this tab's account/permission state and screening source.

Retry key: **not required**. External local-assistant access is still required.
Effects: **none**. These are possible consequences, not grants; optional write variants still require approval and a retry key.

Parameters: `{}`.

## `workspace.getActivity`

Read bounded command status/error-code history and active command count. Never returns credentials, source or command arguments.

Retry key: **not required**. External local-assistant access is still required.
Effects: **none**. These are possible consequences, not grants; optional write variants still require approval and a retry key.

Parameters: `{}`.

## `workspace.setPanel`

Select a /charts bottom panel and expand/minimize it. Right-docked Backtesting toggles only its side panel unless dock is given. Returns expected placement; verify workspace.getState panels.

Retry key: **not required**. External local-assistant access is still required.
Effects: **panel**. These are possible consequences, not grants; optional write variants still require approval and a retry key.

| Parameter | Contract |
| --- | --- |
| `panel` | peers\|watchlists\|futures\|backtesting\|paper-trading\|intelligence\|indicators; simulation is a legacy alias |
| `expanded` | Optional boolean, default true. |
| `dock` | Optional bottom\|right, backtesting only: place it and select its tab. right fails DOCK_UNAVAILABLE under 720px. |

## `workspace.openSidebar`

Open/collapse a /charts right-sidebar section incl. More items. Layout only, no write grant. Confirm via workspace.getState sidebar.

Retry key: **not required**. External local-assistant access is still required.
Effects: **panel**. These are possible consequences, not grants; optional write variants still require approval and a retry key.

| Parameter | Contract |
| --- | --- |
| `panel` | watchlists\|indices\|heatmap\|scanner\|grid\|patterns\|alerts\|research\|dataWindow\|paperTrading\|contests |
| `expanded` | Optional boolean, default true |

## `workspace.setTheme`

Set this browser's app light/dark theme (same as Settings > Theme). Local UI preference only. Returns previous for restoring.

Retry key: **not required**. External local-assistant access is still required.
Effects: **write**. These are possible consequences, not grants; optional write variants still require approval and a retry key.

| Parameter | Contract |
| --- | --- |
| `theme` | light\|dark |

## Native Desktop controls

Run `node cli.cjs desktop ACTION --tab ACTUAL_TAB_ID` from the Desktop repository. App-level `getOrigin`, `setOrigin`, `logs`, `services` and `appInfo` take no `--tab`; `screenshot` takes an optional `--tab` (default: active tab); `setOrigin`, `logs` and `screenshot` take `--params JSON`.

- `status`: Read native readiness and reported permission state without requiring AI access.
- `activate`: Focus this explicit trusted tab without navigating or reloading it.
- `open-access`: Request the in-place permission panel. Only the user can enable grants; poll status for accessPanelOpen.
- `reconnect`: Request registration retry using existing grants. Disabled access opens the permission panel instead. Poll status.
- `getOrigin`: Read the app website origin, the cloud origin, whether it is local, and the trusted origins.
- `setOrigin`: Switch the website origin to "cloud"/https://tradinglead.in or a loopback dev server with an explicit port. params: { origin, path?, navigate? }. Navigates the active tab; poll tabs and desktop status.
- `screenshot`: Capture a PNG of the given tab (default: active trusted tab). params: { selector? } crops to the first matching element. Returns { path, bytes, width, height, tabId }; the file is private to the local user.
- `logs`: Read-only, redacted tail of Desktop diagnostics. params: { kind: "events"|"bars", tail?: 1-200 (default 50) }.
- `services`: Read feed registry, sidecar (no credentials), Python indicator runtime and updater status.
- `appInfo`: Read app version, Electron, build channel, dev mode, origin, agent protocol and per-tab catalog registration (entries, hash, rejected).
- `ui-enable`: Start prompt-free UI control on this active chart tab without approval dialogs, floating control windows or a time limit. Stop through ui-disable or Help > Stop AI control and recording. Ordinary unmarked controls are supported; automationScope is informational. Requires local assistant access and an account. Protected controls remain blocked. The demo browser (tabId "demo:main", see demo-browser-open) is enabled on any allowed http(s) page without the chart/account requirements, with full interaction and recording, and keeps control across its own page navigations. params: {}. Retry key required.
- `ui-disable`: Revoke UI control and stop recording on this tab. params: {}. Retry key required.
- `ui-status`: Read UI-control state for this explicit tab. expiresAt is null; control has no time limit.
- `ui-inspect`: List up to 200 visible non-sensitive controls with CSS selectors, frame paths and viewport rectangles. params: {selector?,frames?:CSS[]}. Requires ui-enable; never returns input values. automationScope:false is not a blocker.
- `ui-click`: Trusted click with Playwright-style actionability (waits until visible, enabled, uncovered and stable; scrolls into view) and a smooth human-like pointer move from the last position. params: {selector|text|role,name?|testId|target OR x,y, frames?, nth?, offset?:{x,y} (from target top-left), button?:left|right|middle, clickCount?:1..3, modifiers?:[Alt|Control|Meta|Shift], moveDurationMs?:0..10000 (300 after the first move), steps?:1..240, holdMs?:0..2000, timeoutMs?:0..60000 (5000)}. Targets: CSS selector string, or {selector|text|role(+name)|testId, exact?, nth?, frames?} (pierces open shadow roots; text matches innermost elements). CSS-pixel coordinates; explicit retry key and active UI control required.
- `ui-drag`: Smooth trusted drag (press, eased curved moves, release); works on canvas charts. params: {from:target|{x,y}, to:target|{x,y}|{dx,dy}, frames?:CSS[], durationMs?:0..30000 (600), steps?:1..240, holdMs?:0..5000, button?:left|right|middle, modifiers?, timeoutMs?}. Coordinates are top-level viewport CSS pixels, including with frames. The path is checked for protected controls before the button is held. Retry key required.
- `ui-hover`: Smoothly move the pointer over an actionable target. params: {target fields OR x,y, frames?, offset?, moveDurationMs?, steps?, timeoutMs?}. Retry key and active UI control required.
- `ui-move`: Smooth pointer move (no click) to a point or target, e.g. to guide a recording. params: {x,y OR target fields, durationMs?:0..10000 (300), steps?:1..240, offset?, timeoutMs?}. Retry key required.
- `ui-scroll`: Trusted mouse-wheel at a target or point (chart zoom/pan, nested scroll containers), optionally split into smooth steps; or scrollIntoView for a target. params: {target fields OR x,y (default: last pointer or viewport centre), frames?, deltaY?, deltaX? (-20000..20000; positive deltaY scrolls down / zooms out a chart; an omitted delta is 0), durationMs?:0..10000, steps?:1..240, modifiers?:[Shift], scrollIntoView?:boolean}. Retry key and active UI control required.
- `ui-type`: Insert Unicode text into an editable target, or into the focused editable element when no target is given. params: {selector|target OR x,y (optional), frames?, text, replace?:boolean, delayMs?:0..1000 (per-character typing for recordings), showKeys?:boolean (show the text in the keystroke pill), timeoutMs?}; max 16000 characters. No credentials or file inputs. Retry key and active UI control required.
- `ui-key`: Press a safe navigation/edit key at a focusable target, or with no selector/x,y (or a non-focusable target) at the page's currently focused element, e.g. Escape to close a menu (result windowLevel:true). params: {selector OR x,y (optional),frames?,key:Enter|Escape|Tab|Backspace|Delete|ArrowLeft|ArrowRight|ArrowUp|ArrowDown|Home|End|PageUp|PageDown,shift?:boolean,global?:boolean (window-level key, no target; never needs a focusable element)}. No OS shortcuts. Retry key and active UI control required.
- `record-start`: Record only this visible chart tab, no audio or approval dialog. Requires local assistant access and an account; a visible Stop & save controller is shown. engine "capture" (default): WebM, params {durationMs?:1000..600000,fps?:1..60 (30),scale?:0.25..4|"native",selector?:CSS crop}, max 64MiB. engine "screencast" (recommended for promo videos): native device-pixel CDP screencast assembled into a constant-frame-rate H.264 MP4 (yuv420p, crf 18, +faststart) or WebM with ffmpeg (else the JPEG frames + frames.json are returned), params {engine:"screencast", durationMs?|maxDurationMs?:1000..600000 (60000; safety auto-stop), fps?:1..60 (30; use 30 or 60), format?:mp4|webm|frames, path? (file name or absolute path in your home folder), clip?:{x,y,width,height} CSS px OR target?:selector|{selector|text|role,name?|testId,nth?} (crop), cursor?:true (default)|false|{preset?:reel|subtle|off, style?, size?, color?, ripple?, rippleColor?, rippleSize?, keys?, badge?, frame?} (fake cursor + click ripples while recording; badge/frame are opt-in; the previous cursor state is restored afterwards), everyNthFrame?:1..10, maxWidth?/maxHeight?:100..7680 (default native pixels), quality?:1..100 (85), keepFrames?:boolean}. Agent UI actions and record-mark calls are logged to <video>.events.json (t in seconds on the video timeline, x/y in video pixels). Returns recordingId; auto-stops on duration/tab changes. Retry key required.
- `record-stop`: Stop/finalize a recording. params: {recordingId}. Retry key required. Poll record-status until completed (screencast: stopping -> encoding -> completed with path, frames, durationMs); failed captures are explicit.
- `record-status`: Read recording progress/completion/private file path. params: {recordingId}. Explicit tab required. A completed screencast adds width, height, fps, frameCount, videoDurationMs, duplicatedFrames, skippedFrames, droppedFrames and eventsPath.
- `record-mark`: Add a labelled marker to the active screencast's events.json (e.g. "order-filled", "zoom-here") for the video editor. params: {label:1..80 chars, data?:JSON object <=2KB, x?,y? (viewport CSS px)}. Fails RECORDING_NOT_ACTIVE when this tab is not recording. Returns an approximate t. No retry key; does not need ui-enable.
- `ui-query`: Find elements with bounding boxes (view-relative CSS px), visibility, enabled state and text. params: {selector|text|role,name?|testId|target, exact?, nth?, frames?, includeHidden?:boolean, limit?:1..200 (50)}. Targets: CSS selector string, or {selector|text|role(+name)|testId, exact?, nth?, frames?} (pierces open shadow roots; text matches innermost elements). Protected controls are listed without text. Requires ui-enable; no retry key.
- `ui-wait-for`: Wait until a target is visible|hidden|attached|detached. params: {target fields, state?:visible (default)|hidden|attached|detached, timeoutMs?:0..60000 (10000)}. Fails UI_TIMEOUT. Requires ui-enable; no retry key.
- `ui-wait-idle`: Wait until network requests are quiet (EventSource/WebSocket ignored) and two animation frames have rendered. params: {timeoutMs?:0..60000 (10000), idleMs?:0..10000 (500), maxInflight?:0..20 (2)}. Returns {idle, timedOut?}. Requires ui-enable; no retry key.
- `ui-press`: Press a key with optional modifiers at a target or the focused element. params: {key: Enter|Escape|Tab|Backspace|Delete|Space|Arrow*|Home|End|PageUp|PageDown|a-z|0-9|punctuation, modifiers?:[Alt|Control|Meta|Shift] (Control/Meta only with z, y, a), selector|target?, frames?, global?:boolean (window-level key such as Escape to close a menu; no target, never fails for lack of a focusable element), showKeys?:boolean (keystroke pill; default from ui-cursor keys), repeat?:1..50, delayMs?:0..1000}. Retry key required.
- `ui-screenshot`: Save a PNG/JPEG of this tab (viewport, target or clip). params: {target fields?|clip?:{x,y,width,height}, format?:png|jpeg, quality?:1..100 (jpeg), scale?:0.1..4, path? (file name in the screenshots folder, or absolute path in your home folder; never overwrites)}. Returns {path, bytes, width, height}. Needs only an active connected chart tab; no retry key.
- `ui-set-viewport`: Emulate a fixed viewport for consistent recording framing (CDP device metrics), or with resizeWindow:true resize the app window so the tab view matches. params: {width:200..7680, height:150..4320, deviceScaleFactor?:0 (native)|0.5..4, resizeWindow?:boolean}. Emulation resets on ui-reset-viewport, ui-disable, reload/full navigation (not same-document route changes) or tab change. Retry key required.
- `ui-reset-viewport`: Clear viewport emulation. params: {}. Retry key required.
- `ui-cursor`: Show or hide a visible fake cursor that follows agent pointer input, with click effects (filled pulse + expanding ring; double ring for double clicks, dashed square for right clicks, a held ring during drags, press scale). Screencast record-start turns it on by default. pointer-events:none; never intercepts input. params: {show:boolean, preset?:reel (28px arrow, big #FFD43B rings)|subtle|off (no effects), style?:arrow|dot|ring, size?:8..64 (24), color?:#rrggbb, ripple?:boolean, rippleColor?:#rrggbb (#FFD43B), rippleSize?:16..200 (56), keys?:boolean (show a keystroke pill such as "⌘ Z" or "Esc" for ui-press), badge?:boolean|{text?:1..24 chars plain text ("AI"), color?:#rrggbb (rippleColor)} (opt-in sparkle + "AI" pill that follows the cursor; off by default and in every preset, shown only for true or an object), frame?:boolean (false; thin glowing inset frame around the viewport while the cursor is shown)}. Requires ui-enable; no retry key.
- `ui-highlight`: Draw a temporary labelled box (pointer-events:none) around a target or rect for demos/debugging. params: {target fields OR rect:{x,y,width,height}, label?:<=80 chars, color?:#rrggbb, style?:box|reel (reel: thick #FFD43B glow box with a bold dark-text label), spotlight?:boolean (dims everything else), durationMs?:0..60000 (1500; 0 keeps it)} or {clear:true}. Labels stay 8px inside the viewport and flip below the box when there is no room above. Requires ui-enable; no retry key.
- `ui-mouse-leave`: Move the pointer out of the page (mouseleave) so chart crosshairs and hover tooltips clear before a clean shot; with a target, move just outside that element instead. The fake cursor fades out until the next pointer action. params: {target fields?}. Requires ui-enable; retry key required.
- `ui-wait-stable`: Wait until a region's pixels stop changing (e.g. a chart after load or symbol change) by comparing small screenshots. params: {target fields? | clip?:{x,y,width,height} (default viewport), stableMs?:100..10000 (500), intervalMs?:50..1000 (100), timeoutMs?:0..60000 (10000)}. Returns {stable, timedOut?, elapsedMs, samples}. Requires ui-enable; no retry key.
- `ui-chart-point`: Convert chart time/price to view CSS x,y for the active (or chartIndex) chart, or x,y back to time/price. Uses the website hook window.__tlChartCoords when present (exact bar snapping, split-chart grid; source:"hook"), else best effort over the TradingView widget. params: {time?:unix s|ms|ISO, price?, paneIndex?:0..20 (main series pane), chartIndex?:0..15 (hook only)} OR {x,y,chartIndex?}. Returns {x, y, inView, plot, paneIndex, barSpacing} plus chartIndex, barTime, estimated from the hook. Normal and log price scales only. Requires ui-enable; no retry key.
- `ui-run`: Run up to 300 ui-* steps in-process with no bridge round trips, so recordings have no pauses between actions. params: {steps:[{action, params?, waitAfterMs?:0..60000, at?:ms from batch start (timeline "timed")} | {pauseMs} | {action:"pause", params:{ms}} | {action:"mark", params:{label, data?, x?, y?}} (record-mark; no-op without a screencast)], timeline?:"sequential" (default)|"timed" (each step starts at its `at`; late starts are reported as lateMs), stopOnError?:true, maxDurationMs?:1000..600000 (120000), record?:{screencast record-start params (format, fps, path, cursor, clip, target, maxWidth, ...), leadInMs?:0..5000 (300), tailMs?:0..10000 (500)} (starts a screencast before step 0, marks "ui-run:start" at t=0, stops it after the last step; poll record-status)}. Every step is validated like the standalone action and checks UI control; losing control aborts the batch. Any registered ui-* action works as a step except ui-enable/ui-disable/ui-status/ui-run/record-start/record-stop/record-status/ui-trace-*. Returns per-step {index, action, status, scheduledMs, startMs, durationMs, lateMs, data|code+message}. A failed step (stopOnError) fails UI_RUN_FAILED with details.steps. One retry key for the whole batch.
- `ui-fill`: Playwright-style fill: click the field, select all and replace (or append with clear:false) using trusted keyboard input, so React-controlled inputs see real input events; "" clears. params: {target|selector|text|role,name?|testId, frames?, value, clear?:true, delayMs?:0..1000 (per character, for recordings), showKeys?, moveDurationMs?, timeoutMs?}. Returns the read-back value and verified. Text inputs, textareas and contenteditable only; never passwords. Retry key required.
- `ui-select`: Choose an option. Native <select>: sets value|label|index directly and fires input+change (no native popup in recordings). Custom dropdowns: clicks the trigger then the option (role option/menuitem, or exact visible text; index = nth visible option). params: {target fields, value|label|index, moveDurationMs?, timeoutMs?}. Retry key required.
- `ui-check`: Idempotently set a checkbox, radio, switch or aria-checked control (target the input, its label, or a wrapper with one checkbox). params: {target fields, checked?:true|false, moveDurationMs?, timeoutMs?}. Returns changed:false when already in that state; verifies after clicking (UI_CHECK_FAILED). Retry key required.
- `ui-upload`: Set files on a file input (or its label/button wrapper) through CDP DOM.setFileInputFiles. params: {target fields, files:[absolute paths] (1-10 existing regular files in your home folder, not hidden/system folders, <=50MiB each, <=100MiB total), timeoutMs?}. Retry key required.
- `ui-expect`: Web-first assertion that retries until it passes or times out (Playwright expect). params: {target fields, exactly one of toHaveText:string (whole normalized text) | toContainText:string | toBeVisible:boolean | toBeHidden:boolean | toBeEnabled:boolean | toHaveValue:string (inputs/selects; never protected fields) | toHaveCount:int | toBeChecked:boolean, ignoreCase?, timeoutMs?:0..60000 (5000), intervalMs?:20..2000 (100)}. Strict: one match unless nth (except toHaveCount; toBeHidden passes with no match). Fails UI_EXPECT_FAILED with details {expected, actual}. Requires ui-enable; no retry key; usable as a ui-run step.
- `ui-trace-start`: Start tracing every agent ui-* action on this tab (Playwright trace-lite): per step the action, params, result or error, timing, target boxes and (screenshots:true, default) before/after JPEG screenshots of page-changing actions; dom:true also saves a control list after each. params: {screenshots?:true, dom?:false, path? (new folder name under ~/.tradinglead-desktop/traces, or an absolute new folder in your home folder)}. Screenshots add ~50-150ms per action; turn them off for timed recordings. Ends on ui-trace-stop, ui-disable or tab change. Requires ui-enable; no retry key.
- `ui-trace-stop`: Stop the trace and write trace.json, steps.jsonl and a static index.html viewer (no scripts; all text escaped). params: {}. Returns {path, indexPath, tracePath, steps, failed, screenshots}. Returns the last finished trace again if it already ended. No retry key.
- `ui-dialog`: Set how this tab's JavaScript dialogs are handled. params: {policy: accept|dismiss|ask|default, promptText?:<=2000 chars (prompt() answer on accept; default: the prompt's default value), askTimeoutMs?:1000..60000 (30000; an unanswered "ask" dialog is dismissed)}. accept/dismiss answer alert/confirm/prompt at once (no native box) and leave/stay on beforeunload; "ask" holds the page (like a real modal) until ui-dialog-respond, beforeunload then shows the normal prompt to the human; "default" restores native dialogs. Without ui-dialog nothing changes. Cleared on ui-disable/navigation. Retry key required.
- `ui-dialog-wait`: Return the next dialog seen under the ui-dialog policy: {dialogId, type: alert|confirm|prompt|beforeunload, message, defaultPrompt?, handled: accepted|dismissed|pending|native, at}. Returns the oldest unreported dialog at once, else waits. params: {timeoutMs?:0..60000 (10000), trigger?:{action:ui-click|ui-press|ui-key|ui-type|ui-hover|ui-move|ui-scroll|ui-drag, params}} (trigger runs after arming and drops older dialogs; its retry key is not needed). Fails UI_DIALOG_POLICY_REQUIRED without ui-dialog, UI_TIMEOUT. Runs alongside the blocked trigger.
- `ui-dialog-respond`: Answer a pending "ask" dialog. params: {accept:boolean, promptText?:<=2000 chars, dialogId?}. Fails UI_NO_DIALOG when nothing is pending. Retry key required; runs alongside the click that opened the dialog.
- `ui-download-wait`: Capture the next download started by this tab and save it under ~/.tradinglead-desktop/downloads (other tabs and non-armed downloads are unchanged). params: {timeoutMs?:0..60000 (30000; covers the whole transfer), trigger?:{action,params} (e.g. a ui-click on the export button)}. Returns {path, filename, size, mime, url (redacted), state}. Max 512MiB. Retry key required.
- `ui-popup-wait`: Report the next window.open/target=_blank opened by this tab: {opened:"tab", tabId (the new tab), url, openerTabId} (internal URLs open as a new tab; it becomes active, which ends UI control here, so ui-enable that tab next), {opened:"window", url} (Indicator Studio presentation) or {opened:"external", url} (sent to the system browser). params: {timeoutMs?:0..60000 (10000), trigger?:{action,params}}. Fails UI_TIMEOUT. No retry key unless a trigger is given.
- `ui-wait-request`: Wait for the next request from this tab whose URL matches. params: {urlIncludes:string|urlRegex:string (<=300 chars), method?:GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS, timeoutMs?:0..60000 (10000), trigger?:{action:ui-click|ui-press|ui-key|ui-type|ui-hover|ui-move|ui-scroll|ui-drag, params}}. Returns {url (sensitive query values redacted), method, resourceType, startedAt}. No retry key unless a trigger is given.
- `ui-wait-response`: Wait for the next finished response from this tab whose URL matches, e.g. after a symbol change. params: {urlIncludes|urlRegex, method?, status?:100..599, body?:boolean (JSON or text up to 256KB; never for auth/payment/broker URLs), timeoutMs?:0..60000 (10000), trigger?}. Returns {url, status, statusText, method, mimeType, resourceType, fromCache, mocked, failed?, timing:{startedAt, ttfbMs, durationMs}, body?, bodyTruncated?}. No retry key unless a trigger is given.
- `ui-route`: Mock XHR/fetch responses on this tab only (clean demo data). params: {urlIncludes|urlRegex, method?, respond:{status?:100..599 (200), headers?:{name:value}, json?:any | body?:string (<=1MB), contentType?}, times?:1..1000 (unlimited), delayMs?:0..10000}. The newest matching route wins; CORS headers for the page origin are added. Never applies to documents/scripts or to auth, payment or broker/order endpoints (UI_ROUTE_DENIED). Max 20 routes. Cleared on ui-unroute, ui-disable, consent loss, tab close and navigation. Returns {routeId, active}. Retry key required.
- `ui-unroute`: Remove mocks. params: {routeId} | {all:true}. Returns {removed, active}. Retry key required.
- `ui-codegen-start`: Record mode: capture the HUMAN's real clicks, typing, wheel scrolls, drags and keys in this tab (passive listeners in an isolated world; the page is never blocked) until ui-codegen-stop. A "Recording your actions" badge is shown meanwhile. Password/OTP/payment fields are masked (never read). Agent ui-* input during recording is skipped. params: {path? (.json file name in ~/.tradinglead-desktop/codegen, or absolute path in your home folder; never overwrites), maxEvents?:10..5000 (2000)}. Ends (and saves) on ui-disable, consent loss, navigation or tab close; ui-codegen-stop then returns that saved result once. Retry key required.
- `ui-codegen-stop`: Stop record mode, save and return ready-to-run steps: {path, run:{action:"ui-run", params:{timeline:"timed", steps:[{action, params, at}]}}, steps (count), summary:[readable lines], durationMs, masked, skipped, warnings}. Targets prefer data-demo-id/data-testid (testId), data-agent-ui, ARIA role+name, exact text, #id, then a CSS path (+nth when ambiguous); canvas (chart) clicks/drags/wheel use viewport x,y. at = recorded ms from start; clicks carry moveDurationMs so the press lands on time. params: {discard?:boolean (stop without saving)}. Retry key required.
- `demo-browser-open`: Open (or show and focus) the TradingLead demo browser: a separate sandboxed window for recording demos of ANY https website (http only for localhost/private hosts), with its own persistent login session ("persist:tl-demo", never shared with the TradingLead app; the person can sign in by hand and it is remembered). width/height set the page viewport in CSS px (window content size; survives navigation, unlike ui-set-viewport emulation). Popups/target=_blank open in the same window; file:, javascript:, data:, chrome: and other schemes are refused (UI_URL_BLOCKED); permission prompts and downloads are denied. Then call ui-enable on "demo:main" for full interaction and recording. params: {url?, width?:320..3840, height?:240..2160, timeoutMs?:0..60000 (15000; wait for the load, timedOut:true if still loading)}. Returns {tabId, open, created, visible, url, title, loading, canGoBack, canGoForward, bounds, contentSize:{width,height}, partition, timedOut, loadError?}. tabId must be "demo:main". Retry key required.
- `demo-browser-navigate`: Load a URL in the demo browser (same URL policy as demo-browser-open; a bare host like "example.com/pricing" becomes https://). Keeps UI control and any running recording on "demo:main". params: {url, timeoutMs?:0..60000 (15000)}. Returns the demo-browser-status fields plus timedOut and loadError?. tabId must be "demo:main". Retry key required.
- `demo-browser-history`: Back, forward, reload or stop loading in the demo browser (fails UI_NO_HISTORY when there is nothing to go to). params: {direction:"back"|"forward"|"reload"|"stop"}. Returns the demo-browser-status fields plus dispatched and direction; poll demo-browser-status/ui-wait-for for the load. tabId must be "demo:main". Retry key required.
- `demo-browser-close`: Close the demo browser window (ends UI control and stops any recording on "demo:main"; logins are kept). params: {}. Returns {tabId, closed, open:false}. tabId must be "demo:main". Retry key required.
- `demo-browser-status`: Read the demo browser state: {tabId, open, visible, focused, url, title, loading, canGoBack, canGoForward, bounds:{x,y,width,height}, contentSize:{width,height}, partition, lastBlocked?:{url, reason, at}}. params: {}. tabId must be "demo:main".
- `demo-browser-clear-session`: Wipe the demo browser's cookies, local storage, IndexedDB, cache and HTTP auth (signs out of every site in the demo browser; the TradingLead app session (account and broker tokens) is untouched). Only when the person asked for it. params: {confirm:true}. Returns the demo-browser-status fields plus cleared:true. tabId must be "demo:main". Retry key required.
- `ui-network-capture-start`: Record the demo browser's network traffic to a private JSONL file (one line per finished request: {type:"request", ts, method, url, status, statusText, mimeType, resourceType, requestHeaders, responseHeaders, postData?, postDataTruncated?, body?, bodyTruncated?, bodySize?, bodyOmitted?:"denied"|"disabled"|"type"|"binary"|"unavailable", timing:{startedAt, durationMs, ttfbMs, dnsMs, connectMs, sslMs, sendMs, waitMs, receiveMs}, fromCache, fromServiceWorker, encodedDataLength, protocol, redirectedTo?, failed?:{errorText, canceled, blockedReason?}}; websocket:true adds {type:"websocket"|"websocket-frame"|"websocket-closed", direction, payload (text only, ≤16KB)} lines). Use it first to discover a site's JSON API, then call it with ui-page-fetch. Authorization/Cookie/Set-Cookie/Proxy-Authorization/CSRF/token/api-key headers and secret-looking query values (token, key, sig, code, session, password, …) are REDACTED; auth/session/token/OTP, payment, broker login/API/order (Zerodha/Kite, Fyers, Upstox, Angel One, Dhan, Alpaca, …), TradingLead/ContentLead auth and identity-provider URLs (the ui-route denylist) keep metadata only (bodyOmitted:"denied", no headers or post data). Keeps running across page navigations in the demo browser; stops automatically on ui-disable/control loss, window close, maxEntries or the 200 MB file cap (stoppedReason). One capture at a time (UI_BUSY). params: {urlIncludes?|urlRegex?:filter (≤300 chars), resourceTypes?:(document|stylesheet|image|media|font|script|texttrack|xhr|fetch|prefetch|eventsource|websocket|manifest|signedexchange|ping|cspviolationreport|preflight|other)[], bodies?:boolean (true: response bodies of JSON/text xhr/fetch/document responses, plus any type you list in resourceTypes), maxBodyBytes?:1024..5242880 (1048576 per body), maxEntries?:1..20000 (5000 lines), websocket?:boolean (false), path? (bare .jsonl name -> ~/.tradinglead-desktop/captures, or a new absolute path inside your home folder; never overwrites)}. Returns {captureId, path, running:true}. tabId must be "demo:main" (the demo browser, after ui-enable).
- `ui-network-capture-status`: Read a network capture: params: {captureId}. Returns {captureId, running, path, entries, requests, websocketFrames, denied, bodies, bytes, droppedPending, startedAt, stoppedAt?, stoppedReason?, harPath?}. tabId must be "demo:main" (the demo browser, after ui-enable).
- `ui-network-capture-stop`: Stop a network capture (also works after it auto-stopped) and optionally export HAR 1.2. params: {captureId, har?:boolean}. Returns the final status fields; har:true adds harPath (<capture>.har next to the JSONL, same redactions, mode 0600). tabId must be "demo:main" (the demo browser, after ui-enable).
- `ui-page-fetch`: Call a URL with fetch() inside the demo page (main world, credentials:"include"), so the person's login cookies and the site's CORS rules apply exactly as for the site's own scripts. The URL (relative URLs resolve against the page) must pass the demo browser URL policy (https; http only for local/private hosts) and is never one of auth/session/token/OTP, payment, broker login/API/order (Zerodha/Kite, Fyers, Upstox, Angel One, Dhan, Alpaca, …), TradingLead/ContentLead auth and identity-provider URLs (the ui-route denylist) (UI_URL_DENIED; a redirect to one drops the body, bodyOmitted:"denied"). Cookie/Authorization/Proxy-Authorization/Set-Cookie request headers are refused. params: {url, method?:GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS (GET), headers?:{name:value} (≤50), body?:string|JSON (≤1 MB; JSON sets content-type application/json; not for GET/HEAD), responseType?:"json"|"text" (default: json when the content-type says JSON), timeoutMs?:1000..120000 (30000), path? (save the full raw body, ≤50 MB, to a new .json/.txt/.html/.csv/.xml/.jsonl/.js/.md/.bin file: bare name -> ~/.tradinglead-desktop/scrapes)}. Returns {url (final, redacted), status, statusText, ok, redirected, headers (redacted), contentType, size, body? (≤256 KB inline; JSON parsed when responseType is json), bodyTruncated?, jsonError?, bodyOmitted?, path?}. Retry key required. tabId must be "demo:main" (the demo browser, after ui-enable).
- `ui-scrape`: Extract structured items from the demo page and following pages into a private file. For each element matching item, every field reads {selector? (inside the item; omitted = the item itself), attr?:"text" (default, whitespace-normalised)|"href"|"src" (absolute URLs)|"value"|<any attribute>, all?:boolean (list of every match)}; password/OTP/card fields are never read (null). next: {selector} (link/button for the next page: links load through the demo URL policy, buttons are clicked; protected or denied targets stop the run) | {scroll:true, settleMs?:100..30000 (1500)} (infinite scroll; stops when no new items) | {urls:[...≤100]} (scrape exactly these pages, in order). Pages wait for waitFor (a selector, up to timeoutMs) and are spaced by delayMs (be polite; respect the site's terms and robots rules). params: {item, fields:{name:{selector?, attr?, all?}} (1..50 fields), next?, maxPages?:1..100 (5), maxItems?:1..50000 (1000), waitFor?, delayMs?:300..60000 (800), timeoutMs?:1000..60000 (15000 per page), format?:"jsonl"|"csv"|"json" (jsonl), path? (bare name -> ~/.tradinglead-desktop/scrapes; extension must match format), dedupeBy?:field name}. Returns {path, format, items, pages, stoppedReason:"max-items"|"max-pages"|"no-next"|"next-disabled"|"next-protected"|"next-denied"|"next-blocked"|"next-repeat"|"next-no-change"|"no-new-items"|"urls-done"|"wait-timeout"|"control-lost", protectedSkipped, duplicates, urls, sample (first 5 items)}. Retry key required. tabId must be "demo:main" (the demo browser, after ui-enable).

These controls cannot grant access. Discover them using `node cli.cjs desktop capabilities`.
