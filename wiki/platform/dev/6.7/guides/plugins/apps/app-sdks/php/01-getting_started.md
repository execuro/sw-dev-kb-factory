---
id: platform/dev/6.7/guides/plugins/apps/app-sdks/php/01-getting_started.md
title: Getting started
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/apps/app-sdks/php/01-getting_started.html
sourceHash: 0aecc389a067b10c380dc14d4006e630d8a42a9d
codeCheckedAgainst: "6.7.15.1"
keywords: ["shopware/app-php-sdk", "AppConfiguration", "RegistrationService", "ShopRepositoryInterface", "FileShopRepository", "register", "registerConfirm", "/app/register", "/app/register/confirm", "app php sdk", "app registration", "app server handshake"]
summary: Install shopware/app-php-sdk via composer and wire RegistrationService to the /app/register and /app/register/confirm routes of a PHP app server.
lastBuilt: 2026-10-21
---
## What it is

First step of the PHP App SDK guide: installing the open-source `shopware/app-php-sdk` package (github.com/shopware/app-php-sdk) and handling the app registration handshake on your own app backend.

## When to use

You are building an app backend in PHP and need Shopware to register a shop with it when the app is installed.

## Key steps / config

1. Install the SDK: `composer require shopware/app-php-sdk`. Composer installs an HTTP client automatically if none is present.
2. Create an `AppConfiguration` with three arguments (the source uses `'Foo'`, `'test'` and a register-callback URL on the app server).
3. Provide a shop repository implementing `\Shopware\App\SDK\Shop\ShopRepositoryInterface` (`FileShopRepository` is the SDK's example implementation).
4. Create or convert a PSR-7 request (e.g. from Symfony HttpFoundation).
5. Instantiate `\Shopware\App\SDK\Registration\RegistrationService($app, $repository)` and route the two registration endpoints:

```php
$response = match($_SERVER['REQUEST_URI']) {
    '/app/register' => $registrationService->register($psrRequest),
    '/app/register/confirm' => $registrationService->registerConfirm($psrRequest),
    default => throw new \RuntimeException('Unknown route')
};
```

6. Return the PSR-7 response. Instead of `RegistrationService` you can use the `AppLifecycle` wrapper (see the Lifecycle page).

On the Shopware side, the shop calls the registration URL with a `GET` carrying `shop-id`, `shop-url` and `timestamp` query values plus a `shopware-app-signature` header (HMAC-SHA256 of the query). The app answers with `secret` and `confirmation_url`; the shop then POSTs `apiKey`, `secretKey`, `timestamp`, `shopUrl` and `shopId` to that confirmation URL, signed in the `shopware-shop-signature` header.

## Essential identifiers

- `shopware/app-php-sdk`
- `AppConfiguration`
- `\Shopware\App\SDK\Registration\RegistrationService` — `register()`, `registerConfirm()`
- `\Shopware\App\SDK\Shop\ShopRepositoryInterface`, `FileShopRepository`
- Routes `/app/register`, `/app/register/confirm`

## Gotchas

- On re-registration, Shopware 6.7.15.1 sends an extra `shopware-shop-signature-previous` header on the confirm request (signed with the old secret) and rejects an app response whose new `secret` equals the current one.

## Code check (6.7.15.1)
- unverified `\Shopware\App\SDK\Registration\RegistrationService` — lives in the shopware/app-php-sdk package, outside the core/storefront/administration roots
- unverified `\Shopware\App\SDK\Shop\ShopRepositoryInterface` — app-php-sdk package, out of scope
- unverified `AppConfiguration` — app-php-sdk package, out of scope
- confirmed `shop-id` — registration GET carries shop-id, shop-url, timestamp query values — vendor/shopware/core/Framework/App/Lifecycle/Registration/PrivateHandshake.php:36
- confirmed `shopware-app-signature` — registration request header, HMAC-SHA256 of the query — vendor/shopware/core/Framework/App/Lifecycle/Registration/PrivateHandshake.php:44
- confirmed `confirmation_url` — read from the app's registration response along with secret — vendor/shopware/core/Framework/App/Lifecycle/Registration/AppRegistrationService.php:101
- confirmed `apiKey` — confirmation payload also carries secretKey, timestamp, shopUrl, shopId — vendor/shopware/core/Framework/App/Lifecycle/Registration/AppRegistrationService.php:314
- confirmed `shopware-shop-signature` — confirm POST signature header — vendor/shopware/core/Framework/App/Lifecycle/Registration/AppRegistrationService.php:244
- confirmed `shopware-shop-signature-previous` — added on re-registration with the current secret — vendor/shopware/core/Framework/App/Lifecycle/Registration/AppRegistrationService.php:253
