---
id: platform/dev/6.7/products/extensions/b2b-components/employee-management/guides/b2b-roles.md
title: B2B Roles
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-components/employee-management/guides/b2b-roles.html
sourceHash: 6ed85959c7529fbaae7656c6d663ac2c516c46d7
codeCheckedAgainst: "6.7.13.0"
keywords: ["b2b roles", "role", "default role", "employee role", "employee", "business partner", "permissions", "b2b employee management", "access control", "b2b components"]
summary: B2B roles bundle permissions for employees; each employee has one role, and a business partner can set a default role preselected for new employees.
lastBuilt: 2026-09-15
---
## What it is

Roles in the B2B Employee Management component bind multiple permissions to employees. Every employee can have one assigned role; based on that role and its permissions, the employee gets access to certain information and functionality.

## When to use

When setting up access for B2B employees or deciding which role new employees receive by default.

## Key steps / config

- Create roles containing the needed permissions and assign one role per employee.
- The business partner can create a **default** role, which is selected by default when a new employee is created.

## Code check (6.7.13.0)
- unverified `role` — B2B role entity belongs to Shopware Commercial, not in the installed vendor/shopware roots
- unverified `default role` — Shopware Commercial B2B business partner setting, out of scope
