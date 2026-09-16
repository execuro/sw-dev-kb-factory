---
id: platform/dev/6.7/resources/references/adr/2023-02-02-deprecate-autoload-true-in-dal-associations.md
title: Deprecate autoloading associations in DAL entity definitions
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2023-02-02-deprecate-autoload-true-in-dal-associations.html
sourceHash: d397426bc100d86f6c6bdc7b5ef7eb40f02291d8
codeCheckedAgainst: "6.7.13.0"
keywords: ["autoload", "OneToOneAssociationField", "ManyToOneAssociationField", "FieldCollection", "defineFields", "Criteria", "addAssociation", "dal", "entity definition", "association loading", "performance", "phpstan"]
summary: "ADR: autoload=true on OneToOneAssociationField/ManyToOneAssociationField is deprecated; request associations explicitly via Criteria instead."
lastBuilt: 2026-09-15
---
## What it is

An architecture decision record deprecating `autoload: true` on the DAL association fields `OneToOneAssociationField` and `ManyToOneAssociationField`. Autoloaded associations are joined on every query whether used or not, adding SQL joins, hydration work and larger API payloads.

## When to use

When defining or reviewing entity definitions with to-one associations, or when an API consumer or internal code relied on associations that used to arrive in responses without being requested.

## Key steps / config

1. Do not set `autoload: true` on association fields in entity definitions; declare them without autoloading:

```php
public function defineFields(): FieldCollection
{
    return new FieldCollection([
        // ...
        new ManyToOneAssociationField(/* propertyName, storageName, referenceClass, referenceField */ ..., autoload: false),
        new OneToOneAssociationField(/* propertyName, storageName, referenceField, referenceClass */ ..., autoload: false),
    ]);
}
```

2. Every code path (internal services, API clients) that needs the associated data adds it to the search criteria explicitly with `Criteria::addAssociation()`.
3. Per the ADR's migration strategy for core: document each deprecation in the changelog, add associations to criteria in internal APIs, and gate the definition change behind the major feature flag until release.
4. A PHPStan rule fails on any `autoload === true` usage in core; existing violations were baselined in `phpstan.neon.dist` until fixed.

## Essential identifiers

- `Shopware\Core\Framework\DataAbstractionLayer\Field\OneToOneAssociationField`
- `Shopware\Core\Framework\DataAbstractionLayer\Field\ManyToOneAssociationField`
- `AssociationField::getAutoload()`
- `Criteria::addAssociation()`
- `phpstan.neon.dist`

## Gotchas

- In the installed code the `OneToOneAssociationField` constructor still defaults `$autoload` to `true`; pass `autoload: false` explicitly. `ManyToOneAssociationField` defaults to `false`.
- Argument order differs: `ManyToOneAssociationField(propertyName, storageName, referenceClass, referenceField = 'id', autoload)` vs `OneToOneAssociationField(propertyName, storageName, referenceField, referenceClass, autoload)`.
- Removing autoloading is a BC break for external API consumers who read associations they never requested; they must request those associations explicitly (which already worked before the change).

## Version notes

- 6.5: `autoload === true` deprecated in core.
- 6.6: all core entity-definition usages to be removed; the ADR's transitional example switched on `Feature::isActive('v6.6.0.0')`.

## Code check (6.7.13.0)
- confirmed `OneToOneAssociationField::__construct()` — `$autoload` defaults to `true` — vendor/shopware/core/Framework/DataAbstractionLayer/Field/OneToOneAssociationField.php:19
- confirmed `ManyToOneAssociationField::__construct()` — `$autoload` defaults to `false`, after `$referenceField = 'id'` — vendor/shopware/core/Framework/DataAbstractionLayer/Field/ManyToOneAssociationField.php:19
- confirmed `AssociationField::$autoload` — base default `false` — vendor/shopware/core/Framework/DataAbstractionLayer/Field/AssociationField.php:18
- confirmed `AssociationField::getAutoload()` — final accessor — vendor/shopware/core/Framework/DataAbstractionLayer/Field/AssociationField.php:59
- confirmed `Criteria::addAssociation()` — explicit association loading — vendor/shopware/core/Framework/DataAbstractionLayer/Search/Criteria.php:321
- confirmed `Feature::isActive()` — static feature-flag check used in the transitional example — vendor/shopware/core/Framework/Feature.php:128
- unverified `phpstan.neon.dist` — repository dev tooling, not shipped in vendor/shopware/core
