"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runLints = runLints;
exports.pushDiagnostic = pushDiagnostic;
const ruleLoader_1 = require("./ruleLoader");
const noVarInElse_1 = require("./rules/noVarInElse");
async function runLints(text) {
    const rules = await (0, ruleLoader_1.loadRules)();
    const diagnostics = [];
    const ctx = { text, rules, diagnostics };
    // Only apply critical rules that are known to be accurate
    // Disable rules that cause false positives for valid code
    (0, noVarInElse_1.applyNoVarInElse)(ctx);
    // applyNamingConventions(ctx); // Disabled - causes false positives
    // applyForbiddenOperators(ctx); // Disabled - causes false positives (flags SQL queries, regex patterns)
    // applyDotNotationLimit(ctx); // Disabled - causes false positives (flags valid nested attribute access)
    return diagnostics;
}
function pushDiagnostic(ctx, ruleId, line, character, length, message) {
    const rule = ctx.rules[ruleId];
    const severity = rule?.severity === "warning" ? 2 : rule?.severity === "info" ? 3 : 1;
    ctx.diagnostics.push({
        message: message || rule?.message || ruleId,
        severity,
        source: "helium-dsl-linter",
        range: {
            start: { line, character },
            end: { line, character: character + length },
        },
        code: ruleId,
    });
}
