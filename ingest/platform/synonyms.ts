/**
 * `wiki:synonyms` — Phase 6 (refresh spec), optional (`config.json` `synonyms.enabled`).
 * Unlike pages/hubs, one sub-agent writes one output file **per batch** (many concept
 * lines each), and all valid batches are merged into a single `platform/synonyms.md`
 * at ingest — so this command does its own ingest loop instead of the generic
 * one-output-per-wiki-path `ingestBatches` helper.
 */
import { existsSync, lstatSync, readFileSync, realpathSync, rmSync } from "node:fs";
import { resolve } from "node:path";
import { ingestLayerDir, loadPlatformConfig, wikiRootFrom } from "../shared/config.js";
import { loadState, saveState } from "../shared/state.js";
import { cacheDirs, listAllFiles, promptHash, selectPendingBatches, writeBatches } from "../shared/workitems.js";
import { checkOutputHygiene, checkLeakedLocalState, checkPurity } from "../shared/hygiene.js";
import { writeText } from "../shared/jsonio.js";
import { sha256 } from "../shared/hash.js";
import { parsePage } from "../shared/frontmatterValidate.js";
import type { CliFlags, PlatformConfig, WorkItem } from "../shared/types.js";

const LAYER_DIR = ingestLayerDir("platform");
const PROMPT_PATH = resolve(LAYER_DIR, "prompts/synonyms.md");
const CONCEPTS_PER_BATCH = 40;

export interface ConceptPage {
  path: string;
  title: string;
  summary: string;
}

export interface Concept {
  id: string; // sha256 of sorted member paths — stable across runs
  canonicalKeyword: string;
  keywords: string[];
  paths: string[];
  /** Per-path `title`/`summary` (design doc "What you receive": "each with its member
   *  pages' keywords, title and index-line summary"), same members as `paths`, sorted the
   *  same way. */
  pages: ConceptPage[];
}

export async function run(flags: CliFlags): Promise<number> {
  const config = loadPlatformConfig();
  const state = loadState();

  if (!config.synonyms.enabled) {
    process.stderr.write("wiki:synonyms: disabled (config.json synonyms.enabled=false) — skipping\n");
    if (flags.ingest) {
      process.stdout.write(JSON.stringify({ cmd: "synonyms", mode: "ingest", ok: 0, failed: 0, skipped: 0, failedPaths: [] }) + "\n");
    } else {
      process.stdout.write(JSON.stringify({ cmd: "synonyms", mode: "prepare", ...(flags.retryFailed ? { retry: true } : {}), batches: 0, items: 0, files: [] }) + "\n");
    }
    return 0;
  }

  if (flags.ingest) return runIngest(config, state, flags);
  if (flags.retryFailed) return runPrepare(config, state, flags, true);
  if (flags.prepare) return runPrepare(config, state, flags, false);
  process.stderr.write("wiki:synonyms: one of --prepare, --ingest, --retry-failed is required\n");
  return 1;
}

export function collectPages(state: ReturnType<typeof loadState>): { path: string; title: string; keywords: string[]; summary: string }[] {
  const pages: { path: string; title: string; keywords: string[]; summary: string }[] = [];
  const seen = new Set<string>();
  for (const p of Object.values(state.sources)) {
    for (const [path, entry] of Object.entries(p.pages)) {
      if (entry.builtHash === undefined) continue;
      const physicalPath = entry.sharedFrom ?? path;
      if (seen.has(physicalPath)) continue;
      seen.add(physicalPath);
      pages.push({ path: physicalPath, title: physicalPath, keywords: [], summary: "" });
    }
  }
  return pages;
}

/** Reads each page's own frontmatter (keywords/summary) — the union-find clustering key. */
export function withFrontmatter(wikiRoot: string, pages: ReturnType<typeof collectPages>): typeof pages {
  return pages.map((p) => {
    const abs = resolve(wikiRoot, p.path);
    if (!existsSync(abs)) return p;
    const { frontmatter } = parsePage(readFileSync(abs, "utf8"));
    return {
      path: p.path,
      title: String(frontmatter.title ?? p.title),
      summary: String(frontmatter.summary ?? ""),
      keywords: Array.isArray(frontmatter.keywords) ? (frontmatter.keywords as string[]).map((k) => String(k)) : [],
    };
  });
}

// Clustering knobs. Constants (not config.json) because the synonyms config block only
// carries `enabled` and there is no schema validation to document new fields; the values
// exist to keep every concept transcribable by one writer agent, not to be tuned per run.
// A merge requires substantial Jaccard overlap with the *entire* cluster's keyword set,
// which resists the transitive chaining that made union-find collapse the whole
// vocabulary into a single mega-cluster; the hard caps are a guarantee on top.
const MIN_JACCARD = 0.5;
const MAX_KEYWORDS_PER_CONCEPT = 15;
const MAX_PATHS_PER_CONCEPT = 20;

/**
 * Greedy agglomerative clustering: pages (sorted by path) join the most similar existing
 * cluster only when Jaccard similarity of the distinctive-keyword sets is ≥ MIN_JACCARD
 * and the merged cluster stays under the keyword/path caps; otherwise they start their own
 * concept. Very common keywords are excluded from the similarity signal (but kept in the
 * concept's keyword list). Deterministic: stable page order, clusters scanned in creation
 * order, ties resolved to the lowest cluster index.
 *
 * Reused by `hubs.ts` to auto-derive hub scopes from the same keyword-cluster signal
 * (refresh spec Phase 4, "hub list ownership" — resolved: auto-derived, no second
 * clustering implementation).
 */
export function clusterConcepts(pages: { path: string; title: string; keywords: string[]; summary: string }[]): Concept[] {
  const sorted = pages.filter((p) => p.keywords.length > 0).sort((a, b) => a.path.localeCompare(b.path));
  const freq = new Map<string, number>();
  for (const p of sorted) {
    for (const k of new Set(p.keywords.map((k) => k.toLowerCase()))) freq.set(k, (freq.get(k) ?? 0) + 1);
  }
  const commonThreshold = Math.max(3, Math.ceil(sorted.length * 0.05));

  interface Cluster {
    signal: Set<string>; // lowercased, common keywords excluded — the similarity key
    keywords: Set<string>; // original casing, all keywords — the concept output
    pages: ConceptPage[];
  }
  const clusters: Cluster[] = [];
  for (const p of sorted) {
    const signal = new Set(p.keywords.map((k) => k.toLowerCase()).filter((k) => (freq.get(k) ?? 0) <= commonThreshold));
    const lowerAll = new Set(p.keywords.map((k) => k.toLowerCase()));
    let best = -1;
    let bestSim = 0;
    if (signal.size > 0) {
      for (let ci = 0; ci < clusters.length; ci++) {
        const c = clusters[ci];
        if (c.signal.size === 0 || c.pages.length >= MAX_PATHS_PER_CONCEPT) continue;
        let inter = 0;
        for (const k of signal) if (c.signal.has(k)) inter++;
        if (inter === 0) continue;
        const sim = inter / (signal.size + c.signal.size - inter);
        if (sim < MIN_JACCARD || sim <= bestSim) continue;
        const merged = new Set(lowerAll);
        for (const k of c.keywords) merged.add(k.toLowerCase());
        if (merged.size > MAX_KEYWORDS_PER_CONCEPT) continue;
        bestSim = sim;
        best = ci;
      }
    }
    const page: ConceptPage = { path: p.path, title: p.title, summary: p.summary };
    if (best >= 0) {
      const c = clusters[best];
      for (const k of signal) c.signal.add(k);
      for (const k of p.keywords) c.keywords.add(k);
      c.pages.push(page);
    } else {
      clusters.push({ signal, keywords: new Set(p.keywords), pages: [page] });
    }
  }

  const concepts: Concept[] = clusters.map((c) => {
    const keywords = [...c.keywords].sort();
    const pages = [...c.pages].sort((a, b) => a.path.localeCompare(b.path));
    const paths = pages.map((p) => p.path);
    return { id: sha256(paths.join("|")), canonicalKeyword: keywords[0], keywords, paths, pages };
  });
  return concepts.sort((a, b) => a.canonicalKeyword.localeCompare(b.canonicalKeyword) || a.id.localeCompare(b.id));
}

function runPrepare(config: PlatformConfig, state: ReturnType<typeof loadState>, flags: CliFlags, retry: boolean): number {
  const wikiRoot = wikiRootFrom(flags, config); // frontmatter re-read only, no writes here
  const pages = withFrontmatter(wikiRoot, collectPages(state));
  const allConcepts = clusterConcepts(pages);

  const currentPromptHash = promptHash(PROMPT_PATH);
  const toProcess = allConcepts.filter((c) => {
    const prev = state.synonyms.concepts[c.id];
    if (retry) return prev?.failed === true;
    if (state.synonyms.synonymsPromptHash !== currentPromptHash) return true;
    if (!prev) return true;
    return JSON.stringify(prev.keywords) !== JSON.stringify(c.keywords) || JSON.stringify(prev.paths) !== JSON.stringify(c.paths);
  });

  const outDir = resolve(cacheDirs(LAYER_DIR).outDir, "synonyms");
  const items: WorkItem[] = [];
  for (let i = 0; i < toProcess.length; i += CONCEPTS_PER_BATCH) {
    const chunk = toProcess.slice(i, i + CONCEPTS_PER_BATCH);
    const n = items.length + 1;
    items.push({
      path: `synonyms-batch-${String(n).padStart(2, "0")}`,
      outputPath: resolve(outDir, `batch-${String(n).padStart(2, "0")}.md`),
      concepts: chunk,
    });
  }

  const files = writeBatches(LAYER_DIR, "synonyms", items, PROMPT_PATH, 1, undefined, { reset: flags.resetBatches });
  process.stdout.write(JSON.stringify({ cmd: "synonyms", mode: "prepare", ...(retry ? { retry: true } : {}), batches: files.length, items: toProcess.length, files }) + "\n");
  return 0;
}

function runIngest(config: PlatformConfig, state: ReturnType<typeof loadState>, flags: CliFlags): number {
  const wikiRoot = wikiRootFrom(flags, config);
  const knownPaths = new Set(collectPages(state).map((p) => p.path));
  const currentPromptHash = promptHash(PROMPT_PATH);
  const dirs = cacheDirs(LAYER_DIR);
  const outPhaseDir = resolve(dirs.outDir, "synonyms");
  const outPhaseReal = existsSync(outPhaseDir) ? realpathSync(outPhaseDir) : undefined;

  const { pending, unresolved: unresolvedBatches } = selectPendingBatches(LAYER_DIR, "synonyms", flags.batches);
  let ok = 0;
  let failed = 0;
  const failedPaths: string[] = [];
  const failedReasons: { path: string; reason: string }[] = [];
  const validLines: string[] = [];

  for (const { file, batch } of pending) {
    const item = batch.items[0];
    const concepts = (item.concepts as Concept[]) ?? [];
    const result = validateSynonymsBatch(item, concepts, knownPaths, outPhaseReal);
    if (!result.ok) {
      failed++;
      failedPaths.push(item.path);
      failedReasons.push({ path: item.path, reason: result.reason });
      for (const c of concepts) state.synonyms.concepts[c.id] = { keywords: c.keywords, paths: c.paths, failed: true };
    } else {
      ok++;
      validLines.push(...result.lines);
      for (const c of concepts) state.synonyms.concepts[c.id] = { keywords: c.keywords, paths: c.paths, failed: false };
      rmSync(item.outputPath, { force: true });
    }
    rmSync(file, { force: true });
  }

  const skipped = listAllFiles(outPhaseDir).length;

  if (ok > 0 || validLines.length > 0) {
    writeSynonymsOutput(wikiRoot, validLines, config);
  }
  state.synonyms.synonymsPromptHash = currentPromptHash;
  saveState(state);

  process.stdout.write(JSON.stringify({ cmd: "synonyms", mode: "ingest", ok, failed, skipped, failedPaths, failedReasons, ...(unresolvedBatches.length ? { unresolvedBatches } : {}) }) + "\n");
  return unresolvedBatches.length ? 1 : 0;
}

const SYNONYMS_HEADER = [
  "# Synonyms",
  "",
  "Grep-able alias file: `canonical term — synonyms, aliases, German UI terms, class/route/config names — paths`.",
  "Fallback only — try the directory `index.md` and page keywords first (design spec, \"Synonyms\").",
  "",
];

// Header prose also contains " — ", so a bare dash filter would re-absorb it as data on every merge.
const SYNONYMS_HEADER_LINES = new Set(SYNONYMS_HEADER.map((l) => l.trim()).filter(Boolean));

export function isSynonymDataLine(l: string): boolean {
  const t = l.trim();
  return Boolean(t) && !t.startsWith("#") && t.includes(" — ") && !SYNONYMS_HEADER_LINES.has(t);
}

function readExistingSynonymsLines(wikiRoot: string): string[] {
  const singleFile = resolve(wikiRoot, "platform/synonyms.md");
  if (existsSync(singleFile)) {
    return readFileSync(singleFile, "utf8").split("\n").filter(isSynonymDataLine);
  }
  const partsIndex = resolve(wikiRoot, "platform/synonyms/index.md");
  if (!existsSync(partsIndex)) return [];
  const lines: string[] = [];
  for (const file of listAllFiles(resolve(wikiRoot, "platform/synonyms"))) {
    if (file.endsWith("index.md")) continue;
    lines.push(...readFileSync(file, "utf8").split("\n").filter(isSynonymDataLine));
  }
  return lines;
}

/** Splits a ` — `-joined synonym line into its three parts (canonical term, alias list, path list). */
function splitSynonymLine(line: string): { canonical: string; aliases: string[]; paths: string[] } {
  const [canonical, aliasPart, pathsPart] = line.split(" — ");
  return {
    canonical: (canonical ?? "").trim(),
    aliases: (aliasPart ?? "").split(",").map((s) => s.trim()).filter(Boolean),
    paths: (pathsPart ?? "").split(",").map((s) => s.trim()).filter(Boolean),
  };
}

/** Two lines sharing a canonical term (case-insensitively) merge into one — union of
 *  aliases and paths — instead of the later line silently dropping the earlier one's data. */
function mergeSynonymLines(existing: string, incoming: string): string {
  const a = splitSynonymLine(existing);
  const b = splitSynonymLine(incoming);
  const aliases = [...new Set([...a.aliases, ...b.aliases])];
  const paths = [...new Set([...a.paths, ...b.paths])].sort();
  return `${a.canonical} — ${aliases.join(", ")} — ${paths.join(", ")}`;
}

/** Phase 5 "Large-file splitting": over `synonymsMaxBytes` becomes `synonyms/index.md` + `synonyms/<part>.md`. */
export function writeSynonymsOutput(wikiRoot: string, newLines: string[], config: PlatformConfig): void {
  const byCanonical = new Map<string, string>();
  for (const line of [...readExistingSynonymsLines(wikiRoot), ...newLines]) {
    const canonical = line.split(" — ")[0]?.trim();
    if (!canonical) continue;
    const key = canonical.toLowerCase();
    const prev = byCanonical.get(key);
    byCanonical.set(key, prev ? mergeSynonymLines(prev, line) : line);
  }
  // Plain code-unit order, not localeCompare: ICU collation order is locale/runtime-dependent
  // (not byte-identical across machines), and a writer agent could never reproduce it anyway —
  // validateSynonymsBatch no longer requires batches to arrive pre-sorted (see there); this is
  // the single sort that actually determines the merged file's order.
  const sortedLines = [...byCanonical.values()].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
  const singleFile = [...SYNONYMS_HEADER, ...sortedLines, ""].join("\n");

  const singleFilePath = resolve(wikiRoot, "platform/synonyms.md");
  const partsDir = resolve(wikiRoot, "platform/synonyms");
  if (Buffer.byteLength(singleFile, "utf8") <= config.sizeLimits.synonymsMaxBytes) {
    rmSync(partsDir, { recursive: true, force: true });
    writeText(singleFilePath, singleFile);
    return;
  }

  rmSync(singleFilePath, { force: true });
  // Cut by actual byte budget, not a fixed line count: a fixed 2000-line cut ignores how
  // long individual lines are and can still produce a part over synonymsMaxBytes. Each
  // part repeats the header, so a part starts accruing from headerBytes, and a new part
  // begins the moment the next line would push it over the cap.
  const budget = config.sizeLimits.synonymsMaxBytes;
  const headerBytes = Buffer.byteLength(SYNONYMS_HEADER.join("\n"), "utf8") + 1;
  const parts: string[][] = [];
  let current: string[] = [];
  let currentBytes = headerBytes;
  for (const line of sortedLines) {
    const lineBytes = Buffer.byteLength(line, "utf8") + 1;
    if (current.length > 0 && currentBytes + lineBytes > budget) {
      parts.push(current);
      current = [];
      currentBytes = headerBytes;
    }
    current.push(line);
    currentBytes += lineBytes;
  }
  if (current.length > 0) parts.push(current);
  const indexLines = ["# Synonyms (split)", "", "Over the single-file size cap — split by canonical-term range.", ""];
  parts.forEach((part, i) => {
    const first = part[0]?.split(" — ")[0] ?? "";
    const last = part[part.length - 1]?.split(" — ")[0] ?? "";
    indexLines.push(`platform/synonyms/part-${i + 1}.md — ${first} … ${last}`);
    writeText(resolve(partsDir, `part-${i + 1}.md`), [...SYNONYMS_HEADER, ...part, ""].join("\n"));
  });
  writeText(resolve(partsDir, "index.md"), [...indexLines, ""].join("\n"));
}

export function validateSynonymsBatch(
  item: WorkItem,
  concepts: Concept[],
  knownPaths: Set<string>,
  outPhaseReal: string | undefined,
): { ok: true; lines: string[] } | { ok: false; reason: string } {
  const outAbsPath = resolve(item.outputPath);
  let st;
  try {
    st = lstatSync(outAbsPath);
  } catch {
    return { ok: false, reason: "no output produced" };
  }
  if (!st.isFile()) return { ok: false, reason: "output is not a regular file (symlink or directory)" };
  const real = realpathSync(outAbsPath);
  if (!outPhaseReal || !real.startsWith(outPhaseReal + "/")) return { ok: false, reason: "output path escapes the staging directory" };

  const text = readFileSync(outAbsPath, "utf8");
  const hygiene = [...checkOutputHygiene(text), ...checkLeakedLocalState(text), ...checkPurity(text)];
  if (hygiene.length) return { ok: false, reason: hygiene.map((h) => h.detail).join("; ") };

  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("#"));
  if (lines.length === 0) return { ok: false, reason: "no data lines produced" };

  const canonicals: string[] = [];
  for (const line of lines) {
    const parts = line.split(" — ");
    if (parts.length !== 3) return { ok: false, reason: `line does not match the "canonical — aliases — paths" format: ${line}` };
    const [canonical, , pathsPart] = parts;
    if (!canonical.trim()) return { ok: false, reason: `line has an empty canonical term: ${line}` };
    canonicals.push(canonical.trim());
    for (const p of pathsPart.split(",").map((s) => s.trim())) {
      if (!p.startsWith("platform/")) return { ok: false, reason: `path is not wiki-root-relative starting with platform/: ${p} (line: ${canonical.trim()})` };
      if (!knownPaths.has(p)) return { ok: false, reason: `path does not resolve to an ingested page: ${p} (line: ${canonical.trim()})` };
    }
  }
  // Order is free here: writeSynonymsOutput re-sorts the whole merged file itself (pinned
  // to code-unit order), so requiring a writer agent to also pre-sort its batch is both
  // unenforceable (no reproducible order a writer could match) and pointless (the sort is
  // thrown away at merge). Only the case-insensitive duplicate check below matters.
  const lowerCanonicals = canonicals.map((c) => c.toLowerCase());
  if (new Set(lowerCanonicals).size !== canonicals.length) {
    const seen = new Set<string>();
    const dup = lowerCanonicals.find((c) => (seen.has(c) ? true : (seen.add(c), false)));
    return { ok: false, reason: `duplicate canonical term within the batch: ${dup}` };
  }

  const wholeTextLower = text.toLowerCase();
  for (const c of concepts) {
    for (const kw of c.keywords) {
      if (!wholeTextLower.includes(kw.toLowerCase())) {
        return { ok: false, reason: `input keyword "${kw}" (concept "${c.canonicalKeyword}") does not appear anywhere in the output` };
      }
    }
  }

  return { ok: true, lines };
}
