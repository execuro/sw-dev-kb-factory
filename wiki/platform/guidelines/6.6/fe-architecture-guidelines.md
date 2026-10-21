---
id: platform/guidelines/6.6/fe-architecture-guidelines.md
title: Frontend architecture guidelines
docType: guideline
version: "6.6"
summary: "Rules for the 6.6 Administration extension model (modules, routes, components, services, ACL) and Storefront theme inheritance."
keywords: ["administration", "module register", "routemiddleware", "component override", "acl", "privileges", "service decorator", "vuex", "pinia", "theme.json", "theme inheritance", "configinheritance", "themeinterface", "sw_extends"]
sources: [{url: "platform/dev/6.6/guides/plugins/plugins/administration/**", hash: "2e9b69087943654be102d0ce7c1c49e72e4d994282247e0fb5abce74129bf067"}, {url: "platform/dev/6.6/guides/plugins/themes/**", hash: "74601d06ef48b995f1b7ee9fd7b3c1efe9c452062ac557eee8191b190d906dcd"}]
codeVersion: "6.6.10.29+c8b59f9d"
lastBuilt: 2026-10-21
---
## admin entry point

- Keep admin code under `src/Resources/app/administration/src`; import every module, component, override, mixin, filter and service init from `main.js` (mixins before their components). Unimported files do nothing.
- Go through the global `Shopware` object (`Component`, `Module`, `Mixin`, `Filter`, `Service`, `Application`); never reach into admin internals.
- Ship the built `src/Resources/public/administration/js/<plugin-name>.js`; it only loads while the plugin is active.

Read more: platform/dev/6.6/guides/plugins/plugins/administration/data-handling-processing/the-shopware-object.md

## admin modules and routes

- Register with `Shopware.Module.register('<namespace>-<name>', {...})`; an id without a dash or an already-used id aborts registration.
- A module needs `routes` or a `routeMiddleware`. Route names are generated as id-with-dots plus key (`swag-example` + `list` = `swag.example.list`); never hand-write dashed names.
- Use `meta.parentPath` for the back button and `meta.privilege` for the ACL guard.
- Never override a core module or its `color`/`icon`/`navigation`. Add or replace routes from a separate module's `routeMiddleware(next, currentRoute)` editing `currentRoute.children`; guard against duplicate pushes, restate the full entry when replacing, always call `next(currentRoute)`.

Read more: platform/dev/6.6/guides/plugins/plugins/administration/module-component-management/customizing-modules.md

## admin navigation and settings

- Give every plugin `navigation` entry a `parent` (e.g. `sw-catalogue`) and an `id`; plugin entries without `parent` are dropped and first-level entries are rejected from the Store.
- `settingsItem` needs `group` (`shop`, `system` or `plugins`), `to` and `icon` or `iconComponent`, else it is skipped.

Read more: platform/dev/6.6/guides/plugins/plugins/administration/routing-navigation/add-menu-entry.md

## admin component extension

- New: `Shopware.Component.register(name, () => import(...))` (async preferred) with `Shopware.Component.wrapComponentConfig({...})` in `index.js`.
- Existing: `Shopware.Component.override(name, {...})`; derive with `Shopware.Component.extend(new, base, {...})`; call originals via `this.$super('method')`.
- Change markup only via Twig blocks: override the narrowest block, keep `{% parent %}` unless removal is intended, wrap own markup in blocks.
- Reuse registry components (`sw-text-field`, `sw-data-grid`) instead of raw HTML.
- `overrideComponentSetup`/`createExtendableSetup` are experimental in 6.6; avoid `previousState._private`.
- Write Vue 3: template filters are gone, use `Shopware.Filter.getByName()` in a computed.

Read more: platform/dev/6.6/guides/plugins/plugins/administration/module-component-management/customizing-components.md

## admin services and state

- Consume services via `inject`, from `created` onward. Register with `Shopware.Service().register(name, factory)`; API clients extend `Shopware.Classes.ApiService`.
- Modify core services with `Shopware.Application.addServiceProviderDecorator` (once) or `addServiceProviderMiddleware` (every access), never by replacement. Core services are already instantiated: reset their provider first.
- State in 6.6 is Vuex: `namespaced: true` stores via `Shopware.State.registerModule`, unregister component-scoped ones on destroy. `Shopware.State` is deprecated for 6.8; `Shopware.Store` (Pinia) is private until 6.7.

Read more: platform/dev/6.6/guides/plugins/plugins/administration/services-utilities/extending-services.md
Read more: platform/dev/6.6/guides/plugins/plugins/administration/system-updates/pinia.md

## admin acl

- Declare with `Shopware.Service('privileges').addPrivilegeMappingEntry({ category, parent, key, roles })`; roles `viewer`/`editor`/`creator`/`deleter` under `permissions`, non-CRUD under `additional_permissions`.
- Gate routes, navigation and `settingsItem` with `privilege`, UI with `this.acl.can('key.role')`; extend existing roles via the plugin's `enrichPrivileges()`.
- Admin ACL is UI-only; the API remains callable, so enforce access server-side too.

Read more: platform/dev/6.6/guides/plugins/plugins/administration/permissions-error-handling/add-acl-rules.md

## admin build and upgrade path

- Customize the build only via `src/Resources/app/administration/build/webpack.config.js` (merged alone into the base config).
- For 6.7 readiness drop Vue 2 APIs (`$listeners`, `$scopedSlots`, `$children`, `$on`, `$set`); expect Vite, Pinia and Meteor components.

Read more: platform/dev/6.6/guides/plugins/plugins/administration/system-updates/vue-native.md

## theme identity and scope

- Use a theme only for visuals: a plugin/app implementing `Shopware\Storefront\Framework\ThemeInterface`, assigned per sales channel, no PHP logic. Behavior goes in a regular, globally active plugin.
- `bin/console theme:create` scaffolds, `theme:change` assigns, `theme:refresh` applies `theme.json` edits.

Read more: platform/dev/6.6/guides/plugins/themes/differences-plugins-and-apps-vs-themes.md

## theme json inheritance

- In `src/Resources/theme.json`, order `views`, `style`, `script`, `asset` from base to specific: `@Storefront`, `@Plugins`, parent theme, own theme.
- Extend Storefront templates with `{% sw_extends %}`; the `views` order decides which layer wins.
- `configInheritance` inherits config fields; `@Storefront` config is always inherited.
- `@StorefrontBootstrap` replaces `@Storefront` in `style` only; never combine them, add `@Plugins` explicitly.
- Assets and icons are not inherited; declare icon packs in `iconSets` (mandatory for app themes), render with `sw_icon`.

Read more: platform/dev/6.6/guides/plugins/themes/add-theme-inheritance.md
Read more: platform/dev/6.6/guides/plugins/themes/theme-configuration.md

## theme styles scripts assets

- `overrides.scss` holds only variable overrides and sits before `@Storefront`; theme rules go in `base.scss` after it.
- Ship prebuilt JS (`bin/build-storefront.sh`); compile SCSS and assets with `bin/console theme:compile`.
- Link assets via `asset('...', 'theme')` in Twig, `$app-css-relative-asset-path` in SCSS.

Read more: platform/dev/6.6/guides/plugins/themes/add-css-js-to-theme.md

## Code check (6.6.10.29+c8b59f9d)

- confirmed `Shopware.Module.register` — maps to registerModule — administration/core/shopware.ts:120
- confirmed `routeMiddleware` — used when routes are absent — administration/core/factory/module.factory.ts:257
- confirmed `parent` — plugin navigation without it is dropped — administration/core/factory/module.factory.ts:285
- confirmed `Shopware.Component.override` — component registry — administration/core/shopware.ts:129
- confirmed `overrideComponentSetup` — experimental — administration/app/adapter/composition-extension-system.ts:359
- confirmed `addServiceProviderDecorator` — decoration hook — administration/core/application.ts:293
- deprecated `Shopware.State` — tag v6.8.0, use Store — administration/core/shopware.ts:165
- confirmed `addPrivilegeMappingEntry` — privileges service — administration/app/service/privileges.service.ts:258
- confirmed `acl.can` — privilege check — administration/app/service/acl.service.ts:20
- confirmed `enrichPrivileges` — plugin role hook — core/Framework/Plugin.php:115
- confirmed `ThemeInterface` — marks a theme — storefront/Framework/ThemeInterface.php:8
- confirmed `configInheritance` — read from theme.json — storefront/Theme/StorefrontPluginConfiguration/StorefrontPluginConfigurationFactory.php:108
- confirmed `@StorefrontBootstrap` — Bootstrap SCSS only — storefront/Theme/ThemeFileResolver.php:148
- confirmed `sw_extends` — Twig extends tag — core/Framework/Adapter/Twig/TokenParser/ExtendsTokenParser.php:63
