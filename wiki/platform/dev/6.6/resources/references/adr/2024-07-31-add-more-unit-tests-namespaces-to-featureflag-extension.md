---
id: platform/dev/6.6/resources/references/adr/2024-07-31-add-more-unit-tests-namespaces-to-featureflag-extension.md
title: Add more unit tests namespaces to FeatureFlag extension
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: "https://developer.shopware.com/docs/v6.6/resources/references/adr/2024-07-31-add-more-unit-tests-namespaces-to-featureflag-extension.html"
sourceHash: "3f760f17dafbb6f1bf3b9a6323fec4b370d3126e"
keywords: ["FeatureFlagExtension", "TestPreparationStartedSubscriber", "addTestNamespace", "phpunit.xml", "major feature flag", "unit tests namespace", "Shopware\\Tests\\Unit", "PHPUnit extension", "TestBootstrap.php", "plugin unit tests"]
summary: "ADR letting plugins register extra namespaces with `FeatureFlagExtension::addTestNamespace()` so major flags apply in their PHPUnit suites."
lastBuilt: "2026-09-15"
---
## What it is
This ADR documents extending `Shopware\Core\Test\PHPUnit\Extension\FeatureFlag\Subscriber\TestPreparationStartedSubscriber`, which previously only considered the `Shopware\Tests\Unit` namespace, so plugins can also enable upcoming major feature flags in their own unit test suites.

## When to use
Relevant when a plugin (e.g. the Commercial plugin) wants its PHPUnit unit tests to run with the upcoming major's feature flags enabled by default, the same way core's own unit tests do.

## Key steps / config
- A static method `addNamespace()` is added to `Shopware\Core\Test\PHPUnit\Extension\FeatureFlag\FeatureFlagExtension`, letting additional namespaces be added to the allowlist considered when enabling major flags in the unit test suite.
- Register the PHPUnit extension in `phpunit.xml`:

```xml
<extensions>
    ...
    <bootstrap class="Shopware\Core\Test\PHPUnit\Extension\FeatureFlag\FeatureFlagExtension"/>
</extensions>
```

- Register the plugin's own test namespace in its test bootstrap file:

```php
FeatureFlagExtension::addTestNamespace('Your\\Unit\\Tests\\Namespace\\');
```

- Example from the Commercial plugin's `tests/TestBootstrap.php`:

```php
FeatureFlagExtension::addTestNamespace('Shopware\\Commercial\\Tests\\Unit\\');
```

## Essential identifiers
- `Shopware\Core\Test\PHPUnit\Extension\FeatureFlag\Subscriber\TestPreparationStartedSubscriber`
- `Shopware\Core\Test\PHPUnit\Extension\FeatureFlag\FeatureFlagExtension::addNamespace()`
- `FeatureFlagExtension::addTestNamespace()`

## Gotchas
Once a namespace is registered via `addNamespace()`, major feature flags are enabled by default for its unit tests — any test that should not run under the upcoming major must explicitly disable that feature rather than relying on it being off by default.
