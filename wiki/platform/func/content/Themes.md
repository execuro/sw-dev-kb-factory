---
id: platform/func/content/Themes.md
title: Themes
docType: functional
version: "6.5"
versions: ["6.5", "6.6"]
sourceUrl: https://docs.shopware.com/en/shopware-6-en/content/Themes
sourceHash: 4e4bc22aaf44213f8b448a3c2fb94506c09d77a003f619710318e1f9ea140e80
revision:
  current: true
  range: "6.0.0 - 6.6.10.14"
  swMin: "6.0.0"
  swMax: "6.6.10.14"
keywords: ["themes", "theme configuration", "theme colours", "theme typography", "create duplicate theme", "assign theme to sales channel", "sales channel theme assignment", "theme inheritance", "responsive theme"]
summary: "Managing installed Shopware themes: overview, colour/typography/media configuration, duplication, inheritance and assignment to sales channels."
lastBuilt: "2026-09-15"
---
## What it is
Documents the theme management screen listing all installed themes, where they can be configured, duplicated and assigned to sales channels.

## When to use
When customizing a storefront's colors/fonts/media, creating a variant of an existing theme, or assigning a theme to a sales channel.

## Key steps / config
Overview: pull-down menu to change sorting and switch between listing/thumbnail views; per-theme context menu to rename or delete the thumbnail. A grey dot below a theme's preview means it is not yet assigned to a sales channel; it turns green once assigned.

Theme configuration sections: Theme-colours (basic background/frame colors, primary color used e.g. in headings/links of the Responsive Theme), Status messages (colors), Typography (font/text color for texts and headings), E-Commerce (buy button and displayed price appearance), Media (desktop logo shown above 991px viewport, tablet logo between 991px and 767px, mobile logo below 767px; favicon; app & share icon).

Create duplicate: only themes not already inherited from another theme can be duplicated (option absent from context menu otherwise); select **Create Duplicate**, name it, and the duplicate opens with configuration inherited from the source theme — inheritance can be switched off per setting via the inheritance icon to make individual changes.

Assign theme to a sales channel: open the Themes tab of the sales channel, then click the theme thumbnail or **Change Theme** to assign one of the installed themes.

## Essential identifiers
- Viewport breakpoints for logos: >991px desktop, 991px-767px tablet, <767px mobile

## Gotchas
Only themes that are not themselves inherited from another theme can be duplicated.
