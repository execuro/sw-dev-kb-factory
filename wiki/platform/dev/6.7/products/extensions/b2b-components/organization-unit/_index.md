---
id: platform/dev/6.7/products/extensions/b2b-components/organization-unit/_index.md
title: Organization unit
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-components/organization-unit/
sourceHash: 96288e0cb73d850ba8c2204d1546a7c8274bd3c7
codeCheckedAgainst: "6.7.15.1"
keywords: ["organization unit", "organization", "b2b components", "employee management", "b2b employees", "business unit", "payment methods", "shipping methods", "access rights", "company structure"]
summary: B2B Components organization unit - groups employees into units with their own payment and shipping methods; requires the Employee Management component.
lastBuilt: 2026-10-21
---
## What it is

Overview of the Organization unit component, part of B2B Employee Management in the B2B Components (commercial plugin). Each organization unit can have its own set of employees and use specific payment and shipping methods, allowing more differentiated access rights for businesses with complex structures.

## When to use

A B2B customer account needs to be split into structural units (departments, branches) whose employees get different checkout options or permissions.

## Key steps / config

- Install and activate the Employee Management component first; the organization unit component depends on it.

## Gotchas

- The component is not part of Shopware core; it ships with the commercial B2B Components, so its classes are not in the core code base.

## Code check (6.7.15.1)
- confirmed `payment_method` — core entity that units restrict — vendor/shopware/core/Checkout/Payment/PaymentMethodDefinition.php:44
- confirmed `shipping_method` — core entity that units restrict — vendor/shopware/core/Checkout/Shipping/ShippingMethodDefinition.php:44
- unverified `organization unit` — commercial B2B Components feature, not in core/storefront/administration
- unverified `Employee Management` — commercial B2B Components dependency, out of scope
