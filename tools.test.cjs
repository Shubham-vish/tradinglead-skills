const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { skillNames, ownerFor, references } = require("./sync-commands.cjs");
const { validate } = require("./validate.cjs");
const { install } = require("./install.cjs");

test("all live-catalog commands, generated references, examples and skill links are mapped", () => {
	const result = validate();
	assert.equal(result.skills, 9);
	assert.ok(result.canonicalCommands > 0);
	assert.ok(result.examples >= 3);
	assert.equal(ownerFor("simulation.research"), "tl-strategy-research");
	assert.equal(ownerFor("backtesting.forward"), "tl-paper-trading");
	assert.equal(ownerFor("research.create"), "tl-research");
	assert.throws(() => ownerFor("invented.execute"), /No skill owns/);
	const catalog = JSON.parse(fs.readFileSync(path.join(__dirname, "command-catalog.json"), "utf8"));
	assert.equal(references(catalog).size, skillNames.length + 2);
	const withoutGrants = { ...catalog, commands: catalog.commands.map(({ permission, ...command }) => command) };
	const research = references(withoutGrants).get("tl-strategy-research/commands.md");
	assert.match(research, /Do not infer grant permissions/);
	assert.doesNotMatch(research, /External permission:.*cloud watchlist/);
});

test("installer is idempotent and verifies links without replacing existing skills", () => {
	const directory = fs.mkdtempSync(path.join(os.tmpdir(), "tl-skill-install-"));
	try {
		const destination = path.join(directory, "skills");
		assert.throws(() => install({ destination, check: true }), /Missing skill link/);
		assert.equal(install({ destination }).count, 9);
		assert.equal(install({ destination }).count, 9);
		assert.equal(install({ destination, check: true }).count, 9);
		for (const name of skillNames) assert.equal(fs.realpathSync(path.join(destination, name)), path.join(__dirname, name));
	} finally { fs.rmSync(directory, { recursive: true, force: true }); }
});

test("installer preflights every conflict before creating any links", () => {
	const directory = fs.mkdtempSync(path.join(os.tmpdir(), "tl-skill-conflict-"));
	try {
		const destination = path.join(directory, "skills");
		fs.mkdirSync(path.join(destination, "tl-research"), { recursive: true });
		fs.writeFileSync(path.join(destination, "tl-research", "keep.txt"), "existing user skill");
		assert.throws(() => install({ destination }), /not overwritten/);
		assert.equal(fs.existsSync(path.join(destination, "tl-desktop")), false);
		assert.equal(fs.readFileSync(path.join(destination, "tl-research", "keep.txt"), "utf8"), "existing user skill");
	} finally { fs.rmSync(directory, { recursive: true, force: true }); }
});
