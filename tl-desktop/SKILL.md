---
name: tl-desktop
description: Connect to TradingLead Desktop and route trading-analysis tasks to verified commands. Use for TradingLead automation, tab targeting, command discovery, connection readiness, local assistant access, workspace panels, retries and choosing indicator, backtesting, screening or HTML research skills. Not ContentLead and not live broker execution.
---

# TradingLead Desktop - connection and workflow router

Load this before using any TradingLead product command. Read
[commands.md](commands.md) for this skill's exact command fields and native
Desktop controls. Use the installed app's live capabilities as authoritative.

## Connect without exposing credentials

The normal terminal entry point is `TradingLead-Desktop/cli.cjs`. In the standard
Codes layout it is `../../TradingLead-Desktop/cli.cjs` relative to this skill.
Resolve the actual checkout; do not assume the terminal's working directory.
The examples below run **from the TradingLead-Desktop repository**.

```bash
node cli.cjs health
node cli.cjs tabs
node cli.cjs desktop status --tab ACTUAL_TAB_ID
node cli.cjs capabilities --tab ACTUAL_TAB_ID
node cli.cjs exec workspace.getState --tab ACTUAL_TAB_ID
node cli.cjs exec chart.getState --tab ACTUAL_TAB_ID
```

1. Check health and tabs. If Desktop is not running, launch the installed app,
   or use the existing repo's documented `npm run dev`. Do not start a duplicate
   instance or guess an installation path.
2. Select the intended native tab. Even with one tab, pass `--tab` explicitly.
   Never choose another tab just because the requested one is unavailable.
3. Check account, chart symbol/feed/interval and permissions before changing
   anything. Readiness does not certify fresh market data.
4. Read that tab's current catalog and the domain capability command before
   authoring code or executing a strategy. Do not invent functions or fields.
5. If not ready, `desktop status` works before workspace registration.
   `desktop reconnect` retries existing access; it cannot grant access.
   `desktop open-access` opens the user control, not an approval bypass.
   Do not reload the page merely to reconnect: unsaved work may exist.

The CLI reads private local discovery itself. Never print the discovery token,
put it in command-line arguments, paste raw diagnostic state, or reuse discovery
across app restarts. Browser-only tabs do not provide this external transport.

## Command and retry protocol

```bash
node cli.cjs exec research.list --tab ACTUAL_TAB_ID
node cli.cjs exec research.create --tab ACTUAL_TAB_ID \
  --params-file report-params.json --key UNIQUE_OPERATION_KEY
node cli.cjs exec pythonIndicators.apply --tab ACTUAL_TAB_ID \
  --source-file indicator.py --params-file input-params.json --key UNIQUE_OPERATION_KEY
```

`--params-file` is a JSON **parameter object**, not a `{type,params}` envelope.
`--source-file` populates `source`; for research HTML use `html` in a params file.
Do not combine `--params` with `--params-file`.

- All descriptors marked `mutates:true` require a unique retry key. Reuse that
  key and identical parameters only when reconciling the same operation.
- Require the **final** JSON `status:"ok"`. HTTP acceptance, request ID or
  process startup is not completion. Inspect domain states such as `preparing`,
  `running`, `paused`, `completed`, and `valid:false` separately.
- The CLI emits an accepted request ID to stderr. A timeout or cancelled
  transport may leave a persisted write. Inspect before retrying; never issue
  a fresh key automatically after an uncertain write.
- `node cli.cjs cancel --tab TAB --request REQUEST_ID` cancels a transport
  request. A scan/backtest job has its own domain cancellation command.
- Current source transport caps JSON at 2 MiB; older packaged bridges can have
  stricter limits. Domain limits still apply: scanner rows/columns and exports
  remain separately bounded and paginated. Do not concatenate maximum-sized
  source and parameter payloads and assume they fit.
- Identity comes from the active app session, not a `userId` command parameter.
  Stop and rediscover on account changes.
- Current catalogs retain `permission:"indicators"` for local indicator and
  backtesting changes. Older bridges may omit it: absence is not an access
  grant. Pine errors can include bounded diagnostic locations, runtime stage
  context and optional profiles; generic errors do not expose arbitrary
  native fields. Python apply retains its bounded diagnostic text.
- External Pine save/apply/update and Python save/apply default to visible
  Studio presentation; `showInStudio:false` opts out. Check `data.studio`:
  a presentation error with `operationCompleted:true` does not undo the
  mutation. Preserve its IDs and retry only `indicators.openEditor` after
  resolving the blocker; never recreate an applied instance to reopen its UI.
  Dirty drafts are preserved. Read `indicators.editorState.visible` rather
  than assuming a mounted/embedded editor is visible.

## Read error codes, not messages

Current Desktop bridges forward short, single-line domain messages (for
example which parameter is invalid). Messages that could carry URLs, file
paths, credentials or Python runtime text are replaced with `"Command failed."`;
older packaged bridges always replace them. Act on `code` first and use the
message as detail:

| Code | Meaning and next step |
| --- | --- |
| `INVALID_PARAMS` | Parameters are strict: an unknown key, wrong type or out-of-range value. Reread that exact command's descriptor and send only its listed keys (e.g. `backtesting.run` takes `versionSuffix`, `backtesting.applyStrategy` takes `version`). |
| `CHART_NOT_READY` / `CHART_CHANGED` / `SIMULATION_CONTEXT_CHANGED` | Poll `chart.getState` until `ready:true` on the intended context, then retry with a **new** key. |
| `REVISION_CONFLICT` / `REVISION_REQUIRED` | Reread the item and pass its current revision. |
| `SIMULATION_HISTORY_FULL` | Active-run slots are full. Save to the library or ask before deleting; never delete user runs automatically. |
| `BACKTEST_COMPARISON_INCOMPATIBLE` | The runs differ in sample, mode/state or horizon, or include a legacy Pine re-simulation; see [tl-backtesting](../tl-backtesting/SKILL.md). |
| `STRATEGY_ALREADY_APPLIED` | `backtesting.removeStrategy` first, only if the user intends to replace it. |
| `UNSUPPORTED_FEED` / `UNSUPPORTED_SYMBOL` / `DESKTOP_REQUIRED` | Pick a feed/interval from `feeds.list`; no fallback is chosen for you. |
| `SIGN_IN_REQUIRED` / `AGENT_DISABLED` / `APPROVAL_REQUIRED` | Only the user can resolve these; report and stop. |

`workspace.getActivity` lists recent codes. If the code alone is ambiguous,
ask the user to read the message shown in the app rather than guessing.

Desktop local access is automatic for the active account unless paused.
Cloud watchlist and saved-screener writes need a separate user grant and real sign-in. Agents
cannot grant permissions, unpause access, or bypass Python isolation.

## Route the task

Choose the outcome owner below, not every skill containing the same language
or command prefix. Connection guidance is shared; companion workflows are
needed only when the request crosses their boundary. A Pine backtest does not
require the Python guide, and direct paper practice does not require a backtest.

| Task | Read/load |
| --- | --- |
| Chart context, feeds, snapshots, built-in studies, saved chart alerts | [tl-charts](../tl-charts/SKILL.md) |
| Historical Patterns: one ticker across weekdays/IST windows, filters, statistics and dated chart navigation | [tl-patterns](../tl-patterns/SKILL.md) |
| TLScript-Pine custom indicators (not Pine strategy chart apply) | [tl-tlscript](../tl-tlscript/SKILL.md) |
| Python indicators / strategy authoring | [tl-python](../tl-python/SKILL.md) |
| Run/review Python or Pine backtests, applied strategies, presets, saved results, overlays | [tl-backtesting](../tl-backtesting/SKILL.md) |
| Sweeps / holdout / walk-forward | [tl-strategy-research](../tl-strategy-research/SKILL.md) |
| Replay-to-trade direct practice / backtest-derived replay / forward paper / simulated orders | [tl-paper-trading](../tl-paper-trading/SKILL.md) |
| Unified Scanner, original strategies/SQL, grid analysis/refinement, Scanned History, saved rules and cloud watchlists | [tl-screening](../tl-screening/SKILL.md) |
| Write/read/edit saved HTML analysis | [tl-research](../tl-research/SKILL.md) |

`workspace.setPanel` opens supported **bottom** panels; it does not select the
right Research sidebar. Use `research.show` for that. `workspace.getActivity`
contains bounded status/error history, not source or credentials.
Availability of a command in this repository or the source checkout is not
proof of its availability on another tab, browser, packaged release or cloud
deployment. Use `capabilities --tab` for the intended running tab and read
its domain readiness; read-only discovery cannot guarantee fresh candles.

Never execute real broker orders, private diagnostic JavaScript, or arbitrary
host Python through these skills. Do not fetch, publish or sync user content
to another service unless explicitly requested and supported.
