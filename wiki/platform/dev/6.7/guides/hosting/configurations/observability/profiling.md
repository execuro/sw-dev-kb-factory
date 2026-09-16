---
codeCheckedAgainst: "6.7.13.0"
docType: developer
id: platform/dev/6.7/guides/hosting/configurations/observability/profiling.md
sourceHash: 26cbec96bc55b8e756f592eb5ca13821ffed0fd8
sourceUrl: https://developer.shopware.com/docs/guides/hosting/configurations/observability/profiling.html
title: Profiling / Tracing
version: "6.7"
versions:
  - "6.7"
keywords: ["Shopware\\Core\\Profiling\\Profiler", "Profiler::trace", "ProfilerInterface", "shopware.profiler", "shopware.profiler.integrations", "Stopwatch", "Datadog", "Tideways", "OpenTelemetry", "profiling", "tracing", "custom spans", "profiler backend"]
summary: "Shopware profiler: enable backends in shopware.profiler.integrations, add spans via Profiler::trace, custom backends via ProfilerInterface."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/hosting/configurations/observability/opentelemetry.md"]
---
## What it is

Shopware has a built-in profiler abstraction (`Shopware\Core\Profiling\Profiler`) that measures code sections and forwards start/stop events to every enabled profiler backend (Symfony Stopwatch, Datadog, Tideways, OpenTelemetry, ServerTiming, or custom ones).

## When to use

When you want Shopware spans to show up in an APM/profiler, need custom spans around your own code, or want to plug in a new profiler backend.

## Key steps / config

1. Enable backends in `config/packages/shopware.yaml`:

```yaml
shopware:
    profiler:
        integrations:
            - Symfony
            - Datadog        # requires the dd-trace PHP extension
            - Tideways       # requires the tideways PHP extension
            - OpenTelemetry  # requires the opentelemetry PHP extension + shopware/opentelemetry
```

Core also registers a `ServerTiming` backend. The OpenTelemetry backend is not installed by default, see [OpenTelemetry](platform/dev/6.7/guides/hosting/configurations/observability/opentelemetry.md).

2. Add a custom span:

```php
use Shopware\Core\Profiling\Profiler;

$value = Profiler::trace('my-example-trace', function () {
    return $myFunction();
});
```

Full signature: `Profiler::trace(string $name, \Closure $closure, string $category = 'shopware', array $tags = [])`. `Profiler::start()`/`Profiler::stop()` exist for non-closure use.

3. Add a custom backend: implement `Shopware\Core\Profiling\Integration\ProfilerInterface` and tag the service `shopware.profiler` with an `integration` attribute:

```php
namespace App\Profiler;

use Shopware\Core\Profiling\Integration\ProfilerInterface;

class ConsoleProfiler implements ProfilerInterface
{
    public function start(string $title, string $category, array $tags): void { echo "Start $title\n"; }

    public function stop(string $title): void { echo "Stop $title\n"; }
}
```

```php
$services->set(App\Profiler\ConsoleProfiler::class)
    ->tag('shopware.profiler', ['integration' => 'Console']);
```

The `integration` attribute value is the name you list under `shopware.profiler.integrations`.

## Essential identifiers

- `Shopware\Core\Profiling\Profiler` (`trace`, `start`, `stop`, `addTag`, `removeTag`)
- `Shopware\Core\Profiling\Integration\ProfilerInterface` (`start`, `stop`)
- Service tag `shopware.profiler`, attribute `integration`
- Config `shopware.profiler.integrations`
- Core backends: `Symfony` (Stopwatch), `Tideways`, `Datadog`, `ServerTiming`

## Gotchas

- The docs say only the Stopwatch (Symfony) profiler is enabled by default; in code the default `integrations` list is empty, and only the `dev` environment config enables `['Symfony']`.
- The docs' example uses an undefined `$name` inside the methods and registers `App\Profiler::class`; use `$title` and the concrete class name.
- `Profiler` and `ProfilerInterface` are marked `@internal experimental atm`.
- `integrations` uses no deep merging: a project list replaces the default, it is not appended.

## Code check (6.7.13.0)
- confirmed `ProfilerInterface::start()` — `start(string $title, string $category, array $tags): void` — vendor/shopware/core/Profiling/Integration/ProfilerInterface.php:13
- confirmed `ProfilerInterface::stop()` — `stop(string $title): void` — vendor/shopware/core/Profiling/Integration/ProfilerInterface.php:15
- confirmed `Profiler::trace()` — static, with optional category/tags — vendor/shopware/core/Profiling/Profiler.php:58
- confirmed `shopware.profiler` — tagged_iterator indexed by `integration` — vendor/shopware/core/Profiling/DependencyInjection/services.xml:32
- corrected `shopware.profiler.integrations` — docs: Stopwatch enabled by default; core default is `[]` — vendor/shopware/core/Framework/Resources/config/packages/shopware.yaml:175
- confirmed `integrations` — dev env enables `['Symfony']` — vendor/shopware/core/Framework/Resources/config/packages/dev/shopware.yaml:16
- confirmed `Stopwatch` — registered as integration `Symfony` — vendor/shopware/core/Profiling/DependencyInjection/services.xml:7
- confirmed `ServerTiming` — additional core backend not named in docs — vendor/shopware/core/Profiling/DependencyInjection/services.xml:27
- confirmed `integrations` — performNoDeepMerging — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:1131
- unverified `OpenTelemetry` — backend shipped by shopware/opentelemetry, outside checked roots
