---
name: tl-testing
description: Agent-run testing for TradingLead Desktop. The AI executes real commands through the Desktop bridge CLI, inspects state, captures screenshots and judges pass/fail from YAML suites (smoke, charts, layouts/grid, watchlists/markets, alerts, indicators, backtesting, optimization, screening, patterns, paper trading, workflows, LLM-judged quality), with isolation, cleanup and a standard report. Also lists the local deterministic unit-test commands. Use for "run smoke", "run backtesting tests", "test TradingLead", tag-filtered runs or authoring a new suite. Owns no product commands.
---

# TradingLead agent-run testing

Two layers:

1. **Layer 1 - deterministic unit tests** run locally without the app (below).
2. **Layer 2 - agent-run suites**: the AI drives the *real* running Desktop app
   through its bridge, exactly like a user's agent would, then judges results.

Read [tl-desktop](../tl-desktop/SKILL.md) for connection, grants and error codes.
This skill owns no commands ([commands.md](commands.md)); every suite step must
be a command in the generated [command index](../COMMANDS.md). The suites live in
`suites/*.yaml` and `node validate.cjs` (repo root) rejects any step whose
`type`, parameter names, required parameters or retry key disagree with
`command-catalog.json`.

## Startup protocol (Layer 2)

Run every CLI call **from the TradingLead-Desktop checkout** (standard layout:
`../../TradingLead-Desktop` relative to this skill). Never print the token.

```bash
test -f ~/.tradinglead-desktop/api.json   # discovery: {host:127.0.0.1, port, token, pid, instanceId}
node cli.cjs health                       # {status:"ok", data:{ready, version:1}}
node cli.cjs tabs                         # {data:{tabs:[{tabId, active, ready}]}}
node cli.cjs desktop status --tab TAB     # ready, loading, page, frontendConnected
node cli.cjs capabilities --tab TAB       # live catalog array for that tab
node cli.cjs exec workspace.getState --tab TAB
```

1. **Never start, restart or reload the app** for a test run. If the discovery
   file is missing, its `pid` is dead, `health.data.ready` is false or `tabs`
   is empty, stop: report every test as `SKIP (bridge not ready)`.
2. Pick exactly one tab with `ready:true` (prefer `active:true`) and pass
   `--tab TAB` on every call. `TAB_REQUIRED` / `NOT_READY` / `FRONTEND_UNAVAILABLE`
   are environment failures, not product failures. `desktop reconnect` may be
   requested once; `desktop open-access` only opens the user's control.
3. Read `workspace.getState`: record `authenticated`, `allowAgentWrites`,
   `allowAgentIndicators`. Agents **cannot grant permissions**. A suite whose
   `requires.grants` / `requires.signIn` is unmet is `SKIP`, not `FAIL`.
4. Compare `capabilities` with the snapshot: a suite step whose type is absent
   from the live tab is `SKIP (not in live catalog)` and is reported as drift.
5. Generate `run.id` = 8 lowercase alphanumerics, unique per run.
6. **Target origin.** Record `node cli.cjs desktop getOrigin` in the report. Do
   not switch origins during a run unless the user asked to test a local dev
   server. In that case, before step 1, follow the tl-desktop "Development:
   point the app at a local dev server" recipe: check the port answers, then run
   `desktop setOrigin --params '{"origin":"http://localhost:3001","path":"/charts"}'`
   and poll `tabs` until ready. Return with `{"origin":"cloud"}` afterwards. This
   needs a Desktop build with the control; on older builds use the in-app ⌘L
   dialog's Local/Cloud switch, or launch a dev shell with `--url` /
   `ELECTRON_APP_URL`. Never restart the app to change the origin.

### Executing one step

```bash
node cli.cjs exec TYPE --tab TAB --params '{"k":1}' [--key RETRY_KEY]
node cli.cjs exec TYPE --tab TAB --params-file step.json --key RETRY_KEY
node cli.cjs watch --tab TAB            # activity stream while debugging
node cli.cjs cancel --tab TAB --request REQUEST_ID
```

- Output is one JSON envelope: `{status:"ok", data}` or `{status:"error", code, message}`;
  exit code 1 on error. The request ID is printed to stderr. CLI timeout 40 s, 2 MiB cap.
- Mutating commands **require** `--key` (`[A-Za-z0-9_-]{1,80}`). Reusing a key with
  identical params replays the first result; with different params returns `CONFLICT`.
  On `TIMEOUT`/`CANCELLED`, changes may have persisted: retry with the **same** key.
- **Final `status:"ok"` is not job completion.** `backtesting.run` returns
  `preparing`; `backtesting.optimize`, `screening.run`, `patterns.run` return a
  run handle; `workspace.openSidebar` / `setPanel` and desktop controls return
  `confirmed:false`. Always poll the read command named in the suite.
- Write multi-line Pine sources to a params file in the run's artifact directory
  rather than shell-quoting them.

## Isolation and cleanup

- Everything a test creates is named with the `AI TEST` prefix and `{{run.id}}`
  (watchlists, alerts, drawings labels, grid labels, backtest `versionSuffix`).
- Teardown deletes **only** IDs the test itself captured. Never delete, rename,
  pause or edit pre-existing user layouts, watchlists, alerts, saved sources,
  presets or backtest runs, even if they look like test residue from another run:
  report them instead.
- Restore what a test changed (layout, active pane, price scale) from values
  read in setup.
- Never save named chart layouts (no delete command exists), never save Pine
  sources to the library, never start paper/practice orders or forward sessions
  on a real account. No live broker orders exist in TradingLead; tests must not
  imply otherwise.
- Run teardown even after a failed assertion. A teardown failure is reported as
  `LEAK` with the leftover ID and name.
- Suites tagged `costly` (`screening`, `patterns`) consume scan allowance or
  provider quota: run them only when explicitly requested.

## Suite schema

The YAML is a strict subset so it can be validated without a dependency:
block mappings and `- ` sequences, `|` literal blocks, full-line `#` comments,
plain scalars, and **flow values written as JSON** (`{"a": 1}`, `["x"]`,
`"quoted"`). No anchors, inline comments or single-quoted strings.

```yaml
version: 1
suite:
  id: charts                 # must equal the file name
  name: ...
  description: ...
  readOnly: true             # optional; validator forbids mutating steps
  requires: {"grants": ["allowAgentWrites"], "signIn": false}
  cost: consumes-scan-allowance   # optional
  defaults:                  # referenced as {{suite.defaults.NAME}}
    symbol: NSE:TCS-EQ
tests:
  - id: charts.open-symbol
    name: ...
    category: state          # contract | state | visual | workflow
    tags: ["charts", "navigation"]
    setup:                   # optional ordered steps
      - id: before
        type: chart.viewState
        params: {}
    execute:                 # the command under test (id "execute")
      type: chart.setView
      params: {"visibleRange": {"preset": "6m"}}
      idempotencyKey: "ai-test-{{run.id}}-view-set"
    assert:
      response:              # against the execute envelope
        - path: status
          equals: ok
      state:                 # re-read commands, each with assertions
        - label: ...
          kind: poll         # optional
          type: chart.getState
          params: {}
          until: {"path": "data.ready", "equals": true}
          intervalMs: 1000
          timeoutMs: 30000
          assertions:
            - path: data.ready
              equals: true
      visual:
        screenshot: name
        criteria: ["...", "..."]
    teardown:                # always runs
      - id: restore
        type: chart.setView
        params: {"priceScale": {"mode": "normal"}}
        idempotencyKey: "ai-test-{{run.id}}-view-restore"
```

**Step kinds:** `command` (default when `type` is set; `node cli.cjs exec`),
`poll` (repeat the command every `intervalMs` until `until` holds or
`timeoutMs` elapses; timeout = FAIL with last envelope), `cli` (`command:
health|tabs|capabilities|exec`, optional `args`), `desktop` (`action:` a native
Desktop control, run as `node cli.cjs desktop ACTION --tab TAB`), `screenshot`
(`source: window` = run `node cli.cjs desktop screenshot --tab TAB` and use the
returned `data.path` PNG; add `--params '{"selector":"CSS"}'` to crop to one
element. Use `chart.action {"action":"screenshot"}` for the chart PNG), `sleep` (`ms`).

Screenshot fallbacks, in order: (1) `desktop screenshot` (authenticated, every
build that lists it in `desktop capabilities`); (2) only on a **dev build** whose
`desktop appInfo` reports `isDev:true` (or that was launched with
`TL_DIAG_BRIDGE=1`), the diag bridge `GET /capture` described in
`~/.tradinglead-desktop/diag/bridge.json`. Packaged builds have no diag bridge
(no `bridge.json`), and it has no `/js` or `/devtools` routes; (3) OS capture
of the window (macOS `screencapture -x`). Use `desktop logs --params
'{"kind":"events","tail":50}'` instead of reading diag files directly, and record
`desktop appInfo` (version, protocol, per-tab catalog hash and `rejected`
entries) in the report header.

**LLM-judged tests** use `judge: llm`, an ordered `steps` list (same kinds) and
`criteria`; there is no `execute`.

### Interpolation

- `{{run.tabId}}`, `{{run.id}}`, `{{run.nowIso}}`, `{{run.expiresIso}}` (now + 24 h, ISO UTC).
- `{{suite.defaults.NAME}}`.
- `{{steps.ID.<path>}}` - any earlier step's full envelope, e.g.
  `{{steps.run.data.runId}}`; `steps.execute` is available in state/teardown.
  Array indexes are path segments (`data.rows.0.4`). A trailing `* NUMBER`
  multiplies a numeric value.
- When a string is exactly one placeholder, substitute the typed value (number,
  array, object, null); otherwise substitute text.
- An unresolvable placeholder makes the test `ERROR (suite drift)` - do not guess.

### Assertion operators

Paths are dot paths into the envelope (`status`, `code`, `data.metrics.equity`).
Several operators in one entry must all hold.

| Operator | Meaning |
| --- | --- |
| `equals` / `notEquals` | Deep equality after interpolation |
| `exists` | `true`: path present and not undefined; `false`: absent |
| `type` | `string`, `number`, `boolean`, `object`, `array`, `null` |
| `contains` / `notContains` | Array: some element deep-matches the given partial object/value. String: substring |
| `gte` / `lte` / `gt` / `lt` | Numeric comparison |
| `finite` | `true`: a finite number (not NaN/Infinity/null) |
| `oneOf` | Value is one of the list |
| `length` / `minLength` | Exact / minimum array or string length |
| `matches` | JavaScript regular expression on a string |

Backtest metric conventions (from the simulation engine): `maxDrawdown` is a
non-negative amount in account units and `maxDrawdownPct` is 0-100;
`closedLegs` equals the `trades` section `total`; `equity`, `netPnl` must be
finite; `profitFactor` / `winRatePct` may be `null` with zero trades.

## Judging

| Category | PASS when |
| --- | --- |
| `contract` | Envelope shape, codes and documented fields match; error tests fail closed with a stable `code` and no side effect |
| `state` | A follow-up read (not the mutation's own reply) shows the requested state |
| `visual` | Every `criteria` line holds in the screenshot; cite what you saw |
| `workflow` | All steps succeed in order, async jobs reach `completed`, and cleanup leaves no `AI TEST` residue |
| `judge: llm` | Score each criterion PASS/FAIL with one sentence of evidence; any FAIL fails the test |

Outcomes: `PASS`, `FAIL` (product behaviour wrong), `SKIP` (precondition, grant,
sign-in or cost not met), `ERROR` (environment/transport or suite drift), `LEAK`
(teardown left data). Distinguish a product bug from a suite that has drifted:
if a path is missing but the data is clearly present under another name, report
`ERROR (suite drift)` with the actual shape and fix the suite.

## Invocation

| Request | Run |
| --- | --- |
| "run smoke" / "is the bridge OK" | `smoke` only (read-only, safe on a real workspace) |
| "run backtesting tests" | `backtesting`, then `strategy-optimization` if asked for "strategy" broadly |
| "run chart tests" | `charts`, `layouts-grid` |
| "test alerts / watchlists" | `alerts` / `watchlists-markets` |
| "run indicator tests" | `indicators` |
| "run tests tagged X" | every test whose `tags` include X, across suites |
| "run everything" / release check | all suites except `costly` ones unless explicitly included; `smoke` first, abort if it fails |

Suites: [smoke](suites/smoke.yaml), [charts](suites/charts.yaml),
[layouts-grid](suites/layouts-grid.yaml),
[watchlists-markets](suites/watchlists-markets.yaml), [alerts](suites/alerts.yaml),
[indicators](suites/indicators.yaml), [backtesting](suites/backtesting.yaml),
[strategy-optimization](suites/strategy-optimization.yaml),
[screening](suites/screening.yaml), [patterns](suites/patterns.yaml),
[paper-trading](suites/paper-trading.yaml), [workflows](suites/workflows.yaml),
[llm-subjective](suites/llm-subjective.yaml).

Order inside a suite is file order; run one suite at a time on one tab, never
in parallel (pending-command limits return `BUSY`, and chart context is shared).

## Report

Save artifacts (screenshots, params files, raw envelopes with tokens removed)
under `~/.tradinglead-desktop/test-artifacts/<run.id>/` and reply with:

```text
TradingLead test run r1a2b3c4 - tab T, Desktop pid P, catalog N commands
| Suite | Test | Category | Result | Time | Notes |
| smoke | smoke.health | contract | PASS | 0.2s | |
| charts | charts.drawing-lifecycle | state | FAIL | 3.1s | data.items missing id ... |
Totals: 40 PASS, 1 FAIL, 6 SKIP, 0 ERROR, 0 LEAK
Failures: test id, step, command, params (no secrets), expected vs actual, request ID, screenshot path
Skipped: reason per test (grant, sign-in, costly, not in live catalog)
```

## Authoring and maintaining suites

- Add or update a suite whenever a command is added or its contract changes;
  use only parameter names from [commands.md of the owning skill](../COMMANDS.md).
- Mutating steps need `idempotencyKey: "ai-test-{{run.id}}-..."`; read-only
  suites set `readOnly: true`.
- Prefer explicit context (`chart.open` with symbol, feed and interval) over the
  user's current chart.
- Then run `node validate.cjs` and `node tools.test.cjs` in this repository.

## Known gotchas

- `indicators.validate` returns `status:"ok"` with `data.valid:false` for bad
  source; assert on `data.valid`, not the envelope.
- Pine `strategy()` belongs to `backtesting.run` (`language:"pine"`); it is
  rejected by `indicators.apply`. Pine runs reject Python `config`/`parameters`.
- Symbol and interval change only through `chart.open`; `chart.setView` never
  changes them. `chart.*`, `indicators.*` and `studies.*` target the active pane.
- `chart.snapshot` rows are `[time, open, high, low, close, ...]` per its
  `columns`; time is unix seconds and freshness is `not_verified`.
- Alerts, watchlists, screening and patterns need a signed-in account; the
  Scanner has no preview mode.
- `backtesting.delete` needs the run's current `revision`; re-read it right
  before deleting. Optimization reads use `section:"optimization"` and report
  under `data.research`.
- Historical Patterns are NSE 15-minute only within 09:15-15:30 IST.
- Commands can be cancelled by tab/account/pane changes; do not touch the app
  manually during a run.
- `chart.getState.data.ready` is widget readiness and turns true before candles
  arrive; after `chart.open` (which returns `dataReady:false`) poll
  `chart.getState` until `data.dataReady == true`. Suites that call `chart.open` read `chart.getState`
  first and reopen the original symbol/feed/interval in teardown.
- Read-only lookups are side-effect free: `screening.catalog`/`listUniverses`/
  `listHistory`/`listSaved` run headlessly when the Scanner is closed and return
  `opensPanel:false`; `screening.getResults`/`getAnalysis`/`cancel` return
  `RUN_NOT_FOUND` without opening it; `patterns.searchSymbols` never opens
  Patterns. Assert `workspace.getState.sidebar` is unchanged instead of restoring.
  `screening.getState` and `patterns.getState` never open panels; unmounted reads
  return `ready:false,draft:null`. Explicit `screening.show` / `patterns.show`
  and draft-changing commands open their views: those tests read
  `workspace.getState.sidebar` first and restore it with `workspace.openSidebar`
  (verify by re-reading; it only acknowledges).
- With Backtesting docked right, `workspace.setPanel` `backtesting` without
  `dock` only toggles the side panel (bottom tab unchanged). Restore the bottom
  deterministically with `dock:"bottom"` (or `dock:"right"`; `DOCK_UNAVAILABLE`
  below 720px). Verify `workspace.getState.panels.bottom` and `.backtesting`.
- A completed `backtesting.run` is not drawn on the chart: call
  `backtesting.show` before screenshots or `removeFromChart` (otherwise
  `SIMULATION_NOT_ON_CHART`). Right-docked Backtesting panel visibility is
  `workspace.setPanel {"panel":"backtesting","expanded":bool}`.
- `backtesting.run` returns `SIMULATION_HISTORY_FULL` when the account already
  has three saved runs. That is `SKIP (precondition)`: never delete the user's
  runs to make room. Teardown steps that reference a step that never succeeded
  are skipped (nothing was created), not `LEAK`.
- `desktop screenshot` returns `CAPTURE_FAILED` for a hidden/minimized tab
  (activate it first) and `SELECTOR_NOT_FOUND` when nothing visible matches.
  OS screen capture can fail without Screen Recording permission
  (`could not create image from display`). If every fallback fails, visual/LLM
  checks become `SKIP (no capture)`; `chart.action screenshot` needs `allowAgentWrites`.
- `feeds.list` may report `discovery.status:"error"` (`FEED_DISCOVERY_FAILED`,
  bounded `discovery.reason`); the `default` provider must still be available,
  and `chart.getState.data.error` stays null on a working default chart (the
  catalog issue is in `data.feedCatalog`).

## Layer 1: deterministic unit tests

Run these locally; they need no running app. Paths assume the standard Codes
layout.

| Area | Command (from repo root) | When |
| --- | --- | --- |
| Simulation engine, Pine/Python backtests, optimization, paper | `cd TradingLead.in && CI=true npx react-scripts test --watchAll=false src/simulation` | Any backtesting/optimization/paper change |
| Indicators (Pine/Python chart integration) | `cd TradingLead.in && CI=true npx react-scripts test --watchAll=false src/indicators` | Studio, apply/update, chart indicator changes |
| Agent command layer (catalog, validation, alerts, drawings, layouts, grid, screening, watchlists) | `cd TradingLead.in && CI=true npx react-scripts test --watchAll=false src/agent` | Any command added or changed |
| Pine runtime conformance and Pine backtest e2e | `cd TradingLead.in && npm run test:pine` | Pine worker/runtime/strategy changes |
| Desktop bridge, CLI, main process, packaging preflight | `cd TradingLead-Desktop && npm test` | Bridge/CLI/IPC/packaging changes |
| Desktop Python runtime | `cd TradingLead-Desktop && npm run test:python` (and `test:python:frontend`) | Python execution changes |
| Release packaging checks | `cd TradingLead-Desktop && npm run test:release` | Before a Desktop release |
| Skill docs, catalog snapshot, suite validation | `cd tradinglead-skills && node validate.cjs && node tools.test.cjs` | Any skill/suite/catalog change |

Run the narrowest folder first; escalate to Layer 2 suites only after Layer 1
passes for the touched area.
