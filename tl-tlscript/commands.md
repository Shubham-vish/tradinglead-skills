# tl-tlscript command reference

Generated from live discovery. Recheck the addressed tab before use.
Use explicit tab targeting and inspect the final JSON status. Do not guess IDs or grant permissions.

Do not infer grant permissions from `mutates`: Desktop discovery can omit structured grant metadata. Read [tl-desktop](../tl-desktop/SKILL.md) for the verified local-change versus cloud-watchlist access rules.

## `indicators.listCapabilities`

Discover TLScript-Pine: the supported Pine indicator runtime, input contract, bounds and example. Not TradingView runtime equivalence, the retired limited TLScript language, or Pine strategy backtesting.

Retry key: **not required**. External local-assistant access is still required.

Parameters: `{}`.

## `indicators.editorState`

Read the mounted Studio's draft source, dirty/compile state and selected chart instance. Open the indicators workspace panel first if unavailable.

Retry key: **not required**. External local-assistant access is still required.

Parameters: `{}`.

## `indicators.openEditor`

Load a saved source OR applied instance in the mounted Studio. Refuses to discard unsaved edits. Open workspace panel indicators first. Requires indicator grant and retry key; does not change chart instances.

Retry key: **required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `id` | Saved script ID; supply id OR entityId. |
| `entityId` | Applied chart instance; supply entityId OR id. |

## `indicators.validate`

Compile TLScript-Pine in the isolated Pine worker without saving or applying it. Returns input metadata or source diagnostics. Pine strategies are rejected.

Retry key: **not required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `source` | Nonempty Pine indicator source; no fixed character cap. Execution and transport limits still apply. |

## `indicators.list`

List saved indicator metadata for the signed-in account on this browser/device. Use get for source. Local storage only; not cloud-synced.

Retry key: **not required**. External local-assistant access is still required.

Parameters: `{}`.

## `indicators.get`

Read the current saved TLScript-Pine source and inputs from this account's local library. Historical revisions are not retained.

Retry key: **not required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `id` | Saved Pine indicator ID. |
| `revision` | Optional required current revision; older revisions are unavailable. |

## `indicators.save`

Compile and save TLScript-Pine source and inputs locally. Updating requires the current revision. Requires the local indicator grant and retry key; never updates chart instances.

Retry key: **required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `source` | Pine indicator source. |
| `inputs` | Optional declared Pine input values; omitted fields use source defaults. |
| `id` | Optional existing Pine indicator ID. |
| `expectedRevision` | Required current revision when id is supplied. |

## `indicators.delete`

Delete a saved local script at its current revision. Does not remove chart instances. Requires the AI indicator grant and a retry key.

Retry key: **required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `id` | Saved indicator ID. |
| `expectedRevision` | Current saved revision. |

## `indicators.applied`

Inspect this tab's Pine chart readiness and applied TLScript-Pine snapshots without source payloads. Does not fetch candles or certify data freshness.

Retry key: **not required**. External local-assistant access is still required.

Parameters: `{}`.

## `indicators.apply`

Add TLScript-Pine to the ready chart. Supply source OR saved id. Saved input values are used unless explicitly overridden. Requires local indicator grant and retry key; no feed fallback.

Retry key: **required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `source` | Pine indicator source; mutually exclusive with id. |
| `id` | Saved Pine indicator ID; mutually exclusive with source. |
| `expectedRevision` | Optional required saved revision. |
| `inputs` | Optional declared input IDs mapped to strings, finite numbers or booleans. |

## `indicators.update`

Recalculate and replace one owned TLScript-Pine instance. Retains its supported appearance and other chart objects. Supply source OR saved id; requires local indicator grant and retry key.

Retry key: **required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `entityId` | Existing Pine chart entity to replace. |
| `source` | Pine source; mutually exclusive with id. |
| `id` | Saved Pine indicator ID; mutually exclusive with source. |
| `expectedRevision` | Optional required saved revision. |
| `inputs` | Optional declared Pine input values. |

## `indicators.remove`

Remove one applied TLScript-Pine instance and its applied-layout entry, not a built-in study or saved library source.

Retry key: **required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `entityId` | Pine chart entity ID. |

## `indicators.setVisibility`

Show/hide an owned TLScript-Pine instance without executing or deleting source.

Retry key: **required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `entityId` | Pine chart entity ID. |
| `visible` | Required boolean. |

## `indicators.showSettings`

Open named TLScript-Pine Style settings. Style changes do not execute the script.

Retry key: **required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `entityId` | Pine chart entity ID. |

## `indicators.showInputs`

Open named TLScript-Pine calculation inputs. Only explicit Apply & recalculate runs the script; opening does not run or save source.

Retry key: **required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `entityId` | Pine chart entity ID. |
