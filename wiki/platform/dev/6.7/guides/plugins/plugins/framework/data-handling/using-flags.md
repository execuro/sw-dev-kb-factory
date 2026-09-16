---
codeCheckedAgainst: "6.7.13.0"
docType: developer
id: platform/dev/6.7/guides/plugins/plugins/framework/data-handling/using-flags.md
sourceHash: 8a7c16009493e4d67b6eb1c8aa50d85bb8c69a21
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/framework/data-handling/using-flags.html
title: Using Flags
version: "6.7"
versions:
  - "6.7"
keywords: ["dal flags", "field flags", "addFlags", "setFlags", "PrimaryKey", "Required", "ApiAware", "IdField", "StringField", "EntityDefinition", "defineFields", "entity definition field options"]
summary: "Attach DAL field flags in an EntityDefinition with addFlags() (one or many) or replace defaults with setFlags(); example with PrimaryKey and Required."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/development/troubleshooting/dal-reference/flags-reference.md", "platform/dev/6.7/guides/plugins/plugins/framework/data-handling/add-custom-complex-data.md", "platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md"]
---
## What it is

How to attach Data Abstraction Layer (DAL) flags to fields in an entity definition. The page does not explain individual flags — see the [flags reference](platform/dev/6.7/guides/development/troubleshooting/dal-reference/flags-reference.md); for entity basics see [Adding custom complex data](platform/dev/6.7/guides/plugins/plugins/framework/data-handling/add-custom-complex-data.md).

## When to use

You define fields in a custom `EntityDefinition` (or modify a field's flags through an entity extension) and need flags such as `PrimaryKey` or `Required`.

## Key steps / config

- **Single flag:** `(new IdField('id', 'id'))->addFlags(new PrimaryKey())`
- **Multiple flags** (comma separated, variadic): `(new IdField('id', 'id'))->addFlags(new PrimaryKey(), new Required())`
- **Replace the field's current flags:** `(new IdField('id', 'id'))->setFlags(new Required())` — removes flags already set, so do not drop flags the field needs.

Example definition (`<plugin root>/src/Core/Content/Example/ExampleDefinition.php`):

```php
class ExampleDefinition extends EntityDefinition
{
    public const ENTITY_NAME = 'swag_example';

    public function getEntityName(): string { return self::ENTITY_NAME; }

    protected function defineFields(): FieldCollection
    {
        return new FieldCollection([
            (new IdField('id', 'id'))->addFlags(new Required(), new PrimaryKey()),
            new StringField('name', 'name'),
            new BoolField('active', 'active'),
        ]);
    }
}
```

Imports: `Shopware\Core\Framework\DataAbstractionLayer\EntityDefinition`, `Shopware\Core\Framework\DataAbstractionLayer\FieldCollection`, plus the field and flag classes (flags in `Shopware\Core\Framework\DataAbstractionLayer\Field\Flag\`).

## Essential identifiers

- `Field::addFlags(Flag ...$flags)`, `Field::setFlags(Flag ...$flags)`
- `PrimaryKey`, `Required` (namespace `...\Field\Flag`)
- `EntityDefinition::getEntityName()`, `EntityDefinition::defineFields()` — both abstract, must be implemented

## Gotchas

- `setFlags()` clears all existing flags, then re-adds `ApiAware(AdminApiSource::class)` automatically if you did not pass an `ApiAware` flag — the field stays exposed to the Admin API.
- Flags are keyed by class: adding the same flag class twice keeps only the last instance.

## Version notes

- In the installed code `addFlags()`/`setFlags()` carry a `@deprecated tag:v6.8.0 - reason:return-type-change` note: they will return `static` natively in 6.8; call usage is unchanged.

## Code check (6.7.13.0)
- confirmed `EntityDefinition::getEntityName()` — abstract, required — vendor/shopware/core/Framework/DataAbstractionLayer/EntityDefinition.php:130
- confirmed `EntityDefinition::defineFields()` — abstract protected, required — vendor/shopware/core/Framework/DataAbstractionLayer/EntityDefinition.php:458
- confirmed `PrimaryKey` — flag class — vendor/shopware/core/Framework/DataAbstractionLayer/Field/Flag/PrimaryKey.php:8
- confirmed `Required` — flag class — vendor/shopware/core/Framework/DataAbstractionLayer/Field/Flag/Required.php:8
- confirmed `IdField` — field class — vendor/shopware/core/Framework/DataAbstractionLayer/Field/IdField.php:9
- confirmed `ApiAware` — setFlags re-adds it when missing — vendor/shopware/core/Framework/DataAbstractionLayer/Field/Field.php:66
