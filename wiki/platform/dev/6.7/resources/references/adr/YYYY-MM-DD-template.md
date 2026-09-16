---
id: platform/dev/6.7/resources/references/adr/YYYY-MM-DD-template.md
title: "{{ title }}"
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/YYYY-MM-DD-template.html
sourceHash: 1fbd2069793db83663796abb12889f83abe3f543
codeCheckedAgainst: "6.7.13.0"
keywords: ["adr template", "architecture decision record", "YYYY-MM-DD-template.md", "adr frontmatter", "context", "decision", "consequences", "area", "tags", "new adr"]
summary: "Blank Shopware ADR template: frontmatter title, date, area, tags plus the sections Context, Decision and Consequences."
lastBuilt: 2026-09-15
---
## What it is

The empty template for Shopware architecture decision records (ADRs), mirrored from the ADR section of the Shopware 6 repository as `adr/YYYY-MM-DD-template.md`. It carries only placeholders, no decision content.

## When to use

Drafting a new ADR, or checking which frontmatter fields and sections an existing ADR is expected to have.

## Key steps / config

File name pattern: `YYYY-MM-DD-<slug>.md`. Frontmatter skeleton:

```yaml
title: {{ title }}
date: {{ date }}
area: {{ area }}
tags: [{{ tags }}]
```

Body: a level-1 heading repeating the title, followed by three level-2 sections in this order: Context, Decision, Consequences.

## Essential identifiers

- Frontmatter keys: `title`, `date`, `area`, `tags`
- Sections: Context, Decision, Consequences

## Code check (6.7.13.0)
- unverified `YYYY-MM-DD-template.md` — ADR template lives in the Shopware repository `adr/` directory, not in the installed vendor packages
