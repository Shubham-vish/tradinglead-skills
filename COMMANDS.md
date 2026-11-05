# TradingLead command ownership

Generated from a bounded command-catalog snapshot; check the addressed app's live catalog before use.
Source-only snapshot from an isolated frontend registry; installed Desktop execution is not certified. Rediscover live availability before use.
Read each skill's workflow and rediscover live capabilities before execution.

210 canonical commands; 59 compatibility aliases; 56 native Desktop controls.

| Registered command | Skill | Retry key | Effects |
| --- | --- | --- | --- |
| `watchlists.getRows` | [tl-markets](tl-markets/SKILL.md) | Not required (parameterized writes still require it) | none |
| `watchlists.select` | [tl-markets](tl-markets/SKILL.md) | Required | navigate, quota, network, write |
| `watchlists.setView` | [tl-markets](tl-markets/SKILL.md) | Required | panel, write |
| `watchlists.removeSymbols` | [tl-markets](tl-markets/SKILL.md) | Required | network, write |
| `watchlists.manage` | [tl-markets](tl-markets/SKILL.md) | Required | panel, network, write |
| `symbol.details` | [tl-markets](tl-markets/SKILL.md) | Not required (parameterized writes still require it) | panel, write |
| `peers.get` | [tl-markets](tl-markets/SKILL.md) | Not required (parameterized writes still require it) | none |
| `peers.configure` | [tl-markets](tl-markets/SKILL.md) | Required | network, write |
| `indices.getState` | [tl-markets](tl-markets/SKILL.md) | Not required (parameterized writes still require it) | navigate, write, quota, network |
| `heatmap.configure` | [tl-markets](tl-markets/SKILL.md) | Required | panel, write |
| `watchlists.multiView` | [tl-markets](tl-markets/SKILL.md) | Not required (parameterized writes still require it) | panel, write |
| `chart.viewState` | [tl-charts](tl-charts/SKILL.md) | Not required (parameterized writes still require it) | none |
| `chart.setView` | [tl-charts](tl-charts/SKILL.md) | Required | navigate, quota, network, write |
| `chart.compare` | [tl-charts](tl-charts/SKILL.md) | Required | navigate, quota, network, write |
| `chart.action` | [tl-charts](tl-charts/SKILL.md) | Required | panel, write |
| `drawings.list` | [tl-charts](tl-charts/SKILL.md) | Not required (parameterized writes still require it) | none |
| `drawings.create` | [tl-charts](tl-charts/SKILL.md) | Required | write |
| `drawings.update` | [tl-charts](tl-charts/SKILL.md) | Required | write |
| `drawings.setMode` | [tl-charts](tl-charts/SKILL.md) | Required | write |
| `studyTemplates.manage` | [tl-charts](tl-charts/SKILL.md) | Required | write |
| `layout.getState` | [tl-charts](tl-charts/SKILL.md) | Not required (parameterized writes still require it) | none |
| `layout.set` | [tl-charts](tl-charts/SKILL.md) | Required | navigate, panel, quota, network, write |
| `layout.saved` | [tl-charts](tl-charts/SKILL.md) | Required | navigate, panel, quota, network, write |
| `grid.getState` | [tl-charts](tl-charts/SKILL.md) | Not required (parameterized writes still require it) | none |
| `grid.configure` | [tl-charts](tl-charts/SKILL.md) | Required | panel, write |
| `grid.open` | [tl-charts](tl-charts/SKILL.md) | Required | navigate, quota, network, write |
| `replay.setOverlayLayout` | [tl-desktop](tl-desktop/SKILL.md) | Not required (parameterized writes still require it) | panel |
| `ui.waitIdle` | [tl-desktop](tl-desktop/SKILL.md) | Not required (parameterized writes still require it) | none |
| `ui.listTargets` | [tl-desktop](tl-desktop/SKILL.md) | Not required (parameterized writes still require it) | none |
| `ui.getTargetRect` | [tl-desktop](tl-desktop/SKILL.md) | Not required (parameterized writes still require it) | none |
| `demo.prepare` | [tl-desktop](tl-desktop/SKILL.md) | Not required (parameterized writes still require it) | ui |
| `demo.reset` | [tl-desktop](tl-desktop/SKILL.md) | Not required (parameterized writes still require it) | ui |
| `demo.redact` | [tl-desktop](tl-desktop/SKILL.md) | Not required (parameterized writes still require it) | ui |
| `screening.getState` | [tl-screening](tl-screening/SKILL.md) | Not required (parameterized writes still require it) | none |
| `screening.show` | [tl-screening](tl-screening/SKILL.md) | Not required (parameterized writes still require it) | panel |
| `screening.catalog` | [tl-screening](tl-screening/SKILL.md) | Not required (parameterized writes still require it) | network |
| `screening.listUniverses` | [tl-screening](tl-screening/SKILL.md) | Not required (parameterized writes still require it) | none |
| `screening.configure` | [tl-screening](tl-screening/SKILL.md) | Not required (parameterized writes still require it) | panel |
| `screening.run` | [tl-screening](tl-screening/SKILL.md) | Not required (parameterized writes still require it) | quota, network, panel |
| `screening.getResults` | [tl-screening](tl-screening/SKILL.md) | Not required (parameterized writes still require it) | none |
| `screening.cancel` | [tl-screening](tl-screening/SKILL.md) | Not required (parameterized writes still require it) | write |
| `screening.getAnalysis` | [tl-screening](tl-screening/SKILL.md) | Not required (parameterized writes still require it) | none |
| `screening.setAnalysis` | [tl-screening](tl-screening/SKILL.md) | Not required (parameterized writes still require it) | panel |
| `screening.refine` | [tl-screening](tl-screening/SKILL.md) | Not required (parameterized writes still require it) | panel |
| `screening.listSaved` | [tl-screening](tl-screening/SKILL.md) | Not required (parameterized writes still require it) | network |
| `screening.listHistory` | [tl-screening](tl-screening/SKILL.md) | Not required (parameterized writes still require it) | network |
| `screening.openHistory` | [tl-screening](tl-screening/SKILL.md) | Not required (parameterized writes still require it) | panel, network |
| `screening.useHistorySettings` | [tl-screening](tl-screening/SKILL.md) | Not required (parameterized writes still require it) | panel |
| `screening.deleteHistory` | [tl-screening](tl-screening/SKILL.md) | Required | network, panel, write |
| `screening.load` | [tl-screening](tl-screening/SKILL.md) | Not required (parameterized writes still require it) | panel, network |
| `screening.save` | [tl-screening](tl-screening/SKILL.md) | Required | network, panel, write |
| `screening.delete` | [tl-screening](tl-screening/SKILL.md) | Required | network, panel, write |
| `patterns.getState` | [tl-patterns](tl-patterns/SKILL.md) | Not required (parameterized writes still require it) | none |
| `patterns.show` | [tl-patterns](tl-patterns/SKILL.md) | Not required (parameterized writes still require it) | panel |
| `patterns.hide` | [tl-patterns](tl-patterns/SKILL.md) | Not required (parameterized writes still require it) | panel, write |
| `patterns.searchSymbols` | [tl-patterns](tl-patterns/SKILL.md) | Not required (parameterized writes still require it) | none |
| `patterns.configure` | [tl-patterns](tl-patterns/SKILL.md) | Not required (parameterized writes still require it) | panel |
| `patterns.useChartTicker` | [tl-patterns](tl-patterns/SKILL.md) | Not required (parameterized writes still require it) | panel |
| `patterns.run` | [tl-patterns](tl-patterns/SKILL.md) | Not required (parameterized writes still require it) | panel, quota, network |
| `patterns.cancel` | [tl-patterns](tl-patterns/SKILL.md) | Not required (parameterized writes still require it) | write |
| `patterns.getResults` | [tl-patterns](tl-patterns/SKILL.md) | Not required (parameterized writes still require it) | none |
| `patterns.setAnalysis` | [tl-patterns](tl-patterns/SKILL.md) | Not required (parameterized writes still require it) | panel |
| `patterns.openOccurrence` | [tl-patterns](tl-patterns/SKILL.md) | Not required (parameterized writes still require it) | navigate, quota, network |
| `research.listCapabilities` | [tl-research](tl-research/SKILL.md) | Not required (parameterized writes still require it) | none |
| `research.list` | [tl-research](tl-research/SKILL.md) | Not required (parameterized writes still require it) | none |
| `research.get` | [tl-research](tl-research/SKILL.md) | Not required (parameterized writes still require it) | none |
| `research.create` | [tl-research](tl-research/SKILL.md) | Required | write |
| `research.update` | [tl-research](tl-research/SKILL.md) | Required | write |
| `research.delete` | [tl-research](tl-research/SKILL.md) | Required | write |
| `research.show` | [tl-research](tl-research/SKILL.md) | Not required (parameterized writes still require it) | panel |
| `backtesting.presetList` | [tl-backtesting](tl-backtesting/SKILL.md) | Not required (parameterized writes still require it) | none |
| `backtesting.presetGet` | [tl-backtesting](tl-backtesting/SKILL.md) | Not required (parameterized writes still require it) | none |
| `backtesting.presetSave` | [tl-backtesting](tl-backtesting/SKILL.md) | Required | write |
| `backtesting.presetDelete` | [tl-backtesting](tl-backtesting/SKILL.md) | Required | write |
| `simulation.presetList` | [tl-backtesting](tl-backtesting/SKILL.md) | Not required (parameterized writes still require it) | none |
| `simulation.presetGet` | [tl-backtesting](tl-backtesting/SKILL.md) | Not required (parameterized writes still require it) | none |
| `simulation.presetSave` | [tl-backtesting](tl-backtesting/SKILL.md) | Required | write |
| `simulation.presetDelete` | [tl-backtesting](tl-backtesting/SKILL.md) | Required | write |
| `backtesting.practice` | [tl-paper-trading](tl-paper-trading/SKILL.md) | Required | write |
| `backtesting.capabilities` | [tl-backtesting](tl-backtesting/SKILL.md) | Not required (parameterized writes still require it) | none |
| `backtesting.list` | [tl-backtesting](tl-backtesting/SKILL.md) | Not required (parameterized writes still require it) | none |
| `backtesting.libraryList` | [tl-backtesting](tl-backtesting/SKILL.md) | Not required (parameterized writes still require it) | none |
| `backtesting.librarySave` | [tl-backtesting](tl-backtesting/SKILL.md) | Required | write |
| `backtesting.libraryMigrate` | [tl-backtesting](tl-backtesting/SKILL.md) | Required | write |
| `backtesting.libraryRestore` | [tl-backtesting](tl-backtesting/SKILL.md) | Required | write |
| `backtesting.libraryDelete` | [tl-backtesting](tl-backtesting/SKILL.md) | Required | write |
| `backtesting.libraryUpdate` | [tl-backtesting](tl-backtesting/SKILL.md) | Required | write |
| `backtesting.libraryExport` | [tl-backtesting](tl-backtesting/SKILL.md) | Not required (parameterized writes still require it) | none |
| `backtesting.libraryImport` | [tl-backtesting](tl-backtesting/SKILL.md) | Required | write |
| `backtesting.compare` | [tl-backtesting](tl-backtesting/SKILL.md) | Not required (parameterized writes still require it) | none |
| `backtesting.research` | [tl-strategy-optimization](tl-strategy-optimization/SKILL.md) | Required | code, write |
| `backtesting.getChartOptions` | [tl-backtesting](tl-backtesting/SKILL.md) | Not required (parameterized writes still require it) | none |
| `backtesting.setChartOptions` | [tl-backtesting](tl-backtesting/SKILL.md) | Required | write |
| `backtesting.run` | [tl-backtesting](tl-backtesting/SKILL.md) | Required | quota, code, network, write |
| `backtesting.get` | [tl-backtesting](tl-backtesting/SKILL.md) | Not required (parameterized writes still require it) | none |
| `backtesting.export` | [tl-backtesting](tl-backtesting/SKILL.md) | Not required (parameterized writes still require it) | none |
| `backtesting.optimizeReport` | [tl-strategy-optimization](tl-strategy-optimization/SKILL.md) | Required | code, write |
| `backtesting.optimizeReportGet` | [tl-strategy-optimization](tl-strategy-optimization/SKILL.md) | Not required (parameterized writes still require it) | none |
| `backtesting.cancel` | [tl-backtesting](tl-backtesting/SKILL.md) | Not required (parameterized writes still require it) | write |
| `backtesting.replay` | [tl-paper-trading](tl-paper-trading/SKILL.md) | Required | code, write |
| `backtesting.forward` | [tl-paper-trading](tl-paper-trading/SKILL.md) | Required | code, write |
| `backtesting.pause` | [tl-paper-trading](tl-paper-trading/SKILL.md) | Required | write |
| `backtesting.resume` | [tl-paper-trading](tl-paper-trading/SKILL.md) | Required | code, write |
| `backtesting.step` | [tl-paper-trading](tl-paper-trading/SKILL.md) | Required | quota, code, network, write |
| `backtesting.back` | [tl-paper-trading](tl-paper-trading/SKILL.md) | Required | write |
| `backtesting.order` | [tl-paper-trading](tl-paper-trading/SKILL.md) | Required | write |
| `backtesting.cancelOrder` | [tl-paper-trading](tl-paper-trading/SKILL.md) | Required | write |
| `backtesting.replaceOrder` | [tl-paper-trading](tl-paper-trading/SKILL.md) | Required | write |
| `backtesting.protect` | [tl-paper-trading](tl-paper-trading/SKILL.md) | Required | write |
| `backtesting.close` | [tl-paper-trading](tl-paper-trading/SKILL.md) | Required | write |
| `backtesting.addInstrument` | [tl-paper-trading](tl-paper-trading/SKILL.md) | Required | navigate, quota, network, write |
| `backtesting.setInterval` | [tl-paper-trading](tl-paper-trading/SKILL.md) | Required | navigate, quota, network, write |
| `backtesting.show` | [tl-backtesting](tl-backtesting/SKILL.md) | Required | navigate, quota, network, write |
| `backtesting.removeFromChart` | [tl-backtesting](tl-backtesting/SKILL.md) | Required | write |
| `backtesting.showSettings` | [tl-backtesting](tl-backtesting/SKILL.md) | Required | panel, write |
| `backtesting.delete` | [tl-backtesting](tl-backtesting/SKILL.md) | Required | write |
| `backtesting.applyStrategy` | [tl-backtesting](tl-backtesting/SKILL.md) | Required | quota, code, network, write |
| `backtesting.removeStrategy` | [tl-backtesting](tl-backtesting/SKILL.md) | Required | write |
| `backtesting.appliedStrategy` | [tl-backtesting](tl-backtesting/SKILL.md) | Not required (parameterized writes still require it) | none |
| `backtesting.setStrategyAutoRerun` | [tl-backtesting](tl-backtesting/SKILL.md) | Required | write |
| `backtesting.optimizeChecks` | [tl-strategy-optimization](tl-strategy-optimization/SKILL.md) | Required | write |
| `backtesting.optimizeValidateSymbols` | [tl-strategy-optimization](tl-strategy-optimization/SKILL.md) | Required | write |
| `backtesting.paperPreflight` | [tl-paper-trading](tl-paper-trading/SKILL.md) | Not required (parameterized writes still require it) | none |
| `backtesting.paperParity` | [tl-paper-trading](tl-paper-trading/SKILL.md) | Required | write |
| `backtesting.compareView` | [tl-backtesting](tl-backtesting/SKILL.md) | Not required (parameterized writes still require it) | none |
| `backtesting.optimizeResume` | [tl-strategy-optimization](tl-strategy-optimization/SKILL.md) | Required | write |
| `backtesting.researchPreview` | [tl-strategy-optimization](tl-strategy-optimization/SKILL.md) | Not required (parameterized writes still require it) | none |
| `backtesting.researchMeasure` | [tl-strategy-optimization](tl-strategy-optimization/SKILL.md) | Required | code, write |
| `backtesting.researchRerun` | [tl-strategy-optimization](tl-strategy-optimization/SKILL.md) | Required | code, write |
| `backtesting.optimize` | [tl-strategy-optimization](tl-strategy-optimization/SKILL.md) | Required | code, write |
| `backtesting.optimizePreview` | [tl-strategy-optimization](tl-strategy-optimization/SKILL.md) | Not required (parameterized writes still require it) | none |
| `backtesting.optimizeMeasure` | [tl-strategy-optimization](tl-strategy-optimization/SKILL.md) | Required | code, write |
| `backtesting.optimizeRerun` | [tl-strategy-optimization](tl-strategy-optimization/SKILL.md) | Required | code, write |
| `simulation.practice` | [tl-paper-trading](tl-paper-trading/SKILL.md) | Required | write |
| `simulation.capabilities` | [tl-backtesting](tl-backtesting/SKILL.md) | Not required (parameterized writes still require it) | none |
| `simulation.list` | [tl-backtesting](tl-backtesting/SKILL.md) | Not required (parameterized writes still require it) | none |
| `simulation.libraryList` | [tl-backtesting](tl-backtesting/SKILL.md) | Not required (parameterized writes still require it) | none |
| `simulation.librarySave` | [tl-backtesting](tl-backtesting/SKILL.md) | Required | write |
| `simulation.libraryMigrate` | [tl-backtesting](tl-backtesting/SKILL.md) | Required | write |
| `simulation.libraryRestore` | [tl-backtesting](tl-backtesting/SKILL.md) | Required | write |
| `simulation.libraryDelete` | [tl-backtesting](tl-backtesting/SKILL.md) | Required | write |
| `simulation.libraryUpdate` | [tl-backtesting](tl-backtesting/SKILL.md) | Required | write |
| `simulation.libraryExport` | [tl-backtesting](tl-backtesting/SKILL.md) | Not required (parameterized writes still require it) | none |
| `simulation.libraryImport` | [tl-backtesting](tl-backtesting/SKILL.md) | Required | write |
| `simulation.compare` | [tl-backtesting](tl-backtesting/SKILL.md) | Not required (parameterized writes still require it) | none |
| `simulation.research` | [tl-strategy-optimization](tl-strategy-optimization/SKILL.md) | Required | code, write |
| `simulation.getChartOptions` | [tl-backtesting](tl-backtesting/SKILL.md) | Not required (parameterized writes still require it) | none |
| `simulation.setChartOptions` | [tl-backtesting](tl-backtesting/SKILL.md) | Required | write |
| `simulation.run` | [tl-backtesting](tl-backtesting/SKILL.md) | Required | quota, code, network, write |
| `simulation.get` | [tl-backtesting](tl-backtesting/SKILL.md) | Not required (parameterized writes still require it) | none |
| `simulation.export` | [tl-backtesting](tl-backtesting/SKILL.md) | Not required (parameterized writes still require it) | none |
| `simulation.optimizeReport` | [tl-strategy-optimization](tl-strategy-optimization/SKILL.md) | Required | code, write |
| `simulation.optimizeReportGet` | [tl-strategy-optimization](tl-strategy-optimization/SKILL.md) | Not required (parameterized writes still require it) | none |
| `simulation.cancel` | [tl-backtesting](tl-backtesting/SKILL.md) | Not required (parameterized writes still require it) | write |
| `simulation.replay` | [tl-paper-trading](tl-paper-trading/SKILL.md) | Required | code, write |
| `simulation.forward` | [tl-paper-trading](tl-paper-trading/SKILL.md) | Required | code, write |
| `simulation.pause` | [tl-paper-trading](tl-paper-trading/SKILL.md) | Required | write |
| `simulation.resume` | [tl-paper-trading](tl-paper-trading/SKILL.md) | Required | code, write |
| `simulation.step` | [tl-paper-trading](tl-paper-trading/SKILL.md) | Required | quota, code, network, write |
| `simulation.back` | [tl-paper-trading](tl-paper-trading/SKILL.md) | Required | write |
| `simulation.order` | [tl-paper-trading](tl-paper-trading/SKILL.md) | Required | write |
| `simulation.cancelOrder` | [tl-paper-trading](tl-paper-trading/SKILL.md) | Required | write |
| `simulation.replaceOrder` | [tl-paper-trading](tl-paper-trading/SKILL.md) | Required | write |
| `simulation.protect` | [tl-paper-trading](tl-paper-trading/SKILL.md) | Required | write |
| `simulation.close` | [tl-paper-trading](tl-paper-trading/SKILL.md) | Required | write |
| `simulation.addInstrument` | [tl-paper-trading](tl-paper-trading/SKILL.md) | Required | navigate, quota, network, write |
| `simulation.setInterval` | [tl-paper-trading](tl-paper-trading/SKILL.md) | Required | navigate, quota, network, write |
| `simulation.show` | [tl-backtesting](tl-backtesting/SKILL.md) | Required | navigate, quota, network, write |
| `simulation.removeFromChart` | [tl-backtesting](tl-backtesting/SKILL.md) | Required | write |
| `simulation.showSettings` | [tl-backtesting](tl-backtesting/SKILL.md) | Required | panel, write |
| `simulation.delete` | [tl-backtesting](tl-backtesting/SKILL.md) | Required | write |
| `simulation.applyStrategy` | [tl-backtesting](tl-backtesting/SKILL.md) | Required | quota, code, network, write |
| `simulation.removeStrategy` | [tl-backtesting](tl-backtesting/SKILL.md) | Required | write |
| `simulation.appliedStrategy` | [tl-backtesting](tl-backtesting/SKILL.md) | Not required (parameterized writes still require it) | none |
| `simulation.setStrategyAutoRerun` | [tl-backtesting](tl-backtesting/SKILL.md) | Required | write |
| `simulation.optimizeChecks` | [tl-strategy-optimization](tl-strategy-optimization/SKILL.md) | Required | write |
| `simulation.optimizeValidateSymbols` | [tl-strategy-optimization](tl-strategy-optimization/SKILL.md) | Required | write |
| `simulation.paperPreflight` | [tl-paper-trading](tl-paper-trading/SKILL.md) | Not required (parameterized writes still require it) | none |
| `simulation.paperParity` | [tl-paper-trading](tl-paper-trading/SKILL.md) | Required | write |
| `simulation.compareView` | [tl-backtesting](tl-backtesting/SKILL.md) | Not required (parameterized writes still require it) | none |
| `simulation.optimizeResume` | [tl-strategy-optimization](tl-strategy-optimization/SKILL.md) | Required | write |
| `simulation.researchPreview` | [tl-strategy-optimization](tl-strategy-optimization/SKILL.md) | Not required (parameterized writes still require it) | none |
| `simulation.researchMeasure` | [tl-strategy-optimization](tl-strategy-optimization/SKILL.md) | Required | code, write |
| `simulation.researchRerun` | [tl-strategy-optimization](tl-strategy-optimization/SKILL.md) | Required | code, write |
| `workspace.getState` | [tl-desktop](tl-desktop/SKILL.md) | Not required (parameterized writes still require it) | none |
| `workspace.getActivity` | [tl-desktop](tl-desktop/SKILL.md) | Not required (parameterized writes still require it) | none |
| `workspace.setPanel` | [tl-desktop](tl-desktop/SKILL.md) | Not required (parameterized writes still require it) | panel |
| `workspace.openSidebar` | [tl-desktop](tl-desktop/SKILL.md) | Not required (parameterized writes still require it) | panel |
| `workspace.setTheme` | [tl-desktop](tl-desktop/SKILL.md) | Not required (parameterized writes still require it) | write |
| `chart.getState` | [tl-charts](tl-charts/SKILL.md) | Not required (parameterized writes still require it) | none |
| `chart.snapshot` | [tl-charts](tl-charts/SKILL.md) | Not required (parameterized writes still require it) | none |
| `chart.setLive` | [tl-charts](tl-charts/SKILL.md) | Not required (parameterized writes still require it) | quota, network |
| `chart.reload` | [tl-charts](tl-charts/SKILL.md) | Not required (parameterized writes still require it) | quota, network |
| `chart.navigateHistory` | [tl-charts](tl-charts/SKILL.md) | Not required (parameterized writes still require it) | navigate, quota, network |
| `chart.replayControl` | [tl-charts](tl-charts/SKILL.md) | Required | navigate, write |
| `studies.list` | [tl-charts](tl-charts/SKILL.md) | Not required (parameterized writes still require it) | none |
| `studies.inputs` | [tl-charts](tl-charts/SKILL.md) | Not required (parameterized writes still require it) | none |
| `studies.apply` | [tl-charts](tl-charts/SKILL.md) | Required | write |
| `studies.applied` | [tl-charts](tl-charts/SKILL.md) | Not required (parameterized writes still require it) | none |
| `studies.setVisibility` | [tl-charts](tl-charts/SKILL.md) | Required | write |
| `studies.remove` | [tl-charts](tl-charts/SKILL.md) | Required | write |
| `drawingTemplates.state` | [tl-charts](tl-charts/SKILL.md) | Not required (parameterized writes still require it) | none |
| `drawingTemplates.list` | [tl-charts](tl-charts/SKILL.md) | Not required (parameterized writes still require it) | none |
| `drawingTemplates.apply` | [tl-charts](tl-charts/SKILL.md) | Required | write |
| `intelligence.catalog` | [tl-markets](tl-markets/SKILL.md) | Not required (parameterized writes still require it) | network |
| `intelligence.getReport` | [tl-markets](tl-markets/SKILL.md) | Not required (parameterized writes still require it) | network |
| `futures.getReport` | [tl-markets](tl-markets/SKILL.md) | Not required (parameterized writes still require it) | network |
| `heatmap.getState` | [tl-markets](tl-markets/SKILL.md) | Not required (parameterized writes still require it) | none |
| `alerts.list` | [tl-alerts](tl-alerts/SKILL.md) | Not required (parameterized writes still require it) | network |
| `alerts.create` | [tl-alerts](tl-alerts/SKILL.md) | Required | network, write |
| `alerts.setEnabled` | [tl-alerts](tl-alerts/SKILL.md) | Required | network, write |
| `alerts.update` | [tl-alerts](tl-alerts/SKILL.md) | Required | network, write |
| `alerts.activity` | [tl-alerts](tl-alerts/SKILL.md) | Not required (parameterized writes still require it) | network |
| `alerts.delete` | [tl-alerts](tl-alerts/SKILL.md) | Required | network, write |
| `feeds.list` | [tl-charts](tl-charts/SKILL.md) | Not required (parameterized writes still require it) | network |
| `marketData.getBars` | [tl-markets](tl-markets/SKILL.md) | Not required (parameterized writes still require it) | quota, network |
| `universe.list` | [tl-markets](tl-markets/SKILL.md) | Not required (parameterized writes still require it) | network |
| `screener.listCapabilities` | [tl-screening](tl-screening/SKILL.md) | Not required (parameterized writes still require it) | network |
| `screener.run` | [tl-screening](tl-screening/SKILL.md) | Not required (parameterized writes still require it) | quota, network |
| `screener.getResults` | [tl-screening](tl-screening/SKILL.md) | Not required (parameterized writes still require it) | none |
| `screener.cancel` | [tl-screening](tl-screening/SKILL.md) | Not required (parameterized writes still require it) | write |
| `providerScreener.listCapabilities` | [tl-screening](tl-screening/SKILL.md) | Not required (parameterized writes still require it) | none |
| `providerScreener.run` | [tl-screening](tl-screening/SKILL.md) | Not required (parameterized writes still require it) | quota, code, network |
| `providerScreener.getResults` | [tl-screening](tl-screening/SKILL.md) | Not required (parameterized writes still require it) | none |
| `providerScreener.cancel` | [tl-screening](tl-screening/SKILL.md) | Not required (parameterized writes still require it) | write |
| `watchlists.list` | [tl-markets](tl-markets/SKILL.md) | Not required (parameterized writes still require it) | network |
| `watchlists.create` | [tl-markets](tl-markets/SKILL.md) | Required | network, write |
| `watchlists.addSymbols` | [tl-markets](tl-markets/SKILL.md) | Required | network, write |
| `chart.open` | [tl-charts](tl-charts/SKILL.md) | Not required (parameterized writes still require it) | navigate, quota, network |
| `indicators.listCapabilities` | [tl-tlscript](tl-tlscript/SKILL.md) | Not required (parameterized writes still require it) | none |
| `indicators.editorState` | [tl-tlscript](tl-tlscript/SKILL.md) | Not required (parameterized writes still require it) | none |
| `indicators.openEditor` | [tl-tlscript](tl-tlscript/SKILL.md) | Required | panel, write |
| `indicators.openDraft` | [tl-tlscript](tl-tlscript/SKILL.md) | Required | panel, write |
| `indicators.validate` | [tl-tlscript](tl-tlscript/SKILL.md) | Not required (parameterized writes still require it) | code |
| `indicators.list` | [tl-tlscript](tl-tlscript/SKILL.md) | Not required (parameterized writes still require it) | network |
| `indicators.purchased` | [tl-tlscript](tl-tlscript/SKILL.md) | Not required (parameterized writes still require it) | network |
| `indicators.sales` | [tl-tlscript](tl-tlscript/SKILL.md) | Not required (parameterized writes still require it) | network |
| `indicators.applyPurchased` | [tl-tlscript](tl-tlscript/SKILL.md) | Required | code, network, write |
| `indicators.publishPaid` | [tl-tlscript](tl-tlscript/SKILL.md) | Required | network, write |
| `indicators.get` | [tl-tlscript](tl-tlscript/SKILL.md) | Not required (parameterized writes still require it) | network |
| `indicators.save` | [tl-tlscript](tl-tlscript/SKILL.md) | Required | network, write, panel |
| `indicators.delete` | [tl-tlscript](tl-tlscript/SKILL.md) | Required | network, write |
| `indicators.applied` | [tl-tlscript](tl-tlscript/SKILL.md) | Not required (parameterized writes still require it) | none |
| `indicators.retryRestores` | [tl-tlscript](tl-tlscript/SKILL.md) | Required | code, write |
| `indicators.apply` | [tl-tlscript](tl-tlscript/SKILL.md) | Required | code, write, panel |
| `indicators.update` | [tl-tlscript](tl-tlscript/SKILL.md) | Required | code, write, panel |
| `indicators.remove` | [tl-tlscript](tl-tlscript/SKILL.md) | Required | write |
| `indicators.setVisibility` | [tl-tlscript](tl-tlscript/SKILL.md) | Required | write |
| `indicators.showSettings` | [tl-tlscript](tl-tlscript/SKILL.md) | Required | panel, write |
| `indicators.showInputs` | [tl-tlscript](tl-tlscript/SKILL.md) | Required | panel, write |
| `indicators.closeSettings` | [tl-tlscript](tl-tlscript/SKILL.md) | Required | panel, write |
| `pythonIndicators.capabilities` | [tl-python](tl-python/SKILL.md) | Not required (parameterized writes still require it) | none |
| `pythonIndicators.list` | [tl-python](tl-python/SKILL.md) | Not required (parameterized writes still require it) | network |
| `pythonIndicators.get` | [tl-python](tl-python/SKILL.md) | Not required (parameterized writes still require it) | network |
| `pythonIndicators.history` | [tl-python](tl-python/SKILL.md) | Not required (parameterized writes still require it) | network |
| `pythonIndicators.restore` | [tl-python](tl-python/SKILL.md) | Required | network, write |
| `pythonIndicators.delete` | [tl-python](tl-python/SKILL.md) | Required | network, write |
| `pythonIndicators.save` | [tl-python](tl-python/SKILL.md) | Required | network, write, panel |
| `pythonIndicators.applied` | [tl-python](tl-python/SKILL.md) | Not required (parameterized writes still require it) | none |
| `pythonIndicators.apply` | [tl-python](tl-python/SKILL.md) | Required | code, write, panel |
| `pythonIndicators.remove` | [tl-python](tl-python/SKILL.md) | Required | write |
| `pythonIndicators.setVisibility` | [tl-python](tl-python/SKILL.md) | Required | write |
| `pythonIndicators.showSettings` | [tl-python](tl-python/SKILL.md) | Required | panel, write |
| `pythonIndicators.showInputs` | [tl-python](tl-python/SKILL.md) | Required | panel, write |
| `pythonIndicators.validate` | [tl-python](tl-python/SKILL.md) | Not required (parameterized writes still require it) | code |
| `indicators.getSettings` | [tl-tlscript](tl-tlscript/SKILL.md) | Not required (parameterized writes still require it) | none |
| `indicators.setSettings` | [tl-tlscript](tl-tlscript/SKILL.md) | Required | write |
| `pythonIndicators.getSettings` | [tl-python](tl-python/SKILL.md) | Not required (parameterized writes still require it) | none |
| `pythonIndicators.setSettings` | [tl-python](tl-python/SKILL.md) | Required | write |

Native Desktop controls belong to **tl-desktop**: `status`, `activate`, `open-access`, `reconnect`, `getOrigin`, `setOrigin`, `screenshot`, `logs`, `services`, `appInfo`, `ui-enable`, `ui-disable`, `ui-status`, `ui-inspect`, `ui-click`, `ui-drag`, `ui-hover`, `ui-move`, `ui-scroll`, `ui-type`, `ui-key`, `record-start`, `record-stop`, `record-status`, `record-mark`, `ui-query`, `ui-wait-for`, `ui-wait-idle`, `ui-press`, `ui-screenshot`, `ui-set-viewport`, `ui-reset-viewport`, `ui-cursor`, `ui-highlight`, `ui-mouse-leave`, `ui-wait-stable`, `ui-chart-point`, `ui-run`, `ui-fill`, `ui-select`, `ui-check`, `ui-upload`, `ui-expect`, `ui-trace-start`, `ui-trace-stop`, `ui-dialog`, `ui-dialog-wait`, `ui-dialog-respond`, `ui-download-wait`, `ui-popup-wait`, `ui-wait-request`, `ui-wait-response`, `ui-route`, `ui-unroute`, `ui-codegen-start`, `ui-codegen-stop`.

Non-mutating in the catalog does not mean cost-free or invisible: scans, navigation, reloads and live-feed requests can still have effects.
