"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyForbiddenOperators = applyForbiddenOperators;
const engine_1 = require("../engine");
function applyForbiddenOperators(ctx) {
    if (!ctx.rules["forbidden-operators"])
        return;
    const lines = ctx.text.split(/\r?\n/);
    lines.forEach((line, idx) => {
        const ops = [
            { regex: /\+=|-=|\*=|\/=|%=/, msg: "Compound assignment is not allowed. Use explicit assignment." },
            { regex: /\?.*:/, msg: "Ternary operator is not allowed. Use if/else." },
            { regex: /!\s*[A-Za-z_][A-Za-z0-9_]*/, msg: "Use '== false' instead of '!var'." },
        ];
        ops.forEach(({ regex, msg }) => {
            const match = regex.exec(line);
            if (match) {
                (0, engine_1.pushDiagnostic)(ctx, "forbidden-operators", idx, match.index ?? 0, match[0].length, msg);
            }
        });
    });
}
