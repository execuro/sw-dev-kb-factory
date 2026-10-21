---
id: platform/dev/6.7/guides/plugins/plugins/administration/single-file-components/api-reference/composables/use-rule-between-operator.md
title: useRuleBetweenOperator()
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/single-file-components/api-reference/composables/use-rule-between-operator.html
sourceHash: d66aff06d04bf9e5cdff69dfefa8ec7e82c9db5a
codeCheckedAgainst: "6.7.15.1"
keywords: ["useRuleBetweenOperator", "isBetween", "betweenValue", "ensureValueExist", "renderedFieldValue", "between operator", "rule-between-operator", "rule builder", "date range condition", "shopware:composables", "composable", "from to"]
summary: "useRuleBetweenOperator(): isBetween plus writable from/to betweenValue for a rule condition's between operator; replaces the mixin"
lastBuilt: 2026-10-21
---
## What it is

`useRuleBetweenOperator()` is an Administration composable that renders a rule condition's `between` operator as a from/to pair on a date or datetime field. It replaces the `rule-between-operator` mixin.

## When to use

When writing a Composition API rule-builder condition component that offers a `between` operator with two pickers.

## Key steps / config

```ts
import { useRuleBetweenOperator } from 'shopware:composables';

const { isBetween, betweenValue } = useRuleBetweenOperator({
    condition: () => props.condition,
    ensureValueExist: () => emit('ensure-value-exist'),
});
```

- Options: `condition: () => RuleCondition | null | undefined` and `ensureValueExist: () => void` — passed in because a composable cannot reach into its host the way the mixin did.
- `isBetween` is a `ComputedRef<boolean>`: `true` when `condition.value.operator === 'between'`.
- `betweenValue` is a `WritableComputedRef<{ from: string | null; to: string | null }>`, read from `condition.value.renderedFieldValue`.
- Writing `betweenValue` calls `ensureValueExist()` first, then sets `condition.value = { ...condition.value, renderedFieldValue: value }`; it does nothing if the condition getter returns nothing.

## Essential identifiers

- `useRuleBetweenOperator(options)` → `{ isBetween, betweenValue }`
- `UseRuleBetweenOperatorOptions`, `BetweenValue`
- `renderedFieldValue`, `operator === 'between'`
- `rule-between-operator` mixin (Options API counterpart)

## Gotchas

- A `renderedFieldValue` that is not a plain object (including `null` or an array) reads as `{ from: null, to: null }` instead of throwing; missing `from`/`to` keys read as `null`.
- In 6.7.15.1 the composable is annotated `@private` and `@experimental stableVersion:v6.9.0 feature:ADMIN_MIXIN_COMPOSABLES`; the `shopware:composables` alias was not found in the installed Administration source.

## Version notes

The `rule-between-operator` mixin is still registered in 6.7.15.1 and kept in sync with the composable.

## Code check (6.7.15.1)
- confirmed `UseRuleBetweenOperatorOptions` — `condition` and `ensureValueExist` getters — vendor/shopware/administration/Resources/app/administration/src/app/composables/use-rule-between-operator.ts:28
- confirmed `useRuleBetweenOperator()` — returns `isBetween` and `betweenValue` — vendor/shopware/administration/Resources/app/administration/src/app/composables/use-rule-between-operator.ts:41
- confirmed `isBetween` — computed on `operator === 'between'` — vendor/shopware/administration/Resources/app/administration/src/app/composables/use-rule-between-operator.ts:45
- confirmed `renderedFieldValue` — non-object reads as `{ from: null, to: null }` — vendor/shopware/administration/Resources/app/administration/src/app/composables/use-rule-between-operator.ts:49
- confirmed `ensureValueExist()` — called first in the setter — vendor/shopware/administration/Resources/app/administration/src/app/composables/use-rule-between-operator.ts:63
- confirmed `rule-between-operator` — mixin name still registered — vendor/shopware/administration/Resources/app/administration/src/app/mixin/rule-between-operator.mixin.ts:6
- unverified `shopware:composables` — import alias not found in the installed Administration src; may come from build tooling outside the checked roots
