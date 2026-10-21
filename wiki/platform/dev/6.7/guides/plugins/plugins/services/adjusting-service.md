---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/guides/plugins/plugins/services/adjusting-service.md
relatedPages:
  - platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md
  - platform/dev/6.7/guides/development/tooling/shopware-toolbox.md
  - platform/dev/6.7/guides/plugins/plugins/framework/extension/_index.md
  - platform/dev/6.7/guides/plugins/plugins/framework/extension/extension-vs-events.md
sourceHash: e5270f74d902a8cc04d0bd4bb85eb1d28d823f2e
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/services/adjusting-service.html
title: Adjusting a Service
version: "6.7"
versions:
  - "6.7"
keywords: ["service decoration", "decorate", ".inner", "getDecorated", "DecorationPatternException", "AbstractExampleService", "decorator", "decorator chain", "override service", "abstract class contract", "debug:container", "addExtension"]
summary: "Decorate a Shopware service: ->decorate() with service('.inner'), an abstract contract with getDecorated(), DecorationPatternException, chain pitfalls."
lastBuilt: 2026-10-21
---
## What it is

How to change the behavior of an existing service via Symfony service decoration. Decoratable Shopware services expose an abstract class (not an interface) as their contract; it declares `getDecorated()` so decorators form a chain and new non-abstract methods can be added without breaking decorators.

## When to use

You need to change how an existing service behaves and there is no designed extension point. Prefer events to react to something Shopware does, and prefer [extension points](platform/dev/6.7/guides/plugins/plugins/framework/extension/_index.md) (subscribed as `.pre`, `.post`, `.error` events) where they exist — see [Extension Points vs Events](platform/dev/6.7/guides/plugins/plugins/framework/extension/extension-vs-events.md).

## Key steps / config

1. Register the decorator in `src/Resources/config/services.php`, pointing at the decorated service and injecting the original via `.inner`:
   ```php
   $services->set(ExampleServiceDecorator::class)
       ->decorate(ExampleService::class)
       ->args([service('.inner')]);
   ```
2. Contract (usually from core or the plugin you extend):
   ```php
   abstract class AbstractExampleService
   {
       abstract public function getDecorated(): AbstractExampleService;
       abstract public function doSomething(): string;
   }
   ```
3. The base implementation's `getDecorated()` throws `Shopware\Core\Framework\Plugin\Exception\DecorationPatternException` (`throw new DecorationPatternException(self::class);`).
4. The decorator extends the abstract class, takes `AbstractExampleService $exampleService` in its constructor, returns it from `getDecorated()`, and delegates: `return $this->decoratedService->doSomething() . ' Did something additionally.';`

**Adding methods to a contract:** add them as regular public methods that delegate, e.g. `public function doSomethingNew(): string { return $this->getDecorated()->doSomethingNew(); }`, implement them in each service/decorator step by step, and only make them abstract in a later release.

## Essential identifiers

- `->decorate(<service id>)`, `service('.inner')`
- `getDecorated()`
- `Shopware\Core\Framework\Plugin\Exception\DecorationPatternException`
- `bin/console debug:container --show-arguments <service-id>`

## Gotchas

- Decorators nest: plugin B wraps plugin A, which wraps core. A decorator that does not call the inner service silently drops the rest of the chain, including core logic and other plugins. There is no runtime warning; inspect the chain with `debug:container` or the IDE's implementations view.
- Every implementation must share the abstract method's signature; adding even an optional parameter breaks all decorators (in practice one plugin major per Shopware major).
- Type-hint the abstract class, never the concrete implementation, in constructors — otherwise the decoration chain is bypassed. The [Shopware 6 Toolbox](platform/dev/6.7/guides/development/tooling/shopware-toolbox.md) reports this.
- Data attached via `addExtension()` inside a decorator is serialized into Store API and Admin API responses; use a vendor-specific key and treat it as public API.

## Code check (6.7.15.1)
- confirmed `DecorationPatternException` — class in `Shopware\Core\Framework\Plugin\Exception` — vendor/shopware/core/Framework/Plugin/Exception/DecorationPatternException.php:13
- confirmed `DecorationPatternException::__construct()` — takes the class name, message says `getDecorated()` cannot be used on the base class — vendor/shopware/core/Framework/Plugin/Exception/DecorationPatternException.php:15
- confirmed `AbstractSystemConfigLoader::getDecorated()` — core contracts declare abstract `getDecorated()` returning their own type — vendor/shopware/core/System/SystemConfig/AbstractSystemConfigLoader.php:10
- confirmed `decorate` — core itself chains decorators with `->decorate()` and `.inner` — vendor/shopware/core/System/DependencyInjection/configuration.php:114
- confirmed `.inner` — inner service passed as constructor argument — vendor/shopware/core/System/DependencyInjection/configuration.php:116
- confirmed `addExtension()` — `addExtension(string $name, Struct $extension)` on extendable structs — vendor/shopware/core/Framework/Struct/ExtendableTrait.php:21
- unverified `debug:container` — Symfony console command, out of scope
