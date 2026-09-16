# `dev-37` — expected answer

<!-- expected:start -->
| | |
| --- | --- |
| Case | `dev-37` · `dev` · `Testing` |
| Version | `6.7` |
| Status | **confirmed** — verified against shopware/core 6.7.13.0 |
| Reviewed | `2026-09-12` · run `cases-review-2026-09-12-0921-32-41` |
| Core version | `6.7.13.0` |

**Query:** How do I set up and run PHPUnit integration tests for my Shopware plugin, including tests that boot the kernel?

**Expected answer — every fact an answer must contain:**

1. The plugin root holds a `phpunit.xml` with `bootstrap="tests/TestBootstrap.php"` and the server variable `KERNEL_CLASS` set to `Shopware\Core\Kernel`, and `tests/TestBootstrap.php` chains `Shopware\Core\TestBootstrapper` → `addCallingPlugin()` → `addActivePlugins('<PluginName>')` → `setForceInstallPlugins(true)` → `bootstrap()` → `getClassLoader()`, then registers the plugin's `Tests\` PSR-4 namespace on that loader; `bin/console plugin:create` emits both files unconditionally. `[code: Framework/Plugin/Command/Scaffolding/stubs/test-bootstrap.stub:1-12, Framework/Plugin/Command/Scaffolding/stubs/phpunit-xml.stub:1-22, Framework/Plugin/Command/Scaffolding/Generator/TestsGenerator.php:18-46]`
2. A test that boots the kernel uses `KernelTestBehaviour` — `static::getContainer()` returns the `test.service_container`, in which the test kernel has made every non-abstract service public. `IntegrationTestBehaviour` is a pure composite of that trait plus `BasicTestData`, `Cache`, `DatabaseTransaction`, `Filesystem`, `RequestStack`, `Session` and `Translation` behaviours; `DatabaseTransactionBehaviour` opens and rolls back a DBAL transaction per test through PHPUnit `#[Before]`/`#[After]` attributes. `[code: Framework/Test/TestCaseBase/IntegrationTestBehaviour.php:5-15, Framework/Test/TestCaseBase/KernelTestBehaviour.php:12-32, Framework/Test/TestCaseBase/DatabaseTransactionBehaviour.php:18-51, Framework/Test/TestKernel.php:29-37]`
3. `TestBootstrapper::bootstrap()` never runs against the configured database: it appends `_test` to the `DATABASE_URL` path unless it already ends that way, and PHPUnit is not shipped by `shopware/core` (its `composer.json` has no `require-dev` and no phpunit entry) — the project or plugin must require the runner itself; a 6.7 project pins `phpunit/phpunit ^11.5`. `[code: TestBootstrapper.php:143-155, TestBootstrapper.php:47-77]`

**Official reference URL:** https://developer.shopware.com/docs/guides/development/testing/unit/php-unit.html
<!-- expected:end -->

## Evidence — code (decisive)

| fact | citation | excerpt |
| --- | --- | --- |
| `Shopware\Core\TestBootstrapper::bootstrap()` sets `PROJECT_ROOT`/`TEST_PROJECT_DIR`, loads the env file, forces `DATABASE_URL`, primes `KernelLifecycleManager` with the Composer class loader, optionally installs Shopware and the plugins, then shuts the kernel down again | `TestBootstrapper.php:47-77` | `KernelLifecycleManager::prepare($classLoader); … KernelLifecycleManager::ensureKernelShutdown();` |
| The database name is forcibly rewritten to end in `_test` | `TestBootstrapper.php:143-155` | `if (!str_ends_with($dbUrlParts['path'], '_test')) { $dbUrlParts['path'] .= '_test'; }` |
| `plugin:create` always emits `phpunit.xml` and `tests/TestBootstrap.php` (`hasCommandOption()` returns false) | `Framework/Plugin/Command/Scaffolding/Generator/TestsGenerator.php:18-46` | `$stubCollection->add($this->createPhpunitXml($configuration)); $stubCollection->add($this->createTestBootstrap($configuration));` |
| The scaffolded bootstrap chains `addCallingPlugin()` + `addActivePlugins()` + `setForceInstallPlugins(true)` and registers the `Tests\` PSR-4 namespace | `Framework/Plugin/Command/Scaffolding/stubs/test-bootstrap.stub:1-12` | `$loader = (new TestBootstrapper())->addCallingPlugin()->addActivePlugins('{{ className }}')->setForceInstallPlugins(true)->bootstrap()->getClassLoader();` |
| The scaffolded `phpunit.xml` sets `bootstrap="tests/TestBootstrap.php"`, `KERNEL_CLASS`, `APP_ENV=test`, `APP_DEBUG=1` | `Framework/Plugin/Command/Scaffolding/stubs/phpunit-xml.stub:1-22` | `<server name="KERNEL_CLASS" value="Shopware\Core\Kernel"/>` |
| `KERNEL_CLASS` is read by `KernelLifecycleManager::getKernelClass()`, defaulting to `Shopware\Core\Kernel` | `Framework/Test/TestCaseBase/KernelLifecycleManager.php:156-180` | `EnvironmentHelper::getVariable('KERNEL_CLASS', Kernel::class)` |
| `KernelTestBehaviour::getContainer()` returns `test.service_container`, throwing if it is absent | `Framework/Test/TestCaseBase/KernelTestBehaviour.php:12-32` | `throw new \RuntimeException('Unable to run tests against kernel without test.service_container');` |
| `IntegrationTestBehaviour` is a pure composite trait | `Framework/Test/TestCaseBase/IntegrationTestBehaviour.php:5-15` | `use BasicTestDataBehaviour; use CacheTestBehaviour; use DatabaseTransactionBehaviour; use KernelTestBehaviour; …` |
| Per-test transaction via PHPUnit 10+ attributes, not setUp/tearDown | `Framework/Test/TestCaseBase/DatabaseTransactionBehaviour.php:18-51` | `#[Before] public function startTransactionBefore(): void` |
| The test kernel forces every non-abstract definition public | `Framework/Test/TestKernel.php:29-37` | `$definition->setPublic(true);` |
| `addCallingPlugin()` walks up to a `composer.json` and reads `extra.shopware-plugin-class`, throwing if absent | `TestBootstrapper.php:202-237` | `throw new \RuntimeException('composer.json does not contain `extra.shopware-plugin-class`…');` |
| The project pins `phpunit/phpunit ^11.5` as a root `require-dev` | `composer.json:77-80` (project root) | `"phpunit/phpunit": "^11.5"` |
| Core ships PHPUnit extensions a plugin may register: FeatureFlag, Datadog, DatabaseDiff | `Test/PHPUnit/Extension/FeatureFlag/FeatureFlagExtension.php` | — |

Absences — things the code shows do **not** exist:

| claim checked | verdict | evidence |
| --- | --- | --- |
| `shopware/core` depends on PHPUnit, so installing core gives you a test runner | absent | `vendor/shopware/core/composer.json` has no `require-dev` and no phpunit entry anywhere |
| The scaffolded plugin `composer.json` adds phpunit to `require-dev` | absent | `composer.stub` has require/extra/autoload/autoload-dev only — no `require-dev` block |
| The plugin scaffold's `phpunit.xml` is current for the PHPUnit 6.7 runs on | stale | the stub declares the PHPUnit 9.3 XSD and the 9.x `<coverage><include>` layout; platform's own `phpunit.xml.dist` at v6.7.13.0 declares schema 11.5 and `<source><include>` |
| A `composer init:testdb` / `phpunit` composer script is available in a project install | absent | project `composer.json` declares only auto-scripts/post-install-cmd/post-update-cmd; none ships in `vendor/shopware/core` |

Test anchors, where found:

| what it shows | citation |
| --- | --- |
| a real integration test booting the kernel under the transaction wrapper | `https://github.com/shopware/shopware/blob/v6.7.13.0/tests/integration/Core/Framework/TestCaseBase/DatabaseTransactionBehaviourTest.php` |
| `IntegrationTestBehaviour` consumed with `SalesChannelApiTestBehaviour` and `static::getContainer()` | `Test/Integration/Traits/CustomerTestTrait.php:17-24` |

## Evidence — community (escalation only, never decisive)

| signal | version | state | source |
| --- | --- | --- | --- |
| Documented single `TestBootstrap.php` is integration-only; wrong for pure unit tests, broken for composer-installed plugin deps | unclear | open | https://github.com/shopware/docs/issues/2153 |
| `getPluginPath` only crawls `custom/plugins`, so composer/vendor-installed plugins are not found | 6.6 | closed | https://github.com/shopware/shopware/issues/11456 |
| Same hardcoded-path failure for `custom/static-plugins` | unclear | closed | https://github.com/shopware/shopware/issues/4787 |
| `bootstrap()` left a live kernel; PR #16443 appended `ensureKernelShutdown()` | 6.7 | closed | https://github.com/shopware/shopware/issues/16444 |
| Documented plugin `phpunit.xml` pins an old XSD and emits deprecation noise | unclear | closed | https://github.com/shopware/docs/issues/500 |

Escalations raised, and how each was settled:

| question | settled by | outcome |
| --- | --- | --- |
| Does `bootstrap()` shut the kernel down in 6.7 (PR #16443)? | code | yes — `KernelLifecycleManager::ensureKernelShutdown()` closes `bootstrap()` at `TestBootstrapper.php:47-77` |
| Do `addCallingPlugin()`, `addActivePlugins()`, `setForceInstall()`, `setForceInstallPlugins()`, `setPlatformEmbedded()`, `setEnableCommercial()`, `setClassLoader()` still exist? | code | yes — all present on the 6.7 fluent surface (`TestBootstrapper.php`, incl. `:293-300`) |
| Is `IntegrationTestBehaviour` still present and still pulling in Session/Kernel behaviours? | code | yes — composite at `Framework/Test/TestCaseBase/IntegrationTestBehaviour.php:5-15` |
| What PHPUnit schema does 6.7 target, versus the plugin template? | code | platform targets 11.5; the plugin stub still declares 9.3 — recorded as a staleness absence, kept out of the facts |
| Does `getPluginPath()` still resolve only against `custom/plugins`? | not settled | the code lane did not read that method; no fact asserts plugin-path resolution, so the point does not bear on the expected answer |

## Evidence — documentation (claims)

| claim | quote | citation | confirmed by code? |
| --- | --- | --- | --- |
| `phpunit.xml` goes in the plugin root | "create a file called `phpunit.xml` in the root directory of the plugin" | `guides/development/testing/unit/php-unit.md:20` | yes |
| `plugin:create` autogenerates it | "The `phpunit.xml` can be autogenerated for you with the `bin/console plugin:create` command" | `…/php-unit.md:22` | yes — `TestsGenerator.php:18-46` |
| The command also generates `tests/TestBootstrap.php` on `TestBootstrapper` | "This command will also generate a `TestBootstrap.php` file" | `…/php-unit.md:55-71` | yes — `test-bootstrap.stub` |
| Sample config sets `bootstrap` and `KERNEL_CLASS` | `<server name="KERNEL_CLASS" value="Shopware\Core\Kernel"/>` | `…/php-unit.md:38` | yes — `phpunit-xml.stub` |
| `IntegrationTestBehaviour` gives per-test transaction and cache clearing | "automatically setting up a database transaction or clearing the cache before each test" | `…/php-unit.md:79, 89` | yes — composite of `DatabaseTransactionBehaviour` + `CacheTestBehaviour` |
| `KernelTestBehaviour` is the trait when a container DB connection is needed | "Use the `KernelTestBehaviour` trait because a database connection from the container is needed." | `…/php-unit.md:130` | yes for the trait; the migration-test framing is not confirmed |
| Running PHPUnit requires the flex `dev-tools` package, `composer require --dev dev-tools` | "To run PHPunit tests install the flex template dev-tools package via Composer." | `…/php-unit.md:210-213` | no — not confirmed by code; PHPUnit is a plain root `require-dev` |
| A `phpunit` composer script launches the suite | "\| `phpunit` \| Launches the PHP unit test-suit \|" | `resources/references/core-reference/composer-commands-reference.md:78` | no — no such script in the project or in core |
| Migration tests should avoid `IntegrationTestBehaviour`/`KernelTestBehaviour` and a booted kernel | "you should not use any of the \"legacy test behaviours\"" | `resources/guidelines/code/core/database-migations.md:178-180` | not examined by the code lane; contradicts `php-unit.md:130` |

## Doc/code divergence

| docs claim | code shows | citation |
| --- | --- | --- |
| PHPUnit can only be run after installing the flex `dev-tools` package (`composer require --dev dev-tools`, elsewhere `shopware/dev-tools`) | `shopware/core` ships no PHPUnit dependency at all and no composer test script; the project simply requires `phpunit/phpunit ^11.5` in its own `require-dev` | `vendor/shopware/core/composer.json`, project `composer.json:77-80` |
| A `phpunit` composer script launches the suite | the project declares only auto-scripts/post-install-cmd/post-update-cmd; no `phpunit` or `init:testdb` script ships in core | project `composer.json:56-66` |
| The documented sample `phpunit.xml` is current 6.7 guidance | the shipped stub (and the doc sample) still declare the PHPUnit 9.3 XSD and the 9.x `<coverage><include>` shape, while platform v6.7.13.0 runs PHPUnit 11.5 with `<source>` and `<extensions><bootstrap>` | `Framework/Plugin/Command/Scaffolding/stubs/phpunit-xml.stub:3-10` vs `https://github.com/shopware/shopware/blob/v6.7.13.0/phpunit.xml.dist` |
| The docs contradict themselves on migration tests: `php-unit.md:130` uses `KernelTestBehaviour` + `getContainer()`, `database-migations.md:178-180` forbids both | the code lane did not examine migration-test guidance; no fact in this case rests on it | `php-unit.md:130-146`, `database-migations.md:178-180` |

## Change log

| old fact (verbatim) | action | why |
| --- | --- | --- |
| "`phpunit.xml` sits in the plugin root with `bootstrap=\"tests/TestBootstrap.php\"` and the server variable `KERNEL_CLASS` set to `Shopware\Core\Kernel`; `TestBootstrap.php` uses `Shopware\Core\TestBootstrapper` with `addCallingPlugin()`, `addActivePlugins(...)` and `setForceInstallPlugins(true)`." | kept, extended | confirmed by the scaffolding stubs; extended with the PSR-4 registration and the unconditional generation |
| "Integration tests use the `IntegrationTestBehaviour` trait (transaction plus cache clearing per test), while migration tests use `KernelTestBehaviour` and call the migration's `update($conn)` directly." | rewritten | first half confirmed; the migration-test half is unconfirmed by code and contradicted inside the docs themselves, and is outside the query's scope |
| "Tests are run with `./vendor/bin/phpunit --configuration=\"custom/plugins/SwagBasicExample\" --testsuite \"migration\"`, and the `dev-tools` flex package (`composer require --dev dev-tools`) is required to run PHPUnit at all." | removed | code disproves the dev-tools requirement — core ships no PHPUnit dependency and no composer test script; the runner is an ordinary project/plugin `require-dev` |
| — | added | the `_test` database rewrite in `TestBootstrapper` and the fact that PHPUnit must be required by the project decide whether an answer is usable |
