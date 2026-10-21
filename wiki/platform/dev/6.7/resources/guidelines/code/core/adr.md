---
id: platform/dev/6.7/resources/guidelines/code/core/adr.md
title: ADR
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/guidelines/code/core/adr.html
sourceHash: 56ace57c2c7beca1babb6ab84e760d82a796ef40
codeCheckedAgainst: "6.7.15.1"
keywords: ["adr", "architecture decision record", "architectural decision", "core guideline", "design document", "public api", "extendability", "pseudo code", "domains", "consequences", "decision rationale", "coding guidelines"]
summary: Shopware core guideline on what an ADR must contain (requirements, domains, public APIs, extendability, rationale, consequences) and a way to write one.
lastBuilt: 2026-10-21
---
## What it is

A Shopware core coding guideline, mirrored from the `coding-guidelines/core/adr.md` file in the Shopware 6 repository, that states what Shopware expects from an Architecture Decision Record (ADR) and suggests one way to write it. It points to Joel Parker Henderson's collection of ADR ideas, templates and examples (`github.com/joelparkerhenderson/architecture-decision-record`) as a good reference.

## When to use

When you propose an architectural change to the Shopware core and need to write the ADR for it, or when you review an ADR and want to check it is complete.

## Key steps / config

An ADR is expected to:

- give a complete description of the requirements;
- list all technical domains affected by the ADR;
- list all affected logic in the system;
- include some pseudo code for the new logic, to visualize what you want to build;
- define all public APIs that will be created or changed by the new logic;
- define how developers can extend the new APIs and logic, and which business cases you see for that;
- give the reason for the decision, so later readers understand why the architectural change was made;
- define all consequences of the decision and how they affect developers who used the code or product.

One suggested way to meet these expectations:

1. Make a list of the domains you will touch (for example Store-API, admin process, indexing).
2. Give each domain its own headline.
3. Under each headline, explain in two sentences why that domain is relevant to the ADR.
4. Describe the "problems" in each domain: which logic has to be touched and why, not how you will change it. Example for indexing: the product indexing process has to be extended because calculating the new product data is too expensive, so the values should be calculated in a background job.
5. Describe the "solution" for each domain: how you will extend that logic to solve the problems.
6. Add a section on extendability: how developers should be able to extend your system, and which business cases you see.
7. Finish with pseudocode that visualizes the solutions and ideas.

## Gotchas

- The guideline says everyone approaches ADRs differently. The step list is one possible approach, but the expectations list is what every ADR has to meet.
- Keep "problems" (why the logic must change) separate from "solutions" (how it changes). Write the problems first.

## Code check (6.7.15.1)
- unverified `ADR` — process and documentation guideline with no class, service or config identifiers to check in vendor/shopware
- unverified `coding-guidelines/core/adr.md` — repository documentation file, not part of the installed core, storefront or administration packages
