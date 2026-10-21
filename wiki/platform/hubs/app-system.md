---
id: platform/hubs/app-system.md
title: "app system"
summary: "Navigation hub for the Shopware app system: concepts, guides, ADRs and reference for manifest-based apps on 6.6 and 6.7."
keywords: ["app system", "apps", "manifest.xml", "webhooks", "app scripts", "app server", "gateways", "flow builder", "rule builder", "custom entities", "saas", "adr"]
members: ["platform/dev/6.6/concepts/extensions/_index.md", "platform/dev/6.6/concepts/extensions/apps-concept.md", "platform/dev/6.6/products/saas.md", "platform/dev/6.6/resources/guidelines/testing/store/quality-guidelines-apps/_index.md", "platform/dev/6.6/resources/references/adr/2020-08-12-implement-app-system-inside-platform.md", "platform/dev/6.6/resources/references/adr/2021-10-21-app-scripting.md", "platform/dev/6.6/resources/references/adr/2021-11-23-add-possibility-for-plugin-to-add-a-html-file.md", "platform/dev/6.6/resources/references/adr/2022-06-17-integrate-app-into-flow-event.md", "platform/dev/6.6/resources/references/adr/2023-06-27-store-api-to-app-server.md", "platform/dev/6.7/concepts/extensions/_index.md", "platform/dev/6.7/concepts/extensions/apps-concept.md", "platform/dev/6.7/guides/plugins/apps/_index.md", "platform/dev/6.7/guides/plugins/apps/flow-builder/add-custom-flow-actions-from-app-system.md", "platform/dev/6.7/guides/plugins/apps/flow-builder/add-custom-flow-triggers-from-app-system.md", "platform/dev/6.7/guides/plugins/apps/gateways/_index.md", "platform/dev/6.7/guides/plugins/apps/rule-builder/_index.md", "platform/dev/6.7/products/saas.md", "platform/dev/6.7/resources/references/adr/2020-08-12-implement-app-system-inside-platform.md", "platform/dev/6.7/resources/references/adr/2021-09-14-technical-concept-custom-entities.md", "platform/dev/6.7/resources/references/adr/2022-01-06-custom-app-api-endpoints.md", "platform/dev/6.7/resources/references/adr/2023-06-27-store-api-to-app-server.md", "platform/dev/6.7/resources/references/adr/2026-03-18-app-url-verify-utils.md", "platform/dev/6.7/resources/references/app-reference/_index.md"]
lastBuilt: 2026-10-21
---

# App system

The app system is Shopware's decoupled extension model: an app is described by a `manifest.xml`, talks to Shopware through webhooks and the Admin API, and can run on self-hosted and Cloud/SaaS shops. Come here when a question is about apps as opposed to plugins (apps vs plugins, manifest, registration handshake, app scripts, gateways, flow and rule builder extensions, app server communication) and you need to pick the right member page before reading. All members are developer documentation. Pages that exist for both 6.6 and 6.7 cover the same topic and are near-duplicates across versions; prefer the 6.7 copy unless the task targets 6.6.

## Shopware 6.7

Concepts and guides:

- [Extensions](platform/dev/6.7/concepts/extensions/_index.md) — apps (external, webhooks plus Admin API, cloud-compatible) compared with plugins (in-process, not supported in cloud).
- [Apps](platform/dev/6.7/concepts/extensions/apps-concept.md) — app system concept: manifest-defined extensions, HTTP and webhooks, registration handshake.
- [Apps](platform/dev/6.7/guides/plugins/apps/_index.md) — guide overview and which guide to follow per use case.
- [Add Custom Flow Action from App System](platform/dev/6.7/guides/plugins/apps/flow-builder/add-custom-flow-actions-from-app-system.md) — `flow.xml` `<flow-action>` definitions for webhook-based custom actions.
- [Add custom flow trigger from app system](platform/dev/6.7/guides/plugins/apps/flow-builder/add-custom-flow-triggers-from-app-system.md) — `<flow-event>` triggers dispatched via `/api/_action/trigger-event/{eventName}`.
- [Gateways](platform/dev/6.7/guides/plugins/apps/gateways/_index.md) — checkout, context and in-app purchase gateways delegating decisions to an app server.
- [Rule Builder](platform/dev/6.7/guides/plugins/apps/rule-builder/_index.md) — custom rule conditions via `rule-conditions` in `manifest.xml`, evaluated by `ScriptRule`.
- [SaaS](platform/dev/6.7/products/saas.md) — on Shopware SaaS, stores are extended through the app system.

Reference and ADRs:

- [App Reference](platform/dev/6.7/resources/references/app-reference/_index.md) — entry to app structure, events, variables, responses and examples.
- [Implement app system inside platform](platform/dev/6.7/resources/references/adr/2020-08-12-implement-app-system-inside-platform.md) — ADR moving the app system into `Shopware\Core\Framework\App`.
- [Technical concept custom entities](platform/dev/6.7/resources/references/adr/2021-09-14-technical-concept-custom-entities.md) — apps define custom entities in XML; `/api/custom-entity-*` routes.
- [Allow apps to define custom api endpoints](platform/dev/6.7/resources/references/adr/2022-01-06-custom-app-api-endpoints.md) — script hooks under `/…/script/{hook}`.
- [Client side communication to App Server](platform/dev/6.7/resources/references/adr/2023-06-27-store-api-to-app-server.md) — `generate-token` endpoint issuing an app-secret-signed JWT.
- [Improved APP URL verification utils](platform/dev/6.7/resources/references/adr/2026-03-18-app-url-verify-utils.md) — `APP_URL` verification, `app:url:verify` and `app:url:status`.

## Shopware 6.6

- [Extensions](platform/dev/6.6/concepts/extensions/_index.md) — apps vs plugins overview (6.6 counterpart of the 6.7 page).
- [Apps](platform/dev/6.6/concepts/extensions/apps-concept.md) — app system concept: manifest, webhooks, Admin API (6.6 counterpart).
- [SaaS](platform/dev/6.6/products/saas.md) — SaaS platform and app system extension (6.6 counterpart).
- [Quality guidelines for apps and themes in the app system](platform/dev/6.6/resources/guidelines/testing/store/quality-guidelines-apps/_index.md) — Store review checklist for apps and themes.
- [Implement app system inside platform](platform/dev/6.6/resources/references/adr/2020-08-12-implement-app-system-inside-platform.md) — ADR (6.6 counterpart).
- [App scripts](platform/dev/6.6/resources/references/adr/2021-10-21-app-scripting.md) — ADR for Twig-based sandboxed app scripting hooks and facades.
- [Add possibility for plugins to add a HTML file](platform/dev/6.6/resources/references/adr/2021-11-23-add-possibility-for-plugin-to-add-a-html-file.md) — ADR for iFrame-based admin views ahead of the ExtensionAPI.
- [Integrate an app into the flow event](platform/dev/6.6/resources/references/adr/2022-06-17-integrate-app-into-flow-event.md) — ADR for `CustomAppEvent` and the trigger API.
- [Client side communication to App Server](platform/dev/6.6/resources/references/adr/2023-06-27-store-api-to-app-server.md) — ADR (6.6 counterpart).
