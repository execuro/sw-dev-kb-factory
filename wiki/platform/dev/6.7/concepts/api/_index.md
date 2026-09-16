---
id: platform/dev/6.7/concepts/api/_index.md
title: API
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/concepts/api/
sourceHash: f8c23e851291c7eb04956397348f67cbe5e0b64b
codeCheckedAgainst: "6.7.13.0"
keywords: ["api", "Store API", "Admin API", "store-api", "OAuth 2.0", "/api/oauth/token", "sw-access-key", "sw-context-token", "Criteria", "rest api", "headless", "integration"]
summary: Overview of Shopware's two HTTP JSON APIs - Store API (customer-facing, sw-access-key header) and Admin API (OAuth 2.0) - and their shared patterns.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/development/integrations-api/_index.md"]
---
## What it is

Concept overview of the HTTP-based APIs Shopware exposes to external systems and custom applications. There are two functional APIs: the **Store API** for customer-facing interactions and the **Admin API** for administrative and system-level operations. Both use HTTP with JSON request and response bodies.

## When to use

When choosing which API an integration, headless frontend or app should talk to, before following the practical setup in the API guide ([platform/dev/6.7/guides/development/integrations-api/_index.md](platform/dev/6.7/guides/development/integrations-api/_index.md)).

## Key steps / config

- **Admin API** - routes under the `/api` prefix (route scope `api`); requires OAuth 2.0 authentication, tokens are issued by `POST /api/oauth/token`.
- **Store API** - routes under the `/store-api` prefix (route scope `store-api`); publicly accessible with contextual headers: the sales channel access key in `sw-access-key`, and `sw-context-token` to carry the customer/cart context. Customer-specific endpoints additionally require a logged-in customer context.
- Shared design patterns of both APIs:
  - search criteria abstraction for filtering, sorting and pagination (backed by `Shopware\Core\Framework\DataAbstractionLayer\Search\Criteria`);
  - structured JSON request/response bodies;
  - header-based contextual behaviour.

## Essential identifiers

- `/api`, `/store-api`
- `/api/oauth/token`
- `sw-access-key`, `sw-context-token`
- `Shopware\Core\Framework\DataAbstractionLayer\Search\Criteria`

## Code check (6.7.13.0)
- confirmed `ApiRouteScope::ALLOWED_PATH` — Admin API route scope and path prefix `api` — vendor/shopware/core/Framework/Routing/ApiRouteScope.php:16
- confirmed `StoreApiRouteScope::ALLOWED_PATH` — Store API route scope and path prefix `store-api` — vendor/shopware/core/Framework/Routing/StoreApiRouteScope.php:16
- confirmed `/api/oauth/token` — OAuth token route `api.oauth.token`, POST — vendor/shopware/core/Framework/Api/Controller/AuthController.php:33
- confirmed `PlatformRequest::HEADER_ACCESS_KEY` — header name `sw-access-key` — vendor/shopware/core/PlatformRequest.php:19
- confirmed `PlatformRequest::HEADER_CONTEXT_TOKEN` — header name `sw-context-token` — vendor/shopware/core/PlatformRequest.php:18
- confirmed `Criteria` — DAL search criteria class — vendor/shopware/core/Framework/DataAbstractionLayer/Search/Criteria.php:25
- confirmed `DefinitionService::STORE_API` — API type constant `store-api` — vendor/shopware/core/Framework/Api/ApiDefinition/DefinitionService.php:21
