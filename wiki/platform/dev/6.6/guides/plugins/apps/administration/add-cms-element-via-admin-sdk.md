---
id: platform/dev/6.6/guides/plugins/apps/administration/add-cms-element-via-admin-sdk.md
title: Add CMS element
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/apps/administration/add-cms-element-via-admin-sdk.html
sourceHash: 8f1e4d69521f8cf98c43c38fc7345277fd6b43ca
keywords: ["CMS element", "Meteor Admin SDK", "cms.registerCmsElement", "locationIds", "location.isIframe", "location.MAIN_HIDDEN", "viewRenderer", "mainCommands", "data.get", "data.update", "data.subscribe", "app cms element", "storefront twig element"]
summary: "How to create a custom CMS element for apps via the Meteor Admin SDK: registration, config/element/preview views, and storefront twig block."
lastBuilt: "2026-09-15"
---
## What it is

Describes creating a new CMS element for an app via the Meteor Admin SDK, using an example app `SwagBasicAppCmsElementExample` that adds a "Dailymotion video" element.

## When to use

When an app (not a plugin) needs to add a new CMS element that shop managers can configure and place in the CMS.

## Key steps / config

Target file structure:

```
<plugin root>/src/Resources/app/administration/src
base/mainCommands.ts
main.ts
viewRenderer.ts
views/swag-dailymotion/swag-dailymotion-config.ts
views/swag-dailymotion/swag-dailymotion-element.ts
views/swag-dailymotion/swag-dailymotion-preview.ts
```

1. `main.ts` is the entry point. Prior to 6.7 it checks `location.isIframe()` before branching; 6.7 and above (inside the `meteor-app` folder) branches directly. Both use `location.is(location.MAIN_HIDDEN)` to load `./base/mainCommands` (logic only) or else `./viewRenderer` (view templates).
2. `viewRenderer.ts` mounts a Vue instance and picks between the three components (`SwagDailymotionElement`, `SwagDailymotionConfig`, `SwagDailymotionPreview`) based on `location.is('swag-dailymotion-element'|'-config'|'-preview')`, and calls `location.startAutoResizer()`.
3. `mainCommands.ts` registers the element globally:

```javascript
import { cms } from '@shopware-ag/meteor-admin-sdk';
void cms.registerCmsElement({
    name: CONSTANTS.CMS_ELEMENT_NAME,
    label: 'Dailymotion video',
    defaultConfig: { dailyUrl: { source: 'static', value: '' } },
});
```

The element name must combine the CMS element name with the `__config-element` suffix for the publishing key.

4. Config/element/preview components use `data.get({ id })`, `data.update({ id, data })`, and `data.subscribe(id, method)` from `@shopware-ag/meteor-admin-sdk` to read/write/react to the element's configuration via the publishing key.
5. Storefront templates must live at `<app-name>/Resources/views/storefront/element/<elementname>.html.twig`, e.g.:

```twig
{% block element_swag_dailymotion %}
<div class="cms-element-swag-dailymotion">
    {% block element_dailymotion_image_inner %}
    <div class="cms-el-swag-dailymotion"></div>
    {% endblock %}
</div>
{% endblock %}
```

## Essential identifiers

- `cms.registerCmsElement`, `location.isIframe()`, `location.is()`, `location.MAIN_HIDDEN`, `location.startAutoResizer()`
- `data.get()`, `data.update()`, `data.subscribe()`
- File naming pattern: `<vendor-prefix>-<element>-config.ts` / `-element.ts` / `-preview.ts`

## Gotchas

Component/file names must be prefixed with a vendor prefix (e.g. `swag-dailymotion`) to avoid collisions with other developers' CMS elements.

## Version notes

Prior to Shopware 6.7, `main.ts` guards logic with `location.isIframe()`; from 6.7 onward (inside the `meteor-app` folder) that check is no longer needed.
