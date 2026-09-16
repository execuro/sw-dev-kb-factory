---
id: platform/dev/6.6/resources/references/adr/2022-02-28-consistent-deprecation-notices-in-core.md
title: Consistent deprecation notices in Core
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: "https://developer.shopware.com/docs/v6.6/resources/references/adr/2022-02-28-consistent-deprecation-notices-in-core.html"
sourceHash: "b13b46b2f2e962881b8622d428d95ee3c379f1d6"
keywords: ["deprecation notice", "@deprecated", "trigger_deprecation", "Feature::triggerDeprecated()", "triggerDeprecationOrThrow", "runtime deprecation", "major feature flag", "PHPStan rule", "annotation", "architecture decision record"]
summary: "ADR: every @deprecated annotation in core must also throw a runtime trigger_deprecation notice, via a new Feature helper method."
lastBuilt: "2026-09-15"
---
## What it is
Architecture decision record establishing that `@deprecated` annotations in Shopware core must be paired with a runtime deprecation notice via `trigger_deprecation`.

## When to use
When deprecating a method or class in core, or writing a plugin test suite that wants runtime deprecation feedback.

## Key steps / config
- Wherever a `@deprecated` annotation is added, also throw a deprecation notice at runtime using `trigger_deprecation`, optionally only when the deprecated code path is actually used.
- A CI check (custom PHPStan rule or unit test) verifies every `@deprecated`-annotated method also triggers a notice, and vice versa.
- Exceptions to the CI check: methods deprecated because they become `internal` next major, or because their return type changes — mark these with special keywords so CI skips them.
- Proposed common helper in the `Feature` class:

```php
public static function triggerDeprecationOrThrow(string $message, string $majorFlag): void
{
    if (self::isActive($majorFlag) || !self::has($majorFlag)) {
        throw new \RuntimeException('Deprecated Functionality: ' . $message);
    }
    trigger_deprecation('', '', $message);
}
```

- The existing `Feature::triggerDeprecated()` method is planned for deprecation since it only fires when the flag is active, by which point the deprecated code is already removed.
- Deprecation message format must include: the deprecated method/class name, the version it will be removed in, and what to use instead — e.g. "Method OldFeature::method() will be removed in v6.5.0.0, use NewFeature::method() instead".

## Essential identifiers
- `@deprecated` annotation
- `trigger_deprecation`
- `Feature::triggerDeprecated()`
- `Feature::triggerDeprecationOrThrow()` (proposed)
