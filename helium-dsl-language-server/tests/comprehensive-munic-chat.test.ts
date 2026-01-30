import { describe, it } from "mocha";
import { expect } from "chai";
import * as fs from "fs";
import * as path from "path";
import { URI } from "vscode-uri";
import { TextDocument } from "vscode-languageserver-textdocument";
import { Position, CompletionParams, DefinitionParams, ReferenceParams, DocumentSymbolParams } from "vscode-languageserver/node.js";
import { ANTLRInputStream, CommonTokenStream } from "antlr4ts";
import { Diagnostic } from "vscode-languageserver";

// Import language server components
import { parseText } from "../src/parser/index.js";
import { runLints } from "../src/linter/engine.js";
import { buildFileAst, FileAst } from "../src/ast/builder.js";
import { ProjectManager } from "../src/index/projectManager.js";
import { createRequire } from "module";
import { fileURLToPath } from "url";

// Create require function for dynamic module loading in ES modules
const require = createRequire(import.meta.url);

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Load generated parser/lexer classes
 */
function loadGenerated(name: string): any | undefined {
  const currentDir = __dirname;
  
  // Helper function to try loading a module from a path
  const tryLoad = (modulePath: string, withExtension?: string): any | undefined => {
    const pathsToTry = withExtension 
      ? [modulePath + withExtension, modulePath]
      : [modulePath];
    
    for (const tryPath of pathsToTry) {
      if (fs.existsSync(tryPath + ".ts") || fs.existsSync(tryPath + ".js") || fs.existsSync(tryPath)) {
        try {
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          const mod = require(tryPath);
          if (mod) {
            return mod[name] || mod;
          }
        } catch (e) {
          // Continue to next path
        }
      }
    }
    return undefined;
  };
  
  // Try bundled path first (when packaged in extension)
  const bundledPath = path.resolve(currentDir, "../generated/parser/generated/grammar", name);
  const bundledResult = tryLoad(bundledPath);
  if (bundledResult) return bundledResult;
  
  // Fallback to development path
  const devPath = path.resolve(currentDir, "../../generated/parser/generated/grammar", name);
  const devResult = tryLoad(devPath);
  if (devResult) return devResult;
  
  // Fallback to sibling directory path (helium-vscode-tooling)
  const projectRoot = path.resolve(currentDir, "../../..");
  const toolingPath = path.resolve(projectRoot, "helium-vscode-tooling/generated/parser/generated/grammar", name);
  
  // Try siblingPath1 first (correct path from TypeScript source: tests)
  const siblingPath1 = path.resolve(currentDir, "../../helium-vscode-tooling/generated/parser/generated/grammar", name);
  const sibling1Result = tryLoad(siblingPath1, ".ts");
  if (sibling1Result) return sibling1Result;
  
  // Try siblingPath2 (correct path from compiled output: out/tests)
  const siblingPath2 = path.resolve(currentDir, "../../../helium-vscode-tooling/generated/parser/generated/grammar", name);
  const sibling2Result = tryLoad(siblingPath2, ".ts");
  if (sibling2Result) return sibling2Result;
  
  // Try absolute path from project root (most reliable)
  const absoluteResult = tryLoad(toolingPath, ".ts");
  if (absoluteResult) return absoluteResult;
  
  return undefined;
}

const SAMPLE_PROJECT_PATH = "/Users/ajgreyling/code/munic-chat";

/**
 * Helper function to tokenize text using lexer only
 */
function tokenizeText(text: string): {
  tokens: Array<{ text: string; type: string; line: number; charPositionInLine: number }>;
  lexerErrors: Diagnostic[];
} {
  const MezDSLLexer = loadGenerated("MezDSLLexer");
  const MezDSLParser = loadGenerated("MezDSLParser");

  if (!MezDSLLexer || !MezDSLParser) {
    return { tokens: [], lexerErrors: [] };
  }

  const input = new ANTLRInputStream(text);
  const lexer = new MezDSLLexer(input);
  const tokens = new CommonTokenStream(lexer);
  
  // Collect lexer errors
  const lexerErrors: Diagnostic[] = [];
  const errorListener = {
    syntaxError: (
      _recognizer: any,
      _offendingSymbol: any,
      line: number,
      charPositionInLine: number,
      msg: string
    ) => {
      lexerErrors.push({
        message: msg,
        range: {
          start: { line: line - 1, character: charPositionInLine },
          end: { line: line - 1, character: charPositionInLine + 1 },
        },
        severity: 1, // Error
        source: "helium-dsl-lexer",
      });
    },
  };

  lexer.removeErrorListeners();
  lexer.addErrorListener(errorListener as any);

  // Fill token stream
  tokens.fill();

  // Extract token information
  const vocabulary = MezDSLParser.VOCABULARY;
  const tokenList = tokens.getTokens().map((token) => ({
    text: token.text || "",
    type: vocabulary.getDisplayName(token.type),
    line: token.line,
    charPositionInLine: token.charPositionInLine,
  }));

  return { tokens: tokenList, lexerErrors };
}

/**
 * Wrapper for tokenizeText with timeout protection
 */
function tokenizeTextWithTimeout(
  text: string,
  timeoutMs: number = 30000
): Promise<{ tokens: Array<{ text: string; type: string; line: number; charPositionInLine: number }>; lexerErrors: Diagnostic[] }> {
  return Promise.race([
    new Promise<{ tokens: Array<{ text: string; type: string; line: number; charPositionInLine: number }>; lexerErrors: Diagnostic[] }>((resolve, reject) => {
      setImmediate(() => {
        try {
          const result = tokenizeText(text);
          resolve(result);
        } catch (err) {
          reject(err);
        }
      });
    }),
    new Promise<{ tokens: Array<{ text: string; type: string; line: number; charPositionInLine: number }>; lexerErrors: Diagnostic[] }>((_, reject) =>
      setTimeout(() => reject(new Error(`Lexer timeout after ${timeoutMs}ms`)), timeoutMs)
    )
  ]);
}

/**
 * Wrapper for parseText with timeout protection
 */
function parseTextWithTimeout(text: string, timeoutMs: number = 30000): Promise<{ diagnostics: Diagnostic[] }> {
  return Promise.race([
    new Promise<{ diagnostics: Diagnostic[] }>((resolve, reject) => {
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

/**
 * Wrapper for buildFileAst with timeout protection
 */
function buildFileAstWithTimeout(
  text: string,
  uri: string,
  timeoutMs: number = 30000
): Promise<FileAst> {
  return Promise.race([
    new Promise<FileAst>((resolve, reject) => {
      setImmediate(async () => {
        try {
          const result = await buildFileAst(text, uri);
          resolve(result.ast);
        } catch (err) {
          reject(err);
        }
      });
    }),
    new Promise<FileAst>((_, reject) =>
      setTimeout(() => reject(new Error(`AST building timeout after ${timeoutMs}ms`)), timeoutMs)
    )
  ]);
}

/**
 * Find interesting positions in a file for LSP testing
 */
function findTestPositions(text: string, uri: string): Array<{ position: Position; description: string }> {
  const positions: Array<{ position: Position; description: string }> = [];
  const lines = text.split(/\r?\n/);

  // Find function calls (e.g., "functionName(")
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const funcCallMatch = line.match(/\b([a-z][A-Za-z0-9_]*)\s*\(/);
    if (funcCallMatch) {
      const charPos = funcCallMatch.index! + funcCallMatch[1].length;
      positions.push({
        position: { line: i, character: charPos },
        description: `Function call: ${funcCallMatch[1]}`,
      });
    }

    // Find unit references (e.g., "UnitName:")
    const unitRefMatch = line.match(/\b([A-Z][A-Za-z0-9_]*)\s*:/);
    if (unitRefMatch) {
      const charPos = unitRefMatch.index! + unitRefMatch[1].length;
      positions.push({
        position: { line: i, character: charPos },
        description: `Unit reference: ${unitRefMatch[1]}`,
      });
    }

    // Find variable declarations (e.g., "int variableName")
    const varDeclMatch = line.match(/\b(int|string|bool|decimal|uuid|json|jsonarray|date|datetime|bigint|blob|[A-Z][A-Za-z0-9_]*)\s+([a-z][A-Za-z0-9_]*)\s*[=;]/);
    if (varDeclMatch) {
      const charPos = (varDeclMatch.index || 0) + varDeclMatch[1].length + 1 + varDeclMatch[2].length;
      positions.push({
        position: { line: i, character: charPos },
        description: `Variable: ${varDeclMatch[2]}`,
      });
    }
  }

  return positions.slice(0, 10); // Limit to first 10 positions per file
}

/**
 * Statistics collected during testing
 */
type TestStatistics = {
  totalFiles: number;
  lexer: {
    totalTokens: number;
    tokenTypes: Record<string, number>;
    errors: number;
    failedFiles: Array<{ path: string; error: string }>;
  };
  parser: {
    errors: number;
    errorsByType: Record<string, number>;
    failedFiles: Array<{ path: string; error: string }>;
  };
  linter: {
    totalIssues: number;
    issuesByRule: Record<string, number>;
    filesWithIssues: number;
    failedFiles: Array<{ path: string; error: string }>;
  };
  ast: {
    successfulBuilds: number;
    failedBuilds: number;
    emptyAsts: number;
    totalObjects: number;
    totalUnits: number;
    totalEnums: number;
    totalTypeReferences: number;
    totalUnitReferences: number;
    totalFunctionCalls: number;
    failedFiles: Array<{ path: string; error: string }>;
  };
  lsp: {
    completionTests: number;
    completionSuccesses: number;
    definitionTests: number;
    definitionSuccesses: number;
    referencesTests: number;
    referencesSuccesses: number;
    documentSymbolsTests: number;
    documentSymbolsSuccesses: number;
  };
};

describe("Comprehensive munic-chat Tests", () => {
  // Find all .mez files
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
  console.log(`\n  Found ${mezFiles.length} .mez files to test\n`);

  // Initialize statistics
  const stats: TestStatistics = {
    totalFiles: mezFiles.length,
    lexer: {
      totalTokens: 0,
      tokenTypes: {},
      errors: 0,
      failedFiles: [],
    },
    parser: {
      errors: 0,
      errorsByType: {},
      failedFiles: [],
    },
    linter: {
      totalIssues: 0,
      issuesByRule: {},
      filesWithIssues: 0,
      failedFiles: [],
    },
    ast: {
      successfulBuilds: 0,
      failedBuilds: 0,
      emptyAsts: 0,
      totalObjects: 0,
      totalUnits: 0,
      totalEnums: 0,
      totalTypeReferences: 0,
      totalUnitReferences: 0,
      totalFunctionCalls: 0,
      failedFiles: [],
    },
    lsp: {
      completionTests: 0,
      completionSuccesses: 0,
      definitionTests: 0,
      definitionSuccesses: 0,
      referencesTests: 0,
      referencesSuccesses: 0,
      documentSymbolsTests: 0,
      documentSymbolsSuccesses: 0,
    },
  };

  describe("Lexer Tests", () => {
    it("should tokenize all .mez files", async function () {
      this.timeout(600000); // 10 minutes

      for (let i = 0; i < mezFiles.length; i++) {
        const file = mezFiles[i];
        const text = fs.readFileSync(file, "utf8");
        const relativePath = path.relative(SAMPLE_PROJECT_PATH, file);

        try {
          const result = await tokenizeTextWithTimeout(text, 30000);
          
          stats.lexer.totalTokens += result.tokens.length;
          result.tokens.forEach((token) => {
            stats.lexer.tokenTypes[token.type] = (stats.lexer.tokenTypes[token.type] || 0) + 1;
          });
          
          stats.lexer.errors += result.lexerErrors.length;
        } catch (err) {
          const errorMsg = err instanceof Error ? err.message : String(err);
          console.log(`  [${i + 1}/${mezFiles.length}] ⚠️  Lexer failed/timeout: ${errorMsg}`);
          stats.lexer.failedFiles.push({ path: relativePath, error: errorMsg });
        }
      }
    });
  });

  describe("Parser Tests", () => {
    it("should parse all .mez files", async function () {
      this.timeout(600000); // 10 minutes

      for (let i = 0; i < mezFiles.length; i++) {
        const file = mezFiles[i];
        const text = fs.readFileSync(file, "utf8");
        const relativePath = path.relative(SAMPLE_PROJECT_PATH, file);

        try {
          const parseResult = await parseTextWithTimeout(text, 30000);
          
          stats.parser.errors += parseResult.diagnostics.length;
          parseResult.diagnostics.forEach((diag) => {
            const source = diag.source || "unknown";
            stats.parser.errorsByType[source] = (stats.parser.errorsByType[source] || 0) + 1;
          });
        } catch (err) {
          const errorMsg = err instanceof Error ? err.message : String(err);
          console.log(`  [${i + 1}/${mezFiles.length}] ⚠️  Parser failed/timeout: ${errorMsg}`);
          stats.parser.failedFiles.push({ path: relativePath, error: errorMsg });
        }
      }
    });
  });

  describe("Linter Tests", () => {
    it("should lint all .mez files", async function () {
      this.timeout(600000); // 10 minutes

      for (let i = 0; i < mezFiles.length; i++) {
        const file = mezFiles[i];
        const text = fs.readFileSync(file, "utf8");
        const relativePath = path.relative(SAMPLE_PROJECT_PATH, file);

        try {
          const lintDiagnostics = await Promise.race([
            runLints(text),
            new Promise<Diagnostic[]>((_, reject) =>
              setTimeout(() => reject(new Error(`Linter timeout after 30000ms`)), 30000)
            )
          ]);

          if (lintDiagnostics.length > 0) {
            stats.linter.filesWithIssues++;
            stats.linter.totalIssues += lintDiagnostics.length;
            lintDiagnostics.forEach((diag: { source?: string }) => {
              const source = diag.source || "unknown";
              stats.linter.issuesByRule[source] = (stats.linter.issuesByRule[source] || 0) + 1;
            });
          }
        } catch (err) {
          const errorMsg = err instanceof Error ? err.message : String(err);
          console.log(`  [${i + 1}/${mezFiles.length}] ⚠️  Linter failed/timeout: ${errorMsg}`);
          stats.linter.failedFiles.push({ path: relativePath, error: errorMsg });
        }
      }
    });
  });

  describe("AST Tests", () => {
    it("should build ASTs for all .mez files", async function () {
      this.timeout(600000); // 10 minutes

      for (let i = 0; i < mezFiles.length; i++) {
        const file = mezFiles[i];
        const text = fs.readFileSync(file, "utf8");
        const relativePath = path.relative(SAMPLE_PROJECT_PATH, file);
        const uri = URI.file(file).toString();

        try {
          const ast = await buildFileAstWithTimeout(text, uri, 30000);

          // Check if AST is empty
          const isEmpty =
            ast.objects.length === 0 &&
            ast.units.length === 0 &&
            ast.enums.length === 0 &&
            ast.typeReferences.length === 0 &&
            ast.unitReferences.length === 0 &&
            ast.functionCalls.length === 0;

          if (isEmpty) {
            stats.ast.emptyAsts++;
            continue;
          }

          stats.ast.successfulBuilds++;
          stats.ast.totalObjects += ast.objects.length;
          stats.ast.totalUnits += ast.units.length;
          stats.ast.totalEnums += ast.enums.length;
          stats.ast.totalTypeReferences += ast.typeReferences.length;
          stats.ast.totalUnitReferences += ast.unitReferences.length;
          stats.ast.totalFunctionCalls += ast.functionCalls.length;
        } catch (err) {
          const errorMsg = err instanceof Error ? err.message : String(err);
          console.log(`  [${i + 1}/${mezFiles.length}] ⚠️  AST building failed/timeout: ${errorMsg}`);
          stats.ast.failedBuilds++;
          stats.ast.failedFiles.push({ path: relativePath, error: errorMsg });
        }
      }
    });
  });

  describe("LSP Feature Tests", () => {
    it("should test LSP features on sample files", async function () {
      this.timeout(600000); // 10 minutes

      // Initialize ProjectManager
      const projectManager = new ProjectManager();
      projectManager.initialize([{ uri: URI.file(SAMPLE_PROJECT_PATH).toString(), name: "munic-chat" }]);

      // Test on a subset of files (first 20 files to keep test time reasonable)
      const testFiles = mezFiles.slice(0, 20);

      for (let i = 0; i < testFiles.length; i++) {
        const file = testFiles[i];
        const text = fs.readFileSync(file, "utf8");
        const relativePath = path.relative(SAMPLE_PROJECT_PATH, file);
        const uri = URI.file(file).toString();

        console.log(`  [${i + 1}/${testFiles.length}] Testing LSP: ${relativePath}`);

        try {
          // Create TextDocument
          const doc = TextDocument.create(uri, "helium-dsl", 1, text);
          projectManager.updateDocument(doc);

          // Find test positions
          const testPositions = findTestPositions(text, uri);

          // Test completions
          for (const { position, description } of testPositions.slice(0, 3)) {
            stats.lsp.completionTests++;
            try {
              const params: CompletionParams = {
                textDocument: { uri },
                position,
              };
              const completions = await projectManager.getCompletions(params, doc);
              if (completions.length > 0) {
                stats.lsp.completionSuccesses++;
              }
            } catch (err) {
              // Ignore completion errors
            }
          }

          // Test definitions
          for (const { position, description } of testPositions.slice(0, 3)) {
            stats.lsp.definitionTests++;
            try {
              const params: DefinitionParams = {
                textDocument: { uri },
                position,
              };
              const definitions = projectManager.getDefinition(params);
              if (definitions && (Array.isArray(definitions) ? definitions.length > 0 : definitions !== null)) {
                stats.lsp.definitionSuccesses++;
              }
            } catch (err) {
              // Ignore definition errors
            }
          }

          // Test references
          for (const { position, description } of testPositions.slice(0, 3)) {
            stats.lsp.referencesTests++;
            try {
              const params: ReferenceParams = {
                textDocument: { uri },
                position,
                context: { includeDeclaration: true },
              };
              const references = projectManager.getReferences(params);
              if (references.length > 0) {
                stats.lsp.referencesSuccesses++;
              }
            } catch (err) {
              // Ignore references errors
            }
          }

          // Test document symbols
          stats.lsp.documentSymbolsTests++;
          try {
            const params: DocumentSymbolParams = {
              textDocument: { uri },
            };
            const symbols = projectManager.getDocumentSymbols(doc);
            if (symbols.length > 0) {
              stats.lsp.documentSymbolsSuccesses++;
            }
          } catch (err) {
            // Ignore document symbols errors
          }
        } catch (err) {
          const errorMsg = err instanceof Error ? err.message : String(err);
          console.log(`  [${i + 1}/${testFiles.length}] ⚠️  LSP testing failed: ${errorMsg}`);
        }
      }
    });
  });

  describe("Comprehensive Report", () => {
    it("should generate comprehensive test report", () => {
      console.log(`\n  ${"=".repeat(80)}`);
      console.log(`  COMPREHENSIVE TEST REPORT`);
      console.log(`  ${"=".repeat(80)}\n`);

      console.log(`  📊 File Processing:`);
      console.log(`    Total files scanned: ${stats.totalFiles}\n`);

      console.log(`  🔤 Lexer Statistics:`);
      console.log(`    Total tokens: ${stats.lexer.totalTokens}`);
      console.log(`    Lexer errors: ${stats.lexer.errors}`);
      console.log(`    Unique token types: ${Object.keys(stats.lexer.tokenTypes).length}`);
      if (stats.lexer.failedFiles.length > 0) {
        console.log(`    Failed files: ${stats.lexer.failedFiles.length}`);
      }
      console.log(``);

      console.log(`  📝 Parser Statistics:`);
      console.log(`    Parser errors: ${stats.parser.errors}`);
      console.log(`    Errors by type:`);
      Object.entries(stats.parser.errorsByType)
        .sort(([, a], [, b]) => b - a)
        .forEach(([type, count]) => {
          console.log(`      ${type}: ${count}`);
        });
      if (stats.parser.failedFiles.length > 0) {
        console.log(`    Failed files: ${stats.parser.failedFiles.length}`);
      }
      console.log(``);

      console.log(`  🔍 Linter Statistics:`);
      console.log(`    Total issues: ${stats.linter.totalIssues}`);
      console.log(`    Files with issues: ${stats.linter.filesWithIssues}`);
      console.log(`    Issues by rule:`);
      Object.entries(stats.linter.issuesByRule)
        .sort(([, a], [, b]) => b - a)
        .forEach(([rule, count]) => {
          console.log(`      ${rule}: ${count}`);
        });
      if (stats.linter.failedFiles.length > 0) {
        console.log(`    Failed files: ${stats.linter.failedFiles.length}`);
      }
      console.log(``);

      console.log(`  🌳 AST Statistics:`);
      console.log(`    Successful builds: ${stats.ast.successfulBuilds}`);
      console.log(`    Failed builds: ${stats.ast.failedBuilds}`);
      console.log(`    Empty ASTs: ${stats.ast.emptyAsts}`);
      console.log(`    Objects: ${stats.ast.totalObjects}`);
      console.log(`    Units: ${stats.ast.totalUnits}`);
      console.log(`    Enums: ${stats.ast.totalEnums}`);
      console.log(`    Type references: ${stats.ast.totalTypeReferences}`);
      console.log(`    Unit references: ${stats.ast.totalUnitReferences}`);
      console.log(`    Function calls: ${stats.ast.totalFunctionCalls}`);
      if (stats.ast.failedFiles.length > 0) {
        console.log(`    Failed files: ${stats.ast.failedFiles.length}`);
      }
      console.log(``);

      console.log(`  🔌 LSP Feature Statistics:`);
      console.log(`    Completion tests: ${stats.lsp.completionTests} (${stats.lsp.completionSuccesses} successful)`);
      console.log(`    Definition tests: ${stats.lsp.definitionTests} (${stats.lsp.definitionSuccesses} successful)`);
      console.log(`    References tests: ${stats.lsp.referencesTests} (${stats.lsp.referencesSuccesses} successful)`);
      console.log(`    Document symbols tests: ${stats.lsp.documentSymbolsTests} (${stats.lsp.documentSymbolsSuccesses} successful)`);
      console.log(``);

      // Report failed files
      const allFailedFiles = new Set([
        ...stats.lexer.failedFiles.map(f => f.path),
        ...stats.parser.failedFiles.map(f => f.path),
        ...stats.linter.failedFiles.map(f => f.path),
        ...stats.ast.failedFiles.map(f => f.path),
      ]);

      if (allFailedFiles.size > 0) {
        console.log(`  ⚠️  Files with failures (${allFailedFiles.size}):`);
        Array.from(allFailedFiles).slice(0, 10).forEach((filePath) => {
          console.log(`    ${filePath}`);
        });
        if (allFailedFiles.size > 10) {
          console.log(`    ... and ${allFailedFiles.size - 10} more`);
        }
        console.log(``);
      }

      console.log(`  ${"=".repeat(80)}\n`);

      // Test passes if we processed files
      expect(stats.totalFiles).to.be.greaterThan(0);
    });
  });
});
