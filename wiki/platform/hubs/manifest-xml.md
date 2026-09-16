---
id: platform/hubs/manifest-xml.md
title: manifest.xml
summary: "manifest.xml-driven app features across Shopware 6.6/6.7: admin modules, gateways, custom fields, rule conditions, storefront, lifecycle, CLI release."
keywords: ["manifest.xml", "app system", "apps", "webhooks", "custom modules", "action buttons", "custom fields", "gateways", "checkout gateway", "in-app purchase gateway", "context gateway", "rule conditions", "shipping methods", "storefront apps", "app lifecycle"]
members: [platform/dev/6.6/guides/plugins/apps/administration/add-custom-action-button.md, platform/dev/6.6/guides/plugins/apps/administration/add-custom-modules.md, platform/dev/6.6/guides/plugins/apps/app-base-guide.md, platform/dev/6.6/guides/plugins/apps/app-sdks/javascript/02-lifecycle.md, platform/dev/6.6/guides/plugins/apps/app-sdks/javascript/06-integration.md, platform/dev/6.6/guides/plugins/apps/app-sdks/php/02-lifecycle.md, platform/dev/6.6/guides/plugins/apps/custom-data/custom-fields.md, platform/dev/6.6/guides/plugins/apps/gateways/checkout/checkout-gateway.md, platform/dev/6.6/guides/plugins/apps/gateways/in-app-purchase/in-app-purchase-gateway.md, platform/dev/6.6/guides/plugins/apps/rule-builder/add-custom-rule-conditions.md, platform/dev/6.6/guides/plugins/apps/shipping-methods.md, platform/dev/6.6/guides/plugins/apps/starter/add-api-endpoint.md, platform/dev/6.6/guides/plugins/apps/starter/product-translator.md, platform/dev/6.6/guides/plugins/apps/starter/starter-admin-extension.md, platform/dev/6.6/guides/plugins/apps/storefront/_index.md, platform/dev/6.6/guides/plugins/apps/storefront/apps-as-themes.md, platform/dev/6.6/guides/plugins/apps/storefront/cookies-with-apps.md, platform/dev/6.6/guides/plugins/apps/tax-provider.md, platform/dev/6.6/products/cli/shopware-account-commands/releasing-extension-to-shopware-store.md, platform/dev/6.6/products/extensions/b2b-components/order-approval/guides/04-add-new-approval-condition.md, platform/dev/6.6/resources/guidelines/testing/store/quality-guidelines-apps/_index.md, platform/dev/6.6/resources/references/app-reference/_index.md, platform/dev/6.6/resources/references/app-reference/manifest-reference.md, platform/dev/6.7/concepts/extensions/_index.md, platform/dev/6.7/concepts/extensions/apps-concept.md, platform/dev/6.7/guides/plugins/apps/_index.md, platform/dev/6.7/guides/plugins/apps/administration/_index.md, platform/dev/6.7/guides/plugins/apps/administration/add-custom-action-button.md, platform/dev/6.7/guides/plugins/apps/administration/add-custom-modules.md, platform/dev/6.7/guides/plugins/apps/administration/starter-admin-extension.md, platform/dev/6.7/guides/plugins/apps/app-base-guide.md, platform/dev/6.7/guides/plugins/apps/app-sdks/javascript/02-lifecycle.md, platform/dev/6.7/guides/plugins/apps/app-sdks/php/02-lifecycle.md, platform/dev/6.7/guides/plugins/apps/checkout/shipping-methods.md, platform/dev/6.7/guides/plugins/apps/content/_index.md, platform/dev/6.7/guides/plugins/apps/create-admin-extension.md, platform/dev/6.7/guides/plugins/apps/custom-data/custom-fields.md, platform/dev/6.7/guides/plugins/apps/gateways/_index.md, platform/dev/6.7/guides/plugins/apps/gateways/context/context-gateway.md, platform/dev/6.7/guides/plugins/apps/gateways/in-app-purchase/in-app-purchase-gateway.md, platform/dev/6.7/guides/plugins/apps/lifecycle/product-translator.md, platform/dev/6.7/guides/plugins/apps/rule-builder/add-custom-rule-conditions.md, platform/dev/6.7/guides/plugins/apps/storefront/_index.md, platform/dev/6.7/guides/plugins/apps/storefront/apps-as-themes.md, platform/dev/6.7/guides/plugins/apps/storefront/cookies-with-apps.md, platform/dev/6.7/products/extensions/b2b-components/order-approval/guides/04-add-new-approval-condition.md, platform/dev/6.7/products/tools/cli/shopware-account-commands/releasing-extension-to-shopware-store.md, platform/dev/6.7/resources/references/_index.md, platform/dev/6.7/resources/references/adr/2020-08-12-implement-app-system-inside-platform.md, platform/dev/6.7/resources/references/app-reference/_index.md, platform/dev/6.7/resources/references/app-reference/manifest-reference.md]
lastBuilt: 2026-09-15
---

The Shopware app system is driven entirely by `manifest.xml`: meta info, setup, permissions,
allowed hosts, webhooks, admin modules, action buttons, custom fields, gateways, rule
conditions, shipping methods, tax providers, storefront/theme assets and cookies are all
declared there. Come here instead of grepping when you need to find which manifest section
covers a feature, or when comparing how a feature is declared between 6.6 and 6.7 (several
guides moved path or gained a successor section in 6.7).

### Concepts and references

- [Extensions](platform/dev/6.7/concepts/extensions/_index.md) — apps vs. plugins overview.
- [Apps](platform/dev/6.7/concepts/extensions/apps-concept.md) — app system concept: manifest, webhooks, registration handshake.
- [References](platform/dev/6.7/resources/references/_index.md) — index of manifest/cms/entities/flow-action XML references.
- [Implement app system inside platform](platform/dev/6.7/resources/references/adr/2020-08-12-implement-app-system-inside-platform.md) — ADR: app system moved into core `Shopware\Core\Framework\App`.

### 6.6 guides (`guides/plugins/apps/...`)

- [App Base Guide](platform/dev/6.6/guides/plugins/apps/app-base-guide.md) — manifest.xml, install commands, backend registration, permissions, lifecycle events.
- [Add custom action button](platform/dev/6.6/guides/plugins/apps/administration/add-custom-action-button.md) — smartbar action buttons via manifest.xml.
- [Add custom module](platform/dev/6.6/guides/plugins/apps/administration/add-custom-modules.md) — iframe-based admin modules via `<module>` elements.
- [Lifecycle (JS SDK)](platform/dev/6.6/guides/plugins/apps/app-sdks/javascript/02-lifecycle.md) — activate/deactivate/uninstall webhooks declared in manifest.xml.
- [Integrations (JS SDK)](platform/dev/6.6/guides/plugins/apps/app-sdks/javascript/06-integration.md) — Hono integration and ready-made shop repositories.
- [Lifecycle (PHP SDK)](platform/dev/6.6/guides/plugins/apps/app-sdks/php/02-lifecycle.md) — `AppLifecycle` wraps `RegistrationService`/`ShopResolver`.
- [Custom fields](platform/dev/6.6/guides/plugins/apps/custom-data/custom-fields.md) — registering custom field sets/fields in manifest.xml.
- [Checkout Gateway](platform/dev/6.6/guides/plugins/apps/gateways/checkout/checkout-gateway.md) — manifest-registered checkout URL that alters cart/payment/shipping.
- [In-App Purchase Gateway](platform/dev/6.6/guides/plugins/apps/gateways/in-app-purchase/in-app-purchase-gateway.md) — restrict purchases via a signed JSON callback.
- [Add custom rule conditions](platform/dev/6.6/guides/plugins/apps/rule-builder/add-custom-rule-conditions.md) — `rule-condition` in manifest.xml with Twig scripts and `compare()`.
- [Shipping methods](platform/dev/6.6/guides/plugins/apps/shipping-methods.md) — experimental manifest schema for shipping methods and delivery times.
- [Starter Guide - Add an API endpoint](platform/dev/6.6/guides/plugins/apps/starter/add-api-endpoint.md) — App Script Store API endpoint tutorial.
- [Starter Guide - Read and write data](platform/dev/6.6/guides/plugins/apps/starter/product-translator.md) — Symfony app-bundle webhook + Admin API tutorial.
- [Starter Guide - Create Admin Extensions](platform/dev/6.6/guides/plugins/apps/starter/starter-admin-extension.md) — admin UI entry point via manifest `base-app-url`.
- [Storefront](platform/dev/6.6/guides/plugins/apps/storefront/_index.md) — apps modifying storefront templates/JS/styling without an external server.
- [Apps as themes](platform/dev/6.6/guides/plugins/apps/storefront/apps-as-themes.md) — shipping `theme.json` turns an app into a theme.
- [Add cookies to the consent manager](platform/dev/6.6/guides/plugins/apps/storefront/cookies-with-apps.md) — cookies section in manifest.xml.
- [Tax provider](platform/dev/6.6/guides/plugins/apps/tax-provider.md) — custom tax calculation providers via manifest.xml.
- [Releasing automated extension to Shopware Store](platform/dev/6.6/products/cli/shopware-account-commands/releasing-extension-to-shopware-store.md) — `shopware-cli account producer extension upload`.
- [How to add a new approval condition](platform/dev/6.6/products/extensions/b2b-components/order-approval/guides/04-add-new-approval-condition.md) — plugin `Rule` class or app `rule-conditions` manifest/script.
- [Quality guidelines for apps and themes in the app system](platform/dev/6.6/resources/guidelines/testing/store/quality-guidelines-apps/_index.md) — Store quality-review checklist referencing manifest.xml/config.xml.
- [App Reference](platform/dev/6.6/resources/references/app-reference/_index.md) — landing page for the app reference section.
- [Manifest Reference](platform/dev/6.6/resources/references/app-reference/manifest-reference.md) — overview of manifest.xml sections.

### 6.7 guides (`guides/plugins/apps/...`) — successors of the 6.6 guides above, several relocated

- [Apps](platform/dev/6.7/guides/plugins/apps/_index.md) — entry point: `custom/apps`, manifest.xml, guide paths by use case.
- [Administration](platform/dev/6.7/guides/plugins/apps/administration/_index.md) — apps extend Administration only via manifest modules/custom fields/action buttons/CMS blocks.
- [Add custom action button](platform/dev/6.7/guides/plugins/apps/administration/add-custom-action-button.md) — same feature as the 6.6 guide above, updated for 6.7.
- [Add Custom Module](platform/dev/6.7/guides/plugins/apps/administration/add-custom-modules.md) — same feature as the 6.6 guide above, updated for 6.7.
- [Create Admin Extensions](platform/dev/6.7/guides/plugins/apps/administration/starter-admin-extension.md) — Meteor Admin SDK entry point via manifest `admin base-app-url`; relocated from `starter/starter-admin-extension.md` in 6.6.
- [App Base Guide](platform/dev/6.7/guides/plugins/apps/app-base-guide.md) — same as the 6.6 App Base Guide, updated for 6.7 commands.
- [Lifecycle (JS SDK)](platform/dev/6.7/guides/plugins/apps/app-sdks/javascript/02-lifecycle.md) — TypeScript App Server SDK version of the 6.6 JS lifecycle guide.
- [Lifecycle (PHP SDK)](platform/dev/6.7/guides/plugins/apps/app-sdks/php/02-lifecycle.md) — same as the 6.6 PHP SDK lifecycle guide, updated for 6.7.
- [Shipping Methods](platform/dev/6.7/guides/plugins/apps/checkout/shipping-methods.md) — same feature as the 6.6 `shipping-methods.md`, relocated under `checkout/`.
- [Content](platform/dev/6.7/guides/plugins/apps/content/_index.md) — app-based CMS content/categories/visibility overview, new guide grouping in 6.7.
- [Build an Admin UI App Locally](platform/dev/6.7/guides/plugins/apps/create-admin-extension.md) — Vite dev server admin module via manifest, no app backend needed.
- [Custom Data Fields](platform/dev/6.7/guides/plugins/apps/custom-data/custom-fields.md) — same feature as the 6.6 custom-fields guide; inline manifest custom fields are deprecated (until 6.8) in favour of `Resources/config/custom-fields.xml` since 6.7.13.0.
- [Gateways](platform/dev/6.7/guides/plugins/apps/gateways/_index.md) — overview of checkout/context/in-app-purchase gateways declared under manifest `<gateways>`, new index page in 6.7.
- [Context Gateway](platform/dev/6.7/guides/plugins/apps/gateways/context/context-gateway.md) — new gateway since 6.7.1.0, no 6.6 equivalent.
- [In-App Purchase Gateway](platform/dev/6.7/guides/plugins/apps/gateways/in-app-purchase/in-app-purchase-gateway.md) — same feature as the 6.6 guide above, updated for 6.7.
- [Read and write data](platform/dev/6.7/guides/plugins/apps/lifecycle/product-translator.md) — same tutorial as the 6.6 starter product-translator guide, relocated under `lifecycle/`.
- [Add Custom Rule Conditions](platform/dev/6.7/guides/plugins/apps/rule-builder/add-custom-rule-conditions.md) — same feature as the 6.6 guide above, updated for 6.7.
- [Storefront](platform/dev/6.7/guides/plugins/apps/storefront/_index.md) — same feature as the 6.6 Storefront guide, updated for 6.7.
- [Apps as Themes](platform/dev/6.7/guides/plugins/apps/storefront/apps-as-themes.md) — same feature as the 6.6 guide above, updated for 6.7.
- [Add Cookies to the Consent Manager](platform/dev/6.7/guides/plugins/apps/storefront/cookies-with-apps.md) — same feature as the 6.6 guide above, updated for 6.7.
- [How to add a new approval condition](platform/dev/6.7/products/extensions/b2b-components/order-approval/guides/04-add-new-approval-condition.md) — same as the 6.6 guide above, updated for 6.7.
- [Automatically Release an Extension to the Shopware Store](platform/dev/6.7/products/tools/cli/shopware-account-commands/releasing-extension-to-shopware-store.md) — same command as the 6.6 releasing guide, relocated under `products/tools/cli/`.
- [App Reference](platform/dev/6.7/resources/references/app-reference/_index.md) — same as the 6.6 App Reference index, updated for 6.7.
- [Manifest Reference](platform/dev/6.7/resources/references/app-reference/manifest-reference.md) — same as the 6.6 Manifest Reference, updated to `manifest-3.0.xsd`.
</content>
