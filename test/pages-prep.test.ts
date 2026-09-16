import { test } from "node:test";
import assert from "node:assert/strict";
import { filterPlannedLinks } from "../ingest/platform/pagePrep.js";

test("filterPlannedLinks: drops a link that is neither already built nor planned this run", () => {
  const items = [{ path: "platform/dev/6.7/a.md", links: ["platform/dev/6.7/b.md", "platform/dev/6.7/ghost.md"] }];
  const dropped = filterPlannedLinks(items, new Set(["platform/dev/6.7/b.md"]));
  assert.deepEqual(items[0].links, ["platform/dev/6.7/b.md"]);
  assert.equal(dropped, 1);
});

test("filterPlannedLinks: keeps a link that targets an already-built page", () => {
  const items = [{ path: "platform/dev/6.7/a.md", links: ["platform/dev/6.7/known.md"] }];
  const dropped = filterPlannedLinks(items, new Set(["platform/dev/6.7/known.md"]));
  assert.deepEqual(items[0].links, ["platform/dev/6.7/known.md"]);
  assert.equal(dropped, 0);
});

test("filterPlannedLinks: keeps a link that targets another item planned in the same run", () => {
  const items = [
    { path: "platform/dev/6.7/a.md", links: ["platform/dev/6.7/b.md"] },
    { path: "platform/dev/6.7/b.md", links: [] },
  ];
  const dropped = filterPlannedLinks(items, new Set());
  assert.deepEqual(items[0].links, ["platform/dev/6.7/b.md"]);
  assert.equal(dropped, 0);
});

test("filterPlannedLinks: an item with no links is left untouched and does not affect the drop count", () => {
  const items = [{ path: "platform/dev/6.7/a.md" }, { path: "platform/dev/6.7/b.md", links: [] }];
  const dropped = filterPlannedLinks(items, new Set());
  assert.equal(dropped, 0);
  assert.equal(items[0].links, undefined);
  assert.deepEqual(items[1].links, []);
});

test("filterPlannedLinks: sums dropped entries across multiple items", () => {
  const items = [
    { path: "platform/dev/6.7/a.md", links: ["platform/dev/6.7/ghost1.md", "platform/dev/6.7/ghost2.md"] },
    { path: "platform/dev/6.7/b.md", links: ["platform/dev/6.7/ghost3.md"] },
  ];
  const dropped = filterPlannedLinks(items, new Set());
  assert.equal(dropped, 3);
  assert.deepEqual(items[0].links, []);
  assert.deepEqual(items[1].links, []);
});
