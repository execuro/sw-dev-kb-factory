---
id: platform/dev/6.7/resources/references/adr/2020-08-28-import-acl-privileges-from-other-roles.md
title: Import ACL privileges from other roles
docType: developer
version: "6.7"
versions:
  - "6.7"
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2020-08-28-import-acl-privileges-from-other-roles.html
sourceHash: bfcce2aaf39337eb6ee87b82a100f1e84c37bceb
codeCheckedAgainst: "6.7.13.0"
keywords: ["acl", "privileges", "permissions", "getPrivileges", "addPrivilegeMappingEntry", "privileges service", "rule.creator", "role dependencies", "admin roles", "administration", "import privileges", "adr"]
summary: "ADR: reuse another admin role's ACL privileges inside a privilege mapping via Shopware.Service('privileges').getPrivileges('<key>.<role>')."
lastBuilt: 2026-09-15
---
## What it is

Architecture decision record (2020-08-28): an Administration module can import all privileges of another module's role (e.g. the rule builder or media manager) into its own ACL role definition, via a helper on the `privileges` service, instead of duplicating them or declaring the other module as a dependency.

## When to use

- A module embeds components (rule builder, media manager) that need many privileges of another module.
- You want those privileges without adding the other module's role to `dependencies`, which would give the user full access to that module in the Administration.

## Key steps / config

Call `Shopware.Service('privileges').getPrivileges('<key>.<role>')` directly inside a role's `privileges` array of `addPrivilegeMappingEntry`:

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

How the installed service resolves it:

- `getPrivileges(privilegeKey)` returns a function (not an array); it is evaluated lazily when privileges are collected.
- During collection, any function entry in `privileges` is called and its result (the target role's privileges plus those of its dependencies) is merged in; the admin role key itself (e.g. `rule.creator`) is not added.

## Essential identifiers

- `Shopware.Service('privileges')`
- `addPrivilegeMappingEntry` (`category`, `parent`, `key`, `roles.<role>.privileges`, `roles.<role>.dependencies`)
- `getPrivileges('rule.creator')`

## Gotchas

- Changes to the imported role propagate automatically to every module importing it — intended, but it widens those roles too.
- The installed `sw-promotion-v2` ACL uses `parent: 'marketing'` and a much longer privilege list; the ADR snippet is simplified.

## Code check (6.7.13.0)
- confirmed `getPrivileges()` — returns a closure calling _getPrivilegesWithDependencies with admin privilege disabled — vendor/shopware/administration/Resources/app/administration/src/app/service/privileges.service.ts:210
- confirmed `addPrivilegeMappingEntry()` — public method on the privileges service — vendor/shopware/administration/Resources/app/administration/src/app/service/privileges.service.ts:257
- confirmed `privilege()` — function entries in privileges are invoked and merged — vendor/shopware/administration/Resources/app/administration/src/app/service/privileges.service.ts:156
- confirmed `rule.creator` — imported by the promotion editor role — vendor/shopware/administration/Resources/app/administration/src/module/sw-promotion-v2/acl/index.js:57
- confirmed `promotion.viewer` — editor dependency in promotion ACL — vendor/shopware/administration/Resources/app/administration/src/module/sw-promotion-v2/acl/index.js:60
- corrected `parent` — docs: parent null; installed promotion ACL uses marketing — vendor/shopware/administration/Resources/app/administration/src/module/sw-promotion-v2/acl/index.js:8
