/**
 * WikiSource — serves one layer directory `<root>/<layer>/` that has an
 * `index.md`. Generic: the layer name is data. Startup preloads the tree and
 * every page's frontmatter; bodies are read lazily and kept in a byte-bounded
 * LRU. Only regular files of allowlisted names inside the preloaded tree are
 * ever opened, read-only.
 */
import { createHash } from "node:crypto";
import { readFileSync, realpathSync, statSync } from "node:fs";
import { join, resolve, sep } from "node:path";
import { performance } from "node:perf_hooks";
import type {
  DocSource,
  GrepArgs,
  GrepResult,
  LayerStatus,
  ListArgs,
  ListResult,
  Match,
  ReadArgs,
  ReadResult,
  TreeLimits,
} from "../../types.js";
import {
  BODY_CACHE_BYTES,
  CONTRACT_MAJOR,
  DEFAULT_TREE_LIMITS,
  MAX_ENTRIES,
  MAX_MANIFEST_BYTES,
  MAX_READ_FILE_BYTES,
  MAX_RESPONSE_BYTES,
} from "../../types.js";
import {
  LruCache,
  buildMatcher,
  compileGlob,
  grepLines,
  joinRange,
  readText,
  sectionRange,
  splitLines,
  walkTree,
  type Glob,
  type TreeNode,
  type WalkResult,
} from "../../wiki/fs.js";

const MANIFEST_KEYS = ["contract", "versions", "lastBuilt", "counts", "pages", "treeHash", "hubs", "coreVersion", "vendorHash"] as const;

export interface WikiSourceOptions {
  limits?: TreeLimits;
  /** KB_VERIFY=1 — recompute fileHash/treeHash at startup. */
  verify?: boolean;
  /** Per-call matching budget in ms (A7). */
  matchBudgetMs?: number;
  /** Files scanned between event-loop yields. */
  yieldEvery?: number;
  bodyCacheBytes?: number;
  /** Verbatim source-snapshot cache dir (default `<physical layer root>/../ingest/<layer>/.cache/src`). */
  sourceCacheDir?: string;
  /**
   * Physical directory the layer's files actually live in, when it differs from
   * `<absRoot>/<layer>` — e.g. an external project-wiki root served under the logical
   * `project/...` namespace. Must already be realpath'ed and validated by the caller.
   */
  layerDir?: string;
  /** No `manifest.json` is expected for this layer; its absence is not reported (project layer). */
  manifestOptional?: boolean;
  /** `read_doc source:true` is not offered for this layer (project layer); default true. */
  sourceSupported?: boolean;
  /** Skip the startup tree walk; the first call triggers it. */
  lazy?: boolean;
  /** Re-walk the tree at most this often (ms), so files added/removed mid-session appear without a restart. Undefined = never re-walk after the first (existing platform behaviour). */
  volatileTtlMs?: number;
  /** Notices always present in `status()`, e.g. "external project root takes precedence over …". */
  extraNotices?: string[];
}

interface Body {
  lines: string[];
  endsWithNewline: boolean;
  bytes: number;
  /** mtime/size of the file this body was read from, for cache freshness (mirrors the manifest's own mtime check). */
  mtimeMs: number;
  size: number;
}

export interface FileStamp {
  mtimeMs: number;
  size: number;
}

export class WikiSource implements DocSource {
  readonly layer: string;
  private readonly absRoot: string;
  /** Physical directory the layer's files live in: `layerDir` when given, else `<absRoot>/<layer>`. */
  private readonly physRoot: string;
  private readonly limits: TreeLimits;
  private readonly matchBudgetMs: number;
  private readonly yieldEvery: number;
  private readonly sourceCacheDir: string;
  private readonly manifestOptional: boolean;
  private readonly sourceSupported: boolean;
  private readonly volatileTtlMs: number | undefined;
  private readonly extraNotices: string[];
  private readonly cache: LruCache<Body>;
  private tree: WalkResult | null = null;
  /** The raw successful walk, kept even when a manifest reload marks the layer `unsupported` (E5). */
  private walkResult: WalkResult | null = null;
  private statusValue: LayerStatus;
  private manifest: Record<string, unknown> = {};
  private integrity: "ok" | "mismatch" | "unverified" = "unverified";
  /** Notices from the most recent tree walk; replaced wholesale on each (re)walk. */
  private walkNotices: string[] = [];
  /** Notices from the most recent manifest (re)load; replaced wholesale on each reload, unlike `walkNotices`. */
  private manifestNotices: string[] = [];
  /** mtimeMs of manifest.json as of the last check; `undefined` = never checked, `null` = confirmed absent. */
  private manifestMtimeMs: number | null | undefined = undefined;
  private verifyOnLoad = false;
  /** 0 = never walked yet (forces a walk on first `ensureFresh()`, covering `lazy`). */
  private lastWalkAt = 0;

  /** `absRoot` (and `opts.layerDir`, when given) must already be realpath'ed and validated (B4/B5). */
  constructor(absRoot: string, layer: string, opts: WikiSourceOptions = {}) {
    this.absRoot = absRoot;
    this.layer = layer;
    this.limits = opts.limits ?? DEFAULT_TREE_LIMITS;
    this.matchBudgetMs = opts.matchBudgetMs ?? 2000;
    this.yieldEvery = opts.yieldEvery ?? 64;
    this.physRoot = opts.layerDir ?? join(absRoot, layer);
    this.manifestOptional = opts.manifestOptional === true;
    this.sourceSupported = opts.sourceSupported !== false;
    this.volatileTtlMs = opts.volatileTtlMs;
    this.extraNotices = opts.extraNotices ?? [];
    this.sourceCacheDir = opts.sourceCacheDir ?? resolve(absRoot, "..", "ingest", layer, ".cache", "src");
    this.cache = new LruCache<Body>(opts.bodyCacheBytes ?? BODY_CACHE_BYTES);
    this.verifyOnLoad = opts.verify === true;
    this.statusValue = { layer, status: "implemented", synonyms: false, integrity: "unverified", notices: [] };
    if (opts.lazy !== true) {
      this.runWalk();
      this.lastWalkAt = Date.now();
    }
  }

  // ------------------------------------------------------------ startup --

  /** Re-walks the physical tree and refreshes the manifest; always leaves `this.tree` matching the latest walk. */
  private runWalk(): void {
    const walk = walkTree(this.absRoot, this.layer, this.limits, this.physRoot);
    this.walkNotices = [...walk.notices];
    if (walk.oversized) {
      this.walkNotices.push(`layer not served: ${walk.oversized}`);
      this.walkResult = null;
      this.tree = null;
      this.statusValue = this.buildStatus("oversized");
      return;
    }
    this.walkResult = walk;
    this.tree = walk;
    this.refreshManifest();
  }

  /**
   * Ensures the tree is fresh before serving a call: walks once lazily on first access, then
   * re-walks at most every `volatileTtlMs` (the project layer); layers without a TTL just get
   * the existing cheap manifest re-stat every call.
   */
  private ensureFresh(): void {
    const now = Date.now();
    const needsWalk = this.lastWalkAt === 0 || (this.volatileTtlMs !== undefined && now - this.lastWalkAt >= this.volatileTtlMs);
    if (needsWalk) {
      this.runWalk();
      this.lastWalkAt = now;
      return;
    }
    this.refreshManifest();
  }

  /** Absolute, symlink-resolved path to `<layer>/manifest.json`, or null if missing/escapes the layer root. */
  private resolveManifestPath(): string | null {
    let real: string;
    try {
      real = realpathSync(join(this.physRoot, "manifest.json"));
    } catch {
      return null;
    }
    if (real !== this.physRoot && !real.startsWith(this.physRoot + sep)) return null;
    return real;
  }

  /**
   * Re-stats manifest.json and re-parses it only when it appeared, disappeared, or its mtime
   * changed since the last check — so ingestion runs that finish after server startup are picked
   * up without a restart, while unchanged calls stay a single cheap stat.
   */
  private refreshManifest(): void {
    if (!this.walkResult) return; // oversized: no tree to serve, nothing to refresh
    const real = this.resolveManifestPath();
    let stat: { mtimeMs: number; size: number } | null = null;
    if (real) {
      try {
        stat = statSync(real);
      } catch {
        stat = null;
      }
    }
    const currentMtime = stat?.mtimeMs ?? null;
    if (currentMtime === this.manifestMtimeMs) return;
    this.manifestMtimeMs = currentMtime;
    this.applyManifest(real, stat);
  }

  private applyManifest(real: string | null, stat: { size: number } | null): void {
    this.manifestNotices = [];
    this.manifest = {};
    this.integrity = "unverified";
    this.tree = this.walkResult;
    if (!real || !stat) {
      if (!this.manifestOptional) this.manifestNotices.push("manifest.json missing");
      this.statusValue = this.buildStatus("implemented");
      return;
    }
    if (stat.size > MAX_MANIFEST_BYTES) {
      this.manifestNotices.push("manifest.json ignored: larger than 1 MB");
      this.statusValue = this.buildStatus("implemented");
      return;
    }
    try {
      const parsed: unknown = JSON.parse(readText(real));
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("not an object");
      const obj = parsed as Record<string, unknown>;
      for (const k of MANIFEST_KEYS) if (k in obj) this.manifest[k] = obj[k];
      const major = contractMajor(this.manifest.contract);
      if (major !== CONTRACT_MAJOR) {
        this.manifestNotices.push(
          `layer not served: manifest contract ${String(this.manifest.contract)} is not supported (server contract ${CONTRACT_MAJOR})`,
        );
        this.tree = null;
        this.statusValue = this.buildStatus("unsupported");
        return;
      }
      if (this.verifyOnLoad) this.integrity = this.verifyIntegrity();
    } catch (err) {
      this.manifestNotices.push(`manifest.json invalid: ${(err as Error).message}`);
      this.manifest = {};
    }
    this.statusValue = this.buildStatus("implemented");
  }

  private verifyIntegrity(): "ok" | "mismatch" {
    const pages = this.manifest.pages;
    if (!pages || typeof pages !== "object") {
      this.manifestNotices.push("integrity: manifest has no pages map");
      return "mismatch";
    }
    const lines: string[] = [];
    let ok = true;
    for (const [path, meta] of Object.entries(pages as Record<string, unknown>)) {
      const expected = meta && typeof meta === "object" ? (meta as Record<string, unknown>).fileHash : undefined;
      const node = this.tree?.nodes.get(path);
      if (!node || node.type !== "file" || typeof expected !== "string") {
        ok = false;
        continue;
      }
      const relFromLayer = path === this.layer ? "" : path.slice(this.layer.length + 1);
      const actual = createHash("sha256")
        .update(readFileSync(relFromLayer === "" ? this.physRoot : join(this.physRoot, relFromLayer)))
        .digest("hex");
      if (actual !== expected) ok = false;
      lines.push(`${path}:${expected}`);
    }
    lines.sort();
    const tree = createHash("sha256").update(lines.join("\n")).digest("hex");
    if (tree !== this.manifest.treeHash) ok = false;
    if (!ok) this.manifestNotices.push("integrity: fileHash/treeHash mismatch");
    return ok ? "ok" : "mismatch";
  }

  private buildStatus(status: LayerStatus["status"]): LayerStatus {
    const st: LayerStatus = {
      layer: this.layer,
      status,
      synonyms: this.tree?.nodes.has(`${this.layer}/synonyms.md`) ?? false,
      integrity: this.integrity,
      notices: [...this.extraNotices, ...this.walkNotices, ...this.manifestNotices],
    };
    for (const [k, v] of Object.entries(this.manifest)) {
      if (k === "pages") st.pageCount = v && typeof v === "object" ? Object.keys(v as object).length : 0;
      else st[k] = v;
    }
    return st;
  }

  /**
   * `kb_status` must stay cheap even over a large lazy layer (the project wiki): a `lazy`
   * source that has never been accessed reports a placeholder here instead of paying for its
   * first walk — that walk happens on the first real `list`/`grep`/`read` call instead.
   */
  status(): LayerStatus {
    if (this.lastWalkAt === 0) {
      return { layer: this.layer, status: "implemented", synonyms: false, integrity: "unverified", notices: [...this.extraNotices] };
    }
    this.ensureFresh();
    return this.buildStatus(this.statusValue.status);
  }

  private notServed(): string | null {
    if (this.tree) return null;
    return `layer ${this.layer} is not served (status: ${this.statusValue.status})`;
  }

  // -------------------------------------------------------------- bodies --

  private absOf(node: TreeNode): string {
    const relFromLayer = node.path === this.layer ? "" : node.path.slice(this.layer.length + 1);
    const abs = relFromLayer === "" ? this.physRoot : join(this.physRoot, relFromLayer);
    const real = realpathSync(abs);
    if (real !== this.physRoot && !real.startsWith(this.physRoot + sep)) {
      throw new Error("path escapes the wiki root");
    }
    return real;
  }

  /**
   * Re-stats the file on every call (cheap) and treats a cached body as a miss when
   * its mtime or size no longer matches — the same freshness discipline `refreshManifest`
   * already applies to `manifest.json`, so a body cached before a `wiki:build` is never
   * served after the file it came from changed underneath it.
   */
  private body(node: TreeNode): Body {
    const abs = this.absOf(node);
    const stat = statSync(abs);
    const cached = this.cache.get(node.path);
    if (cached && cached.mtimeMs === stat.mtimeMs && cached.size === stat.size) return cached;
    const text = readText(abs);
    const { lines, endsWithNewline } = splitLines(text);
    const body: Body = { lines, endsWithNewline, bytes: Buffer.byteLength(text), mtimeMs: stat.mtimeMs, size: stat.size };
    this.cache.set(node.path, body, body.bytes);
    return body;
  }

  /**
   * mtime/size of a served file, or `null` when it is absent (or the layer is not served). Lets a
   * composed view (`GuidelinesView`) key its cache on the files it merges without reading their bodies.
   */
  fileStamp(path: string): FileStamp | null {
    this.ensureFresh();
    if (!this.tree) return null;
    const node = this.tree.nodes.get(path);
    if (!node || node.type !== "file") return null;
    try {
      const stat = statSync(this.absOf(node));
      return { mtimeMs: stat.mtimeMs, size: stat.size };
    } catch {
      return null;
    }
  }

  // ---------------------------------------------------------------- list --

  list(args: ListArgs): ListResult {
    const res: ListResult = { path: args.path, entries: [], truncated: false, notices: [] };
    this.ensureFresh();
    const blocked = this.notServed();
    if (blocked) {
      res.notices.push(blocked);
      return res;
    }
    const tree = this.tree!;
    const node = tree.nodes.get(args.path);
    if (!node) {
      res.notices.push(`no such path: ${args.path}`);
      return res;
    }
    if (node.type === "file") {
      res.entries.push(entryOf(node));
      return res;
    }
    const glob = args.glob ? compileGlob(args.glob, args.caseSensitive === true) : null;
    const maxDepth = glob ? Number.POSITIVE_INFINITY : Math.min(5, Math.max(1, args.depth ?? 1));
    const base = node.path.length + 1;
    const visit = (dir: string, depth: number): boolean => {
      for (const child of tree.children.get(dir) ?? []) {
        const rel = child.path.slice(base);
        if (!glob || glob.test(rel) || glob.test(child.path)) {
          if (res.entries.length >= MAX_ENTRIES) {
            res.truncated = true;
            return false;
          }
          res.entries.push(entryOf(child));
        }
        if (child.type === "dir" && depth < maxDepth && !visit(child.path, depth + 1)) return false;
      }
      return true;
    };
    visit(node.path, 1);
    if (res.truncated) res.notices.push(`listing truncated at ${MAX_ENTRIES} entries; narrow the path or use glob`);
    const index = tree.nodes.get(`${node.path}/index.md`);
    if (index) {
      const b = this.body(index);
      res.index = joinRange(b.lines, 1, b.lines.length, b.endsWithNewline);
    }
    return res;
  }

  // ---------------------------------------------------------------- grep --

  /** Files to scan for `path` (a directory → every `.md` below; a `.md` file → itself), sorted by path. */
  private grepTargets(path: string, glob: Glob | null): TreeNode[] | null {
    const tree = this.tree!;
    const node = tree.nodes.get(path);
    if (!node) return null;
    if (node.type === "file") return node.name.endsWith(".md") ? [node] : [];
    const out: TreeNode[] = [];
    const base = node.path.length + 1;
    for (const [p, n] of tree.nodes) {
      if (n.type !== "file" || !n.name.endsWith(".md")) continue;
      if (!p.startsWith(node.path + "/")) continue;
      if (glob && !glob.test(p.slice(base)) && !glob.test(p)) continue;
      out.push(n);
    }
    out.sort((a, b) => (a.path < b.path ? -1 : a.path > b.path ? 1 : 0));
    return out;
  }

  async grep(args: GrepArgs): Promise<GrepResult> {
    const mode = args.mode ?? "content";
    const res: GrepResult = { truncated: false, notices: [] };
    if (mode === "content") res.matches = [];
    else if (mode === "files") res.files = [];
    else res.counts = [];

    this.ensureFresh();
    const blocked = this.notServed();
    if (blocked) {
      res.notices.push(blocked);
      return res;
    }
    const caseSensitive = args.caseSensitive === true;
    const glob = args.glob ? compileGlob(args.glob, caseSensitive) : null;
    const targets = this.grepTargets(args.path, glob);
    if (!targets) {
      res.notices.push(`no such path: ${args.path}`);
      return res;
    }
    const matcher = buildMatcher(args.pattern, {
      regex: args.regex === true,
      caseSensitive,
      wholeWord: args.wholeWord === true,
    });
    const maxMatches = Math.min(200, Math.max(1, args.maxMatches ?? 50));
    const ctx = Math.min(5, Math.max(0, args.context ?? 0));
    const before = Math.min(5, Math.max(0, args.before ?? ctx));
    const after = Math.min(5, Math.max(0, args.after ?? ctx));

    const started = performance.now();
    let rows = 0;
    let bytes = 0;
    let scanned = 0;
    for (const node of targets) {
      if (scanned > 0 && scanned % this.yieldEvery === 0) await yieldLoop();
      if (performance.now() - started > this.matchBudgetMs) {
        res.truncated = true;
        res.notices.push("matching budget exhausted; results are partial — narrow the path or pattern");
        break;
      }
      scanned++;
      const body = this.body(node);
      const perFile = mode === "content" ? maxMatches - rows : Number.POSITIVE_INFINITY;
      const hits = grepLines(body.lines, matcher, before, after, perFile);
      if (hits.length === 0) continue;
      if (mode === "content") {
        for (const h of hits) {
          const m: Match = { path: node.path, line: h.line, text: h.text, before: h.before, after: h.after };
          if (h.truncatedLine) m.truncatedLine = true;
          bytes += approxBytes(m);
          if (bytes > MAX_RESPONSE_BYTES) {
            res.truncated = true;
            break;
          }
          res.matches!.push(m);
          rows++;
        }
      } else if (mode === "files") {
        res.files!.push(node.path);
        bytes += node.path.length + 4;
        rows++;
      } else {
        res.counts!.push({ path: node.path, count: hits.length });
        bytes += node.path.length + 24;
        rows++;
      }
      if (res.truncated) break;
      if (rows >= maxMatches || bytes > MAX_RESPONSE_BYTES) {
        // more to come?
        if (rows >= maxMatches && node !== targets[targets.length - 1]) res.truncated = true;
        else if (rows >= maxMatches && mode === "content" && hits.length >= perFile) {
          // maxMatches reached inside the last file: unknown whether more lines matched
          res.truncated = hasMoreMatches(body.lines, matcher, hits[hits.length - 1].line);
        } else if (bytes > MAX_RESPONSE_BYTES) res.truncated = true;
        break;
      }
    }
    if (res.truncated && !res.notices.length) {
      res.notices.push("results truncated; narrow the path or pattern, or raise maxMatches (≤ 200)");
    }
    return res;
  }

  // ---------------------------------------------------------------- read --

  async read(args: ReadArgs): Promise<ReadResult> {
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
    this.ensureFresh();
    const blocked = this.notServed();
    if (blocked) {
      res.notices.push(blocked);
      return res;
    }
    const node = this.tree!.nodes.get(args.path);
    if (!node || node.type !== "file") {
      res.notices.push(node ? `not a file: ${args.path}` : `no such path: ${args.path}`);
      return res;
    }
    if (args.source === true) {
      if (!this.sourceSupported) {
        res.notices.push(`source snapshot not supported for layer ${this.layer}`);
        return res;
      }
      return this.readSource(node, args, res);
    }
    if (node.size > MAX_READ_FILE_BYTES) {
      res.notices.push(`file larger than 2 MB is not served: ${args.path}`);
      return res;
    }
    const body = this.body(node);
    res.frontmatter = node.frontmatter ?? {};
    res.totalLines = body.lines.length;
    let from = 1;
    let to = body.lines.length;
    if (args.section !== undefined) {
      const sec = sectionRange(body.lines, args.section, (node.frontmatterEnd ?? 0) + 1);
      if (sec) {
        from = sec.lineFrom;
        to = sec.lineTo;
        res.section = { requested: args.section, resolved: sec.resolved, lineFrom: from, lineTo: to };
      } else {
        res.notices.push(`unknown section anchor "${args.section}"; returning the full page`);
      }
    }
    if (!res.section) {
      const limit = Math.max(1, args.limit ?? 2000);
      if (args.offset !== undefined) from = Math.max(1, args.offset);
      if (from > to && to > 0) {
        res.notices.push(`offset ${from} is beyond the last line (${to})`);
        res.lineFrom = from;
        res.lineTo = from - 1;
        return res;
      }
      to = Math.min(to, from + limit - 1);
    }
    // 256 KB response cap
    let bytes = 0;
    let cut = to;
    for (let i = from; i <= to; i++) {
      bytes += Buffer.byteLength(body.lines[i - 1]) + 1;
      if (bytes > MAX_RESPONSE_BYTES) {
        cut = i - 1;
        break;
      }
    }
    if (cut < to) {
      res.truncated = true;
      res.notices.push(`response capped at 256 KB: lines ${from}–${cut} returned; continue with offset ${cut + 1}`);
      to = cut;
    }
    res.lineFrom = from;
    res.lineTo = to;
    res.citation = to >= from ? `${args.path}:${from}-${to}` : "";
    res.raw = to >= from ? joinRange(body.lines, from, to, body.endsWithNewline) : "";
    return res;
  }

  // ------------------------------------------------------ source snapshot --

  /** sourceHash values are opaque tokens, never paths: one segment, no leading dot. */
  private static readonly SOURCE_HASH_SYNTAX = /^[A-Za-z0-9][A-Za-z0-9._@-]{0,199}$/;

  /**
   * `source: true` — serves the verbatim upstream snapshot the page was built
   * from: `<sourceCacheDir>/<sourceId ":" → "/">/<sourceHash>.txt`, where the
   * sourceId is derived from the path (`<layer>/dev/<v>/` → `developer:<v>`,
   * `<layer>/func/` → `merchant`) and the hash comes from the manifest or the
   * page frontmatter. Missing cache/hash degrades to a notice, never an error.
   */
  private readSource(node: TreeNode, args: ReadArgs, res: ReadResult): ReadResult {
    res.frontmatter = node.frontmatter ?? {};
    const rel = node.path.slice(this.layer.length + 1);
    const dev = /^dev\/([^/]+)\//.exec(rel);
    const sourceDir = dev ? `developer/${dev[1]}` : rel.startsWith("func/") ? "merchant" : null;
    if (!sourceDir) {
      res.notices.push(
        `no source snapshot for: ${args.path} (only ${this.layer}/dev/<version>/ and ${this.layer}/func/ pages have one)`,
      );
      return res;
    }
    const hash = this.manifestSourceHash(node.path) ?? res.frontmatter.sourceHash;
    if (typeof hash !== "string" || hash === "") {
      res.notices.push(`no sourceHash recorded for: ${args.path} (neither manifest nor frontmatter)`);
      return res;
    }
    if (!WikiSource.SOURCE_HASH_SYNTAX.test(hash)) {
      res.notices.push(`invalid sourceHash for: ${args.path}`);
      return res;
    }
    res.source = { sourceId: dev ? `developer:${dev[1]}` : "merchant", sourceHash: hash };
    let real: string;
    let realCache: string;
    try {
      realCache = realpathSync(this.sourceCacheDir);
      real = realpathSync(join(this.sourceCacheDir, sourceDir, `${hash}.txt`));
    } catch {
      res.notices.push(`source snapshot not cached: ${args.path} (run the ingest sync to populate the local source cache)`);
      return res;
    }
    if (real !== realCache && !real.startsWith(realCache + sep)) {
      res.notices.push(`source snapshot path escapes the source cache: ${args.path}`);
      return res;
    }
    if (statSync(real).size > MAX_READ_FILE_BYTES) {
      res.notices.push(`file larger than 2 MB is not served: ${args.path} (source snapshot)`);
      return res;
    }
    const { lines, endsWithNewline } = splitLines(readText(real));
    res.totalLines = lines.length;
    const from = Math.max(1, args.offset ?? 1);
    let to = Math.min(lines.length, from + Math.max(1, args.limit ?? 2000) - 1);
    if (from > lines.length && lines.length > 0) {
      res.notices.push(`offset ${from} is beyond the last line (${lines.length})`);
      res.lineFrom = from;
      res.lineTo = from - 1;
      return res;
    }
    let bytes = 0;
    let cut = to;
    for (let i = from; i <= to; i++) {
      bytes += Buffer.byteLength(lines[i - 1]) + 1;
      if (bytes > MAX_RESPONSE_BYTES) {
        cut = i - 1;
        break;
      }
    }
    if (cut < to) {
      res.truncated = true;
      res.notices.push(`response capped at 256 KB: lines ${from}–${cut} returned; continue with offset ${cut + 1}`);
      to = cut;
    }
    res.lineFrom = from;
    res.lineTo = to;
    // No stable citable path: this serves the upstream source snapshot (identified by
    // `res.source.sourceId`/`sourceHash`, not a wiki-root-relative path), never the wiki
    // page — citing `args.path` here would point at text the wiki page doesn't contain.
    res.citation = "";
    res.raw = to >= from ? joinRange(lines, from, to, endsWithNewline) : "";
    return res;
  }

  private manifestSourceHash(path: string): string | null {
    const pages = this.manifest.pages;
    if (!pages || typeof pages !== "object") return null;
    const meta = (pages as Record<string, unknown>)[path];
    const h = meta && typeof meta === "object" ? (meta as Record<string, unknown>).sourceHash : undefined;
    return typeof h === "string" ? h : null;
  }
}

function entryOf(node: TreeNode) {
  const e: { path: string; name: string; type: "dir" | "file"; title?: string } = {
    path: node.path,
    name: node.name,
    type: node.type,
  };
  const title = node.frontmatter?.title;
  if (typeof title === "string") e.title = title;
  return e;
}

function approxBytes(m: Match): number {
  let n = m.path.length + m.text.length + 40;
  for (const s of m.before) n += s.length + 4;
  for (const s of m.after) n += s.length + 4;
  return n;
}

function hasMoreMatches(lines: string[], matcher: { test(l: string): boolean }, afterLine: number): boolean {
  for (let i = afterLine; i < lines.length; i++) if (matcher.test(lines[i].replace(/\r$/, ""))) return true;
  return false;
}

export function contractMajor(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return Math.floor(value);
  if (typeof value === "string") {
    const m = /^(\d+)(?:\.\d+)*$/.exec(value.trim());
    if (m) return Number(m[1]);
  }
  return null;
}

function yieldLoop(): Promise<void> {
  return new Promise((r) => setImmediate(r));
}
