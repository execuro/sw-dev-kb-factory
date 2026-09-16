import { parseFrontmatter } from "../../src/wiki/frontmatter.js";
import { FRONTMATTER_HEAD_BYTES } from "../../src/types.js";
import { stripFencedCode } from "./hygiene.js";

export interface ValidationIssue {
  field: string;
  message: string;
}

export interface ParsedPage {
  frontmatter: Record<string, unknown>;
  body: string;
  endLine: number;
}

const VALID_VERSIONS = ["6.5", "6.6", "6.7"];
const SIX_SECTIONS = ["What it is", "When to use", "Key steps / config", "Essential identifiers", "Gotchas", "Version notes"];
/** Matches the optional 7th, last `## Code check (<x.y.z.w>)` section (page-outline.md). */
const CODE_CHECK_HEADING_RE = /^Code check \(\S+\)$/;
/** Versions guideline files are curated for (config.json's `guidelines.versions`). */
const GUIDELINE_VERSIONS = ["6.6", "6.7"];
/** Flat curated file name, e.g. "code-guidelines.md" — no subfolders (config.json's `guidelines.curatedFiles[].file`). */
const GUIDELINE_FILE_RE_SRC = "[a-z]+(?:-[a-z]+)*-guidelines\\.md";
/** `relatedPages`/`supersedes`/`supersededBy` targets: dev/func/hub pages, or a flat guideline file. */
const PAGE_ID_PATTERN = new RegExp(
  `^platform\\/(dev\\/(6\\.5|6\\.6|6\\.7)|func|hubs)\\/.+\\.md$` +
    `|^platform\\/guidelines\\/(${GUIDELINE_VERSIONS.join("|").replace(/\./g, "\\.")})\\/${GUIDELINE_FILE_RE_SRC}$`,
);
const MAX_RELATED_PAGES = 4;

export function parsePage(text: string): ParsedPage {
  const { data, endLine } = parseFrontmatter(text);
  const lines = text.split("\n");
  const body = lines.slice(endLine).join("\n");
  return { frontmatter: data, body, endLine };
}

function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.length > 0;
}

/**
 * Reimplements the comment-detection scan of src/wiki/frontmatter.ts's (unexported)
 * `stripComment`: a ` #` (or a leading `#`) outside quotes starts a comment, and — the bug
 * this gate exists to catch — a `\"` inside a double-quoted value is not treated as an
 * escape, so it closes the quote early and everything from the next ` #` onward is cut.
 * Returns true iff the real parser would truncate `raw` before its end.
 */
function truncatesAtComment(raw: string): boolean {
  let q: string | null = null;
  for (let i = 0; i < raw.length; i++) {
    const c = raw[i];
    if (q) {
      if (c === q) q = null;
    } else if (c === '"' || c === "'") q = c;
    else if (c === "#" && (i === 0 || raw[i - 1] === " ")) return true;
  }
  return false;
}

/**
 * Flags every top-level and list-item frontmatter value where a `" #"` (or a `\"` before a
 * `#`) would be silently truncated by the server's frontmatter parser (src/wiki/frontmatter.ts,
 * `stripComment`/`parseScalar`) — including inside a flow list like `[a, b #c]`, where the
 * whole rest of the line (including the closing `]`) is cut. Writers must double-quote any
 * value that might contain a literal `#`.
 */
export function checkFrontmatterQuoting(text: string): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const { endLine } = parseFrontmatter(text);
  if (endLine === 0) return issues;
  const lines = text.split("\n").slice(1, endLine - 1);
  let lastKey = "(frontmatter)";
  for (const rawLine of lines) {
    const line = rawLine.replace(/\r$/, "");
    if (line.trim() === "" || /^\s*#/.test(line)) continue;
    const listMatch = /^\s*-\s+(.*)$/.exec(line);
    const mapMatch = /^\s*([^:#]+?)\s*:(?:\s+(.*)|\s*)$/.exec(line);
    let key: string;
    let value: string;
    if (listMatch) {
      key = lastKey;
      value = listMatch[1];
    } else if (mapMatch) {
      key = mapMatch[1].trim();
      lastKey = key;
      value = mapMatch[2] ?? "";
    } else {
      continue;
    }
    if (value && truncatesAtComment(value)) {
      issues.push({ field: key, message: `frontmatter ${key}: " #" outside quotes truncates this value — double-quote it (and don't use \\" before a #)` });
    }
  }
  return issues;
}

/**
 * The server only reads the first `FRONTMATTER_HEAD_BYTES` of a `.md` file to parse its
 * frontmatter (src/wiki/fs.ts, `readHead`); past that byte it sees no frontmatter at all.
 */
export function checkFrontmatterHeadSize(text: string): ValidationIssue[] {
  const { endLine } = parseFrontmatter(text);
  if (endLine === 0) return [];
  const head = text.split("\n").slice(0, endLine).join("\n");
  const bytes = Buffer.byteLength(head, "utf8");
  if (bytes >= FRONTMATTER_HEAD_BYTES) {
    return [{ field: "frontmatter", message: `frontmatter block is ${bytes} bytes, at or over the server's ${FRONTMATTER_HEAD_BYTES}-byte read window — it will be truncated and fail to parse` }];
  }
  return [];
}

/** `checkFrontmatterQuoting` + `checkFrontmatterHeadSize` — every ingest gate and `wiki:lint`
 *  run this same pair together, on the raw pre-parse text, before trusting any parsed field. */
export function checkFrontmatterShape(text: string): ValidationIssue[] {
  return [...checkFrontmatterQuoting(text), ...checkFrontmatterHeadSize(text)];
}

/** Bounds shared by page/hub/guideline frontmatter (page.md/hub.md/guideline.md prompts): 8-15
 *  keywords, a one-line summary of <=160 chars, and `lastBuilt` as a plain YYYY-MM-DD date. */
function validateSharedBounds(fm: Record<string, unknown>): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  if ("keywords" in fm) {
    const kw = fm.keywords;
    if (!Array.isArray(kw) || kw.length < 8 || kw.length > 15 || kw.some((k) => typeof k !== "string" || k.length === 0)) {
      issues.push({ field: "keywords", message: `keywords must be an array of 8-15 non-empty strings, got ${Array.isArray(kw) ? kw.length : typeof kw}` });
    }
  }
  if ("summary" in fm && !isNonEmptyString(fm.summary)) {
    issues.push({ field: "summary", message: `summary must be a non-empty string, got ${typeof fm.summary}` });
  } else if (isNonEmptyString(fm.summary) && fm.summary.length > 160) {
    issues.push({ field: "summary", message: `summary exceeds 160 chars (${fm.summary.length})` });
  }
  if ("lastBuilt" in fm && (typeof fm.lastBuilt !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(fm.lastBuilt))) {
    issues.push({ field: "lastBuilt", message: `lastBuilt must be a YYYY-MM-DD date string, got ${JSON.stringify(fm.lastBuilt)}` });
  }
  return issues;
}

/** Structural validation matching ingest/shared/frontmatter.schema.json (page shape). */
export function validatePageFrontmatter(fm: Record<string, unknown>): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const req = ["id", "title", "docType", "version", "versions", "sourceUrl", "sourceHash", "keywords", "summary", "lastBuilt"];
  for (const key of req) if (!(key in fm)) issues.push({ field: key, message: "missing required field" });

  if (isNonEmptyString(fm.id) && !/^platform\/(dev\/(6\.5|6\.6|6\.7)|func|hubs)\/.+\.md$/.test(fm.id)) {
    issues.push({ field: "id", message: `id does not match the platform path pattern: ${fm.id}` });
  }
  if ("docType" in fm && fm.docType !== "developer" && fm.docType !== "functional") {
    issues.push({ field: "docType", message: `docType must be developer|functional, got ${String(fm.docType)}` });
  }
  if ("version" in fm && !VALID_VERSIONS.includes(String(fm.version))) {
    issues.push({ field: "version", message: `version must be one of ${VALID_VERSIONS.join(", ")}` });
  }
  if ("versions" in fm) {
    const versions = fm.versions;
    if (!Array.isArray(versions) || versions.length === 0 || versions.some((v) => !VALID_VERSIONS.includes(String(v)))) {
      issues.push({ field: "versions", message: "versions must be a non-empty array of 6.5|6.6|6.7" });
    }
  }
  if (isNonEmptyString(fm.sourceUrl) && !/^https:\/\/(developer|docs)\.shopware\.com\//.test(fm.sourceUrl)) {
    issues.push({ field: "sourceUrl", message: "sourceUrl must be an https URL on developer.shopware.com or docs.shopware.com" });
  }
  issues.push(...validateSharedBounds(fm));
  issues.push(...validateCrossLinkShape(fm));
  return issues;
}

/**
 * Structural check only (shape/cap/pattern) for the optional cross-link fields
 * (design spec, "Page frontmatter"): `relatedPages` (≤4 wiki-relative paths) and the
 * `supersedes`/`supersededBy` lifecycle pair. All three are optional — absent on every
 * page ingested before this field existed, so backward compatibility requires no field
 * to be required here. Whether the paths actually resolve is checked separately at lint
 * time (`crossLinkTargets` below), once the full corpus of known paths is known.
 */
export function validateCrossLinkShape(fm: Record<string, unknown>): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  if ("relatedPages" in fm && fm.relatedPages !== undefined) {
    const rp = fm.relatedPages;
    const valid = Array.isArray(rp) && rp.length <= MAX_RELATED_PAGES && rp.every((p) => typeof p === "string" && PAGE_ID_PATTERN.test(p));
    if (!valid) {
      issues.push({ field: "relatedPages", message: `relatedPages must be an array of at most ${MAX_RELATED_PAGES} platform/-relative .md paths` });
    }
  }
  for (const field of ["supersedes", "supersededBy"] as const) {
    if (field in fm && fm[field] !== undefined && fm[field] !== null) {
      const v = fm[field];
      if (typeof v !== "string" || !PAGE_ID_PATTERN.test(v)) {
        issues.push({ field, message: `${field} must be a platform/-relative .md path or null` });
      }
    }
  }
  return issues;
}

/** Extracts the (structurally valid) cross-link paths a page's frontmatter points at, for lint's existence check. */
export function crossLinkTargets(fm: Record<string, unknown>): string[] {
  const targets: string[] = [];
  if (Array.isArray(fm.relatedPages)) {
    for (const p of fm.relatedPages) if (typeof p === "string") targets.push(p);
  }
  for (const field of ["supersedes", "supersededBy"] as const) {
    if (typeof fm[field] === "string") targets.push(fm[field] as string);
  }
  return targets;
}

export function validateHubFrontmatter(fm: Record<string, unknown>): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const req = ["id", "title", "summary", "keywords", "members", "lastBuilt"];
  for (const key of req) if (!(key in fm)) issues.push({ field: key, message: "missing required field" });
  if (isNonEmptyString(fm.id) && !/^platform\/hubs\/.+\.md$/.test(fm.id)) {
    issues.push({ field: "id", message: `hub id must be under platform/hubs/: ${fm.id}` });
  }
  if ("members" in fm) {
    const members = fm.members;
    if (!Array.isArray(members) || members.length === 0 || members.some((m) => typeof m !== "string" || !m.startsWith("platform/"))) {
      issues.push({ field: "members", message: "members must be a non-empty array of platform/-relative paths" });
    }
  }
  issues.push(...validateSharedBounds(fm));
  return issues;
}

/** `platform/guidelines/<version>/<file>` frontmatter:
 *  a `sources: [{url, hash}, …]` list (hub-style, multiple inputs) plus `codeVersion` instead of the
 *  page shape's single `sourceUrl`/`sourceHash`. `version` must match the id's own version segment. */
export function validateGuidelineFrontmatter(fm: Record<string, unknown>): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const req = ["id", "title", "docType", "version", "summary", "keywords", "sources", "codeVersion", "lastBuilt"];
  for (const key of req) if (!(key in fm)) issues.push({ field: key, message: "missing required field" });

  const idMatch = isNonEmptyString(fm.id) ? /^platform\/guidelines\/(6\.6|6\.7)\/[a-z]+(?:-[a-z]+)*-guidelines\.md$/.exec(fm.id) : null;
  if (isNonEmptyString(fm.id) && !idMatch) {
    issues.push({ field: "id", message: `guideline id must be a flat platform/guidelines/<version>/<file> path: ${fm.id}` });
  }
  if ("docType" in fm && fm.docType !== "guideline") {
    issues.push({ field: "docType", message: `docType must be guideline, got ${String(fm.docType)}` });
  }
  if ("version" in fm) {
    // A bare YAML number (`version: 6.7`) parses as 6.7, which `String()` would turn back
    // into "6.7" and silently accept — require an actual string so writers must quote it.
    if (typeof fm.version !== "string") {
      issues.push({ field: "version", message: `version must be a quoted string, got ${typeof fm.version} (${JSON.stringify(fm.version)}) — quote the version` });
    } else if (!GUIDELINE_VERSIONS.includes(fm.version)) {
      issues.push({ field: "version", message: `version must be one of ${GUIDELINE_VERSIONS.join(", ")}` });
    } else if (idMatch && idMatch[1] !== fm.version) {
      issues.push({ field: "version", message: `version (${fm.version}) does not match id's version segment (${idMatch[1]})` });
    }
  }
  issues.push(...validateSharedBounds(fm));
  if ("sources" in fm) {
    const sources = fm.sources;
    const valid =
      Array.isArray(sources) &&
      sources.length > 0 &&
      sources.every(
        (s) => s && typeof s === "object" && isNonEmptyString((s as Record<string, unknown>).url) && isNonEmptyString((s as Record<string, unknown>).hash),
      );
    if (!valid) {
      issues.push({ field: "sources", message: "sources must be a non-empty array of {url, hash} with non-empty strings" });
    }
  }
  if ("codeVersion" in fm && !isNonEmptyString(fm.codeVersion)) {
    issues.push({ field: "codeVersion", message: "codeVersion must be a non-empty string" });
  }
  issues.push(...validateCrossLinkShape(fm));
  return issues;
}

/**
 * Per line: true when it lies inside a fenced ``` / ~~~ code block (fence lines included), so a
 * `## `-looking line inside a code sample is never mistaken for a real heading.
 */
export function fencedLines(lines: string[]): boolean[] {
  let fence: string | null = null;
  return lines.map((line) => {
    const fenceMatch = /^\s*(```|~~~)/.exec(line);
    if (!fenceMatch) return fence !== null;
    fence = fence === null ? fenceMatch[1] : fence === fenceMatch[1] ? null : fence;
    return true;
  });
}

/** `## ` headings outside fenced code, in document order, each with its 0-based line index. */
export function h2HeadingLines(lines: string[]): { title: string; index: number }[] {
  const fenced = fencedLines(lines);
  const out: { title: string; index: number }[] = [];
  lines.forEach((line, index) => {
    const m = fenced[index] ? null : /^##\s+(.+?)\s*$/.exec(line);
    if (m) out.push({ title: m[1].trim(), index });
  });
  return out;
}

/** `## ` heading text, in document order, skipping any that appear inside fenced code. */
export function h2Headings(body: string): string[] {
  return h2HeadingLines(body.split("\n")).map((h) => h.title);
}

/**
 * Section contract per page-outline.md: `## What it is` is required; every `## ` heading
 * must be one of the canonical six, each at most once; present sections keep canonical order.
 * Empty sections are omitted entirely (no heading, no `—` placeholder).
 */
export function validateSixSections(body: string): ValidationIssue[] {
  const headings = h2Headings(body);
  const issues: ValidationIssue[] = [];
  const codeCheckHeadings = headings.filter((h) => CODE_CHECK_HEADING_RE.test(h));
  if (codeCheckHeadings.length > 1) {
    issues.push({ field: "body", message: "duplicate section heading: ## Code check" });
  } else if (codeCheckHeadings.length === 1 && headings[headings.length - 1] !== codeCheckHeadings[0]) {
    issues.push({ field: "body", message: "## Code check (...) must be the last section" });
  }
  for (const h of headings) {
    if (!SIX_SECTIONS.includes(h) && !CODE_CHECK_HEADING_RE.test(h)) issues.push({ field: "body", message: `unknown section heading: ## ${h}` });
  }
  const present = headings.filter((h) => SIX_SECTIONS.includes(h));
  if (!present.includes(SIX_SECTIONS[0])) {
    issues.push({ field: "body", message: `missing section heading: ## ${SIX_SECTIONS[0]}` });
  }
  const seen = new Set<string>();
  for (const h of present) {
    if (seen.has(h)) issues.push({ field: "body", message: `duplicate section heading: ## ${h}` });
    seen.add(h);
  }
  const firstIndexes = [...seen].map((h) => SIX_SECTIONS.indexOf(h));
  for (let i = 1; i < firstIndexes.length; i++) {
    if (firstIndexes[i] < firstIndexes[i - 1]) {
      issues.push({ field: "body", message: `section heading out of canonical order: ## ${SIX_SECTIONS[firstIndexes[i]]}` });
    }
  }
  return issues;
}

/** Strips the optional, last `## Code check (<x.y.z.w>)` section — verification bookkeeping, not prose. */
export function stripCodeCheckSection(body: string): string {
  return body.replace(/\n##\s+Code check \([^)\n]*\)[\s\S]*$/, "");
}

/** Rough token estimate: ~0.75 tokens/word is typical for English prose; we use word count * 1.3 as a token proxy.
 *  Excludes the `## Code check` section (page-outline.md), so the 800-token band is unaffected by it. */
export function estimateTokens(body: string): number {
  const words = stripCodeCheckSection(body).trim().split(/\s+/).filter(Boolean).length;
  return Math.round(words * 1.3);
}

/**
 * Effective article-minimum floor: a source with less prose than the config minimum caps
 * the floor at its own estimated PROSE token count — fenced code blocks and inline code
 * spans are stripped first, because writers must not reproduce code, so a mostly-code
 * source may honestly yield a proportionally short article. Unknown source text falls
 * back to the config floor.
 */
export function effectiveMinTokens(configMin: number, sourceText: string | undefined): number {
  return sourceText === undefined ? configMin : Math.min(configMin, estimateTokens(stripFencedCode(sourceText)));
}
