import { pushDiagnostic, LintContext } from "../engine";

export function applyForbiddenOperators(ctx: LintContext) {
  if (!ctx.rules["forbidden-operators"]) return;
  const lines = ctx.text.split(/\r?\n/);
  // console.warn(`[ForbiddenOperators] Processing ${lines.length} lines...`);
  
  // Pre-compute string literal positions for each line to avoid repeated scans
  const stringLiteralCache = new Map<number, Set<number>>();
  
  // Track whether we're currently inside a multi-line string block (/% ... %/)
  let inMultiLineBlock = false;
  
  lines.forEach((line, idx) => {
    // Log progress every 100 lines
    // if (idx > 0 && idx % 100 === 0) {
    //   console.warn(`[ForbiddenOperators] Processed ${idx}/${lines.length} lines...`);
    // }
    
    // Skip very long lines to prevent regex catastrophic backtracking
    // Lines over 10KB are likely data/strings, not code patterns
    if (line.length > 10000) {
      // if (idx % 100 === 0) {
      //   console.warn(`[ForbiddenOperators] Skipping very long line ${idx + 1} (${line.length} chars)`);
      // }
      return;
    }
    
    // Skip lines that are in comments
    const trimmed = line.trim();
    if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*/')) {
      return;
    }
    
    // Handle multi-line string block markers (/% ... %/)
    const hasStartMarker = line.includes('/%');
    const hasEndMarker = line.includes('%/');
    
    // If we're inside a multi-line block, skip processing (but check for end marker)
    if (inMultiLineBlock) {
      if (hasEndMarker) {
        inMultiLineBlock = false;
      }
      return;
    }
    
    // If we encounter a start marker, enter multi-line block state and skip processing
    if (hasStartMarker) {
      // If both markers are on the same line, don't enter block state
      if (!hasEndMarker) {
        inMultiLineBlock = true;
      }
      return;
    }
    
    // Pre-compute string literal positions for this line (cache to avoid repeated scans)
    let stringLiteralPositions: Set<number>;
    if (stringLiteralCache.has(idx)) {
      stringLiteralPositions = stringLiteralCache.get(idx)!;
    } else {
      stringLiteralPositions = new Set<number>();
      let inDouble = false;
      let inSingle = false;
      let inBlock = false;
      let escapeNext = false;
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (escapeNext) {
          escapeNext = false;
          continue;
        }
        if (char === '\\') {
          escapeNext = true;
          continue;
        }
        if (line.substring(i, i + 2) === '/%') {
          inBlock = true;
          i++;
          continue;
        }
        if (line.substring(i, i + 2) === '%/') {
          inBlock = false;
          i++;
          continue;
        }
        if (!inBlock) {
          if (char === '"' && !inSingle) {
            inDouble = !inDouble;
            if (inDouble) stringLiteralPositions.add(i);
          }
          if (char === "'" && !inDouble) {
            inSingle = !inSingle;
            if (inSingle) stringLiteralPositions.add(i);
          }
        }
        if (inDouble || inSingle || inBlock) {
          stringLiteralPositions.add(i);
        }
      }
      stringLiteralCache.set(idx, stringLiteralPositions);
    }
    
    // Check if position is in a string literal
    const inStringLiteral = (pos: number): boolean => {
      return stringLiteralPositions.has(pos);
    };
    
    // Check for boolean variables in if conditions without explicit comparison
    // Pattern: if (variableName) - matches only simple identifiers, not function calls or comparisons
    // The regex pattern itself excludes function calls (no () after identifier) and comparisons (no ==/!=)
    const ifBooleanPattern = /\bif\s*\(\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*\)/g;
    let ifMatch: RegExpExecArray | null;
    let ifMatchCount = 0;
    while ((ifMatch = ifBooleanPattern.exec(line)) !== null) {
      ifMatchCount++;
      // Safety: prevent infinite loops
      if (ifMatchCount > 100) {
        // console.warn(`[ForbiddenOperators] Breaking if-pattern loop on line ${idx + 1} after ${ifMatchCount} matches`);
        break;
      }
      if (inStringLiteral(ifMatch.index!)) {
        continue;
      }
      
      // Double-check: ensure there's no comparison operator in the condition
      // (the regex should already exclude this, but this is a safety check)
      const conditionContent = ifMatch[0].substring(
        ifMatch[0].indexOf('(') + 1,
        ifMatch[0].lastIndexOf(')')
      );
      if (/==|!=/.test(conditionContent.trim())) {
        continue;
      }
      
      // This is a boolean variable without explicit comparison
      pushDiagnostic(
        ctx,
        "forbidden-operators",
        idx,
        ifMatch.index!,
        ifMatch[0].length,
        "Boolean variables in if conditions must use explicit comparison. Use '== true' or '== false'."
      );
      // Prevent infinite loop on zero-length matches
      if (ifMatch[0].length === 0) {
        ifBooleanPattern.lastIndex++;
      }
    }
    
    const ops = [
      { 
        regex: /\+=|-=|\*=|\/=|%=/, 
        msg: "Compound assignment is not allowed. Use explicit assignment.",
        checkString: false
      },
      { 
        // Ternary operator: condition ? value1 : value2
        // Must be outside string literals and not part of SQL/regex
        // Limit [^:]* to max 500 chars to prevent catastrophic backtracking
        regex: /\b[A-Za-z_][A-Za-z0-9_]*\s*\?\s*[^:]{0,500}\s*:/,
        msg: "Ternary operator is not allowed. Use if/else.",
        checkString: true
      },
      { 
        regex: /!\s*[A-Za-z_][A-Za-z0-9_]*/, 
        msg: "Use '== false' instead of '!var'.",
        checkString: true
      },
    ];
    
    ops.forEach(({ regex, msg, checkString }, opIdx) => {
      let match: RegExpExecArray | null;
      let matchCount = 0;
      while ((match = regex.exec(line)) !== null) {
        matchCount++;
        // Safety: prevent infinite loops
        if (matchCount > 100) {
          // console.warn(`[ForbiddenOperators] Breaking regex loop on line ${idx + 1}, op ${opIdx} after ${matchCount} matches`);
          break;
        }
        if (checkString && inStringLiteral(match.index!)) {
          continue;
        }
        pushDiagnostic(ctx, "forbidden-operators", idx, match.index!, match[0].length, msg);
        // Prevent infinite loop on zero-length matches
        if (match[0].length === 0) {
          regex.lastIndex++;
          // Additional safety: if still zero length after increment, break
          if (regex.lastIndex === match.index) {
            // console.warn(`[ForbiddenOperators] Breaking zero-length match loop on line ${idx + 1}`);
            break;
          }
        }
      }
    });
  });
}

