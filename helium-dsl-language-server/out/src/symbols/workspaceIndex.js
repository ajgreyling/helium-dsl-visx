"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkspaceIndex = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const vscode_uri_1 = require("vscode-uri");
const logger_1 = require("../utils/logger");
class WorkspaceIndex {
    constructor() {
        this.objectDefinitions = new Map();
        this.unitDefinitions = new Map();
        this.workspaceRoots = [];
    }
    /**
     * Initialize the workspace index by scanning workspace folders
     */
    initialize(workspaceFolders) {
        (0, logger_1.logVerbose)("[WorkspaceIndex] ===== Initializing workspace index =====");
        this.workspaceRoots = (workspaceFolders || []).map((folder) => {
            const uri = vscode_uri_1.URI.parse(folder.uri);
            (0, logger_1.logVerbose)(`[WorkspaceIndex] Workspace folder: ${folder.name || "unnamed"} -> ${uri.fsPath}`);
            return uri.fsPath;
        });
        if (this.workspaceRoots.length === 0) {
            (0, logger_1.logVerbose)("[WorkspaceIndex] WARNING: No workspace folders found!");
            (0, logger_1.logVerbose)("[WorkspaceIndex] This will prevent object definitions from being found!");
        }
        else {
            (0, logger_1.logVerbose)(`[WorkspaceIndex] Will scan ${this.workspaceRoots.length} workspace root(s)`);
        }
        this.scanWorkspace();
        (0, logger_1.logVerbose)(`[WorkspaceIndex] ===== Index initialization complete =====`);
        (0, logger_1.logVerbose)(`[WorkspaceIndex] Total object definitions found: ${this.objectDefinitions.size}`);
        if (this.objectDefinitions.size > 0) {
            const typeNames = Array.from(this.objectDefinitions.keys());
            if (typeNames.length <= 30) {
                (0, logger_1.logVerbose)(`[WorkspaceIndex] Object types: ${typeNames.join(", ")}`);
            }
            else {
                (0, logger_1.logVerbose)(`[WorkspaceIndex] First 30 object types: ${typeNames.slice(0, 30).join(", ")}...`);
            }
            // Log a few examples with their locations
            const examples = typeNames.slice(0, 5);
            examples.forEach(name => {
                const def = this.objectDefinitions.get(name);
                if (def) {
                    (0, logger_1.logVerbose)(`[WorkspaceIndex] Example: ${name} -> ${def.uri}:${def.line + 1}`);
                }
            });
        }
        else {
            (0, logger_1.logVerbose)("[WorkspaceIndex] WARNING: No object definitions found! Check if model directories exist.");
        }
    }
    /**
     * Scan all .mez files in model directories to find object definitions
     */
    scanWorkspace() {
        (0, logger_1.logVerbose)("[WorkspaceIndex] Starting workspace scan...");
        this.objectDefinitions.clear();
        this.unitDefinitions.clear();
        for (const root of this.workspaceRoots) {
            (0, logger_1.logVerbose)(`[WorkspaceIndex] Scanning directory: ${root}`);
            this.scanDirectory(root);
        }
        (0, logger_1.logVerbose)(`[WorkspaceIndex] Workspace scan complete. Found ${this.objectDefinitions.size} object definitions and ${this.unitDefinitions.size} unit definitions.`);
    }
    /**
     * Recursively scan a directory for .mez files in model folders
     */
    scanDirectory(dir) {
        try {
            if (!fs.existsSync(dir)) {
                return;
            }
            const entries = fs.readdirSync(dir, { withFileTypes: true });
            for (const entry of entries) {
                const fullPath = path.join(dir, entry.name);
                if (entry.isDirectory()) {
                    // Scan model directories and subdirectories
                    if (entry.name === "model" || entry.name.startsWith(".") === false) {
                        this.scanDirectory(fullPath);
                    }
                }
                else if (entry.isFile() && entry.name.endsWith(".mez")) {
                    // Check if this file is in a model directory (any level)
                    if (this.isInModelDirectory(fullPath)) {
                        this.scanMezFile(fullPath);
                    }
                    // Also scan for units in service directories
                    if (this.isInServiceDirectory(fullPath)) {
                        this.scanMezFileForUnits(fullPath);
                    }
                }
            }
        }
        catch (err) {
            // Silently ignore errors (permissions, etc.)
        }
    }
    /**
     * Check if a file path is in a model directory
     */
    isInModelDirectory(filePath) {
        const parts = filePath.split(path.sep);
        return parts.includes("model");
    }
    /**
     * Check if a file path is in a service directory (services, utilities, web-app)
     */
    isInServiceDirectory(filePath) {
        const parts = filePath.split(path.sep);
        return parts.includes("services") || parts.includes("utilities") || parts.includes("web-app");
    }
    /**
     * Scan a .mez file for object definitions
     */
    scanMezFile(filePath) {
        try {
            const content = fs.readFileSync(filePath, "utf8");
            const lines = content.split(/\r?\n/);
            const uri = vscode_uri_1.URI.file(filePath).toString();
            let foundInFile = 0;
            lines.forEach((line, idx) => {
                // Helper: search a few lines above for @Role annotation
                const findRoleAnnotation = (startIdx) => {
                    const maxLookback = 6; // check up to N previous lines for annotation
                    for (let i = 0; i <= maxLookback; i++) {
                        const checkIdx = startIdx - i;
                        if (checkIdx < 0)
                            break;
                        const chk = lines[checkIdx].trim();
                        // Try to match @Role("Name")
                        const detailed = chk.match(/@Role\s*\(\s*"([^"]+)"\s*\)/);
                        if (detailed) {
                            return { isRole: true, roleName: detailed[1] };
                        }
                        // Match plain @Role or @Role(...) without string
                        if (/^@Role\b/.test(chk)) {
                            return { isRole: true, roleName: null };
                        }
                    }
                    return { isRole: false, roleName: null };
                };
                // Match persistent object definitions
                const persistentMatch = line.match(/persistent\s+object\s+([A-Za-z_][A-Za-z0-9_]*)/);
                if (persistentMatch) {
                    const objectName = persistentMatch[1];
                    const roleInfo = findRoleAnnotation(idx);
                    this.objectDefinitions.set(objectName, {
                        name: objectName,
                        uri,
                        line: idx,
                        character: persistentMatch.index ?? 0,
                        isPersistent: true,
                        isRole: roleInfo.isRole,
                        roleName: roleInfo.roleName ?? null,
                    });
                    foundInFile++;
                    (0, logger_1.logVerbose)(`[WorkspaceIndex] ✓ Found persistent object: ${objectName} in ${filePath} at line ${idx + 1} role=${roleInfo.isRole}`);
                    return;
                }
                // Match non-persistent object definitions (only if not already matched)
                const objectMatch = line.match(/object\s+([A-Za-z_][A-Za-z0-9_]*)/);
                if (objectMatch && !this.objectDefinitions.has(objectMatch[1])) {
                    const objectName = objectMatch[1];
                    const roleInfo = findRoleAnnotation(idx);
                    this.objectDefinitions.set(objectName, {
                        name: objectName,
                        uri,
                        line: idx,
                        character: objectMatch.index ?? 0,
                        isPersistent: false,
                        isRole: roleInfo.isRole,
                        roleName: roleInfo.roleName ?? null,
                    });
                    foundInFile++;
                    (0, logger_1.logVerbose)(`[WorkspaceIndex] ✓ Found object: ${objectName} in ${filePath} at line ${idx + 1} role=${roleInfo.isRole}`);
                }
            });
            if (foundInFile === 0 && this.isInModelDirectory(filePath)) {
                (0, logger_1.logVerbose)(`[WorkspaceIndex] ⚠ Scanned model file but found no objects: ${filePath}`);
            }
            else if (foundInFile > 0) {
                (0, logger_1.logVerbose)(`[WorkspaceIndex] Scanned ${filePath}: found ${foundInFile} object(s)`);
            }
        }
        catch (err) {
            console.error(`[WorkspaceIndex] ✗ Error scanning file ${filePath}:`, err);
        }
    }
    /**
     * Scan a .mez file for unit definitions
     */
    scanMezFileForUnits(filePath) {
        try {
            const content = fs.readFileSync(filePath, "utf8");
            const lines = content.split(/\r?\n/);
            const uri = vscode_uri_1.URI.file(filePath).toString();
            lines.forEach((line, idx) => {
                // Match unit definitions: unit UnitName;
                const unitMatch = line.match(/\bunit\s+([A-Za-z_][A-Za-z0-9_]*)/);
                if (unitMatch) {
                    const unitName = unitMatch[1];
                    this.unitDefinitions.set(unitName, {
                        name: unitName,
                        uri,
                        line: idx,
                        character: unitMatch.index ?? 0,
                    });
                    (0, logger_1.logVerbose)(`[WorkspaceIndex] ✓ Found unit: ${unitName} in ${filePath} at line ${idx + 1}`);
                }
            });
        }
        catch (err) {
            console.error(`[WorkspaceIndex] ✗ Error scanning file for units ${filePath}:`, err);
        }
    }
    /**
     * Find the definition location for an object type
     */
    findObjectDefinition(typeName) {
        return this.objectDefinitions.get(typeName);
    }
    /**
     * Get location for an object definition
     * Returns a Location object matching LSP specification:
     * - uri: string (document URI)
     * - range: Range with start and end positions
     */
    getObjectLocation(typeName) {
        const definition = this.findObjectDefinition(typeName);
        if (!definition) {
            (0, logger_1.logVerbose)(`[WorkspaceIndex] getObjectLocation: No definition found for "${typeName}"`);
            return null;
        }
        const location = {
            uri: definition.uri,
            range: {
                start: {
                    line: definition.line,
                    character: definition.character
                },
                end: {
                    line: definition.line,
                    character: definition.character + definition.name.length
                },
            },
        };
        (0, logger_1.logVerbose)(`[WorkspaceIndex] getObjectLocation: Returning location for "${typeName}":`, {
            uri: location.uri,
            start: location.range.start,
            end: location.range.end,
        });
        return location;
    }
    /**
     * Update the index when a file changes
     */
    updateFile(uri) {
        const filePath = vscode_uri_1.URI.parse(uri).fsPath;
        (0, logger_1.logVerbose)(`[WorkspaceIndex] updateFile called for: ${uri} (${filePath})`);
        if (filePath.endsWith(".mez")) {
            if (this.isInModelDirectory(filePath)) {
                (0, logger_1.logVerbose)(`[WorkspaceIndex] Updating model file: ${filePath}`);
                // Remove old object definitions from this file
                const removed = [];
                for (const [name, def] of this.objectDefinitions.entries()) {
                    if (def.uri === uri) {
                        this.objectDefinitions.delete(name);
                        removed.push(name);
                    }
                }
                if (removed.length > 0) {
                    (0, logger_1.logVerbose)(`[WorkspaceIndex] Removed ${removed.length} old object definitions:`, removed);
                }
                // Re-scan the file for objects
                this.scanMezFile(filePath);
            }
            if (this.isInServiceDirectory(filePath)) {
                (0, logger_1.logVerbose)(`[WorkspaceIndex] Updating service file: ${filePath}`);
                // Remove old unit definitions from this file
                const removed = [];
                for (const [name, def] of this.unitDefinitions.entries()) {
                    if (def.uri === uri) {
                        this.unitDefinitions.delete(name);
                        removed.push(name);
                    }
                }
                if (removed.length > 0) {
                    (0, logger_1.logVerbose)(`[WorkspaceIndex] Removed ${removed.length} old unit definitions:`, removed);
                }
                // Re-scan the file for units
                this.scanMezFileForUnits(filePath);
            }
        }
        else {
            (0, logger_1.logVerbose)(`[WorkspaceIndex] File not a .mez file, skipping update`);
        }
    }
    /**
     * Get debug information about the index
     */
    getDebugInfo() {
        return {
            objectCount: this.objectDefinitions.size,
            objects: Array.from(this.objectDefinitions.keys()),
            unitCount: this.unitDefinitions.size,
            units: Array.from(this.unitDefinitions.keys()),
            workspaceRoots: this.workspaceRoots,
        };
    }
    /**
     * Check if a type name is a user-defined object (not a system type)
     */
    isUserDefinedType(typeName) {
        const systemTypes = [
            "int",
            "decimal",
            "bigint",
            "uuid",
            "blob",
            "bool",
            "string",
            "void",
            "date",
            "datetime",
            "json",
            "jsonarray",
        ];
        const isSystemType = systemTypes.includes(typeName.toLowerCase());
        const isInIndex = this.objectDefinitions.has(typeName);
        (0, logger_1.logVerbose)(`[WorkspaceIndex] Checking type "${typeName}": isSystemType=${isSystemType}, isInIndex=${isInIndex}, result=${!isSystemType && isInIndex}`);
        if (isInIndex) {
            const def = this.objectDefinitions.get(typeName);
            if (def) {
                (0, logger_1.logVerbose)(`[WorkspaceIndex] Definition found: ${def.name} at ${def.uri}:${def.line + 1}`);
            }
        }
        return !isSystemType && isInIndex;
    }
    /**
     * Find the definition location for a unit
     */
    findUnitDefinition(unitName) {
        return this.unitDefinitions.get(unitName);
    }
    /**
     * Get location for a unit definition
     * Returns a Location object matching LSP specification
     */
    getUnitLocation(unitName) {
        const definition = this.findUnitDefinition(unitName);
        if (!definition) {
            (0, logger_1.logVerbose)(`[WorkspaceIndex] getUnitLocation: No definition found for "${unitName}"`);
            return null;
        }
        const location = {
            uri: definition.uri,
            range: {
                start: {
                    line: definition.line,
                    character: definition.character
                },
                end: {
                    line: definition.line,
                    character: definition.character + definition.name.length
                },
            },
        };
        (0, logger_1.logVerbose)(`[WorkspaceIndex] getUnitLocation: Returning location for "${unitName}":`, {
            uri: location.uri,
            start: location.range.start,
            end: location.range.end,
        });
        return location;
    }
    /**
     * Check if a name is a unit
     */
    isUnit(unitName) {
        const isInIndex = this.unitDefinitions.has(unitName);
        (0, logger_1.logVerbose)(`[WorkspaceIndex] Checking unit "${unitName}": isInIndex=${isInIndex}`);
        if (isInIndex) {
            const def = this.unitDefinitions.get(unitName);
            if (def) {
                (0, logger_1.logVerbose)(`[WorkspaceIndex] Unit definition found: ${def.name} at ${def.uri}:${def.line + 1}`);
            }
        }
        return isInIndex;
    }
}
exports.WorkspaceIndex = WorkspaceIndex;
