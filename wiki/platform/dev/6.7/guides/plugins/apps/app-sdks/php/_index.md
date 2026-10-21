---
id: platform/dev/6.7/guides/plugins/apps/app-sdks/php/_index.md
title: Official PHP SDK
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/apps/app-sdks/php/
sourceHash: 572311563a25954fe40b4a59eaf80319fbef8cc4
codeCheckedAgainst: "6.7.15.1"
keywords: ["app php sdk", "shopware/app-php-sdk", "app lifecycle", "context", "signing", "request signature", "shopware-shop-signature", "shopware-app-signature", "http client", "event handling", "app backend", "php"]
summary: Overview of Shopware's App PHP SDK for app backends - lifecycle, context object, request signing, HTTP client and event handling.
lastBuilt: 2026-10-21
---
## What it is

Overview page for Shopware's official App SDK for PHP, a library for building the backend server of a Shopware app. It bundles installation, lifecycle management, a context object, request/response signing, an HTTP client for the Shopware APIs and event handling.

## When to use

When you build an app backend in PHP and want a ready-made implementation of the app registration/lifecycle protocol, signature verification and API access instead of writing them yourself.

## Key steps / config

The SDK covers these areas (each has its own sub-page in this section):

- **Lifecycle management** — handles activation, deactivation and uninstallation (deletion) of the app in a shop.
- **Context** — a context object that gives access to information and services of the Shopware environment, used for calling the APIs and working with entities.
- **Signing** — validates authenticity and integrity of requests from Shopware and signs the app's responses.
- **HTTP client** — makes API requests to Shopware endpoints, including authentication, request execution and response processing.
- **Events** — subscribe to and react to events, e.g. during the app lifecycle or registration.

Source repository: https://github.com/shopware/app-php-sdk

## Code check (6.7.15.1)
- unverified `shopware/app-php-sdk` — the SDK itself is a separate package, outside vendor/shopware/{core,storefront,administration}
- confirmed `RequestSigner::SHOPWARE_APP_SIGNATURE` — core header `shopware-app-signature` used in the signing handshake — vendor/shopware/core/Framework/App/Hmac/RequestSigner.php:13
- confirmed `RequestSigner::SHOPWARE_SHOP_SIGNATURE` — core header `shopware-shop-signature` on requests Shopware sends to apps — vendor/shopware/core/Framework/App/Hmac/RequestSigner.php:15
- confirmed `AppActivatedEvent::NAME` — `app.activated` lifecycle event the SDK reacts to — vendor/shopware/core/Framework/App/Event/AppActivatedEvent.php:13
- confirmed `AppDeletedEvent::NAME` — `app.deleted` lifecycle event — vendor/shopware/core/Framework/App/Event/AppDeletedEvent.php:16
