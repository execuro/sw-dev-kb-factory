/**
 * Registry — discovers layers under the wiki root (`<root>/<layer>/index.md`),
 * routes every wiki-root-relative path to its layer, serves the package-root
 * files (`README.md`, `composer.json`) and runs greps through a bounded pool.
 */
import { existsSync, lstatSync, readFileSync, readdirSync, realpathSync, statSync } from "node:fs";
import { cpus, homedir } from "node:os";
import { dirname, isAbsolute, join, resolve, sep } from "node:path";
import type {
  ConfigSource,
  CorpusInfo,
  DocSource,
  Entry,
  GrepArgs,
  GrepResult,
  LayerStatus,
  ListArgs,
  ListResult,
  ReadArgs,
  ReadResult,
  TreeLimits,
} from "./types.js";
import { KNOWN_LAYERS, MAX_READ_FILE_BYTES, MAX_RESPONSE_BYTES } from "./types.js";
import { WikiSource, type WikiSourceOptions } from "./sources/platform/wiki-source.js";
import { PlannedSource } from "./sources/planned.js";
import { createProjectPlanned, PROJECT_PLANNED } from "./sources/project/planned.js";
import { createMarketplacePlanned } from "./sources/marketplace/planned.js";
import { GuidelinesView } from "./sources/guidelines/view.js";
import { joinRange, readText, splitLines } from "./wiki/fs.js";

/** Re-walked at most this often (ms) so pages added/edited under a project wiki mid-session appear without a restart. */
export const PROJECT_VOLATILE_TTL_MS = 2000;

// ------------------------------------------------------------- grep pool --

export interface PoolOptions {
  concurrency?: number;
  queueTimeoutMs?: number;
  maxQueue?: number;
}

/** FIFO pool: at most `concurrency` greps run; the rest wait up to `queueTimeoutMs`. */
export class GrepPool {
  readonly concurrency: number;
  readonly queueTimeoutMs: number;
  readonly maxQueue: number;
  private active = 0;
  private readonly queue: { start: () => void; timer: NodeJS.Timeout }[] = [];

  constructor(opts: PoolOptions = {}) {
    this.concurrency = opts.concurrency ?? Math.max(1, Math.min(8, cpus().length || 1));
    this.queueTimeoutMs = opts.queueTimeoutMs ?? 10_000;
    this.maxQueue = opts.maxQueue ?? 1_000;
  }

  get queued(): number {
    return this.queue.length;
  }

  run<T>(task: () => Promise<T>, onTimeout: () => T): Promise<T> {
    return new Promise<T>((resolvePromise) => {
      const execute = () => {
        this.active++;
        task()
          .then(resolvePromise, () => resolvePromise(onTimeout()))
          .finally(() => {
            this.active--;
            this.next();
          });
      };
      if (this.active < this.concurrency) {
        execute();
        return;
      }
      if (this.queue.length >= this.maxQueue) {
        resolvePromise(onTimeout());
        return;
      }
      const item = {
        start: execute,
        timer: setTimeout(() => {
          const i = this.queue.indexOf(item);
          if (i >= 0) this.queue.splice(i, 1);
          resolvePromise(onTimeout());
        }, this.queueTimeoutMs),
      };
      this.queue.push(item);
    });
  }

  private next(): void {
    while (this.active < this.concurrency && this.queue.length > 0) {
      const item = this.queue.shift()!;
      clearTimeout(item.timer);
      item.start();
    }
  }
}

// ---------------------------------------------------------- root checks --

// Dot-directories (`.git`, `.claude`, …) are never served — `walkTree`, `discoverLayers`
// and `rootDirs` all skip dot-entries — so they are neither refused nor descended into
// here: the served roots may be git checkouts, and Claude Code itself auto-creates
// `.claude/.cc-writes/` in directories it writes into.
const FORBIDDEN_DIRS = new Set(["ingest", "src", "node_modules"]);

function explicitWikiRootValue(
  argv: readonly string[],
  env: Record<string, string | undefined>,
): { value: string; source: "arg" | "env" } | undefined {
  let value: string | undefined;
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--wiki-root" && i + 1 < argv.length) value = argv[i + 1];
    else if (argv[i].startsWith("--wiki-root=")) value = argv[i].slice("--wiki-root=".length);
  }
  if (value !== undefined) return { value, source: "arg" };
  if (env.WIKI_ROOT !== undefined && env.WIKI_ROOT !== "") return { value: env.WIKI_ROOT, source: "env" };
  return undefined;
}

/**
 * Resolves the wiki root from `--wiki-root`, `WIKI_ROOT` or the bundle
 * default; relative values resolve against the bundle directory, never cwd.
 */
export function resolveWikiRoot(
  argv: readonly string[],
  env: Record<string, string | undefined>,
  bundleDir: string,
): string {
  const explicit = explicitWikiRootValue(argv, env);
  if (explicit === undefined) return resolve(bundleDir, "..", "wiki");
  return isAbsolute(explicit.value) ? explicit.value : resolve(bundleDir, explicit.value);
}

/**
 * B5: returns the realpath'ed root, or throws an Error whose message is the
 * one-line reason (the caller prints it to stderr and exits). When `corpus`
 * is set, its `developer`/`merchant` directories must exist under the root
 * and contain at least one `.md` file.
 */
export function validateWikiRoot(
  root: string,
  bundleDir: string,
  home: string = homedir(),
  corpus: CorpusInfo | null = null,
): string {
  let real: string;
  try {
    real = realpathSync(root);
  } catch {
    throw new Error(`wiki root does not exist: ${root}`);
  }
  if (!statSync(real).isDirectory()) throw new Error(`wiki root is not a directory: ${root}`);
  const realHome = safeReal(home);
  if (real === sep || real === realHome) throw new Error("wiki root must not be / or the home directory");
  const realBundle = safeReal(bundleDir) ?? resolve(bundleDir);
  if (realBundle === real || realBundle.startsWith(real + sep)) {
    throw new Error("wiki root must not be a parent of the server bundle directory");
  }
  const forbidden = findForbiddenDir(real, 12);
  if (forbidden) throw new Error(`wiki root contains a forbidden directory: ${forbidden}`);
  if (discoverLayers(real).length === 0) throw new Error(`wiki root contains no <layer>/index.md: ${root}`);
  if (isRegularDir(join(real, "guidelines"))) {
    throw new Error(`wiki root must not have its own guidelines/ directory: "guidelines" is a reserved virtual layer`);
  }
  if (corpus) {
    for (const key of ["developer", "merchant"] as const) {
      const rel = corpus[key];
      const abs = join(real, rel);
      if (!isRegularDir(abs)) throw new Error(`corpus "${corpus.name}" ${key} directory missing: ${rel}`);
      if (!hasMarkdownFile(abs, 12)) throw new Error(`corpus "${corpus.name}" ${key} directory has no markdown files: ${rel}`);
    }
  }
  return real;
}

export type ProjectWikiSource = "arg" | "env" | "claude-project-dir" | "cwd" | "disabled";

export interface ProjectWikiResolution {
  /** `null` only when `source === "disabled"` (`KB_PROJECT_WIKI=off`). */
  root: string | null;
  source: ProjectWikiSource;
}

function projectWikiArgValue(argv: readonly string[]): string | undefined {
  let value: string | undefined;
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--project-wiki" && i + 1 < argv.length) value = argv[i + 1];
    else if (argv[i].startsWith("--project-wiki=")) value = argv[i].slice("--project-wiki=".length);
  }
  return value;
}

/**
 * Project root resolution (first match wins): `--project-wiki` arg > `KB_PROJECT_WIKI` env
 * (`off` disables the layer) > `$CLAUDE_PROJECT_DIR/docs/project-wiki` > `<cwd>/docs/project-wiki`.
 * Relative values resolve against `cwd`, never the bundle, so resolution survives a plugin move.
 */
export function resolveProjectWikiRoot(argv: readonly string[], env: Record<string, string | undefined>, cwd: string): ProjectWikiResolution {
  const argValue = projectWikiArgValue(argv);
  if (argValue !== undefined) return { root: isAbsolute(argValue) ? argValue : resolve(cwd, argValue), source: "arg" };
  if (env.KB_PROJECT_WIKI !== undefined && env.KB_PROJECT_WIKI !== "") {
    if (env.KB_PROJECT_WIKI === "off") return { root: null, source: "disabled" };
    return { root: isAbsolute(env.KB_PROJECT_WIKI) ? env.KB_PROJECT_WIKI : resolve(cwd, env.KB_PROJECT_WIKI), source: "env" };
  }
  if (env.CLAUDE_PROJECT_DIR !== undefined && env.CLAUDE_PROJECT_DIR !== "") {
    const base = isAbsolute(env.CLAUDE_PROJECT_DIR) ? env.CLAUDE_PROJECT_DIR : resolve(cwd, env.CLAUDE_PROJECT_DIR);
    return { root: join(base, "docs", "project-wiki"), source: "claude-project-dir" };
  }
  return { root: join(cwd, "docs", "project-wiki"), source: "cwd" };
}

export interface ProjectRootValidation {
  ok: boolean;
  real?: string;
  reason?: string;
}

/**
 * Soft-fail sibling of `validateWikiRoot` for the project root: same realpath / `/` / `$HOME` /
 * parent-of-bundle checks, but requires a regular `index.md` directly under the root (the
 * project root *is* the layer, not a directory of layers) and returns a reason instead of
 * throwing — an invalid or absent project wiki never stops the server.
 */
export function validateProjectRoot(root: string, bundleDir: string, home: string = homedir()): ProjectRootValidation {
  let real: string;
  try {
    real = realpathSync(root);
  } catch {
    return { ok: false, reason: `project wiki does not exist: ${root}` };
  }
  if (!isRegularDir(real)) return { ok: false, reason: `project wiki is not a directory: ${root}` };
  const realHome = safeReal(home);
  if (real === sep || real === realHome) return { ok: false, reason: "project wiki must not be / or the home directory" };
  const realBundle = safeReal(bundleDir) ?? resolve(bundleDir);
  if (realBundle === real || realBundle.startsWith(real + sep)) {
    return { ok: false, reason: "project wiki must not be a parent of the server bundle directory" };
  }
  if (!isRegularFile(join(real, "index.md"))) return { ok: false, reason: `project wiki has no index.md: ${root}` };
  return { ok: true, real };
}

function safeReal(p: string): string | null {
  try {
    return realpathSync(p);
  } catch {
    return null;
  }
}

function findForbiddenDir(absRoot: string, maxDepth: number): string | null {
  const stack: { rel: string; depth: number }[] = [{ rel: "", depth: 0 }];
  while (stack.length > 0) {
    const { rel, depth } = stack.pop()!;
    let names: string[];
    try {
      names = readdirSync(rel === "" ? absRoot : join(absRoot, rel));
    } catch {
      continue;
    }
    for (const name of names) {
      if (name.startsWith(".")) continue; // dot-directories: never refused, never descended
      const childRel = rel === "" ? name : `${rel}/${name}`;
      let st;
      try {
        st = lstatSync(join(absRoot, childRel));
      } catch {
        continue;
      }
      if (!st.isDirectory()) continue;
      if (FORBIDDEN_DIRS.has(name)) return childRel;
      if (depth + 1 < maxDepth) stack.push({ rel: childRel, depth: depth + 1 });
    }
  }
  return null;
}

/** True when `absDir` (or a non-dot subdirectory, up to `maxDepth`) contains a regular `.md` file. */
function hasMarkdownFile(absDir: string, maxDepth: number): boolean {
  const stack: { dir: string; depth: number }[] = [{ dir: absDir, depth: 0 }];
  while (stack.length > 0) {
    const { dir, depth } = stack.pop()!;
    let names: string[];
    try {
      names = readdirSync(dir);
    } catch {
      continue;
    }
    for (const name of names) {
      if (name.startsWith(".")) continue;
      const abs = join(dir, name);
      let st;
      try {
        st = lstatSync(abs);
      } catch {
        continue;
      }
      if (st.isFile() && name.endsWith(".md")) return true;
      if (st.isDirectory() && depth + 1 < maxDepth) stack.push({ dir: abs, depth: depth + 1 });
    }
  }
  return false;
}

// -------------------------------------------------------------- kb.config --

interface CorpusConfigEntry {
  root: string;
  developer: string;
  merchant: string;
  entryPoints: string[];
  /** Whether this corpus serves a `project` layer at all; default true. The `docs` corpus sets this `false`. */
  project?: boolean;
}

interface CorpusConfigFile {
  corpus: string;
  corpora: Record<string, CorpusConfigEntry>;
}

const MAX_CONFIG_BYTES = 64 * 1024;

function configArgValue(argv: readonly string[]): string | undefined {
  let value: string | undefined;
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--config" && i + 1 < argv.length) value = argv[i + 1];
    else if (argv[i].startsWith("--config=")) value = argv[i].slice("--config=".length);
  }
  return value;
}

function corpusArgValue(argv: readonly string[]): string | undefined {
  let value: string | undefined;
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--corpus" && i + 1 < argv.length) value = argv[i + 1];
    else if (argv[i].startsWith("--corpus=")) value = argv[i].slice("--corpus=".length);
  }
  return value;
}

/** `--config`/`KB_CONFIG` override the default `<bundleDir>/../kb.config.json`; relative values resolve against `bundleDir`. */
export function resolveConfigPath(
  argv: readonly string[],
  env: Record<string, string | undefined>,
  bundleDir: string,
): string {
  const arg = configArgValue(argv);
  const value = arg ?? (env.KB_CONFIG !== undefined && env.KB_CONFIG !== "" ? env.KB_CONFIG : undefined);
  if (value === undefined) return resolve(bundleDir, "..", "kb.config.json");
  return isAbsolute(value) ? value : resolve(bundleDir, value);
}

/** Parses and validates `kb.config.json`; throws a one-line `Error` naming the file on any problem. */
export function loadKbConfig(path: string): CorpusConfigFile {
  let raw: string;
  try {
    raw = readFileSync(path, "utf8");
  } catch {
    throw new Error(`cannot read kb config: ${path}`);
  }
  if (Buffer.byteLength(raw) > MAX_CONFIG_BYTES) throw new Error(`kb config larger than 64 KB: ${path}`);
  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch {
    throw new Error(`kb config is not valid JSON: ${path}`);
  }
  return validateKbConfigShape(json, path);
}

function validateKbConfigShape(json: unknown, path: string): CorpusConfigFile {
  if (typeof json !== "object" || json === null) throw new Error(`kb config must be a JSON object: ${path}`);
  const obj = json as Record<string, unknown>;
  if (typeof obj.corpus !== "string" || obj.corpus === "") throw new Error(`kb config "corpus" must be a non-empty string: ${path}`);
  if (typeof obj.corpora !== "object" || obj.corpora === null) throw new Error(`kb config "corpora" must be an object: ${path}`);
  const corpora: Record<string, CorpusConfigEntry> = {};
  for (const [name, value] of Object.entries(obj.corpora as Record<string, unknown>)) {
    if (typeof value !== "object" || value === null) throw new Error(`kb config corpus "${name}" must be an object: ${path}`);
    const c = value as Record<string, unknown>;
    for (const key of ["root", "developer", "merchant"] as const) {
      if (typeof c[key] !== "string" || c[key] === "") throw new Error(`kb config corpus "${name}" field "${key}" must be a non-empty string: ${path}`);
    }
    if (!Array.isArray(c.entryPoints) || c.entryPoints.some((e) => typeof e !== "string" || e === "")) {
      throw new Error(`kb config corpus "${name}" field "entryPoints" must be an array of non-empty strings: ${path}`);
    }
    if (c.project !== undefined && typeof c.project !== "boolean") throw new Error(`kb config corpus "${name}" field "project" must be a boolean: ${path}`);
    corpora[name] = {
      root: c.root as string,
      developer: c.developer as string,
      merchant: c.merchant as string,
      entryPoints: c.entryPoints as string[],
      project: c.project as boolean | undefined,
    };
  }
  if (!(obj.corpus in corpora)) throw new Error(`kb config "corpus" (${obj.corpus}) is not a key of "corpora": ${path}`);
  return { corpus: obj.corpus, corpora };
}

export interface ResolvedCorpus {
  root: string;
  corpus: CorpusInfo | null;
  source: ConfigSource;
  configPath: string | null;
  /** Whether the selected corpus wants a `project` layer at all (`kb.config.json` `project: false`); default true. */
  projectEnabled: boolean;
}

/**
 * Resolves the wiki root and its corpus metadata: `--wiki-root` arg >
 * `WIKI_ROOT` env > corpus selection (`--corpus` arg > `KB_CORPUS` env >
 * `kb.config.json` `corpus`) resolved through `corpora[name].root` > bundle
 * default `../wiki`. Throws a one-line `Error` on a malformed config, an
 * unknown corpus name, or a corpus requested with no config file present.
 */
export function resolveCorpus(
  argv: readonly string[],
  env: Record<string, string | undefined>,
  bundleDir: string,
): ResolvedCorpus {
  const configPath = resolveConfigPath(argv, env, bundleDir);
  const config = existsSync(configPath) ? loadKbConfig(configPath) : null;
  const configPathOut = config ? configPath : null;

  const explicit = explicitWikiRootValue(argv, env);
  if (explicit !== undefined) {
    const root = isAbsolute(explicit.value) ? explicit.value : resolve(bundleDir, explicit.value);
    let corpus: CorpusInfo | null = null;
    let projectEnabled = true;
    if (config) {
      const rootReal = safeReal(root) ?? root;
      for (const [name, c] of Object.entries(config.corpora)) {
        const cRoot = isAbsolute(c.root) ? c.root : resolve(bundleDir, c.root);
        if ((safeReal(cRoot) ?? cRoot) === rootReal) {
          corpus = { name, developer: c.developer, merchant: c.merchant, entryPoints: c.entryPoints };
          projectEnabled = c.project !== false;
          break;
        }
      }
    }
    return { root, corpus, source: explicit.source, configPath: configPathOut, projectEnabled };
  }

  const corpusArg = corpusArgValue(argv);
  const corpusEnv = env.KB_CORPUS !== undefined && env.KB_CORPUS !== "" ? env.KB_CORPUS : undefined;
  const name = corpusArg ?? corpusEnv ?? config?.corpus;
  const source: ConfigSource = corpusArg !== undefined ? "arg" : corpusEnv !== undefined ? "env" : config ? "config" : "default";

  if (name === undefined) return { root: resolve(bundleDir, "..", "wiki"), corpus: null, source: "default", configPath: null, projectEnabled: true };
  if (!config) throw new Error(`corpus "${name}" requested but no kb.config.json found at ${configPath}`);
  const entry = config.corpora[name];
  if (!entry) throw new Error(`unknown corpus "${name}"; available: ${Object.keys(config.corpora).sort().join(", ")}`);
  const root = isAbsolute(entry.root) ? entry.root : resolve(bundleDir, entry.root);
  return {
    root,
    corpus: { name, developer: entry.developer, merchant: entry.merchant, entryPoints: entry.entryPoints },
    source,
    configPath: configPathOut,
    projectEnabled: entry.project !== false,
  };
}

/** Directory names under `absRoot` (regular dirs, not symlinks, not dot-entries) that have a regular `index.md`. */
export function discoverLayers(absRoot: string): string[] {
  const out: string[] = [];
  for (const name of readdirSync(absRoot)) {
    if (name.startsWith(".")) continue;
    if (!isRegularDir(join(absRoot, name))) continue;
    if (isRegularFile(join(absRoot, name, "index.md"))) out.push(name);
  }
  return out.sort();
}

function isRegularDir(abs: string): boolean {
  try {
    return lstatSync(abs).isDirectory();
  } catch {
    return false;
  }
}

function isRegularFile(abs: string): boolean {
  try {
    return lstatSync(abs).isFile();
  } catch {
    return false;
  }
}

// --------------------------------------------------------------- registry --

export interface ProjectLayerOverride {
  /** Realpath'ed, `validateProjectRoot`-validated external project root. */
  root: string;
  /** e.g. a notice that the external root took precedence over an in-tree `project/`. */
  notice?: string;
}

export interface RegistryOptions extends WikiSourceOptions {
  pool?: PoolOptions;
  limits?: TreeLimits;
  /** An external, already-validated project-wiki root to serve as the `project` layer, taking precedence over any in-tree `<wikiRoot>/project/`. */
  project?: ProjectLayerOverride;
  /** Reason to report when there is no external project override and no in-tree `<wikiRoot>/project/index.md` either. */
  projectPlannedReason?: string;
  /**
   * Set when the project layer was chosen explicitly and cannot be served: an invalid `--project-wiki` /
   * `KB_PROJECT_WIKI`, `KB_PROJECT_WIKI=off`, or a corpus with `"project": false`. `project` stays planned with
   * this reason and an in-tree `<wikiRoot>/project/` is NOT used as a fallback.
   */
  projectDisabledReason?: string;
}

const ROOT_FILES = ["README.md", "composer.json"] as const;

export class Registry {
  private readonly sources = new Map<string, DocSource>();
  private readonly pool: GrepPool;
  /** package-root files present as regular files */
  private readonly rootFiles = new Set<string>();
  /** every non-dot regular directory under the root (layers, planned or not) */
  private readonly rootDirs: string[] = [];

  constructor(sources: DocSource[], opts: { pool?: PoolOptions; absRoot?: string } = {}) {
    for (const s of sources) this.sources.set(s.layer, s);
    this.pool = new GrepPool(opts.pool);
    this.absRoot = opts.absRoot ?? null;
    if (this.absRoot) {
      for (const f of ROOT_FILES) if (isRegularFile(join(this.absRoot, f))) this.rootFiles.add(f);
      for (const name of readdirSync(this.absRoot).sort()) {
        if (!name.startsWith(".") && isRegularDir(join(this.absRoot, name))) this.rootDirs.push(name);
      }
    }
  }

  private readonly absRoot: string | null;

  /** `absRoot` must be the realpath'ed, validated wiki root. */
  static createDefault(absRoot: string, opts: RegistryOptions = {}): Registry {
    const { pool, project, projectPlannedReason, projectDisabledReason, ...sourceOpts } = opts;
    const present = discoverLayers(absRoot);
    const sources: DocSource[] = [];
    for (const layer of present) {
      // an external root takes precedence over the in-tree one; an explicit choice that failed disables both
      if (layer === "project" && (project || projectDisabledReason !== undefined)) continue;
      sources.push(new WikiSource(absRoot, layer, sourceOpts));
    }
    if (projectDisabledReason !== undefined) {
      sources.push(new PlannedSource("project", projectDisabledReason));
    } else if (project) {
      sources.push(
        new WikiSource(absRoot, "project", {
          volatileTtlMs: PROJECT_VOLATILE_TTL_MS,
          ...sourceOpts,
          layerDir: project.root,
          manifestOptional: true,
          sourceSupported: false,
          lazy: true,
          extraNotices: project.notice ? [project.notice] : [],
        }),
      );
    } else if (!present.includes("project")) {
      sources.push(new PlannedSource("project", projectPlannedReason ?? PROJECT_PLANNED));
    }
    for (const known of KNOWN_LAYERS) {
      if (known === "project") continue; // handled above
      if (present.includes(known)) continue;
      if (known === "marketplace") sources.push(createMarketplacePlanned());
      else sources.push(new PlannedSource(known, `${known}-layer wiki not built yet (no ${known}/index.md under the wiki root).`));
    }

    const byLayer = new Map(sources.map((s) => [s.layer, s]));
    const platformSrc = byLayer.get("platform") ?? null;
    const projectSrc = byLayer.get("project") ?? null;
    const hasPlatformGuidelines = isRegularDir(join(absRoot, "platform", "guidelines"));
    const hasProjectGuidelines =
      projectDisabledReason !== undefined
        ? false
        : project
          ? isRegularDir(join(project.root, "guidelines"))
          : isRegularDir(join(absRoot, "project", "guidelines"));
    if ((hasPlatformGuidelines || hasProjectGuidelines) && (platformSrc || projectSrc)) {
      sources.push(new GuidelinesView(platformSrc, projectSrc));
    }

    return new Registry(sources, { pool, absRoot });
  }

  layers(): string[] {
    return [...this.sources.keys()].sort();
  }

  statuses(): LayerStatus[] {
    return this.layers().map((l) => this.sources.get(l)!.status());
  }

  /** The layer directory name a path belongs to (its first segment). */
  routeOf(path: string): DocSource | null {
    const first = path.split("/")[0];
    return this.sources.get(first) ?? null;
  }

  list(args: ListArgs): ListResult {
    if (args.path === "") return this.listRoot();
    const src = this.routeOf(args.path);
    if (!src) {
      if (args.path.indexOf("/") < 0 && this.rootFiles.has(args.path)) {
        return { path: args.path, entries: [{ path: args.path, name: args.path, type: "file" }], truncated: false, notices: [] };
      }
      return { path: args.path, entries: [], truncated: false, notices: [`no such path: ${args.path}`] };
    }
    return src.list(args);
  }

  private listRoot(): ListResult {
    const entries: Entry[] = [];
    const notices: string[] = [];
    const dirs = new Set<string>(this.rootDirs);
    // Virtual layers (`guidelines`) and an externally-served `project` layer have no physical
    // directory directly under the wiki root, but still belong in the root listing.
    for (const l of this.layers()) {
      if (dirs.has(l)) continue;
      if (this.sources.get(l)!.status().status === "implemented") dirs.add(l);
    }
    for (const name of [...dirs].sort()) entries.push({ path: name, name, type: "dir" });
    for (const f of ROOT_FILES) if (this.rootFiles.has(f)) entries.push({ path: f, name: f, type: "file" });
    for (const st of this.statuses()) {
      if (st.status !== "implemented") notices.push(`layer ${st.layer}: ${st.status}`);
    }
    const res: ListResult = { path: "", entries, truncated: false, notices };
    if (this.rootFiles.has("README.md")) {
      try {
        res.index = readText(join(this.absRoot!, "README.md"));
      } catch {
        /* ignore */
      }
    }
    return res;
  }

  grep(args: GrepArgs): Promise<GrepResult> {
    const src = this.routeOf(args.path);
    const mode = args.mode ?? "content";
    const empty = (notices: string[]): GrepResult => {
      const r: GrepResult = { truncated: false, notices };
      if (mode === "content") r.matches = [];
      else if (mode === "files") r.files = [];
      else r.counts = [];
      return r;
    };
    if (!src) return Promise.resolve(empty([`no such path: ${args.path}`]));
    return this.pool.run(
      () => src.grep(args),
      () => empty(["queue timeout"]),
    );
  }

  async read(args: ReadArgs): Promise<ReadResult> {
    const src = this.routeOf(args.path);
    if (src) return src.read(args);
    if (args.path.indexOf("/") < 0 && this.rootFiles.has(args.path) && this.absRoot) return this.readRootFile(args);
    return {
      path: args.path,
      frontmatter: {},
      raw: "",
      lineFrom: 0,
      lineTo: 0,
      totalLines: 0,
      citation: "",
      truncated: false,
      notices: [`no such path: ${args.path}`],
    };
  }

  private readRootFile(args: ReadArgs): ReadResult {
    const abs = join(this.absRoot!, args.path);
    const res: ReadResult = {
      path: args.path,
      frontmatter: {},
      raw: "",
      lineFrom: 0,
      lineTo: 0,
      totalLines: 0,
      citation: "",
      truncated: false,
      notices: [],
    };
    if (args.source === true) {
      res.notices.push(`no source snapshot for: ${args.path}`);
      return res;
    }
    if (lstatSync(abs).size > MAX_READ_FILE_BYTES) {
      res.notices.push(`file larger than 2 MB is not served: ${args.path}`);
      return res;
    }
    const { lines, endsWithNewline } = splitLines(readText(abs));
    res.totalLines = lines.length;
    if (args.section !== undefined) res.notices.push(`unknown section anchor "${args.section}"; returning the full page`);
    const from = Math.max(1, args.offset ?? 1);
    let to = Math.min(lines.length, from + Math.max(1, args.limit ?? 2000) - 1);
    let bytes = 0;
    for (let i = from; i <= to; i++) {
      bytes += Buffer.byteLength(lines[i - 1]) + 1;
      if (bytes > MAX_RESPONSE_BYTES) {
        res.truncated = true;
        res.notices.push(`response capped at 256 KB; continue with offset ${i}`);
        to = i - 1;
        break;
      }
    }
    res.lineFrom = from;
    res.lineTo = to;
    res.citation = to >= from ? `${args.path}:${from}-${to}` : "";
    res.raw = to >= from ? joinRange(lines, from, to, endsWithNewline) : "";
    return res;
  }
}

/** Directory of the running bundle / module (used for the default root and relative resolution). */
export function bundleDirOf(importMetaUrl: string): string {
  return dirname(new URL(importMetaUrl).pathname.replace(/%20/g, " "));
}

export function wikiRootExists(root: string): boolean {
  return existsSync(root);
}
