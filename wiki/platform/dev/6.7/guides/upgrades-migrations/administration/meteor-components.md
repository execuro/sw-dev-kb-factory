---
id: platform/dev/6.7/guides/upgrades-migrations/administration/meteor-components.md
title: Upgrading to Meteor Components
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/upgrades-migrations/administration/meteor-components.html
sourceHash: 58d46b9b6c5b814001f08aa0e23ab8417040f123
codeCheckedAgainst: "6.7.15.1"
keywords: ["meteor components", "Meteor Component Library", "composer run admin:code-mods", "codemods", "deprecated prop", "mt-button", "administration components", "shopware design system", "6.6 6.7 compatibility", "component migration", "custom/plugins"]
summary: Shopware 6.7 replaces admin components with Meteor components; migrate via composer run admin:code-mods, or keep old ones with the deprecated prop.
lastBuilt: 2026-10-21
---
## What it is

A roadmap and migration guide for Shopware 6.7. In 6.7, several Administration components are replaced by components from the Meteor Component Library, Shopware's shared component library built on the Shopware Design System. The guide covers the codemod tool that rewrites plugins, and a compatibility prop that keeps the old components rendering. The page notes that its timelines and implementation details may change.

## When to use

- You maintain an Administration plugin that uses core components replaced by Meteor components in 6.7.
- You need one plugin codebase that works on both Shopware 6.6 and 6.7.

## Key steps / config

The technical upgrade documentation for each release has a per-component upgrade guide.

**Automated migration with codemods**

Prerequisites: a development installation of Shopware (the `shopware/shopware` repository), with the plugin located in `custom/plugins`.

```bash
# Main command, also prints the help text
composer run admin:code-mods

# Example with arguments
composer run admin:code-mods -- --plugin-name example-plugin --fix -v 6.7
```

Provide the plugin name and the target Shopware version. The tool:

- replaces compatible components with Meteor components;
- adds guidance comments where manual migration is needed;
- fixes some other deprecated code where possible.

**Compatibility prop**

Wrapped core components have a boolean prop named `deprecated`:

- default `false`: renders the new Meteor component (e.g. `mt-button`);
- `true`: renders the old component instead.

This lets one codebase support 6.6 and 6.7 without migrating right away.

## Essential identifiers

- `composer run admin:code-mods` with options `--plugin-name`, `--fix`, `-v`
- Prop `deprecated` (Boolean, default `false`)
- Meteor components, e.g. `mt-button`

## Gotchas

- Shopware recommends migrating to Meteor components even though the `deprecated` prop keeps old components working.
- In the installed code, the wrapper components are themselves deprecated. For example, `sw-button` is marked `@deprecated tag:v6.8.0 - Will be removed, use mt-button instead`. When `deprecated` is `true` it renders `sw-button-deprecated`. Treat the prop as a transition aid only.

## Code check (6.7.15.1)
- confirmed `deprecated` — prop declared with `type: Boolean`, `default: false` on the wrapper component — vendor/shopware/administration/Resources/app/administration/src/app/component/base/sw-button/index.js:22
- deprecated `sw-button` — wrapper is `@deprecated tag:v6.8.0`, use `mt-button` — vendor/shopware/administration/Resources/app/administration/src/app/component/base/sw-button/index.js:10
- deprecated `sw-button-deprecated` — old component rendered when `deprecated` is true — vendor/shopware/administration/Resources/app/administration/src/app/component/base/sw-button/sw-button.html.twig:14
- confirmed `mt-button` — Meteor button rendered by default — vendor/shopware/administration/Resources/app/administration/src/app/component/base/sw-button/sw-button.spec.js:22
- unverified `admin:code-mods` — composer script in the repository root, outside the vendor code roots
