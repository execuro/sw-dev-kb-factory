---
id: platform/dev/6.7/guides/hosting/configurations/framework/routes.md
title: Custom routes
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/hosting/configurations/framework/routes.html
sourceHash: 1a80c4db74331615e938726a9630a43ce3d00c5c
codeCheckedAgainst: "6.7.13.0"
keywords: ["custom routes", "localized routes", "routes.yaml", "config/routes/routes.yaml", "frontend.wishlist.page", "WishlistController", "_routeScope", "_noStore", "multilingual urls", "route path per locale", "symfony routing"]
summary: Override a Storefront route path per locale (e.g. /wishlist and /merkliste) by redefining the route name in config/routes/routes.yaml.
lastBuilt: 2026-09-15
---
## What it is

How to give an existing Shopware route a different URL path per language by redefining it in the project's Symfony routing file, instead of the single path set in the controller's `#[Route]` attribute.

## When to use

In a multilingual shop where a Storefront page should use a translated path, e.g. `/wishlist` for English and `/merkliste` for German.

## Key steps / config

1. Find the route in the controller. The wishlist page is `Shopware\Storefront\Controller\WishlistController::index`, declared with path `/wishlist`, name `frontend.wishlist.page`, `options: ['seo' => false]`, `_noStore` default `true`, `GET` only. The Storefront route scope is set at class level.
2. Redefine the route with the same name in `config/routes/routes.yaml` (project root), giving `path` a map of locales:

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

3. Use the locale codes (e.g. `de-DE`) your shop actually uses as the keys under `path`.

## Essential identifiers

- `config/routes/routes.yaml`
- `frontend.wishlist.page`
- `Shopware\Storefront\Controller\WishlistController::index`
- `_routeScope` (value `storefront`), `_noStore`

## Gotchas

- The YAML definition replaces the attribute's defaults, so copy over everything the controller sets: `_routeScope` (set at class level on the controller, not on the method), `_noStore`, `methods` and `seo` option.

## Code check (6.7.13.0)
- confirmed `frontend.wishlist.page` — route name on the index action — vendor/shopware/storefront/Controller/WishlistController.php:59
- confirmed `WishlistController::index()` — action signature `(Request, SalesChannelContext): Response` — vendor/shopware/storefront/Controller/WishlistController.php:64
- confirmed `Shopware\Storefront\Controller` — controller namespace — vendor/shopware/storefront/Controller/WishlistController.php:3
- confirmed `ATTRIBUTE_NO_STORE` — `_noStore` default true on the route — vendor/shopware/storefront/Controller/WishlistController.php:61
- confirmed `_noStore` — constant value — vendor/shopware/core/PlatformRequest.php:79
- confirmed `_routeScope` — constant value, set at class level on the controller — vendor/shopware/core/PlatformRequest.php:77
- confirmed `storefront` — `StorefrontRouteScope::ID` — vendor/shopware/storefront/Framework/Routing/StorefrontRouteScope.php:14
- unverified `config/routes/routes.yaml` — project-level Symfony routing loading, out of scope
