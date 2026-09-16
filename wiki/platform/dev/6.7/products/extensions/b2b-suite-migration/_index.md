---
id: platform/dev/6.7/products/extensions/b2b-suite-migration/_index.md
title: B2B Suite Migration
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-suite-migration/
sourceHash: 10fc08da6bc8fac264e092a3a5054cdf0d183e35
codeCheckedAgainst: "6.7.13.0"
keywords: ["b2b suite migration", "b2b suite", "b2b components", "b2b commercial", "SwagB2bPlatform", "SwagCommercial", "data migration", "legacy b2b", "shopware 6.8", "migration extension"]
summary: B2B Suite Migration extension moves data from the legacy B2B Suite to B2B Components (Commercial); B2B Suite is unsupported from Shopware 6.8.
lastBuilt: 2026-09-15
---
## What it is

Entry page for the *B2B Suite Migration* extension, which migrates data from the legacy B2B Suite to the modular B2B Components (B2B Commercial). The section covers the migration concept, execution and how to extend the migration.

## When to use

When a shop still runs the B2B Suite and must move its B2B data (employees, budgets, quotes, shopping lists, etc.) to B2B Components before upgrading.

## Key steps / config

1. Check the migration prerequisites (the section's "Execution > Prerequisites" page).
2. Read the concept pages, then run the migration as described in the execution pages.

## Gotchas

- B2B Suite will no longer be supported starting with Shopware 6.8 — plan the migration before upgrading.

## Version notes

- 6.7: last major where B2B Suite is supported; 6.8 drops support.

## Code check (6.7.13.0)
- confirmed `SwagB2bPlatform` — plugin name listed in core translation plugin list — vendor/shopware/core/System/Resources/translation.yaml:6
- confirmed `SwagCommercial` — commercial plugin (B2B Components host) listed in same list — vendor/shopware/core/System/Resources/translation.yaml:8
- unverified `B2B Suite Migration` — extension code is not installed under vendor/shopware
- unverified `6.8` — support end for B2B Suite is a product policy statement, not expressed in core code
