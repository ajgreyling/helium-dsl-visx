/**
 * Logger utility for controlling verbose logging based on trace level
 */
let currentTraceLevel = "off";
/**
 * Initialize the logger with a trace level
 */
export function initializeLogger(traceLevel) {
    currentTraceLevel = traceLevel;
}
/**
 * Log verbose messages (WorkspaceIndex debug logs)
 * Only logs if trace level is "verbose"
 */
export function logVerbose(...args) {
    if (currentTraceLevel === "verbose") {
        console.log(...args);
    }
}
/**
 * Get the current trace level
 */
export function getTraceLevel() {
    return currentTraceLevel;
}
