import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { resolve, join } from "node:path";
import { collectGuidelinePages } from "../ingest/platform/build.js";
import { lintGuidelines, lintGuidelineState, type LintReport } from "../ingest/platform/lint.js";
import type { GuidelineCuratedFile, IngestionState, PlatformConfig } from "../ingest/shared/types.js";
import { tmpDir } from "./helpers.js";

function baseConfig(curatedFiles: GuidelineCuratedFile[], versions: string[] = ["6.7"]): PlatformConfig {
  return {
    layer: "platform",
    sources: [],
    rateLimits: {
      githubApiPerHour: 1,
      developerDocsPerSecond: 1,
      merchantDocsPerSecond: 1,
      requestTimeoutMs: 1000,
      maxRedirects: 1,
      maxBodyBytesDefault: 1,
      maxBodyBytesBulk: 1,
    },
    allowlistHosts: [],
    hubs: [],
    synonyms: { enabled: false },
    ingest: { waveSize: 1, batchSize: 1 },
    articleTokens: { min: 1, max: 1, longMax: 1, longSourceWordThreshold: 1, bandTolerance: 1 },
    sizeLimits: {
      pageMaxBytes: 32768,
      hubMaxBytes: 65536,
      synonymsMaxBytes: 262144,
      generatedFileMaxBytes: 524288,
      committedFileMaxBytes: 1048576,
      wikiPackageMaxBytes: 12582912,
      guidelineFileMaxBytes: 400,
      guidelinePairMaxBytes: 700,
    },
    eval: { hitAt2CallsGate: 1 },
    guidelines: {
      enabled: true,
      versions,
      codeCheckouts: {},
      curatedFiles,
    },
  };
}

const CURATED: GuidelineCuratedFile[] = [
  { file: "architecture-guidelines.md", base: null, scope: "architecture", sourceInputs: [] },
  { file: "be-architecture-guidelines.md", base: "architecture-guidelines.md", scope: "be architecture", sourceInputs: [] },
  { file: "code-guidelines.md", base: null, scope: "code", sourceInputs: [] },
  { file: "qa-guidelines.md", base: null, scope: "qa", sourceInputs: [] },
];

function guidelineFrontmatter(id: string, version: string, extra = ""): string {
  return `---
id: ${id}
title: Title
docType: guideline
version: "${version}"
summary: Summary line
keywords: [a, b, c, d, e, f, g, h]
sources: [{url: "https://example.com/a", hash: "abc123"}]
codeVersion: 6.7.0.0+deadbeef
lastBuilt: 2026-09-14
${extra}---
`;
}

function writeGuideline(dir: string, version: string, file: string, body: string, extra = ""): void {
  const versionDir = resolve(dir, "platform/guidelines", version);
  mkdirSync(versionDir, { recursive: true });
  const id = `platform/guidelines/${version}/${file}`;
  writeFileSync(resolve(versionDir, file), guidelineFrontmatter(id, version, extra) + body + "\n");
}

test("collectGuidelinePages: valid base+surface set is picked up with fileHash-based manifest entries", () => {
  const wikiRoot = tmpDir("kb-guidelines-build-");
  try {
    writeGuideline(wikiRoot, "6.7", "architecture-guidelines.md", "# Architecture\n\nIntro.\n\n[be-architecture-guidelines.md](platform/guidelines/6.7/be-architecture-guidelines.md)");
    writeGuideline(wikiRoot, "6.7", "be-architecture-guidelines.md", "# BE architecture\n\nDetails.");
    const config = baseConfig(CURATED);
    const result = collectGuidelinePages(wikiRoot, config);
    assert.equal(result.counts["guidelines/6.7"], 2);
    assert.equal(result.pages.length, 2);
    const entry = result.manifestEntries["platform/guidelines/6.7/architecture-guidelines.md"];
    assert.ok(entry);
    assert.equal(entry.sourceHash, entry.fileHash);
  } finally {
    rmSync(wikiRoot, { recursive: true, force: true });
  }
});

test("collectGuidelinePages: missing platform/guidelines/ dir yields count 0, not a crash", () => {
  const wikiRoot = tmpDir("kb-guidelines-build-");
  try {
    const config = baseConfig(CURATED);
    const result = collectGuidelinePages(wikiRoot, config);
    assert.equal(result.counts["guidelines/6.7"], 0);
    assert.equal(result.pages.length, 0);
  } finally {
    rmSync(wikiRoot, { recursive: true, force: true });
  }
});

test("lintGuidelines: valid base+surface set passes with no errors", () => {
  const wikiRoot = tmpDir("kb-guidelines-lint-");
  try {
    writeGuideline(wikiRoot, "6.7", "architecture-guidelines.md", "## Index\n\n[x](platform/guidelines/6.7/be-architecture-guidelines.md)");
    writeGuideline(wikiRoot, "6.7", "be-architecture-guidelines.md", "## BE");
    writeGuideline(wikiRoot, "6.7", "code-guidelines.md", "## Index\n\nC.");
    writeGuideline(wikiRoot, "6.7", "qa-guidelines.md", "## Index\n\nQ.");
    const config = baseConfig(CURATED);
    const report: LintReport = { errors: [], warnings: [] };
    const known = lintGuidelines(config, wikiRoot, report);
    assert.deepEqual(report.errors, []);
    assert.ok(known.has("platform/guidelines/6.7/architecture-guidelines.md"));
    assert.ok(known.has("platform/guidelines/6.7/be-architecture-guidelines.md"));
  } finally {
    rmSync(wikiRoot, { recursive: true, force: true });
  }
});

test("lintGuidelines: oversize file errors", () => {
  const wikiRoot = tmpDir("kb-guidelines-lint-");
  try {
    const bigBody = "x".repeat(500);
    writeGuideline(wikiRoot, "6.7", "architecture-guidelines.md", bigBody);
    writeGuideline(wikiRoot, "6.7", "code-guidelines.md", "# Code");
    writeGuideline(wikiRoot, "6.7", "qa-guidelines.md", "# QA");
    const config = baseConfig(CURATED.filter((f) => f.file !== "be-architecture-guidelines.md"));
    const report: LintReport = { errors: [], warnings: [] };
    lintGuidelines(config, wikiRoot, report);
    assert.ok(report.errors.some((e) => e.includes("architecture-guidelines.md") && e.includes("exceeds the 400-byte guideline file cap")));
  } finally {
    rmSync(wikiRoot, { recursive: true, force: true });
  }
});

test("lintGuidelines: oversize base+surface pair errors", () => {
  const wikiRoot = tmpDir("kb-guidelines-lint-");
  try {
    writeGuideline(wikiRoot, "6.7", "architecture-guidelines.md", "x".repeat(150) + "\n\n[be-architecture-guidelines.md](platform/guidelines/6.7/be-architecture-guidelines.md)");
    writeGuideline(wikiRoot, "6.7", "be-architecture-guidelines.md", "y".repeat(150));
    writeGuideline(wikiRoot, "6.7", "code-guidelines.md", "# Code");
    writeGuideline(wikiRoot, "6.7", "qa-guidelines.md", "# QA");
    const config = baseConfig(CURATED);
    const report: LintReport = { errors: [], warnings: [] };
    lintGuidelines(config, wikiRoot, report);
    assert.ok(report.errors.some((e) => e.includes("base+surface pair is") && e.includes("700-byte cap")));
  } finally {
    rmSync(wikiRoot, { recursive: true, force: true });
  }
});

test("lintGuidelines: a well-placed > [expert] section passes; a stray or misplaced tag errors with the file path", () => {
  const wikiRoot = tmpDir("kb-guidelines-lint-");
  try {
    writeGuideline(wikiRoot, "6.7", "architecture-guidelines.md", "## Index\n\n[x](platform/guidelines/6.7/be-architecture-guidelines.md)");
    writeGuideline(wikiRoot, "6.7", "be-architecture-guidelines.md", "## BE\n\nx\n\n## Twig\n> [expert]\n\n- rule");
    writeGuideline(wikiRoot, "6.7", "code-guidelines.md", "## Index\n> [expert]\n\nC.");
    writeGuideline(wikiRoot, "6.7", "qa-guidelines.md", "## Index\n\nQ.\n> [expert]");
    const config = baseConfig(CURATED);
    const report: LintReport = { errors: [], warnings: [] };
    lintGuidelines(config, wikiRoot, report);
    assert.ok(!report.errors.some((e) => e.includes("be-architecture-guidelines.md")), report.errors.join("\n"));
    assert.ok(report.errors.some((e) => e.startsWith("platform/guidelines/6.7/code-guidelines.md: ## Index:") && e.includes("not allowed")));
    assert.ok(report.errors.some((e) => e.startsWith("platform/guidelines/6.7/qa-guidelines.md: ## Index:") && e.includes("first line under the heading")));
  } finally {
    rmSync(wikiRoot, { recursive: true, force: true });
  }
});

test("lintGuidelines: unknown file name errors", () => {
  const wikiRoot = tmpDir("kb-guidelines-lint-");
  try {
    writeGuideline(wikiRoot, "6.7", "foo-guidelines.md", "# Foo");
    writeGuideline(wikiRoot, "6.7", "architecture-guidelines.md", "# Architecture");
    writeGuideline(wikiRoot, "6.7", "code-guidelines.md", "# Code");
    writeGuideline(wikiRoot, "6.7", "qa-guidelines.md", "# QA");
    const config = baseConfig(CURATED.filter((f) => f.file !== "be-architecture-guidelines.md"));
    const report: LintReport = { errors: [], warnings: [] };
    lintGuidelines(config, wikiRoot, report);
    assert.ok(report.errors.some((e) => e.includes("foo-guidelines.md") && e.includes("not in guidelines.curatedFiles")));
  } finally {
    rmSync(wikiRoot, { recursive: true, force: true });
  }
});

test("lintGuidelines: base missing a surface link errors", () => {
  const wikiRoot = tmpDir("kb-guidelines-lint-");
  try {
    writeGuideline(wikiRoot, "6.7", "architecture-guidelines.md", "# Architecture\n\nNo link here.");
    writeGuideline(wikiRoot, "6.7", "be-architecture-guidelines.md", "# BE architecture");
    writeGuideline(wikiRoot, "6.7", "code-guidelines.md", "# Code");
    writeGuideline(wikiRoot, "6.7", "qa-guidelines.md", "# QA");
    const config = baseConfig(CURATED);
    const report: LintReport = { errors: [], warnings: [] };
    lintGuidelines(config, wikiRoot, report);
    assert.ok(report.errors.some((e) => e.includes("does not link its surface file platform/guidelines/6.7/be-architecture-guidelines.md")));
  } finally {
    rmSync(wikiRoot, { recursive: true, force: true });
  }
});

test("lintGuidelines: missing curated file errors when the version dir exists, warns when the dir is absent", () => {
  const wikiRoot = tmpDir("kb-guidelines-lint-");
  try {
    writeGuideline(wikiRoot, "6.7", "architecture-guidelines.md", "# Architecture\n\n[be-architecture-guidelines.md](platform/guidelines/6.7/be-architecture-guidelines.md)");
    writeGuideline(wikiRoot, "6.7", "be-architecture-guidelines.md", "# BE architecture");
    // code-guidelines.md and qa-guidelines.md are curated but not written for 6.7.
    const config = baseConfig(CURATED, ["6.7", "6.6"]);
    const report: LintReport = { errors: [], warnings: [] };
    lintGuidelines(config, wikiRoot, report);
    assert.ok(report.errors.some((e) => e.includes("platform/guidelines/6.7/code-guidelines.md: curated guideline file missing")));
    assert.ok(report.warnings.some((w) => w.includes("platform/guidelines/6.6/ does not exist yet")));
    assert.ok(!report.errors.some((e) => e.includes("6.6")));
  } finally {
    rmSync(wikiRoot, { recursive: true, force: true });
  }
});

test("lintGuidelineState: a failed state.guidelines entry is a warning, not an error, listing its key", () => {
  const state = {
    sources: {},
    hubs: {},
    synonyms: { concepts: {}, synonymsPromptHash: null },
    guidelines: {
      files: {
        "6.7/architecture-guidelines.md": { version: "6.7", file: "architecture-guidelines.md", guidelineState: "failed" },
        "6.7/code-guidelines.md": { version: "6.7", file: "code-guidelines.md", guidelineState: "ok" },
      },
    },
    prompts: { pagePromptHash: null, hubPromptHash: null, synonymsPromptHash: null },
    build: { lastBuilt: null },
  } satisfies IngestionState;
  const report: LintReport = { errors: [], warnings: [] };
  lintGuidelineState(state, report);
  assert.deepEqual(report.errors, []);
  assert.equal(report.warnings.length, 1);
  assert.ok(report.warnings[0].includes("6.7/architecture-guidelines.md"));
});
