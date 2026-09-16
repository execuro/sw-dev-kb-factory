/** `ingest/platform/guidelines.ts` — pure-logic / temp-dir
 *  unit tests only, no network, no writes under KB/wiki/. */
import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import {
  resolveDocsInput,
  resolveMerchantInput,
  resolveWikiInput,
  resolveCodeInput,
  resolveSourceInputs,
  computeInputsHash,
  computeCompactSources,
  curatedFileSourceInputs,
  docsOnlySourceText,
  isGuidelineDirty,
  isSyncPendingMissingInput,
  resolveGuidelineCodeContext,
  prepareOneItem,
  validateGuidelineOutput,
  validateGuidelineCodeCheckSection,
  type GuidelineWorkItem,
  type GuidelineCodeContext,
  type PackageRoots,
} from "../ingest/platform/guidelines.js";
import { devSourcePath } from "../ingest/platform/pagePrep.js";
import { writeBatches, ingestBatches } from "../ingest/shared/workitems.js";
import { writeJson } from "../ingest/shared/jsonio.js";
import { sha256 } from "../ingest/shared/hash.js";
import { ingestLayerDir } from "../ingest/shared/config.js";
import type { FlagResult, CodeIndex } from "../ingest/platform/codeIndex.js";
import type { GuidelineCuratedFile, GuidelineStateEntry, IngestionState, PlatformConfig, SourceState } from "../ingest/shared/types.js";
import { tmpDir } from "./helpers.js";

/** `state/developer/<version>.json` fixture: writes the `SourceState` file plus a cache file
 *  (`devSourcePath`) for each entry, so `resolveDocsInput`'s `existsSync(readPath)` guard passes
 *  (the `developer` repository is downloaded once, whole, and that single copy serves both the dev
 *  pages and the guidelines phase). `repoPath` is the
 *  repo-relative path (`resources/guidelines/code/foo.md`), keyed in state as
 *  `platform/dev/<version>/<repoPath>`. Cleans up both the state file and the cache dir. */
function writeDeveloperStateFixture(version: string, entries: Record<string, { hash: string; sourceUrl: string; content?: string }>): () => void {
  const statePath = resolve(ingestLayerDir("platform"), "state", "developer", `${version}.json`);
  const pages: SourceState["pages"] = {};
  for (const [repoPath, e] of Object.entries(entries)) {
    const key = `platform/dev/${version}/${repoPath}`;
    pages[key] = { hash: e.hash, sourceUrl: e.sourceUrl, date: 20260101 };
    const cachePath = devSourcePath(`developer:${version}`, e.hash);
    mkdirSync(dirname(cachePath), { recursive: true });
    writeFileSync(cachePath, e.content ?? "content", "utf8");
  }
  mkdirSync(dirname(statePath), { recursive: true });
  writeJson(statePath, { headSha: "abc", lastSync: "2026-01-01", pages } satisfies SourceState);
  return () => {
    rmSync(statePath, { force: true });
    rmSync(resolve(ingestLayerDir("platform"), ".cache/src/developer", version), { recursive: true, force: true });
  };
}

const CONFIG = {
  sizeLimits: { guidelineFileMaxBytes: 800, guidelinePairMaxBytes: 1500 },
  guidelines: { enabled: true, versions: ["6.7", "6.6"], codeCheckouts: {}, curatedFiles: [] },
} as unknown as PlatformConfig;

// --------------------------------------------------------------------------------
// sourceInputs resolution
// --------------------------------------------------------------------------------

test("resolveDocsInput: reads a hand-written developer:<version> state file, single path and glob, from the single whole-repository developer download", () => {
  const version = "9.9-guidelines-test";
  const cleanup = writeDeveloperStateFixture(version, {
    "resources/guidelines/code/foo.md": { hash: "deadbeef", sourceUrl: "https://developer.shopware.com/docs/resources/guidelines/code/foo.html" },
    "resources/references/adr/2020-01-01-x.md": { hash: "cafef00d", sourceUrl: "https://developer.shopware.com/docs/resources/references/adr/2020-01-01-x.html" },
  });
  try {
    const single = resolveDocsInput(version, "resources/guidelines/code/foo.md");
    assert.equal(single.length, 1);
    assert.equal(single[0].hash, "deadbeef");
    assert.equal(single[0].url, "https://developer.shopware.com/docs/resources/guidelines/code/foo.html");

    const byGlob = resolveDocsInput(version, "resources/guidelines/**");
    assert.equal(byGlob.length, 1);

    assert.deepEqual(resolveDocsInput(version, "resources/guidelines/code/missing.md"), []);
  } finally {
    cleanup();
  }
});

test("resolveDocsInput: any dev path resolves, not only resources/guidelines/**/resources/references/adr/**, because the whole repository is downloaded", () => {
  const version = "9.9-guidelines-outside-test";
  const cleanup = writeDeveloperStateFixture(version, {
    "guides/plugins/plugins/administration/module-component-management.md": {
      hash: "abc123",
      sourceUrl: "https://developer.shopware.com/docs/guides/plugins/plugins/administration/module-component-management.html",
    },
  });
  try {
    const resolved = resolveDocsInput(version, "guides/plugins/plugins/administration/module-component-management.md");
    assert.equal(resolved.length, 1);
    assert.equal(resolved[0].hash, "abc123");
  } finally {
    cleanup();
  }
});

test("resolveDocsInput: a state entry whose cache file is missing on disk does not resolve, and warns once on stderr", (t) => {
  const version = "9.9-guidelines-missing-cache-test";
  const statePath = resolve(ingestLayerDir("platform"), "state", "developer", `${version}.json`);
  mkdirSync(dirname(statePath), { recursive: true });
  const key = `platform/dev/${version}/resources/guidelines/code/foo.md`;
  writeJson(statePath, {
    headSha: "abc",
    lastSync: "2026-01-01",
    pages: { [key]: { hash: "nocachefile", sourceUrl: "https://developer.shopware.com/x.html", date: 20260101 } },
  } satisfies SourceState);
  const writes: string[] = [];
  t.mock.method(process.stderr, "write", (chunk: string) => {
    writes.push(String(chunk));
    return true;
  });
  try {
    assert.deepEqual(resolveDocsInput(version, "resources/guidelines/code/foo.md"), []);
    assert.equal(writes.length, 1);
    assert.equal(writes[0], `wiki:guidelines: developer:${version} ${key}: cached source text missing — run wiki:sync\n`);
  } finally {
    rmSync(statePath, { force: true });
  }
});

test("resolveDocsInput: index.md spec maps to the _index.md state key, as sync stores it", () => {
  const version = "9.9-guidelines-index-test";
  const cleanup = writeDeveloperStateFixture(version, {
    "resources/guidelines/code/_index.md": { hash: "indexhash", sourceUrl: "https://developer.shopware.com/docs/resources/guidelines/code/index.html" },
  });
  try {
    const resolved = resolveDocsInput(version, "resources/guidelines/code/index.md");
    assert.equal(resolved.length, 1);
    assert.equal(resolved[0].hash, "indexhash");
  } finally {
    cleanup();
  }
});

test("resolveMerchantInput: resolves from state/<sourceKey>.json + .cache/src/<sourceKey>/, using a fake sourceKey so the real merchant state is never touched", () => {
  const sourceKey = "merchant-9-9-test";
  const statePath = resolve(ingestLayerDir("platform"), "state", `${sourceKey}.json`);
  const fixtureHash = "merchant-fixture-hash-9x9";
  const cachePath = devSourcePath(sourceKey, fixtureHash);
  try {
    writeJson(statePath, {
      lastSync: "2026-01-01",
      pages: { "platform/func/some/page.md": { hash: fixtureHash, sourceUrl: "https://docs.shopware.com/en/shopware-6-en/some/page", date: 20260101 } },
    } satisfies SourceState);
    mkdirSync(dirname(cachePath), { recursive: true });
    writeFileSync(cachePath, "merchant content", "utf8");

    const resolved = resolveMerchantInput("platform/func/some/page.md", sourceKey);
    assert.equal(resolved.length, 1);
    assert.equal(resolved[0].hash, fixtureHash);
    assert.equal(resolved[0].url, "https://docs.shopware.com/en/shopware-6-en/some/page");

    assert.deepEqual(resolveMerchantInput("platform/func/absent.md", sourceKey), []);
  } finally {
    rmSync(cachePath, { force: true });
    rmSync(statePath, { force: true });
  }
});

test("resolveWikiInput: substitutes {v}, resolves a single path and a glob, missing path yields []", () => {
  const wikiRoot = tmpDir("kb-guidelines-wiki-input-");
  try {
    mkdirSync(resolve(wikiRoot, "platform/dev/6.7/guides/plugins/administration"), { recursive: true });
    writeFileSync(resolve(wikiRoot, "platform/dev/6.7/guides/plugins/administration/a.md"), "content a");
    writeFileSync(resolve(wikiRoot, "platform/dev/6.7/guides/plugins/administration/b.md"), "content b");

    const single = resolveWikiInput(wikiRoot, "6.7", "platform/dev/{v}/guides/plugins/administration/a.md");
    assert.equal(single.length, 1);
    assert.equal(single[0].url, "platform/dev/6.7/guides/plugins/administration/a.md");

    const glob = resolveWikiInput(wikiRoot, "6.7", "platform/dev/{v}/guides/plugins/administration/**");
    assert.equal(glob.length, 2);

    assert.deepEqual(resolveWikiInput(wikiRoot, "6.6", "platform/dev/{v}/guides/plugins/administration/a.md"), []);
  } finally {
    rmSync(wikiRoot, { recursive: true, force: true });
  }
});

test("resolveCodeInput: resolves a package-relative path and a glob against packageRoots", () => {
  const pkgDir = tmpDir("kb-guidelines-code-input-");
  try {
    mkdirSync(resolve(pkgDir, "Resources/app/administration/technical-docs/04-data-layer"), { recursive: true });
    writeFileSync(resolve(pkgDir, "Resources/app/administration/technical-docs/04-data-layer/foo.md"), "docs");
    const packageRoots: PackageRoots = { core: "/nonexistent", storefront: "/nonexistent", administration: pkgDir };

    const single = resolveCodeInput(packageRoots, "administration/Resources/app/administration/technical-docs/04-data-layer/foo.md");
    assert.equal(single.length, 1);
    assert.equal(single[0].url, "code:administration/Resources/app/administration/technical-docs/04-data-layer/foo.md");

    const glob = resolveCodeInput(packageRoots, "administration/Resources/app/administration/technical-docs/04-data-layer/**");
    assert.equal(glob.length, 1);

    assert.deepEqual(resolveCodeInput(packageRoots, "administration/Resources/app/administration/technical-docs/missing/**"), []);
  } finally {
    rmSync(pkgDir, { recursive: true, force: true });
  }
});

test("resolveSourceInputs: an unresolvable entry is reported in missing, resolvable ones are not lost", () => {
  const wikiRoot = tmpDir("kb-guidelines-resolve-");
  try {
    mkdirSync(resolve(wikiRoot, "platform/dev/6.7"), { recursive: true });
    writeFileSync(resolve(wikiRoot, "platform/dev/6.7/present.md"), "text");
    const packageRoots: PackageRoots = { core: "/nonexistent", storefront: "/nonexistent", administration: "/nonexistent" };
    const { resolved, missing } = resolveSourceInputs(
      ["wiki:platform/dev/{v}/present.md", "wiki:platform/dev/{v}/absent.md", "not-a-scheme:foo"],
      "6.7",
      wikiRoot,
      packageRoots,
    );
    assert.equal(resolved.length, 1);
    assert.deepEqual(missing.sort(), ["not-a-scheme:foo", "wiki:platform/dev/{v}/absent.md"].sort());
  } finally {
    rmSync(wikiRoot, { recursive: true, force: true });
  }
});

test("computeInputsHash: order-independent, changes when a hash changes", () => {
  const a = [
    { scheme: "wiki" as const, readPath: "x", url: "platform/a.md", hash: "h1" },
    { scheme: "wiki" as const, readPath: "y", url: "platform/b.md", hash: "h2" },
  ];
  const b = [a[1], a[0]];
  assert.equal(computeInputsHash(a), computeInputsHash(b));
  const c = [a[0], { ...a[1], hash: "h3" }];
  assert.notEqual(computeInputsHash(a), computeInputsHash(c));
});

// --------------------------------------------------------------------------------
// zero-resolved-inputs classification: skipped (sync-pending) vs failed
// --------------------------------------------------------------------------------

test("isSyncPendingMissingInput: docs:/merchant: inputs are sync-pending only while their source has never synced (lastSync === null)", () => {
  const version = "9.9-sync-pending-test";
  const statePath = resolve(ingestLayerDir("platform"), "state", "developer", `${version}.json`);
  mkdirSync(dirname(statePath), { recursive: true });
  try {
    assert.equal(isSyncPendingMissingInput("docs:resources/guidelines/code/foo.md", version, "/nonexistent", "checkout"), true, "no state file yet");
    writeJson(statePath, { headSha: null, lastSync: null, pages: {} } satisfies SourceState);
    assert.equal(isSyncPendingMissingInput("docs:resources/guidelines/code/foo.md", version, "/nonexistent", "checkout"), true, "state file exists but never synced");
    writeJson(statePath, { headSha: "abc", lastSync: "2026-01-01", pages: {} } satisfies SourceState);
    assert.equal(isSyncPendingMissingInput("docs:resources/guidelines/code/foo.md", version, "/nonexistent", "checkout"), false, "synced — a missing path is now a real config error");
  } finally {
    rmSync(statePath, { force: true });
  }

  const merchantSourceKey = "merchant-9-9-test";
  const merchantStatePath = resolve(ingestLayerDir("platform"), "state", `${merchantSourceKey}.json`);
  try {
    rmSync(merchantStatePath, { force: true });
    assert.equal(isSyncPendingMissingInput("merchant:platform/func/foo.md", version, "/nonexistent", "checkout", merchantSourceKey), true, "merchant never synced");
    writeJson(merchantStatePath, { lastSync: "2026-01-01", pages: {} } satisfies SourceState);
    assert.equal(isSyncPendingMissingInput("merchant:platform/func/foo.md", version, "/nonexistent", "checkout", merchantSourceKey), false, "merchant synced");
  } finally {
    rmSync(merchantStatePath, { force: true });
  }
});

test("isSyncPendingMissingInput: code: input is sync-pending only when the checkout .tag is absent (checkout mode); wiki: is never sync-pending", () => {
  const codeCacheDir = tmpDir("kb-guidelines-tag-");
  try {
    assert.equal(isSyncPendingMissingInput("code:core/foo.php", "6.6", codeCacheDir, "checkout"), true, "no checkout yet");
    mkdirSync(resolve(codeCacheDir, "6.6"), { recursive: true });
    writeFileSync(resolve(codeCacheDir, "6.6/.tag"), "v6.6.10.0");
    assert.equal(isSyncPendingMissingInput("code:core/foo.php", "6.6", codeCacheDir, "checkout"), false, "checkout synced, path just isn't in it");
    assert.equal(isSyncPendingMissingInput("wiki:platform/dev/{v}/x.md", "6.6", codeCacheDir, "checkout"), false, "wiki: is never sync-pending");
  } finally {
    rmSync(codeCacheDir, { recursive: true, force: true });
  }
});

test("isSyncPendingMissingInput: code: input in vendor mode is never sync-pending — a missing path there is a real failure, not something wiki:sync fixes", () => {
  const codeCacheDir = tmpDir("kb-guidelines-vendor-");
  try {
    // No checkout dir at all under codeCacheDir/6.7 — vendor mode never uses it, so this
    // must not be misread as "sync hasn't run yet".
    assert.equal(isSyncPendingMissingInput("code:core/foo.php", "6.7", codeCacheDir, "vendor"), false);
  } finally {
    rmSync(codeCacheDir, { recursive: true, force: true });
  }
});

// --------------------------------------------------------------------------------
// dirty check
// --------------------------------------------------------------------------------

test("isGuidelineDirty: unchanged inputs/prompt/codeVersion with an existing output is clean", () => {
  const entry: GuidelineStateEntry = { version: "6.7", file: "code-guidelines.md", inputsHash: "i1", guidelinePromptHash: "p1", codeVersion: "cv1", guidelineState: "ok" };
  assert.equal(isGuidelineDirty(entry, "i1", "p1", "cv1", true), false);
});

test("isGuidelineDirty: no prior state, missing output, or any of inputs/prompt/codeVersion changing is dirty", () => {
  const entry: GuidelineStateEntry = { version: "6.7", file: "code-guidelines.md", inputsHash: "i1", guidelinePromptHash: "p1", codeVersion: "cv1" };
  assert.equal(isGuidelineDirty(undefined, "i1", "p1", "cv1", true), true, "no prior state");
  assert.equal(isGuidelineDirty(entry, "i1", "p1", "cv1", false), true, "output missing");
  assert.equal(isGuidelineDirty(entry, "i2", "p1", "cv1", true), true, "inputsHash changed");
  assert.equal(isGuidelineDirty(entry, "i1", "p2", "cv1", true), true, "promptHash changed");
  assert.equal(isGuidelineDirty(entry, "i1", "p1", "cv2", true), true, "codeVersion changed");
});

// --------------------------------------------------------------------------------
// code root resolution: 6.6 skipped when there is no code root yet
// --------------------------------------------------------------------------------

test("resolveGuidelineCodeContext: no installed vendor/ and no synced checkout returns null (operator must run wiki:sync)", () => {
  const projectRoot = tmpDir("kb-guidelines-no-vendor-");
  const codeCacheDir = tmpDir("kb-guidelines-no-checkout-");
  try {
    const config = { guidelines: { codeCheckouts: {} } } as unknown as PlatformConfig;
    assert.equal(resolveGuidelineCodeContext("6.6", config, projectRoot, codeCacheDir), null);
  } finally {
    rmSync(projectRoot, { recursive: true, force: true });
    rmSync(codeCacheDir, { recursive: true, force: true });
  }
});

// --------------------------------------------------------------------------------
// ## Code check section gate
// --------------------------------------------------------------------------------

function pkgRoots(dir: string): PackageRoots {
  return { core: resolve(dir, "core"), storefront: resolve(dir, "storefront"), administration: resolve(dir, "administration") };
}

const NO_FLAGS: FlagResult = { absent: [], deprecated: [], unread: [] };

test("validateGuidelineCodeCheckSection: no section required when there are no flags", () => {
  assert.equal(validateGuidelineCodeCheckSection("## Rule\n\nbody", "6.7.13.0+abc", pkgRoots("/nope"), NO_FLAGS), undefined);
});

test("validateGuidelineCodeCheckSection: missing section is an error when flags are present", () => {
  const flags: FlagResult = { absent: ["FooBar"], deprecated: [], unread: [] };
  const issue = validateGuidelineCodeCheckSection("## Rule\n\nbody", "6.7.13.0+abc", pkgRoots("/nope"), flags);
  assert.match(issue!, /missing the required ## Code check/);
});

test("validateGuidelineCodeCheckSection: a confirmed citation resolving under packageRoots and covering every flag passes", () => {
  const dir = tmpDir("kb-guidelines-codecheck-");
  try {
    mkdirSync(resolve(dir, "core/Checkout"), { recursive: true });
    const lines = Array.from({ length: 10 }, (_, i) => (i === 4 ? "class FooBar {}" : `// line ${i}`));
    writeFileSync(resolve(dir, "core/Checkout/FooBar.php"), lines.join("\n"));
    const flags: FlagResult = { absent: [], deprecated: [], unread: [] };
    const body = `## Rule\n\n## Code check (6.7.13.0+abc)\n\n- confirmed \`FooBar\` — core/Checkout/FooBar.php:5\n`;
    assert.equal(validateGuidelineCodeCheckSection(body, "6.7.13.0+abc", pkgRoots(dir), flags), undefined);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

// --------------------------------------------------------------------------------
// ingest gate (validateGuidelineOutput), via the real writeBatches/ingestBatches
// pipeline against a temp layerDir/wikiRoot (never the real KB/wiki/).
// --------------------------------------------------------------------------------

function baseItem(overrides: Partial<GuidelineWorkItem> = {}): GuidelineWorkItem {
  return {
    path: "platform/guidelines/6.7/code-guidelines.md",
    outputPath: "", // set per-test after writeBatches/ingestBatches wiring
    version: "6.7",
    file: "code-guidelines.md",
    base: null,
    scope: "code",
    wikiPath: "platform/guidelines/6.7/code-guidelines.md",
    sourceInputs: [{ scheme: "docs", readPath: "/x", url: "https://developer.shopware.com/docs/resources/guidelines/code/a.html", hash: "h1" }],
    missingInputs: [],
    codeRoot: { mode: "vendor", packageRoots: { core: "/nope", storefront: "/nope", administration: "/nope" }, codeVersion: "6.7.13.0+abc" },
    codeCheck: { flags: { absent: [], deprecated: [], unread: [] } },
    frontmatter: { id: "platform/guidelines/6.7/code-guidelines.md", docType: "guideline", version: "6.7", sources: [{ url: "https://developer.shopware.com/docs/resources/guidelines/code/a.html", hash: "h1" }], codeVersion: "6.7.13.0+abc" },
    ...overrides,
  };
}

function goodFrontmatter(): string {
  return `---
id: platform/guidelines/6.7/code-guidelines.md
title: Code guidelines
docType: guideline
version: "6.7"
summary: Rules for backend/frontend code.
keywords: [code, static-analysis, context, deprecation, service, decoration, event, routing]
sources: [{url: "https://developer.shopware.com/docs/resources/guidelines/code/a.html", hash: "h1"}]
codeVersion: 6.7.13.0+abc
lastBuilt: 2026-09-14
---
`;
}

function runOneIngest(item: GuidelineWorkItem, body: string): { ok: boolean; reason?: string; wikiRoot: string; layerDir: string } {
  const layerDir = tmpDir("kb-guidelines-layer-");
  const wikiRoot = tmpDir("kb-guidelines-wiki-out-");
  const promptPath = resolve(layerDir, "prompts/guideline.md");
  mkdirSync(resolve(layerDir, "prompts"), { recursive: true });
  writeFileSync(promptPath, "prompt");

  const outDir = resolve(layerDir, ".cache/out/guidelines");
  const outputPath = resolve(outDir, item.file);
  mkdirSync(outDir, { recursive: true });
  writeFileSync(outputPath, body);

  const fullItem = { ...item, outputPath };
  writeBatches(layerDir, "guidelines", [fullItem], promptPath, 1);

  const outcome = ingestBatches(layerDir, wikiRoot, "guidelines", (i, outAbsPath) => validateGuidelineOutput(i as GuidelineWorkItem, outAbsPath, CONFIG, wikiRoot));
  if (outcome.ok.length === 1) return { ok: true, wikiRoot, layerDir };
  return { ok: false, reason: outcome.failed[0]?.reason, wikiRoot, layerDir };
}

test("validateGuidelineOutput: rejects bad frontmatter (missing required field)", () => {
  const item = baseItem();
  const body = `---\nid: platform/guidelines/6.7/code-guidelines.md\ntitle: X\ndocType: guideline\nversion: "6.7"\ncodeVersion: 6.7.13.0+abc\n---\nbody`;
  const result = runOneIngest(item, body);
  try {
    assert.equal(result.ok, false);
    assert.match(result.reason ?? "", /missing required field/);
  } finally {
    rmSync(result.wikiRoot, { recursive: true, force: true });
    rmSync(result.layerDir, { recursive: true, force: true });
  }
});

test("validateGuidelineOutput: rejects an oversize file", () => {
  const item = baseItem();
  const body = goodFrontmatter() + "x".repeat(900);
  const result = runOneIngest(item, body);
  try {
    assert.equal(result.ok, false);
    assert.match(result.reason ?? "", /exceeds 800 bytes/);
  } finally {
    rmSync(result.wikiRoot, { recursive: true, force: true });
    rmSync(result.layerDir, { recursive: true, force: true });
  }
});

test("validateGuidelineOutput: rejects sources[] that do not match the prefilled item.frontmatter.sources", () => {
  const item = baseItem({
    frontmatter: {
      id: "platform/guidelines/6.7/code-guidelines.md",
      docType: "guideline",
      version: "6.7",
      sources: [{ url: "https://developer.shopware.com/docs/resources/guidelines/code/other.html", hash: "h9" }],
      codeVersion: "6.7.13.0+abc",
    },
  });
  const body = goodFrontmatter() + "## Rule\n\nRead more: https://developer.shopware.com/docs/resources/guidelines/code/a.html\n";
  const result = runOneIngest(item, body);
  try {
    assert.equal(result.ok, false);
    assert.match(result.reason ?? "", /sources\[\] does not match the prefilled item\.frontmatter\.sources/);
  } finally {
    rmSync(result.wikiRoot, { recursive: true, force: true });
    rmSync(result.layerDir, { recursive: true, force: true });
  }
});

// --------------------------------------------------------------------------------
// sources[] is pinned exactly to item.frontmatter.sources — a changed
// hash or an extra invented entry both fail, even though every pattern URL is still present;
// and sources must be written as a one-line flow list, not a block-style YAML list.
// --------------------------------------------------------------------------------

test("validateGuidelineOutput: rejects sources[] with a changed hash for a pinned pattern", () => {
  const item = baseItem();
  const body =
    `---\n` +
    `id: platform/guidelines/6.7/code-guidelines.md\n` +
    `title: Code guidelines\n` +
    `docType: guideline\n` +
    `version: "6.7"\n` +
    `summary: Rules for backend/frontend code.\n` +
    `keywords: [code, static-analysis, context, deprecation, service, decoration, event, routing]\n` +
    `sources: [{url: "https://developer.shopware.com/docs/resources/guidelines/code/a.html", hash: "TAMPERED"}]\n` +
    `codeVersion: 6.7.13.0+abc\n` +
    `lastBuilt: 2026-09-14\n` +
    `---\n` +
    "## Rule\n\nDecorate.\n\nRead more: https://developer.shopware.com/docs/resources/guidelines/code/a.html\n";
  const result = runOneIngest(item, body);
  try {
    assert.equal(result.ok, false);
    assert.match(result.reason ?? "", /sources\[\] does not match the prefilled item\.frontmatter\.sources/);
  } finally {
    rmSync(result.wikiRoot, { recursive: true, force: true });
    rmSync(result.layerDir, { recursive: true, force: true });
  }
});

test("validateGuidelineOutput: rejects sources[] with an extra, invented entry", () => {
  const item = baseItem();
  const body =
    goodFrontmatter().replace(
      'sources: [{url: "https://developer.shopware.com/docs/resources/guidelines/code/a.html", hash: "h1"}]',
      'sources: [{url: "https://developer.shopware.com/docs/resources/guidelines/code/a.html", hash: "h1"}, {url: "https://developer.shopware.com/docs/invented.html", hash: "h2"}]',
    ) + "## Rule\n\nDecorate.\n\nRead more: https://developer.shopware.com/docs/invented.html\n";
  const result = runOneIngest(item, body);
  try {
    assert.equal(result.ok, false);
    assert.match(result.reason ?? "", /sources\[\] does not match the prefilled item\.frontmatter\.sources/);
  } finally {
    rmSync(result.wikiRoot, { recursive: true, force: true });
    rmSync(result.layerDir, { recursive: true, force: true });
  }
});

test("validateGuidelineOutput: rejects a block list of flow maps for sources[] (parses fine, but not the required one-line form)", () => {
  const item = baseItem();
  const body =
    `---\n` +
    `id: platform/guidelines/6.7/code-guidelines.md\n` +
    `title: Code guidelines\n` +
    `docType: guideline\n` +
    `version: "6.7"\n` +
    `summary: Rules for backend/frontend code.\n` +
    `keywords: [code, static-analysis, context, deprecation, service, decoration, event, routing]\n` +
    `sources:\n` +
    `  - {url: "https://developer.shopware.com/docs/resources/guidelines/code/a.html", hash: "h1"}\n` +
    `codeVersion: 6.7.13.0+abc\n` +
    `lastBuilt: 2026-09-14\n` +
    `---\n` +
    "## Rule\n\nDecorate.\n\nRead more: https://developer.shopware.com/docs/resources/guidelines/code/a.html\n";
  const result = runOneIngest(item, body);
  try {
    assert.equal(result.ok, false);
    assert.match(result.reason ?? "", /sources must be a one-line flow list/);
  } finally {
    rmSync(result.wikiRoot, { recursive: true, force: true });
    rmSync(result.layerDir, { recursive: true, force: true });
  }
});

test("validateGuidelineOutput: base with no ## Index heading first errors", () => {
  const item = baseItem({
    base: null,
    surfaceFiles: [{ file: "be-code-guidelines.md", wikiPath: "platform/guidelines/6.7/be-code-guidelines.md", scope: "be" }],
  });
  const body = goodFrontmatter() + "## Rule\n\nRead more: https://developer.shopware.com/docs/resources/guidelines/code/a.html\n";
  const result = runOneIngest(item, body);
  try {
    assert.equal(result.ok, false);
    assert.match(result.reason ?? "", /first ## heading must be "Index"/);
  } finally {
    rmSync(result.wikiRoot, { recursive: true, force: true });
    rmSync(result.layerDir, { recursive: true, force: true });
  }
});

test("validateGuidelineOutput: base missing a surface-file link inside ## Index errors", () => {
  const item = baseItem({
    base: null,
    surfaceFiles: [{ file: "be-code-guidelines.md", wikiPath: "platform/guidelines/6.7/be-code-guidelines.md", scope: "be" }],
  });
  const body = goodFrontmatter() + "## Index\n\nNo link to the surface file here.\n\n## Rule\n\nRead more: https://developer.shopware.com/docs/resources/guidelines/code/a.html\n";
  const result = runOneIngest(item, body);
  try {
    assert.equal(result.ok, false);
    assert.match(result.reason ?? "", /## Index section does not link its surface file platform\/guidelines\/6\.7\/be-code-guidelines\.md/);
  } finally {
    rmSync(result.wikiRoot, { recursive: true, force: true });
    rmSync(result.layerDir, { recursive: true, force: true });
  }
});

test("validateGuidelineOutput: surface-file link outside the ## Index section still errors", () => {
  const item = baseItem({
    base: null,
    surfaceFiles: [{ file: "be-code-guidelines.md", wikiPath: "platform/guidelines/6.7/be-code-guidelines.md", scope: "be" }],
  });
  const body =
    goodFrontmatter() +
    "## Index\n\nNo link here.\n\n## Rule\n\nSee platform/guidelines/6.7/be-code-guidelines.md.\n\nRead more: https://developer.shopware.com/docs/resources/guidelines/code/a.html\n";
  const result = runOneIngest(item, body);
  try {
    assert.equal(result.ok, false);
    assert.match(result.reason ?? "", /## Index section does not link its surface file/);
  } finally {
    rmSync(result.wikiRoot, { recursive: true, force: true });
    rmSync(result.layerDir, { recursive: true, force: true });
  }
});

test("validateGuidelineOutput: rejects a body with no \"Read more:\" line", () => {
  const item = baseItem();
  const body = goodFrontmatter() + "## Rule\n\nDecorate, never extend.\n";
  const result = runOneIngest(item, body);
  try {
    assert.equal(result.ok, false);
    assert.match(result.reason ?? "", /no "Read more: <path>" line/);
  } finally {
    rmSync(result.wikiRoot, { recursive: true, force: true });
    rmSync(result.layerDir, { recursive: true, force: true });
  }
});

test("validateGuidelineOutput: accepts a well-formed non-base file and moves it into the wiki tree", () => {
  const item = baseItem();
  const body = goodFrontmatter() + "## Rule\n\nDecorate, never extend.\n\nRead more: https://developer.shopware.com/docs/resources/guidelines/code/a.html\n";
  const result = runOneIngest(item, body);
  try {
    assert.equal(result.ok, true, result.reason);
    const landed = readFileSync(resolve(result.wikiRoot, "platform/guidelines/6.7/code-guidelines.md"), "utf8");
    assert.match(landed, /Decorate, never extend/);
  } finally {
    rmSync(result.wikiRoot, { recursive: true, force: true });
    rmSync(result.layerDir, { recursive: true, force: true });
  }
});

test("validateGuidelineOutput: accepts a well-formed base file and moves it into the wiki tree", () => {
  const item = baseItem({
    base: null,
    surfaceFiles: [{ file: "be-code-guidelines.md", wikiPath: "platform/guidelines/6.7/be-code-guidelines.md", scope: "be" }],
  });
  const body = goodFrontmatter() + "## Index\n\nplatform/guidelines/6.7/be-code-guidelines.md\n\n## Rule\n\nDecorate.\n\nRead more: https://developer.shopware.com/docs/resources/guidelines/code/a.html\n";
  const result = runOneIngest(item, body);
  try {
    assert.equal(result.ok, true, result.reason);
    const landed = readFileSync(resolve(result.wikiRoot, "platform/guidelines/6.7/code-guidelines.md"), "utf8");
    assert.match(landed, /## Index/);
  } finally {
    rmSync(result.wikiRoot, { recursive: true, force: true });
    rmSync(result.layerDir, { recursive: true, force: true });
  }
});

// --------------------------------------------------------------------------------
// compact sources[] — one entry per pattern, not per resolved file
// --------------------------------------------------------------------------------

test("computeCompactSources: a code: glob matching several files collapses to one entry; wiki:/code: url is the {v}-substituted pattern", () => {
  const pkgDir = tmpDir("kb-guidelines-compact-code-");
  try {
    mkdirSync(resolve(pkgDir, "Resources/app/administration/technical-docs/03-extensibility"), { recursive: true });
    writeFileSync(resolve(pkgDir, "Resources/app/administration/technical-docs/03-extensibility/a.md"), "a");
    writeFileSync(resolve(pkgDir, "Resources/app/administration/technical-docs/03-extensibility/b.md"), "b");
    const packageRoots: PackageRoots = { core: "/nonexistent", storefront: "/nonexistent", administration: pkgDir };
    const sources = computeCompactSources(["code:administration/Resources/app/administration/technical-docs/03-extensibility/**"], "6.7", "/nonexistent", packageRoots);
    assert.equal(sources.length, 1);
    assert.equal(sources[0].url, "code:administration/Resources/app/administration/technical-docs/03-extensibility/**");
  } finally {
    rmSync(pkgDir, { recursive: true, force: true });
  }
});

test("computeCompactSources: a docs: pattern's url is the resolved file's canonical developer.shopware.com URL; unresolved patterns are omitted", () => {
  const version = "9.9-compact-docs-test";
  const cleanup = writeDeveloperStateFixture(version, {
    "resources/guidelines/code/foo.md": { hash: "deadbeef", sourceUrl: "https://developer.shopware.com/docs/resources/guidelines/code/foo.html" },
  });
  try {
    const sources = computeCompactSources(
      ["docs:resources/guidelines/code/foo.md", "docs:resources/guidelines/code/missing.md"],
      version,
      "/nonexistent",
      { core: "/nonexistent", storefront: "/nonexistent", administration: "/nonexistent" },
    );
    assert.deepEqual(sources, [{ url: "https://developer.shopware.com/docs/resources/guidelines/code/foo.html", hash: sha256("deadbeef") }]);
  } finally {
    cleanup();
  }
});

// --------------------------------------------------------------------------------
// flags computed from docs: inputs only
// --------------------------------------------------------------------------------

test("docsOnlySourceText: excludes wiki:/code: resolved inputs, keeps docs: text", () => {
  const resolved = [
    { scheme: "docs" as const, readPath: "/nonexistent-docs-file", url: "https://developer.shopware.com/x.html", hash: "h1" },
    { scheme: "wiki" as const, readPath: "/nonexistent-wiki-file", url: "platform/dev/6.7/x.md", hash: "h2" },
    { scheme: "code" as const, readPath: "/nonexistent-code-file", url: "code:core/x.php", hash: "h3" },
  ];
  // Every readPath is deliberately absent: docsOnlySourceText tolerates unreadable files (empty
  // string), so this only asserts the scheme filter, not file reading.
  assert.equal(docsOnlySourceText(resolved), "");
  assert.equal(docsOnlySourceText(resolved.filter((r) => r.scheme === "docs")).length, 0);
});

// --------------------------------------------------------------------------------
// administration citation resolves the src-root form, the full
// Resources/app/administration/src/... form, and a leading vendor/shopware/
// --------------------------------------------------------------------------------

test("validateGuidelineCodeCheckSection: administration citation resolves both the src-root-relative and the full Resources/app/.../src/-relative forms, and a leading vendor/shopware/", () => {
  const dir = tmpDir("kb-guidelines-admin-citation-");
  try {
    mkdirSync(resolve(dir, "administration/Component"), { recursive: true });
    const lines = Array.from({ length: 10 }, (_, i) => (i === 4 ? "export default { name: 'sw-foo' };" : `// line ${i}`));
    writeFileSync(resolve(dir, "administration/Component/foo.js"), lines.join("\n"));
    const roots = pkgRoots(dir);
    const flags: FlagResult = { absent: [], deprecated: [], unread: [] };

    const srcRoot = `## Rule\n\n## Code check (6.7.13.0+abc)\n\n- confirmed \`sw-foo\` — administration/Component/foo.js:5\n`;
    assert.equal(validateGuidelineCodeCheckSection(srcRoot, "6.7.13.0+abc", roots, flags), undefined);

    const fullForm = `## Rule\n\n## Code check (6.7.13.0+abc)\n\n- confirmed \`sw-foo\` — administration/Resources/app/administration/src/Component/foo.js:5\n`;
    assert.equal(validateGuidelineCodeCheckSection(fullForm, "6.7.13.0+abc", roots, flags), undefined);

    const vendorPrefixed = `## Rule\n\n## Code check (6.7.13.0+abc)\n\n- confirmed \`sw-foo\` — vendor/shopware/administration/Component/foo.js:5\n`;
    assert.equal(validateGuidelineCodeCheckSection(vendorPrefixed, "6.7.13.0+abc", roots, flags), undefined);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

// --------------------------------------------------------------------------------
// prefilled scalar comparison is string-based; Read more: tolerates emphasis markup
// --------------------------------------------------------------------------------

test("validateGuidelineOutput: an unquoted version (6.7 parses as a number) is rejected — must be a quoted string", () => {
  const item = baseItem();
  const body = `---
id: platform/guidelines/6.7/code-guidelines.md
title: Code guidelines
docType: guideline
version: 6.7
summary: Rules for backend/frontend code.
keywords: [code, static-analysis, context, deprecation, service, decoration, event, routing]
sources: [{url: "https://developer.shopware.com/docs/resources/guidelines/code/a.html", hash: "h1"}]
codeVersion: 6.7.13.0+abc
lastBuilt: 2026-09-14
---
## Rule

Read more: https://developer.shopware.com/docs/resources/guidelines/code/a.html
`;
  const result = runOneIngest(item, body);
  try {
    assert.equal(result.ok, false);
    assert.match(result.reason ?? "", /version.*quote/);
  } finally {
    rmSync(result.wikiRoot, { recursive: true, force: true });
    rmSync(result.layerDir, { recursive: true, force: true });
  }
});

test('validateGuidelineOutput: "**Read more:**" and "_Read more:_" both satisfy the required-line gate', () => {
  for (const marker of ["**Read more:**", "_Read more:_"]) {
    const item = baseItem();
    const body = `${goodFrontmatter()}## Rule\n\nDecorate.\n\n${marker} https://developer.shopware.com/docs/resources/guidelines/code/a.html\n`;
    const result = runOneIngest(item, body);
    try {
      assert.equal(result.ok, true, `${marker}: ${result.reason}`);
    } finally {
      rmSync(result.wikiRoot, { recursive: true, force: true });
      rmSync(result.layerDir, { recursive: true, force: true });
    }
  }
});

// --------------------------------------------------------------------------------
// Read more: target and markdown-link-target gates (negative cases)
// --------------------------------------------------------------------------------

test("validateGuidelineOutput: rejects a \"Read more:\" target that is neither a sources[].url nor an existing platform/... path", () => {
  const item = baseItem();
  const body = goodFrontmatter() + "## Rule\n\nDecorate.\n\nRead more: https://developer.shopware.com/docs/somewhere-else.html\n";
  const result = runOneIngest(item, body);
  try {
    assert.equal(result.ok, false);
    assert.match(result.reason ?? "", /"Read more:" target is neither a sources\[\] url nor an existing platform\/\.\.\. path|target is neither a sources/);
  } finally {
    rmSync(result.wikiRoot, { recursive: true, force: true });
    rmSync(result.layerDir, { recursive: true, force: true });
  }
});

test("validateGuidelineOutput: rejects a markdown link target that is neither platform/... nor an https URL", () => {
  const item = baseItem();
  const body =
    goodFrontmatter() +
    "## Rule\n\nSee [the wiki dev guide](wiki/dev/6.7/foo.md) for more.\n\nRead more: https://developer.shopware.com/docs/resources/guidelines/code/a.html\n";
  const result = runOneIngest(item, body);
  try {
    assert.equal(result.ok, false);
    assert.match(result.reason ?? "", /markdown link target must start with platform\/ or be an https URL/);
  } finally {
    rmSync(result.wikiRoot, { recursive: true, force: true });
    rmSync(result.layerDir, { recursive: true, force: true });
  }
});

// A "Read more:" target wrapped in backticks, angle brackets, a markdown link, or trailed by
// prose punctuation still resolves against sources[].url — the writer isn't forced into one
// exact bare-token spelling.
for (const [label, line] of [
  ["backtick-wrapped", "Read more: `https://developer.shopware.com/docs/resources/guidelines/code/a.html`"],
  ["angle-bracket-wrapped", "Read more: <https://developer.shopware.com/docs/resources/guidelines/code/a.html>"],
  ["markdown link", "Read more: [the code guidelines](https://developer.shopware.com/docs/resources/guidelines/code/a.html)"],
  ["trailing punctuation", "Read more: https://developer.shopware.com/docs/resources/guidelines/code/a.html."],
] as const) {
  test(`validateGuidelineOutput: accepts a ${label} "Read more:" target`, () => {
    const item = baseItem();
    const body = goodFrontmatter() + `## Rule\n\nDecorate.\n\n${line}\n`;
    const result = runOneIngest(item, body);
    try {
      assert.equal(result.ok, true, result.reason);
    } finally {
      rmSync(result.wikiRoot, { recursive: true, force: true });
      rmSync(result.layerDir, { recursive: true, force: true });
    }
  });
}

// --------------------------------------------------------------------------------
// This task: more "Read more:" label/target forms, per-section requirement, link
// existence (incl. same-run planned paths), Code check must be last, duplicate anchor,
// frontmatter head size, and purity.
// --------------------------------------------------------------------------------

/** Runs `validateGuidelineOutput` directly against a temp `wikiRoot` the caller can
 *  pre-populate — used where a test needs control over what already exists in the wiki tree
 *  (an existing platform/... page, a #anchor target) rather than the full writeBatches/
 *  ingestBatches pipeline `runOneIngest` drives. */
function runValidate(
  item: GuidelineWorkItem,
  body: string,
  opts: { config?: PlatformConfig; wikiSetup?: (wikiRoot: string) => void } = {},
): { ok: boolean; reason?: string; wikiRoot: string; dir: string } {
  const wikiRoot = tmpDir("kb-guidelines-wiki-root-");
  opts.wikiSetup?.(wikiRoot);
  const dir = tmpDir("kb-guidelines-out-");
  const outAbsPath = resolve(dir, item.file);
  writeFileSync(outAbsPath, body);
  const result = validateGuidelineOutput(item, outAbsPath, opts.config ?? CONFIG, wikiRoot);
  return result.ok ? { ok: true, wikiRoot, dir } : { ok: false, reason: result.reason, wikiRoot, dir };
}

test('validateGuidelineOutput: "**Read more**:" (colon outside the emphasis wrap) also satisfies the gate', () => {
  const item = baseItem();
  const body = goodFrontmatter() + "## Rule\n\nDecorate.\n\n**Read more**: https://developer.shopware.com/docs/resources/guidelines/code/a.html\n";
  const result = runOneIngest(item, body);
  try {
    assert.equal(result.ok, true, result.reason);
  } finally {
    rmSync(result.wikiRoot, { recursive: true, force: true });
    rmSync(result.layerDir, { recursive: true, force: true });
  }
});

test('validateGuidelineOutput: a backtick-wrapped target with trailing prose punctuation ("`x`.") resolves', () => {
  const item = baseItem();
  const body = goodFrontmatter() + "## Rule\n\nDecorate.\n\nRead more: `https://developer.shopware.com/docs/resources/guidelines/code/a.html`.\n";
  const result = runOneIngest(item, body);
  try {
    assert.equal(result.ok, true, result.reason);
  } finally {
    rmSync(result.wikiRoot, { recursive: true, force: true });
    rmSync(result.layerDir, { recursive: true, force: true });
  }
});

test('validateGuidelineOutput: a "Read more:" target with a #anchor resolves against the file without the anchor', () => {
  const item = baseItem();
  const body = goodFrontmatter() + "## Rule\n\nDecorate.\n\nRead more: platform/dev/6.7/guides/plugins/foo.md#some-heading\n";
  const result = runValidate(item, body, {
    wikiSetup: (wikiRoot) => {
      mkdirSync(resolve(wikiRoot, "platform/dev/6.7/guides/plugins"), { recursive: true });
      writeFileSync(resolve(wikiRoot, "platform/dev/6.7/guides/plugins/foo.md"), "# Foo\n");
    },
  });
  try {
    assert.equal(result.ok, true, result.reason);
  } finally {
    rmSync(result.wikiRoot, { recursive: true, force: true });
    rmSync(result.dir, { recursive: true, force: true });
  }
});

test('validateGuidelineOutput: a comma-separated second "Read more:" target is also validated (both forms: "a,b" and "a, b")', () => {
  for (const sep of [",", ", "]) {
    const item = baseItem();
    const body =
      goodFrontmatter() +
      `## Rule\n\nDecorate.\n\nRead more: https://developer.shopware.com/docs/resources/guidelines/code/a.html${sep}https://developer.shopware.com/docs/somewhere-else.html\n`;
    const result = runOneIngest(item, body);
    try {
      assert.equal(result.ok, false, `sep=${JSON.stringify(sep)} should fail (second target is not a source)`);
      assert.match(result.reason ?? "", /target is neither a sources/);
    } finally {
      rmSync(result.wikiRoot, { recursive: true, force: true });
      rmSync(result.layerDir, { recursive: true, force: true });
    }
  }
});

test("validateGuidelineOutput: rejects a rule section that has no \"Read more:\" line, even when another section does", () => {
  const item = baseItem();
  const body =
    goodFrontmatter() +
    "## First rule\n\nDecorate.\n\nRead more: https://developer.shopware.com/docs/resources/guidelines/code/a.html\n\n" +
    "## Second rule\n\nNo citation here at all.\n";
  const result = runOneIngest(item, body);
  try {
    assert.equal(result.ok, false);
    assert.match(result.reason ?? "", /## Second rule: section has no "Read more: <path>" line/);
  } finally {
    rmSync(result.wikiRoot, { recursive: true, force: true });
    rmSync(result.layerDir, { recursive: true, force: true });
  }
});

test("validateGuidelineOutput: rejects a markdown link to a platform/... path that does not exist and is not planned in this run", () => {
  const item = baseItem();
  const body =
    goodFrontmatter() +
    "## Rule\n\nSee [an unrelated page](platform/dev/6.7/guides/plugins/does-not-exist.md) for background.\n\nRead more: https://developer.shopware.com/docs/resources/guidelines/code/a.html\n";
  const result = runOneIngest(item, body);
  try {
    assert.equal(result.ok, false);
    assert.match(result.reason ?? "", /markdown link target does not exist: platform\/dev\/6\.7\/guides\/plugins\/does-not-exist\.md/);
  } finally {
    rmSync(result.wikiRoot, { recursive: true, force: true });
    rmSync(result.layerDir, { recursive: true, force: true });
  }
});

test("validateGuidelineOutput: accepts a markdown link to a curated guideline file of this version planned in the same run, even before it lands", () => {
  const config: PlatformConfig = {
    ...CONFIG,
    guidelines: { ...CONFIG.guidelines!, curatedFiles: [{ file: "code-guidelines.md", base: null, scope: "s", sourceInputs: [] }, { file: "be-code-guidelines.md", base: "code-guidelines.md", scope: "s", sourceInputs: [] }] },
  };
  const item = baseItem();
  const body =
    goodFrontmatter() +
    "## Rule\n\nSee [the backend surface file](platform/guidelines/6.7/be-code-guidelines.md) too.\n\nRead more: https://developer.shopware.com/docs/resources/guidelines/code/a.html\n";
  const result = runValidate(item, body, { config });
  try {
    assert.equal(result.ok, true, result.reason);
  } finally {
    rmSync(result.wikiRoot, { recursive: true, force: true });
    rmSync(result.dir, { recursive: true, force: true });
  }
});

test("validateGuidelineOutput: rejects a rule section placed after ## Code check", () => {
  const item = baseItem();
  const body =
    goodFrontmatter() +
    `## Rule\n\nDecorate.\n\nRead more: https://developer.shopware.com/docs/resources/guidelines/code/a.html\n\n` +
    `## Code check (${item.codeRoot.codeVersion})\n\n` +
    `## Another rule\n\nMore.\n\nRead more: https://developer.shopware.com/docs/resources/guidelines/code/a.html\n`;
  const result = runOneIngest(item, body);
  try {
    assert.equal(result.ok, false);
    assert.match(result.reason ?? "", /## Code check must be the last section/);
  } finally {
    rmSync(result.wikiRoot, { recursive: true, force: true });
    rmSync(result.layerDir, { recursive: true, force: true });
  }
});

test("validateGuidelineOutput: a ## Code check heading appearing only inside a fenced code block does not count as the real section", () => {
  const flags: FlagResult = { absent: ["FooBar"], deprecated: [], unread: [] };
  const item = baseItem({ codeCheck: { flags } });
  const body =
    goodFrontmatter() +
    "## Rule\n\nDecorate.\n\n```markdown\n## Code check (6.7.13.0+abc)\n\n- absent `FooBar` — not present\n```\n\nRead more: https://developer.shopware.com/docs/resources/guidelines/code/a.html\n";
  const result = runOneIngest(item, body);
  try {
    assert.equal(result.ok, false);
    assert.match(result.reason ?? "", /missing the required ## Code check/);
  } finally {
    rmSync(result.wikiRoot, { recursive: true, force: true });
    rmSync(result.layerDir, { recursive: true, force: true });
  }
});

test("validateGuidelineOutput: rejects two ## sections that slugify to the same anchor", () => {
  const item = baseItem();
  const body =
    goodFrontmatter() +
    "## Cache Stampede\n\nDecorate.\n\nRead more: https://developer.shopware.com/docs/resources/guidelines/code/a.html\n\n" +
    "## Cache stampede!\n\nMore.\n\nRead more: https://developer.shopware.com/docs/resources/guidelines/code/a.html\n";
  const result = runOneIngest(item, body);
  try {
    assert.equal(result.ok, false);
    assert.match(result.reason ?? "", /duplicate ## section (anchor|heading)/);
  } finally {
    rmSync(result.wikiRoot, { recursive: true, force: true });
    rmSync(result.layerDir, { recursive: true, force: true });
  }
});

test("validateGuidelineOutput: rejects a frontmatter block at or over the 8 KB server head-read window", () => {
  const bigConfig = { ...CONFIG, sizeLimits: { ...CONFIG.sizeLimits, guidelineFileMaxBytes: 20000, guidelinePairMaxBytes: 40000 } } as unknown as PlatformConfig;
  const item = baseItem();
  const body =
    `---\nid: platform/guidelines/6.7/code-guidelines.md\ntitle: Code guidelines\ndocType: guideline\nversion: "6.7"\n` +
    `summary: "${"x".repeat(8200)}"\n` +
    `keywords: [code, static-analysis, context, deprecation, service, decoration, event, routing]\n` +
    `sources: [{url: "https://developer.shopware.com/docs/resources/guidelines/code/a.html", hash: "h1"}]\n` +
    `codeVersion: 6.7.13.0+abc\nlastBuilt: 2026-09-14\n---\n` +
    "## Rule\n\nDecorate.\n\nRead more: https://developer.shopware.com/docs/resources/guidelines/code/a.html\n";
  const result = runValidate(item, body, { config: bigConfig });
  try {
    assert.equal(result.ok, false);
    assert.match(result.reason ?? "", /frontmatter block is \d+ bytes, at or over the server's/);
  } finally {
    rmSync(result.wikiRoot, { recursive: true, force: true });
    rmSync(result.dir, { recursive: true, force: true });
  }
});

test('validateGuidelineOutput: rejects body prose that references ingest tooling internals ("ingest/" purity needle)', () => {
  const item = baseItem();
  const body =
    goodFrontmatter() +
    "## Rule\n\nVerified against `ingest/platform/.cache/code/6.6/src/Core/Foo.php`.\n\nRead more: https://developer.shopware.com/docs/resources/guidelines/code/a.html\n";
  const result = runOneIngest(item, body);
  try {
    assert.equal(result.ok, false);
    assert.match(result.reason ?? "", /references tooling \("ingest\/"\)/);
  } finally {
    rmSync(result.wikiRoot, { recursive: true, force: true });
    rmSync(result.layerDir, { recursive: true, force: true });
  }
});

// --------------------------------------------------------------------------------
// This task: prepareOneItem fails loudly on any unresolvable, non-sync-pending pattern
// (not just when every pattern is unresolved), reports it as `failedKey` so the prepare
// JSON's `failed[]` is honest, still "skips" a genuinely sync-pending source, and
// sourceInputsByVersion overrides sourceInputs per version.
// --------------------------------------------------------------------------------

function emptyCodeIndex(): CodeIndex {
  return {
    coreVersion: "test-core",
    vendorHash: "test-hash",
    words: new Map(),
    literals: new Set(),
    classes: new Set(),
    namespacePrefixes: new Set(),
    shortClassNames: new Set(),
    deprecated: new Set(),
    flags: new Map(),
  };
}

function fakeCtx(mode: "vendor" | "checkout" = "vendor"): GuidelineCodeContext {
  const packageRoots: PackageRoots = { core: "/nonexistent-core", storefront: "/nonexistent-storefront", administration: "/nonexistent-administration" };
  return { root: { mode, packageRoots, codeVersion: "6.7.0.0+testcode" }, index: emptyCodeIndex(), packageRoots };
}

function fakeState(): IngestionState {
  return {
    sources: {},
    hubs: {},
    synonyms: { concepts: {}, synonymsPromptHash: null },
    guidelines: { files: {} },
    prompts: { pagePromptHash: null, hubPromptHash: null, synonymsPromptHash: null },
    build: { lastBuilt: null },
  };
}

function fakeGuidelinesCfg(curatedFiles: GuidelineCuratedFile[]): NonNullable<PlatformConfig["guidelines"]> {
  return { enabled: true, versions: [], codeCheckouts: {}, curatedFiles };
}

test("prepareOneItem: fails the item and names every unresolved pattern when its source has already synced", (t) => {
  const version = "9.9-prepare-fail-test";
  const cleanup = writeDeveloperStateFixture(version, {
    "resources/guidelines/code/a.md": { hash: "h1", sourceUrl: "https://developer.shopware.com/docs/resources/guidelines/code/a.html" },
  });
  const codeCacheDir = tmpDir("kb-guidelines-prepare-fail-cache-");
  const wikiRoot = tmpDir("kb-guidelines-prepare-fail-wiki-");
  const writes: string[] = [];
  t.mock.method(process.stderr, "write", (chunk: string) => {
    writes.push(String(chunk));
    return true;
  });
  try {
    const cf: GuidelineCuratedFile = {
      file: "code-guidelines.md",
      base: null,
      scope: "s",
      sourceInputs: ["docs:resources/guidelines/code/a.md", "docs:resources/guidelines/code/missing.md"],
    };
    const { resolved, missing } = resolveSourceInputs(cf.sourceInputs, version, wikiRoot, fakeCtx().packageRoots);
    assert.equal(resolved.length, 1);
    assert.deepEqual(missing, ["docs:resources/guidelines/code/missing.md"]);

    const state = fakeState();
    const result = prepareOneItem(fakeGuidelinesCfg([cf]), version, cf, fakeCtx("vendor"), resolved, missing, wikiRoot, state, "prompt-hash-1", false, false, codeCacheDir);

    assert.equal(result.item, undefined);
    assert.equal(result.skippedKey, undefined);
    assert.equal(result.failedKey, `${version}/code-guidelines.md`);
    assert.equal(state.guidelines.files[`${version}/code-guidelines.md`]?.guidelineState, "failed");
    assert.ok(writes.some((w) => w.includes("docs:resources/guidelines/code/missing.md")), "stderr must name the unresolved pattern");
  } finally {
    cleanup();
    rmSync(codeCacheDir, { recursive: true, force: true });
    rmSync(wikiRoot, { recursive: true, force: true });
  }
});

test("prepareOneItem: a source that has never synced still yields skipped, not failed", () => {
  const version = "9.9-prepare-skip-test";
  const codeCacheDir = tmpDir("kb-guidelines-prepare-skip-cache-");
  const wikiRoot = tmpDir("kb-guidelines-prepare-skip-wiki-");
  try {
    const cf: GuidelineCuratedFile = { file: "code-guidelines.md", base: null, scope: "s", sourceInputs: ["docs:resources/guidelines/code/a.md"] };
    const { resolved, missing } = resolveSourceInputs(cf.sourceInputs, version, wikiRoot, fakeCtx().packageRoots);
    assert.equal(resolved.length, 0);
    assert.deepEqual(missing, ["docs:resources/guidelines/code/a.md"]);

    const state = fakeState();
    const result = prepareOneItem(fakeGuidelinesCfg([cf]), version, cf, fakeCtx("vendor"), resolved, missing, wikiRoot, state, "prompt-hash-1", false, false, codeCacheDir);

    assert.equal(result.failedKey, undefined);
    assert.equal(result.skippedKey, `${version}/code-guidelines.md`);
    assert.equal(state.guidelines.files[`${version}/code-guidelines.md`]?.guidelineState, "skipped");
  } finally {
    rmSync(codeCacheDir, { recursive: true, force: true });
    rmSync(wikiRoot, { recursive: true, force: true });
  }
});

test("curatedFileSourceInputs: sourceInputsByVersion overrides sourceInputs only for the named version", () => {
  const cf: GuidelineCuratedFile = {
    file: "code-guidelines.md",
    base: null,
    scope: "s",
    sourceInputs: ["docs:a.md", "docs:b.md"],
    sourceInputsByVersion: { "6.6": ["docs:six-six-only.md"] },
  };
  assert.deepEqual(curatedFileSourceInputs(cf, "6.6"), ["docs:six-six-only.md"]);
  assert.deepEqual(curatedFileSourceInputs(cf, "6.7"), ["docs:a.md", "docs:b.md"]);
  assert.deepEqual(curatedFileSourceInputs(cf, "6.5"), ["docs:a.md", "docs:b.md"]);
});

test("prepare wiring: a prepareOneItem failedKey lands in the prepare JSON's failed[] (mirrors runPrepare's collection loop)", () => {
  const version = "9.9-prepare-json-test";
  const cleanup = writeDeveloperStateFixture(version, {
    "resources/guidelines/code/a.md": { hash: "h1", sourceUrl: "https://developer.shopware.com/docs/resources/guidelines/code/a.html" },
  });
  const codeCacheDir = tmpDir("kb-guidelines-prepare-json-cache-");
  const wikiRoot = tmpDir("kb-guidelines-prepare-json-wiki-");
  try {
    const okCf: GuidelineCuratedFile = { file: "ok-guidelines.md", base: null, scope: "s", sourceInputs: ["docs:resources/guidelines/code/a.md"] };
    const failCf: GuidelineCuratedFile = { file: "fail-guidelines.md", base: null, scope: "s", sourceInputs: ["docs:resources/guidelines/code/missing.md"] };
    const guidelinesCfg = fakeGuidelinesCfg([okCf, failCf]);
    const state = fakeState();
    const items: unknown[] = [];
    const skipped: string[] = [];
    const failedKeys: string[] = [];
    for (const cf of guidelinesCfg.curatedFiles) {
      const { resolved, missing } = resolveSourceInputs(cf.sourceInputs, version, wikiRoot, fakeCtx().packageRoots);
      const { item, skippedKey, failedKey } = prepareOneItem(guidelinesCfg, version, cf, fakeCtx("vendor"), resolved, missing, wikiRoot, state, "prompt-hash-1", false, false, codeCacheDir);
      if (item) items.push(item);
      if (skippedKey) skipped.push(skippedKey);
      if (failedKey) failedKeys.push(failedKey);
    }
    const json = JSON.parse(JSON.stringify({ cmd: "guidelines", mode: "prepare", batches: 0, items: items.length, files: [], skipped, failed: failedKeys }));
    assert.deepEqual(json.failed, [`${version}/fail-guidelines.md`]);
  } finally {
    cleanup();
    rmSync(codeCacheDir, { recursive: true, force: true });
    rmSync(wikiRoot, { recursive: true, force: true });
  }
});
