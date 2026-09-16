---
id: platform/dev/6.7/products/extensions/b2b-components/organization-unit/guides/how-to-identify-organization-from-context.md
title: How to identify the organization unit from the context
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-components/organization-unit/guides/how-to-identify-organization-from-context.html
sourceHash: a17251d4be5bdf07dec5be5e38b2624645142718
codeCheckedAgainst: "6.7.13.0"
keywords: ["organization unit", "organizationId", "EmployeeEntity", "SalesChannelContextFactoryDecorator", "CUSTOMER_EMPLOYEE_EXTENSION", "getExtension", "getCustomer", "SalesChannelContext", "b2b employee", "b2b components", "commercial plugin", "employee organization"]
summary: Get a B2B employee's organization unit - read the employee extension from the SalesChannelContext customer, then its organizationId.
lastBuilt: 2026-09-15
---
## What it is

A short recipe from the B2B Components (Commercial) docs for finding the organization unit an employee belongs to: fetch the employee entity from the customer in the sales channel context, then read its `organizationId`.

## When to use

In storefront or Store API code running for a logged-in B2B employee, when you need to load organization-related data or restrict what the employee may access based on their organization unit.

## Key steps / config

1. Take the customer from the `SalesChannelContext` (`getCustomer()` may return `null`).
2. Read the employee extension from the customer using the constant `SalesChannelContextFactoryDecorator::CUSTOMER_EMPLOYEE_EXTENSION`.
3. Bail out if the result is not an `EmployeeEntity`.
4. Read `organizationId` from the employee entity.

```php
$employee = $context->getCustomer()?->getExtension(SalesChannelContextFactoryDecorator::CUSTOMER_EMPLOYEE_EXTENSION);

if (!$employee instanceof EmployeeEntity) {
    return;
}

$organizationId = $employee->get('organizationId');
```

The resulting `organizationId` is the ID of the organization unit associated with the employee.

## Essential identifiers

- `SalesChannelContext::getCustomer()`
- `getExtension()` (on the customer entity)
- `SalesChannelContextFactoryDecorator::CUSTOMER_EMPLOYEE_EXTENSION` (Commercial plugin)
- `EmployeeEntity` (Commercial plugin)
- `organizationId`

## Gotchas

- The customer is nullable (guest/no login) and a regular customer has no employee extension; always guard with the `instanceof EmployeeEntity` check.
- `SalesChannelContextFactoryDecorator` and `EmployeeEntity` live in the Shopware Commercial plugin, not in the core; the source does not give their namespaces.

## Code check (6.7.13.0)
- confirmed `SalesChannelContext::getCustomer()` — returns `?CustomerEntity`, so the null-safe call is needed — vendor/shopware/core/System/SalesChannel/SalesChannelContext.php:132
- confirmed `ExtendableTrait::getExtension()` — `getExtension(string $name): ?Struct` — vendor/shopware/core/Framework/Struct/ExtendableTrait.php:51
- confirmed `Entity::get()` — generic property accessor used for `organizationId` — vendor/shopware/core/Framework/DataAbstractionLayer/Entity.php:99
- unverified `SalesChannelContextFactoryDecorator::CUSTOMER_EMPLOYEE_EXTENSION` — Commercial plugin, outside the installed vendor/shopware roots
- unverified `EmployeeEntity` — Commercial plugin, outside the installed vendor/shopware roots
