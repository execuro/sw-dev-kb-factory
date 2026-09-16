---
id: platform/dev/6.7/resources/references/adr/2022-02-28-consistent-deprecation-notices-in-core.md
title: Consistent deprecation notices in Core
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2022-02-28-consistent-deprecation-notices-in-core.html
sourceHash: b13b46b2f2e962881b8622d428d95ee3c379f1d6
codeCheckedAgainst: "6.7.13.0"
keywords: ["Feature::triggerDeprecationOrThrow", "trigger_deprecation", "@deprecated", "Feature::deprecatedMethodMessage", "Feature::deprecatedClassMessage", "FeatureException", "deprecation notice", "runtime deprecation", "major feature flag", "breaking change", "adr", "deprecation message format"]
summary: "ADR: every @deprecated annotation in core also triggers a runtime notice via Feature::triggerDeprecationOrThrow; message format and CI-skip keywords."
lastBuilt: 2026-09-15
---
## What it is

An architecture decision record (ADR, 2022) deciding that Shopware core pairs every `@deprecated` annotation with a runtime deprecation notice emitted through Symfony's `trigger_deprecation`, routed through one common helper on the `Feature` class. Before the decision, `@deprecated` only produced IDE warnings with no runtime effect.

## When to use

- You deprecate a class or method in core (or follow the same convention in a plugin) and need to know how the runtime notice is triggered.
- You run a plugin's test suite against a new Shopware version and want to understand where deprecation notices and stack traces come from.
- You wonder why deprecated code throws an exception once a major feature flag is active.

## Key steps / config

1. Keep the `@deprecated` annotation and additionally trigger a runtime notice at the same place. Notices may be conditional: if a parameter becomes required, only trigger when the method is called the old way.
2. Use the common helper in `Shopware\Core\Framework\Feature` (installed signature — flag first, message second):

```php
Feature::triggerDeprecationOrThrow(
    'v6.8.0.0',   // major flag in which the deprecation is removed
    Feature::deprecatedMethodMessage(self::class, __METHOD__, 'v6.8.0.0', 'NewFeature::method()')
);
```

3. Behaviour of the installed helper: if the major flag is active (or flags are registered and the flag is unknown), it throws `FeatureException::error(...)` ("Tried to access deprecated functionality: ..."); otherwise it adds a script-trace notice outside CLI and calls `trigger_deprecation`, except when `TESTS_RUNNING` is set. The core test pipeline runs with the major flag active, so core itself cannot rely on deprecated code.
4. Special cases that get an `@deprecated` annotation but no runtime notice are marked with keywords in the annotation so the CI check skips them — in the installed code these are `reason:becomes-internal` (will be `@internal` next major) and `reason:return-type-change` (return type changes), e.g. `@deprecated tag:v6.8.0 - reason:return-type-change - Will return self`.
5. A CI step (PHPStan rule or unit test) checks that every `@deprecated` method triggers a notice and vice versa.

### Message format

A message must name the deprecated method/class, the version in which it is removed, and the replacement:

- Bad: `Will be removed, use NewFeature::method() instead`
- Good: `Method OldFeature::method() will be removed in v6.5.0.0, use NewFeature::method() instead`

`Feature::deprecatedMethodMessage()` and `Feature::deprecatedClassMessage()` build messages in this shape (`Method "X::y()" is deprecated and will be removed in <version>. Use "<replacement>" instead.`).

## Essential identifiers

- `Shopware\Core\Framework\Feature`
- `Feature::triggerDeprecationOrThrow(string $majorFlag, string $message, ?string $introducedIn = null)`
- `Feature::deprecatedMethodMessage()`, `Feature::deprecatedClassMessage()`
- `trigger_deprecation` (Symfony)
- `FeatureException`

## Gotchas

- The ADR's proof-of-concept snippet has the parameters as `(string $message, string $majorFlag)` and throws `\RuntimeException`; the installed method takes the major flag first and throws a `FeatureException`.
- The ADR announced deprecating the older `Feature::triggerDeprecated()` because it only fired when the flag was already active (when the deprecated code is already removed). That method is not present in the installed code.
- Deprecations are silently skipped inside `Feature::silent()`/`Feature::callSilentIfInactive()` for the given flag.

## Code check (6.7.13.0)
- absent `triggerDeprecated` — old helper named in the ADR; not found in the installed code index
- corrected `Feature::triggerDeprecationOrThrow()` — docs: signature (message, majorFlag) throwing RuntimeException; installed is (majorFlag, message, introducedIn) throwing FeatureException — vendor/shopware/core/Framework/Feature.php:267
- confirmed `trigger_deprecation` — called when flag inactive and not in tests — vendor/shopware/core/Framework/Feature.php:287
- confirmed `Feature::isActive()` — used to decide throw vs notice — vendor/shopware/core/Framework/Feature.php:273
- confirmed `Feature::has()` — unknown flag leads to exception when flags registered — vendor/shopware/core/Framework/Feature.php:330
- confirmed `Feature::deprecatedMethodMessage()` — builds method deprecation message — vendor/shopware/core/Framework/Feature.php:295
- confirmed `Feature::deprecatedClassMessage()` — builds class deprecation message — vendor/shopware/core/Framework/Feature.php:315
- deprecated `reason:becomes-internal` — skip keyword, found on a deprecated annotation — vendor/shopware/core/Framework/Migration/MakeVersionableMigrationHelper.php:17
- deprecated `reason:return-type-change` — skip keyword, found on a deprecated annotation — vendor/shopware/core/Framework/Rule/RuleException.php:30
