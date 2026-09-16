---
id: platform/hubs/main-js.md
title: main.js
summary: "How administration and storefront plugin code registers components, modules, JS plugins, mixins, directives, filters, and theme assets in main.js."
keywords: ["main.js", "administration components", "storefront javascript plugins", "shopware component register", "shopware module register", "plugin manager", "cms block", "mixins", "directives", "filters", "theme scss", "routemiddleware", "plugin base class", "build js admin", "build js storefront"]
members: ["platform/dev/6.6/guides/plugins/plugins/administration/module-component-management/add-custom-component.md", "platform/dev/6.6/guides/plugins/plugins/administration/module-component-management/add-custom-field.md", "platform/dev/6.6/guides/plugins/plugins/administration/module-component-management/add-custom-module.md", "platform/dev/6.6/guides/plugins/plugins/administration/module-component-management/customizing-modules.md", "platform/dev/6.6/guides/plugins/plugins/administration/routing-navigation/add-new-tab.md", "platform/dev/6.6/guides/plugins/plugins/content/cms/add-cms-block.md", "platform/dev/6.6/guides/plugins/plugins/storefront/add-custom-javascript.md", "platform/dev/6.6/guides/plugins/plugins/storefront/add-javascript-as-script-tag.md", "platform/dev/6.6/guides/plugins/plugins/storefront/override-existing-javascript.md", "platform/dev/6.6/guides/plugins/plugins/storefront/remove-unnecessary-js-plugin.md", "platform/dev/6.6/guides/plugins/themes/add-css-js-to-theme.md", "platform/dev/6.7/guides/development/testing/store/code-quality.md", "platform/dev/6.7/guides/plugins/apps/storefront/_index.md", "platform/dev/6.7/guides/plugins/plugins/administration/mixins-directives/add-mixins.md", "platform/dev/6.7/guides/plugins/plugins/administration/mixins-directives/adding-directives.md", "platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/add-custom-component.md", "platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/add-custom-field.md", "platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/add-custom-module.md", "platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/customizing-modules.md", "platform/dev/6.7/guides/plugins/plugins/administration/routing-navigation/add-new-tab.md", "platform/dev/6.7/guides/plugins/plugins/administration/services-utilities/add-filter.md", "platform/dev/6.7/guides/plugins/plugins/storefront/advanced/remove-unnecessary-js-plugin.md", "platform/dev/6.7/guides/plugins/plugins/storefront/javascript/add-custom-javascript.md", "platform/dev/6.7/guides/plugins/plugins/storefront/javascript/override-existing-javascript.md", "platform/dev/6.7/guides/plugins/themes/styling/add-css-js-to-theme.md"]
lastBuilt: "2026-09-15"
---

A plugin's or app's `main.js` is the single entry point where JavaScript-side extension
points get wired up: Administration Vue components, modules, mixins, directives and
filters register themselves here via the `Shopware.*` factories, and Storefront plugins
register with `PluginManager`. Themes add their own `main.js` under
`app/storefront/src/main.js` for JS plus SCSS entries. Come to this hub instead of grepping
for `main.js` when you need to know which registration API applies to the kind of
extension you're adding (component vs module vs mixin vs directive vs filter vs storefront
plugin vs CMS block vs theme asset), or when you need to compare how a topic's
`main.js` wiring differs between `dev/6.6` and `dev/6.7`.

Several topics are covered by near-duplicate pages, one per version, with the same subject
but different registration APIs or CLI build commands (`build-administration.sh`/
`build-storefront.sh` in 6.6 vs `shopware-cli project admin-build`/`storefront-build` in
6.7); each pair is listed once per version below rather than merged, since the exact API
calls differ.

## Administration — dev/6.6

- [Add custom component](platform/dev/6.6/guides/plugins/plugins/administration/module-component-management/add-custom-component.md) — Register a custom Vue component with `Shopware.Component.register`, load it sync or async, give it a Twig template.
- [Add custom input field to existing component](platform/dev/6.6/guides/plugins/plugins/administration/module-component-management/add-custom-field.md) — Override `sw-product-settings-form`'s Twig template via `Component.override` to add an `sw-text-field`.
- [Add custom module](platform/dev/6.6/guides/plugins/plugins/administration/module-component-management/add-custom-module.md) — Register a new module with `Shopware.Module.register`: routes, navigation, snippets, `settingsItem`.
- [Customize modules](platform/dev/6.6/guides/plugins/plugins/administration/module-component-management/customizing-modules.md) — Modules can't be overridden directly; add/change routes via a new module's `routeMiddleware` in `main.js`.
- [Add tab to existing module](platform/dev/6.6/guides/plugins/plugins/administration/routing-navigation/add-new-tab.md) — Add an `sw-tabs-item` to e.g. `sw-product-detail` by overriding a Twig block and registering a child route via `routeMiddleware`.
- [Add CMS block](platform/dev/6.6/guides/plugins/plugins/content/cms/add-cms-block.md) — Register a custom Shopping Experiences block via `cmsService.registerCmsBlock`, its Vue component/preview, and Storefront Twig template.

## Storefront JS and themes — dev/6.6

- [Add custom Javascript](platform/dev/6.6/guides/plugins/plugins/storefront/add-custom-javascript.md) — Write and register a Storefront JS plugin extending `PluginBaseClass` via `PluginManager.register`, sync or async, with static options.
- [Add Javascript as script tag](platform/dev/6.6/guides/plugins/plugins/storefront/add-javascript-as-script-tag.md) — Add JS as a separate script element in the Storefront and how load order/defer/async affect it.
- [Override existing Javascript](platform/dev/6.6/guides/plugins/plugins/storefront/override-existing-javascript.md) — Extend/override a core Storefront JS plugin with `PluginManager.override`, illustrated with the cookie-permission plugin.
- [Remove Javascript plugin](platform/dev/6.6/guides/plugins/plugins/storefront/remove-unnecessary-js-plugin.md) — Unregister a core Storefront JS plugin (e.g. `OffCanvasCart`) with `window.PluginManager.deregister()`.
- [Add SCSS Styling and JavaScript to a Theme](platform/dev/6.6/guides/plugins/themes/add-css-js-to-theme.md) — Add SCSS via `base.scss`/`overrides.scss` and JS via `main.js` to a theme; compile and hot-reload workflow.

## Administration — dev/6.7

- [Adding Mixins](platform/dev/6.7/guides/plugins/plugins/administration/mixins-directives/add-mixins.md) — Register a custom mixin with `Shopware.Mixin.register`, import it in `main.js` before components, inject via `Mixin.getByName`.
- [Using Directives](platform/dev/6.7/guides/plugins/plugins/administration/mixins-directives/adding-directives.md) — Register directives globally via `Shopware.Directive.register` (imported in `main.js`) or locally in a component's `directives` option.
- [Add Custom Components](platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/add-custom-component.md) — Register a Vue component via `Shopware.Component.register`, async import preferred, using `wrapComponentConfig`.
- [Add Custom Input Field to Existing Component](platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/add-custom-field.md) — Override `sw-product-settings-form` and extend its Twig block, then build admin assets with `shopware-cli project admin-build`.
- [Add Custom Module](platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/add-custom-module.md) — `Shopware.Module.register` config: id format, routes, plugin navigation parent, snippets, `settingsItem`.
- [Customize Modules](platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/customizing-modules.md) — Add or change routes of an existing module by registering a new module with a `routeMiddleware` in `main.js`.
- [Add Tab to Existing Module](platform/dev/6.7/guides/plugins/plugins/administration/routing-navigation/add-new-tab.md) — Override `sw-product-detail`, add an `sw-tabs-item`, push a child route via `routeMiddleware`.
- [Add Filter](platform/dev/6.7/guides/plugins/plugins/administration/services-utilities/add-filter.md) — Register a custom text-formatting filter with `Shopware.Filter.register` in a `*.filter.js` file imported from `main.js`.

## Storefront JS and themes — dev/6.7

- [Remove JavaScript Plugin](platform/dev/6.7/guides/plugins/plugins/storefront/advanced/remove-unnecessary-js-plugin.md) — Remove a registered Storefront JS plugin (e.g. `OffCanvasCart`) from `main.js` with `window.PluginManager.deregister(name, selector)`.
- [Add Custom JavaScript](platform/dev/6.7/guides/plugins/plugins/storefront/javascript/add-custom-javascript.md) — Write a Storefront JS plugin extending `PluginBaseClass`, register it in `main.js` via `PluginManager.register` (sync/async, selector), pass `data-*-options`.
- [Override Existing JavaScript](platform/dev/6.7/guides/plugins/plugins/storefront/javascript/override-existing-javascript.md) — Subclass and override a core Storefront JS plugin via `PluginManager.override()` in `main.js`; example extends `CookiePermission`.
- [Add SCSS Styling and JavaScript to a Theme](platform/dev/6.7/guides/plugins/themes/styling/add-css-js-to-theme.md) — Add theme SCSS via `theme.json` style entries and JS via `app/storefront/src/main.js`; compile with `theme:compile`.

## App storefront and other topics — dev/6.7

- [Storefront](platform/dev/6.7/guides/plugins/apps/storefront/_index.md) — App Storefront customization: `Resources` folder layout for twig/js/scss, public assets, and manifest `template-load-priority`.
- [Code quality](platform/dev/6.7/guides/development/testing/store/code-quality.md) — Store code-review rules affecting `main.js`: no unminified JavaScript sources allowed in a submitted extension.
