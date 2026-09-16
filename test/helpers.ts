import { cpSync, mkdirSync, mkdtempSync, realpathSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import type { IngestionState } from "../ingest/shared/types.js";
import type { LintReport } from "../ingest/platform/lint.js";

export const here = dirname(fileURLToPath(import.meta.url));
export const packageDir = resolve(here, "..");
export const serverPath = resolve(packageDir, "dist", "server.js");

/**
 * A throwaway "surrounding project" for tests that spawn `.claude/hooks/kb-verify-scope-fence.sh`
 * as `CLAUDE_PROJECT_DIR`, with a real `vendor/shopware/`, `vendor/shopwareX/`, `composer.json`
 * and `docs/project-wiki/` on disk.
 *
 * Deliberately NOT derived from the real checkout layout (nested vs. standalone): callers also
 * pass `KB_FACTORY_ROOT=<packageDir>` explicitly to the hook, the same override
 * `kb-factory-setup` writes in real use (see `.claude/hooks/kb-verify-roots.sh`), so the hook
 * never has to probe for the factory root. That leaves this project directory free to be a
 * plain synthetic fixture — same shape, same assertions, on every machine and in every layout —
 * rather than something that has to coincide with `packageDir`'s real ancestry (which collapses
 * to `packageDir` itself in a standalone checkout, making "vendor/shopware is outside the
 * factory" unprovable).
 */
export function makeSyntheticProjectDir(): string {
  const dir = mkdtempSync(join(tmpdir(), "kb-verify-project-"));
  mkdirSync(join(dir, "vendor", "shopware"), { recursive: true });
  mkdirSync(join(dir, "vendor", "shopwareX"), { recursive: true });
  mkdirSync(join(dir, "docs", "project-wiki"), { recursive: true });
  mkdirSync(join(dir, "docs", "shopware-knowledge-bases", "developer"), { recursive: true });
  writeFileSync(join(dir, "composer.json"), "{}\n");
  return realpathSync(dir);
}

export const fixtureRoot = realpathSync(resolve(here, "fixtures", "wiki"));
export const docsFixtureRoot = realpathSync(resolve(here, "fixtures", "docs-root"));
export const projectWikiFixtureRoot = realpathSync(resolve(here, "fixtures", "project-wiki"));

/** Copies the project-wiki fixture into a fresh temp dir and returns its realpath. */
export function copyProjectWikiFixture(name = "kb-project-wiki-"): string {
  const dir = mkdtempSync(join(tmpdir(), name));
  cpSync(projectWikiFixtureRoot, dir, { recursive: true });
  return realpathSync(dir);
}

/** Copies the fixture wiki into a fresh temp dir and returns its realpath. */
export function copyFixture(name = "kb-wiki-"): string {
  const dir = mkdtempSync(join(tmpdir(), name));
  cpSync(fixtureRoot, dir, { recursive: true });
  return realpathSync(dir);
}

export interface Spawned {
  client: Client;
  stderr: string[];
  close(): Promise<void>;
}

/**
 * Spawns dist/server.js (or the bundle at `server`) over stdio with the given env and connects a client.
 * `cwd` pins the server's working directory — the last tier of project-wiki resolution
 * (`<cwd>/docs/project-wiki`), which must be exercised against a controlled directory rather than
 * against whatever directory the suite happens to be launched from.
 */
export async function spawnServer(env: Record<string, string> = {}, args: string[] = [], server: string = serverPath, cwd?: string): Promise<Spawned> {
  const client = new Client({ name: "test", version: "0.0.0" });
  const transport = new StdioClientTransport({
    command: process.execPath,
    args: [server, ...args],
    env: { ...cleanEnv(), ...env },
    cwd,
    stderr: "pipe",
  });
  const stderr: string[] = [];
  transport.stderr?.on("data", (d: Buffer) => stderr.push(d.toString()));
  await client.connect(transport);
  return { client, stderr, close: () => client.close() };
}

function cleanEnv(): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(process.env)) {
    // NODE_OPTIONS is dropped so a developer's --import/--require cannot preload modules into the server under test.
    const stripped = ["WIKI_ROOT", "KB_VERIFY", "KB_SOURCE_CACHE", "KB_CORPUS", "KB_CONFIG", "NODE_OPTIONS", "CLAUDE_PROJECT_DIR", "KB_PROJECT_WIKI"];
    if (v !== undefined && !stripped.includes(k)) out[k] = v;
  }
  return out;
}

export async function call(client: Client, name: string, args: Record<string, unknown> = {}): Promise<any> {
  return client.callTool({ name, arguments: args }) as Promise<any>;
}

/** A fresh temp dir (not realpath-resolved) with the given name prefix. */
export function tmpDir(prefix: string): string {
  return mkdtempSync(join(tmpdir(), prefix));
}

/** An empty platform ingestion state. */
export function emptyState(): IngestionState {
  return {
    sources: {},
    hubs: {},
    synonyms: { concepts: {}, synonymsPromptHash: null },
    guidelines: { files: {} },
    prompts: { pagePromptHash: null, hubPromptHash: null, synonymsPromptHash: null },
    build: { lastBuilt: null },
  };
}

/** An empty lint report. */
export function emptyReport(): LintReport {
  return { errors: [], warnings: [] };
}

/** `n` filler words for token-band fixtures. */
export function words(n: number): string {
  return Array.from({ length: n }, (_, i) => `word${i % 50}`).join(" ");
}

