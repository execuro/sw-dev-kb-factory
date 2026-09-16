---
id: platform/dev/6.6/resources/references/adr/2020-11-25-decoration-pattern.md
title: Decoration pattern
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/resources/references/adr/2020-11-25-decoration-pattern.html
sourceHash: 0d0e2bb3693036369a4bdf1d240a97dce1812057
keywords: ["decoration pattern", "abstract class", "getDecorated", "interface", "AbstractCustomerRoute", "CustomerRoute", "DataValidationFactoryInterface", "service decoration", "plugin decoration", "backward compatibility", "type hint"]
summary: "ADR: Shopware stops defining service interfaces for decoration, uses abstract classes with getDecorated() instead."
lastBuilt: "2026-09-15"
---
## What it is

An architecture decision record deciding that the platform stops implementing interfaces for decoratable services and uses abstract classes instead, because interfaces are too strict to extend safely once plugins decorate them.

## Key steps / config

Two problems with interfaces drove the decision:

- Adding a parameter to an interface method is awkward: it must be introduced as a commented-out parameter first (e.g. `public function create(SalesChannelContext $context /* array $data */): DataValidationDefinition;`, read via `func_get_arg(1)`), whereas an abstract class can add the parameter directly with a `@deprecated` tag.
- Adding a new method to an interface forces either a new `V2` interface plus `instanceof` checks at every call site (which breaks if a decorating plugin hasn't implemented the new interface), or, with an abstract class, a fallback via `getDecorated()` so plugins that don't support the new method are transparently skipped in the decoration chain:

```php
abstract class AbstractCustomerRoute
{
    abstract public function load(Request $request, SalesChannelContext $context): CustomerResponse;
    abstract public function getDecorated(): AbstractCustomerRoute;
    public function loadV2()
    {
        $this->getDecorated()->loadV2();
    }
}
```

Decision:

- The platform no longer uses interfaces for service definitions, especially services meant for decoration.
- Abstract classes are used for other cases too, since they can be extended or have their signatures changed more easily.

## Essential identifiers

- `AbstractCustomerRoute`, `CustomerRoute`
- `getDecorated()`
- `DataValidationFactoryInterface`

## Gotchas

- Existing interfaces not marked `@internal` are iteratively replaced with abstract classes; the abstract class must still implement the interface for backward compatibility.
- Once an abstract-class equivalent exists, the interface is deprecated and removed in the next major version.
- The abstract class, not the interface, is always used as the type hint for constructors or parameters.
