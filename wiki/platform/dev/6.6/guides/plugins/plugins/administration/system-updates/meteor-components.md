---
id: platform/dev/6.6/guides/plugins/plugins/administration/system-updates/meteor-components.md
title: Upgrading to Meteor Components
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/administration/system-updates/meteor-components.html
sourceHash: d93dab20afa0c4a6c70cd765be6ffbb9f63289d8
keywords: ["Meteor Component Library", "meteor components", "admin:code-mods", "deprecated prop", "codemods", "Shopware Design System", "administration migration", "Shopware 6.7", "custom/plugins"]
summary: Roadmap for replacing Administration components with the Meteor Component Library in Shopware 6.7, plus the codemod tool.
lastBuilt: 2026-09-15
---
## What it is
This page is a roadmap notice: with Shopware 6.7, several Administration components will be replaced with components from the Meteor Component Library, Shopware's shared, Design-System-based component collection.

## When to use
Relevant when preparing a plugin's Administration UI for compatibility with both Shopware 6.6 and 6.7 as core components migrate to Meteor Components.

## Key steps / config
Run the migration codemod via composer, from a development installation of Shopware with the plugin located in the `custom/plugins` folder:
```bash
composer run admin:code-mods
# composer run admin:code-mods -- --plugin-name example-plugin --fix -v 6.7
```
The tool replaces compatible components with Meteor Components, adds guidance comments where manual migration is required, and fixes some other deprecated code.

A new `deprecated` prop (default `false`) has been added to Shopware components: setting it to `true` renders the old component instead of the Meteor Component, letting a plugin support both 6.6 and 6.7 without immediate migration.

## Essential identifiers
- `composer run admin:code-mods`
- `deprecated` prop (default `false`)

## Version notes
This applies from the Shopware 6.7 release onward; the source notes timelines and specific implementations are subject to change and is a general guideline, not a finalized spec.
