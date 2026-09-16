---
id: platform/dev/6.6/guides/hosting/configurations/observability/opentelemetry.md
title: OpenTelemetry
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/hosting/configurations/observability/opentelemetry.html
sourceHash: afdc94b243470368eec50357a678ff26af432833
keywords: ["opentelemetry", "shopware/opentelemetry", "ext-opentelemetry", "ext-grpc", "OTEL_SERVICE_NAME", "OTEL_TRACES_EXPORTER", "OTEL_EXPORTER_OTLP_ENDPOINT", "distributed tracing", "otlp", "grafana stack", "metrics", "traces"]
summary: "Install shopware/opentelemetry via composer and configure OTEL_* env vars to export traces, logs and metrics via OTLP."
lastBuilt: "2026-09-15"
---
## What it is

OpenTelemetry is a vendor-neutral, open-source standard for collecting distributed traces, metrics and logs from an application, comparable to tools like NewRelic, Datadog, Blackfire Monitoring and Tideways, but able to push data to your own infrastructure (e.g. a Grafana stack) instead of a fixed vendor.

## When to use

Use this to add distributed tracing/metrics/log export to a Shopware installation, e.g. to observe the Profiler, Monolog output, controllers, the Symfony HTTP client, and MySQL queries in an external collector.

## Key steps / config

Requirements: the `ext-opentelemetry` PHP extension, and optionally `ext-grpc` if the transport is gRPC.

Install the extension:

```bash
composer require shopware/opentelemetry
```

This creates `config/packages/prod/opentelemetry.yaml`, which enables the Shopware Profiler integration with OpenTelemetry in production and routes Monolog output to OpenTelemetry.

Basic configuration (auto-instrumentation and service name):

```text
OTEL_PHP_AUTOLOAD_ENABLED=true
OTEL_SERVICE_NAME=shopware
```

Exporter configuration, targeting a collector over gRPC using the OTLP protocol:

```text
OTEL_TRACES_EXPORTER=otlp
OTEL_LOGS_EXPORTER=otlp
OTEL_METRICS_EXPORTER=otlp
OTEL_EXPORTER_OTLP_PROTOCOL=grpc
OTEL_EXPORTER_OTLP_ENDPOINT=<collector host>:4317
```

Using gRPC with OTLP additionally requires the composer packages `open-telemetry/transport-grpc` and `open-telemetry/exporter-otlp`.

## Essential identifiers

- `shopware/opentelemetry` composer package
- `ext-opentelemetry`, `ext-grpc`
- `config/packages/prod/opentelemetry.yaml`
- `OTEL_PHP_AUTOLOAD_ENABLED`, `OTEL_SERVICE_NAME`, `OTEL_TRACES_EXPORTER`, `OTEL_LOGS_EXPORTER`, `OTEL_METRICS_EXPORTER`, `OTEL_EXPORTER_OTLP_PROTOCOL`, `OTEL_EXPORTER_OTLP_ENDPOINT`
- Instrumented traces: Controller, Symfony HTTP Client, MySQL Queries
