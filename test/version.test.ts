/**
 * The server's reported version and the package's version must not drift.
 *
 * `serverInfo.version` is what an MCP client displays and what the MCP Registry entry is
 * matched against, so a mismatch publishes a server that misreports itself. The constant is
 * hand-maintained in `src/server.ts` (the bundle has no package.json to read at runtime),
 * which is exactly the kind of duplication that goes stale during a release.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { SERVER_VERSION } from "../src/server.js";
import { packageDir } from "./helpers.js";

test("SERVER_VERSION matches package.json's version", () => {
  const pkg = JSON.parse(readFileSync(resolve(packageDir, "package.json"), "utf8")) as { version: string };
  assert.equal(
    SERVER_VERSION,
    pkg.version,
    "src/server.ts's SERVER_VERSION must be bumped with package.json — a client would otherwise report a version that was never published",
  );
});

test("server.json is in step with package.json", () => {
  // The MCP Registry rejects a submission whose server.json disagrees with the npm package it
  // points at, and that rejection would land mid-release, after `npm publish` has already
  // burned the version. Catching the drift here makes it a local test failure instead.
  const pkg = JSON.parse(readFileSync(resolve(packageDir, "package.json"), "utf8")) as {
    name: string;
    version: string;
    mcpName: string;
  };
  const srv = JSON.parse(readFileSync(resolve(packageDir, "server.json"), "utf8")) as {
    name: string;
    version: string;
    packages: { registryType: string; identifier: string; version: string }[];
  };
  assert.equal(srv.name, pkg.mcpName, "server.json name must equal package.json mcpName");
  assert.equal(srv.version, pkg.version, "server.json version must equal package.json version");
  const npmEntry = srv.packages.find((e) => e.registryType === "npm");
  assert.ok(npmEntry, "server.json must declare an npm package entry");
  assert.equal(npmEntry.identifier, pkg.name, "server.json npm identifier must equal the package name");
  assert.equal(npmEntry.version, pkg.version, "server.json npm entry version must equal package.json version");
});
