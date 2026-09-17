/** Project-wiki root resolution/validation and the `guidelines/` view. */
import { test } from "node:test";
import assert from "node:assert/strict";
import { appendFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, utimesSync, writeFileSync } from "node:fs";
import { tmpdir, homedir } from "node:os";
import { join } from "node:path";
import { Registry, resolveProjectWikiRoot, validateProjectRoot, validateWikiRoot } from "../src/registry.js";
import { copyFixture, copyProjectWikiFixture, fixtureRoot, projectWikiFixtureRoot } from "./helpers.js";

const BUNDLE = join(fixtureRoot, "..", "..", "dist");
const BE = "guidelines/6.7/be-code-guidelines.md";

function withProject(): Registry {
  return Registry.createDefault(fixtureRoot, { project: { root: projectWikiFixtureRoot } });
}

// -------------------------------------------------------- root resolution --

test("resolveProjectWikiRoot: --project-wiki > KB_PROJECT_WIKI (off disables) > CLAUDE_PROJECT_DIR > cwd; relative resolves against cwd", () => {
  assert.deepEqual(resolveProjectWikiRoot([], {}, "/cwd"), { root: "/cwd/docs/project-wiki", source: "cwd" });
  assert.deepEqual(resolveProjectWikiRoot([], { CLAUDE_PROJECT_DIR: "/proj" }, "/cwd"), { root: "/proj/docs/project-wiki", source: "claude-project-dir" });
  assert.deepEqual(resolveProjectWikiRoot([], { KB_PROJECT_WIKI: "off", CLAUDE_PROJECT_DIR: "/proj" }, "/cwd"), { root: null, source: "disabled" });
  assert.deepEqual(resolveProjectWikiRoot([], { KB_PROJECT_WIKI: "rel-wiki" }, "/cwd"), { root: "/cwd/rel-wiki", source: "env" });
  assert.deepEqual(resolveProjectWikiRoot(["--project-wiki", "x"], { KB_PROJECT_WIKI: "/y" }, "/cwd"), { root: "/cwd/x", source: "arg" });
  assert.deepEqual(resolveProjectWikiRoot(["--project-wiki=/abs"], {}, "/cwd"), { root: "/abs", source: "arg" });
});

test("validateProjectRoot: soft-fail — missing, not a directory, $HOME, no index.md, symlinked escape; ok on the fixture", () => {
  assert.equal(validateProjectRoot(projectWikiFixtureRoot, BUNDLE).ok, true);
  assert.match(validateProjectRoot(join(projectWikiFixtureRoot, "nope"), BUNDLE).reason ?? "", /does not exist/);
  assert.match(validateProjectRoot(join(projectWikiFixtureRoot, "index.md"), BUNDLE).reason ?? "", /not a directory/);
  assert.match(validateProjectRoot(homedir(), BUNDLE).reason ?? "", /must not be/);
  const noIndex = copyProjectWikiFixture();
  rmSync(join(noIndex, "index.md"));
  assert.match(validateProjectRoot(noIndex, BUNDLE).reason ?? "", /has no index\.md/);

  const outside = mkdtempSync(join(tmpdir(), "kb-outside-"));
  const link = join(mkdtempSync(join(tmpdir(), "kb-link-")), "escape");
  symlinkSync(outside, link);
  assert.match(validateProjectRoot(link, BUNDLE).reason ?? "", /has no index\.md/, "realpath follows the symlink; the empty target has no index.md");
});

// ------------------------------------------------------------ project layer --

test("Registry.createDefault: an external project override serves `project/...` from the second root, physical layout mapped, no manifest.json required", async () => {
  const r = withProject();
  const st = r.statuses().find((s) => s.layer === "project")!;
  assert.equal(st.status, "implemented");
  assert.ok(!st.notices.includes("manifest.json missing"), "manifestOptional: no missing-manifest notice");
  const idx = await r.read({ path: "project/index.md" });
  assert.match(idx.raw, /Project wiki \(test fixture\)/);
  const src = await r.read({ path: "project/index.md", source: true });
  assert.match(src.notices[0], /not supported/, "source:true stays platform-only");
  assert.deepEqual(r.list({ path: "project" }).entries.map((e) => e.name).sort(), ["guidelines", "index.md"]);
});

test("in-tree <wikiRoot>/project/ is used when there is no external override; external root wins with a notice when both exist", async () => {
  const noOverride = Registry.createDefault(fixtureRoot);
  assert.equal(noOverride.statuses().find((s) => s.layer === "project")!.status, "planned", "the fixture's project/ has only README.md, no index.md");

  const copy = copyFixture();
  mkdirSync(join(copy, "project"), { recursive: true });
  writeFileSync(join(copy, "project", "index.md"), "in-tree project index\n");
  const inTree = Registry.createDefault(copy);
  assert.equal(inTree.statuses().find((s) => s.layer === "project")!.status, "implemented");

  const withExternal = Registry.createDefault(copy, { project: { root: projectWikiFixtureRoot, notice: "external takes precedence" } });
  const st = withExternal.statuses().find((s) => s.layer === "project")!;
  assert.ok(st.notices.includes("external takes precedence"));
  const idx = await withExternal.read({ path: "project/index.md" });
  assert.match(idx.raw, /Project wiki \(test fixture\)/, "the external root's content, not the in-tree one");
});

test("wiki root must not have its own guidelines/ directory (reserved virtual layer)", () => {
  const copy = copyFixture();
  mkdirSync(join(copy, "guidelines"));
  writeFileSync(join(copy, "guidelines", "index.md"), "x\n");
  assert.throws(() => validateWikiRoot(copy, BUNDLE), /reserved virtual layer/);
});

test("project layer freshness: a file added after construction appears once the TTL elapses (no restart)", async () => {
  const copy = copyProjectWikiFixture();
  const r = Registry.createDefault(fixtureRoot, { project: { root: copy }, volatileTtlMs: 0 });
  const before = r.list({ path: "project/guidelines" }).entries.map((e) => e.name);
  assert.ok(!before.includes("new-file-guidelines.md"));
  writeFileSync(join(copy, "guidelines", "new-file-guidelines.md"), "---\ntitle: New\n---\n## A\n\nx\n");
  // volatileTtlMs: 0 forces a re-walk on the very next call, standing in for "waited past the TTL".
  const after = r.list({ path: "project/guidelines" }).entries.map((e) => e.name);
  assert.ok(after.includes("new-file-guidelines.md"));
});

// -------------------------------------------------------------- kb.config --

test("kb.config.json: a corpus may set project:false; validateKbConfigShape rejects a non-boolean value", async () => {
  const { loadKbConfig } = await import("../src/registry.js");
  const dir = mkdtempSync(join(tmpdir(), "kb-config-"));
  const p = join(dir, "kb.config.json");
  writeFileSync(
    p,
    JSON.stringify({ corpus: "wiki", corpora: { wiki: { root: fixtureRoot, developer: "platform/dev/6.7", merchant: "platform/func", entryPoints: [], project: false } } }),
  );
  const cfg = loadKbConfig(p);
  assert.equal((cfg.corpora.wiki as any).project, false);
  writeFileSync(
    p,
    JSON.stringify({ corpus: "wiki", corpora: { wiki: { root: fixtureRoot, developer: "d", merchant: "m", entryPoints: [], project: "nope" } } }),
  );
  assert.throws(() => loadKbConfig(p), /field "project" must be a boolean/);
});

// ------------------------------------------------------------- guidelines --

test("guidelines/ view: registered only when platform or project guidelines/ exists; root and version listing", () => {
  const copyNoGuidelines = copyFixture();
  rmSync(join(copyNoGuidelines, "platform", "guidelines"), { recursive: true });
  const noGuidelines = Registry.createDefault(copyNoGuidelines);
  assert.ok(!noGuidelines.layers().includes("guidelines"));

  const r = withProject();
  assert.ok(r.layers().includes("guidelines"));
  assert.deepEqual(r.list({ path: "guidelines" }).entries.map((e) => e.name), ["6.7"]);
  const files = r.list({ path: "guidelines/6.7" }).entries;
  assert.deepEqual(
    files.map((e) => [e.name, e.tag]),
    [
      ["be-code-guidelines.md", "platform+project"],
      ["code-guidelines.md", "platform"],
      ["project-extra-guidelines.md", "project"],
    ],
  );
});

test("guidelines/ view: read_doc merges override, extend, waive, addition, undeclared override and dangling merge target", async () => {
  const r = withProject();
  const res = await r.read({ path: BE });
  assert.deepEqual(res.notices.sort(), ["merge target not found: old-anchor-renamed", "undeclared override: formatting"]);
  assert.equal(res.frontmatter.title, "Backend code guidelines");
  assert.equal(res.frontmatter.project, "project/guidelines/be-code-guidelines.md");
  assert.match(res.raw, /> Effective guidelines: platform\/guidelines\/6\.7\/be-code-guidelines\.md \+ project\/guidelines\/be-code-guidelines\.md \(project sections take precedence\)\.\n/);
  assert.match(res.raw, /## Testing\n> \[project override\] project\/guidelines\/be-code-guidelines\.md#testing\n/, "project tag path has no version segment");

  // naming-conventions: untouched platform section
  assert.match(res.raw, /## Naming conventions\n> \[platform\] platform\/guidelines\/6\.7\/be-code-guidelines\.md#naming-conventions/);
  // dependency-injection: extend — project section directly before the platform one, both present
  const extendIdx = res.raw.indexOf("## Dependency injection\n> [project extend]");
  const platformDiIdx = res.raw.indexOf("## Dependency injection\n> [platform]");
  assert.ok(extendIdx >= 0 && platformDiIdx > extendIdx);
  // testing: declared override — only the project text remains
  assert.match(res.raw, /## Testing\n> \[project override\][^\n]*\n\nEvery repository decorator/);
  assert.ok(!res.raw.includes("Write PHPUnit tests"));
  // formatting: undeclared override
  assert.match(res.raw, /## Formatting\n> \[project override\]/);
  // deprecated-api-usage: waive
  assert.match(res.raw, /## Deprecated API usage\n> \[project waive\][^\n]*\n\nWAIVED:/);
  // additions appended after the last platform section, in project order
  const oldAnchorIdx = res.raw.indexOf("## Old anchor renamed");
  const somethingElseIdx = res.raw.indexOf("## Something else entirely");
  assert.ok(oldAnchorIdx > platformDiIdx && somethingElseIdx > oldAnchorIdx);

  const sec = await r.read({ path: BE, section: "testing" });
  assert.equal(sec.section?.resolved, "testing");
  assert.match(sec.raw, /Every repository decorator/);
});

test("guidelines/ view: one-sided files are served as is, tagged, without notices", async () => {
  const r = withProject();
  const platformOnly = await r.read({ path: "guidelines/6.7/code-guidelines.md" });
  assert.deepEqual(platformOnly.notices, [], "no project file for it: the platform file is served as is, nothing to report");
  assert.match(platformOnly.raw, /## General principles\n> \[platform\] platform\/guidelines\/6\.7\/code-guidelines\.md#general-principles/);

  const projectOnly = await r.read({ path: "guidelines/6.7/project-extra-guidelines.md" });
  assert.deepEqual(projectOnly.notices, [], "a project-only guideline file is normal: served as is, nothing to report");
  assert.match(projectOnly.raw, /## Release checklist\n> \[project addition\]/);

  const missing = await r.read({ path: "guidelines/6.7/does-not-exist.md" });
  assert.match(missing.notices[0], /no such path/);
});

test("guidelines/ view: grep scans the effective files — overridden/waived platform text never matches", async () => {
  const r = withProject();
  const hit = await r.grep({ pattern: "PSR-12", path: "guidelines/6.7" });
  assert.equal(hit.matches!.length, 1);
  assert.equal(hit.matches![0].path, BE);
  const gone = await r.grep({ pattern: "Write PHPUnit tests", path: "guidelines" });
  assert.deepEqual(gone.matches, []);
  const single = await r.grep({ pattern: "Release checklist", path: "guidelines/6.7/project-extra-guidelines.md" });
  assert.equal(single.matches!.length, 1);
});

test("guidelines/ view: kb_status-style per-version counts split platform/project/merged", () => {
  const r = withProject();
  const st = r.statuses().find((s) => s.layer === "guidelines")! as any;
  assert.deepEqual(st.versions, { "6.7": { platform: 2, project: 2, merged: 1 } });
  assert.equal(st.projectFiles, 2);
});

test("guidelines/ view: project guidelines are unversioned — the same project file merges into whichever version is read", async () => {
  const copy = copyFixture();
  mkdirSync(join(copy, "platform", "guidelines", "6.6"), { recursive: true });
  writeFileSync(join(copy, "platform", "guidelines", "6.6", "be-code-guidelines.md"), "---\ntitle: Backend code guidelines 6.6\n---\n## Testing\n\nWrite PHPUnit tests (6.6).\n");
  const r = Registry.createDefault(copy, { project: { root: projectWikiFixtureRoot } });
  assert.deepEqual(r.list({ path: "guidelines" }).entries.map((e) => e.name), ["6.6", "6.7"]);
  for (const v of ["6.6", "6.7"]) {
    const rd = await r.read({ path: `guidelines/${v}/be-code-guidelines.md` });
    assert.match(rd.raw, new RegExp(`## Testing\\n> \\[project override\\] project/guidelines/be-code-guidelines\\.md#testing`));
    assert.doesNotMatch(rd.raw, /Write PHPUnit tests/);
  }

  // before any platform guidelines exist, project files are still served under a valid major, never under junk
  const noPlatform = copyFixture();
  rmSync(join(noPlatform, "platform", "guidelines"), { recursive: true });
  const r2 = Registry.createDefault(noPlatform, { project: { root: projectWikiFixtureRoot } });
  assert.deepEqual(r2.list({ path: "guidelines" }).entries, []);
  assert.deepEqual(r2.list({ path: "guidelines" }).notices, []);
  const only = await r2.read({ path: "guidelines/6.7/be-code-guidelines.md" });
  assert.deepEqual(only.notices, []);
  assert.match(only.raw, /> \[project addition\] project\/guidelines\/be-code-guidelines\.md#testing/);
  const junk = await r2.read({ path: "guidelines/latest/be-code-guidelines.md" });
  assert.match(junk.notices[0], /no such path/);
});

// ------------------------------------------- no project, explicit failures, cache --

test("guidelines/ view: a > [expert] platform section is served as [platform expert] with the tag line stripped; a project override on it still wins", async () => {
  const wiki = copyFixture();
  try {
    const code = join(wiki, "platform", "guidelines", "6.7", "code-guidelines.md");
    appendFileSync(code, "\n## Twig chain\n> [expert] reviewed\n\n- Override the narrowest block.\n");
    const be = join(wiki, "platform", "guidelines", "6.7", "be-code-guidelines.md");
    // the platform fixture's "## Testing" becomes expert-owned; the project fixture declares testing: override
    writeFileSync(be, readFileSync(be, "utf8").replace("## Testing\n", "## Testing\n> [expert]\n"));

    const r = Registry.createDefault(wiki, { project: { root: projectWikiFixtureRoot } });
    const platformOnly = await r.read({ path: "guidelines/6.7/code-guidelines.md" });
    assert.match(platformOnly.raw, /## Twig chain\n> \[platform expert\] platform\/guidelines\/6\.7\/code-guidelines\.md#twig-chain\n\n- Override the narrowest block\./);
    assert.ok(!platformOnly.raw.includes("> [expert]"), "the raw tag line is not served");
    assert.match(platformOnly.raw, /## General principles\n> \[platform\] /, "untagged sections stay [platform]");
    const hits = await r.grep({ path: "guidelines/6.7", pattern: "narrowest block" });
    assert.equal(hits.matches?.length, 1);

    const merged = await r.read({ path: BE });
    assert.match(merged.raw, /## Testing\n> \[project override\]/);
    assert.ok(!merged.raw.includes("[platform expert]"), "the overridden expert section is gone");
  } finally {
    rmSync(wiki, { recursive: true, force: true });
  }
});

test("guidelines/ view without any project wiki: platform files are returned, tagged, with no notices", async () => {
  const r = Registry.createDefault(fixtureRoot);
  const rd = await r.read({ path: BE });
  assert.deepEqual(rd.notices, []);
  assert.match(rd.raw, /> \[platform\] platform\/guidelines\/6\.7\/be-code-guidelines\.md#/);
  assert.doesNotMatch(rd.raw, /\[project/);
  assert.equal(rd.frontmatter.project, undefined);
});

test("projectDisabledReason: an explicit project choice that failed never falls back to an in-tree project/", async () => {
  const copy = copyFixture();
  mkdirSync(join(copy, "project", "guidelines"), { recursive: true });
  writeFileSync(join(copy, "project", "index.md"), "in-tree project index\n");
  writeFileSync(join(copy, "project", "guidelines", "be-code-guidelines.md"), "---\ntitle: In-tree\n---\n## Testing\n\nin-tree rule\n");
  const r = Registry.createDefault(copy, { projectDisabledReason: "project wiki does not exist: /nope (--project-wiki)" });
  const st = r.statuses().find((s) => s.layer === "project")!;
  assert.equal(st.status, "planned");
  assert.ok(st.notices.some((n) => n.includes("/nope (--project-wiki)")));
  const idx = await r.read({ path: "project/index.md" });
  assert.equal(idx.raw, "");
  const eff = await r.read({ path: BE });
  assert.doesNotMatch(eff.raw, /in-tree rule/, "the in-tree project guideline is not merged either");
  assert.deepEqual(eff.notices, []);
});

test("guidelines/ view cache: keyed on mtime+size — a hit reads no bodies, a changed project file is re-merged", async () => {
  const copy = copyProjectWikiFixture();
  const r = Registry.createDefault(fixtureRoot, { project: { root: copy }, volatileTtlMs: 0 });
  const counts = { platform: 0, project: 0 };
  for (const layer of ["platform", "project"] as const) {
    const src = r.routeOf(`${layer}/x`)! as { read: (a: unknown) => Promise<unknown> };
    const orig = src.read.bind(src);
    src.read = (a: unknown) => {
      counts[layer]++;
      return orig(a);
    };
  }
  const first = await r.read({ path: BE });
  assert.deepEqual(counts, { platform: 1, project: 1 });
  const second = await r.read({ path: BE });
  assert.deepEqual(counts, { platform: 1, project: 1 }, "unchanged mtime+size: served from cache, no body read");
  assert.equal(second.raw, first.raw);
  await r.grep({ pattern: "WAIVED", path: "guidelines/6.7/be-code-guidelines.md" });
  assert.deepEqual(counts, { platform: 1, project: 1 }, "grep over the effective file reuses the cache too");

  const file = join(copy, "guidelines", "be-code-guidelines.md");
  writeFileSync(file, "---\ntitle: Backend code guidelines\nmerge:\n  testing: override\n---\n## Testing\n\nChanged project rule.\n");
  const future = new Date(Date.now() + 5000);
  utimesSync(file, future, future);
  const third = await r.read({ path: BE });
  assert.deepEqual(counts, { platform: 2, project: 2 });
  assert.match(third.raw, /Changed project rule\./);
});

test("guidelines/ view: only *-guidelines.md files in project/guidelines/ are guideline files", async () => {
  const copy = copyProjectWikiFixture();
  writeFileSync(join(copy, "guidelines", "notes.md"), "---\ntitle: Notes\n---\n## Note\n\nnot a guideline file\n");
  writeFileSync(join(copy, "guidelines", "Draft-Guidelines.md"), "---\ntitle: Draft\n---\n## Draft\n\nwrong case\n");
  const r = Registry.createDefault(fixtureRoot, { project: { root: copy } });
  const names = r.list({ path: "guidelines/6.7" }).entries.map((e) => e.name);
  assert.deepEqual(names, ["be-code-guidelines.md", "code-guidelines.md", "project-extra-guidelines.md"]);
  assert.match((await r.read({ path: "guidelines/6.7/notes.md" })).notices[0], /no such path/);
  assert.equal((r.statuses().find((s) => s.layer === "guidelines") as any).projectFiles, 2);
  // the raw project layer still serves the page itself
  assert.match((await r.read({ path: "project/guidelines/notes.md" })).raw, /not a guideline file/);
});
