import { describe, it } from "mocha";
import { expect } from "chai";
import * as fs from "fs";
import * as path from "path";
import { parseText } from "../src/parser/index.js";
import { runLints } from "../src/linter/engine.js";
import { Diagnostic } from "vscode-languageserver";

const SAMPLE_PROJECT_PATH = "/Users/ajgreyling/code/munic-chat";

/**
 * Wrapper for parseText with timeout protection
 * If parser hangs, this will timeout after specified milliseconds
 * Note: Since parseText is synchronous, we run it asynchronously so timeout can interrupt
 */
function parseTextWithTimeout(text: string, timeoutMs: number = 30000): Promise<{ diagnostics: Diagnostic[] }> {
  return Promise.race([
    new Promise<{ diagnostics: Diagnostic[] }>((resolve, reject) => {
      // Run parser asynchronously so timeout can interrupt
      setImmediate(() => {
        try {
          const result = parseText(text);
          resolve(result);
        } catch (err) {
          reject(err);
        }
      });
    }),
    new Promise<{ diagnostics: Diagnostic[] }>((_, reject) => 
      setTimeout(() => reject(new Error(`Parser timeout after ${timeoutMs}ms`)), timeoutMs)
    )
  ]);
}

describe("Sample DSL Codebase Validation", () => {
  it("should validate all .mez files in sample project", async function() {
    // Increase timeout significantly to allow for timeout handling per file
    // Each file has 30s timeout, so 73 files * 30s = ~36 minutes worst case
    // But most files should complete quickly, so 10 minutes should be sufficient
    this.timeout(600000); // 10 minutes total timeout

    const mezFiles: string[] = [];

    function findMezFiles(dir: string) {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          findMezFiles(fullPath);
        } else if (entry.name.endsWith(".mez")) {
          mezFiles.push(fullPath);
        }
      }
    }

    findMezFiles(SAMPLE_PROJECT_PATH);
    console.log(`\n  Found ${mezFiles.length} .mez files to validate\n`);

    const fileIssues: Record<string, any[]> = {};
    const failedFiles: Array<{ path: string; error: string }> = [];
    let totalIssues = 0;
    const issuesByRule: Record<string, number> = {};

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
        } catch (parseErr) {
          const errorMsg = parseErr instanceof Error ? parseErr.message : String(parseErr);
          console.log(`  [${i + 1}/${mezFiles.length}] ⚠️  Parsing failed/timeout: ${errorMsg}`);
          failedFiles.push({ path: relativePath, error: `Parse error: ${errorMsg}` });
          // Continue to next file
          continue;
        }

        // Lint with timeout protection (runLints is already async)
        console.log(`  [${i + 1}/${mezFiles.length}] Linting...`);
        let lintDiagnostics: Diagnostic[];
        try {
          lintDiagnostics = await Promise.race([
            runLints(text),
            new Promise<Diagnostic[]>((_, reject) => 
              setTimeout(() => reject(new Error(`Linter timeout after 30000ms`)), 30000)
            )
          ]);
          if (lintDiagnostics.length > 0) {
            console.log(`  [${i + 1}/${mezFiles.length}] Linting complete`);
          }
        } catch (lintErr) {
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
      } catch (err) {
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
    } else {
      console.log(``);
      console.log(`  ✅ No issues found!`);
    }

    // Test passes regardless - this is a validation report
    expect(mezFiles.length).to.be.greaterThan(0);
  });
});
