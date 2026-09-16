/**
 * Output hygiene checks applied at ingest (Security C6) and re-checked by
 * `wiki:lint` against the committed tree. Injection-pattern scanning only
 * looks at prose outside fenced code blocks (C6b) — code is bytes.
 */
import { createRequire } from "node:module";
import { stripZeroWidthAndBidi } from "./sanitize.js";

// JSON so `scripts/*.mjs` (the release pack gate) reads the same list without a second copy of it.
const NON_PAGE_BASENAMES = new Set<string>(
  (createRequire(import.meta.url)("./non-page-files.json") as { basenames: string[] }).basenames,
);

// Allowlist as data: a link is allowed iff https AND (host equals or is a subdomain of one
// of ALLOWLISTED_LINK_HOSTS) OR (host is exactly "github.com" AND its path starts with one
// of GITHUB_ALLOWED_PATH_PREFIXES). Stated once here — do not also compare against the raw
// "host" string, which lets a look-alike host (e.g. developer.shopware.com.evil.io) through.
const ALLOWLISTED_LINK_HOSTS = ["developer.shopware.com", "docs.shopware.com"];
const GITHUB_ALLOWED_PATH_PREFIXES = ["/shopware/"];

function isAllowlistedLink(url: string): boolean {
  let u: URL;
  try {
    u = new URL(url);
  } catch {
    return false;
  }
  if (u.protocol !== "https:") return false;
  const host = u.hostname;
  if (ALLOWLISTED_LINK_HOSTS.some((h) => host === h || host.endsWith(`.${h}`))) return true;
  return host === "github.com" && GITHUB_ALLOWED_PATH_PREFIXES.some((p) => u.pathname.startsWith(p));
}

// Purity needles — tooling names that must never appear in shipped wiki content, since they
// couple the wiki package to this repo's ingestion internals (wiki:lint's package-purity
// check). `checkPurity` covers the always-on set; a caller (lint.ts) may layer extra needles
// and a per-file allowlist on top for the one hand-committed protocol file.
export const REPO_INTERNAL_NEEDLES = ["ingest/", "kb-factory-", "WIKI_ROOT", "shopware-dev-knowledge-base"];

export function checkPurity(text: string, extraNeedles: readonly string[] = [], allowedNeedles: readonly string[] = []): HygieneIssue[] {
  for (const needle of [...REPO_INTERNAL_NEEDLES, ...extraNeedles]) {
    if (allowedNeedles.includes(needle)) continue;
    if (text.includes(needle)) {
      return [{ rule: "purity", detail: `references tooling ("${needle}") — wiki/ must not couple to ingestion internals` }];
    }
  }
  return [];
}

const INJECTION_PATTERNS = [
  /ignore\s+(all|previous|prior)\s+instructions/i,
  /you\s+are\s+now\b/i,
  /system\s+prompt/i,
  /disregard\s+(the|your)\s+(previous|above)/i,
  /<function_calls/i,
  /<invoke\b/i,
  /<tool_use/i,
];

export interface HygieneIssue {
  rule: string;
  detail: string;
  /** True for the two classes `sourceText` can exempt (non-allowlisted external link,
   *  `data:` URI): when the source text isn't available at all (e.g. `.cache/src/` was
   *  cleaned) a caller may downgrade these to warnings instead of erroring on content that
   *  was, in fact, quoted from upstream — every other class stays a hard error regardless. */
  exemptible?: true;
}

export function stripFencedCode(text: string): string {
  return text
    .replace(/```[^]*?```/g, "")
    .replace(/~~~[^]*?~~~/g, "")
    .replace(/`[^`\n]*`/g, "");
}

/**
 * `sourceText` (the fetched upstream source) relaxes exactly two finding classes —
 * non-allowlisted external links and `data:` URIs — for strings the source itself
 * contains verbatim: the doc is then quoting upstream, not inventing. javascript:
 * URIs, injection patterns, script tags, HTML comments, zero-width/bidi and
 * NUL/control characters are never exempted.
 */
export function checkOutputHygiene(text: string, sourceText?: string): HygieneIssue[] {
  const issues: HygieneIssue[] = [];
  const inSource = (s: string) => sourceText !== undefined && sourceText.includes(s);
  if (/<!--[^]*?-->/.test(text)) issues.push({ rule: "C6", detail: "HTML comment in output" });
  if (/<script\b/i.test(text)) issues.push({ rule: "C6", detail: "<script tag in output" });
  if (stripZeroWidthAndBidi(text) !== text) issues.push({ rule: "C6", detail: "zero-width or bidi control character in output" });
  if (/\bjavascript:/i.test(text)) issues.push({ rule: "C6", detail: "data: or javascript: URL in output" });
  // Real data-URI shape (scheme, media type, `;`/`,`) — a YAML `data:` map key is not a data: URL.
  for (const m of text.matchAll(/\bdata:[a-z]+\/[\w.+-]+[;,]/gi)) {
    if (!inSource(m[0])) {
      issues.push({ rule: "C6", detail: "data: or javascript: URL in output", exemptible: true });
      break;
    }
  }

  // A link only counts as a link outside fenced/inline code — a `https://...` placeholder
  // inside a fenced JSON/YAML example or an inline-code snippet is a documented literal, not
  // a citation the reader can click, so it is never rejected (or exempted) as one.
  const prose = stripFencedCode(text);
  for (const m of prose.matchAll(/https?:\/\/[^\s)>"'`]+/g)) {
    if (!isAllowlistedLink(m[0]) && !inSource(m[0])) {
      issues.push({ rule: "C6", detail: `external link not https on an allowlisted host: ${m[0]}`, exemptible: true });
    }
  }

  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(prose)) issues.push({ rule: "C6", detail: `prompt-injection-like phrase matching ${pattern}` });
  }

  if (/\x00/.test(text)) issues.push({ rule: "C9", detail: "NUL byte in output" });
  // eslint-disable-next-line no-control-regex
  if (/[\x00-\x08\x0b\x0c\x0e-\x1f]/.test(text)) issues.push({ rule: "C9", detail: "control character other than \\n/\\t in output" });

  return issues;
}

const LEAK_PATTERNS: Array<[RegExp, string]> = [
  [/\/Users\//, "/Users/ path"],
  [/\/home\//, "/home/ path"],
  [/C:\\/, "C:\\ path"],
  [/\$HOME/, "$HOME"],
  [/ANTHROPIC_/, "ANTHROPIC_ env var name"],
  [/GITHUB_TOKEN/, "GITHUB_TOKEN"],
  [/Bearer\s+[A-Za-z0-9._~+/-]{20,}/, "Bearer token"],
];

export function checkLeakedLocalState(text: string): HygieneIssue[] {
  const issues: HygieneIssue[] = [];
  for (const [pattern, detail] of LEAK_PATTERNS) {
    if (pattern.test(text)) issues.push({ rule: "C11", detail: `leaked local/secret string: ${detail}` });
  }
  return issues;
}

/**
 * Repository furniture that is Markdown but not documentation — the docs repo's own `AGENTS.md`,
 * `.github/PULL_REQUEST_TEMPLATE.md` and friends. The developer source is downloaded whole
 * (upstream `.docsignore` deliberately not applied), so nothing else keeps these out: they parse as
 * ordinary pages, get frontmatter and index lines, and would ship to consumers in the published
 * corpus.
 *
 * One predicate, three gates — `sync` (stops re-admission at the door), `wiki:lint` (catches a tree
 * that already has one) and the pack gate, because repository furniture must never be published as
 * a documentation page. The list is data in
 * `non-page-files.json` so the `.mjs` release scripts read the same one without a second copy.
 *
 * Matches on the path, never the word: `AGENTS.md` is a legitimate *subject* of several real pages.
 */
export function isDocPagePath(p: string): boolean {
  const segments = p.split("/").filter(Boolean);
  if (segments.some((s) => s.startsWith("."))) return false;
  const basename = segments[segments.length - 1] ?? "";
  return !NON_PAGE_BASENAMES.has(basename);
}
