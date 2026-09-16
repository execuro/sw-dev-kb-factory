---
id: platform/dev/6.7/resources/references/adr/2026-04-23-telemetry-v2-metrics-evolution.md
title: Telemetry v2 — Metrics Evolution
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2026-04-23-telemetry-v2-metrics-evolution.html
sourceHash: eac044bdd855c870c576985c9379f9f3b5935f6d
codeCheckedAgainst: "6.7.13.0"
keywords: ["telemetry", "metrics", "MetricTransportInterface", "TelemetryFlushListener", "shopware.telemetry.metrics.enabled", "shopware.telemetry.subscriber", "PeriodicMetricCollectorInterface", "telemetry.collect_periodic_metrics", "Telemetry::instrument()", "DurationMetric", "ConfiguredMetric", "label policy", "TELEMETRY_METRICS", "opentelemetry", "prometheus"]
summary: "ADR: telemetry metrics v2 adds transport flush(), global enabled switch, subscriber DI tag, label policies, periodic collectors and the Telemetry facade."
lastBuilt: 2026-09-15
---
## What it is

Architecture decision record (2026-04-23) revising the telemetry metrics abstraction (behind the experimental `TELEMETRY_METRICS` flag) before stabilisation in v6.8: lifecycle flushing, zero-overhead global disable, strict label validation, scheduled periodic collectors and a `Telemetry` facade. It re-affirms `Meter::emit(ConfiguredMetric)`, `MetricTransportFactoryInterface`, transport-owned storage and the static `MeterProvider`.

## When to use

- Writing or maintaining a metric transport (e.g. shopware/opentelemetry, shopware/prometheus-exporter).
- Emitting metrics or duration measurements from core or plugin code.
- Defining metric labels in YAML, or switching metrics off as an operator.

## Key steps / config

1. **Transports** implement `Shopware\Core\Framework\Telemetry\Metrics\MetricTransportInterface`: `emit(Metric $metric): void` and `flush(): void` (no-op if unused). `TelemetryFlushListener` calls `flush()` on `kernel.terminate` and `console.terminate`, and on `WorkerRunningEvent` at most every 60 s (constructor-overridable, no config key).
2. **Global off**: `shopware.telemetry.metrics.enabled` (default `false`). When false, `Meter::emit()` returns early, a compiler pass removes services tagged `shopware.telemetry.subscriber` and `shopware.telemetry.periodic_metric_collector`, and `CollectPeriodicMetricsTask::shouldRun()` returns false. Tag your own telemetry subscribers with `shopware.telemetry.subscriber`.
3. **Per-metric off**: a definition's `enabled: false` skips processing; closure values are never invoked.
4. **Lazy values**: `new ConfiguredMetric(name: '...', value: fn () => expensiveQuery())`.
5. **Labels**: every label needs `allowed_values` or `policy: open` (not both), otherwise the container fails to build. Policies: `replace` (default for counter, histogram, up-down counter), `discard` (default for gauge), `open`. Replacement string: `shopware.telemetry.metrics.replace_unknown_label_values_with` (default `'other'`). Unknown label names log an error in prod, throw `MissingMetricConfigurationException` in dev/test.

```yaml
definitions:
    http.requests.count:
        type: counter
        labels:
            method:
                allowed_values: ['GET', 'POST']
            status_code:
                policy: open
```

6. **Periodic collectors**: implement `PeriodicMetricCollectorInterface::collect(): iterable` (of `ConfiguredMetric`); autoconfiguration adds the tag. Scheduled task `telemetry.collect_periodic_metrics` runs every 300 s by default, tunable via scheduled-task administration; each collector is isolated by try/catch.
7. **Instrumentation**: inject `Shopware\Core\Framework\Telemetry\Telemetry`:

```php
$this->telemetry->instrument(
    callback: fn() => $this->processPayment($order),
    metric: new DurationMetric('payment.process.duration', ['method' => 'card']),
    span: new Span('payment-processing'),
);
$this->telemetry->emit(new ConfiguredMetric('order.placed.count', 1, ['channel' => 'web']));
```

Duration is always milliseconds; define the metric as a histogram. With neither metric nor span, `instrument()` throws in dev/test. Prefer it over calling `Profiler::trace()` directly.

## Essential identifiers

- `MetricTransportInterface::flush()`, `MetricTransportFactoryInterface`, `TransportConfig`
- `Meter::emit()`, `MeterProvider`, `ConfiguredMetric`, `TelemetryFlushListener`
- `shopware.telemetry.metrics.enabled`, `shopware.telemetry.metrics.replace_unknown_label_values_with`, `shopware.telemetry.metrics.namespace`
- DI tags `shopware.telemetry.subscriber`, `shopware.telemetry.periodic_metric_collector`
- `PeriodicMetricCollectorInterface`, `CollectPeriodicMetricsTask`, `telemetry.collect_periodic_metrics`
- `Telemetry::instrument()`, `Telemetry::emit()`, `DurationMetric`, `Span`

## Gotchas

- Metrics emit only if `shopware.telemetry.metrics.enabled` is true and `TELEMETRY_METRICS` is active.
- Subscriber removal happens at container build; toggling needs a rebuild.
- Cardinality control for `policy: open` labels belongs to infrastructure (OTel Collector, Prometheus relabeling).
- Config keys `allow_unknown_labels`, `allow_unknown_label_values`, `enable_internal_metrics` are deprecated (the ADR notes they were never read by PHP code).

## Version notes

- `Telemetry`, `Span`, `DurationMetric`, `PeriodicMetricCollectorInterface` are `@experimental feature:TELEMETRY_METRICS stableVersion:v6.8.0`; the three deprecated config keys are removed in 6.8.0.

## Code check (6.7.13.0)
- confirmed `MetricTransportInterface::flush()` — declared on the interface — vendor/shopware/core/Framework/Telemetry/Metrics/MetricTransportInterface.php:25
- confirmed `TelemetryFlushListener::getSubscribedEvents()` — kernel/console terminate plus `WorkerRunningEvent`, 60 s default — vendor/shopware/core/Framework/Telemetry/Metrics/Subscriber/TelemetryFlushListener.php:40
- confirmed `metrics.enabled` — boolean, default false — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:1525
- confirmed `metrics.replace_unknown_label_values_with` — default `'other'` — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:1526
- confirmed `shopware.telemetry.subscriber` — removed with periodic collector tag when disabled — vendor/shopware/core/Framework/DependencyInjection/CompilerPass/TelemetrySubscriberCompilerPass.php:19
- confirmed `CollectPeriodicMetricsTask::getDefaultInterval()` — `5 * MINUTELY`; `shouldRun()` reads enabled — vendor/shopware/core/Framework/Telemetry/Metrics/ScheduledTask/CollectPeriodicMetricsTask.php:20
- confirmed `Telemetry::instrument()` — throws in dev/test without metric and span — vendor/shopware/core/Framework/Telemetry/Telemetry.php:52
- confirmed `labels.policy` — label must have `allowed_values` or `policy: open`, not both — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:1559
- deprecated `metrics.allow_unknown_labels` — also `allow_unknown_label_values`, `enable_internal_metrics`; removal in 6.8.0 — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:1513
- confirmed `Meter::emit()` — returns early unless enabled and `TELEMETRY_METRICS` active — vendor/shopware/core/Framework/Telemetry/Metrics/Meter.php:38
