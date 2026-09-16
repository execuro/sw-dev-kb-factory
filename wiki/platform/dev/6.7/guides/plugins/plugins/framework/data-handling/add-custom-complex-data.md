---
id: platform/dev/6.7/guides/plugins/plugins/framework/data-handling/add-custom-complex-data.md
title: Adding Custom Complex Data
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/framework/data-handling/add-custom-complex-data.html
sourceHash: b62c5ac5c431957a53210725d64e7ba5f557de03
codeCheckedAgainst: "6.7.13.0"
keywords: ["custom entity", "EntityDefinition", "getEntityName", "defineFields", "FieldCollection", "shopware.entity.definition", "EntityCollection", "getEntityClass", "getCollectionClass", "EntityIdTrait", "MigrationStep", "swag_example.repository", "custom table", "dal entity"]
summary: Create a plugin DAL entity - migration table, EntityDefinition registered via shopware.entity.definition, custom Entity and EntityCollection classes.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/database/database-migrations.md", "platform/dev/6.7/guides/plugins/plugins/services/dependency-injection.md", "platform/dev/6.7/guides/plugins/plugins/services/add-custom-service.md", "platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md"]
---
## What it is

How to store plugin data in a custom database table and expose it through the Data Abstraction Layer (DAL): a migration creates the table, an `EntityDefinition` maps it, and optional custom `Entity` / `EntityCollection` classes replace the generic ones. Once registered, the entity is available via its repository and the API for CRUD.

## When to use

Your plugin needs its own table (e.g. `swag_example`) handled by the DAL instead of raw SQL.

## Key steps / config

### 1. Table via migration

Prefix table names with your vendor (e.g. `swag_`). In `src/Migration/Migration1611664789Example.php` extend `Shopware\Core\Framework\Migration\MigrationStep`:

```php
class Migration1611664789Example extends MigrationStep
{
    public function getCreationTimestamp(): int { return 1611664789; }

    public function update(Connection $connection): void
    {
        $connection->executeStatement('CREATE TABLE IF NOT EXISTS `swag_example` (
            `id` BINARY(16) NOT NULL, `name` VARCHAR(255), `description` VARCHAR(255),
            `active` TINYINT(1), `created_at` DATETIME(3) NOT NULL, `updated_at` DATETIME(3),
            PRIMARY KEY (`id`)) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;');
    }
}
```

Reinstall the plugin to run it.

### 2. EntityDefinition

`src/Core/Content/Example/ExampleDefinition.php`, extending `Shopware\Core\Framework\DataAbstractionLayer\EntityDefinition`; `getEntityName()` and `defineFields()` are required:

```php
class ExampleDefinition extends EntityDefinition
{
    public const ENTITY_NAME = 'swag_example';
    public function getEntityName(): string { return self::ENTITY_NAME; }
    public function getEntityClass(): string { return ExampleEntity::class; }
    public function getCollectionClass(): string { return ExampleCollection::class; }
    protected function defineFields(): FieldCollection
    {
        return new FieldCollection([
            (new IdField('id', 'id'))->addFlags(new Required(), new PrimaryKey()),
            new StringField('name', 'name'),
            new StringField('description', 'description'),
            new BoolField('active', 'active'),
        ]);
    }
}
```

- `getEntityName()` = table name and repository id `<name>.repository` (here `swag_example.repository`).
- `created_at` / `updated_at` need no field definitions; they are added by default.
- Field constructors take `storageName` (snake_case) then `propertyName` (lowerCamelCase). `addFlags()` attaches flags such as `Required`, `PrimaryKey`.

Register in `services.php`:

```php
$services->set(ExampleDefinition::class)
    ->tag('shopware.entity.definition', ['entity' => 'swag_example']);
```

### 3. Entity class (recommended)

`ExampleEntity extends Shopware\Core\Framework\DataAbstractionLayer\Entity`, `use EntityIdTrait;`, with `protected` properties (`?string $name`, `?string $description`, `bool $active`) and getters/setters. Wire it via `getEntityClass()`; otherwise reads return generic `ArrayEntity`.

### 4. EntityCollection (recommended)

```php
/** @extends EntityCollection<ExampleEntity> */
class ExampleCollection extends EntityCollection
{
    protected function getExpectedClass(): string { return ExampleEntity::class; }
}
```

Wire it via `getCollectionClass()`; otherwise the generic `EntityCollection` is used.

## Essential identifiers

- `Shopware\Core\Framework\DataAbstractionLayer\EntityDefinition` — `getEntityName()`, `defineFields()`, `getEntityClass()`, `getCollectionClass()`
- `Shopware\Core\Framework\DataAbstractionLayer\FieldCollection`, `IdField`, `StringField`, `BoolField`, `Required`, `PrimaryKey`
- `shopware.entity.definition` tag, `swag_example.repository`
- `Shopware\Core\Framework\DataAbstractionLayer\Entity`, `EntityIdTrait`
- `Shopware\Core\Framework\DataAbstractionLayer\EntityCollection::getExpectedClass()`
- `Shopware\Core\Framework\Migration\MigrationStep`

## Gotchas

- The entity name must match the table name exactly.
- Entity (and any `Struct`) properties must be at least `protected` and must not be `readonly`, or the DAL cannot set values.
- The tag's `entity` attribute should hold the same technical name as `getEntityName()`.

## Code check (6.7.13.0)
- confirmed `EntityDefinition::getEntityName()` — abstract, required — vendor/shopware/core/Framework/DataAbstractionLayer/EntityDefinition.php:130
- confirmed `EntityDefinition::defineFields()` — abstract, required — vendor/shopware/core/Framework/DataAbstractionLayer/EntityDefinition.php:458
- confirmed `EntityDefinition::getEntityClass()` — defaults to ArrayEntity — vendor/shopware/core/Framework/DataAbstractionLayer/EntityDefinition.php:275
- confirmed `EntityDefinition::getCollectionClass()` — defaults to EntityCollection — vendor/shopware/core/Framework/DataAbstractionLayer/EntityDefinition.php:267
- confirmed `EntityDefinition::defaultFields()` — adds CreatedAtField and UpdatedAtField — vendor/shopware/core/Framework/DataAbstractionLayer/EntityDefinition.php:450
- confirmed `EntityCollection::getExpectedClass()` — protected, overridable — vendor/shopware/core/Framework/DataAbstractionLayer/EntityCollection.php:252
- confirmed `EntityIdTrait` — trait exists — vendor/shopware/core/Framework/DataAbstractionLayer/EntityIdTrait.php:9
- confirmed `shopware.entity.definition` — tag collected by entity compiler pass — vendor/shopware/core/Framework/DependencyInjection/CompilerPass/EntityCompilerPass.php:39
- confirmed `$repositoryId` — repository service id built as getEntityName() + '.repository' — vendor/shopware/core/Framework/DependencyInjection/CompilerPass/EntityCompilerPass.php:67
- confirmed `MigrationStep::update()` — abstract, with getCreationTimestamp() — vendor/shopware/core/Framework/Migration/MigrationStep.php:33
