---
id: platform/dev/6.7/concepts/api/admin-api.md
title: Admin API
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/concepts/api/admin-api.html
sourceHash: 133aecf370cfa6fb574724cc107db32c35f87680
codeCheckedAgainst: "6.7.15.1"
keywords: ["admin api", "administration api", "management api", "crud", "integration", "data synchronization", "import export", "ApiController", "/api/_action/sync", "/api/oauth/token", "oauth", "backend integration"]
summary: "Admin API concept: Shopware's administrative/integration surface with CRUD for every entity, aimed at backend integrations, sync, imports and exports."
lastBuilt: 2026-10-20
---
## What it is

The Admin API is Shopware's administrative and integration surface. It gives structured access to core business entities such as products, orders, customers, media and configuration, and provides CRUD operations for every entity in Shopware.

## When to use

For backend integrations, automation, data synchronization and system-to-system communication — typically structured data exchange, imports, exports and notifications with external systems.

## Key steps / config

- Integrations on this API prioritise consistency, error handling, validation and transactional integrity; performance matters in terms of high data volumes rather than fast response times.
- Generic CRUD for any entity is handled by `Shopware\Core\Framework\Api\Controller\ApiController` (`search`, `create`, `update`, `delete`).
- Bulk writes for synchronization go through `POST /api/_action/sync`.
- Authenticate via OAuth (`POST /api/oauth/token`) before calling other routes.
- For endpoints, authentication methods, schemas and request formats, refer to the Admin API reference (Stoplight: "Admin API – Stoplight Reference", `https://shopware.stoplight.io/docs/admin-api/8d53c59b2e6bc-shopware-admin-api`).

## Essential identifiers

- `Shopware\Core\Framework\Api\Controller\ApiController`
- `/api/_action/sync`
- `/api/oauth/token`

## Code check (6.7.15.1)
- confirmed `ApiController` — generic Admin API entity controller — vendor/shopware/core/Framework/Api/Controller/ApiController.php:58
- confirmed `ApiController::search()` — entity search action — vendor/shopware/core/Framework/Api/Controller/ApiController.php:278
- confirmed `ApiController::create()` — entity create action — vendor/shopware/core/Framework/Api/Controller/ApiController.php:313
- confirmed `ApiController::update()` — entity update action — vendor/shopware/core/Framework/Api/Controller/ApiController.php:326
- confirmed `ApiController::delete()` — entity delete action — vendor/shopware/core/Framework/Api/Controller/ApiController.php:339
- confirmed `/api/_action/sync` — bulk sync route — vendor/shopware/core/Framework/Api/Controller/SyncController.php:43
- confirmed `/api/oauth/token` — OAuth token route — vendor/shopware/core/Framework/Api/Controller/AuthController.php:38
