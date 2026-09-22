# tl-screening command reference

Generated from live discovery. Recheck the addressed tab before use.
Use explicit tab targeting and inspect the final JSON status. Do not guess IDs or grant permissions.

Do not infer grant permissions from `mutates`: Desktop discovery can omit structured grant metadata. Read [tl-desktop](../tl-desktop/SKILL.md) for the verified local-change versus cloud-watchlist access rules.

## `screener.listCapabilities`

Discover supported backend screeners and their actual parameters before running a scan.

Retry key: **not required**. External local-assistant access is still required.

Parameters: `{}`.

## `screener.run`

Start a bounded backend scan without changing the visible screener grid. Results may use a one-hour cache; refreshCache bypasses that cache, not stale underlying candles. Poll getResults.

Retry key: **not required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `tickers` | 1-500 canonical tickers |
| `screeners` | 1-5 {name, parameters} from listCapabilities |
| `source` | Optional: default only. Broker-backed scanning is not available. |
| `refreshCache` | Optional boolean |

## `screener.getResults`

Read an owned scan's status, results, evidence and source timestamps.

Retry key: **not required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `runId` | Scan identifier returned by run. |

## `screener.cancel`

Cancel an owned scan. This does not undo a saved watchlist.

Retry key: **not required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `runId` | Scan identifier returned by run. |

## `providerScreener.listCapabilities`

Discover bounded Desktop broker-candle screening, available providers, supported TLScript functions and closed-bar policy. Separate from SQL-backed screeners.

Retry key: **not required**. External local-assistant access is still required.

Parameters: `{}`.

## `providerScreener.run`

Start a paced local TLScript scan over 1-50 explicit broker symbols. No SQL/provider fallback. Newest candle is conservatively excluded; read each row's actual evaluation timestamp. Consumes provider quota.

Retry key: **not required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `feed` | Explicit registered Desktop history provider. |
| `tickers` | 1-50 unique canonical tickers. |
| `source` | TLScript source, at most 12000 characters. |
| `inputs` | Optional declared numeric input map. |
| `interval` | Explicit supported chart resolution. |
| `plotIndex` | Optional zero-based plot index, default 0. |
| `condition` | {operator:gt\|gte\|lt\|lte\|eq,value:finite number} |
| `bars` | Optional 2-1000 history bars, default 500. |

## `providerScreener.getResults`

Read an owned local scan's progress, matches, explicit errors and candle provenance. Runs expire after 30 minutes/reload; no raw candle arrays are returned.

Retry key: **not required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `runId` | Local provider run ID. |

## `providerScreener.cancel`

Cancel a local broker scan and its pending history request. Does not undo watchlist writes or broker quota already consumed.

Retry key: **not required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `runId` | Local provider run ID. |

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
