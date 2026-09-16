# KB quality report — <run id>

This is a skill template, filled by `kb-factory-verify` step 6 (run modes) or the `compare` procedure into `reports/<run>/kb-quality-report.md`. Replace every `<…>` / `NN` placeholder. A run report carries one or two options (the options of the served corpus); a compare report carries up to four. Every table that says "per option" has one column or one row per option, in the fixed order `fs-wiki`, `mcp-wiki`, `fs-docs`, `mcp-docs` (missing options omitted, never faked).

## Run

| | |
| --- | --- |
| Run | `<run id>` (`<mode>`) |
| Options | `<option list>` |
| Corpus | `<wiki \| docs>` — fingerprint: wiki `lastBuilt <date>`, `treeHash <hash>`, `<N> pages`; docs `developer <HEAD sha> (<commit date>)`, `merchant <HEAD sha> (<commit date>)`, seed index `<present \| missing>` |
| Probe | `<kb_status corpus.name>`, entry points `<present list>`, layers `<name=status, …>`; fs: entry points `<present list>` |
| Baseline | vanilla only: `vendor/ present — shopware/core <version> in <projectDir>` (from `run.json` `vendor`); a vanilla run with no `vendor` record shows `baseline without vendor/ — upper bound`; omit this row when the run holds no `vanilla` option |
| Model | `<--model value>` or `inherited (not pinned)` |
| Generated | `<ISO timestamp>` |
| Cases run | `<N of 100>` (`all`, a category, or the case ids) |
| Yardstick | `cases.md <sha8>`, `scoring-rubric.md <sha8>`, `scorer-brief.md <sha8>`, `auditor-brief.md <sha8>`, `accuracy-brief.md <sha8>` |
| Execution | discover batches of `<execution.discoverBatchSize>`, scorer shards of `<execution.scorerShardSize>` (`<execution.mode>`) |
| Resumed | `<resumedAt>` — waves skipped: `<list>`; omit this row entirely when the run was not resumed |
| Skill | `kb-factory-verify` |
| Label | `<--label text>` — omit this row entirely when no `--label` was given |
| Merged runs | compare only: `<option> ← <run id>` per option |

## Run cost

Cost = usage of the option's discover agents only, one usage block per API message id (the record
carrying the final `output_tokens`), split into non-cache tokens (input + output + cache writes)
and cache-read tokens, computed by `scripts/aggregate-costs.mjs` from the transcripts — written by
that script, never by hand. Usage is measured per discover batch, never per case — never divide a
batch's tokens across its cases to fill this table. One row per option, sourced from
`options.<option>.costs` and `costs.wallClockSeconds`.

| Option | Discover agents (batches) | Requests | Non-cache tokens | Cache-read tokens | Cache hit % | Est. USD | Tool calls | Summed agent time | Source |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `<option>` | `<N>` (`<N>` batches) | `<costs.requests or n/a>` | `<costs.tokens.nonCache or n/a>` | `<costs.tokens.cacheRead or n/a>` | `<costs.cacheHitRate*100 to 1dp>%` | `<costs.costUsdEstimate.total or n/a — estimate>` | `<costs.toolCalls or n/a>` | `<costs.agentTimeSecondsSummed>s` | `<costs.source>` |

Wall-clock duration of the run: `<costs.wallClockSeconds>s` (compare: per merged run). Any entry
of `costs.warnings` (unpriced model, fallback tier, missing transcript, …) is listed under Audit
warnings, not silently dropped here.

## Comparison

The headline table — one row per option, straight from `options.<option>` (no new computation).

| Option | Access | Corpus | Overall | Status | Developer | Functional | Findable | Edge passed | Gap confirmed | Pass / partly / fail / unavailable / unscored | Weakest dimension |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `fs-wiki` | fs | wiki | NN% | `<status>` | NN% | NN% | N of N | N of N | N of N | N / N / N / N / N | `<dimension>` |

Below the table: the ranking by overall (one line), then the deltas — `mcp − fs` per corpus and (compare) `wiki − docs` per access — as `+N` / `−N` percentage points, computed over the cases every listed option scored.

`Status` is a rate-based gate over `dev-*`/`func-*`/`rule-*` only (`options.<option>.practicalGate` — see `scoring-rubric.md`'s `## Status` section); `edge-*`/`gap-*` results are reported separately in the `Edge passed` and `Gap confirmed` columns and never affect `Status`.

## Dimension heatmap

| Dimension | Weight | `<option>` | `<option>` | … |
| --- | --- | --- | --- | --- |
| Grounding & Relevance | 25 | NN | NN | |
| Accuracy vs. Expected Answer | 25 | NN | NN | |
| Completeness | 15 | NN | NN | |
| Citation & Traceability | 10 | NN | NN | |
| Honesty | 15 | NN | NN | |
| Actionability | 10 | NN | NN | |

Average band score per option, `unscored` cases excluded. Optional, when the cases carry an `Area` line: a second table `Area | Cases | <option> average | … | <option> pass` from `options.<option>.byArea`.

## Verdict grid

One row per case, one column per option: `NN% verdict` plus the findability mark (`✓` pass, `✗` fail, `–` n/a), e.g. `92% pass ✓`. `unscored` shows `— unscored`.

| Case | Category | Area | `<option>` | `<option>` | … |
| --- | --- | --- | --- | --- | --- |
| dev-01 | dev | DAL | 92% pass ✓ | 78% partly ✗ | |

## Requests and responses

What each discover agent was given and what it reported, straight from `raw/<option>/<case-id>.json` and the mechanical facts in `derived/<option>/shard-*.json` — no scores, no judgement. Both are local-only run output, not committed to git. One table per option, one row per case.

### `<option>`

| Case | Query | Entry point used | Tool calls made | Page reached | Findability | Top citation | Memory claims | Discipline | Verdict | Raw |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| dev-01 | `extend product entity with an association` | `read_doc platform/index.md` | 3 (read_doc, grep_docs, read_doc) | `<path read>` = target | pass (1+1) | `<path:lines>` | 0 | pass | pass | `raw/<option>/dev-01.json` |

Column rules:
- **Entry point used** — the first non-probe call in `toolCallLog`; expected the option's entry point (`platform/index.md`, or `developer/index.md` / `merchant/index.md`); `not found` if the corpus/entry point does not exist.
- **Tool calls made** — count + tool names from `toolCallLog`, e.g. `3 (read_doc, grep_docs, read_doc)` or `4 (Read, Grep, Bash find, Read)`. An empty log means the case was answered from a page an earlier case in the same discover batch had already read — write `0 (warm)`, never leave it blank.
- **Page reached** — `pageReached`, followed by `= target` when it equals this corpus's target path, `≠ target (<target>)` when it differs, `—` when nothing was read.
- **Findability** — the final value; in brackets the audit's number of list/grep calls before the target read plus the read, e.g. `pass (2+1)`, `fail (4+1)`, `fail (no read)`. Mark `pass (drift)` where the scorer upgraded a strict `fail` because the page reached carried the expected-answer facts.
- **Top citation** — first entry of `citations[]`; `—` when `notFoundClaim: true`.
- **Memory claims** — count of `[from memory]` sentences (`memoryClaims`).
- **Honesty** — the `honesty` band. Scope is fenced, so this column never reports a scope breach;
  `fenceDenials` is reported once per option as a count, and `selfReportDelta` shows as
  `under-reported (<n>)` when the agent's log did not match its transcript.
- **Verdict** — the recomputed verdict, pulled forward for scanning; the dimension breakdown is in "Scores by case".
- **Raw** — the path of the case's raw report *on the machine that produced the run*, written as plain inline code and never as a link. It is local-only run output, gitignored, so it will not exist for a reader who has the report from a clone; the same request, answer and tool-call detail is inlined in this run's `report.html`, which is what such a reader should open.

## Scores by case

The scorers' analysis. One table per option, one row per case: six dimension scores (band values), the six points, recomputed total and verdict. `unscored` cases show `—` in every score column.

### `<option>`

| Case | Grounding | Accuracy | Completeness | Citation | Honesty | Actionability | Points | Total | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| dev-01 | 100 | 100 | 70 | 100 | 100 | 70 | 25+25+10.5+10+15+7 | 92% | pass |

`unavailable` means the Source-absent override applied — the corpus had nothing and the agent honestly reported that; it is not a failure.

## Failures and official references

One bullet per case and option with verdict `partly`, `fail` or `unscored` (not `unavailable` — that belongs in Observations). Each bullet: `<case-id> (<option>)`, verdict, total, the scorer's findings verbatim, then the official reference(s) as `URL — "quoted sentence"`. For `unscored`, state the reason (no JSON returned / invalid JSON / agent error / probe failure) and nothing else.

- **<case-id> (<option>)** — <verdict>, NN%
  - <finding>
  - Official: <url> — "<quote>"

Write `None — every case passed or was correctly reported unavailable.` if the list is empty.

## Accuracy cross-checks

What the targeted accuracy pass did, per option, from `options.<option>.accuracyChecks` and
`scored/<option>/accuracy.json`. A case is flagged when its answer contradicts or omits a
expected-answer fact, when it is `edge-*`/`gap-*`, or when a dimension landed below 70; every other case
takes the case's expected-answer facts as the cross-check, and that is stated here, not hidden.

| Option | Flagged | Fetched | Served from cache | Bands changed | Fetch failures |
| --- | --- | --- | --- | --- | --- |
| `<option>` | N of N | N | N | N | `<case-id>: <status>` or `none` |

Then one bullet per case whose band the pass changed: `<case-id> (<option>)`, `<provisional> → <final>`,
the finding, and the official reference as `URL — "quoted sentence"`. Write
`No band changed — every flagged case held its provisional accuracy.` when none did.

A case that could not be fetched keeps its provisional band capped at 70 and appears in the failures
column; never present it as a completed check.

## Observations about source availability

Facts only, never excuses: which cases hit the Source-absent override per option and why (per `notes`/`toolCallLog`), which `dev`/`func` cases have no page in the docs corpus (`Target path (docs)` = none), whether the `edge-*` cases behaved as specified under each option, and anything scorers flagged about content diverging from the official page. Do not adjust any score here.

If every `dev-*`/`func-*` case of an option hit the override, state it in one line: `Every developer/functional case reported source-unavailable under <option> — "Not ready — source unavailable" baseline.`

## Recommended fixes

Derived strictly from scorer `findings`. One bullet per distinct issue, naming the case(s) and option(s) it came from, e.g. `dev-02 (mcp-wiki, fs-wiki): answer omits keepUserData handling (accuracy 70) — the page platform/dev/6.7/…/plugin-lifecycle.md lacks the uninstall guard` or `func-03 (fs-wiki): findability fail — "discount code" hits nothing in platform/func nor platform/synonyms/; add the alias`. Findability failures on the wiki point at index lines, keywords, hubs or synonyms; on the docs corpus they describe the official structure and are observations, not fixes we own. No fix without a finding behind it. If there are no findings below `pass`/`unavailable`, write `None from this run.`

## Borderline re-scores

Cases whose first total landed within ±2 of a verdict boundary (58–62 or 83–87) and were graded a
second time by a fresh scorer. Where the two passes disagreed, the **lower** band was taken and the
total recomputed — a boundary case is never resolved upward.

| Case | Option | Dimension | First | Second | Taken | Total before → after | Verdict before → after |
| --- | --- | --- | --- | --- | --- | --- | --- |
| dev-03 | `fs-wiki` | completeness | 100 | 70 | 70 | 86% → 81% | pass → partly |

Write `None — no case landed within 2 points of a verdict boundary.` when the list is empty, and
`No disagreement — every re-scored case held its bands.` when cases were re-scored but nothing moved.

## Scorer discrepancies

Every case and option where the scorer's `total` or `verdict` differed from the recomputed value, with both numbers. Write `None.` if there were none.

## Audit warnings

Every entry of `warnings[]` verbatim: scope violations forced to 0, blind-brief query drift, a missing or unparsable raw report, an unexpected file in `raw/<option>/`, a discover batch case whose manifest status was not `ok`, a findability the scorer upgraded without recording the drift, a borderline re-score that moved a band, an accuracy fetch that failed, usage values of 0, missing usage, waves skipped by `--resume`, the `compare` scoring-noise check, and compare mismatches in model / cases / yardstick / execution / label. Also every entry of each option's `costs.warnings` (unpriced or mixed model, a fallback dedup tier, a batch with no transcript). Write `None.` if empty.
