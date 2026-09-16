import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, rmSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { groupSharedDevPages } from "../ingest/platform/pagePrep.js";
import { writeBatches, readPendingBatches } from "../ingest/shared/workitems.js";
import { repairCodeCheckLineNumbers, tokenIdentifiers, unverifiedIdentifiers, validateCodeCheckSection, resolveIngestKnownPaths, type PageWorkItem, type CodeCheckCtx } from "../ingest/platform/pages.js";
import type { CodeIndex, CodeRoot } from "../ingest/platform/codeIndex.js";
import type { PlatformConfig, StatePageEntry } from "../ingest/shared/types.js";

// --------------------------------------------------------------------------------
// groupSharedDevPages: installed-major isolation + orphaned-sibling detection
// --------------------------------------------------------------------------------

const CONFIG = {
  sources: [
    {
      id: "developer",
      docType: ["developer"],
      active: true,
      wikiDir: "platform/dev",
      versions: [
        { version: "6.7", active: true, main: "x" },
        { version: "6.6", active: true, main: "x" },
      ],
      exclude: [],
    },
  ],
} as unknown as PlatformConfig;

function entry(hash: string, opts: Partial<StatePageEntry> = {}): StatePageEntry {
  return { hash, builtHash: hash, date: 0, ...opts };
}

test("groupSharedDevPages: without installedMajor, identical dev pages across versions share one group", () => {
  const state = {
    sources: {
      "developer:6.7": { pages: { "platform/dev/6.7/a.md": entry("h1") } },
      "developer:6.6": { pages: { "platform/dev/6.6/a.md": entry("h1", { sharedFrom: "platform/dev/6.7/a.md" }) } },
    },
  };
  const groups = groupSharedDevPages(CONFIG, state);
  assert.equal(groups.length, 1);
  assert.equal(groups[0].refs.length, 2);
});

test("groupSharedDevPages: installedMajor never joins a group with another version (dedupe split)", () => {
  const state = {
    sources: {
      "developer:6.7": { pages: { "platform/dev/6.7/a.md": entry("h1") } },
      "developer:6.6": { pages: { "platform/dev/6.6/a.md": entry("h1", { sharedFrom: "platform/dev/6.7/a.md" }) } },
    },
  };
  const groups = groupSharedDevPages(CONFIG, state, "6.7");
  assert.equal(groups.length, 2, "6.7 and 6.6 must be in separate, single-ref groups");
  for (const g of groups) assert.equal(g.refs.length, 1);
});

test("orphaned sibling: a group of 1 whose entry still carries sharedFrom is a rebuild candidate", () => {
  // Simulates the state right after a dedupe split: the 6.6 entry's sharedFrom still points
  // at the now-isolated 6.7 canonical, but its own group now has exactly one ref.
  const state = {
    sources: {
      "developer:6.7": { pages: { "platform/dev/6.7/a.md": entry("h1") } },
      "developer:6.6": { pages: { "platform/dev/6.6/a.md": entry("h1", { sharedFrom: "platform/dev/6.7/a.md" }) } },
    },
  };
  const groups = groupSharedDevPages(CONFIG, state, "6.7");
  const sixSix = groups.find((g) => g.refs[0].version === "6.6")!;
  const orphaned = sixSix.refs.length === 1 && sixSix.refs[0].entry.sharedFrom !== undefined;
  assert.equal(orphaned, true);
});

// --------------------------------------------------------------------------------
// writeBatches: mixed per-item batch sizes in one prepare
// --------------------------------------------------------------------------------

test("writeBatches: a per-item batch-size function keeps runs contiguous and independently sized", () => {
  const dir = mkdtempSync(join(tmpdir(), "kb-writebatches-"));
  try {
    const codeItems = Array.from({ length: 7 }, (_, i) => ({ path: `code-${i}`, outputPath: `/tmp/x${i}`, codeCheck: { flags: {} } }));
    const docsItems = Array.from({ length: 17 }, (_, i) => ({ path: `docs-${i}`, outputPath: `/tmp/y${i}` }));
    const items = [...codeItems, ...docsItems] as never[];
    const promptPath = resolve(dir, "prompt.md");
    mkdirSync(dir, { recursive: true });
    writeFileSync(promptPath, "prompt text");

    const sizeFor = (item: { codeCheck?: unknown }) => (item.codeCheck ? 5 : 15);
    const files = writeBatches(dir, "pages", items, promptPath, sizeFor as never);
    // 7 code items @5 -> 2 batches (5+2); 17 docs items @15 -> 2 batches (15+2)
    assert.equal(files.length, 4);

    const pending = readPendingBatches(dir, "pages");
    assert.equal(pending[0].batch.items.length, 5);
    assert.equal(pending[1].batch.items.length, 2);
    assert.equal(pending[2].batch.items.length, 15);
    assert.equal(pending[3].batch.items.length, 2);
    assert.equal((pending[0].batch.items[0] as { codeCheck?: unknown }).codeCheck !== undefined, true);
    assert.equal((pending[2].batch.items[0] as { codeCheck?: unknown }).codeCheck, undefined);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

// --------------------------------------------------------------------------------
// resolveIngestKnownPaths: link/cross-link targets a reader can resolve at --ingest time
// --------------------------------------------------------------------------------

function emptyState(): Parameters<typeof resolveIngestKnownPaths>[0] {
  return { sources: { developer: { pages: {} } } } as unknown as Parameters<typeof resolveIngestKnownPaths>[0];
}

test("resolveIngestKnownPaths: two items in the same pending batch that link each other both resolve", () => {
  const dir = mkdtempSync(join(tmpdir(), "kb-ingestknown-"));
  try {
    const promptPath = resolve(dir, "prompt.md");
    mkdirSync(dir, { recursive: true });
    writeFileSync(promptPath, "prompt text");
    const items = [
      { path: "platform/dev/6.7/a.md", outputPath: resolve(dir, "a.md") },
      { path: "platform/dev/6.7/b.md", outputPath: resolve(dir, "b.md") },
    ] as never[];
    writeBatches(dir, "pages", items, promptPath, 15);

    const known = resolveIngestKnownPaths(emptyState(), dir);
    assert.equal(known.has("platform/dev/6.7/a.md"), true);
    assert.equal(known.has("platform/dev/6.7/b.md"), true);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("resolveIngestKnownPaths: a path that is neither built nor pending is rejected", () => {
  const dir = mkdtempSync(join(tmpdir(), "kb-ingestknown-"));
  try {
    const promptPath = resolve(dir, "prompt.md");
    mkdirSync(dir, { recursive: true });
    writeFileSync(promptPath, "prompt text");
    writeBatches(dir, "pages", [{ path: "platform/dev/6.7/a.md", outputPath: resolve(dir, "a.md") }] as never[], promptPath, 15);

    const known = resolveIngestKnownPaths(emptyState(), dir);
    assert.equal(known.has("platform/dev/6.7/ghost.md"), false);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("resolveIngestKnownPaths: also includes already-built pages from state, alongside pending ones", () => {
  const dir = mkdtempSync(join(tmpdir(), "kb-ingestknown-"));
  try {
    const promptPath = resolve(dir, "prompt.md");
    mkdirSync(dir, { recursive: true });
    writeFileSync(promptPath, "prompt text");
    writeBatches(dir, "pages", [{ path: "platform/dev/6.7/pending.md", outputPath: resolve(dir, "pending.md") }] as never[], promptPath, 15);

    const state = { sources: { developer: { pages: { "platform/dev/6.7/built.md": entry("h1") } } } } as unknown as Parameters<typeof resolveIngestKnownPaths>[0];
    const known = resolveIngestKnownPaths(state, dir);
    assert.equal(known.has("platform/dev/6.7/built.md"), true);
    assert.equal(known.has("platform/dev/6.7/pending.md"), true);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

// --------------------------------------------------------------------------------
// validateCodeCheckSection: ingest gate rules 1-6
// --------------------------------------------------------------------------------

/** Vendor-mode `CodeRoot` fixture matching `vendor/shopware/{core,storefront,administration/...}`
 *  under `dir` — the layout the existing gate tests already write fixture files against. */
function vendorRootAt(dir: string): CodeRoot {
  return {
    mode: "vendor",
    packageRoots: {
      core: resolve(dir, "vendor/shopware/core"),
      storefront: resolve(dir, "vendor/shopware/storefront"),
      administration: resolve(dir, "vendor/shopware/administration/Resources/app/administration/src"),
    },
    codeVersion: "6.7.13.0+deadbeef",
  };
}

function makeIndex(overrides: Partial<CodeIndex> = {}): CodeIndex {
  return {
    coreVersion: "6.7.13.0",
    vendorHash: "deadbeef",
    words: new Map(),
    literals: new Set(),
    classes: new Set(),
    namespacePrefixes: new Set(),
    shortClassNames: new Set(),
    deprecated: new Set(),
    flags: new Map(),
    ...overrides,
  };
}

function makeItem(flags: Partial<{ absent: string[]; deprecated: string[]; unread: string[] }> = {}): PageWorkItem {
  return {
    path: "platform/dev/6.7/a.md",
    outputPath: "/tmp/a.md",
    codeCheck: { coreVersion: "6.7.13.0", flags: { absent: [], deprecated: [], unread: [], ...flags } },
  };
}

test("gate: missing section is rejected when the source had >=1 Tier 0 flag", () => {
  const item = makeItem({ absent: ["getDefinitionClass"] });
  const reason = validateCodeCheckSection(item, "## What it is\nSome text.\n", undefined);
  assert.match(reason ?? "", /missing the required/);
});

test("gate: the section is required even with 0 Tier 0 flags — matches lint's rule (lint.ts codeCheckedAgainst check)", () => {
  const item = makeItem();
  const reason = validateCodeCheckSection(item, "## What it is\nSome text.\n", undefined);
  assert.match(reason ?? "", /missing the required/);
});

test("gate: a fully valid section with 0 Tier 0 flags still passes", () => {
  const item = makeItem();
  const body = ["## What it is", "x", "", "## Code check (6.7.13.0)", "- unverified `Nothing` — nothing Shopware-shaped found in the source"].join("\n");
  const reason = validateCodeCheckSection(item, body, undefined);
  assert.equal(reason, undefined);
});

test("gate: wrong section version is rejected", () => {
  const item = makeItem();
  const body = "## What it is\nx\n\n## Code check (6.6.0.0)\n- absent `Foo` — not found\n";
  const reason = validateCodeCheckSection(item, body, undefined);
  assert.match(reason ?? "", /does not match codeCheckedAgainst/);
});

test("gate: rule 2 — a malformed line is rejected", () => {
  const item = makeItem();
  const body = "## What it is\nx\n\n## Code check (6.7.13.0)\n- this is not a valid line\n";
  const reason = validateCodeCheckSection(item, body, undefined);
  assert.match(reason ?? "", /does not match the required format/);
});

test("gate: rule 2 — a citation to a non-existent vendor path is rejected", () => {
  const dir = mkdtempSync(join(tmpdir(), "kb-gate-"));
  try {
    const item = makeItem();
    const body = "## What it is\nx\n\n## Code check (6.7.13.0)\n- confirmed `getPrice` — exists — vendor/shopware/core/DoesNotExist.php:5\n";
    const ctx: CodeCheckCtx = { index: makeIndex(), installedMajor: "6.7", codeHash: "h", root: vendorRootAt(dir) };
    const reason = validateCodeCheckSection(item, body, ctx);
    assert.match(reason ?? "", /cites a path that does not exist/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("gate: rule 2 — token must appear within +/-3 lines of the cited line", () => {
  const dir = mkdtempSync(join(tmpdir(), "kb-gate-"));
  try {
    mkdirSync(resolve(dir, "vendor/shopware/core"), { recursive: true });
    writeFileSync(resolve(dir, "vendor/shopware/core/Foo.php"), Array.from({ length: 20 }, (_, i) => `line ${i}`).join("\n"));
    const item = makeItem();
    const body = "## What it is\nx\n\n## Code check (6.7.13.0)\n- confirmed `getPrice` — exists — vendor/shopware/core/Foo.php:10\n";
    const ctx: CodeCheckCtx = { index: makeIndex(), installedMajor: "6.7", codeHash: "h", root: vendorRootAt(dir) };
    const reason = validateCodeCheckSection(item, body, ctx);
    assert.match(reason ?? "", /does not appear within/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("gate: rule 2 — a dotted config key's leaf citation passes even though the leaf collides with a NON_IDENTIFIER_WORDS keyword (PHP tree builder)", () => {
  const dir = mkdtempSync(join(tmpdir(), "kb-gate-"));
  try {
    mkdirSync(resolve(dir, "vendor/shopware/core/Framework/DependencyInjection"), { recursive: true });
    const lines = Array.from({ length: 90 }, (_, i) => `line ${i}`);
    lines[82] = "->arrayNode('public')";
    writeFileSync(resolve(dir, "vendor/shopware/core/Framework/DependencyInjection/Configuration.php"), lines.join("\n"));
    const item = makeItem();
    const body =
      "## What it is\nx\n\n## Code check (6.7.13.0)\n- confirmed `shopware.filesystem.public` — exists — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:83\n";
    const ctx: CodeCheckCtx = { index: makeIndex(), installedMajor: "6.7", codeHash: "h", root: vendorRootAt(dir) };
    const reason = validateCodeCheckSection(item, body, ctx);
    assert.equal(reason, undefined);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("gate: rule 2 — a dotted config key's leaf citation passes even though the leaf collides with a NON_IDENTIFIER_WORDS keyword (YAML)", () => {
  const dir = mkdtempSync(join(tmpdir(), "kb-gate-"));
  try {
    mkdirSync(resolve(dir, "vendor/shopware/core/Framework/Resources/config/packages"), { recursive: true });
    const lines = Array.from({ length: 185 }, (_, i) => `line ${i}`);
    lines[176] = "    private:";
    writeFileSync(resolve(dir, "vendor/shopware/core/Framework/Resources/config/packages/shopware.yaml"), lines.join("\n"));
    const item = makeItem();
    const body =
      "## What it is\nx\n\n## Code check (6.7.13.0)\n- confirmed `shopware.filesystem.private` — exists — vendor/shopware/core/Framework/Resources/config/packages/shopware.yaml:177\n";
    const ctx: CodeCheckCtx = { index: makeIndex(), installedMajor: "6.7", codeHash: "h", root: vendorRootAt(dir) };
    const reason = validateCodeCheckSection(item, body, ctx);
    assert.equal(reason, undefined);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("gate: rule 3 — confirmed rejected when the cited declaration carries a deprecation marker", () => {
  const dir = mkdtempSync(join(tmpdir(), "kb-gate-"));
  try {
    mkdirSync(resolve(dir, "vendor/shopware/core"), { recursive: true });
    writeFileSync(resolve(dir, "vendor/shopware/core/Foo.php"), "0\n/** @deprecated tag:v6.8.0 */\ngetPrice\n4\n5\n6\n");
    const item = makeItem();
    const body = "## What it is\nx\n\n## Code check (6.7.13.0)\n- confirmed `getPrice` — exists — vendor/shopware/core/Foo.php:3\n";
    const ctx: CodeCheckCtx = { index: makeIndex({ words: new Map([["getPrice", 1]]), deprecated: new Set(["getPrice"]) }), installedMajor: "6.7", codeHash: "h", root: vendorRootAt(dir) };
    const reason = validateCodeCheckSection(item, body, ctx);
    assert.match(reason ?? "", /confirmed.*deprecation marker/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("gate: rule 4 — absent rejected when the index has hits for the token", () => {
  const item = makeItem();
  const body = "## What it is\nx\n\n## Code check (6.7.13.0)\n- absent `getPrice` — not found\n";
  const ctx: CodeCheckCtx = { index: makeIndex({ words: new Map([["getPrice", 3]]) }), installedMajor: "6.7", codeHash: "h", root: vendorRootAt("/tmp") };
  const reason = validateCodeCheckSection(item, body, ctx);
  assert.match(reason ?? "", /absent.*hits/);
});

test("gate: rule 4 — a Tier 0-absent FQCN whose short name exists under a different namespace still passes as absent", () => {
  // Real case: docs cite `Shopware\Core\Framework\ThemeInterface`, but the real class lives in
  // Storefront under the same last segment `ThemeInterface`. Tier 0 (flagIdentifiers) judged the
  // wrong FQCN absent because `index.classes` has no exact match; the absent check must agree,
  // not reject it for the last-segment word hit that the real Storefront class produces.
  const item = makeItem({ absent: ["Shopware\\Core\\Framework\\ThemeInterface"] });
  const body = [
    "## What it is",
    "x",
    "",
    "## Code check (6.7.13.0)",
    "- absent `Shopware\\Core\\Framework\\ThemeInterface` — wrong namespace, lives in Storefront",
  ].join("\n");
  const ctx: CodeCheckCtx = {
    index: makeIndex({ words: new Map([["ThemeInterface", 1]]), classes: new Set(["Shopware\\Storefront\\Framework\\ThemeInterface"]) }),
    installedMajor: "6.7",
    codeHash: "h",
    root: vendorRootAt("/tmp"),
  };
  const reason = validateCodeCheckSection(item, body, ctx);
  assert.equal(reason, undefined);
});

test("gate: rule 4 — an FQCN that really exists in the index is still rejected as absent", () => {
  const item = makeItem({ absent: ["Shopware\\Core\\Framework\\ThemeInterface"] });
  const body = [
    "## What it is",
    "x",
    "",
    "## Code check (6.7.13.0)",
    "- absent `Shopware\\Core\\Framework\\ThemeInterface` — not found",
  ].join("\n");
  const ctx: CodeCheckCtx = {
    index: makeIndex({ classes: new Set(["Shopware\\Core\\Framework\\ThemeInterface"]) }),
    installedMajor: "6.7",
    codeHash: "h",
    root: vendorRootAt("/tmp"),
  };
  const reason = validateCodeCheckSection(item, body, ctx);
  assert.match(reason ?? "", /absent.*hits/);
});

test("gate: rule 5 — coverage requires every Tier 0 source flag listed with the same status", () => {
  const item = makeItem({ absent: ["getDefinitionClass"] });
  const body = "## What it is\nx\n\n## Code check (6.7.13.0)\n- absent `somethingElse` — not found\n";
  const reason = validateCodeCheckSection(item, body, undefined);
  assert.match(reason ?? "", /does not list "getDefinitionClass" as absent/);
});

test("gate: rule 6 — a flagged token surviving into Key steps/Essential identifiers is rejected", () => {
  const item = makeItem();
  const body = [
    "## What it is",
    "x",
    "",
    "## Key steps / config",
    "Call `LineItem::getGhostMethod()`.",
    "",
    "## Code check (6.7.13.0)",
    "- absent `getGhostMethod` — not found",
  ].join("\n");
  const ctx: CodeCheckCtx = { index: makeIndex({ shortClassNames: new Set(["LineItem"]) }), installedMajor: "6.7", codeHash: "h", root: vendorRootAt("/tmp") };
  const reason = validateCodeCheckSection(item, body, ctx);
  assert.match(reason ?? "", /still contain flagged identifiers/);
});

test("gate: a fully valid section (absent, no citation needed) passes", () => {
  const item = makeItem({ absent: ["getGhostMethod"] });
  const body = ["## What it is", "x", "", "## Code check (6.7.13.0)", "- absent `getGhostMethod` — replaced by getRealMethod"].join("\n");
  const ctx: CodeCheckCtx = { index: makeIndex(), installedMajor: "6.7", codeHash: "h", root: vendorRootAt("/tmp") };
  const reason = validateCodeCheckSection(item, body, ctx);
  assert.equal(reason, undefined);
});

// --------------------------------------------------------------------------------
// codeHash-driven needsWork (state, "codeHash !== ${coreVersion}+${hash8}")
// --------------------------------------------------------------------------------

test("needsWork: a codeCheck page with a stale codeHash needs work even when hash === builtHash", () => {
  const currentCodeHash = "6.7.13.0+deadbeef";
  const upToDate = entry("h1", { codeHash: currentCodeHash });
  const stale = entry("h1", { codeHash: "6.7.13.0+aaaaaaaa" });
  const never = entry("h1");
  const needsWork = (e: StatePageEntry) => e.hash !== e.builtHash || e.codeHash !== currentCodeHash;
  assert.equal(needsWork(upToDate), false);
  assert.equal(needsWork(stale), true);
  assert.equal(needsWork(never), true);
});

function gateFixture(fileText: string): { dir: string; ctx: CodeCheckCtx } {
  const dir = mkdtempSync(join(tmpdir(), "kb-gate-"));
  mkdirSync(resolve(dir, "vendor/shopware/core"), { recursive: true });
  writeFileSync(resolve(dir, "vendor/shopware/core/Foo.php"), fileText);
  return { dir, ctx: { index: makeIndex({ words: new Map([["getEntityName", 1]]) }), installedMajor: "6.7", codeHash: "h", root: vendorRootAt(dir) } };
}

test("gate: compound tokens and clauses containing em dashes parse; corrected matches the backticked code identifier", () => {
  const { dir, ctx } = gateFixture("<?php\nabstract class EntityExtension\n{\n    abstract public function getEntityName(): string;\n}\n");
  try {
    const item = makeItem({ absent: ["getDefinitionClass"] });
    const body = [
      "## What it is",
      "x",
      "",
      "## Code check (6.7.13.0)",
      "- corrected `EntityExtension::getDefinitionClass()` — docs: override it — code requires `getEntityName(): string` — vendor/shopware/core/Foo.php:4",
      "- absent `EntityExtension::getDefinitionClass()` — no such method",
    ].join("\n");
    assert.equal(validateCodeCheckSection(item, body, ctx), undefined);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("gate: a corrected line cannot pass on prose words that happen to be in the cited window", () => {
  const { dir, ctx } = gateFixture("<?php\nabstract class EntityExtension\n{\n    abstract public function getEntityName(): string;\n}\n");
  try {
    const body = "## What it is\nx\n\n## Code check (6.7.13.0)\n- corrected `getDefinitionClass()` — docs: abstract class requires it — vendor/shopware/core/Foo.php:4\n";
    assert.match(validateCodeCheckSection(makeItem(), body, ctx) ?? "", /does not appear within/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("gate: a CLI command token must appear verbatim in the cited window", () => {
  const { dir, ctx } = gateFixture("<service id=\"Foo\">\n    <tag name=\"console.command\"/>\n</service>\n");
  try {
    const body = "## What it is\nx\n\n## Code check (6.7.13.0)\n- confirmed `bin/console number-range:migrate` — exists — vendor/shopware/core/Foo.php:2\n";
    assert.match(validateCodeCheckSection(makeItem(), body, ctx) ?? "", /does not appear within/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("gate: rule 2 — a file-path token whose citation ends with that path passes even though the file's own contents never mention its path", () => {
  const dir = mkdtempSync(join(tmpdir(), "kb-gate-"));
  try {
    const templateDir = resolve(dir, "vendor/shopware/storefront/Resources/views/storefront/page/search");
    mkdirSync(templateDir, { recursive: true });
    writeFileSync(resolve(templateDir, "index.html.twig"), Array.from({ length: 20 }, (_, i) => `{# line ${i} #}`).join("\n"));
    const item = makeItem();
    const body = [
      "## What it is",
      "x",
      "",
      "## Code check (6.7.13.0)",
      "- confirmed `page/search/index.html.twig` — exists — vendor/shopware/storefront/Resources/views/storefront/page/search/index.html.twig:15",
    ].join("\n");
    const ctx: CodeCheckCtx = { index: makeIndex(), installedMajor: "6.7", codeHash: "h", root: vendorRootAt(dir) };
    assert.equal(validateCodeCheckSection(item, body, ctx), undefined);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("gate: rule 2 — a file-path token citing a different file that never mentions it is still rejected", () => {
  const dir = mkdtempSync(join(tmpdir(), "kb-gate-"));
  try {
    mkdirSync(resolve(dir, "vendor/shopware/storefront/Resources/views/storefront/page/product-detail"), { recursive: true });
    writeFileSync(
      resolve(dir, "vendor/shopware/storefront/Resources/views/storefront/page/product-detail/index.html.twig"),
      Array.from({ length: 20 }, (_, i) => `{# line ${i} #}`).join("\n"),
    );
    const item = makeItem();
    const body = [
      "## What it is",
      "x",
      "",
      "## Code check (6.7.13.0)",
      "- confirmed `page/search/index.html.twig` — exists — vendor/shopware/storefront/Resources/views/storefront/page/product-detail/index.html.twig:15",
    ].join("\n");
    const ctx: CodeCheckCtx = { index: makeIndex(), installedMajor: "6.7", codeHash: "h", root: vendorRootAt(dir) };
    assert.match(validateCodeCheckSection(item, body, ctx) ?? "", /does not appear within/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("tokenIdentifiers: members, FQCNs, signatures and CLI command names", () => {
  assert.deepEqual(tokenIdentifiers("EntityExtension::getDefinitionClass()"), ["getDefinitionClass"]);
  assert.deepEqual(tokenIdentifiers("Shopware\\Core\\Framework\\Foo"), ["Foo"]);
  assert.deepEqual(tokenIdentifiers("iterate(?array $offset): ?EntityIndexingMessage"), ["iterate", "offset", "EntityIndexingMessage"]);
  assert.deepEqual(tokenIdentifiers("bin/console number-range:migrate"), ["number-range:migrate"]);
  assert.deepEqual(tokenIdentifiers("config.connection"), ["config.connection", "connection"]);
  assert.deepEqual(tokenIdentifiers("EntityIndexingMessage::$forceQueue"), ["forceQueue"]);
});

test("tokenIdentifiers: a dotted config key's leaf is kept even when it collides with a NON_IDENTIFIER_WORDS keyword", () => {
  assert.deepEqual(tokenIdentifiers("shopware.filesystem.public"), ["shopware.filesystem.public", "public"]);
  assert.deepEqual(tokenIdentifiers("shopware.filesystem.private"), ["shopware.filesystem.private", "private"]);
  // A bare word outside a dotted key is still syntax noise, not a citation candidate.
  assert.deepEqual(tokenIdentifiers("public"), []);
});

test("tokenIdentifiers: a Class::MEMBER token's member is kept regardless of length", () => {
  assert.deepEqual(tokenIdentifiers("ApiRouteScope::ID"), ["ID"]);
  assert.deepEqual(tokenIdentifiers("StoreApiRouteScope::ID"), ["ID"]);
  // A generic short word outside `::` is still dropped as syntax noise.
  assert.deepEqual(tokenIdentifiers("ID"), []);
});

test("tokenIdentifiers: a Class::MEMBER token's member is kept even when it collides with a NON_IDENTIFIER_WORDS keyword", () => {
  assert.deepEqual(tokenIdentifiers("CustomFieldTypes::INT"), ["INT"]);
  assert.deepEqual(tokenIdentifiers("CustomFieldTypes::FLOAT"), ["FLOAT"]);
  assert.deepEqual(tokenIdentifiers("CustomFieldTypes::BOOL"), ["BOOL"]);
  // The same word outside `::`, e.g. a bare type-hint in a signature, is still syntax noise.
  assert.deepEqual(tokenIdentifiers("iterate(int $offset)"), ["iterate", "offset"]);
});

test("gate: rule 2 — a short Class::MEMBER token's member is a valid citation candidate", () => {
  const dir = mkdtempSync(join(tmpdir(), "kb-gate-"));
  try {
    mkdirSync(resolve(dir, "vendor/shopware/core"), { recursive: true });
    writeFileSync(resolve(dir, "vendor/shopware/core/Foo.php"), "<?php\n#[Package('framework')]\nclass ApiRouteScope\n{\n    final public const ID = 'api';\n    final public const ALLOWED_PATH = 'api';\n}\n");
    const item = makeItem();
    const body = "## What it is\nx\n\n## Code check (6.7.13.0)\n- confirmed `ApiRouteScope::ID` — exists — vendor/shopware/core/Foo.php:5\n";
    const ctx: CodeCheckCtx = { index: makeIndex(), installedMajor: "6.7", codeHash: "h", root: vendorRootAt(dir) };
    assert.equal(validateCodeCheckSection(item, body, ctx), undefined);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

// --------------------------------------------------------------------------------
// rule 3 — deprecation is judged at the cited declaration's own annotations, not a
// fixed-size window that leaks a neighbouring declaration's docblock.
// --------------------------------------------------------------------------------

test("gate: rule 3 — a class citation is not rejected by a member's own @deprecated docblock below it", () => {
  const dir = mkdtempSync(join(tmpdir(), "kb-gate-"));
  try {
    mkdirSync(resolve(dir, "vendor/shopware/core"), { recursive: true });
    writeFileSync(
      resolve(dir, "vendor/shopware/core/Foo.php"),
      "<?php\n#[Package('checkout')]\nclass OrderConverter\n{\n    /**\n     * @deprecated tag:v6.8.0 - not used anymore\n     */\n    final public const CART_CONVERTED_TO_ORDER_EVENT = 'x';\n}\n",
    );
    const item = makeItem();
    const body = "## What it is\nx\n\n## Code check (6.7.13.0)\n- confirmed `OrderConverter` — exists — vendor/shopware/core/Foo.php:3\n";
    const ctx: CodeCheckCtx = { index: makeIndex({ words: new Map([["OrderConverter", 1]]) }), installedMajor: "6.7", codeHash: "h", root: vendorRootAt(dir) };
    assert.equal(validateCodeCheckSection(item, body, ctx), undefined);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("gate: rule 3 — a field citation is not rejected by an unrelated sibling field's @deprecated comment", () => {
  const dir = mkdtempSync(join(tmpdir(), "kb-gate-"));
  try {
    mkdirSync(resolve(dir, "vendor/shopware/core"), { recursive: true });
    writeFileSync(
      resolve(dir, "vendor/shopware/core/Foo.php"),
      "<?php\nclass Fields\n{\n    public array $fields = [\n        (new BoolField('hreflang_active', 'hreflangActive')),\n        // @deprecated tag:v6.8.0 - use maintenanceIpAllowlist instead\n        (new ListField('maintenance_ip_whitelist', 'maintenanceIpWhitelist')),\n    ];\n}\n",
    );
    const item = makeItem();
    const body = "## What it is\nx\n\n## Code check (6.7.13.0)\n- confirmed `hreflangActive` — exists — vendor/shopware/core/Foo.php:5\n";
    const ctx: CodeCheckCtx = { index: makeIndex({ words: new Map([["hreflangActive", 1]]) }), installedMajor: "6.7", codeHash: "h", root: vendorRootAt(dir) };
    assert.equal(validateCodeCheckSection(item, body, ctx), undefined);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("gate: rule 3 — a class attribute's own docblock (multi-line attribute, cited interior line) does not leak in", () => {
  const dir = mkdtempSync(join(tmpdir(), "kb-gate-"));
  try {
    mkdirSync(resolve(dir, "vendor/shopware/core"), { recursive: true });
    writeFileSync(
      resolve(dir, "vendor/shopware/core/Foo.php"),
      "<?php\n/**\n * @deprecated tag:v6.8.0 - reason:becomes-internal\n */\n#[AsCommand(\n    name: 'translation:validate',\n)]\nclass ValidateSnippetsCommand\n{\n}\n",
    );
    const item = makeItem();
    const body = "## What it is\nx\n\n## Code check (6.7.13.0)\n- confirmed `translation:validate` — exists — vendor/shopware/core/Foo.php:6\n";
    const ctx: CodeCheckCtx = { index: makeIndex(), installedMajor: "6.7", codeHash: "h", root: vendorRootAt(dir) };
    assert.equal(validateCodeCheckSection(item, body, ctx), undefined);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("gate: rule 3 — a const's own docblock directly above it still rejects confirmed (true positive)", () => {
  const dir = mkdtempSync(join(tmpdir(), "kb-gate-"));
  try {
    mkdirSync(resolve(dir, "vendor/shopware/core"), { recursive: true });
    writeFileSync(
      resolve(dir, "vendor/shopware/core/Foo.php"),
      "<?php\n#[Package('checkout')]\nfinal class StateMachineTransitionActions\n{\n    public const ACTION_CANCEL = 'cancel';\n    public const ACTION_COMPLETE = 'complete';\n\n    /**\n     * @deprecated tag:v6.8.0 - Will be removed in 6.8.0. Use ACTION_PROCESS instead\n     */\n    public const ACTION_DO_PAY = 'do_pay';\n}\n",
    );
    const item = makeItem();
    const body = "## What it is\nx\n\n## Code check (6.7.13.0)\n- confirmed `StateMachineTransitionActions::ACTION_DO_PAY` — exists — vendor/shopware/core/Foo.php:11\n";
    const ctx: CodeCheckCtx = { index: makeIndex(), installedMajor: "6.7", codeHash: "h", root: vendorRootAt(dir) };
    assert.match(validateCodeCheckSection(item, body, ctx) ?? "", /confirmed.*deprecation marker/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("repairCodeCheckLineNumbers: re-points a citation to the line holding the token; leaves a token missing from the file alone", () => {
  const { dir } = gateFixture("<?php\n\n\n\n\n\n\n\n#[AsCommand(\n    name: 'number-range:migrate',\n)]\nclass MigrateCommand {}\n");
  try {
    const page = [
      "## Code check (6.7.13.0)",
      "- confirmed `number-range:migrate` — command exists — vendor/shopware/core/Foo.php:1",
      "- confirmed `ghost:command` — command exists — vendor/shopware/core/Foo.php:1",
    ].join("\n");
    const repaired = repairCodeCheckLineNumbers(page, vendorRootAt(dir));
    assert.match(repaired, /`number-range:migrate` — command exists — vendor\/shopware\/core\/Foo\.php:10$/m);
    assert.match(repaired, /`ghost:command` — command exists — vendor\/shopware\/core\/Foo\.php:1$/m);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("gate: rule 6b — a flagged dotted config key may not survive as its YAML leaf in Key steps", () => {
  const item = makeItem({ absent: ["shopware.number_range.redis_url"] });
  const body = [
    "## What it is",
    "x",
    "",
    "## Key steps / config",
    "```yaml",
    "shopware:",
    "    number_range:",
    "        redis_url: 'redis://host'",
    "```",
    "",
    "## Code check (6.7.13.0)",
    "- absent `shopware.number_range.redis_url` — not in the config tree",
  ].join("\n");
  const ctx: CodeCheckCtx = { index: makeIndex(), installedMajor: "6.7", codeHash: "h", root: vendorRootAt("/tmp") };
  assert.match(validateCodeCheckSection(item, body, ctx) ?? "", /still mention flagged identifier "shopware.number_range.redis_url"/);
});

test("gate: rule 7 — a Key steps snippet must declare every abstract member of its installed base", () => {
  const dir = mkdtempSync(join(tmpdir(), "kb-gate-"));
  try {
    mkdirSync(resolve(dir, "vendor/composer"), { recursive: true });
    mkdirSync(resolve(dir, "vendor/shopware/core/Indexing"), { recursive: true });
    writeFileSync(
      resolve(dir, "vendor/composer/autoload_classmap.php"),
      "<?php\n$vendorDir = dirname(__DIR__);\nreturn array(\n    'Shopware\\\\Core\\\\Indexing\\\\EntityIndexer' => $vendorDir . '/shopware/core/Indexing/EntityIndexer.php',\n);\n",
    );
    writeFileSync(
      resolve(dir, "vendor/shopware/core/Indexing/EntityIndexer.php"),
      "<?php\nabstract class EntityIndexer\n{\n    abstract public function getName(): string;\n    abstract public function getTotal(): int;\n    public function getOptions(): array { return []; }\n}\n",
    );
    const snippet = (methods: string[]) =>
      [
        "## What it is",
        "x",
        "",
        "## Key steps / config",
        "```php",
        "class MyIndexer extends EntityIndexer",
        "{",
        ...methods.map((m) => `    public function ${m}() {}`),
        "}",
        "```",
        "",
        "## Code check (6.7.13.0)",
        "- unverified `MyIndexer` — nothing else Shopware-shaped found in the source",
      ].join("\n");
    const ctx: CodeCheckCtx = { index: makeIndex(), installedMajor: "6.7", codeHash: "h", root: vendorRootAt(dir) };
    assert.match(validateCodeCheckSection(makeItem(), snippet(["getName"]), ctx) ?? "", /omits required members.*EntityIndexer: getTotal/);
    assert.equal(validateCodeCheckSection(makeItem(), snippet(["getName", "getTotal"]), ctx), undefined);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

// --------------------------------------------------------------------------------
// unverifiedIdentifiers (Fix 2: lint's Tier 0 re-scan trusts a page's own "unverified" disclosure)
// --------------------------------------------------------------------------------

test("unverifiedIdentifiers: reads the token and its member breakdown from an `- unverified` Code check line", () => {
  const body = [
    "## Key steps / config",
    "It calls `Utils::settle(...)->wait()`.",
    "",
    "## Code check (6.7.13.0)",
    "- confirmed `Context` — vendor/shopware/core/Framework/Context.php:17",
    "- unverified `Utils::settle()` — guzzlehttp/promises, out of scope",
  ].join("\n");
  const names = unverifiedIdentifiers(body);
  assert.equal(names.has("settle"), true, "the member identifier flagIdentifiers reports");
  assert.equal(names.has("Utils::settle()"), true, "the raw token too");
  assert.equal(names.has("Context"), false, "a confirmed line is not unverified");
});

test("unverifiedIdentifiers: no Code check section -> empty set", () => {
  assert.equal(unverifiedIdentifiers("## What it is\nx").size, 0);
});
