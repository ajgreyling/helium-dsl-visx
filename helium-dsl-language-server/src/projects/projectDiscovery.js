import fs from "fs";
import path from "path";
import { URI } from "vscode-uri";
const IGNORED_DIRS = new Set(["node_modules", ".git", ".idea", ".vscode"]);
function hasProjectMarkers(dir) {
    const modelDir = path.join(dir, "model");
    const webAppDir = path.join(dir, "web-app");
    if (!fs.existsSync(modelDir) || !fs.existsSync(webAppDir))
        return false;
    return containsMezFiles(dir);
}
function containsMezFiles(dir) {
    try {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
            if (entry.isDirectory()) {
                if (entry.name.startsWith(".") || IGNORED_DIRS.has(entry.name))
                    continue;
                if (containsMezFiles(path.join(dir, entry.name)))
                    return true;
            }
            else if (entry.isFile() && entry.name.endsWith(".mez")) {
                return true;
            }
        }
    }
    catch {
        // ignore
    }
    return false;
}
function scanForProjects(root, found) {
    if (IGNORED_DIRS.has(path.basename(root)))
        return;
    if (hasProjectMarkers(root)) {
        found.add(root);
        return;
    }
    try {
        const entries = fs.readdirSync(root, { withFileTypes: true });
        for (const entry of entries) {
            if (!entry.isDirectory())
                continue;
            if (entry.name.startsWith(".") || IGNORED_DIRS.has(entry.name))
                continue;
            scanForProjects(path.join(root, entry.name), found);
        }
    }
    catch {
        // ignore
    }
}
export function discoverProjectRoots(workspaceFolders) {
    const roots = new Set();
    (workspaceFolders || []).forEach((folder) => {
        const fsPath = URI.parse(folder.uri).fsPath;
        scanForProjects(fsPath, roots);
    });
    return Array.from(roots).sort();
}
export function findProjectRootForFile(filePath, projectRoots) {
    const normalized = path.resolve(filePath);
    const candidates = projectRoots.filter((root) => normalized.startsWith(path.resolve(root)));
    if (candidates.length === 0)
        return null;
    return candidates.sort((a, b) => b.length - a.length)[0];
}
