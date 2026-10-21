---
id: platform/dev/6.7/guides/plugins/plugins/content/cms/add-cms-element.md
title: Add CMS Elements
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/content/cms/add-cms-element.html
sourceHash: 3bf578a02cc14a8d722796463d27f2806a011664
codeCheckedAgainst: "6.7.15.1"
keywords: ["cms element", "registerCmsElement", "cmsService", "cms-element", "initElementConfig", "configComponent", "defaultConfig", "sw-cms-inherit-wrapper", "cms-element-dailymotion.html.twig", "shopping experiences", "custom element", "slot", "inheritance"]
summary: Register a custom CMS element (component, config, preview) with cmsService.registerCmsElement plus a cms-element-*.html.twig template.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/concepts/commerce/content/shopping-experiences-cms.md", "platform/dev/6.7/guides/plugins/plugins/content/cms/add-cms-block.md"]
---
## What it is

How a plugin adds a custom CMS element, the smallest content unit in Shopping Experiences. Elements are context-free primitives with minimal markup, always rendered inside a block slot. Example used: a `dailymotion` video embed. See [Shopping Experiences concept](platform/dev/6.7/concepts/commerce/content/shopping-experiences-cms.md).

## When to use

When content managers need a new element type selectable in a block slot (Content > Shopping Experience, slot arrow icon), with its own config panel and Storefront rendering.

## Key steps / config

Plugin layout: `<plugin root>/src/Resources/app/administration/src/module/sw-cms/elements/dailymotion/` with `index.js`, `component/`, `config/`, `preview/`.

1. `main.js`: `import './module/sw-cms/elements/dailymotion';`
2. Element `index.js` imports `./component`, `./config`, `./preview` and registers:

```js
Shopware.Service('cmsService').registerCmsElement({
    name: 'dailymotion',
    label: 'cms.elements.dailymotion.label',
    component: 'cms-el-dailymotion',
    configComponent: 'cms-el-config-dailymotion',
    previewComponent: 'cms-el-preview-dailymotion',
    defaultConfig: { url: { source: 'static', value: '' } },
});
```

Each `defaultConfig` entry is `{ source, value }`. Optional: `hidden` (hide in "replace element" modal), `removable` (prevent removal via UI).

3. Preview component `cms-el-preview-dailymotion` — thumbnail in the element selector.
4. Main component `cms-el-dailymotion` — editor rendering; uses `mixins: ['cms-element']` and calls `this.initElementConfig()` in `created()`. Show fallback content (e.g. a heading) when `element.config.url.value` is empty.
5. Config component `cms-el-config-dailymotion` — form fields (e.g. `mt-text-field` bound to `element.config.url.value`) for every `defaultConfig` key; same mixin and `initElementConfig()` call.
6. Inheritance: wrap individual config fields in `sw-cms-inherit-wrapper` so values can be inherited from the base layout or overridden per page:

```html
<sw-cms-inherit-wrapper field="verticalAlign" :element="element" :label="$t('sw-cms.elements.general.config.label.verticalAlign')">
</sw-cms-inherit-wrapper>
```

7. Storefront template `<plugin root>/src/Resources/views/storefront/element/cms-element-dailymotion.html.twig` (prefix `cms-element-` + `name` + `.html.twig`); read config via `{{ element.config.url.value }}`.

## Essential identifiers

- `Shopware.Service('cmsService').registerCmsElement()`
- mixin `cms-element`, method `initElementConfig()`
- `sw-cms-inherit-wrapper`
- `CmsSlotDefinition` (fields available on `element` in Twig)
- `\Shopware\Core\Content\Cms\SalesChannel\SalesChannelCmsPageLoader::load`
- Core element code: `src/Administration/Resources/app/administration/src/module/sw-cms/elements/`, `src/Storefront/Resources/views/storefront/element/`

## Gotchas

- `registerCmsElement()` returns `false` without registering when `name` or `component` is missing or `flag` is `false`; if no `collect`/`enrich` is given, defaults are assigned.
- The docs call `initElementConfig('dailymotion')`; the installed method takes no argument and derives defaults from `element.type`, so the argument is ignored.
- The `cms-element` mixin is annotated `@private` in the installed code.
- The Storefront filename must include the `cms-element-` prefix. Clear the Storefront cache after adding templates.

## Code check (6.7.15.1)
- confirmed `CmsService::registerCmsElement()` — requires `name` and `component`, defaults `collect`/`enrich` — vendor/shopware/administration/Resources/app/administration/src/module/sw-cms/service/cms.service.ts:155
- confirmed `CmsElementConfig` — has optional `configComponent`, `previewComponent`, `hidden`, `removable` — vendor/shopware/administration/Resources/app/administration/src/module/sw-cms/service/cms.service.ts:42
- confirmed `cms-element` — mixin registered under this name, marked `@private` — vendor/shopware/administration/Resources/app/administration/src/module/sw-cms/mixin/sw-cms-element.mixin.ts:16
- corrected `initElementConfig()` — docs: `initElementConfig('dailymotion')`; method takes no parameter, uses `element.type` — vendor/shopware/administration/Resources/app/administration/src/module/sw-cms/mixin/sw-cms-element.mixin.ts:52
- confirmed `sw-cms-inherit-wrapper` — registered admin component — vendor/shopware/administration/Resources/app/administration/src/module/sw-cms/component/index.ts:134
- confirmed `CmsSlotDefinition` — entity `cms_slot` — vendor/shopware/core/Content/Cms/Aggregate/CmsSlot/CmsSlotDefinition.php:30
- confirmed `SalesChannelCmsPageLoader::load()` — core page loading entry — vendor/shopware/core/Content/Cms/SalesChannel/SalesChannelCmsPageLoader.php:44
- confirmed `@Storefront/storefront/element/cms-element-` — core blocks include element templates by this prefix plus `element.type` — vendor/shopware/storefront/Resources/views/storefront/block/cms-block-image-text.html.twig:9
