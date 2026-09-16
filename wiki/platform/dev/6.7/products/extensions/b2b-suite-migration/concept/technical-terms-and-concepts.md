---
id: platform/dev/6.7/products/extensions/b2b-suite-migration/concept/technical-terms-and-concepts.md
title: Technical Terms and Concepts
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-suite-migration/concept/technical-terms-and-concepts.html
sourceHash: 761f1ef74fc162a6d46bb69759aad64cf4458ff8
codeCheckedAgainst: "6.7.13.0"
keywords: ["AbstractB2BMigrationConfigurator", "AbstractB2BExtensionMigrationConfigurator", "transform", "employee_management", "b2b suite migration", "b2b commercial", "component", "entity", "configurator", "handler", "field mapping", "data transformation"]
summary: "Glossary for the B2B Suite to B2B Commercial migration: component, entity, configurator (AbstractB2BMigrationConfigurator) and handler (transform)."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/products/extensions/b2b-suite-migration/development/fields-mapping.md", "platform/dev/6.7/products/extensions/b2b-suite-migration/development/handler.md"]
---
## What it is

Definitions of the four core terms used by the migration from B2B Suite to B2B Commercial: component, entity, configurator and handler.

## When to use

Read before customizing or extending the migration, to understand how components, their entities, configurator classes and handler classes relate.

## Key steps / config

- **Component** — a distinct module of B2B Commercial, e.g. `B2B Commercial Employee Management`, `B2B Commercial Budget Management`, `B2B Commercial Quote Management`, `B2B Commercial Shopping List`. A component encapsulates a set of functionality and data structures and groups related entities and their migrations.
- **Entity** — a specific data type within a component. In `B2B Commercial Employee Management` the entities include `Employee`, `Role` and `Permission`. Each entity's attributes are defined by its schema in the source and target tables.
- **Configurator** — a PHP class that defines the migration of a component's entities. It specifies:
  - the technical name of the component (e.g. `employee_management`);
  - field mappings between source and target tables (see [Field Mapping Configuration](platform/dev/6.7/products/extensions/b2b-suite-migration/development/fields-mapping.md));
  - the path of the XML mapping configuration file.
  A configurator extends `AbstractB2BMigrationConfigurator` for a base migration or `AbstractB2BExtensionMigrationConfigurator` for extending an existing migration.
- **Handler** — a PHP class with custom logic that transforms data for specific fields when a simple mapping is not enough (reformatting, combining multiple source fields). Handlers are referenced in the XML configuration and implement the `transform` method; see [Handler-Based Transformation](platform/dev/6.7/products/extensions/b2b-suite-migration/development/handler.md).

## Essential identifiers

- `AbstractB2BMigrationConfigurator`
- `AbstractB2BExtensionMigrationConfigurator`
- `transform` (handler method)
- `employee_management` (component technical name)

## Code check (6.7.13.0)
- unverified `AbstractB2BMigrationConfigurator` — part of SwagCommercial (B2BSuiteMigration), not installed in the checked vendor/shopware roots
- unverified `AbstractB2BExtensionMigrationConfigurator` — SwagCommercial class, outside the checked vendor roots
- unverified `transform` — handler interface lives in SwagCommercial, outside the checked vendor roots
- unverified `employee_management` — component name defined by SwagCommercial configurators, outside the checked vendor roots
- confirmed `SwagCommercial` — core only references the commercial plugin by name; its code is not in vendor/shopware — vendor/shopware/core/System/Resources/translation.yaml:8
