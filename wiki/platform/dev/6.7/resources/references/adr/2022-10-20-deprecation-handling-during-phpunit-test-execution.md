---
id: platform/dev/6.7/resources/references/adr/2022-10-20-deprecation-handling-during-phpunit-test-execution.md
title: Deprecation handling during PHPUnit test execution
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2022-10-20-deprecation-handling-during-phpunit-test-execution.html
sourceHash: 1ed521d545127823c4c7aa3e46894f4e3eaa6812
codeCheckedAgainst: "6.7.15.1"
keywords: ["SYMFONY_DEPRECATIONS_HELPER", "ignoreFile", "@DisableFeatures", "@ActiveFeatures", "phpunit bridge", "deprecation", "feature flags", "major feature flag", "Feature::triggerDeprecationOrThrow", "unit tests", "forward compatibility", "adr"]
summary: "ADR: PHPUnit fails on external deprecations via SYMFONY_DEPRECATIONS_HELPER + ignoreFile; unit tests run with all major flags on, @DisableFeatures opts out."
lastBuilt: 2026-10-21
---
## What it is

An architecture decision record (2022-10-20, area core) defining how the Shopware PHPUnit test suite detects usage of deprecated functionality, so deprecations are removed as they appear and the code base stays forward compatible. External (library) and internal (Shopware) deprecations are handled by two different mechanisms.

## When to use

When a test fails because a deprecation was triggered, when you add a dependency update that introduces many new deprecations, or when you write tests that intentionally cover deprecated code paths and must keep them running until the deprecation is removed.

## Key steps / config

### External deprecations — Symfony PHPUnit Bridge

- Enable the `SYMFONY_DEPRECATIONS_HELPER` of Symfony's PHPUnit Bridge for the test suite, so encountered deprecations are reported and fail the run.
- Previously impossible, because the helper also reported internal deprecations and deprecations triggered inside external dependencies that Shopware cannot fix. The bridge's `ignoreFile` option (regex list) solves this. Use it to ignore:
  1. all internal deprecations (handled by feature flags, see below);
  2. deprecations triggered inside external dependencies — each ignore commented with the package that triggers it, so it can be dropped once that dependency is updated;
  3. deprecations too numerous to fix immediately (e.g. a library such as DBAL renaming a large part of its public API) — ignored **temporarily**, with a ticket to remove them.

### Internal deprecations — feature flag system

- Internally, deprecations are emitted through the feature flag system: a deprecation message is triggered, or an exception thrown when the major feature flag is active (see the consistent deprecation notices ADR of 2022-02-28). In 6.7 that is `Shopware\Core\Framework\Feature::triggerDeprecationOrThrow($majorFlag, $message, ...)`.
- The old unit-test annotation `@ActiveFeatures()` required flags to be enabled explicitly. Problems: tests that rely on deprecated behaviour already fail once deprecations are removed; forward compatibility cannot be checked automatically because tests ran without major flags by default; tests that exist only for legacy behaviour were hard to spot.
- New workflow:
  1. All unit tests run with **all major feature flags activated**.
  2. `@ActiveFeatures()` is removed; `@DisableFeatures` does the opposite — it disables the passed feature flags for that test.
- Result: the default test behaviour is the new, non-deprecated behaviour; deprecated code paths are the exception, and every test marked `@DisableFeatures` can simply be deleted when the underlying deprecation is removed.

## Essential identifiers

- `SYMFONY_DEPRECATIONS_HELPER` (env var), `ignoreFile` (PHPUnit Bridge option)
- `@DisableFeatures` (test annotation), formerly `@ActiveFeatures()`
- `Feature::triggerDeprecationOrThrow()`, `Feature::isActive()`, `Feature::skipTestIfActive()`, `Feature::skipTestIfInActive()`

## Gotchas

- Internal deprecated code paths must keep working and stay covered by tests — that is why they are excluded from the Symfony helper and handled through feature flags instead.
- Ignores for vendor deprecations should name the triggering package; ignores for bulk library deprecations are meant to be temporary.
- The plugin scaffolding's generated `phpunit.xml` sets `SYMFONY_DEPRECATIONS_HELPER` to `weak`, which does not fail on deprecations — tighten it in your own plugin if you want this ADR's behaviour.

## Code check (6.7.15.1)
- confirmed `SYMFONY_DEPRECATIONS_HELPER` — set to weak in the plugin phpunit.xml scaffold stub — vendor/shopware/core/Framework/Plugin/Command/Scaffolding/stubs/phpunit-xml.stub:16
- confirmed `Feature::triggerDeprecationOrThrow()` — triggers deprecation or throws under the major flag — vendor/shopware/core/Framework/Feature.php:281
- confirmed `Feature::isActive()` — feature flag state lookup — vendor/shopware/core/Framework/Feature.php:139
- confirmed `Feature::skipTestIfActive()` — test helper for flag-dependent tests — vendor/shopware/core/Framework/Feature.php:261
- confirmed `Feature::skipTestIfInActive()` — test helper for flag-dependent tests — vendor/shopware/core/Framework/Feature.php:252
- unverified `@DisableFeatures` — defined in the test suite, outside the checked vendor roots
- unverified `@ActiveFeatures` — removed per ADR; test suite is outside the checked vendor roots
- unverified `ignoreFile` — Symfony PHPUnit Bridge option, vendor/symfony out of scope
