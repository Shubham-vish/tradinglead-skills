# tl-tlscript command reference

Generated from a command-catalog snapshot. Recheck the addressed tab before use.
Use explicit tab targeting and inspect the final JSON status. Do not guess IDs or grant permissions.

Do not infer grant permissions from `mutates`: Desktop discovery can omit structured grant metadata. Read [tl-desktop](../tl-desktop/SKILL.md) for the verified local-change versus cloud-watchlist access rules.

## `indicators.listCapabilities`

Discover TLScript-Pine: the supported Pine indicator runtime, input contract, bounds and example. Not TradingView runtime equivalence or the retired limited TLScript language. Pine strategy backtesting lives under the backtesting.* commands, not this indicator surface.

Retry key: **not required**. External local-assistant access is still required.

Parameters: `{}`.

## `indicators.editorState`

Read Studio's current source, parameters, dirty/compile state, selected instance and actual workspace visibility. An open mounted editor may still be hidden.

Retry key: **not required**. External local-assistant access is still required.

Parameters: `{}`.

## `indicators.openEditor`

Open Studio and load exact saved or applied Pine/Python source, inputs and update target. Waits for mounting; refuses dirty drafts and unavailable/private source. Requires indicator grant and retry key; never runs source or changes chart instances.

Retry key: **required**. External local-assistant access is still required.
Local indicator/backtesting grant required.

| Parameter | Contract |
| --- | --- |
| `id` | Saved Pine/Python script ID; choose exactly one selector. |
| `instanceId` | Stable applied Pine/Python instance ID; preferred over entityId. |
| `entityId` | Current native applied Pine/Python entity ID. |

## `indicators.openDraft`

Open Studio and load arbitrary source as an unsaved draft. Waits for mounting and switches language without discarding dirty edits. Requires indicator grant and retry key; never saves or applies source.

Retry key: **required**. External local-assistant access is still required.
Local indicator/backtesting grant required.

| Parameter | Contract |
| --- | --- |
| `source` | Draft source code (required). |
| `language` | python or pine (default python). |
| `title` | Optional draft title. |
| `inputs` | Optional typed Pine inputs by variable ID; Pine only. |
| `pineSettings` | Optional explicit Pine strategy execution overrides; Pine only. |

## `indicators.validate`

Compile TLScript-Pine indicators or strategies in the isolated Pine worker without saving or applying. Returns kind and input metadata or source diagnostics, not calculation correctness. Strategies execute through backtesting commands only.

Retry key: **not required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `source` | Nonempty Pine indicator or strategy source; no fixed character cap. Execution and transport limits still apply. |
| `profile` | Optional boolean; include bounded compile timing. |

## `indicators.list`

Refresh this account's saved indicator metadata with a device cache. Use get for source. Reports offline/conflicting or unconfirmed cloud state rather than claiming account persistence.

Retry key: **not required**. External local-assistant access is still required.

Parameters: `{}`.

## `indicators.purchased`

Read this authenticated account's purchased native indicator collection, independent of chart placement. Does not purchase, import source, or grant a license.

Retry key: **not required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `cursor` | Optional cursor from the previous collection page. |

## `indicators.sales`

Read this authenticated creator's native indicator sales and manual settlement status. Does not transfer money.

Retry key: **not required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `cursor` | Optional cursor from the previous sales page. |

## `indicators.applyPurchased`

Apply a purchased native indicator as an apply-only linked chart instance after server license verification. No editable import or payment. Requires indicator grant and retry key.

Retry key: **required**. External local-assistant access is still required.
Local indicator/backtesting grant required.

| Parameter | Contract |
| --- | --- |
| `shareId` | Purchased native indicator share ID. |
| `inputs` | Optional declared Pine input values. |

## `indicators.publishPaid`

Publish a saved Pine indicator as a separate paid apply-only publication and register its fixed-term checkout. Requires verified seller approval, current saved revision, indicator grant and retry key. Does not charge a buyer or transfer money. Existing free shares cannot become paid.

Retry key: **required**. External local-assistant access is still required.
Local indicator/backtesting grant required.

| Parameter | Contract |
| --- | --- |
| `id` | Saved Pine indicator ID. |
| `expectedRevision` | Current saved local revision. |
| `amountMinor` | Total INR price in paise, 1 through 10000000. |
| `termDays` | 30, 90 or 365. |
| `visibility` | link or public; public requires moderation. |
| `shareId` | Optional existing paid publication to update with unchanged terms. |

## `indicators.get`

Read current saved TLScript-Pine source and inputs after refreshing this account's library. Offline reads use the retained device cache; this command addresses the current local revision only.

Retry key: **not required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `id` | Saved Pine indicator ID. |
| `revision` | Optional required current revision; older revisions are unavailable through this command. |

## `indicators.save`

Compile and save TLScript-Pine indicator or strategy source and inputs to this account with a device cache. Cloud persistence is confirmed separately; conflicts/offline retain local source. Updating requires the current local revision. Requires indicator grant and retry key; never updates chart instances or runs a strategy. External AI calls show the result in Studio by default. Inspect data.studio: presentation errors do not undo the completed operation.

Retry key: **required**. External local-assistant access is still required.
Local indicator/backtesting grant required.

| Parameter | Contract |
| --- | --- |
| `source` | Pine indicator or strategy source. |
| `inputs` | Optional declared Pine input values; omitted fields use source defaults. |
| `id` | Optional existing Pine source ID. |
| `expectedRevision` | Required current local revision when id is supplied. |
| `replace` | Optional boolean; true explicitly replaces a same-name device library file. Does not silently replace a conflicting account version. |
| `showInStudio` | Optional boolean; default true for external AI, false for internal UI. False explicitly keeps the operation headless. Dirty drafts are preserved; retry only openEditor if presentation fails. |

## `indicators.delete`

Delete an account library file at its current device revision and report cloud confirmation. Does not remove chart instances or revoke separately published shares. Requires indicator grant and a retry key.

Retry key: **required**. External local-assistant access is still required.
Local indicator/backtesting grant required.

| Parameter | Contract |
| --- | --- |
| `id` | Saved indicator ID. |
| `expectedRevision` | Current saved local revision. |

## `indicators.applied`

Inspect this tab's Pine chart readiness and applied TLScript-Pine snapshots without source payloads. Does not fetch candles or certify data freshness.

Retry key: **not required**. External local-assistant access is still required.

Parameters: `{}`.

## `indicators.retryRestores`

Retry pending saved Pine chart instances using Studio's restore queue. Requires a registered chart, indicator grant and retry key. Acknowledges the request, not successful restoration; poll indicators.applied for history readiness, restorationStatus and restoreErrors. Does not change saved source or resolve layout conflicts.

Retry key: **required**. External local-assistant access is still required.
Local indicator/backtesting grant required.

Parameters: `{}`.

## `indicators.apply`

Add TLScript-Pine to the ready chart. Supply source OR saved id. Saved input values are used unless explicitly overridden. Requires local indicator grant and retry key; no feed fallback. External AI calls show the result in Studio by default. Inspect data.studio: presentation errors do not undo the completed operation.

Retry key: **required**. External local-assistant access is still required.
Local indicator/backtesting grant required.

| Parameter | Contract |
| --- | --- |
| `source` | Pine indicator source; mutually exclusive with id. |
| `id` | Saved Pine indicator ID; mutually exclusive with source. |
| `expectedRevision` | Optional required saved revision. |
| `inputs` | Optional declared input IDs mapped to strings, finite numbers or booleans. |
| `profile` | Optional boolean; include bounded execution timings. |
| `realtime` | Optional boolean, default false. Experimental chart-session-only intrabar state; sampled updates, minute intervals, observed live closure required; no replay or secondary requests. Not persisted. |
| `showInStudio` | Optional boolean; default true for external AI, false for internal UI. False explicitly keeps the operation headless. Dirty drafts are preserved; retry only openEditor if presentation fails. |

## `indicators.update`

Recalculate one owned Pine instance, retaining supported appearance. Supply source OR saved id, or omit both to retain its existing source/private artifact. Requires indicator grant and retry key; never adds a missing target. External AI calls show the result in Studio by default. Inspect data.studio: presentation errors do not undo the completed operation.

Retry key: **required**. External local-assistant access is still required.
Local indicator/backtesting grant required.

| Parameter | Contract |
| --- | --- |
| `entityId` | Current Pine entity OR instanceId. |
| `instanceId` | Stable ID from indicators.applied; mutually exclusive with entityId. |
| `source` | Optional replacement Pine source; mutually exclusive with id. |
| `id` | Optional saved Pine replacement; mutually exclusive with source. |
| `expectedRevision` | Optional required saved revision. |
| `inputs` | Optional declared inputs; omitted uses saved/default inputs for replacement source, current inputs otherwise. Merge desired edits into applied.inputs to retain other values. |
| `profile` | Optional boolean; include bounded execution timings. |
| `realtime` | Optional boolean; omission retains the selected instance mode. Explicit update resets intrabar state. Experimental, sampled chart-session-only; minute intervals and observed closure, no replay/secondary requests; not persisted. |
| `showInStudio` | Optional boolean; default true for external AI, false for internal UI. False explicitly keeps the operation headless. Dirty drafts are preserved; retry only openEditor if presentation fails. |

## `indicators.remove`

Remove one applied TLScript-Pine instance and its applied-layout entry, not a built-in study or saved library source.

Retry key: **required**. External local-assistant access is still required.
Local indicator/backtesting grant required.

| Parameter | Contract |
| --- | --- |
| `entityId` | Pine entity OR instanceId. |
| `instanceId` | Stable applied ID; mutually exclusive with entityId. |

## `indicators.setVisibility`

Show/hide an owned TLScript-Pine instance without executing or deleting source.

Retry key: **required**. External local-assistant access is still required.
Local indicator/backtesting grant required.

| Parameter | Contract |
| --- | --- |
| `entityId` | Pine entity OR instanceId. |
| `instanceId` | Stable applied ID; mutually exclusive with entityId. |
| `visible` | Required boolean. |

## `indicators.showSettings`

Open named TLScript-Pine Style settings. Style changes do not execute the script.

Retry key: **required**. External local-assistant access is still required.
Local indicator/backtesting grant required.

| Parameter | Contract |
| --- | --- |
| `entityId` | Pine entity OR instanceId. |
| `instanceId` | Stable applied ID; mutually exclusive with entityId. |

## `indicators.showInputs`

Open named TLScript-Pine calculation inputs. Only explicit Apply & recalculate runs the script; opening does not run or save source.

Retry key: **required**. External local-assistant access is still required.
Local indicator/backtesting grant required.

| Parameter | Contract |
| --- | --- |
| `entityId` | Pine entity OR instanceId. |
| `instanceId` | Stable applied ID; mutually exclusive with entityId. |

## `indicators.getSettings`

Read named applied plot settings without source or execution. Keep the current (not defaults) snapshot for setSettings.expected.

Retry key: **not required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `entityId` | Primary applied entity OR instanceId. |
| `instanceId` | Stable applied ID; mutually exclusive with entityId. |
| `defaults` | Optional boolean, default false. Read source-derived default appearance without changing it. |

## `indicators.setSettings`

Apply named appearance without executing source. Requires unchanged expected snapshot, indicator grant and retry key. Re-read settings after a conflict; no saved-source or backtest changes.

Retry key: **required**. External local-assistant access is still required.
Local indicator/backtesting grant required.

| Parameter | Contract |
| --- | --- |
| `entityId` | Primary applied entity OR instanceId. |
| `instanceId` | Stable applied ID; mutually exclusive with entityId. |
| `settings` | Full getSettings snapshot with desired appearance edits; preserve plot IDs/order/metadata. |
| `expected` | Unmodified current getSettings snapshot for stale-write protection. |
| `reset` | Optional array of style and/or visibility. Clear retained appearance overrides for those pages; also copy the corresponding default values into settings. |
