---
id: platform/dev/6.6/guides/plugins/plugins/storefront/add-caching-to-custom-controller.md
title: Add caching to custom controller
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/storefront/add-caching-to-custom-controller.html
sourceHash: 5ff8d17fda12bfbf160130e79a39169ea048e8b7
keywords: ["HTTP cache", "_httpCache", "cache invalidation", "Route attribute", "cacheable controller", "logged-in state", "cart-filled state", "Store API cache", "cache tags", "StorefrontController"]
summary: "How to mark a custom Storefront controller route as cacheable via the _httpCache route default, and how invalidation works."
lastBuilt: "2026-09-15"
---
## What it is

Explains how to define a custom Storefront controller route as cacheable for Shopware's HTTP cache.

## When to use

When a plugin adds its own controller route and the response should be served from the HTTP cache instead of regenerated on every request.

## Key steps / config

Set the route default `_httpCache` to `true`:

```php
#[Route(defaults: ['_routeScope' => ['storefront']])]
class ExampleController extends StorefrontController
{
    #[Route(path: '/example', name: 'frontend.example.example', methods: ['GET'], defaults: ['_httpCache' => true])]
    public function showExample(): Response
    {
        return $this->renderStorefront('@SwagBasicExample/storefront/page/example/index.html.twig', [
            'example' => 'Hello world'
        ]);
    }
}
```

Once set, the first request in a given state generates the response; later requests in the same state reuse it. Shopware distinguishes two user states the HTTP cache reacts to: `logged-in` (user is logged in) and `cart-filled` (cart has products).

## Essential identifiers

- Route default `_httpCache`
- User states: `logged-in`, `cart-filled`
- `Shopware\Storefront\Controller\StorefrontController`

## Gotchas

Cache invalidation of Storefront controller routes is controlled by the cache invalidation of the Store API routes that supplied the data: since all data loaded by a controller route ultimately comes from Store API routes carrying their own cache tags, a controller that only loads data via the Store API needs no additional invalidation logic.
