---
id: platform/dev/6.7/guides/plugins/plugins/framework/data-handling/add-custom-complex-data.md
title: Adding Custom Complex Data
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/framework/data-handling/add-custom-complex-data.html
sourceHash: b62c5ac5c431957a53210725d64e7ba5f557de03
codeCheckedAgainst: "6.7.15.1"
relatedPages:
  - platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md
  - platform/dev/6.7/guides/plugins/plugins/database/database-migrations.md
  - platform/dev/6.7/guides/plugins/plugins/services/dependency-injection.md
  - platform/dev/6.7/guides/plugins/plugins/services/add-custom-service.md
keywords: ["EntityDefinition", "defineFields", "getEntityName", "FieldCollection", "EntityCollection", "EntityIdTrait", "shopware.entity.definition", "swag_example.repository", "MigrationStep", "custom entity", "custom table", "dal entity definition"]
summary: "Custom DAL entity for a plugin table: migration, EntityDefinition fields, Entity/EntityCollection classes, shopware.entity.definition tag."
lastBuilt: 2026-10-21
---
## What it is

How a plugin maps its own database table to a custom Data Abstraction Layer (DAL) entity, so it gets a repository and is usable for CRUD through the API without hand-written data handling.

## When to use

Your plugin stores data in its own table (e.g. `swag_example`) and you want to read/write it via a DAL repository.

## Key steps / config

### 1. Table via migration

Prefix table names with your vendor/manufacturer name. `Swag\BasicExample\Migration\Migration1611664789Example` extends `Shopware\Core\Framework\Migration\MigrationStep`:

```php
class Migration1611664789Example extends MigrationStep
{
    public function getCreationTimestamp(): int { return 1611664789; }

    public function update(Connection $connection): void
    {
        // CREATE TABLE IF NOT EXISTS `swag_example` (`id` BINARY(16) NOT NULL, `name`, `description`,
        // `active`, `created_at` DATETIME(3) NOT NULL, `updated_at` DATETIME(3), PRIMARY KEY (`id`)) ...
        $connection->executeStatement($sql);
    }
}
```

The table appears after reinstalling the plugin.

### 2. EntityDefinition

`<plugin root>/src/Core/Content/Example/ExampleDefinition.php`, extending `Shopware\Core\Framework\DataAbstractionLayer\EntityDefinition`, which requires `getEntityName()` and `defineFields()`:

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
            (new StringField('description', 'description')),
            (new BoolField('active', 'active')),
        ]);
    }
}
```

- `getEntityName()` must equal the table name; it also names the repository service `<name>.repository`.
- Field constructors take storage name (snake_case) first, then property name (lowerCamelCase).
- `created_at`/`updated_at` need no field definition; they are added by default.

### 3. Register the definition

```php
$services->set(ExampleDefinition::class)
    ->tag('shopware.entity.definition', ['entity' => 'swag_example']);
```

The `swag_example.repository` service can then be injected.

### 4. Entity and collection classes (recommended)

- `ExampleEntity extends Shopware\Core\Framework\DataAbstractionLayer\Entity`, `use EntityIdTrait;`, with `protected` properties and getters/setters per field. Wire it via `ExampleDefinition::getEntityClass()` returning `ExampleEntity::class`.
- `ExampleCollection extends Shopware\Core\Framework\DataAbstractionLayer\EntityCollection` (docblock `@extends EntityCollection<ExampleEntity>`), overriding `getExpectedClass()` to return `ExampleEntity::class`. Wire it via `ExampleDefinition::getCollectionClass()`.

## Essential identifiers

- `Shopware\Core\Framework\DataAbstractionLayer\EntityDefinition` (`getEntityName()`, `defineFields()`, `getEntityClass()`, `getCollectionClass()`)
- `Shopware\Core\Framework\DataAbstractionLayer\FieldCollection`
- `Shopware\Core\Framework\DataAbstractionLayer\Field\IdField`, `...\Field\StringField`, `...\Field\BoolField`, flags `Required`, `PrimaryKey`
- `Shopware\Core\Framework\DataAbstractionLayer\Entity`, `EntityIdTrait`, `EntityCollection`
- `shopware.entity.definition`, `swag_example.repository`

## Gotchas

- Entity class properties must be at least `protected` and not `readonly`, otherwise the DAL cannot set values; this applies to every class extending `Struct`.
- Without custom classes, `getEntityClass()` falls back to `ArrayEntity` and `getCollectionClass()` to the generic `EntityCollection`.
- The repository id is derived from `getEntityName()`, not from the tag's `entity` attribute; keep both identical anyway.
- With autoconfiguration enabled, `EntityDefinition` subclasses are tagged `shopware.entity.definition` automatically.

## Code check (6.7.15.1)
- confirmed `EntityDefinition::getEntityName()` — abstract — vendor/shopware/core/Framework/DataAbstractionLayer/EntityDefinition.php:143
- confirmed `EntityDefinition::defineFields()` — abstract protected, returns `FieldCollection` — vendor/shopware/core/Framework/DataAbstractionLayer/EntityDefinition.php:476
- confirmed `EntityDefinition::getEntityClass()` — defaults to `ArrayEntity::class` — vendor/shopware/core/Framework/DataAbstractionLayer/EntityDefinition.php:293
- confirmed `EntityDefinition::getCollectionClass()` — defaults to `EntityCollection::class` — vendor/shopware/core/Framework/DataAbstractionLayer/EntityDefinition.php:285
- confirmed `EntityDefinition::defaultFields()` — adds `CreatedAtField`/`UpdatedAtField` — vendor/shopware/core/Framework/DataAbstractionLayer/EntityDefinition.php:468
- confirmed `EntityCollection::getExpectedClass()` — protected, overridable — vendor/shopware/core/Framework/DataAbstractionLayer/EntityCollection.php:252
- confirmed `MigrationStep::getCreationTimestamp()` — abstract — vendor/shopware/core/Framework/Migration/MigrationStep.php:28
- confirmed `MigrationStep::update()` — abstract — vendor/shopware/core/Framework/Migration/MigrationStep.php:33
- confirmed `shopware.entity.definition` — tag collected by the entity compiler pass — vendor/shopware/core/Framework/DependencyInjection/CompilerPass/EntityCompilerPass.php:40
- confirmed `.repository` — repository id built from `getEntityName()` — vendor/shopware/core/Framework/DependencyInjection/CompilerPass/EntityCompilerPass.php:68
