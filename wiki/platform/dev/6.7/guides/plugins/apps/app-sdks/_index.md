---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/guides/plugins/apps/app-sdks/_index.md
relatedPages:
  - platform/dev/6.7/guides/plugins/apps/administration/meteor-admin-sdk.md
  - platform/dev/6.7/guides/plugins/apps/app-sdks/php/_index.md
  - platform/dev/6.7/guides/plugins/apps/app-sdks/javascript/_index.md
sourceHash: 26ed6cf8fc056537ede399278793ad183aa01ff8
sourceUrl: https://developer.shopware.com/docs/guides/plugins/apps/app-sdks/
title: App SDKs
version: "6.7"
versions:
  - "6.7"
keywords: ["app sdk", "app sdks", "meteor admin sdk", "app sdk for php", "app server sdk", "typescript sdk", "app backend", "app registration", "webhook handling", "lifecycle handling", "symfony bundle", "sdk comparison"]
summary: Comparison of Shopware app SDKs - Meteor Admin SDK (admin UI), App SDK for PHP and TypeScript App Server SDK (backends) - by capabilities.
lastBuilt: 2026-10-21
---
## What it is

Overview and comparison of the three SDKs Shopware offers for building apps: one frontend SDK for Administration UI extensions and two backend SDKs that implement the app-server side (registration, signing, lifecycle, API access).

## When to use

Choosing which SDK to build an app with, or checking whether an SDK covers a backend concern (registration flow, lifecycle, webhooks, storage) before relying on it.

## Key steps / config

| SDK | Type | Strengths | Gaps (per source) | Lifecycle / webhooks / HTTP client / storage |
|---|---|---|---|---|
| Meteor Admin SDK (`platform/dev/6.7/guides/plugins/apps/administration/meteor-admin-sdk.md`) | Frontend | Admin UI extensions for apps and plugins: notifications, context/location access, UI/data integration; TypeScript, dependency-free, tree-shakable | No backend capabilities: no registration, webhook verification, lifecycle handling or shop persistence | No / No / No / No |
| App SDK for PHP (`platform/dev/6.7/guides/plugins/apps/app-sdks/php/_index.md`) | Backend | PHP / Symfony-style backends: registration, lifecycle, action parsing into structs, events, signing, context handling, HTTP client; PSR-based; Symfony Bundle | Less explicit support for replay protection, storage backends, response builders, structured errors, middleware/extensibility | Yes / Yes / Yes / Yes |
| App Server SDK in TypeScript (`platform/dev/6.7/guides/plugins/apps/app-sdks/javascript/_index.md`) | Backend | TS/JS on Node, Deno, Cloudflare Workers, serverless/edge; registration, signing/verification, preconfigured API client, complete registration handshake | Less explicit coverage for lifecycle handling, webhook ergonomics, storage/persistence, structured errors, response helpers | Yes / not strongly surfaced / not strongly surfaced / Yes |

Framework integration: PHP SDK ships a Symfony Bundle; the TypeScript SDK is example-led and framework-agnostic. Storage backends: PHP has some abstraction; TypeScript not clearly surfaced.

## Gotchas

- The Meteor Admin SDK is not a backend SDK; an app needing registration or webhook handling still needs a PHP or TypeScript backend SDK (or its own implementation).

## Code check (6.7.15.1)
- confirmed `@shopware-ag/meteor-admin-sdk` — imported by the Administration itself — vendor/shopware/administration/Resources/app/administration/src/app/store/extension-sdk-module.store.ts:5
- confirmed `shopware-app-signature` — header the backend SDKs must produce/verify — vendor/shopware/core/Framework/App/Hmac/RequestSigner.php:13
- confirmed `shopware-shop-signature` — header the shop signs requests with — vendor/shopware/core/Framework/App/Hmac/RequestSigner.php:15
- confirmed `AppRegistrationService::confirmRegistration()` — shop side of the registration handshake the SDKs implement — vendor/shopware/core/Framework/App/Lifecycle/Registration/AppRegistrationService.php:231
- unverified `App SDK for PHP` — separate package, not part of the installed core
- unverified `App Server SDK in TypeScript` — separate npm package, not part of the installed core
