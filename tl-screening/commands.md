# tl-screening command reference

Source-only snapshot from an isolated frontend registry; installed Desktop was not ready. Rediscover live availability before use.
Use explicit tab targeting and inspect the final JSON status. Do not guess IDs or grant permissions.

Do not infer grant permissions from `mutates`: Desktop discovery can omit structured grant metadata. Read [tl-desktop](../tl-desktop/SKILL.md) for the verified local-change versus cloud-watchlist access rules.

## `screening.getState`

Open Scanner and read draft revision, universe, current view, stages and run status. Requires real sign-in; the current cloud Scanner does not support preview/sample mode.

Retry key: **not required**. External local-assistant access is still required.

Parameters: `{}`.

## `screening.show`

Switch the visible Scanner or Scanned History view without running or changing rules. Leaving historical results clears that comparison.

Retry key: **not required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `view` | scanner\|history; history requires advertised support. |

## `screening.catalog`

Read server presets, fields, SQL schema, original strategy catalog and account limits. Strategy discovery failures are explicit; does not scan.

Retry key: **not required**. External local-assistant access is still required.

Parameters: `{}`.

## `screening.listUniverses`

List available active, saved watchlist, flagged and predefined category choices. Explicit symbols are also supported.

Retry key: **not required**. External local-assistant access is still required.

Parameters: `{}`.

## `screening.configure`

Replace the visible rules and optionally select a universe, without executing. Read getState first.

Retry key: **not required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `definition` | Complete preset/custom/sql/classic definition without tickers; use catalog. Classic uses screeners:[{name,parameters}] from the advertised strategy catalog. |
| `universe` | Optional {kind:active\|watchlist\|flag\|category\|symbols,name?,tickers?}. |
| `expectedRevision` | Required visible draft revision from getState. |

## `screening.run`

Start the visible preset/custom/SQL/Classic scan once. Consumes allowance, including cache hits. Poll getResults; no automatic retry.

Retry key: **not required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `expectedRevision` | Required current visible draft revision. |
| `cacheMode` | Optional refresh or prefer_cache (matching result under 60s); requires advertised support. Classic is refresh-only. |

## `screening.getResults`

Read this visible run's bounded results, warnings and pagination. Closing Scan cancels pending work.

Retry key: **not required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `runId` | Required ID from run. |
| `offset` | Optional zero-based row offset. |
| `limit` | Optional 1-25 rows, default 10. |

## `screening.cancel`

Cancel the current visible run. Already-submitted server work may count toward allowance.

Retry key: **not required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `runId` | Required ID from run. |

## `screening.getAnalysis`

Read the actual visible results grid, discovered column IDs, analysis revision and paged filtered rows across all pages. No query.

Retry key: **not required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `runId` | Current completed run/history ID. |
| `offset` | Optional filtered-row offset, 0-1000. |
| `limit` | Optional 1-25 rows, default 10. |
| `columnOffset` | Optional column offset, 0-10000. |
| `columnLimit` | Optional 1-50 columns, default 25. |

## `screening.setAnalysis`

Change the actual grid's display/filter/selection without scanning. Discover column IDs and revision through getAnalysis first.

Retry key: **not required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `runId` | Current completed run/history ID. |
| `expectedAnalysisRevision` | Current positive analysis revision. |
| `search` | Optional search text, at most 500 characters. |
| `filters` | Replace filters with up to 20 {columnId,operator,value?}; at most two AND conditions per column; operators eq\|neq\|gt\|gte\|lt\|lte\|contains\|startsWith\|endsWith\|blank\|notBlank; typed values. |
| `sort` | Replace sorting with up to 20 {columnId,direction:asc\|desc}. |
| `hiddenColumns` | Replace hidden metric columns with up to 200 discovered IDs. |
| `selectedTickers` | Replace selection with up to 2500 unique canonical returned tickers; hidden selections do not refine. |
| `expanded` | Optional boolean: open/close expanded analysis. |
| `reset` | Optional true to reset the grid; cannot combine with other changes. |

## `screening.refine`

Use the actual filtered or filtered-selected grid stocks as the next universe, retaining prior metric stages. Does not execute; configure next rules without universe, then run.

Retry key: **not required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `runId` | Current completed run/history ID. |
| `expectedRevision` | Current draft revision. |
| `expectedAnalysisRevision` | Current grid revision from getAnalysis. |
| `scope` | filtered\|selected; includes all filtered pages, excludes hidden selections. |

## `screening.listSaved`

Refresh this account's cloud-saved screener metadata. Does not load or run.

Retry key: **not required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `offset` | Optional zero-based offset. |
| `limit` | Optional 1-25 items, default 10. |

## `screening.listHistory`

List this account's retained completed scans, not saved screener rules. Uncharged, no execution.

Retry key: **not required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `offset` | Optional zero-based offset. |
| `limit` | Optional 1-25 metadata items, default 10. |

## `screening.openHistory`

Open a persisted result snapshot in the visible scanner. Does not rerun, consume allowance or change the current draft/universe. Use returned runId with getResults.

Retry key: **not required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `id` | Discovered scan history ID. |

## `screening.useHistorySettings`

Copy the currently opened historical scan's rules and original stocks into the visible draft. No execution; starts an independent comparison on next run.

Retry key: **not required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `runId` | Currently opened historical run ID. |
| `expectedRevision` | Current draft revision. |

## `screening.deleteHistory`

Delete only this account's immutable scan snapshot, not saved rules. Requires real sign-in, cloud-write grant and retry key.

Retry key: **required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `id` | Discovered scan history ID. |

## `screening.load`

Load saved rules into the visible UI without running; retain the currently selected universe.

Retry key: **not required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `id` | Saved screener ID. |
| `expectedRevision` | Required current visible draft revision. |

## `screening.save`

Persist visible rules to this account's cloud storage. Requires real sign-in, cloud-write grant and retry key. Updates need id and etag; omitted id creates a copy.

Retry key: **required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `name` | 1-120 characters. |
| `description` | Optional description up to 1000 characters. |
| `id` | Optional saved ID. |
| `etag` | Required with id. |
| `expectedRevision` | Required current visible draft revision. |

## `screening.delete`

Delete a cloud-saved screener at its current etag. Requires cloud-write grant and retry key; leaves the visible draft intact.

Retry key: **required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `id` | Saved screener ID. |
| `etag` | Current saved etag. |

## `screener.listCapabilities`

Discover supported backend screeners and their actual parameters before running a scan.

Retry key: **not required**. External local-assistant access is still required.

Parameters: `{}`.

## `screener.run`

Start an authenticated, plan-limited cloud scan without changing the grid. Every run consumes account allowance and reads current stored data, not streaming quotes. Poll getResults.

Retry key: **not required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `tickers` | 1-500 canonical tickers, subject to account limits |
| `screeners` | 1-5 {name, parameters} from listCapabilities |
| `source` | Optional: default only. Broker-backed scanning is not available. |
| `refreshCache` | Optional legacy boolean; current screening always reads fresh. |

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

Discover bounded Desktop broker-candle screening, available providers, TLScript-Pine runtime requirements and closed-bar policy. Separate from SQL-backed screeners.

Retry key: **not required**. External local-assistant access is still required.

Parameters: `{}`.

## `providerScreener.run`

Start a paced local TLScript-Pine scan over 1-50 explicit broker symbols. No SQL/provider fallback or invented symbol metadata. Secondary-data requests are unavailable. Newest candle is conservatively excluded; read each row's actual evaluation timestamp. Consumes provider quota.

Retry key: **not required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `feed` | Explicit registered Desktop history provider. |
| `tickers` | 1-50 unique canonical tickers. |
| `source` | Nonempty Pine indicator source; no fixed character cap. Execution and transport limits still apply. |
| `inputs` | Optional declared Pine string, finite-number or boolean inputs, bounded to 8000 serialized characters. |
| `interval` | Explicit supported chart resolution. |
| `plotIndex` | Optional nonnegative safe integer selecting a real numeric plot, default 0. Available plots are discovered from execution, not compilation. |
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
