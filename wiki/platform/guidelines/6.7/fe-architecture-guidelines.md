---
id: platform/guidelines/6.7/fe-architecture-guidelines.md
title: Frontend architecture guidelines
docType: guideline
version: "6.7"
summary: "Rules for the 6.7 Administration extension model (components, blocks, modules, services, ACL) and Storefront theme inheritance and styling."
keywords: ["administration", "component override", "twig blocks", "sw-block", "composition api override", "module register", "routemiddleware", "acl", "pinia store", "theme.json", "theme inheritance", "configinheritance", "overrides.scss"]
sources: [{url: "code:administration/Resources/app/administration/technical-docs/03-extensibility/**", hash: "03a7cddfcc75e5394778835d65370e7194818948a76ae4155d327252727bbf21"}, {url: "platform/dev/6.7/guides/plugins/plugins/administration/**", hash: "b8e814db51dbe4af026b7b47fa1b2eaa46c253529ea060c7621af6132195c7bf"}, {url: "platform/dev/6.7/guides/plugins/themes/**", hash: "c9a596adf946aed6280f7f99d0812d6599754c29e6c9c096ab3b5e1061948744"}]
codeVersion: "6.7.13.0+8da531fe"
lastBuilt: 2026-09-15
---

## extension paradigm

- Plugin = in-process JS (self-hosted only); app = Meteor Admin Extension SDK iframes (required for Cloud).
- Use only the global `Shopware` object (`Component`, `Module`, `Service`, `Store`, `Mixin`, `Directive`, `Filter`); import everything from the plugin's `src/Resources/app/administration/src/main.js`, else it never loads.

Read more: platform/dev/6.7/guides/plugins/plugins/administration/data-handling-processing/the-shopware-object.md

## component registration and customization

- Register with `Shopware.Component.register(name, () => import('./x'))`, prefixed names; change everywhere with `Shopware.Component.override(name, config)`, create variants with `Shopware.Component.extend(newName, baseName, config)`.
- Call `this.$super('name')` in redefined methods/computeds unless dropping inherited logic; keep override chains flat.
- Treat `@private` components (e.g. `sw-data-grid`) as unstable override targets.

Read more: platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/customizing-components.md

## twig block templates

- Use Twig only for snake_case, prefixed `{% block %}` and `{% parent %}`; do bindings, conditions and loops in Vue.
- Redefine only changed blocks, keep `{% parent %}` unless replacing; a block override hits every usage.
- Never use `{% if %}`, `{% for %}`, `{% include %}`, `{% extends %}` — dropped silently once a core component migrates to `sw-block`.

Read more: platform/dev/6.7/guides/plugins/plugins/administration/templates-styling/writing-templates.md

## native block system

- `sw-block` / `sw-block-parent` are experimental in 6.7 (`ADMIN_COMPOSITION_API_EXTENSION_SYSTEM`); keep Twig blocks as the default.
- Override with `<sw-block extends="...">` (must be mounted, renders nothing in place); add `<sw-block-parent />` to keep prior content, else the last override wins.
- Never put `<sw-block-parent />` in `v-for`/`v-if`/`v-else`, or `<sw-block extends>` in `v-for`.
- Legacy Twig overrides run through a deprecation shim (order: default, Twig shim, native).

Read more: platform/dev/6.7/guides/plugins/plugins/administration/templates-styling/writing-templates.md

## composition api overrides

- Override `createExtendableSetup` components via `Shopware.Component.overrideComponentSetup()('name', (previousState, props, context) => ({ ... }))`; override only, no extend.
- Read refs as `previousState.x.value`; never use `previousState._private` in production; return refs, computeds or functions, never a prop key.
- Options API overrides of migrated components go through a shim that ignores `render`, `components`, `template`, `extends` and similar options.

Read more: platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/customizing-components.md

## modules routes and navigation

- `Shopware.Module.register('vendor-name', manifest)`: id needs a `-`, manifest needs `routes` or `routeMiddleware`, else registration aborts.
- Give every plugin `navigation` entry a `parent`; first-level plugin entries are dropped.
- Never override core modules; change their routes in your module's `routeMiddleware(next, currentRoute)`, guard on `currentRoute.name`, always call `next(currentRoute)`.

Read more: platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/customizing-modules.md

## services state and data

- Register with `Shopware.Service().register(name, factory)`, consume via `inject`; decorate with `addServiceProviderDecorator` (return the service).
- Use `repositoryFactory.create(entity)`, `Shopware.Data.Criteria`, `Shopware.Context.api`; save explicitly, re-fetch after save.
- Use Pinia via `Shopware.Store.register/get`; no new code on `Shopware.State` (deprecated for 6.8.0).
- Translate with `$t`; sanitize user HTML with `this.$sanitize`.

Read more: platform/dev/6.7/guides/plugins/plugins/administration/services-utilities/extending-services.md

## acl and error handling

- Add privileges with `Shopware.Service('privileges').addPrivilegeMappingEntry({ category, parent, key, roles })`.
- Guard routes with `meta.privilege`, menu entries with `privilege`, UI with `acl.can('key.role')`; Administration ACL is UI-only, the API enforces access.
- Show API errors via `mapPropertyErrors` / `mapPageErrors`.

Read more: platform/dev/6.7/guides/plugins/plugins/administration/permissions-error-handling/add-acl-rules.md

## storefront theme model

- A theme is a plugin or app implementing `Shopware\Storefront\Framework\ThemeInterface` with `src/Resources/theme.json`, active only on assigned sales channels.
- Use `theme:create`, `theme:change`; run `theme:refresh` after `theme.json` changes, `theme:compile` after SCSS/asset changes.

Read more: platform/dev/6.7/guides/plugins/themes/create-a-theme.md

## theme inheritance

- Order `views`, `style`, `script`, `asset`: `@Storefront`, `@Plugins` (views), parent `@<ThemeName>`, own files last; omitting `@Storefront` drops defaults.
- List parents in `configInheritance`; declare only changed or new `config.fields`.
- Use `@StorefrontBootstrap` only in `style`, never together with `@Storefront`.

Read more: platform/dev/6.7/guides/plugins/themes/inheritance/add-theme-inheritance.md

## theme styling

- Put `app/storefront/src/scss/overrides.scss` (only `!default` variables) before `@Storefront` in `style`; rules go in `base.scss` after it.
- Reference assets with `asset('/assets/file.png', 'theme')` in Twig and `$app-css-relative-asset-path` in SCSS.

Read more: platform/dev/6.7/guides/plugins/themes/styling/override-bootstrap-variables-in-a-theme.md

## Code check (6.7.13.0+8da531fe)

- confirmed `overrideComponentSetup` — setup override API — administration/app/adapter/composition-extension-system.ts:422
- deprecated `Shopware.State` — use Store — administration/core/shopware.ts:169
- confirmed `routeMiddleware` — required without routes — administration/core/factory/module.factory.ts:202
- confirmed `parent` — plugin nav entries need it — administration/core/factory/module.factory.ts:293
- confirmed `@StorefrontBootstrap` — style placeholder — storefront/Theme/ThemeFileResolver.php:302
