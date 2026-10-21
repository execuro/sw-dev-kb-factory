---
id: platform/dev/6.7/guides/plugins/plugins/storefront/advanced/add-caching-to-custom-controller.md
title: Add Caching to Custom Controller
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/storefront/advanced/add-caching-to-custom-controller.html
sourceHash: 8bfe0223b12e37b8d11e1382b6f143727115d357
codeCheckedAgainst: "6.7.15.1"
keywords: ["_httpCache", "http cache", "PlatformRequest::ATTRIBUTE_HTTP_CACHE", "StorefrontController", "StorefrontRouteScope", "CacheResponseSubscriber", "CacheAttribute", "cacheable route", "cache invalidation", "cache tags", "storefront controller caching", "reverse proxy"]
summary: Make a Storefront controller route HTTP-cacheable via the _httpCache route default; invalidation follows Store API cache tags.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/storefront/controllers/add-custom-controller.md", "platform/dev/6.7/guides/plugins/plugins/framework/caching/_index.md"]
---
## What it is

How to make a custom Storefront controller route cacheable in Shopware's HTTP cache. Setting the route default `_httpCache` (constant `PlatformRequest::ATTRIBUTE_HTTP_CACHE`) is enough; the core handles caching from there. When the route is called repeatedly in the same state, only the first request generates a response and later requests are served from the cache.

## When to use

Your plugin has its own Storefront controller (see [Add custom controller](platform/dev/6.7/guides/plugins/plugins/storefront/controllers/add-custom-controller.md)) with a GET page whose output is the same for all users in the same context, and you want it served by the HTTP cache.

## Key steps / config

Add `'_httpCache' => true` to the route's `defaults`:

```php
#[Route(defaults: [PlatformRequest::ATTRIBUTE_ROUTE_SCOPE => [StorefrontRouteScope::ID]])]
class ExampleController extends StorefrontController
{
    #[Route(path: '/example', name: 'frontend.example.example', methods: ['GET'], defaults: ['_httpCache' => true])]
    public function showExample(): Response
    {
        return $this->renderStorefront('@SwagBasicExample/storefront/page/example/index.html.twig', ['example' => 'Hello world']);
    }
}
```

Imports used: `Shopware\Core\PlatformRequest`, `Shopware\Storefront\Controller\StorefrontController`, `Shopware\Storefront\Framework\Routing\StorefrontRouteScope`, `Symfony\Component\Routing\Attribute\Route`, `Symfony\Component\HttpFoundation\Response`.

Beyond `true`, the installed `CacheAttribute` also accepts an array value with `clientMaxAge`, `sharedMaxAge` or `maxAge`.

Cache invalidation: a cached response is tagged with all cache tags generated during the request or loaded from existing cache entries. Because Storefront data is loaded through the corresponding Store API routes, the tags are the sum of all Store API tags touched during the request, so a controller route that loads all its data via Store API routes needs no extra invalidation code. Details: [Caching guide](platform/dev/6.7/guides/plugins/plugins/framework/caching/_index.md).

## Essential identifiers

- `_httpCache` / `Shopware\Core\PlatformRequest::ATTRIBUTE_HTTP_CACHE`
- `Shopware\Storefront\Controller\StorefrontController::renderStorefront()`
- `Shopware\Storefront\Framework\Routing\StorefrontRouteScope::ID`
- `Shopware\Core\Framework\Adapter\Cache\Http\CacheResponseSubscriber` - evaluates the attribute

## Gotchas

- Only GET requests are cached; any other method gets no-cache headers.
- If the route loads data outside the Store API routes, its cache tags are not collected automatically and you have to handle invalidation yourself.
- The docs mention excluding the user states `logged-in` and `cart-filled` from caching (via a `states` list in the attribute array). In 6.7.15.1 these cache states are `@deprecated tag:v6.8.0` and are ignored once `CACHE_REWORK`, `PERFORMANCE_TWEAKS` or `v6.8.0.0` is active. The replacement is the context cache hash.

## Version notes

- 6.8: cache states (`logged-in`, `cart-filled`) are removed; caching varies by the cache hash instead.

## Code check (6.7.15.1)
- confirmed `PlatformRequest::ATTRIBUTE_HTTP_CACHE` — constant `_httpCache` — vendor/shopware/core/PlatformRequest.php:82
- confirmed `CacheResponseSubscriber` — subscriber that reads `_httpCache` and applies cache headers — vendor/shopware/core/Framework/Adapter/Cache/Http/CacheResponseSubscriber.php:31
- confirmed `CacheAttribute::fromAttributeValue()` — accepts bool or array (`clientMaxAge`, `sharedMaxAge`, `maxAge`, `states`) — vendor/shopware/core/Framework/Adapter/Cache/Http/CacheAttribute.php:46
- deprecated `CacheStateSubscriber::STATE_LOGGED_IN` — `logged-in` state deprecated for 6.8 — vendor/shopware/core/Framework/Adapter/Cache/CacheStateSubscriber.php:28
- deprecated `CacheStateSubscriber::STATE_CART_FILLED` — `cart-filled` state deprecated for 6.8 — vendor/shopware/core/Framework/Adapter/Cache/CacheStateSubscriber.php:33
- confirmed `StorefrontController::renderStorefront()` — protected render helper — vendor/shopware/storefront/Controller/StorefrontController.php:68
- confirmed `StorefrontRouteScope::ID` — value `storefront` — vendor/shopware/storefront/Framework/Routing/StorefrontRouteScope.php:14
- confirmed `PlatformRequest::ATTRIBUTE_ROUTE_SCOPE` — value `_routeScope` — vendor/shopware/core/PlatformRequest.php:78
