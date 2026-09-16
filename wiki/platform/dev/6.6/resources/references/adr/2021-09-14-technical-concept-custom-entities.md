---
id: platform/dev/6.6/resources/references/adr/2021-09-14-technical-concept-custom-entities.md
title: Technical concept custom entities
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/resources/references/adr/2021-09-14-technical-concept-custom-entities.html
sourceHash: e1af5cd65a733bb03c395cf100dd629c3e088272
keywords: ["custom_entity.xml", "custom_entity_", "ce_", "CustomEntityKernelLoader", "custom entities", "IdField", "TranslatedField", "store_api_aware", "dal:validate", "app scripting", "api/custom-entity-{entity}", "api/ce-{entity}"]
summary: "ADR: apps define custom entities via config/custom_entity.xml, each backed by a real MySQL table under the custom_entity_ prefix."
lastBuilt: "2026-09-15"
---
## What it is

An architecture decision record for letting apps (and later store operators) define their own entities declaratively, without writing PHP, while still getting automatically-guaranteed business logic.

## Key steps / config

Schema/definition:

- An app can include a `config/custom_entity.xml` file, defining multiple custom entities.
- Each custom entity is registered with the prefix `custom_entity_` or the shorthand `ce_`; app developers should add their own developer prefix to avoid collisions (e.g. `custom_entity_swag_blog`), which creates a `custom_entity_swag_blog` table.
- A proper MySQL table and real column is created for each entity/field; supported field types are scalars (int, string, text, float, date, boolean), JSON fields (JSON, list, price, etc.), and many-to-one/many-to-many associations (bi-directional, one-to-one and one-to-many are not supported yet).
- New fields must be nullable or have a default; changing a field's data type is not allowed; removing a field from the XML deletes it from the database on install/update, which also runs a schema update (consider running `dal:validate`).
- Each custom entity automatically gets an `IdField(id)` primary key and a required `TranslatedField(label)` used as the admin display name.

Bootstrapping: at kernel boot all custom entities are loaded from the database and registered in the registry and DI container via a `CustomEntityKernelLoader`, using a generic entity definition with the property/column schema injected; kernel boot must still work with no database connection.

API availability: `/api/custom-entity-{entity}` is always registered as an API route pointing at a controller derived from `ApiController` (or `/api/ce-{entity}` if the entity used the `ce_` shorthand), since routes for custom entities can't be registered before they're loaded.

Store API: an entity can be marked `store_api_aware`; entities not marked this way are removed from Store API responses, and no endpoint is auto-generated for them (handled via app-scripting instead).

## Essential identifiers

- `config/custom_entity.xml`
- `custom_entity_`, `ce_`
- `CustomEntityKernelLoader`
- `IdField(id)`, `TranslatedField(label)`
- `/api/custom-entity-{entity}`, `/api/ce-{entity}`
- `store_api_aware`
- `dal:validate`

## Gotchas

Field data types can never be changed once set; removing a field from `custom_entity.xml` deletes the underlying column and its data on the next install/update.
