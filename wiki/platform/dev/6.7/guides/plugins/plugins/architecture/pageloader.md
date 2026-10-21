---
id: platform/dev/6.7/guides/plugins/plugins/architecture/pageloader.md
title: Page Loader Extension Architecture
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/architecture/pageloader.html
sourceHash: c1a91441e39578807266ea592834f5dc053c779d
codeCheckedAgainst: "6.7.15.1"
keywords: ["page loader", "PageLoader", "Shopware\\Storefront\\Page\\Page", "PageLoadedEvent", "GenericPageLoaderInterface", "ProductPageLoader", "store api route", "decoration", "storefront page", "page object", "architecture guidelines"]
summary: Design rules for Storefront page loaders - Store API routes only, decoratable, dedicated Page object, PageLoaded event after loading.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/resources/references/adr/2020-11-25-decoration-pattern.md"]
---
## What it is

Architecture guidelines for Storefront page loaders: the classes that assemble all data a Storefront page needs before rendering, keeping HTTP concerns apart from business logic and keeping data fetching consistent.

## When to use

When writing a new page loader (core or extension) or when deciding how to extend an existing Storefront page - by decorating the loader or by listening to its `PageLoaded` event.

## Key steps / config

Design principles:

- Separate HTTP concerns from business logic.
- Fetch all data via Store API routes, so the Store API can reach every Storefront feature.
- Keep the loader replaceable via [decoration](platform/dev/6.7/resources/references/adr/2020-11-25-decoration-pattern.md).
- Construct the page fully before rendering.

Extension guidelines:

1. Divide loaders by Storefront domain (products, account, checkout, ...).
2. Provide an abstract base class for decoration so a project can replace the loader entirely.
3. Return a dedicated page object holding all required data; it must extend `\Shopware\Storefront\Page\Page`.
4. Dispatch a matching `PageLoaded` event after loading, so third parties can add data. In core these extend the abstract `Shopware\Storefront\Page\PageLoadedEvent` (constructor takes `SalesChannelContext` and `Request`, abstract `getPage()`).
5. Never access repositories directly inside a page loader.

Shape of a core loader, as in `ProductPageLoader::load()`:

```php
public function load(Request $request, SalesChannelContext $context): ProductPage
{
    // ... data via $this->productDetailRoute->load(...)
    $page = ProductPage::createFrom($this->genericLoader->load($request, $context));
    // ... fill page
    $this->eventDispatcher->dispatch(new ProductPageLoadedEvent($page, $context, $request));
    return $page;
}
```

## Essential identifiers

- `\Shopware\Storefront\Page\Page` - base page struct (carries `MetaInformation`)
- `Shopware\Storefront\Page\PageLoadedEvent`
- `Shopware\Storefront\Page\GenericPageLoaderInterface` / `GenericPageLoader`
- `Shopware\Storefront\Page\Product\ProductPageLoader`, `ProductPageLoadedEvent`

## Gotchas

- Not every core loader follows the "abstract base class" rule: `ProductPageLoader` is a concrete class with an `@internal` constructor, so extend product pages by decorating the service or by subscribing to `ProductPageLoadedEvent` rather than subclassing it.
- `ProductPageLoader` still takes an `EntityRepository` for product reviews in its constructor, even though its docblock repeats the "no repository calls" rule. Do not take it as a pattern to copy.

## Code check (6.7.15.1)
- confirmed `\Shopware\Storefront\Page\Page` — concrete class extending `Struct` — vendor/shopware/storefront/Page/Page.php:9
- confirmed `PageLoadedEvent::getPage()` — abstract, so every PageLoaded event exposes its page — vendor/shopware/storefront/Page/PageLoadedEvent.php:28
- confirmed `PageLoadedEvent` — abstract base for loaded events — vendor/shopware/storefront/Page/PageLoadedEvent.php:17
- confirmed `GenericPageLoaderInterface::load()` — returns `Page` — vendor/shopware/storefront/Page/GenericPageLoaderInterface.php:12
- confirmed `ProductPageLoader` — concrete class, not abstract — vendor/shopware/storefront/Page/Product/ProductPageLoader.php:37
- confirmed `AbstractProductDetailRoute` — loader fetches product via Store API route — vendor/shopware/storefront/Page/Product/ProductPageLoader.php:57
- confirmed `$productReviewRepository` — core loader still injects a repository — vendor/shopware/storefront/Page/Product/ProductPageLoader.php:58
- confirmed `ProductPageLoadedEvent` — dispatched at end of `load()` — vendor/shopware/storefront/Page/Product/ProductPageLoader.php:128
