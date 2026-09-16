---
id: platform/dev/6.7/concepts/commerce/catalog/sales-channels.md
title: Sales Channels
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/concepts/commerce/catalog/sales-channels.html
sourceHash: b6e35439c5f1c1e9a9d59ddfc0a92cdd60f082df
codeCheckedAgainst: "6.7.13.0"
keywords: ["sales_channel", "sales_channel_domain", "product_visibility", "main_category", "SalesChannelContextService", "SalesChannelContext", "SalesChannelContextCreatedEvent", "SalesChannelContextSwitchEvent", "SalesChannelContextRestoredEvent", "hreflangActive", "homeCmsPageId", "/store-api/context", "storefront channel", "headless", "domains"]
summary: Sales channel concept - defaults, domains, navigation/footer/service roots, product_visibility, context creation, Store API routes and context events.
lastBuilt: 2026-09-15
---
## What it is

Concept page for sales channels: how one Shopware instance exposes its catalog to several audiences (Storefront, headless Store API, product feed, custom/app types), each with its own defaults, domains, navigation roots and product visibility.

## When to use

Setting up multiple stores, domains or languages/currencies per store; debugging why a product does not appear in a channel; hooking into sales channel context creation or switching.

## Key steps / config

A sales channel controls:

- Type: Storefront, headless, product feed, or custom.
- Audience defaults: language, currency, country, tax calculation mode, customer group, default payment/shipping method.
- Navigation roots: `navigationCategoryId` (required), `footerCategoryId`, `serviceCategoryId`; storefront menus are built from the children of these categories; listings under them merge explicit product assignments and, if configured, dynamic product streams.
- Presentation: `homeCmsPageId` (home layout with channel-specific slot config) and theme config for Storefront channels.
- Availability: allowed domains, payment/shipping methods, languages, currencies, countries, and product visibility.

Data model:

| Table | Purpose |
|---|---|
| `sales_channel` | defaults, navigation roots, home CMS page, `accessKey`, `maintenance` flag, hreflang config |
| `sales_channel_domain` | URL + language + currency + snippet set; matched by host/path to build the context |
| `sales_channel_translation` | localized name and home page fields |
| `product_visibility` | per-channel visibility row; required for a product to appear |
| `sales_channel_*` mappings | additional currencies, languages, countries, payment and shipping methods |
| `main_category` | canonical category per product and channel for SEO URLs |

Domains: each domain pins language, currency and snippet set (e.g. `https://de.example.com` → de-DE, EUR). `hreflangActive` and `hreflangDefaultDomainId` control hreflang links across domains.

Product visibility levels (`ProductVisibilityDefinition`): `VISIBILITY_LINK = 10`, `VISIBILITY_SEARCH = 20`, `VISIBILITY_ALL = 30` — they decide whether a product is searchable and/or directly reachable.

Context: requests resolve the channel by access key or matched domain; `SalesChannelContextService` builds a `SalesChannelContext` with the defaults plus token, customer, rule-based pricing and permissions. Store API routes such as `/store-api/context` (GET, PATCH to switch), `/store-api/navigation/{activeId}/{rootId}` and `/store-api/category/{navigationId}` filter data by that context.

Extension points:

- `SalesChannelContextCreatedEvent` — dispatched by `SalesChannelContextService` after the context is built.
- `SalesChannelContextSwitchEvent` — dispatched when `PATCH /store-api/context` switches currency, language, payment, shipping or addresses.
- `SalesChannelContextRestoredEvent` — dispatched by `CartRestorer` when a stored customer context is restored.
- Entity extensions / custom fields on `sales_channel` or mapping entities.

## Essential identifiers

- Entities: `sales_channel`, `sales_channel_domain`, `sales_channel_translation`, `product_visibility`, `main_category`
- Fields: `navigationCategoryId`, `footerCategoryId`, `serviceCategoryId`, `homeCmsPageId`, `hreflangActive`, `hreflangDefaultDomainId`, `accessKey`
- Services: `SalesChannelContextService`, `SalesChannelContext`
- Events: `SalesChannelContextCreatedEvent`, `SalesChannelContextSwitchEvent`, `SalesChannelContextRestoredEvent`

## Gotchas

- Use subdomains (`de.example.com`) rather than sub-paths (`example.com/de`) for fully isolated channels; mixing a root domain with sub-path channels shares cookies and can cause session conflicts.
- Without a `product_visibility` row for the channel, a product does not appear there.

## Code check (6.7.13.0)
- confirmed `navigationCategoryId` — FK field flagged Required; footer/service roots optional — vendor/shopware/core/System/SalesChannel/SalesChannelDefinition.php:117
- confirmed `hreflangDefaultDomainId` — FK to sales_channel_domain — vendor/shopware/core/System/SalesChannel/SalesChannelDefinition.php:125
- confirmed `hreflangActive` — bool field — vendor/shopware/core/System/SalesChannel/SalesChannelDefinition.php:134
- confirmed `homeCmsPageId` — FK to cms_page — vendor/shopware/core/System/SalesChannel/SalesChannelDefinition.php:158
- confirmed `ProductVisibilityDefinition::VISIBILITY_ALL` — levels 10/20/30 — vendor/shopware/core/Content/Product/Aggregate/ProductVisibility/ProductVisibilityDefinition.php:28
- confirmed `main_category` — entity name — vendor/shopware/core/Content/Seo/MainCategory/MainCategoryDefinition.php:22
- confirmed `SalesChannelContextCreatedEvent` — dispatched in SalesChannelContextService — vendor/shopware/core/System/SalesChannel/Context/SalesChannelContextService.php:118
- confirmed `SalesChannelContextSwitchEvent` — dispatched by context switch route — vendor/shopware/core/System/SalesChannel/SalesChannel/ContextSwitchRoute.php:156
- confirmed `SalesChannelContextRestoredEvent` — dispatched in CartRestorer — vendor/shopware/core/System/SalesChannel/Context/CartRestorer.php:248
- confirmed `/store-api/navigation/{activeId}/{rootId}` — navigation route — vendor/shopware/core/Content/Category/SalesChannel/NavigationRoute.php:69
