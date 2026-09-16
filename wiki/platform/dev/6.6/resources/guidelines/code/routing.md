---
id: platform/dev/6.6/resources/guidelines/code/routing.md
title: Routing
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: "https://developer.shopware.com/docs/v6.6/resources/guidelines/code/routing.html"
sourceHash: "74261a550d6c61e0c2f84e15b0dc4001a49567e1"
keywords: ["routing", "frontend prefix", "Since annotation", "core route", "api schema", "ApiDefinition Generator Schema", "storefront routes", "route naming"]
summary: "Storefront routes must be prefixed frontend, every route needs the Since annotation, and core routes need a schema under the API generator directory."
lastBuilt: "2026-09-15"
---
## What it is
Coding guideline covering naming, annotation, and schema requirements for Shopware routes.

## Key steps / config
- Storefront routes must always have the prefix `frontend` in the name.
- Every route must have the `Shopware\Core\Framework\Routing\Annotation\Since` annotation.
- Each core route must have a schema defined under `src/Core/Framework/Api/ApiDefinition/Generator/Schema`.

## Essential identifiers
- `Shopware\Core\Framework\Routing\Annotation\Since`
- `src/Core/Framework/Api/ApiDefinition/Generator/Schema`
