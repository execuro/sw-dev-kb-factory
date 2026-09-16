---
id: "platform/dev/6.6/resources/guidelines/code/core/decorator-pattern.md"
title: "Decorator pattern"
docType: "developer"
version: "6.6"
versions: ["6.6"]
sourceUrl: "https://developer.shopware.com/docs/v6.6/resources/guidelines/code/core/decorator-pattern.html"
sourceHash: "24554dfd729a39218f7b6d6f64983c6619fd6458"
keywords: ["decorator pattern", "getDecorated", "DecorationPatternException", "DecorationPatternRule", "abstract class", "service decoration", "@internal", "@final", "AbstractRuleLoader", "DI container", "extendability"]
summary: "Shopware's decorator pattern rules: abstract classes with getDecorated(), DecorationPatternException, and when to use plain injection instead."
lastBuilt: "2026-09-15"
---
## What it is

Describes Shopware's decorator pattern for extending or replacing DI container services, and the rules services must follow to be safely decoratable.

## When to use

Use it when designing a service that other developers (including plugins) should be able to extend, replace, or rewrite — most commonly Store API routes and other DI-container services.

## Key steps / config

Instead of interfaces, Shopware uses abstract classes to define a service's base functionality, so new methods can be added without breaking existing code (decision recorded in an ADR).

Rules for a decoratable service:
- The abstract class must implement a `getDecorated()` function that returns the abstract class type.
- The core service implementation must throw `DecorationPatternException` when `getDecorated()` is called on it.
- The abstract class cannot be marked `@internal` or `@final`.
- An implementation of the abstract class cannot expose any public functions beyond those defined on the abstract class.
- Implementations of the abstract class cannot act as event subscribers, since the Symfony event system cannot handle that correctly.

These rules are enforced by the `\Shopware\Core\DevOps\StaticAnalyze\PHPStan\Rules\DecorationPatternRule` class.

```php
abstract class AbstractRuleLoader
{
    abstract public function getDecorated(): AbstractRuleLoader;
    abstract public function load(Context $context): RuleCollection;
}

class CoreRuleLoader
{
    public function getDecorated(): AbstractRuleLoader {
        throw new DecorationPatternException(self::class);
    }
}
```

To add functionality later, add it to the abstract class as a non-abstract method that calls through `getDecorated()`, rather than as an abstract method — this avoids breaking existing implementations.

If you want to decorate your own service internally without letting other developers decorate it, skip this pattern: inject and delegate to the inner service directly, and mark the classes `@internal` (private API) or `@final` (public but not extendable) as appropriate.

## Essential identifiers

- `getDecorated()`
- `DecorationPatternException`
- `\Shopware\Core\DevOps\StaticAnalyze\PHPStan\Rules\DecorationPatternRule`
- `@internal`, `@final`

## Gotchas

- The abstract class must never be `@internal` or `@final`, or it cannot be decorated by third parties.
- Decorating implementations must not add public functions beyond the abstract class's surface, and must not act as event subscribers.
