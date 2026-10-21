---
id: platform/dev/6.7/resources/references/app-reference/entities-reference.md
title: Entities Reference
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/app-reference/entities-reference.html
sourceHash: 82f12ab220ab3fa8884fe1cc3b871ade74948a81
codeCheckedAgainst: "6.7.15.1"
keywords: ["entities.xml", "entity-1.0.xsd", "custom entity", "custom_entity_", "ce_", "store-api-aware", "on-delete", "reverse-required", "many-to-one", "one-to-many", "app entity definition", "custom table"]
summary: Reference for an app's Resources/entities.xml - custom entity names, field types, store-api-aware, translatable, associations and on-delete modes.
lastBuilt: 2026-10-21
---
## What it is

The reference example for `entities.xml`, in which an app (or plugin) defines custom entities. Shopware creates a database table and DAL definition for each `<entity>` and its `<fields>`, including scalar fields and associations to core or other custom entities.

## When to use

When an app needs its own data tables (e.g. a blog with comments) and you need the exact element and attribute names the installer validates.

## Key steps / config

1. Place the file at `Resources/entities.xml`; reference `xsi:noNamespaceSchemaLocation="https://raw.githubusercontent.com/shopware/shopware/trunk/src/Core/System/CustomEntity/Xml/entity-1.0.xsd"`.
2. Name each entity with the prefix `custom_entity_` or the short form `ce_` (e.g. `custom_entity_blog`, `ce_blog_comment`) — other names are rejected.
3. Add fields inside `<fields>`:

```xml
<entities xmlns:xsi="..." xsi:noNamespaceSchemaLocation="...entity-1.0.xsd">
  <entity name="custom_entity_blog">
    <fields>
      <string name="title" required="true" translatable="true" store-api-aware="true" />
      <text name="content" allow-html="true" translatable="true" store-api-aware="true" />
      <bool name="in_stock" store-api-aware="true" default="true" />
      <many-to-many name="products" reference="product" store-api-aware="true" />
      <one-to-many name="comments" reference="ce_blog_comment" store-api-aware="true" on-delete="cascade" reverse-required="true" />
      <many-to-one name="top_seller_restrict" reference="product" store-api-aware="true" required="false" on-delete="restrict" />
    </fields>
  </entity>
```

- Scalar field elements: `int`, `float`, `string`, `text`, `bool`, `date`, `json`, `email`, `price`.
- Association elements: `many-to-many`, `many-to-one`, `one-to-many`, `one-to-one`; all need `reference` (target entity name).
- `store-api-aware` is required on every field; `required` and `translatable` default to `false`; `allow-html` exists only on `text`; `default` is supported on scalar fields except `json` and `price` (`price` also has no `translatable`).
- `on-delete` (`cascade`, `restrict`, `set-null`) is required on `many-to-one`, `one-to-many` and `one-to-one`; `many-to-many` has none.
- `inherited="true"` is available on all association types; `reverse-required` only on `one-to-many`.
- Optional entity attributes in the schema: `custom-fields-aware` and `label-property`.

## Essential identifiers

- `Resources/entities.xml`, `entity-1.0.xsd`
- Prefixes `custom_entity_`, `ce_`
- Attributes `store-api-aware`, `required`, `translatable`, `allow-html`, `default`, `reference`, `on-delete`, `reverse-required`, `inherited`, `ignore-missing-reference`

## Gotchas

- A `one-to-many` pointing at a core table (not `custom_entity_`/`ce_`) may not use `on-delete="cascade"` or `reverse-required="true"`; install fails with a RuntimeException. The source's `comments` example is valid only because it references `ce_blog_comment`.
- Fields with `on-delete="restrict"` block disabling the app, and block removing app data while the restricting table has rows.
- With `custom-fields-aware="true"`, `label-property` must be set and name a `string` field of the entity.
- `ignore-missing-reference` (default `false`) exists in the installed schema on all association types but is not shown in the source.

## Code check (6.7.15.1)
- confirmed `entities.xml` — file name constant — vendor/shopware/core/System/CustomEntity/Xml/CustomEntityXmlSchema.php:15
- confirmed `Resources` — lookup directory for apps — vendor/shopware/core/System/CustomEntity/CustomEntityLifecycleService.php:50
- confirmed `custom_entity_` — required entity-name prefix — vendor/shopware/core/System/CustomEntity/Schema/SchemaUpdater.php:21
- confirmed `ce_` — accepted short prefix — vendor/shopware/core/System/CustomEntity/Schema/SchemaUpdater.php:23
- confirmed `custom-fields-aware` — optional entity attribute — vendor/shopware/core/System/CustomEntity/Xml/entity-1.0.xsd:34
- confirmed `store-api-aware` — required on int field (and every other field type) — vendor/shopware/core/System/CustomEntity/Xml/entity-1.0.xsd:58
- confirmed `ignore-missing-reference` — association attribute, default false — vendor/shopware/core/System/CustomEntity/Xml/entity-1.0.xsd:131
- confirmed `on-delete` — required on many-to-one — vendor/shopware/core/System/CustomEntity/Xml/entity-1.0.xsd:140
- confirmed `reverse-required` — one-to-many only, default false — vendor/shopware/core/System/CustomEntity/Xml/entity-1.0.xsd:149
- confirmed `AssociationField::CASCADE` — rejected for one-to-many to core tables — vendor/shopware/core/System/CustomEntity/Xml/CustomEntityXmlSchemaValidator.php:77
