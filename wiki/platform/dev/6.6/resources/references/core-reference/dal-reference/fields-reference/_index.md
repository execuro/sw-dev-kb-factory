---
id: platform/dev/6.6/resources/references/core-reference/dal-reference/fields-reference/_index.md
title: Fields Reference
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/resources/references/core-reference/dal-reference/fields-reference/
sourceHash: 84c38e6cd5cfb8f1df51cd9869a1e84471205c10
keywords: ["Field", "IdField", "StringField", "IntField", "JsonField", "AssociationField", "FkField", "DAL fields", "StorageAware", "EnumField", "TranslatedField"]
summary: "Reference table of DAL Field subclasses, what each stores, its parent class, and whether it is storage-aware."
lastBuilt: "2026-09-15"
---

## What it is
Reference table of the DAL (Data Abstraction Layer) field classes available in Shopware, listing what each field stores, which class it extends, and whether it is storage-aware.

## When to use
Consult this table when defining an entity definition and choosing which `Field` subclass to use for a given column/property.

## Key steps / config
Selected fields (Name — Description — Extends — StorageAware):

| Name | Description | Extends | StorageAware |
|---|---|---|---|
| `IdField` | Stores an id value | `Field` | x |
| `StringField` | Stores a string value | `Field` | x |
| `IntField` | Stores an int value | `Field` | x |
| `BoolField` | Stores a bool value | `Field` | x |
| `FloatField` | Stores a float value | `Field` | x |
| `DateTimeField` | Stores a datetime value | `Field` | x |
| `JsonField` | Stores a json value | `Field` | x |
| `FkField` | Stores a fk value | `Field` | x |
| `AssociationField` | Stores an association value | `Field` | |
| `OneToManyAssociationField` | Stores an association value | `AssociationField` | |
| `ManyToOneAssociationField` | Stores an association value | `AssociationField` | |
| `ManyToManyAssociationField` | Stores an association value | `AssociationField` | |
| `TranslatedField` | Stores a translated value | `Field` | |
| `PriceField` / `CalculatedPriceField` | Stores a JSON value | `JsonField` | |
| `AutoIncrementField` | Stores an integer value | `IntField` | |
| `EnumField` | Stores an enum value | `Field` | x |
| `CreatedAtField` / `UpdatedAtField` | Stores a DateTime value | `DateTimeField` | |
| `CreatedByField` / `UpdatedByField` | Stores a foreign key value | `FkField` | |
| `LongTextField` | Stores a longtext value | `Field` | x |
| `ListField` | Stores a JSON value | `JsonField` | |
| `TreePathField` | Stores a treepath value | `LongTextField` | |
| `VersionField` | Stores a foreign key value | `FkField` | |

## Essential identifiers
`Field`, `IdField`, `StringField`, `IntField`, `BoolField`, `FloatField`, `DateTimeField`, `JsonField`, `FkField`, `AssociationField`, `OneToManyAssociationField`, `ManyToOneAssociationField`, `ManyToManyAssociationField`, `TranslatedField`, `EnumField`

## Gotchas
`StorageAware` fields (marked `x`) persist a value to the database column directly; association fields (`AssociationField` and its subclasses `OneToManyAssociationField`, `ManyToOneAssociationField`, `ManyToManyAssociationField`, `ParentAssociationField`, `ChildrenAssociationField`) and `TranslatedField` are not storage-aware — they compute or load their value instead of reading it from a column.
