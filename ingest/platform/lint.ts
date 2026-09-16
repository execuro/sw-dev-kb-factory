/**
 * `wiki:lint` — Phase 7 (refresh spec). Validates the committed wiki tree against
 * the design spec's "Wiki conformance contract" and the refresh spec's own lint
 * rules. Exits non-zero on any error; warnings never fail the build.
 */
import { execSync } from "node:child_process";
import { existsSync, lstatSync, readFileSync, readdirSync, statSync } from "node:fs";
import { basename, resolve, relative } from "node:path";
import { ingestLayerDir, loadPlatformConfig, wikiRootFrom } from "../shared/config.js";
import { loadState } from "../shared/state.js";
import { parsePage, validatePageFrontmatter, validateHubFrontmatter, validateGuidelineFrontmatter, validateSixSections, estimateTokens, effectiveMinTokens, crossLinkTargets, checkFrontmatterShape, h2Headings } from "../shared/frontmatterValidate.js";
import { devSourcePath, readSourceText } from "./pagePrep.js";
import { extractSections, unverifiedIdentifiers } from "./pages.js";
import { isSynonymDataLine } from "./synonyms.js";
import { checkOutputHygiene, checkLeakedLocalState, checkPurity, isDocPagePath } from "../shared/hygiene.js";
import { checkLinks, wikiLinkTargets } from "../shared/links.js";
import { cacheDirs, promptHash } from "../shared/workitems.js";
import { sha256 } from "../shared/hash.js";
import { resolveVendorRoot, resolveCodeIndexContext, flagIdentifiers, type CodeIndex } from "./codeIndex.js";
import { paths } from "../../src/paths.js";
import { collectStatePaths } from "./build.js";
import type { CliFlags, IngestionState, PlatformConfig } from "../shared/types.js";

const LAYER_DIR = ingestLayerDir("platform");
const ALLOWED_ROOT_FILES = new Set(["README.md", "composer.json"]);
const ALLOWED_EXTENSIONS = new Set([".md", ".json"]);
// Repo-internal needles that must never appear under platform/ are `checkPurity`'s always-on
// set (ingest/shared/hygiene.ts). The needles below name generic tool-ecosystem files that
// upstream Shopware docs legitimately discuss (the MCP-server pages explain Claude Code's
// `.mcp.json` / `.claude/` config), and whose mentions flow into generated aggregates (article
// pages, per-directory index.md summary lines, hubs, manifest.json). Enforced only on
// platform/index.md — the sole hand-committed protocol file.
const ECOSYSTEM_COLLISION_NEEDLES = [".mcp.json", ".claude/"];
const PROTOCOL_FILE = "platform/index.md";
// The root protocol file's "Source fall-through" section deliberately documents the
// ingest/ snapshot path for offline source lookup; every other needle still applies to it.
const ALLOWED_REFERENCES: Record<string, readonly string[]> = { [PROTOCOL_FILE]: ["ingest/"] };

export interface LintReport {
  errors: string[];
  warnings: string[];
}

export async function run(flags: CliFlags): Promise<number> {
  const config = loadPlatformConfig();
  const state = loadState();
  const wikiRoot = wikiRootFrom(flags, config);
  const platformRoot = resolve(wikiRoot, "platform");
  const report: LintReport = { errors: [], warnings: [] };

  if (!existsSync(platformRoot)) {
    report.errors.push(`platform layer root missing: ${platformRoot}`);
    return finish(report);
  }

  lintPackagePurity(wikiRoot, report);
  lintNonPageFiles(wikiRoot, report);
  lintTreeSafety(platformRoot, report, config);
  const { knownPaths, sharedAliases } = lintPagesAndIndexes(config, state, wikiRoot, report);
  lintCodeCheck(config, wikiRoot, report);
  lintHubs(config, state, wikiRoot, knownPaths, report);
  for (const guidelinePath of lintGuidelines(config, wikiRoot, report)) knownPaths.add(guidelinePath);
  lintGuidelineState(state, report);
  for (const alias of sharedAliases) knownPaths.add(alias); // sibling aliases resolve for links/synonyms, but are not hub members
  const statePaths = collectStatePaths(state as IngestionState);
  lintOrphanWikiFiles(wikiRoot, knownPaths, statePaths, report);
  lintLinks(wikiRoot, knownPaths, report);
  lintCrossLinks(wikiRoot, knownPaths, report);
  lintSynonyms(wikiRoot, knownPaths, report, config);
  lintManifest(wikiRoot, report);
  lintSize(wikiRoot, report, config);
  lintGitTrackedCache(report);

  return finish(report);
}

function finish(report: LintReport): number {
  for (const e of report.errors) process.stderr.write(`wiki:lint: ERROR ${e}\n`);
  for (const w of report.warnings) process.stderr.write(`wiki:lint: warning ${w}\n`);
  process.stdout.write(JSON.stringify({ cmd: "lint", errors: report.errors.length, warnings: report.warnings.length }) + "\n");
  return report.errors.length > 0 ? 1 : 0;
}

function walk(dir: string): string[] {
  if (!existsSync(dir)) return [];
  const out: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = resolve(dir, entry.name);
    if (entry.name.startsWith(".")) continue;
    if (entry.isSymbolicLink()) {
      out.push(full); // recorded, flagged by lintTreeSafety
      continue;
    }
    if (entry.isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

function lintPackagePurity(wikiRoot: string, report: LintReport): void {
  for (const file of walk(wikiRoot)) {
    const rel = relative(wikiRoot, file).split("\\").join("/");
    const isRootFile = !rel.includes("/");
    if (isRootFile && ALLOWED_ROOT_FILES.has(rel)) continue;
    if (rel.startsWith("platform/")) continue; // structural checks happen elsewhere
    if (isRootFile) {
      report.errors.push(`package purity: unexpected root file ${rel}`);
    }
  }
  for (const file of walk(resolve(wikiRoot, "platform"))) {
    const rel = relative(wikiRoot, file).split("\\").join("/");
    const ext = rel.includes(".") ? rel.slice(rel.lastIndexOf(".")) : "";
    if (!ALLOWED_EXTENSIONS.has(ext)) {
      report.errors.push(`package purity: disallowed extension under platform/: ${rel}`);
      continue;
    }
    let text: string;
    try {
      text = readFileSync(file, "utf8");
    } catch {
      continue;
    }
    const extraNeedles = rel === PROTOCOL_FILE ? ECOSYSTEM_COLLISION_NEEDLES : [];
    for (const issue of checkPurity(text, extraNeedles, ALLOWED_REFERENCES[rel] ?? [])) {
      report.errors.push(`package purity: ${rel} ${issue.detail}`);
    }
  }
}

/**
 * Same `(sourceId, hash)` → `.cache/src/…/<hash>.txt` rule the band check uses, keyed by
 * hash alone so tree-safety can find a page's source from its frontmatter `sourceHash`
 * without state context. Cache absent → hygiene stays strict (no source-quote exemption).
 */
/**
 * Repository furniture that is Markdown but not documentation (`AGENTS.md`, `.github/**`, …) must
 * never sit in the corpus: everything in it is published to consumers as documentation.
 *
 * This needs its own walker because `walk()` skips dot entries — which is exactly why a whole
 * `platform/dev/6.7/.github/` directory sat in the tree while `wiki:lint` reported zero errors and
 * only `test/purity.test.ts` caught it. The other lint rules rely on `walk()`'s dot-skip, so it is
 * left alone rather than changed underneath them.
 */
function lintNonPageFiles(wikiRoot: string, report: LintReport): void {
  const walkAll = (dir: string): string[] => {
    if (!existsSync(dir)) return [];
    const out: string[] = [];
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = resolve(dir, entry.name);
      if (entry.isSymbolicLink()) continue; // lintTreeSafety owns symlinks
      if (entry.isDirectory()) out.push(...walkAll(full));
      else out.push(full);
    }
    return out;
  };
  for (const file of walkAll(wikiRoot)) {
    const rel = relative(wikiRoot, file).split("\\").join("/");
    if (!isDocPagePath(rel)) {
      report.errors.push(`non-page file in the corpus: ${rel} (upstream repository furniture; add it to the source's exclude globs and re-run wiki:build)`);
    }
  }
}

function buildSourceCacheIndex(): Map<string, string> {
  const index = new Map<string, string>();
  for (const file of walk(cacheDirs(LAYER_DIR).srcDir)) {
    if (file.endsWith(".txt")) index.set(basename(file, ".txt"), file);
  }
  return index;
}

export function lintTreeSafety(platformRoot: string, report: LintReport, config: PlatformConfig): void {
  const sourceCache = buildSourceCacheIndex();
  for (const file of walk(platformRoot)) {
    const rel = relative(platformRoot, file).split("\\").join("/");
    let lst;
    try {
      lst = lstatSync(file);
    } catch {
      continue;
    }
    if (lst.isSymbolicLink()) {
      report.errors.push(`symlink under platform/: ${rel}`);
      continue;
    }
    if (!lst.isFile()) continue;
    if (lst.mode & 0o111) report.errors.push(`executable bit set: ${rel}`);
    const text = readFileSync(file, "utf8");
    if (text.includes("\uFEFF")) report.errors.push(`BOM present: ${rel}`);
    if (text.includes("\uFFFD")) report.errors.push(`not valid UTF-8: ${rel}`);
    if (lst.size > 1024 * 1024) report.errors.push(`committed file exceeds 1 MB: ${rel} (${lst.size} bytes)`);
    else if (lst.size > config.sizeLimits.generatedFileMaxBytes && !rel.endsWith("manifest.json")) {
      report.errors.push(`generated file exceeds 512 KB: ${rel} (${lst.size} bytes)`);
    }
    let sourceText: string | undefined;
    if (rel.endsWith(".md")) {
      const { frontmatter } = parsePage(text);
      if (typeof frontmatter.sourceHash === "string") sourceText = readSourceText(sourceCache.get(frontmatter.sourceHash));
    }
    // A missing source cache (post-`wiki:clean`) is not a violation on its own: an
    // exemptible finding (non-allowlisted link, data: URI) may well be quoted verbatim from
    // upstream, just unconfirmable right now — downgrade those two classes to warnings when
    // `sourceText` is unavailable; every other hygiene class stays an error either way.
    for (const h of checkOutputHygiene(text, sourceText)) {
      if (h.exemptible && sourceText === undefined) {
        report.warnings.push(`${rel}: ${h.detail} (source cache unavailable — could not confirm this is a verbatim quote)`);
      } else {
        report.errors.push(`${rel}: ${h.detail}`);
      }
    }
    for (const h of checkLeakedLocalState(text)) report.errors.push(`${rel}: ${h.detail}`);
  }
}

function lintPagesAndIndexes(config: PlatformConfig, state: ReturnType<typeof loadState>, wikiRoot: string, report: LintReport): { knownPaths: Set<string>; sharedAliases: Set<string> } {
  const knownPaths = new Set<string>();
  const sharedAliases = new Set<string>();
  const devSources = config.sources.filter((s) => s.docType.includes("developer") && s.versions?.some((v) => v.main));
  const currentPagePromptHash = safePromptHash(resolve(LAYER_DIR, "prompts/page.md"));

  for (const source of devSources) {
    for (const v of source.versions!.filter((v) => v.active)) {
      const sourceState = state.sources[`${source.id}:${v.version}`];
      const indexPath = resolve(wikiRoot, "platform/dev", v.version, "index.md");
      const indexLines = readIndexLines(indexPath);
      const indexedPaths = new Set(indexLines.map((l) => l.split(" — ")[0]?.trim()));

      for (const [path, entry] of Object.entries(sourceState?.pages ?? {})) {
        if (entry.hash === undefined) continue; // unpublished / never fetched
        const physicalPath = entry.sharedFrom ?? path;
        if (entry.failed) report.warnings.push(`last ingest attempt failed, remaining: ${path}`);
        if (entry.builtHash === undefined) continue; // never successfully built, nothing on disk to check
        const abs = resolve(wikiRoot, physicalPath);
        if (!existsSync(abs)) {
          report.errors.push(`page marked built but file missing: ${physicalPath}`);
          continue;
        }
        knownPaths.add(physicalPath);
        if (entry.sharedFrom) sharedAliases.add(path);
        const pageText = readFileSync(abs, "utf8");
        const { frontmatter, body } = parsePage(pageText);
        for (const issue of checkFrontmatterShape(pageText)) report.errors.push(`${physicalPath}: ${issue.message}`);
        if (frontmatter.id !== physicalPath) report.errors.push(`frontmatter id mismatches file path: ${physicalPath}`);
        if (frontmatter.sourceHash !== entry.hash) report.errors.push(`stale article (sourceHash != hash): ${physicalPath}`);
        if (!indexedPaths.has(physicalPath)) report.errors.push(`page missing from directory index: ${physicalPath} not in ${relative(wikiRoot, indexPath)}`);
        if (Array.isArray(frontmatter.versions) && !(frontmatter.versions as string[]).includes(v.version)) {
          report.errors.push(`shared article versions[] does not cover ${v.version}: ${physicalPath}`);
        }
        if (entry.sharedFrom && !frontmatter.sourceUrls) report.errors.push(`shared article missing sourceUrls: ${physicalPath}`);

        for (const issue of validatePageFrontmatter(frontmatter)) report.warnings.push(`${physicalPath}: ${issue.field} ${issue.message}`);
        for (const issue of validateSixSections(body)) report.warnings.push(`${physicalPath}: ${issue.message}`);
        const tokens = estimateTokens(body);
        // Same effective floor as validatePageOutput (pages.ts): a thin source caps the
        // minimum at its own prose size (code stripped). Cache file absent at lint time → config floor.
        const sourceText = readSourceText(devSourcePath(`${source.id}:${v.version}`, entry.hash));
        const effectiveMin = effectiveMinTokens(config.articleTokens.min, sourceText);
        if (tokens < effectiveMin * 0.8 || tokens > config.articleTokens.longMax * 1.2) {
          report.warnings.push(`${physicalPath}: article length ${tokens} tokens outside band`);
        }
        if (entry.promptHash !== currentPagePromptHash) report.warnings.push(`${physicalPath}: page prompt hash changed since generation (dirty)`);
      }

      for (const line of indexedPaths) {
        if (line && !knownPaths.has(line) && !existsSync(resolve(wikiRoot, line))) {
          report.errors.push(`index line points to missing file: ${line} in ${relative(wikiRoot, indexPath)}`);
        }
      }
      const dupes = indexLines.map((l) => l.split(" — ")[0]?.trim()).filter((p, i, arr) => p && arr.indexOf(p) !== i);
      for (const d of new Set(dupes)) report.errors.push(`duplicated index line: ${d} in ${relative(wikiRoot, indexPath)}`);
    }
  }

  const merchantSource = config.sources.find((s) => s.docType.includes("functional"));
  if (merchantSource) {
    const merchantState = state.sources[merchantSource.id];
    for (const [path, entry] of Object.entries(merchantState?.pages ?? {})) {
      if (entry.hash === undefined || entry.builtHash === undefined) continue;
      const abs = resolve(wikiRoot, path);
      if (!existsSync(abs)) {
        report.errors.push(`page marked built but file missing: ${path}`);
        continue;
      }
      knownPaths.add(path);
    }
  }
  return { knownPaths, sharedAliases };
}

/**
 * codeCheck rule (design doc "State, dedupe, build, lint"): Tier 0 flags surviving into
 * Key steps/Essential identifiers are an error on pages already `codeCheckedAgainst`
 * (they must have been caught at ingest) and a warning on everything else (pre-re-ingestion
 * usability). A stale `codeCheckedAgainst` pin, and a pinned page missing its section, are
 * also reported. Silently skipped (not a lint error) when no code root resolves — `wiki:lint`
 * must still work in a checkout without `vendor/` (codeIndex.ts's `codeRootFor` picks a
 * synced `.sources/shopware/<version>` checkout in that case; only a truly unsynced version
 * skips).
 */
function lintCodeCheck(config: PlatformConfig, wikiRoot: string, report: LintReport): void {
  if (!config.codeCheck?.enabled) return;
  const primaryVersion = config.guidelines?.versions?.[0];
  if (!primaryVersion) return;
  const projectRoot = resolveVendorRoot(config) ?? paths.shopwareSourceRoot(primaryVersion);
  let index: CodeIndex;
  try {
    const ctx = resolveCodeIndexContext(primaryVersion, config, projectRoot, resolve(cacheDirs(LAYER_DIR).root, "code"));
    if (!ctx) return;
    index = ctx.index;
  } catch {
    return;
  }
  const installedMajor = index.coreVersion.split(".").slice(0, 2).join(".");
  const devRoot = resolve(wikiRoot, "platform/dev", installedMajor);
  for (const file of walk(devRoot)) {
    const rel = relative(wikiRoot, file).split("\\").join("/");
    if (!rel.endsWith(".md") || rel.endsWith("/index.md") || rel.endsWith("/_index.md")) continue;
    const { frontmatter, body } = parsePage(readFileSync(file, "utf8"));
    const pin = frontmatter.codeCheckedAgainst;
    const hasPin = typeof pin === "string";

    const keyText = extractSections(body, ["Key steps / config", "Essential identifiers"]);
    const flags = flagIdentifiers(keyText, index);
    // A page's own `## Code check` section may already disclose an identifier as `unverified`
    // (e.g. a third-party symbol no `shopware/shopware` checkout can index) — trust that
    // disclosure instead of re-flagging it (Fix 2, kb-code-check checkout-mode follow-up).
    const unverified = unverifiedIdentifiers(body);
    const flagged = [...flags.absent, ...flags.deprecated, ...flags.unread].filter((f) => !unverified.has(f));
    if (flagged.length) {
      const msg = `${rel}: Tier 0 flags stale identifiers in Key steps/Essential identifiers: ${flagged.join(", ")}`;
      if (hasPin) report.errors.push(msg);
      else report.warnings.push(msg);
    }
    if (hasPin && pin !== index.coreVersion) {
      report.warnings.push(`${rel}: codeCheckedAgainst ${String(pin)} is stale (installed ${index.coreVersion})`);
    }
    if (hasPin && !/^##\s+Code check \(/m.test(body)) {
      report.errors.push(`${rel}: codeCheckedAgainst is set but ## Code check (...) section is missing`);
    }
  }
}

/** `state.guidelines.files[*].guidelineState === "failed"` —
 *  same "last ingest attempt failed, remaining" treatment `lintPagesAndIndexes` gives a
 *  failed page: a warning, not an error, since the previously-built article (if any) is
 *  still on disk and still usable. */
export function lintGuidelineState(state: ReturnType<typeof loadState>, report: LintReport): void {
  for (const [key, entry] of Object.entries(state.guidelines?.files ?? {})) {
    if (entry.guidelineState === "failed") report.warnings.push(`last guideline ingest attempt failed, remaining: ${key}`);
  }
}

export function lintHubs(config: PlatformConfig, state: ReturnType<typeof loadState>, wikiRoot: string, knownPaths: Set<string>, report: LintReport): void {
  const memberOf = new Map<string, number>();
  for (const [slug, hub] of Object.entries(state.hubs)) {
    if (hub.hubState !== "ok") continue;
    const path = `platform/hubs/${slug}.md`;
    const abs = resolve(wikiRoot, path);
    if (!existsSync(abs)) continue;
    if (hub.memberPaths.length === 0) report.errors.push(`hub with no members: ${path}`);
    for (const m of hub.memberPaths) memberOf.set(m, (memberOf.get(m) ?? 0) + 1);

    const size = statSync(abs).size;
    if (size > config.sizeLimits.hubMaxBytes) report.errors.push(`${path}: ${size} bytes exceeds the ${config.sizeLimits.hubMaxBytes}-byte hub cap`);
    const text = readFileSync(abs, "utf8");
    for (const issue of checkFrontmatterShape(text)) report.errors.push(`${path}: ${issue.message}`);
    const { frontmatter } = parsePage(text);
    for (const issue of validateHubFrontmatter(frontmatter)) report.errors.push(`${path}: ${issue.field} ${issue.message}`);

    // Register the hub itself as a resolvable target: hub→hub links are legitimate
    // navigation (e.g. `dal` ↔ `data-abstraction-layer`, `plugins` ↔ `apps`, a
    // deprecated topic → its replacement), and without this every one of them is
    // reported unresolved even though the file exists on disk.
    knownPaths.add(path);
  }
  // No "page in no hub" check: hub scopes are auto-derived cross-cutting topics
  // (≥4 pages spanning >1 directory, capped at 30), deliberately not a coverage
  // layer — per-directory `index.md` covers every page. Warning once per uncovered
  // page would emit ~1400 lines of noise per run and drown real findings.
}

/**
 * `platform/guidelines/<version>/*.md`. Resolves the version dirs, validates each curated file's frontmatter, size
 * caps and base->surface links, and checks that every curated file is present once the
 * version's directory exists. Returns the known paths so links/relatedPages into guideline
 * files resolve elsewhere in `run()`.
 */
export function lintGuidelines(config: PlatformConfig, wikiRoot: string, report: LintReport): Set<string> {
  const known = new Set<string>();
  if (!config.guidelines?.enabled) return known;
  const curated = config.guidelines.curatedFiles;
  const curatedByFile = new Map(curated.map((f) => [f.file, f]));

  for (const v of config.guidelines.versions) {
    const dir = resolve(wikiRoot, "platform/guidelines", v);
    if (!existsSync(dir)) {
      report.warnings.push(`platform/guidelines/${v}/ does not exist yet — guidelines not built for this version`);
      continue;
    }
    const present = new Map<string, { body: string; size: number }>();
    for (const name of readdirSync(dir).filter((f) => f.endsWith(".md"))) {
      const abs = resolve(dir, name);
      const path = `platform/guidelines/${v}/${name}`;
      const text = readFileSync(abs, "utf8");
      const { frontmatter, body } = parsePage(text);
      const size = Buffer.byteLength(text, "utf8");
      present.set(name, { body, size });
      known.add(path);

      for (const issue of checkFrontmatterShape(text)) report.errors.push(`${path}: ${issue.message}`);

      if (!curatedByFile.has(name)) {
        report.errors.push(`${path}: file name is not in guidelines.curatedFiles`);
        continue;
      }
      for (const issue of validateGuidelineFrontmatter(frontmatter)) report.errors.push(`${path}: ${issue.field} ${issue.message}`);
      if (size > config.sizeLimits.guidelineFileMaxBytes) {
        report.errors.push(`${path}: ${size} bytes exceeds the ${config.sizeLimits.guidelineFileMaxBytes}-byte guideline file cap`);
      }
      // prompts/guideline.md: Index is required only when base is null AND the file has at
      // least one surface — matches validateGuidelineOutput's own gate exactly (guidelines.ts).
      const hasSurfaces = curated.some((f) => f.base === name);
      if (curatedByFile.get(name)?.base === null && hasSurfaces) {
        const firstHeading = h2Headings(body)[0];
        if (firstHeading !== "Index") {
          report.errors.push(`${path}: base file's first ## heading must be "Index" (prompts/guideline.md), got ${firstHeading ? `"${firstHeading}"` : "none"}`);
        }
      }
    }

    for (const entry of curated) {
      if (!present.has(entry.file)) report.errors.push(`platform/guidelines/${v}/${entry.file}: curated guideline file missing`);
    }

    for (const entry of curated) {
      if (!entry.base) continue;
      const surface = present.get(entry.file);
      const base = present.get(entry.base);
      if (!surface || !base) continue; // missing file already reported above
      const pairSize = surface.size + base.size;
      if (pairSize > config.sizeLimits.guidelinePairMaxBytes) {
        report.errors.push(`platform/guidelines/${v}/${entry.base} + ${entry.file}: base+surface pair is ${pairSize} bytes, exceeding the ${config.sizeLimits.guidelinePairMaxBytes}-byte cap`);
      }
    }

    for (const entry of curated) {
      if (entry.base !== null) continue; // only base files carry the surface index
      const base = present.get(entry.file);
      if (!base) continue;
      const linkTargets = new Set(wikiLinkTargets(base.body));
      for (const surface of curated.filter((s) => s.base === entry.file)) {
        if (!present.has(surface.file)) continue; // missing surface already reported above
        const target = `platform/guidelines/${v}/${surface.file}`;
        if (!linkTargets.has(target)) {
          report.errors.push(`platform/guidelines/${v}/${entry.file}: base file does not link its surface file ${target}`);
        }
      }
    }
  }
  return known;
}

/**
 * A `.md` file under `platform/dev/**`/`platform/func/**` with no ingestion state entry at
 * all (neither `knownPaths` — built this run — nor `statePaths`, see `collectStatePaths` in
 * build.ts) is a true orphan and an ERROR — `wiki:build`'s `pruneOrphanArticles` deletes the
 * same set, so this is the backstop for anything that slipped past that (a file added by
 * hand, or a `build` skipped between a removal and a commit). A file whose state entry
 * exists but carries no `builtHash` (a concurrent-run `pages.ts` race can clear one on a
 * perfectly good article) is a WARNING, not an error and never a deletion — see
 * `pruneOrphanArticles`'s doc comment for why deletion must not key on `builtHash`. Every
 * directory's generated `index.md` is excluded.
 */
export function lintOrphanWikiFiles(wikiRoot: string, knownPaths: Set<string>, statePaths: Set<string>, report: LintReport): void {
  for (const area of ["platform/dev", "platform/func"]) {
    for (const abs of walk(resolve(wikiRoot, area))) {
      const rel = relative(wikiRoot, abs).split("\\").join("/");
      if (!rel.endsWith(".md") || basename(rel) === "index.md") continue;
      if (knownPaths.has(rel)) continue;
      if (statePaths.has(rel)) {
        report.warnings.push(`article present, never built (no builtHash): ${rel}`);
        continue;
      }
      report.errors.push(`orphan wiki file with no ingestion state entry: ${rel}`);
    }
  }
}

function lintLinks(wikiRoot: string, knownPaths: Set<string>, report: LintReport): void {
  const files: { path: string; markdown: string }[] = [];
  for (const abs of walk(resolve(wikiRoot, "platform"))) {
    const rel = relative(wikiRoot, abs).split("\\").join("/");
    if (!rel.endsWith(".md")) continue;
    files.push({ path: rel, markdown: readFileSync(abs, "utf8") });
  }
  const { unresolved } = checkLinks(files, knownPaths);
  for (const u of unresolved) report.errors.push(`unresolved link in ${u.source}: ${u.link}`);
}

/** `relatedPages`/`supersedes`/`supersededBy` (design spec, "Page frontmatter") must resolve — an unresolvable cross-link is worse than none. */
function lintCrossLinks(wikiRoot: string, knownPaths: Set<string>, report: LintReport): void {
  for (const path of knownPaths) {
    const abs = resolve(wikiRoot, path);
    if (!existsSync(abs)) continue;
    const { frontmatter } = parsePage(readFileSync(abs, "utf8"));
    for (const target of crossLinkTargets(frontmatter)) {
      if (!knownPaths.has(target)) report.errors.push(`${path}: cross-link path does not resolve: ${target}`);
    }
  }
}

export function lintSynonyms(wikiRoot: string, knownPaths: Set<string>, report: LintReport, config: PlatformConfig): void {
  const single = resolve(wikiRoot, "platform/synonyms.md");
  const partsIndex = resolve(wikiRoot, "platform/synonyms/index.md");
  if (!existsSync(single) && !existsSync(partsIndex)) return;
  const files = existsSync(single) ? [single] : walk(resolve(wikiRoot, "platform/synonyms")).filter((f) => !f.endsWith("index.md"));
  for (const file of files) {
    const text = readFileSync(file, "utf8");
    const size = Buffer.byteLength(text, "utf8");
    if (size > config.sizeLimits.synonymsMaxBytes) {
      const rel = relative(wikiRoot, file).split("\\").join("/");
      report.errors.push(`${rel}: ${size} bytes exceeds the ${config.sizeLimits.synonymsMaxBytes}-byte synonyms file cap`);
    }
    const lines = text.split("\n").filter(isSynonymDataLine);
    for (const line of lines) {
      const parts = line.split(" — ");
      const pathsPart = parts[parts.length - 1] ?? "";
      for (const p of pathsPart.split(",").map((s) => s.trim())) {
        if (p && !knownPaths.has(p)) report.errors.push(`synonyms line path does not resolve: ${p}`);
      }
    }
  }
}

function lintManifest(wikiRoot: string, report: LintReport): void {
  const manifestPath = resolve(wikiRoot, "platform/manifest.json");
  if (!existsSync(manifestPath)) {
    report.errors.push("platform/manifest.json missing");
    return;
  }
  let manifest: { contract?: number; lastBuilt?: string | null; pages?: Record<string, { fileHash: string }>; treeHash?: string };
  try {
    manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  } catch {
    report.errors.push("platform/manifest.json is not valid JSON");
    return;
  }
  if (manifest.contract !== 1) report.errors.push(`manifest.json contract ${manifest.contract} is not the known major (1)`);
  for (const [path, info] of Object.entries(manifest.pages ?? {})) {
    const abs = resolve(wikiRoot, path);
    if (!existsSync(abs)) {
      report.errors.push(`manifest.json lists a page missing on disk: ${path}`);
      continue;
    }
    const actual = sha256(readFileSync(abs));
    if (actual !== info.fileHash) report.errors.push(`manifest.json fileHash mismatch: ${path}`);
  }
  if (manifest.lastBuilt) {
    const days = (Date.now() - new Date(manifest.lastBuilt).getTime()) / 86_400_000;
    if (days > 14) report.warnings.push(`manifest.lastBuilt is ${Math.floor(days)} days old (>14)`);
  }
}

function lintSize(wikiRoot: string, report: LintReport, config: PlatformConfig): void {
  let total = 0;
  for (const file of walk(wikiRoot)) {
    try {
      total += statSync(file).size;
    } catch {
      /* symlink or vanished file, already reported elsewhere */
    }
  }
  if (total > config.sizeLimits.wikiPackageMaxBytes) {
    report.errors.push(`<wiki>/ is ${(total / 1024 / 1024).toFixed(1)} MB, exceeding the ${(config.sizeLimits.wikiPackageMaxBytes / 1024 / 1024).toFixed(0)} MB budget`);
  }
}

function lintGitTrackedCache(report: LintReport): void {
  try {
    const out = execSync("git ls-files -- ingest/platform/.cache", { cwd: resolve(LAYER_DIR, "../.."), encoding: "utf8" }).trim();
    if (out) report.errors.push(`ingest/platform/.cache/ is tracked by git: ${out.split("\n").length} file(s)`);
  } catch {
    // not a git repo, or git unavailable — nothing to check
  }
}

function readIndexLines(indexPath: string): string[] {
  if (!existsSync(indexPath)) return [];
  return readFileSync(indexPath, "utf8")
    .split("\n")
    .filter((l) => l.startsWith("platform/"));
}

function safePromptHash(path: string): string | undefined {
  try {
    return promptHash(path);
  } catch {
    return undefined;
  }
}
