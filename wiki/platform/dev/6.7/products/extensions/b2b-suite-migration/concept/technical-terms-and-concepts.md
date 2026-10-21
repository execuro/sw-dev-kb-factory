---
id: platform/dev/6.7/products/extensions/b2b-suite-migration/concept/technical-terms-and-concepts.md
title: Technical Terms and Concepts
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-suite-migration/concept/technical-terms-and-concepts.html
sourceHash: 761f1ef74fc162a6d46bb69759aad64cf4458ff8
codeCheckedAgainst: "6.7.15.1"
keywords: ["b2b suite migration", "b2b commercial", "component", "entity", "configurator", "handler", "AbstractB2BMigrationConfigurator", "AbstractB2BExtensionMigrationConfigurator", "transform", "employee_management", "field mapping", "data transformation"]
summary: Glossary for B2B Suite to B2B Commercial migration - component, entity, configurator (AbstractB2BMigrationConfigurator) and handler (transform method).
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/products/extensions/b2b-suite-migration/development/fields-mapping.md", "platform/dev/6.7/products/extensions/b2b-suite-migration/development/handler.md"]
---
## What it is

A glossary of the four core terms used by the B2B Suite to B2B Commercial migration tooling: component, entity, configurator and handler. It is the vocabulary the development pages (adding components, field mapping, handlers, extending migrations) build on.

## When to use

Read this before customizing or extending the migration from B2B Suite to B2B Commercial, or when a development page refers to a "component", "configurator" or "handler" and you need the exact meaning.

## Key steps / config

- **Component** — a distinct module of B2B Commercial, e.g. `B2B Commercial Employee Management`, `B2B Commercial Budget Management`, `B2B Commercial Quote Management`, `B2B Commercial Shopping List`. A component encapsulates a set of functionality and its data structures, and groups related entities and their migrations for modularity.
- **Entity** — one type of data inside a component. In `B2B Commercial Employee Management` the entities include `Employee`, `Role` and `Permission`. Each entity has its own attributes and behaviour, defined by its schema in the source and target tables.
- **Configurator** — a PHP class that defines the migration process for a component's entities. It specifies:
  - the technical name of the component (e.g. `employee_management`);
  - the field mappings between source and target tables (see [Fields Mapping](platform/dev/6.7/products/extensions/b2b-suite-migration/development/fields-mapping.md));
  - the path to the XML configuration file holding the mappings.
  A configurator extends `AbstractB2BMigrationConfigurator` for a base migration or `AbstractB2BExtensionMigrationConfigurator` for an extended migration.
- **Handler** — a PHP class implementing custom logic to transform data for specific fields during migration, used when a simple mapping is not enough (reformatting values, combining several source fields) and to keep data compatible with B2B Commercial's format. Handlers are referenced in the XML configuration and implemented via the `transform` method (see [Handler](platform/dev/6.7/products/extensions/b2b-suite-migration/development/handler.md)).

## Essential identifiers

- `AbstractB2BMigrationConfigurator` — base for component configurators
- `AbstractB2BExtensionMigrationConfigurator` — base for extension configurators
- `transform` — handler method carrying the transformation logic
- `employee_management` — example component technical name

## Code check (6.7.15.1)
- unverified `AbstractB2BMigrationConfigurator` — ships with the SwagCommercial B2B extension, not in core/storefront/administration; out of scope
- unverified `AbstractB2BExtensionMigrationConfigurator` — SwagCommercial B2B extension class; out of scope
- unverified `transform` — handler method defined in SwagCommercial B2B Suite migration code; out of scope
- unverified `employee_management` — component name registered by SwagCommercial; out of scope
