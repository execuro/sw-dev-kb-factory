---
id: platform/dev/6.7/resources/references/adr/2024-07-16-deprecating-sdk-public-api.md
title: Deprecating Meteor Admin SDK public SDK
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2024-07-16-deprecating-sdk-public-api.html
sourceHash: 2c50c841947aba6f4f9ed54936a9f3bb1afffe39
codeCheckedAgainst: "6.7.13.0"
keywords: ["sw-extension-component-section", "Shopware.ExtensionAPI.publishData", "publishData", "positionIdentifier", "deprecated", "deprecationMessage", "meta.spec.ts", "meteor admin sdk", "component section", "data set", "position identifier", "sdk deprecation"]
summary: "ADR: Meteor Admin SDK component sections and published data sets can be marked deprecated/deprecationMessage; errors in dev, warnings in prod."
lastBuilt: 2026-09-15
---
## What it is

An architecture decision record (2024-07-18, area admin) defining how the public API of the Meteor Admin SDK built into the Shopware Administration — component sections and data sets — is monitored and deprecated.

- **Component sections**: the `sw-extension-component-section` component, placed in templates with a position identifier, lets apps render components in place via the SDK.
- **Data sets**: entities, subsets or scalar values published by core components with `Shopware.ExtensionAPI.publishData(...)`.

## When to use

- You maintain Administration code that publishes a data set or places a component section and need to retire it.
- An app/plugin logs `[CORE] The extension "..." uses a deprecated ...` and you need to know where it comes from.

## Key steps / config

**Monitoring:** a `meta.spec.ts` test compares committed JSON files listing all data set IDs and component section position identifiers against a run-time computed list, failing if any were removed.

**Deprecating a component section** — props `deprecated` (Boolean, default `false`) and `deprecationMessage` (String, default `''`) next to the required `positionIdentifier`:

```html
<sw-extension-component-section
    position-identifier="..."
    deprecated
    deprecation-message="Use position identifier XYZ instead."
/>
```

**Deprecating a data set** — same two options in the publish options:

```javascript
createdComponent() {
    /* @deprecated tag:v6.7.0 - Will be removed, use API instead */
    Shopware.ExtensionAPI.publishData({
        id: 'sw-dashboard-detail__todayOrderData',
        path: 'todayOrderData',
        scope: this,
        deprecated: true,
        deprecationMessage: 'No replacement available, use API instead.',
    });
},
```

Best practice: also add a normal `@deprecated` comment so the removal is not missed in the next major.

## Essential identifiers

- `sw-extension-component-section` (props `positionIdentifier`, `deprecated`, `deprecationMessage`)
- `Shopware.ExtensionAPI.publishData` (options `id`, `path`, `scope`, `deprecated`, `deprecationMessage`)
- `meta.spec.ts`

## Gotchas

- When a deprecated section/data set is used by an extension, a non-production build throws a `Shopware.Utils.debug.error`; production logs a warning.
- Message format is fixed; `deprecationMessage` is appended:

```shell
[CORE] The extension "TestApp" uses a deprecated position identifier "foo_bar". Use position identifier "XYZ" instead.
[CORE] The extension "TestApp" uses a deprecated data set "foo_bar". No replacement available, use API instead.
```

- For data sets the check runs when an extension reads the data set (the SDK get handler), not at publish time.

## Code check (6.7.13.0)
- confirmed `positionIdentifier` — required String prop of sw-extension-component-section — vendor/shopware/administration/Resources/app/administration/src/app/component/extension-api/sw-extension-component-section/index.ts:27
- confirmed `deprecated` — Boolean prop, default false — vendor/shopware/administration/Resources/app/administration/src/app/component/extension-api/sw-extension-component-section/index.ts:35
- confirmed `deprecationMessage` — String prop, default empty — vendor/shopware/administration/Resources/app/administration/src/app/component/extension-api/sw-extension-component-section/index.ts:45
- confirmed `deprecationMessage` — component section message format, error outside prod else warn — vendor/shopware/administration/Resources/app/administration/src/app/component/extension-api/sw-extension-component-section/index.ts:59
- confirmed `publishOptions.deprecated` — optional publish option with deprecationMessage — vendor/shopware/administration/Resources/app/administration/src/core/service/extension-api-data.service.ts:26
- confirmed `deprecationMessage` — data set message logged on get when deprecated — vendor/shopware/administration/Resources/app/administration/src/core/service/extension-api-data.service.ts:140
- confirmed `publishData` — exported function — vendor/shopware/administration/Resources/app/administration/src/core/service/extension-api-data.service.ts:191
- confirmed `publishData` — exposed on Shopware.ExtensionAPI — vendor/shopware/administration/Resources/app/administration/src/core/extension-api.ts:56
- unverified `meta.spec.ts` — not under the administration src root, out of scope
