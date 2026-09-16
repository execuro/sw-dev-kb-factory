---
id: platform/dev/6.7/guides/plugins/plugins/storefront/controllers/add-custom-page.md
title: Add Custom Page
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/storefront/controllers/add-custom-page.html
sourceHash: 3d4c4f61e4e152ac81df40ddea875863c4c028c2
codeCheckedAgainst: "6.7.13.0"
keywords: ["PageLoadedEvent", "GenericPageLoaderInterface", "GenericPageLoader", "Shopware\\Storefront\\Page\\Page", "createFrom", "ExamplePageLoader", "ExamplePageLoadedEvent", "renderStorefront", "page loader", "storefront page struct", "custom storefront page", "page loaded event"]
summary: "Build a custom Storefront page: controller, page loader using GenericPageLoaderInterface, Page subclass via createFrom, and a PageLoadedEvent subclass."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/storefront/controllers/add-custom-controller.md", "platform/dev/6.7/guides/plugins/plugins/storefront/controllers/add-custom-pagelet.md", "platform/dev/6.7/guides/plugins/plugins/framework/data-handling/add-custom-complex-data.md"]
---
## What it is

How to build a complete Storefront page in a plugin. A page consists of a controller, a page loader, a page class (a struct holding the page data) and a "page loaded" event.

## When to use

You already have a [custom controller](platform/dev/6.7/guides/plugins/plugins/storefront/controllers/add-custom-controller.md) and want its route to render a full page with loaded data that other plugins can extend via an event.

## Key steps / config

All page classes go into `<plugin root>/src/Storefront/Page/Example`.

1. **Page loader** `ExamplePageLoader` — a plain service (no base class; an own `ExamplePageLoaderInterface` makes it decoratable). By convention it has `load(Request $request, SalesChannelContext $context): ExamplePage`:
   ```php
   $page = $this->genericPageLoader->load($request, $context);   // GenericPageLoaderInterface, returns Page
   $page = ExamplePage::createFrom($page);
   $page->setExampleData(...);                                   // fetch via Store API, not repositories
   $this->eventDispatcher->dispatch(new ExamplePageLoadedEvent($page, $context, $request));
   return $page;
   ```
   Register it:
   ```php
   $services->set(ExamplePageLoader::class)->public()->args([
       service('Shopware\Storefront\Page\GenericPageLoader'),
       service('event_dispatcher'),
   ]);
   ```
2. **Controller** — inject `ExamplePageLoader` via constructor, call `load()` in the `#[Route(path: '/example-page', name: 'frontend.example.page', methods: ['GET'])]` action and pass it to the template: `renderStorefront('@SwagBasicExample/storefront/page/example/index.html.twig', ['page' => $page])`. Add `->args([service(ExamplePageLoader::class)])` to the controller service (keep `->call('setContainer', [service('service_container')])`).
3. **Page class** extends `Shopware\Storefront\Page\Page` (a `Struct`, so `createFrom()` copies the generic page data); add a protected property with getter and setter, e.g. `getExampleData()`/`setExampleData(ExampleEntity $exampleData)`.
4. **Page loaded event** extends `Shopware\Storefront\Page\PageLoadedEvent`, stores the page and passes context and request to the parent:
   ```php
   class ExamplePageLoadedEvent extends PageLoadedEvent
   {
       protected ExamplePage $page;
       public function __construct(ExamplePage $page, SalesChannelContext $salesChannelContext, Request $request)
       {
           $this->page = $page;
           parent::__construct($salesChannelContext, $request);
       }
       public function getPage(): ExamplePage { return $this->page; }
   }
   ```

## Essential identifiers

- `Shopware\Storefront\Page\GenericPageLoaderInterface` / service `Shopware\Storefront\Page\GenericPageLoader`
- `Shopware\Storefront\Page\Page`, `createFrom()`
- `Shopware\Storefront\Page\PageLoadedEvent`, abstract `getPage()`
- `event_dispatcher`
- `ExamplePageLoader`, `ExamplePage`, `ExamplePageLoadedEvent`, route `frontend.example.page`

## Gotchas

- `PageLoadedEvent` is abstract and declares `getPage()` abstract — the subclass must implement it.
- Do not use repositories directly in a page loader; load data from Store API routes.
- `GenericPageLoader` is optional but fills default page data such as meta information.

## Code check (6.7.13.0)
- confirmed `PageLoadedEvent` — abstract class, constructor `(SalesChannelContext, Request)` — vendor/shopware/storefront/Page/PageLoadedEvent.php:14
- confirmed `PageLoadedEvent::getPage()` — abstract, required in subclasses — vendor/shopware/storefront/Page/PageLoadedEvent.php:25
- confirmed `GenericPageLoaderInterface::load()` — `load(Request, SalesChannelContext): Page` — vendor/shopware/storefront/Page/GenericPageLoaderInterface.php:12
- confirmed `GenericPageLoader` — service registered under its class name — vendor/shopware/storefront/DependencyInjection/services.php:509
- confirmed `Page` — extends Struct — vendor/shopware/storefront/Page/Page.php:9
- confirmed `CreateFromTrait::createFrom()` — static, returns static — vendor/shopware/core/Framework/Struct/CreateFromTrait.php:10
- confirmed `StorefrontController::renderStorefront()` — used by the controller action — vendor/shopware/storefront/Controller/StorefrontController.php:67
