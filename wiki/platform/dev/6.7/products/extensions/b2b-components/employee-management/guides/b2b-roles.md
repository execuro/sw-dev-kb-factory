---
id: platform/dev/6.7/products/extensions/b2b-components/employee-management/guides/b2b-roles.md
title: B2B Roles
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-components/employee-management/guides/b2b-roles.html
sourceHash: 6ed85959c7529fbaae7656c6d663ac2c516c46d7
codeCheckedAgainst: "6.7.15.1"
keywords: ["b2b roles", "role", "default role", "employee role", "permissions", "business partner", "b2b employee management", "access control", "employee permissions"]
summary: B2B roles bundle permissions for employees; each employee has one role, and a business partner can set a default role preselected for new employees.
lastBuilt: 2026-10-21
---
## What it is

In B2B Employee Management, a role binds multiple permissions to employees. Every employee can have exactly one assigned role; the permissions in that role decide which information and functionality the employee can access.

## When to use

When deciding how to grant employees access within the B2B Components, or when a newly created employee should start with a predefined set of permissions.

## Key steps / config

- Create roles containing the needed permissions and assign one role per employee.
- The business partner can mark a role as **default**; it is preselected when a new employee is created.

## Gotchas

- An employee can hold only one role, so combinations of permissions must be modelled as a single role.

## Code check (6.7.15.1)
- unverified `default role` — B2B roles are part of the Shopware Commercial B2B extension, not in core/storefront/administration; out of scope
- unverified `role` — role-to-employee assignment lives in the Commercial B2B extension; out of scope
