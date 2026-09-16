---
id: "platform/dev/6.6/resources/guidelines/code/core/unit-tests.md"
title: "Unit tests"
docType: "developer"
version: "6.6"
versions: ["6.6"]
sourceUrl: "https://developer.shopware.com/docs/v6.6/resources/guidelines/code/core/unit-tests.html"
sourceHash: "20cd045b57a0ee1d4a471c86875772d72e025c9e"
keywords: ["unit tests", "mocking", "mocks", "test coverage", "para-test", "StaticEntityRepository", "StaticSystemConfigService", "integration tests", "phpunit", "test design", "teardown", "hexagonal architecture"]
summary: "Shopware's unit test expectations: full coverage, mocking discipline, cleanup, and why heavy mocking can indicate bad design."
lastBuilt: "2026-09-15"
---
## What it is

Guideline on writing unit tests in Shopware and on the influence of mocking discipline on software design.

## When to use

Apply when writing new unit or integration tests, or when deciding whether to mock a dependency.

## Key steps / config

Unit test expectations:
- Coverage of all use cases per service, not just a high coverage percentage.
- Attention to test performance as the suite grows.
- Use mocks to avoid expensive setup (e.g. database persistence) rather than out of habit.
- Readability so others can extend the tests easily.
- Extensibility for adding new cases without large rewrites.
- Modularity — a test must not fail because another test left artifacts.
- Cleanup — remove dynamically registered listeners on teardown, roll back schema/data changes.
- Cover failure cases, not just the happy path.
- Write true unit tests (instantiate services directly, mock dependencies) rather than always exercising the full request/service stack.
- Tests must be compatible with the para-test setup so anyone can run them locally quickly.

On mocks: use mocks only when constructing the real object requires many nested dependencies, or when the class under test produces unwanted side effects (e.g. DB writes); otherwise prefer the real implementation. Heavy mocking couples tests to implementation details, so refactors that preserve behavior (e.g. changing `$this->repository->search($criteria, $context)->first()?->getId()` to `$this->repository->searchIds($criteria, $context)->firstId()`) can break mock-heavy tests even though external behavior is unchanged. Heavy reliance on mocks can also indicate insufficient encapsulation in the design (Domain Driven Design / Hexagonal Architecture principles help here).

Better options than mocks, in order of preference: use the real implementation; use a hand-crafted dummy/stub (e.g. `StaticEntityRepository`, `StaticSystemConfigService`); fall back to phpunit's mocking framework only when the real thing cannot be easily replaced.

## Essential identifiers

- `StaticEntityRepository`
- `StaticSystemConfigService`
- para-test setup
- `teardown`

## Gotchas

- Mocking `repository`/`connection`-style dependencies too tightly can make refactors that don't change external behavior fail the unit tests anyway.
- Writing tests first is recommended so mocking-heavy patterns are avoided from the start.
