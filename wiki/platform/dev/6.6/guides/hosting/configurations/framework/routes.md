---
id: platform/dev/6.6/guides/hosting/configurations/framework/routes.md
title: Custom routes
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/hosting/configurations/framework/routes.html
sourceHash: 1a80c4db74331615e938726a9630a43ce3d00c5c
keywords: ["custom routes", "routes.yaml", "route localization", "multilingual routes", "frontend.wishlist.page", "controller route", "symfony routing", "_routeScope", "seo option"]
summary: "How to override Shopware's default controller routes per locale using config/routes/routes.yaml."
lastBuilt: "2026-09-15"
---
## What it is

Describes how to configure custom, locale-specific paths for routes that are otherwise defined in the core's or a plugin's controllers, using an example based on the wishlist route.

## When to use

Use this when a multilingual shop needs a different URL per language for the same route (e.g. `/wishlist` for English, `/merkliste` for German) instead of the single default path defined in the controller.

## Key steps / config

The default route (e.g. wishlist) is defined via a controller attribute:

```php
#[Route(path: '/wishlist', name: 'frontend.wishlist.page', options: ['seo' => false], defaults: ['_noStore' => true], methods: ['GET'])]
```

To override the path per locale, add an entry to `config/routes/routes.yaml` (loaded by Symfony) using the route's name:

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

The `path` key can list one path per locale (e.g. `de-DE`) that the shop supports.

## Essential identifiers

- `config/routes/routes.yaml`
- `frontend.wishlist.page` route name
- `Shopware\Storefront\Controller\WishlistController::index`
- `_routeScope`, `_noStore`, `seo` route options
