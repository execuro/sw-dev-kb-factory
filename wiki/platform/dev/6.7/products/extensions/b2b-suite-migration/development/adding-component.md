---
id: platform/dev/6.7/products/extensions/b2b-suite-migration/development/adding-component.md
title: Adding Component
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-suite-migration/development/adding-component.html
sourceHash: dcfabcfd512405fb94d8ecf62331600eb42a9f4b
codeCheckedAgainst: "6.7.15.1"
keywords: ["b2b suite migration", "AbstractB2BMigrationConfigurator", "b2b.migration.configurator", "getName", "configPath", "priority", "migration-1.0.xsd", "xml mapping", "conditions", "source_primary_key", "target_primary_key", "EmployeeManagementMigrationConfigurator", "new component"]
summary: Add a B2B Suite migration component - AbstractB2BMigrationConfigurator subclass tagged b2b.migration.configurator plus an XML entity mapping.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/products/extensions/b2b-suite-migration/development/fields-mapping.md"]
---
## What it is

How to add a new component to the B2B Suite to B2B Commercial migration: register a migration configurator service and write the XML mapping file that defines its entities, filter conditions and fields.

## When to use

When you need to migrate a set of B2B Suite tables that no existing component (employee management, quotes, shopping lists, budgets) covers.

## Key steps / config

1. Create a class extending `Shopware\Commercial\B2B\B2BSuiteMigration\Core\Domain\MappingConfigurator\AbstractB2BMigrationConfigurator`.
2. Return the component name in lowercase snake_case from `getName()`.
3. Return the XML mapping file path from `configPath()`.
4. Tag the service with `b2b.migration.configurator`; the `priority` attribute orders execution among configurators — higher values run first.

```php
$services->set(Shopware\Commercial\B2B\B2BSuiteMigration\Components\EmployeeManagement\EmployeeManagementMigrationConfigurator::class)
    ->tag('b2b.migration.configurator', ['priority' => 9000]);

class EmployeeManagementMigrationConfigurator extends AbstractB2BMigrationConfigurator
{
    public function getName(): string { return 'employee_management'; }
    public function configPath(): string { return 'path/to/your/xml/mapping/file.xml'; }
    // ...
}
```

Inspect the execution order with `php bin/console debug:container --tag=b2b.migration.configurator`. Default priorities of the shipped configurators: `EmployeeManagementMigrationConfigurator` `9000`, `QuoteB2BMigrationConfigurator` `8000`, `ShoppingListMigrationConfigurator` `7000`, `BudgetManagementMigrationConfigurator` `5000`.

### XML mapping file

The root `<migration>` element references the schema via `xsi:noNamespaceSchemaLocation="../../../Core/Resources/Schema/Xml/migration-1.0.xsd"`.

```xml
<migration xsi:noNamespaceSchemaLocation="../../../Core/Resources/Schema/Xml/migration-1.0.xsd">
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

- `name` — unique migration process identifier.
- `source` / `target` — source and target table names.
- `source_primary_key` / `target_primary_key` — primary keys, default `id`.
- `conditions` — optional `<condition>` elements filtering source records; SQL-like expressions (`is_debtor = 1`, `status != 'inactive'`), multiple conditions combined with `AND`. The example keeps only `b2b_customer_data` rows where `is_debtor` is `1`.
- `fields` — field mappings, see [Fields Mapping](platform/dev/6.7/products/extensions/b2b-suite-migration/development/fields-mapping.md).

## Essential identifiers

- `Shopware\Commercial\B2B\B2BSuiteMigration\Core\Domain\MappingConfigurator\AbstractB2BMigrationConfigurator`
- `getName()`, `configPath()`
- `b2b.migration.configurator` (tag, `priority` attribute)
- `migration-1.0.xsd`

## Gotchas

- Conditions must be valid for the source table schema, otherwise the migration fails at runtime.

## Code check (6.7.15.1)
- unverified `AbstractB2BMigrationConfigurator` — SwagCommercial B2B extension class, not in core/storefront/administration; out of scope
- unverified `b2b.migration.configurator` — tag registered by SwagCommercial; out of scope
- unverified `AbstractB2BMigrationConfigurator::getName()` — abstract member in SwagCommercial; out of scope
- unverified `AbstractB2BMigrationConfigurator::configPath()` — abstract member in SwagCommercial; out of scope
- unverified `migration-1.0.xsd` — schema shipped by SwagCommercial; out of scope
- unverified `EmployeeManagementMigrationConfigurator` — priority 9000 per docs, defined in SwagCommercial; out of scope
- unverified `debug:container` — Symfony console command, vendor/symfony; out of scope
