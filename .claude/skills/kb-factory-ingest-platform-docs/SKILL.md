---
name: kb-factory-ingest-platform-docs
description: Build or refresh the platform layer of the ShopwareDevKnowledgeBase MCP — sync Shopware developer + merchant docs, reconcile the ingestion state, write page articles, hubs, guideline files and the synonyms file by routing work to pinned writer sub-agents, assemble the index.md files, lint and eval. Deterministic CLI + Claude Code sub-agents; no API key. Pauses to show the diff and workload before spending tokens; stops on lint/eval failure; never commits.
when_to_use: Trigger phrases — "ingest the knowledge base", "refresh the platform docs wiki", "rebuild the KB", "sync shopware docs into the KB", "run the KB ingestion", "regenerate KB pages/hubs/guidelines/synonyms".
argument-hint: [all-active | sync | pages | hubs | guidelines | build | synonyms | lint | eval | developer:6.7 | developer:6.6 | merchant | developer:6.5] [--wiki <root>]
allowed-tools: Read Glob Agent AskUserQuestion Bash(npm run wiki:*) Bash(git status --porcelain *) Bash(du -sh *)
user-invocable: true
effort: low
---

# kb-factory-ingest-platform-docs

Build or refresh the `platform` layer of the `ShopwareDevKnowledgeBase` MCP wiki — the companion to [`kb-factory-verify`](../kb-factory-verify/SKILL.md), which grades what this skill produces (kb-factory-* family: tooling that builds and checks the knowledge-base itself, not project feature work). What is stored and how it is served is described in [`wiki/README.md`](../../../wiki/README.md) and [`docs/producer-manual.md`](../../../docs/producer-manual.md).

This skill **orchestrates only**: it never writes wiki content, articles, hubs, guideline files or synonyms itself. Content comes from two places — the deterministic `wiki:*` CLI (`npm run wiki:<verb> -- --layer platform [--source <id>]`), which fetches, diffs, validates and assembles; and pinned writer sub-agents, launched by this skill in waves and routed per work type (`kb-factory-ingest-writer` for plain pages and hubs, `kb-factory-ingest-code-writer` for `codeCheck` page batches, `kb-factory-ingest-guideline-writer` for guideline items, `kb-factory-ingest-synonyms-writer` for synonyms batches), which write page articles, hubs, guideline files and synonyms lines from prepared work items. **No packaging or distribution work happens here** — `wiki/composer.json`, the wiki package `README.md`, signed release tags and Composer publishing are out of scope for this skill; it only ever touches the content structures (articles, `index.md` files, hubs, guideline files, `manifest.json`, `synonyms.md`).

Only three sources are active: `developer:6.7`, `developer:6.6`, `merchant`. A fourth, `developer:6.5`, is registered but deactivated. A fifth, `developer-portal`, is also registered but deactivated by default and non-content (it only carries the portal's llms.txt/sitemap for the `developer` source's optional unpublished-page gate) — it is out of this skill's directly-invocable scope and never a valid argument. See `reference/sources.md`.

## Inputs

| Input | Source | Default |
|---|---|---|
| Phase name (`sync`, `pages`, `hubs`, `guidelines`, `build`, `synonyms`, `lint`, `eval`) | `$ARGUMENTS` | runs that phase alone (`pages`/`hubs`/`guidelines`/`synonyms` include their own prepare → waves → ingest → retry cycle) |
| Source name (`developer:6.7`, `developer:6.6`, `merchant`) | `$ARGUMENTS` | runs the full routine scoped to that source (via the CLI's `--source <id>` flag) on `sync`/`pages`/`hubs`; `build`/`guidelines`/`synonyms`/`lint`/`eval` always run whole-layer |
| `developer:6.5` | `$ARGUMENTS` | rejected — see `reference/sources.md` Step 0 resolution rule; no work done |
| `developer-portal` | `$ARGUMENTS` | rejected — never a valid argument to this skill; see `reference/sources.md` Step 0 resolution rule |
| `all-active` (or `all`, or omitted) | `$ARGUMENTS` | full routine, all three active sources |
| Unknown argument | — | error: list valid values from `reference/sources.md` and this table, then stop |
| Wiki root | `--wiki <root>` in `$ARGUMENTS`, passed through to every CLI call | `./wiki` |
| Prerequisite files | `ingest/platform/{config.json,state/,prompts/{page,hub,synonyms,guideline}.md}`, `.claude/agents/{kb-factory-ingest-writer,kb-factory-ingest-code-writer,kb-factory-ingest-guideline-writer,kb-factory-ingest-synonyms-writer}.md` | must all exist — Step 0 stops and names exactly what's missing if not |
| Checkpoint approval | `AskUserQuestion` at the network-fetch gate and checkpoint 1 | required unless the argument is a single non-LLM phase (`sync`, `build`, `lint`, `eval`) |

## Clean start (optional, before wiping and rebuilding the whole wiki)

Only when the operator explicitly asks for a from-scratch rebuild, not part of the default Procedure below:

1. Dry run first — `npm run wiki:clean -- --layer platform --scope all --source all` (no `--yes`: this is always a plan-only listing, never a mutation). Show the plan (files/dirs that would be removed, across the `wiki`, `state` and `cache` scopes — the pinned Shopware checkouts under `.sources/` are owned by `npm run setup`, not by `wiki:clean` — hubs, `platform/synonyms.md`/`platform/synonyms/`, `platform/guidelines/`) and get explicit approval before the next command.
2. Mutate — the same command with `--yes` appended.
3. Run this skill normally (`all-active`, or the scope the operator asked for) from Step 0.
4. After the run, tell the operator to reconnect the MCP server (`/mcp`) — the `ShopwareDevKnowledgeBase` server walks its wiki tree once at startup, so a mid-session wipe-and-rebuild is invisible to it until reconnected.

## Procedure

### Step 0 — Scope and prerequisite check

Every `wiki:*` command in this skill runs from the factory root (the repository root in a
standalone clone) — `npm run` resolves `package.json` from the current directory, so no `--prefix`
is needed.

1. Read `reference/sources.md`. Resolve `$ARGUMENTS` against its Step 0 resolution rule (source table + phase names + `all-active`). A `developer:6.5` argument gets the exact deactivation message from that file, and a `developer-portal` argument gets the exact out-of-scope message, and the skill stops here — do no further work, run no CLI command, launch no agent.
2. Verify these exist (`Read`/`Glob`, do not create them if missing — that is the companion CLI-tooling build's job, not this skill's):
   - `ingest/platform/config.json`
   - `ingest/platform/state/` (directory: `_shared.json` plus one file per source key, e.g. `developer/6.7.json`, `merchant.json`)
   - `ingest/platform/prompts/page.md`, `hub.md`, `synonyms.md`, `guideline.md`
   - `.claude/agents/kb-factory-ingest-writer.md`, `kb-factory-ingest-code-writer.md`, `kb-factory-ingest-guideline-writer.md`, `kb-factory-ingest-synonyms-writer.md`

   If any is missing, stop and name exactly which file(s) are missing and that the ingestion tooling build needs to finish first.
3. If `ingest/platform/config.json`'s `codeCheck.enabled` is true, also verify a code root is
   available for each in-scope version: either `vendor/composer/installed.json` and
   `vendor/shopware/core` (vendor mode), or `.sources/shopware/<version>/.tag` matching the
   version's pinned `codeCheckouts` entry (checkout mode — the default; `npm run
   setup` fetches it). If neither mode is satisfied for a version, stop and say so plainly —
   codeCheck items cannot be prepared without a code root; never skip the check silently and
   never fall back to running without it.
4. Print the resolved scope (sources, phase, wiki root) before doing anything else.

### Step 1 — Network-fetch confirmation gate

Only when the resolved scope includes `sync`/`pages`/`hubs`/`guidelines`/`all-active` **and** at least one in-scope source's own per-source `state/` file (e.g. `state/developer/6.7.json`, `state/merchant.json` — `lastSync` is a field of each `SourceState`, never of the whole-layer `_shared.json`) has no `lastSync` recorded yet (whole-layer phases check every active source's file), **or** the resolved scope reaches `guidelines` and the `6.6` code checkout has never run (read-only check via `Read`, no CLI call needed for this check alone): show the gate from `reference/checkpoint-report.md` via `AskUserQuestion`, naming the exact allowlisted hosts (Security C7, also listed in `reference/security-checklist.md`) plus, when in scope, the `6.6` git checkout (`reference/sources.md`, "The `guidelines` phase's own inputs"). Continue only on explicit approval; `stop` ends the run here.

### Step 2 — Sync (Phases 1–2 of the refresh spec)

`npm run wiki:sync -- --layer platform [--source <id>] [--wiki <root>]` for each in-scope source (or once, letting the CLI iterate active sources, if the CLI supports that — check its actual stdout contract; the refresh spec's contract prints one line per source plus a totals line). A full/`all-active` run does one unscoped `wiki:sync` — it covers the three active page sources. The pinned Shopware checkouts under `.sources/` are **not** fetched here: `npm run setup` owns them and `wiki:sync` only verifies that the pin on disk matches the configured one. The `developer` download is complete — guidelines and ADRs are ordinary dev pages, no second snapshot; the `guidelines` phase's `docs:`/`merchant:` inputs are resolved from the same `developer`/`merchant` downloads, so no extra sync target exists for it. Skip this step entirely when the resolved phase is `build`, `lint`, or `eval` alone.

`wiki:sync` prints exactly one JSON stdout line per in-scope target (every page source, plus a verification line per configured code checkout when in scope), aborted targets included — an aborted target's line carries `fetched: 0` and an `error` field instead of the usual counts, so parsing stdout alone always accounts for every target. A non-zero exit code means at least one target aborted (a fetch failure, not a partial diff): stop before Checkpoint 1, show the `error` field of every stdout line reporting one plus the matching stderr `aborted:` lines, and ask the operator whether to retry (`wiki:sync` is idempotent — a re-run only redoes what still needs fetching) or continue with the sources that did sync.

### Step 3 — Checkpoint 1

Skipped when the resolved scope is `sync`, `build`, `lint` or `eval` alone. Otherwise render `reference/checkpoint-report.md`'s Checkpoint 1 template from the `sync` command's JSON output and the `state/` files: per-source diff, prompt-hash changes, workload estimate (batches/agents/waves/wall-clock per phase, including a `guidelines` row), size projection. When `codeCheck.enabled` is true, also show the count of code-checked page items (batched at size 5, per `config.json` `codeCheck.batchSize`) and note that those batches cost roughly 3–4× a normal writer batch in tokens (extra `Grep`/`Read` turns against `vendor/shopware`). `AskUserQuestion`: `continue` (Steps 4–10 in order: pages → hubs → guidelines → build → synonyms → build again → lint → eval) / `pages only` (pages → build → lint only, skipping hubs/guidelines/synonyms/eval) / `stop`.

### Step 4 — Pages

`npm run wiki:pages -- --layer platform [--source <id>] --prepare [--wiki <root>] [--path <wikiPath> ...]` → parse the `files[]` list from its JSON stdout line. Batches come in two sizes in the same prepare run, grouped contiguously by `codeCheck`: code-checked items (5 per batch, every item in the batch carries a `codeCheck` field) and all other items (15 per batch, no item carries `codeCheck`). Route each batch by that field: a `codeCheck` batch → `subagent_type: kb-factory-ingest-code-writer`, `name: kb-ingest-codepage-<batch-NN>`, prompt = `reference/agent-brief-code-page.md`; a plain batch → `subagent_type: kb-factory-ingest-writer`, `name: kb-ingest-pages-<batch-NN>`, prompt = `reference/agent-brief-page.md` (each brief with `{{BATCH_PATH}}`, `{{PROMPT_PATH}}`, `{{OUT_DIR}}`, `{{OUTLINE_PATH}}` substituted). For each wave of ≤10 batches (per `config.json` `ingest.waveSize`), mixing both agent types freely within the wave: launch all of that wave's batch agents **in one message** → wait for the wave → `npm run wiki:pages -- --layer platform [--source <id>] --ingest [--wiki <root>] --batch <file>` once per batch file of **this wave only** (repeat the `--batch <file>` flag for every file, or issue one call per file — either way, never pass a batch file from a wave that hasn't launched yet) → record `ok`/`failed` from its JSON line(s). Repeat `--prepare` until it returns `items:0`, then run `--retry-failed` once (its own wave(s), each ingested the same way with `--batch <file>` naming only that wave's files). The repeatable `--path <wikiPath>` flag on `--prepare` limits preparation to the named wiki-relative page path(s), for a targeted or test run instead of the whole source.

### Step 5 — Hubs

Same pattern as Step 4 with `wiki:hubs`, `reference/agent-brief-hub.md` (`{{BATCH_PATH}}`, `{{PROMPT_PATH}}`, `{{OUT_DIR}}`, `{{WIKI_ROOT}}` substituted — no `{{OUTLINE_PATH}}`, hubs have none), `subagent_type: kb-factory-ingest-writer` always (hubs never carry `codeCheck`), one agent per dirty hub (`name: kb-ingest-hub-<slug>`), ≤10 per wave — `--ingest --batch <file>` per batch file of this wave only, same as Step 4.

### Step 6 — Guidelines

`npm run wiki:guidelines -- --layer platform --prepare [--version <v>] [--wiki <root>]` → parse the `files[]` list. One item per batch file. For each wave of ≤10 batches: launch all of that wave's batch agents **in one message**, `subagent_type: kb-factory-ingest-guideline-writer`, `name: kb-ingest-guideline-<version>-<slug>`, prompt = `reference/agent-brief-guideline.md` with `{{BATCH_PATH}}`, `{{PROMPT_PATH}}`, `{{OUT_DIR}}` substituted → wait for the wave → `npm run wiki:guidelines -- --layer platform --ingest [--wiki <root>] --batch <file>` for each batch file of **this wave only** → record `ok`/`failed`. Repeat `--prepare` until `items:0`, then `--retry-failed` once (its own wave(s), ingested the same way with `--batch <file>` naming only that wave's files). `6.6` items report skipped, not failed, until **`npm run setup`** has fetched the pinned `6.6` checkout into `.sources/shopware/6.6/` (`wiki:sync` only verifies it); items whose `sourceInputs` include a `docs:` scheme report skipped until `wiki:sync` has synced the `developer:<v>` source, and a `merchant:` scheme report skipped until `wiki:sync` has synced `merchant` — name every skipped version in the run summary. Runs after Pages/Hubs (its `sourceInputs` read already-ingested `platform/dev/<v>/**` wiki pages) and before Build/Lint (its output files must exist for the manifest counts and lint). Expert sections (`> [expert]` as the first line under a `##` in the existing wiki file) survive automatically: `--prepare` lists their anchors and bytes in the item (`expert`, `sizeBudget`) and `--ingest` splices them back into the writer's output before the gates run — a writer that writes one of those anchors fails its item. Report every curated file still failed after `--retry-failed` plainly.

### Step 7 — Build

`npm run wiki:build -- --layer platform [--wiki <root>]`. Always whole-layer, never source-scoped, and always runs regardless of which sources were in scope for sync/pages/hubs/guidelines (it assembles the index files and manifest for the entire tree, including `platform/guidelines/<version>/`). Runs even when the resolved scope was a single source.

### Step 8 — Synonyms (optional)

Only if `config.json` `synonyms.enabled` is true. Same pattern as Step 4 with `wiki:synonyms`, `reference/agent-brief-synonyms.md` (`{{BATCH_PATH}}`, `{{PROMPT_PATH}}`, `{{OUT_DIR}}` substituted — no `{{OUTLINE_PATH}}`), `subagent_type: kb-factory-ingest-synonyms-writer` (`model: haiku`; switch the wave to `model: sonnet` if lint or the alias spot-check degrades and note the switch in the run summary), whole-layer (no `--source`) — `--ingest --batch <file>` per batch file of this wave only, same as Step 4. Immediately after synonyms ingest (or immediately after Step 7 when synonyms was skipped/disabled), re-run Step 7's `wiki:build` command once more — the synonyms file(s) it just wrote feed the manifest's `synonymsLines` freshness field and the link check the first build could not have seen yet (the manifest's `counts`/`hubs` totals are unaffected by synonyms).

### Step 9 — Lint (blocking)

`npm run wiki:lint -- --layer platform [--wiki <root>]`. Non-zero `errors` in its JSON line → **Checkpoint 2** (`reference/checkpoint-report.md` template): stop, report, run nothing further. The optional `kb-factory-ingest-lint` skill runs this same build+lint pair in a forked context and may be used instead, to keep raw lint output out of the main conversation.

### Step 10 — Eval (non-blocking, may not exist yet)

Check whether the `wiki:eval` npm script exists in `package.json` first (`Read`). If it's not registered yet (the companion CLI-tooling build defers it — refresh spec Phase 8, "deferring `wiki:eval` to a later increment"), skip this step and note "eval skipped: wiki:eval script not present yet" in the final report — do not fail the run over it. If it exists, run `npm run wiki:eval -- --layer platform [--wiki <root>]` and read its JSON line's `implemented` field first: `implemented:false` (the current stub — `hitAt2Calls`/`hitAt2CallsWithoutSynonyms` are `null`, not a real score) means note "eval skipped: not implemented" in the final report and continue, never gate on it. Only when `implemented:true` does `hitAt2Calls < 0.8` mean **Checkpoint 2**: stop, report.

### Step 11 — Final report

Render `reference/checkpoint-report.md`'s final-report template: scope, per-phase counts (from CLI JSON lines, verbatim), failures with paths and retry command, lint/eval quality, `du -sh` size delta, the agent name + model routed per phase, and the suggested next commands — an explicit-path `git add`/`git commit` line and `/kb-factory-verify both-wiki all` — **never run them**.

Brief placeholders, substituted with real paths before every `Agent` call (every placeholder used in `reference/agent-brief-*.md` is one of these — none is left unsubstituted):

- `{{BATCH_PATH}}` — absolute path to the one JSON batch file `wiki:<phase> --prepare` wrote for this agent (one entry in its `files[]` list).
- `{{PROMPT_PATH}}` — absolute path to `ingest/platform/prompts/{page,hub,guideline,synonyms}.md`, matching the phase.
- `{{OUTLINE_PATH}}` — absolute path to `ingest/shared/page-outline.md` (pages only; omit for hubs/guidelines/synonyms).
- `{{OUT_DIR}}` — the absolute staging directory for this phase, exactly as the CLI writes it (never a path the skill invents): `ingest/platform/.cache/out/pages` for pages, `ingest/platform/.cache/out/hubs` for hubs, `ingest/platform/.cache/out/guidelines/<version>` for guidelines (per-version subdirectory — read `<version>` off the batch item), `ingest/platform/.cache/out/synonyms` for synonyms.
- `{{WIKI_ROOT}}` — absolute wiki root (`item.wikiRoot` in the hub work item), used by the hub writer to `Read` a member article's full text by joining it with a `members[]`/`memberInfo[].path` entry.
- `{{OUTPUT_HYGIENE}}` — the full contents of `reference/output-hygiene.md`, substituted verbatim (every `agent-brief-*.md` states the hygiene gate once via this placeholder instead of repeating it — the `kb-factory-ingest-synonyms-writer` sub-agent can only read under `ingest/`, so the text must reach it already inlined in its brief, not as a path it reads itself).

Sub-agent launch details: `Agent` tool, one call per batch/hub/guideline-file/synonyms-batch, **every call of a wave in a single message**, `subagent_type` routed per work type per the table above (`kb-factory-ingest-writer` for plain pages and hubs, `kb-factory-ingest-code-writer` for `codeCheck` page batches, `kb-factory-ingest-guideline-writer` for guideline items, `kb-factory-ingest-synonyms-writer` for synonyms batches) — never any other `subagent_type`. Record which agent + model handled each phase in the final report. The agent's own ≤5-line report is read only to see which paths it claims done/failed — the following `--ingest` call is the sole authority on what actually landed in the wiki; never take an agent's self-report as ingested. The CLI's `--source` flag (selecting the source, when the resolved scope names one) is passed to every `sync`/`pages`/`hubs` call only; `build`, `guidelines`, `synonyms`, `lint`, `eval` never take it. `--wiki <root>` (when given) is passed to every CLI call.

## Honesty rules

- An item is "ingested" only when `--ingest` accepted it; a sub-agent's own report never overrides validation.
- Never write an article, hub, guideline file or synonyms line itself — only sub-agents through work items; never hand-fill a failed item.
- Never commit, never touch `wiki/project/`, `wiki/marketplace/`, `src/`, `ingest/platform/` internals beyond reading them, or `kb-factory-verify`'s golden cases/reports.
- Never do packaging/distribution work — no edits to `wiki/composer.json`, the wiki package `README.md`, tags, or Composer release steps.
- Report counts from CLI JSON output verbatim; if a phase was skipped (including eval when its script doesn't exist yet) or stopped at a checkpoint, say so plainly.
- Never run `git add -A`/`git add .`; the suggested commit command names explicit content paths only, and is only ever printed, never executed by this skill.
- A `developer:6.5` request never silently falls through to `all-active` or to an unknown-argument error — it gets the specific reactivation message from `reference/sources.md`. A `developer-portal` request never falls through either — it gets the specific out-of-scope message; it is never a valid argument.

## Reference files

All under `${CLAUDE_SKILL_DIR}/reference/`:

- `sources.md` — the 5-row source activation table (3 active version-entries, `developer:6.5` deactivated, `developer-portal` deactivated and non-invocable) and the Step 0 argument-resolution rule.
- `schemas.md` — the authoritative statement of page frontmatter, index-line format, hub frontmatter, `manifest.json` fields, id/path rules (including shared-article dedupe and `_index.md`), synonyms line format, and the 512 KB large-file-splitting rule.
- `security-checklist.md` — condensed restatement of the refresh spec's Security requirements (C1–C14) and the design spec's B7 untrusted-content rule, for this skill's own conduct and for citing in agent briefs.
- `checkpoint-report.md` — templates for the network-fetch gate, checkpoint 1, checkpoint 2, and the final report.
- `agent-brief-page.md` — the brief handed to `kb-factory-ingest-writer` for plain page batches, Step 4.
- `agent-brief-code-page.md` — the brief handed to `kb-factory-ingest-code-writer` for `codeCheck` page batches, Step 4.
- `agent-brief-hub.md` — the brief handed to `kb-factory-ingest-writer` for hubs, Step 5.
- `agent-brief-guideline.md` — the brief handed to `kb-factory-ingest-guideline-writer` for guideline items, Step 6.
- `agent-brief-synonyms.md` — the brief handed to `kb-factory-ingest-synonyms-writer` for synonyms batches, Step 8.
- `output-hygiene.md` — the one output-hygiene gate list, substituted into every `agent-brief-*.md` via `{{OUTPUT_HYGIENE}}` (never restated in each brief).

Every brief carries the untrusted-source-text rule, the forbidden-actions list, and a ≤5-line report contract.
