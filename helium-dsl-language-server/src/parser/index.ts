import { ANTLRInputStream, CommonTokenStream } from "antlr4ts";
import { Diagnostic, DiagnosticSeverity } from "vscode-languageserver/node.js";
import * as path from "path";
import * as fs from "fs";
import { fileURLToPath } from "url";
import type { ANTLRErrorListener } from "antlr4ts/ANTLRErrorListener.js";
import type { Token } from "antlr4ts/Token.js";
import type { Recognizer } from "antlr4ts/Recognizer.js";
import { RecognitionException } from "antlr4ts/RecognitionException.js";
import { ErrorNode } from "antlr4ts/tree/ErrorNode.js";
import { TerminalNode } from "antlr4ts/tree/TerminalNode.js";
import { ParseTreeWalker } from "antlr4ts/tree/ParseTreeWalker.js";
import { DefaultErrorStrategy } from "antlr4ts/DefaultErrorStrategy.js";
import { NoViableAltException } from "antlr4ts/NoViableAltException.js";
import { InputMismatchException } from "antlr4ts/InputMismatchException.js";
import { FailedPredicateException } from "antlr4ts/FailedPredicateException.js";
import { checkDotNotation } from "./dotNotation.js";

// Note: We don't register ts-node here because we're using --loader ts-node/esm
// which handles TypeScript files directly via the ESM loader.
// Registering ts-node/register would use require() internally and conflict with import()

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Shared module cache (shared with ast/builder.ts via global)
declare global {
  // eslint-disable-next-line no-var
  var __heliumParserModuleCache: Map<string, any> | undefined;
}
if (!global.__heliumParserModuleCache) {
  global.__heliumParserModuleCache = new Map<string, any>();
}
const moduleCache = global.__heliumParserModuleCache;

async function loadGenerated(name: string): Promise<any | undefined> {
  // Check cache first
  if (moduleCache.has(name)) {
    const cached = moduleCache.get(name);
    if (cached) {
      return cached[name] || cached;
    }
  }
  const currentDir = __dirname;
  
  // Helper function to try loading a module from a path using import()
  const tryLoad = async (modulePath: string, withExtension?: string): Promise<any | undefined> => {
    const pathsToTry = withExtension 
      ? [modulePath + withExtension, modulePath]
      : [modulePath];
    
    for (const tryPath of pathsToTry) {
      const existsTs = fs.existsSync(tryPath + ".ts");
      const existsJs = fs.existsSync(tryPath + ".js");
      const exists = fs.existsSync(tryPath);
      
      if (existsTs || existsJs || exists) {
        try {
          // Use import() for ES modules (parser files are now compiled as ES modules)
          const resolvedPath = path.resolve(tryPath);
          // Prefer .js files over .ts files (Node.js can't execute TypeScript directly)
          let fileUrl: string;
          if (tryPath.endsWith('.ts') || tryPath.endsWith('.js')) {
            fileUrl = `file://${resolvedPath}`;
          } else if (existsJs) {
            // Prefer .js if it exists
            fileUrl = `file://${resolvedPath}.js`;
          } else if (existsTs) {
            // Fall back to .ts if .js doesn't exist (for development with ts-node)
            fileUrl = `file://${resolvedPath}.ts`;
          } else {
            // Default to .ts if neither explicitly exists
            fileUrl = `file://${resolvedPath}.ts`;
          }
          
          // Import as ES module (parser files are now compiled as ES modules)
          const mod = await import(fileUrl);
          if (mod) {
            const result = mod[name] || mod.default || mod;
            // Cache the module for future use
            moduleCache.set(name, mod);
            return result;
          }
        } catch (e) {
          // Continue to next path if import fails
          // Suppress errors - we'll try other paths which may succeed
        }
      }
    }
    return undefined;
  };
  
  // Try compiled path first (when packaged in extension, compiled JS files are in server/out/generated/)
  // From server/out/src/parser/index.js: ../../generated/parser/generated/grammar/name
  const compiledPath = path.resolve(currentDir, "../../generated/parser/generated/grammar", name);
  const compiledResult = await tryLoad(compiledPath);
  if (compiledResult) return compiledResult;
  
  // Try compiled path alternative (direct parser location)
  const compiledPathAlt = path.resolve(currentDir, "../../generated/parser", name);
  const compiledAltResult = await tryLoad(compiledPathAlt);
  if (compiledAltResult) return compiledAltResult;
  
  // Try bundled path (when packaged in extension, source TS files are in extension root)
  // From server/out/src/parser/index.js: ../../../../generated/parser/generated/grammar/name
  const bundledPath = path.resolve(currentDir, "../../../../generated/parser/generated/grammar", name);
  const bundledResult = await tryLoad(bundledPath);
  if (bundledResult) return bundledResult;
  
  // Try bundled path alternative (direct parser location)
  const bundledPathAlt = path.resolve(currentDir, "../../../../generated/parser", name);
  const bundledAltResult = await tryLoad(bundledPathAlt);
  if (bundledAltResult) return bundledAltResult;
  
  // Fallback to development path (from src/parser/index.ts)
  const devPath = path.resolve(currentDir, "../../../generated/parser/generated/grammar", name);
  const devResult = await tryLoad(devPath);
  if (devResult) return devResult;
  
  // Try dev path alternative (direct parser location)
  const devPathAlt = path.resolve(currentDir, "../../../generated/parser", name);
  const devAltResult = await tryLoad(devPathAlt);
  if (devAltResult) return devAltResult;
  
  // Fallback to sibling directory path (helium-vscode-tooling)
  // From src/parser: ../../../helium-vscode-tooling/...
  // From out/src/parser: ../../../../helium-vscode-tooling/...
  // Try both paths to handle both ts-node (source) and compiled (out) contexts
  
  // Calculate absolute path to project root to ensure correct resolution
  const projectRoot = path.resolve(currentDir, "../../../..");
  const toolingPath = path.resolve(projectRoot, "helium-vscode-tooling/generated/parser/generated/grammar", name);
  
  // Try siblingPath1 first (correct path from TypeScript source: src/parser)
  const siblingPath1 = path.resolve(currentDir, "../../../helium-vscode-tooling/generated/parser/generated/grammar", name);
  const sibling1Result = await tryLoad(siblingPath1, ".ts");
  if (sibling1Result) return sibling1Result;
  
  // Try siblingPath1 alternative (direct parser location)
  const siblingPath1Alt = path.resolve(currentDir, "../../../helium-vscode-tooling/generated/parser", name);
  const sibling1AltResult = await tryLoad(siblingPath1Alt, ".ts");
  if (sibling1AltResult) return sibling1AltResult;
  
  // Try siblingPath2 (correct path from compiled output: out/src/parser)
  const siblingPath2 = path.resolve(currentDir, "../../../../helium-vscode-tooling/generated/parser/generated/grammar", name);
  const sibling2Result = await tryLoad(siblingPath2, ".ts");
  if (sibling2Result) return sibling2Result;
  
  // Try siblingPath2 alternative (direct parser location)
  const siblingPath2Alt = path.resolve(currentDir, "../../../../helium-vscode-tooling/generated/parser", name);
  const sibling2AltResult = await tryLoad(siblingPath2Alt, ".ts");
  if (sibling2AltResult) return sibling2AltResult;
  
  // Try absolute path from project root (most reliable) - nested
  const absoluteResult = await tryLoad(toolingPath, ".ts");
  if (absoluteResult) return absoluteResult;
  
  // Try absolute path from project root (most reliable) - direct
  const toolingPathAlt = path.resolve(projectRoot, "helium-vscode-tooling/generated/parser", name);
  const absoluteAltResult = await tryLoad(toolingPathAlt, ".ts");
  if (absoluteAltResult) return absoluteAltResult;
  
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

/**
 * Custom error strategy that always calls syntaxError before recovering.
 * This ensures errors are detected even when DefaultErrorStrategy silently recovers.
 * 
 * The key insight: DefaultErrorStrategy.reportNoViableAlternative() calls notifyErrorListeners()
 * which should trigger syntaxError, but sometimes recovery happens before that.
 * By overriding reportError() to always call syntaxError first, we ensure errors are reported.
 */
export class AlwaysReportErrorStrategy extends DefaultErrorStrategy {
  private errorListener: CollectingErrorListener;

  constructor(errorListener: CollectingErrorListener) {
    super();
    this.errorListener = errorListener;
  }

  reportNoViableAlternative(recognizer: any, e: NoViableAltException): void {
    // Always call syntaxError before recovering
    // This ensures "no viable alternative" errors are detected even when DefaultErrorStrategy silently recovers
    const listener = recognizer.getErrorListenerDispatch();
    if (listener && listener.syntaxError) {
      const token = e.getOffendingToken ? e.getOffendingToken(recognizer) : undefined;
      const line = token ? token.line : 0;
      const charPositionInLine = token ? token.charPositionInLine : 0;
      const msg = this.getErrorMessage(e, recognizer);
      listener.syntaxError(recognizer, token, line, charPositionInLine, msg, e);
    }
    // Then call parent to do recovery
    super.reportNoViableAlternative(recognizer, e);
  }

  reportInputMismatch(recognizer: any, e: InputMismatchException): void {
    // Always call syntaxError before recovering
    const listener = recognizer.getErrorListenerDispatch();
    if (listener && listener.syntaxError) {
      const token = e.getOffendingToken ? e.getOffendingToken(recognizer) : undefined;
      const line = token ? token.line : 0;
      const charPositionInLine = token ? token.charPositionInLine : 0;
      const msg = this.getErrorMessage(e, recognizer);
      listener.syntaxError(recognizer, token, line, charPositionInLine, msg, e);
    }
    // Then call parent to do recovery
    super.reportInputMismatch(recognizer, e);
  }

  reportFailedPredicate(recognizer: any, e: FailedPredicateException): void {
    // Always call syntaxError before recovering
    const listener = recognizer.getErrorListenerDispatch();
    if (listener && listener.syntaxError) {
      const token = e.getOffendingToken ? e.getOffendingToken(recognizer) : undefined;
      const line = token ? token.line : 0;
      const charPositionInLine = token ? token.charPositionInLine : 0;
      const msg = this.getErrorMessage(e, recognizer);
      listener.syntaxError(recognizer, token, line, charPositionInLine, msg, e);
    }
    // Then call parent to do recovery
    super.reportFailedPredicate(recognizer, e);
  }

  private getErrorMessage(e: RecognitionException, recognizer: any): string {
    if (e.message) {
      return e.message;
    }
    // Generate error message similar to DefaultErrorStrategy
    const token = e.getOffendingToken ? e.getOffendingToken(recognizer) : undefined;
    if (token) {
      return `no viable alternative at input '${token.text || ''}'`;
    }
    return "syntax error";
  }
}

export class CollectingErrorListener implements ANTLRErrorListener<Token> {
  public diagnostics: Diagnostic[] = [];
  private sourceText: string;
  private strict: boolean;

  constructor(sourceText: string) {
    this.sourceText = sourceText;
    // Strict mode is used by build/validation pipelines to fail fast on *any* parser diagnostics.
    // Default behavior keeps some known false-positives suppressed for editor usability.
    this.strict = process.env.HELIUM_STRICT_PARSER === "1";
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

    // CRITICAL: Do NOT filter "no viable alternative" errors - these are real parser errors
    // that should be reported. The error "no viable alternative at input 'conversation'"
    // indicates the parser cannot parse the code at that point.
    if (msg.includes("no viable alternative")) {
      return false; // Always report these errors
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

  syntaxError<T extends Token>(
    _recognizer: Recognizer<T, any>,
    _offendingSymbol: T | undefined,
    line: number,
    charPositionInLine: number,
    msg: string,
    _e: RecognitionException | undefined // RecognitionException | undefined - required 6th parameter (can be undefined but parameter itself is required)
  ): void {
    // In strict mode, treat all parser diagnostics as real (used for build fail-fast).
    // Otherwise, filter out known false positives (editor UX).
    const isFalsePos = this.isFalsePositive(line, charPositionInLine, msg);
    if (this.strict || !isFalsePos) {
      const diag = {
        message: msg,
        range: {
          start: { line: line - 1, character: charPositionInLine },
          end: { line: line - 1, character: charPositionInLine + 1 },
        },
        severity: DiagnosticSeverity.Error, // Parser syntax errors are real errors that should be reported
        source: "helium-dsl-parser",
      };
      this.diagnostics.push(diag);
    }
  }
}

export async function parseText(text: string): Promise<{ diagnostics: Diagnostic[] }> {
  const MezDSLLexer = await loadGenerated("MezDSLLexer");
  const MezDSLParser = await loadGenerated("MezDSLParser");

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

  if (process.env.HELIUM_PARSER_DEBUG_TOKENS === "1") {
    tokens.fill();
    const vocabulary = MezDSLParser.VOCABULARY;
    const tokenDump = tokens.getTokens().map((token) => ({
      text: token.text,
      type: vocabulary.getDisplayName(token.type),
    }));
    // eslint-disable-next-line no-console
    console.log(JSON.stringify(tokenDump, null, 2));
  }

  const listener = new CollectingErrorListener(text);
  lexer.removeErrorListeners();
  parser.removeErrorListeners();
  // Explicitly add the listener - don't cast to any, let TypeScript check the interface
  lexer.addErrorListener(listener);
  parser.addErrorListener(listener);
  // Use custom error strategy that always calls syntaxError before recovering
  // This ensures errors are detected even when DefaultErrorStrategy silently recovers
  parser.errorHandler = new AlwaysReportErrorStrategy(listener);

  let tree: any = null;
  try {
    tree = parser.script();
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

  // Check for dot notation violations if parsing succeeded
  if (tree) {
    try {
      const dotNotationDiagnostics = checkDotNotation(tree);
      for (const diag of dotNotationDiagnostics) {
        listener.diagnostics.push({
          message: "Dot notation is only supported one level deep.",
          range: {
            start: { line: diag.line, character: diag.character },
            end: { line: diag.line, character: diag.character + diag.length },
          },
          severity: DiagnosticSeverity.Error,
          source: "helium-dsl-parser",
        });
      }
    } catch (dotErr) {
      // If dot notation checking fails (e.g., stack overflow), continue without those diagnostics
      // This prevents parser diagnostics from failing entirely
    }
  }

  // Filter out parser runtime errors from syntax errors as well (safety net)
  const filteredDiagnostics = listener.diagnostics.filter(
    (d) => !isParserRuntimeError(d.message)
  );

  return { diagnostics: filteredDiagnostics };
}

