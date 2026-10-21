---
id: platform/dev/6.7/resources/references/adr/2026-09-25-remove-deprecated-services-with-major-feature-flags.md
title: Remove deprecated services with major feature flags
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2026-09-25-remove-deprecated-services-with-major-feature-flags.html
sourceHash: 4e77287676cd0fe03c787361684a7651c2fcc0c6
codeCheckedAgainst: "6.7.15.1"
keywords: ["FeatureFlagCompilerPass", "shopware.feature", "Feature::triggerDeprecationOrThrow", "APP_BUILD_DIR", "FEATURE_ALL", "v6.8.0.0", "services.php", "routes.php", "deprecated service", "service alias removal", "major feature flag", "container compilation", "adr"]
summary: "ADR: deprecated services/aliases get removed at container compile time when their major flag is active; partly unimplemented in 6.7.15.1"
lastBuilt: 2026-10-21
---
## What it is

An architecture decision record (2026-09-25): when a major removal flag (e.g. `v6.8.0.0`) is active, the compiled DI container should no longer contain deprecated service definitions and deprecated Symfony service aliases, so tests in major mode see the post-removal service graph. It also covers the side effects on Twig functions and controller routes.

## When to use

- Deprecating a service, service alias, Twig extension or controller in core for removal in a major.
- Running or writing tests in major mode and wondering why a deprecated service, console command or route is still (or no longer) present.

## Key steps / config

Constraint: PHP service configuration is loaded before the feature registry is initialised, so calling `Feature::isActive()` inside `services.php` cannot decide registration. The decision therefore happens in `FeatureFlagCompilerPass`, which already registers the flags from the `shopware.feature.flags` container parameter and handles the existing `shopware.feature` tag (removes a *new* service while its flag is inactive; the tag requires a `flag` attribute).

Decision (proposed by the ADR):

1. A service scheduled for removal gets a removal tag naming its major flag; the compiler pass removes the definition when that flag is active. If the flag is not registered yet, the service stays.
2. Deprecated Symfony service aliases (which cannot carry tags) are listed by alias ID under their removal flag in a constant on `FeatureFlagCompilerPass`; the pass removes the alias, not its target. In `services.php` an adjacent `// @deprecated tag:vX.Y.Z` comment names the removal version; `->deprecate()` keeps emitting Symfony's notice.
3. PHPStan enforces both: a class with a versioned `@deprecated` annotation, or a deprecated `$services->set()` registration, needs the removal tag; an annotated `$services->alias()` must appear in the alias list.
4. Keep `Feature::triggerDeprecationOrThrow()` calls in deprecated methods, since the class can still be instantiated directly and the flag can differ at runtime.
5. Controllers: exclude the deprecated controller from the broad attribute route import and import it only while the flag is inactive (`src/Core/Framework/Resources/config/routes.php`):

```php
$legacyController = '../../Api/Controller/LegacyController.php';
$routes->import('../../Api/Controller/**/*Controller.php', 'attribute', exclude: $legacyController);

if (!Feature::isActive('v6.8.0.0')) {
    $routes->import($legacyController, 'attribute');
}
```

## Essential identifiers

- `FeatureFlagCompilerPass` (`Shopware\Core\Framework\DependencyInjection\CompilerPass\FeatureFlagCompilerPass`)
- DI tag `shopware.feature` (attribute `flag`), container parameter `shopware.feature.flags`
- `Feature::isActive()`, `Feature::triggerDeprecationOrThrow()`
- `services.php` `$services->set()` / `$services->alias()` / `->deprecate()`, `routes.php` `$routes->import()`
- Env: `FEATURE_ALL`, `APP_BUILD_DIR`

## Gotchas

- 6.7.15.1 does not contain the ADR's new pieces: no `shopware.inactiveFeature` tag, no `FeatureFlagCompilerPass::ALIASES_TO_REMOVE`, no `CompatTwigExtension`, and no `ClassAliasRegistry`. The installed `FeatureFlagCompilerPass` only handles `shopware.feature`.
- In 6.7.15.1 `Feature::triggerDeprecationOrThrow()` returns early when `Feature::$emitDeprecations` is false, so disabling deprecation emission also skips the major-mode throw; the ADR requires the opposite.
- In 6.7.15.1 the kernel cache hash covers the cache id, version revision and active plugins only, not `FEATURE_ALL` or major flags. With `APP_BUILD_DIR` set, the build dir is `APP_BUILD_DIR/<env>` regardless of feature state; use a distinct `APP_BUILD_DIR` per major mode.
- A booted kernel keeps its container until reboot; `Feature::setActive()` does not change the cache hash. Long-running workers must reboot or restart after env changes.
- A removed console command service disappears from the command map ("command not found") although the class remains.
- Twig parses function calls in inactive branches, so removing a Twig extension can break template compilation; the ADR registers removed function names in `CompatTwigExtension` (throwing when called) while the flag is active.
- Removing a controller service does not remove its attribute route; Symfony may still instantiate the class. A route condition is not enough (URL generation still works).

## Version notes

Applies to removals for the next major (6.8). The alias list needs maintenance until those aliases are removed permanently in the major release.

## Code check (6.7.15.1)
- absent `ALIASES_TO_REMOVE` — alias removal list proposed by the ADR is not in the installed code
- absent `shopware.inactiveFeature` — removal tag not in the installed code
- absent `CompatTwigExtension` — compatibility Twig extension not in the installed code
- absent `ClassAliasRegistry` — not found in the installed code
- confirmed `FeatureFlagCompilerPass` — compiler pass registering flags and filtering tagged services — vendor/shopware/core/Framework/DependencyInjection/CompilerPass/FeatureFlagCompilerPass.php:11
- confirmed `shopware.feature.flags` — container parameter passed to `Feature::registerFeatures()` — vendor/shopware/core/Framework/DependencyInjection/CompilerPass/FeatureFlagCompilerPass.php:15
- confirmed `shopware.feature` — tagged services removed while their `flag` is inactive — vendor/shopware/core/Framework/DependencyInjection/CompilerPass/FeatureFlagCompilerPass.php:22
- corrected `Feature::triggerDeprecationOrThrow()` — docs: throw must not depend on deprecation emission; installed returns early if `$emitDeprecations` is false — vendor/shopware/core/Framework/Feature.php:281
- corrected `Kernel::getCacheHash()` — docs: includes `FEATURE_ALL` and major flags; installed hashes cache id, revision and active plugins only — vendor/shopware/core/Kernel.php:316
- confirmed `APP_BUILD_DIR` — build dir is `APP_BUILD_DIR` plus `/` and the environment — vendor/shopware/core/Kernel.php:182
