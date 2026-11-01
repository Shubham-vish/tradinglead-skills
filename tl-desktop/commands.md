# tl-desktop command reference

Source-only snapshot from an isolated frontend registry; installed Desktop execution is not certified. Rediscover live availability before use.
Use explicit tab targeting and inspect the final JSON status. Do not guess IDs or grant permissions.

Do not infer grant permissions from `mutates`: Desktop discovery can omit structured grant metadata. Read [tl-desktop](../tl-desktop/SKILL.md) for the verified local-change versus cloud-watchlist access rules.

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

These controls cannot grant access. Discover them using `node cli.cjs desktop capabilities`.
