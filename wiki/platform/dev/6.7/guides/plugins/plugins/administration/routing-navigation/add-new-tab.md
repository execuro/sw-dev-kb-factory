---
id: platform/dev/6.7/guides/plugins/plugins/administration/routing-navigation/add-new-tab.md
title: Add Tab to Existing Module
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/routing-navigation/add-new-tab.html
sourceHash: be9228fb979072a8bf6be8cb31825e6021cb8d16
codeCheckedAgainst: "6.7.15.1"
keywords: ["sw-product-detail", "sw_product_detail_content_tabs_reviews", "sw-tabs-item", "routeMiddleware", "Shopware.Component.override", "Shopware.Module.register", "sw.product.detail.custom", "custom tab", "product detail tab", "child route", "parent block", "admin-build", "main.js"]
summary: "Add a tab to an existing admin detail page (sw-product-detail): extend the tabs block with sw-tabs-item, add the child route via routeMiddleware."
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md", "platform/dev/6.7/guides/plugins/plugins/administration/routing-navigation/add-custom-route.md", "platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/add-custom-component.md"]
---
## What it is

How a plugin adds a tab to an existing Administration detail page — example: a "Custom" tab on `sw-product-detail`. Three parts: a template override adding a `sw-tabs-item`, a child route injected via a module's `routeMiddleware`, and the component that route renders.

## When to use

When an entity's detail page needs an extra view, e.g. to configure a new association on its own tab. Requires a running plugin ([plugin base guide](platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md)); the entry point is `<plugin root>/src/Resources/app/administration/src/main.js`.

## Key steps / config

1. **Override the page template** in `<plugin root>/src/Resources/app/administration/src/page/sw-product-detail/index.js`:
   ```javascript
   import template from './sw-product-detail.html.twig';
   Shopware.Component.override('sw-product-detail', { template });
   ```
2. **Extend a tab block inside `<sw-tabs>`** — the last tab block is `sw_product_detail_content_tabs_reviews` — calling `{% parent %}` first:
   ```twig
   {% block sw_product_detail_content_tabs_reviews %}
       {% parent %}
       <sw-tabs-item :route="{ name: 'sw.product.detail.custom', params: { id: $route.params.id } }" title="Custom">
           Custom
       </sw-tabs-item>
   {% endblock %}
   ```
   Overriding the outer `sw_product_detail_content_tabs` block would place the item outside `<sw-tabs>`.
3. **Register the child route** in `main.js` with a dummy module whose `routeMiddleware(next, currentRoute)` adds a child to `sw.product.detail`:
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
   The child `name` must equal the tab's route name; the path mirrors core ones like `/sw/product/detail/:id/base`.
4. **Create the component** in `view/sw-product-detail-custom/index.js`: `Shopware.Component.register('sw-product-detail-custom', { template, metaInfo() { return { title: 'Custom' }; } })`, template e.g. `<sw-card title="Custom">Hello world!</sw-card>`.
5. Rebuild the Administration: `shopware-cli project admin-build` (project) or `composer run build:js:admin` (platform contribution setup).

## Essential identifiers

- `Shopware.Component.override`, `Shopware.Component.register`, `Shopware.Module.register`, `routeMiddleware`
- blocks `sw_product_detail_content_tabs`, `sw_product_detail_content_tabs_reviews`; element `sw-tabs-item`
- routes `sw.product.detail`, `sw.product.detail.custom`, `sw.product.index`

## Gotchas

- Without `{% parent %}` the Reviews tab is replaced instead of extended.
- 6.7.15.1 also has an empty `sw_product_detail_content_tabs_additional` block after the reviews block, inside `<sw-tabs>`.

## Version notes

In 6.7.15.1 the `<sw-tabs>` markup is the `v-else` branch of `feature.isActive('v6.8.0.0')`; with that flag on, the page renders `mt-tabs` from the `productDetailTabs` computed list (block `sw_product_detail_content_mt_tabs`), so the Twig block override above adds no tab there.

## Code check (6.7.15.1)
- confirmed `sw_product_detail_content_tabs_reviews` — block wrapping the reviews `sw-tabs-item` — vendor/shopware/administration/Resources/app/administration/src/module/sw-product/page/sw-product-detail/sw-product-detail.html.twig:244
- confirmed `sw_product_detail_content_tabs_additional` — empty block inside `sw-tabs` — vendor/shopware/administration/Resources/app/administration/src/module/sw-product/page/sw-product-detail/sw-product-detail.html.twig:255
- confirmed `sw_product_detail_content_tabs` — outer block, branches on `v6.8.0.0` — vendor/shopware/administration/Resources/app/administration/src/module/sw-product/page/sw-product-detail/sw-product-detail.html.twig:147
- confirmed `productDetailTabs` — tab list for `mt-tabs` under v6.8.0.0 — vendor/shopware/administration/Resources/app/administration/src/module/sw-product/page/sw-product-detail/index.js:142
- confirmed `routeMiddleware` — registered via middleware helper — vendor/shopware/administration/Resources/app/administration/src/core/factory/module.factory.ts:265
- confirmed `override` — `Shopware.Component.override` → `AsyncComponentFactory.override` — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:137
- confirmed `path: 'base'` — core child route of product detail — vendor/shopware/administration/Resources/app/administration/src/module/sw-product/index.js:197
- unverified `shopware-cli project admin-build` — external CLI, out of scope
