---
id: platform/dev/6.7/guides/plugins/plugins/framework/data-handling/add-data-translations.md
title: Adding Data Translations
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/framework/data-handling/add-data-translations.html
sourceHash: 6ca53ce81ba5b4b8029265a70d107c1f2573abbe
codeCheckedAgainst: "6.7.15.1"
keywords: ["EntityTranslationDefinition", "TranslationEntity", "TranslatedField", "TranslationsAssociationField", "getParentDefinitionClass", "shopware.entity.definition", "MigrationStep", "_translation table", "translations", "translated fields", "multi-language", "language_id"]
summary: "Translatable custom DAL entity: _translation table, EntityTranslationDefinition, TranslationEntity, TranslatedField, associations."
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/concepts/framework/translations/plain-vs-translated-fields.md"]
---
## What it is

How to add translatable fields to a custom DAL entity (`swag_example`): a `<entity>_translation` table, a translation definition, entity and collection, and the translated/association fields on the main definition.

## When to use

You have a custom entity and need per-language values for some of its fields. When reading, use `entity.translated.field` in storefront/sales-channel contexts and the plain `entity.field` in Admin/CRUD flows (see [Plain vs translated entity fields](platform/dev/6.7/concepts/framework/translations/plain-vs-translated-fields.md)).

## Key steps / config

1. **Migration** (`MigrationStep` with `getCreationTimestamp()` and `update(Connection $connection)`): create table `swag_example_translation` (entity name + `_translation`) with columns `swag_example_id`, `language_id` (both `BINARY(16)`, composite primary key, FKs to `swag_example.id` and `language.id` with `ON DELETE CASCADE`), the translated columns (e.g. `name VARCHAR(255)`), `created_at DATETIME(3) NOT NULL`, `updated_at DATETIME(3) NULL`.
2. **Translation definition** in `src/Core/Content/Example/Aggregate/ExampleTranslation/`, extending `Shopware\Core\Framework\DataAbstractionLayer\EntityTranslationDefinition`:

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

   Only translated columns go in `defineFields()`; the parent FK, `language_id` and both associations are added as base fields.
3. **Register** both definitions with tag `shopware.entity.definition` in `services.php`, the translation after the main entity:
   `->tag('shopware.entity.definition', ['entity' => 'swag_example_translation'])`.
4. **Entity**: `ExampleTranslationEntity extends Shopware\Core\Framework\DataAbstractionLayer\TranslationEntity` (which already provides `languageId`/`language`), adding `exampleId`, `name`, `example` with getters/setters.
5. **Collection**: `ExampleTranslationCollection extends EntityCollection` with `getExpectedClass()` returning `ExampleTranslationEntity::class`.
6. **Main definition** `defineFields()`: replace the plain field by `(new TranslatedField('name'))` and add `new TranslationsAssociationField(ExampleTranslationDefinition::class, 'swag_example_id')` (flags in the guide: `ApiAware`, `Required`).

## Essential identifiers

- `Shopware\Core\Framework\DataAbstractionLayer\EntityTranslationDefinition`
- `EntityTranslationDefinition::getParentDefinitionClass()`
- `Shopware\Core\Framework\DataAbstractionLayer\TranslationEntity`
- `TranslatedField`, `TranslationsAssociationField`
- `shopware.entity.definition` (DI tag)
- `Shopware\Core\Framework\Migration\MigrationStep`

## Gotchas

- `getParentDefinitionClass()` must be overridden; the base implementation throws `` `getParentDefinitionClass` not implemented ``.
- The guide's main-definition snippet uses `ENTITY_NAME = 'example'` while the table and tags use `swag_example`; the parent FK column of the translation is derived from the parent's entity name (`<entity>_id`), so keep them consistent.

## Code check (6.7.15.1)
- confirmed `EntityTranslationDefinition` — abstract class extending EntityDefinition — vendor/shopware/core/Framework/DataAbstractionLayer/EntityTranslationDefinition.php:18
- confirmed `EntityTranslationDefinition::getParentDefinitionClass()` — default throws RuntimeException, must be overridden — vendor/shopware/core/Framework/DataAbstractionLayer/EntityTranslationDefinition.php:50
- confirmed `EntityTranslationDefinition::getBaseFields()` — adds parent and language_id FKs plus associations automatically — vendor/shopware/core/Framework/DataAbstractionLayer/EntityTranslationDefinition.php:55
- confirmed `TranslationEntity::$languageId` — provided by base class with getter/setter — vendor/shopware/core/Framework/DataAbstractionLayer/TranslationEntity.php:14
- confirmed `TranslationsAssociationField` — constructor (referenceClass, referenceField, propertyName = 'translations') — vendor/shopware/core/Framework/DataAbstractionLayer/Field/TranslationsAssociationField.php:10
- confirmed `shopware.entity.definition` — tag collected by EntityCompilerPass — vendor/shopware/core/Framework/DependencyInjection/CompilerPass/EntityCompilerPass.php:40
- confirmed `MigrationStep::getCreationTimestamp()` — abstract — vendor/shopware/core/Framework/Migration/MigrationStep.php:28
- confirmed `MigrationStep::update()` — abstract — vendor/shopware/core/Framework/Migration/MigrationStep.php:33
