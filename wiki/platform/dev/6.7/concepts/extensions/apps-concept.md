---
id: platform/dev/6.7/concepts/extensions/apps-concept.md
title: Apps
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/concepts/extensions/apps-concept.html
sourceHash: a3ce0441101eb8941bd4137c801118a6f712110e
codeCheckedAgainst: "6.7.15.1"
keywords: ["app system", "apps", "manifest.xml", "manifest file", "webhooks", "registration handshake", "app backend", "admin api", "app scripts", "app payment", "rule builder conditions", "storefront assets", "saas", "cloud compatible"]
summary: Shopware 6.7 app system concept - manifest-defined extensions talking via HTTP and webhooks, with registration handshake.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/plugins/apps/app-base-guide.md", "platform/dev/6.7/guides/plugins/apps/lifecycle/app-registration-setup.md", "platform/dev/6.7/guides/plugins/apps/app-scripts/_index.md", "platform/dev/6.7/guides/plugins/apps/checkout/payment.md"]
---
## What it is

Concept page for the Shopware app system: a way to extend and modify Shopware's functionality and appearance through well-defined extension points, decoupled from Shopware itself. Apps talk to Shopware through the Admin API and webhooks rather than through programming-language constructs, so you only need to know the interface, can pick any language or framework, and the app runs on self-hosted shops as well as multi-tenant cloud systems such as [Shopware SaaS](platform/dev/6.7/products/saas.md).

## When to use

When deciding between an app and a plugin, or before starting an app: to understand what the manifest does, how Shopware and the app backend communicate, and which features (Storefront changes, payments, App Scripts, rule conditions) apps can provide.

## Key steps / config

1. **Manifest** - the central interface is the app's `manifest.xml`. It defines the app's features and how Shopware connects to it. Details: [App base guide](platform/dev/6.7/guides/plugins/apps/app-base-guide.md).
2. **Communication** - exclusively via HTTP. Shopware posts events the app subscribes to (webhooks) to HTTP endpoints declared in the manifest; while handling them the app can call the Shopware API for more data. Any tech stack that serves HTTP works.
3. **Registration handshake** - performed at installation: verifies Shopware talks to the right app backend and hands the app credentials for API authentication. See [App registration & backend setup](platform/dev/6.7/guides/plugins/apps/lifecycle/app-registration-setup.md). Optional when no communication is needed, e.g. a [theme](platform/dev/6.7/guides/plugins/themes/_index.md) app.
4. **Storefront appearance** - ship template files, JavaScript, SCSS and snippet files next to the manifest; Shopware rebuilds the Storefront on installation, no asset hosting needed. See [App Storefront guide](platform/dev/6.7/guides/plugins/apps/storefront/_index.md).
5. **Payments** - synchronous (background approval request, no user interaction) or asynchronous (app returns a redirect URL; after the user returns, Shopware verifies the payment status with the app). See [App payment guide](platform/dev/6.7/guides/plugins/apps/checkout/payment.md).
6. **App Scripts** - run custom business logic inside the Shopware execution stack, e.g. load extra data for the Storefront or manipulate the cart. See [App scripts](platform/dev/6.7/guides/plugins/apps/app-scripts/_index.md).
7. **Rule Builder conditions** - add custom conditions to the [Rule builder](platform/dev/6.7/concepts/framework/rule-system/_index.md); see [Add custom rule conditions](platform/dev/6.7/guides/plugins/apps/rule-builder/add-custom-rule-conditions.md).

Manifest sections behind these features (installed schema):

```xml
<manifest>
    <meta>...</meta>
    <setup><registrationUrl>...</registrationUrl><secret>...</secret></setup>
    <storefront>...</storefront>
    <webhooks>...</webhooks>
    <payments>...</payments>
    <rule-conditions>...</rule-conditions>
</manifest>
```

## Essential identifiers

- `manifest.xml`, sections `meta`, `setup`, `webhooks`, `storefront`, `payments`, `rule-conditions`
- Admin API, webhooks, registration handshake

## Version notes

- App payments: from Shopware 6.4.1.0.
- App Scripts: from Shopware 6.4.8.0.
- Rule Builder conditions from apps: from Shopware 6.4.12.0.

## Code check (6.7.15.1)
- confirmed `manifest` — root element with child `meta` — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:5
- confirmed `setup.registrationUrl` — registration handshake URL — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:199
- confirmed `webhooks` — manifest element for event subscriptions — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:81
- confirmed `storefront` — manifest element for Storefront settings — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:47
- confirmed `payments` — manifest element for payment methods — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:99
- confirmed `rule-conditions` — manifest element for custom rule conditions — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:121
- confirmed `AppRegistrationService` — performs the registration handshake (internal) — vendor/shopware/core/Framework/App/Lifecycle/Registration/AppRegistrationService.php:29
- confirmed `AppPaymentHandler` — app payments run through an AbstractPaymentHandler subclass — vendor/shopware/core/Framework/App/Payment/Handler/AppPaymentHandler.php:53
- confirmed `ScriptExecutor` — executes scripts in the Shopware stack — vendor/shopware/core/Framework/Script/Execution/ScriptExecutor.php:24
- confirmed `ScriptRule` — script-based rule class — vendor/shopware/core/Framework/Rule/ScriptRule.php:24
