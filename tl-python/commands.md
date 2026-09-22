# tl-python command reference

Generated from live discovery. Recheck the addressed tab before use.
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
| `source` | 1-50000 characters. |
| `parameters` | Optional flat primitive parameter map. |
| `id` | Optional saved ID. |
| `expectedRevision` | Required with id. |

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
| `parameters` | Optional primitive parameters. |
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

Open native Python plot visibility, color and line-style settings without execution. Edit Python parameters in Indicator Studio.

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
