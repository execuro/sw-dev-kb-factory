---
id: platform/dev/6.6/products/extensions/b2b-suite/concept/system-architecture.md
title: System architecture
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: "https://developer.shopware.com/docs/v6.6/products/extensions/b2b-suite/concept/system-architecture.html"
sourceHash: "f8a78140ac26fd21c310476b2402e0453dbde12f"
keywords: ["b2b suite", "system architecture", "component layering", "shop-bridge", "framework layer", "rest-api", "frontend layer", "b2b plugin", "StoreFrontAuthentication", "ContingentGroups", "acl", "component dependencies"]
summary: "Layered architecture of the B2B Suite: Shop-Bridge, Framework, REST-API, Frontend, and B2B plugin layers, and component dependency groups."
lastBuilt: "2026-09-15"
---
## What it is

Describes the B2B Suite's overall architecture: a collection of loosely coupled, mostly uniform components, packaged with a small example plugin and a common library, and how components group into dependency complexes.

## Key steps / config

Component layering, from bottom to top:

- Shop-Bridge: bridges broad Shopware interfaces to specific framework requirements; implements interfaces provided by the framework and subscribes to Shopware events, calling framework services.
- Framework: contains the B2B-specific domain requirements (CRUD and assignment service logic, the component's specific use cases).
- REST-API: REST access to the services.
- Frontend: controller as a service for frontend access.
- B2B plugin: storefront access to the services.

Apart from the framework layer, all other layers and dependencies are optional.

At the time of writing there were 39 components, sorted into four complexes:

- Common — a small shared library (exception classes, repository helpers, a dependency manager, a REST-API router).
- User management — based on `StoreFrontAuthentication`, providing `Contact` and `Debtor` entities with `Address`es and `Role`s; other parts depend only on `StoreFrontAuthentication`, not the specific `Debtor`/`Contact` implementations.
- ACL — the `acl` implementation connects to most other B2B Suite entities.
- Order and contingent management — `ContingentGroups` connect to `Debtor`s and can have `acl` settings based on `Role`s or `Contact`s; `Order`s are personalized through `StoreFrontAuthentication`.

## Essential identifiers

- `StoreFrontAuthentication`
- `Contact`, `Debtor`
- `acl`
- `ContingentGroups`

## Gotchas

A `Debtor` can be created/updated through a service (acting as an entity), but may also be referenced by id across many workflows (acting purely as context) — the M:N assignment components represent this reset in complexity into a context object.
