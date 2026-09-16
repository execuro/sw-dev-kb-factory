---
id: platform/dev/6.6/guides/plugins/plugins/framework/data-handling/entities-via-attributes.md
title: Entities via attributes
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/framework/data-handling/entities-via-attributes.html
sourceHash: c5240e6c1add62e36e6f8cf5aeb18e3a89ae3975
keywords: ["entities via attributes", "Entity attribute", "PrimaryKey attribute", "Field attribute", "FieldType", "shopware.entity tag", "EntityCollection", "EntityCustomFieldsTrait", "CustomFields attribute", "Translations attribute", "Required attribute", "ManyToMany", "OneToOne", "ForeignKey attribute", "Serialized attribute"]
summary: "Defines Shopware entities via PHP attributes (Entity, PrimaryKey, Field, associations) instead of EntityDefinition classes, available since 6.6.3.0."
lastBuilt: "2026-09-15"
---
## What it is
Since Shopware v6.6.3.0, entities can be registered via PHP attributes on a class extending `Entity`, instead of writing an `EntityDefinition`. The `#[Entity]` attribute (aliased `Attribute\Entity as EntityAttribute`) names the entity; a property gets `#[PrimaryKey]` and `#[Field(type: ...)]`.

## When to use
Use this when adding a new custom entity in a plugin and want to skip the boilerplate of a full `EntityDefinition`/`EntityCollection`/`EntityTranslationDefinition` class trio.

## Key steps / config
1. Create a class extending `Shopware\Core\Framework\DataAbstractionLayer\Entity`, add `#[EntityAttribute('example_entity', collectionClass: ExampleEntityCollection::class)]` (the `collectionClass` param and `since` param require 6.6.9.0+).
2. Add `#[PrimaryKey]` + `#[Field(type: FieldType::UUID)]` to the id property.
3. Add more `#[Field(type: FieldType::...)]` properties; types come from the `FieldType` constants class, or a field class FQCN directly (e.g. `#[Field(type: PriceField::class)]`).
4. Register the class in `services.xml` with the `shopware.entity` tag:
```xml
<service id="Shopware\Tests\...\ExampleEntity">
    <tag name="shopware.entity"/>
</service>
```
This auto-registers an `EntityDefinition` and `EntityRepository`.
5. Special field attributes: `AutoIncrement`, `ForeignKey(entity: 'currency')`, `Serialized(serializer: PriceFieldSerializer::class)`, `CustomFields`, `Translations`, `Required`.
6. Associations use `OneToOne`, `OneToMany`, `ManyToOne`, `ManyToMany` attributes, e.g. `#[ManyToOne(entity: 'currency')]`.
7. `translated: true` on `Field` auto-creates a `TranslatedField`/`EntityTranslationDefinition`; such properties must be nullable.
8. `api: true` (or an array of API source classes like `AdminApiSource::class`/`SalesChannelApiSource::class`) on `Field` exposes it via the API; otherwise fields are not exposed.

## Essential identifiers
- `Shopware\Core\Framework\DataAbstractionLayer\Attribute\Entity` (aliased `EntityAttribute`)
- `PrimaryKey`, `Field`, `FieldType`, `AutoIncrement`, `ForeignKey`, `Serialized`, `CustomFields`, `Translations`, `Required`
- `OneToOne`, `OneToMany`, `ManyToOne`, `ManyToMany`
- `EntityCustomFieldsTrait`
- `shopware.entity` service tag
- `Shopware\Core\Framework\DataAbstractionLayer\Field\Field` (base class for direct field-class typing)

## Gotchas
- `collectionClass`/`since` parameters on `#[EntityAttribute]` and direct field-class typing require 6.6.9.0+.
- Fields not type-hinted nullable are required by default; `translated` fields must be nullable, use `#[Required]` to force validation on them.
- Getters/setters are not needed — properties are public and directly accessible.
