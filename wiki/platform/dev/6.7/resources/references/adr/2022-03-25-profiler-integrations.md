---
id: platform/dev/6.7/resources/references/adr/2022-03-25-profiler-integrations.md
title: Profiler integrations
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2022-03-25-profiler-integrations.html
sourceHash: f429cac785eeccf955ffa13598108a418842b9ae
codeCheckedAgainst: "6.7.15.1"
keywords: ["Shopware\\Core\\Profiling\\Profiler", "Profiler::trace", "ProfilerInterface", "shopware.profiler.integrations", "shopware.profiler", "Tideways", "Datadog", "Symfony", "ServerTiming", "blackfire", "tracing", "spans", "performance profiling", "apm"]
summary: "ADR: Profiler::trace() wraps code in spans for Tideways, Datadog, Symfony Stopwatch or ServerTiming; enabled via shopware.profiler.integrations."
lastBuilt: 2026-10-21
---
## What it is

An architecture decision record (2022-03-25) introducing `Shopware\Core\Profiling\Profiler`, a static entry point that tells every enabled profiler integration to open a span around a given closure. It was built after performance benchmarks with Blackfire, Tideways and Datadog showed it was hard to get detailed traces under high load and hard to catch a "bad trace"; the application now feeds the profilers named spans itself.

## When to use

When you want a section of core or plugin code to show up as a named span in the timeline of an APM/profiler (Tideways, Datadog, the Symfony profiler), or when choosing which integrations are active in an environment.

## Key steps / config

1. Wrap code in a span with the static call; the closure's return value is passed through:

```php
use Shopware\Core\Profiling\Profiler;

return Profiler::trace('cart-calculation', function () use ($cart, $context) {
    // code to measure
});
```

Signature: `Profiler::trace(string $name, \Closure $closure, string $category = 'shopware', array $tags = [])`. Global tags added with `Profiler::addTag()` are merged into every span. For spans that cannot be expressed as a closure, `Profiler::start($title, $category, $tags)` / `Profiler::stop($title)` exist; spans left open are closed by `Profiler::cleanup()` on shutdown.

2. Enable integrations in `config/packages/*.yaml`:

```yaml
shopware:
    profiler:
        integrations: ['Symfony', 'Tideways', 'Datadog']
```

Available integration names (service tag `shopware.profiler`, attribute `integration`): `Symfony` (Stopwatch), `Tideways`, `Datadog`, `ServerTiming`. The core default is `integrations: []`; the `dev` environment config sets `['Symfony']`. The list is not deep-merged — an environment's list replaces the default.

3. Integrations implement `Shopware\Core\Profiling\Integration\ProfilerInterface` and are collected via `tagged_iterator('shopware.profiler', 'integration')`; `Profiler`'s constructor keeps only those named in `shopware.profiler.integrations`.

## Essential identifiers

- `Shopware\Core\Profiling\Profiler` — `trace()`, `start()`, `stop()`, `addTag()`, `removeTag()`
- `Shopware\Core\Profiling\Integration\ProfilerInterface`
- `shopware.profiler.integrations` (config key / container parameter)
- `shopware.profiler` (service tag, attribute `integration`)

## Gotchas

- `Profiler` and the integration classes are marked `@internal experimental atm`; the ADR still says the calls can be used in plugins.
- The ADR's `Profiler` snippet chains closures through a per-profiler `trace()` method; the installed `ProfilerInterface` instead declares `start()`/`stop()`, and `Profiler::trace()` calls `start()` on every profiler, runs the closure, then `stop()` in a `finally` block.
- The ADR shows `CartCalculator::calculate()` wrapping its work in `Profiler::trace('cart-calculation', ...)`; in 6.7.15.1 that span is opened in `CartMetricsInstrumentor` instead.

## Code check (6.7.15.1)
- confirmed `Profiler` — class, `@internal experimental atm` — vendor/shopware/core/Profiling/Profiler.php:12
- confirmed `Profiler::trace()` — same signature, category default `'shopware'` — vendor/shopware/core/Profiling/Profiler.php:58
- corrected `ProfilerInterface::start()` — docs: integrations expose `trace()` chained per profiler; interface now has `start()`/`stop()` — vendor/shopware/core/Profiling/Integration/ProfilerInterface.php:13
- confirmed `Profiler::addTag()` — global tags merged into each span — vendor/shopware/core/Profiling/Profiler.php:110
- confirmed `shopware.profiler.integrations` — passed to Profiler constructor — vendor/shopware/core/Profiling/DependencyInjection/services.php:46
- confirmed `integrations` — scalar array node, `performNoDeepMerging()` — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:1167
- confirmed `integrations` — core default `[]` — vendor/shopware/core/Framework/Resources/config/packages/shopware.yaml:186
- confirmed `shopware.profiler` — tag with `integration: Symfony` on Stopwatch — vendor/shopware/core/Profiling/DependencyInjection/services.php:24
- confirmed `Datadog` — tag `integration: Datadog` — vendor/shopware/core/Profiling/DependencyInjection/services.php:36
- corrected `cart-calculation` — docs: span opened in CartCalculator; now in CartMetricsInstrumentor — vendor/shopware/core/Checkout/Cart/Telemetry/CartMetricsInstrumentor.php:53
