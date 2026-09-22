# tl-paper-trading command reference

Generated from live discovery. Recheck the addressed tab before use.
Use explicit tab targeting and inspect the final JSON status. Do not guess IDs or grant permissions.

Do not infer grant permissions from `mutates`: Desktop discovery can omit structured grant metadata. Read [tl-desktop](../tl-desktop/SKILL.md) for the verified local-change versus cloud-watchlist access rules.

## `backtesting.replay`

Create a fresh paper-replay branch from a completed backtest using identical frozen candles/settings. Starts flat by default; automatic strategy is explicit. Never live orders.

Retry key: **required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `runId` | Completed backtest ID. |
| `autoStrategy` | Optional boolean, default false. |
| `startIndex` | Optional initial historical candle index. |

Compatibility alias: `simulation.replay`. Same runtime and retry identity; prefer the canonical name.

## `backtesting.forward`

Start local forward PAPER from a completed backtest on its fresh live 1-240 minute chart. Seeds flat; manual by default, optional sequential Python. No broker orders.

Retry key: **required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `runId` | Completed backtest ID. |
| `autoStrategy` | Optional boolean, default false. |
| `sessionSchedule` | Optional explicit {timeZone,weekdays:[ISO1-7],open:HH:mm,close:HH:mm,holidays:[YYYY-MM-DD],source:user-assumption,label?}. Omit inherits source-run defaults; null uses strict continuous intervals. Pinned for life of forward run. |

Compatibility alias: `simulation.forward`. Same runtime and retry identity; prefer the canonical name.

## `backtesting.pause`

Stop a forward-paper clock without closing exposure or deleting orders. Never auto-resumes.

Retry key: **required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `runId` | Forward run ID. |
| `expectedRevision` | Current revision. |

Compatibility alias: `simulation.pause`. Same runtime and retry identity; prefer the canonical name.

## `backtesting.resume`

Explicitly resume paused forward paper on the original fresh live chart. Stale data/corrections/gaps block it. Missed contiguous candles require explicit catchUp.

Retry key: **required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `runId` | Forward run ID. |
| `expectedRevision` | Current revision. |
| `catchUp` | Optional boolean, default false; account for up to 100 missed contiguous closed candles. |

Compatibility alias: `simulation.resume`. Same runtime and retry identity; prefer the canonical name.

## `backtesting.step`

Advance historical paper replay through frozen candles; automatic sequential mode steps exactly one. Forward paper advances only from its feed. No next candle means no fill.

Retry key: **required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `runId` | Replay ID. |
| `expectedRevision` | Required current run revision. |
| `count` | 1-100, default 1; automatic sequential mode requires 1. |

Compatibility alias: `simulation.step`. Same runtime and retry identity; prefer the canonical name.

## `backtesting.order`

Queue an entry/exit for MANUAL replay or running manual forward paper. Supports market/limit/stop/stop_limit and brackets. Forward fills require a candle opening after the decision.

Retry key: **required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `runId` | Replay/forward ID. |
| `expectedRevision` | Current run revision. |
| `order` | {side:buy\|sell,type,quantity,limitPrice?,stopPrice?,stopLoss?,takeProfit?,trailingStopPct?,reduceOnly?} |

Compatibility alias: `simulation.order`. Same runtime and retry identity; prefer the canonical name.

## `backtesting.cancelOrder`

Cancel a pending paper order; filled orders cannot be cancelled. Forward cancellation is queued for candles opening after the decision; earlier terms remain effective.

Retry key: **required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `runId` | Replay/forward ID. |
| `expectedRevision` | Current run revision. |
| `orderId` | Pending order ID. |

Compatibility alias: `simulation.cancelOrder`. Same runtime and retry identity; prefer the canonical name.

## `backtesting.replaceOrder`

Replace pending paper order terms atomically; invalid input preserves the original. Forward amendments are queued by decision time, never backdated into the forming candle.

Retry key: **required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `runId` | Replay/forward ID. |
| `expectedRevision` | Current run revision. |
| `orderId` | Pending order ID. |
| `order` | Full replacement order, same fields as simulation.order. |

Compatibility alias: `simulation.replaceOrder`. Same runtime and retry identity; prefer the canonical name.

## `backtesting.protect`

Change paper position protection. Forward changes are queued for candles opening after the decision. No broker call; inspect pendingProtection for queued terms.

Retry key: **required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `runId` | Replay/forward ID. |
| `expectedRevision` | Current run revision. |
| `protection` | {stopLoss?:positive\|null,takeProfit?:positive\|null,trailingStopPct?:0-99} |

Compatibility alias: `simulation.protect`. Same runtime and retry identity; prefer the canonical name.

## `backtesting.close`

Queue a full/partial reduce-only paper close for a subsequent eligible candle. Forward eligibility starts after the actual decision. Never invent an end-of-run close.

Retry key: **required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `runId` | Replay/forward ID. |
| `expectedRevision` | Current run revision. |
| `quantity` | Optional positive quantity, default full position. |

Compatibility alias: `simulation.close`. Same runtime and retry identity; prefer the canonical name.
