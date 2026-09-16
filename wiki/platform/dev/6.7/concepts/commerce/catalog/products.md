---
id: platform/dev/6.7/concepts/commerce/catalog/products.md
title: Products
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/concepts/commerce/catalog/products.html
sourceHash: 16773012de3021c2237b9abf45e2faaf7f4b8bce
codeCheckedAgainst: "6.7.13.0"
keywords: ["product", "ProductDefinition", "product variant", "parent_id", "properties", "options", "property group option", "ProductCategoryDefinition", "ProductOptionDefinition", "ProductPropertyDefinition", "configurator", "ProductConfiguratorLoader", "MeasurementUnits", "packaging dimensions", "inheritance"]
summary: Product concept - product data, categories, properties vs variant-defining options, parent/child variants with inheritance, packaging units, configurator.
lastBuilt: 2026-09-15
---
## What it is

Concept page for products, the sellable entities (physical and digital) in Shopware: their relation to categories and property groups, how variants are modelled, packaging dimensions, and the variant configurator.

## When to use

Modelling a catalog (variants, properties, categories), deciding between properties and options, or working with product dimensions and variant selection in Store API clients.

## Key steps / config

- **Product details**: general data such as name, product number, manufacturer, prices.
- **Sales channels**: a product can be made available in one or more sales channels. Very large catalogs (millions of products) need tuning, depending on the number of categories, sales channels and properties.
- **Categories**: hierarchical tree used as navigation; a product can be in many categories (`categories` association via mapping `ProductCategoryDefinition`, columns `product_id`/`category_id`).
- **Properties** (`properties`, mapping `ProductPropertyDefinition`): property group options describing facts usually shared by all variants — *non variant defining* (series, washing instructions, country of manufacture). Shown on the detail page, in listings, usable as filters.
- **Options** (`options`, mapping `ProductOptionDefinition`): property group options that differ between variants — *variant defining* (size, color, volume). Both properties and options relate product to `property_group_option`, but only options constitute variants.
- **Variants**: product is self-referencing (`parentId` / `ParentFkField`, `children`); child variants inherit field values from the parent.
- **Packaging dimensions**: `weight` stored in kg; `width`, `length`, `height` stored in mm. Display units can differ per sales channel context (6.7.1.0+).
- **Configurator**: for Store API-scoped requests of a variant product, Shopware assembles a configurator of all property groups and variants (`ProductConfiguratorLoader`) so Storefront or Composable Frontends can render variant selection.

Relationship skeleton:

```
product ─< product_category >─ category
product ─< product_option   >─ property_group_option >─ property_group
product ─< product_property >─ property_group_option
product.parent_id → product.id   (variants)
```

## Essential identifiers

- `ProductDefinition` (entity `product`), fields `parentId`, `weight`, `width`, `height`, `length`
- Associations `categories`, `properties`, `options`, `children`
- `ProductCategoryDefinition`, `ProductOptionDefinition`, `ProductPropertyDefinition`
- `ProductConfiguratorLoader`
- `MeasurementUnits` (`DEFAULT_LENGTH_UNIT = 'mm'`, `DEFAULT_WEIGHT_UNIT = 'kg'`)

## Version notes

- Configurable measurement display units exist only from Shopware 6.7.1.0; before that values are always metric and displayed as stored.

## Code check (6.7.13.0)
- confirmed `ProductDefinition` — product entity definition — vendor/shopware/core/Content/Product/ProductDefinition.php:83
- confirmed `ParentFkField` — self-reference for variants — vendor/shopware/core/Content/Product/ProductDefinition.php:155
- confirmed `weight` — inherited float field — vendor/shopware/core/Content/Product/ProductDefinition.php:196
- confirmed `length` — inherited float field — vendor/shopware/core/Content/Product/ProductDefinition.php:199
- confirmed `options` — ManyToMany via ProductOptionDefinition, variant options — vendor/shopware/core/Content/Product/ProductDefinition.php:273
- confirmed `properties` — ManyToMany via ProductPropertyDefinition, inherited — vendor/shopware/core/Content/Product/ProductDefinition.php:275
- confirmed `categories` — ManyToMany via ProductCategoryDefinition — vendor/shopware/core/Content/Product/ProductDefinition.php:277
- confirmed `MeasurementUnits::DEFAULT_LENGTH_UNIT` — default mm — vendor/shopware/core/Content/MeasurementSystem/MeasurementUnits.php:13
- confirmed `MeasurementUnits::DEFAULT_WEIGHT_UNIT` — default kg — vendor/shopware/core/Content/MeasurementSystem/MeasurementUnits.php:15
- confirmed `ProductConfiguratorLoader` — builds variant configurator — vendor/shopware/core/Content/Product/SalesChannel/Detail/ProductConfiguratorLoader.php:20
