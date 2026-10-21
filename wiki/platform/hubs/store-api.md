---
id: platform/hubs/store-api.md
title: Store API
summary: Store API concepts, custom and decorated routes, coding rules, ADRs, app and B2B usage across dev 6.6 and 6.7.
keywords: ["store api", "store-api", "storeapiresponse", "_routescope", "sw-access-key", "sw-context-token", "route decoration", "headless", "composable frontends", "admin api", "page loader", "adr"]
members: ["platform/dev/6.6/concepts/api/_index.md", "platform/dev/6.6/concepts/api/store-api.md", "platform/dev/6.6/concepts/framework/http_cache.md", "platform/dev/6.6/guides/integrations-api/_index.md", "platform/dev/6.6/guides/integrations-api/general-concepts/_index.md", "platform/dev/6.6/guides/plugins/apps/clientside-to-app-backend.md", "platform/dev/6.6/guides/plugins/plugins/framework/store-api/_index.md", "platform/dev/6.6/guides/plugins/plugins/framework/store-api/add-store-api-route.md", "platform/dev/6.6/products/community-edition.md", "platform/dev/6.6/products/extensions/b2b-components/employee-management/guides/b2b-employee-invitation.md", "platform/dev/6.6/products/extensions/b2b-components/employee-management/guides/creating-own-permissions-via-app.md", "platform/dev/6.6/products/extensions/b2b-components/organization-unit/guides/store-api.md", "platform/dev/6.6/products/extensions/b2b-components/shopping-lists/guides/api-and-pricing.md", "platform/dev/6.6/products/extensions/b2b-suite/guides/core/store-api.md", "platform/dev/6.6/products/pwa.md", "platform/dev/6.6/resources/guidelines/code/pageloader.md", "platform/dev/6.6/resources/guidelines/code/store-api.md", "platform/dev/6.6/resources/references/adr/2020-07-02-implement-sales-channel-context-token-requirement.md", "platform/dev/6.6/resources/references/adr/2020-11-20-add-login-required-annotation.md", "platform/dev/6.6/resources/references/adr/2021-05-14-when-to-use-plain-sql-or-dal.md", "platform/dev/6.6/resources/references/adr/2023-06-27-store-api-to-app-server.md", "platform/dev/6.6/resources/references/api-reference/_index.md", "platform/dev/6.6/resources/references/app-reference/script-reference/data-loading-script-services-reference.md", "platform/dev/6.7/concepts/api/_index.md", "platform/dev/6.7/concepts/api/store-api.md", "platform/dev/6.7/concepts/framework/architecture/_index.md", "platform/dev/6.7/guides/development/integrations-api/_index.md", "platform/dev/6.7/guides/development/integrations-api/flows/_index.md", "platform/dev/6.7/guides/development/integrations-api/flows/create-product.md", "platform/dev/6.7/guides/development/integrations-api/generated-reference.md", "platform/dev/6.7/guides/plugins/plugins/architecture/dependency-injection-dependency-handling.md", "platform/dev/6.7/guides/plugins/plugins/framework/store-api/_index.md", "platform/dev/6.7/guides/plugins/plugins/framework/store-api/override-existing-route.md", "platform/dev/6.7/guides/plugins/plugins/storefront/javascript/_index.md", "platform/dev/6.7/products/extensions/b2b-components/organization-unit/guides/store-api.md", "platform/dev/6.7/products/extensions/b2b-components/shopping-lists/guides/api-and-pricing.md", "platform/dev/6.7/products/extensions/b2b-suite/guides/core/store-api.md", "platform/dev/6.7/products/paas/shopware-paas/composable-frontends/performance.md", "platform/dev/6.7/resources/guidelines/code/session-and-state.md", "platform/dev/6.7/resources/guidelines/code/store-api.md", "platform/dev/6.7/resources/references/adr/2020-07-02-implement-sales-channel-context-token-requirement.md", "platform/dev/6.7/resources/references/adr/2021-05-14-when-to-use-plain-sql-or-dal.md", "platform/dev/6.7/resources/references/adr/2026-03-13-store-api-order-based-effective-context.md", "platform/dev/6.7/resources/references/app-reference/script-reference/data-loading-script-services-reference.md"]
lastBuilt: 2026-10-21
---

# Store API

The Store API is Shopware's customer-facing JSON/HTTP API for headless frontends, apps and the Storefront's own page loaders. Come here to find the concept pages, the rules for writing or decorating Store API routes, the related ADRs, and the places where apps, scripts and B2B extensions use it. Most topics exist in both `dev/6.6` and `dev/6.7`; the pairs are near-duplicates with version-specific details (for example 6.7 spells routes with `StoreApiRouteScope::ID`), so read the page for the version you target.

## Dev 6.7

Concepts and API guides
- [API](platform/dev/6.7/concepts/api/_index.md) — Store API (sw-access-key) and Admin API (OAuth 2.0) overview, shared Criteria search.
- [Store API](platform/dev/6.7/concepts/api/store-api.md) — customer-facing API for headless frontends: browsing, cart, checkout, accounts.
- [Architecture](platform/dev/6.7/concepts/framework/architecture/_index.md) — Core, Storefront and Administration domains on an API-first Symfony base.
- [APIs](platform/dev/6.7/guides/development/integrations-api/_index.md) — quick start for Admin API tokens and Store API access.
- [API Flows](platform/dev/6.7/guides/development/integrations-api/flows/_index.md) — index of end-to-end API walkthroughs.
- [Create a Product and Complete Checkout](platform/dev/6.7/guides/development/integrations-api/flows/create-product.md) — Admin API product creation, then Store API context, cart, order and payment.
- [Generated Reference](platform/dev/6.7/guides/development/integrations-api/generated-reference.md) — OpenAPI schemas, Stoplight UI and the auth_required switch.

Plugin development and guidelines
- [Store API](platform/dev/6.7/guides/plugins/plugins/framework/store-api/_index.md) — conventions for plugin Store API routes and StoreApiResponse.
- [Override Existing Route](platform/dev/6.7/guides/plugins/plugins/framework/store-api/override-existing-route.md) — decorate an Abstract route and use getDecorated().
- [Dependency Injection & Dependency Handling](platform/dev/6.7/guides/plugins/plugins/architecture/dependency-injection-dependency-handling.md) — Core vs Storefront boundaries, no session access in Core services.
- [JavaScript](platform/dev/6.7/guides/plugins/plugins/storefront/javascript/_index.md) — Storefront JS guides including fetching data.
- [Store API](platform/dev/6.7/resources/guidelines/code/store-api.md) — coding rules: routes as services, page loaders only call routes.
- [Session and State](platform/dev/6.7/resources/guidelines/code/session-and-state.md) — Core must not access the PHP session.

ADRs and references
- [Implement sales channel context token requirement](platform/dev/6.7/resources/references/adr/2020-07-02-implement-sales-channel-context-token-requirement.md) — routes needing a context token reject calls without one.
- [When to use plain SQL or the DAL](platform/dev/6.7/resources/references/adr/2021-05-14-when-to-use-plain-sql-or-dal.md) — DAL in Store API and loaders, plain SQL in indexers.
- [Order-based effective Store API context](platform/dev/6.7/resources/references/adr/2026-03-13-store-api-order-based-effective-context.md) — opted-in read-only routes evaluate availability against an existing order.
- [Data Loading script services reference](platform/dev/6.7/resources/references/app-reference/script-reference/data-loading-script-services-reference.md) — services.repository and services.store.

Extensions and hosting
- [Store API](platform/dev/6.7/products/extensions/b2b-components/organization-unit/guides/store-api.md) — B2B organization unit routes.
- [API & Pricing](platform/dev/6.7/products/extensions/b2b-components/shopping-lists/guides/api-and-pricing.md) — B2B shopping list routes and price calculation.
- [Store API](platform/dev/6.7/products/extensions/b2b-suite/guides/core/store-api.md) — B2B Suite headers and route mapping.
- [Composable-Frontends Performance](platform/dev/6.7/products/paas/shopware-paas/composable-frontends/performance.md) — caching store-api POST requests behind Fastly.

## Dev 6.6

Concepts and API guides
- [API](platform/dev/6.6/concepts/api/_index.md) — Store API and Admin API overview, auth methods.
- [Store API](platform/dev/6.6/concepts/api/store-api.md) — Store API for SPAs and native apps.
- [HTTP Cache](platform/dev/6.6/concepts/framework/http_cache.md) — reverse-proxy cache, cache cookies, invalidation.
- [Integrations / API](platform/dev/6.6/guides/integrations-api/_index.md) — index for Store and Admin API.
- [General Concepts](platform/dev/6.6/guides/integrations-api/general-concepts/_index.md) — search criteria, headers, versioning.
- [API Reference](platform/dev/6.6/resources/references/api-reference/_index.md) — endpoint reference index.
- [Community Edition](platform/dev/6.6/products/community-edition.md) — components and features including the APIs.
- [PWA](platform/dev/6.6/products/pwa.md) — Vue.js storefront on the Store API, in maintenance mode in favor of Composable Frontends.

Plugin, app and guidelines
- [Store API](platform/dev/6.6/guides/plugins/plugins/framework/store-api/_index.md) — landing page for extending the Store API.
- [Add store API route](platform/dev/6.6/guides/plugins/plugins/framework/store-api/add-store-api-route.md) — abstract route, response class, routes.xml.
- [Client-side communication to the app backend](platform/dev/6.6/guides/plugins/apps/clientside-to-app-backend.md) — generate-token JWT for browser calls.
- [Store API](platform/dev/6.6/resources/guidelines/code/store-api.md) — route and response rules.
- [Page Loader](platform/dev/6.6/resources/guidelines/code/pageloader.md) — page loaders load data via the Store API.
- [Data loading services reference](platform/dev/6.6/resources/references/app-reference/script-reference/data-loading-script-services-reference.md) — script facades.

ADRs
- [Implement sales channel context token requirement](platform/dev/6.6/resources/references/adr/2020-07-02-implement-sales-channel-context-token-requirement.md) — ContextTokenRequired annotation.
- [Add the login required annotation](platform/dev/6.6/resources/references/adr/2020-11-20-add-login-required-annotation.md) — @LoginRequired guard.
- [When to use plain SQL or the DAL](platform/dev/6.6/resources/references/adr/2021-05-14-when-to-use-plain-sql-or-dal.md) — DAL versus plain SQL.
- [Client side communication to App Server](platform/dev/6.6/resources/references/adr/2023-06-27-store-api-to-app-server.md) — generate-token endpoint rationale.

B2B extensions
- [Employee Invitation](platform/dev/6.6/products/extensions/b2b-components/employee-management/guides/b2b-employee-invitation.md) — invitation flows and URL override.
- [Create permissions via App](platform/dev/6.6/products/extensions/b2b-components/employee-management/guides/creating-own-permissions-via-app.md) — `/store-api/permission` route.
- [Store API](platform/dev/6.6/products/extensions/b2b-components/organization-unit/guides/store-api.md) — organization unit routes.
- [API & Pricing](platform/dev/6.6/products/extensions/b2b-components/shopping-lists/guides/api-and-pricing.md) — shopping list routes.
- [Store API](platform/dev/6.6/products/extensions/b2b-suite/guides/core/store-api.md) — B2B Suite auth headers and routes.
