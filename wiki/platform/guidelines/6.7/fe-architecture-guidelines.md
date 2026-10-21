---
id: platform/guidelines/6.7/fe-architecture-guidelines.md
title: Frontend architecture guidelines
docType: guideline
version: "6.7"
summary: "Rules for the 6.7 Administration extension model (components, blocks, modules, services, ACL) and Storefront theme inheritance and styling."
keywords: ["administration", "component override", "twig blocks", "sw-block", "composition api override", "module register", "routemiddleware", "acl", "pinia store", "theme.json", "theme inheritance", "configinheritance", "overrides.scss"]
sources: [{url: "code:administration/Resources/app/administration/technical-docs/03-extensibility/**", hash: "f7b1cced6fffe34107e76f1ad35598d6c867079276979f737166663414ae8eeb"}, {url: "platform/dev/6.7/guides/plugins/plugins/administration/**", hash: "c939e5f69130facce2fac9c1bea62bddfb3f5b603adb486debc615af9cc58624"}, {url: "platform/dev/6.7/guides/plugins/themes/**", hash: "e3b6ddc2990c7ae5ea2c95088221a22043511f840024e7054841ca9a0b6b731e"}]
codeVersion: "6.7.15.1+7d4303db"
lastBuilt: 2026-10-21
---

## extension paradigm

- Plugin = in-process JS (self-hosted only); app = Meteor Admin Extension SDK iframes (required for Cloud).
- Use the global `Shopware` object (`Component`, `Module`, `Service`, `Store`), never core factory imports; load everything from the plugin's `src/Resources/app/administration/src/main.js`.

Read more: platform/dev/6.7/guides/plugins/plugins/administration/data-handling-processing/the-shopware-object.md

## component registration and customization

- Register with `Shopware.Component.register(name, () => import('./x'))`, prefixed names; change everywhere with `Shopware.Component.override(name, config)`; create variants with `Shopware.Component.extend(newName, baseName, config)`.
- Call `this.$super('name')` in redefined methods/computeds unless dropping inherited logic; keep override chains flat; target non-deprecated components (`mt-text-field`, not `sw-text-field`).

Read more: platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/customizing-components.md

## twig block templates

- Use Twig only for snake_case prefixed `{% block %}` and `{% parent %}`; output tokens are stripped, so bind, branch and loop in Vue.
- Redefine only changed blocks, keep `{% parent %}` unless replacing; a block override hits every usage.
- Never use `{% if %}`, `{% for %}`, `{% include %}`, `{% extends %}` — dropped silently once a core component migrates to `sw-block`.

Read more: platform/dev/6.7/guides/plugins/plugins/administration/templates-styling/writing-templates.md

## native block system

- `sw-block` / `sw-block-parent` are experimental (stable target v6.8.0); keep Twig blocks as the default.
- Override with `<sw-block extends="name">` (must be mounted, renders nothing in place); add `<sw-block-parent />` to keep prior content, else the last override wins.
- Never put `<sw-block-parent />` in `v-for`/`v-if`/`v-else`, `<sw-block extends>` in `v-for`, or a `<sw-block>` between `v-if`/`v-else` siblings.

Read more: platform/dev/6.7/guides/plugins/plugins/administration/single-file-components/api-reference/block-components/sw-block.md

## composition api overrides

- Override `createExtendableSetup` components via `Shopware.Component.overrideComponentSetup()('name', (previousState, props, context) => ({ ... }))`; override only, no extend.
- Read refs as `previousState.x.value`; avoid `previousState._private`; return refs, computeds or functions, never a prop key.
- Options API overrides of migrated components run through a deprecation shim that ignores `render`, `components`, `template`, `extends` and similar — migrate.

Read more: platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/customizing-components.md

## native setup sfc

- Experimental: base `.vue` files call `swDefinePublic({...})`, `.override.vue` files `swDefineOverride({...})` — shorthand keys, `{}` when empty.
- In overrides read state via `useSwPreviousState()`; never author `defineExpose()`/`defineModel()`; never name a setup binding like a prop.

Read more: platform/dev/6.7/guides/plugins/plugins/administration/single-file-components/_index.md

## modules routes and navigation

- `Shopware.Module.register('vendor-name', manifest)`: id needs a `-`, manifest needs `routes` or `routeMiddleware`, else registration aborts.
- Give every plugin `navigation` entry a `parent`; first-level plugin entries are dropped.
- Never override core modules; change their routes in your `routeMiddleware(next, currentRoute)`, always call `next(currentRoute)`.

Read more: platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/add-custom-module.md

## services state and data

- Register with `Shopware.Service().register(name, factory)`, consume via `inject`; decorate with `addServiceProviderDecorator` (return the service).
- Use `repositoryFactory.create(entity)` with `Shopware.Context.api`; save explicitly, re-fetch after save.
- Use Pinia via `Shopware.Store.register/get`; no new code on `Shopware.State`; prefer composables over mixins.

Read more: platform/dev/6.7/guides/plugins/plugins/administration/services-utilities/injecting-services.md

## acl and error handling

- Add privileges with `Shopware.Service('privileges').addPrivilegeMappingEntry({ category, parent, key, roles })`; pass `parent: null` explicitly.
- Guard routes with `meta.privilege`, menu entries with `privilege`, UI with `acl.can('key.role')`; Administration ACL is UI-only, the API enforces access.

Read more: platform/dev/6.7/guides/plugins/plugins/administration/permissions-error-handling/add-acl-rules.md

## storefront theme model

- A theme is a plugin implementing `Shopware\Storefront\Framework\ThemeInterface` with `src/Resources/theme.json`, active only on assigned sales channels.
- Use `theme:create`, `theme:change`; run `theme:refresh` after `theme.json` changes, `theme:compile` after SCSS/asset changes.

Read more: platform/dev/6.7/guides/plugins/themes/create-a-theme.md

## theme inheritance

- Order `views`, `style`, `script`, `asset`: `@Storefront`, `@Plugins` (views), parent `@<ThemeName>`, own entries last.
- List parents in `configInheritance` (last non-Storefront entry becomes `parentThemeId`); declare only changed or new `config.fields`.

Read more: platform/dev/6.7/guides/plugins/themes/inheritance/add-theme-inheritance.md

## theme styling

- Put `app/storefront/src/scss/overrides.scss` (variables only) before `@Storefront` in `style`; rules go in `base.scss` after it.
- Use `app/storefront/src/main.js` as JS entry; Shopware includes the built file, never embed it yourself.

Read more: platform/dev/6.7/guides/plugins/themes/styling/add-css-js-to-theme.md

## Code check (6.7.15.1+7d4303db)

- confirmed `overrideComponentSetup` — setup override API — administration/app/adapter/composition-extension-system/index.ts:507
- confirmed `sw-block` — global component — administration/app/component/index.ts:113
- deprecated `Shopware.State` — use Store — administration/core/shopware.ts:182
- confirmed `routeMiddleware` — required without routes — administration/core/factory/module.factory.ts:202
- confirmed `parent` — plugin nav entries need it — administration/core/factory/module.factory.ts:293
- confirmed `addPrivilegeMappingEntry` — privilege registration — administration/app/service/privileges.service.ts:236
- confirmed `parentThemeId` — from configInheritance — storefront/Theme/ThemeLifecycleService.php:584
