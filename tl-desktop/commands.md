# tl-desktop command reference

Source-only snapshot from an isolated frontend registry; installed Desktop was not ready. Rediscover live availability before use.
Use explicit tab targeting and inspect the final JSON status. Do not guess IDs or grant permissions.

Do not infer grant permissions from `mutates`: Desktop discovery can omit structured grant metadata. Read [tl-desktop](../tl-desktop/SKILL.md) for the verified local-change versus cloud-watchlist access rules.

## `workspace.getState`

Read this tab's account/permission state and screening source.

Retry key: **not required**. External local-assistant access is still required.

Parameters: `{}`.

## `workspace.getActivity`

Read bounded command status/error-code history and active command count. Never returns credentials, source or command arguments.

Retry key: **not required**. External local-assistant access is still required.

Parameters: `{}`.

## `workspace.setPanel`

Select an existing /charts bottom panel and optionally expand/minimize it. Requires AI access, not a persistent-write grant. Acknowledges the request; poll workspace.getState.

Retry key: **not required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `panel` | peers\|watchlists\|futures\|backtesting\|paper-trading\|intelligence\|indicators; simulation is a legacy alias |
| `expanded` | Optional boolean, default true. |

## `workspace.openSidebar`

Open/collapse a /charts right-sidebar section incl. More items. Layout only, no write grant. Confirm via workspace.getState sidebar.

Retry key: **not required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `panel` | watchlists\|indices\|heatmap\|scanner\|grid\|patterns\|alerts\|research\|dataWindow\|paperTrading\|contests |
| `expanded` | Optional boolean, default true |

## `workspace.setTheme`

Set this browser's app light/dark theme (same as Settings > Theme). Local UI preference only.

Retry key: **not required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `theme` | light\|dark |

## Native Desktop controls

Run `node cli.cjs desktop ACTION --tab ACTUAL_TAB_ID` from the Desktop repository.

- `status`: Read native readiness and reported permission state without requiring AI access.
- `activate`: Focus this explicit trusted tab without navigating or reloading it.
- `open-access`: Request the in-place permission panel. Only the user can enable grants; poll status for accessPanelOpen.
- `reconnect`: Request registration retry using existing grants. Disabled access opens the permission panel instead. Poll status.

These controls cannot grant access. Discover them using `node cli.cjs desktop capabilities`.
