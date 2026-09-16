---
codeCheckedAgainst: "6.7.13.0"
docType: developer
id: platform/dev/6.7/guides/hosting/configurations/observability/logging.md
sourceHash: d2393dd8d9e44708de6d8cfcf0c797faac52668c
sourceUrl: https://developer.shopware.com/docs/guides/hosting/configurations/observability/logging.html
title: Logging
version: "6.7"
versions:
  - "6.7"
keywords: ["monolog", "monolog.yaml", "business_event_handler_buffer", "business_events", "var/log", "log levels", "logging", "flow events", "sent e-mails", "mail log", "fingers_crossed", "log file"]
summary: "Shopware Monolog logging: prod monolog.yaml, log levels, var/log, and logging sent mails and flow events via business_event_handler_buffer."
lastBuilt: 2026-09-15
---
## What it is

Shopware logs errors and debug information with Monolog. Log files are written to the `var/log` directory of the installation.

## When to use

When configuring log output or log levels for a hosted shop, or when you need a record of sent e-mails and other flow (business) events.

## Key steps / config

1. Configure Monolog in `config/packages/prod/monolog.yaml`. The core default for `prod`:

```yaml
monolog:
    handlers:
        main:
            type: fingers_crossed
            action_level: error
            handler: nested
        nested:
            type: rotating_file
            path: "%kernel.logs_dir%/%kernel.environment%.log"
            level: error
        console:
            type: console
            process_psr_3_messages: false
            channels: ["!event", "!doctrine"]
```

2. To log all sent e-mails and other flow events, set the level of the `business_event_handler_buffer` handler to `info`:

```yaml
monolog:
  handlers:
    business_event_handler_buffer:
      level: info
```

`business_event_handler_buffer` is a `buffer` handler on the `business_events` channel that forwards to `business_event_handler`, a service handler backed by `Shopware\Core\Framework\Log\Monolog\DoctrineSQLHandler` (writes to the database log).

## Essential identifiers

- `config/packages/prod/monolog.yaml`
- `var/log`
- `business_event_handler_buffer`, `business_event_handler`, channel `business_events`
- `Shopware\Core\Framework\Log\Monolog\DoctrineSQLHandler`
- Log levels: `DEBUG`, `INFO`, `NOTICE`, `WARNING`, `ERROR`, `CRITICAL`, `ALERT`, `EMERGENCY`

## Gotchas

- Lowering `business_event_handler_buffer` to `info` costs performance.
- In `prod`, the `main` handler is `fingers_crossed` with `action_level: error`, so lower-level messages only reach the log file when an error occurs in the same request.
- Events listed under `shopware.logger.exclude_events` (by default `user.recovery.request`, `customer.recovery.request`) are filtered from the main handler by `ExcludeFlowEventHandler`.

## Code check (6.7.13.0)
- confirmed `business_event_handler_buffer` — buffer handler on `business_events` channel — vendor/shopware/core/Framework/DependencyInjection/services.xml:50
- confirmed `business_event_handler` — service handler using DoctrineSQLHandler — vendor/shopware/core/Framework/DependencyInjection/services.xml:59
- confirmed `monolog.handlers.main` — prod default fingers_crossed, action_level error — vendor/shopware/core/Framework/Resources/config/packages/prod/monolog.yaml:3
- confirmed `monolog.handlers.nested` — rotating_file under kernel.logs_dir — vendor/shopware/core/Framework/Resources/config/packages/prod/monolog.yaml:7
- confirmed `shopware.logger.exclude_events` — passed to ExcludeFlowEventHandler — vendor/shopware/core/Framework/Resources/config/packages/shopware.yaml:517
- confirmed `ExcludeFlowEventHandler` — decorates monolog.handler.main — vendor/shopware/core/Framework/DependencyInjection/services.xml:680
