---
id: platform/dev/6.7/guides/plugins/plugins/framework/data-handling/entities-via-attributes.md
title: Entities via Attributes
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/framework/data-handling/entities-via-attributes.html
sourceHash: 32f34373f372fd2436ed352d0296558208604313
codeCheckedAgainst: "6.7.15.1"
keywords: ["attribute entity", "php attributes", "EntityAttribute", "shopware.entity", "FieldType", "PrimaryKey", "ForeignKey", "Translations", "EntityCustomFieldsTrait", "OnDelete", "collectionClass", "entity without definition", "AttributeEntityCompiler"]
summary: "DAL entities via PHP attributes (tag shopware.entity): Field/FieldType, translations, API exposure, associations, custom fields."
lastBuilt: 2026-10-21
---
## What it is

Since Shopware 6.6.3.0 a DAL entity can be declared as a single class extending `Entity` and annotated with PHP attributes from `Shopware\Core\Framework\DataAbstractionLayer\Attribute\*`. Shopware compiles it into an `EntityDefinition`, an `EntityRepository` and (if needed) a translation definition, so no separate definition, translation definition, collection or getters/setters are required.

## When to use

You want a new custom entity with minimal boilerplate and public properties instead of the classic `EntityDefinition` + `Entity` + `EntityCollection` triple.

## Key steps / config

1. **Class + attribute.** Extend `Shopware\Core\Framework\DataAbstractionLayer\Entity` and add `#[EntityAttribute('example_entity')]` (alias for `Attribute\Entity`). `name` is required and unique. Further constructor params in 6.7.15.1: `parent`, `since`, `collectionClass` (default `EntityCollection`, since 6.6.9.0), `hydratorClass`, `inheritanceAware`.
2. **Primary key.** Mark one property `#[PrimaryKey]` plus `#[Field(type: FieldType::UUID)]` (UUID recommended).
3. **Register** in `services.php`:

```php
$services->set(Examples\ExampleEntity::class)
    ->tag('shopware.entity');
```

   This creates `example_entity.definition` and `example_entity.repository` (plus `example_entity_translation.definition`/`.repository` when translated fields exist).
4. **Fields.** `#[Field(type: ..., translated: false, api: false, column: null, maxLength: 255)]`. `type` is a `FieldType` constant (`UUID`, `STRING`, `TEXT`, `INT`, `FLOAT`, `BOOL`, `ENUM`, `JSON`, `DATETIME`, `DATE`, `DATE_INTERVAL`, `TIME_ZONE`, `EMAIL`, `PRICE`) or, since 6.6.9.0, the FQCN of any `\Shopware\Core\Framework\DataAbstractionLayer\Field\Field` subclass, e.g. `type: PriceField::class`. `column:` overrides the column name.
5. **Special attributes:** `#[AutoIncrement]`, `#[ForeignKey(entity: 'currency')]`, `#[Serialized(serializer: PriceFieldSerializer::class)]` for JSON with own serializer, `#[CustomFields]` on `?array $customFields` or `use EntityCustomFieldsTrait;`.
6. **API exposure.** Fields are not exposed by default. `api: true` exposes everywhere; to restrict, the compiler reads the keys `admin-api`/`store-api`:

```php
#[Field(type: FieldType::STRING, api: ['admin-api' => true, 'store-api' => false])]
public string $adminOnly;
```

7. **Translations.** `translated: true` creates a `TranslatedField` and a translation definition; such properties must be nullable. Add `#[Translations] public ?array $translations = null;` to load all translations via the `translations` association. Use `#[Required]` to make a nullable translated field mandatory (non-nullable fields are required by default).
8. **Associations:** `#[ManyToOne(entity: 'currency')]`, `#[OneToOne(entity: 'currency')]`, `#[OneToMany(entity: 'example_entity_agg', ref: 'example_entity_id')]`, `#[ManyToMany(entity: 'currency')]`, each with optional `onDelete: OnDelete::CASCADE|SET_NULL|RESTRICT|NO_ACTION`. ToMany properties are nullable arrays keyed by the associated id (or typed as `EntityCollection`); ToOne properties are nullable entities next to a `#[ForeignKey]` property.

## Essential identifiers

- `Shopware\Core\Framework\DataAbstractionLayer\Attribute\Entity` (used as `EntityAttribute`)
- `Shopware\Core\Framework\DataAbstractionLayer\Attribute\Field`, `FieldType`, `PrimaryKey`, `Required`, `AutoIncrement`, `ForeignKey`, `Serialized`, `CustomFields`, `Translations`
- `ManyToOne`, `OneToOne`, `OneToMany`, `ManyToMany`, `OnDelete`
- `Shopware\Core\Framework\DataAbstractionLayer\EntityCustomFieldsTrait`
- DI tag `shopware.entity`; generated services `<name>.definition`, `<name>.repository`

## Gotchas

- The guide's scoped-API example `api: [AdminApiSource::class]` does not restrict anything in 6.7.15.1: the compiler only checks the `admin-api`/`store-api` keys, so a list of source classes yields an unrestricted `ApiAware` flag.
- Translated properties must be nullable; combine with `#[Required]` if a value is mandatory.
- The guide's full example uses the `Shopware\Core\Framework\DataAbstractionLayer\Attribute\State` attribute (`machine: OrderStates::STATE_MACHINE`) for a state-machine FK; the code-check index flags it as deprecated, so avoid relying on it.

## Version notes

- 6.6.3.0: attribute entities introduced.
- 6.6.9.0: `collectionClass` parameter and field-class FQCNs as `type`.

## Code check (6.7.15.1)
- deprecated `Shopware\Core\Framework\DataAbstractionLayer\Attribute\State` — flagged deprecated by the code index; the attribute class itself still exists and is compiled — vendor/shopware/core/Framework/DataAbstractionLayer/Attribute/State.php:10
- confirmed `Entity::__construct()` — name, parent, since, collectionClass, hydratorClass, inheritanceAware — vendor/shopware/core/Framework/DataAbstractionLayer/Attribute/Entity.php:24
- confirmed `Field::__construct()` — type, translated, api, column, maxLength = 255 — vendor/shopware/core/Framework/DataAbstractionLayer/Attribute/Field.php:23
- corrected `api` — docs: api: [AdminApiSource::class] restricts scope; code reads only 'admin-api'/'store-api' keys — vendor/shopware/core/Framework/DataAbstractionLayer/AttributeEntityCompiler.php:377
- confirmed `shopware.entity` — tag processed by AttributeEntityCompilerPass — vendor/shopware/core/Framework/DependencyInjection/CompilerPass/AttributeEntityCompilerPass.php:33
- confirmed `.definition` — registered as <entity>.definition — vendor/shopware/core/Framework/DependencyInjection/CompilerPass/AttributeEntityCompilerPass.php:66
- confirmed `.repository` — registered as <entity>.repository — vendor/shopware/core/Framework/DependencyInjection/CompilerPass/AttributeEntityCompilerPass.php:91
- confirmed `FieldType::UUID` — FieldType constants incl. ENUM, EMAIL, PRICE — vendor/shopware/core/Framework/DataAbstractionLayer/Attribute/FieldType.php:10
- confirmed `OnDelete` — enum CASCADE, SET_NULL, RESTRICT, NO_ACTION — vendor/shopware/core/Framework/DataAbstractionLayer/Attribute/OnDelete.php:8
- confirmed `OneToMany::$ref` — required ref parameter — vendor/shopware/core/Framework/DataAbstractionLayer/Attribute/OneToMany.php:15
