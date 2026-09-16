---
docType: developer
id: platform/dev/6.6/guides/plugins/apps/custom-data/custom-entities.md
sourceHash: 6926584e909ad1e251939f8c5e0b222dc243d080
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/apps/custom-data/custom-entities.html
title: Custom entities
version: "6.6"
versions:
  - "6.6"
keywords: ["custom entities", "entities.xml", "entity-1.0.xsd", "custom_entity_", "ce_ prefix", "custom-fields-aware", "label-property", "services.repository.search", "custom-entity API", "many-to-many", "store-api-aware"]
summary: "Apps declare fully custom entities with own relations in entities.xml; they get an auto-registered repository and API endpoint."
lastBuilt: 2026-09-15
---
## What it is

Describes custom entities: unlike custom fields, apps can define entirely new data structures with custom relations in `entities.xml`, maintained by the admin.

## When to use

When custom fields on core tables are insufficient and the app needs its own entity with custom relations and lifecycle.

## Key steps / config

Register entities in `Resources/entities.xml`, validated against `https://raw.githubusercontent.com/shopware/shopware/trunk/src/Core/System/CustomEntity/Xml/entity-1.0.xsd`:

```xml
<entities>
  <entity name="custom_entity_bundle">
    <fields>
      <string name="name" required="true" translatable="true" store-api-aware="true" />
      <price name="discount" required="true" store-api-aware="true"/>
      <many-to-many name="products" reference="product" store-api-aware="true" />
    </fields>
  </entity>
</entities>
```

Every registered entity gets an automatic repository, usable in app scripts: `{% set blogs = services.repository.search('custom_entity_blog', criteria) %}`, and via Admin API, e.g. `POST /api/search/custom-entity-blog`. Since Shopware 6.5.1.0, adding `custom-fields-aware="true"` and `label-property="name"` on the `<entity>` element lets the entity be selectable as an "Entity Select" custom field type; the named label field must exist in `<fields>` as type `string`. Without a snippet, the entity shows as `custom_entity_bundle.label`; a snippet like `{ "custom_entity_bundle": { "label": "My Custom Entity" } }` in `Resources/app/administration/snippet/en-GB.json` overrides it. Associations referencing core tables require the matching `<permissions>` entries in `manifest.xml` (e.g. `<read>product</read>`). Since v6.4.15.0, entity names may use the `ce_` shorthand prefix (e.g. `ce_bundle`) to avoid DB name-length limits; the same shorthand must then be used consistently in the repository and API calls (`services.repository.search('ce_blog', ...)`, `POST /api/search/ce_blog`).

## Essential identifiers

- `entities.xml`, `entity-1.0.xsd`
- `custom-fields-aware`, `label-property`
- `services.repository.search()`
- `POST /api/search/<entity-name>`
- `ce_` shorthand prefix

## Gotchas

Renaming an existing custom entity deletes all its existing data. The `custom-fields-aware`/`label-property` combination requires Shopware 6.5.1.0 or later. Associations to core tables need explicit `<permissions>` in the manifest.

## Version notes

`custom-fields-aware`/`label-property` support was added in 6.5.1.0; the `ce_` shorthand prefix was added in v6.4.15.0.
