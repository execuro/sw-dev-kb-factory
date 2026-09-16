/**
 * `.claude/hooks/kb-verify-scope-fence.sh` — exercised as a real subprocess with realistic
 * PreToolUse JSON on stdin, the same shape Claude Code feeds the hook. No network, no
 * mutation: the hook only ever reads its stdin and prints a decision.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";
import { existsSync, mkdtempSync, symlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { makeSyntheticProjectDir } from "./helpers.js";

const KB_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
// A synthetic surrounding project (vendor/, composer.json, docs/project-wiki/) — see helpers.ts.
// Independent of layout: KB_FACTORY_ROOT is passed explicitly below, so the hook never has to
// probe for the factory root from this project directory.
const PROJECT_ROOT = makeSyntheticProjectDir();
const HOOK = resolve(KB_ROOT, ".claude/hooks/kb-verify-scope-fence.sh");
const HAS_BASH = (() => {
  try {
    return spawnSync("bash", ["--version"], { encoding: "utf8" }).status === 0;
  } catch {
    return false;
  }
})();

interface CallOpts {
  agent_type?: string;
  tool_name: string;
  file_path?: string;
  path?: string;
  pattern?: string;
  path_env?: string; // override PATH for the no-JSON-tool fallback test
}

function call(opts: CallOpts): { denied: boolean; stdout: string } {
  const tool_input: Record<string, string> = {};
  if (opts.file_path !== undefined) tool_input.file_path = opts.file_path;
  if (opts.path !== undefined) tool_input.path = opts.path;
  if (opts.pattern !== undefined) tool_input.pattern = opts.pattern;
  const payload = JSON.stringify({
    tool_name: opts.tool_name,
    tool_input,
    agent_type: opts.agent_type,
    cwd: PROJECT_ROOT,
  });
  // KB_FACTORY_ROOT pins the factory root explicitly (as kb-factory-setup does in real use), so
  // the hook locates wiki/, ingest/, etc. from KB_ROOT rather than by probing under
  // PROJECT_ROOT, which is a synthetic fixture — see makeSyntheticProjectDir in ./helpers.ts.
  const env: NodeJS.ProcessEnv = { ...process.env, CLAUDE_PROJECT_DIR: PROJECT_ROOT, KB_FACTORY_ROOT: KB_ROOT };
  if (opts.path_env !== undefined) env.PATH = opts.path_env;
  const r = spawnSync("bash", [HOOK], { input: payload, encoding: "utf8", env, timeout: 10_000 });
  const stdout = r.stdout ?? "";
  return { denied: stdout.includes('"permissionDecision":"deny"'), stdout };
}

// `p()` resolves paths relative to the surrounding project (vendor/, composer.json, docs/...),
// which only exist when this package is nested inside such a host project. `kb()` resolves paths relative to the
// factory itself (ingest/, wiki/, ...), which is what the hook fences regardless of layout.
const p = (...segs: string[]) => resolve(PROJECT_ROOT, ...segs);
const kb = (...segs: string[]) => resolve(KB_ROOT, ...segs);

test("scope fence: kb-factory-ingest-writer reads", { skip: !HAS_BASH }, () => {
  assert.equal(call({ agent_type: "kb-factory-ingest-writer", tool_name: "Read", file_path: kb("ingest/platform/.cache/src/x") }).denied, false);
  assert.equal(call({ agent_type: "kb-factory-ingest-writer", tool_name: "Read", file_path: kb("wiki/platform/dev/6.7/a.md") }).denied, false);
  assert.equal(call({ agent_type: "kb-factory-ingest-writer", tool_name: "Read", file_path: kb("ingest/platform/prompts/page.md") }).denied, false);
  assert.equal(call({ agent_type: "kb-factory-ingest-writer", tool_name: "Read", file_path: kb("ingest/shared/page-outline.md") }).denied, false);
  assert.equal(call({ agent_type: "kb-factory-ingest-writer", tool_name: "Read", file_path: p("vendor/shopware/core/x") }).denied, true);
});

test("scope fence: kb-factory-ingest-writer writes — narrowed to .cache/out", { skip: !HAS_BASH }, () => {
  assert.equal(call({ agent_type: "kb-factory-ingest-writer", tool_name: "Write", file_path: kb("ingest/platform/.cache/out/pages/dev/6.7/a.md") }).denied, false);
  assert.equal(call({ agent_type: "kb-factory-ingest-writer", tool_name: "Write", file_path: kb("ingest/platform/.cache/work/pages/batch-001.json") }).denied, true);
  assert.equal(call({ agent_type: "kb-factory-ingest-writer", tool_name: "Write", file_path: kb("wiki/platform/x.md") }).denied, true);
});

test("scope fence: path normalization defeats \"..\" traversal on both Write and Read", { skip: !HAS_BASH }, () => {
  assert.equal(
    call({ agent_type: "kb-factory-ingest-writer", tool_name: "Write", file_path: kb("ingest/platform/.cache/out/../state/_shared.json") }).denied,
    true,
  );
  assert.equal(
    call({ agent_type: "kb-factory-ingest-writer", tool_name: "Read", file_path: kb(".cache/../../../../../../composer.json") }).denied,
    true,
  );
});

test("scope fence: kb-factory-ingest-code-writer and kb-factory-ingest-guideline-writer", { skip: !HAS_BASH }, () => {
  for (const agent of ["kb-factory-ingest-code-writer", "kb-factory-ingest-guideline-writer"]) {
    assert.equal(call({ agent_type: agent, tool_name: "Read", file_path: p("vendor/shopware/core/x") }).denied, false, `${agent} vendor/shopware read`);
    // A sibling directory that merely shares the "vendor/shopware" prefix must not match the root.
    assert.equal(call({ agent_type: agent, tool_name: "Read", file_path: p("vendor/shopwareX/a.php") }).denied, true, `${agent} vendor/shopwareX must not match vendor/shopware`);
    assert.equal(call({ agent_type: agent, tool_name: "Read", file_path: kb("ingest/platform/.cache/code/6.6/src/Core/x") }).denied, false, `${agent} pinned checkout read`);
    assert.equal(call({ agent_type: agent, tool_name: "Write", file_path: kb("ingest/platform/.cache/out/guidelines/6.7/x.md") }).denied, false, `${agent} write to .cache/out`);
    assert.equal(call({ agent_type: agent, tool_name: "Write", file_path: kb("ingest/platform/.cache/code/6.6/x") }).denied, true, `${agent} write to .cache/code denied`);
  }
});

test("scope fence: kb-factory-ingest-synonyms-writer", { skip: !HAS_BASH }, () => {
  assert.equal(call({ agent_type: "kb-factory-ingest-synonyms-writer", tool_name: "Read", file_path: kb("ingest/platform/.cache/work/synonyms/batch-001.json") }).denied, false);
  assert.equal(call({ agent_type: "kb-factory-ingest-synonyms-writer", tool_name: "Read", file_path: kb("wiki/platform/x") }).denied, true);
  assert.equal(call({ agent_type: "kb-factory-ingest-synonyms-writer", tool_name: "Write", file_path: kb("ingest/platform/.cache/out/synonyms/batch-001.md") }).denied, false);
});

test("scope fence: main thread and verify discover agents (regression guard)", { skip: !HAS_BASH }, () => {
  // Main thread: no agent_type at all.
  assert.equal(call({ tool_name: "Read", file_path: p("composer.json") }).denied, false);

  assert.equal(
    call({ agent_type: "kb-factory-verify-discover-fs-wiki", tool_name: "Read", file_path: kb("wiki/platform/x.md") }).denied,
    false,
  );
  assert.equal(
    call({ agent_type: "kb-factory-verify-discover-fs-wiki", tool_name: "Read", file_path: p("docs/shopware-knowledge-bases/developer/x.md") }).denied,
    true,
  );
});

/**
 * A PATH containing only symlinks to the handful of external commands the hook's no-JSON-tool
 * fallback actually needs (bash to run it, cat/grep/sed inside it) — never jq, never node,
 * regardless of what the host happens to have on /usr/bin or /bin. Deterministic on every
 * machine and every CI runner, unlike probing the real PATH for gaps.
 */
function makeBareShimPath(): string {
  const dir = mkdtempSync(join(tmpdir(), "kb-verify-bare-path-"));
  for (const bin of ["bash", "sh", "cat", "grep", "sed", "head"]) {
    const real = spawnSync("sh", ["-c", `command -v ${bin}`], { encoding: "utf8" }).stdout.trim();
    if (real) symlinkSync(real, resolve(dir, bin));
  }
  return dir;
}

test("scope fence: no jq/node on PATH falls back to grep/sed agent_type extraction", { skip: !HAS_BASH }, () => {
  const bareEnv = makeBareShimPath();
  // Main thread (no agent_type) is allowed even with no JSON interpreter available.
  assert.equal(call({ tool_name: "Read", file_path: p("composer.json"), path_env: bareEnv }).denied, false);
  // A fenced writer, with no way to evaluate its paths, fails closed.
  assert.equal(call({ agent_type: "kb-factory-ingest-writer", tool_name: "Read", file_path: p("composer.json"), path_env: bareEnv }).denied, true);
});

test("scope fence hook exists and is readable", () => {
  assert.equal(existsSync(HOOK), true);
});
