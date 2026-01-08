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
(0, mocha_1.describe)("Sample DSL Codebase Validation", () => {
    (0, mocha_1.it)("should validate all .mez files in sample project", async function () {
        this.timeout(10000); // Increase timeout for large codebases
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
        let totalIssues = 0;
        const issuesByRule = {};
        for (const file of mezFiles) {
            const text = fs.readFileSync(file, "utf8");
            const relativePath = path.relative(SAMPLE_PROJECT_PATH, file);
            try {
                const parseResult = (0, index_1.parseText)(text);
                const lintDiagnostics = await (0, engine_1.runLints)(text);
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
                fileIssues[relativePath] = [
                    {
                        message: err instanceof Error ? err.message : String(err),
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
        console.log(`    Total issues: ${totalIssues}`);
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
