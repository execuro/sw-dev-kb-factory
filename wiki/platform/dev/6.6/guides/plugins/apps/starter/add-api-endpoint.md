---
id: platform/dev/6.6/guides/plugins/apps/starter/add-api-endpoint.md
title: Starter Guide - Add an API endpoint
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/apps/starter/add-api-endpoint.html
sourceHash: 6e402a11451528af5659da2a29a7087acf86711b
keywords: ["app scripts", "store-api/script", "api/script", "storefront/script", "hook.request", "hook.setResponse", "services.repository.aggregate", "services.response.json", "shopware-cli", "manifest.xml", "aggregation", "topseller endpoint"]
summary: "Tutorial building a custom Store API endpoint with an App Script that aggregates order data and returns a JSON response."
lastBuilt: "2026-09-15"
---
## What it is
A walkthrough for adding a custom API endpoint using App Scripts, covering app setup, script-based routing, fetching/filtering/aggregating Shopware data, and consuming HTTP parameters. Relies on App Scripts (introduced in 6.4.8.0).

## When to use
Use when an app needs a custom read-only or computed endpoint (e.g. a topseller list) without running an external app server.

## Key steps / config
Manifest requires `read` permissions for entities queried (e.g. `order`, `order_line_item`, `product`):

```xml
<manifest>
    <meta>...</meta>
    <permissions>
        <read>order</read>
        <read>order_line_item</read>
        <read>product</read>
    </permissions>
</manifest>
```

Endpoint route prefixes (fixed, cannot be changed):
- Store API: `/store-api/script/`
- Admin API: `/api/script/`
- Storefront: `/storefront/script/`

Script directory naming replaces path slashes with hyphens, e.g. a script exposed at `/store-api/script/swag/topseller` lives at `Resources/scripts/store-api-swag-topseller/topseller-script.twig`, and is also reachable at `/store-api/script/swag-topseller`.

```twig
{% block response %}
    {% set categoryId = hook.request.categoryId %}
    {% set criteria = { aggregations: [ { name: "categoryFilter", type: "filter", filter: [...], aggregation: {...} } ] } %}
    {% set orderAggregations = services.repository.aggregate('order', criteria) %}
    {% set response = services.response.json(orderAggregations.first.jsonSerialize) %}
    {% do hook.setResponse(response) %}
{% endblock %}
```

Install/update with `shopware-cli project extension upload . --activate` (add `--increase-version` after manifest changes). Call it with `curl --request GET --url https://<your-store-url>/store-api/script/swag/topseller --header 'sw-access-key: insert-your-access-key'`.

## Essential identifiers
- `hook.request.*`, `hook.setResponse()`
- `services.repository.aggregate()`, `services.response.json()`
- `shopware-cli project extension upload`
- `sw-access-key` header

## Gotchas
All work that produces the response must happen inside the `response` block of the twig script, or calling the script errors. All logic in this example (input validation, response limiting) is left incomplete and should be hardened for production; the result reflects order quantity, not true "top sellers".

## Version notes
Requires App Scripts, introduced in Shopware 6.4.8.0.
