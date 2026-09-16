---
id: platform/dev/6.7/guides/plugins/plugins/administration/routing-navigation/add-new-tab.md
title: Add Tab to Existing Module
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/routing-navigation/add-new-tab.html
sourceHash: be9228fb979072a8bf6be8cb31825e6021cb8d16
codeCheckedAgainst: "6.7.13.0"
keywords: ["admin tab", "product detail tab", "sw-product-detail", "sw-tabs-item", "sw_product_detail_content_tabs_additional", "sw_product_detail_content_tabs_reviews", "Shopware.Component.override", "routeMiddleware", "sw.product.detail.custom", "child route", "main.js", "admin-build"]
summary: Add a tab to the product detail page - override sw-product-detail template, add sw-tabs-item, push a child route via routeMiddleware, register the view.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/administration/routing-navigation/add-custom-route.md", "platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/add-custom-component.md", "platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md"]
---
## What it is

How a plugin adds a new tab to an existing Administration module page — example: a "Custom" tab on the product detail page (`sw-product-detail`) that renders a plugin component via its own child route.

## When to use

When you want to configure something (e.g. a new association of an entity) on a separate tab of an existing core detail page. Requires a running plugin; entry point is `<plugin root>/src/Resources/app/administration/src/main.js`.

## Key steps / config

1. Override the page template. `<plugin root>/src/Resources/app/administration/src/page/sw-product-detail/index.js`:
   `import template from './sw-product-detail.html.twig'; Shopware.Component.override('sw-product-detail', { template });`
2. In `sw-product-detail.html.twig` extend a block inside the `<sw-tabs>` element. In 6.7 the core template ends the tab list with the empty block `sw_product_detail_content_tabs_additional`, meant for additional tabs:

```twig
{% block sw_product_detail_content_tabs_additional %}
    {% parent %}
    <sw-tabs-item :route="{ name: 'sw.product.detail.custom', params: { id: $route.params.id } }" title="Custom">
        Custom
    </sw-tabs-item>
{% endblock %}
```

3. Import the override and register the child route in `main.js` through a dummy module whose `routeMiddleware` pushes a child onto `sw.product.detail`:

```javascript
import './page/sw-product-detail';
import './view/sw-product-detail-custom';
Shopware.Module.register('sw-new-tab-custom', {
    routeMiddleware(next, currentRoute) {
        const customRouteName = 'sw.product.detail.custom';
        if (currentRoute.name === 'sw.product.detail'
            && currentRoute.children.every((r) => r.name !== customRouteName)) {
            currentRoute.children.push({ name: customRouteName, path: '/sw/product/detail/:id/custom',
                component: 'sw-product-detail-custom', meta: { parentPath: 'sw.product.index' } });
        }
        next(currentRoute);
    }
});
```

4. Create `view/sw-product-detail-custom/index.js` with `Shopware.Component.register('sw-product-detail-custom', { template, metaInfo() { return { title: 'Custom' }; } })` and a template `sw-product-detail-custom.html.twig` (e.g. an `sw-card` with "Hello world!").
5. Rebuild the Administration: `shopware-cli project admin-build` (project template) or `composer run build:js:admin` (platform contribution setup).

## Essential identifiers

- `Shopware.Component.override`, `Shopware.Component.register`, `Shopware.Module.register`
- `sw-product-detail`, `sw_product_detail_content_tabs_additional`, `sw-tabs-item`
- `routeMiddleware`, `sw.product.detail`, `sw.product.detail.custom`, `sw.product.index`
- `metaInfo`

## Gotchas

- Always call `{% parent %}` when extending a tab block you do not want to replace; the source's approach of extending `sw_product_detail_content_tabs_reviews` without it would remove the Reviews tab. The source calls reviews the last block, but 6.7 has `sw_product_detail_content_tabs_additional` after it.
- The `name` of the child route must match the name used in the `sw-tabs-item` `:route`.
- The core detail route path is `detail/:id?` with children such as `base`; the source quotes `/sw/product/detail/:id/base` as the default child path.
- Without the child route, clicking the tab results in an error.

## Code check (6.7.13.0)
- corrected `sw_product_detail_content_tabs_additional` — docs: `sw_product_detail_content_tabs_reviews` is the last block inside `sw-tabs` — vendor/shopware/administration/Resources/app/administration/src/module/sw-product/page/sw-product-detail/sw-product-detail.html.twig:241
- confirmed `sw_product_detail_content_tabs_reviews` — still present, wraps the Reviews tab — vendor/shopware/administration/Resources/app/administration/src/module/sw-product/page/sw-product-detail/sw-product-detail.html.twig:230
- confirmed `sw_product_detail_content_tabs` — wraps `sw-tabs` with class `sw-product-detail-page__tabs` — vendor/shopware/administration/Resources/app/administration/src/module/sw-product/page/sw-product-detail/sw-product-detail.html.twig:147
- confirmed `AsyncComponentFactory.override` — exposed as `Shopware.Component.override` — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:132
- confirmed `routeMiddleware` — registered via `middlewareHelper.use` — vendor/shopware/administration/Resources/app/administration/src/core/factory/module.factory.ts:266
- confirmed `middlewareHelper.go` — invoked with each top-level route, children already an array — vendor/shopware/administration/Resources/app/administration/src/core/factory/module.factory.ts:457
- corrected `detail/:id?` — docs: default child path `/sw/product/detail/:id/base` (id is optional in 6.7) — vendor/shopware/administration/Resources/app/administration/src/module/sw-product/index.js:181
- confirmed `sw.product.detail.base` — core child route, redirect target of detail — vendor/shopware/administration/Resources/app/administration/src/module/sw-product/index.js:186
- confirmed `metaInfo` — component option used by core product detail page — vendor/shopware/administration/Resources/app/administration/src/module/sw-product/page/sw-product-detail/index.js:88
- confirmed `sw.product.index` — used as `parentPath` of detail children — vendor/shopware/administration/Resources/app/administration/src/module/sw-product/index.js:200
