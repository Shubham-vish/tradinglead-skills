---
name: tl-charts
description: Control the TradingLead chart workspace through discovered commands. Use for chart symbol/feed/interval navigation, history navigation and go-to-date, snapshots, reload/live, native manual replay, chart type/scale/range/timezone/OHLC legend, Compare/Overlay symbols, toolbar actions and screenshots, native studies and indicator templates, user drawings and drawing templates, split-chart layouts with pane targeting and symbol/interval linking, saved chart layouts and the Chart Grid. Watchlists/market panels belong to tl-markets, saved alerts to tl-alerts, weekday/time-window studies to tl-patterns and multi-stock scans to tl-screening.
---

# TradingLead charts, drawings, layouts and Chart Grid

Start with [tl-desktop](../tl-desktop/SKILL.md). Exact fields:
[commands.md](commands.md). Detailed references:

- [workflows.md](workflows.md): context, permissions, snapshots, studies,
  drawing templates, native replay and manual-only boundaries.
- [drawings.md](drawings.md): `drawings.*` list/create/update/toolbar modes.
- [layouts-grid.md](layouts-grid.md): split layouts, active-pane targeting,
  saved chart layouts and the Chart Grid (`layout.*`, `grid.*`).

Discover the intended tab's installed catalog; source support does not establish
packaged or cloud availability. Watchlists, symbol details, peers, indices,
heatmap, Market Intelligence, Futures, universes and raw candles belong to
[tl-markets](../tl-markets/SKILL.md). Saved price alerts belong to
[tl-alerts](../tl-alerts/SKILL.md). The **Patterns** sidebar belongs to
[tl-patterns](../tl-patterns/SKILL.md).

## Every chart command targets the active pane

`chart.*`, `studies.*`, `studyTemplates.*`, `drawingTemplates.*`, `drawings.*` and indicator
commands operate on the **active split-chart pane** only; none accepts a
`paneId`. In a split layout, read `layout.getState`, select a pane with
`layout.set {"activePane":"chart-2"}`, and confirm the new active pane is
ready before sending chart commands. See [layouts-grid.md](layouts-grid.md).
Do not change pane, account or chart context while an operation is pending.

## Discover, navigate, verify

1. Read `chart.getState` and `feeds.list`. Chart feeds and the SQL-backed
   screener are different data sources. A feed listed in the catalog is not
   necessarily connected or available for a given ticker/resolution; use
   current status rather than an assumed fallback. Website provider IDs (for
   example `web-fyers`, `web-dhan`, `web-binance`, `web-alpaca`) are distinct
   from Desktop-local IDs such as `fyers` or `kite`. Use `feeds.list` for the
   addressed tab, not these examples.
2. To change context, use `chart.open` with an explicit canonical symbol,
   discovered feed and supported interval (interval changes also use
   `chart.open`; `chart.setView` has no interval field):

```json
{"type":"chart.open","params":{"symbol":"NSE:TCS-EQ","feed":"default","interval":"1D"}}
```

3. An acknowledgement such as `navigationRequested:true,dataReady:false` is not
   loaded data. Poll `chart.getState` until the intended context and history
   state are ready or an explicit error occurs. Do not switch provider to hide
   a failure. `history.state === "exhausted"` means the loader found no earlier
   history in that window, not a certified provider boundary.
4. Read `chart.snapshot` with `bars` from 1 to 25. Check actual timestamps,
   schema, missing values and truncation. This is a bounded native chart export,
   not an arbitrary historical-data download. For raw candles without the chart,
   use `marketData.getBars` in [tl-markets](../tl-markets/SKILL.md).

`chart.reload` uses the current provider and can consume provider quota.
`chart.setLive` requests a boolean live-update state; confirm the actual stream
in `chart.getState`. Receipt time, socket connection and an updating UI are not
proof of market freshness. `mutates:false` does not mean side-effect-free:
navigation, reload, live controls and panel selection can change visible state
or use quota. These controls need external AI access but no retry key. Study
writes use the **indicator** grant; every other `mutates:true` chart command
(view, compare, actions, drawings, layouts, grid, replay, template apply) uses
the **general local write** grant, a signed-in account and a retry key.

## History navigation and native replay

Discover `chart.navigateHistory` in the addressed tab before using it:

```json
{"type":"chart.navigateHistory","params":{"action":"date","date":"2023-06-12"}}
```

```json
{"type":"chart.navigateHistory","params":{"action":"latest"}}
```

```json
{"type":"chart.navigateHistory","params":{"action":"previous"}}
```

```json
{"type":"chart.navigateHistory","params":{"action":"retry"}}
```

Dates must be real UTC `YYYY-MM-DD` dates no later than today in UTC; omit `date` for the
other actions. These controls can fetch provider history. An accepted request
does not prove completion: inspect `chart.getState.navigation`, including
`loading`, `error`, `message`, `anchor` (Unix seconds), `historical`,
`previous` (availability), `checkedThrough` (the searched horizon in Unix
seconds, not proof that every candle exists), and `nextAvailable` (a discovered
candle, not a guaranteed coverage boundary).

Ordinary historical stock/timeframe changes retain the last valid cursor time
and horizontal position, or the chart centre when there is no cursor anchor.
The new interval loads a bounded window, not every finer candle across the old
range. Loading uses the actual viewport width and candle spacing and checks
the visible right side after positioning, without requiring another scroll.
Moving further right loads additional bounded historical windows; live ticks
are not used to fill missing history. Latest prices fetches recent history at
a readable zoom without enabling live updates, and Previous view restores the
saved context and spacing. Returning to a saved recent view releases historical
live suppression without changing the saved live-update preference. Weekly and
monthly navigation selects the containing calendar candle, keeping the researched
day for a subsequent return to an intraday interval. Neither action implicitly ends manual
or paper replay.

The chart-local date form navigates only on **Go** or Enter, not while editing;
the same date can be submitted again. The field and heading label UTC explicitly.
Previous view and Choose date remain available during loading. Historical page
loading has a 30-second recovery watchdog; a timeout is a retryable failure, not
proof that candles do not exist. Fullscreen transfers retain input focus and drafts.

Missing target history identifies the requested context and offers recovery.
The chart can check other supported intervals at that date and offer verified
choices in `navigation.alternatives`. These are explicit interval changes,
not automatic substitution or a repair of the missing interval's stored data.
An empty forward search only means no later candles in the checked window;
it does not certify the end of the provider's history. Never switch feeds,
invent candles, or equate latest *available* prices with fresh market data.
Navigation state is per-chart, in memory, not a saved cross-device preference.


`chart.replayControl` requests native manual Replay `select`, `play`, `pause`,
`step`, `speed` (0.1-200 bars/second) or `end`. Selection opens the native
picker; a person still chooses a candle. Paper replay uses
[tl-paper-trading](../tl-paper-trading/SKILL.md). Full recipes and caveats are
in [workflows.md](workflows.md).

## View, scale, range and timezone

`chart.viewState` (read, no key) returns chart type, interval, symbol, main
price-scale mode (native codes `0` normal, `1` log, `2` percent, `3` indexed)
and auto-scale, visible range, current timezone, up to 100 available timezone
IDs, the drawing-toolbar state (selected tool, magnet, lock-all, hide-all),
`legend` (`ohlcVisible`, `collapseSupported:false`) and `favorites` (the
mounted favorite drawing tools in order, `membershipEditable:false`).

`chart.setView` changes one or more of:

- `chartType`: `bars`, `candles`, `line`, `area`, `line-break`, `heikin-ashi`,
  `hollow-candles`, `baseline`, `high-low`, `columns`, `line-with-markers`,
  `stepline`, `hlc-area`.
- `priceScale`: `{mode?: normal|log|percent, autoScale?: boolean}`.
- `visibleRange`: `{preset: 5y|1y|6m|3m|1m|5d|1d}` (keeps the current
  resolution) **or** `{from, to}` epoch seconds. Not with `goToDate`.
- `goToDate`: a completed UTC date `YYYY-MM-DD`, a whole-second ISO timestamp
  with an explicit offset (`2026-03-12T09:30:00+05:30` or `...Z`), or epoch
  seconds. Routed through the guarded history navigator; future times are
  rejected.
- `timezone`: an exact ID from `chart.viewState.timezones`; the result
  verifies the native timezone matches (`CHART_UPDATE_UNCONFIRMED` if not).
- `legend`: `{ohlcVisible: boolean}` shows/hides the OHLC values in the legend
  and is verified by re-reading the saved state. Refused
  (`CHART_API_UNAVAILABLE`) inside a native multi-chart widget. Legend
  *collapse* has no public API and stays UI-only.

```json
{"type":"chart.setView","params":{"chartType":"heikin-ashi","priceScale":{"mode":"log"},"visibleRange":{"preset":"6m"}},"idempotencyKey":"chart-view-001"}
```

Range and date changes are refused during native/paper replay (`REPLAY_ACTIVE`)
and never end replay for you. The result is `requested:true,
historyConfirmed:false` plus a fresh view read: a range request may fetch
history through the selected feed, but does not prove candles exist, data is
fresh or the final visible bounds were achieved. Reread `chart.getState`,
`chart.viewState` and `chart.snapshot` after it settles.

## Compare and Overlay symbols

`chart.compare` handles only native **Compare/Overlay** studies (the top bar
**A+B** button), never other studies. It is `mutates:true` for every action,
so even `list` needs the write grant and a retry key.

- `{"action":"list","offset":0,"limit":50}` returns ID, kind and symbol.
- `{"action":"add","symbol":"NSE:INFY-EQ","kind":"compare"}`; `kind` is
  `compare` (default) or `overlay` (forced onto the main pane). Adds use the
  chart's selected feed with no fallback and cap at 20 comparisons.
- `{"action":"remove","id":"EXACT_LISTED_ID"}` removes only that comparison.

```json
{"type":"chart.compare","params":{"action":"add","symbol":"NSE:INFY-EQ"},"idempotencyKey":"compare-add-001"}
```

Add/remove are refused during replay. A created comparison returns
`calculationConfirmed:false`: inspect the chart before claiming the compared
series loaded.

## Toolbar actions and screenshots

`chart.action` requests one native action: `undo`, `redo`, `settings`
(opens chart properties), `screenshot`, `fullscreen` (requires
`enabled:true|false`), `resetScale` (main-series auto-scale), `objectTree`,
`compareDialog` or `goToDate` (opens the native dialogs). Undo/redo and the
compare/date dialogs are refused during replay. Most actions return
`requested:true,confirmed:false`: dialogs need a person to finish them and the
browser may deny fullscreen.

```json
{"type":"chart.action","params":{"action":"screenshot"},"idempotencyKey":"chart-shot-001"}
```

`screenshot` returns `{image,width,height}`: a PNG data URL thumbnail of at most
640x360 and 256 KiB. It is not saved, downloaded or an OS screenshot, and it does
not prove data freshness. Do not repeat it in loops; the payload is large.

## Native studies and drawing templates

1. Page `studies.list`, read `studies.inputs` for an exact name, then
   `studies.apply` with declared inputs, a retry key and the indicator grant.
2. `studies.applied` lists unmanaged native studies; `studies.setVisibility` and
   `studies.remove` need the exact `entityId`, `name` and current
   `expectedVisible`. They do not target managed Pine/Python/backtest studies,
   drawings or Compare series.
3. `drawingTemplates.state/list/apply` restyle one user-selected editable
   drawing. Template save/rename/delete remain UI-only.
4. `studyTemplates.manage` handles **native indicator templates** (the top-bar
   templates menu), not drawing styles or chart layouts. It is
   `permission:"indicators"` and `mutates:true` for every action, so even
   `list` needs the indicator grant and a retry key. It needs a signed-in
   chart with native template storage (`STUDY_TEMPLATES_UNAVAILABLE`).
   - `{"action":"list","offset":0,"limit":50}` → `{items:[{name}],total,truncated}`.
   - `{"action":"save","name":"Momentum set"}` saves the current native
     studies without symbol/interval; an existing name fails
     `STUDY_TEMPLATE_EXISTS` unless `replace:true`.
   - `{"action":"apply","name":"...","confirm":true}` **replaces** the chart's
     native studies. Symbol, interval and currency stored in the template are
     stripped (only `chart.open` changes context). Refused during replay and
     whenever managed TLScript/Python/backtest studies are on the chart or in
     the template (`MANAGED_STUDIES_PRESENT`); remove them through their own
     lifecycle first. Returns `requested:true, calculationConfirmed:false`;
     verify with `studies.applied`.
   - `{"action":"delete","name":"...","confirm":true}`; unknown names fail
     `STUDY_TEMPLATE_NOT_FOUND`.

```json
{"type":"studyTemplates.manage","params":{"action":"apply","name":"Momentum set","confirm":true},"idempotencyKey":"study-template-apply-001"}
```

Built-in TradingView studies are not Pine source programs; custom TLScript and
Python indicators belong to [tl-tlscript](../tl-tlscript/SKILL.md) and
[tl-python](../tl-python/SKILL.md). Recipes: [workflows.md](workflows.md).

## Drawings, layouts and Chart Grid (summary)

- `drawings.list/create/update/setMode`: page, create allowlisted fixed-point
  drawings, hide/lock/remove exact user drawings, choose a toolbar tool or
  magnet/lock-all/hide-all, reorder favorite drawing tools, and the confirmed
  `removeAll`. Managed visuals and studies are never touched. See
  [drawings.md](drawings.md).
- `layout.getState/set/saved`: split layout, active pane, maximize, split
  sizes, fullscreen, symbol/interval pane linking and saved chart layouts for
  the active pane.
- `grid.open/getState/configure`: open the right-sidebar Chart Grid with
  explicit symbols or a completed Scanner run (all, filtered or selected rows),
  then read and configure it, including theme, width, expand, copied chart
  indicators, opening a card on the chart and close/open-page.
  See [layouts-grid.md](layouts-grid.md).

## Boundaries

- Existing studies, drawings, comparisons and chart context belong to the
  user. Do not remove or replace them as a shortcut.
- Broker setup, credentials and data-source settings are separate human UI
  flows. `feeds.list` discovers availability; it does not configure brokers.
- No native symbol-search command: use `chart.open` with an explicit symbol.
- Chart/style property editing beyond `chart.setView` stays interactive after
  `chart.action {"action":"settings"}`; there is no raw property override.
- UI-only, no public API: OHLC legend collapse, adding/removing favorite
  drawing tools (order is scriptable), crosshair sync between split panes,
  saved-layout rename/delete and drawing styles beyond templates.
- A report about a saved backtest must use that run's frozen evidence, not
  whatever candles happen to be on the current chart.
