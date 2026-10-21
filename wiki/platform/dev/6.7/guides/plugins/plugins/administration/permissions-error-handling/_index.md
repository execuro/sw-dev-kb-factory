---
id: platform/dev/6.7/guides/plugins/plugins/administration/permissions-error-handling/_index.md
title: Permissions and Error Handling
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/permissions-error-handling/
sourceHash: 029a1eb6fb39d559cc933b78980488029a2e96e9
codeCheckedAgainst: "6.7.15.1"
keywords: ["acl", "permissions", "privileges", "access control", "error handling", "api validation errors", "form errors", "privileges service", "acl service", "administration security"]
summary: "Section overview for Administration ACL (custom privileges; protected routes, menu entries, shortcuts) and API validation error handling in forms."
lastBuilt: 2026-10-21
---
## What it is

Section overview for access control and error management in the Shopware Administration, so plugins integrate securely and give users proper feedback. It groups two guides: Add ACL Rules and Add Error Handling.

## When to use

Start here when a plugin needs to:

- define and register custom ACL privileges;
- protect routes, menu entries and shortcuts;
- handle API validation errors in components;
- surface and map errors in forms and pages.

## Key steps / config

- Privileges are registered through the `privileges` service (`Shopware.Service('privileges')`) and checked at runtime through the `acl` service (`Shopware.Service('acl').can(identifier)`); details are on the Add ACL Rules page.
- Error handling for API validation errors is covered on the Add Error Handling page.

## Code check (6.7.15.1)
- confirmed `PrivilegesService::addPrivilegeMappingEntry()` — entry point for registering privileges — vendor/shopware/administration/Resources/app/administration/src/app/service/privileges.service.ts:236
- confirmed `AclService::can()` — returns true for admins, otherwise checks the session's user privileges — vendor/shopware/administration/Resources/app/administration/src/app/service/acl.service.ts:10
