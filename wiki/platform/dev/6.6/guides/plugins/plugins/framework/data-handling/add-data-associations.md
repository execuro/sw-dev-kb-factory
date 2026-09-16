---
id: platform/dev/6.6/guides/plugins/plugins/framework/data-handling/add-data-associations.md
title: Adding data associations
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/framework/data-handling/add-data-associations.html
sourceHash: 7f7221d3ab5b81a1a6f52d35a6ff76909f055569
keywords: ["OneToOneAssociationField", "OneToManyAssociationField", "ManyToOneAssociationField", "ManyToManyAssociationField", "FkField", "MappingEntityDefinition", "autoload", "foreign key", "association", "DataAbstractionLayer", "defineFields"]
summary: "How to define One-to-One, One-to-Many/Many-to-One and Many-to-Many associations between DAL entity definitions."
lastBuilt: "2026-09-15"
---
## What it is

Guide covering how to declare each kind of DAL association (One to One, One to Many / Many to One, Many to Many) between two example entities, `FooEntity` and `BarEntity`.

## When to use

When two custom entities (or a custom entity and an existing one) need a relational link, and the appropriate association field must be chosen and configured.

## Key steps / config

**One to One:** the owning side needs an `FkField` plus a `OneToOneAssociationField(propertyName, storageColumn, referenceColumn, referenceDefinitionClass, autoload)`:

```php
(new FkField('foo_id', 'fooId', FooDefinition::class))->addFlags(new Required()),
new OneToOneAssociationField('foo', 'foo_id', 'id', FooDefinition::class, false)
```

The inverse side only needs `new OneToOneAssociationField('bar', 'id', 'foo_id', BarDefinition::class, false)` — no `FkField`.

**One to Many / Many to One:** the "many" side needs an `FkField` and a `ManyToOneAssociationField(propertyName, storageColumn, referenceClass, referenceColumn)`; the "one" side needs `new OneToManyAssociationField('foos', FooDefinition::class, 'bar_id')`.

**Many to Many:** requires a third `MappingEntityDefinition` with two `FkField`s (each flagged `PrimaryKey`, `Required`) and two `ManyToOneAssociationField`s, plus a `ManyToManyAssociationField(propertyName, referenceDefinition, mappingDefinition, mappingLocalColumn, mappingReferenceColumn)` added to each of the two main definitions.

## Essential identifiers

- `Shopware\Core\Framework\DataAbstractionLayer\Field\OneToOneAssociationField`
- `Shopware\Core\Framework\DataAbstractionLayer\Field\OneToManyAssociationField`
- `Shopware\Core\Framework\DataAbstractionLayer\Field\ManyToOneAssociationField`
- `Shopware\Core\Framework\DataAbstractionLayer\Field\ManyToManyAssociationField`
- `Shopware\Core\Framework\DataAbstractionLayer\Field\FkField`
- `Shopware\Core\Framework\DataAbstractionLayer\MappingEntityDefinition`

## Gotchas

Setting `autoload` to `true` on both the `EntityExtension` and `EntityDefinition` for the same association causes recursion / out-of-memory errors; set it to `true` only in the `EntityExtension` if it must always auto-load. `autoload` defaults to `false` for `ManyToOneAssociationField` and `ManyToManyAssociationField` because enabling it can cause performance issues.
