/**
 * `wiki:clean` — deterministic reset of ingested cache/state/wiki-content for the
 * platform layer. No LLM calls, no network. Companion to `sync`/`pages`/`hubs`/`build`
 * for recovering from a bad ingestion run or re-baselining a single source.
 *
 * Safety model: without `--yes` this ALWAYS behaves as a dry run (plan only, no
 * mutation) regardless of `--dry-run` — only `--yes` mutates. A cross-source safety
 * rail additionally refuses the `wiki` scope for a single `--source` when a hub or a
 * shared (`sharedFrom`) page would be left dangling; that refusal is evaluated as a
 * plan-time check in both dry-run and `--yes` modes.
 */
import { existsSync, mkdirSync, readdirSync, rmSync, statSync } from "node:fs";
import { basename, relative, resolve } from "node:path";
import { ingestLayerDir, loadPlatformConfig, sourceStateHasHeadSha, sourceStateKeys, wikiRootFrom } from "../shared/config.js";
import { loadState, saveState } from "../shared/state.js";
import { cacheDirs, listAllFiles } from "../shared/workitems.js";
import type { CliFlags, HubStateEntry, IngestionState, PlatformConfig, SourceConfig, SourceState } from "../shared/types.js";

/**
 * `wiki:clean` needs a few flags (`--scope`, `--source`, `--yes`, `--dry-run`) that no
 * other verb uses. Extending `CliFlags` here via module augmentation (rather than
 * editing `ingest/shared/types.ts`) keeps this feature's edits scoped to the three
 * files called out for this change: this new file, `ingest/shared/cli.ts` (which
 * assigns these fields), and `package.json`.
 */
declare module "../shared/types.js" {
  interface CliFlags {
    scope?: string;
    source?: string;
    yes?: boolean;
    dryRun?: boolean;
  }
}

const LAYER_DIR = ingestLayerDir("platform");
const VALID_SCOPES = ["cache", "state", "wiki"] as const;
type Scope = (typeof VALID_SCOPES)[number];

interface Totals {
  filesDeleted: number;
  bytesFreed: number;
  sourcesReset: number;
  refusals: number;
}

export async function run(flags: CliFlags): Promise<number> {
  const config = loadPlatformConfig();
  const state = loadState();
  const dirs = cacheDirs(LAYER_DIR);
  const wikiRoot = wikiRootFrom(flags, config);

  if (!flags.scope) {
    process.stderr.write(`wiki:clean: --scope is required (comma-separated: ${VALID_SCOPES.join(",")}, or "all")\n`);
    return 1;
  }
  const rawScopes = flags.scope
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (rawScopes.length === 0) {
    process.stderr.write(`wiki:clean: --scope is required (comma-separated: ${VALID_SCOPES.join(",")}, or "all")\n`);
    return 1;
  }
  const invalidScopes = rawScopes.filter((s) => s !== "all" && !(VALID_SCOPES as readonly string[]).includes(s));
  if (invalidScopes.length > 0) {
    process.stderr.write(`wiki:clean: unknown --scope value(s): ${invalidScopes.join(", ")}. Valid: ${VALID_SCOPES.join(", ")}, all\n`);
    return 1;
  }
  const scopes = new Set<Scope>(rawScopes.includes("all") ? VALID_SCOPES : (rawScopes as Scope[]));

  if (!flags.source) {
    process.stderr.write('wiki:clean: --source is required (a source id or "all")\n');
    return 1;
  }
  const validSourceIds = config.sources.map((s) => s.id);
  if (flags.source !== "all" && !validSourceIds.includes(flags.source)) {
    process.stderr.write(`wiki:clean: unknown --source "${flags.source}". Valid: ${validSourceIds.join(", ")}, all\n`);
    return 1;
  }

  const mutate = flags.yes === true && flags.dryRun !== true;
  const source = flags.source;
  const sourceIds = source === "all" ? validSourceIds : [source];
  const totals: Totals = { filesDeleted: 0, bytesFreed: 0, sourcesReset: 0, refusals: 0 };

  // Plan-time cross-source safety rail: evaluated before any scope runs, in both
  // dry-run and --yes modes. Only the `wiki` scope is refused — cache/state resets
  // carry no cross-source breakage risk.
  let wikiRefused = false;
  if (scopes.has("wiki") && source !== "all") {
    const safety = checkCrossSourceSafety(config, state, source);
    if (safety.blocked) {
      wikiRefused = true;
      totals.refusals += safety.reasons.length;
      for (const reason of safety.reasons) process.stderr.write(`wiki:clean: refused wiki scope for source "${source}": ${reason}\n`);
      process.stderr.write(`wiki:clean: rerun with --source all to include the wiki scope\n`);
    }
  }

  if (scopes.has("cache")) cleanCacheScope(dirs, source, mutate, totals);

  if (scopes.has("state")) {
    cleanStateScope(config, state, sourceIds, source === "all", mutate, totals);
    if (mutate) saveState(state);
  }

  if (scopes.has("wiki") && !wikiRefused) cleanWikiScope(config, wikiRoot, source, sourceIds, mutate, totals);

  process.stdout.write(
    JSON.stringify({
      cmd: "clean",
      scopes: [...scopes],
      source,
      dryRun: !mutate,
      ...totals,
    }) + "\n",
  );

  if (!mutate) {
    process.stderr.write("wiki:clean: DRY RUN — nothing was deleted or written. Re-run with --yes to apply.\n");
  }

  return wikiRefused ? 2 : 0;
}

function reportUnit(line: Record<string, unknown>): void {
  process.stdout.write(JSON.stringify({ cmd: "clean", ...line }) + "\n");
}

/** Stats a file for its size and, only when `mutate`, deletes it. Missing files cost 0 bytes. */
function planOrDelete(absPath: string, mutate: boolean): number {
  let bytes = 0;
  try {
    bytes = statSync(absPath).size;
  } catch {
    return 0;
  }
  if (mutate) {
    try {
      rmSync(absPath, { force: true });
    } catch {
      /* already gone */
    }
  }
  return bytes;
}

function dirStats(dir: string): { files: string[]; bytes: number } {
  const files = listAllFiles(dir);
  let bytes = 0;
  for (const f of files) {
    try {
      bytes += statSync(f).size;
    } catch {
      /* ignore races */
    }
  }
  return { files, bytes };
}

/** Wipes a directory's contents but recreates the (now empty) directory itself. */
function clearDirContents(dir: string, mutate: boolean): { files: number; bytes: number } {
  const { files, bytes } = dirStats(dir);
  if (mutate) {
    rmSync(dir, { recursive: true, force: true });
    mkdirSync(dir, { recursive: true });
  }
  return { files: files.length, bytes };
}

/** Config source id owning a `state.sources` key (`developer:6.7` -> `developer`). */
function ownerSourceId(stateKey: string): string {
  const i = stateKey.indexOf(":");
  return i === -1 ? stateKey : stateKey.slice(0, i);
}

export function cleanCacheScope(dirs: ReturnType<typeof cacheDirs>, source: string, mutate: boolean, totals: Totals): void {
  // Always wiped once per invocation, regardless of --source: transient batch artifacts,
  // not source-attributable. Reported as one line item, not folded into per-source hash counts.
  const work = clearDirContents(dirs.workDir, mutate);
  const out = clearDirContents(dirs.outDir, mutate);
  reportUnit({ scope: "cache", unit: "transient", cleared: ["work", "out"], files: work.files + out.files, bytes: work.bytes + out.bytes, dryRun: !mutate });
  totals.filesDeleted += work.files + out.files;
  totals.bytesFreed += work.bytes + out.bytes;

  // Cache is laid out per source (`.cache/src/<sourceId-with-":"-replaced-by-"/">/`), so a
  // scoped clean is just a wholesale wipe of that source's own folder.
  const srcTarget = source === "all" ? dirs.srcDir : resolve(dirs.srcDir, source);
  const src = clearDirContents(srcTarget, mutate);
  reportUnit({ scope: "cache", unit: "src", source, files: src.files, bytes: src.bytes, dryRun: !mutate });
  totals.filesDeleted += src.files;
  totals.bytesFreed += src.bytes;

  // `.cache/code/<version>/` (sync.ts's 6.6 git checkout) isn't source-attributable either
  // (it's keyed by version, not by any `config.sources` id) — wiped wholesale like work/out.
  const code = clearDirContents(resolve(dirs.root, "code"), mutate);
  reportUnit({ scope: "cache", unit: "code", cleared: ["code"], files: code.files, bytes: code.bytes, dryRun: !mutate });
  totals.filesDeleted += code.files;
  totals.bytesFreed += code.bytes;
}

function zeroSourceState(source: SourceConfig): SourceState {
  return sourceStateHasHeadSha(source) ? { headSha: null, lastSync: null, pages: {} } : { lastSync: null, pages: {} };
}

export function cleanStateScope(config: PlatformConfig, state: IngestionState, sourceIds: string[], isAll: boolean, mutate: boolean, totals: Totals): void {
  for (const id of sourceIds) {
    const src = config.sources.find((s) => s.id === id);
    if (!src) continue;
    for (const key of sourceStateKeys(src)) {
      const prev = state.sources[key];
      const pagesCleared = prev ? Object.keys(prev.pages).length : 0;
      reportUnit({ scope: "state", unit: "source", source: key, pagesCleared, dryRun: !mutate });
      if (mutate) state.sources[key] = zeroSourceState(src);
      totals.sourcesReset++;
    }
  }

  if (!isAll) return;

  const hubsCleared = Object.keys(state.hubs).length;
  const conceptsCleared = Object.keys(state.synonyms.concepts).length;
  const guidelinesCleared = Object.keys(state.guidelines?.files ?? {}).length;
  reportUnit({ scope: "state", unit: "hubs", cleared: hubsCleared, dryRun: !mutate });
  reportUnit({ scope: "state", unit: "synonyms", cleared: conceptsCleared, dryRun: !mutate });
  reportUnit({ scope: "state", unit: "guidelines", cleared: guidelinesCleared, dryRun: !mutate });
  reportUnit({ scope: "state", unit: "prompts", dryRun: !mutate });
  reportUnit({ scope: "state", unit: "build", dryRun: !mutate });
  if (mutate) {
    state.hubs = {};
    state.synonyms = { concepts: {}, synonymsPromptHash: null };
    state.guidelines = { files: {} };
    state.prompts = { pagePromptHash: null, hubPromptHash: null, synonymsPromptHash: null };
    state.build = { lastBuilt: null };
  }
}

export function cleanWikiScope(config: PlatformConfig, wikiRoot: string, sourceFlag: string, sourceIds: string[], mutate: boolean, totals: Totals): void {
  for (const id of sourceIds) {
    const wikiDir = config.sources.find((s) => s.id === id)?.wikiDir;
    if (!wikiDir) continue;
    const dir = resolve(wikiRoot, wikiDir);
    if (!existsSync(dir)) continue;
    const files = listAllFiles(dir).filter((f) => basename(f) !== "index.md");
    for (const f of files) {
      const bytes = planOrDelete(f, mutate);
      reportUnit({ scope: "wiki", unit: "file", source: id, path: relative(wikiRoot, f), bytes, dryRun: !mutate });
      totals.filesDeleted++;
      totals.bytesFreed += bytes;
    }
  }

  if (sourceFlag !== "all") return;

  // Globbed off disk (`platform/hubs/*.md`), not `state.hubs` — the plan must be computable
  // (and correct) even when the `state` scope ran first in the same invocation and already
  // reset `state.hubs` to `{}`. `hubs/index.md` (the generated directory index, `wiki:build`'s
  // own output) is excluded exactly as every other per-source directory excludes its index.md.
  const hubsDir = resolve(wikiRoot, "platform/hubs");
  const hubFiles = existsSync(hubsDir) ? listAllFiles(hubsDir).filter((f) => f.endsWith(".md") && basename(f) !== "index.md") : [];

  // Synonyms: exactly one of the single-file or split-directory form exists at a time
  // (synonyms.ts's `writeSynonymsOutput` always removes the other), but a dry-run plan checks
  // both so a stale leftover from an older run is still reported.
  const synonymsSingle = resolve(wikiRoot, "platform/synonyms.md");
  const synonymsDir = resolve(wikiRoot, "platform/synonyms");
  const synonymFiles = [...(existsSync(synonymsSingle) ? [synonymsSingle] : []), ...(existsSync(synonymsDir) ? listAllFiles(synonymsDir) : [])];

  // Guideline files under `platform/guidelines/<version>/<file>.md` are no longer found through
  // any source's `wikiDir` (the fetch-only `developer-guidelines` source that used to declare
  // `wikiDir: "platform/guidelines"` for exactly this purpose was dropped once the developer
  // repository started being downloaded whole) — deleted explicitly here, like hubs and synonyms.
  const guidelinesRoot = resolve(wikiRoot, "platform/guidelines");
  const guidelineFiles = existsSync(guidelinesRoot) ? listAllFiles(guidelinesRoot).filter((f) => basename(f) !== "index.md") : [];

  for (const [unit, files] of [["hub", hubFiles], ["synonyms", synonymFiles], ["guidelines", guidelineFiles]] as const) {
    for (const f of files) {
      const bytes = planOrDelete(f, mutate);
      reportUnit({ scope: "wiki", unit, path: relative(wikiRoot, f), bytes, dryRun: !mutate });
      totals.filesDeleted++;
      totals.bytesFreed += bytes;
    }
  }
  if (mutate) rmSync(synonymsDir, { recursive: true, force: true });

  // The per-file loop above empties each per-version guidelines directory but never removes it.
  // A leftover empty `platform/guidelines/<v>/` is not harmless: `wiki:lint`'s `lintGuidelines`
  // treats a directory's mere *existence* as "guidelines built for this version"
  // (`existsSync(dir)`) and reports every curated file as missing instead of the softer
  // "not built yet" warning. Remove any now-empty per-version directory, and
  // `platform/guidelines/` itself once it holds none.
  if (mutate && existsSync(guidelinesRoot)) {
    for (const entry of readdirSync(guidelinesRoot, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const dir = resolve(guidelinesRoot, entry.name);
      if (readdirSync(dir).length === 0) rmSync(dir, { recursive: true, force: true });
    }
    if (readdirSync(guidelinesRoot).length === 0) rmSync(guidelinesRoot, { recursive: true, force: true });
  }
}

interface SafetyResult {
  blocked: boolean;
  reasons: string[];
}

/**
 * Refuses `wiki` scope for a single `--source` when:
 *  (a) a hub aggregates member pages from more than one source, including the given one
 *      — deleting that source's content files would leave the hub with dangling links; or
 *  (b) another active source's `sharedFrom` points at a page physically owned by the given
 *      source — deleting that source's `wikiDir` would delete a file another source still
 *      needs. (The reverse direction — the given source itself having `sharedFrom` pointing
 *      elsewhere — is not itself dangerous, since no physical file lives under the given
 *      source's `wikiDir` for that page; scanning every *other* source's entries below
 *      is what actually detects the dangerous direction, including "vice versa" relative to
 *      whichever source happens to be named on the CLI.)
 */
function checkCrossSourceSafety(config: PlatformConfig, state: IngestionState, sourceId: string): SafetyResult {
  const reasons: string[] = [];
  // `platform/guidelines/` is the guidelines phase's own synthesized output, not owned by any
  // `config.sources` id (the fetch-only `developer-guidelines` source no longer exists) — never
  // matched here, so it never blocks a single-source `wiki` clean.
  const ownerOf = (path: string): string | undefined =>
    path.startsWith("platform/guidelines/") || path === "platform/guidelines" ? undefined : config.sources.find((s) => path === s.wikiDir || path.startsWith(`${s.wikiDir}/`))?.id;

  for (const [slug, hub] of Object.entries(state.hubs) as [string, HubStateEntry][]) {
    const owners = new Set<string>();
    for (const memberPath of hub.memberPaths) {
      const owner = ownerOf(memberPath);
      if (owner) owners.add(owner);
    }
    if (owners.size > 1 && owners.has(sourceId)) {
      reasons.push(`hub "${slug}" aggregates pages from multiple sources (${[...owners].sort().join(", ")}); deleting "${sourceId}"'s wiki content alone would leave it with dangling members`);
    }
  }

  for (const [otherKey, sourceState] of Object.entries(state.sources)) {
    if (ownerSourceId(otherKey) === sourceId) continue;
    const otherSource = config.sources.find((s) => s.id === ownerSourceId(otherKey));
    if (!otherSource?.active) continue;
    for (const [path, entry] of Object.entries(sourceState.pages)) {
      if (!entry.sharedFrom) continue;
      if (ownerOf(entry.sharedFrom) === sourceId) {
        reasons.push(`source "${otherKey}" page "${path}" is shared from "${entry.sharedFrom}", physically owned by "${sourceId}"`);
      }
    }
  }

  return { blocked: reasons.length > 0, reasons };
}
