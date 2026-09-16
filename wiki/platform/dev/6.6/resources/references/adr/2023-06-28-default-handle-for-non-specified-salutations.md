---
id: platform/dev/6.6/resources/references/adr/2023-06-28-default-handle-for-non-specified-salutations.md
title: Default handling for non specified salutations
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: "https://developer.shopware.com/docs/v6.6/resources/references/adr/2023-06-28-default-handle-for-non-specified-salutations.html"
sourceHash: "9b6fb92e960594210eab21fb695b4a921821c456"
keywords: ["salutation", "not_specified", "default salutation", "customer salutation", "inclusivity", "letters and documents", "email communications", "user interface salutation", "non-deletable salutation", "Dear Customer"]
summary: "ADR setting `not_specified` as the default, non-deletable salutation value used when a customer's salutation is null."
lastBuilt: "2026-09-15"
---
## What it is
This ADR documents changing Shopware's default salutation handling so that a `null` salutation (not specified by a customer or administrator) resolves to a default value of `not_specified` instead of being left unhandled.

## When to use
Relevant when rendering customer-facing salutations in letters, documents, emails, or admin/storefront user interfaces, or when working with salutation-related entities and needing to know the guaranteed fallback value.

## Key steps / config
- The `not_specified` salutation is the default value used whenever salutation data is missing, promoting inclusive and consistent customer communication.
- `not_specified`, being the default fallback, is not deletable by the shop owner, guaranteeing a fallback is always available; the value it displays is itself configurable by the shop owner.
- Context-specific default rendering differs by channel:
  - Letters and documents: rendered as "Dear Customer" (or an approved customizable alternative).
  - Email communications: rendered as "Hello" (or an approved customizable alternative).
  - User interfaces: rendered as `not_specified` for customers who have not specified a salutation.
- Implementation involved validation checks, database updates, and logic changes to apply the new default consistently, along with dedicated testing/QA to verify the rollout.

## Essential identifiers
- `not_specified` (default salutation value)

## Gotchas
The `not_specified` salutation cannot be deleted by the shop owner even though its displayed value can be customized — code or configuration that assumes salutations are freely deletable must account for this fixed fallback entry.
