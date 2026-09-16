#!/usr/bin/env node
/**
 * Dispatcher for every `npm run wiki:<verb>` script (refresh spec, "Setup (ingestion
 * tooling)" step 4 / "CLI output contract"). Deterministic only: no LLM calls here —
 * `pages`/`hubs`/`synonyms --prepare` write work items for Claude Code sub-agents that
 * the `kb-factory-ingest-platform-docs` skill launches; `--ingest` validates their output.
 */
import type { CliCommand, CliFlags } from "./types.js";

const COMMANDS: CliCommand[] = ["sync", "pages", "hubs", "build", "synonyms", "guidelines", "lint", "eval", "clean"];

function parseFlags(argv: string[]): { flags: CliFlags; unknown: string[] } {
  const flags: CliFlags = { layer: "" };
  const unknown: string[] = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    switch (a) {
      case "--layer":
        flags.layer = argv[++i] ?? "";
        break;
      case "--wiki":
        flags.wiki = argv[++i];
        break;
      case "--source":
        flags.source = argv[++i];
        break;
      case "--prepare":
        flags.prepare = true;
        break;
      case "--ingest":
        flags.ingest = true;
        break;
      case "--retry-failed":
        flags.retryFailed = true;
        break;
      case "--restamp-code-hash":
        flags.restampCodeHash = true;
        break;
      case "--all":
        flags.all = true;
        break;
      case "--enumerate":
        flags.enumerate = argv[++i] as "algolia" | "nav";
        break;
      case "--without-synonyms":
        flags.withoutSynonyms = true;
        break;
      case "--path":
        (flags.path ??= []).push(argv[++i] ?? "");
        break;
      case "--version":
        flags.version = argv[++i];
        break;
      case "--scope":
        flags.scope = argv[++i];
        break;
      case "--yes":
        flags.yes = true;
        break;
      case "--dry-run":
        flags.dryRun = true;
        break;
      case "--batch":
        (flags.batches ??= []).push(argv[++i] ?? "");
        break;
      case "--reset-batches":
        flags.resetBatches = true;
        break;
      default:
        unknown.push(a);
    }
  }
  return { flags, unknown };
}

async function main(): Promise<void> {
  const [command, ...rest] = process.argv.slice(2);
  if (!COMMANDS.includes(command as CliCommand)) {
    process.stderr.write(`wiki:cli: unknown command "${command}". Valid commands: ${COMMANDS.join(", ")}\n`);
    process.exit(1);
  }
  const { flags, unknown } = parseFlags(rest);
  if (unknown.length) {
    process.stderr.write(`wiki:cli: unknown argument(s): ${unknown.join(", ")}\n`);
    process.exit(1);
  }
  if (flags.layer !== "platform") {
    process.stderr.write(`wiki:cli: --layer is required and must be "platform" (only implemented layer), got ${JSON.stringify(flags.layer)}\n`);
    process.exit(1);
  }

  const modules: Record<CliCommand, () => Promise<{ run: (flags: CliFlags) => Promise<number> }>> = {
    sync: () => import("../platform/sync.js"),
    pages: () => import("../platform/pages.js"),
    hubs: () => import("../platform/hubs.js"),
    build: () => import("../platform/build.js"),
    synonyms: () => import("../platform/synonyms.js"),
    guidelines: () => import("../platform/guidelines.js"),
    lint: () => import("../platform/lint.js"),
    eval: () => import("../platform/eval.js"),
    clean: () => import("../platform/clean.js"),
  };

  const mod = await modules[command as CliCommand]();
  const code = await mod.run(flags);
  process.exit(code);
}

main().catch((err) => {
  process.stderr.write(`wiki:cli: fatal: ${err instanceof Error ? err.stack ?? err.message : String(err)}\n`);
  process.exit(2);
});
