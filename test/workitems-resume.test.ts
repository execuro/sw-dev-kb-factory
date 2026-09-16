import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import { readPendingBatches, writeBatches } from "../ingest/shared/workitems.js";
import type { WorkItem } from "../ingest/shared/types.js";

function setup() {
  const layerDir = mkdtempSync(resolve(tmpdir(), "wi-resume-"));
  const promptPath = resolve(layerDir, "prompt.md");
  writeFileSync(promptPath, "prompt");
  return { layerDir, promptPath };
}

function item(path: string): WorkItem {
  return { path, outputPath: resolve("/tmp", path.replace(/\//g, "_")) };
}

function fileNames(layerDir: string, phase: string): string[] {
  return readdirSync(resolve(layerDir, ".cache", "work", phase)).sort();
}

test("writeBatches: a second prepare with the same items does not duplicate or renumber", () => {
  const { layerDir, promptPath } = setup();
  try {
    const items = [item("platform/a.md"), item("platform/b.md")];
    const first = writeBatches(layerDir, "pages", items, promptPath, 1);
    assert.equal(first.length, 2);
    const beforeNames = fileNames(layerDir, "pages");
    const beforeBytes = beforeNames.map((n) => readFileSync(resolve(layerDir, ".cache", "work", "pages", n)));

    const second = writeBatches(layerDir, "pages", items, promptPath, 1);
    assert.equal(second.length, 0, "no new batch files — both items are already pending");

    const afterNames = fileNames(layerDir, "pages");
    assert.deepEqual(afterNames, beforeNames, "no file renamed or removed");
    const afterBytes = afterNames.map((n) => readFileSync(resolve(layerDir, ".cache", "work", "pages", n)));
    assert.deepEqual(afterBytes, beforeBytes, "existing batch files are byte-identical");

    const pending = readPendingBatches(layerDir, "pages");
    const paths = pending.flatMap((p) => p.batch.items.map((i) => i.path)).sort();
    assert.deepEqual(paths, ["platform/a.md", "platform/b.md"], "no duplicate items");
  } finally {
    rmSync(layerDir, { recursive: true, force: true });
  }
});

test("writeBatches: a second prepare with new items keeps old batch files untouched and numbers new ones onward", () => {
  const { layerDir, promptPath } = setup();
  try {
    writeBatches(layerDir, "pages", [item("platform/a.md")], promptPath, 1);
    const beforeNames = fileNames(layerDir, "pages");
    const beforeBytes = new Map(beforeNames.map((n) => [n, readFileSync(resolve(layerDir, ".cache", "work", "pages", n))]));

    const secondFiles = writeBatches(layerDir, "pages", [item("platform/a.md"), item("platform/c.md")], promptPath, 1);
    // "platform/a.md" is already pending -> filtered out; only "platform/c.md" is new.
    assert.equal(secondFiles.length, 1);

    const afterNames = fileNames(layerDir, "pages");
    assert.equal(afterNames.length, 2);
    for (const n of beforeNames) {
      assert.deepEqual(readFileSync(resolve(layerDir, ".cache", "work", "pages", n)), beforeBytes.get(n), `${n} is byte-identical`);
    }

    const newName = afterNames.find((n) => !beforeNames.includes(n))!;
    // Old batch was batch-0001.json -> new one continues at batch-0002.json, not batch-0001.json again.
    assert.equal(newName > beforeNames[0], true, "new batch number is greater than the existing one");
  } finally {
    rmSync(layerDir, { recursive: true, force: true });
  }
});

test("writeBatches: --reset-batches (opts.reset) wipes the pending set before writing", () => {
  const { layerDir, promptPath } = setup();
  try {
    writeBatches(layerDir, "pages", [item("platform/a.md")], promptPath, 1);
    assert.equal(readPendingBatches(layerDir, "pages").length, 1);

    writeBatches(layerDir, "pages", [item("platform/z.md")], promptPath, 1, undefined, { reset: true });

    const pending = readPendingBatches(layerDir, "pages");
    assert.equal(pending.length, 1);
    assert.equal(pending[0].batch.items[0].path, "platform/z.md");
    // Numbering restarts after a reset.
    assert.equal(fileNames(layerDir, "pages")[0], "batch-0001.json");
  } finally {
    rmSync(layerDir, { recursive: true, force: true });
  }
});

test("writeBatches: an item already pending under one phase's batch is not re-queued by a later prepare", () => {
  const { layerDir, promptPath } = setup();
  try {
    writeBatches(layerDir, "hubs", [item("platform/hubs/foo.md")], promptPath, 1);
    const files = writeBatches(layerDir, "hubs", [item("platform/hubs/foo.md")], promptPath, 1);
    assert.equal(files.length, 0);
    assert.equal(readPendingBatches(layerDir, "hubs").length, 1);
  } finally {
    rmSync(layerDir, { recursive: true, force: true });
  }
});

test("writeBatches: numbering stays correctly (lexically) ordered past batch-99", () => {
  const { layerDir, promptPath } = setup();
  try {
    const items = Array.from({ length: 105 }, (_, i) => item(`platform/p${i}.md`));
    const files = writeBatches(layerDir, "pages", items, promptPath, 1);
    assert.equal(files.length, 105);
    const names = fileNames(layerDir, "pages");
    const sortedNumerically = [...names].sort((a, b) => {
      const na = Number(/batch-(\d+)\.json/.exec(a)![1]);
      const nb = Number(/batch-(\d+)\.json/.exec(b)![1]);
      return na - nb;
    });
    assert.deepEqual(names, sortedNumerically, "lexical (readdir+sort) order matches numeric order");
    assert.equal(names[names.length - 1], "batch-0105.json");
  } finally {
    rmSync(layerDir, { recursive: true, force: true });
  }
});

test("writeBatches: synonyms phase is not path-deduped (excluded from PATH_IDENTITY_PHASES)", () => {
  const { layerDir, promptPath } = setup();
  try {
    const dupItem = { path: "synonyms-batch-01", outputPath: resolve("/tmp/synonyms-out.md"), concepts: [] };
    writeBatches(layerDir, "synonyms", [dupItem], promptPath, 1);
    const second = writeBatches(layerDir, "synonyms", [dupItem], promptPath, 1);
    assert.equal(second.length, 1, "synonyms items are not de-duped by path — the phase owns its own dedupe");
    assert.equal(readPendingBatches(layerDir, "synonyms").length, 2);
  } finally {
    rmSync(layerDir, { recursive: true, force: true });
  }
});
