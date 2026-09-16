---
id: platform/dev/6.7/concepts/api/admin-api.md
title: Admin API
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/concepts/api/admin-api.html
sourceHash: 133aecf370cfa6fb574724cc107db32c35f87680
codeCheckedAgainst: "6.7.13.0"
keywords: ["admin api", "/api", "ApiRouteScope", "/api/oauth/token", "/api/_action/sync", "ApiController", "AdminApiSource", "crud", "integration", "backend api", "data synchronization", "management api"]
summary: Admin API concept - Shopware's administrative/integration HTTP surface with CRUD for every entity, used for imports, exports, sync and system-to-system work.
lastBuilt: 2026-09-15
---
## What it is

The Admin API is the administrative and integration surface of Shopware. It gives structured access to core business entities (products, orders, customers, media, configuration) and provides CRUD operations for every entity.

## When to use

Backend integrations, automation, data synchronization, imports/exports, notifications and other system-to-system communication. These workloads prioritize consistency, error handling, validation and transactional integrity, and throughput under high data loads over fast response times. For customer-facing frontends use the Store API instead.

## Key steps / config

- Routes live under the `/api` prefix (route scope `api`); access requires an admin API context source.
- Obtain a token via `POST /api/oauth/token`.
- Generic entity CRUD/search is served by `Shopware\Core\Framework\Api\Controller\ApiController`; bulk writes go through `POST /api/_action/sync`.
- For endpoints, authentication methods, schemas and request formats, the source defers to the Stoplight Admin API reference (`https://shopware.stoplight.io/docs/admin-api/8d53c59b2e6bc-shopware-admin-api`).

## Essential identifiers

- `Shopware\Core\Framework\Routing\ApiRouteScope` (`ID = 'api'`)
- `Shopware\Core\Framework\Api\Context\AdminApiSource`
- `api.oauth.token`, `api.action.sync` route names

## Code check (6.7.13.0)
- confirmed `ApiRouteScope::ID` — scope id and allowed path `api` — vendor/shopware/core/Framework/Routing/ApiRouteScope.php:15
- confirmed `AdminApiSource` — authenticated routes require an AdminApiSource context — vendor/shopware/core/Framework/Routing/ApiRouteScope.php:33
- confirmed `/api/oauth/token` — token endpoint, auth not required — vendor/shopware/core/Framework/Api/Controller/AuthController.php:33
- confirmed `/api/_action/sync` — bulk sync endpoint — vendor/shopware/core/Framework/Api/Controller/SyncController.php:43
- confirmed `ApiController` — generic entity detail/search/aggregate actions — vendor/shopware/core/Framework/Api/Controller/ApiController.php:58
- unverified `Stoplight reference` — external documentation, out of scope
