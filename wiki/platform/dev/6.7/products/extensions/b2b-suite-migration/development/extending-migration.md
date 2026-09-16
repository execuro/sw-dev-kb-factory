---
id: platform/dev/6.7/products/extensions/b2b-suite-migration/development/extending-migration.md
title: Extending Migration
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-suite-migration/development/extending-migration.html
sourceHash: 3b8e14d007270526765f685990a0df57e9c161f2
codeCheckedAgainst: "6.7.13.0"
keywords: ["AbstractB2BExtensionMigrationConfigurator", "b2b.migration.configurator.extension", "entity-extension", "migration-extension-1.0.xsd", "getName", "configPath", "CustomerSpecificFeaturesTransformer", "b2b suite migration", "extend migration", "new fields", "new entity", "conditions"]
summary: "Extend a B2B Suite migration component via AbstractB2BExtensionMigrationConfigurator: add conditions, entity-extension fields or new entities in XML."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/products/extensions/b2b-suite-migration/development/adding-component.md"]
---
## What it is

How to extend an existing B2B Suite to B2B Commercial migration component: register an extension configurator, then add conditions to an existing entity, add fields to an existing entity, or add a new entity to the component — all via an extension XML file.

## When to use

When a shipped component (e.g. `employee_management`) must migrate extra columns, filter source rows differently, or migrate an additional table.

## Key steps / config

1. Create a class extending `Shopware\Commercial\B2B\B2BSuiteMigration\Core\Domain\Extension\ExtensionConfigurator\AbstractB2BExtensionMigrationConfigurator`.
2. Tag the service with `b2b.migration.configurator.extension`.
3. Return the name of the component to extend from `getName()`, and the XML file path from `configPath()`.

```php
$services->set(MigrationExtension\B2BMigration\B2BExtensionMigrationConfigurator::class)
    ->tag('b2b.migration.configurator.extension');

class B2BExtensionMigrationConfigurator extends AbstractB2BExtensionMigrationConfigurator
{
    public function getName(): string { return 'employee_management'; }
    public function configPath(): string { return __DIR__ . '/../../src/Resources/employee.xml'; }
}
```

Extension XML files use schema `../../../SwagCommercial/src/B2B/B2BSuiteMigration/Core/Resources/Schema/Xml/migration-extension-1.0.xsd` (`xsi:noNamespaceSchemaLocation`).

**Add conditions to an existing entity** — repeat the entity (`name`, `source`, `target`) with a `<conditions>` block; each `<condition>` is a SQL condition merged with the base entity's conditions using `AND`.

**Add fields to an existing entity** — use `<entity-extension>`; `name` must match the base entity name:

```xml
<migration xmlns:xsi="..." xsi:noNamespaceSchemaLocation=".../migration-extension-1.0.xsd">
  <entity-extension>
    <name>migration_b2b_component_business_partner</name>
    <fields>
      <field source="new_column" target="target_column"/>
    </fields>
  </entity-extension>
</migration>
```

Fields follow the same mapping rules as base migrations (one-to-one, relational, handler-based) and do not alter original mappings.

**Add a new entity to an existing component** — define a full `<entity>` in the extension XML, e.g.:

```xml
<entity>
  <name>migration_b2b_component_customer_specific_features</name>
  <source>customer</source>
  <target>customer_specific_features</target>
  <fields>
    <field source="id.b2b_business_partner[customer_id].customer_id" target="customer_id"/>
    <field target="features" handler="Shopware\Commercial\B2B\B2BSuiteMigration\Components\EmployeeManagement\DataTransformer\CustomerSpecificFeature\CustomerSpecificFeaturesTransformer"/>
  </fields>
</entity>
```

## Essential identifiers

- `Shopware\Commercial\B2B\B2BSuiteMigration\Core\Domain\Extension\ExtensionConfigurator\AbstractB2BExtensionMigrationConfigurator`
- `b2b.migration.configurator.extension` (service tag)
- `getName()`, `configPath()`
- `migration-extension-1.0.xsd`
- XML elements `entity-extension`, `entity`, `conditions`, `condition`, `fields`, `field` (`source`, `target`, `handler`)

## Gotchas

- Extension conditions never replace base conditions; they are combined with `AND`.
- The `<entity-extension>` `name` must exactly match the base migration entity name.

## Code check (6.7.13.0)
- unverified `AbstractB2BExtensionMigrationConfigurator` — SwagCommercial class, not installed in the checked vendor/shopware roots
- unverified `b2b.migration.configurator.extension` — tag consumed by SwagCommercial, not found in vendor/shopware
- unverified `AbstractB2BExtensionMigrationConfigurator::configPath()` — SwagCommercial, outside the checked vendor roots
- unverified `migration-extension-1.0.xsd` — schema ships with SwagCommercial
- unverified `CustomerSpecificFeaturesTransformer` — SwagCommercial handler, outside the checked vendor roots
- confirmed `customer` — core entity/table name used as migration source — vendor/shopware/core/Checkout/Customer/CustomerDefinition.php:62
- confirmed `customer_specific_features` — target entity known to core usage-data allow list, not defined in core itself — vendor/shopware/core/System/UsageData/usage-data-allow-list.json:2024
- confirmed `SwagCommercial` — core only references the commercial plugin by name — vendor/shopware/core/System/Resources/translation.yaml:8
