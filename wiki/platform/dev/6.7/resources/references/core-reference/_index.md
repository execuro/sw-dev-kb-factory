---
id: platform/dev/6.7/resources/references/core-reference/_index.md
title: Core Reference
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/core-reference/
sourceHash: a84ca7e8e0e5c11b30a324fa916ed844ce876fbf
codeCheckedAgainst: "6.7.15.1"
keywords: ["core reference", "reference index", "DAL", "data abstraction layer", "administration", "feature flags", "filters", "Flow Builder", "rules", "commands", "events", "classes and methods"]
summary: Entry page of the Shopware 6.7 Core reference - lookup tables for DAL, Administration, feature flags, filters, Flow Builder, Rules, commands and events.
lastBuilt: 2026-10-21
---
## What it is

The landing page of the Core reference section. The Core reference documents essential platform components — the Data Abstraction Layer (DAL), the Administration panel, feature flags, filters, the Flow Builder and Rules — and lists the related classes, methods, commands and events for lookup.

## When to use

When you need the exact name of a core class, method, CLI command or event for one of these components, rather than a conceptual guide or tutorial: use the reference pages beneath this section to check how a feature is meant to be used and which identifiers to extend.

## Code check (6.7.15.1)
- confirmed `EntityDefinition` — base class of DAL entity definitions — vendor/shopware/core/Framework/DataAbstractionLayer/EntityDefinition.php:33
- confirmed `FlowAction` — base class of Flow Builder actions — vendor/shopware/core/Content/Flow/Dispatching/Action/FlowAction.php:9
- confirmed `Rule` — base class of rule conditions — vendor/shopware/core/Framework/Rule/Rule.php:10
- confirmed `Feature` — core feature flag helper class — vendor/shopware/core/Framework/Feature.php:18
