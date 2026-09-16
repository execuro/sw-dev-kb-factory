---
id: platform/dev/6.7/guides/plugins/apps/custom-data/_index.md
title: Custom Data
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/apps/custom-data/
sourceHash: 34be3877c31141a1e06bdf725948560af2e1ab89
codeCheckedAgainst: "6.7.13.0"
keywords: ["custom data", "custom fields", "custom entities", "app data storage", "Resources/config/custom-fields.xml", "Resources/entities.xml", "custom_entity_", "ce_", "custom-fields-aware", "label-property", "extend core tables", "own entities"]
summary: "Overview of app custom data: custom fields store simple values on core tables; custom entities define new entities with associations and lifecycle."
lastBuilt: 2026-09-15
---
## What it is

Landing page for storing app-specific data in Shopware. Apps have two options:

- **Custom fields** — store simple data types (strings, numbers, booleans, arrays, objects) directly on existing core records (core tables).
- **Custom entities** — define completely new entities with their own associations and lifecycle.

## When to use

- Pick custom fields when a few extra values on an existing record (product, customer, order …) are enough.
- Pick custom entities when the app needs its own data model, e.g. records with relations to products, managed separately.

## Key steps / config

The installed 6.7.13.0 code reads each option from a fixed file in the app:

- Custom fields: `Resources/config/custom-fields.xml` (root `<custom-fields>`, one or more `<custom-field-set>` with `name`, `label`, `related-entities`, `fields`). It is processed on app install and update.
- Custom entities: `Resources/entities.xml` (root `<entities>`, one `<entity name="…">` per entity with a `<fields>` list). Entity names must start with `custom_entity_` or the shorthand `ce_`; each entity gets a repository service (`<entity name>.repository`) and Admin API routes.
- Combining both: an entity with `custom-fields-aware="true"` and a `label-property` pointing to one of its `string` fields can be referenced from entity-select custom fields.

## Essential identifiers

- `Resources/config/custom-fields.xml`, `<custom-field-set>`
- `Resources/entities.xml`, `custom_entity_`, `ce_`
- `custom-fields-aware`, `label-property`

## Version notes

- Defining custom fields inline in the app `manifest.xml` is deprecated in the installed code (removal planned for 6.8.0); the separate file takes priority when both exist.

## Code check (6.7.13.0)
- confirmed `custom-fields.xml` — app Resources/config file read on install/update — vendor/shopware/core/Framework/App/Lifecycle/Handler/CustomFieldLifecycleHandler.php:38
- deprecated `inline custom-fields` — inline manifest custom fields marked for removal in v6.8.0 — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:68
- confirmed `entities.xml` — filename for custom entity definitions — vendor/shopware/core/System/CustomEntity/Xml/CustomEntityXmlSchema.php:15
- confirmed `TABLE_PREFIX` — custom_entity_ name prefix — vendor/shopware/core/System/CustomEntity/Schema/SchemaUpdater.php:21
- confirmed `SHORTHAND_TABLE_PREFIX` — ce_ shorthand prefix — vendor/shopware/core/System/CustomEntity/Schema/SchemaUpdater.php:23
- confirmed `.repository` — repository service registered per custom entity — vendor/shopware/core/System/CustomEntity/CustomEntityRegistrar.php:62
- confirmed `custom-fields-aware` — boolean entity attribute — vendor/shopware/core/System/CustomEntity/Xml/entity-1.0.xsd:28
- confirmed `label-property` — string entity attribute; validator requires a StringField — vendor/shopware/core/System/CustomEntity/Xml/entity-1.0.xsd:29
