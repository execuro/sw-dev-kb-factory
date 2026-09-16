/** `wiki:clean` completeness — `cleanCacheScope`/`cleanStateScope`/
 *  `cleanWikiScope` exercised directly against temp layer/wiki roots (never the real
 *  repo's `ingest/platform/{.cache,state}` or `wiki/`). */
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, mkdirSync, mkdtempSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { cleanCacheScope, cleanStateScope, cleanWikiScope } from "../ingest/platform/clean.js";
import { cacheDirs } from "../ingest/shared/workitems.js";
import type { IngestionState, PlatformConfig, SourceConfig } from "../ingest/shared/types.js";
import { tmpDir } from "./helpers.js";

function totals() {
  return { filesDeleted: 0, bytesFreed: 0, sourcesReset: 0, refusals: 0 };
}

const DEVELOPER: SourceConfig = {
  id: "developer",
  docType: ["developer"],
  active: true,
  versions: [{ version: "6.7", main: "https://github.com/shopware/docs/tree/v6.7", active: true }],
  wikiDir: "platform/dev",
  exclude: [],
};

function baseConfig(sources: SourceConfig[]): PlatformConfig {
  return {
    layer: "platform",
    sources,
    rateLimits: { githubApiPerHour: 1, developerDocsPerSecond: 1, merchantDocsPerSecond: 1, requestTimeoutMs: 1000, maxRedirects: 1, maxBodyBytesDefault: 1, maxBodyBytesBulk: 1 },
    allowlistHosts: [],
    hubs: [],
    synonyms: { enabled: true },
    ingest: { waveSize: 1, batchSize: 1 },
    articleTokens: { min: 1, max: 1, longMax: 1, longSourceWordThreshold: 1, bandTolerance: 1 },
    sizeLimits: { pageMaxBytes: 1, hubMaxBytes: 1, synonymsMaxBytes: 1, generatedFileMaxBytes: 1, committedFileMaxBytes: 1, wikiPackageMaxBytes: 1, guidelineFileMaxBytes: 1, guidelinePairMaxBytes: 1 },
    eval: { hitAt2CallsGate: 1 },
  };
}

function baseState(): IngestionState {
  return {
    sources: {
      "developer:6.7": { headSha: "abc", lastSync: null, pages: { "platform/dev/6.7/foo.md": { hash: "a", date: 0 } } },
    },
    hubs: { "some-hub": { slug: "some-hub", memberPaths: ["platform/dev/6.7/foo.md"], hubState: "ok" } },
    synonyms: { concepts: { foo: { keywords: ["bar"], paths: ["platform/dev/6.7/foo.md"] } }, synonymsPromptHash: null },
    guidelines: { files: { "6.7/architecture-guidelines.md": { version: "6.7", file: "architecture-guidelines.md", guidelineState: "ok" } } },
    prompts: { pagePromptHash: "x", hubPromptHash: "x", synonymsPromptHash: "x" },
    build: { lastBuilt: "2026-01-01" },
  };
}

test("cleanCacheScope: dry run leaves .cache/{work,out,src,code} untouched; --yes clears them but recreates empty dirs", () => {
  const layerDir = tmpDir("kb-clean-cache-");
  try {
    const dirs = cacheDirs(layerDir);
    mkdirSync(resolve(dirs.workDir, "pages"), { recursive: true });
    writeFileSync(resolve(dirs.workDir, "pages", "batch-01.json"), "[]");
    mkdirSync(resolve(dirs.srcDir, "developer"), { recursive: true });
    writeFileSync(resolve(dirs.srcDir, "developer", "abc.txt"), "text");
    mkdirSync(resolve(dirs.root, "code", "6.6"), { recursive: true });
    writeFileSync(resolve(dirs.root, "code", "6.6", ".tag"), "v6.6.10.0\n");

    const dryTotals = totals();
    cleanCacheScope(dirs, "all", false, dryTotals);
    assert.equal(existsSync(resolve(dirs.root, "code", "6.6", ".tag")), true, "dry run must not delete");
    assert.ok(dryTotals.filesDeleted > 0);

    const mutTotals = totals();
    cleanCacheScope(dirs, "all", true, mutTotals);
    assert.equal(existsSync(resolve(dirs.workDir, "pages")), false);
    assert.equal(existsSync(dirs.workDir), true, "recreated empty");
    assert.equal(existsSync(resolve(dirs.root, "code")), true, "recreated empty");
    assert.deepEqual(readdirSync(resolve(dirs.root, "code")), []);
  } finally {
    rmSync(layerDir, { recursive: true, force: true });
  }
});

test("cleanStateScope: resets a source's SourceState; --source all resets guidelines too", () => {
  const config = baseConfig([DEVELOPER]);

  const dryState = baseState();
  cleanStateScope(config, dryState, ["developer"], true, false, totals());
  assert.notEqual(Object.keys(dryState.sources["developer:6.7"].pages).length, 0, "dry run must not mutate state");
  assert.notEqual(Object.keys(dryState.guidelines.files).length, 0, "dry run must not reset guidelines");

  const mutState = baseState();
  const mutTotals = totals();
  cleanStateScope(config, mutState, ["developer"], true, true, mutTotals);
  assert.deepEqual(mutState.sources["developer:6.7"].pages, {});
  assert.deepEqual(mutState.guidelines, { files: {} });
  assert.deepEqual(mutState.hubs, {});
  assert.deepEqual(mutState.synonyms, { concepts: {}, synonymsPromptHash: null });
  assert.equal(mutTotals.sourcesReset, 1);
});

test("cleanStateScope: a single non-'all' --source never resets the global guidelines/hubs/synonyms state", () => {
  const config = baseConfig([DEVELOPER]);
  const state = baseState();
  cleanStateScope(config, state, ["developer"], false, true, totals());
  assert.deepEqual(state.sources["developer:6.7"].pages, {});
  assert.notEqual(Object.keys(state.guidelines.files).length, 0, "guidelines untouched for a scoped source");
});

function writeWikiFixture(wikiRoot: string): void {
  mkdirSync(resolve(wikiRoot, "platform/dev/6.7"), { recursive: true });
  writeFileSync(resolve(wikiRoot, "platform/dev/6.7/index.md"), "index");
  writeFileSync(resolve(wikiRoot, "platform/dev/6.7/foo.md"), "foo");
  mkdirSync(resolve(wikiRoot, "platform/hubs"), { recursive: true });
  writeFileSync(resolve(wikiRoot, "platform/hubs/index.md"), "index");
  writeFileSync(resolve(wikiRoot, "platform/hubs/some-hub.md"), "hub");
  writeFileSync(resolve(wikiRoot, "platform/index.md"), "protocol");
  writeFileSync(resolve(wikiRoot, "README.md"), "readme");
  writeFileSync(resolve(wikiRoot, "composer.json"), "{}");
  mkdirSync(resolve(wikiRoot, "project"), { recursive: true });
  writeFileSync(resolve(wikiRoot, "project/foo.md"), "project");
  mkdirSync(resolve(wikiRoot, "marketplace"), { recursive: true });
  writeFileSync(resolve(wikiRoot, "marketplace/foo.md"), "marketplace");
}

test("cleanWikiScope: globs platform/hubs/*.md (not state.hubs) — deletes hub files even when state.hubs is already {}", () => {
  const wikiRoot = tmpDir("kb-clean-wiki-hubs-");
  try {
    writeWikiFixture(wikiRoot);
    const config = baseConfig([DEVELOPER]);
    // Simulate the state scope having already run first in the same invocation.
    const mutTotals = totals();
    cleanWikiScope(config, wikiRoot, "all", ["developer"], true, mutTotals);
    assert.equal(existsSync(resolve(wikiRoot, "platform/hubs/some-hub.md")), false);
    assert.equal(existsSync(resolve(wikiRoot, "platform/hubs/index.md")), true, "hubs/index.md preserved");
    assert.equal(existsSync(resolve(wikiRoot, "platform/dev/6.7/foo.md")), false);
    assert.equal(existsSync(resolve(wikiRoot, "platform/dev/6.7/index.md")), true);
    assert.equal(existsSync(resolve(wikiRoot, "platform/index.md")), true, "protocol file preserved");
    assert.equal(existsSync(resolve(wikiRoot, "README.md")), true);
    assert.equal(existsSync(resolve(wikiRoot, "composer.json")), true);
    assert.equal(existsSync(resolve(wikiRoot, "project/foo.md")), true);
    assert.equal(existsSync(resolve(wikiRoot, "marketplace/foo.md")), true);
  } finally {
    rmSync(wikiRoot, { recursive: true, force: true });
  }
});

test("cleanWikiScope: deletes platform/synonyms.md (single-file form)", () => {
  const wikiRoot = tmpDir("kb-clean-wiki-syn-single-");
  try {
    writeWikiFixture(wikiRoot);
    writeFileSync(resolve(wikiRoot, "platform/synonyms.md"), "# Synonyms\n");
    const config = baseConfig([DEVELOPER]);

    const dryTotals = totals();
    cleanWikiScope(config, wikiRoot, "all", ["developer"], false, dryTotals);
    assert.equal(existsSync(resolve(wikiRoot, "platform/synonyms.md")), true, "dry run lists but does not delete");
    assert.ok(dryTotals.filesDeleted > 0);

    cleanWikiScope(config, wikiRoot, "all", ["developer"], true, totals());
    assert.equal(existsSync(resolve(wikiRoot, "platform/synonyms.md")), false);
  } finally {
    rmSync(wikiRoot, { recursive: true, force: true });
  }
});

test("cleanWikiScope: deletes platform/synonyms/ (split-file form), including the directory itself", () => {
  const wikiRoot = tmpDir("kb-clean-wiki-syn-dir-");
  try {
    writeWikiFixture(wikiRoot);
    mkdirSync(resolve(wikiRoot, "platform/synonyms"), { recursive: true });
    writeFileSync(resolve(wikiRoot, "platform/synonyms/index.md"), "# Synonyms (split)\n");
    writeFileSync(resolve(wikiRoot, "platform/synonyms/part-1.md"), "foo — bar — platform/dev/6.7/foo.md\n");
    const config = baseConfig([DEVELOPER]);

    cleanWikiScope(config, wikiRoot, "all", ["developer"], true, totals());
    assert.equal(existsSync(resolve(wikiRoot, "platform/synonyms")), false, "the directory itself is removed");
  } finally {
    rmSync(wikiRoot, { recursive: true, force: true });
  }
});

test("cleanWikiScope: guideline files are deleted and emptied per-version directories (plus platform/guidelines/ itself) are removed, so lint never sees a stale empty directory as 'built'", () => {
  const wikiRoot = tmpDir("kb-clean-wiki-guidelines-");
  try {
    writeWikiFixture(wikiRoot);
    mkdirSync(resolve(wikiRoot, "platform/guidelines/6.7"), { recursive: true });
    mkdirSync(resolve(wikiRoot, "platform/guidelines/6.6"), { recursive: true });
    writeFileSync(resolve(wikiRoot, "platform/guidelines/6.7/code-guidelines.md"), "---\nid: x\n---\nbody\n");
    writeFileSync(resolve(wikiRoot, "platform/guidelines/6.6/code-guidelines.md"), "---\nid: x\n---\nbody\n");
    const config = baseConfig([DEVELOPER]);

    cleanWikiScope(config, wikiRoot, "all", ["developer"], true, totals());
    assert.equal(existsSync(resolve(wikiRoot, "platform/guidelines/6.7/code-guidelines.md")), false);
    assert.equal(existsSync(resolve(wikiRoot, "platform/guidelines/6.7")), false, "the emptied per-version directory is removed");
    assert.equal(existsSync(resolve(wikiRoot, "platform/guidelines")), false, "platform/guidelines/ itself is removed once empty");
  } finally {
    rmSync(wikiRoot, { recursive: true, force: true });
  }
});

test("cleanWikiScope: a leftover non-empty platform/guidelines/<v>/ directory (e.g. an unrelated file) is left in place", () => {
  const wikiRoot = tmpDir("kb-clean-wiki-guidelines-nonempty-");
  try {
    writeWikiFixture(wikiRoot);
    mkdirSync(resolve(wikiRoot, "platform/guidelines/6.7"), { recursive: true });
    writeFileSync(resolve(wikiRoot, "platform/guidelines/6.7/code-guidelines.md"), "---\nid: x\n---\nbody\n");
    writeFileSync(resolve(wikiRoot, "platform/guidelines/6.7/index.md"), "# not deleted (excluded like every other per-source index.md)\n");
    const config = baseConfig([DEVELOPER]);

    cleanWikiScope(config, wikiRoot, "all", ["developer"], true, totals());
    assert.equal(existsSync(resolve(wikiRoot, "platform/guidelines/6.7/code-guidelines.md")), false);
    assert.equal(existsSync(resolve(wikiRoot, "platform/guidelines/6.7/index.md")), true, "index.md is excluded from the explicit guidelines deletion, same as hubs/synonyms");
    assert.equal(existsSync(resolve(wikiRoot, "platform/guidelines/6.7")), true, "not empty, so left in place");
  } finally {
    rmSync(wikiRoot, { recursive: true, force: true });
  }
});

test("cleanWikiScope: a single non-'all' --source only wipes that source's own wikiDir, never hubs/synonyms", () => {
  const wikiRoot = tmpDir("kb-clean-wiki-scoped-");
  try {
    writeWikiFixture(wikiRoot);
    writeFileSync(resolve(wikiRoot, "platform/synonyms.md"), "# Synonyms\n");
    const config = baseConfig([DEVELOPER]);
    cleanWikiScope(config, wikiRoot, "developer", ["developer"], true, totals());
    assert.equal(existsSync(resolve(wikiRoot, "platform/dev/6.7/foo.md")), false);
    assert.equal(existsSync(resolve(wikiRoot, "platform/hubs/some-hub.md")), true, "hubs untouched for a scoped source");
    assert.equal(existsSync(resolve(wikiRoot, "platform/synonyms.md")), true, "synonyms untouched for a scoped source");
  } finally {
    rmSync(wikiRoot, { recursive: true, force: true });
  }
});
