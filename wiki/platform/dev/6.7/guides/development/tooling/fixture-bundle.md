---
id: platform/dev/6.7/guides/development/tooling/fixture-bundle.md
title: Fixture Bundle
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/development/tooling/fixture-bundle.html
sourceHash: f4aa65d7337ee46a956695d8b3f22ab5f4b7ac01
codeCheckedAgainst: "6.7.15.1"
keywords: ["shopware/fixture-bundle", "fixture:load", "fixture:list", "ThemeFixtureLoader", "CustomFieldSetFixtureLoader", "CustomerFixtureLoader", "dependsOn", "priority", "groups", "demo data", "test data", "seed data", "data fixtures"]
summary: "shopware/fixture-bundle: demo/test data fixtures ordered by dependsOn and priority, filtered by groups; run fixture:load, inspect fixture:list."
lastBuilt: 2026-10-21
---
## What it is

`shopware/fixture-bundle` is a separately installed Composer package for loading test and demo data into a Shopware 6 project. Fixtures are service classes with a `load()` method, ordered by dependencies and priority and filterable by group, plus specialised loaders for themes, custom field sets and customers.

## When to use

Seeding development, demo or test environments with reproducible data (categories, products, customers, theme config, custom fields) instead of creating it by hand or in migrations.

## Key steps / config

1. Install the package:

   ```bash
   composer require shopware/fixture-bundle:*
   ```

2. Write a fixture class: implement the bundle's fixture interface, mark it with the bundle's fixture attribute (both ship with the package, not with core — see Gotchas for the documented names), inject services through the constructor, and put the data creation in `public function load(): void`. Core services you typically use there exist as documented: `EntityRepository::create(array $data, Context $context)`, `Context::createDefaultContext()`, `Uuid::randomHex()`, and repositories injected with `#[Autowire(service: 'category.repository')]`.

3. Attribute parameters:
   - `priority` (`int`, default `0`) — higher runs earlier.
   - `dependsOn` (`array`, default `[]`) — fixture class names that must run first.
   - `groups` (`array`, default `['default']`) — groups for selective loading.
   - The examples also pass a `name` (e.g. `name: 'category'`).

4. Run and inspect:

   ```bash
   bin/console fixture:load
   bin/console fixture:load --group=test-data
   bin/console fixture:list
   ```

   `fixture:list` prints a table with columns Order, Class, Priority, Groups, Depends On.

Execution order: dependencies (`dependsOn`) always run first; among unrelated fixtures, higher `priority` first; circular dependencies throw an exception.

Specialised loaders (fluent definition objects passed to `apply()`):

- `ThemeFixtureLoader` with `ThemeFixtureDefinition('Shopware default theme')->config('sw-color-brand-primary', '#ff6900')` — handles theme discovery and recompilation, applies only when changed.
- `CustomFieldSetFixtureLoader` with `CustomFieldSetFixtureDefinition('Product Specifications', 'product_specs')->relation('product')->field(new CustomFieldFixtureDefinition('weight', CustomFieldTypes::FLOAT)->label('en-GB', '...'))`.
- `CustomerFixtureLoader` with `CustomerFixtureDefinition('max.mustermann@example.com')` and `firstName()`, `lastName()`, `salutation()`, `password()`, `defaultBillingAddress([...])`, `addAddress('work', [...])` — the email is the unique key; existing customers are updated.

## Essential identifiers

- `shopware/fixture-bundle`
- `fixture:load`, `fixture:load --group=<group>`, `fixture:list`
- `priority`, `dependsOn`, `groups`
- `ThemeFixtureLoader`, `ThemeFixtureDefinition`
- `CustomFieldSetFixtureLoader`, `CustomFieldSetFixtureDefinition`, `CustomFieldFixtureDefinition`
- `CustomerFixtureLoader`, `CustomerFixtureDefinition`
- `Shopware\Core\System\CustomField\CustomFieldTypes` (`FLOAT`, `INT`)

## Gotchas

- The docs name the interface `Shopware\Core\Framework\Test\TestCaseBase\FixtureInterface` and the attribute `Shopware\Core\Framework\Test\TestCaseBase\Fixture` (used as `#[Fixture(name: 'category')]`). Neither exists in Shopware core 6.7.15.1 (that namespace only holds test behaviour traits), so take the real namespace from the installed fixture bundle rather than copying the `use` lines.
- The docs' first example calls `Context::createDefaultContext()` without importing `Shopware\Core\Framework\Context`; the theme example uses `$this->mediaHelper` without injecting it.
- Design fixtures to be idempotent (safe to run repeatedly without duplicates), give each a single responsibility, and organise them with groups such as `test-data`, `demo-data`, `performance-test`.

## Code check (6.7.15.1)
- absent `Shopware\Core\Framework\Test\TestCaseBase\FixtureInterface` — not in core; provided (if at all) by the external fixture bundle
- absent `Shopware\Core\Framework\Test\TestCaseBase\Fixture` — no such attribute in core
- unverified `fixture:load` — command lives in shopware/fixture-bundle, outside the core code roots
- unverified `ThemeFixtureLoader` — fixture bundle class, outside the core code roots
- confirmed `EntityRepository::create()` — signature `create(array $data, Context $context)` — vendor/shopware/core/Framework/DataAbstractionLayer/EntityRepository.php:140
- confirmed `Context::createDefaultContext()` — static factory used in the example — vendor/shopware/core/Framework/Context.php:120
- confirmed `CustomFieldTypes::FLOAT` — value `'float'` — vendor/shopware/core/System/CustomField/CustomFieldTypes.php:16
- confirmed `CustomFieldTypes::INT` — value `'int'` — vendor/shopware/core/System/CustomField/CustomFieldTypes.php:17
- confirmed `ThemeDefinition::ENTITY_NAME` — `'theme'` — vendor/shopware/storefront/Theme/ThemeDefinition.php:34
