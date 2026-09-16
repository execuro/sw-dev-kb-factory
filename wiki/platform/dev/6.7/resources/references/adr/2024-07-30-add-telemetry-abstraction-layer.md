---
id: platform/dev/6.7/resources/references/adr/2024-07-30-add-telemetry-abstraction-layer.md
title: Telemetry abstraction layer
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2024-07-30-add-telemetry-abstraction-layer.html
sourceHash: 11aeb9c26f6f5a232ad6921f68f23ba754bb803f
codeCheckedAgainst: "6.7.13.0"
keywords: ["MetricTransportInterface", "MetricNotSupportedException", "Shopware\\Core\\Framework\\Telemetry\\Metrics\\Metric", "Metric", "Type", "Meter", "TELEMETRY_METRICS", "telemetry", "metrics", "observability", "monitoring", "transport", "opentelemetry", "datadog"]
summary: "Telemetry abstraction layer; transports implement MetricTransportInterface emit(Metric)/flush() and throw MetricNotSupportedException for unsupported types."
lastBuilt: 2026-09-15
---
## What it is

An architecture decision record (2024-07-30, area core) introducing a vendor-neutral telemetry abstraction layer in core so any observability backend can be integrated. It has three parts: Shopware's abstraction (common interface and data structures), attachment to the events subsystem (capture telemetry around events), and transport layers (integrations) shipped as external libraries, not in core.

## When to use

- You are writing or reviewing a metrics transport (e.g. for an APM/monitoring vendor) for Shopware.
- You need to know which metric types a transport must handle and how unsupported ones are reported.

## Key steps / config

1. Implement `Shopware\Core\Framework\Telemetry\Metrics\MetricTransportInterface` in your integration. In 6.7.13.0 it declares two methods:

```php
interface MetricTransportInterface
{
    /** @throws MetricNotSupportedException */
    public function emit(Metric $metric): void;
    public function flush(): void; // called on kernel.terminate / console.terminate; no-op if unneeded
}
```

2. `emit()` receives a concrete `Shopware\Core\Framework\Telemetry\Metrics\Metric\Metric` (readonly: `name`, `value`, `labels`, `type`, `description`, `unit`). Metric kinds are not separate classes but the enum `Shopware\Core\Framework\Telemetry\Metrics\Metric\Type`: `HISTOGRAM`, `GAUGE`, `COUNTER`, `UPDOWN_COUNTER`. Aim to cover all of them.
3. For an unsupported type, throw `Shopware\Core\Framework\Telemetry\Metrics\Exception\MetricNotSupportedException`.
4. Transports are created via `MetricTransportFactoryInterface::create(TransportConfig)`; metrics are emitted through `Meter::emit(ConfiguredMetric)`, which only runs when the meter is enabled and the `TELEMETRY_METRICS` feature flag is active.
5. Implementation/usage details live in the core `Framework/Telemetry` README.

## Essential identifiers

- `Shopware\Core\Framework\Telemetry\Metrics\MetricTransportInterface` (`emit()`, `flush()`)
- `Shopware\Core\Framework\Telemetry\Metrics\Metric\Metric`, `Shopware\Core\Framework\Telemetry\Metrics\Metric\Type`
- `Shopware\Core\Framework\Telemetry\Metrics\Exception\MetricNotSupportedException`
- `Shopware\Core\Framework\Telemetry\Metrics\Factory\MetricTransportFactoryInterface`, `Meter`
- `TELEMETRY_METRICS`

## Gotchas

- The ADR lists metric object classes `Counter`, `Gauge`, `Histogram`, `UpDownCounter` and a generic empty `MetricInterface`; none exist in 6.7.13.0 — use `Metric` plus its `Type`.
- The ADR says `MetricNotSupportedException` is gracefully skipped. `Meter` logs a warning and continues only outside `dev`/`test`; in those environments the exception is rethrown.
- The metrics API is `@experimental feature:TELEMETRY_METRICS stableVersion:v6.8.0`; the flag defaults to `false`.

## Code check (6.7.13.0)
- absent `Shopware\Core\Framework\Telemetry\Metrics\Metric\Counter` — replaced by enum case Type::COUNTER
- absent `Shopware\Core\Framework\Telemetry\Metrics\Metric\Gauge` — replaced by enum case Type::GAUGE
- absent `Shopware\Core\Framework\Telemetry\Metrics\Metric\Histogram` — replaced by enum case Type::HISTOGRAM
- absent `Shopware\Core\Framework\Telemetry\Metrics\Metric\UpDownCounter` — replaced by enum case Type::UPDOWN_COUNTER
- absent `MetricInterface` — no such interface; emit() takes Metric
- corrected `MetricTransportInterface::emit()` — docs: emit(MetricInterface $metric) — vendor/shopware/core/Framework/Telemetry/Metrics/MetricTransportInterface.php:18
- confirmed `MetricTransportInterface::flush()` — second required method — vendor/shopware/core/Framework/Telemetry/Metrics/MetricTransportInterface.php:25
- confirmed `Type` — enum with histogram, gauge, counter, updown_counter — vendor/shopware/core/Framework/Telemetry/Metrics/Metric/Type.php:11
- confirmed `MetricNotSupportedException` — exception class extending TelemetryException — vendor/shopware/core/Framework/Telemetry/Metrics/Exception/MetricNotSupportedException.php:15
- corrected `MetricNotSupportedException` — docs: always gracefully skipped; rethrown in dev/test — vendor/shopware/core/Framework/Telemetry/Metrics/Meter.php:82
