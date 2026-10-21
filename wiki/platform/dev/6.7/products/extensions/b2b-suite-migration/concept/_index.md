---
id: platform/dev/6.7/products/extensions/b2b-suite-migration/concept/_index.md
title: Concept
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-suite-migration/concept/
sourceHash: 513293764d57e3d25bfab101397ed3eae1544fb8
codeCheckedAgainst: "6.7.15.1"
keywords: ["b2b suite migration", "migration concept", "message queue", "sequential migration", "entity sequencing", "xml configuration", "configurator", "migration tables", "b2b components", "employee", "budget", "quote", "shopping list"]
summary: B2B Suite to B2B Components migration concept - message-queue processing, XML-defined field/table mappings, sequential component and entity order.
lastBuilt: 2026-10-21
---
## What it is

The design of the B2B Suite to B2B Components migration: how it processes large datasets while keeping data integrity, using three tracking tables, a message queue and a fixed migration order.

## When to use

Before executing or extending the B2B Suite migration, to understand ordering, mapping configuration and how progress/errors are tracked.

## Key steps / config

- **Message queue** — the whole migration runs as queued messages, so large data volumes are processed scalably.
- **XML mapping** — all mapped fields and tables are defined in XML configuration files, processed by a configurator; this modular setup is what allows customising or extending the migration.
- **Sequential migration by component** — components such as Employee, Budget, Quote and Shopping List are migrated one after another so that dependencies exist first (e.g. employee records before budgets, employees before quotes).
- **Entity-level sequencing** — inside each component, entities (e.g. business partners, employees, roles) are migrated in dependency order.
- **Tracking tables** — three dedicated tables track status, map old to new records, and log errors (see the Migration Table page of this section).

## Gotchas

- Wrong sequencing causes dependency failures; verify the migration order for your dataset.

## Code check (6.7.15.1)
- unverified `XML configuration files` — mapping definitions ship with the B2B Suite Migration Commercial extension, out of scope of the checked roots
- unverified `configurator` — part of the B2B Suite Migration extension, out of scope
- unverified `b2b_components_migration_state` — migration tracking table of the extension, not present in the core/storefront/administration roots
- confirmed `b2b_components_shopping_list` — B2B Components target entity known to core usage-data allow-list — vendor/shopware/core/System/UsageData/usage-data-allow-list.json:2092
