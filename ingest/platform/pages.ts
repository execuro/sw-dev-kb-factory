/**
 * `wiki:pages` — Phase 3 (refresh spec). Deterministic prepare/ingest only;
 * article writing happens in kb-factory-ingest-writer sub-agents launched by the
 * kb-factory-ingest-platform-docs skill.
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { loadPlatformConfig, wikiRootFrom } from "../shared/config.js";
import { loadState, saveState } from "../shared/state.js";
import { cacheDirs, fileSize, ingestBatches, reportIngestOutcome, listAllFiles, pendingItemPaths, promptHash, writeBatches } from "../shared/workitems.js";
import { parsePage, validatePageFrontmatter, validateSixSections, estimateTokens, effectiveMinTokens, crossLinkTargets, stripCodeCheckSection, checkFrontmatterShape, fencedLines, h2Headings, h2HeadingLines } from "../shared/frontmatterValidate.js";
import { checkOutputHygiene, checkLeakedLocalState, checkPurity } from "../shared/hygiene.js";
import { wikiLinkTargets } from "../shared/links.js";
import { deriveTitle, devSourcePath, filterPlannedLinks, groupSharedDevPages, isLong, knownBuiltPaths, layerDir, merchantVersionsForRevision, pickRelatedPages, readSourceText, resolveLinks, type DevGroup } from "./pagePrep.js";
import { resolveVendorRoot, resolveCodeIndexContext, resolveCodeCitationPath, flagCount, flagIdentifiers, missingRequiredMembers, requiredMembers, type CodeIndex, type CodeRoot, type FlagResult } from "./codeIndex.js";
import { paths } from "../../src/paths.js";
import type { CliFlags, PlatformConfig, SourceConfig, StatePageEntry, WorkItem } from "../shared/types.js";

const LAYER_DIR = layerDir();
const PROMPT_PATH = resolve(LAYER_DIR, "prompts/page.md");
const OUTLINE_PATH = resolve(LAYER_DIR, "../shared/page-outline.md");
const FQCN_RE = /\bShopware\\(?:Core|Storefront|Administration)\\[A-Za-z0-9_\\]+/;

export interface PageWorkItem extends WorkItem {
  groupPaths?: string[];
  codeCheck?: { coreVersion: string; flags: FlagResult; requiredMembers?: Record<string, string[]> };
  /** True for every canonical dev item whose version is the installed codeCheck major, even
   *  when its cached source text was missing this run and `codeCheck` is therefore absent —
   *  read at ingest so codeHash is stamped regardless, and a source-missing page is not
   *  re-queued forever (design doc "State, dedupe, build, lint"). */
  codeCheckCanonical?: boolean;
}

export interface CodeCheckCtx {
  index: CodeIndex;
  installedMajor: string;
  codeHash: string;
  root: CodeRoot;
}

/** `6.7.13.0` -> `6.7`. */
function majorOf(version: string): string {
  return version.split(".").slice(0, 2).join(".");
}

/**
 * Resolves the codeCheck context per config.json's `codeCheck` block, or `undefined` when
 * disabled. Returns `false` when enabled but no code root resolves — the caller must fail
 * hard, never skip silently. The "primary" version to code-check is
 * `config.guidelines.versions[0]`; `codeRootFor` (codeIndex.ts) then picks vendor mode (an
 * installed `vendor/` matching that version's major) or checkout mode (a synced
 * `.sources/shopware/<version>` / `.cache/code/<version>` pin) — whichever is actually
 * available, same resolver `guidelines.ts` uses per-version.
 */
function resolveCodeCheckCtx(config: PlatformConfig): CodeCheckCtx | undefined | false {
  const cc = config.codeCheck;
  if (!cc?.enabled) return undefined;
  const primaryVersion = config.guidelines?.versions?.[0];
  if (!primaryVersion) return false;
  const codeCacheDir = resolve(cacheDirs(LAYER_DIR).root, "code");
  const projectRoot = resolveVendorRoot(config) ?? paths.shopwareSourceRoot(primaryVersion);
  const ctx = resolveCodeIndexContext(primaryVersion, config, projectRoot, codeCacheDir);
  if (!ctx) return false;
  return { index: ctx.index, installedMajor: majorOf(ctx.index.coreVersion), codeHash: ctx.root.codeVersion, root: ctx.root };
}

export async function run(flags: CliFlags): Promise<number> {
  const config = loadPlatformConfig();
  const state = loadState();

  if (flags.restampCodeHash) return runRestampCodeHash(config, state);
  if (flags.ingest) return runIngest(config, state, flags);
  if (flags.retryFailed) return runPrepare(config, state, flags, true);
  if (flags.prepare) return runPrepare(config, state, flags, false);
  process.stderr.write("wiki:pages: one of --prepare, --ingest, --retry-failed, --restamp-code-hash is required\n");
  return 1;
}

/**
 * Re-stamps every code-checked page's `codeHash` to the current code root, without preparing or
 * rewriting a single page.
 *
 * `codeHash` is `${coreVersion}+${vendorHash[0:8]}`, and the two code-root modes compute
 * `vendorHash` differently — an installed `vendor/` hashes composer's `installed.json`, a pinned
 * checkout content-hashes the source tree. So moving a version from one mode to the other changes
 * the hash for every page even though not one identifier moved, and `codeHashStale` would then
 * queue the entire corpus for an LLM re-ingest costing days of tokens.
 *
 * This turns that migration into one command. It is deliberately NOT automatic: it only makes sense
 * when you have satisfied yourself that the two roots describe the same code, which is why it
 * refuses to run when `coreVersion` itself has moved — a real version bump must go through the
 * normal re-check, not be stamped over.
 */
export function restampPages(state: ReturnType<typeof loadState>, codeHash: string): { restamped: number; refused: number; moved: string[] } {
  let restamped = 0;
  let versionMoved = 0;
  const moved: string[] = [];
  for (const source of Object.values(state.sources) as { pages?: Record<string, unknown> }[]) {
    for (const [path, entry] of Object.entries(source.pages ?? {})) {
      const e = entry as { codeHash?: string };
      if (!e.codeHash || e.codeHash === codeHash) continue;
      if (e.codeHash.split("+")[0] !== codeHash.split("+")[0]) {
        versionMoved++;
        if (moved.length < 5) moved.push(`${path} (${e.codeHash} -> ${codeHash})`);
        continue;
      }
      e.codeHash = codeHash;
      restamped++;
    }
  }
  return { restamped, refused: versionMoved, moved };
}

function runRestampCodeHash(config: PlatformConfig, state: ReturnType<typeof loadState>): number {
  const ctx = resolveCodeCheckCtx(config);
  if (ctx === false || ctx === undefined) {
    process.stderr.write("wiki:pages: --restamp-code-hash needs a resolvable code root (run `npm run setup`)\n");
    return 1;
  }

  const { restamped, refused, moved } = restampPages(state, ctx.codeHash);
  if (refused > 0) {
    process.stderr.write(
      `wiki:pages: refusing to restamp ${refused} page(s) whose coreVersion changed — those need a real re-check:\n` +
        moved.map((m) => `    ${m}\n`).join(""),
    );
  }
  if (restamped > 0) saveState(state);
  process.stdout.write(JSON.stringify({ cmd: "pages", mode: "restamp-code-hash", codeHash: ctx.codeHash, restamped, refused }) + "\n");
  return refused > 0 ? 1 : 0;
}

function runPrepare(config: PlatformConfig, state: ReturnType<typeof loadState>, flags: CliFlags, retry: boolean): number {
  const currentPromptHash = promptHash(PROMPT_PATH);
  const outDir = resolve(cacheDirs(LAYER_DIR).outDir, "pages");
  const items: PageWorkItem[] = [];
  const knownPaths = knownBuiltPaths(state);
  const pathFilter = flags.path?.length ? new Set(flags.path) : undefined;

  const ctx = resolveCodeCheckCtx(config);
  if (ctx === false) {
    process.stderr.write(
      "wiki:pages: codeCheck.enabled is true but no code root is available (run `npm run setup` to sync .sources/shopware/<version>)\n",
    );
    return 1;
  }

  for (const group of groupSharedDevPages(config, state, ctx?.installedMajor)) {
    const canonical = group.refs[0];
    if (flags.source && canonical.sourceId !== flags.source) continue;
    const isCodeCheck = ctx !== undefined && canonical.version === ctx.installedMajor;
    const codeHashStale = isCodeCheck && canonical.entry.codeHash !== ctx.codeHash;
    const orphanedSibling = !isCodeCheck && canonical.entry.sharedFrom !== undefined && group.refs.length === 1;
    // A page still `failed` under unchanged inputs is left out of the default --prepare
    // (no endless re-prepare loop, design doc "State, dedupe, build, lint") — only
    // `--retry-failed`/`--all` re-queue it. `canonical.entry.hash`/`promptHash` are
    // unmoved from the failed attempt as long as no new sync/prompt change has landed,
    // so this gate reads as "unchanged inputs" without a separate failure snapshot.
    const needsWork = retry
      ? canonical.entry.failed === true
      : flags.all ||
        (!canonical.entry.failed &&
          (canonical.entry.hash !== canonical.entry.builtHash ||
            canonical.entry.promptHash !== currentPromptHash ||
            codeHashStale ||
            orphanedSibling));
    if (!needsWork) continue;
    const item = buildDevWorkItem(config, group, outDir, knownPaths, isCodeCheck ? ctx : undefined);
    if (pathFilter) {
      const candidates = [item.path, ...(item.groupPaths ?? []), canonical.entry.sharedFrom].filter((p): p is string => !!p);
      if (!candidates.some((p) => pathFilter.has(p))) continue;
    }
    items.push(item);
  }

  for (const source of config.sources) {
    if (!source.docType.includes("functional") || !source.active) continue;
    if (flags.source && source.id !== flags.source) continue;
    const sourceState = state.sources[source.id];
    if (!sourceState) continue;
    for (const [path, entry] of Object.entries(sourceState.pages)) {
      if (entry.hash === undefined) continue; // never fetched — nothing to build from
      const needsWork = retry
        ? entry.failed === true
        : flags.all || (!entry.failed && (entry.hash !== entry.builtHash || entry.promptHash !== currentPromptHash));
      if (!needsWork) continue;
      if (pathFilter && !pathFilter.has(path)) continue;
      items.push(buildMerchantWorkItem(config, source, path, entry, outDir, knownPaths));
    }
  }

  // Writers may only link to a target a reader can resolve: an already-built page, or a
  // page this same run is about to (re)build — never an invented or dangling path.
  const droppedLinks = filterPlannedLinks(items, knownPaths);

  // Codes items batch by `codeCheck.batchSize` (5); everything else by the regular
  // `ingest.batchSize` (15) — grouped contiguously so writeBatches keeps each run intact.
  items.sort((a, b) => Number(!!b.codeCheck) - Number(!!a.codeCheck));
  const batchSizeFor = (item: WorkItem) => ((item as PageWorkItem).codeCheck ? (config.codeCheck?.batchSize ?? 5) : config.ingest.batchSize);
  const files = writeBatches(LAYER_DIR, "pages", items, PROMPT_PATH, batchSizeFor, OUTLINE_PATH, { reset: flags.resetBatches });
  const codeItems = items.filter((i) => i.codeCheck).length;
  process.stdout.write(
    JSON.stringify({ cmd: "pages", mode: "prepare", ...(retry ? { retry: true } : {}), batches: files.length, items: items.length, codeItems, droppedLinks, files }) + "\n",
  );
  return 0;
}

function buildDevWorkItem(config: PlatformConfig, group: DevGroup, outDir: string, knownPaths: Set<string>, codeCtx?: CodeCheckCtx): PageWorkItem {
  const canonical = group.refs[0];
  const sourcePath = canonical.entry.hash !== undefined ? devSourcePath(canonical.sourceId, canonical.entry.hash) : undefined;
  const sourceText = readSourceText(sourcePath);
  const title = deriveTitle(sourceText, canonical.relPath);
  const long = sourceText ? isLong(sourceText, config.articleTokens.longSourceWordThreshold) : false;
  const links = sourceText ? resolveLinks(sourceText, canonical.relPath, canonical.wikiDir) : [];
  const versions = [...group.refs.map((r) => r.version)].sort();
  const sourceUrls = group.refs.length > 1 ? Object.fromEntries(group.refs.map((r) => [r.version, r.entry.sourceUrl])) : undefined;
  const relatedPages = pickRelatedPages(links, knownPaths, canonical.wikiPath);
  const codeCheck =
    codeCtx && sourceText
      ? { coreVersion: codeCtx.index.coreVersion, flags: flagIdentifiers(sourceText, codeCtx.index), requiredMembers: requiredMembers(sourceText, codeCtx.root) }
      : undefined;
  const frontmatter: Record<string, unknown> = {
    id: canonical.wikiPath,
    title,
    docType: "developer",
    version: canonical.version,
    versions,
    sourceUrl: canonical.entry.sourceUrl,
    sourceHash: canonical.entry.hash,
    ...(sourceUrls ? { sourceUrls } : {}),
    ...(relatedPages.length ? { relatedPages } : {}),
    ...(codeCheck ? { codeCheckedAgainst: codeCheck.coreVersion } : {}),
  };
  return {
    path: canonical.wikiPath,
    sourcePath,
    outputPath: resolve(outDir, canonical.wikiPath.replace(/^platform\//, "")),
    frontmatter,
    links,
    long,
    ...(codeCheck ? { codeCheck } : {}),
    ...(codeCtx ? { codeCheckCanonical: true } : {}),
    groupPaths: group.refs.length > 1 ? group.refs.map((r) => r.wikiPath) : undefined,
  };
}

function buildMerchantWorkItem(config: PlatformConfig, source: SourceConfig, path: string, entry: StatePageEntry, outDir: string, knownPaths: Set<string>): PageWorkItem {
  const sourcePath = entry.hash !== undefined ? devSourcePath(source.id, entry.hash) : undefined;
  const sourceText = readSourceText(sourcePath);
  const title = deriveTitle(sourceText, path);
  const long = sourceText ? isLong(sourceText, config.articleTokens.longSourceWordThreshold) : false;
  const relPath = path.slice(source.wikiDir!.length + 1);
  const links = sourceText ? resolveLinks(sourceText, relPath, source.wikiDir!) : [];
  const rev = entry.revisions?.[0];
  const versions = rev ? merchantVersionsForRevision(rev.swMin, rev.swMax) : ["6.5", "6.6", "6.7"];
  const relatedPages = pickRelatedPages(links, knownPaths, path);
  const frontmatter: Record<string, unknown> = {
    id: path,
    title,
    docType: "functional",
    version: versions[0],
    versions,
    sourceUrl: entry.sourceUrl,
    sourceHash: entry.hash,
    ...(rev ? { revision: { range: rev.range, swMin: rev.swMin, swMax: rev.swMax, current: rev.current } } : {}),
    ...(relatedPages.length ? { relatedPages } : {}),
  };
  return {
    path,
    sourcePath,
    outputPath: resolve(outDir, path.replace(/^platform\//, "")),
    frontmatter,
    links,
    long,
  };
}

/**
 * The link/cross-link targets a reader can resolve at ingest time: a page already built
 * (`knownBuiltPaths`), plus every item path across the currently-pending `pages` batch files
 * (`.cache/work/pages/*.json`) — read before `ingestBatches` moves/clears them. This matches
 * `filterPlannedLinks`'s prepare-time filter (`pagePrep.ts`), so two new pages linking each
 * other both pass here; `wiki:lint` remains the final gate for a planned target that
 * ultimately fails its own ingest. A page that failed in an earlier wave is neither built
 * (its `builtHash` never moved) nor pending (its batch file was already consumed) -- links to
 * it fail here until `--retry-failed` re-queues it into a fresh pending batch.
 */
export function resolveIngestKnownPaths(state: ReturnType<typeof loadState>, layerDir: string = LAYER_DIR): Set<string> {
  const paths = knownBuiltPaths(state);
  for (const p of pendingItemPaths(layerDir, "pages")) paths.add(p);
  return paths;
}

function runIngest(config: PlatformConfig, state: ReturnType<typeof loadState>, flags: CliFlags): number {
  const wikiRoot = wikiRootFrom(flags, config);
  const currentPromptHash = promptHash(PROMPT_PATH);
  const outPhaseDir = resolve(cacheDirs(LAYER_DIR).outDir, "pages");

  const ctx = resolveCodeCheckCtx(config);
  if (ctx === false) {
    process.stderr.write(
      "wiki:pages: codeCheck.enabled is true but no code root is available (run `npm run setup` to sync .sources/shopware/<version>)\n",
    );
    return 1;
  }

  const ingestKnownPaths = resolveIngestKnownPaths(state);
  const outcome = ingestBatches(LAYER_DIR, wikiRoot, "pages", (item, outAbsPath) => validatePageOutput(item as PageWorkItem, outAbsPath, config, ingestKnownPaths, ctx), {
    batches: flags.batches,
  });
  const skipped = listAllFiles(outPhaseDir).length;

  for (const { path, item } of outcome.ok) {
    applyPageOutcome(state, path, true, currentPromptHash);
    const found = findEntry(state, path);
    if (found) {
      // `codeCheckCanonical` covers the codeCheck flag itself absent (cached source text was
      // missing this run) — codeHash is still stamped so the page is not re-queued forever
      // (codeHashStale in runPrepare, "no endless re-prepare loop").
      if (((item as PageWorkItem).codeCheck || (item as PageWorkItem).codeCheckCanonical) && ctx) found.entry.codeHash = ctx.codeHash;
      // No longer part of a multi-ref group (an orphaned sibling rebuilt into its own
      // article) — this article is now physically its own file, not an alias.
      if (!(item as PageWorkItem).groupPaths) found.entry.sharedFrom = undefined;
    }
    for (const sibling of (item as PageWorkItem).groupPaths ?? []) {
      if (sibling !== path) {
        applyPageOutcome(state, sibling, true, currentPromptHash);
        const siblingEntry = findEntry(state, sibling);
        if (siblingEntry) siblingEntry.entry.sharedFrom = path;
      }
    }
  }
  for (const f of outcome.failed) {
    applyPageOutcome(state, f.path, false, currentPromptHash);
  }
  saveState(state);

  return reportIngestOutcome("pages", outcome, skipped);
}

function findEntry(state: ReturnType<typeof loadState>, wikiPath: string): { sourceId: string; entry: StatePageEntry } | undefined {
  for (const [sourceId, p] of Object.entries(state.sources)) {
    if (p.pages[wikiPath]) return { sourceId, entry: p.pages[wikiPath] };
  }
  return undefined;
}

function applyPageOutcome(state: ReturnType<typeof loadState>, wikiPath: string, ok: boolean, promptHashValue: string): void {
  const found = findEntry(state, wikiPath);
  if (!found) return;
  found.entry.promptHash = promptHashValue;
  if (ok) {
    found.entry.builtHash = found.entry.hash; // hash hasn't changed since --prepare built this same-run work item
    found.entry.failed = undefined;
  } else {
    found.entry.failed = true; // builtHash untouched — the previous article (if any) is kept
  }
}

/** Loose scalar equality for the `deepEqualPrefilled` comparison below — treats a number and a
 *  string with the same printed value as equal (the frontmatter parser's `parseScalar` can turn
 *  an unquoted numeric-looking string like "6.6" back into the number 6.6). */
function scalarEqualPrefilled(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if ((typeof a === "number" || typeof a === "string") && (typeof b === "number" || typeof b === "string")) return String(a) === String(b);
  return false;
}

/** Structural equality for a prefilled `versions`/`sourceUrls`/`revision` field: arrays are
 *  order-sensitive (element order can carry meaning, e.g. `versions`), plain objects are
 *  order-insensitive (only their key/value pairs matter, e.g. `revision`'s key order), and
 *  scalars compare loosely (see `scalarEqualPrefilled`). */
function deepEqualPrefilled(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (Array.isArray(a) && Array.isArray(b)) {
    return a.length === b.length && a.every((v, i) => deepEqualPrefilled(v, b[i]));
  }
  if (a && b && typeof a === "object" && typeof b === "object" && !Array.isArray(a) && !Array.isArray(b)) {
    const aObj = a as Record<string, unknown>;
    const bObj = b as Record<string, unknown>;
    const aKeys = Object.keys(aObj);
    const bKeys = Object.keys(bObj);
    return aKeys.length === bKeys.length && aKeys.every((k) => Object.prototype.hasOwnProperty.call(bObj, k) && deepEqualPrefilled(aObj[k], bObj[k]));
  }
  return scalarEqualPrefilled(a, b);
}

export function validatePageOutput(
  item: PageWorkItem,
  outAbsPath: string,
  config: PlatformConfig,
  knownPaths?: Set<string>,
  codeCtx?: CodeCheckCtx | undefined,
): { ok: true } | { ok: false; reason: string } {
  const size = fileSize(outAbsPath);
  if (size > config.sizeLimits.pageMaxBytes) return { ok: false, reason: `page exceeds ${config.sizeLimits.pageMaxBytes} bytes (${size})` };

  let text = readFileSync(outAbsPath, "utf8");
  if (!isValidUtf8NoNul(text)) return { ok: false, reason: "not valid UTF-8 or contains NUL" };
  if (item.codeCheck && codeCtx) {
    const repaired = repairCodeCheckLineNumbers(text, codeCtx.root);
    if (repaired !== text) {
      writeFileSync(outAbsPath, repaired, "utf8"); // still inside .cache/out; ingestBatches moves this file next
      text = repaired;
    }
  }

  const quotingIssues = checkFrontmatterShape(text);
  if (quotingIssues.length) return { ok: false, reason: quotingIssues.map((i) => `${i.field}: ${i.message}`).join("; ") };

  const purityIssues = checkPurity(text);
  if (purityIssues.length) return { ok: false, reason: purityIssues.map((i) => i.detail).join("; ") };

  const { frontmatter, body } = parsePage(text);
  if (frontmatter.id !== item.path) return { ok: false, reason: `frontmatter id ${String(frontmatter.id)} does not match output path ${item.path}` };

  for (const key of ["title", "docType", "version", "sourceUrl", "sourceHash", "codeCheckedAgainst"] as const) {
    if (item.frontmatter && key in item.frontmatter && frontmatter[key] !== item.frontmatter[key]) {
      return { ok: false, reason: `prefilled field "${key}" was changed by the agent` };
    }
  }
  // Object/array-shaped prefilled fields need a structural (not `!==`) comparison — a dropped
  // `sourceUrls` (shared articles) or `revision` (merchant) must fail here, or lint's own
  // check on the same fields (lintPagesAndIndexes) is left to catch it after the file already landed.
  // Order-insensitive on objects (a written-back `revision: {current, range, swMin, swMax}` must
  // not fail just because `buildMerchantWorkItem` prefilled `{range, swMin, swMax, current}`) and
  // scalar-loose (the frontmatter parser turns an unquoted `"6.6"` back into the number `6.6` —
  // src/wiki/frontmatter.ts `parseScalar` — so that alone is not a genuine change). Arrays stay
  // order-sensitive: `versions` order carries meaning.
  for (const key of ["versions", "sourceUrls", "revision"] as const) {
    if (item.frontmatter?.[key] !== undefined && !deepEqualPrefilled(frontmatter[key], item.frontmatter[key])) {
      return { ok: false, reason: `prefilled field "${key}" was changed by the agent` };
    }
  }

  if (!item.codeCheck) {
    // A plain item must never carry codeCheck bookkeeping the writer was not asked to
    // produce — lint's `codeCheckedAgainst is set but section is missing` rule (lint.ts,
    // lintCodeCheck) only guards a page that has a pin; this guards against inventing one.
    if ("codeCheckedAgainst" in frontmatter) return { ok: false, reason: "plain item must not set codeCheckedAgainst" };
    if (h2Headings(body).some((h) => /^Code check \(/.test(h))) {
      return { ok: false, reason: "plain item must not include a ## Code check section" };
    }
  }

  const fmIssues = validatePageFrontmatter(frontmatter);
  if (fmIssues.length) return { ok: false, reason: fmIssues.map((i) => `${i.field}: ${i.message}`).join("; ") };

  const sectionIssues = validateSixSections(body);
  if (sectionIssues.length) return { ok: false, reason: sectionIssues.map((i) => i.message).join("; ") };

  if (item.codeCheck) {
    const codeCheckIssue = validateCodeCheckSection(item, body, codeCtx);
    if (codeCheckIssue) return { ok: false, reason: codeCheckIssue };
  }

  const tokens = estimateTokens(body);
  const max = item.long ? config.articleTokens.longMax : config.articleTokens.max;
  const sourceText = readSourceText(item.sourcePath);
  const effectiveMin = effectiveMinTokens(config.articleTokens.min, sourceText);
  const lower = effectiveMin * (1 - config.articleTokens.bandTolerance);
  const upper = max * (1 + config.articleTokens.bandTolerance);
  if (tokens < lower || tokens > upper) {
    const scaledNote = effectiveMin < config.articleTokens.min ? ` (floor scaled to ${effectiveMin} prose tokens in source)` : "";
    return { ok: false, reason: `article length ${tokens} tokens outside band [${Math.round(lower)}, ${Math.round(upper)}]${scaledNote}` };
  }

  // Every relative (non-http) link must be wiki-root-relative under `platform/` — an
  // external citation stays a full https:// URL (checked separately by checkOutputHygiene's
  // allowlist), so it is exempted here rather than rejected as "not wiki-root-relative".
  for (const m of body.matchAll(/\]\((?!https?:\/\/)([^\s)]+)\)/g)) {
    if (m[1].startsWith("#")) continue; // same-page anchor, not a path
    if (!m[1].startsWith("platform/")) return { ok: false, reason: `link is not wiki-root-relative starting with platform/: ${m[1]}` };
  }

  // A `platform/`-prefixed link that points nowhere is as broken as a relative one, and
  // lint treats it as an error — so reject it here rather than letting it reach the wiki.
  // Writers producing these by concatenating `platform/` onto a source-relative path
  // (`…/symfony-bundle/docs/guides/…`) or by citing a page that was never ingested (a typo'd
  // or since-removed path) is the observed failure mode. Uses the same `](platform/…)`
  // extractor as `wiki:lint` (`wikiLinkTargets`, anchors stripped) so a link to a bare
  // directory (never a member of `knownPaths`, which only ever holds `.md` paths — pages,
  // hubs, guidelines) is rejected here exactly as it would be at lint time.
  if (knownPaths) {
    const targets = new Set(wikiLinkTargets(body));
    for (const t of crossLinkTargets(frontmatter)) targets.add(t);
    for (const t of targets) {
      if (!knownPaths.has(t)) return { ok: false, reason: `link/cross-link does not resolve to an ingested page: ${t}` };
    }
  }

  const hygiene = [...checkOutputHygiene(text, sourceText), ...checkLeakedLocalState(text)];
  if (hygiene.length) return { ok: false, reason: hygiene.map((h) => h.detail).join("; ") };

  return { ok: true };
}

function isValidUtf8NoNul(text: string): boolean {
  return !text.includes("�") && !text.includes("\u0000");
}

const CODE_CHECK_LINE_RE = /^-\s+(confirmed|corrected|absent|deprecated|unread|unverified)\s+`([^`]+)`(.*)$/;
/** The citation is the trailing `vendor/shopware/…:<line>`, however many ` — ` the clause itself contains. */
const CITATION_RE = /(vendor\/shopware\/[^\s:`]+):(\d+)\W*$/;
const NEEDS_CITATION = new Set(["confirmed", "corrected", "deprecated", "unread"]);
const DEPRECATION_MARKER_RE = /@deprecated|->setDeprecated\(|#\[Deprecated/;
/** Words inside a token that are syntax, not the identifier being checked. */
const NON_IDENTIFIER_WORDS = new Set(["string", "array", "void", "int", "bool", "float", "null", "mixed", "self", "static", "function", "public", "protected", "private", "abstract", "return", "true", "false"]);

/**
 * The identifiers a Code check token names: `A::b()` -> `b`, a FQCN -> its last segment, a signature
 * `iterate(?array $offset): ?X` -> `iterate`, `offset`, `X`. Tokens with `:`/`-` in a word (CLI command
 * names like `number-range:migrate`, dotted config keys) stay whole, so a citation must contain them verbatim.
 */
export function tokenIdentifiers(token: string): string[] {
  const out: string[] = [];
  for (const raw of token.replace(/::\s*\$/g, "::").split(/[\s(),?$|&<>=]+/)) {
    let seg = raw.replace(/^[^A-Za-z_\\]+|[^A-Za-z0-9_]+$/g, "");
    if (!seg || seg.includes("/")) continue;
    // A `Class::member` token's member is the identifier a citation must hold, however short
    // (`ApiRouteScope::ID`) — the length floor below exists to drop syntax noise from a bare
    // word, not to discard a member name the `::` already disambiguates from generic short words.
    const isMember = seg.includes("::");
    if (isMember) seg = seg.split("::").pop()!;
    if (seg.includes("\\")) seg = seg.split("\\").filter(Boolean).pop() ?? "";
    if (!isMember && (seg.length < 3 || NON_IDENTIFIER_WORDS.has(seg.toLowerCase()))) continue;
    // A `Class::MEMBER` member is always a real identifier, however syntax-like the bare word
    // would look (`CustomFieldTypes::INT`, `::FLOAT`, `::BOOL`) — the `::` already disambiguates
    // it from a type-hint or keyword, so NON_IDENTIFIER_WORDS must not filter it out.
    if (isMember && !seg) continue;
    out.push(seg);
    // A dotted config key (`config.connection`) is declared node by node in the Symfony tree builder,
    // so its leaf is what the cited line holds, verbatim, even when the leaf is a word like `public`
    // or `private` that would read as syntax noise on its own — the dot already disambiguates it as
    // a key name, so NON_IDENTIFIER_WORDS must not filter it out. Colon-bearing CLI names stay whole.
    if (seg.includes(".") && !seg.includes(":")) {
      const leaf = seg.split(".").pop()!;
      if (leaf.length >= 2) out.push(leaf);
    }
  }
  return out;
}

/** The one identifier a status is about: the member of `A::b`, otherwise the first identifier in the token. */
function primaryIdentifier(token: string): string | undefined {
  const member = /::\s*\$?([A-Za-z_][A-Za-z0-9_]*)/.exec(token);
  return member ? member[1] : tokenIdentifiers(token)[0];
}

/** A line that is a docblock line, a `//` / `{# #}` comment, or a self-contained (balanced
 *  brackets) single-line attribute — the shapes a declaration's own annotation stack is
 *  made of. A multi-line attribute's opening line (e.g. `#[AsCommand(`) is unbalanced and does
 *  not count, so climbing stops at the interior of the call instead of tunnelling through it
 *  up to a docblock that annotates the enclosing declaration, not the cited line itself. */
function isAnnotationLine(line: string): boolean {
  const t = line.trim();
  if (!t) return false;
  if (t.startsWith("/**") || t.startsWith("*")) return true;
  if (t.startsWith("//")) return true;
  if (t.startsWith("{#") && t.endsWith("#}")) return true;
  if (t.startsWith("#[")) {
    const opens = (t.match(/[[(]/g) ?? []).length;
    const closes = (t.match(/[\])]/g) ?? []).length;
    return opens === closes;
  }
  return false;
}

/**
 * The declaration a cited line actually belongs to: that line plus every contiguous
 * docblock/attribute/comment line directly above it, with no blank line or unrelated code
 * breaking the chain. A common member name that collides with an unrelated declaration a few
 * lines away (the next method's docblock, a neighbouring field) never leaks into this window —
 * only the declaration's own annotations do, so a class-level `@deprecated` still counts when
 * the cited line is that class's own declaration line.
 */
export function ownDeclarationWindow(fileLines: string[], n: number): string {
  const idx = n - 1;
  if (idx < 0 || idx >= fileLines.length) return "";
  let start = idx;
  while (start > 0 && isAnnotationLine(fileLines[start - 1])) start--;
  return fileLines.slice(start, idx + 1).join("\n");
}

export function containsWord(text: string, word: string): boolean {
  const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(^|[^A-Za-z0-9_])${escaped}([^A-Za-z0-9_]|$)`).test(text);
}

/**
 * A token that names a file rather than a code identifier (a template, a config file:
 * `page/search/index.html.twig`, `shopware.yaml`) — whole-word, dotted extension, no whitespace
 * (a CLI command like `bin/console number-range:migrate` has both a space and a `:`, so it never
 * qualifies here).
 */
export function isFilePathToken(token: string): boolean {
  return /^[\w./-]+\.[A-Za-z0-9]+$/.test(token.trim());
}

/**
 * A file-path token's own citation proves the file exists — the file cannot contain its own path
 * as a substring, so the ±3-line window check (built for code identifiers) does not apply. Only a
 * citation path that actually ends with the token, at a path-segment boundary, satisfies it; a
 * token citing a different file must still fail on the file-path token alone.
 */
export function citationNamesToken(token: string, path: string): boolean {
  return isFilePathToken(token) && (path === token.trim() || path.endsWith(`/${token.trim()}`));
}

/** The identifiers a line's cited window may contain: the token's, plus a `corrected` clause's backticked ones. */
export function citationCandidates(status: string, token: string, rest: string): string[] {
  const clauseIdentifiers = [...rest.replace(CITATION_RE, "").matchAll(/`([^`]+)`/g)].flatMap((c) => tokenIdentifiers(c[1]));
  return status === "corrected" ? [...tokenIdentifiers(token), ...clauseIdentifiers] : tokenIdentifiers(token);
}

/**
 * Finds the first `## Code check (<version>)` heading that is not inside a fenced code
 * block (a same-looking line inside a code sample is never mistaken for the real section) —
 * shared by `validateCodeCheckSection` and `repairCodeCheckLineNumbers`. Returns the pinned
 * version and the char offset in `text` right after the heading line.
 */
export function findCodeCheckHeading(text: string): { version: string; sectionStart: number } | undefined {
  const lines = text.split("\n");
  for (const { title, index } of h2HeadingLines(lines)) {
    const m = /^Code check \(([^)]+)\)$/.exec(title);
    if (m) return { version: m[1], sectionStart: lines.slice(0, index + 1).join("\n").length + 1 };
  }
  return undefined;
}

/**
 * Every identifier a page's own `## Code check (...)` section has already marked `unverified`
 * (page schema statuses: `confirmed | corrected | absent | deprecated | unread | unverified`) —
 * the writer's own honest "out of scope" disclosure, e.g. a third-party symbol
 * (`guzzlehttp/promises`'s `Utils::settle()`) that a `shopware/shopware` source checkout
 * structurally cannot index. `wiki:lint`'s Tier 0 re-scan (`lintCodeCheck`) must not flag an
 * identifier the page already disclosed as unverified: that would contradict the page's own
 * disclosure instead of trusting it. Both the raw token and its `tokenIdentifiers()` breakdown
 * are included, so a bare member name (`Utils::settle()` -> `settle`) matches whichever form
 * `flagIdentifiers` reports.
 */
export function unverifiedIdentifiers(body: string): Set<string> {
  const names = new Set<string>();
  const heading = findCodeCheckHeading(body);
  if (!heading) return names;
  const lines = body
    .slice(heading.sectionStart)
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.startsWith("-"));
  for (const line of lines) {
    const m = CODE_CHECK_LINE_RE.exec(line);
    if (!m || m[1] !== "unverified") continue;
    names.add(m[2].trim());
    for (const id of tokenIdentifiers(m[2])) names.add(id);
  }
  return names;
}

/**
 * Line numbers are the brittle part of a writer's citation, not the claim. When the cited ±3-line window
 * lacks every candidate identifier but the cited file contains one, the citation is re-pointed at the
 * first such line. A token absent from the cited file is left alone, so the gate still rejects it.
 */
export function repairCodeCheckLineNumbers(text: string, root: CodeRoot): string {
  const heading = findCodeCheckHeading(text);
  if (!heading) return text;
  const start = heading.sectionStart;
  const section = text.slice(start).split("\n").map((line) => {
    const m = CODE_CHECK_LINE_RE.exec(line.trim());
    if (!m || !NEEDS_CITATION.has(m[1])) return line;
    const citation = CITATION_RE.exec(m[3]);
    if (!citation) return line;
    const abs = resolveCodeCitationPath(root, citation[1]);
    if (!abs || !existsSync(abs)) return line;
    const fileLines = readFileSync(abs, "utf8").split("\n");
    const n = Number(citation[2]);
    const candidates = citationCandidates(m[1], m[2], m[3]);
    const window = fileLines.slice(Math.max(0, n - 4), Math.min(fileLines.length, n + 3)).join("\n");
    if (candidates.some((c) => containsWord(window, c)) || window.includes(m[2].trim())) return line;
    const found = fileLines.findIndex((l) => candidates.some((c) => containsWord(l, c)));
    if (found === -1) return line;
    return line.replace(`${citation[1]}:${citation[2]}`, `${citation[1]}:${found + 1}`);
  });
  return text.slice(0, start) + section.join("\n");
}

/** Ingest gate rules 1-6 (design doc "Ingest gate") for a `codeCheck` item's output. */
export function validateCodeCheckSection(item: PageWorkItem, body: string, codeCtx: CodeCheckCtx | undefined): string | undefined {
  if (!item.codeCheck) return undefined;
  const coreVersion = item.codeCheck.coreVersion;

  // Rules 6b and 7 judge Key steps / Essential identifiers themselves, so they apply whether or not the
  // page carries a Code check section.
  if (codeCtx) {
    const keyText = extractSections(body, ["Key steps / config", "Essential identifiers"]);
    // Rule 6b: a source flag must not survive in another spelling (`shopware.number_range.redis_url`
    // flagged, `redis_url:` kept in a YAML block) — the dotted key's leaf counts as the same identifier.
    for (const flag of [...item.codeCheck.flags.absent, ...item.codeCheck.flags.deprecated, ...item.codeCheck.flags.unread]) {
      const leaf = flag.includes(".") && !flag.includes("\\") ? flag.split(".").pop()! : flag;
      if (containsWord(keyText, flag) || containsWord(keyText, leaf)) {
        return `Key steps / Essential identifiers still mention flagged identifier "${flag}" — move it to Gotchas, Version notes or Code check`;
      }
    }
    // Rule 7: a class snippet in Key steps that extends/implements an installed base must declare every
    // member the base obliges it to (abstract methods, interface methods) — read from the vendor file.
    const missing = missingRequiredMembers(extractSections(body, ["Key steps / config"]), codeCtx.root);
    if (missing.length) return `Key steps class snippet omits required members of its installed base: ${missing.join("; ")}`;
  }
  const heading = findCodeCheckHeading(body);

  // Every codeCheck item must carry the section — even with zero Tier 0 flags — so lint's
  // `codeCheckedAgainst is set` rule (lint.ts, lintCodeCheck) never disagrees with the gate.
  if (!heading) return "codeCheck item is missing the required ## Code check (...) section";
  if (heading.version !== coreVersion) return `## Code check section version ${heading.version} does not match codeCheckedAgainst ${coreVersion}`;

  const sectionBody = body.slice(heading.sectionStart);
  const lines = sectionBody.split("\n").map((l) => l.trim()).filter((l) => l.length > 0 && l.startsWith("-"));
  // The cap must never be lower than the number of Tier 0 flags the coverage rule (rule 5,
  // below) requires listed — max(10, flags) so a heavily-flagged source can still pass.
  const maxLines = Math.max(10, flagCount(item.codeCheck.flags));
  if (lines.length === 0) return "## Code check section has 0 lines — the section is present but empty";
  if (lines.length > maxLines) return `## Code check section has ${lines.length} lines, more than ${maxLines}`;

  const covered: { status: string; token: string }[] = []; // for the coverage check (rule 5)
  for (const line of lines) {
    const m = CODE_CHECK_LINE_RE.exec(line);
    if (!m) return `## Code check line does not match the required format: ${line}`;
    const [, status, token, rest] = m;
    covered.push({ status, token });
    const citation = CITATION_RE.exec(rest);
    const primary = primaryIdentifier(token);

    if (NEEDS_CITATION.has(status)) {
      if (!citation) return `## Code check line for "${token}" (${status}) is missing a vendor/shopware/...:<line> citation`;
      const [, path, lineNo] = citation;
      const abs = codeCtx ? resolveCodeCitationPath(codeCtx.root, path) : undefined;
      if (!abs || !existsSync(abs)) return `## Code check line cites a path that does not exist: ${path}`;
      const fileLines = readFileSync(abs, "utf8").split("\n");
      const n = Number(lineNo);
      const window = fileLines.slice(Math.max(0, n - 4), Math.min(fileLines.length, n + 3)).join("\n");
      // A `corrected` line names the docs' (wrong) identifier in the token and the code's in the clause.
      const candidates = citationCandidates(status, token, rest);
      const wholeToken = token.trim();
      if (
        !candidates.some((c) => containsWord(window, c)) &&
        !window.includes(wholeToken) &&
        !citationNamesToken(wholeToken, path)
      ) {
        return `## Code check line for "${token}" does not appear within +/-3 lines of ${path}:${lineNo}`;
      }
      if (status === "confirmed") {
        // Deprecation is judged at the declaration the cited line actually holds — its own
        // contiguous docblock/attributes directly above it, plus the line itself (a fluent
        // `->setDeprecated(`/attribute marker on the same line) — not a bare-name scan of a
        // fixed ±N window, which catches an unrelated neighbouring declaration's docblock
        // (the next method, a sibling field) instead of the cited one's.
        const docWindow = ownDeclarationWindow(fileLines, n);
        if (DEPRECATION_MARKER_RE.test(docWindow)) return `## Code check line marks "${token}" confirmed, but ${path}:${lineNo} carries a deprecation marker — use deprecated`;
      }
    }

    if (codeCtx && primary) {
      const isUnreadFlag = codeCtx.index.flags.has(primary) && (codeCtx.index.flags.get(primary) ?? 0) === 0;
      if (status === "confirmed" && isUnreadFlag) return `## Code check line marks "${token}" confirmed, but the index has it as an unread feature flag`;
      if (status === "absent") {
        // Tier 0 (flagIdentifiers) judges a namespaced token by its full FQCN — `index.classes.has(fqcn)`
        // — never by the bare last segment, because a class of the same short name can legitimately live
        // under a different Shopware namespace (e.g. `ThemeInterface` in Storefront while the docs cite
        // `Shopware\Core\...\ThemeInterface`). Judging "absent" by `primary`'s word count here would call
        // that shared word a hit and reject the very listing rule 5 requires, so a namespaced token is
        // judged the same way: by the FQCN's presence in `classes`/`literals`, not by the word index.
        const hit = token.includes("\\")
          ? codeCtx.index.classes.has(token.replace(/^\\/, "")) || codeCtx.index.literals.has(token)
          : (codeCtx.index.words.get(primary) ?? 0) > 0 || codeCtx.index.literals.has(token);
        if (hit) return `## Code check line marks "${token}" absent, but the index has hits for it`;
      }
    }
  }

  // Rule 5: coverage — every Tier 0 flag from the source must be listed with the same status
  // (the flag may sit inside a longer token, e.g. `EntityExtension::getDefinitionClass()`).
  for (const [list, status] of [
    [item.codeCheck.flags.absent, "absent"],
    [item.codeCheck.flags.deprecated, "deprecated"],
    [item.codeCheck.flags.unread, "unread"],
  ] as const) {
    for (const flag of list) {
      const listed = covered.some((c) => c.status === status && (c.token === flag || containsWord(c.token, flag)));
      if (!listed) return `## Code check section does not list "${flag}" as ${status} (Tier 0 flagged it)`;
    }
  }

  // Rule 6: the writer must not introduce a new phantom identifier while rewriting Key
  // steps / Essential identifiers to code truth.
  if (codeCtx) {
    const keySections = extractSections(body, ["Key steps / config", "Essential identifiers"]);
    const outputFlags = flagIdentifiers(keySections, codeCtx.index);
    if (outputFlags.absent.length || outputFlags.deprecated.length || outputFlags.unread.length) {
      return `Key steps / Essential identifiers still contain flagged identifiers: ${[...outputFlags.absent, ...outputFlags.deprecated, ...outputFlags.unread].join(", ")}`;
    }
  }

  return undefined;
}

/**
 * Text of the named `## ` sections only (used by the phantom-identifier gate, rule 6; reused
 * by wiki:lint). A `## `-looking line inside fenced code never toggles the capture, but the
 * fenced lines themselves are captured while a section is open (rule 6b's YAML example).
 */
export function extractSections(body: string, headings: string[]): string {
  const lines = body.split("\n");
  const fenced = fencedLines(lines);
  const parts: string[] = [];
  let capturing = false;
  lines.forEach((line, i) => {
    const headingMatch = fenced[i] ? null : /^##\s+(.+?)\s*$/.exec(line);
    if (headingMatch) capturing = headings.includes(headingMatch[1]);
    else if (capturing) parts.push(line);
  });
  return parts.join("\n");
}
