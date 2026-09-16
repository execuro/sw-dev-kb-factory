import { test } from "node:test";
import assert from "node:assert/strict";
import { parseFrontmatter, parseScalar } from "../src/wiki/frontmatter.js";

test("frontmatter: scalars, quoted strings, flow arrays, flow maps, ISO dates, block maps", () => {
  const text = [
    "---",
    "id: platform/dev/6.7/a.md",
    "title: Plugin base guide",
    'version: "6.7"',
    'versions: ["6.7", "6.6"]',
    "keywords: [plugin, bootstrap, composer.json, Plugin class]",
    'sourceUrls: { "6.7": "https://x/6.7", "6.6": "https://x/6.6" }',
    "lastBuilt: 2026-08-30",
    "count: 12",
    "flag: true",
    "nothing: null",
    "quoted: 'it''s'",
    "comment: value # trailing comment",
    "revision:",
    "  range: \">=6.6 <6.7\"",
    "  swMax: null",
    "  current: false",
    "members:",
    "  - platform/a.md",
    "  - platform/b.md",
    "---",
    "## What it is",
    "body",
  ].join("\n");
  const { data, endLine } = parseFrontmatter(text);
  assert.equal(endLine, 21);
  assert.equal(data.id, "platform/dev/6.7/a.md");
  assert.equal(data.title, "Plugin base guide");
  assert.equal(data.version, "6.7");
  assert.deepEqual(data.versions, ["6.7", "6.6"]);
  assert.deepEqual(data.keywords, ["plugin", "bootstrap", "composer.json", "Plugin class"]);
  assert.deepEqual(data.sourceUrls, { "6.7": "https://x/6.7", "6.6": "https://x/6.6" });
  assert.equal(data.lastBuilt, "2026-08-30");
  assert.equal(data.count, 12);
  assert.equal(data.flag, true);
  assert.equal(data.nothing, null);
  assert.equal(data.quoted, "it's");
  assert.equal(data.comment, "value");
  assert.deepEqual(data.revision, { range: ">=6.6 <6.7", swMax: null, current: false });
  assert.deepEqual(data.members, ["platform/a.md", "platform/b.md"]);
});

test("frontmatter: none, unterminated, CRLF", () => {
  assert.deepEqual(parseFrontmatter("# no fm\n"), { data: {}, endLine: 0 });
  assert.deepEqual(parseFrontmatter("---\ntitle: x\n"), { data: {}, endLine: 0 });
  const crlf = parseFrontmatter("---\r\ntitle: x\r\n---\r\nbody");
  assert.equal(crlf.endLine, 3);
  assert.equal(crlf.data.title, "x");
});

test("frontmatter: `merge:` block map — anchor keys (with hyphens) → override/extend/waive, alongside a flow-map form", () => {
  const block = parseFrontmatter(
    ["---", "title: x", "merge:", "  dependency-injection: extend", "  testing: override", "  deprecated-api-usage: waive", "adr: []", "---", "## a"].join(
      "\n",
    ),
  );
  assert.deepEqual(block.data.merge, { "dependency-injection": "extend", testing: "override", "deprecated-api-usage": "waive" });
  assert.deepEqual(block.data.adr, []);

  const flow = parseFrontmatter(["---", 'merge: { "dependency-injection": extend, testing: override }', "---", "## a"].join("\n"));
  assert.deepEqual(flow.data.merge, { "dependency-injection": "extend", testing: "override" });
});

test("frontmatter: scalar edge cases never throw", () => {
  assert.equal(parseScalar("[unterminated"), "[unterminated");
  assert.deepEqual(parseScalar("[]"), []);
  assert.deepEqual(parseScalar("{}"), {});
  assert.deepEqual(parseScalar('["a, b", c]'), ["a, b", "c"]);
  assert.equal(parseScalar('"esc\\"aped"'), 'esc"aped');
  assert.equal(parseScalar("6.7"), 6.7);
  assert.equal(parseScalar("https://x:1/y"), "https://x:1/y");
});
