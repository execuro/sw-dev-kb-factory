---
id: platform/dev/6.6/guides/plugins/apps/app-sdks/php/02-lifecycle.md
title: Lifecycle
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/apps/app-sdks/php/02-lifecycle.html
sourceHash: fa6cd2f5c63bb4b883dcd87299017c5817758065
keywords: ["AppLifecycle", "ShopResolver", "RegistrationService", "activate", "deactivate", "uninstall", "manifest.xml", "webhook", "app.activated", "app.deactivated", "app.deleted"]
summary: "PHP App SDK lifecycle guide: AppLifecycle wraps RegistrationService/ShopResolver to handle register, activate, deactivate, delete in one controller."
lastBuilt: "2026-09-15"
---
## What it is

Describes how the Shopware App System manages an app's lifecycle in PHP: Shopware sends webhooks on registration and lifecycle changes so the app can track state in its own database.

## When to use

When an app needs a single controller handling registration plus `activate`/`deactivate`/`uninstall` state changes.

## Key steps / config

The lifecycle methods are `activate`, `deactivate`, `uninstall`. Register the webhooks in `manifest.xml`:

```xml
<webhooks>
    <webhook name="appActivate" url="https://app-server.com/app/activate" event="app.activated"/>
    <webhook name="appDeactivated" url="https://app-server.com/app/deactivated" event="app.deactivated"/>
    <webhook name="appDelete" url="https://app-server.com/app/delete" event="app.deleted"/>
</webhooks>
```

`AppLifecycle` wraps `RegistrationService` and `ShopResolver` into one controller:

```php
$registrationService = new \Shopware\App\SDK\Registration\RegistrationService($app, $repository);
$shopResolver = new \Shopware\App\SDK\Shop\ShopResolver($repository);
$lifecycle = new \Shopware\App\SDK\AppLifecycle($registrationService, $shopResolver, $repository);

$response = match ($_SERVER['REQUEST_URI']) {
    '/app/register' => $lifecycle->register($psrRequest),
    '/app/register/confirm' => $lifecycle->registerConfirm($psrRequest),
    '/app/activate' => $lifecycle->activate($psrRequest),
    '/app/deactivate' => $lifecycle->deactivate($psrRequest),
    '/app/delete' => $lifecycle->delete($psrRequest),
    default => throw new \RuntimeException('Unknown route')
};
```

## Essential identifiers

- `\Shopware\App\SDK\AppLifecycle`
- `\Shopware\App\SDK\Shop\ShopResolver`
- `\Shopware\App\SDK\Registration\RegistrationService`
- events: `app.activated`, `app.deactivated`, `app.deleted`
