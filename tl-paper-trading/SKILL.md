---
name: tl-paper-trading
description: Control TradingLead simulation-only historical replay and forward paper sessions, including stepping, pending orders, protection, partial closes and pause/resume. Use for paper execution review; never live broker orders, credential handling or fabricated fills.
---

# Replay and forward paper execution

Start with [tl-desktop](../tl-desktop/SKILL.md) and
[tl-backtesting](../tl-backtesting/SKILL.md). Read `backtesting.capabilities`
and [commands.md](commands.md). These commands are **simulation-only**.

## Historical replay

1. Read a completed backtest.
2. Call `backtesting.replay` with that `runId`. It creates a fresh branch using
   the same frozen candles/settings; it starts flat by default.
3. Manual decisions are the default. Set `autoStrategy:true` only when the
   user wants the saved strategy to run automatically.
4. Read the new branch's revision. Use `step` to advance 1-100 candles for
   manual replay; automatic sequential replay requires exactly one at a time.
5. Inspect `get` after every mutation. Do not infer a fill merely from an
   accepted order. No next candle means no next-candle fill.

## Forward paper

`backtesting.forward` starts from a completed backtest on its **fresh live
1-240 minute chart**. It is not supported on daily/calendar intervals. It
seeds flat and is manual by default; automatic sequential strategy use must
be explicit.

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
time for subsequently eligible candles. Earlier terms can remain effective;
inspect `pendingProtection` and event evidence. Do not backdate a new decision
into a candle that has already started. A queued close is not a filled close.

Never substitute a real broker API, reconstruct missing ticks, conceal stale
feed status, or claim paper execution validates real exchange fills/margin.
