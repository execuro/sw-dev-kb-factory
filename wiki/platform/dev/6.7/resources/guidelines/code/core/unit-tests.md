---
id: platform/dev/6.7/resources/guidelines/code/core/unit-tests.md
title: Unit tests
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/guidelines/code/core/unit-tests.html
sourceHash: 9bb5a95677f6e5b5c449df807a1e01c1e30651d1
codeCheckedAgainst: "6.7.13.0"
keywords: ["unit tests", "phpunit", "mocking", "stubs", "createStub", "createMock", "CoversClass", "Package", "@codeCoverageIgnore", "CodeCoverageIgnoreEvaluationRule", "NoCreateMockWithoutExpectationsRule", "StaticEntityRepository", "StaticSystemConfigService", "data provider", "test doubles"]
summary: "Core unit-test rules: #[Package] and one #[CoversClass] per test, createStub vs createMock, no DBAL Connection mocks, data providers, alternatives to mocks."
lastBuilt: 2026-09-15
---
## What it is

Core guideline for writing unit tests in Shopware: required attributes per test class, coverage conventions, how to use mocks and stubs, what to avoid, and why heavy mocking signals a design problem.

## When to use

When writing or reviewing PHPUnit tests for Shopware core (or following core conventions in an extension), especially around coverage annotations, test doubles and database-touching code.

## Key steps / config

**Per test class**
- Declare `#[Package('…')]` (`Shopware\Core\Framework\Log\Package`) with the package of the covered production domain, so CI failures route to the owning team.
- Declare exactly one `#[CoversClass]`; split files covering several classes (a Danger rule fails new files covering more than one).
- Test-only fixture classes used by one file live in that file below the test class; move to a shared `_fixtures` namespace only once a second test needs them.

**Source-file coverage**
- New source files get focused unit tests, or `@codeCoverageIgnore` plus a docblock line `@see \Shopware\Tests\Integration\…\DedicatedIntegrationTest` (fully qualified, leading `\`, not imported) pointing to a test dedicated to that class.
- `CodeCoverageIgnoreEvaluationRule` (PHPStan) rejects the annotation on methods that do more than pass a value through: branching/error paths, value mutation (`unset`, `+=`, `.=`, increments, second write to a local), discarded calls on `$this`/`self::`/`static::` or on a parameter (e.g. `$criteria->addFilter(...)`; `EntityExtension::extendFields()` and `defineFields()` exempt), constructors configuring their parent. A `@see` to a dedicated `\Shopware\Tests\Integration\…` or `\Shopware\Tests\DevOps\…` test lifts the check.

**Test doubles**
- A double without `->expects()` is a stub: use `createStub()`; `NoCreateMockWithoutExpectationsRule` reports `createMock()` doubles never expected. `->with()` exists on mocks only — stubs assert arguments inside `willReturnCallback()`; helper parameters receiving a stub are typed `Foo&Stub`, not `MockObject`.
- Prefer real implementations, then hand-crafted doubles such as `StaticEntityRepository` or `StaticSystemConfigService`, then PHPUnit mocks. Mock only when construction needs many nested dependencies or the class has unwanted side effects.
- Do not behavior-mock Doctrine DBAL `Connection` (asserting SQL or parameters); treat SQL/DBAL code as database adapters covered by integration tests.

**Asserting writes with no other seam** (reference: write-protection guard in `SeoUrlPersister`), in order of preference:
1. Extract the decision into a collaborator with a public contract and unit-test it.
2. Integration test against a real database.
3. Drive the public method, stub reads, capture executed statements, assert on written values — never SQL text or parameter names; keep capture in one helper; make sure the `transactional()` double invokes its closure; confirm the test fails when the decision is flipped.

**Style**
- Named arguments for opaque literals passed to builders/helpers.
- Assert inside callbacks/listeners; keep only minimal outside state (called flag, counter, captured values).
- Data providers with named cases instead of near-duplicate tests.
- `expectExceptionObject()` / `expectException*()` instead of `try/catch`.
- Test failure cases, clean up listeners and data in teardown, stay independent of other tests, keep compatible with para-test.
- Console `Application` tests: call `$application->setAutoExit(false)` or use `CommandTester`; code under test must never call `exit()`/`die()`.

## Essential identifiers

- `#[Package]`, `#[CoversClass]`, `@codeCoverageIgnore`, `@see`
- `CodeCoverageIgnoreEvaluationRule`, `NoCreateMockWithoutExpectationsRule`
- `createStub()`, `createMock()`, `willReturnCallback()`, `expectExceptionObject()`
- `StaticEntityRepository`, `StaticSystemConfigService`
- `CommandTester`, `setAutoExit(false)`

## Gotchas

- Do not call a private/protected method of a Shopware class via reflection (`->invoke()`, `->invokeArgs()`, `setAccessible()`); test through the public API. Reflecting into third-party classes or reading reflection metadata is fine. The source names a PHPStan rule `shopware.reflectionOnNonPublicMethod` for this; it is not in the installed vendor code.
- The source says `Shopware\Core\Test\PHPUnit\CompletionGuard` fails runs where code under test exits; that class is not in the installed 6.7.13.0 code, so an `exit()` there can silently skip later tests.
- Mock-heavy tests couple to implementation: refactors like `search()->first()?->getId()` to `searchIds()->firstId()` break them without changing behavior.

## Code check (6.7.13.0)
- absent `Shopware\Core\Test\PHPUnit\CompletionGuard` — not in installed code
- unverified `shopware.reflectionOnNonPublicMethod` — rule identifier not found in installed vendor/shopware
- confirmed `Package` — attribute class used for #[Package] — vendor/shopware/core/Framework/Log/Package.php:16
- confirmed `CodeCoverageIgnoreEvaluationRule` — PHPStan rule class — vendor/shopware/core/DevOps/StaticAnalyze/PHPStan/Rules/CodeCoverageIgnoreEvaluationRule.php:32
- confirmed `NoCreateMockWithoutExpectationsRule` — reports createMock used as stub — vendor/shopware/core/DevOps/StaticAnalyze/PHPStan/Rules/Tests/NoCreateMockWithoutExpectationsRule.php:39
- confirmed `StaticEntityRepository` — test stub extending EntityRepository — vendor/shopware/core/Test/Stub/DataAbstractionLayer/StaticEntityRepository.php:31
- confirmed `StaticSystemConfigService` — test stub extending SystemConfigService — vendor/shopware/core/Test/Stub/SystemConfigService/StaticSystemConfigService.php:10
- confirmed `SeoUrlPersister` — reference class for write assertions — vendor/shopware/core/Content/Seo/SeoUrlPersister.php:24
- confirmed `EntityExtension::extendFields()` — exempt schema declaration method — vendor/shopware/core/Framework/DataAbstractionLayer/EntityExtension.php:18
