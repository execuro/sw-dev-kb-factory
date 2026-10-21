---
id: platform/guidelines/6.6/admin-code-guidelines.md
title: Administration code guidelines
docType: guideline
version: "6.6"
summary: Rules for 6.6 Administration plugin code - component registry and $super, modules and ACL, repositories, Twig blocks, Meteor and Pinia.
keywords: ["administration", "component registry", "component override", "$super", "module register", "acl", "privileges", "repository factory", "criteria", "twig blocks", "meteor", "pinia"]
sources: [{url: "platform/dev/6.6/guides/plugins/plugins/administration/module-component-management/**", hash: "f10e650e54ee4bb0068a848c557e492b9ffd941a1ec9834d813c75b716b8d81b"}, {url: "platform/dev/6.6/guides/plugins/plugins/administration/permissions-error-handling/**", hash: "7334999fab79a716f1e42b330fbeb5297c12810e593cf1ff3df3bf890b8fb049"}, {url: "https://developer.shopware.com/docs/v6.6/resources/references/adr/2024-06-17-replace-vuex-with-pinia.html", hash: "170d922fc709cc7a7d3b351793b2d7f5dc47470de7f66fd5002412561c24c510"}, {url: "https://developer.shopware.com/docs/v6.6/resources/references/adr/2024-03-21-implementation-of-meteor-component-library.html", hash: "b961ef4de449734fcc41eb15802c1335e937005766a25c7631ddeaf3e9758be3"}, {url: "https://developer.shopware.com/docs/v6.6/resources/references/adr/2021-05-28-introduce-eslint-on-vue-admin.html", hash: "a7fa6b7ad13d1a533cdba26df105890bf05fbd1495b1f36810fad5847dd75d23"}]
codeVersion: "6.6.10.29+c8b59f9d"
lastBuilt: 2026-10-21
---
## component registration

- Put the entry point at `<plugin root>/src/Resources/app/administration/src/main.js`. Every component, override, module and ACL file must be imported from there, directly or indirectly.
- Register new components with `Shopware.Component.register('<kebab-name>', ...)`. Prefer async loading: `Shopware.Component.register('hello-world', () => import('./component/hello-world'))`, and have that `index.js` export `Shopware.Component.wrapComponentConfig({ ... })`.
- Name components in kebab-case and prefix them with your vendor/plugin name (`swag-...`), never with `sw-` or `mt-`. Those prefixes belong to core and Meteor.
- Place page components under `src/module/<module>/page/<component>` and reusable ones under `src/component/<plugin>/<component>`. Core follows this layout. It is not enforced.
- Use existing base components (`sw-text-field`, `sw-container`, ...) by tag name. They are registered globally to Vue at boot, so you do not need to import them locally.
- Declare `props` with types, and give every optional prop a default.
- Enforced by: ESLint (`vue/component-definition-name-casing`, `vue/require-prop-types`, `vue/require-default-prop`)

Read more: platform/dev/6.6/guides/plugins/plugins/administration/module-component-management/**
Read more: https://developer.shopware.com/docs/v6.6/resources/references/adr/2021-05-28-introduce-eslint-on-vue-admin.html

## overriding and extending components

- To change an existing component in place, use `Shopware.Component.override('<name>', { template, methods, computed })`. Overrides stack in registration order.
- To build a new component derived from an existing one, use `Shopware.Component.extend('<new-name>', '<base-name>', { ... })`. The base component stays untouched.
- In an overridden or extended `methods`/`computed` entry, call the original with `this.$super('<name>', ...args)`. Return its result or build on it. Do not copy the original body.
- Never call `this.$super('$super')`. The factory throws on it.
- Treat the Composition API extension system as experimental (`ADMIN_COMPOSITION_API_EXTENSION_SYSTEM`, stable in v6.8.0). Plugins may only override through `Shopware.Component.overrideComponentSetup()('<name>', (previousState, props, context) => ({ ... }))`. Extending is not supported. Do not rely on `previousState._private` in production code, because it has no TypeScript support.

Read more: platform/dev/6.6/guides/plugins/plugins/administration/module-component-management/customizing-components.md

## twig blocks and templates

- Change core markup only by overriding a named `{% block %}` in your own `.html.twig` file, passed as `template` to `Component.override`/`extend`. Never fork the whole template.
- Inside an overridden block, call `{% parent %}` unless you deliberately want to replace the original content.
- Write block tags with spaces, `{% block block_name %}`. `{% block block_name%}` breaks template linting.
- Do not indent content inside a block. The linter turns Twig syntax into HTML comments, so block tags do not count for indentation.
- Self-close components without content (`<sw-language-switcher />`). Once an element has more than one attribute, put each attribute on its own line. Use kebab-case for component tags and hyphenated attribute names (`hello-world=""`).
- Disable a lint rule in a template only when you know why the rule exists, never just to silence the linter. ESLint runs in CI.
- Enforced by: ESLint (`vue/component-name-in-template-casing`, `vue/attribute-hyphenation`)

Read more: https://developer.shopware.com/docs/v6.6/resources/references/adr/2021-05-28-introduce-eslint-on-vue-admin.html
Read more: platform/dev/6.6/guides/plugins/plugins/administration/module-component-management/add-custom-field.md

## module structure

- Give each module its own directory with an `index.js` under `src/module/<module-id>/`, and register it with `Shopware.Module.register('<module-id>', { ... })`. Never call `ModuleFactory.registerModule` directly.
- Use a unique module id in the `[namespace]-[name]` format (e.g. `swag-example`). An id without a hyphen, or an id that is already registered, aborts registration.
- Provide `routes` or a `routeMiddleware`. Without either, the module is not registered.
- Set `type: 'plugin'`. It is the default, and the factory branches on it for navigation and settings entries.
- Ship translations through `snippets` keyed by locale (`de-DE`, `en-GB`). Until snippets exist, unresolved title keys are shown raw.
- Add a Settings entry through `settingsItem`. `group` must be `shop`, `system` or `plugins`, and the entry needs `to` plus `icon` or `iconComponent`.
- Never try to override an existing module. Its `color`, `icon` and `navigation` are fixed. To add or change routes (e.g. a new tab on `sw.product.detail`), register a separate module whose `routeMiddleware(next, currentRoute)` pushes onto `currentRoute.children`. Always call `next(currentRoute)`.

Read more: platform/dev/6.6/guides/plugins/plugins/administration/module-component-management/add-custom-module.md
Read more: platform/dev/6.6/guides/plugins/plugins/administration/module-component-management/customizing-modules.md

## acl and permissions

- Register privileges with `Shopware.Service('privileges').addPrivilegeMappingEntry({ category, parent, key, roles })`, in an `acl/index.js` that is imported from your module.
- Use `category: 'permissions'` with the fixed roles `viewer`, `editor`, `creator`, `deleter` for CRUD rights. Use `additional_permissions` for non-CRUD actions.
- List API rights as `entity_name:operation` in `privileges` (e.g. `product:read`). List dependent identifiers in `dependencies` (e.g. `product.viewer`). Reuse an existing set through `getPrivileges('rule.viewer')`.
- Guard routes, navigation entries and `settingsItem`s with `meta.privilege` / `privilege: '<key>.<role>'`.
- Check rights in components through `inject: ['acl']` and `this.acl.can('<key>.<role>')`.
- Add privileges to existing roles by overriding `enrichPrivileges()` in the PHP plugin base class.
- Always enforce permissions on the API side as well. Admin ACL only hides or disables UI, and anyone can call the API directly.

Read more: platform/dev/6.6/guides/plugins/plugins/administration/permissions-error-handling/add-acl-rules.md

## repository and criteria

- Load and persist entities through `inject: ['repositoryFactory']` and `this.repositoryFactory.create('<entity>')`, then `search(criteria)`, `get(id)`, `save(entity)`, `delete(id)` and `create()`. Never hand-roll Admin API HTTP calls for entity CRUD.
- Build queries with `Shopware.Data.Criteria` (`new Criteria(page, limit)`, `addFilter(Criteria.equals(...))`, `addAssociation(...)`). Load only the associations the view needs.
- Read field errors through `Shopware.Component.getComponentHelper()`. `...mapPropertyErrors('product', ['name'])` yields `productNameError`, and `mapPageErrors(config)` yields per-view booleans for `sw-tabs` `hasError`.
- In 6.6 the error store is still Vuex. Read raw errors with `Shopware.State.getters['error/getApiError'](entity, field)`, not with `this.$store.getters.getApiError`.

Read more: platform/dev/6.6/guides/plugins/plugins/administration/data-handling-processing/using-data-handling.md
Read more: platform/dev/6.6/guides/plugins/plugins/administration/permissions-error-handling/add-error-handling.md

## meteor components

- In new templates, use `mt-*` Meteor components directly where they exist (e.g. `mt-button`). The `sw-*` wrappers such as `sw-button` render the Meteor version only when `v6.7.0.0` is active, and otherwise log a deprecation warning.
- Migrate complex components (`sw-data-grid` to `mt-data-table`) deliberately. The legacy component stays available with a deprecation note.
- Put any breaking migration of your own templates behind a feature flag.

Read more: https://developer.shopware.com/docs/v6.6/resources/references/adr/2024-03-21-implementation-of-meteor-component-library.html

## pinia stores

- Register new state with `Shopware.Store.register({ id, state: () => ({}), getters, actions })`, and read it with `Shopware.Store.get('<id>')`. `Shopware.State` (Vuex) is deprecated for v6.8.0.
- Write stores in TypeScript, and export a state type that the `state` definition reuses.
- Do not use mutations. Use `actions`, and access state through `this` in actions and getters.
- Replace `commit`/`dispatch` with direct action calls, and `subscribe` with `store.$subscribe`.

Read more: https://developer.shopware.com/docs/v6.6/resources/references/adr/2024-06-17-replace-vuex-with-pinia.html

## Code check (6.6.10.29+c8b59f9d)

- confirmed `wrapComponentConfig` — exposed on `Shopware.Component` — administration/core/shopware.ts:131
- confirmed `$super` — super-chain resolution, throws on `$super('$super')` — administration/core/factory/async-component.factory.ts:993
- confirmed `overrideComponentSetup` — experimental, stable in v6.8.0 — administration/app/adapter/composition-extension-system.ts:359
- confirmed `routeMiddleware` — module needs routes or routeMiddleware — administration/core/factory/module.factory.ts:194
- confirmed `addPrivilegeMappingEntry` — privileges service — administration/app/service/privileges.service.ts:258
- confirmed `can` — acl service check — administration/app/service/acl.service.ts:20
- confirmed `enrichPrivileges` — plugin base class hook — core/Framework/Plugin.php:115
- confirmed `mapPropertyErrors` — computed name is camelCase of entity.property.error — administration/app/service/map-errors.service.ts:14
- corrected `this.$store.getters.getApiError` — code uses `Shopware.State.getters['error/getApiError']` instead, administration/app/service/map-errors.service.ts:29
- confirmed `repositoryFactory` — injected and `.create('product')` — administration/module/sw-product/page/sw-product-list/index.js:74
- confirmed `v6.7.0.0` — sw-button switches to mt-button — administration/app/component/base/sw-button/index.js:35
- confirmed `register` — `Shopware.Store.register` — administration/app/store/index.ts:64
- deprecated `State` — `Shopware.State` removed in v6.8.0 — administration/core/shopware.ts:165
