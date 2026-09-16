---
id: platform/dev/6.6/guides/plugins/plugins/storefront/add-custom-pagelet.md
title: Add custom pagelet
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/storefront/add-custom-pagelet.html
sourceHash: f512a6c387d63deaf9153d01e445a9b96b4f13b1
keywords: ["custom pagelet", "Pagelet class", "PageletLoadedEvent", "pagelet loader", "XmlHttpRequest", "footer pagelet", "navigation pagelet", "reusable page fraction", "Storefront pagelet route"]
summary: "How to create a custom Storefront pagelet: a Pagelet struct, pagelet loader, and PageletLoadedEvent, loaded from a page or its own route."
lastBuilt: "2026-09-15"
---
## What it is

Explains how to create a custom Storefront pagelet — a reusable fraction of a page (like a footer or navigation) — consisting of a pagelet loader, a pagelet struct, and a pagelet-loaded event.

## When to use

When building a piece of page content that is reused across multiple pages or that a page loads as a sub-component, rather than a full standalone page.

## Key steps / config

Differences from building a full page:

- The data struct extends `Shopware\Storefront\Pagelet\Pagelet` instead of `Shopware\Storefront\Page\Page`.
- A pagelet doesn't need its own controller/route, though it can have one.
- `GenericPageLoaderInterface` is not used (it loads footer/header pagelets — a pagelet shouldn't load itself).
- The instance is created with `new ExamplePagelet()`, not `Pagelet::createFrom()`.
- The loaded event extends `Shopware\Storefront\Pagelet\PageletLoadedEvent` instead of `Shopware\Storefront\Page\PageLoadedEvent`.

Pagelet loader:

```php
class ExamplePageletLoader
{
    public function load(Request $request, SalesChannelContext $context): ExamplePagelet
    {
        $pagelet = new ExamplePagelet();
        $pagelet->setExampleData(...);
        $this->eventDispatcher->dispatch(new ExamplePageletLoadedEvent($pagelet, $context, $request));
        return $pagelet;
    }
}
```

Pagelet struct:

```php
class ExamplePagelet extends Pagelet
{
    protected ExampleEntity $exampleData;
    public function getExampleData(): ExampleEntity { return $this->exampleData; }
    public function setExampleData(ExampleEntity $exampleData): void { $this->exampleData = $exampleData; }
}
```

Loading from another page's loader: call `$this->examplePageletLoader->load($request, $context)` and attach via a setter on the page struct (e.g. `$page->setExamplePagelet(...)`).

Loading via its own route (for XML HTTP Requests):

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
- `Shopware\Storefront\Pagelet\PageletLoadedEvent`
- Route default `XmlHttpRequest`

## Gotchas

Do not use `Pagelet::createFrom()` (that pattern is for pages that need the pre-loaded header/footer pagelets) — a pagelet is instantiated directly with `new`.
