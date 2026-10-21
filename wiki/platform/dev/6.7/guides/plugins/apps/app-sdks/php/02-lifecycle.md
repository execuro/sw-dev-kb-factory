---
id: platform/dev/6.7/guides/plugins/apps/app-sdks/php/02-lifecycle.md
title: Lifecycle
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/apps/app-sdks/php/02-lifecycle.html
sourceHash: fa6cd2f5c63bb4b883dcd87299017c5817758065
codeCheckedAgainst: "6.7.15.1"
keywords: ["AppLifecycle", "RegistrationService", "ShopResolver", "ShopRepositoryInterface", "app.activated", "app.deactivated", "app.deleted", "webhooks", "manifest.xml", "app lifecycle", "activate deactivate uninstall", "app php sdk"]
summary: PHP App SDK AppLifecycle routes register/confirm/activate/deactivate/delete; manifest webhooks on app.activated, app.deactivated, app.deleted.
lastBuilt: 2026-10-21
---
## What it is

How the PHP App SDK tracks an app's state per shop: Shopware sends lifecycle webhooks (activate, deactivate, uninstall) to the app backend, and the SDK's `AppLifecycle` class handles them together with registration in one controller.

## When to use

Your PHP app backend stores shops in a database and must know when the app is activated, deactivated or removed in a shop.

## Key steps / config

1. Register lifecycle webhooks in `manifest.xml`:

```xml
<webhooks>
    <webhook name="appActivate" url="https://app-server.com/app/activate" event="app.activated"/>
    <webhook name="appDeactivated" url="https://app-server.com/app/deactivated" event="app.deactivated"/>
    <webhook name="appDelete" url="https://app-server.com/app/delete" event="app.deleted"/>
</webhooks>
```

2. Build the services (same `AppConfiguration`, repository and PSR-7 request as for registration):

```php
$registrationService = new \Shopware\App\SDK\Registration\RegistrationService($app, $repository);
$shopResolver = new \Shopware\App\SDK\Shop\ShopResolver($repository);
$lifecycle = new \Shopware\App\SDK\AppLifecycle($registrationService, $shopResolver, $repository);
```

3. Route all endpoints through `$lifecycle`: `/app/register` → `register()`, `/app/register/confirm` → `registerConfirm()`, `/app/activate` → `activate()`, `/app/deactivate` → `deactivate()`, `/app/delete` → `delete()`; any other URI throws `\RuntimeException('Unknown route')`. Return the resulting response.

## Essential identifiers

- `\Shopware\App\SDK\AppLifecycle` — `register()`, `registerConfirm()`, `activate()`, `deactivate()`, `delete()`
- `\Shopware\App\SDK\Registration\RegistrationService`, `\Shopware\App\SDK\Shop\ShopResolver`
- Webhook events `app.activated`, `app.deactivated`, `app.deleted`
- Manifest `<webhook>` attributes `name`, `url`, `event` (all required)

## Gotchas

- The source's manifest example points the deactivate webhook at `/app/deactivated`, while its routing example matches `/app/deactivate` — the webhook `url` must match the route you actually serve.
- The manifest `<webhook>` element also accepts an optional `onlyLiveVersion` boolean (default `false`).

## Code check (6.7.15.1)
- confirmed `app.activated` — AppActivatedEvent::NAME — vendor/shopware/core/Framework/App/Event/AppActivatedEvent.php:13
- confirmed `app.deactivated` — AppDeactivatedEvent::NAME — vendor/shopware/core/Framework/App/Event/AppDeactivatedEvent.php:13
- confirmed `app.deleted` — AppDeletedEvent::NAME — vendor/shopware/core/Framework/App/Event/AppDeletedEvent.php:16
- confirmed `webhooks` — manifest element of type webhooks — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:81
- confirmed `webhook.name` — name, url and event attributes are required — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:277
- confirmed `webhook.onlyLiveVersion` — optional, default false — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:280
- unverified `\Shopware\App\SDK\AppLifecycle` — shopware/app-php-sdk package, outside the checked roots
- unverified `\Shopware\App\SDK\Shop\ShopResolver` — app-php-sdk package, out of scope
- unverified `\Shopware\App\SDK\Registration\RegistrationService` — app-php-sdk package, out of scope
