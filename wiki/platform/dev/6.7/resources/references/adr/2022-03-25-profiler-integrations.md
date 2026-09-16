---
id: platform/dev/6.7/resources/references/adr/2022-03-25-profiler-integrations.md
title: Profiler integrations
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2022-03-25-profiler-integrations.html
sourceHash: f429cac785eeccf955ffa13598108a418842b9ae
codeCheckedAgainst: "6.7.13.0"
keywords: ["Profiler::trace", "Shopware\\Core\\Profiling\\Profiler", "ProfilerInterface", "shopware.profiler.integrations", "shopware.profiler", "tideways", "datadog", "blackfire", "stopwatch", "profiling", "tracing spans", "performance"]
summary: "ADR: Shopware's static Profiler::trace() wraps code in spans for Tideways, Datadog, Symfony Stopwatch; enabled via shopware.profiler.integrations."
lastBuilt: 2026-09-15
---
## What it is

An architecture decision record describing Shopware's profiler integration: a static `Shopware\Core\Profiling\Profiler::trace()` call that makes every enabled profiling tool (Tideways, Datadog, Symfony Stopwatch) open a span around the code executed inside a closure. It was introduced because tools like Blackfire and Tideways made it hard to find bottlenecks or catch a "bad trace" under high load.

## When to use

- You want custom spans for your own plugin code to show up in the Tideways/Datadog timeline or the Symfony profiler.
- You need to choose which profiler integrations are active in an environment.

## Key steps / config

1. Wrap the code to measure in `Profiler::trace()`; the closure's return value is passed through:

```php
use Shopware\Core\Profiling\Profiler;

return Profiler::trace('cart-calculation', function () use ($cart, $context) {
    return $this->cartRuleLoader->loadByCart(/* ... */)->getCart();
});
```

   Signature in the installed code: `trace(string $name, \Closure $closure, string $category = 'shopware', array $tags = [])`. Core itself uses it, e.g. `CartCalculator::calculate()` with the span name `cart-calculation`.

2. Enable integrations in `config/packages/*.yaml`:

```yaml
shopware:
    profiler:
        integrations: ['Symfony', 'Tideways', 'Datadog']
```

   The names are the `integration` attribute of services tagged `shopware.profiler`: `Symfony` (Stopwatch), `Tideways`, `Datadog`, `ServerTiming`. The core default is `integrations: []`; the `dev` environment enables `['Symfony']`.

## Essential identifiers

- `Shopware\Core\Profiling\Profiler` — static `trace()`, `start()`, `stop()`
- `Shopware\Core\Profiling\Integration\ProfilerInterface` — `start(string $title, string $category, array $tags)`, `stop(string $title)`
- Integrations: `Shopware\Core\Profiling\Integration\Stopwatch`, `Tideways`, `Datadog`, `ServerTiming`
- DI tag `shopware.profiler` (attribute `integration`), parameter `shopware.profiler.integrations`

## Gotchas

- The class is marked `@internal experimental atm`, so its API is not covered by the backwards-compatibility promise.
- The ADR's snippet chains profilers by nesting `$profiler->trace(...)` closures; the installed `Profiler::trace()` instead calls `start()` on every active profiler, runs the closure, and calls `stop()` in a `finally` block. A custom integration therefore implements `start`/`stop`, not `trace`.
- Only integrations listed in `shopware.profiler.integrations` are active (the constructor intersects the tagged services with that list).

## Code check (6.7.13.0)
- confirmed `Shopware\Core\Profiling\Profiler` — class exists, marked internal/experimental — vendor/shopware/core/Profiling/Profiler.php:12
- confirmed `Profiler::trace()` — same signature as documented — vendor/shopware/core/Profiling/Profiler.php:58
- corrected `$profiler->start` — docs: chains nested profiler trace closures; code calls start/stop per profiler around the closure — vendor/shopware/core/Profiling/Profiler.php:64
- corrected `ProfilerInterface::start()` — docs: integrations expose trace(); interface declares start() and stop() — vendor/shopware/core/Profiling/Integration/ProfilerInterface.php:13
- confirmed `Profiler::$profilers` — filtered by active integrations list in constructor — vendor/shopware/core/Profiling/Profiler.php:44
- confirmed `shopware.profiler.integrations` — passed to the Profiler constructor — vendor/shopware/core/Profiling/DependencyInjection/services.xml:33
- confirmed `integrations` — scalar array config node, default empty list — vendor/shopware/core/Framework/Resources/config/packages/shopware.yaml:175
- confirmed `shopware.profiler` — tag with integration Symfony/Tideways/Datadog/ServerTiming — vendor/shopware/core/Profiling/DependencyInjection/services.xml:10
- confirmed `Profiler::trace('cart-calculation'` — used in CartCalculator — vendor/shopware/core/Checkout/Cart/CartCalculator.php:25
