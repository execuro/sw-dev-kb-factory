---
id: platform/dev/6.7/products/extensions/b2b-components/employee-management/_index.md
title: Employee Management
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-components/employee-management/
sourceHash: aba632515de631176f6e9b32f42ea7d11c649cda
codeCheckedAgainst: "6.7.15.1"
keywords: ["employee management", "b2b components", "b2b", "employee", "company customer", "business partner", "role management", "roles", "permissions", "customer", "commercial plugin", "buyer platform"]
summary: B2B Employee Management overview - employees act on behalf of a company customer, use its addresses, and get permissions via roles.
lastBuilt: 2026-10-21
relatedPages:
  - platform/dev/6.7/products/extensions/b2b-components/employee-management/guides/creating-own-permissions-via-app.md
  - platform/dev/6.7/products/extensions/b2b-components/employee-management/guides/creating-own-permissions-via-plugin.md
---
## What it is

Employee Management is a B2B Component (Commercial plugin) for managing employees, roles and permissions. It is implemented in both Storefront and Administration and supports their respective APIs. It extends Shopware's account and customer management into a company context.

## When to use

When a B2B merchant needs a buyer platform where several employees of a business partner log in separately but order on behalf of one company, with per-employee permissions.

## Key steps / config

- **Company customer**: a regular storefront `customer` with a few additional properties. The customer's ID associates employees with the company, so core order-relevant data such as the customer's addresses is reused instead of building separate employee processes.
- **Employees** act on behalf of the company customer, e.g. placing orders, and can use addresses defined by their company's administrators.
- **Roles** define employee permissions and settings; permissions restrict or allow actions such as ordering without approval or managing roles and employees.
- Permissions can be extended [via app](platform/dev/6.7/products/extensions/b2b-components/employee-management/guides/creating-own-permissions-via-app.md) or [via plugin](platform/dev/6.7/products/extensions/b2b-components/employee-management/guides/creating-own-permissions-via-plugin.md).

## Gotchas

- Most core implementations stay in use; only a few B2B-related features are extended (e.g. referencing which employee performed an action), so employee behaviour follows core customer/order logic.

## Code check (6.7.15.1)
- confirmed `customer` — core customer entity the company customer is based on — vendor/shopware/core/Checkout/Customer/CustomerDefinition.php:62
- confirmed `addresses` — customer addresses reused by employees — vendor/shopware/core/Checkout/Customer/CustomerDefinition.php:158
- confirmed `company` — core customer field for company name — vendor/shopware/core/Checkout/Customer/CustomerDefinition.php:125
- unverified `employee` — Employee Management entities live in the Commercial plugin, not in installed code
- unverified `role` — B2B role/permission handling lives in the Commercial plugin, not in installed code
