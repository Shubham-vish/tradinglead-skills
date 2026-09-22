---
name: tl-python
description: Author and manage isolated TradingLead Python indicators and strategy source. Use for calculate(bars, params), typed parameter declarations, supported plots/drawings, bundled Strategy/TA examples, local source history, apply/update and native input/style controls. No unrestricted Python, external data fetching or live orders.
---

# TradingLead Python authoring and indicators

Start with [tl-desktop](../tl-desktop/SKILL.md). Read
`pythonIndicators.capabilities` before execution; exact commands are in
[commands.md](commands.md).

## Runtime and data contract

Require `executionReady:true` and the current isolated runtime status. Do not
fall back to host Python or request blanket filesystem/network access.
Saving source is possible without executing it; **save is not syntax validation**.
There is no advertised `pythonIndicators.validate` command.

The entry point is `calculate(bars, params)`. Bars are chronological OHLCV
dictionaries; `time` is milliseconds, `volume` can be `None`. Output values
must align to the input candles and be finite numbers or `None`.

```python
# @input {"id":"enabled","type":"bool","default":true,"group":"Display"}
def calculate(bars, params):
    return {
        "title": "Close reference",
        "overlay": True,
        "plots": [{
            "id": "close",
            "title": "Close",
            "color": "#22c55e",
            "values": [bar["close"] if params.get("enabled", True) else None for bar in bars]
        }]
    }
```

Keep plot IDs stable so appearance survives replacement/restoration. Drawings
are bounded and use returned input-bar timestamps; discover supported shapes.
Current limits are 50,000 source characters, 5,000 indicator candles, 6 plots
and 100 drawings. The entire command must still fit the 64 KiB bridge.

Typed `# @input` JSON comments support `int`, `float`, `bool`, `string`, `enum`,
plus title/group/description/min/max/step/options. Keep domain validation in
Python too. The primitive parameter map allows 100 keys, 100-character names,
16,000-character strings and 48 KiB serialized UTF-8 JSON overall. Nested
user values and reserved keys, including `_simulation`, are rejected.

## Local source and chart lifecycle

1. Read capabilities/examples and inspect the intended chart.
2. Optionally call `pythonIndicators.save` with title, source and parameters.
   Existing source updates require current `expectedRevision`.
3. `pythonIndicators.apply` executes source **OR** a saved `id`; use a retry
   key. Supplying `instanceId` updates that applied instance; `entityId` is
   the alternative target, not an additional simultaneous target.
4. Inspect `pythonIndicators.applied` for status, error, plot metadata and
   provenance. Inspect plotted values through `chart.snapshot`.
5. Treat failures and missing-runtime diagnostics explicitly; do not fabricate
   a successful result or silently substitute a different data source.

`list/get/history/restore/delete` manage saved source. Restoration creates a
new source revision. `remove` detaches an applied instance and owned drawings,
not its saved source. Stable instance IDs, native entity IDs and library IDs
are distinct.

`showInputs` opens typed calculation controls; user Apply is explicit.
Programmatic recalculation uses `apply` with new parameters and the existing
target. `setVisibility` and `showSettings` do not run Python. Native colors,
widths and aliases can be adjusted in the opened dialog; no generic public
style-setter command is advertised.

## Strategies are separate from indicator plotting

Capabilities include current source examples such as `strategy-ema-sdk` and
`sequential`; discover them rather than guessing imports or SDK methods.
`from tradinglead import Strategy, ta` is the bundled strategy/TA surface.
The shared Studio Docs browser describes the actual supported functions.

Running/applying an indicator draws visuals. It does **not** evaluate a
backtest just because the source also returns strategy decisions. Use
[tl-backtesting](../tl-backtesting/SKILL.md) for execution and analytics.
Sequential mode supplies prefix-only candles and post-fill account state;
vectorized mode has a different causality guarantee. Neither certifies
hard-coded future information. No live broker orders are supported.
