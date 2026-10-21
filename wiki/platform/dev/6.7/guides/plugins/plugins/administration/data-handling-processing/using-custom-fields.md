---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/guides/plugins/plugins/administration/data-handling-processing/using-custom-fields.md
sourceHash: 04c8b735ddf8bb19ad3866d105ff761c4685f6ff
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/data-handling-processing/using-custom-fields.html
title: Using Custom Fields
version: "6.7"
versions:
  - "6.7"
keywords: ["sw-custom-field-set-renderer", "custom_field_set", "customFieldSetRepository", "customFieldSetCriteria", "relations.entityName", "config.customFieldPosition", "showCustomFieldSetSelection", "repositoryFactory", "Criteria", "custom fields", "custom field sets", "administration module"]
summary: "Render an entity's custom field sets in an Admin module with sw-custom-field-set-renderer, loading sets via the custom_field_set repository and a Criteria."
lastBuilt: 2026-10-21
---
## What it is

How to display and edit custom fields of an entity inside a plugin's own Administration module, using the `sw-custom-field-set-renderer` component and custom field sets loaded through the `custom_field_set` repository.

## When to use

When a plugin module shows an entity that has custom fields attached (prerequisites: a plugin, own components, and custom fields defined for the entity).

## Key steps / config

1. Render the sets in the component template:

```html
<sw-card title="Custom fields">
    <sw-custom-field-set-renderer
        :entity="customEntity"
        showCustomFieldSetSelection
        :sets="customFieldSets">
    </sw-custom-field-set-renderer>
</sw-card>
```

   `entity` (Object) and `sets` (Array) are required props; `showCustomFieldSetSelection` defaults to `false`; `variant` is `tabs` (default) or `media-collapse`.

2. Declare a data property for the loaded sets: `customFieldSets: null` in `data()`.

3. Add computed properties for the repository and the criteria:

```javascript
computed: {
    customFieldSetRepository() {
        return this.repositoryFactory.create('custom_field_set');
    },
    customFieldSetCriteria() {
        const criteria = new Criteria();
        criteria.addFilter(Criteria.equals('relations.entityName', 'product'));
        criteria.getAssociation('customFields')
            .addSorting(Criteria.sort('config.customFieldPosition', 'ASC', true));
        return criteria;
    },
},
```

   The filter on `relations.entityName` restricts the sets to those assigned to the entity (here `product`); the sorting orders fields by `config.customFieldPosition`.

4. Load the sets, e.g. in a method, with the repository's `search`:

```javascript
this.customFieldSetRepository.search(this.customFieldSetCriteria, Shopware.Context.api)
    .then((customFieldSets) => { this.customFieldSets = customFieldSets; });
```

## Essential identifiers

- `sw-custom-field-set-renderer` (props `entity`, `sets`, `showCustomFieldSetSelection`)
- `custom_field_set` entity, `repositoryFactory.create('custom_field_set')`
- `Criteria.equals('relations.entityName', ...)`, `Criteria.sort('config.customFieldPosition', ...)`
- `customFieldDataProviderService` (core service with the same set loading)

## Gotchas

- The source template binds `:sets="sets"` while the data property is `customFieldSets`; bind the property that actually holds the search result, since `sets` is a required Array prop.
- The component needs `repositoryFactory` injected and `Criteria` from `Shopware.Data` for the computed properties to work.
- Core code loads sets the same way through `customFieldDataProviderService.getCustomFieldSets(entityName)`, which additionally drops sets without custom fields and caches the result.

## Code check (6.7.15.1)
- confirmed `sets` — required Array prop of sw-custom-field-set-renderer — vendor/shopware/administration/Resources/app/administration/src/app/component/form/sw-custom-field-set-renderer/index.js:41
- confirmed `entity` — required Object prop — vendor/shopware/administration/Resources/app/administration/src/app/component/form/sw-custom-field-set-renderer/index.js:45
- confirmed `variant` — default `tabs`, alt `media-collapse` — vendor/shopware/administration/Resources/app/administration/src/app/component/form/sw-custom-field-set-renderer/index.js:54
- confirmed `showCustomFieldSetSelection` — Boolean prop, default false — vendor/shopware/administration/Resources/app/administration/src/app/component/form/sw-custom-field-set-renderer/index.js:81
- confirmed `custom_field_set` — CustomFieldSetDefinition::ENTITY_NAME — vendor/shopware/core/System/CustomField/Aggregate/CustomFieldSet/CustomFieldSetDefinition.php:34
- confirmed `relations.entityName` — same filter used by core custom field service — vendor/shopware/administration/Resources/app/administration/src/app/service/custom-field.service.js:184
- confirmed `config.customFieldPosition` — core sorts customFields association by it — vendor/shopware/administration/Resources/app/administration/src/app/service/custom-field.service.js:185
- confirmed `customFieldDataProviderService` — registered service backed by CustomFieldService — vendor/shopware/administration/Resources/app/administration/src/app/main.ts:166
- confirmed `getCustomFieldSets` — filters out sets without custom fields, cached — vendor/shopware/administration/Resources/app/administration/src/app/service/custom-field.service.js:166
