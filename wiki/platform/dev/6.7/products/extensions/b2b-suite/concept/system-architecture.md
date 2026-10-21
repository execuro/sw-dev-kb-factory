---
id: platform/dev/6.7/products/extensions/b2b-suite/concept/system-architecture.md
title: System architecture
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-suite/concept/system-architecture.html
sourceHash: 4f9bd0da0622467e26553a69f7929822f5e75228
codeCheckedAgainst: "6.7.15.1"
keywords: ["b2b suite", "system architecture", "component layering", "shop-bridge", "framework layer", "StoreFrontAuthentication", "Debtor", "Contact", "ContingentGroups", "acl", "Role", "component dependencies", "user management"]
summary: "B2B Suite architecture: component layers (Shop-Bridge to plugin) and dependencies between Common, user management, ACL and contingents."
lastBuilt: 2026-10-21
---
## What it is

Describes how the B2B Suite is structured: a collection of loosely coupled, mostly uniform components, shipped with a small example plugin and a common library. It covers the layers inside a component and the dependencies between components.

## When to use

Read it before adding or extending a B2B Suite component, to know which layer a piece of code belongs in and which components you may depend on.

## Key steps / config

Component layers, bottom to top:

| Layer | Responsibility |
|---|---|
| Shop-Bridge | Bridges Shopware interfaces to framework needs: implements framework interfaces, subscribes to Shopware events and calls framework services |
| Framework | B2B domain requirements: CRUD and assignment service logic, the component's use cases |
| REST-API | REST access to the services |
| Frontend | Controller as a service for frontend access |
| B2B plugin | Storefront access to the services |

Only the framework layer is mandatory; all other layers and dependencies are optional.

Component complexes (39 components at the time the docs were written):

- **Common** — the one exception: a small shared library (exception classes, repository helpers, a dependency manager, a REST-API router).
- **User management** — built on the `StoreFrontAuthentication` component, which provides `Contact` and `Debtor` entities with `Address`es and `Role`s. These are mostly informational, CRUD-based. Other parts of the system depend only on `StoreFrontAuthentication`, not on `Debtor`/`Contact` directly.
- **ACL** — the `acl` implementation connects to most other B2B entities.
- **Order and contingent management** — `ContingentGroups` are connected to `Debtor`s and can carry `acl` settings based on `Role`s or `Contact`s; `Order`s are personalised through `StoreFrontAuthentication`.

## Essential identifiers

- Layers: Shop-Bridge, Framework, REST-API, Frontend, B2B plugin
- Components/entities: `StoreFrontAuthentication`, `Contact`, `Debtor`, `Address`, `Role`, `acl`, `ContingentGroups`, `Order`

## Gotchas

- Depend on `StoreFrontAuthentication`, not on `Debtor` or `Contact`, when you only need the authenticated identity.
- Dependencies propagate left to right in the overall component graph: components on the left work without those on the right. The M:N assignment components are the exception — each turns a complex feature into a context object for another use case (a Debtor is an *entity* when created via its service, but only *context* when referenced by id in other workflows).

## Code check (6.7.15.1)
- unverified `StoreFrontAuthentication` — B2B Suite component, no occurrence in vendor/shopware/{core,storefront,administration}
- unverified `ContingentGroups` — B2B Suite entity, not part of the installed Shopware packages
- unverified `Debtor` — B2B Suite entity name; the B2B Suite extension is out of scope of this code index
