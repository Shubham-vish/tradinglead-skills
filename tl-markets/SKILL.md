---
name: tl-markets
description: Read and operate TradingLead market panels through discovered commands. Use for watchlists (Watch sidebar grid rows/sort/filter/columns/search, CSV text export, manual row order, row flags, favorite-star lists, selecting lists or rows, creating, adding/removing symbols, renaming/deleting cloud watchlists), Multi Watchlists, symbol company details, peers and peer refresh, published indices and constituents, the market heatmap, Market Intelligence and Futures reports, stock universes/categories and raw OHLCV candles via marketData.getBars. Chart drawing/layout belongs to tl-charts; scanner runs to tl-screening; alerts to tl-alerts.
---

# TradingLead markets: watchlists and market panels

Start with [tl-desktop](../tl-desktop/SKILL.md) for connection, grants and
retries. Exact fields: [commands.md](commands.md). Discover each command on
the intended tab; source support does not prove an installed app has it.

Most of these commands drive a **mounted panel** in the current account's
`/charts` workspace. Open the panel first, poll `workspace.getState`, then use
the command. `MARKET_NOT_READY` means the panel is not mounted for that
account; `MARKET_LOADING` means wait and reread.

| Panel | Open with | Commands |
| --- | --- | --- |
| Watch (right sidebar) | `workspace.openSidebar {"panel":"watchlists"}` | `watchlists.getRows/select/setView/removeSymbols/manage` |
| Symbol details (Watch sidebar Details) | Watch sidebar | `symbol.details` |
| Indices (right sidebar) | `workspace.openSidebar {"panel":"indices"}` | `indices.getState` |
| Heatmap (right sidebar) | `workspace.openSidebar {"panel":"heatmap"}` | `heatmap.getState/configure` |
| Peers (bottom tab) | `workspace.setPanel {"panel":"peers","expanded":true}` | `peers.get/configure` |
| Multi Watchlists (bottom tab) | `workspace.setPanel {"panel":"watchlists","expanded":true}` | `watchlists.multiView` |
| Market Intelligence (bottom tab) | `workspace.setPanel {"panel":"intelligence","expanded":true}` | `intelligence.catalog/getReport` |
| Futures (bottom tab) | `workspace.setPanel {"panel":"futures","expanded":true}` | `futures.getReport` |
| No panel | — | `watchlists.list/create/addSymbols`, `universe.list`, `marketData.getBars` |

**Grants.** Several reads are consolidated with their writes and are therefore
`mutates:true`: `symbol.details`, `indices.getState`, `watchlists.multiView`
need the general write grant, sign-in and a retry key even when only reading;
`peers.configure` is a separate mutating refresh so `peers.get` stays a plain read.
Read-only (no key): `watchlists.getRows`, `watchlists.list`, `peers.get`,
`heatmap.getState`, `intelligence.*`, `futures.getReport`, `universe.list`,
`marketData.getBars`. Every mutating `watchlists.*` command (including
`select`, `setView` and `multiView`) needs a **real signed-in account**; the local
development preview fails with `REAL_SIGN_IN_REQUIRED`. Missing grants return
`APPROVAL_REQUIRED`; agents cannot grant themselves access.
An uncertain or cancelled write may have persisted: inspect before retrying and
never issue a fresh key automatically.

## Watch grid

```json
{"type":"watchlists.getRows","params":{"offset":0,"limit":25}}
```

Returns `activeList`, a page of rows (`symbol` plus up to 24 column values),
`total`, `truncated`, column state (`colId`, hide, width, pinned, sort), filter
model, quick-search text and the favorite-starred lists/categories
(`favorites`). It addresses only the **primary Watch grid**;
quotes are shared summaries, not verified fresh market data. Read column IDs
here before `setView`.

**CSV text.** `{"format":"csv","offset":0,"limit":100,"columns":["EXACT_COL_ID"]}`
returns `{csv, bytes, shown, total, columns, truncated, columnsTruncated}` for
the displayed (filtered and sorted) rows of that page, using the grid's own
exporter. `columns` (CSV only, 1-24) must be visible column IDs; default is the
first 24 visible. Cells starting with `= + - @` or a tab/newline are prefixed
with `'` (`spreadsheetFormulaEscaping:true`). Over 128 KiB fails
`EXPORT_TOO_LARGE`: lower `limit` or columns. Nothing is written to a file or
the clipboard; page with `offset` for more rows.

### Select a list or a row

```json
{"type":"watchlists.select","params":{"kind":"watchlist","name":"Swing"},"idempotencyKey":"watch-select-001"}
```

Send `kind` (`category|watchlist|flaglist`) with an exact existing `name`,
**or** `symbol` (a ticker currently visible in `getRows`), not both. If the
Watch grid has applied screener filters, switching lists fails with
`CONFIRM_REQUIRED` unless you pass `clearFilters:true`, which discards them;
only do that when the user agreed. Selecting a row requests the chart switch
(`chartSelectionRequested:true,dataReady:false`); poll `chart.getState`.
Selecting a list returns `loading:true`; reread rows. `SYMBOL_NOT_VISIBLE` means
the ticker is not in the current filtered/sorted view.

### Sort, filter, columns and search

```json
{"type":"watchlists.setView","params":{"sort":[{"colId":"EXACT_COL_ID","sort":"desc"}],"search":"BANK"},"idempotencyKey":"watch-view-001"}
```

- `sort`: up to 12 `{colId, sort: asc|desc}` in priority order; `[]` clears.
- `filters`: AG Grid text/number/set models keyed by column ID, up to two
  conditions joined by AND/OR; `{}` clears. `FILTER_UNAVAILABLE` means that
  column has no installed filter in this build.
- `columns`: up to 24 `{colId, hide?, width?, pinned?}` in display order.
  UI-locked columns reject hide/pin/width changes.
- `search`: quick filter, at most 80 characters; empty clears.
- `move`: `{symbol, toIndex}` sent **alone** moves one existing row in the
  list's manual order, the same writer as drag-and-drop. Clear sort, column
  filters and search first (`ORDER_VIEW_CONFLICT`; applied screeners also block
  it). Returns `{symbol, toIndex, changed, persisted:true}` after reading the
  saved order back. `ORDER_NOT_PERSISTED` is not rollback: read rows before
  retrying with the same key.

Column layout persists as the user's preference; filters and search are
session-only. The result is a fresh `getRows`-style read; `VIEW_NOT_APPLIED`
means nothing was applied.

## Cloud watchlists

```json
{"type":"watchlists.list","params":{}}
```

```json
{"type":"watchlists.create","params":{"name":"Breakouts June","symbols":["NSE:TCS-EQ","NSE:INFY-EQ"]},"idempotencyKey":"watch-create-001"}
```

1. Read `watchlists.list` and verify a real signed-in account. These are
   TradingLead watchlists, not broker watchlists.
2. Require the user's separate write grant (**Allow AI watchlist and
   saved-screener changes**). Local automatic access is not that grant.
3. `watchlists.create` / `watchlists.addSymbols` take `symbols` **or** a
   completed legacy `screener.run` job's `runId`, not both. That `runId` is
   only that job service, not `screening.*`, persisted history or `patterns.*`.
   For Scanner selections, collect explicit tickers via
   [tl-screening](../tl-screening/SKILL.md). Writes accept at most 500 symbols;
   do not silently drop or split without reviewing scope. `create` never
   overwrites an existing different list.
4. Remove members with `watchlists.removeSymbols {name, symbols}`: 1-100 unique
   tickers that are actual members (`SYMBOL_NOT_IN_LIST` otherwise); chunk larger
   removals.
5. Rename or delete with `watchlists.manage`:

```json
{"type":"watchlists.manage","params":{"action":"rename","name":"Swing","newName":"Swing 2026"},"idempotencyKey":"watch-rename-001"}
```

   `delete` requires `confirm:true` and is irreversible; only delete a list the
   user named explicitly. `removeSymbols`/`manage` need the Watch sidebar
   mounted. Reread `watchlists.list` or `getRows` afterwards.
6. Favorite star a list or category (pinned at the top of the list selector):

```json
{"type":"watchlists.manage","params":{"action":"favorite","kind":"watchlist","name":"Swing","enabled":true},"idempotencyKey":"watch-fav-001"}
```

   Desired-state: already matching is a no-op. Check `getRows.favorites`.
7. Flag visible rows with a colour (flag lists):

```json
{"type":"watchlists.manage","params":{"action":"flag","symbols":["NSE:TCS-EQ"],"color":"red"},"idempotencyKey":"watch-flag-001"}
```

   1-100 unique tickers that are **visible** in the Watch grid
   (`SYMBOL_NOT_VISIBLE` otherwise); colours `red|blue|green|yellow|purple|cyan|pink`,
   `currentColor` removes the flag. Flags are written one symbol at a time and a
   failure can leave earlier symbols flagged; reread before retrying. Wait out
   `MARKET_LOADING` while another watchlist write is running.

## Symbol details and peers

`symbol.details` reads the current **chart** symbol's company panel (sector,
industry, about, up to 20 key points, 30 ratios, 10 news titles) with state
`unsupported|collapsed|loading|error|empty|ready`. It never takes a symbol: use
`chart.open` or `watchlists.select` first. `expanded:true` opens Details; then
poll without `expanded` until `ready`. A collapsed panel is not fetched. Data
is a stored upstream snapshot, not verified live fundamentals.

```json
{"type":"symbol.details","params":{"expanded":true},"idempotencyKey":"details-open-001"}
```

`peers.get {"limit":25}` (1-100) returns the current chart symbol's `matched`
peers (linked to chart tickers) and `unmatched` entries, `total`, `truncated`
and stored provenance. Unmatched peers are not chart symbols; do not invent
tickers for them. `peers.get` never refetches.

```json
{"type":"peers.configure","params":{"refresh":true},"idempotencyKey":"peers-refresh-001"}
```

`peers.configure {"refresh":true}` does exactly what the Peers Refresh/Retry
button does: reloads the stored peer data and chart catalog for the current
symbol and returns `state:"loading", refreshRequested:true`. Poll `peers.get`
until it settles. It does not scrape upstream sources.

## Multi Watchlists

```json
{"type":"watchlists.multiView","params":{},"idempotencyKey":"multi-read-001"}
```

Returns current panels (max 12), `available` existing lists, `storageError`.
Passing `panels: [{type, name}]` replaces the layout with existing lists of
the current account (`WATCHLIST_NOT_FOUND` otherwise); `[]` closes all cards but
never deletes lists. The layout is device/account-local. Requires a retry key
even to read.

## Indices

```json
{"type":"indices.getState","params":{"offset":0,"limit":25},"idempotencyKey":"indices-read-001"}
```

Without `category`, returns the published index catalog (category, ticker,
label, member count) and the selected index's constituents with paging.
`category` selects a published index **and opens its index ticker on the
chart** (`chartSelectionRequested:true`); reread to get its constituents.
`INDEX_NOT_AVAILABLE` means it is not published or still loading.

## Heatmap

```json
{"type":"heatmap.getState","params":{}}
```

Reads settings, aggregate breadth and quote receipt time, not per-ticker
quotes; receipt time is not provider freshness.

```json
{"type":"heatmap.configure","params":{"universe":"EXACT_OFFERED_ID","sizeMode":"turnover","groupBy":"sector"},"idempotencyKey":"heatmap-config-001"}
```

`universe` must be an offered ID (the configure result lists up to 100
`universes`; `UNIVERSE_NOT_AVAILABLE` otherwise). `sizeMode`
`turnover|volume|percent|equal` (`percent` sizes by absolute daily move;
`turnover` is a traded-value proxy, not market cap), `groupBy` `sector|none`,
`colorScale` `2|3|5|10`, `limit` `0|50|100|250|500`, `search` (highlight,
≤80 chars), `expanded`. The result is `viewChangeRequested:true`; poll
`heatmap.getState`. **Historical periods are unsupported**: the heatmap only
has current quotes (no time series or period returns), so do not ask for or
invent a 1W/1M view. The heatmap error Retry button is UI-only.

## Market Intelligence and Futures

After opening Intelligence, read `intelligence.catalog` (up to 50 authorized
published reports and filters) and use an exact discovered dataset with
`intelligence.getReport` (at most 10 rows, optional `symbol`/`date`, snapshot
provenance). `futures.getReport` returns at most five published NSE participant
summaries (`isIndex` true by default).

```json
{"type":"futures.getReport","params":{"isIndex":true}}
```

These are mounted, authorized published-report reads, not analysis execution,
live positions, streaming quotes or evidence of redistribution rights.

## Universes and raw candles

`universe.list` lists stock categories, or with `category` the symbols in one.

`marketData.getBars` reads OHLCV candles without moving the chart, through the
same feed path the chart uses for the named feed. Pick the feed with
`feeds.list` (owned by [tl-charts](../tl-charts/SKILL.md)); give `from`+`to`,
`to`+`countBack`, or `countBack` (≤5000 bars; `time` is epoch ms UTC). It never
substitutes a feed; the result is history, not a live quote. For `default`,
the transport may be Desktop-local or cloud-routed; the response does not name
the transport, so inspect candle times and report unverified provenance and
freshness rather than certifying them.

```json
{"type":"marketData.getBars","params":{"feed":"kite","symbol":"NSE:RELIANCE-EQ","resolution":"5","from":"2024-01-10","to":"2024-01-12"}}
```

## UI-only

File/clipboard export and list import dialogs, broker watchlists, the Heatmap
Retry button, heatmap historical periods and the secondary Multi/Indices/Peers
grids' own rows/sort/filter state have no commands (`watchlists.getRows`
addresses only the primary Watch grid). Do not fake them with
arbitrary JavaScript.
