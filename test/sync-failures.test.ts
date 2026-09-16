/** Work package S: `wiki:sync` failure-handling fix.
 *  A code-checkout `result.error` must abort the run (non-zero exit), not just print an
 *  error line and exit 0 — otherwise the `guidelines` phase silently skips the version.
 *  No real network/git: `fetch` is mocked per test. */
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, rmSync } from "node:fs";
import { syncCodeCheckout, syncDeveloperSource } from "../ingest/platform/sync.js";
import type { FetchLimits } from "../ingest/shared/fetchLimited.js";
import { cacheFilePath, HostRateLimiter } from "../ingest/shared/fetchLimited.js";
import { cacheDirs } from "../ingest/shared/workitems.js";
import type { PlatformConfig, SourceConfig, SourceState, VersionEntry } from "../ingest/shared/types.js";
import { tmpDir } from "./helpers.js";

const LIMITS: FetchLimits = { allowlistHosts: ["api.github.com", "raw.githubusercontent.com"], timeoutMs: 5000, maxRedirects: 3, maxBodyBytes: 5_000_000 };

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });
}

function newLimiter(): HostRateLimiter {
  return new HostRateLimiter({ "api.github.com": 100, "raw.githubusercontent.com": 100 }, 100);
}

test("syncCodeCheckout: a tag-listing success with no matching tag surfaces on result.error (not a thrown FetchAbortError) — this is what run()'s loop must now treat as an abort", async (t) => {
  t.mock.method(globalThis, "fetch", async (url: string | URL) => {
    if (String(url).includes("/tags")) return jsonResponse([{ name: "v6.7.0" }]);
    throw new Error(`unexpected fetch in this test: ${url}`);
  });

  const result = await syncCodeCheckout("6.6", { repo: "shopware/shopware", tagPattern: "v6.6.*" }, newLimiter(), LIMITS);
  assert.equal(result.skipped, true);
  // This is exactly the shape run()'s code-checkout loop reads: `if (result.error) hadAbort = true`
  // (sync.ts, ~line 149) — a non-empty `error` here must turn into a non-zero process exit code,
  // never a silently-green run.
  assert.match(result.error ?? "", /no tag matching v6\.6\.\* for shopware\/shopware/);
});

test("syncDeveloperSource: a built page (builtHash === hash) whose .cache/src/ file was lost gets re-fetched, cache restored, builtHash unchanged, counted as unchanged", async (t) => {
  const layerDir = tmpDir("kb-sync-developer-");
  try {
    const dirs = cacheDirs(layerDir);
    const headSha = "head-sha-1";
    const wikiPath = "platform/dev/6.7/foo.md";
    const pageHash = "abc123";

    t.mock.method(globalThis, "fetch", async (url: string | URL) => {
      const u = String(url);
      if (u.includes("/git/refs/heads/")) return new Response(JSON.stringify({ object: { sha: headSha } }), { status: 200, headers: { "content-type": "application/json" } });
      if (u.includes("/git/trees/")) {
        return new Response(JSON.stringify({ tree: [{ path: "foo.md", type: "blob", sha: pageHash }] }), { status: 200, headers: { "content-type": "application/json" } });
      }
      if (u.startsWith("https://raw.githubusercontent.com/")) {
        return new Response("# Foo\n\ncontent\n", { status: 200, headers: { "content-type": "text/plain" } });
      }
      throw new Error(`unexpected fetch in this test: ${u}`);
    });

    const source: SourceConfig = {
      id: "developer",
      docType: ["developer"],
      active: true,
      wikiDir: "platform/dev",
      exclude: [],
    };
    const version: VersionEntry = { version: "6.7", main: "https://github.com/shopware/docs/tree/v6.7", active: true };
    const sourceState: SourceState = {
      headSha,
      lastSync: null,
      pages: { [wikiPath]: { hash: pageHash, builtHash: pageHash, promptHash: "prompt-1", date: 0 } },
    };
    const state = { sources: { "developer:6.7": sourceState } };

    const srcDir = `${dirs.srcDir}/developer/6.7`;
    assert.equal(existsSync(cacheFilePath(srcDir, pageHash)), false, "precondition: cache file missing");

    const summary = await syncDeveloperSource(
      "developer:6.7",
      source,
      version,
      {} as PlatformConfig,
      undefined,
      false,
      state,
      dirs,
      new HostRateLimiter({ "api.github.com": 100, "raw.githubusercontent.com": 100 }, 100),
      LIMITS,
      { tree: new Map(), headSha: new Map() },
      async () => new Set<string>(),
    );

    assert.equal(existsSync(cacheFilePath(srcDir, pageHash)), true, "cache file restored");
    assert.equal(readFileSync(cacheFilePath(srcDir, pageHash), "utf8").trim(), "# Foo\n\ncontent".trim());
    assert.equal(state.sources["developer:6.7"].pages[wikiPath].builtHash, pageHash, "builtHash unchanged — page stays built");
    assert.equal(summary.unchanged, 1);
    assert.equal(summary.changed, 0);
    assert.ok(summary.fetched >= 1);
  } finally {
    rmSync(layerDir, { recursive: true, force: true });
  }
});
