---
id: platform/dev/6.6/resources/references/adr/2020-08-28-import-acl-privileges-from-other-roles.md
title: Import ACL privileges from other roles
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/resources/references/adr/2020-08-28-import-acl-privileges-from-other-roles.html
sourceHash: bfcce2aaf39337eb6ee87b82a100f1e84c37bceb
keywords: ["adr", "acl", "privileges", "permissions", "admin roles", "getPrivileges", "addPrivilegeMappingEntry", "Shopware.Service('privileges')", "rule.creator", "privilege mapping", "administration", "dependencies"]
summary: "ADR 2020-08-28: admin modules import another role's ACL privileges via the privileges service getPrivileges() instead of duplicating them."
lastBuilt: 2026-09-15
---
## What it is

An architecture decision record (2020-08-28, area: administration) mirrored from the Shopware 6 repository. It introduces a helper on the Administration `privileges` service that returns all privileges of another module's role, so a role can include them without duplicating the list.

## When to use

When defining ACL privilege mappings for an Administration module whose pages embed components that need privileges from another module (the ADR's examples: the rule builder or the media manager), and you do not want to grant full access to that other module.

## Key steps / config

Problem: such components require many ACL privileges, which would have to be repeated in every module that uses them. Adding the other module to the role's `dependencies` is not an option, because that gives the user full access to that module in the Administration.

Decision: call `Shopware.Service('privileges').getPrivileges('<module>.<role>')` inside the `privileges` array of a role in `addPrivilegeMappingEntry`. It returns the other role's privileges dynamically. Skeleton from the ADR:

```js
Shopware.Service('privileges').addPrivilegeMappingEntry({
    category: 'permissions', parent: null, key: 'promotion',
    roles: {
        viewer: { privileges: ['promotion:read'], dependencies: [] },
        editor: {
            privileges: ['promotion:update',
                Shopware.Service('privileges').getPrivileges('rule.creator')],
            dependencies: ['promotion.viewer']
        }
    }
});
```

## Essential identifiers

- `Shopware.Service('privileges')`
- `addPrivilegeMappingEntry` (keys: `category`, `parent`, `key`, `roles`, `privileges`, `dependencies`)
- `getPrivileges('rule.creator')`
- Privilege strings such as `promotion:read`, `promotion:update`; role references such as `promotion.viewer`

## Gotchas

- `dependencies` references whole roles and grants access to that module; `getPrivileges()` only imports the privilege list, without module access.
- Because privileges are imported dynamically, a change in the imported module's privileges affects every module that imports them.
