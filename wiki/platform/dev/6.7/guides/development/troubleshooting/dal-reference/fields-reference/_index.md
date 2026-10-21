---
id: platform/dev/6.7/guides/development/troubleshooting/dal-reference/fields-reference/_index.md
title: Fields Reference
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/development/troubleshooting/dal-reference/fields-reference/
sourceHash: 717d3d6af49c87657a6d1c128ae10fef71e18608
codeCheckedAgainst: "6.7.15.1"
keywords: ["dal fields", "field types", "StorageAware", "JsonField", "FkField", "AssociationField", "StringField", "IntField", "TranslatedField", "EnumField", "entity definition columns", "field inheritance"]
summary: Table of DAL field classes grouped by parent class (Field, JsonField, FkField, AssociationField...) and whether each directly implements StorageAware.
lastBuilt: 2026-10-21
relatedPages:
  - platform/dev/6.7/guides/development/troubleshooting/dal-reference/fields-reference/enum-field.md
---
## What it is

A lookup table of the field classes in `Shopware\Core\Framework\DataAbstractionLayer\Field` that an `EntityDefinition` uses to declare its columns and associations: what each stores, which class it extends, and whether it implements `StorageAware` (maps to a real storage column) itself.

## When to use

When choosing the field class for a new entity property, or when working out which serializer/storage behaviour a subclass inherits from its parent.

## Key steps / config

Base class: abstract `Field` (extends `Struct`). Grouped by parent; `(SA)` = directly implements `StorageAware`.

- **Extend `Field`, StorageAware (SA):** `BlobField` (blob), `BoolField`, `CronIntervalField`, `DateField`, `DateIntervalField`, `DateTimeField`, [`EnumField`](platform/dev/6.7/guides/development/troubleshooting/dal-reference/fields-reference/enum-field.md), `FkField`, `FloatField`, `IdField`, `IntField`, `JsonField`, `LongTextField`, `PasswordField`, `RemoteAddressField`, `SerializedField`, `StringField`.
- **Extend `Field`, not StorageAware:** abstract `AssociationField`, `TranslatedField`.
- **Extend `JsonField` (store JSON):** `BreadcrumbField`, `CalculatedPriceField`, `CartPriceField`, `CashRoundingConfigField`, `ConfigJsonField`, `ListField`, `ObjectField`, `PriceDefinitionField`, `PriceField`, `TaxFreeConfigField`, `TreeBreadcrumbField`, `VariantListingConfigField`, `VersionDataPayloadField`.
- **Extend `ListField`:** `ManyToManyIdField`.
- **Extend `FkField` (foreign keys):** `CreatedByField`, `ParentFkField`, `ReferenceVersionField`, `StateMachineStateField`, `UpdatedByField`, `VersionField`.
- **Extend `IntField`:** `AutoIncrementField`, `ChildCountField`, `TreeLevelField`.
- **Extend `DateTimeField`:** `CreatedAtField`, `UpdatedAtField`.
- **Extend `StringField`:** `EmailField`, `TimeZoneField`.
- **Extend `BoolField`:** `LockedField` (boolean lock flag).
- **Extend `LongTextField`:** `TreePathField`.
- **Extend `AssociationField`:** `ManyToManyAssociationField`, `ManyToOneAssociationField`, `OneToManyAssociationField`, `OneToOneAssociationField`.
- **Extend `OneToManyAssociationField`:** `ChildrenAssociationField`, `TranslationsAssociationField`.
- **Extend `ManyToOneAssociationField`:** `ParentAssociationField`.

## Essential identifiers

- `Field`, `StorageAware`, `AssociationField`, `JsonField`, `FkField`, `IntField`, `StringField`, `TranslatedField`, `EnumField`
- `OneToManyAssociationField`, `ManyToOneAssociationField`, `ManyToManyAssociationField`, `OneToOneAssociationField`

## Gotchas

- The source's empty StorageAware column means "not declared on the class itself": subclasses of `JsonField`, `FkField`, `IntField` etc. are still `StorageAware` through their parent.
- The installed core has field classes the table omits: `CustomFields` and `WasModifiedByUserField`.

## Code check (6.7.15.1)
- confirmed `Field` — abstract base extends Struct — vendor/shopware/core/Framework/DataAbstractionLayer/Field/Field.php:18
- confirmed `AssociationField` — abstract, extends Field, no StorageAware — vendor/shopware/core/Framework/DataAbstractionLayer/Field/AssociationField.php:10
- confirmed `JsonField` — extends Field implements StorageAware — vendor/shopware/core/Framework/DataAbstractionLayer/Field/JsonField.php:13
- confirmed `FkField` — extends Field implements StorageAware — vendor/shopware/core/Framework/DataAbstractionLayer/Field/FkField.php:11
- confirmed `EnumField` — extends Field implements StorageAware — vendor/shopware/core/Framework/DataAbstractionLayer/Field/EnumField.php:14
- confirmed `ManyToManyIdField` — extends ListField — vendor/shopware/core/Framework/DataAbstractionLayer/Field/ManyToManyIdField.php:9
- confirmed `TreePathField` — extends LongTextField — vendor/shopware/core/Framework/DataAbstractionLayer/Field/TreePathField.php:10
- confirmed `ParentAssociationField` — extends ManyToOneAssociationField — vendor/shopware/core/Framework/DataAbstractionLayer/Field/ParentAssociationField.php:8
- confirmed `TranslatedField` — extends Field, no StorageAware — vendor/shopware/core/Framework/DataAbstractionLayer/Field/TranslatedField.php:11
- confirmed `WasModifiedByUserField` — extends BoolField, missing from docs table — vendor/shopware/core/Framework/DataAbstractionLayer/Field/WasModifiedByUserField.php:9
