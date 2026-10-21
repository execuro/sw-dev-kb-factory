---
id: platform/dev/6.7/concepts/commerce/catalog/sales-channels.md
title: Sales Channels
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/concepts/commerce/catalog/sales-channels.html
sourceHash: b6e35439c5f1c1e9a9d59ddfc0a92cdd60f082df
codeCheckedAgainst: "6.7.15.1"
keywords: ["sales channel", "sales_channel", "sales_channel_domain", "product_visibility", "SalesChannelContext", "SalesChannelContextService", "SalesChannelContextCreatedEvent", "SalesChannelContextSwitchEvent", "/store-api/context", "hreflangActive", "homeCmsPageId", "navigation entry category", "domains", "storefront", "headless"]
summary: Shopware 6.7 sales channels - defaults, domains, navigation roots, product_visibility, SalesChannelContext creation, Store API context routes and events.
lastBuilt: 2026-10-20
---
## What it is

A sales channel defines how the catalog is exposed to one audience (Storefront, headless Store API client, product feed, or app). It carries defaults for language, currency, country, taxes, payment/shipping, domains and navigation roots, so one Shopware instance serves several "stores" without duplicating data.

## When to use

When setting up multiple stores, domains or languages, controlling which products appear in a channel, or extending the sales channel context in Store API/Storefront requests.

## Key steps / config

**`sales_channel`** holds: defaults (language, currency, country, `customerGroupId`, payment/shipping, `taxCalculationType` — `horizontal` (default) or `vertical`), navigation roots `navigationCategoryId` (required), `footerCategoryId`, `serviceCategoryId`, home layout `homeCmsPageId` with slot config, `accessKey` (Store API), `maintenance`, and hreflang config (`hreflangActive`, `hreflangDefaultDomainId`).

**Related entities:**
- `sales_channel_domain` — URL + language + currency + snippet set; matched by host/path to build the context.
- `sales_channel_translation` — localised channel name and home page fields.
- `product_visibility` — per-channel visibility row; required for a product to appear.
- `sales_channel_*` mappings (currencies, languages, countries, payment and shipping methods) — allowed values beyond the defaults.
- `cms_page` — optional home page layout.

**Domains:** one sales channel can have many domains, each pinning language, currency and snippet set (e.g. `https://de.example.com` → de-DE, EUR).

**Product availability:** each product needs a `product_visibility` row per channel; the visibility value decides whether it is searchable and/or directly accessible (`VISIBILITY_LINK` = 10, `VISIBILITY_SEARCH` = 20, `VISIBILITY_ALL` = 30). A canonical category per product and channel is stored in `main_category` for SEO URLs.

**Context creation:** requests resolve a sales channel by access key or matched domain; `SalesChannelContextService` builds a `SalesChannelContext` with these defaults plus token, customer, rule-based pricing and permissions. Store API routes `/store-api/context` (GET reads, PATCH switches), `/store-api/navigation/{activeId}/{rootId}` and `/store-api/category/{navigationId}` filter data by that context.

## Essential identifiers

- `Shopware\Core\System\SalesChannel\SalesChannelDefinition` (`sales_channel`)
- `Shopware\Core\System\SalesChannel\SalesChannelContext`
- `Shopware\Core\System\SalesChannel\Context\SalesChannelContextService`
- `SalesChannelContextCreatedEvent` — context built; enrich it or persist session data
- `SalesChannelContextSwitchEvent` — `/store-api/context` switched currency, language, payment, shipping or addresses
- `SalesChannelContextRestoredEvent` — stored context token restored
- `ProductVisibilityDefinition` (`product_visibility`), `main_category`

## Gotchas

- Use subdomains (`de.example.com`) rather than sub-paths (`example.com/de`) for fully isolated channels: combining the root domain with sub-path channels does not isolate cookies and can cause session conflicts.
- A product without a `product_visibility` row for a channel does not appear there.
- Extend via entity extensions or custom fields on `sales_channel` or mapping entities, and expose them in Store API responses as needed.

## Code check (6.7.15.1)
- confirmed `navigationCategoryId` — required FK; footer/service optional — vendor/shopware/core/System/SalesChannel/SalesChannelDefinition.php:120
- confirmed `hreflangActive` — bool field — vendor/shopware/core/System/SalesChannel/SalesChannelDefinition.php:137
- confirmed `accessKey` — required, Store API access key — vendor/shopware/core/System/SalesChannel/SalesChannelDefinition.php:134
- confirmed `homeCmsPageId` — FK to `cms_page` — vendor/shopware/core/System/SalesChannel/SalesChannelDefinition.php:161
- confirmed `ProductVisibilityDefinition::VISIBILITY_ALL` — visibility levels 10/20/30 — vendor/shopware/core/Content/Product/Aggregate/ProductVisibility/ProductVisibilityDefinition.php:31
- confirmed `main_category` — canonical category entity — vendor/shopware/core/Content/Seo/MainCategory/MainCategoryDefinition.php:25
- confirmed `SalesChannelContextService::get()` — returns `SalesChannelContext` — vendor/shopware/core/System/SalesChannel/Context/SalesChannelContextService.php:76
- confirmed `/store-api/context` — GET route; PATCH in ContextSwitchRoute — vendor/shopware/core/System/SalesChannel/SalesChannel/ContextRoute.php:21
- confirmed `SalesChannelContextSwitchEvent` — class exists — vendor/shopware/core/System/SalesChannel/Event/SalesChannelContextSwitchEvent.php:16
- confirmed `SalesChannelContextRestoredEvent` — class exists — vendor/shopware/core/System/SalesChannel/Event/SalesChannelContextRestoredEvent.php:14
