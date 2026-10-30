# tl-paper-trading command reference

Source-only snapshot from an isolated frontend registry; installed Desktop was not ready. Rediscover live availability before use.
Use explicit tab targeting and inspect the final JSON status. Do not guess IDs or grant permissions.

Do not infer grant permissions from `mutates`: Desktop discovery can omit structured grant metadata. Read [tl-desktop](../tl-desktop/SKILL.md) for the verified local-change versus cloud-watchlist access rules.

## `backtesting.practice`

Start manual replay trading from the paused chart cursor. Local-only shared virtual balance and clock, up to 10 same-feed/currency instruments, one net position per instrument. Single-stock execution interval may change through guarded native recapture; multi-stock sessions keep one shared interval. Switching stocks requires explicit chart confirmation. No strategy or real orders.

Retry key: **required**. External local-assistant access is still required.
Local indicator/backtesting grant required.

| Parameter | Contract |
| --- | --- |
| `config` | Optional simulation config. Defaults: 100000 virtual units, no automatic brackets, shorting allowed, zero warmup; configured costs still apply. |

Compatibility alias: `simulation.practice`. Same validation, grants, cancellation, runtime and retry identity; prefer the canonical name.

## `backtesting.replay`

Create a fresh paper-replay branch from a completed backtest using identical frozen candles/settings. Starts flat by default; automatic strategy is explicit. Never live orders.

Retry key: **required**. External local-assistant access is still required.
Local indicator/backtesting grant required.

| Parameter | Contract |
| --- | --- |
| `runId` | Completed backtest ID. |
| `autoStrategy` | Optional boolean, default false. |
| `startIndex` | Optional initial historical candle index. |

Compatibility alias: `simulation.replay`. Same validation, grants, cancellation, runtime and retry identity; prefer the canonical name.

## `backtesting.forward`

Start local forward PAPER from a completed backtest on its fresh live 1-240 minute chart. Seeds flat; manual by default, optional sequential Python. No broker orders.

Retry key: **required**. External local-assistant access is still required.
Local indicator/backtesting grant required.

| Parameter | Contract |
| --- | --- |
| `runId` | Completed backtest ID. |
| `autoStrategy` | Optional boolean, default false. |
| `sessionSchedule` | Optional explicit {timeZone,weekdays:[ISO1-7],open:HH:mm,close:HH:mm,holidays:[YYYY-MM-DD],source:user-assumption,label?}. Omit inherits source-run defaults; null uses strict continuous intervals. Pinned for life of forward run. |

Compatibility alias: `simulation.forward`. Same validation, grants, cancellation, runtime and retry identity; prefer the canonical name.

## `backtesting.pause`

Stop a forward-paper clock without closing exposure or deleting orders. Never auto-resumes.

Retry key: **required**. External local-assistant access is still required.
Local indicator/backtesting grant required.

| Parameter | Contract |
| --- | --- |
| `runId` | Forward run ID. |
| `expectedRevision` | Current revision. |

Compatibility alias: `simulation.pause`. Same validation, grants, cancellation, runtime and retry identity; prefer the canonical name.

## `backtesting.resume`

Explicitly resume paused forward paper on the original fresh live chart. Stale data/corrections/gaps block it. Missed contiguous candles require explicit catchUp.

Retry key: **required**. External local-assistant access is still required.
Local indicator/backtesting grant required.

| Parameter | Contract |
| --- | --- |
| `runId` | Forward run ID. |
| `expectedRevision` | Current revision. |
| `catchUp` | Optional boolean, default false; account for up to 100 missed contiguous closed candles. |

Compatibility alias: `simulation.resume`. Same validation, grants, cancellation, runtime and retry identity; prefer the canonical name.

## `backtesting.step`

Advance historical replay. Manual practice fetches the next bounded page from its saved feed when captured candles run out, retaining the same account. Inspect paper.history for waiting/search limits. Backtest-derived replay remains frozen; automatic sequential mode steps exactly one. Forward paper advances only from its feed. No next candle means no fill.

Retry key: **required**. External local-assistant access is still required.
Local indicator/backtesting grant required.

| Parameter | Contract |
| --- | --- |
| `runId` | Replay ID. |
| `expectedRevision` | Required current run revision. |
| `count` | 1-100, default 1; automatic sequential mode requires 1. |

Compatibility alias: `simulation.step`. Same validation, grants, cancellation, runtime and retry identity; prefer the canonical name.

## `backtesting.back`

Rewind manual practice replay to the state before its last Next/Play step: the candle, fills, orders and balance from that step and anything placed since are undone. Saved with the session (recent steps, bounded in size); unavailable after history is rolled or the interval changes.

Retry key: **required**. External local-assistant access is still required.
Local indicator/backtesting grant required.

| Parameter | Contract |
| --- | --- |
| `runId` | Replay ID. |
| `expectedRevision` | Required current run revision. |

Compatibility alias: `simulation.back`. Same validation, grants, cancellation, runtime and retry identity; prefer the canonical name.

## `backtesting.order`

Submit an entry/exit for MANUAL replay or running manual forward paper. Replay market orders fill at the current revealed close with costs; other orders and protection use later candles. Forward fills require a candle opening after the decision. Inspect orderExecution for filled/rejected immediate outcomes.

Retry key: **required**. External local-assistant access is still required.
Local indicator/backtesting grant required.

| Parameter | Contract |
| --- | --- |
| `runId` | Replay/forward ID. |
| `expectedRevision` | Current run revision. |
| `order` | {side:buy\|sell,type,quantity,limitPrice?,stopPrice?,stopLoss?,takeProfit?,trailingStopPct?,reduceOnly?} |
| `symbol` | Optional captured paper-session instrument; defaults to the displayed instrument (pending orders infer their instrument). |

Compatibility alias: `simulation.order`. Same validation, grants, cancellation, runtime and retry identity; prefer the canonical name.

## `backtesting.cancelOrder`

Cancel a pending paper order; filled orders cannot be cancelled. Forward cancellation is queued for candles opening after the decision; earlier terms remain effective.

Retry key: **required**. External local-assistant access is still required.
Local indicator/backtesting grant required.

| Parameter | Contract |
| --- | --- |
| `runId` | Replay/forward ID. |
| `expectedRevision` | Current run revision. |
| `orderId` | Pending order ID. |
| `symbol` | Optional captured paper-session instrument; defaults to the displayed instrument (pending orders infer their instrument). |

Compatibility alias: `simulation.cancelOrder`. Same validation, grants, cancellation, runtime and retry identity; prefer the canonical name.

## `backtesting.replaceOrder`

Replace pending paper order terms atomically; invalid input preserves the original. Forward amendments are queued by decision time, never backdated into the forming candle.

Retry key: **required**. External local-assistant access is still required.
Local indicator/backtesting grant required.

| Parameter | Contract |
| --- | --- |
| `runId` | Replay/forward ID. |
| `expectedRevision` | Current run revision. |
| `orderId` | Pending order ID. |
| `order` | Full replacement order, same fields as simulation.order. |
| `symbol` | Optional captured paper-session instrument; defaults to the displayed instrument (pending orders infer their instrument). |

Compatibility alias: `simulation.replaceOrder`. Same validation, grants, cancellation, runtime and retry identity; prefer the canonical name.

## `backtesting.protect`

Change paper position protection. Forward changes are queued for candles opening after the decision. No broker call; inspect pendingProtection for queued terms.

Retry key: **required**. External local-assistant access is still required.
Local indicator/backtesting grant required.

| Parameter | Contract |
| --- | --- |
| `runId` | Replay/forward ID. |
| `expectedRevision` | Current run revision. |
| `protection` | {stopLoss?:positive\|null,takeProfit?:positive\|null,trailingStopPct?:0-99} |
| `symbol` | Optional captured paper-session instrument; defaults to the displayed instrument (pending orders infer their instrument). |

Compatibility alias: `simulation.protect`. Same validation, grants, cancellation, runtime and retry identity; prefer the canonical name.

## `backtesting.close`

Explicit full/partial reduce-only close. Manual replay fills at the current revealed close with costs, including the final candle; inspect orderExecution for filled/rejected outcomes. Automatic replay and forward closes remain queued for subsequent eligible candles. Never auto-liquidates at end of history.

Retry key: **required**. External local-assistant access is still required.
Local indicator/backtesting grant required.

| Parameter | Contract |
| --- | --- |
| `runId` | Replay/forward ID. |
| `expectedRevision` | Current run revision. |
| `quantity` | Optional positive quantity, default full position. |
| `symbol` | Optional captured paper-session instrument; defaults to the displayed instrument (pending orders infer their instrument). |
| `all` | Optional boolean: close every position in this replay account atomically at current closes. Cannot combine with symbol or quantity; stale markets reject the entire request. |

Compatibility alias: `simulation.close`. Same validation, grants, cancellation, runtime and retry identity; prefer the canonical name.
