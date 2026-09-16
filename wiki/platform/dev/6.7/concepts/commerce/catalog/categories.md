---
id: platform/dev/6.7/concepts/commerce/catalog/categories.md
title: Categories
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/concepts/commerce/catalog/categories.html
sourceHash: 6b962fabcadc6578ccf7df73d5f652b739a908ee
codeCheckedAgainst: "6.7.13.0"
keywords: ["CategoryDefinition", "productAssignmentType", "cmsPageId", "/store-api/navigation/{activeId}/{rootId}", "/store-api/category/{navigationId}", "NavigationLoadedEvent", "ProductListingCriteriaEvent", "SeoUrlUpdateEvent", "CategoryIndexerEvent", "category tree", "navigation menu", "dynamic product groups", "product stream"]
summary: Category entity tree, types page/folder/link, sales channel entry points, Store API navigation/category routes, listing assignment, CMS and SEO events.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/concepts/commerce/content/shopping-experiences-cms.md"]
---
## What it is

Developer view of Shopware categories: one category tree that organizes products, drives storefront navigation and produces SEO URLs. Each sales channel picks entry points inside that tree.

## When to use

When reading or extending category data, building headless navigation via the Store API, changing how category listings are filtered, or reacting to category indexing and SEO URL regeneration.

## Key steps / config

**Model (`category` entity, `CategoryDefinition`)**
- Tree fields: parent id (`ParentFkField`), `path`, `level`, plus a write-protected translated `breadcrumb`.
- Flags: `active` (participates in navigation/listings), `visible`.
- `type`: `page` (listing/landing page), `folder` (structuring element), `link`. Link targets use `linkType` = `external`, `category`, `product` or `landing_page` (with `externalLink` for external).
- `productAssignmentType` (required): `product` (explicit assignment) or `product_stream` (Dynamic Product Group via `productStreamId`).
- `cmsPageId` → CMS layout; category-specific slot overrides are stored as translated `slotConfig`.
- Translated SEO fields: `metaTitle`, `metaDescription`, `keywords`; `seoUrls` association.

**Sales channel entry points**: `navigationCategoryId` (required), `footerCategoryId`, `serviceCategoryId`.

**Store API routes**
- `/store-api/navigation/{activeId}/{rootId}` — hierarchical menu.
- `/store-api/category/{navigationId}` — category plus resolved CMS page; `navigationId` may be `home` (resolves to the sales channel navigation category).
- `/store-api/product-listing/{categoryId}` — `ProductListingRoute`.

**Listing**: `ProductListingRoute` uses either the product stream (when `productAssignmentType` is `product_stream` and a `productStreamId` is set) or a filter on `product.categoriesRo.id` (read-only category tree, `product_category_tree`) — one or the other, not both. Alter the listing criteria with `ProductListingCriteriaEvent`.

**CMS**: CMS page load in `CategoryRoute` uses the category's own `cmsPageId` (or the sales channel `homeCmsPageId` for the navigation root) with merged slot config. `folder` categories that are not the navigation root return "category not found"; `link` categories return the category without a page.

## Essential identifiers

- `Shopware\Core\Content\Category\CategoryDefinition` (`TYPE_PAGE`, `TYPE_FOLDER`, `TYPE_LINK`, `PRODUCT_ASSIGNMENT_TYPE_PRODUCT`, `PRODUCT_ASSIGNMENT_TYPE_PRODUCT_STREAM`)
- `NavigationLoadedEvent` — dispatched by `NavigationLoader` after loading the tree; enrich or adjust nodes.
- `SalesChannelCategoryIdsFetchedEvent` — category IDs resolved for a sales channel (dispatched by the sitemap `CategoryUrlProvider`).
- `CategoryIndexerEvent` — after category indexing; sync de-normalized data or external indices.
- `ProductListingCriteriaEvent` — customize listing filters, sorting, aggregations.
- `SeoUrlUpdateEvent` — dispatched by `SeoUrlPersister` when SEO URLs are written.

## Gotchas

- The docs mention `hideInNavigation` and robot flags `noIndex`/`noFollow`; none of these strings exist in the installed Shopware code — do not rely on them as field names.
- The docs say explicit and stream assignments are merged for a listing and that a missing `cmsPageId` inherits the parent layout; the installed `ProductListingRoute`/`CategoryRoute` do neither (see Code check).
- `NavigationRouteCacheKeyEvent` and `NavigationRouteCacheTagsEvent`, which the docs recommend for navigation cache identity/tags, are deprecated ("not used anymore") and removed in 6.8.0.
- Categories are extensible via custom fields or entity extensions; expose custom data to storefronts via Store API response extensions.

## Version notes

- 6.8.0: `NavigationRouteCacheKeyEvent` and `NavigationRouteCacheTagsEvent` removed.

## Code check (6.7.13.0)
- confirmed `CategoryDefinition::TYPE_FOLDER` — types page/link/folder — vendor/shopware/core/Content/Category/CategoryDefinition.php:61
- confirmed `productAssignmentType` — required field, values product/product_stream — vendor/shopware/core/Content/Category/CategoryDefinition.php:138
- confirmed `/store-api/navigation/{activeId}/{rootId}` — NavigationRoute path — vendor/shopware/core/Content/Category/SalesChannel/NavigationRoute.php:69
- confirmed `/store-api/category/{navigationId}` — CategoryRoute path — vendor/shopware/core/Content/Category/SalesChannel/CategoryRoute.php:56
- corrected `PRODUCT_ASSIGNMENT_TYPE_PRODUCT_STREAM` — docs: both assignment types merged; code uses stream or categoriesRo filter — vendor/shopware/core/Content/Product/SalesChannel/Listing/ProductListingRoute.php:108
- corrected `getCmsPageId()` — docs: parent layout inherited when missing; route returns category without page — vendor/shopware/core/Content/Category/SalesChannel/CategoryRoute.php:85
- deprecated `NavigationRouteCacheKeyEvent` — removed in 6.8.0, not used anymore — vendor/shopware/core/Content/Category/Event/NavigationRouteCacheKeyEvent.php:16
- deprecated `NavigationRouteCacheTagsEvent` — removed in 6.8.0, not used anymore — vendor/shopware/core/Content/Category/Event/NavigationRouteCacheTagsEvent.php:17
- confirmed `ProductListingCriteriaEvent` — dispatched when resolving listing criteria — vendor/shopware/core/Content/Product/SalesChannel/Listing/ResolveCriteriaProductListingRoute.php:42
- absent `hideInNavigation` — not found in installed code, nor `noIndex`/`noFollow`
