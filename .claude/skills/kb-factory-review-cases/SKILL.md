---
name: kb-factory-review-cases
description: Re-derive the expected answers of the kb-factory-verify test suite from reality instead of from documentation. For each selected case, three tool-isolated lanes run blind and in parallel — code (`vendor/shopware/**` for 6.7, the local 6.6 sparse checkout for 6.6 pins), community (GitHub issues/PRs via WebSearch/WebFetch, Stack Overflow, forum) and documentation (the official clones + the live sites) — and a reconciler applies a fixed truth hierarchy (code decides, community escalates, docs are claims). Cases whose signals stay mixed after a targeted deep code pass are marked `contradictory` for human audit rather than confirmed. Rewrites the case's expected-answer file in `kb-factory-verify/reference/expected/` — the facts plus the evidence behind them — and flips its status in `cases.md`. Tooling skill of the kb-factory-* family; never touches the wiki corpus, the docs clones, the MCP server or any verify run report, and never writes project feature code.
when_to_use: Trigger phrases — "review the KB test cases", "ground-truth the cases", "are the test cases trustworthy", "validate cases against the code", "confirm case dev-01", "re-derive the expected answers", "mark the cases draft".
argument-hint: <case-id[,case-id…]|dev|func|edge|gap|rule|all> [--round1-only] [--model=sonnet|opus|haiku]
allowed-tools: Read Write Edit Glob Grep Agent AskUserQuestion Bash(ls *) Bash(date *) Bash(sed -n *) Bash(grep *)
user-invocable: true
---

# kb-factory-review-cases

## Why this exists

`kb-factory-verify` scores answers against each case's **Must-mention facts**, which `cases.md` itself
calls *"this suite's pinned statement of what the official page says"*. The wiki under test was
ingested from those same pages, so the suite largely measures whether an agent reproduced the
documentation — not whether the answer is correct.

It is not a theoretical risk. Case dev-01 pins `getDefinitionClass()` as the way an entity extension
names its entity and explicitly accepts an answer mentioning only that. In the installed
`shopware/core 6.7.13.0` that method does not exist and `getEntityName()` is abstract — code that
follows our "correct" answer does not compile, and the last run scored it 100% pass.

This skill fixes the **test cases**. It does not fix the wiki, the KB or the MCP.

## Truth hierarchy — the one rule everything follows

| rank | source | authority |
| --- | --- | --- |
| 1 | **Code** — `vendor/shopware/{core,storefront,administration}` (6.7.13.0); the local read-only sparse checkout at `.sources/shopware/6.6/` (tag named in its `.tag` file) for 6.6 pins. Tests the vendor dist package strips are reported as "test not on disk", never invented. Active functional/integration tests show how a thing is really used. | **Decisive.** Reality. |
| 2 | **User feedback** — issues/PRs in `shopware/shopware` and `shopware/docs` via `WebSearch`/`WebFetch`, Stack Overflow, forum. | **Not decisive.** A complaint forces a deeper code pass on that point before anything is concluded. |
| 3 | **Documentation** — the official clones and developer/docs.shopware.com. | **Weakest.** A doc claim enters a fact only if code confirms it; unconfirmed intent/business context is tagged `[docs-only]`. |

**Forbidden to every lane:** our wiki corpus (the factory root) and the
`ShopwareDevKnowledgeBase` MCP. They are the system under test; deriving truth from them restores the
circularity this skill removes. An expected-answer file built on either is invalid.

A doc/code disagreement is the expected, normal finding — code simply wins, and the divergence is
recorded. It never by itself makes a case contradictory.

## Status lifecycle

| status | meaning |
| --- | --- |
| `draft` | Expected answer not yet ground-truthed. The initial state of all 100 cases. |
| `confirmed` | Signals settled. Facts rewritten from reality, evidence recorded. |
| `contradictory` | Still mixed after the deep code pass. **Human audit required.** Old facts kept untouched. |

Never confirm a case to avoid a `contradictory` verdict.

## Agents

Isolation is enforced by the tool grant in each agent definition, not by instructions.

| agent | lane | can reach | cannot reach |
| --- | --- | --- | --- |
| `kb-factory-case-evidence-code` | 1 | `vendor/shopware/**`, `custom/**`, the local 6.6 sparse checkout | web, MCP, doc clones, wiki |
| `kb-factory-case-evidence-community` | 2 | GitHub issues/PRs via WebSearch/WebFetch | filesystem entirely |
| `kb-factory-case-evidence-docs` | 3 | `.sources/docs/**`, developer/docs.shopware.com | `vendor/**`, wiki, MCP |
| `kb-factory-case-evidence-reconciler` | — | the lane reports + the case's current expected-answer file | every source |

## Procedure

### 1. Select and set up

Parse the case selector. Read `.claude/skills/kb-factory-verify/reference/cases.md` — its `## Cases`
table gives id, category, status, area, version and query. That file holds test inputs only.

Never open `reference/expected/`. The current expected answers live there, and they must not enter
this context: the lanes have to stay blind and you are the one writing their briefs. Only the
reconciler sees them.

Unknown selector → list the valid ids and stop.

Run id: `cases-review-<YYYY-MM-DD-HHMM>-<selector-slug>` (`date +%Y-%m-%d-%H%M`). The
`cases-review-` prefix names the runner — these are this skill's runs, not a `kb-factory-verify`
run. **The slug is not decoration — it is what keeps two sessions started in the same minute
apart.** Build it from the selector: lowercase it, replace every run of non-alphanumerics with `-`,
trim leading/trailing `-`, drop a redundant leading `cases-` (the prefix already says it), and cap at
24 characters. `cases 2-11` → `2-11`; `dev-07,dev-08` → `dev-07-dev-08`; `all` → `all`.

Then `ls runs/` before writing anything. If `runs/<run-id>/` already exists, append `-b`, then `-c`,
until the name is free — never write into an existing run folder. A run folder belongs to exactly one
run, and `runs/` is git-ignored, so a clobbered `run.json` is gone for good.

Create the run folder by writing its first file (shell `mkdir` under `.claude/skills` is
sandbox-blocked; `Write` creates parents): `runs/<run-id>/run.json` with
`{ run, selector, cases[], startedAt, model, coreVersion, warnings[] }`. Take `coreVersion` from
`vendor/shopware/core/composer.json`.

**Claim the case set before spawning anything.** The folder name says which run you are; it does not
say which cases are already spoken for by a session running right now. `ls runs/`, then `Read` every
`runs/*/run.json` and note its top-level `cases[]` — read them rather than `grep` them, since that
array is pretty-printed across several lines and a `grep` returns `"cases": [` without the ids. Then
`ls runs/*/summary.md`. A run with no `summary.md` is still in flight; if
its `cases[]` intersects your selection, **stop** and name the run that owns those cases instead of
proceeding. Concurrent runs are fine and expected — overlapping ones are not, because two reconcilers
would write the same `expected/<case-id>.md` and two orchestrators the same `cases.md` row.

**Batching.** Group the selected cases by `Area` and cut batches of **at most 5**. Same-area cases
share a namespace, so a lane pays for that context once. One batch per lane agent — never one agent
per case.

### 2. Round 1 — three lanes, blind and parallel

Per batch, spawn all three lane agents **in one message** so they run concurrently and cannot see each
other's work: `kb-factory-case-evidence-code`, `kb-factory-case-evidence-community`, `kb-factory-case-evidence-docs`, named
`kb-lane-<lane>-batch-<n>`. Each gets its brief from `reference/lane-brief-<lane>.md` with the
placeholders filled.

Brief each lane with **only** this, per case — never the expected-answer facts, the target path, the
official URL or the reference sequence:

```
Case: <case-id>
Query: <query verbatim from the Overview table>
Category: <dev | func | edge | gap>
Area: <area from the Overview table>
Version: <version pin from the Overview table, or "6.7">
```

Wait for all three lanes of a batch before reconciling it. Record any `status` that is not `ok` in
`warnings[]` — and record there too anything step 1 detected about other runs: a run-id that was
already taken, or a case-set overlap you resolved. A run that silently clobbers another leaves
`warnings[]` empty and nobody ever learns what happened.

### 3. Reconcile

One `kb-factory-case-evidence-reconciler` per batch, named `kb-reconcile-batch-<n>`, briefed from
`reference/reconcile-brief.md`. It reads the three lane reports and — for each case — the current
expected-answer file `kb-factory-verify/reference/expected/<case-id>.md`, whose snippet holds the
facts it must diff against. It rewrites that file and writes a decision per case.

Collect the verdicts. `needs-deep` cases go to round 2; everything else is done.

### 4. Round 2 — deep code pass (only for `needs-deep`)

Spawn `kb-factory-case-evidence-code` again in deep mode, named `kb-deep-code-batch-<n>`, briefed from
`reference/deep-code-brief.md`, carrying **only** the `openQuestions[]` the reconciler emitted. It
reconstructs the real mechanism for those points and writes `<case-id>.deep.json`.

Then re-run `kb-factory-case-evidence-reconciler` over those cases with the deep report added. Its verdict is now
`confirmed` or `contradictory` — there is no third round.

### 5. Apply the decision

The suite stores a case in two places, and a review touches both:

| file | holds | who reads it |
| --- | --- | --- |
| `kb-factory-verify/reference/cases.md` | the test **inputs** — one table row per case: id, category, status, area, version, query, target path | the verify orchestrator and auditor |
| `kb-factory-verify/reference/expected/<case-id>.md` | the **expected answer** snippet between `<!-- expected:start -->` / `<!-- expected:end -->`, then the evidence that backs it | the verify scorers (snippet only) and humans (all of it) |

The reconciler has already written the expected file. Your job is the one-line status update and the
preamble check.

**In `cases.md`** — `Edit` the case's row, changing only the `status` cell to `confirmed` or
`contradictory`. Nothing else in that file changes: it holds no facts.

`cases.md` is one file that every concurrent run edits, so treat each status flip as a
read-modify-write on shared state: re-read the row immediately before its `Edit`, make the
`old_string` the **whole table row including the case id** (the id is what makes it unique), one row
per `Edit`, never `replace_all`. Never carry a batch of row edits across a stale read — between your
read and your write another session may have flipped a different row, and an `Edit` built on the old
text silently reverts it.

**In `expected/<case-id>.md`** — verify the reconciler wrote what the verdict requires:

- `confirmed` — the `Status` row reads `**confirmed** — verified against shopware/core <version>`, a
  `Reviewed` row names the date and run id, the numbered facts are the decision's `newFacts` with
  their evidence tags, and the evidence sections are filled.
- `contradictory` — the `Status` row reads `**contradictory** — signals mixed; facts below are
  retained unverified, human audit pending`, the facts are **unchanged**, and an
  `## Open for human audit` section states what a human must decide.

If a file does not match its verdict, fix the header rows yourself but never write a fact the
reconciler did not produce.

**Then check the preamble** of `cases.md`: if a case you just changed is named in
`## Known documentation defects the suite deliberately probes`, that bullet is now stale or actively
harmful (dev-01's once instructed scorers to reward the wrong answer). Rewrite or delete it, and say
so in the summary. That preamble is shared prose rather than per-case rows, so it is where concurrent
runs collide hardest: touch only the bullet naming a case in **your own** run, one bullet per `Edit`,
re-reading the section immediately before each one.

Structural invariants: `cases.md` still has one table row per case and no `### ` case blocks;
`expected/` holds exactly one file per case, each with exactly one `expected:start`/`expected:end`
pair and a snippet region under 70 lines.

### 6. Report

Write `runs/<run-id>/summary.md`: per case the verdict, the facts removed and added, the doc/code
divergences found, and the open questions for any contradictory case. Print:

```
Run: <run-id>   Core: <version>
Cases: N   confirmed: N   contradictory: N
Facts removed: N   added: N   doc/code divergences: N
Contradictory (human audit): <ids or "none">
Expected answers: .claude/skills/kb-factory-verify/reference/expected/
```

## Flagging every case `draft`

The first run of this skill on a fresh suite also initialises it: add a `status` column to the
Overview table, `- **Status:** draft` as the first field of every `### ` block, and the
`## Case status` section documenting the lifecycle. Do this once, before any review, and confirm the
100/100 counts afterwards.

## Rules

- Lanes are blind. Briefing a lane with the current expected answer defeats the skill — it would
  anchor on the answer we suspect is wrong.
- Lanes are isolated. Never hand one lane another lane's report; only the reconciler merges.
- Never write a fact yourself, never score, never adjudicate in a reconciler's place. This context
  orchestrates and edits `cases.md`.
- Never read a corpus, the wiki or the MCP from this context.
- Every fact in an expected-answer file carries a citation and a verbatim excerpt. A citation without the quote is
  not evidence.
- `contradictory` is a legitimate outcome. Escalating is cheap; a wrong `confirmed` poisons the suite.
- Markdown only — this skill ships no scripts.
