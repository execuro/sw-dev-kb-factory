---
id: platform/dev/6.7/guides/plugins/plugins/administration/templates-styling/_index.md
title: Templates and Styling
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/templates-styling/
sourceHash: 1f3f1672a187c6cdd9320fdb1c7dcf69445dbaaf
codeCheckedAgainst: "6.7.15.1"
keywords: ["administration templates", "twig templates", "vue templates", "scss styles", "custom styles", "snippets", "translations", "static assets", "responsive behavior", "admin styling", "plugin administration", "writing templates"]
summary: Overview of Administration plugin guides for templates (Twig/Vue), custom SCSS, snippet translations, static assets and responsive behavior.
lastBuilt: 2026-10-21
---
## What it is

Section overview for the Administration plugin guides that cover the visual and structural side of Administration extensions: templates, styles, assets and translations.

## When to use

As an entry point when a plugin needs to:

- write Twig/Vue-based Administration templates,
- add custom SCSS styles,
- register and use snippet translations,
- work with static assets in the Administration.

## Key steps / config

The section contains these guides:

- Writing Templates
- Add Custom Styles
- Adding Snippets
- Using Assets
- Adding Responsive Behavior

## Code check (6.7.15.1)
- confirmed `register` — component factory registration used for plugin templates — vendor/shopware/administration/Resources/app/administration/src/core/factory/async-component.factory.ts:478
- confirmed `extend` — component factory extension of an existing component — vendor/shopware/administration/Resources/app/administration/src/core/factory/async-component.factory.ts:549
- confirmed `override` — component factory override including config and template — vendor/shopware/administration/Resources/app/administration/src/core/factory/async-component.factory.ts:609
- confirmed `extend` — locale factory merges snippet messages into a locale — vendor/shopware/administration/Resources/app/administration/src/core/factory/locale.factory.ts:100
