# tl-charts command reference

Generated from live discovery. Recheck the addressed tab before use.
Use explicit tab targeting and inspect the final JSON status. Do not guess IDs or grant permissions.

Do not infer grant permissions from `mutates`: Desktop discovery can omit structured grant metadata. Read [tl-desktop](../tl-desktop/SKILL.md) for the verified local-change versus cloud-watchlist access rules.

## `chart.getState`

Read the active chart's feed, symbol, interval and actual history/live status. Receipt timestamps are not proof of market freshness.

Retry key: **not required**. External local-assistant access is still required.

Parameters: `{}`.

## `chart.snapshot`

Read a bounded native chart export, including plotted study values. No broker fetch. Candles may be stale or incomplete; inspect timestamps and truncation.

Retry key: **not required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `bars` | Optional 1-25 trailing rows, default 5. |

## `chart.setLive`

Request live updates on/off using the current chart's supported provider. Enabling can consume broker quota. Requires AI access; poll chart.getState to confirm actual stream state.

Retry key: **not required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `enabled` | Required boolean |

## `chart.reload`

Request history reload through the existing chart control. May consume provider quota. Acknowledgement is not data readiness; poll chart.getState.

Retry key: **not required**. External local-assistant access is still required.

Parameters: `{}`.

## `studies.list`

Discover actual native TradingView study names from the ready widget, with bounded pagination. These are not Pine source programs.

Retry key: **not required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `offset` | Optional nonnegative offset. |
| `limit` | Optional 1-100, default 50. |

## `studies.inputs`

Read declared native input types, defaults, bounds and options for an exact discovered study name.

Retry key: **not required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `name` | Exact name from studies.list. |

## `studies.apply`

Add an actual native study using validated declared inputs. Requires the indicator grant and retry key. Does not remove other studies. Inspect chart.snapshot afterward; no Pine interpreter or arbitrary code.

Retry key: **required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `name` | Exact discovered study name. |
| `inputs` | Optional map of declared IDs to primitive values. |

## `feeds.list`

Discover chart feeds. Chart feeds do not change the backend screening source.

Retry key: **not required**. External local-assistant access is still required.

Parameters: `{}`.

## `universe.list`

List available stock categories or the symbols in one category.

Retry key: **not required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `category` | Optional category identifier from this command. |

## `chart.open`

Navigate this tab to an explicit symbol, chart feed and interval. This is not a broker trade.

Retry key: **not required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `symbol` | Canonical ticker |
| `feed` | Explicit provider ID or default |
| `interval` | Explicit resolution, e.g. 1D |
