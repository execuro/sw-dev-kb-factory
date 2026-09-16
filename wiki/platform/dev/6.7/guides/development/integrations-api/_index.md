---
id: platform/dev/6.7/guides/development/integrations-api/_index.md
title: APIs
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/development/integrations-api/
sourceHash: 6a016ff30b07d1a99ca7c4f81acee6fa15a3eac7
codeCheckedAgainst: "6.7.13.0"
keywords: ["admin api", "store api", "/api/oauth/token", "client_credentials", "access_token", "sw-access-key", "/api/search/{entity}", "/api/_info/stoplightio.html", "/store-api/_info/stoplightio.html", "integration", "access key", "oauth", "APP_ENV", "quick start"]
summary: Quick start for Shopware Admin API (OAuth client_credentials via integration, /api/search/product) and Store API (sw-access-key header, /store-api/product).
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/concepts/api/_index.md", "platform/dev/6.7/guides/development/integrations-api/auth-api-requests.md", "platform/dev/6.7/guides/installation/_index.md"]
---
## What it is

A quick start for the first authenticated requests against Shopware's two HTTP APIs: the **Admin API** (base path `/api/*`) for backend work such as products, orders, customers, plugins and bulk operations via the Sync API, and the **Store API** (base path `/store-api/*`) for storefront-facing use such as headless frontends, apps, cart and checkout.

## When to use

When a running local Shopware instance (see [Installation](platform/dev/6.7/guides/installation/_index.md)) needs its first Admin API token and test requests, or a Store API call with a sales channel access key. For architecture background see [API concepts](platform/dev/6.7/concepts/api/_index.md). The next step is [Authentication and API Requests](platform/dev/6.7/guides/development/integrations-api/auth-api-requests.md).

## Key steps / config

1. **Check the instance.** Open the storefront on `127.0.0.1:8000` and the Administration under `/admin`. If the storefront host does not answer, add it as an extra domain under *Sales Channels → Storefront → Domains*. For better error output, run in development mode (`APP_ENV=dev`). Check with `docker compose exec web printenv APP_ENV`, set it in `.env.local` if needed, then restart with `make up`.
2. **Get an Admin API token.** Create an integration under *Settings → System → Integrations* with the "Administrator" toggle on. The **Access key ID** is `client_id`, the **Secret access key** is `client_secret`. POST JSON to `/api/oauth/token`:

   ```json
   {
     "grant_type": "client_credentials",
     "client_id": "<access key id>",
     "client_secret": "<secret access key>"
   }
   ```

   Response shape: `{ "token_type": "...", "expires_in": 600, "access_token": "..." }`. With the default `shopware.api.access_token_ttl` (`PT10M`), `expires_in` is 600 seconds.
3. **Call the Admin API.** `POST /api/search/product` with body `{}`, `Content-Type: application/json`, and the `access_token` sent as a bearer token in the `Authorization` header. A response with `data`, `meta` and `aggregations` means success, even if `data` is empty.
4. **Call the Store API.** Copy the **API access key** of the sales channel (*Sales Channels → your channel → API access*). Send it in the `sw-access-key` header, e.g. to `/store-api/product` (GET or POST). An empty `elements` array still means the request worked. Generating a new key invalidates the old one.
5. **Work with data.** Both APIs share search criteria (filtering, sorting, pagination) and return context-aware responses, based on permissions or sales channel state.

Local reference docs: `/api/_info/stoplightio.html` and `/store-api/_info/stoplightio.html`.

## Essential identifiers

- `/api/oauth/token` — `grant_type`, `client_id`, `client_secret`, `access_token`
- `client_credentials` grant (integration credentials)
- `/api/search/{entity}` (POST)
- `sw-access-key` header, `/store-api/product`
- `/api/_info/stoplightio.html`, `/store-api/_info/stoplightio.html`
- `shopware.api.access_token_ttl`

## Gotchas

- Access tokens are short-lived: 10 minutes by default for every grant type. The docs example shows `expires_in` 3600, which does not match the installed default.
- If the token request output does not show in the terminal, leave any nested shell session and retry.
- The `stoplightio.html` pages require authentication unless `shopware.api.api_browser.auth_required` is false. Core's `dev` environment config sets it to false.

## Code check (6.7.13.0)
- confirmed `/api/oauth/token` — POST route api.oauth.token, auth_required false — vendor/shopware/core/Framework/Api/Controller/AuthController.php:33
- confirmed `client_credentials` — integration grant validated against the integration's access key and secret — vendor/shopware/core/Framework/Api/OAuth/ClientRepository.php:39
- corrected `access_token_ttl` — docs: expires_in 3600; default TTL is PT10M (600 s) for all grants — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:203
- confirmed `/api/search/` — dynamic POST search route per entity — vendor/shopware/core/Framework/Api/Route/ApiRouteLoader.php:109
- confirmed `sw-access-key` — PlatformRequest::HEADER_ACCESS_KEY — vendor/shopware/core/PlatformRequest.php:19
- confirmed `/store-api/product` — GET and POST, route store-api.product.search — vendor/shopware/core/Content/Product/SalesChannel/ProductListRoute.php:36
- confirmed `/api/_info/stoplightio.html` — local Admin API reference — vendor/shopware/core/Framework/Api/Controller/InfoController.php:153
- confirmed `/store-api/_info/stoplightio.html` — local Store API reference — vendor/shopware/core/System/SalesChannel/SalesChannel/StoreApiInfoController.php:70
- confirmed `auth_required` — api_browser.auth_required false in core dev config (default true) — vendor/shopware/core/Framework/Resources/config/packages/dev/shopware.yaml:7
