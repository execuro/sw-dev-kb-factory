/**
 * Read-only wiki filesystem primitives: startup tree walk (lstat, symlinks and
 * dot-entries skipped, limits enforced), gitignore-style glob matching,
 * in-process single-line grep, H2/H3 section slicing, GitHub-style heading
 * slugs and a byte-bounded LRU for page bodies.
 *
 * No function here ever writes, follows a symlink, or opens anything outside
 * the directory it was handed. Everything read is plain text — code is bytes.
 */
import { closeSync, lstatSync, openSync, readFileSync, readSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { parseFrontmatter } from "./frontmatter.js";
import type { TreeLimits } from "../types.js";
import { FRONTMATTER_HEAD_BYTES, MAX_LINE_CHARS } from "../types.js";

// ---------------------------------------------------------------- paths ----

export const PATH_SYNTAX = /^[A-Za-z0-9._@/-]{1,512}$/;
export const SECTION_SYNTAX = /^[a-z0-9-]{1,120}$/;

/** B1 syntax rule; returns null when valid, else the reason. `""` is allowed only when `allowEmpty`. */
export function pathSyntaxError(path: string, allowEmpty = false): string | null {
  if (path === "") return allowEmpty ? null : "path must not be empty";
  if (!PATH_SYNTAX.test(path)) {
    return "path must match ^[A-Za-z0-9._@/-]{1,512}$ (no `\\`, `:`, `%`, `~`, NUL or other characters)";
  }
  if (path.startsWith("/")) return "path must be wiki-root-relative (no leading `/`)";
  for (const seg of path.split("/")) {
    if (seg === "" ) return "path must not contain empty segments";
    if (seg === "." || seg === "..") return "path must not contain `.` or `..` segments";
  }
  return null;
}

/** Glob rule (A2): ≤ 256 chars, no `..`, same character set as paths plus glob metacharacters. */
export function globSyntaxError(glob: string): string | null {
  if (glob.length === 0) return "glob must not be empty";
  if (glob.length > 256) return "glob must be ≤ 256 characters";
  if (glob.includes("..")) return "glob must not contain `..`";
  if (!/^[A-Za-z0-9._@/\-*?!\[\]{},]+$/.test(glob)) return "glob contains unsupported characters";
  return null;
}

// ----------------------------------------------------------------- tree ----

export interface TreeNode {
  /** wiki-root-relative path, e.g. `platform/dev/6.7/index.md` */
  path: string;
  name: string;
  type: "dir" | "file";
  /** file size in bytes (files only) */
  size: number;
  /** parsed frontmatter (`.md` files only) */
  frontmatter?: Record<string, unknown>;
  /** 1-based line of the closing `---` (0 when none) */
  frontmatterEnd?: number;
}

export interface WalkResult {
  /** every node keyed by wiki-root-relative path; directories included; root not included */
  nodes: Map<string, TreeNode>;
  /** children per directory path (`""` = the walked root), sorted dirs-first then by name */
  children: Map<string, TreeNode[]>;
  files: number;
  dirs: number;
  bytes: number;
  maxDepth: number;
  oversized: string | null;
  notices: string[];
}

/** File names served at all (B6): `.md` pages and `manifest.json`. */
export function isAllowedFile(name: string, isPackageRoot = false): boolean {
  if (name.startsWith(".")) return false;
  if (name.endsWith(".md")) return true;
  if (name === "manifest.json") return true;
  if (isPackageRoot && name === "composer.json") return true;
  return false;
}

/**
 * Walks `<physicalRoot ?? (prefix === "" ? absRoot : join(absRoot, prefix))>` with lstat,
 * recording every node under the logical `prefix` namespace. This lets a source's logical
 * paths (`project/guidelines/...`) diverge from where the files actually live on disk (a
 * second root outside the wiki root) — see `WikiSource`'s `layerDir` option. Symlinks are
 * skipped (reported once in notices), dot-entries skipped silently, files with disallowed
 * extensions are invisible. Frontmatter is parsed from the first 8 KB of each `.md`.
 */
export function walkTree(absRoot: string, prefix: string, limits: TreeLimits, physicalRoot?: string): WalkResult {
  const res: WalkResult = {
    nodes: new Map(),
    children: new Map(),
    files: 0,
    dirs: 0,
    bytes: 0,
    maxDepth: 0,
    oversized: null,
    notices: [],
  };
  let symlinks = 0;
  if (prefix !== "") {
    res.nodes.set(prefix, { path: prefix, name: prefix.slice(prefix.lastIndexOf("/") + 1), type: "dir", size: 0 });
  }
  const physBase = physicalRoot ?? (prefix === "" ? absRoot : join(absRoot, prefix));
  const stack: { rel: string; physRel: string; depth: number }[] = [{ rel: prefix, physRel: "", depth: 0 }];
  while (stack.length > 0) {
    const { rel, physRel, depth } = stack.pop()!;
    const abs = physRel === "" ? physBase : join(physBase, physRel);
    let names: string[];
    try {
      names = readdirSync(abs);
    } catch {
      res.notices.push(`unreadable directory: ${rel || "."}`);
      continue;
    }
    const kids: TreeNode[] = [];
    for (const name of names) {
      if (name.startsWith(".")) continue;
      const childRel = rel === "" ? name : `${rel}/${name}`;
      const childPhysRel = physRel === "" ? name : `${physRel}/${name}`;
      let st;
      try {
        st = lstatSync(join(physBase, childPhysRel));
      } catch {
        continue;
      }
      if (st.isSymbolicLink()) {
        symlinks++;
        continue;
      }
      if (st.isDirectory()) {
        if (depth + 1 > limits.maxDepth) {
          res.oversized = `directory depth exceeds ${limits.maxDepth}`;
          return res;
        }
        res.dirs++;
        if (res.dirs > limits.maxDirs) {
          res.oversized = `more than ${limits.maxDirs} directories`;
          return res;
        }
        res.maxDepth = Math.max(res.maxDepth, depth + 1);
        const node: TreeNode = { path: childRel, name, type: "dir", size: 0 };
        res.nodes.set(childRel, node);
        kids.push(node);
        stack.push({ rel: childRel, physRel: childPhysRel, depth: depth + 1 });
      } else if (st.isFile()) {
        if (!isAllowedFile(name)) continue;
        res.files++;
        res.bytes += st.size;
        if (res.files > limits.maxFiles) {
          res.oversized = `more than ${limits.maxFiles} files`;
          return res;
        }
        if (res.bytes > limits.maxBytes) {
          res.oversized = `more than ${limits.maxBytes} bytes`;
          return res;
        }
        const node: TreeNode = { path: childRel, name, type: "file", size: st.size };
        if (name.endsWith(".md")) {
          const head = readHead(join(physBase, childPhysRel), FRONTMATTER_HEAD_BYTES);
          const fm = parseFrontmatter(head);
          node.frontmatter = fm.data;
          node.frontmatterEnd = fm.endLine;
        }
        res.nodes.set(childRel, node);
        kids.push(node);
      }
    }
    kids.sort(compareEntries);
    res.children.set(rel, kids);
  }
  if (symlinks > 0) res.notices.push(`${symlinks} symlink(s) skipped`);
  return res;
}

export function compareEntries(a: TreeNode, b: TreeNode): number {
  if (a.type !== b.type) return a.type === "dir" ? -1 : 1;
  return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
}

/** Reads at most `max` bytes from the start of a file (read-only open). */
export function readHead(abs: string, max: number): string {
  const fd = openSync(abs, "r");
  try {
    const buf = Buffer.alloc(max);
    const n = readSync(fd, buf, 0, max, 0);
    return buf.subarray(0, n).toString("utf8");
  } finally {
    closeSync(fd);
  }
}

export function readText(abs: string): string {
  return readFileSync(abs, "utf8");
}

// ----------------------------------------------------------------- glob ----

/**
 * gitignore-style glob → RegExp. A pattern without `/` matches the basename
 * (at any depth); a pattern with `/` is anchored at the start of the tested
 * path. `**` spans directories, `*`/`?` do not cross `/`, `[...]` classes and
 * `{a,b}` alternation are supported. A leading `!` negates.
 */
export interface Glob {
  test(relPath: string): boolean;
}

export function compileGlob(glob: string, caseSensitive: boolean): Glob {
  let negate = false;
  let pat = glob;
  if (pat.startsWith("!")) {
    negate = true;
    pat = pat.slice(1);
  }
  if (pat.startsWith("/")) pat = pat.slice(1);
  const dirOnly = pat.endsWith("/");
  if (dirOnly) pat = pat.slice(0, -1);
  const anchored = pat.includes("/");
  const re = new RegExp(`^${globToRegexSource(pat)}$`, caseSensitive ? "u" : "iu");
  return {
    test(relPath: string): boolean {
      let hit: boolean;
      if (anchored) hit = re.test(relPath);
      else {
        const base = relPath.slice(relPath.lastIndexOf("/") + 1);
        hit = re.test(base);
      }
      return negate ? !hit : hit;
    },
  };
}

function globToRegexSource(pat: string): string {
  let out = "";
  let i = 0;
  while (i < pat.length) {
    const c = pat[i];
    if (c === "*") {
      if (pat[i + 1] === "*") {
        // `**/` → zero or more segments; `**` elsewhere → anything
        if (pat[i + 2] === "/") {
          out += "(?:.*/)?";
          i += 3;
        } else {
          out += ".*";
          i += 2;
        }
      } else {
        out += "[^/]*";
        i++;
      }
    } else if (c === "?") {
      out += "[^/]";
      i++;
    } else if (c === "[") {
      const end = pat.indexOf("]", i + 1);
      if (end < 0) {
        out += "\\[";
        i++;
      } else {
        let cls = pat.slice(i + 1, end);
        if (cls.startsWith("!")) cls = "^" + cls.slice(1);
        out += `[${cls.replace(/\\/g, "\\\\")}]`;
        i = end + 1;
      }
    } else if (c === "{") {
      const end = pat.indexOf("}", i + 1);
      if (end < 0) {
        out += "\\{";
        i++;
      } else {
        const alts = pat.slice(i + 1, end).split(",").map(globToRegexSource);
        out += `(?:${alts.join("|")})`;
        i = end + 1;
      }
    } else {
      out += c.replace(/[.+^$()|\\]/g, "\\$&");
      i++;
    }
  }
  return out;
}

// ---------------------------------------------------------------- slugs ----

/** GitHub-style heading slug: lowercase, runs of non-alphanumerics → `-`, trimmed. */
export function slugify(heading: string): string {
  return heading
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export interface Heading {
  level: 2 | 3;
  slug: string;
  /** 1-based line */
  line: number;
}

/** H2/H3 headings outside fenced code blocks (1-based lines). */
export function headings(lines: string[], startLine = 1): Heading[] {
  const out: Heading[] = [];
  let fence: string | null = null;
  for (let i = startLine - 1; i < lines.length; i++) {
    const l = lines[i];
    const f = /^\s{0,3}(`{3,}|~{3,})/.exec(l);
    if (f) {
      if (!fence) fence = f[1][0];
      else if (f[1][0] === fence) fence = null;
      continue;
    }
    if (fence) continue;
    const m = /^(##|###)\s+(.+?)\s*#*\s*$/.exec(l);
    if (m) out.push({ level: m[1].length as 2 | 3, slug: slugify(m[2]), line: i + 1 });
  }
  return out;
}

/**
 * Resolves a section anchor to its H2 block (an H3 anchor resolves to the
 * enclosing H2). Returns null when the anchor is unknown.
 */
export function sectionRange(
  lines: string[],
  anchor: string,
  bodyStartLine: number,
): { resolved: string; lineFrom: number; lineTo: number } | null {
  const hs = headings(lines, bodyStartLine);
  const idx = hs.findIndex((h) => h.slug === anchor);
  if (idx < 0) return null;
  let h2 = idx;
  while (h2 >= 0 && hs[h2].level !== 2) h2--;
  if (h2 < 0) return null; // H3 without an enclosing H2
  let next = h2 + 1;
  while (next < hs.length && hs[next].level !== 2) next++;
  const lineFrom = hs[h2].line;
  let lineTo = next < hs.length ? hs[next].line - 1 : lines.length;
  while (lineTo > lineFrom && lines[lineTo - 1].trim() === "") lineTo--;
  return { resolved: hs[h2].slug, lineFrom, lineTo };
}

// ---------------------------------------------------------------- lines ----

/** Splits file text into lines the way `sed -n`/`grep -n` count them. */
export function splitLines(text: string): { lines: string[]; endsWithNewline: boolean } {
  const endsWithNewline = text.endsWith("\n");
  const lines = text.split("\n");
  if (endsWithNewline) lines.pop();
  return { lines, endsWithNewline };
}

export function joinRange(lines: string[], from: number, to: number, endsWithNewline: boolean): string {
  const slice = lines.slice(from - 1, to);
  const raw = slice.join("\n");
  return to < lines.length || endsWithNewline ? raw + "\n" : raw;
}

export function capLine(text: string): { text: string; truncatedLine?: true } {
  const t = text.replace(/\r$/, "");
  if (t.length <= MAX_LINE_CHARS) return { text: t };
  return { text: t.slice(0, MAX_LINE_CHARS), truncatedLine: true };
}

// ----------------------------------------------------------------- grep ----

export interface Matcher {
  test(line: string): boolean;
}

export function buildMatcher(
  pattern: string,
  opts: { regex: boolean; caseSensitive: boolean; wholeWord: boolean },
): Matcher {
  let src = opts.regex ? pattern : pattern.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&");
  if (opts.wholeWord) src = `(?<![\\p{L}\\p{N}_])(?:${src})(?![\\p{L}\\p{N}_])`;
  // Throws SyntaxError on an invalid regex — callers turn that into a validation error.
  const re = new RegExp(src, opts.caseSensitive ? "u" : "iu");
  return { test: (line) => re.test(line) };
}

export interface FileGrepHit {
  line: number;
  text: string;
  truncatedLine?: true;
  before: string[];
  after: string[];
}

/** Single pass over one file's lines; stops after `max` hits. */
export function grepLines(
  lines: string[],
  matcher: Matcher,
  before: number,
  after: number,
  max: number,
): FileGrepHit[] {
  const hits: FileGrepHit[] = [];
  for (let i = 0; i < lines.length && hits.length < max; i++) {
    const l = lines[i].replace(/\r$/, "");
    if (!matcher.test(l)) continue;
    const c = capLine(l);
    const hit: FileGrepHit = {
      line: i + 1,
      text: c.text,
      before: lines.slice(Math.max(0, i - before), i).map((x) => capLine(x).text),
      after: lines.slice(i + 1, i + 1 + after).map((x) => capLine(x).text),
    };
    if (c.truncatedLine) hit.truncatedLine = true;
    hits.push(hit);
  }
  return hits;
}

// ------------------------------------------------------------------ LRU ----

/** Byte-bounded LRU of file bodies (split lines cached alongside). */
export class LruCache<V> {
  private readonly map = new Map<string, { value: V; bytes: number }>();
  private total = 0;

  constructor(private readonly maxBytes: number) {}

  get(key: string): V | undefined {
    const e = this.map.get(key);
    if (!e) return undefined;
    this.map.delete(key);
    this.map.set(key, e);
    return e.value;
  }

  set(key: string, value: V, bytes: number): void {
    if (bytes > this.maxBytes) return;
    const old = this.map.get(key);
    if (old) {
      this.total -= old.bytes;
      this.map.delete(key);
    }
    this.map.set(key, { value, bytes });
    this.total += bytes;
    while (this.total > this.maxBytes) {
      const first = this.map.keys().next();
      if (first.done) break;
      this.total -= this.map.get(first.value)!.bytes;
      this.map.delete(first.value);
    }
  }

  get size(): number {
    return this.map.size;
  }
}
