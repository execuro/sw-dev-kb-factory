---
id: platform/dev/6.7/guides/plugins/plugins/services/adjusting-service.md
title: Adjusting a Service
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/services/adjusting-service.html
sourceHash: e5270f74d902a8cc04d0bd4bb85eb1d28d823f2e
codeCheckedAgainst: "6.7.13.0"
keywords: ["service decoration", "decorator", "decorate", ".inner", "getDecorated()", "DecorationPatternException", "abstract service class", "decoration chain", "override service", "adjusting a service", "addExtension()", "extension points", "debug:container"]
summary: Decorating a Shopware service from a plugin with decorate() and .inner, the abstract-class getDecorated() pattern, decorator chains and BC-safe new methods.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md", "platform/dev/6.7/guides/plugins/plugins/framework/extension/extension-vs-events.md", "platform/dev/6.7/guides/plugins/plugins/framework/extension/_index.md", "platform/dev/6.7/guides/plugins/plugins/framework/event/listening-to-events.md"]
---
## What it is

How a plugin changes the behavior of an existing service through Symfony service decoration, using Shopware's abstract-class contract with a `getDecorated()` chain. Prefer events to react to something Shopware does; prefer decoration to change how a service behaves.

## When to use

When no [extension point](platform/dev/6.7/guides/plugins/plugins/framework/extension/_index.md) or [event](platform/dev/6.7/guides/plugins/plugins/framework/event/listening-to-events.md) covers the need and an existing service's logic must be altered, wrapped or replaced.

## Key steps / config

1. Register the decorator in `src/Resources/config/services.php`:

```php
$services->set(ExampleService::class);

$services->set(ExampleServiceDecorator::class)
    ->decorate(ExampleService::class)
    ->args([service('.inner')]);
```

2. The contract is an abstract class (normally from core or another plugin) declaring `abstract public function getDecorated(): AbstractExampleService;` plus its abstract business methods.
3. The base implementation's `getDecorated()` throws `Shopware\Core\Framework\Plugin\Exception\DecorationPatternException`:

```php
class ExampleService extends AbstractExampleService
{
    public function getDecorated(): AbstractExampleService
    {
        throw new DecorationPatternException(self::class);
    }
    public function doSomething(): string { /* ... */ }
}
```

4. The decorator extends the same abstract class, takes the inner `AbstractExampleService` in its constructor, returns it from `getDecorated()`, and delegates:

```php
public function doSomething(): string
{
    return $this->decoratedService->doSomething() . ' Did something additionally.';
}
```

5. Adding a method to the contract: add it as a normal public method that forwards, `return $this->getDecorated()->doSomethingNew();`, implement it in the concrete service and decorators step by step, and only make it abstract in a later release.

## Essential identifiers

- `->decorate(ExampleService::class)`, `service('.inner')`
- `getDecorated()`
- `Shopware\Core\Framework\Plugin\Exception\DecorationPatternException`
- `bin/console debug:container --show-arguments <service-id>`

## Gotchas

- Decorators nest: plugin B wraps plugin A wraps core. A decorator that does not call the inner service silently drops the rest of the chain; there is no runtime warning.
- All implementations must share the abstract method signature; adding even an optional parameter breaks every decorator (in practice a new plugin major per Shopware major). That is why Shopware avoids interfaces for decoratable services.
- Type hint the abstract class in constructors, never the concrete class, or you bypass the chain; the [Shopware 6 Toolbox](platform/dev/6.7/guides/development/tooling/shopware-toolbox.md) reports this.
- Extension points dispatch `.pre`, `.post`, `.error` events so multiple extensions participate without a chain; see [Extension Points vs Events](platform/dev/6.7/guides/plugins/plugins/framework/extension/extension-vs-events.md).
- Data added via `addExtension()` in a decorator is serialized into Store API and Admin API responses; use a vendor-specific key and treat it as public API.

## Code check (6.7.13.0)
- confirmed `DecorationPatternException` — constructor takes the class name — vendor/shopware/core/Framework/Plugin/Exception/DecorationPatternException.php:15
- confirmed `AbstractProductDetailRoute::getDecorated()` — core contract uses an abstract getDecorated() returning its own type — vendor/shopware/core/Content/Product/SalesChannel/Detail/AbstractProductDetailRoute.php:13
- confirmed `DecorationPatternException` — base ProductDetailRoute throws it from getDecorated() — vendor/shopware/core/Content/Product/SalesChannel/Detail/ProductDetailRoute.php:81
- confirmed `.inner` — core decorators receive the inner service by `.inner` id — vendor/shopware/core/Framework/DependencyInjection/services_test.xml:93
- confirmed `ExtendableInterface::addExtension()` — attaches a named Struct extension — vendor/shopware/core/Framework/Struct/ExtendableInterface.php:14
- confirmed `.pre` — extension point pre event suffix — vendor/shopware/core/Framework/Extensions/ExtensionDispatcher.php:25
- confirmed `.post` — extension point post event suffix — vendor/shopware/core/Framework/Extensions/ExtensionDispatcher.php:34
- confirmed `.error` — extension point error event suffix — vendor/shopware/core/Framework/Extensions/ExtensionDispatcher.php:43
- unverified `debug:container` — Symfony command, vendor/symfony out of scope
