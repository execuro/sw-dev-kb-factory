---
id: platform/dev/6.6/guides/plugins/plugins/framework/data-handling/using-flags.md
title: Using flags
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/framework/data-handling/using-flags.html
sourceHash: a12d9d73ffb758667a5d790d6ac4711f9c7decce
keywords: ["flags", "DAL flags", "PrimaryKey", "Required", "addFlags", "setFlags", "IdField", "FieldCollection", "EntityDefinition", "defineFields", "field flags"]
summary: "Shows how to attach DAL field flags (e.g. PrimaryKey, Required) via addFlags/setFlags on entity definition fields."
lastBuilt: "2026-09-15"
---
## What it is
Covers how to apply flags to fields in an entity definition using the DAL, without explaining every flag's purpose.

## When to use
Use when defining or modifying an `EntityDefinition`'s fields and need to mark a field with a behavior flag (e.g. primary key, required) or override default flags via an entity extension.

## Key steps / config
- Add a single flag: `(new IdField('id', 'id'))->addFlags(new PrimaryKey())`.
- Add multiple flags (comma separated): `(new IdField('id', 'id'))->addFlags(new PrimaryKey(), new Required())`.
- Overwrite existing default flags with `setFlags`: `(new IdField('id', 'id'))->setFlags(new Required())`.
- Example definition:
```php
class ExampleDefinition extends EntityDefinition
{
    public const ENTITY_NAME = 'swag_example';

    protected function defineFields(): FieldCollection
    {
        return new FieldCollection([
            (new IdField('id', 'id'))->addFlags(new Required(), new PrimaryKey()),
            (new StringField('name', 'name')),
            ...
        ]);
    }
}
```

## Essential identifiers
- `addFlags()`, `setFlags()`
- `PrimaryKey`, `Required`
- `IdField`, `FieldCollection`, `EntityDefinition::defineFields()`

## Gotchas
- `setFlags` overwrites the field's existing default flags entirely — be careful not to remove flags essential to that field type.
