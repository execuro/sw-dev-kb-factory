---
id: platform/dev/6.7/guides/plugins/plugins/framework/data-handling/_index.md
title: Data Handling / Data Abstraction Layer
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/framework/data-handling/
sourceHash: 47ac5a5e066530b1f0ca002ebad2951f1bdbc615
codeCheckedAgainst: "6.7.15.1"
relatedPages:
  - platform/dev/6.7/guides/plugins/plugins/database/database-migrations.md
  - platform/dev/6.7/guides/plugins/plugins/framework/data-handling/add-custom-complex-data.md
  - platform/dev/6.7/guides/plugins/plugins/framework/data-handling/reading-data.md
  - platform/dev/6.7/guides/plugins/plugins/framework/data-handling/writing-data.md
keywords: ["DAL", "data abstraction layer", "data handling", "EntityDefinition", "EntityRepository", "MigrationStep", "shopware.entity.definition", "repository", "criteria", "custom entity", "database migration", "entity events"]
summary: Entry point for plugin data handling with the DAL - which guide to use for migrations, custom entities, reading, writing and database events.
lastBuilt: 2026-10-21
---
## What it is

Index of the plugin guides on the Data Abstraction Layer (DAL), Shopware's layer for defining entities and reading/writing them through repositories.

## When to use

You need to store, read or write plugin data, or react to entity changes, and want to know which guide to start with.

## Key steps / config

Pick the guide matching the task:

- Create or change plugin database tables: [Database migrations](platform/dev/6.7/guides/plugins/plugins/database/database-migrations.md)
- Map a plugin table to a custom DAL entity: [Adding Custom Complex Data](platform/dev/6.7/guides/plugins/plugins/framework/data-handling/add-custom-complex-data.md)
- Read data through repositories and criteria: [Reading Data](platform/dev/6.7/guides/plugins/plugins/framework/data-handling/reading-data.md)
- Write data through repositories: [Writing Data](platform/dev/6.7/guides/plugins/plugins/framework/data-handling/writing-data.md)
- React to DAL write or entity events: [Using Database Events](platform/dev/6.7/guides/plugins/plugins/framework/data-handling/using-database-events.md)

Order for custom plugin data: first create the table with a migration (a `Shopware\Core\Framework\Migration\MigrationStep` subclass), then add the `EntityDefinition` that maps to it. Each registered definition gets a `<entity_name>.repository` service.

## Essential identifiers

- `Shopware\Core\Framework\Migration\MigrationStep`
- `Shopware\Core\Framework\DataAbstractionLayer\EntityDefinition`
- `Shopware\Core\Framework\DataAbstractionLayer\EntityRepository`
- `shopware.entity.definition` (service tag)

## Code check (6.7.15.1)
- confirmed `MigrationStep::update()` — abstract, required in every migration — vendor/shopware/core/Framework/Migration/MigrationStep.php:33
- confirmed `EntityDefinition::getEntityName()` — abstract, defines the entity/table name — vendor/shopware/core/Framework/DataAbstractionLayer/EntityDefinition.php:143
- confirmed `shopware.entity.definition` — tag collected to register definitions — vendor/shopware/core/Framework/DependencyInjection/CompilerPass/EntityCompilerPass.php:40
- confirmed `.repository` — repository service id is `getEntityName() . '.repository'` — vendor/shopware/core/Framework/DependencyInjection/CompilerPass/EntityCompilerPass.php:68
