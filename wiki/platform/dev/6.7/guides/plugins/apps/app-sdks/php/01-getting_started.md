---
id: platform/dev/6.7/guides/plugins/apps/app-sdks/php/01-getting_started.md
title: Getting started
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/apps/app-sdks/php/01-getting_started.html
sourceHash: 0aecc389a067b10c380dc14d4006e630d8a42a9d
codeCheckedAgainst: "6.7.13.0"
keywords: ["shopware/app-php-sdk", "app-php-sdk", "php app server sdk", "AppConfiguration", "RegistrationService", "ShopRepositoryInterface", "FileShopRepository", "registerConfirm", "app registration", "handshake", "registrationUrl", "psr-7"]
summary: "Install shopware/app-php-sdk and wire RegistrationService (register, registerConfirm) to handle the Shopware app registration handshake in a PHP app server."
lastBuilt: 2026-09-15
---
## What it is

First step of the PHP App Server SDK guide (`https://github.com/shopware/app-php-sdk`): installing the package and handling the app registration handshake with `RegistrationService`.

## When to use

When you build a Shopware app backend in PHP and need the two registration endpoints Shopware calls during app install (registration request and confirmation).

## Key steps / config

1. Install the SDK; Composer also installs an HTTP client if none is present:
   `composer require shopware/app-php-sdk`
2. Create an `AppConfiguration` (app name, app secret, confirmation callback URL), a shop repository implementing `\Shopware\App\SDK\Shop\ShopRepositoryInterface` (see `FileShopRepository` as example), and a PSR-7 request (convert a Symfony HttpFoundation request if needed).
3. Route the two registration URLs to `\Shopware\App\SDK\Registration\RegistrationService`:

```php
$app = new AppConfiguration('Foo', 'test', $callbackUrl); // source: .../register/callback
$registrationService = new \Shopware\App\SDK\Registration\RegistrationService($app, $repository);

$response = match($_SERVER['REQUEST_URI']) {
    '/app/register' => $registrationService->register($psrRequest),
    '/app/register/confirm' => $registrationService->registerConfirm($psrRequest),
    default => throw new \RuntimeException('Unknown route')
};
```

What Shopware sends (installed core):
- Registration: `GET` to the manifest's `setup > registrationUrl` with query `shop-id`, `shop-url`, `timestamp`, headers `shopware-app-signature` (HMAC-SHA256 of the query with the app secret) and `sw-version`. The app must answer JSON with `proof`, `secret` and `confirmation_url`.
- Confirmation: `POST` JSON `apiKey`, `secretKey`, `shopUrl`, `shopId` to `confirmation_url`, signed with the new secret in `shopware-shop-signature`.

## Essential identifiers

- `shopware/app-php-sdk`
- `AppConfiguration`
- `\Shopware\App\SDK\Registration\RegistrationService` — `register()`, `registerConfirm()`
- `\Shopware\App\SDK\Shop\ShopRepositoryInterface`, `FileShopRepository`
- `registrationUrl` (manifest `setup`)

## Gotchas

- The source example passes a local port-6001 callback URL as third `AppConfiguration` argument; use the URL your app server is reachable under.
- On re-registration the core rejects a `secret` identical to the current app secret and additionally sends `shopware-shop-signature-previous` (signed with the old secret) on confirmation.
- A wrong or missing `proof` fails registration ("The app server provided an invalid proof").

## Code check (6.7.13.0)
- unverified `\Shopware\App\SDK\Registration\RegistrationService` — external package shopware/app-php-sdk, not in vendor/shopware
- unverified `AppConfiguration` — external SDK class, out of scope
- unverified `\Shopware\App\SDK\Shop\ShopRepositoryInterface` — external SDK interface, out of scope
- confirmed `registrationUrl` — required manifest setup element — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:188
- confirmed `shopware-app-signature` — HMAC of query sent on registration request — vendor/shopware/core/Framework/App/Lifecycle/Registration/PrivateHandshake.php:44
- confirmed `PrivateHandshake::fetchAppProof()` — expected proof is HMAC of shopId+shopUrl+appName — vendor/shopware/core/Framework/App/Lifecycle/Registration/PrivateHandshake.php:61
- confirmed `confirmation_url` — read from registration response — vendor/shopware/core/Framework/App/Lifecycle/Registration/AppRegistrationService.php:55
- confirmed `shopware-shop-signature` — signs confirmation payload with new secret — vendor/shopware/core/Framework/App/Lifecycle/Registration/AppRegistrationService.php:129
- confirmed `apiKey` — confirmation payload key (with secretKey, shopUrl, shopId) — vendor/shopware/core/Framework/App/Lifecycle/Registration/AppRegistrationService.php:199
