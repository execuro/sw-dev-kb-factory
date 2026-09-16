---
id: platform/dev/6.7/products/extensions/b2b-suite-migration/concept/_index.md
title: Concept
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-suite-migration/concept/
sourceHash: 513293764d57e3d25bfab101397ed3eae1544fb8
codeCheckedAgainst: "6.7.13.0"
keywords: ["b2b suite migration", "b2b commercial", "migration concept", "message queue", "sequential migration", "entity sequencing", "xml configuration", "mapping tables", "error log", "data integrity"]
summary: B2B Suite to B2B Commercial migration concept - message queue processing, three tracking tables, XML field mappings and sequential component order.
lastBuilt: 2026-09-15
---
## What it is

The concept behind migrating data from the B2B Suite to B2B Commercial. The process is built for large datasets while keeping data integrity: it uses three dedicated tables to track status, map records and log errors, runs in a message queue, and migrates components and entities in dependency order.

## When to use

Read before executing or customizing a B2B Suite migration, especially when the dataset is large or when custom entities depend on employees, budgets or quotes.

## Key steps / config

- Message queue: the whole migration is executed in a message queue, so large volumes of data are processed scalably.
- XML configuration: all mapping fields and tables are defined in XML configuration files, processed by a configurator. This modular approach is the extension point for customizing the migration.
- Sequential migration: components (for example Employee, Budget, Quote, Shopping List) are migrated one after another to respect entity relationships — employee records before budgets, employees before quotes.
- Entity-level sequencing: within each component, entities (for example business partners, employees, roles) are migrated in the correct order.
- Tracking: three dedicated tables track the migration status, the mapping between source and target records, and errors.

## Gotchas

- Proper sequencing is critical to avoid dependency issues; verify the migration order for your dataset before running it.

## Code check (6.7.13.0)
- unverified `B2B Suite migration configurator` — part of the Shopware Commercial extension, not in vendor/shopware core, storefront or administration
- unverified `migration tracking tables` — table names are not given by the source and are defined in the Commercial extension, out of scope
