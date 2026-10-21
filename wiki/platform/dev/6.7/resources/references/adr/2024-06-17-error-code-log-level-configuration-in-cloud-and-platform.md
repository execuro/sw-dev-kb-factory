---
id: platform/dev/6.7/resources/references/adr/2024-06-17-error-code-log-level-configuration-in-cloud-and-platform.md
title: Error-code log Level configuration in platform or cloud
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2024-06-17-error-code-log-level-configuration-in-cloud-and-platform.html
sourceHash: 88c599a235b8086cc8fcb539ce5af1eb8ea15fbc
codeCheckedAgainst: "6.7.15.1"
keywords: ["shopware.logger.error_code_log_levels", "error_code_log_levels", "ErrorCodeLogLevelHandler", "log level", "notice level", "error code", "exception logging", "on-premise vs cloud", "saas template", "monolog", "observability", "adr"]
summary: "ADR: which error codes are lowered to notice log level in platform (expected errors) vs only in the cloud SaaS template (misuse, misconfiguration)."
lastBuilt: 2026-10-21
---
## What it is

An architecture decision record (2024-06-17) about where to downgrade the log level of specific Shopware error codes: in the platform configuration (affects every installation, including on-premise) or only in the cloud configuration file of the SaaS template. It builds on the earlier "Exception Log Level configuration" ADR (2023-05-25), which introduced per-error-code log levels in platform.

## When to use

- You add a new exception/error code and must decide whether it is lowered to `notice` in core or only in cloud.
- You wonder why an error that is quiet in Shopware cloud still logs at a high level on a self-hosted shop.

## Key steps / config

Per-error-code log levels live under the `shopware.logger.error_code_log_levels` map in the core `shopware.yaml`; each entry maps an error code to a level:

```yaml
shopware:
    logger:
        error_code_log_levels:
            CHECKOUT__CUSTOMER_AUTH_BAD_CREDENTIALS: notice
            CHECKOUT__CART_HASH_MISMATCH: notice
```

The installed core applies this via `ErrorCodeLogLevelHandler`, which decorates `monolog.handler.main` and rewrites the record's level when the logged exception is a `ShopwareHttpException` whose error code is in the map (it also unwraps a Messenger `HandlerFailedException`).

Decision guide from the ADR, applied per error code:

1. Never decrease critical errors in platform.
2. Configure in **platform** (core `shopware.yaml`) the expected errors — things that normally happen and need no developer action, e.g. 404 errors or invalid user credentials at login.
3. Configure only in **cloud** (cloud configuration file in the SaaS template) the unexpected errors a developer should look at even if the fix is not in Shopware itself but in calling code or configuration — e.g. API misuse or customer-side misconfiguration.
4. Key question: does it still make sense for on-premise customers to log this error at a high level? If yes, add it to the cloud file only.

## Essential identifiers

- `shopware.logger.error_code_log_levels`
- `ErrorCodeLogLevelHandler` (`Shopware\Core\Framework\Log\Monolog`)
- `monolog.handler.main`

## Gotchas

- An incorrectly configured flow is the ADR's example of a cloud-only case: Shopware's own error monitoring does not need it, but the customer must still see it at the highest level — so it must not be lowered in platform.
- Lowering a code in core `shopware.yaml` affects all self-hosted installations, not just cloud.

## Code check (6.7.15.1)
- confirmed `shopware.logger.error_code_log_levels` — passed to the log-level handler as a container parameter — vendor/shopware/core/Framework/DependencyInjection/services.php:871
- confirmed `error_code_log_levels` — map of error code to level in core defaults (e.g. `CHECKOUT__CART_HASH_MISMATCH: notice`) — vendor/shopware/core/Framework/Resources/config/packages/shopware.yaml:558
- confirmed `ErrorCodeLogLevelHandler` — decorates `monolog.handler.main` — vendor/shopware/core/Framework/DependencyInjection/services.php:867
- confirmed `ErrorCodeLogLevelHandler::handle()` — remaps level only for `ShopwareHttpException` error codes in the map — vendor/shopware/core/Framework/Log/Monolog/ErrorCodeLogLevelHandler.php:32
- confirmed `ShopwareHttpException` — condition for remapping the record level — vendor/shopware/core/Framework/Log/Monolog/ErrorCodeLogLevelHandler.php:47
- unverified `SaaS template cloud configuration file` — not part of the installed core packages
