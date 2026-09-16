---
id: platform/guidelines/6.7/qa-guidelines.md
title: QA guidelines
docType: guideline
version: "6.7"
summary: "Test pyramid and level selection, deterministic and isolated tests, and CI ordering rules for Shopware 6.7 core and extension code."
keywords: ["testing", "test pyramid", "unit test", "integration test", "e2e", "phpunit", "jest", "playwright", "mocking", "determinism", "ci", "static analysis", "coverage"]
sources: [{url: "https://developer.shopware.com/docs/resources/guidelines/code/core/unit-tests.html", hash: "4765adb1ddd045550844bd777945039efc4f1b3adc1aade8f010f8259470d9a6"}, {url: "https://developer.shopware.com/docs/resources/references/adr/2023-02-13-follow-test-pyramid.html", hash: "2916a420d5e3ec8ae2bfec4c71bdc5c4114d233a52126833cb202a43a23f7c5a"}, {url: "https://developer.shopware.com/docs/resources/references/adr/2022-10-20-test-structure.html", hash: "675541e97c804d0ab946c14b30107a2ae3d3b4b66864cef590256d84671fba16"}, {url: "https://developer.shopware.com/docs/guides/development/testing/", hash: "df8064a605c1606d82366c5951e3e9d24b3cc827f40d2094e94230d219c92899"}, {url: "https://developer.shopware.com/docs/guides/development/testing/ci.html", hash: "d3451896b3fd592f4f3f9e4b665bdf10230d2de881899205f3bac1bcb1f26018"}]
codeVersion: "6.7.13.0+8da531fe"
lastBuilt: 2026-09-15
---

## Index

- [platform/guidelines/6.7/be-qa-guidelines.md](platform/guidelines/6.7/be-qa-guidelines.md) — read before writing PHPUnit unit/integration tests, Store/Admin API context tests, cache or async assertions, migration or DAL versioned-entity tests, or store code-quality checks.
- [platform/guidelines/6.7/fe-qa-guidelines.md](platform/guidelines/6.7/fe-qa-guidelines.md) — read before writing admin Jest tests, storefront Twig lint/render assertions, or Playwright e2e (acceptance suite) tests.

## test pyramid

- Follow the test pyramid: many unit tests, fewer integration/API tests, very few E2E tests. The 6.x suite was an inverted pyramid (E2E taking 6+ hours serially) and suffered from flakiness.
- Pick the lowest level that proves the behaviour:
  - Pure logic in a service or DTO: PHPUnit unit test, or Jest for admin/storefront JS.
  - SQL/DBAL adapters, DAL definitions, custom entities: PHP integration test against a real database.
  - HTTP contracts: API/integration test.
  - A whole important feature crossing Storefront/Administration: Playwright E2E.
- Do not add an E2E test for something Jest or a PHP integration/API test can cover (admin CRUD modules especially).
- Add an E2E test only for an important end-to-end feature, and prove it stable (the ADR asks for at least 50 runs) before merging.
- Prefer tests that need no database reset between cases. Do not rely on retries to make E2E pass.

Read more: https://developer.shopware.com/docs/resources/references/adr/2023-02-13-follow-test-pyramid.html
Read more: https://developer.shopware.com/docs/guides/development/testing/

## unit test scope and ownership

- Test every use case of a service, including failure paths, not just line coverage. Use `expectExceptionObject()` or the `expectException*()` helpers for deterministic exceptions, never a manual `try/catch`.
- Declare `#[Package('…')]` on every test class with the package of the covered production domain, so CI failures route to the owning team.
- Declare exactly one `#[CoversClass]` per unit test file; split files that cover several subjects. Unit and migration test classes must carry `CoversClass`, `CoversFunction` or `CoversNothing`; other test classes must not.
- Instantiate the service under test yourself instead of booting the full request/service stack.
- A new source file intentionally covered only by integration tests gets `@codeCoverageIgnore` plus a `@see \Shopware\Tests\Integration\…` line pointing to a dedicated integration test (fully qualified, leading `\`, no import). The rule rejects the annotation on methods that do more than pass values through (branching, mutation, guard calls, input shaping).
- Replace near-duplicate tests with one test plus a data provider; name each case so a failure reads as a sentence.
- Pass opaque literals to builders/helpers as named arguments.
- Keep a fixture class used by one test file in that file; move it to a shared `_fixtures` namespace only once a second test needs it.
- Place admin Jest spec files next to the component they test, named `[component-name].spec.js`.

Enforced by: PHPStan
Read more: https://developer.shopware.com/docs/resources/guidelines/code/core/unit-tests.html
Read more: https://developer.shopware.com/docs/resources/references/adr/2022-10-20-test-structure.html
Read more: platform/dev/6.7/resources/references/adr/2023-04-14-jest-test-files-should-be-javascript-only.md

## mocks and test doubles

- Order of preference: real implementation, then a hand-crafted static double (`StaticEntityRepository`, `StaticSystemConfigService`), then PHPUnit mocks.
- Mock only when construction needs deep nested dependencies or the class causes unwanted side effects.
- Use `createStub()` for any double that never receives `->expects()`; `createMock()` only with expectations. A stub has no `->with()`: assert arguments inside `willReturnCallback()`. Type helper parameters for stubs as `Foo&Stub`, not `MockObject`.
- Never behaviour-mock Doctrine DBAL `Connection` (asserting SQL text, clause order or parameters). Move SQL into a database adapter and cover it with an integration test.
- When the only effect of a decision is a write and there is no seam, in this order: extract the decision into a collaborator; else write an integration test; else capture statements in one helper and assert written values in domain terms. Make sure the `transactional()` double actually runs its closure. Confirm the test fails when the decision is flipped.
- Test behaviour, not implementation: a refactor such as `search()->first()?->getId()` to `searchIds()->firstId()` must not break the test.
- Never use reflection (`invoke()`, `invokeArgs()`, `setAccessible()`) to call private/protected methods of Shopware classes; test through the public API. Reading reflection metadata is fine.
- Assert observed arguments directly inside callbacks/listeners; keep only minimal state (called flag, counter) outside.

Enforced by: PHPStan
Read more: https://developer.shopware.com/docs/resources/guidelines/code/core/unit-tests.html
Read more: platform/dev/6.7/resources/guidelines/code/core/unit-tests.md

## determinism and isolation

- Make tests independent of execution order: never depend on files, storage records or listeners left by another test.
- Clean up every artifact: remove dynamically registered event listeners in teardown and roll back database writes and schema changes.
- Keep tests compatible with the paratest (parallel) setup so they run locally and in CI without shared-state collisions.
- Never let code under test call `exit()` or `die()`: PHPUnit terminates and later tests silently never run. For a Symfony console `Application`, call `$application->setAutoExit(false)` or use `CommandTester`.
- Watch test speed; slow suites are what pushed flaky E2E tests into distrust.
- In extension CI, keep fixtures inside the plugin instead of depending on project data, and commit Composer/NPM lock files for deterministic builds.

Read more: https://developer.shopware.com/docs/resources/guidelines/code/core/unit-tests.html
Read more: https://developer.shopware.com/docs/guides/development/testing/ci.html

## ci test order

- Fail fast: run coding standards, formatter checks and static analysis (PHPStan) before unit tests, and unit tests before slower integration and E2E stages.
- Build the artifact once per commit (plugin ZIP, app package, built project assets) and promote the same artifact through stages; do not rebuild on deploy.
- For projects, run the project build command in CI and add HTTP smoke tests plus DAL-level integration tests for custom entities. Keep environment-specific config out of CI.
- For plugins, build and validate with the extension build command. For Store plugins, run Store validations (linting, metadata, PHPStan) early, before submission.

Enforced by: shopware-cli
Read more: https://developer.shopware.com/docs/guides/development/testing/ci.html

## Code check (6.7.13.0+8da531fe)

- absent `Shopware\Core\Test\PHPUnit\CompletionGuard` — not present in this codeVersion; rely on the no-exit rule instead
- confirmed `CoversAttributeRule` — requires CoversClass/CoversFunction/CoversNothing on unit and migration tests — core/DevOps/StaticAnalyze/PHPStan/Rules/Tests/CoversAttributeRule.php:23
- confirmed `NoCreateMockWithoutExpectationsRule` — PHPStan rule for createMock without expectations — core/DevOps/StaticAnalyze/PHPStan/Rules/Tests/NoCreateMockWithoutExpectationsRule.php:39
- confirmed `CodeCoverageIgnoreEvaluationRule` — PHPStan rule evaluating @codeCoverageIgnore use — core/DevOps/StaticAnalyze/PHPStan/Rules/CodeCoverageIgnoreEvaluationRule.php:32
- confirmed `StaticEntityRepository` — static repository double — core/Test/Stub/DataAbstractionLayer/StaticEntityRepository.php:31
- confirmed `StaticSystemConfigService` — static system config double — core/Test/Stub/SystemConfigService/StaticSystemConfigService.php:10
