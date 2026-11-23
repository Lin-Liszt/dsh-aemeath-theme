#!/usr/bin/env node
/**
 * Build the Release asset: `dist/dsh-aemeath-theme.tgz`.
 *
 * The file name deliberately carries no version. The catalog entry points at
 * `releases/latest/download/dsh-aemeath-theme.tgz`, and that URL resolves `latest`
 * at request time but takes the file name literally — a versioned asset name
 * works the day it is uploaded and 404s the moment the next release is cut.
 */
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'dist');
fs.mkdirSync(out, { recursive: true });

// A single command string (not an args array) keeps `npm.cmd` runnable on Windows via the shell
// without the args-escaping deprecation that spawnSync warns about.
const packed = spawnSync(`npm pack --pack-destination "${out}"`, {
  cwd: root,
  shell: true,
  stdio: 'inherit',
});
if (packed.status !== 0) process.exit(packed.status ?? 1);

const version = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8')).version;
const produced = path.join(out, `dsh-aemeath-theme-${version}.tgz`);
if (!fs.existsSync(produced)) {
  console.error(`expected ${produced} — npm pack produced something else`);
  process.exit(1);
}

const asset = path.join(out, 'dsh-aemeath-theme.tgz');
fs.rmSync(asset, { force: true });
fs.renameSync(produced, asset);

const sha256 = createHash('sha256').update(fs.readFileSync(asset)).digest('hex');
const size = (fs.statSync(asset).size / 1024 / 1024).toFixed(1);
console.log(`\nasset   ${path.relative(root, asset)}  (${size} MB)`);
console.log(`sha256  ${sha256}`);
console.log('\nupload it to the GitHub Release, keep the tag/asset name stable, then');
console.log('point the catalog entry at releases/latest/download/dsh-aemeath-theme.tgz');
