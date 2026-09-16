---
id: platform/dev/6.7/products/paas/shopware/fundamentals/php-settings.md
title: PHP settings
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/paas/shopware/fundamentals/php-settings.html
sourceHash: 9cf40d44932e0de40784b531d7014d0df7bf87ea
codeCheckedAgainst: "6.7.13.0"
keywords: ["php settings", "PHP_MAX_UPLOAD_SIZE", "PHP_MAX_EXECUTION_TIME", "PHP_SESSION_HANDLER", "upload_max_filesize", "post_max_size", "max_execution_time", "php.ini", "shopware/docker", "paas native", "upload limit"]
summary: "PaaS Native PHP settings via env vars PHP_MAX_UPLOAD_SIZE and PHP_MAX_EXECUTION_TIME (shopware/docker image); PHP_SESSION_HANDLER is managed, do not set."
lastBuilt: 2026-09-15
---
## What it is

How PHP ini settings are configured on Shopware PaaS Native. The build phase uses the official Shopware Docker image (`shopware/docker` on GitHub) as base image, and several PHP settings are exposed as environment variables.

## When to use

When a PaaS Native application needs a larger upload limit or a longer execution time, or when checking which PHP-related variables must not be touched.

## Key steps / config

Set these environment variables (for example through the application's environment variable configuration):

| Env var | PHP ini directive |
|---|---|
| `PHP_MAX_UPLOAD_SIZE` | `upload_max_filesize` |
| `PHP_MAX_UPLOAD_SIZE` | `post_max_size` |
| `PHP_MAX_EXECUTION_TIME` | `max_execution_time` |

One variable, `PHP_MAX_UPLOAD_SIZE`, drives both upload-related directives. The exhaustive list of supported variables is the image's `fpm/rootfs/usr/local/etc/php/conf.d/docker.ini` in the `shopware/docker` repository.

## Essential identifiers

- `PHP_MAX_UPLOAD_SIZE`
- `PHP_MAX_EXECUTION_TIME`
- `PHP_SESSION_HANDLER` (managed, do not set)

## Gotchas

- `PHP_SESSION_HANDLER` is managed by the PaaS automation and should not be updated.
- Shopware core computes the effective maximum upload size as the smaller of `upload_max_filesize` and `post_max_size`, so raising `PHP_MAX_UPLOAD_SIZE` affects both.
- The web installer's requirement check reads `max_execution_time`.

## Code check (6.7.13.0)
- confirmed `upload_max_filesize` — read via ini_get in MemorySizeCalculator::getMaxUploadSize() — vendor/shopware/core/Framework/Util/MemorySizeCalculator.php:58
- confirmed `post_max_size` — read via ini_get in MemorySizeCalculator::getMaxUploadSize() — vendor/shopware/core/Framework/Util/MemorySizeCalculator.php:59
- confirmed `max_execution_time` — checked by the installer requirements validator — vendor/shopware/core/Installer/Requirements/ConfigurationRequirementsValidator.php:36
- unverified `PHP_MAX_UPLOAD_SIZE` — shopware/docker image variable, outside vendor/shopware
- unverified `PHP_MAX_EXECUTION_TIME` — shopware/docker image variable, outside vendor/shopware
- unverified `PHP_SESSION_HANDLER` — shopware/docker image variable, outside vendor/shopware
