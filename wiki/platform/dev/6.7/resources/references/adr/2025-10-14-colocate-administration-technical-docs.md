---
id: platform/dev/6.7/resources/references/adr/2025-10-14-colocate-administration-technical-docs.md
title: Co-locate Administration Technical Documentation with Source Code
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2025-10-14-colocate-administration-technical-docs.html
sourceHash: ae1e822bdf1f84c06d77bae573443fc950031800
codeCheckedAgainst: "6.7.13.0"
keywords: ["AGENTS.md", "technical-docs", "administration documentation", "co-locate docs", "ai assistants", "agents", "developer experience", "admin source tree", "04-data-layer", "02-architecture", "adr"]
summary: "ADR: Administration technical docs live in the source tree at technical-docs/, referenced from concise AGENTS.md files via relative paths; experimental."
lastBuilt: 2026-09-15
---
## What it is

Architecture decision record (2025-10-14): the Administration's comprehensive technical documentation is co-located with its code at `src/Administration/Resources/app/administration/technical-docs/` instead of a separate documentation repository. `AGENTS.md` files across `src/Administration/Resources/app/administration/src/**` stay short (architectural guidance, critical rules, key patterns) and point to the detailed docs by relative path.

## When to use

- Working on Administration core code (by hand or with an AI assistant) and looking for in-repo architecture docs.
- Writing or updating an `AGENTS.md` in the Administration source tree.

## Key steps / config

- Reference detailed docs from `AGENTS.md` with a relative-path quote line, e.g.:

```markdown
> **Detailed Docs**: `technical-docs/04-data-layer/` for Repository/Entity patterns
```

- `technical-docs/` is organized in numbered sections (`01-overview`, `02-architecture`, ...), so `AGENTS.md` files link instead of duplicating explanations.
- Commit documentation changes together with the related code change in the same pull request.

In the installed package, `AGENTS.md` exists in `src/app`, `src/core` and `src/module`, referencing e.g. `technical-docs/02-architecture/`, `technical-docs/02-architecture/03-module-system.md` and `technical-docs/04-data-layer/`.

## Essential identifiers

- `AGENTS.md`
- `technical-docs/`

## Gotchas

- Experimental and limited to the Administration; Core/Storefront may adopt it later depending on evaluation.
- Trade-off: this documentation is separate from the central developer documentation repository.

## Code check (6.7.13.0)
- confirmed `technical-docs/04-data-layer/` — referenced from core AGENTS.md as Detailed Docs — vendor/shopware/administration/Resources/app/administration/src/core/AGENTS.md:3
- confirmed `technical-docs/02-architecture/` — referenced from app AGENTS.md — vendor/shopware/administration/Resources/app/administration/src/app/AGENTS.md:3
- confirmed `technical-docs/02-architecture/03-module-system.md` — referenced from module AGENTS.md — vendor/shopware/administration/Resources/app/administration/src/module/AGENTS.md:3
- unverified `technical-docs/` — directory sits beside src, outside the checked administration root
