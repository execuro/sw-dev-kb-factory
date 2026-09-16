---
id: platform/dev/6.7/guides/plugins/plugins/content/cms/add-cms-element.md
title: Add CMS Elements
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/content/cms/add-cms-element.html
sourceHash: 3bf578a02cc14a8d722796463d27f2806a011664
codeCheckedAgainst: "6.7.13.0"
keywords: ["add cms element", "shopping experiences", "registerCmsElement", "cmsService", "cms-element", "initElementConfig", "sw-cms-inherit-wrapper", "defaultConfig", "cms-element-", "CmsSlotDefinition", "SalesChannelCmsPageLoader", "custom element", "inheritance"]
summary: Custom Shopware 6.7 CMS element - cmsService.registerCmsElement, component/config/preview with the cms-element mixin, cms-element- Storefront template.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/concepts/commerce/content/shopping-experiences-cms.md", "platform/dev/6.7/guides/plugins/plugins/content/cms/add-cms-block.md"]
---
## What it is

A CMS element is the smallest content unit of Shopping Experiences (Page → Section → Block → Slots → Elements). Elements are content primitives (text, image, video, product listing) with no knowledge of their context and minimal markup; they are always rendered inside a block's slot. The guide builds a `dailymotion` video element in the Administration and Storefront. Background: [Shopping Experiences concept](platform/dev/6.7/concepts/commerce/content/shopping-experiences-cms.md).

## When to use

You need new content that merchants can place into block slots (arrow icon on a slot in Content → Shopping Experiences). To arrange elements in a new layout, see [Add CMS block](platform/dev/6.7/guides/plugins/plugins/content/cms/add-cms-block.md).

## Key steps / config

Plugin layout: `<plugin root>/src/Resources/app/administration/src/module/sw-cms/elements/dailymotion/` with `index.js`, `component/`, `config/`, `preview/`.

1. Import in `main.js`: `import './module/sw-cms/elements/dailymotion';`
2. Register in the element's `index.js` (after importing `./component`, `./config`, `./preview`):

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

   `name` and `component` are mandatory (registration returns `false` otherwise). Optional: `hidden` (not offered in the replace-element selection), `removable: false` (no remove action on the slot). `defaultConfig` entries are `{ source, value }` with `source` one of `static`, `mapped`, `default`.
3. Preview component `cms-el-preview-dailymotion`: thumbnail when selecting/swapping elements.
4. Main component `cms-el-dailymotion`: add `mixins: ['cms-element']` and call `this.initElementConfig()` in `created()`; read values from `element.config.url.value`; render fallback content when the value is empty.
5. Config component `cms-el-config-dailymotion`: same mixin and `initElementConfig()`, form fields (e.g. `mt-text-field` with `v-model="element.config.url.value"`) for every `defaultConfig` key.
6. Inheritance: wrap individual fields in `sw-cms-inherit-wrapper` with `field`, `:element` and `:label` props so values can inherit from the base layout or be overridden per page.
7. Storefront: `<plugin root>/src/Resources/views/storefront/element/cms-element-dailymotion.html.twig` (prefix `cms-element-` + `name` + `.html.twig`); the `element` variable is passed automatically (fields: `CmsSlotDefinition`). Clear the Storefront cache.

## Essential identifiers

- `Shopware.Service('cmsService').registerCmsElement()`
- mixin `cms-element`, method `initElementConfig()`
- component `sw-cms-inherit-wrapper`
- Storefront template prefix `cms-element-`, `element.config.<key>.value`
- `CmsSlotDefinition`, `\Shopware\Core\Content\Cms\SalesChannel\SalesChannelCmsPageLoader::load`
- Core element code: `src/Administration/Resources/app/administration/src/module/sw-cms/elements/`, `src/Storefront/Resources/views/storefront/element/`

## Gotchas

- The Storefront filename must include the `cms-element-` prefix; blocks include `cms-element-` ~ `element.type` with `ignore missing`, so a wrong name renders nothing.
- By default, configuration is inherited unless explicitly overridden, though the UI may not show this clearly without the inherit wrapper.
- The docs call `initElementConfig('dailymotion')`; in 6.7 the mixin method takes no parameter (the argument is ignored). The `cms-element` mixin is marked `@private`.

## Code check (6.7.13.0)
- confirmed `CmsService.registerCmsElement()` — returns false without `name`/`component` — vendor/shopware/administration/Resources/app/administration/src/module/sw-cms/service/cms.service.ts:155
- confirmed `CmsElementConfig.hidden` — optional flag, with `removable` — vendor/shopware/administration/Resources/app/administration/src/module/sw-cms/service/cms.service.ts:58
- confirmed `CmsSlotConfig.source` — `mapped`, `static` or `default` — vendor/shopware/administration/Resources/app/administration/src/module/sw-cms/service/cms.service.ts:10
- confirmed `cms-element` — mixin registration, `@private` — vendor/shopware/administration/Resources/app/administration/src/module/sw-cms/mixin/sw-cms-element.mixin.ts:14
- corrected `initElementConfig()` — docs: called with element name; declared without parameters — vendor/shopware/administration/Resources/app/administration/src/module/sw-cms/mixin/sw-cms-element.mixin.ts:52
- confirmed `sw-cms-inherit-wrapper` — registered component — vendor/shopware/administration/Resources/app/administration/src/module/sw-cms/component/index.ts:134
- confirmed `field` — inherit-wrapper prop alongside `element` and `label` — vendor/shopware/administration/Resources/app/administration/src/module/sw-cms/component/sw-cms-inherit-wrapper/index.ts:66
- confirmed `cms-element-` — blocks include element templates by type — vendor/shopware/storefront/Resources/views/storefront/block/cms-block-image-text-cover.html.twig:9
- confirmed `CmsSlotDefinition` — slot entity passed as `element` — vendor/shopware/core/Content/Cms/Aggregate/CmsSlot/CmsSlotDefinition.php:27
- confirmed `SalesChannelCmsPageLoader::load()` — core page loading — vendor/shopware/core/Content/Cms/SalesChannel/SalesChannelCmsPageLoader.php:44
