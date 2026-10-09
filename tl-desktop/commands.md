# tl-desktop command reference

Generated from a command-catalog snapshot. Recheck the addressed tab before use.
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
| `expanded` | Optional boolean |

## `feeds.list`

Discover chart feeds and their live availability (does not change the backend screening source). Use the returned `id` as the `feed` for `marketData.getBars` and `chart.open`.

Retry key: **not required**. External local-assistant access is still required.

Parameters: `{}`.

## `marketData.getBars`

Fetch historical OHLCV candles for a symbol/interval/window through the exact same feed path the chart uses. Returns up to 5000 bounded candles with epoch-millisecond UTC `time`; no feed is ever silently substituted. This is history, not a live/streaming quote, and the receipt time is not provider freshness. Broker feeds (kite/fyers/web-dhan/...) need the feed connected (`feeds.list` → `available:true`), else `DESKTOP_REQUIRED`.

Retry key: **not required** (read-only). External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `feed` | Feed id from `feeds.list` (e.g. `default`, `kite`, `fyers`, `web-dhan`) |
| `symbol` | Canonical ticker in the feed's format, e.g. `NSE:RELIANCE-EQ` |
| `resolution` | `1,2,3,5,10,15,30,60,120,180,240,1D,1W,1M` |
| `from` | Optional window start: `YYYY-MM-DD` or epoch seconds |
| `to` | Optional window end: `YYYY-MM-DD` or epoch seconds; defaults to now |
| `countBack` | Optional candle count ending at `to` (1-5000) |

Supply `from` and/or `countBack`. Returns `{feed,symbol,resolution,from,to,count,noData,bars:[{time,open,high,low,close,volume}]}`.

## Native Desktop controls

Run `node cli.cjs desktop ACTION --tab ACTUAL_TAB_ID` from the Desktop repository.

- `status`: Read native readiness and reported permission state without requiring AI access.
- `activate`: Focus this explicit trusted tab without navigating or reloading it.
- `open-access`: Request the in-place permission panel. Only the user can enable grants; poll status for accessPanelOpen.
- `reconnect`: Request registration retry using existing grants. Disabled access opens the permission panel instead. Poll status.

These controls cannot grant access. Discover them using `node cli.cjs desktop capabilities`.
