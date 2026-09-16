import { test } from "node:test";
import assert from "node:assert/strict";
import {
  validatePageFrontmatter,
  validateHubFrontmatter,
  validateGuidelineFrontmatter,
  crossLinkTargets,
  validateSixSections,
  estimateTokens,
  checkFrontmatterQuoting,
  checkFrontmatterHeadSize,
  h2Headings,
} from "../ingest/shared/frontmatterValidate.js";
import { parseFrontmatter } from "../src/wiki/frontmatter.js";
import { pickRelatedPages, knownBuiltPaths } from "../ingest/platform/pagePrep.js";

const BASE_FM = {
  id: "platform/dev/6.7/a.md",
  title: "A",
  docType: "developer",
  version: "6.7",
  versions: ["6.7"],
  sourceUrl: "https://developer.shopware.com/docs/a.html",
  sourceHash: "abc",
  keywords: ["a", "b", "c", "d", "e", "f", "g", "h"],
  summary: "Summary",
  lastBuilt: "2026-08-30",
};

test("validatePageFrontmatter: page with no cross-link fields still validates (backward compatibility)", () => {
  assert.deepEqual(validatePageFrontmatter({ ...BASE_FM }), []);
});

test("validatePageFrontmatter: valid relatedPages/supersedes/supersededBy validate", () => {
  const fm = {
    ...BASE_FM,
    relatedPages: ["platform/dev/6.7/b.md", "platform/dev/6.7/c.md"],
    supersedes: "platform/dev/6.6/a.md",
    supersededBy: null,
  };
  assert.deepEqual(validatePageFrontmatter(fm), []);
});

test("validatePageFrontmatter: relatedPages accepts a flat guideline path, rejects a nested one", () => {
  const flat = { ...BASE_FM, relatedPages: ["platform/guidelines/6.7/code-guidelines.md"] };
  assert.deepEqual(validatePageFrontmatter(flat).filter((i) => i.field === "relatedPages"), []);

  const nested = { ...BASE_FM, relatedPages: ["platform/guidelines/6.7/sub/x-guidelines.md"] };
  assert.equal(validatePageFrontmatter(nested).some((i) => i.field === "relatedPages"), true);
});

test("validatePageFrontmatter: relatedPages over the cap or with a bad pattern fails", () => {
  const tooMany = { ...BASE_FM, relatedPages: Array.from({ length: 5 }, (_, i) => `platform/dev/6.7/p${i}.md`) };
  assert.equal(validatePageFrontmatter(tooMany).some((i) => i.field === "relatedPages"), true);

  const badPattern = { ...BASE_FM, relatedPages: ["not-a-wiki-path"] };
  assert.equal(validatePageFrontmatter(badPattern).some((i) => i.field === "relatedPages"), true);
});

test("validatePageFrontmatter: supersededBy with a non-platform path fails", () => {
  const fm = { ...BASE_FM, supersededBy: "somewhere/else.md" };
  assert.equal(validatePageFrontmatter(fm).some((i) => i.field === "supersededBy"), true);
});

test("crossLinkTargets: extracts relatedPages + supersedes + supersededBy, ignores absent fields", () => {
  assert.deepEqual(crossLinkTargets({ ...BASE_FM }), []);
  assert.deepEqual(
    crossLinkTargets({ relatedPages: ["platform/dev/6.7/b.md"], supersedes: "platform/dev/6.6/a.md", supersededBy: null }),
    ["platform/dev/6.7/b.md", "platform/dev/6.6/a.md"],
  );
});

test("lint-style resolution: a relatedPages/supersedes/supersededBy path that isn't a known page is unresolved", () => {
  const knownPaths = new Set(["platform/dev/6.7/a.md", "platform/dev/6.7/b.md"]);
  const fm = { relatedPages: ["platform/dev/6.7/b.md", "platform/dev/6.7/does-not-exist.md"], supersededBy: "platform/dev/6.7/gone.md" };
  const unresolved = crossLinkTargets(fm).filter((t) => !knownPaths.has(t));
  assert.deepEqual(unresolved, ["platform/dev/6.7/does-not-exist.md", "platform/dev/6.7/gone.md"]);
});

test("pickRelatedPages: keeps only known, non-self links, capped", () => {
  const known = new Set(["platform/dev/6.7/b.md", "platform/dev/6.7/c.md"]);
  const links = ["platform/dev/6.7/a.md", "platform/dev/6.7/b.md", "platform/dev/6.7/c.md", "platform/dev/6.7/unbuilt.md"];
  assert.deepEqual(pickRelatedPages(links, known, "platform/dev/6.7/a.md"), ["platform/dev/6.7/b.md", "platform/dev/6.7/c.md"]);
  assert.deepEqual(pickRelatedPages(links, known, "platform/dev/6.7/a.md", 1), ["platform/dev/6.7/b.md"]);
});

test("knownBuiltPaths: only entries with builtHash, resolved through sharedFrom", () => {
  const state = {
    sources: {
      "s1:6.7": {
        pages: {
          "platform/dev/6.7/a.md": { hash: "h1", builtHash: "h1" },
          "platform/dev/6.7/unbuilt.md": { hash: "h2" },
        },
      },
      "s1:6.6": {
        pages: {
          "platform/dev/6.6/a.md": { hash: "h1", builtHash: "h1", sharedFrom: "platform/dev/6.7/a.md" },
        },
      },
    },
  };
  assert.deepEqual(knownBuiltPaths(state as never), new Set(["platform/dev/6.7/a.md"]));
});

test("validateSixSections: optional 7th Code check section, last position only, excluded from estimateTokens", () => {
  const withCodeCheck = "## What it is\nx\n\n## Code check (6.7.13.0)\n- absent `Foo` — not found\n";
  assert.deepEqual(validateSixSections(withCodeCheck), []);

  const wrongOrder = "## Code check (6.7.13.0)\n- absent `Foo` — not found\n\n## What it is\nx\n";
  assert.equal(validateSixSections(wrongOrder).some((i) => i.message.includes("last section")), true);

  const duplicate = "## What it is\nx\n\n## Code check (6.7.13.0)\nfoo\n\n## Code check (6.7.13.0)\nbar\n";
  assert.equal(validateSixSections(duplicate).some((i) => i.message.includes("duplicate")), true);
});

const GUIDELINE_FM = {
  id: "platform/guidelines/6.7/code-guidelines.md",
  title: "Code guidelines",
  docType: "guideline",
  version: "6.7",
  summary: "Summary",
  keywords: ["a", "b", "c", "d", "e", "f", "g", "h"],
  sources: [{ url: "docs:resources/guidelines/code/core/domain-exceptions.md", hash: "abc" }],
  codeVersion: "6.7.13.0+deadbeef",
  lastBuilt: "2026-08-30",
};

test("validateGuidelineFrontmatter: valid guideline frontmatter validates", () => {
  assert.deepEqual(validateGuidelineFrontmatter({ ...GUIDELINE_FM }), []);
});

test("validateGuidelineFrontmatter: missing sources fails", () => {
  const fm = { ...GUIDELINE_FM } as Record<string, unknown>;
  delete fm.sources;
  const issues = validateGuidelineFrontmatter(fm);
  assert.equal(issues.some((i) => i.field === "sources"), true);
});

test("validateGuidelineFrontmatter: empty sources item fails", () => {
  const fm = { ...GUIDELINE_FM, sources: [{ url: "", hash: "abc" }] };
  const issues = validateGuidelineFrontmatter(fm);
  assert.equal(issues.some((i) => i.field === "sources"), true);
});

test("validateGuidelineFrontmatter: wrong docType fails", () => {
  const fm = { ...GUIDELINE_FM, docType: "developer" };
  const issues = validateGuidelineFrontmatter(fm);
  assert.equal(issues.some((i) => i.field === "docType"), true);
});

test("validateGuidelineFrontmatter: version/id mismatch fails", () => {
  const fm = { ...GUIDELINE_FM, version: "6.6" };
  const issues = validateGuidelineFrontmatter(fm);
  assert.equal(issues.some((i) => i.field === "version"), true);
});

test("validateGuidelineFrontmatter: id pattern accepts a guideline path and rejects a nested one", () => {
  assert.deepEqual(validateGuidelineFrontmatter({ ...GUIDELINE_FM }).filter((i) => i.field === "id"), []);
  const nested = { ...GUIDELINE_FM, id: "platform/guidelines/6.7/sub/x-guidelines.md" };
  assert.equal(validateGuidelineFrontmatter(nested).some((i) => i.field === "id"), true);
});

test("estimateTokens: excludes the Code check section from the token-band count", () => {
  const withoutSection = "## What it is\none two three four five\n";
  const withSection = withoutSection + "\n## Code check (6.7.13.0)\n- absent `SomeLongIdentifierNameHere` — this padding text inflates the word count a lot\n";
  assert.equal(estimateTokens(withSection), estimateTokens(withoutSection));
});

// --------------------------------------------------------------------------------
// checkFrontmatterQuoting: reproduces the real parser's " #" comment-truncation bug
// --------------------------------------------------------------------------------

test("checkFrontmatterQuoting: an unquoted ' #' truncates the value per the real parser", () => {
  const text = "---\ntitle: hello #world\n---\nbody\n";
  const issues = checkFrontmatterQuoting(text);
  assert.equal(issues.some((i) => i.field === "title"), true);
  // Confirm against the real parser: the value really is truncated.
  const { data } = parseFrontmatter(text);
  assert.equal(data.title, "hello");
});

test("checkFrontmatterQuoting: a double-quoted value containing '#' is fine", () => {
  const text = '---\ntitle: "hello #world"\n---\nbody\n';
  assert.deepEqual(checkFrontmatterQuoting(text), []);
  const { data } = parseFrontmatter(text);
  assert.equal(data.title, "hello #world");
});

test("checkFrontmatterQuoting: a \\\" before a # inside a quoted value still truncates (parser mis-tracking)", () => {
  const text = '---\ntitle: "a\\" #b"\n---\nbody\n';
  const issues = checkFrontmatterQuoting(text);
  assert.equal(issues.some((i) => i.field === "title"), true);
});

test("checkFrontmatterQuoting: a flow list item with an unquoted ' #' truncates the whole list", () => {
  const text = "---\nkeywords: [a, b #c, d]\n---\nbody\n";
  const issues = checkFrontmatterQuoting(text);
  assert.equal(issues.some((i) => i.field === "keywords"), true);
  // The truncated flow list never reaches its closing `]`, so the real parser falls back to
  // a plain (broken) string, not an array — confirming the value really is corrupted.
  const { data } = parseFrontmatter(text);
  assert.equal(data.keywords, "[a, b");
});

test("checkFrontmatterQuoting: a block-list item's ' #' is attributed to its parent key", () => {
  const text = "---\nmembers:\n  - platform/a.md #note\n  - platform/b.md\n---\nbody\n";
  const issues = checkFrontmatterQuoting(text);
  assert.equal(issues.some((i) => i.field === "members"), true);
});

test("checkFrontmatterQuoting: no frontmatter block yields no issues", () => {
  assert.deepEqual(checkFrontmatterQuoting("no frontmatter here"), []);
});

// --------------------------------------------------------------------------------
// checkFrontmatterHeadSize: the server only reads the first FRONTMATTER_HEAD_BYTES bytes
// --------------------------------------------------------------------------------

test("checkFrontmatterHeadSize: a small frontmatter block passes", () => {
  const text = "---\ntitle: A\n---\nbody\n";
  assert.deepEqual(checkFrontmatterHeadSize(text), []);
});

test("checkFrontmatterHeadSize: a frontmatter block at/over the 8 KB read window fails", () => {
  const text = `---\ntitle: "${"x".repeat(9000)}"\n---\nbody\n`;
  const issues = checkFrontmatterHeadSize(text);
  assert.equal(issues.length, 1);
  assert.match(issues[0].message, /8192|FRONTMATTER_HEAD_BYTES|read window/);
});

// --------------------------------------------------------------------------------
// validatePageFrontmatter: lastBuilt format, keywords must be non-empty strings (item 8)
// --------------------------------------------------------------------------------

test("validatePageFrontmatter: lastBuilt must be a YYYY-MM-DD date string", () => {
  const bad = { ...BASE_FM, lastBuilt: "2026-08-30T12:00:00Z" };
  assert.equal(validatePageFrontmatter(bad).some((i) => i.field === "lastBuilt"), true);
  assert.deepEqual(validatePageFrontmatter({ ...BASE_FM }).filter((i) => i.field === "lastBuilt"), []);
});

test("validatePageFrontmatter: a non-string keyword fails", () => {
  const bad = { ...BASE_FM, keywords: ["a", "b", "c", "d", "e", "f", "g", 8] };
  assert.equal(validatePageFrontmatter(bad).some((i) => i.field === "keywords"), true);
});

// --------------------------------------------------------------------------------
// validateHubFrontmatter: summary <=160 and keywords 8-15, via the shared helper (item 9)
// --------------------------------------------------------------------------------

const HUB_FM = {
  id: "platform/hubs/dal.md",
  title: "DAL",
  summary: "Data Abstraction Layer",
  keywords: ["a", "b", "c", "d", "e", "f", "g", "h"],
  members: ["platform/dev/6.7/a.md"],
  lastBuilt: "2026-08-30",
};

test("validateHubFrontmatter: valid hub frontmatter validates", () => {
  assert.deepEqual(validateHubFrontmatter({ ...HUB_FM }), []);
});

test("validateHubFrontmatter: a summary over 160 chars fails", () => {
  const bad = { ...HUB_FM, summary: "x".repeat(161) };
  assert.equal(validateHubFrontmatter(bad).some((i) => i.field === "summary"), true);
});

test("validateHubFrontmatter: fewer than 8 keywords fails", () => {
  const bad = { ...HUB_FM, keywords: ["a", "b"] };
  assert.equal(validateHubFrontmatter(bad).some((i) => i.field === "keywords"), true);
});

// --------------------------------------------------------------------------------
// validateGuidelineFrontmatter: version must be a string, not a YAML number (item 9)
// --------------------------------------------------------------------------------

test("validateGuidelineFrontmatter: an unquoted numeric version fails", () => {
  const bad = { ...GUIDELINE_FM, version: 6.7 };
  const issues = validateGuidelineFrontmatter(bad);
  assert.equal(issues.some((i) => i.field === "version" && i.message.includes("quote")), true);
});

test("validateGuidelineFrontmatter: a summary over 160 chars fails", () => {
  const bad = { ...GUIDELINE_FM, summary: "x".repeat(161) };
  assert.equal(validateGuidelineFrontmatter(bad).some((i) => i.field === "summary"), true);
});

// --------------------------------------------------------------------------------
// h2Headings / validateSixSections: a fenced `## ` line is not a heading (item 10)
// --------------------------------------------------------------------------------

test("h2Headings: skips '## ' lines inside ``` and ~~~ fences", () => {
  const body = "## What it is\n```\n## Not a heading\n```\n~~~\n## Also not a heading\n~~~\n## Gotchas\n";
  assert.deepEqual(h2Headings(body), ["What it is", "Gotchas"]);
});

test("validateSixSections: a '## ' line inside a fenced code sample is not flagged as an unknown heading", () => {
  const body = "## What it is\nx\n\n```yaml\n## Fake Section\n```\n";
  assert.deepEqual(validateSixSections(body), []);
});
