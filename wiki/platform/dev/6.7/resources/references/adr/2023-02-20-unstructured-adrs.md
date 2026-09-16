---
id: platform/dev/6.7/resources/references/adr/2023-02-20-unstructured-adrs.md
title: Unstructured ADRs
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2023-02-20-unstructured-adrs.html
sourceHash: 5f3c1892ece817bdcebf6f54611943ce827257c0
codeCheckedAgainst: "6.7.13.0"
keywords: ["adr", "architecture decision record", "front matter", "yaml front matter", "file structure", "flat directory", "title", "date", "area", "tags", "workflow"]
summary: "ADR: Shopware ADR files live in one flat directory with YAML front matter (title, date, area, tags) instead of per-area subfolders."
lastBuilt: 2026-09-15
---
## What it is

An architecture decision record changing how Shopware's own ADRs are stored: the per-area folder structure is removed and every ADR carries front matter metadata, as changelog files already do.

## When to use

When adding a new ADR to the Shopware repository, or when searching ADRs by title, recency or area.

## Key steps / config

1. Place the ADR file in the flat ADR directory — no area subfolder.
2. Start the file with front matter:

```markdown
---
title: Unstructured ADRs
date: 2023-02-23
area: ...
tags: [ADR, file structure, workflow]
---
```

Rationale given in the ADR: area folders only help when browsing by area. Searching by headline returns duplicate matches, and finding the latest ADRs required git history (shell or IDE). Front matter plus a flat structure covers all three search cases, allows metadata extraction, prepares publishing ADRs in other front-ends (handbook, dev docs) with their search, and removes confusion about which folder a new ADR belongs in.

## Essential identifiers

- Front matter keys: `title`, `date`, `area`, `tags`

## Gotchas

- The ADR's own example puts an inline YAML comment after the `area` value; the mirrored ADR in the docs uses `area: core` in its actual front matter, so area values are not consistent across examples.

## Code check (6.7.13.0)
- unverified `title`/`date`/`area`/`tags` — ADR front matter is a repository documentation convention; no ADR directory ships in vendor/shopware/core
