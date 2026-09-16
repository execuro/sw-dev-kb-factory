---
codeCheckedAgainst: "6.7.13.0"
docType: developer
id: platform/dev/6.7/resources/guidelines/code/core/decorator-pattern.md
sourceHash: 24554dfd729a39218f7b6d6f64983c6619fd6458
sourceUrl: https://developer.shopware.com/docs/resources/guidelines/code/core/decorator-pattern.html
title: Decorator pattern
version: "6.7"
versions:
  - "6.7"
keywords: ["decorator pattern", "service decoration", "getDecorated", "DecorationPatternException", "DecorationPatternRule", "AbstractRuleLoader", "RuleLoader", "CachedRuleLoader", "abstract class", "@internal", "@final", "phpstan rule", "extend core service"]
summary: Shopware rules for decoratable services - abstract base class with getDecorated(), core throws DecorationPatternException, enforced by a PHPStan rule.
lastBuilt: 2026-09-15
---
## What it is

Shopware core coding guideline for services that other developers may decorate (Symfony DI service decoration). Shopware uses abstract classes instead of interfaces as the service contract so new methods can be added without breaking implementations (per the 2020-11-25 decoration-pattern ADR).

## When to use

When defining a core or extension service that third parties should be able to decorate, when decorating such a service, or when wrapping your own service (cache/logging) without making it publicly decoratable.

## Key steps / config

Rules for a decoratable service:

- The abstract class declares `getDecorated()` returning the abstract class type.
- The core (base) implementation throws `\Shopware\Core\Framework\Plugin\Exception\DecorationPatternException` from `getDecorated()`.
- The abstract class must not be marked `@internal` or `@final`.
- An implementation must not expose public methods not defined in the abstract class (constructors and static methods are exempt).
- An implementation must not be an event subscriber.

Enforced by the PHPStan rule `\Shopware\Core\DevOps\StaticAnalyze\PHPStan\Rules\DecorationPatternRule`.

Installed example — `Shopware\Core\Checkout\Cart\AbstractRuleLoader`, base `RuleLoader`, and a decorator:

```php
abstract class AbstractRuleLoader
{
    abstract public function getDecorated(): AbstractRuleLoader;
    abstract public function load(Context $context): RuleCollection;
}

class RuleLoader extends AbstractRuleLoader
{
    public function getDecorated(): AbstractRuleLoader { throw new DecorationPatternException(self::class); }
    public function load(Context $context): RuleCollection { /* ... */ }
}

class SomePlugin extends AbstractRuleLoader
{
    public function __construct(private AbstractRuleLoader $inner) {}
    public function getDecorated(): AbstractRuleLoader { return $this->inner; }
    public function load(Context $context): RuleCollection { return $this->inner->load($context); }
}
```

Adding functionality later: add the new method to the abstract class as a **non-abstract** method that delegates, e.g. `public function create(Context $context): RuleCollection { return $this->getDecorated()->create($context); }` — existing decorators keep working.

**Non-decoratable wrapping (alternative):** to put a cache or logging layer around your own service without inviting third-party decoration, inject the inner service and delegate instead of using the pattern above. Mark the classes `@internal` for private API, or `@final` if others may call but not extend them.

## Essential identifiers

- `getDecorated()`
- `Shopware\Core\Framework\Plugin\Exception\DecorationPatternException`
- `Shopware\Core\DevOps\StaticAnalyze\PHPStan\Rules\DecorationPatternRule` (error identifier `shopware.decorationPattern`)
- `Shopware\Core\Checkout\Cart\AbstractRuleLoader`, `RuleLoader`, `CachedRuleLoader`

## Gotchas

- The guideline's example names the base implementation `CoreRuleLoader` and omits `extends`; the installed base class is `RuleLoader extends AbstractRuleLoader`.
- The guideline's alternative example shows an `AbstractRuleLoader` without `getDecorated()` and a `CachedLoader`; the installed `AbstractRuleLoader` does declare `getDecorated()` abstract, and the real `CachedRuleLoader` implements it (returning `$decorated`) with `CACHE_KEY = 'cart_rules'`.
- `DecorationPatternRule` checks concrete classes only when `getDecorated()` starts with a `throw` (the base implementation) and the parent is an abstract `Shopware\` class; a `getDecorated()` carrying `@deprecated` disables the check.
- Symfony's event system cannot handle decorated subscribers, hence the event-subscriber ban.

## Code check (6.7.13.0)
- confirmed `AbstractRuleLoader::getDecorated()` — abstract, returns AbstractRuleLoader — vendor/shopware/core/Checkout/Cart/AbstractRuleLoader.php:12
- confirmed `AbstractRuleLoader::load()` — abstract, returns RuleCollection — vendor/shopware/core/Checkout/Cart/AbstractRuleLoader.php:14
- corrected `RuleLoader` — docs: CoreRuleLoader; base implementation is RuleLoader throwing DecorationPatternException — vendor/shopware/core/Checkout/Cart/RuleLoader.php:19
- confirmed `DecorationPatternException` — takes the class name — vendor/shopware/core/Framework/Plugin/Exception/DecorationPatternException.php:13
- confirmed `DecorationPatternRule` — PHPStan rule enforcing the pattern — vendor/shopware/core/DevOps/StaticAnalyze/PHPStan/Rules/DecorationPatternRule.php:31
- confirmed `EventSubscriberInterface` — decorated base implementations may not implement it — vendor/shopware/core/DevOps/StaticAnalyze/PHPStan/Rules/DecorationPatternRule.php:109
- confirmed `@final` — abstract decoratable class marked @final is rejected — vendor/shopware/core/DevOps/StaticAnalyze/PHPStan/Rules/DecorationPatternRule.php:144
- corrected `CachedRuleLoader::getDecorated()` — docs: cached wrapper without getDecorated; installed one returns $decorated — vendor/shopware/core/Checkout/Cart/CachedRuleLoader.php:27
