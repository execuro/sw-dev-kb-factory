---
id: platform/dev/6.7/products/extensions/b2b-suite-migration/_index.md
title: B2B Suite Migration
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-suite-migration/
sourceHash: 10fc08da6bc8fac264e092a3a5054cdf0d183e35
codeCheckedAgainst: "6.7.15.1"
keywords: ["b2b suite migration", "b2b suite", "b2b components", "b2b commercial", "data migration", "legacy b2b", "shopware 6.8", "end of support", "migration extension", "upgrade b2b"]
summary: Overview of the B2B Suite Migration extension, which moves data from the legacy B2B Suite to B2B Components; B2B Suite is unsupported from Shopware 6.8.
lastBuilt: 2026-10-21
---
## What it is

Entry page for the B2B Suite Migration extension: a tool that migrates data from the legacy B2B Suite to the modular B2B Components (B2B Commercial). The section covers the migration concept, execution, and how to extend the migration.

## When to use

When a shop still runs B2B Suite and must move its B2B data (employees, budgets, quotes, shopping lists and related entities) to B2B Components before upgrading Shopware.

## Key steps / config

1. Check the B2B Suite Migration prerequisites (the "Execution > Prerequisites" page of this section).
2. Read the concept pages (migration approach, migration tables) before running the migration.
3. Execute the migration, then extend it if custom data needs to be carried over.

## Gotchas

- B2B Suite is no longer supported starting with Shopware 6.8 — plan the migration before that upgrade.

## Version notes

- 6.8: B2B Suite support ends; B2B Components is the successor.

## Code check (6.7.15.1)
- unverified `B2B Suite Migration` — shipped as a separate Commercial extension, not part of the core/storefront/administration roots
- unverified `B2B Suite` — separate legacy extension, out of scope of the checked roots
- confirmed `b2b_components_shopping_list` — B2B Components entity known to core usage-data allow-list — vendor/shopware/core/System/UsageData/usage-data-allow-list.json:2092
