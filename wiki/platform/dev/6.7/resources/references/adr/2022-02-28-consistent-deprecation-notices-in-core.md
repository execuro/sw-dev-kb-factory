---
id: platform/dev/6.7/resources/references/adr/2022-02-28-consistent-deprecation-notices-in-core.md
title: Consistent deprecation notices in Core
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2022-02-28-consistent-deprecation-notices-in-core.html
sourceHash: b13b46b2f2e962881b8622d428d95ee3c379f1d6
codeCheckedAgainst: "6.7.15.1"
keywords: ["deprecation", "deprecation notice", "@deprecated", "trigger_deprecation", "Feature::triggerDeprecationOrThrow", "Feature::deprecatedMethodMessage", "Feature::deprecatedClassMessage", "Feature", "major feature flag", "runtime deprecation", "breaking change", "adr"]
summary: "ADR: every @deprecated in core also triggers a runtime notice via Feature::triggerDeprecationOrThrow, which throws when the major flag is active."
lastBuilt: 2026-10-21
---
## What it is

An architecture decision record (dated 2022-02-09 in its metadata, area core). `@deprecated` annotations only warn in the IDE and have no runtime effect; PHP/Symfony's `trigger_deprecation` was used only sparsely. The decision: wherever core uses a `@deprecated` annotation it also emits a runtime deprecation notice, through one common implementation in the `Feature` class.

## When to use

When deprecating a core method, class or parameter, or when running a plugin's test suite against a new Shopware version to collect all deprecations with message and stack trace.

## Key steps / config

1. Add the `@deprecated` annotation **and** a runtime notice. Notices may be conditional: if only a new parameter becomes required, trigger only when the method is called the old way.
2. Call the common helper. In 6.7 the signature is:
   ```php
   public static function triggerDeprecationOrThrow(string $majorFlag, string $message, ?string $introducedIn = null, ?string $silentUntil = null): void
   ```
   Core usage:
   ```php
   Feature::triggerDeprecationOrThrow(
       'v6.8.0.0',
       Feature::deprecatedMethodMessage(self::class, __METHOD__, 'v6.8.0.0', '<replacement>')
   );
   ```
   If the major flag is active (or, with registered features, unknown) it throws `Tried to access deprecated functionality: <message>`; otherwise it emits a deprecation notice. This keeps core itself from relying on deprecated code, since a test pipeline runs with the major flag on.
3. Use a consistent message containing: the deprecated method/class, the version in which it is removed, and what to use instead. Good: `Method OldFeature::method() will be removed in v6.5.0.0, use NewFeature::method() instead`. Bad: `Will be removed, use NewFeature::method() instead`. `Feature::deprecatedMethodMessage()` and `Feature::deprecatedClassMessage()` build this format (`Method "X::y()" is deprecated and will be removed in <version>. Use "<replacement>" instead.`).
4. CI (a custom PHPStan rule or unit test) checks that every `@deprecated` method also triggers a notice and vice versa. Exempt via special keywords in the annotation: members that become `internal` in the next major, and methods whose return type changes.

## Essential identifiers

- `Shopware\Core\Framework\Feature::triggerDeprecationOrThrow()`
- `Feature::deprecatedMethodMessage()`, `Feature::deprecatedClassMessage()`
- `Feature::isActive()`, `Feature::has()`
- `@deprecated`, `trigger_deprecation`

## Gotchas

- The ADR's POC takes `(string $message, string $majorFlag)`; the installed method takes the major flag **first**, then the message.
- The ADR mentions `Feature::triggerDeprecated()` as the old helper to be deprecated; it no longer exists in 6.7 core.
- Notices are skipped while `TESTS_RUNNING` is set, when deprecations are not emitted, when the flag is silenced, or when `$silentUntil` names an inactive flag.

## Version notes

- The message example targets v6.5.0.0; 6.7 core calls use `v6.8.0.0`.
- 6.7 adds `$introducedIn` (passed as the version to the deprecation triggerer with package `shopware/core`) and `$silentUntil` to the original POC.

## Code check (6.7.15.1)
- absent `triggerDeprecated` — old Feature helper named in the ADR, removed from core
- corrected `Feature::triggerDeprecationOrThrow()` — docs: `(string $message, string $majorFlag)`; code: `(string $majorFlag, string $message, ?string $introducedIn, ?string $silentUntil)` — vendor/shopware/core/Framework/Feature.php:281
- corrected `Feature::triggerDeprecationOrThrow()` — docs: throws `\RuntimeException('Deprecated Functionality: ...')`; code throws FeatureException with `Tried to access deprecated functionality:` — vendor/shopware/core/Framework/Feature.php:301
- confirmed `Feature::deprecatedMethodMessage()` — builds the standard method message — vendor/shopware/core/Framework/Feature.php:327
- confirmed `Feature::deprecatedClassMessage()` — builds the standard class message — vendor/shopware/core/Framework/Feature.php:347
- confirmed `Feature::isActive()` — flag check used by the helper — vendor/shopware/core/Framework/Feature.php:139
- confirmed `Feature::has()` — registered-flag check — vendor/shopware/core/Framework/Feature.php:362
- confirmed `TESTS_RUNNING` — suppresses the triggered notice in tests — vendor/shopware/core/Framework/Feature.php:313
