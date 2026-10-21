---
id: platform/dev/6.7/resources/guidelines/code/core/backward-compatibility.md
title: Backward compatibility
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/guidelines/code/core/backward-compatibility.html
sourceHash: a38344b5135ac6f72221e62e3522c11cd73c61d1
codeCheckedAgainst: "6.7.15.1"
keywords: ["backward compatibility", "bc break", "breaking change", "deprecation", "Feature::triggerDeprecationOrThrow", "Feature::silent", "BCChange", "@deprecated tag:v6.8.0", "silentUntil", "public api", "feature.yaml", "major flag", "bc-checker", "upgrade"]
summary: Shopware core BC rules - what counts as a break, public API surfaces, deprecation mechanics, BCChange attributes and per-surface minor-release rules.
lastBuilt: 2026-10-21
---
## What it is

The core guideline (mirrored from `coding-guidelines/core/backward-compatibility.md`) that is the single source of truth for backward compatibility, deprecations and breaking changes in the Shopware repository. A change is a break if "a merchant, agency, extension partner, app developer, theme developer, integration, or hosting setup needs to change something in order to upgrade successfully" — behaviour, data, default, config and runtime-requirement changes count even when signatures stay the same. `@internal`/`@experimental`/private code, protected members of `@final` classes and tests are not covered.

## When to use

When you plan, review or document a core change that third parties could observe, deprecate a symbol, or decide whether a change may land in a minor release ("minor" includes patch).

## Key steps / config

**Classify** each externally relevant change as Breaking, Announced removal, Behaviour, Migration, Config/Ops or Internal, and name the audiences: Extensions, Apps, Themes, Custom Code, Integrations, Agencies, Ops.

**A break is acceptable only if** it is intentional, announced through a deprecation, has a clear migration path, its ecosystem impact is understood, and it takes effect only in the next major. Accidental breaks are bugs. The PR answers: what breaks, who is affected, can it be avoided, and keep/make compatible/postpone/remove/discuss. Prefer forwarding shims, class aliases or delegating decorators when usage is significant.

**Public API** is every extension surface: non-`@internal` PHP symbols, public service ids and tags, events and payloads, Store/Admin API routes and DAL entity definitions, Storefront Twig blocks/variables, JS plugins, CSS selectors, snippet keys, Administration components/props/slots/`Shopware.*`/position identifiers, app manifest/hooks/webhooks, `shopware.yaml` keys, env vars, CLI commands, and major flag names such as `v6.8.0.0`. New Store API routes use extension events, not abstract route classes.

**Deprecating** states what is deprecated, the breaking version as a three-part tag (`@deprecated tag:v6.8.0`, not the four-part flag id), the replacement, whether migration is mechanical or behavioural, the surface, and whether callers or extenders break.

- The replacement must already be usable from plugins and apps; if it exists only behind a major flag, add `silentUntil:`.
- Executable deprecated code calls `Feature::triggerDeprecationOrThrow(string $majorFlag, string $message, ?string $introducedIn = null, ?string $silentUntil = null)` — warns before the major, throws once the flag is active.
- Core never triggers its own deprecations; where core must keep calling the old path, wrap it in `Feature::silent($flagName, $closure)`.
- A symbol that stays but changes gets an attribute from `Shopware\Core\Framework\Deprecation\BCChange` instead of `@deprecated`. Installed: `BecomesAbstract`, `BecomesFinal`, `BecomesInternal`, `BecomesReadonly`, `ClassHierarchyChange`, `ExceptionChange`, `ExperimentalReplacement`, `NewOptionalParameter`, `NewRequiredParameter`, `ParameterDefaultValueChange`, `ParameterNameChange`, `ParameterRemoval`, `ParameterTypeNarrowing`, `ParameterTypeWidening`, `PropertyTypeNarrowing`, `PropertyTypeWidening`, `ReturnTypeNarrowing`, `ReturnTypeWidening`, `VisibilityChange` — each implementing `CallSiteCompatibilityChange` (breaks callers) and/or `ExtenderCompatibilityChange` (breaks extenders).

**Flags**: a flag does not make a change BC; the flag-off path must behave like the previous release. Major flags stay in `feature.yaml` after the major (default on, not toggleable); other flags are removed once enabled.

**Not in a minor** (examples per surface):

- PHP: remove/rename public or protected symbols, change public constant values, types (PHPDoc too), visibility, `static`/`final`; add interface or abstract methods. Allowed: change DI service constructors, add non-abstract methods to an abstract decorator with `getDecorated()`, add parameters via `func_get_arg()` with `#[NewOptionalParameter]`/`#[NewRequiredParameter]`.
- Events/decorators: change dispatch point, reset what listeners added, narrow type hints to the concrete core class.
- Database: drop/rename tables or columns (only in `updateDestructive()` of the next major), break blue-green; never change a released migration.
- Store/Admin API: remove fields, add required params, change types, status codes or result-changing defaults; never add a core route without OpenAPI schema.
- Storefront: remove/move Twig blocks (deprecate with `{# @deprecated tag:vX.Y.0 - ... #}`), change structural CSS (`display`, `position`, `visibility`, `z-index`, `pointer-events`, `overflow`, `transform`).
- Administration: remove components/props/slots/routes, add required props, stop calling overridable methods.
- Config/Ops: remove config keys or env vars, change behaviour-changing defaults, require new infrastructure. New `shopware.yaml` keys go into `config-schema.json`; announce version raises and new scheduled tasks in `RELEASE_INFO`.

## Essential identifiers

- `Feature::triggerDeprecationOrThrow()`, `Feature::silent()`
- `Shopware\Core\Framework\Deprecation\BCChange`, `BCChangeAttribute`
- `@deprecated tag:v6.8.0`, `silentUntil`, `feature.yaml`
- CI: `bc-checker`, `.bc-exclude.php`, `DeprecatedMethodsThrowDeprecationRule`, `BCChangeAttributeUsageRule`, `NoBCPlanningDeprecationRule`, `StoreApiRouteExtensionRule`, `AnnotationTagTest`, `ApiRoutesHaveASchemaTest`

## Gotchas

- The guideline lists a `ClassMoved` attribute (move a class with `#[ClassMoved]` plus a class alias), but 6.7.15.1 has no such attribute in `BCChange`; use a class alias only.
- A return type change that is neither narrowing nor widening has no attribute: add a new method and deprecate the old one.
- `@deprecated reason:*` markers fail CI.
- Removing an `@experimental` feature still needs a deprecation for the next major.
- CI misses behaviour changes, defaults, Twig variable scope, JS API changes and HTTP semantics — review by hand.

## Code check (6.7.15.1)
- confirmed `Feature::triggerDeprecationOrThrow()` — static method with `$majorFlag`, `$message`, `$introducedIn`, `$silentUntil` — vendor/shopware/core/Framework/Feature.php:281
- confirmed `Feature::silent()` — runs a closure with the flag's deprecations silenced — vendor/shopware/core/Framework/Feature.php:236
- confirmed `BCChangeAttribute` — base interface of the BC-change attributes — vendor/shopware/core/Framework/Deprecation/BCChange/BCChangeAttribute.php:32
- confirmed `CallSiteCompatibilityChange` — marker for attributes that break callers — vendor/shopware/core/Framework/Deprecation/BCChange/CallSiteCompatibilityChange.php:19
- confirmed `ExtenderCompatibilityChange` — marker for attributes that break extenders — vendor/shopware/core/Framework/Deprecation/BCChange/ExtenderCompatibilityChange.php:23
- confirmed `BecomesFinal` — extender-breaking attribute — vendor/shopware/core/Framework/Deprecation/BCChange/BecomesFinal.php:17
- confirmed `NewOptionalParameter` — extender-breaking attribute — vendor/shopware/core/Framework/Deprecation/BCChange/NewOptionalParameter.php:18
- confirmed `NewRequiredParameter` — breaks callers and extenders — vendor/shopware/core/Framework/Deprecation/BCChange/NewRequiredParameter.php:20
- confirmed `v6.8.0.0` — major flag in feature.yaml with `major: true`, `toggleable: false` — vendor/shopware/core/Framework/Resources/config/packages/feature.yaml:16
- absent `ClassMoved` — named by the docs but not present in the BCChange namespace or elsewhere in the 6.7.15.1 code
