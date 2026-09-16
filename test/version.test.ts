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
