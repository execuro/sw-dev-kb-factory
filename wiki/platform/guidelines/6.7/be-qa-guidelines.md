---
id: platform/guidelines/6.7/be-qa-guidelines.md
title: Backend QA guidelines
docType: guideline
version: "6.7"
summary: Rules for PHPUnit unit and integration tests, API test contexts, queue and cache state, migration and versioned DAL tests, and Store code quality.
keywords: ["phpunit", "unit tests", "integration tests", "mocks", "stubs", "testbootstrapper", "integrationtestbehaviour", "migration test", "versioning", "message queue", "store review", "code quality"]
sources: [{url: "https://developer.shopware.com/docs/resources/guidelines/code/core/unit-tests.html", hash: "4765adb1ddd045550844bd777945039efc4f1b3adc1aade8f010f8259470d9a6"}, {url: "code:administration/Resources/app/administration/technical-docs/07-testing/**", hash: "b3fd893024c1e3bcb2f90f7e5fb25aae83dd446c31641f549f2c22e3ff5cb30f"}, {url: "https://developer.shopware.com/docs/guides/development/testing/unit/php-unit.html", hash: "b57f11e9254779030426000f27dcb3f6ed8c11c5c87113c9947a207997cd22d7"}, {url: "https://developer.shopware.com/docs/guides/development/testing/store/quality-guidelines.html", hash: "24d766368b66e9310db561b64d2baec69f67ec7f1f0b465bb39f417daa18b7f7"}, {url: "https://developer.shopware.com/docs/guides/development/testing/store/code-quality.html", hash: "552916b1fb0afcc9409bc954fd378fbb0f1d50378793ef8de005e5054aedc0ed"}]
codeVersion: "6.7.13.0+8da531fe"
lastBuilt: 2026-09-15
---

## phpunit unit test conventions

- Test every use case of a service, including failure paths. Coverage percentage alone is not the goal.
- Give every test class `#[Package('…')]` with the same package as the production domain it covers, so CI failures reach the owning team.
- Declare exactly one `#[CoversClass]` per test file. If a file covers several classes, split it.
- Give each new source file focused unit tests. If it is covered by integration tests on purpose, mark it `@codeCoverageIgnore` and add a `@see \Shopware\Tests\Integration\…` docblock line pointing to a dedicated integration test. Use the fully qualified name and do not import the class. `CodeCoverageIgnoreEvaluationRule` rejects the annotation on methods that branch, mutate values, or call guards on `$this`/parameters, unless that `@see` is present.
- Create doubles without `->expects()` with `createStub()`, never `createMock()`. Stubs have no `->with()`, so assert arguments inside `willReturnCallback()`. Type helper parameters that receive stubs as `Foo&Stub`.
- Never behaviour-mock the Doctrine DBAL `Connection` by asserting SQL text or parameters. Move SQL into adapter classes and cover them with integration tests. Unit-test the business logic against a narrow abstraction or a hand-written double such as `StaticEntityRepository` or `StaticSystemConfigService`.
- If a write is the only observable effect, do this in order: extract the decision into a collaborator, write an integration test, or capture the executed statements and assert on the written values (never on SQL text). If you use a `Connection` double, its `transactional()` must actually call the closure.
- Merge near-duplicate tests into one data provider with named cases. Use named arguments for opaque literals passed to builders.
- Use `expectExceptionObject()` or `expectException*()` instead of `try/catch`.
- Never call private or protected methods of Shopware classes through reflection. Test through the public API instead. Reading reflection metadata is fine.
- Never let code under test call `exit()`/`die()`. With a console `Application`, call `setAutoExit(false)` or use `CommandTester`.
- Keep fixture classes used by a single test in that test file. Tests must be paratest-compatible and must not depend on artifacts left by other tests.

Enforced by: PHPStan

Read more: https://developer.shopware.com/docs/resources/guidelines/code/core/unit-tests.html

## plugin phpunit setup

- Put a `phpunit.xml` in the plugin root with `bootstrap="tests/TestBootstrap.php"`, `KERNEL_CLASS` set to `Shopware\Core\Kernel` and `APP_ENV=test`. `bin/console plugin:create` generates both files.
- Bootstrap with `(new TestBootstrapper())->addCallingPlugin()->addActivePlugins('<Plugin>')->setForceInstallPlugins(true)->bootstrap()`. `setForceInstallPlugins(true)` installs and activates the plugin even when the test database already exists.
- To override a dangerous service (file deletion, external API) only in tests, add `Resources/config/services_test.php`. Do not branch on the environment in production code.
- Run tests with `./vendor/bin/phpunit --configuration="custom/plugins/<Plugin>"`, and add `--testsuite` or `--filter` to narrow the run.

Read more: https://developer.shopware.com/docs/guides/development/testing/unit/php-unit.html

## integration traits and api contexts

- Use `IntegrationTestBehaviour` for kernel-backed tests. It combines `KernelTestBehaviour`, `DatabaseTransactionBehaviour`, `CacheTestBehaviour`, `FilesystemBehaviour` and others.
- `DatabaseTransactionBehaviour` opens a transaction before each test and rolls it back afterwards. It fails the test when the nesting level is not 1, so close every transaction you open.
- Build a system-scope DAL context with `Context::createDefaultContext()` (marked `@internal`, test and CLI use only).
- For Admin API tests, use `AdminFunctionalTestBehaviour` and get an authorised client via `getBrowser()`. Pass scopes or ACL permissions to test privilege checks.
- For Store API tests, use `SalesChannelFunctionalTestBehaviour`. Use `createSalesChannelContext()` for a `SalesChannelContext` and `login()` for a customer session.
- Register listeners dynamically through `EventDispatcherBehaviour::addEventListener()`, which removes them after each test. Never leave a listener attached.

Read more: https://developer.shopware.com/docs/guides/development/testing/unit/php-unit.html

## async and cache assertions

- Cache and service state are reset automatically: `CacheTestBehaviour::clearCacheData()` runs before and after each test, clears through `TestCacheClearer` and resets `services_resetter`. Do not add manual cache clears for isolation.
- For message queue assertions, use `QueueTestBehaviour`. It empties `messenger_messages` and resets the test bus around each test.
- Assert that a message was dispatched with `getDispatchedMessageCount(<MessageClass>::class)`. Call `runWorker()` only when the test needs the handler side effects.
- In a callback or listener that observes async behaviour, assert the arguments inside the callback. Keep only a minimal flag, counter or captured value outside it.

Read more: https://developer.shopware.com/docs/resources/guidelines/code/core/unit-tests.html

## migration tests

- Implement `MigrationStep::update()` for non-destructive changes and `updateDestructive()` for destructive ones. Test each separately.
- Use `KernelTestBehaviour` to get the `Connection` from the container. Assert that running `update()` again on an existing schema leaves `SHOW CREATE TABLE` unchanged, and that it recreates a dropped table.
- Use DBAL 3+ fetch APIs (`fetchAssociative()`, `fetchOne()`). The `fetchAssoc()`/`fetchColumn()` calls in older examples no longer exist.

Read more: https://developer.shopware.com/docs/guides/development/testing/unit/php-unit.html

Read more: platform/dev/6.7/guides/plugins/plugins/database/database-migrations.md

## versioned entity tests

- Test versioned entities on a draft: `$versionId = $repository->createVersion($id, $context)`, then write and read with `$context->createWithVersionId($versionId)`.
- Assert that the live row (`Defaults::LIVE_VERSION`) stays unchanged until `$repository->merge($versionId, $context)`, then assert the merged state.

Read more: platform/dev/6.7/guides/plugins/plugins/framework/data-handling/versioning-entities.md

## store code quality checks

- Before submitting to the Store, pass the automated review (PHPStan, SonarQube) and test on the highest supported Shopware version.
- Never ship `die`, `exit` or `var_dump`. They are SonarQube blockers.
- Ship production artifacts only: no dev-only files, no unused resources, no `composer.lock`. Declare dependencies in `composer.json`.
- Write logs only under `/var/log/`, as `MyExtension-Year-Month-Day.log`. Payment extensions must use the plugin logger. Clean custom log tables on a schedule and keep at most six months of data.
- Ship readable, unminified JavaScript sources in a separate folder next to the compiled assets.
- Verify `postMessage()` origins and never use `*` as the target origin.

Enforced by: review

Read more: https://developer.shopware.com/docs/guides/development/testing/store/code-quality.html

Read more: https://developer.shopware.com/docs/guides/development/testing/store/quality-guidelines.html

## Code check (6.7.13.0+8da531fe)

- absent `Shopware\Core\Test\PHPUnit\CompletionGuard` — not present in this codeVersion
- confirmed `Package` — attribute class for package ownership — core/Framework/Log/Package.php:16
- confirmed `CodeCoverageIgnoreEvaluationRule` — PHPStan rule — core/DevOps/StaticAnalyze/PHPStan/Rules/CodeCoverageIgnoreEvaluationRule.php:32
- confirmed `NoCreateMockWithoutExpectationsRule` — PHPStan rule — core/DevOps/StaticAnalyze/PHPStan/Rules/Tests/NoCreateMockWithoutExpectationsRule.php:39
- confirmed `StaticEntityRepository` — repository test double — core/Test/Stub/DataAbstractionLayer/StaticEntityRepository.php:31
- confirmed `StaticSystemConfigService` — config test double — core/Test/Stub/SystemConfigService/StaticSystemConfigService.php:10
- confirmed `setForceInstallPlugins` — TestBootstrapper option — core/TestBootstrapper.php:286
- confirmed `IntegrationTestBehaviour` — composite test trait — core/Framework/Test/TestCaseBase/IntegrationTestBehaviour.php:5
- confirmed `DatabaseTransactionBehaviour` — rolls back after each test — core/Framework/Test/TestCaseBase/DatabaseTransactionBehaviour.php:14
- confirmed `Context::createDefaultContext` — internal system context — core/Framework/Context.php:119
- confirmed `getBrowser` — authorised Admin API client — core/Framework/Test/TestCaseBase/AdminApiTestBehaviour.php:273
- confirmed `createSalesChannelContext` — Store API context helper — core/Framework/Test/TestCaseBase/SalesChannelApiTestBehaviour.php:91
- confirmed `addEventListener` — auto-removed listener — core/Framework/Test/TestCaseBase/EventDispatcherBehaviour.php:15
- confirmed `clearCacheData` — before/after cache reset — core/Framework/Test/TestCaseBase/CacheTestBehaviour.php:14
- confirmed `getDispatchedMessageCount` — queue assertion helper — core/Framework/Test/TestCaseBase/QueueTestBehaviour.php:57
- confirmed `updateDestructive` — destructive migration hook — core/Framework/Migration/MigrationStep.php:38
- confirmed `createVersion` — DAL version draft — core/Framework/DataAbstractionLayer/EntityRepository.php:161
- confirmed `Defaults::LIVE_VERSION` — live version id — core/Defaults.php:20
- unverified `setAutoExit` — vendor/symfony, out of scope
