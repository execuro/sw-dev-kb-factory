---
id: platform/dev/6.7/guides/plugins/plugins/framework/data-handling/entities-via-attributes.md
title: Entities via Attributes
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/framework/data-handling/entities-via-attributes.html
sourceHash: 32f34373f372fd2436ed352d0296558208604313
codeCheckedAgainst: "6.7.13.0"
keywords: ["Shopware\\Core\\Framework\\DataAbstractionLayer\\Attribute\\Entity", "FieldType", "PrimaryKey", "ForeignKey", "Serialized", "Translations", "CustomFields", "EntityCustomFieldsTrait", "OnDelete", "shopware.entity", "attribute entity", "php attributes dal", "entity without definition", "collectionClass"]
summary: Define DAL entities with PHP attributes (Entity, Field, FieldType, PrimaryKey, associations); shopware.entity tag auto-registers definition and repository.
lastBuilt: 2026-09-15
---
## What it is

Since Shopware 6.6.3.0 a DAL entity can be declared as a single PHP class extending `Shopware\Core\Framework\DataAbstractionLayer\Entity` and annotated with attributes from `Shopware\Core\Framework\DataAbstractionLayer\Attribute\*`. Shopware generates the `EntityDefinition`, repository, and (for translated fields) translation definition — no getters/setters, separate definition, `EntityTranslationDefinition` or mandatory `EntityCollection` class.

## When to use

Creating new custom entities in a plugin with minimal boilerplate, instead of hand-written `EntityDefinition` + entity + collection classes.

## Key steps / config

1. Class extends `Entity`, carries `#[EntityAttribute('example_entity')]` (`use ...\Attribute\Entity as EntityAttribute`). Constructor params: `name` (required, unique), `parent`, `since`, `collectionClass` (default `EntityCollection::class`, since 6.6.9.0), `hydratorClass`, `inheritanceAware`.
2. Declare a primary key property with `#[PrimaryKey]` (UUID recommended).
3. Register in `services.php`: `$services->set(Examples\ExampleEntity::class)->tag('shopware.entity');` (with autoconfiguration, classes carrying the `Entity` attribute get the tag automatically). This registers `example_entity.definition` and `example_entity.repository` (plus `example_entity_translation.*` when translated fields exist).

```php
#[EntityAttribute('example_entity', collectionClass: ExampleEntityCollection::class)]
class ExampleEntity extends Entity
{
    use EntityCustomFieldsTrait;
    #[PrimaryKey]
    #[Field(type: FieldType::UUID, api: true)]
    public string $id;
    #[Field(type: FieldType::STRING, translated: true)]
    public ?string $name = null;
    #[ForeignKey(entity: 'currency')]
    public ?string $currencyId = null;
    #[ManyToOne(entity: 'currency', onDelete: OnDelete::RESTRICT)]
    public ?CurrencyEntity $currency = null;
    #[Translations]
    public ?array $translations = null;
}
```

### Fields

- `#[Field(type: ..., translated: false, api: false, column: null, maxLength: 255)]`. `type` is a `FieldType` constant: `UUID`, `STRING`, `TEXT`, `INT`, `FLOAT`, `BOOL`, `JSON`, `DATETIME`, `DATE`, `DATE_INTERVAL`, `TIME_ZONE` — or (since 6.6.9.0) the FQCN of any class extending `\Shopware\Core\Framework\DataAbstractionLayer\Field\Field`, e.g. `PriceField::class`.
- Special attributes: `#[AutoIncrement]`, `#[ForeignKey(entity: 'currency')]`.
- JSON with own serializer: `#[Serialized(serializer: PriceFieldSerializer::class, api: true)]`.
- Custom fields: `use EntityCustomFieldsTrait;` or `#[CustomFields] public ?array $customFields = null;`.
- API exposure: fields are hidden by default; `api: true` or a scope list such as `api: [AdminApiSource::class]` / `[SalesChannelApiSource::class]`.
- Translations: `translated: true` creates a `TranslatedField` and translation definition; `#[Translations]` on a nullable array loads all translations when the `translations` association is added to the criteria.
- Required: non-nullable properties are required; `#[Required]` adds validation explicitly (needed for translated fields, which must be nullable).

### Associations

`#[OneToOne(entity:, column:, onDelete:, ref: 'id', api:)]`, `#[ManyToOne(entity:, onDelete:, ref: 'id', api:, column:)]`, `#[OneToMany(entity:, ref:, onDelete:, api:)]` (`ref` required), `#[ManyToMany(entity:, onDelete:, api:, mapping:)]`. `onDelete` takes the `OnDelete` enum (default `NO_ACTION`; e.g. `RESTRICT`, `SET_NULL`, `CASCADE`). To-many properties are nullable arrays keyed by associated entity id, or typed as `EntityCollection`.

## Essential identifiers

- `Shopware\Core\Framework\DataAbstractionLayer\Entity`
- `Shopware\Core\Framework\DataAbstractionLayer\Attribute\Entity`, `Field`, `FieldType`, `PrimaryKey`, `Required`
- `AutoIncrement`, `ForeignKey`, `Serialized`, `CustomFields`, `Translations`, `OnDelete`
- `OneToOne`, `ManyToOne`, `OneToMany`, `ManyToMany`
- `Shopware\Core\Framework\DataAbstractionLayer\EntityCustomFieldsTrait`
- DI tag `shopware.entity`; services `<name>.definition`, `<name>.repository`

## Gotchas

- Properties with `translated: true` must be nullable; combine with `#[Required]` to enforce a value.
- `#[Translations]` properties must be nullable — not loaded by default.
- The docs' full example uses a `#[State(machine: OrderStates::STATE_MACHINE)]` attribute (`Shopware\Core\Framework\DataAbstractionLayer\Attribute\State`); the installed code index flags this class as deprecated — avoid it in new entities.

## Version notes

- 6.6.3.0: attribute entities introduced.
- 6.6.9.0: `collectionClass` parameter and field-class FQCNs as `type`.

## Code check (6.7.13.0)
- deprecated `Shopware\Core\Framework\DataAbstractionLayer\Attribute\State` — flagged deprecated in the code index; avoid — vendor/shopware/core/Framework/DataAbstractionLayer/Attribute/State.php:10
- confirmed `Entity::$collectionClass` — defaults to EntityCollection::class — vendor/shopware/core/Framework/DataAbstractionLayer/Attribute/Entity.php:28
- confirmed `Field::__construct()` — type, translated, api, column, maxLength — vendor/shopware/core/Framework/DataAbstractionLayer/Attribute/Field.php:21
- confirmed `FieldType::DATE_INTERVAL` — constant 'date-interval' — vendor/shopware/core/Framework/DataAbstractionLayer/Attribute/FieldType.php:20
- confirmed `ForeignKey::$entity` — required param — vendor/shopware/core/Framework/DataAbstractionLayer/Attribute/ForeignKey.php:16
- confirmed `OneToMany::$ref` — required, no default — vendor/shopware/core/Framework/DataAbstractionLayer/Attribute/OneToMany.php:15
- confirmed `ManyToMany::$mapping` — optional mapping param — vendor/shopware/core/Framework/DataAbstractionLayer/Attribute/ManyToMany.php:17
- confirmed `Serialized::$serializer` — serializer class param — vendor/shopware/core/Framework/DataAbstractionLayer/Attribute/Serialized.php:25
- confirmed `shopware.entity` — added for classes with the Entity attribute — vendor/shopware/core/Framework/DependencyInjection/CompilerPass/AutoconfigureCompilerPass.php:53
- confirmed `.repository` — `<entity>.repository` service registered — vendor/shopware/core/Framework/DependencyInjection/CompilerPass/AttributeEntityCompilerPass.php:91
