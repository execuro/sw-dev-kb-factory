---
id: platform/guidelines/6.7/qa-guidelines.md
title: QA guidelines
docType: guideline
version: "6.7"
summary: Test pyramid and test-level selection, deterministic isolated tests, and CI ordering for Shopware 6.7 core and extension code.
keywords: ["testing", "test pyramid", "unit tests", "integration tests", "e2e", "phpunit", "jest", "playwright", "flakiness", "determinism", "continuous integration", "static analysis", "mocks", "test doubles"]
sources: [{url: "https://developer.shopware.com/docs/resources/guidelines/code/core/unit-tests.html", hash: "0591387dd188020205a0e33d46bb7a0ab63988e312b2415ab1df5df9fc9b7b28"}, {url: "https://developer.shopware.com/docs/resources/references/adr/2023-02-13-follow-test-pyramid.html", hash: "2916a420d5e3ec8ae2bfec4c71bdc5c4114d233a52126833cb202a43a23f7c5a"}, {url: "https://developer.shopware.com/docs/resources/references/adr/2022-10-20-test-structure.html", hash: "675541e97c804d0ab946c14b30107a2ae3d3b4b66864cef590256d84671fba16"}, {url: "https://developer.shopware.com/docs/guides/development/testing/", hash: "df8064a605c1606d82366c5951e3e9d24b3cc827f40d2094e94230d219c92899"}, {url: "https://developer.shopware.com/docs/guides/development/testing/ci.html", hash: "d3451896b3fd592f4f3f9e4b665bdf10230d2de881899205f3bac1bcb1f26018"}]
codeVersion: "6.7.15.1+7d4303db"
lastBuilt: 2026-10-21
---

## Index

- [platform/guidelines/6.7/be-qa-guidelines.md](platform/guidelines/6.7/be-qa-guidelines.md) — read before writing PHPUnit unit/integration tests, Store/Admin API context tests, async and cache assertions, migration tests, DAL versioned-entity cases, or store code-quality checks.
- [platform/guidelines/6.7/fe-qa-guidelines.md](platform/guidelines/6.7/fe-qa-guidelines.md) — read before writing admin Jest specs, storefront Twig lint/render assertions, or Playwright e2e tests (acceptance suite, fixtures, best practices).

## test pyramid

- Follow the test pyramid: many unit tests, fewer integration/API tests, few E2E tests. Shopware's own suite was an inverted pyramid and is being cut back toward this shape.
- Add an E2E test only when it exercises an important feature end to end. Never add one for behaviour a Jest test or a PHP integration/API test can cover — admin CRUD screens are the typical case to move down a level.
- Treat a new E2E test as unmerged until it has passed repeatedly (the ADR sets at least 50 runs) without flaking.
- Do not rely on E2E retries to make a test green; reduce or disable them and quarantine a flaky test quickly instead of letting it block merges.
- Rationale: slow, non-deterministic upper-level tests (the serial E2E suite once exceeded 6 hours) erode trust in the whole pipeline.

Read more: https://developer.shopware.com/docs/resources/references/adr/2023-02-13-follow-test-pyramid.html

## choosing the test level

- Unit test (PHPUnit / Jest): business logic in a single class or component. Instantiate the subject directly and replace only collaborators that are hard to build or that cause side effects; do not boot the kernel or the full request stack.
- Integration test: code whose job is talking to the outside — direct SQL/DBAL adapters, DAL writes of custom entities, container wiring, event dispatch as a consequence of a real write or request. Never unit-test such adapters by behaviour-mocking Doctrine DBAL `Connection` and asserting SQL text or parameters.
- E2E test (Playwright): a real user journey across Storefront and/or Administration. Playwright is the supported E2E tool; Cypress material is legacy.
- If an integration test only asserts a payload a unit test could assert just as well, move it down — the test is at the wrong level.
- Test behaviour, not implementation: a pure refactor (for example switching `search()` to `searchIds()`) must not break the test. Heavy mocking is a design smell; extract the decision into a collaborator with a public contract rather than mocking around it.
- Prefer, in order: the real implementation, a hand-written test double (`StaticEntityRepository`, `StaticSystemConfigService`, `CollectingEventDispatcher`), and only then PHPUnit's mock framework.
- Cover failure paths, not just the happy case.

Read more: https://developer.shopware.com/docs/resources/guidelines/code/core/unit-tests.html
Read more: platform/dev/6.7/guides/development/testing/_index.md
Read more: platform/dev/6.7/guides/development/testing/unit/_index.md

## test placement and ownership

- Colocate administration specs with the component they test, named `<component-name>.spec.ts` (TypeScript preferred, `.spec.js` allowed), e.g. under `src/module/sw-cms/component/sw-cms-block/`. Do not add tests to the old central administration `test` folder; it is no longer loaded.
- In core PHP tests, declare `#[Package('…')]` matching the covered production domain and exactly one `#[CoversClass]` per test file, so a failure routes to one owning team. Split a file that covers several classes.
- A new source file either gets focused unit-test coverage or is marked `@codeCoverageIgnore` with an `@see` to a dedicated integration test for that class.

Enforced by: PHPStan
Read more: https://developer.shopware.com/docs/resources/references/adr/2022-10-20-test-structure.html
Read more: platform/guidelines/6.7/be-qa-guidelines.md

## determinism and isolation

- Make every test independent of execution order: never depend on artifacts (files, database rows, cache entries) left by another test, and never leave any behind.
- Clean up in teardown: remove dynamically registered listeners, roll back database and schema changes. For state that must be restored, use lifecycle behaviours such as `EnvTestBehaviour` or `EventDispatcherBehaviour` rather than ad-hoc globals.
- Keep tests compatible with the paratest (parallel) setup — no shared mutable fixtures, fixed ports or fixed file names across processes.
- Never let code under test call `exit()` or `die()`: PHPUnit dies with it and the remaining tests silently do not run. For a Symfony console `Application`, call `setAutoExit(false)` or use `CommandTester`. `CompletionGuard`, registered from `TestBootstrapper::bootstrap()`, turns such a truncated run into a non-zero exit code instead of a green one — every suite using the test bootstrapper (core, plugins, projects) gets it without `phpunit.xml` wiring.
- Prefer deterministic assertions over timing: assert observed values after the code under test ran, and make a captured value that stays `null` fail the test.
- Keep fixtures inside the extension; do not couple tests to project or demo data.

Read more: https://developer.shopware.com/docs/resources/guidelines/code/core/unit-tests.html
Read more: platform/dev/6.7/guides/development/testing/e2e-playwright/best-practices.md

## ci test order

- Fail fast: run coding standards and static analysis (PHPStan, ESLint, formatter checks) first, then unit tests, then integration tests, then E2E tests last.
- Run the Shopware CLI formatter and its bundled validation tools in CI; for Store extensions run the Store validations (linting, metadata, PHPStan) early to catch review failures before submission.
- Build the artifact once per commit — plugin ZIP via the extension build command, built Storefront/Administration assets via the project build command — and promote that same artifact through stages; never rebuild on deploy.
- Commit Composer and npm lock files; cache dependencies, but keep builds deterministic.
- Keep environment-specific configuration in deployment, not in CI.
- For custom projects, add HTTP-layer smoke tests plus DAL-level integration tests for custom entities.

Enforced by: shopware-cli
Read more: https://developer.shopware.com/docs/guides/development/testing/ci.html
Read more: platform/dev/6.7/guides/development/testing/ci.md

## Code check (6.7.15.1+7d4303db)

- confirmed `StaticEntityRepository` — hand-written repository double for unit tests — core/Test/Stub/DataAbstractionLayer/StaticEntityRepository.php:33
- confirmed `StaticSystemConfigService` — hand-written system config double — core/Test/Stub/SystemConfigService/StaticSystemConfigService.php:10
- confirmed `CollectingEventDispatcher` — dispatcher double exposing `getEvents()` — core/Test/Stub/EventDispatcher/CollectingEventDispatcher.php:11
- confirmed `CompletionGuard` — fails a PHPUnit run terminated before completion — core/Test/PHPUnit/CompletionGuard/CompletionGuard.php:29
- confirmed `TestBootstrapper::bootstrap()` — registers `CompletionGuard` — core/TestBootstrapper.php:58
- confirmed `EventDispatcherBehaviour` — lifecycle trait for listener cleanup — core/Framework/Test/TestCaseBase/EventDispatcherBehaviour.php:8
- confirmed `Package` — ownership attribute — core/Framework/Log/Package.php:16
- unverified `EventHookDispatcher` — documented hook helper not found under the core package root of this checkout, so not used as a rule here
