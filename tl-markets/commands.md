# tl-markets command reference

Source-only snapshot from an isolated frontend registry; installed Desktop was not ready. Rediscover live availability before use.
Use explicit tab targeting and inspect the final JSON status. Do not guess IDs or grant permissions.

Do not infer grant permissions from `mutates`: Desktop discovery can omit structured grant metadata. Read [tl-desktop](../tl-desktop/SKILL.md) for the verified local-change versus cloud-watchlist access rules.

## `watchlists.getRows`

Read displayed Watch rows/state or bounded formula-safe CSV text; no file/clipboard writes or freshness claim.

Retry key: **not required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `offset` | 0-100000, default 0 |
| `limit` | 1-100, default 25 |
| `format` | rows (default)\|csv; CSV <=128 KiB |
| `columns` | CSV only: 1-24 visible column IDs; default visible columns |

## `watchlists.select`

Select a discovered list OR visible row on the active chart. Mounted Watch required; poll rows/chart.

Retry key: **required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `kind` | category\|watchlist\|flaglist; with name |
| `name` | Exact list ID |
| `symbol` | Visible row ticker; instead of kind/name |
| `clearFilters` | Explicit true to discard applied screeners on list switch |

## `watchlists.setView`

Set mounted Watch sort/filter/column state. Existing column preferences persist; filters are session-only.

Retry key: **required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `sort` | Up to 12 {colId,sort:asc\|desc}; [] clears |
| `filters` | AG text/number/set by column ID; two-condition AND/OR; {} clears |
| `columns` | Up to 24 {colId,hide?,width?,pinned?}, in order |
| `search` | Optional quick-filter text, <=80 chars; empty clears |
| `move` | Exclusive {symbol,toIndex}: move an existing row in unfiltered, unsorted manual order |

## `watchlists.removeSymbols`

Remove 1-100 symbols from an existing cloud watchlist using the UI writer.

Retry key: **required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `name` | Existing watchlist |
| `symbols` | 1-100 unique canonical tickers |

## `watchlists.manage`

Manage lists/favorite stars or flag visible rows using guarded UI stores. Delete requires confirm:true.

Retry key: **required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `action` | rename\|delete\|favorite\|flag |
| `name` | Existing list/category; not for flag |
| `newName` | Rename only |
| `confirm` | Delete only: true |
| `kind` | Favorite only: watchlist\|category |
| `enabled` | Favorite only: required boolean |
| `symbols` | Flag only: 1-100 unique visible tickers |
| `color` | Flag only: red\|blue\|green\|yellow\|purple\|cyan\|pink\|currentColor (remove) |

## `symbol.details`

Read bounded mounted company/fundamentals; optionally show/hide Details. No automatic fetch while collapsed.

Retry key: **required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `expanded` | Optional boolean; poll after opening |

## `peers.get`

Read up to 100 matched/unmatched peers for the mounted Peers panel's current chart symbol.

Retry key: **not required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `limit` | 1-100, default 25 |

## `peers.configure`

Reload mounted peers through the UI Refresh/Retry path; poll peers.get. Does not scrape upstream.

Retry key: **required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `refresh` | Required true; reload stored peers and chart catalog |

## `indices.getState`

Read index catalog/constituents; optionally select a published category, opening its index on chart.

Retry key: **required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `category` | Optional published category ID |
| `offset` | 0-100000, default 0 |
| `limit` | 1-100, default 25 |

## `heatmap.configure`

Configure mounted heatmap using its offered universe/options; no historical period exists. Poll getState.

Retry key: **required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `universe` | Exact offered universe ID |
| `sizeMode` | turnover\|volume\|percent\|equal |
| `groupBy` | sector\|none |
| `colorScale` | 2\|3\|5\|10 |
| `limit` | 0\|50\|100\|250\|500 |
| `search` | Optional highlight query, <=80 chars |
| `expanded` | Optional boolean |

## `watchlists.multiView`

Read mounted Multi Watchlists layout; optionally replace up to 12 panels with existing lists.

Retry key: **required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `panels` | Optional array of {type:category\|watchlist\|flaglist,name}; [] closes all cards |

## `intelligence.catalog`

Read up to 50 authorized published report names and filter availability from the open Market Intelligence panel. Not streaming quotes.

Retry key: **not required**. External local-assistant access is still required.

Parameters: `{}`.

## `intelligence.getReport`

Read at most 10 authorized published report rows with snapshot provenance. Requires the mounted panel and a dataset from intelligence.catalog; not live quotes or redistribution rights.

Retry key: **not required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `dataset` | Exact available dataset from intelligence.catalog. |
| `symbol` | Optional supported canonical symbol filter. |
| `date` | Optional YYYY-MM-DD snapshot date. |

## `futures.getReport`

Read at most five published NSE participant summaries from the mounted Futures panel. Aggregate reports, not live positions or forecasts.

Retry key: **not required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `isIndex` | Optional boolean, true for index futures (default), false for stock futures. |

## `heatmap.getState`

Read current heatmap settings, aggregate breadth and quote receipt time from the open panel. No per-ticker quotes; receipt time is not provider freshness.

Retry key: **not required**. External local-assistant access is still required.

Parameters: `{}`.

## `marketData.getBars`

Fetch historical OHLCV candles for a symbol/interval/window through the exact same feed path the chart uses. Pick the feed with feeds.list (default TradingLead/local adapters, or a connected broker like kite, fyers, web-dhan). Give the window as from+to, to+countBack, or just countBack. Returns up to 5000 bounded candles with epoch-millisecond UTC times; not a live/streaming quote and receipt time is not provider freshness. No feed is ever silently substituted.

Retry key: **not required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `feed` | Feed id from feeds.list (e.g. default, kite, fyers, web-dhan). |
| `symbol` | Canonical ticker in the feed's format, e.g. NSE:RELIANCE-EQ. |
| `resolution` | Whole minutes 1-1440 (including 3,10,20,45,75,90), or 1D,1W,1M. Broker custom intervals require a compatible exact-divisor native base; no provider substitution. |
| `from` | Optional window start: YYYY-MM-DD or epoch seconds. Supply from and/or countBack. |
| `to` | Optional window end: YYYY-MM-DD or epoch seconds; defaults to now. |
| `countBack` | Optional number of candles ending at 'to' (1-5000). Supply from and/or countBack. |

## `universe.list`

List available stock categories or the symbols in one category.

Retry key: **not required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `category` | Optional category identifier from this command. |

## `watchlists.list`

List the signed-in user's TradingLead watchlists, not broker watchlists.

Retry key: **not required**. External local-assistant access is still required.

Parameters: `{}`.

## `watchlists.create`

Create a TradingLead watchlist without overwriting an existing different list. Requires sign-in, an idempotencyKey and local write permission for external agents.

Retry key: **required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `name` | Watchlist name |
| `symbols` | Canonical ticker array; supply symbols OR runId. |
| `runId` | Completed scan to save; supply runId OR symbols. |

## `watchlists.addSymbols`

Add unique symbols to an existing TradingLead watchlist. Requires sign-in, an idempotencyKey and local write permission for external agents.

Retry key: **required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `name` | Existing watchlist name |
| `symbols` | Canonical ticker array; supply symbols OR runId. |
| `runId` | Completed scan to save; supply runId OR symbols. |
