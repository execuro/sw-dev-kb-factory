---
id: platform/dev/6.6/resources/references/adr/2021-11-05-adjust-adr-approval-rules.md
title: Adjust ADR approval rules for the new org structure
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/resources/references/adr/2021-11-05-adjust-adr-approval-rules.html
sourceHash: 8b8c4d538b4f3c5eae969f3fa9110758ffec1ebf
keywords: ["ADR approval rules", "Component Teams", "core team", "admin team", "storefront team", "architecture decision record", "org structure", "review process", "product owner approval"]
summary: ADR replacing the old ADR review/approval process with one requiring review from each of the Core, Admin and Storefront Component Teams.
lastBuilt: 2026-09-15
---
## What it is
Architecture decision record updating who must review and approve an ADR, after the original approval rules became outdated following a company reorganization.

## When to use
Relevant when determining who needs to review and approve a new architecture decision record.

## Key steps / config
Old approval rules (now replaced):
- Two additional developers had to review the ADR, one from the core development team, one from a team other than the creator's.
- One product owner or higher role had to approve the ADR.

New approval rule:
- At least one member of each of the Component Teams for the Core, Admin and Storefront area has to review the ADR.

## Essential identifiers
- Component Teams: Core, Admin, Storefront

## Gotchas
None stated beyond the rule change itself; all future ADRs must be approved under the new rule.
