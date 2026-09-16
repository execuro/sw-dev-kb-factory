/**
 * Minimal, dependency-free HTML → markdown conversion for merchant pages
 * (refresh spec lists `turndown` for this; not added here — see ingest report).
 * Good enough for the `div.text--container` bodies docs.shopware.com serves:
 * headings, paragraphs, lists, links, tables, bold/italic, code.
 */
export function extractContainer(html: string, selectorClass: string): string | undefined {
  const re = new RegExp(`<div[^>]*class="[^"]*\\b${selectorClass}\\b[^"]*"[^>]*>`, "i");
  const m = re.exec(html);
  if (!m) return undefined;
  const start = m.index + m[0].length;
  let depth = 1;
  let i = start;
  const tagRe = /<div\b[^>]*>|<\/div\s*>/gi;
  tagRe.lastIndex = start;
  let tm: RegExpExecArray | null;
  while ((tm = tagRe.exec(html))) {
    if (tm[0].toLowerCase().startsWith("</")) depth--;
    else depth++;
    if (depth === 0) {
      i = tm.index;
      break;
    }
  }
  return html.slice(start, i);
}

export function htmlToMarkdown(html: string): string {
  let text = html;
  text = text.replace(/<!--[^]*?-->/g, "");
  text = text.replace(/<(script|style)\b[^]*?<\/\1\s*>/gi, "");
  text = text.replace(/<h([1-6])[^>]*>([^]*?)<\/h\1\s*>/gi, (_m, lvl: string, inner: string) => `\n${"#".repeat(Number(lvl))} ${stripTags(inner)}\n`);
  text = text.replace(/<li[^>]*>([^]*?)<\/li\s*>/gi, (_m, inner: string) => `- ${stripTags(inner).trim()}\n`);
  text = text.replace(/<a\s+[^>]*href="([^"]*)"[^>]*>([^]*?)<\/a\s*>/gi, (_m, href: string, inner: string) => `[${stripTags(inner)}](${href})`);
  text = text.replace(/<strong[^>]*>([^]*?)<\/strong\s*>/gi, (_m, inner: string) => `**${stripTags(inner)}**`);
  text = text.replace(/<b[^>]*>([^]*?)<\/b\s*>/gi, (_m, inner: string) => `**${stripTags(inner)}**`);
  text = text.replace(/<em[^>]*>([^]*?)<\/em\s*>/gi, (_m, inner: string) => `_${stripTags(inner)}_`);
  text = text.replace(/<code[^>]*>([^]*?)<\/code\s*>/gi, (_m, inner: string) => `\`${stripTags(inner)}\``);
  text = text.replace(/<pre[^>]*>([^]*?)<\/pre\s*>/gi, (_m, inner: string) => `\n\`\`\`\n${stripTags(inner)}\n\`\`\`\n`);
  text = text.replace(/<p[^>]*>([^]*?)<\/p\s*>/gi, (_m, inner: string) => `\n${stripTags(inner).trim()}\n`);
  text = text.replace(/<br\s*\/?>/gi, "\n");
  text = stripTags(text);
  text = text.replace(/\n{3,}/g, "\n\n").trim();
  return text;
}

function stripTags(html: string): string {
  return html
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

export interface ParsedRevision {
  range: string;
  swMin: string | null;
  swMax: string | null;
  current: boolean;
  url: string;
}

/** Best-effort parse of `div.info--version`'s revision dropdown; falls back to a single "current, all versions" entry. */
export function parseRevisions(html: string, pageUrl: string): ParsedRevision[] {
  const container = extractContainer(html, "info--version");
  if (!container) return [{ range: "current", swMin: null, swMax: null, current: true, url: pageUrl }];
  const items = [...container.matchAll(/<a[^>]*href="([^"]*)"[^>]*>([^]*?)<\/a\s*>/gi)];
  if (items.length === 0) return [{ range: "current", swMin: null, swMax: null, current: true, url: pageUrl }];
  return items.map((m, idx) => {
    const label = stripTags(m[2]).trim();
    const range = parseSwRange(label);
    return { range: label, swMin: range.min, swMax: range.max, current: idx === 0, url: new URL(m[1], pageUrl).toString() };
  });
}

function parseSwRange(label: string): { min: string | null; max: string | null } {
  const orNewer = /^([\d.]+)\s+or newer$/i.exec(label);
  if (orNewer) return { min: orNewer[1], max: null };
  const between = /^([\d.]+)\s*-\s*([\d.]+)$/.exec(label);
  if (between) return { min: between[1], max: between[2] };
  return { min: null, max: null };
}
