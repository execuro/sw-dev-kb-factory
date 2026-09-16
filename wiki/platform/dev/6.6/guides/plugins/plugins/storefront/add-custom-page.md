---
id: platform/dev/6.6/guides/plugins/plugins/storefront/add-custom-page.md
title: Add custom page
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/storefront/add-custom-page.html
sourceHash: 78771352aee565f4b879b24650412de57d8fe747
keywords: ["custom page", "page loader", "Page class", "PageLoadedEvent", "GenericPageLoaderInterface", "createFrom", "CreateFromTrait", "PageLoader load method", "store api page data", "Storefront page"]
summary: "How to build a custom Storefront page: controller, page loader, Page struct extending Page, and a PageLoadedEvent."
lastBuilt: "2026-09-15"
---
## What it is

Explains how to build a custom Storefront page consisting of a controller, a page loader, a page struct, and a page-loaded event.

## Key steps / config

1. Controller method calls the page loader and renders a template, passing the page:

```php
#[Route(path: '/example-page', name: 'frontend.example.page', methods: ['GET'])]
public function examplePage(Request $request, SalesChannelContext $context): Response
{
    $page = $this->examplePageLoader->load($request, $context);
    return $this->renderStorefront('@SwagBasicExample/storefront/page/example/index.html.twig', [
        'example' => 'Hello world',
        'page' => $page
    ]);
}
```

2. Page loader class (plain service, no required parent) implements `load(Request, SalesChannelContext): ExamplePage`, using `GenericPageLoaderInterface::load()` to get base page data (footer, header), then `ExamplePage::createFrom($page)`, then dispatches a `PageLoaded` event:

```php
public function load(Request $request, SalesChannelContext $context): ExamplePage
{
    $page = $this->genericPageLoader->load($request, $context);
    $page = ExamplePage::createFrom($page);
    $page->setExampleData(...);
    $this->eventDispatcher->dispatch(new ExamplePageLoadedEvent($page, $context, $request));
    return $page;
}
```

Do not use a repository directly in a page loader; always get page data from a Store API route instead.

3. Register the page loader in `services.xml` with `GenericPageLoader` and `event_dispatcher` arguments, and pass the page loader as an argument to the controller service.

4. Page struct extends `Shopware\Storefront\Page\Page`, adding getter/setter for custom data:

```php
class ExamplePage extends Page
{
    protected ExampleEntity $exampleData;
    public function getExampleData(): ExampleEntity { return $this->exampleData; }
    public function setExampleData(ExampleEntity $exampleData): void { $this->exampleData = $exampleData; }
}
```

5. Page-loaded event extends `Shopware\Storefront\Page\PageLoadedEvent`, storing the page and delegating `Request`/`SalesChannelContext` to the parent constructor.

## Essential identifiers

- `Shopware\Storefront\Page\Page`
- `Shopware\Storefront\Page\PageLoadedEvent`
- `Shopware\Storefront\Page\GenericPageLoaderInterface`
- `Page::createFrom()` (via `CreateFromTrait`)
- `renderStorefront()`

## Gotchas

Never load data via a repository directly inside a page loader — fetch it through a Store API route instead.
