/**
 * Shared types for the ingestion CLI. Build-time only — never imported by src/server.
 */

export type DocType = "developer" | "functional" | "guideline";

/** Generic, non-versioned links. No tree/pageText/rawFallback/bulkText — those are
 *  derived at runtime from a version-entry's `main` GitHub URL (see githubUrl.ts). */
export interface SourceEndpoints {
  main?: string;     // canonical link for the whole source (e.g. developer-portal's site root)
  llmsTxt?: string;
  sitemap?: string;
}

/** One version of a multi-version source. Every source uses this same shape for
 *  consistency, even though only `developer`'s entries populate `main`/`urlPrefix`. */
export interface VersionEntry {
  version: string;
  main?: string;        // developer only: GitHub tree URL, e.g. https://github.com/shopware/docs/tree/v6.6.
                         // api.github.com / raw.githubusercontent.com URLs are derived from this at
                         // runtime by ingest/shared/githubUrl.ts — never stored in config.
  urlPrefix?: string;    // developer only: portal path prefix for this version (e.g. "/docs/v6.6/"),
                         // used only by the optional unpublished-page gate when developer-portal is active
  active: boolean;
  deactivatedNote?: string;
}

export interface AlgoliaConfig {
  appId: string;
  index: string;
  searchKey: string;
  searchKeyNote?: string;
}

export interface MerchantSiteConfig {
  baseUrl: string;
  navRoot: string;
  localization: string;
  product: string;
}

export interface SourceConfig {
  id: string;
  docType: DocType[];          // scalar -> array. developer-portal declares [] (metadata-only, never
                                // content-bearing — this is what makes it fall out of every
                                // `docType.includes("developer"|"functional")` filter automatically)
  active: boolean;              // source-level master switch
  deactivatedNote?: string;
  versions?: VersionEntry[];    // replaces the old scalar `version` AND the old `versions?: string[]`
  wikiDir?: string;             // now optional — developer-portal has no wiki output of its own
  endpoints?: SourceEndpoints;
  site?: MerchantSiteConfig;
  algolia?: AlgoliaConfig;
  enumerate?: "algolia" | "nav";
  exclude: string[];
}

export interface PlatformConfig {
  layer: "platform";
  /** Optional wiki checkout override; unset means `<factory root>/wiki` (see `wikiRootFrom`).
   *  Left unset in the committed config so `KB_WIKI_ROOT` is reachable. */
  wikiRootDefault?: string;
  sources: SourceConfig[];
  rateLimits: {
    githubApiPerHour: number;
    developerDocsPerSecond: number;
    merchantDocsPerSecond: number;
    requestTimeoutMs: number;
    maxRedirects: number;
    maxBodyBytesDefault: number;
    maxBodyBytesBulk: number;
  };
  allowlistHosts: string[];
  hubs: HubScope[];
  synonyms: { enabled: boolean };
  ingest: { waveSize: number; batchSize: number };
  articleTokens: {
    min: number;
    max: number;
    longMax: number;
    longSourceWordThreshold: number;
    bandTolerance: number;
  };
  sizeLimits: {
    pageMaxBytes: number;
    hubMaxBytes: number;
    synonymsMaxBytes: number;
    generatedFileMaxBytes: number;
    committedFileMaxBytes: number;
    wikiPackageMaxBytes: number;
    /** Per-file cap for one `platform/guidelines/<v>/<file>.md`. */
    guidelineFileMaxBytes: number;
    /** Cap on a base file + one surface file combined — the per-agent read budget. */
    guidelinePairMaxBytes: number;
  };
  eval: { hitAt2CallsGate: number };
  /** Tier 0 code-check: a deterministic, node-only index over the installed Shopware
   *  packages, used to catch stale identifiers before a page is written.
   *
   *  `projectRoot` is resolved against the FACTORY root (`src/paths.ts`), not the working directory,
   *  and is the explicit escape hatch that may deliberately point outside the repo. Omitted, the
   *  vendor root is looked for under `.sources/shopware/<version>` instead — never by walking up
   *  from the cwd, which used to pick up whatever project the command happened to be started in.
   *  `projectRootNote` is documentation only.
   */
  codeCheck?: { enabled: boolean; batchSize: number; projectRoot?: string; projectRootNote?: string };
  /** Curated guideline synthesis — see `ingest/platform/guidelines.ts`. */
  guidelines?: GuidelinesConfig;
}

/** One curated `platform/guidelines/<version>/<file>` entry — identical list for every version. */
export interface GuidelineCuratedFile {
  /** Flat file name, e.g. "code-guidelines.md" — pattern /^[a-z]+(-[a-z]+)*-guidelines\.md$/. */
  file: string;
  /** The base file this surface file folds into, or null when `file` is itself a base file. */
  base: string | null;
  /** One-line scope description, used verbatim as writer-prompt framing. */
  scope: string;
  /**
   * Scheme-prefixed source inputs, resolved by `guidelines.ts`:
   *  - `docs:<path>` — path inside shopware/docs for the entry's version, read from the
   *    `developer:<version>` download (state + `.cache/src/developer/`); any dev page, not
   *    only `resources/guidelines/**` (globs allowed — the developer repository is downloaded
   *    whole, so any of its pages can be named here).
   *  - `merchant:<path>` — `platform/func/...` page key of the unversioned `merchant`
   *    download (state + `.cache/src/merchant/`), same for every version (globs allowed).
   *  - `wiki:<path>` — wiki-root-relative path, `{v}` substituted with the version
   *    (globs allowed).
   *  - `code:<package>/<path>` — package in core|storefront|administration, path relative
   *    to the package root: installed `vendor/shopware/<package>/` for the installed major,
   *    the pinned checkout's package dir otherwise (globs allowed).
   * An input that resolves to nothing while its source has already synced fails the item
   * (`guidelines.ts`); only a not-yet-synced source yields "skipped".
   */
  sourceInputs: string[];
  /**
   * Per-version replacement for `sourceInputs`, keyed by version (e.g. `"6.6"`). A version
   * listed here uses its own list verbatim instead of `sourceInputs`; every other version
   * falls back to `sourceInputs`. Needed where a major keys the same material under
   * different upstream paths, or where its pinned checkout lacks a `code:` input entirely.
   */
  sourceInputsByVersion?: Record<string, string[]>;
}

/** A version served by a pinned checkout instead of the installed `vendor/`. */
export interface GuidelineCodeCheckout {
  repo: string;         // e.g. "shopware/shopware"
  /** Exact tag, e.g. "v6.6.10.24". Pinned rather than resolved: `tagPattern`'s "latest matching
   *  tag" lookup makes a run's inputs depend on when it ran, and it is why a content gap in the 6.6
   *  checkout went unnoticed. */
  tag?: string;
  /** Commit the tag pointed at when it was pinned; `npm run setup` fetches by this and verifies. */
  commit?: string;
  /** Paths that MUST exist after checkout. `performGitCheckout` only ever counted files, so an
   *  empty sparse pattern was indistinguishable from success — this is what makes it loud. */
  expect?: string[];
  /** Floor on the file count, as a second signal that the sparse patterns delivered a real tree. */
  expectMinFiles?: number;
  /** Legacy: "latest tag matching this glob". Kept for the transition; `tag` wins when both are set. */
  tagPattern?: string;
}

export interface GuidelinesConfig {
  enabled: boolean;
  versions: string[]; // e.g. ["6.7", "6.6"]
  /** Versions NOT served by the installed `vendor/` — fetched into a pinned checkout instead. */
  codeCheckouts: Record<string, GuidelineCodeCheckout>;
  /** Identical curated-file list for every version in `versions`. */
  curatedFiles: GuidelineCuratedFile[];
}

export interface HubScope {
  slug: string;
  title: string;
  pathPrefixes?: string[];
  keywords?: string[];
}

/** `"skipped"` (guidelines only): every missing sourceInput is sync-pending — a `docs:`/`merchant:`
 *  input whose source has never been synced, or a `code:` input for a
 *  version whose code root hasn't been synced — reported to the operator, not a build failure
 *  (kb-factory-ingest-platform-docs, "Step 6 — Guidelines"). */
export type IngestState = "ok" | "failed" | "dirty" | "skipped" | undefined;

/**
 * Minimal per-page record (kb-sw-platform-refresh.md, "Ingestion state"). `path` is the
 * map key, never duplicated here. Everything cheaply re-derivable from `(path, config)` —
 * `sourceUrl` aside, kept because merchant's `seoUrl` isn't perfectly reversible from the
 * wiki path — is derived on demand instead of stored: `title` from the cached source text
 * or the article's own frontmatter, `sourcePath` from `(sourceId, hash)` via a
 * content-addressed cache filename (see `cacheFilePath`).
 *
 * `hash` absent means "known but not fetched": the developer-portal unpublished gate, or a
 * merchant page whose very first fetch has never succeeded. Both cases collapse into the
 * same "nothing to build from yet" signal used by every downstream phase — no separate
 * state enum needed. `removed` pages are deleted from the map outright at sync time
 * (Phase 2 detects removal by simple presence-diffing against the previous snapshot, so
 * nothing needs to persist across runs for it).
 */
export interface StatePageEntry {
  sourceUrl?: string;
  /** Current source content hash (dev: git blob SHA; merchant: sha256 of the converted
   *  markdown). Absent = not fetched (unpublished, or a first fetch that never succeeded). */
  hash?: string;
  /** The `hash` value the currently-ingested article on disk was generated from.
   *  `hash !== builtHash` (or `builtHash` absent) means the page needs (re)work; equal
   *  means the on-disk article is current. Absent entirely means never successfully built. */
  builtHash?: string;
  /** Page-prompt hash the current article was generated with (dirty on prompt changes). */
  promptHash?: string;
  /** Last ingest attempt for this path failed validation; the previous article (if any) is
   *  kept on disk. Drives `--retry-failed`. */
  failed?: true;
  /** Epoch seconds — last time `hash` changed. Informational/staleness only, not read by
   *  any phase's decision logic. */
  date: number;
  fetchError?: string;
  revisions?: MerchantRevision[];
  /** Set on the non-canonical sources of a cross-branch shared article (design spec,
   * "Shared articles"): the wiki path where the file is physically stored, when different
   * from this entry's own path (the map key). `wiki:build` uses this to point the older
   * version's index.md line at the newer version's file instead of a non-existent local copy. */
  sharedFrom?: string;
  /** `${coreVersion}+${vendorHash-8}` the article was last successfully code-checked against
   *  (codeCheck items only). A mismatch with the current index's value means the page needs
   *  (re)work even when `hash === builtHash` (design doc "State, dedupe, build, lint"). */
  codeHash?: string;
}

export interface MerchantRevision {
  range: string;
  swMin: string | null;
  swMax: string | null;
  current: boolean;
  url: string;
  contentHash?: string;
  versions?: string[];
}

export interface SourceState {
  headSha?: string | null;
  /** sha256 over this source's resolved ingestion config (exclude globs, version entry,
   *  wikiDir). The unchanged-HEAD fast path in `sync.ts` requires this to match too, so an
   *  edited `exclude` list takes effect on the next sync instead of waiting for an upstream
   *  commit. Absent on state written before this field existed — treated as a mismatch. */
  configHash?: string;
  lastSync: string | null;
  pages: Record<string, StatePageEntry>;
}

export interface HubStateEntry {
  slug: string;
  memberPaths: string[];
  hubHash?: string;
  hubState?: IngestState;
  hubPromptHash?: string;
  lastBuilt?: string | null;
  dirty?: boolean;
  /** Each member's `StatePageEntry.builtHash` as of this hub's last successful build — lets
   *  `isDirty` notice a member that recovers from `failed` to `ok` with new content, which
   *  otherwise shows `hash === builtHash` again and looks clean (hubs.ts, `isDirty`). */
  memberBuiltHashes?: Record<string, string>;
}

/** A guideline file's frontmatter `sources: [{url, hash}, ...]` list — the hub precedent
 *  (multiple source inputs, not a single `sourceUrl`/`sourceHash`). */
export type GuidelineSources = { url: string; hash: string }[];

/** One `platform/guidelines/<version>/<file>` entry's ingestion state (the dirty-check). Keyed by `${version}/${file}` in `GuidelinesState.files`. */
export interface GuidelineStateEntry {
  version: string;
  file: string;
  /** sha256 over the sorted `url:hash` of every resolved sourceInput. */
  inputsHash?: string;
  /** sha256 of `prompts/guideline.md` the file was last built with. */
  guidelinePromptHash?: string;
  /** `codeRootFor(...).codeVersion` the file was last checked against. */
  codeVersion?: string;
  /** sha256 of the built article on disk (mirrors HubStateEntry.hubHash). */
  builtHash?: string;
  guidelineState?: IngestState;
  lastBuilt?: string | null;
}

export interface GuidelinesState {
  files: Record<string, GuidelineStateEntry>;
}

export interface SynonymsState {
  concepts: Record<string, { keywords: string[]; paths: string[]; dirty?: boolean; failed?: boolean }>;
  synonymsPromptHash: string | null;
}

export interface IngestionState {
  sources: Record<string, SourceState>;
  hubs: Record<string, HubStateEntry>;
  synonyms: SynonymsState;
  guidelines: GuidelinesState;
  prompts: {
    pagePromptHash: string | null;
    hubPromptHash: string | null;
    synonymsPromptHash: string | null;
  };
  build: { lastBuilt: string | null };
}

/** Phase 3/4/6 work item — one member of a batch prepared for a kb-factory-ingest-writer agent. */
export interface WorkItem {
  path: string;
  sourcePath?: string;
  outputPath: string;
  frontmatter?: Record<string, unknown>;
  links?: string[];
  long?: boolean;
  [extra: string]: unknown;
}

export interface WorkBatch {
  batch: string;
  phase: "pages" | "hubs" | "synonyms" | "guidelines";
  prompt: string;
  promptHash: string;
  outline?: string;
  items: WorkItem[];
}

export type CliCommand = "sync" | "pages" | "hubs" | "build" | "synonyms" | "guidelines" | "lint" | "eval" | "clean";

export interface CliFlags {
  layer: string;
  /** `--wiki <path>`; unset means "fall through to config/env/default" (see `wikiRootFrom`). */
  wiki?: string;
  source?: string;
  prepare?: boolean;
  ingest?: boolean;
  retryFailed?: boolean;
  /** `wiki:pages --restamp-code-hash`: rewrite state's codeHash to the current code root. */
  restampCodeHash?: boolean;
  all?: boolean;
  enumerate?: "algolia" | "nav";
  withoutSynonyms?: boolean;
  /** Repeatable `--path <wikiPath>` filter on `pages --prepare` (design doc "Batching, CLI, config"). */
  path?: string[];
  /** `--version <v>` filter on `guidelines --prepare`/`--retry-failed`. */
  version?: string;
  /** Repeatable `--batch <file>` filter on `--ingest`: consume only these pending batch
   *  files instead of every pending batch for the phase (design doc "per-wave ingest"). */
  batches?: string[];
  /** `--reset-batches` on `--prepare`/`--retry-failed`: opt-in to the old destructive
   *  behaviour — wipe every pending batch file for the phase before writing new ones,
   *  instead of the default additive resume (see `writeBatches` in workitems.ts). */
  resetBatches?: boolean;
}
