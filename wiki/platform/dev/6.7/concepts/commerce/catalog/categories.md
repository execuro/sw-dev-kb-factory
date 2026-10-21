---
id: platform/dev/6.7/concepts/commerce/catalog/categories.md
title: Categories
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/concepts/commerce/catalog/categories.html
sourceHash: 6b962fabcadc6578ccf7df73d5f652b739a908ee
codeCheckedAgainst: "6.7.15.1"
relatedPages: ["platform/dev/6.7/concepts/commerce/content/shopping-experiences-cms.md"]
keywords: ["category", "category tree", "navigation", "CategoryDefinition", "productAssignmentType", "cmsPageId", "product_category", "product_category_tree", "/store-api/navigation/{activeId}/{rootId}", "NavigationLoadedEvent", "ProductListingCriteriaEvent", "SeoUrlUpdateEvent", "dynamic product groups", "product stream"]
summary: "Category tree model: page/folder/link types, product vs stream assignment, CMS layout inheritance, Store API routes, SEO, events."
lastBuilt: 2026-10-21
---
## What it is

Developer view of categories in Shopware 6.7. A single category tree holds the whole catalog, organises products, drives storefront navigation and defines SEO-relevant URLs. Each sales channel picks entry categories (`navigation`, `footer`, `service`) inside that tree, and the storefront builds its menus from the children of those entry points.

## When to use

When building navigation, category listings, category-bound CMS layouts or SEO URLs, or when hooking into navigation or listing loading via events.

## Key steps / config

**Tree fields** on the `category` entity: `parentId`, `path` and `level` build breadcrumbs, infer inheritance and allow efficient traversal.

**Flags:** `active` decides whether the category takes part in navigation and listings; `visible` controls menu rendering without disabling the category.

**`type`** (default `page`):
- `page` — regular category (listing or landing page).
- `folder` — structuring element, not rendered as a page, ignores layouts.
- `link` — redirects immediately; `linkType` is `external`, `category`, `product` or `landing_page`.

**Product assignment** via `productAssignmentType` (default `product`):
- `product` — explicit links stored in `product_category`; inherited links live in `product_category_tree`.
- `product_stream` — a Dynamic Product Group (product stream) evaluates saved filters at runtime (brand filters, price ranges).

Both assignment types are merged for a category listing. `ProductListingRoute` builds the listing criteria from the category configuration, sales channel and request filters; alter the query with `ProductListingCriteriaEvent`.

**CMS layout:** `cmsPageId` references a CMS layout ([Shopping Experiences](platform/dev/6.7/concepts/commerce/content/shopping-experiences-cms.md)); when missing, the parent layout is used. Category-specific slot configuration (`slotConfig`, translated) is stored on the category and merged at runtime, so one layout can serve many categories with different media and copy.

**Store API:**
- `/store-api/navigation/{activeId}/{rootId}` — hierarchical menus; responses are cached. Use `NavigationLoadedEvent` to enrich or modify the tree before it is returned.
- `/store-api/category/{navigationId}` — category details including assigned CMS layout data.

**SEO:** translated `metaTitle`, `metaDescription`, `keywords`; SEO URLs (`seo_url`) are generated per category and sales channel domain from templates under *Settings → SEO*, and are rebuilt when categories change or the SEO indexer runs. URL templates (e.g. including the breadcrumb) and priorities are configurable per sales channel domain. Emit canonical links when rendering custom category pages.

**Related tables:** `category_translation` (localized names, breadcrumbs, links, SEO text), `product_stream`, `cms_page`, `sales_channel` (entry categories), `seo_url`.

## Essential identifiers

- `CategoryDefinition` (`category`), types `page`/`folder`/`link`
- `productAssignmentType`: `product` / `product_stream`
- `product_category`, `product_category_tree`, `product_stream`, `cms_page`, `seo_url`
- `NavigationLoadedEvent` — navigation tree loaded; enrich or adjust nodes
- `SalesChannelCategoryIdsFetchedEvent` — category IDs resolved for a sales channel
- `CategoryIndexerEvent` — keep de-normalised data or external search indices in sync
- `ProductListingCriteriaEvent` — listing filters, sorting, aggregations
- `SeoUrlUpdateEvent` — observe or react to SEO URL regeneration
- `ProductListingRoute`

## Gotchas

- The docs mention a hide-in-navigation flag (`hideInNavigation`); the installed code has no such field — only `visible` and `active`. An `active` category stays reachable by direct URL even when not shown in menus.
- The docs list robot flags `noIndex`/`noFollow` as per-category SEO fields; the installed code has no such identifiers.
- The docs suggest adjusting navigation cache identity or tags via `NavigationRouteCacheKeyEvent` and `NavigationRouteCacheTagsEvent`; both are deprecated in 6.7 ("not used anymore") and removed in 6.8.0.
- Categories are extensible via custom fields or entity extensions; expose custom data through Store API response extensions when storefronts or external channels need it.

## Code check (6.7.15.1)
- confirmed `CategoryDefinition::TYPE_FOLDER` — types `page`/`link`/`folder` — vendor/shopware/core/Content/Category/CategoryDefinition.php:61
- confirmed `CategoryDefinition::PRODUCT_ASSIGNMENT_TYPE_PRODUCT_STREAM` — values `product`/`product_stream`, default `product` — vendor/shopware/core/Content/Category/CategoryDefinition.php:73
- confirmed `cmsPageId` — FK to `cms_page` — vendor/shopware/core/Content/Category/CategoryDefinition.php:165
- absent `hideInNavigation` — no such field in the installed code; only `visible`/`active`
- absent `noIndex` — no category robots fields in the installed code
- confirmed `/store-api/category/{navigationId}` — route path — vendor/shopware/core/Content/Category/SalesChannel/CategoryRoute.php:56
- confirmed `product_category_tree` — inherited category links entity — vendor/shopware/core/Content/Product/Aggregate/ProductCategoryTree/ProductCategoryTreeDefinition.php:22
- deprecated `NavigationRouteCacheKeyEvent` — removed in 6.8.0, not used anymore — vendor/shopware/core/Content/Category/Event/NavigationRouteCacheKeyEvent.php:16
- deprecated `NavigationRouteCacheTagsEvent` — removed in 6.8.0, not used anymore — vendor/shopware/core/Content/Category/Event/NavigationRouteCacheTagsEvent.php:17
- confirmed `ProductListingCriteriaEvent` — listing criteria event — vendor/shopware/core/Content/Product/Events/ProductListingCriteriaEvent.php:17
