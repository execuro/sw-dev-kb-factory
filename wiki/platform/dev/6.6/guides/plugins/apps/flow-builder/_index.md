---
id: platform/dev/6.6/guides/plugins/apps/flow-builder/_index.md
title: Flow Builder
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/apps/flow-builder/
sourceHash: 43ab9e63abddd1426d2cf3430d6914b223e662e4
keywords: ["Flow Builder", "flow actions", "custom flow action", "app", "manifest", "automation", "workflow", "flow builder workflow", "custom app", "extend flow builder", "flow action logic", "business automation"]
summary: "Apps can add custom flow actions to extend Flow Builder with app-defined automation logic and behavior."
lastBuilt: "2026-09-15"
---
## What it is

This page introduces extending Shopware's Flow Builder from an app by adding custom flow actions. Instead of relying only on the built-in actions, an app can define its own flow actions so store workflows can trigger app-specific logic.

## When to use

Use this when a plugin or app needs to react to Flow Builder triggers with custom behavior that is not covered by Shopware's default flow actions, for example to call an app's own logic as part of an automation process.

## Key steps / config

- Create a custom app.
- Define one or more custom flow actions inside the app so they become available as steps a merchant can select when building a flow.
- The custom flow action carries the app's own logic and behavior, which runs when the flow reaches that action during execution.

## Essential identifiers

- `Flow Builder` — the Shopware feature this page extends.
- Custom flow action — the app-defined unit of logic added to Flow Builder workflows.
