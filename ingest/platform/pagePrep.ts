/**
 * Deterministic pre-pass shared by `wiki:pages --prepare` and `--retry-failed`:
 * title/long-flag derivation, developer cross-branch dedupe grouping, merchant
 * version derivation, and link resolution (refresh spec, Phase 3 "Prepare").
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { ingestLayerDir } from "../shared/config.js";
import { cacheDirs } from "../shared/workitems.js";
import { cacheFilePath } from "../shared/fetchLimited.js";
import type { PlatformConfig, StatePageEntry } from "../shared/types.js";

export interface DevPageRef {
  sourceId: string;
  version: string;
  wikiDir: string;
  wikiPath: string;
  relPath: string;
  entry: StatePageEntry;
}

const VERSION_ORDER = ["6.5", "6.6", "6.7"];

export function deriveTitle(sourceText: string | undefined, fallbackPath: string): string {
  if (sourceText) {
    const navTitle = /^nav:\s*\n(?:.*\n)*?\s*title:\s*(.+)$/m.exec(sourceText);
    if (navTitle) return navTitle[1].trim().replace(/^["']|["']$/g, "");
    const h1 = /^#\s+(.+)$/m.exec(sourceText);
    if (h1) return h1[1].trim();
  }
  const base = fallbackPath.split("/").pop() ?? fallbackPath;
  return base.replace(/\.md$/, "").replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function isLong(text: string, threshold: number): boolean {
  return wordCount(text) > threshold;
}

/** Extracts `[text](relative.md)` links in source text and resolves them against the source's own wikiDir. */
export function resolveLinks(sourceText: string, sourceRelPath: string, wikiDir: string): string[] {
  const out = new Set<string>();
  const dir = sourceRelPath.includes("/") ? sourceRelPath.slice(0, sourceRelPath.lastIndexOf("/")) : "";
  for (const m of sourceText.matchAll(/\]\(([^)\s]+\.md)(?:#[^)]*)?\)/g)) {
    const raw = m[1];
    if (/^https?:\/\//.test(raw)) continue;
    const joined = joinRelative(dir, raw);
    if (!joined) continue;
    const wikiRel = joined.replace(/(^|\/)index\.md$/, "$1_index.md");
    out.add(`${wikiDir}/${wikiRel}`);
  }
  return [...out];
}

function joinRelative(dir: string, rel: string): string | undefined {
  const parts = (dir ? dir.split("/") : []).concat(rel.split("/"));
  const out: string[] = [];
  for (const p of parts) {
    if (p === "." || p === "") continue;
    if (p === "..") out.pop();
    else out.push(p);
  }
  return out.length ? out.join("/") : undefined;
}

/**
 * All wiki paths already successfully built (across dev + merchant sources) — the
 * deterministic "known good link target" set used to mechanically pre-populate
 * `relatedPages` (design spec, "Page frontmatter") without inventing paths. A stronger
 * signal exists in `ingest/platform/synonyms.ts`'s keyword-cluster (`clusterConcepts`),
 * but that function isn't exported for reuse here (owned by the hub-automation work);
 * this uses the outbound-link signal already computed by `resolveLinks` instead.
 */
export function knownBuiltPaths(state: { sources: Record<string, { pages: Record<string, StatePageEntry> }> }): Set<string> {
  const paths = new Set<string>();
  for (const source of Object.values(state.sources)) {
    for (const [path, entry] of Object.entries(source.pages)) {
      if (entry.builtHash === undefined) continue;
      paths.add(entry.sharedFrom ?? path);
    }
  }
  return paths;
}

/** Caps a page's own resolved outbound links to the ones that already exist in the wiki, for the `relatedPages` prefill. */
export function pickRelatedPages(links: string[], knownPaths: Set<string>, selfPath: string, cap = 4): string[] {
  return links.filter((l) => l !== selfPath && knownPaths.has(l)).slice(0, cap);
}

/**
 * Filters every item's `links[]` down to targets a reader can actually resolve: a page
 * already built (`knownPaths`) or a page this same `--prepare` run is about to (re)build
 * (one of `items`' own paths) — a writer may only cite a listed link, never an invented or
 * dangling one (refresh spec Phase 3 "Prepare"). Mutates each item's `links` array in
 * place; returns the total number of entries dropped, for the prepare summary log.
 */
export function filterPlannedLinks(items: { path: string; links?: string[] }[], knownPaths: Set<string>): number {
  const planned = new Set(items.map((i) => i.path));
  let dropped = 0;
  for (const item of items) {
    if (!item.links?.length) continue;
    const kept = item.links.filter((l) => knownPaths.has(l) || planned.has(l));
    dropped += item.links.length - kept.length;
    item.links = kept;
  }
  return dropped;
}

export interface DevGroup {
  key: string;
  refs: DevPageRef[]; // sorted newest-version-first
}

/**
 * Groups developer pages sharing the same relative source path + content hash across active
 * sources (cross-branch dedupe). `installedMajor` (the codeCheck version, e.g. "6.7") never
 * joins a group with another version when given: an installed-major page rewritten to code
 * truth would give an older-version reader the wrong answer (design doc "State, dedupe,
 * build, lint"), so each of its refs forms its own single-ref group.
 */
export function groupSharedDevPages(
  config: PlatformConfig,
  state: { sources: Record<string, { pages: Record<string, StatePageEntry> }> },
  installedMajor?: string,
): DevGroup[] {
  const refs: DevPageRef[] = [];
  for (const source of config.sources) {
    if (!source.docType.includes("developer") || !source.active || !source.versions) continue;
    for (const v of source.versions.filter((v) => v.active)) {
      const sourceId = `${source.id}:${v.version}`;
      const wikiDir = `${source.wikiDir}/${v.version}`;
      const sourceState = state.sources[sourceId];
      if (!sourceState) continue;
      for (const [wikiPath, entry] of Object.entries(sourceState.pages)) {
        if (entry.hash === undefined) continue; // unpublished / never fetched — nothing to build from
        const relPath = wikiPath.slice(wikiDir.length + 1);
        refs.push({ sourceId, version: v.version, wikiDir, wikiPath, relPath, entry });
      }
    }
  }
  const groups = new Map<string, DevPageRef[]>();
  for (const ref of refs) {
    const isolate = installedMajor !== undefined && ref.version === installedMajor;
    const key = isolate ? `${ref.relPath}::${ref.entry.hash}::isolated:${ref.wikiPath}` : `${ref.relPath}::${ref.entry.hash}`;
    const arr = groups.get(key) ?? [];
    arr.push(ref);
    groups.set(key, arr);
  }
  return [...groups.entries()].map(([key, groupRefs]) => ({
    key,
    refs: groupRefs.sort((a, b) => VERSION_ORDER.indexOf(b.version) - VERSION_ORDER.indexOf(a.version)),
  }));
}

/** Intersects a merchant revision's swMin/swMax range with the three known majors. */
export function merchantVersionsForRevision(swMin: string | null, swMax: string | null): string[] {
  if (!swMin && !swMax) return [...VERSION_ORDER];
  const major = (v: string) => v.split(".").slice(0, 2).join(".");
  const minMajor = swMin ? major(swMin) : VERSION_ORDER[0];
  const maxMajor = swMax ? major(swMax) : VERSION_ORDER[VERSION_ORDER.length - 1];
  const iMin = Math.max(0, VERSION_ORDER.indexOf(minMajor) === -1 ? 0 : VERSION_ORDER.indexOf(minMajor));
  const iMax = VERSION_ORDER.indexOf(maxMajor) === -1 ? VERSION_ORDER.length - 1 : VERSION_ORDER.indexOf(maxMajor);
  return VERSION_ORDER.slice(Math.min(iMin, iMax), Math.max(iMin, iMax) + 1);
}

export function readSourceText(sourcePath: string | undefined): string | undefined {
  if (!sourcePath) return undefined;
  try {
    return readFileSync(sourcePath, "utf8");
  } catch {
    return undefined;
  }
}

export function layerDir(): string {
  return ingestLayerDir("platform");
}

/** Cache path is derivable from `(sourceId, hash)` — never stored on the state entry itself. */
export function devSourcePath(sourceId: string, hash: string): string {
  return cacheFilePath(resolve(cacheDirs(layerDir()).srcDir, ...sourceId.split(":")), hash);
}

export function promptsDir(): string {
  return resolve(layerDir(), "prompts");
}
