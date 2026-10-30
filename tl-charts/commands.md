# tl-charts command reference

Source-only snapshot from an isolated frontend registry; installed Desktop was not ready. Rediscover live availability before use.
Use explicit tab targeting and inspect the final JSON status. Do not guess IDs or grant permissions.

Do not infer grant permissions from `mutates`: Desktop discovery can omit structured grant metadata. Read [tl-desktop](../tl-desktop/SKILL.md) for the verified local-change versus cloud-watchlist access rules.

## `chart.viewState`

Read bounded native chart view/scale/timezone and drawing toolbar state.

Retry key: **not required**. External local-assistant access is still required.

Parameters: `{}`.

## `chart.setView`

Set native view; ranges request positioning, not verified history. Symbol/interval: chart.open. Date: guarded navigator.

Retry key: **required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `chartType` | Optional named chart type. |
| `priceScale` | {mode?:normal\|percent\|log,autoScale?:boolean} |
| `visibleRange` | {preset:5y\|1y\|6m\|3m\|1m\|5d\|1d} OR {from,to} epoch seconds |
| `goToDate` | UTC date, offset ISO timestamp, or epoch seconds. |
| `timezone` | Available timezone ID from viewState. |
| `legend` | {ohlcVisible:boolean} |

## `chart.compare`

List/add/remove native Compare/Overlay only; never other studies. Adds use selected feed; no fallback.

Retry key: **required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `action` | list\|add\|remove |
| `symbol` | Required for add. |
| `kind` | Optional add: compare (default)\|overlay. |
| `id` | Exact listed id for remove. |
| `offset` | Optional list offset. |
| `limit` | Optional list 1-50. |

## `chart.action`

Request native toolbar action. Screenshot returns bounded PNG, not a file. Replay guards undo/redo/date/compare.

Retry key: **required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `action` | undo\|redo\|settings\|screenshot\|fullscreen\|resetScale\|objectTree\|compareDialog\|goToDate |
| `enabled` | Required boolean only for fullscreen. |

## `drawings.list`

Page user drawings only: id/tool, up to 10 time/price points, visible/locked; excludes managed visuals.

Retry key: **not required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `offset` | Optional 0-10000. |
| `limit` | Optional 1-50, default 50. |

## `drawings.create`

Create one allowlisted user drawing with exact tool point count. Epoch seconds/prices; no raw overrides.

Retry key: **required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `tool` | Allowlisted tool; see public guide. |
| `points` | 1-7 {time:integer epoch seconds,price:finite} |
| `text` | Optional text for text tool, max 500. |
| `locked` | Optional boolean. |

## `drawings.update`

Hide/lock/remove up to 50 exact user drawing IDs; never studies or managed visuals. Preflights all targets; not transactional.

Retry key: **required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `ids` | 1-50 unique IDs from list. |
| `visible` | Optional boolean. |
| `locked` | Optional boolean. |
| `remove` | Optional true; exclusive with visible/locked. |

## `drawings.setMode`

Set drawing modes/tool or reorder existing favorites. Confirmed removeAll deletes all user drawings, preserving managed visuals.

Retry key: **required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `tool` | Optional allowlisted drawing/cursor/brush/measure/zoom tool. |
| `magnet` | Optional boolean. |
| `lockAll` | Optional boolean. |
| `hideAll` | Optional boolean. |
| `favoriteOrder` | All current favorite tool IDs from chart.viewState, ordered; max 50. |
| `removeAll` | Optional true. |
| `confirm` | Required true only with removeAll. |

## `studyTemplates.manage`

Native indicator templates, not drawing styles/layouts. Apply replaces native studies only, preserving symbol/interval; no replay. Indicator grant/retry key required, including list.

Retry key: **required**. External local-assistant access is still required.
Local indicator/backtesting grant required.

| Parameter | Contract |
| --- | --- |
| `action` | list\|save\|apply\|delete |
| `name` | Required except list; max 80. |
| `replace` | save only: true to overwrite. |
| `confirm` | Required true for apply/delete. |
| `offset` | list only, 0-10000. |
| `limit` | list only, 1-50. |

## `layout.getState`

Read split-chart layout: active pane, maximized pane, split sizes and each pane's last symbol/feed/interval. chart.*/studies.*/indicators.* always target the active pane.

Retry key: **not required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `saved` | Optional boolean: also list up to 50 saved chart layouts (needs sign-in). |

## `layout.set`

Change split layout, active pane (retargets chart.* commands), focus/restore, split sizes, fullscreen or pane linking.

Retry key: **required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `layout` | single\|columns\|rows\|grid |
| `activePane` | Pane id in layout |
| `maximize` | bool |
| `horizontal` | 25-75 |
| `vertical` | 25-75 |
| `fullscreen` | bool |
| `sync` | {symbol?,interval?} bools: active pane drives others |

## `layout.saved`

Save the active pane's chart as a named saved layout, or load a saved layout id (from layout.getState saved:true) into the active pane, replacing its chart.

Retry key: **required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `action` | save\|load. |
| `name` | save: 1-64 chars. |
| `id` | load: saved layout id. |

## `grid.getState`

Read the mounted Chart Grid: settings, universe, ranking, paging and a bounded page of card symbols with load status.

Retry key: **not required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `offset` | Optional 0-499 card offset. |
| `limit` | Optional 1-100, default 24. |
| `options` | Optional boolean: include universe choices (max 200). |

## `grid.configure`

Change the mounted Chart Grid; source/sort/filter/paging changes reset page. Verify with grid.getState.

Retry key: **required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `universe` | getState option |
| `timeframe` | 5-1M |
| `candles` | 50-500 |
| `density` | size |
| `pageSize` | 6\|12\|18\|24 |
| `paging` | pages\|more |
| `indicators` | sma20\|ema50 |
| `volume` | bool |
| `sort` | {field,direction} |
| `filters` | partial; null clears |
| `page` | 1-based |
| `linkTimeframe` | bool |
| `refresh` | true |
| `chartIndicators` | copy\|basic |
| `theme` | id |
| `width` | px |
| `expanded` | bool |
| `openCard` | page symbol to active chart |
| `panel` | close\|openPage, alone |

## `grid.open`

Open the Chart Grid sidebar, optionally with explicit symbols or a completed visible scan's tickers in grid order.

Retry key: **required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `symbols` | 1-500 tickers |
| `runId` | Screening runId |
| `scope` | all\|filtered\|selected scan rows |
| `label` | 1-120 chars |
| `timeframe` | Optional |
| `candles` | Optional |
| `pageSize` | Optional |

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
Local indicator/backtesting grant required.

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
Local indicator/backtesting grant required.

| Parameter | Contract |
| --- | --- |
| `entityId` | Exact ID from studies.applied. |
| `name` | Exact study name from studies.applied. |
| `expectedVisible` | Current boolean visibility. |
| `visible` | Desired boolean visibility. |

## `studies.remove`

Remove one exact built-in native study only. Requires matching current visibility, indicator grant and retry key. Does not delete saved source or drawings.

Retry key: **required**. External local-assistant access is still required.
Local indicator/backtesting grant required.

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

## `feeds.list`

Discover chart feeds. Inspect discovery.status: failed broker discovery returns only default with an explicit error, never cached brokers. Chart feeds do not change the backend screening source.

Retry key: **not required**. External local-assistant access is still required.

Parameters: `{}`.

## `chart.open`

Navigate this tab to an explicit symbol, chart feed and interval. This is not a broker trade.

Retry key: **not required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `symbol` | Canonical ticker |
| `feed` | Explicit provider ID or default |
| `interval` | Explicit resolution, e.g. 1D |
