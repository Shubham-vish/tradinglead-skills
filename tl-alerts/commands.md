# tl-alerts command reference

Source-only snapshot from an isolated frontend registry; installed Desktop was not ready. Rediscover live availability before use.
Use explicit tab targeting and inspect the final JSON status. Do not guess IDs or grant permissions.

Do not infer grant permissions from `mutates`: Desktop discovery can omit structured grant metadata. Read [tl-desktop](../tl-desktop/SKILL.md) for the verified local-change versus cloud-watchlist access rules.

## `alerts.list`

List this account's saved cloud chart alert rules (id, ticker, timeframe, status, direction, price/trendline, frequency, price source). Read-only; does not return live trigger state.

Retry key: **not required**. External local-assistant access is still required.

Parameters: `{}`.

## `alerts.create`

Create a horizontal latest-price alert on a symbol, monitored from shared cloud quotes while the signed-in Alerts panel is mounted. Trendline alerts must be drawn on the chart. Requires sign-in, local write permission and an idempotencyKey.

Retry key: **required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `ticker` | Canonical ticker, e.g. NSE:TCS-EQ |
| `price` | Finite price level to cross |
| `direction` | Optional above\|below\|either\|touch, default above |
| `timeframe` | Optional resolution for bar bucketing, e.g. 1, 15, 1D; default 1D |
| `frequency` | Optional once\|once_per_bar\|every_cross, default once |
| `name` | Optional label |
| `message` | Optional trigger note, max 500 |
| `expiresAt` | Optional future ISO UTC; stops monitoring after |

## `alerts.setEnabled`

Enable (resume) or disable (pause) a saved alert rule by id, using its latest saved version. Requires sign-in, write permission and an idempotencyKey.

Retry key: **required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `id` | Saved alert rule id |
| `enabled` | Required boolean; true resumes, false pauses |

## `alerts.update`

Edit a saved alert at its latest version. price: horizontal rules only. Needs write grant + idempotencyKey.

Retry key: **required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `id` | Saved alert rule id |
| `name` | Optional |
| `price` | Optional |
| `direction` | Optional above\|below\|either\|touch |
| `priceSource` | Optional last\|close\|wick |
| `frequency` | Optional once\|once_per_bar\|every_cross |
| `message` | Optional; "" clears |
| `expiresAt` | Optional future ISO UTC; null clears |

## `alerts.activity`

Read one page of persisted cloud alert trigger events, newest first. Not the panel's in-memory live monitor state.

Retry key: **not required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `ruleId` | Optional rule id |
| `limit` | Optional 1-50, default 20 |
| `cursor` | Optional cursor from a previous page |

## `alerts.delete`

Delete a saved alert rule by id. Does not remove chart drawings. Requires sign-in, write permission and an idempotencyKey.

Retry key: **required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `id` | Saved alert rule id |
