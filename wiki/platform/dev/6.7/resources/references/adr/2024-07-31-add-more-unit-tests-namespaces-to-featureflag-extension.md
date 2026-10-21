---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/resources/references/adr/2024-07-31-add-more-unit-tests-namespaces-to-featureflag-extension.md
sourceHash: 3f760f17dafbb6f1bf3b9a6323fec4b370d3126e
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2024-07-31-add-more-unit-tests-namespaces-to-featureflag-extension.html
title: Add more unit tests namespaces to FeatureFlag extension
version: "6.7"
versions: ["6.7"]
keywords: ["adr", "FeatureFlagExtension", "TestPreparationStartedSubscriber", "feature flags", "major flags", "phpunit", "phpunit.xml", "unit tests", "test namespace", "plugin tests", "TestBootstrap.php", "DisabledFeatures", "namespace allowlist"]
summary: ADR 2024-07-31 - plugins can register extra unit test namespaces in FeatureFlagExtension so major feature flags are enabled in their PHPUnit suites.
lastBuilt: 2026-10-21
---
## What it is

An architecture decision record: `Shopware\Core\Test\PHPUnit\Extension\FeatureFlag\Subscriber\TestPreparationStartedSubscriber` originally only treated the `Shopware\Tests\Unit` namespace as eligible for enabling major feature flags in unit tests. The decision adds a static registration method on `Shopware\Core\Test\PHPUnit\Extension\FeatureFlag\FeatureFlagExtension` so other namespaces (e.g. plugin test suites) can be added to that allowlist.

## When to use

A plugin wants its PHPUnit unit tests to run with the upcoming major feature flags enabled, the same way Shopware's own unit suite does.

## Key steps / config

1. Register the extension in `phpunit.xml`:

```xml
<extensions>
    <bootstrap class="Shopware\Core\Test\PHPUnit\Extension\FeatureFlag\FeatureFlagExtension"/>
</extensions>
```

2. In your test bootstrap file (the Commercial plugin uses `tests/TestBootstrap.php`), call the extension's static namespace-registration method with your unit test namespace, e.g. `'Shopware\\Commercial\\Tests\\Unit\\'` (method name: see Gotchas).
3. In the installed code, the namespace must be a valid PHP namespace ending with a backslash, and registering the same namespace twice throws an `\InvalidArgumentException`. `Shopware\Tests\Unit\` is always present by default.
4. `TestPreparationStartedSubscriber` checks each test class against the extension's static list of registered namespaces; for matching tests all registered feature flags are switched on, except those listed in a `#[DisabledFeatures]` attribute on the test method or class.

## Essential identifiers

- `Shopware\Core\Test\PHPUnit\Extension\FeatureFlag\FeatureFlagExtension`
- `Shopware\Core\Test\PHPUnit\Extension\FeatureFlag\Subscriber\TestPreparationStartedSubscriber`
- `Shopware\Core\Test\Annotation\DisabledFeatures`

## Gotchas

- Method name: the ADR text calls it `addNamespace()` in one place and `addTestNamespace()` in its examples. The installed file `FeatureFlagExtension.php` (under the `Test/` directory, which the code index skips) declares `addTestNamespace(string $namespace)`; `addNamespace` does not exist there. The registered list is read back through `getTestNamespaces()`, also only under `Test/`.
- Once your namespace is registered, major flags are on by default in your unit suite; you must explicitly disable features you do not want active (via `#[DisabledFeatures]`).
- Both classes are marked `@internal`.

## Code check (6.7.15.1)
- absent `addTestNamespace` — not in the installed code index (the index skips Test/ directories)
- absent `addNamespace` — not in the installed code index
- absent `getTestNamespaces` — not in the installed code index (the index skips Test/ directories)
- confirmed `FeatureFlagExtension` — PHPUnit extension class — vendor/shopware/core/Test/PHPUnit/Extension/FeatureFlag/FeatureFlagExtension.php:20
- confirmed `FeatureFlagExtension::$testNamespaces` — defaults to Shopware\Tests\Unit\ prefix — vendor/shopware/core/Test/PHPUnit/Extension/FeatureFlag/FeatureFlagExtension.php:27
- confirmed `TestPreparationStartedSubscriber` — subscriber registered by the extension — vendor/shopware/core/Test/PHPUnit/Extension/FeatureFlag/Subscriber/TestPreparationStartedSubscriber.php:17
- confirmed `TestPreparationStartedSubscriber::namespaceIsAllowed()` — matches class against registered namespaces — vendor/shopware/core/Test/PHPUnit/Extension/FeatureFlag/Subscriber/TestPreparationStartedSubscriber.php:109
- confirmed `DisabledFeatures` — attribute excludes flags from activation — vendor/shopware/core/Test/PHPUnit/Extension/FeatureFlag/Subscriber/TestPreparationStartedSubscriber.php:46
