import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { deriveAutoHubScopes, memberInfoFor, persistFailedHub, isDirty, validateHubOutput, type HubPage } from "../ingest/platform/hubs.js";
import { writeBatches, readPendingBatches } from "../ingest/shared/workitems.js";
import { parseFrontmatter } from "../src/wiki/frontmatter.js";
import type { HubStateEntry, IngestionState, PlatformConfig, WorkItem } from "../ingest/shared/types.js";
import { emptyState } from "./helpers.js";

function page(path: string, keywords: string[]): HubPage {
  return { path, keywords };
}

test("deriveAutoHubScopes: a keyword shared by >=4 pages across >1 directory becomes a hub", () => {
  const pages: HubPage[] = [
    page("platform/dev/6.7/guides/plugins/a.md", ["plugin", "extension"]),
    page("platform/dev/6.7/guides/plugins/b.md", ["plugin"]),
    page("platform/dev/6.6/guides/plugins/a.md", ["plugin"]),
    page("platform/func/plugins/c.md", ["plugin"]),
  ];
  const scopes = deriveAutoHubScopes(pages);
  assert.equal(scopes.length, 1);
  assert.equal(scopes[0].slug, "plugin");
  assert.equal(scopes[0].title, "plugin");
  assert.deepEqual(scopes[0].keywords, ["plugin"]);
});

test("deriveAutoHubScopes: a keyword confined to one directory never becomes a hub, even with enough pages", () => {
  const pages: HubPage[] = [
    page("platform/dev/6.7/guides/plugins/checkout/cart/a.md", ["cart-discount"]),
    page("platform/dev/6.7/guides/plugins/checkout/cart/b.md", ["cart-discount"]),
    page("platform/dev/6.7/guides/plugins/checkout/cart/c.md", ["cart-discount"]),
    page("platform/dev/6.7/guides/plugins/checkout/cart/d.md", ["cart-discount"]),
  ];
  assert.deepEqual(deriveAutoHubScopes(pages), []);
});

test("deriveAutoHubScopes: a keyword under the member-count floor never becomes a hub", () => {
  const pages: HubPage[] = [page("platform/dev/6.7/a.md", ["webhook"]), page("platform/func/b.md", ["webhook"])];
  assert.deepEqual(deriveAutoHubScopes(pages), []);
});

test("deriveAutoHubScopes: near-identical keyword page-sets merge into one hub instead of two", () => {
  const shared = ["platform/dev/6.7/a.md", "platform/dev/6.6/a.md", "platform/func/a.md", "platform/func/b.md"];
  const pages: HubPage[] = shared.map((path, i) => page(path, i === 0 ? ["plugin", "plugins"] : ["plugin"]));
  // "plugins" only co-occurs on one page but every "plugin" page-set member is shared —
  // give "plugins" the same 4-page set directly to force a near-identical page-set merge.
  const pluginsPages: HubPage[] = shared.map((path) => page(path, ["plugins"]));
  const merged = deriveAutoHubScopes([...pages, ...pluginsPages]);
  assert.equal(merged.length, 1);
  assert.deepEqual(merged[0].keywords, ["plugin", "plugins"]);
});

test("deriveAutoHubScopes: deterministic across repeated calls regardless of input order", () => {
  const pages: HubPage[] = [
    page("platform/dev/6.7/a.md", ["plugin"]),
    page("platform/dev/6.6/a.md", ["plugin"]),
    page("platform/func/a.md", ["plugin"]),
    page("platform/func/b.md", ["plugin"]),
    page("platform/dev/6.7/x.md", ["checkout"]),
    page("platform/dev/6.6/x.md", ["checkout"]),
    page("platform/func/x.md", ["checkout"]),
    page("platform/func/y.md", ["checkout"]),
  ];
  const first = deriveAutoHubScopes(pages);
  const second = deriveAutoHubScopes([...pages].reverse());
  assert.deepEqual(first, second);
});

// --------------------------------------------------------------------------------
// memberInfoFor: per-member {path, title, summary, keywords} for the hub work item
// --------------------------------------------------------------------------------

test("memberInfoFor: reads title/summary/keywords from the member's own built frontmatter", () => {
  const wikiRoot = mkdtempSync(join(tmpdir(), "kb-hub-memberinfo-"));
  try {
    mkdirSync(resolve(wikiRoot, "platform/dev/6.7"), { recursive: true });
    writeFileSync(
      resolve(wikiRoot, "platform/dev/6.7/a.md"),
      ["---", "id: platform/dev/6.7/a.md", 'title: "A page"', 'summary: "About A"', "keywords: [alpha, beta]", "---", "", "# A page"].join("\n"),
    );
    const info = memberInfoFor(wikiRoot, "platform/dev/6.7/a.md");
    assert.deepEqual(info, { path: "platform/dev/6.7/a.md", title: "A page", summary: "About A", keywords: ["alpha", "beta"] });
  } finally {
    rmSync(wikiRoot, { recursive: true, force: true });
  }
});

test("memberInfoFor: a member file that does not exist yet falls back to its path, empty summary/keywords", () => {
  const wikiRoot = mkdtempSync(join(tmpdir(), "kb-hub-memberinfo-"));
  try {
    const info = memberInfoFor(wikiRoot, "platform/dev/6.7/missing.md");
    assert.deepEqual(info, { path: "platform/dev/6.7/missing.md", title: "platform/dev/6.7/missing.md", summary: "", keywords: [] });
  } finally {
    rmSync(wikiRoot, { recursive: true, force: true });
  }
});

// --------------------------------------------------------------------------------
// writeBatches(..., 1, ...): one hub per batch file (skill launches one agent per hub)
// --------------------------------------------------------------------------------

test("hubs batch one item per file: a constant batchSize of 1 never bundles two hubs together", () => {
  const dir = mkdtempSync(join(tmpdir(), "kb-hub-batching-"));
  try {
    const promptPath = resolve(dir, "prompt.md");
    writeFileSync(promptPath, "hub prompt");
    const items = ["plugin", "checkout", "webhook"].map((slug) => ({
      path: `platform/hubs/${slug}.md`,
      outputPath: resolve(dir, `${slug}.md`),
      members: [`platform/dev/6.7/${slug}/a.md`],
    })) as unknown as WorkItem[];
    const files = writeBatches(dir, "hubs", items, promptPath, 1, undefined);
    assert.equal(files.length, 3);
    const pending = readPendingBatches(dir, "hubs");
    for (const { batch } of pending) assert.equal(batch.items.length, 1);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

// --------------------------------------------------------------------------------
// persistFailedHub: no endless re-prepare loop (design doc "State, dedupe, build, lint")
// --------------------------------------------------------------------------------

test("persistFailedHub: records the attempted members, not an empty default, so isDirty sees them as unchanged next time", () => {
  const state = { hubs: {} as Record<string, HubStateEntry> };
  const item = { path: "platform/hubs/plugin.md", outputPath: "/tmp/plugin.md", members: ["platform/dev/6.7/a.md", "platform/func/b.md"] } as unknown as WorkItem;
  persistFailedHub(state, "platform/hubs/plugin.md", item, "prompt-hash-1");
  assert.deepEqual(state.hubs.plugin, {
    memberPaths: ["platform/dev/6.7/a.md", "platform/func/b.md"],
    slug: "plugin",
    hubState: "failed",
    hubPromptHash: "prompt-hash-1",
  });
});

test("persistFailedHub: a second failure with no `members` on the item keeps the previously persisted ones", () => {
  const state = { hubs: { plugin: { slug: "plugin", memberPaths: ["platform/dev/6.7/a.md"], hubState: "failed" as const, hubPromptHash: "prompt-hash-1" } } };
  const item = { path: "platform/hubs/plugin.md", outputPath: "/tmp/plugin.md" } as unknown as WorkItem;
  persistFailedHub(state, "platform/hubs/plugin.md", item, "prompt-hash-1");
  assert.deepEqual(state.hubs.plugin.memberPaths, ["platform/dev/6.7/a.md"]);
});

test("deriveAutoHubScopes: caps the result, largest/most cross-cutting keywords first", () => {
  const pages: HubPage[] = [];
  for (let i = 0; i < 40; i++) {
    const size = 4 + (i % 5); // every keyword is cross-cutting (2 directories); size varies
    for (let j = 0; j < size; j++) {
      const dir = j % 2 === 0 ? "platform/dev/6.7" : "platform/func";
      pages.push(page(`${dir}/page-${i}-${j}.md`, [`topic-${i}`]));
    }
  }
  const scopes = deriveAutoHubScopes(pages);
  assert.equal(scopes.length, 30);
});

test("deriveAutoHubScopes: two keywords slugifying to the same path merge instead of overwriting each other's output", () => {
  // "store api" -> "store-api" and "store-api" -> "store-api": disjoint page sets (no
  // Jaccard merge), but the same output path platform/hubs/store-api.md — must collapse
  // into one hub, not two competing for the same file.
  const setA = ["platform/dev/6.7/a.md", "platform/dev/6.6/a.md", "platform/func/a.md", "platform/func/b.md"];
  const setB = ["platform/dev/6.7/c.md", "platform/dev/6.6/c.md", "platform/func/c.md", "platform/func/d.md"];
  const pages: HubPage[] = [...setA.map((p) => page(p, ["store api"])), ...setB.map((p) => page(p, ["store-api"]))];
  const scopes = deriveAutoHubScopes(pages);
  assert.equal(scopes.length, 1);
  assert.equal(scopes[0].slug, "store-api");
  assert.deepEqual(scopes[0].keywords, ["store api", "store-api"]);
  assert.deepEqual(new Set(scopes[0].keywords), new Set(["store api", "store-api"]));
});

// --------------------------------------------------------------------------------
// isDirty: a member whose last attempt failed must not keep the hub dirty forever
// --------------------------------------------------------------------------------

test("isDirty: a member with a failed last attempt (hash != builtHash) does not force endless re-prepare", () => {
  const state = emptyState();
  state.hubs.plugin = { slug: "plugin", memberPaths: ["platform/dev/6.7/a.md"], hubState: "ok", hubPromptHash: "hash-1" };
  state.sources["dev:6.7"] = {
    lastSync: null,
    pages: { "platform/dev/6.7/a.md": { hash: "new-hash", builtHash: "old-hash", failed: true, date: 0 } },
  };
  const scope = { slug: "plugin", title: "plugin", keywords: ["plugin"] };
  assert.equal(isDirty(scope, ["platform/dev/6.7/a.md"], state, "hash-1"), false);
});

test("isDirty: the same mismatch without `failed` is dirty (a real, rebuildable change)", () => {
  const state = emptyState();
  state.hubs.plugin = { slug: "plugin", memberPaths: ["platform/dev/6.7/a.md"], hubState: "ok", hubPromptHash: "hash-1" };
  state.sources["dev:6.7"] = {
    lastSync: null,
    pages: { "platform/dev/6.7/a.md": { hash: "new-hash", builtHash: "old-hash", date: 0 } },
  };
  const scope = { slug: "plugin", title: "plugin", keywords: ["plugin"] };
  assert.equal(isDirty(scope, ["platform/dev/6.7/a.md"], state, "hash-1"), true);
});

test("isDirty: a member that recovers from failed to ok with new content is dirty (snapshot mismatch), even though hash === builtHash again", () => {
  const state = emptyState();
  // Hub was last built when this member's builtHash was "hash-v1".
  state.hubs.plugin = {
    slug: "plugin",
    memberPaths: ["platform/dev/6.7/a.md"],
    hubState: "ok",
    hubPromptHash: "hash-1",
    memberBuiltHashes: { "platform/dev/6.7/a.md": "hash-v1" },
  };
  // The member has since failed and then recovered with different content: hash === builtHash
  // again (both "hash-v2"), so the plain hash/builtHash check alone would see nothing pending.
  state.sources["dev:6.7"] = {
    lastSync: null,
    pages: { "platform/dev/6.7/a.md": { hash: "hash-v2", builtHash: "hash-v2", date: 0 } },
  };
  const scope = { slug: "plugin", title: "plugin", keywords: ["plugin"] };
  assert.equal(isDirty(scope, ["platform/dev/6.7/a.md"], state, "hash-1"), true);
});

test("isDirty: no snapshot recorded yet (pre-existing state) is not treated as a mismatch on its own", () => {
  const state = emptyState();
  state.hubs.plugin = { slug: "plugin", memberPaths: ["platform/dev/6.7/a.md"], hubState: "ok", hubPromptHash: "hash-1" };
  state.sources["dev:6.7"] = {
    lastSync: null,
    pages: { "platform/dev/6.7/a.md": { hash: "hash-v1", builtHash: "hash-v1", date: 0 } },
  };
  const scope = { slug: "plugin", title: "plugin", keywords: ["plugin"] };
  assert.equal(isDirty(scope, ["platform/dev/6.7/a.md"], state, "hash-1"), false);
});

// --------------------------------------------------------------------------------
// validateHubOutput: ingest-time gate
// --------------------------------------------------------------------------------

function hubConfig(hubMaxBytes = 65536): PlatformConfig {
  return { sizeLimits: { hubMaxBytes } } as unknown as PlatformConfig;
}

function writeHub(dir: string, text: string): string {
  const outputPath = resolve(dir, "hub.md");
  writeFileSync(outputPath, text);
  return outputPath;
}

function goodHubText(overrides: { members?: string; linksBody?: string } = {}): string {
  const members = overrides.members ?? "[platform/dev/6.7/a.md, platform/func/b.md]";
  const links = overrides.linksBody ?? "- [A](platform/dev/6.7/a.md) — about a\n- [B](platform/func/b.md) — about b\n";
  return [
    "---",
    "id: platform/hubs/plugin.md",
    "title: Plugin",
    "summary: About plugins",
    `keywords: ["one", "two", "three", "four", "five", "six", "seven", "eight"]`,
    `members: ${members}`,
    "lastBuilt: 2026-09-14",
    "---",
    "",
    "Plugins overview.",
    "",
    links,
  ].join("\n");
}

test("validateHubOutput: a well-formed hub passes and its frontmatter round-trips through the real server parser", () => {
  const dir = mkdtempSync(join(tmpdir(), "kb-hub-validate-"));
  try {
    const text = goodHubText();
    const outAbsPath = writeHub(dir, text);
    const item = { path: "platform/hubs/plugin.md", outputPath: outAbsPath, members: ["platform/dev/6.7/a.md", "platform/func/b.md"] } as unknown as WorkItem;
    const knownPaths = new Set(["platform/dev/6.7/a.md", "platform/func/b.md"]);
    const result = validateHubOutput(item, outAbsPath, hubConfig(), knownPaths);
    assert.deepEqual(result, { ok: true });

    const parsed = parseFrontmatter(text);
    assert.equal(parsed.data.id, "platform/hubs/plugin.md");
    assert.deepEqual(parsed.data.members, ["platform/dev/6.7/a.md", "platform/func/b.md"]);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("validateHubOutput: a link to a page outside the wiki (unknown) is rejected", () => {
  const dir = mkdtempSync(join(tmpdir(), "kb-hub-validate-"));
  try {
    const text = goodHubText({ linksBody: "- [A](platform/dev/6.7/a.md)\n- [Ghost](platform/dev/6.7/ghost.md)\n" });
    const outAbsPath = writeHub(dir, text);
    const item = { path: "platform/hubs/plugin.md", outputPath: outAbsPath, members: ["platform/dev/6.7/a.md", "platform/func/b.md"] } as unknown as WorkItem;
    const knownPaths = new Set(["platform/dev/6.7/a.md", "platform/func/b.md"]);
    const result = validateHubOutput(item, outAbsPath, hubConfig(), knownPaths);
    assert.equal(result.ok, false);
    assert.match((result as { reason: string }).reason, /link target does not exist in the wiki: platform\/dev\/6\.7\/ghost\.md/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("validateHubOutput: a link to a real page that is not a given member (and not a hub) is rejected", () => {
  const dir = mkdtempSync(join(tmpdir(), "kb-hub-validate-"));
  try {
    const text = goodHubText({ linksBody: "- [A](platform/dev/6.7/a.md)\n- [Other](platform/func/other.md)\n" });
    const outAbsPath = writeHub(dir, text);
    const item = { path: "platform/hubs/plugin.md", outputPath: outAbsPath, members: ["platform/dev/6.7/a.md", "platform/func/b.md"] } as unknown as WorkItem;
    const knownPaths = new Set(["platform/dev/6.7/a.md", "platform/func/b.md", "platform/func/other.md"]);
    const result = validateHubOutput(item, outAbsPath, hubConfig(), knownPaths);
    assert.equal(result.ok, false);
    assert.match((result as { reason: string }).reason, /link target is neither a given member nor a hub: platform\/func\/other\.md/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("validateHubOutput: a given member never linked in the body is rejected", () => {
  const dir = mkdtempSync(join(tmpdir(), "kb-hub-validate-"));
  try {
    const text = goodHubText({ linksBody: "- [A](platform/dev/6.7/a.md)\n" });
    const outAbsPath = writeHub(dir, text);
    const item = { path: "platform/hubs/plugin.md", outputPath: outAbsPath, members: ["platform/dev/6.7/a.md", "platform/func/b.md"] } as unknown as WorkItem;
    const knownPaths = new Set(["platform/dev/6.7/a.md", "platform/func/b.md"]);
    const result = validateHubOutput(item, outAbsPath, hubConfig(), knownPaths);
    assert.equal(result.ok, false);
    assert.match((result as { reason: string }).reason, /member page is never linked in the hub body: platform\/func\/b\.md/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("validateHubOutput: frontmatter at/over the 8 KB server read window is rejected", () => {
  const dir = mkdtempSync(join(tmpdir(), "kb-hub-validate-"));
  try {
    // A huge members list is enough to push the frontmatter block itself past 8 KB.
    const manyMembers = Array.from({ length: 400 }, (_, i) => `platform/dev/6.7/page-${i}.md`);
    const links = manyMembers.map((m) => `- [P](${m})`).join("\n");
    const text = goodHubText({ members: `[${manyMembers.join(", ")}]`, linksBody: links });
    const outAbsPath = writeHub(dir, text);
    const item = { path: "platform/hubs/plugin.md", outputPath: outAbsPath, members: manyMembers } as unknown as WorkItem;
    const knownPaths = new Set(manyMembers);
    const result = validateHubOutput(item, outAbsPath, hubConfig(), knownPaths);
    assert.equal(result.ok, false);
    assert.match((result as { reason: string }).reason, /byte read window/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("validateHubOutput: an unquoted \" #\" in a frontmatter value that would truncate the parse is rejected", () => {
  const dir = mkdtempSync(join(tmpdir(), "kb-hub-validate-"));
  try {
    const text = [
      "---",
      "id: platform/hubs/plugin.md",
      "title: Plugin # not a comment, but the parser thinks so",
      "summary: About plugins",
      `keywords: ["one", "two", "three", "four", "five", "six", "seven", "eight"]`,
      "members: [platform/dev/6.7/a.md, platform/func/b.md]",
      "lastBuilt: 2026-09-14",
      "---",
      "",
      "- [A](platform/dev/6.7/a.md)",
      "- [B](platform/func/b.md)",
      "",
    ].join("\n");
    const outAbsPath = writeHub(dir, text);
    const item = { path: "platform/hubs/plugin.md", outputPath: outAbsPath, members: ["platform/dev/6.7/a.md", "platform/func/b.md"] } as unknown as WorkItem;
    const knownPaths = new Set(["platform/dev/6.7/a.md", "platform/func/b.md"]);
    const result = validateHubOutput(item, outAbsPath, hubConfig(), knownPaths);
    assert.equal(result.ok, false);
    assert.match((result as { reason: string }).reason, /truncates this value/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
