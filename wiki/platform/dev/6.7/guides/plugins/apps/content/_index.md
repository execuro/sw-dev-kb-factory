---
id: platform/dev/6.7/guides/plugins/apps/content/_index.md
title: Content
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/apps/content/
sourceHash: a8fcb63c22227e01a8c8f3d47ff4955e7021217d
codeCheckedAgainst: "6.7.13.0"
keywords: ["app content", "apps", "cms", "shopping experiences", "layouts", "categories", "content visibility", "rule conditions", "cms.xml", "cms-1.0.xsd", "rule-conditions", "manifest.xml"]
summary: Overview of app-based store content in Shopware 6.7 - assigning content to categories, building CMS layouts and controlling visibility by conditions.
lastBuilt: 2026-09-15
---
## What it is

Section landing page for app guides about store content. With apps, you can assign content to specific categories, create layouts (Shopping Experiences / CMS), and control content visibility based on various conditions.

## When to use

Start here when an app (not a plugin) needs to contribute storefront content: layout building blocks for the CMS editor, or conditions that decide when content is shown. The concrete how-tos live in the child guides of this section (for example, adding custom CMS blocks from an app, and custom rule conditions for the Rule Builder).

## Key steps / config

The source page itself gives no steps. In the installed code, the app-side content extension points behind this section are declared purely through files in the app, without PHP code:

- CMS layout blocks: an optional `Resources/cms.xml` in the app, validated against the `cms-1.0.xsd` schema. The app lifecycle only processes CMS blocks when that file exists; blocks are persisted on app install and update.
- Conditions that can drive content visibility: a `rule-conditions` element in the app's `manifest.xml`. The manifest parser reads it into rule conditions that appear in the Rule Builder; each condition's Twig script is loaded from the app's `rule-conditions` script directory.

## Essential identifiers

- `Resources/cms.xml`
- `cms-1.0.xsd`
- `rule-conditions` (in `manifest.xml`)

## Code check (6.7.13.0)
- confirmed `Resources/cms.xml` — app CMS block handler returns early when the file is missing — vendor/shopware/core/Framework/App/Lifecycle/Handler/CmsBlockLifecycleHandler.php:42
- confirmed `cms-1.0.xsd` — schema file used to parse cms.xml — vendor/shopware/core/Framework/App/Cms/CmsExtensions.php:16
- confirmed `rule-conditions` — manifest parser reads the element into RuleConditions — vendor/shopware/core/Framework/App/Manifest/Manifest.php:310
- confirmed `CONDITION_SCRIPT_DIR` — condition scripts are read from /rule-conditions/ — vendor/shopware/core/Framework/App/Lifecycle/Handler/RuleConditionLifecycleHandler.php:39
