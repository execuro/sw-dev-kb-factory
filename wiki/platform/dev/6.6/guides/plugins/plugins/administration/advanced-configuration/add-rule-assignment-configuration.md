---
id: platform/dev/6.6/guides/plugins/plugins/administration/advanced-configuration/add-rule-assignment-configuration.md
title: Add rule assignment configuration
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/administration/advanced-configuration/add-rule-assignment-configuration.html
sourceHash: bd74972ec89829298f151c1d55ee9770476f10d7
keywords: ["rule assignment", "sw-settings-rule-detail-assignments", "Component.override", "associationEntitiesConfig", "deleteContext", "addContext", "ManyToManyAssociationField", "gridColumns", "Dynamic Access plugin", "getRuleAssignmentConfig", "one-to-many", "many-to-many"]
summary: "Shows how to add a custom rule-assignment card by overriding sw-settings-rule-detail-assignments and configuring associationEntitiesConfig entries."
lastBuilt: "2026-09-15"
relatedPages:
  - platform/dev/6.6/guides/plugins/plugins/administration/data-handling-processing/using-the-data-grid-component.md
  - platform/dev/6.6/guides/plugins/plugins/framework/rule/add-custom-rules.md
---
## What it is
Explains how to add a custom card to the rule assignment view by overriding the `sw-settings-rule-detail-assignments` component and extending its `associationEntitiesConfig` computed property, using the `Dynamic Access` plugin as an example.

## When to use
Use when a plugin needs to let users add/remove rule assignments for a custom entity in the rule assignment card (available from Shopware Version 6.4.8.0).

## Key steps / config
1. Create `<plugin root>/src/Resources/app/administration/src/module/sw-settings-rule/extension/sw-settings-rule-detail-assignments/index.js` and import it from `main.js`.
2. Override the component:
```javascript
Component.override('sw-settings-rule-detail-assignments', {
    // override configuration here
});
```
3. Override the `associationEntitiesConfig` computed property, call `this.$super('associationEntitiesConfig')`, push your config, and return the array.
4. Each config entry needs at least `id`, `entityName`, `criteria`, and `api`, plus optionally `gridColumns` and `detailRoute`:
```javascript
{
  id: 'swagDynamicAccessProducts',
  notAssignedDataTotal: 0,
  entityName: 'product',
  label: '...',
  criteria: () => { /* ... */ },
  api: () => { /* ... */ },
  detailRoute: 'sw.product.detail.base',
  gridColumns: [ /* ... */ ],
  deleteContext: { type: 'many-to-many', entity: '...', column: '...' },
  addContext: { type: 'one-to-many', entity: '...', column: '...', searchColumn: '...', criteria: () => {} }
}
```
5. To allow deleting an assignment, define `deleteContext` with `type: 'one-to-many'` (linking a column on the assignment entity) or `type: 'many-to-many'` (linking the `ManyToManyAssociationField`).
6. To allow adding an assignment, define `addContext` similarly, plus `searchColumn`, and for `many-to-many`, an `association` naming the `ManyToManyAssociationField`.

## Essential identifiers
- `sw-settings-rule-detail-assignments`
- `associationEntitiesConfig`
- `Component.override()`
- `deleteContext`, `addContext`
- `ManyToManyAssociationField`

## Gotchas
- `id`, `entityName`, `criteria`, and `api` are required for every configuration entry, since they drive data loading of the assignment.
- `addContext` needs its own `gridColumns` definition, separate from the entry's main `gridColumns`.

## Version notes
The rule assignment configuration feature is available from Shopware Version 6.4.8.0.
