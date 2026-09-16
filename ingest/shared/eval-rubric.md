# Eval rubric (internal build-time sanity check)

Used by `wiki:eval` (refresh spec, Phase 8) — a deterministic grep-replay over
`ingest/platform/eval/queries.json`, **not** the acceptance gate. The acceptance gate is
the `kb-factory-verify` skill's 10 LLM-graded golden cases
(`.claude/skills/kb-factory-verify/reference/scoring-rubric.md`).

## Query shape

Each entry in `ingest/platform/eval/queries.json`:

```json
{
  "id": "q-01",
  "scope": "platform/dev/6.7",
  "expectedPath": "platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md",
  "phrasings": ["plugin skeleton", "how do I create a plugin base class"]
}
```

- `scope` — the directory an agent would scope its first grep to.
- `expectedPath` — the page (or hub) the query should resolve to.
- `phrasings` — 2–3 agent-style search terms, at least one not literally present in the page title.

## Measure: hit@2-calls

1. Grep `phrasings[0]` (literal, case-insensitive) under `scope`. If `expectedPath` appears — as a page hit or as an `index.md`/hub line naming it — **found in 1 call**.
2. Else grep `platform/synonyms.md` (skipped with `--without-synonyms`), then `platform/hubs/index.md`. If `expectedPath` turns up — **found in 2 calls**.
3. Else — **miss**.

`hitAt2Calls` = (found in 1 or 2 calls) / total queries. Reported with and without synonyms.

## Gate

`hitAt2Calls` (with synonyms) ≥ `config.json` `eval.hitAt2CallsGate` (default 0.8). Below
gate: improve keywords/index lines (page prompt) first, then synonyms coverage — never
change the server to compensate.

## Status

`ingest/platform/eval/queries.json` ships empty (`[]`) — populate it once the first
`wiki:build` has produced real pages to write queries against. `wiki:eval` itself is not
yet implemented in this build (see `ingest/platform/eval.ts`); it exits 0 with
`"implemented": false` so the rest of the pipeline is not blocked by its absence.
