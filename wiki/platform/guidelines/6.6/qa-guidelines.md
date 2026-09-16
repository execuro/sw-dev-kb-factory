---
id: platform/guidelines/6.6/qa-guidelines.md
title: QA guidelines
docType: guideline
version: "6.6"
summary: "Test pyramid and level selection, deterministic isolated tests, mocking discipline and test placement for Shopware 6.6 code."
keywords: ["testing", "test pyramid", "unit tests", "integration tests", "e2e", "mocking", "stubs", "determinism", "flakiness", "paratest", "jest", "playwright"]
sources: [{url: "https://developer.shopware.com/docs/v6.6/resources/guidelines/code/core/unit-tests.html", hash: "2faac0a3b4dd53d90d2724a144ddff1b188596a442cee27025390096930a3be3"}, {url: "https://developer.shopware.com/docs/v6.6/resources/references/adr/2023-02-13-follow-test-pyramid.html", hash: "2916a420d5e3ec8ae2bfec4c71bdc5c4114d233a52126833cb202a43a23f7c5a"}, {url: "https://developer.shopware.com/docs/v6.6/resources/references/adr/2022-10-20-test-structure.html", hash: "675541e97c804d0ab946c14b30107a2ae3d3b4b66864cef590256d84671fba16"}]
codeVersion: "6.6.10.24+87965325"
lastBuilt: 2026-09-15
---

## Index

- [platform/guidelines/6.6/be-qa-guidelines.md](platform/guidelines/6.6/be-qa-guidelines.md) — read before writing PHPUnit unit/integration tests, Store/Admin API context tests, async/cache assertions, migration or DAL versioned-entity tests, or running store code-quality checks.
- [platform/guidelines/6.6/fe-qa-guidelines.md](platform/guidelines/6.6/fe-qa-guidelines.md) — read before writing admin Jest specs, storefront Twig lint/render assertions, or Playwright acceptance (e2e) tests and fixtures.

This file holds the cross-cutting rules; the two files above add layer-specific conventions.

Read more: platform/dev/6.6/resources/guidelines/code/core/unit-tests.md

## test pyramid and level selection

- Follow the test pyramid: many unit tests, fewer integration/API tests, very few end-to-end tests. Shopware's suite was an inverted pyramid (e2e runs over 6 hours serially) and the ADR commits to reversing it.
- Pick the lowest level that can prove the behaviour:
  - Service logic, DTOs, calculators, flow actions: PHP unit test, instantiate the class yourself.
  - Behaviour that needs the real DB, DAL or request stack: PHP integration / API test.
  - Admin component behaviour, including basic CRUD screens: Jest test.
  - A complete, important feature only: e2e (Playwright acceptance) test.
- Never add an e2e test for something a Jest or PHP integration/API test can cover.
- Write unit tests, not integration tests, by default — do not boot the whole request or service stack when constructing the service with its dependencies is enough.
- Write tests first; test-first code rarely starts from configuring a mock and ends up easier to test.

Rationale: e2e and heavy integration tests are slow and involve many moving parts, which is the main source of pipeline flakiness.

Read more: https://developer.shopware.com/docs/v6.6/resources/references/adr/2023-02-13-follow-test-pyramid.html
Read more: platform/dev/6.6/resources/references/adr/2023-12-12-acceptance-test-suite.md

## coverage means use cases

- Cover every use case of each service, not a coverage percentage. High line coverage with untested branches does not count.
- Test failure paths (invalid input, exceptions, missing data) as well as the happy path.
- Structure tests as a case matrix (data providers / table of cases) so a new case is one entry, not dozens of new lines.
- Keep tests readable for other maintainers: descriptive case names, reusable helpers, no hidden setup.
- Keep tests fast; watch the runtime of every test you add.

Read more: https://developer.shopware.com/docs/v6.6/resources/guidelines/code/core/unit-tests.html

## mocking and test doubles

- Prefer, in this order:
  1. The real implementation, when it is cheap to build and has no side effects.
  2. A hand-crafted stub such as `StaticEntityRepository` or `StaticSystemConfigService` (namespace `Shopware\Core\Test\Stub\...`).
  3. PHPUnit mocks, only when the real class cannot be replaced easily.
- Mock only when building the object needs deep nested dependencies, or when it causes side effects you must avoid in a unit test (e.g. DB writes).
- Assert observable behaviour (return values, emitted events, persisted state), never call sequences on internals. A refactor like `search(...)->first()?->getId()` to `searchIds(...)->firstId()` must not break a correct test.
- Treat a test that needs many mocks as a design smell: separate business logic from side-effecting adapters so the logic can be tested with real objects.

Rationale: mocks resist IDE refactoring, PHPStan does not catch mock drift, and a mock can silently diverge from the real implementation.

Read more: https://developer.shopware.com/docs/v6.6/resources/guidelines/code/core/unit-tests.html

## determinism and isolation

- Make every test independent of execution order: it must neither depend on nor leave artifacts (files, DB records, schema changes, registered listeners) for other tests.
- Clean up in teardown: remove dynamically registered event listeners, and roll back DB writes and schema changes.
- Keep tests compatible with the parallel para-test setup — no shared mutable state, no reliance on a specific run order or a fresh database per test.
- Do not rely on retries to pass a test; a flaky test is a bug. Before merging a new e2e test, run it repeatedly (the ADR sets at least 50 runs) and quarantine a flaky one quickly rather than letting it block pipelines.
- Avoid timing- or machine-load-dependent assertions; they are the typical cause of flakiness that only shows up in CI.

Rationale: order-dependent or flaky tests make CI results untrustworthy and block merge trains.

Read more: https://developer.shopware.com/docs/v6.6/resources/guidelines/code/core/unit-tests.html
Read more: https://developer.shopware.com/docs/v6.6/resources/references/adr/2023-02-13-follow-test-pyramid.html

## test placement

- Place an administration Jest test next to the component it tests, not in a central test folder, e.g. `src/module/sw-cms/component/sw-cms-block/sw-cms-block.spec.js`.
- Name it after the component: `<component-name>.spec.js`. The 6.6 code uses `.spec.js` for component specs; do not follow the older ADR wording that prefers TypeScript specs.
- Keep PHP unit tests in the unit test tree mirroring the production namespace (e.g. a test for `Core/Checkout/Cart/Price/CashRounding` lives at `tests/unit/Core/Checkout/Cart/Price/CashRoundingTest.php`).

Read more: https://developer.shopware.com/docs/v6.6/resources/references/adr/2022-10-20-test-structure.html
Read more: platform/dev/6.6/resources/references/adr/2023-04-14-jest-test-files-should-be-javascript-only.md
