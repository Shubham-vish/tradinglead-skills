---
name: tl-alerts
description: Set up and manage TradingLead alerts end to end through discovered commands. Chart (sidebar) price alerts — list/create/edit/pause/delete and trigger history. Server alerts (hosted runs and multi-ticker groups up to 100 tickers) — capabilities, preview, create, pause/resume/stop, edit tickers, run history with per-event notification delivery. Notification channels — read reach, link Telegram/WhatsApp (user taps the link), enable/disable/mute, send a test. Activation and browser push stay in-app. Not chart drawings (tl-charts), not broker orders.
---

# TradingLead alerts and notifications

Start with [tl-desktop](../tl-desktop/SKILL.md) for connection, grants and
retries. Exact fields: [commands.md](commands.md). Discover the commands on the
intended tab before use. The **Alerts** right-sidebar panel is
`workspace.openSidebar {"panel":"alerts"}`.

## Two alert systems — pick the right one

| | Chart alerts (`alerts.*`) | Server alerts (`execution.*`) |
| --- | --- | --- |
| Where it runs | In the open app: only while the signed-in Alerts panel is mounted in a tab | On TradingLead servers, app closed or open |
| Trigger | Horizontal/trendline price level on live quotes | Candle-close price crossing (horizontal/trend line) or an attached Pine/Python script |
| Notifies | In-app Live card only | Telegram, WhatsApp, browser push (`notifications.*`) |
| Multi-ticker | No | Groups of 1-100 tickers from one template |
| Starts | Immediately on create | Created **inactive**; the user activates it in-app |

If the user wants "alert me on my phone" or "when the app is closed", that is a
**server alert plus a notification channel**. Chart alerts never leave the app.

## Complete AI-driven setup (server alert to phone)

1. **Account and grants.** `workspace.getState` must show `authenticated` and
   `allowAgentWrites`. Without the write grant every change fails with
   `APPROVAL_REQUIRED`; agents cannot grant it.
2. **Where would alerts go now?** `notifications.read {}` returns `reach`
   (channels that would receive an alert right now) plus each channel's
   `linked`/`enabled`/`mutedUntil` and browser-push `devices`.
3. **Link a channel** if `reach` is empty and the user agrees:
   `notifications.manage {"operation":"link","channel":"telegram"}` returns a
   one-time `url` (`t.me`/`wa.me`) with `expiresAt`. Give the URL to the user;
   **they** must open it and press Start (Telegram) or send the prefilled
   message (WhatsApp). Poll `notifications.read` every few seconds until
   `channels.telegram.linked` is true; stop at `expiresAt` and offer a new link.
   Browser push needs the browser permission prompt, so open that tab with
   `workspace.openSidebar {"panel":"alerts","section":"notifications"}` and ask
   the user to press "Turn on in this browser". An open panel refreshes by
   itself after your `notifications.manage` changes and when the window regains focus.
4. **Test** only when the user asked or agreed (it sends a real message):
   `notifications.manage {"operation":"test","channel":"telegram"}`. Per-channel
   result `sent` means the provider accepted it, not that it was read;
   `skipped` carries `detail` (`not_linked`, `paused`, `plan_required`). Max 5
   tests per 10 minutes (`NOTIFY_RATE_LIMITED`).
5. **Check the server.** `execution.read {"what":"capabilities"}`: needs
   `enabled`, a ready worker, the `kinds`/`languages` you need, `modes`
   containing `signals`, and a `dataSources` entry. Copy `provider`, `source`,
   an offered `intervals` value (seconds) and an `adjustments` value from it.
   Respect `limits` (including active-run slots and group size).
6. **Build the definition** instead of hand-writing it:
   `execution.read {"what":"definition","spec":{...}}` returns the exact
   definition v1 and `definitionHash` the Cloud alert form would produce (same
   data-source, adjustment, trading-hours and script-trigger rules), plus
   `symbols`, `tradingHours`, `script` (kind, `events`/`condition`) and `next`.
   Nothing is saved. Spec: `name`; `symbol`, or `symbols` (up to 100, Pine
   scripts only; take them from `watchlists.list` or a Cloud Scanner result);
   `interval` (`"15"`, `"15m"`, `"1h"`, `"1D"`, or a number of seconds);
   optional `dataSource` `"provider/source"`, `adjustment`, `lookbackBars`
   (default 300), `frequency` (default `once_per_bar`); `trigger`:
   - `{"type":"price","level":4000,"direction":"above|below|either|touch","priceSource":"close|wick"}`
   - `{"type":"trend","points":[{"time":T1,"price":P1},{"time":T2,"price":P2}],"direction":"above"}`
   - `{"type":"script","language":"pine|python","source":SRC,"inputs":{},"target":"events|condition","output":"Basis","direction":"above","level":N}`.
     Read a saved script's `source`/`inputs` with `indicators.get` (Pine) or
     `pythonIndicators.get`. Pine scripts with `alert()`/`alertcondition()` or
     strategies default to `events`; plain indicators need `condition` with an
     `output` (plot id or title; a preview result lists `plots`). Python
     strategies need `"pythonKind":"strategy"`.
7. **Preview** the exact definition (below):
   `execution.manage {"operation":"preview","definition":{...}}`, then poll
   `execution.read {"what":"preview","id":PREVIEW_ID}` until `succeeded` or
   `failed`. Show the user the preview result (historical signals) before
   continuing.
8. **Create inactive.** Single ticker:
   `{"operation":"createRun","definition":SAME,"previewId":PREVIEW_ID}`.
   Many tickers: preview the template once per ticker (each with its own
   `series.symbol`), then
   `{"operation":"createGroup","definition":TEMPLATE,"symbols":[...],"previews":{"SYM":"PREVIEW_ID",...}}`
   where the template's `series.symbol` equals `symbols[0]`.
9. **Hand activation to the user.** External callers get
   `USER_CONSENT_REQUIRED` for `activate`/`activateGroup` by design. Open the
   dialog on its Runs tab with
   `workspace.openSidebar {"panel":"alerts","section":"serveralerts"}` and ask
   the user to press **Review & activate** and confirm. Poll
   `execution.read {"what":"run","id":...}` (or `group`) until `status` is
   `active`.
10. **Verify end to end.** After a trigger, read
   `execution.read {"what":"events","id":RUN_ID,"includeDelivery":true,"limit":20}`;
   each event's `delivery` shows per-channel `sent`/`failed`/`skipped`.

Never activate, test-send or unlink without the user's explicit request. Never
promise that an alert will fire or that a message was read. Not investment advice.

## Server alert definition v1

```json
{"type":"execution.manage","idempotencyKey":"server-alert-preview-001","params":{"operation":"preview","definition":
 {"schemaVersion":1,"name":"TCS above 4000","mode":"signals","kind":"price.crossing",
  "series":{"provider":"PROVIDER","source":"SOURCE","symbol":"NSE:TCS-EQ","intervalSeconds":900,"adjustment":"none"},
  "symbolInfo":{"timezone":"Asia/Kolkata","session":"0915-1530:23456"},
  "lookbackBars":300,"frequency":"once",
  "condition":{"output":"close","direction":"above","level":4000}}}}
```

```json
{"type":"notifications.manage","idempotencyKey":"notify-link-telegram-001","params":{"operation":"link","channel":"telegram"}}
```

- `provider`/`source`/`intervalSeconds`/`adjustment`: copy from
  `capabilities.dataSources`; never guess.
- `symbolInfo.timezone` is IANA; `session` is `24x7` or
  `HHMM-HHMM[,HHMM-HHMM][:days]` (days 1=Sunday..7=Saturday). Optional
  3-letter `currency`.
- `lookbackBars` 1-`limits.maxLookbackBars`; `frequency` `once|once_per_bar`.
- Price `condition`: `direction` `above|below|either|touch`; optional
  `priceSource` `wick` (default candle close). Trend line: replace `level` with
  `"line":{"points":[{"time":EPOCH_SECONDS,"price":P},{"time":LATER,"price":Q}]}`.
- Script: `"kind":"script","language":"pine|python","source":"..."`, optional
  `inputs`/`pineSettings`; either script alert/order events (no `condition`) or
  `"condition":{"output":"PLOT_NAME","direction":"above|below|either","level":N}`.
  Scripts upload source, so `preview`/`createRun`/`createGroup` need
  `"hostedExecutionConsent":true` — only after the user agrees.
- `name` 1-120 characters. Definitions are ≤256 KiB. Edit by previewing and
  creating a new run; runs are not edited in place.

## Managing server alerts

- List: `execution.read {"what":"runs"}` / `{"what":"groups"}` (pages of 1-20,
  follow `cursor`). Status: `active`/`activating` = monitoring; `paused`;
  `blocked`/`failed` = needs attention (read `error`); `stopped` is final.
- Pause/resume/stop: `{"operation":"pause","id":RUN_ID,"expectedRevision":N}`
  (`pauseGroup`/`resumeGroup`/`stopGroup` for groups). Read the run first for
  `revision`; on `EXECUTION_REVISION_CONFLICT`, reread and confirm with the user.
  Stop is permanent — only when the user asked.
- Tickers of a group: `updateGroupSymbols` with the full new `symbols` list and
  `previews` for exactly the symbols needing a new run (`{}` for removals only).
  Added tickers stay inactive until the user activates the group in-app.
- History: `{"what":"events","id":RUN_ID}` (1-100; 1-20 with
  `includeDelivery`).

## Notification channels

| Operation | Channel | Effect |
| --- | --- | --- |
| `link` | telegram, whatsapp | One-time URL for the user; not linked until they complete it |
| `enable` / `disable` | telegram, whatsapp, webpush (+`deviceId`) | Turn delivery on/off without unlinking |
| `mute` | telegram + `duration` `1h`/`4h`/`morning` (until 9 AM IST) | Temporarily silence alerts; needs Telegram connected with alerts on (else `CHANNEL_NOT_ACTIVE`) |
| `unmute` | telegram | Clear a mute set from the app, an agent or the Telegram bot |
| `unlink` | telegram, whatsapp, webpush (+`deviceId`) | Disconnect; needs a new link. Only on explicit request |
| `test` | any, or omit for all enabled | Real test message |

All are writes (`allowAgentWrites` + unique `idempotencyKey`). `NOTIFY_DISABLED`
means notifications are off server-wide; `NOTIFY_CHANNEL_UNAVAILABLE` means that
channel is not configured. A plan without alert access shows `plan_required` in
test/delivery results. The Telegram bot also offers mute/pause/test buttons,
and the app has a Mute menu; respect a mute the user set unless they ask to clear it.

## Chart alerts (`alerts.*`)

### What a chart alert is, and when it is monitored

Rules are saved per account in the cloud. Monitoring is **client-side**: rules
are evaluated against shared cloud quotes only while the signed-in account's
Alerts panel is mounted in an open TradingLead tab. Saving a rule does not
create server monitoring, phone/push delivery, broker-feed identity or
order execution (use a server alert for that). Quotes carry receipt time, not market timestamps. After
changing rules externally, a mounted Alerts panel may need reopening to pick up
the edit. Never promise that an alert will fire.

**Expiry follows the same rule.** A rule past its `expiresAt` is shown as
*Expired* and is no longer subscribed or evaluated, but only a mounted Alerts
panel enforces this; the stored rule keeps `status:"active"` (`alerts.list`
reports `expired:true` alongside). Chart alerts send no Telegram, WhatsApp or push
notifications: the optional `message` appears in the in-app Live trigger card.

> **Deployment caveat (message/expiry).** Support for `message` and
> `expiresAt` needs an Alerts API schema change that is **not yet deployed**.
> Until it is, production rejects any create/update that includes either field
> with `ALERT_INVALID_REQUEST` (400); rules without them are unaffected. If you
> get that error, retry without these fields only after telling the user.

### Commands

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

### Create

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

### Edit

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

### Trigger activity

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

Drawing or dragging trendline chart alerts, reading the panel's live in-memory
activity view, activating server alerts and subscribing browser push are
interactive only. Chart alerts have no server-side expiry enforcement and no
out-of-app notifications.
