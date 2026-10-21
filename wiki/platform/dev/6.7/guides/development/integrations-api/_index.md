---
id: platform/dev/6.7/guides/development/integrations-api/_index.md
title: APIs
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/development/integrations-api/
sourceHash: 3cd383b88a02e605cab291e45bfa7d39130cdf20
codeCheckedAgainst: "6.7.15.1"
keywords: ["admin api", "store api", "/api/oauth/token", "client_credentials", "client_id", "client_secret", "access_token", "sw-access-key", "/api/search/{entity}", "integration", "oauth", "stoplightio.html", "quick start", "APP_ENV"]
summary: Quick start for Shopware Admin API (OAuth client_credentials token, POST /api/search/product) and Store API (sw-access-key header) on a local instance.
lastBuilt: 2026-10-20
relatedPages:
  - platform/dev/6.7/guides/development/integrations-api/auth-api-requests.md
  - platform/dev/6.7/concepts/api/_index.md
  - platform/dev/6.7/concepts/api/store-api.md
  - platform/dev/6.7/guides/installation/_index.md
---
## What it is

A quick start for making the first successful request against Shopware's two HTTP APIs: the **Admin API** (base path `/api/*`, backend operations such as products, orders, customers, plugins, bulk imports via the Sync API) and the **Store API** (base path `/store-api/*`, customer-facing: listings, cart, checkout, headless frontends, mobile apps).

## When to use

When a local Shopware instance is running (see platform/dev/6.7/guides/installation/_index.md) and you need an Admin API token, a working authenticated request, or Store API access via a sales channel key.

## Key steps / config

1. **Verify the instance.** Open the Storefront and `/admin` on the local host (the guide uses `127.0.0.1:8000`). If `127.0.0.1:8000` does not load the Storefront, add it as an additional domain under `Sales Channels → Storefront → Domains`. For better error visibility use `APP_ENV=dev`; check with `docker compose exec web printenv APP_ENV`, set it in `.env.local` if needed and restart with `make up`.
2. **Create an integration** under **Settings → System → Integrations** with the "Administrator" toggle on. Access key ID maps to `client_id`, secret access key to `client_secret`.
3. **Request a token**: `POST /api/oauth/token` with `Content-Type: application/json`:
   ```json
   {
     "grant_type": "client_credentials",
     "client_id": "YOUR_ACCESS_KEY_ID",
     "client_secret": "YOUR_SECRET_ACCESS_KEY"
   }
   ```
   The response contains `token_type`, `expires_in` (3600 in the example) and `access_token`.
4. **Make an authenticated request**: `POST /api/search/product` with an `Authorization` header carrying the `access_token` as a bearer token and body `{}`. A response with `data`, `meta` and `aggregations` keys means success; an empty `data` array just means no products.
5. **Store API**: copy the **API access key** from the sales channel's **API access** section (regenerating it invalidates the old key) and send it in the `sw-access-key` header, e.g. `GET /store-api/product`. An empty `elements` array is still a successful request.
6. Both APIs share search criteria (filtering, sorting, pagination) and context-aware responses — see platform/dev/6.7/concepts/api/_index.md and platform/dev/6.7/concepts/api/store-api.md.

Local API references: `/api/_info/stoplightio.html` and `/store-api/_info/stoplightio.html`.

## Essential identifiers

- `POST /api/oauth/token`, grant `client_credentials`, fields `client_id`, `client_secret`, response `access_token`
- `POST /api/search/{entity}`
- `sw-access-key` (Store API header)
- `/api/_info/stoplightio.html`, `/store-api/_info/stoplightio.html`
- `APP_ENV=dev`, `.env.local`

## Gotchas

- Use the same host (`127.0.0.1:8000`) consistently in local examples; it is often the one already configured.
- If the token response does not appear in the terminal, exit any nested shell session and retry.
- The `stoplightio.html` reference pages require authentication unless `shopware.api.api_browser.auth_required` is false — the core default is `true`, the `dev` environment package sets it to `false`.

## Code check (6.7.15.1)
- confirmed `/api/oauth/token` — POST route `api.oauth.token`, no auth required — vendor/shopware/core/Framework/Api/Controller/AuthController.php:38
- confirmed `client_credentials` — grant validated with client secret — vendor/shopware/core/Framework/Api/OAuth/ClientRepository.php:50
- confirmed `ScopeRepository::CLIENT_CREDENTIAL_GRANT` — constant value `client_credentials` — vendor/shopware/core/Framework/Api/OAuth/ScopeRepository.php:40
- confirmed `/api/search/` — search routes registered per entity — vendor/shopware/core/Framework/Api/Route/ApiRouteLoader.php:109
- confirmed `PlatformRequest::HEADER_ACCESS_KEY` — value `sw-access-key` — vendor/shopware/core/PlatformRequest.php:19
- confirmed `/api/_info/stoplightio.html` — GET route, auth governed by api_browser setting — vendor/shopware/core/Framework/Api/Controller/InfoController.php:153
- confirmed `/store-api/_info/stoplightio.html` — Store API reference route — vendor/shopware/core/System/SalesChannel/SalesChannel/StoreApiInfoController.php:70
- confirmed `shopware.api.api_browser.auth_required` — drives `auth_required_str` route default — vendor/shopware/core/Framework/DependencyInjection/FrameworkExtension.php:41
