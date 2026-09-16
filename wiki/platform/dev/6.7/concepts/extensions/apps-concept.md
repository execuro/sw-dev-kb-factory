---
id: platform/dev/6.7/concepts/extensions/apps-concept.md
title: Apps
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/concepts/extensions/apps-concept.html
sourceHash: a3ce0441101eb8941bd4137c801118a6f712110e
codeCheckedAgainst: "6.7.13.0"
keywords: ["apps", "app system", "manifest.xml", "webhooks", "registration handshake", "admin api", "app scripts", "app payment", "rule builder conditions", "storefront assets", "saas", "cloud compatible", "AppRegistrationService"]
summary: Shopware app system concept - manifest, HTTP/webhook communication, registration handshake, Storefront assets, payments, app scripts, rule conditions.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/apps/app-base-guide.md", "platform/dev/6.7/guides/plugins/apps/lifecycle/app-registration-setup.md", "platform/dev/6.7/guides/plugins/apps/app-scripts/_index.md", "platform/dev/6.7/guides/plugins/apps/checkout/payment.md"]
---
## What it is

Concept page for the Shopware app system: extensions decoupled from Shopware itself that hook into well-defined extension points. Apps communicate with Shopware only over HTTP (Admin API and webhooks), so they can be written in any language/framework and run on self-hosted shops as well as [Shopware SaaS](platform/dev/6.7/products/saas.md).

## When to use

- Deciding whether an app (not a plugin) fits a use case, especially for cloud/multi-tenant compatibility.
- Understanding what an app can do: webhooks, Storefront changes, payments, app scripts, rule conditions.

## Key steps / config

1. **Manifest**: the central interface between app and Shopware is the `manifest.xml` file; it defines the app's features and how Shopware connects to it. See the [App base Guide](platform/dev/6.7/guides/plugins/apps/app-base-guide.md).
2. **Communication**: Shopware posts events to HTTP endpoints the app defines in the manifest (webhooks); while processing them the app may call the Shopware API for more data.
3. **Registration handshake**: during installation Shopware verifies it talks to the right app backend, and the app receives API credentials. Optional if app and Shopware do not need to communicate (e.g. a theme-only app). See [App registration & backend setup](platform/dev/6.7/guides/plugins/apps/lifecycle/app-registration-setup.md).
4. **Storefront appearance**: ship template files, JavaScript, SCSS and snippet files alongside the manifest; Shopware rebuilds the Storefront on installation — no need to serve assets from the app server. See [App Storefront guide](platform/dev/6.7/guides/plugins/apps/storefront/_index.md) and [Themes](platform/dev/6.7/guides/plugins/themes/_index.md).
5. **Payments**: synchronous payments (background approval request, no user interaction) or asynchronous payments (app provides a redirect URL; after the user returns, Shopware verifies status with the app). See [App payment guide](platform/dev/6.7/guides/plugins/apps/checkout/payment.md).
6. **App scripts**: execute custom business logic inside the Shopware execution stack, e.g. load extra Storefront data or manipulate the cart. See [App scripts](platform/dev/6.7/guides/plugins/apps/app-scripts/_index.md).
7. **Rule Builder**: add custom conditions to the [Rule builder](platform/dev/6.7/concepts/framework/rule-system/_index.md); see [Add custom rule conditions](platform/dev/6.7/guides/plugins/apps/rule-builder/add-custom-rule-conditions.md).

Manifest top-level elements corresponding to these features (manifest schema `manifest-3.0.xsd`), skeleton:

```xml
<manifest>
    <meta>...</meta>
    <setup>...</setup>
    <storefront>...</storefront>
    <webhooks>...</webhooks>
    <payments>...</payments>
    <rule-conditions>...</rule-conditions>
</manifest>
```

## Essential identifiers

- `manifest.xml`, `manifest-3.0.xsd`
- `<setup>`, `<webhooks>`, `<payments>`, `<rule-conditions>` manifest elements
- Handshake headers `shopware-app-signature`, `shopware-shop-signature`
- App payment method URLs `payUrl`, `finalizeUrl`

## Gotchas

- Apps never run inside the Shopware process; all interaction is via HTTP, so any data not in the webhook payload must be fetched through the API.

## Version notes

- Payment provider integration: since Shopware 6.4.1.0.
- App scripts: since Shopware 6.4.8.0.
- Custom Rule Builder conditions: since Shopware 6.4.12.0.

## Code check (6.7.13.0)
- confirmed `AppRegistrationService::registerApp()` — registration handshake on install — vendor/shopware/core/Framework/App/Lifecycle/Registration/AppRegistrationService.php:43
- confirmed `shopware-app-signature` — header sent in handshake request — vendor/shopware/core/Framework/App/Lifecycle/Registration/PrivateHandshake.php:44
- confirmed `shopware-shop-signature` — shop signature on registration confirmation — vendor/shopware/core/Framework/App/Lifecycle/Registration/AppRegistrationService.php:129
- confirmed `manifest-3.0.xsd` — manifest schema file — vendor/shopware/core/Framework/App/Manifest/Manifest.php:33
- confirmed `setup` — manifest registration setup element — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:15
- confirmed `storefront` — manifest storefront element — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:47
- confirmed `webhooks` — manifest webhooks element — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:81
- confirmed `payments` — manifest payments element — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:99
- confirmed `rule-conditions` — manifest rule conditions element — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:121
- confirmed `payUrl` — app payment method pay URL; finalizeUrl for async — vendor/shopware/core/Framework/App/Aggregate/AppPaymentMethod/AppPaymentMethodDefinition.php:53
