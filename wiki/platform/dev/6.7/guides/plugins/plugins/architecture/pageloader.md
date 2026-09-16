---
codeCheckedAgainst: "6.7.13.0"
docType: developer
id: platform/dev/6.7/guides/plugins/plugins/architecture/pageloader.md
sourceHash: c1a91441e39578807266ea592834f5dc053c779d
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/architecture/pageloader.html
title: Page Loader Extension Architecture
version: "6.7"
versions:
  - "6.7"
keywords: ["page loader", "PageLoader", "\\Shopware\\Storefront\\Page\\Page", "PageLoadedEvent", "GenericPageLoaderInterface", "getDecorated", "decoration", "store api route", "storefront page", "page object", "ProductPageLoader", "page loaded event"]
summary: "Storefront page loader rules: fetch via Store API routes, no repositories, abstract base for decoration, page extends Page, dispatch a PageLoadedEvent."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/resources/references/adr/2020-11-25-decoration-pattern.md"]
---
## What it is

Architecture guideline for Storefront page loaders in Shopware 6.7: services that assemble all data needed to render a storefront page, keeping HTTP concerns apart from business logic and producing a fully built page object before rendering.

## When to use

- Writing a new Storefront page (controller + loader + page object) in a plugin or core contribution.
- Deciding how to fetch data for a page, or how a project can replace an existing loader.

## Key steps / config

Design principles: page loaders separate HTTP from business logic, fetch data via Store API routes, stay replaceable via decoration, and construct pages fully before rendering.

1. Split loaders by Storefront domain (products, account, checkout, ...).
2. Provide an abstract base class so the loader can be decorated or fully replaced (see [decoration pattern ADR](platform/dev/6.7/resources/references/adr/2020-11-25-decoration-pattern.md)). Installed example shape:

```php
abstract class AbstractCustomerGroupRegistrationPageLoader
{
    abstract public function getDecorated(): AbstractCustomerGroupRegistrationPageLoader;
    abstract public function load(Request $request, SalesChannelContext $salesChannelContext): CustomerGroupRegistrationPage;
}
```

3. Return a dedicated page object that extends `\Shopware\Storefront\Page\Page` (e.g. `ProductPage extends Page`); `GenericPageLoaderInterface::load()` returns a base `Page` that can be converted with `ProductPage::createFrom($page)`.
4. Retrieve data through Store API routes (e.g. `ProductPageLoader` calls `AbstractProductDetailRoute::load()`), never repositories directly.
5. After loading, dispatch the matching loaded event — a subclass of `\Shopware\Storefront\Page\PageLoadedEvent` (e.g. `ProductPageLoadedEvent`) — so third parties can add data.

## Essential identifiers

- `\Shopware\Storefront\Page\Page`
- `\Shopware\Storefront\Page\PageLoadedEvent` (abstract; `getPage()`, `getRequest()`, `getSalesChannelContext()`)
- `\Shopware\Storefront\Page\GenericPageLoaderInterface`
- `getDecorated()` on abstract loader base classes

## Gotchas

- Most installed core page loaders (e.g. `ProductPageLoader`) are concrete classes without an abstract base; only a few (e.g. `AbstractCustomerGroupRegistrationPageLoader`) follow the abstract-base rule, so decorating an existing core loader is not always possible.
- `ProductPageLoader` carries a docblock repeating "Always use a store-api route", yet itself injects a product review repository — do not take core loaders as proof that repository access is acceptable.
- `PageLoadedEvent` implements `ShopwareSalesChannelEvent`, so subclasses get `getContext()` from the sales channel context.

## Code check (6.7.13.0)
- confirmed `Page` — class Shopware\Storefront\Page\Page extends Struct — vendor/shopware/storefront/Page/Page.php:9
- confirmed `PageLoadedEvent` — abstract, implements ShopwareSalesChannelEvent — vendor/shopware/storefront/Page/PageLoadedEvent.php:14
- confirmed `PageLoadedEvent::getPage()` — abstract member subclasses implement — vendor/shopware/storefront/Page/PageLoadedEvent.php:25
- confirmed `GenericPageLoaderInterface::load()` — returns Page — vendor/shopware/storefront/Page/GenericPageLoaderInterface.php:12
- confirmed `AbstractCustomerGroupRegistrationPageLoader::getDecorated()` — abstract base for decoration — vendor/shopware/storefront/Page/Account/CustomerGroupRegistration/AbstractCustomerGroupRegistrationPageLoader.php:15
- confirmed `ProductPageLoader` — concrete class, no abstract base — vendor/shopware/storefront/Page/Product/ProductPageLoader.php:37
- confirmed `AbstractProductDetailRoute` — Store API route used by ProductPageLoader — vendor/shopware/storefront/Page/Product/ProductPageLoader.php:57
- confirmed `ProductPageLoadedEvent` — dispatched after loading — vendor/shopware/storefront/Page/Product/ProductPageLoader.php:128
- confirmed `$productReviewRepository` — repository injected into ProductPageLoader — vendor/shopware/storefront/Page/Product/ProductPageLoader.php:58
- confirmed `ProductPage` — extends Page — vendor/shopware/storefront/Page/Product/ProductPage.php:16
