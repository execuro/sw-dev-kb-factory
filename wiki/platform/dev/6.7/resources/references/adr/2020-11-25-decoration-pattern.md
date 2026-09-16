---
id: platform/dev/6.7/resources/references/adr/2020-11-25-decoration-pattern.md
title: Decoration pattern
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2020-11-25-decoration-pattern.html
sourceHash: 0d0e2bb3693036369a4bdf1d240a97dce1812057
codeCheckedAgainst: "6.7.13.0"
keywords: ["decoration pattern", "AbstractCustomerRoute", "CustomerRoute", "getDecorated", "DecorationPatternException", "DataValidationFactoryInterface", "ContactFormValidationFactory", "abstract class", "interface", "service decoration", "plugin decorator", "adr"]
summary: "ADR: decoratable services use abstract classes with getDecorated() instead of interfaces; e.g. AbstractCustomerRoute. Type-hint the abstract class."
lastBuilt: 2026-09-15
---
## What it is

Architecture decision record (2020-11-25) that settles on abstract classes, not interfaces, as the base type for platform services — especially services intended for decoration by plugins. Abstract classes let the core add parameters or new methods without breaking decorators.

## When to use

When writing a decorator for a core service (e.g. a Store API route such as `AbstractCustomerRoute`), or when designing your own decoratable service and choosing between an interface and an abstract base class.

## Key steps / config

1. Type-hint and extend the abstract class, never the concrete core class.
2. Declare every abstract member of the base. For `AbstractCustomerRoute` in 6.7 these are `getDecorated(): AbstractCustomerRoute` and `load(Request $request, SalesChannelContext $context, Criteria $criteria, CustomerEntity $customer): CustomerResponse`.
3. Receive the decorated (inner) service in the constructor and return it from `getDecorated()`; delegate to it where you do not change behaviour.

```php
class MyCustomerRoute extends AbstractCustomerRoute
{
    public function __construct(private readonly AbstractCustomerRoute $decorated) {}

    public function getDecorated(): AbstractCustomerRoute { return $this->decorated; }

    public function load(Request $request, SalesChannelContext $context, Criteria $criteria, CustomerEntity $customer): CustomerResponse
    { /* ... */ }
}
```

The core implementation at the bottom of the chain (`CustomerRoute`) throws `DecorationPatternException` from `getDecorated()`.

Rules from the decision:

- The platform no longer uses interfaces for service definitions, especially not for decoratable services; abstract classes are used for other cases too.
- Existing non-`@internal` interfaces are replaced iteratively by abstract classes; the abstract class implements the interface for backward compatibility; the interface is then deprecated and removed in the next major.
- The abstract class is always the type hint for constructors and parameters.

## Essential identifiers

- `Shopware\Core\Checkout\Customer\SalesChannel\AbstractCustomerRoute`
- `AbstractCustomerRoute::getDecorated()`, `AbstractCustomerRoute::load()`
- `Shopware\Core\Checkout\Customer\SalesChannel\CustomerRoute`
- `DecorationPatternException`

## Gotchas

- Why interfaces were rejected: adding a parameter meant documenting it in a comment and reading it with `func_get_arg(1)`; adding a method needed a second interface (the ADR's `DataValidationFactoryInterfaceV2`) plus `instanceof` checks, which caused PHP errors when one of several decorating plugins did not implement it. With abstract classes, a new non-abstract method can delegate via `getDecorated()`, so decorators unaware of it are skipped in the chain.
- Interfaces still exist in 6.7: `Shopware\Core\Framework\Validation\DataValidationFactoryInterface` declares both `create(SalesChannelContext $context)` and `update(SalesChannelContext $context)`, and `ContactFormValidationFactory` implements both. An implementer must declare both methods; the ADR's `array $data` comment parameter is not in the signature.

## Version notes

- The ADR's `@deprecated tag:v6.4.0` examples (optional `$criteria` on `load()`) are history: in 6.7 `AbstractCustomerRoute::load()` takes a mandatory `Criteria $criteria` and a `CustomerEntity $customer`.

## Code check (6.7.13.0)
- confirmed `AbstractCustomerRoute` — abstract base class in core — vendor/shopware/core/Checkout/Customer/SalesChannel/AbstractCustomerRoute.php:15
- confirmed `AbstractCustomerRoute::getDecorated()` — abstract, returns AbstractCustomerRoute — vendor/shopware/core/Checkout/Customer/SalesChannel/AbstractCustomerRoute.php:17
- corrected `AbstractCustomerRoute::load()` — docs: load(Request, SalesChannelContext[, ?Criteria]); now requires Criteria and CustomerEntity — vendor/shopware/core/Checkout/Customer/SalesChannel/AbstractCustomerRoute.php:19
- confirmed `CustomerRoute` — extends AbstractCustomerRoute — vendor/shopware/core/Checkout/Customer/SalesChannel/CustomerRoute.php:20
- confirmed `CustomerRoute::getDecorated()` — throws DecorationPatternException — vendor/shopware/core/Checkout/Customer/SalesChannel/CustomerRoute.php:31
- confirmed `DataValidationFactoryInterface` — interface still present — vendor/shopware/core/Framework/Validation/DataValidationFactoryInterface.php:9
- corrected `DataValidationFactoryInterface::update()` — docs: only on a separate V2 interface; declared on the interface itself — vendor/shopware/core/Framework/Validation/DataValidationFactoryInterface.php:13
- confirmed `DataValidationFactoryInterface::create()` — takes only SalesChannelContext — vendor/shopware/core/Framework/Validation/DataValidationFactoryInterface.php:11
- confirmed `ContactFormValidationFactory` — implements DataValidationFactoryInterface with create and update — vendor/shopware/core/Content/ContactForm/Validation/ContactFormValidationFactory.php:19
- unverified `DataValidationFactoryInterfaceV2` — illustrative name in the ADR; no match found in the vendor roots
