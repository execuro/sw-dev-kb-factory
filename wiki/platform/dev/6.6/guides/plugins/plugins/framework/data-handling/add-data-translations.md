---
id: platform/dev/6.6/guides/plugins/plugins/framework/data-handling/add-data-translations.md
title: Adding data translations
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: "https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/framework/data-handling/add-data-translations.html"
sourceHash: "f69e1daf35e80ba223fb89bf19fb0d8a709c4541"
keywords: ["data translations", "EntityTranslationDefinition", "TranslationEntity", "TranslatedField", "TranslationsAssociationField", "getParentDefinitionClass", "getEntityClass", "shopware.entity.definition", "services.xml", "migration", "EntityCollection", "DataAbstractionLayer"]
summary: "Add translations to an entity: migration for the _translation table, EntityTranslationDefinition, TranslationEntity, and services.xml registration."
lastBuilt: "2026-09-15"
---
## What it is

A guide on adding translations to an entity: creating the `_translation` database table, the
translation definition and entity classes, and registering the translation with Shopware's
DataAbstractionLayer (DAL).

## When to use

Use this guide when an existing entity (built following the "Adding custom complex data"
guide) needs one or more of its fields to be translatable per language.

## Key steps / config

1. Create a migration for a table named `<entity>_translation` (example: `swag_example_translation`)
   with columns `<entity>_id` (foreign key to the entity, also part of a composite primary
   key with `language_id`), `language_id` (foreign key to `language`), `name` (the translated
   value), `created_at`, and `updated_at`.

```php
class Migration1612863838ExampleTranslation extends MigrationStep
{
    public function update(Connection $connection): void { /* CREATE TABLE ... */ }
    public function updateDestructive(Connection $connection): void {}
}
```

2. Create an `ExampleTranslationDefinition` extending
   `Shopware\Core\Framework\DataAbstractionLayer\EntityTranslationDefinition`, overriding
   `getParentDefinitionClass()` to return the parent entity's definition class (e.g.
   `ExampleDefinition::class`), and defining the translated fields in `defineFields()` (e.g. a
   `StringField('name', 'name')`).
3. Register both the entity definition and the translation definition in `services.xml` with
   the `shopware.entity.definition` tag, translation registered *after* the entity it
   translates:

```xml
<service id="...\ExampleDefinition">
    <tag name="shopware.entity.definition" entity="swag_example" />
</service>
<service id="...\ExampleTranslationDefinition">
    <tag name="shopware.entity.definition" entity="swag_example_translation" />
</service>
```

4. Create an `ExampleTranslationEntity` extending
   `Shopware\Core\Framework\DataAbstractionLayer\TranslationEntity`, with getters/setters for
   the entity id, the translated `name`, and the association back to the parent entity; point
   the definition's `getEntityClass()` at it.
5. Create an `ExampleTranslationCollection` extending `EntityCollection`, overriding
   `getExpectedClass()` to return `ExampleTranslationEntity::class`.
6. On the main entity's definition, add a `TranslatedField('name')` and a
   `TranslationsAssociationField(ExampleTranslationDefinition::class, 'swag_example_id')`.

## Essential identifiers

- `Shopware\Core\Framework\DataAbstractionLayer\EntityTranslationDefinition`
- `Shopware\Core\Framework\DataAbstractionLayer\TranslationEntity`
- `Shopware\Core\Framework\DataAbstractionLayer\EntityCollection`
- `getParentDefinitionClass()`, `getEntityClass()`
- `TranslatedField`, `TranslationsAssociationField`
- `shopware.entity.definition` tag

## Gotchas

The translation service must be registered in `services.xml` *after* the entity it translates,
because Shopware resolves definitions in that order. The `EntityTranslationDefinition` base
class already provides `language_id` and other base fields automatically; only the entity's
own translatable fields (like `name`) need to be defined explicitly.
