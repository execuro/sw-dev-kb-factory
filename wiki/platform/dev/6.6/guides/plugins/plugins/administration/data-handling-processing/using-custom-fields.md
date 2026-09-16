---
id: platform/dev/6.6/guides/plugins/plugins/administration/data-handling-processing/using-custom-fields.md
title: Using custom fields
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/administration/data-handling-processing/using-custom-fields.html
sourceHash: e0f69c7c61dbb01c0aa1dee4de1f739a3ac06989
keywords: ["custom fields", "sw-custom-field-set-renderer", "customFieldSetRepository", "customFieldSetCriteria", "repositoryFactory", "Criteria", "custom_field_set", "Shopware.Context.api", "custom field set", "Administration module"]
summary: "Display an entity's custom fields in an Administration module using the sw-custom-field-set-renderer component and a repository."
lastBuilt: "2026-09-15"
---
## What it is

This guide shows how to display custom fields for a custom entity inside an Administration module, using the `sw-custom-field-set-renderer` component together with the `custom_field_set` repository.

## When to use

Use this when a plugin's Administration module needs to render and let a user edit custom fields already defined for an entity.

## Key steps / config

Render the fields with the `sw-custom-field-set-renderer` component:

```html
// <plugin-root>/src/Resources/app/administration/app/src/component/swag-basic-example/swag-basic-example.html.twig
<sw-card title="Custom fields">
    <sw-custom-field-set-renderer
        :entity="customEntity"
        showCustomFieldSetSelection
        :sets="sets">
    </sw-custom-field-set-renderer>
</sw-card>
```

Create a `customFieldSets` variable in `data`:

```javascript
data() {
    return {
        customFieldSets: null
    };
}
```

Add a `customFieldSetRepository` computed property, and a `customFieldSetCriteria` restricting the sets to the entity and sorting fields by position:

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

Then fetch the sets with `search()`:

```javascript
this.customFieldSetRepository.search(this.customFieldSetCriteria, Shopware.Context.api)
    .then((customFieldSets) => {
        this.customFieldSets = customFieldSets;
    });
```

## Essential identifiers

- `sw-custom-field-set-renderer` — component that renders a custom field set for an entity.
- `custom_field_set` — repository entity name used with `repositoryFactory.create()`.
- `Criteria.equals()`, `Criteria.sort()`, `criteria.getAssociation()` — used to build the fetch criteria.
- `Shopware.Context.api` — API context passed to `repository.search()`.
