import fs from "node:fs";
import path from "node:path";

export type LangKeyDiagnostics = {
  key: string;
  missingIn: string[];
};

export class LangKeyIndex {
  private readonly langFiles = new Map<string, Set<string>>();

  constructor(private readonly projectRoot: string) {
    this.refresh();
  }

  refresh() {
    this.langFiles.clear();
    const langDir = path.join(this.projectRoot, "web-app", "lang");
    if (!fs.existsSync(langDir)) return;
    const entries = fs.readdirSync(langDir, { withFileTypes: true });
    for (const entry of entries) {
      if (!entry.isFile()) continue;
      if (!entry.name.endsWith(".lang")) continue;
      const filePath = path.join(langDir, entry.name);
      const keys = parseLangFile(filePath);
      this.langFiles.set(filePath, keys);
    }
  }

  getAllKeys(): Set<string> {
    const all = new Set<string>();
    for (const keys of this.langFiles.values()) {
      for (const k of keys) all.add(k);
    }
    return all;
  }

  getMissingKeyDiagnostics(key: string): LangKeyDiagnostics | null {
    const missing: string[] = [];
    for (const [file, keys] of this.langFiles.entries()) {
      if (!keys.has(key)) {
        missing.push(file);
      }
    }
    if (missing.length === 0) return null;
    return { key, missingIn: missing };
  }

  getLangFiles(): string[] {
    return Array.from(this.langFiles.keys());
  }
}

function parseLangFile(filePath: string): Set<string> {
  const content = fs.readFileSync(filePath, "utf8");
  const keys = new Set<string>();
  const lines = content.split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq <= 0) continue;
    const key = trimmed.substring(0, eq).trim();
    if (key.length > 0) keys.add(key);
  }
  return keys;
}

