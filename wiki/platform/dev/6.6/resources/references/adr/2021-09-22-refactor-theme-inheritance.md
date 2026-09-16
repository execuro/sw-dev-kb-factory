---
id: platform/dev/6.6/resources/references/adr/2021-09-22-refactor-theme-inheritance.md
title: Refactor theme inheritance
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/resources/references/adr/2021-09-22-refactor-theme-inheritance.html
sourceHash: 9c60619f1882edda938619560e944bf4665e82d5
keywords: ["theme inheritance", "theme.json", "configInheritance", "configFields", "storefront theme", "@Storefront", "@PreviousTheme", "theme config", "storefront", "composer.json require", "shopware-platform-plugin"]
summary: ADR adding a configInheritance key to theme.json so themes can inherit configFields from other themes in order, dynamically instead of via snapshot.
lastBuilt: 2026-09-15
---
## What it is
Architecture decision record documenting a new `configInheritance` key for `theme.json`, letting a theme inherit its `configFields` from other themes in a given order instead of only from the default Storefront theme.

## When to use
Relevant when building a theme that needs to reuse or override configuration fields defined by another theme (e.g. a previous theme or a shared base theme), rather than duplicating them.

## Key steps / config
Add a `configInheritance` array to `theme.json` listing the themes to inherit config from, in order:

```json
"configInheritance": [
    "@Storefront",
    "@PreviousTheme",
    "@MyDevelopmentTheme"
]
```

Themes depending on another theme besides the default Storefront theme must declare that theme as a `require` dependency in `composer.json` to avoid incomplete setups:

```json
"require": {
    "swag/previous-theme": "~1.1"
}
```

## Essential identifiers
- `theme.json` `configInheritance` key
- `theme.json` `configFields`
- `composer.json` `require`

## Gotchas
- Inheritance can still cause incompatibility errors if a dependent theme's config subset is missing.
- Unlike the old snapshot-at-activation behavior, the new inheritance is a dynamic copy: changes in child/inherited themes are picked up automatically without re-activation.
- The admin gains an inheritance mechanism letting users choose per-field whether to use the inherited or a new value, similar to product variant inherited fields.
