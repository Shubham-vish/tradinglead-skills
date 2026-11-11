# tl-portfolio command reference

Source-only snapshot from an isolated frontend registry; installed Desktop execution is not certified. Rediscover live availability before use.
Use explicit tab targeting and inspect the final JSON status. Do not guess IDs or grant permissions.

Do not infer grant permissions from `mutates`: Desktop discovery can omit structured grant metadata. Read [tl-desktop](../tl-desktop/SKILL.md) for the verified local-change versus cloud-watchlist access rules.

## `brokers.list`

List broker accounts this Desktop can read (Portfolio panel): Fyers chart-feed login, Fyers Desktop login, Zerodha Kite and extra Fyers accounts, with connected/signed-out state, which can trade (cancel/modify/exit; Kite only) and the chart-overlay switches. Never returns credentials.

Retry key: **not required**. External local-assistant access is still required.
Effects: **network**. These are possible consequences, not grants; optional write variants still require approval and a retry key.

Requires Desktop protocol 2 with `catalog.aliases` negotiation. Older shells omit this command; verify live availability and do not substitute private execution.

Parameters: `{}`.

## `brokers.read`

Read live broker data for one account from brokers.list: holdings, positions, orders (status all|open|complete|cancelled|rejected), trades (today's fills) or funds. Rows are normalized like the Portfolio panel with a summary. Uses broker API quota; never places orders.

Retry key: **not required**. External local-assistant access is still required.
Effects: **quota, network**. These are possible consequences, not grants; optional write variants still require approval and a retry key.

Requires Desktop protocol 2 with `catalog.aliases` negotiation. Older shells omit this command; verify live availability and do not substitute private execution.

| Parameter | Contract |
| --- | --- |
| `account` | Required account id from brokers.list (fyers-local, fyers, kite or account:<id>) |
| `section` | Required holdings\|positions\|orders\|trades\|funds |
| `status` | orders only: all\|open\|complete\|cancelled\|rejected (default all) |
| `symbol` | Optional case-insensitive symbol/name filter, e.g. SBIN |
| `limit` | Optional 1-500 rows (default 100) |

## `brokers.trade`

Open a real Kite order dialog for the user to approve; nothing is sent until they click. cancel_order/modify_order: open orderId. exit_position: market exit of the whole symbol position. position_order: position ticket for intent exit|add|stop|target (edits a working stop/target unless newOrder). place_order: chart Buy/Sell ticket for a new order (side, orderType, product, quantity, price, triggerPrice prefill it). Then poll brokers.tradeStatus with requestId.

Retry key: **required**. External local-assistant access is still required.
Effects: **ui, quota, network, write**. These are possible consequences, not grants; optional write variants still require approval and a retry key.

Requires Desktop protocol 2 with `catalog.aliases` negotiation. Older shells omit this command; verify live availability and do not substitute private execution.

| Parameter | Contract |
| --- | --- |
| `account` | Required kite |
| `action` | Required cancel_order\|modify_order\|exit_position\|position_order\|place_order |
| `orderId` | cancel_order/modify_order: order_id from brokers.read orders |
| `quantity` | modify_order: optional proposed total quantity; position_order: optional quantity (exit/stop/target at most the open quantity); place_order: optional quantity (MCX in lots, NFO in units) |
| `price` | modify_order/position_order/place_order: optional limit price (LIMIT, SL) |
| `triggerPrice` | modify_order/position_order (stop)/place_order (SL, SL-M): optional trigger price |
| `symbol` | exit_position/position_order: EXCHANGE:TRADINGSYMBOL from brokers.read positions; place_order: Kite instrument, e.g. NSE:SBIN, NFO:NIFTY26NOVFUT, MCX:GOLDM26DECFUT |
| `product` | exit_position/position_order: CNC\|MIS\|NRML\|MTF when the symbol has several open positions; place_order: MIS\|CNC for equity, MIS\|NRML for F&O and MCX |
| `side` | place_order: Required buy\|sell |
| `intent` | position_order: Required exit\|add\|stop\|target |
| `orderType` | position_order: optional exit/add MARKET\|LIMIT, stop SL\|SL-M, target LIMIT; place_order: optional MARKET\|LIMIT\|SL\|SL-M (default MARKET) |
| `newOrder` | position_order stop/target: optional true to place another order instead of editing the existing one |
| `waitSeconds` | Optional 0-25 seconds to wait for the user's decision (default 20) |

## `brokers.tradeStatus`

Poll a brokers.trade request: pending (dialog still open), dismissed (user declined/closed), ok (broker accepted) or error (broker rejected, with message). cancel=true closes a still-pending dialog without sending anything.

Retry key: **not required**. External local-assistant access is still required.
Effects: **none**. These are possible consequences, not grants; optional write variants still require approval and a retry key.

Requires Desktop protocol 2 with `catalog.aliases` negotiation. Older shells omit this command; verify live availability and do not substitute private execution.

| Parameter | Contract |
| --- | --- |
| `requestId` | Required requestId from brokers.trade |
| `cancel` | Optional true to dismiss the pending dialog |

## `brokers.signIn`

Open the broker's own sign-in window so the user can (re)connect: kite (Zerodha), fyers-local (Fyers chart-feed login) or fyers-account (add a Fyers ID or sign in again to an extra account; Fyers ends sessions daily). The user completes the login; poll brokers.list until connected.

Retry key: **not required**. External local-assistant access is still required.
Effects: **ui, network**. These are possible consequences, not grants; optional write variants still require approval and a retry key.

Requires Desktop protocol 2 with `catalog.aliases` negotiation. Older shells omit this command; verify live availability and do not substitute private execution.

| Parameter | Contract |
| --- | --- |
| `account` | Required kite\|fyers-local\|fyers-account |

## `brokers.manageAccount`

Rename (nickname) or remove an extra Fyers portfolio account from brokers.list. remove asks the user to confirm in the app and deletes the saved session from this computer.

Retry key: **required**. External local-assistant access is still required.
Effects: **ui, network, write**. These are possible consequences, not grants; optional write variants still require approval and a retry key.

Requires Desktop protocol 2 with `catalog.aliases` negotiation. Older shells omit this command; verify live availability and do not substitute private execution.

| Parameter | Contract |
| --- | --- |
| `account` | Required account:<id> from brokers.list |
| `operation` | Required rename\|remove |
| `label` | rename: nickname up to 40 characters ('' clears) |

## `brokers.chartOverlay`

Show or hide broker positions/orders/trades on the chart (Portfolio 'On chart' switch and legend layers). Omit all params to read the current state.

Retry key: **not required**. External local-assistant access is still required.
Effects: **write**. These are possible consequences, not grants; optional write variants still require approval and a retry key.

Requires Desktop protocol 2 with `catalog.aliases` negotiation. Older shells omit this command; verify live availability and do not substitute private execution.

| Parameter | Contract |
| --- | --- |
| `enabled` | Optional boolean master switch |
| `trades` | Optional boolean trade markers layer |
| `orders` | Optional boolean working-order lines layer |
| `positions` | Optional boolean position lines layer |
