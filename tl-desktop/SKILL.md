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

Desktop local access is automatic for the active account unless paused.
Cloud watchlist and saved-screener writes need a separate user grant and real sign-in. Agents
cannot grant permissions, unpause access, or bypass Python isolation.

## Route the task

| Task | Read/load |
| --- | --- |
| Chart context, feeds, snapshots, built-in studies | [tl-charts](../tl-charts/SKILL.md) |
| TLScript custom indicators | [tl-tlscript](../tl-tlscript/SKILL.md) |
| Python indicators / strategy authoring | [tl-python](../tl-python/SKILL.md) |
| Run/review backtests, presets, saved results, overlays | [tl-backtesting](../tl-backtesting/SKILL.md) |
| Sweeps / holdout / walk-forward | [tl-strategy-research](../tl-strategy-research/SKILL.md) |
| Replay / forward paper / simulated orders | [tl-paper-trading](../tl-paper-trading/SKILL.md) |
| Unified Scanner, original strategies/SQL, grid analysis/refinement, Scanned History, saved rules and cloud watchlists | [tl-screening](../tl-screening/SKILL.md) |
| Write/read/edit saved HTML analysis | [tl-research](../tl-research/SKILL.md) |

`workspace.setPanel` opens supported **bottom** panels; it does not select the
right Research sidebar. Use `research.show` for that. `workspace.getActivity`
contains bounded status/error history, not source or credentials.

Never execute real broker orders, private diagnostic JavaScript, or arbitrary
host Python through these skills. Do not fetch, publish or sync user content
to another service unless explicitly requested and supported.
