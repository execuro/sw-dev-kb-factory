---
id: platform/dev/6.6/guides/plugins/plugins/administration/routing-navigation/add-new-tab.md
title: Add tab to existing module
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/administration/routing-navigation/add-new-tab.html
sourceHash: 8c6b5b73eb9f7ad563a5630dd378855726a185aa
keywords: ["add tab", "sw-tabs-item", "sw_product_detail_content_tabs_reviews", "routeMiddleware", "Component.override", "sw-product-detail", "custom route", "parentPath", "sw.product.detail.custom", "main.js"]
summary: How to add a new tab to an existing module page (e.g. product detail) by overriding a twig block and registering a new child route.
lastBuilt: 2026-09-15
relatedPages:
  - platform/dev/6.6/guides/plugins/plugins/plugin-base-guide.md
  - platform/dev/6.6/guides/plugins/plugins/administration/routing-navigation/add-custom-route.md
  - platform/dev/6.6/guides/plugins/plugins/administration/module-component-management/add-custom-component.md
---
## What it is

Walks through adding a new tab to an existing Administration page (using the product detail page as the example), including its route and content component.

## When to use

Use this when you want to add a new association or view as an extra tab on an existing entity detail page.

## Key steps / config

1. Find the last `sw-tabs-item` block inside the target page's tabs container, e.g. `sw_product_detail_content_tabs_reviews` on `sw-product-detail`.
2. Override that component's template, calling `{% parent %}` first so existing tabs remain, then add a new `sw-tabs-item`:

```twig
{% block sw_product_detail_content_tabs_reviews %}
    {% parent %}
    <sw-tabs-item :route="{ name: 'sw.product.detail.custom', params: { id: $route.params.id } }" title="Custom">
        Custom
    </sw-tabs-item>
{% endblock %}
```

3. Register the override in `index.js` and import it from `main.js`:

```javascript
import template from './sw-product-detail.html.twig';

Shopware.Component.override('sw-product-detail', {
    template
});
```

4. Register the new child route via a dummy module's `routeMiddleware`, guarding against duplicate registration:

```javascript
Shopware.Module.register('sw-new-tab-custom', {
    routeMiddleware(next, currentRoute) {
        const customRouteName = 'sw.product.detail.custom';
        if (currentRoute.name === 'sw.product.detail'
            && currentRoute.children.every((currentRoute) => currentRoute.name !== customRouteName)) {
            currentRoute.children.push({
                name: customRouteName,
                path: '/sw/product/detail/:id/custom',
                component: 'sw-product-detail-custom',
                meta: { parentPath: 'sw.product.index' }
            });
        }
        next(currentRoute);
    }
});
```

5. Create the tab's content component (`index.js` + `.html.twig`) under `view/sw-product-detail-custom`, registered with `Shopware.Component.register('sw-product-detail-custom', { template, metaInfo() { return { title: 'Custom' }; } })`.
6. Rebuild the Administration with `./bin/build-administration.sh` or, in a platform contribution setup, `composer run build:js:admin`.

## Essential identifiers

- `Shopware.Component.override(name, config)`
- `Shopware.Module.register(name, { routeMiddleware })`
- `sw-tabs-item`
- `sw_product_detail_content_tabs_reviews` twig block
- `meta.parentPath`

## Gotchas

The child route's `name` must match the name used in the `sw-tabs-item` route binding. The path should mirror the existing sibling paths (e.g. replace `base` with `custom`).
