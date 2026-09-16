---
id: platform/dev/6.6/guides/hosting/configurations/observability/profiling.md
title: Profiling / Tracing
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/hosting/configurations/observability/profiling.html
sourceHash: d5ce6761a11f153b2c93be1f1c37edbd953b5681
keywords: ["profiling", "tracing", "Profiler", "Profiler::trace", "ProfilerInterface", "shopware.profiler", "shopware.profiler tag", "Stopwatch profiler", "Datadog", "Tideways", "OpenTelemetry profiler", "custom spans"]
summary: "Shopware's built-in Profiler abstraction measures code performance and publishes spans to configurable backends."
lastBuilt: "2026-09-15"
---
## What it is

Shopware provides a built-in profiler abstraction, `Shopware\Core\Profiling\Profiler`, to measure the performance of code parts and publish that data to a profiler backend.

## When to use

Use this to instrument custom code with spans, enable additional profiler backends (Datadog, Tideways, OpenTelemetry) beyond the default Stopwatch/Symfony Profiler Bar, or register a fully custom backend.

## Key steps / config

Enable additional profiler backends in `config/packages/shopware.yaml`:

```yaml
shopware:
    profiler:
        integrations:
            - Symfony
            - Datadog
            - Tideways
            - OpenTelemetry
```

`Datadog` requires the dd-trace PHP extension, `Tideways` requires the tideways extension, `OpenTelemetry` requires the opentelemetry extension (see [OpenTelemetry](platform/dev/6.6/guides/hosting/configurations/observability/opentelemetry.md)) and is not installed by default.

Add a custom span with `Shopware\Core\Profiling\Profiler::trace`:

```php
use Shopware\Core\Profiling\Profiler;

$value = Profiler::trace('my-example-trace', function () {
    return $myFunction();
});
```

To add a custom profiler backend, implement `Shopware\Core\Profiling\Integration\ProfilerInterface` and register it as a service tagged `shopware.profiler`, with an `integration` attribute identifying the backend, e.g.:

```xml
<service id="App\Profiler">
    <tag name="shopware.profiler" integration="Console"/>
</service>
```

## Essential identifiers

- `Shopware\Core\Profiling\Profiler::trace`
- `Shopware\Core\Profiling\Integration\ProfilerInterface`
- `shopware.profiler` service tag (attribute `integration`)
- `shopware.profiler.integrations` config list: `Symfony`, `Datadog`, `Tideways`, `OpenTelemetry`
