---
id: platform/dev/6.7/guides/development/tooling/fixture-bundle.md
title: Fixture Bundle
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/development/tooling/fixture-bundle.html
sourceHash: f4aa65d7337ee46a956695d8b3f22ab5f4b7ac01
codeCheckedAgainst: "6.7.13.0"
keywords: ["shopware/fixture-bundle", "fixture:load", "fixture:list", "ThemeFixtureLoader", "CustomFieldSetFixtureLoader", "CustomerFixtureLoader", "dependsOn", "fixture groups", "test data", "demo data", "data seeding", "execution order"]
summary: "Fixture Bundle (shopware/fixture-bundle): data fixtures with priority, dependsOn, groups; run bin/console fixture:load, list with fixture:list."
lastBuilt: 2026-09-15
---
## What it is

The Fixture Bundle is a separate Composer package (`shopware/fixture-bundle`) for loading test and demo data into a Shopware 6 project. Fixtures are PHP classes with a `load(): void` method, ordered by dependencies and priority and filterable by group. The bundle ships its own `bin/console` commands and specialized loaders for themes, custom fields and customers.

## When to use

- Seeding a development, CI or demo environment with reproducible categories, products, customers, theme settings or custom fields.
- Separating test data from demo data via groups and loading only one subset.

## Key steps / config

1. Install the package: `composer require shopware/fixture-bundle:*`
2. Create a fixture class (e.g. `CategoryFixture`). According to the docs it implements the bundle's fixture interface and carries the bundle's class attribute (the FQCNs the docs give are listed under Gotchas — they are not part of `shopware/core`). Inject services through the constructor, e.g. `#[Autowire(service: 'category.repository')] private readonly EntityRepository $categoryRepository`, and write data in `load(): void` via `$this->categoryRepository->create($categories, Context::createDefaultContext())`.
3. Configure the attribute parameters:
   - `name` (string, e.g. `'category'`)
   - `priority` (`int`, default `0`) — higher runs earlier
   - `dependsOn` (`array`, default `[]`) — fixture class names that must run first
   - `groups` (`array`, default `['default']`) — group names for selective loading
4. Run fixtures:
   - `bin/console fixture:load` — all fixtures
   - `bin/console fixture:load --group=test-data` — one group
   - `bin/console fixture:list` — table of Order, Class, Priority, Groups, Depends On

Execution order rules: dependencies always run before dependents; among unrelated fixtures higher `priority` runs first; circular dependencies throw an exception.

Specialized loaders (constructor-injected into a fixture):

```php
$this->themeFixtureLoader->apply(
    (new ThemeFixtureDefinition('Shopware default theme'))
        ->config('sw-color-brand-primary', '#ff6900'));
$this->customFieldSetFixtureLoader->apply(
    (new CustomFieldSetFixtureDefinition('Product Specifications', 'product_specs'))
        ->relation('product')
        ->field((new CustomFieldFixtureDefinition('weight', CustomFieldTypes::FLOAT))->label('en-GB', 'Weight (kg)')));
$this->customerFixtureLoader->apply(
    (new CustomerFixtureDefinition('max.mustermann@example.com'))
        ->firstName('Max')->defaultBillingAddress([/* ... */])->addAddress('work', [/* ... */]));
```

- `ThemeFixtureLoader` handles theme discovery and recompilation and applies changes only when needed.
- `CustomFieldSetFixtureLoader` creates custom field sets and fields for an entity relation.
- `CustomerFixtureLoader` uses the email address as unique key and updates an existing customer on match.

## Essential identifiers

- `shopware/fixture-bundle`
- `fixture:load`, `fixture:load --group=<group>`, `fixture:list`
- `priority`, `dependsOn`, `groups`
- `ThemeFixtureLoader`, `ThemeFixtureDefinition`
- `CustomFieldSetFixtureLoader`, `CustomFieldSetFixtureDefinition`, `CustomFieldFixtureDefinition`
- `CustomerFixtureLoader`, `CustomerFixtureDefinition`

## Gotchas

- The docs name the interface `Shopware\Core\Framework\Test\TestCaseBase\FixtureInterface` and the attribute `Shopware\Core\Framework\Test\TestCaseBase\Fixture`. Neither exists in the installed `shopware/core`, `shopware/storefront` or administration code; they must come from the separately installed `shopware/fixture-bundle` package. Check that package's source for the actual namespaces before copying the `use` statements.
- The theme example uses `$this->mediaHelper` without injecting it; inject every service you use.
- Best practices from the source: design fixtures to be idempotent (re-runnable without duplicates), declare dependencies explicitly, keep one responsibility per fixture, use groups such as `test-data`, `demo-data`, `performance-test`.

## Code check (6.7.13.0)
- absent `Shopware\Core\Framework\Test\TestCaseBase\FixtureInterface` — not in the installed code index; provided (if at all) by the separate fixture-bundle package
- absent `Shopware\Core\Framework\Test\TestCaseBase\Fixture` — attribute class not in the installed code index; provided (if at all) by the separate fixture-bundle package
- unverified `fixture:load` — command lives in shopware/fixture-bundle, outside the checked vendor roots
- unverified `fixture:list` — command lives in shopware/fixture-bundle, outside the checked vendor roots
- unverified `ThemeFixtureLoader` — not in vendor/shopware core/storefront/administration; package out of scope
- unverified `CustomerFixtureLoader` — not in vendor/shopware core/storefront/administration; package out of scope
