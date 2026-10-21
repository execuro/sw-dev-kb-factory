import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, mkdtempSync, mkdirSync, readdirSync, rmSync, writeFileSync, readFileSync, realpathSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { clusterConcepts, isSynonymDataLine, pruneSynonymsOutput, validateSynonymsBatch, writeSynonymsOutput, type Concept } from "../ingest/platform/synonyms.js";
import type { PlatformConfig, WorkItem } from "../ingest/shared/types.js";

function page(path: string, keywords: string[], title = path, summary = "") {
  return { path, title, summary, keywords };
}

// --------------------------------------------------------------------------------
// clusterConcepts: per-path title/summary now travel with the cluster
// --------------------------------------------------------------------------------

test("clusterConcepts: each concept carries its member pages' own title and summary, not just the bare path", () => {
  const pages = [page("platform/dev/6.7/a.md", ["promotion", "voucher"], "Promotions", "How promotions work")];
  const concepts = clusterConcepts(pages);
  assert.equal(concepts.length, 1);
  assert.deepEqual(concepts[0].pages, [{ path: "platform/dev/6.7/a.md", title: "Promotions", summary: "How promotions work" }]);
  assert.deepEqual(concepts[0].paths, ["platform/dev/6.7/a.md"]);
});

test("clusterConcepts: pages merged into one cluster each keep their own title/summary", () => {
  const pages = [
    page("platform/dev/6.7/a.md", ["promotion", "voucher", "discount"], "Promotions A", "Summary A"),
    page("platform/func/b.md", ["promotion", "voucher", "discount"], "Promotions B", "Summary B"),
  ];
  const concepts = clusterConcepts(pages);
  assert.equal(concepts.length, 1);
  assert.deepEqual(
    concepts[0].pages.map((p) => p.path),
    ["platform/dev/6.7/a.md", "platform/func/b.md"],
  );
  assert.deepEqual(concepts[0].pages.find((p) => p.path === "platform/func/b.md"), { path: "platform/func/b.md", title: "Promotions B", summary: "Summary B" });
});

// --------------------------------------------------------------------------------
// isSynonymDataLine (unchanged behaviour, sanity check the three-part format still parses)
// --------------------------------------------------------------------------------

test("isSynonymDataLine: a real data line is recognized, header/comment lines are not", () => {
  assert.equal(isSynonymDataLine("promotion — voucher, coupon — platform/func/a.md"), true);
  assert.equal(isSynonymDataLine("# Synonyms"), false);
  assert.equal(isSynonymDataLine(""), false);
});

// --------------------------------------------------------------------------------
// writeSynonymsOutput: duplicate canonical terms across batches merge (union of
// aliases/paths) instead of the later batch dropping the earlier line entirely.
// --------------------------------------------------------------------------------

const CONFIG = { sizeLimits: { synonymsMaxBytes: 1_000_000 } } as unknown as PlatformConfig;
const KNOWN = new Set(["platform/func/a.md", "platform/dev/6.7/b.md"]);

test("writeSynonymsOutput: two batches sharing a canonical term merge aliases and paths instead of the second dropping the first", () => {
  const wikiRoot = mkdtempSync(join(tmpdir(), "kb-synonyms-write-"));
  try {
    mkdirSync(resolve(wikiRoot, "platform"), { recursive: true });
    writeSynonymsOutput(wikiRoot, ["promotion — voucher, coupon — platform/func/a.md"], CONFIG, KNOWN);
    writeSynonymsOutput(wikiRoot, ["promotion — coupon, Gutschein — platform/dev/6.7/b.md"], CONFIG, KNOWN);

    const text = readFileSync(resolve(wikiRoot, "platform/synonyms.md"), "utf8");
    const line = text.split("\n").find((l) => l.startsWith("promotion —"));
    assert.ok(line, "merged canonical line must still be present");
    const [, aliasPart, pathsPart] = line!.split(" — ");
    assert.deepEqual(new Set(aliasPart.split(", ")), new Set(["voucher", "coupon", "Gutschein"]));
    assert.deepEqual(pathsPart.split(", ").sort(), ["platform/dev/6.7/b.md", "platform/func/a.md"]);
    assert.equal((text.match(/^promotion —/gm) ?? []).length, 1, "no duplicate canonical line");
  } finally {
    rmSync(wikiRoot, { recursive: true, force: true });
  }
});

// --------------------------------------------------------------------------------
// validateSynonymsBatch: per-line failure reasons
// --------------------------------------------------------------------------------

function conceptFixture(overrides: Partial<Concept> = {}): Concept {
  return { id: "id1", canonicalKeyword: "promotion", keywords: ["promotion"], paths: ["platform/func/a.md"], pages: [{ path: "platform/func/a.md", title: "A", summary: "" }], ...overrides };
}

function outputFixture(dir: string, text: string): { item: WorkItem; outPhaseReal: string } {
  const outPhaseDir = resolve(dir, "out");
  mkdirSync(outPhaseDir, { recursive: true });
  const outputPath = resolve(outPhaseDir, "batch-01.md");
  writeFileSync(outputPath, text);
  const item = { path: "synonyms-batch-01", outputPath, concepts: [] } as unknown as WorkItem;
  return { item, outPhaseReal: realpathSync(outPhaseDir) };
}

test("validateSynonymsBatch: a malformed line (not 3 parts) is rejected with a reason naming the line", () => {
  const dir = mkdtempSync(join(tmpdir(), "kb-synonyms-validate-"));
  try {
    const { item, outPhaseReal } = outputFixture(dir, "promotion — voucher, coupon\n");
    const result = validateSynonymsBatch(item, [conceptFixture()], new Set(["platform/func/a.md"]), outPhaseReal);
    assert.equal(result.ok, false);
    assert.match((result as { reason: string }).reason, /does not match the "canonical — aliases — paths" format/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("validateSynonymsBatch: a path not in knownPaths is rejected with a reason naming the path", () => {
  const dir = mkdtempSync(join(tmpdir(), "kb-synonyms-validate-"));
  try {
    const { item, outPhaseReal } = outputFixture(dir, "promotion — voucher, coupon — platform/func/ghost.md\n");
    const result = validateSynonymsBatch(item, [conceptFixture()], new Set(["platform/func/a.md"]), outPhaseReal);
    assert.equal(result.ok, false);
    assert.match((result as { reason: string }).reason, /does not resolve to an ingested page: platform\/func\/ghost\.md/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("validateSynonymsBatch: a duplicate canonical term within the batch is rejected with a reason", () => {
  const dir = mkdtempSync(join(tmpdir(), "kb-synonyms-validate-"));
  try {
    const { item, outPhaseReal } = outputFixture(dir, "promotion — voucher — platform/func/a.md\npromotion — coupon — platform/func/a.md\n");
    const result = validateSynonymsBatch(item, [conceptFixture()], new Set(["platform/func/a.md"]), outPhaseReal);
    assert.equal(result.ok, false);
    assert.match((result as { reason: string }).reason, /duplicate canonical term/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("validateSynonymsBatch: an input keyword missing from the output is rejected with a reason naming it", () => {
  const dir = mkdtempSync(join(tmpdir(), "kb-synonyms-validate-"));
  try {
    const { item, outPhaseReal } = outputFixture(dir, "promotion — voucher — platform/func/a.md\n");
    const concept = conceptFixture({ keywords: ["promotion", "PromotionEntity"] });
    const result = validateSynonymsBatch(item, [concept], new Set(["platform/func/a.md"]), outPhaseReal);
    assert.equal(result.ok, false);
    assert.match((result as { reason: string }).reason, /"PromotionEntity"/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("validateSynonymsBatch: a well-formed batch passes and returns its data lines", () => {
  const dir = mkdtempSync(join(tmpdir(), "kb-synonyms-validate-"));
  try {
    const { item, outPhaseReal } = outputFixture(dir, "# comment\npromotion — voucher, PromotionEntity — platform/func/a.md\n");
    const concept = conceptFixture({ keywords: ["promotion", "PromotionEntity"] });
    const result = validateSynonymsBatch(item, [concept], new Set(["platform/func/a.md"]), outPhaseReal);
    assert.equal(result.ok, true);
    if (result.ok) assert.deepEqual(result.lines, ["promotion — voucher, PromotionEntity — platform/func/a.md"]);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("validateSynonymsBatch: an unsorted batch (descending canonical order) is accepted — order is free, the merge sort at ingest owns it", () => {
  const dir = mkdtempSync(join(tmpdir(), "kb-synonyms-validate-"));
  try {
    const { item, outPhaseReal } = outputFixture(
      dir,
      "zebra — z animal — platform/func/a.md\napple — a fruit — platform/func/a.md\n",
    );
    const concepts = [conceptFixture({ id: "z", canonicalKeyword: "zebra", keywords: ["zebra"] }), conceptFixture({ id: "a", canonicalKeyword: "apple", keywords: ["apple"] })];
    const result = validateSynonymsBatch(item, concepts, new Set(["platform/func/a.md"]), outPhaseReal);
    assert.equal(result.ok, true);
    if (result.ok) assert.deepEqual(result.lines, ["zebra — z animal — platform/func/a.md", "apple — a fruit — platform/func/a.md"]);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("validateSynonymsBatch: 'Promotion' and 'promotion' collide as a case-insensitive duplicate", () => {
  const dir = mkdtempSync(join(tmpdir(), "kb-synonyms-validate-"));
  try {
    const { item, outPhaseReal } = outputFixture(dir, "Promotion — voucher — platform/func/a.md\npromotion — coupon — platform/func/a.md\n");
    const result = validateSynonymsBatch(item, [conceptFixture()], new Set(["platform/func/a.md"]), outPhaseReal);
    assert.equal(result.ok, false);
    assert.match((result as { reason: string }).reason, /duplicate canonical term.*promotion/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

// --------------------------------------------------------------------------------
// writeSynonymsOutput: byte-budget splitting, not a fixed line count
// --------------------------------------------------------------------------------

test("writeSynonymsOutput: splits into parts that each stay at or under synonymsMaxBytes for a large input", () => {
  const wikiRoot = mkdtempSync(join(tmpdir(), "kb-synonyms-split-"));
  try {
    mkdirSync(resolve(wikiRoot, "platform"), { recursive: true });
    const smallConfig = { sizeLimits: { synonymsMaxBytes: 2000 } } as unknown as PlatformConfig;
    const lines = Array.from({ length: 300 }, (_, i) => {
      const n = String(i).padStart(3, "0");
      return `term-${n} — alias-a-${n}, alias-b-${n} — platform/func/page-${n}.md`;
    });
    writeSynonymsOutput(wikiRoot, lines, smallConfig, new Set(lines.map((l) => l.split(" — ")[2])));

    const partsDir = resolve(wikiRoot, "platform/synonyms");
    const files = readFileSync(resolve(partsDir, "index.md"), "utf8")
      .split("\n")
      .filter((l) => l.startsWith("platform/synonyms/part-"))
      .map((l) => l.split(" — ")[0]);
    assert.ok(files.length > 1, "300 lines at this cap must split into more than one part");
    for (const relPath of files) {
      const abs = resolve(wikiRoot, relPath);
      const bytes = Buffer.byteLength(readFileSync(abs, "utf8"), "utf8");
      assert.ok(bytes <= smallConfig.sizeLimits.synonymsMaxBytes, `${relPath} is ${bytes} bytes, over the ${smallConfig.sizeLimits.synonymsMaxBytes}-byte cap`);
    }
    // Every input line must still be present somewhere across the parts — a byte-budget
    // split must never drop data.
    const allLines = files.flatMap((relPath) => readFileSync(resolve(wikiRoot, relPath), "utf8").split("\n").filter(isSynonymDataLine));
    assert.equal(allLines.length, lines.length);
  } finally {
    rmSync(wikiRoot, { recursive: true, force: true });
  }
});

test("writeSynonymsOutput: the merged single-file order is plain code-unit order, not locale collation", () => {
  const wikiRoot = mkdtempSync(join(tmpdir(), "kb-synonyms-order-"));
  try {
    mkdirSync(resolve(wikiRoot, "platform"), { recursive: true });
    // Under ICU/locale collation "Ä" often sorts adjacent to "A"; under plain code-unit
    // (UTF-16) order every uppercase letter sorts before every lowercase letter.
    writeSynonymsOutput(wikiRoot, ["ä-term — x — platform/func/a.md", "Z-term — y — platform/func/a.md"], CONFIG, KNOWN);
    const text = readFileSync(resolve(wikiRoot, "platform/synonyms.md"), "utf8");
    const lines = text.split("\n").filter(isSynonymDataLine);
    assert.deepEqual(lines, ["Z-term — y — platform/func/a.md", "ä-term — x — platform/func/a.md"]);
  } finally {
    rmSync(wikiRoot, { recursive: true, force: true });
  }
});

// --------------------------------------------------------------------------------
// writeSynonymsOutput / pruneSynonymsOutput: paths of removed pages are dropped
// --------------------------------------------------------------------------------

test("writeSynonymsOutput: an existing line's path outside knownPaths is dropped, and a line left with no paths is removed", () => {
  const wikiRoot = mkdtempSync(join(tmpdir(), "kb-synonyms-filter-"));
  try {
    mkdirSync(resolve(wikiRoot, "platform"), { recursive: true });
    const before = new Set(["platform/func/a.md", "platform/func/gone.md", "platform/dev/6.7/b.md"]);
    writeSynonymsOutput(wikiRoot, ["cart — basket — platform/func/a.md, platform/func/gone.md", "preview — insider — platform/func/gone.md"], CONFIG, before);
    writeSynonymsOutput(wikiRoot, ["dal — data abstraction layer — platform/dev/6.7/b.md"], CONFIG, KNOWN);
    const lines = readFileSync(resolve(wikiRoot, "platform/synonyms.md"), "utf8").split("\n").filter(isSynonymDataLine);
    assert.deepEqual(lines, ["cart — basket — platform/func/a.md", "dal — data abstraction layer — platform/dev/6.7/b.md"]);
  } finally {
    rmSync(wikiRoot, { recursive: true, force: true });
  }
});

test("pruneSynonymsOutput: re-writes the split form without stale paths, returns the dropped count; a clean or absent output is left untouched", () => {
  const wikiRoot = mkdtempSync(join(tmpdir(), "kb-synonyms-prune-"));
  try {
    mkdirSync(resolve(wikiRoot, "platform"), { recursive: true });
    assert.equal(pruneSynonymsOutput(wikiRoot, KNOWN, CONFIG), 0);
    assert.equal(existsSync(resolve(wikiRoot, "platform/synonyms.md")), false, "never creates the output");

    const smallConfig = { sizeLimits: { synonymsMaxBytes: 2000 } } as unknown as PlatformConfig;
    const lines = Array.from({ length: 60 }, (_, i) => `term-${String(i).padStart(2, "0")} — alias — platform/func/a.md${i % 10 === 0 ? ", platform/func/gone.md" : ""}`);
    lines.push("insider previews — preview — platform/func/gone.md");
    writeSynonymsOutput(wikiRoot, lines, smallConfig, new Set(["platform/func/a.md", "platform/func/gone.md"]));
    assert.ok(existsSync(resolve(wikiRoot, "platform/synonyms/index.md")), "fixture must be in the split form");

    assert.equal(pruneSynonymsOutput(wikiRoot, KNOWN, smallConfig), 7);
    const partsDir = resolve(wikiRoot, "platform/synonyms");
    const data = readdirSync(partsDir)
      .filter((f) => f !== "index.md")
      .flatMap((f) => readFileSync(resolve(partsDir, f), "utf8").split("\n").filter(isSynonymDataLine));
    assert.equal(data.length, 60, "the line whose only path was removed is gone");
    assert.ok(data.every((l) => l.endsWith(" — platform/func/a.md")), "no line still names the removed page");

    const indexBefore = readFileSync(resolve(partsDir, "index.md"), "utf8");
    assert.equal(pruneSynonymsOutput(wikiRoot, KNOWN, smallConfig), 0, "second run finds nothing to drop");
    assert.equal(readFileSync(resolve(partsDir, "index.md"), "utf8"), indexBefore);
  } finally {
    rmSync(wikiRoot, { recursive: true, force: true });
  }
});
