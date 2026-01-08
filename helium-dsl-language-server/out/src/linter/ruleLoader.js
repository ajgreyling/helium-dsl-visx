"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadRules = loadRules;
const node_path_1 = __importDefault(require("node:path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const root = node_path_1.default.resolve(__dirname, "..", "..");
function getRulesPath() {
    // Try bundled path first (when packaged in extension)
    const bundledPath = node_path_1.default.join(root, "..", "generated", "rules", "dsl-rules.json");
    // Fallback to development path
    const devPath = node_path_1.default.join(root, "..", "..", "generated", "rules", "dsl-rules.json");
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
async function loadRules() {
    const rulesPath = getRulesPath();
    if (!(await fs_extra_1.default.pathExists(rulesPath))) {
        return defaultRules();
    }
    const data = await fs_extra_1.default.readJson(rulesPath);
    const rules = data.rules || {};
    return Object.keys(rules).length ? rules : defaultRules();
}
function defaultRules() {
    return {
        "no-var-in-else": {
            id: "no-var-in-else",
            severity: "error",
            message: "Variables cannot be declared in else blocks. Declare before if statement.",
            category: "variables",
        },
        "dot-notation-limit": {
            id: "dot-notation-limit",
            severity: "warning",
            message: "Dot notation can only be used once per statement",
            category: "style",
        },
        "naming-conventions": {
            id: "naming-conventions",
            severity: "warning",
            message: "Identifiers must follow Helium DSL naming conventions.",
            category: "style",
        },
        "forbidden-operators": {
            id: "forbidden-operators",
            severity: "warning",
            message: "Forbidden operator usage.",
            category: "style",
        },
    };
}
