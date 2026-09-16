/**
 * Hand-written parser for the simple YAML subset used by wiki page frontmatter:
 * scalars, quoted strings, flow arrays `[a, b]`, flow maps `{ "6.7": "…" }`,
 * ISO dates, block maps (indented `key: value` lines) and block lists (`- item`).
 * No anchors, no multi-line scalars, no tags. Never throws on input — a line it
 * cannot parse is kept as a raw string value.
 */

export interface FrontmatterParse {
  data: Record<string, unknown>;
  /** 1-based line number of the closing `---`; 0 when the text has no frontmatter. */
  endLine: number;
}

export function parseFrontmatter(text: string): FrontmatterParse {
  const lines = text.split("\n");
  if (lines.length === 0 || lines[0].replace(/\r$/, "") !== "---") return { data: {}, endLine: 0 };
  let end = -1;
  for (let i = 1; i < lines.length; i++) {
    const l = lines[i].replace(/\r$/, "");
    if (l === "---" || l === "...") {
      end = i;
      break;
    }
  }
  if (end < 0) return { data: {}, endLine: 0 };
  const body = lines.slice(1, end).map((l) => l.replace(/\r$/, ""));
  return { data: parseBlockMap(body, 0).value, endLine: end + 1 };
}

function indentOf(line: string): number {
  let n = 0;
  while (n < line.length && line[n] === " ") n++;
  return n;
}

function isBlank(line: string): boolean {
  const t = line.trim();
  return t === "" || t.startsWith("#");
}

/** Parses consecutive `key: value` lines at the given indentation. */
function parseBlockMap(lines: string[], indent: number): { value: Record<string, unknown>; consumed: number } {
  const out: Record<string, unknown> = {};
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (isBlank(line)) {
      i++;
      continue;
    }
    const ind = indentOf(line);
    if (ind < indent) break;
    if (ind > indent) {
      i++; // stray deeper line without a parent — skip
      continue;
    }
    const m = /^([^:#]+?)\s*:(?:\s+(.*)|\s*)$/.exec(line.slice(ind));
    if (!m) {
      i++;
      continue;
    }
    const key = unquote(m[1].trim());
    const rest = (m[2] ?? "").trim();
    if (rest === "" || rest.startsWith("#")) {
      // nested block (map or list) or null
      const next = nextNonBlank(lines, i + 1);
      if (next >= 0 && indentOf(lines[next]) > ind) {
        const childIndent = indentOf(lines[next]);
        if (lines[next].slice(childIndent).startsWith("- ")) {
          const r = parseBlockList(lines.slice(i + 1), childIndent);
          out[key] = r.value;
          i += 1 + r.consumed;
        } else {
          const r = parseBlockMap(lines.slice(i + 1), childIndent);
          out[key] = r.value;
          i += 1 + r.consumed;
        }
      } else if (next >= 0 && indentOf(lines[next]) === ind && lines[next].slice(ind).startsWith("- ")) {
        const r = parseBlockList(lines.slice(i + 1), ind);
        out[key] = r.value;
        i += 1 + r.consumed;
      } else {
        out[key] = null;
        i++;
      }
    } else {
      out[key] = parseScalar(rest);
      i++;
    }
  }
  return { value: out, consumed: i };
}

function parseBlockList(lines: string[], indent: number): { value: unknown[]; consumed: number } {
  const out: unknown[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (isBlank(line)) {
      i++;
      continue;
    }
    const ind = indentOf(line);
    if (ind !== indent || !line.slice(ind).startsWith("- ")) break;
    out.push(parseScalar(line.slice(ind + 2).trim()));
    i++;
  }
  return { value: out, consumed: i };
}

function nextNonBlank(lines: string[], from: number): number {
  for (let i = from; i < lines.length; i++) if (!isBlank(lines[i])) return i;
  return -1;
}

function stripComment(s: string): string {
  // a ` #` outside quotes starts a comment
  let q: string | null = null;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (q) {
      if (c === q) q = null;
    } else if (c === '"' || c === "'") q = c;
    else if (c === "#" && (i === 0 || s[i - 1] === " ")) return s.slice(0, i).trim();
  }
  return s.trim();
}

export function parseScalar(raw: string): unknown {
  const s = stripComment(raw);
  if (s === "") return null;
  if (s.startsWith("[") && s.endsWith("]")) return splitFlow(s.slice(1, -1)).map(parseScalar);
  if (s.startsWith("{") && s.endsWith("}")) {
    const obj: Record<string, unknown> = {};
    for (const item of splitFlow(s.slice(1, -1))) {
      const idx = findColon(item);
      if (idx < 0) {
        obj[unquote(item.trim())] = null;
      } else {
        obj[unquote(item.slice(0, idx).trim())] = parseScalar(item.slice(idx + 1).trim());
      }
    }
    return obj;
  }
  if ((s.startsWith('"') && s.endsWith('"') && s.length >= 2) || (s.startsWith("'") && s.endsWith("'") && s.length >= 2)) {
    return unquote(s);
  }
  if (s === "true" || s === "True") return true;
  if (s === "false" || s === "False") return false;
  if (s === "null" || s === "~" || s === "Null") return null;
  if (/^-?(0|[1-9]\d*)(\.\d+)?([eE][-+]?\d+)?$/.test(s)) return Number(s);
  return s; // plain string (ISO dates stay strings)
}

/** Splits a flow-collection body on top-level commas, honouring quotes and nesting. */
function splitFlow(s: string): string[] {
  const parts: string[] = [];
  let depth = 0;
  let q: string | null = null;
  let cur = "";
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (q) {
      cur += c;
      if (c === "\\" && i + 1 < s.length) {
        cur += s[++i];
      } else if (c === q) q = null;
      continue;
    }
    if (c === '"' || c === "'") {
      q = c;
      cur += c;
    } else if (c === "[" || c === "{") {
      depth++;
      cur += c;
    } else if (c === "]" || c === "}") {
      depth--;
      cur += c;
    } else if (c === "," && depth === 0) {
      parts.push(cur.trim());
      cur = "";
    } else cur += c;
  }
  if (cur.trim() !== "") parts.push(cur.trim());
  return parts;
}

function findColon(s: string): number {
  let q: string | null = null;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (q) {
      if (c === q) q = null;
    } else if (c === '"' || c === "'") q = c;
    else if (c === ":" && (i + 1 >= s.length || s[i + 1] === " ")) return i;
  }
  return -1;
}

function unquote(s: string): string {
  if (s.length >= 2 && s.startsWith('"') && s.endsWith('"')) {
    return s.slice(1, -1).replace(/\\(["\\/bfnrt])/g, (_m, c: string) => {
      switch (c) {
        case "n":
          return "\n";
        case "t":
          return "\t";
        case "r":
          return "\r";
        case "b":
          return "\b";
        case "f":
          return "\f";
        default:
          return c;
      }
    });
  }
  if (s.length >= 2 && s.startsWith("'") && s.endsWith("'")) return s.slice(1, -1).replace(/''/g, "'");
  return s;
}
