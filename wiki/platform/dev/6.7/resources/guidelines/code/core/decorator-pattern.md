---
id: platform/dev/6.7/resources/guidelines/code/core/decorator-pattern.md
title: Decorator pattern
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/guidelines/code/core/decorator-pattern.html
sourceHash: 48a5f8a7053252e5840d6bd77863aaadffee9d97
codeCheckedAgainst: "6.7.15.1"
keywords: ["decorator pattern", "service decoration", "getDecorated", "DecorationPatternException", "DecorationPatternRule", "AbstractRuleLoader", "RuleLoader", "CachedRuleLoader", "abstract class", "@internal", "@final", "phpstan rule", "di container"]
summary: "Core rules for decoratable services: abstract base class with getDecorated(), core throws DecorationPatternException, no extra public methods."
lastBuilt: 2026-10-21
---
## What it is

The Shopware core coding guideline for the decorator pattern: how to define a DI container service so that other developers can decorate or replace it. Shopware uses abstract classes instead of interfaces as the service contract, so new methods can be added later without breaking existing implementations (decision taken in the 2020-11-25 decoration-pattern ADR).

## When to use

- You write a service that third-party developers should be able to decorate or rewrite in the DI container (Symfony service decoration).
- Do not use it for new Store-API route classes; the guideline points to the ADR replacing abstract route classes with extension events.
- Do not use it when you only want an internal logging/cache layer around your own service — see the alternative below.

## Key steps / config

Rules for a decoratable service:

1. The abstract class declares `getDecorated()` returning the abstract class.
2. The core implementation throws `DecorationPatternException` when `getDecorated()` is called (it must be the first statement — that is how the PHPStan rule detects the base implementation).
3. The abstract class must not be marked `@internal` or `@final`.
4. An implementation may not expose public methods other than those defined in the abstract class (constructor excepted).
5. Implementations may not be event subscribers.

```php
abstract class AbstractRuleLoader
{
    abstract public function getDecorated(): AbstractRuleLoader;
    abstract public function load(Context $context): RuleCollection;
}

class SomePlugin extends AbstractRuleLoader
{
    public function __construct(private AbstractRuleLoader $inner) {}
    public function getDecorated(): AbstractRuleLoader { return $this->inner; }
    public function load(Context $context): RuleCollection { return $this->inner->load($context); }
}
```

The core `RuleLoader` implements `getDecorated()` as `throw new DecorationPatternException(self::class);`.

Adding functionality later: add the new method to the abstract class as a concrete (non-abstract) method that delegates, e.g. `public function create(Context $context): RuleCollection { return $this->getDecorated()->create($context); }`.

Alternative (non-decoratable wrapping): inject the inner service and delegate without offering the pattern to others; mark classes `@internal` (private API) or `@final` (callable, not extendable).

## Essential identifiers

- `getDecorated()`
- `Shopware\Core\Framework\Plugin\Exception\DecorationPatternException`
- `\Shopware\Core\DevOps\StaticAnalyze\PHPStan\Rules\DecorationPatternRule`
- `Shopware\Core\Checkout\Cart\AbstractRuleLoader`, `RuleLoader`, `CachedRuleLoader`

## Gotchas

- The source's "Alternative" snippet shows a `CachedLoader extends AbstractRuleLoader` with only `load()`; against the installed `AbstractRuleLoader` this does not compile, because `getDecorated()` is abstract there. The real `CachedRuleLoader` implements both and returns its `$decorated` inner service from `getDecorated()`.
- The source's `CoreRuleLoader` example omits `extends AbstractRuleLoader`; the installed `RuleLoader` extends it.
- `DecorationPatternRule` skips test classes, anonymous classes, a list of App/Store lifecycle abstracts, and classes whose `getDecorated()` is `@deprecated`.
- A concrete class implementing `EventSubscriberInterface` or marked `@internal` while decoratable triggers a `shopware.decorationPattern` error.

## Code check (6.7.15.1)
- confirmed `AbstractRuleLoader::getDecorated()` — abstract, returns AbstractRuleLoader — vendor/shopware/core/Checkout/Cart/AbstractRuleLoader.php:12
- confirmed `AbstractRuleLoader::load()` — abstract, takes Context, returns RuleCollection — vendor/shopware/core/Checkout/Cart/AbstractRuleLoader.php:14
- confirmed `DecorationPatternException` — class in Framework\Plugin\Exception — vendor/shopware/core/Framework/Plugin/Exception/DecorationPatternException.php:13
- confirmed `RuleLoader::getDecorated()` — core service throws DecorationPatternException — vendor/shopware/core/Checkout/Cart/RuleLoader.php:32
- confirmed `DecorationPatternRule` — PHPStan rule enforcing the pattern — vendor/shopware/core/DevOps/StaticAnalyze/PHPStan/Rules/DecorationPatternRule.php:35
- confirmed `EventSubscriberInterface` — decoratable implementations may not be subscribers — vendor/shopware/core/DevOps/StaticAnalyze/PHPStan/Rules/DecorationPatternRule.php:113
- confirmed `@final` — abstract decoratable class marked final is rejected — vendor/shopware/core/DevOps/StaticAnalyze/PHPStan/Rules/DecorationPatternRule.php:184
- confirmed `CachedRuleLoader::getDecorated()` — cache layer also implements getDecorated, unlike the docs' CachedLoader — vendor/shopware/core/Checkout/Cart/CachedRuleLoader.php:27
- confirmed `CachedRuleLoader::CACHE_KEY` — constant used by the cache wrapper — vendor/shopware/core/Checkout/Cart/CachedRuleLoader.php:16
