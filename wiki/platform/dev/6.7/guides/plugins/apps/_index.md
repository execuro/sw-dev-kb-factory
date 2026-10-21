---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/guides/plugins/apps/_index.md
relatedPages:
  - platform/dev/6.7/guides/plugins/apps/app-base-guide.md
  - platform/dev/6.7/guides/plugins/apps/lifecycle/app-registration-setup.md
  - platform/dev/6.7/guides/plugins/apps/app-scripts/_index.md
  - platform/dev/6.7/guides/plugins/apps/gateways/_index.md
sourceHash: 90929db230880ae3e7297a8bdda0b7031c36095d
sourceUrl: https://developer.shopware.com/docs/guides/plugins/apps/
title: Apps
version: "6.7"
versions:
  - "6.7"
keywords: ["apps", "app system", "cloud extension", "custom/apps", "manifest.xml", "app:refresh", "app:install", "Resources/mcp.xml", "webhooks", "gateway pattern", "app scripts", "app sdk", "meteor admin sdk"]
summary: Overview of Shopware apps - external, API/webhook-based extensions for Cloud and self-hosted - and which guide to follow per use case.
lastBuilt: 2026-10-21
---
## What it is

The overview of Shopware apps: the extension mechanism designed for the [Cloud environment](platform/dev/6.7/products/saas.md). Unlike [plugins](platform/dev/6.7/guides/plugins/plugins/_index.md), apps do not run code inside the shop; they follow an event-driven, remote-extension model and talk to external services through APIs. Apps also support themes, so anything a theme plugin can do is possible in an app — the preferred route for design customization in Cloud shops.

## When to use

When starting an app or choosing the next guide. Typical app use cases named by the source: third-party integrations (ERP, CRM, marketing), payment methods forwarding to external providers, storefront customizations and themes, processes outside the shop (product sync, shipping logic, analytics), extending checkout, pricing, discount, catalog or search behavior, and customizing Storefront or Administration. For how apps compare with plugins, see the [extensions overview](platform/dev/6.7/guides/plugins/_index.md).

## Key steps / config

Start with the [App Base Guide](platform/dev/6.7/guides/plugins/apps/app-base-guide.md), which covers:

1. Creating the app folder in `custom/apps`.
2. Adding a valid `manifest.xml` at the app root.
3. Refreshing the app registry (`bin/console app:refresh`).
4. Installing and activating the app (`app:install`, `app:activate`).

Build path by use case:

- **Admin UI without backend:** [Build an Admin UI App Locally](platform/dev/6.7/guides/plugins/apps/create-admin-extension.md) with the [Meteor Admin SDK](platform/dev/6.7/guides/plugins/apps/administration/meteor-admin-sdk.md) and Vite.
- **App with a backend** (registration, server-to-server auth, webhooks, signing, Admin API credentials, payment, tax): [App Registration & Backend Setup](platform/dev/6.7/guides/plugins/apps/lifecycle/app-registration-setup.md).
- **Request signing/verification:** [Signing & Verification](platform/dev/6.7/guides/plugins/apps/lifecycle/app-signature-verification.md).
- **Async event integration:** [Webhook](platform/dev/6.7/guides/plugins/apps/lifecycle/webhook.md).
- **Feature-specific:** [Payment](platform/dev/6.7/guides/plugins/apps/checkout/payment.md), [Shipping methods](platform/dev/6.7/guides/plugins/apps/checkout/shipping-methods.md), [Tax provider](platform/dev/6.7/guides/plugins/apps/checkout/tax-provider.md), [Configuration](platform/dev/6.7/guides/plugins/apps/lifecycle/configuration.md).
- **MCP tools, prompts, resources:** [MCP Server extension](platform/dev/6.7/guides/plugins/apps/mcp-server.md), declared in `Resources/mcp.xml` and served via HMAC-signed webhooks.

Development tooling: [App SDKs](platform/dev/6.7/guides/plugins/apps/app-sdks/_index.md), [App Scripts](platform/dev/6.7/guides/plugins/apps/app-scripts/_index.md), and the [app reference](platform/dev/6.7/resources/references/app-reference/_index.md).

## Essential identifiers

- `custom/apps`
- `manifest.xml`
- `Resources/mcp.xml`
- `app:refresh`, `app:install`, `app:activate`

## Gotchas

- Some extension points use a [gateway pattern](platform/dev/6.7/guides/plugins/apps/gateways/_index.md): Shopware delegates a task to the app service and continues with the returned result, e.g. the [checkout gateway](platform/dev/6.7/guides/plugins/apps/gateways/checkout/checkout-gateway.md).
- App Scripts run synchronous, sandboxed logic inside the app system but come with caveats.

## Code check (6.7.15.1)
- confirmed `custom/apps` — `shopware.app_dir` default — vendor/shopware/core/Framework/DependencyInjection/app.php:192
- confirmed `manifest.xml` — app loader finds apps by this file name — vendor/shopware/core/Framework/App/Lifecycle/AppLoader.php:66
- confirmed `app:refresh` — console command, alias `app:update` — vendor/shopware/core/Framework/App/Command/RefreshAppCommand.php:27
- confirmed `app:install` — console command — vendor/shopware/core/Framework/App/Command/InstallAppCommand.php:29
- confirmed `app:activate` — console command — vendor/shopware/core/Framework/App/Command/ActivateAppCommand.php:16
- confirmed `Resources/mcp.xml` — read by the MCP lifecycle handler when present — vendor/shopware/core/Framework/App/Lifecycle/Handler/McpLifecycleHandler.php:57
