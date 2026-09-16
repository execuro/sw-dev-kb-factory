---
id: platform/dev/6.7/guides/plugins/plugins/administration/data-handling-processing/using-custom-fields.md
title: Using Custom Fields
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/data-handling-processing/using-custom-fields.html
sourceHash: 04c8b735ddf8bb19ad3866d105ff761c4685f6ff
codeCheckedAgainst: "6.7.13.0"
keywords: ["custom fields", "custom field sets", "sw-custom-field-set-renderer", "custom_field_set", "customFieldSetRepository", "customFieldSetCriteria", "relations.entityName", "config.customFieldPosition", "showCustomFieldSetSelection", "repositoryFactory", "Criteria", "admin module"]
summary: Render and load custom field sets in an Administration plugin module with sw-custom-field-set-renderer and a custom_field_set repository plus Criteria.
lastBuilt: 2026-09-15
---
## What it is

How to display an entity's custom fields inside your own Administration module: render them with the core `sw-custom-field-set-renderer` component and load the matching custom field sets through the `custom_field_set` repository.

## When to use

Your plugin module shows or edits an entity that has custom fields (added via custom field sets) and you want the standard custom-field UI instead of building inputs yourself. Prerequisites: a plugin, your own components, and an entity with custom fields.

## Key steps / config

1. **Template** - place the renderer in your component template:

```html
<sw-card title="Custom fields">
    <sw-custom-field-set-renderer
        :entity="customEntity"
        showCustomFieldSetSelection
        :sets="customFieldSets">
    </sw-custom-field-set-renderer>
</sw-card>
```

   `entity` (Object) and `sets` (Array) are required props; `showCustomFieldSetSelection` is an optional Boolean (default `false`). Other optional props include `parentEntity`, `variant` (`tabs` or `media-collapse`), `disabled`, `isLoading`.

2. **Data** - add a holder in `data()`: `customFieldSets: null`.

3. **Computed repository and criteria**:

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
    }
}
```

   The filter restricts sets to those assigned to an entity (here `product`); the sorting orders fields by `config.customFieldPosition`.

4. **Load** - e.g. in a method:

```javascript
this.customFieldSetRepository.search(this.customFieldSetCriteria, Shopware.Context.api)
    .then((customFieldSets) => { this.customFieldSets = customFieldSets; });
```

## Essential identifiers

- `sw-custom-field-set-renderer` (props `entity`, `sets`, `showCustomFieldSetSelection`)
- entity `custom_field_set`
- `this.repositoryFactory.create('custom_field_set')`, `repository.search(criteria, Shopware.Context.api)`
- `Criteria.equals('relations.entityName', ...)`, `Criteria.sort('config.customFieldPosition', 'ASC', true)`

## Gotchas

- The source's template binds `:sets="sets"` while its loading code stores results in `customFieldSets`; bind the prop to the variable you actually fill.
- The component needs `repositoryFactory` injected (`inject: ['repositoryFactory']`) and `Criteria` from `Shopware.Data` for the snippets to work.
- In 6.7.13.0 the renderer is annotated `@private` in its source; the core product detail page uses it the same way, sorting the sets themselves by `config.customFieldPosition` rather than the `customFields` association.

## Code check (6.7.13.0)
- confirmed `sets` — required Array prop of the renderer — vendor/shopware/administration/Resources/app/administration/src/app/component/form/sw-custom-field-set-renderer/index.js:51
- confirmed `entity` — required Object prop of the renderer — vendor/shopware/administration/Resources/app/administration/src/app/component/form/sw-custom-field-set-renderer/index.js:55
- confirmed `showCustomFieldSetSelection` — Boolean prop, default false — vendor/shopware/administration/Resources/app/administration/src/app/component/form/sw-custom-field-set-renderer/index.js:97
- confirmed `@private` — component docblock marks it private — vendor/shopware/administration/Resources/app/administration/src/app/component/form/sw-custom-field-set-renderer/index.js:14
- confirmed `custom_field_set` — DAL entity name — vendor/shopware/core/System/CustomField/Aggregate/CustomFieldSet/CustomFieldSetDefinition.php:31
- confirmed `relations.entityName` — same filter used by core product detail — vendor/shopware/administration/Resources/app/administration/src/module/sw-product/page/sw-product-detail/index.js:288
- confirmed `config.customFieldPosition` — sort field used by core product detail — vendor/shopware/administration/Resources/app/administration/src/module/sw-product/page/sw-product-detail/index.js:289
- confirmed `Repository::search()` — signature search(criteria, context) — vendor/shopware/administration/Resources/app/administration/src/core/data/repository.data.ts:124
