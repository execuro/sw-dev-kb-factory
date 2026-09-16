/**
 * `wiki:build` — Phase 5 (refresh spec). Deterministic, whole-layer: assembles
 * per-directory `index.md` files from page frontmatter, checks links, writes
 * `<wiki>/platform/manifest.json`. Does **not** touch `platform/index.md`'s prose
 * (design spec: that overview is LLM-written once by the hub agent style and only
 * regenerated when the hub list changes — outside this deterministic CLI's job;
 * this build ships the placeholder already committed at `wiki/platform/index.md`).
 */
import { existsSync, readdirSync, readFileSync, rmSync } from "node:fs";
import { basename, relative, resolve } from "node:path";
import { ingestLayerDir, loadPlatformConfig, wikiRootFrom } from "../shared/config.js";
import { loadState, saveState } from "../shared/state.js";
import { writeJson, writeText } from "../shared/jsonio.js";
import { parsePage } from "../shared/frontmatterValidate.js";
import { buildDirectoryIndex, type IndexablePage } from "../shared/indexfiles.js";
import { checkLinks } from "../shared/links.js";
import { cacheDirs, fileSha256, listAllFiles } from "../shared/workitems.js";
import { isSynonymDataLine } from "./synonyms.js";
import { sha256 } from "../shared/hash.js";
import { resolveVendorRoot, resolveCodeIndexContext } from "./codeIndex.js";
import { paths } from "../../src/paths.js";
import type { CliFlags, IngestionState, PlatformConfig } from "../shared/types.js";

/** Every wiki path with an entry in ingestion state (any source's `pages` map), plus every
 *  `sharedFrom` target — deliberately broader than a `builtHash`-gated `knownPaths`: two
 *  concurrent `--ingest` runs can clear a page's `builtHash` (pages.ts:58/270 load-all +
 *  save-all, no lock) without the article on disk ever having been wrong. `pruneOrphanArticles`
 *  must only ever delete a file that has no entry here at all — that's what sync's removal
 *  or a newly-added `exclude` glob actually produces. */
export function collectStatePaths(state: IngestionState): Set<string> {
  const paths = new Set<string>();
  for (const source of Object.values(state.sources)) {
    for (const [path, entry] of Object.entries(source.pages)) {
      paths.add(path);
      if (entry.sharedFrom) paths.add(entry.sharedFrom);
    }
  }
  return paths;
}

/**
 * Deletes a `.md` under `platform/dev/**`/`platform/func/**` only when it is in neither
 * `knownPaths` (built this run, `builtHash` present) nor `statePaths` (any state entry at
 * all, see `collectStatePaths`) — the concurrent-run bug described above means an entry can
 * lose its `builtHash` without the article ever having gone bad, so deletion must never key
 * on `builtHash` alone. A generated `index.md` is never a candidate. Prunes any directory
 * left empty by the deletions (bottom-up, including the area root itself).
 */
export function pruneOrphanArticles(wikiRoot: string, knownPaths: Set<string>, statePaths: Set<string> = new Set()): { removed: string[] } {
  const removed: string[] = [];
  for (const area of ["platform/dev", "platform/func"]) {
    const areaRoot = resolve(wikiRoot, area);
    if (!existsSync(areaRoot)) continue;
    for (const abs of listAllFiles(areaRoot)) {
      const rel = relative(wikiRoot, abs).split("\\").join("/");
      if (!rel.endsWith(".md") || basename(rel) === "index.md") continue;
      if (knownPaths.has(rel) || statePaths.has(rel)) continue;
      rmSync(abs, { force: true });
      removed.push(rel);
    }
    pruneEmptyDirs(areaRoot);
  }
  return { removed };
}

function pruneEmptyDirs(dir: string): void {
  if (!existsSync(dir)) return;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) pruneEmptyDirs(resolve(dir, entry.name));
  }
  if (readdirSync(dir).length === 0) rmSync(dir, { recursive: true, force: true });
}

const LAYER_DIR = ingestLayerDir("platform");

/**
 * `platform/guidelines/<version>/*.md`. A whole-directory scan, not a state-driven diff like `pages.ts`'s pages: guideline files
 * are written straight to the wiki by the `guidelines` phase, and there is no per-version
 * `index.md` to assemble (the base files are the entry points). A missing
 * `platform/guidelines/<version>/` directory yields count 0, not an error — `wiki:build`
 * must still work before the area has been built. `manifest.json` records the file's own
 * hash for both `sourceHash` and `fileHash`, the same precedent `hubs.ts` uses for `hubHash`.
 */
export function collectGuidelinePages(
  wikiRoot: string,
  config: PlatformConfig,
): {
  pages: IndexablePage[];
  counts: Record<string, number>;
  manifestEntries: Record<string, { sourceHash: string; fileHash: string }>;
  filesToScanForLinks: { path: string; markdown: string }[];
} {
  const pages: IndexablePage[] = [];
  const counts: Record<string, number> = {};
  const manifestEntries: Record<string, { sourceHash: string; fileHash: string }> = {};
  const filesToScanForLinks: { path: string; markdown: string }[] = [];
  if (!config.guidelines?.enabled) return { pages, counts, manifestEntries, filesToScanForLinks };

  for (const v of config.guidelines.versions) {
    const dir = resolve(wikiRoot, "platform/guidelines", v);
    let count = 0;
    if (existsSync(dir)) {
      for (const name of readdirSync(dir).filter((f) => f.endsWith(".md")).sort()) {
        const abs = resolve(dir, name);
        const text = readFileSync(abs, "utf8");
        const { frontmatter, body } = parsePage(text);
        const path = `platform/guidelines/${v}/${name}`;
        pages.push({
          path,
          title: String(frontmatter.title ?? path),
          summary: String(frontmatter.summary ?? ""),
          keywords: Array.isArray(frontmatter.keywords) ? (frontmatter.keywords as string[]) : [],
        });
        filesToScanForLinks.push({ path, markdown: body });
        const hash = fileSha256(abs);
        manifestEntries[path] = { sourceHash: hash, fileHash: hash };
        count++;
      }
    }
    counts[`guidelines/${v}`] = count;
  }
  return { pages, counts, manifestEntries, filesToScanForLinks };
}

export async function run(flags: CliFlags): Promise<number> {
  const config = loadPlatformConfig();
  const state = loadState();
  const wikiRoot = wikiRootFrom(flags, config);
  const platformRoot = resolve(wikiRoot, "platform");
  const t0 = Date.now();

  const pagesCounts: Record<string, number> = {};
  let sharedArticles = 0;
  const knownPaths = new Set<string>();
  const filesToScanForLinks: { path: string; markdown: string }[] = [];
  const manifestPages: Record<string, { sourceHash: string; fileHash: string }> = {};
  let indexFiles = 0;
  let failedToLoad = false;

  const devSources = config.sources.filter((s) => s.docType.includes("developer") && s.versions?.some((v) => v.main));
  for (const source of devSources) {
    for (const v of source.versions!.filter((v) => v.active)) {
      const sourceState = state.sources[`${source.id}:${v.version}`];
      const pages: IndexablePage[] = [];
      for (const [path, entry] of Object.entries(sourceState?.pages ?? {})) {
        if (entry.builtHash === undefined) continue;
        const physicalPath = entry.sharedFrom ?? path;
        const abs = resolve(wikiRoot, physicalPath);
        if (!existsSync(abs)) continue;
        const text = readFileSync(abs, "utf8");
        const { frontmatter, body } = parsePage(text);
        pages.push({
          path: physicalPath,
          title: String(frontmatter.title ?? physicalPath),
          summary: String(frontmatter.summary ?? ""),
          keywords: Array.isArray(frontmatter.keywords) ? (frontmatter.keywords as string[]) : [],
        });
        knownPaths.add(physicalPath);
        if (entry.sharedFrom) knownPaths.add(path); // sibling alias resolves to the canonical file
        filesToScanForLinks.push({ path: physicalPath, markdown: body });
        manifestPages[physicalPath] = { sourceHash: entry.hash ?? entry.builtHash ?? "", fileHash: fileSha256(abs) };
        if (entry.sharedFrom) sharedArticles++;
      }
      pagesCounts[`dev/${v.version}`] = pages.length;
      const indexPath = resolve(platformRoot, "dev", v.version, "index.md");
      const content = buildDirectoryIndex(`Developer docs — ${v.version}`, `Shopware developer documentation, version ${v.version}.`, pages, false);
      if (!writeGeneratedFile(indexPath, content, config)) failedToLoad = true;
      else indexFiles++;
    }
  }

  const merchantSource = config.sources.find((s) => s.docType.includes("functional"));
  if (merchantSource) {
    const merchantState = state.sources[merchantSource.id];
    const pages: IndexablePage[] = [];
    for (const [path, entry] of Object.entries(merchantState?.pages ?? {})) {
      if (entry.builtHash === undefined) continue;
      const abs = resolve(wikiRoot, path);
      if (!existsSync(abs)) continue;
      const text = readFileSync(abs, "utf8");
      const { frontmatter, body } = parsePage(text);
      pages.push({
        path,
        title: String(frontmatter.title ?? path),
        summary: String(frontmatter.summary ?? ""),
        keywords: Array.isArray(frontmatter.keywords) ? (frontmatter.keywords as string[]) : [],
        versions: Array.isArray(frontmatter.versions) ? (frontmatter.versions as string[]) : undefined,
      });
      knownPaths.add(path);
      filesToScanForLinks.push({ path, markdown: body });
      manifestPages[path] = { sourceHash: entry.hash ?? entry.builtHash ?? "", fileHash: fileSha256(abs) };
    }
    pagesCounts.func = pages.length;
    const content = buildDirectoryIndex("Merchant docs", "Shopware merchant/user documentation (docs.shopware.com).", pages, true);
    if (!writeGeneratedFile(resolve(platformRoot, "func/index.md"), content, config)) failedToLoad = true;
    else indexFiles++;
  }

  const statePaths = collectStatePaths(state as IngestionState);
  const pruneResult = pruneOrphanArticles(wikiRoot, knownPaths, statePaths);

  const hubPages: IndexablePage[] = [];
  for (const [slug, hub] of Object.entries(state.hubs)) {
    if (hub.hubState !== "ok") continue;
    const path = `platform/hubs/${slug}.md`;
    const abs = resolve(wikiRoot, path);
    if (!existsSync(abs)) continue;
    const text = readFileSync(abs, "utf8");
    const { frontmatter, body } = parsePage(text);
    hubPages.push({
      path,
      title: String(frontmatter.title ?? slug),
      summary: String(frontmatter.summary ?? ""),
      keywords: Array.isArray(frontmatter.keywords) ? (frontmatter.keywords as string[]) : [],
    });
    knownPaths.add(path);
    filesToScanForLinks.push({ path, markdown: body });
    manifestPages[path] = { sourceHash: hub.hubHash ?? "", fileHash: fileSha256(abs) };
  }
  const hubContent = buildDirectoryIndex("Hubs", "Topic overviews linking related developer and merchant articles.", hubPages, false);
  if (!writeGeneratedFile(resolve(platformRoot, "hubs/index.md"), hubContent, config)) failedToLoad = true;
  else indexFiles++;

  const guidelines = collectGuidelinePages(wikiRoot, config);
  for (const p of guidelines.pages) knownPaths.add(p.path);
  filesToScanForLinks.push(...guidelines.filesToScanForLinks);
  Object.assign(manifestPages, guidelines.manifestEntries);

  filesToScanForLinks.push(...synonymsFilesToScan(platformRoot));

  const linkCheck = checkLinks(filesToScanForLinks, knownPaths);

  const treeHashInput = Object.entries(manifestPages)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([p, v]) => `${p}:${v.fileHash}`)
    .join("\n");
  const treeHash = sha256(treeHashInput);
  const lastBuilt = new Date().toISOString().slice(0, 10);
  const totalPages = Object.values(pagesCounts).reduce((a, b) => a + b, 0);

  // codeCheck's coreVersion/vendorHash (design doc "State, dedupe, build, lint") — only
  // written when a code root is actually available (vendor or a synced checkout,
  // codeIndex.ts's `codeRootFor`), mirroring pages.ts's own fail-hard-only-when-enabled
  // behaviour: build never fails just because no code root resolves.
  let codeCheckFields: { coreVersion?: string; vendorHash?: string } = {};
  const primaryVersion = config.guidelines?.versions?.[0];
  if (config.codeCheck?.enabled && primaryVersion) {
    const projectRoot = resolveVendorRoot(config) ?? paths.shopwareSourceRoot(primaryVersion);
    const ctx = resolveCodeIndexContext(primaryVersion, config, projectRoot, resolve(cacheDirs(LAYER_DIR).root, "code"));
    if (ctx) codeCheckFields = { coreVersion: ctx.index.coreVersion, vendorHash: ctx.index.vendorHash };
  }

  const manifest = {
    contract: 1,
    versions: devSources.flatMap((s) => (s.versions ?? []).filter((v) => v.active).map((v) => v.version)),
    lastBuilt,
    counts: { pages: totalPages, hubs: hubPages.length, ...pagesCounts, ...guidelines.counts },
    pages: manifestPages,
    hubs: hubPages.map((h) => h.path.replace(/^platform\/hubs\//, "").replace(/\.md$/, "")),
    treeHash,
    ...codeCheckFields,
  };
  writeJson(resolve(platformRoot, "manifest.json"), manifest);

  (state as IngestionState).build.lastBuilt = lastBuilt;
  saveState(state);

  const coldStartMs = Date.now() - t0; // approximates the tree+frontmatter preload this build just did; not a measurement of the actual server process.

  process.stdout.write(
    JSON.stringify({
      cmd: "build",
      pages: { ...pagesCounts, total: totalPages },
      guidelines: guidelines.counts,
      sharedArticles,
      hubs: hubPages.length,
      indexFiles,
      removedArticles: pruneResult.removed.length,
      links: { total: linkCheck.total, unresolved: linkCheck.unresolved.length },
      synonymsLines: countSynonymsLines(platformRoot),
      coldStartMs,
    }) + "\n",
  );
  if (linkCheck.unresolved.length > 0) {
    for (const u of linkCheck.unresolved) process.stderr.write(`wiki:build: unresolved link in ${u.source}: ${u.link}\n`);
  }
  return failedToLoad ? 1 : 0;
}

/** Both synonyms forms (Phase 5 "Large-file splitting" / lint.ts's `lintSynonyms`): the
 *  single `platform/synonyms.md`, or the split `platform/synonyms/index.md` + `part-*.md`.
 *  Exactly one form exists at a time (`writeSynonymsOutput` in synonyms.ts always removes
 *  the other). */
export function synonymsFilesToScan(platformRoot: string): { path: string; markdown: string }[] {
  const single = resolve(platformRoot, "synonyms.md");
  if (existsSync(single)) return [{ path: "platform/synonyms.md", markdown: readFileSync(single, "utf8") }];
  const dir = resolve(platformRoot, "synonyms");
  if (!existsSync(dir)) return [];
  return listAllFiles(dir).map((f) => ({ path: `platform/synonyms/${basename(f)}`, markdown: readFileSync(f, "utf8") }));
}

export function countSynonymsLines(platformRoot: string): number {
  return synonymsFilesToScan(platformRoot)
    .filter((f) => f.path !== "platform/synonyms/index.md")
    .reduce((n, f) => n + f.markdown.split("\n").filter(isSynonymDataLine).length, 0);
}

/** Phase 5 "Large-file splitting" hard constraint: no generated file may exceed 512 KB. */
function writeGeneratedFile(path: string, content: string, config: PlatformConfig): boolean {
  const bytes = Buffer.byteLength(content, "utf8");
  if (bytes > config.sizeLimits.generatedFileMaxBytes) {
    process.stderr.write(
      `wiki:build: ${path} would be ${bytes} bytes, exceeding the ${config.sizeLimits.generatedFileMaxBytes}-byte cap — split the source-directory mapping in ingest/platform/config.json\n`,
    );
    return false;
  }
  writeText(path, content);
  return true;
}
