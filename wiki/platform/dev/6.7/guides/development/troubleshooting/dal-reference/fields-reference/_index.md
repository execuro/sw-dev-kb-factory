---
codeCheckedAgainst: "6.7.13.0"
docType: developer
id: platform/dev/6.7/guides/development/troubleshooting/dal-reference/fields-reference/_index.md
sourceHash: 717d3d6af49c87657a6d1c128ae10fef71e18608
sourceUrl: https://developer.shopware.com/docs/guides/development/troubleshooting/dal-reference/fields-reference/
title: Fields Reference
version: "6.7"
versions:
  - "6.7"
keywords: ["dal fields", "field types", "entity definition fields", "StorageAware", "Field", "JsonField", "FkField", "AssociationField", "StringField", "IntField", "EnumField", "TranslatedField", "OneToManyAssociationField", "column types"]
summary: "All DAL field classes with their parent class and whether they implement StorageAware directly (JsonField, FkField, AssociationField families, etc.)."
lastBuilt: 2026-09-15
relatedPages:
  - platform/dev/6.7/guides/development/troubleshooting/dal-reference/fields-reference/enum-field.md
---
## What it is

Lookup table of the Data Abstraction Layer field classes used in entity definitions: what each stores, which class it extends, and whether it implements `StorageAware` itself (i.e. maps directly to a storage column). All live in `Shopware\Core\Framework\DataAbstractionLayer\Field`.

## When to use

When choosing a field type for an `EntityDefinition`, or when you need to know which base class a field inherits behaviour (serializer, storage) from.

## Key steps / config

Base: `Field` (abstract, extends `Struct`). `AssociationField` (abstract) extends `Field`.

Extend `Field` and implement `StorageAware` directly (store a column value):

`BlobField`, `BoolField`, `CronIntervalField`, `DateField`, `DateIntervalField`, `DateTimeField`, `EnumField` (see [EnumField](platform/dev/6.7/guides/development/troubleshooting/dal-reference/fields-reference/enum-field.md)), `FkField`, `FloatField`, `IdField`, `IntField`, `JsonField`, `LongTextField`, `PasswordField`, `RemoteAddressField`, `SerializedField`, `StringField`.

Extend `Field` without implementing `StorageAware` directly: `TranslatedField`, `AssociationField`.

Subclasses (inherit storage from their parent where it has it):

| Parent | Subclasses |
|---|---|
| `JsonField` (JSON value) | `BreadcrumbField`, `CalculatedPriceField`, `CartPriceField`, `CashRoundingConfigField`, `ConfigJsonField`, `ListField`, `ObjectField`, `PriceDefinitionField`, `PriceField`, `TaxFreeConfigField`, `TreeBreadcrumbField`, `VariantListingConfigField`, `VersionDataPayloadField` |
| `ListField` | `ManyToManyIdField` |
| `FkField` (foreign key) | `CreatedByField`, `UpdatedByField`, `ParentFkField`, `ReferenceVersionField`, `StateMachineStateField`, `VersionField` |
| `IntField` | `AutoIncrementField`, `ChildCountField`, `TreeLevelField` |
| `DateTimeField` | `CreatedAtField`, `UpdatedAtField` |
| `StringField` | `EmailField`, `TimeZoneField` |
| `BoolField` | `LockedField` |
| `LongTextField` | `TreePathField` |
| `AssociationField` | `ManyToManyAssociationField`, `ManyToOneAssociationField`, `OneToManyAssociationField`, `OneToOneAssociationField` |
| `OneToManyAssociationField` | `ChildrenAssociationField`, `TranslationsAssociationField` |
| `ManyToOneAssociationField` | `ParentAssociationField` |

## Essential identifiers

- `Field`, `StorageAware`, `AssociationField`, `JsonField`, `FkField`, `IntField`, `StringField`, `BoolField`, `DateTimeField`, `LongTextField`, `EnumField`, `TranslatedField`
- Association fields: `ManyToOneAssociationField`, `OneToManyAssociationField`, `ManyToManyAssociationField`, `OneToOneAssociationField`

## Gotchas

- The installed 6.7.13.0 code also has `WasModifiedByUserField` (extends `BoolField`), which the docs table does not list.
- `Field` and `AssociationField` are abstract; use a concrete subclass in definitions.

## Code check (6.7.13.0)
- confirmed `Field` — abstract class extending Struct — vendor/shopware/core/Framework/DataAbstractionLayer/Field/Field.php:17
- confirmed `AssociationField` — abstract, extends Field — vendor/shopware/core/Framework/DataAbstractionLayer/Field/AssociationField.php:10
- confirmed `JsonField` — extends Field implements StorageAware — vendor/shopware/core/Framework/DataAbstractionLayer/Field/JsonField.php:10
- confirmed `EnumField` — extends Field implements StorageAware — vendor/shopware/core/Framework/DataAbstractionLayer/Field/EnumField.php:14
- confirmed `ListField` — extends JsonField — vendor/shopware/core/Framework/DataAbstractionLayer/Field/ListField.php:28
- confirmed `ManyToManyIdField` — extends ListField — vendor/shopware/core/Framework/DataAbstractionLayer/Field/ManyToManyIdField.php:9
- confirmed `TreePathField` — extends LongTextField — vendor/shopware/core/Framework/DataAbstractionLayer/Field/TreePathField.php:10
- confirmed `ParentAssociationField` — extends ManyToOneAssociationField — vendor/shopware/core/Framework/DataAbstractionLayer/Field/ParentAssociationField.php:8
- confirmed `TranslatedField` — extends Field, no StorageAware — vendor/shopware/core/Framework/DataAbstractionLayer/Field/TranslatedField.php:11
- confirmed `WasModifiedByUserField` — extends BoolField, missing from docs table — vendor/shopware/core/Framework/DataAbstractionLayer/Field/WasModifiedByUserField.php:9
