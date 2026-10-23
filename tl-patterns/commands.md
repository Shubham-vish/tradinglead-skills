# tl-patterns command reference

Generated from a command-catalog snapshot. Recheck the addressed tab before use.
Use explicit tab targeting and inspect the final JSON status. Do not guess IDs or grant permissions.

Do not infer grant permissions from `mutates`: Desktop discovery can omit structured grant metadata. Read [tl-desktop](../tl-desktop/SKILL.md) for the verified local-change versus cloud-watchlist access rules.

## `patterns.getState`

Open Historical Patterns and read the visible draft/revisions, chart ticker, analysis controls and job state. Does not fetch candles.

Retry key: **not required**. External local-assistant access is still required.

Parameters: `{}`.

## `patterns.show`

Open the existing Historical Patterns sidebar, optionally expanded. Keeps the current study and chart unchanged.

Retry key: **not required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `expanded` | Optional boolean. |

## `patterns.hide`

Close Historical Patterns and cancel pending study work. Applied results remain in this account's mounted workspace.

Retry key: **not required**. External local-assistant access is still required.

Parameters: `{}`.

## `patterns.searchSymbols`

Search the active chart feed's NSE catalog. Does not select a ticker, run analysis or switch feeds.

Retry key: **not required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `query` | 1-100 characters. |

## `patterns.configure`

Replace the visible study draft without executing. NSE regular-session 15m only; no provider fallback.

Retry key: **not required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `expectedRevision` | Current draft revision from getState. |
| `query` | {symbol,weekdays,startMinute,endMinute,count,mode,conditionWeekday?}; optional resolution:'15'. ISO weekdays 1-7; IST minutes, exclusive end; count 1-200 candidate weeks; separate\|grouped. |

## `patterns.useChartTicker`

Copy the ready active chart's NSE ticker into the visible draft, without executing or changing the chart.

Retry key: **not required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `expectedRevision` | Current draft revision. |

## `patterns.run`

Start one visible historical study. Poll getResults; may consume provider quota. SQL-backed panes batch selected windows; never silently change sources.

Retry key: **not required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `expectedRevision` | Current draft revision; concurrent studies are rejected. |

## `patterns.cancel`

Cancel this study job. Previous applied results remain labelled separately; provider work already sent is not undone.

Retry key: **not required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `runId` | Current job ID from run or getState. |

## `patterns.getResults`

Read job state and bounded occurrences from the actual filtered study, including all-page statistics and provenance. Does not rerun or open a hidden panel.

Retry key: **not required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `runId` | Job or retained applied-result ID. |
| `offset` | Optional 0-1400, default 0. |
| `limit` | Optional 1-10, default 6. |
| `includeBars` | Optional boolean, default false. At most 175 UTC-ms OHLCV candles per occurrence. |

## `patterns.setAnalysis`

Change the same visible result filters, ordering, rebasing, card size, page or view as the UI. No data request.

Retry key: **not required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `runId` | Applied-result ID. |
| `expectedAnalysisRevision` | Current analysis revision. |
| `analysis` | Partial {direction:all\|down\|up,threshold:0..20,measure:up\|sideways\|recovery,band:0..20,sort:new\|old,rebased:boolean,showExcluded:boolean,density:compact\|comfortable\|large\|xlarge\|xxlarge,view:charts\|statistics\|table,page:0..233}. Discover current values in getState. |

## `patterns.openOccurrence`

Open an exact complete occurrence in the original chart pane through the shared navigator. Preserves source guards; no feed fallback or replay exit.

Retry key: **not required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `runId` | Applied-result ID. |
| `occurrenceId` | Exact ID from getResults. |
