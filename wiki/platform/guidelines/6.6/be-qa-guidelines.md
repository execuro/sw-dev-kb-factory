---
id: platform/guidelines/6.6/be-qa-guidelines.md
title: Backend QA and unit test guidelines
docType: guideline
version: "6.6"
summary: PHPUnit rules for Shopware 6.6 backend code - use-case coverage, isolation and cleanup, stubs over mocks, behaviour-focused tests.
keywords: ["phpunit", "unit tests", "integration tests", "mocks", "stubs", "staticentityrepository", "staticsystemconfigservice", "test isolation", "paratest", "database transaction", "test coverage"]
sources: [{url: "https://developer.shopware.com/docs/v6.6/resources/guidelines/code/core/unit-tests.html", hash: "2faac0a3b4dd53d90d2724a144ddff1b188596a442cee27025390096930a3be3"}]
codeVersion: "6.6.10.24+87965325"
lastBuilt: 2026-09-15
---
## test coverage by use case

- Unit test every service and functionality you add or change; cover every use case of the service, not a coverage percentage.
- Test failure paths (exceptions, invalid input, missing data) as well as the success path.
- Structure cases so a new case is one added data-provider row or one short method, not dozens of new lines. A test matrix over one service is the preferred shape.
- Write tests first where possible; test-first code rarely starts from configuring a mock.

Enforced by: review

Read more: https://developer.shopware.com/docs/v6.6/resources/guidelines/code/core/unit-tests.html
Read more: platform/dev/6.6/resources/references/adr/2023-02-13-follow-test-pyramid.md

## unit tests over integration tests

- Prefer unit tests: instantiate the class under test yourself and pass its dependencies directly instead of booting the whole request or service stack.
- Keep tests fast; the suite grows with every release.
- Reserve integration tests for code whose purpose is a side effect (DB, filesystem, cache). In core, integration tests use the `IntegrationTestBehaviour` trait, which bundles `KernelTestBehaviour`, `DatabaseTransactionBehaviour`, `CacheTestBehaviour`, `FilesystemBehaviour` and related traits.
- Keep every test compatible with the paratest (parallel) runner: no reliance on execution order or shared global state.

Enforced by: review

Read more: https://developer.shopware.com/docs/v6.6/resources/guidelines/code/core/unit-tests.html
Read more: platform/dev/6.6/resources/references/adr/2022-10-20-test-structure.md

## isolation and cleanup

- Make each test independent: it must not fail because another test left files, storage records or registered listeners behind.
- Remove dynamically registered event listeners in teardown.
- Roll back database writes and schema changes. `DatabaseTransactionBehaviour` opens a transaction in a `#[Before]` hook (`startTransactionBefore`) and rolls it back in an `#[After]` hook (`stopTransactionAfter`). It asserts that the previous test closed its transaction and that the nesting level is exactly 1, so never leave an extra transaction open.

Enforced by: review

Read more: https://developer.shopware.com/docs/v6.6/resources/guidelines/code/core/unit-tests.html

## stubs over mocks

Pick the test double in this order:

1. The real implementation, when it is cheap to build and has no side effects.
2. A hand-written static stub. Core ships `Shopware\Core\Test\Stub\DataAbstractionLayer\StaticEntityRepository` (constructor takes a `$searches` list of results or callables `(Criteria, Context)` plus an optional `EntityDefinition`; it records writes in the public `$upserts`, `$updates`, `$creates` and `$deletes` arrays) and `Shopware\Core\Test\Stub\SystemConfigService\StaticSystemConfigService` (constructor takes an in-memory config array, optionally keyed by sales channel id).
3. PHPUnit mocks, only when the real object needs deep nested dependencies to build or produces unwanted side effects such as DB writes.

- Do not mock every dependency by default. Heavy mocking is hard to refactor, PHPStan does not catch mock drift, and it may mean the class needs better encapsulation. Separate business logic from side-effect adapters so the logic can be tested without mocks.

Enforced by: review

Read more: https://developer.shopware.com/docs/v6.6/resources/guidelines/code/core/unit-tests.html

## test behaviour not implementation

- Assert what the class returns or changes, not which dependency methods it calls.
- Pure refactorings must not break tests. Switching from `$repository->search($criteria, $context)->first()?->getId()` to `$repository->searchIds($criteria, $context)->firstId()`, or from `fetchAllAssociative` plus manual mapping to `fetchKeyValue`, keeps the behaviour the same. A test that mocks those exact calls fails anyway, so avoid that coupling or use a stub such as `StaticEntityRepository`, which implements both `search` and `searchIds`.
- Keep tests readable for other maintainers: descriptive case names and reusable helpers.

Enforced by: review

Read more: https://developer.shopware.com/docs/v6.6/resources/guidelines/code/core/unit-tests.html
Read more: platform/dev/6.6/resources/guidelines/code/core/unit-tests.md

## Code check (6.6.10.24+87965325)

- confirmed `StaticEntityRepository` — DAL repository stub for unit tests — core/Test/Stub/DataAbstractionLayer/StaticEntityRepository.php:31
- confirmed `StaticSystemConfigService` — in-memory system config stub — core/Test/Stub/SystemConfigService/StaticSystemConfigService.php:10
- confirmed `IntegrationTestBehaviour` — trait bundling kernel, DB transaction, cache and filesystem behaviours — core/Framework/Test/TestCaseBase/IntegrationTestBehaviour.php:5
- confirmed `DatabaseTransactionBehaviour` — wraps each test in a rolled-back transaction — core/Framework/Test/TestCaseBase/DatabaseTransactionBehaviour.php:13
- confirmed `KernelTestBehaviour` — kernel/container access trait — core/Framework/Test/TestCaseBase/KernelTestBehaviour.php:8
- confirmed `searchIds` — EntityRepository id search — core/Framework/DataAbstractionLayer/EntityRepository.php:80
- confirmed `firstId` — IdSearchResult first id accessor — core/Framework/DataAbstractionLayer/Search/IdSearchResult.php:69
- unverified `fetchKeyValue` — Doctrine DBAL Connection method, vendor/doctrine, out of scope
