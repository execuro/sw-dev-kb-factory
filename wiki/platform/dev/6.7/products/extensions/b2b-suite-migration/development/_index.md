---
id: platform/dev/6.7/products/extensions/b2b-suite-migration/development/_index.md
title: Development
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-suite-migration/development/
sourceHash: 5ecfb6ce928167da7af819a4130181456e0ce255
codeCheckedAgainst: "6.7.13.0"
keywords: ["b2b suite migration", "b2b commercial", "development", "customize migration", "extend migration", "configurator", "xml mapping", "conditions", "default values", "new component"]
summary: "Overview of B2B Suite migration development docs: adding components, extending entities, configurators, XML mappings, conditions and default values."
lastBuilt: 2026-09-15
---
## What it is

Entry page for the developer section of the B2B Suite to B2B Commercial migration. It covers customizing or extending the migration: adding new components, extending existing entities, and validating configurations — including creating a configurator, defining XML mappings, and setting conditions or default values.

## When to use

When the standard migration from B2B Suite to B2B Commercial does not cover your data and you need to add a component or extend an existing one.

## Code check (6.7.13.0)
- unverified `configurator` — migration configurators are SwagCommercial classes, not installed in the checked vendor/shopware roots
- confirmed `SwagCommercial` — core only references the commercial plugin by name — vendor/shopware/core/System/Resources/translation.yaml:8
