---
id: platform/dev/6.7/guides/hosting/configurations/framework/routes.md
title: Custom routes
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/hosting/configurations/framework/routes.html
sourceHash: 1a80c4db74331615e938726a9630a43ce3d00c5c
codeCheckedAgainst: "6.7.15.1"
keywords: ["routes.yaml", "config/routes/routes.yaml", "frontend.wishlist.page", "WishlistController::index", "Shopware\\Storefront\\Controller\\WishlistController", "localized routes", "translated urls", "multilingual paths", "_routeScope", "_noStore", "symfony routing", "merkliste"]
summary: Override a storefront route path per locale (e.g. /wishlist vs /merkliste) by redefining the route name in config/routes/routes.yaml.
lastBuilt: 2026-10-21
---
## What it is

How to give an existing Shopware route a different URL per language. Routes are normally declared via `#[Route]` attributes in core/plugin controllers; Symfony loads `config/routes/routes.yaml`, where you can define the same route name with locale-specific `path` values.

## When to use

A multilingual shop where a storefront page should have a translated URL, e.g. `/wishlist` for English and `/merkliste` for German, instead of the single path set in the controller attribute.

## Key steps / config

1. Find the route's name, controller and attributes. The wishlist page is declared on `Shopware\Storefront\Controller\WishlistController::index`:

   ```php
   #[Route(path: '/wishlist', name: 'frontend.wishlist.page', options: ['seo' => false], defaults: ['_noStore' => true], methods: ['GET'])]
   public function index(Request $request, SalesChannelContext $context): Response
   ```

   The controller class additionally carries a class-level route default `_routeScope: ['storefront']`.

2. Define the route by name in `ROOT/config/routes/routes.yaml`, giving `path` a map of locales and repeating controller, methods, defaults and options:

   ```yaml
   frontend.wishlist.page:
     path:
       en-GB: '/wishlist'
       de-DE: '/merkliste'
     controller: 'Shopware\Storefront\Controller\WishlistController::index'
     methods: ['GET']
     defaults:
       _noStore: true
       _routeScope: ['storefront']
     options:
       seo: false
   ```

3. Use the locale codes (e.g. `de-DE`) your shop actually uses as the `path` keys.

## Essential identifiers

- `config/routes/routes.yaml`
- `frontend.wishlist.page`
- `Shopware\Storefront\Controller\WishlistController::index`
- `_routeScope` (`['storefront']`), `_noStore`, `options.seo`

## Code check (6.7.15.1)
- confirmed `frontend.wishlist.page` — route name on the wishlist index action, path `/wishlist`, `seo` false, GET — vendor/shopware/storefront/Controller/WishlistController.php:59
- confirmed `WishlistController::index()` — signature `index(Request, SalesChannelContext): Response` — vendor/shopware/storefront/Controller/WishlistController.php:64
- confirmed `WishlistPageLoadedHook` — fired for logged-in non-guest customers — vendor/shopware/storefront/Controller/WishlistController.php:70
- confirmed `GuestWishlistPageLoadedHook` — fired otherwise — vendor/shopware/storefront/Controller/WishlistController.php:73
- confirmed `_noStore` — value of `PlatformRequest::ATTRIBUTE_NO_STORE`, set to true on the route — vendor/shopware/core/PlatformRequest.php:81
- confirmed `_routeScope` — value of `PlatformRequest::ATTRIBUTE_ROUTE_SCOPE`, set at class level on WishlistController — vendor/shopware/core/PlatformRequest.php:78
- confirmed `StorefrontRouteScope::ID` — equals `storefront` — vendor/shopware/storefront/Framework/Routing/StorefrontRouteScope.php:14
