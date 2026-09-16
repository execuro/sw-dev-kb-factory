---
id: platform/dev/6.6/resources/references/adr/2022-04-06-add-default-cms-layouts-to-products-and-categories.md
title: Add default cms pages to products and categories
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: "https://developer.shopware.com/docs/v6.6/resources/references/adr/2022-04-06-add-default-cms-layouts-to-products-and-categories.html"
sourceHash: 380bfa6ddbbdc5a970be5dedfb525487ee9c19fc
keywords: ["cms page", "cmsPageId", "CMS_PRODUCT_DETAIL_PAGE", "CONFIG_KEY_DEFAULT_CMS_PAGE_PRODUCT", "CONFIG_KEY_DEFAULT_CMS_PAGE_CATEGORY", "entity.loaded", "default layout", "product_list", "product", "category", "system config"]
summary: "Documents the system-config-driven default CMS page fallback for products and product_list categories, resolved on entity.loaded."
lastBuilt: "2026-09-15"
---
## What it is

ADR documenting how Shopware 6 lets store operators configure a default CMS layout for products and product-listing categories, instead of relying only on the hard-coded fallback Twig template used when a product has no CMS page assigned.

## When to use

Relevant when a product or a category of type `product_list` has no CMS page explicitly assigned and should fall back to a store-wide configured default rather than the hard-coded template, or when investigating why a stored `cmsPageId` differs from the value the repository returns.

## Key steps / config

- `category.cmsPageId` is set to `null` when the entity should use the configured default; this only applies to CMS pages of type `product_list`.
- `product.cmsPageId` is set to `null` when the default `\Shopware\Core\Defaults::CMS_PRODUCT_DETAIL_PAGE` should be used.
- The default CMS page ids are stored in system config, under `\Shopware\Core\Content\Product\ProductDefinition::CONFIG_KEY_DEFAULT_CMS_PAGE_PRODUCT` (products) and `\Shopware\Core\Content\Category\CategoryDefinition::CONFIG_KEY_DEFAULT_CMS_PAGE_CATEGORY` (categories of type `product_list`).
- The fallback is resolved at the `entity.loaded` event of the corresponding entity: if the foreign key (`cmsPageId`) is `null`, the subscriber injects the system-config default.

## Essential identifiers

- `\Shopware\Core\Defaults::CMS_PRODUCT_DETAIL_PAGE`
- `\Shopware\Core\Content\Product\ProductDefinition::CONFIG_KEY_DEFAULT_CMS_PAGE_PRODUCT`
- `\Shopware\Core\Content\Category\CategoryDefinition::CONFIG_KEY_DEFAULT_CMS_PAGE_CATEGORY`
- `entity.loaded` event
- `product.cmsPageId`, `category.cmsPageId`

## Gotchas

Because the default is applied by a subscriber on `entity.loaded` rather than stored on the row, the `cmsPageId` value persisted in the database can differ from the `cmsPageId` value returned via the repository once a default is injected. To rely on the default, an entity must have no `cmsPageId` assigned at all — assigning any explicit CMS page id disables the fallback for that entity.
