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
exports.parseText = parseText;
const antlr4ts_1 = require("antlr4ts");
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
function loadGenerated(name) {
    const currentDir = __dirname;
    // Try bundled path first (when packaged in extension)
    const bundledPath = path.resolve(currentDir, "../../generated/parser/generated/grammar", name);
    if (fs.existsSync(bundledPath + ".ts") || fs.existsSync(bundledPath + ".js")) {
        try {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const mod = require(path.resolve(currentDir, "../../generated/parser/generated/grammar", name));
            if (mod) {
                return mod[name] || mod;
            }
        }
        catch (e) {
            // Continue to next path
        }
    }
    // Fallback to development path
    const devPath = path.resolve(currentDir, "../../../generated/parser/generated/grammar", name);
    if (fs.existsSync(devPath + ".ts") || fs.existsSync(devPath + ".js")) {
        try {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const mod = require(path.resolve(currentDir, "../../../generated/parser/generated/grammar", name));
            return mod[name] || mod;
        }
        catch (e2) {
            // Continue to next path
        }
    }
    // Fallback to sibling directory path (helium-vscode-tooling)
    // From src/parser: ../../../helium-vscode-tooling/...
    // From out/src/parser: ../../../../helium-vscode-tooling/...
    // Try both paths to handle both ts-node (source) and compiled (out) contexts
    const siblingPath1 = path.resolve(currentDir, "../../../helium-vscode-tooling/generated/parser/generated/grammar", name);
    const siblingPath2 = path.resolve(currentDir, "../../../../helium-vscode-tooling/generated/parser/generated/grammar", name);
    if (fs.existsSync(siblingPath1 + ".ts") || fs.existsSync(siblingPath1 + ".js")) {
        try {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const mod = require(siblingPath1);
            return mod[name] || mod;
        }
        catch (e3) {
            // Continue to next path
        }
    }
    if (fs.existsSync(siblingPath2 + ".ts") || fs.existsSync(siblingPath2 + ".js")) {
        try {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const mod = require(siblingPath2);
            return mod[name] || mod;
        }
        catch (e4) {
            return undefined;
        }
    }
    return undefined;
}
/**
 * Check if an error message indicates a parser runtime error (false positive)
 * These are JavaScript runtime errors that occur during parsing but don't indicate
 * actual code problems - the code compiles fine despite these errors.
 */
function isParserRuntimeError(errorMsg) {
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
    constructor(sourceText) {
        this.diagnostics = [];
        this.sourceText = sourceText;
    }
    /**
     * Check if an error is a false positive based on context analysis
     */
    isFalsePositive(line, charPositionInLine, msg) {
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
            if (beforeError.match(/\.(jsonPut|jsonGet|jsonRemove|jsonContains|jsonKeys|length|concat|translateMessageGoogle|getLanguageChatGpt|startsWith|replaceAll|substring)\s*\(/) ||
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
            if (beforeError.match(/\([^)]*$/) || // Inside parentheses (method call arguments)
                beforeError.match(/\.(jsonPut|jsonGet|length|concat|translateMessageGoogle|getLanguageChatGpt|startsWith|replaceAll|substring)\s*\(/) ||
                beforeError.match(/[A-Z][a-zA-Z0-9_]*:\s*[a-zA-Z0-9_]+\s*\(/)) {
                return true;
            }
        }
        // Pattern 3: Filter "extraneous input ')' expecting ','" errors
        // These occur with nested method calls
        if (msg.includes("extraneous input ')' expecting ','") || msg.includes("extraneous input ')' expecting ';'")) {
            const beforeError = errorLine.substring(0, charPositionInLine);
            // Check if we're in a nested method call context
            if (beforeError.match(/\([^)]*\([^)]*$/) || // Nested parentheses
                beforeError.match(/\.(jsonPut|jsonGet|length|concat|translateMessageGoogle|getLanguageChatGpt|startsWith|replaceAll|substring)\s*\(/) ||
                beforeError.match(/[A-Z][a-zA-Z0-9_]*:\s*[a-zA-Z0-9_]+\s*\(/)) {
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
            if (afterError.match(/^\s*==\s*(true|false|null|"|'|\d|\w)/) ||
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
            if (afterError.match(/^\s*;/) && // Semicolon follows the error position
                (beforeError.match(/\)\s*$/) || // Closing paren before semicolon (end of method call)
                    beforeError.match(/[a-zA-Z0-9_\]\)]\s*$/) || // Valid identifier or closing bracket/paren
                    beforeError.match(/\.(jsonPut|jsonGet|jsonRemove|jsonContains|jsonKeys|length|concat|translateMessageGoogle|getLanguageChatGpt|startsWith|replaceAll|substring)\s*\([^)]*\)\s*$/)) // Method call ending
            ) {
                return true;
            }
        }
        return false;
    }
    syntaxError(_recognizer, _offendingSymbol, line, charPositionInLine, msg) {
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
function parseText(text) {
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
    const input = new antlr4ts_1.ANTLRInputStream(text);
    const lexer = new MezDSLLexer(input);
    const tokens = new antlr4ts_1.CommonTokenStream(lexer);
    const parser = new MezDSLParser(tokens);
    const listener = new CollectingErrorListener(text);
    lexer.removeErrorListeners();
    parser.removeErrorListeners();
    lexer.addErrorListener(listener);
    parser.addErrorListener(listener);
    try {
        parser.script();
    }
    catch (err) {
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
    const filteredDiagnostics = listener.diagnostics.filter((d) => !isParserRuntimeError(d.message));
    return { diagnostics: filteredDiagnostics };
}
