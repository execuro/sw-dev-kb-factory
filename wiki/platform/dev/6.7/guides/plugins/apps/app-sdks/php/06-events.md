---
id: platform/dev/6.7/guides/plugins/apps/app-sdks/php/06-events.md
title: Events
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/apps/app-sdks/php/06-events.html
sourceHash: e384fa2d8219a4eca6b0440d83e02c32f95d9290
codeCheckedAgainst: "6.7.15.1"
keywords: ["AppLifecycle", "RegistrationService", "BeforeShopActivateEvent", "ShopActivatedEvent", "BeforeShopDeactivatedEvent", "ShopDeactivatedEvent", "BeforeShopDeletionEvent", "ShopDeletedEvent", "BeforeRegistrationCompletedEvent", "RegistrationCompletedEvent", "psr event dispatcher", "app php sdk", "app lifecycle events"]
summary: PSR events fired by the Shopware App PHP SDK's AppLifecycle and RegistrationService during shop activation, deactivation, deletion and registration.
lastBuilt: 2026-10-21
---
## What it is

The App PHP SDK classes `Shopware\App\SDK\AppLifecycle` and `Shopware\App\SDK\Registration\RegistrationService` accept a PSR event dispatcher. When one is passed, they fire before/after events for each lifecycle stage of a shop connected to your app.

## When to use

When your app backend (built on the PHP SDK) needs to run custom code during app registration or when a shop activates, deactivates or deletes the app.

## Key steps / config

1. Construct `AppLifecycle` / `RegistrationService` with a PSR event dispatcher.
2. Register listeners for the events below; each pair is fired around the action.

| Stage | Before | After |
|---|---|---|
| Activate | `BeforeShopActivateEvent` | `ShopActivatedEvent` |
| Deactivate | `BeforeShopDeactivatedEvent` | `ShopDeactivatedEvent` |
| Delete | `BeforeShopDeletionEvent` | `ShopDeletedEvent` |
| Registration | `BeforeRegistrationCompletedEvent` | `RegistrationCompletedEvent` |

The event classes are in the SDK repository's `src/Event/` directory (https://github.com/shopware/app-php-sdk).

On the Shopware side, the activate/deactivate/delete stages are triggered by the shop calling the app's webhooks for the core events `app.activated`, `app.deactivated` and `app.deleted`; registration completes when Shopware posts to the confirmation URL the app returned during registration.

## Essential identifiers

- `Shopware\App\SDK\AppLifecycle`
- `Shopware\App\SDK\Registration\RegistrationService`
- `BeforeShopActivateEvent`, `ShopActivatedEvent`
- `BeforeShopDeactivatedEvent`, `ShopDeactivatedEvent`
- `BeforeShopDeletionEvent`, `ShopDeletedEvent`
- `BeforeRegistrationCompletedEvent`, `RegistrationCompletedEvent`

## Gotchas

- Events are only dispatched if a PSR dispatcher is passed to the constructor; without one, nothing fires.

## Code check (6.7.15.1)
- unverified `Shopware\App\SDK\AppLifecycle` — lives in the app-php-sdk package, outside vendor/shopware/{core,storefront,administration}
- unverified `Shopware\App\SDK\Registration\RegistrationService` — app-php-sdk package, out of scope
- unverified `ShopActivatedEvent` — SDK event classes (all eight listed) are out of scope of the installed Shopware code
- confirmed `AppActivatedEvent::NAME` — core event `app.activated` that drives the activate stage — vendor/shopware/core/Framework/App/Event/AppActivatedEvent.php:13
- confirmed `AppDeactivatedEvent::NAME` — core event `app.deactivated` — vendor/shopware/core/Framework/App/Event/AppDeactivatedEvent.php:13
- confirmed `AppDeletedEvent::NAME` — core event `app.deleted` — vendor/shopware/core/Framework/App/Event/AppDeletedEvent.php:16
- confirmed `confirmation_url` — core reads the app's confirmation URL from the registration response to complete registration — vendor/shopware/core/Framework/App/Lifecycle/Registration/AppRegistrationService.php:101
