#!/usr/bin/env node
/**
 * Fill the GitHub owner into every place that needs it.
 *
 *   node scripts/set-owner.mjs <github-user>
 *
 * Rewrites package.json (repository/homepage), README.md and the catalog entry
 * under contrib/. Run it once after creating the repository, before pushing.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const owner = process.argv[2];
if (!owner || !/^[A-Za-z0-9-]+$/.test(owner)) {
  console.error('usage: node scripts/set-owner.mjs <github-user>');
  process.exit(1);
}

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const targets = ['package.json', 'README.md', path.join('contrib', 'awesome-dsh-plugin.yml')];

for (const rel of targets) {
  const file = path.join(root, rel);
  if (!fs.existsSync(file)) continue;
  const before = fs.readFileSync(file, 'utf8');
  const after = before.replaceAll('REPLACE_OWNER', owner);
  if (after !== before) {
    fs.writeFileSync(file, after);
    console.log(`updated ${rel}`);
  }
}

console.log(`\nowner set to "${owner}". Next:`);
console.log('  git add -A && git commit -m "chore: set repository owner"');
console.log('  git remote add origin https://github.com/' + owner + '/dsh-aemeath-theme.git');
console.log('  git push -u origin main');
