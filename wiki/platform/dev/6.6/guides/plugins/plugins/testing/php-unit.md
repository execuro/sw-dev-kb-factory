---
id: platform/dev/6.6/guides/plugins/plugins/testing/php-unit.md
title: PHP unit testing
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/testing/php-unit.html
sourceHash: a0cc4d215700a09b584011b8b6772c0132bc13af
links:
  - platform/dev/6.6/guides/installation/template.md
keywords: ["phpunit", "phpunit.xml", "TestBootstrap.php", "IntegrationTestBehaviour", "KernelTestBehaviour", "plugin:create", "TestBootstrapper", "services_test", "dev-tools", "migration test", "phpunit filter"]
summary: How to configure PHPUnit for a plugin, write integration and migration tests, mock services, and run tests via vendor/bin/phpunit.
lastBuilt: 2026-09-15
---

## What it is

Guide to setting up and writing PHPUnit tests for Shopware plugins: configuration, an integration test example, a migration test example, service mocking, and running tests.

## When to use

When a plugin needs automated PHP-level tests (unit, integration, or migration tests).

## Key steps / config

`bin/console plugin:create` autogenerates `phpunit.xml`:

```xml
<phpunit xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:noNamespaceSchemaLocation="https://schema.phpunit.de/9.3/phpunit.xsd"
         bootstrap="tests/TestBootstrap.php"
         executionOrder="random">
    <testsuites>
        <testsuite name="migration"><directory>Migration/Test</directory></testsuite>
        <testsuite name="Example Testsuite"><directory>Test</directory></testsuite>
    </testsuites>
</phpunit>
```

Generated `TestBootstrap.php` uses `Shopware\Core\TestBootstrapper`:

```php
$loader = (new TestBootstrapper())
    ->addCallingPlugin()
    ->addActivePlugins('BasicExample')
    ->setForceInstallPlugins(true)
    ->bootstrap()
    ->getClassLoader();
```

Integration test uses `Shopware\Core\Framework\Test\TestCaseBase\IntegrationTestBehaviour`; migration test uses `Shopware\Core\Framework\Test\TestCaseBase\KernelTestBehaviour`.

Override services only in tests via `<plugin root>/Resources/config/services_test.{xml|yml}`, which overrides `services.{xml|yml}` for the test environment.

Run tests:

```shell
./vendor/bin/phpunit --configuration="custom/plugins/SwagBasicExample" --testsuite "migration"
./vendor/bin/phpunit --configuration="custom/plugins/SwagBasicExample" --filter testNoChanges
```

Install the flex `dev-tools` package to run PHPUnit tests:

```shell
composer require --dev dev-tools
```

## Essential identifiers

- `phpunit.xml`, `TestBootstrap.php`
- `Shopware\Core\TestBootstrapper`
- `Shopware\Core\Framework\Test\TestCaseBase\IntegrationTestBehaviour`
- `Shopware\Core\Framework\Test\TestCaseBase\KernelTestBehaviour`
- `Resources/config/services_test.{xml|yml}`
- `bin/console plugin:create`

## Gotchas

- `setForceInstallPlugins(true)` ensures the plugin is installed/active even if the test DB was already built.
- `services_test.{xml|yml}` only takes effect in the test environment, letting you mock services like file deletion or external API calls safely.
