---
id: "platform/dev/6.6/resources/references/adr/2022-10-20-deprecation-handling-during-phpunit-test-execution.md"
title: "Deprecation handling during PHPUnit test execution"
docType: "developer"
version: "6.6"
versions: ["6.6"]
sourceUrl: "https://developer.shopware.com/docs/v6.6/resources/references/adr/2022-10-20-deprecation-handling-during-phpunit-test-execution.html"
sourceHash: "1ed521d545127823c4c7aa3e46894f4e3eaa6812"
keywords: ["SYMFONY_DEPRECATIONS_HELPER", "ignoreFile", "PHPUnit Bridge", "@ActiveFeatures", "@DisableFeatures", "feature flag", "deprecation handling", "phpunit", "internal deprecation", "external deprecation"]
summary: "ADR: PHPUnit uses SYMFONY_DEPRECATIONS_HELPER with an ignoreFile, and @DisableFeatures replaces @ActiveFeatures for internal deprecations."
lastBuilt: "2026-09-15"
---
## What it is
ADR on detecting and managing deprecated-code usage in Shopware's PHPUnit test suite, split between external (3rd-party dependency) and internal deprecations.

## When to use
Relevant when writing PHPUnit tests that must stay forward-compatible, or when a test intentionally exercises deprecated/feature-flagged behavior.

## Key steps / config
- External deprecations: enable Symfony's `SYMFONY_DEPRECATIONS_HELPER` (from Symfony's PHPUnit Bridge) so any deprecation triggers a test failure.
- Use an `ignoreFile` (regex-based) to ignore deprecations that cannot be fixed immediately — internal deprecations, deprecations from inside external dependencies (commented with the triggering package), and deprecations too costly to fix right away, each meant to be removed once addressed.
- Internal deprecations: the feature-flag system is used to trigger deprecation notices/exceptions. The workflow changes so all unit tests run with all major feature flags activated by default.
- The `@ActiveFeatures()` annotation is removed and replaced by `@DisableFeatures`, which disables the passed feature flags for a test (the inverse behavior), making legacy/deprecated-path tests explicit and easy to find and remove.

## Essential identifiers
`SYMFONY_DEPRECATIONS_HELPER`, `ignoreFile`, `@ActiveFeatures()`, `@DisableFeatures`.

## Gotchas
Tests relying on deprecated behavior must be marked with `@DisableFeatures`; without it, the default (all-flags-on) run treats deprecated code paths as the exceptional case.
