---
id: platform/dev/6.7/products/extensions/b2b-components/organization-unit/guides/extending-organization-entity.md
title: Extending the Organization entity
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-components/organization-unit/guides/extending-organization-entity.html
sourceHash: 4679907adad9b522bb295cea0c036fd1ff484753
codeCheckedAgainst: "6.7.13.0"
keywords: ["OrganizationEntity", "b2b_components_organization", "b2b_components_organization.definition", "b2b_components_organization.repository", "EntityExtension", "getEntityName", "extendFields", "OneToManyAssociationField", "attribute entity", "entity extension", "organization unit", "b2b"]
summary: "Extend the attribute-based B2B OrganizationEntity via EntityExtension returning 'b2b_components_organization' from getEntityName(); no definition class."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/framework/data-handling/entities-via-attributes.md"]
---
## What it is

How to add fields/associations to the B2B `OrganizationEntity`, which is an attribute entity (declared with PHP attributes such as `#[Entity(...)]` and `#[Field(...)]`) and therefore has no `EntityDefinition` or `EntityCollection` class of its own. See [Entities via attributes](platform/dev/6.7/guides/plugins/plugins/framework/data-handling/entities-via-attributes.md).

## When to use

Adding an association or field to organizations (e.g. a one-to-many relation from your own entity to `b2b_components_organization`).

## Key steps / config

1. Reference the entity by its name string, i.e. the value of its `#[Entity]` attribute:

```php
#[Entity('b2b_components_organization')]
```

2. Shopware still generates the definition and repository services from that name:

| Type | Service id |
|---|---|
| Definition | `b2b_components_organization.definition` |
| Repository | `b2b_components_organization.repository` |

3. Write an `EntityExtension` whose `getEntityName()` returns the name:

```php
class OrganizationExtension extends EntityExtension
{
    public function extendFields(FieldCollection $collection): void
    {
        $collection->add(
            (new OneToManyAssociationField('yourEntities', YourEntityDefinition::class, 'organization_id'))
                ->addFlags(new CascadeDelete())
        );
    }

    public function getEntityName(): string
    {
        return 'b2b_components_organization';
    }
}
```

## Essential identifiers

- `OrganizationEntity`, entity name `b2b_components_organization`
- `b2b_components_organization.definition`, `b2b_components_organization.repository`
- `Shopware\Core\Framework\DataAbstractionLayer\EntityExtension::getEntityName()`, `extendFields()`
- `OneToManyAssociationField`, `CascadeDelete`

## Gotchas

- Do not look for an `OrganizationDefinition` class to reference; attribute entities are extended only via the entity name string.
- `getEntityName()` is the only abstract member of `EntityExtension`; `extendFields()` is an empty default you override.

## Code check (6.7.13.0)
- confirmed `EntityExtension::getEntityName()` — abstract, required — vendor/shopware/core/Framework/DataAbstractionLayer/EntityExtension.php:46
- confirmed `EntityExtension::extendFields()` — overridable no-op default — vendor/shopware/core/Framework/DataAbstractionLayer/EntityExtension.php:18
- confirmed `Entity` — attribute class, first constructor arg is the entity name — vendor/shopware/core/Framework/DataAbstractionLayer/Attribute/Entity.php:11
- confirmed `.definition` — attribute entities registered as `<entity>.definition` service — vendor/shopware/core/Framework/DependencyInjection/CompilerPass/AttributeEntityCompilerPass.php:66
- confirmed `.repository` — attribute entities get `<entity>.repository` service — vendor/shopware/core/Framework/DependencyInjection/CompilerPass/AttributeEntityCompilerPass.php:91
- confirmed `OneToManyAssociationField` — args propertyName, referenceClass, referenceField, localField='id' — vendor/shopware/core/Framework/DataAbstractionLayer/Field/OneToManyAssociationField.php:10
- confirmed `CascadeDelete` — flag class — vendor/shopware/core/Framework/DataAbstractionLayer/Field/Flag/CascadeDelete.php:11
- unverified `OrganizationEntity` — Commercial plugin, not in installed vendor/shopware roots
- unverified `b2b_components_organization` — Commercial plugin entity name, not installed
