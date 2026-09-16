---
id: platform/dev/6.7/guides/plugins/apps/app-sdks/_index.md
title: App SDKs
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/apps/app-sdks/
sourceHash: 26ed6cf8fc056537ede399278793ad183aa01ff8
codeCheckedAgainst: "6.7.13.0"
keywords: ["app sdk", "app sdks", "Meteor Admin SDK", "App SDK for PHP", "App Server SDK in TypeScript", "app backend", "registration flow", "webhook handling", "lifecycle handling", "symfony bundle", "sdk comparison"]
summary: "Comparison of Shopware app SDKs: Meteor Admin SDK (admin UI), App SDK for PHP and App Server SDK in TypeScript (backends) by capability."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/apps/administration/meteor-admin-sdk.md", "platform/dev/6.7/guides/plugins/apps/app-sdks/php/_index.md", "platform/dev/6.7/guides/plugins/apps/app-sdks/javascript/_index.md"]
---
## What it is

Overview page comparing the three SDKs Shopware offers for building apps: one frontend SDK for Administration UI extensions and two backend SDKs that implement the app server side (registration, signing, lifecycle, shop persistence).

## When to use

Choosing which SDK to build an app with: Administration UI extension vs. an app backend in PHP/Symfony vs. TypeScript/JavaScript runtimes (Node, Deno, Cloudflare Workers, serverless/edge).

## Key steps / config

| SDK | Type | Strengths | Gaps (per docs) |
|---|---|---|---|
| [Meteor Admin SDK](platform/dev/6.7/guides/plugins/apps/administration/meteor-admin-sdk.md) | Frontend | Admin UI extensions for apps and plugins; notifications, context/location access, UI/data integration; TypeScript, dependency-free, tree-shakable | No backend features: no registration, webhook verification, lifecycle handling or shop persistence |
| [App SDK for PHP](platform/dev/6.7/guides/plugins/apps/app-sdks/php/_index.md) | Backend | Registration, lifecycle, action parsing into structs, events, signing, context handling, HTTP client; PSR-based; Symfony Bundle available | Less explicit replay protection, storage backends, response builders, structured errors, middleware |
| [App Server SDK in TypeScript](platform/dev/6.7/guides/plugins/apps/app-sdks/javascript/_index.md) | Backend | Runtime portability; registration handshake, signing/verification, preconfigured API client | Less explicit lifecycle handling, webhook ergonomics, storage/persistence, structured errors, response helpers |

Capability matrix from the source:

- Registration flow / lifecycle handling: PHP yes, TypeScript yes, Meteor no.
- Webhook handling and authenticated HTTP client: PHP yes; TypeScript "not strongly surfaced"; Meteor no.
- Storage / persistence: PHP yes, TypeScript yes; storage backends: PHP "some abstraction", TypeScript "not clearly surfaced".
- Framework integration: PHP via Symfony Bundle; TypeScript example-led, less framework-focused.

## Essential identifiers

- Meteor Admin SDK (frontend, Administration)
- App SDK for PHP (backend, Symfony Bundle)
- App Server SDK in TypeScript (backend, JS runtimes)

## Code check (6.7.13.0)
- confirmed `@shopware-ag/meteor-admin-sdk` — imported by the Administration extension API — vendor/shopware/administration/Resources/app/administration/src/core/extension-api.ts:8
- confirmed `registrationUrl` — manifest setup element the SDK registration flow serves — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:188
- confirmed `RequestSigner::SHOPWARE_SHOP_SIGNATURE` — signature header the backend SDKs verify — vendor/shopware/core/Framework/App/Hmac/RequestSigner.php:15
- unverified `App SDK for PHP` — separate Composer package, not in the three vendor roots
- unverified `App Server SDK in TypeScript` — separate npm package, not in the three vendor roots
