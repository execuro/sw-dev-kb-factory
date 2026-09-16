---
id: platform/dev/6.7/resources/references/app-reference/entities-reference.md
title: Entities Reference
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/app-reference/entities-reference.html
sourceHash: 82f12ab220ab3fa8884fe1cc3b871ade74948a81
codeCheckedAgainst: "6.7.13.0"
keywords: ["entities.xml", "entity-1.0.xsd", "custom entities", "custom_entity_", "ce_", "store-api-aware", "on-delete", "many-to-many", "many-to-one", "one-to-many", "one-to-one", "CustomEntityXmlSchema", "data model", "associations"]
summary: "Reference for entities.xml: custom entity definitions, field types, associations, on-delete modes and store-api-aware flags."
lastBuilt: 2026-09-15
---
## What it is

Annotated example of `entities.xml`, the file an app or plugin uses to define custom entities (database tables plus DAL definitions) declaratively. The core reads it from the extension's `Resources` directory (`CustomEntityXmlSchema::FILENAME` = `entities.xml`) and validates it against `entity-1.0.xsd`.

## When to use

When an extension needs its own data model (e.g. a blog with comments) including associations to core entities like `product` or `category`, without writing PHP entity definitions.

## Key steps / config

Root `<entities>` with schema location `https://raw.githubusercontent.com/shopware/shopware/trunk/src/Core/System/CustomEntity/Xml/entity-1.0.xsd`. Each `<entity name="...">` contains `<fields>`.

```xml
<entities>
  <entity name="custom_entity_blog">
    <fields>
      <string name="title" required="true" translatable="true" store-api-aware="true"/>
      <text name="content" allow-html="true" translatable="true" store-api-aware="true"/>
      <bool name="in_stock" store-api-aware="true" default="true"/>
      <many-to-many name="products" reference="product" store-api-aware="true"/>
      <one-to-many name="comments" reference="ce_blog_comment" store-api-aware="true" on-delete="cascade" reverse-required="true"/>
      <many-to-one name="top_seller_restrict" reference="product" store-api-aware="true" required="false" on-delete="restrict"/>
    </fields>
  </entity>
</entities>
```

- Scalar field elements: `int`, `float`, `string`, `text`, `bool`, `date`, `json`, `email`, `price`.
- Association elements: `many-to-many`, `many-to-one`, `one-to-many`, `one-to-one`, each with `reference` (target entity name).
- `on-delete`: `set-null`, `cascade` or `restrict`.
- Other attributes: `required`, `translatable`, `default`, `allow-html` (text only), `inherited` (associations), `reverse-required` (one-to-many), `ignore-missing-reference`.
- Entity attributes: `name` (required), `custom-fields-aware`, `label-property`.

## Essential identifiers

- `entities.xml`, `entity-1.0.xsd`, `CustomEntityXmlSchema`
- Prefixes `custom_entity_` and `ce_` (custom entity table names, e.g. `custom_entity_blog`, `ce_blog_comment`)
- `store-api-aware`, `on-delete`, `reference`, `inherited`, `reverse-required`

## Gotchas

- `store-api-aware` is a required attribute on every field and association element; omitting it fails XSD validation.
- `on-delete` is required on `many-to-one`, `one-to-many` and `one-to-one`, but not declared for `many-to-many`.
- `price` fields only accept `name`, `store-api-aware`, `required` — no `translatable` or `default`.
- `allow-html` exists only on `text`; `json` has no `default`.
- `inherited="true"` is used in the example on associations to `product` (`inherited_products`, `inherited_top_seller`, `inherited_link_product`).

## Code check (6.7.13.0)
- confirmed `CustomEntityXmlSchema::FILENAME` — value entities.xml — vendor/shopware/core/System/CustomEntity/Xml/CustomEntityXmlSchema.php:15
- confirmed `entity-1.0.xsd` — schema used for validation — vendor/shopware/core/System/CustomEntity/Xml/CustomEntityXmlSchema.php:17
- confirmed `Resources` — entities.xml is looked up in the extension's Resources directory — vendor/shopware/core/System/CustomEntity/CustomEntityLifecycleService.php:50
- confirmed `on-delete` — enum set-null/cascade/restrict — vendor/shopware/core/System/CustomEntity/Xml/entity-1.0.xsd:12
- confirmed `field-list` — allowed field elements int/float/string/text/bool/many-to-many/many-to-one/one-to-many/one-to-one/json/email/price/date — vendor/shopware/core/System/CustomEntity/Xml/entity-1.0.xsd:32
- confirmed `store-api-aware` — use="required" on field types — vendor/shopware/core/System/CustomEntity/Xml/entity-1.0.xsd:52
- confirmed `allow-html` — only on text fields, default false — vendor/shopware/core/System/CustomEntity/Xml/entity-1.0.xsd:78
- confirmed `field-price-type` — only name, store-api-aware, required — vendor/shopware/core/System/CustomEntity/Xml/entity-1.0.xsd:106
- confirmed `reverse-required` — one-to-many attribute, default false — vendor/shopware/core/System/CustomEntity/Xml/entity-1.0.xsd:143
- confirmed `SchemaUpdater::SHORTHAND_TABLE_PREFIX` — ce_ shorthand next to custom_entity_ — vendor/shopware/core/System/CustomEntity/Schema/SchemaUpdater.php:23
