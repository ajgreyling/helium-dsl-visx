import * as fs from "fs";
import * as path from "path";
import { URI } from "vscode-uri";
import { Location } from "vscode-languageserver";

export interface ObjectDefinition {
  name: string;
  uri: string;
  line: number;
  character: number;
  isPersistent: boolean;
  isRole?: boolean;
  roleName?: string | null;
}

export class WorkspaceIndex {
  private objectDefinitions: Map<string, ObjectDefinition> = new Map();
  private workspaceRoots: string[] = [];

  /**
   * Initialize the workspace index by scanning workspace folders
   */
  initialize(workspaceFolders: { uri: string; name?: string }[] | null): void {
    console.log("[WorkspaceIndex] ===== Initializing workspace index =====");
    this.workspaceRoots = (workspaceFolders || []).map((folder) => {
      const uri = URI.parse(folder.uri);
      console.log(`[WorkspaceIndex] Workspace folder: ${folder.name || "unnamed"} -> ${uri.fsPath}`);
      return uri.fsPath;
    });
    if (this.workspaceRoots.length === 0) {
      console.log("[WorkspaceIndex] WARNING: No workspace folders found!");
      console.log("[WorkspaceIndex] This will prevent object definitions from being found!");
    } else {
      console.log(`[WorkspaceIndex] Will scan ${this.workspaceRoots.length} workspace root(s)`);
    }
    this.scanWorkspace();
    console.log(`[WorkspaceIndex] ===== Index initialization complete =====`);
    console.log(`[WorkspaceIndex] Total object definitions found: ${this.objectDefinitions.size}`);
    if (this.objectDefinitions.size > 0) {
      const typeNames = Array.from(this.objectDefinitions.keys());
      if (typeNames.length <= 30) {
        console.log(`[WorkspaceIndex] Object types: ${typeNames.join(", ")}`);
      } else {
        console.log(`[WorkspaceIndex] First 30 object types: ${typeNames.slice(0, 30).join(", ")}...`);
      }
      // Log a few examples with their locations
      const examples = typeNames.slice(0, 5);
      examples.forEach(name => {
        const def = this.objectDefinitions.get(name);
        if (def) {
          console.log(`[WorkspaceIndex] Example: ${name} -> ${def.uri}:${def.line + 1}`);
        }
      });
    } else {
      console.log("[WorkspaceIndex] WARNING: No object definitions found! Check if model directories exist.");
    }
  }

  /**
   * Scan all .mez files in model directories to find object definitions
   */
  private scanWorkspace(): void {
    console.log("[WorkspaceIndex] Starting workspace scan...");
    this.objectDefinitions.clear();

    for (const root of this.workspaceRoots) {
      console.log(`[WorkspaceIndex] Scanning directory: ${root}`);
      this.scanDirectory(root);
    }
    console.log(`[WorkspaceIndex] Workspace scan complete. Found ${this.objectDefinitions.size} object definitions.`);
  }

  /**
   * Recursively scan a directory for .mez files in model folders
   */
  private scanDirectory(dir: string): void {
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
        } else if (entry.isFile() && entry.name.endsWith(".mez")) {
          // Check if this file is in a model directory (any level)
          if (this.isInModelDirectory(fullPath)) {
            this.scanMezFile(fullPath);
          }
        }
      }
    } catch (err) {
      // Silently ignore errors (permissions, etc.)
    }
  }

  /**
   * Check if a file path is in a model directory
   */
  private isInModelDirectory(filePath: string): boolean {
    const parts = filePath.split(path.sep);
    return parts.includes("model");
  }

  /**
   * Scan a .mez file for object definitions
   */
  private scanMezFile(filePath: string): void {
    try {
      const content = fs.readFileSync(filePath, "utf8");
      const lines = content.split(/\r?\n/);
      const uri = URI.file(filePath).toString();
      let foundInFile = 0;

      lines.forEach((line, idx) => {
        // Helper: search a few lines above for @Role annotation
        const findRoleAnnotation = (startIdx: number): { isRole: boolean; roleName?: string | null } => {
          const maxLookback = 6; // check up to N previous lines for annotation
          for (let i = 0; i <= maxLookback; i++) {
            const checkIdx = startIdx - i;
            if (checkIdx < 0) break;
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
        const persistentMatch = line.match(/persistent\s+object\s+([A-Z][A-Za-z0-9_]*)/);
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
          console.log(`[WorkspaceIndex] ✓ Found persistent object: ${objectName} in ${filePath} at line ${idx + 1} role=${roleInfo.isRole}`);
          return;
        }

        // Match non-persistent object definitions (only if not already matched)
        const objectMatch = line.match(/object\s+([A-Z][A-Za-z0-9_]*)/);
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
          console.log(`[WorkspaceIndex] ✓ Found object: ${objectName} in ${filePath} at line ${idx + 1} role=${roleInfo.isRole}`);
        }
      });
      
      if (foundInFile === 0 && this.isInModelDirectory(filePath)) {
        console.log(`[WorkspaceIndex] ⚠ Scanned model file but found no objects: ${filePath}`);
      } else if (foundInFile > 0) {
        console.log(`[WorkspaceIndex] Scanned ${filePath}: found ${foundInFile} object(s)`);
      }
    } catch (err) {
      console.error(`[WorkspaceIndex] ✗ Error scanning file ${filePath}:`, err);
    }
  }

  /**
   * Find the definition location for an object type
   */
  findObjectDefinition(typeName: string): ObjectDefinition | undefined {
    return this.objectDefinitions.get(typeName);
  }

  /**
   * Get location for an object definition
   * Returns a Location object matching LSP specification:
   * - uri: string (document URI)
   * - range: Range with start and end positions
   */
  getObjectLocation(typeName: string): Location | null {
    const definition = this.findObjectDefinition(typeName);
    if (!definition) {
      console.log(`[WorkspaceIndex] getObjectLocation: No definition found for "${typeName}"`);
      return null;
    }

    const location: Location = {
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
    
    console.log(`[WorkspaceIndex] getObjectLocation: Returning location for "${typeName}":`, {
      uri: location.uri,
      start: location.range.start,
      end: location.range.end,
    });
    
    return location;
  }

  /**
   * Update the index when a file changes
   */
  updateFile(uri: string): void {
    const filePath = URI.parse(uri).fsPath;
    console.log(`[WorkspaceIndex] updateFile called for: ${uri} (${filePath})`);
    if (filePath.endsWith(".mez") && this.isInModelDirectory(filePath)) {
      console.log(`[WorkspaceIndex] Updating model file: ${filePath}`);
      // Remove old definitions from this file
      const removed: string[] = [];
      for (const [name, def] of this.objectDefinitions.entries()) {
        if (def.uri === uri) {
          this.objectDefinitions.delete(name);
          removed.push(name);
        }
      }
      if (removed.length > 0) {
        console.log(`[WorkspaceIndex] Removed ${removed.length} old definitions:`, removed);
      }
      // Re-scan the file
      this.scanMezFile(filePath);
    } else {
      console.log(`[WorkspaceIndex] File not a model .mez file, skipping update`);
    }
  }
  
  /**
   * Get debug information about the index
   */
  getDebugInfo(): { objectCount: number; objects: string[]; workspaceRoots: string[] } {
    return {
      objectCount: this.objectDefinitions.size,
      objects: Array.from(this.objectDefinitions.keys()),
      workspaceRoots: this.workspaceRoots,
    };
  }

  /**
   * Check if a type name is a user-defined object (not a system type)
   */
  isUserDefinedType(typeName: string): boolean {
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
    console.log(`[WorkspaceIndex] Checking type "${typeName}": isSystemType=${isSystemType}, isInIndex=${isInIndex}, result=${!isSystemType && isInIndex}`);
    if (isInIndex) {
      const def = this.objectDefinitions.get(typeName);
      if (def) {
        console.log(`[WorkspaceIndex] Definition found: ${def.name} at ${def.uri}:${def.line + 1}`);
      }
    }
    return !isSystemType && isInIndex;
  }
}


