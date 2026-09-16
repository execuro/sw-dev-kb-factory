---
id: platform/dev/6.6/guides/plugins/themes/theme-base-guide.md
title: Theme base guide
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/themes/theme-base-guide.html
sourceHash: 6b2a9a69cb0901137ec0586ef414e4b55c73d59a
keywords: ["theme overview", "Bootstrap 5", "storefront appearance", "theme configuration variables", "SCSS/CSS styling", "twig templates", "offcanvas shopping-cart", "theme JavaScript", "default theme"]
summary: Introductory overview of what a Shopware theme is: it styles SCSS/CSS, adjusts twig templates, and can ship JavaScript, built on top of Bootstrap 5.
lastBuilt: "2026-09-15"
relatedPages: ["platform/dev/6.6/guides/plugins/themes/differences-plugins-and-apps-vs-themes.md", "platform/dev/6.6/guides/plugins/themes/create-a-theme.md"]
---
## What it is

This page is an introductory overview explaining what a theme does in Shopware: extending/changing the Storefront's visual appearance via SCSS/CSS styling, twig template adjustments, and optional JavaScript. Shopware's default theme is built on top of Bootstrap 5.

## When to use

Read this first, before creating a theme, to understand the general capabilities: styling, template changes, JavaScript behavior, and theme configuration variables editable by the shop owner in the Administration.

## Key steps / config

- Theme configuration lets a theme developer define variables configurable by the shop owner in the Administration; those variables are accessible in the theme's SCSS/twig.
- A theme is technically an app/plugin aimed at changing the Storefront's visual appearance — see [Differences Plugins and Apps vs Themes](platform/dev/6.6/guides/plugins/themes/differences-plugins-and-apps-vs-themes.md) for the distinction.
- The offcanvas shopping-cart is an example of a Storefront feature implemented with JavaScript that a theme can also affect.
- Next step: [create a theme](platform/dev/6.6/guides/plugins/themes/create-a-theme.md).

## Version notes

The default Shopware theme is style-wise built on top of Bootstrap 5.
