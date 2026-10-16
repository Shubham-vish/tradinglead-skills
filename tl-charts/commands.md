# tl-charts command reference

Generated from a command-catalog snapshot. Recheck the addressed tab before use.
Use explicit tab targeting and inspect the final JSON status. Do not guess IDs or grant permissions.

Do not infer grant permissions from `mutates`: Desktop discovery can omit structured grant metadata. Read [tl-desktop](../tl-desktop/SKILL.md) for the verified local-change versus cloud-watchlist access rules.

## `chart.getState`

Read active chart context and history/live/navigation status. Receipt time is not market freshness.

Retry key: **not required**. External local-assistant access is still required.

Parameters: `{}`.

## `chart.snapshot`

Export chart bars/study values without fetching. Check timestamps, completeness and truncation.

Retry key: **not required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `bars` | Optional 1-25 trailing rows, default 5. |

## `chart.setLive`

Toggle supported live updates; may use broker quota. Requires AI access. Verify chart.getState.

Retry key: **not required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `enabled` | Required boolean |

## `chart.reload`

Request history reload; may use provider quota. Verify readiness with chart.getState.

Retry key: **not required**. External local-assistant access is still required.

Parameters: `{}`.

## `chart.navigateHistory`

Browse bounded history. Never ends replay or enables live. Verify chart.getState.navigation.

Retry key: **not required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `action` | date\|latest\|previous\|retry |
| `date` | YYYY-MM-DD; required only for date |

## `chart.replayControl`

Control native manual Bar Replay only; select opens the chart's notice and candle picker for user interaction. Other actions require an active native cursor, never paper replay. Requires local write approval and retry key. Inspect chart.getState.replay afterward.

Retry key: **required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `action` | select\|play\|pause\|step\|speed\|end |
| `speed` | Required only for speed: 0.1-200 bars per second. |

## `studies.list`

Page native study names from the ready chart; not Pine source.

Retry key: **not required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `offset` | Optional nonnegative offset. |
| `limit` | Optional 1-100, default 50. |

## `studies.inputs`

Read a discovered study's input types, defaults, bounds and options.

Retry key: **not required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `name` | Exact name from studies.list. |

## `studies.apply`

Add a native study; no source execution/removals. Requires indicator grant and retry key. Verify chart.snapshot.

Retry key: **required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `name` | Exact discovered study name. |
| `inputs` | Optional map of declared IDs to primitive values. |

## `studies.applied`

List bounded, unmanaged native studies on this chart with exact entity IDs and visibility. Excludes Pine, Python and backtest studies.

Retry key: **not required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `offset` | Optional nonnegative offset. |
| `limit` | Optional 1-100, default 50. |

## `studies.setVisibility`

Toggle one exact built-in native study, never a managed script or drawing. Requires matching current visibility, indicator grant and retry key.

Retry key: **required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `entityId` | Exact ID from studies.applied. |
| `name` | Exact study name from studies.applied. |
| `expectedVisible` | Current boolean visibility. |
| `visible` | Desired boolean visibility. |

## `studies.remove`

Remove one exact built-in native study only. Requires matching current visibility, indicator grant and retry key. Does not delete saved source or drawings.

Retry key: **required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `entityId` | Exact ID from studies.applied. |
| `name` | Exact study name from studies.applied. |
| `expectedVisible` | Current boolean visibility. |

## `drawingTemplates.state`

Read the single selected editable user drawing and its type. No chart change or template contents.

Retry key: **not required**. External local-assistant access is still required.

Parameters: `{}`.

## `drawingTemplates.list`

List bounded saved template names for that exact selected drawing type; no template contents.

Retry key: **not required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `entityId` | Selected drawing ID from state. |
| `type` | Selected drawing type from state. |
| `offset` | Optional nonnegative offset. |
| `limit` | Optional 1-50, default 50. |

## `drawingTemplates.apply`

Apply an exact saved template to the currently selected user drawing. Requires sign-in, local write approval and retry key; never creates or deletes drawings.

Retry key: **required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `entityId` | Selected drawing ID from state. |
| `type` | Selected drawing type from state. |
| `name` | Exact saved name from list. |

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

## `alerts.list`

List this account's saved cloud chart alert rules (id, ticker, timeframe, status, direction, price/trendline, frequency, price source). Read-only; does not return live trigger state.

Retry key: **not required**. External local-assistant access is still required.

Parameters: `{}`.

## `alerts.create`

Create a horizontal latest-price alert on a symbol, monitored from shared cloud quotes while the Alerts Activity tab is open. Trendline alerts must be drawn on the chart. Requires sign-in, local write permission and an idempotencyKey.

Retry key: **required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `ticker` | Canonical ticker, e.g. NSE:TCS-EQ |
| `price` | Finite price level to cross |
| `direction` | Optional above\|below\|either\|touch, default above |
| `timeframe` | Optional resolution for bar bucketing, e.g. 1, 15, 1D; default 1D |
| `frequency` | Optional once\|once_per_bar\|every_cross, default once |
| `name` | Optional label |

## `alerts.setEnabled`

Enable (resume) or disable (pause) a saved alert rule by id, using its latest saved version. Requires sign-in, write permission and an idempotencyKey.

Retry key: **required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `id` | Saved alert rule id |
| `enabled` | Required boolean; true resumes, false pauses |

## `alerts.delete`

Delete a saved alert rule by id. Does not remove chart drawings. Requires sign-in, write permission and an idempotencyKey.

Retry key: **required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `id` | Saved alert rule id |

## `feeds.list`

Discover chart feeds. Chart feeds do not change the backend screening source.

Retry key: **not required**. External local-assistant access is still required.

Parameters: `{}`.

## `marketData.getBars`

Fetch historical OHLCV candles for a symbol/interval/window through the exact same feed path the chart uses. Returns up to 5000 bounded candles with epoch-millisecond UTC `time`; no feed is ever silently substituted. This is history, not a live/streaming quote, and the receipt time is not provider freshness. Broker feeds (kite/fyers/web-dhan/...) need the feed connected (`feeds.list` → `available:true`), else `DESKTOP_REQUIRED`.

Retry key: **not required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `feed` | Feed id from `feeds.list` (e.g. `default`, `kite`, `fyers`, `web-dhan`) |
| `symbol` | Canonical ticker in the feed's format, e.g. `NSE:RELIANCE-EQ` |
| `resolution` | `1,2,3,5,10,15,30,60,120,180,240,1D,1W,1M` |
| `from` | Optional window start: `YYYY-MM-DD` or epoch seconds |
| `to` | Optional window end: `YYYY-MM-DD` or epoch seconds; defaults to now |
| `countBack` | Optional candle count ending at `to` (1-5000) |

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
