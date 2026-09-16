---
id: platform/dev/6.7/products/extensions/b2b-suite/concept/system-architecture.md
title: System architecture
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-suite/concept/system-architecture.html
sourceHash: 4f9bd0da0622467e26553a69f7929822f5e75228
codeCheckedAgainst: "6.7.13.0"
keywords: ["b2b suite", "system architecture", "component layering", "Shop-Bridge", "Framework", "REST-API", "StoreFrontAuthentication", "Contact", "Debtor", "Role", "acl", "ContingentGroups", "component dependencies", "common library", "m:n assignment"]
summary: B2B Suite architecture - component layers (Shop-Bridge, Framework, REST-API, Frontend, plugin) and dependency complexes (users, ACL, orders)
lastBuilt: 2026-09-15
---
## What it is

A concept page describing how the B2B Suite is structured: a collection of loosely coupled, mostly uniform components, shipped with a small example plugin and a common library. It covers the layers inside a component and how the components depend on each other.

## When to use

Read this before extending or navigating B2B Suite code, to know which layer a class belongs to and which components a feature may depend on.

## Key steps / config

### Component layering (bottom to top)

| Layer | Responsibility |
|---|---|
| Shop-Bridge | Bridges Shopware interfaces to the framework: implements interfaces provided by the framework, subscribes to Shopware events and calls framework services |
| Framework | B2B-specific domain requirements: CRUD and assignment service logic, the component's use cases |
| REST-API | REST access to the services |
| Frontend | Controller as a service for frontend access |
| B2B plugin | Storefront access to the services |

Only the Framework layer is mandatory; all other layers and their dependencies are optional.

### Component dependency complexes

At the time the source was written there were 39 components, all with the same structure, grouped into four complexes:

- **Common** (the one exception): a small shared library with technical implementations used by most components - exception classes, repository helpers, a dependency manager, a REST-API router.
- **User management**: built on the `StoreFrontAuthentication` component, which provides `Contact` and `Debtor` entities that have `Address`es and `Role`s. These are mostly informational/CRUD. Other parts of the system depend only on `StoreFrontAuthentication`, not on the concrete Debtor or Contact implementations.
- **ACL**: the `acl` implementation is connected to most other B2B Suite entities.
- **Order and contingent management**: `ContingentGroups` are connected to `Debtor`s and can have `acl` settings based on `Role`s or `Contact`s; `Order`s are personalized through `StoreFrontAuthentication`.

### Dependency direction

Dependencies derive from business requirements and propagate left to right: components on the left are usable without those on the right. M:N assignment components are the exceptions - each is a "reset" in complexity where a complex feature becomes a context object for another use case (a Debtor is an **entity** when created/updated through its service, but only **context** when referenced by id in other workflows).

## Essential identifiers

- `StoreFrontAuthentication` - base component for identity; the one other components depend on
- `Contact`, `Debtor`, `Address`, `Role` - user management entities
- `acl` - access control component
- `ContingentGroups`, `Order` - order and contingent management

## Gotchas

- Outside user management, the suite depends on `StoreFrontAuthentication` only, never on the concrete `Debtor` or `Contact` implementations.
- The source's diagrams (layering, user management, ACL, order/contingent, whole picture) are images and are not reproduced here.

## Code check (6.7.13.0)
- unverified `StoreFrontAuthentication` — B2B Suite component; not part of vendor/shopware/{core,storefront,administration}, no match in the installed code
- unverified `Debtor` — B2B Suite entity; B2B Suite package is not installed in the checked vendor roots
- unverified `Contact` — B2B Suite entity; out of scope of the installed vendor/shopware roots
- unverified `ContingentGroups` — B2B Suite component; out of scope of the installed vendor/shopware roots
- unverified `acl` — B2B Suite ACL component; the B2B implementation is not in the installed vendor/shopware roots
