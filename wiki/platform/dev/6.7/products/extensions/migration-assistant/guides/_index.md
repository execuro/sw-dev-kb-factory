---
id: platform/dev/6.7/products/extensions/migration-assistant/guides/_index.md
title: Guides
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/migration-assistant/guides/
sourceHash: db1d4a13d78ad70af9bc22e55d2793b247c4b68b
codeCheckedAgainst: "6.7.15.1"
keywords: ["migration assistant guides", "SwagMigrationAssistant", "migration converter", "migration profile", "migration connector", "migrate shop", "shop migration", "data migration"]
summary: Index of Migration Assistant guides - migrating from other environments using a converter, a migration profile or a migration connector.
lastBuilt: 2026-10-21
---
## What it is

Entry page for the Shopware Migration Assistant guides. The section explains how to migrate from different source environments by using a Migration Assistant converter, a migration profile, or a migration connector.

## When to use

When you need a practical walkthrough for migrating data from another environment into Shopware 6, rather than the conceptual description of profiles, connections, readers and writers.

## Code check (6.7.15.1)
- confirmed `SwagMigrationAssistant` — core admin first-run wizard references the plugin by name; the plugin itself is not part of core — vendor/shopware/administration/Resources/app/administration/src/module/sw-first-run-wizard/view/sw-first-run-wizard-data-import/index.js:26
