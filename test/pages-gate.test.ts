import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { validatePageOutput, type PageWorkItem } from "../ingest/platform/pages.js";
import { parseFrontmatter } from "../src/wiki/frontmatter.js";
import type { PlatformConfig } from "../ingest/shared/types.js";
import { words } from "./helpers.js";

// --------------------------------------------------------------------------------
// End-to-end contract test: a prompt-shaped fixture (prompts/page.md + page-outline.md)
// through the real validatePageOutput, then parsed with the real server parser
// (src/wiki/frontmatter.ts) — the gate and the server must agree on what a page looks like.
// --------------------------------------------------------------------------------

const CONFIG: PlatformConfig = {
  sizeLimits: { pageMaxBytes: 32768 } as PlatformConfig["sizeLimits"],
  articleTokens: { min: 300, max: 800, longMax: 1200, longSourceWordThreshold: 1500, bandTolerance: 0.2 },
} as unknown as PlatformConfig;

function yamlScalar(v: unknown): string {
  if (v === null || v === undefined) return "null";
  if (typeof v === "boolean" || typeof v === "number") return String(v);
  return `"${String(v).replace(/"/g, '\\"')}"`;
}

function yamlValue(v: unknown): string {
  if (Array.isArray(v)) return `[${v.map(yamlScalar).join(", ")}]`;
  if (v && typeof v === "object") return `{ ${Object.entries(v as Record<string, unknown>).map(([k, val]) => `${yamlScalar(k)}: ${yamlScalar(val)}`).join(", ")} }`;
  return yamlScalar(v);
}

function frontmatterBlock(fm: Record<string, unknown>): string {
  const lines = ["---"];
  for (const [k, v] of Object.entries(fm)) {
    if (v === undefined) continue;
    lines.push(`${k}: ${yamlValue(v)}`);
  }
  lines.push("---");
  return lines.join("\n");
}

function baseFrontmatter(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
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
    ...overrides,
  };
}

/** Only the fields `buildDevWorkItem`/`buildMerchantWorkItem` actually prefill — never
 *  `keywords`/`summary`/`lastBuilt`/`id` (those are the writer's own, or compared separately). */
function prefilledFrontmatter(fm: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const key of ["title", "docType", "version", "versions", "sourceUrl", "sourceHash", "sourceUrls", "revision", "codeCheckedAgainst"]) {
    if (key in fm) out[key] = fm[key];
  }
  return out;
}

function bodySections(opts: { codeCheckSection?: string; extraKeySteps?: string } = {}): string {
  const parts = [
    "## What it is",
    words(40) + ".",
    "",
    "## When to use",
    words(40) + ".",
    "",
    "## Key steps / config",
    `Step one. See [related](platform/dev/6.7/related.md) for more. ${words(50)}`,
    ...(opts.extraKeySteps ? ["", opts.extraKeySteps] : []),
    "",
    "## Essential identifiers",
    "`SomeClass::someMethod()` " + words(30),
    "",
    "## Gotchas",
    words(30) + ".",
    "",
    "## Version notes",
    words(20) + ".",
  ];
  if (opts.codeCheckSection) parts.push("", opts.codeCheckSection);
  return parts.join("\n");
}

function buildText(fm: Record<string, unknown>, body: string): string {
  return `${frontmatterBlock(fm)}\n${body}\n`;
}

let dir: string;
function fixturePath(text: string, name = "out.md"): string {
  const p = resolve(dir, name);
  writeFileSync(p, text, "utf8");
  return p;
}

function withDir(fn: () => void): void {
  dir = mkdtempSync(join(tmpdir(), "kb-pages-gate-"));
  try {
    fn();
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

function plainItem(overrides: Partial<PageWorkItem> = {}): PageWorkItem {
  const fm = baseFrontmatter();
  return {
    path: "platform/dev/6.7/topic.md",
    outputPath: "unused",
    frontmatter: prefilledFrontmatter(fm),
    links: ["platform/dev/6.7/related.md"],
    ...overrides,
  };
}

test("contract: a valid plain page passes the gate and round-trips through the real server parser", () => {
  withDir(() => {
    const fm = baseFrontmatter();
    const text = buildText(fm, bodySections());
    const outAbsPath = fixturePath(text);
    const item = plainItem();
    const knownPaths = new Set(["platform/dev/6.7/related.md"]);

    const result = validatePageOutput(item, outAbsPath, CONFIG, knownPaths, undefined);
    assert.equal(result.ok, true, (result as { ok: false; reason: string }).reason);

    const { data } = parseFrontmatter(text);
    assert.equal(data.title, fm.title);
    assert.equal(data.summary, fm.summary);
    assert.deepEqual(data.keywords, fm.keywords);
  });
});

test("contract: a valid codeCheck page (Code check section, matching coreVersion) passes and round-trips", () => {
  withDir(() => {
    const coreVersion = "6.7.13.0";
    const fm = baseFrontmatter({ codeCheckedAgainst: coreVersion });
    const codeCheckSection = [`## Code check (${coreVersion})`, "- unverified `Nothing` — nothing Shopware-shaped found in the source"].join("\n");
    const text = buildText(fm, bodySections({ codeCheckSection }));
    const outAbsPath = fixturePath(text);
    const item = plainItem({
      frontmatter: prefilledFrontmatter(fm),
      codeCheck: { coreVersion, flags: { absent: [], deprecated: [], unread: [] } as never },
    });
    const knownPaths = new Set(["platform/dev/6.7/related.md"]);

    const result = validatePageOutput(item, outAbsPath, CONFIG, knownPaths, undefined);
    assert.equal(result.ok, true, (result as { ok: false; reason: string }).reason);

    const { data } = parseFrontmatter(text);
    assert.equal(data.codeCheckedAgainst, coreVersion);
    assert.equal(data.title, fm.title);
    assert.deepEqual(data.keywords, fm.keywords);
  });
});

// --------------------------------------------------------------------------------
// Negative cases
// --------------------------------------------------------------------------------

test("negative: an unknown link (neither built nor pending) is rejected", () => {
  withDir(() => {
    const fm = baseFrontmatter();
    const text = buildText(fm, bodySections());
    const outAbsPath = fixturePath(text);
    const item = plainItem();
    const knownPaths = new Set<string>(); // "related.md" not known

    const result = validatePageOutput(item, outAbsPath, CONFIG, knownPaths, undefined);
    assert.equal(result.ok, false);
    assert.match((result as { ok: false; reason: string }).reason, /does not resolve to an ingested page/);
  });
});

test("negative: a pending link (present in knownPaths via the pending batch) resolves", () => {
  withDir(() => {
    const fm = baseFrontmatter();
    const text = buildText(fm, bodySections());
    const outAbsPath = fixturePath(text);
    const item = plainItem();
    // resolveIngestKnownPaths merges built + currently-pending batch paths into one set —
    // a pending sibling resolves exactly like an already-built page.
    const knownPaths = new Set(["platform/dev/6.7/related.md"]);

    const result = validatePageOutput(item, outAbsPath, CONFIG, knownPaths, undefined);
    assert.equal(result.ok, true, (result as { ok: false; reason: string }).reason);
  });
});

test("negative: a directory link (no .md, never a member of knownPaths) is rejected — gate mirrors lint", () => {
  withDir(() => {
    const fm = baseFrontmatter();
    const body = bodySections({ extraKeySteps: "Also see [the guide directory](platform/dev/6.7/guide)." });
    const text = buildText(fm, body);
    const outAbsPath = fixturePath(text);
    const item = plainItem({ links: ["platform/dev/6.7/related.md", "platform/dev/6.7/guide"] });
    const knownPaths = new Set(["platform/dev/6.7/related.md"]); // the directory itself is never a knownPath

    const result = validatePageOutput(item, outAbsPath, CONFIG, knownPaths, undefined);
    assert.equal(result.ok, false);
    assert.match((result as { ok: false; reason: string }).reason, /does not resolve to an ingested page: platform\/dev\/6\.7\/guide$/);
  });
});

test("negative: a changed sourceUrls (shared article) is rejected", () => {
  withDir(() => {
    const fm = baseFrontmatter({ sourceUrls: { "6.7": "https://developer.shopware.com/a", "6.6": "https://developer.shopware.com/b" } });
    const text = buildText({ ...fm, sourceUrls: { "6.7": "https://developer.shopware.com/CHANGED" } }, bodySections());
    const outAbsPath = fixturePath(text);
    const item = plainItem({ frontmatter: prefilledFrontmatter(fm) });
    const knownPaths = new Set(["platform/dev/6.7/related.md"]);

    const result = validatePageOutput(item, outAbsPath, CONFIG, knownPaths, undefined);
    assert.equal(result.ok, false);
    assert.match((result as { ok: false; reason: string }).reason, /prefilled field "sourceUrls" was changed/);
  });
});

test("negative: a changed revision (merchant) is rejected", () => {
  withDir(() => {
    const revision = { range: "6.6.0-6.7.0", swMin: "6.6.0", swMax: "6.7.0", current: true };
    const fm = baseFrontmatter({ docType: "functional", id: "platform/func/topic.md", revision });
    const text = buildText({ ...fm, revision: { ...revision, current: false } }, bodySections().replace("platform/dev/6.7/related.md", "platform/func/related.md"));
    const outAbsPath = fixturePath(text);
    const item = plainItem({
      path: "platform/func/topic.md",
      frontmatter: prefilledFrontmatter(fm),
      links: ["platform/func/related.md"],
    });
    const knownPaths = new Set(["platform/func/related.md"]);

    const result = validatePageOutput(item, outAbsPath, CONFIG, knownPaths, undefined);
    assert.equal(result.ok, false);
    assert.match((result as { ok: false; reason: string }).reason, /prefilled field "revision" was changed/);
  });
});

test("positive: a revision written back with reordered keys still passes", () => {
  withDir(() => {
    const revision = { range: "6.6.0-6.7.0", swMin: "6.6", swMax: "6.7", current: true };
    const fm = baseFrontmatter({ docType: "functional", id: "platform/func/topic.md", revision });
    // Writer emits the same values with a different key order — a plain object round-trip, not a change.
    const reordered = { current: revision.current, swMax: revision.swMax, swMin: revision.swMin, range: revision.range };
    const text = buildText({ ...fm, revision: reordered }, bodySections().replace("platform/dev/6.7/related.md", "platform/func/related.md"));
    const outAbsPath = fixturePath(text);
    const item = plainItem({
      path: "platform/func/topic.md",
      frontmatter: prefilledFrontmatter(fm),
      links: ["platform/func/related.md"],
    });
    const knownPaths = new Set(["platform/func/related.md"]);

    const result = validatePageOutput(item, outAbsPath, CONFIG, knownPaths, undefined);
    assert.equal(result.ok, true, (result as { ok: false; reason: string }).reason);
  });
});

test("positive: an unquoted numeric-looking swMin/swMax (parses back as a number, not a string) is not a genuine change", () => {
  withDir(() => {
    // parseScalar (src/wiki/frontmatter.ts) turns an unquoted "6.6" back into the number 6.6 —
    // that alone must not be treated as the writer having changed the prefilled `revision`.
    const revision = { range: "6.6.0-6.7.0", swMin: "6.6", swMax: "6.7", current: true };
    const fm = baseFrontmatter({ docType: "functional", id: "platform/func/topic.md", revision });
    const body = bodySections().replace("platform/dev/6.7/related.md", "platform/func/related.md");
    const lines = ["---"];
    for (const [k, v] of Object.entries(fm)) {
      if (k === "revision") continue;
      lines.push(`${k}: ${typeof v === "string" ? `"${v}"` : Array.isArray(v) ? `[${(v as string[]).map((x) => `"${x}"`).join(", ")}]` : v}`);
    }
    lines.push(`revision: { range: "${revision.range}", swMin: ${revision.swMin}, swMax: ${revision.swMax}, current: ${revision.current} }`);
    lines.push("---");
    const text = `${lines.join("\n")}\n${body}\n`;
    const outAbsPath = fixturePath(text);
    const item = plainItem({
      path: "platform/func/topic.md",
      frontmatter: prefilledFrontmatter(fm),
      links: ["platform/func/related.md"],
    });
    const knownPaths = new Set(["platform/func/related.md"]);

    const result = validatePageOutput(item, outAbsPath, CONFIG, knownPaths, undefined);
    assert.equal(result.ok, true, (result as { ok: false; reason: string }).reason);
  });
});

test("negative: a revision with a genuinely changed swMax (reordered keys) is still rejected", () => {
  withDir(() => {
    const revision = { range: "6.6.0-6.7.0", swMin: "6.6", swMax: "6.7", current: true };
    const fm = baseFrontmatter({ docType: "functional", id: "platform/func/topic.md", revision });
    const changed = { current: revision.current, swMax: "6.8", swMin: revision.swMin, range: revision.range };
    const text = buildText({ ...fm, revision: changed }, bodySections().replace("platform/dev/6.7/related.md", "platform/func/related.md"));
    const outAbsPath = fixturePath(text);
    const item = plainItem({
      path: "platform/func/topic.md",
      frontmatter: prefilledFrontmatter(fm),
      links: ["platform/func/related.md"],
    });
    const knownPaths = new Set(["platform/func/related.md"]);

    const result = validatePageOutput(item, outAbsPath, CONFIG, knownPaths, undefined);
    assert.equal(result.ok, false);
    assert.match((result as { ok: false; reason: string }).reason, /prefilled field "revision" was changed/);
  });
});

test("negative: a reordered but otherwise-unchanged versions[] array still fails (arrays stay order-sensitive)", () => {
  withDir(() => {
    const fm = baseFrontmatter({ versions: ["6.6", "6.7"] });
    const text = buildText({ ...fm, versions: ["6.7", "6.6"] }, bodySections());
    const outAbsPath = fixturePath(text);
    const item = plainItem({ frontmatter: prefilledFrontmatter(fm) });
    const knownPaths = new Set(["platform/dev/6.7/related.md"]);

    const result = validatePageOutput(item, outAbsPath, CONFIG, knownPaths, undefined);
    assert.equal(result.ok, false);
    assert.match((result as { ok: false; reason: string }).reason, /prefilled field "versions" was changed/);
  });
});

test("negative: a plain item with a ## Code check section the writer was not asked to produce is rejected", () => {
  withDir(() => {
    const fm = baseFrontmatter();
    const codeCheckSection = ["## Code check (6.7.13.0)", "- unverified `Nothing` — nothing found"].join("\n");
    const text = buildText(fm, bodySections({ codeCheckSection }));
    const outAbsPath = fixturePath(text);
    const item = plainItem(); // no item.codeCheck
    const knownPaths = new Set(["platform/dev/6.7/related.md"]);

    const result = validatePageOutput(item, outAbsPath, CONFIG, knownPaths, undefined);
    assert.equal(result.ok, false);
    assert.match((result as { ok: false; reason: string }).reason, /plain item must not include a ## Code check section/);
  });
});

test("negative: a plain item with an invented codeCheckedAgainst key is rejected", () => {
  withDir(() => {
    const fm = baseFrontmatter({ codeCheckedAgainst: "6.7.13.0" });
    const text = buildText(fm, bodySections());
    const outAbsPath = fixturePath(text);
    const item = plainItem(); // item.frontmatter has no codeCheckedAgainst — plain item
    const knownPaths = new Set(["platform/dev/6.7/related.md"]);

    const result = validatePageOutput(item, outAbsPath, CONFIG, knownPaths, undefined);
    assert.equal(result.ok, false);
    assert.match((result as { ok: false; reason: string }).reason, /plain item must not set codeCheckedAgainst/);
  });
});

test("negative: an empty Code check section (0 lines) is rejected", () => {
  withDir(() => {
    const coreVersion = "6.7.13.0";
    const fm = baseFrontmatter({ codeCheckedAgainst: coreVersion });
    const codeCheckSection = `## Code check (${coreVersion})`; // no lines at all
    const text = buildText(fm, bodySections({ codeCheckSection }));
    const outAbsPath = fixturePath(text);
    const item = plainItem({
      frontmatter: prefilledFrontmatter(fm),
      codeCheck: { coreVersion, flags: { absent: [], deprecated: [], unread: [] } as never },
    });
    const knownPaths = new Set(["platform/dev/6.7/related.md"]);

    const result = validatePageOutput(item, outAbsPath, CONFIG, knownPaths, undefined);
    assert.equal(result.ok, false);
    assert.match((result as { ok: false; reason: string }).reason, /has 0 lines/);
  });
});

test("positive: more than 10 flags, all listed, passes (cap is max(10, flags))", () => {
  withDir(() => {
    const coreVersion = "6.7.13.0";
    const absent = Array.from({ length: 12 }, (_, i) => `ghostMethod${i}`);
    const fm = baseFrontmatter({ codeCheckedAgainst: coreVersion });
    const codeCheckSection = [`## Code check (${coreVersion})`, ...absent.map((f) => `- absent \`${f}\` — not found`)].join("\n");
    const text = buildText(fm, bodySections({ codeCheckSection }));
    const outAbsPath = fixturePath(text);
    const item = plainItem({
      frontmatter: prefilledFrontmatter(fm),
      codeCheck: { coreVersion, flags: { absent, deprecated: [], unread: [] } as never },
    });
    const knownPaths = new Set(["platform/dev/6.7/related.md"]);

    const result = validatePageOutput(item, outAbsPath, CONFIG, knownPaths, undefined);
    assert.equal(result.ok, true, (result as { ok: false; reason: string }).reason);
  });
});

test("negative: an unquoted \" #\" in summary is rejected by checkFrontmatterQuoting", () => {
  withDir(() => {
    const fm = baseFrontmatter();
    let text = buildText(fm, bodySections());
    // Bypass the builder's automatic quoting to reproduce the exact bug checkFrontmatterQuoting exists to catch.
    text = text.replace(/^summary: ".*"$/m, "summary: A note about item #5 gotcha");
    const outAbsPath = fixturePath(text);
    const item = plainItem();
    const knownPaths = new Set(["platform/dev/6.7/related.md"]);

    const result = validatePageOutput(item, outAbsPath, CONFIG, knownPaths, undefined);
    assert.equal(result.ok, false);
    assert.match((result as { ok: false; reason: string }).reason, /truncates this value/);
  });
});

test("positive: a '## ' line inside a fenced code block is not mistaken for a heading", () => {
  withDir(() => {
    const fm = baseFrontmatter();
    const fenced = ["```yaml", "## Not really a heading", "shopware:", "    foo: bar", "```"].join("\n");
    const text = buildText(fm, bodySections({ extraKeySteps: fenced }));
    const outAbsPath = fixturePath(text);
    const item = plainItem();
    const knownPaths = new Set(["platform/dev/6.7/related.md"]);

    const result = validatePageOutput(item, outAbsPath, CONFIG, knownPaths, undefined);
    assert.equal(result.ok, true, (result as { ok: false; reason: string }).reason);
  });
});

test("positive: a github.com/shopware/... link is accepted by the hygiene allowlist", () => {
  withDir(() => {
    const fm = baseFrontmatter();
    const body = bodySections({ extraKeySteps: "See https://github.com/shopware/shopware/blob/trunk/src/Core/Foo.php for the source." });
    const text = buildText(fm, body);
    const outAbsPath = fixturePath(text);
    const item = plainItem();
    const knownPaths = new Set(["platform/dev/6.7/related.md"]);

    const result = validatePageOutput(item, outAbsPath, CONFIG, knownPaths, undefined);
    assert.equal(result.ok, true, (result as { ok: false; reason: string }).reason);
  });
});

test("negative: a package-purity tooling word is rejected", () => {
  withDir(() => {
    const fm = baseFrontmatter();
    const body = bodySections({ extraKeySteps: "This is produced by ingest/platform/pages.ts internally." });
    const text = buildText(fm, body);
    const outAbsPath = fixturePath(text);
    const item = plainItem();
    const knownPaths = new Set(["platform/dev/6.7/related.md"]);

    const result = validatePageOutput(item, outAbsPath, CONFIG, knownPaths, undefined);
    assert.equal(result.ok, false);
    assert.match((result as { ok: false; reason: string }).reason, /references tooling/);
  });
});

test("negative: a frontmatter block at/over the 8 KB read window is rejected", () => {
  withDir(() => {
    const fm = baseFrontmatter({ padding: "x".repeat(9000) });
    const text = buildText(fm, bodySections());
    const outAbsPath = fixturePath(text);
    const item = plainItem();
    const knownPaths = new Set(["platform/dev/6.7/related.md"]);

    const result = validatePageOutput(item, outAbsPath, CONFIG, knownPaths, undefined);
    assert.equal(result.ok, false);
    assert.match((result as { ok: false; reason: string }).reason, /truncated and fail to parse/);
  });
});
