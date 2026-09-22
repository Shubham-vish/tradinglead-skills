# TradingLead skills

Canonical skill folders live here, not in the ContentLead skill repository.
Every skill uses the `tl-` prefix. This collection documents the **actual
TradingLead Desktop command surface**, not arbitrary UI automation.

| Skill | Responsibility |
| --- | --- |
| [tl-desktop](tl-desktop/SKILL.md) | Start here: connection, explicit tab targeting, permissions, retries, workspace panels and routing |
| [tl-charts](tl-charts/SKILL.md) | Chart/feed discovery, navigation, snapshots, live controls and native studies |
| [tl-tlscript](tl-tlscript/SKILL.md) | TLScript authoring, validation, source history and applied indicators |
| [tl-python](tl-python/SKILL.md) | Isolated Python authoring, typed parameters, source history and chart instances |
| [tl-backtesting](tl-backtesting/SKILL.md) | Backtests, trades/evidence, saved history, presets and chart overlays |
| [tl-strategy-research](tl-strategy-research/SKILL.md) | Parameter sweeps, holdout and walk-forward experiments |
| [tl-paper-trading](tl-paper-trading/SKILL.md) | Historical replay, forward paper sessions and simulated order/protection controls |
| [tl-screening](tl-screening/SKILL.md) | Backend scans, broker-candle TLScript scans and cloud watchlists |
| [tl-research](tl-research/SKILL.md) | Saved HTML research pages in the right sidebar |

## Install and discover

Clone the public collection, then install with Node.js 18+:

```bash
git clone https://github.com/Shubham-vish/tradinglead-skills.git
cd tradinglead-skills
node install.cjs
node install.cjs --check
node validate.cjs
```

Installing the skills does not install TradingLead Desktop. Running the documented
app commands requires Desktop and access to its CLI; refreshing references expects
the sibling checkout described below.

The installer creates one link per skill in `~/.copilot/skills/` pointing here.
It uses directory junctions on Windows and directory symlinks on macOS/Linux.
It refuses to overwrite a conflicting folder or link; no existing ContentLead
or personal skills are moved. The source of truth remains this folder.

In Copilot CLI, run **`/skills reload`** or start a new session, then
`/skills info tl-desktop`. Filesystem verification is not a claim that an
already-running agent has refreshed its in-memory skill list.

Official discovery documentation:
https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-skills

## Command coverage

See [COMMANDS.md](COMMANDS.md) for every advertised command and its owning skill.
Each skill's `commands.md` contains exact descriptions, parameter names and
retry requirements generated from the live catalog. `command-catalog.json`
is a documentation snapshot, **not** a substitute for fresh app capabilities.

The initial audit found **127 registered commands: 94 canonical commands and
33 `simulation.*` compatibility aliases**, plus four native Desktop controls.
The catalog is close to its 128-command ceiling; adding commands also requires
checking the 48 KiB registration and 64 KiB request/response budgets.

Coverage was checked against frontend validation/dispatch and the running app.
Read-only capability discovery was exercised live. The audit also reproduced
and fixed missing retry-key forwarding for preset commands, with regression
coverage for canonical and legacy paths. It did **not** run every state-changing
command against the user's existing chart or rerun all strategies.

### Real boundaries

| Surface | Current agent support |
| --- | --- |
| TLScript/Python source libraries and applied studies | Registered CRUD/history/apply/update/remove/display commands |
| Typed calculation inputs | Open the dialog with `showInputs`; user Apply is explicit. Programmatic parameter changes use apply/update. |
| Indicator native colors/thickness/aliases | Settings-opening commands exist; there is **no generic public native-style setter**. Do not invent one. |
| Backtest overlays, styles and date selection | `backtesting.getChartOptions` / `backtesting.setChartOptions`; display changes do not rerun strategies |
| Presets and larger saved result history | Separate preset and saved-library commands, with their own revisions |
| Sweep/holdout/walk-forward | `backtesting.research`, distinct from HTML reports |
| HTML research pages | Full `research.*` create/list/get/update/delete/show workflow |
| Shared authoring Docs, local backup import/export, Studio docking | UI features; no dedicated registered command for every control |
| Market Intelligence / Futures Analysis | The bottom panel can be opened; no dedicated dataset/analysis command family is advertised |
| Broker credentials, arbitrary JavaScript, real broker orders | Not exposed by these product commands |

Do not use the private diagnostic `/js` bridge as a substitute for missing
product commands. Explain unsupported automation honestly.

Local source implementation, the currently loaded frontend, and a released
cloud/packaged app are different states. Check the addressed tab's catalog
before relying on a feature; this collection does not deploy either app.

## Refresh the references

Keep `TradingLead-Desktop` alongside this folder, or supply its CLI path:

```bash
node ../TradingLead-Desktop/cli.cjs tabs
node sync-commands.cjs --tab ACTUAL_TAB_ID
# Alternate checkout:
node sync-commands.cjs --tab ACTUAL_TAB_ID --cli /path/to/TradingLead-Desktop/cli.cjs
node validate.cjs
```

Refresh only from the intended trusted tab. The generator calls authenticated,
read-only CLI discovery and never records credentials, account IDs, saved
reports, source libraries or run data. Unknown commands fail ownership mapping
instead of being silently omitted. Review changed contracts and update the
workflow prose and examples when refreshing.
