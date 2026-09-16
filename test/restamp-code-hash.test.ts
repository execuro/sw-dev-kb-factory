/**
 * `wiki:pages --restamp-code-hash`.
 *
 * `codeHash` is `${coreVersion}+${vendorHash[0:8]}`, and the two code-root modes derive
 * `vendorHash` differently — an installed `vendor/` hashes composer's `installed.json`, a pinned
 * checkout content-hashes the source tree. Moving a version between modes therefore changes the hash
 * for every page although not one identifier moved, and `codeHashStale` would queue the whole corpus
 * for an LLM re-ingest. This makes that migration one command instead of days of tokens.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { restampPages } from "../ingest/platform/pages.js";

function state(entries: Record<string, string>) {
  return { sources: { "developer:6.7": { pages: Object.fromEntries(Object.entries(entries).map(([k, v]) => [k, { codeHash: v }])) } } };
}

test("restamps pages whose vendorHash moved but whose coreVersion did not", () => {
  const s = state({ a: "6.7.13.0+aaaaaaaa", b: "6.7.13.0+aaaaaaaa", c: "6.7.13.0+newhash1" });
  const r = restampPages(s as never, "6.7.13.0+newhash1");
  assert.equal(r.restamped, 2, "only the two that differed");
  assert.equal(r.refused, 0);
  for (const p of ["a", "b", "c"]) {
    assert.equal((s.sources["developer:6.7"].pages as Record<string, { codeHash: string }>)[p].codeHash, "6.7.13.0+newhash1");
  }
});

test("refuses pages whose coreVersion actually changed", () => {
  // A real Shopware version bump must go through the normal re-check. Stamping over it would claim
  // pages were verified against code they have never been compared with - the exact failure the
  // code check exists to prevent.
  const s = state({ old: "6.6.10.24+aaaaaaaa", current: "6.7.13.0+aaaaaaaa" });
  const r = restampPages(s as never, "6.7.13.0+bbbbbbbb");
  assert.equal(r.restamped, 1, "the same-version page is still restamped");
  assert.equal(r.refused, 1);
  assert.equal((s.sources["developer:6.7"].pages as Record<string, { codeHash: string }>).old.codeHash, "6.6.10.24+aaaaaaaa", "left untouched");
});

test("pages with no codeHash are never given one", () => {
  // Only code-checked pages carry a codeHash; inventing one would assert a check that never ran.
  const s = { sources: { "developer:6.6": { pages: { plain: {} } } } };
  const r = restampPages(s as never, "6.7.13.0+bbbbbbbb");
  assert.equal(r.restamped, 0);
  assert.equal((s.sources["developer:6.6"].pages as Record<string, { codeHash?: string }>).plain.codeHash, undefined);
});
