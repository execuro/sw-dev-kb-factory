---
id: platform/dev/6.7/resources/guidelines/code/backward-compatibility.md
title: Backward Compatibility
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/guidelines/code/backward-compatibility.html
sourceHash: 4a6a6d1b7f6def8f4c0eb1637e656cfc56ae835e
codeCheckedAgainst: "6.7.15.1"
keywords: ["backward compatibility", "bc break", "@deprecated", "@experimental", "@internal", "Shopware\\Core\\Framework\\Deprecation\\BCChange", "ReturnTypeNarrowing", "NewRequiredParameter", "BecomesFinal", "CallSiteCompatibilityChange", "ExtenderCompatibilityChange", "Feature::triggerDeprecationOrThrow", "major feature flag", "deprecation workflow"]
summary: Shopware BC rules - deprecation annotations, BCChange attributes for announced API changes, feature-flag workflow, allowed-changes sheet.
lastBuilt: 2026-10-21
---
## What it is

Shopware's guideline for keeping minor and patch releases backward compatible (semantic versioning). It defines the annotations for obsolete and unreleased code, the PHP attributes in `Shopware\Core\Framework\Deprecation\BCChange` that announce changes to symbols that stay, the feature-flag workflow for features and breaking changes, and a compatibility sheet for PHP, Storefront and Administration.

## When to use

When changing core code (or writing an extension) and you must know whether a change is allowed in a minor, how to announce it, and how extension code can be written today so it keeps working after the next major.

## Key steps / config

**Annotations**

```php
/** @deprecated tag:v6.8.0 - Use NewFunction() instead */
/** @experimental feature:FEATURE_FLAG stableVersion:v6.8.0 */
```

- `@deprecated` only when the symbol itself is removed/replaced; always name the major tag and the replacement.
- `@experimental` = unreleased code, treat like `@internal`; name its feature flag; `stableVersion` hints at the planned stable release.
- A symbol that stays but changes (return type, new parameter, becoming final, visibility) is announced with a BCChange attribute, not `@deprecated`. Former `@deprecated tag:vX.Y.Z - reason:*` markers are rejected by a PHPStan rule.

**BCChange attributes** — every attribute takes `version` plus a payload; it implements `CallSiteCompatibilityChange` (affects callers) and/or `ExtenderCompatibilityChange` (affects overriding classes):

| Attribute | Affects | Safe today |
|---|---|---|
| `ReturnTypeNarrowing` | extenders | declare announced type in override |
| `ReturnTypeWidening` | call sites | handle the wider type |
| `ParameterTypeNarrowing` / `ParameterTypeWidening` | callers / extenders | pass narrower / declare wider |
| `NewOptionalParameter` | extenders | add the parameter to the override |
| `NewRequiredParameter` | both | pass it now; add it as optional in override |
| `ParameterDefaultValueChange` | callers | pass the current value explicitly |
| `ParameterNameChange` | callers (named args) | use positional args |
| `ParameterRemoval` | callers | stop passing it; keep it in overrides |
| `ExceptionChange` | callers | catch current and announced exceptions |
| `BecomesAbstract` | extenders | implement the method now |
| `BecomesFinal` | extenders | switch to decoration/composition |
| `BecomesInternal` | both | stop using it |
| `VisibilityChange` | both | stop external access |
| `PropertyTypeNarrowing` / `PropertyTypeWidening` / `BecomesReadonly` | both | stop redeclaring the property |
| `ClassHierarchyChange` | both | stop relying on leaving ancestors (`description` is required) |

Adding a parameter to a public method (announce + runtime deprecation):

```php
#[NewRequiredParameter(version: 'v6.8.0', parameterName: 'precision', parameterType: 'int')]
public function calculate(ProductEntity $product, Context $context /* , int $precision */): Product
{
    if (\func_num_args() < 3) {
        Feature::triggerDeprecationOrThrow('v6.8.0.0', '...');
    }
    $precision = \func_num_args() >= 3 ? func_get_arg(2) : self::DEFAULT_PRECISION;
}
```

Controller actions with `#[Route]` must not trigger this runtime deprecation.

**Workflow (BC feature):** hide behind a feature flag; new public API gets `@internal` until release; obsolete code gets `@feature-deprecated`, replaced by `@deprecated` on release; breaking parts get `@major-deprecated` behind a major feature flag plus a separate changelog; new tests behind the flag, old ones declared legacy. **Breaking change:** everything behind a major feature flag, released only with the major.

**Compatibility sheet (PHP, highlights):** NO — change a typehint (add an abstract class instead), change a public constant value, make a class final, reduce visibility, add a method to an interface, remove public/protected members or events. PARTIAL — new optional args via `func_get_args()`, return-type changes via the attributes, new public method on an abstract class only if it has `getDecorated()`. YES — service constructor changes, private members, new events/constants.

**Storefront/Administration:** removing/renaming Twig blocks, variables, JS plugins/services, Vue slots, required props, routes and structural CSS (`display`, `position`, `visibility`, `z-index`, `pointer-events`, `overflow`, `transform`) is not allowed; use the deprecation workflow. Storefront Twig: `{% deprecated '@deprecated tag:v6.5.0 - ...' %}`; Administration templates use `{# @deprecated ... #}`. Admin components: `Shopware.Component.register('sw-old', { deprecated: '6.5.0' })`; props take a `deprecated: { version, comment }` object.

## Essential identifiers

- `Shopware\Core\Framework\Deprecation\BCChange` (namespace), `CallSiteCompatibilityChange`, `ExtenderCompatibilityChange`
- `#[ReturnTypeNarrowing]`, `#[NewRequiredParameter]`, `#[BecomesFinal]`, `#[ClassHierarchyChange]` and the other attributes in the table
- `Feature::triggerDeprecationOrThrow()`
- `@deprecated`, `@experimental`, `@internal`, `@feature-deprecated`, `@major-deprecated`

## Gotchas

- The docs list a `#[ClassMoved]` attribute (`Shopware\Core\Framework\Deprecation\BCChange\ClassMoved`, with `previousClassName` and an eager `class_alias()` of the old name). It does not exist in 6.7.15.1 — for namespace moves in this version do not rely on it.
- The attribute classes themselves are marked `@internal`: they are meant for core to announce changes; extension code reads them, it does not need to use them.
- Feature-flag names stay registered even when the behaviour behind them changes or is removed; flags are deprecated, never removed in a minor.
- Stale attributes fail the build once the announced version is released.

## Version notes

- The 6.7 docs add the `ClassMoved` attribute to the table; the installed 6.7.15.1 code has no such class.

## Code check (6.7.15.1)
- absent `Shopware\Core\Framework\Deprecation\BCChange\ClassMoved` — no ClassMoved attribute in the installed code; the BCChange directory has no such file
- confirmed `ReturnTypeNarrowing` — method attribute with `version`, `newType`, optional `description` — vendor/shopware/core/Framework/Deprecation/BCChange/ReturnTypeNarrowing.php:18
- confirmed `NewRequiredParameter` — repeatable method attribute, implements both marker interfaces — vendor/shopware/core/Framework/Deprecation/BCChange/NewRequiredParameter.php:20
- confirmed `BecomesFinal` — class attribute, extender change only — vendor/shopware/core/Framework/Deprecation/BCChange/BecomesFinal.php:17
- confirmed `ClassHierarchyChange` — `description` is a required constructor argument — vendor/shopware/core/Framework/Deprecation/BCChange/ClassHierarchyChange.php:19
- confirmed `CallSiteCompatibilityChange` — marker interface for changes affecting callers — vendor/shopware/core/Framework/Deprecation/BCChange/CallSiteCompatibilityChange.php:19
- confirmed `ExtenderCompatibilityChange` — marker interface for changes affecting overrides — vendor/shopware/core/Framework/Deprecation/BCChange/ExtenderCompatibilityChange.php:23
- confirmed `Feature::triggerDeprecationOrThrow()` — static, takes major flag and message — vendor/shopware/core/Framework/Feature.php:281
- confirmed `reason:return-type-change` — PHPStan rule rejects reason markers in favour of attributes — vendor/shopware/core/DevOps/StaticAnalyze/PHPStan/Rules/Deprecation/NoBCPlanningDeprecationRule.php:30
