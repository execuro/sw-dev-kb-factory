---
id: platform/dev/6.7/resources/references/app-reference/script-reference/script-hooks-reference.md
title: Script hooks reference
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/app-reference/script-reference/script-hooks-reference.html
sourceHash: 8d51b03550f866de6050be38fc5707092e66514f
codeCheckedAgainst: "6.7.13.0"
keywords: ["script hooks", "app scripts", "HOOK_NAME", "PageLoadedHook", "product-page-loaded", "checkout-cart-page-loaded", "CartHook", "ApiHook", "StoreApiResponseHook", "StoreApiCacheKeyHook", "StorefrontHook", "ProductPricingHook", "AppInstalledHook", "cache-invalidation", "available services"]
summary: "List of app script hook names, hook classes, available data and services: page/pagelet loaded, cart, api/store-api/storefront endpoints, app lifecycle, pricing."
lastBuilt: 2026-09-15
---
## What it is

The full list of hook points app scripts can attach to, grouped by use case (data loading, cart manipulation, custom API endpoints, app lifecycle, product). For each hook: its name (the `HOOK_NAME` constant), the hook class, the data exposed to the script, the available `services.*`, and whether it is stoppable.

## When to use

Look up which hook name to use for a script, which variables (`page`, `cart`, `hook.*`) and which services (`repository`, `store`, `config`, `request`, `writer`, `response`, `cache`, `price`, `cart`, `acl`) are available inside it.

## Key steps / config

### Data loading (not stoppable)

Storefront page/pagelet hooks expose `context`, `page` (or `pagelet`), `salesChannelContext`; services: `repository`, `config`, `store`, `request`, `acl`. Classes live under `Shopware\Storefront\Page\...` / `Shopware\Storefront\Pagelet\...`:

- Account: `customer-group-registration-page-loaded`, `account-guest-login-page-loaded`, `account-login-page-loaded`, `account-edit-order-page-loaded`, `account-order-page-loaded`, `account-overview-page-loaded`, `account-profile-page-loaded`, `account-recover-password-page-loaded` (since 6.4.13.0), `account-register-page-loaded`
- Address: `address-detail-page-loaded`, `address-book-widget-loaded`, `address-listing-page-loaded`
- Checkout: `checkout-cart-page-loaded`, `checkout-confirm-page-loaded`, `checkout-finish-page-loaded`, `checkout-info-widget-loaded`, `checkout-offcanvas-widget-loaded`, `checkout-register-page-loaded`
- Content: `cms-page-loaded` (page is `Shopware\Core\Content\Cms\CmsPageEntity`), `landing-page-loaded`, `maintenance-page-loaded`, `navigation-page-loaded`, `product-page-loaded`, `product-quick-view-widget-loaded`, `search-page-loaded`, `search-widget-loaded`, `sitemap-page-loaded`, `suggest-page-loaded`, `guest-wishlist-page-loaded`, `wishlist-page-loaded`, `wishlist-widget-loaded`
- Pagelets: `country-state-data-pagelet-loaded`, `footer-pagelet-loaded` and `header-pagelet-loaded` (both since 6.7.0.0), `menu-offcanvas-pagelet-loaded`, `guest-wishlist-pagelet-loaded`

Core data-loading hooks:

- `payment-method-route-request` — `Shopware\Core\Checkout\Payment\Hook\PaymentMethodRouteHook`; data `collection`, `onlyAvailable`, `salesChannelContext`.
- `shipping-method-route-request` — `Shopware\Core\Checkout\Shipping\Hook\ShippingMethodRouteHook`; same shape.
- `product-reviews-widget-loaded` — `Shopware\Core\Content\Product\SalesChannel\Review\ProductReviewsWidgetLoadedHook` (since 6.6.9.0); data `reviews` (`ProductReviewResult`); no `request` service.

### Cart manipulation

- `cart` — `Shopware\Core\Checkout\Cart\Hook\CartHook`; data `cart`, `salesChannelContext`; services `cart`, `price`, `config`, `acl`.

### Custom API endpoints

| Name | Class | Services | Stoppable |
|---|---|---|---|
| `cache-invalidation` | `Shopware\Core\Framework\Adapter\Cache\Script\CacheInvalidationHook` (data `event`) | `cache`, `acl` | no |
| `api-{hook}` | `Shopware\Core\Framework\Script\Api\ApiHook` (called on `/api/script/{hook}`) | `repository`, `writer`, `config`, `response`, `acl` | yes |
| `response` | `Shopware\Core\Framework\Script\Api\ResponseHook` (every response; since 6.6.10.0; data `response`, `routeName`, `routeScopes`) | `acl` | no |
| `store-api-{hook}` | interface hook for `/store-api/script/{hook}` | see functions | yes |
| `storefront-{hook}` | `Shopware\Storefront\Framework\Script\Api\StorefrontHook` (`/storefront/script/{hook}`) | `repository`, `config`, `store`, `writer`, `response`, `request`, `acl` | yes |

`store-api-{hook}` is an interface hook with two script functions:

- `cache_key` (optional) — `Shopware\Core\Framework\Script\Api\StoreApiCacheKeyHook`; needed when the Store-API route should be cached; data `cacheKey`, `query`, `request`; service `acl` only.
- `response` (required) — `Shopware\Core\Framework\Script\Api\StoreApiResponseHook`; only called when no cached response exists for the cache key or no `cache_key` is implemented; services `repository`, `config`, `store`, `writer`, `response`, `request`, `acl`.

### App lifecycle (not stoppable)

`app-activated`, `app-deactivated`, `app-deleted`, `app-installed`, `app-updated` — classes `Shopware\Core\Framework\App\Event\Hooks\AppActivatedHook` etc.; data `event` (e.g. `AppInstalledEvent`); services `repository`, `config`, `writer`, `acl`.

### Product

- `product-pricing` — `Shopware\Core\Content\Product\Hook\Pricing\ProductPricingHook` (since 6.5.1.0); data `products`, `salesChannelContext`; services `repository`, `price`, `config`, `store`, `acl`.

## Essential identifiers

- `Shopware\Core\Checkout\Cart\Hook\CartHook`
- `Shopware\Core\Framework\Script\Api\ApiHook`, `StoreApiCacheKeyHook`, `StoreApiResponseHook`, `ResponseHook`
- `Shopware\Storefront\Framework\Script\Api\StorefrontHook`
- `Shopware\Core\Framework\Adapter\Cache\Script\CacheInvalidationHook`
- `Shopware\Core\Content\Product\Hook\Pricing\ProductPricingHook`
- `Shopware\Core\Framework\App\Event\Hooks\AppInstalledHook`

## Gotchas

- `account-register-page-loaded` exposes `page` as `AccountLoginPage` per the source (description also says "AccountLoginPage").
- The `account-order-detail-page-loaded` hook (`Shopware\Storefront\Page\Account\Order\AccountOrderDetailPageLoadedHook`, page `Shopware\Storefront\Page\Account\Order\AccountOrderDetailPage`) is still listed in the docs but is deprecated in the installed code and will be removed in 6.8.0 without replacement.
- Only `api-{hook}`, `store-api-{hook}` and `storefront-{hook}` are stoppable.

## Version notes

- The docs list `document-generation` (`Shopware\Core\Checkout\DocumentV2\Event\Hooks\DocumentGenerationHook`) and `cookie-group-collect` (`Shopware\Core\Content\Cookie\Hook\CookieGroupCollectHook`) as since 6.7.14.0; neither exists in the installed 6.7.13.0.

## Code check (6.7.13.0)
- absent `Shopware\Core\Checkout\DocumentV2\Event\Hooks\DocumentGenerationHook` — documented as since 6.7.14.0; no `document-generation` hook in the installed code
- absent `Shopware\Core\Content\Cookie\Hook\CookieGroupCollectHook` — documented as since 6.7.14.0; no `cookie-group-collect` hook in the installed code
- deprecated `Shopware\Storefront\Page\Account\Order\AccountOrderDetailPageLoadedHook` — `@deprecated tag:v6.8.0`, removed without replacement — vendor/shopware/storefront/Page/Account/Order/AccountOrderDetailPageLoadedHook.php:20
- deprecated `Shopware\Storefront\Page\Account\Order\AccountOrderDetailPage` — `@deprecated tag:v6.8.0` — vendor/shopware/storefront/Page/Account/Order/AccountOrderDetailPage.php:12
- confirmed `CartHook::HOOK_NAME` — `cart` — vendor/shopware/core/Checkout/Cart/Hook/CartHook.php:25
- confirmed `ApiHook::HOOK_NAME` — `api-{hook}` — vendor/shopware/core/Framework/Script/Api/ApiHook.php:30
- confirmed `StoreApiCacheKeyHook::FUNCTION_NAME` — `cache_key` — vendor/shopware/core/Framework/Script/Api/StoreApiCacheKeyHook.php:27
- confirmed `StorefrontHook::HOOK_NAME` — `storefront-{hook}` — vendor/shopware/storefront/Framework/Script/Api/StorefrontHook.php:34
- confirmed `FooterPageletLoadedHook::HOOK_NAME` — `footer-pagelet-loaded` — vendor/shopware/storefront/Pagelet/Footer/FooterPageletLoadedHook.php:26
- confirmed `ProductPricingHook::HOOK_NAME` — `product-pricing` — vendor/shopware/core/Content/Product/Hook/Pricing/ProductPricingHook.php:26
