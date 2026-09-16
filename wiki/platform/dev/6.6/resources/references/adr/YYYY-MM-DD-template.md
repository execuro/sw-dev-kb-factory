---
id: platform/dev/6.6/resources/references/adr/YYYY-MM-DD-template.md
title: "{{ title }}"
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/resources/references/adr/YYYY-MM-DD-template.html
sourceHash: 1fbd2069793db83663796abb12889f83abe3f543
keywords: ["adr template", "architecture decision record", "Context section", "Decision section", "Consequences section", "title placeholder", "date placeholder", "area placeholder", "tags placeholder", "YYYY-MM-DD-template"]
summary: "The blank ADR template with placeholder frontmatter and Context/Decision/Consequences headings for starting new architecture decision records."
lastBuilt: 2026-09-15
---
## What it is

This page is the blank architecture decision record (ADR) template used to start new ADRs in the Shopware repository. It has placeholder frontmatter and the three standard ADR section headings, with no filled-in content.

## When to use

When drafting a new ADR: copy this template, replace the `{{ title }}`, `{{ date }}`, `{{ area }}`, and `{{ tags }}` placeholders, and fill in the `## Context`, `## Decision`, and `## Consequences` sections.

## Key steps / config

Frontmatter placeholder shape:

```
---
title: {{ title }}
date: {{ date }}
area: {{ area }}
tags: [{{ tags }}]
---
```

Followed by the empty headings `## Context`, `## Decision`, `## Consequences`.

## Essential identifiers

- `YYYY-MM-DD-template.md`
- `## Context`
- `## Decision`
- `## Consequences`
