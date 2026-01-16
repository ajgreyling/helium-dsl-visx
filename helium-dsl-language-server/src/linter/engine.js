import { loadRules } from "./ruleLoader.js";
import { applyNoVarInElse } from "./rules/noVarInElse.js";
import { applyForbiddenOperators } from "./rules/forbiddenOperators.js";
export async function runLints(text) {
    // console.warn("[Linter] Loading rules...");
    const rules = await loadRules();
    // console.warn("[Linter] Rules loaded, starting lint checks...");
    const diagnostics = [];
    const ctx = { text, rules, diagnostics };
    // Only apply critical rules that are known to be accurate
    // Disable rules that cause false positives for valid code
    // console.warn("[Linter] Applying no-var-in-else rule...");
    applyNoVarInElse(ctx);
    // console.warn(`[Linter] no-var-in-else complete, found ${diagnostics.length} issues`);
    // applyNamingConventions(ctx); // Disabled - causes false positives
    // console.warn("[Linter] Applying forbidden-operators rule...");
    applyForbiddenOperators(ctx); // Enabled - boolean comparison rule added
    // console.warn(`[Linter] forbidden-operators complete, found ${diagnostics.length} total issues`);
    // applyDotNotationLimit(ctx); // Disabled - causes false positives (flags valid nested attribute access)
    // console.warn(`[Linter] All rules complete, returning ${diagnostics.length} diagnostics`);
    return diagnostics;
}
export function pushDiagnostic(ctx, ruleId, line, character, length, message) {
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
