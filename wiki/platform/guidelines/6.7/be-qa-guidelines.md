---
id: platform/guidelines/6.7/be-qa-guidelines.md
title: Backend QA guidelines
docType: guideline
version: "6.7"
summary: PHPUnit rules for Shopware 6.7 backend code - unit vs integration, doubles, events, API browsers, queues, migrations, versions, store review checks
keywords: ["phpunit", "unit test", "integration test", "coversclass", "createstub", "staticentityrepository", "integrationtestbehaviour", "migration test", "queuetestbehaviour", "store api", "admin api", "versioning", "code quality", "phpstan"]
sources: [{url: "https://developer.shopware.com/docs/resources/guidelines/code/core/unit-tests.html", hash: "0591387dd188020205a0e33d46bb7a0ab63988e312b2415ab1df5df9fc9b7b28"}, {url: "code:administration/Resources/app/administration/technical-docs/07-testing/**", hash: "524ca568868967bb5242a755e23f50af2e267a0788c2d704ab36a9db49c8d621"}, {url: "https://developer.shopware.com/docs/guides/development/testing/unit/php-unit.html", hash: "b57f11e9254779030426000f27dcb3f6ed8c11c5c87113c9947a207997cd22d7"}, {url: "https://developer.shopware.com/docs/guides/development/testing/store/quality-guidelines.html", hash: "24d766368b66e9310db561b64d2baec69f67ec7f1f0b465bb39f417daa18b7f7"}, {url: "https://developer.shopware.com/docs/guides/development/testing/store/code-quality.html", hash: "552916b1fb0afcc9409bc954fd378fbb0f1d50378793ef8de005e5054aedc0ed"}]
codeVersion: "6.7.15.1+7d4303db"
lastBuilt: 2026-10-21
---

## unit test structure

- Test every use case of a service, including failure paths, not just line coverage.
- Declare `#[Package('…')]` on every test class with the package of the covered domain, and exactly one `#[CoversClass]` per file; split files covering several classes. Enforced by: review (Danger)
- Merge tests differing only in input and expectation into one data-provider test; name each case as a sentence.
- Pass opaque literals to builders as named arguments (`points: 0, status: false`).
- Keep a fixture class used by one test file below the test class in that file; move it to `_fixtures` once a second test needs it.
- Use `expectExceptionObject()` / `expectException*()`, never a manual `try/catch`.
- Keep tests order-independent and paratest-compatible; remove dynamic listeners and roll back data or schema changes in teardown.
- Do not compose helpers into a new unit test through a trait. Put builders in a static fixture class (e.g. `Shopware\Core\Test\Checkout\CartRuleFixture`) and doubles in a `Stub/` folder next to the test. Only state-restoring lifecycle traits (`EnvTestBehaviour`, `EventDispatcherBehaviour`, Symfony's `ClockSensitiveTrait`) are allowed. Enforced by: review (Danger)

Read more: https://developer.shopware.com/docs/resources/guidelines/code/core/unit-tests.html

## test doubles

- Prefer, in order: the real implementation, a static double (`StaticEntityRepository`, `StaticSystemConfigService`, `CollectingEventDispatcher`), then a PHPUnit double.
- Use `createStub()` for a double that never gets `->expects()`. A stub checks arguments in `willReturnCallback()` (`->with()` is mock-only); helpers type it `Foo&Stub`, not `MockObject`. Enforced by: PHPStan (`shopware.createMockWithoutExpectations`)
- Never behaviour-mock DBAL `Connection` by asserting SQL text or parameters; isolate SQL in adapters covered by integration tests.
- Assert observed arguments inside the callback; keep only minimal outside state (a called flag, a counter).
- Never invoke a private/protected method of a Shopware class via reflection (`invoke()`, `invokeArgs()`, `setAccessible()`); test via the public API or extract a collaborator. Reading reflection metadata stays allowed. Enforced by: PHPStan (`shopware.reflectionOnNonPublicMethod`)
- Never let code under test reach `exit()`/`die()`; call `setAutoExit(false)` on a console `Application` or use `CommandTester`. `CompletionGuard` fails such runs.

Rationale: mock-heavy tests pin the implementation and break on pure refactorings such as `search()` to `searchIds()`.

Read more: https://developer.shopware.com/docs/resources/guidelines/code/core/unit-tests.html

## asserting writes without a seam

When a decision's only effect is a write and the class has no other seam (the `SeoUrlPersister` write guard is the reference case), prefer: 1) extract the decision into a collaborator and unit-test it; 2) an integration test against a real database; 3) drive the public method, stub reads, capture statements in one helper and assert on written values in domain terms, never SQL text. For option 3, ensure the `transactional()` double invokes its closure and that each test fails when the decision is flipped.

Read more: https://developer.shopware.com/docs/resources/guidelines/code/core/unit-tests.html

## event assertions

- Never add or remove listeners on the shared `event_dispatcher` in a test.
- For "this service dispatches this event", build the service with a `CollectingEventDispatcher` and assert on `getEvents()` / `getEventsOfClass()` after the call.
- Never assert inside a listener; code that catches and logs around a dispatch swallows the failure. Capture, then assert after the code ran, and assert the capture is not null.
- Move an integration test that only checks a payload to the unit suite.

Read more: https://developer.shopware.com/docs/resources/guidelines/code/core/unit-tests.html

## source coverage

- Give each new source file focused unit coverage, or mark it `@codeCoverageIgnore` with a `@see \Shopware\Tests\Integration\…` line naming a dedicated integration test (FQCN, leading `\`, no import).
- The annotation is rejected on methods with branching, error paths, mutation, discarded calls on `$this`/`self::`/`static::` or a parameter, or constructors configuring their parent, unless such a `@see` exists. Enforced by: PHPStan (`CodeCoverageIgnoreEvaluationRule`)

Read more: https://developer.shopware.com/docs/resources/guidelines/code/core/unit-tests.html

## integration tests and api contexts

- Use `IntegrationTestBehaviour` for kernel tests; it bundles `KernelTestBehaviour`, `DatabaseTransactionBehaviour`, `CacheTestBehaviour` and filesystem/request/session/translation resets.
- `DatabaseTransactionBehaviour` rolls back after each test and fails if the nesting level is not 1 - close every transaction you open.
- `static::getContainer()` returns the test container with private services public.
- Admin API: `AdminApiTestBehaviour::getBrowser()` (optional scopes, permissions). Store API: `SalesChannelApiTestBehaviour::getSalesChannelBrowser()` or `createCustomSalesChannelBrowser()`.
- Override side-effecting services in `Resources/config/services_test.php`; it loads only when `kernel.environment` is `test`.

Read more: https://developer.shopware.com/docs/guides/development/testing/unit/php-unit.html

## async and cache

- With `QueueTestBehaviour`, the queue and test bus are reset around each test; call `runWorker()` to consume the `async` and `webhook` transports and `getDispatchedMessageCount()` to assert dispatches.
- `CacheTestBehaviour::clearCacheData()` clears caches and resets `services_resetter` before and after each test; never rely on cache state from another test.

Read more: https://developer.shopware.com/docs/guides/development/testing/unit/php-unit.html

## migrations

- Test `update()` of the `MigrationStep`, and `updateDestructive()` when implemented, using `KernelTestBehaviour` for the connection.
- Assert idempotency (`SHOW CREATE TABLE` unchanged after re-running `update()`) and recovery (drop the table, run `update()`, assert it exists).

Read more: https://developer.shopware.com/docs/guides/development/testing/unit/php-unit.html

## versioned entities

- For versioned entities, create a version with `EntityRepository::createVersion()`, write through `Context::createWithVersionId()`, and assert `Defaults::LIVE_VERSION` data separately from version data before and after `merge()`.

Read more: https://developer.shopware.com/docs/guides/development/testing/unit/php-unit.html

## plugin test setup

- Bootstrap with `TestBootstrapper`: `addCallingPlugin()`, `addActivePlugins()`, `setForceInstallPlugins(true)`, `bootstrap()`; set `KERNEL_CLASS` to `Shopware\Core\Kernel` and `APP_ENV=test` in `phpunit.xml`.

Read more: https://developer.shopware.com/docs/guides/development/testing/unit/php-unit.html

## store code quality

- Expect PHPStan and SonarQube review plus manual review, against the highest supported Shopware 6 version.
- Never ship `die`, `exit` or `var_dump` (SonarQube blockers).
- Log only under `/var/log/` as `MyExtension-Year-Month-Day.log`; payment extensions use the plugin logger; custom log tables need cleanup, retention at most six months.
- Ship production artifacts only: no `composer.lock`, no dev files; declare dependencies in `composer.json`; include readable unminified JavaScript sources.
- Verify `postMessage()` origins; never use `*` as target origin.

Read more: https://developer.shopware.com/docs/guides/development/testing/store/code-quality.html
Read more: https://developer.shopware.com/docs/guides/development/testing/store/quality-guidelines.html

## Code check (6.7.15.1+7d4303db)

- confirmed `CartRuleFixture` — static fixture class — core/Test/Checkout/CartRuleFixture.php:25
- confirmed `CollectingEventDispatcher::getEvents` — collected events — core/Test/Stub/EventDispatcher/CollectingEventDispatcher.php:37
- confirmed `shopware.createMockWithoutExpectations` — PHPStan id — core/DevOps/StaticAnalyze/PHPStan/Rules/Tests/NoCreateMockWithoutExpectationsRule.php:1518
- confirmed `shopware.reflectionOnNonPublicMethod` — PHPStan id — core/DevOps/StaticAnalyze/PHPStan/Rules/Tests/NoReflectionOnNonPublicMethodsRule.php:41
- confirmed `DatabaseTransactionBehaviour::stopTransactionAfter` — nesting check, rollback — core/Framework/Test/TestCaseBase/DatabaseTransactionBehaviour.php:37
- confirmed `QueueTestBehaviour::runWorker` — consumes async/webhook — core/Framework/Test/TestCaseBase/QueueTestBehaviour.php:30
- confirmed `SalesChannelApiTestBehaviour::getSalesChannelBrowser` — Store API browser — core/Framework/Test/TestCaseBase/SalesChannelApiTestBehaviour.php:132
- confirmed `Context::createWithVersionId` — versioned context — core/Framework/Context.php:173
- absent `EventHookDispatcher` — not present in this codeVersion
- absent `NoAssertionInEventHookRule` — not present in this codeVersion
