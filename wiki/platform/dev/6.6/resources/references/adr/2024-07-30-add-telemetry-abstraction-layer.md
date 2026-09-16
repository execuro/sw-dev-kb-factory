---
id: platform/dev/6.6/resources/references/adr/2024-07-30-add-telemetry-abstraction-layer.md
title: Telemetry abstraction layer
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: "https://developer.shopware.com/docs/v6.6/resources/references/adr/2024-07-30-add-telemetry-abstraction-layer.html"
sourceHash: "11aeb9c26f6f5a232ad6921f68f23ba754bb803f"
keywords: ["telemetry abstraction layer", "MetricTransportInterface", "MetricInterface", "MetricNotSupportedException", "Counter", "Gauge", "Histogram", "UpDownCounter", "observability", "monitoring integration", "events subsystem"]
summary: "ADR adding a telemetry abstraction layer with `MetricTransportInterface`/`MetricInterface` so external tools can consume Shopware metrics."
lastBuilt: "2026-09-15"
---
## What it is
This ADR documents introducing a telemetry abstraction layer that provides a common interface for integrating different observability/monitoring tools into the Shopware platform.

## When to use
Relevant when implementing a transport that forwards Shopware metrics to a monitoring backend (e.g. Datadog), or when hooking into Shopware's events subsystem to capture telemetry data.

## Key steps / config
The layer has three parts:

- Shopware's abstraction layer: defines the methods and data structures for sending telemetry data to a backend.
- Events subsystem attachment: integrates the abstraction layer with the existing events subsystem so developers can capture telemetry from specific events.
- Transport layer (integrations): vendor-specific backends are not part of core; they ship as external libraries implementing the abstraction, with core documenting the integration contract.

Every transport should recognize at least these metric types, defined under the `Shopware\Core\Framework\Telemetry\Metrics\Metric` namespace: `Shopware\Core\Framework\Telemetry\Metrics\Metric\Counter`, `Shopware\Core\Framework\Telemetry\Metrics\Metric\Gauge`, `Shopware\Core\Framework\Telemetry\Metrics\Metric\Histogram`, `Shopware\Core\Framework\Telemetry\Metrics\Metric\UpDownCounter`.

A transport implements `MetricTransportInterface`, whose `emit()` method accepts a `MetricInterface`:

```php
interface MetricTransportInterface
{
    /**
     * @throws MetricNotSupportedException
     */
    public function emit(MetricInterface $metric): void;
}
```

`MetricInterface` is a deliberately empty/generic interface, letting monitoring tools define their own metric structures alongside the core ones. If a transport receives an unsupported metric type, it throws `MetricNotSupportedException`, which is handled gracefully — the application skips the unsupported metric rather than failing.

## Essential identifiers
- `MetricTransportInterface::emit()`
- `MetricInterface`
- `MetricNotSupportedException`
- `Shopware\Core\Framework\Telemetry\Metrics\Metric` namespace

## Gotchas
Vendor-specific metric transports are intentionally kept out of core and shipped as separate libraries, so any given Shopware installation only gets telemetry export if such a transport library is installed and implements `MetricTransportInterface` itself.
