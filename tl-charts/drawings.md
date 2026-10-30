# Drawings on the active chart

Part of [tl-charts](SKILL.md); exact fields in [commands.md](commands.md).
These commands cover the left drawing toolbar and user drawings on the
**active pane** only (select it first with `layout.set`; see
[layouts-grid.md](layouts-grid.md)). Every `drawings.*` write is `mutates:true`:
sign-in, the general local write grant and a retry key. Commands are refused
while the chart context changes; reread after any uncertain write.

## What counts as a user drawing

`drawings.list` and `drawings.update` see only user-editable drawings. They
exclude indicator/study shapes and managed chart visuals: shapes owned by a
study, not user-editable, hidden from the object tree or not saved with the
chart. They are never a way to remove
studies; use `studies.*` for native studies.

## List

```json
{"type":"drawings.list","params":{"offset":0,"limit":50}}
```

`offset` 0-10000, `limit` 1-50 (default 50). Items are
`{id, tool, points, pointsTruncated, visible, locked}` with at most 10
`{time, price}` points each, plus `total` and `truncated`. Page until
`truncated` is false before claiming a complete inventory.

## Create

`drawings.create` builds one drawing with the exact point count for its tool:

| Points | Tools |
| --- | --- |
| 1 | `horizontal_line`, `vertical_line`, `horizontal_ray`, `text` |
| 2 | `trend_line`, `ray`, `extended`, `arrow`, `rectangle`, `ellipse`, `fib_retracement`, `date_range`, `price_range`, `date_and_price_range` |
| 3 | `parallel_channel`, `triangle` |
| 4 | `abcd_pattern` |
| 5 | `xabcd_pattern` |
| 7 | `head_and_shoulders` |

Each point is `{time, price}`: `time` is integer epoch **seconds** (0 to
8640000000000), `price` is finite with absolute value at most 1e15. `text`
(single line, at most 500 characters) is allowed only for the `text` tool;
`locked` is an optional boolean. There are no raw style overrides; restyle an
existing selected drawing with `drawingTemplates.apply`.

```json
{"type":"drawings.create","params":{"tool":"trend_line","points":[{"time":1717200000,"price":3800},{"time":1719792000,"price":3950}]},"idempotencyKey":"draw-trend-001"}
```

The result is the created drawing's projection. `DRAWING_CREATE_FAILED` means
the chart did not confirm a drawing; list before retrying with the same key.
Choose times inside loaded history when the drawing must be visible.

## Hide, lock or remove exact drawings

```json
{"type":"drawings.update","params":{"ids":["EXACT_ID_FROM_LIST"],"locked":true},"idempotencyKey":"draw-lock-001"}
```

`ids` is 1-50 unique IDs from `drawings.list`. Send `visible` and/or `locked`,
**or** `remove:true` alone. All targets are preflighted (`DRAWING_NOT_FOUND`
aborts before any change), but the batch is not transactional: if a later item
fails, earlier items may already be changed. `CHART_UPDATE_UNCONFIRMED` means the
final state did not match; list again before retrying. Remove only drawings the
user asked to remove.

## Toolbar modes and remove-all

`drawings.setMode` mirrors the left drawing toolbar:

- `tool`: any create tool above, or `cursor`, `dot`, `arrow_cursor`, `eraser`,
  `measure`, `zoom`, `brush`, `highlighter`, `polyline`, `path`.
- `magnet`, `lockAll`, `hideAll`: booleans.

```json
{"type":"drawings.setMode","params":{"tool":"cursor","magnet":false},"idempotencyKey":"draw-mode-001"}
```

The result reports the observed `magnet`/`lockAll`/`hideAll` values
(`CHART_UPDATE_UNCONFIRMED` if they differ) and, for a tool, `requestedTool`
with `confirmed` (whether the toolbar now shows it). Selecting a tool only arms interactive drawing; it does not
create a drawing (use `drawings.create`). `hideAll`/`lockAll` are view toggles
and do not edit individual drawings.

Remove-all is a separate, exact request: `{"removeAll":true,"confirm":true}` and
no other fields. It deletes every user drawing (no count cap; it yields every 50
removals and stops if the chart context changes), never studies or managed
visuals, and returns `{removed (first 50 IDs), removedCount, truncated}`. If any
user drawing remains it fails `CHART_UPDATE_UNCONFIRMED`; list before retrying.
Use it only when the user explicitly asked to clear all drawings; list first and
report the count.

## Favorite drawing tools order

`chart.viewState.favorites` returns `{available, tools, truncated,
membershipEditable:false}` for the favorite drawings toolbar. Reorder it with an
exclusive request listing **every** current favorite exactly once (max 50):

```json
{"type":"drawings.setMode","params":{"favoriteOrder":["LineToolTrendLine","LineToolHorzLine"]},"idempotencyKey":"draw-fav-order-001"}
```

Use the exact IDs from `chart.viewState`; adding or removing favorites fails
`INVALID_PARAMS`. `FAVORITES_UNAVAILABLE` means the toolbar is not shown or a
drag is in progress; `FAVORITES_STORAGE_UNAVAILABLE` means nothing changed. The
order is stored locally in this app, not synced. Changing which tools are
favorites has no public API and stays UI-only.

## Read toolbar state

`chart.viewState.drawingMode` returns the selected tool and the magnet,
lock-all and hide-all states without a retry key.

## UI-only

Drawing style/property editing (beyond templates), drawing-template library
save/rename/delete, freehand stroke content, favorite-tool membership and
object-tree reordering remain interactive.
