---
id: platform/dev/6.6/resources/references/adr/2022-03-25-profiler-integrations.md
title: Profiler integrations
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: "https://developer.shopware.com/docs/v6.6/resources/references/adr/2022-03-25-profiler-integrations.html"
sourceHash: f429cac785eeccf955ffa13598108a418842b9ae
keywords: ["profiler", "Profiler::trace", "Tideways", "Blackfire", "Datadog", "ProfilerInterface", "shopware.profiler.integrations", "tracing", "performance", "spans", "profiling", "core"]
summary: "Documents Shopware's Profiler::trace abstraction that forwards spans to Tideways, Datadog or Blackfire, configured via shopware.profiler.integrations."
lastBuilt: "2026-09-15"
---
## What it is

ADR documenting Shopware 6's `Profiler` abstraction, which lets the application signal tracing spans to external profiling tools (Blackfire, Tideways, Datadog) without hard-coding a single vendor's SDK into application code.

## When to use

Relevant when investigating performance bottlenecks under production load, or when adding instrumentation to core/plugin code that should show up as a named span in whichever profiler is currently enabled.

## Key steps / config

- Application code wraps the code to be measured in a closure and calls the static method `Shopware\Core\Profiling\Profiler::trace(string $name, \Closure $closure, string $category = 'shopware', array $tags = [])`.
- `Profiler` holds a static `$profilers` array of `ProfilerInterface` instances (only those listed as active) and a static `$tags` array that is added to every trace.
- Internally, `trace()` chains all active profilers around the closure — conceptually `Stopwatch::trace(Tideways::trace(...))` — so a single call can be forwarded to several tools at once.
- Which profilers are active is configured in `config/packages/*.yaml`:

```yaml
shopware:
    profiler:
        integrations: ['Symfony', 'Tideways', 'Datadog']
```

- Example call site, usable both in core and from plugins:

```php
Profiler::trace('cart-calculation', function () use ($cart, $context) {
    return $this->cartRuleLoader
        ->loadByCart($context, $cart, new CartBehavior($context->getPermissions()))
        ->getCart();
});
```

## Essential identifiers

- `Shopware\Core\Profiling\Profiler`
- `Profiler::trace()`
- `Shopware\Core\Profiling\Integration\ProfilerInterface`
- config key `shopware.profiler.integrations`

## Gotchas

The `Profiler` class is annotated `@internal experimental atm` in the source, signalling its API was not yet considered stable when this ADR was written. Traces produced this way are visible in the timeline view of whichever profiler tool is active, not in a separate Shopware-specific UI.
