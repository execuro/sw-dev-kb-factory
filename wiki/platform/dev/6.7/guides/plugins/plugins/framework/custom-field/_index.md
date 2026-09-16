---
id: platform/dev/6.7/guides/plugins/plugins/framework/custom-field/_index.md
title: Custom Fields
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/framework/custom-field/
sourceHash: a2d47151a1c3f98f87108392d5c9a959171b9267
codeCheckedAgainst: "6.7.13.0"
keywords: ["custom fields", "custom field set", "additional attributes", "extra entity data", "custom_field", "custom_field_set", "custom_field_set_relation", "CustomFieldTypes", "CustomFields", "customFields", "field types", "zusatzfelder"]
summary: "Overview of custom fields: extra data fields on entities such as products, customers or orders, created via Administration or API with a data type."
lastBuilt: 2026-09-15
---
## What it is

Overview of custom fields: additional data fields that can be added to entities such as products, customers or orders, to store information beyond Shopware's standard attributes (e.g. fabric composition for a clothing store, product dimensions for a hardware store).

## When to use

A project or plugin needs to store extra, business-specific data on existing entities without changing the default data structure.

## Key steps / config

- Custom fields are created and managed through the Administration or via the API.
- Each field gets a data type (such as text, number, date) and is assigned to specific entities.
- In the installed core, fields are grouped in sets (`custom_field_set`); a set is assigned to an entity through `custom_field_set_relation` with its `entityName`, and values are stored in the entity's `customFields` JSON field.
- Type names available in `Shopware\Core\System\CustomField\CustomFieldTypes`: `bool`, `checkbox`, `colorpicker`, `date`, `datetime`, `entity`, `float`, `int`, `json`, `number`, `price`, `html`, `media`, `select`, `switch`, `text`.

## Essential identifiers

- `custom_field` (`Shopware\Core\System\CustomField\CustomFieldDefinition`)
- `custom_field_set`, `custom_field_set_relation`
- `Shopware\Core\System\CustomField\CustomFieldTypes`
- `Shopware\Core\Framework\DataAbstractionLayer\Field\CustomFields` (DAL field type, property `customFields`)

## Code check (6.7.13.0)
- confirmed `CustomFieldDefinition::ENTITY_NAME` — entity custom_field — vendor/shopware/core/System/CustomField/CustomFieldDefinition.php:25
- confirmed `CustomFieldSetDefinition::ENTITY_NAME` — entity custom_field_set — vendor/shopware/core/System/CustomField/Aggregate/CustomFieldSet/CustomFieldSetDefinition.php:31
- confirmed `CustomFieldSetRelationDefinition::ENTITY_NAME` — entity custom_field_set_relation — vendor/shopware/core/System/CustomField/Aggregate/CustomFieldSetRelation/CustomFieldSetRelationDefinition.php:19
- confirmed `entityName` — required field naming the assigned entity — vendor/shopware/core/System/CustomField/Aggregate/CustomFieldSetRelation/CustomFieldSetRelationDefinition.php:47
- confirmed `CustomFieldTypes` — data type constants such as text, number, date — vendor/shopware/core/System/CustomField/CustomFieldTypes.php:8
- confirmed `CustomFields` — DAL JSON field storing values — vendor/shopware/core/Framework/DataAbstractionLayer/Field/CustomFields.php:10
- confirmed `customFields` — e.g. product entity field — vendor/shopware/core/Content/Product/ProductDefinition.php:221
