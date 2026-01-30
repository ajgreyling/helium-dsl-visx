import { ParseTreeWalker } from "antlr4ts/tree/ParseTreeWalker.js";
import { ParserRuleContext } from "antlr4ts/ParserRuleContext.js";
import { rangeFromContext } from "../ast/span.js";

export type DotNotationDiagnostic = {
  line: number;
  character: number;
  length: number;
};

/**
 * Shared listener for detecting dot notation violations.
 * Detects chains with more than one dot (e.g., a.b.c is invalid, a.b is valid).
 * For unit-qualified access (Unit:obj.attr), only the part after the colon is checked.
 */
class DotNotationLimitListener {
  private diagnostics: DotNotationDiagnostic[] = [];
  // Track access expressions that might be part of a longer chain (e.g., a.b in a.b.c)
  private recentAccessExpressions: Map<number, { ids: number; range: any; hasColon: boolean }> = new Map();
  // Track member attributes that follow single-ID access expressions (e.g., a.b where a is 1 ID + .b is memberAttribute)
  private recentMemberChains: Map<number, { ids: number; range: any; hasColon: boolean }> = new Map();

  enterEveryRule(ctx: ParserRuleContext) {
    // Required by ParseTreeListener interface - no-op
  }

  exitEveryRule(ctx: ParserRuleContext) {
    // Required by ParseTreeListener interface - no-op
  }

  enterMemberAttribute(ctx: any) {
    const nameToken = ctx?.ID ? ctx.ID() : null;
    if (!nameToken) return;
    
    const range = rangeFromContext(ctx);
    
    // Check if this member attribute follows an access expression on the same line
    // This handles cases like "a.b.c" where "a.b" is an accessExpression and ".c" is a memberAttribute
    // IMPORTANT: Only match if the memberAttribute immediately follows the accessExpression
    // (character position should be close - within 5 chars to account for dot and whitespace)
    const line = range.start.line;
    const attrStartChar = range.start.character;
    const recentExpr = this.recentAccessExpressions.get(line);
    
    // Check both stored accessExpressions and stored member chains
    const recentChain = this.recentMemberChains.get(line);
    
    if (recentExpr && !recentExpr.hasColon) {
      // Calculate the expected end position of the access expression
      const exprEndChar = recentExpr.range.end.character;
      // The memberAttribute should start very close to where the accessExpression ended
      // (allowing for the dot "." and maybe 1-2 spaces)
      // CRITICAL: The memberAttribute must start IMMEDIATELY after the expression (within 2 chars)
      // to avoid false positives when expressions are separated by operators like "="
      const charDistance = attrStartChar - exprEndChar;
      
      // Only proceed if the memberAttribute is immediately adjacent to the accessExpression
      // (starts within 2 chars of where the expression ended - just the dot and maybe 1 space)
      // This prevents false positives when expressions are separated by operators like "=", "+", etc.
      if (charDistance >= 0 && charDistance <= 2) {
        // This member attribute follows a non-unit-qualified access expression
        // Total IDs = recentExpr.ids + 1 (this attribute)
        const totalIds = recentExpr.ids + 1;
        
        if (totalIds >= 3) {
          // Flag the entire chain - use the range from the start of the access expression
          const fullRange = {
            start: recentExpr.range.start,
            end: range.end
          };
          const length = fullRange.end.character - fullRange.start.character;
          
          this.diagnostics.push({
            line: fullRange.start.line,
            character: fullRange.start.character,
            length: length,
          });
        } else if (totalIds === 2 && recentExpr.ids === 1) {
          // Store this as a member chain: single-ID accessExpression + memberAttribute = 2 IDs total
          // This handles cases like "a.b" where "a" is 1 ID and ".b" is a memberAttribute
          // If another memberAttribute follows, we'll catch it as a 3-ID chain
          this.recentMemberChains.set(line, {
            ids: totalIds,
            range: {
              start: recentExpr.range.start,
              end: range.end
            },
            hasColon: false
          });
        }
        // Clear the recent expression after checking (whether we flagged or not)
        this.recentAccessExpressions.delete(line);
      }
    } else if (recentChain && !recentChain.hasColon) {
      // Check if this memberAttribute follows a stored member chain (e.g., "a.b" + ".c" = "a.b.c")
      const chainEndChar = recentChain.range.end.character;
      const charDistance = attrStartChar - chainEndChar;
      
      // Use the same strict adjacency check (<= 2 chars) to prevent false positives
      if (charDistance >= 0 && charDistance <= 2) {
        // This memberAttribute follows a stored member chain
        // Total IDs = recentChain.ids + 1 (this attribute)
        const totalIds = recentChain.ids + 1;
        
        if (totalIds >= 3) {
          // Flag the entire chain - use the range from the start of the chain
          const fullRange = {
            start: recentChain.range.start,
            end: range.end
          };
          const length = fullRange.end.character - fullRange.start.character;
          
          this.diagnostics.push({
            line: fullRange.start.line,
            character: fullRange.start.character,
            length: length,
          });
        }
        // Clear the stored chain after checking
        this.recentMemberChains.delete(line);
      }
    }
  }

  enterAccessExpression(ctx: any) {
    const range = rangeFromContext(ctx);

    // Get all ID tokens in this access expression
    const ids = ctx?.ID ? ctx.ID() : [];
    if (!ids || ids.length === 0) return;

    // Check if it's unit-qualified (has ':' separator)
    // Unit-qualified access like "UnitName:obj.attr" should only check the dot-separated part
    // Check both getText() and direct text property, and also check token types
    let hasColon = false;
    if (Array.isArray(ctx.children)) {
      for (const c of ctx.children) {
        if (!c) continue;
        // Try getText() method
        if (typeof c?.getText === "function") {
          const text = c.getText();
          if (text === ":") {
            hasColon = true;
            break;
          }
        }
        // Try direct text property
        if (c.text === ":") {
          hasColon = true;
          break;
        }
        // Try checking if it's a colon token (token type might be different)
        if (c.symbol && c.symbol.text === ":") {
          hasColon = true;
          break;
        }
      }
    }

    if (hasColon) {
      // For unit-qualified access, only count IDs after the colon
      // Example: "UnitName:obj.attr" -> IDs: ["UnitName", "obj", "attr"] = 2 IDs after colon, 1 dot (valid)
      // Example: "UnitName:obj.attr.nested" -> IDs: ["UnitName", "obj", "attr", "nested"] = 3 IDs after colon, 2 dots (invalid)
      // The first ID is the unit name, so IDs after colon = ids.length - 1
      const idsAfterColon = ids.length - 1;
      // Only flag if there are 3+ IDs after the colon (2+ dots = more than one level deep)
      if (idsAfterColon < 3) return;
    } else {
      // For non-unit-qualified access, flag if 3+ IDs (2+ dots = more than one level deep)
      // Example: "obj.attr" -> 2 IDs, 1 dot (valid)
      // Example: "obj.attr.nested" -> 3 IDs, 2 dots (invalid)
      if (ids.length < 3) {
        // Store this access expression in case it's followed by a member attribute (e.g., "a.b" in "a.b.c")
        // Store if it has 1 or 2 IDs (to handle both "a.b.c" and "a.b" patterns)
        if (ids.length === 1 || ids.length === 2) {
          // Clear any stored member chains for this line, as a new accessExpression indicates
          // we're starting a new expression (possibly separated by operators like =, +, etc.)
          this.recentMemberChains.delete(range.start.line);
          
          this.recentAccessExpressions.set(range.start.line, {
            ids: ids.length,
            range: range,
            hasColon: false
          });
        }
        return;
      }
    }

    // Clear any stored access expression or member chain for this line since we're flagging this one directly
    this.recentAccessExpressions.delete(range.start.line);
    this.recentMemberChains.delete(range.start.line);
    
    // Calculate the length of the access expression
    // If on the same line, calculate from character positions; otherwise use the full range
    let length: number;
    if (range.start.line === range.end.line) {
      length = range.end.character - range.start.character;
    } else {
      // Multi-line expression - use the text length from the context
      const text = ctx.getText ? ctx.getText() : "";
      length = text.length;
    }

    this.diagnostics.push({
      line: range.start.line,
      character: range.start.character,
      length: length,
    });
  }

  getDiagnostics(): DotNotationDiagnostic[] {
    return this.diagnostics;
  }
}

/**
 * Check a parse tree for dot notation violations.
 * Returns an array of diagnostics indicating where dot notation exceeds one level deep.
 * 
 * @param tree - The parse tree root (from parser.script())
 * @returns Array of diagnostics with line, character, and length
 */
export function checkDotNotation(tree: any): DotNotationDiagnostic[] {
  const listener = new DotNotationLimitListener();
  const walker = new ParseTreeWalker();
  
  try {
    walker.walk(listener, tree);
  } catch (walkErr) {
    // If walking fails (stack overflow, etc.), return empty diagnostics
    if (walkErr instanceof Error && walkErr.message.includes('Maximum call stack')) {
      return [];
    }
    return [];
  }

  return listener.getDiagnostics();
}
