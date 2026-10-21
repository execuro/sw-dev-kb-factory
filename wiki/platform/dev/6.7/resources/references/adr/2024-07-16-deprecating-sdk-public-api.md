---
id: platform/dev/6.7/resources/references/adr/2024-07-16-deprecating-sdk-public-api.md
title: Deprecating Meteor Admin SDK public SDK
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2024-07-16-deprecating-sdk-public-api.html
sourceHash: 2c50c841947aba6f4f9ed54936a9f3bb1afffe39
codeCheckedAgainst: "6.7.15.1"
keywords: ["sw-extension-component-section", "Shopware.ExtensionAPI.publishData", "deprecationMessage", "deprecated", "positionIdentifier", "meta.spec.js", "component sections", "data sets", "meteor admin sdk", "position identifier", "sdk deprecation", "admin extension api"]
summary: "ADR: Meteor Admin SDK component sections and published data sets get deprecated/deprecationMessage options; use logs error in dev, warning in prod."
lastBuilt: 2026-10-21
---
## What it is

Architecture decision record (2024-07-16) on how the public API that the Shopware Administration exposes to the Meteor Admin SDK can be monitored and deprecated. That public API consists of **component sections** (the `sw-extension-component-section` component placed in templates with a position identifier, where SDK extensions render components) and **data sets** (entities, entity subsets or scalars published from component code via `Shopware.ExtensionAPI.publishData`). Previously neither could be marked deprecated, although the SDK is promised to be the most stable extension tool.

## When to use

- You remove or rename a position identifier or data set id in core/admin code and need a deprecation path.
- An extension logs a `[CORE] The extension "..." uses a deprecated ...` message and you need to know why.

## Key steps / config

**Monitoring:** a meta test in the administration (`src/meta/meta.spec.js`) compares committed JSON files listing all data set IDs and component-section position identifiers with a run-time computed list, failing if any were removed.

**Deprecating a component section** — two props on `sw-extension-component-section`: `deprecated` (Boolean, default `false`) and `deprecationMessage` (String, default `''`), next to the required `positionIdentifier`:

```html
<sw-extension-component-section
    position-identifier="..."
    deprecated
    deprecation-message="Use position identifier XYZ instead." />
```

**Deprecating a data set** — the same two options in the publish options:

```javascript
/* @deprecated tag:v6.7.0 - Will be removed, use API instead */
Shopware.ExtensionAPI.publishData({
    id: 'sw-dashboard-detail__todayOrderData',
    path: 'todayOrderData',
    scope: this,
    deprecated: true,
    deprecationMessage: 'No replacement available, use API instead.',
});
```

Best practice: add the usual `@deprecated` comment annotation as well, so the part is not missed in a major update.

**Resulting messages** (prefix `CORE`; fixed first sentence with extension name and ID, `deprecationMessage` appended):

```shell
The extension "TestApp" uses a deprecated position identifier "foo_bar". Use position identifier "XYZ" instead.
The extension "TestApp" uses a deprecated data set "foo_bar". No replacement available, use API instead.
```

A deprecated section or data set in use throws/logs an error in dev and a warning in prod.

## Essential identifiers

- `sw-extension-component-section` props `positionIdentifier`, `deprecated`, `deprecationMessage`
- `Shopware.ExtensionAPI.publishData` options `id`, `path`, `scope`, `deprecated`, `deprecationMessage`
- `src/meta/meta.spec.js`

## Gotchas

- The message only fires when an extension actually uses the deprecated item: for sections, when sections are registered for that position identifier; for data sets, when an extension requests the data set (the requesting extension is resolved by origin, and an unknown origin throws).
- In 6.7.15.1 the component section decides error vs warning via `process.env !== 'prod'`, the data set service via `process.env.NODE_ENV !== 'production'`.

## Code check (6.7.15.1)
- confirmed `deprecated` — Boolean prop, default false, on the component section — vendor/shopware/administration/Resources/app/administration/src/app/component/extension-api/sw-extension-component-section/index.ts:38
- confirmed `deprecationMessage` — String prop, default empty — vendor/shopware/administration/Resources/app/administration/src/app/component/extension-api/sw-extension-component-section/index.ts:48
- confirmed `positionIdentifier` — required String prop — vendor/shopware/administration/Resources/app/administration/src/app/component/extension-api/sw-extension-component-section/index.ts:30
- confirmed `uses a deprecated position identifier` — error outside prod, warning in prod — vendor/shopware/administration/Resources/app/administration/src/app/component/extension-api/sw-extension-component-section/index.ts:64
- confirmed `publishOptions` — publish options carry optional `deprecated`/`deprecationMessage` — vendor/shopware/administration/Resources/app/administration/src/core/service/extension-api-data.service.ts:22
- confirmed `uses a deprecated data set` — logged when a deprecated data set is requested — vendor/shopware/administration/Resources/app/administration/src/core/service/extension-api-data.service.ts:140
- unverified `meta.spec.js` — docs name `meta.spec.ts`; the installed file is `src/meta/meta.spec.js` (located by file name, contents not read)
