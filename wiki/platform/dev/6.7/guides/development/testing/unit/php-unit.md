---
id: platform/dev/6.7/guides/development/testing/unit/php-unit.md
title: PHP Unit Testing
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/development/testing/unit/php-unit.html
sourceHash: e5cf18f79a2ee401a2c5402e0b6ad1ca32cdf758
codeCheckedAgainst: "6.7.13.0"
keywords: ["phpunit", "plugin tests", "phpunit.xml", "TestBootstrap.php", "TestBootstrapper", "setForceInstallPlugins", "IntegrationTestBehaviour", "KernelTestBehaviour", "migration test", "services_test.php", "plugin:create", "integration test"]
summary: "PHPUnit for Shopware plugins: phpunit.xml, TestBootstrapper, IntegrationTestBehaviour/KernelTestBehaviour, migration tests, running suites."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md", "platform/dev/6.7/guides/plugins/plugins/database/database-migrations.md", "platform/dev/6.7/guides/installation/project-overview.md"]
---
## What it is

Setting up and running PHPUnit tests for a Shopware 6 plugin: the `phpunit.xml`, the `tests/TestBootstrap.php` built on `Shopware\Core\TestBootstrapper`, integration and migration test examples using Shopware's test traits, and test-only service overrides.

## When to use

- Adding integration or migration tests to a plugin (requires an existing plugin, see `platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md`).
- Running a single test suite, class or method of a plugin from the project root.

## Key steps / config

1. **Generate config.** `bin/console plugin:create` scaffolds `<plugin root>/phpunit.xml` and `<plugin root>/tests/TestBootstrap.php`. The generated `phpunit.xml` skeleton:
   ```xml
   <phpunit xsi:noNamespaceSchemaLocation="https://schema.phpunit.de/9.3/phpunit.xsd"
            bootstrap="tests/TestBootstrap.php" executionOrder="random">
       <coverage><include><directory>./src/</directory></include></coverage>
       <php>
           <server name="KERNEL_CLASS" value="Shopware\Core\Kernel"/>
           <env name="APP_ENV" value="test"/>
           <env name="SYMFONY_DEPRECATIONS_HELPER" value="weak"/>
       </php>
       <testsuites>
           <testsuite name="<PluginName> Testsuite"><directory>tests</directory></testsuite>
       </testsuites>
   </phpunit>
   ```
   Add further `<testsuite>` entries (e.g. `migration` pointing at your migration test directory) as needed.
2. **Bootstrap.**
   ```php
   use Shopware\Core\TestBootstrapper;
   $loader = (new TestBootstrapper())
       ->addCallingPlugin()
       ->addActivePlugins('BasicExample')
       ->setForceInstallPlugins(true)
       ->bootstrap()
       ->getClassLoader();
   $loader->addPsr4('Swag\\BasicExample\\Tests\\', __DIR__);
   ```
   `setForceInstallPlugins(true)` installs and activates the plugin even when the test database already exists. `addCallingPlugin()` finds the plugin via the nearest `composer.json` and its `extra.shopware-plugin-class`.
3. **Integration test.** Extend `PHPUnit\Framework\TestCase` and `use Shopware\Core\Framework\Test\TestCaseBase\IntegrationTestBehaviour;` — it bundles database transaction, cache, kernel, request stack, session and translation behaviours.
4. **Migration test.** Extend `TestCase`, `use Shopware\Core\Framework\Test\TestCaseBase\KernelTestBehaviour;`, fetch `Connection::class` via `$this->getContainer()`, run `$migration->update($conn)` and compare `SHOW CREATE TABLE` output before/after (example test `Migration1611740369ExampleDescriptionTest`).
5. **Mock services.** Create `<plugin root>/Resources/config/services_test.php` to override arguments, aliases or parameters of `services.php` in the test environment only.
6. **Run** from the project root:
   - `./vendor/bin/phpunit --configuration="custom/plugins/SwagBasicExample" --testsuite "migration"`
   - all suites: omit `--testsuite`
   - one class/method: `--filter testNoChanges` or `--filter Migration1611740369ExampleDescriptionTest`
7. **Flex template:** `composer require --dev dev-tools` provides PHPUnit.

## Essential identifiers

- `Shopware\Core\TestBootstrapper` (`addCallingPlugin`, `addActivePlugins`, `setForceInstallPlugins`, `bootstrap`, `getClassLoader`)
- `Shopware\Core\Framework\Test\TestCaseBase\IntegrationTestBehaviour`
- `Shopware\Core\Framework\Test\TestCaseBase\KernelTestBehaviour`
- `KERNEL_CLASS`, `APP_ENV=test`, `SYMFONY_DEPRECATIONS_HELPER`
- `phpunit.xml`, `tests/TestBootstrap.php`, `Resources/config/services_test.php`
- `bin/console plugin:create`, `./vendor/bin/phpunit`

## Gotchas

- The docs' `phpunit.xml` shows suites `migration` (`Migration/Test`) and `Example Testsuite` (`Test`); the file `plugin:create` generates in 6.7 contains only one suite `<PluginName> Testsuite` over `tests`. The `--testsuite "migration"` example only works after you add that suite yourself.
- `KernelTestBehaviour::getContainer()` returns the `test.service_container` and throws if the kernel has none.
- The migration example uses `fetchAssoc`/`fetchColumn` on the DBAL connection; these are Doctrine DBAL methods not verified against the installed DBAL version.

## Code check (6.7.13.0)
- confirmed `TestBootstrapper` — class exists in core root namespace — vendor/shopware/core/TestBootstrapper.php:22
- confirmed `TestBootstrapper::addCallingPlugin()` — resolves plugin from composer.json `extra.shopware-plugin-class` — vendor/shopware/core/TestBootstrapper.php:202
- confirmed `TestBootstrapper::addActivePlugins()` — variadic plugin names — vendor/shopware/core/TestBootstrapper.php:190
- confirmed `TestBootstrapper::setForceInstallPlugins()` — fluent setter — vendor/shopware/core/TestBootstrapper.php:286
- confirmed `IntegrationTestBehaviour` — trait composing KernelTestBehaviour, DatabaseTransactionBehaviour and others — vendor/shopware/core/Framework/Test/TestCaseBase/IntegrationTestBehaviour.php:5
- confirmed `KernelTestBehaviour::getContainer()` — protected static, returns test.service_container — vendor/shopware/core/Framework/Test/TestCaseBase/KernelTestBehaviour.php:20
- confirmed `tests/TestBootstrap.php` — generated by plugin:create scaffolding — vendor/shopware/core/Framework/Plugin/Command/Scaffolding/Generator/TestsGenerator.php:62
- corrected `testsuite` — docs: suites `migration` and `Example Testsuite`; stub generates one `{{ className }} Testsuite` over `tests` — vendor/shopware/core/Framework/Plugin/Command/Scaffolding/stubs/phpunit-xml.stub:19
- confirmed `setForceInstallPlugins` — present in generated bootstrap stub — vendor/shopware/core/Framework/Plugin/Command/Scaffolding/stubs/test-bootstrap.stub:8
- unverified `fetchAssoc` — Doctrine DBAL method, vendor/doctrine out of scope
