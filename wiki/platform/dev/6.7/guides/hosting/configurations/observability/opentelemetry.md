---
codeCheckedAgainst: "6.7.13.0"
docType: developer
id: platform/dev/6.7/guides/hosting/configurations/observability/opentelemetry.md
sourceHash: 159bf29e5a07694bef478eeae3fd0692b6cbb131
sourceUrl: https://developer.shopware.com/docs/guides/hosting/configurations/observability/opentelemetry.html
title: OpenTelemetry
version: "6.7"
versions:
  - "6.7"
keywords: ["shopware/opentelemetry", "ext-opentelemetry", "ext-grpc", "OTEL_PHP_AUTOLOAD_ENABLED", "OTEL_SERVICE_NAME", "OTEL_EXPORTER_OTLP_ENDPOINT", "OTEL_EXPORTER_OTLP_PROTOCOL", "open-telemetry/exporter-otlp", "open-telemetry/transport-grpc", "otlp", "tracing", "grafana", "observability", "apm"]
summary: Install shopware/opentelemetry plus ext-opentelemetry and set OTEL_* env vars with an OTLP exporter to ship traces, logs and metrics to a collector.
lastBuilt: 2026-09-15
---
## What it is

OpenTelemetry is a vendor-neutral open standard for collecting distributed traces, metrics and logs. Shopware integrates with it through the separate `shopware/opentelemetry` Composer package, which can push data to commercial APM vendors or a self-hosted stack (Grafana, Tempo, Loki, Prometheus).

## When to use

When you want production tracing/metrics/logs from Shopware without a proprietary APM agent, or want to feed an OpenTelemetry Collector.

## Key steps / config

1. Requirements: PHP extension `ext-opentelemetry`; `ext-grpc` only when the transport is gRPC.
2. Install the bundle:

```bash
composer require shopware/opentelemetry
```

Symfony Flex creates `config/packages/prod/opentelemetry.yaml`, which enables the Shopware Profiler integration with OpenTelemetry in `prod` and routes Monolog output to OpenTelemetry.

3. Basic environment variables (auto-instrumentation + service name):

```text
OTEL_PHP_AUTOLOAD_ENABLED=true
OTEL_SERVICE_NAME=shopware
```

4. Exporter environment variables (example for an OpenTelemetry Collector over gRPC):

```text
OTEL_TRACES_EXPORTER=otlp
OTEL_LOGS_EXPORTER=otlp
OTEL_METRICS_EXPORTER=otlp
OTEL_EXPORTER_OTLP_PROTOCOL=grpc
OTEL_EXPORTER_OTLP_ENDPOINT=<collector URL, e.g. localhost port 4317>
```

5. For gRPC with OTLP, also install the Composer packages `open-telemetry/transport-grpc open-telemetry/exporter-otlp`.

Collected traces: Controller, Symfony HTTP Client, MySQL queries.

An example Grafana stack (Grafana, Loki, Prometheus, Tempo, OpenTelemetry Collector) is provided at https://github.com/shopware/opentelemetry/tree/main/docker; it uses the same env vars as above and is pre-configured to jump from logs to traces and back.

## Essential identifiers

- `shopware/opentelemetry`
- `config/packages/prod/opentelemetry.yaml`
- `ext-opentelemetry`, `ext-grpc`
- `OTEL_PHP_AUTOLOAD_ENABLED`, `OTEL_SERVICE_NAME`, `OTEL_TRACES_EXPORTER`, `OTEL_LOGS_EXPORTER`, `OTEL_METRICS_EXPORTER`, `OTEL_EXPORTER_OTLP_PROTOCOL`, `OTEL_EXPORTER_OTLP_ENDPOINT`
- `open-telemetry/transport-grpc`, `open-telemetry/exporter-otlp`

## Gotchas

- Shopware core itself registers no OpenTelemetry profiler backend; the `OpenTelemetry` integration only exists once `shopware/opentelemetry` is installed.
- gRPC transport needs both `ext-grpc` and the two `open-telemetry/*` Composer packages.
- The generated config only applies to the `prod` environment.

## Code check (6.7.13.0)
- confirmed `shopware.profiler` — core tags only Symfony, Tideways, Datadog, ServerTiming backends — vendor/shopware/core/Profiling/DependencyInjection/services.xml:10
- confirmed `shopware.profiler.integrations` — core default is empty list — vendor/shopware/core/Framework/Resources/config/packages/shopware.yaml:175
- unverified `shopware/opentelemetry` — separate package outside the checked vendor/shopware roots
- unverified `OTEL_PHP_AUTOLOAD_ENABLED` — read by the OpenTelemetry PHP SDK, out of scope
- unverified `OTEL_EXPORTER_OTLP_ENDPOINT` — OpenTelemetry SDK env var, out of scope
- unverified `config/packages/prod/opentelemetry.yaml` — created by Flex recipe, not in vendor/shopware roots
