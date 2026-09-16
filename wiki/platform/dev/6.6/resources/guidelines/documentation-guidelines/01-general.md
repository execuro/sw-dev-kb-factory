---
id: platform/dev/6.6/resources/guidelines/documentation-guidelines/01-general.md
title: General
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: "https://developer.shopware.com/docs/v6.6/resources/guidelines/documentation-guidelines/01-general.html"
sourceHash: "d4cc64cd069777a7b0014e4b8b7ffd6813a0c949"
keywords: ["documentation guidelines", "style guide", "audience", "developer docs", "API Reference Guide", "Composable Frontends docs", "component library", "word list", "markdown cheat sheet", "Vitepress syntax", "markdown-style-config"]
summary: "Introduces Shopware's documentation style guide: target audiences, applicable docs, terminology sources, and markdown formatting rules."
lastBuilt: "2026-09-15"
---
## What it is
The introductory page of Shopware's documentation style guide, covering writing standards contributors should follow for uniform documentation.

## When to use
Before writing or editing Shopware documentation, to identify the intended audience and which style resources apply.

## Key steps / config
The guide lists audiences and their typical roles, e.g. Fullstack developer (plugin development, templates, routes/controllers), Frontend developer (Admin, Themes, PWA), Backend developer (DI/service architecture, message queues, DAL, action event system, Elasticsearch), API developer, DevOps, Project/Solution architect, Designer, Product owner/Manager, Tech writers.

Applicable style-guide-covered docs:
- [Developer docs](https://developer.shopware.com/docs/)
- [API Reference Guide](https://shopware.stoplight.io/)
- [Composable Frontends docs](https://frontends.shopware.com/)
- [Component library](https://component-library.shopware.com/)

Terminology should be chosen from the pre-defined "Shopware terminologies" and "General terms and abbreviations" word lists (internal, Shopware-employee only resources).

Markdown must follow the [Markdown cheat sheet](https://www.markdownguide.org/cheat-sheet/) and [Vitepress syntax](https://vitepress.dev/guide/markdown) for features like hint blocks, emoji, and API blocks; use a single, consistent bullet-list symbol throughout. User-defined content-quality rules (trailing spaces, code-fence style, etc.) live in the [Markdown style of Shopware docs](https://github.com/shopware/docs/blob/master/markdown-style-config.yml).

## Gotchas
Avoid copying content directly from third-party sources such as websites, books, or Wikipedia; only reference trustworthy external sources.
