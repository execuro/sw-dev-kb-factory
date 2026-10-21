---
id: platform/dev/6.7/guides/hosting/configurations/observability/profiling.md
title: Profiling / Tracing
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/hosting/configurations/observability/profiling.html
sourceHash: 26cbec96bc55b8e756f592eb5ca13821ffed0fd8
codeCheckedAgainst: "6.7.15.1"
keywords: ["profiler", "profiling", "tracing", "custom spans", "Shopware\\Core\\Profiling\\Profiler", "Profiler::trace", "ProfilerInterface", "shopware.profiler", "shopware.profiler.integrations", "datadog", "tideways", "opentelemetry", "stopwatch", "symfony profiler"]
summary: "Shopware profiler backends (Symfony, Datadog, Tideways, OpenTelemetry), custom spans via Profiler::trace and custom ProfilerInterface backends."
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/hosting/configurations/observability/opentelemetry.md"]
---
## What it is

Shopware ships a profiler abstraction (`Shopware\Core\Profiling\Profiler`) that measures the duration of code sections and publishes them to one or more profiler backends ("integrations"), such as the Symfony profiler bar, Datadog, Tideways or OpenTelemetry.

## When to use

- Enabling an APM/profiler backend for a Shopware installation.
- Wrapping your own code in custom spans so it shows up in the configured backends.
- Writing a new backend that receives Shopware's spans.

## Key steps / config

**Enable backends** in `config/packages/shopware.yaml`:

```yaml
shopware:
    profiler:
        integrations:
            - Symfony
            - Datadog        # requires the dd-trace PHP extension
            - Tideways       # requires the tideways PHP extension
            - OpenTelemetry  # requires the opentelemetry extension + shopware/opentelemetry
```

Only integrations named in this list are activated; the names match the `integration` attribute of services tagged `shopware.profiler`. Core registers `Symfony`, `Datadog`, `Tideways` and `ServerTiming`. The OpenTelemetry profiler is not installed by default (see [OpenTelemetry](platform/dev/6.7/guides/hosting/configurations/observability/opentelemetry.md)).

**Add a custom span** with the static `Profiler::trace(string $name, \Closure $closure, string $category = 'shopware', array $tags = [])`, which returns the closure's result:

```php
use Shopware\Core\Profiling\Profiler;

$value = Profiler::trace('my-example-trace', function () {
    return $myFunction();
});
```

`Profiler::start()` / `Profiler::stop()` are also available for spans that cannot be wrapped in a closure.

**Add a custom backend**: implement `Shopware\Core\Profiling\Integration\ProfilerInterface` and tag the service `shopware.profiler` with an `integration` attribute:

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

Then add `Console` to `shopware.profiler.integrations`.

## Essential identifiers

- `Shopware\Core\Profiling\Profiler` — `trace()`, `start()`, `stop()`
- `Shopware\Core\Profiling\Integration\ProfilerInterface` — `start(string $title, string $category, array $tags): void`, `stop(string $title): void`
- Service tag `shopware.profiler`, attribute `integration`
- Config key `shopware.profiler.integrations`
- Integration names: `Symfony`, `Datadog`, `Tideways`, `ServerTiming`, `OpenTelemetry` (external)

## Gotchas

- The docs say only the Stopwatch (Symfony profiler bar) backend is enabled by default. In 6.7.15.1 the core default for `shopware.profiler.integrations` is an empty list; only the `dev` environment config sets `['Symfony']`. In prod, nothing is traced until you list integrations.
- `integrations` is configured with no deep merging: a later config file replaces the whole list rather than appending to it.
- The source's example registers `App\Profiler::class` and echoes an undefined `$name`; use the fully qualified class (`App\Profiler\ConsoleProfiler`) and the `$title` parameter.
- The `Datadog` and `Tideways` integrations silently do nothing if their PHP extension classes are missing.
- `Profiler` and `ProfilerInterface` are marked `@internal experimental atm` in core.

## Code check (6.7.15.1)
- confirmed `Profiler::trace()` — static, signature `(string $name, \Closure $closure, string $category = 'shopware', array $tags = [])` — vendor/shopware/core/Profiling/Profiler.php:58
- confirmed `ProfilerInterface::start()` — `(string $title, string $category, array $tags): void` — vendor/shopware/core/Profiling/Integration/ProfilerInterface.php:13
- confirmed `ProfilerInterface::stop()` — `(string $title): void` — vendor/shopware/core/Profiling/Integration/ProfilerInterface.php:15
- confirmed `shopware.profiler` — tagged iterator keyed by `integration` attribute — vendor/shopware/core/Profiling/DependencyInjection/services.php:45
- corrected `profiler.integrations` — docs: Stopwatch enabled by default; core default is `[]` — vendor/shopware/core/Framework/Resources/config/packages/shopware.yaml:186
- confirmed `integrations` — dev environment sets `['Symfony']` — vendor/shopware/core/Framework/Resources/config/packages/dev/shopware.yaml:19
- confirmed `integrations` — array node with performNoDeepMerging — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:1167
- confirmed `ServerTiming` — additional core integration not named in the docs — vendor/shopware/core/Profiling/DependencyInjection/services.php:39
- confirmed `Tideways` — no-op unless `Tideways\Profiler` class exists — vendor/shopware/core/Profiling/Integration/Tideways.php:18
- unverified `OpenTelemetry` — integration provided by the external shopware/opentelemetry bundle, out of scope
