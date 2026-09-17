/**
 * Expert sections of a curated `platform/guidelines/<version>/<file>`: a `##` section whose
 * first non-blank line is the `> [expert]` tag (src/wiki/fs.ts `EXPERT_TAG_RE`) is written by a
 * domain expert, not by the guideline writer. `wiki:guidelines --ingest` carries every expert
 * section of the existing wiki file over into the writer's new output (`spliceExpertSections`),
 * `--prepare` tells the writer which anchors are expert-owned and how many bytes they take
 * (`GuidelineWorkItem.expert`/`sizeBudget`), and `wiki:lint` checks the tag's placement
 * (`lintExpertSections`). An expert edit never makes a file dirty — `isGuidelineDirty` is
 * content-blind on purpose.
 */
import { parsePage, h2HeadingLines } from "./frontmatterValidate.js";
import { slugify, isExpertTagLine, firstBodyLineIndex } from "../../src/wiki/fs.js";

export const EXPERT_TAG_LINE = "> [expert]";

/** A `## Code check (<codeVersion>)` heading title. */
const CODE_CHECK_TITLE_RE = /^Code check \(/;

export interface ExpertSection {
  anchor: string;
  title: string;
  /** Anchor of the `##` section directly before this one in its source file; null when it was the first. */
  predecessorAnchor: string | null;
  /** Heading line, tag line and body, trailing blank lines trimmed. */
  lines: string[];
  bytes: number;
}

interface Block {
  anchor: string;
  title: string;
  lines: string[];
  expert: boolean;
}

function trimTrailingBlank(lines: string[]): string[] {
  let end = lines.length;
  while (end > 0 && lines[end - 1].trim() === "") end--;
  return lines.slice(0, end);
}

/** Splits a page body into its `##` blocks (each: heading line through the line before the next `##`). */
function h2BlocksOf(bodyLines: string[]): { preamble: string[]; blocks: Block[] } {
  const hs = h2HeadingLines(bodyLines);
  const preamble = trimTrailingBlank(bodyLines.slice(0, hs.length ? hs[0].index : bodyLines.length));
  const blocks: Block[] = hs.map((h, i) => {
    const end = i + 1 < hs.length ? hs[i + 1].index : bodyLines.length;
    const first = firstBodyLineIndex(bodyLines, h.index, end);
    return {
      anchor: slugify(h.title),
      title: h.title,
      lines: trimTrailingBlank(bodyLines.slice(h.index, end)),
      expert: first >= 0 && isExpertTagLine(bodyLines[first]),
    };
  });
  return { preamble, blocks };
}

function bytesOf(lines: string[]): number {
  return Buffer.byteLength(lines.join("\n") + "\n", "utf8");
}

/** Every expert section of a guideline file, in document order. */
export function extractExpertSections(text: string): ExpertSection[] {
  const { body } = parsePage(text);
  const { blocks } = h2BlocksOf(body.split("\n"));
  const out: ExpertSection[] = [];
  blocks.forEach((b, i) => {
    if (!b.expert) return;
    out.push({ anchor: b.anchor, title: b.title, predecessorAnchor: i > 0 ? blocks[i - 1].anchor : null, lines: b.lines, bytes: bytesOf(b.lines) });
  });
  return out;
}

export function expertBytes(sections: ExpertSection[]): number {
  return sections.reduce((n, s) => n + s.bytes, 0);
}

/**
 * Splices `sections` (taken from the previous wiki file) into `text` (the writer's new output).
 * Each section lands directly after the block that preceded it before, when that anchor still
 * exists; otherwise before `## Code check (...)`, which stays last; otherwise at the end. A block
 * of the same anchor already in `text` is replaced — the expert version always wins. Blocks are
 * re-joined with one blank line between them; the frontmatter and preamble are untouched.
 */
export function spliceExpertSections(text: string, sections: ExpertSection[]): string {
  if (sections.length === 0) return text;
  const { endLine } = parsePage(text);
  const lines = text.split("\n");
  const head = lines.slice(0, endLine);
  const { preamble, blocks } = h2BlocksOf(lines.slice(endLine));

  for (const s of sections) {
    const block: Block = { anchor: s.anchor, title: s.title, lines: s.lines, expert: true };
    const existing = blocks.findIndex((b) => b.anchor === s.anchor);
    if (existing >= 0) {
      blocks[existing] = block;
      continue;
    }
    const after = s.predecessorAnchor === null ? -1 : blocks.findIndex((b) => b.anchor === s.predecessorAnchor);
    if (after >= 0 && !CODE_CHECK_TITLE_RE.test(blocks[after].title)) {
      blocks.splice(after + 1, 0, block);
      continue;
    }
    const codeCheck = blocks.findIndex((b) => CODE_CHECK_TITLE_RE.test(b.title));
    blocks.splice(codeCheck >= 0 ? codeCheck : blocks.length, 0, block);
  }

  const out: string[] = [...head, ...preamble];
  for (const b of blocks) {
    if (out.length > 0 && out[out.length - 1].trim() !== "") out.push("");
    out.push(...b.lines);
  }
  return out.join("\n") + "\n";
}

/**
 * Placement rules for the `> [expert]` tag, as `wiki:lint` reports them: the tag is only valid
 * as the first non-blank line under a rule `##` heading (never under `## Index` or
 * `## Code check (...)`, never elsewhere in a section), and an expert section must come before
 * the `## Code check` section.
 */
export function lintExpertSections(body: string): string[] {
  const issues: string[] = [];
  const bodyLines = body.split("\n");
  const hs = h2HeadingLines(bodyLines);
  const codeCheckAt = hs.findIndex((h) => CODE_CHECK_TITLE_RE.test(h.title));
  // A tag before the first `##` heading is always stray.
  const firstHeading = hs.length ? hs[0].index : bodyLines.length;
  for (let i = 0; i < firstHeading; i++) {
    if (isExpertTagLine(bodyLines[i])) issues.push(`line ${i + 1}: "${EXPERT_TAG_LINE}" tag outside a ## section`);
  }
  hs.forEach((h, i) => {
    const end = i + 1 < hs.length ? hs[i + 1].index : bodyLines.length;
    const first = firstBodyLineIndex(bodyLines, h.index, end);
    for (let j = h.index + 1; j < end; j++) {
      if (!isExpertTagLine(bodyLines[j])) continue;
      if (j !== first) {
        issues.push(`## ${h.title}: "${EXPERT_TAG_LINE}" must be the first line under the heading (line ${j + 1})`);
        continue;
      }
      if (h.title === "Index" || CODE_CHECK_TITLE_RE.test(h.title)) issues.push(`## ${h.title}: "${EXPERT_TAG_LINE}" is not allowed on this section`);
      else if (codeCheckAt >= 0 && i > codeCheckAt) issues.push(`## ${h.title}: expert section must come before ## Code check`);
    }
  });
  return issues;
}
