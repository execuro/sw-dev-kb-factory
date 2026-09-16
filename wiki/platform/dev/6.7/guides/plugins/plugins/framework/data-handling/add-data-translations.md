---
id: platform/dev/6.7/guides/plugins/plugins/framework/data-handling/add-data-translations.md
title: Adding Data Translations
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/framework/data-handling/add-data-translations.html
sourceHash: 6ca53ce81ba5b4b8029265a70d107c1f2573abbe
codeCheckedAgainst: "6.7.13.0"
keywords: ["EntityTranslationDefinition", "getParentDefinitionClass", "TranslationEntity", "TranslatedField", "TranslationsAssociationField", "shopware.entity.definition", "MigrationStep", "swag_example_translation", "language_id", "translation table", "translatable entity", "i18n", "multilingual fields"]
summary: "Translatable custom entity: _translation table, EntityTranslationDefinition, TranslationEntity, TranslatedField, TranslationsAssociationField."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/concepts/framework/translations/plain-vs-translated-fields.md"]
---
## What it is

How to add translatable fields to an existing custom entity (`swag_example`): a `_translation` table, a translation definition/entity/collection, and translation fields on the main definition. For reading, prefer `entity.translated.field` in storefront/sales-channel contexts and plain `entity.field` in Admin/CRUD flows — see [Plain vs translated entity fields](platform/dev/6.7/concepts/framework/translations/plain-vs-translated-fields.md).

## When to use

A plugin entity (created per "Adding custom complex data") needs per-language values such as a translated `name`.

## Key steps / config

1. **Migration** (extends `Shopware\Core\Framework\Migration\MigrationStep`, implements `getCreationTimestamp(): int` and `update(Connection $connection): void`) creating `swag_example_translation` with `swag_example_id` BINARY(16), `language_id` BINARY(16), `name` VARCHAR(255), `created_at` DATETIME(3) NOT NULL, `updated_at` DATETIME(3) NULL; primary key (`swag_example_id`, `language_id`); FKs to `swag_example`(`id`) and `language`(`id`) with `ON DELETE CASCADE`.
2. **Translation definition** in `src/Core/Content/Example/Aggregate/ExampleTranslation/`:

```php
class ExampleTranslationDefinition extends EntityTranslationDefinition
{
    public const ENTITY_NAME = 'swag_example_translation';
    public function getEntityName(): string { return self::ENTITY_NAME; }
    public function getParentDefinitionClass(): string { return ExampleDefinition::class; }
    public function getEntityClass(): string { return ExampleTranslationEntity::class; }
    protected function defineFields(): FieldCollection
    {
        return new FieldCollection([(new StringField('name', 'name'))->addFlags(new Required())]);
    }
}
```

   Only translated columns go into `defineFields()`; the parent FK, `language_id` FK and both `ManyToOneAssociationField`s are added by `EntityTranslationDefinition::getBaseFields()`.
3. **Register** both in `services.php`, main definition first: `->tag('shopware.entity.definition', ['entity' => 'swag_example'])`, then `->tag('shopware.entity.definition', ['entity' => 'swag_example_translation'])`.
4. **Entity**: `ExampleTranslationEntity extends Shopware\Core\Framework\DataAbstractionLayer\TranslationEntity` (base provides `languageId` accessors) with properties + getters/setters for the parent id, `name`, and the parent entity.
5. **Collection**: `ExampleTranslationCollection extends EntityCollection` with `getExpectedClass()` returning `ExampleTranslationEntity::class`.
6. **Main definition** `defineFields()` adds `(new TranslatedField('name'))->addFlags(new ApiAware(), new Required())` and `(new TranslationsAssociationField(ExampleTranslationDefinition::class, 'swag_example_id'))->addFlags(new ApiAware(), new Required())`.

## Essential identifiers

- `Shopware\Core\Framework\DataAbstractionLayer\EntityTranslationDefinition`, `getParentDefinitionClass()`
- `Shopware\Core\Framework\DataAbstractionLayer\TranslationEntity`
- `TranslatedField`, `TranslationsAssociationField`, `StringField`
- `shopware.entity.definition` tag
- `Shopware\Core\Framework\Migration\MigrationStep`

## Gotchas

- The base FK column and property are derived from the parent's entity name (`<entityName>_id`, camel-cased property), so the parent entity name must match the table prefix (`swag_example` → `swag_example_id` / `swagExampleId`). The docs' `ExampleDefinition` snippet uses `ENTITY_NAME = 'example'`, inconsistent with the `swag_example` tag and table.
- `getParentDefinitionClass()` is `protected` in the base and throws a `RuntimeException` if not overridden; overriding it as `public` (as in the docs) is allowed.
- Register the translation definition after the definition it translates.

## Code check (6.7.13.0)
- confirmed `EntityTranslationDefinition::getParentDefinitionClass()` — protected, throws unless overridden — vendor/shopware/core/Framework/DataAbstractionLayer/EntityTranslationDefinition.php:50
- confirmed `EntityTranslationDefinition::getBaseFields()` — adds parent FK, language_id FK and associations — vendor/shopware/core/Framework/DataAbstractionLayer/EntityTranslationDefinition.php:55
- confirmed `language_id` — base FkField added automatically — vendor/shopware/core/Framework/DataAbstractionLayer/EntityTranslationDefinition.php:66
- confirmed `MigrationStep::getCreationTimestamp()` — abstract — vendor/shopware/core/Framework/Migration/MigrationStep.php:28
- confirmed `MigrationStep::update()` — abstract — vendor/shopware/core/Framework/Migration/MigrationStep.php:33
- confirmed `TranslationEntity` — extends Entity, has languageId — vendor/shopware/core/Framework/DataAbstractionLayer/TranslationEntity.php:9
- confirmed `TranslatedField::__construct()` — propertyName, useForSorting = false — vendor/shopware/core/Framework/DataAbstractionLayer/Field/TranslatedField.php:22
- confirmed `TranslationsAssociationField::__construct()` — referenceClass, referenceField, propertyName = 'translations' — vendor/shopware/core/Framework/DataAbstractionLayer/Field/TranslationsAssociationField.php:14
- confirmed `shopware.entity.definition` — DI tag used for definitions — vendor/shopware/core/Framework/DependencyInjection/custom-field.php:21
