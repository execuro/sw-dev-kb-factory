---
id: platform/dev/6.7/resources/references/adr/2020-06-25-implement-architecture-decision-records.md
title: Implement architecture decision records
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2020-06-25-implement-architecture-decision-records.html
sourceHash: e49ff06bf5dbe400293e99fd6dd139db1f47e6a7
codeCheckedAgainst: "6.7.15.1"
keywords: ["adr", "architecture decision record", "adr workflow", "adr template", "/adr", "/adr/_superseded", "merge request", "ADR label", "superseded adr", "adr approval", "design decisions"]
summary: ADR from 2020-06-25 - Shopware records architecture decisions as markdown in the repo's adr directory, reviewed via merge request; template and status rules.
lastBuilt: 2026-10-21
---
## What it is

The founding architecture decision record (2020-06-25, area core): Shopware documents architecture and technical decisions as ADRs — markdown files stored directly in the platform repository — and integrates their creation into the normal merge request workflow. Mirrored from the ADR section of the Shopware 6 repository.

## When to use

When you make (or want to understand) a significant decision that affects how developers write code in the Shopware platform: introducing new standards, large changes with a big impact on the software, or smaller changes that are used very often and would otherwise lead to duplicated effort. Every architecture decision affecting the platform or one of its components has to be recorded as an ADR.

## Key steps / config

1. Create a markdown file in the `adr` directory at the repository root. The filename contains the date and a meaningful title.
2. Use the fixed template:
   ```
   # [Date] - [Title]
   ## Context
   ## Decision
   ## Consequences
   ```
3. Open a merge request (external developers: a GitHub pull request) containing the ADR **and** all code changes needed to implement the decision. Add the "ADR" label.
4. The merge request is the approval process; discussion happens asynchronously in its comments.
5. If more than one solution was possible, outline all options (counter decisions are not mandatory otherwise).

Status is expressed by directory:

- `/adr` — accepted, current decision state.
- `/adr/_superseded` — outdated decisions; move the old ADR there and add a link to the new ADR.

## Essential identifiers

- `/adr` (accepted ADRs)
- `/adr/_superseded` (superseded ADRs)
- "ADR" merge request label
- Template headings: `Context`, `Decision`, `Consequences`

## Gotchas

- An accepted, merged ADR can no longer be changed; changing a decision means writing a new ADR that supersedes it and moving the old one to `/adr/_superseded`.
- The original approval rule (two additional reviewers — one from the core development team, one from a team other than the author's — plus one product owner or higher) is superseded by the ADR "2021-11-05 - Adjust ADR approval rules for the new org structure"; the rest of this ADR still applies.
- Who may write ADRs: every developer working with the Shopware platform.

## Code check (6.7.15.1)
- unverified `/adr` — repository-root ADR directory lies outside the checked code packages (core, storefront, administration)
- unverified `/adr/_superseded` — repository-level directory, outside the checked code packages
