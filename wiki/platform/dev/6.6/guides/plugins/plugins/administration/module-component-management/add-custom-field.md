---
id: platform/dev/6.6/guides/plugins/plugins/administration/module-component-management/add-custom-field.md
title: Add custom input field to existing component
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/administration/module-component-management/add-custom-field.html
sourceHash: c3a5a469da26e30f2509327b8f62e0ae3c1ffae1
keywords: ["custom input field", "Component.override", "sw-product-settings-form", "twig block override", "main.js", "sw-text-field", "sw-container", "build-administration.sh", "composer run build:js:admin", "TwigJS", "override method"]
summary: How to override an existing Administration component's Twig template to add a new input field, and build the plugin's JS.
lastBuilt: 2026-09-15
---
## What it is

Shows how to add a new input field to an existing Administration module component via plugin, using the product detail page's settings form as the worked example.

## When to use

Use this when you need to display/configure extra data on an existing core page (e.g. product detail) without creating a whole new module.

## Key steps / config

1. In `main.js`, override the target component with `Shopware.Component.override`, passing a new template:

```javascript
import template from './extension/sw-product-settings-form/sw-product-settings-form.html.twig';

Shopware.Component.override('sw-product-settings-form', {
    template
});
```

2. Create the Twig template file at `<plugin root>/src/Resources/app/administration/src/extension/sw-product-settings-form/sw-product-settings-form.html.twig`, overriding the relevant block and calling `{% parent %}` to keep the original content:

```twig
{% block sw_product_settings_form_content %}
    {% parent %}
    <sw-container columns="repeat(auto-fit, minmax(250px, 1fr))" gap="0px 30px">
        <sw-text-field label="Manufacturer ID" v-model="product.manufacturerId" disabled></sw-text-field>
    </sw-container>
{% endblock %}
```

3. Build the minified plugin JS by running, from the Shopware root:

```bash
./bin/build-administration.sh
```

or, in a platform contribution setup:

```bash
composer run build:js:admin
```

The output is placed under `<plugin root>/src/Resources/public/administration/js/<plugin-name>.js` and must be included when publishing the plugin.

## Essential identifiers

- `Shopware.Component.override(name, config)`
- `main.js` (entry point under `<plugin root>/src/Resources/app/administration/src`)
- `sw_product_settings_form_content` twig block
- `sw-product-settings-form` component

## Gotchas

The plugin must be activated for the overridden `main.js` to take effect.
