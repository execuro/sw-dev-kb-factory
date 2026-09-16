---
id: platform/dev/6.6/resources/references/adr/2024-07-16-deprecating-sdk-public-api.md
title: Deprecating Meteor Admin SDK public SDK
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: "https://developer.shopware.com/docs/v6.6/resources/references/adr/2024-07-16-deprecating-sdk-public-api.html"
sourceHash: 2c50c841947aba6f4f9ed54936a9f3bb1afffe39
keywords: ["Meteor Admin SDK", "component sections", "data sets", "sw-extension-component-section", "publishData", "deprecated prop", "deprecationMessage prop", "meta.spec.ts", "position identifier", "Shopware.ExtensionAPI.publishData", "@deprecated tag"]
summary: "ADR: Meteor Admin SDK component sections and data sets get `deprecated`/`deprecationMessage` props, tracked via `meta.spec.ts`."
lastBuilt: 2026-09-15
---
## What it is
Architecture decision record adding a deprecation mechanism to the Meteor Admin SDK's public API surface — component sections and data sets — since no such mechanism existed before.

## When to use
Relevant when an app/plugin developer needs to know if a component section or published data set is deprecated, or when a Shopware developer needs to deprecate one.

## Key steps / config
- The SDK's public API surface is monitored by a `meta.spec.ts` test, which checks committed JSON files of data set IDs and component-section position identifiers against a runtime-computed list to detect accidental removals.
- Component sections (`sw-extension-component-section`) gain two props: `deprecated: Boolean` and `deprecationMessage: String`.
- Data sets published via `Shopware.ExtensionAPI.publishData` gain matching options:

```javascript
createdComponent() {
    /* @deprecated tag:v6.7.0 - Will be removed, use API instead */
    Shopware.ExtensionAPI.publishData({
        id: 'sw-dashboard-detail__todayOrderData',
        path: 'todayOrderData',
        scope: this,
        deprecated: true,
        deprecationMessage: 'No replacement available, use API instead.'
    });
},
```

- Best practice: also add a `@deprecated` annotation comment so the removal isn't missed at the next major version.

## Essential identifiers
- `sw-extension-component-section` (`deprecated`, `deprecationMessage` props)
- `Shopware.ExtensionAPI.publishData` (`deprecated`, `deprecationMessage` options)
- `meta.spec.ts`

## Gotchas
Deprecated component sections/data sets throw an error in a dev environment but only publish a warning in production. Both message formats always start with the extension name and the data set/component section ID, followed by any `deprecationMessage` text, e.g.:

```shell
[CORE] The extension "TestApp" uses a deprecated position identifier "foo_bar". Use position identifier "XYZ" instead.
[CORE] The extension "TestApp" uses a deprecated data set "foo_bar". No replacement available, use API instead.
```
