---
id: platform/dev/6.7/guides/development/testing/unit/php-unit.md
title: PHP Unit Testing
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/development/testing/unit/php-unit.html
sourceHash: e5cf18f79a2ee401a2c5402e0b6ad1ca32cdf758
codeCheckedAgainst: "6.7.15.1"
keywords: ["phpunit", "php unit tests", "plugin tests", "phpunit.xml", "TestBootstrapper", "TestBootstrap.php", "IntegrationTestBehaviour", "KernelTestBehaviour", "migration test", "services_test.php", "bin/console plugin:create", "setForceInstallPlugins", "./vendor/bin/phpunit"]
summary: PHPUnit for Shopware plugins - phpunit.xml and TestBootstrapper setup, IntegrationTestBehaviour/KernelTestBehaviour tests, service mocking, run commands.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md", "platform/dev/6.7/guides/plugins/plugins/database/database-migrations.md", "platform/dev/6.7/guides/installation/project-overview.md"]
---
## What it is

How to set up and run PHPUnit tests for a Shopware 6 plugin: the `phpunit.xml`, the `TestBootstrapper`-based bootstrap file, integration and migration test examples, test-only service overrides, and the CLI invocations.

## When to use

When a plugin (see [Plugin Base Guide](platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md)) needs automated PHP tests — e.g. checking that all plugin classes are instantiable, or testing a [migration](platform/dev/6.7/guides/plugins/plugins/database/database-migrations.md).

## Key steps / config

1. **Generate config**: `bin/console plugin:create` scaffolds `<plugin root>/phpunit.xml` and `<plugin root>/tests/TestBootstrap.php`. Generated `phpunit.xml` shape (namespace attribute elided):

```xml
<phpunit xsi:noNamespaceSchemaLocation="https://schema.phpunit.de/9.3/phpunit.xsd"
         bootstrap="tests/TestBootstrap.php" executionOrder="random">
    <coverage><include><directory>./src/</directory></include></coverage>
    <php>
        <ini name="error_reporting" value="-1"/>
        <server name="KERNEL_CLASS" value="Shopware\Core\Kernel"/>
        <env name="APP_ENV" value="test"/>
        <env name="APP_DEBUG" value="1"/>
        <env name="SYMFONY_DEPRECATIONS_HELPER" value="weak"/>
    </php>
    <testsuites><testsuite name="<PluginName> Testsuite"><directory>tests</directory></testsuite></testsuites>
</phpunit>
```

   Add further `<testsuite>` entries (e.g. one named `migration`) yourself if you want to run suites separately.
2. **Bootstrap** (`tests/TestBootstrap.php`):

```php
$loader = (new \Shopware\Core\TestBootstrapper())
    ->addCallingPlugin()
    ->addActivePlugins('BasicExample')
    ->setForceInstallPlugins(true)
    ->bootstrap()
    ->getClassLoader();
$loader->addPsr4('Swag\\BasicExample\\Tests\\', __DIR__);
```

   `setForceInstallPlugins(true)` makes sure the plugin is installed and active even if the test database was built beforehand.
3. **Integration test**: extend `PHPUnit\Framework\TestCase` and `use Shopware\Core\Framework\Test\TestCaseBase\IntegrationTestBehaviour;` — it bundles kernel access, a database transaction per test, cache clearing and more. The doc's example mocks every plugin class (via `getMockBuilder(...)->disableOriginalConstructor()`) to detect missing core classes.
4. **Migration test**: extend `TestCase`, `use Shopware\Core\Framework\Test\TestCaseBase\KernelTestBehaviour;`, get `Doctrine\DBAL\Connection` from the container (`getContainer()->get(Connection::class)`), run `$migration->update($conn)` and compare `SHOW CREATE TABLE` output before/after (idempotency), or drop the table and assert `update()` recreates it.
5. **Mock services**: create `<plugin root>/Resources/config/services_test.php` to override arguments, aliases, or parameters of `<plugin root>/Resources/config/services.php` in the test environment only.
6. **Run** (from the project root):
   - `./vendor/bin/phpunit --configuration="custom/plugins/SwagBasicExample" --testsuite "migration"`
   - all suites: `./vendor/bin/phpunit --configuration="custom/plugins/SwagBasicExample"`
   - single class/method: `... --filter testNoChanges` or `--filter Migration1611740369ExampleDescriptionTest`
7. **Flex template**: install the dev tooling with `composer require --dev dev-tools` (see [project template](platform/dev/6.7/guides/installation/project-overview.md)).

## Essential identifiers

- `Shopware\Core\TestBootstrapper` — `addCallingPlugin()`, `addActivePlugins()`, `setForceInstallPlugins()`, `bootstrap()`, `getClassLoader()`
- `Shopware\Core\Framework\Test\TestCaseBase\IntegrationTestBehaviour`, `Shopware\Core\Framework\Test\TestCaseBase\KernelTestBehaviour`
- `KERNEL_CLASS` = `Shopware\Core\Kernel`, `APP_ENV=test`
- `services_test.php`, `bin/console plugin:create`, `./vendor/bin/phpunit`

## Gotchas

- The doc's `phpunit.xml` lists suites `migration` (`Migration/Test`) and `Example Testsuite` (`Test`) with tests under `src/Test`; the scaffolded file has a single suite pointing at `tests/`, and the bootstrap registers the `<Namespace>\Tests\` PSR-4 prefix for `tests/`. Align directories, suite names and namespaces before using `--testsuite "migration"`.
- `KernelTestBehaviour::getContainer()` is `protected static` in 6.7 (`static::getContainer()` works; `$this->getContainer()` also resolves).
- The migration example uses `fetchAssoc`/`fetchColumn`, which are Doctrine DBAL APIs not verified here; check them against the installed DBAL version.

## Code check (6.7.15.1)
- confirmed `TestBootstrapper::addCallingPlugin()` — fluent setter — vendor/shopware/core/TestBootstrapper.php:206
- confirmed `TestBootstrapper::addActivePlugins()` — variadic plugin names — vendor/shopware/core/TestBootstrapper.php:194
- confirmed `TestBootstrapper::setForceInstallPlugins()` — bool flag — vendor/shopware/core/TestBootstrapper.php:290
- confirmed `TestBootstrapper::getClassLoader()` — returns the Composer ClassLoader — vendor/shopware/core/TestBootstrapper.php:102
- confirmed `IntegrationTestBehaviour` — composes KernelTestBehaviour, DatabaseTransactionBehaviour, CacheTestBehaviour and others — vendor/shopware/core/Framework/Test/TestCaseBase/IntegrationTestBehaviour.php:5
- confirmed `KernelTestBehaviour::getContainer()` — `protected static` — vendor/shopware/core/Framework/Test/TestCaseBase/KernelTestBehaviour.php:20
- confirmed `KERNEL_CLASS` — scaffold sets `Shopware\Core\Kernel` — vendor/shopware/core/Framework/Plugin/Command/Scaffolding/stubs/phpunit-xml.stub:13
- corrected `testsuite` — docs: suites `migration` and `Example Testsuite`; scaffold has one `<PluginName> Testsuite` on `tests` — vendor/shopware/core/Framework/Plugin/Command/Scaffolding/stubs/phpunit-xml.stub:19
- confirmed `plugin:create` — command generating phpunit.xml and tests/TestBootstrap.php — vendor/shopware/core/Framework/Plugin/Command/PluginCreateCommand.php:22
- unverified `Connection::fetchAssoc` — Doctrine DBAL, outside the checked roots
