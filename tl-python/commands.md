# tl-python command reference

Generated from a command-catalog snapshot. Recheck the addressed tab before use.
Use explicit tab targeting and inspect the final JSON status. Do not guess IDs or grant permissions.

Do not infer grant permissions from `mutates`: Desktop discovery can omit structured grant metadata. Read [tl-desktop](../tl-desktop/SKILL.md) for the verified local-change versus cloud-watchlist access rules.

## `pythonIndicators.capabilities`

Discover automatic isolated Python runtime, readiness, result schema and example. No script approval dialog; unrestricted host execution is not supported.

Retry key: **not required**. External local-assistant access is still required.

Parameters: `{}`.

## `pythonIndicators.list`

Refresh this account's Python source metadata with a device cache and explicit cloud-sync state. No code executes.

Retry key: **not required**. External local-assistant access is still required.

Parameters: `{}`.

## `pythonIndicators.get`

Read saved Python source and parameters. No code executes.

Retry key: **not required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `id` | Saved Python script ID. |

## `pythonIndicators.history`

List retained Python revision metadata, without source or execution.

Retry key: **not required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `id` | Saved Python ID. |

## `pythonIndicators.restore`

Restore a retained Python revision as a new local revision. No execution. Indicator grant and retry key required.

Retry key: **required**. External local-assistant access is still required.
Local indicator/backtesting grant required.

| Parameter | Contract |
| --- | --- |
| `id` | Saved Python ID. |
| `revision` | Revision to restore. |
| `expectedRevision` | Current revision. |

## `pythonIndicators.delete`

Delete saved Python source/history, not applied chart instances. Indicator grant and retry key required.

Retry key: **required**. External local-assistant access is still required.
Local indicator/backtesting grant required.

| Parameter | Contract |
| --- | --- |
| `id` | Saved Python ID. |
| `expectedRevision` | Current revision. |

## `pythonIndicators.save`

Save Python source/settings to this account with a device cache, without execution or syntax validation. Returns cloud confirmation or retained-local offline/conflict state. Indicator grant and retry key required. External AI calls show the result in Studio by default. Inspect data.studio: presentation errors do not undo the completed operation.

Retry key: **required**. External local-assistant access is still required.
Local indicator/backtesting grant required.

| Parameter | Contract |
| --- | --- |
| `title` | 1-100 characters. |
| `source` | Nonempty source; no fixed character cap. Storage and cloud transport limits still apply. |
| `parameters` | Optional finite JSON parameter object; nested configurations supported. |
| `strategyMode` | Optional vectorized or sequential strategy mode; retained with source and backups. |
| `id` | Optional saved ID. |
| `expectedRevision` | Required current local revision with id. |
| `replace` | Optional boolean; explicitly replaces a same-name device file, never silently a conflicting account version. |
| `showInStudio` | Optional boolean; default true for external AI, false for internal UI. False explicitly keeps the operation headless. Dirty drafts are preserved; retry only openEditor if presentation fails. |

## `pythonIndicators.applied`

Read Python chart-instance state and provenance without raw result arrays or source.

Retry key: **not required**. External local-assistant access is still required.

Parameters: `{}`.

## `pythonIndicators.apply`

Execute isolated Python and attach/update native plots. Requires ready isolation, indicator grant and retry key; no script approval dialog. External AI calls show the result in Studio by default. Inspect data.studio: presentation errors do not undo the completed operation.

Retry key: **required**. External local-assistant access is still required.
Local indicator/backtesting grant required.

| Parameter | Contract |
| --- | --- |
| `source` | Python source OR saved id. |
| `id` | Saved Python ID OR source. |
| `expectedRevision` | Optional revision with id. |
| `parameters` | Optional JSON parameters, including nested objects and arrays. |
| `strategyMode` | Optional vectorized or sequential; overrides the saved strategy mode for this chart instance only. |
| `instanceId` | Stable applied ID to update. |
| `entityId` | Native entity alternative to instanceId. |
| `showInStudio` | Optional boolean; default true for external AI, false for internal UI. False explicitly keeps the operation headless. Dirty drafts are preserved; retry only openEditor if presentation fails. |

## `pythonIndicators.remove`

Remove a Python instance, owned drawings and applied-layout snapshot, not saved source. Indicator grant and retry key required.

Retry key: **required**. External local-assistant access is still required.
Local indicator/backtesting grant required.

| Parameter | Contract |
| --- | --- |
| `instanceId` | Stable applied ID. |
| `entityId` | Native entity alternative. |

## `pythonIndicators.setVisibility`

Show/hide an applied Python study and its owned drawings without running Python.

Retry key: **required**. External local-assistant access is still required.
Local indicator/backtesting grant required.

| Parameter | Contract |
| --- | --- |
| `instanceId` | Stable applied ID OR entityId. |
| `entityId` | Native entity alternative. |
| `visible` | Required boolean. |

## `pythonIndicators.showSettings`

Open managed Python settings with actual plot names, colors, styles and visibility. Opening or applying styles does not run Python; Inputs explicitly recalculates.

Retry key: **required**. External local-assistant access is still required.
Local indicator/backtesting grant required.

| Parameter | Contract |
| --- | --- |
| `instanceId` | Stable applied ID OR entityId. |
| `entityId` | Native entity alternative. |

## `pythonIndicators.showInputs`

Open typed Python calculation inputs. Opening never executes code; the user must explicitly Apply & recalculate.

Retry key: **required**. External local-assistant access is still required.
Local indicator/backtesting grant required.

| Parameter | Contract |
| --- | --- |
| `instanceId` | Stable applied ID OR entityId. |
| `entityId` | Native entity alternative. |

## `pythonIndicators.validate`

Validate Python syntax with the editor's isolated AST checker. Does not execute imports, fetch candles, save source or certify strategy correctness. Unavailable runtime is an error, not a valid result.

Retry key: **not required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `source` | Nonempty Python source. |

## `pythonIndicators.getSettings`

Read named applied plot settings without source or execution. Keep the current (not defaults) snapshot for setSettings.expected.

Retry key: **not required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `entityId` | Primary applied entity OR instanceId. |
| `instanceId` | Stable applied ID; mutually exclusive with entityId. |
| `defaults` | Optional boolean, default false. Read source-derived default appearance without changing it. |

## `pythonIndicators.setSettings`

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
