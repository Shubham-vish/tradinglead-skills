const fs = require("node:fs");
const path = require("node:path");
const { skillNames, ownerFor, references } = require("./sync-commands.cjs");

function markdownFiles(root, directory) {
	return fs.readdirSync(path.join(root, directory), { withFileTypes: true }).flatMap(entry => {
		const filename = path.join(directory, entry.name);
		return entry.isDirectory() ? markdownFiles(root, filename) : entry.isFile() && entry.name.endsWith(".md") ? [filename] : [];
	});
}

function validate(root = __dirname) {
	const catalog = JSON.parse(fs.readFileSync(path.join(root, "command-catalog.json"), "utf8"));
	const generated = references(catalog);
	for (const [file, expected] of generated) {
		if (fs.readFileSync(path.join(root, file), "utf8") !== expected) throw new Error(`Stale generated reference: ${file}`);
	}
	const directories = fs.readdirSync(root, { withFileTypes: true }).filter(entry => entry.isDirectory() && !entry.name.startsWith(".")).map(entry => entry.name);
	if (directories.some(name => !skillNames.includes(name))) throw new Error("Unexpected folder in the skill collection.");
	for (const skill of skillNames) {
		const filename = path.join(root, skill, "SKILL.md"), content = fs.readFileSync(filename, "utf8");
		const front = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
		const name = front?.[1].match(/^name: (.+)$/m)?.[1], description = front?.[1].match(/^description: (.+)$/m)?.[1];
		if (name !== skill || !/^tl-[a-z0-9-]+$/.test(name) || name.length > 64 || !description || description.length > 1024) {
			throw new Error(`Invalid skill frontmatter: ${skill}`);
		}
		if (!content.includes("commands.md")) throw new Error(`${skill} does not reference its command contract.`);
	}
	let examples = 0;
	const documents = ["README.md", "COMMANDS.md", ...skillNames.flatMap(skill => markdownFiles(root, skill))];
	const links = new Map();
	for (const filename of documents) {
		const content = fs.readFileSync(path.join(root, filename), "utf8");
		const skill = filename.split(path.sep)[0];
		for (const match of content.matchAll(/```json\s*\n([\s\S]*?)```/g)) {
			let example;
			try { example = JSON.parse(match[1]); }
			catch (error) { throw new Error(`Invalid JSON example in ${filename}: ${error.message}`); }
			const command = catalog.commands.find(item => item.type === example?.type);
			if (!command || (skillNames.includes(skill) && ownerFor(command.type) !== skill) ||
				!example.params || typeof example.params !== "object" || Array.isArray(example.params) ||
				Object.keys(example.params).some(key => !Object.prototype.hasOwnProperty.call(command.params, key)) ||
				(command.mutates && !/^[A-Za-z0-9_-]{1,80}$/.test(example.idempotencyKey || ""))) {
				throw new Error(`Example disagrees with command catalog: ${filename}`);
			}
			examples++;
		}
		const targets = [];
		for (const match of content.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) {
			const link = match[1];
			if (/^(https?:|#)/.test(link)) continue;
			const resolved = path.resolve(root, path.dirname(filename), link.split("#")[0]);
			if (path.relative(root, resolved).startsWith("..") || !fs.existsSync(resolved)) throw new Error(`Broken local link in ${filename}: ${link}`);
			targets.push(path.relative(root, resolved));
		}
		links.set(filename, targets);
	}
	const reachable = new Set(), pending = ["README.md"];
	while (pending.length) {
		const filename = pending.pop();
		if (reachable.has(filename)) continue;
		reachable.add(filename);
		pending.push(...(links.get(filename) || []));
	}
	for (const filename of documents) {
		if (!reachable.has(filename)) throw new Error(`Unreachable skill document: ${filename}. Link it from the index or an owning guide.`);
	}
	return { verification: "snapshot-only", skills: skillNames.length, commands: catalog.commands.length, canonicalCommands: catalog.commands.filter(command => !command.type.startsWith("simulation.")).length, documents: documents.length, examples };
}
module.exports = { validate };
if (require.main === module) {
	try { console.log(JSON.stringify(validate(), null, 2)); }
	catch (error) { console.error(error.message); process.exitCode = 1; }
}
