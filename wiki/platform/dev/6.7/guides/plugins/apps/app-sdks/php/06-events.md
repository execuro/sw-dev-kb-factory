---
id: platform/dev/6.7/guides/plugins/apps/app-sdks/php/06-events.md
title: Events
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/apps/app-sdks/php/06-events.html
sourceHash: e384fa2d8219a4eca6b0440d83e02c32f95d9290
codeCheckedAgainst: "6.7.13.0"
keywords: ["AppLifecycle", "RegistrationService", "BeforeShopActivateEvent", "ShopActivatedEvent", "BeforeShopDeactivatedEvent", "ShopDeactivatedEvent", "BeforeShopDeletionEvent", "ShopDeletedEvent", "BeforeRegistrationCompletedEvent", "RegistrationCompletedEvent", "psr-14 event dispatcher", "app php sdk events", "app lifecycle hooks"]
summary: "App PHP SDK events: pass a PSR event dispatcher to AppLifecycle or RegistrationService to receive shop activate/deactivate/delete and registration events."
lastBuilt: 2026-09-15
---
## What it is

Lists the events the Shopware App PHP SDK (`shopware/app-php-sdk`) dispatches during the app lifecycle and the shop registration process. They are fired only when a PSR event dispatcher is passed to `Shopware\App\SDK\AppLifecycle` or `Shopware\App\SDK\Registration\RegistrationService`.

## When to use

When an app backend built on the PHP SDK must run its own code at a lifecycle point, for example provisioning data after a shop registered, cleaning up before a shop is deleted, or reacting to activation and deactivation.

## Key steps / config

1. Construct `Shopware\App\SDK\AppLifecycle` and/or `Shopware\App\SDK\Registration\RegistrationService` with a PSR event dispatcher.
2. Register listeners for the events below; each lifecycle stage has a "before" event and a "done" event:

| Stage | Before | After |
|---|---|---|
| Activation | `BeforeShopActivateEvent` | `ShopActivatedEvent` |
| Deactivation | `BeforeShopDeactivatedEvent` | `ShopDeactivatedEvent` |
| Deletion | `BeforeShopDeletionEvent` | `ShopDeletedEvent` |
| Registration | `BeforeRegistrationCompletedEvent` | `RegistrationCompletedEvent` |

The event classes live in the SDK's `src/Event/` directory (see `https://github.com/shopware/app-php-sdk`).

## Essential identifiers

- `Shopware\App\SDK\AppLifecycle`
- `Shopware\App\SDK\Registration\RegistrationService`
- `BeforeShopActivateEvent`, `ShopActivatedEvent`
- `BeforeShopDeactivatedEvent`, `ShopDeactivatedEvent`
- `BeforeShopDeletionEvent`, `ShopDeletedEvent`
- `BeforeRegistrationCompletedEvent`, `RegistrationCompletedEvent`

## Gotchas

- Without a dispatcher passed in, none of these events fire.
- Activation, deactivation and deletion reach the app server only if the app manifest subscribes the matching core webhooks (`app.activated`, `app.deactivated`, `app.deleted`) to the SDK's lifecycle endpoints.

## Code check (6.7.13.0)
- unverified `Shopware\App\SDK\AppLifecycle` — lives in shopware/app-php-sdk, outside the checked vendor roots
- unverified `Shopware\App\SDK\Registration\RegistrationService` — app-php-sdk, out of scope
- unverified `BeforeShopActivateEvent` — SDK event classes (all eight) are app-php-sdk, out of scope
- confirmed `app.activated` — core event name that triggers the activation webhook — vendor/shopware/core/Framework/App/Event/AppActivatedEvent.php:13
- confirmed `app.deactivated` — core event name for deactivation — vendor/shopware/core/Framework/App/Event/AppDeactivatedEvent.php:13
- confirmed `app.deleted` — core event name for deletion — vendor/shopware/core/Framework/App/Event/AppDeletedEvent.php:16
