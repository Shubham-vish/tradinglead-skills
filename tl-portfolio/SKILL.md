---
name: tl-portfolio
description: Read and manage the user's real broker accounts in TradingLead Desktop through discovered brokers.* commands. List connected accounts (Fyers chart-feed login, Fyers Desktop login, Zerodha Kite, extra Fyers IDs), read holdings, positions, orders (open/executed/cancelled/rejected), today's trades and funds; ask the user to approve Kite cancel/modify/exit, position stop/target/add orders and new Buy/Sell orders in the in-app ticket and poll the outcome; open broker sign-in; rename/remove extra accounts; show broker positions/orders/trades on the chart. Never sends an order without the user's click. Not simulated orders (tl-paper-trading).
---

# TradingLead broker portfolio

Start with [tl-desktop](../tl-desktop/SKILL.md) for connection, tab targeting,
AI access and retry keys. Exact fields: [commands.md](commands.md). These
commands are advertised only to clients that negotiate the compact catalog;
rediscover them on the intended tab. Broker accounts exist only in TradingLead
Desktop (`DESKTOP_REQUIRED` in a browser). The visible panel is
`workspace.setPanel {"panel":"portfolio"}`.

## What the AI can and cannot do

| User can do in Portfolio | AI command | Notes |
| --- | --- | --- |
| See connected accounts and sign-in state | `brokers.list` | Never returns tokens. `fyers-local` means the chart-feed login exists; its session may still be expired. |
| Holdings, positions, funds | `brokers.read` | Normalized rows plus `summary` (P&L, investment, day P&L). |
| Orders by status, today's fills | `brokers.read` with `section` orders or trades | Orders carry `group`: open, complete, cancelled, rejected. |
| Cancel / modify a working order, exit a position | `brokers.trade` then `brokers.tradeStatus` | **Kite only.** The user must click confirm in the app. |
| Stop loss, target, add to or part-exit a position | `brokers.trade` `position_order` | Opens the position ticket (same as double-clicking the chart position label). |
| Place a new order | `brokers.trade` `place_order` | Opens the chart Buy/Sell ticket prefilled; the user sends it. |
| Sign in / reconnect | `brokers.signIn` | Opens the broker's own login window; the user completes it. |
| Rename or remove an extra Fyers account | `brokers.manageAccount` | Remove asks the user in the app. |
| "On chart" switch and overlay layers | `brokers.chartOverlay` | Omit params to read state. |

## Read recipe

1. `brokers.list` → pick an account whose `connected` is true.
2. `brokers.read {"account":"kite","section":"positions"}`. Use
   `status` (orders only), `symbol` (case-insensitive filter) and `limit`
   (1-500, default 100; check `truncated` and `total`).
3. Reads use broker API quota. Do not poll faster than every ~15 seconds.
4. `BROKER_SIGNED_OUT` means the broker session ended (Fyers ends sessions
   daily). Ask the user, then `brokers.signIn` and poll `brokers.list`.

Account ids: `fyers-local`, `fyers`, `kite`, and `account:<id>` for extra Fyers
accounts. Quantities and prices come straight from the broker; report them with
the `checkedAt` time and do not present them as advice.

## Order actions (user-confirmed)

`brokers.trade` needs AI access with the workspace write grant and a retry key.
It never sends anything by itself:

1. Read fresh orders/positions first and tell the user exactly what you propose.
2. Call `brokers.trade`:
   - `{"account":"kite","action":"cancel_order","orderId":"…"}`
   - `{"account":"kite","action":"modify_order","orderId":"…","price":805}`:
     `quantity` (total size), `price` (not SL-M) and `triggerPrice` (not LIMIT)
     prefill the edit form; only LIMIT, SL and SL-M orders can be modified.
   - `{"account":"kite","action":"exit_position","symbol":"NSE:SBIN","product":"MIS"}`:
     a market order for the full open quantity; `product` is required when
     the symbol has several open positions (`AMBIGUOUS_POSITION`).
   - `{"account":"kite","action":"position_order","symbol":"NSE:SBIN","intent":"stop","orderType":"SL-M","triggerPrice":790}`:
     `intent` exit (part/all, MARKET|LIMIT), add (MARKET|LIMIT), stop (SL|SL-M)
     or target (LIMIT). An existing working stop/target is edited unless
     `"newOrder":true`. `quantity` for exit/stop/target is at most the open quantity.
   - `{"account":"kite","action":"place_order","symbol":"MCX:GOLDM26DECFUT","side":"buy","orderType":"LIMIT","price":141500,"quantity":1,"product":"NRML"}`:
     a new order. `side` is required; `orderType` MARKET (default), LIMIT, SL
     or SL-M; `price` only for LIMIT/SL, `triggerPrice` only for SL/SL-M;
     `product` MIS|CNC for equity, MIS|NRML for F&O and MCX. MCX quantity is in
     lots, NFO in units. Indices cannot be traded. Chart symbols such as
     `NSE:SBIN-EQ` or `NSE:NIFTY26NOVFUT` map to the Kite instrument.
3. The app shows the same confirmation dialog or ticket as the Portfolio panel and chart. The
   command waits up to `waitSeconds` (default 20, max 25) and returns
   `status` (`pending`, `dismissed`, `ok` or `error`) plus `requestId`.
4. While `pending`, poll `brokers.tradeStatus {"requestId":"…"}`. Add
   `"cancel":true` to close the dialog if the user changes their mind.
5. `ok` means the broker accepted the request, not that the order filled.
   Re-read orders/positions to confirm.

Never click the confirmation button with native UI input on the user's behalf;
the dialog is the user's consent. Only one dialog is open at a time; a new
request dismisses the previous one.

## Errors

| Code | Meaning |
| --- | --- |
| `ACCOUNT_NOT_FOUND` | Unknown account id; call `brokers.list`. |
| `BROKER_SIGNED_OUT` | Session ended; the user signs in again (`brokers.signIn`). |
| `ORDER_NOT_FOUND`, `ORDER_NOT_OPEN`, `ORDER_NOT_MODIFIABLE` | Re-read orders; the order changed or cannot be edited. |
| `POSITION_NOT_FOUND`, `AMBIGUOUS_POSITION` | No open position, or pass `product`. |
| `TRADING_UNAVAILABLE` | This Desktop build has no Kite order actions; update the app. |
| `INVALID_INPUT` "Unsupported order action." | The running Desktop predates `position_order`/`place_order`; restart or update it. |
| `APPROVAL_REQUIRED` | No workspace write grant for this tab. |
