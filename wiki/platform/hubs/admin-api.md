---
id: platform/hubs/admin-api.md
title: admin api
summary: "Navigation hub for Shopware's Admin API and Store API: concepts, auth, app/plugin use, DAL rules, and API-only features."
keywords: ["admin api", "store api", "api", "oauth 2.0", "authentication", "apps", "administration", "dal", "data abstraction layer", "b2b suite", "integrations", "api reference", "adr"]
members: ["platform/dev/6.6/concepts/api/_index.md", "platform/dev/6.6/concepts/api/admin-api.md", "platform/dev/6.6/concepts/extensions/apps-concept.md", "platform/dev/6.6/concepts/framework/architecture/administration-concept.md", "platform/dev/6.6/guides/integrations-api/_index.md", "platform/dev/6.6/guides/integrations-api/general-concepts/_index.md", "platform/dev/6.6/products/community-edition.md", "platform/dev/6.6/products/extensions/b2b-components/shopping-lists/guides/api-and-pricing.md", "platform/dev/6.6/products/extensions/b2b-suite/guides/core/store-api.md", "platform/dev/6.6/resources/references/adr/2021-05-14-when-to-use-plain-sql-or-dal.md", "platform/dev/6.6/resources/references/adr/2023-10-17-add-unique-identifiers-for-checkout-methods.md", "platform/dev/6.6/resources/references/api-reference/_index.md", "platform/dev/6.7/concepts/api/_index.md", "platform/dev/6.7/concepts/api/admin-api.md", "platform/dev/6.7/concepts/extensions/_index.md", "platform/dev/6.7/concepts/extensions/apps-concept.md", "platform/dev/6.7/concepts/framework/architecture/_index.md", "platform/dev/6.7/concepts/framework/architecture/administration-concept.md", "platform/dev/6.7/guides/development/integrations-api/_index.md", "platform/dev/6.7/guides/development/integrations-api/flows/_index.md", "platform/dev/6.7/guides/development/integrations-api/generated-reference.md", "platform/dev/6.7/products/extensions/b2b-components/shopping-lists/guides/api-and-pricing.md", "platform/dev/6.7/products/extensions/b2b-suite/guides/core/store-api.md", "platform/dev/6.7/resources/references/adr/2021-05-14-when-to-use-plain-sql-or-dal.md", "platform/func/extensions/customer-specific-pricing.md", "platform/func/shopware-services/bundles.md"]
lastBuilt: "2026-09-15"
---

This hub covers Shopware's two HTTP JSON APIs — the customer-facing Store API and the
back-end Admin API — plus the material that depends on them: app/plugin auth, the
Administration SPA's use of the Admin API, when to use the Data Abstraction Layer (DAL)
instead of the APIs, B2B Suite/B2B Components API surfaces, and API-only merchant features.
Come here instead of grepping the source tree when an agent needs to route a task ("does
this need the Admin API or the Store API", "where is auth documented", "which ADR governs
DAL vs plain SQL") to the right member article rather than reading all of them.

Developer — 6.6:
- [API](platform/dev/6.6/concepts/api/_index.md) — overview of Store API and Admin API and supported auth methods.
- [Admin API](platform/dev/6.6/concepts/api/admin-api.md) — CRUD for every entity, used to build integrations with external systems.
- [Apps](platform/dev/6.6/concepts/extensions/apps-concept.md) — decoupled extension model using a manifest, webhooks, and the Admin API.
- [Administration](platform/dev/6.6/concepts/framework/architecture/administration-concept.md) — the Vue.js SPA, its module/page/view structure, Admin API access, and ACL.
- [Integrations / API](platform/dev/6.6/guides/integrations-api/_index.md) — index introducing Store API and Admin API and shared concepts.
- [General Concepts](platform/dev/6.6/guides/integrations-api/general-concepts/_index.md) — search criteria, request headers, generated reference docs, API versioning.
- [Community Edition](platform/dev/6.6/products/community-edition.md) — where Admin/Store API, DAL, and rule builder fit among CE's Symfony-bundle components.
- [API & Pricing](platform/dev/6.6/products/extensions/b2b-components/shopping-lists/guides/api-and-pricing.md) — Store API routes for B2B shopping lists; prices calculated on load, not stored.
- [Store API](platform/dev/6.6/products/extensions/b2b-suite/guides/core/store-api.md) — B2B Suite Store API auth headers (`sw-context-token`, `sw-access-key`) and route patterns.
- [When to use plain SQL or the DAL](platform/dev/6.6/resources/references/adr/2021-05-14-when-to-use-plain-sql-or-dal.md) — ADR: use the DAL in Store API, admin API, storefront loaders and all writes.
- [Introduction of Unique Identifiers for Checkout Methods](platform/dev/6.6/resources/references/adr/2023-10-17-add-unique-identifiers-for-checkout-methods.md) — ADR: `technicalName` on `payment_method`/`shipping_method`, required in DB/API from 6.7.0.0.
- [API Reference](platform/dev/6.6/resources/references/api-reference/_index.md) — index of Store API and Admin API reference docs (endpoints, auth).

Developer — 6.7:
- [API](platform/dev/6.7/concepts/api/_index.md) — Store API (`sw-access-key`) vs Admin API (OAuth 2.0) and their shared patterns.
- [Admin API](platform/dev/6.7/concepts/api/admin-api.md) — administrative/integration HTTP surface (`/api`, `/api/_action/sync`) for imports, exports, sync.
- [Extensions](platform/dev/6.7/concepts/extensions/_index.md) — apps (external, webhooks + Admin API, cloud-compatible) vs plugins (in-process, not supported in cloud).
- [Apps](platform/dev/6.7/concepts/extensions/apps-concept.md) — manifest, webhooks, registration handshake, storefront assets, payments, app scripts.
- [Architecture](platform/dev/6.7/concepts/framework/architecture/_index.md) — Core/Storefront/Administration domains, API-first design, DAL, message queue.
- [Administration](platform/dev/6.7/concepts/framework/architecture/administration-concept.md) — Vue.js SPA talking to the Admin API; module/page/view/component structure, ACL roles.
- [APIs](platform/dev/6.7/guides/development/integrations-api/_index.md) — quick start: Admin API OAuth `client_credentials`, Store API `sw-access-key` header.
- [API Flows](platform/dev/6.7/guides/development/integrations-api/flows/_index.md) — end-to-end walkthrough creating a product via Admin API then checkout via Store API.
- [Generated Reference](platform/dev/6.7/guides/development/integrations-api/generated-reference.md) — schema endpoints `_info/openapi3.json`, `_info/open-api-schema.json`, Stoplight UI.
- [API & Pricing](platform/dev/6.7/products/extensions/b2b-components/shopping-lists/guides/api-and-pricing.md) — B2B shopping list Store API routes; same subject as the 6.6 version above, updated for 6.7.
- [Store API](platform/dev/6.7/products/extensions/b2b-suite/guides/core/store-api.md) — B2B Suite Store API endpoints, headers, and route mapping; 6.7 counterpart of the 6.6 page above.
- [When to use plain SQL or the DAL](platform/dev/6.7/resources/references/adr/2021-05-14-when-to-use-plain-sql-or-dal.md) — same ADR as the 6.6 entry, carried into 6.7 docs unchanged in substance.

Merchant/product features (API-related):
- [Customer Specific Pricing](platform/func/extensions/customer-specific-pricing.md) — API-only individual prices per customer, synced from an external system (Shopware Beyond plan).
- [Bundles](platform/func/shopware-services/bundles.md) — Product Bundles (Blueprint), manageable via Catalogues and the Admin API, with Rule Builder support.
</content>
