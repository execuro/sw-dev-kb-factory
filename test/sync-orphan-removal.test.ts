/** Corpus-composition fixes: a page removed upstream (or newly excluded) only drops its
 *  state entry at sync time; nothing else notices the stale article on disk otherwise.
 *  `pruneOrphanArticles` (build.ts) deletes it and prunes the emptied directory;
 *  `lintOrphanWikiFiles` (lint.ts) is the backstop for anything that slips past that.
 *
 *  Deletion (and the ERROR/WARNING split) must key on "has a state entry at all"
 *  (`statePaths`, see `collectStatePaths` in build.ts), never on `builtHash` alone: a known,
 *  deferred race between two concurrent `--ingest` runs (pages.ts:58/270 load-all + save-all,
 *  no lock) can clear a good page's `builtHash` without the article on disk ever having been
 *  wrong. */
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { pruneOrphanArticles } from "../ingest/platform/build.js";
import { lintOrphanWikiFiles } from "../ingest/platform/lint.js";
import { emptyReport, tmpDir } from "./helpers.js";

test("pruneOrphanArticles: deletes an article with no state entry at all and prunes the emptied directory", () => {
  const wikiRoot = tmpDir("kb-prune-");
  try {
    mkdirSync(resolve(wikiRoot, "platform/dev/6.7/removed-topic"), { recursive: true });
    writeFileSync(resolve(wikiRoot, "platform/dev/6.7/removed-topic/gone.md"), "# Gone\n");
    writeFileSync(resolve(wikiRoot, "platform/dev/6.7/index.md"), "# Index\n"); // build-generated, never a knownPaths/statePaths entry
    writeFileSync(resolve(wikiRoot, "platform/dev/6.7/kept.md"), "# Kept\n");

    const knownPaths = new Set(["platform/dev/6.7/kept.md"]);
    const result = pruneOrphanArticles(wikiRoot, knownPaths, new Set());

    assert.deepEqual(result.removed, ["platform/dev/6.7/removed-topic/gone.md"]);
    assert.equal(existsSync(resolve(wikiRoot, "platform/dev/6.7/removed-topic/gone.md")), false);
    assert.equal(existsSync(resolve(wikiRoot, "platform/dev/6.7/removed-topic")), false, "the emptied directory must be pruned too");
    assert.equal(existsSync(resolve(wikiRoot, "platform/dev/6.7/kept.md")), true, "a still-known article must survive");
    assert.equal(existsSync(resolve(wikiRoot, "platform/dev/6.7/index.md")), true, "the generated index.md is never treated as an orphan");
  } finally {
    rmSync(wikiRoot, { recursive: true, force: true });
  }
});

test("pruneOrphanArticles: a func-source article with no state entry is removed too", () => {
  const wikiRoot = tmpDir("kb-prune-func-");
  try {
    mkdirSync(resolve(wikiRoot, "platform/func"), { recursive: true });
    writeFileSync(resolve(wikiRoot, "platform/func/old-page.md"), "# Old\n");
    const result = pruneOrphanArticles(wikiRoot, new Set(), new Set());
    assert.deepEqual(result.removed, ["platform/func/old-page.md"]);
  } finally {
    rmSync(wikiRoot, { recursive: true, force: true });
  }
});

test("pruneOrphanArticles: an article whose state entry exists but has no builtHash survives (not knownPaths, but statePaths)", () => {
  const wikiRoot = tmpDir("kb-prune-nobuilthash-");
  try {
    mkdirSync(resolve(wikiRoot, "platform/dev/6.7"), { recursive: true });
    writeFileSync(resolve(wikiRoot, "platform/dev/6.7/pending.md"), "# Pending\n");
    // Simulates the concurrent-run race: the entry exists in state (statePaths) but never
    // made it into knownPaths because builtHash is currently undefined.
    const result = pruneOrphanArticles(wikiRoot, new Set(), new Set(["platform/dev/6.7/pending.md"]));
    assert.deepEqual(result.removed, []);
    assert.equal(existsSync(resolve(wikiRoot, "platform/dev/6.7/pending.md")), true, "an article with a state entry must never be deleted, builtHash or not");
  } finally {
    rmSync(wikiRoot, { recursive: true, force: true });
  }
});

test("pruneOrphanArticles: a failed page's previous article survives (state entry present)", () => {
  const wikiRoot = tmpDir("kb-prune-failed-");
  try {
    mkdirSync(resolve(wikiRoot, "platform/dev/6.7"), { recursive: true });
    writeFileSync(resolve(wikiRoot, "platform/dev/6.7/flaky.md"), "# Flaky\n");
    // The previous successful build's builtHash still stands (knownPaths), even though the
    // most recent ingest attempt for this page failed.
    const result = pruneOrphanArticles(wikiRoot, new Set(["platform/dev/6.7/flaky.md"]), new Set(["platform/dev/6.7/flaky.md"]));
    assert.deepEqual(result.removed, []);
    assert.equal(existsSync(resolve(wikiRoot, "platform/dev/6.7/flaky.md")), true);
  } finally {
    rmSync(wikiRoot, { recursive: true, force: true });
  }
});

test("pruneOrphanArticles: a sharedFrom alias target is never deleted", () => {
  const wikiRoot = tmpDir("kb-prune-shared-");
  try {
    mkdirSync(resolve(wikiRoot, "platform/dev/6.6"), { recursive: true });
    writeFileSync(resolve(wikiRoot, "platform/dev/6.6/shared-topic.md"), "# Shared\n");
    // The 6.7 sibling's entry has sharedFrom: "platform/dev/6.6/shared-topic.md" — that
    // target path lands in statePaths via collectStatePaths, not knownPaths for 6.6 itself.
    const result = pruneOrphanArticles(wikiRoot, new Set(), new Set(["platform/dev/6.6/shared-topic.md"]));
    assert.deepEqual(result.removed, []);
    assert.equal(existsSync(resolve(wikiRoot, "platform/dev/6.6/shared-topic.md")), true);
  } finally {
    rmSync(wikiRoot, { recursive: true, force: true });
  }
});

test("lintOrphanWikiFiles: a wiki file with no ingestion state entry at all is a lint ERROR", () => {
  const wikiRoot = tmpDir("kb-lint-orphan-");
  try {
    mkdirSync(resolve(wikiRoot, "platform/dev/6.7"), { recursive: true });
    writeFileSync(resolve(wikiRoot, "platform/dev/6.7/orphan.md"), "# Orphan\n");
    const report = emptyReport();
    lintOrphanWikiFiles(wikiRoot, new Set(), new Set(), report);
    assert.ok(report.errors.some((e) => e.includes("orphan wiki file") && e.includes("platform/dev/6.7/orphan.md")));
    assert.equal(report.warnings.length, 0);
  } finally {
    rmSync(wikiRoot, { recursive: true, force: true });
  }
});

test("lintOrphanWikiFiles: a page in knownPaths (including a shared article's physical path) is not flagged", () => {
  const wikiRoot = tmpDir("kb-lint-orphan-known-");
  try {
    mkdirSync(resolve(wikiRoot, "platform/dev/6.7"), { recursive: true });
    writeFileSync(resolve(wikiRoot, "platform/dev/6.7/shared.md"), "# Shared\n");
    const report = emptyReport();
    lintOrphanWikiFiles(wikiRoot, new Set(["platform/dev/6.7/shared.md"]), new Set(), report);
    assert.equal(report.errors.length, 0);
    assert.equal(report.warnings.length, 0);
  } finally {
    rmSync(wikiRoot, { recursive: true, force: true });
  }
});

test("lintOrphanWikiFiles: an entry present without builtHash is a WARNING, not an error", () => {
  const wikiRoot = tmpDir("kb-lint-orphan-nobuilthash-");
  try {
    mkdirSync(resolve(wikiRoot, "platform/dev/6.7"), { recursive: true });
    writeFileSync(resolve(wikiRoot, "platform/dev/6.7/pending.md"), "# Pending\n");
    const report = emptyReport();
    lintOrphanWikiFiles(wikiRoot, new Set(), new Set(["platform/dev/6.7/pending.md"]), report);
    assert.equal(report.errors.length, 0);
    assert.ok(report.warnings.some((w) => w.includes("never built") && w.includes("platform/dev/6.7/pending.md")));
  } finally {
    rmSync(wikiRoot, { recursive: true, force: true });
  }
});

test("lintOrphanWikiFiles: the generated index.md is never flagged even though it has no state entry", () => {
  const wikiRoot = tmpDir("kb-lint-orphan-index-");
  try {
    mkdirSync(resolve(wikiRoot, "platform/dev/6.7"), { recursive: true });
    writeFileSync(resolve(wikiRoot, "platform/dev/6.7/index.md"), "# Index\n");
    const report = emptyReport();
    lintOrphanWikiFiles(wikiRoot, new Set(), new Set(), report);
    assert.equal(report.errors.length, 0);
    assert.equal(report.warnings.length, 0);
  } finally {
    rmSync(wikiRoot, { recursive: true, force: true });
  }
});
