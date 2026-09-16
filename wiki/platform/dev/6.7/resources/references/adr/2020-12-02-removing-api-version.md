---
id: platform/dev/6.7/resources/references/adr/2020-12-02-removing-api-version.md
title: API version removal
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2020-12-02-removing-api-version.html
sourceHash: 763a07a91a98bbcf567cceab17d9cb5ea33216a8
codeCheckedAgainst: "6.7.13.0"
keywords: ["api versioning", "/api/v{VERSION}/product", "/api/product", "/store-api", "ApiRouteLoader", "openapi", "api changelog", "deprecation strategy", "admin api url", "route url", "adr"]
summary: "ADR: API version removed from URLs; /api/v{VERSION}/product became /api/product (both served 6.3.5.0 until 6.4.0.0). Deprecations removed per major."
lastBuilt: 2026-09-15
---
## What it is

Architecture decision record (2020-12-02) that removed the version segment from Shopware API route URLs. Instead of versioning the API, deprecated fields and routes are announced and removed with the next major version.

## When to use

When migrating an integration that still calls versioned URLs of the form `/api/v{VERSION}/...`, or when you need to know how API breaking changes are communicated instead of through a URL version.

## Key steps / config

- Call routes without a version segment: `/api/v{VERSION}/product` became `/api/product`. In 6.7 the Admin API entity routes are generated as `/api/<entity-name>` (underscores in entity names become hyphens), e.g. `/api/product`, and Store API routes are likewise unversioned, e.g. `/store-api/account/logout`.
- Deprecated fields and routes are tagged in a minor version, shown in the OpenAPI scheme and in the API changelog, and removed with the next major version (`6.x`).
- The OpenAPI scheme is served at `/api/_info/openapi3.json`.

## Essential identifiers

- `/api/product` (unversioned Admin API URL shape)
- `Shopware\Core\Framework\Api\Route\ApiRouteLoader` (generates `/api/<entity>` routes)
- `/api/_info/openapi3.json`

## Gotchas

- Reason for the change: with the deprecation strategy and a 6–8 month major cycle, the API version was never increased in a minor, and raising it would have meant removing deprecations every second minor.
- Watch the OpenAPI scheme and API changelog for deprecations; a major release removes them without a URL version bump.

## Version notes

- From 6.3.5.0 until the release of 6.4.0.0 both `/api/v{VERSION}/product` and `/api/product` were accessible, to let integrations prepare. From 6.4.0.0 only the unversioned URLs remain.

## Code check (6.7.13.0)
- confirmed `'/api/' . $resourceName` — entity routes are built without a version segment — vendor/shopware/core/Framework/Api/Route/ApiRouteLoader.php:72
- confirmed `str_replace('_', '-'` — resource name is the entity name with hyphens — vendor/shopware/core/Framework/Api/Route/ApiRouteLoader.php:69
- confirmed `/store-api/account/logout` — Store API route path has no version — vendor/shopware/core/Checkout/Customer/SalesChannel/LogoutRoute.php:46
- confirmed `/api/_info/openapi3.json` — OpenAPI scheme route — vendor/shopware/core/Framework/Api/Controller/InfoController.php:68
- unverified `/api/v{VERSION}/product` — legacy URL shape; only the core routing directory was searched for a version placeholder
