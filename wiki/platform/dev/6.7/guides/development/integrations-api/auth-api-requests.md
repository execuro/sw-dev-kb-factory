---
id: platform/dev/6.7/guides/development/integrations-api/auth-api-requests.md
title: Authentication and API Requests
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/development/integrations-api/auth-api-requests.html
sourceHash: 65a6a24130de793749b6e5fa85a5cd5cc726de42
codeCheckedAgainst: "6.7.13.0"
keywords: ["password grant", "/api/oauth/token", "administration", "refresh_token", "/api/search/product", "openapi3.json", "open-api-schema.json", "openapi schema", "entity schema", "system:install", "api_browser.auth_required", "admin api token", "troubleshooting"]
summary: Admin API local password-grant token (client_id administration), search endpoints, openapi3.json/open-api-schema.json downloads, DB-init troubleshooting.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/development/integrations-api/_index.md", "platform/dev/6.7/guides/development/integrations-api/search-criteria.md", "platform/dev/6.7/guides/development/integrations-api/request-headers.md", "platform/dev/6.7/guides/development/integrations-api/partial-data-loading.md"]
---
## What it is

A follow-up to the [APIs](platform/dev/6.7/guides/development/integrations-api/_index.md) quick start. It covers a local-only password-grant token shortcut, why search endpoints beat plain list routes, how to download the raw OpenAPI and entity schemas, and fixes for requests that fail on an uninitialized database.

## When to use

During local development against the Admin API: getting a token fast with the default admin user, building real queries, generating API clients from the schema, or debugging HTTP 500s and missing-table errors.

## Key steps / config

### Local password-grant token

POST JSON to `/api/oauth/token` using the default Administration credentials (local only):

```json
{
  "grant_type": "password",
  "client_id": "administration",
  "scopes": "write",
  "username": "admin",
  "password": "shopware"
}
```

Response shape: `{ "token_type": "...", "expires_in": 600, "access_token": "...", "refresh_token": "..." }`. The access token lives for the `shopware.api.access_token_ttl` default `PT10M`. The refresh token lasts `P1W` by default. Integrations and reproducible setups should keep using `client_credentials`.

### Prefer search endpoints

Use `POST /api/search/product` with a JSON body (e.g. `{}`) instead of `GET /api/product`. Search endpoints support filtering, sorting, pagination and loading associations in the same request. Send the `access_token` as a bearer token in the `Authorization` header.

### Download schemas

- OpenAPI spec (full API contract, client generation): `GET /api/_info/openapi3.json` → save as `openapi.json`
- Entity schema (entity and field metadata): `GET /api/_info/open-api-schema.json` → save as `entity-schema.json`
- Store API OpenAPI spec: `GET /store-api/_info/openapi3.json`

These routes use `auth_required` = `shopware.api.api_browser.auth_required` (default `true`; core's `dev` config sets `false`). Outside `dev`, send the bearer token.

### Troubleshooting

Errors like `Table 'shopware.system_config' doesn't exist`, `Table 'shopware.plugin' doesn't exist` or `HTTP 500 on /api/_info/openapi3.json` usually mean the database is not initialized. Run:

```bash
docker compose exec web bin/console system:install --create-database --basic-setup
```

## Essential identifiers

- `/api/oauth/token` with `grant_type` `password`, `client_id` `administration`, `scopes` `write`
- `/api/search/product`
- `/api/_info/openapi3.json`, `/api/_info/open-api-schema.json`, `/store-api/_info/openapi3.json`
- `shopware.api.api_browser.auth_required`, `shopware.api.access_token_ttl`
- `bin/console system:install --create-database --basic-setup`

## Gotchas

- The password grant with `client_id` `administration` is a local shortcut. `--basic-setup` is the option that creates the admin user and the storefront sales channel.
- The Store API does not support the entity schema: `/store-api/_info/open-api-schema.json` is routed but responds with an error pointing to `/store-api/_info/openapi3.json`. The docs list it as available for both APIs.
- The docs say `APP_ENV` must be `dev` to access the schemas. In code, the switch is `shopware.api.api_browser.auth_required`: in other environments the endpoints need a valid token, but they are not blocked.

## Code check (6.7.13.0)
- confirmed `ClientRepository::validateClient()` — password/refresh_token grant accepted for client_id administration — vendor/shopware/core/Framework/Api/OAuth/ClientRepository.php:35
- confirmed `WriteScope::IDENTIFIER` — scope value write — vendor/shopware/core/Framework/Api/OAuth/Scope/WriteScope.php:11
- confirmed `access_token_ttl` — default PT10M (600 s, matches docs expires_in 600) — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:203
- confirmed `refresh_token_ttl` — default P1W — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:204
- confirmed `/api/search/` — POST-only dynamic search route per entity — vendor/shopware/core/Framework/Api/Route/ApiRouteLoader.php:109
- confirmed `/api/_info/openapi3.json` — route api.info.openapi3 — vendor/shopware/core/Framework/Api/Controller/InfoController.php:68
- confirmed `/api/_info/open-api-schema.json` — route api.info.open-api-schema — vendor/shopware/core/Framework/Api/Controller/InfoController.php:124
- corrected `unsupportedStoreApiSchemaEndpoint` — docs: entity schema available on store-api too; StoreApiGenerator::getSchema() throws — vendor/shopware/core/Framework/Api/ApiDefinition/Generator/StoreApiGenerator.php:138
- corrected `auth_required` — docs: APP_ENV must be dev; code: api_browser.auth_required defaults true, dev config false — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:213
- confirmed `create-database` — system:install option; basic-setup creates storefront sales channel and admin user — vendor/shopware/core/Maintenance/System/Command/SystemInstallCommand.php:46
