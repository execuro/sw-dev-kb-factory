---
id: platform/dev/6.7/products/extensions/migration-assistant/guides/_index.md
title: Guides
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/migration-assistant/guides/
sourceHash: db1d4a13d78ad70af9bc22e55d2793b247c4b68b
codeCheckedAgainst: "6.7.13.0"
keywords: ["migration assistant", "SwagMigrationAssistant", "migration profile", "migration connector", "migration converter", "data migration", "shop migration", "migrate from other shop system", "migration guides"]
summary: "Section index for Migration Assistant guides: migrating data from other environments via converters, migration profiles or the migration connector."
lastBuilt: 2026-09-15
---
## What it is

Entry page of the Migration Assistant "Guides" section. The guides in it show how to migrate data from different environments into Shopware 6 by using a Migration Assistant converter, a migration profile, or the migration connector.

## When to use

Start here when a migration task needs custom code around the Migration Assistant: decorating an existing converter, adding or extending a migration profile, or extending the migration connector on the source side.

## Code check (6.7.13.0)
- confirmed `SwagMigrationAssistant` — core only references the plugin by name (first-run wizard data import); the plugin itself is not part of vendor/shopware — vendor/shopware/administration/Resources/app/administration/src/module/sw-first-run-wizard/view/sw-first-run-wizard-data-import/index.js:33
- unverified `SwagMigrationConnector` — separate plugin, not installed under vendor/shopware, out of scope
