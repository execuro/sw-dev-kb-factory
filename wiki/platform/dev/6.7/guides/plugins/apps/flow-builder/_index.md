---
id: platform/dev/6.7/guides/plugins/apps/flow-builder/_index.md
title: Flow Builder
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/apps/flow-builder/
sourceHash: 43ab9e63abddd1426d2cf3430d6914b223e662e4
codeCheckedAgainst: "6.7.15.1"
keywords: ["flow builder", "app flow actions", "custom flow action", "flow-actions", "flow-action", "flow-1.0.xsd", "automation", "workflow", "app extension"]
summary: Section overview - apps can extend the Flow Builder with custom flow actions to add their own logic to automation workflows.
lastBuilt: 2026-10-21
---
## What it is

Section overview for extending the Flow Builder from an app. An app can define its own custom flow actions, which then become available in Flow Builder workflows and run the app's logic as part of the shop's automation processes.

## When to use

When an app needs to add its own behaviour (an action step) to merchant-configured flows. In the installed code, app flow actions are declared as `<flow-action>` entries inside a `<flow-actions>` element validated by `flow-1.0.xsd`.

## Code check (6.7.15.1)
- confirmed `flow-actions` — container element in the app flow schema — vendor/shopware/core/Framework/App/Flow/Schema/flow-1.0.xsd:11
- confirmed `flow-action` — action element type in the app flow schema — vendor/shopware/core/Framework/App/Flow/Schema/flow-1.0.xsd:31
