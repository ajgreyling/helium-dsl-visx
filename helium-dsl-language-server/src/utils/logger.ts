/**
 * Logger utility for controlling verbose logging based on trace level
 */

export type TraceLevel = "off" | "messages" | "verbose";

let currentTraceLevel: TraceLevel = "off";

/**
 * Initialize the logger with a trace level
 */
export function initializeLogger(traceLevel: TraceLevel): void {
  currentTraceLevel = traceLevel;
}

/**
 * Log verbose messages (WorkspaceIndex debug logs)
 * Only logs if trace level is "verbose"
 */
export function logVerbose(...args: unknown[]): void {
  if (currentTraceLevel === "verbose") {
    console.log(...args);
  }
}

/**
 * Get the current trace level
 */
export function getTraceLevel(): TraceLevel {
  return currentTraceLevel;
}
