---
id: platform/dev/6.7/guides/plugins/plugins/administration/templates-styling/writing-templates.md
title: Writing templates
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/templates-styling/writing-templates.html
sourceHash: 4fbd14d941a6f5d347ef917f7cc15a7910403317
codeCheckedAgainst: "6.7.13.0"
keywords: ["administration template", "twig", "vue", "sw-page", "Shopware.Component.register", "template property", "metaInfo", "$createTitle", "twig block", "html.twig", "admin component", "page title"]
summary: Admin component templates in 6.7 - a .html.twig file with twig blocks, sw-page as page root, imported into the component's template property.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/administration/templates-styling/add-custom-styles.md", "platform/dev/6.7/guides/plugins/plugins/administration/advanced-configuration/add-shortcuts.md"]
---
## What it is

How an Administration component gets its markup: a Twig.js template file (named after the component, in the component's directory) that is imported and assigned to the component's `template` property. The Administration combines twig (for extending templates) with Vue (for reactive data binding).

## When to use

Building a custom Administration module page or component in a plugin, and making its markup extendable by other plugins via twig blocks.

## Key steps / config

1. Create `<component-name>.html.twig` in the component directory. Wrap markup in twig blocks so other plugins can override it. A module page should start with the `sw-page` component, which provides the search bar, the page header (smart bar) and a `content` slot:

   ```twig
   {% block swag_basic_example_page %}
       <sw-page class="swag-example-list">
           <template #content>...</template>
       </sw-page>
   {% endblock %}
   ```

2. Import the file and assign it to `template` when registering the component; optionally return a page title from `metaInfo()`:

   ```javascript
   import template from './swag-basic-example.html.twig';

   Shopware.Component.register('swag-basic-example', {
       template,
       metaInfo() {
           return { title: this.$createTitle() };
       },
   });
   ```

`this.$createTitle()` is a global property that builds the page title; the object returned by `metaInfo()` sets `document.title` via its `title` key.

## Essential identifiers

- `Shopware.Component.register(name, config)`
- `template` (component property)
- `sw-page` and its `content` slot
- `metaInfo()`, `this.$createTitle()`
- `{% block ... %}` / `{% endblock %}`

## Gotchas

- Twig is for extending another template (overriding a block to inject markup); Vue handles data/DOM reactivity. An override of a twig block applies to all occurrences of that template, not one instance.
- The docs attribute `metaInfo` to the `vue-meta` library; in 6.7 it is handled by Shopware's own `meta-info.plugin.js`, which only reads a `title` key from the returned object.

## Code check (6.7.13.0)
- confirmed `AsyncComponentFactory.register` — backs `Shopware.Component.register` — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:130
- confirmed `register` — signature `register(componentName, componentConfiguration)` — vendor/shopware/administration/Resources/app/administration/src/core/factory/async-component.factory.ts:477
- confirmed `$createTitle` — registered as global property by the Vue adapter — vendor/shopware/administration/Resources/app/administration/src/app/adapter/view/vue.adapter.ts:802
- corrected `metaInfo` — docs: part of vue-meta; handled by Shopware's meta-info plugin setting document.title — vendor/shopware/administration/Resources/app/administration/src/app/plugin/meta-info.plugin.js:38
- confirmed `sw-page` — core structure component importing its own twig template — vendor/shopware/administration/Resources/app/administration/src/app/component/structure/sw-page/index.js:1
- confirmed `content` — sw-page exposes a content slot — vendor/shopware/administration/Resources/app/administration/src/app/component/structure/sw-page/sw-page.html.twig:152
