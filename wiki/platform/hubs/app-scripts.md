---
id: platform/hubs/app-scripts.md
title: app scripts
summary: Navigation hub for App Scripts, sandboxed Twig hooks, custom endpoints, rule conditions, script services and ADRs, in 6.6 and 6.7.
keywords: ["app scripts", "twig hooks", "script hooks", "custom endpoints", "api/script", "store-api/script", "storefront/script", "script services", "rule conditions", "cart manipulation", "product pricing", "app system"]
members: ["platform/dev/6.6/concepts/extensions/apps-concept.md", "platform/dev/6.6/guides/plugins/apps/_index.md", "platform/dev/6.6/guides/plugins/apps/app-scripts/_index.md", "platform/dev/6.6/guides/plugins/apps/app-scripts/custom-endpoints.md", "platform/dev/6.6/guides/plugins/apps/configuration.md", "platform/dev/6.6/guides/plugins/apps/rule-builder/add-custom-rule-conditions.md", "platform/dev/6.6/guides/plugins/apps/starter/_index.md", "platform/dev/6.6/guides/plugins/apps/starter/add-api-endpoint.md", "platform/dev/6.6/products/extensions/b2b-components/order-approval/guides/04-add-new-approval-condition.md", "platform/dev/6.6/resources/guidelines/code/core/extendability.md", "platform/dev/6.6/resources/references/adr/2021-10-21-app-scripting.md", "platform/dev/6.6/resources/references/adr/2022-01-06-custom-app-api-endpoints.md", "platform/dev/6.7/concepts/extensions/apps-concept.md", "platform/dev/6.7/guides/plugins/apps/_index.md", "platform/dev/6.7/guides/plugins/apps/app-scripts/_index.md", "platform/dev/6.7/guides/plugins/apps/app-scripts/add-api-endpoint.md", "platform/dev/6.7/guides/plugins/apps/app-scripts/cart-manipulation.md", "platform/dev/6.7/guides/plugins/apps/app-scripts/custom-endpoints.md", "platform/dev/6.7/guides/plugins/apps/app-scripts/data-loading.md", "platform/dev/6.7/resources/references/_index.md", "platform/dev/6.7/resources/references/adr/2021-10-21-app-scripting.md", "platform/dev/6.7/resources/references/adr/2022-01-06-custom-app-api-endpoints.md", "platform/dev/6.7/resources/references/adr/2022-02-21-rule-scripting-in-apps.md", "platform/dev/6.7/resources/references/adr/2023-02-01-app-script-product-pricing.md", "platform/dev/6.7/resources/references/app-reference/script-reference/_index.md", "platform/dev/6.7/resources/references/app-reference/script-reference/data-loading-script-services-reference.md", "platform/dev/6.7/resources/references/app-reference/script-reference/miscellaneous-script-services-reference.md", "platform/dev/6.7/resources/references/app-reference/script-reference/product-script-services-reference.md", "platform/dev/6.7/resources/references/app-reference/script-reference/script-hooks-reference.md"]
lastBuilt: 2026-10-21
---

# App scripts

App Scripts are sandboxed Twig files shipped with an app (under `Resources/scripts`) that run on named script hooks inside Shopware's execution stack. They get hook data and a set of services (`services.repository`, `services.cart`, `services.response` and others), and can also expose custom endpoints under `/api/script`, `/store-api/script` and `/storefront/script`. Come here when you need to know what a script can hook into, which services it can call, or how scripts relate to the wider app system. The 6.6 docs cover the basics and endpoints. The 6.7 docs add cart manipulation, data loading and a full script reference.

## Dev 6.6

- [Apps](platform/dev/6.6/concepts/extensions/apps-concept.md) — app system concept: manifest, webhooks, Admin API.
- [Apps](platform/dev/6.6/guides/plugins/apps/_index.md) — overview of app extension routes (App SDK, plugin system, App scripts).
- [App Scripts](platform/dev/6.6/guides/plugins/apps/app-scripts/_index.md) — running Twig files on registered hooks, with hook data and services.
- [Custom endpoints](platform/dev/6.6/guides/plugins/apps/app-scripts/custom-endpoints.md) — api/store-api/storefront scoped endpoints, response headers, cache invalidation.
- [Configuration](platform/dev/6.6/guides/plugins/apps/configuration.md) — config.xml and system-config values, readable from app scripts.
- [Add custom rule conditions](platform/dev/6.6/guides/plugins/apps/rule-builder/add-custom-rule-conditions.md) — rule conditions in manifest.xml with Twig logic scripts and `compare()`.
- [App Starter Guides](platform/dev/6.6/guides/plugins/apps/starter/_index.md) — index of starter guides for endpoints and data exchange.
- [Starter Guide - Add an API endpoint](platform/dev/6.6/guides/plugins/apps/starter/add-api-endpoint.md) — Store API endpoint tutorial aggregating order data.
- [How to add a new approval condition](platform/dev/6.6/products/extensions/b2b-components/order-approval/guides/04-add-new-approval-condition.md) — B2B order-approval condition via plugin Rule class or app rule-conditions manifest and script.
- [Extendability](platform/dev/6.6/resources/guidelines/code/core/extendability.md) — extendability patterns; app scripts are one of the mechanisms.
- [App scripts](platform/dev/6.6/resources/references/adr/2021-10-21-app-scripting.md) — ADR introducing Twig-based App Scripting.
- [Allow apps to define custom api endpoints](platform/dev/6.6/resources/references/adr/2022-01-06-custom-app-api-endpoints.md) — ADR for the script endpoint routes.

## Dev 6.7

Concepts and guides:

- [Apps](platform/dev/6.7/concepts/extensions/apps-concept.md) — 6.7 app system concept (updated counterpart of the 6.6 page).
- [Apps](platform/dev/6.7/guides/plugins/apps/_index.md) — overview of apps and which guide fits which use case.
- [App Scripts](platform/dev/6.7/guides/plugins/apps/app-scripts/_index.md) — script hooks, includes, interface hooks, services, debugging.
- [Add an API endpoint](platform/dev/6.7/guides/plugins/apps/app-scripts/add-api-endpoint.md) — `store-api-swag-topseller` tutorial, deployed with shopware-cli.
- [Cart Manipulation](platform/dev/6.7/guides/plugins/apps/app-scripts/cart-manipulation.md) — line items, discounts, price definitions on the cart hook.
- [Custom Endpoints](platform/dev/6.7/guides/plugins/apps/app-scripts/custom-endpoints.md) — folder naming, responses, caching, invalidation.
- [Data Loading](platform/dev/6.7/guides/plugins/apps/app-scripts/data-loading.md) — loading extra Storefront data via repository/store services.

References and ADRs:

- [References](platform/dev/6.7/resources/references/_index.md) — reference section overview, including app scripts and ADRs.
- [Script Reference](platform/dev/6.7/resources/references/app-reference/script-reference/_index.md) — entry page for script services.
- [Script hooks reference](platform/dev/6.7/resources/references/app-reference/script-reference/script-hooks-reference.md) — all hook names with classes, data and services.
- [Data Loading script services reference](platform/dev/6.7/resources/references/app-reference/script-reference/data-loading-script-services-reference.md) — `services.repository` and `services.store`.
- [Miscellaneous script services reference](platform/dev/6.7/resources/references/app-reference/script-reference/miscellaneous-script-services-reference.md) — `services.request`, `services.acl`, `services.config`, ArrayFacade.
- [Product script services reference](platform/dev/6.7/resources/references/app-reference/script-reference/product-script-services-reference.md) — price facades for product pricing.
- [App scripts](platform/dev/6.7/resources/references/adr/2021-10-21-app-scripting.md) — ADR of the scripting model; near-duplicate of the 6.6 ADR.
- [Allow apps to define custom api endpoints](platform/dev/6.7/resources/references/adr/2022-01-06-custom-app-api-endpoints.md) — ADR for script endpoints; near-duplicate of the 6.6 ADR.
- [Rule Scripting in apps](platform/dev/6.7/resources/references/adr/2022-02-21-rule-scripting-in-apps.md) — ADR for rule conditions stored in `app_script_condition`, evaluated by `ScriptRule`.
- [App script product pricing](platform/dev/6.7/resources/references/adr/2023-02-01-app-script-product-pricing.md) — ADR for the product-pricing hook and price facades.
