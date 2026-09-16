---
id: platform/dev/6.6/guides/plugins/apps/app-sdks/php/01-getting_started.md
title: Getting started
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/apps/app-sdks/php/01-getting_started.html
sourceHash: 0aecc389a067b10c380dc14d4006e630d8a42a9d
keywords: ["app-php-sdk", "AppConfiguration", "RegistrationService", "ShopRepositoryInterface", "FileShopRepository", "composer require", "registration", "register", "register/confirm", "psr-7"]
summary: "PHP App SDK getting-started guide: composer install, create AppConfiguration, route /app/register and /app/register/confirm via RegistrationService."
lastBuilt: "2026-09-15"
---
## What it is

Getting-started guide for the Shopware App SDK for PHP (the open-source `app-php-sdk` project): installation and the registration handshake.

## When to use

When starting a new app backend in PHP that needs to register with Shopware.

## Key steps / config

Install:

```bash
composer require shopware/app-php-sdk
```

Composer installs an HTTP client automatically if one is missing. Build an `AppConfiguration`, a shop repository implementing `\Shopware\App\SDK\Shop\ShopRepositoryInterface` (see `FileShopRepository` for an example), and a `RegistrationService`, then route the two registration endpoints:

```php
$app = new AppConfiguration('Foo', 'test', 'localhost:6001/register/callback');
$repository = ...;
$psrRequest = ...;

$registrationService = new \Shopware\App\SDK\Registration\RegistrationService($app, $repository);

$response = match($_SERVER['REQUEST_URI']) {
    '/app/register' => $registrationService->register($psrRequest),
    '/app/register/confirm' => $registrationService->registerConfirm($psrRequest),
    default => throw new \RuntimeException('Unknown route')
};
```

## Essential identifiers

- `\Shopware\App\SDK\Registration\RegistrationService`
- `\Shopware\App\SDK\Shop\ShopRepositoryInterface`
- `FileShopRepository`
- `AppConfiguration`
- routes: `/app/register`, `/app/register/confirm`
