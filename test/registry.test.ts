import { test } from "node:test";
import assert from "node:assert/strict";
import { appendFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, utimesSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { homedir, tmpdir } from "node:os";
import {
  GrepPool,
  Registry,
  discoverLayers,
  loadKbConfig,
  resolveConfigPath,
  resolveCorpus,
  resolveWikiRoot,
  validateWikiRoot,
} from "../src/registry.js";
import { copyFixture, docsFixtureRoot, fixtureRoot } from "./helpers.js";

const PLUGIN = "platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md";
const registry = Registry.createDefault(fixtureRoot);

// ------------------------------------------------------------ discovery ----

test("layer discovery: platform + unknown extra layer served, project/marketplace planned", () => {
  assert.deepEqual(discoverLayers(fixtureRoot), ["extra", "platform"]);
  const st = Object.fromEntries(registry.statuses().map((s) => [s.layer, s]));
  assert.equal(st.platform.status, "implemented");
  assert.equal(st.platform.synonyms, true);
  assert.equal(st.platform.integrity, "unverified");
  assert.equal(st.platform.contract, 1);
  assert.deepEqual(st.platform.versions, ["6.6", "6.7"]);
  assert.equal(st.platform.pageCount, 14);
  assert.equal(st.platform.pages, undefined);
  assert.equal(st.extra.status, "implemented");
  assert.ok(st.extra.notices.includes("manifest.json missing"));
  assert.equal(st.project.status, "planned");
  assert.equal(st.marketplace.status, "planned");
  for (const s of registry.statuses()) {
    const text = JSON.stringify(s);
    assert.ok(!text.includes(fixtureRoot), "no absolute path in kb_status");
    assert.ok(!text.includes(process.version), "no node version in kb_status");
  }
});

test("planned layers: every call answers empty plus a planned notice", async () => {
  const l = registry.list({ path: "project/anything" });
  assert.deepEqual(l.entries, []);
  assert.match(l.notices[0], /planned/);
  const g = await registry.grep({ pattern: "x", path: "marketplace" });
  assert.deepEqual(g.matches, []);
  assert.match(g.notices[0], /planned/);
  const r = await registry.read({ path: "project/README.md" });
  assert.equal(r.raw, "");
  assert.match(r.notices[0], /planned/);
});

test("cross-layer routing: first segment picks the layer; unknown layer → notice, never a throw", async () => {
  assert.equal((await registry.grep({ pattern: "zebra", path: "extra" })).matches!.length, 1);
  assert.equal((await registry.grep({ pattern: "zebra", path: "platform" })).matches!.length, 0);
  const unknown = await registry.grep({ pattern: "zebra", path: "nolayer/x" });
  assert.deepEqual(unknown.matches, []);
  assert.match(unknown.notices[0], /no such path/);
  const noRoute = await registry.read({ path: "nolayer/x.md" });
  assert.match(noRoute.notices[0], /no such path/);
  assert.equal(noRoute.citation, "");
  assert.match(registry.list({ path: "nolayer" }).notices[0], /no such path/);
});

// -------------------------------------------------------------- listing ----

test("list: root lists layers + package files; layer root dirs first sorted; titles from frontmatter", () => {
  const root = registry.list({ path: "" });
  assert.deepEqual(
    root.entries.map((e) => e.name),
    ["extra", "guidelines", "marketplace", "platform", "project", "README.md", "composer.json"],
  );
  assert.match(root.index ?? "", /^# Shopware LLM wiki/);
  const p = registry.list({ path: "platform" });
  assert.deepEqual(
    p.entries.map((e) => [e.name, e.type]),
    [
      ["dev", "dir"],
      ["func", "dir"],
      ["guidelines", "dir"],
      ["hubs", "dir"],
      ["index.md", "file"],
      ["manifest.json", "file"],
      ["synonyms.md", "file"],
    ],
  );
  assert.equal(p.entries.find((e) => e.name === "index.md")!.title, "Platform layer");
  assert.equal(p.entries.find((e) => e.name === "synonyms.md")!.title, undefined);
  assert.match(p.index ?? "", /^---\nid: platform\/index\.md/);
  assert.equal(p.truncated, false);
});

test("list: depth, glob (recursive, case-insensitive, negation, caseSensitive), unknown path, file path", () => {
  const d1 = registry.list({ path: "platform/dev/6.7" });
  assert.deepEqual(d1.entries.map((e) => e.name), ["guides", "index.md"]);
  const d2 = registry.list({ path: "platform/dev/6.7", depth: 2 });
  assert.deepEqual(d2.entries.map((e) => e.name), ["guides", "plugins", "_index.md", "index.md"]);
  const d5 = registry.list({ path: "platform/dev/6.7", depth: 5 });
  assert.ok(d5.entries.some((e) => e.name === "plugin-base-guide.md"));
  const g = registry.list({ path: "platform/dev/6.7", glob: "**/*CART*" });
  assert.deepEqual(g.entries.map((e) => e.name), ["cart", "add-cart-discounts.md"]);
  assert.deepEqual(registry.list({ path: "platform/dev/6.7", glob: "**/*CART*", caseSensitive: true }).entries, []);
  const neg = registry.list({ path: "platform/hubs", glob: "!index.md" });
  assert.deepEqual(neg.entries.map((e) => e.name), ["plugins.md", "store-api.md"]);
  const full = registry.list({ path: "platform", glob: "platform/func/**/*.md" });
  assert.ok(full.entries.some((e) => e.name === "rules.md"), "glob also matches the wiki-root-relative path");
  const missing = registry.list({ path: "platform/dev/6.5" });
  assert.deepEqual(missing.entries, []);
  assert.match(missing.notices[0], /no such path/);
  assert.deepEqual(registry.list({ path: "platform/synonyms.md" }).entries.map((e) => e.name), ["synonyms.md"]);
});

// ----------------------------------------------------------------- grep ----

test("grep: literal default is case-insensitive, ordered by path then line, includes index.md + frontmatter", async () => {
  const r = await registry.grep({ pattern: "promotionentity", path: "platform/dev/6.7" });
  assert.equal(r.truncated, false);
  assert.deepEqual(
    r.matches!.map((m) => [m.path, m.line]),
    [
      ["platform/dev/6.7/guides/plugins/plugins/checkout/cart/add-cart-discounts.md", 9],
      ["platform/dev/6.7/guides/plugins/plugins/checkout/cart/add-cart-discounts.md", 20],
      ["platform/dev/6.7/index.md", 2],
    ],
  );
  assert.deepEqual(r.matches![0].before, []);
  assert.deepEqual(r.matches![0].after, []);
});

test("grep: path scoping — dev/6.6 never returns a dev/6.7 file; a single .md file can be the path", async () => {
  const r = await registry.grep({ pattern: "PromotionEntity", path: "platform/dev/6.6" });
  assert.ok(r.matches!.length > 0);
  assert.ok(r.matches!.every((m) => m.path.startsWith("platform/dev/6.6/")));
  const syn = await registry.grep({ pattern: "voucher", path: "platform/synonyms.md" });
  assert.deepEqual(syn.matches!.map((m) => m.line), [1]);
  const notMd = await registry.grep({ pattern: "contract", path: "platform/manifest.json" });
  assert.deepEqual(notMd.matches, []);
});

test("grep: caseSensitive, regex, wholeWord, literal metacharacters", async () => {
  assert.equal((await registry.grep({ pattern: "promotionentity", path: "platform/dev/6.7", caseSensitive: true })).matches!.length, 0);
  assert.equal((await registry.grep({ pattern: "PromotionEntity", path: "platform/dev/6.7", caseSensitive: true })).matches!.length, 3);
  const re = await registry.grep({ pattern: "^## (What|Key)", path: "platform/dev/6.7", regex: true });
  assert.ok(re.matches!.length >= 4);
  assert.ok(re.matches!.every((m) => /^## (What|Key)/.test(m.text)));
  const lit = await registry.grep({ pattern: "^## (What|Key)", path: "platform/dev/6.7" });
  assert.deepEqual(lit.matches, []);
  const dot = await registry.grep({ pattern: "composer.json", path: "platform/dev/6.7" });
  assert.ok(dot.matches!.every((m) => m.text.includes("composer.json")));
  const ww = await registry.grep({ pattern: "cart", path: "platform/dev/6.7", wholeWord: true, mode: "count" });
  assert.ok(ww.counts!.every((c) => c.count > 0));
  const wwNone = await registry.grep({ pattern: "car", path: "platform/dev/6.7", wholeWord: true });
  assert.deepEqual(wwNone.matches, []);
});

test("grep: context / before / after", async () => {
  const c = await registry.grep({ pattern: "PromotionEntity` is not needed", path: PLUGIN.replace("plugin-base-guide.md", "checkout/cart/add-cart-discounts.md"), context: 2 });
  assert.equal(c.matches!.length, 1);
  assert.equal(c.matches![0].before.length, 2);
  assert.equal(c.matches![0].after.length, 2);
  const ba = await registry.grep({ pattern: "not needed", path: "platform/dev/6.7", context: 2, before: 0, after: 1 });
  assert.deepEqual(ba.matches![0].before, []);
  assert.equal(ba.matches![0].after.length, 1);
});

test("grep: modes files and count; maxMatches caps rows in every mode and sets truncated", async () => {
  const files = await registry.grep({ pattern: "PromotionEntity", path: "platform", mode: "files" });
  assert.deepEqual(files.files, [
    "platform/dev/6.6/guides/plugins/plugins/checkout/cart/add-cart-discounts.md",
    "platform/dev/6.6/index.md",
    "platform/dev/6.7/guides/plugins/plugins/checkout/cart/add-cart-discounts.md",
    "platform/dev/6.7/index.md",
    "platform/synonyms.md",
  ]);
  assert.equal(files.truncated, false);
  const count = await registry.grep({ pattern: "PromotionEntity", path: "platform", mode: "count" });
  assert.deepEqual(count.counts![0], { path: "platform/dev/6.6/guides/plugins/plugins/checkout/cart/add-cart-discounts.md", count: 2 });
  assert.equal(count.counts!.length, 5);
  const capped = await registry.grep({ pattern: "PromotionEntity", path: "platform", mode: "files", maxMatches: 2 });
  assert.equal(capped.files!.length, 2);
  assert.equal(capped.truncated, true);
  assert.ok(capped.notices.length > 0);
  const c2 = await registry.grep({ pattern: "PromotionEntity", path: "platform", maxMatches: 3 });
  assert.equal(c2.matches!.length, 3);
  assert.equal(c2.truncated, true);
  const exact = await registry.grep({ pattern: "PromotionEntity", path: "platform", maxMatches: 7 });
  assert.equal(exact.matches!.length, 7);
  assert.equal(exact.truncated, false);
});

test("grep: glob filter relative to path and against the full path", async () => {
  const g = await registry.grep({ pattern: "PromotionEntity", path: "platform/dev/6.7", mode: "files", glob: "guides/**" });
  assert.deepEqual(g.files, ["platform/dev/6.7/guides/plugins/plugins/checkout/cart/add-cart-discounts.md"]);
  const ex = await registry.grep({ pattern: "PromotionEntity", path: "platform/dev/6.7", mode: "files", glob: "!index.md" });
  assert.deepEqual(ex.files, ["platform/dev/6.7/guides/plugins/plugins/checkout/cart/add-cart-discounts.md"]);
});

test("grep: line numbers equal read_doc offsets (shell parity)", async () => {
  const g = await registry.grep({ pattern: "Lifecycle hooks", path: PLUGIN });
  const line = g.matches![0].line;
  const fileLines = readFileSync(join(fixtureRoot, PLUGIN), "utf8").split("\n");
  assert.equal(fileLines[line - 1], "### Lifecycle hooks");
  const r = await registry.read({ path: PLUGIN, offset: line, limit: 1 });
  assert.equal(r.raw, "### Lifecycle hooks\n");
  assert.equal(r.lineFrom, line);
  assert.equal(r.lineTo, line);
});

// ----------------------------------------------------------------- read ----

test("read: whole page, frontmatter as stored (shared article with sourceUrls), raw identical to disk", async () => {
  const r = await registry.read({ path: PLUGIN });
  assert.equal(r.raw, readFileSync(join(fixtureRoot, PLUGIN), "utf8"));
  assert.equal(r.lineFrom, 1);
  assert.equal(r.lineTo, r.totalLines);
  assert.equal(r.citation, `${PLUGIN}:1-${r.totalLines}`);
  assert.deepEqual(r.frontmatter.versions, ["6.7", "6.6"]);
  assert.equal((r.frontmatter.sourceUrls as any)["6.6"], "https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/plugin-base-guide.html");
  assert.deepEqual(r.notices, []);
});

test("read: offset/limit, frontmatter included when in range, beyond-end offset", async () => {
  const r = await registry.read({ path: PLUGIN, offset: 1, limit: 3 });
  assert.equal(r.raw, `---\nid: ${PLUGIN}\ntitle: Plugin base guide\n`);
  assert.deepEqual([r.lineFrom, r.lineTo], [1, 3]);
  assert.equal(r.citation, `${PLUGIN}:1-3`, "citation reflects the returned window, not a full-page guess");
  const tail = await registry.read({ path: PLUGIN, offset: 57 });
  assert.equal(tail.lineTo, tail.totalLines);
  assert.equal(tail.citation, `${PLUGIN}:57-${tail.totalLines}`);
  const beyond = await registry.read({ path: PLUGIN, offset: 9999 });
  assert.equal(beyond.raw, "");
  assert.match(beyond.notices[0], /beyond/);
  assert.equal(beyond.citation, "");
});

test("read: section slicing — H2 block, H3 → enclosing H2, unknown anchor → full page + notice", async () => {
  const h2 = await registry.read({ path: PLUGIN, section: "key-steps-config" });
  assert.match(h2.raw, /^## Key steps \/ config\n/);
  assert.ok(h2.raw.includes("### Lifecycle hooks"));
  assert.ok(!h2.raw.includes("## Essential identifiers"));
  assert.deepEqual(h2.section, { requested: "key-steps-config", resolved: "key-steps-config", lineFrom: h2.lineFrom, lineTo: h2.lineTo });
  assert.ok(h2.raw.includes("class SwagBasicExample extends Plugin"), "code block returned verbatim");
  const h3 = await registry.read({ path: PLUGIN, section: "lifecycle-hooks" });
  assert.equal(h3.section!.resolved, "key-steps-config");
  assert.equal(h3.raw, h2.raw);
  const gotchas = await registry.read({ path: PLUGIN, section: "gotchas" });
  assert.equal(gotchas.raw, "## Gotchas\n\nThe plugin name must match the composer `extra.shopware-plugin-class` entry.\n");
  const unknown = await registry.read({ path: PLUGIN, section: "does-not-exist" });
  assert.equal(unknown.section, undefined);
  assert.equal(unknown.lineTo, unknown.totalLines);
  assert.match(unknown.notices[0], /unknown section/);
});

test("body cache freshness: an edit on disk after the first read is served on the next read, not the pre-edit body", async () => {
  const copy = copyFixture();
  const r = Registry.createDefault(copy);
  const abs = join(copy, PLUGIN);
  const before = await r.read({ path: PLUGIN });
  assert.ok(!before.raw.includes("Appended freshness-check line."));

  writeFileSync(abs, readFileSync(abs, "utf8") + "Appended freshness-check line.\n");
  // Force a distinguishable mtime in case the write above landed within the same
  // millisecond as the read that populated the cache.
  const future = new Date(Date.now() + 2000);
  utimesSync(abs, future, future);

  const after = await r.read({ path: PLUGIN });
  assert.equal(after.totalLines, before.totalLines + 1, "a stale cached body would still report the pre-edit line count");
  assert.match(after.raw, /Appended freshness-check line\.\n$/);
  assert.equal(after.citation, `${PLUGIN}:1-${after.totalLines}`);
});

test("read: func revision pair, merchant revision frontmatter, manifest.json, package root files, dirs", async () => {
  const cur = await registry.read({ path: "platform/func/settings/rules.md" });
  assert.deepEqual(cur.frontmatter.revision, { range: ">=6.7.0.0", swMin: "6.7.0.0", swMax: null, current: true });
  const old = await registry.read({ path: "platform/func/settings/rules@6.6.10.0.md" });
  assert.equal((old.frontmatter.revision as any).current, false);
  const manifest = await registry.read({ path: "platform/manifest.json" });
  assert.equal(JSON.parse(manifest.raw).contract, 1);
  assert.deepEqual(manifest.frontmatter, {});
  const readme = await registry.read({ path: "README.md" });
  assert.match(readme.raw, /^# Shopware LLM wiki/);
  const composer = await registry.read({ path: "composer.json", offset: 1, limit: 1 });
  assert.equal(composer.lineTo, 1);
  const dir = await registry.read({ path: "platform/dev" });
  assert.match(dir.notices[0], /not a file/);
  const missing = await registry.read({ path: "platform/dev/6.7/nope.md" });
  assert.match(missing.notices[0], /no such path/);
  assert.equal(missing.raw, "");
  assert.equal(missing.citation, "");
});

// ------------------------------------------------------------- decoupled ----

test("WIKI_ROOT pointing at a copied fixture gives identical results", async () => {
  const copy = copyFixture();
  const other = Registry.createDefault(copy);
  const strip = (s: any[]) => s.map(({ notices, ...rest }) => rest);
  assert.deepEqual(strip(other.statuses()), strip(registry.statuses()));
  assert.deepEqual(other.list({ path: "platform", depth: 3 }), registry.list({ path: "platform", depth: 3 }));
  assert.deepEqual(await other.grep({ pattern: "cart", path: "platform", context: 1 }), await registry.grep({ pattern: "cart", path: "platform", context: 1 }));
  assert.deepEqual(await other.read({ path: PLUGIN, section: "gotchas" }), await registry.read({ path: PLUGIN, section: "gotchas" }));
});

test("resolveWikiRoot: --wiki-root > WIKI_ROOT > bundle default; relative values resolve against the bundle dir", () => {
  const bundle = "/srv/app/dist";
  assert.equal(resolveWikiRoot([], {}, bundle), "/srv/app/wiki");
  assert.equal(resolveWikiRoot([], { WIKI_ROOT: "../../vendor/acme/wiki" }, bundle), "/srv/vendor/acme/wiki");
  assert.equal(resolveWikiRoot([], { WIKI_ROOT: "/abs/wiki" }, bundle), "/abs/wiki");
  assert.equal(resolveWikiRoot(["--wiki-root", "x"], { WIKI_ROOT: "/abs/wiki" }, bundle), "/srv/app/dist/x");
  assert.equal(resolveWikiRoot(["--wiki-root=/y"], {}, bundle), "/y");
});

test("B5 root validation: bad roots are refused with a one-line reason", () => {
  const bundle = join(fixtureRoot, "..", "..", "dist");
  assert.equal(validateWikiRoot(fixtureRoot, bundle), fixtureRoot);
  assert.throws(() => validateWikiRoot(join(fixtureRoot, "missing"), bundle), /does not exist/);
  assert.throws(() => validateWikiRoot(join(fixtureRoot, "README.md"), bundle), /not a directory/);
  assert.throws(() => validateWikiRoot("/", bundle), /must not be/);
  assert.throws(() => validateWikiRoot(homedir(), bundle), /must not be/);
  assert.throws(() => validateWikiRoot(fixtureRoot, join(fixtureRoot, "platform", "dist")), /parent of the server bundle/);
  for (const dir of ["node_modules", "ingest", "src"]) {
    const copy = copyFixture();
    mkdirSync(join(copy, "platform", "dev", dir), { recursive: true });
    assert.throws(() => validateWikiRoot(copy, bundle), /forbidden directory/, dir);
  }
  const empty = copyFixture();
  writeFileSync(join(empty, "platform", "index.md"), ""); // still exists → fine
  const noLayer = copyFixture();
  for (const l of ["platform", "extra"]) writeFileSync(join(noLayer, l, "index.md.bak"), "");
  for (const l of ["platform", "extra"]) rmSync(join(noLayer, l, "index.md"));
  assert.throws(() => validateWikiRoot(noLayer, bundle), /no <layer>\/index\.md/);
});

// -------------------------------------------------------------- security ----

test("symlinks, dot-entries and disallowed extensions are invisible to list/grep/read", async () => {
  const copy = copyFixture();
  const outside = join(copy, "..", `kb-outside-${Date.now()}.md`);
  writeFileSync(outside, "SECRET-OUTSIDE\n");
  symlinkSync(outside, join(copy, "platform", "link.md"));
  symlinkSync(join(copy, "platform", "dev"), join(copy, "platform", "linkdir"));
  writeFileSync(join(copy, "platform", ".hidden.md"), "SECRET-HIDDEN\n");
  mkdirSync(join(copy, "platform", ".dir"));
  writeFileSync(join(copy, "platform", ".dir", "x.md"), "SECRET-DOTDIR\n");
  writeFileSync(join(copy, "platform", "notes.txt"), "SECRET-TXT\n");
  writeFileSync(join(copy, "platform", "script.sh"), "SECRET-SH\n");
  writeFileSync(join(copy, "platform", "other.json"), "{}\n");
  const r = Registry.createDefault(copy);
  const names = r.list({ path: "platform" }).entries.map((e) => e.name);
  for (const n of ["link.md", "linkdir", ".hidden.md", ".dir", "notes.txt", "script.sh", "other.json"]) assert.ok(!names.includes(n), n);
  const g = await r.grep({ pattern: "SECRET", path: "platform" });
  assert.deepEqual(g.matches, []);
  for (const p of ["platform/link.md", "platform/linkdir/6.7/index.md", "platform/.hidden.md", "platform/.dir/x.md", "platform/notes.txt", "platform/other.json"]) {
    const rd = await r.read({ path: p });
    assert.equal(rd.raw, "", p);
    assert.ok(rd.notices.length > 0, p);
  }
  const st = r.statuses().find((s) => s.layer === "platform")!;
  assert.ok(st.notices.some((n) => /symlink/.test(n)), "symlinks reported once in kb_status");
});

test("dot-directories are never refused nor served: root .git and a nested platform/dev/.git validate fine and stay invisible", async () => {
  const copy = copyFixture();
  mkdirSync(join(copy, ".git"));
  writeFileSync(join(copy, ".git", "HEAD"), "ref: refs/heads/main\n");
  mkdirSync(join(copy, "platform", "dev", ".git"), { recursive: true });
  writeFileSync(join(copy, "platform", "dev", ".git", "x.md"), "SECRET-GIT\n");
  const real = validateWikiRoot(copy, join(fixtureRoot, "..", "..", "dist"));
  assert.equal(real, copy);
  const r = Registry.createDefault(real);
  const g = await r.grep({ pattern: "SECRET-GIT", path: "platform" });
  assert.deepEqual(g.matches, []);
  const rd = await r.read({ path: "platform/dev/.git/x.md" });
  assert.equal(rd.raw, "");
  assert.match(rd.notices[0], /no such path/);
  assert.ok(!r.list({ path: "platform/dev" }).entries.map((e) => e.name).includes(".git"));
});

// -------------------------------------------------------------- corpus config --

function writeTempConfig(obj: unknown): string {
  const dir = mkdtempSync(join(tmpdir(), "kb-config-"));
  const p = join(dir, "kb.config.json");
  writeFileSync(p, JSON.stringify(obj));
  return p;
}

test("kb.config.json: parses a valid file, rejects malformed shapes", () => {
  const good = writeTempConfig({
    corpus: "wiki",
    corpora: { wiki: { root: fixtureRoot, developer: "platform/dev/6.7", merchant: "platform/func", entryPoints: ["platform/index.md"] } },
  });
  assert.deepEqual(Object.keys(loadKbConfig(good).corpora), ["wiki"]);
  assert.throws(() => loadKbConfig(writeTempConfig({ corpora: {} })), /"corpus" must be a non-empty string/);
  assert.throws(() => loadKbConfig(writeTempConfig({ corpus: "wiki" })), /"corpora" must be an object/);
  assert.throws(() => loadKbConfig(writeTempConfig({ corpus: "wiki", corpora: { wiki: { root: fixtureRoot, merchant: "x", entryPoints: [] } } })), /field "developer"/);
  assert.throws(
    () => loadKbConfig(writeTempConfig({ corpus: "wiki", corpora: { wiki: { root: fixtureRoot, developer: "d", merchant: "m", entryPoints: [1] } } })),
    /field "entryPoints"/,
  );
  assert.throws(() => loadKbConfig(writeTempConfig({ corpus: "missing", corpora: { wiki: { root: fixtureRoot, developer: "d", merchant: "m", entryPoints: [] } } })), /not a key of "corpora"/);
  const bundle = join(fixtureRoot, "..", "..", "dist");
  const missing = mkdtempSync(join(tmpdir(), "kb-nofile-"));
  assert.equal(resolveConfigPath([], {}, missing), join(missing, "..", "kb.config.json"));
});

test("resolveCorpus: --wiki-root beats KB_CORPUS; env beats config default; unknown/missing corpus is a clear error", () => {
  const bundle = join(fixtureRoot, "..", "..", "dist");
  const configPath = writeTempConfig({
    corpus: "wiki",
    corpora: {
      wiki: { root: fixtureRoot, developer: "platform/dev/6.7", merchant: "platform/func", entryPoints: ["platform/index.md"] },
      docs: { root: docsFixtureRoot, developer: "developer", merchant: "merchant/content/en/shopware-6", entryPoints: ["developer/index.md", "merchant/index.md"] },
    },
  });

  const byArgRoot = resolveCorpus(["--wiki-root", fixtureRoot], { KB_CORPUS: "docs", KB_CONFIG: configPath }, bundle);
  assert.equal(byArgRoot.root, fixtureRoot);
  assert.equal(byArgRoot.source, "arg");
  assert.equal(byArgRoot.corpus?.name, "wiki", "matched to the config entry with the same realpath");

  const byEnvCorpus = resolveCorpus([], { KB_CORPUS: "docs", KB_CONFIG: configPath }, bundle);
  assert.equal(byEnvCorpus.root, docsFixtureRoot);
  assert.equal(byEnvCorpus.corpus?.name, "docs");
  assert.equal(byEnvCorpus.source, "env");

  const byConfigDefault = resolveCorpus([], { KB_CONFIG: configPath }, bundle);
  assert.equal(byConfigDefault.corpus?.name, "wiki");
  assert.equal(byConfigDefault.source, "config");

  assert.throws(() => resolveCorpus([], { KB_CORPUS: "bogus", KB_CONFIG: configPath }, bundle), /unknown corpus "bogus"/);

  const noConfigDir = mkdtempSync(join(tmpdir(), "kb-empty-"));
  assert.throws(
    () => resolveCorpus([], { KB_CORPUS: "docs", KB_CONFIG: join(noConfigDir, "missing.json") }, bundle),
    /no kb\.config\.json found/,
  );

  const noOverride = resolveCorpus([], { KB_CONFIG: join(noConfigDir, "missing.json") }, bundle);
  assert.equal(noOverride.corpus, null);
  assert.equal(noOverride.source, "default");
  assert.equal(noOverride.projectEnabled, true);
});

test("resolveCorpus: projectEnabled reflects kb.config.json corpus.project (default true; docs corpus sets it false)", () => {
  const bundle = join(fixtureRoot, "..", "..", "dist");
  const configPath = writeTempConfig({
    corpus: "wiki",
    corpora: {
      wiki: { root: fixtureRoot, developer: "platform/dev/6.7", merchant: "platform/func", entryPoints: [] },
      docs: { root: docsFixtureRoot, developer: "developer", merchant: "merchant/content/en/shopware-6", entryPoints: [], project: false },
    },
  });
  assert.equal(resolveCorpus([], { KB_CONFIG: configPath }, bundle).projectEnabled, true);
  assert.equal(resolveCorpus([], { KB_CORPUS: "docs", KB_CONFIG: configPath }, bundle).projectEnabled, false);
  assert.equal(resolveCorpus(["--wiki-root", docsFixtureRoot], { KB_CONFIG: configPath }, bundle).projectEnabled, false, "matched by realpath to the docs entry");
});

test("validateWikiRoot + corpus: developer/merchant must exist and contain markdown under the root", () => {
  const bundle = join(fixtureRoot, "..", "..", "dist");
  const corpus = { name: "docs", developer: "developer", merchant: "merchant/content/en/shopware-6", entryPoints: ["developer/index.md", "merchant/index.md"] };
  assert.equal(validateWikiRoot(docsFixtureRoot, bundle, undefined, corpus), docsFixtureRoot);
  assert.throws(
    () => validateWikiRoot(docsFixtureRoot, bundle, undefined, { ...corpus, developer: "nope" }),
    /corpus "docs" developer directory missing: nope/,
  );
  const emptyDirRoot = copyFixture();
  mkdirSync(join(emptyDirRoot, "platform", "empty"));
  assert.throws(
    () => validateWikiRoot(emptyDirRoot, bundle, undefined, { name: "wiki", developer: "platform/empty", merchant: "platform/func", entryPoints: [] }),
    /has no markdown files: platform\/empty/,
  );
});

test("docs-corpus fixture: layers developer+merchant, manifest.json missing notice, grep hits the deep merchant path, .git invisible", async () => {
  assert.deepEqual(discoverLayers(docsFixtureRoot), ["developer", "merchant"]);
  const r = Registry.createDefault(docsFixtureRoot);
  const st = Object.fromEntries(r.statuses().map((s) => [s.layer, s]));
  assert.equal(st.developer.status, "implemented");
  assert.ok(st.developer.notices.includes("manifest.json missing"));
  assert.equal(st.merchant.status, "implemented");
  assert.ok(st.merchant.notices.includes("manifest.json missing"));

  const g = await r.grep({ pattern: "Rule Builder", path: "merchant/content" });
  assert.equal(g.matches!.length, 1);
  assert.equal(g.matches![0].path, "merchant/content/en/shopware-6/settings/rules/v1-6-1-0.md");

  const names = r.list({ path: "developer" }).entries.map((e) => e.name);
  assert.ok(!names.includes(".git"));
  const rd = await r.read({ path: "developer/.git/HEAD" });
  assert.match(rd.notices[0], /no such path/);
});

test("oversized layer (injected small limits) → status oversized, not served", async () => {
  const r = Registry.createDefault(fixtureRoot, { limits: { maxFiles: 3, maxDirs: 2000, maxDepth: 12, maxBytes: 1 << 26 } });
  const st = r.statuses().find((s) => s.layer === "platform")!;
  assert.equal(st.status, "oversized");
  assert.match(st.notices.join(" "), /not served/);
  assert.deepEqual(r.list({ path: "platform" }).entries, []);
  assert.deepEqual((await r.grep({ pattern: "cart", path: "platform" })).matches, []);
  const deep = Registry.createDefault(fixtureRoot, { limits: { maxFiles: 20000, maxDirs: 2000, maxDepth: 3, maxBytes: 1 << 26 } });
  assert.equal(deep.statuses().find((s) => s.layer === "platform")!.status, "oversized");
});

test("KB_VERIFY integrity: ok on the fixture, mismatch after a byte change; unknown contract major → not served", async () => {
  assert.equal(Registry.createDefault(fixtureRoot, { verify: true }).statuses().find((s) => s.layer === "platform")!.integrity, "ok");
  const copy = copyFixture();
  appendFileSync(join(copy, PLUGIN), "\n");
  const st = Registry.createDefault(copy, { verify: true }).statuses().find((s) => s.layer === "platform")!;
  assert.equal(st.integrity, "mismatch");
  assert.ok(st.notices.some((n) => /mismatch/.test(n)));
  assert.equal(Registry.createDefault(copy).statuses().find((s) => s.layer === "platform")!.integrity, "unverified");

  const c2 = copyFixture();
  const mf = JSON.parse(readFileSync(join(c2, "platform", "manifest.json"), "utf8"));
  mf.contract = 2;
  mf.secret = "should not be mirrored";
  writeFileSync(join(c2, "platform", "manifest.json"), JSON.stringify(mf));
  const r2 = Registry.createDefault(c2);
  const s2 = r2.statuses().find((s) => s.layer === "platform")!;
  assert.equal(s2.status, "unsupported");
  assert.equal(s2.secret, undefined);
  assert.deepEqual(r2.list({ path: "platform" }).entries, []);
  assert.equal((await r2.read({ path: PLUGIN })).raw, "");

  const c3 = copyFixture();
  writeFileSync(join(c3, "platform", "manifest.json"), "{not json");
  const s3 = Registry.createDefault(c3).statuses().find((s) => s.layer === "platform")!;
  assert.equal(s3.status, "implemented");
  assert.ok(s3.notices.some((n) => /invalid/.test(n)));
});

// --------------------------------------------------------- manifest reload --

test("manifest.json reload: a later ingestion write is picked up on the next call, no reconnect needed", async () => {
  const copy = copyFixture();
  const manifestPath = join(copy, "platform", "manifest.json");
  const live = Registry.createDefault(copy);
  const before = live.statuses().find((s) => s.layer === "platform")!;
  assert.equal(before.pageCount, 14);
  assert.equal(before.lastBuilt, "2026-08-30");

  // simulate an ingestion run finishing after the server started: rewrite manifest.json with a newer mtime
  const mutated = JSON.parse(readFileSync(manifestPath, "utf8"));
  mutated.pages = { "platform/index.md": mutated.pages["platform/index.md"] };
  mutated.lastBuilt = "2026-09-01";
  writeFileSync(manifestPath, JSON.stringify(mutated));
  const future = new Date(Date.now() + 5000);
  utimesSync(manifestPath, future, future);

  const after = live.statuses().find((s) => s.layer === "platform")!;
  assert.equal(after.pageCount, 1, "same Registry/WikiSource instance now serves the updated manifest");
  assert.equal(after.lastBuilt, "2026-09-01");

  // a further call with no on-disk change stays cheap and stable (no re-parse, no notice churn)
  const again = live.statuses().find((s) => s.layer === "platform")!;
  assert.equal(again.pageCount, 1);
  assert.deepEqual(again.notices, after.notices);
});

test("manifest.json reload: deletion degrades to a notice, and a later re-appearance is picked up again", async () => {
  const copy = copyFixture();
  const manifestPath = join(copy, "platform", "manifest.json");
  const live = Registry.createDefault(copy);
  assert.equal(live.statuses().find((s) => s.layer === "platform")!.pageCount, 14);

  const original = readFileSync(manifestPath, "utf8");
  rmSync(manifestPath);
  const missing = live.statuses().find((s) => s.layer === "platform")!;
  assert.equal(missing.status, "implemented");
  assert.equal(missing.pageCount, undefined);
  assert.ok(missing.notices.includes("manifest.json missing"));

  writeFileSync(manifestPath, original);
  const restored = live.statuses().find((s) => s.layer === "platform")!;
  assert.equal(restored.pageCount, 14);
  assert.ok(!restored.notices.includes("manifest.json missing"));
});

test("caps: 400-char lines, 256 KB grep/read responses, > 2 MB files refused, 5,000 entries", async () => {
  const copy = copyFixture();
  const long = "x".repeat(1000);
  const big = Array.from({ length: 900 }, (_, i) => `line ${i} ${"y".repeat(420)}`).join("\n") + "\n";
  writeFileSync(join(copy, "platform", "long.md"), `---\ntitle: Long\n---\n${long}\n${big}`);
  writeFileSync(join(copy, "platform", "huge.md"), "---\ntitle: Huge\n---\n" + "z".repeat(2 * 1024 * 1024 + 1));
  mkdirSync(join(copy, "platform", "many"));
  for (let i = 0; i < 5100; i++) writeFileSync(join(copy, "platform", "many", `p${i}.md`), "---\ntitle: p\n---\n");
  const r = Registry.createDefault(copy, { limits: { maxFiles: 20000, maxDirs: 2000, maxDepth: 12, maxBytes: 1 << 26 } });
  const g = await r.grep({ pattern: "xxxxx", path: "platform/long.md" });
  assert.equal(g.matches![0].text.length, 400);
  assert.equal(g.matches![0].truncatedLine, true);
  const ctx = await r.grep({ pattern: "line", path: "platform/long.md", context: 5, maxMatches: 200 });
  assert.equal(ctx.truncated, true);
  assert.ok(ctx.matches!.length < 200);
  const rd = await r.read({ path: "platform/long.md" });
  assert.equal(rd.truncated, true);
  assert.ok(rd.lineTo < rd.totalLines);
  assert.ok(Buffer.byteLength(rd.raw) <= 256 * 1024);
  assert.match(rd.notices[0], /256 KB/);
  assert.equal(rd.citation, `platform/long.md:${rd.lineFrom}-${rd.lineTo}`, "citation carries the capped end line, never the requested one");
  const next = await r.read({ path: "platform/long.md", offset: rd.lineTo + 1 });
  assert.equal(next.lineFrom, rd.lineTo + 1);
  const huge = await r.read({ path: "platform/huge.md" });
  assert.equal(huge.raw, "");
  assert.match(huge.notices[0], /2 MB/);
  const many = r.list({ path: "platform/many" });
  assert.equal(many.entries.length, 5000);
  assert.equal(many.truncated, true);
  assert.ok(many.notices.length > 0);
});

test("B9: matching budget exhaustion → truncated + notice; queue timeout → empty-with-notice shape", async () => {
  const budget = Registry.createDefault(fixtureRoot, { matchBudgetMs: 0 });
  const g = await budget.grep({ pattern: "cart", path: "platform" });
  assert.equal(g.truncated, true);
  assert.ok(g.notices.some((n) => /budget/.test(n)));

  const pool = new GrepPool({ concurrency: 1, queueTimeoutMs: 5 });
  const slow = pool.run(() => new Promise<string>((res) => setTimeout(() => res("done"), 60)), () => "timeout");
  const queued = pool.run(() => Promise.resolve("ran"), () => "timeout");
  assert.equal(pool.queued, 1);
  assert.deepEqual(await Promise.all([slow, queued]), ["done", "timeout"]);
  const after = await pool.run(() => Promise.resolve("ran"), () => "timeout");
  assert.equal(after, "ran");

  const tiny = Registry.createDefault(fixtureRoot, { pool: { concurrency: 1, queueTimeoutMs: 0 }, yieldEvery: 1 });
  const results = await Promise.all(Array.from({ length: 30 }, () => tiny.grep({ pattern: "cart", path: "platform" })));
  const timedOut = results.filter((r) => r.notices.includes("queue timeout"));
  assert.ok(timedOut.length > 0, "at least one queued call timed out");
  for (const t of timedOut) assert.deepEqual(t, { matches: [], truncated: false, notices: ["queue timeout"] });
  for (const r of results) assert.ok(r.matches);
});

test("100 parallel in-process greps: zero errors, identical results", async () => {
  const results = await Promise.all(Array.from({ length: 100 }, (_, i) => registry.grep({ pattern: i % 2 ? "cart" : "plugin", path: "platform", context: 1 })));
  const a = JSON.stringify(results[1]);
  for (let i = 3; i < 100; i += 2) assert.equal(JSON.stringify(results[i]), a);
  assert.ok(results.every((r) => r.matches!.length > 0 && !r.notices.length));
});
