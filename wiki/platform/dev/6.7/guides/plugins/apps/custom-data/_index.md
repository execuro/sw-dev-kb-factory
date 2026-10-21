---
id: platform/dev/6.7/guides/plugins/apps/custom-data/_index.md
title: Custom Data
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/apps/custom-data/
sourceHash: 34be3877c31141a1e06bdf725948560af2e1ab89
codeCheckedAgainst: "6.7.15.1"
keywords: ["custom data", "custom fields", "custom entities", "app data storage", "entities.xml", "custom-fields.xml", "app extension data", "custom field set", "own entity"]
summary: Overview of storing app data in Shopware - custom fields on core tables for simple values, or custom entities with own associations and lifecycle.
lastBuilt: 2026-10-21
---
## What it is

Section overview for storing app-owned data in Shopware. Two mechanisms exist:

- **Custom fields** — store simple data types (strings, numbers, booleans, arrays, objects) directly on existing core tables.
- **Custom entities** — define completely new entities with their own associations and lifecycle.

## When to use

Pick custom fields when you only need to attach extra values to existing records; pick custom entities when you need a separate data structure with its own relations. In the installed code, apps declare custom entities in an `entities.xml` file and custom field sets in `Resources/config/custom-fields.xml` (preferred over the inline manifest definition).

## Code check (6.7.15.1)
- confirmed `CustomEntityXmlSchema::FILENAME` — custom entities are read from `entities.xml` — vendor/shopware/core/System/CustomEntity/Xml/CustomEntityXmlSchema.php:15
- confirmed `custom-fields.xml` — app lifecycle prefers `Resources/config/custom-fields.xml` over inline manifest custom fields — vendor/shopware/core/Framework/App/Lifecycle/Handler/CustomFieldLifecycleHandler.php:38
