---
id: platform/dev/6.7/guides/plugins/apps/app-scripts/data-loading.md
title: Data Loading
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/apps/app-scripts/data-loading.html
sourceHash: 7627bff8b942d032261d8221c5da7b116f4b183f
codeCheckedAgainst: "6.7.13.0"
keywords: ["data loading", "app scripts", "product-page-loaded", "hook.page", "services.repository", "services.store", "addExtension", "addArrayExtension", "getExtension", "criteria", "storefront template data", "page extension"]
summary: "Load extra data for Storefront templates with app scripts: page-loaded hooks, repository vs store services, criteria arrays, addExtension/addArrayExtension."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/concepts/framework/architecture/storefront-concept.md", "platform/dev/6.7/concepts/framework/data-abstraction-layer.md", "platform/dev/6.7/resources/references/app-reference/script-reference/data-loading-script-services-reference.md", "platform/dev/6.7/guides/development/integrations-api/search-criteria.md"]
---
## What it is

App scripts can load additional data during Storefront page rendering and attach it to the `page` object, so customized Storefront templates can read it. Builds on the Storefront composite data-loading concept; each rendered page triggers a page-loaded hook exposing `hook.page`.

## When to use

An app's customized Storefront templates need data that the page does not already carry (e.g. extra entities on the product detail page). Hooks triggered during rendering are listed in the Symfony toolbar; the full list is in the [script hook reference](platform/dev/6.7/resources/references/app-reference/script-reference/script-hooks-reference.md).

## Key steps / config

1. Create a script in the folder named after the hook, e.g. `Resources/scripts/product-page-loaded/my-example-script.twig`:

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

2. Load data with the `repository` service: `search()` (full entities), `ids()` (IDs only), `aggregate()` (aggregations only). All take the entity name first, then a criteria array shaped like the Admin API JSON criteria ([search criteria](platform/dev/6.7/guides/development/integrations-api/search-criteria.md)).
3. Or use the `store` service (same interface) for "public" entities such as `product` and `category`: Storefront-optimized, resolves SEO data, calculates product prices, only returns active entities visible in the current sales channel.
4. Read the data in the template:

```twig
{% sw_extends '@Storefront/storefront/page/product-detail/index.html.twig' %}
{% block page_product_detail %}
    <h1>{{ page.getExtension('swagMyAdditionalData').example }}</h1>
    {{ parent() }}
{% endblock %}
```

For `addArrayExtension`, access nested keys: `page.getExtension('swagArrayExtension').collection`.

## Essential identifiers

- Hook `product-page-loaded` (`Shopware\Storefront\Page\Product\ProductPage` as `hook.page`)
- `services.repository.search()`, `.ids()`, `.aggregate()`
- `services.store.search()`, `.ids()`, `.aggregate()`
- `page.addExtension(name, struct)`, `page.addArrayExtension(name, array)`, `page.getExtension(name)`

## Gotchas

- `addExtension` requires a `Struct` (entity, collection); scalars or several structs must go through `addArrayExtension`, which wraps the array in an `ArrayStruct`.
- Extension names must be unique — prefix with your vendor prefix; a second add under the same name overwrites the first.
- `repository` requires `read` permission for every entity read (see [permissions](platform/dev/6.7/guides/plugins/apps/lifecycle/app-registration-setup.md)); `store` needs no extra permissions. `repository` matches Admin API CRUD data, `store` matches Store API data.
- Extensions can be added to any struct, not only the page (e.g. each product inside the page).

## Version notes

App scripts exist since Shopware 6.4.8.0; not supported before.

## Code check (6.7.13.0)
- confirmed `ProductPageLoadedHook::HOOK_NAME` — value `product-page-loaded` — vendor/shopware/storefront/Page/Product/ProductPageLoadedHook.php:24
- confirmed `ProductPageLoadedHook::getPage()` — returns ProductPage — vendor/shopware/storefront/Page/Product/ProductPageLoadedHook.php:39
- confirmed `RepositoryFacadeHookFactory::getName()` — service name `repository` — vendor/shopware/core/Framework/DataAbstractionLayer/Facade/RepositoryFacadeHookFactory.php:41
- confirmed `SalesChannelRepositoryFacadeHookFactory::getName()` — service name `store` — vendor/shopware/core/Framework/DataAbstractionLayer/Facade/SalesChannelRepositoryFacadeHookFactory.php:42
- confirmed `RepositoryFacade::search()` — entity name plus criteria array — vendor/shopware/core/Framework/DataAbstractionLayer/Facade/RepositoryFacade.php:50
- confirmed `RepositoryFacade::ids()` — returns IdSearchResult — vendor/shopware/core/Framework/DataAbstractionLayer/Facade/RepositoryFacade.php:67
- confirmed `RepositoryFacade::aggregate()` — returns AggregationResultCollection — vendor/shopware/core/Framework/DataAbstractionLayer/Facade/RepositoryFacade.php:84
- confirmed `SalesChannelRepositoryFacade::search()` — same signature as repository — vendor/shopware/core/Framework/DataAbstractionLayer/Facade/SalesChannelRepositoryFacade.php:51
- confirmed `ExtendableTrait::addExtension()` — requires a Struct — vendor/shopware/core/Framework/Struct/ExtendableTrait.php:21
- confirmed `ExtendableTrait::addArrayExtension()` — wraps array in ArrayStruct — vendor/shopware/core/Framework/Struct/ExtendableTrait.php:32
