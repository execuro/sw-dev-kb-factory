/**
 * `wiki:guidelines --restamp-code-hash` (Fix 3, mirroring `restamp-code-hash.test.ts`'s
 * `restampPages` coverage for `pages.ts`).
 *
 * `codeVersion` is `${coreVersion}+${vendorHash[0:8]}`, same shape as pages.ts's `codeHash`, and
 * the two code-root modes derive `vendorHash` differently — an installed `vendor/` hashes
 * composer's `installed.json`, a pinned checkout content-hashes the source tree. Moving a version
 * between modes therefore changes the hash for every curated guideline file although not one
 * identifier moved, and the guideline dirty-check would queue the whole set for an LLM re-ingest.
 * Keyed per `version` (not one global hash) because `resolveGuidelineCodeContext` resolves a code
 * root per curated file's version, and 6.6/6.7 can move independently.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { restampGuidelines } from "../ingest/platform/guidelines.js";
import type { IngestionState, GuidelineStateEntry } from "../ingest/shared/types.js";

function state(entries: Record<string, Partial<GuidelineStateEntry> & { version: string }>): IngestionState {
  return { guidelines: { files: entries as Record<string, GuidelineStateEntry> } } as unknown as IngestionState;
}

test("restamps guideline files whose vendorHash moved but whose coreVersion did not", () => {
  const s = state({
    a: { version: "6.7", codeVersion: "6.7.13.0+aaaaaaaa" },
    b: { version: "6.7", codeVersion: "6.7.13.0+aaaaaaaa" },
    c: { version: "6.7", codeVersion: "6.7.13.0+newhash1" },
  });
  const r = restampGuidelines(s, { "6.7": "6.7.13.0+newhash1" });
  assert.equal(r.restamped, 2, "only the two that differed");
  assert.equal(r.refused, 0);
  for (const k of ["a", "b", "c"]) assert.equal(s.guidelines.files[k].codeVersion, "6.7.13.0+newhash1");
});

test("refuses guideline files whose coreVersion actually changed", () => {
  // A real Shopware version bump must go through the normal re-check. Stamping over it would
  // claim a file was verified against code it has never been compared with.
  const s = state({
    old: { version: "6.7", codeVersion: "6.6.10.24+aaaaaaaa" },
    current: { version: "6.7", codeVersion: "6.7.13.0+aaaaaaaa" },
  });
  const r = restampGuidelines(s, { "6.7": "6.7.13.0+bbbbbbbb" });
  assert.equal(r.restamped, 1, "the same-version file is still restamped");
  assert.equal(r.refused, 1);
  assert.equal(s.guidelines.files.old.codeVersion, "6.6.10.24+aaaaaaaa", "left untouched");
});

test("guideline files with no codeVersion are never given one", () => {
  const s = state({ plain: { version: "6.6" } });
  const r = restampGuidelines(s, { "6.6": "6.7.13.0+bbbbbbbb" });
  assert.equal(r.restamped, 0);
  assert.equal(s.guidelines.files.plain.codeVersion, undefined);
});

test("a version with no resolvable code root in codeVersionByVersion is left untouched", () => {
  const s = state({ a: { version: "6.6", codeVersion: "6.6.10.1+aaaaaaaa" } });
  const r = restampGuidelines(s, { "6.7": "6.7.13.0+bbbbbbbb" });
  assert.equal(r.restamped, 0);
  assert.equal(r.refused, 0);
  assert.equal(s.guidelines.files.a.codeVersion, "6.6.10.1+aaaaaaaa");
});
