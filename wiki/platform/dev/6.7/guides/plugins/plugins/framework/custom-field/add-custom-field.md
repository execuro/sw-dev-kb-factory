---
id: platform/dev/6.7/guides/plugins/plugins/framework/custom-field/add-custom-field.md
title: Add Custom Field
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/framework/custom-field/add-custom-field.html
sourceHash: a73e41a1a8cb794308a81c040c0acdd66a0547ae
codeCheckedAgainst: "6.7.15.1"
keywords: ["EntityCustomFieldsTrait", "CustomFields", "custom_fields", "TranslatedField", "custom-fields.xml", "custom_field_set.repository", "CustomFieldTypes", "includeInSearch", "customFieldPosition", "custom field set", "custom fields", "zusatzfelder", "entity extension", "json column"]
summary: "Add custom field support to a plugin entity (trait, CustomFields DAL field, JSON column) and define custom field sets via custom-fields.xml or repository."
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/database/database-migrations.md", "platform/dev/6.7/guides/plugins/apps/custom-data/custom-fields.md", "platform/dev/6.7/resources/references/app-reference/manifest-reference.md"]
---
## What it is

How a plugin (a) makes its own entity support custom fields and (b) writes and defines custom fields. Custom fields are stored in a JSON column, so they hold scalar values only; associations need an entity extension instead.

## When to use

- Your custom entity should accept `customFields` like core entities.
- You want custom fields editable in the Administration, validated on write, or searchable.
- You need to clean up custom field data on plugin uninstall.

## Key steps / config

**Support custom fields on a custom entity** (three steps):

1. Entity class: `use EntityCustomFieldsTrait;` (`Shopware\Core\Framework\DataAbstractionLayer\EntityCustomFieldsTrait`) — provides `getCustomFields()`, `setCustomFields()`, `getCustomFieldsValue()`, `changeCustomFields()`.
2. Definition: add `new CustomFields()` (`Shopware\Core\Framework\DataAbstractionLayer\Field\CustomFields`; defaults to storage `custom_fields`, property `customFields`).
3. Migration: add column `` `custom_fields` json DEFAULT NULL `` to the table (see [database migrations](platform/dev/6.7/guides/plugins/plugins/database/database-migrations.md)).

```php
class ExampleDefinition extends EntityDefinition
{
    public function getEntityName(): string { /* ... */ }

    protected function defineFields(): FieldCollection
    {
        return new FieldCollection([
            (new IdField('id', 'id'))->addFlags(new Required(), new PrimaryKey()),
            new CustomFields(),
        ]);
    }
}
```

Translatable: put `new TranslatedField('customFields')` in the main definition and `new CustomFields()` in the `EntityTranslationDefinition`.

**Write values** — no definition needed; any valid JSON is accepted without validation:

```php
$this->swagExampleRepository->upsert([[
    'id' => '<id>',
    'customFields' => ['swag_example_size' => 15],
]], $context);
```

**Declarative sets (6.7.13.0+)** — place `<plugin root>/src/Resources/config/custom-fields.xml` (same format as the app manifest custom fields, see [app custom fields](platform/dev/6.7/guides/plugins/apps/custom-data/custom-fields.md) and the [manifest reference](platform/dev/6.7/resources/references/app-reference/manifest-reference.md)). Shopware syncs it on `install` and `update` (sets/fields missing from the XML are removed) and removes the plugin's sets on `uninstall` without keepUserData. No `CustomFieldsInstaller` or lifecycle hooks needed.

**Imperative sets** (only for runtime-created sets) — inject `custom_field_set.repository` and call `create`:

```php
$this->customFieldSetRepository->create([[
    'name' => 'swag_example_set',
    'global' => true,
    'config' => ['label' => ['en-GB' => '...', Defaults::LANGUAGE_SYSTEM => '...']],
    'customFields' => [[
        'name' => 'swag_example_size',
        'type' => CustomFieldTypes::INT,
        'includeInSearch' => true,
        'config' => ['label' => [/* ... */], 'customFieldPosition' => 1],
    ]],
]], $context);
```

**Delete** — `searchIds` with `EqualsFilter('name', 'swag_example_set')`, then `delete([['id' => $setId]], $context)`. Remove stored values too, e.g. `UPDATE swag_example SET custom_fields = JSON_REMOVE(custom_fields, '$.swag_example_size') WHERE JSON_CONTAINS_PATH(custom_fields, 'one', '$.swag_example_size');` — batch it (e.g. 1000 ids per loop) on large tables like `order`.

## Essential identifiers

- `EntityCustomFieldsTrait`, `CustomFields`, `TranslatedField`
- `custom_fields` (JSON column), `customFields` (property)
- `Resources/config/custom-fields.xml`
- `custom_field_set.repository`, `Shopware\Core\System\CustomField\CustomFieldTypes`
- `includeInSearch`, `customFieldPosition`, `global`

## Gotchas

- Custom field and set names are global; always use a vendor prefix (e.g. `swag_`).
- A field `type` is enforced on write once the set is defined (e.g. `int` rejects strings).
- Custom fields are not searchable by default (`includeInSearch` defaults to `false`). Enabling it on an existing product custom field requires rebuilding the search index or re-saving products.
- `global: true` sets cannot be edited or deleted in the Administration; use `false` for that.
- Deleting a definition leaves the stored values in place; they keep using space and lose API checks.
- With `custom-fields.xml`, removing the file and updating the plugin deletes the plugin's sets.

## Version notes

- `EntityCustomFieldsTrait`: 6.4.1.0+. `includeInSearch`: 6.7.6.0+. Plugin `custom-fields.xml`: 6.7.13.0+.

## Code check (6.7.15.1)
- confirmed `EntityCustomFieldsTrait` — provides `customFields` property and accessors — vendor/shopware/core/Framework/DataAbstractionLayer/EntityCustomFieldsTrait.php:10
- confirmed `CustomFields` — DAL field defaults `custom_fields`/`customFields` — vendor/shopware/core/Framework/DataAbstractionLayer/Field/CustomFields.php:13
- confirmed `EntityDefinition::getEntityName()` — abstract, required in subclasses — vendor/shopware/core/Framework/DataAbstractionLayer/EntityDefinition.php:143
- confirmed `EntityDefinition::defineFields()` — abstract, required in subclasses — vendor/shopware/core/Framework/DataAbstractionLayer/EntityDefinition.php:476
- confirmed `TranslatedField` — constructor takes property name — vendor/shopware/core/Framework/DataAbstractionLayer/Field/TranslatedField.php:11
- confirmed `custom-fields.xml` — read from plugin path `/Resources/config/` — vendor/shopware/core/Framework/Plugin/PluginLifecycleService.php:571
- confirmed `PluginLifecycleService::syncPluginCustomFields()` — install keeps sets if XML absent; update deletes them — vendor/shopware/core/Framework/Plugin/PluginLifecycleService.php:325
- confirmed `custom_field_set` — entity name behind `custom_field_set.repository` — vendor/shopware/core/System/CustomField/Aggregate/CustomFieldSet/CustomFieldSetDefinition.php:34
- confirmed `CustomFieldTypes::INT` — value `int` — vendor/shopware/core/System/CustomField/CustomFieldTypes.php:17
- confirmed `includeInSearch` — default `false` — vendor/shopware/core/System/CustomField/CustomFieldDefinition.php:56
