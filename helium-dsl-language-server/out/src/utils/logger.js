"use strict";
/**
 * Logger utility for controlling verbose logging based on trace level
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeLogger = initializeLogger;
exports.logVerbose = logVerbose;
exports.getTraceLevel = getTraceLevel;
let currentTraceLevel = "off";
/**
 * Initialize the logger with a trace level
 */
function initializeLogger(traceLevel) {
    currentTraceLevel = traceLevel;
}
/**
 * Log verbose messages (WorkspaceIndex debug logs)
 * Only logs if trace level is "verbose"
 */
function logVerbose(...args) {
    if (currentTraceLevel === "verbose") {
        console.log(...args);
    }
}
/**
 * Get the current trace level
 */
function getTraceLevel() {
    return currentTraceLevel;
}
