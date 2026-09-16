---
id: platform/guidelines/6.6/fe-architecture-guidelines.md
title: Frontend architecture guidelines
docType: guideline
version: "6.6"
summary: "Admin extension model (modules, components, blocks, ACL, services, stores) and storefront theme/template inheritance rules for Shopware 6.6."
keywords: ["administration", "module", "component override", "twig block", "acl", "privileges", "service container", "pinia", "theme", "theme.json", "configinheritance", "storefront"]
sources: [{url: "platform/dev/6.6/guides/plugins/plugins/administration/**", hash: "7a3d3a09ea3014fdb0c856ab3a28145ed97fa8ddfd29f32a268ca7444590386b"}, {url: "platform/dev/6.6/guides/plugins/themes/**", hash: "74601d06ef48b995f1b7ee9fd7b3c1efe9c452062ac557eee8191b190d906dcd"}]
codeVersion: "6.6.10.24+87965325"
lastBuilt: 2026-09-15
---

## admin modules

- One feature per directory `module/<module-name>/` with an `index.js`, imported from the plugin's `main.js`.
- Register via `Shopware.Module.register('<id>', { type: 'plugin', name, title, color, icon, routes, navigation, snippets })`; never call `ModuleFactory.registerModule` directly. A module without `routes` or `routeMiddleware` is rejected.
- Route names are the module id with dashes as dots plus the route key (`swag-example` + `list` -> `swag.example.list`); use that form in `navigation[].path` and `meta.parentPath`.
- Give every plugin navigation entry a `parent` (e.g. `sw-catalogue`) and an `id`: first-level entries from `type: 'plugin'` modules are dropped.
- `settingsItem` needs `group`, `to` and `icon` (or `iconComponent`), else it is rejected.
- Never override an existing module. To add a route or tab to a core page, register a separate module with `routeMiddleware(next, currentRoute)`, push into `currentRoute.children` only if the name matches and the child is absent, and always call `next(currentRoute)`.

Read more: platform/dev/6.6/guides/plugins/plugins/administration/module-component-management/customizing-modules.md

## admin components and blocks

- Register new components async: `Shopware.Component.register('<name>', () => import('./...'))`, exporting `Shopware.Component.wrapComponentConfig({ template })`.
- Keep markup in `<name>.html.twig`; start module pages with `sw-page` and wrap regions in named `{% block %}`s so others can extend them.
- Change existing components with `Shopware.Component.override('<name>', {...})`; derive with `Shopware.Component.extend('<new>', '<base>', {...})`. Never copy a core component.
- In template overrides redefine only the target block and call `{% parent %}` unless replacing; overrides hit every usage.
- In overridden methods/computed call the original with `this.$super('<name>', ...args)`.
- Composition API components: `Shopware.Component.overrideComponentSetup()('<name>', (previousState, props, context) => ({...}))` — override only, experimental; avoid `previousState._private`.

Read more: platform/dev/6.6/guides/plugins/plugins/administration/module-component-management/customizing-components.md
Read more: platform/dev/6.6/guides/plugins/plugins/administration/routing-navigation/add-new-tab.md

## admin acl

- Register privileges with `Shopware.Service('privileges').addPrivilegeMappingEntry({ category, parent, key, roles })` in `<module>/acl/index.js`.
- `category: 'permissions'` uses roles `viewer`, `editor`, `creator`, `deleter`; non-CRUD actions go in `additional_permissions`.
- Role `privileges` are `entity:operation` (`product:read`); `dependencies` are `key.role`; reuse sets with `getPrivileges('rule.viewer')`.
- Guard routes with `meta: { privilege: '<key>.<role>' }`, navigation/settings entries with `privilege`, components with `inject: ['acl']` + `this.acl.can('<key>.<role>')`.
- Extend existing roles server-side by overriding `enrichPrivileges(): array` in the plugin class.
- Admin ACL only hides UI; never treat it as API security.

Read more: platform/dev/6.6/guides/plugins/plugins/administration/permissions-error-handling/add-acl-rules.md

## admin services and data

- Load and write entities through `inject: ['repositoryFactory']`, `repositoryFactory.create('<entity>')` and `Criteria`; call `save()` explicitly; mutate collections with `add()`/`remove()`.
- For custom endpoints extend `Shopware.Classes.ApiService`, spread `...this.getBasicHeaders()`, register with `Shopware.Application.addServiceProvider('<name>', factory)`.
- Consume services only via `inject` (object form to rename on collision).
- Change core services with `Shopware.Application.addServiceProviderDecorator('<name>', fn)` (must return the service) or `addServiceProviderMiddleware`; reset instantiated providers first via `Shopware.Application.$container.resetProviders(['<name>'])`.

Read more: platform/dev/6.6/guides/plugins/plugins/administration/data-handling-processing/using-data-handling.md
Read more: platform/dev/6.6/guides/plugins/plugins/administration/services-utilities/extending-services.md

## admin state and snippets

- New stores use Pinia: `Shopware.Store.register({ id: '<store>', state: () => ({}), getters, actions })`, read with `Shopware.Store.get('<store>')`. No mutations; getters must not shadow state keys; same id overwrites.
- `Shopware.State` (Vuex) is deprecated for 6.8; if used, stores must be `namespaced: true` and component-scoped ones unregistered on destroy.
- Translations live in `module/<module>/snippet/<locale>.json` under a plugin-prefixed root key; use `this.$tc('<key>')`.
- Prepare for 6.7: Meteor components, Vite instead of webpack, `*.override.vue` overrides.

Read more: platform/dev/6.6/guides/plugins/plugins/administration/system-updates/pinia.md
Read more: platform/dev/6.6/guides/plugins/plugins/administration/system-updates/vue-native.md

## storefront themes

- Use a theme only for per-sales-channel visual changes; its plugin class implements `Shopware\Storefront\Framework\ThemeInterface`. Behaviour and PHP logic belong in a regular plugin.
- Scaffold with `bin/console theme:create <Name>`, install/activate, assign with `bin/console theme:change`.
- Configure in `src/Resources/theme.json`; run `bin/console theme:refresh` after edits, `bin/console theme:compile` after SCSS changes.
- In `style`, keep `overrides.scss` before `@Storefront` and own styles in `base.scss` after it.
- `@StorefrontBootstrap` goes only in `style`, never with `@Storefront`, and needs `@Plugins` added explicitly.
- Ship JavaScript prebuilt via `bin/build-storefront.sh`.

Read more: platform/dev/6.6/guides/plugins/themes/theme-configuration.md
Read more: platform/dev/6.6/guides/plugins/themes/differences-plugins-and-apps-vs-themes.md

## theme inheritance

- Extend a theme, never copy it: list parents in order in `views` (`["@Storefront", "@Plugins", "@ParentTheme", "@ChildTheme"]`), `style`, `script` and `asset`.
- Inherit config with `configInheritance: ["@Storefront", "@ParentTheme"]`; redefine only changed fields (a redefined field stops inheriting).
- Expose merchant settings as `config.fields` (`type`, `value`, `editable`), grouped by `tabs`/`blocks`/`sections`; `scss: false` skips SCSS variable injection.
- Do not override variables of third-party themes you do not control.

Read more: platform/dev/6.6/guides/plugins/themes/add-theme-inheritance.md

## Code check (6.6.10.24+87965325)

- confirmed `Shopware.Component.override` — administration/core/shopware.ts:129
- confirmed `overrideComponentSetup` — administration/core/shopware.ts:139
- confirmed `Shopware.State` — deprecated v6.8.0 — administration/core/shopware.ts:165
- confirmed `Shopware.Store.register` — administration/app/store/index.ts:64
- confirmed `routeMiddleware` — administration/core/factory/module.factory.ts:84
- confirmed `parent` — plugin top-level entries dropped — administration/core/factory/module.factory.ts:285
- confirmed `addPrivilegeMappingEntry` — administration/app/service/privileges.service.ts:258
- confirmed `acl.can` — administration/app/service/acl.service.ts:20
- confirmed `addServiceProviderDecorator` — administration/core/application.ts:293
- unverified `resetProviders` — BottleJS, out of scope
- confirmed `enrichPrivileges` — core/Framework/Plugin.php:115
- confirmed `ThemeInterface` — storefront/Framework/ThemeInterface.php:8
- confirmed `@StorefrontBootstrap` — storefront/Theme/ThemeFileResolver.php:148
