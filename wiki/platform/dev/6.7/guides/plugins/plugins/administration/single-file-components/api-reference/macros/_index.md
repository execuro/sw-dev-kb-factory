---
id: platform/dev/6.7/guides/plugins/plugins/administration/single-file-components/api-reference/macros/_index.md
title: Macros
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/single-file-components/api-reference/macros/
sourceHash: eb24d2d6158c7ac749bc7043c45872d79ea5dc71
codeCheckedAgainst: "6.7.15.1"
keywords: ["swDefinePublic", "swDefineOverride", "compile-time macro", "sfc macros", "base component", "override file", "shorthand bindings", "sw-core-rules/valid-shopware-setup", "eslint rule", "public override api", "single-file components"]
summary: "Admin SFC compile-time macros swDefinePublic() (base components) and swDefineOverride() (override files): shared rules, mandatory once per file."
lastBuilt: 2026-10-21
---
## What it is

Overview of the two compile-time markers used in Administration single-file components: `swDefinePublic()` and `swDefineOverride()`. They are not imported, the call itself is removed at build time, and each is mandatory in its mode: a base component declares its public surface with `swDefinePublic()`, an override declares what it replaces with `swDefineOverride()`.

## When to use

Read this when writing either a base single-file component that others may extend, or an override file that replaces parts of one, and you need the rules both macros share.

## Key steps / config

- `swDefinePublic()` - base components: declare which top-level bindings an override may replace.
- `swDefineOverride()` - override files: declare which public bindings this file replaces.

Rules that apply to both:

1. **Shorthand bindings only.** The key always equals the local binding name:

```ts
swDefinePublic({ count });          // ok
swDefinePublic({ total: count });   // rejected: renamed
swDefinePublic({ 'count': count }); // rejected: string key
swDefinePublic({ ...state });       // rejected: spread
```

   The build, the lint rule and the type layer all need a key that is stable at compile time, and a renamed key could silently shadow another binding.

2. **Once, at the top level.** A second top-level call is rejected. A call nested inside a function or block is not recognised as the marker, so the file is treated as having none.
3. **Mandatory, even when empty.** Pass `{}` when there is nothing to declare. Writing the call is what marks the file as a base component or an override on purpose, rather than because it happens to have a script-setup block.
4. **One per mode.** `swDefinePublic()` in an override file is rejected, and so is `swDefineOverride()` in a base component.

Every one of these violations is reported by the build and by the `sw-core-rules/valid-shopware-setup` ESLint rule.

## Essential identifiers

- `swDefinePublic()`
- `swDefineOverride()`
- ESLint rule `sw-core-rules/valid-shopware-setup`

## Gotchas

- Because the macros are compile-time markers, there is nothing to import; an import statement for them is not needed.
- A nested call (inside a function or block) silently does not count - the file then has no marker at all and is reported as missing one.

## Code check (6.7.15.1)
- confirmed `swDefinePublic` — used as a top-level shorthand-binding call in a base fixture component — vendor/shopware/administration/Resources/app/administration/src/app/adapter/_mocks_/sw-jest-transform-fixture.vue:22
- confirmed `swDefineOverride` — used as a top-level call in an override fixture — vendor/shopware/administration/Resources/app/administration/src/app/adapter/_mocks_/sw-jest-transform-fixture.override.vue:7
- confirmed `defineExpose()` — generated for base components from the swDefinePublic() bindings — vendor/shopware/administration/Resources/app/administration/src/app/adapter/composition-extension-system/index.ts:531
- unverified `sw-core-rules/valid-shopware-setup` — ESLint rule lives outside the scanned src root
- unverified `shorthand-only/once/mandatory rules` — enforced by the build transform outside the scanned src root
