---
id: platform/dev/6.7/resources/references/adr/2023-02-02-deprecate-autoload-true-in-dal-associations.md
title: Deprecate autoloading associations in DAL entity definitions
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2023-02-02-deprecate-autoload-true-in-dal-associations.html
sourceHash: d397426bc100d86f6c6bdc7b5ef7eb40f02291d8
codeCheckedAgainst: "6.7.15.1"
keywords: ["autoload", "OneToOneAssociationField", "ManyToOneAssociationField", "getAutoload", "defineFields", "FieldCollection", "Feature::isActive", "phpstan.neon.dist", "dal", "data abstraction layer", "association loading", "criteria addAssociation", "performance", "adr"]
summary: "ADR: autoload true on OneToOne/ManyToOne DAL associations deprecated in 6.5, removed from core for 6.6; request associations via Criteria."
lastBuilt: 2026-10-21
---
## What it is

An architecture decision record (2023-02-02) deprecating `autoload` set to `true` on `OneToOneAssociationField` and `ManyToOneAssociationField` in core entity definitions. An autoloaded association is fetched with every query whether the data is used or not, which adds SQL joins, hydration work and larger API payloads.

## When to use

- You define DAL entities and decide whether an association should be loaded by default.
- Your code or API client relied on associations that core used to autoload and stopped receiving them after 6.6.

## Key steps / config

The ADR's migration strategy for core code:

1. Document every deprecation in the changelog.
2. Internal APIs that rely on autoloaded data specify the association explicitly in their `Criteria` objects.
3. Entity definitions add the association conditionally on the 6.6 feature flag during the transition.
4. Before the 6.6 release, the feature conditional is removed, leaving `autoload: false`.

Transition shape inside `defineFields(): FieldCollection` (an `EntityDefinition` hook):

```php
if (Feature::isActive('v6.6.0.0')) {
    $fields->add(new ManyToOneAssociationField(..., autoload: false));
} else {
    $fields->add(new ManyToOneAssociationField(..., autoload: true));
}
```

In the installed code the constructor parameter defaults differ per field type:

- `ManyToOneAssociationField(string $propertyName, string $storageName, string $referenceClass, string $referenceField = 'id', bool $autoload = false)` — no autoload unless you opt in.
- `OneToOneAssociationField(string $propertyName, string $storageName, string $referenceField, string $referenceClass, bool $autoload = true)` — autoloads unless you pass `false` explicitly.

The value is read through `AssociationField::getAutoload()`.

## Essential identifiers

- `Shopware\Core\Framework\DataAbstractionLayer\Field\OneToOneAssociationField`
- `Shopware\Core\Framework\DataAbstractionLayer\Field\ManyToOneAssociationField`
- `AssociationField::getAutoload()`
- `EntityDefinition::defineFields()`
- `Feature::isActive()`
- `phpstan.neon.dist` — where the new PHPStan rule's failures were ignored until fixed

## Gotchas

- The ADR introduced a PHPStan rule that fails on any `autoload === true` usage; existing violations were baselined in `phpstan.neon.dist` until the owning teams fixed them.
- `OneToOneAssociationField` still defaults to `autoload = true` in 6.7 — omitting the argument means autoloading. Pass `false` (as e.g. `ProductSearchConfigDefinition` does for `language`) to follow the ADR.
- The ADR's snippet is missing closing parentheses and a `return`; it only illustrates the transition shape.

## Version notes

- 6.5: `autoload === true` deprecated in the core codebase.
- 6.6: removed from core entity definitions. For external API consumers this is a BC break: they must request every association they use explicitly (adding it before 6.6 already works). The ADR expects the impact to be small because which associations were autoloaded was never documented.

## Code check (6.7.15.1)
- confirmed `ManyToOneAssociationField` — class exists in the DAL field namespace — vendor/shopware/core/Framework/DataAbstractionLayer/Field/ManyToOneAssociationField.php:13
- confirmed `autoload` — ManyToOneAssociationField constructor default is false — vendor/shopware/core/Framework/DataAbstractionLayer/Field/ManyToOneAssociationField.php:22
- confirmed `OneToOneAssociationField` — class exists in the DAL field namespace — vendor/shopware/core/Framework/DataAbstractionLayer/Field/OneToOneAssociationField.php:13
- corrected `autoload` — docs imply autoload true is phased out; OneToOneAssociationField constructor still defaults to true — vendor/shopware/core/Framework/DataAbstractionLayer/Field/OneToOneAssociationField.php:22
- confirmed `getAutoload` — final accessor on AssociationField — vendor/shopware/core/Framework/DataAbstractionLayer/Field/AssociationField.php:59
- confirmed `defineFields` — abstract protected, returns FieldCollection — vendor/shopware/core/Framework/DataAbstractionLayer/EntityDefinition.php:476
- confirmed `isActive` — Feature::isActive(string $feature): bool — vendor/shopware/core/Framework/Feature.php:139
- unverified `phpstan.neon.dist` — repository root file, outside the package roots
