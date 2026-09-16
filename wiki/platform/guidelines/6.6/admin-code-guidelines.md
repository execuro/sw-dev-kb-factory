---
id: platform/guidelines/6.6/admin-code-guidelines.md
title: Administration code guidelines
docType: guideline
version: "6.6"
summary: "Rules for 6.6 Administration code: component registry and $super, Twig blocks, modules, ACL, repository/Criteria, Pinia stores, Meteor, ESLint."
keywords: ["administration", "component override", "$super", "twig blocks", "module register", "acl", "privileges", "repository", "criteria", "pinia", "shopware.store", "meteor", "eslint"]
sources: [{url: "https://developer.shopware.com/docs/v6.6/resources/references/adr/2024-06-17-replace-vuex-with-pinia.html", hash: "170d922fc709cc7a7d3b351793b2d7f5dc47470de7f66fd5002412561c24c510"}, {url: "https://developer.shopware.com/docs/v6.6/resources/references/adr/2024-03-21-implementation-of-meteor-component-library.html", hash: "b961ef4de449734fcc41eb15802c1335e937005766a25c7631ddeaf3e9758be3"}, {url: "https://developer.shopware.com/docs/v6.6/resources/references/adr/2021-05-28-introduce-eslint-on-vue-admin.html", hash: "a7fa6b7ad13d1a533cdba26df105890bf05fbd1495b1f36810fad5847dd75d23"}]
codeVersion: "6.6.10.24+87965325"
lastBuilt: 2026-09-15
---
## component registry and super

- Change an existing component with `Shopware.Component.override('<name>', { ... })`; create a derived component with `Shopware.Component.extend('<new-name>', '<base-name>', { ... })`. Register new components with `Shopware.Component.register`. Never copy a core component to change it.
- Inside an overridden or extended `methods`/`computed` entry, call the previous implementation with `this.$super('<methodName>', ...args)`; for computed getters/setters use `this.$super('<name>.get')` / `this.$super('<name>.set', value)`.
- Never call `this.$super('$super')` — the factory throws on it.
- Treat `Shopware.Component.overrideComponentSetup` / `createExtendableSetup` (Composition API extension system) as experimental; prefer the Options API `override`/`extend` for plugin code in 6.6.

Read more: platform/dev/6.6/guides/plugins/plugins/administration/module-component-management/customizing-components.md

## twig blocks

- Change markup only through Twig blocks in the component's `*.html.twig`: redefine `{% block <block_name> %}` and use `{% parent %}` to keep the original content.
- Write block tags with a space before the closing delimiter: `{% block block_name %}`, never `{% block block_name%}` — the latter breaks template linting.
- Do not indent content inside a Twig block relative to the block tag; the linter turns Twig syntax into HTML comments and cannot account for block nesting.
- Self-close empty components (`<sw-language-switcher />`) and put every attribute on its own line once an element has more than one attribute.
- Use kebab-case for component names and attributes in templates (`hello-word=""`, not `helloWorld=""`).

Enforced by: ESLint
Read more: https://developer.shopware.com/docs/v6.6/resources/references/adr/2021-05-28-introduce-eslint-on-vue-admin.html
Read more: platform/dev/6.6/guides/plugins/plugins/administration/templates-styling/writing-templates.md

## module structure

- Put each module in its own directory `src/module/<namespace>-<name>/` with an `index.js`, imported from the plugin's `main.js`.
- Register with `Shopware.Module.register('<namespace>-<name>', { ... })`; an id without a `-` separator is rejected ("[namespace]-[name]" format).
- Always define `routes` (or a `routeMiddleware`): a module without a valid route is not registered. Route names are rewritten to `<namespace>.<name>.<routeKey>`, paths are prefixed with `/<namespace>/<name>/`.
- Set `type: 'plugin'` for plugin modules. Plugin `navigation` entries must set `parent` — first-level entries from plugins are dropped.
- Link into Settings via `settingsItem` with `group` one of `shop`, `system`, `plugins`.

Read more: platform/dev/6.6/guides/plugins/plugins/administration/module-component-management/add-custom-module.md
Read more: platform/dev/6.6/guides/plugins/plugins/administration/routing-navigation/add-menu-entry.md

## acl

- Register privileges in `<module>/acl/index.js` via `Shopware.Service('privileges').addPrivilegeMappingEntry({ category, parent, key, roles })`; `category`, `parent` and `key` are required, otherwise the entry is rejected with a warning.
- Use `category: 'permissions'` with roles `viewer`, `editor`, `creator`, `deleter`; use `additional_permissions` for non-CRUD actions. List API privileges as `entity:operation` (e.g. `product:read`) and role dependencies as `key.role`.
- Reuse another role's privileges with `Shopware.Service('privileges').getPrivileges('<key.role>')` instead of duplicating lists.
- Protect routes with `meta: { privilege: '<key.role>' }` — the router checks it through the `acl` service before navigation.
- Gate UI with `inject: ['acl']` and `this.acl.can('<key.role>')`.
- Treat Administration ACL as UI gating only; enforce real permissions in the API/backend.

Read more: platform/dev/6.6/guides/plugins/plugins/administration/permissions-error-handling/add-acl-rules.md

## repository and criteria

- Get data only through repositories: `inject: ['repositoryFactory']`, then `this.repositoryFactory.create('<entity_name>')`. Do not call the Admin API with a raw HTTP client for DAL entities.
- Build queries with `Shopware.Data.Criteria` (`new Criteria(page, limit)`, `addFilter(Criteria.equals(...))`, `addSorting(Criteria.sort(...))`, `addAssociation('<name>')`); load associations explicitly.
- Pass `Shopware.Context.api` (the default) to `search`, `get`, `save`, `delete`.
- Call `repository.save(entity)` explicitly — changes are never persisted automatically. Re-fetch after save when fresh server data is needed.
- Add to entity collections with `add()`/`remove()` so changes stay reactive and are sent with the parent's `save()`.

Read more: platform/dev/6.6/guides/plugins/plugins/administration/data-handling-processing/using-data-handling.md

## pinia stores

- Write new state as Pinia stores via `Shopware.Store.register({ id: '<storeId>', state: () => ({ ... }), getters: {}, actions: {} })`; do not add new Vuex modules. `Shopware.State` is `@deprecated tag:v6.8.0` and will be removed.
- Access stores with `Shopware.Store.get('<storeId>')` (throws if the id is not registered); remove with `Shopware.Store.unregister('<storeId>')`. `Shopware.Store.list()` returns registered ids.
- Write stores in TypeScript, export a state type and reuse it as the `state` return type; extend `PiniaRootState` for typed `get()`. Follow `module/sw-cms/store/cms-page.store.ts` as the reference.
- When migrating Vuex: move every mutation into `actions`, make `state` an arrow function, use `this` in actions and getters instead of a `state` argument, replace `commit`/`dispatch` with action calls and `subscribe` with `store.$subscribe`.
- Do not give a getter the same name as a state property; registering an existing id overwrites the store.

Read more: https://developer.shopware.com/docs/v6.6/resources/references/adr/2024-06-17-replace-vuex-with-pinia.html
Read more: platform/dev/6.6/guides/plugins/plugins/administration/system-updates/pinia.md

## meteor components

- Prefer `mt-` components (`mt-button`, `mt-text-field`, `mt-select`, `mt-switch`, `mt-checkbox`, `mt-data-table`, and the other globally registered Meteor components) in new templates; they are available directly in 6.6.
- Know that `sw-*` wrappers such as `sw-button` render the Meteor component only when the major flag `v6.7.0.0` is active; otherwise they render the `*-deprecated` component and log a deprecation warning.
- Keep complex legacy components (for example `sw-data-grid`) until you migrate deliberately; their Meteor counterparts are not drop-in replacements.
- Put breaking manual migrations behind a feature flag so they ship with a major release; use `composer run admin:code-mods` for automated migration.

Read more: https://developer.shopware.com/docs/v6.6/resources/references/adr/2024-03-21-implementation-of-meteor-component-library.html
Read more: platform/dev/6.6/guides/plugins/plugins/administration/system-updates/meteor-components.md

## eslint

- Keep ESLint green; it runs in CI.
- Declare types for every prop (`vue/require-prop-types`) and a default for every optional prop (`vue/require-default-prop`).
- Name components in kebab-case (`vue/component-definition-name-casing`, `vue/component-name-in-template-casing`).
- Disable a rule inline only with a stated reason — know the rule before breaking it.

Enforced by: ESLint
Read more: https://developer.shopware.com/docs/v6.6/resources/references/adr/2021-05-28-introduce-eslint-on-vue-admin.html
