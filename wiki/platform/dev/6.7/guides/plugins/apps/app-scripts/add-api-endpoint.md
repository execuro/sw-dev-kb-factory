---
id: platform/dev/6.7/guides/plugins/apps/app-scripts/add-api-endpoint.md
title: Add an API endpoint
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/apps/app-scripts/add-api-endpoint.html
sourceHash: 21927047083d1478a92d1b440fac9e7e9fc4e82f
codeCheckedAgainst: "6.7.15.1"
keywords: ["add api endpoint", "custom endpoint", "app scripts", "/store-api/script/", "/api/script/", "/storefront/script/", "services.response.json", "hook.setResponse", "services.repository.aggregate", "shopware-cli project extension upload", "--increase-version", "topseller", "aggregation"]
summary: Tutorial for a Store API endpoint from an app script (store-api-swag-topseller) returning aggregated order data, deployed with shopware-cli.
lastBuilt: 2026-10-21
relatedPages:
  - platform/dev/6.7/guides/plugins/apps/app-scripts/_index.md
  - platform/dev/6.7/guides/plugins/apps/app-scripts/custom-endpoints.md
  - platform/dev/6.7/products/tools/cli/_index.md
  - platform/dev/6.7/guides/development/integrations-api/search-criteria.md
---
## What it is

A step-by-step tutorial that builds an app exposing a custom Store API endpoint `/store-api/script/swag/topseller`, implemented as an [app script](platform/dev/6.7/guides/plugins/apps/app-scripts/_index.md), which aggregates ordered quantities per product for a category. Requires app scripts (Shopware 6.4.8.0+).

## When to use

When an app (cloud or self-hosted) needs an endpoint that returns dynamic, computed data without an app backend. For the full endpoint/caching rules see [custom endpoints](platform/dev/6.7/guides/plugins/apps/app-scripts/custom-endpoints.md).

## Key steps / config

1. Create the project directory `MyApiExtension/` with `manifest.xml` (schema `https://raw.githubusercontent.com/shopware/shopware/trunk/src/Core/Framework/App/Manifest/Schema/manifest-3.0.xsd`). Besides `<meta>` it declares the read permissions the searches need:

```xml
<manifest xsi:noNamespaceSchemaLocation="…/manifest-3.0.xsd">
    <meta><name>MyApiExtension</name> … </meta>
    <permissions>
        <read>order</read>
        <read>order_line_item</read>
        <read>product</read>
    </permissions>
</manifest>
```

   Self-hosted: the directory may also live in `custom/apps`.
2. Pick the endpoint prefix (fixed): Store API `/store-api/script/`, Admin API `/api/script/`, Storefront `/storefront/script/`. Storefront endpoints can render Twig templates but break headless compatibility.
3. Map the route to a script folder: slashes become hyphens, and a vendor segment (`swag`) avoids collisions. `Resources/scripts/store-api-swag-topseller/topseller-script.twig` serves both `/store-api/script/swag/topseller` and `/store-api/script/swag-topseller`.
4. Implement the logic inside `{% block response %}`:

```twig
{% block response %}
    {% set categoryId = hook.request.categoryId %}
    {% set criteria = { aggregations: [ { name: "categoryFilter", type: "filter",
        filter: [{ type: "equals", field: "order.lineItems.product.categoryIds", value: categoryId }],
        aggregation: { name: "orderedProducts", type: "terms", field: "order.lineItems.productId",
            aggregation: { name: "quantityItemsOrdered", type: "sum", field: "order.lineItems.quantity" } } } ] } %}
    {% set orderAggregations = services.repository.aggregate('order', criteria) %}
    {% set response = services.response.json(orderAggregations.first.jsonSerialize) %}
    {% do hook.setResponse(response) %}
{% endblock %}
```

5. Deploy from the project root (after `shopware-cli project config init`): `shopware-cli project extension upload . --activate`. After any `manifest.xml` change add `--increase-version`.
6. Call `GET /store-api/script/swag/topseller` with header `sw-access-key`. The JSON carries `"apiAlias": "store_api_swag_topseller_response"`; the aggregated result has `buckets[]` with `key`, `count`, `quantityItemsOrdered.sum`.

## Essential identifiers

- Routes `/store-api/script/{hook}`, `/api/script/{hook}`, `/storefront/script/{hook}`
- Script folder `Resources/scripts/store-api-<hook-name>/`
- `{% block response %}`, `hook.request.*`, `hook.setResponse()`
- `services.repository.aggregate()`, `services.response.json()`
- `shopware-cli project extension upload . --activate [--increase-version]`

## Gotchas

- All logic must sit in the `response` block, otherwise calling the script errors.
- `hook.request` holds POST body parameters; GET query parameters are exposed separately as `hook.query`, so a plain GET call as in the source passes no `categoryId` to `hook.request`.
- The result is quantity ordered per product, not true top sellers; a real app should validate input, format/limit the result and define the API contract first.

## Code check (6.7.15.1)
- confirmed `store-api.script_endpoint` — route /store-api/script/{hook}, GET and POST — vendor/shopware/core/Framework/Script/Api/ScriptStoreApiRoute.php:36
- confirmed `ScriptStoreApiRoute::execute()` — replaces / with - in hook name — vendor/shopware/core/Framework/Script/Api/ScriptStoreApiRoute.php:40
- confirmed `StoreApiHook` — built with request body and query separately — vendor/shopware/core/Framework/Script/Api/ScriptStoreApiRoute.php:42
- confirmed `store_api_` — apiAlias store_api_<hook>_response with - turned into _ — vendor/shopware/core/Framework/Script/Api/ScriptStoreApiRoute.php:73
- confirmed `api.script_endpoint` — route /api/script/{hook} — vendor/shopware/core/Framework/Script/Api/ScriptApiRoute.php:34
- confirmed `frontend.script_endpoint` — route /storefront/script/{hook} — vendor/shopware/storefront/Controller/ScriptController.php:34
- confirmed `ScriptResponseFactoryFacade::json()` — services.response.json — vendor/shopware/core/Framework/Script/Api/ScriptResponseFactoryFacade.php:50
- confirmed `RepositoryFacade::aggregate()` — services.repository.aggregate — vendor/shopware/core/Framework/DataAbstractionLayer/Facade/RepositoryFacade.php:84
- confirmed `ScriptResponseAwareTrait::setResponse()` — hook.setResponse — vendor/shopware/core/Framework/Script/Execution/Awareness/ScriptResponseAwareTrait.php:32
- unverified `shopware-cli project extension upload` — external CLI tool, not in vendor/shopware
