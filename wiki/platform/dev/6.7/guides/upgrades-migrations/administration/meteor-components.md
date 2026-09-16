---
id: platform/dev/6.7/guides/upgrades-migrations/administration/meteor-components.md
title: Upgrading to Meteor Components
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/upgrades-migrations/administration/meteor-components.html
sourceHash: 58d46b9b6c5b814001f08aa0e23ab8417040f123
codeCheckedAgainst: "6.7.13.0"
keywords: ["meteor components", "meteor component library", "admin:code-mods", "codemods", "deprecated prop", "mt-url-field", "sw-url-field", "sw-url-field-deprecated", "administration upgrade", "design system", "plugin migration", "shopware 6.7"]
summary: Shopware 6.7 admin swaps sw-* components for Meteor (mt-*) components; composer run admin:code-mods migrates plugins, deprecated prop renders old ones.
lastBuilt: 2026-09-15
---
## What it is

Upgrade guide for the Shopware 6.7 Administration, where several `sw-*` components are replaced by components from the Meteor Component Library (Shopware's shared component library built on the Shopware Design System). It covers the codemod tool for plugins and the `deprecated` prop that keeps the old component rendering.

## When to use

- You maintain an Administration plugin that uses core `sw-*` components and are moving it to 6.7.
- You need one plugin codebase compatible with both Shopware 6.6 and 6.7.

## Key steps / config

Codemods (prerequisites: a development installation of Shopware, and the plugin located in `custom/plugins`):

```bash
composer run admin:code-mods
composer run admin:code-mods -- --plugin-name example-plugin --fix -v 6.7
```

The first call prints the help text. Provide the plugin name and target Shopware version. The tool:

- replaces compatible components with Meteor Components automatically,
- adds guidance comments where manual migration is required,
- fixes some other deprecated code where possible.

Per-component migration details are in the technical upgrade documentation of the release.

Compatibility prop on the core wrapper components (installed code, e.g. the URL field wrapper):

- Prop `deprecated`, `type: Boolean`, default `false` → the wrapper renders the Meteor component (`mt-url-field`).
- `deprecated` set to `true` → the wrapper renders the old component (`sw-url-field-deprecated`) instead.

## Essential identifiers

- `composer run admin:code-mods` (options `--plugin-name`, `--fix`, `-v`)
- `deprecated` prop (Boolean, default `false`)
- Meteor components use the `mt-` prefix, e.g. `mt-url-field`, `mt-number-field`

## Gotchas

- The docs recommend migrating to Meteor Components instead of relying on `deprecated`; it exists only to bridge 6.6/6.7.
- In the installed code the wrapper components such as `sw-url-field` are themselves marked `@deprecated tag:v6.8.0` ("Will be removed, use mt-url-field instead"). Use the `mt-*` component directly in new code.

## Code check (6.7.13.0)
- confirmed `deprecated` — wrapper prop `type: Boolean`, `default: false` — vendor/shopware/administration/Resources/app/administration/src/app/component/form/sw-url-field/index.ts:34
- confirmed `mt-url-field` — rendered with `v-if="!deprecated"` — vendor/shopware/administration/Resources/app/administration/src/app/component/form/sw-url-field/sw-url-field.html.twig:2
- deprecated `sw-url-field` — wrapper marked `@deprecated tag:v6.8.0` — vendor/shopware/administration/Resources/app/administration/src/app/component/form/sw-url-field/index.ts:8
- confirmed `sw-url-field-deprecated` — old component rendered in the `v-else` branch — vendor/shopware/administration/Resources/app/administration/src/app/component/form/sw-url-field/sw-url-field.html.twig:21
- confirmed `mt-number-field` — used by the number field wrapper template — vendor/shopware/administration/Resources/app/administration/src/app/component/form/sw-number-field/sw-number-field.html.twig:4
- unverified `admin:code-mods` — composer script defined outside the checked admin `src` root
