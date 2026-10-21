---
id: platform/dev/6.7/guides/development/integrations-api/generated-reference.md
title: Generated Reference
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/development/integrations-api/generated-reference.html
sourceHash: 40717c90b81580744d3b51e201ff856742b4bc2f
codeCheckedAgainst: "6.7.15.1"
keywords: ["stoplightio.html", "openapi3.json", "open-api-schema.json", "entity-schema.json", "openapi", "swagger-php", "stoplight", "api schema", "shopware.api.api_browser.auth_required", "admin api", "store api", "api reference"]
summary: "Endpoints for Shopware's generated OpenAPI schemas and Stoplight UI on Admin API and Store API, and the auth_required switch that gates them."
lastBuilt: 2026-10-21
---
## What it is

Shopware generates OpenAPI schemas for both HTTP APIs (Admin API and Store API) that API clients and documentation tools such as Stoplight can read. The schemas are built from PHP annotations using the swagger-php library; custom endpoints in your extension can use the same annotations so Shopware documents them on the fly.

## When to use

When you need an interactive reference for the Admin or Store API, want the raw OpenAPI document for a client generator, or want entity schema definitions instead of an endpoint list.

## Key steps / config

Endpoints (choose `api` for the Admin API or `store-api` for the Store API):

- Stoplight UI: `/api/_info/stoplightio.html`, `/store-api/_info/stoplightio.html`
- OpenAPI document: `/api/_info/openapi3.json`, `/store-api/_info/openapi3.json`
- Entity schema: `/api/_info/open-api-schema.json` (Admin API only — see Gotchas)

The docs write these compactly as `/(api|store-api)/_info/stoplightio.html` etc.

Both the UI and the OpenAPI document accept a `type` query parameter: `jsonapi` or `json`. The Admin API Stoplight page defaults to `json`; for the generic entity endpoints (product, category, …) open `api/_info/stoplightio.html?type=jsonapi`. The Store API endpoints default to `jsonapi`.

Access is controlled by `shopware.api.api_browser.auth_required` (default `true`). The core's `dev` package config sets it to `false`, which is why running with `APP_ENV=dev` makes the pages reachable without credentials. In other environments the routes still exist but require normal API authentication (Store API: the `sw-access-key` header), unless you set the option to `false` yourself.

```yaml
shopware:
    api:
        api_browser:
            auth_required: false
```

## Essential identifiers

- `/api/_info/stoplightio.html`, `/store-api/_info/stoplightio.html`
- `/api/_info/openapi3.json`, `/store-api/_info/openapi3.json`
- `/api/_info/open-api-schema.json`
- `shopware.api.api_browser.auth_required`
- swagger-php annotations

## Gotchas

- The docs list `/store-api/_info/open-api-schema.json` as an entity schema endpoint, but in 6.7.15.1 the Store API generator throws `ApiException::unsupportedStoreApiSchemaEndpoint()` (HTTP 400, "Use `/store-api/_info/openapi3.json`"). Use the Admin API variant for entity schemas.
- The docs state `APP_ENV` must be `dev`; the actual switch is `shopware.api.api_browser.auth_required`, which the dev environment config merely turns off.
- The Admin API also has `/api/_info/entity-schema.json`, a separate entity-schema format not covered by the docs page.

## Code check (6.7.15.1)
- corrected `shopware.api.api_browser.auth_required` — docs: APP_ENV must be dev; code: option (default true, false in dev package config) sets auth_required on the routes — vendor/shopware/core/Framework/DependencyInjection/FrameworkExtension.php:41
- confirmed `auth_required` — dev package config sets it to false — vendor/shopware/core/Framework/Resources/config/packages/dev/shopware.yaml:7
- confirmed `/api/_info/stoplightio.html` — Admin API Stoplight route — vendor/shopware/core/Framework/Api/Controller/InfoController.php:153
- confirmed `DefinitionService::TYPE_JSON` — Admin API Stoplight default type is json — vendor/shopware/core/Framework/Api/Controller/InfoController.php:161
- confirmed `/store-api/_info/stoplightio.html` — Store API Stoplight route — vendor/shopware/core/System/SalesChannel/SalesChannel/StoreApiInfoController.php:70
- confirmed `/api/_info/openapi3.json` — Admin API OpenAPI route — vendor/shopware/core/Framework/Api/Controller/InfoController.php:68
- confirmed `/store-api/_info/openapi3.json` — Store API OpenAPI route — vendor/shopware/core/System/SalesChannel/SalesChannel/StoreApiInfoController.php:37
- confirmed `/api/_info/open-api-schema.json` — Admin API entity schema route — vendor/shopware/core/Framework/Api/Controller/InfoController.php:124
- corrected `/store-api/_info/open-api-schema.json` — docs: usable entity schema; code: route exists but generator throws unsupportedStoreApiSchemaEndpoint — vendor/shopware/core/System/SalesChannel/SalesChannel/StoreApiInfoController.php:57
- confirmed `ApiException::unsupportedStoreApiSchemaEndpoint()` — thrown by StoreApiGenerator::getSchema — vendor/shopware/core/Framework/Api/ApiException.php:297
