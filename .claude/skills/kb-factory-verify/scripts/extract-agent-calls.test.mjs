// node --test .claude/skills/kb-factory-verify/scripts/extract-agent-calls.test.mjs
// Guards the case attribution of extract-agent-calls.mjs against the three transcript patterns
// that used to manufacture "fabricated provenance" verdicts: a page read for one case and cited by
// a later one (reuse), a failed and later retried report Write, and a failed retrieval attempt.

import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { foldUsage, extractBatch, findTranscripts } from "./extract-agent-calls.mjs";

const SCRIPT = new URL("./extract-agent-calls.mjs", import.meta.url).pathname;
const FIXTURE_DIR = new URL("./fixtures", import.meta.url).pathname;
const RD = "mcp__ShopwareDevKnowledgeBase__read_doc";
const OUT = "/tmp/run/raw/mcp-wiki/";

let seq = 0;
const lines = [];
function call(name, input, result, isError = false) {
  const id = `t${++seq}`;
  const ts = new Date(1_700_000_000_000 + seq * 1000).toISOString();
  lines.push(JSON.stringify({ type: "assistant", timestamp: ts, message: { content: [{ type: "tool_use", id, name, input }], usage: { input_tokens: 1, output_tokens: 1 } } }));
  const block = { type: "tool_result", tool_use_id: id, content: result };
  if (isError) block.is_error = true;
  lines.push(JSON.stringify({ type: "user", timestamp: ts, message: { content: [block] }, toolUseResult: isError ? `Error: ${result}` : result }));
}
const report = (cites) => JSON.stringify({ citations: cites, toolCallLog: [] });
const write = (id, cites, isError = false) =>
  call("Write", { file_path: `${OUT}${id}.json`, content: report(cites) }, isError ? "temporarily unavailable" : "File created", isError);

call(RD, { path: "platform/a.md" }, "# a");                                   // 1  dev-01
write("dev-01", ["platform/a.md:1-9"]);                                       // 2
call(RD, { path: "platform/b.md" }, "# b");                                   // 3  dev-02
write("dev-02", ["platform/b.md:1-9"], true);                                 // 4  failed Write
call(RD, { path: "platform/c.md" }, "# c");                                   // 5  dev-03 (look-ahead)
call("WebFetch", { url: "https://x.test/platform/d.md" }, "# d");            // 6  dev-04 (look-ahead, URL citation)
call(RD, { path: "platform/x.md" }, "temporarily unavailable", true);         // 7  failed retrieval
write("dev-02", ["platform/b.md:1-9"]);                                       // 8  retried Write
write("dev-03", ["platform/c.md:1-9", "platform/a.md:3-4", "platform/ghost.md:1"]); // 9
write("dev-04", [{ url: "https://x.test/platform/d.md", quote: "d" }]);      // 10

test("attribution survives reuse, retried writes and failed attempts", () => {
  const dir = mkdtempSync(path.join(tmpdir(), "kb-extract-"));
  const transcript = path.join(dir, "agent.jsonl");
  writeFileSync(transcript, lines.join("\n") + "\n");
  const out = JSON.parse(execFileSync(process.execPath, [SCRIPT, "--transcript", transcript], { encoding: "utf8" }));

  assert.equal(out.groundTruth, true);
  assert.deepEqual(out.calls.map((c) => c.caseId), ["dev-01", "dev-01", "dev-02", "dev-02", "dev-03", "dev-04", "dev-03", "dev-02", "dev-03", "dev-04"]);
  assert.equal(out.calls[5].attribution, "citation"); // seq 6 re-stamped to dev-04
  assert.equal(out.calls[6].isError, true);
  assert.equal(out.totals.retrievalCalls, 4);
  assert.equal(out.totals.failedAttempts, 2);
  assert.equal(out.totals.deadEndCalls, 0);

  const p = out.perCase;
  assert.deepEqual(p["dev-01"], { seqs: [1, 2], retrievalCalls: 1, failedAttempts: 0, reused: [], unbackedCitations: [] });
  assert.deepEqual(p["dev-02"], { seqs: [3, 4, 8], retrievalCalls: 1, failedAttempts: 1, reused: [], unbackedCitations: [] });
  assert.deepEqual(p["dev-03"], {
    seqs: [5, 7, 9], retrievalCalls: 1, failedAttempts: 1,
    reused: [{ path: "platform/a.md", seq: 1, fromCase: "dev-01" }],
    unbackedCitations: ["platform/ghost.md"],
  });
  assert.deepEqual(p["dev-04"], { seqs: [6, 10], retrievalCalls: 1, failedAttempts: 0, reused: [], unbackedCitations: [] });
});

// --- guideline `#anchor` citations (rule-* on mcp-wiki: the merged view's tag-line path) ---

test("citedPaths strips a trailing #anchor the same way it strips :N-M, so an anchor citation is backed", () => {
  let s = 0;
  const gLines = [];
  function gCall(name, input, result, isError = false) {
    const id = `g${++s}`;
    const ts = new Date(1_700_100_000_000 + s * 1000).toISOString();
    gLines.push(JSON.stringify({ type: "assistant", timestamp: ts, message: { content: [{ type: "tool_use", id, name, input }], usage: { input_tokens: 1, output_tokens: 1 } } }));
    const block = { type: "tool_result", tool_use_id: id, content: result };
    if (isError) block.is_error = true;
    gLines.push(JSON.stringify({ type: "user", timestamp: ts, message: { content: [block] }, toolUseResult: isError ? `Error: ${result}` : result }));
  }
  const gReport = (cites) => JSON.stringify({ citations: cites, toolCallLog: [] });
  const gWrite = (id, cites) => gCall("Write", { file_path: `${OUT}${id}.json`, content: gReport(cites) }, "File created");

  gCall(RD, { path: "guidelines/6.7/be-code-guidelines.md" }, "# Be code guidelines\n> [platform] platform/guidelines/6.7/be-code-guidelines.md#dependency-injection");
  gWrite("rule-01", ["platform/guidelines/6.7/be-code-guidelines.md#dependency-injection"]);

  const dir = mkdtempSync(path.join(tmpdir(), "kb-extract-anchor-"));
  const transcript = path.join(dir, "agent.jsonl");
  writeFileSync(transcript, gLines.join("\n") + "\n");
  const out = JSON.parse(execFileSync(process.execPath, [SCRIPT, "--transcript", transcript], { encoding: "utf8" }));

  assert.deepEqual(out.perCase["rule-01"].unbackedCitations, []);
});

// --- token-usage dedup (R7: one usage block per API message id, not per JSONL record) ---

test("foldUsage folds one usage block per message id, excludes the synthetic record, splits 5m/1h", () => {
  const records = readFileSync(path.join(FIXTURE_DIR, "multi-record-message.jsonl"), "utf8")
    .split("\n").filter(Boolean).map((l) => JSON.parse(l))
    .filter((r) => r.type === "assistant");

  const naiveOutputSum = records.reduce((n, r) => n + (r.message.usage?.output_tokens ?? 0), 0);
  const usage = foldUsage(records);

  assert.equal(records.length, 7); // 3 (msg_A) + 2 (msg_B) + 1 synthetic + 1 (msg_C)
  assert.equal(usage.assistantRecords, 7);
  assert.equal(usage.requests, 3); // msg_A, msg_B, msg_C — the synthetic record is excluded
  assert.equal(usage.syntheticRecords, 1);
  assert.equal(naiveOutputSum, 256); // what the old per-record sum would have overcounted
  assert.equal(usage.tokens.output, 204); // 134 (msg_A final) + 50 (msg_B final) + 20 (msg_C)
  assert.equal(usage.tokens.input, 10);
  assert.equal(usage.tokens.cacheRead, 600);
  assert.equal(usage.tokens.cacheCreation, 12447);
  assert.equal(usage.tokens.cacheCreation5m, 10447); // 9447 (A) + 1000 (B) + 0 (C, fallback)
  assert.equal(usage.tokens.cacheCreation1h, 2000); // 0 (A) + 2000 (B) + 0 (C)
  assert.equal(usage.dedup, "message-id");
  assert.deepEqual(usage.models, ["claude-sonnet-5"]);
  assert.match(usage.warnings[0], /ephemeral_5m.*fallback/);
});

// --- extractBatch over more than one transcript (a retried batch) ---

const RD_TOOL = RD;
function assistantRecord(id, reqId, content, usage, ts) {
  return JSON.stringify({ type: "assistant", timestamp: ts, message: { id, model: "claude-sonnet-5", content, usage }, requestId: reqId });
}
function userResult(toolUseId, content, ts) {
  return JSON.stringify({ type: "user", timestamp: ts, message: { content: [{ type: "tool_result", tool_use_id: toolUseId, content }] }, toolUseResult: content });
}
const U = { input_tokens: 2, output_tokens: 10, cache_read_input_tokens: 0, cache_creation_input_tokens: 100 };

test("extractBatch runs several transcripts as one batch: seq continues, usage sums every request", async () => {
  const dir = mkdtempSync(path.join(tmpdir(), "kb-batch-"));
  const t1 = path.join(dir, "t1.jsonl");
  const t2 = path.join(dir, "t2.jsonl");
  const target = `${OUT}dev-05.json`;

  writeFileSync(t1, [
    assistantRecord("msg_T1a", "req_T1a", [{ type: "tool_use", id: "u1", name: RD_TOOL, input: { path: "platform/e.md" } }], U, "2026-09-14T09:00:00.000Z"),
    userResult("u1", "# e", "2026-09-14T09:00:01.000Z"),
    assistantRecord("msg_T1b", "req_T1b", [{ type: "tool_use", id: "u2", name: "Write", input: { file_path: target, content: report(["platform/e.md:1-2"]) } }], U, "2026-09-14T09:00:02.000Z"),
    userResult("u2", "File created", "2026-09-14T09:00:03.000Z"),
  ].join("\n") + "\n");

  writeFileSync(t2, [
    assistantRecord("msg_T2a", "req_T2a", [{ type: "tool_use", id: "u3", name: RD_TOOL, input: { path: "platform/e.md" } }], U, "2026-09-14T09:05:00.000Z"),
    userResult("u3", "# e", "2026-09-14T09:05:01.000Z"),
    assistantRecord("msg_T2b", "req_T2b", [{ type: "tool_use", id: "u4", name: "Write", input: { file_path: target, content: report(["platform/e.md:1-2"]) } }], U, "2026-09-14T09:05:02.000Z"),
    userResult("u4", "File created", "2026-09-14T09:05:03.000Z"),
  ].join("\n") + "\n");

  const batch = await extractBatch({ transcripts: [t1, t2], caseOrder: ["dev-05"], expectAgentType: "kb-factory-verify-discover-mcp-wiki" });

  assert.deepEqual(batch.transcripts, [t1, t2]);
  assert.deepEqual(batch.transcript, [t1, t2]); // array form once more than one transcript
  assert.equal(batch.groundTruth, true);
  assert.equal(batch.extractorVersion, 2);
  assert.equal(batch.calls.length, 4);
  assert.deepEqual(batch.calls.map((c) => c.seq), [1, 2, 3, 4]); // seq is continuous across transcripts
  assert.equal(batch.totals.usage.requests, 4); // every message in both transcripts is its own request
  assert.equal(batch.totals.usage.tokens.output, 40);
  assert.equal(batch.totals.subagentTokens.output, 40); // dedup mirrors usage.tokens (raw would have been the same here, one record per message)
});

// --- findTranscripts: locate by harness sidecar agentType + brief suffix + first Case: ---

function writeSidecarAgent(subagentsDir, id, { agentType, run, option, case0, hasBrief = true }) {
  const jsonl = path.join(subagentsDir, `agent-a${id}.jsonl`);
  const meta = path.join(subagentsDir, `agent-a${id}.meta.json`);
  writeFileSync(meta, JSON.stringify({ agentType, description: `discover ${id}`, toolUseId: "toolu_x", spawnDepth: 1 }));
  const brief = hasBrief
    ? `Output directory: /home/somebody/projects/proj/.claude/skills/kb-factory-verify/reports/${run}/raw/${option}/\nCase: ${case0}\nQuery: q\nCategory: dev\n`
    : "no output directory line here";
  writeFileSync(jsonl, JSON.stringify({ type: "user", timestamp: "2026-09-14T09:00:00.000Z", message: { content: brief } }) + "\n");
  return { jsonl, meta };
}

test("findTranscripts resolves exactly one hit among agentType/case/brief decoys", async () => {
  const tmpHome = mkdtempSync(path.join(tmpdir(), "kb-home-"));
  const projectDir = "/home/example-user/projects/shopware-host-project";
  const slug = projectDir.replace(/[^A-Za-z0-9]/g, "-");
  const subagentsDir = path.join(tmpHome, ".claude", "projects", `${slug}-KB-Verify`, "session-1", "subagents");
  mkdirSync(subagentsDir, { recursive: true });

  const good = writeSidecarAgent(subagentsDir, "good1", { agentType: "kb-factory-verify-discover-mcp-wiki", run: "run-1", option: "mcp-wiki", case0: "dev-01" });
  writeSidecarAgent(subagentsDir, "wrongtype", { agentType: "kb-factory-verify-discover-fs-wiki", run: "run-1", option: "mcp-wiki", case0: "dev-01" });
  writeSidecarAgent(subagentsDir, "wrongcase", { agentType: "kb-factory-verify-discover-mcp-wiki", run: "run-1", option: "mcp-wiki", case0: "dev-02" });
  writeSidecarAgent(subagentsDir, "nobrief", { agentType: "kb-factory-verify-discover-mcp-wiki", run: "run-1", option: "mcp-wiki", case0: "dev-01", hasBrief: false });
  writeSidecarAgent(subagentsDir, "wrongrun", { agentType: "kb-factory-verify-discover-mcp-wiki", run: "other-run", option: "mcp-wiki", case0: "dev-01" });

  const indexPath = path.join(mkdtempSync(path.join(tmpdir(), "kb-idx-")), ".transcript-index.jsonl");
  const origHome = process.env.HOME;
  process.env.HOME = tmpHome;
  let result;
  try {
    result = await findTranscripts(
      { run: "run-1", option: "mcp-wiki", cases: ["dev-01"], projectDir, since: null },
      { writeIndex: true, indexPath },
    );
  } finally {
    process.env.HOME = origHome;
  }

  assert.equal(result.method, "scan");
  assert.equal(result.hits.length, 1);
  assert.equal(result.hits[0].transcript, good.jsonl);
  assert.equal(result.hits[0].meta.agentType, "kb-factory-verify-discover-mcp-wiki");

  // The successful scan is recorded in the index, so a later run whose scan finds nothing (the
  // transcript pruned, or the project dir simply not present) still resolves the same transcript.
  const emptyHome = mkdtempSync(path.join(tmpdir(), "kb-empty-home-"));
  process.env.HOME = emptyHome;
  let fromIndex;
  try {
    fromIndex = await findTranscripts(
      { run: "run-1", option: "mcp-wiki", cases: ["dev-01"], projectDir, since: null },
      { indexPath },
    );
  } finally {
    process.env.HOME = origHome;
  }
  assert.equal(fromIndex.method, "index");
  assert.equal(fromIndex.hits.length, 1);
  assert.equal(fromIndex.hits[0].transcript, good.jsonl);
});

// --- CLI smoke test: --run/--option/--batch/--cases/--meta writes batch-<n>.meta.json ---

test("CLI --run/--option/--meta resolves via findTranscripts and writes batch-<n>.meta.json", () => {
  const tmpHome = mkdtempSync(path.join(tmpdir(), "kb-home-"));
  const projectDir = "/home/example-user/projects/shopware-host-project";
  const slug = projectDir.replace(/[^A-Za-z0-9]/g, "-");
  const subagentsDir = path.join(tmpHome, ".claude", "projects", `${slug}-KB-Verify`, "session-1", "subagents");
  mkdirSync(subagentsDir, { recursive: true });
  writeSidecarAgent(subagentsDir, "cli1", { agentType: "kb-factory-verify-discover-mcp-wiki", run: "cli-run", option: "mcp-wiki", case0: "dev-01" });
  // Give the transcript real content so extractBatch's usage/call totals are well-defined.
  const jsonl = path.join(subagentsDir, "agent-acli1.jsonl");
  writeFileSync(jsonl, [
    JSON.stringify({ type: "user", timestamp: "2026-09-14T09:00:00.000Z", message: { content: "Output directory: /x/reports/cli-run/raw/mcp-wiki/\nCase: dev-01\nQuery: q\nCategory: dev\n" } }),
    assistantRecord("msg_1", "req_1", [{ type: "text", text: "hi" }], U, "2026-09-14T09:00:01.000Z"),
  ].join("\n") + "\n");

  const reportsDir = mkdtempSync(path.join(tmpdir(), "kb-reports-"));
  const stdout = execFileSync(process.execPath, [
    SCRIPT, "--run", "cli-run", "--option", "mcp-wiki", "--batch", "1",
    "--cases", "dev-01", "--project-dir", projectDir, "--reports-dir", reportsDir, "--meta",
  ], { encoding: "utf8", env: { ...process.env, HOME: tmpHome } });

  const out = JSON.parse(stdout);
  assert.equal(out.groundTruth, true);
  assert.equal(out.agentType, "kb-factory-verify-discover-mcp-wiki");

  const metaPath = path.join(reportsDir, "cli-run", "raw", "mcp-wiki", "batch-1.meta.json");
  const meta = JSON.parse(readFileSync(metaPath, "utf8"));
  assert.equal(meta.discover.groundTruth, true);
  assert.deepEqual(meta.discover.cases, ["dev-01"]);
  assert.equal(meta.discover.transcript, jsonl);
});
