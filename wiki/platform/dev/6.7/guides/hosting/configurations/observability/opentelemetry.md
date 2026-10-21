---
id: platform/dev/6.7/guides/hosting/configurations/observability/opentelemetry.md
title: OpenTelemetry
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/hosting/configurations/observability/opentelemetry.html
sourceHash: 159bf29e5a07694bef478eeae3fd0692b6cbb131
codeCheckedAgainst: "6.7.15.1"
keywords: ["opentelemetry", "otel", "shopware/opentelemetry", "ext-opentelemetry", "ext-grpc", "OTEL_PHP_AUTOLOAD_ENABLED", "OTEL_SERVICE_NAME", "OTEL_TRACES_EXPORTER", "OTEL_EXPORTER_OTLP_ENDPOINT", "otlp", "tracing", "observability", "grafana tempo loki prometheus", "shopware.profiler.integrations"]
summary: Install shopware/opentelemetry and set OTEL_* env vars to export traces, logs and metrics via OTLP (gRPC) to a collector such as the Grafana stack.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/hosting/configurations/observability/profiling.md"]
---
## What it is

OpenTelemetry is an open-source, vendor-neutral standard for collecting distributed traces, metrics and logs. Shopware integrates with it through the separate `shopware/opentelemetry` bundle, which hooks into Shopware's profiler abstraction and routes Monolog output to OpenTelemetry. The collected data can be pushed to a commercial vendor (NewRelic, Datadog, etc.) or to self-hosted tooling such as the Grafana stack (Tempo, Loki, Prometheus, Grafana).

## When to use

Use this when a production Shopware instance needs traces, logs and metrics exported to an OpenTelemetry Collector or compatible backend, instead of (or in addition to) vendor-specific profilers like Tideways or Datadog.

## Key steps / config

1. Requirements: PHP extension `ext-opentelemetry`; `ext-grpc` additionally when the transport is gRPC.
2. Install the bundle:
   `composer require shopware/opentelemetry`
   Symfony Flex creates `config/packages/prod/opentelemetry.yaml`, which enables the Shopware profiler integration with OpenTelemetry in the `prod` environment and directs Monolog output to OpenTelemetry.
3. Basic environment variables (auto-instrumentation + service name):
   ```text
   OTEL_PHP_AUTOLOAD_ENABLED=true
   OTEL_SERVICE_NAME=shopware
   ```
4. Exporter configuration for an OpenTelemetry Collector over gRPC:
   ```text
   OTEL_TRACES_EXPORTER=otlp
   OTEL_LOGS_EXPORTER=otlp
   OTEL_METRICS_EXPORTER=otlp
   OTEL_EXPORTER_OTLP_PROTOCOL=grpc
   OTEL_EXPORTER_OTLP_ENDPOINT=<collector gRPC endpoint, source example: localhost port 4317>
   ```
5. For gRPC with OTLP, also install the composer packages `open-telemetry/transport-grpc` and `open-telemetry/exporter-otlp`.

Collected traces: Controller, Symfony HTTP Client, MySQL queries.

Example stack: the `docker` directory of the `shopware/opentelemetry` GitHub repository ships Grafana (dashboard), Loki (logs), Prometheus (metrics), Tempo (traces) and an OpenTelemetry Collector that batches all data to storage. It needs the same seven `OTEL_*` variables listed above plus the two gRPC/OTLP composer packages. The bundled Grafana is pre-configured with the data sources and supports jumping from logs to traces and back.

## Essential identifiers

- `shopware/opentelemetry` (composer package)
- `ext-opentelemetry`, `ext-grpc`
- `config/packages/prod/opentelemetry.yaml`
- `OTEL_PHP_AUTOLOAD_ENABLED`, `OTEL_SERVICE_NAME`
- `OTEL_TRACES_EXPORTER`, `OTEL_LOGS_EXPORTER`, `OTEL_METRICS_EXPORTER`, `OTEL_EXPORTER_OTLP_PROTOCOL`, `OTEL_EXPORTER_OTLP_ENDPOINT`
- `open-telemetry/transport-grpc`, `open-telemetry/exporter-otlp`
- `shopware.profiler.integrations` (core profiler activation list)

## Gotchas

- The OpenTelemetry profiler integration is not part of Shopware core: core 6.7.15.1 only registers the `Symfony`, `Tideways`, `Datadog` and `ServerTiming` profiler integrations. The `OpenTelemetry` integration name only exists once `shopware/opentelemetry` is installed.
- The Flex-generated config lives in `config/packages/prod/`, so it only applies with `APP_ENV=prod`. Core's own default for `shopware.profiler.integrations` is an empty list; the `dev` environment enables `['Symfony']`.
- gRPC transport fails without both `ext-grpc` and the two `open-telemetry/*` composer packages.

## Code check (6.7.15.1)
- unverified `shopware/opentelemetry` — separate composer bundle, not part of the checked core/storefront/administration roots
- unverified `OTEL_PHP_AUTOLOAD_ENABLED` — read by the OpenTelemetry PHP SDK, out of scope (same for the other `OTEL_*` variables)
- unverified `config/packages/prod/opentelemetry.yaml` — created by the bundle's Flex recipe, out of scope
- confirmed `shopware.profiler.integrations` — Profiler receives only the integrations listed here — vendor/shopware/core/Profiling/DependencyInjection/services.php:46
- confirmed `profiler.integrations` — core default is an empty list — vendor/shopware/core/Framework/Resources/config/packages/shopware.yaml:186
- confirmed `shopware.profiler` — tag used to collect profiler integrations by `integration` attribute — vendor/shopware/core/Profiling/DependencyInjection/services.php:45
- confirmed `Datadog` — one of the core-registered integrations (with Symfony, Tideways, ServerTiming; no OpenTelemetry) — vendor/shopware/core/Profiling/DependencyInjection/services.php:36
- confirmed `telemetry.metrics.namespace` — core metrics namespace is `io.opentelemetry.contrib.php.shopware` — vendor/shopware/core/Framework/Resources/config/packages/telemetry.yaml:4
