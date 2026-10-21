---
id: platform/dev/6.7/resources/references/adr/2021-12-07-admin-extension-api-standards.md
title: Admin extension API standards
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2021-12-07-admin-extension-api-standards.html
sourceHash: 5ba0888536bdec3612491219cdd32f32623dedb8
codeCheckedAgainst: "6.7.15.1"
keywords: ["admin extension api", "meteor admin sdk", "locationId", "positionId", "positionIdentifier", "component sections", "sw.ui.componentSection", "sw-extension-component-section", "uiComponentSectionRenderer", "sw.location.is", "iframe", "vue devtools"]
summary: "ADR on Admin Extension API terms: locationId for iFrame views, positionId for extension points, component sections via sw.ui.componentSection."
lastBuilt: 2026-10-21
---
## What it is

An architecture decision record (2021-12-07, area: administration) that fixes the vocabulary and injection mechanism of the Admin Extension API (Meteor Admin SDK): **locations** for iFrame-rendered views, **positionIDs** for places in the Administration that can be extended, and **component sections** as the generic injection point for prebuilt components.

## When to use

You build an app or plugin that adds cards, tabs or custom iFrame views to the Administration through the Admin Extension API and need to know which ID to use where, or how core marks a place as extendable.

## Key steps / config

**Location (locationId)** — every iFrame an extension renders gets a unique location ID chosen by the extension developer. The extension branches on it to render the right view:

```js
if (sw.location.is('sw-dashboard-example-app-dashboard-card')) {
    renderDashboardCard();
}
```

**PositionID** — a unique ID for an existing area that an extension wants to extend, e.g. a specific tab bar: `sw.ui.tabs('sw-product-detail').addTabItem({ ... })`.

**Component sections** — prebuilt components (e.g. `card`) injected at a positionID; some can render a custom iFrame view via `locationId`:

```js
sw.ui.componentSection('sw-manufacturer-detail-custom-field-sets__before').add({
    component: 'card',
    props: {
        title: '...',
        subtitle: '...',
        locationId: 'example-app-card-before-manufactuer-custom-fields-card'
    }
})
```

How the installed Administration implements it:

1. The SDK message `uiComponentSectionRenderer` is handled in the admin; the sending extension is matched by its `baseUrl` origin, and the entry is stored in the `extensionComponentSections` store via `addSection` (keyed by `positionId`, optional `priority`).
2. Core places `<sw-extension-component-section :position-identifier="...">` where extensions may inject. `mt-card` renders one before and one after every card that has a `positionIdentifier`, using `<positionIdentifier>__before` and `<positionIdentifier>__after`.
3. The manufacturer custom-field card has `position-identifier="sw-manufacturer-detail-custom-field-sets"`, so its section IDs are that value plus `__before`/`__after`.

## Essential identifiers

- `sw.location.is()`, `sw.ui.tabs().addTabItem()`, `sw.ui.componentSection().add()`
- `locationId`, `positionId`, `positionIdentifier`
- `uiComponentSectionRenderer`, `extensionComponentSections` store, `addSection`
- `sw-extension-component-section` component
- `extensionApiDevtoolInformation`

## Gotchas

- A complete list of position IDs does not exist. The ADR relies on a Vue Devtools plugin (Devtools 6+) that shows all extendable positions in the current view and the matching SDK property; in the code, components declare `extensionApiDevtoolInformation` (e.g. `property: 'ui.componentSection'`, `method: 'add'`) and are collected into `window._sw_extension_component_collection`.
- The ADR's example ID `sw-manufacturer-card-custom-fields__before` does not exist in the 6.7 Administration; use the real card's `positionIdentifier` plus `__before`.
- `sw-extension-component-section` can be marked `deprecated`, which warns when an extension uses that position.
- New extension points only exist where core added a component section renderer (before/after cards, top/bottom of pages or tabs).

## Code check (6.7.15.1)
- confirmed `uiComponentSectionRenderer` — handled via Shopware.ExtensionAPI.handle — vendor/shopware/administration/Resources/app/administration/src/app/init/extension-component-sections.init.ts:10
- confirmed `extensionComponentSections` — Pinia store id — vendor/shopware/administration/Resources/app/administration/src/app/store/extension-component-sections.store.ts:20
- confirmed `addSection` — stores entries per positionId with optional priority — vendor/shopware/administration/Resources/app/administration/src/app/store/extension-component-sections.store.ts:27
- confirmed `sw-extension-component-section` — globally registered component — vendor/shopware/administration/Resources/app/administration/src/app/component/index.ts:365
- confirmed `positionIdentifier` — required prop of the section component — vendor/shopware/administration/Resources/app/administration/src/app/component/extension-api/sw-extension-component-section/index.ts:30
- confirmed `ui.componentSection` — devtool info property — vendor/shopware/administration/Resources/app/administration/src/app/component/extension-api/sw-extension-component-section/index.ts:21
- confirmed `__before` — mt-card renders a section before the card — vendor/shopware/administration/Resources/app/administration/src/app/component/meteor-wrapper/mt-card/mt-card.html.twig:11
- confirmed `sw-manufacturer-detail-custom-field-sets` — real manufacturer card position identifier — vendor/shopware/administration/Resources/app/administration/src/module/sw-manufacturer/page/sw-manufacturer-detail/sw-manufacturer-detail.html.twig:171
- confirmed `extensionApiDevtoolInformation` — devtool helper collects such components — vendor/shopware/administration/Resources/app/administration/src/app/plugin/devtool-helper.plugin.ts:12
- unverified `sw-manufacturer-card-custom-fields__before` — ADR example id, not found in the administration src
