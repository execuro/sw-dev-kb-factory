---
id: platform/dev/6.7/concepts/commerce/catalog/products.md
title: Products
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/concepts/commerce/catalog/products.html
sourceHash: 16773012de3021c2237b9abf45e2faaf7f4b8bce
codeCheckedAgainst: "6.7.15.1"
keywords: ["product", "product variant", "variants", "properties", "options", "property group", "property_group_option", "product_option", "product_property", "product_category", "configurator", "parent_id", "packaging dimensions", "measurement units", "ProductDefinition"]
summary: Shopware 6.7 product concept - properties vs variant-defining options, parent/child variants with inheritance, categories, packaging units, configurator.
lastBuilt: 2026-10-20
---
## What it is

Concept page for products, the sellable entities (physical and digital) of a shop, and the entities they relate to: categories, property groups/options and variants. Each product can be made available in one or more sales channels.

## When to use

When modelling a catalog, deciding between properties and options, building variant handling, or reasoning about shipping dimensions. Very large catalogs (millions of products) need environment tuning, since load depends on the number of categories, sales channels and properties.

## Key steps / config

**Product data:** general details (name, product number, manufacturer, prices); a product can sit in multiple categories (mapping table `product_category`).

**Properties vs. options** — both relate `product` to `property_group_option` (which belongs to a `property_group`), but through different mapping tables:
- **Properties** (`product_property`, association `properties`): non variant-defining facts that variants usually share (series/collection, washing instructions, manufacturing country). Shown in a table on the detail page, in listings, and usable as filters. Inherited by variants.
- **Options** (`product_option`, association `options`): variant-defining facts that differ between variants (size, colour, volume).

**Variants:** `product` is self-referencing via `parent_id`; a child is a variant of its parent and inherits field values from it.

```
product (id, parent_id)
  ├─ product_category (product_id, category_id) → category
  ├─ product_option   (product_id, property_group_option_id)
  └─ product_property (product_id, property_group_option_id)
property_group_option (id, property_group_id) → property_group
```

**Packaging dimensions:** `weight` stored in kilograms; `width`, `length`, `height` in millimetres. Display units are configurable per sales channel context (storefront and APIs).

**Configurator:** for a Store API-scoped request on a variant product, Shopware assembles a configurator object with all property groups and the corresponding variants, so clients (Storefront, Composable Frontends) can render variant selection. The available options are held in `product_configurator_setting` (association `configuratorSettings`).

## Essential identifiers

- `Shopware\Core\Content\Product\ProductDefinition` (`product`), `ProductEntity`
- `product_category`, `product_option`, `product_property`, `product_configurator_setting`
- `PropertyGroupDefinition`, `PropertyGroupOptionDefinition`
- `ProductConfiguratorLoader`

## Gotchas

- Properties and options point at the same `property_group_option` entity; only options define variants. Picking the wrong one breaks variant generation or filtering.

## Version notes

- Configurable measurement units exist from Shopware 6.7.1.0. Before that, values are always stored and displayed in the metric system.

## Code check (6.7.15.1)
- confirmed `ProductDefinition::ENTITY_NAME` — entity `product` — vendor/shopware/core/Content/Product/ProductDefinition.php:85
- confirmed `ParentFkField` — product is self-referencing (variants) — vendor/shopware/core/Content/Product/ProductDefinition.php:155
- confirmed `weight` — float field, inherited — vendor/shopware/core/Content/Product/ProductDefinition.php:199
- confirmed `options` — many-to-many via `ProductOptionDefinition` — vendor/shopware/core/Content/Product/ProductDefinition.php:276
- confirmed `properties` — many-to-many via `ProductPropertyDefinition`, inherited — vendor/shopware/core/Content/Product/ProductDefinition.php:278
- confirmed `product_option` — mapping entity name — vendor/shopware/core/Content/Product/Aggregate/ProductOption/ProductOptionDefinition.php:22
- confirmed `product_property` — mapping entity name — vendor/shopware/core/Content/Product/Aggregate/ProductProperty/ProductPropertyDefinition.php:22
- confirmed `configuratorSettings` — association to `ProductConfiguratorSettingDefinition` — vendor/shopware/core/Content/Product/ProductDefinition.php:260
- confirmed `ProductConfiguratorLoader` — builds Store API configurator — vendor/shopware/core/Content/Product/SalesChannel/Detail/ProductConfiguratorLoader.php:19
- confirmed `MeasurementUnits` — measurement unit struct (6.7 measurement system) — vendor/shopware/core/Content/MeasurementSystem/MeasurementUnits.php:9
