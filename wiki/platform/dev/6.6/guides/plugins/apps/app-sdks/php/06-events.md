---
id: platform/dev/6.6/guides/plugins/apps/app-sdks/php/06-events.md
title: Events
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/apps/app-sdks/php/06-events.html
sourceHash: e384fa2d8219a4eca6b0440d83e02c32f95d9290
keywords: ["AppLifecycle", "RegistrationService", "PSR event dispatcher", "BeforeShopActivateEvent", "ShopActivatedEvent", "BeforeShopDeactivatedEvent", "ShopDeactivatedEvent", "BeforeShopDeletionEvent", "ShopDeletedEvent", "BeforeRegistrationCompletedEvent", "RegistrationCompletedEvent"]
summary: "PHP SDK lifecycle and registration events fired via a PSR event dispatcher passed to AppLifecycle and RegistrationService."
lastBuilt: "2026-09-15"
---
## What it is

The `Shopware\App\SDK\AppLifecycle` and `Shopware\App\SDK\Registration\RegistrationService` classes accept a PSR event dispatcher. When one is passed, they fire events for shop activation, deactivation, deletion, and registration.

## When to use

Pass a PSR event dispatcher to these classes when your app needs to react to shop lifecycle changes or registration completion — for example to run custom code before or after a shop is activated, deactivated, deleted, or its registration completes.

## Key steps / config

Events fired when a PSR dispatcher is provided:

- `BeforeShopActivateEvent`
- `ShopActivatedEvent`
- `BeforeShopDeactivatedEvent`
- `ShopDeactivatedEvent`
- `BeforeShopDeletionEvent`
- `ShopDeletedEvent`
- `BeforeRegistrationCompletedEvent`
- `RegistrationCompletedEvent`

## Essential identifiers

- `Shopware\App\SDK\AppLifecycle`
- `Shopware\App\SDK\Registration\RegistrationService`
- `BeforeShopActivateEvent`, `ShopActivatedEvent`, `BeforeShopDeactivatedEvent`, `ShopDeactivatedEvent`
- `BeforeShopDeletionEvent`, `ShopDeletedEvent`, `BeforeRegistrationCompletedEvent`, `RegistrationCompletedEvent`
