---
id: platform/hubs/main-js.md
title: main.js
summary: "Guides where plugin, app and theme main.js entry points register Administration and Storefront code."
keywords: ["main.js", "administration plugin", "storefront javascript", "PluginManager", "Shopware.Component.register", "Shopware.Module.register", "routeMiddleware", "theme.json", "base.scss", "PluginBaseClass", "mixin", "cms block"]
members: ["platform/dev/6.6/guides/plugins/plugins/administration/module-component-management/add-custom-component.md", "platform/dev/6.6/guides/plugins/plugins/administration/module-component-management/add-custom-field.md", "platform/dev/6.6/guides/plugins/plugins/administration/module-component-management/add-custom-module.md", "platform/dev/6.6/guides/plugins/plugins/administration/module-component-management/customizing-modules.md", "platform/dev/6.6/guides/plugins/plugins/administration/routing-navigation/add-new-tab.md", "platform/dev/6.6/guides/plugins/plugins/content/cms/add-cms-block.md", "platform/dev/6.6/guides/plugins/plugins/storefront/add-custom-javascript.md", "platform/dev/6.6/guides/plugins/plugins/storefront/add-javascript-as-script-tag.md", "platform/dev/6.6/guides/plugins/plugins/storefront/override-existing-javascript.md", "platform/dev/6.6/guides/plugins/plugins/storefront/remove-unnecessary-js-plugin.md", "platform/dev/6.6/guides/plugins/themes/add-css-js-to-theme.md", "platform/dev/6.7/guides/plugins/apps/storefront/_index.md", "platform/dev/6.7/guides/plugins/plugins/administration/mixins-directives/add-mixins.md", "platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/add-custom-component.md", "platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/add-custom-field.md", "platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/customizing-components.md", "platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/customizing-modules.md", "platform/dev/6.7/guides/plugins/plugins/administration/routing-navigation/add-new-tab.md", "platform/dev/6.7/guides/plugins/plugins/administration/services-utilities/add-filter.md", "platform/dev/6.7/guides/plugins/plugins/storefront/advanced/remove-unnecessary-js-plugin.md", "platform/dev/6.7/guides/plugins/plugins/storefront/javascript/_index.md", "platform/dev/6.7/guides/plugins/plugins/storefront/javascript/add-custom-javascript.md", "platform/dev/6.7/guides/plugins/plugins/storefront/javascript/override-existing-javascript.md", "platform/dev/6.7/guides/plugins/themes/styling/add-css-js-to-theme.md", "platform/dev/6.7/resources/references/adr/2022-09-23-add-bootstrap-util.md"]
lastBuilt: 2026-10-21
---

# main.js

`main.js` is the entry file a plugin, app or theme uses to register its JavaScript. In the Administration it imports and registers components, modules, mixins, filters and overrides. In the Storefront it registers JS plugins with `PluginManager`. In themes it is the JS entry referenced from `theme.json`. Come here when you need to know what belongs in `main.js` for a given extension type, or which guide covers a registration or override step. Several 6.6 and 6.7 pages cover the same task; the 6.7 pages use `Shopware.*` registration and `shopware-cli` build commands.

## Shopware 6.6

### Administration

- [Add custom component](platform/dev/6.6/guides/plugins/plugins/administration/module-component-management/add-custom-component.md) — How to create and register a custom Administration Vue component, load it sync or async, and give it a Twig template.
- [Add custom input field to existing component](platform/dev/6.6/guides/plugins/plugins/administration/module-component-management/add-custom-field.md) — How to override an existing Administration component's Twig template to add a new input field, and build the plugin's JS.
- [Add custom module](platform/dev/6.6/guides/plugins/plugins/administration/module-component-management/add-custom-module.md) — How to create a new Administration module with Shopware.Module.register, configure it, and register menu, routes and snippets.
- [Customize modules](platform/dev/6.6/guides/plugins/plugins/administration/module-component-management/customizing-modules.md) — Modules in the Administration cannot be overridden directly; add or change their routes with a new module's routeMiddleware in main.js.
- [Add tab to existing module](platform/dev/6.6/guides/plugins/plugins/administration/routing-navigation/add-new-tab.md) — How to add a new tab to an existing module page by overriding a twig block and registering a new child route.

### Content

- [Add CMS block](platform/dev/6.6/guides/plugins/plugins/content/cms/add-cms-block.md) — Guide to registering a custom CMS block via cmsService.registerCmsBlock, its Vue component/preview, and its Storefront Twig template.

### Storefront and themes

- [Add custom Javascript](platform/dev/6.6/guides/plugins/plugins/storefront/add-custom-javascript.md) — How to write, register, bind, and configure a Storefront JavaScript plugin extending PluginBaseClass, including async loading.
- [Add Javascript as script tag](platform/dev/6.6/guides/plugins/plugins/storefront/add-javascript-as-script-tag.md) — How to add JavaScript as a separate script tag in the Storefront, and how load order and defer/async affect it.
- [Override existing Javascript](platform/dev/6.6/guides/plugins/plugins/storefront/override-existing-javascript.md) — How to extend and override a core Storefront JavaScript plugin using PluginManager.override, illustrated with the cookie-permission plugin.
- [Remove Javascript plugin](platform/dev/6.6/guides/plugins/plugins/storefront/remove-unnecessary-js-plugin.md) — Shows how to unregister a Core storefront JS plugin with window.PluginManager.deregister() from a custom plugin's main.js.
- [Add SCSS Styling and JavaScript to a Theme](platform/dev/6.6/guides/plugins/themes/add-css-js-to-theme.md) — Adding custom SCSS via base.scss and JS via main.js to a theme, compiling both, and the hot-proxy live-reload workflow.

## Shopware 6.7

### Administration

- [Add Custom Components](platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/add-custom-component.md) — Register a custom Administration Vue component from a plugin with Shopware.Component.register (async import preferred) and wrapComponentConfig. Same task as the 6.6 page above.
- [Add Custom Input Field to Existing Component](platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/add-custom-field.md) — Add an input field to sw-product-settings-form by overriding it and extending a TwigJS block. Same task as the 6.6 page above.
- [Customizing Components](platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/customizing-components.md) — Override/extend Administration components with Component.override/extend, Twig blocks, $super and experimental overrideComponentSetup.
- [Customize Modules](platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/customizing-modules.md) — Core modules can't be overridden; use Module.register with routeMiddleware to add child routes to existing routes like sw.product.detail. Same task as the 6.6 page above.
- [Add Tab to Existing Module](platform/dev/6.7/guides/plugins/plugins/administration/routing-navigation/add-new-tab.md) — Add a tab to sw-product-detail: extend the tabs block with sw-tabs-item, add the child route via routeMiddleware. Same task as the 6.6 page above.
- [Adding Mixins](platform/dev/6.7/guides/plugins/plugins/administration/mixins-directives/add-mixins.md) — Register a custom Administration mixin with Shopware.Mixin.register, import it in main.js before components, and inject it via Mixin.getByName.
- [Add Filter](platform/dev/6.7/guides/plugins/plugins/administration/services-utilities/add-filter.md) — Register a custom Administration filter (text formatter) with Shopware.Filter.register(name, fn) and import it in main.js.

### Storefront JavaScript

- [JavaScript](platform/dev/6.7/guides/plugins/plugins/storefront/javascript/_index.md) — Index of Storefront JavaScript guides: custom JS plugins, overriding plugins, events, script tags, fetching data, and the plugin/helper reference.
- [Add Custom JavaScript](platform/dev/6.7/guides/plugins/plugins/storefront/javascript/add-custom-javascript.md) — Write a Storefront JS plugin extending PluginBaseClass, register it in main.js, configure it via data-*-options, build it. Same task as the 6.6 page above.
- [Override Existing JavaScript](platform/dev/6.7/guides/plugins/plugins/storefront/javascript/override-existing-javascript.md) — Override a core Storefront JS plugin by extending its class and registering it with window.PluginManager.override(). Same task as the 6.6 page above.
- [Remove JavaScript Plugin](platform/dev/6.7/guides/plugins/plugins/storefront/advanced/remove-unnecessary-js-plugin.md) — Remove a registered Storefront JS plugin such as OffCanvasCart via window.PluginManager.deregister(name, selector). Same task as the 6.6 page above.
- [Add bootstrap JS-plugin initialization utility to storefront JS](platform/dev/6.7/resources/references/adr/2022-09-23-add-bootstrap-util.md) — ADR: storefront main.js calls BootstrapUtil.initBootstrapPlugins() to init Bootstrap Tooltip/Popover, replacing TooltipUtil.

### Themes and apps

- [Add SCSS Styling and JavaScript to a Theme](platform/dev/6.7/guides/plugins/themes/styling/add-css-js-to-theme.md) — Theme SCSS via theme.json style entries and base.scss, JS via the main.js entry; compile with theme:compile. Same task as the 6.6 page above.
- [Storefront](platform/dev/6.7/guides/plugins/apps/storefront/_index.md) — App Storefront changes: twig, JS and SCSS under the app's Resources folder, and template-load-priority in manifest.xml.
