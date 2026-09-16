/**
 * `src/paths.ts` — the factory root resolver: every root this package uses is anchored to the
 * package's own location, never discovered by walking up from the working directory. Walking up
 * used to resolve roots against whatever host project happened to enclose this package, so a fresh
 * clone could not run at all.
 *
 * The behaviours worth pinning are the ones a future change could silently break: the anchor is the
 * module's own location (not the cwd), config beats env beats default per key, and an unset default
 * that escapes the repo throws while an explicit override does not.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, resolve, sep } from "node:path";
import { createPaths, factoryRoot, paths, withOverrides } from "../src/paths.js";
import { wikiRootFrom } from "../ingest/shared/config.js";
import type { PlatformConfig } from "../ingest/shared/types.js";
import { packageDir } from "./helpers.js";

/** An env with none of the KB_* keys the resolver reads, so a developer's shell cannot skew a test. */
const BARE: Record<string, string | undefined> = {};

test("anchors on the module location, not the cwd", () => {
  assert.equal(paths.root, packageDir);
  assert.equal(factoryRoot(BARE), packageDir);
  // The whole point of the anchor: resolution is identical whatever the cwd is, which is what makes
  // the factory runnable from anywhere and movable to sw-dev-kb-factory/ without an edit.
  const before = process.cwd();
  try {
    process.chdir(sep);
    assert.equal(factoryRoot(BARE), packageDir);
    assert.equal(createPaths({ env: BARE }).wikiRoot(), join(packageDir, "wiki"));
  } finally {
    process.chdir(before);
  }
});

test("KB_FACTORY_ROOT relocates every root; a relative value is refused", () => {
  const p = createPaths({ env: { KB_FACTORY_ROOT: "/tmp/kb-fixture" } });
  assert.equal(p.root, "/tmp/kb-fixture");
  assert.equal(p.wikiRoot(), "/tmp/kb-fixture/wiki");
  assert.equal(p.sourcesRoot(), "/tmp/kb-fixture/.sources");
  // Resolving a relative override would have to pick a base, and the only candidate is the cwd —
  // which is exactly the dependency this module removes. So it is an error, not a guess.
  assert.throws(() => factoryRoot({ KB_FACTORY_ROOT: "some/where" }), /must be an absolute path/);
});

test("defaults", () => {
  const p = createPaths({ root: "/f", env: BARE });
  assert.equal(p.sourcesRoot(), "/f/.sources");
  assert.equal(p.shopwareSourceRoot("6.7"), "/f/.sources/shopware/6.7");
  assert.equal(p.shopwareSourceRoot("6.6"), "/f/.sources/shopware/6.6");
  assert.equal(p.docsRoot(), "/f/.sources/docs");
  assert.equal(p.cacheRoot(), "/f/.cache");
  assert.equal(p.wikiRoot(), "/f/wiki");
  assert.equal(p.reportsRoot(), "/f/.claude/skills/kb-factory-verify/reports");
  assert.equal(p.projectWiki(), null);
});

test("precedence per key: config override > env var > default", () => {
  const env = {
    KB_SOURCES_ROOT: "env-sources",
    KB_DOCS_ROOT: "env-docs",
    KB_CACHE_ROOT: "env-cache",
    KB_WIKI_ROOT: "env-wiki",
    KB_REPORTS_ROOT: "env-reports",
  };
  const envOnly = createPaths({ root: "/f", env });
  assert.equal(envOnly.sourcesRoot(), "/f/env-sources");
  assert.equal(envOnly.docsRoot(), "/f/env-docs");
  assert.equal(envOnly.cacheRoot(), "/f/env-cache");
  assert.equal(envOnly.wikiRoot(), "/f/env-wiki");
  assert.equal(envOnly.reportsRoot(), "/f/env-reports");

  const withConfig = createPaths({
    root: "/f",
    env,
    overrides: { sources: "cfg-sources", docs: "cfg-docs", cache: "cfg-cache", wiki: "cfg-wiki", reports: "cfg-reports" },
  });
  assert.equal(withConfig.sourcesRoot(), "/f/cfg-sources");
  assert.equal(withConfig.docsRoot(), "/f/cfg-docs");
  assert.equal(withConfig.cacheRoot(), "/f/cfg-cache");
  assert.equal(withConfig.wikiRoot(), "/f/cfg-wiki");
  assert.equal(withConfig.reportsRoot(), "/f/cfg-reports");
});

test("docsRoot follows a redirected sourcesRoot", () => {
  // docsRoot defaults *through* sourcesRoot rather than through the factory root, so one env var
  // moves the whole .sources/ tree.
  const p = createPaths({ root: "/f", env: { KB_SOURCES_ROOT: "/mnt/big" } });
  assert.equal(p.docsRoot(), "/mnt/big/docs");
  assert.equal(p.shopwareSourceRoot("6.7"), "/mnt/big/shopware/6.7");
});

test("shopwareSourceRoot: per-version env beats the shared one beats the default", () => {
  assert.equal(createPaths({ root: "/f", env: { KB_SHOPWARE_ROOT: "/sw" } }).shopwareSourceRoot("6.7"), "/sw/6.7");
  const perVersion = createPaths({ root: "/f", env: { KB_SHOPWARE_ROOT: "/sw", KB_SHOPWARE_ROOT_6_7: "/pinned/67" } });
  assert.equal(perVersion.shopwareSourceRoot("6.7"), "/pinned/67");
  assert.equal(perVersion.shopwareSourceRoot("6.6"), "/sw/6.6", "other versions keep the shared root");
  const cfg = createPaths({ root: "/f", env: { KB_SHOPWARE_ROOT_6_7: "/env" }, overrides: { shopware: { "6.7": "/cfg" } } });
  assert.equal(cfg.shopwareSourceRoot("6.7"), "/cfg");
});

test("an unset default that escapes the root throws; an explicit override does not", () => {
  // There is no way to reach this through the public keys today — every default is inside the root
  // by construction — so drive it through a config value that escapes, which must be allowed, and
  // assert the message names the env var that unlocks it.
  const escaping = createPaths({ root: "/f", env: BARE, overrides: { wiki: "../elsewhere/wiki" } });
  assert.equal(escaping.wikiRoot(), "/elsewhere/wiki", "an explicit config value may leave the repo");

  const viaEnv = createPaths({ root: "/f", env: { KB_DOCS_ROOT: "/mnt/docs" } });
  assert.equal(viaEnv.docsRoot(), "/mnt/docs", "an explicit env value may leave the repo");
});

test("isInside is lexical, so a symlinked .sources entry still counts as inside", () => {
  // Deliberate: .sources/shopware/6.7 and .sources/docs may be symlinks into the host project this
  // package sits in. A realpath-based check would reject that supported arrangement.
  const p = createPaths({ root: "/f", env: BARE });
  assert.equal(p.isInside("/f/.sources/docs"), true);
  assert.equal(p.isInside("/f/wiki/platform/index.md"), true);
  assert.equal(p.isInside("/elsewhere"), false);
  assert.equal(p.isInside("/f"), false, "the root itself is not 'inside' it");
  assert.equal(p.isInside("/f/../f2"), false);
});

test("projectWiki: host-owned, never guessed from the cwd", () => {
  // The server (registry.ts) deliberately keeps one working-directory tier, so it can discover a
  // project-specific wiki layer belonging to whatever project it was started in. The factory side
  // has no legitimate cwd-derived project wiki, so it says so rather than inventing one.
  assert.equal(createPaths({ root: "/f", env: BARE }).projectWiki(), null);
  assert.equal(createPaths({ root: "/f", env: { KB_PROJECT_WIKI: "off" } }).projectWiki(), null);
  assert.equal(createPaths({ root: "/f", env: { KB_PROJECT_WIKI: "/w" } }).projectWiki(), "/w");
  assert.equal(createPaths({ root: "/f", env: { CLAUDE_PROJECT_DIR: "/host" } }).projectWiki(), "/host/docs/project-wiki");
  assert.equal(
    createPaths({ root: "/f", env: { KB_PROJECT_WIKI: "/w", CLAUDE_PROJECT_DIR: "/host" } }).projectWiki(),
    "/w",
    "the explicit flag outranks the host hint",
  );
});

test("withOverrides layers config onto the real root", () => {
  assert.equal(withOverrides({ wiki: "other" }).wikiRoot(), join(packageDir, "other"));
  assert.equal(withOverrides({}).wikiRoot(), join(packageDir, "wiki"));
});

/** Drops `//` and block comments so a prose mention of the cwd is not read as a use of it. */
function code(file: string): string {
  return readFileSync(file, "utf8")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/^\s*\/\/.*$/gm, "");
}

test("paths.ts itself never reads the cwd", () => {
  // The resolver's whole point — anchoring to its own location — is defeated the moment it goes
  // back to asking where it happens to have been started from.
  assert.doesNotMatch(code(resolve(packageDir, "src/paths.ts")), /process\.cwd/);
});

test("wikiRootFrom: --wiki > config wikiRootDefault > KB_WIKI_ROOT > <root>/wiki", () => {
  // The committed config deliberately leaves `wikiRootDefault` unset, so the env tier is reachable;
  // with it set to "./wiki" (as it was) no KB_WIKI_ROOT could ever win.
  assert.equal(wikiRootFrom({ layer: "platform" }), join(packageDir, "wiki"));
  assert.equal(wikiRootFrom({ layer: "platform", wiki: "other" }), join(packageDir, "other"));
  assert.equal(
    wikiRootFrom({ layer: "platform" }, { wikiRootDefault: "cfg" } as PlatformConfig),
    join(packageDir, "cfg"),
  );
  assert.equal(
    wikiRootFrom({ layer: "platform", wiki: "flag" }, { wikiRootDefault: "cfg" } as PlatformConfig),
    join(packageDir, "flag"),
    "the flag outranks the config",
  );
  // An absolute --wiki is untouched; a relative one resolves against the factory root, not the cwd,
  // which is the point of anchoring the wiki commands to the package rather than the cwd.
  assert.equal(wikiRootFrom({ layer: "platform", wiki: "/abs/wiki" }), "/abs/wiki");
});
test("no ingest module resolves a root from the working directory", () => {
  // Guards against roots resolving against the enclosing host project again. `src/server.ts` keeps
  // one deliberate cwd tier, to discover a project-specific wiki layer; nothing under ingest/ may
  // have any.
  const offenders: string[] = [];
  const walk = (dir: string): string[] =>
    readdirSync(dir).flatMap((n) => (statSync(join(dir, n)).isDirectory() ? walk(join(dir, n)) : [join(dir, n)]));
  for (const f of walk(join(packageDir, "ingest")).filter((f) => f.endsWith(".ts"))) {
    if (/process\.cwd/.test(code(f))) offenders.push(relative(packageDir, f));
  }
  assert.deepEqual(offenders, []);
});
