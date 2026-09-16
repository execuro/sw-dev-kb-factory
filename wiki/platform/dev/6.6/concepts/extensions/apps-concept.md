---
id: platform/dev/6.6/concepts/extensions/apps-concept.md
title: Apps
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/concepts/extensions/apps-concept.html
sourceHash: 5bcaa0162df0258a03cdff05a23744a5a307a6d8
keywords: ["app", "app system", "manifest", "webhooks", "admin api", "app scripts", "rule builder", "theme", "storefront assets", "payment provider", "registration handshake"]
summary: "Describes the app system: a decoupled extension model using a manifest file, webhooks, and the Admin API."
lastBuilt: "2026-09-15"
---
## What it is

The app system extends and modifies Shopware's functionality and appearance through well-defined extension points, while remaining decoupled from Shopware itself.

## When to use

Use apps when you want freedom of implementation language/framework and full compatibility with multi-tenant cloud shops (self-hosted or Shopware SaaS), rather than the tighter coupling of plugins.

## Key steps / config

- The central interface between an app and Shopware is a **manifest file**, which defines the app's features and how Shopware connects to it.
- Shopware communicates with apps exclusively via HTTP requests: it posts to HTTP endpoints defined in the manifest when relevant events occur; the app can call the Shopware API for additional data.
- A registration handshake during installation verifies Shopware is talking to the right app backend and issues the app credentials for API authentication (optional if no communication is needed, e.g. for a Theme).
- Apps can modify the Storefront's appearance by shipping Storefront assets (template files, JavaScript sources, SCSS sources, snippet files) alongside the manifest; Shopware rebuilds the Storefront on install.
- Apps can integrate payment providers (since 6.4.1.0): synchronous payment (no user interaction) or asynchronous payment (redirect URL provided by the app; Shopware verifies status with the app afterward).
- App Scripts (since 6.4.8.0) let an app execute custom business logic inside the Shopware execution stack.
- Apps can add custom conditions to the Rule Builder (since 6.4.12.0).

## Essential identifiers

- manifest file — the app/Shopware interface definition
- Admin API — used by apps to read/write Shopware resources
- App Scripts — mechanism for custom business logic inside Shopware

## Version notes

- Payment provider integration available starting with Shopware 6.4.1.0.
- App Scripts available starting with Shopware 6.4.8.0.
- Rule Builder custom conditions available starting with Shopware 6.4.12.0.
