---
id: platform/dev/6.7/resources/references/adr/YYYY-MM-DD-template.md
title: "{{ title }}"
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/YYYY-MM-DD-template.html
sourceHash: 1fbd2069793db83663796abb12889f83abe3f543
codeCheckedAgainst: "6.7.15.1"
keywords: ["adr", "architecture decision record", "adr template", "YYYY-MM-DD-template.md", "context", "decision", "consequences", "adr frontmatter", "area", "tags"]
summary: Blank template for Shopware architecture decision records (ADRs) - frontmatter fields title/date/area/tags and Context, Decision, Consequences sections.
lastBuilt: 2026-10-21
---
## What it is

The empty skeleton every Shopware architecture decision record (ADR) starts from. It is mirrored from the `adr/` directory of the Shopware 6 repository (original file `adr/YYYY-MM-DD-template.md`); the page itself carries no decision, only placeholders.

## When to use

When writing a new ADR for the Shopware core, or when reading an existing ADR and needing to know which parts are fixed by the template.

## Key steps / config

1. Name the file after the date and topic, following the `YYYY-MM-DD-template.md` pattern.
2. Fill the frontmatter placeholders:

```yaml
---
title: {{ title }}
date: {{ date }}
area: {{ area }}
tags: [{{ tags }}]
---
```

3. Use the title as the top-level heading, then write three sections in this order: `## Context`, `## Decision`, `## Consequences`.

## Essential identifiers

- Frontmatter keys: `title`, `date`, `area`, `tags`
- Section headings: `Context`, `Decision`, `Consequences`
- Source file: `adr/YYYY-MM-DD-template.md` in `github.com/shopware/shopware`

## Code check (6.7.15.1)
- unverified `adr/YYYY-MM-DD-template.md` — ADR files live in the repository root `adr/` directory, outside the vendor/shopware package roots
- unverified `area` — ADR frontmatter convention, not read by any installed Shopware code
