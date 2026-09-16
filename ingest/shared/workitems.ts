import { existsSync, lstatSync, mkdirSync, readFileSync, readdirSync, realpathSync, renameSync, rmSync, statSync } from "node:fs";
import { dirname, resolve, sep } from "node:path";
import { sha256 } from "./hash.js";
import { readJson, writeJson } from "./jsonio.js";
import type { WorkBatch, WorkItem } from "./types.js";

export interface CacheDirs {
  root: string;
  srcDir: string;
  workDir: string;
  outDir: string;
}

/** `.cache/{src,work,out}` under `ingest/<layer>/` (refresh spec, "Setup (ingestion tooling)"). */
export function cacheDirs(layerDir: string): CacheDirs {
  const root = resolve(layerDir, ".cache");
  return { root, srcDir: resolve(root, "src"), workDir: resolve(root, "work"), outDir: resolve(root, "out") };
}

export function promptHash(promptPath: string): string {
  return sha256(readFileSync(promptPath, "utf8"));
}

/** Phases whose `item.path` is a stable per-item identity across separate `--prepare` runs
 *  (a wiki path, a hub slug path, a `version/file` guideline path) — the phases an additive
 *  `writeBatches` can safely de-dupe by `path`. `synonyms` items are keyed by a synthetic
 *  per-run `synonyms-batch-NN` path (position in that run's `toProcess` list, not a stable
 *  concept identity), so it is deliberately excluded — see `writeBatches`. */
const PATH_IDENTITY_PHASES = new Set<"pages" | "hubs" | "synonyms" | "guidelines">(["pages", "hubs", "guidelines"]);

/** Zero-padded wide enough to keep `batch-NNNN.json` filenames correctly sortable well past
 *  batch 99 (the old `padStart(2, "0")` stopped padding once `n` itself reached 3+ digits,
 *  so "batch-100.json" sorted before "batch-99.json" — a real risk at the current ~250-batch
 *  run sizes). Existing batch files from before this change (2-digit names) are never
 *  renamed, so a directory that already has 100+ pre-existing 2-digit files can still sort
 *  oddly against them; new runs are internally consistent. */
const BATCH_NUMBER_WIDTH = 4;

/**
 * Writes work items into `.cache/work/<phase>/batch-NNNN.json` files. Additive by default —
 * an interrupted ingest run resumes safely: existing pending batch files are kept as-is
 * (never renamed or overwritten), new batches continue numbering from the highest existing
 * `batch-NNNN`, and — for the phases in `PATH_IDENTITY_PHASES` — an item whose `path` already
 * appears in a pending batch is not re-queued (design: a re-`--prepare` during a live wave
 * must not make a later `--ingest --batch batch-NN` consume different items than the wave
 * that ran). Pass `opts.reset: true` for the old destructive behaviour (`--reset-batches`):
 * wipe every pending batch file for the phase before writing new ones.
 *
 * `batchSize` may be a per-item function (design doc "Batching, CLI, config" — e.g.
 * codeCheck items batched by 5, everything else by 15 in one prepare): items are grouped
 * into contiguous runs of equal resolved size, each run batched independently, so a size
 * change always starts a new batch file.
 * Returns the batch file paths in order, relative to `layerDir`.
 */
export function writeBatches(
  layerDir: string,
  phase: "pages" | "hubs" | "synonyms" | "guidelines",
  items: WorkItem[],
  prompt: string,
  batchSize: number | ((item: WorkItem) => number),
  outline?: string,
  opts?: { reset?: boolean },
): string[] {
  const dirs = cacheDirs(layerDir);
  const phaseWorkDir = resolve(dirs.workDir, phase);
  const reset = opts?.reset === true;
  if (reset && existsSync(phaseWorkDir)) rmSync(phaseWorkDir, { recursive: true, force: true });
  mkdirSync(phaseWorkDir, { recursive: true });

  let startNumber = 0;
  let toWrite = items;
  if (!reset) {
    const existing = readPendingBatches(layerDir, phase);
    for (const { file } of existing) {
      const m = /batch-(\d+)\.json$/.exec(file);
      if (m) startNumber = Math.max(startNumber, Number(m[1]));
    }
    if (PATH_IDENTITY_PHASES.has(phase)) {
      const already = new Set(pendingItemPaths(layerDir, phase));
      toWrite = items.filter((item) => !already.has(item.path));
    }
  }

  const hash = promptHash(prompt);
  const files: string[] = [];
  const resolveSize = typeof batchSize === "function" ? batchSize : () => batchSize;

  const runs: { size: number; items: WorkItem[] }[] = [];
  for (const item of toWrite) {
    const size = resolveSize(item);
    const last = runs[runs.length - 1];
    if (last && last.size === size) last.items.push(item);
    else runs.push({ size, items: [item] });
  }

  for (const run of runs) {
    for (let i = 0; i < run.items.length; i += run.size) {
      const n = startNumber + files.length + 1;
      const name = `batch-${String(n).padStart(BATCH_NUMBER_WIDTH, "0")}.json`;
      const file = resolve(phaseWorkDir, name);
      const batch: WorkBatch = { batch: name, phase, prompt, promptHash: hash, outline, items: run.items.slice(i, i + run.size) };
      writeJson(file, batch);
      files.push(relativeToLayer(layerDir, file));
    }
  }
  return files;
}

function relativeToLayer(layerDir: string, absPath: string): string {
  const rel = absPath.startsWith(layerDir) ? absPath.slice(layerDir.length + 1) : absPath;
  return rel.split("\\").join("/");
}

export function readPendingBatches(layerDir: string, phase: "pages" | "hubs" | "synonyms" | "guidelines"): { file: string; batch: WorkBatch }[] {
  const phaseWorkDir = resolve(cacheDirs(layerDir).workDir, phase);
  if (!existsSync(phaseWorkDir)) return [];
  return readdirSync(phaseWorkDir)
    .filter((f) => f.endsWith(".json"))
    .sort()
    .map((f) => {
      const file = resolve(phaseWorkDir, f);
      return { file, batch: readJson<WorkBatch>(file) };
    });
}

/** Every `item.path` across the currently-pending batch files for `phase` — the "same-run
 *  known paths" a writer may link to before its own wave has been ingested (pages.ts's
 *  `resolveIngestKnownPaths`, guidelines.ts's `resolveGuidelineKnownWikiPaths`). */
export function pendingItemPaths(layerDir: string, phase: "pages" | "hubs" | "synonyms" | "guidelines"): string[] {
  const paths: string[] = [];
  for (const { batch } of readPendingBatches(layerDir, phase)) {
    for (const item of batch.items) paths.push(item.path);
  }
  return paths;
}

export interface IngestOutcome {
  ok: { path: string; item: WorkItem }[];
  /** `item` is the failed attempt's own work item — callers persist its inputs (e.g. a
   *  hub's `members`) so the next `--prepare` can tell "unchanged since the failure" from
   *  "inputs moved on", instead of re-queuing forever (design doc "no endless re-prepare
   *  loop"). */
  failed: { path: string; reason: string; item: WorkItem }[];
  /** `--batch <file>` arguments that did not resolve to a currently-pending batch file for
   *  this phase (wrong phase, already consumed, or outside `.cache/work/<phase>/`). */
  unresolvedBatches: string[];
}

/**
 * Resolves a `--batch` argument (a bare file name like `batch-01.json`, or the
 * `.cache/work/<phase>/batch-01.json` path printed by `--prepare`) to an absolute path
 * strictly inside `.cache/work/<phase>/` for `layerDir`. Returns `undefined` for anything
 * else — a phase mismatch, an escape attempt, or a file that no longer exists.
 */
export function resolveBatchArg(layerDir: string, phase: "pages" | "hubs" | "synonyms" | "guidelines", arg: string): string | undefined {
  const workDir = resolve(cacheDirs(layerDir).workDir, phase);
  const candidate = arg.includes("/") ? resolve(layerDir, arg) : resolve(workDir, arg);
  let real: string;
  try {
    real = realpathSync(candidate);
  } catch {
    return undefined;
  }
  if (real !== workDir && !real.startsWith(workDir + "/")) return undefined;
  return real;
}

/**
 * Selects which currently-pending batch files to act on. With no `requested` list, every
 * pending batch is selected (manual single-wave use). With a `requested` list (the skill's
 * `--ingest --batch <file>` per wave), only those exact files are selected, so batches of
 * not-yet-launched waves are left untouched — never consumed, never marked failed (design
 * doc "per-wave ingest").
 */
export function selectPendingBatches(
  layerDir: string,
  phase: "pages" | "hubs" | "synonyms" | "guidelines",
  requested?: string[],
): { pending: { file: string; batch: WorkBatch }[]; unresolved: string[] } {
  const all = readPendingBatches(layerDir, phase);
  if (!requested || requested.length === 0) {
    process.stderr.write(`wiki:${phase}: --ingest without --batch consumes every pending batch across every wave; pass --batch <file> to ingest only the wave that just ran\n`);
    return { pending: all, unresolved: [] };
  }
  const byFile = new Map(all.map((p) => [p.file, p]));
  const pending: { file: string; batch: WorkBatch }[] = [];
  const unresolved: string[] = [];
  for (const arg of requested) {
    const real = resolveBatchArg(layerDir, phase, arg);
    const found = real ? byFile.get(real) : undefined;
    if (found) pending.push(found);
    else unresolved.push(arg);
  }
  return { pending, unresolved };
}

/** Prints a phase's one-line `--ingest` summary; exit code 1 when a `--batch` argument did not resolve. */
export function reportIngestOutcome(phase: "pages" | "hubs" | "guidelines", outcome: IngestOutcome, skipped: number): number {
  process.stdout.write(
    JSON.stringify({
      cmd: phase,
      mode: "ingest",
      ok: outcome.ok.length,
      failed: outcome.failed.length,
      skipped,
      failedPaths: outcome.failed.map((f) => f.path),
      failedReasons: outcome.failed.map((f) => ({ path: f.path, reason: f.reason })),
      ...(outcome.unresolvedBatches.length ? { unresolvedBatches: outcome.unresolvedBatches } : {}),
    }) + "\n",
  );
  return outcome.unresolvedBatches.length ? 1 : 0;
}

/**
 * Resolves every item across all currently-pending batch files for `phase`:
 * looks for `.cache/out/<phase>/<...outputPath>`, validates it with `validate`,
 * moves valid output into the wiki tree, and consumes (deletes) that item's
 * batch entry either way (Security C1/C2: identity + regular-file only).
 *
 * An item with no output file present is treated as `failed` on this call —
 * the calling skill is expected to invoke `--ingest` only after the wave that
 * covers it has actually run (refresh spec, "next wave only after the
 * previous wave's ingest"), so "no output yet" and "agent produced nothing"
 * are indistinguishable to the CLI and both resolve to `failed`; genuine
 * not-yet-launched waves must not be ingested early.
 */
export function ingestBatches(
  layerDir: string,
  wikiRoot: string,
  phase: "pages" | "hubs" | "synonyms" | "guidelines",
  validate: (item: WorkItem, outputAbsPath: string) => { ok: true } | { ok: false; reason: string },
  opts?: { batches?: string[] },
): IngestOutcome {
  const dirs = cacheDirs(layerDir);
  const outPhaseDir = resolve(dirs.outDir, phase);
  const { pending, unresolved } = selectPendingBatches(layerDir, phase, opts?.batches);
  const outcome: IngestOutcome = { ok: [], failed: [], unresolvedBatches: unresolved };

  const outPhaseReal = existsSync(outPhaseDir) ? realpathSync(outPhaseDir) : undefined;

  for (const { file, batch } of pending) {
    for (const item of batch.items) {
      // Security C1: accept only the exact path the work item asked for, and only inside .cache/out/<phase>/.
      const expectedOut = resolve(item.outputPath);
      let st;
      try {
        st = lstatSync(expectedOut);
      } catch {
        outcome.failed.push({ path: item.path, reason: "no output produced", item });
        continue;
      }
      if (!st.isFile()) {
        outcome.failed.push({ path: item.path, reason: "output is not a regular file (symlink or directory)", item });
        continue;
      }
      const real = realpathSync(expectedOut);
      if (!outPhaseReal || !real.startsWith(outPhaseReal + "/")) {
        outcome.failed.push({ path: item.path, reason: "output path escapes the staging directory", item });
        continue;
      }
      const result = validate(item, expectedOut);
      if (!result.ok) {
        outcome.failed.push({ path: item.path, reason: result.reason, item });
        continue;
      }
      // Security: a batch file's `path` is agent-controlled output metadata, not a validated
      // filesystem path — reject a ".." segment or an absolute path outright, and require the
      // resolved destination to stay inside the wiki's `platform/` tree (every phase here is
      // the platform layer) rather than trusting resolve() to keep it there.
      if (item.path.split(/[\\/]/).includes("..") || item.path.startsWith("/")) {
        outcome.failed.push({ path: item.path, reason: "output path contains a \"..\" segment or is absolute", item });
        continue;
      }
      const dest = resolve(wikiRoot, item.path);
      const wikiPlatformRoot = resolve(wikiRoot, "platform");
      if (dest !== wikiPlatformRoot && !dest.startsWith(wikiPlatformRoot + sep)) {
        outcome.failed.push({ path: item.path, reason: "output path escapes the wiki's platform tree", item });
        continue;
      }
      mkdirSync(dirname(dest), { recursive: true });
      renameSync(expectedOut, dest);
      outcome.ok.push({ path: item.path, item });
    }
    rmSync(file, { force: true });
  }
  return outcome;
}

export function fileSha256(path: string): string {
  return sha256(readFileSync(path));
}

export function fileSize(path: string): number {
  return statSync(path).size;
}

/** Recursively lists regular files under `dir` (used to count ingest `skipped` stragglers). */
export function listAllFiles(dir: string): string[] {
  if (!existsSync(dir)) return [];
  const out: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = resolve(dir, entry.name);
    if (entry.isDirectory()) out.push(...listAllFiles(full));
    else if (entry.isFile()) out.push(full);
  }
  return out;
}
