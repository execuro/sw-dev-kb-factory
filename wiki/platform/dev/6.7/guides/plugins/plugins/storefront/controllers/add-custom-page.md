---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/guides/plugins/plugins/storefront/controllers/add-custom-page.md
relatedPages:
  - platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md
  - platform/dev/6.7/guides/plugins/plugins/storefront/controllers/add-custom-controller.md
  - platform/dev/6.7/guides/plugins/plugins/framework/data-handling/add-custom-complex-data.md
  - platform/dev/6.7/guides/plugins/plugins/storefront/controllers/add-custom-pagelet.md
sourceHash: 3d4c4f61e4e152ac81df40ddea875863c4c028c2
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/storefront/controllers/add-custom-page.html
title: Add Custom Page
version: "6.7"
versions:
  - "6.7"
keywords: ["Shopware\\Storefront\\Page\\Page", "Shopware\\Storefront\\Page\\PageLoadedEvent", "GenericPageLoaderInterface", "GenericPageLoader", "createFrom", "ExamplePageLoader", "ExamplePageLoadedEvent", "getPage", "page loader", "page struct", "page loaded event", "custom storefront page"]
summary: "Custom Storefront page: controller, page loader using GenericPageLoaderInterface, Page subclass via createFrom, and a PageLoadedEvent subclass."
lastBuilt: 2026-10-21
---
## What it is

How to build a complete custom Storefront page in a plugin. A page consists of a controller, a page loader, a "page loaded" event and a page class (a struct holding the page's data).

## When to use

You need a new Storefront page with its own data and an event others can subscribe to. Builds on [Add Custom Controller](platform/dev/6.7/guides/plugins/plugins/storefront/controllers/add-custom-controller.md); reusable page fragments are covered in [Add Custom Pagelet](platform/dev/6.7/guides/plugins/plugins/storefront/controllers/add-custom-pagelet.md).

## Key steps / config

1. **Controller** — a `StorefrontController` subclass with e.g. `#[Route(path: '/example-page', name: 'frontend.example.page', methods: ['GET'])]` on `examplePage(Request $request, SalesChannelContext $context): Response`. Inject `ExamplePageLoader` via the constructor, call `$this->examplePageLoader->load($request, $context)` and pass the result as `'page' => $page` to `renderStorefront('@SwagBasicExample/storefront/page/example/index.html.twig', [...])`.
2. **Page loader** — `<plugin root>/src/Storefront/Page/Example/ExamplePageLoader.php`, a plain service (no base class; an `ExamplePageLoaderInterface` is optional, for decoratability). Constructor takes `GenericPageLoaderInterface` and `EventDispatcherInterface`. Its `load()` (convention, not mandatory):

```php
public function load(Request $request, SalesChannelContext $context): ExamplePage
{
    $page = $this->genericPageLoader->load($request, $context);
    $page = ExamplePage::createFrom($page);
    $page->setExampleData(...); // data from Store API routes
    $this->eventDispatcher->dispatch(new ExamplePageLoadedEvent($page, $context, $request));
    return $page;
}
```

3. **Register services** in `services.php`:
   - `$services->set(ExamplePageLoader::class)->public()->args([service('Shopware\Storefront\Page\GenericPageLoader'), service('event_dispatcher')]);`
   - controller: `->args([service(ExamplePageLoader::class)])->call('setContainer', [service('service_container')])`
4. **Page struct** — `ExamplePage extends Shopware\Storefront\Page\Page` with a protected property plus getter and setter (`getExampleData()` / `setExampleData()`), e.g. holding the entity from [custom complex data](platform/dev/6.7/guides/plugins/plugins/framework/data-handling/add-custom-complex-data.md).
5. **Event** — `ExamplePageLoadedEvent extends Shopware\Storefront\Page\PageLoadedEvent`:

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

- `Shopware\Storefront\Page\Page`
- `Shopware\Storefront\Page\PageLoadedEvent` (abstract `getPage()`)
- `Shopware\Storefront\Page\GenericPageLoaderInterface`, service `Shopware\Storefront\Page\GenericPageLoader`
- `createFrom()` (from `CreateFromTrait` via `Struct`)
- `event_dispatcher`

## Gotchas

- Do not use a repository directly in a page loader; load data from Store API routes.
- `GenericPageLoaderInterface` is optional but loads the default page data (meta information, header/footer); without it `createFrom()` has nothing to copy.
- `createFrom()` works only because `Page` extends `Struct`, which uses `CreateFromTrait`.
- `PageLoadedEvent::getPage()` is abstract in the installed code — a subclass that omits it is a fatal error. Its constructor takes `(SalesChannelContext, Request)` in that order.

## Code check (6.7.15.1)
- confirmed `PageLoadedEvent` — abstract, extends NestedEvent — vendor/shopware/storefront/Page/PageLoadedEvent.php:17
- confirmed `PageLoadedEvent::__construct()` — (SalesChannelContext, Request) — vendor/shopware/storefront/Page/PageLoadedEvent.php:19
- confirmed `PageLoadedEvent::getPage()` — abstract, must be declared — vendor/shopware/storefront/Page/PageLoadedEvent.php:28
- confirmed `Page` — extends Struct — vendor/shopware/storefront/Page/Page.php:9
- confirmed `GenericPageLoaderInterface::load()` — returns Page — vendor/shopware/storefront/Page/GenericPageLoaderInterface.php:12
- confirmed `GenericPageLoader` — registered under its class name — vendor/shopware/storefront/DependencyInjection/services.php:519
- confirmed `CreateFromTrait::createFrom()` — static, returns static — vendor/shopware/core/Framework/Struct/CreateFromTrait.php:11
- confirmed `Struct` — uses CreateFromTrait — vendor/shopware/core/Framework/Struct/Struct.php:3
