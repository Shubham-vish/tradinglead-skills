'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { buildBundle, release } = require('./bundle.cjs');
const { skillNames } = require('./sync-commands.cjs');

test('public bundle is deterministic, document-only and uses the installed CLI in examples', () => {
  const bundle = buildBundle();
  assert.deepEqual(buildBundle(), bundle);
  assert.deepEqual(bundle.skills, skillNames);
  assert.ok(Object.keys(bundle.files).every(file => /\.(md|yaml|json)$/.test(file) && !file.includes('private')));
  assert.match(bundle.files['tl-desktop/SKILL.md'], /tradinglead health/);
  assert.ok(!/\bnode cli\.cjs/.test(bundle.files['tl-desktop/SKILL.md']));
  assert.ok(bundle.files['tl-testing/suites/smoke.yaml']);
});
test('release artifacts are immutable and preserve older compatibility releases', t => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'tradinglead-release-'));
  t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
  for (const name of [...skillNames, 'README.md', 'COMMANDS.md', 'command-catalog.json', 'bundle-policy.json']) {
    fs.cpSync(path.join(__dirname, name), path.join(directory, name), { recursive: true });
  }
  const first = release(directory);
  assert.deepEqual(release(directory), first);
  fs.appendFileSync(path.join(directory, 'tl-desktop/SKILL.md'), '\nExtra clarification.\n');
  assert.throws(() => release(directory), /immutable/);
  const policyFile = path.join(directory, 'bundle-policy.json');
  const policy = JSON.parse(fs.readFileSync(policyFile));
  policy.revision++;
  fs.writeFileSync(policyFile, JSON.stringify(policy));
  const second = release(directory);
  const index = JSON.parse(fs.readFileSync(path.join(directory, 'distribution.json')));
  assert.deepEqual(index.releases.map(item => item.revision), [first.revision, second.revision]);
  assert.ok(fs.existsSync(path.join(directory, first.file)));
});
