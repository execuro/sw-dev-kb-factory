---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/resources/references/adr/2026-04-23-telemetry-v2-metrics-evolution.md
sourceHash: eac044bdd855c870c576985c9379f9f3b5935f6d
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2026-04-23-telemetry-v2-metrics-evolution.html
title: Telemetry v2 — Metrics Evolution
version: "6.7"
versions:
  - "6.7"
keywords: ["telemetry", "metrics", "MetricTransportInterface", "flush()", "TelemetryFlushListener", "shopware.telemetry.metrics.enabled", "shopware.telemetry.subscriber", "PeriodicMetricCollectorInterface", "telemetry.collect_periodic_metrics", "Telemetry::instrument()", "DurationMetric", "ConfiguredMetric", "label policy", "TELEMETRY_METRICS", "observability"]
summary: "ADR for telemetry v2: transport flush(), global kill-switch, subscriber tag, label policies, periodic metric collectors and the Telemetry facade."
lastBuilt: 2026-10-21
---
## What it is

An architecture decision record revising the experimental telemetry metrics layer (behind the `TELEMETRY_METRICS` feature flag) before its stabilisation in 6.8. It addresses unused config keys, the missing global kill-switch, subscribers running while telemetry is off, silent label stripping, the missing `flush()` lifecycle hook, and the lack of a way to collect expensive metrics. It also reaffirms `Meter::emit(ConfiguredMetric)` as the single low-level API, keeps `MetricTransportFactoryInterface` and the static `MeterProvider`, and leaves metric storage and pull/scrape handling to transports.

## When to use

- Writing or maintaining a metric transport (OpenTelemetry, Prometheus exporter).
- Emitting metrics from core or a plugin, measuring operation duration, or adding profiler spans.
- Defining metric labels in YAML, or operating telemetry (enable/disable, collection interval).

## Key steps / config

**Transports** implement both methods (`flush()` may be a no-op):

```php
interface MetricTransportInterface
{
    public function emit(Metric $metric): void;
    public function flush(): void;
}
```

`TelemetryFlushListener` calls `flush()` on all transports on `kernel.terminate` and `console.terminate`, and on `WorkerRunningEvent` at most once every 60 seconds (constructor argument, not a config key). `flush()` is not exposed on `Meter`.

**Global switch**: `shopware.telemetry.metrics.enabled` (default `false`). When false, `Meter::emit()` returns early, a compiler pass removes all services tagged `shopware.telemetry.subscriber` or `shopware.telemetry.periodic_metric_collector`, and `CollectPeriodicMetricsTask` reports `shouldRun() === false`. Toggling requires a container rebuild.

**Per-metric switch**: `enabled: false` on a definition makes `Meter` skip it; a closure value in `ConfiguredMetric` is then never invoked (lazy evaluation: `new ConfiguredMetric(name: '...', value: fn () => expensiveQuery())`).

**Labels**: every label needs either `allowed_values` or `policy: open` — both missing, or `allowed_values` plus `policy: open`, fails container build. Policies: `replace`, `discard`, `open`. Defaults: `replace` for counter, histogram, up-down counter; `discard` for gauge. Replacement string: `shopware.telemetry.metrics.replace_unknown_label_values_with` (default `'other'`). Unknown label names log an error in prod and throw `MissingMetricConfigurationException` in dev/test.

```yaml
definitions:
    http.requests.count:
        type: counter
        labels:
            method:
                allowed_values: ['GET', 'POST', 'PUT', 'DELETE']
            status_code:
                policy: open
```

**Periodic metrics**: implement `PeriodicMetricCollectorInterface::collect(): iterable` (returns `ConfiguredMetric`s); implementers are autoconfigured with the `shopware.telemetry.periodic_metric_collector` tag. The `telemetry.collect_periodic_metrics` scheduled task runs every 300 s by default (tune via the scheduled-task admin), wraps each collector in try/catch and emits via `Meter`.

**Instrumentation**: inject `Shopware\Core\Framework\Telemetry\Telemetry`:

```php
$this->telemetry->instrument(
    callback: fn() => $this->processPayment($order),
    metric: new DurationMetric('payment.process.duration', ['method' => 'card']),
    span: new Span('payment-processing'),
);
$this->telemetry->emit(new ConfiguredMetric('order.placed.count', 1, ['channel' => 'web']));
```

Duration is always milliseconds; define the metric as a histogram. Inject `Meter` when only pre-computed values are emitted.

## Essential identifiers

- `MetricTransportInterface::flush()`, `MetricTransportFactoryInterface`, `TransportConfig`
- `TelemetryFlushListener`, `WorkerRunningEvent`
- `shopware.telemetry.metrics.enabled`, `shopware.telemetry.metrics.replace_unknown_label_values_with`, `shopware.telemetry.metrics.namespace`
- `shopware.telemetry.subscriber`, `shopware.telemetry.periodic_metric_collector`
- `PeriodicMetricCollectorInterface`, `CollectPeriodicMetricsTask` (`telemetry.collect_periodic_metrics`)
- `Telemetry::instrument()`, `Telemetry::emit()`, `DurationMetric`, `Span`, `ConfiguredMetric`, `Meter::emit()`, `MeterProvider`

## Gotchas

- Tag your telemetry subscribers with `shopware.telemetry.subscriber`; untagged ones still run when telemetry is disabled.
- `instrument()` with neither metric nor span throws in dev/test; in prod it only runs the callback.
- Do not call `Profiler::trace()` directly in new code; route through `Telemetry`.
- `replace` can hide typos (`GETT` lands in `other`); in dev/test replacements are meant to be logged at notice level.
- Cardinality control for `policy: open` labels belongs to infrastructure (OTel Collector processors, Prometheus relabelling).
- The config keys `allow_unknown_labels`, `allow_unknown_label_values` and `enable_internal_metrics` are slated for removal; do not use them.

## Version notes

- Telemetry is experimental (`TELEMETRY_METRICS`, stable in 6.8.0). `shopware.telemetry.metrics.enabled` is an additional kill-switch that remains after the flag is removed.
- Adding `flush()` to `MetricTransportInterface` is a breaking change for transport packages, which must implement it.

## Code check (6.7.15.1)
- confirmed `MetricTransportInterface::flush()` — declared on the experimental interface — vendor/shopware/core/Framework/Telemetry/Metrics/MetricTransportInterface.php:25
- confirmed `TelemetryFlushListener::getSubscribedEvents()` — kernel/console terminate plus WorkerRunningEvent — vendor/shopware/core/Framework/Telemetry/Metrics/Subscriber/TelemetryFlushListener.php:40
- confirmed `DEFAULT_WORKER_FLUSH_INTERVAL_SECONDS` — 60 s worker flush throttle — vendor/shopware/core/Framework/Telemetry/Metrics/Subscriber/TelemetryFlushListener.php:21
- confirmed `CollectPeriodicMetricsTask::getDefaultInterval()` — 5 minutes, task name telemetry.collect_periodic_metrics, shouldRun reads shopware.telemetry.metrics.enabled — vendor/shopware/core/Framework/Telemetry/Metrics/ScheduledTask/CollectPeriodicMetricsTask.php:20
- confirmed `shopware.telemetry.subscriber` — compiler pass removes both tag groups when disabled — vendor/shopware/core/Framework/DependencyInjection/CompilerPass/TelemetrySubscriberCompilerPass.php:19
- confirmed `PeriodicMetricCollectorInterface::collect()` — returns iterable of ConfiguredMetric — vendor/shopware/core/Framework/Telemetry/Metrics/Metric/PeriodicMetricCollectorInterface.php:26
- confirmed `replace_unknown_label_values_with` — default 'other'; label validation requires allowed_values or policy open — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:1571
- confirmed `Telemetry::instrument()` — throws in dev/test without metric or span, emits duration in ms — vendor/shopware/core/Framework/Telemetry/Telemetry.php:53
- deprecated `allow_unknown_labels` — config node deprecated for removal in 6.8.0 — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:1558
- deprecated `enable_internal_metrics` — config node deprecated for removal in 6.8.0 (same for allow_unknown_label_values) — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:1566
