# `dev-36` — expected answer

<!-- expected:start -->
| | |
| --- | --- |
| Case | `dev-36` · `dev` · `Administration` |
| Version | `6.7` |
| Status | **confirmed** — verified against shopware/core 6.7.13.0 |
| Reviewed | `2026-09-12` · run `cases-review-2026-09-12-0921-32-41` |
| Core version | `6.7.13.0` |

**Query:** How do I register ACL privileges for my plugin's Administration module and check them in a component or template?

**Expected answer — every fact an answer must contain:**

1. Privileges are registered with `Shopware.Service('privileges').addPrivilegeMappingEntry({ category, parent, key, roles })` from an `acl/index.js` imported by the module (or `main.js`). `category` is `'permissions'` or `'additional_permissions'`; an admin identifier is `key.role` with a **dot** (`swag_example.viewer`), while the granular API privileges listed inside a role use a **colon** (`swag_example:read`). Every role entry must carry both `privileges` **and** `dependencies`: nothing defaults `dependencies`, and the roles detail page dereferences it unguarded, so omitting it throws and breaks the page. Invalid mappings are dropped with a console warning, never an exception.  `[code: administration package — src/app/service/privileges.service.ts:12-24,49-69,126-147,290-317]`
2. Checking is `inject: ['acl']` plus `this.acl.can('swag_example.viewer')` in code, or `acl.can(...)` directly in a template binding — there is no ACL directive. `can()` returns `true` unconditionally for admin users and for an empty key. Declarative gating: `meta: { privilege: … }` on a route is enforced by a global router guard that redirects to `sw.privilege.error.index`; `settingsItem.privilege` hides the settings tile; and a navigation entry's own `privilege` is filtered in the admin menu's `children` / `getChildren` (a leaf entry additionally falls through to the target route's `meta.privilege`).  `[code: administration package — src/app/service/acl.service.ts:6-36, src/core/factory/router.factory.js:137-140, src/app/component/structure/sw-admin-menu-item/index.js:78-95,106-112]`
3. The Administration registration authorizes **nothing** server-side. `Context::isAllowed()` reads `AdminApiSource::$permissions`, which `ApiRequestContextResolver` fills with raw SQL from the `acl_role.privileges` column — that path never consults the JS mappings. The mapping only decides what gets written there when an administrator ticks the boxes and saves the role (`sw-users-permissions-role-detail::saveRole()` expands each `key.role` into its granular privileges). To ship privileges independently of that, override `Plugin::enrichPrivileges()` (base returns `[]`) or write an `acl_role` migration. API-level enforcement is on the colon privileges via `AclCriteriaValidator` / `AclWriteValidator`; an `additional_permissions` identifier bites only where a route declares it in `PlatformRequest::ATTRIBUTE_ACL` or JS checks it.  `[code: Framework/Routing/ApiRequestContextResolver.php:351-368]` `[code: Framework/Api/Context/AdminApiSource.php:73-80]` `[code: Framework/Plugin.php:116-119]` `[code: administration package — src/module/sw-users-permissions/page/sw-users-permissions-role-detail/index.js:165-169]`

**Trap:** The docs' four roles `viewer` / `editor` / `creator` / `deleter` are not validated by the privileges service — but they are hard-coded as the column list of `sw-users-permissions-permissions-grid`, so a `permissions` mapping declaring any other role name renders **no checkbox** and can never be granted there. Free role names belong in `additional_permissions`, which renders one switch per role name instead.

**Official reference URL:** https://developer.shopware.com/docs/guides/plugins/plugins/administration/permissions-error-handling/add-acl-rules.html
<!-- expected:end -->

## Evidence — code (decisive)

Source version `6.7.13.0`. Administration paths are relative to `vendor/shopware/administration/Resources/app/administration/`; core paths to `vendor/shopware/core`.

| fact | citation | excerpt |
| --- | --- | --- |
| Registration is `Shopware.Service('privileges').addPrivilegeMappingEntry({ category, parent, key, roles })` | `src/app/service/privileges.service.ts:186-203` | `addPrivilegeMappingEntry({ category: 'permissions', parent: null, key: 'product', roles: { viewer: { privileges: […], dependencies: [] } } })` |
| `category` is typed as exactly `'permissions' \| 'additional_permissions'`; `key` may be null; `roles` is an open map whose entries each carry `privileges` and `dependencies` | `src/app/service/privileges.service.ts:12-24` | `category: 'permissions' \| 'additional_permissions'; key: null \| string; parent: string; roles: { [key: string]: PrivilegeRole };` |
| Validation is warn-and-skip, not throw: a mapping missing `category`, `parent` or `key` is dropped with a console warning | `src/app/service/privileges.service.ts:257-260,290-317` | `warn('addPrivilegeMappingEntry', 'The privilegeMapping need the property "category".'); return false;` |
| Registering for an existing `(category, key)` pair deep-merges roles into the existing entry | `src/app/service/privileges.service.ts:262-285` | `existingCategoryKeyCombination.roles[role] = object.deepMergeObject(existingCategoryKeyCombination.roles[role], entry);` |
| Two naming levels, distinguished by the separator: admin roles use a dot, API privileges a colon | `src/app/service/privileges.service.ts:49-69` | `* product.viewer => Valid` / `* product:read => Invalid` |
| `dependencies` is dereferenced with only a `!privilegeRole` guard in the service and in the grid — no default is applied anywhere, so a role entry without it throws | `src/app/service/privileges.service.ts:126-147`; `…/sw-users-permissions-permissions-grid/index.js:84-99,130-141` | `const { privileges, dependencies } = privilegeRole; const dependenciesPrivileges = dependencies.reduce(…)` |
| The permissions grid hard-codes the four role columns and renders a checkbox only where the mapping declares that role | `…/sw-users-permissions-permissions-grid/index.js:102-108`; `…/sw-users-permissions-permissions-grid.html.twig:105-133` | `roles() { return ['viewer','editor','creator','deleter']; }` · `<mt-checkbox v-if="permission.roles[role]" …` |
| The verb map viewer→read … deleter→delete exists only for the tooltip text; nothing derives privileges from it | `…/sw-users-permissions-permissions-grid/index.js:160-167` | `const operationMap = { viewer: 'read', editor: 'update', creator: 'create', deleter: 'delete' };` |
| The grid shows only `category === 'permissions'`; `additional_permissions` is rendered by a separate component as one switch per role **name**, with `key: 'app'` split off | `…/sw-users-permissions-permissions-grid/index.js:50-60`; `…/sw-users-permissions-additional-permissions/index.js:36-50`; `…-additional-permissions.html.twig:9-47` | `<mt-switch :model-value="isPrivilegeSelected(privilege.key + '.' + roleName)" …>` |
| Core `additional_permissions` mappings use `parent: null` with a non-null key (`system`, `integration_mcp`, `app`) | `src/module/sw-settings-logging/acl/index.js:5-19` | `addPrivilegeMappingEntry({ category: 'additional_permissions', parent: null, key: 'system', roles: { logging: { privileges: ['log_entry:read', …], dependencies: [] } } })` |
| `getPrivileges('rule.viewer')` returns a **function** resolving another role's privileges lazily | `src/app/service/privileges.service.ts:208-210` | `getPrivileges(privilegeKey: string) { return () => this._getPrivilegesWithDependencies(privilegeKey, false); }` |
| A default privilege set is granted to every admin user regardless of role | `src/app/service/privileges.service.ts:39-46` | `private defaultUserPrivileges = ['language:read', 'locale:read', …];` |
| `acl` is a registered service provider, so components list it in `inject` | `src/app/main.ts:119-121`; `src/module/sw-settings-tag/page/sw-settings-tag-list/index.js:14-18` | `.addServiceProvider('acl', () => { return new AclService(); })` |
| `AclService.can()` returns true unconditionally for admin users and for an empty key; otherwise it checks the session store | `src/app/service/acl.service.ts:6-16` | `can(privilegeKey: string): boolean { if (this.isAdmin() \|\| !privilegeKey) { return true; } …` |
| `hasAccessToRoute` allows access when the route has no `meta` | `src/app/service/acl.service.ts:18-36` | `if (!match.meta) { return true; } return this.can(match.meta.privilege);` |
| In templates the injected service is used directly on attributes | `src/module/sw-settings-tag/page/sw-settings-tag-list/sw-settings-tag-list.html.twig:51,174-176` | `:disabled="!acl.can('tag.creator') \|\| undefined"` |
| Route protection: a global router guard redirects to `sw.privilege.error.index` when `meta.privilege` fails | `src/core/factory/router.factory.js:137-140` | `if (to.meta.privilege && !Shopware.Service('acl').can(to.meta.privilege)) { return { name: 'sw.privilege.error.index' }; }` |
| A navigation entry carries an optional `privilege`, filtered where the entry renders as a child — always the case for a plugin, whose entries must declare `parent` | `src/core/factory/module.factory.ts:55-64,293-300`; `…/sw-admin-menu-item/index.js:106-112`; `…/sw-admin-menu/index.js:607-614` | `children() { return this.entry.children.filter((child) => { if (!child.privilege) { return true; } return this.acl.can(child.privilege); }); }` |
| A leaf entry additionally falls through to the target route's `meta.privilege`; `sw.settings.index` is special-cased to `hasActiveSettingModules()` | `…/sw-admin-menu-item/index.js:78-95,121-125` | `if (this.getLinkToProp && this.getLinkToProp.name) { … return this.hasAccessToRoute(name); }` |
| The module manifest carries the privilege on both the route meta and the `settingsItem` | `src/module/sw-settings-tag/index.js:27-43` | `meta: { parentPath: 'sw.settings.index', privilege: 'tag.viewer' }, … settingsItem: { …, privilege: 'tag.viewer' }` |
| Canonical layout: an `acl/index.js` beside the module index, imported by it | `src/module/sw-settings-tag/acl/index.js:4-12`; `src/module/sw-settings-tag/index.js:4` | `import './acl';` |
| Role dependencies are declared per role and resolved transitively | `src/module/sw-settings-tag/acl/index.js`; `src/app/service/privileges.service.ts:116-118` | `creator: { privileges: ['tag:create'], dependencies: ['tag.viewer', 'tag.editor'] }` |
| The request-time permission list comes from raw SQL over `acl_user_role ⋈ acl_role`, never from the JS mappings | `Framework/Routing/ApiRequestContextResolver.php:351-368,397-415` | `->select('role.privileges')->from('acl_user_role', 'mapping')->innerJoin('mapping', 'acl_role', 'role', …)` |
| `AdminApiSource::isAllowed()` short-circuits only for an admin user; otherwise plain membership | `Framework/Api/Context/AdminApiSource.php:73-80` | `if ($this->isAdmin) { return true; } return \in_array($privilege, $this->permissions, true);` |
| The persisted list is assembled **client-side** on save: each `key.role` is expanded into its granular privileges plus the detailed ones | `…/sw-users-permissions-role-detail/index.js:160-172` | `this.role.privileges = [ ...this.privileges.getPrivilegesForAdminPrivilegeKeys(this.role.privileges), ...this.detailedPrivileges, ].sort();` |
| `Plugin::enrichPrivileges()` returns `[]` in the base class — it must be overridden | `Framework/Plugin.php:113-119` | `public function enrichPrivileges(): array { return []; }` |
| Its subscriber merges the extra privileges into loaded `AclRoleEntity` objects on the DAL `acl_role.loaded` event, for **active** plugins, and only where the role already holds the keyed role (or the key is `all`) | `Framework/Plugin/Subscriber/PluginAclPrivilegesSubscriber.php:26-66` | `if ($additionalRole === AclRoleDefinition::ALL_ROLE_KEY \|\| \in_array($additionalRole, $aclRole->getPrivileges(), true)) { … }` |
| Reads and writes are validated server-side on the colon privileges | `Framework/Api/Acl/AclCriteriaValidator.php:31-38`; `Framework/Api/Acl/AclWriteValidator.php:77` | `$privilege = $entity . ':' . AclRoleDefinition::PRIVILEGE_READ;` |
| An `additional_permissions` identifier is enforced only where a route declares it in `ATTRIBUTE_ACL`, checked by `AclAnnotationValidator` | `Framework/Api/Acl/AclAnnotationValidator.php:42-70`; `Framework/App/Api/AppPrivilegeController.php:34` | `defaults: [PlatformRequest::ATTRIBUTE_ACL => ['system.plugin_maintain']],` |

Absences — things the code shows do **not** exist:

| claim checked | verdict | evidence |
| --- | --- | --- |
| `addPrivilegeMappingEntry` throws or errors on an invalid mapping | absent | `isPrivilegeMapping` only calls `warn()` and returns false; only the plural `addPrivilegeMappingEntries` with a non-array argument uses `error()` — `src/app/service/privileges.service.ts:290-317,325-329` |
| The privileges service validates that a role's API privileges name real entities/actions, or that role names are among the four | absent | No validation of either; strings are stored verbatim and used as `${key}.${role}` — `src/app/service/privileges.service.ts:257-286,290-317` |
| A missing `dependencies` array is defaulted to `[]` somewhere | absent | No default in `getPrivilegeRole`, `addPrivilegeMappingEntry` or the grid; every consumer dereferences `.dependencies` behind a `!privilegeRole` guard only — `src/app/service/privileges.service.ts:84-90,126-141` |
| `Plugin::enrichPrivileges()` grants privileges to the Admin API request context | absent (different path) | The subscriber acts on the DAL `acl_role.loaded` event, while `ApiRequestContextResolver::fetchPermissions()` reads the column with raw SQL and dispatches no `EntityLoadedEvent` — `Framework/Routing/ApiRequestContextResolver.php:351-368`; `PluginAclPrivilegesSubscriber.php:26-31` |
| A dedicated ACL Vue directive (`v-acl` / `v-permission`) exists for templates | absent | Core templates gate on the injected service in bindings; no acl directive is registered among `Shopware.Directive` — `…/sw-settings-tag-list.html.twig:51,174-176` |

Test anchors, where found:

| what it shows | citation |
| --- | --- |
| Unit test pinning `enrichPrivileges` semantics — active plugins only, keyed by a role privilege already on the `acl_role`, merged on `acl_role.loaded` (not in the vendor dist; read at tag v6.7.13.0) | `github:shopware/shopware tests/unit/Core/Framework/Plugin/PluginAclTest.php` |

## Evidence — community (escalation only, never decisive)

| signal | version | state | source |
| --- | --- | --- | --- |
| A plugin mapping entry carrying only `privileges` and no `dependencies` broke the whole Users & Permissions roles detail page, for every user | 6.4.16.1 | closed | https://github.com/shopware/shopware/issues/5556 |
| Privileges added via `enrichPrivileges()` are attached only when the AclRole is **loaded**, not when saved, so a new role must be saved twice | 6.4/6.5-era | closed | https://github.com/shopware/shopware/issues/4087 |
| Recurring: an extension's entity privilege is not part of the role it belongs to, so the module errors with `Missing permissions … <entity>:read` | 6.4.1.2, pattern recurs | closed | https://github.com/shopware/shopware/issues/6166 |
| Meteor Admin SDK used inside a plugin raised `MissingPrivilegesError: Your app is missing the privileges read:product` | 6.7.x | closed | https://github.com/shopware/shopware/issues/11186 |
| The ACL docs page states registration must run before the roles detail page is opened, and that adding privileges does not by itself grant module access | 6.5 docs, carried forward | open | https://developer.shopware.com/docs/guides/plugins/plugins/administration/add-acl-rules.html |

Escalations raised, and how each was settled:

| question | settled by | outcome |
| --- | --- | --- |
| What shape does `addPrivilegeMappingEntry()` accept in 6.7, and which keys are required? | code lane | Settled: `{ category, parent, key, roles }`; validation checks only those three scalar keys |
| Is the check `acl.can('x.viewer')` with `acl` in `inject`? | code lane | Settled: yes — `src/app/main.ts:119-121`; `acl.service.ts:6-16` |
| How is a route gated, and what happens without the privilege? | code lane | Settled: `meta.privilege` + a global router guard redirecting to `sw.privilege.error.index` |
| Does the Administration registration affect Admin API authorization? | deep pass | Settled: no — the request path reads `acl_role.privileges` with raw SQL; the mapping only shapes what the roles detail page persists on save. Fact 3 |
| Is `additional_permissions` still supported in 6.7 and how does it differ? | deep pass | Settled: yes — rendered as free-form switches in a separate component, enforced only via route `ATTRIBUTE_ACL` or explicit JS checks. Fact 3 and the trap |
| Does a role entry missing `dependencies` still break the roles detail page (issue 5556)? | deep pass | Settled: yes — dereferenced unguarded in the service and the grid, with no default anywhere. Fact 1 |
| Is a navigation entry filtered by `privilege` in 6.7? | deep pass | Settled: yes — in `sw-admin-menu-item::children` and `sw-admin-menu::getChildren`, plus the leaf fallback to the route's `meta.privilege`. Fact 2 |

## Evidence — documentation (claims)

| claim | quote | citation | confirmed by code? |
| --- | --- | --- | --- |
| An admin privilege identifier is key + role joined by a dot | "This is made up of a 'key' and the 'role', connected by a dot: `.`." | `…/add-acl-rules.md` | yes — `privileges.service.ts:49-69` |
| The four predefined roles for `permissions` are viewer, editor, creator, deleter | the four bullet definitions | same page | not as validation, but as UI: the grid hard-codes exactly those four columns, so any other name is unreachable there — `…/sw-users-permissions-permissions-grid/index.js:102-108` |
| Admin privileges are not API permissions; they only enable/disable/hide Administration elements | "these combinations are not API permissions" | same page | yes — `acl.service.ts:6-16`; and the server never sees the dotted names |
| Admin ACL can be circumnavigated by direct API calls | "can be circumnavigated by making direct API calls to your backend" | same page | **partly contradicted** — the API enforces the colon privileges via `AclCriteriaValidator` / `AclWriteValidator`; what has no server-side meaning is the dotted admin-role layer |
| Registration goes through `addPrivilegeMappingEntry` with category, parent, key, roles | "Privileges can be added or extended with the Method `addPrivilegeMappingEntry`" | same page | yes — `privileges.service.ts:186-203` |
| Entity privileges inside a role follow `entity_name:operation` | "The structure is `entity_name:operation`, e.g. 'product:read'." | same page | yes — `privileges.service.ts:49-69`; core `acl/index.js` uses `tag:read` |
| `additional_permissions` is for non-CRUD functions | "These are intended for all functions that cannot be represented by CRUD." | same page | yes — rendered as switches, enforced only through route `ATTRIBUTE_ACL` or JS |
| Registration must happen before the roles detail page is opened; use an `acl/index.js` imported from the module index | "it's important that it will be called before the user goes to the roles detail page" | same page | file layout confirmed; the grid reads `getPrivilegesMappings()` at render time, so a later registration is simply absent from that render |
| A route is protected with a `privilege` key in `meta` | "Just add `privilege` to the `meta` property in your route" | same page | yes — `router.factory.js:137-140` |
| A menu entry or settings item is hidden by a `privilege` property | "you can to add the property `privilege` to your navigation settings to hide it" | same page | yes for both — `sw-settings-tag/index.js:27-43`; `sw-admin-menu-item/index.js:106-112` |
| `acl.can(identifier)` also passes for admin users | "It checks automatically if the user has admin rights" | same page | yes — `acl.service.ts:6-16` |
| The same call is used directly in templates | "hide the element if the user has not the right privilege" | same page | yes — `sw-settings-tag-list.html.twig:51,174-176` |
| A plugin adds API privileges to existing roles by overriding `Plugin::enrichPrivileges()` | "An event subscriber will add the plugins custom privileges at runtime" | same page | partly — the subscriber exists but runs on `acl_role.loaded`, which the raw-SQL request path bypasses; it takes effect once the loaded role is re-persisted — `PluginAclPrivilegesSubscriber.php:26-66` |
| `getPrivileges('<identifier>')` pulls another mapping's privileges but grants no module access | "the example above doesn't give a user access to the `rule` module" | same page | yes — `privileges.service.ts:208-210`, and module access is a separate route/nav gate |

Docs-lane internal contradictions worth noting: the snippet section writes `sw.privileges.…` while its JSON example nests under `"sw-privileges"`; the "extending existing normal permissions" example adds a free role name `newrole` under `category: 'permissions'` — which the deep pass shows would render no checkbox; the `getPrivileges` example writes `'product.read'` while the page's own rule is `product:read`.

## Doc/code divergence

| docs claim | code shows | citation |
| --- | --- | --- |
| For `category: 'permissions'` the roles are the four predefined ones | The service validates nothing, but the grid hard-codes those four as its columns, so any other role name in a `permissions` mapping is un-grantable there | `src/app/service/privileges.service.ts:12-24,290-317`; `…/sw-users-permissions-permissions-grid/index.js:102-108` |
| Administration ACL "can be circumnavigated by making direct API calls" | The Admin API independently validates `<entity>:read` for the searched entity and every association, and validates writes | `Framework/Api/Acl/AclCriteriaValidator.php:31-38`; `Framework/Api/Acl/AclWriteValidator.php:77` |
| An invalid mapping is an error the developer will notice | The mapping is dropped with a console warning and the call returns normally | `src/app/service/privileges.service.ts:290-317` |
| `enrichPrivileges()` privileges are added "at runtime" by a subscriber | The subscriber only mutates roles loaded through the DAL; the request-time permission list is read with raw SQL and never sees the enrichment until the role is saved again | `Framework/Routing/ApiRequestContextResolver.php:351-368`; `Framework/Plugin/Subscriber/PluginAclPrivilegesSubscriber.php:26-66` |

## Change log

| old fact (verbatim) | action | why |
| --- | --- | --- |
| A privilege identifier is `key.role` (e.g. `product.viewer`); the `permissions` category uses the fixed roles `viewer`, `editor`, `creator`, `deleter`, while `additional_permissions` uses custom role keys. | merged into fact 1 and the trap | The dot/colon distinction is confirmed. "Fixed roles" is wrong as validation — the service accepts any name — but true as UI: the grid hard-codes the four columns, so a `permissions` mapping with another name is un-grantable. Stated precisely instead of as a rule. |
| Privileges are registered with `Shopware.Service('privileges').addPrivilegeMappingEntry({ category, parent, key, roles })`, and routes, nav entries and settings items are protected with `meta: { privilege: 'your_key.your_role' }`. | split across facts 1 and 2 | Registration confirmed verbatim. The protection half was imprecise: `meta.privilege` is the route form, while a navigation entry and a `settingsItem` carry `privilege` directly — all three sites now cited. The mandatory `dependencies` key, which decides whether the roles page loads at all, was missing and is added. |
| Checking is done with `inject: ['acl']` and `this.acl.can('sales_channel.creator')` (or `acl.can(...)` in a template); the Administration ACL only hides or disables UI and can be bypassed by direct Admin API calls. | rewritten; the "bypassed" clause removed | The injection and `can()` halves are confirmed. The bypass clause is disproved: the Admin API enforces the colon privileges on every read and write (`AclCriteriaValidator`, `AclWriteValidator`). Replaced by the accurate boundary — the JS mapping authorizes nothing server-side, and the persisted list comes from `acl_role.privileges`. |
