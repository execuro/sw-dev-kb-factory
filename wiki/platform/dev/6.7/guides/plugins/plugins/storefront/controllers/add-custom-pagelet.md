---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/guides/plugins/plugins/storefront/controllers/add-custom-pagelet.md
relatedPages:
  - platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md
  - platform/dev/6.7/guides/plugins/plugins/storefront/controllers/add-custom-page.md
sourceHash: f616158d91544f318db50fd0cc50fc7346292ffe
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/storefront/controllers/add-custom-pagelet.html
title: Add Custom Pagelet
version: "6.7"
versions:
  - "6.7"
keywords: ["Shopware\\Storefront\\Pagelet\\Pagelet", "Shopware\\Storefront\\Pagelet\\PageletLoadedEvent", "getPagelet", "ExamplePageletLoader", "ExamplePageletLoadedEvent", "XmlHttpRequest", "pagelet", "pagelet loader", "reusable page fragment", "ajax pagelet route", "storefront pagelet"]
summary: "Custom Storefront pagelet: Pagelet struct, loader without GenericPageLoader or createFrom, PageletLoadedEvent with getPagelet, XHR route."
lastBuilt: 2026-10-21
---
## What it is

How to create a pagelet: a reusable fraction of one or more Storefront pages (such as footer or navigation). It is built like a page — loader, data struct, loaded event — with a few differences.

## When to use

You need a data block that several pages load, or one fetched on its own via an AJAX route. Requires the setup from [Add Custom Page](platform/dev/6.7/guides/plugins/plugins/storefront/controllers/add-custom-page.md) and a plugin base ([Plugin Base Guide](platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md)).

## Key steps / config

Differences from a page:

- The struct extends `Shopware\Storefront\Pagelet\Pagelet` instead of `Shopware\Storefront\Page\Page`.
- No `GenericPageLoaderInterface` (it loads header/footer pagelets, which a pagelet must not contain) and no `createFrom()` — instantiate the pagelet with `new`.
- The event extends `Shopware\Storefront\Pagelet\PageletLoadedEvent`, and its getter is `getPagelet()`, not `getPage()`.
- A pagelet need not have its own route, but can.

1. **Loader** — `src/Storefront/Pagelet/Example/ExamplePageletLoader.php`, constructor takes only `EventDispatcherInterface`:

```php
public function load(Request $request, SalesChannelContext $context): ExamplePagelet
{
    $pagelet = new ExamplePagelet();
    $pagelet->setExampleData(...); // data from store-api
    $this->eventDispatcher->dispatch(new ExamplePageletLoadedEvent($pagelet, $context, $request));
    return $pagelet;
}
```

2. **Struct** — `ExamplePagelet extends Pagelet` with a protected property plus `getExampleData()` / `setExampleData()`.
3. **Event**:

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

4. **Load inside a page** — in `ExamplePageLoader::load()` call `$page->setExamplePagelet($this->examplePageletLoader->load($request, $context));` (`ExamplePage` needs `setExamplePagelet`/`getExamplePagelet`).
5. **Load via route** — add a controller action:
   `#[Route(path: '/example-pagelet', name: 'frontend.example.pagelet', methods: ['POST'], defaults: ['XmlHttpRequest' => 'true'])]`
   and render `@Storefront/storefront/pagelet/example/index.html.twig` with `'pagelet' => $pagelet`.

## Essential identifiers

- `Shopware\Storefront\Pagelet\Pagelet`
- `Shopware\Storefront\Pagelet\PageletLoadedEvent` (abstract `getPagelet()`)
- route default `XmlHttpRequest`

## Gotchas

- The source's page-loader example dispatches `new ExamplePageletLoadedEvent($page, ...)` from the page loader; that event's constructor is typed `ExamplePagelet`, so the page loader should keep dispatching its own `ExamplePageLoadedEvent`.
- Without the `XmlHttpRequest` route default, the Storefront subscriber throws an access-denied exception when the route is requested via XHR.
- `Pagelet` is abstract in the installed code, so only your subclass can be instantiated.

## Code check (6.7.15.1)
- confirmed `PageletLoadedEvent` — abstract, extends NestedEvent — vendor/shopware/storefront/Pagelet/PageletLoadedEvent.php:16
- confirmed `PageletLoadedEvent::__construct()` — (SalesChannelContext, Request) — vendor/shopware/storefront/Pagelet/PageletLoadedEvent.php:18
- confirmed `PageletLoadedEvent::getPagelet()` — abstract, must be declared — vendor/shopware/storefront/Pagelet/PageletLoadedEvent.php:27
- confirmed `Pagelet` — abstract class extending Struct — vendor/shopware/storefront/Pagelet/Pagelet.php:9
- confirmed `XmlHttpRequest` — route attribute read to allow XHR access — vendor/shopware/storefront/Framework/Routing/StorefrontSubscriber.php:245
- confirmed `StorefrontSubscriber::preventPageLoadingFromXmlHttpRequest()` — denies XHR without the attribute — vendor/shopware/storefront/Framework/Routing/StorefrontSubscriber.php:231
- confirmed `GenericPageLoaderInterface::load()` — returns a Page, not used for pagelets — vendor/shopware/storefront/Page/GenericPageLoaderInterface.php:12
