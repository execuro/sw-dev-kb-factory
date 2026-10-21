---
id: platform/dev/6.7/guides/plugins/plugins/administration/single-file-components/api-reference/composables/use-rule-container.md
title: useRuleContainer()
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/single-file-components/api-reference/composables/use-rule-container.html
sourceHash: 6c89d07eebb29ef4af08a70df0a6775977484d6b
codeCheckedAgainst: "6.7.15.1"
keywords: ["useRuleContainer", "ruleContainer", "sw-condition-tree", "containerRowClass", "conditionDataProviderService", "childAssociationField", "insertNodeIntoTree", "removeNodeFromTree", "createCondition", "onAddPlaceholder", "rule builder", "condition container", "composable"]
summary: "useRuleContainer() admin composable: injected sw-condition-tree state for a custom rule-builder container; replaces ruleContainer mixin"
lastBuilt: 2026-10-21
---
## What it is

`useRuleContainer()` is an Administration composable holding the state a condition container inside `sw-condition-tree` works against — what you need when building a custom container for the rule builder. It replaces the `ruleContainer` mixin.

## When to use

When writing a Composition API condition container (a group of conditions) for the rule builder.

## Key steps / config

```ts
import { useRuleContainer } from 'shopware:composables';

function useRuleContainer(options: {
    condition: () => RuleConditionNode;
    level: () => number;
    disabled: () => boolean;
    onAddPlaceholder: () => void;
}): { conditionDataProviderService, childAssociationField, createCondition,
      insertNodeIntoTree, removeNodeFromTree, containerRowClass, nextPosition };
```

- Options are getters (`condition`, `level`, `disabled`) plus the `onAddPlaceholder` callback — the mixin declared these props itself, a composable cannot.
- `sw-condition-tree` provides `conditionDataProviderService`, `childAssociationField`, `createCondition`, `insertNodeIntoTree` and `removeNodeFromTree`; the composable injects them.
- `containerRowClass` is computed: `{ 'is--disabled': disabled() }` plus `'container-condition-level__is--odd'` or `'container-condition-level__is--even'` set to `true` depending on `level() % 2`.
- `nextPosition` is the number of children under `condition()[childAssociationField.value]` (0 if none). A watcher calls `onAddPlaceholder()` when it becomes `0` — how a container keeps an empty row for the next condition.

## Essential identifiers

- `useRuleContainer(options)` / `UseRuleContainerOptions` / `UseRuleContainerReturn`
- `conditionDataProviderService`, `childAssociationField` (`ComputedRef`)
- `createCondition(conditionData, parentId, position)`, `insertNodeIntoTree(parentCondition, childToInsert)`, `removeNodeFromTree(parentCondition, childToRemove)`
- `containerRowClass`, `nextPosition`, `onAddPlaceholder`
- `sw-condition-tree`, `ruleContainer` mixin

## Gotchas

- `conditionDataProviderService` and `childAssociationField` stay refs. The Options API unwrapped them on the instance proxy, so a migrated template that used them without `.value` needs `.value`.
- The injections only resolve inside `sw-condition-tree`, which provides them.
- In 6.7.15.1 the composable is annotated `@private` and `@experimental stableVersion:v6.9.0 feature:ADMIN_MIXIN_COMPOSABLES`; the `shopware:composables` alias was not found in the installed Administration source.

## Version notes

The `ruleContainer` mixin is still registered in 6.7.15.1 and kept in sync with the composable.

## Code check (6.7.15.1)
- confirmed `UseRuleContainerOptions` — `condition`, `level`, `disabled`, `onAddPlaceholder` — vendor/shopware/administration/Resources/app/administration/src/app/composables/use-rule-container.ts:28
- confirmed `useRuleContainer()` — returns `UseRuleContainerReturn` — vendor/shopware/administration/Resources/app/administration/src/app/composables/use-rule-container.ts:58
- confirmed `conditionDataProviderService` — injected from the tree — vendor/shopware/administration/Resources/app/administration/src/app/composables/use-rule-container.ts:59
- confirmed `insertNodeIntoTree` — injected tree-editing function — vendor/shopware/administration/Resources/app/administration/src/app/composables/use-rule-container.ts:62
- confirmed `containerRowClass` — `is--disabled` plus odd/even level class — vendor/shopware/administration/Resources/app/administration/src/app/composables/use-rule-container.ts:68
- confirmed `onAddPlaceholder()` — called when `nextPosition` becomes 0 — vendor/shopware/administration/Resources/app/administration/src/app/composables/use-rule-container.ts:92
- confirmed `childAssociationField` — provided by `sw-condition-tree` as a computed ref — vendor/shopware/administration/Resources/app/administration/src/app/component/rule/sw-condition-tree/index.js:24
- confirmed `ruleContainer` — mixin name still registered — vendor/shopware/administration/Resources/app/administration/src/app/mixin/rule-container.mixin.ts:13
- unverified `shopware:composables` — import alias not found in the installed Administration src; may come from build tooling outside the checked roots
