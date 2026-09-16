---
id: platform/dev/6.7/resources/references/adr/2021-11-05-adjust-adr-approval-rules.md
title: Adjust ADR approval rules for the new org structure
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2021-11-05-adjust-adr-approval-rules.html
sourceHash: 8b8c4d538b4f3c5eae969f3fa9110758ffec1ebf
codeCheckedAgainst: "6.7.13.0"
keywords: ["adr", "architecture decision record", "approval rules", "adr review", "component teams", "core team", "admin team", "storefront team", "reorg", "governance"]
summary: "ADR 2021-11-05: an ADR now needs review by at least one member of each Component Team for Core, Admin and Storefront."
lastBuilt: 2026-09-15
---
## What it is

An architecture decision record (ADR, dated 2021-11-05, area `core`) mirrored from the Shopware 6 repository. It replaces the original ADR approval rules, which had become outdated after an internal reorganisation, with a single new rule tied to the component teams.

## When to use

When proposing or reviewing an ADR for the Shopware platform repository and you need to know who must sign off before the ADR counts as approved. It is a process decision; it does not change any code or configuration.

## Key steps / config

New approval rule (in force for all ADRs):

- At least one member of **each** of the Component Teams for the **Core**, **Admin** and **Storefront** areas has to review the ADR.

Old rules, kept in the ADR for reference only (no longer valid):

- Two additional developers review the ADR — one from the core development team, one from a team other than the creator's.
- One product owner or higher role approves the ADR.

## Gotchas

- The old "product owner or higher" approval and the "developer from another team" requirement no longer apply; reviews from the three component areas replace them.
- The rule applies to ADRs themselves, not to ordinary pull requests.

## Code check (6.7.13.0)
- unverified `ADR approval rules` — organisational process rule with no representation in vendor/shopware code, nothing to verify
