---
id: platform/dev/6.7/guides/plugins/plugins/framework/data-handling/add-data-associations.md
title: Adding Data Associations
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/framework/data-handling/add-data-associations.html
sourceHash: 5692b1f59ccafd7466c1709d5c42c11ff4e65efc
codeCheckedAgainst: "6.7.13.0"
keywords: ["OneToOneAssociationField", "ManyToOneAssociationField", "OneToManyAssociationField", "ManyToManyAssociationField", "FkField", "MappingEntityDefinition", "EntityDefinition", "defineFields", "entity association", "foreign key", "mapping table", "dal relations", "autoload"]
summary: How to define OneToOne, ManyToOne/OneToMany and ManyToMany DAL associations with FkField, association fields and a MappingEntityDefinition.
lastBuilt: 2026-09-15
---
## What it is

Guide to wiring associations between two custom DAL entities (`FooDefinition` / `BarDefinition`, each only an `IdField`) inside `defineFields()`: One to One, One to Many / Many to One, and Many to Many via a third mapping definition. Entity creation itself is covered by the "Adding custom complex data" guide.

## When to use

You have (or are adding) custom entity definitions in a plugin and need them to reference each other through foreign keys or a mapping table.

## Key steps / config

Base definitions extend `Shopware\Core\Framework\DataAbstractionLayer\EntityDefinition` and must declare both abstract members:

```php
class BarDefinition extends EntityDefinition
{
    public const ENTITY_NAME = 'bar';
    public function getEntityName(): string { return self::ENTITY_NAME; }
    protected function defineFields(): FieldCollection
    {
        return new FieldCollection([
            (new IdField('id', 'id'))->addFlags(new Required(), new PrimaryKey()),
        ]);
    }
}
```

**One to One** — one side holds the FK column (here `foo_id` in `bar`):

- Bar: `(new FkField('foo_id', 'fooId', FooDefinition::class))->addFlags(new Required())` and `new OneToOneAssociationField('foo', 'foo_id', 'id', FooDefinition::class, false)`
- Foo (no `FkField`): `new OneToOneAssociationField('bar', 'id', 'foo_id', BarDefinition::class, false)`
- `OneToOneAssociationField` args: property name, storage (column) name, reference field, reference definition class, `autoload`.
- `FkField` args: storage name (snake_case), property name (lowerCamelCase), reference definition class, optional reference field (default `'id'`).

**One to Many / Many to One** — FK column lives on the "many" side (`bar_id` in `foo`):

- Bar: `new OneToManyAssociationField('foos', FooDefinition::class, 'bar_id')` (property, reference class, FK column in referenced table; optional local field defaults to `'id'`).
- Foo: `(new FkField('bar_id', 'barId', BarDefinition::class))->addFlags(new Required())` and `new ManyToOneAssociationField('bar', 'bar_id', BarDefinition::class, 'id')` (property, storage name, reference class, reference field, optional `autoload`).

**Many to Many** — needs a mapping entity with its own table:

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

Then in each main definition add `new ManyToManyAssociationField(propertyName, referenceDefinition, mappingDefinition, mappingLocalColumn, mappingReferenceColumn)`:

- Bar: `new ManyToManyAssociationField('foos', FooDefinition::class, FooBarMappingDefinition::class, 'bar_id', 'foo_id')`
- Foo: `new ManyToManyAssociationField('bars', BarDefinition::class, FooBarMappingDefinition::class, 'foo_id', 'bar_id')`

## Essential identifiers

- `Shopware\Core\Framework\DataAbstractionLayer\EntityDefinition`
- `Shopware\Core\Framework\DataAbstractionLayer\MappingEntityDefinition`
- `Shopware\Core\Framework\DataAbstractionLayer\Field\FkField`
- `Shopware\Core\Framework\DataAbstractionLayer\Field\ManyToOneAssociationField`
- `OneToOneAssociationField`, `OneToManyAssociationField`, `ManyToManyAssociationField`
- `IdField`, `StringField`, `Flag\Required`, `Flag\PrimaryKey`, `FieldCollection`

## Gotchas

- Setting autoload to `true` on both the `EntityExtension` and the `EntityDefinition` side leads to recursion / out-of-memory. If the association must always load, set autoload `true` only in the `EntityExtension`.
- `OneToOneAssociationField`'s `autoload` parameter defaults to `true` in the installed code; the docs' examples pass `false` explicitly — omit it and the association autoloads.
- `ManyToOneAssociationField` `autoload` defaults to `false`; enabling it can cost performance.
- The mapping definition extends `MappingEntityDefinition`, not `EntityDefinition`, and uses the two FKs as composite primary key.

## Code check (6.7.13.0)
- confirmed `EntityDefinition::getEntityName()` — abstract, must be implemented — vendor/shopware/core/Framework/DataAbstractionLayer/EntityDefinition.php:130
- confirmed `EntityDefinition::defineFields()` — abstract protected, returns FieldCollection — vendor/shopware/core/Framework/DataAbstractionLayer/EntityDefinition.php:458
- confirmed `MappingEntityDefinition` — abstract, extends EntityDefinition — vendor/shopware/core/Framework/DataAbstractionLayer/MappingEntityDefinition.php:9
- confirmed `FkField::__construct()` — storageName, propertyName, referenceClass, referenceField = 'id' — vendor/shopware/core/Framework/DataAbstractionLayer/Field/FkField.php:21
- confirmed `OneToOneAssociationField::__construct()` — propertyName, storageName, referenceField, referenceClass, autoload — vendor/shopware/core/Framework/DataAbstractionLayer/Field/OneToOneAssociationField.php:14
- confirmed `OneToOneAssociationField::$autoload` — default true (docs pass false explicitly) — vendor/shopware/core/Framework/DataAbstractionLayer/Field/OneToOneAssociationField.php:19
- confirmed `OneToManyAssociationField::__construct()` — propertyName, referenceClass, referenceField, localField = 'id' — vendor/shopware/core/Framework/DataAbstractionLayer/Field/OneToManyAssociationField.php:12
- confirmed `ManyToOneAssociationField::__construct()` — referenceField = 'id', autoload = false — vendor/shopware/core/Framework/DataAbstractionLayer/Field/ManyToOneAssociationField.php:14
- confirmed `ManyToManyAssociationField::__construct()` — propertyName, toManyDefinitionClass, mappingDefinition, mappingLocalColumn, mappingReferenceColumn — vendor/shopware/core/Framework/DataAbstractionLayer/Field/ManyToManyAssociationField.php:17
- unverified `EntityExtension` autoload recursion — runtime behaviour, not checked statically
