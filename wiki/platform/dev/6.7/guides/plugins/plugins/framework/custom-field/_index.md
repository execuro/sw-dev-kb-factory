---
id: platform/dev/6.7/guides/plugins/plugins/framework/custom-field/_index.md
title: Custom Fields
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/framework/custom-field/
sourceHash: a2d47151a1c3f98f87108392d5c9a959171b9267
codeCheckedAgainst: "6.7.15.1"
keywords: ["custom fields", "custom field set", "CustomFieldTypes", "custom_field_set", "customFields", "zusatzfelder", "additional entity data", "extra attributes", "field types", "product custom field"]
summary: "Overview of Shopware custom fields: extra typed data fields on entities like products, customers or orders, managed via Administration or API."
lastBuilt: 2026-10-21
---
## What it is

Section overview for custom fields: additional data fields that can be added to entities such as products, customers or orders to store information beyond Shopware's standard attributes (e.g. fabric composition for a clothing store, product dimensions for a hardware store).

## When to use

- You need to store extra, shop-specific data on existing entities without changing their schema.
- You want merchants to create and manage such fields themselves through the Administration or via the API.

## Key steps / config

- Custom fields are created and managed in the Administration or via the API.
- Each field gets a data type (such as text, number, date) and is assigned to specific entities.
- In the installed code, the available types are the constants of `Shopware\Core\System\CustomField\CustomFieldTypes` (e.g. `text`, `int`, `float`, `number`, `date`, `datetime`, `bool`, `select`, `entity`, `media`, `html`, `price`).

## Code check (6.7.15.1)
- confirmed `CustomFieldTypes` — final class listing custom field types — vendor/shopware/core/System/CustomField/CustomFieldTypes.php:8
- confirmed `CustomFieldTypes::TEXT` — `text` type — vendor/shopware/core/System/CustomField/CustomFieldTypes.php:25
- confirmed `CustomFieldTypes::DATE` — `date` type — vendor/shopware/core/System/CustomField/CustomFieldTypes.php:13
- confirmed `CustomFieldTypes::NUMBER` — `number` type — vendor/shopware/core/System/CustomField/CustomFieldTypes.php:19
- confirmed `custom_field_set` — entity grouping custom fields — vendor/shopware/core/System/CustomField/Aggregate/CustomFieldSet/CustomFieldSetDefinition.php:34
