/**
 * The published config and tarball.
 *
 * The published package once shipped a config whose corpus root pointed outside the package, at a
 * directory only this repository has — so consumers installed a corpus they could never resolve.
 *
 * The factory's `kb.config.json` carries a `docs` corpus pointing at `.sources/docs` — the official
 * documentation clones the benchmark compares against. Consumers have no such directory, so shipping
 * it would leave `KB_CORPUS=docs` resolving to a path that does not exist on any consumer machine.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { packageDir, serverPath } from "./helpers.js";

const SCRIPT = resolve(packageDir, "scripts/build-package-config.mjs");

function run(args: string[]): { status: number | null; stdout: string; stderr: string } {
  const r = spawnSync(process.execPath, [SCRIPT, ...args], { encoding: "utf8", cwd: packageDir });
  return { status: r.status, stdout: r.stdout ?? "", stderr: r.stderr ?? "" };
}

/**
 * Both tests below probe the built bundle. `npm test` builds it first, and the CI standalone job
 * deletes dist/ before the run — so an absent bundle means the build failed, which must be red.
 * A missing bundle is built on demand here (once, for a direct `node --test` run) and, failing
 * that, reported with the command to run; it is never skipped.
 */
function requireBundle(): void {
  if (existsSync(serverPath)) return;
  const build = spawnSync("npm", ["run", "build"], { cwd: packageDir, encoding: "utf8", timeout: 300_000 });
  assert.ok(
    existsSync(serverPath),
    `dist/server.js is missing and \`npm run build\` (in ${packageDir}) did not produce it — exit ${build.status}:\n${build.stderr ?? build.error?.message ?? ""}`,
  );
}

test("the published config keeps wiki and drops every factory-only corpus", () => {
  const r = run(["--stdout"]);
  assert.equal(r.status, 0, r.stderr);
  const config = JSON.parse(r.stdout);
  assert.equal(config.corpus, "wiki");
  assert.deepEqual(Object.keys(config.corpora), ["wiki"]);
  assert.equal(config.corpora.wiki.root, "../wiki", "relative to the BUNDLE dir, not the package root");
  assert.equal(config.corpora.docs, undefined);
});

test("a corpus is excluded by default, not by being remembered", () => {
  // An allow-list rather than `delete corpora.docs`: a corpus added later must be named to ship.
  const dir = mkdtempSync(join(tmpdir(), "kb-cfg-"));
  try {
    const f = join(dir, "kb.config.json");
    writeFileSync(
      f,
      JSON.stringify({
        corpus: "wiki",
        corpora: {
          wiki: { root: "../wiki", developer: "platform/dev/6.7", merchant: "platform/func", entryPoints: ["platform/index.md"] },
          somethingNew: { root: "../.sources/other", developer: "d", merchant: "m", entryPoints: [] },
        },
      }),
    );
    const config = JSON.parse(run(["--in", f, "--stdout"]).stdout);
    assert.deepEqual(Object.keys(config.corpora), ["wiki"], "an unknown corpus must not leak into the package");
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("a corpus root that would escape the package is refused", () => {
  const dir = mkdtempSync(join(tmpdir(), "kb-cfg-"));
  try {
    const f = join(dir, "kb.config.json");
    writeFileSync(
      f,
      JSON.stringify({
        corpus: "wiki",
        // Resolved from dist/, this climbs out of the package entirely — precisely the shape of
        // the shipped-root bug (`../../../../docs/shopware-knowledge-bases`), where the published
        // config pointed at a directory that exists only in this repository.
        corpora: { wiki: { root: "../../../elsewhere", developer: "d", merchant: "m", entryPoints: [] } },
      }),
    );
    const r = run(["--in", f, "--stdout"]);
    assert.equal(r.status, 1);
    assert.match(r.stderr, /resolves outside the package/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("--check fails on a stale generated file", () => {
  const dir = mkdtempSync(join(tmpdir(), "kb-cfg-"));
  try {
    const stale = join(dir, "kb.config.json");
    writeFileSync(stale, "{}\n");
    const r = run(["--check", stale]);
    assert.equal(r.status, 1);
    assert.match(r.stderr, /is stale/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("the packed config makes KB_CORPUS=docs fail with 'unknown corpus'", () => {
  requireBundle();
  const dir = mkdtempSync(join(tmpdir(), "kb-cfg-"));
  try {
    const generated = join(dir, "kb.config.json");
    assert.equal(run(["--out", generated]).status, 0);
    // The server already produces this message (registry.ts); the point of the test is that the
    // PUBLISHED config is what makes it unreachable, so a consumer cannot select a corpus that is
    // not in their tarball.
    // Assert the message, not merely that it failed: "the server did not start" has many causes,
    // and only one of them is the corpus being absent from the published config.
    const probe = spawnSync(process.execPath, [serverPath], {
      encoding: "utf8",
      timeout: 20000,
      input: "",
      env: { ...process.env, KB_CONFIG: generated, KB_CORPUS: "docs", KB_PROJECT_WIKI: "off" },
    });
    assert.notEqual(probe.status, 0, "the server must refuse a corpus the published config does not define");
    assert.match(probe.stderr ?? "", /unknown corpus "docs"; available: wiki/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("npm pack ships exactly the published allow-list", () => {
  requireBundle();
  const r = spawnSync("npm", ["pack", "--dry-run", "--json"], { cwd: packageDir, encoding: "utf8" });
  // Two distinct outcomes, neither of them a skip: npm missing from PATH is a broken environment
  // for a package whose whole product is an npm tarball, and npm running but failing (registry,
  // config, network) used to turn this gate green while asserting nothing at all.
  const spawnError = (r.error as NodeJS.ErrnoException | undefined) ?? undefined;
  assert.equal(
    spawnError?.code,
    undefined,
    `npm could not be executed (${spawnError?.code}): this package is published with npm, so a checkout without it cannot verify the contents of the tarball.`,
  );
  assert.equal(r.status, 0, `\`npm pack --dry-run --json\` exited ${r.status}:\n${r.stderr ?? ""}`);
  const files = (JSON.parse(r.stdout)[0]?.files ?? []) as { path: string }[];
  const top = [...new Set(files.map((f) => f.path.split("/")[0]))].sort();
  // The published tarball must contain exactly this set — anything else means source, tests or
  // build scratch leaked into the package. package.json is added by npm itself and so is not part
  // of the declared list; THIRD-PARTY-NOTICES.md carries the licence attribution for the code
  // esbuild inlines into dist/server.js, so it ships too (same list as scripts/pack.mjs's
  // ALLOWED_TOP_LEVEL).
  assert.deepEqual(top, ["LICENSE", "README.md", "THIRD-PARTY-NOTICES.md", "dist", "kb.config.json", "package.json", "wiki"]);
  for (const bad of ["src", "test", "ingest", "scripts", "node_modules", ".sources"]) {
    assert.equal(top.includes(bad), false, `${bad}/ must never ship: it is factory tooling, not the product`);
  }
});

test("the server starts when launched through its bin symlink, as npx does", () => {
  requireBundle();
  // npm installs `bin` as node_modules/.bin/<name> -> dist/server.js, so a consumer's
  // `npx <package>` runs the server with argv[1] pointing at the symlink. The entry guard once
  // matched argv[1] against a "server.js" suffix, which the symlink name does not have: the
  // process exited 0, printed nothing, and every MCP client saw a server that never spoke.
  // Silent success is the worst shape for this bug, so assert the handshake, not the exit code.
  const dir = mkdtempSync(join(tmpdir(), "kb-bin-"));
  try {
    const link = join(dir, "sw-dev-knowledge-base-mcp");
    symlinkSync(serverPath, link);
    const probe = spawnSync(process.execPath, [link], {
      encoding: "utf8",
      timeout: 20000,
      input:
        JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "initialize",
          params: { protocolVersion: "2024-11-05", capabilities: {}, clientInfo: { name: "t", version: "0" } },
        }) + "\n",
      env: { ...process.env, KB_PROJECT_WIKI: "off" },
    });
    assert.match(
      probe.stdout ?? "",
      /"serverInfo"/,
      `a server launched through its bin symlink must answer initialize (stdout: ${JSON.stringify(probe.stdout)}, stderr: ${JSON.stringify(probe.stderr)})`,
    );
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
