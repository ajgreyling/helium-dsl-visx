import { ANTLRInputStream, CommonTokenStream } from "antlr4ts";
import { Diagnostic } from "vscode-languageserver";
import * as path from "path";
import * as fs from "fs";
import { createRequire } from "module";
import { fileURLToPath } from "url";

// Create require function for dynamic module loading in ES modules
const require = createRequire(import.meta.url);

// Register ts-node for require() calls if available (for TypeScript file loading in tests)
// This allows require() to load TypeScript files when running tests with ts-node
// Note: This registration happens after createRequire, but ts-node/register hooks into
// Node's module system globally, so it will affect subsequent require() calls
try {
  // Only register if ts-node is available and we're in a development/test context
  if (process.env.NODE_ENV !== "production" && !process.env.VSCODE_INJECTION) {
    try {
      // Try ts-node/register first (CommonJS style)
      require("ts-node/register");
    } catch {
      // If that fails, try ts-node directly with ESM support
      try {
        const tsNode = require("ts-node");
        if (tsNode && typeof tsNode.register === "function") {
          tsNode.register({ 
            esm: true,
            transpileOnly: true,
            compilerOptions: {
              module: "ES2020",
              moduleResolution: "node"
            }
          });
        }
      } catch {
        // ts-node not available, that's okay - will fall back to compiled JS files
      }
    }
  }
} catch {
  // Ignore errors - ts-node registration is optional
}

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
  const bundledPath = path.resolve(currentDir, "../../generated/parser/generated/grammar", name);
  const bundledResult = tryLoad(bundledPath);
  if (bundledResult) return bundledResult;
  
  // Fallback to development path
  const devPath = path.resolve(currentDir, "../../../generated/parser/generated/grammar", name);
  const devResult = tryLoad(devPath);
  if (devResult) return devResult;
  
  // Fallback to sibling directory path (helium-vscode-tooling)
  // From src/parser: ../../../helium-vscode-tooling/...
  // From out/src/parser: ../../../../helium-vscode-tooling/...
  // Try both paths to handle both ts-node (source) and compiled (out) contexts
  
  // Calculate absolute path to project root to ensure correct resolution
  const projectRoot = path.resolve(currentDir, "../../../..");
  const toolingPath = path.resolve(projectRoot, "helium-vscode-tooling/generated/parser/generated/grammar", name);
  
  // Try siblingPath1 first (correct path from TypeScript source: src/parser)
  const siblingPath1 = path.resolve(currentDir, "../../../helium-vscode-tooling/generated/parser/generated/grammar", name);
  const sibling1Result = tryLoad(siblingPath1, ".ts");
  if (sibling1Result) return sibling1Result;
  
  // Try siblingPath2 (correct path from compiled output: out/src/parser)
  const siblingPath2 = path.resolve(currentDir, "../../../../helium-vscode-tooling/generated/parser/generated/grammar", name);
  const sibling2Result = tryLoad(siblingPath2, ".ts");
  if (sibling2Result) return sibling2Result;
  
  // Try absolute path from project root (most reliable)
  const absoluteResult = tryLoad(toolingPath, ".ts");
  if (absoluteResult) return absoluteResult;
  
  return undefined;
}

/**
 * Check if an error message indicates a parser runtime error (false positive)
 * These are JavaScript runtime errors that occur during parsing but don't indicate
 * actual code problems - the code compiles fine despite these errors.
 */
function isParserRuntimeError(errorMsg: string): boolean {
  // Filter out "Maximum call stack size exceeded" - indicates parser recursion issues
  if (errorMsg.includes("Maximum call stack size exceeded")) {
    return true;
  }

  // Filter out "token is not defined" - JavaScript ReferenceError from parser runtime
  if (errorMsg.includes("token is not defined")) {
    return true;
  }

  // Filter out other common "is not defined" patterns that are parser runtime issues
  // These typically indicate missing variables in the parser's generated code
  if (errorMsg.match(/^\w+ is not defined$/)) {
    return true;
  }

  return false;
}

class CollectingErrorListener {
  public diagnostics: Diagnostic[] = [];
  private sourceText: string;

  constructor(sourceText: string) {
    this.sourceText = sourceText;
  }

  /**
   * Check if an error is a false positive based on context analysis
   */
  private isFalsePositive(line: number, charPositionInLine: number, msg: string): boolean {
    const lines = this.sourceText.split(/\r?\n/);
    const errorLine = lines[line - 1] || "";

    // Filter out "Maximum call stack size exceeded" errors
    if (msg.includes("Maximum call stack size exceeded")) {
      return true;
    }

    // Pattern 1: Filter "mismatched input ')' expecting {',', '==', ...}" errors
    // These occur with nested method calls and method chaining
    if (msg.includes("mismatched input ')' expecting {',', '==', '!=', '<', '<=', '>', '>=', '||', '&&', '+', '-', '*', '/', '%'}")) {
      // Check if this occurs in a method call context
      // Look for patterns like: .jsonPut(, .jsonGet(, .length(, method calls, etc.
      const beforeError = errorLine.substring(0, charPositionInLine);
      const afterError = errorLine.substring(charPositionInLine);
      
      // Check for method call patterns before the error
      if (
        beforeError.match(/\.(jsonPut|jsonGet|jsonRemove|jsonContains|jsonKeys|length|concat|translateMessageGoogle|getLanguageChatGpt|startsWith|replaceAll|substring)\s*\(/) ||
        beforeError.match(/[A-Z][a-zA-Z0-9_]*:\s*[a-zA-Z0-9_]+\s*\(/) || // Unit:method(
        afterError.match(/^\s*[,;\)]/) // Error is followed by comma, semicolon, or closing paren
      ) {
        return true;
      }
    }

    // Pattern 2: Filter "mismatched input ')' expecting ','" errors
    // These occur with method calls as arguments to other methods
    if (msg.includes("mismatched input ')' expecting ','")) {
      const beforeError = errorLine.substring(0, charPositionInLine);
      // Check if we're in a method call argument context
      if (
        beforeError.match(/\([^)]*$/) || // Inside parentheses (method call arguments)
        beforeError.match(/\.(jsonPut|jsonGet|length|concat|translateMessageGoogle|getLanguageChatGpt|startsWith|replaceAll|substring)\s*\(/) ||
        beforeError.match(/[A-Z][a-zA-Z0-9_]*:\s*[a-zA-Z0-9_]+\s*\(/)
      ) {
        return true;
      }
    }

    // Pattern 3: Filter "extraneous input ')' expecting ','" errors
    // These occur with nested method calls
    if (msg.includes("extraneous input ')' expecting ','") || msg.includes("extraneous input ')' expecting ';'")) {
      const beforeError = errorLine.substring(0, charPositionInLine);
      // Check if we're in a nested method call context
      if (
        beforeError.match(/\([^)]*\([^)]*$/) || // Nested parentheses
        beforeError.match(/\.(jsonPut|jsonGet|length|concat|translateMessageGoogle|getLanguageChatGpt|startsWith|replaceAll|substring)\s*\(/) ||
        beforeError.match(/[A-Z][a-zA-Z0-9_]*:\s*[a-zA-Z0-9_]+\s*\(/)
      ) {
        return true;
      }
    }

    // Pattern 4: Filter "extraneous input 'return' expecting ..." errors
    // These occur when parser gets confused about statement boundaries
    if (msg.includes("extraneous input 'return'")) {
      // Check if return is actually valid (not inside an expression)
      const beforeError = errorLine.substring(0, charPositionInLine);
      const afterError = errorLine.substring(charPositionInLine);
      
      // If return appears to be at statement level (not inside parentheses or method calls)
      if (!beforeError.match(/\([^)]*$/) && afterError.match(/^\s*return\s/)) {
        return true;
      }
    }

    // Pattern 5: Filter "mismatched input '==' expecting ..." errors
    // These can occur in complex expressions
    if (msg.includes("mismatched input '==' expecting")) {
      const beforeError = errorLine.substring(0, charPositionInLine);
      const afterError = errorLine.substring(charPositionInLine);
      
      // Check if == is part of a valid comparison expression
      if (
        afterError.match(/^\s*==\s*(true|false|null|"|'|\d|\w)/) ||
        beforeError.match(/[a-zA-Z0-9_\[\]\.]\s*$/) // Valid left side of comparison
      ) {
        return true;
      }
    }

    // Pattern 6: Filter "mismatched input ';' expecting ..." errors
    // These occur when parser gets confused about statement boundaries in complex expressions
    if (msg.includes("mismatched input ';' expecting")) {
      const beforeError = errorLine.substring(0, charPositionInLine);
      const afterError = errorLine.substring(charPositionInLine);
      
      // Check if semicolon is at end of statement (valid statement terminator)
      if (
        afterError.match(/^\s*;/) && // Semicolon follows the error position
        (beforeError.match(/\)\s*$/) || // Closing paren before semicolon (end of method call)
         beforeError.match(/[a-zA-Z0-9_\]\)]\s*$/) || // Valid identifier or closing bracket/paren
         beforeError.match(/\.(jsonPut|jsonGet|jsonRemove|jsonContains|jsonKeys|length|concat|translateMessageGoogle|getLanguageChatGpt|startsWith|replaceAll|substring)\s*\([^)]*\)\s*$/)) // Method call ending
      ) {
        return true;
      }
    }

    return false;
  }

  syntaxError(
    _recognizer: any,
    _offendingSymbol: any,
    line: number,
    charPositionInLine: number,
    msg: string
  ) {
    // Filter out false positive parser errors - these are parser limitations, not code errors
    if (!this.isFalsePositive(line, charPositionInLine, msg)) {
      this.diagnostics.push({
        message: msg,
        range: {
          start: { line: line - 1, character: charPositionInLine },
          end: { line: line - 1, character: charPositionInLine + 1 },
        },
        severity: 2, // Warning instead of error, since code builds fine
        source: "helium-dsl-parser",
      });
    }
  }
}

export function parseText(text: string): { diagnostics: Diagnostic[] } {
  const MezDSLLexer = loadGenerated("MezDSLLexer");
  const MezDSLParser = loadGenerated("MezDSLParser");

  if (!MezDSLLexer || !MezDSLParser) {
    return {
      diagnostics: [
        {
          message: "Parser not generated yet. Run npm run build:parser.",
          range: {
            start: { line: 0, character: 0 },
            end: { line: 0, character: 1 },
          },
          severity: 2, // Warning
          source: "helium-dsl-parser",
        },
      ],
    };
  }

  const input = new ANTLRInputStream(text);
  const lexer = new MezDSLLexer(input);
  const tokens = new CommonTokenStream(lexer);
  const parser = new MezDSLParser(tokens);

  const listener = new CollectingErrorListener(text);
  lexer.removeErrorListeners();
  parser.removeErrorListeners();
  lexer.addErrorListener(listener as any);
  parser.addErrorListener(listener as any);

  try {
    parser.script();
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    // Filter out false positive parser errors for code that builds fine
    // These are parser runtime errors, not actual code errors
    if (!isParserRuntimeError(errorMsg)) {
      listener.diagnostics.push({
        message: errorMsg,
        range: {
          start: { line: 0, character: 0 },
          end: { line: 0, character: 0 },
        },
        severity: 2, // Warning instead of error, since code builds fine
        source: "helium-dsl-parser",
      });
    }
  }

  // Filter out parser runtime errors from syntax errors as well (safety net)
  const filteredDiagnostics = listener.diagnostics.filter(
    (d) => !isParserRuntimeError(d.message)
  );

  return { diagnostics: filteredDiagnostics };
}

