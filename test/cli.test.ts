/**
 * `ingest/shared/cli.ts` dispatcher — exercised as a real subprocess (not a static
 * import) so its type-only `CliFlags` module augmentation (declared by `clean.ts`) and
 * its dynamic `import()` module map are never pulled into this project's own `tsc`
 * program graph. No network; `clean` is always invoked without `--yes`, so it only ever
 * dry-runs (clean.ts: "without --yes this ALWAYS behaves as a dry run").
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const CLI = resolve(ROOT, "ingest/shared/cli.ts");

function runCli(args: string[]): { status: number | null; stdout: string; stderr: string } {
  const r = spawnSync(process.execPath, ["--import", "tsx", CLI, ...args], { cwd: ROOT, encoding: "utf8", timeout: 30_000 });
  return { status: r.status, stdout: r.stdout, stderr: r.stderr };
}

test("cli: an unknown flag is an error, exit 1, naming the flag", () => {
  const { status, stderr } = runCli(["sync", "--layer", "platform", "--bogus-flag"]);
  assert.equal(status, 1);
  assert.match(stderr, /unknown argument\(s\).*--bogus-flag/);
});

test("cli: an unknown command is still an error, exit 1 (unaffected by the flag-parsing change)", () => {
  const { status, stderr } = runCli(["not-a-command"]);
  assert.equal(status, 1);
  assert.match(stderr, /unknown command/);
});

test("cli: every flag wiki:clean uses (--scope --source --yes --dry-run) is still accepted, not rejected as unknown", () => {
  const { status, stderr, stdout } = runCli(["clean", "--layer", "platform", "--scope", "all", "--source", "all", "--dry-run"]);
  assert.doesNotMatch(stderr, /unknown argument/);
  assert.equal(status, 0);
  assert.match(stdout, /"cmd":"clean"/);
  assert.match(stderr, /DRY RUN/);
});

test("cli: --yes is accepted as a flag (still refused to mutate here only via --dry-run winning) — no unknown-argument error", () => {
  // Passing --yes together with --dry-run keeps clean.ts's own dry-run guarantee
  // (`mutate = flags.yes === true && flags.dryRun !== true`) — this only checks the
  // flag itself parses, not that anything gets deleted.
  const { stderr } = runCli(["clean", "--layer", "platform", "--scope", "cache", "--source", "all", "--yes", "--dry-run"]);
  assert.doesNotMatch(stderr, /unknown argument/);
});

test("cli: --path, --version and --all (used by pages/guidelines --prepare) are still accepted", () => {
  // No --prepare/--ingest/--retry-failed given: pages.run() reports its own usage error
  // without writing anything — this only checks the flags themselves parse.
  const { stderr } = runCli(["pages", "--layer", "platform", "--path", "platform/dev/6.7/a.md", "--all", "--version", "6.7"]);
  assert.doesNotMatch(stderr, /unknown argument/);
  assert.match(stderr, /one of --prepare, --ingest, --retry-failed, --restamp-code-hash is required/);
});

test("cli: repeated --batch flags are accepted, not rejected as unknown", () => {
  const { stderr } = runCli(["pages", "--layer", "platform", "--batch", "batch-01.json", "--batch", "batch-02.json"]);
  assert.doesNotMatch(stderr, /unknown argument/);
  assert.match(stderr, /one of --prepare, --ingest, --retry-failed, --restamp-code-hash is required/);
});
