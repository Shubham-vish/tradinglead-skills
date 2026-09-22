const fs = require("node:fs");
const path = require("node:path");
const { skillNames, ownerFor, references } = require("./sync-commands.cjs");

function validate(root = __dirname) {
	const catalog = JSON.parse(fs.readFileSync(path.join(root, "command-catalog.json"), "utf8"));
	const generated = references(catalog);
	for (const [file, expected] of generated) {
		if (fs.readFileSync(path.join(root, file), "utf8") !== expected) throw new Error(`Stale generated reference: ${file}`);
	}
	const directories = fs.readdirSync(root, { withFileTypes: true }).filter(entry => entry.isDirectory() && !entry.name.startsWith(".")).map(entry => entry.name);
	if (directories.some(name => !skillNames.includes(name))) throw new Error("Unexpected folder in the skill collection.");
	let examples = 0;
	for (const skill of skillNames) {
		const filename = path.join(root, skill, "SKILL.md"), content = fs.readFileSync(filename, "utf8");
		const front = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
		const name = front?.[1].match(/^name: (.+)$/m)?.[1], description = front?.[1].match(/^description: (.+)$/m)?.[1];
		if (name !== skill || !/^tl-[a-z0-9-]+$/.test(name) || name.length > 64 || !description || description.length > 1024) {
			throw new Error(`Invalid skill frontmatter: ${skill}`);
		}
		if (!content.includes("commands.md")) throw new Error(`${skill} does not reference its command contract.`);
		for (const match of content.matchAll(/```json\s*\n([\s\S]*?)```/g)) {
			const example = JSON.parse(match[1]);
			const command = catalog.commands.find(item => item.type === example.type);
			if (!command || ownerFor(command.type) !== skill || !example.params ||
				Object.keys(example.params).some(key => !Object.prototype.hasOwnProperty.call(command.params, key)) ||
				(command.mutates && !/^[A-Za-z0-9_-]{1,80}$/.test(example.idempotencyKey || ""))) {
				throw new Error(`Example disagrees with command catalog: ${skill}`);
			}
			examples++;
		}
	}
	const markdownFiles = ["README.md", "COMMANDS.md", ...skillNames.flatMap(skill => [`${skill}/SKILL.md`, `${skill}/commands.md`])];
	for (const filename of markdownFiles) {
		const content = fs.readFileSync(path.join(root, filename), "utf8");
		for (const match of content.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) {
			const link = match[1];
			if (/^(https?:|#)/.test(link)) continue;
			const resolved = path.resolve(root, path.dirname(filename), link.split("#")[0]);
			if (path.relative(root, resolved).startsWith("..") || !fs.existsSync(resolved)) throw new Error(`Broken local link in ${filename}: ${link}`);
		}
	}
	return { skills: skillNames.length, commands: catalog.commands.length, canonicalCommands: catalog.commands.filter(command => !command.type.startsWith("simulation.")).length, examples };
}
module.exports = { validate };
if (require.main === module) {
	try { console.log(JSON.stringify(validate(), null, 2)); }
	catch (error) { console.error(error.message); process.exitCode = 1; }
}
