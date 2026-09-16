---
id: platform/dev/6.7/guides/plugins/apps/app-sdks/php/02-lifecycle.md
title: Lifecycle
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/apps/app-sdks/php/02-lifecycle.html
sourceHash: fa6cd2f5c63bb4b883dcd87299017c5817758065
codeCheckedAgainst: "6.7.13.0"
keywords: ["AppLifecycle", "app lifecycle", "app.activated", "app.deactivated", "app.deleted", "ShopResolver", "RegistrationService", "webhook", "manifest.xml", "app-php-sdk", "uninstall app", "activate deactivate"]
summary: "PHP app SDK: register app.activated/app.deactivated/app.deleted webhooks in manifest.xml and route them through AppLifecycle to track shop state."
lastBuilt: 2026-09-15
---
## What it is

The PHP App Server SDK page on handling app lifecycle events (activate, deactivate, uninstall/delete) via `\Shopware\App\SDK\AppLifecycle`, which wraps `RegistrationService` so one controller serves registration and all lifecycle calls.

## When to use

When your app backend stores shops in a database and must track whether the app is active or removed in each shop.

## Key steps / config

1. Register lifecycle webhooks in `manifest.xml` (each `<webhook>` requires `name`, `url`, `event`; optional `onlyLiveVersion`):

```xml
<webhooks>
    <webhook name="appActivate" url="https://app-server.com/app/activate" event="app.activated"/>
    <webhook name="appDeactivated" url="https://app-server.com/app/deactivated" event="app.deactivated"/>
    <webhook name="appDelete" url="https://app-server.com/app/delete" event="app.deleted"/>
</webhooks>
```

2. Build the lifecycle object and route requests:

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

`$app` is an `AppConfiguration`, `$repository` implements `\Shopware\App\SDK\Shop\ShopRepositoryInterface`, `$psrRequest` is a PSR-7 request.

## Essential identifiers

- `\Shopware\App\SDK\AppLifecycle` — `register()`, `registerConfirm()`, `activate()`, `deactivate()`, `delete()`
- `\Shopware\App\SDK\Shop\ShopResolver`
- `\Shopware\App\SDK\Registration\RegistrationService`
- Webhook events `app.activated`, `app.deactivated`, `app.deleted`

## Gotchas

- The source's manifest URLs (`/app/deactivated`) do not match its router (`/app/deactivate`); the webhook `url` must hit the route you actually map.
- Uninstalling an active app makes the core notify the app server with both `app.deactivated` and `app.deleted`.
- Core also defines `app.installed` and `app.updated` events; this example handles only the three above.

## Code check (6.7.13.0)
- unverified `\Shopware\App\SDK\AppLifecycle` — external package shopware/app-php-sdk, not in vendor/shopware
- unverified `\Shopware\App\SDK\Shop\ShopResolver` — external SDK class, out of scope
- confirmed `app.activated` — AppActivatedEvent::NAME — vendor/shopware/core/Framework/App/Event/AppActivatedEvent.php:13
- confirmed `app.deactivated` — AppDeactivatedEvent::NAME — vendor/shopware/core/Framework/App/Event/AppDeactivatedEvent.php:13
- confirmed `app.deleted` — AppDeletedEvent::NAME — vendor/shopware/core/Framework/App/Event/AppDeletedEvent.php:16
- confirmed `app.installed` — AppInstalledEvent::NAME — vendor/shopware/core/Framework/App/Event/AppInstalledEvent.php:13
- confirmed `webhook` — manifest type with required name/url/event attributes — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:265
- confirmed `onlyLiveVersion` — optional webhook attribute, default false — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:269
- confirmed `AppManager::uninstall()` — notifies app.deactivated and app.deleted webhooks — vendor/shopware/core/Framework/App/Lifecycle/AppManager.php:210
