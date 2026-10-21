---
id: platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/add-custom-field.md
title: Add Custom Input Field to Existing Component
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/module-component-management/add-custom-field.html
sourceHash: 1db23ae885b66314f1e3c26bf5fe6095f4f9f621
codeCheckedAgainst: "6.7.15.1"
keywords: ["Shopware.Component.override", "sw-product-settings-form", "sw_product_settings_form_content", "{% parent %}", "mt-text-field", "sw-container", "main.js", "shopware-cli project admin-build", "composer run build:js:admin", "twig block override", "product detail page", "add input field"]
summary: Add an input field to an existing Administration component (sw-product-settings-form) by overriding it and extending a TwigJS block.
lastBuilt: 2026-10-21
---
## What it is

How a plugin adds a new input field to an existing Administration component. The example extends the product detail page's settings form (`sw-product-settings-form`) with a read-only "Manufacturer ID" field.

## When to use

You want to display or edit additional data on an existing Administration page without replacing the whole component.

## Key steps / config

1. Entry point: `<plugin root>/src/Resources/app/administration/src/main.js`.
2. Override the component with `Shopware.Component.override(<component name>, <object with overridden properties>)`, passing the template extension:

```javascript
// <plugin root>/src/Resources/app/administration/src/main.js
import template from './extension/sw-product-settings-form/sw-product-settings-form.html.twig';

Shopware.Component.override('sw-product-settings-form', {
    template
});
```

3. Create the TwigJS template at `<plugin root>/src/Resources/app/administration/src/extension/sw-product-settings-form/sw-product-settings-form.html.twig` (path after `src` is a recommendation). Override the block, call `{% parent %}` to keep the original form, then append your field:

```twig
{% block sw_product_settings_form_content %}
    {% parent %}

    <sw-container columns="repeat(auto-fit, minmax(250px, 1fr))" gap="0px 30px">
        <mt-text-field label="Manufacturer ID" v-model="product.manufacturerId" disabled></mt-text-field>
    </sw-container>
{% endblock %}
```

The core form itself renders its fields with `mt-text-field`; the field is `disabled` because it is read-only here.

4. Build the Administration from the Shopware root (plugin must be active):
   - template setup: `shopware-cli project admin-build`
   - platform contribution setup: `composer run build:js:admin`

For a plugin named "AdministrationNewField" the output lands in `<plugin root>/src/Resources/public/administration/js/administration-new-field.js`; ship that file with the plugin. A copy is placed under `<shopware root>/public/bundles/administration/newfield/administration/js/administration-new-field.js` and loaded in production.

## Essential identifiers

- `Shopware.Component.override`
- `sw-product-settings-form` (component), `sw_product_settings_form_content` (Twig block)
- `{% parent %}`
- `sw-container`, `mt-text-field`
- `shopware-cli project admin-build`, `composer run build:js:admin`

## Gotchas

- Without `{% parent %}` the override replaces the entire settings form.
- The docs' snippet uses `sw-text-field`; in 6.7.15.1 that wrapper is deprecated for v6.8.0 in favour of `mt-text-field`.

## Code check (6.7.15.1)
- confirmed `Shopware.Component.override` — maps to `AsyncComponentFactory.override` — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:137
- confirmed `override()` — signature `(componentName, componentConfiguration, overrideIndex)` — vendor/shopware/administration/Resources/app/administration/src/core/factory/async-component.factory.ts:609
- confirmed `sw-product-settings-form` — core component registered by the product module — vendor/shopware/administration/Resources/app/administration/src/module/sw-product/index.js:29
- confirmed `sw_product_settings_form_content` — block in the core template — vendor/shopware/administration/Resources/app/administration/src/module/sw-product/component/sw-product-settings-form/sw-product-settings-form.html.twig:3
- confirmed `sw-container` — global component — vendor/shopware/administration/Resources/app/administration/src/app/component/index.ts:440
- deprecated `sw-text-field` — tag:v6.8.0, use mt-text-field — vendor/shopware/administration/Resources/app/administration/src/app/component/form/sw-text-field/index.ts:10
- confirmed `mt-text-field` — used by the core settings form — vendor/shopware/administration/Resources/app/administration/src/module/sw-product/component/sw-product-settings-form/sw-product-settings-form.html.twig:43
- unverified `composer run build:js:admin` — root composer.json, out of scope
- unverified `shopware-cli project admin-build` — external CLI, out of scope
