---
id: platform/dev/6.7/guides/plugins/apps/app-sdks/php/_index.md
title: Official PHP SDK
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/apps/app-sdks/php/
sourceHash: 572311563a25954fe40b4a59eaf80319fbef8cc4
codeCheckedAgainst: "6.7.13.0"
keywords: ["app php sdk", "shopware/app-php-sdk", "app sdk", "app lifecycle", "app context", "request signing", "signature verification", "http client", "events", "app backend", "shopware app php"]
summary: "Overview of Shopware's official App PHP SDK: installation, app lifecycle handling, context object, request/response signing, HTTP client and events."
lastBuilt: 2026-09-15
---
## What it is

Landing page for Shopware's official App SDK for PHP, a library for building the server-side backend of a Shopware app. It lists the SDK's feature areas; the details are covered in the chapter pages of this section (installation, lifecycle, context, signing, HTTP client, events).

## When to use

When choosing how to implement an app backend in PHP and needing an overview of what the SDK covers before reading the individual chapters. For a Symfony project, the separate App Bundle integrates this SDK with Symfony.

## Key steps / config

The SDK's feature areas, as described by the source:

1. **Installation** — a Composer-installable package.
2. **Lifecycle management** — handling the app's registration, activation, deactivation and uninstallation requests from a shop.
3. **Context object** — gives access to information and services of the calling shop, needed to interact with Shopware's APIs and entities.
4. **Signing** — validates the authenticity and integrity of requests from the shop and signs responses back to it.
5. **HTTP client** — makes authenticated API requests to the shop's endpoints, handling authentication, request execution and response processing.
6. **Event handling** — lets the app react to events dispatched during the lifecycle and registration flow.

## Gotchas

- The SDK is not part of the Shopware core installation; it runs in the app's own server and talks to the shop over HTTP. Shop-side behavior (signature headers, OAuth token endpoint, registration handshake) is implemented in core under `Shopware\Core\Framework\App`.

## Code check (6.7.13.0)
- unverified `shopware/app-php-sdk` — SDK package is outside the checked vendor roots
- confirmed `shopware-shop-signature` — header the shop signs requests with, verified by the SDK's signing — vendor/shopware/core/Framework/App/Hmac/RequestSigner.php:15
- confirmed `shopware-app-signature` — header the app's responses/registration are signed with — vendor/shopware/core/Framework/App/Hmac/RequestSigner.php:13
- confirmed `/api/oauth/token` — core OAuth2 token endpoint for Admin API access — vendor/shopware/core/Framework/Api/Controller/AuthController.php:33
- confirmed `registrationUrl` — manifest element pointing the shop at the app's registration endpoint — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:188
