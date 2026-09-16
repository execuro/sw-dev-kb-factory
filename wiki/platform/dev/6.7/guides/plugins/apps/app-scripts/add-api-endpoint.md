---
id: platform/dev/6.7/guides/plugins/apps/app-scripts/add-api-endpoint.md
title: Add an API endpoint
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/apps/app-scripts/add-api-endpoint.html
sourceHash: 21927047083d1478a92d1b440fac9e7e9fc4e82f
codeCheckedAgainst: "6.7.13.0"
keywords: ["custom endpoint", "app scripts", "/store-api/script/", "/api/script/", "/storefront/script/", "hook.setResponse", "services.response.json", "services.repository.aggregate", "store-api-swag-topseller", "aggregation", "response block", "shopware-cli project extension upload", "api endpoint"]
summary: Build a custom Store API endpoint from an app script in Resources/scripts/store-api-<name>/ - response block, repository aggregation, JSON response.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/apps/app-scripts/_index.md", "platform/dev/6.7/guides/plugins/apps/app-scripts/custom-endpoints.md", "platform/dev/6.7/guides/development/integrations-api/search-criteria.md", "platform/dev/6.7/guides/development/troubleshooting/dal-reference/aggregations-reference.md"]
---
## What it is

A tutorial for adding a custom API endpoint to an app using [app scripts](platform/dev/6.7/guides/plugins/apps/app-scripts/_index.md) (available since 6.4.8.0): a "top seller" Store API endpoint that aggregates ordered quantities per product for a category and returns JSON.

## When to use

An app (cloud or self-hosted, e.g. in `custom/apps`) must expose data through Store API, Admin API or Storefront without a plugin backend.

## Key steps / config

1. Manifest with the ACL permissions the script's searches need:

```xml
<manifest xsi:noNamespaceSchemaLocation="https://raw.githubusercontent.com/shopware/shopware/trunk/src/Core/Framework/App/Manifest/Schema/manifest-3.0.xsd">
    <meta>... <name>MyApiExtension</name> ...</meta>
    <permissions>
        <read>order</read>
        <read>order_line_item</read>
        <read>product</read>
    </permissions>
</manifest>
```

2. Pick the fixed route prefix: Store API `/store-api/script/`, Admin API `/api/script/`, Storefront `/storefront/script/` (Storefront can also render Twig templates but is not headless-compatible; see [custom endpoints](platform/dev/6.7/guides/plugins/apps/app-scripts/custom-endpoints.md)).
3. Directory: slashes in the route become hyphens in the hook directory. `/store-api/script/swag/topseller` maps to `Resources/scripts/store-api-swag-topseller/topseller-script.twig`; it is reachable as both `/store-api/script/swag/topseller` and `/store-api/script/swag-topseller`. A vendor subdirectory (`swag`) avoids collisions.
4. Script content goes inside `{% block response %}`. The category id is read from the request (see Gotchas for GET vs. POST):

```twig
{% block response %}
    {% set criteria = { aggregations: [ { name: "categoryFilter", type: "filter",
        filter: [ { type: "equals", field: "order.lineItems.product.categoryIds", value: categoryId } ],
        aggregation: { name: "orderedProducts", type: "terms", field: "order.lineItems.productId",
            aggregation: { name: "quantityItemsOrdered", type: "sum", field: "order.lineItems.quantity" } } } ] } %}
    {% set orderAggregations = services.repository.aggregate('order', criteria) %}
    {% set response = services.response.json(orderAggregations.first.jsonSerialize) %}
    {% do hook.setResponse(response) %}
{% endblock %}
```

   Criteria structure: [Search Criteria](platform/dev/6.7/guides/development/integrations-api/search-criteria.md), [aggregations reference](platform/dev/6.7/guides/development/troubleshooting/dal-reference/aggregations-reference.md).
5. Install/update: `shopware-cli project extension upload . --activate` (after `shopware-cli project config init`); add `--increase-version` when `manifest.xml` changed.
6. Call it with header `sw-access-key: <access key>` on `https://<your-store-url>/store-api/script/swag/topseller`. The JSON carries `"apiAlias": "store_api_swag_topseller_response"` plus the data (here `buckets` of `aggregation_bucket`).

## Essential identifiers

- `/store-api/script/{hook}`, `/api/script/{hook}`, `/storefront/script/{hook}`
- `Resources/scripts/store-api-<name>/`
- `{% block response %}`
- `hook.request` (POST body), `hook.query` (query string), `hook.setResponse()`
- `services.repository.aggregate()`, `services.response.json()`
- `store_api_<name>_response` (apiAlias)
- `shopware-cli project extension upload`, `--activate`, `--increase-version`

## Gotchas

- All logic must be inside the `response` block, otherwise calling the script errors.
- The source reads the category via `hook.request.categoryId` and says `hook.request.*` holds POST body parameters. The installed route passes query-string parameters separately (`hook.query`), so for a GET call read `hook.query.categoryId`, or send the id in a POST body.
- For GET requests the `cache_key` function runs first; without it the response is not cached.
- The example sums ordered quantities, not real top sellers; add input validation and result limits in a real app.

## Code check (6.7.13.0)
- confirmed `/store-api/script/{hook}` — GET/POST route `store-api.script_endpoint` — vendor/shopware/core/Framework/Script/Api/ScriptStoreApiRoute.php:36
- confirmed `str_replace` — slashes in `{hook}` mapped to hyphens for the hook name — vendor/shopware/core/Framework/Script/Api/ScriptStoreApiRoute.php:40
- corrected `StoreApiHook` — docs: GET example reads `hook.request`; request = POST body, query string passed separately — vendor/shopware/core/Framework/Script/Api/ScriptStoreApiRoute.php:42
- confirmed `store_api_` — apiAlias `store_api_<hook>_response` built from hook name — vendor/shopware/core/Framework/Script/Api/ScriptStoreApiRoute.php:73
- confirmed `/api/script/{hook}` — Admin API route — vendor/shopware/core/Framework/Script/Api/ScriptApiRoute.php:35
- confirmed `/storefront/script/{hook}` — Storefront route — vendor/shopware/storefront/Controller/ScriptController.php:34
- confirmed `StoreApiResponseHook::FUNCTION_NAME` — `response` function — vendor/shopware/core/Framework/Script/Api/StoreApiResponseHook.php:34
- confirmed `ScriptResponseAwareTrait::setResponse()` — sets the ScriptResponse — vendor/shopware/core/Framework/Script/Execution/Awareness/ScriptResponseAwareTrait.php:32
- confirmed `ScriptResponseFactoryFacade::json()` — `json(array $data, int $code)` — vendor/shopware/core/Framework/Script/Api/ScriptResponseFactoryFacade.php:50
- confirmed `RepositoryFacade::aggregate()` — aggregate(entityName, criteria) — vendor/shopware/core/Framework/DataAbstractionLayer/Facade/RepositoryFacade.php:84
