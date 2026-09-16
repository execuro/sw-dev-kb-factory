---
id: platform/dev/6.6/guides/plugins/plugins/administration/templates-styling/writing-templates.md
title: Writing templates
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/administration/templates-styling/writing-templates.html
sourceHash: 649aa465e256ebeb957e930cfdd069dbf653ee13
keywords: ["sw-page", "twig block", "Vue component", "Shopware.Component.register", "template property", "vue-meta", "metaInfo", "this.$createTitle", "administration templates", "twig vs vue", "component registration", "extendable blocks"]
summary: "How Administration components combine twig template files and Vue to render and extend module pages."
lastBuilt: "2026-09-15"
relatedPages: ["platform/dev/6.6/guides/plugins/plugins/administration/templates-styling/add-custom-styles.md", "platform/dev/6.6/guides/plugins/plugins/administration/advanced-configuration/add-shortcuts.md"]
---
## What it is

This guide explains how the Shopware 6 Administration uses twig and Vue templates together, and how to write and import a template into a component.

## When to use

When creating or extending an Administration component/module and you need to define its markup and wire it to the component's Vue logic.

## Key steps / config

1. Define the template in a separate `.twig` file named after the component, in the component's directory. A module's page should start with `sw-page`, and content should be wrapped in twig blocks so plugins can extend it:

```html
{% block swag_basic_example_page %}
    <sw-page class="swag-example-list">
    </sw-page>
{% endblock %}
```

2. Import the template file and assign it to the component's `template` property:

```javascript
import template from './swag-basic-example.html.twig';

Shopware.Component.register('swag-basic-example', {
    template,
    metaInfo() {
        return {
            title: this.$createTitle()
        };
    },
});
```

`metaInfo` is part of `vue-meta` and `this.$createTitle()` generates the page title.

## Essential identifiers

- `sw-page` component
- `Shopware.Component.register`
- component `template` property
- `metaInfo()` / `this.$createTitle()`

## Gotchas

Twig is used for **extending** another template (e.g. overriding a twig block) — overrides apply to all occurrences of that template. Vue is used to link data and the DOM to make them reactive.
