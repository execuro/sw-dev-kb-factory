---
id: "platform/dev/6.6/resources/references/adr/2020-12-02-removing-api-version.md"
title: "API version removal"
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: "https://developer.shopware.com/docs/v6.6/resources/references/adr/2020-12-02-removing-api-version.html"
sourceHash: "763a07a91a98bbcf567cceab17d9cb5ea33216a8"
keywords: ["API versioning", "/api/v{VERSION}/product", "/api/product", "OpenAPI scheme", "API changelog", "deprecation strategy", "route URL", "6.3.5.0", "6.4.0.0", "API version removal"]
summary: "ADR: API route URLs drop the version segment (/api/v{VERSION}/product to /api/product); both forms work from 6.3.5.0 until 6.4.0.0."
lastBuilt: "2026-09-15"
---
## What it is

This ADR removes API versioning from the URL because Shopware's new deprecation strategy, tied to a 6-8 month major release cycle, made versioned routes unnecessary and inconsistent to maintain — the API version was not being increased on minor releases anyway.

## When to use

Relevant when integrating with or documenting the Shopware Admin/Store API and deciding which route form to call, or when investigating why deprecated fields/routes surface where they do.

## Key steps / config

- All route URLs move from `/api/v{VERSION}/product` to `/api/product` (illustrated with the product route, applies generally to all routes).
- Deprecated fields and routes are documented in the OpenAPI scheme and the API changelog, and are removed with the next major version (`6.x`) rather than via a version bump.
- Starting with 6.3.5.0, both the old versioned URL form (`/api/v{VERSION}/product`) and the new unversioned form (`/api/product`) are accepted simultaneously, to give integrators time to migrate.
- This dual-acceptance window ends with the release of 6.4.0.0, after which only the unversioned route form remains supported.

## Essential identifiers

- `/api/product` (unversioned route form)
- `/api/v{VERSION}/product` (deprecated versioned route form)

## Gotchas

Integrations built against the versioned URL form must migrate to the unversioned form before 6.4.0.0 — after that release the versioned form is no longer available; deprecations are tracked via the OpenAPI scheme and API changelog rather than an incrementing API version.

## Version notes

Both URL forms work from 6.3.5.0 up to 6.4.0.0; from 6.4.0.0 onward only `/api/product`-style unversioned routes remain.
