---
id: platform/dev/6.7/resources/references/adr/2024-06-17-error-code-log-level-configuration-in-cloud-and-platform.md
title: Error-code log Level configuration in platform or cloud
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2024-06-17-error-code-log-level-configuration-in-cloud-and-platform.html
sourceHash: 88c599a235b8086cc8fcb539ce5af1eb8ea15fbc
codeCheckedAgainst: "6.7.13.0"
keywords: ["error code log level", "shopware.logger.error_code_log_levels", "error_code_log_levels", "ErrorCodeLogLevelHandler", "notice level", "log level", "exception logging", "observability", "saas template", "cloud vs on-premise", "monolog"]
summary: "ADR 2024-06-17: which error codes get lowered log level in platform (expected errors, e.g. 404, bad login) vs cloud config (misuse, misconfiguration)."
lastBuilt: 2026-09-15
---
## What it is

Architecture decision record (2024-06-17, area core) giving the rule for deciding whether an error code's log level is lowered (e.g. to `notice`) in the platform configuration, which affects all installations, or only in the cloud (SaaS template) configuration. It builds on the earlier ADR "Exception Log Level configuration" (2023-05-25).

## When to use

When adding or reviewing an error code in the error-code-to-log-level mapping and deciding whether on-premise customers should still see it at a high log level.

## Key steps / config

Decide per error code whether it makes sense for on-premise customers to keep logging it at a high level. If yes, lower it only in the cloud configuration file of the SaaS template.

- **Never decrease critical errors in platform.**
- **Configure in cloud** (keep high on-premise): unexpected situations a developer should look at even if the fix lies in calling code or configuration, e.g. API misuse or customer-side misconfiguration (such as an incorrectly configured flow).
- **Configure in platform** (lowered everywhere): expected situations where no developer action is needed, e.g. 404 errors or invalid user credentials at login.

In the installed platform the mapping is the `error_code_log_levels` map under `shopware.logger`, keyed by error code:

```yaml
shopware:
    logger:
        error_code_log_levels:
            CHECKOUT__CUSTOMER_AUTH_BAD_CREDENTIALS: notice
            CHECKOUT__CUSTOMER_NOT_FOUND: notice
```

The container parameter `%shopware.logger.error_code_log_levels%` is passed to `Shopware\Core\Framework\Log\Monolog\ErrorCodeLogLevelHandler`, which decorates `monolog.handler.main` and rewrites the record level when the logged exception is a `ShopwareHttpException` whose error code is in the map (also unwrapping a Messenger `HandlerFailedException`).

## Essential identifiers

- `shopware.logger.error_code_log_levels`
- `Shopware\Core\Framework\Log\Monolog\ErrorCodeLogLevelHandler`
- `notice`

## Gotchas

- An error that is noise for Shopware's own monitoring can still be important for the merchant (e.g. a misconfigured flow); such codes belong in the cloud file, not the platform default.
- The mapping only applies to exceptions carrying a Shopware error code (`ShopwareHttpException`).

## Code check (6.7.13.0)
- confirmed `shopware.logger.error_code_log_levels` — platform default map of error codes to levels — vendor/shopware/core/Framework/Resources/config/packages/shopware.yaml:520
- confirmed `error_code_log_levels` — prototype array node keyed by name in bundle configuration — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:671
- confirmed `CHECKOUT__CUSTOMER_AUTH_BAD_CREDENTIALS` — invalid login lowered to notice in platform — vendor/shopware/core/Framework/Resources/config/packages/shopware.yaml:527
- confirmed `ErrorCodeLogLevelHandler` — decorates monolog.handler.main with the mapping parameter — vendor/shopware/core/Framework/DependencyInjection/services.xml:675
- confirmed `ShopwareHttpException` — only exceptions of this type have their level remapped — vendor/shopware/core/Framework/Log/Monolog/ErrorCodeLogLevelHandler.php:47
- unverified `SaaS template cloud configuration` — cloud template is not part of the installed code
