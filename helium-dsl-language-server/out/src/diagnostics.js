"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDiagnostics = createDiagnostics;
const parser_1 = require("./parser");
function createDiagnostics(text) {
    const { diagnostics } = (0, parser_1.parseText)(text);
    return diagnostics;
}
