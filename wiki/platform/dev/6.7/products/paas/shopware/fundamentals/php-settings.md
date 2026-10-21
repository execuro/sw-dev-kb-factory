---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/products/paas/shopware/fundamentals/php-settings.md
sourceHash: 9cf40d44932e0de40784b531d7014d0df7bf87ea
sourceUrl: https://developer.shopware.com/docs/products/paas/shopware/fundamentals/php-settings.html
title: PHP settings
version: "6.7"
versions:
  - "6.7"
keywords: ["PHP_MAX_UPLOAD_SIZE", "PHP_MAX_EXECUTION_TIME", "PHP_SESSION_HANDLER", "upload_max_filesize", "post_max_size", "max_execution_time", "php.ini", "docker image", "php settings", "upload limit", "paas native"]
summary: "PaaS Native PHP settings via env vars of the Shopware Docker image: PHP_MAX_UPLOAD_SIZE, PHP_MAX_EXECUTION_TIME; PHP_SESSION_HANDLER is platform-managed."
lastBuilt: 2026-10-21
---
## What it is

Shopware PaaS Native builds on the official Shopware Docker image (github.com/shopware/docker). PHP ini settings of that image are configured through environment variables.

## When to use

When an upload is rejected for size or a request hits the execution time limit on PaaS Native and you need to raise the PHP limits.

## Key steps / config

Set these environment variables (they map to the PHP ini directives shown):

- `PHP_MAX_UPLOAD_SIZE` → `upload_max_filesize` and `post_max_size`
- `PHP_MAX_EXECUTION_TIME` → `max_execution_time`

The full list of variables is in the image's `fpm/rootfs/usr/local/etc/php/conf.d/docker.ini` in the [shopware/docker repository](https://github.com/shopware/docker/blob/main/fpm/rootfs/usr/local/etc/php/conf.d/docker.ini).

## Essential identifiers

- `PHP_MAX_UPLOAD_SIZE`, `PHP_MAX_EXECUTION_TIME`
- `upload_max_filesize`, `post_max_size`, `max_execution_time`

## Gotchas

- `PHP_SESSION_HANDLER` is managed by the platform automation; do not change it.
- Shopware computes its maximum upload size as the lower of `upload_max_filesize` and `post_max_size`, so one variable governs both.

## Code check (6.7.15.1)
- confirmed `upload_max_filesize` — read via ini_get when Shopware computes the max upload size — vendor/shopware/core/Framework/Util/MemorySizeCalculator.php:58
- confirmed `post_max_size` — also read for the max upload size — vendor/shopware/core/Framework/Util/MemorySizeCalculator.php:59
- confirmed `MemorySizeCalculator::getMaxUploadSize()` — combines both ini values — vendor/shopware/core/Framework/Util/MemorySizeCalculator.php:55
- unverified `PHP_MAX_UPLOAD_SIZE` — Docker image variable, not in the Shopware code roots
- unverified `PHP_MAX_EXECUTION_TIME` — Docker image variable, out of scope
- unverified `PHP_SESSION_HANDLER` — Docker image/platform variable, out of scope
