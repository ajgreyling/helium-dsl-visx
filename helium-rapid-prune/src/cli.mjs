#!/usr/bin/env node
/**
 * Iterative unused-code pruner using Helium language-server diagnostics.
 *
 * Usage:
 *   helium-rapid-prune /path/to/repo
 *   helium-rapid-prune /path/to/repo --max-passes=25
 *   helium-rapid-prune   (prompts for project root and max passes)
 */
import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

import { ProjectManager } from "helium-dsl-language-server/api";

function parseArgs(argv) {
  let maxPasses = 20;
  let maxPassesFromArgv = false;
  const positionals = [];

  for (const a of argv) {
    if (a === "--help" || a === "-h") {
      console.log(`Usage: helium-rapid-prune [project-root] [options]

Options:
  --max-passes=N     Maximum prune iterations (default: 20)
  -h, --help         Show this help

Environment:
  PROJECT_ROOT       Default project root when not passed as argument`);
      process.exit(0);
    }
    if (a.startsWith("--max-passes=")) {
      maxPasses = Number(a.split("=")[1]);
      maxPassesFromArgv = true;
      continue;
    }
    if (a.startsWith("-")) {
      console.error(`Unknown option: ${a}`);
      process.exit(1);
    }
    positionals.push(a);
  }

  return { maxPasses, maxPassesFromArgv, positionals };
}

async function promptOptions({ maxPasses, maxPassesFromArgv }) {
  const rl = readline.createInterface({ input, output });

  const rootAnswer = (await rl.question("Project root path: ")).trim();
  if (!rootAnswer) {
    await rl.close();
    throw new Error("Project root path is required.");
  }
  const projectRoot = path.resolve(rootAnswer);

  if (!maxPassesFromArgv) {
    const p = (await rl.question("Max passes [20]: ")).trim();
    if (p) {
      const n = Number(p);
      if (!Number.isFinite(n) || n < 1) {
        await rl.close();
        throw new Error("Max passes must be a positive number.");
      }
      maxPasses = n;
    }
  }

  await rl.close();
  return { projectRoot, maxPasses };
}

function walkFilesBySuffix(dir, suffix, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".") || entry.name === "node_modules") continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) walkFilesBySuffix(fullPath, suffix, out);
    else if (entry.name.endsWith(suffix)) out.push(fullPath);
  }
  return out;
}

function walkFilesBySuffixes(dir, suffixes, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".") || entry.name === "node_modules") continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkFilesBySuffixes(fullPath, suffixes, out);
      continue;
    }
    if (suffixes.some((suffix) => entry.name.endsWith(suffix))) out.push(fullPath);
  }
  return out;
}

function toUri(filePath) {
  return pathToFileURL(filePath).toString();
}

function offsetAt(lines, line, character) {
  let offset = 0;
  for (let i = 0; i < line; i++) {
    offset += (lines[i]?.length ?? 0) + 1;
  }
  return offset + character;
}

function removeFunctionByRange(text, fnStart, fnEnd) {
  const lines = text.split(/\r?\n/);
  const start = offsetAt(lines, fnStart.line, fnStart.character);
  const end = offsetAt(lines, fnEnd.line, fnEnd.character);
  let endAdjusted = end;
  const after = text.slice(end);
  const nl = after.match(/^\r?\n/);
  if (nl) endAdjusted += nl[0].length;
  return text.slice(0, start) + text.slice(endAdjusted);
}

function parseFunctionDiagnostic(message) {
  const match = String(message || "").match(/^Function ([A-Za-z0-9_]+):([a-zA-Z0-9_]+) is not used anywhere$/);
  if (!match) return null;
  return { unitName: match[1], fnName: match[2] };
}

function parseUnitDiagnostic(message) {
  const match = String(message || "").match(/^Unit ([A-Za-z0-9_]+) is not used anywhere$/);
  if (!match) return null;
  return { unitName: match[1] };
}

function parseLangDiagnostic(message) {
  const match = String(message || "").match(/^Language entry "([^"]+)" is not referenced/);
  if (!match) return null;
  return { key: match[1] };
}

function removeUnusedLangLines(text, unusedKeys) {
  const lines = text.split(/\r?\n/);
  const kept = [];
  let removed = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const keyMatch = line.match(/^\s*([^#=\s][^=]*?)\s*=/);
    if (keyMatch) {
      const key = keyMatch[1].trim();
      if (unusedKeys.has(key)) {
        removed += 1;
        continue;
      }
    }
    kept.push(line);
  }
  return { text: kept.join("\n"), removed };
}

function collectLiteralTranslationKeyReferences(projectRoot, langFiles) {
  const ignoredFiles = new Set(langFiles.map((p) => path.resolve(p)));
  const sourceFiles = walkFilesBySuffixes(projectRoot, [".mez", ".vxml", ".jrxml", ".json", ".sql", ".md"]);
  const referencedKeys = new Set();

  for (const sourceFile of sourceFiles) {
    const absPath = path.resolve(sourceFile);
    if (ignoredFiles.has(absPath)) continue;

    let text = "";
    try {
      text = fs.readFileSync(sourceFile, "utf8");
    } catch {
      continue;
    }

    const dqRegex = /"([^"\r\n]+)"/g;
    let dqMatch;
    while ((dqMatch = dqRegex.exec(text)) !== null) {
      referencedKeys.add(dqMatch[1]);
    }

    const sqRegex = /'([^'\r\n]+)'/g;
    let sqMatch;
    while ((sqMatch = sqRegex.exec(text)) !== null) {
      referencedKeys.add(sqMatch[1]);
    }
  }

  return referencedKeys;
}

async function buildProjectManager(dslRoot) {
  const pm = new ProjectManager();
  await pm.initialize([{ uri: toUri(dslRoot), name: "dsl" }]);
  const index = pm.indexes.get(dslRoot);
  if (!index) throw new Error(`No project index found for ${dslRoot}`);
  return index;
}

async function pruneIteratively(projectRoot, maxPasses) {
  const dslRoot = projectRoot;
  const langDir = path.join(dslRoot, "web-app", "lang");
  const langFiles = walkFilesBySuffix(langDir, ".lang");
  const summary = {
    passes: 0,
    functionsRemoved: 0,
    unitFilesDeleted: 0,
    langEntriesRemoved: 0,
  };

  for (let pass = 1; pass <= maxPasses; pass++) {
    const index = await buildProjectManager(dslRoot);

    const unitWarningsByUri = new Map();
    const functionCandidates = [];
    const langKeysByFile = new Map();

    for (const [uri, ast] of index.files) {
      const diags = index.getUnusedWarningsForFile(uri, ast);
      for (const d of diags) {
        const msg = String(d.message || "");

        const unitDiag = parseUnitDiagnostic(msg);
        if (unitDiag) {
          const set = unitWarningsByUri.get(uri) || new Set();
          set.add(unitDiag.unitName);
          unitWarningsByUri.set(uri, set);
          continue;
        }

        const fnDiag = parseFunctionDiagnostic(msg);
        if (fnDiag) {
          const unit = (ast.units || []).find((u) => u.name === fnDiag.unitName);
          const fn = (unit?.functions || []).find((f) => f.name === fnDiag.fnName);
          if (unit && fn && fn.returnTypeRange && fn.bodyRange) {
            functionCandidates.push({
              uri,
              returnTypeRange: fn.returnTypeRange,
              bodyRange: fn.bodyRange,
              unitFunctionCount: (unit.functions || []).length,
            });
          }
        }
      }
    }

    for (const langFile of langFiles) {
      const langUri = toUri(langFile);
      const diags = index.getUnusedWarningsForFile(langUri);
      for (const d of diags) {
        const langDiag = parseLangDiagnostic(d.message);
        if (!langDiag) continue;
        const set = langKeysByFile.get(langFile) || new Set();
        set.add(langDiag.key);
        langKeysByFile.set(langFile, set);
      }
    }

    const filesToDelete = [];
    for (const [uri, unitsMarkedUnused] of unitWarningsByUri.entries()) {
      const ast = index.files.get(uri);
      const units = ast?.units || [];
      if (units.length === 1 && unitsMarkedUnused.has(units[0].name)) {
        filesToDelete.push(new URL(uri).pathname);
      }
    }

    const deletedFileSet = new Set(filesToDelete);
    const functionEdits = functionCandidates.filter((c) => {
      if (deletedFileSet.has(new URL(c.uri).pathname)) return false;
      if (c.unitFunctionCount <= 1) return false;
      return true;
    });
    functionEdits.sort((a, b) => {
      if (a.uri !== b.uri) return a.uri.localeCompare(b.uri);
      return b.returnTypeRange.start.line - a.returnTypeRange.start.line;
    });

    let passFunctionsRemoved = 0;
    let passUnitsDeleted = 0;
    let passLangRemoved = 0;

    for (const filePath of filesToDelete) {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        passUnitsDeleted += 1;
      }
    }

    let currentUri = "";
    let currentFilePath = "";
    let currentText = "";
    for (const edit of functionEdits) {
      if (edit.uri !== currentUri) {
        if (currentFilePath && currentText !== "") fs.writeFileSync(currentFilePath, currentText, "utf8");
        currentUri = edit.uri;
        currentFilePath = new URL(edit.uri).pathname;
        if (!fs.existsSync(currentFilePath)) {
          currentText = "";
          continue;
        }
        currentText = fs.readFileSync(currentFilePath, "utf8");
      }
      if (currentText === "") continue;
      const before = currentText;
      currentText = removeFunctionByRange(currentText, edit.returnTypeRange.start, edit.bodyRange.end);
      if (before !== currentText) passFunctionsRemoved += 1;
    }
    if (currentFilePath && currentText !== "") fs.writeFileSync(currentFilePath, currentText, "utf8");

    const literalLangKeyRefs = collectLiteralTranslationKeyReferences(projectRoot, langFiles);
    for (const [langPath, unusedKeys] of langKeysByFile.entries()) {
      if (!fs.existsSync(langPath)) continue;
      const oldText = fs.readFileSync(langPath, "utf8");
      const safeToRemove = new Set([...unusedKeys].filter((key) => !literalLangKeyRefs.has(key)));
      const result = removeUnusedLangLines(oldText, safeToRemove);
      if (result.text !== oldText) {
        fs.writeFileSync(langPath, result.text, "utf8");
        passLangRemoved += result.removed;
      }
    }

    summary.passes = pass;
    summary.functionsRemoved += passFunctionsRemoved;
    summary.unitFilesDeleted += passUnitsDeleted;
    summary.langEntriesRemoved += passLangRemoved;

    if (passFunctionsRemoved === 0 && passUnitsDeleted === 0 && passLangRemoved === 0) break;
  }

  return summary;
}

const parsed = parseArgs(process.argv.slice(2));
let projectRoot;
let maxPasses = parsed.maxPasses;

if (parsed.positionals[0]) {
  projectRoot = path.resolve(parsed.positionals[0]);
} else if (process.env.PROJECT_ROOT) {
  projectRoot = path.resolve(process.env.PROJECT_ROOT);
} else {
  const prompted = await promptOptions(parsed);
  projectRoot = prompted.projectRoot;
  maxPasses = prompted.maxPasses;
}

if (!fs.existsSync(projectRoot)) {
  console.error(`Project root does not exist: ${projectRoot}`);
  process.exit(1);
}

const result = await pruneIteratively(projectRoot, maxPasses);
console.log(JSON.stringify(result, null, 2));
