---
id: platform/dev/6.7/products/extensions/b2b-components/organization-unit/guides/extending-organization-entity.md
title: Extending the Organization entity
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-components/organization-unit/guides/extending-organization-entity.html
sourceHash: 4679907adad9b522bb295cea0c036fd1ff484753
codeCheckedAgainst: "6.7.15.1"
keywords: ["OrganizationEntity", "b2b_components_organization", "EntityExtension", "getEntityName", "extendFields", "attribute entity", "b2b_components_organization.definition", "b2b_components_organization.repository", "OneToManyAssociationField", "CascadeDelete", "entity extension", "organization unit"]
summary: Extend the attribute-based B2B OrganizationEntity with an EntityExtension whose getEntityName() returns 'b2b_components_organization'.
lastBuilt: 2026-10-21
relatedPages:
  - platform/dev/6.7/guides/plugins/plugins/framework/data-handling/entities-via-attributes.md
---
## What it is

How to add fields or associations to the B2B Components `OrganizationEntity`. It is an attribute entity: its structure is declared with PHP attributes (`#[Entity(...)]`, `#[Field(...)]`) instead of an `EntityDefinition`/`EntityCollection` pair, so an extension must reference it by entity name string rather than by a definition class. Background: [Entities via attributes](platform/dev/6.7/guides/plugins/plugins/framework/data-handling/entities-via-attributes.md).

## When to use

Your plugin needs to attach its own data (e.g. a one-to-many association to your entity) to B2B organization units.

## Key steps / config

1. Use the entity name from the attribute on `OrganizationEntity`:

```php
#[Entity('b2b_components_organization')]
```

2. Shopware still generates a definition and repository for attribute entities, named after the entity:

| Type | Service name |
|---|---|
| Definition | `b2b_components_organization.definition` |
| Repository | `b2b_components_organization.repository` |

3. Write an `EntityExtension` that returns that string from `getEntityName()` and adds fields in `extendFields()`:

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
- `Shopware\Core\Framework\DataAbstractionLayer\EntityExtension` (`extendFields()`, `getEntityName()`)
- `OneToManyAssociationField`, `CascadeDelete`

## Gotchas

- There is no `OrganizationDefinition` class to reference; `getEntityName()` must return the plain entity name string.
- `getEntityName()` is the only abstract member of `EntityExtension`; `extendFields()`, `modifyFields()` and `extendProtections()` are optional no-op hooks.

## Code check (6.7.15.1)
- confirmed `EntityExtension::getEntityName()` — abstract, must be implemented — vendor/shopware/core/Framework/DataAbstractionLayer/EntityExtension.php:48
- confirmed `EntityExtension::extendFields()` — optional, empty default — vendor/shopware/core/Framework/DataAbstractionLayer/EntityExtension.php:18
- confirmed `Entity` — class attribute whose constructor takes the entity `$name` first — vendor/shopware/core/Framework/DataAbstractionLayer/Attribute/Entity.php:11
- confirmed `.definition` — attribute entities get `<entity>.definition` service — vendor/shopware/core/Framework/DependencyInjection/CompilerPass/AttributeEntityCompilerPass.php:66
- confirmed `.repository` — attribute entities get `<entity>.repository` service — vendor/shopware/core/Framework/DependencyInjection/CompilerPass/AttributeEntityCompilerPass.php:91
- confirmed `OneToManyAssociationField` — DAL association field — vendor/shopware/core/Framework/DataAbstractionLayer/Field/OneToManyAssociationField.php:13
- confirmed `CascadeDelete` — DAL flag — vendor/shopware/core/Framework/DataAbstractionLayer/Field/Flag/CascadeDelete.php:11
- unverified `OrganizationEntity` — commercial B2B Components class, not in core/storefront/administration
