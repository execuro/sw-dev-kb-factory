/**
 * `wiki:sync` — Phase 1 (enumerate) + Phase 2 (reconcile), refresh spec.
 * The only phase that touches the network. Writes ingest/platform/state.json
 * and sanitised source text into ingest/platform/.cache/src/.
 */
import { existsSync, mkdirSync, readFileSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { basename, dirname, resolve } from "node:path";
import { ingestLayerDir, loadPlatformConfig } from "../shared/config.js";
import { sha256 } from "../shared/hash.js";
import { loadState, saveState } from "../shared/state.js";
import { cacheDirs, listAllFiles, promptHash } from "../shared/workitems.js";
import { cacheFilePath, fetchLimited, FetchAbortError, HostRateLimiter, writeSourceCache } from "../shared/fetchLimited.js";
import { matchesAny } from "../shared/glob.js";
import { isDocPagePath } from "../shared/hygiene.js";
import { githubBranchHeadUrl, githubRawContentUrl, githubTreeApiUrl, parseGithubTreeUrl, type ParsedGithubTree } from "../shared/githubUrl.js";
import { extractContainer, htmlToMarkdown, parseRevisions } from "./merchantHtml.js";
import type { CliFlags, GuidelineCodeCheckout, MerchantRevision, PlatformConfig, SourceConfig, SourceState, StatePageEntry, VersionEntry } from "../shared/types.js";

const LAYER_DIR = ingestLayerDir("platform");

function nowSeconds(): number {
  return Math.floor(Date.now() / 1000);
}

interface SourceSummary {
  source: string;
  new: number;
  changed: number;
  removed: number;
  unchanged: number;
  unpublished: number;
  fetched: number;
  aborted?: string;
}

interface SyncTarget {
  sourceId: string;
  source: SourceConfig;
  version?: VersionEntry;
}

export async function run(flags: CliFlags): Promise<number> {
  const config = loadPlatformConfig();
  const state = loadState();
  const dirs = cacheDirs(LAYER_DIR);
  const limiter = new HostRateLimiter(
    {
      "developer.shopware.com": config.rateLimits.developerDocsPerSecond,
      "raw.githubusercontent.com": config.rateLimits.developerDocsPerSecond,
      "docs.shopware.com": config.rateLimits.merchantDocsPerSecond,
    },
    4,
  );
  const limits = {
    allowlistHosts: config.allowlistHosts,
    timeoutMs: config.rateLimits.requestTimeoutMs,
    maxRedirects: config.rateLimits.maxRedirects,
    maxBodyBytes: config.rateLimits.maxBodyBytesDefault,
  };

  if (flags.source) {
    const [sourceId, versionPart] = flags.source.split(":");
    const source = config.sources.find((s) => s.id === sourceId);
    if (!source) {
      process.stderr.write(`wiki:sync: unknown source ${flags.source}\n`);
      return 1;
    }
    if (!source.active) {
      process.stderr.write(`wiki:sync: source ${flags.source} is not active (${source.deactivatedNote ?? "inactive"})\n`);
      return 1;
    }
    if (versionPart) {
      const version = source.versions?.find((v) => v.version === versionPart);
      if (!version) {
        process.stderr.write(`wiki:sync: unknown source ${flags.source}\n`);
        return 1;
      }
      if (!version.active) {
        process.stderr.write(`wiki:sync: source ${flags.source} is not active (${version.deactivatedNote ?? "inactive"})\n`);
        return 1;
      }
    }
  }

  const portalSource = config.sources.find((s) => s.id === "developer-portal");
  const portalActive = !!portalSource?.active;

  const targets: SyncTarget[] = [];
  for (const source of config.sources.filter((s) => s.active && s.docType.length > 0)) {
    if (source.versions?.some((v) => v.main)) {
      for (const v of source.versions) {
        if (!v.active || !v.main) continue;
        const sourceId = `${source.id}:${v.version}`;
        if (flags.source && flags.source !== sourceId) continue;
        targets.push({ sourceId, source, version: v });
      }
    } else {
      if (flags.source && flags.source !== source.id) continue;
      targets.push({ sourceId: source.id, source });
    }
  }

  const summaries: SourceSummary[] = [];
  let llmsTxtCache: Set<string> | undefined;
  const repoCache = newRepoCache();

  let hadAbort = false;
  for (const target of targets) {
    process.stderr.write(`wiki:sync: source ${target.sourceId}\n`);
    let summary: SourceSummary;
    try {
      summary = target.version
        ? await syncDeveloperSource(target.sourceId, target.source, target.version, config, portalSource, portalActive, state, dirs, limiter, limits, repoCache, async () => {
            if (!llmsTxtCache) llmsTxtCache = await fetchLlmsTxt(portalSource!, limiter, limits);
            return llmsTxtCache;
          })
        : await syncMerchantSource(target.sourceId, target.source, config, state, dirs, limiter, limits);
    } catch (err) {
      if (err instanceof FetchAbortError) {
        process.stderr.write(`wiki:sync: source ${target.sourceId} aborted: ${err.message}\n`);
        hadAbort = true;
        summaries.push({ source: target.sourceId, new: 0, changed: 0, removed: 0, unchanged: 0, unpublished: 0, fetched: 0, aborted: err.message });
        // Every target — aborted or not — prints exactly one stdout JSON line (checkpoint-report.md,
        // Checkpoint 1: "per-target fetched/skipped/error"), so a caller reading stdout alone can see
        // every in-scope target accounted for, not just the ones that completed.
        process.stdout.write(JSON.stringify({ cmd: "sync", source: target.sourceId, new: 0, changed: 0, removed: 0, unchanged: 0, unpublished: 0, fetched: 0, skipped: 0, error: err.message }) + "\n");
        continue;
      }
      throw err;
    }
    summaries.push(summary);
    const line = { cmd: "sync", source: summary.source, new: summary.new, changed: summary.changed, removed: summary.removed, unchanged: summary.unchanged, unpublished: summary.unpublished, fetched: summary.fetched };
    process.stdout.write(JSON.stringify(line) + "\n");
  }

  const guidelinesConfig = config.guidelines;
  if (guidelinesConfig?.enabled) {
    for (const [version, checkout] of Object.entries(guidelinesConfig.codeCheckouts)) {
      if (!codeCheckoutInScope(flags, version)) continue;
      process.stderr.write(`wiki:sync: code checkout ${version} (${checkout.repo})\n`);
      let result: { tag: string | null; fetched: number; skipped: boolean | number; error?: string };
      try {
        result = await syncCodeCheckout(version, checkout, limiter, limits);
      } catch (err) {
        if (!(err instanceof FetchAbortError)) throw err;
        process.stderr.write(`wiki:sync: code checkout ${version} aborted: ${err.message}\n`);
        result = { tag: null, fetched: 0, skipped: 0, error: err.message };
      }
      // Any code-checkout error (tag listing, no matching tag, clone/sparse-checkout, abort) fails
      // the run — otherwise the skill's exit-code check (SKILL.md Step 2) never notices 6.6 has no
      // code checkout and the `guidelines` phase quietly skips all of 6.6 while the run reports green.
      if (result.error) hadAbort = true;
      process.stdout.write(
        JSON.stringify({ cmd: "sync", source: `code-checkout:${version}`, version, tag: result.tag, fetched: result.fetched, skipped: result.skipped, error: result.error }) + "\n",
      );
    }
  }

  clearStaleFailedFlags(state);
  saveState(state);

  const totals = summaries.reduce(
    (acc, s) => ({
      new: acc.new + s.new,
      changed: acc.changed + s.changed,
      removed: acc.removed + s.removed,
      unchanged: acc.unchanged + s.unchanged,
      unpublished: acc.unpublished + s.unpublished,
      fetched: acc.fetched + s.fetched,
    }),
    { new: 0, changed: 0, removed: 0, unchanged: 0, unpublished: 0, fetched: 0 },
  );
  process.stdout.write(JSON.stringify({ cmd: "sync", source: "*", ...totals }) + "\n");
  return hadAbort ? 2 : 0;
}

/** An aborted ingest run can leave `failed: true` on pages that have since been built
 *  (builtHash === hash under the current page prompt). The per-source loops above carry
 *  `previous?.failed` forward and skip unchanged entries entirely, so nothing else ever
 *  clears the flag and `--retry-failed` would rewrite healthy pages. */
function clearStaleFailedFlags(state: ReturnType<typeof loadState>): void {
  const pagePromptPath = resolve(LAYER_DIR, "prompts/page.md");
  if (!existsSync(pagePromptPath)) return;
  const currentPromptHash = promptHash(pagePromptPath);
  for (const source of Object.values(state.sources)) {
    for (const entry of Object.values(source.pages)) {
      if (entry.failed && entry.builtHash !== undefined && entry.builtHash === entry.hash && entry.promptHash === currentPromptHash) {
        entry.failed = undefined;
      }
    }
  }
}

async function fetchLlmsTxt(portalSource: SourceConfig, limiter: HostRateLimiter, limits: Parameters<typeof fetchLimited>[1]): Promise<Set<string>> {
  await limiter.wait("developer.shopware.com");
  const { body } = await fetchLimited(portalSource.endpoints!.llmsTxt!, limits);
  const urls = new Set<string>();
  for (const m of body.matchAll(/\((https:\/\/developer\.shopware\.com\/docs\/[^)\s]+)\)/g)) urls.add(m[1]);
  return urls;
}

async function fetchSitemap(portalSource: SourceConfig, limiter: HostRateLimiter, limits: Parameters<typeof fetchLimited>[1]): Promise<Set<string>> {
  await limiter.wait("developer.shopware.com");
  const { body } = await fetchLimited(portalSource.endpoints!.sitemap!, limits);
  const urls = new Set<string>();
  for (const m of body.matchAll(/<loc>([^<]+)<\/loc>/g)) urls.add(m[1]);
  return urls;
}

interface GithubTreeEntry {
  path: string;
  type: "blob" | "tree" | "commit";
  sha: string;
}

/** A non-2xx status or a body that doesn't parse as JSON becomes a `FetchAbortError` — the
 *  same "abort this target, keep going" signal the outer `sync` loop already handles for
 *  every source (never a raw `JSON.parse` `SyntaxError` bubbling up as a run-crashing throw). */
export function parseJsonResponse<T>(status: number, body: string, url: string): T {
  if (status < 200 || status >= 300) throw new FetchAbortError(`HTTP ${status} for ${url}: ${body.slice(0, 300)}`);
  try {
    return JSON.parse(body) as T;
  } catch {
    throw new FetchAbortError(`invalid JSON response for ${url}: ${body.slice(0, 300)}`);
  }
}

async function fetchTree(parsed: ParsedGithubTree, limiter: HostRateLimiter, limits: Parameters<typeof fetchLimited>[1]): Promise<GithubTreeEntry[]> {
  await limiter.wait("api.github.com");
  const headers: Record<string, string> = process.env.GITHUB_TOKEN ? { authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {};
  const url = githubTreeApiUrl(parsed);
  const { status, body } = await fetchLimited(url, limits, { headers });
  const treeParsed = parseJsonResponse<{ tree: GithubTreeEntry[] }>(status, body, url);
  return treeParsed.tree.filter((e) => e.type === "blob" && e.path.endsWith(".md"));
}

async function fetchBranchHeadSha(parsed: ParsedGithubTree, limiter: HostRateLimiter, limits: Parameters<typeof fetchLimited>[1]): Promise<string> {
  await limiter.wait("api.github.com");
  const headers: Record<string, string> = process.env.GITHUB_TOKEN ? { authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {};
  const url = githubBranchHeadUrl(parsed);
  const { status, body } = await fetchLimited(url, limits, { headers });
  const parsedBody = parseJsonResponse<{ object: { sha: string } }>(status, body, url);
  return parsedBody.object.sha;
}

/** Per-run memo of tree/head-sha fetches keyed by `owner/repo@branch`: one network call per
 *  GitHub tree per `sync` run. */
interface RepoCache {
  tree: Map<string, Promise<GithubTreeEntry[]>>;
  headSha: Map<string, Promise<string>>;
}

function newRepoCache(): RepoCache {
  return { tree: new Map(), headSha: new Map() };
}

function repoCacheKey(p: ParsedGithubTree): string {
  return `${p.owner}/${p.repo}@${p.branch}`;
}

function cachedFetchTree(parsed: ParsedGithubTree, cache: RepoCache, limiter: HostRateLimiter, limits: Parameters<typeof fetchLimited>[1]): Promise<GithubTreeEntry[]> {
  const key = repoCacheKey(parsed);
  let p = cache.tree.get(key);
  if (!p) {
    p = fetchTree(parsed, limiter, limits);
    cache.tree.set(key, p);
  }
  return p;
}

function cachedFetchBranchHeadSha(parsed: ParsedGithubTree, cache: RepoCache, limiter: HostRateLimiter, limits: Parameters<typeof fetchLimited>[1]): Promise<string> {
  const key = repoCacheKey(parsed);
  let p = cache.headSha.get(key);
  if (!p) {
    p = fetchBranchHeadSha(parsed, limiter, limits);
    cache.headSha.set(key, p);
  }
  return p;
}

/** The source's config `exclude` plus the repository-furniture predicate: one complete download
 *  serves the dev pages and the guidelines phase alike. Upstream `.docsignore` is not
 *  applied — it steers Shopware's own doc tooling, not what is published — so `isDocPagePath` is
 *  what keeps the source repo's own `AGENTS.md`, `.github/**` and friends from being ingested as
 *  pages and published as documentation. It is belt-and-braces with the `exclude` globs: the
 *  globs are per-source and editable, the predicate is the floor no source can drop below. */
export function filterBySourceGlobs(entries: GithubTreeEntry[], excludeGlobs: string[]): GithubTreeEntry[] {
  return entries.filter((e) => isDocPagePath(e.path) && !matchesAny(e.path, excludeGlobs));
}

/** sha256 over the slice of config that decides which pages this source produces
 *  (exclude globs, this version's entry, wikiDir) — the unchanged-HEAD fast path in
 *  `syncDeveloperSource` requires this to match `sourceState.configHash` too, so editing
 *  `exclude` (or the version entry) takes effect on the next sync instead of waiting for
 *  an upstream commit (types.ts, `SourceState.configHash`). */
export function developerConfigHash(source: SourceConfig, version: VersionEntry): string {
  return sha256(JSON.stringify({ exclude: source.exclude, version, wikiDir: source.wikiDir }));
}

export function sourcePathToWikiPath(path: string, wikiDir: string): string {
  const withDirIndex = path.replace(/(^|\/)index\.md$/, "$1_index.md");
  return `${wikiDir}/${withDirIndex}`;
}

function sourcePathToUrl(path: string, version: VersionEntry, portalOrigin: string): string {
  if (/(^|\/)index\.md$/.test(path)) {
    const dir = path.replace(/(^|\/)index\.md$/, "$1");
    return `${portalOrigin}${version.urlPrefix}${dir}`;
  }
  return `${portalOrigin}${version.urlPrefix}${path.replace(/\.md$/, ".html")}`;
}

/** Exported for `test/sync-failures.test.ts` (mocked `fetch`, no real network): the cache-restore
 *  fix for built pages whose `.cache/src/` entry was lost (e.g. a fresh clone or `.cache` wipe). */
export async function syncDeveloperSource(
  sourceId: string,
  source: SourceConfig,
  version: VersionEntry,
  config: PlatformConfig,
  portalSource: SourceConfig | undefined,
  portalActive: boolean,
  state: { sources: Record<string, SourceState> },
  dirs: ReturnType<typeof cacheDirs>,
  limiter: HostRateLimiter,
  limits: Parameters<typeof fetchLimited>[1],
  repoCache: RepoCache,
  getLlmsTxt: () => Promise<Set<string>>,
): Promise<SourceSummary> {
  const parsed = parseGithubTreeUrl(version.main!);
  if (!parsed) throw new FetchAbortError(`invalid main URL for ${sourceId}: ${version.main}`);

  const sourceState = state.sources[sourceId] ?? { headSha: null, lastSync: null, pages: {} };
  const headSha = await cachedFetchBranchHeadSha(parsed, repoCache, limiter, limits);
  const srcDir = resolve(dirs.srcDir, ...sourceId.split(":"));
  const configHash = developerConfigHash(source, version);

  if (headSha === sourceState.headSha && configHash === sourceState.configHash) {
    const missingCache = Object.values(sourceState.pages).some(
      (p) => p.hash !== undefined && !existsSync(cacheFilePath(srcDir, p.hash)),
    );
    if (!missingCache) {
      const unchanged = Object.keys(sourceState.pages).length;
      return { source: sourceId, new: 0, changed: 0, removed: 0, unchanged, unpublished: 0, fetched: 0 };
    }
    // headSha unchanged but some pages — dirty or already built — lost their cached source
    // text (ingest/platform/.cache/ is ephemeral and gitignored, state/ is not); the
    // guidelines phase reads built pages' cache too (one download serves both), so fall through to
    // reconcile and re-fetch whatever cache file is missing.
  }

  const portalOrigin = portalSource?.endpoints?.main ?? "https://developer.shopware.com";
  const wikiDir = `${source.wikiDir}/${version.version}`;

  const [tree, sitemap, llmsTxt] = await Promise.all([
    cachedFetchTree(parsed, repoCache, limiter, limits),
    portalActive ? fetchSitemap(portalSource!, limiter, limits) : Promise.resolve(new Set<string>()),
    portalActive ? getLlmsTxt() : Promise.resolve(new Set<string>()),
  ]);

  const included = filterBySourceGlobs(tree, source.exclude);

  const summary: SourceSummary = { source: sourceId, new: 0, changed: 0, removed: 0, unchanged: 0, unpublished: 0, fetched: 0 };
  const seen = new Set<string>();

  for (const entry of included) {
    const wikiPath = sourcePathToWikiPath(entry.path, wikiDir);
    const sourceUrl = sourcePathToUrl(entry.path, version, portalOrigin);
    seen.add(wikiPath);
    const previous = sourceState.pages[wikiPath];
    const unpublished = portalActive ? !llmsTxt.has(sourceUrl) && !sitemap.has(sourceUrl) : false;

    if (unpublished) {
      // Kept in state for visibility (refresh spec Phase 2), but "not fetched" — same
      // `hash` absent signal every downstream phase already treats as "nothing to build".
      sourceState.pages[wikiPath] = { sourceUrl, date: previous?.date ?? nowSeconds() };
      summary.unpublished++;
      continue;
    }

    const hashUnchanged = previous?.hash === entry.sha;
    const cacheMissing = previous?.hash !== undefined && !existsSync(cacheFilePath(srcDir, previous.hash));

    if (hashUnchanged && !cacheMissing) {
      summary.unchanged++;
      continue; // entry already correct in sourceState.pages, nothing to change
    }

    // Spread `previous` first so fields sync never recomputes (codeHash, sharedFrom,
    // revisions) survive a cache-only miss (types.ts, `StatePageEntry.codeHash`/`sharedFrom`) —
    // then override exactly the fields this reconcile pass does recompute. A page whose
    // content genuinely changed still gets fresh sourceUrl/hash/date here; codeHash/sharedFrom
    // are re-stamped by `pages.ts` on the next successful build regardless.
    const pageState: StatePageEntry = {
      ...previous,
      sourceUrl,
      hash: entry.sha,
      date: hashUnchanged ? (previous?.date ?? nowSeconds()) : nowSeconds(),
      fetchError: undefined,
    };
    try {
      await limiter.wait("raw.githubusercontent.com");
      const url = githubRawContentUrl(parsed, entry.path);
      const res = await fetchLimited(url, limits);
      // A non-2xx body (rate-limit page, 5xx error page) must never be cached as page
      // content — record it as a fetch failure for this page instead (mirrors the merchant
      // source's status check below, syncMerchantSource).
      if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
      writeSourceCache(srcDir, res.body, entry.sha);
      summary.fetched++;
    } catch (err) {
      pageState.fetchError = (err instanceof Error ? err.message : String(err)).slice(0, 200);
    }
    sourceState.pages[wikiPath] = pageState;
    if (hashUnchanged) summary.unchanged++;
    else if (previous) summary.changed++;
    else summary.new++;
  }

  // Removal is detected fresh every run by presence-diffing against the previous snapshot,
  // so nothing needs to persist for it — a removed path is simply dropped from the map.
  for (const wikiPath of Object.keys(sourceState.pages)) {
    if (!seen.has(wikiPath)) {
      delete sourceState.pages[wikiPath];
      summary.removed++;
    }
  }

  sourceState.headSha = headSha;
  sourceState.configHash = configHash;
  sourceState.lastSync = new Date().toISOString();
  state.sources[sourceId] = sourceState;
  return summary;
}

interface GithubTag {
  name: string;
}

async function fetchTags(owner: string, repo: string, limiter: HostRateLimiter, limits: Parameters<typeof fetchLimited>[1]): Promise<string[]> {
  const names: string[] = [];
  const headers: Record<string, string> = process.env.GITHUB_TOKEN ? { authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {};
  for (let page = 1; page <= 10; page++) {
    await limiter.wait("api.github.com");
    const url = `https://api.github.com/repos/${owner}/${repo}/tags?per_page=100&page=${page}`;
    const { status, body } = await fetchLimited(url, limits, { headers });
    const tags = parseJsonResponse<GithubTag[]>(status, body, url);
    names.push(...tags.map((t) => t.name));
    if (tags.length < 100) break;
  }
  return names;
}

function parseFourPartVersion(tag: string): [number, number, number, number] | null {
  const m = /^v?(\d+)\.(\d+)\.(\d+)(?:\.(\d+))?$/.exec(tag);
  if (!m) return null;
  return [Number(m[1]), Number(m[2]), Number(m[3]), Number(m[4] ?? 0)];
}

/** Semver-picks the highest tag matching `tagPattern` (glob, e.g. `"v6.6.*"`) out of
 *  `tagNames`, for a code checkout configured with a pattern instead of an exact tag.
 *  Non-`vN.N.N[.N]`-shaped tags
 *  (release candidates, etc.) never parse and are dropped rather than mis-sorted. */
export function pickLatestTag(tagNames: string[], tagPattern: string): string | undefined {
  const candidates = tagNames
    .filter((t) => matchesAny(t, [tagPattern]))
    .map((t) => ({ t, v: parseFourPartVersion(t) }))
    .filter((x): x is { t: string; v: [number, number, number, number] } => x.v !== null);
  candidates.sort((a, b) => {
    for (let i = 0; i < 4; i++) if (a.v[i] !== b.v[i]) return b.v[i] - a.v[i];
    return 0;
  });
  return candidates[0]?.t;
}

/** Only the paths `codeIndex.ts`'s checkout mode needs: `src/Core`, `src/Storefront`, the
 *  administration app's `src`/`technical-docs`,
 *  its own `AGENTS.md`, plus every nested `AGENTS.md` anywhere in the tree. */
const CODE_CHECKOUT_INCLUDE_GLOBS = [
  "src/Core/**",
  "src/Storefront/**",
  "src/Administration/Resources/app/administration/src/**",
  "src/Administration/Resources/app/administration/technical-docs/**",
  "src/Administration/Resources/app/administration/AGENTS.md",
  "**/AGENTS.md",
];

export function matchesCodeCheckoutIncludes(path: string): boolean {
  return matchesAny(path, CODE_CHECKOUT_INCLUDE_GLOBS);
}

/** A scoped `wiki:sync --source <x>` only needs the 6.6 git checkout when `<x>` is the
 *  `developer` source (whole or `:<version>`-scoped to this checkout's own version), whose
 *  download the guidelines phase reads — `merchant` has no use for `.cache/code/<v>/`. An
 *  unscoped run (`flags.source` absent) always includes it. */
export function codeCheckoutInScope(flags: CliFlags, version: string): boolean {
  if (!flags.source) return true;
  const [sourceId, versionPart] = flags.source.split(":");
  if (sourceId !== "developer") return false;
  return !versionPart || versionPart === version;
}

/** When an existing `.cache/code/<version>/` checkout names a different tag than the one
 *  about to be fetched, wipes the directory first — the include-glob set can shrink between
 *  tags, and a plain overwrite would leave stale files from the old tag behind. No-op when
 *  there was no prior checkout (`existingTag === undefined`) or it already matches `tag`. */
export function prepareCheckoutDir(codeDir: string, existingTag: string | undefined, tag: string): void {
  if (existingTag !== undefined && existingTag !== tag) {
    rmSync(codeDir, { recursive: true, force: true });
  }
}

interface CodeCheckoutResult {
  version: string;
  tag: string;
  fetched: number;
  skipped: boolean;
  error?: string;
}

/** Runs one git subcommand with no shell (`execFileSync`, `stdio: "pipe"` — output isn't
 *  needed, but a failure's stderr surfaces via the thrown error's `.message`). Injectable so
 *  tests never invoke real git / hit the network (sync.ts, "6.6 code checkout"). */
export type GitRunner = (args: string[], opts?: { cwd?: string }) => void;

function defaultGitRunner(args: string[], opts?: { cwd?: string }): void {
  execFileSync("git", args, { cwd: opts?.cwd, stdio: "pipe" });
}

function errorMessage(err: unknown): string {
  return (err instanceof Error ? err.message : String(err)).slice(0, 500);
}

export interface GitCheckoutResult {
  fetched: number;
  error?: string;
}

/**
 * Shallow sparse `git clone` of `repo`@`tag` into `codeDir`, atomically: clones (no blobs,
 * cone-mode sparse-checkout skeleton) into a temp dir next to `codeDir`, sets the real sparse
 * paths (`CODE_CHECKOUT_INCLUDE_GLOBS` — the same list `codeIndex.ts`'s checkout mode reads),
 * strips `.git`, then renames the temp dir over `codeDir` — a reader never observes a
 * half-populated checkout. `.tag` is written last, once the directory is already in place at
 * its final path, so a mid-checkout crash never leaves a `.tag` pointing at incomplete content.
 * Exported (with `gitRunner` injectable) for `test/sync-guidelines.test.ts` — no real git/network.
 */
export function performGitCheckout(codeDir: string, repo: string, tag: string, gitRunner: GitRunner = defaultGitRunner): GitCheckoutResult {
  const parent = dirname(codeDir);
  mkdirSync(parent, { recursive: true });
  const tmpDir = resolve(parent, `.tmp-${basename(codeDir)}-${process.pid}-${Date.now()}`);
  rmSync(tmpDir, { recursive: true, force: true });
  try {
    const url = `https://github.com/${repo}.git`;
    gitRunner(["clone", "--depth", "1", "--filter=blob:none", "--sparse", "--branch", tag, url, tmpDir]);
    gitRunner(["sparse-checkout", "set", "--no-cone", ...CODE_CHECKOUT_INCLUDE_GLOBS], { cwd: tmpDir });
    rmSync(resolve(tmpDir, ".git"), { recursive: true, force: true });
    rmSync(codeDir, { recursive: true, force: true });
    renameSync(tmpDir, codeDir);
    const fetched = listAllFiles(codeDir).length;
    writeFileSync(resolve(codeDir, ".tag"), tag + "\n", "utf8");
    return { fetched };
  } catch (err) {
    rmSync(tmpDir, { recursive: true, force: true });
    return { fetched: 0, error: errorMessage(err) };
  }
}

/**
 * Resolves `checkout.tagPattern`'s latest tag via the GitHub tags API and, when
 * `.cache/code/<version>/.tag` is absent or names an older tag, sparse-clones that tag into
 * `.cache/code/<version>/` (`performGitCheckout`). Any failure — tag listing, clone,
 * sparse-checkout — is recorded on the returned result and never thrown past this function
 * (`FetchAbortError` excepted: the same "abort the whole run" signal every other sync source
 * uses for a hard network-security violation, e.g. host not allowlisted).
 * Exported for `test/sync-failures.test.ts` (mocked `fetch`, no real git/network).
 */
export async function syncCodeCheckout(
  version: string,
  checkout: GuidelineCodeCheckout,
  limiter: HostRateLimiter,
  limits: Parameters<typeof fetchLimited>[1],
  gitRunner: GitRunner = defaultGitRunner,
): Promise<CodeCheckoutResult> {
  // A pinned `tag` is authoritative and costs no network call. Resolving "the latest tag matching a
  // glob" on every sync is unpinned: it makes a run's inputs depend on
  // when it happened to be run, and it is how a content gap in the 6.6 checkout went unnoticed.
  let tag = checkout.tag;
  if (!tag) {
    const [owner, repo] = checkout.repo.split("/");
    if (!checkout.tagPattern) {
      return { version, tag: "", fetched: 0, skipped: true, error: `no tag or tagPattern configured for ${checkout.repo}` };
    }
    let tagNames: string[];
    try {
      tagNames = await fetchTags(owner, repo, limiter, limits);
    } catch (err) {
      if (err instanceof FetchAbortError) throw err;
      return { version, tag: "", fetched: 0, skipped: true, error: errorMessage(err) };
    }
    tag = pickLatestTag(tagNames, checkout.tagPattern);
    if (!tag) return { version, tag: "", fetched: 0, skipped: true, error: `no tag matching ${checkout.tagPattern} for ${checkout.repo}` };
  }

  const codeDir = resolve(LAYER_DIR, ".cache/code", version);
  const tagFile = resolve(codeDir, ".tag");
  const existingTag = existsSync(tagFile) ? readFileSync(tagFile, "utf8").trim() : undefined;
  if (existingTag === tag && existsSync(codeDir)) {
    return { version, tag, fetched: 0, skipped: true };
  }
  prepareCheckoutDir(codeDir, existingTag, tag);

  const result = performGitCheckout(codeDir, checkout.repo, tag, gitRunner);
  if (result.error) return { version, tag, fetched: 0, skipped: true, error: result.error };
  return { version, tag, fetched: result.fetched, skipped: false };
}

async function syncMerchantSource(
  sourceId: string,
  source: SourceConfig,
  config: PlatformConfig,
  state: { sources: Record<string, SourceState> },
  dirs: ReturnType<typeof cacheDirs>,
  limiter: HostRateLimiter,
  limits: Parameters<typeof fetchLimited>[1],
): Promise<SourceSummary> {
  const sourceState = state.sources[sourceId] ?? { lastSync: null, pages: {} };
  const summary: SourceSummary = { source: sourceId, new: 0, changed: 0, removed: 0, unchanged: 0, unpublished: 0, fetched: 0 };
  const srcDir = resolve(dirs.srcDir, ...sourceId.split(":"));

  const records = await algoliaEnumerate(source, limiter, limits);
  const seen = new Set<string>();

  const localization = source.site!.localization;
  for (const record of records) {
    // Algolia's canonical seoUrl omits the site's localization segment for most records
    // ("/shopware-6-en/…"), and the live site only serves the prefixed form
    // ("/en/shopware-6-en/…" — the bare form is a 404); a minority of records already
    // carry the "/en/…" prefix. Normalize to the prefixed form before building URLs/paths.
    const sitePath = record.seoUrl.startsWith(`/${localization}/`) ? record.seoUrl : `/${localization}${record.seoUrl}`;
    const seoPath = sitePath.replace(/^\/en\/shopware-6-en\//, "").replace(/^\/en\//, "").replace(/\/$/, "");
    const wikiPath = `${source.wikiDir}/${seoPath}.md`;
    // Algolia indexes per-section chunks (spec, "Records") — several records commonly share
    // the same seoUrl. All we ever read off a record is that seoUrl, so the first chunk seen
    // per page is enough; without this, a page gets re-fetched once per chunk (~7x observed).
    if (seen.has(wikiPath)) continue;
    seen.add(wikiPath);
    const pageUrl = `${source.site!.baseUrl}${sitePath}`;
    const previous = sourceState.pages[wikiPath];

    let html: string;
    try {
      await limiter.wait("docs.shopware.com");
      const res = await fetchLimited(pageUrl, limits);
      // A non-200 body (the site's "Sorry page not found" boilerplate included) must never
      // be cached as page content — record it as a fetch failure for this page instead.
      if (res.status !== 200) throw new Error(`HTTP ${res.status} for ${pageUrl}`);
      html = res.body;
    } catch (err) {
      // No previous hash at all (never fetched) collapses into the same "not fetched" signal
      // as unpublished dev pages — nothing to build a work item from either way.
      sourceState.pages[wikiPath] = {
        sourceUrl: pageUrl,
        hash: previous?.hash,
        builtHash: previous?.builtHash,
        promptHash: previous?.promptHash,
        failed: previous?.failed,
        date: previous?.date ?? nowSeconds(),
        fetchError: (err instanceof Error ? err.message : String(err)).slice(0, 200),
      };
      summary.unchanged++;
      continue;
    }

    // `entry--content` is the article body on current docs.shopware.com pages; a
    // `text--container` div also exists on every page but is the feedback-form's
    // character counter, so it must only ever be the fallback, never the first pick.
    const container = extractContainer(html, "entry--content") ?? extractContainer(html, "text--container") ?? html;
    const markdown = htmlToMarkdown(container);
    const revisions: MerchantRevision[] = parseRevisions(html, pageUrl);
    const { contentHash } = writeSourceCache(srcDir, markdown);
    summary.fetched++;

    const hashUnchanged = previous?.hash === contentHash;
    const pageState: StatePageEntry = {
      sourceUrl: pageUrl,
      hash: contentHash,
      builtHash: previous?.builtHash,
      promptHash: previous?.promptHash,
      failed: previous?.failed,
      revisions,
      date: hashUnchanged ? (previous?.date ?? nowSeconds()) : nowSeconds(),
    };
    sourceState.pages[wikiPath] = pageState;
    if (!previous) summary.new++;
    else if (hashUnchanged) summary.unchanged++;
    else summary.changed++;
  }

  for (const wikiPath of Object.keys(sourceState.pages)) {
    if (!seen.has(wikiPath)) {
      delete sourceState.pages[wikiPath];
      summary.removed++;
    }
  }

  sourceState.lastSync = new Date().toISOString();
  state.sources[sourceId] = sourceState;
  return summary;
}

interface AlgoliaRecord {
  objectID: string;
  seoUrl: string;
}

interface AlgoliaQueryResult {
  hits: AlgoliaRecord[];
  nbHits: number;
  nbPages: number;
  facets?: Record<string, Record<string, number>>;
}

/** Algolia's search endpoint is POST-only (a GET to `/query?...` 404s — Algolia reads the
 *  querystring as an objectID lookup, not search params) and the JSON body carries the
 *  actual query as a single URL-encoded `params` string, not top-level JSON fields. */
async function algoliaQuery(
  host: string,
  index: string,
  apiKey: string,
  appId: string,
  params: string,
  limiter: HostRateLimiter,
  limits: Parameters<typeof fetchLimited>[1],
): Promise<AlgoliaQueryResult> {
  await limiter.wait("docs.shopware.com");
  const res = await fetchLimited(`https://${host}/1/indexes/${index}/query`, limits, {
    method: "POST",
    headers: { "x-algolia-api-key": apiKey, "x-algolia-application-id": appId, "content-type": "application/json" },
    body: JSON.stringify({ params }),
  });
  if (res.status === 403) {
    throw new FetchAbortError("Algolia 403 — search key likely rotated; re-extract from docs.shopware.com's /build/app.*.js bundle and update ingest/platform/config.json (never logged)");
  }
  if (res.status !== 200) {
    throw new FetchAbortError(`Algolia query failed: HTTP ${res.status} — ${res.body.slice(0, 300)}`);
  }
  return JSON.parse(res.body) as AlgoliaQueryResult;
}

/**
 * A single query is capped at 1,000 hits by Algolia (refresh spec, "Pagination"); the
 * en/User-docs filter alone matches ~1,700+ chunk records, so results are sliced by the
 * `categories` facet (largest observed value ~530, comfortably under the cap) and merged,
 * deduping by `objectID` in case a record ever carries more than one category. Each slice
 * is itself paged via `page`/`nbPages` as a general safeguard, even though no slice has
 * needed a second page in practice.
 */
async function algoliaEnumerate(source: SourceConfig, limiter: HostRateLimiter, limits: Parameters<typeof fetchLimited>[1]): Promise<AlgoliaRecord[]> {
  const algolia = source.algolia!;
  const apiKey = process.env.ALGOLIA_SEARCH_KEY || algolia.searchKey;
  if (!apiKey) {
    throw new FetchAbortError("no Algolia search key configured (set ALGOLIA_SEARCH_KEY or ingest/platform/config.json sources[merchant].algolia.searchKey)");
  }
  const host = `${algolia.appId}-dsn.algolia.net`;
  const baseFilter = `localization:${source.site!.localization} AND product:"${source.site!.product}"`;

  const probe = await algoliaQuery(
    host,
    algolia.index,
    apiKey,
    algolia.appId,
    `filters=${encodeURIComponent(baseFilter)}&hitsPerPage=0&facets=${encodeURIComponent(JSON.stringify(["categories"]))}&maxValuesPerFacet=1000`,
    limiter,
    limits,
  );
  const categories = Object.keys(probe.facets?.categories ?? {});

  // Only `seoUrl` (+ the always-present `objectID`, for cross-slice dedup) is ever read from
  // an enumeration hit downstream — the actual title/markdown come from re-fetching and
  // parsing the live page HTML per seoUrl. `attributesToRetrieve` alone isn't enough to keep
  // the response small: Algolia still attaches a per-hit `_highlightResult` (highlighted
  // copies of every searchable attribute, `content` included) unless highlighting is
  // explicitly disabled too — with it enabled, 531 hits alone ran to ~2.7 MB and tripped the
  // body-size cap; with `attributesToHighlight: []` the same query is ~50 KB.
  const attributes = encodeURIComponent(JSON.stringify(["objectID", "seoUrl"]));
  const noHighlight = encodeURIComponent(JSON.stringify([]));
  const byId = new Map<string, AlgoliaRecord>();
  for (const category of categories.length ? categories : [undefined]) {
    const filters = category ? `${baseFilter} AND categories:${JSON.stringify(category)}` : baseFilter;
    let page = 0;
    for (;;) {
      const result = await algoliaQuery(
        host,
        algolia.index,
        apiKey,
        algolia.appId,
        `filters=${encodeURIComponent(filters)}&hitsPerPage=1000&page=${page}&attributesToRetrieve=${attributes}&attributesToHighlight=${noHighlight}`,
        limiter,
        limits,
      );
      for (const hit of result.hits) byId.set(hit.objectID, hit);
      page++;
      if (page >= result.nbPages) break;
    }
  }
  return [...byId.values()];
}
