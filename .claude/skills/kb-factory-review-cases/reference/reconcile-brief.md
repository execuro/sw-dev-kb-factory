# Reconcile brief (template)

The skill fills every `{{…}}` and sends the text below as the prompt of one `kb-factory-case-evidence-reconciler`
sub-agent named `kb-reconcile-batch-{{BATCH}}` (round 1) or `kb-reconcile-deep-batch-{{BATCH}}`
(round 2). Nothing else is sent.

---

You are the **reconciler** of a test-case review run, round **{{ROUND}}**. Three isolated lanes have
reported on the cases below. Decide each case.

You have `Read` and `Write` only: you cannot browse the source, the docs or the web. Everything you
write must trace to a lane report in front of you.

## Inputs, per case

- `{{LANE_DIR}}/<case-id>.code.json` — tier 1, decisive
- `{{LANE_DIR}}/<case-id>.community.json` — tier 2, escalation only
- `{{LANE_DIR}}/<case-id>.docs.json` — tier 3, claims only
- round 2 only: `{{LANE_DIR}}/<case-id>.deep.json`
- the case's current expected-answer file `{{EXPECTED_DIR}}/<case-id>.md` — its snippet region carries
  the header, the query and the facts as they stand, which is what you diff against

The facts live in that file, not in `cases.md`; `cases.md` holds only test inputs, so do not open it.

## Apply the hierarchy mechanically

1. **Code decides.** A code finding with a citation and excerpt overrides any doc claim and any
   community report. If code says a method does not exist, it does not exist.
2. **Community escalates, never decides.** A community signal is never a fact in your output. Its
   only power is to force a closer look: a signal bearing on a point the code lane did not settle
   becomes an open question.
3. **Docs are claims.** A doc claim enters the facts only when a code finding confirms it. An
   unconfirmed claim is admitted only as intent/business context code cannot express, tagged
   `[docs-only]`.

**A doc/code disagreement is the normal, expected finding.** Code wins, the divergence is recorded in
`docCodeDivergence[]`, and the case can still be `confirmed`. Do not mistake it for a contradiction.

## Verdict

- **`confirmed`** — every fact is backed by a code finding, or is `[docs-only]` context with no code
  contradiction.
- **`needs-deep`** — round 1 only. Code left something material unsettled, or a community signal
  contradicts a code finding, or docs and code disagree on a point the code lane never examined.
  Emit `openQuestions[]` and stop. Do not guess.
- **`contradictory`** — round 2 only. After the deep pass the signals are still mixed: the code is
  ambiguous, two code findings genuinely conflict, or behaviour differs by version in a way this
  single query cannot express. Keep the old facts untouched and state precisely what a human must
  decide.

In round 2 there is no `needs-deep` — the verdict is `confirmed` or `contradictory`. Never confirm a
case to avoid the contradictory verdict.

## Rewriting the facts (confirmed only)

Keep the existing shape: 2–3 numbered facts, each a complete statement a scoring agent can check
against an answer.

- Tag each fact with its evidence: `[code: Framework/DataAbstractionLayer/EntityExtension.php:46]`
  (path relative to `vendor/shopware/core`) or `[docs-only]`.
- **Delete facts the code disproves, and delete tolerance clauses** ("an answer with only X is still
  accepted"). Those clauses are how this suite came to reward wrong answers.
- Add a fact the code shows is load-bearing and the old set missed — a mandatory abstract method, a
  required tag — but keep the set to the 2–3 things that decide whether an answer is usable.
- Keep the query's version pin. If the answer differs between 6.6 and 6.7, say so inside the fact
  rather than silently picking one.
- For `edge`/`gap` cases the facts still describe the honest expected outcome; code is what settles
  whether the thing really is absent.

## Cases

{{CASE_BLOCKS}}

## Output, per case

1. The expected-answer file `{{EXPECTED_DIR}}/<case-id>.md`, following `{{EXPECTED_TEMPLATE_PATH}}` exactly.
2. The decision `{{OUTPUT_DIR}}/<case-id>.decision.json`, in the shape your agent definition
   specifies.

Quote every removed fact verbatim in `removedFacts[]` with the reason, so the change is auditable.
Escalating is cheap; a wrong `confirmed` poisons the suite.

Return only the manifest your agent definition specifies.
