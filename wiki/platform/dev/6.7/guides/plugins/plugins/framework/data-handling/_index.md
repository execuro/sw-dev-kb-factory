---
id: platform/dev/6.7/guides/plugins/plugins/framework/data-handling/_index.md
title: Data Handling / Data Abstraction Layer
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/framework/data-handling/
sourceHash: 47ac5a5e066530b1f0ca002ebad2951f1bdbc615
codeCheckedAgainst: "6.7.13.0"
keywords: ["data abstraction layer", "DAL", "data handling", "EntityDefinition", "EntityRepository", "MigrationStep", "shopware.entity.definition", "migration", "custom entity", "reading data", "writing data", "database events", "EntityWrittenEvent"]
summary: Entry point for plugin DAL guides - migrations first, then a custom entity definition, then reading, writing and reacting to database events.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/database/database-migrations.md", "platform/dev/6.7/guides/plugins/plugins/framework/data-handling/add-custom-complex-data.md", "platform/dev/6.7/guides/plugins/plugins/framework/data-handling/reading-data.md", "platform/dev/6.7/guides/plugins/plugins/framework/data-handling/writing-data.md"]
---
## What it is

Landing page for the plugin guides on data handling via Shopware's Data Abstraction Layer (DAL). It routes you to the right guide for the data task at hand and states the order in which custom plugin data is set up.

## When to use

You are starting any plugin work that touches the database or DAL entities and need to know which guide to open first.

## Key steps / config

For custom plugin data, create the database table first with a migration, then add the DAL entity definition that maps to that table:

1. Create or change database tables — a migration class extending `Shopware\Core\Framework\Migration\MigrationStep` (implements `getCreationTimestamp()` and `update()`): [Database migrations](platform/dev/6.7/guides/plugins/plugins/database/database-migrations.md).
2. Add a custom DAL entity for that table — an `EntityDefinition` subclass (implements `getEntityName()` and `defineFields()`) registered with the `shopware.entity.definition` tag: [Adding Custom Complex Data](platform/dev/6.7/guides/plugins/plugins/framework/data-handling/add-custom-complex-data.md).
3. Read data through repositories and criteria (`EntityRepository::search()`): [Reading Data](platform/dev/6.7/guides/plugins/plugins/framework/data-handling/reading-data.md).
4. Write data through repositories (`create()`, `update()`, `upsert()`, `delete()`): [Writing Data](platform/dev/6.7/guides/plugins/plugins/framework/data-handling/writing-data.md).
5. React to DAL write or entity events (e.g. `<entity>.written`, `<entity>.deleted`): [Using Database Events](platform/dev/6.7/guides/plugins/plugins/framework/data-handling/using-database-events.md).

## Essential identifiers

- `MigrationStep`
- `EntityDefinition`, tag `shopware.entity.definition`
- `EntityRepository` (service id `<entity_name>.repository`)
- `EntityWrittenEvent`, `EntityDeletedEvent`

## Code check (6.7.13.0)
- confirmed `MigrationStep` — abstract base for migrations — vendor/shopware/core/Framework/Migration/MigrationStep.php:17
- confirmed `MigrationStep::getCreationTimestamp()` — abstract — vendor/shopware/core/Framework/Migration/MigrationStep.php:28
- confirmed `MigrationStep::update()` — abstract — vendor/shopware/core/Framework/Migration/MigrationStep.php:33
- confirmed `EntityDefinition::getEntityName()` — abstract — vendor/shopware/core/Framework/DataAbstractionLayer/EntityDefinition.php:130
- confirmed `EntityDefinition::defineFields()` — abstract — vendor/shopware/core/Framework/DataAbstractionLayer/EntityDefinition.php:458
- confirmed `shopware.entity.definition` — tag collected by the entity compiler pass — vendor/shopware/core/Framework/DependencyInjection/CompilerPass/EntityCompilerPass.php:39
- confirmed `EntityRepository::search()` — reads with Criteria — vendor/shopware/core/Framework/DataAbstractionLayer/EntityRepository.php:62
- confirmed `EntityRepository::upsert()` — write method — vendor/shopware/core/Framework/DataAbstractionLayer/EntityRepository.php:113
- confirmed `EntityWrittenEvent` — event class; name is entity name + '.written' — vendor/shopware/core/Framework/DataAbstractionLayer/Event/EntityWrittenEvent.php:18
- confirmed `EntityDeletedEvent` — event class; name is entity name + '.deleted' — vendor/shopware/core/Framework/DataAbstractionLayer/Event/EntityDeletedEvent.php:15
