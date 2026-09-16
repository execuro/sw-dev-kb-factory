---
id: platform/dev/6.6/resources/references/adr/2021-08-10-storefront-coding-standards.md
title: Storefront coding standards
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/resources/references/adr/2021-08-10-storefront-coding-standards.html
sourceHash: 5f9eafef3b8cd033e08f7f2c4dcee80f61ce9a75
keywords: ["StorefrontController", "PageLoader", "PageletLoader", "route annotation", "frontend.", "_loginRequired", "_httpCache", "_routeScope", "createActionResponse", "storefront controller", "store-api route", "frontend routing"]
summary: "ADR documenting storefront route/controller/PageLoader conventions: naming, DAL access rules, and the Route annotation options."
lastBuilt: "2026-09-15"
---
## What it is

An architecture decision record codifying existing storefront coding standards for route annotations, controllers, and page/pagelet loaders, as a baseline to build on.

## Key steps / config

Route annotation schema:

```php
#[Route(path: '/example/endpoint/{id}', name: 'frontend.example.endpoint', options: ['seo' => false], defaults: ['id' => null, 'XmlHttpRequest' => true, '_loginRequired' => true, '_httpCache' => true], methods: ['GET', 'POST', 'DELETE'])]
```

- `name` must be unique and start with `frontend.`.
- `options.seo` (`true`/`false`) is currently the only supported option.
- `defaults.XmlHttpRequest` marks an ajax route (skips `renderStorefront`); `defaults._loginRequired` redirects with "permission denied" if not logged in; `defaults._httpCache` marks the route cacheable.
- `methods` is one or more of `GET`, `POST`, `DELETE`.

Controller rules:

- Each controller/route requires a `#[Route(...)]` with path, name and methods; the class-level route needs `#[Route(defaults: ['_routeScope' => ['storefront']])]`.
- A storefront controller must extend `\Shopware\Storefront\Controller\StorefrontController`, must be a public service, must never contain business logic, and must never use a repository directly — data access goes through a PageLoader or a store-api route.
- GET routes that render pages call a PageLoader; write operations build their response with `createActionResponse` and call a corresponding store-api route.
- Dependencies are injected via the constructor, except the container and twig, injected via `setContainer`/`setTwig`.

PageLoader/PageletLoader: a `PageLoader` builds a page-object with data for a whole page; a `PageletLoader` builds a pagelet-object for part of a page; a PageLoader can call PageletLoaders for sub-content.

## Essential identifiers

- `\Shopware\Storefront\Controller\StorefrontController`
- `_routeScope`, `_loginRequired`, `_httpCache`, `XmlHttpRequest`
- `createActionResponse`
- PageLoader, PageletLoader

## Gotchas

All controller dependencies for page-rendering routes must move to `Loaders` (creating a `Loader`/`Page` if missing); all direct DAL dependencies inside the storefront must move to store-api routes; every storefront functionality must also be exposed via the store-api.
