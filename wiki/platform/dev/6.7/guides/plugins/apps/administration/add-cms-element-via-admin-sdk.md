---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/guides/plugins/apps/administration/add-cms-element-via-admin-sdk.md
relatedPages:
  - platform/dev/6.7/guides/plugins/apps/administration/meteor-admin-sdk.md
  - platform/dev/6.7/guides/plugins/plugins/content/cms/add-cms-element.md
  - platform/dev/6.7/guides/plugins/apps/app-base-guide.md
  - platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/add-custom-component.md
sourceHash: dad7c8cd9a7071719eecd86693611fc7786d4cf4
sourceUrl: https://developer.shopware.com/docs/guides/plugins/apps/administration/add-cms-element-via-admin-sdk.html
title: Add CMS element
version: "6.7"
versions:
  - "6.7"
keywords: ["cms element", "cms block", "shopping experiences", "meteor admin sdk", "@shopware-ag/meteor-admin-sdk", "cms.registerCmsElement", "cms.registerCmsBlock", "location.MAIN_HIDDEN", "location.get", "__config-element", "elementId", "data.get", "data.update", "app iframe"]
summary: Register an app CMS block and element via the Meteor Admin SDK - -element/-config/-preview locations, __config-element publishing key.
lastBuilt: 2026-10-21
---
## What it is

How an app (or plugin) adds a custom CMS element to the Shopping Experiences editor using the [Meteor Admin SDK](platform/dev/6.7/guides/plugins/apps/administration/meteor-admin-sdk.md) (`@shopware-ag/meteor-admin-sdk`). Everything renders in iFrames, so any file structure works; Vue 3 SFCs are recommended. The example `SwagBasicAppCmsElementExample` registers a `swag-dailymotion` element whose config holds a Dailymotion video ID. The plugin-side equivalent is [Add CMS element via plugin](platform/dev/6.7/guides/plugins/plugins/content/cms/add-cms-element.md).

## When to use

When an app needs a new CMS element type (custom rendering and config UI). If you only need a block that reuses existing Shopware elements in its slots, apps can declare it in `cms.xml` without the SDK.

## Key steps / config

Files (under `src/Resources/app/administration/src`): `main.ts`, `base/mainCommands.ts`, `viewRenderer.ts`, `views/swag-dailymotion/swag-dailymotion-{config,element,preview}.vue`.

1. **`main.ts`** — if `location.is(location.MAIN_HIDDEN)` import `./base/mainCommands` (logic only, nothing rendered); otherwise import `./viewRenderer`.
2. **`viewRenderer.ts`** — call `location.startAutoResizer()`, map location IDs `swag-dailymotion-element`, `swag-dailymotion-config`, `swag-dailymotion-preview` to async Vue components, and render `locations[location.get()]` into `#app`. The IDs are generated from the element name plus `-element`/`-config`/`-preview` once the element is registered.
3. **`mainCommands.ts`** — register both block and element:

```javascript
const CMS_ELEMENT_NAME = 'swag-dailymotion';
const PUBLISHING_KEY = `${CMS_ELEMENT_NAME}__config-element`;
void cms.registerCmsBlock({
    name: CMS_ELEMENT_NAME, label: 'Dailymotion video', category: 'video',
    slots: [{ element: CMS_ELEMENT_NAME }],
});
void cms.registerCmsElement({
    name: CMS_ELEMENT_NAME, label: 'Dailymotion video',
    defaultConfig: { dailyUrl: { source: 'static', value: '' } },
});
```

| Call | Where it appears |
|---|---|
| `registerCmsElement` only | Element-replacement modal on an existing slot |
| `registerCmsBlock` only | Block picker, but the slot renders nothing |
| both | Block picker and replacement modal |

`category` is one of `'video'`, `'text'`, `'image'`, `'text-image'`, `'commerce'`, `'sidebar'`, `'form'`, or a custom string (new group); `slots` lists the element type per slot.

4. **Data exchange** — the element and config iFrames get the slot ID as `elementId` query parameter. Address per-instance data as `` `${PUBLISHING_KEY}__${elementId}` ``; use `data.get()` (optional `selectors`, result keyed by path such as `config.dailyUrl.value`) and `data.update({ id, data })` to send back only the changed config.

## Essential identifiers

- `cms.registerCmsElement`, `cms.registerCmsBlock`
- `location.MAIN_HIDDEN`, `location.is()`, `location.get()`, `location.startAutoResizer()`
- `data.get()`, `data.update()`
- publishing key suffix `__config-element`; location suffixes `-element`, `-config`, `-preview`
- query parameter `elementId`

## Gotchas

- The docs say all three iFrames get `elementId`; in the installed Administration only the element and config renderers append it — the preview iFrame loads the bare app base URL, so preview code must not rely on it.
- The publishing key must be exactly the element name plus `__config-element`.
- The Administration registers every SDK block internally under the name `app-renderer` (your block name is kept in `customFields.appBlockName`); a block without `category` lands in `app`.

## Code check (6.7.15.1)
- confirmed `cmsRegisterElement` — SDK message forwarded to `cmsService.registerCmsElement` — vendor/shopware/administration/Resources/app/administration/src/app/init/cms.init.ts:6
- confirmed `cmsRegisterBlock` — SDK message; block stored as `app-renderer`, category default `app` — vendor/shopware/administration/Resources/app/administration/src/app/init/cms.init.ts:27
- confirmed `-element` — element location ID suffix — vendor/shopware/administration/Resources/app/administration/src/module/sw-cms/elements/location-renderer/component/index.ts:33
- confirmed `-config` — config location ID suffix — vendor/shopware/administration/Resources/app/administration/src/module/sw-cms/elements/location-renderer/config/index.ts:32
- confirmed `-preview` — preview location ID suffix — vendor/shopware/administration/Resources/app/administration/src/module/sw-cms/elements/location-renderer/preview/index.ts:26
- confirmed `__config-element` — publishing key suffix — vendor/shopware/administration/Resources/app/administration/src/module/sw-cms/elements/location-renderer/config/index.ts:36
- confirmed `elementId` — set as query param on the element iFrame URL — vendor/shopware/administration/Resources/app/administration/src/module/sw-cms/elements/location-renderer/component/index.ts:27
- corrected `appData.baseUrl` — docs: elementId appended to all three iFrames; preview src is the bare base URL — vendor/shopware/administration/Resources/app/administration/src/module/sw-cms/elements/location-renderer/preview/index.ts:22
- confirmed `publishingKey` — per-instance data published under `<publishingKey>__<element id>` — vendor/shopware/administration/Resources/app/administration/src/module/sw-cms/elements/location-renderer/component/index.ts:96
- unverified `data.get()` — Meteor Admin SDK package API, outside the vendor/shopware roots
