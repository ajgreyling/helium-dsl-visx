#!/usr/bin/env node
/**
 * Bumps the minor version (middle segment) in helium-dsl-vscode/package.json.
 * Usage: run from repo root. Reads/writes helium-dsl-vscode/package.json.
 */
const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const pkgPath = path.join(repoRoot, 'helium-dsl-vscode', 'package.json');

const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
const parts = (pkg.version || '0.0.0').split('.');
const major = parseInt(parts[0], 10) || 0;
const minor = (parseInt(parts[1], 10) || 0) + 1;
const patch = parts[2] !== undefined ? parts[2] : '0';

pkg.version = `${major}.${minor}.${patch}`;
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');

console.log(`Bumped helium-dsl-vscode version to ${pkg.version}`);
