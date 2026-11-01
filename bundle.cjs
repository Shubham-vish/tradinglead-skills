'use strict';

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { skillNames } = require('./sync-commands.cjs');

function buildBundle(root = __dirname) {
  require('./validate.cjs').validate(root);
  const policy = JSON.parse(fs.readFileSync(path.join(root, 'bundle-policy.json'), 'utf8'));
  const validVersion = value => typeof value === 'string' && /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.test(value) &&
    value.split('.').map(Number).every(Number.isSafeInteger);
  if (policy.schemaVersion !== 1 || !Number.isSafeInteger(policy.revision) || policy.revision < 1 ||
      !validVersion(policy.requires?.minDesktop) || !validVersion(policy.requires?.maxDesktopExclusive) ||
      !Number.isSafeInteger(policy.requires?.cliApi) || policy.requires.cliApi < 1 ||
      !Number.isSafeInteger(policy.requires?.bridgeProtocol) || policy.requires.bridgeProtocol < 1 ||
      Object.keys(policy.requires).sort().join(',') !== 'bridgeProtocol,cliApi,maxDesktopExclusive,minDesktop') {
    throw new Error('Invalid bundle-policy.json. Explicit app bounds and protocol versions are required.');
  }
  const min = policy.requires.minDesktop.split('.').map(Number), max = policy.requires.maxDesktopExclusive.split('.').map(Number);
  const firstDifference = min.findIndex((value, index) => value !== max[index]);
  if (firstDifference === -1 || min[firstDifference] > max[firstDifference]) throw new Error('Invalid Desktop compatibility range.');
  const files = {};
  function collect(relative) {
    const source = path.join(root, relative), stat = fs.lstatSync(source);
    if (stat.isSymbolicLink()) throw new Error(`Skill bundles cannot follow symlinks: ${relative}`);
    if (stat.isDirectory()) {
      for (const entry of fs.readdirSync(source).sort()) collect(`${relative}/${entry}`);
    } else if (stat.isFile() && (/\.(md|yaml)$/.test(relative) || relative === 'command-catalog.json')) {
      files[relative] = fs.readFileSync(source, 'utf8')
        .replace(/\bnode (?:\.\.\/\.\.\/TradingLead-Desktop\/)?cli\.cjs\b/g, 'tradinglead');
    } else throw new Error(`Non-document in public skills: ${relative}`);
  }
  for (const name of skillNames) {
    if (!/^tl-(?!private-)[a-z0-9-]+$/.test(name)) throw new Error('Only public product skills may ship.');
    collect(name);
  }
  for (const name of ['README.md', 'COMMANDS.md', 'command-catalog.json']) collect(name);
  return { ...policy, skills: [...skillNames], files };
}
function release(root = __dirname) {
  const bundle = buildBundle(root);
  const text = JSON.stringify(bundle);
  const file = `bundle-${bundle.revision}.json`;
  const sha256 = crypto.createHash('sha256').update(text).digest('hex');
  const target = path.join(root, file);
  if (fs.existsSync(target) && fs.readFileSync(target, 'utf8') !== text) {
    throw new Error('Published bundles are immutable. Increase revision in bundle-policy.json.');
  }
  const indexFile = path.join(root, 'distribution.json');
  const index = fs.existsSync(indexFile) ? JSON.parse(fs.readFileSync(indexFile, 'utf8')) : { schemaVersion: 1, releases: [] };
  if (index.schemaVersion !== 1 || !Array.isArray(index.releases)) throw new Error('Invalid distribution index.');
  const entry = { revision: bundle.revision, file, sha256, requires: bundle.requires };
  const existing = index.releases.find(item => item.revision === bundle.revision);
  if (existing && JSON.stringify(existing) !== JSON.stringify(entry)) throw new Error('Existing release metadata is immutable.');
  if (!existing) index.releases.push(entry);
  fs.writeFileSync(target, text);
  fs.writeFileSync(indexFile, `${JSON.stringify(index, null, 2)}\n`);
  return { file, sha256, revision: bundle.revision };
}
module.exports = { buildBundle, release };
if (require.main === module) {
  try {
    const args = process.argv.slice(2);
    if (args.length === 1 && args[0] === '--release') console.log(JSON.stringify(release()));
    else if (args.length === 2 && args[0] === '--output') {
      fs.writeFileSync(path.resolve(args[1]), JSON.stringify(buildBundle()));
    } else throw new Error('Use node bundle.cjs --output FILE or --release. Release only creates local artifacts; it never commits or publishes.');
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
