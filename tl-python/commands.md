# tl-python command reference

Generated from a command-catalog snapshot. Recheck the addressed tab before use.
Use explicit tab targeting and inspect the final JSON status. Do not guess IDs or grant permissions.

Do not infer grant permissions from `mutates`: Desktop discovery can omit structured grant metadata. Read [tl-desktop](../tl-desktop/SKILL.md) for the verified local-change versus cloud-watchlist access rules.

## `pythonIndicators.capabilities`

Discover automatic isolated Python runtime, readiness, result schema and example. No script approval dialog; unrestricted host execution is not supported.

Retry key: **not required**. External local-assistant access is still required.

Parameters: `{}`.

## `pythonIndicators.list`

List this account's local Python source metadata. No code executes.

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

| Parameter | Contract |
| --- | --- |
| `id` | Saved Python ID. |
| `revision` | Revision to restore. |
| `expectedRevision` | Current revision. |

## `pythonIndicators.delete`

Delete saved Python source/history, not applied chart instances. Indicator grant and retry key required.

Retry key: **required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `id` | Saved Python ID. |
| `expectedRevision` | Current revision. |

## `pythonIndicators.save`

Save Python source locally, without executing or syntax validation. Indicator grant and retry key required.

Retry key: **required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `title` | 1-100 characters. |
| `source` | Nonempty source; no fixed character cap. Storage and transport limits still apply. |
| `parameters` | Optional finite JSON parameter object; nested configurations supported. |
| `id` | Optional saved ID. |
| `expectedRevision` | Required with id. |
| `replace` | Optional boolean; true overwrites an existing saved indicator with the same name instead of failing on a duplicate title. |

## `pythonIndicators.applied`

Read Python chart-instance state and provenance without raw result arrays or source.

Retry key: **not required**. External local-assistant access is still required.

Parameters: `{}`.

## `pythonIndicators.apply`

Execute isolated Python and attach/update native plots. Requires ready isolation, indicator grant and retry key; no script approval dialog.

Retry key: **required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `source` | Python source OR saved id. |
| `id` | Saved Python ID OR source. |
| `expectedRevision` | Optional revision with id. |
| `parameters` | Optional JSON parameters, including nested objects and arrays. |
| `instanceId` | Stable applied ID to update. |
| `entityId` | Native entity alternative to instanceId. |

## `pythonIndicators.remove`

Remove a Python instance, owned drawings and applied-layout snapshot, not saved source. Indicator grant and retry key required.

Retry key: **required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `instanceId` | Stable applied ID. |
| `entityId` | Native entity alternative. |

## `pythonIndicators.setVisibility`

Show/hide an applied Python study and its owned drawings without running Python.

Retry key: **required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `instanceId` | Stable applied ID OR entityId. |
| `entityId` | Native entity alternative. |
| `visible` | Required boolean. |

## `pythonIndicators.showSettings`

Open managed Python settings with actual plot names, colors, styles and visibility. Opening or applying styles does not run Python; Inputs explicitly recalculates.

Retry key: **required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `instanceId` | Stable applied ID OR entityId. |
| `entityId` | Native entity alternative. |

## `pythonIndicators.showInputs`

Open typed Python calculation inputs. Opening never executes code; the user must explicitly Apply & recalculate.

Retry key: **required**. External local-assistant access is still required.

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

Read named applied plot settings without source or execution. Use the primary entityId from applied; keep the returned snapshot for setSettings.

Retry key: **not required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `entityId` | Primary applied chart entity ID. |

## `pythonIndicators.setSettings`

Apply named appearance without executing source. Requires unchanged expected snapshot, indicator grant and retry key. Re-read settings after a conflict; no saved-source or backtest changes.

Retry key: **required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `entityId` | Primary applied chart entity ID. |
| `settings` | Full getSettings snapshot with desired appearance edits; preserve plot IDs/order/metadata. |
| `expected` | Unmodified getSettings snapshot for stale-write protection. |
