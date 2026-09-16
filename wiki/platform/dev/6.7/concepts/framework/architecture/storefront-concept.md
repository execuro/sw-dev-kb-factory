---
id: platform/dev/6.7/concepts/framework/architecture/storefront-concept.md
title: Storefront
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/concepts/framework/architecture/storefront-concept.html
sourceHash: 53861fd80ebbf1e59c0cc355a3bbd322708eb2d6
codeCheckedAgainst: "6.7.13.0"
keywords: ["storefront", "page loader", "pagelet", "GenericPageLoader", "GenericPageLoaderInterface", "PageLoadedEvent", "AccountOrderPageLoader", "AccountOrderController", "HeaderPagelet", "FooterPagelet", "sw-context-token", "composite data handling", "snippets", "twig", "trans"]
summary: Storefront concept - Twig/Bootstrap PHP frontend on the Core; Page/PageLoader/PageLoadedEvent pattern, Store API usage, directory layout, snippet files.
lastBuilt: 2026-09-15
---
## What it is

The Storefront is a server-rendered PHP frontend (Symfony bundle `Shopware\Storefront\Storefront`) that sits on top of the Core, like the Administration. It uses Twig templates built on Bootstrap, SASS, JavaScript, and a theming engine. Its concerns: creating Pages and Pagelets, mapping requests to the Core, rendering templates, and providing theming.

## When to use

When building or extending storefront pages: adding data to an existing page, writing a custom controller/page loader, subscribing to page-loaded events, or locating templates and snippets.

## Key steps / config

**Store API inside the Twig storefront:** the browser does not call the Store API directly; storefront page loaders call Store API route classes internally. The Store API is stateless and expects auth via headers such as `sw-context-token`; the Twig storefront relies on the session instead.

**Page system (composite data handling):** controller actions do a full data lookup instead of `postDispatch` handling or lazy loading from templates. A Page is rendered as a full template; a Pagelet is part of a Page and/or reachable via an XHR route. A page consists of:

- a page struct extending `Shopware\Storefront\Page\Page` (data)
- a page loader with a `load(Request, SalesChannelContext)` method (creates the struct)
- a page-loaded event extending `Shopware\Storefront\Page\PageLoadedEvent`, itself a `NestedEvent` (extension point)

**Example: account order page** (route `/account/order`, name `frontend.account.order.page`):

1. `AccountOrderController` receives the page from `AccountOrderPageLoader` and passes it to a Twig template; routing is declared via method attributes.
2. `AccountOrderPageLoader::load()` builds the generic page through the injected generic loader service `Shopware\Storefront\Page\GenericPageLoader` (header, footer, meta information as pagelets such as `HeaderPagelet`, `FooterPagelet`).
3. It converts it with `AccountOrderPage::createFrom($page)` and sets orders fetched via `AbstractOrderRoute::load()` (Store API order route, `OrderRoute`).
4. It dispatches `AccountOrderPageLoadedEvent` for plugin extensibility.

The installed loader carries the note: do not use direct or indirect repository calls in a PageLoader; always use a store-api route.

**Directory layout** (`Storefront` package): `Controller`, `DependencyInjection`, `Event` (route request events, e.g. `OrderRouteRequestEvent`), `Framework` (routing, caching, ...), `Migration`, `Page`, `Pagelet`, `Resources` (Bootstrap-derived templates, SCSS, JS), `Theme`, `Storefront.php`.

**Translations:** snippets are JSON files with `%`-wrapped variables and pluralization, used in Twig via the `trans` filter:

```twig
{{ "general.homeLink"|trans }}
```

Installed core snippets are flat files in `Resources/snippet`: `storefront.de.json`, `storefront.en.json`. Plugins should mirror the core structure.

## Essential identifiers

- `Shopware\Storefront\Page\Page`, `Shopware\Storefront\Page\PageLoadedEvent`
- `Shopware\Storefront\Page\GenericPageLoader`
- `AccountOrderController`, `AccountOrderPageLoader`, `AccountOrderPage`, `AccountOrderPageLoadedEvent`
- `HeaderPagelet`, `FooterPagelet`
- `AbstractOrderRoute`, `OrderRoute`
- `frontend.account.order.page`, `sw-context-token`
- `general.homeLink`, `trans`

## Gotchas

- The docs name the page struct `GenericPage` and the loader interface `PageLoaderInterface`; neither exists in the installed code. The generic page is a `Page` produced by `GenericPageLoader` (contract `GenericPageLoaderInterface`); concrete loaders such as `AccountOrderPageLoader` implement no shared interface.
- The docs place snippets in per-locale subdirectories (`de_DE`, `en_GB`); the installed Storefront ships flat `storefront.de.json` / `storefront.en.json`.

## Code check (6.7.13.0)
- absent `GenericPage` — no class or reference of that name in the installed code
- absent `PageLoaderInterface` — only the generic loader's own interface exists
- confirmed `GenericPageLoader` — generic page loader implementation — vendor/shopware/storefront/Page/GenericPageLoader.php:14
- confirmed `Page` — base page struct — vendor/shopware/storefront/Page/Page.php:9
- confirmed `PageLoadedEvent` — abstract, extends NestedEvent — vendor/shopware/storefront/Page/PageLoadedEvent.php:14
- confirmed `AccountOrderPageLoader` — loads generic page, orders via AbstractOrderRoute, dispatches event — vendor/shopware/storefront/Page/Account/Order/AccountOrderPageLoader.php:30
- confirmed `AccountOrderPageLoadedEvent` — dispatched at end of load() — vendor/shopware/storefront/Page/Account/Order/AccountOrderPageLoader.php:63
- confirmed `frontend.account.order.page` — route name for `/account/order` — vendor/shopware/storefront/Controller/AccountOrderController.php:78
- confirmed `HEADER_CONTEXT_TOKEN` — header name `sw-context-token` — vendor/shopware/core/PlatformRequest.php:18
- corrected `homeLink` — docs: snippets in de_DE/en_GB subdirectories; key lives in flat storefront.en.json — vendor/shopware/storefront/Resources/snippet/storefront.en.json:18
