---
id: platform/guidelines/6.7/admin-code-guidelines.md
title: Administration code guidelines
docType: guideline
version: "6.7"
summary: Shopware 6.7 Administration rules - component registry and $super, modules and ACL, repositories and Criteria, Twig blocks, Meteor components, Pinia.
keywords: ["administration", "component factory", "override", "$super", "module register", "acl", "privileges", "repository", "criteria", "twig blocks", "meteor", "pinia", "eslint"]
sources: [{url: "code:administration/Resources/app/administration/AGENTS.md", hash: "45b05bf132bc60ed181bba281c74339240d4e804fb67fd9c2bf573632f336683"}, {url: "code:administration/Resources/app/administration/technical-docs/06-ui/**", hash: "e2358ace4b37e3599efee396195ee651a16649b52f95ceea64a6f6dcfd16bc1f"}, {url: "https://developer.shopware.com/docs/resources/references/adr/2024-06-17-replace-vuex-with-pinia.html", hash: "170d922fc709cc7a7d3b351793b2d7f5dc47470de7f66fd5002412561c24c510"}, {url: "https://developer.shopware.com/docs/resources/references/adr/2024-03-21-implementation-of-meteor-component-library.html", hash: "b961ef4de449734fcc41eb15802c1335e937005766a25c7631ddeaf3e9758be3"}, {url: "https://developer.shopware.com/docs/resources/references/adr/2021-05-28-introduce-eslint-on-vue-admin.html", hash: "a7fa6b7ad13d1a533cdba26df105890bf05fbd1495b1f36810fad5847dd75d23"}]
codeVersion: "6.7.15.1+7d4303db"
lastBuilt: 2026-10-21
---

## component registry

- There are no Single File Components: components are option objects registered at runtime in the global `Shopware.Component` registry so extensions can change them. Register globally; never import one component locally into another.
- New component: `Shopware.Component.register('my-component', () => import('./my-component'))` (lazy form, as core modules do). An already registered name is rejected with a warning, so use a unique, prefixed kebab-case name.
- Derived component under a new name: `Shopware.Component.extend('my-list', 'sw-product-list', config)`.
- Change an existing component in place with `Shopware.Component.override('sw-product-list', config)`; never re-register a core name. Overrides are sorted by the optional third argument `overrideIndex`.
- Give every config a `template` (or a `render` function); otherwise the registry warns and drops it.
- Wrap configs in `Shopware.Component.wrapComponentConfig({...})` for TypeScript typing; it is Vue's `defineComponent` and adds nothing at runtime.
- Reach the framework through the `Shopware.*` globals (`Shopware.Component`, `Shopware.Module`, `Shopware.Service()`, `Shopware.Store`, `Shopware.Data`), not by importing files from `src/core/factory/` — the globals are what plugins extend.
- Write new code in TypeScript with a Jest `.spec.ts` next to it; do not break public APIs without prior discussion.

Read more: code:administration/Resources/app/administration/AGENTS.md

## super calls

- In an `override` or `extend` config, re-declare only what you change and call the parent with `this.$super('methodName', ...args)`, e.g. `createdComponent() { this.$super('createdComponent'); this.loadExtraData(); }`.
- For a computed getter/setter, address the half: `this.$super('myComputed.get')`.
- Never call `this.$super('$super')`; the factory throws.
- Keep the parent call unless you replace the behaviour on purpose — skipping it drops core logic and earlier overrides in the chain.

Read more: platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/customizing-components.md

## module structure and acl

- One folder per module: `index.js` (component registrations plus `Shopware.Module.register`), `acl/index.js`, `page/`, `view/`, `component/`, `snippet/`.
- The module id must be `<namespace>-<name>`, otherwise registration is aborted. Route names become `<namespace>.<name>.<routeKey>` unless `routePrefixName`/`routePrefixPath` is set.
- A module without `routes` (or `routeMiddleware`) is not registered. A `flag` key hides it while that feature flag is inactive. In a `type: 'plugin'` module every `navigation` entry needs a `parent`.
- Protect every route with `meta: { privilege: '<key>.viewer' }`; `acl.hasAccessToRoute()` reads exactly that key.
- Declare roles with `Shopware.Service('privileges').addPrivilegeMappingEntry({ category, parent, key, roles })` (`category`, `parent`, `key` required). Each role (`viewer`, `editor`, `creator`, `deleter`) lists `'<entity>:<read|update|create|delete>'` privileges plus `dependencies`; reuse another role with `Shopware.Service('privileges').getPrivileges('media.viewer')`.
- `inject: ['acl']` and gate actions and template elements with `acl.can('product.editor')`. Admin users pass every check, so test with a restricted user.

Read more: code:administration/Resources/app/administration/AGENTS.md
Read more: platform/dev/6.7/guides/plugins/plugins/administration/permissions-error-handling/add-acl-rules.md

## repository and criteria

- `inject: ['repositoryFactory']` and create repositories with `this.repositoryFactory.create('product')`; never hand-roll Admin API calls for entity CRUD.
- Take `Criteria` from `Shopware.Data` (`const { Criteria } = Shopware.Data;`); core re-exports the Meteor Admin SDK class.
- Keep queries bounded: `new Criteria(page, limit)` (core lists use `new Criteria(1, 25)`), filters like `Criteria.equals(...)`, `Criteria.equalsAny(...)`, `Criteria.multi('OR', [...])`, and `addAssociation('cover.media')` only for data the view renders.
- Read with `repository.search(criteria, Shopware.Context.api)` / `repository.get(id, Shopware.Context.api, criteria)`; write with `repository.save(entity, Shopware.Context.api)`, which sends only the changeset (POST when new, PATCH otherwise).
- After `save()`, reload with `repository.get()` before editing again so change tracking matches the server.

Read more: platform/dev/6.7/guides/plugins/plugins/administration/data-handling-processing/using-data-handling.md

## twig blocks

- Templates are `*.html.twig` files rendered by Twig.js. Wrap each meaningful element in `{% block <component_name>_<part> %}...{% endblock %}` so extensions can target it.
- In an override template, redefine only the changed block and keep the original with `{% parent %}`:

```twig
{% block sw_product_list_grid %}
    {% parent %}
    <my-extension-banner />
{% endblock %}
```

- Write `{% block block_name %}`, never `{% block block_name%}` — the linter fails on it. Do not indent block content deeper than the block tag; Twig is linted as HTML comments.
- Use kebab-case component names, self-closing empty components (`<sw-language-switcher />`), hyphenated attributes, and one attribute per line once there are several.
- Declare a type for every prop and a default for every optional prop.

Enforced by: ESLint

Read more: https://developer.shopware.com/docs/resources/references/adr/2021-05-28-introduce-eslint-on-vue-admin.html

## meteor components

- Build new UI from Meteor `mt-*` components (`mt-button`, `mt-card`, `mt-text-field`, `mt-select`, ...) from `@shopware-ag/meteor-component-library`. Legacy base components such as `sw-button` are deprecated for removal in 6.8.
- Some are core wrappers built with `Shopware.Component.wrapComponentConfig`: `mt-card` wraps `mt-card-original`, requires `positionIdentifier`, and renders `sw-extension-component-section` at `<id>__before`/`<id>__after`. Pass a stable `position-identifier` so apps can inject content.
- Migrating `sw-*` to `mt-*` is not a rename: props, slots and events can differ. `sw-data-grid` has no drop-in Meteor equivalent; keep it until you migrate deliberately.
- Style with Meteor tokens (`var(--mt-spacing-4)`, `var(--mt-color-text-primary)`) and BEM class names.

Read more: https://developer.shopware.com/docs/resources/references/adr/2024-03-21-implementation-of-meteor-component-library.html

## pinia stores

- Use `Shopware.Store` (Pinia). `Shopware.State` (Vuex) is deprecated and is removed in 6.8 with the `vuex` dependency.
- Register with `Shopware.Store.register({ id: 'myStore', state: () => ({...}), getters, actions })`, read with `Shopware.Store.get('myStore')` (throws for an unknown id). Public API: `list`, `get`, `register`, `unregister`.
- Write stores in TypeScript and export a state type the definition reuses.
- No mutations: change state in `actions`, use `this` in actions and getters, call actions instead of `commit`/`dispatch`, and use `$subscribe` instead of `subscribe`.

Read more: https://developer.shopware.com/docs/resources/references/adr/2024-06-17-replace-vuex-with-pinia.html

## Code check (6.7.15.1+7d4303db)

- confirmed `override` — in-place component override with optional index — administration/core/factory/async-component.factory.ts:609
- confirmed `wrapComponentConfig` — alias of Vue `defineComponent` — administration/core/factory/async-component.factory.ts:38
- confirmed `$super` — throws on `$super('$super')` — administration/core/factory/async-component.factory.ts:996
- confirmed `registerModule` — aborts on ids not matching `[namespace]-[name]` — administration/core/factory/module.factory.ts:160
- confirmed `addPrivilegeMappingEntry` — merges role entries per category and key — administration/app/service/privileges.service.ts:236
- confirmed `can` — ACL check, admin users always pass — administration/app/service/acl.service.ts:10
- confirmed `create` — repository factory method per entity — administration/core/data/repository-factory.data.ts:42
- confirmed `Criteria` — re-exported from the Meteor Admin SDK — administration/core/data/criteria.data.ts:5
- confirmed `{% parent %}` — custom Twig.js tag — administration/core/factory/template.factory.js:59
- confirmed `positionIdentifier` — required `mt-card` wrapper prop — administration/app/component/meteor-wrapper/mt-card/index.ts:22
- deprecated `sw-button` — removed in 6.8, use mt-button — administration/app/component/base/sw-button/index.js:10
- confirmed `register` — Pinia store registration on `Shopware.Store` — administration/app/store/index.ts:63
- deprecated `State` — Vuex `Shopware.State`, removed in 6.8, use Store — administration/core/shopware.ts:182
