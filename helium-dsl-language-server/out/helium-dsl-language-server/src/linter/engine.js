"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runLints = runLints;
exports.pushDiagnostic = pushDiagnostic;
const ruleLoader_1 = require("./ruleLoader");
const noVarInElse_1 = require("./rules/noVarInElse");
const namingConventions_1 = require("./rules/namingConventions");
const forbiddenOperators_1 = require("./rules/forbiddenOperators");
const dotNotationLimit_1 = require("./rules/dotNotationLimit");
async function runLints(text) {
    const rules = await (0, ruleLoader_1.loadRules)();
    const diagnostics = [];
    const ctx = { text, rules, diagnostics };
    (0, noVarInElse_1.applyNoVarInElse)(ctx);
    (0, namingConventions_1.applyNamingConventions)(ctx);
    (0, forbiddenOperators_1.applyForbiddenOperators)(ctx);
    (0, dotNotationLimit_1.applyDotNotationLimit)(ctx);
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
