---
id: platform/dev/6.7/resources/references/adr/2023-05-25-exception-log-levels.md
title: Exception Log Level configuration
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2023-05-25-exception-log-levels.html
sourceHash: 10894a5dc1e50980939ae3223eb2058032913eed
codeCheckedAgainst: "6.7.15.1"
keywords: ["framework.exceptions", "log_level", "shopware.logger.error_code_log_levels", "ErrorCodeLogLevelHandler", "ShopwareHttpException", "error code", "monolog", "log level", "notice", "exception logging", "log noise", "adr"]
summary: "ADR: uncaught client-error exceptions (HTTP 40x) are logged as notice via Symfony framework.exceptions and Shopware's error-code-based log level map."
lastBuilt: 2026-10-21
---
## What it is

Architecture decision record (2023): by default `symfony/monolog-bridge` logs every uncaught exception at `error` level. Exceptions caused by malformed client requests (a `ShopwareHttpException` with a 40x status) are expected, not errors, and flood the logs. The platform therefore ships configuration that downgrades specific exceptions to `notice`, which projects can adjust.

## When to use

- Your logs are full of `error` entries for 404s, missing fields or other client mistakes.
- You control all API clients and want every client error logged at a higher level for debugging (override the shipped mapping).
- You need to change the log level of a single Shopware domain-exception case.

## Key steps / config

1. **By exception class** — Symfony's `framework.exceptions` configuration, keyed by FQCN:

```yaml
framework:
    exceptions:
        Symfony\Component\HttpKernel\Exception\NotFoundHttpException:
            log_level: notice
```

2. **By Shopware error code** — domain exceptions bundle several cases in one class, so the FQCN is not specific enough. Shopware adds a map keyed by the exception's unique error code (`ShopwareHttpException::getErrorCode()`):

```yaml
shopware:
    logger:
        error_code_log_levels:
            CHECKOUT__CART_HASH_MISMATCH: notice
```

`ErrorCodeLogLevelHandler` (a Monolog handler wrapper) rewrites the record level when the logged exception is a `ShopwareHttpException` whose error code is in the map; it also unwraps a Messenger `HandlerFailedException` to check the original exception.

## Essential identifiers

- `framework.exceptions.<FQCN>.log_level`
- `shopware.logger.error_code_log_levels`
- `Shopware\Core\Framework\Log\Monolog\ErrorCodeLogLevelHandler`
- `ShopwareHttpException::getErrorCode()`

## Gotchas

- Adding this configuration changes the log levels in existing projects; the ADR considers that an improvement.
- Configuring the level inside the exception class (attribute or method) was rejected because it makes per-project overrides harder.

## Code check (6.7.15.1)
- confirmed `framework.exceptions` — core ships per-FQCN log_level: notice entries — vendor/shopware/core/Framework/Resources/config/packages/framework.yaml:100
- confirmed `shopware.logger.error_code_log_levels` — prototype map under the logger section — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:707
- confirmed `error_code_log_levels` — default map sets error codes to notice — vendor/shopware/core/Framework/Resources/config/packages/shopware.yaml:558
- confirmed `ErrorCodeLogLevelHandler` — Monolog handler applying the error-code map — vendor/shopware/core/Framework/Log/Monolog/ErrorCodeLogLevelHandler.php:15
- confirmed `ShopwareHttpException::getErrorCode()` — lookup key for the level map — vendor/shopware/core/Framework/Log/Monolog/ErrorCodeLogLevelHandler.php:48
- unverified `symfony/monolog-bridge` — default error-level logging lives in vendor/symfony, out of scope
