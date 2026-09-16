---
id: platform/dev/6.6/resources/references/adr/2023-02-02-deprecate-autoload-true-in-dal-associations.md
title: Deprecate autoloading associations in DAL entity definitions
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: "https://developer.shopware.com/docs/v6.6/resources/references/adr/2023-02-02-deprecate-autoload-true-in-dal-associations.html"
sourceHash: "d397426bc100d86f6c6bdc7b5ef7eb40f02291d8"
keywords: ["autoload", "OneToOneAssociationField", "ManyToOneAssociationField", "DAL", "entity definition", "criteria", "phpstan.neon.dist", "PHPStan rule", "Feature::isActive", "v6.6.0.0", "API payload size", "association loading"]
summary: "ADR deprecating `autoload: true` on DAL associations in 6.5, requiring explicit criteria associations from 6.6 onward."
lastBuilt: "2026-09-15"
---
## What it is
This ADR documents the decision to deprecate the `autoload` parameter set to `true` on `OneToOneAssociationField` and `ManyToOneAssociationField` definitions in the Data Abstraction Layer (DAL), because it forces the association to be loaded on every query regardless of whether the data is used.

## When to use
Relevant when defining or reviewing a DAL entity definition that declares an association, or when an API consumer relies on association data that appeared in responses without being explicitly requested.

## Key steps / config
- Problem: `autoload === true` causes unnecessary data transfer, extra SQL joins, extra hydration/processing cost, and larger API payloads.
- A PHPStan rule was introduced to detect `autoload === true` usages; failures are ignored via the `phpstan.neon.dist` file until each team fixes them.
- Migration strategy: document deprecations in the changelog; internal APIs relying on autoloaded data must specify the association explicitly via criteria objects; entity definitions add the association conditionally behind the 6.6 feature flag, then drop the conditional once 6.6 ships:

```php
public function defineFields(): FieldCollection
{
   $fields = new FieldCollection(...);
   if (Feature::isActive('v6.6.0.0') {
      $fields->add(new ManyToOneAssociationField(..., autoload: false);
   } else {
      $fields->add(new ManyToOneAssociationField(..., autoload: true);
   }
}
```

## Essential identifiers
- `OneToOneAssociationField`, `ManyToOneAssociationField` (`autoload` parameter)
- `Feature::isActive('v6.6.0.0')`
- `phpstan.neon.dist`

## Gotchas
External API consumers who relied on data that was previously autoloaded (and undocumented) will see it disappear once 6.6 ships unless they explicitly request the association in their criteria — this is called out as a BC break, though considered minimal since which associations were autoloaded was never documented.
