import { test } from "node:test";
import assert from "node:assert/strict";
import { extractLinks, wikiLinkTargets, checkLinks } from "../ingest/shared/links.js";

test("wikiLinkTargets: strips #anchor from every extracted link target", () => {
  const markdown = "See [a](platform/dev/6.7/a.md#section) and [b](platform/dev/6.7/b.md).";
  assert.deepEqual(wikiLinkTargets(markdown), ["platform/dev/6.7/a.md", "platform/dev/6.7/b.md"]);
});

test("wikiLinkTargets: reuses extractLinks — same targets before stripping anchors", () => {
  const markdown = "[a](platform/x.md#foo)";
  assert.deepEqual(wikiLinkTargets(markdown), extractLinks(markdown).map((l) => l.split("#")[0]));
});

test("checkLinks: a link resolving to a known path is not unresolved", () => {
  const knownPaths = new Set(["platform/a.md"]);
  const result = checkLinks([{ path: "platform/b.md", markdown: "[a](platform/a.md)" }], knownPaths);
  assert.deepEqual(result, { total: 1, unresolved: [] });
});

test("checkLinks: a link to an unknown path is unresolved", () => {
  const knownPaths = new Set(["platform/a.md"]);
  const result = checkLinks([{ path: "platform/b.md", markdown: "[a](platform/missing.md)" }], knownPaths);
  assert.deepEqual(result.unresolved, [{ source: "platform/b.md", link: "platform/missing.md" }]);
});
