import { resolve } from "node:path";
import { readJson } from "./jsonio.js";
import { withOverrides } from "../../src/paths.js";
import type { CliFlags, PlatformConfig, SourceConfig } from "./types.js";

/** ingest/<layer> root — this file lives at ingest/shared/, so layer dirs are siblings. */
export function ingestLayerDir(layer: string): string {
  return resolve(import.meta.dirname, "..", layer);
}

/**
 * The wiki checkout every `wiki:*` command reads and writes.
 *
 * `--wiki` > config `wikiRootDefault` > `KB_WIKI_ROOT` > `<factory root>/wiki`, with relative values
 * resolved against the factory root rather than the working directory. Every `npm run wiki:*` runs
 * from the factory, so today's resolved value is unchanged; what changes is that the commands are
 * now correct when invoked from anywhere else, instead of resolving against whatever directory
 * the caller happened to be in.
 */
export function wikiRootFrom(flags: CliFlags, config?: PlatformConfig): string {
  return withOverrides({ wiki: flags.wiki ?? config?.wikiRootDefault }).wikiRoot();
}

export function loadPlatformConfig(): PlatformConfig {
  const path = resolve(ingestLayerDir("platform"), "config.json");
  return readJson<PlatformConfig>(path);
}

/** State-key(s) a config source maps to: version-split sources (e.g. `developer`) get one
 *  `${id}:${version}` key per active version-with-`main`; all others use the bare source id
 *  (matches the target-key construction in sync.ts/build.ts/state.ts). */
export function sourceStateKeys(source: SourceConfig): string[] {
  if (source.versions?.some((v) => v.main)) {
    return source.versions.filter((v) => v.active).map((v) => `${source.id}:${v.version}`);
  }
  return [source.id];
}

/** Whether a state key's own `SourceState` carries `headSha` (dev-shaped) vs not (merchant-shaped). */
export function sourceStateHasHeadSha(source: SourceConfig): boolean {
  return !!source.versions?.some((v) => v.main);
}
