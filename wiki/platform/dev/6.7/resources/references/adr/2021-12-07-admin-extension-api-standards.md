---
id: platform/dev/6.7/resources/references/adr/2021-12-07-admin-extension-api-standards.md
title: Admin extension API standards
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2021-12-07-admin-extension-api-standards.html
sourceHash: 5ba0888536bdec3612491219cdd32f32623dedb8
codeCheckedAgainst: "6.7.13.0"
keywords: ["locationId", "positionId", "position identifier", "sw.location.is", "sw.ui.tabs", "sw.ui.componentSection", "component sections", "sw-extension-component-section", "admin extension sdk", "meteor admin sdk", "iframe", "vue devtools", "adr"]
summary: "ADR 2021-12-07: Admin Extension API terms locationId (iFrame view) and positionId (extension point), plus component sections for injected components."
lastBuilt: 2026-09-15
---
## What it is

An architecture decision record (2021-12-07, area `administration`) defining the vocabulary and injection mechanism of the Admin Extension API (Meteor Admin SDK): **locations** identify where an extension's iFrame is rendered, **positionIDs** identify extendable areas, and **component sections** are injection points for prebuilt components.

## When to use

When building an app or plugin that renders iFrame views or adds UI (tabs, cards) to the Administration, and you need to know which ID to pass or how to find one.

## Key steps / config

1. **Location (`locationId`)** — each iFrame location gets a unique ID chosen by the extension developer. Render the matching view by checking it:

```js
if (sw.location.is('sw-dashboard-example-app-dashboard-card')) {
    renderDashboardCard();
}
```

2. **PositionID (PositionIdentifier)** — pick the ID of the area to extend, e.g. the tab bar on the product detail page:

```js
sw.ui.tabs('sw-product-detail').addTabItem({ ... })
```

3. **Component sections** — inject a prebuilt component (e.g. `card`) at a position; components with custom views take a `locationId`:

```js
sw.ui.componentSection('<positionId>').add({
    component: 'card',
    props: { title: '...', subtitle: '...', locationId: '<locationId>' }
})
```

4. Find positionIDs with the Vue Devtools plugin (Vue Devtools 6+), available when the Administration is open: it lists all extendable positions of the current view and the matching SDK property.
5. Core side: extension points are rendered with the `sw-extension-component-section` component, whose required prop `positionIdentifier` keys the `extensionComponentSections` store; the SDK message `uiComponentSectionRenderer` fills it.

## Essential identifiers

- `sw.location.is()`, `sw.ui.tabs().addTabItem()`, `sw.ui.componentSection().add()`
- `locationId`, `positionId` / `positionIdentifier`
- `sw-extension-component-section`, `extensionComponentSections` store
- `uiComponentSectionRenderer`, `uiTabsAddTabItem`

## Gotchas

- No complete list of positionIDs exists by design; use the Devtools plugin.
- The ADR's example position `sw-manufacturer-card-custom-fields__before` is illustrative; it was not found in the installed administration source.
- The ADR calls the core renderer `componentSectionRenderer`; the installed handler name is `uiComponentSectionRenderer`.

## Code check (6.7.13.0)
- confirmed `positionIdentifier` — required prop of sw-extension-component-section — vendor/shopware/administration/Resources/app/administration/src/app/component/extension-api/sw-extension-component-section/index.ts:27
- confirmed `ui.componentSection` — devtool property with method add — vendor/shopware/administration/Resources/app/administration/src/app/component/extension-api/sw-extension-component-section/index.ts:18
- confirmed `extensionComponentSections` — store id for sections — vendor/shopware/administration/Resources/app/administration/src/app/store/extension-component-sections.store.ts:19
- corrected `uiComponentSectionRenderer` — docs: componentSectionRenderer — vendor/shopware/administration/Resources/app/administration/src/app/init/extension-component-sections.init.ts:10
- confirmed `uiTabsAddTabItem` — handler behind sw.ui.tabs().addTabItem — vendor/shopware/administration/Resources/app/administration/src/app/init/tabs.init.ts:11
- confirmed `sw-product-detail` — position identifier of the product detail tab bar — vendor/shopware/administration/Resources/app/administration/src/module/sw-product/page/sw-product-detail/sw-product-detail.html.twig:151
- unverified `sw-manufacturer-card-custom-fields__before` — example ID, not found in the administration src root
- unverified `sw.location.is` — Meteor Admin SDK client API, lives in the SDK package outside the checked roots
