---
id: platform/dev/6.7/products/extensions/migration-assistant/_index.md
title: Migration Assistant
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/migration-assistant/
sourceHash: 98485f5575192b357be975510a6dbe1d6e0fa1a6
codeCheckedAgainst: "6.7.15.1"
keywords: ["SwagMigrationAssistant", "migration assistant", "shop migration", "data migration", "shopware 5 to shopware 6", "connection", "data source", "import products customers", "delta migration", "update migrated data"]
summary: Migration Assistant overview - connects a source shop (e.g. Shopware 5) to Shopware 6 to migrate or later update products, customers and other data.
lastBuilt: 2026-10-21
---
## What it is

The Migration Assistant (plugin `SwagMigrationAssistant`) is the Shopware extension that connects an existing shop system acting as a data source (for example Shopware 5) with Shopware 6, so that data such as products and customers can be migrated into Shopware 6 or updated there later. This page is the entry point of the Migration Assistant section.

## When to use

- You move data from an existing shop to Shopware 6.
- You already ran a migration and need to migrate or update individual datasets again.

## Key steps / config

1. Establish a connection between the data source (the existing shop) and Shopware 6 using the Migration Assistant.
2. Once established, the connection stays available and can be accessed at any time.
3. Run a first complete migration.
4. Afterwards, migrate or update individual datasets as needed over the same connection.

## Code check (6.7.15.1)
- confirmed `SwagMigrationAssistant` — plugin name the first-run wizard data-import step offers to install — vendor/shopware/administration/Resources/app/administration/src/module/sw-first-run-wizard/view/sw-first-run-wizard-data-import/index.js:31
- confirmed `SwagMigrationAssistant` — listed as a plugin in core translation config — vendor/shopware/core/System/Resources/translation.yaml:13
- unverified `connection` — migration connections are implemented in the separate SwagMigrationAssistant plugin, not in core/storefront/administration
