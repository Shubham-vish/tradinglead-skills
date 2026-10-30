const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { skillNames, ownerFor, references, validateCatalog, checkReferences } = require("./sync-commands.cjs");
const { validate } = require("./validate.cjs");
const { install } = require("./install.cjs");

function withSkillCopy(check) {
	const directory = fs.mkdtempSync(path.join(__dirname, ".tl-skill-coverage-"));
	try {
		for (const filename of ["README.md", "COMMANDS.md", "command-catalog.json"]) {
			fs.copyFileSync(path.join(__dirname, filename), path.join(directory, filename));
		}
		for (const skill of skillNames) fs.cpSync(path.join(__dirname, skill), path.join(directory, skill), { recursive: true });
		check(directory);
	} finally { fs.rmSync(directory, { recursive: true, force: true }); }
}

test("snapshot commands, generated references, examples and skill links are mapped", () => {
	const result = validate();
	assert.equal(result.skills, skillNames.length);
	assert.ok(result.canonicalCommands > 0);
	assert.ok(result.examples >= 3);
	assert.equal(ownerFor("simulation.research"), "tl-strategy-optimization");
	assert.equal(ownerFor("backtesting.forward"), "tl-paper-trading");
	assert.equal(ownerFor("backtesting.back"), "tl-paper-trading");
	assert.equal(ownerFor("research.create"), "tl-research");
	assert.equal(ownerFor("patterns.run"), "tl-patterns");
	assert.equal(ownerFor("patterns.openOccurrence"), "tl-patterns");
	assert.equal(ownerFor("chart.open"), "tl-charts");
	assert.throws(() => ownerFor("invented.execute"), /No skill owns/);
	const catalog = JSON.parse(fs.readFileSync(path.join(__dirname, "command-catalog.json"), "utf8"));
	assert.equal(references(catalog).size, skillNames.length + 2);
	const generated = references(catalog);
	for (const command of catalog.commands.filter(item => item.type.startsWith("patterns."))) {
		assert.ok(generated.get("tl-patterns/commands.md").includes(`## \`${command.type}\``));
		assert.ok(!generated.get("tl-charts/commands.md").includes(`## \`${command.type}\``));
	}
	const withoutGrants = { ...catalog, commands: catalog.commands.map(({ permission, ...command }) => command) };
	const research = references(withoutGrants).get("tl-strategy-optimization/commands.md");
	assert.match(research, /Do not infer grant permissions/);
	assert.doesNotMatch(research, /External permission:.*cloud watchlist/);
});

test("optimizer commands and aliases belong exactly to strategy optimization", () => {
	const catalog = JSON.parse(fs.readFileSync(path.join(__dirname, "command-catalog.json"), "utf8"));
	const generated = references(catalog);
	for (const action of ["optimize", "optimizePreview", "optimizeMeasure", "optimizeRerun"]) {
		assert.equal(ownerFor(`backtesting.${action}`), "tl-strategy-optimization");
		for (const prefix of ["backtesting", "simulation"]) assert.equal(ownerFor(`${prefix}.${action.replace("optimize", "research")}`), "tl-strategy-optimization");
		assert.ok(generated.get("tl-strategy-optimization/commands.md").includes(`## \`backtesting.${action}\``));
		assert.ok(!generated.get("tl-backtesting/commands.md").includes(`## \`backtesting.${action}\``));
		assert.ok(generated.get("tl-strategy-optimization/commands.md").includes(`\`backtesting.${action.replace("optimize", "research")}\``));
		assert.ok(!generated.get("tl-strategy-optimization/commands.md").includes(`## \`backtesting.${action.replace("optimize", "research")}\``));
	}
	assert.match(generated.get("tl-strategy-research/commands.md"), /owns no commands/);
	assert.doesNotMatch(generated.get("tl-strategy-research/commands.md"), /## `backtesting\./);
	const shim = fs.readFileSync(path.join(__dirname, "tl-strategy-research", "SKILL.md"), "utf8");
	assert.match(shim, /Deprecated/);
	assert.match(shim, /\.\.\/tl-strategy-optimization\/SKILL\.md/);
	assert.ok(shim.length < 1500);
	assert.equal(ownerFor("backtesting.researchPreviewExtra"), "tl-backtesting");
});

test("workspace UI commands are owned by exactly one domain skill", () => {
	const owners = {
		"workspace.openSidebar": "tl-desktop", "workspace.setTheme": "tl-desktop",
		"chart.setView": "tl-charts", "chart.compare": "tl-charts", "drawings.create": "tl-charts",
		"layout.set": "tl-charts", "grid.open": "tl-charts", "feeds.list": "tl-charts",
		"watchlists.getRows": "tl-markets", "watchlists.create": "tl-markets", "symbol.details": "tl-markets",
		"peers.get": "tl-markets", "indices.getState": "tl-markets", "heatmap.configure": "tl-markets",
		"intelligence.getReport": "tl-markets", "futures.getReport": "tl-markets", "marketData.getBars": "tl-markets",
		"universe.list": "tl-markets", "alerts.update": "tl-alerts", "alerts.activity": "tl-alerts",
		"studyTemplates.manage": "tl-charts", "peers.configure": "tl-markets",
	};
	for (const [type, owner] of Object.entries(owners)) assert.equal(ownerFor(type), owner, type);
	const catalog = JSON.parse(fs.readFileSync(path.join(__dirname, "command-catalog.json"), "utf8"));
	const generated = references(catalog);
	for (const command of catalog.commands) {
		const holders = skillNames.filter(skill => generated.get(`${skill}/commands.md`).includes(`## \`${command.type}\``));
		assert.ok(holders.every(skill => skill === ownerFor(command.type)) && holders.length <= 1, command.type);
		assert.ok(generated.get(`${ownerFor(command.type)}/commands.md`).includes(`\`${command.type}\``), command.type);
	}
});

test("isolated-source catalog mode checks parity without a tab and records provenance", () => {
	const { execFileSync } = require("node:child_process");
	const directory = fs.mkdtempSync(path.join(__dirname, ".tl-skill-catalog-"));
	try {
		const catalog = JSON.parse(fs.readFileSync(path.join(__dirname, "command-catalog.json"), "utf8"));
		const exported = path.join(directory, "commands.json");
		fs.writeFileSync(exported, JSON.stringify(catalog.commands));
		const run = args => execFileSync(process.execPath, [path.join(__dirname, "sync-commands.cjs"), ...args], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
		assert.match(run(["--catalog", exported, "--check"]), /Verified isolated-source catalog parity/);
		assert.match(references({ ...catalog, source: "isolated-source" }).get("COMMANDS.md"), /isolated frontend registry/);
		fs.writeFileSync(exported, JSON.stringify([...catalog.commands, { type: "chart.newAction", mutates: false, description: "New", params: {} }]));
		assert.throws(() => run(["--catalog", exported, "--check"]), /catalog drift/);
		assert.throws(() => run(["--catalog", exported, "--tab", "x", "--check"]), /--catalog/);
	} finally { fs.rmSync(directory, { recursive: true, force: true }); }
});

test("supporting workflow examples and links cannot bypass catalog validation", () => withSkillCopy(root => {
	const filename = path.join(root, "tl-patterns", "workflow.md");
	const original = fs.readFileSync(filename, "utf8");
	assert.doesNotThrow(() => validate(root));
	fs.writeFileSync(filename, original.replace('"expectedRevision": 1', '"inventedRevision": 1'));
	assert.throws(() => validate(root), /Example disagrees.*workflow\.md/);
	fs.writeFileSync(filename, `${original}\n[Missing reference](missing.md)\n`);
	assert.throws(() => validate(root), /Broken local link.*workflow\.md/);
	fs.writeFileSync(filename, `${original}\n\`\`\`json\n{"type":"screening.getState","params":{}}\n\`\`\`\n`);
	assert.throws(() => validate(root), /Example disagrees.*workflow\.md/);
}));

test("nested guides must be discoverable and their examples are validated", () => withSkillCopy(root => {
	const directory = path.join(root, "tl-patterns", "guides");
	fs.mkdirSync(directory);
	fs.writeFileSync(path.join(directory, "windows.md"), "# Study windows\n");
	assert.throws(() => validate(root), /Unreachable skill document: .*windows\.md/);
	fs.appendFileSync(path.join(root, "tl-patterns", "workflow.md"), "\n[Window details](guides/windows.md)\n");
	const baseline = validate(root);
	fs.appendFileSync(path.join(directory, "windows.md"), '\n```json\n{"type":"patterns.getState","params":{}}\n```\n');
	assert.equal(validate(root).examples, baseline.examples + 1);
	fs.appendFileSync(path.join(directory, "windows.md"), '\n```json\n{"type":"patterns.getState","params":[]}\n```\n');
	assert.throws(() => validate(root), /Example disagrees.*windows\.md/);
}));

test("live parity detects parameter and command drift without rewriting the snapshot", () => {
	const filename = path.join(__dirname, "command-catalog.json"), before = fs.readFileSync(filename, "utf8");
	const catalog = JSON.parse(before);
	assert.doesNotThrow(() => checkReferences(catalog));
	const changed = JSON.parse(before);
	changed.commands[0].params.newField = "New runtime contract";
	assert.throws(() => checkReferences(changed), /Live catalog drift/);
	const added = { ...catalog, commands: [...catalog.commands, { type: "chart.newAction", mutates: false, description: "New action", params: {} }] };
	assert.throws(() => checkReferences(added), /Live catalog drift/);
	assert.equal(fs.readFileSync(filename, "utf8"), before);
});

test("live parity ignores snapshot provenance and JSON object key order, not descriptor semantics", () => {
	const catalog = JSON.parse(fs.readFileSync(path.join(__dirname, "command-catalog.json"), "utf8"));
	const live = {
		version: catalog.version,
		commands: catalog.commands.map(({ params, permission, mutates, description, type }) => ({
			type, description, mutates, ...(permission ? { permission } : {}),
			params: Object.fromEntries(Object.entries(params).reverse()),
		})),
		desktopActions: catalog.desktopActions,
	};
	assert.doesNotThrow(() => checkReferences(live));
	const write = live.commands.find(command => command.permission === "indicators");
	delete write.permission;
	assert.throws(() => checkReferences(live), /Live catalog drift/);
});

test("sync validates 256 descriptors and exact UTF-8 catalog byte limit", () => {
	const commands = Array.from({ length: 256 }, (_, index) => ({
		type: `chart.command${index}`, description: "Read chart", mutates: false, params: {},
	}));
	const catalog = { version: 1, commands, desktopActions: [] };
	assert.doesNotThrow(() => validateCatalog(catalog));
	assert.throws(() => validateCatalog({ ...catalog, commands: [...commands, { ...commands[0], type: "chart.extra" }] }), /Invalid or oversized/);
	assert.throws(() => validateCatalog({ ...catalog, commands: [...commands.slice(1), commands[1]] }), /Invalid command descriptor/);
	assert.throws(() => validateCatalog({ ...catalog, commands: [{ ...commands[0], type: 'chart.open; eval("unsafe")' }] }), /Invalid command descriptor/);
	assert.throws(() => validateCatalog({ ...catalog, commands: [{ ...commands[0], mutates: "false" }] }), /Invalid command descriptor/);
	assert.throws(() => validateCatalog({ ...catalog, commands: [{ ...commands[0], params: [] }] }), /Invalid command descriptor/);
	assert.throws(() => validateCatalog({ ...catalog, commands: [{ ...commands[0], params: { value: 1 } }] }), /Invalid command descriptor/);
	const boundary = [{ ...commands[0], params: { value: "" } }];
	const overhead = Buffer.byteLength(JSON.stringify(boundary));
	boundary[0].params.value = "x".repeat(128 * 1024 - overhead);
	assert.doesNotThrow(() => validateCatalog({ ...catalog, commands: boundary }));
	boundary[0].params.value += "\u20ac";
	assert.throws(() => validateCatalog({ ...catalog, commands: boundary }), /Invalid or oversized/);
});

test("installer is idempotent and verifies links without replacing existing skills", () => {
	const directory = fs.mkdtempSync(path.join(__dirname, ".tl-skill-install-"));
	try {
		const destination = path.join(directory, "skills");
		assert.throws(() => install({ destination, check: true }), /Missing skill link/);
		assert.equal(install({ destination }).count, skillNames.length);
		assert.equal(install({ destination }).count, skillNames.length);
		assert.equal(install({ destination, check: true }).count, skillNames.length);
		for (const name of skillNames) assert.equal(fs.realpathSync(path.join(destination, name)), path.join(__dirname, name));
	} finally { fs.rmSync(directory, { recursive: true, force: true }); }
});

test("installer preflights every conflict before creating any links", () => {
	const directory = fs.mkdtempSync(path.join(__dirname, ".tl-skill-conflict-"));
	try {
		const destination = path.join(directory, "skills");
		fs.mkdirSync(path.join(destination, "tl-research"), { recursive: true });
		fs.writeFileSync(path.join(destination, "tl-research", "keep.txt"), "existing user skill");
		assert.throws(() => install({ destination }), /not overwritten/);
		assert.equal(fs.existsSync(path.join(destination, "tl-desktop")), false);
		assert.equal(fs.readFileSync(path.join(destination, "tl-research", "keep.txt"), "utf8"), "existing user skill");
	} finally { fs.rmSync(directory, { recursive: true, force: true }); }
});
