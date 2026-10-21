---
id: platform/dev/6.7/resources/references/adr/2024-07-30-add-telemetry-abstraction-layer.md
title: Telemetry abstraction layer
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2024-07-30-add-telemetry-abstraction-layer.html
sourceHash: 11aeb9c26f6f5a232ad6921f68f23ba754bb803f
codeCheckedAgainst: "6.7.15.1"
keywords: ["MetricTransportInterface", "MetricNotSupportedException", "Shopware\\Core\\Framework\\Telemetry\\Metrics\\Metric", "MetricTransportFactoryInterface", "TELEMETRY_METRICS", "Meter", "telemetry", "metrics", "observability", "monitoring", "opentelemetry", "datadog", "metric transport"]
summary: "ADR: core telemetry abstraction; external transports implement MetricTransportInterface (emit, flush) for Metric objects. Experimental in 6.7."
lastBuilt: 2026-10-21
---
## What it is

Architecture decision record (2024-07-30) introducing a telemetry abstraction layer in Shopware core: a common interface for sending metrics and performance data to any monitoring backend. It has three parts: Shopware's abstraction layer (interfaces and data structures), an attachment to the existing events subsystem (so developers can capture telemetry for specific events), and a transport layer. Vendor-specific transports are not part of core; they ship as external libraries implementing the abstraction, and core documents how to integrate them.

## When to use

- You write or evaluate a metrics transport (e.g. for an OpenTelemetry- or Datadog-style backend) for Shopware.
- You need to know what a transport must implement and how unsupported metrics are handled.

## Key steps / config

In 6.7.15.1 the layer lives under `Shopware\Core\Framework\Telemetry\Metrics` and is experimental behind the feature flag `TELEMETRY_METRICS` (default `false`, toggleable; stable planned for v6.8.0). `Meter::emit()` does nothing unless the meter is enabled and the flag is active.

A transport implements `Shopware\Core\Framework\Telemetry\Metrics\MetricTransportInterface`:

```php
class MyTransport implements MetricTransportInterface
{
    /** @throws MetricNotSupportedException */
    public function emit(Metric $metric): void { /* send */ }

    // called on kernel.terminate / console.terminate; no-op if not needed
    public function flush(): void { /* ... */ }
}
```

- The value object is the readonly class `Shopware\Core\Framework\Telemetry\Metrics\Metric\Metric` with `name`, `value`, `labels`, `type`, `description`, `unit`.
- Its `type` is the backed enum `Shopware\Core\Framework\Telemetry\Metrics\Metric\Type` (four cases, see Code check) — a transport should cover every case of that enum.
- Throw `MetricNotSupportedException` (error code `TELEMETRY__METRIC_NOT_SUPPORTED`) for a metric type the transport cannot handle.
- Transports are created through `MetricTransportFactoryInterface::create(TransportConfig $transportConfig)`.

## Essential identifiers

- `Shopware\Core\Framework\Telemetry\Metrics\MetricTransportInterface` (`emit()`, `flush()`)
- `Shopware\Core\Framework\Telemetry\Metrics\Metric\Metric`, `Shopware\Core\Framework\Telemetry\Metrics\Metric\Type`
- `Shopware\Core\Framework\Telemetry\Metrics\Exception\MetricNotSupportedException`
- `Shopware\Core\Framework\Telemetry\Metrics\Factory\MetricTransportFactoryInterface`
- `Shopware\Core\Framework\Telemetry\Metrics\Meter`
- Feature flag `TELEMETRY_METRICS`

## Gotchas

- The ADR lists per-type classes `Shopware\Core\Framework\Telemetry\Metrics\Metric\Counter`, `...\Gauge`, `...\Histogram`, `...\UpDownCounter`; none exist in 6.7.15.1 — the kind of metric is a `Type` enum case (`histogram`, `gauge`, `counter`, `updown_counter`) on a single `Metric` class.
- The ADR's empty marker interface `MetricInterface` does not exist; `emit()` takes `Metric`, and the interface additionally requires `flush()`.
- "Gracefully handled" applies only outside dev/test: `Meter` logs a warning for a failing transport (including `MetricNotSupportedException`) and skips it, but rethrows in the `dev` and `test` environments.
- The ADR points to a README under `src/Core/Framework/Telemetry/` for usage details.

## Version notes

- 6.7: experimental (`@experimental feature:TELEMETRY_METRICS stableVersion:v6.8.0`); enable the flag to emit metrics.

## Code check (6.7.15.1)
- absent `Shopware\Core\Framework\Telemetry\Metrics\Metric\Counter` — no such class; counter is `Type::COUNTER`
- absent `Shopware\Core\Framework\Telemetry\Metrics\Metric\Gauge` — no such class; gauge is `Type::GAUGE`
- absent `Shopware\Core\Framework\Telemetry\Metrics\Metric\Histogram` — no such class; histogram is `Type::HISTOGRAM`
- absent `Shopware\Core\Framework\Telemetry\Metrics\Metric\UpDownCounter` — no such class; up-down counter is `Type::UPDOWN_COUNTER`
- absent `MetricInterface` — not found in the installed core
- corrected `MetricTransportInterface::emit()` — docs: `emit(MetricInterface $metric)`; code takes `Metric` — vendor/shopware/core/Framework/Telemetry/Metrics/MetricTransportInterface.php:18
- corrected `MetricTransportInterface::flush()` — docs: interface has only `emit`; `flush()` is also required — vendor/shopware/core/Framework/Telemetry/Metrics/MetricTransportInterface.php:25
- confirmed `Type` — backed enum with cases histogram, gauge, counter, updown_counter — vendor/shopware/core/Framework/Telemetry/Metrics/Metric/Type.php:13
- confirmed `MetricNotSupportedException` — error code `TELEMETRY__METRIC_NOT_SUPPORTED` — vendor/shopware/core/Framework/Telemetry/Metrics/Exception/MetricNotSupportedException.php:15
- confirmed `TELEMETRY_METRICS` — feature flag, default false, checked in `Meter::emit()` — vendor/shopware/core/Framework/Resources/config/packages/feature.yaml:29
