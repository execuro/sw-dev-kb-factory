---
id: platform/dev/6.7/resources/guidelines/documentation-guidelines/01-general.md
title: General
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/guidelines/documentation-guidelines/01-general.html
sourceHash: 0573926afbf3d7ee4befbf04ea24c8f3bc051f5f
codeCheckedAgainst: "6.7.13.0"
keywords: ["documentation guidelines", "style guide", "audience", "word list", "terminology", "markdown rules", "vitepress", ".rumdl.toml", "third-party sources", "contributing docs"]
summary: "Shopware documentation style guide: audiences and roles, docs covered by the guide, word lists, third-party source rules, Markdown and Vitepress rules."
lastBuilt: 2026-09-15
---
## What it is

The entry page of the Shopware documentation guidelines: the editorial standards contributors follow to keep the docs uniform, covering audience, scope, terminology, sources and Markdown usage.

## When to use

When contributing to or writing Shopware documentation and you need the audience definitions, the list of covered doc sets, or the Markdown conventions.

## Key steps / config

Audiences and the topics they care about:

| Audience | Topics |
|---|---|
| Fullstack developer | plugin development, templates, routes/controllers |
| Frontend developer | Admin, themes, PWA |
| Backend developer | DI/service architecture, message queues, DAL, action event system, ElasticSearch |
| API developer | consuming/extending the API, product/category import, API paradigm and references, request collection |
| DevOps | hosting setup, deployment, performance tests |
| Project/solution architect | hosting, architecture, extension system, paradigms/patterns, app vs. plugin system commonalities |
| Designer | component library, design system |
| Product owner/manager | product life cycle responsibilities |
| Tech writers | documenting all product details |

Covered by the style guide: the Developer docs (`https://developer.shopware.com/docs/`), the API Reference Guide (Stoplight), the Composable Frontends docs, and the component library.

Rules:

- Choose ecommerce and technical terms from the Shopware terminology list and the general terms/abbreviations list (internal resources, visible to Shopware employees only).
- Reference third-party sources (websites, books, blogs, videos, images) only if trustworthy; never copy content directly from websites, encyclopedias or Wikipedia.
- Follow the Markdown Guide cheat sheet; use Vitepress syntax for hint blocks, emoji, API blocks.
- Pick one pattern for multi-purpose Markdown symbols (e.g. `*` or `-` for bullets) and use it throughout.
- Content-quality rules (trailing spaces, code fence style, ...) are defined in the Markdown style file of the Shopware docs repository: `https://github.com/shopware/docs/blob/main/.rumdl.toml`.

## Gotchas

- The word lists are internal Shopware resources; external contributors cannot open them.

## Code check (6.7.13.0)
- unverified `.rumdl.toml` — Markdown lint config of the shopware/docs repository, outside the installed vendor code
- unverified `Vitepress` — documentation toolchain, not part of vendor/shopware code
