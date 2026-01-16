import { ParserRuleContext } from "antlr4ts/ParserRuleContext.js";
import { Token } from "antlr4ts/Token.js";

export type Position = {
  line: number;
  character: number;
};

export type SourceRange = {
  start: Position;
  end: Position;
};

export function positionFromToken(token: Token): Position {
  return {
    line: Math.max(0, token.line - 1),
    character: Math.max(0, token.charPositionInLine),
  };
}

export function rangeFromTokens(start: Token, stop: Token): SourceRange {
  const startPos = positionFromToken(start);
  const length = stop.text ? stop.text.length : 1;
  const endPos = {
    line: Math.max(0, stop.line - 1),
    character: Math.max(0, stop.charPositionInLine + length),
  };
  return { start: startPos, end: endPos };
}

export function rangeFromContext(ctx: ParserRuleContext): SourceRange {
  const start = ctx.start;
  const stop = ctx.stop ?? ctx.start;
  return rangeFromTokens(start, stop);
}
