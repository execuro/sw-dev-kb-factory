---
id: platform/guidelines/6.7/admin-code-guidelines.md
title: Administration code guidelines
docType: guideline
version: "6.7"
summary: Rules for Shopware 6.7 Administration code - component registry and $super, modules and ACL, repositories and Criteria, Twig blocks, Meteor and Pinia.
keywords: ["administration", "vue 3", "component override", "$super", "twig blocks", "module register", "acl privileges", "repositoryfactory", "criteria", "meteor component library", "mt-card", "pinia", "shopware.store", "eslint"]
sources: [{url: "code:administration/Resources/app/administration/AGENTS.md", hash: "fe0430ee08f8063998da41a2cfaad173e26bfab55cf3cb7a7710dc3af60adb7f"}, {url: "code:administration/Resources/app/administration/technical-docs/06-ui/**", hash: "e2358ace4b37e3599efee396195ee651a16649b52f95ceea64a6f6dcfd16bc1f"}, {url: "https://developer.shopware.com/docs/resources/references/adr/2024-06-17-replace-vuex-with-pinia.html", hash: "170d922fc709cc7a7d3b351793b2d7f5dc47470de7f66fd5002412561c24c510"}, {url: "https://developer.shopware.com/docs/resources/references/adr/2024-03-21-implementation-of-meteor-component-library.html", hash: "b961ef4de449734fcc41eb15802c1335e937005766a25c7631ddeaf3e9758be3"}, {url: "https://developer.shopware.com/docs/resources/references/adr/2021-05-28-introduce-eslint-on-vue-admin.html", hash: "a7fa6b7ad13d1a533cdba26df105890bf05fbd1495b1f36810fad5847dd75d23"}]
codeVersion: "6.7.13.0+8da531fe"
lastBuilt: 2026-09-15
---
## component registry and super

- Never write Single File Components. Administration components are plain config objects turned into Vue 3 components at runtime by the component factory, so plugins can change them.
- Register through the global object: `Shopware.Component.register(name, () => import('./path'))`. Components resolved outside the registry cannot be overridden by plugins.
- Change an existing component with `Shopware.Component.override(name, config)` (affects every usage); create a derived component with `Shopware.Component.extend(newName, baseName, config)` (base stays untouched).
- When redefining a method or computed property in an override/extend, call `this.$super('<name>', ...args)` unless you deliberately drop the inherited logic.
- For components built with `createExtendableSetup`, use `Shopware.Component.overrideComponentSetup()(name, (previousState, props, context) => ({ ... }))` — note the extra `()`. It is `@experimental`; extending is not supported there, and `previousState._private` is not for production.
- Write all new code in TypeScript; do not introduce breaking changes to public APIs without prior discussion.

Read more: platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/customizing-components.md
Read more: platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/add-custom-component.md

## twig blocks

- Customize markup by redeclaring a Twig block in the override template; put `{% parent %}` inside it to keep the original markup, omit it to replace.
- Keep block names exactly as the core template spells them (e.g. `sw_dashboard_index_content_intro_content_headline`); a misspelled block silently does nothing.
- Write `{% block block_name %}` with a space before `%}`; `{% block block_name%}` produces `invalid-x-end-tag` lint errors across the file.
- Do not indent content inside a Twig block relative to the block tag — the linter turns Twig syntax into HTML comments and cannot count it for indentation.
- Use kebab-case component names and hyphenated attributes in templates (`hello-word=""`), self-close empty components (`<sw-language-switcher />`), and put each attribute on its own line once there is more than one.

Enforced by: ESLint

Read more: https://developer.shopware.com/docs/resources/references/adr/2021-05-28-introduce-eslint-on-vue-admin.html
Read more: platform/dev/6.7/guides/plugins/plugins/administration/templates-styling/writing-templates.md

## module structure and acl

- Register a module with `Shopware.Module.register(moduleId, manifest)` and keep its pages, components, snippets and ACL mapping inside the module folder.
- Protect every route with `meta: { privilege: '<key>.<role>' }` and every `navigation`/`settingsItem` entry with `privilege`; the router guard checks `Shopware.Service('acl').can(to.meta.privilege)`.
- Declare privileges with `Shopware.Service('privileges').addPrivilegeMappingEntry({ category, parent, key, roles })`. Always pass `parent` (use `null` when there is none) — an entry missing `category`, `parent` or `key` is skipped with a warning.
- Use roles `viewer`, `editor`, `creator`, `deleter` for category `permissions`; any role name for `additional_permissions`. `privileges` list API permissions (`product:read`), `dependencies` list admin identifiers (`product.viewer`).
- Gate UI actions with `inject: ['acl']` and `acl.can('<key>.<role>')` in code and templates.
- Treat Administration ACL as UI-only: direct Admin API calls bypass it.

Read more: platform/dev/6.7/guides/plugins/plugins/administration/permissions-error-handling/add-acl-rules.md
Read more: platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/add-custom-module.md

## repository and criteria

- Obtain data access via DI: `inject: ['repositoryFactory']`, then `this.repositoryFactory.create('<entity_name>')` in a computed property. The default route is `/<entity-name-with-dashes>`.
- Build queries with `Shopware.Data.Criteria` (re-exported from `@shopware-ag/meteor-admin-sdk`): `new Criteria(page, limit)`, `addFilter(Criteria.equals(...))`, `addSorting(Criteria.sort(...))`, `addAssociation(...)`.
- Always pass `Shopware.Context.api` to `search`, `get`, `save`, `delete`, `syncDeleted`, `assign`.
- Save explicitly with `repository.save(entity, Shopware.Context.api)`; entities are stateless, so re-fetch with `repository.get(id, Shopware.Context.api)` after saving before editing again.
- Expect `search` to resolve to an `EntityCollection`; there is no `SearchResult` export in `Shopware.Data`.
- Add entities to a new parent's ToMany association via the collection (`add`/`remove`) and save the parent; use an association repository (`create(collection.entity, collection.source)`) only once the parent is persisted.

Read more: platform/dev/6.7/guides/plugins/plugins/administration/data-handling-processing/using-data-handling.md

## meteor components

- Use Meteor `mt-*` components (`mt-button`, `mt-card`, `mt-text-field`, `mt-select`, ...) for new UI. The `sw-*` counterparts `sw-button`, `sw-card` and `sw-text-field` are `@deprecated tag:v6.8.0`.
- Prefer the globally registered wrapper name (e.g. `mt-card`) in core-extensible templates: wrappers built with `Shopware.Component.wrapComponentConfig` add `sw-extension-component-section` extension points around the original component.
- Pass `position-identifier` to `mt-card`; the wrapper declares `positionIdentifier` as required and derives the `__before`/`__after` extension sections from it.
- Do not assume legacy prop, slot, event or CSS class names carry over when migrating; check the Meteor component API. Components with a hard migration path (e.g. `sw-data-grid` vs `mt-data-table`) keep their old implementation.
- Theme via Meteor design tokens (`var(--mt-...)` from `@shopware-ag/meteor-tokens`) rather than hard-coded values.

Read more: https://developer.shopware.com/docs/resources/references/adr/2024-03-21-implementation-of-meteor-component-library.html
Read more: platform/dev/6.7/guides/upgrades-migrations/administration/meteor-components.md
Read more: platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/using-base-components.md

## pinia stores

- Write new state as Pinia stores via `Shopware.Store.register({ id, state: () => ({ ... }), getters, actions })`; never use `Shopware.State` (Vuex), which is `@deprecated tag:v6.8.0` and removed together with `vuex` in 6.8.
- Access stores with `Shopware.Store.get('<id>')`; the remaining public API is `list()` and `unregister(id)`. `get` throws for an unknown id.
- Write stores in TypeScript and type the state; use `src/module/sw-cms/store/cms-page.store.ts` as the reference (the ADR's `cms-page.state.ts` name is outdated).
- When migrating Vuex: move mutations into `actions`, make `state` an arrow function, use `this` instead of the `state` argument in actions/getters, replace `commit`/`dispatch` with action calls and `subscribe` with `store.$subscribe`.

Read more: https://developer.shopware.com/docs/resources/references/adr/2024-06-17-replace-vuex-with-pinia.html
Read more: platform/dev/6.7/guides/upgrades-migrations/administration/pinia.md

## linting and tests

- Run `composer eslint:admin`, `composer stylelint:admin` and `composer format:admin` before committing; ESLint runs in CI.
- Declare prop types and give optional props a default (`vue/require-prop-types`, `vue/require-default-prop`); name components in kebab-case.
- Disable a lint rule only locally and deliberately — know the rule before breaking it.
- Write Jest tests for new features and fixes as `.spec.ts` next to the code; split specs above 500 lines into a `<name>.spec/` directory grouped by scenario.

Enforced by: ESLint

Read more: https://developer.shopware.com/docs/resources/references/adr/2021-05-28-introduce-eslint-on-vue-admin.html
