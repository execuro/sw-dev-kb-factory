#!/usr/bin/env node
// aggregate-costs.mjs — the one place that turns kb-factory-verify discover-agent transcripts into
// a comparable token/USD figure. See DEFINITION below: it is reused verbatim wherever a cost is
// shown (SKILL.md, the overview/report templates, this script's own markdown output).
//
// Usage:
//   node aggregate-costs.mjs --run reports/<run>              cost one run, patch its files, redo overview
//   node aggregate-costs.mjs --all                             every reports/*/ with run.json + raw/<opt>/batch-*.json
//   node aggregate-costs.mjs --overview-only                   regenerate overview.html from existing costs.json only
//   node aggregate-costs.mjs (--run <run>|--all) --check        write nothing; exit 1 if anything would change
//   [--json] [--no-overview] [--no-patch-reports] [--pricing <path>] [--project-dir <dir>] [--template <path>]
//
// Source ladder per batch (recorded as `source`): transcript(s) on disk -> extractBatch in-process
// (dedup "message-id", the authoritative path) · else a previous costs.json's entry for that batch
// (never downgrade once a transcript has been folded in) · else the batch's own calls.json
// (`totals.usage` when present -> "message-id"; else `totals.subagentTokens`, raw/undeduplicated) ·
// else the sidecar `batch-<n>.meta.json`'s raw `subagentTokens` · else null + a warning.

import { existsSync, readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { extractBatch, readSidecar, normaliseModel } from "./extract-agent-calls.mjs";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const SKILL_DIR = path.join(SCRIPT_DIR, "..");
export const REPO_ROOT = path.resolve(SKILL_DIR, "..", "..", "..");
export const DEFAULT_REPORTS_DIR = path.join(SKILL_DIR, "reports");
export const DEFAULT_PRICING_PATH = path.join(SKILL_DIR, "reference", "pricing.json");
export const DEFAULT_TEMPLATE_PATH = path.join(SKILL_DIR, "reference", "overview-template.html");

/**
 * How an absolute path is written into a committed artifact. `costs.json` is committed, so it must
 * not carry one machine's directory layout or its user name: a path inside the repository is
 * recorded relative to the repository root, a path in the user's home directory as `~/...` with the
 * user name replaced by `<user>` (Claude Code's own project directories embed it in their folder
 * name). Resolution always uses the real absolute path — only what is written out is shortened.
 */
export function portablePath(p) {
  if (typeof p !== "string" || !path.isAbsolute(p)) return p;
  const inRepo = path.relative(REPO_ROOT, p);
  if (inRepo && !inRepo.startsWith("..") && !path.isAbsolute(inRepo)) return inRepo;
  const home = os.homedir();
  let out = p;
  if (home) {
    const inHome = path.relative(home, p);
    if (inHome && !inHome.startsWith("..") && !path.isAbsolute(inHome)) out = `~/${inHome}`;
    const user = path.basename(home);
    if (user) out = out.split(user).join("<user>");
  }
  return out;
}

export const DEFINITION =
  "Cost = usage of the option's discover agents only, one usage block per API message id (the " +
  "record carrying the final output_tokens), split into non-cache tokens (input + output + cache " +
  "writes) and cache-read tokens, computed by scripts/aggregate-costs.mjs from the transcripts. " +
  "Cache hit rate = cacheRead ÷ (input + cacheCreation + cacheRead). USD is an estimate from " +
  "reference/pricing.json, labelled so. totalTokens is retired.";

function args(argv = process.argv.slice(2)) {
  const a = argv;
  const o = {};
  for (let i = 0; i < a.length; i++) {
    if (a[i].startsWith("--")) o[a[i].slice(2)] = (i + 1 >= a.length || a[i + 1].startsWith("--")) ? true : a[++i];
  }
  return o;
}

function round2(n) { return Math.round(n * 100) / 100; }
function round4(n) { return Math.round(n * 10000) / 10000; }

function hitRate(tokens) {
  const denom = (tokens.input ?? 0) + (tokens.cacheCreation ?? 0) + (tokens.cacheRead ?? 0);
  return denom > 0 ? round4((tokens.cacheRead ?? 0) / denom) : null;
}

function withDerivedTotals(tokens) {
  return {
    ...tokens,
    nonCache: (tokens.input ?? 0) + (tokens.output ?? 0) + (tokens.cacheCreation ?? 0),
    promptTotal: (tokens.input ?? 0) + (tokens.cacheCreation ?? 0) + (tokens.cacheRead ?? 0),
  };
}

// ---------------------------------------------------------------------------------------------
// Pricing
// ---------------------------------------------------------------------------------------------

export function loadPricing(pricingPath = DEFAULT_PRICING_PATH) {
  return JSON.parse(readFileSync(pricingPath, "utf8"));
}

export function priceForModel(model, pricing) {
  if (!model) return null;
  const canon = normaliseModel(model);
  const key = pricing.aliases?.[canon] ?? canon;
  return pricing.models?.[key] ?? null;
}

// tokens: the option's single overall bucket, priced against one model.
export function estimateUsd(model, tokens, pricing) {
  const price = priceForModel(model, pricing);
  if (!price) return { total: null, byBucket: null, unknown: [model] };
  const input = (tokens.input ?? 0) * price.input / 1e6;
  const output = (tokens.output ?? 0) * price.output / 1e6;
  const cacheWrite5m = (tokens.cacheCreation5m ?? 0) * price.cacheWrite5m / 1e6;
  const cacheWrite1h = (tokens.cacheCreation1h ?? 0) * price.cacheWrite1h / 1e6;
  const cacheRead = (tokens.cacheRead ?? 0) * price.cacheRead / 1e6;
  return {
    total: round2(input + output + cacheWrite5m + cacheWrite1h + cacheRead),
    byBucket: { input: round4(input), output: round4(output), cacheWrite5m: round4(cacheWrite5m), cacheWrite1h: round4(cacheWrite1h), cacheRead: round4(cacheRead) },
    unknown: [],
  };
}

// ---------------------------------------------------------------------------------------------
// Per-batch source ladder
// ---------------------------------------------------------------------------------------------

function rawTokensFromLegacy(raw) {
  return withDerivedTotals({
    input: raw?.input ?? 0, output: raw?.output ?? 0,
    cacheCreation: raw?.cacheCreation ?? 0, cacheCreation5m: raw?.cacheCreation ?? 0, cacheCreation1h: 0,
    cacheRead: raw?.cacheRead ?? 0,
  });
}

const RAW_DEDUP_WARNING = "usage counted per JSONL record, not per API message id — overcounts duplicated content-block records";

export async function resolveBatch({ run, option, n, reportsDir, prevBatch }) {
  const dir = path.join(reportsDir, run, "raw", option);
  const metaPath = path.join(dir, `batch-${n}.meta.json`);
  const callsPath = path.join(dir, `batch-${n}.calls.json`);
  const expectAgentType = `kb-factory-verify-discover-${option}`;

  let meta = null;
  if (existsSync(metaPath)) { try { meta = JSON.parse(readFileSync(metaPath, "utf8")); } catch { meta = null; } }
  const transcriptField = meta?.discover?.transcript;
  const transcripts = transcriptField == null ? [] : (Array.isArray(transcriptField) ? transcriptField : [transcriptField]);
  // What lands in the committed costs.json; `transcripts` itself stays absolute so the files can
  // still be read from disk.
  const recorded = transcripts.map(portablePath);
  const cases = meta?.discover?.cases ?? [];

  if (transcripts.length && transcripts.every((t) => existsSync(t))) {
    const sidecars = transcripts.map((t) => readSidecar(t));
    const batch = await extractBatch({ transcripts, caseOrder: cases, expectAgentType, sidecars });
    const u = batch.totals.usage;
    return {
      batch: n, source: "transcript", dedup: "message-id",
      transcripts: recorded, agentType: batch.agentType, cases,
      requests: u.requests, tokens: withDerivedTotals(u.tokens), cacheHitRate: hitRate(u.tokens),
      models: u.models, byModel: u.byModel,
      syntheticRecords: u.syntheticRecords, longContextRequests: u.longContextRequests,
      toolCalls: batch.totals.toolCalls, retrievalCalls: batch.totals.retrievalCalls,
      batchWallSeconds: batch.totals.batchWallSeconds,
      warnings: [...batch.warnings],
    };
  }

  // Never downgrade: only reuse a *better* prior result (one that was itself transcript-sourced,
  // message-id deduped) when the transcript(s) it was built from are no longer on disk. A prior
  // raw/undeduplicated entry is not better than recomputing fresh from calls.json/meta.json below,
  // so it falls through instead of being reused (idempotent — no warning growth across re-runs).
  if (prevBatch?.tokens && prevBatch.source === "transcript") {
    const warnings = [...new Set([...(prevBatch.warnings ?? []), "transcript(s) no longer on disk; reused the prior costs.json entry for this batch"])];
    return { ...prevBatch, warnings };
  }

  if (existsSync(callsPath)) {
    let calls = null;
    try { calls = JSON.parse(readFileSync(callsPath, "utf8")); } catch { calls = null; }
    if (calls?.totals?.usage) {
      const u = calls.totals.usage;
      return {
        batch: n, source: "calls.json", dedup: "message-id",
        transcripts: recorded, agentType: expectAgentType, cases,
        requests: u.requests, tokens: withDerivedTotals(u.tokens), cacheHitRate: hitRate(u.tokens),
        models: u.models, byModel: u.byModel,
        syntheticRecords: u.syntheticRecords ?? 0, longContextRequests: u.longContextRequests ?? 0,
        toolCalls: calls.totals.toolCalls ?? null, retrievalCalls: calls.totals.retrievalCalls ?? null,
        batchWallSeconds: calls.totals.batchWallSeconds ?? null,
        warnings: [],
      };
    }
    if (calls?.totals?.subagentTokens) {
      const tokens = rawTokensFromLegacy(calls.totals.subagentTokens);
      return {
        batch: n, source: "calls.json (raw, undeduplicated)", dedup: "raw",
        transcripts: recorded, agentType: null, cases,
        requests: null, tokens, cacheHitRate: hitRate(tokens),
        models: [], byModel: {}, syntheticRecords: null, longContextRequests: null,
        toolCalls: calls.totals.toolCalls ?? null, retrievalCalls: calls.totals.retrievalCalls ?? null,
        batchWallSeconds: calls.totals.batchWallSeconds ?? null,
        warnings: [RAW_DEDUP_WARNING],
      };
    }
  }

  if (meta?.discover?.subagentTokens) {
    const tokens = rawTokensFromLegacy(meta.discover.subagentTokens);
    return {
      batch: n, source: "meta.json (raw)", dedup: "raw",
      transcripts: recorded, agentType: null, cases,
      requests: null, tokens, cacheHitRate: hitRate(tokens),
      models: [], byModel: {}, syntheticRecords: null, longContextRequests: null,
      toolCalls: null, retrievalCalls: meta.discover.retrievalCalls ?? null,
      batchWallSeconds: meta.discover.batchWallSeconds ?? null,
      warnings: [RAW_DEDUP_WARNING],
    };
  }

  return {
    batch: n, source: null, dedup: null, transcripts: recorded, agentType: null, cases,
    requests: null, tokens: null, cacheHitRate: null, models: [], byModel: {},
    syntheticRecords: null, longContextRequests: null, toolCalls: null, retrievalCalls: null, batchWallSeconds: null,
    warnings: [`batch ${n}: no usage source found (no transcript, no prior costs.json entry, no calls.json/meta.json usage)`],
  };
}

// ---------------------------------------------------------------------------------------------
// Per-option aggregation
// ---------------------------------------------------------------------------------------------

function buildOptionBlock(batches, pricing) {
  const anyNull = batches.some((b) => !b.tokens);
  const batchesWithUsage = `${batches.filter((b) => b.tokens).length}/${batches.length}`;
  const agents = batches.reduce((n, b) => n + (b.transcripts?.length || (b.tokens ? 1 : 0)), 0);
  const retries = batches.filter((b) => (b.transcripts?.length ?? 0) > 1).length;
  const requests = !anyNull && batches.every((b) => b.requests != null) ? batches.reduce((n, b) => n + b.requests, 0) : null;

  const bucketKeys = ["input", "output", "cacheCreation", "cacheCreation5m", "cacheCreation1h", "cacheRead"];
  let tokens = null;
  if (!anyNull) {
    tokens = Object.fromEntries(bucketKeys.map((k) => [k, batches.reduce((n, b) => n + (b.tokens[k] ?? 0), 0)]));
    tokens = withDerivedTotals(tokens);
  }
  const cacheHitRate = tokens ? hitRate(tokens) : null;
  const promptTokensPerRequest = tokens && requests ? Math.round(tokens.promptTotal / requests) : null;

  const casesCounted = new Set(batches.flatMap((b) => b.cases ?? [])).size;
  const tokensPerCase = tokens && casesCounted
    ? { nonCache: Math.round(tokens.nonCache / casesCounted), cacheRead: Math.round(tokens.cacheRead / casesCounted) }
    : { nonCache: null, cacheRead: null };

  const toolCalls = batches.every((b) => b.toolCalls != null) ? batches.reduce((n, b) => n + b.toolCalls, 0) : null;
  const retrievalCalls = batches.every((b) => b.retrievalCalls != null) ? batches.reduce((n, b) => n + b.retrievalCalls, 0) : null;
  const agentTimeSecondsSummed = batches.some((b) => b.batchWallSeconds != null)
    ? round2(batches.reduce((n, b) => n + (b.batchWallSeconds ?? 0), 0)) : null;

  const byModel = {};
  for (const b of batches) {
    for (const [m, t] of Object.entries(b.byModel ?? {})) {
      byModel[m] ??= { requests: 0, input: 0, output: 0, cacheCreation: 0, cacheRead: 0 };
      byModel[m].requests += t.requests; byModel[m].input += t.input; byModel[m].output += t.output;
      byModel[m].cacheCreation += t.cacheCreation; byModel[m].cacheRead += t.cacheRead;
    }
  }
  const modelNames = Object.keys(byModel);
  const modelName = modelNames.length === 1 ? modelNames[0] : (modelNames.length ? "mixed" : null);

  const longContextRequests = batches.every((b) => b.longContextRequests != null)
    ? batches.reduce((n, b) => n + (b.longContextRequests ?? 0), 0) : null;
  const syntheticRecords = batches.every((b) => b.syntheticRecords != null)
    ? batches.reduce((n, b) => n + (b.syntheticRecords ?? 0), 0) : null;

  const sourcesSet = new Set(batches.map((b) => b.source));
  const source = sourcesSet.size === 1 ? [...sourcesSet][0] : "mixed";
  const dedupSet = new Set(batches.map((b) => b.dedup));
  const dedup = dedupSet.size === 1 ? [...dedupSet][0] : "raw";

  const warnings = [...new Set(batches.flatMap((b) => b.warnings ?? []))];
  let costUsdEstimate = null;
  if (tokens && modelName && modelName !== "mixed") {
    const est = estimateUsd(modelName, tokens, pricing);
    if (est.total == null) warnings.push(`no price for model "${modelName}" in pricing.json`);
    else costUsdEstimate = { total: est.total, byBucket: est.byBucket, pricingVersion: pricing.schemaVersion, pricingSource: pricing.source, estimate: true };
  } else if (tokens && modelName === "mixed") {
    warnings.push("mixed models in this option: USD estimate needs a per-model 5m/1h split not tracked at the option level; costUsdEstimate is null");
  }

  return {
    schemaVersion: 2, scope: "discover", definition: DEFINITION,
    batches: batches.length, batchesWithUsage, agents, retries, requests,
    tokens, cacheHitRate, promptTokensPerRequest,
    tokensPerCase, casesCounted,
    toolCalls, retrievalCalls, agentTimeSecondsSummed,
    model: { name: modelName, byModel },
    longContextRequests,
    costUsdEstimate,
    dedup, source, batchSources: batches.map((b) => b.source),
    syntheticRecords, warnings,
  };
}

export async function computeOption({ run, option, reportsDir, prevBatches = [], pricing }) {
  const dir = path.join(reportsDir, run, "raw", option);
  const files = existsSync(dir) ? readdirSync(dir) : [];
  const nums = [...new Set(
    files.map((f) => f.match(/^batch-(\d+)\.(?:calls|meta)\.json$/)?.[1]).filter(Boolean).map(Number),
  )].sort((a, b) => a - b);
  const batches = [];
  for (const n of nums) {
    const prevBatch = prevBatches.find((b) => b.batch === n) ?? null;
    batches.push(await resolveBatch({ run, option, n, reportsDir, prevBatch }));
  }
  return { block: buildOptionBlock(batches, pricing), batches };
}

// ---------------------------------------------------------------------------------------------
// Per-run assembly
// ---------------------------------------------------------------------------------------------

export async function computeRunCosts({ run, reportsDir = DEFAULT_REPORTS_DIR, pricingPath = DEFAULT_PRICING_PATH }) {
  const runDir = path.join(reportsDir, run);
  const runJsonPath = path.join(runDir, "run.json");
  if (!existsSync(runJsonPath)) throw new Error(`no run.json under ${runDir}`);
  const runJson = JSON.parse(readFileSync(runJsonPath, "utf8"));
  const options = runJson.options ?? [];

  const prevCostsPath = path.join(runDir, "costs.json");
  const prevCosts = existsSync(prevCostsPath) ? JSON.parse(readFileSync(prevCostsPath, "utf8")) : null;
  const pricing = loadPricing(pricingPath);

  const optionBlocks = {};
  const batchesByOption = {};
  for (const option of options) {
    const prevBatches = prevCosts?.batches?.[option] ?? [];
    const { block, batches } = await computeOption({ run, option, reportsDir, prevBatches, pricing });
    optionBlocks[option] = block;
    batchesByOption[option] = batches;
  }

  let wallClockSeconds = null;
  const scoresPath = path.join(runDir, "scores.json");
  if (existsSync(scoresPath)) {
    try { wallClockSeconds = JSON.parse(readFileSync(scoresPath, "utf8"))?.costs?.wallClockSeconds ?? null; } catch { /* ignore */ }
  }

  let costs = {
    schemaVersion: 2, run, computedAt: new Date().toISOString(), computedBy: "aggregate-costs.mjs",
    pricingVersion: pricing.schemaVersion, wallClockSeconds,
    options: optionBlocks, batches: batchesByOption,
  };

  // Deterministic re-runs: if nothing about the computed content changed since the last run,
  // keep the old timestamp so costs.json (and everything derived from it) is byte-identical.
  if (prevCosts) {
    const strip = (c) => JSON.stringify({ ...c, computedAt: null });
    if (strip(costs) === strip(prevCosts)) costs = { ...costs, computedAt: prevCosts.computedAt };
  }

  return costs;
}

// ---------------------------------------------------------------------------------------------
// File actions (each returns {path, before, after, changed, apply()}; nothing is written until apply())
// ---------------------------------------------------------------------------------------------

function fileAction(filePath, after, { warning } = {}) {
  const before = existsSync(filePath) ? readFileSync(filePath, "utf8") : null;
  return { path: filePath, before, after, changed: before !== after, warning, apply: () => writeFileSync(filePath, after) };
}

export function writeCostsJsonAction(runDir, costs) {
  return fileAction(path.join(runDir, "costs.json"), JSON.stringify(costs, null, 2) + "\n");
}

export function patchScores(runDir, costs) {
  const p = path.join(runDir, "scores.json");
  if (!existsSync(p)) return { path: p, before: null, after: null, changed: false, warning: "scores.json not found, skipped", apply: () => {} };
  const before = readFileSync(p, "utf8");
  let scores;
  try { scores = JSON.parse(before); } catch { return { path: p, before, after: before, changed: false, warning: "scores.json unparsable, skipped", apply: () => {} }; }
  scores.options ??= {};
  for (const [option, block] of Object.entries(costs.options)) {
    scores.options[option] ??= {};
    scores.options[option].costs = block;
  }
  const after = JSON.stringify(scores, null, 2) + "\n";
  return { path: p, before, after, changed: before !== after, apply: () => writeFileSync(p, after) };
}

export function patchReportHtml(runDir, costs) {
  const p = path.join(runDir, "report.html");
  if (!existsSync(p)) return { path: p, before: null, after: null, changed: false, warning: "report.html not found, skipped", apply: () => {} };
  const html = readFileSync(p, "utf8");
  const m = html.match(/(<script type="application\/json" id="report-data">)(.*?)(<\/script>)/s);
  if (!m) return { path: p, before: html, after: html, changed: false, warning: "report-data block not found, skipped", apply: () => {} };
  let data;
  try { data = JSON.parse(m[2]); } catch { return { path: p, before: html, after: html, changed: false, warning: "report-data JSON unparsable, skipped", apply: () => {} }; }
  if (data.scores) {
    data.scores.options ??= {};
    for (const [option, block] of Object.entries(costs.options)) {
      data.scores.options[option] ??= {};
      data.scores.options[option].costs = block;
    }
    data.scores.costs = { ...(data.scores.costs ?? {}), wallClockSeconds: costs.wallClockSeconds };
  }
  const json = JSON.stringify(data).replace(/<\//g, "<\\/");
  const after = html.slice(0, m.index) + m[1] + json + m[3] + html.slice(m.index + m[0].length);
  return { path: p, before: html, after, changed: after !== html, apply: () => writeFileSync(p, after) };
}

export function buildRunCostMarkdown(costs) {
  const rows = Object.entries(costs.options).map(([option, b]) => {
    const nonCache = b.tokens?.nonCache?.toLocaleString?.() ?? "n/a";
    const cacheRead = b.tokens?.cacheRead?.toLocaleString?.() ?? "n/a";
    const hitPct = b.cacheHitRate != null ? `${(b.cacheHitRate * 100).toFixed(1)}%` : "n/a";
    const usd = b.costUsdEstimate?.total != null ? `$${b.costUsdEstimate.total.toFixed(2)}` : "n/a";
    return `| ${option} | ${b.agents} (${b.batches}) | ${b.requests ?? "n/a"} | ${nonCache} | ${cacheRead} | ${hitPct} | ${usd} | ${b.toolCalls ?? "n/a"} | ${b.agentTimeSecondsSummed ?? "n/a"}s | ${b.source ?? "n/a"} |`;
  });
  const allWarnings = Object.values(costs.options).flatMap((b) => b.warnings ?? []);
  const lines = [
    "## Run cost", "",
    `${DEFINITION} Written by \`scripts/aggregate-costs.mjs\`, never by hand.`, "",
    "| Option | Discover agents (batches) | Requests | Non-cache tokens | Cache-read tokens | Cache hit % | Est. USD | Tool calls | Summed agent time | Source |",
    "| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |",
    ...rows,
    "",
    `Wall-clock duration of the run: ${costs.wallClockSeconds ?? "n/a"}s.`,
  ];
  if (allWarnings.length) lines.push("", `Cost audit warnings (\`costs.warnings\`): ${allWarnings.join("; ")}`);
  return lines.join("\n") + "\n";
}

export function patchReportMd(runDir, costs) {
  const p = path.join(runDir, "kb-quality-report.md");
  if (!existsSync(p)) return { path: p, before: null, after: null, changed: false, warning: "kb-quality-report.md not found, skipped", apply: () => {} };
  const md = readFileSync(p, "utf8");
  const start = md.indexOf("## Run cost");
  if (start === -1) return { path: p, before: md, after: md, changed: false, warning: "## Run cost section not found, skipped", apply: () => {} };
  const afterStart = md.slice(start + 1);
  const nextIdx = afterStart.indexOf("\n## ");
  const end = nextIdx === -1 ? md.length : start + 1 + nextIdx + 1;
  const section = buildRunCostMarkdown(costs).replace(/\n+$/, "\n") + "\n";
  const after = md.slice(0, start) + section + md.slice(end);
  return { path: p, before: md, after, changed: after !== md, apply: () => writeFileSync(p, after) };
}

// ---------------------------------------------------------------------------------------------
// Cross-run overview
// ---------------------------------------------------------------------------------------------

const OVERVIEW_KEY_ORDER = [
  "run", "option", "access", "corpus", "model", "label", "source", "generatedAt",
  "overallPct", "overallStatus", "developerPct", "functionalPct", "findable", "edgePass", "gapPass",
  "pass", "partly", "fail", "unavailable", "unscored", "weakestDimension",
  "nonCacheTokens", "cacheReadTokens", "cacheHitPct", "costUsd", "requests", "toolCalls",
  "agentTimeSeconds", "wallClockSeconds", "costsScope", "costsSource", "costsSchemaVersion", "costModel",
  "reportPath", "htmlPath",
];

function orderRecord(rec) {
  const out = {};
  for (const k of OVERVIEW_KEY_ORDER) if (k in rec) out[k] = rec[k];
  for (const k of Object.keys(rec)) if (!(k in out)) out[k] = rec[k];
  return out;
}

function readRunsData(overviewHtmlPath) {
  if (!existsSync(overviewHtmlPath)) return [];
  const html = readFileSync(overviewHtmlPath, "utf8");
  const m = html.match(/<script type="application\/json" id="runs-data">(.*?)<\/script>/s);
  if (!m) return [];
  try { return JSON.parse(m[1]); } catch { return []; }
}

function isSimpleRecord(rec) {
  return Boolean((rec.option && rec.option.endsWith("-simple")) || (rec.run && String(rec.run).startsWith("simple-")));
}

const NULL_COST_FIELDS = {
  nonCacheTokens: null, cacheReadTokens: null, cacheHitPct: null, costUsd: null,
  requests: null, toolCalls: null, agentTimeSeconds: null,
  costsScope: null, costsSchemaVersion: null, costModel: null,
};

export function normaliseOverviewRecord(rec, reportsDir, costsCache) {
  const out = { ...rec };
  delete out.totalTokens;
  delete out.totalToolCalls;

  const runDir = rec.run ? path.join(reportsDir, rec.run) : null;
  const hasRunJson = Boolean(runDir && existsSync(path.join(runDir, "run.json")));

  if (isSimpleRecord(rec) || !hasRunJson) {
    Object.assign(out, NULL_COST_FIELDS, { costsSource: "none" });
    return orderRecord(out);
  }

  if (!costsCache.has(rec.run)) {
    const p = path.join(runDir, "costs.json");
    let parsed = null;
    if (existsSync(p)) { try { parsed = JSON.parse(readFileSync(p, "utf8")); } catch { parsed = null; } }
    costsCache.set(rec.run, parsed);
  }
  const costsJson = costsCache.get(rec.run);
  const optKey = rec.option ?? (rec.source ? `${rec.source}-wiki` : null);
  const block = costsJson?.options?.[optKey];

  if (!block) {
    Object.assign(out, NULL_COST_FIELDS, { costsSource: "legacy" });
    return orderRecord(out);
  }

  Object.assign(out, {
    nonCacheTokens: block.tokens?.nonCache ?? null,
    cacheReadTokens: block.tokens?.cacheRead ?? null,
    cacheHitPct: block.cacheHitRate != null ? round2(block.cacheHitRate * 100) : null,
    costUsd: block.costUsdEstimate?.total ?? null,
    requests: block.requests ?? null,
    toolCalls: block.toolCalls ?? null,
    agentTimeSeconds: block.agentTimeSecondsSummed ?? null,
    wallClockSeconds: costsJson.wallClockSeconds ?? out.wallClockSeconds ?? null,
    costsScope: block.scope ?? "discover",
    costsSource: block.source ?? "transcript",
    costsSchemaVersion: costsJson.schemaVersion ?? null,
    costModel: block.model?.name ?? null,
  });
  return orderRecord(out);
}

function recordKey(r) { return `${r.run}|${r.option ?? r.source ?? ""}`; }

// Builds one overview-table upsert record per option of a run, from that run's scores.json —
// the missing half of "regenerates reports/overview.html … from … every run folder on disk":
// regenerateOverview only ever re-normalises rows already in runs-data, so without this a run's
// row is never inserted on its first aggregate-costs.mjs pass, no matter how many times it runs.
export function buildOverviewRecordsFromScores(run, reportsDir = DEFAULT_REPORTS_DIR) {
  const scoresPath = path.join(reportsDir, run, "scores.json");
  if (!existsSync(scoresPath)) return [];
  let scores;
  try { scores = JSON.parse(readFileSync(scoresPath, "utf8")); } catch { return []; }
  if (scores.mode === "compare") return [];

  const records = [];
  for (const [option, opt] of Object.entries(scores.options ?? {})) {
    const counts = opt.counts ?? {};
    const countedCases = (counts.pass ?? 0) + (counts.partly ?? 0) + (counts.fail ?? 0) + (counts.unavailable ?? 0);
    const unscored = Math.max(0, (opt.cases?.length ?? countedCases) - countedCases);
    const findabilityTotal = (opt.findability?.pass ?? 0) + (opt.findability?.fail ?? 0);
    records.push(orderRecord({
      run,
      option,
      access: opt.access ?? null,
      corpus: opt.corpus ?? scores.corpus?.name ?? null,
      model: scores.model ?? null,
      label: scores.label ?? "",
      generatedAt: scores.generatedAt ?? null,
      overallPct: opt.averages?.overall ?? null,
      overallStatus: opt.status ?? null,
      developerPct: opt.averages?.developer ?? null,
      functionalPct: opt.averages?.functional ?? null,
      findable: findabilityTotal ? `${opt.findability.pass}/${findabilityTotal}` : null,
      edgePass: opt.edge ? `${opt.edge.pass}/${opt.edge.total}` : null,
      gapPass: opt.gap ? `${opt.gap.pass}/${opt.gap.total}` : null,
      pass: counts.pass ?? null,
      partly: counts.partly ?? null,
      fail: counts.fail ?? null,
      unavailable: counts.unavailable ?? null,
      unscored,
      weakestDimension: opt.weakestDimension ?? null,
      wallClockSeconds: scores.costs?.wallClockSeconds ?? null,
      reportPath: `reports/${run}/kb-quality-report.md`,
      htmlPath: `reports/${run}/report.html`,
    }));
  }
  return records;
}

// costsOverrides: { [run]: costsJsonObject } — lets the caller hand in a costs.json it has just
// computed (or is about to write, under --check) without needing it on disk yet: costs.json and
// overview.html are two files derived from the same in-memory `costs`, computed once.
export function regenerateOverview({ reportsDir = DEFAULT_REPORTS_DIR, templatePath = DEFAULT_TEMPLATE_PATH, outPath, upserts = [], costsOverrides = {} } = {}) {
  const overviewPath = outPath ?? path.join(reportsDir, "overview.html");
  let data = readRunsData(overviewPath);
  for (const rec of upserts) {
    const idx = data.findIndex((r) => recordKey(r) === recordKey(rec));
    if (idx === -1) data.push(rec); else data[idx] = { ...data[idx], ...rec };
  }

  const costsCache = new Map(Object.entries(costsOverrides));
  data = data.map((r) => normaliseOverviewRecord(r, reportsDir, costsCache));
  data.sort((a, b) => {
    if (!a.generatedAt && !b.generatedAt) return 0;
    if (!a.generatedAt) return 1;
    if (!b.generatedAt) return -1;
    return a.generatedAt < b.generatedAt ? 1 : a.generatedAt > b.generatedAt ? -1 : 0;
  });
  data = data.slice(0, 200);

  const template = readFileSync(templatePath, "utf8");
  const payload = JSON.stringify(data).replace(/<\//g, "<\\/");
  const after = template.replace(
    /(<script type="application\/json" id="runs-data">)(.*?)(<\/script>)/s,
    (_full, a, _b, c) => `${a}${payload}${c}`,
  );
  return fileAction(overviewPath, after);
}

// ---------------------------------------------------------------------------------------------
// --all discovery
// ---------------------------------------------------------------------------------------------

export function discoverRuns(reportsDir = DEFAULT_REPORTS_DIR) {
  if (!existsSync(reportsDir)) return [];
  const runs = [];
  for (const name of readdirSync(reportsDir)) {
    const runDir = path.join(reportsDir, name);
    if (!statSync(runDir).isDirectory()) continue;
    const runJsonPath = path.join(runDir, "run.json");
    if (!existsSync(runJsonPath)) continue;
    let runJson;
    try { runJson = JSON.parse(readFileSync(runJsonPath, "utf8")); } catch { continue; }
    const options = runJson.options ?? [];
    const hasBatches = options.some((opt) => {
      const dir = path.join(runDir, "raw", opt);
      return existsSync(dir) && readdirSync(dir).some((f) => /^batch-\d+\.(?:calls|meta)\.json$/.test(f));
    });
    if (hasBatches) runs.push(name);
  }
  return runs.sort();
}

// ---------------------------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------------------------

function fmt(n) { return n == null ? "n/a" : n.toLocaleString(); }

function summariseRun(run, costs) {
  const lines = [`${run}:`];
  for (const [option, b] of Object.entries(costs.options)) {
    const hit = b.cacheHitRate != null ? `${(b.cacheHitRate * 100).toFixed(1)}%` : "n/a";
    const usd = b.costUsdEstimate?.total != null ? `$${b.costUsdEstimate.total.toFixed(2)}` : "n/a";
    lines.push(
      `  ${option}: agents ${b.agents} (batches ${b.batches}, retries ${b.retries}) · requests ${fmt(b.requests)} · ` +
      `non-cache ${fmt(b.tokens?.nonCache)} · cache-read ${fmt(b.tokens?.cacheRead)} · hit ${hit} · est ${usd} (${b.model?.name ?? "unknown"}) · ` +
      `source ${b.source} · synthetic ${fmt(b.syntheticRecords)}`,
    );
    if (b.warnings.length) lines.push(`    warnings: ${b.warnings.join("; ")}`);
  }
  return lines.join("\n");
}

async function runOne(run, o) {
  const reportsDir = o.reportsDir;
  const runDir = path.join(reportsDir, run);
  const costs = await computeRunCosts({ run, reportsDir, pricingPath: o.pricingPath });

  const actions = [{ name: "costs.json", action: writeCostsJsonAction(runDir, costs) }];
  actions.push({ name: "scores.json", action: patchScores(runDir, costs) });
  if (!o.noPatchReports) {
    actions.push({ name: "report.html", action: patchReportHtml(runDir, costs) });
    actions.push({ name: "kb-quality-report.md", action: patchReportMd(runDir, costs) });
  }
  if (!o.noOverview) {
    const upserts = buildOverviewRecordsFromScores(run, reportsDir);
    actions.push({ name: "overview.html", action: regenerateOverview({ reportsDir, templatePath: o.templatePath, upserts, costsOverrides: { [run]: costs } }) });
  }

  const changed = actions.filter((a) => a.action.changed);
  if (!o.check) for (const a of actions) if (a.action.changed) a.action.apply();

  if (o.json) {
    process.stdout.write(JSON.stringify({ run, costs, changed: changed.map((a) => a.name) }, null, 2) + "\n");
  } else {
    process.stdout.write(summariseRun(run, costs) + "\n");
    for (const a of actions) {
      if (a.action.warning) process.stdout.write(`  [${a.name}] ${a.action.warning}\n`);
      else process.stdout.write(`  [${a.name}] ${a.action.changed ? (o.check ? "would change" : "written") : "unchanged"}\n`);
    }
  }
  return changed.length > 0;
}

async function main() {
  const o = args();
  const reportsDir = o["reports-dir"] ? path.resolve(o["reports-dir"]) : DEFAULT_REPORTS_DIR;
  const pricingPath = o.pricing ? path.resolve(o.pricing) : DEFAULT_PRICING_PATH;
  const templatePath = o.template ? path.resolve(o.template) : DEFAULT_TEMPLATE_PATH;
  const opts = {
    reportsDir, pricingPath, templatePath,
    check: Boolean(o.check), json: Boolean(o.json),
    noOverview: Boolean(o["no-overview"]), noPatchReports: Boolean(o["no-patch-reports"]),
  };

  if (o["overview-only"]) {
    const action = regenerateOverview({ reportsDir, templatePath });
    if (!opts.check && action.changed) action.apply();
    process.stdout.write(`overview.html: ${action.changed ? (opts.check ? "would change" : "written") : "unchanged"}\n`);
    process.exit(action.changed && opts.check ? 1 : 0);
  }

  let anyChanged = false;
  if (o.all) {
    const runs = discoverRuns(reportsDir);
    for (const run of runs) anyChanged = (await runOne(run, opts)) || anyChanged;
    process.stdout.write(`${runs.length} run(s) processed.\n`);
  } else if (o.run) {
    const run = path.basename(String(o.run));
    anyChanged = await runOne(run, opts);
  } else {
    process.stderr.write("usage: aggregate-costs.mjs (--run <reports/run-id>|--all|--overview-only) [--check] [--json] ...\n");
    process.exit(2);
  }

  process.exit(opts.check && anyChanged ? 1 : 0);
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  main().catch((e) => {
    process.stderr.write(String((e && e.stack) || e) + "\n");
    process.exit(2);
  });
}
