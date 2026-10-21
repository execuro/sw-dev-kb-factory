---
id: platform/dev/6.7/guides/plugins/plugins/administration/single-file-components/api-reference/composables/use-user-settings.md
title: useUserSettings()
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/single-file-components/api-reference/composables/use-user-settings.html
sourceHash: 2422b9bbd37b3e5c7d8e7b8be3f0c208e8c7951a
codeCheckedAgainst: "6.7.15.1"
keywords: ["useUserSettings", "shopware:composables", "user_config", "getUserSettings", "saveUserSettings", "getUserSettingsEntity", "userGridSettingsCriteria", "user-settings mixin", "per-user settings", "admin composable", "data grid column settings", "acl privileges"]
summary: "Admin composable useUserSettings() reads and writes per-user user_config values (grid columns etc.); replaces the user-settings mixin."
lastBuilt: 2026-10-21
---
## What it is

`useUserSettings()` is an Administration composable, imported from `shopware:composables`, that reads and writes `user_config` - the per-user key-value store behind things like a data grid's column layout or a collapsed sidebar. It replaces the `user-settings` mixin for Composition API / single-file components.

## When to use

Use it in an Administration component that needs to persist a per-user preference (grid columns, hidden fields, UI state) for the logged-in user or, with the right privileges, for another user.

## Key steps / config

Signature (as installed):

```ts
import { useUserSettings } from 'shopware:composables';

function useUserSettings(): {
    getUserSettingsEntity: (identifier: string, userId?: string | null) => Promise<UserSettingsEntity | null>;
    getUserSettings: (identifier: string, userId?: string | null) => Promise<unknown>;
    saveUserSettings: (identifier: string, entityValue: Record<string, any>, userId?: string | null) => Promise<unknown>;
    userGridSettingsCriteria: (identifier: string, userId?: string | null) => Criteria;
};
```

Usage:

```ts
const { getUserSettings, saveUserSettings } = useUserSettings();
const columns = await getUserSettings('swag-margin.columns');
await saveUserSettings('swag-margin.columns', { hidden: ['purchasePrice'] });
```

1. Pick an identifier that contains a dot and is namespaced to your extension (e.g. `swag-margin.columns`).
2. Omit `userId` to work on the logged-in user - the fast path, served by `userConfigService` (`search`/`upsert`).
3. Pass another user's id only when necessary; that path searches and saves the `user_config` entity through the repository.
4. `userGridSettingsCriteria()` builds the `Criteria` used for those repository queries: filters on `key` equal to the identifier and `userId` equal to the given or current user, page 1, limit 25.

## Essential identifiers

- `useUserSettings` (from `shopware:composables`)
- `getUserSettingsEntity()`, `getUserSettings()`, `saveUserSettings()`, `userGridSettingsCriteria()`
- `user_config` entity, privileges `user_config:read`, `user_config:create`, `user_config:update`
- `userConfigService`
- replaced mixin: `user-settings`

## Gotchas

- `saveUserSettings()` stores an identifier without a dot under `custom.<identifier>`, but the read functions do not add that prefix - a dot-less key is written to one place and read from another. Always use an identifier with a dot, and keep it yours.
- The three async functions are guarded by ACL: without `user_config:read` (reads), or without both `user_config:create` and `user_config:update` (writes), they return a rejected promise rather than throwing an error. `saveUserSettings()` also rejects on an empty identifier.
- `getUserSettings()` returns `null` when nothing is stored; `getUserSettingsEntity()` returns the whole entity or `null`.

## Version notes

In 6.7.15.1 the composable is marked `@experimental` with stable version v6.9.0. The `user-settings` mixin stays in place for Options API components and is kept in sync with the composable.

## Code check (6.7.15.1)
- confirmed `useUserSettings()` — exported composable with the four documented functions — vendor/shopware/administration/Resources/app/administration/src/app/composables/use-user-settings.ts:39
- confirmed `getUserSettingsEntity()` — rejects without `user_config:read` — vendor/shopware/administration/Resources/app/administration/src/app/composables/use-user-settings.ts:65
- confirmed `getUserSettings()` — current user goes through `userConfigService.search` — vendor/shopware/administration/Resources/app/administration/src/app/composables/use-user-settings.ts:84
- confirmed `saveUserSettings()` — requires create and update privileges — vendor/shopware/administration/Resources/app/administration/src/app/composables/use-user-settings.ts:42
- confirmed `custom.${identifier}` — dot-less identifiers are prefixed on save only — vendor/shopware/administration/Resources/app/administration/src/app/composables/use-user-settings.ts:122
- confirmed `userGridSettingsCriteria()` — filters `key` and `userId`, Criteria(1, 25) — vendor/shopware/administration/Resources/app/administration/src/app/composables/use-user-settings.ts:48
- confirmed `user-settings` — mixin still registered — vendor/shopware/administration/Resources/app/administration/src/app/mixin/user-settings.mixin.ts:37
- unverified `shopware:composables` — import alias defined in build tooling outside the scanned src root
