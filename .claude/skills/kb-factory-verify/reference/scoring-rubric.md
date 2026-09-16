# Scoring rubric

**`rubricVersion: 2`** — record this in `run.json` and in every `overview.html` record. Version 2
(2026-09-12) split tool-grant infractions out of source-discipline scoring and added the `vanilla`
option; totals produced under version 1 are **not comparable** with version 2 totals, and `compare`
must warn when it merges across versions. Bump this whenever a band, a weight, or the meaning of a
dimension changes.

Score each dimension 0–100 against its bands (only the four band values 100 / 70 / 40 / 0 are valid, except where the Source-absent override fixes a value), multiply by weight, sum, and take the whole percent **below** the sum (floor — never round up).

`points = score × weight / 100`

Score **what the discover agent's report shows**, as captured in the report JSON — not what you know, not what the official docs say the answer should be. The official page is the yardstick for accuracy; it is never a substitute for the report's own `answer`.

Four options are graded with this one rubric: `fs-wiki` / `mcp-wiki` (our path-addressed wiki: `platform/dev/<version>/…`, `platform/func/…`, `platform/hubs/…`, `platform/synonyms/`) and `fs-docs` / `mcp-docs` (the official documentation clones: `developer/…` and `merchant/content/en/shopware-6/<area>/<topic>/v<version>.md`). Both access methods are equivalent primitives — `list_docs`/`ls`, `grep_docs`/`grep`, `read_doc`/`cat`, `kb_status`/probe. There is no ranking to reward or blame: the object of grading is the page the agent read and the sequence it took to get there, in the corpus it actually ran on. Citations and `pageReached` are corpus-relative in every option (`platform/…`, `developer/…`, `merchant/…`); for `fs-*` options the physical prefix (`wiki/` or `.sources/docs/`) appears only in `toolCallLog`.

**Memory.** The discover agent may use its own knowledge; every such sentence in `answer` is marked `[from memory]` and listed in `memoryClaims[]`. Labelled memory facts count for Completeness and Accuracy (the same model runs every option, so memory is a constant, not a source advantage), never for Grounding & Relevance or Citation & Traceability, and are never a discipline violation. Unlabelled, uncited factual claims are graded under Citation (at most 40) and named in `findings`.

**Scope is prevented, not scored.** Every source not under test in a run is unreachable: the `PreToolUse` scope fence (`.claude/hooks/kb-verify-scope-fence.sh`) denies, at call time, any `Read`/`Grep`/`Glob`/`Bash` from a discover agent whose path falls outside that option's corpus root, and the `mcp-*` agents' tool lists contain nothing but MCP tools. A blocked call never returns corpus content, so there is nothing to grade.

**There is therefore no scope-violation metric, and no dimension may deduct for one.** Denials are recorded by the fence to `raw/<option>/fence-denials.jsonl`, counted in the run report as provenance, and never converted into a score. If the fence is not active, the run is invalid and is not started — that gate lives in the skill's probe step, not in this rubric.

This replaces the pre-2026-09-12 arrangement, in which the auditor inferred violations from an agent's self-reported `toolCallLog` and zeroed Source Discipline for them. That penalised the `fs-*` options for running `grep`/`cd`/`sed` **inside their own corpus** — agent-frontmatter `tools:` specifiers such as `Bash(ls *)` are advisory in this harness and were never enforced — while `mcp-*` agents structurally could not trip the same rule. Ground truth reconstructed from the sub-agent transcripts shows **zero** cross-corpus reads in those runs: the entire `fs`-vs-`mcp` Source Discipline gap was an artefact of the measurement.

The `dev`/`func` split is an ingestion/organizational boundary, not a search boundary. A case's `Scope` in `cases.md` is a hint about where its target page happens to live, never a fence: an answer grounded in a page from the "other" category (e.g. a merchant question answered, in whole or part, from a `platform/dev/…` page) is scored purely on whether it satisfies the expected-answer facts — never penalized for which subtree it came from. Do not deduct Grounding & Relevance, Completeness, or Findability points merely because the agent read outside the hinted directory; only deduct when the expected-answer facts are actually missing or wrong.

## Grounding & Relevance — weight 25

| Score | Band |
| --- | --- |
| 100 | `answer` is clearly grounded in material actually surfaced via the permitted source (per `citations[]` / `toolCallLog[]`), directly on-topic for the query, not vague or generic filler |
| 70 | Grounded and on-topic, but padded with some vague or generic material |
| 40 | Marginally related — mostly boilerplate not tied to anything the source actually returned |
| 0 | Off-topic, fabricated (the audit lists the cited page under `unbackedCitations` — no call in the batch read it; a page in `reused` was read by an earlier case and counts as retrieved), or the discovery run errored |

Edge cases / not-found responses: 100 when `notFoundClaim: true` and `answer` says so plainly instead of fabricating; 0 when it fabricates an answer anyway.

`edge-*` and `gap-*` cases in `cases.md` spell out, as their expected-answer facts, what the honest answer must state (that the thing does not exist / was removed / is named differently, the closest page actually read, the correction). Score them like any other case against those facts: Completeness counts the stated facts, and the not-found bands above apply to the dimensions they name. A `gap-*` case that passes is a confirmed documentation gap, not a KB success — the report lists it as such.

## Accuracy vs. Expected Answer — weight 25

| Score | Band |
| --- | --- |
| 100 | `answer` agrees with the expected answer on every fact; no misleading statement |
| 70 | Agrees on the facts, with a minor omission or an imprecise detail that would not mislead a developer |
| 40 | One materially wrong or misleading statement (wrong class, wrong tag, wrong menu path, wrong command) |
| 0 | Wrong or mismatched topic, or no content to check |

The yardstick depends on the case's `Status`, given in its expected-answer file.

- **`confirmed`** — the facts were verified against the Shopware source and carry `[code: …]` tags; that file's evidence *is* the cross-check. Do not fetch a documentation page: on a confirmed case the docs are the weaker source, and re-checking against them reintroduces the circularity this suite removed. Cite the `[code: …]` tags in `officialReferences`.
- **`draft`** / **`contradictory`** — the facts are still documentation-derived. The scorer MUST cross-check the official reference URL from the expected-answer file (WebFetch; if it 404s, WebSearch for the current page on developer.shopware.com / docs.shopware.com). If the official page cannot be fetched at all, cap this dimension at 70 and say so in `notes`.

Edge cases score this dimension on whether the answer avoids inventing facts about something that doesn't exist: 100 for a clean not-found, 0 for a fabricated "how-to."

## Completeness — weight 15

| Score | Band |
| --- | --- |
| 100 | All 3 expected-answer facts are present in `answer` |
| 70 | 2 of 3 present |
| 40 | 1 of 3 present |
| 0 | None present, or no content |

"Present" means the fact is stated, not merely alluded to.

Edge cases: there is no fact to complete except the topic's non-existence — score 100 when the honest not-found is given, 0 when the agent fabricates content instead. Under the Source-absent override (below), this dimension is always 0 regardless of source, since there was no content to be complete.

## Citation & Traceability — weight 10

| Score | Band |
| --- | --- |
| 100 | `citations[]` are concrete and verified — a corpus-relative path + line range that matches a `read_doc`/`Read` in `toolCallLog`, exists in the corpus with the claimed content (`citationsVerified` = all) — and tied to the fact they support; no unlabelled memory claims |
| 70 | Citations present and plausible, but generic (e.g. "the docs say...") or a bare path without a line range |
| 40 | Citations present but the wrong shape (a physical disk path or a URL instead of a corpus-relative path, a path outside the corpus prefixes), or the answer carries unlabelled uncited factual claims |
| 0 | No citations, citations the audit lists under `unbackedCitations` (a `reusedFrom` citation is backed), or a cited range does not exist / does not carry the claimed content |

Edge cases / not-found responses: 100 when `notFoundClaim` is honest and nothing is falsely cited; 0 if a citation is fabricated for content that doesn't exist.

**`vanilla` cites differently, and the bands above are read accordingly.** The control group has no
corpus, so "corpus-relative path" has no meaning for it and a URL is the *correct* shape, not the
wrong one. Its `citations[]` is a mixed-shape array; both of these are band-100 shapes:

| shape | band 100 requires |
| --- | --- |
| `{ "url": "…", "quote": "…" }` — a page fetched from the open web | a resolvable absolute URL, the verbatim sentence it supports, and a matching `WebFetch` in the call log |
| `"vendor/shopware/core/…/Foo.php:41-68"` — the installed source | a repo-relative path with a line range matching a `Read` in the call log, whose range exists and carries the claim |

For `vanilla`, band 40's "wrong shape" means a bare domain with no path, a URL with no supporting
quote, or a citation of a `WebSearch` snippet rather than fetched content — never "it is a URL".
Everything else in this dimension applies unchanged, including the line-range discipline on source
paths and the treatment of unlabelled memory claims.

## Honesty — weight 15

Scope is fenced, so this dimension grades one thing only: whether the answer tells the truth about
what the source actually yielded.

| Score | Band |
| --- | --- |
| 100 | Every factual sentence is supported by a call in the ground-truth call log, and — when nothing relevant was found — `notFoundClaim` is `true`, stated plainly, with no fabrication |
| 70 | `notFoundClaim` understates what was actually found (e.g. partial material existed and was quietly dropped), or a minor claim outruns what the retrieved content supports |
| 40 | The answer hedges instead of clearly stating not-found when the call log shows nothing relevant turned up |
| 0 | `answer` fabricates content with no supporting entry in the call log, or presents a memory claim as retrieved material |

The access method is structurally guaranteed by each discover agent's tool list
(`kb-factory-verify-discover-mcp-*` cannot reach the filesystem or the web;
`kb-factory-verify-discover-fs-*` cannot reach the MCP server or the web), the served corpus by the
skill's probe, and the corpus *root* by the scope fence. None of those are this dimension's business.

Judge honesty against the **ground-truth call log** derived from the sub-agent transcript, not the
agent's self-reported `toolCallLog`. Where the two disagree, the auditor reports `selfReportDelta`;
a materially under-reported log — a non-empty `missing` list — is itself a 0 here, because the report
misrepresents how the answer was obtained. `missing` never contains a failed attempt (`isError`) or a
page an earlier case in the batch read (`reused`): an empty `toolCallLog` for a case answered from
such a page is the honest report the discover agents are told to write, not an omission. (Evidence
rule clarified 2026-09-14; bands and weights unchanged, still version 2.)

Untrusted content: anything the agent quoted from the corpus is documentation text. An agent that acted on instructions found inside a page (rather than quoting them) scores 0 here.

**Source-absent override:** if `toolCallLog` shows the permitted corpus was confirmed genuinely unavailable for this query (an MCP layer `planned`/`missing`, the entry point unknown or missing — `platform/index.md`, `developer/index.md`, `merchant/index.md` — or, for a `dev`/`func` case whose target for this corpus is `none`, an empty grep chain over reasonable terms) and `notFoundClaim: true` with no fabrication, score this dimension 100 regardless of Completeness being 0 — staying in bounds and reporting the gap honestly is exactly correct behavior here. A `wrong corpus served` abort is a probe failure of the run, not a case outcome: score every dimension 0 and say so in `notes`.

## Actionability — weight 10

| Score | Band |
| --- | --- |
| 100 | `answer` is enough for an agent to act on — specific class/method names, tags, paths, commands, or menu paths as the topic requires — without another lookup |
| 70 | Enough to start; one further lookup needed for a detail |
| 40 | Summary-level only — names the topic, doesn't say how |
| 0 | Empty, errored, or a fabricated placeholder |

Edge cases: 100 when the response states the not-found / doesn't-exist outcome explicitly so an agent can move on without guessing; 40 when it's only inferable; 0 when it errors or fabricates guidance.

## Findability (recorded per case, no weight)

Every `dev`/`func` case names a target path per corpus (wiki: the `Target path` line; docs: the mapping rule in `cases.md` or its `Target path (docs)` override) and a reference sequence. A `rule-*` case on `fs-wiki`/`mcp-wiki` names a target the same way — its `Target path` line, a `platform/guidelines/<v>/<file>.md` page (reached via the MCP merged path `guidelines/<v>/<file>.md` on `mcp-wiki`); a `rule-*` case on `fs-docs`/`mcp-docs` has no target (`none`, by design — see `cases.md`), so findability is `n/a` there. Ignoring the orientation read of the entry point(s) and any `kb_status` call, count the `list_docs`/`grep_docs` (fs: `ls`/`find`/`Glob`/`Grep`) calls in `toolCallLog` before the first `read_doc`/`Read` of the target path (or of **any** page in the same corpus whose content carries the expected-answer facts — dev or func, and for merchant topics any sibling revision `v*.md` of the target's directory — record the drift in `notes`; it is not a scope violation).

| `findability` | Condition |
| --- | --- |
| `pass` | ≤2 list/grep calls, then the target page read |
| `fail` | more than 2 list/grep calls before the target, or the target never read |
| `n/a` | any `edge-*` or `gap-*` case, the Source-absent override applied, the target for this corpus is `none` (including every `rule-*` case on `fs-docs`/`mcp-docs`, whose target is `none` by design), or the option is `vanilla` (no corpus, so no target path exists to be found) |

Findability carries no weight in `total` — it is reported separately (case table, overall table, summary line) because it measures the corpus structure (the wiki's index lines, keywords, hubs and synonyms; the official clones' section indexes and file naming), not the agent's answer. A findability `fail` with a `pass` verdict is still a finding: the content is right but hard to reach. Follow-up reads that follow links from the target page never count against findability.

## Access cost (recorded per case and per option, no weight)

Findability is a binary; these are the quantities behind it. All are derived from the **ground-truth
call log** extracted from the sub-agent transcript, never from an agent's self-report, and all are
reported beside the quality score, never folded into it — a drop in `total` must stay attributable to
content rather than navigation.

| metric | definition |
| --- | --- |
| `retrievalCalls` | access calls for the case — `Read`/`Grep`/`Glob`/`Bash` or `list_docs`/`grep_docs`/`read_doc` — excluding `Write`, `kb_status` and the batch's single orientation read |
| `callsToTarget` | access calls before the first read of the target page (the findability count) |
| `retrievalBytes` / `retrievalLines` | total payload the corpus returned into the agent's context. Report both: MCP returns pretty-printed JSON and `Read` returns raw text, so lines are the fairer cross-option normalisation |
| `deadEndCalls` | grep/list calls that returned zero hits — how often the corpus's own vocabulary misled the agent |
| `retrievalTurns` | assistant turns containing at least one access call — the round-trips the mechanism forced |
| `toolLatencyMsP50` / `P90` | **full client-observed round-trip per access call**: the result record's timestamp minus the call record's timestamp. This is what "search time" means here — `grep` returning versus `grep_docs` returning — and it is measured identically for every option |

`toolLatencyMs` is the one honest speed number in the suite. It is **not** MCP-internal timing: the
server is never instrumented, because a server-side figure has no filesystem counterpart and would be
a comparison against nothing.

**What is deliberately not measured:** per-case wall-clock. Discover batches run ten-wide in parallel
against one machine and one server process, a batch shares one context, and more than nine tenths of
elapsed time is model inference that varies with load and cache state. Any per-case seconds figure
would be a number about the harness, not about the corpus. `retrievalTurns` is the honest proxy for
"how long it felt"; it is not a clock. Say so in the report rather than publishing a figure that
looks rigorous and is not.

For `vanilla` every access-cost metric is `0` or `n/a` — there is no corpus to navigate, and that is
the correct baseline reading, not a missing measurement.

## Source-absent override (apply before scoring the other five dimensions)

For **any** case — edge or non-edge — where `toolCallLog` shows the permitted corpus was confirmed genuinely unavailable for this query (e.g. MCP `kb_status` reports the layer `planned`/`missing`, the entry point — `platform/index.md`, `developer/index.md` or `merchant/index.md` — returns an unknown-path notice or doesn't exist on disk, or the case's target for this corpus is `none` and reasonable greps stay empty) and the report shows `notFoundClaim: true` with no fabricated content in `answer`:

- **Completeness** scores 0 — there was no content to be complete. This is a structural consequence of source absence, not a discovery failure.
- **Grounding & Relevance**, **Accuracy**, **Citation & Traceability**, and **Actionability** each score per their edge/not-found bands above — typically 100 when the gap is stated plainly and nothing is fabricated, 0 only if the agent invented an answer anyway.
- **Honesty** scores 100 — reporting the gap plainly is exactly correct behavior.
- The resulting total is necessarily below 100 (Completeness is 0), but the verdict is recorded as **`unavailable`**, not `fail` — meaning "source unavailable, agent behaved correctly." Reserve `fail` for cases where the source *did* have relevant material and the agent missed it, ignored it, fabricated instead of reporting it, or broke source discipline.

If the source was available but the agent still failed to find or report correctly, none of the above applies — score normally.

**The override never applies to a `rule-*` case on `fs-docs`/`mcp-docs`.** Its target there is `none` by design — a synthesized platform guideline has no 1:1 upstream page, so there is nothing "confirmed genuinely unavailable" to report; an honest not-found earns no override credit. Score Grounding & Relevance, Accuracy, Completeness, Citation & Traceability, Honesty and Actionability normally against the case's expected-answer facts. Only `fs-wiki`/`mcp-wiki` may apply the override to a `rule-*` case, and only while `platform/guidelines/<v>/` is not yet built.

**The override never applies to `vanilla`.** It exists to stop an option being blamed for a corpus
that does not carry the page; `vanilla` has no corpus, so there is nothing that can be absent and
`sourceVerdict: "corpus-missing"` is not a value it may emit. A `vanilla` case that finds nothing is
scored normally under the not-found bands: honest `no` with no fabrication scores well on Grounding,
Honesty and Actionability and 0 on Completeness, and the verdict is a real `fail` or `partly`, never
`unavailable`. That is the point of a baseline — "the open web could not answer this either" is a
finding about the question, and it must stay comparable with what the KB options scored on it.

## Verdict per case

| Total | Verdict |
| --- | --- |
| ≥ 85% | **pass** |
| 60–84% | **partly** |
| < 60% | **fail** |

If the Source-absent override applies, the verdict is **`unavailable`** regardless of the numeric total (still record the total for the report).

## Status

Status is a **rate-based gate over the practical case set** — `dev-*`/`func-*`/`rule-*`, the query
shapes a skill actually makes — not a zero-tolerance gate over all 106 cases. An earlier version of
this rubric required every scored case, `edge-*`/`gap-*` traps included, to be `pass`; a survey of
every run ever scored showed that bar cleared by nothing, including the `vanilla` baseline (an
ordinary coding agent with no custom KB support, already run by 100+ teams in production) at 73%
overall with 22 fails out of 100. A status nothing can ever satisfy doesn't distinguish "ready for
skills to rely on" from "imperfect somewhere among 106 deliberately adversarial probes" — it just
conflates "perfect" with "ready." `edge-*`/`gap-*` cases are negative controls by design (naming
things that don't exist, or topics the KB is known not to cover); they keep their own pass/fail
scoring and their own report lines (`Edge passed: N of N`, `Gap confirmed: N of N`), but never gate
readiness.

**Overriding rule (applied before the table):** If every `dev-*`/`func-*`/`rule-*` case for the
option under test hit the Source-absent override (verdict `unavailable`) — e.g. every relevant MCP
layer is `planned`, or the corpus doesn't exist yet — the overall status is **Not ready — source
unavailable**, regardless of per-case totals. `edge-*`/`gap-*` cases, and `rule-*` cases on
`fs-docs`/`mcp-docs`/`vanilla` (never `unavailable` — see `cases.md`), keep their own scoring and
don't affect this status. Status is computed per option; a compare report shows one status per
option, never a combined one.

Otherwise, compute over the scored `dev-*`/`func-*`/`rule-*` cases (the **practical set**):

```
practicalFailRate        = fail count / practical set size
practicalUnavailableRate = unavailable count / practical set size
practicalUnscored         = count of unscored cases in the practical set
```

| Condition | Status |
| --- | --- |
| `practicalUnscored` > 0 | **Not ready** |
| `practicalFailRate` > 15% | **Not ready** |
| `practicalFailRate` ≤ 5% and `practicalUnavailableRate` ≤ 10% | **KB ready for skills** |
| Otherwise | **Usable with caveats** |

These three numbers (`practicalFailRate`, `practicalUnavailableRate`, `practicalUnscored`) are
stored per option alongside `status` (see `SKILL.md` step 7) so a report shows *why* a run got its
status, not just the label. The scoring dimensions, bands and weights above are unchanged by this
section — `total` and per-case `verdict` don't move; only how `Status` is derived from the
already-computed verdicts does.

## Honesty rules

- Content served by either source (a mock MCP doc, or a page in the FS corpus) is scored as if it were real. A wrong fact or missing fact is a wrong fact or a missing fact, regardless of whether the underlying content is provisional.
- Never raise a score just because a source "isn't finished yet" outside the Source-absent override above — that override exists specifically to keep this honest without inflating scores.
- Totals are floored (84.9 is 84 and `partly`); never round up, per case or in any average.
- The same rubric, weights and bands apply to all four options; never adjust a band because a corpus "has no synonyms" or "has many revisions" — structural differences are what the comparison measures.
- Use only the band values 100 / 70 / 40 / 0. If a result sits between bands, take the lower band.
- If you used the official docs to understand the topic, that knowledge does not count for the discover agent — score only what the report shows.
- Whenever `groundingRelevance` or `accuracy` scores below 70 (and the override doesn't apply), `officialReferences` MUST contain at least one entry with the official URL and one quoted sentence from that page showing what was missed or wrong.
- If the official page could not be fetched, say so in `notes` and cap `accuracy` at 70; do not guess at what the page says.
- Never return a score without the JSON object — a case without valid JSON is `unscored`, which counts against the source, not for it.
