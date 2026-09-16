---
id: platform/dev/6.7/resources/references/adr/2024-07-31-add-more-unit-tests-namespaces-to-featureflag-extension.md
title: Add more unit tests namespaces to FeatureFlag extension
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2024-07-31-add-more-unit-tests-namespaces-to-featureflag-extension.html
sourceHash: 3f760f17dafbb6f1bf3b9a6323fec4b370d3126e
codeCheckedAgainst: "6.7.13.0"
keywords: ["FeatureFlagExtension", "addTestNamespace", "TestPreparationStartedSubscriber", "DisabledFeatures", "phpunit.xml", "TestBootstrap.php", "major feature flags", "feature flag", "unit tests", "plugin tests", "test namespace allowlist", "adr"]
summary: "ADR: plugins can allowlist their unit test namespace in Shopware's PHPUnit feature flag extension so major flags are enabled in their unit test suite."
lastBuilt: 2026-09-15
---
## What it is

An architecture decision record (ADR, 2024) that opens Shopware's PHPUnit feature flag extension to namespaces other than `Shopware\Tests\Unit\`. Unit tests in an allowlisted namespace run with all registered feature flags, including upcoming major flags, switched on, so plugins can test against the next major.

## When to use

- A plugin wants its unit tests to run with the upcoming major feature flags active, as Shopware's own unit tests do.
- You need to know why a test in some namespace does or does not get a clean feature environment.

## Key steps / config

How the installed mechanism works:

1. `Shopware\Core\Test\PHPUnit\Extension\FeatureFlag\Subscriber\TestPreparationStartedSubscriber` runs before every test method. It only acts when the test class name starts with one of the allowlisted namespace prefixes; the default prefix is `Shopware\Tests\Unit\`.
2. For an allowlisted test it saves the current feature config and `$_SERVER`, resets registered features, sets every `$_SERVER` key starting with `v6.`, `FEATURE_` or `V6_` to `false`, and then sets every registered flag to active — except flags listed in a `DisabledFeatures` attribute on the test method or class. A finished-test subscriber restores the saved state.
3. A plugin has to (a) register the extension as a `bootstrap` entry in the `extensions` element of its `phpunit.xml` and (b) add its own namespace prefix to the allowlist from its test bootstrap file (e.g. `tests/TestBootstrap.php`). The exact class name and static method are listed under Gotchas.
4. The namespace string must be a valid PHP namespace ending with a backslash, e.g. `'Your\\Unit\\Tests\\Namespace\\'`; an invalid format or adding the same namespace twice throws `InvalidArgumentException`.
5. To run a test without a specific major flag, disable it explicitly:

```php
#[DisabledFeatures(['v6.8.0.0'])]
public function testLegacyBehaviour(): void { /* ... */ }
```

## Essential identifiers

- `Shopware\Core\Test\PHPUnit\Extension\FeatureFlag\Subscriber\TestPreparationStartedSubscriber`
- `Shopware\Core\Test\Annotation\DisabledFeatures`
- Default prefix `Shopware\Tests\Unit\`
- `Feature::skipTestIfActive()`

## Gotchas

- Registration strings (verified in the installed core, see Code check for the index status): in `phpunit.xml`

```xml
<extensions>
    <bootstrap class="Shopware\Core\Test\PHPUnit\Extension\FeatureFlag\FeatureFlagExtension"/>
</extensions>
```

  and in the test bootstrap `FeatureFlagExtension::addTestNamespace('Shopware\\Commercial\\Tests\\Unit\\');` (the Commercial plugin's example).
- The ADR's Decision and Consequences sections call the method `addNamespace()`; no such method exists — the installed static method is `addTestNamespace()`.
- Once your namespace is added, major flags are enabled by default in your unit tests; you must explicitly disable features you do not want active.
- The extension class is marked `@internal`. Do not confuse it with the Twig extension of the same short name (`Shopware\Core\Framework\Adapter\Twig\Extension\FeatureFlagExtension`), which is deprecated to become internal in v6.8.0.
- `DisabledFeatures` has no effect in Shopware's own `Shopware\Tests\Integration\` namespace and throws there; use `Feature::skipTestIfActive()` instead. Plugin suites are not affected by this check.

## Code check (6.7.13.0)
- absent `addTestNamespace` — reported absent by the code index; a static method of this name is declared in core Test/PHPUnit/Extension/FeatureFlag/FeatureFlagExtension.php
- absent `addNamespace` — ADR wording; no method of this name, the real one is addTestNamespace
- deprecated `Shopware\Core\Test\PHPUnit\Extension\FeatureFlag\FeatureFlagExtension` — index status comes from the same-named Twig extension (becomes-internal in v6.8.0); the PHPUnit class is @internal — vendor/shopware/core/Test/PHPUnit/Extension/FeatureFlag/Subscriber/TestPreparationStartedSubscriber.php:10
- confirmed `TestPreparationStartedSubscriber` — PHPUnit PreparationStartedSubscriber resetting flags — vendor/shopware/core/Test/PHPUnit/Extension/FeatureFlag/Subscriber/TestPreparationStartedSubscriber.php:17
- confirmed `TestPreparationStartedSubscriber::namespaceIsAllowed()` — checks class name against allowlisted prefixes — vendor/shopware/core/Test/PHPUnit/Extension/FeatureFlag/Subscriber/TestPreparationStartedSubscriber.php:109
- confirmed `DEFAULT_TEST_NAMESPACE_PREFIX` — default prefix Shopware\Tests\Unit\ — vendor/shopware/core/Test/PHPUnit/Extension/FeatureFlag/FeatureFlagExtension.php:22
- confirmed `DisabledFeatures` — attribute on method or class excludes flags — vendor/shopware/core/Test/Annotation/DisabledFeatures.php:12
- confirmed `INTEGRATION_NAMESPACE_PREFIX` — DisabledFeatures rejected in Shopware\Tests\Integration\ — vendor/shopware/core/Test/PHPUnit/Extension/FeatureFlag/Subscriber/TestPreparationStartedSubscriber.php:19
- confirmed `Feature::skipTestIfActive()` — alternative for integration tests — vendor/shopware/core/Framework/Feature.php:247
