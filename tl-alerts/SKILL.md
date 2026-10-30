---
name: tl-alerts
description: Manage TradingLead saved price alerts through discovered commands. Use to list saved alert rules, create horizontal price alerts with an optional trigger message and expiry, edit name/price/direction/price source/frequency/message/expiry, pause/resume, delete, and read persisted trigger activity history; also explains when alerts are actually monitored. Not chart drawings (tl-charts), not broker orders and not push notifications.
---

# TradingLead saved price alerts

Start with [tl-desktop](../tl-desktop/SKILL.md) for connection, grants and
retries. Exact fields: [commands.md](commands.md). Discover the commands on the
intended tab before use. The **Alerts** right-sidebar panel is
`workspace.openSidebar {"panel":"alerts"}`.

## What an alert is, and when it is monitored

Rules are saved per account in the cloud. Monitoring is **client-side**: rules
are evaluated against shared cloud quotes only while the signed-in account's
Alerts panel is mounted in an open TradingLead tab. Saving a rule does not
create always-on server monitoring, push delivery, broker-feed identity or
order execution. Quotes carry receipt time, not market timestamps. After
changing rules externally, a mounted Alerts panel may need reopening to pick up
the edit. Never promise that an alert will fire.

**Expiry follows the same rule.** A rule past its `expiresAt` is shown as
*Expired* and is no longer subscribed or evaluated, but only a mounted Alerts
panel enforces this; the stored rule keeps `status:"active"` (`alerts.list`
reports `expired:true` alongside). There are no OS, desktop, sound or push
notifications: the optional `message` appears in the in-app Live trigger card.

> **Deployment caveat (message/expiry).** Support for `message` and
> `expiresAt` needs an Alerts API schema change that is **not yet deployed**.
> Until it is, production rejects any create/update that includes either field
> with `ALERT_INVALID_REQUEST` (400); rules without them are unaffected. If you
> get that error, retry without these fields only after telling the user.

## Commands

| Command | Writes | Purpose |
| --- | --- | --- |
| `alerts.list` | no | Saved rules: id, name, ticker, timeframe, status, type, direction, detail, price source, frequency, revision, plus `message`, `expiresAt` and `expired` when set. Not trigger state. |
| `alerts.activity` | no | One page of persisted cloud trigger events, newest first. |
| `alerts.create` | yes | New horizontal latest-price rule. |
| `alerts.update` | yes | Edit fields of an existing rule. |
| `alerts.setEnabled` | yes | Pause (`false`) or resume (`true`). |
| `alerts.delete` | yes | Delete the rule (not any chart drawing). |

Writes need sign-in, the general **write** grant (`allowAgentWrites`) and a
unique retry key. Missing grant: `APPROVAL_REQUIRED`; agents cannot grant it.
IDs are 1-128 letters, numbers, underscores or hyphens, copied from
`alerts.list`. Updates, toggles and deletes fetch the latest saved version and
write with its etag; they take no `etag`/`expectedRevision`. Resolve
`ALERT_CONFLICT` by rereading (and reopening the panel if needed), never by
blind overwrite. An uncertain write may have persisted: reread before retrying
with the same key.

## Create

```json
{"type":"alerts.list","params":{}}
```

```json
{"type":"alerts.create","params":{"ticker":"NSE:TCS-EQ","price":4000,"direction":"above","timeframe":"1D","frequency":"once"},"idempotencyKey":"alert-create-001"}
```

This example is not investment advice; create rules only when the user asked
and confirmed ticker and level. `ticker` is 1-64 letters/numbers/`:_.-`;
`price` is finite with absolute value ≤1e15; `direction`
`above|below|either|touch` (default `above`); `timeframe` a resolution like
`1`, `15`, `1D` (default `1D`, used for bar bucketing); `frequency`
`once|once_per_bar|every_cross` (default `once`); optional `name` 1-160
characters; optional `message` (1-500 characters, single line, no control
characters) and `expiresAt` (a **future** ISO UTC time
`YYYY-MM-DDTHH:MM:SS[.ffffff]Z`, e.g. `2026-12-31T09:15:00Z`; monitoring stops
after it). Created rules use the `last` price source and synthetic `default`
feed metadata. Trendline alerts must be drawn on the chart by a person.

## Edit

```json
{"type":"alerts.update","params":{"id":"EXACT_RULE_ID","price":4100,"frequency":"once_per_bar"},"idempotencyKey":"alert-update-001"}
```

Send `id` plus at least one of `name`, `price`, `direction`, `priceSource`
(`last|close|wick`), `frequency`, `message` (`""` clears) or `expiresAt`
(future ISO UTC; `null` clears; a new future time un-expires the rule). `price` applies only to horizontal rules;
on a trendline rule it fails with `ALERT_GEOMETRY_UNSUPPORTED` (move the line on
the chart instead). An edit equal to the saved rule returns `unchanged:true`
without writing. There are no notification-channel or ticker/timeframe
fields; do not invent them.

```json
{"type":"alerts.update","params":{"id":"EXACT_RULE_ID","message":"Check volume before entry","expiresAt":"2026-12-31T09:15:00Z"},"idempotencyKey":"alert-msg-001"}
```

```json
{"type":"alerts.setEnabled","params":{"id":"EXACT_RULE_ID","enabled":false},"idempotencyKey":"alert-pause-001"}
```

`alerts.delete {"id": ...}` removes the rule permanently; delete only rules the
user named. Reread `alerts.list` after every write.

## Trigger activity

```json
{"type":"alerts.activity","params":{"limit":20}}
```

Optional `ruleId`, `limit` 1-50 (default 20) and `cursor` from the previous
page. Each event has `id`, `ruleId`, `ruleRevision`, `eventType`, `detectedAt`,
`candleTime`, `price`, `level` and `acrossGap`; follow `cursor` until `null`
for a complete history. These are persisted cloud events, not the panel's live
in-memory monitor state. An empty page means no persisted events, not that
monitoring is running or that the price never crossed.

## UI-only

Drawing or dragging trendline alerts and reading the panel's live in-memory
activity view are interactive only. Server-side expiry enforcement and
out-of-app notifications do not exist.
