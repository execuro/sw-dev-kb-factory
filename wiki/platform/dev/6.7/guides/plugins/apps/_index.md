---
id: platform/dev/6.7/guides/plugins/apps/_index.md
title: Apps
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/apps/
sourceHash: 90929db230880ae3e7297a8bdda0b7031c36095d
codeCheckedAgainst: "6.7.13.0"
keywords: ["apps", "app system", "manifest.xml", "custom/apps", "app:refresh", "app:install", "app:activate", "Resources/mcp.xml", "gateway", "checkout gateway", "webhooks", "app scripts", "cloud extension"]
summary: Entry point for Shopware 6.7 apps - remote, event-driven extensions for Cloud; base setup (custom/apps, manifest.xml) and guide paths by use case.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/apps/app-base-guide.md", "platform/dev/6.7/guides/plugins/apps/lifecycle/app-registration-setup.md", "platform/dev/6.7/guides/plugins/apps/create-admin-extension.md", "platform/dev/6.7/resources/references/app-reference/_index.md"]
---
## What it is

Landing page for Shopware apps: the extension mechanism designed for the [Cloud environment](platform/dev/6.7/products/saas.md). Unlike [plugins](platform/dev/6.7/guides/plugins/plugins/_index.md), apps do not run code inside the shop; they follow an event-driven, remote-extension model and talk to external services through APIs. Apps also support themes, so anything a theme plugin can do is possible in an app — the preferred option for design in Cloud shops.

## When to use

- Integrations with third-party services (ERP, CRM, marketing), payment methods forwarding to external providers.
- Storefront/Administration customization, themes, custom CMS blocks.
- Processes outside the shop (product sync, advanced shipping logic, analytics), or extending checkout, pricing/discounts, payment flows, catalog and search behavior.

For the plugin/app comparison see the [Extensions overview](platform/dev/6.7/guides/plugins/_index.md).

## Key steps / config

Base setup ([App Base Guide](platform/dev/6.7/guides/plugins/apps/app-base-guide.md)):

1. Create the app folder in `custom/apps`.
2. Add a valid `manifest.xml` at the app root.
3. Refresh the app registry (`bin/console app:refresh`).
4. Install and activate the app (`app:install`, `app:activate`).

Tooling: [App SDKs](platform/dev/6.7/guides/plugins/apps/app-sdks/_index.md), [App Scripts](platform/dev/6.7/guides/plugins/apps/app-scripts/_index.md) (synchronous, sandboxed logic inside the app system, with caveats), and the [app reference](platform/dev/6.7/resources/references/app-reference/_index.md).

Some extension points use a [gateway pattern](platform/dev/6.7/guides/plugins/apps/gateways/_index.md): Shopware delegates a task to the app service and continues based on the result, e.g. the [checkout gateway](platform/dev/6.7/guides/plugins/apps/gateways/checkout/checkout-gateway.md).

Build path by use case:

- Admin UI module without a backend: [Build an Admin UI App Locally](platform/dev/6.7/guides/plugins/apps/create-admin-extension.md) with the [Meteor Admin SDK](platform/dev/6.7/guides/plugins/apps/administration/meteor-admin-sdk.md) and Vite.
- Backend (registration, server-to-server auth, webhooks, signing, Admin API credentials, payments, tax providers): [App Registration & Backend Setup](platform/dev/6.7/guides/plugins/apps/lifecycle/app-registration-setup.md).
- Request signing: [Signing & Verification](platform/dev/6.7/guides/plugins/apps/lifecycle/app-signature-verification.md).
- Async events: [Webhook](platform/dev/6.7/guides/plugins/apps/lifecycle/webhook.md).
- Features: [Payment](platform/dev/6.7/guides/plugins/apps/checkout/payment.md), [Shipping methods](platform/dev/6.7/guides/plugins/apps/checkout/shipping-methods.md), [Tax provider](platform/dev/6.7/guides/plugins/apps/checkout/tax-provider.md), [Configuration](platform/dev/6.7/guides/plugins/apps/lifecycle/configuration.md).
- MCP tools, prompts, resources: [MCP Server extension](platform/dev/6.7/guides/plugins/apps/mcp-server.md) via `Resources/mcp.xml` and HMAC-signed webhooks.

## Essential identifiers

- `custom/apps`, `manifest.xml`, `Resources/mcp.xml`
- `app:refresh`, `app:install`, `app:activate`

## Code check (6.7.13.0)
- confirmed `custom/apps` — `shopware.app_dir` parameter — vendor/shopware/core/Framework/DependencyInjection/app.php:182
- confirmed `manifest.xml` — app loader discovers apps by this file name — vendor/shopware/core/Framework/App/Lifecycle/AppLoader.php:66
- confirmed `app:refresh` — command refreshing apps, alias `app:update` — vendor/shopware/core/Framework/App/Command/RefreshAppCommand.php:26
- confirmed `app:install` — install command — vendor/shopware/core/Framework/App/Command/InstallAppCommand.php:28
- confirmed `app:activate` — activate command — vendor/shopware/core/Framework/App/Command/ActivateAppCommand.php:15
- confirmed `Resources/mcp.xml` — read by the MCP lifecycle handler — vendor/shopware/core/Framework/App/Lifecycle/Handler/McpLifecycleHandler.php:47
- confirmed `gateways` — manifest element for gateway extension points — vendor/shopware/core/Framework/App/Manifest/Manifest.php:318
- confirmed `checkout` — checkout gateway mapped to `CheckoutGateway` — vendor/shopware/core/Framework/App/Manifest/Xml/Gateway/Gateways.php:18
- confirmed `webhooks` — manifest webhooks element — vendor/shopware/core/Framework/App/Manifest/Manifest.php:304
- confirmed `shipping-methods` — manifest shipping methods element — vendor/shopware/core/Framework/App/Manifest/Manifest.php:316
