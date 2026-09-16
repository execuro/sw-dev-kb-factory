---
id: platform/dev/6.7/guides/plugins/apps/custom-data/custom-entities.md
title: Custom Entities
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/apps/custom-data/custom-entities.html
sourceHash: 1163cb7af8b91f00659987edad645c4d11270643
codeCheckedAgainst: "6.7.13.0"
keywords: ["entities.xml", "entity-1.0.xsd", "custom_entity_", "ce_", "custom-fields-aware", "label-property", "store-api-aware", "services.repository.search", "custom entity", "app data model", "entity select custom field", "/api/search/custom-entity-", "app permissions"]
summary: Apps define custom entities in Resources/entities.xml (custom_entity_ or ce_ prefix) with auto repositories, Admin API routes and custom-field opt-in.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/resources/references/app-reference/entities-reference.md", "platform/dev/6.7/guides/plugins/apps/custom-data/custom-fields.md", "platform/dev/6.7/guides/plugins/apps/app-scripts/_index.md", "platform/dev/6.7/resources/references/app-reference/manifest-reference.md"]
---
## What it is

Custom entities let an app define entirely new data structures and relationships (unlike [custom fields](platform/dev/6.7/guides/plugins/apps/custom-data/custom-fields.md), which extend existing records). They are declared in the app's `Resources/entities.xml`, get a generated database table, repository and Admin API, and can be managed in the Administration.

## When to use

Your app needs its own records (e.g. bundles, blog posts) with associations to core entities, accessible from app scripts or the Admin API.

## Key steps / config

1. Create `<app root>/Resources/entities.xml` against `https://raw.githubusercontent.com/shopware/shopware/trunk/src/Core/System/CustomEntity/Xml/entity-1.0.xsd`:
   ```xml
   <entities xsi:noNamespaceSchemaLocation="…/entity-1.0.xsd">
     <entity name="custom_entity_bundle">
       <fields>
         <string name="name" required="true" translatable="true" store-api-aware="true"/>
         <price name="discount" required="true" store-api-aware="true"/>
         <many-to-many name="products" reference="product" store-api-aware="true"/>
       </fields>
     </entity>
   </entities>
   ```
   - The entity `name` must start with `custom_entity_` or the shorthand `ce_` (available since 6.4.15.0, avoids DB name-length limits); other names are rejected.
   - `store-api-aware` is a required attribute on field elements; `required` and `translatable` default to `false`.
   - Field element types: `int`, `float`, `string`, `text`, `bool`, `many-to-many`, `many-to-one`, `one-to-many`, `one-to-one`, `json`, `email`, `price`, `date`. Full structure: [entities reference](platform/dev/6.7/resources/references/app-reference/entities-reference.md).
2. Use the auto-registered repository (service id `<entity name>.repository`), e.g. in [App scripts](platform/dev/6.7/guides/plugins/apps/app-scripts/_index.md) when the hook grants repository access:
   ```twig
   {% set blogs = services.repository.search('custom_entity_blog', criteria) %}
   ```
3. Admin API: entity name with the prefix hyphenated, e.g. `POST /api/search/custom-entity-blog`; for shorthand entities `POST /api/search/ce-blog`. The repository call uses the underscore name (`'ce_blog'`).
4. Optional — make the entity selectable in "Entity Select" custom fields (since 6.5.1.0): add `custom-fields-aware="true"` and `label-property="name"` to `<entity>`. The label property must name a field defined in `<fields>` and must be of type `string`. Add an Administration snippet so the entity type is not shown as `custom_entity_bundle.label`:
   ```json
   { "custom_entity_bundle": { "label": "My Custom Entity" } }
   ```
   (file `Resources/app/administration/snippet/en-GB.json`).
5. Permissions: the app has full rights on its own custom entities; associations to core tables (e.g. `product`) need the matching `<permissions>` entries (e.g. `<read>product</read>`) in `manifest.xml` ([manifest reference](platform/dev/6.7/resources/references/app-reference/manifest-reference.md)).

## Essential identifiers

- `Resources/entities.xml`, `entity-1.0.xsd`
- `custom_entity_` / `ce_` name prefixes
- `custom-fields-aware`, `label-property`, `store-api-aware`
- `services.repository.search()`
- `/api/search/custom-entity-{entityName}`, `/api/search/ce-{entityName}`

## Gotchas

- Existing custom entities cannot be renamed — renaming deletes all existing data.
- If the shorthand `ce_` is used in the definition, it must also be used in repository and API calls.
- `custom-fields-aware` without `label-property`, a label property not in `<fields>`, or a non-string label field each throw an exception.
- The source shows the shorthand search endpoint as `/api/search/ce_blog`; the installed routes use a hyphen (`ce-{entityName}`).

## Code check (6.7.13.0)
- confirmed `entities.xml` — filename read for custom entity definitions — vendor/shopware/core/System/CustomEntity/Xml/CustomEntityXmlSchema.php:15
- confirmed `custom-fields-aware` — boolean attribute on entity — vendor/shopware/core/System/CustomEntity/Xml/entity-1.0.xsd:28
- confirmed `label-property` — string attribute on entity — vendor/shopware/core/System/CustomEntity/Xml/entity-1.0.xsd:29
- confirmed `store-api-aware` — required field attribute — vendor/shopware/core/System/CustomEntity/Xml/entity-1.0.xsd:52
- confirmed `labelPropertyWrongType` — thrown when the label property is not a StringField — vendor/shopware/core/System/CustomEntity/Xml/CustomEntityXmlSchemaValidator.php:36
- confirmed `TABLE_PREFIX` — custom_entity_ prefix — vendor/shopware/core/System/CustomEntity/Schema/SchemaUpdater.php:21
- confirmed `SHORTHAND_TABLE_PREFIX` — ce_ prefix; names without either prefix rejected — vendor/shopware/core/System/CustomEntity/Schema/SchemaUpdater.php:39
- confirmed `/api/search/custom-entity-{entityName}` — Admin API search route — vendor/shopware/core/System/CustomEntity/Api/CustomEntityApiController.php:72
- corrected `/api/search/ce-{entityName}` — docs: POST /api/search/ce_blog — vendor/shopware/core/System/CustomEntity/Api/CustomEntityApiController.php:96
- confirmed `.repository` — repository service registered per custom entity — vendor/shopware/core/System/CustomEntity/CustomEntityRegistrar.php:62
