---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/guides/plugins/plugins/administration/data-handling-processing/using-the-data-grid-component.md
relatedPages:
  - platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/customizing-components.md
  - platform/dev/6.7/guides/plugins/plugins/administration/data-handling-processing/using-data-handling.md
  - platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/using-base-components.md
sourceHash: 8372f9274e4ebd76a5299a143e7b68e9ddeeb6a8
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/data-handling-processing/using-the-data-grid-component.html
title: Using the Data Grid Component
version: "6.7"
versions:
  - "6.7"
keywords: ["sw-data-grid", "data grid", "dataSource", "columns", "property", "label", "table", "list rendering", "administration component", "Shopware.Component.register", "hide columns", "horizontal scrolling"]
summary: Render a table in the Administration with sw-data-grid by passing a dataSource array and a columns array of property/label objects.
lastBuilt: 2026-10-21
---
## What it is

`sw-data-grid` is the Administration component that renders tabular data. It supports hiding columns and horizontal scrolling when many columns are present. The guide shows the minimal template and the data a component must provide to it.

## When to use

You build a custom Administration component (in a plugin) and need to show a list of records as a table. For loading real records instead of static data, combine it with the data handling guide: [Using data handling](platform/dev/6.7/guides/plugins/plugins/administration/data-handling-processing/using-data-handling.md). For overriding existing components see [Customizing components](platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/customizing-components.md).

## Key steps / config

1. Create a template for your component, e.g. `<plugin-root>/src/Resources/app/administration/app/src/component/swag-example/swag-example.html.twig`, binding the two required props:

```html
<div>
    <sw-data-grid :data-source="dataSource" :columns="columns">
    </sw-data-grid>
</div>
```

2. Register the component with `Shopware.Component.register()` and provide both arrays from `data()`:

```javascript
import template from 'swag-example.html.twig';

Shopware.Component.register('swag-basic-example', {
    template,
    data() {
        return {
            dataSource: [{ id: 'uuid1', company: 'Wordify', name: 'Portia Jobson' } /* ... */],
            columns: [
                { property: 'name', label: 'Name' },
                { property: 'company', label: 'Company' },
            ],
        };
    },
});
```

- `dataSource` (Array) and `columns` (Array) are both `required: true` props in the installed component.
- Every column object needs `property`; it names the record field (dot paths such as `a.b` are resolved). `label` is the column header text (passed through the component's translate-with-fallback helper, so a snippet key also works).

## Essential identifiers

- `sw-data-grid` — the grid component
- `dataSource` / `:data-source` — array of records
- `columns` — array of column definitions `{ property, label }`
- `Shopware.Component.register` — registers your own component

## Gotchas

- A column without `property` throws `Please specify a "property" to render a column.` when columns are built.
- The installed `sw-data-grid` is annotated `@private` in its docblock, so its props/behaviour are not a guaranteed public API across versions.
- Records are expected to carry an `id` field, as in the source's sample data.

## Code check (6.7.15.1)
- confirmed `sw-data-grid` — component renders tables, annotated `@private` — vendor/shopware/administration/Resources/app/administration/src/app/component/data-grid/sw-data-grid/index.js:12
- confirmed `dataSource` — prop of type Array, required — vendor/shopware/administration/Resources/app/administration/src/app/component/data-grid/sw-data-grid/index.js:49
- confirmed `columns` — prop of type Array, required — vendor/shopware/administration/Resources/app/administration/src/app/component/data-grid/sw-data-grid/index.js:54
- confirmed `property` — missing column property throws an error — vendor/shopware/administration/Resources/app/administration/src/app/component/data-grid/sw-data-grid/index.js:480
- confirmed `label` — rendered via tWithFallback as header — vendor/shopware/administration/Resources/app/administration/src/app/component/data-grid/sw-data-grid/index.js:525
- confirmed `Shopware.Component.register` — exposed on the Shopware object — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:135
