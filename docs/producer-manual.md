# Shopware Dev Knowledge Base — producer manual

This is the manual for the people who **build and ship** the knowledge base, not for the developers who
query it. The product is a documentation corpus plus a small MCP server, published to npm as
`@execuro-sw-ecosystem/sw-dev-knowledge-base-mcp` and consumed by Claude Code, Codex and any other
stdio MCP client. Every path below is relative to this repository's root unless stated otherwise.

## 1. What we ship

| Piece | Path | Role |
| --- | --- | --- |
| The wiki | `wiki/platform/` | Plain Markdown, retrieval-oriented rewrite of the official developer docs (6.6, 6.7) and merchant docs. Navigable with `ls`/`grep`/`cat`; no tooling required |
| The server | `dist/server.js` (source `src/`) | Read-only MCP server exposing four primitives over the wiki: `list_docs` ≡ `ls`, `grep_docs` ≡ `grep -rin`, `read_doc` ≡ `cat`/`sed -n`, `kb_status` ≡ probe. No ranking, no search engine, no network, no writes |
| Corpus config | `kb.config.json` | Which corpus the server serves (`wiki` or `docs`), with its developer and merchant paths and entry points |
| Registration | the consuming project's MCP configuration | `ShopwareDevKnowledgeBase` → the published package's `sw-dev-knowledge-base-mcp` bin (see [README.md](../README.md)), or `node dist/server.js` when working from a checkout; both Claude Code and Codex start it as a stdio server |

Design rules that every change must keep: the wiki is path-addressed (version and doc type are
directories — `platform/dev/6.7/…`, `platform/func/…` — never parameters); index files carry one grep-able
line per page (`path — title [versions] — summary — keywords`); `platform/synonyms.md`, or once it outgrows
the size cap the split `platform/synonyms/` (`index.md` + `part-N.md`), is the alias fallback; every page
has frontmatter with `id`, `title`, `summary`, `keywords`, `sourceUrl`, `sourceHash` (a `docType: guideline`
page instead carries `sources: [{url, hash}]` and `codeVersion`); the server
bundle imports only `node:` modules and never writes.

The layer we produce today is `platform`. `project` and `marketplace` are reserved layer names (reported as
`planned` by `kb_status`) and are out of scope for this manual.

## 1.1 One-time setup — `npm run setup`

The factory's external inputs live under a gitignored `.sources/` directory inside it, created by one
command:

```
npm run setup
```

| what | where | why |
| --- | --- | --- |
| Pinned Shopware source | `.sources/shopware/<version>/` | What the Tier-0 code check and the code-evidence lanes read. A sparse, tag-pinned checkout of `shopware/shopware` — **not** a `composer install`: composer needs PHP, and the checkout gives the code index everything it reads while needing only `git`. Pins live in `ingest/platform/config.json` → `guidelines.codeCheckouts`; `.sources/manifest.json` records what is on disk |
| Docs clones | `.sources/docs/{developer,merchant}/` | The `docs` corpus that `fs-docs`/`mcp-docs` test against |

It is idempotent, resumable, and an offline no-op once satisfied. `--adopt-docs <path>` renames
existing clones into place rather than re-downloading ~1 GB. A missing **merchant** clone is not an
error — it is a private repository, and a missing optional input degrades the run rather than
failing it, so setup says what is unavailable and continues; the
committed `wiki/platform/func/` layer stays usable.

Every root resolves from the factory directory itself, never from the working directory, so every
`wiki:*` command works from anywhere. Full detail: `docs/sources.md`.

## 2. Building the wiki

The build is the `kb-factory-ingest-platform-docs` skill driving a deterministic CLI plus writer sub-agents.
No API key: the LLM work runs inside the Claude Code session that invokes the skill.

```
/kb-factory-ingest-platform-docs all-active        # full refresh of developer:6.7, developer:6.6, merchant
/kb-factory-ingest-platform-docs developer:6.7     # one source
/kb-factory-ingest-platform-docs lint              # one phase
```

Phases, in order (each is an npm script, `npm run wiki:<phase> -- --layer platform`):

| Phase | Who | What happens |
| --- | --- | --- |
| `sync` | CLI | Fetches upstream page sources (GitHub `shopware/docs` per version, complete — guidelines and ADRs included, upstream `.docsignore` not applied; docs.shopware.com for merchant), snapshots them into `ingest/platform/.cache/`. It does **not** fetch the pinned Shopware checkouts — `npm run setup` owns those and `sync` only verifies the pin on disk, diffs against `ingest/platform/state/`, prints the workload. Exits non-zero (2) on a fetch abort or a failed 6.6 code checkout (tag listing, clone or sparse-checkout failure) — the run must not report green while a source silently has no data |
| `pages` | CLI + `kb-factory-ingest-writer` agents | `--prepare` writes batch work items; the skill launches one writer agent per batch in waves of ≤10 with `ingest/platform/prompts/page.md`; `--ingest` validates each article (frontmatter, id/path rules, 32 KB page cap, prefilled fields unchanged, every link/cross-link resolves, frontmatter quoting and an 8 KB frontmatter head, the code-check gate below) and is the only authority on what landed. `--path <wikiPath>` (repeatable) limits a prepare to named pages; the ingest JSON lists `failedReasons` |
| `hubs` | CLI + agents | Same pattern for topic hub pages (`platform/hubs/`) |
| `guidelines` | CLI + `kb-factory-ingest-guideline-writer` agents | `--prepare` writes one work item per curated file in `guidelines.curatedFiles` (10 files × active majors); `docs:` inputs resolve from the `developer:<v>` download (upstream guideline/ADR text included, any dev page may be named) and `merchant:` inputs resolve from the `merchant` download; the writer synthesizes each file from its `sourceInputs` (plus wiki dev pages, vendored build docs), verifies identifiers against that major's code index, and cites sources as `Read more: <path>` lines; `--ingest` validates frontmatter (`docType: guideline`, `sources[]`, `codeVersion`), the `## Code check`/`Read more:`/`## Index` gates, and size caps into `platform/guidelines/<version>/`. Expert sections (`> [expert]` first line under a `##`, see `CONTRIBUTING.md`) are hand-written and preserved: `--prepare` puts their anchors and bytes plus the remaining `sizeBudget` into the work item, `--ingest` splices them back into the writer's output before the gates (a writer output that writes an expert-owned anchor, or carries the tag, fails), and an expert edit alone never re-synthesizes the file |
| `build` | CLI | Assembles the `dev/<version>`, `func` and `hubs` `index.md` files and `platform/manifest.json` (counts, `lastBuilt`, `treeHash`, per-page hashes). Always whole-layer. `platform/index.md` is hand-maintained — `build` does not touch or regenerate its rows |
| `synonyms` | CLI + agents | Alias lines (`canonical — synonyms, German UI terms, class/route names — paths`) into `platform/synonyms.md`, or once the merged file exceeds the 256 KB cap, split by actual byte budget into `platform/synonyms/index.md` + `part-N.md` (each part re-accrues from its own header, so no part is ever over cap) |
| `lint` | CLI | Blocking: schema, link, id and size checks (incl. per-file synonyms/hub caps), plus code-check findings (stale identifiers in Key steps, stale `codeCheckedAgainst` pin); a hygiene finding that could only be confirmed against the page's fetched source (a non-allowlisted link, a `data:` URI) downgrades to a warning when that source's `.cache/src/` snapshot is missing (e.g. after `wiki:clean`) — every other hygiene class stays an error regardless; any error stops the run |
| `eval` | CLI | Stub (`implemented: false`); the skill notes it as skipped and never gates on it |

**Clean start.** Before a full fresh run, wipe generated platform content: dry run first —
`npm run wiki:clean -- --layer platform --scope all
--source all` — review the listed hubs, synonyms, guidelines, state files and `.cache/code/`, then repeat
with `--yes` to delete them. `wiki/README.md`, `composer.json`, `project/`, `marketplace/` and
`platform/index.md` are always preserved; each directory's generated `index.md` and `platform/manifest.json`
are also left in place by `clean` itself (it never touches them) until the next `wiki:build` overwrites them —
don't read them as current after a clean without a rebuild. `--wiki <root>` (default `./wiki`, i.e. this
package's own `wiki/`) selects which checkout every `wiki:*` command reads and writes; point it elsewhere only
at a full checkout of the same wiki package — the isolation hook's write root and the package-purity checks
assume the default.

### 2.1 Code check — pages of the installed version are grounded in `vendor/`

The docs are not the truth for the version a project runs: most wrong answers in verification repeated a docs
sentence the installed code contradicts. So every developer page whose version equals the installed major
(`vendor/composer/installed.json`, e.g. `6.7.13.0` → `dev/6.7`) is checked against `vendor/shopware` while it is
written. Enabled by `codeCheck` in `ingest/platform/config.json`; no PHP or Docker needed.

| step | who | what |
| --- | --- | --- |
| code index | CLI (`ingest/platform/codeIndex.ts`) | Word, config-key, classmap, deprecation and feature-flag index over `vendor/shopware/{core,storefront}` and the administration `src/`, cached per `coreVersion`+`vendorHash` in `.cache/code/`. Flags identifiers in a text as `absent`, `deprecated` or `unread` |
| prepare | CLI | Marks the item `codeCheck: { coreVersion, flags, requiredMembers }` and prefills `codeCheckedAgainst`. `requiredMembers` lists, per installed base class or interface the source's snippets extend, the members a subclass must declare, read from the vendor file. Code items are batched by 5 (`codeCheck.batchSize`), others by 15 |
| write | writer agent | Also `Grep`/`Read`s the vendor roots. Rewrites Key steps to what the code requires and ends the page with `## Code check (<coreVersion>)`: one line per checked identifier, `confirmed`/`corrected`/`absent`/`deprecated`/`unread`/`unverified`, each with a `vendor/shopware/…:<line>` citation where it asserts presence |
| ingest gate | CLI (`pages.ts`) | Rejects the page when a cited line (±3) lacks the token, `confirmed` sits on a deprecation marker, `absent` has hits, a flag is missing from the section or still in Key steps / Essential identifiers (any spelling), or a Key steps class snippet omits a required member. A citation whose token is elsewhere in the same file gets its line number corrected instead of failing |

Pages of other versions (`dev/6.6`, `func`) are written from the docs only, and a page of the installed major is
never shared with another version. The manifest records `coreVersion` and `vendorHash`, and `kb_status` shows
them. The vendor tree must be installed; `pages --prepare` stops with an error rather than skipping the check.

The `guidelines` phase code-checks 6.6 files against a real 6.6 checkout instead of the installed `vendor/`:
`sync` fetches the latest `v6.6.*` tag via a shallow sparse `git clone --depth 1 --branch <tag>
--filter=blob:none --sparse` (needs `git` and network access to `github.com`) into
`ingest/platform/.cache/code/6.6/`, sparse-checks out only `src/Core`, `src/Storefront`, the administration app's `src` and `technical-docs`, and every `AGENTS.md` (`src/Administration/Resources/app/administration/…`), and reuses that checkout across runs until the tag
advances.

Guard rails the skill enforces: a confirmation gate before the first network fetch (allow-listed hosts only);
a checkpoint after `sync` showing the diff and the token workload before any agent is launched; writer agents
have Read/Write/Glob/Grep only (Grep and `vendor/` reads for code-check items, fenced by the hook in §3.1),
work from the local snapshot and never fetch; upstream text is untrusted
documentation — quoted and cited, never obeyed; the skill never commits. Sources are activated in
`ingest/platform/config.json` and `.claude/skills/kb-factory-ingest-platform-docs/reference/sources.md`
(`developer:6.5` exists but is deactivated).

After a successful run: `git add wiki ingest/platform/state` and
commit with explicit paths — never `git add -A`; the `.cache/` snapshot is gitignored.

Server changes follow the normal loop: edit `src/`, `npm test` (build + registry, server, bundle purity,
standalone, cold-start and wiki purity tests), commit the rebuilt `dist/server.js` together with the source.
`test/purity.test.ts` refuses any stray file inside `wiki/`, including a `.claude/` folder Claude Code creates
when it writes there — delete it rather than relaxing the test.

### 2.2 Known MCP limitations (document only)

Documented rather than fixed — no `src/` change for these. The server walks the whole `platform/` tree once at startup, so reconnect `/mcp` after
**any** ingest or `wiki:clean` run that adds, removes or changes a file anywhere under `platform/`, not only
`platform/guidelines/` (the server also registers the `guidelines/` view only at startup); a mid-session file
deletion needs the same reconnect or a later read raises a raw `ENOENT`; cite a `guidelines/<version>/<file>`
read by its section's tag-line path, never the returned `citation` field; `kb_status.synonyms` is `false` for
the split `platform/synonyms/` form even when it is present and valid.

## 3. Verifying the knowledge base

The KB exists so a coding agent can get what it needs mid-task, while building a Shopware feature or
refactoring one. Five questions decide whether it is good enough. Each maps to a number in the report:

| Goal | Question | Measured as |
| --- | --- | --- |
| Accessible | Can an agent reach the answer at all? | `findability` — target page reached in ≤2 list/grep calls + 1 read |
| Cheap | How many requests does it take? | `callsToTarget`, `retrievalCalls`, `deadEndCalls`, corpus text pulled into context |
| Fast | How long does a lookup take? | `toolLatencyMsP50` / `P90` — full round trip per access call |
| Accurate | Is the answer right? | `accuracy` against `reference/expected/<case-id>.md`; code beats docs beats issues (§4.2) |
| Complete | Does the answer carry every required fact, traceably? | `completeness` (3 expected facts) and `citation` (each fact tied to a page actually read) |

Read every number against the `vanilla` baseline (§3.2). A KB that does not beat an agent with no
documentation support is not worth maintaining.

**Not yet measured:** consistency of the corpus itself — contradictions between pages, stale version
pins, orphan or duplicate revisions. Per-answer completeness is not corpus completeness; a page that
disagrees with its neighbour still scores well if it answers its own case.

Verification is the `kb-factory-verify` skill: 100 golden cases (`dev-*`, `func-*`, `edge-*` traps, `gap-*`
known gaps) run blind through a discover agent and graded by an independent, tool-restricted scorer against a
six-dimension rubric (grounding, accuracy, completeness, citation, honesty, actionability; verdict
pass ≥ 85, partly ≥ 60, else fail; findability = target reached in ≤2 list/grep calls + 1 read, reported
separately). Each case's expected answer, its status and the evidence behind it live in
`reference/expected/<case-id>.md` — see §4. Accuracy is scored against that expected answer; how far it is
trusted depends on the case status. Reports land in
`.claude/skills/kb-factory-verify/reports/<run>/` as `scores.json`, `kb-quality-report.md` and a dynamic
`report.html`; `reports/overview.html` accumulates one row per option per run, including cost measured
from the discover agents' own transcripts (`scripts/aggregate-costs.mjs`), never summed by hand.
Only a run's final results are committed — `run.json`, `scores.json`, `costs.json`,
`kb-quality-report.md`, `report.html` and the cross-run `overview.html`. A run's `raw/`, `derived/` and
`scored/` intermediates stay on the local disk and are gitignored (`reports/.gitignore`, an allow-list),
so a clone carries the reports without the scratch output. `report.html` inlines its own data and renders
anyway; `--resume` and compare's *Requests and responses* section need the intermediates locally.

### 3.1 Required setup — the isolation hooks

Two hooks keep each option inside its own corpus; nothing else in the harness can fence `fs-wiki` and
`fs-docs` apart within one run. The skill refuses to start without them.

The scope fence (`kb-verify-scope-fence.sh`) is keyed on `agent_type` and also fences all four ingest
writers (§2.1), so it matters for builds too:

| agent | Read / Grep / Glob allowed under | Write allowed under |
| --- | --- | --- |
| `kb-factory-verify-discover-fs-wiki` | `wiki/` | `.claude/skills/kb-factory-verify/reports/` |
| `kb-factory-verify-discover-fs-docs` | `.sources/docs/` | `.claude/skills/kb-factory-verify/reports/` |
| `kb-factory-verify-discover-vanilla` | everything except the wiki, the docs clones and `docs/project-wiki/` | same as read |
| `kb-factory-ingest-writer` | the factory root only — no `vendor/` | `ingest/platform/.cache/out/` |
| `kb-factory-ingest-code-writer` | the factory root (incl. `.sources/shopware/`) and `vendor/shopware/` | `ingest/platform/.cache/out/` |
| `kb-factory-ingest-guideline-writer` | the factory root (incl. `.sources/shopware/`) and `vendor/shopware/` | `ingest/platform/.cache/out/` |
| `kb-factory-ingest-synonyms-writer` | `ingest/platform/` only | `ingest/platform/.cache/out/` |

The four writers' write root is `.cache/out/` only — never `.cache/work/` (pending batch files) or
`.cache/src/`/`.cache/code/` (fetched source and the pinned checkout), which they may only read.

A `Grep`/`Glob` without an explicit `path` is denied for allowlisted agents, since it would search the whole
repository. Every path the hook checks — explicit `Grep`/`Glob` paths and any absolute path mentioned in a
call — is normalized (`.`/`..` segments collapsed) before the root check, and matched against a root only
as an exact match or with a `/` boundary, so `vendor/shopwareX` cannot match a `vendor/shopware` root and a
`.cache/out/../state/_shared.json` traversal cannot match `.cache/out/`. The hook reads its JSON input with
`jq` when available, otherwise with `node -e` (Node ≥ 20). If neither is on `PATH`, it still extracts
`agent_type` with a plain `grep`/`sed` pattern: the main thread (no `agent_type`) and an unfenced agent are
let through as usual, and only a call from one of the fenced agents above fails closed, since its paths
can no longer be evaluated.

Needs `git`, Node ≥ 20, and either `jq` or Node on `PATH` for the hook's input parsing. Then:

1. `chmod +x .claude/hooks/*.sh`
2. Add to `.claude/settings.json` (the factory's own settings, not the host
   project's — this is what `kb-factory-setup` writes):

```json
"hooks": {
  "PreToolUse": [{ "matcher": "Read|Grep|Glob|Bash|Write",
    "hooks": [{ "type": "command", "command": "$CLAUDE_PROJECT_DIR/.claude/hooks/kb-verify-scope-fence.sh" }] }],
  "SubagentStop": [{ "matcher": ".*discover-.*",
    "hooks": [{ "type": "command", "command": "$CLAUDE_PROJECT_DIR/.claude/hooks/kb-verify-record-transcript.sh" }] }]
}
```

3. Verify — this must print a `"permissionDecision":"deny"` object:

```
echo '{"tool_name":"Read","tool_input":{"file_path":"'$PWD'/.sources/docs/developer/index.md"},"agent_type":"kb-discover-fs-wiki-batch-1","cwd":"'$PWD'"}' \
  | CLAUDE_PROJECT_DIR=$PWD sh .claude/hooks/kb-verify-scope-fence.sh
```

   And for the ingest writer — this must also deny (a read outside the KB and `vendor/shopware`):

```
echo '{"tool_name":"Read","tool_input":{"file_path":"'$PWD'/composer.json"},"agent_type":"kb-factory-ingest-writer","cwd":"'$PWD'"}' \
  | CLAUDE_PROJECT_DIR=$PWD sh .claude/hooks/kb-verify-scope-fence.sh
```

### 3.2 The five options and the corpus switch

Quality is measured transversally — same cases, same brief, same scorer — across two access methods, two
corpora, and a control group:

| option | access | corpus |
| --- | --- | --- |
| `fs-wiki` / `mcp-wiki` | filesystem tools / MCP tools | our wiki (`wiki/platform/`) |
| `fs-docs` / `mcp-docs` | filesystem tools / MCP tools | the official docs clones in `.sources/docs/{developer,merchant}` |
| `vanilla` | open web, `vendor/shopware/`, own knowledge | none — the baseline |

`vanilla` is an ordinary coding agent with no documentation support, defined by exclusion: the fence blocks
it from our wiki, the docs clones, the MCP server and `docs/project-wiki/`. It answers the one question the
other four cannot — does the KB beat having no KB. `findability` and access cost are `n/a` for it.

The docs corpus is the un-rewritten upstream structure; comparing it with the wiki is how we prove the
rewrite earns its keep. The server serves **one corpus at a time**, chosen by the **corpus switch**:

- `kb.config.json` → `"corpus": "wiki"` or `"docs"` (the committed default is `wiki`); after editing,
  reconnect the server (`/mcp` in Claude Code, or restart the session).
- Overrides for local experiments: `KB_CORPUS=docs node dist/server.js` or `node dist/server.js --corpus docs`;
  `--wiki-root <dir>` / `WIKI_ROOT` still point the server at an arbitrary root.
- The probe: `kb_status` returns `corpus: { name, root, developer, merchant, entryPoints[{path,present}], configSource }`.
  The verify skill refuses to start an `mcp-*` run unless `corpus.name` matches the requested corpus and every
  entry point is present, so a run can never be graded against the wrong corpus.

Setting up the docs corpus (clone commands, the hand-written `merchant/index.md` seed, the no-`node_modules`
rule) is in `docs/sources.md`; run `npm run setup` to create them. The clones are gitignored.

### 3.3 Running a verification

```
/kb-factory-verify both-wiki all --label="after 6.7 refresh"   # config corpus = wiki
# edit kb.config.json → "docs", reconnect /mcp
/kb-factory-verify both-docs all --label="after 6.7 refresh"   # config corpus = docs
/kb-factory-verify vanilla all --label="after 6.7 refresh"     # baseline, no corpus, no switch needed
/kb-factory-verify compare                                     # newest run per option → five-way report
```

`both-*` runs the fs and mcp options of the served corpus (one wave of ≤10 cases per message per option);
single options (`mcp-wiki dev-01`, `fs-docs func`) and `--model=sonnet|opus|haiku` (pins the discover agents)
are available. What keeps the numbers trustworthy: agents receive only query and category; every agent is a
fresh sub-agent; each option's agent physically has only its own tools, and every source not under test is
blocked by the fence rather than penalised afterwards — there is no scope-violation metric, and no dimension
deducts for one; model memory is allowed but labelled `[from memory]` and never counts as grounding;
per-dimension points are stored so totals are checkable; tool counts, byte volumes and latencies are read
from each sub-agent's transcript, never from its own report and never estimated; the run records corpus
fingerprints (manifest hashes, clone commits), the rubric version, and hashes of cases, rubric and brief,
and `compare` warns when merged runs differ.

Each report carries **access cost** beside the quality score, never folded into it: requests to reach the
answer, corpus text pulled into context, dead-end searches, per-call round-trip latency. `compare` prints
`deltas.bestKbMinusVanilla` — at or below zero, the KB is not earning its maintenance.

Every run prints `Case status: N confirmed · N draft · N contradictory` and records it in `scores.json`. Read
a score against that line: a suite that is mostly `draft` is measured against documentation, not reality.

Acceptance for a release: `both-wiki all` status **KB ready for skills** or **Usable with caveats** with no
`fail`, findability not below the previous run, `bestKbMinusVanilla` above zero, and the `gap-*` list
unchanged or shrinking. A `gap-*` case
that passes is a confirmed documentation hole to feed back into ingestion prompts or upstream docs. The
"Recommended fixes" section of the report only ever names index lines, keywords, hubs or synonyms — the
server has no ranking to tune.

## 4. Creating and confirming cases

A case lives in two files, both under `.claude/skills/kb-factory-verify/`:

| File | Holds | Read by |
| --- | --- | --- |
| `reference/cases.md` | Test inputs — one table row per case: id, category, status, area, version, query, target path. ~175 lines, no answers | The verify orchestrator and the auditor |
| `reference/expected/<case-id>.md` | The expected answer between `<!-- expected:start -->` and `<!-- expected:end -->` (header, query, numbered facts, trap, official URL), then the evidence behind it | The scorers — snippet only, with a narrow escalation rule for the evidence |

Neither orchestrator opens `expected/`. That is what keeps the discover brief blind; a line-number rule in a
file that also contains the answers is not a guarantee.

### 4.1 Status

| Status | What it is | How far to trust it |
| --- | --- | --- |
| `draft` | Answer derived from the official documentation. Never checked against the Shopware source | **Do not trust it as correctness.** A pass means the answer matched the docs. It does not mean the answer is right |
| `confirmed` | Re-derived from source. Facts carry `[code: <path>:<line>]` tags; the evidence is in the same file | **Trust it.** This is the yardstick. A failure here is a real failure |
| `contradictory` | Signals stayed mixed after a deep code pass. Previous facts kept, unverified | **Do not trust it, and do not cite it.** A human decides before it counts for anything |

Why this exists: the wiki is ingested from the official docs, so a case whose expected answer comes from those
same docs measures reproduction, not correctness. Case dev-01 pinned `getDefinitionClass()` as the way an
entity extension names its entity and explicitly accepted an answer mentioning only that. In
`shopware/core` 6.7.13.0 the method does not exist and `getEntityName()` is abstract — code written from our
"correct" answer does not compile. It scored 100% pass.

### 4.2 Confirming a case

`kb-factory-review-cases` re-derives an expected answer from source.

```
/kb-factory-review-cases dev-01       # one case
/kb-factory-review-cases dev          # a category
```

Truth hierarchy — the skill's one rule:

| Rank | Source | Authority |
| --- | --- | --- |
| 1 | Code — `vendor/shopware/{core,storefront,administration}`; `shopware/shopware` on GitHub for 6.6 pins and for tests the dist package strips. Active functional/integration tests show real usage | **Decides.** When code and any other source disagree, code wins. If code says a method does not exist, it does not exist |
| 2 | User feedback — issues and PRs in `shopware/shopware` and `shopware/docs`, Stack Overflow, forum | **Decides nothing.** A signal never becomes a fact. Its only power is to force a deeper code pass on the point raised |
| 3 | Documentation — the official clones and the live sites | **Decides nothing.** A claim becomes a fact only when code confirms it. Unconfirmed intent or business context is admitted tagged `[docs-only]`; unconfirmed behaviour is dropped |

Our wiki and the MCP server are forbidden to every lane — they are the system under test, and deriving truth
from them restores the circularity being removed.

Three lanes run blind and in parallel, isolated by tool grant: `kb-factory-case-evidence-code` (no web, no MCP),
`kb-factory-case-evidence-community` (no filesystem), `kb-factory-case-evidence-docs` (no `vendor/`). Each gets only query, category, area and
version — never the current expected answer. `kb-factory-case-evidence-reconciler` has Read and Write only and sees nothing
but the three lane reports and the case's current expected file, so it cannot add a fourth opinion.

Round 1 → reconcile. Lanes agree, or code settles them → `confirmed`. Mixed signals or open community
escalations → round 2: `kb-factory-case-evidence-code` in deep mode answers the named questions only, then reconcile again →
`confirmed` or `contradictory`. There is no third round.

A doc/code disagreement is the normal finding, not a contradiction: code wins and the divergence is recorded.
`contradictory` is reserved for cases where the code itself did not come out clear.

The skill rewrites `expected/<case-id>.md` and flips the status in `cases.md`. It does not fix the wiki, the
KB or the MCP — it fixes the test case. Tolerance clauses ("an answer with only X is still accepted") are
deleted on confirmation; they are how the suite came to reward wrong answers.

## 5. Distribution

The wiki and the server are the same files in every consuming project, so preparing a release is a
commit of `wiki/`, `dist/server.js`, `kb.config.json` (corpus `wiki`) and `ingest/platform/state/`.
Consumers need Node ≥ 20. Claude Code users must additionally enable the server in their own
`.claude/settings.json` (`enabledMcpjsonServers`) — a distributed configuration cannot grant
permission or enable settings on their behalf. Codex consumes the same stdio server through its own
MCP configuration; developers without MCP can read the wiki with the shell commands in
`wiki/README.md`, which is why fs and mcp are measured as equals.

Do not ship a corpus that has not passed §3; do not ship `kb.config.json` pointing at `docs`; do not add
network access, writes, a search index or a `corpus` tool parameter to the server — path addressing and the
1:1 shell parity are the contract every downstream agent prompt relies on.

For the npm release itself — one-time npm setup, tagging, publishing, the MCP Registry follow-up and
post-publish verification — see [`releasing.md`](releasing.md).
