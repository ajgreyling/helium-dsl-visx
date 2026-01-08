"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseText = parseText;
const antlr4ts_1 = require("antlr4ts");
function loadGenerated(name) {
    try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const mod = require(`./${name}`);
        return mod[name] || mod;
    }
    catch (e) {
        return undefined;
    }
}
class CollectingErrorListener {
    constructor() {
        this.diagnostics = [];
    }
    syntaxError(_recognizer, _offendingSymbol, line, charPositionInLine, msg) {
        this.diagnostics.push({
            message: msg,
            range: {
                start: { line: line - 1, character: charPositionInLine },
                end: { line: line - 1, character: charPositionInLine + 1 },
            },
            severity: 1, // Error
            source: "helium-dsl-parser",
        });
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
    const listener = new CollectingErrorListener();
    lexer.removeErrorListeners();
    parser.removeErrorListeners();
    lexer.addErrorListener(listener);
    parser.addErrorListener(listener);
    try {
        parser.script();
    }
    catch (err) {
        listener.diagnostics.push({
            message: err instanceof Error ? err.message : String(err),
            range: {
                start: { line: 0, character: 0 },
                end: { line: 0, character: 0 },
            },
            severity: 1,
            source: "helium-dsl-parser",
        });
    }
    return { diagnostics: listener.diagnostics };
}
