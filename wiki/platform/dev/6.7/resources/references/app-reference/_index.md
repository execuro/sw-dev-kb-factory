---
id: platform/dev/6.7/resources/references/app-reference/_index.md
title: App Reference
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/app-reference/
sourceHash: ce4c1e98355cb08c2cd9afee31fc6f6ec62892aa
codeCheckedAgainst: "6.7.13.0"
keywords: ["app reference", "app system", "apps", "manifest.xml", "cms.xml", "entities.xml", "flow.xml", "xml schema", "xsd", "app structure", "reference index"]
summary: Index of the Shopware app reference section covering app structure, functions, events, variables and examples for building apps.
lastBuilt: 2026-09-15
---
## What it is

Landing page of the App Reference section. It states that the app reference documents the app structure, functions, methods, events, variables, responses and examples used when building Shopware apps. The section's child pages cover the XML files an app ships: the manifest, CMS blocks, custom entities and flow actions.

## When to use

Start here when you need the exact XML shape of an app configuration file rather than a step-by-step guide. In the installed core, each of these files is validated against an XSD that ships with `vendor/shopware/core` (see Code check), so the reference pages and those schema files are the authority on allowed elements.

## Code check (6.7.13.0)
- confirmed `manifest-3.0.xsd` — app manifests are validated against this schema — vendor/shopware/core/Framework/App/Manifest/Manifest.php:33
- confirmed `cms-1.0.xsd` — app CMS block files are validated against this schema — vendor/shopware/core/Framework/App/Cms/CmsExtensions.php:16
- confirmed `entity-1.0.xsd` — custom entity files are validated against this schema — vendor/shopware/core/System/CustomEntity/Xml/CustomEntityXmlSchema.php:17
- confirmed `flow-1.0.xsd` — app flow actions/events are validated against this schema — vendor/shopware/core/Framework/App/Flow/Action/Action.php:13
