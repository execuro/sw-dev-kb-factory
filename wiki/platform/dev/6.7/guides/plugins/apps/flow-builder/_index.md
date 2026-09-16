---
id: platform/dev/6.7/guides/plugins/apps/flow-builder/_index.md
title: Flow Builder
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/apps/flow-builder/
sourceHash: 43ab9e63abddd1426d2cf3430d6914b223e662e4
codeCheckedAgainst: "6.7.13.0"
keywords: ["flow builder", "app flow extension", "custom flow action", "custom flow trigger", "flow.xml", "flow-extensions", "flow-actions", "flow-events", "flow-1.0.xsd", "automation", "webhook action", "app system"]
summary: Overview of extending the Flow Builder from an app with custom flow actions and triggers declared in Resources/flow.xml.
lastBuilt: 2026-09-15
---
## What it is

Section overview for app-based Flow Builder extensions. An app can add its own flow actions (and, per the sibling guides, custom triggers) so that merchants can build automation workflows in the Flow Builder that include app-defined logic and behaviour.

## When to use

Start here when an app (not a plugin) needs to contribute to Flow Builder workflows: calling an external service as a flow action, or offering an app-specific trigger that flows can react to.

## Key steps / config

The source page is only an introduction; the installed code shows where these extensions live:

- The app ships a file `Resources/flow.xml`; during app lifecycle handling Shopware checks for this path and parses actions and events from it.
- The file's root element is `<flow-extensions>`, validated against `Schema/flow-1.0.xsd` (in `Shopware\Core\Framework\App\Flow`), and may contain one `<flow-actions>` block and one `<flow-events>` block.

```xml
<flow-extensions>
    <flow-actions>
        <flow-action>...</flow-action>
    </flow-actions>
    <flow-events>
        <flow-event>...</flow-event>
    </flow-events>
</flow-extensions>
```

## Essential identifiers

- `Resources/flow.xml`
- `<flow-extensions>`, `<flow-actions>`, `<flow-events>`
- `flow-1.0.xsd`

## Code check (6.7.13.0)
- confirmed `flow-extensions` — root element of the flow schema — vendor/shopware/core/Framework/App/Flow/Schema/flow-1.0.xsd:3
- confirmed `flow-actions` — optional block inside flow-extensions — vendor/shopware/core/Framework/App/Flow/Schema/flow-1.0.xsd:11
- confirmed `flow-events` — optional block inside flow-extensions — vendor/shopware/core/Framework/App/Flow/Schema/flow-1.0.xsd:12
- confirmed `Resources/flow.xml` — file read for app flow actions — vendor/shopware/core/Framework/App/Lifecycle/Handler/FlowActionLifecycleHandler.php:83
- confirmed `Resources/flow.xml` — file read for app flow events — vendor/shopware/core/Framework/App/Lifecycle/Handler/FlowEventLifecycleHandler.php:91
- confirmed `flow-1.0.xsd` — schema used to parse flow actions — vendor/shopware/core/Framework/App/Flow/Action/Action.php:13
