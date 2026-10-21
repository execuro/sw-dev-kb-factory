---
id: platform/dev/6.7/resources/references/adr/2021-11-05-adjust-adr-approval-rules.md
title: Adjust ADR approval rules for the new org structure
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2021-11-05-adjust-adr-approval-rules.html
sourceHash: 8b8c4d538b4f3c5eae969f3fa9110758ffec1ebf
codeCheckedAgainst: "6.7.15.1"
keywords: ["adr", "architecture decision record", "approval rules", "adr review", "component teams", "core team", "admin team", "storefront team", "governance", "reorg"]
summary: "ADR (2021-11-05): after the reorg, each ADR needs review by at least one member of the Core, Admin and Storefront component teams."
lastBuilt: 2026-10-21
---
## What it is

Architecture decision record that replaces the original approval rules for Shopware ADRs. When ADRs were introduced, special approval rules were defined for them; after an organisational restructuring those rules no longer fit, so they were adapted to keep the decisions documented in ADRs workable in the long run.

## When to use

Relevant when proposing or reviewing an ADR in the Shopware repository and you need to know who must approve it, or why older ADRs mention a different approval process.

## Key steps / config

Old rules (kept for reference):

- Two additional developers review the ADR:
  - one must be a member of the core development team;
  - one must be a member of a team other than the creator's team.
- One product owner or higher role approves the ADR.

New rule:

- At least one member of each of the Component Teams for the **Core**, **Admin** and **Storefront** areas has to review the ADR.

Consequence: all ADRs from then on must be approved according to the new rule.

## Code check (6.7.15.1)
- unverified `approval rules` — organisational process, not represented in vendor/shopware code
