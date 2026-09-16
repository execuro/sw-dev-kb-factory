/**
 * Gate ⊆ lint consistency: an output each phase's ingest gate accepts must also pass
 * `wiki:lint`'s own checks once placed in the committed tree — a gate/lint mismatch means a
 * writer's output could land in the wiki and only be caught later (or never), instead of at
 * ingest. One fixture per writer type (pages/hubs/guidelines/synonyms), each built to satisfy
 * its own gate (`validate*Output`/`validateSynonymsBatch`), then run through the matching
 * exported `lint.ts` functions against a temp wiki root.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { lintTreeSafety, lintHubs, lintGuidelines, lintSynonyms, type LintReport } from "../ingest/platform/lint.js";
import { validatePageOutput, type PageWorkItem } from "../ingest/platform/pages.js";
import { validateHubOutput } from "../ingest/platform/hubs.js";
import { validateGuidelineOutput, type GuidelineWorkItem, type PackageRoots } from "../ingest/platform/guidelines.js";
import { validateSynonymsBatch, writeSynonymsOutput } from "../ingest/platform/synonyms.js";
import type { IngestionState, PlatformConfig, WorkItem } from "../ingest/shared/types.js";
import { emptyReport, emptyState, words } from "./helpers.js";

function tempWiki(prefix: string): string {
  const dir = mkdtempSync(join(tmpdir(), prefix));
  mkdirSync(resolve(dir, "platform"), { recursive: true });
  return dir;
}

// --------------------------------------------------------------------------------
// pages
// --------------------------------------------------------------------------------

test("gate ⊆ lint: a page accepted by validatePageOutput passes lintTreeSafety with 0 errors/warnings", () => {
  const wikiRoot = tempWiki("kb-gate-lint-pages-");
  try {
    const config = {
      sizeLimits: { pageMaxBytes: 32768, generatedFileMaxBytes: 1024 * 1024 },
      articleTokens: { min: 300, max: 800, longMax: 1200, longSourceWordThreshold: 1500, bandTolerance: 0.2 },
    } as unknown as PlatformConfig;

    const fm = {
      id: "platform/dev/6.7/topic.md",
      title: "Topic Page",
      docType: "developer",
      version: "6.7",
      versions: ["6.7"],
      sourceUrl: "https://developer.shopware.com/docs/topic",
      sourceHash: "abc123",
      keywords: ["topic", "alpha", "beta", "gamma", "delta", "epsilon", "zeta", "eta"],
      summary: "A factual one-line summary of the topic page.",
      lastBuilt: "2026-09-14",
    };
    const body = [
      "## What it is",
      words(40) + ".",
      "",
      "## When to use",
      words(40) + ".",
      "",
      "## Key steps / config",
      words(50) + ".",
      "",
      "## Essential identifiers",
      "`SomeClass::someMethod()` " + words(30),
      "",
      "## Gotchas",
      words(30) + ".",
      "",
      "## Version notes",
      words(20) + ".",
    ].join("\n");
    const text = `---\n${Object.entries(fm)
      .map(([k, v]) => `${k}: ${Array.isArray(v) ? `[${v.map((x) => `"${x}"`).join(", ")}]` : typeof v === "string" ? `"${v}"` : v}`)
      .join("\n")}\n---\n${body}\n`;

    const item: PageWorkItem = {
      path: fm.id,
      outputPath: "unused",
      frontmatter: { title: fm.title, docType: fm.docType, version: fm.version, versions: fm.versions, sourceUrl: fm.sourceUrl, sourceHash: fm.sourceHash },
      links: [],
    };
    const stageDir = mkdtempSync(join(tmpdir(), "kb-gate-lint-pages-stage-"));
    const outAbsPath = resolve(stageDir, "out.md");
    writeFileSync(outAbsPath, text, "utf8");
    const gateResult = validatePageOutput(item, outAbsPath, config, new Set([fm.id]), undefined);
    assert.equal(gateResult.ok, true, gateResult.ok ? undefined : gateResult.reason);
    rmSync(stageDir, { recursive: true, force: true });

    const destAbs = resolve(wikiRoot, fm.id);
    mkdirSync(resolve(destAbs, ".."), { recursive: true });
    writeFileSync(destAbs, text, "utf8");

    const report = emptyReport();
    lintTreeSafety(resolve(wikiRoot, "platform"), report, config);
    assert.deepEqual(report.errors, []);
    assert.deepEqual(report.warnings, []);
  } finally {
    rmSync(wikiRoot, { recursive: true, force: true });
  }
});

// --------------------------------------------------------------------------------
// hubs
// --------------------------------------------------------------------------------

test("gate ⊆ lint: a hub accepted by validateHubOutput passes lintTreeSafety + lintHubs with 0 errors", () => {
  const wikiRoot = tempWiki("kb-gate-lint-hubs-");
  try {
    const config = { sizeLimits: { hubMaxBytes: 65536, generatedFileMaxBytes: 1024 * 1024 } } as unknown as PlatformConfig;
    const text = [
      "---",
      "id: platform/hubs/plugin.md",
      "title: Plugin",
      "summary: About plugins",
      `keywords: ["one", "two", "three", "four", "five", "six", "seven", "eight"]`,
      "members: [platform/dev/6.7/a.md, platform/func/b.md]",
      "lastBuilt: 2026-09-14",
      "---",
      "",
      "Plugins overview.",
      "",
      "- [A](platform/dev/6.7/a.md) — about a",
      "- [B](platform/func/b.md) — about b",
      "",
    ].join("\n");
    const item = { path: "platform/hubs/plugin.md", outputPath: "unused", members: ["platform/dev/6.7/a.md", "platform/func/b.md"] } as unknown as WorkItem;
    const knownPaths = new Set(["platform/dev/6.7/a.md", "platform/func/b.md"]);
    const stageDir = mkdtempSync(join(tmpdir(), "kb-gate-lint-hubs-stage-"));
    const outAbsPath = resolve(stageDir, "out.md");
    writeFileSync(outAbsPath, text, "utf8");
    const gateResult = validateHubOutput(item, outAbsPath, config, knownPaths);
    assert.deepEqual(gateResult, { ok: true });
    rmSync(stageDir, { recursive: true, force: true });

    const destAbs = resolve(wikiRoot, "platform/hubs/plugin.md");
    mkdirSync(resolve(destAbs, ".."), { recursive: true });
    writeFileSync(destAbs, text, "utf8");

    const report = emptyReport();
    lintTreeSafety(resolve(wikiRoot, "platform"), report, config);
    assert.deepEqual(report.errors, []);

    const state = emptyState();
    state.hubs.plugin = { slug: "plugin", memberPaths: ["platform/dev/6.7/a.md", "platform/func/b.md"], hubState: "ok" };
    const hubKnownPaths = new Set(knownPaths);
    const hubReport = emptyReport();
    lintHubs(config, state, wikiRoot, hubKnownPaths, hubReport);
    assert.deepEqual(hubReport.errors, []);
  } finally {
    rmSync(wikiRoot, { recursive: true, force: true });
  }
});

// --------------------------------------------------------------------------------
// guidelines
// --------------------------------------------------------------------------------

test("gate ⊆ lint: a guideline accepted by validateGuidelineOutput passes lintTreeSafety + lintGuidelines with 0 errors", () => {
  const wikiRoot = tempWiki("kb-gate-lint-guidelines-");
  try {
    const version = "6.7";
    const codeVersion = "6.7.0.0+testcode1";
    const noPackageRoots: PackageRoots = { core: "/nonexistent-core", storefront: "/nonexistent-storefront", administration: "/nonexistent-administration" };
    const wikiPath = `platform/guidelines/${version}/code-guidelines.md`;
    const sources = [{ url: "docs:resources/guidelines/code/core.md", hash: "abc123" }];
    const item: GuidelineWorkItem = {
      path: wikiPath,
      outputPath: "unused",
      version,
      file: "code-guidelines.md",
      base: null,
      scope: "core code guidelines",
      wikiPath,
      sourceInputs: [],
      missingInputs: [],
      codeRoot: { mode: "vendor", packageRoots: noPackageRoots, codeVersion },
      codeCheck: { flags: { absent: [], deprecated: [], unread: [] } },
      frontmatter: { id: wikiPath, docType: "guideline", version, sources, codeVersion },
    };
    const keywords = ["code", "architecture", "context", "deprecation", "service", "decoration", "event", "routing"];
    const text = [
      "---",
      `id: ${wikiPath}`,
      "title: Code guidelines",
      "docType: guideline",
      `version: "${version}"`,
      "summary: Core code guidelines.",
      `keywords: [${keywords.join(", ")}]`,
      `sources: [{url: "${sources[0].url}", hash: "${sources[0].hash}"}]`,
      `codeVersion: ${codeVersion}`,
      "lastBuilt: 2026-09-14",
      "---",
      "",
      "## General principles",
      "",
      "Decorate, never extend a final core service.",
      "",
      `Read more: ${sources[0].url}`,
      "",
    ].join("\n");

    const config = {
      sizeLimits: { guidelineFileMaxBytes: 65536, guidelinePairMaxBytes: 131072, generatedFileMaxBytes: 1024 * 1024 },
      guidelines: { enabled: true, versions: [version], curatedFiles: [{ file: "code-guidelines.md", base: null, scope: item.scope, sourceInputs: [] }] },
    } as unknown as PlatformConfig;

    const stageDir = mkdtempSync(join(tmpdir(), "kb-gate-lint-guidelines-stage-"));
    const outAbsPath = resolve(stageDir, "out.md");
    writeFileSync(outAbsPath, text, "utf8");
    const gateResult = validateGuidelineOutput(item, outAbsPath, config, wikiRoot);
    assert.equal(gateResult.ok, true, gateResult.ok ? undefined : gateResult.reason);
    rmSync(stageDir, { recursive: true, force: true });

    const destAbs = resolve(wikiRoot, wikiPath);
    mkdirSync(resolve(destAbs, ".."), { recursive: true });
    writeFileSync(destAbs, text, "utf8");

    const report = emptyReport();
    lintTreeSafety(resolve(wikiRoot, "platform"), report, config);
    assert.deepEqual(report.errors, []);

    const guidelinesReport = emptyReport();
    lintGuidelines(config, wikiRoot, guidelinesReport);
    assert.deepEqual(guidelinesReport.errors, []);
  } finally {
    rmSync(wikiRoot, { recursive: true, force: true });
  }
});

// --------------------------------------------------------------------------------
// synonyms
// --------------------------------------------------------------------------------

test("gate ⊆ lint: a synonyms batch accepted by validateSynonymsBatch, merged by writeSynonymsOutput, passes lintTreeSafety + lintSynonyms with 0 errors", () => {
  const wikiRoot = tempWiki("kb-gate-lint-synonyms-");
  try {
    const knownPaths = new Set(["platform/dev/6.7/a.md"]);
    const config = { sizeLimits: { synonymsMaxBytes: 262144, generatedFileMaxBytes: 1024 * 1024 } } as unknown as PlatformConfig;
    const outText = "topic-alias — alias-a, alias-b — platform/dev/6.7/a.md\n";
    const stageDir = mkdtempSync(join(tmpdir(), "kb-gate-lint-synonyms-stage-"));
    const outputPath = resolve(stageDir, "batch-01.md");
    writeFileSync(outputPath, outText, "utf8");
    const item = { path: "synonyms-batch-01", outputPath } as unknown as WorkItem;
    const concepts = [{ id: "x", canonicalKeyword: "topic-alias", keywords: ["topic-alias"], paths: ["platform/dev/6.7/a.md"], pages: [] }];
    const outPhaseReal = stageDir;
    const gateResult = validateSynonymsBatch(item, concepts, knownPaths, outPhaseReal);
    assert.equal(gateResult.ok, true, gateResult.ok ? undefined : gateResult.reason);
    rmSync(stageDir, { recursive: true, force: true });

    writeSynonymsOutput(wikiRoot, gateResult.ok ? gateResult.lines : [], config);

    const report = emptyReport();
    lintTreeSafety(resolve(wikiRoot, "platform"), report, config);
    assert.deepEqual(report.errors, []);

    const synonymsReport = emptyReport();
    lintSynonyms(wikiRoot, knownPaths, synonymsReport, config);
    assert.deepEqual(synonymsReport.errors, []);
  } finally {
    rmSync(wikiRoot, { recursive: true, force: true });
  }
});
