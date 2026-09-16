---
id: "platform/dev/6.6/resources/guidelines/code/core/adr.md"
title: "ADR"
docType: "developer"
version: "6.6"
versions: ["6.6"]
sourceUrl: "https://developer.shopware.com/docs/v6.6/resources/guidelines/code/core/adr.html"
sourceHash: "56ace57c2c7beca1babb6ab84e760d82a796ef40"
keywords: ["ADR", "architecture decision record", "architecture decisions", "pseudo code", "public API design", "domains", "extendability documentation", "decision record template"]
summary: "What Shopware expects from an Architecture Decision Record: affected domains, public APIs, extendability, consequences, and pseudo code."
lastBuilt: "2026-09-15"
---
## What it is

Guideline describing what Shopware expects from an Architecture Decision Record (ADR) and how to write one, referencing Joel Parker Henderson's published ADR templates and examples.

## When to use

Write an ADR when proposing an architectural change that affects one or more domains of the system, before implementing it.

## Key steps / config

Expectations for an ADR:
- Write a complete description of the requirements.
- List all technical domains affected by the ADR.
- List all affected logic in the system.
- Write pseudo code for the new logic to visualize the intent.
- Define all public APIs to be created or changed.
- Define how developers can extend the new APIs/logic and what business cases apply.
- State the reason for the decision, to help future readers understand why it was made.
- Define all consequences of the decision and their impact on developers using the code/product.

One workable approach: list the domains to touch (e.g. Store-API, admin process, indexing) with a headline each; in two sentences explain why each domain is relevant; describe the "problem" per domain (what logic must be touched and why, not how); describe the "solution" per domain (how the logic will be extended); add a section on extendability and the business cases it enables; finish with pseudo code visualizing the solution.

## Essential identifiers

- Architecture Decision Record (ADR)
