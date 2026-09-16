---
id: platform/dev/6.7/resources/references/adr/2022-10-20-deprecation-handling-during-phpunit-test-execution.md
title: Deprecation handling during PHPUnit test execution
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2022-10-20-deprecation-handling-during-phpunit-test-execution.html
sourceHash: 1ed521d545127823c4c7aa3e46894f4e3eaa6812
codeCheckedAgainst: "6.7.13.0"
keywords: ["SYMFONY_DEPRECATIONS_HELPER", "ignoreFile", "@DisableFeatures", "@ActiveFeatures()", "Feature::triggerDeprecationOrThrow()", "TESTS_RUNNING", "phpunit bridge", "deprecation", "major feature flag", "unit tests", "forward compatibility", "phpunit"]
summary: "ADR: PHPUnit reports external deprecations via SYMFONY_DEPRECATIONS_HELPER + ignoreFile; tests run with major flags on, legacy ones use @DisableFeatures."
lastBuilt: 2026-09-15
---
## What it is

An architecture decision record (2022-10-20, area core) on how the Shopware PHPUnit suite detects use of deprecated functionality, with separate handling for external (library) and internal (Shopware) deprecations, so the code base stays forward compatible.

## When to use

When writing or maintaining Shopware PHPUnit tests that touch deprecated code paths, when a dependency update introduces new deprecation notices, or when you need to understand why tests run with major feature flags enabled.

## Key steps / config

External deprecations (Symfony PHPUnit Bridge):

1. Enable `SYMFONY_DEPRECATIONS_HELPER` for the test suite so that triggered deprecations are reported.
2. Use the bridge's `ignoreFile` option (regex per line) to ignore deprecations that cannot be fixed immediately:
   - all internal Shopware deprecations (handled by feature flags, below);
   - deprecations triggered inside external dependencies — comment each ignore with the triggering package so it can be removed after updating it;
   - large batches from a library update (e.g. DBAL API renames) — ignore **temporarily** and create a ticket.

Internal deprecations (feature flag system):

1. Internal deprecations go through `Feature::triggerDeprecationOrThrow($majorFlag, $message)`: it throws a `FeatureException` when the major flag is active, otherwise emits a deprecation notice.
2. All unit tests run with all major feature flags activated, so the default test behaviour is the new, non-deprecated one.
3. The previous `@ActiveFeatures()` annotation is replaced by `@DisableFeatures`, which disables the passed feature flags for a test case.
4. Tests that cover legacy behaviour are marked with `@DisableFeatures`, making them easy to find and delete once the deprecation is removed.

## Essential identifiers

- `SYMFONY_DEPRECATIONS_HELPER`, `ignoreFile`
- `Feature::triggerDeprecationOrThrow()`, `Feature::isActive()`
- `@DisableFeatures`

## Gotchas

- Before `ignoreFile` existed, enabling `SYMFONY_DEPRECATIONS_HELPER` was impractical because it also reported internal deprecations and ones from dependencies Shopware could not fix.
- Without flags activated by default, some tests only passed because they relied on deprecated behaviour, and forward compatibility could not be checked automatically.
- `Feature::triggerDeprecationOrThrow()` does not trigger a PHP deprecation when the `TESTS_RUNNING` environment variable is set; the flag behaviour itself is covered by tests.
- The plugin scaffolding `phpunit.xml` stub sets `SYMFONY_DEPRECATIONS_HELPER` to `weak`, which does not fail tests on deprecations.

## Code check (6.7.13.0)
- confirmed `Feature::triggerDeprecationOrThrow()` — signature (majorFlag, message, introducedIn) — vendor/shopware/core/Framework/Feature.php:267
- confirmed `FeatureException` — thrown when the major flag is active — vendor/shopware/core/Framework/Feature.php:274
- confirmed `TESTS_RUNNING` — skips trigger_deprecation during tests — vendor/shopware/core/Framework/Feature.php:281
- confirmed `Feature::isActive()` — flag check used by the deprecation helper — vendor/shopware/core/Framework/Feature.php:128
- confirmed `SYMFONY_DEPRECATIONS_HELPER` — plugin scaffold phpunit stub sets value weak — vendor/shopware/core/Framework/Plugin/Command/Scaffolding/stubs/phpunit-xml.stub:16
- unverified `@DisableFeatures` — test-suite annotation, core test code is not shipped in vendor/shopware
- unverified `@ActiveFeatures()` — test-suite annotation, not shipped in vendor/shopware
- unverified `ignoreFile` — Symfony PHPUnit Bridge option, vendor/symfony out of scope
