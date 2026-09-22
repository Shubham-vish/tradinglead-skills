---
name: tl-screening
description: Discover and run TradingLead backend screeners or explicit broker-candle TLScript scans, inspect complete/partial results and optionally save TradingLead cloud watchlists. Use for symbol scans and watchlist research, not arbitrary new datasets or broker watchlist/order mutation.
---

# Screening and cloud watchlists

Start with [tl-desktop](../tl-desktop/SKILL.md). Read
[commands.md](commands.md) and discover the chosen screening surface before
constructing a request.

## Choose the data source explicitly

| Workflow | Discovery | Execution |
| --- | --- | --- |
| Existing backend/SQL screeners | `screener.listCapabilities`, `universe.list` | `screener.run` |
| Local provider candles + bounded TLScript | `providerScreener.listCapabilities`, `feeds.list` | `providerScreener.run` |

Changing a chart to Kite/Fyers does **not** change backend screening to that
provider. Local Python indicators do not automatically become backend filters.

### Backend scan

Discover actual screener names/parameters. Supply 1-500 canonical tickers and
1-5 supported screener configurations. Source is the backend `default` surface,
not a guessed broker ID. Poll `screener.getResults` using the returned run ID.

The backend can cache a computation for one hour. `refreshCache` bypasses
that cache, not stale underlying candles. Completion time is not market
freshness. AI scans do not overwrite the visible screener configuration/grid.

### Provider scan

Discover supported providers/intervals and supply 1-50 explicit canonical
tickers, the provider, TLScript source, interval and a supported condition.
Read [tl-tlscript](../tl-tlscript/SKILL.md) before authoring. Bars are bounded
to 2-1000. The newest candle is conservatively excluded; broker requests
consume quota. Poll `providerScreener.getResults`.

There is no silent provider/SQL fallback. Local runs expire after 30 minutes
or reload; an expired job is not an empty successful result.

## Inspect before saving

Check terminal status, each symbol's errors, source timestamps, missing values,
partial failures and truncation. A failed symbol is not a valid non-match.
Use the matching `cancel` command when requested; cancellation may not undo a
backend computation already dispatched.

Cloud watchlist writes are separate:

1. Read `watchlists.list` and verify a **real signed-in account**.
2. Require the user's separate cloud-write grant. Local Desktop automatic
   access/development preview is not that grant.
3. Use `watchlists.create` or `watchlists.addSymbols`, with `symbols` **OR**
   a completed backend `runId`, not both. For provider scan matches, pass the
   verified explicit `symbols`; do not pass a provider run ID to the backend
   watchlist service.
4. Use a retry key and inspect the persisted outcome. Do not overwrite an
   existing different list or change broker watchlists.

Open a verified result via [tl-charts](../tl-charts/SKILL.md), or save its
analysis with [tl-research](../tl-research/SKILL.md). Do not invent a match for
unsupported fundamentals, conditions, datasets or indicators.
