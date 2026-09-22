---
name: tl-charts
description: Control TradingLead charts through discovered commands. Use for feed and symbol discovery, chart navigation, interval changes, bounded candle/study snapshots, history reload, live updates and built-in TradingView studies. Distinguishes chart data from backend screening and does not certify freshness.
---

# TradingLead charts and native studies

Start with [tl-desktop](../tl-desktop/SKILL.md). Exact fields:
[commands.md](commands.md).

## Discover, navigate, verify

1. Read `chart.getState`, `feeds.list` and, when appropriate, `universe.list`.
   Chart feeds and the SQL-backed screener are different data sources.
2. If a context change is requested, use `chart.open` with an explicit canonical
   symbol, discovered feed and supported interval:

```json
{"type":"chart.open","params":{"symbol":"NSE:TCS-EQ","feed":"default","interval":"1D"}}
```

3. An acknowledgement such as `navigationRequested:true,dataReady:false` is not
   loaded data. Poll `chart.getState` until the intended context and history
   state are ready or an explicit error occurs. Do not switch provider to hide
   a failure.
4. Read `chart.snapshot` with `bars` from 1 to 25. Check actual timestamps,
   schema, missing values and truncation. This is a bounded native chart export,
   not an arbitrary historical-data download.

`chart.reload` uses the current provider and can consume provider quota.
`chart.setLive` requests a boolean live-update state; confirm the actual stream
in `chart.getState`. Receipt time, socket connection and an updating UI are
not proof of market freshness. Never enable a live feed merely to format a
saved research page.

## Native studies

1. Page `studies.list` to discover exact supported study names.
2. Use `studies.inputs` for that name; use declared IDs, types and bounds.
3. `studies.apply` requires a retry key and local-change access. Read
   `chart.snapshot` afterward to inspect actual study values.

Built-in TradingView studies are not Pine source programs. Custom TLScript and
Python source workflows belong to their own skills.

## Boundaries

- Existing studies, drawings and chart context belong to the user. Do not
  remove or replace them as a shortcut.
- No generic public arbitrary-study deletion/style API is advertised by
  `studies.*`; use only current catalog commands.
- Broker setup, credentials and data-source settings are separate UI/runtime
  surfaces. `feeds.list` discovers availability; it does not configure brokers.
- Market Intelligence/Futures Analysis can be opened with supported
  `workspace.setPanel` values, but this is not a command to run every analysis
  in those panels.
- A report about a saved backtest must use that run's frozen evidence, not
  substitute whatever candles happen to be on the current chart.
