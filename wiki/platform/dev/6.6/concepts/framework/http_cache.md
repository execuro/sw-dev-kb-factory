---
id: platform/dev/6.6/concepts/framework/http_cache.md
title: HTTP Cache
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/concepts/framework/http_cache.html
sourceHash: da855e2c8eb7d34983359605e43f1e0de0039433
keywords: ["http cache", "reverse proxy", "_httpCache", "sw-currency", "sw-cache-hash", "sw-states", "sw-invalidation-states", "cache invalidation", "cache cookies", "store api", "productcontroller"]
summary: "Explains Shopware's HTTP/reverse-proxy cache: enabling per-route caching, cache cookies, and invalidation via Store API tags."
lastBuilt: "2026-09-15"
---
## What it is

The HTTP cache lets Shopware cache responses so repeated requests for the same page return faster, typically served through a reverse proxy sitting between the user and the web application.

## When to use

Relevant when deciding whether a controller route should be cacheable, debugging cache differentiation between customer groups/currencies, or understanding how Storefront cache invalidation is triggered.

## Key steps / config

Enable caching for a route by setting the route default `_httpCache` to `true`, e.g. on `ProductController`:

```php
#[Route(path: '/detail/{productId}', name: 'frontend.detail.page', methods: ['GET'], defaults: ['_httpCache' => true])]
public function index(SalesChannelContext $context, Request $request): Response
```

Cache cookies used to differentiate requests:
- `sw-currency` — set when a non-logged-in customer with an empty cart changes currency; maximizes cache hits for non-logged-in customers.
- `sw-cache-hash` — replaces `sw-currency`; contains the active rules and active currency, set once active rules no longer match the default (e.g. login, items in cart).
- `sw-states` — describes the current session via simple tags (e.g. `cart-filled`, `logged-in`); when client tags match the response's `sw-invalidation-states` header, the cache is skipped.

Cache invalidation of a Storefront controller route is controlled by the cache invalidation of the underlying Store API routes: a written response is tagged with all cache tags generated/loaded during the request, and Storefront data is always loaded via Store API routes carrying their own cache tags.

## Essential identifiers

- `_httpCache` — route default enabling caching
- `sw-currency`, `sw-cache-hash`, `sw-states` — cache differentiation cookies
- `sw-invalidation-states` — response header checked against `sw-states` tags
