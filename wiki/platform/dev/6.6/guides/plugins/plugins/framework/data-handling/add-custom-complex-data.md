---
id: platform/dev/6.6/guides/plugins/plugins/framework/data-handling/add-custom-complex-data.md
title: Adding custom complex data
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/framework/data-handling/add-custom-complex-data.html
sourceHash: bd8add32d3010374835f23abf847f60feb00ccc7
keywords: ["EntityDefinition", "defineFields", "FieldCollection", "IdField", "StringField", "BoolField", "getEntityName", "getEntityClass", "getCollectionClass", "EntityCollection", "shopware.entity.definition", "Required", "PrimaryKey", "custom entity"]
summary: "Create a fully custom entity backed by its own database table: EntityDefinition, Entity, and EntityCollection classes registered via services.xml."
lastBuilt: "2026-09-15"
---
## What it is

Guide for creating a brand-new custom entity backed by its own database table, using Shopware's Data Abstraction Layer: an `EntityDefinition`, an optional `Entity` class and an optional `EntityCollection` class.

## When to use

When a plugin needs to persist its own data in a new database table rather than extending an existing entity.

## Key steps / config

1. Create the table via a migration, e.g. `swag_example` with `id`, `name`, `description`, `active`, `created_at`, `updated_at`.
2. Create an `EntityDefinition` subclass implementing `getEntityName()` (returns the table/entity name, e.g. `swag_example`, also used for the `<name>.repository` DI service) and `defineFields()` returning a `FieldCollection` of field objects such as `IdField`, `StringField`, `BoolField`, each taking a snake_case `storageName` and lowerCamelCase `propertyName`:

```php
protected function defineFields(): FieldCollection
{
    return new FieldCollection([
        (new IdField('id', 'id'))->addFlags(new Required(), new PrimaryKey()),
        (new StringField('name', 'name')),
        (new StringField('description', 'description')),
        (new BoolField('active', 'active')),
    ]);
}
```

3. Register the definition in `services.xml` tagged `shopware.entity.definition` with the matching `entity` attribute:

```xml
<service id="Swag\BasicExample\Core\Content\Example\ExampleDefinition">
    <tag name="shopware.entity.definition" entity="swag_example" />
</service>
```

4. Optionally create an `Entity` subclass (using `EntityIdTrait`, protected properties with getters/setters) and point to it via `getEntityClass()`.
5. Optionally create an `EntityCollection` subclass implementing `getExpectedClass()` and point to it via `getCollectionClass()`.

## Essential identifiers

- `Shopware\Core\Framework\DataAbstractionLayer\EntityDefinition`
- `Shopware\Core\Framework\DataAbstractionLayer\FieldCollection`
- `Shopware\Core\Framework\DataAbstractionLayer\Field\IdField` / `StringField` / `BoolField`
- `getEntityName()`, `defineFields()`, `getEntityClass()`, `getCollectionClass()`
- `shopware.entity.definition` tag, `<entity>.repository` DI service

## Gotchas

Entity class properties must be at least `protected` (not `readonly`), or the DAL cannot set the values — this applies to any class extending the generic `Struct` class, not just `Entity`. Without a custom `Entity`/`EntityCollection`, generic `ArrayEntity` instances are returned instead.
