---
id: platform/dev/6.7/guides/plugins/plugins/administration/permissions-error-handling/add-acl-rules.md
title: Adding Permissions
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/permissions-error-handling/add-acl-rules.html
sourceHash: 402ab536e0cc95102736cfbcc0cd7dae61b59232
codeCheckedAgainst: "6.7.13.0"
keywords: ["addPrivilegeMappingEntry", "getPrivileges", "acl.can", "enrichPrivileges", "additional_permissions", "meta.privilege", "sw-privileges", "acl", "admin privileges", "permissions", "user roles", "access control list", "protect routes"]
summary: Register Administration ACL privileges, protect routes/menus/shortcuts, check rights with acl.can, and add plugin privileges to roles via enrichPrivileges.
lastBuilt: 2026-09-15
---
## What it is

How a plugin adds ACL admin privileges to the Shopware 6 Administration: privilege mappings shown in Users & Permissions roles, protected routes, menu entries and shortcuts, privilege snippets, rights checks in components, and adding plugin privileges to existing roles from PHP.

## When to use

- Your plugin module must be hidden or restricted for users whose role lacks rights.
- You need a non-CRUD permission (e.g. "clear cache").
- Existing roles (e.g. `product.viewer`) must automatically receive your plugin's API privileges.

## Key steps / config

**Identifiers.** An admin privilege is `<key>.<role>`, e.g. `product.viewer`. Category `permissions` uses the roles `viewer`, `editor`, `creator`, `deleter`; category `additional_permissions` accepts any role name (e.g. `system.clear_cache`). They control Administration UI elements only, not API access.

**1. Register a mapping** (recommended in `<your-component>/acl/index.js`, imported by the component's `index.js`, reachable from `<plugin root>/src/Resources/app/administration/src/main.js`; must run before the role detail page is opened):

```javascript
Shopware.Service('privileges').addPrivilegeMappingEntry({
    category: 'permissions',   // or 'additional_permissions'
    parent: null,              // e.g. 'catalogues'
    key: 'your_key',
    roles: {
        viewer: { privileges: ['product_review:read'], dependencies: [] },
        editor: { privileges: ['product_review:update'], dependencies: ['your_key.viewer'] }
    }
});
```

`privileges` are API permissions `entity_name:operation`; `dependencies` are admin identifiers auto-checked with the role. Calling it again with an existing `category` + `key` (e.g. `product`) extends that entry: existing roles are deep-merged, new role names added.

**2. Reuse mappings.** Put `Shopware.Service('privileges').getPrivileges('rule.viewer')` inside a `privileges` array; it returns a lazy function resolving that identifier's privileges plus dependencies. It does not grant access to the `rule` module itself.

**3. Protect routes, menu, settings items, shortcuts:**

```javascript
Module.register('your-plugin-module', {
    routes: { detail: { component: 'your-plugin-detail', path: 'your-plugin',
        meta: { privilege: 'your_key.your_role' } } },
    navigation: [{ id: 'your-plugin', privilege: 'your_key.your_role' }],
    settingsItem: [{ group: 'system', to: 'sw.your.plugin.detail', privilege: 'your_key.your_role' }],
    shortcuts: { 'SYSTEMKEY+S': { active() { return this.acl.can('product.editor'); }, method: 'onSave' } }
});
```

**4. Snippets** live under `sw-privileges`: group label `sw-privileges.<category>.<key>.label`; role label (only for `additional_permissions`) `sw-privileges.additional_permissions.<key>.<role>`:

```json
{ "sw-privileges": {
    "permissions": { "review": { "label": "Reviews" } },
    "additional_permissions": { "system": { "label": "System", "clear_cache": "Clear cache" } } } }
```

**5. Check rights.** `inject: ['acl']` (or `Shopware.Service('acl')`), then `this.acl.can('sales_channel.creator')`, or `v-if="acl.can('review.editor')"` in templates. For a disabled button with tooltip use `v-tooltip` with `message: $tc('sw-privileges.tooltip.warning')` and `showOnDisabledElements: true`.

**6. Enrich roles from PHP.** Override `enrichPrivileges(): array` in your `Shopware\Core\Framework\Plugin` subclass, returning role identifier => extra privileges, e.g. `'product.viewer' => ['my_custom_privilege:read']`. A core subscriber merges them into ACL roles when roles are loaded, for active plugins.

## Essential identifiers

- `Shopware.Service('privileges')`: `addPrivilegeMappingEntry`, `getPrivileges`
- `Shopware.Service('acl')`: `acl.can(identifier)`
- `meta.privilege`, navigation/settingsItem `privilege`, shortcut `active`
- `sw-privileges.tooltip.warning`
- `Shopware\Core\Framework\Plugin::enrichPrivileges()`

## Gotchas

- Administration ACL can be bypassed by direct API calls.
- `addPrivilegeMappingEntry` only warns and skips an entry missing `category`, `parent` or `key` — pass `parent: null` when there is no parent.
- The docs' prose writes snippet paths as `sw.privileges.${category}...`; the Administration reads `sw-privileges.…`, matching the docs' JSON.
- `acl.can` returns true for admin users and for an empty identifier; a shortcut's `active` may be a function or a boolean.

## Code check (6.7.13.0)
- confirmed `PrivilegesService::addPrivilegeMappingEntry()` — merges roles into existing category+key entries — vendor/shopware/administration/Resources/app/administration/src/app/service/privileges.service.ts:257
- confirmed `parent` — mapping without `parent` is rejected with a warning — vendor/shopware/administration/Resources/app/administration/src/app/service/privileges.service.ts:308
- confirmed `PrivilegesService::getPrivileges()` — returns a lazy function — vendor/shopware/administration/Resources/app/administration/src/app/service/privileges.service.ts:210
- confirmed `AclService::can()` — admin or empty key returns true — vendor/shopware/administration/Resources/app/administration/src/app/service/acl.service.ts:10
- confirmed `meta.privilege` — router guard checks `acl.can(to.meta.privilege)` — vendor/shopware/administration/Resources/app/administration/src/core/factory/router.factory.js:138
- confirmed `privilege` — optional on SettingsItem (and Navigation) manifest types — vendor/shopware/administration/Resources/app/administration/src/core/factory/module.factory.ts:80
- confirmed `active` — shortcut active may be boolean or function — vendor/shopware/administration/Resources/app/administration/src/app/plugin/shortcut.plugin.js:187
- corrected `sw-privileges` — docs: snippet path `sw.privileges.${category}.${key}.label` — vendor/shopware/administration/Resources/app/administration/src/module/sw-users-permissions/components/sw-users-permissions-permissions-grid/index.js:57
- confirmed `sw-privileges.tooltip.warning` — global snippet "You have insufficient permissions." — vendor/shopware/administration/Resources/app/administration/src/app/snippet/en.json:1572
- confirmed `Plugin::enrichPrivileges()` — default returns `[]`, merged by PluginAclPrivilegesSubscriber — vendor/shopware/core/Framework/Plugin.php:116
