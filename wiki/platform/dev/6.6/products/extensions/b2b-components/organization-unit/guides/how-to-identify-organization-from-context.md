---
id: platform/dev/6.6/products/extensions/b2b-components/organization-unit/guides/how-to-identify-organization-from-context.md
title: How to identify the organization unit from the context
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/products/extensions/b2b-components/organization-unit/guides/how-to-identify-organization-from-context.html
sourceHash: a17251d4be5bdf07dec5be5e38b2624645142718
keywords: ["organization unit", "EmployeeEntity", "SalesChannelContextFactoryDecorator", "CUSTOMER_EMPLOYEE_EXTENSION", "organizationId", "sales channel context", "employee extension", "getExtension", "access control"]
summary: "Read the employee extension off the customer in SalesChannelContext, then its organizationId, to find the active organization unit."
lastBuilt: "2026-09-15"
---
## What it is

Explains how to determine which organization unit the current employee belongs to, using the sales channel context.

## When to use

Use this when a plugin or app needs to know the active employee's organization to load organization-scoped data or to restrict what the employee can access.

## Key steps / config

Retrieve the employee entity from the customer's extension, then read its `organizationId`:

```php
$employee = $context->getCustomer()?->getExtension(SalesChannelContextFactoryDecorator::CUSTOMER_EMPLOYEE_EXTENSION);

if (!$employee instanceof EmployeeEntity) {
    return;
}

$organizationId = $employee->get('organizationId');
```

The code checks whether the current customer has an employee extension; if present, it accesses the `organizationId` property to get the ID of the organization the employee belongs to. That ID can be used to load organization-related data or to control the employee's allowed access.

## Essential identifiers

- `SalesChannelContextFactoryDecorator::CUSTOMER_EMPLOYEE_EXTENSION`
- `EmployeeEntity`
- `organizationId` (employee property)
