---
name: tl-paper-trading
description: Use TradingLead's manual replay practice, backtest-derived replay and forward paper sessions: simulated orders, protection, partial closes and pause/resume. Not strategy research, simulator development, standalone chart playback or live broker orders.
---

# Replay and forward paper execution

Start with [tl-desktop](../tl-desktop/SKILL.md). Read `backtesting.capabilities`
and [commands.md](commands.md). These commands are **simulation-only**.
Use [tl-backtesting](../tl-backtesting/SKILL.md) for a backtest-derived branch
or shared saved-run operations, not as a prerequisite for direct manual
practice. Use [tl-charts](../tl-charts/SKILL.md) for standalone chart playback;
moving a chart cursor is not placing a paper order.

Paper and backtests share chart arrows, entry/exit labels and position-level
styles. The selected-label mode shows the selected or latest visible exit;
all-visible labels also show entry quantity and price. Same-candle legs share
a bounded label while the ledger retains every leg. Paper alone offers eligible
close/protection actions; backtest levels are read-only.
Shared appearance preview/apply/cancel uses `backtesting.setChartOptions`;
see [tl-backtesting](../tl-backtesting/SKILL.md). It changes no paper orders,
virtual balance or clock.

The separate synthetic **Practice Labs** at `/lab/practice/*` are guided
human-operated lessons, not `backtesting.practice` paper sessions. Their
navigation, coach, progress and reset intentionally have no AI commands.
Never send normal-account commands to guessed training scopes.

## Historical replay and direct practice

Two entry points exist; do not create a strategy backtest just to trade a
paused replay cursor:

- `backtesting.practice` starts manual paper trading **directly from a paused
  chart replay cursor**, capturing bounded candles from the original source
  with virtual capital/costs and no Python or strategy execution. Confirm
  replay cursor, chart feed, symbol and interval first. Its `config` is
  optional; read the returned run/revision before placing orders.
- `backtesting.replay` branches from a **completed backtest** and uses its
  frozen candles. Python branches retain its shared-engine configuration.
  Pine branches use a neutral zero-cost shared-paper config, **not** Pine
  declaration commission/margin semantics. Inspect the returned `config`.
  Use this when the user explicitly wants to review the strategy's sample;
  `autoStrategy:true` is supported for Python only, not Pine.

1. For a backtest-derived replay, read the completed run first. Call
   `backtesting.replay` with its `runId`; the branch starts flat by default.
2. Manual decisions are the default. Set `autoStrategy:true` only for an
   explicitly requested Python strategy branch.
3. Read the new branch's revision. Use `step` to advance 1-100 candles for
   manual replay; automatic sequential replay requires exactly one at a time.
4. Inspect `get` after every mutation. Manual replay market entries and
   reduce-only closes execute at the **current revealed candle close**, including
   the final candle, with configured costs. Inspect `orderExecution` for actual
   filled/rejected outcomes. Other order types/protection require subsequent
   candles; an accepted order alone is not a fill.

Interval notes: single-stock practice may be recaptured at another interval
by the chart; changes that overlap open exposure are rejected and restored, and
sessions rebased this way report `analytics: null` with a reason (balance and
ledger stay valid). Multi-stock sessions keep one fixed interval.

Direct practice can share one balance/clock across up to 10 same-feed/currency
stocks, with one net position per stock and no FX conversion. **Adding a ticker**
uses the native Continue replay confirmation, not a public add-instrument
command. Likewise interval recapture is a guarded native chart transition, not
an invented `backtesting.setInterval`. `show`/order actions can address an
already captured `symbol`; they cannot add uncaptured history. Do not automate
past a pending Continue/Stop/Cancel decision.

`backtesting.back` with `{runId,expectedRevision}` undoes the last Next/Play
step **and subsequent actions**, restoring ledger, orders, exposure and balance.
It is for direct manual practice, not frozen backtest replay or forward paper.
Check `paper.canGoBack`; up to 20 recent checkpoints are persisted within a
bounded budget. An interval change or history roll invalidates them. Revision
numbers still increase after rewind; this is not cancellation of one filled order.

At captured-history boundaries, `step` can fetch later closed candles for direct
practice from the saved feed. Inspect `paper.history`, `canStep` and
`canLoadMore`: waiting/retry is not confirmed exhaustion. Candle windows roll
at 5,000 while balance, orders and ledger remain; full-history analytics then
become unavailable. Backtest-derived replay remains frozen.

## Forward paper

`backtesting.forward` starts from a completed backtest on its **fresh live
1-240 minute chart**. It is not supported on daily/calendar intervals. It
seeds flat and is manual by default; automatic sequential strategy use must
be explicit and currently supports Python only. Pine-source backtests can
seed manual paper, not automatic forward Pine execution.
As with replay, Pine manual forward uses the neutral shared-paper config, not
the original Pine fee/margin model; read the returned warning/config.

A supplied session schedule needs an IANA timezone, ISO weekdays, open/close,
holiday dates and `source:"user-assumption"`. Omission inherits saved defaults;
explicit null selects strict continuous intervals. Never label guessed sessions
exchange-verified or fabricate missing candles.

Staleness, corrections, context changes or unknown gaps can pause the clock.
Reload never resumes it. `pause` does not close exposure or delete orders.
`resume` requires the current revision and original fresh context; `catchUp`
is explicit and bounded to 100 available contiguous closed candles.

## Manual orders and protection

After reading the **current** run revision:

- `order`: queue market/limit/stop/stop_limit entry or exit terms.
- `cancelOrder`: cancel a still-pending order, not an already-filled one.
- `replaceOrder`: full replacement terms for a pending order, atomically.
- `protect`: change position stop-loss/target/trailing protection.
- `close`: queue a full or explicitly sized partial reduce-only close.

These need retry keys; use actual returned order/run IDs. Read current
capabilities for order fields, sizes, instrument rules and the single-position
model. Repeated same-side entries can scale into that net position and update
its average entry; fill/partial-exit ledger rows remain separate. Quantity units,
fees and buying-power assumptions come from the returned instrument/config,
not an inferred broker lot size. `order` rejects automatic strategy branches;
use a manual branch for discretionary entries.

For multi-stock direct practice, `order`, `protect`, `close`, `replaceOrder`,
`cancelOrder` and `show` accept an optional captured `symbol`; pending order IDs
can identify their instrument. `close` also accepts `all:true` for an atomic
current-close liquidation of this manual replay account. Do not combine `all`
with `symbol` or `quantity`; stale markets reject it. This is not a broker
close-all or an end-of-history auto-liquidation.

Forward orders, amendments and protection changes are queued by actual decision
time for subsequently eligible candles; automatic replay closes also wait
for subsequent candles. Earlier terms can remain effective;
inspect `pendingProtection` and event evidence. Do not backdate a new decision
into a candle that has already started. A queued close is not a filled close.

Never substitute a real broker API, reconstruct missing ticks, conceal stale
feed status, or claim paper execution validates real exchange fills/margin.

## Review, preserve and start fresh

1. Read `workspace.getState` / `chart.getState`, intended replay cursor and
   `backtesting.capabilities`. External paper mutations require sign-in, enabled
   AI access and the local indicator/backtesting grant, not watchlist permission.
   Manual practice does not require Python readiness.
2. `backtesting.practice` takes only optional `config`; do not send a source,
   backtest `runId`, symbol, interval or account override. Read its returned
   `runId`/revision, then submit e.g.
   `order` with `{runId,expectedRevision,order:{side:"buy",type:"market",quantity:1}}`.
   Use actual IDs/revisions and fresh retry keys, not these illustrative values.
3. Reread `get` after each operation; inspect `orderExecution`, positions,
   pending orders/protection and event evidence. A saved account with
   `chart.error` needs `show`, not another order submission.
4. Read `get` pages `trades`/`events`/`equity`, `metrics`, `analytics` and
   `analyticsUnavailableReason`. Multi-stock, rebased-interval or windowed runs
   can have no single-series analytics without losing their balance/ledger.
   Risk annualization requires explicit regular-sampling assumptions.
5. Pause forward work before revision-pinned chunked `export` or `librarySave`.
   All three active slots include stopped sessions and backtests. Archive first,
   verify success, then delete only with explicit authorization if freeing a slot.
   `show` resumes the saved chart view, not a forward clock; `removeFromChart`
   removes overlays, not orders or the session.

There is **no account-reset/stats-reset command**. For a fresh virtual balance,
start a new direct practice session from a paused native replay cursor; the
old account stays intact and consumes its slot until explicitly removed.
`back` is bounded rewind, not reset. Playback speed, pause-on-order preference,
toolbar docking and chart-price picking are native UI controls; exact paper
protection values are supported through `protect`, not a guessed pick command.
Guided Practice Lab reset remains human-only.

Saved run cloud backup is a separately configured manual History UI workflow,
not automatic paper persistence or a public `backtesting.cloud*` API; see
[tl-backtesting](../tl-backtesting/SKILL.md). Reload restores local evidence but
never resumes a forward clock. Current source support is not proof of installed
tab availability or real-provider/native-chart acceptance; rediscover first.
