import path from "node:path";
import fs from "fs-extra";
import { fileURLToPath } from "url";
// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..", "..");
function getBifPath() {
    // Try bundled path first (when packaged in extension)
    const bundledPath = path.join(root, "..", "generated", "bifs", "bif-metadata.json");
    // Fallback to development path
    const devPath = path.join(root, "..", "..", "generated", "bifs", "bif-metadata.json");
    // Check which exists synchronously (for path resolution)
    try {
        if (fs.existsSync(bundledPath)) {
            return bundledPath;
        }
    }
    catch {
        // Ignore errors
    }
    return devPath;
}
export async function loadBifCompletions() {
    const bifPath = getBifPath();
    if (!(await fs.pathExists(bifPath)))
        return [];
    const data = await fs.readJson(bifPath);
    const namespaces = data.namespaces || {};
    const completions = [];
    Object.entries(namespaces).forEach(([ns, entries]) => {
        entries.forEach((fn) => {
            completions.push({
                label: `${ns}:${fn.name}`,
                detail: fn.signature || `${ns}:${fn.name}`,
            });
        });
    });
    return completions;
}
