---
id: platform/dev/6.7/resources/references/adr/2020-11-25-decoration-pattern.md
title: Decoration pattern
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2020-11-25-decoration-pattern.html
sourceHash: 0d0e2bb3693036369a4bdf1d240a97dce1812057
codeCheckedAgainst: "6.7.15.1"
keywords: ["decoration pattern", "AbstractCustomerRoute", "getDecorated", "DataValidationFactoryInterface", "ContactFormValidationFactory", "CustomerRoute", "abstract class", "interface", "service decoration", "decorator chain", "adr", "backward compatibility"]
summary: "ADR: decoratable Shopware services use abstract classes with getDecorated() instead of interfaces, so methods can be added safely."
lastBuilt: 2026-10-21
---
## What it is

Architecture decision record (2020-11-25, area core) stating that Shopware no longer defines services, especially decoratable ones, through interfaces. Abstract classes are used instead, because they let the core add parameters and methods without breaking existing decorators.

## When to use

- When you decorate a core service (for example a Store API route such as `AbstractCustomerRoute`) and need to know which type to extend and type-hint.
- When you design a service in your own plugin that other plugins should be able to decorate.
- When you wonder why some old interfaces still exist next to an abstract class.

## Key steps / config

The ADR compares the two patterns:

1. **Interface (old)**: adding a parameter means documenting it in a docblock and reading it with `func_get_arg(1)` in implementations. Adding a method means a second interface (the ADR's example is a `...V2` interface extending the original) plus `instanceof` checks at every call site. If several plugins decorate the service and one does not implement the new interface, PHP errors.
2. **Abstract class (decision)**: the base declares `abstract public function getDecorated(): <Base>;`. A newly added method gets a concrete body in the base that delegates to `$this->getDecorated()`, so decorators that do not override it are skipped in the chain, and callers just call the method.

Shape of the installed `AbstractCustomerRoute` (6.7), the ADR's example base, and a decorator:

```php
abstract class AbstractCustomerRoute
{
    abstract public function getDecorated(): AbstractCustomerRoute;

    abstract public function load(Request $request, SalesChannelContext $context, Criteria $criteria, CustomerEntity $customer): CustomerResponse;
}

class MyCustomerRoute extends AbstractCustomerRoute
{
    public function __construct(private readonly AbstractCustomerRoute $decorated) {}
    public function getDecorated(): AbstractCustomerRoute { return $this->decorated; }
    public function load(Request $request, SalesChannelContext $context, Criteria $criteria, CustomerEntity $customer): CustomerResponse { /* ... */ }
}
```

Consequences stated in the ADR:

- Existing interfaces not marked `@internal` are replaced iteratively by abstract classes.
- The abstract class implements the old interface for backward compatibility; once the equivalent exists, the interface is deprecated and removed in the next major.
- Constructors and parameters always type-hint the abstract class.

## Essential identifiers

- `AbstractCustomerRoute` (`Shopware\Core\Checkout\Customer\SalesChannel`), `CustomerRoute`
- `getDecorated()`
- `DataValidationFactoryInterface` (`Shopware\Core\Framework\Validation`), `ContactFormValidationFactory`

## Gotchas

- The ADR's snippets reflect 6.3/6.4-era signatures (commented-out `/* array $data */`, `/*, Criteria $criteria*/` placeholders). In 6.7 these are no longer placeholders: `AbstractCustomerRoute::load()` takes `Request`, `SalesChannelContext`, `Criteria` and `CustomerEntity` as required parameters.
- `DataValidationFactoryInterface` still exists in 6.7 and declares both `create()` and `update()` with a single `SalesChannelContext` parameter; an implementation must provide both.
- The ADR's `loadV2()` method is an illustrative example, not a real method.

## Version notes

The commented-parameter deprecations shown in the ADR (`@deprecated tag:v6.4.0`) were resolved in 6.4; the 6.7 signatures above are the current ones.

## Code check (6.7.15.1)
- confirmed `AbstractCustomerRoute` — abstract base class, not an interface — vendor/shopware/core/Checkout/Customer/SalesChannel/AbstractCustomerRoute.php:15
- confirmed `AbstractCustomerRoute::getDecorated()` — abstract, returns AbstractCustomerRoute — vendor/shopware/core/Checkout/Customer/SalesChannel/AbstractCustomerRoute.php:17
- corrected `AbstractCustomerRoute::load()` — docs: `load(Request, SalesChannelContext /*, Criteria */)`; installed requires Criteria and CustomerEntity — vendor/shopware/core/Checkout/Customer/SalesChannel/AbstractCustomerRoute.php:19
- corrected `CustomerRoute::load()` — docs: `?Criteria $criteria = null`; installed has required Criteria and CustomerEntity — vendor/shopware/core/Checkout/Customer/SalesChannel/CustomerRoute.php:46
- confirmed `CustomerRoute` — extends AbstractCustomerRoute — vendor/shopware/core/Checkout/Customer/SalesChannel/CustomerRoute.php:20
- confirmed `DataValidationFactoryInterface` — still an interface in 6.7 — vendor/shopware/core/Framework/Validation/DataValidationFactoryInterface.php:9
- corrected `DataValidationFactoryInterface::create()` — docs: commented `/* array $data */` parameter; installed takes only SalesChannelContext — vendor/shopware/core/Framework/Validation/DataValidationFactoryInterface.php:11
- corrected `DataValidationFactoryInterface::update()` — docs: only on a V2 interface; installed declares it on the base interface — vendor/shopware/core/Framework/Validation/DataValidationFactoryInterface.php:13
- confirmed `ContactFormValidationFactory` — implements DataValidationFactoryInterface with create() and update() — vendor/shopware/core/Content/ContactForm/Validation/ContactFormValidationFactory.php:19
- unverified `DataValidationFactoryInterfaceV2` — hypothetical name from the ADR example, not searched as a real type
