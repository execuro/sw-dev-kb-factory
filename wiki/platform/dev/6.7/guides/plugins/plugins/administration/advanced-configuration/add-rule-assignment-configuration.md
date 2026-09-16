---
id: platform/dev/6.7/guides/plugins/plugins/administration/advanced-configuration/add-rule-assignment-configuration.md
title: Add Rule Assignment Configuration
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/advanced-configuration/add-rule-assignment-configuration.html
sourceHash: 283afad1cfd9ce0f4bcf2f93d40dc606d792a17e
codeCheckedAgainst: "6.7.13.0"
keywords: ["rule assignment", "rule builder", "sw-settings-rule-detail-assignments", "associationEntitiesConfig", "Component.override", "$super", "deleteContext", "addContext", "one-to-many", "many-to-many", "ManyToManyAssociationField", "gridColumns", "searchColumn", "assignment card"]
summary: "Add a custom assignment card to the rule detail page by overriding sw-settings-rule-detail-assignments and pushing to associationEntitiesConfig."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/framework/rule/add-custom-rules.md", "platform/dev/6.7/guides/plugins/plugins/administration/data-handling-processing/using-the-data-grid-component.md"]
---
## What it is

How a plugin adds its own card to the rule detail "assignments" tab in the Administration (Settings > Rules), with optional add/delete of assignments. Available since Shopware 6.4.8.0. The example is based on the `Dynamic Access` plugin.

## When to use

Your plugin links an entity to rules (e.g. via an extension with a rule association) and merchants should see, add and remove those assignments from the rule detail page.

## Key steps / config

1. Create `<plugin root>/src/Resources/app/administration/src/module/sw-settings-rule/extension/sw-settings-rule-detail-assignments/index.js` and import it in `main.js`:
   `import './module/sw-settings-rule/extension/sw-settings-rule-detail-assignments';`
2. Override the component and extend the computed property:

```js
Component.override('sw-settings-rule-detail-assignments', {
    computed: {
        associationEntitiesConfig() {
            const associationEntitiesConfig = this.$super('associationEntitiesConfig');
            associationEntitiesConfig.push({ /* config item */ });
            return associationEntitiesConfig;
        },
    },
});
```

3. Config item shape (keys as used by the core configuration service):

```js
{
    id, notAssignedDataTotal: 0, entityName, label,
    criteria: () => criteria, api: () => api,
    detailRoute, gridColumns: [{ property, label, rawData, sortable, allowEdit }],
    deleteContext: { type, entity, column },
    addContext: { type, entity, column, searchColumn, association, criteria, gridColumns },
}
```

- `id` — required, arbitrary but unique.
- `entityName`, `criteria`, `api` — required for data loading.
- `gridColumns` — columns of the card (see [data grid component](platform/dev/6.7/guides/plugins/plugins/administration/data-handling-processing/using-the-data-grid-component.md)).
- `deleteContext` — enables deletion. `type: 'one-to-many'` points `column` at the assignment entity's rule FK (e.g. `entity: 'cms_block'`, `column: 'extensions.swagCmsExtensionsBlockRule.visibilityRuleId'`); `type: 'many-to-many'` points `column` at the extension's `ManyToManyAssociationField` (e.g. `extensions.swagDynamicAccessRules`).
- `addContext` — enables the add modal. Needs `gridColumns`, `entity`, `criteria`, the assignment `column` and the assigned entity's `searchColumn`. For `many-to-many` also set `association` to the `ManyToManyAssociationField` name.

## Gotchas

- In 6.7 the core `associationEntitiesConfig` returns `Object.values(...)` of `RuleAssignmentConfigurationService(ruleId, associationLimit).getConfiguration()`, so `$super` yields a fresh array you can push to.
- The core component lives in `view/sw-settings-rule-detail-assignments` and is marked `@private`; overrides of private components may break without deprecation.
- Core config items also carry `associationName`, used to check whether the rule is restricted for that association before enabling "add".

## Version notes

- Rule assignment configuration exists from Shopware 6.4.8.0.

## Code check (6.7.13.0)
- confirmed `sw-settings-rule-detail-assignments` — registered component — vendor/shopware/administration/Resources/app/administration/src/module/sw-settings-rule/index.js:30
- confirmed `associationEntitiesConfig` — computed returning config service values — vendor/shopware/administration/Resources/app/administration/src/module/sw-settings-rule/view/sw-settings-rule-detail-assignments/index.js:80
- confirmed `$super` — override super-call support — vendor/shopware/administration/Resources/app/administration/src/core/factory/async-component.factory.ts:919
- confirmed `override` — component factory override function — vendor/shopware/administration/Resources/app/administration/src/core/factory/async-component.factory.ts:608
- confirmed `deleteContext` — documented config key — vendor/shopware/administration/Resources/app/administration/src/module/sw-settings-rule/view/sw-settings-rule-detail-assignments/index.js:77
- confirmed `searchColumn` — one-to-many addContext key — vendor/shopware/administration/Resources/app/administration/src/module/sw-settings-rule/service/rule-assignment-configuration.service.js:99
- confirmed `association` — many-to-many addContext key — vendor/shopware/administration/Resources/app/administration/src/module/sw-settings-rule/service/rule-assignment-configuration.service.js:344
- confirmed `many-to-many` — context type in core config — vendor/shopware/administration/Resources/app/administration/src/module/sw-settings-rule/service/rule-assignment-configuration.service.js:335
- confirmed `associationName` — extra key used for restriction check — vendor/shopware/administration/Resources/app/administration/src/module/sw-settings-rule/view/sw-settings-rule-detail-assignments/index.js:100
- confirmed `RuleAssignmentConfigurationService` — source of core config — vendor/shopware/administration/Resources/app/administration/src/module/sw-settings-rule/view/sw-settings-rule-detail-assignments/index.js:69
