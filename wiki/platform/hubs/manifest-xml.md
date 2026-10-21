---
id: platform/hubs/manifest-xml.md
title: manifest.xml
summary: "Navigation for the app manifest.xml: sections, admin modules, gateways, rule conditions, storefront, lifecycle, 6.6 vs 6.7."
keywords: ["manifest.xml", "app manifest", "app system", "action-button", "module", "webhooks", "gateways", "rule-conditions", "custom fields", "shipping-methods", "template-load-priority", "app lifecycle"]
members: ["platform/dev/6.6/guides/plugins/apps/administration/add-custom-action-button.md", "platform/dev/6.6/guides/plugins/apps/administration/add-custom-modules.md", "platform/dev/6.6/guides/plugins/apps/app-base-guide.md", "platform/dev/6.6/guides/plugins/apps/app-sdks/javascript/02-lifecycle.md", "platform/dev/6.6/guides/plugins/apps/app-sdks/javascript/06-integration.md", "platform/dev/6.6/guides/plugins/apps/app-sdks/php/02-lifecycle.md", "platform/dev/6.6/guides/plugins/apps/custom-data/custom-fields.md", "platform/dev/6.6/guides/plugins/apps/gateways/checkout/checkout-gateway.md", "platform/dev/6.6/guides/plugins/apps/gateways/in-app-purchase/in-app-purchase-gateway.md", "platform/dev/6.6/guides/plugins/apps/rule-builder/add-custom-rule-conditions.md", "platform/dev/6.6/guides/plugins/apps/shipping-methods.md", "platform/dev/6.6/guides/plugins/apps/starter/add-api-endpoint.md", "platform/dev/6.6/guides/plugins/apps/starter/product-translator.md", "platform/dev/6.6/guides/plugins/apps/starter/starter-admin-extension.md", "platform/dev/6.6/guides/plugins/apps/storefront/_index.md", "platform/dev/6.6/guides/plugins/apps/storefront/apps-as-themes.md", "platform/dev/6.6/guides/plugins/apps/storefront/cookies-with-apps.md", "platform/dev/6.6/guides/plugins/apps/tax-provider.md", "platform/dev/6.6/products/cli/shopware-account-commands/releasing-extension-to-shopware-store.md", "platform/dev/6.6/products/extensions/b2b-components/order-approval/guides/04-add-new-approval-condition.md", "platform/dev/6.6/resources/guidelines/testing/store/quality-guidelines-apps/_index.md", "platform/dev/6.6/resources/references/app-reference/_index.md", "platform/dev/6.6/resources/references/app-reference/manifest-reference.md", "platform/dev/6.7/concepts/extensions/_index.md", "platform/dev/6.7/concepts/extensions/apps-concept.md", "platform/dev/6.7/guides/plugins/apps/_index.md", "platform/dev/6.7/guides/plugins/apps/administration/_index.md", "platform/dev/6.7/guides/plugins/apps/administration/add-custom-action-button.md", "platform/dev/6.7/guides/plugins/apps/administration/add-custom-modules.md", "platform/dev/6.7/guides/plugins/apps/administration/starter-admin-extension.md", "platform/dev/6.7/guides/plugins/apps/app-base-guide.md", "platform/dev/6.7/guides/plugins/apps/app-sdks/javascript/02-lifecycle.md", "platform/dev/6.7/guides/plugins/apps/app-sdks/php/02-lifecycle.md", "platform/dev/6.7/guides/plugins/apps/checkout/shipping-methods.md", "platform/dev/6.7/guides/plugins/apps/create-admin-extension.md", "platform/dev/6.7/guides/plugins/apps/custom-data/custom-fields.md", "platform/dev/6.7/guides/plugins/apps/gateways/_index.md", "platform/dev/6.7/guides/plugins/apps/gateways/checkout/checkout-gateway.md", "platform/dev/6.7/guides/plugins/apps/lifecycle/product-translator.md", "platform/dev/6.7/guides/plugins/apps/rule-builder/_index.md", "platform/dev/6.7/guides/plugins/apps/rule-builder/add-custom-rule-conditions.md", "platform/dev/6.7/guides/plugins/apps/storefront/_index.md", "platform/dev/6.7/guides/plugins/apps/storefront/apps-as-themes.md", "platform/dev/6.7/products/extensions/b2b-components/order-approval/guides/04-add-new-approval-condition.md", "platform/dev/6.7/products/tools/cli/shopware-account-commands/releasing-extension-to-shopware-store.md", "platform/dev/6.7/resources/references/_index.md", "platform/dev/6.7/resources/references/adr/2020-08-12-implement-app-system-inside-platform.md", "platform/dev/6.7/resources/references/app-reference/manifest-reference.md"]
lastBuilt: 2026-10-21
---

# manifest.xml

The `manifest.xml` is the descriptor of a Shopware app. It declares meta information, setup and registration, permissions, webhooks, Administration modules and action buttons, custom fields, cookies, payment and shipping methods, gateways, rule conditions, tax providers and Storefront settings. Come here when a question is about what the manifest can declare, which guide covers a given manifest element, or how 6.6 and 6.7 differ; open the Manifest Reference first for the element list, then the topic guide for detail.

Version differences to know: in 6.7 the base guide references `manifest-3.0.xsd` (6.6 references `manifest-2.0.xsd`). In 6.7 custom field sets are defined in `Resources/config/custom-fields.xml`, the inline manifest `custom-fields` is deprecated and removed in 6.8. Shipping methods are experimental in 6.6 and live under the checkout guides in 6.7. Pages with the same title in both versions are the same topic, revised per version.

## Overview and reference

- [Manifest Reference (6.7)](platform/dev/6.7/resources/references/app-reference/manifest-reference.md) — section-by-section reference of the manifest.
- [Manifest Reference (6.6)](platform/dev/6.6/resources/references/app-reference/manifest-reference.md) — 6.6 version of the same overview.
- [App Reference (6.6)](platform/dev/6.6/resources/references/app-reference/_index.md) — landing page for app structure, functions, methods, events.
- [References (6.7)](platform/dev/6.7/resources/references/_index.md) — technical reference overview including app XML references.
- [Implement app system inside platform (6.7)](platform/dev/6.7/resources/references/adr/2020-08-12-implement-app-system-inside-platform.md) — ADR moving the app system into core.
- [Extensions (6.7)](platform/dev/6.7/concepts/extensions/_index.md) — apps versus plugins.
- [Apps (6.7 concept)](platform/dev/6.7/concepts/extensions/apps-concept.md) — manifest-defined extensions, webhooks, registration handshake.
- [Apps (6.7 guides)](platform/dev/6.7/guides/plugins/apps/_index.md) — which guide to follow per use case.

## Dev 6.7

- [App Base Guide](platform/dev/6.7/guides/plugins/apps/app-base-guide.md) — custom/apps folder, meta block, app:refresh, app:install.
- [Administration](platform/dev/6.7/guides/plugins/apps/administration/_index.md) — defined Administration extension points.
- [Add custom action button](platform/dev/6.7/guides/plugins/apps/administration/add-custom-action-button.md) — smartbar buttons and signed responses.
- [Add Custom Module](platform/dev/6.7/guides/plugins/apps/administration/add-custom-modules.md) — module and main-module iframes.
- [Create Admin Extensions](platform/dev/6.7/guides/plugins/apps/administration/starter-admin-extension.md) — base-app-url entry point with Meteor Admin SDK.
- [Build an Admin UI App Locally](platform/dev/6.7/guides/plugins/apps/create-admin-extension.md) — local Vite-based admin module app.
- [Custom Data Fields](platform/dev/6.7/guides/plugins/apps/custom-data/custom-fields.md) — custom-fields.xml, deprecation of inline form.
- [Shipping Methods](platform/dev/6.7/guides/plugins/apps/checkout/shipping-methods.md) — shipping-methods in the manifest.
- [Gateways](platform/dev/6.7/guides/plugins/apps/gateways/_index.md) — checkout, context and in-app purchase gateways.
- [Checkout Gateway](platform/dev/6.7/guides/plugins/apps/gateways/checkout/checkout-gateway.md) — command-based cart and payment changes.
- [Rule Builder](platform/dev/6.7/guides/plugins/apps/rule-builder/_index.md) — overview of rule-conditions evaluated by ScriptRule.
- [Add Custom Rule Conditions](platform/dev/6.7/guides/plugins/apps/rule-builder/add-custom-rule-conditions.md) — rule-condition plus Twig script.
- [Storefront](platform/dev/6.7/guides/plugins/apps/storefront/_index.md) — templates, JS, SCSS, template-load-priority.
- [Apps as Themes](platform/dev/6.7/guides/plugins/apps/storefront/apps-as-themes.md) — Resources/theme.json.
- [Lifecycle (JavaScript SDK)](platform/dev/6.7/guides/plugins/apps/app-sdks/javascript/02-lifecycle.md) — activate/deactivate/delete webhooks.
- [Lifecycle (PHP SDK)](platform/dev/6.7/guides/plugins/apps/app-sdks/php/02-lifecycle.md) — AppLifecycle and registration routing.
- [Read and write data](platform/dev/6.7/guides/plugins/apps/lifecycle/product-translator.md) — Symfony app-bundle with product.written webhook.
- [How to add a new approval condition](platform/dev/6.7/products/extensions/b2b-components/order-approval/guides/04-add-new-approval-condition.md) — B2B approval condition via plugin or app.
- [Automatically Release an Extension to the Shopware Store](platform/dev/6.7/products/tools/cli/shopware-account-commands/releasing-extension-to-shopware-store.md) — shopware-cli upload.

## Dev 6.6

- [App Base Guide](platform/dev/6.6/guides/plugins/apps/app-base-guide.md) — manifest, install commands, registration, permissions.
- [Add custom action button](platform/dev/6.6/guides/plugins/apps/administration/add-custom-action-button.md) — smartbar action buttons.
- [Add custom module](platform/dev/6.6/guides/plugins/apps/administration/add-custom-modules.md) — admin modules as iframes.
- [Starter Guide - Create Admin Extensions](platform/dev/6.6/guides/plugins/apps/starter/starter-admin-extension.md) — base-app-url admin extension.
- [Custom fields](platform/dev/6.6/guides/plugins/apps/custom-data/custom-fields.md) — field sets in the manifest.
- [Shipping methods](platform/dev/6.6/guides/plugins/apps/shipping-methods.md) — experimental manifest schema.
- [Tax provider](platform/dev/6.6/guides/plugins/apps/tax-provider.md) — custom tax calculation providers.
- [Checkout Gateway](platform/dev/6.6/guides/plugins/apps/gateways/checkout/checkout-gateway.md) — checkout URL returning commands.
- [In-App Purchase Gateway](platform/dev/6.6/guides/plugins/apps/gateways/in-app-purchase/in-app-purchase-gateway.md) — restrict purchasable In-App Purchases.
- [Add custom rule conditions](platform/dev/6.6/guides/plugins/apps/rule-builder/add-custom-rule-conditions.md) — twig logic and compare() helper.
- [Storefront](platform/dev/6.6/guides/plugins/apps/storefront/_index.md) — templates, JS and styling from an app.
- [Apps as themes](platform/dev/6.6/guides/plugins/apps/storefront/apps-as-themes.md) — theme.json in Resources.
- [Add cookies to the consent manager](platform/dev/6.6/guides/plugins/apps/storefront/cookies-with-apps.md) — cookies section.
- [Starter Guide - Add an API endpoint](platform/dev/6.6/guides/plugins/apps/starter/add-api-endpoint.md) — App Script Store API endpoint.
- [Starter Guide - Read and write data](platform/dev/6.6/guides/plugins/apps/starter/product-translator.md) — Symfony app-bundle webhooks and Admin API.
- [Lifecycle (JavaScript SDK)](platform/dev/6.6/guides/plugins/apps/app-sdks/javascript/02-lifecycle.md) — lifecycle webhooks.
- [Integrations (JavaScript SDK)](platform/dev/6.6/guides/plugins/apps/app-sdks/javascript/06-integration.md) — Hono integration and shop repositories.
- [Lifecycle (PHP SDK)](platform/dev/6.6/guides/plugins/apps/app-sdks/php/02-lifecycle.md) — AppLifecycle in one controller.
- [How to add a new approval condition](platform/dev/6.6/products/extensions/b2b-components/order-approval/guides/04-add-new-approval-condition.md) — plugin Rule or app rule-conditions.
- [Releasing automated extension to Shopware Store](platform/dev/6.6/products/cli/shopware-account-commands/releasing-extension-to-shopware-store.md) — shopware-cli upload.
- [Quality guidelines for apps and themes](platform/dev/6.6/resources/guidelines/testing/store/quality-guidelines-apps/_index.md) — Store review checklist.
