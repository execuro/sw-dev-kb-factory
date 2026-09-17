/**
 * `wiki:guidelines` — curated `platform/guidelines/<version>/<file>` synthesis.
 * Modelled on `hubs.ts`'s
 * "many inputs -> one synthesized output" shape, not `pages.ts`'s 1:1 shape: each curated
 * file's `sourceInputs` are resolved from three schemes (`docs:`, `wiki:`, `code:`) into
 * cached/on-disk text, hashed, and handed to a writer wave; `--ingest` validates the result
 * with `validateGuidelineFrontmatter`, a guideline-shaped adaptation of `pages.ts`'s
 * `## Code check` gate, and the per-file size cap.
 */
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { loadPlatformConfig, wikiRootFrom } from "../shared/config.js";
import { paths, type Paths } from "../../src/paths.js";
import { loadState, saveState } from "../shared/state.js";
import { cacheDirs, fileSha256, fileSize, ingestBatches, reportIngestOutcome, listAllFiles, pendingItemPaths, promptHash, writeBatches } from "../shared/workitems.js";
import { parsePage, validateGuidelineFrontmatter, h2Headings, h2HeadingLines, checkFrontmatterShape } from "../shared/frontmatterValidate.js";
import { checkOutputHygiene, checkLeakedLocalState, checkPurity } from "../shared/hygiene.js";
import { wikiLinkTargets } from "../shared/links.js";
import { matchesAny } from "../shared/glob.js";
import { sha256 } from "../shared/hash.js";
import { slugify, isExpertTagLine, firstBodyLineIndex } from "../../src/wiki/fs.js";
import { extractExpertSections, expertBytes, spliceExpertSections, EXPERT_TAG_LINE } from "../shared/expertSections.js";
import { citationCandidates, containsWord } from "./pages.js";
import {
  checkoutRootFor,
  codeRootFor,
  resolveVendorRoot,
  flagCount,
  flagIdentifiers,
  loadOrBuildCodeIndex,
  loadOrBuildCodeIndexForCheckout,
  type CodeIndex,
  type CodeRoot,
  type FlagResult,
} from "./codeIndex.js";
import { devSourcePath, layerDir } from "./pagePrep.js";
import { loadSourceState } from "../shared/state.js";
import type { CliFlags, GuidelineCuratedFile, GuidelineSources, GuidelineStateEntry, IngestionState, PlatformConfig, WorkItem } from "../shared/types.js";

const LAYER_DIR = layerDir();
const PROMPT_PATH = resolve(LAYER_DIR, "prompts/guideline.md");

export async function run(flags: CliFlags): Promise<number> {
  const config = loadPlatformConfig();
  if (!config.guidelines?.enabled) {
    process.stderr.write("wiki:guidelines: guidelines.enabled is false, skipping\n");
    return 0;
  }
  const state = loadState();

  if (flags.restampCodeHash) return runRestampCodeHash(config, state, flags);
  if (flags.ingest) return runIngest(config, state, flags);
  if (flags.retryFailed) return runPrepare(config, state, flags, true);
  if (flags.prepare) return runPrepare(config, state, flags, false);
  process.stderr.write("wiki:guidelines: one of --prepare, --ingest, --retry-failed, --restamp-code-hash is required\n");
  return 1;
}

/**
 * `wiki:guidelines --restamp-code-hash` (pages.ts's `restampPages`/`runRestampCodeHash`
 * mirror, extended to guidelines): re-stamps every guideline
 * file's stored `codeVersion` to the currently-resolved one for its version, without
 * preparing or rewriting a single guideline. Keyed per `version` (not one global code
 * hash like pages.ts) because `resolveGuidelineCodeContext` resolves a code root per
 * curated file's version, and 6.6/6.7 can each move independently.
 */
export function restampGuidelines(state: IngestionState, codeVersionByVersion: Record<string, string>): { restamped: number; refused: number; moved: string[] } {
  let restamped = 0;
  let refused = 0;
  const moved: string[] = [];
  for (const [key, entry] of Object.entries(state.guidelines.files)) {
    if (!entry.codeVersion) continue;
    const codeVersion = codeVersionByVersion[entry.version];
    if (!codeVersion || entry.codeVersion === codeVersion) continue;
    if (entry.codeVersion.split("+")[0] !== codeVersion.split("+")[0]) {
      refused++;
      if (moved.length < 5) moved.push(`${key} (${entry.codeVersion} -> ${codeVersion})`);
      continue;
    }
    entry.codeVersion = codeVersion;
    restamped++;
  }
  return { restamped, refused, moved };
}

function runRestampCodeHash(config: PlatformConfig, state: IngestionState, flags: CliFlags): number {
  const guidelinesCfg = config.guidelines!;
  const codeCacheDir = resolve(cacheDirs(LAYER_DIR).root, "code");
  const projectRoot = resolveVendorRoot(config) ?? paths.shopwareSourceRoot(guidelinesCfg.versions[0]);
  const versions = flags.version ? [flags.version] : guidelinesCfg.versions;

  const codeVersionByVersion: Record<string, string> = {};
  for (const version of versions) {
    const ctx = resolveGuidelineCodeContext(version, config, projectRoot, codeCacheDir);
    if (ctx) codeVersionByVersion[version] = ctx.root.codeVersion;
  }
  if (Object.keys(codeVersionByVersion).length === 0) {
    process.stderr.write("wiki:guidelines: --restamp-code-hash needs a resolvable code root for at least one version (run `npm run setup`)\n");
    return 1;
  }

  const { restamped, refused, moved } = restampGuidelines(state, codeVersionByVersion);
  if (refused > 0) {
    process.stderr.write(
      `wiki:guidelines: refusing to restamp ${refused} file(s) whose coreVersion changed — those need a real re-check:\n` +
        moved.map((m) => `    ${m}\n`).join(""),
    );
  }
  if (restamped > 0) saveState(state);
  process.stdout.write(JSON.stringify({ cmd: "guidelines", mode: "restamp-code-hash", restamped, refused }) + "\n");
  return refused > 0 ? 1 : 0;
}

// --------------------------------------------------------------------------------
// sourceInputs resolution (docs:, merchant:, wiki:, code:)
// --------------------------------------------------------------------------------

type InputScheme = "docs" | "merchant" | "wiki" | "code";

export interface ResolvedInput {
  scheme: InputScheme;
  readPath: string;
  url: string;
  hash: string;
}

export type PackageRoots = Record<"core" | "storefront" | "administration", string>;

export function parseSourceInput(input: string): { scheme: InputScheme; spec: string } | undefined {
  const m = /^(docs|merchant|wiki|code):(.+)$/.exec(input);
  if (!m) return undefined;
  return { scheme: m[1] as InputScheme, spec: m[2] };
}

function hasGlob(spec: string): boolean {
  return spec.includes("*");
}

/** Recursively lists files under `root`, relative to `root`, posix-separated. */
function walkRel(root: string, dir = ""): string[] {
  const abs = resolve(root, dir);
  let entries: import("node:fs").Dirent[];
  try {
    entries = readdirSync(abs, { withFileTypes: true });
  } catch {
    return [];
  }
  const out: string[] = [];
  for (const entry of entries) {
    const rel = dir ? `${dir}/${entry.name}` : entry.name;
    if (entry.isDirectory()) out.push(...walkRel(root, rel));
    else if (entry.isFile()) out.push(rel);
  }
  return out;
}

/** Resolves `spec` (exact key or glob, over keys with `keyPrefix` stripped) against one synced
 *  source's state: every fetched page whose cached text exists (one download serves dev pages
 *  and guidelines alike). */
function resolveFromSourceState(scheme: "docs" | "merchant", sourceKey: string, keyPrefix: string, spec: string): ResolvedInput[] {
  const pages = loadSourceState(sourceKey)?.pages ?? {};
  const out: ResolvedInput[] = [];
  for (const [key, entry] of Object.entries(pages)) {
    if (!key.startsWith(keyPrefix) || !entry.hash) continue;
    const rel = key.slice(keyPrefix.length);
    if (hasGlob(spec) ? !matchesAny(rel, [spec]) : rel !== spec) continue;
    const readPath = devSourcePath(sourceKey, entry.hash);
    if (!existsSync(readPath)) {
      process.stderr.write(`wiki:guidelines: ${sourceKey} ${key}: cached source text missing — run wiki:sync\n`);
      continue;
    }
    out.push({ scheme, readPath, url: entry.sourceUrl ?? key, hash: entry.hash });
  }
  return out.sort((a, b) => a.url.localeCompare(b.url));
}

/** `docs:<repoPath>` — any shopware/docs path of `version`'s `developer` download
 *  (`index.md` is keyed as `_index.md`, as sync stores it). */
export function resolveDocsInput(version: string, spec: string): ResolvedInput[] {
  return resolveFromSourceState("docs", `developer:${version}`, `platform/dev/${version}/`, spec.replace(/(^|\/)index\.md$/, "$1_index.md"));
}

/** `merchant:<platform/func path>` — a page of the unversioned `merchant` download.
 *  `sourceKey` defaults to `merchant` (the production source); tests pass a fake key to avoid
 *  touching the real tracked state/cache. */
export function resolveMerchantInput(spec: string, sourceKey = "merchant"): ResolvedInput[] {
  return resolveFromSourceState("merchant", sourceKey, "", spec);
}

/** `wiki:<path>` — wiki-root-relative, `{v}` substituted with `version`, globs allowed. */
export function resolveWikiInput(wikiRoot: string, version: string, spec: string): ResolvedInput[] {
  const path = spec.replace(/\{v\}/g, version);
  if (hasGlob(path)) {
    return walkRel(wikiRoot)
      .filter((p) => matchesAny(p, [path]))
      .sort()
      .map((p) => ({ scheme: "wiki" as const, readPath: resolve(wikiRoot, p), url: p, hash: fileSha256(resolve(wikiRoot, p)) }));
  }
  const abs = resolve(wikiRoot, path);
  return existsSync(abs) ? [{ scheme: "wiki" as const, readPath: abs, url: path, hash: fileSha256(abs) }] : [];
}

/** `code:<package>/<path>` — package in core|storefront|administration, path relative to the
 *  package's own composer/checkout root (`packageRoots`), globs allowed. */
export function resolveCodeInput(packageRoots: PackageRoots, spec: string): ResolvedInput[] {
  const slash = spec.indexOf("/");
  const pkg = (slash === -1 ? spec : spec.slice(0, slash)) as keyof PackageRoots;
  const rest = slash === -1 ? "" : spec.slice(slash + 1);
  const root = packageRoots[pkg];
  if (!root) return [];
  if (!rest || hasGlob(rest)) {
    const pattern = rest || "**";
    return walkRel(root)
      .filter((p) => matchesAny(p, [pattern]))
      .sort()
      .map((p) => ({ scheme: "code" as const, readPath: resolve(root, p), url: `code:${pkg}/${p}`, hash: fileSha256(resolve(root, p)) }));
  }
  const abs = resolve(root, rest);
  return existsSync(abs) ? [{ scheme: "code" as const, readPath: abs, url: `code:${pkg}/${rest}`, hash: fileSha256(abs) }] : [];
}

interface PatternGroup {
  raw: string;
  parsed: { scheme: InputScheme; spec: string } | undefined;
  resolved: ResolvedInput[];
}

/** Resolves every raw `sourceInputs` entry independently, keeping each pattern's own resolved
 *  file set apart from the others — the unit `resolveSourceInputs`' flat view and
 *  `computeCompactSources`'s one-entry-per-pattern view both derive from. */
function resolvePatternGroups(sourceInputs: string[], version: string, wikiRoot: string, packageRoots: PackageRoots): PatternGroup[] {
  return sourceInputs.map((raw) => {
    const parsed = parseSourceInput(raw);
    if (!parsed) return { raw, parsed, resolved: [] };
    const resolved =
      parsed.scheme === "docs"
        ? resolveDocsInput(version, parsed.spec)
        : parsed.scheme === "merchant"
          ? resolveMerchantInput(parsed.spec)
          : parsed.scheme === "wiki"
            ? resolveWikiInput(wikiRoot, version, parsed.spec)
            : resolveCodeInput(packageRoots, parsed.spec);
    return { raw, parsed, resolved };
  });
}

export function resolveSourceInputs(
  sourceInputs: string[],
  version: string,
  wikiRoot: string,
  packageRoots: PackageRoots,
): { resolved: ResolvedInput[]; missing: string[] } {
  const resolved: ResolvedInput[] = [];
  const missing: string[] = [];
  for (const g of resolvePatternGroups(sourceInputs, version, wikiRoot, packageRoots)) {
    if (g.resolved.length === 0) missing.push(g.raw);
    else resolved.push(...g.resolved);
  }
  return { resolved, missing };
}

/** sha256 over the sorted `url:hash` of every resolved input — order-independent. */
export function computeInputsHash(resolved: ResolvedInput[]): string {
  return sha256([...resolved.map((r) => `${r.url}:${r.hash}`)].sort().join("\n"));
}

/** The `sourceInputs` list actually in effect for `version`: `cf.sourceInputsByVersion[version]`
 *  verbatim when present, `cf.sourceInputs` otherwise (config.json, GuidelineCuratedFile —
 *  needed where a major keys the same material under different upstream paths, or its pinned
 *  checkout lacks a `code:` input entirely). */
export function curatedFileSourceInputs(cf: GuidelineCuratedFile, version: string): string[] {
  return cf.sourceInputsByVersion?.[version] ?? cf.sourceInputs;
}

/**
 * Compact `sources[]`: one entry per curated
 * `sourceInputs` pattern that resolved at least one file, not one per resolved file — a
 * glob like `code:administration/.../**` collapses to a single entry. `url` is the
 * pattern's own canonical URL (`docs:` — the resolved developer.shopware.com page URL;
 * `wiki:`/`code:` — the pattern string itself, `{v}` substituted); `hash` is the sha256 of
 * the pattern's resolved file hashes, sorted. A pattern that resolved nothing is omitted
 * here (it surfaces in `resolveSourceInputs`'s `missing` instead).
 */
export function computeCompactSources(sourceInputs: string[], version: string, wikiRoot: string, packageRoots: PackageRoots): GuidelineSources {
  const out: GuidelineSources = [];
  for (const g of resolvePatternGroups(sourceInputs, version, wikiRoot, packageRoots)) {
    if (!g.parsed || g.resolved.length === 0) continue;
    const hash = sha256([...g.resolved.map((r) => r.hash)].sort().join("\n"));
    const substituted = g.parsed.spec.replace(/\{v\}/g, version);
    const url =
      g.parsed.scheme === "docs" || g.parsed.scheme === "merchant"
        ? [...g.resolved].sort((a, b) => a.url.localeCompare(b.url))[0].url
        : g.parsed.scheme === "wiki"
          ? substituted
          : `code:${substituted}`;
    out.push({ url, hash });
  }
  return out;
}

export function isGuidelineDirty(
  stateEntry: GuidelineStateEntry | undefined,
  inputsHash: string,
  guidelinePromptHash: string,
  codeVersion: string,
  outputExists: boolean,
): boolean {
  if (!stateEntry || !outputExists) return true;
  return (
    stateEntry.inputsHash !== inputsHash ||
    stateEntry.guidelinePromptHash !== guidelinePromptHash ||
    stateEntry.codeVersion !== codeVersion
  );
}

// --------------------------------------------------------------------------------
// code root resolution (vendor / 6.6 checkout) + guideline-specific package roots
// --------------------------------------------------------------------------------

export interface GuidelineCodeContext {
  root: CodeRoot;
  index: CodeIndex;
  /** `vendor/shopware/<package>/` (vendor mode) or the checkout's `src/<Package>` dir
   *  (checkout mode) — the composer/checkout package root a `code:` sourceInput is relative
   *  to. Distinct from `root.packageRoots`, which points at the narrower dirs the code
   *  index/citation gate scan (e.g. administration's `Resources/app/administration/src`). */
  packageRoots: PackageRoots;
}

/** `codeRootFor` resolves which mode backs `version`; this loads the matching `CodeIndex`
 *  object too (needed for `flagIdentifiers` at prepare time) and the guideline package
 *  roots `code:` sourceInputs resolve against. `null` when `version` has no code root yet
 *  (installed major mismatch and no synced checkout — the operator must run `wiki:sync`). */
export function resolveGuidelineCodeContext(version: string, config: PlatformConfig, projectRoot: string, codeCacheDir: string, p: Paths = paths): GuidelineCodeContext | null {
  const root = codeRootFor(version, config, projectRoot, codeCacheDir, p);
  if (!root) return null;
  if (root.mode === "vendor") {
    return {
      root,
      index: loadOrBuildCodeIndex(projectRoot, codeCacheDir),
      packageRoots: {
        core: resolve(projectRoot, "vendor/shopware/core"),
        storefront: resolve(projectRoot, "vendor/shopware/storefront"),
        administration: resolve(projectRoot, "vendor/shopware/administration"),
      },
    };
  }
  const checkoutRoot = checkoutRootFor(version, codeCacheDir, p);
  if (!checkoutRoot) return null;
  const tag = readFileSync(resolve(checkoutRoot, ".tag"), "utf8").trim();
  return {
    root,
    index: loadOrBuildCodeIndexForCheckout(checkoutRoot, tag, codeCacheDir),
    packageRoots: {
      core: resolve(checkoutRoot, "src/Core"),
      storefront: resolve(checkoutRoot, "src/Storefront"),
      administration: resolve(checkoutRoot, "src/Administration"),
    },
  };
}

// --------------------------------------------------------------------------------
// work item
// --------------------------------------------------------------------------------

export interface GuidelineWorkItem extends WorkItem {
  version: string;
  file: string;
  base: string | null;
  scope: string;
  wikiPath: string;
  sourceInputs: ResolvedInput[];
  missingInputs: string[];
  codeRoot: { mode: "vendor" | "checkout"; packageRoots: PackageRoots; codeVersion: string };
  surfaceFiles?: { file: string; wikiPath: string; scope: string }[];
  codeCheck: { flags: FlagResult };
  /** Expert-owned sections of the existing wiki file (`> [expert]` tag, ingest/shared/expertSections.ts):
   *  the writer must not write these anchors; `--ingest` splices them back in verbatim. */
  expert?: { anchors: string[]; bytes: number };
  /** Bytes the writer's own output may take: the file cap and the base+surface pair cap (minus
   *  the partner file already on disk), minus `expert.bytes`. Advisory for the writer; the hard
   *  caps at ingest and lint count the spliced file. */
  sizeBudget?: number;
  frontmatter?: { id: string; docType: "guideline"; version: string; sources: GuidelineSources; codeVersion: string };
}

function guidelineOutDir(version: string): string {
  return resolve(cacheDirs(LAYER_DIR).outDir, "guidelines", version);
}

function guidelineStateKey(version: string, file: string): string {
  return `${version}/${file}`;
}

// --------------------------------------------------------------------------------
// prepare
// --------------------------------------------------------------------------------

function runPrepare(config: PlatformConfig, state: IngestionState, flags: CliFlags, retry: boolean): number {
  const guidelinesCfg = config.guidelines!;
  const wikiRoot = wikiRootFrom(flags, config);
  const currentPromptHash = promptHash(PROMPT_PATH);
  const codeCacheDir = resolve(cacheDirs(LAYER_DIR).root, "code");
  // A candidate vendor-mode root, not a hard requirement: when no version's `vendor/` actually
  // resolves (a bare `.sources/` checkout clone, `vendorPresent` false for every version),
  // `resolveGuidelineCodeContext`'s per-version `codeRootFor` still finds a synced checkout
  // below and only that one version is skipped by `skipWholeVersion` — this must never hard-fail
  // the whole command the way an unconditional vendor gate used to.
  const projectRoot = resolveVendorRoot(config) ?? paths.shopwareSourceRoot(guidelinesCfg.versions[0]);

  const versions = flags.version ? [flags.version] : guidelinesCfg.versions;
  const items: GuidelineWorkItem[] = [];
  const skipped: string[] = [];
  const failedKeys: string[] = [];

  const skipWholeVersion = (version: string, reason: string) => {
    process.stderr.write(`wiki:guidelines: ${version}: ${reason} — skipping the whole version, run wiki:sync\n`);
    for (const cf of guidelinesCfg.curatedFiles) {
      const key = guidelineStateKey(version, cf.file);
      state.guidelines.files[key] = { ...state.guidelines.files[key], version, file: cf.file, guidelineState: "skipped" };
      skipped.push(key);
    }
  };

  for (const version of versions) {
    const ctx = resolveGuidelineCodeContext(version, config, projectRoot, codeCacheDir);
    if (!ctx) {
      skipWholeVersion(version, `no code root yet (not the installed major, and no synced checkout under ingest/platform/.cache/code/${version}/)`);
      continue;
    }

    // Resolve every curated file's sourceInputs once, up front: when any one curated file of
    // this version still has a sync-pending input, the whole
    // version is skipped for this run, so `wiki:lint` never sees a half-built version directory
    // (some files built against today's sources, others still missing tomorrow's sync).
    const perFile = guidelinesCfg.curatedFiles.map((cf) => ({ cf, ...resolveSourceInputs(curatedFileSourceInputs(cf, version), version, wikiRoot, ctx.packageRoots) }));
    const versionSyncPending = perFile.some(({ missing }) => missing.some((m) => isSyncPendingMissingInput(m, version, codeCacheDir, ctx.root.mode)));
    if (versionSyncPending) {
      skipWholeVersion(version, "at least one curated file has a sync-pending sourceInput");
      continue;
    }

    for (const { cf, resolved, missing } of perFile) {
      const { item, skippedKey, failedKey } = prepareOneItem(
        guidelinesCfg,
        version,
        cf,
        ctx,
        resolved,
        missing,
        wikiRoot,
        state,
        currentPromptHash,
        retry,
        flags.all === true,
        codeCacheDir,
        config.sizeLimits,
      );
      if (item) items.push(item);
      if (skippedKey) skipped.push(skippedKey);
      if (failedKey) failedKeys.push(failedKey);
    }
  }

  const files = writeBatches(LAYER_DIR, "guidelines", items, PROMPT_PATH, 1, undefined, { reset: flags.resetBatches });
  saveState(state);
  process.stdout.write(
    JSON.stringify({ cmd: "guidelines", mode: "prepare", ...(retry ? { retry: true } : {}), batches: files.length, items: items.length, files, skipped, failed: failedKeys }) + "\n",
  );
  return 0;
}

/** Whether an unresolved raw `sourceInputs` entry is sync-pending — its wiki:sync step just
 *  hasn't run yet — rather than a genuine config/content error. `docs:`/`merchant:` inputs are
 *  pending only while their source (`developer:<version>` / `merchant`) has never synced; once
 *  it has, a missing path is a real config error. `code:` inputs are sync-pending only in
 *  checkout mode (6.6, no `.cache/code/<v>/.tag` yet) — in vendor mode (6.7) the code root
 *  already exists (`resolveGuidelineCodeContext` guarantees it), so a missing `code:` input
 *  there is a real curated-file/glob mismatch, not something `wiki:sync` will ever fix; it
 *  must fail, not skip. `wiki:` inputs are never sync-pending (their phase already ran).
 *  `merchantSourceKey` defaults to `merchant` (the production source); tests pass a fake key to
 *  avoid touching the real tracked state/cache. */
export function isSyncPendingMissingInput(
  raw: string,
  version: string,
  codeCacheDir: string,
  codeRootMode: "vendor" | "checkout",
  merchantSourceKey = "merchant",
): boolean {
  if (raw.startsWith("docs:")) return !loadSourceState(`developer:${version}`)?.lastSync;
  if (raw.startsWith("merchant:")) return !loadSourceState(merchantSourceKey)?.lastSync;
  if (raw.startsWith("code:")) return codeRootMode === "checkout" && !existsSync(resolve(codeCacheDir, version, ".tag"));
  return false;
}

/** Source text `flagIdentifiers` runs against — `docs:` inputs only:
 *  `wiki:` pages are already code-checked by `pages.ts`, and `code:` inputs are the installed
 *  code itself, not a claim about it. */
export function docsOnlySourceText(resolved: ResolvedInput[]): string {
  return resolved
    .filter((r) => r.scheme === "docs")
    .map((r) => {
      try {
        return readFileSync(r.readPath, "utf8");
      } catch {
        return "";
      }
    })
    .join("\n\n");
}

export function prepareOneItem(
  guidelinesCfg: NonNullable<PlatformConfig["guidelines"]>,
  version: string,
  cf: GuidelineCuratedFile,
  ctx: GuidelineCodeContext,
  resolved: ResolvedInput[],
  missing: string[],
  wikiRoot: string,
  state: IngestionState,
  currentPromptHash: string,
  retry: boolean,
  all: boolean,
  codeCacheDir: string,
  sizeLimits?: Pick<PlatformConfig["sizeLimits"], "guidelineFileMaxBytes" | "guidelinePairMaxBytes">,
): { item?: GuidelineWorkItem; skippedKey?: string; failedKey?: string } {
  const key = guidelineStateKey(version, cf.file);
  const stateEntry = state.guidelines.files[key];
  const inputsHash = computeInputsHash(resolved);
  const wikiPath = `platform/guidelines/${version}/${cf.file}`;
  const outputExists = existsSync(resolve(wikiRoot, wikiPath));
  const recordState = (guidelineState: "skipped" | "failed") => {
    state.guidelines.files[key] = { ...stateEntry, version, file: cf.file, inputsHash, guidelinePromptHash: currentPromptHash, codeVersion: ctx.root.codeVersion, guidelineState };
  };

  // Any unresolved pattern fails the item unless every unresolved one is sync-pending (its
  // source has never synced) — a genuine config/content mismatch (a curated-file path that
  // doesn't exist for this version) must never silently build a partial file (this task).
  if (missing.length > 0) {
    const skipped = missing.every((m) => isSyncPendingMissingInput(m, version, codeCacheDir, ctx.root.mode));
    recordState(skipped ? "skipped" : "failed");
    if (skipped) {
      process.stderr.write(`wiki:guidelines: ${key}: sync-pending (${missing.join(", ")}) — skipped, run wiki:sync\n`);
      return { skippedKey: key };
    }
    process.stderr.write(`wiki:guidelines: ${key}: unresolved sourceInputs, no wiki:sync will fix this — ${missing.join(", ")} — failed\n`);
    return { failedKey: key };
  }

  if (resolved.length === 0) {
    recordState("failed");
    process.stderr.write(`wiki:guidelines: ${key}: zero sourceInputs resolved (${curatedFileSourceInputs(cf, version).join(", ")}) — failed\n`);
    return { failedKey: key };
  }

  // An item already `failed` with unchanged inputs/prompt/codeVersion is left out of a
  // plain `--prepare` (same shape as pages.ts/hubs.ts) — `--retry-failed`/`--all`
  // re-includes it. Checked ahead of `isGuidelineDirty` because that function alone would
  // never stop looping: a failed item has no built output, and "output missing" is always dirty.
  const isFailed = stateEntry?.guidelineState === "failed";
  const unchangedSinceFailure = stateEntry?.inputsHash === inputsHash && stateEntry?.guidelinePromptHash === currentPromptHash && stateEntry?.codeVersion === ctx.root.codeVersion;
  if (isFailed && unchangedSinceFailure && !retry && !all) return {};

  const dirty = isGuidelineDirty(stateEntry, inputsHash, currentPromptHash, ctx.root.codeVersion, outputExists);
  const needsWork = retry ? isFailed : all || dirty;
  if (!needsWork) return {};

  const surfaceFiles =
    cf.base === null
      ? guidelinesCfg.curatedFiles.filter((f) => f.base === cf.file).map((f) => ({ file: f.file, wikiPath: `platform/guidelines/${version}/${f.file}`, scope: f.scope }))
      : undefined;

  // More Tier-0 flags than `## Code check` may list can never pass the gate — fail up front.
  const flags = flagIdentifiers(docsOnlySourceText(resolved), ctx.index);
  if (flagCount(flags) > MAX_CODE_CHECK_LINES) {
    recordState("failed");
    process.stderr.write(`wiki:guidelines: ${key}: ${flagCount(flags)} Tier-0 flags, more than ${MAX_CODE_CHECK_LINES} — failed at prepare\n`);
    return { failedKey: key };
  }

  const sources = computeCompactSources(curatedFileSourceInputs(cf, version), version, wikiRoot, ctx.packageRoots);

  const expertSections = outputExists ? extractExpertSections(readFileSync(resolve(wikiRoot, wikiPath), "utf8")) : [];
  const expert = { anchors: expertSections.map((s) => s.anchor), bytes: expertBytes(expertSections) };
  const sizeBudget = sizeLimits ? guidelineSizeBudget(sizeLimits, guidelinesCfg, version, cf, wikiRoot, expert.bytes) : undefined;

  return {
    item: {
      path: wikiPath,
      version,
      file: cf.file,
      base: cf.base,
      scope: cf.scope,
      wikiPath,
      outputPath: resolve(guidelineOutDir(version), cf.file),
      sourceInputs: resolved,
      missingInputs: missing,
      codeRoot: { mode: ctx.root.mode, packageRoots: ctx.root.packageRoots, codeVersion: ctx.root.codeVersion },
      surfaceFiles,
      codeCheck: { flags },
      expert,
      ...(sizeBudget !== undefined ? { sizeBudget } : {}),
      frontmatter: {
        id: wikiPath,
        docType: "guideline",
        version,
        sources,
        codeVersion: ctx.root.codeVersion,
      },
    },
  };
}

/**
 * Advisory byte budget for the writer's own output of `cf`: the smaller of the file cap and the
 * pair cap minus the partner file(s) already on disk (a surface's base; a base's largest
 * surface), minus the bytes its expert sections will take once spliced back in. Never negative.
 */
export function guidelineSizeBudget(
  sizeLimits: Pick<PlatformConfig["sizeLimits"], "guidelineFileMaxBytes" | "guidelinePairMaxBytes">,
  guidelinesCfg: NonNullable<PlatformConfig["guidelines"]>,
  version: string,
  cf: GuidelineCuratedFile,
  wikiRoot: string,
  expertBytesTotal: number,
): number {
  const sizeOf = (file: string): number => {
    const abs = resolve(wikiRoot, "platform/guidelines", version, file);
    return existsSync(abs) ? fileSize(abs) : 0;
  };
  const partners = cf.base === null ? guidelinesCfg.curatedFiles.filter((f) => f.base === cf.file).map((f) => f.file) : [cf.base];
  const partner = partners.reduce((max, f) => Math.max(max, sizeOf(f)), 0);
  const budget = Math.min(sizeLimits.guidelineFileMaxBytes, sizeLimits.guidelinePairMaxBytes - partner) - expertBytesTotal;
  return Math.max(0, budget);
}

/**
 * The `--ingest` gate for one guideline output: the expert sections of the existing wiki file
 * are spliced into the staged output first (workitems.ts moves the staged file only after this
 * returns ok), then `validateGuidelineOutput` runs on the result, so every cap counts the
 * expert bytes. A writer output that itself carries the tag, or a section whose anchor an
 * expert section owns, fails here — those sections are never the writer's to write.
 */
export function ingestGuidelineOutput(item: GuidelineWorkItem, outAbsPath: string, config: PlatformConfig, wikiRoot: string): { ok: true } | { ok: false; reason: string } {
  const staged = readFileSync(outAbsPath, "utf8");
  if (extractExpertSections(staged).length > 0) {
    return { ok: false, reason: `output carries a "${EXPERT_TAG_LINE}" tag line — only hand-written sections of the wiki file carry it, never a writer output` };
  }
  const existingAbs = resolve(wikiRoot, item.wikiPath);
  const sections = existsSync(existingAbs) ? extractExpertSections(readFileSync(existingAbs, "utf8")) : [];
  if (sections.length > 0) {
    const owned = new Set(sections.map((s) => s.anchor));
    const clash = h2Headings(parsePage(staged).body).find((title) => owned.has(slugify(title)));
    if (clash !== undefined) {
      return { ok: false, reason: `## ${clash}: this section is expert-owned in the existing wiki file (${EXPERT_TAG_LINE}) — the writer must not write it` };
    }
    writeFileSync(outAbsPath, spliceExpertSections(staged, sections), "utf8");
  }
  return validateGuidelineOutput(item, outAbsPath, config, wikiRoot);
}

// --------------------------------------------------------------------------------
// ingest
// --------------------------------------------------------------------------------

function runIngest(config: PlatformConfig, state: IngestionState, flags: CliFlags): number {
  const wikiRoot = wikiRootFrom(flags, config);
  const currentPromptHash = promptHash(PROMPT_PATH);
  const outPhaseDir = resolve(cacheDirs(LAYER_DIR).outDir, "guidelines");

  const outcome = ingestBatches(LAYER_DIR, wikiRoot, "guidelines", (item, outAbsPath) => ingestGuidelineOutput(item as GuidelineWorkItem, outAbsPath, config, wikiRoot), {
    batches: flags.batches,
  });
  const skipped = listAllFiles(outPhaseDir).length;

  for (const { path, item } of outcome.ok) {
    const gi = item as GuidelineWorkItem;
    const key = guidelineStateKey(gi.version, gi.file);
    state.guidelines.files[key] = {
      version: gi.version,
      file: gi.file,
      inputsHash: computeInputsHash(gi.sourceInputs),
      guidelinePromptHash: currentPromptHash,
      codeVersion: gi.codeRoot.codeVersion,
      builtHash: fileSha256(resolve(wikiRoot, path)),
      guidelineState: "ok",
      lastBuilt: new Date().toISOString().slice(0, 10),
    };
  }
  for (const f of outcome.failed) {
    const m = /^platform\/guidelines\/([^/]+)\/(.+\.md)$/.exec(f.path);
    if (!m) continue;
    const [, version, file] = m;
    const key = guidelineStateKey(version, file);
    // No endless re-prepare loop: a failed attempt's inputs are stored too.
    const gi = f.item as GuidelineWorkItem;
    state.guidelines.files[key] = {
      ...(state.guidelines.files[key] ?? {}),
      version,
      file,
      guidelineState: "failed",
      inputsHash: computeInputsHash(gi.sourceInputs),
      guidelinePromptHash: currentPromptHash,
      codeVersion: gi.codeRoot.codeVersion,
    };
  }
  saveState(state);

  return reportIngestOutcome("guidelines", outcome, skipped);
}

/** Required: a rule section cites its sources as "Read more: <path>" — an optional `-`/`*` bullet
 *  marker, an optional `**`/`_` emphasis wrap around the label (colon inside or outside the
 *  wrap), then at least one non-space character. */
const GUIDELINE_READ_MORE_LABEL = "(?:\\*\\*Read more:\\*\\*|\\*\\*Read more\\*\\*:|_Read more:_|_Read more_:|Read more:)";
const GUIDELINE_READ_MORE_RE = new RegExp(`^\\s*(?:[-*]\\s*)?${GUIDELINE_READ_MORE_LABEL}\\s*\\S`, "m");
/** Same marker, capturing the rest of the line for the "Read more: target must resolve"
 *  gate — `extractReadMoreTargets` below pulls the actual target(s) out of it, tolerating a
 *  backtick-, `<...>`- or markdown-link-wrapped target. */
const GUIDELINE_READ_MORE_LINE_RE = new RegExp(`^\\s*(?:[-*]\\s*)?${GUIDELINE_READ_MORE_LABEL}\\s*(.+)$`, "gm");

/** Strips a leading/trailing wrapper (backtick, angle bracket, quote, `*`/`_` emphasis) and
 *  trailing prose punctuation a writer commonly tacks on. */
function cleanReadMoreTarget(raw: string): string {
  return raw.replace(/^[`<"'*_]+/, "").replace(/[`>"'*_.,;:)]+$/, "");
}

/** Pulls the target(s) out of a "Read more:" line's remainder: a `[text](target)` markdown
 *  link (always exactly one target), or one or two bare/wrapped tokens — a comma introduces a
 *  second target, written either `a,b` or `a, b`. */
export function extractReadMoreTargets(rest: string): string[] {
  const trimmed = rest.trim();
  const link = /^\[[^\]]*\]\(([^)\s]+)\)/.exec(trimmed);
  if (link) return [cleanReadMoreTarget(link[1])];
  const tokens = trimmed.split(/\s+/);
  const [a, b] = tokens[0].split(",", 2);
  const raw = tokens[0].includes(",") ? [a, b || tokens[1]] : [a];
  return raw.filter(Boolean).map(cleanReadMoreTarget).filter((t) => t.length > 0);
}

/** `[text](target)` markdown links (every link target must start with `platform/` or be an
 *  https URL — the https host allowlist itself is `hygiene.ts`'s job, checked separately). */
const MARKDOWN_LINK_RE = /\[[^\]]*\]\(([^)\s]+)\)/g;
/** First/next `## ` heading line, title captured — used to find and bound the `## Index`
 *  section a base file (prompts/guideline.md) opens with. */
const GUIDELINE_HEADING_RE = /^##\s+(.+)$/m;

/** A `## Code check (<codeVersion>)` heading's bare title text (no leading `## `). */
const GUIDELINE_CODE_CHECK_TITLE_RE = /^Code check \((.+)\)$/;

type RealHeading = ReturnType<typeof h2HeadingLines>[number];

/**
 * Per section: every `## ` section except `## Index` and `## Code check (...)` must end
 * with (contain) a "Read more:" line — prompts/guideline.md says this per rule theme, not
 * once per file.
 */
function guidelineSectionMissingReadMore(bodyLines: string[], headings: RealHeading[]): string | undefined {
  for (let i = 0; i < headings.length; i++) {
    const { title, index } = headings[i];
    if (title === "Index" || GUIDELINE_CODE_CHECK_TITLE_RE.test(title)) continue;
    const end = i + 1 < headings.length ? headings[i + 1].index : bodyLines.length;
    // An expert section (`> [expert]` first line) is self-contained by design: no Read more: required.
    const first = firstBodyLineIndex(bodyLines, index, end);
    if (first >= 0 && isExpertTagLine(bodyLines[first])) continue;
    const section = bodyLines.slice(index + 1, end).join("\n");
    if (!GUIDELINE_READ_MORE_RE.test(section)) {
      return `## ${title}: section has no "Read more: <path>" line (required in every rule section)`;
    }
  }
  return undefined;
}

/** GitHub-style heading slugs (`slugify`, src/wiki/fs.ts) that collide across `## ` headings —
 *  the merged guidelines view (src/sources/guidelines/view.ts) keys project overrides by
 *  anchor, so two sections slugifying to the same anchor would let a project override apply
 *  to the wrong (or both) sections. */
function duplicateAnchorIssue(body: string): string | undefined {
  const seen = new Map<string, string>();
  for (const heading of h2Headings(body)) {
    const anchor = slugify(heading);
    const prior = seen.get(anchor);
    if (prior !== undefined && prior !== heading) return `duplicate ## section anchor "${anchor}" (headings "${prior}" and "${heading}" slugify to the same anchor)`;
    if (prior !== undefined) return `duplicate ## section heading: ## ${heading}`;
    seen.set(anchor, heading);
  }
  return undefined;
}

/** The wiki-relative paths a guideline output's markdown links may point to: every curated
 *  file of `version` (planned for this guidelines run, per `config.guidelines.curatedFiles`,
 *  whether or not it has landed yet) plus every item across the currently-pending `guidelines`
 *  batch files — the same "same-run known paths" shape as `pages.ts`'s
 *  `resolveIngestKnownPaths`, so a base file's `## Index` can link a surface file building in
 *  the same wave. `wiki:lint` is the final gate for a planned target that ultimately fails its
 *  own ingest. */
function resolveGuidelineKnownWikiPaths(config: PlatformConfig, version: string): Set<string> {
  const known = new Set<string>();
  for (const cf of config.guidelines?.curatedFiles ?? []) known.add(`platform/guidelines/${version}/${cf.file}`);
  for (const p of pendingItemPaths(LAYER_DIR, "guidelines")) known.add(p);
  return known;
}

/** A `platform/...` target (anchor already stripped by the caller) resolves against the
 *  committed wiki tree or this run's known-planned guideline paths. */
function platformTargetExists(target: string, wikiRoot: string, knownPaths: Set<string>): boolean {
  return existsSync(resolve(wikiRoot, target)) || knownPaths.has(target);
}

/** Order-independent identity key for a `sources[]` array — sorted `url\nhash` pairs — used
 *  to pin the output's `sources` exactly to the prefilled `item.frontmatter.sources`. */
function sourcesKey(sources: GuidelineSources): string {
  return [...sources].map((s) => `${s.url}\n${s.hash}`).sort().join("\u0000");
}

/** Compares a prefilled frontmatter field the way the writer gate requires: scalars as strings (an
 *  unquoted YAML `6.7` reads back as the number 6.7, `"6.7"` as the string "6.7" — both must
 *  compare equal to the prefilled string "6.7"), arrays/objects (e.g. `sources`) recursively,
 *  every leaf scalar normalised to a string first. */
function prefilledFieldUnchanged(agentValue: unknown, prefilled: unknown): boolean {
  const normalize = (v: unknown): unknown => {
    if (Array.isArray(v)) return v.map(normalize);
    if (v && typeof v === "object") return Object.fromEntries(Object.entries(v as Record<string, unknown>).map(([k, vv]) => [k, normalize(vv)]));
    return String(v);
  };
  return JSON.stringify(normalize(agentValue)) === JSON.stringify(normalize(prefilled));
}

export function validateGuidelineOutput(item: GuidelineWorkItem, outAbsPath: string, config: PlatformConfig, wikiRoot: string): { ok: true } | { ok: false; reason: string } {
  const size = fileSize(outAbsPath);
  if (size > config.sizeLimits.guidelineFileMaxBytes) return { ok: false, reason: `guideline exceeds ${config.sizeLimits.guidelineFileMaxBytes} bytes (${size})` };

  const text = readFileSync(outAbsPath, "utf8");
  const { frontmatter, body, endLine } = parsePage(text);
  if (frontmatter.id !== item.wikiPath) return { ok: false, reason: `frontmatter id ${String(frontmatter.id)} does not match output path ${item.wikiPath}` };

  const quotingIssues = checkFrontmatterShape(text);
  if (quotingIssues.length) return { ok: false, reason: quotingIssues.map((i) => `${i.field}: ${i.message}`).join("; ") };

  for (const key of ["id", "docType", "version", "codeVersion"] as const) {
    if (item.frontmatter && key in item.frontmatter && !prefilledFieldUnchanged(frontmatter[key], item.frontmatter[key])) {
      return { ok: false, reason: `prefilled field "${key}" was changed by the agent` };
    }
  }

  const fmIssues = validateGuidelineFrontmatter(frontmatter);
  if (fmIssues.length) return { ok: false, reason: fmIssues.map((i) => `${i.field}: ${i.message}`).join("; ") };

  // `sources` must equal the prefilled `item.frontmatter.sources` exactly — same
  // {url, hash} pairs, no changed hash, no missing or extra entry — compared as a
  // sorted "url\nhash" set (order-independent). A pattern's own URL (never a resolved file's
  // `readPath`) then satisfies the `Read more:` target check below, so this also blocks an
  // invented `sources[]` entry from smuggling in an invented `Read more:` target.
  const outputSources = Array.isArray(frontmatter.sources) ? (frontmatter.sources as GuidelineSources) : [];
  if (item.frontmatter && sourcesKey(outputSources) !== sourcesKey(item.frontmatter.sources)) {
    return { ok: false, reason: `sources[] does not match the prefilled item.frontmatter.sources — copy it through unchanged (no changed hash, no missing or extra entry)` };
  }
  // `sources` must be written as one line, in the flow-map-list form (prompts/guideline.md).
  const fmHead = text.split("\n").slice(0, endLine).join("\n");
  if (!/^sources: \[.*\]$/m.test(fmHead)) {
    return { ok: false, reason: `sources must be a one-line flow list, exactly: sources: [{url: "…", hash: "…"}, …] — a multi-line YAML list fails validation` };
  }
  const sourceUrls = new Set(outputSources.map((s) => s.url));

  const bodyLines = body.split("\n");
  const headings = h2HeadingLines(bodyLines);

  const dupIssue = duplicateAnchorIssue(body);
  if (dupIssue) return { ok: false, reason: dupIssue };

  // Every rule section — everything but `## Index` and
  // `## Code check (...)` — points back to its sources with "Read more: <path>".
  const readMoreIssue = guidelineSectionMissingReadMore(bodyLines, headings);
  if (readMoreIssue) return { ok: false, reason: readMoreIssue };

  const knownWikiPaths = resolveGuidelineKnownWikiPaths(config, item.version);

  // Every "Read more:" target is a sources[].url or an existing/planned platform/... path.
  for (const m of body.matchAll(GUIDELINE_READ_MORE_LINE_RE)) {
    for (const target of extractReadMoreTargets(m[1])) {
      const isSource = sourceUrls.has(target);
      const isWikiPath = target.startsWith("platform/") && platformTargetExists(target.split("#")[0], wikiRoot, knownWikiPaths);
      if (!isSource && !isWikiPath) {
        return { ok: false, reason: `"Read more:" target is neither a sources[].url nor an existing platform/... path: ${target}` };
      }
    }
  }

  // Every markdown link target starts with platform/ or is an https URL (host
  // allowlisting itself is hygiene.ts's job, applied to the whole file below).
  for (const m of body.matchAll(MARKDOWN_LINK_RE)) {
    const target = m[1];
    if (!target.startsWith("platform/") && !/^https:\/\//.test(target)) {
      return { ok: false, reason: `markdown link target must start with platform/ or be an https URL: ${target}` };
    }
  }
  // Every platform/ link resolves — to the committed wiki tree or a curated file of
  // this run's version (this wave's other batches included) — `wiki:lint` remains the final
  // gate for a planned target that ultimately fails its own ingest.
  for (const target of wikiLinkTargets(body)) {
    if (!platformTargetExists(target, wikiRoot, knownWikiPaths)) {
      return { ok: false, reason: `markdown link target does not exist: ${target}` };
    }
  }

  // prompts/guideline.md: Index is required only when base is null AND surfaceFiles is
  // non-empty — a base file with no surfaces configured (yet) carries no Index requirement.
  if (item.surfaceFiles?.length) {
    const headingMatch = GUIDELINE_HEADING_RE.exec(body);
    const firstHeading = headingMatch?.[1]?.trim();
    if (firstHeading !== "Index") {
      return { ok: false, reason: `base file's first ## heading must be "Index" (prompts/guideline.md), got ${firstHeading ? `"${firstHeading}"` : "none"}` };
    }
    const afterHeading = body.slice(headingMatch!.index + headingMatch![0].length);
    const nextHeading = GUIDELINE_HEADING_RE.exec(afterHeading);
    const indexSection = nextHeading ? afterHeading.slice(0, nextHeading.index) : afterHeading;
    for (const sf of item.surfaceFiles) {
      if (!indexSection.includes(sf.wikiPath)) return { ok: false, reason: `## Index section does not link its surface file ${sf.wikiPath}` };
    }
  }

  const codeCheckIssue = validateGuidelineCodeCheckSection(body, item.codeRoot.codeVersion, item.codeRoot.packageRoots, item.codeCheck.flags);
  if (codeCheckIssue) return { ok: false, reason: codeCheckIssue };

  // Best-effort pair cap (base + this file), authoritative check is `wiki:lint` (worker D's
  // `lintGuidelines`) once the whole version has landed — this only catches the common case
  // where the base file (listed before its surfaces in config.json) already moved this run.
  if (item.base) {
    const baseAbs = resolve(wikiRoot, "platform/guidelines", item.version, item.base);
    if (existsSync(baseAbs)) {
      const pairSize = size + fileSize(baseAbs);
      if (pairSize > config.sizeLimits.guidelinePairMaxBytes) {
        return { ok: false, reason: `base+surface pair (${item.base} + ${item.file}) is ${pairSize} bytes, over the ${config.sizeLimits.guidelinePairMaxBytes}-byte cap` };
      }
    }
  }

  // Full `text` (frontmatter + body), not just `body`: `docs:` sourceInputs now resolve to the
  // canonical developer.shopware.com page URL (sync.ts's `sourcePathToUrl`, same as the
  // `developer` source), which is on hygiene.ts's ALLOWLISTED_LINK_HOSTS. `wiki:` sourceInputs
  // resolve to a bare wiki-relative path and `code:` ones to a `code:<pkg>/<path>` string —
  // neither matches the `https?://` link regex, so they never trip the check either.
  const hygiene = [...checkOutputHygiene(text), ...checkLeakedLocalState(text), ...checkPurity(text)];
  if (hygiene.length) return { ok: false, reason: hygiene.map((h) => h.detail).join("; ") };

  return { ok: true };
}

// --------------------------------------------------------------------------------
// ## Code check (<codeVersion>) gate — guideline-shaped adaptation of
// pages.ts's `validateCodeCheckSection`. Reuses `citationCandidates`/`containsWord`
// (identifier-window matching) but cannot reuse the citation regex itself: pages.ts hardcodes
// `vendor/shopware/...`
// citations against one project root, while a guideline item's code root may be the
// installed `vendor/` (6.7) or the 6.6 pinned checkout under `.cache/code/6.6/` — two
// different trees. Citations here are package-relative instead: `<core|storefront|
// administration>/<path>:<line>`, resolved against `item.codeRoot.packageRoots`.
// --------------------------------------------------------------------------------

const GUIDELINE_CODE_CHECK_LINE_RE = /^-\s+(confirmed|corrected|absent|deprecated|unread|unverified)\s+`([^`]+)`(.*)$/;
/** An optional leading `vendor/shopware/` is stripped before the `<pkg>/<path>` match — the
 *  same citation then resolves whether
 *  the writer wrote it package-relative or vendor-tree-relative. */
const GUIDELINE_CITATION_RE = /\b(?:vendor\/shopware\/)?(core|storefront|administration)\/([^\s:`]+):(\d+)\W*$/;
const GUIDELINE_NEEDS_CITATION = new Set(["confirmed", "corrected", "deprecated", "unread"]);
const MAX_CODE_CHECK_LINES = 20;

/** An `administration/...` citation resolves whether written relative to the admin
 *  `src` root (`packageRoots.administration` itself — e.g. `administration/Component/foo.js`)
 *  or to the fuller `administration/Resources/app/administration/src/...` form (matching how
 *  `code:` sourceInputs are written in config.json). `core`/`storefront` have one form only. */
function resolveGuidelineCitationPath(packageRoots: PackageRoots, pkg: keyof PackageRoots, relPath: string): string {
  if (pkg !== "administration") return resolve(packageRoots[pkg], relPath);
  const direct = resolve(packageRoots.administration, relPath);
  if (existsSync(direct)) return direct;
  return resolve(packageRoots.administration, relPath.replace(/^Resources\/app\/administration\/src\//, ""));
}

export function validateGuidelineCodeCheckSection(body: string, codeVersion: string, packageRoots: PackageRoots, flags: FlagResult): string | undefined {
  const bodyLines = body.split("\n");
  const headings = h2HeadingLines(bodyLines);
  const codeCheckPos = headings.findIndex((h) => GUIDELINE_CODE_CHECK_TITLE_RE.test(h.title));
  if (codeCheckPos === -1) {
    if (flagCount(flags) > 0) return "guideline is missing the required ## Code check (...) section";
    return undefined;
  }
  if (codeCheckPos !== headings.length - 1) return "## Code check must be the last section";
  const heading = GUIDELINE_CODE_CHECK_TITLE_RE.exec(headings[codeCheckPos].title)!;
  if (heading[1] !== codeVersion) return `## Code check section version ${heading[1]} does not match codeVersion ${codeVersion}`;

  // Last real (unfenced) `## ` heading, so this always runs to the end of `body` — a rule
  // section placed after `## Code check` is already rejected above, before this slice would
  // ever wrongly swallow it.
  const lines = bodyLines
    .slice(headings[codeCheckPos].index + 1)
    .map((l) => l.trim())
    .filter((l) => l.length > 0 && l.startsWith("-"));
  if (lines.length > MAX_CODE_CHECK_LINES) return `## Code check section has ${lines.length} lines, more than ${MAX_CODE_CHECK_LINES}`;

  const covered: { status: string; token: string }[] = [];
  for (const line of lines) {
    const m = GUIDELINE_CODE_CHECK_LINE_RE.exec(line);
    if (!m) return `## Code check line does not match the required format: ${line}`;
    const [, status, token, rest] = m;
    covered.push({ status, token });
    if (!GUIDELINE_NEEDS_CITATION.has(status)) continue;

    const citation = GUIDELINE_CITATION_RE.exec(rest);
    if (!citation) return `## Code check line for "${token}" (${status}) is missing a <core|storefront|administration>/...:<line> citation`;
    const [, pkgRaw, relPath, lineNo] = citation;
    const pkg = pkgRaw as keyof PackageRoots;
    const abs = resolveGuidelineCitationPath(packageRoots, pkg, relPath);
    if (!existsSync(abs)) return `## Code check line cites a path that does not exist: ${pkg}/${relPath}`;
    const fileLines = readFileSync(abs, "utf8").split("\n");
    const n = Number(lineNo);
    const window = fileLines.slice(Math.max(0, n - 4), Math.min(fileLines.length, n + 3)).join("\n");
    // Reuse pages.ts's gate parity — `citationCandidates`/`containsWord` (a `corrected`
    // line's clause identifiers count too, and a match must land on an identifier boundary).
    const candidates = citationCandidates(status, token, rest);
    if (!candidates.some((c) => containsWord(window, c)) && !window.includes(token.trim())) {
      return `## Code check line for "${token}" does not appear within +/-3 lines of ${pkg}/${relPath}:${lineNo}`;
    }
  }

  for (const [list, status] of [
    [flags.absent, "absent"],
    [flags.deprecated, "deprecated"],
    [flags.unread, "unread"],
  ] as const) {
    for (const flag of list) {
      const listed = covered.some((c) => c.status === status && (c.token === flag || c.token.includes(flag)));
      if (!listed) return `## Code check section does not list "${flag}" as ${status}`;
    }
  }

  return undefined;
}
