---
id: platform/dev/6.6/resources/references/app-reference/entities-reference.md
title: Entities Reference
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/resources/references/app-reference/entities-reference.html
sourceHash: 82f12ab220ab3fa8884fe1cc3b871ade74948a81
keywords: ["entities.xml", "custom entity", "entity-1.0.xsd", "store-api-aware", "many-to-many", "one-to-many", "many-to-one", "one-to-one", "on-delete", "custom_entity_blog", "field definition", "app manifest entities"]
summary: "Reference for an app's entities.xml defining custom entities, field types and associations."
lastBuilt: 2026-09-15
---
## What it is

This page shows the structure of an app's `entities.xml` file, used to define custom entities (e.g. `custom_entity_blog`) and their fields for the Shopware Custom Entity system.

## Key steps / config

The root element is `<entities>`, validating against `https://raw.githubusercontent.com/shopware/shopware/trunk/src/Core/System/CustomEntity/Xml/entity-1.0.xsd`. Each `<entity name="...">` contains a `<fields>` block with typed field elements.

```xml
<entities xsi:noNamespaceSchemaLocation="...entity-1.0.xsd">
  <entity name="custom_entity_blog">
    <fields>
      <int name="position" store-api-aware="true" />
      <float name="rating" store-api-aware="true" />
      <string name="title" required="true" translatable="true" store-api-aware="true" />
      <text name="content" allow-html="true" translatable="true" store-api-aware="true" />
      <bool name="display" translatable="true" store-api-aware="true" />
      <date name="my_date" store-api-aware="false" />
      <json name="payload" store-api-aware="false" />
      <email name="email" store-api-aware="false" />
      <price name="price" store-api-aware="false" />
      <many-to-many name="products" reference="product" store-api-aware="true" />
      <one-to-many name="comments" reference="ce_blog_comment" on-delete="cascade" reverse-required="true" />
      <many-to-one name="top_seller_cascade" reference="product" required="true" on-delete="cascade" />
      <one-to-one name="link_product_restrict" reference="product" on-delete="restrict" />
    </fields>
  </entity>
</entities>
```

Field types include `int`, `float`, `string`, `text` (with `allow-html`), `bool`, `date`, `json`, `email`, `price`, `many-to-many`, `one-to-many`, `many-to-one`, `one-to-one`. Common attributes: `name`, `required`, `translatable`, `store-api-aware`, `default`, `reference` (for associations), `on-delete` (`cascade`, `restrict`, `set-null`), `reverse-required`, `inherited`.

## Essential identifiers

- `entities.xml`
- `<entities>`, `<entity name="...">`, `<fields>`
- Field elements: `<int>`, `<float>`, `<string>`, `<text>`, `<bool>`, `<date>`, `<json>`, `<email>`, `<price>`, `<many-to-many>`, `<one-to-many>`, `<many-to-one>`, `<one-to-one>`
- Schema: `https://raw.githubusercontent.com/shopware/shopware/trunk/src/Core/System/CustomEntity/Xml/entity-1.0.xsd`
