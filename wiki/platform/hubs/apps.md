---
id: platform/hubs/apps.md
title: apps
summary: "Navigation hub for Shopware's app system: manifest, App SDK, webhooks, admin API, rule conditions, content, upgrades, SaaS and APP_URL."
keywords: ["apps", "app system", "manifest.xml", "app sdk", "webhooks", "admin api", "extensions", "plugins", "themes", "saas", "cloud", "app scripts", "rule builder", "custom data", "app-url"]
members: ["platform/dev/6.6/concepts/extensions/_index.md", "platform/dev/6.6/guides/plugins/_index.md", "platform/dev/6.6/guides/plugins/apps/_index.md", "platform/dev/6.6/guides/plugins/apps/administration/adding-snippets.md", "platform/dev/6.6/guides/plugins/apps/administration/meteor-admin-sdk.md", "platform/dev/6.6/guides/plugins/apps/content/_index.md", "platform/dev/6.6/guides/plugins/apps/custom-data/_index.md", "platform/dev/6.6/guides/plugins/overview.md", "platform/dev/6.6/resources/guidelines/code/core/extendability.md", "platform/dev/6.7/concepts/extensions/_index.md", "platform/dev/6.7/concepts/extensions/apps-concept.md", "platform/dev/6.7/guides/development/extensions/architecture/_index.md", "platform/dev/6.7/guides/development/testing/store/_index.md", "platform/dev/6.7/guides/plugins/apps/_index.md", "platform/dev/6.7/guides/plugins/apps/content/_index.md", "platform/dev/6.7/guides/plugins/apps/rule-builder/_index.md", "platform/dev/6.7/guides/upgrades-migrations/_index.md", "platform/dev/6.7/products/saas.md", "platform/dev/6.7/resources/references/adr/2020-08-12-implement-app-system-inside-platform.md", "platform/dev/6.7/resources/references/app-reference/_index.md", "platform/func/saas/extensions.md", "platform/func/tutorials-and-faq/notes-to-the-APP-URL.md"]
lastBuilt: 2026-09-15
---

Shopware apps are the remote, webhook-driven extension mechanism (as opposed to in-process
plugins): they talk to a Shopware instance over HTTP via a `manifest.xml`, the Admin REST
API and registered webhooks, which is also why apps (unlike plugins) work on Shopware Cloud
(SaaS). Come to this hub instead of grepping directly when you need to place a fact about
apps in context — App SDK vs. plugin vs. app-script implementation choices, the app
lifecycle (register/install/activate), extending CMS content, custom data, rule-builder
conditions, admin UI via the Meteor Admin SDK, Store submission requirements, upgrade
handling, or the self-hosted `APP_URL` setting.

Developer docs, 6.6:
- [Extensions](platform/dev/6.6/concepts/extensions/_index.md) — concept overview of Shopware's two extension systems, apps (webhook-driven, external) vs. plugins (in-process, direct core access). Near-duplicate in scope with the guide index below.
- [Extensions](platform/dev/6.6/guides/plugins/_index.md) — guide index introducing plugins, apps and themes and pointing to their base guides; overlaps with the concepts page above but is guide-oriented rather than conceptual.
- [Apps](platform/dev/6.6/guides/plugins/apps/_index.md) — apps built via the App SDK, the plugin system, or App scripts to add/modify storefront and admin functionality.
- [Add translations for apps](platform/dev/6.6/guides/plugins/apps/administration/adding-snippets.md) — apps add Administration snippet JSON files per locale but cannot override existing plugin snippet keys.
- [Meteor Admin SDK](platform/dev/6.6/guides/plugins/apps/administration/meteor-admin-sdk.md) — NPM library shared by apps and plugins to extend/customize the Administration UI.
- [Content](platform/dev/6.6/guides/plugins/apps/content/_index.md) — extending content management (CMS layouts, visibility conditions) from a custom app.
- [Custom Data](platform/dev/6.6/guides/plugins/apps/custom-data/_index.md) — apps storing data via custom fields on core tables or as fully custom entities.
- [Overview](platform/dev/6.6/guides/plugins/overview.md) — capability comparison of Plugins, Themes and Apps.
- [Extendability](platform/dev/6.6/resources/guidelines/code/core/extendability.md) — the core's extendability model (decoration, factory, visitor, mediator, adapter patterns) that both apps and plugins build on.

Developer docs, 6.7:
- [Extensions](platform/dev/6.7/concepts/extensions/_index.md) — apps (external, webhooks + Admin API, cloud-compatible) vs. plugins (in-process, DB access, not supported in Cloud); the 6.7 counterpart of the 6.6 concepts page above.
- [Apps](platform/dev/6.7/concepts/extensions/apps-concept.md) — app system concept: manifest, HTTP/webhook communication, registration handshake, storefront assets, payments, app scripts, rule conditions.
- [Extension Architecture](platform/dev/6.7/guides/development/extensions/architecture/_index.md) — public API boundaries (`@internal`/`@final`), backward compatibility, and sanctioned extension patterns shared by apps, plugins and bundles.
- [Extensions for Store](platform/dev/6.7/guides/development/testing/store/_index.md) — Shopware Store review requirements for plugins, apps and themes: quality rules, integration boundaries, uninstall cleanup, SEO/privacy.
- [Apps](platform/dev/6.7/guides/plugins/apps/_index.md) — 6.7 entry point for building apps: base setup (`custom/apps`, `manifest.xml`, `app:refresh`/`app:install`/`app:activate`) and guide paths by use case.
- [Content](platform/dev/6.7/guides/plugins/apps/content/_index.md) — 6.7 version of assigning content to categories, building CMS layouts, and controlling visibility by rule conditions from an app.
- [Rule Builder](platform/dev/6.7/guides/plugins/apps/rule-builder/_index.md) — extending the Rule Builder from apps with manifest-declared, Twig-scripted custom rule conditions (`AppScriptConditionHook`), available since 6.4.12.0.
- [Upgrades and Migrations](platform/dev/6.7/guides/upgrades-migrations/_index.md) — version-upgrade workflow and how it affects extension (plugin/app) compatibility.
- [SaaS](platform/dev/6.7/products/saas.md) — on Shopware Cloud, Shopware runs hosting/updates and extensions for SaaS stores are built with the App system rather than plugins.
- [Implement app system inside platform](platform/dev/6.7/resources/references/adr/2020-08-12-implement-app-system-inside-platform.md) — ADR recording the app system's move into core (`Shopware\Core\Framework\App`), its limits and extension points.
- [App Reference](platform/dev/6.7/resources/references/app-reference/_index.md) — index of the app reference material (structure, functions, events, variables, examples) for `manifest.xml`, `cms.xml`, `entities.xml`, `flow.xml`.

Merchant docs:
- [Extensions](platform/func/saas/extensions.md) — buying, installing, deactivating and removing extensions/apps/themes via the admin Store and "My extensions" areas.
- [Notes To The APP URL](platform/func/tutorials-and-faq/notes-to-the-APP-URL.md) — how the `APP_URL` environment variable lets self-hosted apps reach a Shopware instance, where to set it, and how to handle a domain change.
