---
id: platform/dev/6.6/guides/integrations-api/general-concepts/generated-reference.md
title: Generated Reference
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/integrations-api/general-concepts/generated-reference.html
sourceHash: b823adee696dfbcfe657181eed7456a0eadf1983
keywords: ["Swagger UI", "Stoplight", "OpenAPI schema", "entity schema", "APP_ENV", "swagger-php", "swagger.html", "stoplightio.html", "openapi3.json", "open-api-schema.json", "API documentation", "generated schema"]
summary: Explains how Shopware generates and exposes OpenAPI schemas for the Admin and Store API via Swagger UI, Stoplight, and raw JSON endpoints.
lastBuilt: "2026-09-15"
---
## What it is

This page documents how Shopware generates machine-readable schemas for both HTTP APIs (Admin API and Store API), and the different ways to browse or fetch those schemas. The schemas are generated from PHP annotations using the swagger-php library, and are interpretable by API client libraries and documentation tools such as Swagger.io.

## When to use

Use this page when you need to browse the generated API documentation interactively, fetch the raw OpenAPI schema, or generate documentation for your own custom endpoints using the same annotation approach.

## Key steps / config

Access requires the `APP_ENV` environment variable to be set to `dev`, due to security restrictions.

Swagger UI is available at (relative to the API base path):

```text
/(api|store-api)/_info/swagger.html
```

Stoplight — the recommended alternative, since Swagger UI is deprecated and can freeze the browser when loading all schemas — is available at:

```text
/(api|store-api)/_info/stoplightio.html
```

A list of all generic entity endpoints (product, category, etc.) for the Admin API is available at `api/_info/stoplightio.html?type=jsonapi#/`, or via the top navigation bar in Stoplight.

To fetch the raw OpenAPI schema definition instead of a UI:

```text
/(api|store-api)/_info/openapi3.json
```

To fetch schema definitions of all available entities instead of an endpoint reference:

```text
/(api|store-api)/_info/open-api-schema.json
```

In each path, `api` refers to the Admin API and `store-api` to the Store API — choose the appropriate segment.

## Essential identifiers

- `APP_ENV=dev` — required to access the schema endpoints
- `/(api|store-api)/_info/swagger.html`
- `/(api|store-api)/_info/stoplightio.html`
- `/(api|store-api)/_info/openapi3.json`
- `/(api|store-api)/_info/open-api-schema.json`
- swagger-php (annotation library used to generate the schemas)

## Gotchas

Swagger UI is deprecated and can freeze the browser when it tries to load all schemas at once; the documentation recommends using Stoplight instead. Also, the schema endpoints only work when `APP_ENV` is set to `dev`.
