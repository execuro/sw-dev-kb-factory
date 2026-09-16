---
id: platform/dev/6.7/products/extensions/b2b-suite-migration/development/adding-component.md
title: Adding Component
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-suite-migration/development/adding-component.html
sourceHash: dcfabcfd512405fb94d8ecf62331600eb42a9f4b
codeCheckedAgainst: "6.7.13.0"
keywords: ["AbstractB2BMigrationConfigurator", "b2b.migration.configurator", "getName", "configPath", "migration-1.0.xsd", "EmployeeManagementMigrationConfigurator", "debug:container", "b2b suite migration", "new component", "xml mapping", "conditions", "priority"]
summary: "Add a B2B Suite migration component: extend AbstractB2BMigrationConfigurator, tag b2b.migration.configurator with priority, write the XML entity mapping."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/products/extensions/b2b-suite-migration/development/fields-mapping.md"]
---
## What it is

How to add a new component to the B2B Suite to B2B Commercial migration: register a migration configurator service and write the XML mapping file with entity definitions and optional conditions.

## When to use

When data from B2B Suite must be migrated into a component that the shipped configurators do not cover.

## Key steps / config

1. Create a class extending `Shopware\Commercial\B2B\B2BSuiteMigration\Core\Domain\MappingConfigurator\AbstractB2BMigrationConfigurator`.
2. Return the component name in lowercase snake_case from `getName()`.
3. Return the XML mapping file path from `configPath()`.
4. Tag the service with `b2b.migration.configurator`; the `priority` attribute orders execution (higher runs first).

```php
$services->set(Shopware\Commercial\B2B\B2BSuiteMigration\Components\EmployeeManagement\EmployeeManagementMigrationConfigurator::class)
    ->tag('b2b.migration.configurator', ['priority' => 9000]);

class EmployeeManagementMigrationConfigurator extends AbstractB2BMigrationConfigurator
{
    public function getName(): string { return 'employee_management'; }
    public function configPath(): string { return 'path/to/your/xml/mapping/file.xml'; }
}
```

Inspect execution order with `php bin/console debug:container --tag=b2b.migration.configurator`. Default priorities: `EmployeeManagementMigrationConfigurator` 9000, `QuoteB2BMigrationConfigurator` 8000, `ShoppingListMigrationConfigurator` 7000, `BudgetManagementMigrationConfigurator` 5000.

XML entity definition (schema `../../../Core/Resources/Schema/Xml/migration-1.0.xsd` via `xsi:noNamespaceSchemaLocation`):

```xml
<migration xmlns:xsi="..." xsi:noNamespaceSchemaLocation="../../../Core/Resources/Schema/Xml/migration-1.0.xsd">
  <entity>
    <name>migration_b2b_component_business_partner</name>
    <source>b2b_customer_data</source>
    <source_primary_key>customer_id</source_primary_key>
    <target>b2b_business_partner</target>
    <target_primary_key>id</target_primary_key>
    <conditions><condition>is_debtor = 1</condition></conditions>
    <fields>...</fields>
  </entity>
</migration>
```

- `name`: unique migration process identifier.
- `source` / `target`: source and target table names.
- `source_primary_key` / `target_primary_key`: primary keys, default `id`.
- `conditions`: optional filters on source records.
- `fields`: field mappings, see [Field Mapping Configuration](platform/dev/6.7/products/extensions/b2b-suite-migration/development/fields-mapping.md).

Conditions are SQL-like expressions (e.g. `is_debtor = 1`, `status != 'inactive'`); multiple `<condition>` elements are combined with `AND`.

## Essential identifiers

- `Shopware\Commercial\B2B\B2BSuiteMigration\Core\Domain\MappingConfigurator\AbstractB2BMigrationConfigurator`
- `getName()`, `configPath()`
- `b2b.migration.configurator` (service tag, `priority`)
- `migration-1.0.xsd`
- XML elements `entity`, `name`, `source`, `source_primary_key`, `target`, `target_primary_key`, `conditions`, `condition`, `fields`

## Gotchas

- Conditions must be valid for the source table schema, otherwise the migration fails at runtime.
- Pick a tag priority relative to the shipped configurators (9000/8000/7000/5000) to control where your component runs.

## Code check (6.7.13.0)
- unverified `AbstractB2BMigrationConfigurator` — SwagCommercial class, not installed in the checked vendor/shopware roots
- unverified `AbstractB2BMigrationConfigurator::getName()` — SwagCommercial, outside the checked vendor roots
- unverified `AbstractB2BMigrationConfigurator::configPath()` — SwagCommercial, outside the checked vendor roots
- unverified `b2b.migration.configurator` — tag consumed by SwagCommercial, not found in vendor/shopware
- unverified `EmployeeManagementMigrationConfigurator` — priority 9000 claim not verifiable without SwagCommercial
- unverified `migration-1.0.xsd` — schema ships with SwagCommercial
- unverified `b2b_business_partner` — B2B Commercial table, not defined in vendor/shopware
- unverified `debug:container` — Symfony FrameworkBundle command, vendor/symfony out of scope
- confirmed `SwagCommercial` — core only references the commercial plugin by name — vendor/shopware/core/System/Resources/translation.yaml:8
