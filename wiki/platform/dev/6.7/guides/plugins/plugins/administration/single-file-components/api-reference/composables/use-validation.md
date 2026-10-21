---
id: platform/dev/6.7/guides/plugins/plugins/administration/single-file-components/api-reference/composables/use-validation.md
title: useValidation()
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/single-file-components/api-reference/composables/use-validation.html
sourceHash: 50ff118ce3d2c7f1361a083935f413f8de31857d
codeCheckedAgainst: "6.7.15.1"
keywords: ["useValidation", "shopware:composables", "validate", "validateRule", "validationService", "ValidationRules", "validation mixin", "isValid", "form field validation", "admin composable", "validation rules"]
summary: "Admin composable useValidation() checks a value against validation rules from validationService; replaces the validation mixin, no isValid."
lastBuilt: 2026-10-21
---
## What it is

`useValidation()` is an Administration composable, imported from `shopware:composables`, that runs a value against validation rules. A rule set can be a boolean, a rule name, a comma-separated list of names, or an array of either. It replaces the `validation` mixin.

## When to use

Use it in a Composition API Administration field component that accepts a `validation` prop and needs to decide whether its current value is valid.

## Key steps / config

Signature (as installed):

```ts
import { useValidation } from 'shopware:composables';

function useValidation(options: { validation: () => ValidationRules }): {
    validationService: ValidationService;
    validate: (value: unknown) => boolean;
    validateRule: (value: unknown, rule: string) => boolean;
};
```

Usage:

```ts
const { validate } = useValidation({ validation: () => props.validation });
const isValid = computed(() => validate(currentValue.value));
```

1. Pass the rules as a getter (`validation: () => props.validation`) so they stay reactive when the component's `validation` prop changes.
2. Call `validate(value)` with the value yourself, typically inside a `computed`.
3. How `validate()` evaluates the rules in the installed code:
   - boolean: returned as-is;
   - a single rule name: checked with `validateRule()`;
   - a comma-separated string: split on `,` and treated as an array;
   - an array: every entry must pass - booleans count as themselves, strings are trimmed and checked via `validateRule()`, anything else fails.
4. `validateRule(value, rule)` calls the function of that name on the injected `validationService`; an unknown rule name returns `false`.

## Essential identifiers

- `useValidation` (from `shopware:composables`)
- `validate()`, `validateRule()`, `validationService`
- `ValidationRules` type, option `validation`
- replaced mixin: `validation`

## Gotchas

- No `isValid`: the mixin also exposed an `isValid` computed that read the host's current value under whichever of `currentValue`, `value` or `selections` happened to exist. A composable cannot guess that name, so it is not there - pass the value to `validate()` yourself.
- The rules themselves come from the injected `validationService`; it is injected with a `null` default, so outside a provider every named rule returns `false`.

## Version notes

In 6.7.15.1 the composable is marked `@experimental` with stable version v6.9.0. The `validation` mixin stays in place for Options API components and is kept in sync with the composable.

## Code check (6.7.15.1)
- confirmed `useValidation()` — exported composable returning validationService, validate, validateRule — vendor/shopware/administration/Resources/app/administration/src/app/composables/use-validation.ts:35
- confirmed `UseValidationOptions` — `validation` option is a getter — vendor/shopware/administration/Resources/app/administration/src/app/composables/use-validation.ts:20
- confirmed `validationService` — injected with null default — vendor/shopware/administration/Resources/app/administration/src/app/composables/use-validation.ts:40
- confirmed `validateRule()` — unknown rule returns false — vendor/shopware/administration/Resources/app/administration/src/app/composables/use-validation.ts:42
- confirmed `validate()` — boolean, string, comma list and array handling — vendor/shopware/administration/Resources/app/administration/src/app/composables/use-validation.ts:50
- confirmed `isValid` — intentionally not provided by the composable — vendor/shopware/administration/Resources/app/administration/src/app/composables/use-validation.ts:27
- confirmed `validation` — mixin still registered — vendor/shopware/administration/Resources/app/administration/src/app/mixin/validation.mixin.ts:13
- unverified `shopware:composables` — import alias defined in build tooling outside the scanned src root
