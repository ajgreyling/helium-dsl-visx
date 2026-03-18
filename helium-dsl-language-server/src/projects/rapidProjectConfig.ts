import fs from "node:fs";
import path from "node:path";

export const RAPID_PROJECT_FILE_NAME = "helium-rapid-dsl-project.json";

export type RapidDebugEnvironment = "preprod" | "production";

export type UnusedDiagnosticSeverity = "None" | "Info" | "Warning" | "Error";

export type RapidProjectConfigV1 = {
  schemaVersion: 1;
  debug: {
    environment: RapidDebugEnvironment;
    baseUrl: string;
    appId: string;
    heliumUser: string;
    heliumPassword: string;
    logging: {
      wsPath: string;
    };
  };
  diagnostics?: {
    unused?: {
      attributes?: UnusedDiagnosticSeverity;
      functions?: UnusedDiagnosticSeverity;
      units?: UnusedDiagnosticSeverity;
      /** Unused keys in .lang files (not referenced via String:translate in .mez or label-like attrs in .vxml). Default: Info */
      languageEntries?: UnusedDiagnosticSeverity;
    };
  };
};

export function baseUrlForEnvironment(env: RapidDebugEnvironment): string {
  return env === "production" ? "https://helium.mezzanineware.com" : "https://preprod.mezzanineware.com";
}

export function getRapidProjectFilePath(projectRoot: string): string {
  return path.join(projectRoot, RAPID_PROJECT_FILE_NAME);
}

export function isRapidProjectRoot(projectRoot: string): boolean {
  return fs.existsSync(getRapidProjectFilePath(projectRoot));
}

export function defaultRapidProjectConfig(
  env: RapidDebugEnvironment = "preprod"
): RapidProjectConfigV1 {
  return {
    schemaVersion: 1,
    debug: {
      environment: env,
      baseUrl: baseUrlForEnvironment(env),
      appId: "",
      heliumUser: "",
      heliumPassword: "",
      logging: {
        wsPath: "/api/ws2/logging",
      },
    },
    diagnostics: {
      unused: {
        attributes: "None",
        functions: "Warning",
        units: "Warning",
        languageEntries: "Info",
      },
    },
  };
}

export function readRapidProjectConfig(projectRoot: string): RapidProjectConfigV1 | null {
  const filePath = getRapidProjectFilePath(projectRoot);
  if (!fs.existsSync(filePath)) return null;
  try {
    const raw = fs.readFileSync(filePath, "utf8");
    const json = JSON.parse(raw) as RapidProjectConfigV1;
    if (!json || (json as any).schemaVersion !== 1) return null;
    
    // If diagnostics section is missing, add it with default values
    if (!json.diagnostics) {
      json.diagnostics = {
        unused: {
          attributes: "None",
          functions: "Warning",
          units: "Warning",
          languageEntries: "Info",
        },
      };
      // Write the updated config back to the file
      fs.writeFileSync(filePath, JSON.stringify(json, null, 2) + "\n", "utf8");
    } else if (!json.diagnostics.unused) {
      // If diagnostics exists but unused is missing, add it
      json.diagnostics.unused = {
        attributes: "None",
        functions: "Warning",
        units: "Warning",
        languageEntries: "Info",
      };
      // Write the updated config back to the file
      fs.writeFileSync(filePath, JSON.stringify(json, null, 2) + "\n", "utf8");
    }
    
    return json;
  } catch {
    return null;
  }
}

export function ensureRapidProjectConfig(
  projectRoot: string,
  opts?: { env?: RapidDebugEnvironment; overwriteInvalid?: boolean }
): { filePath: string; created: boolean; config: RapidProjectConfigV1 } {
  const filePath = getRapidProjectFilePath(projectRoot);
  const existing = readRapidProjectConfig(projectRoot);
  if (existing) {
    return { filePath, created: false, config: existing };
  }

  const overwriteInvalid = opts?.overwriteInvalid ?? false;
  if (!overwriteInvalid && fs.existsSync(filePath)) {
    // File exists but is invalid/unreadable; don't clobber by default.
    return { filePath, created: false, config: defaultRapidProjectConfig(opts?.env) };
  }

  const cfg = defaultRapidProjectConfig(opts?.env);
  fs.writeFileSync(filePath, JSON.stringify(cfg, null, 2) + "\n", "utf8");
  return { filePath, created: true, config: cfg };
}

