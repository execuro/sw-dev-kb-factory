---
id: platform/dev/6.7/products/extensions/migration-assistant/_index.md
title: Migration Assistant
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/migration-assistant/
sourceHash: 98485f5575192b357be975510a6dbe1d6e0fa1a6
codeCheckedAgainst: "6.7.13.0"
keywords: ["migration assistant", "SwagMigrationAssistant", "data migration", "shop migration", "shopware 5 to shopware 6", "connection", "data source", "import products customers", "update migrated data"]
summary: Migration Assistant connects a data source (e.g. a Shopware 5 shop) to Shopware 6 to migrate or later update products, customers and other data.
lastBuilt: 2026-09-15
---
## What it is

The Migration Assistant is the extension that connects an existing shop system (a data source such as Shopware 5) with Shopware 6, so data like products and customers can be migrated or updated.

## When to use

When moving data from another shop system into Shopware 6, or re-migrating/updating individual datasets after a first complete migration.

## Key steps / config

- Establish a connection between the data source and Shopware 6; once established it can be reused at any time.
- Run a first complete migration; afterwards individual datasets can be migrated or updated as needed.

## Code check (6.7.13.0)
- confirmed `SwagMigrationAssistant` — first-run wizard data-import step offers the plugin by this name — vendor/shopware/administration/Resources/app/administration/src/module/sw-first-run-wizard/view/sw-first-run-wizard-data-import/index.js:33
- confirmed `SwagMigrationAssistant` — listed among plugins in the core translation config — vendor/shopware/core/System/Resources/translation.yaml:10
- unverified `connection` — migration connection handling lives in the SwagMigrationAssistant plugin, not installed; out of scope
