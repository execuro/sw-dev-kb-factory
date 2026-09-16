---
id: platform/dev/6.6/guides/plugins/plugins/administration/permissions-error-handling/add-acl-rules.md
title: Adding permissions
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/administration/permissions-error-handling/add-acl-rules.html
sourceHash: bace31375054aa69382fdce4b0900be30942ece6
keywords: ["ACL", "addPrivilegeMappingEntry", "acl.can", "privileges service", "permissions", "additional_permissions", "viewer editor creator deleter", "getPrivileges", "enrichPrivileges", "privilege meta", "Shopware.Service"]
summary: How to register Administration ACL privileges, protect routes/menu entries/shortcuts, and check privileges with the acl service.
lastBuilt: 2026-09-15
---
## What it is

Explains Access Control Lists (ACL) in the Shopware 6 Administration: how roles are made of finely granular admin privileges assignable to users, and how a plugin registers, protects with, and checks those privileges.

## When to use

Use this when a plugin needs its own permission checks — protecting routes, menu entries, or UI elements based on user roles.

## Key steps / config

Privileges are identified as `key.role` (e.g. `product.viewer`). Two categories exist:
- `permissions`: normal CRUD-shaped privileges with fixed roles `viewer`, `editor`, `creator`, `deleter`.
- `additional_permissions`: non-CRUD actions (e.g. `system.clear_cache`), with a free-form role key.

Register/extend privileges via the privileges service:

```javascript
Shopware.Service('privileges').addPrivilegeMappingEntry({
    category: 'permissions',
    parent: null,
    key: 'your_key',
    roles: {
        viewer: { privileges: [], dependencies: [] },
        editor: { privileges: [], dependencies: [] },
        creator: { privileges: [], dependencies: [] },
        deleter: { privileges: [], dependencies: [] }
    }
});
```

`privileges` entries use the shape `entity_name:operation` (e.g. `product:read`); `dependencies` list other identifiers (e.g. `product.viewer`) auto-checked alongside. Import this file via `main.js`, recommended layout: `<component>/acl/index.js` imported from the component's `index.js`.

Reuse another privilege set with `Shopware.Service('privileges').getPrivileges('rule.viewer')`.

Protect a route:

```javascript
Module.register('your-plugin-module', {
    routes: {
        detail: {
            meta: { privilege: 'your_key.your_role' }
        }
    }
});
```

Protect a navigation entry or `settingsItem` the same way via a `privilege` property.

Add snippets at `sw.privileges.${category}.${key}.label` (and `sw.privileges.${category}.${key}.${role_key}` for `additional_permissions`).

Check privileges in a component (inject the `acl` service):

```javascript
Shopware.Component.register('your-plugin-component', {
    inject: ['acl'],
    methods: {
        allowSaving() {
            return this.acl.can('sales_channel.creator');
        }
    }
});
```

Add custom privileges to existing roles by overriding the plugin's `enrichPrivileges()` PHP method:

```php
class SwagTestPluginAcl extends Plugin
{
    public function enrichPrivileges(): array
    {
        return [
            'product.viewer' => ['my_custom_privilege:read'],
        ];
    }
}
```

## Essential identifiers

- `Shopware.Service('privileges').addPrivilegeMappingEntry({ category, parent, key, roles })`
- `Shopware.Service('privileges').getPrivileges(identifier)`
- `acl.can(identifier)` / `Shopware.Service('acl')`
- `Plugin::enrichPrivileges()`
- `meta.privilege` route/navigation key

## Gotchas

ACL rules in the Administration can be circumvented by calling the backend API directly — they only enable/disable/hide Administration UI, they are not API permissions. Having a privilege on a related entity does not grant access to the referenced module itself (e.g. `product.viewer` with a `rule.viewer` dependency still doesn't grant access to the `rule` module).
