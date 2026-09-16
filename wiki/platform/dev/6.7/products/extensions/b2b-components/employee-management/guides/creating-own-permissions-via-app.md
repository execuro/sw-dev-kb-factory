---
id: platform/dev/6.7/products/extensions/b2b-components/employee-management/guides/creating-own-permissions-via-app.md
title: Create permissions via App
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-components/employee-management/guides/creating-own-permissions-via-app.html
sourceHash: d93ac8f7317faf7cb91ac9d03917a39900bf8510
codeCheckedAgainst: "6.7.13.0"
keywords: ["/store-api/permission", "b2b.role-edit.permissions", "employee.read", "b2b permissions", "employee management", "app permissions", "custom permission", "role permissions", "store api", "permission snippet", "b2b components"]
summary: "B2B apps register custom role permissions via /store-api/permission; names must be unique; labels go in b2b.role-edit.permissions.[name] snippets."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/products/extensions/b2b-components/employee-management/guides/creating-own-permissions-via-plugin.md"]
---
## What it is

How an app (as opposed to a plugin) adds its own permissions to the B2B Employee Management role system: the app calls the Store API and the permissions it registers are merged with those defined by Shopware and by plugins.

## When to use

You build a Shopware app for a shop running the B2B Components Employee Management module and want business partners to be able to grant or deny app-specific actions to employee roles.

## Key steps / config

1. Send a request to the Store API route `/store-api/permission`, passing the required parameters for the new permission.
2. Shopware merges the app permission with the permissions already registered by Shopware and plugins.
3. Choose a unique permission name. An existing name such as `employee.read` cannot be registered again by an app or a plugin.
4. Add a label snippet for the permission in the namespace `b2b.role-edit.permissions.[name]`, replacing `[name]` with the permission name, e.g. `b2b.role-edit.permissions.order.delete`.

## Essential identifiers

- `/store-api/permission` — Store API route apps use to create/extend permissions
- `b2b.role-edit.permissions.[name]` — snippet namespace for permission labels
- `employee.read` — example of a built-in permission name already in use

## Gotchas

- Permission names are globally unique across Shopware, plugins and apps; a duplicate name is rejected, so namespace your permission names.
- The source does not list the request payload parameters for `/store-api/permission`.

## Code check (6.7.13.0)
- unverified `/store-api/permission` — route belongs to the commercial B2B Components package, not installed under vendor/shopware/{core,storefront,administration}
- unverified `b2b.role-edit.permissions` — snippet namespace ships with B2B Components, not present in the installed vendor roots
- unverified `employee.read` — permission defined by B2B Employee Management, not present in the installed vendor roots
- confirmed `b2b_employee` — core usage-data allow list references the B2B employee entity, the B2B package itself is not installed — vendor/shopware/core/System/UsageData/usage-data-allow-list.json:2084
