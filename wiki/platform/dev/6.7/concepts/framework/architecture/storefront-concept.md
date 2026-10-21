---
id: platform/dev/6.7/concepts/framework/architecture/storefront-concept.md
title: Storefront
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/concepts/framework/architecture/storefront-concept.html
sourceHash: 53861fd80ebbf1e59c0cc355a3bbd322708eb2d6
codeCheckedAgainst: "6.7.15.1"
keywords: ["storefront", "page loader", "pagelet", "GenericPageLoader", "AccountOrderController", "AccountOrderPageLoader", "AccountOrderPage", "AccountOrderPageLoadedEvent", "PageLoadedEvent", "HeaderPagelet", "FooterPagelet", "OrderRoute", "composite data loading", "snippets", "trans"]
summary: "Storefront concept: Twig/Bootstrap frontend on the Core, Page/Pagelet/loader/event composition via Store API routes, directory layout, snippets."
lastBuilt: 2026-10-20
---
## What it is

The Storefront is the PHP frontend component of Shopware that sits on top of the Core, like the Administration. It renders HTML with Twig templates built on Bootstrap, uses SASS for styling and JavaScript, and ships a theming engine. Its main concerns: creating Pages and Pagelets, mapping requests to the Core, rendering templates, and providing theming.

## When to use

Read this when you need to understand how a Storefront page is assembled (controller, page loader, page struct, event), where Storefront code lives, how the Twig storefront relates to the Store API, or where Storefront snippets are stored.

## Key steps / config

Composite data loading ("Page System"): a Storefront controller action does a full lookup and loads all data for a page itself - no `postDispatch` handling and no lazy loading from templates.

A page is a three-part namespace:

- the page struct (extends `Shopware\Storefront\Page\Page`) - the data
- the page loader - creates and fills the struct
- the page event (a `PageLoadedEvent`, itself a `NestedEvent`) - extension point for plugins

A Page is rendered as a complete template; a Pagelet is part of a page and/or reachable via an XHR route.

Example: account order overview, route `/account/order` (name `frontend.account.order.page`):

1. `AccountOrderController::orderOverview()` (routing set via the `#[Route(...)]` attribute: path, name, options, defaults, methods) calls `AccountOrderPageLoader::load()`.
2. The loader gets a generic `Page` from `GenericPageLoaderInterface::load()` (meta information), then builds `AccountOrderPage::createFrom($page)`.
3. Orders are fetched through the Store API route (`AbstractOrderRoute` / `OrderRoute`), so the Storefront uses the same data as a direct API call; `$page->setOrders($orders)`.
4. The loader dispatches `AccountOrderPageLoadedEvent` - one specific loaded event per page.
5. The controller passes the page to the Twig template.

```php
$page = $this->genericLoader->load($request, $salesChannelContext);
$page = AccountOrderPage::createFrom($page);
$page->setOrders($orders);
$this->eventDispatcher->dispatch(
    new AccountOrderPageLoadedEvent($page, $salesChannelContext, $request)
);
```

Store API vs. Twig storefront: the browser does not call the Store API directly; storefront controllers use Store API routes internally. The Store API is stateless and expects auth via headers such as `sw-context-token`; the Twig storefront uses session-based authentication instead.

Directory layout of the Storefront bundle: `Controller`, `DependencyInjection`, `Event` (route request events), `Framework` (routing, caching, ...), `Migration`, `Page`, `Pagelet`, `Resources` (templates, Bootstrap-derived structure), `Test`, `Theme`, plus `Storefront.php`.

Translations: snippets are JSON files; variables and pluralization are wrapped with `%`. Templates use the Twig `trans` filter, e.g. `{{ "general.homeLink"|trans }}`. Default locales shipped: German and English; other locales come via language plugins. Mirror the core structure in your plugin.

## Essential identifiers

- `Shopware\Storefront\Page\Page`, `GenericPageLoader`, `GenericPageLoaderInterface`
- `PageLoadedEvent`, `NestedEvent`
- `HeaderPagelet`, `FooterPagelet` (both extend `NavigationPagelet`)
- `AccountOrderController`, `AccountOrderPageLoader`, `AccountOrderPage`, `AccountOrderPageLoadedEvent`
- `OrderRoute`, `AbstractOrderRoute`
- `frontend.account.order.page`, `sw-context-token`, Twig filter `trans`

## Gotchas

- The docs name the page struct `GenericPage` and the loader contract `PageLoaderInterface`; neither exists in 6.7.15.1. The base struct is `Page` and the generic loader contract is `GenericPageLoaderInterface`.
- In 6.7 `GenericPageLoader::load()` only creates a `Page` with meta information and dispatches `GenericPageLoadedEvent`; it no longer wraps header/footer. Controllers load `HeaderPagelet`/`FooterPagelet` via `HeaderPageletLoaderInterface`/`FooterPageletLoaderInterface` and pass them as separate `header`/`footer` template variables.
- Snippet files are `Resources/snippet/storefront.de.json` and `storefront.en.json` in 6.7.15.1, not per-locale `de_DE`/`en_GB` subdirectories as the docs describe.
- Snippets in the Administration and Storefront differ slightly for pluralization and variables.

## Code check (6.7.15.1)
- absent `GenericPage` — not found anywhere in the installed code; base struct is `Page`
- absent `PageLoaderInterface` — not found anywhere; generic contract is `GenericPageLoaderInterface`
- corrected `Page` — docs: page struct `GenericPage` — vendor/shopware/storefront/Page/Page.php:9
- corrected `GenericPageLoader::load()` — docs: generic page includes header/footer; installed loader sets meta information only — vendor/shopware/storefront/Page/GenericPageLoader.php:25
- confirmed `PageLoadedEvent` — abstract, extends `NestedEvent` — vendor/shopware/storefront/Page/PageLoadedEvent.php:17
- confirmed `HeaderPagelet` — extends `NavigationPagelet` — vendor/shopware/storefront/Pagelet/Header/HeaderPagelet.php:15
- confirmed `FooterPagelet` — extends `NavigationPagelet` — vendor/shopware/storefront/Pagelet/Footer/FooterPagelet.php:16
- confirmed `AccountOrderController` — route `/account/order`, name `frontend.account.order.page` — vendor/shopware/storefront/Controller/AccountOrderController.php:51
- confirmed `AccountOrderPageLoader::load()` — generic page, `createFrom`, orders via `AbstractOrderRoute`, then `AccountOrderPageLoadedEvent` — vendor/shopware/storefront/Page/Account/Order/AccountOrderPageLoader.php:45
- corrected `homeLink` — docs: per-locale snippet subdirectories; key lives in flat `storefront.en.json` — vendor/shopware/storefront/Resources/snippet/storefront.en.json:18
