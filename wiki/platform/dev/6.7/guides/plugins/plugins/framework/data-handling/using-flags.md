---
id: platform/dev/6.7/guides/plugins/plugins/framework/data-handling/using-flags.md
title: Using Flags
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/framework/data-handling/using-flags.html
sourceHash: 8a7c16009493e4d67b6eb1c8aa50d85bb8c69a21
codeCheckedAgainst: "6.7.15.1"
keywords: ["addFlags", "setFlags", "PrimaryKey", "Required", "ApiAware", "EntityDefinition", "IdField", "FieldCollection", "defineFields", "field flags", "dal flags", "entity definition"]
summary: Adding DAL field flags in an EntityDefinition with addFlags() (one or many) and replacing default flags with setFlags(), e.g. PrimaryKey, Required.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/development/troubleshooting/dal-reference/flags-reference.md", "platform/dev/6.7/guides/plugins/plugins/framework/data-handling/add-custom-complex-data.md", "platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md"]
---
## What it is

How to attach Data Abstraction Layer flags to fields in an entity definition. It does not explain what each flag does — see the [Flags reference](platform/dev/6.7/guides/development/troubleshooting/dal-reference/flags-reference.md). Entity basics are in [Adding custom complex data](platform/dev/6.7/guides/plugins/plugins/framework/data-handling/add-custom-complex-data.md).

## When to use

Defining fields in your own `EntityDefinition::defineFields()`, or modifying a field's flags through an entity extension.

## Key steps / config

- One flag: `(new IdField('id', 'id'))->addFlags(new PrimaryKey())`
- Several flags, comma separated: `(new IdField('id', 'id'))->addFlags(new PrimaryKey(), new Required())`
- Replace the field's default flags: `(new IdField('id', 'id'))->setFlags(new Required())`

Example definition:

```php
class ExampleDefinition extends EntityDefinition
{
    public const ENTITY_NAME = 'swag_example';

    public function getEntityName(): string { return self::ENTITY_NAME; }

    protected function defineFields(): FieldCollection
    {
        return new FieldCollection([
            (new IdField('id', 'id'))->addFlags(new Required(), new PrimaryKey()),
            (new StringField('name', 'name')),
            (new BoolField('active', 'active')),
        ]);
    }
}
```

## Essential identifiers

- `Shopware\Core\Framework\DataAbstractionLayer\EntityDefinition`, `Shopware\Core\Framework\DataAbstractionLayer\FieldCollection`
- `Field::addFlags()`, `Field::setFlags()`
- Flag classes `PrimaryKey`, `Required` (namespace `Shopware\Core\Framework\DataAbstractionLayer\Field\Flag`)

## Gotchas

- `setFlags()` discards the field's existing flags — do not drop flags the field needs.
- `setFlags()` re-adds an `ApiAware` flag (admin API source) when none is passed.
- Flags are stored per flag class; adding the same flag class twice keeps only the last instance.

## Version notes

- `addFlags()`/`setFlags()` are annotated to narrow their return type to `static` in v6.8.0.

## Code check (6.7.15.1)
- confirmed `EntityDefinition::getEntityName()` — abstract, required in subclasses — vendor/shopware/core/Framework/DataAbstractionLayer/EntityDefinition.php:143
- confirmed `EntityDefinition::defineFields()` — abstract protected, returns `FieldCollection` — vendor/shopware/core/Framework/DataAbstractionLayer/EntityDefinition.php:476
- confirmed `Field::addFlags()` — variadic `Flag`, keyed by flag class — vendor/shopware/core/Framework/DataAbstractionLayer/Field/Field.php:76
- confirmed `Field::setFlags()` — resets flags, re-adds `ApiAware` if missing — vendor/shopware/core/Framework/DataAbstractionLayer/Field/Field.php:59
- confirmed `PrimaryKey` — flag class — vendor/shopware/core/Framework/DataAbstractionLayer/Field/Flag/PrimaryKey.php:8
- confirmed `Required` — flag class — vendor/shopware/core/Framework/DataAbstractionLayer/Field/Flag/Required.php:8
