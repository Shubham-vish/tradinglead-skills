# tl-tlscript command reference

Generated from live discovery. Recheck the addressed tab before use.
Use explicit tab targeting and inspect the final JSON status. Do not guess IDs or grant permissions.

Do not infer grant permissions from `mutates`: Desktop discovery can omit structured grant metadata. Read [tl-desktop](../tl-desktop/SKILL.md) for the verified local-change versus cloud-watchlist access rules.

## `indicators.listCapabilities`

Discover TLScript grammar, functions, bounds and examples. This is not Pine Script or JavaScript. Indicators use the open chart's candles, not the backend screener.

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

Compile a TLScript draft without saving or applying it. Returns line/column diagnostics and plot/input metadata; never executes arbitrary code.

Retry key: **not required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `source` | TLScript source, at most 12000 characters. |

## `indicators.list`

List saved indicator metadata for the signed-in account on this browser/device. Use get for source. Local storage only; not cloud-synced.

Retry key: **not required**. External local-assistant access is still required.

Parameters: `{}`.

## `indicators.get`

Read a saved indicator's current source or one retained revision from this account's local library.

Retry key: **not required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `id` | Saved indicator ID. |
| `revision` | Optional retained historical revision. |

## `indicators.history`

List retained revision metadata. Use indicators.get with revision to read its source; old pruned revisions are unavailable.

Retry key: **not required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `id` | Saved indicator ID. |

## `indicators.restore`

Restore retained source as a NEW current revision, never rewrite history or silently update the chart. Requires the AI indicator grant and retry key.

Retry key: **required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `id` | Saved indicator ID. |
| `revision` | Retained revision to restore. |
| `expectedRevision` | Current saved revision. |

## `indicators.save`

Save a validated TLScript locally. Updating requires the current revision. Needs the separate local AI indicator grant and a retry key; does not update chart instances.

Retry key: **required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `source` | TLScript source. |
| `id` | Optional existing indicator ID. |
| `expectedRevision` | Required current revision when id is supplied. |

## `indicators.delete`

Delete a saved local script at its current revision. Does not remove chart instances. Requires the AI indicator grant and a retry key.

Retry key: **required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `id` | Saved indicator ID. |
| `expectedRevision` | Current saved revision. |

## `indicators.applied`

Inspect whether this tab has a ready chart and list applied TLScript snapshots. Does not fetch candles or imply data freshness.

Retry key: **not required**. External local-assistant access is still required.

Parameters: `{}`.

## `indicators.apply`

Add a TLScript snapshot to the ready chart in this tab. Supply source OR a saved id; optional revision pins a saved script. Needs the AI indicator grant and retry key. No chart navigation or feed fallback.

Retry key: **required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `source` | Draft source; mutually exclusive with id. |
| `id` | Saved indicator ID; mutually exclusive with source. |
| `expectedRevision` | Optional revision to require when using id. |
| `inputs` | Optional map of up to 32 declared input IDs to finite numbers or booleans. |

## `indicators.update`

Explicitly replace one generated chart instance after its replacement is ready. Other studies and drawings remain. Supply source OR saved id; requires the AI indicator grant and retry key.

Retry key: **required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `entityId` | Existing chart entity to replace. |
| `source` | Draft source; mutually exclusive with id. |
| `id` | Saved indicator ID; mutually exclusive with source. |
| `expectedRevision` | Optional current revision when using id. |
| `inputs` | Optional declared numeric or boolean inputs. |

## `indicators.remove`

Remove one applied TLScript instance, not a built-in indicator or its saved source. Requires the AI indicator grant and a retry key.

Retry key: **required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `entityId` | Chart entity ID returned by apply or applied. |

## `indicators.setVisibility`

Show/hide one applied TLScript study without executing or deleting its saved source.

Retry key: **required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `entityId` | Applied TLScript entity ID. |
| `visible` | Required boolean. |

## `indicators.showSettings`

Open the applied TLScript study's native plot visibility, color and line-style settings. Edit script inputs in Indicator Studio.

Retry key: **required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `entityId` | Applied TLScript entity ID. |

## `indicators.showInputs`

Open typed calculation inputs for an owned TLScript study. Only an explicit user Apply recalculates; opening does not run or save source.

Retry key: **required**. External local-assistant access is still required.

| Parameter | Contract |
| --- | --- |
| `entityId` | Applied TLScript entity ID. |
