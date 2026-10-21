---
id: platform/dev/6.7/resources/references/adr/2026-08-10-administration-javascript-deprecation-guards.md
title: Administration JavaScript deprecation guards
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2026-08-10-administration-javascript-deprecation-guards.html
sourceHash: 6647666a6c5119394ba0f07f170e6cd20290d996
codeCheckedAgainst: "6.7.15.1"
keywords: ["Shopware.Feature.triggerDeprecationOrThrow", "Feature::triggerDeprecationOrThrow()", "@deprecated tag:vX.Y.0", "@private", "this.$super", "V6_9_0_0", "administration deprecation", "runtime deprecation warning", "major feature flag", "eslint rule", "computed facade", "extension api"]
summary: "ADR: Administration gets Shopware.Feature.triggerDeprecationOrThrow() to warn on deprecated public JS APIs and throw once the major flag is active."
lastBuilt: 2026-10-21
---
## What it is

An architecture decision record (2026-08-10, area administration) that gives deprecated Administration JavaScript APIs a runtime lifecycle matching PHP's `Feature::triggerDeprecationOrThrow()`. JSDoc `@deprecated tag:vX.Y.0` annotations alone produce no runtime behaviour, so extensions could use deprecated APIs in their tests without a warning, and core could keep using them after the next-major flag is enabled.

## When to use

- You maintain or extend Administration code and need to know which deprecated members get a runtime guard and which stay static-only.
- You are upgrading an extension and want to understand the warnings/errors raised by deprecated Administration APIs in next-major mode.

## Key steps / config

1. **Runtime helper.** The ADR adds `Shopware.Feature.triggerDeprecationOrThrow(majorFlag, message)` to the Administration feature API. Before the major flag is active it emits a development deprecation warning with a migration message and call site; once the flag is active it throws an `Error`. It is called only at the boundary where the deprecated functionality is consumed. Core must migrate to the replacement before the major flag is enabled.

```ts
Feature.triggerDeprecationOrThrow(
    'V6_9_0_0',
    'Shopware.Service("example").oldMethod() is deprecated; use newMethod() instead.',
);
```

2. **Public, detectable APIs that need a guard** (when public):
   - global `Shopware.*` APIs, registered services, and directly exported functions, at their call boundary;
   - registered components at mount/creation, and deprecated props when the prop is supplied;
   - deprecated component `methods` and `computed` members of supported extension targets — the legacy component factory can guard while resolving `this.$super(member)`; a guard inside the member also covers direct calls;
   - Twig blocks, when the legacy Twig override shim receives the overridden block name.
3. **Legacy public `data` field.** Move core to a private backing field (`_legacyField`) and expose a `computed` getter/setter facade that calls the guard in both `get()` and `set(value)`. An object with `get`/`set` returned from `data()` is plain data, not a Vue accessor. The facade does not preserve `$data.legacyField` or key enumeration.
4. **Private and static-only symbols.** `@private` on the declaration, or a name starting with `_`, takes precedence over `@deprecated`: no runtime guard, may be changed or removed immediately. Static-only: types, interfaces, SCSS, tests, core-only Twig markup, unobservable state reads, `data`/store state/getters without a facade, watchers, `provide`/`inject`.
5. **Enforcement.** A phased Administration ESLint rule associates a leading `@deprecated tag:vX.Y.0` with the declared symbol, validates the major flag, and requires a matching `triggerDeprecationOrThrow` call for public runtime-detectable symbols. It skips private/underscore symbols and requires an explicit static-only reason for other exceptions. Initial scope: direct APIs, public component props, component methods/computed. Twig blocks follow with their shim.

## Essential identifiers

- `Shopware.Feature.triggerDeprecationOrThrow(majorFlag, message)` (ADR-defined)
- `Feature::triggerDeprecationOrThrow()` (PHP counterpart)
- `@deprecated tag:vX.Y.0`, `@private`
- `this.$super(...)`

## Gotchas

- Component events are not in the initial enforcement scope; they need a dedicated listener-presence boundary.
- Reachability through a Vue component does not make a member public; supported extension points must be documented/registered as public.
- `data` is inherited instance state but not part of the `$super` mechanism and has no generic per-property access hook.
- Existing annotations are classified before the rule becomes blocking; new public deprecations must comply immediately.

## Version notes

In the installed 6.7.15.1 code the Administration `Feature` class exposes only `init`, `getAll` and `isActive`; the `triggerDeprecationOrThrow` helper is not yet present there. Only the PHP helper exists.

## Code check (6.7.15.1)
- unverified `Shopware.Feature.triggerDeprecationOrThrow()` — not found anywhere in administration src of 6.7.15.1; ADR decision not yet implemented there
- confirmed `Feature::triggerDeprecationOrThrow()` — PHP helper with `$majorFlag`, `$message` — vendor/shopware/core/Framework/Feature.php:281
- confirmed `Feature.isActive()` — existing Administration feature API — vendor/shopware/administration/Resources/app/administration/src/core/feature.ts:24
- confirmed `FeatureService` — Administration feature service wrapping `isActive` — vendor/shopware/administration/Resources/app/administration/src/app/service/feature.service.ts:13
- confirmed `this.$super` — component factory resolves `$super` chains for methods — vendor/shopware/administration/Resources/app/administration/src/core/factory/async-component.factory.spec.js:1100
- unverified `V6_9_0_0` — example major flag; not found in core Framework yaml config
