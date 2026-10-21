---
id: platform/dev/6.7/guides/plugins/plugins/administration/permissions-error-handling/add-acl-rules.md
title: Adding Permissions
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/permissions-error-handling/add-acl-rules.html
sourceHash: 402ab536e0cc95102736cfbcc0cd7dae61b59232
codeCheckedAgainst: "6.7.15.1"
keywords: ["acl", "addPrivilegeMappingEntry", "getPrivileges", "acl.can", "enrichPrivileges", "additional_permissions", "permissions", "privileges", "meta.privilege", "sw-privileges", "admin roles", "user permissions", "viewer editor creator deleter"]
summary: "Register ACL privileges (addPrivilegeMappingEntry), protect routes, menus and shortcuts, check acl.can(), extend roles via enrichPrivileges()."
lastBuilt: 2026-10-21
---
## What it is

How a plugin adds Access Control List (ACL) admin privileges to the Administration: registering privilege mappings shown in Users & Permissions roles, protecting routes, menu entries and shortcuts, translating privilege labels, checking privileges in components, and adding plugin privileges to existing roles from PHP.

## When to use

A plugin module or feature should only be visible/usable for users whose role grants it, or a plugin entity's API privileges must be granted together with an existing admin privilege (e.g. `product.viewer`).

## Key steps / config

**Identifiers** are `<key>.<role>`. Category `permissions` (CRUD, grid) uses roles `viewer`, `editor`, `creator`, `deleter` (e.g. `product.viewer`); category `additional_permissions` (own card, non-CRUD) uses free role names (e.g. `system.clear_cache`).

1. **Register a mapping** — in e.g. `<your-component>/acl/index.js`, imported by the component's `index.js`, and loaded from `main.js` before the user opens the role detail page:
   ```javascript
   Shopware.Service('privileges').addPrivilegeMappingEntry({
       category: 'permissions',      // or 'additional_permissions'
       parent: null,                 // or a parent key, e.g. 'catalogues'
       key: 'your_key',
       roles: {
           viewer: { privileges: ['product_review:read'], dependencies: [] },
           editor: { privileges: ['product_review:update'], dependencies: ['your_key.viewer'] },
       },
   });
   ```
   `privileges` are API permissions `entity_name:operation`; `dependencies` are other identifiers auto-checked with this role. Calling it again with an existing `category` + `key` merges roles into the existing entry (extend core keys such as `product`).
2. **Reuse other mappings** — put `Shopware.Service('privileges').getPrivileges('rule.viewer')` inside a `privileges` array; it is resolved lazily to that identifier's privileges incl. dependencies (no module access is granted).
3. **Protect a route** — `meta: { privilege: 'your_key.your_role' }` on the route in `Module.register(...)`.
4. **Protect menu entries** — `privilege: 'your_key.your_role'` on a `navigation` item or a `settingsItem` item.
5. **Protect shortcuts** — in a component's `shortcuts` option, use an object `{ active() { return this.acl.can('product.editor'); }, method: 'onSave' }` (`active` may also be a boolean) instead of a method-name string.
6. **Check in code** — `inject: ['acl']`, then `this.acl.can('sales_channel.creator')`, or `v-if="acl.can('review.editor')"` in templates; for disabled-element tooltips use snippet `sw-privileges.tooltip.warning`.
7. **Snippets** — group label `sw-privileges.<category>.<key>.label`; role label (additional permissions only) `sw-privileges.additional_permissions.<key>.<role>`:
   ```json
   { "sw-privileges": { "permissions": { "review": { "label": "..." } },
     "additional_permissions": { "system": { "label": "...", "clear_cache": "..." } } } }
   ```
8. **Add plugin privileges to existing roles** — override `enrichPrivileges(): array` in the plugin base class (`Shopware\Core\Framework\Plugin`), returning `['product.viewer' => ['my_custom_privilege:read', ...], ...]`; a subscriber merges them at runtime.

## Essential identifiers

- `Shopware.Service('privileges')`, `addPrivilegeMappingEntry()`, `getPrivileges()`
- `Shopware.Service('acl')`, `acl.can(identifier)`
- `category`, `parent`, `key`, `roles`, `privileges`, `dependencies`
- `permissions`, `additional_permissions`
- `meta.privilege`, `navigation[].privilege`, `settingsItem[].privilege`, `shortcuts` / `active`
- `sw-privileges.tooltip.warning`
- `Shopware\Core\Framework\Plugin::enrichPrivileges()`

## Gotchas

- Admin ACL only hides/disables UI; direct API calls to the backend bypass it. Admin privileges are not API permissions — the API permissions are what you list in `privileges`.
- `can()` returns `true` for admin users and for an empty identifier.
- Navigating to a route whose `meta.privilege` the user lacks redirects to `sw.privilege.error.index`.
- `addPrivilegeMappingEntry` silently rejects (warning only) entries that are not objects or lack `category`, `parent` or `key` — pass `parent: null` explicitly.
- The source writes snippet paths as `sw.privileges.${category}...`; the Administration actually resolves `sw-privileges.` (dash), matching the source's JSON sample.
- The source shows `shortcuts` inside `Module.register`; the shortcut plugin reads `shortcuts` from a component's options.
- The source's `getPrivileges` example lists `'product.read'`; API privileges use `entity:operation` (`product:read`).

## Code check (6.7.15.1)
- confirmed `PrivilegesService::addPrivilegeMappingEntry()` — merges roles for an existing category+key, else pushes; requires `category`, `parent`, `key` — vendor/shopware/administration/Resources/app/administration/src/app/service/privileges.service.ts:236
- confirmed `PrivilegesService::getPrivileges()` — returns a lazy function resolved when privileges are collected — vendor/shopware/administration/Resources/app/administration/src/app/service/privileges.service.ts:193
- confirmed `AclService::can()` — true for admins or empty key, else checks session `userPrivileges` — vendor/shopware/administration/Resources/app/administration/src/app/service/acl.service.ts:10
- confirmed `meta.privilege` — router guard redirects to `sw.privilege.error.index` — vendor/shopware/administration/Resources/app/administration/src/core/factory/router.factory.js:138
- confirmed `child.privilege` — admin menu filters entries via `acl.can` — vendor/shopware/administration/Resources/app/administration/src/app/component/structure/sw-admin-menu/index.js:705
- corrected `shortcuts` — docs: option of `Module.register`; code reads `this.$options.shortcuts` of a component — vendor/shopware/administration/Resources/app/administration/src/app/plugin/shortcut.plugin.js:175
- confirmed `active` — function or boolean on an object shortcut — vendor/shopware/administration/Resources/app/administration/src/app/plugin/shortcut.plugin.js:192
- corrected `sw-privileges.permissions` — docs: `sw.privileges.${category}.${key}.label`; code uses `sw-privileges.permissions.${key}.label` — vendor/shopware/administration/Resources/app/administration/src/module/sw-users-permissions/components/sw-users-permissions-permissions-grid/index.js:57
- confirmed `sw-privileges.tooltip.warning` — core snippet "You have insufficient permissions." — vendor/shopware/administration/Resources/app/administration/src/app/snippet/en.json:1597
- confirmed `Plugin::enrichPrivileges()` — base returns `[]`, merged by `PluginAclPrivilegesSubscriber` — vendor/shopware/core/Framework/Plugin.php:116
