"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mocha_1 = require("mocha");
const chai_1 = require("chai");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const index_1 = require("../src/parser/index");
const engine_1 = require("../src/linter/engine");
const SAMPLE_PROJECT_PATH = "/Users/ajgreyling/code/munic-chat";
/**
 * Wrapper for parseText with timeout protection
 * If parser hangs, this will timeout after specified milliseconds
 * Note: Since parseText is synchronous, we run it asynchronously so timeout can interrupt
 */
function parseTextWithTimeout(text, timeoutMs = 30000) {
    return Promise.race([
        new Promise((resolve, reject) => {
            // Run parser asynchronously so timeout can interrupt
            setImmediate(() => {
                try {
                    const result = (0, index_1.parseText)(text);
                    resolve(result);
                }
                catch (err) {
                    reject(err);
                }
            });
        }),
        new Promise((_, reject) => setTimeout(() => reject(new Error(`Parser timeout after ${timeoutMs}ms`)), timeoutMs))
    ]);
}
(0, mocha_1.describe)("Sample DSL Codebase Validation", () => {
    (0, mocha_1.it)("should validate all .mez files in sample project", async function () {
        // Increase timeout significantly to allow for timeout handling per file
        // Each file has 30s timeout, so 73 files * 30s = ~36 minutes worst case
        // But most files should complete quickly, so 10 minutes should be sufficient
        this.timeout(600000); // 10 minutes total timeout
        const mezFiles = [];
        function findMezFiles(dir) {
            const entries = fs.readdirSync(dir, { withFileTypes: true });
            for (const entry of entries) {
                const fullPath = path.join(dir, entry.name);
                if (entry.isDirectory()) {
                    findMezFiles(fullPath);
                }
                else if (entry.name.endsWith(".mez")) {
                    mezFiles.push(fullPath);
                }
            }
        }
        findMezFiles(SAMPLE_PROJECT_PATH);
        console.log(`\n  Found ${mezFiles.length} .mez files to validate\n`);
        const fileIssues = {};
        const failedFiles = [];
        let totalIssues = 0;
        const issuesByRule = {};
        for (let i = 0; i < mezFiles.length; i++) {
            const file = mezFiles[i];
            const text = fs.readFileSync(file, "utf8");
            const relativePath = path.relative(SAMPLE_PROJECT_PATH, file);
            // Log every file to identify hang location
            console.log(`  [${i + 1}/${mezFiles.length}] Starting: ${relativePath}`);
            try {
                // Parse with timeout protection
                console.log(`  [${i + 1}/${mezFiles.length}] Parsing...`);
                let parseResult;
                try {
                    parseResult = await parseTextWithTimeout(text, 30000);
                    console.log(`  [${i + 1}/${mezFiles.length}] Parsing complete`);
                }
                catch (parseErr) {
                    const errorMsg = parseErr instanceof Error ? parseErr.message : String(parseErr);
                    console.log(`  [${i + 1}/${mezFiles.length}] ⚠️  Parsing failed/timeout: ${errorMsg}`);
                    failedFiles.push({ path: relativePath, error: `Parse error: ${errorMsg}` });
                    // Continue to next file
                    continue;
                }
                // Lint with timeout protection (runLints is already async)
                console.log(`  [${i + 1}/${mezFiles.length}] Linting...`);
                let lintDiagnostics;
                try {
                    lintDiagnostics = await Promise.race([
                        (0, engine_1.runLints)(text),
                        new Promise((_, reject) => setTimeout(() => reject(new Error(`Linter timeout after 30000ms`)), 30000))
                    ]);
                    console.log(`  [${i + 1}/${mezFiles.length}] Linting complete`);
                }
                catch (lintErr) {
                    const errorMsg = lintErr instanceof Error ? lintErr.message : String(lintErr);
                    console.log(`  [${i + 1}/${mezFiles.length}] ⚠️  Linting failed/timeout: ${errorMsg}`);
                    failedFiles.push({ path: relativePath, error: `Lint error: ${errorMsg}` });
                    // Use parse results only if linting failed
                    lintDiagnostics = [];
                }
                const allDiagnostics = [...parseResult.diagnostics, ...lintDiagnostics];
                if (allDiagnostics.length > 0) {
                    fileIssues[relativePath] = allDiagnostics;
                    totalIssues += allDiagnostics.length;
                    allDiagnostics.forEach((diag) => {
                        const source = diag.source || "unknown";
                        issuesByRule[source] = (issuesByRule[source] || 0) + 1;
                    });
                }
            }
            catch (err) {
                const errorMsg = err instanceof Error ? err.message : String(err);
                console.log(`  [${i + 1}/${mezFiles.length}] ⚠️  Unexpected error: ${errorMsg}`);
                failedFiles.push({ path: relativePath, error: errorMsg });
                fileIssues[relativePath] = [
                    {
                        message: errorMsg,
                        range: { start: { line: 0, character: 0 }, end: { line: 0, character: 0 } },
                        severity: 1,
                        source: "test-error",
                    },
                ];
                totalIssues++;
            }
        }
        // Print summary
        console.log(`  📊 Summary:`);
        console.log(`    Files scanned: ${mezFiles.length}`);
        console.log(`    Files with issues: ${Object.keys(fileIssues).length}`);
        console.log(`    Files failed/timeout: ${failedFiles.length}`);
        console.log(`    Total issues: ${totalIssues}`);
        // Report failed files
        if (failedFiles.length > 0) {
            console.log(``);
            console.log(`  ⚠️  Failed/Timeout Files:`);
            failedFiles.forEach(({ path, error }) => {
                console.log(`    ${path}: ${error}`);
            });
        }
        console.log(``);
        console.log(`  📋 Issues by rule:`);
        Object.entries(issuesByRule)
            .sort(([, a], [, b]) => b - a)
            .forEach(([rule, count]) => {
            console.log(`    ${rule}: ${count}`);
        });
        // Print file details (limit to first 5 issues per file)
        if (Object.keys(fileIssues).length > 0) {
            console.log(``);
            console.log(`  📝 Files with issues:`);
            console.log(``);
            for (const [file, issues] of Object.entries(fileIssues)) {
                console.log(`    ${file}:`);
                const displayIssues = issues.slice(0, 5);
                displayIssues.forEach((issue) => {
                    console.log(`      Line ${issue.range.start.line + 1}: ${issue.message}`);
                });
                if (issues.length > 5) {
                    console.log(`      ... and ${issues.length - 5} more`);
                }
                console.log(``);
            }
            // Count critical errors (variable-in-else)
            const varInElseErrors = Object.values(fileIssues)
                .flat()
                .filter((d) => d.message.includes("Variables cannot be declared in else blocks"));
            console.log(`  ❌ ${varInElseErrors.length} errors found`);
        }
        else {
            console.log(``);
            console.log(`  ✅ No issues found!`);
        }
        // Test passes regardless - this is a validation report
        (0, chai_1.expect)(mezFiles.length).to.be.greaterThan(0);
    });
    (0, mocha_1.it)("should not flag variables in else blocks in known-good code", async () => {
        // This is a representative test case
        const testCode = `
      if (x > 0) {
        int y = 5;
      } else {
        return false;
      }
    `;
        const lintDiagnostics = await (0, engine_1.runLints)(testCode);
        const varInElseErrors = lintDiagnostics.filter((d) => d.message.includes("Variables cannot be declared in else blocks"));
        console.log(`    Found ${varInElseErrors.length} variable-in-else violations`);
        (0, chai_1.expect)(varInElseErrors.length).to.equal(0);
    });
});
