---
id: platform/dev/6.7/resources/guidelines/code/core/adr.md
title: ADR
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/guidelines/code/core/adr.html
sourceHash: 56ace57c2c7beca1babb6ab84e760d82a796ef40
codeCheckedAgainst: "6.7.13.0"
keywords: ["adr", "architecture decision record", "architecture decision", "decision record", "coding guideline", "technical domains", "pseudo code", "public api", "extendability", "consequences"]
summary: Shopware core guideline for ADRs - required contents (domains, public APIs, extendability, reasons, consequences) and a suggested writing approach.
lastBuilt: 2026-09-15
---
## What it is

Core coding guideline describing what Shopware expects from an Architecture Decision Record (ADR) and one suggested way to write it. It recommends Joel Parker Henderson's published collection of ADR ideas, templates and examples on GitHub as a good reference.

## When to use

When proposing an architectural change to the Shopware core that needs an ADR, or when reviewing whether an ADR is complete.

## Key steps / config

**An ADR must**

- Fully describe the requirements.
- List all affected technical domains.
- List all affected logic in the system.
- Include pseudo code visualising the new logic.
- Define all public APIs that are created or changed.
- Define how developers can extend the new APIs and logic, and which business cases are expected.
- State the reason for the decision.
- State all consequences and how they impact developers who used the code/product.

**Suggested approach**

1. List the domains you touch (e.g. Store-API, admin process, indexing).
2. Add a headline per domain.
3. Under each headline, explain in two sentences why the domain is relevant.
4. Describe the "problems" per domain: which logic must be touched and why — not how. Example (indexing): the product indexing process must be extended because calculating the new product data is too expensive and should run in a background job.
5. Describe the "solution" per domain: how the logic will be extended to solve those problems.
6. Add a section on extendability: how developers can extend the system and which business cases you see.
7. Finish with pseudo code visualising the solutions.

## Code check (6.7.13.0)
- unverified `ADR` — process guideline with no code identifiers or normative code claims to check in vendor/shopware
