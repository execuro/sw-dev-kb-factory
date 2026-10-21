---
id: platform/dev/6.7/resources/references/adr/2021-09-14-technical-concept-custom-entities.md
title: Technical concept custom entities
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2021-09-14-technical-concept-custom-entities.html
sourceHash: e1af5cd65a733bb03c395cf100dd629c3e088272
codeCheckedAgainst: "6.7.15.1"
keywords: ["custom entities", "custom_entity_", "ce_", "entities.xml", "app entities", "CustomEntityApiController", "CustomEntityRegistrar", "DynamicEntityDefinition", "store_api_aware", "dal:validate", "/api/custom-entity-", "schema update", "app system"]
summary: "ADR: apps define custom entities in XML; core creates tables, registers a dynamic definition at boot and serves /api/custom-entity-* routes."
lastBuilt: 2026-10-21
---
## What it is

An architecture decision record (area core) for letting apps, which cannot ship PHP code, define their own DAL entities purely declaratively, with tables, Admin API routes and optional Store API exposure handled automatically by the core.

## When to use

Read this to understand how app-defined custom entities are named, stored, booted and exposed via the API, or when debugging why a custom entity table, route or Store API field behaves as it does.

## Key steps / config

**Schema definition**

- The app ships an XML file with one or more entity definitions. In 6.7.15.1 the file is `entities.xml`, read from the app's `Resources` directory and validated against `entity-1.0.xsd`.
- Entity names carry the prefix `custom_entity_` or the shorthand `ce_` (e.g. `custom_entity_swag_blog`); add your developer prefix to avoid collisions. A MySQL table of the same name is created, one real column per field.
- Field types per the ADR: scalars (int, string, text, float, date, boolean), JSON fields (JSON, list, price), and many-to-one / many-to-many associations.

**Install & update**

- Installing or updating an app triggers an automatic schema update; running `dal:validate` on the result is suggested.
- New fields must be nullable or have a default; changing a field's data type is not allowed; fields removed from the XML are dropped from the database.
- Every custom entity gets an `IdField` `id` as primary key (added by `DynamicEntityDefinition`).

**Bootstrapping**

- At kernel boot, `CustomEntityRegistrar::register()` loads all custom entities of active apps from the `custom_entity` table, creates a `DynamicEntityDefinition` per entity, and registers it plus a `<entity>.repository` service in the container and `DefinitionInstanceRegistry`.
- Without a database connection the loader returns silently, so the kernel still boots.

**API availability**

- `CustomEntityApiController` (extends `ApiController`) registers generic routes such as `/api/custom-entity-{entityName}{path}`, `/api/search/custom-entity-{entityName}{path}`, and the shorthand variants `/api/ce-{entityName}{path}` for `ce_` entities. The controller prepends the prefix to `entityName` and delegates to the parent.

**Store API**

- An entity can be flagged `store_api_aware`; entities not flagged are stripped from Store API responses. No automatic Store API endpoints are generated; Store API logic is meant for app scripting.

## Essential identifiers

- `custom_entity_`, `ce_` (prefixes; `SchemaUpdater::TABLE_PREFIX`, `SchemaUpdater::SHORTHAND_TABLE_PREFIX`)
- `entities.xml`, `entity-1.0.xsd`
- `CustomEntityRegistrar`, `DynamicEntityDefinition`, `CustomEntityApiController`
- `/api/custom-entity-{entityName}`, `/api/ce-{entityName}`
- `store_api_aware`, `dal:validate`

## Gotchas

- The ADR names the file `config/custom_entity.xml`; the installed code reads `Resources/entities.xml`.
- The ADR names a `CustomEntityKernelLoader`; no such class exists — boot loading is done by `CustomEntityRegistrar`.
- The ADR says a required `TranslatedField(label)` is added to every entity; the installed `DynamicEntityDefinition` only adds the `id` field automatically (a separate label field type exists in the XML field set).

## Version notes

The ADR excluded one-to-one and one-to-many associations "for now"; 6.7.15.1 ships `OneToOneField` and `OneToManyField` XML field classes for custom entities.

## Code check (6.7.15.1)
- corrected `CustomEntityXmlSchema::FILENAME` — docs: config/custom_entity.xml; code uses entities.xml — vendor/shopware/core/System/CustomEntity/Xml/CustomEntityXmlSchema.php:15
- confirmed `SchemaUpdater::TABLE_PREFIX` — value custom_entity_ — vendor/shopware/core/System/CustomEntity/Schema/SchemaUpdater.php:21
- confirmed `SchemaUpdater::SHORTHAND_TABLE_PREFIX` — value ce_ — vendor/shopware/core/System/CustomEntity/Schema/SchemaUpdater.php:23
- corrected `CustomEntityRegistrar::register()` — docs: CustomEntityKernelLoader loads entities at boot — vendor/shopware/core/System/CustomEntity/CustomEntityRegistrar.php:31
- confirmed `CustomEntityApiController` — extends ApiController — vendor/shopware/core/System/CustomEntity/Api/CustomEntityApiController.php:22
- confirmed `/api/custom-entity-{entityName}{path}` — generic list route — vendor/shopware/core/System/CustomEntity/Api/CustomEntityApiController.php:120
- confirmed `/api/ce-{entityName}{path}` — shorthand list route — vendor/shopware/core/System/CustomEntity/Api/CustomEntityApiController.php:132
- confirmed `store_api_aware` — runtime BoolField on custom entity definition — vendor/shopware/core/System/CustomEntity/CustomEntityDefinition.php:68
- confirmed `IdField` — id primary key added by DynamicEntityDefinition — vendor/shopware/core/System/CustomEntity/Schema/DynamicEntityDefinition.php:92
- corrected `OneToManyField` — docs: one-to-many not supported; XML field class exists — vendor/shopware/core/System/CustomEntity/Xml/Field/OneToManyField.php:13
