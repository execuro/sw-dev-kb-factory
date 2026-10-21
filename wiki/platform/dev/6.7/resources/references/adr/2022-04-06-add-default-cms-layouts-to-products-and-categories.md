---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/resources/references/adr/2022-04-06-add-default-cms-layouts-to-products-and-categories.md
sourceHash: 4ada2f943fbecd03062721031e02ab95a4d3714e
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2022-04-06-add-default-cms-layouts-to-products-and-categories.html
title: Add default cms pages to products and categories
version: "6.7"
versions:
  - "6.7"
keywords: ["default cms page", "default layout", "cmsPageId", "CONFIG_KEY_DEFAULT_CMS_PAGE_PRODUCT", "CONFIG_KEY_DEFAULT_CMS_PAGE_CATEGORY", "core.cms.default_product_cms_page", "core.cms.default_category_cms_page", "Defaults::CMS_PRODUCT_DETAIL_PAGE", "ProductSubscriber", "CategorySubscriber", "CmsPageDefaultChangeSubscriber", "shopping experiences", "adr"]
summary: "ADR: default CMS layouts for products and categories via system config keys; products resolve on load, categories get the default written on save in 6.7."
lastBuilt: 2026-10-21
---
## What it is

An architecture decision record (2022-04-06) introducing a user-configurable default CMS page (layout) for products and categories. Before it, a product without a CMS page fell back to a hardcoded Twig template, and categories had no default at all. The default is stored as a CMS page id in the system config, and an entity uses it when it has no CMS page id of its own.

## When to use

- You need to know why a product's `cmsPageId` is `null` in the database while the repository returns a layout id.
- You are changing or reading the default product or category layout from code or config.
- You are writing an import or sync that creates categories or products without a layout.

## Key steps / config

System config keys holding the default CMS page id:

- `\Shopware\Core\Content\Product\ProductDefinition::CONFIG_KEY_DEFAULT_CMS_PAGE_PRODUCT` = `core.cms.default_product_cms_page`. The default product detail layout is `\Shopware\Core\Defaults::CMS_PRODUCT_DETAIL_PAGE`, which a 6.4 migration also writes into this key.
- `\Shopware\Core\Content\Category\CategoryDefinition::CONFIG_KEY_DEFAULT_CMS_PAGE_CATEGORY` = `core.cms.default_category_cms_page`. The 6.4 migration seeds it with the default `product_list` layout.

How the installed code applies them:

1. **Products, on load**: `ProductSubscriber` listens to `product.loaded`/`product.partial_loaded` and the `sales_channel.` variants. If `cmsPageId` is `null`, it assigns the value of `core.cms.default_product_cms_page`, resolved per sales channel in the sales channel context. The stored value stays `null`.
2. **Categories, on write**: `CategorySubscriber::beforeWriteCategory()` handles `EntityWriteEvent`. On insert without `cms_page_id`, or on insert/update that sets `cms_page_id` to `null`, it writes the configured default into the payload, but only if the configured id is a valid UUID of an existing live-version `cms_page`.
3. **Guarding the default**: `CmsPageDefaultChangeSubscriber` blocks removing the overall (non-sales-channel) default for either key, and blocks deleting a CMS page that is currently a default.

## Essential identifiers

- `ProductDefinition::CONFIG_KEY_DEFAULT_CMS_PAGE_PRODUCT`, `CategoryDefinition::CONFIG_KEY_DEFAULT_CMS_PAGE_CATEGORY`
- `Defaults::CMS_PRODUCT_DETAIL_PAGE` (`7a6d253a67204037966f42b0119704d5`)
- `Shopware\Core\Content\Product\Subscriber\ProductSubscriber`
- `Shopware\Core\Content\Category\Subscriber\CategorySubscriber`
- `Shopware\Core\Content\Cms\Subscriber\CmsPageDefaultChangeSubscriber`

## Gotchas

- For products, the CMS page id in the database can differ from the one the repository returns. Only a product with no CMS page id of its own gets the default.
- The ADR says categories also get the default at `entity.loaded` and that `category.cmsPageId` is set to `null`. In 6.7.15.1 categories work the other way round: the default id is written into the row at save time, and the `sales_channel.category.loaded` handler only builds SEO URLs. So a category's stored `cms_page_id` is the default layout, and changing the config later does not move existing categories.
- `CategorySubscriber` writes nothing if the configured category default is empty, not a UUID, or not an existing live `cms_page`.

## Version notes

- The 6.4 migration `Migration1650620993SetDefaultCmsPagesAndSetCategoryCmsPageToNull` set both config keys and nulled the CMS page id of categories that used the default layout, matching the ADR.
- The 6.7 migration `Migration1776691515SetDefaultCmsPageIdForCategories` reverses that for categories. For `type = page` (`CategoryDefinition::TYPE_PAGE`) rows whose `cms_page_id` is `NULL`, it writes the global default into `cms_page_id` and sets `cms_page_version_id` to the live version.

## Code check (6.7.15.1)
- confirmed `ProductDefinition::CONFIG_KEY_DEFAULT_CMS_PAGE_PRODUCT` — value `core.cms.default_product_cms_page` — vendor/shopware/core/Content/Product/ProductDefinition.php:87
- confirmed `CategoryDefinition::CONFIG_KEY_DEFAULT_CMS_PAGE_CATEGORY` — value `core.cms.default_category_cms_page` — vendor/shopware/core/Content/Category/CategoryDefinition.php:75
- confirmed `Defaults::CMS_PRODUCT_DETAIL_PAGE` — default product detail layout id — vendor/shopware/core/Defaults.php:44
- confirmed `ProductSubscriber::setDefaultLayout()` — assigns default when `cmsPageId` is null at load — vendor/shopware/core/Content/Product/Subscriber/ProductSubscriber.php:238
- corrected `CategorySubscriber::beforeWriteCategory()` — docs: category default injected at `entity.loaded` with null FK — vendor/shopware/core/Content/Category/Subscriber/CategorySubscriber.php:58
- corrected `Migration1776691515SetDefaultCmsPageIdForCategories` — docs: `category.cmsPageId` set to null; 6.7 backfills page categories — vendor/shopware/core/Migration/V6_7/Migration1776691515SetDefaultCmsPageIdForCategories.php:17
- confirmed `Migration1650620993SetDefaultCmsPagesAndSetCategoryCmsPageToNull` — 6.4 migration seeding both default keys — vendor/shopware/core/Migration/V6_4/Migration1650620993SetDefaultCmsPagesAndSetCategoryCmsPageToNull.php:17
- confirmed `CmsPageDefaultChangeSubscriber::$defaultCmsPageConfigKeys` — guards both default keys — vendor/shopware/core/Content/Cms/Subscriber/CmsPageDefaultChangeSubscriber.php:29
