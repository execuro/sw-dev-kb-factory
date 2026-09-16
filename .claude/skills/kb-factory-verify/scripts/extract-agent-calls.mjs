#!/usr/bin/env node
// extract-agent-calls.mjs — ground truth for kb-factory-verify.
//
// Streams sub-agent JSONL transcript(s) and emits the tool calls the agent ACTUALLY made, with
// the size of what came back, the full client-observed round-trip latency of each call, and the
// deduplicated token usage of the underlying API requests. The suite audits this instead of the
// agent's self-reported `toolCallLog`: a report is a claim about behaviour, a transcript is the
// behaviour.
//
// Usage:
//   node extract-agent-calls.mjs --transcript <path.jsonl>[,<path2.jsonl>] [--case-map <path.json>] [--out <path.json>]
//   node extract-agent-calls.mjs --find <agent-name> [--project-dir <dir>] [--out <path.json>]
//   node extract-agent-calls.mjs --run <run-id> --option <opt> --batch <n> --cases id,id,...
//       --project-dir <dir> [--since <ISO>] [--out <calls.json>] [--meta]
//
// --find globs ~/.claude/projects/<slug>/*/subagents/agent-a<agent-name>-*.jsonl and takes the
// newest match. --run/--option/--cases resolves the transcript(s) via the agent's harness sidecar
// (agentType) and its brief text (output directory + first Case:), including retries, and — with
// --meta — writes batch-<n>.meta.json itself in the existing `{ discover: {...} }` shape.
//
// Never buffers a transcript: files run to ~1.2 MB and 2,000+ of them exist on disk. One API
// response is stored as several JSONL records sharing message.id/requestId (thinking / tool_use /
// text), each carrying a usage block whose output_tokens grows until the last: foldUsage() keeps
// only the record with the greatest output_tokens per id, so usage is counted once per request.

import { createReadStream, existsSync, readFileSync, writeFileSync, appendFileSync, statSync, readdirSync, mkdirSync } from "node:fs";
import { createInterface } from "node:readline";
import { homedir } from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const SKILL_DIR = path.join(SCRIPT_DIR, "..");
const REPORTS_DIR = path.join(SKILL_DIR, "reports");

const ACCESS_TOOLS = new Set([
  "Read", "Grep", "Glob", "Bash",
  "mcp__ShopwareDevKnowledgeBase__list_docs",
  "mcp__ShopwareDevKnowledgeBase__grep_docs",
  "mcp__ShopwareDevKnowledgeBase__read_doc",
  "WebFetch", "WebSearch",
]);
// Excluded from retrievalCalls per scoring-rubric.md "Access cost".
const NON_RETRIEVAL = new Set(["Write", "mcp__ShopwareDevKnowledgeBase__kb_status", "SendMessage", "TodoWrite"]);

export function args(argv = process.argv.slice(2)) {
  const a = argv;
  const o = {};
  for (let i = 0; i < a.length; i++) {
    if (a[i].startsWith("--")) o[a[i].slice(2)] = (i + 1 >= a.length || a[i + 1].startsWith("--")) ? true : a[++i];
  }
  return o;
}

export function slugify(dir) {
  return String(dir).replace(/[^A-Za-z0-9]/g, "-");
}

// Strip the `[1m]` long-context suffix and a trailing `-YYYYMMDD` pin so "claude-sonnet-5[1m]"
// and "claude-sonnet-5-20260101" both key on "claude-sonnet-5". Alias mapping (e.g. friendly
// names to price-list keys) is pricing.json's job, not this module's.
export function normaliseModel(model) {
  if (typeof model !== "string" || !model) return model ?? null;
  return model.replace(/\[1m\]$/, "").replace(/-\d{8}$/, "");
}

function legacyFindTranscript(name, projectDir) {
  // Claude Code's project-dir slug: every non-alphanumeric character becomes "-" (dots included).
  const slug = slugify(projectDir || process.cwd());
  const root = path.join(homedir(), ".claude", "projects", slug);
  if (!existsSync(root)) return null;
  const hits = [];
  for (const session of readdirSync(root)) {
    const dir = path.join(root, session, "subagents");
    if (!existsSync(dir)) continue;
    for (const f of readdirSync(dir)) {
      if (f.startsWith(`agent-a${name}-`) && f.endsWith(".jsonl")) {
        const p = path.join(dir, f);
        hits.push({ p, mtime: statSync(p).mtimeMs });
      }
    }
  }
  if (!hits.length) return null;
  hits.sort((x, y) => y.mtime - x.mtime);
  return hits[0].p;
}

// Size of what a tool handed back, in bytes and (where meaningful) lines.
function resultSize(tur) {
  if (tur == null) return { bytes: 0, lines: 0, empty: true };
  let text = null;
  if (typeof tur === "string") text = tur;
  else if (typeof tur === "object") {
    text = tur.stdout ?? tur.raw ?? tur.content ?? tur.file?.content ?? null;
    if (text == null && Array.isArray(tur.matches)) text = tur.matches.map((m) => m.text ?? "").join("\n");
    if (typeof text !== "string") text = JSON.stringify(tur);
  } else text = String(tur);
  const bytes = Buffer.byteLength(text, "utf8");
  const lines = text ? text.split("\n").length : 0;
  // "Dead end" = a search that returned nothing useful.
  const empty =
    bytes === 0 ||
    /^\s*(no matches found|no files found)/i.test(text) ||
    (typeof tur === "object" && Array.isArray(tur.matches) && tur.matches.length === 0) ||
    (typeof tur === "object" && Array.isArray(tur.files) && tur.files.length === 0);
  return { bytes, lines, empty };
}

// The paths/URLs a report cites, taken from the report JSON the agent passed to Write. Strings
// carry a trailing `:N` / `:N-M` line range; vanilla cites `{ url, quote }` objects.
function citedPaths(content) {
  let report;
  try { report = JSON.parse(String(content ?? "")); } catch { return []; }
  const out = new Set();
  for (const c of Array.isArray(report?.citations) ? report.citations : []) {
    const raw = typeof c === "string" ? c : (c?.url ?? c?.path ?? "");
    const p = String(raw).replace(/#[^:#]*$/, "").replace(/:\d+(-\d+)?$/, "").replace(/^https?:\/\//, "").trim();
    if (p) out.add(p);
  }
  return [...out];
}

// Does this call touch the cited path? `Read`/`read_doc`/`WebFetch` name it directly; the fs
// options reach it through a Bash command string (grep/sed/head <path>), often by absolute path,
// so the last three segments are enough to recognise it.
function callMatches(c, p) {
  const a = c.args ?? {};
  const t = [a.path, a.file_path, a.url, a.command].filter((v) => typeof v === "string").join(" ");
  if (!t) return false;
  const tail = p.split("/").slice(-3).join("/");
  return t.includes(p) || t.includes(tail);
}

function percentile(sorted, p) {
  if (!sorted.length) return null;
  const i = Math.min(sorted.length - 1, Math.floor((sorted.length * p) / 100));
  return sorted[i];
}

const retrievalOk = (c) => ACCESS_TOOLS.has(c.tool) && !NON_RETRIEVAL.has(c.tool) && !c.isError;

// A `<synthetic>` record is the harness's placeholder for an API error (rate limit, quota): the
// model tag says so outright, or — belt and braces — the usage block is all-zero and the sole
// content block reads like an error/limit notice rather than agent output.
function isSyntheticRecord(rec) {
  const msg = rec.message ?? {};
  if (msg.model === "<synthetic>") return true;
  const u = msg.usage ?? {};
  const allZero = !(u.input_tokens || u.output_tokens || u.cache_read_input_tokens || u.cache_creation_input_tokens);
  if (!allZero) return false;
  const content = Array.isArray(msg.content) ? msg.content : [];
  return content.some((b) => b?.type === "text" && /error|limit/i.test(b.text ?? ""));
}

// One usage block per API message id (the record carrying the final output_tokens; ties -> last).
export function foldUsage(records) {
  const byKey = new Map();
  let order = 0;
  for (const rec of records) {
    const msg = rec?.message;
    if (!msg) continue;
    order++;
    const key = msg.id ?? rec.requestId ?? `noid-${order}`;
    const outputTokens = msg.usage?.output_tokens ?? 0;
    const prev = byKey.get(key);
    if (!prev || outputTokens >= prev.outputTokens) byKey.set(key, { rec, outputTokens });
  }

  let requests = 0;
  let syntheticRecords = 0;
  let longContextRequests = 0;
  let fallback5mUsed = false;
  const tokens = { input: 0, output: 0, cacheCreation: 0, cacheCreation5m: 0, cacheCreation1h: 0, cacheRead: 0 };
  const byModel = {};
  const warnings = [];

  for (const { rec, outputTokens } of byKey.values()) {
    if (isSyntheticRecord(rec)) { syntheticRecords++; continue; }
    requests++;
    const msg = rec.message;
    const u = msg.usage ?? {};
    const input = u.input_tokens ?? 0;
    const cacheRead = u.cache_read_input_tokens ?? 0;
    const cacheCreation = u.cache_creation_input_tokens ?? 0;
    let c5m = u.cache_creation?.ephemeral_5m_input_tokens;
    let c1h = u.cache_creation?.ephemeral_1h_input_tokens;
    if (c5m == null && c1h == null) { c5m = cacheCreation; c1h = 0; fallback5mUsed = true; }
    else { c5m = c5m ?? 0; c1h = c1h ?? 0; }

    tokens.input += input;
    tokens.output += outputTokens;
    tokens.cacheCreation += cacheCreation;
    tokens.cacheCreation5m += c5m;
    tokens.cacheCreation1h += c1h;
    tokens.cacheRead += cacheRead;

    const model = normaliseModel(msg.model) ?? "unknown";
    byModel[model] ??= { requests: 0, input: 0, output: 0, cacheCreation: 0, cacheRead: 0 };
    byModel[model].requests++;
    byModel[model].input += input;
    byModel[model].output += outputTokens;
    byModel[model].cacheCreation += cacheCreation;
    byModel[model].cacheRead += cacheRead;

    if (input + cacheRead + cacheCreation > 200_000) longContextRequests++;
  }
  if (fallback5mUsed) {
    warnings.push("usage.cache_creation.ephemeral_5m/1h_input_tokens missing on some records; used cache_creation_input_tokens as the 5m fallback");
  }

  return {
    requests,
    assistantRecords: records.length,
    syntheticRecords,
    tokens,
    byModel,
    models: Object.keys(byModel).sort(),
    longContextRequests,
    dedup: "message-id",
    warnings,
  };
}

export function readSidecar(transcriptPath) {
  const p = transcriptPath.replace(/\.jsonl$/, ".meta.json");
  if (!existsSync(p)) return null;
  try { return JSON.parse(readFileSync(p, "utf8")); } catch { return null; }
}

function briefText(userRecord) {
  const content = userRecord?.message?.content;
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content.filter((b) => b?.type === "text").map((b) => b.text ?? "").join("\n");
  }
  return "";
}

// Read only as far as the first `type:"user"` record (normally the very first line): that is the
// agent's brief, which carries `Output directory: .../reports/<run>/raw/<option>/` and one
// `Case: <id>` line per case it was asked to work.
async function readBrief(transcriptPath) {
  const rl = createInterface({ input: createReadStream(transcriptPath, { encoding: "utf8" }), crlfDelay: Infinity });
  try {
    for await (const line of rl) {
      if (!line.trim()) continue;
      let rec;
      try { rec = JSON.parse(line); } catch { continue; }
      if (rec.type === "user") return briefText(rec);
    }
  } finally {
    rl.close();
  }
  return null;
}

// Stream one transcript into its tool calls (with pairing/latency/size) and the raw `type:
// "assistant"` records (for foldUsage). seqOffset lets extractBatch keep `seq` continuous across
// retried transcripts. tool_use/tool_result pairing never crosses a transcript boundary — a retry
// is a fresh agent context.
async function extractTranscript(transcriptPath, { seqOffset = 0 } = {}) {
  const pending = new Map();
  const calls = [];
  const rawAssistantRecords = [];
  let turnsWithAccess = 0;

  const rl = createInterface({ input: createReadStream(transcriptPath, { encoding: "utf8" }), crlfDelay: Infinity });
  for await (const line of rl) {
    if (!line.trim()) continue;
    let rec;
    try { rec = JSON.parse(line); } catch { continue; }
    const msg = rec.message;
    if (!msg) continue;

    if (rec.type === "assistant" && Array.isArray(msg.content)) {
      rawAssistantRecords.push(rec);
      let turnHasAccess = false;
      for (const b of msg.content) {
        if (b?.type !== "tool_use") continue;
        const call = {
          seq: seqOffset + calls.length + 1,
          ts: rec.timestamp ?? null,
          tool: b.name,
          args: b.input ?? {},
          resultBytes: null, resultLines: null, latencyMs: null, empty: null,
          caseId: null,
        };
        calls.push(call);
        pending.set(b.id, call);
        if (ACCESS_TOOLS.has(b.name) && !NON_RETRIEVAL.has(b.name)) turnHasAccess = true;
      }
      if (turnHasAccess) turnsWithAccess++;
    } else if (rec.type === "user") {
      const blocks = Array.isArray(msg.content) ? msg.content : [];
      for (const b of blocks) {
        if (b?.type !== "tool_result") continue;
        const call = pending.get(b.tool_use_id);
        if (!call) continue;
        const size = resultSize(rec.toolUseResult ?? b.content);
        call.resultBytes = size.bytes;
        call.resultLines = size.lines;
        // A failed attempt (rate-limit gate, permission error) returned no corpus content: it is
        // neither a retrieval nor a dead end, and never something the agent had to self-report.
        call.isError = b.is_error === true || /^Error:/.test(typeof rec.toolUseResult === "string" ? rec.toolUseResult : "");
        call.empty = call.isError || size.empty;
        if (call.ts && rec.timestamp) call.latencyMs = Date.parse(rec.timestamp) - Date.parse(call.ts);
        pending.delete(b.tool_use_id);
      }
    }
  }

  const stamps = calls.map((c) => c.ts).filter(Boolean).sort();
  return { calls, turnsWithAccess, rawAssistantRecords, unpairedCalls: pending.size, stamps };
}
export { extractTranscript };

// Runs extractTranscript over every transcript of a batch (in order — retries appended), then the
// existing case-attribution pass over the merged call list, plus a deduplicated usage fold.
export async function extractBatch({ transcripts, caseOrder = null, expectAgentType = null, sidecars = [] }) {
  const transcriptList = Array.isArray(transcripts) ? transcripts : [transcripts];
  let calls = [];
  let turnsWithAccess = 0;
  let rawAssistantRecords = [];
  let unpairedCalls = 0;
  const stamps = [];

  for (const t of transcriptList) {
    const r = await extractTranscript(t, { seqOffset: calls.length });
    calls = calls.concat(r.calls);
    turnsWithAccess += r.turnsWithAccess;
    rawAssistantRecords = rawAssistantRecords.concat(r.rawAssistantRecords);
    unpairedCalls += r.unpairedCalls;
    stamps.push(...r.stamps);
  }
  stamps.sort();

  // Attribute each call to a case. The agents write <case-id>.json as each case finishes, so the
  // FIRST Write of a case's report closes that case's segment. A failed Write that the agent
  // retries later must not close a second segment under the old id: by then the agent has moved
  // on, and the calls in between belong to the next case.
  const closed = new Set();
  const reports = new Map(); // caseId -> { writeSeq, content, failed }
  let segment = [];
  for (const c of calls) {
    segment.push(c);
    if (c.tool !== "Write") continue;
    const m = String(c.args.file_path ?? "").match(/([a-z]+-\d+)\.json$/i);
    if (!m) continue;
    const id = m[1];
    const prev = reports.get(id);
    if (!prev || (prev.failed && !c.isError)) {
      reports.set(id, { writeSeq: prev?.writeSeq ?? c.seq, content: c.args.content, failed: c.isError === true });
    }
    if (closed.has(id)) { c.caseId = id; continue; } // a retried Write is that case's bookkeeping
    closed.add(id);
    for (const s of segment) s.caseId ??= id;
    segment = [];
  }

  const order = [...reports.entries()].sort((a, b) => a[1].writeSeq - b[1].writeSeq);
  const cites = new Map(order.map(([id, r]) => [id, citedPaths(r.content)]));

  // Look-ahead reads: a page the segment's case never cites but a later case does was read for
  // that later case (typically right after a failed Write), so it is re-stamped there.
  for (const c of calls) {
    if (!retrievalOk(c) || !c.caseId || !reports.has(c.caseId)) continue;
    if ((cites.get(c.caseId) ?? []).some((p) => callMatches(c, p))) continue;
    const ownWrite = reports.get(c.caseId).writeSeq;
    const later = order.find(([id, r]) => r.writeSeq > ownWrite && cites.get(id).some((p) => callMatches(c, p)));
    if (later) { c.caseId = later[0]; c.attribution = "citation"; }
  }

  // Reuse: a page read earlier in the batch and cited again by a later case is a legitimate
  // zero-cost citation ("reused"), not a fabricated one. Only a citation no call in the batch
  // backs is unbacked.
  const perCase = {};
  for (const [id, r] of order) {
    const own = calls.filter((c) => c.caseId === id);
    const ownRetrieval = own.filter(retrievalOk);
    const reused = [], unbackedCitations = [];
    for (const p of cites.get(id)) {
      if (ownRetrieval.some((c) => callMatches(c, p))) continue;
      const earlier = calls.filter((c) => c.seq < r.writeSeq && retrievalOk(c) && callMatches(c, p)).pop();
      if (earlier) reused.push({ path: p, seq: earlier.seq, fromCase: earlier.caseId });
      else unbackedCitations.push(p);
    }
    perCase[id] = {
      seqs: own.map((c) => c.seq),
      retrievalCalls: ownRetrieval.length,
      failedAttempts: own.filter((c) => c.isError === true).length,
      reused,
      unbackedCitations,
    };
  }

  const retrieval = calls.filter(retrievalOk);
  const lat = retrieval.map((c) => c.latencyMs).filter((v) => typeof v === "number" && v >= 0).sort((a, b) => a - b);
  const usage = foldUsage(rawAssistantRecords);

  const warnings = [...usage.warnings];
  let agentTypeMismatch = false;
  for (const s of sidecars) {
    if (s?.agentType && expectAgentType && s.agentType !== expectAgentType) agentTypeMismatch = true;
  }
  if (agentTypeMismatch) warnings.push(`sidecar agentType does not match expected "${expectAgentType}"`);

  return {
    agent: expectAgentType ?? sidecars[0]?.agentType ?? null,
    transcript: transcriptList.length === 1 ? transcriptList[0] : transcriptList,
    transcripts: transcriptList,
    sidecars,
    agentType: sidecars.find((s) => s?.agentType)?.agentType ?? expectAgentType ?? null,
    agentTypeMismatch,
    groundTruth: true,
    extractorVersion: 2,
    calls,
    totals: {
      toolCalls: calls.length,
      retrievalCalls: retrieval.length,
      writes: calls.filter((c) => c.tool === "Write").length,
      deadEndCalls: retrieval.filter((c) => c.empty === true).length,
      retrievalBytes: retrieval.reduce((n, c) => n + (c.resultBytes ?? 0), 0),
      retrievalLines: retrieval.reduce((n, c) => n + (c.resultLines ?? 0), 0),
      retrievalTurns: turnsWithAccess,
      failedAttempts: calls.filter((c) => c.isError === true).length,
      toolLatencyMsP50: percentile(lat, 50),
      toolLatencyMsP90: percentile(lat, 90),
      unpairedCalls,
      firstTs: stamps[0] ?? null,
      lastTs: stamps[stamps.length - 1] ?? null,
      batchWallSeconds: stamps.length > 1 ? (Date.parse(stamps[stamps.length - 1]) - Date.parse(stamps[0])) / 1000 : null,
      subagentTokens: { input: usage.tokens.input, output: usage.tokens.output, cacheRead: usage.tokens.cacheRead, cacheCreation: usage.tokens.cacheCreation },
      usage,
      byTool: retrieval.reduce((m, c) => ((m[c.tool] = (m[c.tool] ?? 0) + 1), m), {}),
    },
    perCase,
    caseOrder: caseOrder ?? null,
    warnings,
  };
}

// Replaces findTranscript for the --run/--option/--cases CLI form. Three methods, tried in order,
// each returning every hit (retries included) so the caller can pass them all to extractBatch:
//   1. scan every ~/.claude/projects/<slug*>/*/subagents/agent-*.meta.json whose agentType matches
//      and whose sibling transcript's brief names this run+option+first-case.
//   2. reports/.transcript-index.jsonl, filtered the same way (survives transcript pruning).
//   3. the same scan widened to every project dir, not just ones matching the project-dir slug.
export async function findTranscripts({ run, option, cases, projectDir, since }, { writeIndex = false, indexPath } = {}) {
  const wantCase0 = Array.isArray(cases) && cases.length ? cases[0] : null;
  const agentType = `kb-factory-verify-discover-${option}`;
  const sinceMs = since ? Date.parse(since) : null;
  const suffix = `/reports/${run}/raw/${option}/`;
  const projectsRoot = path.join(homedir(), ".claude", "projects");
  const searched = [];

  async function scanProjectDirs(dirNames) {
    const hits = [];
    for (const projDir of dirNames) {
      const root = path.join(projectsRoot, projDir);
      if (!existsSync(root)) continue;
      for (const session of readdirSync(root)) {
        const dir = path.join(root, session, "subagents");
        if (!existsSync(dir)) continue;
        for (const f of readdirSync(dir)) {
          if (!f.endsWith(".meta.json")) continue;
          const metaPath = path.join(dir, f);
          searched.push(metaPath);
          let meta;
          try { meta = JSON.parse(readFileSync(metaPath, "utf8")); } catch { continue; }
          if (meta.agentType !== agentType) continue;
          const jsonl = metaPath.slice(0, -".meta.json".length) + ".jsonl";
          if (!existsSync(jsonl)) continue;
          const mtime = statSync(jsonl).mtimeMs;
          if (sinceMs && mtime < sinceMs) continue;
          const brief = await readBrief(jsonl);
          if (!brief || !brief.includes(suffix)) continue;
          if (wantCase0) {
            const m = brief.match(/^Case:\s*(\S+)/m);
            if (!m || m[1] !== wantCase0) continue;
          }
          hits.push({ transcript: jsonl, sidecar: metaPath, meta, mtime });
        }
      }
    }
    hits.sort((a, b) => a.mtime - b.mtime);
    return hits;
  }

  const idxPath = indexPath ?? path.join(REPORTS_DIR, ".transcript-index.jsonl");
  function recordIndex(hits) {
    if (!writeIndex || !hits.length) return;
    const lines = hits.map((h) => JSON.stringify({ run, option, case0: wantCase0, transcript: h.transcript, sidecar: h.sidecar, mtime: h.mtime }) + "\n").join("");
    try { appendFileSync(idxPath, lines); } catch { /* best effort */ }
  }

  if (existsSync(projectsRoot)) {
    const slug = slugify(projectDir || process.cwd());
    const matching = readdirSync(projectsRoot).filter((d) => d.startsWith(slug));
    const hits = await scanProjectDirs(matching);
    if (hits.length) { recordIndex(hits); return { hits, method: "scan", searched }; }
  }

  if (existsSync(idxPath)) {
    const idxHits = [];
    for (const line of readFileSync(idxPath, "utf8").split("\n")) {
      if (!line.trim()) continue;
      let e;
      try { e = JSON.parse(line); } catch { continue; }
      if (e.run !== run || e.option !== option) continue;
      if (wantCase0 && e.case0 !== wantCase0) continue;
      if (!existsSync(e.transcript)) continue;
      idxHits.push({ transcript: e.transcript, sidecar: e.sidecar ?? null, meta: e.sidecar && existsSync(e.sidecar) ? JSON.parse(readFileSync(e.sidecar, "utf8")) : null, mtime: e.mtime ?? 0 });
    }
    if (idxHits.length) { idxHits.sort((a, b) => a.mtime - b.mtime); return { hits: idxHits, method: "index", searched }; }
  }

  if (existsSync(projectsRoot)) {
    const slug = slugify(projectDir || process.cwd());
    const matching = readdirSync(projectsRoot).filter((d) => d.startsWith(slug));
    const rest = readdirSync(projectsRoot).filter((d) => !matching.includes(d));
    const legacyHits = await scanProjectDirs(rest);
    if (legacyHits.length) { recordIndex(legacyHits); return { hits: legacyHits, method: "legacy-scan", searched }; }
  }

  return { hits: [], method: "none", searched };
}

function readCaseOrder(o) {
  if (o["case-map"] && existsSync(o["case-map"])) return JSON.parse(readFileSync(o["case-map"], "utf8"));
  if (o.cases) return String(o.cases).split(",").map((s) => s.trim()).filter(Boolean);
  return null;
}

function emitNotFound(extra) {
  process.stdout.write(JSON.stringify({ groundTruth: false, calls: [], totals: null, ...extra }, null, 2) + "\n");
}

function usageSummaryLine(usage) {
  const hitRate = usage.tokens.input + usage.tokens.cacheCreation + usage.tokens.cacheRead > 0
    ? (usage.tokens.cacheRead / (usage.tokens.input + usage.tokens.cacheCreation + usage.tokens.cacheRead)) * 100
    : 0;
  const model = usage.models.length === 1 ? usage.models[0] : (usage.models.length ? "mixed" : "unknown");
  const nonCache = usage.tokens.input + usage.tokens.output + usage.tokens.cacheCreation;
  return `usage: ${usage.requests} requests · non-cache ${nonCache} · cache-read ${usage.tokens.cacheRead} · hit ${hitRate.toFixed(1)}% · model ${model}`;
}

function emitBatch(o, batch) {
  const json = JSON.stringify(batch, null, 2);
  if (o.out) {
    writeFileSync(o.out, json + "\n");
    process.stdout.write(JSON.stringify(batch.totals, null, 2) + "\n");
    process.stdout.write(usageSummaryLine(batch.totals.usage) + "\n");
  } else {
    process.stdout.write(json + "\n");
  }
}

function writeMetaFile(o, batch, reportsDir) {
  const dir = path.join(reportsDir, o.run, "raw", o.option);
  mkdirSync(dir, { recursive: true });
  const metaPath = path.join(dir, `batch-${o.batch}.meta.json`);
  const t = batch.totals;
  const meta = {
    discover: {
      cases: batch.caseOrder ?? [],
      groundTruth: batch.groundTruth,
      transcript: batch.transcript,
      retrievalCalls: t.retrievalCalls,
      retrievalBytes: t.retrievalBytes,
      retrievalLines: t.retrievalLines,
      deadEndCalls: t.deadEndCalls,
      retrievalTurns: t.retrievalTurns,
      toolLatencyMsP50: t.toolLatencyMsP50,
      toolLatencyMsP90: t.toolLatencyMsP90,
      batchWallSeconds: t.batchWallSeconds,
      subagentTokens: t.subagentTokens,
    },
  };
  writeFileSync(metaPath, JSON.stringify(meta, null, 2) + "\n");
}

async function main() {
  const o = args();

  if (o.transcript) {
    const list = String(o.transcript).split(",").map((s) => s.trim()).filter(Boolean);
    const missing = list.filter((p) => !existsSync(p));
    if (missing.length) return emitNotFound({ transcript: list.length === 1 ? list[0] : list, error: "transcript not found", missing });
    const batch = await extractBatch({ transcripts: list, caseOrder: readCaseOrder(o) });
    return emitBatch(o, batch);
  }

  if (o.find && !o.run) {
    const t = legacyFindTranscript(o.find, o["project-dir"]);
    if (!t) return emitNotFound({ agent: o.find, transcript: null, error: "transcript not found" });
    const batch = await extractBatch({ transcripts: [t], caseOrder: readCaseOrder(o) });
    return emitBatch(o, batch);
  }

  if (o.run && o.option) {
    const reportsDir = o["reports-dir"] ? path.resolve(o["reports-dir"]) : REPORTS_DIR;
    const cases = readCaseOrder(o) ?? [];
    const result = await findTranscripts(
      { run: o.run, option: o.option, cases, projectDir: o["project-dir"], since: o.since },
      { writeIndex: Boolean(o.out || o.meta), indexPath: path.join(reportsDir, ".transcript-index.jsonl") },
    );
    if (!result.hits.length) {
      return emitNotFound({ run: o.run, option: o.option, batch: o.batch ?? null, error: "no transcript found", searched: result.searched });
    }
    const transcripts = result.hits.map((h) => h.transcript);
    const sidecars = result.hits.map((h) => h.meta ?? null);
    const batch = await extractBatch({ transcripts, caseOrder: cases, expectAgentType: `kb-factory-verify-discover-${o.option}`, sidecars });
    if (o.meta) writeMetaFile(o, batch, reportsDir);
    return emitBatch(o, batch);
  }

  emitNotFound({ error: "no --transcript, --find, or --run+--option given" });
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  main().catch((e) => {
    process.stdout.write(JSON.stringify({ groundTruth: false, error: String(e && e.stack || e), calls: [], totals: null }, null, 2) + "\n");
    process.exit(0);
  });
}
