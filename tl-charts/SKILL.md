---
name: tl-charts
description: Control TradingLead charts through discovered commands. Use for ticker/feed discovery, chart navigation, interval changes, snapshots, reload/live controls, native studies and alerts. Historical weekday/time-window studies belong to tl-patterns; multi-stock screening belongs to tl-screening.
---

# TradingLead charts and native studies

Start with [tl-desktop](../tl-desktop/SKILL.md). Exact fields:
[commands.md](commands.md).

For the separate **Patterns** sidebar and its `patterns.*` study lifecycle,
load [tl-patterns](../tl-patterns/SKILL.md). Charts does not own those commands.

## Discover, navigate, verify

1. Read `chart.getState`, `feeds.list` and, when appropriate, `universe.list`.
   Chart feeds and the SQL-backed screener are different data sources. Browser
   and Desktop may expose different connected provider capabilities. A feed
   listed in the catalog is not necessarily connected or available for a given
   ticker/resolution; use current source status rather than an assumed fallback.
   Website provider IDs (for example `web-fyers`, `web-dhan`,
   `web-binance`, `web-alpaca`) are distinct from Desktop-local IDs such as
   `fyers` or `kite`. A website Zerodha/Kite entry can be a Desktop download
   guide rather than a selectable browser feed. Use `feeds.list` and actual
   connection/interval data, not these examples, for the addressed tab.
2. If a context change is requested, use `chart.open` with an explicit canonical
   symbol, discovered feed and supported interval:

```json
{"type":"chart.open","params":{"symbol":"NSE:TCS-EQ","feed":"default","interval":"1D"}}
```

3. An acknowledgement such as `navigationRequested:true,dataReady:false` is not
   loaded data. Poll `chart.getState` until the intended context and history
   state are ready or an explicit error occurs. Do not switch provider to hide
   a failure.
4. Read `chart.snapshot` with `bars` from 1 to 25. Check actual timestamps,
   schema, missing values and truncation. This is a bounded native chart export,
   not an arbitrary historical-data download.

`chart.navigateHistory` requests date/previous/latest/retry through the
current chart's bounded history navigator. It refuses to end native replay;
read `chart.getState.navigation` after acknowledgement.
This is **not** TradingView's built-in **Go to / Custom range** dialog, but as
of Oct 2026 that native dialog is bridged to the same navigator: submitting a
date (or a custom range) in it is intercepted and routed through this history
navigator, so the native UI reaches the correct destination for forward, earlier
and custom-range dates instead of clamping to the last loaded bar. Testing this
command alone still does not test the native dialog UI; use the dedicated native
browser integration test (`--native-goto`) when diagnosing that form.
`chart.replayControl` requests native manual Replay selection, play, pause,
one-candle step, speed (0.1-200 bars/second) or End. Selection opens the
native picker; a person still chooses a candle. It needs sign-in, local write
approval and a retry key. Read `chart.getState.replay` after each request;
an accepted step is not yet proof that a candle was revealed. Paper replay
uses [tl-paper-trading](../tl-paper-trading/SKILL.md), not this player.

`chart.reload` uses the current provider and can consume provider quota.
`chart.setLive` requests a boolean live-update state; confirm the actual stream
in `chart.getState`. Receipt time, socket connection and an updating UI are
not proof of market freshness. Never enable a live feed merely to format a
saved research page.

## Historical browsing

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

## Raw candles without the chart

To read OHLCV values directly (not navigate the visible chart), use the
read-only `marketData.getBars` command — it fetches candles through the exact
same feed path the chart uses, for whichever feed the caller names. Pick the
feed id with `feeds.list`; give the window as
`from`+`to`, `to`+`countBack`, or just `countBack` (≤5000 bars; `time` is epoch
ms UTC). It never substitutes a feed, and the result is history, not a live
quote.

```json
{"type":"marketData.getBars","params":{"feed":"kite","symbol":"NSE:RELIANCE-EQ","resolution":"5","from":"2024-01-10","to":"2024-01-12"}}
```

## Native studies

1. Page `studies.list` to discover exact supported study names.
2. Use `studies.inputs` for that name; use declared IDs, types and bounds.
3. `studies.apply` requires a retry key and local-change access. Read
   `chart.snapshot` afterward to inspect actual study values.
4. `studies.applied` discovers currently applied *unmanaged native* study IDs
   and visibility. `studies.setVisibility/remove` require that exact ID, name
   and current `expectedVisible`; they need the indicator grant and retry key.
   They do not target managed Pine/Python/backtest studies or user drawings.

Built-in TradingView studies are not Pine source programs. Custom TLScript and
Python source workflows belong to their own skills.

`drawingTemplates.state/list/apply` use one selected editable user drawing
and the current account. Apply needs general local write approval and a retry
key; rediscover the selected ID/type and saved name before applying. Template
save, rename and delete remain UI-only until the library has reliable
revision-checked write semantics.

`intelligence.catalog/getReport` read the mounted signed-in Market
Intelligence panel: a discovered dataset and at most 10 published snapshot
rows with provenance. `futures.getReport` returns at most five published
aggregate participant dates from the mounted Futures panel.
`heatmap.getState` reads the open heatmap's settings and aggregate breadth,
not per-ticker prices. They are not streaming quotes or evidence of data
redistribution rights. Wait for panel loading or resolve explicit errors.

## Boundaries

- Existing studies, drawings and chart context belong to the user. Do not
  remove or replace them as a shortcut.
- Native study removal is limited to the exact unmanaged built-in ID from
  `studies.applied`; it is not a generic drawing or script deletion API.
- Broker setup, credentials and data-source settings are separate UI/runtime
  surfaces. `feeds.list` discovers availability; it does not configure brokers.
- Feed-selection and symbol-search UI, drawing-template library writes and
  layout preferences are not general-purpose product commands.
- `workspace.setPanel` can open Intelligence/Futures, but the bounded read
  commands do not run every analysis or disclose unlicensed raw feeds.
- A report about a saved backtest must use that run's frozen evidence, not
  substitute whatever candles happen to be on the current chart.

## Saved chart alerts

`alerts.list` reads saved alert rules, **not** a live trigger history or proof
of background monitoring. `alerts.create` registers a horizontal latest-price
crossing for an explicit canonical ticker/price; discover the requested
direction, timeframe and frequency. Trendline alerts require chart drawing
through the UI, not an invented command parameter. `alerts.setEnabled`
pauses/resumes a discovered ID; `alerts.delete` removes the rule, not the
chart drawing. Mutations need sign-in, the advertised local write access and
a retry key. Shared quote monitoring is conditional on the Alerts Activity tab
being open; do not promise push delivery, always-on alerts or broker execution.
