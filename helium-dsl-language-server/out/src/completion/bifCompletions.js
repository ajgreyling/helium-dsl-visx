"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadBifCompletions = loadBifCompletions;
const node_path_1 = __importDefault(require("node:path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const root = node_path_1.default.resolve(__dirname, "..", "..");
function getBifPath() {
    // Try bundled path first (when packaged in extension)
    const bundledPath = node_path_1.default.join(root, "..", "generated", "bifs", "bif-metadata.json");
    // Fallback to development path
    const devPath = node_path_1.default.join(root, "..", "..", "generated", "bifs", "bif-metadata.json");
    // Check which exists synchronously (for path resolution)
    try {
        if (fs_extra_1.default.existsSync(bundledPath)) {
            return bundledPath;
        }
    }
    catch {
        // Ignore errors
    }
    return devPath;
}
async function loadBifCompletions() {
    const bifPath = getBifPath();
    if (!(await fs_extra_1.default.pathExists(bifPath)))
        return [];
    const data = await fs_extra_1.default.readJson(bifPath);
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
