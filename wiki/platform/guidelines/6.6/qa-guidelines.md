---
id: platform/guidelines/6.6/qa-guidelines.md
title: QA guidelines
docType: guideline
version: "6.6"
summary: Test pyramid and test level selection, isolation and determinism, mocking policy and test file placement for Shopware 6.6
keywords: ["testing", "test pyramid", "unit tests", "integration tests", "e2e", "mocking", "stubs", "flakiness", "paratest", "jest", "test structure", "determinism"]
sources: [{url: "https://developer.shopware.com/docs/v6.6/resources/guidelines/code/core/unit-tests.html", hash: "2faac0a3b4dd53d90d2724a144ddff1b188596a442cee27025390096930a3be3"}, {url: "https://developer.shopware.com/docs/v6.6/resources/references/adr/2023-02-13-follow-test-pyramid.html", hash: "2916a420d5e3ec8ae2bfec4c71bdc5c4114d233a52126833cb202a43a23f7c5a"}, {url: "https://developer.shopware.com/docs/v6.6/resources/references/adr/2022-10-20-test-structure.html", hash: "675541e97c804d0ab946c14b30107a2ae3d3b4b66864cef590256d84671fba16"}, {url: "https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/testing/", hash: "121ca345551b366efb519fb288ac66a733eec09face208b94eb6c5eaef422983"}]
codeVersion: "6.6.10.29+c8b59f9d"
lastBuilt: 2026-10-21
---

## Index

- [platform/guidelines/6.6/be-qa-guidelines.md](platform/guidelines/6.6/be-qa-guidelines.md) — read before writing PHPUnit unit/integration tests, Store/Admin API context tests, async/cache assertions, migration tests, DAL versioned-entity cases or store code-quality checks.
- [platform/guidelines/6.6/fe-qa-guidelines.md](platform/guidelines/6.6/fe-qa-guidelines.md) — read before writing admin Jest tests, storefront Twig lint/render assertions or Playwright e2e (acceptance suite) tests and fixtures.

## test pyramid

- Follow the test pyramid: many unit tests, fewer integration/API tests, very few end-to-end tests. Shopware's suite was an inverted pyramid (e2e serial runtime grew past 6 hours) and the ADR commits to reversing it.
- Pick the lowest level that can prove the behaviour:
  - PHP service/DTO logic: PHPUnit unit test with the service instantiated directly.
  - Behaviour that depends on the DB, the DI container or the full request stack: PHP integration or API test.
  - Admin component logic and CRUD screens: Jest test, not e2e.
  - A complete, business-critical feature flow across the stack: e2e test.
- Do not add an e2e test for anything a Jest test or a PHP integration/API test can cover; such e2e tests are the ones the ADR deletes.
- Write tests first; designing for a test up front avoids mock-heavy tests and tightly coupled code.

Read more: https://developer.shopware.com/docs/v6.6/resources/references/adr/2023-02-13-follow-test-pyramid.html
Read more: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/testing/

## unit test requirements

- Cover every use case of each service, not a coverage percentage. "100% coverage" means all cases, not all lines.
- Test failure paths, not only the happy path.
- Keep unit tests units: instantiate the class under test yourself and replace its side-effecting dependencies; do not boot the whole request or service stack.
- Keep tests fast; speed of the suite is a stated requirement as it grows.
- Structure cases so a new case is a new data-provider row or a few lines, not dozens of copied lines (test matrix style).
- Write tests readable by other maintainers: descriptive case names, reusable helpers.

Read more: https://developer.shopware.com/docs/v6.6/resources/guidelines/code/core/unit-tests.html

## mocking policy

- Mock only when (1) constructing the real object needs a deep tree of dependencies, or (2) the dependency produces side effects unwanted in a unit test (for example DB writes).
- Otherwise prefer, in this order:
  1. The real implementation, when it is cheap to build and side-effect free.
  2. A hand-crafted stub such as `StaticEntityRepository` (namespace `Shopware\Core\Test\Stub\DataAbstractionLayer`) or `StaticSystemConfigService` (namespace `Shopware\Core\Test\Stub\SystemConfigService`).
  3. PHPUnit's mock framework, only as fallback.
- Assert behaviour (what the class returns or does), not implementation (which dependency method was called). A pure refactoring such as switching `search()` plus `first()` to `searchIds()` plus `firstId()` must not break the test.
- Treat a need for heavy mocking as a design smell: separate business logic from side-effecting adapters so the logic can be tested with real objects or stubs.
- Remember mocks hinder automated refactoring; IDEs and PHPStan do not reliably detect drift between a mock and the real class.

Read more: https://developer.shopware.com/docs/v6.6/resources/guidelines/code/core/unit-tests.html
Read more: platform/guidelines/6.6/be-qa-guidelines.md

## isolation and determinism

- Make every test independent of execution order: it must not fail because another test left files, DB records or registered listeners behind.
- Clean up in `tearDown`: remove dynamically registered event listeners, roll back DB writes and schema changes.
- Keep tests compatible with the paratest (parallel) setup so they can run in any order and in parallel, locally and in CI.
- Avoid non-determinism: e2e and integration tests with many moving parts flake depending on machine load; push such assertions down to unit level where possible.
- Do not rely on test retries to make a test green; retries hide flakiness and slow the pipeline.

Read more: https://developer.shopware.com/docs/v6.6/resources/guidelines/code/core/unit-tests.html
Read more: https://developer.shopware.com/docs/v6.6/resources/references/adr/2023-02-13-follow-test-pyramid.html

## e2e test quality gate

- Add an e2e test only for an important feature tested end to end.
- Run a new e2e test repeatedly before merging (the ADR names at least 50 runs) to prove it is stable.
- Do not require a database reset between test cases; set up the data each test needs instead.
- Move a flaky test into quarantine immediately instead of letting it block merge trains.

Read more: https://developer.shopware.com/docs/v6.6/resources/references/adr/2023-02-13-follow-test-pyramid.html
Read more: platform/guidelines/6.6/fe-qa-guidelines.md

## test file placement

- Place an administration Jest test in the same folder as the component it tests, not in a central test folder; for example `app/component/base/sw-button/sw-button.spec.js` sits beside `sw-button.html.twig`.
- Name the file after the component: `<component-name>.spec.js` or `<component-name>.spec.ts`; prefer TypeScript.

Read more: https://developer.shopware.com/docs/v6.6/resources/references/adr/2022-10-20-test-structure.html

## Code check (6.6.10.29+c8b59f9d)

- confirmed `StaticEntityRepository` — hand-crafted repository stub extending `EntityRepository` — core/Test/Stub/DataAbstractionLayer/StaticEntityRepository.php:31
- confirmed `StaticSystemConfigService` — hand-crafted config stub extending `SystemConfigService` — core/Test/Stub/SystemConfigService/StaticSystemConfigService.php:10
