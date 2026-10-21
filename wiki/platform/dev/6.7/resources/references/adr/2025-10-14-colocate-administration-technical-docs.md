---
id: platform/dev/6.7/resources/references/adr/2025-10-14-colocate-administration-technical-docs.md
title: Co-locate Administration Technical Documentation with Source Code
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2025-10-14-colocate-administration-technical-docs.html
sourceHash: ae1e822bdf1f84c06d77bae573443fc950031800
codeCheckedAgainst: "6.7.15.1"
keywords: ["AGENTS.md", "technical-docs", "administration documentation", "co-located docs", "ai assistants", "agents", "developer experience", "adr", "administration source tree", "docs in repository", "04-data-layer", "02-architecture"]
summary: "ADR: Administration technical docs live in-repo under src/Administration/Resources/app/administration/technical-docs/, referenced from AGENTS.md files."
lastBuilt: 2026-10-21
---
## What it is

An architecture decision record (2025-10-14) that moves the comprehensive technical documentation of the Administration component out of the separate documentation repository and into the Shopware source tree, so that the `AGENTS.md` files spread through the Administration source can reference it by relative path.

## When to use

- You work on Administration code (or point an AI assistant at it) and need the detailed architecture guides behind the short `AGENTS.md` notes.
- You change Administration behaviour and need to know where the matching technical documentation must be updated.

## Key steps / config

- `AGENTS.md` files live throughout `src/Administration/Resources/app/administration/src/**`. They are concise guides for AI assistants and developers: architectural guidance, critical rules, key patterns.
- Detailed documentation lives at `src/Administration/Resources/app/administration/technical-docs/`, organised in numbered sections (`01-overview`, `02-architecture`, ...).
- An `AGENTS.md` file references the detailed docs with a relative-path blockquote instead of duplicating them, e.g.:

```markdown
> **Detailed Docs**: `technical-docs/04-data-layer/` for Repository/Entity patterns
> **Full Docs**: `technical-docs/02-architecture/03-module-system.md`
```

- Documentation updates are committed together with the related code change in the same pull request, keeping docs and code version-aligned (single source of truth).
- AI assistants get code and comprehensive documentation in one workspace.

Problems this solves (from the ADR's context): cross-repository references need absolute URLs that may break; without references `AGENTS.md` would duplicate explanations; AI assistants often cannot reach an external docs repository; keeping docs in sync across repositories is error-prone.

## Essential identifiers

- `AGENTS.md`
- `src/Administration/Resources/app/administration/technical-docs/`
- `technical-docs/02-architecture/`, `technical-docs/04-data-layer/`

## Gotchas

- Experimental pattern, initially applied only to the Administration component; it may later be adopted for Core, Storefront and other parts, depending on an evaluation of real-world usage.
- Trade-off: the Administration technical docs are separated from the central documentation repository.
- The `technical-docs/` directory sits next to the Administration `src/` directory, not inside it.

## Code check (6.7.15.1)
- confirmed `AGENTS.md` — present in `src/core`, `src/app`, `src/module` of the Administration — vendor/shopware/administration/Resources/app/administration/src/core/AGENTS.md:3
- confirmed `technical-docs/04-data-layer/` — referenced as "Detailed Docs" from core `AGENTS.md` — vendor/shopware/administration/Resources/app/administration/src/core/AGENTS.md:3
- confirmed `technical-docs/02-architecture/` — referenced as "Full Docs" from app `AGENTS.md` — vendor/shopware/administration/Resources/app/administration/src/app/AGENTS.md:3
- confirmed `technical-docs/02-architecture/03-module-system.md` — referenced from module `AGENTS.md` — vendor/shopware/administration/Resources/app/administration/src/module/AGENTS.md:3
- unverified `src/Administration/Resources/app/administration/technical-docs/` — directory lies outside the checked `administration/src` root
