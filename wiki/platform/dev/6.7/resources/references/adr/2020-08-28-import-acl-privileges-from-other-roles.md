---
id: platform/dev/6.7/resources/references/adr/2020-08-28-import-acl-privileges-from-other-roles.md
title: Import ACL privileges from other roles
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2020-08-28-import-acl-privileges-from-other-roles.html
sourceHash: bfcce2aaf39337eb6ee87b82a100f1e84c37bceb
codeCheckedAgainst: "6.7.15.1"
keywords: ["acl", "privileges", "addPrivilegeMappingEntry", "getPrivileges", "Shopware.Service('privileges')", "privilege mapping", "admin roles", "role dependencies", "permissions", "rule builder", "media manager", "adr"]
summary: "ADR: import ACL privileges of another admin role via Shopware.Service('privileges').getPrivileges() inside addPrivilegeMappingEntry."
lastBuilt: 2026-10-21
---
## What it is

An architecture decision record (2020-08-28, area: administration) on reusing ACL privileges of another Administration module's role instead of duplicating them. Components such as the rule builder or the media manager need many privileges, and every module that embeds them needs those privileges too. Adding the other module to `dependencies` is not an option because that grants the user full access to that module in the Administration.

## When to use

When you register a privilege mapping for an Administration module whose views embed a component from another module (e.g. the rule builder inside promotions) and the role needs that component's privileges without a dependency on the whole module.

## Key steps / config

Call `Shopware.Service('privileges').getPrivileges('<module>.<role>')` directly inside a role's `privileges` array in `addPrivilegeMappingEntry`. The helper resolves the other role's privileges (including its dependencies) dynamically at evaluation time:

```js
Shopware.Service('privileges').addPrivilegeMappingEntry({
    category: 'permissions',
    parent: null,
    key: 'promotion',
    roles: {
        viewer: { privileges: ['promotion:read'], dependencies: [] },
        editor: {
            privileges: ['promotion:update', Shopware.Service('privileges').getPrivileges('rule.creator')],
            dependencies: ['promotion.viewer'],
        },
    },
});
```

In the installed code, `getPrivileges(privilegeKey)` returns a function (`() => this._getPrivilegesWithDependencies(privilegeKey, false)`); when the role is resolved, any function found in `privileges` is called and its result is merged into the role's privileges. The admin role key itself (`rule.creator`) is not added, only the privileges it resolves to.

## Essential identifiers

- `Shopware.Service('privileges')`
- `addPrivilegeMappingEntry({ category, parent, key, roles })`
- `getPrivileges('<key>.<role>')`, e.g. `getPrivileges('rule.creator')`
- Role shape: `roles.<role>.privileges` / `roles.<role>.dependencies`

## Gotchas

- Each module lists only its own privileges; imported ones follow the source module, so a change to the imported role's privileges affects every module that imports it.
- `addPrivilegeMappingEntry` called twice for the same `category` + `key` deep-merges the roles into the existing entry rather than replacing it.

## Code check (6.7.15.1)
- confirmed `privileges` — service registered via `addServiceProvider('privileges', ...)` — vendor/shopware/administration/Resources/app/administration/src/app/main.ts:118
- confirmed `PrivilegesService::addPrivilegeMappingEntry()` — public method taking the mapping object — vendor/shopware/administration/Resources/app/administration/src/app/service/privileges.service.ts:236
- confirmed `PrivilegesService::getPrivileges()` — returns a lazy resolver function, not an array — vendor/shopware/administration/Resources/app/administration/src/app/service/privileges.service.ts:193
- confirmed `privileges` function entries — resolved by calling them during role resolution — vendor/shopware/administration/Resources/app/administration/src/app/service/privileges.service.ts:145
- confirmed `existingCategoryKeyCombination` — same category + key merges roles via deepMergeObject — vendor/shopware/administration/Resources/app/administration/src/app/service/privileges.service.ts:253
