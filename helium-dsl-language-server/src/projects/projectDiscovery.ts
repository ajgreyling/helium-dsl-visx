import fs from "fs";
import path from "path";
import { URI } from "vscode-uri";

export type WorkspaceFolder = { uri: string; name?: string };

const IGNORED_DIRS = new Set(["node_modules", ".git", ".idea", ".vscode"]);

function hasProjectMarkers(dir: string): boolean {
  const modelDir = path.join(dir, "model");
  const webAppDir = path.join(dir, "web-app");
  if (!fs.existsSync(modelDir) || !fs.existsSync(webAppDir)) return false;
  const presentersDir = path.join(webAppDir, "presenters");
  return containsMezFiles(modelDir) || containsMezFiles(presentersDir);
}

function containsMezFiles(dir: string): boolean {
  try {
    if (!fs.existsSync(dir)) return false;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) {
        if (entry.name.startsWith(".") || IGNORED_DIRS.has(entry.name)) continue;
        if (containsMezFiles(path.join(dir, entry.name))) return true;
      } else if (entry.isFile() && entry.name.endsWith(".mez")) {
        return true;
      }
    }
  } catch {
    // ignore
  }
  return false;
}

function scanForProjects(root: string, found: Set<string>) {
  if (IGNORED_DIRS.has(path.basename(root))) return;
  if (hasProjectMarkers(root)) {
    found.add(root);
    return;
  }
  try {
    const entries = fs.readdirSync(root, { withFileTypes: true });
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      if (entry.name.startsWith(".") || IGNORED_DIRS.has(entry.name)) continue;
      scanForProjects(path.join(root, entry.name), found);
    }
  } catch {
    // ignore
  }
}

export function discoverProjectRoots(workspaceFolders: WorkspaceFolder[] | null): string[] {
  const roots = new Set<string>();
  (workspaceFolders || []).forEach((folder) => {
    const fsPath = URI.parse(folder.uri).fsPath;
    scanForProjects(fsPath, roots);
  });
  const result = Array.from(roots).sort();

  return result;
}

export function findProjectRootForFile(filePath: string, projectRoots: string[]): string | null {
  const normalized = path.resolve(filePath);
  const candidates = projectRoots.filter((root) => normalized.startsWith(path.resolve(root)));
  if (candidates.length === 0) return null;
  return candidates.sort((a, b) => b.length - a.length)[0];
}
