---
id: platform/dev/6.7/resources/references/adr/2023-02-20-unstructured-adrs.md
title: Unstructured ADRs
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2023-02-20-unstructured-adrs.html
sourceHash: 5f3c1892ece817bdcebf6f54611943ce827257c0
codeCheckedAgainst: "6.7.15.1"
keywords: ["adr", "architecture decision record", "front matter", "frontmatter", "flat file structure", "adr folder", "area", "tags", "title", "date", "workflow", "file-structure"]
summary: "ADR (2023): Shopware ADRs drop area subfolders for a flat directory and carry YAML front matter (title, date, area, tags) like changelog files."
lastBuilt: 2026-10-21
---
## What it is

An architecture decision record (dated 2023-02-23, area `core`, tags `adr`, `file-structure`, `workflow`) that removes the per-area folder structure of Shopware's ADR directory and instead puts metadata into YAML front matter at the top of each ADR file, the same way Shopware changelog files already do. It is mirrored from the `adr/` folder of the Shopware 6 repository (`adr/2023-02-20-unstructured-adrs.md`).

## When to use

Read it when writing or submitting a new ADR to the Shopware repository, or when parsing ADR files (for example to list them by date or area).

## Key steps / config

The ADR lists the ways people search for ADRs: (1) they know the headline, (2) they want the latest ADRs, (3) they want the ADRs of a specific area. Area folders only helped case 3; for case 1 a directory search returned duplicate matches and could get long, and for case 2 the reader had to go through git history via shell or IDE.

Decision:

- Remove the area structure at directory level — all ADRs sit in one flat directory.
- Add front matter to every ADR so metadata can be extracted from content. This is also groundwork for publishing ADRs in other front-ends (handbook, developer docs) and using their search.

Front matter shape given for this ADR itself:

```markdown
---
title: Unstructured ADRs
date: 2023-02-23
area: Product Operation #I added prod-ops because this is a workflow topic
tags: [ADR, file structure, workflow]
---
```

Keys: `title`, `date`, `area`, `tags`. With front matter plus the flat structure, all three search cases are covered.

## Essential identifiers

- Front matter keys `title`, `date`, `area`, `tags`
- ADR file naming `YYYY-MM-DD-<slug>.md` as seen in the mirrored path

## Gotchas

- The example `area` value in the ADR text (`Product Operation`) differs from the value in the mirrored file's own front matter (`core`) — the example is illustrative.
- The ADR also aims to reduce confusion about which folder a new ADR belongs in: there is no folder choice any more.

## Code check (6.7.15.1)
- unverified `title` — ADR front matter lives in the repository `adr/` folder, outside the checked package roots
- unverified `area` — ADR metadata key, not part of the shipped core/storefront/administration code
- unverified `tags` — ADR metadata key, not part of the shipped core/storefront/administration code
