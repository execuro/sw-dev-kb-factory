---
id: platform/dev/6.7/products/extensions/b2b-components/organization-unit/guides/how-to-identify-organization-from-context.md
title: How to identify the organization unit from the context
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-components/organization-unit/guides/how-to-identify-organization-from-context.html
sourceHash: a17251d4be5bdf07dec5be5e38b2624645142718
codeCheckedAgainst: "6.7.15.1"
keywords: ["organizationId", "EmployeeEntity", "SalesChannelContextFactoryDecorator", "CUSTOMER_EMPLOYEE_EXTENSION", "getExtension", "getCustomer", "SalesChannelContext", "organization unit", "current employee", "b2b components", "customer extension"]
summary: Get the current B2B employee's organization unit id from the SalesChannelContext via the customer's employee extension and its organizationId.
lastBuilt: 2026-10-21
---
## What it is

How to find the organization unit the logged-in B2B employee belongs to: read the employee entity from the customer in the sales channel context, then its `organizationId`.

## When to use

Code running in a storefront/store-api request needs to load organization-specific data or restrict what the current employee may access.

## Key steps / config

1. Get the customer from the `SalesChannelContext` and read its employee extension, keyed by `SalesChannelContextFactoryDecorator::CUSTOMER_EMPLOYEE_EXTENSION`.
2. Bail out if the result is not an `EmployeeEntity` (the customer is not an employee).
3. Read `organizationId` from the employee.

```php
$employee = $context->getCustomer()?->getExtension(SalesChannelContextFactoryDecorator::CUSTOMER_EMPLOYEE_EXTENSION);

if (!$employee instanceof EmployeeEntity) {
    return;
}

$organizationId = $employee->get('organizationId');
```

Use `$organizationId` to load organization-related data or for access decisions.

## Essential identifiers

- `SalesChannelContextFactoryDecorator::CUSTOMER_EMPLOYEE_EXTENSION`
- `EmployeeEntity`
- `organizationId`

## Gotchas

- `SalesChannelContext::getCustomer()` is nullable (no customer logged in), hence the nullsafe `?->` before `getExtension()`.

## Code check (6.7.15.1)
- confirmed `SalesChannelContext::getCustomer()` — returns `?CustomerEntity` — vendor/shopware/core/System/SalesChannel/SalesChannelContext.php:132
- confirmed `ExtendableTrait::getExtension()` — returns `?Struct` by name — vendor/shopware/core/Framework/Struct/ExtendableTrait.php:51
- confirmed `Entity::get()` — generic property accessor — vendor/shopware/core/Framework/DataAbstractionLayer/Entity.php:99
- unverified `SalesChannelContextFactoryDecorator` — commercial B2B Components class, not in core/storefront/administration
- unverified `EmployeeEntity` — commercial B2B Components entity, out of scope
