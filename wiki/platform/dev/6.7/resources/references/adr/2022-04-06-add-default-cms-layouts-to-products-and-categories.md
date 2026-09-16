---
id: platform/dev/6.7/resources/references/adr/2022-04-06-add-default-cms-layouts-to-products-and-categories.md
title: Add default cms pages to products and categories
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2022-04-06-add-default-cms-layouts-to-products-and-categories.html
sourceHash: 4ada2f943fbecd03062721031e02ab95a4d3714e
codeCheckedAgainst: "6.7.13.0"
keywords: ["ProductDefinition::CONFIG_KEY_DEFAULT_CMS_PAGE_PRODUCT", "CategoryDefinition::CONFIG_KEY_DEFAULT_CMS_PAGE_CATEGORY", "Defaults::CMS_PRODUCT_DETAIL_PAGE", "core.cms.default_product_cms_page", "core.cms.default_category_cms_page", "cmsPageId", "product_list", "ProductSubscriber", "CategorySubscriber", "default layout", "shopping experiences", "cms page fallback"]
summary: "ADR: default CMS layouts via system config core.cms.default_product_cms_page / core.cms.default_category_cms_page; 6.7 writes category defaults to DB."
lastBuilt: 2026-09-15
---
## What it is

An architecture decision record introducing a configurable default CMS page (layout) for products and categories. An entity without an assigned CMS page gets the default page id from the system config instead of a hard-coded Twig fallback.

## When to use

- A product or category shows a layout you did not assign, and you need to know where it comes from.
- You set, change, or read the default product/category layout programmatically.
- Repository data for `cmsPageId` differs from what is stored in the database.

## Key steps / config

1. The default page ids live in the system config:
   - `\Shopware\Core\Content\Product\ProductDefinition::CONFIG_KEY_DEFAULT_CMS_PAGE_PRODUCT` = `core.cms.default_product_cms_page` (products; initially `\Shopware\Core\Defaults::CMS_PRODUCT_DETAIL_PAGE`)
   - `\Shopware\Core\Content\Category\CategoryDefinition::CONFIG_KEY_DEFAULT_CMS_PAGE_CATEGORY` = `core.cms.default_category_cms_page` (categories; a CMS page of type `product_list`)
2. Products: to use the default, leave `product.cmsPageId` as `null`. `ProductSubscriber` handles the product loaded events (`product.loaded`, `product.partial_loaded` and their `sales_channel.` variants); if `cmsPageId` is `null` it assigns the configured default, per sales channel for storefront loads.
3. Categories (installed 6.7 code differs from the ADR): `CategorySubscriber::beforeWriteCategory()` listens to `EntityWriteEvent` and writes the configured default into `cms_page_id` when a category is inserted without one or updated with `cms_page_id` set to `null`, provided the page exists in the live version. A 6.7 migration backfills `category` rows of type `page` whose `cms_page_id` is `NULL`.
4. `CmsPageDefaultChangeSubscriber` blocks deleting a CMS page that is currently a default, and blocks clearing the overall (not sales-channel-specific) default.

## Essential identifiers

- `ProductDefinition::CONFIG_KEY_DEFAULT_CMS_PAGE_PRODUCT`, `CategoryDefinition::CONFIG_KEY_DEFAULT_CMS_PAGE_CATEGORY`
- `Defaults::CMS_PRODUCT_DETAIL_PAGE`
- `Shopware\Core\Content\Product\Subscriber\ProductSubscriber`
- `Shopware\Core\Content\Category\Subscriber\CategorySubscriber`
- `Shopware\Core\Content\Cms\Subscriber\CmsPageDefaultChangeSubscriber`

## Gotchas

- For products the `cmsPageId` stored in the database can differ from the one returned by the repository, because the default is injected at load time. An entity must not have its own CMS page id to use the default.
- The ADR says category `cmsPageId` is also set to `null` and filled at `entity.loaded`; in 6.7.13 categories instead store the default id in the database on write, so changing the category default later does not update categories that already received the old id.

## Version notes

- The original 6.4 migration set both config keys and nulled `category.cms_page_id` values equal to the default. A 6.7 migration reverses this for categories of type `page` by writing the configured default back into `cms_page_id`.

## Code check (6.7.13.0)
- confirmed `CONFIG_KEY_DEFAULT_CMS_PAGE_PRODUCT` — value core.cms.default_product_cms_page — vendor/shopware/core/Content/Product/ProductDefinition.php:87
- confirmed `CONFIG_KEY_DEFAULT_CMS_PAGE_CATEGORY` — value core.cms.default_category_cms_page — vendor/shopware/core/Content/Category/CategoryDefinition.php:75
- confirmed `CMS_PRODUCT_DETAIL_PAGE` — constant exists in Defaults — vendor/shopware/core/Defaults.php:44
- confirmed `ProductSubscriber::setDefaultLayout()` — assigns default when cmsPageId is null on load — vendor/shopware/core/Content/Product/Subscriber/ProductSubscriber.php:235
- corrected `CategorySubscriber::beforeWriteCategory()` — docs: category cmsPageId null, default injected at entity.loaded; code writes default on insert/update — vendor/shopware/core/Content/Category/Subscriber/CategorySubscriber.php:58
- corrected `Migration1776691515SetDefaultCmsPageIdForCategories` — docs: categories keep null; migration backfills page-type categories — vendor/shopware/core/Migration/V6_7/Migration1776691515SetDefaultCmsPageIdForCategories.php:17
- confirmed `product_list` — default category page chosen from this cms page type — vendor/shopware/core/Migration/V6_4/Migration1650620993SetDefaultCmsPagesAndSetCategoryCmsPageToNull.php:27
- confirmed `CmsPageDefaultChangeSubscriber::beforeDeletion()` — prevents deleting a default cms page — vendor/shopware/core/Content/Cms/Subscriber/CmsPageDefaultChangeSubscriber.php:53
