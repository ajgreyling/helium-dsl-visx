"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runLints = runLints;
exports.pushDiagnostic = pushDiagnostic;
const ruleLoader_1 = require("./ruleLoader");
const noVarInElse_1 = require("./rules/noVarInElse");
const forbiddenOperators_1 = require("./rules/forbiddenOperators");
async function runLints(text) {
    console.warn("[Linter] Loading rules...");
    const rules = await (0, ruleLoader_1.loadRules)();
    console.warn("[Linter] Rules loaded, starting lint checks...");
    const diagnostics = [];
    const ctx = { text, rules, diagnostics };
    // Only apply critical rules that are known to be accurate
    // Disable rules that cause false positives for valid code
    console.warn("[Linter] Applying no-var-in-else rule...");
    (0, noVarInElse_1.applyNoVarInElse)(ctx);
    console.warn(`[Linter] no-var-in-else complete, found ${diagnostics.length} issues`);
    // applyNamingConventions(ctx); // Disabled - causes false positives
    console.warn("[Linter] Applying forbidden-operators rule...");
    (0, forbiddenOperators_1.applyForbiddenOperators)(ctx); // Enabled - boolean comparison rule added
    console.warn(`[Linter] forbidden-operators complete, found ${diagnostics.length} total issues`);
    // applyDotNotationLimit(ctx); // Disabled - causes false positives (flags valid nested attribute access)
    console.warn(`[Linter] All rules complete, returning ${diagnostics.length} diagnostics`);
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
