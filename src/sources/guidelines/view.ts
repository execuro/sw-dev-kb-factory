/**
 * GuidelinesView — the `guidelines/` virtual layer: composes the platform
 * and project `DocSource`s (never reads disk itself) and squashes a project guideline
 * file over its matching platform file by `##` section anchor, so an agent gets one
 * effective file per `read_doc guidelines/<version>/<file>.md` call. Every section keeps
 * a tag line naming its real `platform/…#anchor` or `project/…#anchor` source — that path
 * is what gets cited, never a `guidelines/…` path.
 */
import type { DocSource, Entry, GrepArgs, GrepResult, LayerStatus, ListArgs, ListResult, Match, ReadArgs, ReadResult } from "../../types.js";
import { MAX_RESPONSE_BYTES } from "../../types.js";
import { buildMatcher, grepLines, headings, isExpertTagLine, joinRange, sectionRange, splitLines } from "../../wiki/fs.js";
import { parseFrontmatter } from "../../wiki/frontmatter.js";
import type { FileStamp } from "../platform/wiki-source.js";

type MergeMode = "override" | "extend" | "waive";
/** `expert` = a platform section hand-written by a domain expert (`> [expert]` first line in the
 *  wiki file, preserved across regenerations); served as `[platform expert]`. */
type Tag = "platform" | "expert" | "project";

interface Section {
  anchor: string;
  headingLine: string;
  /** Lines directly after the heading, up to (and not including) the next H2; an expert tag line is stripped. */
  bodyLines: string[];
  expert: boolean;
}

interface SplitFile {
  lines: string[];
  data: Record<string, unknown>;
  /** Raw frontmatter block (`---` … `---`), empty when the file has none. */
  fmLines: string[];
  preambleLines: string[];
  bodyStart: number;
}

interface EffectiveFile {
  frontmatter: Record<string, unknown>;
  raw: string;
  notices: string[];
  present: "platform" | "project" | "both" | "none";
}

interface FileTag {
  name: string;
  title?: string;
  tag: "platform" | "project" | "platform+project";
}

const GUIDELINES_PATH = /^guidelines(?:\/([^/]+)(?:\/([^/]+\.md))?)?$/;
/** A Shopware major as used in `platform/guidelines/<version>/` (`6.6`, `6.7`). */
const VERSION_SYNTAX = /^\d+\.\d+$/;
/** A project guideline file name (`be-code-guidelines.md`, `documentation-guidelines.md`). */
const GUIDELINE_FILE = /^[a-z0-9][a-z0-9-]*-guidelines\.md$/;

function splitFile(raw: string): SplitFile {
  const { lines } = splitLines(raw);
  const fm = parseFrontmatter(raw);
  const fmLines = fm.endLine > 0 ? lines.slice(0, fm.endLine) : [];
  const bodyStart = fm.endLine + 1;
  const hs = headings(lines, bodyStart);
  const firstH2 = hs.find((h) => h.level === 2);
  const preambleEnd = firstH2 ? firstH2.line - 1 : lines.length;
  const preambleLines = bodyStart - 1 < preambleEnd ? lines.slice(bodyStart - 1, preambleEnd) : [];
  return { lines, data: fm.data, fmLines, preambleLines, bodyStart };
}

/** One block per `##` heading; an `###` belongs to the preceding `##` (its lines stay in `bodyLines`). */
function h2Blocks(file: SplitFile): Section[] {
  const hs = headings(file.lines, file.bodyStart).filter((h) => h.level === 2);
  const out: Section[] = [];
  for (let i = 0; i < hs.length; i++) {
    const from = hs[i].line;
    let to = i + 1 < hs.length ? hs[i + 1].line - 1 : file.lines.length;
    while (to > from && file.lines[to - 1].trim() === "") to--;
    const bodyLines = file.lines.slice(from, to);
    // `> [expert]` as the first non-blank body line marks an expert section; the tag itself is
    // replaced by the `[platform expert]` tag line the view renders.
    const first = bodyLines.findIndex((l) => l.trim() !== "");
    const expert = first >= 0 && isExpertTagLine(bodyLines[first]);
    if (expert) bodyLines.splice(first, 1);
    out.push({ anchor: hs[i].slug, headingLine: file.lines[from - 1], bodyLines, expert });
  }
  return out;
}

function tagLine(kind: Tag, mode: MergeMode | "addition" | null, path: string, anchor: string): string {
  if (kind === "platform") return `> [platform] ${path}#${anchor}`;
  if (kind === "expert") return `> [platform expert] ${path}#${anchor}`;
  return `> [project ${mode}] ${path}#${anchor}`;
}

function platformTag(section: Section, path: string): string {
  return tagLine(section.expert ? "expert" : "platform", null, path, section.anchor);
}

function pushBlank(out: string[]): void {
  if (out.length > 0 && out[out.length - 1].trim() !== "") out.push("");
}

function renderFile(fmLines: string[], preambleLines: string[], infoLine: string | null, blocks: { section: Section; tag: string }[]): string {
  const out: string[] = [...fmLines, ...preambleLines];
  if (infoLine !== null) {
    pushBlank(out);
    out.push(infoLine);
  }
  for (const { section, tag } of blocks) {
    pushBlank(out);
    out.push(section.headingLine);
    out.push(tag);
    out.push(...section.bodyLines);
  }
  return out.length > 0 ? out.join("\n") + "\n" : "";
}

/** Merges one project file over its matching platform file; `pf`/`pj` are the raw file text of each side (`null` when absent). */
function buildEffective(platformPath: string, projectPath: string, pf: string | null, pj: string | null): EffectiveFile {
  const notices: string[] = [];
  if (pf === null && pj === null) return { frontmatter: {}, raw: "", notices: [`no such path: ${platformPath}`], present: "none" };

  if (pj === null) {
    const side = splitFile(pf!);
    const blocks = h2Blocks(side).map((section) => ({ section, tag: platformTag(section, platformPath) }));
    return {
      frontmatter: side.data,
      raw: renderFile(side.fmLines, side.preambleLines, null, blocks),
      // no project guidelines for this file: the platform file is the effective file, nothing to report
      notices: [],
      present: "platform",
    };
  }

  if (pf === null) {
    const side = splitFile(pj);
    const blocks = h2Blocks(side).map((section) => ({ section, tag: tagLine("project", "addition", projectPath, section.anchor) }));
    return {
      frontmatter: side.data,
      raw: renderFile(side.fmLines, side.preambleLines, null, blocks),
      // a project-only guideline file (no platform counterpart, or platform not ingested yet) is normal: nothing to report
      notices: [],
      present: "project",
    };
  }

  const pfSide = splitFile(pf);
  const pjSide = splitFile(pj);
  const platformBlocks = h2Blocks(pfSide);
  const projectBlocks = h2Blocks(pjSide);
  if (pj.trim() !== "" && projectBlocks.length === 0) notices.push(`project file has no ## sections: ${projectPath}`);

  const mergeRaw = pjSide.data.merge;
  const mergeMap: Record<string, unknown> = mergeRaw && typeof mergeRaw === "object" ? (mergeRaw as Record<string, unknown>) : {};
  const platformAnchors = new Set(platformBlocks.map((b) => b.anchor));

  const byAnchor = new Map<string, { section: Section; mode: MergeMode }>();
  const additions: Section[] = [];
  for (const section of projectBlocks) {
    const declared = mergeMap[section.anchor];
    const declaredMode = declared === "override" || declared === "extend" || declared === "waive" ? declared : undefined;
    if (declared !== undefined && !platformAnchors.has(section.anchor)) {
      notices.push(`merge target not found: ${section.anchor}`);
      additions.push(section);
    } else if (declaredMode !== undefined) {
      byAnchor.set(section.anchor, { section, mode: declaredMode });
    } else if (platformAnchors.has(section.anchor)) {
      notices.push(`undeclared override: ${section.anchor}`);
      byAnchor.set(section.anchor, { section, mode: "override" });
    } else {
      additions.push(section);
    }
  }

  const blocks: { section: Section; tag: string }[] = [];
  for (const section of platformBlocks) {
    const proj = byAnchor.get(section.anchor);
    if (proj?.mode === "extend") {
      blocks.push({ section: proj.section, tag: tagLine("project", "extend", projectPath, proj.section.anchor) });
      blocks.push({ section, tag: platformTag(section, platformPath) });
    } else if (proj?.mode === "override" || proj?.mode === "waive") {
      blocks.push({ section: proj.section, tag: tagLine("project", proj.mode, projectPath, proj.section.anchor) });
    } else {
      blocks.push({ section, tag: platformTag(section, platformPath) });
    }
  }
  for (const section of additions) blocks.push({ section, tag: tagLine("project", "addition", projectPath, section.anchor) });

  const fmLines =
    pfSide.fmLines.length > 0
      ? [...pfSide.fmLines.slice(0, -1), `project: ${projectPath}`, pfSide.fmLines[pfSide.fmLines.length - 1]]
      : pfSide.fmLines;
  const infoLine = `> Effective guidelines: ${platformPath} + ${projectPath} (project sections take precedence).`;
  return {
    frontmatter: { ...pfSide.data, project: projectPath },
    raw: renderFile(fmLines, pfSide.preambleLines, infoLine, blocks),
    notices,
    present: "both",
  };
}

export class GuidelinesView implements DocSource {
  readonly layer = "guidelines";
  private readonly cache = new Map<string, { key: string; result: EffectiveFile }>();

  constructor(
    private readonly platform: DocSource | null,
    private readonly project: DocSource | null,
  ) {}

  status(): LayerStatus {
    const versions = this.versions();
    const projectCount = this.projectFiles().size;
    const st: LayerStatus = {
      layer: this.layer,
      status: versions.length > 0 || projectCount > 0 ? "implemented" : "planned",
      synonyms: false,
      integrity: "unverified",
      notices: [],
    };
    const perVersion: Record<string, { platform: number; project: number; merged: number }> = {};
    for (const v of versions) {
      const files = this.filesFor(v);
      perVersion[v] = {
        platform: files.filter((f) => f.tag !== "project").length,
        project: files.filter((f) => f.tag !== "platform").length,
        merged: files.filter((f) => f.tag === "platform+project").length,
      };
    }
    st.versions = perVersion;
    // project guideline files are unversioned: they apply to whichever version is read (the installed one)
    st.projectFiles = projectCount;
    return st;
  }

  /** Versions come from the platform side only; project guidelines have no version directory. */
  private versions(): string[] {
    if (!this.platform) return [];
    const out = new Set<string>();
    for (const e of this.platform.list({ path: "platform/guidelines" }).entries) if (e.type === "dir") out.add(e.name);
    return [...out].sort();
  }

  /**
   * `project/guidelines/<file>-guidelines.md` — flat, anchored to the installed Shopware version, not to a version
   * directory. Only `*-guidelines.md` files are guideline files; `index.md` and any other page there are not.
   */
  private projectFiles(): Map<string, string | undefined> {
    const out = new Map<string, string | undefined>();
    if (!this.project) return out;
    for (const e of this.project.list({ path: "project/guidelines" }).entries) {
      if (e.type === "file" && GUIDELINE_FILE.test(e.name)) out.set(e.name, e.title);
    }
    return out;
  }

  /** A version segment is served when the platform has it, or — before platform guidelines exist — when it is a valid major. */
  private isServedVersion(version: string): boolean {
    return this.versions().includes(version) || VERSION_SYNTAX.test(version);
  }

  private filesFor(version: string): FileTag[] {
    const platformFiles = new Map<string, string | undefined>();
    if (!this.isServedVersion(version)) return [];
    if (this.platform) {
      for (const e of this.platform.list({ path: `platform/guidelines/${version}` }).entries) {
        if (e.type === "file" && e.name.endsWith(".md") && e.name !== "index.md") platformFiles.set(e.name, e.title);
      }
    }
    const projectFiles = this.projectFiles();
    const names = new Set([...platformFiles.keys(), ...projectFiles.keys()]);
    return [...names].sort().map((name) => {
      const inPlatform = platformFiles.has(name);
      const inProject = projectFiles.has(name);
      const tag: FileTag["tag"] = inPlatform && inProject ? "platform+project" : inPlatform ? "platform" : "project";
      return { name, title: platformFiles.get(name) ?? projectFiles.get(name), tag };
    });
  }

  list(args: ListArgs): ListResult {
    const res: ListResult = { path: args.path, entries: [], truncated: false, notices: [] };
    const m = GUIDELINES_PATH.exec(args.path);
    if (!m) {
      res.notices.push(`no such path: ${args.path}`);
      return res;
    }
    const [, version, file] = m;
    if (version === undefined) {
      const versions = this.versions();
      for (const v of versions) res.entries.push({ path: `guidelines/${v}`, name: v, type: "dir" });
      return res;
    }
    const files = this.filesFor(version);
    if (files.length === 0) {
      res.notices.push(`no such path: ${args.path}`);
      return res;
    }
    if (file !== undefined) {
      const f = files.find((x) => x.name === file);
      if (!f) {
        res.notices.push(`no such path: ${args.path}`);
        return res;
      }
      const e: Entry & { tag?: string } = { path: args.path, name: f.name, type: "file", tag: f.tag };
      if (f.title !== undefined) e.title = f.title;
      res.entries.push(e);
      return res;
    }
    for (const f of files) {
      const e: Entry & { tag?: string } = { path: `guidelines/${version}/${f.name}`, name: f.name, type: "file", tag: f.tag };
      if (f.title !== undefined) e.title = f.title;
      res.entries.push(e);
    }
    return res;
  }

  private async effectiveFile(version: string, file: string): Promise<{ result: EffectiveFile; platformPath: string; projectPath: string }> {
    const platformPath = `platform/guidelines/${version}/${file}`;
    const projectPath = `project/guidelines/${file}`;
    // Cache key: mtime + size of both source files, so a hit costs two stats and no body reads.
    // A source without `fileStamp` (a planned layer, a test double) disables caching for this file.
    const platformStamp = stampOf(this.platform, platformPath);
    const projectStamp = stampOf(this.project, projectPath);
    const cacheKey = `${version}/${file}`;
    const stampKey = platformStamp === undefined || projectStamp === undefined ? null : `${stampText(platformStamp)}::${stampText(projectStamp)}`;
    const cached = this.cache.get(cacheKey);
    if (stampKey !== null && cached && cached.key === stampKey) return { result: cached.result, platformPath, projectPath };
    const platformRead = this.platform ? await this.platform.read({ path: platformPath, limit: 100_000 }) : null;
    const projectRead = this.project ? await this.project.read({ path: projectPath, limit: 100_000 }) : null;
    const pf = platformRead && platformRead.raw !== "" ? platformRead.raw : null;
    const pj = projectRead && projectRead.raw !== "" ? projectRead.raw : null;
    const result = buildEffective(platformPath, projectPath, pf, pj);
    if (stampKey !== null) this.cache.set(cacheKey, { key: stampKey, result });
    else this.cache.delete(cacheKey);
    return { result, platformPath, projectPath };
  }

  async read(args: ReadArgs): Promise<ReadResult> {
    const res: ReadResult = { path: args.path, frontmatter: {}, raw: "", lineFrom: 0, lineTo: 0, totalLines: 0, citation: "", truncated: false, notices: [] };
    const m = GUIDELINES_PATH.exec(args.path);
    if (!m || m[1] === undefined || m[2] === undefined) {
      res.notices.push(`no such path: ${args.path}`);
      return res;
    }
    if (args.source === true) {
      res.notices.push(`source snapshot not supported for layer ${this.layer}`);
      return res;
    }
    const [, version, file] = m;
    // served only for a valid version and a real guideline file name on either side (filesFor applies both rules)
    if (!this.filesFor(version).some((f) => f.name === file)) {
      res.notices.push(`no such path: ${args.path}`);
      return res;
    }
    const { result } = await this.effectiveFile(version, file);
    res.notices.push(...result.notices);
    if (result.present === "none") return res;
    res.frontmatter = result.frontmatter;
    const { lines, endsWithNewline } = splitLines(result.raw);
    res.totalLines = lines.length;
    let from = 1;
    let to = lines.length;
    if (args.section !== undefined) {
      const sec = sectionRange(lines, args.section, 1);
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
    res.citation = to >= from ? `${args.path}:${from}-${to}` : "";
    res.raw = to >= from ? joinRange(lines, from, to, endsWithNewline) : "";
    return res;
  }

  async grep(args: GrepArgs): Promise<GrepResult> {
    const mode = args.mode ?? "content";
    const res: GrepResult = { truncated: false, notices: [] };
    if (mode === "content") res.matches = [];
    else if (mode === "files") res.files = [];
    else res.counts = [];

    const m = GUIDELINES_PATH.exec(args.path);
    if (!m) {
      res.notices.push(`no such path: ${args.path}`);
      return res;
    }
    const [, version, file] = m;
    const targets: { version: string; file: string }[] = [];
    if (version === undefined) {
      for (const v of this.versions()) for (const f of this.filesFor(v)) targets.push({ version: v, file: f.name });
    } else if (file === undefined) {
      for (const f of this.filesFor(version)) targets.push({ version, file: f.name });
    } else {
      if (this.filesFor(version).some((f) => f.name === file)) targets.push({ version, file });
    }
    if (targets.length === 0) {
      res.notices.push(`no such path: ${args.path}`);
      return res;
    }

    let matcher;
    try {
      matcher = buildMatcher(args.pattern, { regex: args.regex === true, caseSensitive: args.caseSensitive === true, wholeWord: args.wholeWord === true });
    } catch {
      res.notices.push("invalid pattern");
      return res;
    }
    const maxMatches = Math.min(200, Math.max(1, args.maxMatches ?? 50));
    const ctx = Math.min(5, Math.max(0, args.context ?? 0));
    const before = Math.min(5, Math.max(0, args.before ?? ctx));
    const after = Math.min(5, Math.max(0, args.after ?? ctx));
    let rows = 0;
    let bytes = 0;
    for (const t of targets) {
      const path = `guidelines/${t.version}/${t.file}`;
      const { result } = await this.effectiveFile(t.version, t.file);
      if (result.present === "none") continue;
      const { lines } = splitLines(result.raw);
      const perFile = mode === "content" ? maxMatches - rows : Number.POSITIVE_INFINITY;
      const hits = grepLines(lines, matcher, before, after, perFile);
      if (hits.length === 0) continue;
      if (mode === "content") {
        for (const h of hits) {
          const match: Match = { path, line: h.line, text: h.text, before: h.before, after: h.after };
          if (h.truncatedLine) match.truncatedLine = true;
          bytes += path.length + h.text.length + 40;
          if (bytes > MAX_RESPONSE_BYTES) {
            res.truncated = true;
            break;
          }
          res.matches!.push(match);
          rows++;
        }
      } else if (mode === "files") {
        res.files!.push(path);
        rows++;
      } else {
        res.counts!.push({ path, count: hits.length });
        rows++;
      }
      if (res.truncated || rows >= maxMatches) {
        if (rows >= maxMatches && t !== targets[targets.length - 1]) res.truncated = true;
        break;
      }
    }
    if (res.truncated && !res.notices.length) res.notices.push("results truncated; narrow the path or pattern, or raise maxMatches (≤ 200)");
    return res;
  }
}

interface Stamped {
  fileStamp(path: string): FileStamp | null;
}

/** `null` = file absent in that source; `undefined` = the source cannot stamp files (no caching). */
function stampOf(src: DocSource | null, path: string): FileStamp | null | undefined {
  if (src === null) return null;
  const fn = (src as Partial<Stamped>).fileStamp;
  return typeof fn === "function" ? fn.call(src, path) : undefined;
}

function stampText(stamp: FileStamp | null): string {
  return stamp === null ? "-" : `${stamp.mtimeMs}:${stamp.size}`;
}
