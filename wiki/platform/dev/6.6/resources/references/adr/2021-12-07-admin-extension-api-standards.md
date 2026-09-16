---
id: platform/dev/6.6/resources/references/adr/2021-12-07-admin-extension-api-standards.md
title: Admin extension API standards
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/resources/references/adr/2021-12-07-admin-extension-api-standards.html
sourceHash: 5ba0888536bdec3612491219cdd32f32623dedb8
keywords: ["Admin-Extension-API", "locationID", "positionID", "PositionIdentifier", "Component Sections", "sw.ui.componentSection", "sw.ui.tabs", "sw.location.is", "Vue Devtools plugin", "componentSectionRenderer", "iFrame", "Meteor-Extension-SDK"]
summary: ADR standardizing admin extension points as locationID/positionID pairs and Component Sections, discoverable via a Vue Devtools plugin.
lastBuilt: 2026-09-15
---
## What it is
Architecture decision record defining the naming and injection standards extension developers use to add custom components and iFrame views to the administration via the Admin-Extension-API.

## When to use
Relevant when building an app or plugin that renders custom iFrame content in the administration or extends an existing administration area/component.

## Key steps / config
- **Location**: every iFrame rendering location gets a unique `locationID`, chosen by the developer, e.g. `sw-dashboard-example-app-dashboard-card`. The app checks which view to render with:

```js
if (sw.location.is('sw-dashboard-example-app-dashboard-card')) {
    renderDashboardCard();
}
```

- **PositionID (PositionIdentifier)**: identifies an existing administration position to extend, e.g. adding a tab item:

```js
sw.ui.tabs('sw-product-detail').addTabItem({ ... })
```

- **Component Sections**: prebuilt injection points where extensions add prebuilt components (which may themselves render custom iFrame content via a `locationId` prop):

```js
sw.ui.componentSection('sw-manufacturer-card-custom-fields__before').add({
    component: 'card',
    props: {
        title: 'This is the title',
        subtitle: 'I am the subtitle',
        locationId: 'example-app-card-before-manufactuer-custom-fields-card'
    }
})
```

- A Vue Devtools plugin (for Vue Devtools 6+) lists all available position IDs at the current administration view and their associated Meteor-Extension-SDK properties, since a static list of all position IDs is impractical to maintain.

## Essential identifiers
- `sw.location.is()`
- `sw.ui.tabs()` / `addTabItem()`
- `sw.ui.componentSection()` / `.add()`
- `componentSectionRenderer`

## Gotchas
- `componentSectionRenderer` needs to be implemented at every position the administration wants to offer as an extension point (before/after cards, top/bottom of pages or tab views, etc.) — extension points do not exist automatically everywhere.
