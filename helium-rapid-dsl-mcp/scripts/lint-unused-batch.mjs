#!/usr/bin/env node
/**
 * Batch lint .mez files for unused function diagnostics.
 * Usage: node scripts/lint-unused-batch.mjs <files-list.txt>
 * files-list.txt: one absolute path per line
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { MezWorkspaceService } from '../out/src/services/mezWorkspace.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const listPath = process.argv[2];
if (!listPath || !fs.existsSync(listPath)) {
  console.error('Usage: node scripts/lint-unused-batch.mjs <files-list.txt>');
  process.exit(1);
}

const lines = fs.readFileSync(listPath, 'utf8').split('\n').filter(Boolean);
const firstFile = lines[0];
const root = path.dirname(path.dirname(path.dirname(firstFile)));
if (!firstFile.includes('dsl')) {
  console.error('Paths must be under dsl/');
  process.exit(1);
}
const dslRoot = firstFile.substring(0, firstFile.indexOf('dsl') + 4);

const svc = new MezWorkspaceService(dslRoot);
await new Promise((r) => setTimeout(r, 500));

const results = [];
for (const filePath of lines) {
  if (!filePath.trim()) continue;
  try {
    const diagnostics = await svc.validate(filePath);
    const unusedFns = diagnostics
      .filter((d) => d.source === 'helium-dsl-unused' && d.severity === 2)
      .filter((d) => typeof d.message === 'string' && d.message.startsWith('Function '))
      .map((d) => {
        const m = d.message.match(/^Function .+:(.+) is not used anywhere$/);
        return m ? m[1] : null;
      })
      .filter(Boolean);
    if (unusedFns.length > 0) {
      results.push({ filePath, functions: unusedFns });
    }
  } catch (err) {
    console.error('Error:', filePath, err.message);
  }
}

console.log(JSON.stringify({ filesWithUnusedFunctions: results, total: lines.length }, null, 2));
