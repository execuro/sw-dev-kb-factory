---
id: platform/dev/6.6/resources/guidelines/documentation-guidelines/06-doc-process.md
title: Doc Process
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/resources/guidelines/documentation-guidelines/06-doc-process.html
sourceHash: dd0b6b979aace73b27e936efe11f105de4605303
keywords: ["documentation process", "30/90 rule", "ideate", "write", "review", "publish", "maintain versions", "knowledge lead", "master branch", "concept article guidelines", "cross-references", "contributor workflow"]
summary: "Shopware's documentation writing process: ideate, write using the 30/90 rule, review, publish, and version upkeep."
lastBuilt: "2026-09-15"
---
## What it is
Describes the Shopware documentation writing process: ideation, drafting, review, publishing, and version maintenance for contributors.

## When to use
When planning, writing, reviewing, or publishing a new or updated documentation article.

## Key steps / config
- Ideate: act as "knowledge lead" for the topic; outline the audience, article scope, prerequisites, questions answered, and related topics before writing, and prompt other maintainers for feedback.
- Write: follow the "30/90" rule — get high-level feedback at 30% done, do an in-depth review at 90% done. In the first draft: define the document structure, list topics, add placeholders for images/code, work with cross-references, and prefer non-Shopware-specific language (or link to a definition, e.g. "DAL").
  - Concept articles: introduce the concept (its purpose, what it contains, how it relates to users/orders), avoid Shopware-specific jargon like "custom products," give a comprehensive explanation without Shopware-specific source code, and end with a connective statement to the next article.
- Review: consult a reviewer after the first 30% for feedback on tone, wording, and general approach; this can repeat until the final version is ready.
- Publish: verify the article answers all outlined questions/objectives, incorporate feedback, then notify administrators to publish.
- Maintain versions: content is organized by Shopware major version (6.3, 6.4, 6.5, etc.); the current version lives on the `master` branch, older versions on separate branches. Flag version-specific features with a note, e.g. "This functionality is available starting with Shopware 6.4.3.0."

## Essential identifiers
- "30/90" drafting rule
- `master` branch (current documentation version)
