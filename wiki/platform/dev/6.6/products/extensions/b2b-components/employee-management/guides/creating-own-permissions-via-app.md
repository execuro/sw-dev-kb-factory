---
id: platform/dev/6.6/products/extensions/b2b-components/employee-management/guides/creating-own-permissions-via-app.md
title: Create permissions via App
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/products/extensions/b2b-components/employee-management/guides/creating-own-permissions-via-app.html
sourceHash: d93ac8f7317faf7cb91ac9d03917a39900bf8510
keywords: ["permission", "permissions", "App", "Store API", "store-api/permission", "employee.read", "b2b.role-edit.permissions", "snippet", "snippets", "B2B", "employee management", "role permissions", "custom permission", "app permission"]
summary: Apps extend B2B employee-management permissions by calling the Store API `/store-api/permission` route with a uniquely named permission.
lastBuilt: 2026-09-15
---
## What it is

Describes how an App adds new B2B employee-management permissions by calling the Store API, rather than by shipping PHP code as a plugin would.

## When to use

Use this when an App needs to introduce a custom permission that B2B employee roles can be granted, alongside the permissions Shopware ships and any permissions added by installed plugins.

## Key steps / config

1. The App sends a request to the Store API, passing the required parameters to the `/store-api/permission` route.
2. Once the request is processed, the newly created permission is merged into the set of already existing permissions — those created by Shopware itself and those added by plugins.
3. Choose a permission name that is not already taken: permission names must be unique. For example, `employee.read` is already used by Shopware, so an App or plugin cannot register another permission with that exact name.
4. Add a translation for the new permission under the namespace `b2b.role-edit.permissions.[name]`, replacing the placeholder with the new permission's name, e.g. `b2b.role-edit.permissions.order.delete`.

## Essential identifiers

- Route: `/store-api/permission`
- Snippet namespace: `b2b.role-edit.permissions.[name]`
- Example snippet key: `b2b.role-edit.permissions.order.delete`
- Reserved example name: `employee.read`

## Gotchas

Permission names are unique across the whole system: an App cannot reuse a name already registered by Shopware core or by a plugin (`employee.read` is given as the conflicting example). Because a new permission needs a human-readable label, it should be added via a snippet rather than left untranslated.
