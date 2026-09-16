---
id: platform/dev/6.7/guides/plugins/plugins/administration/permissions-error-handling/_index.md
title: Permissions and Error Handling
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/permissions-error-handling/
sourceHash: 029a1eb6fb39d559cc933b78980488029a2e96e9
codeCheckedAgainst: "6.7.13.0"
keywords: ["acl", "privileges", "addPrivilegeMappingEntry", "acl.can", "mapPropertyErrors", "mapPageErrors", "access control", "permissions", "error handling", "api validation errors", "administration security", "admin roles"]
summary: Overview of Administration guides for ACL privileges (routes, menu entries, shortcuts) and handling/mapping API validation errors in components and pages.
lastBuilt: 2026-09-15
---
## What it is

Section overview for two Administration plugin guides: access control (ACL) and error management. Together they cover how a plugin integrates with the Administration's permission system and how it gives users feedback on API validation errors.

## When to use

Start here when a plugin must:

- define and register custom ACL privileges;
- protect routes, menu entries and keyboard shortcuts behind privileges;
- handle API validation errors in components;
- surface and map errors in forms and on pages (e.g. flag a tab that contains an invalid field).

## Key steps / config

The section contains two guides:

1. **Add ACL Rules** ("Adding Permissions") — register admin privileges with the `privileges` service (`Shopware.Service('privileges').addPrivilegeMappingEntry({ category, parent, key, roles })`), protect routes and navigation with a `privilege` value, and check rights anywhere with the `acl` service's `acl.can(identifier)`.
2. **Add Error Handling** — read API errors from the error store (`getApiError`, `getApiErrorFromPath`) and map them to computed properties with the component helpers `mapPropertyErrors` and `mapPageErrors` from `Shopware.Component.getComponentHelper()`.

## Essential identifiers

- `Shopware.Service('privileges')`, `addPrivilegeMappingEntry`
- `Shopware.Service('acl')`, `acl.can`
- `Shopware.Component.getComponentHelper()`, `mapPropertyErrors`, `mapPageErrors`

## Code check (6.7.13.0)
- confirmed `addPrivilegeMappingEntry` — public method of the privileges service — vendor/shopware/administration/Resources/app/administration/src/app/service/privileges.service.ts:257
- confirmed `AclService::can()` — returns true for admins, else checks session userPrivileges — vendor/shopware/administration/Resources/app/administration/src/app/service/acl.service.ts:10
- confirmed `mapPropertyErrors` — exported error-mapping helper — vendor/shopware/administration/Resources/app/administration/src/app/service/map-errors.service.ts:11
- confirmed `mapPageErrors` — exported page-error helper — vendor/shopware/administration/Resources/app/administration/src/app/service/map-errors.service.ts:66
- confirmed `getComponentHelper` — exposed on `Shopware.Component` — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:137
