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
  frozen candles/settings. Use this when the user explicitly wants to review
  the strategy's sample or opt into `autoStrategy`.

1. For a backtest-derived replay, read the completed run first. Call
   `backtesting.replay` with its `runId`; the branch starts flat by default.
2. Manual decisions are the default. Set `autoStrategy:true` only when the
   user wants the saved strategy to run automatically.
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

## Forward paper

`backtesting.forward` starts from a completed backtest on its **fresh live
1-240 minute chart**. It is not supported on daily/calendar intervals. It
seeds flat and is manual by default; automatic sequential strategy use must
be explicit and currently supports Python only. Pine-source backtests can
seed manual paper, not automatic forward Pine execution.

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
model. Manual orders are for manual replay/running manual forward paper, not
an automatic strategy branch.

Forward orders, amendments and protection changes are queued by actual decision
time for subsequently eligible candles; automatic replay closes also wait
for subsequent candles. Earlier terms can remain effective;
inspect `pendingProtection` and event evidence. Do not backdate a new decision
into a candle that has already started. A queued close is not a filled close.

Never substitute a real broker API, reconstruct missing ticks, conceal stale
feed status, or claim paper execution validates real exchange fills/margin.
