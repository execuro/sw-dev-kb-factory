/** Three sync-side correctness fixes (packaging blockers):
 *  A) a cache-only miss must not drop codeHash/sharedFrom/revisions off the rebuilt state entry.
 *  B) a non-2xx developer-page fetch must never be cached as page content.
 *  C) an edited `exclude` list must invalidate the unchanged-HEAD fast path immediately.
 *  No real network: `fetch` is mocked per test. */
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, rmSync } from "node:fs";
import { syncDeveloperSource } from "../ingest/platform/sync.js";
import type { FetchLimits } from "../ingest/shared/fetchLimited.js";
import { cacheFilePath, HostRateLimiter } from "../ingest/shared/fetchLimited.js";
import { cacheDirs } from "../ingest/shared/workitems.js";
import type { PlatformConfig, SourceConfig, SourceState, VersionEntry } from "../ingest/shared/types.js";
import { tmpDir } from "./helpers.js";

const LIMITS: FetchLimits = { allowlistHosts: ["api.github.com", "raw.githubusercontent.com"], timeoutMs: 5000, maxRedirects: 3, maxBodyBytes: 5_000_000 };

function newLimiter(): HostRateLimiter {
  return new HostRateLimiter({ "api.github.com": 100, "raw.githubusercontent.com": 100 }, 100);
}

function baseSource(exclude: string[] = []): SourceConfig {
  return { id: "developer", docType: ["developer"], active: true, wikiDir: "platform/dev", exclude };
}

const VERSION: VersionEntry = { version: "6.7", main: "https://github.com/shopware/docs/tree/v6.7", active: true };

test("syncDeveloperSource: a cache-only miss carries codeHash/sharedFrom/revisions forward instead of dropping them", async (t) => {
  const layerDir = tmpDir("kb-sync-carry-");
  try {
    const dirs = cacheDirs(layerDir);
    const headSha = "head-sha-carry";
    const wikiPath = "platform/dev/6.7/foo.md";
    const pageHash = "page-hash-1";

    t.mock.method(globalThis, "fetch", async (url: string | URL) => {
      const u = String(url);
      if (u.includes("/git/refs/heads/")) return new Response(JSON.stringify({ object: { sha: headSha } }), { status: 200, headers: { "content-type": "application/json" } });
      if (u.includes("/git/trees/")) return new Response(JSON.stringify({ tree: [{ path: "foo.md", type: "blob", sha: pageHash }] }), { status: 200, headers: { "content-type": "application/json" } });
      if (u.startsWith("https://raw.githubusercontent.com/")) return new Response("# Foo\n\ncontent\n", { status: 200, headers: { "content-type": "text/plain" } });
      throw new Error(`unexpected fetch in this test: ${u}`);
    });

    const sourceState: SourceState = {
      // A different headSha than the mocked API returns forces the full reconcile path
      // regardless of configHash, isolating this test from Fix C's fast-path change.
      headSha: "some-older-sha",
      lastSync: null,
      pages: {
        [wikiPath]: {
          hash: pageHash,
          builtHash: pageHash,
          promptHash: "prompt-1",
          codeHash: "6.6.0.0+deadbeef",
          sharedFrom: "platform/dev/6.6/foo.md",
          date: 0,
        },
      },
    };
    const state = { sources: { "developer:6.7": sourceState } };

    const summary = await syncDeveloperSource(
      "developer:6.7",
      baseSource(),
      VERSION,
      {} as PlatformConfig,
      undefined,
      false,
      state,
      dirs,
      newLimiter(),
      LIMITS,
      { tree: new Map(), headSha: new Map() },
      async () => new Set<string>(),
    );

    const entry = state.sources["developer:6.7"].pages[wikiPath];
    assert.equal(entry.codeHash, "6.6.0.0+deadbeef", "codeHash must survive a cache-only miss");
    assert.equal(entry.sharedFrom, "platform/dev/6.6/foo.md", "sharedFrom must survive a cache-only miss");
    assert.equal(entry.builtHash, pageHash, "builtHash unchanged — page stays built");
    assert.equal(summary.unchanged, 1);
  } finally {
    rmSync(layerDir, { recursive: true, force: true });
  }
});

test("syncDeveloperSource: a non-2xx developer-page fetch (429) records fetchError and never writes a cache file", async (t) => {
  const layerDir = tmpDir("kb-sync-429-");
  try {
    const dirs = cacheDirs(layerDir);
    const headSha = "head-sha-429";
    const wikiPath = "platform/dev/6.7/foo.md";
    const newSha = "new-sha";

    t.mock.method(globalThis, "fetch", async (url: string | URL) => {
      const u = String(url);
      if (u.includes("/git/refs/heads/")) return new Response(JSON.stringify({ object: { sha: headSha } }), { status: 200, headers: { "content-type": "application/json" } });
      if (u.includes("/git/trees/")) return new Response(JSON.stringify({ tree: [{ path: "foo.md", type: "blob", sha: newSha }] }), { status: 200, headers: { "content-type": "application/json" } });
      if (u.startsWith("https://raw.githubusercontent.com/")) return new Response("rate limited", { status: 429, headers: { "content-type": "text/plain" } });
      throw new Error(`unexpected fetch in this test: ${u}`);
    });

    const sourceState: SourceState = { headSha: "old-sha", lastSync: null, pages: {} };
    const state = { sources: { "developer:6.7": sourceState } };

    const srcDir = `${dirs.srcDir}/developer/6.7`;
    await syncDeveloperSource(
      "developer:6.7",
      baseSource(),
      VERSION,
      {} as PlatformConfig,
      undefined,
      false,
      state,
      dirs,
      newLimiter(),
      LIMITS,
      { tree: new Map(), headSha: new Map() },
      async () => new Set<string>(),
    );

    const entry = state.sources["developer:6.7"].pages[wikiPath];
    assert.ok(entry.fetchError?.includes("429"), `expected fetchError to mention 429, got ${entry.fetchError}`);
    assert.equal(entry.builtHash, undefined, "never built — nothing to keep unchanged");
    assert.equal(existsSync(cacheFilePath(srcDir, newSha)), false, "a failed fetch must never write a cache file");
  } finally {
    rmSync(layerDir, { recursive: true, force: true });
  }
});

test("syncDeveloperSource: a non-2xx developer-page fetch (500) on an already-built page leaves builtHash/cache untouched", async (t) => {
  const layerDir = tmpDir("kb-sync-500-");
  try {
    const dirs = cacheDirs(layerDir);
    const headSha = "head-sha-500";
    const wikiPath = "platform/dev/6.7/foo.md";
    const oldHash = "old-hash";
    const newHash = "new-hash";

    t.mock.method(globalThis, "fetch", async (url: string | URL) => {
      const u = String(url);
      if (u.includes("/git/refs/heads/")) return new Response(JSON.stringify({ object: { sha: headSha } }), { status: 200, headers: { "content-type": "application/json" } });
      if (u.includes("/git/trees/")) return new Response(JSON.stringify({ tree: [{ path: "foo.md", type: "blob", sha: newHash }] }), { status: 200, headers: { "content-type": "application/json" } });
      if (u.startsWith("https://raw.githubusercontent.com/")) return new Response("<html>server error</html>", { status: 500, headers: { "content-type": "text/html" } });
      throw new Error(`unexpected fetch in this test: ${u}`);
    });

    const sourceState: SourceState = {
      headSha: "old-sha",
      lastSync: null,
      pages: { [wikiPath]: { hash: oldHash, builtHash: oldHash, promptHash: "p1", date: 0 } },
    };
    const state = { sources: { "developer:6.7": sourceState } };
    const srcDir = `${dirs.srcDir}/developer/6.7`;

    const summary = await syncDeveloperSource(
      "developer:6.7",
      baseSource(),
      VERSION,
      {} as PlatformConfig,
      undefined,
      false,
      state,
      dirs,
      newLimiter(),
      LIMITS,
      { tree: new Map(), headSha: new Map() },
      async () => new Set<string>(),
    );

    const entry = state.sources["developer:6.7"].pages[wikiPath];
    assert.ok(entry.fetchError?.includes("500"));
    assert.equal(entry.builtHash, oldHash, "builtHash carried forward — retried next run, no half-written article");
    assert.equal(existsSync(cacheFilePath(srcDir, newHash)), false, "a failed fetch must never write a cache file");
    assert.equal(summary.changed, 1);
  } finally {
    rmSync(layerDir, { recursive: true, force: true });
  }
});

test("syncDeveloperSource: editing exclude invalidates the unchanged-HEAD fast path without waiting for a new commit", async (t) => {
  const layerDir = tmpDir("kb-sync-configHash-");
  try {
    const dirs = cacheDirs(layerDir);
    const headSha = "head-sha-stable";

    t.mock.method(globalThis, "fetch", async (url: string | URL) => {
      const u = String(url);
      if (u.includes("/git/refs/heads/")) return new Response(JSON.stringify({ object: { sha: headSha } }), { status: 200, headers: { "content-type": "application/json" } });
      if (u.includes("/git/trees/")) return new Response(JSON.stringify({ tree: [{ path: "foo.md", type: "blob", sha: "sha-1" }] }), { status: 200, headers: { "content-type": "application/json" } });
      if (u.startsWith("https://raw.githubusercontent.com/")) return new Response("# Foo\n\ncontent\n", { status: 200, headers: { "content-type": "text/plain" } });
      throw new Error(`unexpected fetch in this test: ${u}`);
    });

    const state = { sources: {} as Record<string, SourceState> };
    const repoCache = { tree: new Map(), headSha: new Map() };

    // Run 1: exclude is empty, foo.md is ingested and headSha/configHash are stamped.
    const run1 = await syncDeveloperSource(
      "developer:6.7",
      baseSource([]),
      VERSION,
      {} as PlatformConfig,
      undefined,
      false,
      state,
      dirs,
      newLimiter(),
      LIMITS,
      repoCache,
      async () => new Set<string>(),
    );
    assert.equal(run1.new, 1);
    assert.ok(state.sources["developer:6.7"].pages["platform/dev/6.7/foo.md"]);
    assert.equal(state.sources["developer:6.7"].headSha, headSha);

    // Run 2: same HEAD, but foo.md is now excluded — the fast path must not short-circuit
    // this into "0 changes" just because headSha is unchanged.
    const run2 = await syncDeveloperSource(
      "developer:6.7",
      baseSource(["**/foo.md"]),
      VERSION,
      {} as PlatformConfig,
      undefined,
      false,
      state,
      dirs,
      newLimiter(),
      LIMITS,
      repoCache,
      async () => new Set<string>(),
    );
    assert.equal(run2.removed, 1, "the newly-excluded page must be dropped from state this run, not on the next upstream commit");
    assert.equal(state.sources["developer:6.7"].pages["platform/dev/6.7/foo.md"], undefined);
  } finally {
    rmSync(layerDir, { recursive: true, force: true });
  }
});
