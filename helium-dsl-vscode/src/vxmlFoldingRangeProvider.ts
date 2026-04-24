import * as vscode from "vscode";

/** Cap folding ranges so very large files stay responsive. */
const MAX_RANGES = 8000;

function countNewlines(text: string, from: number, to: number): number {
  let n = 0;
  const end = Math.min(to, text.length);
  for (let i = from; i < end; i++) {
    if (text[i] === "\n") {
      n++;
    } else if (text[i] === "\r") {
      if (i + 1 < end && text[i + 1] === "\n") {
        i++;
      }
      n++;
    }
  }
  return n;
}

/**
 * Scan from inside a tag (after `<!` for declarations, or after name start) to the closing `>`, respecting quotes.
 */
function scanToTagEnd(text: string, i: number): number | null {
  let quote: '"' | "'" | null = null;
  const n = text.length;
  while (i < n) {
    const c = text[i];
    if (quote) {
      if (c === quote) {
        quote = null;
      }
      i++;
      continue;
    }
    if (c === '"' || c === "'") {
      quote = c;
      i++;
      continue;
    }
    if (c === ">") {
      return i + 1;
    }
    i++;
  }
  return null;
}

function scanTagClose(
  text: string,
  i: number
): { end: number; selfClosing: boolean } | null {
  let quote: '"' | "'" | null = null;
  const n = text.length;
  while (i < n) {
    const c = text[i];
    if (quote) {
      if (c === quote) {
        quote = null;
      }
      i++;
      continue;
    }
    if (c === '"' || c === "'") {
      quote = c;
      i++;
      continue;
    }
    if (c === ">") {
      let j = i - 1;
      while (j >= 0 && /\s/.test(text[j])) {
        j--;
      }
      const selfClosing = j >= 0 && text[j] === "/";
      return { end: i + 1, selfClosing };
    }
    i++;
  }
  return null;
}

function isXmlNameStartChar(c: string): boolean {
  return /[A-Za-z_:]/.test(c);
}

function isXmlNameChar(c: string): boolean {
  return /[A-Za-z0-9_:.\-]/.test(c);
}

function readTagName(
  text: string,
  start: number
): { name: string; next: number } | null {
  let i = start;
  const n = text.length;
  if (i >= n) {
    return null;
  }
  if (!isXmlNameStartChar(text[i])) {
    return null;
  }
  const nameStart = i;
  i++;
  while (i < n && isXmlNameChar(text[i])) {
    i++;
  }
  return { name: text.slice(nameStart, i).toLowerCase(), next: i };
}

/**
 * Element folding for VXML (XML-shaped): one range per matching open/close tag pair spanning multiple lines.
 */
export function computeVxmlElementFoldingRanges(text: string): vscode.FoldingRange[] {
  const ranges: vscode.FoldingRange[] = [];
  const stack: { name: string; line: number }[] = [];
  const n = text.length;
  let pos = 0;
  let line = 0;

  while (pos < n) {
    if (ranges.length >= MAX_RANGES) {
      break;
    }
    const lt = text.indexOf("<", pos);
    if (lt < 0) {
      break;
    }
    line += countNewlines(text, pos, lt);
    const lineAtLt = line;
    let p = lt + 1;
    if (p >= n) {
      break;
    }

    if (text.startsWith("!--", p)) {
      const end = text.indexOf("-->", p + 3);
      if (end < 0) {
        break;
      }
      line = lineAtLt + countNewlines(text, lt, end + 3);
      pos = end + 3;
      continue;
    }
    if (text.startsWith("![CDATA[", p)) {
      const end = text.indexOf("]]>", p + 9);
      if (end < 0) {
        break;
      }
      line = lineAtLt + countNewlines(text, lt, end + 3);
      pos = end + 3;
      continue;
    }
    if (text[p] === "?") {
      const end = text.indexOf("?>", p + 1);
      if (end < 0) {
        break;
      }
      line = lineAtLt + countNewlines(text, lt, end + 2);
      pos = end + 2;
      continue;
    }
    if (text[p] === "!") {
      const end = scanToTagEnd(text, p + 1);
      if (end === null) {
        break;
      }
      line = lineAtLt + countNewlines(text, lt, end);
      pos = end;
      continue;
    }

    const isClose = text[p] === "/";
    if (isClose) {
      p++;
    }
    while (p < n && /\s/.test(text[p])) {
      p++;
    }

    const nameInfo = readTagName(text, p);
    if (!nameInfo) {
      pos = lt + 1;
      continue;
    }
    p = nameInfo.next;
    const tagName = nameInfo.name;

    const tagEnd = scanTagClose(text, p);
    if (!tagEnd) {
      break;
    }

    const closeLine = lineAtLt + countNewlines(text, lt, tagEnd.end - 1);

    if (isClose) {
      while (stack.length > 0 && stack[stack.length - 1].name !== tagName) {
        stack.pop();
      }
      if (stack.length > 0 && stack[stack.length - 1].name === tagName) {
        const open = stack.pop()!;
        if (closeLine > open.line) {
          ranges.push(new vscode.FoldingRange(open.line, closeLine));
        }
      }
    } else if (!tagEnd.selfClosing) {
      stack.push({ name: tagName, line: lineAtLt });
    }

    line = lineAtLt + countNewlines(text, lt, tagEnd.end);
    pos = tagEnd.end;
  }

  return ranges;
}

export function registerVxmlFoldingRangeProvider(
  context: vscode.ExtensionContext
): void {
  const provider: vscode.FoldingRangeProvider = {
    provideFoldingRanges(
      document: vscode.TextDocument,
      _context: vscode.FoldingContext,
      token: vscode.CancellationToken
    ): vscode.ProviderResult<vscode.FoldingRange[]> {
      if (token.isCancellationRequested) {
        return [];
      }
      if (document.languageId !== "helium-vxml") {
        return [];
      }
      return computeVxmlElementFoldingRanges(document.getText());
    },
  };

  context.subscriptions.push(
    vscode.languages.registerFoldingRangeProvider(
      { scheme: "file", language: "helium-vxml" },
      provider
    )
  );
}
