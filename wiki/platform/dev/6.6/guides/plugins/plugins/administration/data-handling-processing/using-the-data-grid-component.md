---
id: platform/dev/6.6/guides/plugins/plugins/administration/data-handling-processing/using-the-data-grid-component.md
title: Using the data grid component
docType: developer
version: "6.6"
versions: ["6.6"]
relatedPages: ["platform/dev/6.6/guides/plugins/plugins/administration/module-component-management/customizing-components.md", "platform/dev/6.6/guides/plugins/plugins/administration/data-handling-processing/using-data-handling.md"]
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/administration/data-handling-processing/using-the-data-grid-component.html
sourceHash: 2a0cccd7fb534487a10cb51ed6c13eeb82cdd03a
keywords: ["sw-data-grid", "data grid", "dataSource", "columns", "Component.register", "data table", "Administration component", "swag-example", "data handling", "grid columns"]
summary: "Render a table with sw-data-grid by binding dataSource and columns in a registered Administration component."
lastBuilt: "2026-09-15"
---
## What it is

This guide shows how to use the `sw-data-grid` component to render tables of data in the Administration, including support for hiding columns and horizontal scrolling when many columns are present.

## When to use

Use this when an Administration component needs to display tabular data, whether statically assigned or loaded via data handling.

## Key steps / config

Create a template using `sw-data-grid`, bound to `dataSource` and `columns`:

```html
// <plugin-root>/src/Resources/app/administration/app/src/component/swag-example/swag-example.html.twig
<div>
    <sw-data-grid :data-source="dataSource" :columns="columns"></sw-data-grid>
</div>
```

Register the component and statically assign the data (for this basic example — to load real data instead, see the data handling guide):

```javascript
// <plugin-root>/src/Resources/app/administration/app/src/component/swag-example/index.js
import template from 'swag-example.html.twig';

Shopware.Component.register('swag-basic-example', {
    template,
    data: function () {
        return {
            dataSource: [
                { id: 'uuid1', company: 'Wordify', name: 'Portia Jobson' }
            ],
            columns: [
                { property: 'name', label: 'Name' },
                { property: 'company', label: 'Company' }
            ],
        };
    }
});
```

`dataSource` is the array of row objects, and `columns` is an array of `{ property, label }` objects mapping a row field to a displayed column label.

## Essential identifiers

- `sw-data-grid` — the data grid component, bound via `:data-source` and `:columns`.
- `dataSource` — array of rows rendered by the grid.
- `columns` — array of `{ property, label }` column definitions.
