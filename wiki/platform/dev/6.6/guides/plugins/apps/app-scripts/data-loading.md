---
id: platform/dev/6.6/guides/plugins/apps/app-scripts/data-loading.md
title: Data loading
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/apps/app-scripts/data-loading.html
sourceHash: 462352a9079376ac6005badca1349e08d58abd5c
keywords: ["data loading", "services.repository", "services.store", "page.addExtension", "page.addArrayExtension", "page.getExtension", "search criteria", "product-page-loaded", "search()", "ids()", "aggregate()", "storefront templates"]
summary: "Loading additional data into Storefront page objects with app scripts via the repository/store services and page extensions."
lastBuilt: "2026-09-15"
---
## What it is

Explains loading additional data for the Storefront via app scripts and exposing it to templates through the `page` object.

## When to use

When a customized Storefront template needs data not already present on the page object, loaded on a data-loading hook such as `product-page-loaded`.

## Key steps / config

Set data on the page object in a script and read it back in the template:

```twig
// Resources/scripts/product-page-loaded/my-example-script.twig
{% set page = hook.page %}
{% set myAdditionalData = { 'example': 'just an example' } %}
{% do page.addArrayExtension('swagMyAdditionalData', myAdditionalData) %}
```

```twig
// Resources/views/storefront/page/product-detail/index.html.twig
{% sw_extends '@Storefront/storefront/page/product-detail/index.html.twig' %}
{% block page_product_detail %}
    <h1>{{ page.getExtension('swagMyAdditionalData').example }}</h1>
    {{ parent() }}
{% endblock %}
```

The `repository` service loads data via `search()` (full entities), `ids()` (ids only), or `aggregate()` (aggregated data only), all taking an entity name and a criteria object (same shape as the API search criteria):

```twig
{% set matchedProducts = services.repository.search('product', criteria) %}
```

The `store` service offers the same interface but only for "public" entities (active, visible for the sales channel, e.g. `product`, `category`); it resolves SEO data and calculates prices, and does not require `read` permissions the way `repository` does. `repository` exposes the same data as the Admin API CRUD operations; `store` exposes the same data as the Store API.

Adding data to a struct: `page.addExtension(name, structValue)` for PHP `Struct` objects (entities/collections), or `page.addArrayExtension(name, arrayValue)` to wrap scalars or multiple structs in a twig object; read back with `page.getExtension(name)`.

## Essential identifiers

- `services.repository.search()`, `.ids()`, `.aggregate()`
- `services.store` (same interface, public entities only)
- `page.addExtension()`, `page.addArrayExtension()`, `page.getExtension()`

## Gotchas

Extension names must be prefixed with the app's vendor prefix to stay unique. `addExtension` only accepts PHP `Struct` objects; scalars/multiple values need `addArrayExtension`.

## Version notes

App scripts (and this data-loading mechanism) were introduced in Shopware 6.4.8.0 and are not supported in prior versions.
