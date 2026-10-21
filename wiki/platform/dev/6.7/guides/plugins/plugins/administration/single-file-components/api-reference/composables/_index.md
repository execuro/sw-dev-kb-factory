---
id: platform/dev/6.7/guides/plugins/plugins/administration/single-file-components/api-reference/composables/_index.md
title: Composables
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/single-file-components/api-reference/composables/
sourceHash: 2db2a375b05e0e2786efe70d268149d722528781
codeCheckedAgainst: "6.7.15.1"
keywords: ["composables", "shopware:composables", "useSwPreviousState", "useSwProps", "useSwContext", "useNotification", "useRuleBetweenOperator", "useCmsElement", "useCmsState", "useInlineSnippet", "mixin replacement", "composition api", "override.vue", "experimental"]
summary: "Index of Administration composables: override composables in .override.vue files and the shopware:composables module replacing mixins (experimental)."
lastBuilt: 2026-10-21
---
## What it is

Overview of the composables the Administration offers for single-file components. All of them are experimental: names, options and return values can still change without a deprecation.

## When to use

- In an `.override.vue` file, to reach the state, props and context of the component being overridden.
- In any Composition API component, as the replacement for an Administration mixin.

## Key steps / config

### Override composables

Three composables are provided by the build in every `.override.vue` file. Like the macros, they are never imported and exist only inside an override file:

- `useSwPreviousState()` — the state of the component you override
- `useSwProps()` — that component's props, read only
- `useSwContext()` — that component's emit, attrs, slots and expose

A base component needs none of them: it declares its own props with `defineProps()` and events with `defineEmits()`.

### Administration composables

Imported by name from the `shopware:composables` virtual module, or as the default export of a per-composable path named in `camelCase`:

```ts
import { useNotification } from 'shopware:composables';
import useNotification from 'shopware:composables/useNotification';
```

Each composable is the Composition API side of a mixin. Whatever the mixin took from its host (`this`) is passed in as options, with getters to keep it reactive:

```ts
const { isBetween, betweenValue } = useRuleBetweenOperator({
    condition: () => props.condition,
    ensureValueExist: () => emit('ensure-value-exist'),
});
```

The mixins remain, so unmigrated Options API components keep working.

### Catalogue by area

- Notifications: `useNotification()`, `useNotificationTranslation()`
- User settings: `useUserSettings()`
- Text and formatting: `useInlineSnippet()`, `useTranslateWithFallback()`, `usePlaceholder()`, `useSalutation()`
- Lists and forms: `useListing()`, `usePosition()`, `useValidation()`
- Rule builder: `useRuleContainer()`, `useRuleBetweenOperator()`
- Media: `useMediaGridListener()`, `useMediaSidebarModal()`, `useVideoCover()`
- CMS: `useCmsState()`, `useCmsElement()`

## Essential identifiers

- `shopware:composables`
- `useSwPreviousState()`, `useSwProps()`, `useSwContext()`
- `defineProps()`, `defineEmits()`

## Gotchas

- Override composables exist only inside `.override.vue` files; they are not importable elsewhere.
- Experimental status: record which composables you depend on, since their API may change without deprecation.

## Code check (6.7.15.1)
- confirmed `useNotification` — default-exported composable, marked `@experimental stableVersion:v6.9.0` — vendor/shopware/administration/Resources/app/administration/src/app/composables/use-notification.ts:20
- confirmed `useRuleBetweenOperator` — default-exported composable taking an options object — vendor/shopware/administration/Resources/app/administration/src/app/composables/use-rule-between-operator.ts:41
- confirmed `condition` — getter option of useRuleBetweenOperator — vendor/shopware/administration/Resources/app/administration/src/app/composables/use-rule-between-operator.ts:29
- confirmed `ensureValueExist` — callback option of useRuleBetweenOperator — vendor/shopware/administration/Resources/app/administration/src/app/composables/use-rule-between-operator.ts:30
- confirmed `useCmsState` — composable exists, `@experimental` — vendor/shopware/administration/Resources/app/administration/src/app/composables/use-cms-state.ts:37
- confirmed `useCmsElement` — composable exists, `@experimental` — vendor/shopware/administration/Resources/app/administration/src/app/composables/use-cms-element.ts:37
- confirmed `useInlineSnippet` — composable exists, `@experimental` — vendor/shopware/administration/Resources/app/administration/src/app/composables/use-inline-snippet.ts:18
- unverified `shopware:composables` — virtual module defined by the build tooling, outside the checked vendor roots
- unverified `useSwProps` — build-provided override composable; only a jest fixture in the checked roots
- unverified `useSwContext` — build-provided override composable, outside the checked vendor roots
