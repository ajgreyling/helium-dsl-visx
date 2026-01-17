import fs from "fs";
import path from "path";
import { URI } from "vscode-uri";

export type WorkspaceFolder = { uri: string; name?: string };

const IGNORED_DIRS = new Set(["node_modules", ".git", ".idea", ".vscode"]);

function hasProjectMarkers(dir: string): boolean {
  const modelDir = path.join(dir, "model");
  const webAppDir = path.join(dir, "web-app");
  if (!fs.existsSync(modelDir) || !fs.existsSync(webAppDir)) return false;
  return containsMezFiles(dir);
}

function containsMezFiles(dir: string): boolean {
  try {
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
  
  // Log discovered project roots for debugging
  console.error(`[ProjectDiscovery] Discovered ${result.length} project root(s):`);
  result.forEach(root => {
    console.error(`[ProjectDiscovery]   - ${root}`);
    const modelDir = path.join(root, "model");
    const webAppDir = path.join(root, "web-app");
    console.error(`[ProjectDiscovery]     model/ exists: ${fs.existsSync(modelDir)}`);
    console.error(`[ProjectDiscovery]     web-app/ exists: ${fs.existsSync(webAppDir)}`);
  });
  
  // #region agent log
  (globalThis as any).fetch('http://127.0.0.1:7243/ingest/f8eecc7d-5d84-4f56-8e99-5ad9d9836767',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'mcp-symbols-1',hypothesisId:'H1',location:'helium-dsl-language-server/src/projects/projectDiscovery.ts:51',message:'discover_project_roots',data:{workspaceFolderCount:(workspaceFolders ?? []).length,workspaceFolders:(workspaceFolders ?? []).map(f=>({uri:f.uri,name:f.name})),projectRoots:result,projectRootCount:result.length},timestamp:Date.now()})}).catch(()=>{});
  // #endregion agent log
  return result;
}

export function findProjectRootForFile(filePath: string, projectRoots: string[]): string | null {
  const normalized = path.resolve(filePath);
  const candidates = projectRoots.filter((root) => normalized.startsWith(path.resolve(root)));
  if (candidates.length === 0) return null;
  return candidates.sort((a, b) => b.length - a.length)[0];
}
