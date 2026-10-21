---
id: platform/dev/6.7/guides/hosting/configurations/observability/logging.md
title: Logging
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/hosting/configurations/observability/logging.html
sourceHash: c84737de15b52b4bcdbd6ae8221c7be06a65d89e
codeCheckedAgainst: "6.7.15.1"
keywords: ["monolog", "monolog.yaml", "shopware.logger", "error_code_log_levels", "exclude_exception", "exclude_events", "file_rotation_count", "enforce_throw_exception", "LOGGER_ENFORCE_THROW_EXCEPTION", "ExceptionLogger", "business_event_handler_buffer", "log levels", "var/log"]
summary: Monolog logging in Shopware, shopware.logger options (log levels per error code, exclusions, rotation, enforced throw) and flow-event logging.
lastBuilt: 2026-10-21
---
## What it is

Shopware logs errors and debug information through Monolog. Log files go to `var/log` of the installation. Monolog itself is configured in `config/packages/prod/monolog.yaml`; Shopware adds its own filtering and tuning options under `shopware.logger` in `config/packages/shopware.yaml`.

## When to use

- Reduce noise from expected exceptions or business events, or lower/raise the level of specific Shopware error codes.
- Change how many rotated log files are kept.
- Debug swallowed exceptions in production.
- Log all sent e-mails and other flow (business) events.

## Key steps / config

Shopware logger options (`config/packages/shopware.yaml`):

```yaml
shopware:
  logger:
    error_code_log_levels:
      CHECKOUT__CUSTOMER_AUTH_BAD_CREDENTIALS: notice
    exclude_exception:
      - App\Exception\ExpectedException
    exclude_events:
      - app.noisy.event
    file_rotation_count: 30
```

- `error_code_log_levels` — map of error code to level; changes severity of `ShopwareHttpException` records by error code.
- `exclude_exception` — exact exception classes whose records are dropped.
- `exclude_events` — business event names whose records are suppressed.
- Both exclusion lists extend Shopware's defaults (core ships e.g. `Symfony\Component\HttpKernel\Exception\NotFoundHttpException` and `user.recovery.request`, `customer.recovery.request`).
- `file_rotation_count` — number of rotated log files retained (core default `14`).
- `enforce_throw_exception` (env `LOGGER_ENFORCE_THROW_EXCEPTION=1`, default false) — code paths using `ExceptionLogger` rethrow after logging even in `prod`. Outside `prod` they always rethrow.

Log all sent e-mails and flow events by lowering the business event buffer handler level:

```yaml
monolog:
  handlers:
    business_event_handler_buffer:
      level: info
```

## Essential identifiers

- `shopware.logger.error_code_log_levels`, `shopware.logger.exclude_exception`, `shopware.logger.exclude_events`, `shopware.logger.file_rotation_count`, `shopware.logger.enforce_throw_exception`
- `LOGGER_ENFORCE_THROW_EXCEPTION`
- `ExceptionLogger` (`Shopware\Core\Framework\Log\ExceptionLogger`)
- `ShopwareHttpException`
- `business_event_handler_buffer` (Monolog handler, channel `business_events`)
- Monolog levels: `DEBUG`, `INFO`, `NOTICE`, `WARNING`, `ERROR`, `CRITICAL`, `ALERT`, `EMERGENCY`

## Gotchas

- Use exclusions sparingly — they can hide actionable failures.
- `enforce_throw_exception` changes runtime behaviour (exceptions propagate instead of being logged only); intended for diagnostics.
- Setting `business_event_handler_buffer` to `info` costs performance.

## Code check (6.7.15.1)
- confirmed `shopware.logger.file_rotation_count` — integer node, default 14 — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:698
- confirmed `shopware.logger.exclude_exception` — scalar list node — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:701
- confirmed `shopware.logger.exclude_events` — scalar list node — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:704
- confirmed `shopware.logger.error_code_log_levels` — keyed scalar map — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:707
- confirmed `shopware.logger.enforce_throw_exception` — boolean, default false — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:711
- confirmed `LOGGER_ENFORCE_THROW_EXCEPTION` — env var bound to enforce_throw_exception — vendor/shopware/core/Framework/Resources/config/packages/shopware.yaml:549
- confirmed `ExceptionLogger::logOrThrowException()` — logs, then rethrows if enforced or env is not prod — vendor/shopware/core/Framework/Log/ExceptionLogger.php:21
- confirmed `business_event_handler_buffer` — buffer handler on channel business_events — vendor/shopware/core/Framework/DependencyInjection/services.php:199
- confirmed `CHECKOUT__CUSTOMER_AUTH_BAD_CREDENTIALS` — CustomerException error code — vendor/shopware/core/Checkout/Customer/CustomerException.php:49
- confirmed `ShopwareHttpException` — abstract base HTTP exception — vendor/shopware/core/Framework/ShopwareHttpException.php:29
