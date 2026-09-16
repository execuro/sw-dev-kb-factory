# sw-dev-knowledge-base-mcp

A read-only, offline [MCP](https://modelcontextprotocol.io) server that lets a coding agent
`ls`/`grep`/`cat` a curated Shopware developer and merchant knowledge base without leaving its
session — plus the factory that builds that knowledge base.

The corpus ships inside the package, so the server needs no network at runtime, no API key and no
index: it is a filesystem view over plain Markdown.

## Install

```sh
npx -y @execuro-sw-ecosystem/sw-dev-knowledge-base-mcp@<version>
```

Node >= 20. The published package declares **no dependencies** — its two third-party libraries,
[`@modelcontextprotocol/sdk`](https://github.com/modelcontextprotocol/typescript-sdk) and
[`zod`](https://zod.dev), are inlined into `dist/server.js`, and every other import is a `node:`
builtin. Their licences are in
[`THIRD-PARTY-NOTICES.md`](THIRD-PARTY-NOTICES.md).

## Configure it as an MCP server

Register it as a stdio server. In an `.mcp.json`-style client configuration:

```json
{
  "mcpServers": {
    "ShopwareDevKnowledgeBase": {
      "command": "npx",
      "args": ["-y", "@execuro-sw-ecosystem/sw-dev-knowledge-base-mcp@<version>"]
    }
  }
}
```

Pin an exact version: the corpus is part of the package, so the version is the content.

Options, all optional:

| Flag | Environment variable | Effect |
| --- | --- | --- |
| `--wiki-root <dir>` | `WIKI_ROOT` | Serve an arbitrary wiki root instead of the packaged `wiki/` |
| `--corpus <name>` | `KB_CORPUS` | Select a corpus defined in `kb.config.json` (the package ships only `wiki`) |
| `--project-wiki <dir>` | `KB_PROJECT_WIKI` | Add your own project wiki as a `project` layer; `off` disables it |

## The tools it exposes

| Tool | Shell equivalent | What it returns |
| --- | --- | --- |
| `list_docs` | `ls` (with `depth`, `glob`) | Directory entries, titles from frontmatter, the directory's `index.md` |
| `grep_docs` | `grep -rin` over `*.md` | Match lines with context, or `files`/`count` modes |
| `read_doc` | `cat` / `sed -n` | A page or line range, its frontmatter and a citable `path:from-to` |
| `kb_status` | `cat <layer>/manifest.json` | Which layers and corpus are served, with provenance and counts |

Line numbers are identical to the shell's, so a `grep_docs` hit pages straight into `read_doc`.
There is no ranking and no search engine: discovery quality comes from the corpus's own `index.md`
lines, keywords, hubs and synonyms file. The server writes nothing and opens no network
connection.

## What is in the corpus

`wiki/platform/` — a retrieval-oriented rewrite of Shopware's official documentation: developer
docs for 6.6 and 6.7, merchant/functional docs, topic hub pages, curated per-version guideline
files and a synonyms index. It is path-addressed: version and doc type are directories
(`platform/dev/6.7/…`, `platform/func/…`), never parameters. `wiki/README.md` describes the layout
and how to navigate it with a plain shell.

The published tarball is 2.7 MB (10.0 MB unpacked, 2006 files); its top level is exactly
`LICENSE README.md THIRD-PARTY-NOTICES.md dist kb.config.json package.json wiki`.

## Working on this repository

End users never clone this repository — it is the *factory* that produces the package above:

| Path | What it is |
| --- | --- |
| `src/` | MCP server source (builds `dist/server.js`) |
| `ingest/` | The deterministic ingest CLI: sync, pages, hubs, guidelines, build, synonyms, lint |
| `wiki/` | The generated documentation corpus — never hand-edited, except `wiki/platform/index.md` |
| `test/` | Server and ingest test suite (`node --test`): 465 tests, zero skips |
| `scripts/` | `setup-sources.mjs`, `setup-docs.mjs`, `pack.mjs` |
| `docs/` | Maintainer guides — see [Documentation](#documentation) |
| `.claude/` | `kb-factory-*` skills, pinned writer/verify agents, and the two `kb-verify-*` hooks |
| `.sources/` | Gitignored, created by `npm run setup` — pinned Shopware source and docs clones |

```sh
npm ci
npm run setup     # fetches .sources/ — see "One-time setup" below
npm run build     # typecheck + bundle src/ -> dist/server.js
npm test          # build, then the full test suite
npm run wiki:lint # blocking schema/link/id/size checks over wiki/platform/
```

Run `/kb-factory-setup` (a Claude Code skill, see [CONTRIBUTING.md](CONTRIBUTING.md)) once per clone
before running the verify suite or an ingest writer — it installs the two hooks that keep each
agent inside its own corpus, without which neither is trustworthy.

### One-time setup — what `npm run setup` actually does

`npm run setup` fetches **two things you did not ask for by name** into a gitignored `.sources/`:

- **~250 MB** of pinned Shopware source (`.sources/shopware/<version>/`, a sparse tag-pinned git
  checkout — not a `composer install`, no PHP needed) that the code check and code-evidence lanes
  read.
- **~1 GB** of official documentation clones (`.sources/docs/{developer,merchant}/`) that the
  `docs` test corpus serves.

It is idempotent, resumable and an offline no-op once satisfied. **The `merchant` documentation
mirror is a private repository.** On a host without access, setup prints what is unavailable and
continues — that is deliberate: a missing optional input degrades the run rather than failing it,
and the committed `wiki/platform/func/` layer stays usable either way. Full detail:
[`docs/sources.md`](docs/sources.md).

## Documentation

- [`docs/producer-manual.md`](docs/producer-manual.md) — building, code-checking, verifying and
  shipping the corpus; the full skill-driven ingest workflow.
- [`docs/sources.md`](docs/sources.md) — what `.sources/` holds and how `npm run setup` builds it.
- [`docs/releasing.md`](docs/releasing.md) — npm setup, tagging, publishing and post-publish
  verification.
- [`CONTRIBUTING.md`](CONTRIBUTING.md) — toolchain, test/lint gates, CI's zero-skips rule.
- [`CHANGELOG.md`](CHANGELOG.md) — [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) format.
- [`THIRD-PARTY-NOTICES.md`](THIRD-PARTY-NOTICES.md) — licences of the code inlined into
  `dist/server.js`.

## Licence

[MIT](LICENSE), Execuro UG (haftungsbeschränkt). See [THIRD-PARTY-NOTICES.md](THIRD-PARTY-NOTICES.md)
for the licences of the third-party code inlined into `dist/server.js`.
