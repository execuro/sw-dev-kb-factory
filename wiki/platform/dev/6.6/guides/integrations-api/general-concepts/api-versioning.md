---
id: platform/dev/6.6/guides/integrations-api/general-concepts/api-versioning.md
title: API Versioning
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/integrations-api/general-concepts/api-versioning.html
sourceHash: e74fab6d6545539c815929caff76c35fb416c746
keywords: ["api versioning", "sw-expect-packages", "deprecated annotation", "swagger deprecation", "route versioning", "api_info version", "417 expectation failed", "swagger.html"]
summary: "Shopware removed API version numbers from routes in 6.4.0.0; deprecations now follow patch/minor releases instead."
lastBuilt: 2026-09-15
---

## What it is

Explains Shopware's API versioning strategy change starting with Shopware 6.4.0.0: the
version was removed from route paths, and deprecations are handled differently than
before.

## When to use

When building an integration that needs to understand route stability, deprecation
timing, or the `sw-expect-packages` request header.

## Key steps / config

- Prior to 6.4.0.0, routes carried the version, e.g. `/api/v3/example-route`.
- Starting with 6.4.0.0 (versioning change effective from 6.3.5.0), routes drop the
  version: old `/api/v3/example-route` becomes new `/api/example-route`. The versioned
  route form keeps working through Shopware 6.3.*, then is removed with the next major
  version.
- Deprecations are added in patch/minor releases but only removed in a major release —
  this always applied to the Core and now also applies to the API. Deprecated
  routes/fields appear in the Swagger docs; look for the `@deprecated` annotation on
  routes or the `Deprecated` flag on entity fields.
- `sw-expect-packages` request header expresses server-side expectations, e.g.:
  ```text
  GET /api/test
  sw-expect-packages: shopware/core:~6.4
  ```
  Multiple conditions can be combined, e.g. `shopware/core:~6.4,swag/paypal:*`. If
  conditions are not met, the backend responds with `417 Expectation Failed`.
- Get the current API version: `GET /api/_info/version` (since Shopware 6.3.5.0);
  previously `GET /api/v2/_info/config`.
- Open Swagger UI at `/api/_info/swagger.html`.

## Essential identifiers

- `sw-expect-packages`, `@deprecated`, `Deprecated` flag
- `GET /api/_info/version`, `GET /api/v2/_info/config`, `/api/_info/swagger.html`
- `417 Expectation Failed`

## Gotchas

- The version-in-route strategy still broke applications on minor releases in the old
  model; the new strategy only introduces breaks on major releases.

## Version notes

- API version removed from routes starting with Shopware 6.4.0.0 (behavior in effect from
  6.3.5.0); the old versioned routes were removed with the next major version after 6.3.*.
