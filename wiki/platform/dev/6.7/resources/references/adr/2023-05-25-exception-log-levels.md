---
id: platform/dev/6.7/resources/references/adr/2023-05-25-exception-log-levels.md
title: Exception Log Level configuration
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2023-05-25-exception-log-levels.html
sourceHash: 10894a5dc1e50980939ae3223eb2058032913eed
codeCheckedAgainst: "6.7.13.0"
keywords: ["exception log level", "framework.exceptions", "log_level", "shopware.logger.error_code_log_levels", "ErrorCodeLogLevelHandler", "ShopwareHttpException", "error code", "notice", "monolog", "logging noise", "observability", "adr"]
summary: "ADR: 4xx client exceptions are logged as notice via Symfony framework.exceptions (by FQCN) and shopware.logger.error_code_log_levels (by error code)."
lastBuilt: 2026-09-15
---
## What it is

Architecture decision record (2023-05-25, area core, tags core/devops/observability): Shopware ships configuration that downgrades the log level of expected client-error exceptions from `error` to `notice`, both per exception class and per Shopware error code.

## When to use

When logs are flooded with `error` entries caused by malformed API requests, when a project wants to change which exceptions are logged at which level (for example logging every client error while debugging your own clients), or when wondering why a 40x exception shows up as a notice.

## Key steps / config

- Uncaught PHP exceptions are logged by `symfony/monolog-bridge` at `error` level by default. A `ShopwareHttpException` with a 40x status signals a malformed request, not an error worth analysing.
- Per exception class (FQCN), the platform uses Symfony's `framework.exceptions` configuration, shipped in core's `framework.yaml`:

```yaml
framework:
    exceptions:
        Symfony\Component\HttpKernel\Exception\NotFoundHttpException:
            log_level: notice
```

- Domain exceptions bundle several cases in one class, so an FQCN key is not precise enough. For these, Shopware adds a mapping keyed by the exception's error code (`getErrorCode()`), shipped in core's `shopware.yaml`:

```yaml
shopware:
    logger:
        error_code_log_levels:
            CHECKOUT__CUSTOMER_NOT_LOGGED_IN: notice
```

- `Shopware\Core\Framework\Log\Monolog\ErrorCodeLogLevelHandler` decorates `monolog.handler.main`. For any `ShopwareHttpException` whose error code is in the map, it rewrites the record's level. It also unwraps a messenger `HandlerFailedException` to inspect the original exception.
- Projects override either list in their own package config to adjust the classification.

## Essential identifiers

- `framework.exceptions.<FQCN>.log_level`
- `shopware.logger.error_code_log_levels`
- `Shopware\Core\Framework\Log\Monolog\ErrorCodeLogLevelHandler`
- `Shopware\Core\Framework\ShopwareHttpException`

## Gotchas

- Adding this configuration changes the error logging of existing projects: exceptions that used to log as `error` now log as `notice`.
- Log-level configuration inside the exception class itself (attributes or a method) was rejected because it would make per-project overrides harder.

## Version notes

The ADR expects most of the cloud-specific exception-logging mapping to become unnecessary once this configuration ships in the platform.

## Code check (6.7.13.0)
- confirmed `framework.exceptions` — shipped in core package config — vendor/shopware/core/Framework/Resources/config/packages/framework.yaml:98
- confirmed `log_level` — NotFoundHttpException mapped to notice — vendor/shopware/core/Framework/Resources/config/packages/framework.yaml:101
- confirmed `error_code_log_levels` — Shopware error-code map under shopware.logger — vendor/shopware/core/Framework/Resources/config/packages/shopware.yaml:520
- confirmed `error_code_log_levels` — declared in bundle configuration tree — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:671
- confirmed `ErrorCodeLogLevelHandler` — decorates monolog.handler.main with the map — vendor/shopware/core/Framework/DependencyInjection/services.xml:675
- confirmed `ShopwareHttpException` — handler only matches ShopwareHttpException by getErrorCode() — vendor/shopware/core/Framework/Log/Monolog/ErrorCodeLogLevelHandler.php:47
- confirmed `ShopwareHttpException` — abstract base class exists — vendor/shopware/core/Framework/ShopwareHttpException.php:29
- unverified `symfony/monolog-bridge` — default error-level logging lives in vendor/symfony, out of scope
