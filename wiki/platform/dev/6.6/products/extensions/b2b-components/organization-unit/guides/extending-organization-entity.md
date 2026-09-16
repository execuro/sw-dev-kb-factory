---
id: platform/dev/6.6/products/extensions/b2b-components/organization-unit/guides/extending-organization-entity.md
title: Extending the Organization entity
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/products/extensions/b2b-components/organization-unit/guides/extending-organization-entity.html
sourceHash: 20e08cffa304c9f613d6950b8c223ca55b10e8df
keywords: ["attribute entity", "OrganizationEntity", "EntityDefinition", "EntityExtension", "b2b_components_organization.definition", "b2b_components_organization.repository", "OneToManyAssociationField", "CascadeDelete", "extendFields", "getEntityName", "PHP attributes entity"]
summary: "OrganizationEntity is a PHP-attribute entity with no EntityDefinition class; extend it via EntityExtension using its entity name string."
lastBuilt: "2026-09-15"
relatedPages:
  - "platform/dev/6.6/guides/plugins/plugins/framework/data-handling/entities-via-attributes.md"
---
## What it is

`OrganizationEntity` is an Attribute Entity: it uses PHP attributes (e.g. `#[Entity(...)]`, `#[Field(...)]`) to describe its structure instead of a traditional `EntityDefinition`/`EntityCollection` pair, which changes how extensions must reference it. See [Entities via attributes](platform/dev/6.6/guides/plugins/plugins/framework/data-handling/entities-via-attributes.md) for the underlying mechanism.

## When to use

Use this when you need to add custom fields/associations to `OrganizationEntity` and cannot refer to an `EntityDefinition` class as you would for a normal entity.

## Key steps / config

Since attribute entities have no `EntityDefinition` class, reference them by their entity name string, taken from the `#[Entity(...)]` attribute:

```php
#[Entity('b2b_components_organization')]
```

Shopware still generates a definition and repository service under that name:

| Type | Service name |
|---|---|
| Definition | `b2b_components_organization.definition` |
| Repository | `b2b_components_organization.repository` |

Extend it with an `EntityExtension`:

```php
class OrganizationExtension extends EntityExtension
{
    public function extendFields(FieldCollection $collection): void
    {
        $collection->add(
            (new OneToManyAssociationField(
                'yourEntities',
                YourEntityDefinition::class,
                'organization_id'
            ))->addFlags(new CascadeDelete())
        );
    }

    public function getEntityName(): string
    {
        return 'b2b_components_organization';
    }
}
```

## Essential identifiers

- `OrganizationEntity`
- `b2b_components_organization.definition`
- `b2b_components_organization.repository`
- `EntityExtension::extendFields`, `EntityExtension::getEntityName`
