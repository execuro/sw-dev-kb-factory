/**
 * Contract test: a fixture produced exactly per the
 * writer prompt template shape must pass `wiki:guidelines --ingest`'s gate
 * (`validateGuidelineOutput`) AND the server's own frontmatter parser
 * (`src/wiki/frontmatter.ts`'s `parseFrontmatter`) must read the same file back correctly.
 *
 * Built from the real `ingest/platform/config.json` curated-file entries for `6.7`
 * (`code-guidelines.md`, a base file; `fe-architecture-guidelines.md`, a surface file),
 * resolving their `sourceInputs` against the real on-disk `wiki/`. `code:` inputs resolve to
 * nothing without a vendor install, and `docs:` inputs live under the gitignored sources
 * tree, so the fixture helper below synthesises the missing cache entries and removes them
 * again: these tests run in every environment rather than skipping where it matters most.
 * No network, no writes under the real `wiki/` tree — output lands in a temp
 * dir; `wikiRoot` passed to the gate is the real `wiki/` (read-only, for its `wiki:`-scheme
 * source files and the "Read more: existing platform/... path" check).
 */
import { test, type TestContext } from "node:test";
import assert from "node:assert/strict";
import { existsSync, mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { loadPlatformConfig, wikiRootFrom } from "../ingest/shared/config.js";
import { curatedFileSourceInputs, resolveSourceInputs, computeCompactSources, validateGuidelineOutput, type GuidelineWorkItem, type PackageRoots } from "../ingest/platform/guidelines.js";
import { devSourcePath } from "../ingest/platform/pagePrep.js";
import { loadSourceState } from "../ingest/shared/state.js";
import { matchesAny } from "../ingest/shared/glob.js";
import { parseFrontmatter } from "../src/wiki/frontmatter.js";
import { FRONTMATTER_HEAD_BYTES } from "../src/types.js";
import { WikiSource } from "../src/sources/platform/wiki-source.js";
import { GuidelinesView } from "../src/sources/guidelines/view.js";
import type { GuidelineCuratedFile } from "../ingest/shared/types.js";

// The package-anchored root resolver every `wiki:*` command uses, never the working directory.
const WIKI_ROOT = wikiRootFrom({ layer: "platform" }, loadPlatformConfig());
const VERSION = "6.7";
const CODE_VERSION = "6.7.0.0+testcode1"; // fabricated: no vendor/ install in this environment (see module doc)
const NO_PACKAGE_ROOTS: PackageRoots = { core: "/nonexistent-core", storefront: "/nonexistent-storefront", administration: "/nonexistent-administration" };
/** 8 keywords — validateGuidelineFrontmatter/prompts/guideline.md require 8-15. */
const KEYWORDS_8 = ["code", "architecture", "context", "deprecation", "service", "decoration", "event", "routing"];

function curatedFile(file: string): GuidelineCuratedFile {
  const config = loadPlatformConfig();
  const cf = config.guidelines!.curatedFiles.find((f) => f.file === file);
  assert.ok(cf, `config.json guidelines.curatedFiles must list ${file}`);
  return cf!;
}

/**
 * Fixture corpus for the `docs:` sourceInputs of `cf`.
 *
 * A `docs:` input resolves only when the `developer` download's cached page text exists under
 * `ingest/platform/.cache/`, a build artefact that no clone carries and that CI cannot produce
 * (there is no `npm run setup` step: the docs clones are ~1 GB and one of them is private).
 * `ingest/platform/state/developer/<version>.json` *is* tracked, so the only missing piece is the
 * cached body — this writes a placeholder for every state-declared hash that has no cache file
 * yet, and removes exactly those again afterwards. Real state, real urls, real hashes: the gate
 * runs against the real curated item in every environment instead of silently skipping on the one
 * environment that gates releases.
 */
function ensureDocsSourceCache(cf: GuidelineCuratedFile, version: string): () => void {
  const sourceKey = `developer:${version}`;
  const prefix = `platform/dev/${version}/`;
  const pages = loadSourceState(sourceKey)?.pages ?? {};
  const created: string[] = [];
  for (const raw of curatedFileSourceInputs(cf, version)) {
    if (!raw.startsWith("docs:")) continue;
    // `index.md` is keyed as `_index.md`, as sync stores it (resolveDocsInput).
    const spec = raw.slice("docs:".length).replace(/(^|\/)index\.md$/, "$1_index.md");
    for (const [key, entry] of Object.entries(pages)) {
      if (!key.startsWith(prefix) || !entry.hash) continue;
      const rel = key.slice(prefix.length);
      if (spec.includes("*") ? !matchesAny(rel, [spec]) : rel !== spec) continue;
      const cachePath = devSourcePath(sourceKey, entry.hash);
      if (existsSync(cachePath)) continue;
      mkdirSync(dirname(cachePath), { recursive: true });
      writeFileSync(cachePath, `# ${rel}\n\nFixture body for the guidelines contract test.\n`, "utf8");
      created.push(cachePath);
    }
  }
  return () => {
    for (const path of created) rmSync(path, { force: true });
  };
}

/** Builds a realistic work item for `cf`, resolving its `sourceInputs` against the real `wiki/`
 *  and — for `docs:` inputs — the fixture cache above. Fails loudly rather than skipping: a
 *  curated file whose patterns resolve to nothing means config and corpus have drifted apart. */
function buildRealItem(cf: GuidelineCuratedFile, config: ReturnType<typeof loadPlatformConfig>, t: TestContext): GuidelineWorkItem {
  t.after(ensureDocsSourceCache(cf, VERSION));
  const inputs = curatedFileSourceInputs(cf, VERSION);
  const { resolved, missing } = resolveSourceInputs(inputs, VERSION, WIKI_ROOT, NO_PACKAGE_ROOTS);
  assert.ok(resolved.length > 0, `no sourceInputs resolved for ${cf.file} (${inputs.join(", ")}) against ${WIKI_ROOT}`);
  const sources = computeCompactSources(inputs, VERSION, WIKI_ROOT, NO_PACKAGE_ROOTS);
  const wikiPath = `platform/guidelines/${VERSION}/${cf.file}`;
  const surfaceFiles =
    cf.base === null ? config.guidelines!.curatedFiles.filter((f) => f.base === cf.file).map((f) => ({ file: f.file, wikiPath: `platform/guidelines/${VERSION}/${f.file}`, scope: f.scope })) : undefined;
  return {
    path: wikiPath,
    version: VERSION,
    file: cf.file,
    base: cf.base,
    scope: cf.scope,
    wikiPath,
    outputPath: "", // set by the caller once the temp output file exists
    sourceInputs: resolved,
    missingInputs: missing,
    codeRoot: { mode: "vendor", packageRoots: NO_PACKAGE_ROOTS, codeVersion: CODE_VERSION },
    surfaceFiles,
    // No real code index available (no vendor/ in this environment) — an empty FlagResult is
    // itself a real, valid case: `## Code check` becomes optional (validateGuidelineCodeCheckSection),
    // and the fixture below still writes the heading, matching prompts/guideline.md's shape.
    codeCheck: { flags: { absent: [], deprecated: [], unread: [] } },
    frontmatter: { id: wikiPath, docType: "guideline", version: VERSION, sources, codeVersion: CODE_VERSION },
  };
}

/** Serializes the frontmatter exactly per prompts/guideline.md's required shape: one-line
 *  `sources: [{url: "...", hash: "..."}]`, quoted `version`. */
function serializeFrontmatter(item: GuidelineWorkItem, title: string, summary: string, keywords: string[]): string {
  const sourcesLine = `[${item.frontmatter!.sources.map((s) => `{url: "${s.url}", hash: "${s.hash}"}`).join(", ")}]`;
  return [
    "---",
    `id: ${item.wikiPath}`,
    `title: ${title}`,
    `docType: guideline`,
    `version: "${VERSION}"`,
    `summary: ${summary}`,
    `keywords: [${keywords.join(", ")}]`,
    `sources: ${sourcesLine}`,
    `codeVersion: ${CODE_VERSION}`,
    `lastBuilt: 2026-09-14`,
    "---",
    "",
  ].join("\n");
}

/** Body per prompts/guideline.md: `## Index` first (base files only, linking every surface
 *  file), then rule sections each ending in a `Read more:` line citing a `sources[].url`,
 *  then the (possibly empty) `## Code check (<codeVersion>)` section. */
function bodyFor(item: GuidelineWorkItem): string {
  const readMoreTarget = item.frontmatter!.sources[0].url;
  const parts: string[] = [];
  if (item.surfaceFiles?.length) {
    parts.push("## Index", "", ...item.surfaceFiles.map((sf) => `- [${sf.scope}](${sf.wikiPath})`), "");
  }
  parts.push("## General principles", "", "Decorate, never extend a final core service.", "", `Read more: ${readMoreTarget}`, "");
  parts.push(`## Code check (${item.codeRoot.codeVersion})`, "");
  return parts.join("\n") + "\n";
}

function writeFixture(item: GuidelineWorkItem, text: string): { outAbsPath: string; dir: string } {
  const dir = mkdtempSync(join(tmpdir(), "kb-guidelines-contract-"));
  const outAbsPath = resolve(dir, item.file);
  writeFileSync(outAbsPath, text);
  return { outAbsPath, dir };
}

for (const file of ["code-guidelines.md", "fe-architecture-guidelines.md"]) {
  test(`guidelines-contract: ${file} (6.7) — real config + resolved inputs pass the ingest gate and the server frontmatter parser`, (t) => {
    const config = loadPlatformConfig();
    const cf = curatedFile(file);
    const item = buildRealItem(cf, config, t);

    const title = file.replace(/-guidelines\.md$/, "").replace(/-/g, " ").replace(/^./, (c) => c.toUpperCase()) + " guidelines";
    const keywords = KEYWORDS_8;
    const text = serializeFrontmatter(item, title, cf.scope.slice(0, 100), keywords) + bodyFor(item);
    const { outAbsPath, dir } = writeFixture(item, text);
    try {
      // --ingest gate
      const result = validateGuidelineOutput(item, outAbsPath, config, WIKI_ROOT);
      assert.equal(result.ok, true, result.ok ? undefined : result.reason);

      // Server frontmatter parser reads the same file
      const { data, endLine } = parseFrontmatter(text);
      assert.equal(data.id, item.wikiPath);
      assert.equal(data.title, title);
      assert.ok(Array.isArray(data.sources) && (data.sources as { url: string }[]).length === item.frontmatter!.sources.length);
      assert.equal((data.sources as { url: string }[])[0].url, item.frontmatter!.sources[0].url);

      // Frontmatter head stays well under the server's 8 KB head-read limit (src/types.ts)
      const fmBytes = Buffer.byteLength(text.split("\n").slice(0, endLine).join("\n"), "utf8");
      assert.ok(fmBytes < FRONTMATTER_HEAD_BYTES, `frontmatter is ${fmBytes} bytes, must be < ${FRONTMATTER_HEAD_BYTES}`);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
}

// --------------------------------------------------------------------------------
// Negative cases: one per gate rule W1 added, grounded in a real curated item.
// --------------------------------------------------------------------------------

test("guidelines-contract negative: sources[] missing a resolved pattern fails the real fe-architecture-guidelines.md item", (t) => {
  const config = loadPlatformConfig();
  const cf = curatedFile("fe-architecture-guidelines.md");
  const item = buildRealItem(cf, config, t);
  const title = "Fe architecture guidelines";
  const text =
    serializeFrontmatter({ ...item, frontmatter: { ...item.frontmatter!, sources: [{ url: "https://developer.shopware.com/docs/nonexistent.html", hash: "x" }] } }, title, cf.scope.slice(0, 100), KEYWORDS_8) + bodyFor(item);
  const { outAbsPath, dir } = writeFixture(item, text);
  try {
    const result = validateGuidelineOutput(item, outAbsPath, config, WIKI_ROOT);
    assert.equal(result.ok, false);
    assert.match((result as { reason: string }).reason, /sources\[\] does not match the prefilled item\.frontmatter\.sources/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("guidelines-contract negative: a \"Read more:\" target outside sources[]/platform/... fails the real fe-architecture-guidelines.md item", (t) => {
  const config = loadPlatformConfig();
  const cf = curatedFile("fe-architecture-guidelines.md");
  const item = buildRealItem(cf, config, t);
  const title = "Fe architecture guidelines";
  const badBody = `## General principles\n\nDecorate.\n\nRead more: https://developer.shopware.com/docs/somewhere-else.html\n\n## Code check (${item.codeRoot.codeVersion})\n\n`;
  const text = serializeFrontmatter(item, title, cf.scope.slice(0, 100), KEYWORDS_8) + badBody;
  const { outAbsPath, dir } = writeFixture(item, text);
  try {
    const result = validateGuidelineOutput(item, outAbsPath, config, WIKI_ROOT);
    assert.equal(result.ok, false);
    assert.match((result as { reason: string }).reason, /"Read more:" target is neither a sources\[\] url nor an existing platform\/\.\.\. path|target is neither a sources/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("guidelines-contract negative: a markdown link outside platform/.../https fails the real fe-architecture-guidelines.md item", (t) => {
  const config = loadPlatformConfig();
  const cf = curatedFile("fe-architecture-guidelines.md");
  const item = buildRealItem(cf, config, t);
  const title = "Fe architecture guidelines";
  const readMoreTarget = item.frontmatter!.sources[0].url;
  const badBody = `## General principles\n\nSee [the admin guide](../local/admin-guide.md).\n\nRead more: ${readMoreTarget}\n\n## Code check (${item.codeRoot.codeVersion})\n\n`;
  const text = serializeFrontmatter(item, title, cf.scope.slice(0, 100), KEYWORDS_8) + badBody;
  const { outAbsPath, dir } = writeFixture(item, text);
  try {
    const result = validateGuidelineOutput(item, outAbsPath, config, WIKI_ROOT);
    assert.equal(result.ok, false);
    assert.match((result as { reason: string }).reason, /markdown link target must start with platform\/ or be an https URL/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("guidelines-contract negative: a base-shaped item missing its ## Index / surface links fails (real fe-architecture-guidelines.md item, base fields overridden)", (t) => {
  const config = loadPlatformConfig();
  const cf = curatedFile("fe-architecture-guidelines.md");
  const real = buildRealItem(cf, config, t);
  const item: GuidelineWorkItem = { ...real, base: null, surfaceFiles: [{ file: "be-architecture-guidelines.md", wikiPath: "platform/guidelines/6.7/be-architecture-guidelines.md", scope: "backend" }] };
  const title = "Architecture guidelines";
  const readMoreTarget = item.frontmatter!.sources[0].url;
  const badBody = `## General principles\n\nNo Index heading here.\n\nRead more: ${readMoreTarget}\n\n## Code check (${item.codeRoot.codeVersion})\n\n`;
  const text = serializeFrontmatter(item, title, cf.scope.slice(0, 100), KEYWORDS_8) + badBody;
  const { outAbsPath, dir } = writeFixture(item, text);
  try {
    const result = validateGuidelineOutput(item, outAbsPath, config, WIKI_ROOT);
    assert.equal(result.ok, false);
    assert.match((result as { reason: string }).reason, /first ## heading must be "Index"/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

// --------------------------------------------------------------------------------
// Round-trip: a gate-accepted, prompt-shaped fixture read back through the real server
// GuidelinesView (src/sources/guidelines/view.ts) and its frontmatter parser — not just
// the ingest gate. Self-contained (no sourceInputs resolution), so it never skips.
// --------------------------------------------------------------------------------

test("guidelines-contract round-trip: a gate-accepted fixture's sections carry correct platform/guidelines/<v>/<file>#<anchor> tag lines, and title/version/sources parse correctly through GuidelinesView + the server frontmatter parser", async () => {
  const config = loadPlatformConfig();
  const sourceUrl = "https://developer.shopware.com/docs/resources/guidelines/code/a.html";
  const item: GuidelineWorkItem = {
    path: "platform/guidelines/6.7/code-guidelines.md",
    version: "6.7",
    file: "code-guidelines.md",
    base: null,
    scope: "code",
    wikiPath: "platform/guidelines/6.7/code-guidelines.md",
    outputPath: "",
    sourceInputs: [{ scheme: "docs", readPath: "/x", url: sourceUrl, hash: "h1" }],
    missingInputs: [],
    codeRoot: { mode: "vendor", packageRoots: NO_PACKAGE_ROOTS, codeVersion: CODE_VERSION },
    codeCheck: { flags: { absent: [], deprecated: [], unread: [] } },
    frontmatter: { id: "platform/guidelines/6.7/code-guidelines.md", docType: "guideline", version: "6.7", sources: [{ url: sourceUrl, hash: "h1" }], codeVersion: CODE_VERSION },
  };
  const title = "Code guidelines";
  const body = [
    "## General principles",
    "",
    "Decorate, never extend a final core service.",
    "",
    `Read more: ${sourceUrl}`,
    "",
    "## Backward compatibility",
    "",
    "Never remove a public API without a deprecation cycle.",
    "",
    `Read more: ${sourceUrl}`,
    "",
    `## Code check (${CODE_VERSION})`,
    "",
    "",
  ].join("\n");
  const text = serializeFrontmatter(item, title, "Rules for backend/frontend code.", KEYWORDS_8) + body;

  const outDir = mkdtempSync(join(tmpdir(), "kb-guidelines-roundtrip-out-"));
  const outAbsPath = resolve(outDir, item.file);
  writeFileSync(outAbsPath, text);
  const wikiTempRoot = mkdtempSync(join(tmpdir(), "kb-guidelines-roundtrip-wiki-"));
  try {
    // gate-accepted first (round-trip precondition)
    const gate = validateGuidelineOutput(item, outAbsPath, config, WIKI_ROOT);
    assert.equal(gate.ok, true, gate.ok ? undefined : gate.reason);

    mkdirSync(resolve(wikiTempRoot, "platform/guidelines/6.7"), { recursive: true });
    writeFileSync(resolve(wikiTempRoot, "platform/guidelines/6.7/code-guidelines.md"), text);
    const platform = new WikiSource(wikiTempRoot, "platform", { manifestOptional: true });
    const view = new GuidelinesView(platform, null);
    const res = await view.read({ path: "guidelines/6.7/code-guidelines.md" });

    assert.match(res.raw, /> \[platform\] platform\/guidelines\/6\.7\/code-guidelines\.md#general-principles/);
    assert.match(res.raw, /> \[platform\] platform\/guidelines\/6\.7\/code-guidelines\.md#backward-compatibility/);

    assert.equal(res.frontmatter.title, title);
    assert.equal(res.frontmatter.version, "6.7");
    assert.equal(typeof res.frontmatter.version, "string");
    assert.ok(Array.isArray(res.frontmatter.sources) && (res.frontmatter.sources as { url: string }[]).length === 1);
    assert.equal((res.frontmatter.sources as { url: string }[])[0].url, sourceUrl);

    // Server frontmatter parser directly, same file
    const { data } = parseFrontmatter(text);
    assert.equal(data.id, item.wikiPath);
    assert.equal(data.title, title);
    assert.equal(typeof data.version, "string");
  } finally {
    rmSync(outDir, { recursive: true, force: true });
    rmSync(wikiTempRoot, { recursive: true, force: true });
  }
});

test("guidelines-contract negative: code-guidelines.md (a base file) missing its ## Index / surface links fails", (t) => {
  const config = loadPlatformConfig();
  const cf = curatedFile("code-guidelines.md");
  const item = buildRealItem(cf, config, t);
  assert.ok(item.surfaceFiles?.length, "code-guidelines.md must have surface files configured (it is a base file)");
  const title = "Code guidelines";
  const readMoreTarget = item.frontmatter!.sources[0].url;
  const badBody = `## General principles\n\nDecorate.\n\nRead more: ${readMoreTarget}\n\n## Code check (${item.codeRoot.codeVersion})\n\n`;
  const text = serializeFrontmatter(item, title, cf.scope.slice(0, 100), KEYWORDS_8) + badBody;
  const { outAbsPath, dir } = writeFixture(item, text);
  try {
    const result = validateGuidelineOutput(item, outAbsPath, config, WIKI_ROOT);
    assert.equal(result.ok, false);
    assert.match((result as { reason: string }).reason, /first ## heading must be "Index"/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
