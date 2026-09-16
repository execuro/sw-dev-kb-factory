---
id: platform/dev/6.6/products/extensions/b2b-components/employee-management/guides/b2b-roles.md
title: B2B Roles
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/products/extensions/b2b-components/employee-management/guides/b2b-roles.html
sourceHash: 6ed85959c7529fbaae7656c6d663ac2c516c46d7
keywords: ["B2B roles", "role management", "default role", "employee permissions", "business partner", "role assignment", "employee role", "B2B components", "permission binding", "company role"]
summary: "Roles bind permissions to employees; a business partner can set a default role for new employees."
lastBuilt: "2026-09-15"
---
## What it is

This page describes roles in the B2B Employee Management component. A role binds multiple permissions to employees within a company context; every employee can have one assigned role, and based on that role's permissions the employee gains access to specific information and functionality.

## Key steps / config

A business partner can create a **default** role, which is then selected automatically whenever a new employee is created — avoiding the need to assign a role manually to every new employee.

## Essential identifiers

- Role — the entity bundling permissions that is assigned to an employee, one per employee.
- Default role — the role a business partner can flag so it is pre-selected when creating a new employee.
