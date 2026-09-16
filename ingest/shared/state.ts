import { resolve } from "node:path";
import { readJsonIfExists, writeJson } from "./jsonio.js";
import { ingestLayerDir, loadPlatformConfig, sourceStateHasHeadSha, sourceStateKeys } from "./config.js";
import type { IngestionState, SourceState } from "./types.js";

/**
 * State is split one file per source key under `ingest/platform/state/`, plus one
 * `_shared.json` for what genuinely spans sources (hubs, synonyms, prompt hashes, build) —
 * kb-sw-platform-refresh.md, "Ingestion state". Every `ingest/platform/*.ts` module still
 * only ever calls `loadState()`/`saveState()`, which keep presenting the same merged
 * `IngestionState` shape; only this file's own I/O changed, so no other call site needed
 * to change for the split itself.
 */
function stateDir(): string {
  return resolve(ingestLayerDir("platform"), "state");
}

function sourceStatePath(key: string): string {
  return resolve(stateDir(), ...key.split(":")) + ".json";
}

/** One source key's state file (`developer:6.7`, `merchant`), or `undefined` when never synced. */
export function loadSourceState(key: string): SourceState | undefined {
  return readJsonIfExists<SourceState>(sourceStatePath(key));
}

function sharedStatePath(): string {
  return resolve(stateDir(), "_shared.json");
}

type SharedState = Pick<IngestionState, "hubs" | "synonyms" | "guidelines" | "prompts" | "build">;

const EMPTY_SHARED: SharedState = {
  hubs: {},
  synonyms: { concepts: {}, synonymsPromptHash: null },
  guidelines: { files: {} },
  prompts: { pagePromptHash: null, hubPromptHash: null, synonymsPromptHash: null },
  build: { lastBuilt: null },
};

export function loadState(): IngestionState {
  const config = loadPlatformConfig();
  const sources: Record<string, SourceState> = {};
  for (const source of config.sources) {
    const emptySource: SourceState = sourceStateHasHeadSha(source) ? { headSha: null, lastSync: null, pages: {} } : { lastSync: null, pages: {} };
    for (const key of sourceStateKeys(source)) {
      sources[key] = readJsonIfExists<SourceState>(sourceStatePath(key)) ?? emptySource;
    }
  }
  // Spread over EMPTY_SHARED (not a bare `?? EMPTY_SHARED`) so a `_shared.json` committed
  // before a new top-level key existed (e.g. `guidelines`) still gets that key's default
  // instead of `undefined` — additive state fields must never need a one-off migration.
  const shared = { ...EMPTY_SHARED, ...(readJsonIfExists<Partial<SharedState>>(sharedStatePath()) ?? {}) };
  return { sources, ...shared };
}

/** Writes every source's file plus the shared file. Deterministic serialization
 *  (`writeJson`'s sorted keys) means re-writing an unchanged source produces byte-identical
 *  output — so writing all of them unconditionally costs nothing in git history while still
 *  keeping the size-per-file bound and the diff-locality benefit of the split. */
export function saveState(state: IngestionState): void {
  const config = loadPlatformConfig();
  for (const source of config.sources) {
    for (const key of sourceStateKeys(source)) {
      const value = state.sources[key];
      if (value) writeJson(sourceStatePath(key), value);
    }
  }
  const { hubs, synonyms, guidelines, prompts, build } = state;
  writeJson(sharedStatePath(), { hubs, synonyms, guidelines, prompts, build } satisfies SharedState);
}
