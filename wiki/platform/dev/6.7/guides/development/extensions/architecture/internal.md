---
id: platform/dev/6.7/guides/development/extensions/architecture/internal.md
title: Public API and Internal Annotation
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/development/extensions/architecture/internal.html
sourceHash: 16d41259a41e4b67bf835304e19b02486e19a720
codeCheckedAgainst: "6.7.13.0"
keywords: ["public api", "@internal", "final", "getDecorated", "DecorationPatternException", "Struct", "addExtension", "decoration pattern", "abstract class", "dto", "backward compatibility", "internal interfaces"]
summary: Shopware public API rules - public/protected members, abstract classes with getDecorated() for decoration, final DTOs and subscribers, @internal classes.
lastBuilt: 2026-09-15
---
## What it is

A core coding guideline (mirrored from `coding-guidelines/core/internal.md` in the Shopware repository). It defines what Shopware treats as public API for third-party developers, and which tools mark things as not public API: the decoration pattern, `final` classes, and the `@internal` annotation.

## When to use

When deciding whether a plugin may rely on, decorate, or extend a core class, service, DTO, or interface, and which changes to expect across minor releases.

## Key steps / config

### Public API baseline

All classes and elements (methods, properties, constants) that are `protected` or `public` start out as public API. These use cases must stay compatible in minor releases:

- using a service to call its functions
- decorating a service to extend it
- using a DTO to get or pass data

### Decoration pattern

Services meant for **service decoration** come with an abstract class that declares `getDecorated()`. A decorator passes calls it does not handle to the inner service. The core base implementation throws `DecorationPatternException` from `getDecorated()`. Shape as found in core:

```php
abstract class AbstractProductListRoute
{
    abstract public function getDecorated(): AbstractProductListRoute;
    abstract public function load(Criteria $criteria, SalesChannelContext $context): ProductListResponse;
}

class ProductListRoute extends AbstractProductListRoute
{
    public function getDecorated(): AbstractProductListRoute
    {
        throw new DecorationPatternException(self::class);
    }
    // load(...) { /* ... */ }
}
```

### Final classes

- DI container services are meant to be `final`. Exchangeable services have an `abstract class`, so extending core services with `extends` is not intended.
- **DTO classes** are `final`. To add data, use the extensions of the base `Shopware\Core\Framework\Struct\Struct` class (`addExtension()`).
- **Event subscribers** are `final`.
- `final` classes are still public API, because third-party developers consume their public methods.

### `@internal`

- Classes marked with the `@internal` docblock may be refactored completely in any release and are not for third-party use.
- Interfaces are `@internal` when Shopware wants several implementations of its own but no third-party ones. Example: DAL Field and FieldSerializer classes, where Shopware keeps the right to optimise and break within minor versions.

## Essential identifiers

- `getDecorated()` — decoration entry point on abstract service classes
- `Shopware\Core\Framework\Plugin\Exception\DecorationPatternException`
- `Shopware\Core\Framework\Struct\Struct` / `addExtension()`
- `FieldSerializerInterface` (`@internal`)
- `@internal` docblock annotation

## Gotchas

- The constructors of decoratable core services are often `@internal` themselves (for example `ProductListRoute::__construct()`). Decorate through the abstract class instead of instantiating or extending the concrete service.
- Calling `getDecorated()` on the core base implementation throws. Only decorators return an inner service.
- In practice many core classes carry a `@final` docblock rather than the PHP `final` keyword. That means "use, do not extend", but PHP does not enforce it.

## Code check (6.7.13.0)
- confirmed `AbstractProductListRoute::getDecorated()` — declared abstract on the decoratable base class — vendor/shopware/core/Content/Product/SalesChannel/AbstractProductListRoute.php:15
- confirmed `ProductListRoute::getDecorated()` — core implementation throws DecorationPatternException — vendor/shopware/core/Content/Product/SalesChannel/ProductListRoute.php:30
- confirmed `DecorationPatternException` — message says getDecorated() of a core base class cannot be used — vendor/shopware/core/Framework/Plugin/Exception/DecorationPatternException.php:13
- confirmed `Struct` — abstract base class implementing ExtendableInterface — vendor/shopware/core/Framework/Struct/Struct.php:8
- confirmed `ExtendableTrait::addExtension()` — how data is appended to Struct-based DTOs — vendor/shopware/core/Framework/Struct/ExtendableTrait.php:21
- confirmed `@internal` — on the DAL interface FieldSerializerInterface — vendor/shopware/core/Framework/DataAbstractionLayer/FieldSerializer/FieldSerializerInterface.php:13
- confirmed `ProductListRoute::__construct()` — constructor docblock is @internal — vendor/shopware/core/Content/Product/SalesChannel/ProductListRoute.php:26
