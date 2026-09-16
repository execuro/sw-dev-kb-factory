// node --test .claude/skills/kb-factory-verify/scripts/aggregate-costs.test.mjs
// Guards the source ladder (transcript > prior costs.json > calls.json > meta.json > null), the
// USD estimate arithmetic, the totalTokens retirement, and the overview's legacy/none markers and
// deterministic re-run byte-identity.

import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync } from "node:fs";
import { homedir, tmpdir } from "node:os";
import path from "node:path";
import {
  computeRunCosts, writeCostsJsonAction, patchScores, patchReportHtml, patchReportMd,
  regenerateOverview, loadPricing, estimateUsd, portablePath, DEFAULT_PRICING_PATH, REPO_ROOT,
} from "./aggregate-costs.mjs";

const SCRIPT = new URL("./aggregate-costs.mjs", import.meta.url).pathname;

function assistantLine(id, model, usage, ts) {
  return JSON.stringify({ type: "assistant", timestamp: ts, requestId: `req_${id}`, message: { id, model, content: [{ type: "text", text: "x" }], usage } });
}
function briefLine(run, option, case0, ts) {
  return JSON.stringify({ type: "user", timestamp: ts, message: { content: `Output directory: /x/reports/${run}/raw/${option}/\nCase: ${case0}\nQuery: q\nCategory: dev\n` } });
}

function setupReportsRoot() {
  const root = mkdtempSync(path.join(tmpdir(), "kb-costs-"));

  // run-a / opt-a: batch-1 has a live transcript (source "transcript"); batch-2's transcript is
  // gone and its calls.json only carries the old raw subagentTokens (source "calls.json (raw,
  // undeduplicated)") — exercises the ladder and the option-level "mixed" source/dedup.
  const rawA = path.join(root, "run-a", "raw", "opt-a");
  mkdirSync(rawA, { recursive: true });
  writeFileSync(path.join(root, "run-a", "run.json"), JSON.stringify({ run: "run-a", mode: "opt-a", options: ["opt-a"] }));
  const t1 = path.join(rawA, "agent-1.jsonl");
  writeFileSync(t1, [
    briefLine("run-a", "opt-a", "dev-01", "2026-09-14T10:00:00.000Z"),
    assistantLine("m1", "claude-sonnet-5",
      { input_tokens: 100, output_tokens: 50, cache_read_input_tokens: 1000, cache_creation_input_tokens: 200, cache_creation: { ephemeral_5m_input_tokens: 150, ephemeral_1h_input_tokens: 50 } },
      "2026-09-14T10:00:01.000Z"),
  ].join("\n") + "\n");
  writeFileSync(path.join(rawA, "batch-1.meta.json"), JSON.stringify({ discover: { cases: ["dev-01"], groundTruth: true, transcript: t1 } }));
  writeFileSync(path.join(rawA, "batch-2.meta.json"), JSON.stringify({ discover: { cases: ["dev-02"], groundTruth: true, transcript: path.join(rawA, "agent-2-gone.jsonl") } }));
  writeFileSync(path.join(rawA, "batch-2.calls.json"), JSON.stringify({
    totals: { toolCalls: 3, retrievalCalls: 2, batchWallSeconds: 12, subagentTokens: { input: 10, output: 5, cacheRead: 100, cacheCreation: 20 } },
  }));
  writeFileSync(path.join(root, "run-a", "scores.json"), JSON.stringify({ options: { "opt-a": {} }, costs: { wallClockSeconds: 999 } }, null, 2));
  writeFileSync(path.join(root, "run-a", "report.html"), `<!doctype html><html><body><script type="application/json" id="report-data">{"kind":"run","scores":{"options":{"opt-a":{}},"costs":{"wallClockSeconds":999}}}</script></body></html>`);
  writeFileSync(path.join(root, "run-a", "kb-quality-report.md"), "# Report\n\n## Run cost\n\nold stale table\n\n## Comparison\n\nn/a\n");

  // run-b / opt-b: one transcript, model unknown to pricing.json — costUsdEstimate must be null
  // with a warning, never a wrong number.
  const rawB = path.join(root, "run-b", "raw", "opt-b");
  mkdirSync(rawB, { recursive: true });
  writeFileSync(path.join(root, "run-b", "run.json"), JSON.stringify({ run: "run-b", mode: "opt-b", options: ["opt-b"] }));
  const t2 = path.join(rawB, "agent-1.jsonl");
  writeFileSync(t2, [
    briefLine("run-b", "opt-b", "dev-01", "2026-09-14T11:00:00.000Z"),
    assistantLine("m2", "claude-mystery-9", { input_tokens: 5, output_tokens: 5, cache_read_input_tokens: 0, cache_creation_input_tokens: 0 }, "2026-09-14T11:00:01.000Z"),
  ].join("\n") + "\n");
  writeFileSync(path.join(rawB, "batch-1.meta.json"), JSON.stringify({ discover: { cases: ["dev-01"], groundTruth: true, transcript: t2 } }));

  // run-c: has run.json but was never run through aggregate-costs (no costs.json, no raw/) —
  // an overview row for it must come out "legacy".
  mkdirSync(path.join(root, "run-c"), { recursive: true });
  writeFileSync(path.join(root, "run-c", "run.json"), JSON.stringify({ run: "run-c", mode: "opt-c", options: ["opt-c"] }));

  // simple-run-x: even though it happens to carry a run.json, its option ends in "-simple" so it
  // must resolve to "none", not "legacy".
  mkdirSync(path.join(root, "simple-run-x"), { recursive: true });
  writeFileSync(path.join(root, "simple-run-x", "run.json"), JSON.stringify({ run: "simple-run-x", mode: "opt-a", options: ["opt-a-simple"] }));

  const overviewSeed = [
    { run: "run-a", option: "opt-a", generatedAt: "2026-09-10T00:00:00Z", overallPct: 50, overallStatus: "Ready", totalTokens: 99999, totalToolCalls: 5, wallClockSeconds: 500, reportPath: "reports/run-a/kb-quality-report.md", htmlPath: "reports/run-a/report.html" },
    { run: "run-c", option: "opt-c", generatedAt: "2026-09-11T00:00:00Z", overallPct: 60, overallStatus: "Ready", wallClockSeconds: 300 },
    { run: "simple-run-x", option: "opt-a-simple", generatedAt: "2026-09-12T00:00:00Z", overallPct: 70, overallStatus: "Ready" },
    { run: "run-missing", option: "opt-x", generatedAt: null, overallPct: 40, overallStatus: "Ready" },
  ];
  const templatePath = path.join(root, "overview-template.html");
  writeFileSync(templatePath, `<!doctype html><html><body><script type="application/json" id="runs-data">[]</script></body></html>`);
  writeFileSync(path.join(root, "overview.html"), templatePath && `<!doctype html><html><body><script type="application/json" id="runs-data">${JSON.stringify(overviewSeed)}</script></body></html>`);

  return { root, templatePath, pricingPath: DEFAULT_PRICING_PATH };
}

test("portablePath keeps committed artifacts free of machine layout and user name", () => {
  const inRepo = path.join(REPO_ROOT, ".claude", "skills", "kb-factory-verify", "reports", "r", "raw", "o", "agent.jsonl");
  assert.equal(portablePath(inRepo), path.join(".claude", "skills", "kb-factory-verify", "reports", "r", "raw", "o", "agent.jsonl"));

  const home = homedir();
  const user = path.basename(home);
  const inHome = path.join(home, ".claude", "projects", `-home-${user}-projects-p`, "s1", "subagents", "agent-a1.jsonl");
  const out = portablePath(inHome);
  assert.ok(out.startsWith("~/"), out);
  assert.ok(!out.includes(user), out);
  assert.ok(!path.isAbsolute(out), out);

  assert.equal(portablePath("raw/o/agent.jsonl"), "raw/o/agent.jsonl");
  assert.equal(portablePath(null), null);
});

test("estimateUsd hand arithmetic matches the priced buckets", () => {
  const pricing = loadPricing();
  const tokens = { input: 1_000_000, output: 1_000_000, cacheCreation5m: 1_000_000, cacheCreation1h: 1_000_000, cacheRead: 1_000_000 };
  const est = estimateUsd("claude-sonnet-5", tokens, pricing);
  // 1M tokens per bucket at the sonnet-5 rates in pricing.json: 2 + 10 + 2.5 + 4 + 0.2
  assert.equal(est.total, 18.7);
  assert.deepEqual(est.byBucket, { input: 2, output: 10, cacheWrite5m: 2.5, cacheWrite1h: 4, cacheRead: 0.2 });
});

test("computeRunCosts: source ladder, dedup, USD, unknown model, cases/tools counted", async () => {
  const { root, pricingPath } = setupReportsRoot();

  const costsA = await computeRunCosts({ run: "run-a", reportsDir: root, pricingPath });
  const batchesA = costsA.batches["opt-a"];
  assert.equal(batchesA[0].source, "transcript");
  assert.equal(batchesA[0].dedup, "message-id");
  assert.equal(batchesA[0].requests, 1);
  assert.equal(batchesA[1].source, "calls.json (raw, undeduplicated)");
  assert.equal(batchesA[1].dedup, "raw");
  assert.equal(batchesA[1].requests, null);

  const blockA = costsA.options["opt-a"];
  assert.equal(blockA.source, "mixed"); // one transcript batch + one raw-calls.json batch
  assert.equal(blockA.dedup, "raw");
  assert.equal(blockA.agents, 2);
  assert.equal(blockA.retries, 0);
  assert.equal(blockA.batchesWithUsage, "2/2");
  assert.equal(blockA.casesCounted, 2);
  assert.equal(blockA.toolCalls, 3); // only batch-2 reports tool calls (raw meta has none for batch-1)
  assert.equal(blockA.tokens.input, 110); // 100 (transcript) + 10 (raw)
  assert.equal(blockA.tokens.output, 55);
  assert.equal(blockA.tokens.cacheRead, 1100);
  assert.equal(blockA.tokens.cacheCreation, 220);
  assert.equal(blockA.tokens.nonCache, 110 + 55 + 220);
  assert.ok(blockA.warnings.some((w) => /overcounts duplicated content-block/.test(w)));
  assert.equal(blockA.model.name, "claude-sonnet-5"); // the raw batch contributes no byModel entry
  const expectedUsd = estimateUsd("claude-sonnet-5", blockA.tokens, loadPricing(pricingPath));
  assert.equal(blockA.costUsdEstimate.total, expectedUsd.total);
  assert.deepEqual(blockA.costUsdEstimate.byBucket, expectedUsd.byBucket);

  const costsB = await computeRunCosts({ run: "run-b", reportsDir: root, pricingPath });
  const blockB = costsB.options["opt-b"];
  assert.equal(blockB.model.name, "claude-mystery-9");
  assert.equal(blockB.costUsdEstimate, null);
  assert.ok(blockB.warnings.some((w) => /no price for model "claude-mystery-9"/.test(w)));
});

test("patchScores/patchReportHtml/patchReportMd write the option cost block, skip cleanly when absent", async () => {
  const { root, pricingPath } = setupReportsRoot();
  const runDir = path.join(root, "run-a");
  const costs = await computeRunCosts({ run: "run-a", reportsDir: root, pricingPath });

  const sc = patchScores(runDir, costs);
  assert.equal(sc.changed, true);
  sc.apply();
  const scores = JSON.parse(readFileSync(path.join(runDir, "scores.json"), "utf8"));
  assert.equal(scores.options["opt-a"].costs.schemaVersion, 2);
  assert.equal(scores.options["opt-a"].costs.source, "mixed");

  const rh = patchReportHtml(runDir, costs);
  rh.apply();
  const html = readFileSync(path.join(runDir, "report.html"), "utf8");
  const embedded = JSON.parse(html.match(/id="report-data">(.*?)<\/script>/s)[1]);
  assert.equal(embedded.scores.options["opt-a"].costs.schemaVersion, 2);

  const rm = patchReportMd(runDir, costs);
  rm.apply();
  const md = readFileSync(path.join(runDir, "kb-quality-report.md"), "utf8");
  assert.match(md, /## Run cost/);
  assert.doesNotMatch(md, /old stale table/);
  assert.match(md, /## Comparison/); // section after Run cost survives the replace
  assert.match(md, /Non-cache tokens/);

  // run-b has neither scores.json nor report.html: skip with a warning, never throw.
  const runDirB = path.join(root, "run-b");
  const costsB = await computeRunCosts({ run: "run-b", reportsDir: root, pricingPath });
  const scB = patchScores(runDirB, costsB);
  assert.equal(scB.changed, false);
  assert.match(scB.warning, /not found/);
  const rhB = patchReportHtml(runDirB, costsB);
  assert.equal(rhB.changed, false);
  assert.match(rhB.warning, /not found/);
});

test("regenerateOverview: totalTokens is gone, legacy/none markers, sort order, cost fields from costs.json", async () => {
  const { root, templatePath, pricingPath } = setupReportsRoot();
  const runDir = path.join(root, "run-a");
  const costs = await computeRunCosts({ run: "run-a", reportsDir: root, pricingPath });
  writeCostsJsonAction(runDir, costs).apply();

  const action = regenerateOverview({ reportsDir: root, templatePath });
  action.apply();
  const html = readFileSync(action.path, "utf8");
  const data = JSON.parse(html.match(/id="runs-data">(.*?)<\/script>/s)[1]);

  assert.equal(data.length, 4);
  for (const r of data) {
    assert.equal("totalTokens" in r, false);
    assert.equal("totalToolCalls" in r, false);
  }

  const byRun = Object.fromEntries(data.map((r) => [r.run, r]));
  assert.equal(byRun["run-a"].costsSource, "mixed");
  assert.equal(byRun["run-a"].nonCacheTokens, costs.options["opt-a"].tokens.nonCache);
  assert.equal(byRun["run-a"].cacheReadTokens, costs.options["opt-a"].tokens.cacheRead);
  assert.equal(byRun["run-c"].costsSource, "legacy");
  assert.equal(byRun["run-c"].nonCacheTokens, null);
  assert.equal(byRun["run-c"].wallClockSeconds, 300); // untouched even though cost fields are null
  assert.equal(byRun["simple-run-x"].costsSource, "none");
  assert.equal(byRun["run-missing"].costsSource, "none");

  // sort: newest generatedAt first, missing generatedAt sorts last
  assert.deepEqual(data.map((r) => r.run), ["simple-run-x", "run-c", "run-a", "run-missing"]);
});

test("second application is byte-identical: costs.json keeps its timestamp, overview.html is stable", async () => {
  const { root, templatePath, pricingPath } = setupReportsRoot();
  const runDir = path.join(root, "run-a");
  const costsJsonPath = path.join(runDir, "costs.json");

  const first = await computeRunCosts({ run: "run-a", reportsDir: root, pricingPath });
  writeCostsJsonAction(runDir, first).apply();
  patchScores(runDir, first).apply();
  regenerateOverview({ reportsDir: root, templatePath }).apply();
  const afterFirst = {
    costs: readFileSync(costsJsonPath, "utf8"),
    scores: readFileSync(path.join(runDir, "scores.json"), "utf8"),
    overview: readFileSync(path.join(root, "overview.html"), "utf8"),
  };

  const second = await computeRunCosts({ run: "run-a", reportsDir: root, pricingPath });
  const costsAction = writeCostsJsonAction(runDir, second);
  assert.equal(costsAction.changed, false); // computedAt was carried over because nothing else changed
  costsAction.apply();
  patchScores(runDir, second).apply();
  regenerateOverview({ reportsDir: root, templatePath }).apply();
  const afterSecond = {
    costs: readFileSync(costsJsonPath, "utf8"),
    scores: readFileSync(path.join(runDir, "scores.json"), "utf8"),
    overview: readFileSync(path.join(root, "overview.html"), "utf8"),
  };

  assert.equal(afterFirst.costs, afterSecond.costs);
  assert.equal(afterFirst.scores, afterSecond.scores);
  assert.equal(afterFirst.overview, afterSecond.overview);
});

test("CLI --check exits 1 while something would change, 0 once applied and unchanged, writes nothing under --check", () => {
  const { root, templatePath, pricingPath } = setupReportsRoot();
  const costsJsonPath = path.join(root, "run-a", "costs.json");

  assert.throws(() => execFileSync(process.execPath, [SCRIPT, "--run", "run-a", "--reports-dir", root, "--pricing", pricingPath, "--template", templatePath, "--check"], { encoding: "utf8" }));
  assert.equal(existsSync(costsJsonPath), false);

  execFileSync(process.execPath, [SCRIPT, "--run", "run-a", "--reports-dir", root, "--pricing", pricingPath, "--template", templatePath], { encoding: "utf8" });
  assert.equal(existsSync(costsJsonPath), true);

  // now unchanged: --check must exit 0 and touch nothing
  const before = readFileSync(costsJsonPath, "utf8");
  execFileSync(process.execPath, [SCRIPT, "--run", "run-a", "--reports-dir", root, "--pricing", pricingPath, "--template", templatePath, "--check"], { encoding: "utf8" });
  const after = readFileSync(costsJsonPath, "utf8");
  assert.equal(before, after);
});
