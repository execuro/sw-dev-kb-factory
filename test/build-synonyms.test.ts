/** Build and lint handle both synonyms forms — `synonymsFilesToScan`/
 *  `countSynonymsLines` against a temp `platform/` root, both the single-file and the
 *  split-directory form. Mirrors `lint.ts`'s `lintSynonyms`, which already handles both. */
import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { countSynonymsLines, synonymsFilesToScan } from "../ingest/platform/build.js";
import { tmpDir } from "./helpers.js";

const HEADER = ["# Synonyms", "", "Grep-able alias file: `canonical term — synonyms, aliases, German UI terms, class/route/config names — paths`.", "Fallback only — try the directory `index.md` and page keywords first (design spec, \"Synonyms\").", ""];

test("synonymsFilesToScan / countSynonymsLines: single-file form", () => {
  const wikiRoot = tmpDir("kb-build-synonyms-single-");
  try {
    const platformRoot = resolve(wikiRoot, "platform");
    mkdirSync(platformRoot, { recursive: true });
    const lines = [...HEADER, "cart — Warenkorb, basket — platform/dev/6.7/cart.md", "dal — data abstraction layer — platform/dev/6.7/dal.md", ""];
    writeFileSync(resolve(platformRoot, "synonyms.md"), lines.join("\n"));

    const files = synonymsFilesToScan(platformRoot);
    assert.equal(files.length, 1);
    assert.equal(files[0].path, "platform/synonyms.md");
    assert.match(files[0].markdown, /cart — Warenkorb/);

    assert.equal(countSynonymsLines(platformRoot), 2);
  } finally {
    rmSync(wikiRoot, { recursive: true, force: true });
  }
});

test("synonymsFilesToScan / countSynonymsLines: split-directory form (index.md + part-*.md), index.md excluded from the line count", () => {
  const wikiRoot = tmpDir("kb-build-synonyms-split-");
  try {
    const platformRoot = resolve(wikiRoot, "platform");
    const synonymsDir = resolve(platformRoot, "synonyms");
    mkdirSync(synonymsDir, { recursive: true });
    writeFileSync(resolve(synonymsDir, "index.md"), ["# Synonyms (split)", "", "platform/synonyms/part-1.md — cart … dal", ""].join("\n"));
    writeFileSync(resolve(synonymsDir, "part-1.md"), [...HEADER, "cart — Warenkorb, basket — platform/dev/6.7/cart.md", "dal — data abstraction layer — platform/dev/6.7/dal.md", ""].join("\n"));
    writeFileSync(resolve(synonymsDir, "part-2.md"), [...HEADER, "flow — flow builder — platform/dev/6.7/flow.md", ""].join("\n"));

    const files = synonymsFilesToScan(platformRoot);
    assert.deepEqual(
      files.map((f) => f.path).sort(),
      ["platform/synonyms/index.md", "platform/synonyms/part-1.md", "platform/synonyms/part-2.md"],
    );

    assert.equal(countSynonymsLines(platformRoot), 3, "index.md's own line does not count as synonym data");
  } finally {
    rmSync(wikiRoot, { recursive: true, force: true });
  }
});

test("synonymsFilesToScan / countSynonymsLines: neither form present yields empty/0, not a crash", () => {
  const wikiRoot = tmpDir("kb-build-synonyms-none-");
  try {
    const platformRoot = resolve(wikiRoot, "platform");
    mkdirSync(platformRoot, { recursive: true });
    assert.deepEqual(synonymsFilesToScan(platformRoot), []);
    assert.equal(countSynonymsLines(platformRoot), 0);
  } finally {
    rmSync(wikiRoot, { recursive: true, force: true });
  }
});
