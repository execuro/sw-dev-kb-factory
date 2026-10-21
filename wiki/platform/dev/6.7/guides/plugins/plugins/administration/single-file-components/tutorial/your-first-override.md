---
id: platform/dev/6.7/guides/plugins/plugins/administration/single-file-components/tutorial/your-first-override.md
title: 2. Your first override
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/single-file-components/tutorial/your-first-override.html
sourceHash: 9ddc6c9a0c1adad7c9804ac9aa5622528edc3691
codeCheckedAgainst: "6.7.15.1"
keywords: [".override.vue", "sw-block extends", "sw-product-detail-base", "sw_product_detail_base_price_form", "sw_product_detail_base_price_card", "mt-banner", "Shopware.Component.override", "single file component", "sfc override", "extend core component", "twig block", "admin extension point"]
summary: SFC tutorial chapter 2 - place a banner in sw-product-detail-base via a file named sw-product-detail-base.override.vue and sw-block extends.
lastBuilt: 2026-10-21
---
## What it is

Chapter 2 of the Administration Single File Component (SFC) tutorial: the plugin adds its own banner under the price fields of the product detail page by overriding the core component `sw-product-detail-base`, without touching the core page.

## When to use

When you want to contribute markup to an existing Administration component you do not own, using a Vue SFC override instead of the Twig/Options API `Shopware.Component.override()` pattern.

## Key steps / config

1. Find the extension point. The **Prices** card on **Products → Overview → (product) → General** is rendered by `sw-product-detail-base`; its template declares:

```twig
{% block sw_product_detail_base_price_card %}
<mt-card :title="$t('sw-product.detailBase.cardTitlePrices')">
    {% block sw_product_detail_base_price_form %}
    <sw-product-price-form :allow-edit="acl.can('product.editor')" />
    {% endblock %}
</mt-card>
{% endblock %}
```

   Every `{% block %}` (and every `<sw-block name="…">`) is an extension point; `sw_product_detail_base_price_form` wraps the price fields.
2. Create one file; the filename is the registration:
   `<plugin root>/src/Resources/app/administration/src/override/sw-product-detail-base.override.vue`
   - `sw-product-detail-base` = which component is overridden; `.override.vue` = it is an override, not a new component.
   - `sw-product-detail-base/index.override.vue` means the same. Location in the plugin does not matter: the build scans the whole Administration directory for `*.override.vue`, imports and registers each one. No import in `main.ts`.
3. In the override's template, extend the block with `<sw-block extends="sw_product_detail_base_price_form">`, render the original content with `<sw-block-parent />`, then add the banner. `<sw-block extends>` works the same against a Twig `{% block %}` or an `<sw-block name>`.
4. `mt-banner` is globally registered; no import is needed.
5. Run `shopware-cli project admin-watch` (or a build) and reload the product; the banner appears under the price fields.

## Essential identifiers

- `*.override.vue` / `<component>/index.override.vue`
- `sw-product-detail-base`, `sw_product_detail_base_price_card`, `sw_product_detail_base_price_form`
- `<sw-block extends="…">`, `<sw-block name="…">`, `<sw-block-parent />`
- `mt-banner`, `mt-card`
- Legacy equivalent: `Shopware.Component.override('sw-product-detail-base', { template })` plus `{% parent %}` and an import in `main.js`

## Gotchas

- Block content sits flush against the content above it, without spacing; chapter 4 adds styles.
- Block names are stable identifiers; find them in the component's template in shopware/shopware by searching for visible text or a CSS class, then taking the enclosing `{% block %}` or `<sw-block name>`.
- Extending across Twig and SFC is handled by shims in most cases, with a caveat documented in the roadmap's "Alongside Twig" section.
- The Twig/Options API override and the SFC override both still work and can live in the same plugin.

## Version notes

- The tutorial targets 6.7.16.0+ / `trunk`. In 6.7.15.1 the runtime pieces (`sw-block`, `sw-block-parent`, override setup merging that also applies Options API shim overrides) are present; the build-time discovery of `*.override.vue` lives outside the checked package roots.

## Code check (6.7.15.1)
- confirmed `sw_product_detail_base_price_card` — Twig block in the core template — vendor/shopware/administration/Resources/app/administration/src/module/sw-product/view/sw-product-detail-base/sw-product-detail-base.html.twig:45
- confirmed `sw_product_detail_base_price_form` — wraps `sw-product-price-form` — vendor/shopware/administration/Resources/app/administration/src/module/sw-product/view/sw-product-detail-base/sw-product-detail-base.html.twig:54
- confirmed `sw-product-detail-base` — registered core component — vendor/shopware/administration/Resources/app/administration/src/module/sw-product/index.js:105
- confirmed `sw-block` — globally registered component — vendor/shopware/administration/Resources/app/administration/src/app/component/index.ts:113
- confirmed `sw-block-parent` — globally registered component — vendor/shopware/administration/Resources/app/administration/src/app/component/index.ts:110
- confirmed `extends` — `sw-block` prop used to extend a named block — vendor/shopware/administration/Resources/app/administration/src/app/component/structure/sw-block-override/sw-block/index.ts:77
- confirmed `MtBanner` — registered globally in the Vue adapter — vendor/shopware/administration/Resources/app/administration/src/app/adapter/view/vue.adapter.ts:434
- confirmed `createExtendableSetup` — applies Composition API and Options API shim overrides — vendor/shopware/administration/Resources/app/administration/src/app/adapter/composition-extension-system/index.ts:257
- confirmed `override` — legacy `Shopware.Component.override()` factory function — vendor/shopware/administration/Resources/app/administration/src/core/factory/async-component.factory.ts:609
- unverified `*.override.vue` — build-time file discovery lives in the build tooling, outside the checked roots
