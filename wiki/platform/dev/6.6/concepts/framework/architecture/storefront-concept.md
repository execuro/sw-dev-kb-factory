---
id: platform/dev/6.6/concepts/framework/architecture/storefront-concept.md
title: Storefront
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/concepts/framework/architecture/storefront-concept.html
sourceHash: 3e08bab3c6b31248057babeac83e0d9fe9f88134
keywords: ["Storefront", "Pages", "Pagelets", "PageLoader", "GenericPage", "AccountOrderPage", "Twig", "SASS", "Bootstrap", "composite data handling", "snippets", "translations", "PageLoadedEvent"]
summary: "Explains the Storefront PHP component: its Page/Pagelet system, composite data loading via the Store API, Twig templating, and snippet-based translations."
lastBuilt: 2026-09-15
---
## What it is
The Storefront component is a frontend written in PHP that sits conceptually on top of the Core, similar to the Administration component. As a classical PHP application, it renders HTML, uses JavaScript, and relies on a CSS preprocessor. It uses Twig as its templating engine and SASS for styling, with its default theme built on the Bootstrap framework and fully customizable.

## When to use
Read this page to understand what the Storefront component is responsible for, what technologies it uses, how it is structured, how it composes data for a page from multiple sources, what Pages, Pagelets, Controllers and Templates are, and how it handles translations.

## Key steps / config
The Storefront's main concerns are:
- Creating Pages and Pagelets
- Mapping requests to the Core
- Rendering templates
- Providing theming

Unlike an API call that returns single-resource data, a whole Storefront page displays multiple data sets composed from partials. Generic partials such as Header and Footer information are wrapped into a `GenericPage` as `Pagelets` (`HeaderPagelet`, `FooterPagelet`); this generic page is then enriched with page-specific information through a separate loader.

To fetch resource-specific data, the Storefront maps requests to the Core: internally it uses Store API routes to enrich a Page with additional information (e.g. a list of orders via the order route). Once enriched, the page loader returns the Page to a Storefront controller, which passes it to a Twig template for rendering. A theming engine on top of this can modify rendered templates or the default layout via Themes or Plugins.

### Structure
The Storefront component's top-level directories, trimmed to the essentials named in the source:
```
<Storefront>
|- Controller
|- DependencyInjection
|- Event
|- Framework
|- Migration
|- Page
|- Pagelet
|- Resources
|- Test
|- Theme
|- Storefront.php
```
`Controller` holds Storefront controllers, each giving its routing information via attributes. `DependencyInjection` holds the dependencies used in specific controllers. `Event` holds route request events. `Framework` includes Routing, Caching, and more. `Migration` and `Test` hold the component's migrations and tests. `Resources` — a derivative of the Bootstrap starter template — holds the Twig/SASS templates, bundled and transpiled with Webpack.

### Composite data handling
Composite data loading is the process of preparing and fetching all the data a whole template page needs. Rather than relying on `postDispatch`-handling or lazy loading from templates, the Storefront's controller actions perform a full lookup and handle data loading transparently and fully — this is the Page System.

Pages and Pagelets are functionally identical but used differently: a Page is generally rendered into a full template, while a Pagelet is either part of a Page or reachable through its own XHR route (sometimes both). A single Page is always a three-class namespace:
- The Page-Struct (`GenericPage`) — represents the data.
- The PageLoader (`PageLoaderInterface`) — handles creation of page structs.
- The PageEvent (`NestedEvent`) — adds a clean extension point to the pages.

As an example, the `AccountOrderController` assigns a page struct to a variable that is passed to a Twig template; the page is received from the `AccountOrderPageLoader`, which returns `AccountOrderPage`. The loader first builds a generic page via `GenericPageLoader` (carrying Header/Footer/Meta as Pagelets), then creates `AccountOrderPage` from it, adding the order list fetched through the Core's `OrderRoute` (a Store API route) — so the Storefront ends up using the same data the API would return. Once the page is fully populated, the loader dispatches a `PageLoadedEvent`; for `AccountOrderPage` specifically this is the `AccountOrderPageLoadedEvent`, giving plugins a clean extension point.

### Translations
Translations/snippets are saved as JSON files, found in `platform/src/Storefront/Resources/snippet`, with a sub-directory per locale (e.g. `de_DE`, following the ISO standard for language and destination country). Two Storefront translations ship by default: `de_DE` and `en_GB`; additional language plugins exist for other locales. Snippets support variables and pluralization, both wrapped in the `%` character. Translated values are used in Twig templates via the `trans` function, e.g. `{{ "general.homeLink"|trans }}`.

## Essential identifiers
- `GenericPage`
- `PageLoaderInterface`
- `NestedEvent`
- `AccountOrderPage`
- `AccountOrderPageLoader`
- `AccountOrderController`
- `OrderRoute`
- `PageLoadedEvent`
- `AccountOrderPageLoadedEvent`
- `trans` (Twig function)

## Gotchas
Snippets can, in theory, be placed anywhere as long as the JSON files are loaded correctly, but Shopware recommends mirroring the Core's snippet directory structure. When using pluralization and/or variables, expect slight differences between Administration and Storefront snippets.
