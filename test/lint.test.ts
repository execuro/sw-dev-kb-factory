/** wiki:lint — the checks added by work package C2 (hub gate, synonyms cap, hygiene
 *  downgrade without a source cache). Each test drives a single exported `lint*` function
 *  against a throwaway temp wiki tree — never the real one. */
import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { lintHubs, lintSynonyms, lintTreeSafety, lintGuidelines, type LintReport } from "../ingest/platform/lint.js";
import type { GuidelineCuratedFile, HubStateEntry, IngestionState, PlatformConfig } from "../ingest/shared/types.js";
import { emptyReport, emptyState, tmpDir } from "./helpers.js";

function sizeConfig(overrides: Partial<PlatformConfig["sizeLimits"]> = {}): PlatformConfig {
  return {
    sizeLimits: {
      pageMaxBytes: 32768,
      hubMaxBytes: 65536,
      synonymsMaxBytes: 262144,
      generatedFileMaxBytes: 524288,
      committedFileMaxBytes: 1048576,
      wikiPackageMaxBytes: 12582912,
      guidelineFileMaxBytes: 12288,
      guidelinePairMaxBytes: 20480,
      ...overrides,
    },
  } as unknown as PlatformConfig;
}

// --------------------------------------------------------------------------------
// lintHubs: frontmatter validation + hubMaxBytes cap on the committed hub file
// --------------------------------------------------------------------------------

function goodHubBody(): string {
  return [
    "---",
    "id: platform/hubs/plugin.md",
    "title: Plugin",
    "summary: About plugins",
    `keywords: ["one", "two", "three", "four", "five", "six", "seven", "eight"]`,
    "members: [platform/dev/6.7/a.md]",
    "lastBuilt: 2026-09-14",
    "---",
    "",
    "- [A](platform/dev/6.7/a.md)",
    "",
  ].join("\n");
}

test("lintHubs: an ok hub over hubMaxBytes errors with the byte count", () => {
  const wikiRoot = tmpDir("kb-lint-hubs-");
  try {
    mkdirSync(resolve(wikiRoot, "platform/hubs"), { recursive: true });
    writeFileSync(resolve(wikiRoot, "platform/hubs/plugin.md"), goodHubBody());
    const state = emptyState();
    state.hubs.plugin = { slug: "plugin", memberPaths: ["platform/dev/6.7/a.md"], hubState: "ok" };
    const report = emptyReport();
    lintHubs(sizeConfig({ hubMaxBytes: 50 }), state, wikiRoot, new Set(["platform/dev/6.7/a.md"]), report);
    assert.ok(report.errors.some((e) => e.includes("exceeds the 50-byte hub cap")));
  } finally {
    rmSync(wikiRoot, { recursive: true, force: true });
  }
});

test("lintHubs: missing required hub frontmatter field errors via validateHubFrontmatter", () => {
  const wikiRoot = tmpDir("kb-lint-hubs-");
  try {
    mkdirSync(resolve(wikiRoot, "platform/hubs"), { recursive: true });
    writeFileSync(
      resolve(wikiRoot, "platform/hubs/plugin.md"),
      ["---", "id: platform/hubs/plugin.md", "title: Plugin", "members: [platform/dev/6.7/a.md]", "lastBuilt: 2026-09-14", "---", "", "- [A](platform/dev/6.7/a.md)", ""].join("\n"),
    );
    const state = emptyState();
    state.hubs.plugin = { slug: "plugin", memberPaths: ["platform/dev/6.7/a.md"], hubState: "ok" };
    const report = emptyReport();
    lintHubs(sizeConfig(), state, wikiRoot, new Set(["platform/dev/6.7/a.md"]), report);
    assert.ok(report.errors.some((e) => e.includes("plugin.md") && e.includes("summary") && e.includes("missing required field")));
  } finally {
    rmSync(wikiRoot, { recursive: true, force: true });
  }
});

test("lintHubs: a valid ok hub passes with no errors", () => {
  const wikiRoot = tmpDir("kb-lint-hubs-");
  try {
    mkdirSync(resolve(wikiRoot, "platform/hubs"), { recursive: true });
    writeFileSync(resolve(wikiRoot, "platform/hubs/plugin.md"), goodHubBody());
    const state = emptyState();
    state.hubs.plugin = { slug: "plugin", memberPaths: ["platform/dev/6.7/a.md"], hubState: "ok" };
    const report = emptyReport();
    const knownPaths = new Set(["platform/dev/6.7/a.md"]);
    lintHubs(sizeConfig(), state, wikiRoot, knownPaths, report);
    assert.deepEqual(report.errors, []);
    assert.ok(knownPaths.has("platform/hubs/plugin.md"), "the hub itself must become a resolvable link target");
  } finally {
    rmSync(wikiRoot, { recursive: true, force: true });
  }
});

// --------------------------------------------------------------------------------
// lintSynonyms: per-file synonymsMaxBytes cap
// --------------------------------------------------------------------------------

test("lintSynonyms: a single synonyms.md over the byte cap errors", () => {
  const wikiRoot = tmpDir("kb-lint-synonyms-");
  try {
    mkdirSync(resolve(wikiRoot, "platform"), { recursive: true });
    const body = "# Synonyms\n\n" + "cart — Warenkorb — platform/func/a.md\n".repeat(20);
    writeFileSync(resolve(wikiRoot, "platform/synonyms.md"), body);
    const report = emptyReport();
    lintSynonyms(wikiRoot, new Set(["platform/func/a.md"]), report, sizeConfig({ synonymsMaxBytes: 50 }));
    assert.ok(report.errors.some((e) => e.includes("platform/synonyms.md") && e.includes("exceeds the 50-byte synonyms file cap")));
  } finally {
    rmSync(wikiRoot, { recursive: true, force: true });
  }
});

test("lintSynonyms: a split part-N.md over the byte cap errors, naming that part", () => {
  const wikiRoot = tmpDir("kb-lint-synonyms-");
  try {
    const dir = resolve(wikiRoot, "platform/synonyms");
    mkdirSync(dir, { recursive: true });
    writeFileSync(resolve(dir, "index.md"), "# Synonyms (split)\n\nplatform/synonyms/part-1.md — cart … cart\n");
    const body = "# Synonyms\n\n" + "cart — Warenkorb — platform/func/a.md\n".repeat(20);
    writeFileSync(resolve(dir, "part-1.md"), body);
    const report = emptyReport();
    lintSynonyms(wikiRoot, new Set(["platform/func/a.md"]), report, sizeConfig({ synonymsMaxBytes: 50 }));
    assert.ok(report.errors.some((e) => e.includes("platform/synonyms/part-1.md") && e.includes("exceeds the 50-byte synonyms file cap")));
  } finally {
    rmSync(wikiRoot, { recursive: true, force: true });
  }
});

test("lintSynonyms: within the cap produces no size error", () => {
  const wikiRoot = tmpDir("kb-lint-synonyms-");
  try {
    mkdirSync(resolve(wikiRoot, "platform"), { recursive: true });
    writeFileSync(resolve(wikiRoot, "platform/synonyms.md"), "# Synonyms\n\ncart — Warenkorb — platform/func/a.md\n");
    const report = emptyReport();
    lintSynonyms(wikiRoot, new Set(["platform/func/a.md"]), report, sizeConfig());
    assert.deepEqual(report.errors, []);
  } finally {
    rmSync(wikiRoot, { recursive: true, force: true });
  }
});

// --------------------------------------------------------------------------------
// lintTreeSafety: hygiene downgrade when the source cache is unavailable
// --------------------------------------------------------------------------------

test("lintTreeSafety: a non-allowlisted link becomes a warning, not an error, when the source cache can't confirm it", () => {
  const wikiRoot = tmpDir("kb-lint-treesafety-");
  try {
    const platformRoot = resolve(wikiRoot, "platform/dev/6.7");
    mkdirSync(platformRoot, { recursive: true });
    // sourceHash names a hash that will never be found in .cache/src/ (a fresh checkout after
    // `wiki:clean`) — sourceText stays undefined, so the exemptible finding below must warn.
    writeFileSync(
      resolve(platformRoot, "a.md"),
      ["---", "id: platform/dev/6.7/a.md", "sourceHash: does-not-exist-in-cache", "---", "", "See https://not-allowlisted.example.com/page for details.", ""].join("\n"),
    );
    const report = emptyReport();
    lintTreeSafety(resolve(wikiRoot, "platform"), report, sizeConfig());
    assert.deepEqual(report.errors, []);
    assert.ok(report.warnings.some((w) => w.includes("external link not https on an allowlisted host") && w.includes("source cache unavailable")));
  } finally {
    rmSync(wikiRoot, { recursive: true, force: true });
  }
});

test("lintTreeSafety: a non-exemptible hygiene class (HTML comment) still errors even without a source cache", () => {
  const wikiRoot = tmpDir("kb-lint-treesafety-");
  try {
    const platformRoot = resolve(wikiRoot, "platform/dev/6.7");
    mkdirSync(platformRoot, { recursive: true });
    writeFileSync(
      resolve(platformRoot, "a.md"),
      ["---", "id: platform/dev/6.7/a.md", "sourceHash: does-not-exist-in-cache", "---", "", "<!-- a comment -->", ""].join("\n"),
    );
    const report = emptyReport();
    lintTreeSafety(resolve(wikiRoot, "platform"), report, sizeConfig());
    assert.ok(report.errors.some((e) => e.includes("HTML comment in output")));
  } finally {
    rmSync(wikiRoot, { recursive: true, force: true });
  }
});

// --------------------------------------------------------------------------------
// lintGuidelines: base file's first ## heading must be "Index"
// --------------------------------------------------------------------------------

// A base file with a real surface: prompts/guideline.md requires ## Index only when
// base is null AND the file has at least one surface (matches validateGuidelineOutput's
// own gate) — a base file with zero configured surfaces carries no Index requirement.
const CURATED: GuidelineCuratedFile[] = [
  { file: "architecture-guidelines.md", base: null, scope: "architecture", sourceInputs: [] },
  { file: "fe-architecture-guidelines.md", base: "architecture-guidelines.md", scope: "frontend architecture", sourceInputs: [] },
];

function guidelinesConfig(): PlatformConfig {
  return {
    ...sizeConfig(),
    guidelines: { enabled: true, versions: ["6.7"], codeCheckouts: {}, curatedFiles: CURATED },
  } as unknown as PlatformConfig;
}

function writeGuideline(dir: string, body: string): void {
  const versionDir = resolve(dir, "platform/guidelines/6.7");
  mkdirSync(versionDir, { recursive: true });
  writeFileSync(
    resolve(versionDir, "architecture-guidelines.md"),
    [
      "---",
      "id: platform/guidelines/6.7/architecture-guidelines.md",
      "title: Architecture",
      "docType: guideline",
      'version: "6.7"',
      "summary: Summary",
      "keywords: [a, b, c, d, e, f, g, h]",
      `sources: [{url: "https://example.com/a", hash: "abc123"}]`,
      "codeVersion: 6.7.0.0+deadbeef",
      "lastBuilt: 2026-09-14",
      "---",
      "",
      body,
      "",
    ].join("\n"),
  );
}

test("lintGuidelines: a base file whose first ## heading is not Index errors", () => {
  const wikiRoot = tmpDir("kb-lint-guidelines-index-");
  try {
    writeGuideline(wikiRoot, "## Overview\n\nNot Index.");
    const report = emptyReport();
    lintGuidelines(guidelinesConfig(), wikiRoot, report);
    assert.ok(report.errors.some((e) => e.includes(`first ## heading must be "Index"`) && e.includes('got "Overview"')));
  } finally {
    rmSync(wikiRoot, { recursive: true, force: true });
  }
});

test("lintGuidelines: a base file with no ## heading at all errors, naming 'none'", () => {
  const wikiRoot = tmpDir("kb-lint-guidelines-index-");
  try {
    writeGuideline(wikiRoot, "Plain prose, no heading.");
    const report = emptyReport();
    lintGuidelines(guidelinesConfig(), wikiRoot, report);
    assert.ok(report.errors.some((e) => e.includes(`first ## heading must be "Index"`) && e.includes("got none")));
  } finally {
    rmSync(wikiRoot, { recursive: true, force: true });
  }
});

test("lintGuidelines: a base file starting with ## Index passes that check", () => {
  const wikiRoot = tmpDir("kb-lint-guidelines-index-");
  try {
    writeGuideline(wikiRoot, "## Index\n\nOverview text.");
    const report = emptyReport();
    lintGuidelines(guidelinesConfig(), wikiRoot, report);
    assert.ok(!report.errors.some((e) => e.includes("first ## heading must be")));
  } finally {
    rmSync(wikiRoot, { recursive: true, force: true });
  }
});
