---
id: platform/dev/6.7/guides/plugins/plugins/administration/data-handling-processing/using-the-data-grid-component.md
title: Using the Data Grid Component
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/data-handling-processing/using-the-data-grid-component.html
sourceHash: 8372f9274e4ebd76a5299a143e7b68e9ddeeb6a8
codeCheckedAgainst: "6.7.13.0"
keywords: ["sw-data-grid", "data grid", "admin table", "dataSource", "columns", "property", "label", "Shopware.Component.register", "table component", "listing grid", "administration component"]
summary: Render a table in an Administration component with sw-data-grid - the required dataSource and columns props (property, label).
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/administration/data-handling-processing/using-data-handling.md", "platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/customizing-components.md", "platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/using-base-components.md"]
---
## What it is

The `sw-data-grid` component renders tables of data in the Administration. It supports hiding columns and horizontal scrolling when many columns are present. This page shows the minimal setup.

## When to use

You are building a plugin component that needs to display tabular records. For loading real data instead of static arrays, combine it with the [data handling guide](platform/dev/6.7/guides/plugins/plugins/administration/data-handling-processing/using-data-handling.md); for overriding existing components see [customizing components](platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/customizing-components.md).

## Key steps / config

1. **Template** (e.g. `swag-example.html.twig`):

```html
<div>
    <sw-data-grid :data-source="dataSource" :columns="columns">
    </sw-data-grid>
</div>
```

2. **Component data** - both props are required arrays:

```javascript
import template from 'swag-example.html.twig';

Shopware.Component.register('swag-basic-example', {
    template,
    data() {
        return {
            dataSource: [
                { id: 'uuid1', company: 'Wordify', name: 'Portia Jobson' },
            ],
            columns: [
                { property: 'name', label: 'Name' },
                { property: 'company', label: 'Company' },
            ],
        };
    },
});
```

- `dataSource`: array of row objects; rows are identified by `id` by default (`itemIdentifierProperty`).
- `columns`: array of column definitions; `property` (mandatory) is the row field to show (dot paths are resolved), `label` the header text (translated with fallback).

Other optional props in 6.7.13.0 include `showSelection` (default `true`), `showActions` (default `true`), `showSettings`, `allowInlineEdit`, `isLoading`, `sortBy`, `sortDirection` (default `ASC`), `compactMode` (default `true`).

## Essential identifiers

- `sw-data-grid`
- props `dataSource` / `:data-source`, `columns`
- column keys `property`, `label`
- `Shopware.Component.register`

## Gotchas

- Selection checkboxes and the actions column are on by default; pass `:show-selection="false"` / `:show-actions="false"` for a plain read-only table.
- A column without `property` throws an error ("Please specify a property to render a column"); an unresolvable `property` path logs a `[sw-data-grid]` warning.
- The component is annotated `@private` in its source in 6.7.13.0.

## Code check (6.7.13.0)
- confirmed `dataSource` — required Array prop — vendor/shopware/administration/Resources/app/administration/src/app/component/data-grid/sw-data-grid/index.js:56
- confirmed `columns` — required Array prop — vendor/shopware/administration/Resources/app/administration/src/app/component/data-grid/sw-data-grid/index.js:61
- confirmed `showSelection` — Boolean prop, default true — vendor/shopware/administration/Resources/app/administration/src/app/component/data-grid/sw-data-grid/index.js:72
- confirmed `showActions` — Boolean prop, default true — vendor/shopware/administration/Resources/app/administration/src/app/component/data-grid/sw-data-grid/index.js:78
- confirmed `itemIdentifierProperty` — row identifier, default id — vendor/shopware/administration/Resources/app/administration/src/app/component/data-grid/sw-data-grid/index.js:187
- confirmed `property` — mandatory per column, else an Error is thrown — vendor/shopware/administration/Resources/app/administration/src/app/component/data-grid/sw-data-grid/index.js:518
- confirmed `label` — header text via tWithFallback — vendor/shopware/administration/Resources/app/administration/src/app/component/data-grid/sw-data-grid/index.js:571
- confirmed `@private` — component docblock marks it private — vendor/shopware/administration/Resources/app/administration/src/app/component/data-grid/sw-data-grid/index.js:11
