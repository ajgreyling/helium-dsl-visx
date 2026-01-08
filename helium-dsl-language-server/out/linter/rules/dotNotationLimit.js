"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyDotNotationLimit = applyDotNotationLimit;
const engine_1 = require("../engine");
function applyDotNotationLimit(ctx) {
    if (!ctx.rules["dot-notation-limit"])
        return;
    const lines = ctx.text.split(/\r?\n/);
    lines.forEach((line, idx) => {
        const dotCount = (line.match(/\./g) || []).length;
        if (dotCount > 1) {
            const firstDot = line.indexOf(".");
            (0, engine_1.pushDiagnostic)(ctx, "dot-notation-limit", idx, firstDot, line.length - firstDot, ctx.rules["dot-notation-limit"].message);
        }
    });
}
