---
id: platform/dev/6.7/concepts/api/_index.md
title: API
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/concepts/api/
sourceHash: f8c23e851291c7eb04956397348f67cbe5e0b64b
codeCheckedAgainst: "6.7.15.1"
keywords: ["api", "store api", "admin api", "administration api", "rest", "http json api", "oauth 2.0", "/api/oauth/token", "sw-access-key", "sw-context-token", "Criteria", "search criteria", "headless integration"]
summary: "Overview of Shopware's two HTTP/JSON APIs: Store API (customer-facing, sw-access-key) and Admin API (OAuth 2.0), sharing Criteria-based search."
lastBuilt: 2026-10-20
relatedPages: ["platform/dev/6.7/guides/development/integrations-api/_index.md"]
---
## What it is

Concept overview of the HTTP-based APIs Shopware exposes to external systems and custom applications. There are two functional APIs, each a separate integration surface:

- **Store API** — customer-facing interactions (routes under `/store-api/...`).
- **Admin API** — administrative and system-level operations (routes under `/api/...`).

## When to use

When deciding which API an integration should target, or before reading the practical guide at [platform/dev/6.7/guides/development/integrations-api/_index.md](platform/dev/6.7/guides/development/integrations-api/_index.md) (setup, authentication, request examples, links to the generated API reference).

## Key steps / config

- Both APIs use HTTP and exchange JSON payloads.
- **Admin API** requires OAuth 2.0 authentication; tokens are issued by `POST /api/oauth/token`.
- **Store API** is publicly accessible and needs only contextual headers — the sales channel access key `sw-access-key`, plus `sw-context-token` for a customer/cart context. Authentication is required only for customer-specific endpoints.
- Shared design principles:
  - search criteria abstraction for filtering, sorting and pagination (`Shopware\Core\Framework\DataAbstractionLayer\Search\Criteria`);
  - structured JSON request/response bodies;
  - header-based contextual behaviour (e.g. `sw-language-id`, `sw-version-id`).

## Essential identifiers

- `/api/oauth/token` — Admin API OAuth token route
- `sw-access-key`, `sw-context-token`, `sw-language-id`, `sw-version-id` — context headers (`Shopware\Core\PlatformRequest`)
- `Shopware\Core\Framework\DataAbstractionLayer\Search\Criteria`
- Route scopes `api` and `store-api`

## Code check (6.7.15.1)
- confirmed `/api/oauth/token` — Admin API OAuth token endpoint, `auth_required` false — vendor/shopware/core/Framework/Api/Controller/AuthController.php:38
- confirmed `PlatformRequest::HEADER_ACCESS_KEY` — header name `sw-access-key` — vendor/shopware/core/PlatformRequest.php:19
- confirmed `PlatformRequest::HEADER_CONTEXT_TOKEN` — header name `sw-context-token` — vendor/shopware/core/PlatformRequest.php:18
- confirmed `PlatformRequest::HEADER_LANGUAGE_ID` — header name `sw-language-id` — vendor/shopware/core/PlatformRequest.php:20
- confirmed `PlatformRequest::HEADER_VERSION_ID` — header name `sw-version-id` — vendor/shopware/core/PlatformRequest.php:23
- confirmed `Criteria` — shared search criteria class — vendor/shopware/core/Framework/DataAbstractionLayer/Search/Criteria.php:25
- confirmed `ApiRouteScope::ID` — Admin API route scope `api` — vendor/shopware/core/Framework/Routing/ApiRouteScope.php:15
- confirmed `StoreApiRouteScope::ID` — Store API route scope `store-api` — vendor/shopware/core/Framework/Routing/StoreApiRouteScope.php:15
