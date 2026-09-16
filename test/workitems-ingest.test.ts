import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import { cacheDirs, ingestBatches, readPendingBatches, resolveBatchArg, selectPendingBatches, writeBatches } from "../ingest/shared/workitems.js";
import type { WorkItem } from "../ingest/shared/types.js";

function setup() {
  const layerDir = mkdtempSync(resolve(tmpdir(), "wi-ingest-"));
  const wikiRoot = mkdtempSync(resolve(tmpdir(), "wi-wiki-"));
  const promptPath = resolve(layerDir, "prompt.md");
  writeFileSync(promptPath, "prompt");
  const outDir = resolve(cacheDirs(layerDir).outDir, "pages");
  mkdirSync(outDir, { recursive: true });
  return { layerDir, wikiRoot, promptPath, outDir };
}

function item(path: string, outDir: string): WorkItem {
  return { path, outputPath: resolve(outDir, path.replace(/^platform\//, "")) };
}

test("--batch: ingesting one batch file leaves the other pending batch untouched and not failed", () => {
  const { layerDir, wikiRoot, promptPath, outDir } = setup();
  try {
    const item1 = item("platform/a.md", outDir);
    const item2 = item("platform/b.md", outDir);
    const files = writeBatches(layerDir, "pages", [item1, item2], promptPath, 1);
    assert.equal(files.length, 2);
    // Only batch 1's output is produced — batch 2's wave "hasn't run yet".
    mkdirSync(resolve(outDir), { recursive: true });
    writeFileSync(item1.outputPath, "content-a");

    const outcome = ingestBatches(layerDir, wikiRoot, "pages", () => ({ ok: true }), { batches: [files[0]] });

    assert.equal(outcome.ok.length, 1);
    assert.equal(outcome.ok[0].path, "platform/a.md");
    assert.equal(outcome.failed.length, 0);
    assert.deepEqual(outcome.unresolvedBatches, []);

    // Batch 2's file must still be pending — never consumed, never marked failed.
    const stillPending = readPendingBatches(layerDir, "pages");
    assert.equal(stillPending.length, 1);
    assert.equal(stillPending[0].batch.items[0].path, "platform/b.md");
  } finally {
    rmSync(layerDir, { recursive: true, force: true });
    rmSync(wikiRoot, { recursive: true, force: true });
  }
});

test("--batch: an argument that does not resolve to a pending batch is reported as unresolved, not silently ignored", () => {
  const { layerDir, wikiRoot, promptPath, outDir } = setup();
  try {
    const item1 = item("platform/a.md", outDir);
    writeBatches(layerDir, "pages", [item1], promptPath, 1);
    const outcome = ingestBatches(layerDir, wikiRoot, "pages", () => ({ ok: true }), { batches: ["batch-does-not-exist.json"] });
    assert.equal(outcome.ok.length, 0);
    assert.equal(outcome.failed.length, 0);
    assert.deepEqual(outcome.unresolvedBatches, ["batch-does-not-exist.json"]);
    // The real pending batch is untouched since it wasn't named.
    assert.equal(readPendingBatches(layerDir, "pages").length, 1);
  } finally {
    rmSync(layerDir, { recursive: true, force: true });
    rmSync(wikiRoot, { recursive: true, force: true });
  }
});

test("--batch: without it, every pending batch is still consumed (manual single-wave use)", () => {
  const { layerDir, wikiRoot, promptPath, outDir } = setup();
  try {
    const item1 = item("platform/a.md", outDir);
    const item2 = item("platform/b.md", outDir);
    writeBatches(layerDir, "pages", [item1, item2], promptPath, 1);
    writeFileSync(item1.outputPath, "content-a");
    writeFileSync(item2.outputPath, "content-b");
    const outcome = ingestBatches(layerDir, wikiRoot, "pages", () => ({ ok: true }));
    assert.equal(outcome.ok.length, 2);
    assert.equal(readPendingBatches(layerDir, "pages").length, 0);
  } finally {
    rmSync(layerDir, { recursive: true, force: true });
    rmSync(wikiRoot, { recursive: true, force: true });
  }
});

test("ingestBatches: rejects an item whose path escapes the wiki's platform tree via \"..\" segments", () => {
  const { layerDir, wikiRoot, promptPath, outDir } = setup();
  try {
    const tampered: WorkItem = { path: "platform/../../escaped.md", outputPath: resolve(outDir, "escaped.md") };
    writeBatches(layerDir, "pages", [tampered], promptPath, 1);
    writeFileSync(tampered.outputPath, "content");

    const outcome = ingestBatches(layerDir, wikiRoot, "pages", () => ({ ok: true }));

    assert.equal(outcome.ok.length, 0);
    assert.equal(outcome.failed.length, 1);
    assert.match(outcome.failed[0].reason, /".."|escapes/);
    // Nothing must have been written outside the wiki root.
    assert.equal(existsSync(resolve(wikiRoot, "..", "escaped.md")), false);
  } finally {
    rmSync(layerDir, { recursive: true, force: true });
    rmSync(wikiRoot, { recursive: true, force: true });
  }
});

test("ingestBatches: rejects an item whose path is absolute", () => {
  const { layerDir, wikiRoot, promptPath, outDir } = setup();
  try {
    const escapedAbs = resolve(tmpdir(), "wi-escaped-abs.md");
    const tampered: WorkItem = { path: escapedAbs, outputPath: resolve(outDir, "escaped-abs.md") };
    writeBatches(layerDir, "pages", [tampered], promptPath, 1);
    writeFileSync(tampered.outputPath, "content");

    const outcome = ingestBatches(layerDir, wikiRoot, "pages", () => ({ ok: true }));

    assert.equal(outcome.ok.length, 0);
    assert.equal(outcome.failed.length, 1);
    assert.equal(existsSync(escapedAbs), false);
  } finally {
    rmSync(layerDir, { recursive: true, force: true });
    rmSync(wikiRoot, { recursive: true, force: true });
  }
});

test("resolveBatchArg: rejects a path escaping the phase's work directory", () => {
  const { layerDir } = setup();
  try {
    mkdirSync(resolve(cacheDirs(layerDir).workDir, "pages"), { recursive: true });
    assert.equal(resolveBatchArg(layerDir, "pages", "../../../etc/passwd"), undefined);
    assert.equal(resolveBatchArg(layerDir, "pages", ".cache/work/hubs/batch-01.json"), undefined);
  } finally {
    rmSync(layerDir, { recursive: true, force: true });
  }
});

test("selectPendingBatches: accepts a bare batch file name as well as the prepare-printed relative path", () => {
  const { layerDir, promptPath, outDir } = setup();
  try {
    const item1 = item("platform/a.md", outDir);
    const files = writeBatches(layerDir, "pages", [item1], promptPath, 1);
    const bareName = files[0].split("/").pop()!;
    const byBareName = selectPendingBatches(layerDir, "pages", [bareName]);
    assert.equal(byBareName.pending.length, 1);
    assert.deepEqual(byBareName.unresolved, []);

    const byFullPath = selectPendingBatches(layerDir, "pages", [files[0]]);
    assert.equal(byFullPath.pending.length, 1);
    assert.deepEqual(byFullPath.unresolved, []);
  } finally {
    rmSync(layerDir, { recursive: true, force: true });
  }
});
