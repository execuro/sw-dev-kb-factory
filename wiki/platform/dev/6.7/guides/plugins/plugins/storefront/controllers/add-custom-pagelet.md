---
id: platform/dev/6.7/guides/plugins/plugins/storefront/controllers/add-custom-pagelet.md
title: Add Custom Pagelet
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/storefront/controllers/add-custom-pagelet.html
sourceHash: f616158d91544f318db50fd0cc50fc7346292ffe
codeCheckedAgainst: "6.7.13.0"
keywords: ["pagelet", "Pagelet", "PageletLoadedEvent", "getPagelet", "ExamplePageletLoader", "GenericPageLoaderInterface", "createFrom", "XmlHttpRequest", "storefront fragment", "reusable page part", "pagelet loader", "renderStorefront"]
summary: "Create a Storefront pagelet: loader, struct extending Pagelet, event extending PageletLoadedEvent; load it inside a page or via an XmlHttpRequest route."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/storefront/controllers/add-custom-page.md", "platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md"]
---
## What it is

A pagelet is a reusable fraction of one or more Storefront pages (e.g. footer, navigation). It is built like a page — a loader, a data struct and a loaded event — with a few differences. Builds on [adding a custom page](platform/dev/6.7/guides/plugins/plugins/storefront/controllers/add-custom-page.md) and the [Plugin Base Guide](platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md).

## When to use

You need a data-backed Storefront fragment that several pages embed, or that is fetched on its own via an AJAX route.

## Key steps / config

Differences from a page:

- The struct extends `Shopware\Storefront\Pagelet\Pagelet` (not `Shopware\Storefront\Page\Page`).
- The event extends `Shopware\Storefront\Pagelet\PageletLoadedEvent` (not `Shopware\Storefront\Page\PageLoadedEvent`); the getter is `getPagelet()`, not `getPage()`.
- The loader does not use `GenericPageLoaderInterface` (that loads header/footer pagelets) and does not call `::createFrom()` — just `new ExamplePagelet()`.
- A pagelet need not be bound to a controller route, but may have one.

1. Loader: `load(Request $request, SalesChannelContext $context): ExamplePagelet` creates the struct, fills data, dispatches `new ExamplePageletLoadedEvent($pagelet, $context, $request)` via `EventDispatcherInterface`, returns the pagelet.
2. Struct: `class ExamplePagelet extends Pagelet` with getter/setter for its data (e.g. `ExampleEntity $exampleData`).
3. Event:

```php
class ExamplePageletLoadedEvent extends PageletLoadedEvent
{
    protected ExamplePagelet $pagelet;
    public function __construct(ExamplePagelet $pagelet, SalesChannelContext $salesChannelContext, Request $request)
    {
        $this->pagelet = $pagelet;
        parent::__construct($salesChannelContext, $request);
    }
    public function getPagelet(): ExamplePagelet { return $this->pagelet; }
}
```

4. Load inside a page: in the page loader's `load()`, after `ExamplePage::createFrom($page)`, call `$page->setExamplePagelet($this->examplePageletLoader->load($request, $context));` — the page struct needs `setExamplePagelet`/`getExamplePagelet`.
5. Or load via route:

```php
#[Route(path: '/example-pagelet', name: 'frontend.example.pagelet', methods: ['POST'], defaults: ['XmlHttpRequest' => 'true'])]
public function examplePagelet(Request $request, SalesChannelContext $context): Response
{
    $pagelet = $this->examplePageletLoader->load($request, $context);
    return $this->renderStorefront('@Storefront/storefront/pagelet/example/index.html.twig', ['pagelet' => $pagelet]);
}
```

## Essential identifiers

- `Shopware\Storefront\Pagelet\Pagelet`
- `Shopware\Storefront\Pagelet\PageletLoadedEvent` / `getPagelet()`
- `Shopware\Storefront\Page\GenericPageLoaderInterface` (not used for pagelets)
- `defaults: ['XmlHttpRequest' => 'true']`
- `StorefrontController::renderStorefront()`

## Gotchas

- `PageletLoadedEvent::getPagelet()` is abstract — the subclass must implement it.
- Without the `XmlHttpRequest` route default, a Storefront-scoped route called via XHR is rejected by `StorefrontSubscriber::preventPageLoadingFromXmlHttpRequest()` (access denied exception).
- The source's page-loader snippet dispatches `ExamplePageletLoadedEvent` with the page object; in a page loader dispatch the page's own loaded event instead.

## Code check (6.7.13.0)
- confirmed `Shopware\Storefront\Pagelet\Pagelet` — abstract class extending Struct — vendor/shopware/storefront/Pagelet/Pagelet.php:9
- confirmed `PageletLoadedEvent::getPagelet()` — abstract, must be implemented by subclasses — vendor/shopware/storefront/Pagelet/PageletLoadedEvent.php:24
- confirmed `PageletLoadedEvent::__construct()` — takes SalesChannelContext and Request — vendor/shopware/storefront/Pagelet/PageletLoadedEvent.php:15
- confirmed `PageLoadedEvent::getPage()` — page counterpart getter — vendor/shopware/storefront/Page/PageLoadedEvent.php:25
- confirmed `GenericPageLoaderInterface::load()` — returns a Page — vendor/shopware/storefront/Page/GenericPageLoaderInterface.php:12
- confirmed `Shopware\Storefront\Page\Page` — extends Struct — vendor/shopware/storefront/Page/Page.php:9
- confirmed `CreateFromTrait::createFrom()` — static struct copy factory — vendor/shopware/core/Framework/Struct/CreateFromTrait.php:10
- confirmed `XmlHttpRequest` — route attribute read as boolean to allow XHR — vendor/shopware/storefront/Framework/Routing/StorefrontSubscriber.php:245
- confirmed `StorefrontController::renderStorefront()` — protected render helper — vendor/shopware/storefront/Controller/StorefrontController.php:67
