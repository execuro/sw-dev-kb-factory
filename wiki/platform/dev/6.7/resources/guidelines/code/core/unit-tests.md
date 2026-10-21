---
id: platform/dev/6.7/resources/guidelines/code/core/unit-tests.md
title: Unit tests
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/guidelines/code/core/unit-tests.html
sourceHash: b2a2cdaeaa5723fd98a01546cc40fe37a84e4676
codeCheckedAgainst: "6.7.15.1"
keywords: ["unit tests", "phpunit", "CoversClass", "createStub", "StaticEntityRepository", "StaticSystemConfigService", "CollectingEventDispatcher", "CompletionGuard", "CodeCoverageIgnoreEvaluationRule", "NoCreateMockWithoutExpectationsRule", "shopware.reflectionOnNonPublicMethod", "mocks", "data providers", "test doubles"]
summary: "Core guideline for Shopware PHPUnit tests: one CoversClass, package ownership, stubs vs mocks, no DBAL mocking, event capture, enforcing PHPStan rules."
lastBuilt: 2026-10-21
---
## What it is

A core coding guideline (mirrored from the Shopware repository's `coding-guidelines/core/unit-tests.md`) describing how Shopware core unit tests are written, which test doubles to prefer, how to observe events, and which PHPStan/Danger rules enforce the conventions.

## When to use

When writing or reviewing PHPUnit tests for Shopware core (or code following core conventions): choosing between mocks, stubs and real implementations, structuring test files, or fixing a CI/PHPStan failure from one of the test rules.

## Key steps / config

**File structure and ownership**
- Every test class declares `#[Package('…')]` with the same package as the covered production domain (routes CI failures to the owning team).
- Exactly one `#[CoversClass]` per test file; a Danger rule fails added/modified test files covering more than one class.
- No traits in new unit test classes. Fixture builders go into a static fixture class such as `Shopware\Core\Test\Checkout\CartRuleFixture`, doubles of the class under test into a `Stub/` folder next to the test. Only lifecycle traits restoring state are allowed: `EnvTestBehaviour`, `EventDispatcherBehaviour`, Symfony's `ClockSensitiveTrait`.
- Test-only fixture classes used by one test file live in that file, below the test class; move to a shared `_fixtures` namespace once a second test needs them.

**Coverage**
- "100% coverage" means every use case of each service is tested, including failure cases.
- New source files get focused unit tests or `@codeCoverageIgnore` plus a `@see \Shopware\Tests\Integration\…\DedicatedIntegrationTest` docblock line (FQCN with leading `\`, no import, test dedicated to that class). `CodeCoverageIgnoreEvaluationRule` rejects the annotation on methods that do more than pass a value through (branching, mutation, discarded calls on `$this`/`self::`/`static::` or on a parameter, constructors configuring their parent); `EntityExtension::extendFields()` and `defineFields()` are exempt. A `@see` to a dedicated `\Shopware\Tests\Integration\…` or `\Shopware\Tests\DevOps\…` test lifts the check.

**Doubles**
- `createMock()` only with `->expects()`; otherwise `createStub()`. `NoCreateMockWithoutExpectationsRule` reports violations. A stub asserts arguments inside `willReturnCallback()` (`->with()` is mock-only); fixture helpers receiving a stub type it `Foo&Stub`, not `MockObject`.
- Prefer real implementations, then hand-crafted doubles (`StaticEntityRepository`, `StaticSystemConfigService`), and only then PHPUnit mocks.
- Never behavior-mock Doctrine DBAL `Connection` (asserting SQL or parameters). Treat SQL/DBAL classes as database adapters covered by integration tests.
- No reflective invocation (`->invoke()`, `->invokeArgs()`, `setAccessible()`) of private/protected methods of Shopware classes; PHPStan rule `shopware.reflectionOnNonPublicMethod` enforces this. Reading reflection metadata and reflecting into third-party classes stay acceptable.

**Asserting writes with no other seam** (reference: `SeoUrlPersister` write-protection guard). Prefer: 1) extract the decision into a collaborator with a public contract; 2) integration test against a real database; 3) drive the public method, stub reads, capture executed statements in one helper and assert on written values — never SQL text or parameter names — make sure `transactional()` actually invokes its closure, and confirm the test fails when the decision is flipped.

**Observing events**
- Never add/remove listeners on the shared `event_dispatcher` in a test.
- Preferred: unit test with a dispatcher the test owns — a `CollectingEventDispatcher` or mock dispatcher — and assert on `getEvents()` after the call (also for "nothing was dispatched").
- Otherwise an integration test captures the event through a container hook; capture in the hook, assert after the code ran, assert the hook fired (`assertNotNull`, `assertCount`).

**Other rules**
- Code under test must never call `exit()`/`die()`: call `$application->setAutoExit(false)` or use `CommandTester`. `Shopware\Core\Test\PHPUnit\CompletionGuard` fails a run that terminates early.
- Use `expectExceptionObject()` / `expectException*()` instead of manual `try/catch`.
- Named arguments for opaque literals in builder/helper calls; data providers with named cases instead of near-duplicate tests; assert observed arguments directly inside callbacks.
- Tests must be para-test compatible, clean up listeners and database/schema changes, and not depend on other tests' artifacts.

## Essential identifiers

- `#[Package('…')]`, `#[CoversClass]`, `@codeCoverageIgnore`, `@see`
- `Shopware\Core\Test\Checkout\CartRuleFixture`, `EnvTestBehaviour`, `EventDispatcherBehaviour`
- `StaticEntityRepository`, `StaticSystemConfigService`, `CollectingEventDispatcher`
- `Shopware\Core\Test\PHPUnit\CompletionGuard`
- `CodeCoverageIgnoreEvaluationRule`, `NoCreateMockWithoutExpectationsRule`, `shopware.reflectionOnNonPublicMethod`

## Gotchas

- Mock/stub API mismatches (`->with()` on a stub, `MockObject` type for a stub) pass at runtime and fail only in PHPStan.
- Code that catches and logs exceptions around a dispatch (`SendMailAction` around `MailSentEvent`, flow actions, message handlers) swallows assertions placed inside a listener; the test stays green.
- A `Connection` double whose `transactional()` ignores its closure makes every test pass without proving anything.
- A hook that alters the event, stops propagation or throws makes the test depend on listener order — last resort, comment it.

## Version notes

The source is mirrored from trunk and describes event-hook tooling not present in 6.7.15.1: the `EventHookDispatcher::fromContainer(...)->on(...)` helper, and the rules `NoRuntimeListenerOnSharedEventDispatcherRule` and `NoAssertionInEventHookRule`. The source ties the shared-dispatcher ban to Symfony 8.2 compiling that dispatcher.

## Code check (6.7.15.1)
- confirmed `CartRuleFixture` — static fixture class — vendor/shopware/core/Test/Checkout/CartRuleFixture.php:25
- confirmed `StaticEntityRepository` — hand-crafted repository double — vendor/shopware/core/Test/Stub/DataAbstractionLayer/StaticEntityRepository.php:33
- confirmed `CollectingEventDispatcher::getEvents()` — collects dispatched events — vendor/shopware/core/Test/Stub/EventDispatcher/CollectingEventDispatcher.php:37
- confirmed `CompletionGuard` — fails runs terminated before the runner finished — vendor/shopware/core/Test/PHPUnit/CompletionGuard/CompletionGuard.php:29
- confirmed `CodeCoverageIgnoreEvaluationRule` — PHPStan rule — vendor/shopware/core/DevOps/StaticAnalyze/PHPStan/Rules/CodeCoverageIgnoreEvaluationRule.php:34
- confirmed `NoCreateMockWithoutExpectationsRule` — PHPStan rule — vendor/shopware/core/DevOps/StaticAnalyze/PHPStan/Rules/Tests/NoCreateMockWithoutExpectationsRule.php:56
- confirmed `shopware.reflectionOnNonPublicMethod` — identifier of NoReflectionOnNonPublicMethodsRule — vendor/shopware/core/DevOps/StaticAnalyze/PHPStan/Rules/Tests/NoReflectionOnNonPublicMethodsRule.php:41
- absent `EventHookDispatcher` — not in the 6.7.15.1 code
- absent `NoRuntimeListenerOnSharedEventDispatcherRule` — not in the 6.7.15.1 code
- absent `NoAssertionInEventHookRule` — not in the 6.7.15.1 code
