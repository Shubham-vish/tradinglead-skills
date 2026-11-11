# tl-alerts command reference

Source-only snapshot from an isolated frontend registry; installed Desktop execution is not certified. Rediscover live availability before use.
Use explicit tab targeting and inspect the final JSON status. Do not guess IDs or grant permissions.

Do not infer grant permissions from `mutates`: Desktop discovery can omit structured grant metadata. Read [tl-desktop](../tl-desktop/SKILL.md) for the verified local-change versus cloud-watchlist access rules.

## `execution.read`

Read hosted (server-side) execution, separate from chart alerts: capabilities (readiness, kinds, languages, data sources, limits, groups), a preview, runs, one run, a run's events, groups or one group. what:definition builds, without saving, the exact definition v1 the Cloud alert form would create from a short spec (price level, trend line or Pine/Python script; one ticker or a Pine group up to 100 tickers)

Retry key: **not required**. External local-assistant access is still required.
Effects: **network**. These are possible consequences, not grants; optional write variants still require approval and a retry key.

| Parameter | Contract |
| --- | --- |
| `what` | capabilities\|preview\|runs\|run\|events\|groups\|group\|definition |
| `spec` | definition: spec {name, symbol \| symbols (1-100, multi-ticker needs a TLScript-Pine script; tickers from watchlists.list), interval (string like '15', '15m', '1h', '1D', or a number of seconds), dataSource? "provider/source" from capabilities, adjustment?, lookbackBars? (default 300), frequency? once\|once_per_bar, trigger: {type:price, level, direction above\|below\|either\|touch, priceSource? close\|wick} \| {type:trend, points:[{time,price},{time,price}], direction, priceSource?} \| {type:script, language pine\|python, source (from indicators.get / pythonIndicators.get), inputs?, pineSettings?, pythonKind? indicator\|strategy, target? events (strategy orders / alert() events) \| condition, output (condition: plot id or title; a preview result lists plots), direction? above\|below\|either, level?}}. Returns the definition, its definitionHash, tickers, trading hours and the next steps (preview, then createRun or createGroup); nothing is saved. |
| `id` | Preview, run or group id (preview, run, events, group) |
| `limit` | Optional page size: runs/groups 1-20, events 1-100 (1-20 with includeDelivery) |
| `cursor` | Optional cursor from a previous page |
| `includeDelivery` | events: true to attach each event's notification outcome (sent = provider accepted, not read) |

## `execution.manage`

Change hosted execution. preview: bounded historical preview of a definition v1 (scripts need hostedExecutionConsent:true). createRun: inactive run from a succeeded matching preview. createGroup: inactive multi-ticker group from a template (series.symbol = symbols[0]) plus a succeeded preview per symbol. pause/resume/stop[Group] need expectedRevision. updateGroupSymbols sets membership; added symbols need previews, stay inactive. activate/activateGroup: in-app review with user consent only.

Retry key: **required**. External local-assistant access is still required.
Effects: **code, network, write**. These are possible consequences, not grants; optional write variants still require approval and a retry key.

| Parameter | Contract |
| --- | --- |
| `operation` | preview\|createRun\|activate\|pause\|resume\|stop\|createGroup\|activateGroup\|pauseGroup\|resumeGroup\|stopGroup\|updateGroupSymbols |
| `definition` | preview/createRun/createGroup: execution definition v1 |
| `previewId` | createRun: succeeded preview id |
| `symbols` | createGroup/updateGroupSymbols: full unique symbol list |
| `previews` | createGroup: {symbol: previewId} for every symbol; updateGroupSymbols: exactly the symbols needing a new run (added, selected without a run, or never-activated ones to re-preview); {} for removal only |
| `hostedExecutionConsent` | preview/createRun/createGroup/updateGroupSymbols: true for kind script (uploads source) |
| `id` | Run or group id |
| `expectedRevision` | Run or group revision you reviewed |
| `reviewedDefinitionHash` | activate/activateGroup: definitionHash the user reviewed |

## `notifications.read`

Read where server-alert notifications go: notify enabled, Telegram/WhatsApp link + enabled + mute, browser-push devices, and reach (channels that would receive now). Chart (sidebar) alerts never notify.

Retry key: **not required**. External local-assistant access is still required.
Effects: **network**. These are possible consequences, not grants; optional write variants still require approval and a retry key.

Requires Desktop protocol 2 with `catalog.aliases` negotiation. Older shells omit this command; verify live availability and do not substitute private execution.

Parameters: `{}`.

## `notifications.manage`

Change notification channels. link (telegram|whatsapp) returns a one-time URL the user must open and press Start; poll notifications.read for linked. enable/disable/unlink; mute (telegram, duration 1h|4h|morning = until 9 AM IST) and unmute (telegram); test sends a real test message (5 per 10 min). Browser push subscribe is in-app only.

Retry key: **required**. External local-assistant access is still required.
Effects: **network, write**. These are possible consequences, not grants; optional write variants still require approval and a retry key.

Requires Desktop protocol 2 with `catalog.aliases` negotiation. Older shells omit this command; verify live availability and do not substitute private execution.

| Parameter | Contract |
| --- | --- |
| `operation` | link\|enable\|disable\|mute\|unmute\|unlink\|test |
| `channel` | telegram\|whatsapp\|webpush (test: optional = all enabled) |
| `deviceId` | webpush enable/disable/unlink: device id from notifications.read |
| `duration` | mute only: 1h\|4h\|morning |

## `alerts.list`

List this account's saved cloud chart alert rules (id, ticker, timeframe, status, direction, price/trendline, frequency, price source). Read-only; does not return live trigger state.

Retry key: **not required**. External local-assistant access is still required.
Effects: **network**. These are possible consequences, not grants; optional write variants still require approval and a retry key.

Parameters: `{}`.

## `alerts.create`

Create a horizontal latest-price alert on a symbol, monitored from shared cloud quotes while the signed-in Alerts panel is mounted. Trendline alerts must be drawn on the chart. Requires sign-in, local write permission and an idempotencyKey.

Retry key: **required**. External local-assistant access is still required.
Effects: **network, write**. These are possible consequences, not grants; optional write variants still require approval and a retry key.

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
Effects: **network, write**. These are possible consequences, not grants; optional write variants still require approval and a retry key.

| Parameter | Contract |
| --- | --- |
| `id` | Saved alert rule id |
| `enabled` | Required boolean; true resumes, false pauses |

## `alerts.update`

Edit a saved alert at its latest version. price: horizontal rules only. Needs write grant + idempotencyKey.

Retry key: **required**. External local-assistant access is still required.
Effects: **network, write**. These are possible consequences, not grants; optional write variants still require approval and a retry key.

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
Effects: **network**. These are possible consequences, not grants; optional write variants still require approval and a retry key.

| Parameter | Contract |
| --- | --- |
| `ruleId` | Optional rule id |
| `limit` | Optional 1-50, default 20 |
| `cursor` | Optional cursor from a previous page |

## `alerts.delete`

Delete a saved alert rule by id. Does not remove chart drawings. Requires sign-in, write permission and an idempotencyKey.

Retry key: **required**. External local-assistant access is still required.
Effects: **network, write**. These are possible consequences, not grants; optional write variants still require approval and a retry key.

| Parameter | Contract |
| --- | --- |
| `id` | Saved alert rule id |
