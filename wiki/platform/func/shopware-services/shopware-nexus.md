---
id: platform/func/shopware-services/shopware-nexus.md
title: Shopware Nexus
docType: functional
version: "6.5"
versions: ["6.5", "6.6", "6.7"]
sourceUrl: https://docs.shopware.com/en/shopware-6-en/shopware-services/shopware-nexus
sourceHash: e599bf571ec78d93f21252a58e7604a031066da900d16f9b31cda51c9f3d4f01
revision:
  current: true
  range: "current"
  swMax: null
  swMin: null
keywords: ["Shopware Nexus", "Nexus Ingestion Service", "visual automation", "workflow builder", "Shopware Event Trigger", "Schedule Trigger", "Business Central Connector", "Slack Notifications", "node canvas", "workflow status", "order.placed", "expression placeholders"]
summary: "Shopware Nexus is a visual, no-code workflow automation tool connecting Shopware events/schedules to external systems like ERP and Slack."
lastBuilt: "2026-09-15"
---
## What it is

Nexus is a visual automation tool that connects a Shopware shop with other systems (ERP systems, Slack, APIs) by building workflows on a canvas: drag-and-drop nodes are connected to react to shop events (e.g. a new order) or run on a schedule, without writing code.

## When to use

Use Nexus to automate routine tasks (e.g. Slack notification on order placement), integrate Shopware with external systems without code, and monitor workflow processing status.

## Key steps / config

Requirements: Shopware 6.7.1.0 or newer, an active Shopware account linked to an active company, administrator access to the shop.

Connect the shop:
- In the Shopware Administration, open **Settings > Shopware Services** and enable the **Shopware Nexus Event-Ingestion Service** toggle.
- Sign in to Nexus with the Shopware account; use the organisation switcher to pick the correct company.
- In the Shopware Administration go to **Settings > Nexus** and start the linking process.
- Verify by dragging a **Shopware Event Trigger** onto the canvas and checking the shop domain appears under Shopware Shops.

Node types: Trigger nodes (Shopware Event Trigger, Schedule Trigger/Cron); Action nodes (Business Central Connector CRUD, Shopware API Call, Send Slack Message, Send Shopware email, API request); Condition nodes (If); Output nodes (S3 storage); Control nodes (Delay).

Expressions: type `@` in a field to browse available properties from previous nodes, e.g. `payload.order.orderNumber`; use `{{ }}` to insert event data, e.g. `{{payload.order.orderNumber}}`.

Workflow status values: Draft (Save, Publish available), Published (Start available), Active (Revert available), Being deployed.

## Essential identifiers

- `Settings > Shopware Services` toggle: Shopware Nexus Event-Ingestion Service
- `Settings > Nexus`
- Trigger nodes: Shopware Event Trigger, Schedule Trigger
- Expression syntax: `{{ }}`, field example `payload.order.orderNumber`
- Example event: `order.placed`

## Gotchas

- The shop must both be assigned to the currently selected company and have the Nexus Ingestion Service enabled, or it will not appear as a trigger option.
- Authentication data for integrations (e.g. Slack, Business Central) is stored securely and encrypted, and is not visible even to the development team.
