---
id: platform/dev/6.7/guides/plugins/plugins/framework/custom-field/add-custom-field.md
title: Add Custom Field
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/framework/custom-field/add-custom-field.html
sourceHash: a73e41a1a8cb794308a81c040c0acdd66a0547ae
codeCheckedAgainst: "6.7.13.0"
keywords: ["custom fields", "EntityCustomFieldsTrait", "CustomFields", "TranslatedField", "custom_fields", "custom-fields.xml", "custom_field_set.repository", "CustomFieldTypes", "includeInSearch", "customFieldPosition", "custom field set", "json column", "attributes"]
summary: Add custom field support to a plugin entity (trait, CustomFields field, JSON column) and define custom field sets via custom-fields.xml or repository.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/apps/custom-data/custom-fields.md", "platform/dev/6.7/resources/references/app-reference/manifest-reference.md", "platform/dev/6.7/guides/plugins/plugins/database/database-migrations.md"]
---
## What it is

Shopware custom fields store extra scalar data on an entity in a JSON column (`custom_fields`) without writing an entity extension. The page covers (1) making a custom plugin entity support custom fields and (2) defining and filling actual custom fields, declaratively via `Resources/config/custom-fields.xml` or imperatively via `custom_field_set.repository`. For associations between entities use an entity extension instead.

## When to use

- Your own DAL entity should accept `customFields`.
- You want a custom field (set) to be editable in the Administration, validated on write, searchable, or removed on plugin uninstall.

## Key steps / config

### Support custom fields in a custom entity (since 6.4.1.0)

1. Entity class: `use EntityCustomFieldsTrait;` (`Shopware\Core\Framework\DataAbstractionLayer\EntityCustomFieldsTrait`) — adds `getCustomFields()` / `setCustomFields()`.
2. Definition: add `Shopware\Core\Framework\DataAbstractionLayer\Field\CustomFields` (defaults: storage `custom_fields`, property `customFields`).
3. Migration: add column `` `custom_fields` json DEFAULT NULL ``.

```php
class ExampleDefinition extends EntityDefinition
{
    public function getEntityName(): string { return 'swag_example'; }

    protected function defineFields(): FieldCollection
    {
        return new FieldCollection([
            (new IdField('id', 'id'))->addFlags(new Required(), new PrimaryKey()),
            new CustomFields(),            // or: new TranslatedField('customFields')
        ]);
    }
}
```

Translatable variant: put `new TranslatedField('customFields')` in the main definition and `new CustomFields()` in the `EntityTranslationDefinition` subclass.

### Writing values

No set definition is required to write: `$repo->upsert([['id' => $id, 'customFields' => ['swag_example_size' => 15]]], $context);` — any valid JSON is accepted without validation.

### Declarative sets (since 6.7.13.0)

Place `<plugin root>/src/Resources/config/custom-fields.xml` (same XML format as the app manifest's custom fields). On `install` and `update` Shopware syncs sets: present sets/fields are created/updated, sets/fields no longer in the XML are removed; on `uninstall` without keeping user data the plugin's sets are removed. No lifecycle hooks or installer service needed.

### Imperative sets

Inject `service('custom_field_set.repository')` and `create()` in a lifecycle method:

```php
['name' => 'swag_example_set', 'global' => true,
 'config' => ['label' => ['en-GB' => '...', Defaults::LANGUAGE_SYSTEM => '...']],
 'customFields' => [[
     'name' => 'swag_example_size', 'type' => CustomFieldTypes::INT,
     'includeInSearch' => true,
     'config' => ['label' => [...], 'customFieldPosition' => 1],
 ]]]
```

Delete: `searchIds` with `EqualsFilter('name', 'swag_example_set')`, then `delete([['id' => $setId]], $context)`. Afterwards clean values: `UPDATE swag_example SET custom_fields = JSON_REMOVE(custom_fields, '$.swag_example_size') WHERE JSON_CONTAINS_PATH(custom_fields, 'one', '$.swag_example_size');` — for large tables (orders, products) do it in batches (e.g. 1000 ids per `UPDATE`).

## Essential identifiers

- `EntityCustomFieldsTrait`, `getCustomFields()`, `setCustomFields()`
- `Shopware\Core\Framework\DataAbstractionLayer\Field\CustomFields`, `TranslatedField`
- `custom_fields` (JSON column), `customFields` (property)
- `Resources/config/custom-fields.xml`
- `custom_field_set.repository`, `Shopware\Core\System\CustomField\CustomFieldTypes`, `Defaults::LANGUAGE_SYSTEM`
- `includeInSearch`, `customFieldPosition`, `global`

## Gotchas

- Custom field and set names are global — always use a vendor prefix (e.g. `swag_`).
- The Type matters: the Administration renders by type, and writes to a defined field are validated against it.
- `global: true` sets are not deletable/editable in the Administration; set `global` to false for that.
- Custom fields are not searchable by default (`includeInSearch` defaults to false); enabling it on an existing product field requires rebuilding the search index or re-saving products.
- Deleting a set leaves stored values in entities' `custom_fields`; remove them yourself.

## Version notes

- 6.4.1.0: `EntityCustomFieldsTrait` available.
- 6.7.6.0: `includeInSearch` opt-in searchability.
- 6.7.13.0: declarative plugin `Resources/config/custom-fields.xml`.

## Code check (6.7.13.0)
- confirmed `EntityCustomFieldsTrait` — trait with customFields property and accessors — vendor/shopware/core/Framework/DataAbstractionLayer/EntityCustomFieldsTrait.php:10
- confirmed `EntityCustomFieldsTrait::setCustomFields()` — setter present — vendor/shopware/core/Framework/DataAbstractionLayer/EntityCustomFieldsTrait.php:82
- confirmed `CustomFields` — JsonField with default storage `custom_fields` / property `customFields` — vendor/shopware/core/Framework/DataAbstractionLayer/Field/CustomFields.php:10
- confirmed `TranslatedField` — DAL field class — vendor/shopware/core/Framework/DataAbstractionLayer/Field/TranslatedField.php:11
- confirmed `EntityDefinition::getEntityName()` — abstract, subclasses must declare — vendor/shopware/core/Framework/DataAbstractionLayer/EntityDefinition.php:130
- confirmed `EntityDefinition::defineFields()` — abstract, subclasses must declare — vendor/shopware/core/Framework/DataAbstractionLayer/EntityDefinition.php:458
- confirmed `custom-fields.xml` — plugin lifecycle loads Resources/config/custom-fields.xml and syncs sets — vendor/shopware/core/Framework/Plugin/PluginLifecycleService.php:571
- confirmed `removePluginCustomFields` — on uninstall only when user data is not kept — vendor/shopware/core/Framework/Plugin/PluginLifecycleService.php:252
- confirmed `includeInSearch` — default false in custom field definition — vendor/shopware/core/System/CustomField/CustomFieldDefinition.php:53
- confirmed `CustomFieldTypes::INT` — constant 'int' — vendor/shopware/core/System/CustomField/CustomFieldTypes.php:17
