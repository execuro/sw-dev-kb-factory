---
id: platform/dev/6.6/guides/hosting/configurations/observability/logging.md
title: Logging
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/hosting/configurations/observability/logging.html
sourceHash: d2393dd8d9e44708de6d8cfcf0c797faac52668c
keywords: ["logging", "Monolog", "log levels", "var/log", "monolog.yaml", "business_event_handler_buffer", "debug", "error logging", "flow events", "email logging", "log configuration"]
summary: Shopware logs via Monolog to var/log, configured in config/packages/prod/monolog.yaml, with standard PSR log levels.
lastBuilt: "2026-09-15"
---
## What it is

This page documents how Shopware handles application logging. Shopware uses Monolog, the standard PHP logging library, to record errors and debug information. Log files produced by Monolog are written to the `var/log` directory of the Shopware installation.

## When to use

Reach for this page when you need to find where Shopware writes its logs, how to change what gets logged, or how to make Shopware log every outgoing e-mail and flow event for auditing or debugging purposes.

## Key steps / config

Monolog is configured in the file `config/packages/prod/monolog.yaml`. The documentation source references a default configuration snippet at `@/docs/snippets/config/monolog.yaml` but does not inline its full contents here.

To monitor all sent e-mails and other flow events, set the `business_event_handler_buffer` handler to the `info` level:

```yaml
monolog:
  handlers:
    business_event_handler_buffer:
      level: info
```

Monolog supports the following log levels, in increasing order of severity:

- `DEBUG` — detailed debug information.
- `INFO` — interesting events, e.g. a user logs in, SQL logs.
- `NOTICE` — normal but significant events.
- `WARNING` — exceptional occurrences that are not errors, e.g. use of deprecated APIs.
- `ERROR` — runtime errors that do not require immediate action but should be logged and monitored.
- `CRITICAL` — critical conditions, e.g. an application component is unavailable or an unexpected exception occurs.
- `ALERT` — action must be taken immediately, e.g. the entire website is down or the database is unavailable; this should trigger alerts.
- `EMERGENCY` — the system is unusable.

## Essential identifiers

- `config/packages/prod/monolog.yaml` — the configuration file for Monolog.
- `var/log` — the directory where log files are written.
- `business_event_handler_buffer` — the Monolog handler that buffers flow-event and e-mail logs.
- Log level names: `DEBUG`, `INFO`, `NOTICE`, `WARNING`, `ERROR`, `CRITICAL`, `ALERT`, `EMERGENCY`.

## Gotchas

Setting `business_event_handler_buffer` to `info` level so that all sent e-mails and other flow events are logged will cost some performance, according to the source documentation.
