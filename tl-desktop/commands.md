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
| `toolbar` | Optional top-left\|top-right\|bottom-left\|bottom-right\|hidden |
| `widget` | Optional same corners\|hidden\|collapsed |

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
- `ui-enable`: Start prompt-free UI control on this active chart tab without approval dialogs, floating control windows or a time limit. Stop through ui-disable or Help > Stop AI control and recording. Ordinary unmarked controls are supported; automationScope is informational. Requires local assistant access and an account. Protected controls remain blocked. params: {}. Retry key required.
- `ui-disable`: Revoke UI control and stop recording on this tab. params: {}. Retry key required.
- `ui-status`: Read UI-control state for this explicit tab. expiresAt is null; control has no time limit.
- `ui-inspect`: List up to 200 visible non-sensitive controls with CSS selectors, frame paths and viewport rectangles. params: {selector?,frames?:CSS[]}. Requires ui-enable; never returns input values. automationScope:false is not a blocker.
- `ui-click`: Native left/right click or double-click. params: {selector OR x,y,frames?,button?:left|right,clickCount?:1|2}. CSS-pixel coordinates; explicit retry key and active UI control required.
- `ui-drag`: Native pointer down, interpolated moves and up. params: {from:CSS selector|{x,y},to:{x,y}|{dx,dy},frames?:CSS[],steps?:1..120 (12),holdMs?:0..5000 (0),button?:left|right}. Coordinates are top-level viewport CSS pixels, including with frames. Same protected-target and control rules as ui-click; retry key required.
- `ui-hover`: Move the pointer over a visible target. params: {selector OR x,y,frames?}. Retry key and active UI control required.
- `ui-scroll`: Native wheel at a target, including nested scroll containers. params: {selector OR x,y,frames?,deltaY?,deltaX?}; at least one delta, missing delta is 0, deltas -2000..2000. Retry key and active UI control required.
- `ui-type`: Insert Unicode text into a selected editable target. params: {selector OR x,y,frames?,text,replace?:boolean}; max 16000 characters. No credentials or file inputs. Retry key and active UI control required.
- `ui-key`: Press a safe navigation/edit key at a focusable target, or with no selector/x,y (or a non-focusable target) at the page's currently focused element, e.g. Escape to close a menu (result windowLevel:true). params: {selector OR x,y (optional),frames?,key:Enter|Escape|Tab|Backspace|Delete|ArrowLeft|ArrowRight|ArrowUp|ArrowDown|Home|End|PageUp|PageDown,shift?:boolean}. No OS shortcuts. Retry key and active UI control required.
- `record-start`: Record only this visible chart tab to local high-bitrate WebM, no audio or approval dialog. Requires local assistant access and an account; a visible Stop & save controller is shown. params: {durationMs?:1000..600000,fps?:1..60 (30),scale?:0.25..4|"native" (device pixel ratio),selector?:CSS crop}. Default60s, max64MiB. Requested fps is capture/encoder target, not guaranteed throughput. Returns recordingId; auto-stops on duration/tab/crop changes. Retry key required.
- `record-stop`: Stop/finalize a recording. params: {recordingId}. Retry key required. Poll record-status until completed; failed captures are explicit.
- `record-status`: Read recording progress/completion/private file path. params: {recordingId}. Explicit tab required.

These controls cannot grant access. Discover them using `node cli.cjs desktop capabilities`.
