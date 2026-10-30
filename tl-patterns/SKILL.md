---
name: tl-patterns
description: Operate TradingLead Historical Patterns through patterns.* commands. Use for one NSE ticker across historical weekdays and IST candle windows, separate or grouped sessions, study configuration, run/cancel, coverage, filtered statistics, original candle inspection and dated occurrence navigation. Not multi-stock screening, general chart control or automatic chart-pattern detection.
---

# TradingLead Historical Patterns

> **Owns:** One ticker's dated weekday/time-window studies and the complete `patterns.*` workflow.
> **Delegates:** Connection and permissions to `tl-desktop`; general feed/chart changes to `tl-charts`; multi-stock scans to `tl-screening`.

Start with [tl-desktop](../tl-desktop/SKILL.md) and discover the addressed tab's
commands. Read [workflow.md](workflow.md) for study semantics, revision-safe
configuration, run/poll/cancel, bounded results, filters and dated navigation.
Use [commands.md](commands.md) for exact descriptor fields and its snapshot
provenance; a source snapshot is not proof of installed handlers or live data.

Patterns owns the separate **Patterns** sidebar, not Chart Grid or Scanner.
Configure without executing, start analysis explicitly and distinguish the
current job from retained previous results. Coverage and source readiness are
not guaranteed by successful command discovery. Never switch a feed or rerun
a chargeable study merely to hide a failure.

All `patterns.*` descriptors currently say `mutates:false`, but show/configure/
analysis/navigation change the visible workspace and run may consume provider
quota. They still require external assistant access, real sign-in and source
readiness. Studies are account-scoped, tab-local results, not saved Scanner
rules or immutable Scanned History.

Use [tl-charts](../tl-charts/SKILL.md) only for requested general chart/feed work,
[tl-screening](../tl-screening/SKILL.md) for multi-stock screening, and
[tl-research](../tl-research/SKILL.md) to report existing results without rerunning.
