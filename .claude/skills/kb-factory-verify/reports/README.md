# Quality reports

Output of the `kb-factory-verify` skill, kept next to the skill itself.

Each run gets its own folder named `<mode>-<YYYY-MM-DD-HHMM>/`, where `<mode>` is the option or option pair that ran — `fs-wiki`, `mcp-wiki`, `fs-docs`, `mcp-docs`, `both-wiki`, `both-docs` — or `compare` for a merged four-way comparison. (Folders named `mcp-…`/`fs-…` from before 2026-09-06 are single-option wiki runs of the previous skill version; the overview maps them to `mcp-wiki`/`fs-wiki`.)

A run folder contains:

- `run.json` — run metadata: mode, options, cases, label, pinned model, timestamps, corpus fingerprint (wiki manifest or clone commits), the probe result, yardstick hashes of `cases.md` / rubric / brief.
- `raw/<option>/<case-id>.json` — *local only* — the verbatim discover-agent reply.
- `raw/<option>/batch-<n>.calls.json` — *local only* — that batch's ground-truth call log plus deduplicated usage totals, written by `scripts/extract-agent-calls.mjs`; `raw/<option>/batch-<n>.meta.json` — the same script's summary (`discover.subagentTokens`, `discover.usage`, retrieval metrics; `null` when a batch has no transcript).
- `derived/<option>/shard-<n>.json` — *local only* — the auditor's mechanical facts per shard.
- `scored/<option>/<case-id>.json`, `scored/<option>/shard-<n>.json`, `scored/<option>/accuracy.json`, `scored/<option>/rescore.json` — *local only* — the verbatim scorer replies.
- `scores.json` — validated and recomputed results per option (scores, points, totals, verdicts, audits, averages, status, `costs`), the option matrix and audit warnings.
- `costs.json` — per-run, per-batch cost detail (source, dedup method, tokens, models, warnings) written by `scripts/aggregate-costs.mjs`; `scores.json → options.<option>.costs` is the same figures rolled up per option. Cost = usage of the option's discover agents only, one usage block per API message id (the record carrying the final `output_tokens`), split into non-cache and cache-read tokens; see `scripts/aggregate-costs.mjs` and the SKILL.md Objectivity rules for the full definition. Never hand-edit either file.
- `kb-quality-report.md` — the human-readable report (comparison layout).
- `report.html` — the self-contained dynamic report: summary and ranking, dimension heatmap, case × option grid with drill-down into every request, answer, citation, tool call and finding, raw data, run metadata. Open it directly in a browser.

A `compare-*` folder holds `scores.json`, `kb-quality-report.md` and `report.html` merged from one run per option (the newest by default).

## What is committed

Git keeps a run's **final results only** — the five per-run files `run.json`, `scores.json`, `costs.json`, `kb-quality-report.md` and `report.html` — plus the cross-run `overview.html`, this README and `.gitignore`. A `compare-*` folder is covered by the same rules.

Everything else a run writes — `raw/`, `derived/`, `scored/`, the batch `calls`/`meta` files and any `aggregate-*.json` leftover — stays on disk locally but is gitignored, as are `.cache/` (the accuracy scorer's transient fetch cache) and `.transcript-index.jsonl`. The rules are an allow-list in `.gitignore`, so a new kind of intermediate is ignored by default; a run folder with no `kb-quality-report.md` contributes nothing to git. Nothing is deleted from disk — this is about what travels in a clone, not about cleanup.

What a clone without the intermediates can do: every `report.html` and `overview.html` renders in full (each `report.html` inlines its own data), and `scripts/aggregate-costs.mjs --overview-only` rebuilds `overview.html` from `run.json` + `costs.json` + the committed rows. What it cannot do: `--resume` a run, or fill compare's *Requests and responses* section from `raw/` — both need that run's intermediates on the local disk.

## overview.html

A single self-contained HTML file (no build step, no external dependencies) that accumulates one row per option per run — option, access, corpus, model, label, overall %/status, developer/functional %, findability, edge/gap pass counts, verdict counts, weakest dimension, and cost (non-cache tokens, cache-read tokens, cache hit %, est. USD, tool calls, agent time, wall clock), with links to the run's markdown and HTML reports. It is the only cross-run artifact and is *not* gitignored, since it is what lets quality and cost be tracked over time. `scripts/aggregate-costs.mjs --run reports/<run>` **regenerates** it in full from `reference/overview-template.html` and every run folder on disk after every run — it is never hand-appended. Rows from before this accounting (`costsSource: "legacy"`) keep their quality fields but show "—" for every cost column. `--all` only sees runs whose `raw/<option>/batch-*.json` are on the local disk, so on a fresh clone it processes nothing and leaves the file alone; `--overview-only` is the form that rebuilds it there, keeping the existing rows and re-enriching them from each run's `run.json` and `costs.json`. Open it directly in a browser; filter by option or corpus, click a column header to sort.
