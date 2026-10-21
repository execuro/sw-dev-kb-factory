---
id: platform/dev/6.7/resources/references/app-reference/script-reference/script-hooks-reference.md
title: Script hooks reference
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/app-reference/script-reference/script-hooks-reference.html
sourceHash: 8d51b03550f866de6050be38fc5707092e66514f
codeCheckedAgainst: "6.7.15.1"
keywords: ["script hooks", "app scripts", "product-page-loaded", "cart", "store-api-{hook}", "api-{hook}", "storefront-{hook}", "cache_key", "cache-invalidation", "product-pricing", "document-generation", "cookie-group-collect", "app-installed", "hook names"]
summary: List of all app script hook names in 6.7 (page loaded, cart, custom endpoints, app lifecycle, product pricing) with classes, data and available services.
lastBuilt: 2026-10-21
---
## What it is

The complete list of hook points where app scripts can run, grouped into Data Loading, Cart Manipulation, Custom API endpoint, App Lifecycle and Product. For each hook the source gives the name, hook class, data available on `hook`, the injectable `services.*`, and whether it is stoppable.

## When to use

Look up which hook name a script must use, what data it exposes (`page`, `cart`, `products`, ...), and which services (`repository`, `store`, `config`, `request`, `acl`, `cart`, `price`, `writer`, `response`, `cache`) it can call.

## Key steps / config

### Data Loading

Storefront page/pagelet hooks: data `context`, `page` (or `pagelet`), `salesChannelContext`; services `repository`, `config`, `store`, `request`, `acl`; not stoppable. Since 6.4.8.0 unless noted.

- Account: `customer-group-registration-page-loaded`, `account-guest-login-page-loaded`, `account-login-page-loaded`, `account-edit-order-page-loaded`, `account-order-page-loaded`, `account-overview-page-loaded`, `account-profile-page-loaded`, `account-recover-password-page-loaded` (6.4.13.0), `account-register-page-loaded`
- Address: `address-detail-page-loaded`, `address-book-widget-loaded`, `address-listing-page-loaded`
- Checkout: `checkout-cart-page-loaded`, `checkout-confirm-page-loaded`, `checkout-finish-page-loaded`, `checkout-info-widget-loaded`, `checkout-offcanvas-widget-loaded`, `checkout-register-page-loaded`
- Content: `cms-page-loaded`, `landing-page-loaded`, `maintenance-page-loaded`, `navigation-page-loaded`, `product-page-loaded`, `product-quick-view-widget-loaded`, `search-page-loaded`, `search-widget-loaded`, `sitemap-page-loaded`, `suggest-page-loaded`
- Wishlist: `guest-wishlist-page-loaded`, `wishlist-page-loaded`, `wishlist-widget-loaded`, `guest-wishlist-pagelet-loaded`
- Pagelets: `country-state-data-pagelet-loaded`, `footer-pagelet-loaded` (6.7.0.0), `header-pagelet-loaded` (6.7.0.0), `menu-offcanvas-pagelet-loaded`

Other data loading hooks (no `request` service; `document-generation` also has no `store`):

- `document-generation` (6.7.14.0, `DocumentGenerationHook`) — once per document, after order load and number allocation, before renderers; data `documentNumber`, `documentType`, `formats`, `orderId`, `orderVersionId`, `salesChannelId`.
- `payment-method-route-request` / `shipping-method-route-request` (6.5.0.0) — data `collection`, `onlyAvailable`.
- `cookie-group-collect` (6.7.14.0) — data `cookieGroups`; modify or remove cookie groups per sales channel.
- `product-reviews-widget-loaded` (6.6.9.0) — data `reviews`.

### Cart Manipulation

- `cart` (`Shopware\Core\Checkout\Cart\Hook\CartHook`) — during cart calculation; data `cart`; services `cart`, `price`, `config`, `acl`.

### Custom API endpoint

- `cache-invalidation` — on every entity write; data `event`; services `cache`, `acl`.
- `api-{hook}` (`Shopware\Core\Framework\Script\Api\ApiHook`) — `/api/script/{hook}`; stoppable; services `repository`, `writer`, `config`, `response`, `acl`.
- `response` (6.6.10.0) — on every response; data `response`, `routeName`, `routeScopes`; service `acl`.
- `storefront-{hook}` (`Shopware\Storefront\Framework\Script\Api\StorefrontHook`) — `/storefront/script/{hook}`; stoppable; services `repository`, `config`, `store`, `writer`, `response`, `request`, `acl`.
- `store-api-{hook}` — interface hook for `/store-api/script/{hook}` with two functions:
  - `cache_key` (optional) — provides a cache key from the request; implement it when the route should be cached; service `acl`.
  - `response` (required) — provides the HTTP response; only called when nothing is cached for the key or no `cache_key` exists; services as `storefront-{hook}`.

### App Lifecycle

`app-activated`, `app-deactivated`, `app-deleted`, `app-installed`, `app-updated` — data `event`; services `repository`, `config`, `writer`, `acl`.

### Product

- `product-pricing` (6.5.1.0, `Shopware\Core\Content\Product\Hook\Pricing\ProductPricingHook`) — when product prices are calculated; data `products`; services `repository`, `price`, `config`, `store`, `acl`.

## Essential identifiers

- Hook names above (used as the script directory name)
- `Shopware\Core\Framework\Script\Api\ApiHook`, `Shopware\Core\Framework\Script\Api\StoreApiCacheKeyHook`, `Shopware\Core\Framework\Script\Api\StoreApiResponseHook`
- `Shopware\Storefront\Framework\Script\Api\StorefrontHook`, `Shopware\Core\Checkout\Cart\Hook\CartHook`

## Gotchas

- `account-register-page-loaded` exposes an `AccountLoginPage` as `page`, per the source.
- `account-order-detail-page-loaded` (`Shopware\Storefront\Page\Account\Order\AccountOrderDetailPageLoadedHook`, page `Shopware\Storefront\Page\Account\Order\AccountOrderDetailPage`) is still listed by the docs but deprecated in code, to be removed in v6.8.0 without replacement.
- Only `api-{hook}`, `storefront-{hook}` and the `store-api-{hook}` functions are stoppable.

## Version notes

6.7.0.0 added `footer-pagelet-loaded` and `header-pagelet-loaded`; 6.7.14.0 added `document-generation` and `cookie-group-collect`.

## Code check (6.7.15.1)
- deprecated `Shopware\Storefront\Page\Account\Order\AccountOrderDetailPageLoadedHook` — `@deprecated tag:v6.8.0`, removed without replacement — vendor/shopware/storefront/Page/Account/Order/AccountOrderDetailPageLoadedHook.php:20
- deprecated `Shopware\Storefront\Page\Account\Order\AccountOrderDetailPage` — `@deprecated tag:v6.8.0`, removed without replacement — vendor/shopware/storefront/Page/Account/Order/AccountOrderDetailPage.php:12
- confirmed `DocumentGenerationHook::HOOK_NAME` — `document-generation`, since 6.7.14.0 — vendor/shopware/core/Checkout/DocumentV2/Event/Hooks/DocumentGenerationHook.php:25
- confirmed `CookieGroupCollectHook::HOOK_NAME` — `cookie-group-collect` — vendor/shopware/core/Content/Cookie/Hook/CookieGroupCollectHook.php:30
- confirmed `CartHook::HOOK_NAME` — `cart` — vendor/shopware/core/Checkout/Cart/Hook/CartHook.php:25
- confirmed `ApiHook::HOOK_NAME` — `api-{hook}`, implements `StoppableHook` — vendor/shopware/core/Framework/Script/Api/ApiHook.php:30
- confirmed `StoreApiCacheKeyHook::FUNCTION_NAME` — `cache_key`, an `OptionalFunctionHook` — vendor/shopware/core/Framework/Script/Api/StoreApiCacheKeyHook.php:27
- confirmed `StoreApiResponseHook::FUNCTION_NAME` — `response`, a required `FunctionHook` — vendor/shopware/core/Framework/Script/Api/StoreApiResponseHook.php:34
- confirmed `StorefrontHook::HOOK_NAME` — `storefront-{hook}` — vendor/shopware/storefront/Framework/Script/Api/StorefrontHook.php:34
- confirmed `ProductPricingHook::HOOK_NAME` — `product-pricing` — vendor/shopware/core/Content/Product/Hook/Pricing/ProductPricingHook.php:26
