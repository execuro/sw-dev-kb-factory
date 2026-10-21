---
id: platform/dev/6.7/products/extensions/b2b-components/employee-management/guides/creating-own-permissions-via-app.md
title: Create permissions via App
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-components/employee-management/guides/creating-own-permissions-via-app.html
sourceHash: d93ac8f7317faf7cb91ac9d03917a39900bf8510
codeCheckedAgainst: "6.7.15.1"
keywords: ["/store-api/permission", "b2b permissions", "app permissions", "custom permission", "b2b.role-edit.permissions", "b2b.role-edit.permissions.order.delete", "snippets", "employee.read", "permission name", "app", "b2b employee management"]
summary: Apps create B2B permissions via Store API route /store-api/permission; names must be unique, labels are snippets under b2b.role-edit.permissions.
lastBuilt: 2026-10-21
---
## What it is

How an app extends the B2B Employee Management permission set: an app has to use the API to create and extend permissions, by calling the Store API.

## When to use

When an app needs its own B2B permission that roles can grant to employees.

## Key steps / config

1. Send a request to the Store API route `/store-api/permission` with the required parameters for the new permission.
2. The permissions created by Shopware or added by plugins are then merged with the app-created permissions.
3. Pick a unique permission name; existing names (e.g. `employee.read`) cannot be added again by apps or plugins.
4. Add a snippet for the permission label in the namespace `b2b.role-edit.permissions.[name]`, replacing `[name]` with the permission name, e.g. `b2b.role-edit.permissions.order.delete`.

## Essential identifiers

- `/store-api/permission`
- `b2b.role-edit.permissions.[name]`

## Gotchas

- Permission names are unique across Shopware, plugins and apps; a name already in use such as `employee.read` cannot be added.

## Code check (6.7.15.1)
- unverified `/store-api/permission` — route of the Shopware Commercial B2B extension, not in core/storefront/administration; out of scope
- unverified `b2b.role-edit.permissions.[name]` — snippet namespace of the Commercial B2B extension; out of scope
- unverified `employee.read` — base permission of the Commercial B2B extension; out of scope
