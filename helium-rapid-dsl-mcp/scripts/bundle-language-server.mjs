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

if (!fs.existsSync(lsRoot)) {
  throw new Error(`Language server project not found at ${lsRoot}`);
}

fs.rmSync(bundleDir, { recursive: true, force: true });
fs.mkdirSync(bundleDir, { recursive: true });

const bundledModulePath = path.join(mcpRoot, "node_modules", "helium-dsl-language-server");
fs.rmSync(bundledModulePath, { recursive: true, force: true });

run("npm", ["run", "build"], lsRoot);
run("npm", ["pack", "--pack-destination", bundleDir], lsRoot);

const tgzFiles = fs.readdirSync(bundleDir).filter((name) => name.endsWith(".tgz"));
if (tgzFiles.length !== 1) {
  throw new Error(`Expected exactly one tarball in ${bundleDir}, found ${tgzFiles.length}`);
}

const tarballPath = path.join(bundleDir, tgzFiles[0]);
run("npm", ["install", "--no-save", "--install-links=false", tarballPath], mcpRoot);

const expectedApiPath = path.join(mcpRoot, "node_modules", "helium-dsl-language-server", "out", "src", "api.js");
if (!fs.existsSync(expectedApiPath)) {
  throw new Error(`Bundled language server is missing expected API file: ${expectedApiPath}`);
}

console.log(`Bundled helium-dsl-language-server from ${tarballPath}`);
