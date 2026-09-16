---
id: platform/dev/6.6/resources/references/adr/2023-02-20-unstructured-adrs.md
title: Unstructured ADRs
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: "https://developer.shopware.com/docs/v6.6/resources/references/adr/2023-02-20-unstructured-adrs.html"
sourceHash: "5f3c1892ece817bdcebf6f54611943ce827257c0"
keywords: ["ADR", "architecture decision record", "front matter", "flat file structure", "changelog front matter", "area tag", "tags field", "date field", "handbook", "dev-docs", "adr search"]
summary: "ADR replacing folder-per-area ADR structure with a flat file layout plus YAML front matter (title, date, area, tags)."
lastBuilt: "2026-09-15"
---
## What it is
This ADR documents the decision to stop grouping architecture decision records (ADRs) into per-area folders and instead store them as a flat file structure with YAML front matter, matching the pattern already used in Shopware's changelog files.

## When to use
Relevant when authoring a new ADR, or when building tooling that needs to search, list, or filter existing ADRs (e.g. by area, by date, or to find the latest ones).

## Key steps / config
The ADR identifies three common search intents that the old folder-per-area structure only partially served: finding an ADR by known headline, reading the latest ADRs, and finding ADRs for a specific area. Folder grouping helped only the third case; the first produced noisy directory search results, and the second required checking git history via shell or IDE.

The decision removes the area-based directory structure and introduces front matter on every ADR file instead, so metadata (title, date, area, tags) can be extracted programmatically — including by future front-ends such as a handbook or dev-docs site with their own search. Example front matter shown in the source:

```markdown
---
title: Unstructured ADRs
date: 2023-02-23
area: Product Operation
tags: [ADR, file structure, workflow]
---
```

## Essential identifiers
- ADR front matter fields: `title`, `date`, `area`, `tags`

## Gotchas
Moving to a flat structure also removes the folder-driven guidance for where to place a new ADR file, which the ADR expects to make submitting new ADRs less confusing rather than more, since placement is now handled purely by front matter metadata instead of directory choice.
