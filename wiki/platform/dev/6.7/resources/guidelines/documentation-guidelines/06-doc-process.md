---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/resources/guidelines/documentation-guidelines/06-doc-process.md
sourceHash: e19cd15169771e4286745cee7cd70542bd8ed944
sourceUrl: https://developer.shopware.com/docs/resources/guidelines/documentation-guidelines/06-doc-process.html
title: Doc Process
version: "6.7"
versions:
  - "6.7"
keywords: ["documentation process", "ideate", "write", "review", "publish", "maintain versions", "30/90 rule", "knowledge lead", "concept article", "version hint", "main branch", "v6.6", "contributing docs"]
summary: Shopware docs contribution workflow - ideate, write (30/90 rule), review, publish, and versioning via main and per-major branches.
lastBuilt: 2026-10-21
---
## What it is

The Shopware documentation process guideline: the common workflow for writing, reviewing, iterating, publishing and maintaining a documentation article. The full process, from cloning to publishing, is in the `shopware/docs` GitHub repository.

## When to use

When starting a new article or contributing to an existing one in the Shopware developer documentation, or when reviewing someone else's draft.

## Key steps / config

1. **Ideate** — act as the "knowledge lead" for the topic. Research, prepare a rough outline and ask other maintainers for feedback. The outline answers: who is the audience; which article you write; reader prerequisites; which questions it answers; which other topics are relevant.
2. **Write** — follow the "30/90" rule: create the first draft at 30% and get high-level feedback; at 90% schedule a steady, in-depth review. In the first draft:
   - prepare the document structure (flow of topics) and list the topics with descriptions;
   - briefly mention every point the article will cover; keep a common thread;
   - add placeholders for images and code blocks to fill later;
   - cross-reference other pages;
   - prefer non-Shopware-specific language, or link to a description of the term (e.g. "DAL").
3. **Concept articles** are structured as:
   - *Introduction* — introduce the concept by its purpose (e.g. for cart: what it is, what it can contain, how it relates to users and orders, what connected articles follow). Link related articles (e.g. configurable products, checkout) and avoid Shopware-specific terms such as "custom products".
   - *Comprehensive explanation* — details with examples, illustrations, tables, graphs or pseudo-code, but no Shopware-specific source code.
   - *Conclusions* — a connecting statement to the next article, if possible.
4. **Review** — after the first 30%, consult a reviewer for initial feedback and rearrange if needed. Reviewers check the general approach, tone and wording against the guidelines and give early direction; multiple reviewers help. Repeat until the final version is ready.
5. **Publish** — cross-check that the article meets the questions and objectives set at the start, incorporate review feedback, then it is published after notifying the administrators.
6. **Maintain versions** — content is organised by Shopware major version (6.3, 6.4, 6.5, ...). The current version is the repository's `main` branch; each older version has its own branch (e.g. `v6.6`). For functionality introduced within a major, add a version hint:

```markdown
::: info
This functionality is available starting with Shopware 6.4.3.0.
:::
```

## Gotchas

- Do not put Shopware-specific source code into concept articles: it adds a maintenance dependency, presumes knowledge of the language and context, and invites copy-paste without context.

## Code check (6.7.15.1)
- unverified `30/90` — documentation workflow rule, no Shopware code identifiers to check
- unverified `v6.6` — docs repository branch name, outside the Shopware code roots
