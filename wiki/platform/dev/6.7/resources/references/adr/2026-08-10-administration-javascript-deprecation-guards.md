---
id: platform/dev/6.7/resources/references/adr/2026-08-10-administration-javascript-deprecation-guards.md
title: Administration JavaScript deprecation guards
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2026-08-10-administration-javascript-deprecation-guards.html
sourceHash: 6647666a6c5119394ba0f07f170e6cd20290d996
codeCheckedAgainst: "6.7.13.0"
keywords: ["Shopware.Feature.triggerDeprecationOrThrow", "Feature::triggerDeprecationOrThrow", "@deprecated", "@private", "$super", "V6_9_0_0", "eslint rule", "deprecation warning", "administration extension api", "computed facade", "next major flag", "adr"]
summary: "ADR: Admin JS deprecations get runtime guards via Shopware.Feature.triggerDeprecationOrThrow(); warn before major flag, throw once active; ESLint enforced."
lastBuilt: 2026-09-15
---
## What it is

Architecture decision record: Administration JSDoc `@deprecated tag:vX.Y.0` annotations get a runtime counterpart, `Shopware.Feature.triggerDeprecationOrThrow(majorFlag, message)`, mirroring PHP `Feature::triggerDeprecationOrThrow()`, plus an ESLint rule enforcing it for public, runtime-detectable APIs.

## When to use

Deprecating a public Administration API in core, or understanding why an extension gets deprecation warnings (or errors under the next-major flag).

## Key steps / config

Before the major flag is active the helper emits a development warning with message and call site; once active it throws an `Error`. Call it only where the deprecated functionality is consumed.

```ts
Feature.triggerDeprecationOrThrow(
    'V6_9_0_0',
    'Shopware.Service("example").oldMethod() is deprecated; use newMethod() instead.',
);
```

Guards are required for public:

- global `Shopware.*` APIs, registered services, exported functions (at call boundary);
- registered components at mount/creation, and deprecated props when supplied;
- deprecated `methods`/`computed` of extension targets — guarded while resolving `this.$super(member)`, and inside the member for direct calls;
- Twig blocks, in the legacy Twig override shim. Component events are out of initial scope.

Public legacy `data` field: private backing field plus computed facade:

```ts
data() { return { _legacyField: initialValue }; },
computed: {
    legacyField: {
        get() { Feature.triggerDeprecationOrThrow('V6_9_0_0', '...'); return this._legacyField; },
        set(value) { Feature.triggerDeprecationOrThrow('V6_9_0_0', '...'); this._legacyField = value; },
    },
},
```

No runtime guard: `@private` declarations and `_`-prefixed identifiers (take precedence over `@deprecated`, may change immediately). Static-only: types, SCSS, tests, core-only Twig markup, `data`/store state/getters without a facade, watchers, `provide`/`inject`.

ESLint rule (phased): links a leading `@deprecated tag:vX.Y.0` to its symbol, validates the major flag, requires a matching `triggerDeprecationOrThrow` call for public symbols, skips private ones, and demands an explicit static-only reason otherwise. First covers direct APIs, props, methods/computed; Twig blocks later.

## Essential identifiers

- `Shopware.Feature.triggerDeprecationOrThrow(majorFlag, message)`
- `Feature::triggerDeprecationOrThrow()` (PHP)
- `@deprecated tag:vX.Y.0`, `@private`
- `this.$super(member)`

## Gotchas

- An object with `get`/`set` returned from `data()` is plain data, not a Vue accessor.
- The facade does not preserve `$data.legacyField` or key enumeration.
- Core must migrate before enabling the major flag; the thrown error reveals missed uses.
- Installed 6.7.13.0 `src/core/feature.ts` has no `triggerDeprecationOrThrow` yet (only `init`, `getAll`, `isActive`).

## Code check (6.7.13.0)
- unverified `Shopware.Feature.triggerDeprecationOrThrow()` — not present in installed Administration `src`; the ADR postdates 6.7.13.0
- confirmed `Feature::triggerDeprecationOrThrow()` — PHP helper throws when major flag active, else notice — vendor/shopware/core/Framework/Feature.php:267
- confirmed `Shopware.Feature` — Administration global exposes the `Feature` registry — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:214
- confirmed `Feature::isActive()` — current Administration feature API method — vendor/shopware/administration/Resources/app/administration/src/core/feature.ts:29
- confirmed `$super` — component factory types `$super(name, ...args)` — vendor/shopware/administration/Resources/app/administration/src/core/factory/async-component.factory.ts:919
