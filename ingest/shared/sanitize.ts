/**
 * Sanitiser applied to fetched source text before it reaches `.cache/src/`
 * (refresh spec, Security C5). Strips markup that could carry hidden
 * instructions or scripts; source text is untrusted data.
 */
export function sanitizeSourceText(input: string): string {
  let text = input;
  text = text.replace(/<!--@include[^]*?-->/gi, ""); // VitePress include directive, before generic comment strip
  text = text.replace(/<!--[^]*?-->/g, "");
  text = text.replace(/<script\b[^]*?<\/script\s*>/gi, "");
  text = text.replace(/<style\b[^]*?<\/style\s*>/gi, "");
  text = text.replace(/<iframe\b[^]*?<\/iframe\s*>/gi, "");
  text = text.replace(/<template\b[^]*?<\/template\s*>/gi, "");
  text = text.replace(/\s+on[a-z]+\s*=\s*"(?:[^"\\]|\\.)*"/gi, "");
  text = text.replace(/\s+on[a-z]+\s*=\s*'(?:[^'\\]|\\.)*'/gi, "");
  text = stripHiddenElements(text);
  text = stripZeroWidthAndBidi(text);
  return text;
}

/** Removes elements carrying `hidden`, `display:none` or `aria-hidden="true"` — a crude but safe single-tag match. */
function stripHiddenElements(text: string): string {
  return text.replace(
    /<([a-zA-Z][\w-]*)\b[^>]*\b(?:hidden\b|aria-hidden\s*=\s*["']?true["']?|style\s*=\s*["'][^"']*display\s*:\s*none[^"']*["'])[^>]*>[^]*?<\/\1\s*>/gi,
    "",
  );
}

/**
 * Strips zero-width characters (U+200B ZERO WIDTH SPACE, U+200C ZWNJ, U+200D ZWJ,
 * U+FEFF BOM/ZERO WIDTH NO-BREAK SPACE) and bidi control characters (U+202A-U+202E
 * embedding/override, U+2066-U+2069 isolates) that can be used to hide instructions
 * inside otherwise-plain text. Built from explicit code points (rather than a regex
 * literal) so no invisible character ends up embedded in this source file itself.
 */
const ZERO_WIDTH_AND_BIDI_RANGES: Array<[number, number]> = [
  [0x200b, 0x200d],
  [0xfeff, 0xfeff],
  [0x202a, 0x202e],
  [0x2066, 0x2069],
];
const ZERO_WIDTH_AND_BIDI_RE = new RegExp(
  "[" + ZERO_WIDTH_AND_BIDI_RANGES.map(([a, b]) => `\\u{${a.toString(16)}}-\\u{${b.toString(16)}}`).join("") + "]",
  "gu",
);

export function stripZeroWidthAndBidi(text: string): string {
  return text.replace(ZERO_WIDTH_AND_BIDI_RE, "");
}
