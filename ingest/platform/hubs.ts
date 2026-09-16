/**
 * `wiki:hubs` — hub generation. Hub scopes come from `config.json` `hubs[]`
 * when that list is non-empty (a pinned operator override); otherwise scopes are
 * auto-derived from the corpus's own page-frontmatter `keywords` (`deriveAutoHubScopes`)
 * — no human curation step: the pinned list wins when present, otherwise the corpus
 * describes its own hubs.
 *
 * Derivation reuses `synonyms.ts`'s page-collection/frontmatter-reading helpers but not
 * its `clusterConcepts` merge itself: that function is tuned to find tight near-duplicate
 * concepts for the synonyms file (`MIN_JACCARD` over the *whole* keyword set caps every
 * concept at ~2 pages on this corpus — measured, zero clusters reach the 4-page hub floor
 * below). A hub instead needs *breadth*: every page sharing one keyword, merged only when
 * two keywords cover near-identical page sets (`MERGE_JACCARD` over the *path* sets, not
 * the keyword sets).
 */
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { loadPlatformConfig, wikiRootFrom } from "../shared/config.js";
import { loadState, saveState } from "../shared/state.js";
import { cacheDirs, fileSha256, fileSize, ingestBatches, reportIngestOutcome, listAllFiles, promptHash, writeBatches } from "../shared/workitems.js";
import { validateHubFrontmatter, parsePage, checkFrontmatterShape } from "../shared/frontmatterValidate.js";
import { checkOutputHygiene, checkLeakedLocalState, checkPurity } from "../shared/hygiene.js";
import { wikiLinkTargets } from "../shared/links.js";
import { matchesAny } from "../shared/glob.js";
import { layerDir } from "./pagePrep.js";
import { collectPages, withFrontmatter } from "./synonyms.js";
import type { CliFlags, HubScope, HubStateEntry, PlatformConfig, WorkItem } from "../shared/types.js";

const LAYER_DIR = layerDir();
const PROMPT_PATH = resolve(LAYER_DIR, "prompts/hub.md");

export async function run(flags: CliFlags): Promise<number> {
  const config = loadPlatformConfig();
  const state = loadState();

  if (flags.ingest) return runIngest(config, state, flags);
  if (flags.retryFailed) return runPrepare(config, state, flags, true);
  if (flags.prepare) return runPrepare(config, state, flags, false);
  process.stderr.write("wiki:hubs: one of --prepare, --ingest, --retry-failed is required\n");
  return 1;
}

// A candidate keyword becomes a hub only if it is genuinely cross-cutting: enough pages
// carry it, spanning more than one directory (a keyword confined to one directory is
// already served by that directory's index.md and must not become a hub). Two candidates
// covering near-identical page sets (e.g. "plugin" / "plugins") merge into one hub instead
// of shipping near-duplicate hubs. Capped so the hub layer stays a short, high-value list.
const MIN_HUB_MEMBERS = 4;
const MERGE_JACCARD = 0.6;
const MAX_AUTO_HUBS = 30;

export interface HubPage {
  path: string;
  keywords: string[];
}

interface KeywordCandidate {
  keyword: string;
  paths: Set<string>;
}

interface HubCluster {
  canonicalKeyword: string;
  keywords: string[];
  paths: Set<string>;
}

function directoryOf(path: string): string {
  const idx = path.lastIndexOf("/");
  return idx === -1 ? "" : path.slice(0, idx);
}

function distinctDirCount(paths: Iterable<string>): number {
  return new Set([...paths].map(directoryOf)).size;
}

function slugify(keyword: string): string {
  return keyword
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function jaccard(a: Set<string>, b: Set<string>): number {
  let inter = 0;
  for (const x of a) if (b.has(x)) inter++;
  const union = a.size + b.size - inter;
  return union === 0 ? 0 : inter / union;
}

/**
 * Derives hub scopes from page-frontmatter keywords, no human list required.
 * Deterministic: candidates are ranked (member count, then distinct-directory count, then
 * keyword name) before merging, so the same corpus always produces the same hub set,
 * capped at `MAX_AUTO_HUBS`.
 */
export function deriveAutoHubScopes(pages: HubPage[]): HubScope[] {
  const byKeyword = new Map<string, Set<string>>();
  for (const p of pages) {
    for (const kw of new Set(p.keywords.map((k) => k.toLowerCase()))) {
      if (!byKeyword.has(kw)) byKeyword.set(kw, new Set());
      byKeyword.get(kw)!.add(p.path);
    }
  }

  const candidates: KeywordCandidate[] = [...byKeyword.entries()]
    .map(([keyword, paths]) => ({ keyword, paths }))
    .filter((c) => c.paths.size >= MIN_HUB_MEMBERS && distinctDirCount(c.paths) > 1)
    .sort((a, b) => b.paths.size - a.paths.size || distinctDirCount(b.paths) - distinctDirCount(a.paths) || a.keyword.localeCompare(b.keyword));

  const clusters: HubCluster[] = [];
  for (const c of candidates) {
    const merge = clusters.find((h) => jaccard(h.paths, c.paths) >= MERGE_JACCARD);
    if (merge) {
      merge.keywords.push(c.keyword);
      for (const p of c.paths) merge.paths.add(p);
    } else {
      clusters.push({ canonicalKeyword: c.keyword, keywords: [c.keyword], paths: new Set(c.paths) });
    }
  }

  // Two clusters whose canonical keyword slugifies to the same path (e.g. "store api" and
  // "store-api") would otherwise ship as two hub items writing the same output path,
  // clobbering each other's ingest state and re-queuing forever — merge any such clusters
  // (union of keywords/paths) before ranking, keeping the first-created cluster's identity
  // for determinism (candidates are already ranked before clustering, so cluster creation
  // order is itself deterministic).
  const bySlug = new Map<string, HubCluster>();
  for (const cluster of clusters) {
    const slug = slugify(cluster.canonicalKeyword);
    const existing = bySlug.get(slug);
    if (existing) {
      for (const k of cluster.keywords) if (!existing.keywords.includes(k)) existing.keywords.push(k);
      for (const p of cluster.paths) existing.paths.add(p);
    } else {
      bySlug.set(slug, cluster);
    }
  }
  const dedupedClusters = [...bySlug.values()];

  const ranked = [...dedupedClusters].sort((a, b) => {
    if (b.paths.size !== a.paths.size) return b.paths.size - a.paths.size;
    const dirsA = distinctDirCount(a.paths);
    const dirsB = distinctDirCount(b.paths);
    if (dirsB !== dirsA) return dirsB - dirsA;
    return a.canonicalKeyword.localeCompare(b.canonicalKeyword);
  });

  return ranked.slice(0, MAX_AUTO_HUBS).map((c) => ({
    slug: slugify(c.canonicalKeyword),
    title: c.canonicalKeyword,
    keywords: [...new Set(c.keywords)].sort(),
  }));
}

/** `config.hubs` is an optional pinned override; empty (the default) means auto-derive. */
function resolveHubScopes(config: PlatformConfig, wikiRoot: string, state: ReturnType<typeof loadState>): HubScope[] {
  if (config.hubs.length > 0) return config.hubs;
  return deriveAutoHubScopes(withFrontmatter(wikiRoot, collectPages(state)));
}

export interface HubMemberInfo {
  path: string;
  title: string;
  summary: string;
  keywords: string[];
}

/** A member's own built frontmatter, read once per prepare and handed to the writer so it
 *  never has to open every member file itself to learn title/summary/keywords. */
export function memberInfoFor(wikiRoot: string, path: string): HubMemberInfo {
  const abs = resolve(wikiRoot, path);
  if (!existsSync(abs)) return { path, title: path, summary: "", keywords: [] };
  const { frontmatter } = parsePage(readFileSync(abs, "utf8"));
  return {
    path,
    title: String(frontmatter.title ?? path),
    summary: String(frontmatter.summary ?? ""),
    keywords: Array.isArray(frontmatter.keywords) ? (frontmatter.keywords as string[]).map((k) => String(k)) : [],
  };
}

/**
 * Membership is the union of `pathPrefixes` (plain prefix or glob) and `keywords` — a page
 * qualifies if it shares any keyword (case-insensitive) with the scope, read from its own
 * built frontmatter. A scope may use either or both.
 */
export function hubMemberPaths(scope: HubScope, wikiRoot: string, state: ReturnType<typeof loadState>, sourceFilter?: string): string[] {
  const prefixes = scope.pathPrefixes ?? [];
  const keywords = new Set((scope.keywords ?? []).map((k) => k.toLowerCase()));
  if (prefixes.length === 0 && keywords.size === 0) return [];
  const members = new Set<string>();
  for (const [sourceId, p] of Object.entries(state.sources)) {
    if (sourceFilter && sourceId !== sourceFilter) continue;
    for (const [path, entry] of Object.entries(p.pages)) {
      if (entry.hash === undefined) continue; // unpublished / never fetched
      if (entry.builtHash === undefined) continue; // never successfully built
      if (prefixes.length > 0 && (prefixes.some((prefix) => path.startsWith(prefix)) || matchesAny(path, prefixes))) {
        members.add(path);
        continue;
      }
      if (keywords.size > 0 && memberInfoFor(wikiRoot, path).keywords.some((k) => keywords.has(k.toLowerCase()))) members.add(path);
    }
  }
  return [...members].sort();
}

export function isDirty(scope: HubScope, memberPaths: string[], state: ReturnType<typeof loadState>, currentPromptHash: string): boolean {
  const hubState = state.hubs[scope.slug];
  if (!hubState) return true;
  if (hubState.hubPromptHash !== currentPromptHash) return true;
  if (JSON.stringify([...hubState.memberPaths].sort()) !== JSON.stringify(memberPaths)) return true;
  const snapshot = hubState.memberBuiltHashes ?? {};
  for (const [, p] of Object.entries(state.sources)) {
    for (const path of memberPaths) {
      const entry = p.pages[path];
      if (!entry) continue;
      // A member whose last ingest attempt failed keeps hash !== builtHash forever (the
      // page can't rebuild itself here) — treating that as "dirty" would re-prepare this
      // hub on every run even right after a successful hub ingest. Only an actually
      // rebuildable member (not failed) counts for this signal.
      if (!entry.failed && entry.hash !== undefined && entry.hash !== entry.builtHash) return true;
      // A member that was `failed` (or new) when this hub was last built and has since
      // rebuilt to a *different* builtHash now shows hash === builtHash again — the check
      // above sees nothing pending, but the hub's own snapshot of that member is stale.
      // `snapshot[path] === undefined` (this member wasn't part of the hub's last build, or
      // predates this field) is deliberately not treated as a mismatch here.
      if (entry.builtHash !== undefined && snapshot[path] !== undefined && snapshot[path] !== entry.builtHash) return true;
    }
  }
  return false;
}

/** Current `builtHash` for every member path, looked up across every source — the snapshot
 *  `isDirty` compares a hub's next prepare against. */
function memberBuiltHashSnapshot(state: ReturnType<typeof loadState>, memberPaths: string[]): Record<string, string> {
  const snapshot: Record<string, string> = {};
  for (const path of memberPaths) {
    for (const p of Object.values(state.sources)) {
      const entry = p.pages[path];
      if (entry?.builtHash !== undefined) {
        snapshot[path] = entry.builtHash;
        break;
      }
    }
  }
  return snapshot;
}

function runPrepare(config: PlatformConfig, state: ReturnType<typeof loadState>, flags: CliFlags, retry: boolean): number {
  const wikiRoot = wikiRootFrom(flags, config);
  const currentPromptHash = promptHash(PROMPT_PATH);
  const outDir = resolve(cacheDirs(LAYER_DIR).outDir, "hubs");
  const items: WorkItem[] = [];

  for (const scope of resolveHubScopes(config, wikiRoot, state)) {
    const memberPaths = hubMemberPaths(scope, wikiRoot, state, flags.source);
    if (memberPaths.length === 0) continue;
    const hubState = state.hubs[scope.slug];
    const needsWork = retry ? hubState?.hubState === "failed" : flags.all || isDirty(scope, memberPaths, state, currentPromptHash);
    if (!needsWork) continue;
    items.push({
      path: `platform/hubs/${scope.slug}.md`,
      outputPath: resolve(outDir, `${scope.slug}.md`),
      frontmatter: { id: `platform/hubs/${scope.slug}.md`, title: scope.title },
      members: memberPaths,
      memberInfo: memberPaths.map((p) => memberInfoFor(wikiRoot, p)),
      wikiRoot,
    });
  }

  // One hub per batch file: the skill launches exactly one writer agent per hub
  // (SKILL.md Step 5, "one agent per dirty hub"), so a batch must never bundle two.
  const files = writeBatches(LAYER_DIR, "hubs", items, PROMPT_PATH, 1, undefined, { reset: flags.resetBatches });
  process.stdout.write(JSON.stringify({ cmd: "hubs", mode: "prepare", ...(retry ? { retry: true } : {}), batches: files.length, items: items.length, files }) + "\n");
  return 0;
}

function runIngest(config: PlatformConfig, state: ReturnType<typeof loadState>, flags: CliFlags): number {
  const wikiRoot = wikiRootFrom(flags, config);
  const currentPromptHash = promptHash(PROMPT_PATH);
  const outPhaseDir = resolve(cacheDirs(LAYER_DIR).outDir, "hubs");
  const knownPaths = collectOkPaths(state);

  const outcome = ingestBatches(LAYER_DIR, wikiRoot, "hubs", (item, outAbsPath) => validateHubOutput(item, outAbsPath, config, knownPaths), { batches: flags.batches });
  const skipped = listAllFiles(outPhaseDir).length;

  for (const { path, item } of outcome.ok) {
    const slug = path.replace(/^platform\/hubs\//, "").replace(/\.md$/, "");
    const memberPaths = (item.members as string[]) ?? [];
    state.hubs[slug] = {
      slug,
      memberPaths,
      hubState: "ok",
      hubPromptHash: currentPromptHash,
      hubHash: fileSha256(resolve(wikiRoot, path)),
      memberBuiltHashes: memberBuiltHashSnapshot(state, memberPaths),
      lastBuilt: new Date().toISOString().slice(0, 10),
    };
  }
  for (const f of outcome.failed) persistFailedHub(state, f.path, f.item, currentPromptHash);
  saveState(state);

  return reportIngestOutcome("hubs", outcome, skipped);
}

/**
 * Persists a failed hub attempt's own `members`, not just the previous `ok` state's (or an
 * empty default) — so the next non-retry `--prepare`'s `isDirty` sees "unchanged inputs"
 * and leaves it out instead of re-queuing forever (design doc "no endless re-prepare
 * loop"). Exported for direct unit-testing without a full `run()`/`loadState()` round trip.
 */
export function persistFailedHub(state: { hubs: Record<string, HubStateEntry> }, path: string, item: WorkItem, currentPromptHash: string): void {
  const slug = path.replace(/^platform\/hubs\//, "").replace(/\.md$/, "");
  const attemptedMembers = (item.members as string[] | undefined) ?? state.hubs[slug]?.memberPaths ?? [];
  state.hubs[slug] = { ...(state.hubs[slug] ?? { memberPaths: [] }), slug, memberPaths: attemptedMembers, hubState: "failed", hubPromptHash: currentPromptHash };
}

/** Every page ingested so far, plus every already-`ok` hub — a hub body may legitimately
 *  link a sibling hub (deprecated topic → replacement, `dal` ↔ `data-abstraction-layer`),
 *  not only its own members. */
function collectOkPaths(state: ReturnType<typeof loadState>): Set<string> {
  const set = new Set<string>();
  for (const p of Object.values(state.sources)) {
    for (const [path, entry] of Object.entries(p.pages)) if (entry.builtHash !== undefined) set.add(path);
  }
  for (const [slug, hub] of Object.entries(state.hubs)) {
    if (hub.hubState === "ok") set.add(`platform/hubs/${slug}.md`);
  }
  return set;
}

export function validateHubOutput(item: WorkItem, outAbsPath: string, config: PlatformConfig, knownPaths: Set<string>): { ok: true } | { ok: false; reason: string } {
  const size = fileSize(outAbsPath);
  if (size > config.sizeLimits.hubMaxBytes) return { ok: false, reason: `hub exceeds ${config.sizeLimits.hubMaxBytes} bytes (${size})` };

  const text = readFileSync(outAbsPath, "utf8");
  for (const issue of checkFrontmatterShape(text)) return { ok: false, reason: issue.message };

  const { frontmatter, body } = parsePage(text);
  if (frontmatter.id !== item.path) return { ok: false, reason: `frontmatter id ${String(frontmatter.id)} does not match output path ${item.path}` };

  const issues = validateHubFrontmatter(frontmatter);
  if (issues.length) return { ok: false, reason: issues.map((i) => `${i.field}: ${i.message}`).join("; ") };

  const expectedMembers = [...((item.members as string[]) ?? [])].sort();
  const gotMembers = [...((frontmatter.members as string[]) ?? [])].sort();
  if (JSON.stringify(expectedMembers) !== JSON.stringify(gotMembers)) {
    return { ok: false, reason: "members[] does not match the member set given in the work item" };
  }
  for (const m of expectedMembers) {
    if (!knownPaths.has(m)) return { ok: false, reason: `member path not an ingested page: ${m}` };
  }

  for (const m of body.matchAll(/\]\(([^\s)]+\.md[^\s)]*)\)/g)) {
    if (!m[1].startsWith("platform/")) return { ok: false, reason: `link is not wiki-root-relative starting with platform/: ${m[1]}` };
  }

  // hub.md's own rules ("Rules" section): every link must be a given member path — the
  // only other legitimate target is a sibling hub (hub→hub navigation, see collectOkPaths) —
  // and every member must actually be linked at least once (`members` must be *both*
  // named in the frontmatter, checked above, and reachable from the body).
  const memberSet = new Set(expectedMembers);
  const linkTargets = wikiLinkTargets(body);
  for (const target of linkTargets) {
    if (!knownPaths.has(target)) return { ok: false, reason: `link target does not exist in the wiki: ${target}` };
    if (!memberSet.has(target) && !target.startsWith("platform/hubs/")) {
      return { ok: false, reason: `link target is neither a given member nor a hub: ${target}` };
    }
  }
  const linked = new Set(linkTargets);
  for (const m of expectedMembers) {
    if (!linked.has(m)) return { ok: false, reason: `member page is never linked in the hub body: ${m}` };
  }

  const hygiene = [...checkOutputHygiene(text), ...checkLeakedLocalState(text), ...checkPurity(text)];
  if (hygiene.length) return { ok: false, reason: hygiene.map((h) => h.detail).join("; ") };

  return { ok: true };
}
