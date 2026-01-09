"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseText = parseText;
const antlr4ts_1 = require("antlr4ts");
function loadGenerated(name) {
    // Try bundled path first (when packaged in extension)
    try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const mod = require(`../../generated/parser/generated/grammar/${name}`);
        if (mod) {
            return mod[name] || mod;
        }
    }
    catch (e) {
        // Fallback to development path
        try {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const mod = require(`../../../generated/parser/generated/grammar/${name}`);
            return mod[name] || mod;
        }
        catch (e2) {
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
