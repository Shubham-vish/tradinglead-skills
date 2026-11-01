const fs = require("node:fs");
const path = require("node:path");

// Dependency-free parser for the restricted YAML used by tl-testing suites:
// block mappings/sequences, `|` literal blocks, full-line comments, plain
// scalars, and JSON-compatible quoted strings and flow collections.
function parseYaml(text, filename = "suite") {
	const lines = text.split(/\r?\n/).map((raw, index) => ({ raw, number: index + 1 }));
	let cursor = 0;
	const fail = (line, message) => { throw new Error(`${filename}:${line.number}: ${message}`); };
	const significant = line => line.raw.trim() !== "" && !/^\s*#/.test(line.raw);
	const indentOf = line => {
		const spaces = line.raw.match(/^ */)[0].length;
		if (line.raw[spaces] === "\t") fail(line, "tabs are not allowed");
		return spaces;
	};
	const skip = () => { while (cursor < lines.length && !significant(lines[cursor])) cursor++; };
	function scalar(value, line) {
		if (/^["[{]/.test(value)) {
			try { return JSON.parse(value); } catch { fail(line, `flow value must be valid JSON: ${value}`); }
		}
		if (/\s#/.test(value)) fail(line, "inline comments are not supported");
		if (value === "true") return true;
		if (value === "false") return false;
		if (value === "null" || value === "~") return null;
		if (/^-?\d+(?:\.\d+)?(?:e[+-]?\d+)?$/i.test(value)) return Number(value);
		if (/^['&*!|>%@`]/.test(value)) fail(line, `unsupported YAML syntax: ${value}`);
		return value;
	}
	function literal(parentIndent) {
		const collected = [];
		while (cursor < lines.length && (lines[cursor].raw.trim() === "" || indentOf(lines[cursor]) > parentIndent)) collected.push(lines[cursor++].raw);
		while (collected.length && collected.at(-1).trim() === "") collected.pop();
		const width = Math.min(...collected.filter(item => item.trim()).map(item => item.match(/^ */)[0].length));
		return collected.map(item => item.slice(width)).join("\n") + "\n";
	}
	function value(rest, indent, line) {
		if (rest === "|") return literal(indent);
		if (rest !== "") return scalar(rest, line);
		skip();
		if (cursor < lines.length && indentOf(lines[cursor]) > indent) return block(indentOf(lines[cursor]));
		if (cursor < lines.length && indentOf(lines[cursor]) === indent && /^\s*- /.test(lines[cursor].raw)) return block(indent);
		return null;
	}
	function mapping(indent, target = {}) {
		for (skip(); cursor < lines.length && indentOf(lines[cursor]) === indent && !/^\s*-( |$)/.test(lines[cursor].raw); skip()) {
			const line = lines[cursor++], match = line.raw.slice(indent).match(/^([A-Za-z_][\w.-]*):(?: (.*))?$/);
			if (!match) fail(line, "expected `key: value`");
			if (Object.prototype.hasOwnProperty.call(target, match[1])) fail(line, `duplicate key ${match[1]}`);
			target[match[1]] = value((match[2] || "").trim(), indent, line);
		}
		return target;
	}
	function block(indent) {
		skip();
		if (!/^\s*-( |$)/.test(lines[cursor].raw)) return mapping(indent);
		const items = [];
		for (skip(); cursor < lines.length && indentOf(lines[cursor]) === indent && /^\s*-( |$)/.test(lines[cursor].raw); skip()) {
			const line = lines[cursor], rest = line.raw.slice(indent + 1).trim();
			if (/^[A-Za-z_][\w.-]*:(?: |$)/.test(rest)) {
				lines[cursor] = { raw: " ".repeat(indent + 2) + rest, number: line.number };
				items.push(mapping(indent + 2));
			} else { cursor++; items.push(value(rest, indent, line)); }
		}
		return items;
	}
	skip();
	const result = block(0);
	skip();
	if (cursor < lines.length) fail(lines[cursor], "unexpected indentation");
	return result;
}

const CATEGORIES = new Set(["contract", "state", "visual", "workflow"]);
const OPERATORS = ["equals", "notEquals", "exists", "type", "contains", "notContains", "gte", "lte", "gt", "lt", "oneOf", "finite", "length", "minLength", "matches"];
const KINDS = new Set(["command", "poll", "cli", "desktop", "sleep", "screenshot"]);
const RETRY_KEY = /^[A-Za-z0-9_-]{1,80}$/;
const SAMPLE_RUN_ID = "r1a2b3c4";

function requiredParams(descriptor) {
	return Object.entries(descriptor.params).filter(([, description]) => {
		const clause = description.split(/[.;]/)[0];
		return /^Required\b/.test(clause) && !/\b(for|with|when|except|only)\b/.test(clause);
	}).map(([key]) => key);
}

function checkSuites(root, catalog) {
	const directory = path.join(root, "tl-testing", "suites");
	const commands = new Map(catalog.commands.map(command => [command.type, command]));
	const desktopActions = new Set(catalog.desktopActions.map(action => action.action));
	const files = fs.readdirSync(directory).filter(name => name.endsWith(".yaml")).sort();
	if (!files.length) throw new Error("tl-testing has no suites.");
	let tests = 0, steps = 0;
	const suiteIds = new Set();
	for (const file of files) {
		const where = `tl-testing/suites/${file}`;
		const suite = parseYaml(fs.readFileSync(path.join(directory, file), "utf8"), where);
		const fail = message => { throw new Error(`${where}: ${message}`); };
		if (suite?.version !== 1 || suite.suite?.id !== file.replace(/\.yaml$/, "")) fail("needs version: 1 and suite.id equal to the file name");
		if (suiteIds.has(suite.suite.id)) fail("duplicate suite id");
		suiteIds.add(suite.suite.id);
		if (!Array.isArray(suite.tests) || !suite.tests.length) fail("needs a non-empty tests list");
		const readOnly = suite.suite.readOnly === true;
		const checkStep = (step, test, known, label) => {
			if (!step || typeof step !== "object" || Array.isArray(step)) fail(`${test.id} ${label}: step must be a mapping`);
			const kind = step.kind || (step.type ? "command" : step.action ? "desktop" : null);
			if (!KINDS.has(kind)) fail(`${test.id} ${label}: unknown step kind`);
			if (step.id !== undefined) {
				if (!/^[A-Za-z][\w-]*$/.test(step.id) || known.has(step.id)) fail(`${test.id} ${label}: invalid or duplicate step id ${step.id}`);
			}
			for (const match of JSON.stringify(step).matchAll(/\{\{\s*([^}]+?)\s*\}\}/g)) {
				const [scope, name] = match[1].split(".");
				if (scope === "steps" && !known.has(name)) fail(`${test.id} ${label}: {{${match[1]}}} references an unknown or later step`);
				if (!["steps", "run", "suite"].includes(scope)) fail(`${test.id} ${label}: unknown interpolation scope ${scope}`);
			}
			if (kind === "desktop" && !desktopActions.has(step.action)) fail(`${test.id} ${label}: unknown desktop action ${step.action}`);
			if (kind === "command" || kind === "poll") {
				const descriptor = commands.get(step.type);
				if (!descriptor) fail(`${test.id} ${label}: ${step.type} is not in command-catalog.json`);
				const params = step.params ?? {};
				if (typeof params !== "object" || Array.isArray(params)) fail(`${test.id} ${label}: params must be a mapping`);
				const unknown = Object.keys(params).filter(key => !Object.prototype.hasOwnProperty.call(descriptor.params, key));
				if (unknown.length) fail(`${test.id} ${label}: ${step.type} has no parameter ${unknown.join(", ")}`);
				const missing = requiredParams(descriptor).filter(key => !(key in params));
				if (missing.length) fail(`${test.id} ${label}: ${step.type} is missing required ${missing.join(", ")}`);
				if (descriptor.mutates) {
					if (readOnly) fail(`${test.id} ${label}: read-only suite uses mutating ${step.type}`);
					if (!RETRY_KEY.test(String(step.idempotencyKey || "").replace(/\{\{\s*run\.id\s*\}\}/g, SAMPLE_RUN_ID))) {
						fail(`${test.id} ${label}: mutating ${step.type} needs an idempotencyKey`);
					}
				}
				if (kind === "poll" && (!step.until?.path || !OPERATORS.some(operator => operator in step.until) || !(step.timeoutMs > 0))) {
					fail(`${test.id} ${label}: poll needs until.path, an operator and timeoutMs`);
				}
				steps++;
			}
			if (step.id !== undefined) known.add(step.id);
		};
		const checkAssertions = (list, test, label) => {
			if (list === undefined) return;
			if (!Array.isArray(list)) fail(`${test.id} ${label}: assertions must be a list`);
			for (const item of list) {
				if (typeof item?.path !== "string" || !OPERATORS.some(operator => operator in item)) fail(`${test.id} ${label}: each assertion needs path and an operator`);
			}
		};
		const testIds = new Set();
		for (const test of suite.tests) {
			if (!test?.id || testIds.has(test.id) || !test.name || !CATEGORIES.has(test.category)) fail(`test ${test?.id}: needs unique id, name and category`);
			testIds.add(test.id);
			const known = new Set();
			(test.setup || []).forEach((step, index) => checkStep(step, test, known, `setup[${index}]`));
			if (test.judge === "llm") {
				if (!Array.isArray(test.steps) || !test.steps.length || !Array.isArray(test.criteria) || !test.criteria.length) fail(`${test.id}: llm tests need steps and criteria`);
				test.steps.forEach((step, index) => checkStep(step, test, known, `steps[${index}]`));
			} else {
				if (!test.execute) fail(`${test.id}: needs execute`);
				checkStep({ id: "execute", ...test.execute }, test, known, "execute");
				checkAssertions(test.assert?.response, test, "assert.response");
				for (const [index, state] of (test.assert?.state || []).entries()) {
					checkStep({ kind: "command", ...state, id: undefined, label: undefined, assertions: undefined }, test, known, `assert.state[${index}]`);
					checkAssertions(state.assertions, test, `assert.state[${index}]`);
				}
				if (test.assert?.visual && (!Array.isArray(test.assert.visual.criteria) || !test.assert.visual.criteria.length)) fail(`${test.id}: visual assertions need criteria`);
			}
			(test.teardown || []).forEach((step, index) => checkStep(step, test, known, `teardown[${index}]`));
			tests++;
		}
	}
	return { suites: files.length, tests, steps };
}

module.exports = { parseYaml, checkSuites, requiredParams };
