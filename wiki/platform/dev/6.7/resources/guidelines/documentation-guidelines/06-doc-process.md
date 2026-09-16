---
id: platform/dev/6.7/resources/guidelines/documentation-guidelines/06-doc-process.md
title: Doc Process
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/guidelines/documentation-guidelines/06-doc-process.html
sourceHash: dd0b6b979aace73b27e936efe11f105de4605303
codeCheckedAgainst: "6.7.13.0"
keywords: ["documentation process", "doc process", "ideate", "30/90 rule", "review", "publish", "maintain versions", "concept articles", "contribution", "shopware/docs", "master branch", "version hint"]
summary: "Shopware docs contribution workflow: ideate an outline, write with the 30/90 review rule, review, publish, and maintain per-major-version branches."
lastBuilt: 2026-09-15
---
## What it is

The documentation guideline describing the process for contributing an article to the Shopware developer documentation: ideate, write, review, publish, and maintain versions. The full repository workflow (cloning to publishing) lives in the `shopware/docs` GitHub repository.

## When to use

When you plan to write a new documentation article or contribute to an existing one and need the expected workflow, review cadence, and structure rules for concept articles.

## Key steps / config

1. **Ideate** — act as the "knowledge lead" for the topic. Prepare a rough outline and ask other maintainers for feedback on:
   - Who is the audience?
   - What article are you going to write?
   - What are the prerequisites for readers?
   - Which questions will it answer?
   - Which other topics are relevant?
2. **Write** — follow the "30/90" rule: create a first draft at 30% and get high-level feedback; at 90% schedule a steady, in-depth review. A first draft should:
   - lay out the document structure (flow of topics) and briefly list all points;
   - keep a common thread;
   - add placeholders for images or code blocks;
   - use cross-references;
   - prefer non-Shopware-specific language, or link to a description of Shopware terms (e.g. "DAL").
3. **Concept articles** are structured as:
   - **Introduction** — the concept's purpose (e.g. for cart: what it is, what it contains, how it relates to users and orders, what connected articles follow). Link to related articles rather than using Shopware-specific terms like "custom products" unexplained.
   - **Comprehensive explanation** — examples, illustrations, tables, graphs or pseudo-code; no Shopware-specific source code.
   - **Conclusions** — a connective statement to the next article, if possible.
4. **Review** — consult a reviewer after the first 30%; the reviewer checks approach, tone and wording against the guidelines. Multiple reviewers are useful; iterate until final.
5. **Publish** — cross-check that the article meets the objectives set at the start, incorporate review feedback; it is published after administrators are notified.
6. **Maintain versions** — content is organised by Shopware major version (6.3, 6.4, 6.5, …). The current version is the repository's `master` branch; each older version has its own branch.

For features introduced within a major version, add a version-constraint hint:

```
::: info
This functionality is available starting with Shopware 6.4.3.0.
:::
```

## Gotchas

- Do not put Shopware source code into conceptual articles: it adds a maintenance dependency, presumes language/context knowledge, and invites copy-paste without context.

## Code check (6.7.13.0)
- unverified `master` — branch of the shopware/docs repository, not part of the installed vendor packages
- unverified `::: info` — VitePress docs container syntax, out of vendor/shopware scope
