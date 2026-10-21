---
id: platform/dev/6.7/guides/plugins/apps/app-scripts/data-loading.md
title: Data Loading
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/apps/app-scripts/data-loading.html
sourceHash: 7627bff8b942d032261d8221c5da7b116f4b183f
codeCheckedAgainst: "6.7.15.1"
keywords: ["app scripts", "data loading", "product-page-loaded", "addArrayExtension", "addExtension", "getExtension", "services.repository", "services.store", "search", "ids", "aggregate", "criteria", "storefront page extension"]
summary: "Load extra Storefront data in app scripts via repository/store services; attach it to page via addExtension/addArrayExtension."
lastBuilt: 2026-10-21
relatedPages:
  - platform/dev/6.7/guides/plugins/apps/app-scripts/_index.md
  - platform/dev/6.7/resources/references/app-reference/script-reference/script-hooks-reference.md
  - platform/dev/6.7/resources/references/app-reference/script-reference/data-loading-script-services-reference.md
  - platform/dev/6.7/concepts/framework/architecture/storefront-concept.md
---
## What it is

App scripts can load additional data for [customized Storefront templates](platform/dev/6.7/guides/plugins/plugins/storefront/templates/customize-templates.md). Following the Storefront's [composite data-loading concept](platform/dev/6.7/concepts/framework/architecture/storefront-concept.md), a hook fires per rendered page and exposes the `page` object, which the script can read from and add data to; it is then passed to the templates.

## When to use

When an app's templates need data the default page lacks. Data-loading hooks are listed in the [script hook reference](platform/dev/6.7/resources/references/app-reference/script-reference/script-hooks-reference.md); triggered hooks also show in the Symfony toolbar (see [App Scripts](platform/dev/6.7/guides/plugins/apps/app-scripts/_index.md)).

## Key steps / config

1. Put the script in the hook's folder, e.g. `Resources/scripts/product-page-loaded/my-example-script.twig`:

```twig
{% set page = hook.page %}
{# @var page \Shopware\Storefront\Page\Product\ProductPage #}
{% set criteria = {
    'ids': [ 'id1', 'id2' ],
    'associations': { 'manufacturer': {}, 'cover': {} },
    'filter': [ { 'type': 'equals', 'field': 'active', 'value': true } ]
} %}
{% set products = services.repository.search('product', criteria) %}
{% do page.addExtension('swagCollection', products) %}
{% do page.addArrayExtension('swagMyAdditionalData', { 'example': 'just an example' }) %}
```

2. Load data with the `repository` service ([DAL](platform/dev/6.7/concepts/framework/data-abstraction-layer.md) reads): `search()` for full entities, `ids()` for IDs only, `aggregate()` for aggregations. Each takes the entity name, then the criteria, which match the API's [JSON criteria](platform/dev/6.7/guides/development/integrations-api/search-criteria.md).
3. Attach data: `addExtension(name, data)` accepts only a `Struct` (collections, entities); `addArrayExtension(name, data)` takes a JSON-like twig object for scalars or several structs.
4. Read it in the template, e.g. `Resources/views/storefront/page/product-detail/index.html.twig` extending `@Storefront/storefront/page/product-detail/index.html.twig`:

```twig
{% block page_product_detail %}
    <h1>{{ page.getExtension('swagMyAdditionalData').example }}</h1>
    {{ parent() }}
{% endblock %}
```

**`repository` vs. `store`:** `store` has the same interface but only returns "public" entities (e.g. `product`, `category`; active and visible in the current sales channel) in a Storefront-optimized form: SEO data resolved, product prices calculated. `repository` needs `read` permission per entity ([permissions](platform/dev/6.7/guides/plugins/apps/lifecycle/app-registration-setup.md)), `store` none. `repository` mirrors Admin API CRUD data, `store` the Store API ([Integrations API](platform/dev/6.7/guides/development/integrations-api/_index.md)); see the [services reference](platform/dev/6.7/resources/references/app-reference/script-reference/data-loading-script-services-reference.md).

## Essential identifiers

- `hook.page`, `services.repository`, `services.store`
- `page.addExtension()`, `page.addArrayExtension()`, `page.getExtension()`

## Gotchas

- Extension names must be unique; prefix them with your vendor prefix.
- Extensions can be added to every struct, e.g. to each product in the page.

## Version notes

- App scripts were introduced in Shopware 6.4.8.0.

## Code check (6.7.15.1)
- confirmed `ExtendableTrait::addExtension()` — accepts only a `Struct` — vendor/shopware/core/Framework/Struct/ExtendableTrait.php:21
- confirmed `ExtendableTrait::addArrayExtension()` — wraps the array in an `ArrayStruct` — vendor/shopware/core/Framework/Struct/ExtendableTrait.php:32
- confirmed `ExtendableTrait::getExtension()` — returns the named struct or null — vendor/shopware/core/Framework/Struct/ExtendableTrait.php:51
- confirmed `RepositoryFacade::search()` — entity name plus criteria array — vendor/shopware/core/Framework/DataAbstractionLayer/Facade/RepositoryFacade.php:50
- confirmed `RepositoryFacade::ids()` — returns an IdSearchResult — vendor/shopware/core/Framework/DataAbstractionLayer/Facade/RepositoryFacade.php:67
- confirmed `RepositoryFacade::aggregate()` — returns aggregation results — vendor/shopware/core/Framework/DataAbstractionLayer/Facade/RepositoryFacade.php:84
- confirmed `repository` — script service name — vendor/shopware/core/Framework/DataAbstractionLayer/Facade/RepositoryFacadeHookFactory.php:43
- confirmed `store` — script service name, needs a sales-channel-aware hook — vendor/shopware/core/Framework/DataAbstractionLayer/Facade/SalesChannelRepositoryFacadeHookFactory.php:44
- confirmed `product-page-loaded` — hook name — vendor/shopware/storefront/Page/Product/ProductPageLoadedHook.php:24
