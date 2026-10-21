---
id: platform/hubs/admin-api.md
title: "Admin API"
summary: "Admin API hub: concepts, OAuth access, API flows, generated reference, related ADRs and plan-gated API features for 6.6 and 6.7."
keywords: ["admin api", "store api", "oauth 2.0", "/api/oauth/token", "crud", "sync api", "integration", "generated reference", "api flows", "api version", "webhooks", "http client"]
members: ["platform/dev/6.6/concepts/api/_index.md", "platform/dev/6.6/concepts/api/admin-api.md", "platform/dev/6.6/concepts/extensions/apps-concept.md", "platform/dev/6.6/concepts/framework/architecture/administration-concept.md", "platform/dev/6.6/guides/integrations-api/_index.md", "platform/dev/6.6/guides/integrations-api/general-concepts/_index.md", "platform/dev/6.6/products/community-edition.md", "platform/dev/6.6/products/extensions/b2b-components/shopping-lists/guides/api-and-pricing.md", "platform/dev/6.6/products/extensions/b2b-suite/guides/core/store-api.md", "platform/dev/6.6/resources/references/adr/2021-05-14-when-to-use-plain-sql-or-dal.md", "platform/dev/6.6/resources/references/adr/2023-10-17-add-unique-identifiers-for-checkout-methods.md", "platform/dev/6.6/resources/references/api-reference/_index.md", "platform/dev/6.7/concepts/api/_index.md", "platform/dev/6.7/concepts/api/admin-api.md", "platform/dev/6.7/concepts/extensions/_index.md", "platform/dev/6.7/concepts/extensions/apps-concept.md", "platform/dev/6.7/concepts/framework/architecture/administration-concept.md", "platform/dev/6.7/guides/development/integrations-api/_index.md", "platform/dev/6.7/guides/development/integrations-api/flows/_index.md", "platform/dev/6.7/guides/development/integrations-api/flows/create-product.md", "platform/dev/6.7/guides/development/integrations-api/generated-reference.md", "platform/dev/6.7/guides/plugins/apps/app-sdks/javascript/05-http-client.md", "platform/dev/6.7/products/extensions/b2b-components/shopping-lists/guides/api-and-pricing.md", "platform/dev/6.7/resources/references/adr/2020-12-02-removing-api-version.md", "platform/dev/6.7/resources/references/adr/2021-05-14-when-to-use-plain-sql-or-dal.md", "platform/dev/6.7/resources/references/adr/2026-09-29-authorize-webhooks-against-their-owner.md", "platform/func/extensions/customer-specific-pricing.md", "platform/func/shopware-services/bundles.md"]
lastBuilt: 2026-10-21
---

# Admin API

The Admin API is Shopware's back-end HTTP/JSON interface: CRUD for every entity, authenticated with OAuth 2.0 (`/api/oauth/token`), used by integrations, apps, ERP sync and the Administration SPA. Come here for concept, access, reference and architecture-decision questions about it; the Store API (customer-facing, `sw-access-key`) is covered where it is contrasted with the Admin API. Read the 6.7 pages first unless you target 6.6; most 6.6 and 6.7 pairs are the same topic at different versions.

## Developer 6.7

- [API](platform/dev/6.7/concepts/api/_index.md) — overview of Store API and Admin API, auth, shared Criteria-based search.
- [Admin API](platform/dev/6.7/concepts/api/admin-api.md) — CRUD, sync (`/api/_action/sync`), import/export, backend integrations.
- [APIs](platform/dev/6.7/guides/development/integrations-api/_index.md) — quick start with `client_credentials` token and `POST /api/search/product`.
- [API Flows](platform/dev/6.7/guides/development/integrations-api/flows/_index.md) — index of end-to-end API walkthroughs.
- [Create a Product and Complete Checkout](platform/dev/6.7/guides/development/integrations-api/flows/create-product.md) — Admin API creates category and product, Store API runs checkout.
- [Generated Reference](platform/dev/6.7/guides/development/integrations-api/generated-reference.md) — OpenAPI schemas, Stoplight UI, `shopware.api.api_browser.auth_required`.
- [HTTP-client](platform/dev/6.7/guides/plugins/apps/app-sdks/javascript/05-http-client.md) — JavaScript App SDK `HttpClient`, `EntityRepository`, `SyncService`, media helpers.
- [Extensions](platform/dev/6.7/concepts/extensions/_index.md) — apps (webhooks plus Admin API) versus plugins.
- [Apps](platform/dev/6.7/concepts/extensions/apps-concept.md) — app system, manifest, registration handshake, webhooks.
- [Administration](platform/dev/6.7/concepts/framework/architecture/administration-concept.md) — Vue.js SPA built on the Admin API, modules, ACL.
- [API & Pricing](platform/dev/6.7/products/extensions/b2b-components/shopping-lists/guides/api-and-pricing.md) — B2B shopping list Store API routes and on-load price calculation.

### Architecture decisions (6.7)

- [API version removal](platform/dev/6.7/resources/references/adr/2020-12-02-removing-api-version.md) — `/api/v{VERSION}/product` became `/api/product`.
- [When to use plain SQL or the DAL](platform/dev/6.7/resources/references/adr/2021-05-14-when-to-use-plain-sql-or-dal.md) — DAL in Store/Admin API and all writes; plain SQL in indexers.
- [Authorize webhooks against their owner](platform/dev/6.7/resources/references/adr/2026-09-29-authorize-webhooks-against-their-owner.md) — webhook owner authorization; 6.7.15.1 still skips ACL for app-less webhooks.

## Developer 6.6

- [API](platform/dev/6.6/concepts/api/_index.md) — 6.6 counterpart of the API overview.
- [Admin API](platform/dev/6.6/concepts/api/admin-api.md) — 6.6 counterpart of the Admin API concept.
- [Integrations / API](platform/dev/6.6/guides/integrations-api/_index.md) — Store API and Admin API index for guides.
- [General Concepts](platform/dev/6.6/guides/integrations-api/general-concepts/_index.md) — search criteria, request headers, generated reference, versioning.
- [API Reference](platform/dev/6.6/resources/references/api-reference/_index.md) — Stoplight-based endpoint reference index.
- [Apps](platform/dev/6.6/concepts/extensions/apps-concept.md) — 6.6 counterpart of the app system concept.
- [Administration](platform/dev/6.6/concepts/framework/architecture/administration-concept.md) — 6.6 counterpart of the Administration concept.
- [Community Edition](platform/dev/6.6/products/community-edition.md) — components of the open-source edition, including Admin/Store/Sync API.
- [API & Pricing](platform/dev/6.6/products/extensions/b2b-components/shopping-lists/guides/api-and-pricing.md) — 6.6 near-duplicate of the 6.7 shopping list page.
- [Store API](platform/dev/6.6/products/extensions/b2b-suite/guides/core/store-api.md) — B2B Suite routes, `sw-context-token`/`sw-access-key` headers, swagger.
- [When to use plain SQL or the DAL](platform/dev/6.6/resources/references/adr/2021-05-14-when-to-use-plain-sql-or-dal.md) — 6.6 copy of the same ADR.
- [Introduction of Unique Identifiers for Checkout Methods](platform/dev/6.6/resources/references/adr/2023-10-17-add-unique-identifiers-for-checkout-methods.md) — `technicalName` on `payment_method`/`shipping_method`, required in DB/API from 6.7.0.0.

## Merchant and plan-gated features

- [Customer Specific Pricing](platform/func/extensions/customer-specific-pricing.md) — API-only per-customer prices synced from an ERP; Shopware Beyond plan.
- [Bundles](platform/func/shopware-services/bundles.md) — product bundles in the Commercial extension (Evolve/Beyond, 6.7.9.0+), including API notes.
