# Changelog

All notable changes to this project are documented in this file. The format is based on
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added

- **Expert sections in guideline files.** A `##` section of `wiki/platform/guidelines/<version>/*.md`
  whose first line under the heading is `> [expert]` is hand-written by a domain expert and survives
  regeneration: `wiki:guidelines --prepare` lists its anchors and bytes in the work item (`expert`,
  `sizeBudget`), `--ingest` splices the sections back into the writer's output before the gates and
  rejects a writer output that writes an expert-owned anchor or carries the tag, `wiki:lint` checks the
  tag's placement, and the `guidelines/` view serves the section tagged `[platform expert]` with the
  raw tag line stripped. Contract in `CONTRIBUTING.md` ("`wiki/` is generated").

## [0.1.5] - 2026-09-16

### Fixed

- The tracked bundle `dist/server.js` was rebuilt after v0.1.4 was tagged, so the tag's tree and
  the repository disagreed on the bundle. This release ships the rebuilt bundle. No runtime
  change from 0.1.4.

## [0.1.4] - 2026-09-16

### Fixed

- Release automation only: `npm publish` returns before registry.npmjs.org serves the new
  version, so the MCP Registry submission that follows it lost that race and failed a release
  whose npm publish had actually succeeded. The workflow now waits, bounded to 10 minutes, for
  npm to serve the version before submitting to the registry. No runtime change from 0.1.3.

## [0.1.3] - 2026-09-16

### Fixed

- Release automation only: re-running a release whose npm publish had already succeeded failed
  on npm's refusal to republish an existing version, so the MCP Registry submission that follows
  it never ran. The publish step now treats an already-published version as success and
  continues. No runtime change from 0.1.2.

## [0.1.2] - 2026-09-16

### Fixed

- Release automation only: the workflow could not publish. `actions/setup-node`'s `registry-url`
  wrote an `.npmrc` expecting an `NPM_TOKEN` that OIDC trusted publishing deliberately does not
  use, so npm attempted token auth instead of the OIDC exchange. The pack step's JSON result was
  also captured together with npm's own banner, making it unparseable.
- `server.json`'s description exceeded the registry's 100-character limit, which rejected the
  registry submission with a 422.

No runtime change from 0.1.1; 0.1.1 was never published.

## [0.1.1] - 2026-09-16

### Fixed

- The server did not start when launched through its `bin`. npm installs `bin` as a symlink
  (`node_modules/.bin/sw-dev-knowledge-base-mcp` -> `dist/server.js`), and the entry-point check
  tested `process.argv[1]` for a `server.js` suffix, which the symlink name does not have. The
  process exited 0 without printing anything, so `npx @execuro-sw-ecosystem/sw-dev-knowledge-base-mcp`
  and every MCP client launch produced a server that never answered. The check now compares real
  paths. **0.1.0 is unusable through its `bin`; use 0.1.1 or later.**

### Added

- A regression test that launches the built bundle through a symlink and asserts the `initialize`
  handshake, and a test that keeps the server's reported version in step with `package.json`.

## [0.1.0] - 2026-09-16

First published release.

### Added

- `dist/server.js` — a read-only, offline stdio MCP server (`@modelcontextprotocol/sdk`, `zod`;
  esbuild bundle, self-contained, every import a `node:` builtin) exposing four tools: `list_docs`,
  `grep_docs`, `read_doc`, `kb_status`.
- `wiki/platform/` — the committed documentation corpus: developer docs for Shopware 6.6 and 6.7,
  merchant/functional docs, topic hub pages and a synonyms index.
- The ingest pipeline (`ingest/`, driven by the `kb-factory-ingest-platform-docs` skill and its
  pinned writer sub-agents): sync, pages, hubs, guidelines, build, synonyms and lint phases, plus a
  code check that grounds developer pages in the pinned Shopware source under `.sources/shopware/`.
- The verification suite (`test/`, `node --test`) covering the server, the bundle's purity and
  self-containment, the wiki's structural conformance, and the ingest pipeline; and the
  `kb-factory-verify` skill's scored benchmark over the built wiki.
- `npm run setup` (`scripts/setup-sources.mjs`, `scripts/setup-docs.mjs`) — reproducible,
  idempotent `.sources/` environment from a fresh clone: pinned Shopware source checkouts and
  official documentation clones.
