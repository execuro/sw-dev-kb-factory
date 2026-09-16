---
id: platform/dev/6.7/guides/plugins/apps/administration/add-cms-element-via-admin-sdk.md
title: Add CMS element
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/apps/administration/add-cms-element-via-admin-sdk.html
sourceHash: dad7c8cd9a7071719eecd86693611fc7786d4cf4
codeCheckedAgainst: "6.7.13.0"
keywords: ["cms.registerCmsElement", "cms.registerCmsBlock", "@shopware-ag/meteor-admin-sdk", "location.MAIN_HIDDEN", "location.get", "__config-element", "elementId", "data.get", "data.update", "cms element", "cms block", "shopping experiences", "app iframe", "meteor admin sdk"]
summary: Register a CMS block and element from an app or plugin with the Meteor Admin SDK; iframe location IDs, publishing key and elementId data access.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/apps/administration/meteor-admin-sdk.md", "platform/dev/6.7/guides/plugins/plugins/content/cms/add-cms-element.md", "platform/dev/6.7/guides/plugins/apps/app-base-guide.md", "platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/add-custom-component.md"]
---
## What it is

How to add a new Shopping Experiences (CMS) element and block from an app (or plugin) using the Meteor Admin SDK (`@shopware-ag/meteor-admin-sdk`). All UI is rendered in iFrames; the example `SwagBasicAppCmsElementExample` lets a shop manager configure a Dailymotion video ID. Plugin-based element creation is described in [Add CMS element (plugin)](platform/dev/6.7/guides/plugins/plugins/content/cms/add-cms-element.md); SDK basics in [Meteor Admin SDK](platform/dev/6.7/guides/plugins/apps/administration/meteor-admin-sdk.md).

## When to use

You need a CMS element with its own rendering and config UI from an app. If you only want a block that reuses existing Shopware elements in its slots, apps can declare it in `cms.xml` without the SDK.

## Key steps / config

1. File layout (any structure works; Vue 3 SFCs recommended): `main.ts`, `base/mainCommands.ts`, `viewRenderer.ts`, `views/swag-dailymotion/swag-dailymotion-{config,element,preview}.vue`.
2. `main.ts`: `if (location.is(location.MAIN_HIDDEN))` import `./base/mainCommands` (logic only, hidden iframe); otherwise import `./viewRenderer`.
3. `viewRenderer.ts`: call `location.startAutoResizer()`, map location IDs to async components, render `h(locations[location.get()])` into `#app`. Location IDs are generated from the element name plus `-element`, `-config`, `-preview`.
4. `mainCommands.ts`: register both block and element:

```javascript
import { cms } from '@shopware-ag/meteor-admin-sdk';
const CMS_ELEMENT_NAME = 'swag-dailymotion';
const PUBLISHING_KEY = `${CMS_ELEMENT_NAME}__config-element`;
void cms.registerCmsBlock({ name: CMS_ELEMENT_NAME, label: 'Dailymotion video',
  category: 'video', slots: [{ element: CMS_ELEMENT_NAME }] });
void cms.registerCmsElement({ name: CMS_ELEMENT_NAME, label: 'Dailymotion video',
  defaultConfig: { dailyUrl: { source: 'static', value: '' } } });
```

| Call | Where it appears |
|---|---|
| `registerCmsElement` only | element-replacement modal on an existing slot |
| `registerCmsBlock` only | block picker, but slot renders nothing |
| both | block picker and replacement modal |

5. `category`: `video`, `text`, `image`, `text-image`, `commerce`, `sidebar`, `form`, or a custom string (added as a new category group). If omitted, the Administration uses `app`.
6. Data access in the element/config iframes: read `elementId` from the iframe URL query, build `dataId = ${PUBLISHING_KEY}__${elementId}`, fetch with `data.get({ id, selectors })` (flat result keyed by selector path, e.g. `config.dailyUrl.value`) and persist with `data.update({ id, data })`, sending only the changed config.

## Essential identifiers

- `cms.registerCmsBlock`, `cms.registerCmsElement` (SDK) → handled as `cmsRegisterBlock` / `cmsRegisterElement` in the Administration
- `location.is`, `location.MAIN_HIDDEN`, `location.get`, `location.startAutoResizer`
- `data.get`, `data.update`
- Publishing key `<name>__config-element`; per-instance key `<name>__config-element__<elementId>`
- Location IDs `<name>-element`, `<name>-config`, `<name>-preview`

## Gotchas

- The publishing key must be exactly the element name plus `__config-element`; use a constant for both.
- Only the element and config iframes get the `elementId` query parameter; the preview iframe URL is the bare app base URL and only the general `<name>__config-element` data set is published there.
- The general (non-element-ID) data set published for the element iframe is marked deprecated for 6.8; use the `__<elementId>` key.
- Registration is ignored unless the message origin matches an installed extension's base URL.
- Prefix component names with a vendor prefix to avoid conflicts.

## Code check (6.7.13.0)
- confirmed `cmsRegisterElement` — Administration registers element with location-renderer components — vendor/shopware/administration/Resources/app/administration/src/app/init/cms.init.ts:6
- confirmed `cmsRegisterBlock` — block category defaults to `app`, slots built from `slots[].element` — vendor/shopware/administration/Resources/app/administration/src/app/init/cms.init.ts:27
- confirmed `MAIN_HIDDEN` — hidden iframe location used by sw-hidden-iframes — vendor/shopware/administration/Resources/app/administration/src/app/component/structure/sw-hidden-iframes/index.js:1
- confirmed `__config-element` — publishing key is `${name}__config-element` — vendor/shopware/administration/Resources/app/administration/src/module/sw-cms/elements/location-renderer/component/index.ts:39
- confirmed `-element` — element location ID suffix — vendor/shopware/administration/Resources/app/administration/src/module/sw-cms/elements/location-renderer/component/index.ts:35
- confirmed `-config` — config location ID suffix — vendor/shopware/administration/Resources/app/administration/src/module/sw-cms/elements/location-renderer/config/index.ts:34
- confirmed `-preview` — preview location ID suffix; preview src is the bare base URL — vendor/shopware/administration/Resources/app/administration/src/module/sw-cms/elements/location-renderer/preview/index.ts:26
- corrected `elementId` — docs: appended to all three iframes; code sets it for element and config only, not preview — vendor/shopware/administration/Resources/app/administration/src/module/sw-cms/elements/location-renderer/config/index.ts:28
- confirmed `text-image` — default block categories incl. video, commerce, sidebar, form; unknown categories appended — vendor/shopware/administration/Resources/app/administration/src/module/sw-cms/component/sw-cms-sidebar/index.ts:182
- unverified `data.update` — Meteor Admin SDK npm package, out of scope
