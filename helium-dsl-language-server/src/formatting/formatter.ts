import { TextEdit, Range, FormattingOptions } from "vscode-languageserver";
import { TextDocument } from "vscode-languageserver-textdocument";

/**
 * Format a document with tabs indentation and K&R brace style
 */
export function formatDocument(
  doc: TextDocument,
  options: FormattingOptions,
  range?: Range
): TextEdit[] {
  const text = doc.getText();
  const lines = text.split(/\r?\n/);
  const fullRange = range || {
    start: { line: 0, character: 0 },
    end: { line: lines.length - 1, character: lines[lines.length - 1]?.length || 0 },
  };

  const startLine = fullRange.start.line;
  const endLine = fullRange.end.line;
  const formattedLines: string[] = [];

  let braceDepth = 0;
  let inString = false;
  let stringChar: string | null = null;
  let inComment = false;
  let inBlockComment = false;

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    const originalLine = line;

    // Skip formatting outside the range (before start)
    if (i < startLine) {
      formattedLines.push(line);
      continue;
    }

    // Stop formatting after the range
    if (i > endLine) {
      formattedLines.push(line);
      continue;
    }

    // Track string and comment state
    let newInString: boolean = inString;
    let newStringChar: string | null = stringChar;
    let newInComment: boolean = inComment;
    let newInBlockComment: boolean = inBlockComment;

    // Process line character by character to track state
    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      const nextChar = j + 1 < line.length ? line[j + 1] : null;

      // Handle block comments
      if (!newInString && !newInComment && char === "/" && nextChar === "*") {
        newInBlockComment = true;
        j++; // Skip next char
        continue;
      }
      if (newInBlockComment && char === "*" && nextChar === "/") {
        newInBlockComment = false;
        j++; // Skip next char
        continue;
      }
      if (newInBlockComment) {
        continue;
      }

      // Handle line comments
      if (!newInString && char === "/" && nextChar === "/") {
        newInComment = true;
        break; // Rest of line is comment
      }

      // Handle strings
      if (!newInComment && (char === '"' || char === "'")) {
        if (!newInString) {
          newInString = true;
          newStringChar = char;
        } else if (char === newStringChar) {
          // Check if escaped
          let escaped = false;
          let backslashCount = 0;
          for (let k = j - 1; k >= 0 && line[k] === "\\"; k--) {
            backslashCount++;
          }
          if (backslashCount % 2 === 0) {
            newInString = false;
            newStringChar = null;
          }
        }
      }
    }

    // Don't format lines that are entirely strings or comments
    const trimmedLine = line.trim();
    if (trimmedLine.startsWith("//") || trimmedLine.startsWith("/*") || trimmedLine.startsWith("*")) {
      formattedLines.push(line);
      inString = newInString;
      stringChar = newStringChar;
      inComment = false; // Reset at end of line
      inBlockComment = newInBlockComment;
      continue;
    }

    // Count braces for indentation (but not inside strings/comments)
    if (!newInString && !newInComment && !newInBlockComment) {
      // Count closing braces before processing (affects indentation)
      for (const char of line) {
        if (char === "}") {
          braceDepth = Math.max(0, braceDepth - 1);
        }
      }
    }

    // Calculate indentation (tabs)
    const indent = "\t".repeat(braceDepth);
    const trimmed = line.trim();

    // Skip empty lines
    if (trimmed.length === 0) {
      formattedLines.push("");
      inString = newInString;
      stringChar = newStringChar;
      inComment = false;
      inBlockComment = newInBlockComment;
      continue;
    }

    // Format: ensure proper indentation
    let formattedLine = indent + trimmed;

    // Fix spacing around operators (but preserve strings)
    if (!newInString && !newInComment && !newInBlockComment) {
      // Add space after keywords: if, else, for, foreach, return, unit, object, persistent
      formattedLine = formattedLine.replace(/\b(if|else|for|foreach|return|unit|object|persistent)\s*\(/g, "$1 (");
      formattedLine = formattedLine.replace(/\b(if|else|for|foreach|return|unit|object|persistent)\s*{/g, "$1 {");
      
      // Ensure space around operators: =, ==, !=, <, >, <=, >=, +, -, *, /, %
      formattedLine = formattedLine.replace(/([^\s=!<>+\-*/%])([=!<>+\-*/%]+)([^\s=!<>+\-*/%])/g, "$1 $2 $3");
      formattedLine = formattedLine.replace(/([^\s=!<>+\-*/%])([=!<>+\-*/%]+)(\s)/g, "$1 $2$3");
      formattedLine = formattedLine.replace(/(\s)([=!<>+\-*/%]+)([^\s=!<>+\-*/%])/g, "$1$2 $3");
      
      // Fix multiple spaces to single space
      formattedLine = formattedLine.replace(/\s{2,}/g, " ");
      
      // Ensure opening brace on same line (K&R style): if (condition) {
      formattedLine = formattedLine.replace(/\s*{\s*$/, " {");
      
      // Ensure proper spacing in function calls: functionName( not functionName (
      formattedLine = formattedLine.replace(/([a-zA-Z_][a-zA-Z0-9_]*)\s+\(/g, "$1(");
    }

    formattedLines.push(formattedLine);

    // Update brace depth after processing line
    if (!newInString && !newInComment && !newInBlockComment) {
      for (const char of line) {
        if (char === "{") {
          braceDepth++;
        }
      }
    }

    // Update state
    inString = newInString;
    stringChar = newStringChar;
    inComment = false; // Reset at end of line
    inBlockComment = newInBlockComment;
  }

  // Create single TextEdit for the entire range
  const formattedText = formattedLines.join("\n");
  const originalText = lines.slice(startLine, endLine + 1).join("\n");

  // Only return edit if something changed
  if (formattedText !== originalText) {
    return [
      {
        range: {
          start: { line: startLine, character: 0 },
          end: { line: endLine, character: lines[endLine]?.length || 0 },
        },
        newText: formattedLines.slice(startLine, endLine + 1).join("\n"),
      },
    ];
  }

  return [];
}

/**
 * Format on type (auto-indent)
 */
export function formatOnType(
  doc: TextDocument,
  position: { line: number; character: number },
  ch: string,
  options: FormattingOptions
): TextEdit[] {
  const text = doc.getText();
  const lines = text.split(/\r?\n/);
  const line = lines[position.line] || "";

  // Auto-indent after closing brace
  if (ch === "}") {
    // Calculate proper indentation based on brace depth
    let braceDepth = 0;
    for (let i = 0; i < position.line; i++) {
      const l = lines[i] || "";
      for (const char of l) {
        if (char === "{") braceDepth++;
        if (char === "}") braceDepth = Math.max(0, braceDepth - 1);
      }
    }

    // Count braces on current line before cursor
    const beforeCursor = line.substring(0, position.character);
    for (const char of beforeCursor) {
      if (char === "{") braceDepth++;
      if (char === "}") braceDepth = Math.max(0, braceDepth - 1);
    }

    const indent = "\t".repeat(braceDepth);
    const afterCursor = line.substring(position.character);

    // Check if we need to adjust indentation
    const currentIndentMatch = line.match(/^(\s*)/);
    const currentIndent = currentIndentMatch ? currentIndentMatch[1] : "";

    if (currentIndent !== indent && afterCursor.trim().length === 0) {
      return [
        {
          range: {
            start: { line: position.line, character: 0 },
            end: { line: position.line, character: currentIndent.length },
          },
          newText: indent,
        },
      ];
    }
  }

  // Auto-indent after semicolon (new line)
  if (ch === "\n" || ch === ";") {
    let braceDepth = 0;
    for (let i = 0; i < position.line; i++) {
      const l = lines[i] || "";
      for (const char of l) {
        if (char === "{") braceDepth++;
        if (char === "}") braceDepth = Math.max(0, braceDepth - 1);
      }
    }

    // Count braces on current line
    for (const char of line) {
      if (char === "{") braceDepth++;
      if (char === "}") braceDepth = Math.max(0, braceDepth - 1);
    }

    const indent = "\t".repeat(braceDepth);
    const nextLine = lines[position.line + 1] || "";
    const nextLineIndentMatch = nextLine.match(/^(\s*)/);
    const nextLineIndent = nextLineIndentMatch ? nextLineIndentMatch[1] : "";

    if (nextLineIndent !== indent && nextLine.trim().length > 0) {
      return [
        {
          range: {
            start: { line: position.line + 1, character: 0 },
            end: { line: position.line + 1, character: nextLineIndent.length },
          },
          newText: indent,
        },
      ];
    }
  }

  return [];
}
