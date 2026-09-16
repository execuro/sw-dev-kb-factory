# kb-factory-ingest-platform-docs

## What it is

Builds or refreshes the `platform` layer of the `ShopwareDevKnowledgeBase` MCP wiki (`wiki/platform/`) from Shopware developer and merchant documentation. A deterministic CLI (`wiki:*` npm scripts) handles fetching, diffing, validating and assembling the tree; pinned Claude Code sub-agents write the LLM-authored parts — page articles, hubs, guideline files and synonym lines — from prepared work items (`kb-factory-ingest-writer` for plain pages/hubs, `kb-factory-ingest-code-writer` for `codeCheck` pages, `kb-factory-ingest-guideline-writer` for guidelines, `kb-factory-ingest-synonyms-writer` for synonyms). This skill only orchestrates: it never writes content itself.

```
SOURCES (data origins)
  developer:6.7 (GitHub)   developer:6.6 (GitHub)   merchant (Algolia)     developer:6.5 — INACTIVE   developer-portal — INACTIVE
        └──────────────────────┴──────────────────────┘                    (skipped unless           (gate-only; carries
                            │                                                reactivated)              llms.txt/sitemap for the
                            │           6.6 pinned code checkout (git clone, github.com)                developer source's gate)
                            │           (developer downloads are complete: guidelines/ADRs included)
                            ▼
        you run:  /kb-factory-ingest-platform-docs
        (the ONE entry point — no separate way to trigger a stage)
                            │
                            ▼
   ┌──────────────────────────────────────────────────────────┐
   │  sync  →  checkpoint 1 (you confirm)  →                   │
   │  pages / hubs / guidelines / synonyms                     │
   │     └─► spawns the matching writer sub-agent type,         │
   │         one per batch/hub/guideline-file, a wave (≤10)     │
   │         at a time                                          │
   │  →  build  →  lint (blocking)  →  eval (stub)  →  report   │
   │     (build runs a second time after synonyms)               │
   └──────────────────────────────────────────────────────────┘
                            │
                            ▼
             wiki/platform/   ← the actual output (markdown tree)
                            │
                            ▼
     ShopwareDevKnowledgeBase MCP server
     (list_docs / grep_docs / read_doc / kb_status)
                            │
                            ▼
     other Claude Code agents & skills read the KB from there
     (sw-php-backend-developer, sw-shopware-architect, …)
```

## Workflow

A single stage name (e.g. `sync`, `lint`) runs just that stage against whatever `ingest/platform/state/` already holds, without first running its dependencies; checkpoint 1 is skipped for `sync`/`build`/`lint`/`eval` (no approval needed) but still shown for `pages`/`hubs`/`guidelines`/`synonyms`. A source name (e.g. `developer:6.7`) runs the full sequence but scopes only `sync`/`pages`/`hubs` to that source — `guidelines`/`build`/`synonyms`/`lint`/`eval` always run whole-layer. Either way, a final report always renders (unless a checkpoint stops the run), showing skipped stages as such.

Each stage's *What* is the outcome it produces; *How* is the actual mechanism behind it.

| Stage | What | How | Blocking? |
|---|---|---|---|
| sync | Fetch and reconcile source content for the in-scope sources, updating `state/` (`_shared.json` plus one file per source key), plus (whole-layer) the `6.6` pinned code checkout. The `developer` download is complete — guidelines and ADRs included, upstream `.docsignore` deliberately not applied — so there is no separate guidelines source to sync. | CLI (`wiki:sync`) fetches each source from its origin (GitHub/raw.githubusercontent for dev docs, Algolia/docs.shopware.com for merchant docs, a shallow sparse `git clone` for the `6.6` checkout), sanitises the fetched text, diffs it against the source's `state/` file to flag new/changed/removed/unchanged items. | — |
| checkpoint 1 | Show the diff and workload before any tokens are spent. | Renders `reference/checkpoint-report.md`'s Checkpoint 1 template from `wiki:sync`'s JSON output + the `state/` files; asks continue/pages-only/stop via `AskUserQuestion`. | gate |
| pages | Write the condensed article for each new/changed page. | CLI batches reconciled items (`wiki:pages --prepare`); skill launches each wave's ≤10 writer agents in one message, one per batch, routed by whether the batch carries `codeCheck` (`kb-factory-ingest-writer` via `reference/agent-brief-page.md`, or `kb-factory-ingest-code-writer` via `reference/agent-brief-code-page.md`); `wiki:pages --ingest` validates and moves the output into `wiki/platform/`; repeats until `items:0`, then `--retry-failed` once. | — |
| hubs | Write or refresh each topic overview page and its member links. | Same prepare → wave → ingest cycle as pages, one agent per dirty hub via `reference/agent-brief-hub.md` (`kb-factory-ingest-writer`). | — |
| guidelines | Synthesize one self-contained rule file per curated file under `platform/guidelines/<version>/`. | Same prepare → wave → ingest cycle, one agent per curated-file item via `reference/agent-brief-guideline.md` (`kb-factory-ingest-guideline-writer`, `model: opus`); its `docs:` inputs resolve from the `developer:<v>` download and `merchant:` inputs from the `merchant` download (both are whole-repository downloads); `6.6`/`docs:`/`merchant:`-input items report `skipped`, not `failed`, until the matching sync input has run. Runs after pages/hubs (reads their output), before build. | — |
| build | Assemble the navigable index and provenance record for the whole layer. | `wiki:build` writes `platform/dev/<version>/index.md`, `platform/func/index.md`, `platform/hubs/index.md` from page frontmatter (no `index.md` for guideline directories — base files are the entry points), resolves internal links, computes `manifest.json` (per-page + tree sha256 hashes); never touches `platform/index.md`'s own prose, which is hand-maintained; always whole-layer, even for a single-source run. Runs a second time after synonyms. | — |
| synonyms | Add a grep-able alias file bridging keyword variants across pages. | Same prepare → wave → ingest cycle, whole-layer, batches concept keywords via `reference/agent-brief-synonyms.md` (`kb-factory-ingest-synonyms-writer`); only runs if `config.json`'s `synonyms.enabled` is true. | — |
| lint | Verify every conformance rule before the run counts as done. | `wiki:lint` checks frontmatter completeness, index/link consistency, manifest hash agreement, size caps, injection strings, guideline code-check/size rules. | **blocking** — non-zero errors stop the run (checkpoint 2) |
| eval | Would measure retrieval quality (`hitAt2Calls`) of the built content. | `wiki:eval` is registered but is a documented stub — it always exits 0 with `implemented:false` and null scores, so this step is noted "eval skipped: not implemented" in the report and never gates the run. | non-blocking stub |
| report | Summarize the run and point to next steps. | Renders `reference/checkpoint-report.md`'s final-report template from each phase's CLI JSON output (counts, failures, quality, size delta); prints — never runs — the suggested commit and `/kb-factory-verify` commands. | — |

## Sources

| Source | docType | Active |
|---|---|---|
| `developer:6.7` | developer | Yes — current version |
| `developer:6.6` | developer | Yes — frozen since 2026-04-24 |
| `merchant` | functional | Yes — no branch signal, hashed per fetch |
| `developer:6.5` | developer | **No** — registered but deactivated (frozen 2026-04-24); reactivate by flipping `active:true` on the `6.5` version-entry inside the `developer` source in `ingest/platform/config.json` |
| `developer-portal` | — (not content-bearing) | **No** — registered but deactivated by default; carries llms.txt/sitemap for the `developer` source's optional unpublished-page gate only; out of this skill's directly-invocable scope |

## How to use

To update the knowledge base end to end, run:

`/kb-factory-ingest-platform-docs all-active`

What happens: it checks the prerequisite files exist, asks you to confirm before it ever fetches from the network (only shown the first time a source or the `6.6` checkout has no prior run yet), then shows a diff + workload estimate and asks again before any tokens are spent (checkpoint 1), then runs sync → pages → hubs → guidelines → build → synonyms → build → lint → eval and prints a final report.

To rebuild from scratch, first ask for a clean start — see `SKILL.md`'s "Clean start" section (`wiki:clean` dry run, approval, `--yes`, then this same run, then reconnect `/mcp` since the MCP server only walks the wiki tree at startup).

This is interactive, not a fire-and-forget script — expect at least two confirmations before real work happens, and a possible third stop if lint or eval fails.

Slash command: `/kb-factory-ingest-platform-docs [all-active | sync | pages | hubs | guidelines | build | synonyms | lint | eval | developer:6.7 | developer:6.6 | merchant | developer:6.5] [--wiki <root>]`. Other forms (single stage alone, or scoped to one source):

- `/kb-factory-ingest-platform-docs lint` — run just the lint stage, no source scoping.
- `/kb-factory-ingest-platform-docs developer:6.6` — full routine scoped to one source (`build`/`synonyms`/`lint`/`eval` still run whole-layer). Internally the CLI selects that source via its `--source <id>` flag.
- `/kb-factory-ingest-platform-docs developer:6.5` — rejected outright with a reactivation message; no CLI call, no agent launched.
- `/kb-factory-ingest-platform-docs developer-portal` — rejected outright; `developer-portal` is never a valid argument to this skill (it's consulted internally by the `developer` source's own sync process, never run standalone).

## What it will never do

- No packaging or distribution work — `wiki/composer.json`, the wiki package README, release tags, Composer publishing are all out of scope.
- Never commits. It only ever prints the `git add`/`git commit` command (explicit paths, never `-A`/`.`) as a suggestion.
- Never runs `kb-factory-verify` itself — only suggests `/kb-factory-verify both-wiki all` as a next step.
- Never touches `developer:6.5` without an explicit, separate reactivation of that version-entry in `config.json` first.
- Never invokes `developer-portal` directly, standalone or otherwise.

## Current status

Working first build. The core pipeline — sync, pages, hubs, guidelines, build, lint, synonyms — is functional. `wiki:eval` is a documented stub (Phase 8 of the refresh spec), so eval is currently skipped every run.

Known limitations from the last audit (pointer, not a full list):
- `platform/index.md`'s overview prose isn't auto-generated yet.
- Merchant historical-revision pages (`@<swMin>.md`) aren't fetched yet.
- Hub batching needs a fix before hubs are configured for real use.
