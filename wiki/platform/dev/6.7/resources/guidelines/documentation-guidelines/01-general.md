---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/resources/guidelines/documentation-guidelines/01-general.md
sourceHash: 0573926afbf3d7ee4befbf04ea24c8f3bc051f5f
sourceUrl: https://developer.shopware.com/docs/resources/guidelines/documentation-guidelines/01-general.html
title: General
version: "6.7"
versions:
  - "6.7"
keywords: ["documentation guidelines", "style guide", "audience", "word list", "shopware terminology", "markdown rules", "vitepress", ".rumdl.toml", "third-party sources", "contributing docs", "editorial standards", "tech writing"]
summary: "Shopware docs style guide intro: audiences, covered doc sets, word lists, third-party sources, Markdown and Vitepress rules."
lastBuilt: 2026-10-21
---
## What it is

The opening page of the Shopware documentation guidelines (style guide). It sets the editorial standard every contributor to Shopware documentation should follow so that the docs stay uniform in style, wording, and tone, and points to the later sections (conceptual structure, language and grammar, fonts and formats).

## When to use

When contributing to or reviewing Shopware documentation and you need to know who the readers are, which documentation sets the style guide applies to, where approved terminology lives, and which Markdown conventions govern the files.

## Key steps / config

### Know the audience

Adapt the writing to the background of the reader. The guide lists these audiences and their typical topics:

| Audience | Typical roles/topics |
|---|---|
| Fullstack developer | Plugin development, templates, routes and controllers |
| Frontend developer | Admin, themes, PWA |
| Backend developer | DI and service architecture, message queues, DAL, action event system, Elasticsearch |
| API developer | Consuming the API, product or category import, extending the API, API paradigm, API references, request collection |
| DevOps | Hosting setup, deployment, performance tests |
| Project or solution architect | Hosting, architecture, modules and extension system, paradigms and patterns, commonalities of app and plugin system |
| Designer | Component library, design system |
| Product owner or manager | Product life-cycle responsibilities |
| Tech writers | Documenting all product details |

### Documents covered by the style guide

- Developer docs (`https://developer.shopware.com/docs/`)
- API Reference Guide (Stoplight)
- Composable Frontends docs
- Component library

### Word list

Pick ecommerce and technical terms from the predefined Shopware terminology list and the list of general terms and abbreviations. Both are internal Confluence resources visible only to Shopware employees.

### Third-party sources

Reference external sources (websites, books, blogs, videos, images) only when they are trustworthy. Do not copy content directly from websites, encyclopedias, or Wikipedia.

### Markdown rules

- Follow the Markdown Guide cheat sheet for basic syntax.
- Use Vitepress Markdown syntax for hint blocks, emoji, API blocks and similar features.
- Where Markdown allows alternatives (for example `*` or `-` for bullets), use one pattern consistently.
- Content-quality rules such as trailing-space removal and code fence style are defined in the docs repository lint config: `https://github.com/shopware/docs/blob/main/.rumdl.toml`.

## Gotchas

- The terminology lists are not publicly accessible; external contributors cannot open them.
- Lint rules live in the docs repository (`.rumdl.toml`), not in the Shopware platform code.

## Code check (6.7.15.1)
- unverified `.rumdl.toml` — Markdown lint config of the shopware/docs repository, outside the vendor/shopware code roots
- unverified `Vitepress` — documentation site tooling, not part of the installed Shopware code
- unverified `documentation guidelines` — editorial page with no platform identifiers or normative code claims to check
