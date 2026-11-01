# Demos and recordings

These commands make automated demo videos (Playwright + Remotion) and annotated
screenshot decks reliable. Exact fields are in [commands.md](commands.md).

| Command | Use |
| --- | --- |
| `ui.waitIdle {timeoutMs?, scope?}` | Waits until the app is visually settled: no chart widget, history or source loads, no feed discovery, no replay load, no visible busy spinners, no finite CSS or Web animations, fonts loaded, then two stable frames. Returns `{idle:true, waitedMs, pending:[]}`. If the app is still busy at the timeout it fails with `TIMEOUT`, and `data.pending` lists the blockers. The default timeout is 8 s and the range is 100 to 60000 ms. |
| `ui.listTargets {scope?}` | Lists named targets as `{id, nth, label, role, visible, rect:{x,y,w,h}, viewport:{w,h,dpr}}` in CSS px. Entries can also carry `redact:true` (PII to blur in post) and `frame:true` (resolved inside the TradingView chart frame). |
| `ui.getTargetRect {id, nth?}` | Returns one target, preferring visible matches. Fails with `TARGET_NOT_FOUND` (not mounted) or `TARGET_HIDDEN` (mounted but hidden or off-screen). |
| `demo.prepare {hideTours?, hideToasts?, hideCookieBanner?, freezeClock?, redact?, cursor?}` | Turns on presentation mode. Tours, toasts and banners are hidden by default. `freezeClock` takes an ISO date-time and replaces clock labels with that time. `cursor:false` hides the pointer. Sets `body[data-demo-mode]` and returns `{settings, previous}`. |
| `demo.reset` | Restores everything that `demo.prepare` and `demo.redact` changed. |
| `demo.redact {enable, selectors?}` | Blurs PII in the app: email, phone, account name, broker ids and balances (`[data-demo-redact]`), plus up to 20 extra CSS selectors. |

Policy: everything here is ephemeral CSS and attribute state. No preferences,
storage or tour-seen flags change, and reloading the page clears it.

- `ui.*` commands have effects `none`.
- `demo.*` commands are `mutates:false` with effect `ui`, so they need agent access but not the write grant. This follows the same precedent as layout-only commands such as `workspace.setTheme`.

## Recording recipe

1. Open the scene with normal commands, for example `chart.open` or `workspace.setPanel`.
2. Call `demo.prepare {"redact":true,"freezeClock":"2026-01-05T09:15:00+05:30"}`.
3. Before each shot, call `ui.waitIdle {"timeoutMs":15000}`.
4. Call `ui.getTargetRect {"id":"backtesting.run"}` to get click, zoom or callout boxes. For entries with `redact:true`, blur their rects in post too.
5. When finished, call `demo.reset`.

Rects use CSS px relative to the app viewport. Multiply by `viewport.dpr` to get
screenshot pixels. Re-read a rect after any layout change.

## Target ids

| Area | Ids |
| --- | --- |
| Chart | `chart.area`, `chart.toolbar`, `chart.feed`, `chart.layout`, `chart.interval`, `chart.symbolSearch`, `chart.indicators`, `chart.timezone` |
| Sidebars | `sidebar.left`, `sidebar.right`, `sidebar.panel`, `account.menu`, `watchlist.panel`, `alerts.panel`, `patterns.panel`, `grid.panel`, `paper.sidebar` |
| Screener | `screener.panel`, `screener.run`, `screener.results` |
| Bottom bar | `bottom.panel`, `bottom.tab.<tab>` |
| Backtesting | `backtesting.panel`, `backtesting.run`, `backtesting.summary`, `backtesting.views`, `backtesting.trades`, `backtesting.equity`, `backtesting.ledger` |
| Optimisation | `optimization.panel`, `optimization.run` |
| Paper trading | `paper.panel`, `paper.controls`, `paper.summary`, `paper.trades`, `paper.equity`, `paper.ledger` |
| Indicator Studio | `studio.panel`, `studio.editor`, `studio.run`, `studio.aiAccess` |
| Agent access | `agent.access` |

Notes on ids:

- Elements outside the chart frame that carry `data-demo-id` take precedence over frame targets with the same id.
- `chart.symbolSearch`, `chart.indicators` and `chart.timezone` always come from the TradingView frame. `chart.interval` may also come from it.
- Redaction-only entries use the id `redact.<kind>`, where kind is `initials`, `name`, `contact`, `account`, `brokerProfile` or `balance`. Their label is the kind, never the PII text.

## Browser use without Desktop (`window.__tlDemo`)

Playwright can call `await page.evaluate(() => window.__tlDemo.exec("ui.waitIdle", {}))`.
`window.__tlDemo.catalog()` lists the allowed commands.

The API exists only in these cases:

- a development build, or
- a page loaded as `?demo=<token>`, where the token matches `REACT_APP_DEMO_TOKEN` (at least 8 characters) and the host is loopback (`localhost`, `127.x`, `::1`).

It is never present on tradinglead.in or on LAN hosts.

It runs only:

- `ui.*` and `demo.*` commands,
- `chart.getState`, `workspace.getState` and `layout.getState`,
- `chart.open` and `workspace.setPanel`, but only outside production builds.

Every other command returns `FORBIDDEN`.
