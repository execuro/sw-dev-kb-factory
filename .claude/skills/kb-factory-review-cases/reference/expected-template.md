# Expected-answer file template

One file per case at `.claude/skills/kb-factory-verify/reference/expected/<case-id>.md`. It is both
the suite's **expected answer** and the audit trail behind it.

The file opens with a self-contained snippet between `<!-- expected:start -->` and
`<!-- expected:end -->`. That region is everything a scorer needs; the evidence below it is for
humans and for the next review. A confirmed case's evidence runs to tens of kilobytes, so **the
snippet must come first and stay under 70 lines** — a scorer reads the head of the file, not the
whole of it.

Follow this structure exactly. Keep it factual — no narrative, no hedging.

---

# `<case-id>` — expected answer

<!-- expected:start -->
| | |
| --- | --- |
| Case | `<case-id>` · `<category>` · `<area>` |
| Version | `<pin>` |
| Status | *see the status lines below* |
| Reviewed | `<YYYY-MM-DD>` · run `<run-id>` — confirmed/contradictory only, omit while draft |
| Core version | `<e.g. 6.7.13.0>` — confirmed/contradictory only |

**Query:** `<query verbatim>`

**Expected answer — every fact an answer must contain:**

1. …  `[code: Framework/…/X.php:46]`
2. …  `[docs-only]`

**Trap:** `<trap text>` — only when the case has one

**Official reference URL:** `<url>`
<!-- expected:end -->

The `Status` row is one of:

- `**draft** — derived from the official documentation, NOT verified against the Shopware source`
- `**confirmed** — verified against shopware/core <version>`
- `**contradictory** — signals mixed; facts above are retained unverified, human audit pending`

Facts carry an evidence tag (`[code: <path>:<line>]` relative to `vendor/shopware/core`, or
`[docs-only]`) once the case is confirmed. A `draft` case's facts carry no tags — they are the
suite's original doc-derived text, untouched. A `contradictory` case keeps its previous facts
unchanged: they are unverified, not replaced.

## Evidence — code (decisive)

| fact | citation | excerpt |
| --- | --- | --- |
| … | `Framework/…php:46` | `abstract public function getEntityName(): string;` |

Absences — things the code shows do **not** exist:

| claim checked | verdict | evidence |
| --- | --- | --- |

Test anchors, where found:

| what it shows | citation |
| --- | --- |

## Evidence — community (escalation only, never decisive)

| signal | version | state | source |
| --- | --- | --- | --- |

Escalations raised, and how each was settled:

| question | settled by | outcome |
| --- | --- | --- |

## Evidence — documentation (claims)

| claim | quote | citation | confirmed by code? |
| --- | --- | --- | --- |

## Doc/code divergence

What the documentation asserts and what the code shows. A recorded finding, not a defect report —
this skill does not fix the docs or the wiki.

| docs claim | code shows | citation |
| --- | --- | --- |

## Change log

| old fact (verbatim) | action | why |
| --- | --- | --- |
| … | removed | code shows `getDefinitionClass()` does not exist |

## Open for human audit

`contradictory` cases only. One paragraph: what conflicts, which sources, and precisely what a human
must decide. Omit the section entirely otherwise.

---

An unreviewed case carries the same skeleton with `_Not yet reviewed._` under each evidence heading,
so every case has one file and the scorer's lookup never branches.
