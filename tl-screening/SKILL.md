---
name: tl-screening
description: Operate the unified TradingLead Scanner, original strategies, custom conditions and SQL; inspect/filter/sort/select the real results grid, refine stocks into another scan, reopen Scanned History and reuse saved rules. Also routes legacy jobs and local broker TLScript scans. Explicit tab targeting, revisions, bounded reads and separate cloud-write grants.
---

# Screening and cloud watchlists

Start with [tl-desktop](../tl-desktop/SKILL.md). Read
[commands.md](commands.md) and discover the chosen screening surface before
constructing a request.

## Choose the data source explicitly

| Workflow | Discovery | Execution |
| --- | --- | --- |
| Unified visible Scanner: presets, original strategies, custom rules, SQL | `screening.getState`, `screening.catalog`, `screening.listUniverses` | `screening.configure`, `screening.run`, `screening.getResults` |
| Existing separate backend strategy jobs (not the visible Scanner) | `screener.listCapabilities`, `universe.list` | `screener.run` |
| Local provider candles + bounded TLScript | `providerScreener.listCapabilities`, `feeds.list` | `providerScreener.run` |

Changing a chart to Kite/Fyers does **not** change backend screening to that
provider. Local Python indicators do not automatically become backend filters.

## Unified visible Scanner

### Local login-free UI testing

In a development build on localhost with the existing development-login
configuration, Scan offers **Try sample screener**. This
explicit opt-in uses four synthetic stocks and device-local saved definitions,
not the cloud API. `screening.getState` reports `preview:true` and
`storage:"local-device"`. The same configure/run/results/save/load commands
operate on that visible preview; sample saves use the existing local assistant
grant, never a cloud-write grant. SQL, historical-date queries, unknown stocks,
cloud watchlist writes and opening sample values as real charts are unavailable.

Use this only to demonstrate UI/command behavior. It does not establish that
production login, MySQL, Cosmos, billing or paid-plan enforcement works. Exit
sample preview to restore normal real-sign-in requirements. The preview cannot
activate on production origins or production builds.

Use the `screening.*` family for actions the user should see in the Scan sidebar.
These commands call the same controller and API as its buttons, not a parallel
hidden scanner. Cloud requires real sign-in. The explicitly configured localhost
development account can use a real-data local reader: `development:true` and
`preview:false` are not synthetic sample mode. It cannot write cloud watchlists.
Open `/charts` first. `screening.getState` connects the visible **Scanner** and
returns its draft revision, current view, stage summaries and pending refinement.
Discover the server catalog and available lists. An older running reader may
offer presets/SQL but not strategy endpoints or history, even when source code
has been updated. Do not silently substitute another backend or restart services.

1. Read `screening.getState`, `screening.catalog` and `screening.listUniverses`.
2. Send `screening.configure` with a complete advertised definition and that
   `expectedRevision`. Optional `universe` selects `active`, named `watchlist`,
   `flag`, `category`, or explicit unique canonical `symbols`.
3. Read state again after the UI update. Confirm the definition and list count,
   then call `screening.run` with the new revision. Configuring never runs.
4. Poll `screening.getResults` with the returned `runId`. Paginate using
   `nextOffset`; default 10 and maximum 25 rows per command. Check status,
   warnings, coverage counts and server truncation. Detailed coverage stays in
   the UI. Live run handles and combined comparison chains are tab-only; an
   updated backend separately persists individual scans. Inspect `meta.history`
   instead of assuming every successful scan was saved.
5. Use `screening.cancel` to stop this run. Closing Scan or changing the list
   cancels pending requests. Cancellation targets only the matching running
   query, not completed snapshots or unrelated saves. Already-submitted work
   can still consume allowance. Completed results stay readable while editing
   the next setup; auxiliary allowance-refresh warnings do not cancel them.

Example definition (substitute the revision returned by the addressed tab;
verify the advertised fields and your account permissions first):

```json
{
  "type": "screening.configure",
  "params": {
    "expectedRevision": 1,
    "definition": {
      "mode": "custom",
      "timeframe": "1D",
      "lookback_days": 180,
      "limit": 50,
      "match": "all",
      "conditions": [
        {"field": "close", "op": "gt", "value_field": "sma20"},
        {"field": "rsi14", "op": "lt", "value": 70}
      ]
    },
    "universe": {"kind": "symbols", "tickers": ["NSE:TCS-EQ", "NSE:INFY-EQ"]}
  }
}
```

Presets, nested AND/OR conditions and privileged read-only SQL use the server
contract. SQL access is server-granted, never inferred from an agent's role.
Account execution, lookback, ticker, concurrency and saved-library limits apply
equally to UI and command runs. Do not silently split an oversized list into
extra chargeable scans. Source data can have unresolved split/bonus defects;
report the warning rather than interpreting every price jump as a signal.

### Original strategies in the same Scanner

Discover `screening.catalog.strategiesCatalog.screeners` and their parameter
types/defaults. A `strategiesCatalogError` is an explicit discovery failure, not
an empty successful strategy registry. Use `mode:"classic"` with
`screeners:[{name,parameters}]`; do not send UI `enabled` flags or a pipeline.
Up to five distinct parameter instances may be combined. Original algorithms
are not interchangeable with similarly named presets.

```json
{
  "type": "screening.configure",
  "params": {
    "expectedRevision": 1,
    "definition": {
      "mode": "classic",
      "screeners": [
        {"name": "KernelRegressionStrategy", "parameters": {"timeframe": "1D"}}
      ]
    }
  }
}
```

Substitute a currently discovered name, valid parameters and actual revision.
`getResults.data` contains raw per-stock rule results/errors for Classic.
These are **evaluated rows**, not necessarily matches. Signals remain
rule-defined: `1` is not universally bullish; zero, negative, null and failed
instances are distinct. Successful sibling rules survive partial failures.

### Analyse and refine through the real grid

1. Wait for the current run to complete. Call `screening.getAnalysis` with its
   `runId`; page columns using `columnOffset/columnLimit` and filtered rows with
   `offset/limit`. Use returned column IDs, never guessed SQL field names.
   Row values are projected to the returned column page; traverse both
   paginations for a complete comparison. Reduce page sizes if
   `RESULT_TOO_LARGE` is returned rather than treating omitted data as zero.
2. `screening.setAnalysis` takes that `runId` and `expectedAnalysisRevision`.
   It controls the same search, typed filters, sorting, hidden columns,
   selection and expanded analysis the user sees. Arrays replace the
   corresponding state; omitted fields stay unchanged. `reset:true` is
   exclusive. Invalid requests must not partially change the grid.
3. Read analysis again after a display change. Read `screening.getState` for
   the current draft revision, then call `screening.refine` with both revisions,
   `runId` and `scope:"filtered"` or `"selected"`.
4. Refinement captures real grid-filtered stocks across **all pages**; hidden
   selected stocks are excluded. It only prepares the next input universe.
5. Configure the next rules **without `universe`**, read the new draft revision,
   then explicitly `screening.run`. An explicit replacement universe starts
   an independent comparison instead. The backend receives only ordinary
   current stocks/rules, never prior results or server pipeline metadata.

Earlier columns remain joined by unique canonical ticker. Capped results
represent returned stocks only, not every market match. Aggregate/repeated
SQL rows cannot silently refine into a stock universe. The combined sequence
is tab-only; individual history snapshots persist separately.

After `ANALYSIS_CONFLICT` or `REVISION_CONFLICT`, rediscover and reconsider the
user's current state; never blindly retry a mutation. Expanded analysis is a
real modal; close it with `setAnalysis` (`expanded:false`) before showing setup.

### Scanned History, drafts and cache

Saved **screeners** are reusable rules; saved **scans** are executed snapshots.
`screening.listHistory` lists bounded metadata, not complete results.
`screening.show` with `view:"history"` opens the visible list; `view:"scanner"`
returns to setup. Leaving an opened historical result clears its comparison.

Use `screening.openHistory` with a discovered ID, then `getResults` or
`getAnalysis` with its returned `runId`. Opening does not rerun, charge allowance,
or replace the draft/universe. `screening.useHistorySettings` explicitly copies
that opened snapshot's rules **and original stocks** into the draft; it requires
the current draft revision and does not run. `deleteHistory` deletes only that
snapshot, requires the applicable write grant and retry key, and is never
necessary for a demonstration.

Discover `historySupported` and backend flags first. Missing support is
`HISTORY_UNAVAILABLE`, not empty history. A storage failure leaves computed
results visible with a not-saved warning. Retention is server-advertised.
Local draft restoration preserves unfinished setup independently of history;
it never executes or creates a saved screener.

Cloud presets/custom/SQL default to `cacheMode:"refresh"`; optional
`"prefer_cache"` requires advertised support and may reuse an exact request
under 60 seconds old. Hits still consume allowance. Classic is refresh-only.
Neither recalculation nor a cache timestamp proves underlying market freshness.

### Save, load and reuse

`screening.listSaved` refreshes account-owned metadata and etags; paginate it.
`screening.load` takes an ID and the current draft revision. It updates the
visible **Saved screener** dropdown and rule editor, retains the current input
list, and does not run. The same saved rules can therefore scan a different
watchlist, flag list, category or explicit stock selection.

`screening.save` persists the current visible definition with a name, optional
description and `expectedRevision`. Omit `id` to create a new screener/copy;
an update requires both its `id` and current `etag`. `screening.delete` requires
`id` and `etag`, leaves the visible draft intact, and deletes only that account's
record. Both require a retry key and the user's **Allow AI watchlist and
saved-screener changes** grant. Never enable that grant programmatically.
Inspect `persisted:true`; after a conflict refresh instead of overwriting.
An uncertain timed-out save must be inspected in the original account before
retrying, especially after a tab reload (retry receipts are session-local).

### Backend scan

Discover actual screener names/parameters. Supply 1-500 canonical tickers and
1-5 supported screener configurations. Source is the backend `default` surface,
not a guessed broker ID. Poll `screener.getResults` using the returned run ID.

The public backend scan now uses the authenticated, plan-limited screening
path and reads current stored candles. `refreshCache` is only a compatibility
parameter, not proof of fresh market data. Legacy `screener.*` job handles remain
separate from the visible Scanner; use `screening.*` with `mode:"classic"` for
original strategies in the visible comparison workflow.

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
