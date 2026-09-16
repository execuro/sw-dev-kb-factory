---
id: platform/dev/6.7/resources/guidelines/code/backward-compatibility.md
title: Backward Compatibility
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/guidelines/code/backward-compatibility.html
sourceHash: 8d83af6a51f0933d496619fe88729a5c7bbe93fc
codeCheckedAgainst: "6.7.13.0"
keywords: ["backward compatibility", "bc break", "@deprecated", "@experimental", "@internal", "@feature-deprecated", "@major-deprecated", "Feature::triggerDeprecationOrThrow", "func_get_args", "feature flag", "semantic versioning", "deprecation workflow", "compatibility sheet"]
summary: Shopware BC rules for minor/patch releases - deprecation annotations, feature-flag workflows, allowed/forbidden PHP, Twig, JS, CSS and admin changes.
lastBuilt: 2026-09-15
---
## What it is

Shopware's contributor guideline for keeping minor and patch releases backward compatible (semantic versioning). It defines the annotations for planned removals and changes, feature-flag workflows for BC features and breaking changes, a compatibility sheet of allowed changes in PHP, Storefront and Administration code, and examples for each deprecation pattern.

## When to use

- You change public PHP API, Twig blocks, JS plugins/services, CSS selectors or admin components and must keep third-party extensions working.
- You maintain an extension and need to know how Shopware announces removals and signature changes.

## Key steps / config

**Annotations**

```php
/**
 * @deprecated tag:v6.8.0 - Use NewFunction() instead
 */
/**
 * @experimental feature:FEATURE_FLAG stableVersion:v6.8.0
 */
```

- `@deprecated` always names the major version of removal and the replacement; old code is removed only in a major.
- `@experimental` marks unreleased code (treat like `@internal`); name the feature flag and planned `stableVersion`.
- Planned changes to symbols that stay (signature, default value, visibility, becoming final, class hierarchy) are announced in the installed 6.7.13.0 code as `@deprecated tag:v6.8.0 - reason:<reason>` markers, e.g. `reason:new-optional-parameter`, `reason:return-type-change`, `reason:parameter-default-change`, `reason:becomes-final`, `reason:class-hierarchy-change`; a PHPStan rule holds the allowed reason list.

**BC feature workflow (minor release)**

| Case | Development | Feature release | Next major |
|---|---|---|---|
| Feature flag | hide code behind flag | remove flag | |
| New code | `@internal` | remove `@internal` | |
| Obsolete code | `@feature-deprecated` | switch to `@deprecated` | remove |
| Breaking change | `@major-deprecated` + major flag + changelog | | remove code and flag |
| Tests | behind flag | remove flag, old tests legacy | remove legacy |

**Breaking change** — major only; develop on `trunk` behind a major feature flag, mark obsolete/breaking code `@major-deprecated`.

**Adding a parameter** (public/protected method, interface, non-service constructor) — optional only, read via `func_get_args()`, with a runtime deprecation for legacy callers (not in `#[Route]` controller actions):

```php
public function calculate(ProductEntity $product, Context $context /* , int $precision */): Product
{
    if (\func_num_args() < 3) {
        Feature::triggerDeprecationOrThrow('v6.8.0.0', '...');
    }
    $precision = \func_num_args() >= 3 ? func_get_arg(2) : self::DEFAULT_PRECISION;
}
```

**PHP sheet**: allowed — service constructor changes, private arguments/constants/members, new events and constants. Forbidden — changing typehints (add an abstract class: `MailService extends AbstractMailService`), public constant values, namespaces, static state, making classes final, reducing visibility, new interface methods, removing public/protected members or events. New abstract-class methods only when it already has `getDecorated()`.

**Storefront/Administration**: do not remove or rename Twig blocks, variables, template paths, CSS selectors, JS plugins/services/methods/events, Vue slots, required props, routes or the global `Shopware` API — use the deprecation workflow. Structural CSS (`display`, `position`, `visibility`, `z-index`, `pointer-events`, `overflow`, `transform`) must not change.

```twig
{% block the_block_name %}
    {% deprecated '@deprecated tag:v6.5.0 - Block will be removed completely including the content' %}
{% endblock %}
```

Administration templates use `{# @deprecated tag:v6.5.0 - ... #}`; admin components pass `deprecated: '6.5.0'` to `Shopware.Component.register`.

**Feature flags** are part of the BC promise: never removed in a minor, only deprecated; the behaviour behind them may change.

## Essential identifiers

- `@deprecated tag:vX.Y.Z`, `@experimental`, `@internal`, `@feature-deprecated`, `@major-deprecated`
- `reason:new-optional-parameter`, `reason:return-type-change`, `reason:becomes-final`
- `Feature::triggerDeprecationOrThrow()`, `func_get_args()`, `getDecorated()`
- Twig `{% deprecated %}` tag

## Gotchas

- The docs say not to use plain `@deprecated` for a symbol that stays but changes, since static analysis flags every usage. Their example `Context::scope()` (new optional `$states`) is in 6.7.13.0 still marked `@deprecated tag:v6.8.0 - reason:new-optional-parameter`, with signature `scope(string $scope, \Closure $callback): mixed`.
- `CreatedByField::__construct()` changes its default to include `Context::CRUD_API_SCOPE` in 6.8; pass `[Context::SYSTEM_SCOPE]` to keep current behaviour.
- `Criteria::getIncludes()` may return `null`; use `?? []`.
- `ProductListingResult` is marked `@deprecated tag:v6.8.0 reason:class-hierarchy-change`: it will no longer extend `EntitySearchResult` (keeps extending `Struct`), so stop type-hinting against `EntitySearchResult` for it.

## Version notes

The docs describe PHP attributes in `Shopware\Core\Framework\Deprecation\BCChange` (e.g. `#[ReturnTypeNarrowing]`, `#[NewOptionalParameter]`, `#[BecomesFinal]`, `#[VisibilityChange]`) with marker interfaces `CallSiteCompatibilityChange`/`ExtenderCompatibilityChange`, replacing `reason:*` markers. They are not in the installed 6.7.13.0 core. The documented opt-in advice applies either way: declare narrower return or wider parameter types in overrides, add announced parameters as optional, catch current and announced exceptions, use positional arguments before renames, and replace inheritance with decoration before a class becomes final.

## Code check (6.7.13.0)
- absent `Shopware\Core\Framework\Deprecation\BCChange\ReturnTypeNarrowing` — docs attribute not present in the installed code index
- absent `Shopware\Core\Framework\Deprecation\BCChange` — namespace not present in the installed code index; announcements use reason markers
- deprecated `Context::scope()` — marked `@deprecated tag:v6.8.0 - reason:new-optional-parameter`; docs show `callable` and `void` — vendor/shopware/core/Framework/Context.php:203
- deprecated `CreatedByField::__construct()` — marked `reason:parameter-default-change` — vendor/shopware/core/Framework/DataAbstractionLayer/Field/CreatedByField.php:25
- deprecated `Criteria::getIncludes()` — marked `reason:return-type-change`, no native return type yet — vendor/shopware/core/Framework/DataAbstractionLayer/Search/Criteria.php:559
- confirmed `Feature::triggerDeprecationOrThrow()` — signature `(string $majorFlag, string $message, ?string $introducedIn = null)` — vendor/shopware/core/Framework/Feature.php:267
- corrected `reason:new-optional-parameter` — docs: reason markers are migrated away; PHPStan rule still lists them — vendor/shopware/core/DevOps/StaticAnalyze/PHPStan/Rules/Deprecation/DeprecatedMethodsThrowDeprecationRule.php:44
- unverified `CallSiteCompatibilityChange` — no match in vendor/shopware/core; not a Tier 0 flag
- deprecated `ProductListingResult` — marked `@deprecated tag:v6.8.0 reason:class-hierarchy-change`, still extends EntitySearchResult — vendor/shopware/core/Content/Product/SalesChannel/Listing/ProductListingResult.php:16
- confirmed `RuleConditionRegistry` — class currently not final, no deprecation docblock — vendor/shopware/core/Framework/Rule/Collector/RuleConditionRegistry.php:11
