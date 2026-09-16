/**
 * `.claude/hooks/kb-verify-scope-fence.sh` — the option-isolation fence.
 *
 * The fence is what makes kb-factory-verify's headline claim true by construction: each option
 * physically cannot read another option's corpus, so there is no violation to score. Beyond
 * `test/scope-fence-hook.test.ts`'s payload-parsing cases, the hook's roots themselves need a
 * guard — they were rewritten wholesale when path resolution became package-anchored.
 *
 * This runs the real hook as a subprocess with realistic PreToolUse JSON, and costs no tokens — the
 * alternative, a 100-case verify run per option, costs real money to assert the same thing.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { makeSyntheticProjectDir, packageDir } from "./helpers.js";

/** This package's own hooks, under its own `.claude/hooks/` — not the host project's. */
const HOOK_PATH = resolve(packageDir, ".claude/hooks/kb-verify-scope-fence.sh");
const HOOK = existsSync(HOOK_PATH) ? HOOK_PATH : undefined;

/** A synthetic surrounding project (vendor/, composer.json, docs/project-wiki/) — see helpers.ts. */
const PROJECT = makeSyntheticProjectDir();
const KB = resolve(packageDir);

const HAS_SH = (() => {
  try {
    return spawnSync("sh", ["-c", "exit 0"]).status === 0;
  } catch {
    return false;
  }
})();

interface Call {
  agent_type?: string;
  tool_name: string;
  file_path?: string;
  path?: string;
  command?: string;
}

function call(opts: Call): { denied: boolean; reason: string } {
  const tool_input: Record<string, string> = {};
  if (opts.file_path !== undefined) tool_input.file_path = opts.file_path;
  if (opts.path !== undefined) tool_input.path = opts.path;
  if (opts.command !== undefined) tool_input.command = opts.command;
  const payload = JSON.stringify({
    tool_name: opts.tool_name,
    tool_input,
    ...(opts.agent_type === undefined ? {} : { agent_type: opts.agent_type }),
    cwd: PROJECT,
  });
  const res = spawnSync("sh", [HOOK!], {
    input: payload,
    encoding: "utf8",
    // KB_FACTORY_ROOT pins the factory root explicitly (as kb-factory-setup does in real use),
    // so the hook locates wiki/, ingest/, etc. from KB rather than by probing under PROJECT,
    // which is a synthetic fixture — see makeSyntheticProjectDir in ./helpers.ts.
    env: { ...process.env, CLAUDE_PROJECT_DIR: PROJECT, KB_FACTORY_ROOT: KB },
  });
  const out = res.stdout ?? "";
  return { denied: out.includes('"permissionDecision":"deny"'), reason: out };
}

const skip = !HAS_SH || HOOK === undefined ? { skip: "needs sh and the hook on disk" } : {};

test("fs-wiki: the wiki is readable, every other corpus is not", skip, () => {
  const agent = "kb-discover-fs-wiki-batch-1";
  assert.equal(call({ agent_type: agent, tool_name: "Read", file_path: `${KB}/wiki/platform/index.md` }).denied, false);
  // The docs corpus moved under `.sources/` when roots became package-anchored, and the fence has
  // to keep denying it at the new path.
  assert.equal(call({ agent_type: agent, tool_name: "Read", file_path: `${KB}/.sources/docs/developer/index.md` }).denied, true);
  assert.equal(call({ agent_type: agent, tool_name: "Read", file_path: `${PROJECT}/docs/project-wiki/index.md` }).denied, true);
  assert.equal(call({ agent_type: agent, tool_name: "Read", file_path: `${PROJECT}/composer.json` }).denied, true);
});

test("fs-docs: the mirror image of fs-wiki", skip, () => {
  const agent = "kb-discover-fs-docs-batch-1";
  assert.equal(call({ agent_type: agent, tool_name: "Read", file_path: `${KB}/.sources/docs/developer/index.md` }).denied, false);
  assert.equal(call({ agent_type: agent, tool_name: "Read", file_path: `${KB}/wiki/platform/index.md` }).denied, true);
});

test("vanilla is defined by exclusion: everything but the corpora under test", skip, () => {
  const agent = "kb-discover-vanilla-batch-1";
  assert.equal(call({ agent_type: agent, tool_name: "Read", file_path: `${PROJECT}/composer.json` }).denied, false);
  assert.equal(call({ agent_type: agent, tool_name: "Read", file_path: `${KB}/wiki/platform/index.md` }).denied, true);
  assert.equal(call({ agent_type: agent, tool_name: "Read", file_path: `${KB}/.sources/docs/developer/index.md` }).denied, true);
  assert.equal(call({ agent_type: agent, tool_name: "Read", file_path: `${PROJECT}/docs/project-wiki/x.md` }).denied, true);
});

test("ingest writers: read their own scope, write only .cache/out", skip, () => {
  const plain = "kb-factory-ingest-writer";
  assert.equal(call({ agent_type: plain, tool_name: "Read", file_path: `${KB}/ingest/platform/.cache/src/x.md` }).denied, false);
  assert.equal(call({ agent_type: plain, tool_name: "Read", file_path: `${PROJECT}/composer.json` }).denied, true);
  assert.equal(call({ agent_type: plain, tool_name: "Write", file_path: `${KB}/ingest/platform/.cache/out/p.md` }).denied, false);
  // .cache/work holds the batch file and .cache/src the fetched source: readable, never writable.
  assert.equal(call({ agent_type: plain, tool_name: "Write", file_path: `${KB}/ingest/platform/.cache/work/b.json` }).denied, true);
  assert.equal(call({ agent_type: plain, tool_name: "Write", file_path: `${KB}/wiki/platform/dev/6.7/x.md` }).denied, true);

  // The code writer additionally reaches Shopware source — now including the pinned .sources tree.
  const code = "kb-factory-ingest-code-writer";
  assert.equal(call({ agent_type: code, tool_name: "Read", file_path: `${KB}/.sources/shopware/6.7/src/Core/x.php` }).denied, false);
  assert.equal(call({ agent_type: code, tool_name: "Read", file_path: `${PROJECT}/vendor/shopware/core/x.php` }).denied, false);
  assert.equal(call({ agent_type: plain, tool_name: "Read", file_path: `${PROJECT}/vendor/shopware/core/x.php` }).denied, true, "the plain writer never handles codeCheck items");
});

test("a pathless Grep is denied: it would search the whole repository", skip, () => {
  assert.equal(call({ agent_type: "kb-discover-fs-wiki-batch-1", tool_name: "Grep", command: "" }).denied, true);
  assert.equal(call({ agent_type: "kb-discover-fs-wiki-batch-1", tool_name: "Grep", path: `${KB}/wiki/platform` }).denied, false);
});

test("traversal out of an allowed root is denied after normalisation", skip, () => {
  assert.equal(
    call({ agent_type: "kb-factory-ingest-writer", tool_name: "Write", file_path: `${KB}/ingest/platform/.cache/out/../state/_shared.json` }).denied,
    true,
  );
});

test("the main thread and unfenced agents are never fenced", skip, () => {
  assert.equal(call({ tool_name: "Read", file_path: `${PROJECT}/composer.json` }).denied, false);
  assert.equal(call({ agent_type: "kb-factory-verify-scorer", tool_name: "Read", file_path: `${PROJECT}/composer.json` }).denied, false);
});

test("every agent the roots table fences is also known to is_fenced_agent", skip, () => {
  // The two lists used to be hand-maintained copies. If they drift, the no-JSON fallback fails OPEN
  // for the missing agent - precisely when the fence cannot be evaluated - so this is the invariant
  // worth asserting rather than trusting a comment.
  for (const agent of [
    "kb-discover-fs-wiki-batch-1",
    "kb-discover-fs-docs-batch-1",
    "kb-discover-vanilla-batch-1",
    "kb-factory-ingest-writer",
    "kb-factory-ingest-code-writer",
    "kb-factory-ingest-guideline-writer",
    "kb-factory-ingest-synonyms-writer",
  ]) {
    const r = call({ agent_type: agent, tool_name: "Read", file_path: `${PROJECT}/composer.json` });
    assert.doesNotMatch(r.reason, /have drifted/, `${agent} is fenced by the roots table but unknown to is_fenced_agent`);
  }
});
