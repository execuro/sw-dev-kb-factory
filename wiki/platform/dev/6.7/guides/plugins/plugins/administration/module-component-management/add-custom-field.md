---
id: platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/add-custom-field.md
title: Add Custom Input Field to Existing Component
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/module-component-management/add-custom-field.html
sourceHash: 1db23ae885b66314f1e3c26bf5fe6095f4f9f621
codeCheckedAgainst: "6.7.13.0"
keywords: ["custom input field", "Shopware.Component.override", "sw-product-settings-form", "sw_product_settings_form_content", "parent", "twig block", "mt-text-field", "product detail page", "main.js", "shopware-cli project admin-build", "composer run build:js:admin", "extend admin form"]
summary: Add an input field to an existing Administration component by overriding sw-product-settings-form and extending its Twig block, then building admin assets.
lastBuilt: 2026-09-15
---
## What it is

How a plugin adds a new (read-only) input field to an existing Administration component — the product detail page settings form `sw-product-settings-form` — by overriding the component's template and extending a Twig block.

## When to use

You want to show or edit additional data in an existing Administration form without replacing the whole component.

## Key steps / config

1. In `<plugin root>/src/Resources/app/administration/src/main.js`, override the component; the first argument is the component name, the second an object with the overridden properties:

```javascript
import template from './extension/sw-product-settings-form/sw-product-settings-form.html.twig';

Shopware.Component.override('sw-product-settings-form', {
    template
});
```

2. Create `<plugin root>/src/Resources/app/administration/src/extension/sw-product-settings-form/sw-product-settings-form.html.twig` (path after `src` is free to choose). Extend the block, keep the original content with `{% parent %}`, append the field:

```twig
{% block sw_product_settings_form_content %}
    {% parent %}

    <sw-container columns="repeat(auto-fit, minmax(250px, 1fr))" gap="0px 30px">
        <mt-text-field label="Manufacturer ID" v-model="product.manufacturerId" disabled></mt-text-field>
    </sw-container>
{% endblock %}
```

   The template is TwigJS; `product` is available in this component's template.
3. Build the Administration from the Shopware root (plugin must be active):
   - project template: `shopware-cli project admin-build`
   - platform contribution setup: `composer run build:js:admin`
4. Output for a plugin named "AdministrationNewField": `<plugin root>/src/Resources/public/administration/js/administration-new-field.js`. Ship this file with the plugin; it is copied into `<shopware root>/public/bundles/...` and loaded in production.

## Essential identifiers

- `Shopware.Component.override`
- `sw-product-settings-form`, block `sw_product_settings_form_content`
- `{% parent %}`
- `shopware-cli project admin-build`, `composer run build:js:admin`

## Gotchas

- Omitting `{% parent %}` replaces the entire settings form instead of adding to it.
- The source's example uses `sw-text-field`; in 6.7.13 that component is a wrapper marked deprecated for removal in 6.8 with `mt-text-field` named as replacement, so the snippet above uses `mt-text-field`.

## Code check (6.7.13.0)
- confirmed `AsyncComponentFactory.override` — exposed as `Shopware.Component.override` — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:132
- confirmed `sw_product_settings_form_content` — block exists in the core template — vendor/shopware/administration/Resources/app/administration/src/module/sw-product/component/sw-product-settings-form/sw-product-settings-form.html.twig:3
- confirmed `product.releaseDate` — `product` is used inside the block, so it is available to the extension — vendor/shopware/administration/Resources/app/administration/src/module/sw-product/component/sw-product-settings-form/sw-product-settings-form.html.twig:10
- confirmed `sw-container` — registered core base component — vendor/shopware/administration/Resources/app/administration/src/app/component/index.ts:436
- deprecated `sw-text-field` — deprecated tag:v6.8.0, use mt-text-field — vendor/shopware/administration/Resources/app/administration/src/app/component/form/sw-text-field/index.ts:10
- unverified `composer run build:js:admin` — defined in the platform root composer.json, out of scope
- unverified `shopware-cli project admin-build` — external CLI, out of scope
