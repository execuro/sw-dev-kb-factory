---
id: platform/dev/6.7/guides/plugins/apps/custom-data/custom-entities.md
title: Custom Entities
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/apps/custom-data/custom-entities.html
sourceHash: 1163cb7af8b91f00659987edad645c4d11270643
codeCheckedAgainst: "6.7.15.1"
keywords: ["custom entities", "entities.xml", "entity-1.0.xsd", "custom_entity_", "ce_", "custom-fields-aware", "label-property", "store-api-aware", "services.repository.search", "/api/search/custom-entity-", "entity select custom field", "app data model"]
summary: "Define app custom entities in Resources/entities.xml (custom_entity_/ce_ prefix) - auto repository, Admin API routes, custom-field opt-in, permissions."
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/plugins/apps/custom-data/custom-fields.md", "platform/dev/6.7/resources/references/app-reference/entities-reference.md", "platform/dev/6.7/guides/plugins/apps/app-scripts/_index.md", "platform/dev/6.7/concepts/api/admin-api.md"]
---
## What it is

Custom entities let an app define entirely new entities (own fields and associations) instead of only extending core tables like [custom fields](platform/dev/6.7/guides/plugins/apps/custom-data/custom-fields.md). They are declared in the app's `Resources/entities.xml` and can be managed in the Administration.

## When to use

When an app needs its own data structures and relationships, e.g. a bundle entity referencing products, accessible via repository in app scripts and via the Admin API.

## Key steps / config

1. Create `<app root>/Resources/entities.xml` (full structure: [Custom entity xml reference](platform/dev/6.7/resources/references/app-reference/entities-reference.md)):

```xml
<entities xmlns:xsi="..." xsi:noNamespaceSchemaLocation="https://raw.githubusercontent.com/shopware/shopware/trunk/src/Core/System/CustomEntity/Xml/entity-1.0.xsd">
    <entity name="custom_entity_bundle" custom-fields-aware="true" label-property="name">
        <fields>
            <string name="name" required="true" translatable="true" store-api-aware="true" />
            <price name="discount" required="true" store-api-aware="true"/>
            <many-to-many name="products" reference="product" store-api-aware="true" />
        </fields>
    </entity>
</entities>
```

   Entity names use the prefix `custom_entity_` or the shorthand `ce_` (e.g. `ce_bundle`) to avoid DB name length limits. Every field element requires the `store-api-aware` attribute in the schema.
2. Every registered entity gets a repository automatically. In [App scripts](platform/dev/6.7/guides/plugins/apps/app-scripts/_index.md) (if the hook allows repository access): `{% set blogs = services.repository.search('custom_entity_blog', criteria) %}`.
3. Via the [Admin API](platform/dev/6.7/concepts/api/admin-api.md): `POST /api/search/custom-entity-blog`. For a `ce_` entity the route is `POST /api/search/ce-blog` (hyphen, not underscore); in app scripts use the full name `ce_blog`.
4. Custom field of type "Entity Select" referencing the entity (opt-in): set `custom-fields-aware="true"` and `label-property` to a field that exists in `<fields>` and is of type `string`. Without a snippet the entity shows as `custom_entity_bundle.label`; add one in `Resources/app/administration/snippet/en-GB.json`:

```json
{ "custom_entity_bundle": { "label": "My Custom Entity" } }
```

5. Permissions: the app has full access to its own custom entities; associations to core tables need manifest permissions ([manifest reference](platform/dev/6.7/resources/references/app-reference/manifest-reference.md)), e.g. `<permissions><read>product</read></permissions>`.

## Essential identifiers

- `Resources/entities.xml`, `entity-1.0.xsd`
- `<entity name>`, `custom-fields-aware`, `label-property`
- field types `string`, `price`, `many-to-many` with `store-api-aware`, `required`, `translatable`, `reference`
- prefixes `custom_entity_`, `ce_`
- `services.repository.search`
- `/api/search/custom-entity-{name}`, `/api/search/ce-{name}`

## Gotchas

- Existing custom entities cannot be renamed — renaming deletes all existing data.
- If you use the `ce_` shorthand in the definition, use it in repository and API calls too.
- An invalid `label-property` (not defined in fields, or not a string field) throws on schema validation.

## Version notes

- `ce_` shorthand prefix: since 6.4.15.0.
- Custom entities with custom fields (`custom-fields-aware`): since 6.5.1.0.

## Code check (6.7.15.1)
- confirmed `custom-fields-aware` — entity attribute in schema — vendor/shopware/core/System/CustomEntity/Xml/entity-1.0.xsd:34
- confirmed `label-property` — entity attribute in schema — vendor/shopware/core/System/CustomEntity/Xml/entity-1.0.xsd:35
- confirmed `store-api-aware` — required attribute on field types — vendor/shopware/core/System/CustomEntity/Xml/entity-1.0.xsd:58
- confirmed `CustomEntityXmlSchema::FILENAME` — `entities.xml` — vendor/shopware/core/System/CustomEntity/Xml/CustomEntityXmlSchema.php:15
- confirmed `SchemaUpdater::TABLE_PREFIX` — `custom_entity_` — vendor/shopware/core/System/CustomEntity/Schema/SchemaUpdater.php:21
- confirmed `SchemaUpdater::SHORTHAND_TABLE_PREFIX` — `ce_` — vendor/shopware/core/System/CustomEntity/Schema/SchemaUpdater.php:23
- confirmed `api.custom_entity_entity.search` — `POST /api/search/custom-entity-{entityName}` — vendor/shopware/core/System/CustomEntity/Api/CustomEntityApiController.php:72
- corrected `api.ce_entity.search` — docs: `POST /api/search/ce_blog`; route is `/api/search/ce-{entityName}` — vendor/shopware/core/System/CustomEntity/Api/CustomEntityApiController.php:96
- confirmed `CustomEntityException::labelPropertyWrongType()` — label property must be a string field — vendor/shopware/core/System/CustomEntity/CustomEntityException.php:70
- confirmed `RepositoryFacade::search()` — app script repository search — vendor/shopware/core/Framework/DataAbstractionLayer/Facade/RepositoryFacade.php:50
