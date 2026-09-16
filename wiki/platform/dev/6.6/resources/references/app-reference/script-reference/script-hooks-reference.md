---
id: platform/dev/6.6/resources/references/app-reference/script-reference/script-hooks-reference.md
title: Script hooks reference
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/resources/references/app-reference/script-reference/script-hooks-reference.html
sourceHash: 855928009801db2771a5af878cf87d86844ec928
keywords: ["script hooks", "PageLoadedHook", "CartHook", "api-{hook}", "store-api-{hook}", "storefront-{hook}", "cache-invalidation", "app-activated", "product-pricing", "Available Services", "Stoppable", "cache_key function"]
summary: "Catalog of Shopware script hooks (data loading, cart manipulation, custom API endpoints, app lifecycle) with class, data and stoppability."
lastBuilt: 2026-09-15
---
## What it is

This page catalogs every hook that can be attached to in app scripts, grouped by category: Data Loading, Cart Manipulation, Custom API endpoint, and App Lifecycle. Each hook entry documents its `Name`, `Since` version, `Class`, `Description`, `Available Data`, `Available Services`, and whether it is `Stoppable`.

## Key steps / config

**Data Loading** hooks fire when a storefront page or pagelet is loaded (e.g. `payment-method-route-request` since `6.5.0.0`, class `Shopware\Core\Checkout\Payment\Hook\PaymentMethodRouteHook`; `product-page-loaded` since `6.4.8.0`, class `Shopware\Storefront\Page\Product\ProductPageLoadedHook`; similarly `cms-page-loaded`, `search-page-loaded`, `checkout-cart-page-loaded`, `checkout-confirm-page-loaded`, `checkout-finish-page-loaded`, `account-*-page-loaded`, `wishlist-*-loaded`, `address-*-loaded`, `navigation-page-loaded`, `sitemap-page-loaded`, `suggest-page-loaded`). All expose `context` (`Shopware\Core\Framework\Context`) and `salesChannelContext` (`Shopware\Core\System\SalesChannel\SalesChannelContext`) plus a `page`/`collection`/`pagelet` object matching the hook, and grant the services `repository`, `config`, `store`. None are stoppable.

**Cart Manipulation** has one hook, `cart` (since `6.4.8.0`, class `Shopware\Core\Checkout\Cart\Hook\CartHook`), triggered during cart calculation; data: `salesChannelContext`, `cart` (`Shopware\Core\Checkout\Cart\Cart`), `context`; services: `cart`, `config`; not stoppable.

**Custom API endpoint** hooks include: `cache-invalidation` (since `6.4.9.0`, class `Shopware\Core\Framework\Adapter\Cache\Script\CacheInvalidationHook`, triggered on every entity write, data: `event` → `WrittenEventScriptFacade`, service: `cache`, not stoppable); `api-{hook}` (since `6.4.9.0`, class `Shopware\Core\Framework\Script\Api\ApiHook`, triggered by `/api/script/{hook}`, data includes `name`, `request`, `context`, `isPropagationStopped`, `scriptResponse`, services `repository`/`writer`/`config`/`response`, stoppable `true`); a `response` sub-hook (since `6.6.10.4`, class `Shopware\Core\Framework\Script\Api\ResponseHook`, fires on every response, data `routeName`, `routeScopes`, `context`, no services, stoppable `false`); `store-api-{hook}` (interface hook, triggered by `/store-api/script/{hook}`) with two functions — `cache_key` (optional, class `Shopware\Core\Framework\Script\Api\StoreApiCacheKeyHook`, since `6.4.9.0`, provides a cache key from the request, stoppable `true`) and `response` (required, class `Shopware\Core\Framework\Script\Api\StoreApiResponseHook`, since `6.4.9.0`, only runs when no cached response exists for the cache key, services `repository`/`config`/`store`/`writer`/`response`, stoppable `true`); `storefront-{hook}` (since `6.4.9.0`, class `Shopware\Storefront\Framework\Script\Api\StorefrontHook`, triggered by `/storefront/script/{hook}`, data includes `page`, services `repository`/`config`/`store`/`writer`/`response`, stoppable `true`).

**App Lifecycle** hooks: `app-activated`, `app-deactivated`, `app-deleted`, `app-installed`, `app-updated` (all since `6.4.9.0`, classes under `Shopware\Core\Framework\App\Event\Hooks\*Hook`, data `event` plus `context`, services `repository`/`config`/`writer`, not stoppable), and `product-pricing` (since `6.5.1.0`, class `Shopware\Core\Content\Product\Hook\Pricing\ProductPricingHook`, triggered when product prices are calculated for the store, data `products` (array), `salesChannelContext`, `context`, services `repository`/`price`/`config`/`store`, not stoppable).

## Essential identifiers

- `Shopware\Core\Checkout\Cart\Hook\CartHook` (hook name `cart`)
- `Shopware\Core\Framework\Script\Api\ApiHook` (`api-{hook}`), `StoreApiCacheKeyHook`/`StoreApiResponseHook` (`store-api-{hook}`)
- `Shopware\Storefront\Framework\Script\Api\StorefrontHook` (`storefront-{hook}`)
- `Shopware\Core\Framework\Adapter\Cache\Script\CacheInvalidationHook` (`cache-invalidation`)
- `Shopware\Core\Framework\Script\Api\ResponseHook` (`response`, since `6.6.10.4`)
- `Shopware\Core\Content\Product\Hook\Pricing\ProductPricingHook` (`product-pricing`, since `6.5.1.0`)
- `Shopware\Core\Framework\App\Event\Hooks\AppActivatedHook`/`AppDeactivatedHook`/`AppDeletedHook`/`AppInstalledHook`/`AppUpdatedHook`

## Version notes

- `payment-method-route-request` and `shipping-method-route-request` were added in `6.5.0.0`.
- Most page-loaded storefront hooks were added in `6.4.8.0`; `account-recover-password-page-loaded` in `6.4.13.0`.
- `cache-invalidation`, `api-{hook}`, `store-api-{hook}` functions and `storefront-{hook}` were added in `6.4.9.0`.
- `product-pricing` was added in `6.5.1.0`.
- The `response` hook (fires on every response) was added in `6.6.10.4`.
