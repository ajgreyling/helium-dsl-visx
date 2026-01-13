// Lightweight heuristic-based symbol extraction until full AST integration.
export function buildSymbolTable(text) {
    const symbols = [];
    const lines = text.split(/\r?\n/);
    lines.forEach((line, idx) => {
        const unitMatch = line.match(/\bunit\s+([A-Za-z_][A-Za-z0-9_]*)/);
        if (unitMatch) {
            symbols.push({ name: unitMatch[1], kind: "unit", location: { line: idx, character: unitMatch.index ?? 0 } });
        }
        // Match object definitions (persistent or non-persistent)
        const persistentObjectMatch = line.match(/(?:@\w+\s+)*persistent\s+object\s+([A-Za-z_][A-Za-z0-9_]*)/);
        if (persistentObjectMatch) {
            symbols.push({
                name: persistentObjectMatch[1],
                kind: "object",
                location: { line: idx, character: persistentObjectMatch.index ?? 0 }
            });
        }
        // Match non-persistent object definitions (only if not already matched as persistent)
        const objectMatch = line.match(/(?:@\w+\s+)*object\s+([A-Za-z_][A-Za-z0-9_]*)/);
        if (objectMatch && !persistentObjectMatch) {
            symbols.push({
                name: objectMatch[1],
                kind: "object",
                location: { line: idx, character: objectMatch.index ?? 0 }
            });
        }
        const funcMatch = line.match(/\b(?:int|void|bool|string|decimal|uuid|json|jsonarray|date|datetime|bigint|blob|[A-Za-z_][A-Za-z0-9_]*)\s+([a-z][A-Za-z0-9_]*)\s*\(/);
        if (funcMatch) {
            symbols.push({ name: funcMatch[1], kind: "function", location: { line: idx, character: funcMatch.index ?? 0 } });
            // Extract function parameters from the function signature
            // Find the opening parenthesis and extract parameters until closing parenthesis
            const openParenIndex = line.indexOf('(', funcMatch.index ?? 0);
            if (openParenIndex !== -1) {
                // Find the closing parenthesis (handle nested parentheses)
                let parenDepth = 0;
                let closeParenIndex = -1;
                for (let i = openParenIndex; i < line.length; i++) {
                    if (line[i] === '(')
                        parenDepth++;
                    if (line[i] === ')') {
                        parenDepth--;
                        if (parenDepth === 0) {
                            closeParenIndex = i;
                            break;
                        }
                    }
                }
                if (closeParenIndex !== -1) {
                    // Extract parameter list
                    const paramList = line.substring(openParenIndex + 1, closeParenIndex).trim();
                    if (paramList.length > 0) {
                        // Split parameters by comma, but handle nested generics/arrays
                        const params = [];
                        let currentParam = '';
                        let depth = 0;
                        for (let i = 0; i < paramList.length; i++) {
                            const char = paramList[i];
                            if (char === '<' || char === '[')
                                depth++;
                            else if (char === '>' || char === ']')
                                depth--;
                            else if (char === ',' && depth === 0) {
                                params.push(currentParam.trim());
                                currentParam = '';
                                continue;
                            }
                            currentParam += char;
                        }
                        if (currentParam.trim().length > 0) {
                            params.push(currentParam.trim());
                        }
                        // Extract variable names from each parameter
                        // Pattern: type variableName or type[] variableName
                        params.forEach(param => {
                            const trimmedParam = param.trim();
                            // Match: type variableName (variable names start with lowercase)
                            // Pattern matches: <type> <name> or <type>[] <name>
                            // Extract both type and variable name
                            const paramMatch = trimmedParam.match(/\b((?:int|bool|string|decimal|uuid|json|jsonarray|date|datetime|bigint|blob|[A-Za-z_][A-Za-z0-9_]*(?:\[\])?))\s+([a-z][A-Za-z0-9_]*)\s*$/);
                            if (paramMatch && paramMatch[2]) {
                                const paramName = paramMatch[2];
                                const paramType = paramMatch[1];
                                // Find the position of the parameter name in the original line
                                const paramNameIndex = line.indexOf(paramName, openParenIndex);
                                if (paramNameIndex !== -1) {
                                    symbols.push({
                                        name: paramName,
                                        kind: "variable",
                                        type: paramType,
                                        location: { line: idx, character: paramNameIndex }
                                    });
                                }
                            }
                        });
                    }
                }
            }
        }
        const varMatch = line.match(/\b((?:int|bool|string|decimal|uuid|json|jsonarray|date|datetime|bigint|blob|[A-Za-z_][A-Za-z0-9_]*(?:\[\])?))\s+([a-z][A-Za-z0-9_]*)\s*(=|;)/);
        if (varMatch) {
            const varType = varMatch[1];
            const varName = varMatch[2];
            symbols.push({
                name: varName,
                kind: "variable",
                type: varType,
                location: { line: idx, character: varMatch.index ?? 0 }
            });
        }
    });
    return { symbols };
}
