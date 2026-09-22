const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { skillNames } = require("./sync-commands.cjs");

function install({ root = __dirname, destination = path.join(os.homedir(), ".copilot", "skills"), check = false } = {}) {
	const links = skillNames.map(name => {
		const target = fs.realpathSync(path.join(root, name)), link = path.join(destination, name);
		if (!fs.statSync(path.join(target, "SKILL.md")).isFile()) throw new Error(`Missing SKILL.md: ${name}`);
		let existing;
		try { existing = fs.lstatSync(link); }
		catch (error) { if (error.code !== "ENOENT") throw error; }
		if (existing) {
			if (!existing.isSymbolicLink() || fs.realpathSync(link) !== target) throw new Error(`Conflicting skill entry, not overwritten: ${link}`);
		} else if (check) throw new Error(`Missing skill link: ${link}`);
		return { name, target, link, existing: Boolean(existing) };
	});
	if (!check) {
		fs.mkdirSync(destination, { recursive: true });
		for (const { target, link, existing } of links) {
			if (!existing) fs.symlinkSync(target, link, process.platform === "win32" ? "junction" : "dir");
		}
	}
	for (const { target, link } of links) {
		if (fs.realpathSync(link) !== target) throw new Error(`Skill link verification failed: ${link}`);
	}
	return { count: links.length, destination, source: fs.realpathSync(root) };
}
module.exports = { install };
if (require.main === module) {
	try {
		if (process.argv.slice(2).some(arg => arg !== "--check") || process.argv.length > 3) throw new Error("Use node install.cjs [--check].");
		require("./validate.cjs").validate();
		console.log(JSON.stringify(install({ check: process.argv.includes("--check") }), null, 2));
	} catch (error) { console.error(error.message); process.exitCode = 1; }
}
