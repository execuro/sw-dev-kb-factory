---
id: platform/dev/6.7/guides/development/integrations-api/auth-api-requests.md
title: Authentication and API Requests
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/development/integrations-api/auth-api-requests.html
sourceHash: bf4b8399764e26d3a4496f542ba82b5b3b1d45d7
codeCheckedAgainst: "6.7.15.1"
keywords: ["password grant", "administration", "/api/oauth/token", "impersonation", "imitate customer", "api_proxy_imitate-customer", "/api/_proxy/generate-imitate-customer-token", "/store-api/account/login/imitate-customer", "sw-context-token", "openapi3.json", "open-api-schema.json", "system:install", "api_browser", "openapi schema"]
summary: Admin API password-grant shortcut, customer impersonation via imitate-customer token, OpenAPI/entity schema download endpoints and local DB troubleshooting.
lastBuilt: 2026-10-20
relatedPages:
  - platform/dev/6.7/guides/development/integrations-api/_index.md
  - platform/dev/6.7/guides/development/integrations-api/search-criteria.md
  - platform/dev/6.7/guides/development/integrations-api/request-headers.md
  - platform/dev/6.7/guides/development/integrations-api/partial-data-loading.md
---
## What it is

Follow-up to platform/dev/6.7/guides/development/integrations-api/_index.md: a local-only password-grant token shortcut, the customer impersonation flow, search endpoints versus listing routes, raw OpenAPI/entity schema downloads, and fixes for an uninitialised local database.

## When to use

Local development and support tooling: quickly getting an Admin token without an integration, opening a Store API context as an existing customer, or generating API clients from the schema.

## Key steps / config

### Local password grant (local only)

`POST /api/oauth/token` with the built-in `administration` client:

```json
{
  "grant_type": "password",
  "client_id": "administration",
  "scopes": "write",
  "username": "admin",
  "password": "shopware"
}
```

The response carries `token_type`, `expires_in` (600 in the example), `access_token` and `refresh_token`. For integrations and reproducible setups keep using `client_credentials`.

### Impersonate a customer

1. With an Admin API token of a **user** holding the ACL privilege `api_proxy_imitate-customer`, call `POST /api/_proxy/generate-imitate-customer-token` with body `{ "salesChannelId": ..., "customerId": ... }`.
2. Redeem it with `POST /store-api/account/login/imitate-customer` (header `sw-access-key`), body:
   ```json
   { "token": "...", "customerId": "...", "userId": "..." }
   ```
   The new context token is returned in the `sw-context-token` response header; use it for subsequent requests.

### Prefer search endpoints

Use `POST /api/search/product` (body `{}`) instead of `GET /api/product`: search endpoints support filtering, sorting, pagination and loading associations.

### Schema downloads

- OpenAPI spec: `/(api|store-api)/_info/openapi3.json` (e.g. save as `openapi.json`)
- Entity schema: `/(api|store-api)/_info/open-api-schema.json` (e.g. save as `entity-schema.json`)

Send the Admin token in the `Authorization` header for the `/api/` variants.

### Troubleshooting

Errors such as `Table 'shopware.system_config' doesn't exist`, `Table 'shopware.plugin' doesn't exist` or HTTP 500 on `/api/_info/openapi3.json` mean the database is not initialised. Run `docker compose exec web bin/console system:install --create-database --basic-setup`.

## Essential identifiers

- `grant_type` `password`, `client_id` `administration`, `scopes` `write`
- `api_proxy_imitate-customer`
- `POST /api/_proxy/generate-imitate-customer-token`
- `POST /store-api/account/login/imitate-customer`
- `sw-context-token`, `sw-access-key`
- `/api/_info/openapi3.json`, `/api/_info/open-api-schema.json` (and `/store-api/` equivalents)
- `bin/console system:install --create-database --basic-setup`

## Gotchas

- Impersonation performs a real customer login: login events fire and cart changes affect the customer's real cart. Grant the ACL privilege only to trusted users.
- The token generator requires an Admin API source with a user ID; a token from a user-less source (e.g. an integration) is rejected as "user not logged in".
- Docs say `APP_ENV` must be `dev` to access the schema endpoints. In code these routes require authentication unless `shopware.api.api_browser.auth_required` is `false`; the core default is `true` and the `dev` environment config sets `false`. With a valid token they are reachable in other environments too.

## Version notes

- With the `v6.8.0.0` feature flag active, the redeem route decodes the token itself and checks its sales channel; the `customerId`/`userId` body fields are only validated on the pre-6.8 path.

## Code check (6.7.15.1)
- confirmed `ClientRepository` — `administration` client accepted for `password`/`refresh_token` grants — vendor/shopware/core/Framework/Api/OAuth/ClientRepository.php:23
- confirmed `api_proxy_imitate-customer` — ACL required on the token-generation route — vendor/shopware/core/Framework/Api/Controller/SalesChannelProxyController.php:174
- confirmed `/api/_proxy/generate-imitate-customer-token` — POST route — vendor/shopware/core/Framework/Api/Controller/SalesChannelProxyController.php:172
- confirmed `SalesChannelProxyController::generateImitateCustomerToken()` — throws if source has no user ID — vendor/shopware/core/Framework/Api/Controller/SalesChannelProxyController.php:177
- confirmed `/store-api/account/login/imitate-customer` — POST route returning a context token — vendor/shopware/core/Checkout/Customer/SalesChannel/ImitateCustomerRoute.php:72
- confirmed `v6.8.0.0` — redeem path switches to token decoding under this flag — vendor/shopware/core/Checkout/Customer/SalesChannel/ImitateCustomerRoute.php:80
- confirmed `/api/_info/openapi3.json` — GET route — vendor/shopware/core/Framework/Api/Controller/InfoController.php:68
- confirmed `/api/_info/open-api-schema.json` — GET route — vendor/shopware/core/Framework/Api/Controller/InfoController.php:124
- confirmed `/store-api/_info/openapi3.json` — Store API counterpart — vendor/shopware/core/System/SalesChannel/SalesChannel/StoreApiInfoController.php:37
- corrected `shopware.api.api_browser.auth_required` — docs: `APP_ENV` must be `dev`; code: auth toggle, default true, dev sets false — vendor/shopware/core/Framework/DependencyInjection/FrameworkExtension.php:41
