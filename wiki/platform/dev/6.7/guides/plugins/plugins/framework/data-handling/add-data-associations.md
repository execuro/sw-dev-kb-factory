---
id: platform/dev/6.7/guides/plugins/plugins/framework/data-handling/add-data-associations.md
title: Adding Data Associations
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/framework/data-handling/add-data-associations.html
sourceHash: 5692b1f59ccafd7466c1709d5c42c11ff4e65efc
codeCheckedAgainst: "6.7.15.1"
keywords: ["OneToOneAssociationField", "OneToManyAssociationField", "ManyToOneAssociationField", "ManyToManyAssociationField", "MappingEntityDefinition", "FkField", "EntityDefinition", "defineFields", "association", "relation", "foreign key", "mapping table", "autoload"]
summary: DAL associations between custom entities - OneToOne, OneToMany/ManyToOne and ManyToMany via MappingEntityDefinition - with field arguments.
lastBuilt: 2026-10-21
---
## What it is

Reference for wiring associations between DAL entity definitions: one-to-one, one-to-many / many-to-one, and many-to-many (with a mapping definition). Examples use two definitions `FooDefinition` (`foo`) and `BarDefinition` (`bar`), each extending `Shopware\Core\Framework\DataAbstractionLayer\EntityDefinition` with `getEntityName()` and `defineFields()` and an `IdField('id', 'id')` flagged `Required`, `PrimaryKey`.

## When to use

Your custom entities relate to each other and you need the DAL to load/write the related data. Creating the entities themselves is covered in the custom complex data guide.

## Key steps / config

All snippets are `defineFields(): FieldCollection` bodies.

### One to One

Foreign key on one side only (`foo_id` in `bar`):

```php
// BarDefinition
(new FkField('foo_id', 'fooId', FooDefinition::class))->addFlags(new Required()),
new OneToOneAssociationField('foo', 'foo_id', 'id', FooDefinition::class, false)
// FooDefinition - no FkField
new OneToOneAssociationField('bar', 'id', 'foo_id', BarDefinition::class, false)
```

`OneToOneAssociationField(propertyName, storageName, referenceField, referenceClass, autoload)`. `FkField(storageName, propertyName, referenceClass)`.

### One to Many / Many to One

Foreign key on the "many" side (`bar_id` in `foo`):

```php
// BarDefinition
new OneToManyAssociationField('foos', FooDefinition::class, 'bar_id')
// FooDefinition
(new FkField('bar_id', 'barId', BarDefinition::class))->addFlags(new Required()),
new ManyToOneAssociationField('bar', 'bar_id', BarDefinition::class, 'id'),
```

`OneToManyAssociationField(propertyName, referenceClass, referenceField)` — referenceField is the column in the referenced table pointing back. `ManyToOneAssociationField(propertyName, storageName, referenceClass, referenceField = 'id', autoload = false)`.

### Many to Many

A third mapping entity with its own table. `FooBarMappingDefinition` extends `Shopware\Core\Framework\DataAbstractionLayer\MappingEntityDefinition`:

```php
class FooBarMappingDefinition extends MappingEntityDefinition
{
    public const ENTITY_NAME = 'foo_bar';
    public function getEntityName(): string { return self::ENTITY_NAME; }
    protected function defineFields(): FieldCollection
    {
        return new FieldCollection([
            (new FkField('bar_id', 'barId', BarDefinition::class))->addFlags(new PrimaryKey(), new Required()),
            (new FkField('foo_id', 'fooId', FooDefinition::class))->addFlags(new PrimaryKey(), new Required()),
            new ManyToOneAssociationField('bar', 'bar_id', BarDefinition::class, 'id'),
            new ManyToOneAssociationField('foo', 'foo_id', FooDefinition::class, 'id'),
        ]);
    }
}
```

Then on each main definition:

```php
// BarDefinition
new ManyToManyAssociationField('foos', FooDefinition::class, FooBarMappingDefinition::class, 'bar_id', 'foo_id'),
// FooDefinition
new ManyToManyAssociationField('bars', BarDefinition::class, FooBarMappingDefinition::class, 'foo_id', 'bar_id'),
```

Arguments: `propertyName`, `referenceDefinition`, `mappingDefinition`, `mappingLocalColumn` (id column of the current entity), `mappingReferenceColumn` (id column of the referenced entity).

## Essential identifiers

- `Shopware\Core\Framework\DataAbstractionLayer\Field\OneToOneAssociationField`
- `Shopware\Core\Framework\DataAbstractionLayer\Field\OneToManyAssociationField`
- `Shopware\Core\Framework\DataAbstractionLayer\Field\ManyToOneAssociationField`
- `Shopware\Core\Framework\DataAbstractionLayer\Field\ManyToManyAssociationField`
- `Shopware\Core\Framework\DataAbstractionLayer\Field\FkField`
- `Shopware\Core\Framework\DataAbstractionLayer\MappingEntityDefinition`

## Gotchas

- Setting autoload to `true` on both the `EntityExtension` and the `EntityDefinition` side causes recursion / out-of-memory; set it `true` only in the `EntityExtension`.
- `OneToOneAssociationField` defaults `autoload` to `true` in code; pass `false` explicitly where you do not want it loaded every time.
- `ManyToOneAssociationField` autoload defaults to `false`; enabling it can cost performance.
- Storage names are snake_case, property names lowerCamelCase; for one-to-one, the inverse side swaps storage and reference columns.
- `MappingEntityDefinition` adds no default `created_at`/`updated_at` fields, and its `getEntityClass()`/`getCollectionClass()` throw - mapping entities have no own entity/collection class. The source's mapping snippet imports `CreatedAtField` without using it.
- `ManyToManyAssociationField` also accepts optional `sourceColumn` and `referenceField` (both default `'id'`).

## Code check (6.7.15.1)
- confirmed `EntityDefinition::getEntityName()` — abstract — vendor/shopware/core/Framework/DataAbstractionLayer/EntityDefinition.php:143
- confirmed `EntityDefinition::defineFields()` — abstract protected — vendor/shopware/core/Framework/DataAbstractionLayer/EntityDefinition.php:476
- confirmed `OneToOneAssociationField::__construct()` — `autoload` defaults to `true` — vendor/shopware/core/Framework/DataAbstractionLayer/Field/OneToOneAssociationField.php:17
- confirmed `OneToManyAssociationField::__construct()` — `(propertyName, referenceClass, referenceField, localField = 'id')` — vendor/shopware/core/Framework/DataAbstractionLayer/Field/OneToManyAssociationField.php:15
- confirmed `ManyToOneAssociationField::__construct()` — `referenceField = 'id'`, `autoload = false` — vendor/shopware/core/Framework/DataAbstractionLayer/Field/ManyToOneAssociationField.php:17
- confirmed `ManyToManyAssociationField::__construct()` — five required args plus `sourceColumn`/`referenceField` defaults — vendor/shopware/core/Framework/DataAbstractionLayer/Field/ManyToManyAssociationField.php:17
- confirmed `FkField::__construct()` — `(storageName, propertyName, referenceClass, referenceField = 'id')` — vendor/shopware/core/Framework/DataAbstractionLayer/Field/FkField.php:21
- confirmed `MappingEntityDefinition` — abstract, extends `EntityDefinition` — vendor/shopware/core/Framework/DataAbstractionLayer/MappingEntityDefinition.php:9
- confirmed `MappingEntityDefinition::getEntityClass()` — throws `MappingEntityClassesException` — vendor/shopware/core/Framework/DataAbstractionLayer/MappingEntityDefinition.php:16
- confirmed `MappingEntityDefinition::defaultFields()` — returns no default fields — vendor/shopware/core/Framework/DataAbstractionLayer/MappingEntityDefinition.php:26
