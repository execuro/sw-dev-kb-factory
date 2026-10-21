---
id: platform/dev/6.7/guides/plugins/plugins/administration/advanced-configuration/add-rule-assignment-configuration.md
title: Add Rule Assignment Configuration
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/advanced-configuration/add-rule-assignment-configuration.html
sourceHash: 283afad1cfd9ce0f4bcf2f93d40dc606d792a17e
codeCheckedAgainst: "6.7.15.1"
keywords: ["sw-settings-rule-detail-assignments", "associationEntitiesConfig", "deleteContext", "addContext", "gridColumns", "searchColumn", "ManyToManyAssociationField", "Component.override", "rule assignment", "rule builder assignments card", "one-to-many", "many-to-many"]
summary: Add a custom card to the rule detail Assignments tab by overriding associationEntitiesConfig in sw-settings-rule-detail-assignments.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/administration/data-handling-processing/using-the-data-grid-component.md", "platform/dev/6.7/guides/plugins/plugins/framework/rule/add-custom-rules.md"]
---
## What it is

How a plugin adds its own assignment card (list, add, delete) to the Assignments tab of a rule, by overriding the Administration component `sw-settings-rule-detail-assignments` and appending a configuration object to its `associationEntitiesConfig` computed property (example: the `Dynamic Access` plugin).

## When to use

Your plugin associates its own entity (or an extension of a core entity) with `rule`, and merchants should manage those assignments from the rule detail page.

## Key steps / config

1. Create `<plugin root>/src/Resources/app/administration/src/module/sw-settings-rule/extension/sw-settings-rule-detail-assignments/index.js` and import it in `main.js`:
   `import './module/sw-settings-rule/extension/sw-settings-rule-detail-assignments';`
2. Override the component and extend the computed array:

```javascript
Component.override('sw-settings-rule-detail-assignments', {
    computed: {
        associationEntitiesConfig() {
            const associationEntitiesConfig = this.$super('associationEntitiesConfig');
            associationEntitiesConfig.push(/* your configuration item */);
            return associationEntitiesConfig;
        },
    },
});
```

3. Configuration item skeleton:

```javascript
{
    id: 'swagDynamicAccessProducts', notAssignedDataTotal: 0,
    entityName: 'product', label: '<snippet key>',
    criteria: () => { /* Criteria using this.associationLimit, this.rule.id */ },
    api: () => { /* copy of Context.api, e.g. inheritance = true */ },
    detailRoute: 'sw.product.detail.base',
    gridColumns: [{ property: 'name', label: 'Name', rawData: true, sortable: true, routerLink: '...', allowEdit: false }],
    deleteContext: { type: 'many-to-many', entity: 'product', column: 'extensions.swagDynamicAccessRules' },
    addContext: { type: 'many-to-many', entity: 'swag_dynamic_access_product_rule', column: 'productId',
        searchColumn: 'name', association: 'swagDynamicAccessRules', criteria: () => {}, gridColumns: [] },
}
```

- `id` — required, arbitrary but unique. `entityName`, `criteria`, `api` — data loading. `gridColumns` — card columns (see [data grid component](platform/dev/6.7/guides/plugins/plugins/administration/data-handling-processing/using-the-data-grid-component.md)).
- `deleteContext` (enables deletion):
  - `one-to-many`: `column` is the rule-id field on the assigned entity, e.g. `entity: 'cms_block'`, `column: 'extensions.swagCmsExtensionsBlockRule.visibilityRuleId'`; delete sets it to `null`.
  - `many-to-many`: `column` is the `ManyToManyAssociationField` of the extension, e.g. `extensions.swagDynamicAccessRules`; delete removes the rule id from that collection.
- `addContext` (enables the add modal): `type`, `entity`, `column`, `searchColumn`, `criteria`, `gridColumns`.
  - `one-to-many`: `entity` is the assigned entity (e.g. `shipping_method`), `column` its rule-id field (`availabilityRuleId`); selected rows get `column = rule.id`.
  - `many-to-many`: `entity` is the mapping entity (e.g. `swag_dynamic_access_category_rule`), `column` the foreign key to the assigned entity (`categoryId`), plus `association` = name of the `ManyToManyAssociationField`.

## Essential identifiers

- `sw-settings-rule-detail-assignments`, `associationEntitiesConfig`
- `deleteContext`, `addContext`, `gridColumns`, `searchColumn`, `association`, `notAssignedDataTotal`, `detailRoute`
- `this.associationLimit`, `this.rule.id`, `Criteria`, `Context.api`

## Gotchas

- A `many-to-many` add creates mapping entities with `ruleId = rule.id` and `<column> = <selected id>`, so the mapping entity's rule foreign key must be named `ruleId`.
- `searchColumn` falls back to `name`; without `api`, `Context.api` is used.
- The core component is marked `@private` (no public API guarantee).

## Version notes

Available since Shopware 6.4.8.0. In 6.7 the core computed returns `Object.values()` of the built-in rule assignment configuration, still an array, so `push()` works.

## Code check (6.7.15.1)
- confirmed `sw-settings-rule-detail-assignments` — registered in the rule module — vendor/shopware/administration/Resources/app/administration/src/module/sw-settings-rule/index.js:31
- confirmed `associationEntitiesConfig` — computed returning an array of config items — vendor/shopware/administration/Resources/app/administration/src/module/sw-settings-rule/view/sw-settings-rule-detail-assignments/index.js:75
- confirmed `notAssignedDataTotal` — part of the documented config item shape with deleteContext/addContext — vendor/shopware/administration/Resources/app/administration/src/module/sw-settings-rule/view/sw-settings-rule-detail-assignments/index.js:72
- confirmed `associationLimit` — component data, default 5 — vendor/shopware/administration/Resources/app/administration/src/module/sw-settings-rule/view/sw-settings-rule-detail-assignments/index.js:45
- confirmed `deleteContext.type` — one-to-many nulls the column, otherwise removes rule id from the collection — vendor/shopware/administration/Resources/app/administration/src/module/sw-settings-rule/view/sw-settings-rule-detail-assignments/index.js:179
- confirmed `addContext.type` — one-to-many updates entities, otherwise inserts mapping entities — vendor/shopware/administration/Resources/app/administration/src/module/sw-settings-rule/component/sw-settings-rule-add-assignment-modal/index.js:76
- confirmed `entity.ruleId` — many-to-many insert sets ruleId on the mapping entity — vendor/shopware/administration/Resources/app/administration/src/module/sw-settings-rule/component/sw-settings-rule-add-assignment-modal/index.js:102
- confirmed `addContext.searchColumn` — search term filter, defaults to name — vendor/shopware/administration/Resources/app/administration/src/module/sw-settings-rule/component/sw-settings-rule-add-assignment-listing/index.js:113
- confirmed `addContext.association` — added to the listing criteria when set — vendor/shopware/administration/Resources/app/administration/src/module/sw-settings-rule/component/sw-settings-rule-add-assignment-listing/index.js:45
- confirmed `Component.override` — exposed on the global Shopware object — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:137
