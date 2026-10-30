const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");

const skillNames = [
	"tl-desktop", "tl-charts", "tl-markets", "tl-alerts", "tl-screening", "tl-patterns", "tl-research",
	"tl-tlscript", "tl-python", "tl-backtesting", "tl-strategy-optimization", "tl-strategy-research", "tl-paper-trading",
];
const MAX_CATALOG_ENTRIES = 256;
const MAX_CATALOG_BYTES = 128 * 1024;
const paper = new Set(["practice", "replay", "forward", "pause", "resume", "step", "back", "order", "cancelOrder", "replaceOrder", "protect", "close"]);
const optimization = new Set(["optimize", "optimizePreview", "optimizeMeasure", "optimizeRerun", "research", "researchPreview", "researchMeasure", "researchRerun"]);
const legacyOptimization = /^backtesting\.research(?:Preview|Measure|Rerun)?$/;
function ownerFor(type) {
	const canonical = type.replace(/^simulation\./, "backtesting.");
	const [family, action] = canonical.split(".");
	if (family === "backtesting") return optimization.has(action) ? "tl-strategy-optimization" : paper.has(action) ? "tl-paper-trading" : "tl-backtesting";
	const owner = {
		workspace: "tl-desktop", chart: "tl-charts", studies: "tl-charts", drawingTemplates: "tl-charts", studyTemplates: "tl-charts",
		drawings: "tl-charts", layout: "tl-charts", grid: "tl-charts", feeds: "tl-charts",
		watchlists: "tl-markets", symbol: "tl-markets", peers: "tl-markets", indices: "tl-markets",
		heatmap: "tl-markets", intelligence: "tl-markets", futures: "tl-markets", universe: "tl-markets",
		marketData: "tl-markets", alerts: "tl-alerts", patterns: "tl-patterns",
		indicators: "tl-tlscript", pythonIndicators: "tl-python", screener: "tl-screening", providerScreener: "tl-screening",
		screening: "tl-screening", research: "tl-research",
	}[family];
	if (!owner) throw new Error(`No skill owns command ${type}; update the skill routing before refreshing.`);
	return owner;
}
function validateCatalog(catalog) {
	if (catalog?.version !== 1 || !Array.isArray(catalog.commands) || !catalog.commands.length || catalog.commands.length > MAX_CATALOG_ENTRIES ||
		Buffer.byteLength(JSON.stringify(catalog.commands)) > MAX_CATALOG_BYTES || !Array.isArray(catalog.desktopActions)) {
		throw new Error("Invalid or oversized command catalog.");
	}
	const names = new Set();
	for (const command of catalog.commands) {
		if (!/^[A-Za-z][A-Za-z0-9]*\.[A-Za-z][A-Za-z0-9]*$/.test(command.type) || names.has(command.type) ||
			typeof command.description !== "string" || typeof command.mutates !== "boolean" ||
			(command.permission !== undefined && command.permission !== "indicators") ||
			!command.params || typeof command.params !== "object" || Array.isArray(command.params) ||
			Object.values(command.params).some(value => typeof value !== "string")) throw new Error("Invalid command descriptor.");
		names.add(command.type);
		ownerFor(command.type);
	}
	for (const type of names) {
		if (type.startsWith("simulation.") && !names.has(type.replace(/^simulation\./, "backtesting."))) throw new Error(`Orphan alias: ${type}`);
	}
	for (const action of catalog.desktopActions) {
		if (!["status", "activate", "open-access", "reconnect"].includes(action.action) || typeof action.description !== "string") {
			throw new Error("Unknown Desktop control; update the connection skill before refreshing.");
		}
	}
}
const cell = text => text.replace(/\|/g, "\\|").replace(/\r?\n/g, " ");
function references(catalog) {
	validateCatalog(catalog);
	const output = new Map();
	const provenance = catalog.source === "isolated-source"
		? "Source-only snapshot from an isolated frontend registry; installed Desktop was not ready. Rediscover live availability before use."
		: "Command-catalog snapshot; recheck the addressed tab before use.";
	const canonical = catalog.commands.filter(command => !command.type.startsWith("simulation.") && !legacyOptimization.test(command.type));
	output.set("command-catalog.json", `${JSON.stringify(catalog, null, 2)}\n`);
	output.set("COMMANDS.md", [
		"# TradingLead command ownership", "",
		"Generated from a bounded command-catalog snapshot; check the addressed app's live catalog before use.",
		provenance,
		"Read each skill's workflow and rediscover live capabilities before execution.", "",
		`${canonical.length} canonical commands; ${catalog.commands.length - canonical.length} compatibility aliases; ${catalog.desktopActions.length} native Desktop controls.`, "",
		"| Registered command | Skill | Retry key |",
		"| --- | --- | --- |",
		...catalog.commands.map(command => `| \`${command.type}\` | [${ownerFor(command.type)}](${ownerFor(command.type)}/SKILL.md) | ${command.mutates ? "Required" : "Not required"} |`),
		"", "Native Desktop controls belong to **tl-desktop**: " + catalog.desktopActions.map(action => `\`${action.action}\``).join(", ") + ".", "",
		"Non-mutating in the catalog does not mean cost-free or invisible: scans, navigation, reloads and live-feed requests can still have effects.", "",
	].join("\n"));
	for (const skill of skillNames) {
		if (skill === "tl-strategy-research") {
			output.set(`${skill}/commands.md`, "# Deprecated command reference\n\nSee [tl-strategy-optimization](../tl-strategy-optimization/commands.md) for canonical Optimize commands and compatibility aliases. This router owns no commands.\n");
			continue;
		}
		const owned = canonical.filter(command => ownerFor(command.type) === skill);
		const lines = [
			`# ${skill} command reference`, "", skill === "tl-research" ? "Generated from a command-catalog snapshot. Recheck the addressed tab before use." : provenance,
			"Use explicit tab targeting and inspect the final JSON status. Do not guess IDs or grant permissions.", "",
			"Do not infer grant permissions from `mutates`: Desktop discovery can omit structured grant metadata. Read [tl-desktop](../tl-desktop/SKILL.md) for the verified local-change versus cloud-watchlist access rules.", "",
		];
		for (const command of owned) {
			lines.push(`## \`${command.type}\``, "", command.description, "",
				`Retry key: **${command.mutates ? "required" : "not required"}**. External local-assistant access is still required.`,
				...(command.permission === "indicators" ? ["Local indicator/backtesting grant required."] : []), "");
			if (Object.keys(command.params).length) {
				lines.push("| Parameter | Contract |", "| --- | --- |",
					...Object.entries(command.params).map(([key, description]) => `| \`${key}\` | ${cell(description)} |`), "");
			} else lines.push("Parameters: `{}`.", "");
			if (command.type.startsWith("backtesting.")) {
				const legacy = command.type.replace(".optimize", ".research");
				const aliases = legacy === command.type ? [legacy.replace(/^backtesting\./, "simulation.")]
					: [legacy, legacy.replace(/^backtesting\./, "simulation.")];
				lines.push(`Compatibility ${aliases.length === 1 ? "alias" : "aliases"}: ${aliases.map(alias => `\`${alias}\``).join(", ")}. Same validation, grants, cancellation, runtime and retry identity; prefer the canonical name.`, "");
			}
		}
		if (skill === "tl-desktop") {
			lines.push("## Native Desktop controls", "", "Run `node cli.cjs desktop ACTION --tab ACTUAL_TAB_ID` from the Desktop repository.", "");
			for (const action of catalog.desktopActions) lines.push(`- \`${action.action}\`: ${action.description}`);
			lines.push("", "These controls cannot grant access. Discover them using `node cli.cjs desktop capabilities`.", "");
		}
		output.set(`${skill}/commands.md`, lines.join("\n"));
	}
	return output;
}
function checkReferences(catalog, root = __dirname) {
	validateCatalog(catalog);
	const snapshot = JSON.parse(fs.readFileSync(path.join(root, "command-catalog.json"), "utf8"));
	const contract = ({ version, commands, desktopActions }) => ({ version, commands, desktopActions });
	const stable = value => JSON.stringify(value, (_key, item) =>
		item && typeof item === "object" && !Array.isArray(item)
			? Object.fromEntries(Object.keys(item).sort().map(key => [key, item[key]])) : item);
	const changed = stable(contract(catalog)) === stable(contract(snapshot)) ? [] : ["command-catalog.json"];
	changed.push(...[...references(snapshot)].filter(([file, contents]) =>
		!fs.existsSync(path.join(root, file)) || fs.readFileSync(path.join(root, file), "utf8") !== contents).map(([file]) => file));
	if (changed.length) throw new Error(`Live catalog drift: ${changed.join(", ")}. Review the addressed app and refresh with sync-commands.cjs --tab TAB_ID.`);
}
function main(argv) {
	const options = {};
	const usage = "Use --tab TAB_ID [--cli /path/to/cli.cjs] [--check], or --catalog EXPORTED_SOURCE_COMMANDS.json [--check].";
	for (let index = 0; index < argv.length; index++) {
		const flag = argv[index];
		if (!["--tab", "--cli", "--catalog", "--check"].includes(flag) || options[flag] ||
			(flag !== "--check" && (!argv[index + 1] || argv[index + 1].startsWith("--")))) throw new Error(usage);
		options[flag] = flag === "--check" ? true : argv[++index];
	}
	const project = ({ type, description, mutates, permission, params }) => ({ type, description, mutates, ...(permission ? { permission } : {}), params });
	let catalog;
	if (options["--catalog"]) {
		// Isolated-source refresh: an array of descriptors exported from the frontend registry; Desktop controls come from the saved snapshot.
		if (options["--tab"] || options["--cli"]) throw new Error(usage);
		const exported = JSON.parse(fs.readFileSync(path.resolve(options["--catalog"]), "utf8"));
		const snapshot = JSON.parse(fs.readFileSync(path.join(__dirname, "command-catalog.json"), "utf8"));
		if (!Array.isArray(exported)) throw new Error("--catalog must contain a JSON array of command descriptors.");
		catalog = { version: 1, source: "isolated-source", commands: exported.map(project), desktopActions: snapshot.desktopActions };
	} else {
		if (!options["--tab"]) throw new Error("An explicit --tab is required.");
		const cli = path.resolve(options["--cli"] || path.join(__dirname, "../TradingLead-Desktop/cli.cjs"));
		const read = args => {
			const response = JSON.parse(execFileSync(process.execPath, [cli, ...args], { encoding: "utf8", maxBuffer: 256 * 1024, stdio: ["ignore", "pipe", "pipe"] }));
			if (response.status !== "ok") throw new Error(`Discovery failed: ${response.code || "unknown error"}`);
			return response.data;
		};
		const frontend = read(["capabilities", "--tab", options["--tab"]]), desktop = read(["desktop", "capabilities"]);
		if (!Array.isArray(frontend.capabilities) || !Array.isArray(desktop.actions)) throw new Error("Unexpected discovery response.");
		catalog = { version: 1, commands: frontend.capabilities.map(project),
			desktopActions: desktop.actions.map(({ action, description }) => ({ action, description })) };
	}
	const commands = catalog.commands;
	if (options["--check"]) {
		checkReferences(catalog);
		console.log(`Verified ${catalog.source === "isolated-source" ? "isolated-source" : "live"} catalog parity for ${commands.length} commands; no files changed.`);
		return;
	}
	const documents = references(catalog);
	for (const [file, contents] of documents) fs.writeFileSync(path.join(__dirname, file), contents);
	console.log(`Updated ${documents.size} reference files for ${commands.length} commands across ${skillNames.length} skills.`);
}
module.exports = { skillNames, ownerFor, validateCatalog, references, checkReferences };
if (require.main === module) {
	try { main(process.argv.slice(2)); }
	catch (error) { console.error(error.message); process.exitCode = 1; }
}
