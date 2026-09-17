# Contributing

## Toolchain

- Node >= 20, `git`. **No PHP or Composer** — the pinned Shopware source under `.sources/shopware/`
  is a sparse, tag-pinned git checkout, not a `composer install`.
- Claude Code, for the ingest and verify skills under `.claude/`. Those skills are Claude-Code-only
  by design; the published server itself serves any stdio MCP client.

## Getting set up

```sh
npm ci
npm run setup   # fetches .sources/ — see README.md "One-time setup" and docs/sources.md
```

Then, once per clone, run the `/kb-factory-setup` Claude Code skill. It installs the two hooks a
fresh clone needs before the verify suite or an ingest writer run will work:

| Hook | Event | Why |
| --- | --- | --- |
| `kb-verify-scope-fence.sh` | `PreToolUse` (`Read\|Grep\|Glob\|Bash\|Write`) | Fences each verify discover agent and each ingest writer to its own read/write scope |
| `kb-verify-record-transcript.sh` | `SubagentStop` | Records each discover agent's transcript path for the benchmark's mechanical auditor |

`kb-factory-setup` writes into this repository's own `.claude/settings.json`, shows a diff and asks
before writing, merges rather than replaces, and is safe to re-run after an update.

## Before you send a change

All of these must pass:

```sh
npm run build              # typecheck + esbuild bundle
npm test                   # build, then the full node:test suite
npm run wiki:lint          # blocking schema/link/id/size checks over wiki/platform/
npm run pack -- --dry-run  # what the published tarball would contain
```

`npm run typecheck` and `npm run typecheck:ingest` typecheck `src/` and `ingest/` independently of
the build. If you changed `src/`, commit the rebuilt `dist/server.js` together with the source —
`test/bundle.test.ts` and the purity checks only cover what is actually built.

## CI, and why a skipped test fails it

`.github/workflows/ci.yml` runs on every push and pull request, on Node 20 and 22, in two jobs:

- **`verify`** — typecheck, `npm test`, `wiki:lint`, `pack --dry-run` in an ordinary checkout.
- **`standalone`** — the same suite in a reproduced *fresh clone*: checked out under a directory
  name nothing can resolve against by habit, with `node_modules/`, `dist/`, `.sources/` and every
  cache deleted first, so anything that only works because a maintainer's machine is warm breaks
  here rather than in a contributor's first clone.

`standalone` reads the TAP output and **treats any skipped or todo test as a failure**, alongside
the reported fail/cancelled counts and the runner's exit code. The reason is concrete: two
guideline contract tests skipped themselves on every run of this package's entire life, because
their inputs lived under the gitignored `.sources/`, and nobody noticed — a skip is green. So a
test that cannot run from a fresh clone (committed fixtures only, no `.sources/`, no `vendor/`, no
warm cache) must be made to run or deleted. Do not leave it conditional.

The cold-start timing test is the one measurement that does not gate: shared CI runners are
systematically slower than a developer machine, so on CI it prints its result and raises a warning
annotation instead of failing.

## `wiki/` is generated

Everything under `wiki/platform/` is written by the ingest pipeline (`kb-factory-ingest-platform-docs`
skill, documented in `docs/producer-manual.md`) and must never be hand-edited, **with two exceptions**:

- `wiki/platform/index.md`, which `wiki:build` does not touch or regenerate.
- **Expert sections** in `wiki/platform/guidelines/<version>/*.md`: a `##` section whose first line
  under the heading is `> [expert]` is hand-written by a domain expert. The guidelines phase never
  rewrites it — `--prepare` tells the writer which anchors are expert-owned (and the byte budget left
  for its own output), `--ingest` splices the sections back into the new file verbatim, and the
  server serves them tagged `[platform expert]`. Rules for writing one: the tag is the first line
  under a rule `##` (never `## Index` or `## Code check`), the section comes before `## Code check`,
  it needs no `Read more:` line, links follow the usual `platform/…`/allowlisted-https rule, and its
  bytes count toward the file and pair caps like any other section. Give it the same anchor as a
  generated section to replace that section for good. After editing, run `wiki:build` (manifest
  hashes) and `wiki:lint`; an expert edit never triggers a re-synthesis.

If a page is wrong, fix its source input or the writer prompt and re-run ingest — don't patch the
generated file.

## Where things live

- `src/` — MCP server source. `ingest/` — the ingest CLI. Server and ingest tests both live under
  `test/`. Keep `src/server` from importing `src/ingest` (enforced by `tsconfig.json`'s `exclude`
  and `test/bundle.test.ts`).
- Skills and pinned writer/verify agents: `.claude/skills/kb-factory-*`, `.claude/agents/`.
- Full build and verify detail: [`docs/producer-manual.md`](docs/producer-manual.md). External
  inputs: [`docs/sources.md`](docs/sources.md). Publishing:
  [`docs/releasing.md`](docs/releasing.md).
