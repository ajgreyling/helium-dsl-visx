import * as fs from "fs";
import { URI } from "vscode-uri";
export function buildContextCompletions(_table) {
    // Placeholder for context-aware completions; returns empty for now.
    return [];
}
/**
 * Get all property names from an object definition
 */
export function getObjectProperties(typeName, workspaceIndex) {
    const definition = workspaceIndex.findObjectDefinition(typeName);
    if (!definition) {
        return [];
    }
    try {
        const filePath = URI.parse(definition.uri).fsPath;
        const content = fs.readFileSync(filePath, "utf8");
        const lines = content.split(/\r?\n/);
        // Find the object definition line
        let objectStartLine = definition.line;
        let braceDepth = 0;
        let inObject = false;
        const properties = [];
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const trimmedLine = line.trim();
            // Check if we've reached the object definition
            if (i === objectStartLine) {
                // Find the opening brace on this line or next lines
                if (line.includes("{")) {
                    inObject = true;
                    braceDepth = 1;
                    // Check if there are properties on the same line after the brace
                    const afterBrace = line.substring(line.indexOf("{") + 1);
                    if (afterBrace.trim() && !afterBrace.trim().startsWith("}")) {
                        // There might be content on the same line
                    }
                }
                continue;
            }
            if (inObject) {
                // Count braces to track nesting
                for (const char of line) {
                    if (char === "{")
                        braceDepth++;
                    if (char === "}")
                        braceDepth--;
                }
                // If we've closed the object definition, stop
                if (braceDepth === 0) {
                    break;
                }
                // Skip comments
                if (trimmedLine.startsWith("//") || trimmedLine.startsWith("/*")) {
                    continue;
                } // Skip empty lines
                if (trimmedLine.length === 0) {
                    continue;
                } // Skip method/validator blocks (they start with a word followed by {)
                if (/^\w+\s*\{/.test(trimmedLine)) {
                    // This is likely a method or validator block, skip until closing brace
                    let blockDepth = 0;
                    for (let j = i; j < lines.length; j++) {
                        const blockLine = lines[j];
                        for (const char of blockLine) {
                            if (char === "{")
                                blockDepth++;
                            if (char === "}")
                                blockDepth--;
                        }
                        if (blockDepth === 0) {
                            i = j;
                            break;
                        }
                    }
                    continue;
                } // Match regular properties: type propertyName;
                // Pattern: <type> <propertyName> [;=]
                const propertyMatch = trimmedLine.match(/^\s*(?:@\w+\s+)*\b(?:int|bool|string|decimal|uuid|json|jsonarray|date|datetime|bigint|blob|[A-Za-z_][A-Za-z0-9_]*(?:\[\])?)\s+([a-z][A-Za-z0-9_]*)\s*[;=]/);
                if (propertyMatch && propertyMatch[1]) {
                    properties.push(propertyMatch[1]);
                    continue;
                } // Match relationship properties: @ManyToOne Type propertyName via relationship;
                // or @OneToMany Type[] propertyName via relationship;
                const relationshipMatch = trimmedLine.match(/^\s*@(?:ManyToOne|OneToMany|OneToOne)\s+[A-Za-z_][A-Za-z0-9_]*(?:\[\])?\s+([a-z][A-Za-z0-9_]*)\s+via\s+\w+;/);
                if (relationshipMatch && relationshipMatch[1]) {
                    properties.push(relationshipMatch[1]);
                    continue;
                }
            }
            else if (i > objectStartLine && line.includes("{")) {
                // We haven't entered the object yet, but found an opening brace
                inObject = true;
                braceDepth = 1;
            }
        }
        return properties;
    }
    catch (err) {
        console.error(`[Completion] Error reading object definition for ${typeName}:`, err);
        return [];
    }
}
