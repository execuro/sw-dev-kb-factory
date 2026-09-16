---
id: platform/dev/6.6/guides/plugins/apps/in-app-purchase/_index.md
title: In-App Purchases
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/apps/in-app-purchase/
sourceHash: 7c89bdb063b50a3e66ab6b88a5cd5aab36a52907
keywords: ["in-app purchases", "IAP", "paywall", "extension features", "JWT", "sw-main-hidden", "app-php-sdk", "app-bundle", "Meteor Admin SDK", "postMessage", "admin.html.twig", "checkout trigger"]
summary: "Overview of locking extension features behind a paywall using In-App Purchases, JWT verification, and checkout triggers."
lastBuilt: "2026-09-15"
---
## What it is
In-App Purchases let an extension lock certain features behind a paywall within the same extension, available since Shopware 6.6.9.0. This allows offering free and paid tiers of the same extension.

## When to use
Use when an app wants a free version with limited features and a paid version unlocked via purchase, without shipping separate extensions.

## Key steps / config
On requests to the app server, Shopware sends a signed JWT (as a query parameter for GET, or in the body for POST) that identifies active purchases. Use `shopware/app-php-sdk` (plain PHP) or `shopware/app-bundle` (Symfony) to validate and decode it.

The initial `sw-main-hidden` admin request also carries active In-App Purchases; inject them into the admin JavaScript app, e.g.:

```php
#[Route(path: '/app/admin', name: 'admin')]
public function admin(ModuleAction $action): Response {
    return $this->render('admin.html.twig', [
        'inAppPurchases' => $action->inAppPurchases->all(),
    ]);
}
```

To trigger a checkout for a purchase, use the Meteor Admin SDK from a button in the admin, or send a formatted `postMessage` with the purchase identifier directly to the Admin.

## Essential identifiers
- `sw-main-hidden` (initial admin request)
- `shopware/app-php-sdk`
- `shopware/app-bundle`
- `ModuleAction`
- Meteor Admin SDK (`postMessage` trigger)

## Gotchas
The JWT must be verified for authenticity before trusting its purchase claims; it is signed by Shopware's internal systems specifically so the app developer can confirm it hasn't been tampered with.

## Version notes
In-App Purchases require Shopware 6.6.9.0 or later.
