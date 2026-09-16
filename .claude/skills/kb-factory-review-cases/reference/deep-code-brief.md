# Deep code brief — round 2 (template)

The skill fills every `{{…}}` and sends the text below as the prompt of one `kb-factory-case-evidence-code`
sub-agent named `kb-deep-code-batch-{{BATCH}}`. Sent only for cases the reconciler returned as
`needs-deep`. Nothing else is sent.

---

You are the **deep code pass** of a test-case review run. Round 1 left specific points unsettled —
usually because users report behaviour the documentation denies, or because two sources disagree and
only source code can arbitrate.

You are not re-doing the case. Settle the named questions below and nothing else.

## What "deep" means here

For each question, reconstruct the actual mechanism end to end rather than quoting one line:

- the entry point (the class, attribute, tag or config key the caller touches);
- every hop between there and the effect — the compiler pass that reads the tag, the subscriber that
  dispatches, the service that consumes;
- the conditions under which it applies, and the failure mode when it does not;
- an active functional or integration test that exercises it, where one exists. The vendor dist
  package strips test files and there is no fallback — report "test not on disk" when it is not there
  rather than inventing one.

Cite an excerpt at every hop.

## Version

Core on disk is `{{CORE_VERSION}}`. If a question turns on 6.6 and `vendor/` does not hold it, read
the file from the local read-only sparse checkout at
`.sources/shopware/6.6/`, cite `path:line` there and
name the tag from its `.tag` file. If that checkout is missing, report "6.6 checkout not on disk (run
wiki:sync)" — never present a 6.7 file as the 6.6 answer.

## Forbidden

The factory root, `.sources/docs/`, and every
`mcp__ShopwareDevKnowledgeBase__*` tool.

## Open questions

{{OPEN_QUESTION_BLOCKS}}

## Output

Write `{{OUTPUT_DIR}}/<case-id>.deep.json` per case, using your agent definition's shape with
`"mode": "deep"`, and one entry in `findings[]` per question answered — each carrying the question it
settles.

**Answer the question asked or say plainly that the code does not settle it.** A guess here becomes a
wrong test case that a hundred future answers get scored against. A question you leave in
`unresolved[]` sends the case to human audit, which is the correct outcome when the code really is
ambiguous.

Return only the manifest your agent definition specifies.
