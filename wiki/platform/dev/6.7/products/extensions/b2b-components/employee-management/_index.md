---
id: platform/dev/6.7/products/extensions/b2b-components/employee-management/_index.md
title: Employee Management
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-components/employee-management/
sourceHash: aba632515de631176f6e9b32f42ea7d11c649cda
codeCheckedAgainst: "6.7.13.0"
keywords: ["employee management", "b2b components", "company customer", "employee", "roles", "permissions", "role management", "buyer platform", "b2b", "commercial plugin", "company account", "acl"]
summary: B2B Employee Management concept - employees tied to a company customer, acting on its behalf, with roles defining permissions; extendable via app or plugin.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/products/extensions/b2b-components/employee-management/guides/creating-own-permissions-via-app.md", "platform/dev/6.7/products/extensions/b2b-components/employee-management/guides/creating-own-permissions-via-plugin.md"]
---
## What it is

Employee Management is a B2B Component (Commercial plugin) providing employee, role and permission management in both Storefront and Administration, including their APIs. It extends Shopware's account and customer management into a company context.

## When to use

When B2B merchants need a buyer platform where multiple employees of a business partner act on behalf of one company, for example placing orders, with controlled permissions.

## Key steps / config

- **Company customer:** a regular Storefront customer with a few additional properties. Its customer ID associates employees with the company, so core order-relevant data such as addresses is reused.
- **Employees:** act on behalf of the company customer and can use addresses defined by their company's administrators.
- **Roles:** employees are assigned roles defining permissions and settings, e.g. ordering without approval or managing roles and employees.
- Extend permissions [via app](platform/dev/6.7/products/extensions/b2b-components/employee-management/guides/creating-own-permissions-via-app.md) or [via plugin](platform/dev/6.7/products/extensions/b2b-components/employee-management/guides/creating-own-permissions-via-plugin.md).

## Gotchas

- Core processes are reused through the company customer rather than duplicated per employee; B2B code only extends selected features, e.g. referencing an employee's actions.
- The employee, role and permission implementation lives in the Commercial plugin, not in the installed core packages.

## Code check (6.7.13.0)
- unverified `employee` — B2B employee entity is part of the Commercial plugin, out of scope
- unverified `role` — B2B role/permission handling is part of the Commercial plugin, out of scope
