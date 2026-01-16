export function positionFromToken(token) {
    return {
        line: Math.max(0, token.line - 1),
        character: Math.max(0, token.charPositionInLine),
    };
}
export function rangeFromTokens(start, stop) {
    const startPos = positionFromToken(start);
    const length = stop.text ? stop.text.length : 1;
    const endPos = {
        line: Math.max(0, stop.line - 1),
        character: Math.max(0, stop.charPositionInLine + length),
    };
    return { start: startPos, end: endPos };
}
export function rangeFromContext(ctx) {
    const start = ctx.start;
    const stop = ctx.stop ?? ctx.start;
    return rangeFromTokens(start, stop);
}
