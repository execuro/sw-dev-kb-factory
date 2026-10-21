---
id: platform/dev/6.7/products/extensions/b2b-suite-migration/development/extending-migration.md
title: Extending Migration
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-suite-migration/development/extending-migration.html
sourceHash: 3b8e14d007270526765f685990a0df57e9c161f2
codeCheckedAgainst: "6.7.15.1"
keywords: ["b2b suite migration", "AbstractB2BExtensionMigrationConfigurator", "b2b.migration.configurator.extension", "entity-extension", "migration-extension-1.0.xsd", "getName", "configPath", "conditions", "extend existing entity", "new fields", "new entity", "CustomerSpecificFeaturesTransformer"]
summary: Extend an existing B2B Suite migration component - extension configurator tag, extra conditions, entity-extension fields, new entities.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/products/extensions/b2b-suite-migration/development/adding-component.md"]
---
## What it is

How to extend an existing component of the B2B Suite to B2B Commercial migration: add conditions or fields to an existing entity, or add a new entity to an existing component, via an extension configurator and a migration-extension XML file.

## When to use

When a shipped component (e.g. `employee_management`) already migrates an entity but you need extra source columns, extra filtering, or an additional entity — without rewriting the base mapping.

## Key steps / config

### Register an extension configurator

1. Create a class extending `Shopware\Commercial\B2B\B2BSuiteMigration\Core\Domain\Extension\ExtensionConfigurator\AbstractB2BExtensionMigrationConfigurator`.
2. Tag the service with `b2b.migration.configurator.extension`.
3. Return the name of the component to extend from `getName`.
4. Return the path to your XML configuration from `configPath`.

```php
$services->set(MigrationExtension\B2BMigration\B2BExtensionMigrationConfigurator::class)
    ->tag('b2b.migration.configurator.extension');

class B2BExtensionMigrationConfigurator extends AbstractB2BExtensionMigrationConfigurator
{
    public function getName(): string { return 'employee_management'; }
    public function configPath(): string { return __DIR__ . '/../../src/Resources/employee.xml'; }
    // ...
}
```

Extension XML files use the schema `../../../SwagCommercial/src/B2B/B2BSuiteMigration/Core/Resources/Schema/Xml/migration-extension-1.0.xsd` (`xsi:noNamespaceSchemaLocation` on `<migration>`).

### Add conditions to an existing entity

Repeat the entity (`name`, `source`, `target`) with a `<conditions>` block. These conditions are merged with the base entity's conditions and all are applied with `AND`.

```xml
<entity>
  <name>migration_b2b_component_business_partner</name>
  <source>b2b_customer_data</source>
  <target>b2b_business_partner</target>
  <conditions><condition>new_condition = value</condition></conditions>
  <fields>...</fields>
</entity>
```

### Add fields to an existing entity

Use `<entity-extension>`; `name` must match the base entity name. Fields follow the normal mapping rules (one-to-one, relational, handler-based). Original mappings stay untouched.

```xml
<entity-extension>
  <name>migration_b2b_component_business_partner</name>
  <fields><field source="new_column" target="target_column"/></fields>
</entity-extension>
```

### Add a new entity to an existing component

Define a regular `<entity>` in the extension XML, e.g. `migration_b2b_component_customer_specific_features` from `customer` to `customer_specific_features`, with fields such as `source="id.b2b_business_partner[customer_id].customer_id"` and a handler field `handler="Shopware\Commercial\B2B\B2BSuiteMigration\Components\EmployeeManagement\DataTransformer\CustomerSpecificFeature\CustomerSpecificFeaturesTransformer"` targeting `features`.

## Essential identifiers

- `Shopware\Commercial\B2B\B2BSuiteMigration\Core\Domain\Extension\ExtensionConfigurator\AbstractB2BExtensionMigrationConfigurator`
- `b2b.migration.configurator.extension`
- `migration-extension-1.0.xsd`
- `<entity-extension>`, `<conditions>`, `<entity>`

## Code check (6.7.15.1)
- unverified `AbstractB2BExtensionMigrationConfigurator` — SwagCommercial B2B extension class, not in core/storefront/administration; out of scope
- unverified `b2b.migration.configurator.extension` — tag registered by SwagCommercial; out of scope
- unverified `migration-extension-1.0.xsd` — schema shipped by SwagCommercial; out of scope
- unverified `entity-extension` — XML element defined by the SwagCommercial schema; out of scope
- unverified `CustomerSpecificFeaturesTransformer` — SwagCommercial handler class; out of scope
