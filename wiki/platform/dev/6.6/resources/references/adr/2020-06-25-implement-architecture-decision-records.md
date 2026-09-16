---
id: platform/dev/6.6/resources/references/adr/2020-06-25-implement-architecture-decision-records.md
title: Implement architecture decision records
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/resources/references/adr/2020-06-25-implement-architecture-decision-records.html
sourceHash: e49ff06bf5dbe400293e99fd6dd139db1f47e6a7
keywords: ["adr", "architecture decision record", "adr directory", "merge request workflow", "superseded", "core guidelines", "decision workflow", "approval process", "documentation process"]
summary: "Documents Shopware's ADR process: markdown files in /adr, approved via merge request, superseded ADRs moved to /adr/_superseded."
lastBuilt: 2026-09-15
---
## What it is

This architecture decision record (ADR), mirrored from the Shopware 6 repository, documents the decision to record architecture and technical decisions for the Shopware platform as markdown ADR files directly in the platform repository, integrated into the existing merge-request workflow.

## When to use

Consult when deciding whether a significant technical decision needs to be recorded as an ADR — for example introducing new standards, large code changes with a big impact on the software, or smaller but frequently-used changes that would otherwise lead to duplicated effort.

## Key steps / config

- ADRs are markdown files located in the `adr` directory at the repository root; new ADRs are created via merge requests, which also serve as the approval process. The "ADR" label should be added to the merge request so it is identifiable.
- Approval requires two additional developer reviewers (one must be a member of the core development team, one must be a member of a different team than the ADR's creator), plus one product owner or higher role.
- ADR content must follow this template:
  ```
  # [Date] - [Title]
  ## Context
  ## Decision
  ## Consequences
  ```
- Status is symbolized by directory location: ADRs in the main `/adr` directory are "accepted" and represent the current decision state of the software. When a new decision outdoes an older one, the old ADR is moved to the `/adr/_superseded` directory and a link to the new ADR is added.

## Essential identifiers

`/adr` directory, `/adr/_superseded` directory, "ADR" merge request label

## Gotchas

Once an ADR is accepted and merged, it can no longer be changed directly — an outdated or changed decision must be recorded as a new ADR that supersedes it, and the old ADR moved to `/adr/_superseded`.
