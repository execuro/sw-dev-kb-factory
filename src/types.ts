/**
 * Shared types of the ShopwareDevKnowledgeBase MCP server.
 *
 * The server is a read-only file viewer over one wiki root: every id is a
 * wiki-root-relative path starting with the layer directory name
 * (`platform/dev/6.7/...`).
 */

export const KNOWN_LAYERS = ["platform", "project", "marketplace"] as const;

/** Conformance contract major served by this server (manifest.json `contract`). */
export const CONTRACT_MAJOR = 1;

export type LayerStatusValue = "implemented" | "planned" | "missing" | "oversized" | "unsupported";

export interface LayerStatus {
  layer: string;
  status: LayerStatusValue;
  synonyms: boolean;
  integrity: "ok" | "mismatch" | "unverified";
  notices: string[];
  /** Whitelisted manifest.json fields (contract, versions, lastBuilt, counts, treeHash, hubs, pageCount). */
  [manifestField: string]: unknown;
}

export interface Entry {
  path: string;
  name: string;
  type: "dir" | "file";
  title?: string;
  /** `guidelines/` view only: which side(s) provide this file — `platform`, `project` or `platform+project`. */
  tag?: "platform" | "project" | "platform+project";
}

export interface ListArgs {
  path: string;
  depth?: number;
  glob?: string;
  caseSensitive?: boolean;
}

export interface ListResult {
  path: string;
  entries: Entry[];
  index?: string;
  truncated: boolean;
  notices: string[];
}

export type GrepMode = "content" | "files" | "count";

export interface GrepArgs {
  pattern: string;
  path: string;
  mode?: GrepMode;
  regex?: boolean;
  caseSensitive?: boolean;
  wholeWord?: boolean;
  maxMatches?: number;
  context?: number;
  before?: number;
  after?: number;
  glob?: string;
}

export interface Match {
  path: string;
  line: number;
  text: string;
  before: string[];
  after: string[];
  truncatedLine?: true;
}

export interface GrepResult {
  matches?: Match[];
  files?: string[];
  counts?: { path: string; count: number }[];
  truncated: boolean;
  notices: string[];
  /** Reminds callers that every hit above is a match line only, never citable until read_doc confirms it. */
  note?: string;
}

export interface ReadArgs {
  path: string;
  section?: string;
  offset?: number;
  limit?: number;
  /** Return the verbatim upstream source snapshot instead of the wiki article. */
  source?: boolean;
}

export interface SectionInfo {
  requested: string;
  resolved: string;
  lineFrom: number;
  lineTo: number;
}

export interface ReadResult {
  path: string;
  frontmatter: Record<string, unknown>;
  raw: string;
  lineFrom: number;
  lineTo: number;
  totalLines: number;
  /** Ready-to-paste citation for the range actually returned: `<path>:<lineFrom>-<lineTo>`. Empty when nothing was returned. */
  citation: string;
  section?: SectionInfo;
  /** Present when `source: true` resolved the page's upstream snapshot identity. */
  source?: { sourceId: string; sourceHash: string };
  truncated: boolean;
  notices: string[];
}

/**
 * One documentation backend per layer directory. The layer name is data
 * (the directory name), never an enum. Paths handed in are already
 * syntax-validated (B1) and wiki-root-relative.
 */
/** Selects which corpus (`kb.config.json` entry) the running server serves; `resolveCorpus()` in `registry.ts`. */
export type ConfigSource = "arg" | "env" | "config" | "default";

/** Root-relative corpus metadata attached to the resolved wiki root, surfaced via `kb_status.corpus`. */
export interface CorpusInfo {
  name: string;
  developer: string;
  merchant: string;
  entryPoints: string[];
}

export interface DocSource {
  readonly layer: string;
  status(): LayerStatus;
  list(args: ListArgs): ListResult;
  grep(args: GrepArgs): Promise<GrepResult>;
  read(args: ReadArgs): Promise<ReadResult>;
}

export interface TreeLimits {
  maxFiles: number;
  maxDirs: number;
  maxDepth: number;
  maxBytes: number;
}

export const DEFAULT_TREE_LIMITS: TreeLimits = {
  maxFiles: 20_000,
  maxDirs: 2_000,
  maxDepth: 12,
  maxBytes: 64 * 1024 * 1024,
};

/** Output caps (A5). */
export const MAX_RESPONSE_BYTES = 256 * 1024;
export const MAX_LINE_CHARS = 400;
export const MAX_READ_FILE_BYTES = 2 * 1024 * 1024;
export const MAX_MANIFEST_BYTES = 1024 * 1024;
export const MAX_ENTRIES = 5_000;
export const MAX_PATTERN_CHARS = 256;
export const MAX_GLOB_CHARS = 256;
export const FRONTMATTER_HEAD_BYTES = 8 * 1024;
export const BODY_CACHE_BYTES = 64 * 1024 * 1024;
