---
id: platform/dev/6.7/resources/references/adr/2020-12-02-removing-api-version.md
title: API version removal
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2020-12-02-removing-api-version.html
sourceHash: 763a07a91a98bbcf567cceab17d9cb5ea33216a8
codeCheckedAgainst: "6.7.15.1"
keywords: ["api version", "api versioning", "/api/product", "/api/v{VERSION}/product", "admin api", "url prefix", "deprecation strategy", "openapi", "api changelog", "ApiRouteLoader", "adr"]
summary: "ADR 2020-12-02: API version segment removed from URLs; /api/v{VERSION}/product became /api/product, deprecations removed per major."
lastBuilt: 2026-10-21
---
## What it is

Architecture decision record (2020-12-02, area core) that removes the version number from Shopware API route URLs. Instead of versioned URLs, deprecated fields and routes are announced and then removed with the next major version.

## When to use

- When migrating an old integration that still calls `/api/v{VERSION}/...` URLs.
- When you need to know how API breaking changes are communicated instead of via URL versions.

## Key steps / config

Reasoning in the ADR: with the deprecation strategy and a 6–8 month major cycle, URL versioning no longer made sense. Deprecations are tagged in a minor and removed in the next major; bumping the API version in minors would have meant removing deprecations every second minor.

Decision and consequences:

1. All route URLs change from `/api/v{VERSION}/product` to `/api/product` (the same applies to every entity route).
2. From 6.3.5.0 until the release of 6.4.0.0, both forms were reachable so integrations could switch in advance.
3. Deprecated fields and routes are listed in the OpenAPI scheme and in the API changelog, and are removed with the next major version (`6.x`).

In 6.7 the generic Admin API entity routes are registered without a version segment, for example `/api/<entity-name>/{path}`, `/api/search/<entity-name>` and `/api/search-ids/<entity-name>`; the OpenAPI schema is served at `/api/_info/openapi3.json`.

## Essential identifiers

- `/api/product` (current), `/api/v{VERSION}/product` (removed)
- `/api/_info/openapi3.json` — OpenAPI schema where deprecations are visible
- `ApiRouteLoader` — builds the unversioned entity routes

## Gotchas

- The versioned URLs only worked in parallel up to 6.4.0.0; any 6.4+ install, including 6.7, accepts only the unversioned form.
- Since there is no URL version, breaking changes arrive with each major release; check the changelog and OpenAPI deprecation markers before upgrading.

## Code check (6.7.15.1)
- confirmed `ApiRouteLoader` — loader for dynamic entity routes — vendor/shopware/core/Framework/Api/Route/ApiRouteLoader.php:17
- confirmed `/api/` — entity detail routes built as `'/api/' . $resourceName . '/{path}'`, no version segment — vendor/shopware/core/Framework/Api/Route/ApiRouteLoader.php:72
- confirmed `/api/search/` — search routes unversioned — vendor/shopware/core/Framework/Api/Route/ApiRouteLoader.php:109
- confirmed `/api/_info/openapi3.json` — OpenAPI schema route — vendor/shopware/core/Framework/Api/Controller/InfoController.php:68
- unverified `/api/v{VERSION}/product` — no versioned route pattern found in core/Framework/Api routing; not searched across the full index
