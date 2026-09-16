---
id: platform/dev/6.7/guides/plugins/plugins/storefront/advanced/add-caching-to-custom-controller.md
title: Add Caching to Custom Controller
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/storefront/advanced/add-caching-to-custom-controller.html
sourceHash: 8bfe0223b12e37b8d11e1382b6f143727115d357
codeCheckedAgainst: "6.7.13.0"
keywords: ["http cache", "_httpCache", "PlatformRequest::ATTRIBUTE_HTTP_CACHE", "storefront controller", "StorefrontController", "StorefrontRouteScope", "route defaults", "cacheable route", "cache tags", "cache invalidation", "full page cache", "renderStorefront"]
summary: "Mark a controller route HTTP-cacheable with defaults _httpCache => true; tags come from Store API data loaded in the request, so no extra invalidation."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/framework/caching/_index.md", "platform/dev/6.7/guides/plugins/plugins/storefront/controllers/add-custom-controller.md"]
---
## What it is

How to make a custom Storefront controller route cacheable by Shopware's HTTP cache. When the route default `_httpCache` is `true`, the core handles the rest: repeated requests in the same state get the response generated for the first request.

## When to use

You have a plugin with a Storefront controller (see [Add custom controller](platform/dev/6.7/guides/plugins/plugins/storefront/controllers/add-custom-controller.md)) whose output can be served from the HTTP cache.

## Key steps / config

1. Give the controller the Storefront route scope and set `_httpCache` (constant `Shopware\Core\PlatformRequest::ATTRIBUTE_HTTP_CACHE`) in the route `defaults`:

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

Imports: `Shopware\Core\PlatformRequest`, `Shopware\Storefront\Controller\StorefrontController`, `Shopware\Storefront\Framework\Routing\StorefrontRouteScope`, `Symfony\Component\HttpFoundation\Response`, `Symfony\Component\Routing\Attribute\Route`.

2. Core code uses the constant form `defaults: [PlatformRequest::ATTRIBUTE_HTTP_CACHE => true]` (e.g. `ProductController`); both spellings are the same key. Besides `true`, the installed code also accepts an array value with `clientMaxAge` / `sharedMaxAge` (or `maxAge`) to set cache lifetimes.
3. No invalidation code is needed: the cached response is tagged with all cache tags generated or loaded during the request, and because the controller loads its data through Store API routes, their invalidation also invalidates the Storefront route. See the [Caching guide](platform/dev/6.7/guides/plugins/plugins/framework/caching/_index.md).

## Essential identifiers

- Route default `_httpCache` / `PlatformRequest::ATTRIBUTE_HTTP_CACHE`
- `PlatformRequest::ATTRIBUTE_ROUTE_SCOPE`, `StorefrontRouteScope::ID`
- `StorefrontController::renderStorefront()`

## Gotchas

- The source says certain user states can be excluded from the cache: `logged-in` (customer logged in) and `cart-filled` (products in cart). In 6.7.13.0 these state constants and the `states` option of the cache attribute are deprecated — cache states will be removed in 6.8 in favour of cache keys/hash.
- Automatic invalidation only covers data loaded via Store API routes; data loaded by other means is not reflected in the response's cache tags.

## Version notes

- 6.8 (announced in code): cache states (`logged-in`, `cart-filled`) are removed; use cache keys instead.

## Code check (6.7.13.0)
- confirmed `PlatformRequest::ATTRIBUTE_HTTP_CACHE` — constant with value _httpCache — vendor/shopware/core/PlatformRequest.php:80
- confirmed `_httpCache` — route attribute read for HTTP caching — vendor/shopware/core/PlatformRequest.php:80
- confirmed `CacheAttribute::fromAttributeValue()` — true maps to default cache settings, arrays go through fromArray — vendor/shopware/core/Framework/Adapter/Cache/Http/CacheAttribute.php:46
- confirmed `CacheAttribute::fromArray()` — reads clientMaxAge, sharedMaxAge, maxAge — vendor/shopware/core/Framework/Adapter/Cache/Http/CacheAttribute.php:34
- deprecated `CacheAttribute::$states` — removed in v6.8.0 without replacement — vendor/shopware/core/Framework/Adapter/Cache/Http/CacheAttribute.php:27
- deprecated `CacheStateSubscriber::STATE_LOGGED_IN` — value logged-in, cache states removed in v6.8.0 — vendor/shopware/core/Framework/Adapter/Cache/CacheStateSubscriber.php:28
- deprecated `CacheStateSubscriber::STATE_CART_FILLED` — value cart-filled, cache states removed in v6.8.0 — vendor/shopware/core/Framework/Adapter/Cache/CacheStateSubscriber.php:33
- confirmed `StorefrontRouteScope::ID` — value storefront — vendor/shopware/storefront/Framework/Routing/StorefrontRouteScope.php:14
- confirmed `StorefrontController::renderStorefront()` — protected helper returning Response — vendor/shopware/storefront/Controller/StorefrontController.php:67
- confirmed `PlatformRequest::ATTRIBUTE_ROUTE_SCOPE` — constant with value _routeScope — vendor/shopware/core/PlatformRequest.php:77
