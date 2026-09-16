---
id: platform/dev/6.7/resources/references/adr/2021-09-14-technical-concept-custom-entities.md
title: Technical concept custom entities
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2021-09-14-technical-concept-custom-entities.html
sourceHash: e1af5cd65a733bb03c395cf100dd629c3e088272
codeCheckedAgainst: "6.7.13.0"
keywords: ["custom entities", "entities.xml", "custom_entity_", "ce_", "/api/custom-entity-{entityName}", "/api/ce-{entityName}", "store_api_aware", "CustomEntityRegistrar", "DynamicEntityDefinition", "CustomEntityApiController", "app entities", "dal", "adr"]
summary: "ADR: apps define custom entities in XML (custom_entity_/ce_ prefix), get real tables, a generic DAL definition at boot and /api/custom-entity-* routes."
lastBuilt: 2026-09-15
---
## What it is

An architecture decision record (2021-09-14) describing how apps (and later shop operators) define their own DAL entities without PHP code: XML schema, database tables, kernel-boot registration, Admin API routing and Store API exposure.

## When to use

When an app needs its own persisted data model, or when debugging how custom entity tables, definitions and API routes are created.

## Key steps / config

Schema:
- An app ships `Resources/entities.xml`; one file can define multiple entities.
- Entity names use the prefix `custom_entity_` or the shorthand `ce_`, plus the developer prefix to avoid collisions, e.g. `custom_entity_swag_blog` → table `custom_entity_swag_blog`.
- A real MySQL table per entity and a real column per field. Supported types per ADR: scalar (int, string, text, float, date, boolean), JSON-like (JSON, list, price) and linking associations (many-to-one, many-to-many).
- Each entity gets an `IdField('id')` primary key.

Install & update:
- The core runs a schema update automatically when an app is installed or updated.
- New fields must be nullable or have a default; changing a field's data type is not allowed; fields removed from the XML are dropped from the database.

Bootstrapping:
- At kernel boot, custom entities are loaded from the `custom_entity` table (only for active apps or without app) and each gets a generic `DynamicEntityDefinition`, a container service, a `.repository` service and a registry entry.
- If no database connection exists, boot continues without custom entities.

API availability:
- Admin API routes are registered generically, since the route loader runs before custom entities are known: `/api/custom-entity-{entityName}` (list/create/detail/update/delete, plus `/api/search/...`, `/api/search-ids/...`, `/api/aggregate/...`), handled by a controller extending `ApiController`.
- Entities defined with `ce_` use `/api/ce-{entityName}`.

Store API:
- Entities flagged `store_api_aware` are kept in Store API responses; others are removed.
- No endpoints are generated automatically; Store API logic is done via app scripting.

## Essential identifiers

- `Shopware\Core\System\CustomEntity\CustomEntityRegistrar::register()`
- `Shopware\Core\System\CustomEntity\Schema\DynamicEntityDefinition`
- `Shopware\Core\System\CustomEntity\Api\CustomEntityApiController`
- `CustomEntityXmlSchema::FILENAME` (`entities.xml`)
- `SchemaUpdater::TABLE_PREFIX` (`custom_entity_`), `SchemaUpdater::SHORTHAND_TABLE_PREFIX` (`ce_`)
- `store_api_aware`

## Gotchas

- The ADR names the file `config/custom_entity.xml`; the installed code reads `entities.xml` from the app's `Resources` directory.
- The ADR's `CustomEntityKernelLoader` does not exist; boot registration is done by `CustomEntityRegistrar`.
- The ADR says one-to-one and one-to-many are unsupported; the 6.7 XML field factory maps `one-to-many` and `one-to-one` field types.
- The ADR suggests considering `dal:validate` on install/update; no such call was found in the custom entity code.

## Code check (6.7.13.0)
- corrected `CustomEntityXmlSchema::FILENAME` — docs: `config/custom_entity.xml`; value `entities.xml` — vendor/shopware/core/System/CustomEntity/Xml/CustomEntityXmlSchema.php:15
- confirmed `Resources` — app XML is looked up under the app's Resources dir — vendor/shopware/core/System/CustomEntity/CustomEntityLifecycleService.php:50
- confirmed `SchemaUpdater::TABLE_PREFIX` — `custom_entity_` — vendor/shopware/core/System/CustomEntity/Schema/SchemaUpdater.php:21
- confirmed `SchemaUpdater::SHORTHAND_TABLE_PREFIX` — `ce_` — vendor/shopware/core/System/CustomEntity/Schema/SchemaUpdater.php:23
- corrected `CustomEntityRegistrar::register()` — docs: `CustomEntityKernelLoader`; loads from DB, returns on DB exception — vendor/shopware/core/System/CustomEntity/CustomEntityRegistrar.php:31
- confirmed `DynamicEntityDefinition::create()` — generic definition built per stored custom entity — vendor/shopware/core/System/CustomEntity/Schema/DynamicEntityDefinition.php:45
- confirmed `IdField` — `id` primary key added to every dynamic definition — vendor/shopware/core/System/CustomEntity/Schema/DynamicEntityDefinition.php:92
- confirmed `CustomEntityApiController` — extends `ApiController` — vendor/shopware/core/System/CustomEntity/Api/CustomEntityApiController.php:22
- corrected `one-to-many` — docs: not supported; mapped to OneToManyField (also `one-to-one`) — vendor/shopware/core/System/CustomEntity/Xml/Field/FieldFactory.php:22
- confirmed `store_api_aware` — custom entity flag field — vendor/shopware/core/System/CustomEntity/CustomEntityDefinition.php:65
