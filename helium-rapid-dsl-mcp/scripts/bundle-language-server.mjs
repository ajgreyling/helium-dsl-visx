#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { execFileSync } from "child_process";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const mcpRoot = path.resolve(__dirname, "..");
const lsRoot = path.resolve(mcpRoot, "../helium-dsl-language-server");
const bundleDir = path.join(mcpRoot, ".bundle-tmp");

function run(command, args, cwd) {
  execFileSync(command, args, {
    cwd,
    stdio: "inherit",
    env: process.env,
  });
}

function runCapture(command, args, cwd) {
  return execFileSync(command, args, {
    cwd,
    stdio: ["ignore", "pipe", "inherit"],
    env: process.env,
    encoding: "utf8",
  }).trim();
}

if (!fs.existsSync(lsRoot)) {
  throw new Error(`Language server project not found at ${lsRoot}`);
}

const bundledModulePath = path.join(mcpRoot, "node_modules", "helium-dsl-language-server");
fs.rmSync(bundledModulePath, { recursive: true, force: true });

run("npm", ["run", "build"], lsRoot);
const tarballName = runCapture("npm", ["pack", "--dry-run=false"], lsRoot).split(/\r?\n/).pop();
if (!tarballName || !tarballName.endsWith(".tgz")) {
  throw new Error(`npm pack did not return a tarball name. Output: ${tarballName}`);
}

fs.rmSync(bundleDir, { recursive: true, force: true });
fs.mkdirSync(bundleDir, { recursive: true });
const tarballPath = path.join(bundleDir, tarballName);
fs.renameSync(path.join(lsRoot, tarballName), tarballPath);
run("npm", ["install", "--no-save", "--install-links=false", "--workspaces=false", "--dry-run=false", tarballPath], mcpRoot);

const expectedApiPath = path.join(mcpRoot, "node_modules", "helium-dsl-language-server", "out", "src", "api.js");
if (!fs.existsSync(expectedApiPath)) {
  throw new Error(`Bundled language server is missing expected API file: ${expectedApiPath}`);
}

console.log(`Bundled helium-dsl-language-server from ${tarballPath}`);
