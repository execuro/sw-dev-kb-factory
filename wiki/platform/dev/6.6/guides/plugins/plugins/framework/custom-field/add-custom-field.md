---
id: platform/dev/6.6/guides/plugins/plugins/framework/custom-field/add-custom-field.md
title: Add custom field
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/framework/custom-field/add-custom-field.html
sourceHash: 6254529a2dba81aee40595338bd5234654d4b27d
keywords: ["EntityCustomFieldsTrait", "CustomFields", "custom_fields", "custom_field_set.repository", "CustomFieldTypes", "customFieldPosition", "TranslatedField", "getCustomFields", "setCustomFields", "JSON field", "custom field set", "Administration custom field"]
summary: "Add custom-field support to a custom entity (trait, DAL field, migration column) and define custom field sets via the API."
lastBuilt: "2026-09-15"
---
## What it is

Guide covering two related subjects: supporting custom fields on a custom entity, and defining/filling actual custom fields on that entity, backed by a JSON column.

## When to use

When a plugin's custom entity needs to store extra scalar data via Shopware's custom field system, optionally editable in the Administration.

## Key steps / config

To support custom fields on a custom entity (three steps):

1. Add the `Shopware\Core\Framework\DataAbstractionLayer\EntityCustomFieldsTrait` trait to the `Entity` class (adds `getCustomFields()`/`setCustomFields()`).
2. Add a `Shopware\Core\Framework\DataAbstractionLayer\Field\CustomFields` field to the `EntityDefinition`'s `defineFields()`.
3. Add a `custom_fields` column of type `JSON DEFAULT NULL` to the entity's table via a migration.

For translatable custom fields, use `new TranslatedField('customFields')` on the main entity definition and add `new CustomFields()` on the translation definition instead.

Filling data (no field definition required first):

```php
$this->swagExampleRepository->upsert([[
    'id' => '<your ID here>',
    'customFields' => ['swag_example_size' => 15]
]], $context);
```

Defining a custom field set so it is editable/validated in the Administration, via the `custom_field_set.repository` service:

```php
$this->customFieldSetRepository->create([[
    'name' => 'swag_example_set',
    'config' => ['label' => ['en-GB' => '...', 'de-DE' => '...', Defaults::LANGUAGE_SYSTEM => '...']],
    'customFields' => [[
        'name' => 'swag_example_size',
        'type' => CustomFieldTypes::INT,
        'config' => ['label' => [...], 'customFieldPosition' => 1]
    ]]
]], $context);
```

## Essential identifiers

- `Shopware\Core\Framework\DataAbstractionLayer\EntityCustomFieldsTrait`
- `Shopware\Core\Framework\DataAbstractionLayer\Field\CustomFields`
- `Shopware\Core\Framework\DataAbstractionLayer\Field\TranslatedField`
- `Shopware\Core\System\CustomField\CustomFieldTypes`
- `custom_field_set.repository`
- `custom_fields` database column (JSON)
- `customFieldPosition` config key

## Gotchas

Available starting with Shopware 6.4.1.0 for the entity-support trait. Custom field sets are deletable by the shop administrator, so code must not rely on their existence. Writing to `customFields` without a defined field set skips validation entirely — any valid JSON is accepted. The `type` given on a defined custom field (e.g. `CustomFieldTypes::INT`) determines both the Administration's rendered field and the validation applied when writing.
