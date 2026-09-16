---
id: platform/dev/6.7/resources/references/adr/2020-06-25-implement-architecture-decision-records.md
title: Implement architecture decision records
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2020-06-25-implement-architecture-decision-records.html
sourceHash: e49ff06bf5dbe400293e99fd6dd139db1f47e6a7
codeCheckedAgainst: "6.7.13.0"
keywords: ["adr", "architecture decision record", "adr/_superseded", "ADR label", "merge request", "decision workflow", "architecture decisions", "adr template", "superseded adr", "adr approval"]
summary: "ADR 2020-06-25: Shopware records architecture decisions as markdown in the platform repo's adr directory, approved via merge requests; superseded ones move."
lastBuilt: 2026-09-15
---
## What it is

The 2020-06-25 architecture decision record that introduces ADRs for the Shopware platform: architecture and technical decisions are recorded as markdown files directly in the platform repository, integrated into the merge request workflow.

## When to use

When you make a significant decision affecting how developers write code in the Shopware platform, or need to know how ADRs are created, approved, and superseded.

## Key steps / config

- **Who:** every developer working with the Shopware platform can and must create ADRs.
- **When:** introducing new standards; large code changes with huge impact; smaller but frequently used changes that would otherwise cause duplicated effort.
- **How:** add a markdown file in the `adr` directory at the platform repository root via a merge request. The merge request is the approval process and must also contain the code changes that implement the decision. Add the "ADR" label to the merge request.
- **Approval (original rule):** two additional developers review (one from the core development team, one from a team other than the creator's), plus one product owner or higher approves.
- **Counter decisions:** not required, but when multiple solutions exist, outline all options.
- **Format:** filename contains the date and a meaningful title; content follows:

```
# [Date] - [Title]
## Context
## Decision
## Consequences
```

- **Status:** ADRs in the main `/adr` directory are accepted and represent the current state. When a new decision outdoes an old one, move the old ADR to `/adr/_superseded` and add a link to the new ADR.

## Essential identifiers

- `/adr`
- `/adr/_superseded`
- "ADR" merge request label

## Gotchas

- An accepted, merged ADR can no longer be changed; outdated decisions must be superseded by a new ADR.
- The approval part of this decision is superseded by the ADR "2021-11-05 - Adjust ADR approval rules for the new org structure"; the rest remains in force.

## Code check (6.7.13.0)
- unverified `/adr` — directory of the shopware/shopware repository root, not shipped in vendor/shopware packages
- unverified `/adr/_superseded` — repository directory, out of vendor/shopware scope
