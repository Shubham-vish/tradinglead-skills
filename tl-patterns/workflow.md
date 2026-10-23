# Historical Patterns

Start with [tl-desktop](../tl-desktop/SKILL.md) and discover `patterns.*` in the addressed tab.
Exact command fields are in [commands.md](commands.md).
Patterns studies one NSE ticker across dated 15-minute windows. Scanner screens
a stock universe; Chart Grid displays multiple tickers. Neither is a substitute.

## Configure without running

1. Read `chart.getState` and `patterns.getState`. The latter opens the panel and
   returns its draft, normalized query, validation, revision, analysis revision,
   current chart-ticker readiness, current job and separately identified applied
   result. `patterns.show` can set `expanded`; `patterns.hide` cancels pending
   analysis but retains an already applied result.
2. Search with `patterns.searchSymbols` (`query`, up to 25 results) or explicitly
   copy the ready native chart ticker with `patterns.useChartTicker` and the
   current `expectedRevision`. Neither action fetches historical candles.
3. Replace the draft with `patterns.configure`. Use exact canonical tickers.
   The query fields are `symbol`, optional `resolution:"15"`, `weekdays`,
   `startMinute`, `endMinute`, `count`, `mode`, optional `conditionWeekday`.
   Omitted study fields use defaults; send all intended fields rather than
   assuming a patch. Do not send the derived `focus` field from normalized state.

```json
{
  "type": "patterns.configure",
  "params": {
    "expectedRevision": 1,
    "query": {
      "symbol": "NSE:TCS-EQ",
      "resolution": "15",
      "weekdays": [1],
      "startMinute": 555,
      "endMinute": 630,
      "count": 200,
      "mode": "separate"
    }
  }
}
```

Substitute the actual revision. This means Monday 09:15-10:30 IST, with an
exclusive end and five candles per complete window. ISO weekdays are Monday 1
through Sunday 7. Supported windows are 15-minute aligned within 09:15-15:30 IST.
`count` is 1-200 completed **candidate weeks**, not guaranteed trading sessions:
Monday plus Wednesday over 200 weeks produces 400 separate candidate rows.

`mode:"grouped",weekdays:[5,1],conditionWeekday:5` means Friday followed by
Monday. Order is meaningful; the group must fit one seven-day cycle. Multi-day
groups derive a next-selected-session outcome. They never substitute a holiday
with another trading day. Separate studies use a first-candle condition and the
remaining candles as outcome; a one-candle window has no subsequent outcome.

## Run, poll, inspect

1. Reread state and explicitly call `patterns.run` with `expectedRevision`.
   It returns a job `runId` promptly. Concurrent starts are rejected. No retry
   key is required, but a repeated start can consume provider quota: never
   automatically rerun after uncertain transport completion.
2. Poll `patterns.getResults` with that ID. Distinguish `running`, `completed`,
   `failed` and `cancelled`. A failed refresh returns no rows and may name a
   `previousResultRunId`; request that ID explicitly to inspect old results.
   Never present old rows as success for the new query.
3. Completed results include the applied query, cutoff, source identity,
   provenance, actual request count, coverage, all-page statistics and bounded
   rows. Default six, maximum ten rows per read; follow `nextOffset`.
   `includeBars:true` returns original UTC-millisecond OHLCV, not rebased display
   prices. At most 175 candles per grouped occurrence. Missing/partial windows
   are not zero-return days or proof of a market holiday.
4. Cancel the exact current job with `patterns.cancel`. Hiding the panel,
   account/pane/source changes or loss of agent access can cancel pending work.
   Cancellation cannot undo provider work already submitted.

An unavailable chart blocks analysis. The cloud source batches all selected
windows in one request; supported local/provider sources use their own paged
history. Do not switch feeds, exit replay or substitute cloud data to make a run
succeed. A missing backend route requires an updated service, not per-day retries.

## Filter and navigate without rerunning

Read the current `analysisRevision`, then call `patterns.setAnalysis` with the
applied-result `runId`, `expectedAnalysisRevision` and partial `analysis`.
The controls are the same ones visible in the panel:

- `direction`: all/down/up; `threshold`: 0-20 percent.
- `measure`: up/sideways/recovery; `band`: 0-20 percent for sideways.
- `sort`: new/old; `rebased` and `showExcluded`: booleans.
- `density`: compact/comfortable/large/xlarge/xxlarge.
- `view`: charts/statistics/table; `page`: zero-based, six occurrences per UI page.

Change `page` alone, after applying filters and rereading state. Revisions change
when either the person or the command changes controls. Reread rather than
blindly retrying a revision conflict. Statistics cover all filtered eligible
rows, not just the returned page; honor `statistics.valid`.

`patterns.openOccurrence` requires the exact `occurrenceId` returned by
`getResults` and its applied-result `runId`. It uses the shared original-pane
navigator, supports only complete occurrences, retains source verification and
waits for the dated navigation. It is not an arbitrary date/source override.
An expanded chart dialog is a visual UI affordance; use bounded original bars
for numerical inspection rather than scraping a chart image.

These commands change tab-local UI state, not saved cloud rules. They need
local assistant access but not the cloud-write grant. Studies last only while
the account workspace stays mounted. Observed frequencies are descriptive
history, not predictions or independently validated trading strategies.
