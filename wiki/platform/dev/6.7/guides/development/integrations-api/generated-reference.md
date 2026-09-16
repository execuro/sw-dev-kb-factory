---
id: platform/dev/6.7/guides/development/integrations-api/generated-reference.md
title: Generated Reference
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/development/integrations-api/generated-reference.html
sourceHash: 40717c90b81580744d3b51e201ff856742b4bc2f
codeCheckedAgainst: "6.7.13.0"
keywords: ["openapi", "swagger-php", "stoplight", "/api/_info/openapi3.json", "/store-api/_info/openapi3.json", "/api/_info/open-api-schema.json", "/api/_info/stoplightio.html", "/api/_info/entity-schema.json", "auth_required", "api schema", "admin api", "store api", "api documentation"]
summary: "Admin API and Store API schema endpoints: _info/openapi3.json, _info/open-api-schema.json and Stoplight UI at _info/stoplightio.html."
lastBuilt: 2026-09-15
---
## What it is

Shopware generates OpenAPI schemas for both HTTP APIs (Admin API and Store API), usable by API client libraries and documentation tools such as Stoplight. Schemas are built from PHP annotations of the swagger-php library; custom API endpoints can use the same annotations to get documented automatically.

## When to use

When you need a machine-readable or browsable reference of Admin API / Store API endpoints or entity schemas, e.g. to generate a client or inspect a custom endpoint's documentation.

## Key steps / config

Endpoints, relative to each API base path (`api` = Admin API, `store-api` = Store API; pick one of the two):

- Stoplight UI: `/(api|store-api)/_info/stoplightio.html`
- OpenAPI schema only (no UI): `/(api|store-api)/_info/openapi3.json`
- Schema definitions for all entities: `/(api|store-api)/_info/open-api-schema.json`

Details from the installed code:

- Generic entity endpoints (product, category, ...) of the Admin API: `api/_info/stoplightio.html?type=jsonapi#/`. The Admin Stoplight page defaults to the plain `json` type, so pass `type=jsonapi` for the JSON:API entity reference.
- The Admin API additionally exposes `/api/_info/entity-schema.json` (Shopware entity schema format); the Store API does not support an entity schema endpoint and refers to `/store-api/_info/openapi3.json` instead.
- Access control: the `_info` schema routes set `auth_required` from the container parameter `shopware.api.api_browser.auth_required`. The core default is `true` (authenticated request needed); the core `dev` environment package config sets it to `false`, so the pages open without authentication when `APP_ENV` is `dev`.
  ```yaml
  shopware:
      api:
          api_browser:
              auth_required: false
  ```

## Essential identifiers

- `/api/_info/stoplightio.html`, `/store-api/_info/stoplightio.html`
- `/api/_info/openapi3.json`, `/store-api/_info/openapi3.json`
- `/api/_info/open-api-schema.json`, `/store-api/_info/open-api-schema.json`
- `/api/_info/entity-schema.json` (Admin API only)
- `shopware.api.api_browser.auth_required`

## Gotchas

- The docs state `APP_ENV` must be `dev` to access these specifications. In the installed code the routes exist in every environment; what the `dev` config changes is `auth_required` (false), whereas the default requires an authenticated request.

## Code check (6.7.13.0)
- confirmed `/api/_info/openapi3.json` — Admin API route api.info.openapi3 — vendor/shopware/core/Framework/Api/Controller/InfoController.php:68
- confirmed `/store-api/_info/openapi3.json` — Store API route store-api.info.openapi3 — vendor/shopware/core/System/SalesChannel/SalesChannel/StoreApiInfoController.php:37
- confirmed `/api/_info/open-api-schema.json` — Admin API route — vendor/shopware/core/Framework/Api/Controller/InfoController.php:124
- confirmed `/store-api/_info/open-api-schema.json` — Store API route — vendor/shopware/core/System/SalesChannel/SalesChannel/StoreApiInfoController.php:57
- confirmed `/api/_info/stoplightio.html` — Admin API Stoplight page — vendor/shopware/core/Framework/Api/Controller/InfoController.php:153
- confirmed `/store-api/_info/stoplightio.html` — Store API Stoplight page — vendor/shopware/core/System/SalesChannel/SalesChannel/StoreApiInfoController.php:70
- confirmed `/api/_info/entity-schema.json` — Admin API only — vendor/shopware/core/Framework/Api/Controller/InfoController.php:136
- corrected `auth_required` — docs: APP_ENV must be dev; code: api_browser default true, auth needed in any env — vendor/shopware/core/Framework/Resources/config/packages/shopware.yaml:231
- confirmed `auth_required` — dev package config sets api_browser to false — vendor/shopware/core/Framework/Resources/config/packages/dev/shopware.yaml:7
- unverified `APP_ENV` — no environment check in the _info route definitions; access governed by auth_required
