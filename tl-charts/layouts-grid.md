# Split layouts, saved chart layouts and Chart Grid

Part of [tl-charts](SKILL.md); exact fields in [commands.md](commands.md).
Writes (`layout.set`, `layout.saved`, `grid.open`, `grid.configure`) are
`mutates:true`: sign-in, general local write grant and a retry key. Reads need
only AI access. All require `/charts` mounted in the addressed tab for the
current account (`LAYOUT_UNAVAILABLE` / `GRID_UNAVAILABLE` otherwise).

## Split-chart layout and the active pane

```json
{"type":"layout.getState","params":{}}
```

Returns the layout (`single`, `columns`, `rows`, `grid`), active pane
(`main-chart`, `chart-2`, `chart-3`, `chart-4`), maximized pane, split sizes and
each pane's **last snapshot** of symbol/feed/interval, plus `sync`
(`{symbol,interval}`) and, when present, `syncSkipped`. Use `chart.getState` for
live readiness.

**Every `chart.*`, `studies.*`, `studyTemplates.*`, `indicators.*`,
`drawingTemplates.*` and `drawings.*` command targets only the active pane.** To work on another pane:

```json
{"type":"layout.set","params":{"layout":"columns","activePane":"chart-2"},"idempotencyKey":"layout-pane2-001"}
```

Then read `layout.getState` and wait for `activeReady:true` before chart
commands. `layout.set` accepts `layout`, `activePane` (must exist in the
resulting layout), `maximize`, `horizontal`/`vertical` split percentages (25-75)
`fullscreen` and `sync`; at least one field is required and validation happens
before anything changes. Switching to `single` keeps panes 2-4 mounted but hidden.
The top bar **A+B** button is Compare (`chart.compare`), not a pane feature.

### Linking panes (symbol / interval)

`sync: {symbol?, interval?}` toggles the layout menu's **Link symbol** /
**Link interval** switches (saved with the split-layout preferences). While
linked, the **active pane drives the others**: its symbol/interval changes are
pushed to the other visible panes, and turning a link on aligns them
immediately.

```json
{"type":"layout.set","params":{"layout":"grid","sync":{"symbol":true,"interval":true}},"idempotencyKey":"layout-link-001"}
```

- Symbols follow only into panes on the **same feed** (feeds use different
  symbol namespaces); interval links ignore feeds.
- Panes that are not mounted, or are skipped because of a different feed, are
  listed in `layout.getState.syncSkipped`.
- Linking is one-way from the active pane. A pane that appears because the
  layout grew is aligned only on the next active-pane change or when a link is
  re-enabled; send `sync` again after changing `layout` if alignment matters.
- Propagation is asynchronous (each pane applies once ready). Verify by reading
  `layout.getState.panes` (and `chart.getState` after activating a pane).
- Linking has no effect in `single` layout. There is **no crosshair sync**
  between panes: it is not possible with the chart library API. Without links,
  open each pane's context with `chart.open` after activating it.

## Saved chart layouts

```json
{"type":"layout.getState","params":{"saved":true}}
```

`saved:true` (sign-in required) adds up to 50 saved layouts with `id`, `name`,
`symbol`, `interval`, plus `current`, `total` and `truncated`.

```json
{"type":"layout.saved","params":{"action":"save","name":"Swing setup"},"idempotencyKey":"layout-save-001"}
```

```json
{"type":"layout.saved","params":{"action":"load","id":"EXACT_SAVED_ID"},"idempotencyKey":"layout-load-001"}
```

`save` (`name` 1-64 characters) saves the active pane's chart. `load` replaces
the active pane's chart with a listed layout and returns `loadRequested:true`;
verify with `chart.getState`. Both fail with `CHART_CHANGED` if the active pane
changes mid-request; a `LAYOUT_TIMEOUT` is not rollback, so check before
retrying. Loading discards the pane's unsaved chart state: confirm with the user
first. Saved-layout rename/delete are UI-only.

## Chart Grid

The Grid (right sidebar **Grid**) is a cloud-backed card gallery, separate
from split layouts and Historical Patterns. Cards use cloud history only, with
no broker fallback; ranking uses stored summary candles, so rank values and card
values can differ.

### Open

```json
{"type":"grid.open","params":{"runId":"COMPLETED_SCREENING_RUN_ID","label":"Breakouts","timeframe":"1D"},"idempotencyKey":"grid-open-001"}
```

- `{}` opens the Grid with its current universe.
- `symbols`: 1-500 exchange-qualified tickers (for example `NSE:INFY-EQ`).
- `runId`: a completed, visible Scanner run; tickers in result-grid order,
  deduplicated, up to about 1025 rows, with `scanRows` and `truncated`.
- `scope` (only with `runId`): `all` (default, every result row), `filtered`
  (rows that survive the Scanner results grid's current filters) or `selected`
  (selected rows that survive the filters). `filtered`/`selected` read the
  results grid through read-only `screening.getAnalysis`; they fail
  `ANALYSIS_CHANGED` if the grid changes mid-read (retry) and `NO_SYMBOLS` if
  nothing qualifies. `truncated` is also true when some rows lack a ticker.
- `label`, `timeframe`, `candles`, `pageSize` apply only with `symbols`/`runId`.

It waits up to 8 seconds for the Grid to mount and returns
`verify:"grid.getState"`; acceptance is not loaded cards.

### Read

```json
{"type":"grid.getState","params":{"offset":0,"limit":24,"options":true}}
```

Returns `active`, `expanded`, settings, `theme`, `sidebar` (width/min/max/narrow),
`linkTimeframe`, `chartIndicators` (`{count,symbol}` when copied, else null),
universe (label, total, loading/error, handoff),
`arrange` (shown, filtered out, unranked, `rankingNeeded`, `rankPending`,
ranking error/time), paging, loading/history errors, a page of cards
(`symbol`, `status`, optional `rank`/`error`) and, with `options:true`, up to
200 universe choices. `offset` 0-499, `limit` 1-100 (default 24).

### Configure

```json
{"type":"grid.configure","params":{"timeframe":"1D","sort":{"field":"volumeRatio","direction":"desc"},"filters":{"changeMin":2}},"idempotencyKey":"grid-config-001"}
```

- `universe`: a `value` from `grid.getState {"options":true}` (or `handoff`);
  otherwise `UNIVERSE_UNAVAILABLE`.
- `timeframe` `5|15|60|1D|1W|1M`; `candles` 50-500; `density`
  `compact|comfortable|large|xlarge|xxlarge`; `pageSize` `6|12|18|24`;
  `paging` `pages|more`; `indicators` subset of `sma20`,`ema50`; `volume`.
- `sort`: `{field, direction}` with field `original`, `symbol`, `changePct`,
  `windowChangePct`, `volume`, `volumeRatio`, `value`.
- `filters`: partial merge of `query` (≤100 chars), `hideUnranked`, and
  numeric `changeMin`, `changeMax`, `volumeRatioMin`, `valueMin` (₹ Cr),
  `priceMin`, `priceMax`; `null` clears a threshold.
- `page` (1-based; in `more` mode it is how many pages are loaded),
  `linkTimeframe` (opening a card also applies the Grid timeframe to the chart),
  `refresh:true` (retry ranking and history).
- `chartIndicators`: `copy` captures the active chart's native indicators onto
  the cards (the "Use chart indicators" button; `CHART_INDICATORS_FAILED` if the
  chart changes or capture fails); `basic` returns to SMA/EMA overlays.
- `theme`: `app|dark|light|midnight|classic`.
- `width`: sidebar width in pixels (280-4096, clamped to the sidebar's
  min/max); not while expanded.
- `expanded`: enlarge the Grid over the workspace or return to the sidebar
  (refused in a narrow workspace).
- `openCard`: a symbol on the **current page** opens on the active chart
  (with the Grid timeframe when linked); `OPEN_CHART_FAILED` otherwise.
- `panel`: `close` closes the Grid, `openPage` opens it as a separate page
  (choose `chartIndicators:"basic"` first). Must be sent alone.

```json
{"type":"grid.configure","params":{"chartIndicators":"copy","theme":"dark","expanded":true},"idempotencyKey":"grid-look-001"}
```

Changing universe, sort, filters, pageSize or paging resets the page. Ranked
sorts and filters call the cloud ranking service; poll `grid.getState` while
`arrange.rankPending` or `loading` is true, and report `rankingError`/card
errors rather than hiding them.

### Boundaries

The per-card enlarge dialog remains interactive. The Grid's "Compare 2/4
charts" footer is not shown in the workspace Grid (no handler is wired there). Opening a card into the main
chart (UI or `openCard`) requires a ready cloud-backed `default` active chart
and ended replay; it never silently converts a broker/local chart.
